# План: JWT-авторизация для бэкенда с CQRS

## Context
Бэкенд NestJS не имеет системы аутентификации. Пользователь хранится в Prisma без поля пароля. Необходимо добавить регистрацию и логин через JWT, UserModule с репозиторием и CQRS-слоем, AuthModule с JWT-стратегией. Взаимодействие между модулями — через команды и запросы CQRS (`@nestjs/cqrs`).

---

## Шаг 1: Установка зависимостей

```bash
npm install @nestjs/jwt @nestjs/passport @nestjs/cqrs passport passport-jwt bcryptjs class-validator class-transformer --workspace @expense-tracker/backend
npm install --save-dev @types/passport-jwt @types/bcryptjs --workspace @expense-tracker/backend
```

---

## Шаг 2: Prisma schema — добавить поля пользователя

Файл: `backend/prisma/schema.prisma`

Добавить в модель `User` после поля `name`:
```prisma
passwordHash  String
refreshToken  String?   // scaffold для будущего refresh-токена
```

После изменения:
```bash
npm run db:migrate --workspace @expense-tracker/backend
```

---

## Шаг 3: Shared types

Файл: `packages/shared/src/index.ts` — добавить в конец:

```ts
export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}
```

---

## Шаг 4: Включить ValidationPipe в main.ts

Файл: `backend/src/main.ts`

Добавить после `NestFactory.create`:
```ts
import { ValidationPipe } from '@nestjs/common';
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

---

## Шаг 5: UserModule (CQRS-слой)

`UserModule` не экспортирует `UserService` напрямую. Вместо этого он регистрирует обработчики команд и запросов — `AuthModule` взаимодействует через `CommandBus` и `QueryBus`.

### Структура файлов

```
backend/src/user/
  commands/
    create-user.command.ts          # payload команды
    handlers/
      create-user.handler.ts        # CommandHandler
  queries/
    get-user-by-email.query.ts      # payload запроса
    get-user-by-id.query.ts
    handlers/
      get-user-by-email.handler.ts  # QueryHandler
      get-user-by-id.handler.ts
  user.repository.ts
  user.service.ts                   # внутренний сервис, используется только хендлерами
  user.module.ts
```

### Команды

`create-user.command.ts`:
```ts
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name?: string,
  ) {}
}
```

`create-user.handler.ts`:
```ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}
  async execute(command: CreateUserCommand): Promise<User>
}
```
Внутри — проверка дубля email (`ConflictException`), затем создание через `userService.create(...)`.

### Запросы

`get-user-by-email.query.ts`:
```ts
export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}
```

`get-user-by-id.query.ts`:
```ts
export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}
```

`get-user-by-email.handler.ts` / `get-user-by-id.handler.ts`:
```ts
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly userService: UserService) {}
  async execute(query: GetUserByEmailQuery): Promise<User | null>
}
```

### `user.repository.ts`
`@Injectable()` — тонкая обёртка над `PrismaService`.
Методы: `findByEmail(email)`, `findById(id)`, `create({ email, name?, passwordHash })`.

### `user.service.ts`
`@Injectable()` — внутренний сервис, вызывается только хендлерами.
Методы: `findByEmail`, `findById`, `create` (проксирует в репозиторий).

### `user.module.ts`
```ts
@Module({
  imports: [CqrsModule],
  providers: [
    UserRepository,
    UserService,
    CreateUserHandler,
    GetUserByEmailHandler,
    GetUserByIdHandler,
  ],
  // Ничего не экспортируем — взаимодействие только через CqrsModule
})
export class UserModule {}
```

---

## Шаг 6: AuthModule

`AuthService` не импортирует `UserService`. Вместо этого инжектирует `CommandBus` и `QueryBus` и взаимодействует с `UserModule` через них.

### `backend/src/auth/dto/register.dto.ts`
```ts
export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() @IsString() name?: string;
}
```

### `backend/src/auth/dto/login.dto.ts`
```ts
export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}
```

### `backend/src/auth/jwt.strategy.ts`
Расширяет `PassportStrategy(Strategy)` из `passport-jwt`.
- `jwtFromRequest`: `ExtractJwt.fromAuthHeaderAsBearerToken()`
- `secretOrKey`: `process.env.JWT_SECRET`
- `validate(payload)` возвращает `{ userId: payload.sub, email: payload.email }`

### `backend/src/auth/jwt-auth.guard.ts`
```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### `backend/src/auth/auth.service.ts`
Инжектирует `CommandBus`, `QueryBus` и `JwtService`.

```ts
async register(dto: RegisterDto): Promise<AuthResponseDto> {
  const passwordHash = await bcrypt.hash(dto.password, 10);
  const user = await this.commandBus.execute(
    new CreateUserCommand(dto.email, passwordHash, dto.name),
  );
  return { accessToken: this.generateToken(user), user: this.toUserDto(user) };
}

async login(dto: LoginDto): Promise<AuthResponseDto> {
  const user = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
  if (!user) throw new UnauthorizedException();
  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) throw new UnauthorizedException();
  return { accessToken: this.generateToken(user), user: this.toUserDto(user) };
}
```

- `generateToken(user)`: `jwtService.sign({ sub: user.id, email: user.email })`
- `toUserDto(user)`: маппинг в `UserDto` (без `passwordHash`, `refreshToken`)

### `backend/src/auth/auth.controller.ts`
```
POST /auth/register  →  authService.register(dto)
POST /auth/login     →  authService.login(dto)
```

### `backend/src/auth/auth.module.ts`
```ts
@Module({
  imports: [
    CqrsModule,          // даёт доступ к CommandBus и QueryBus
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
```

> Примечание: `CqrsModule` должен быть импортирован и в `UserModule`, и в `AuthModule`. Шина событий (`EventBus`) глобальная в рамках приложения — команды и запросы из `AuthModule` маршрутизируются к хендлерам `UserModule` автоматически.

---

## Шаг 7: Обновить AppModule

Файл: `backend/src/app.module.ts`

```ts
@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## Шаг 8: Переменные окружения

Файл: `backend/.env.example` — добавить:
```
JWT_SECRET="change-me-to-a-long-random-secret"
```
То же добавить в реальный `.env`.

---

## Схема взаимодействия модулей

```
AuthController
    │
    ▼
AuthService
  ├─ commandBus.execute(CreateUserCommand)  ──▶  CreateUserHandler (UserModule)
  └─ queryBus.execute(GetUserByEmailQuery)  ──▶  GetUserByEmailHandler (UserModule)
                                                          │
                                                    UserService
                                                          │
                                                   UserRepository
                                                          │
                                                    PrismaService (global)
```

---

## Порядок создания файлов
1. Установить пакеты
2. Shared types
3. Prisma schema + migrate
4. `user.repository.ts` → `user.service.ts`
5. Commands + Queries + их Handlers
6. `user.module.ts`
7. `auth/dto/*.ts` → `jwt.strategy.ts` → `jwt-auth.guard.ts` → `auth.service.ts` → `auth.controller.ts` → `auth.module.ts`
8. Обновить `main.ts` и `app.module.ts`

---

## Проверка

```bash
# Запустить бэкенд
npm run dev:api

# Регистрация
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123","name":"Test User"}'
# Ожидается: { accessToken: "...", user: { id, email, name, createdAt } }

# Логин
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
# Ожидается: { accessToken: "...", user: {...} }

# Дубль email → 409 Conflict
# Неверный пароль → 401 Unauthorized
# Невалидные данные → 400 Bad Request
```
