# Expense Tracker

Fullstack-приложение для учёта личных финансов: категории доходов и расходов, транзакции, сводная статистика.

## Стек технологий

| Слой | Технологии |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, React Hook Form, Zod |
| **Backend** | Nest.js 11, TypeScript, Passport JWT, CQRS |
| **База данных** | PostgreSQL, Prisma ORM |
| **Инфраструктура** | Docker Compose, npm workspaces |

## Требования

- **Node.js** >= 20
- **Docker** и **Docker Compose** (для запуска PostgreSQL)
- **npm** >= 10

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd expense-tracker
```

### 2. Настроить переменные окружения

```bash
# Корень проекта (опционально, дублирует настройки воркспейсов)
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Поднять базу данных

```bash
docker compose up -d postgres
```

### 4. Установить зависимости и сгенерировать Prisma-клиент

```bash
npm install
npm run db:generate
```

### 5. Применить миграции

```bash
npm run db:migrate
```

### 6. Запустить приложение

```bash
# Запустить всё сразу (frontend + backend)
npm run dev

# Или по отдельности
npm run dev:api   # backend  → http://localhost:3001
npm run dev:web   # frontend → http://localhost:3000
```

## Переменные окружения

### `backend/.env`

| Переменная | Обязательная | Пример | Описание |
|---|---|---|---|
| `DATABASE_URL` | Да | `postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public` | Строка подключения к PostgreSQL |
| `API_PORT` | Нет | `3001` | Порт, на котором запускается API (по умолчанию 3001) |
| `JWT_SECRET` | Да | `change-me-to-a-long-random-secret` | Секрет для подписи JWT-токенов — замените на длинную случайную строку в production |

### `frontend/.env`

| Переменная | Обязательная | Пример | Описание |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Да | `http://localhost:3001` | Базовый URL бэкенда, доступный в браузере |

> **Production**: сгенерируйте `JWT_SECRET` командой `openssl rand -hex 64` и никогда не коммитьте реальные секреты.

## API

Базовый URL: `http://localhost:3001`

Все эндпоинты, кроме `/auth/*`, требуют заголовок:
```
Authorization: Bearer <access_token>
```

### Аутентификация

| Метод | Путь | Описание | Тело запроса |
|---|---|---|---|
| `POST` | `/auth/register` | Регистрация | `{ email, password, name? }` |
| `POST` | `/auth/login` | Вход | `{ email, password }` |

Оба эндпоинта возвращают `{ accessToken, refreshToken, user }`.

### Категории

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/categories` | Создать категорию |
| `GET` | `/categories` | Список категорий пользователя |
| `GET` | `/categories/:id` | Получить категорию по id |
| `PATCH` | `/categories/:id` | Обновить категорию |
| `DELETE` | `/categories/:id` | Удалить категорию |

### Транзакции

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/transactions` | Создать транзакцию |
| `GET` | `/transactions` | Список транзакций (с фильтрами через query-параметры) |
| `GET` | `/transactions/summary` | Сводка доходов/расходов за период |
| `GET` | `/transactions/:id` | Получить транзакцию по id |
| `PATCH` | `/transactions/:id` | Обновить транзакцию |
| `DELETE` | `/transactions/:id` | Удалить транзакцию |

### Системные

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/health` | Проверка работоспособности API |

## Структура проекта

```
expense-tracker/
├── frontend/                   # Next.js 16, App Router
│   ├── app/                    # Роуты (тонкие обёртки над фичами)
│   │   ├── (auth)/             # Страницы /login, /register
│   │   └── (dashboard)/        # Основной дашборд
│   └── src/
│       ├── features/           # Пользовательские сценарии
│       │   ├── auth/           # Регистрация, вход, контекст сессии
│       │   ├── categories/     # Управление категориями
│       │   ├── transactions/   # Управление транзакциями
│       │   ├── navigation/     # Навигация
│       │   └── user-profile/   # Профиль пользователя
│       ├── entities/           # Бизнес-сущности (User, Category, Transaction)
│       └── shared/             # Переиспользуемые UI-компоненты, api-клиент, утилиты
│
├── backend/                    # Nest.js 11
│   ├── prisma/
│   │   ├── schema.prisma       # Схема базы данных
│   │   └── migrations/         # История миграций
│   └── src/
│       ├── auth/               # JWT-аутентификация
│       ├── category/           # Модуль категорий (CQRS)
│       ├── transaction/        # Модуль транзакций (CQRS)
│       ├── user/               # Модуль пользователей
│       └── prisma/             # PrismaService (глобальный)
│
└── packages/
    └── shared/                 # Общие DTO и типы (граница API-контракта)
```

## Модели базы данных

```
User          — id, email, name, passwordHash, refreshToken
Category      — id, name, color, icon, userId
Transaction   — id, amount, type (INCOME | EXPENSE), description, date, categoryId, userId
```

## Полезные команды

```bash
# Линт
npm run lint

# Форматирование кода
npm run format

# Проверка форматирования без изменений
npm run format:check

# Prisma Studio (визуальный просмотр БД)
npm run --workspace @expense-tracker/backend db:studio

# Пересоздать Prisma-клиент после изменения схемы
npm run db:generate

# Сборка всех воркспейсов
npm run build
```