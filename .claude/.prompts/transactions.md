# Новая функциональность - создать модуль транзакций

## Контекст
Проект: Nest.js + Next + PostgreSQL + Prisma
Что уже есть: User, авторизация JWT, модуль категорий + frontend авторизации

## Задача
Создай TransactionModule- центральный модуль приложения для учета доходов и расходов

## Модель данных
Добавь модель Transaction в schema.prisma
-id(string,uuid, @default(uuid())
-amount(Decimal)
-type(ENUM: INCOME, EXPENSE)
-description(string, nullable)
-date(DateTime)
-categoryId(string, связь с Category)
-userId(string, связь с User)
-createdAt(DateTime, @default(now())

Обнови модели User  и Category - добавь обратные связи transactions Transaction[]

После изменения схемы создай и примени миграцию: npx prisma migrate dev --name add-transactions

## Контроллер
Эндпоинты:

-POST /transactions: создать транзакцию
-GET /transactions: список с query параметрами dateFrom, dateTo, type, categoryId (по пользователю)
-GET /transactions/summary: агрегация, query параметры month и year(оба обязательные)
-GET /transactions/:id: одна транзакция
-PATCH /transactions/:id: обновить
-DELETE /transactions/:id: удалить

## Паттерн
Используй @backend/src/categories как образец структуры для backend

## Ограничения
- Не добавлять зависимости если не указано в задаче
- Используй class-validator для DTO
- После реализации собирай проект