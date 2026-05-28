# План: модуль Transaction

## Контекст

Сейчас в backend есть модули `User`, `Auth` (JWT), `Category` (CQRS + repository, защищён `JwtAuthGuard`). Существующая модель `Expense` в `schema.prisma` не используется в коде и заменяется на полноценную модель `Transaction`, покрывающую и доходы, и расходы. Цель — реализовать центральный модуль учёта операций с тем же набором паттернов: CQRS, repository, multi-tenant изоляция по `userId`, валидация через `class-validator`, защита через `JwtAuthGuard`. Шаблоном служит существующий `backend/src/category/`.

## Решения, согласованные с пользователем

- **Expense удаляется**: модель `Expense`, обратные связи `User.expenses`/`Category.expenses` и типы `ExpenseDto`/`CreateExpenseInput` из shared удаляются (БД пустая, модуля Expense не было).
- **ID** для Transaction: `@default(cuid())` — единообразно с `User`/`Category` (не `uuid()`, как в задаче).
- Прочие поля модели — как в задаче.

## 1. Prisma schema (`backend/prisma/schema.prisma`)

Добавить enum и модель:

```prisma
enum TransactionType {
  INCOME
  EXPENSE
}

model Transaction {
  id          String          @id @default(cuid())
  amount      Decimal         @db.Decimal(12, 2)
  type        TransactionType
  description String?
  date        DateTime
  category    Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  categoryId  String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  createdAt   DateTime        @default(now())

  @@index([userId])
  @@index([categoryId])
  @@index([userId, date])
}
```

Обновить:
- В `User`: убрать `expenses Expense[]`, добавить `transactions Transaction[]`.
- В `Category`: убрать `expenses Expense[]`, добавить `transactions Transaction[]`. Связь Transaction→Category — `Restrict` (нельзя удалить категорию с операциями; в Category удалении это всплывёт ошибкой Prisma — приемлемо для базовой реализации).
- Удалить целиком модель `Expense`.

Применить миграцию:
```
npm run --workspace @expense-tracker/backend exec -- npx prisma migrate dev --name add-transactions
npm run db:generate
```

## 2. Shared контракты (`packages/shared/src/index.ts`)

Удалить `ExpenseDto`, `CreateExpenseInput`. Добавить:

```ts
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionDto {
  id: string;
  amount: number;            // Decimal сериализуется через .toNumber() в маппере
  type: TransactionType;
  description: string | null;
  date: string;              // ISO
  categoryId: string;
  userId: string;
  createdAt: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  categoryId: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  description?: string | null;
  date?: string;
  categoryId?: string;
}

export interface TransactionListQuery {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionSummaryDto {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  net: number;               // income - expense
  byCategory: Array<{
    categoryId: string;
    type: TransactionType;
    total: number;
  }>;
}
```

## 3. Backend module (`backend/src/transaction/`)

Структура зеркалит `backend/src/category/` (см. `category.module.ts`, `category.controller.ts`, `category.service.ts`, `category.repository.ts` как образец):

```
transaction/
├── transaction.module.ts        — imports CqrsModule, регистрирует controller/service/repository + все handlers
├── transaction.controller.ts    — @UseGuards(JwtAuthGuard), эндпоинты ниже
├── transaction.service.ts       — CommandBus/QueryBus dispatch + маппер Transaction → TransactionDto
├── transaction.repository.ts    — конструкторно инжектит PrismaService; все методы фильтруют по userId
├── dto/
│   ├── create-transaction.dto.ts
│   ├── update-transaction.dto.ts
│   ├── list-transactions.query.dto.ts   — для @Query() параметров GET /transactions
│   └── transaction-summary.query.dto.ts — для GET /transactions/summary
├── commands/
│   ├── create-transaction.command.ts
│   ├── update-transaction.command.ts
│   ├── delete-transaction.command.ts
│   └── handlers/{create,update,delete}-transaction.handler.ts
└── queries/
    ├── list-transactions.query.ts
    ├── get-transaction-by-id.query.ts
    ├── get-transaction-summary.query.ts
    └── handlers/{list-transactions,get-transaction-by-id,get-transaction-summary}.handler.ts
```

### Controller — эндпоинты

```
@UseGuards(JwtAuthGuard)
@Controller('transactions')
```

| Метод | Путь | Описание |
| --- | --- | --- |
| POST | `/transactions` | создать (body: `CreateTransactionDto`) |
| GET | `/transactions` | список с `@Query()`: `dateFrom`, `dateTo`, `type`, `categoryId` (опц.) |
| GET | `/transactions/summary` | агрегация, `@Query()`: `month`, `year` (оба обязательны) |
| GET | `/transactions/:id` | одна транзакция |
| PATCH | `/transactions/:id` | обновить (`UpdateTransactionDto`) |
| DELETE | `/transactions/:id` | удалить, `@HttpCode(204)` |

Важно: маршрут `summary` должен идти **до** `:id`, иначе Nest попытается матчить `summary` как `id`.

`userId` берётся из `req.user.userId` (см. `jwt.strategy.ts:validate` → возвращает `{ userId, email }`).

### DTO (class-validator) — пример полей

`CreateTransactionDto`:
- `amount: number` — `@IsNumber({ maxDecimalPlaces: 2 })`, `@IsPositive()`
- `type: TransactionType` — `@IsEnum(['INCOME','EXPENSE'])`
- `description?: string` — `@IsOptional() @IsString() @MaxLength(500)`
- `date: string` — `@IsDateString()`
- `categoryId: string` — `@IsString() @IsNotEmpty()`

`UpdateTransactionDto`: те же поля, все опциональны (`@IsOptional()` ко всем).

`ListTransactionsQueryDto`: все четыре поля опциональны (`@IsOptional()` + соответствующие валидаторы; для query-параметров — обычные `class-transformer` декораторы уже работают через ValidationPipe в `main.ts`, проверить что `transform: true`).

`TransactionSummaryQueryDto`: `@Type(() => Number) @IsInt() @Min(1) @Max(12) month`, аналогично year (`@Min(2000)`).

### Repository — методы

```ts
@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {...}): Promise<Transaction>;
  findManyByUser(userId: string, filters: { dateFrom?: Date; dateTo?: Date; type?: TransactionType; categoryId?: string }): Promise<Transaction[]>;
  findByIdAndUser(id: string, userId: string): Promise<Transaction | null>;
  update(id: string, userId: string, data: Partial<...>): Promise<Transaction>;
  deleteByIdAndUser(id: string, userId: string): Promise<void>;
  aggregateMonth(userId: string, month: number, year: number): Promise<{...}>;  // groupBy { type, categoryId } + суммы
}
```

`aggregateMonth` использует `prisma.transaction.groupBy({ by: ['type', 'categoryId'], where: { userId, date: { gte, lt } }, _sum: { amount: true } })` и возвращает массив для маппинга в `TransactionSummaryDto`. Сервис на основе этого строит `totalIncome`/`totalExpense`/`net`/`byCategory`.

### Сервис — обработка ошибок и маппинг

- Все Decimal-значения мапить через `.toNumber()` (как в categories пока нет, но шаблон такой). Если `.toNumber` теряет точность, использовать `Number(d.toString())` — для финансов в рамках задачи приемлемо.
- При `findOne`/`update`/`delete` если репозиторий вернул `null` → `NotFoundException`.
- При нарушении FK на категорию (Prisma `P2003`) → `BadRequestException('Category not found')`.
- Перед `create`/`update` проверять, что `categoryId` принадлежит тому же `userId` (через `categoryRepository` либо прямо в репозитории Transaction — один запрос). Это надёжнее, чем полагаться только на FK, потому что FK-ошибка не отличает «нет категории» от «чужая категория».

### Handlers — структура

Каждый handler конструкторно инжектит `TransactionRepository`, реализует `ICommandHandler` / `IQueryHandler`. Декораторы `@CommandHandler(Cmd)` / `@QueryHandler(Q)`. Регистрация в `TransactionModule.providers` — как в `category.module.ts:6-15`.

## 4. Регистрация модуля

В `backend/src/app.module.ts` добавить `TransactionModule` в `imports` (рядом с `CategoryModule`).

## 5. Удаление Expense-артефактов

- В `packages/shared/src/index.ts` удалить `ExpenseDto`, `CreateExpenseInput`.
- Поиском убедиться, что `Expense` не импортируется из других мест (на текущий момент — нет; frontend использует только Category/Auth).

## 6. Сборка и проверка

```
npm install                                                              # на случай новых deps (не должно быть)
npm run --workspace @expense-tracker/backend db:generate                  # после миграции
npm run build --workspace @expense-tracker/shared
npm run build --workspace @expense-tracker/backend
npm run build --workspace @expense-tracker/frontend                       # shared изменился → проверить
```

### Проверка end-to-end (вручную)

1. `docker compose up -d postgres`, применить миграцию.
2. `npm run dev:api`.
3. Зарегистрировать пользователя через `POST /auth/register`, получить `accessToken`.
4. Создать категорию: `POST /categories` с Bearer-токеном.
5. `POST /transactions` с валидным `categoryId` — ожидается 201, объект `TransactionDto`.
6. `POST /transactions` с чужим `categoryId` — ожидается 400/404.
7. `GET /transactions?type=EXPENSE&dateFrom=2026-01-01` — фильтрация работает.
8. `GET /transactions/summary?month=5&year=2026` — `totalIncome`, `totalExpense`, `byCategory`.
9. `PATCH /transactions/:id`, `DELETE /transactions/:id` — стандартный CRUD.
10. Запросы без Bearer-токена → 401.
11. Запрос чужой транзакции с валидным токеном другого пользователя → 404 (multi-tenant изоляция).

## Затронутые файлы

- **Изменить**: `backend/prisma/schema.prisma`, `backend/src/app.module.ts`, `packages/shared/src/index.ts`.
- **Создать**: всё дерево `backend/src/transaction/` (~17 файлов, см. структуру выше).
- **Создать**: новая Prisma-миграция в `backend/prisma/migrations/<timestamp>_add_transactions/`.
