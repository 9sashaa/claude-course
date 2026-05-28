# План: модуль категорий трат

## Context
JWT-авторизация уже реализована (последний коммит `bc2fc37`). Следующий шаг — добавить пользовательские категории трат как самостоятельный модуль. Категория принадлежит пользователю и описывается именем, цветом и иконкой. Нужен полный CRUD через REST endpoint'ы, защищённые `JwtAuthGuard`, с валидацией через `class-validator`. Архитектурно модуль повторяет стиль `UserModule`: CQRS (commands/queries/handlers) + репозиторий поверх `PrismaService`.

---

## Чеклист реализации

- [ ] **Шаг 1.** Обновить `backend/prisma/schema.prisma` — расширить `Category` (name, color, icon, userId, createdAt, updatedAt, `@@unique([userId, name])`, `@@index([userId])`), добавить обратную связь `categories Category[]` в `User`.
- [ ] **Шаг 2.** Применить схему: `npm run --workspace @expense-tracker/backend db:push` + `npm run db:generate`.
- [ ] **Шаг 3.** Обновить `packages/shared/src/index.ts` — расширить `CategoryDto`, добавить `CreateCategoryInput`, `UpdateCategoryInput`.
- [ ] **Шаг 4.** Создать `backend/src/category/dto/create-category.dto.ts` с валидаторами: `name` (`@IsString @MinLength(1) @MaxLength(50)`), `color` (`@Matches(/^#[0-9A-Fa-f]{6}$/)`), `icon` (`@IsString @MaxLength(50)`).
- [ ] **Шаг 5.** Создать `backend/src/category/dto/update-category.dto.ts` — все поля с `@IsOptional()` (без `PartialType`, по стилю `auth/dto`).
- [ ] **Шаг 6.** Создать `CategoryRepository` (`category.repository.ts`) над `PrismaService`: `create`, `findManyByUserId`, `findByIdAndUserId`, `updateByIdAndUserId`, `deleteByIdAndUserId` — все операции с фильтром по `userId`.
- [ ] **Шаг 7.** Команды и handlers: `CreateCategoryCommand` + handler, `UpdateCategoryCommand` + handler, `DeleteCategoryCommand` + handler. На промах по id → `NotFoundException`, на Prisma `P2002` → `ConflictException`.
- [ ] **Шаг 8.** Запросы и handlers: `GetCategoriesByUserQuery` + handler, `GetCategoryByIdQuery` + handler.
- [ ] **Шаг 9.** Создать `CategoryService` — фасад над `CommandBus`/`QueryBus` (аналог `AuthService`), маппинг Prisma-сущности в `CategoryDto` (Date → ISO string).
- [ ] **Шаг 10.** Создать `CategoryController` на пути `categories`, под `@UseGuards(JwtAuthGuard)` целиком. Endpoints: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id` (204). `userId` берётся из `req.user.userId` через `@Req()`.
- [ ] **Шаг 11.** `CategoryModule` (`imports: [CqrsModule]`, провайдеры: service, repository, все handler'ы). Зарегистрировать в `AppModule` рядом с `AuthModule`/`UserModule`.
- [ ] **Шаг 12.** Проверка: `npm run build` и `npm run lint` чистые.
- [ ] **Шаг 13.** Ручная проверка через curl — см. секцию Verification.

---

## Изменения схемы Prisma
Файл: `backend/prisma/schema.prisma`

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String
  color     String
  icon      String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  expenses  Expense[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, name])
  @@index([userId])
}
```
В `User` добавить: `categories Category[]`.

---

## Shared DTO
Файл: `packages/shared/src/index.ts`

```ts
export interface CategoryDto {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput { name: string; color: string; icon: string; }
export interface UpdateCategoryInput { name?: string; color?: string; icon?: string; }
```

---

## Структура модуля `backend/src/category/`
```
category/
  category.module.ts
  category.controller.ts
  category.service.ts
  category.repository.ts
  dto/
    create-category.dto.ts
    update-category.dto.ts
  commands/
    create-category.command.ts
    update-category.command.ts
    delete-category.command.ts
    handlers/
      create-category.handler.ts
      update-category.handler.ts
      delete-category.handler.ts
  queries/
    get-categories-by-user.query.ts
    get-category-by-id.query.ts
    handlers/
      get-categories-by-user.handler.ts
      get-category-by-id.handler.ts
```

Глобальный `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` из `main.ts` уже применит правила DTO. `PrismaModule` уже `@Global()`.

---

## Verification
1. `npm run db:generate && npm run --workspace @expense-tracker/backend db:push` — схема применяется.
2. `npm run build` и `npm run lint` — чистые.
3. `npm run dev:api`, далее через curl/Postman:
   - `POST /auth/login` → получить `accessToken`.
   - `POST /categories` с валидным телом → 201, в DTO правильный `userId`.
   - Повтор с тем же `name` → 409.
   - Невалидный `color` (`"red"`) → 400 от ValidationPipe.
   - `GET /categories` → массив только текущего пользователя (проверить вторым юзером, что чужие не видны).
   - `PATCH /categories/:id` чужой записи → 404.
   - `DELETE /categories/:id` → 204, повторный `GET` пуст.
4. Без `Authorization` заголовка любой endpoint → 401 от `JwtAuthGuard`.
