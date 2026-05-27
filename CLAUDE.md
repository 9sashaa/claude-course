# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Dependencies are not yet installed. First run from the repo root:
```bash
npm install
npm run db:generate   # generate Prisma client after install
```

### Development
```bash
npm run dev          # start all workspaces in parallel
npm run dev:web      # frontend only (port 3000)
npm run dev:api      # backend only (port 3001)
```

### Build & lint
```bash
npm run build          # build all workspaces
npm run lint           # lint all workspaces
npm run format         # format all files with Prettier
npm run format:check   # check formatting without writing
```

### Database
```bash
docker compose up -d postgres          # start local Postgres
npm run db:generate                    # regenerate Prisma client after schema changes
npm run db:migrate                     # run migrations (dev)
npm run --workspace @expense-tracker/backend db:push     # push schema without migration
npm run --workspace @expense-tracker/backend db:studio   # open Prisma Studio
```

## Architecture

**npm workspaces monorepo** — no Turborepo or Nx, plain npm orchestration.

```
frontend/          Next.js 16, App Router, TypeScript  (@expense-tracker/frontend)
backend/           Nest.js 11, TypeScript               (@expense-tracker/backend)
packages/shared/   Common types/DTOs only               (@expense-tracker/shared)
```

### Data flow
`packages/shared` is the contract layer — `ExpenseDto`, `CreateExpenseInput`, `CategoryDto` are the canonical shapes crossing the API boundary. Both `frontend` and `backend` import from `@expense-tracker/shared`; never duplicate these types.

### Backend (Nest.js)
- `PrismaModule` is `@Global()` — registered once in `AppModule`, `PrismaService` is available for injection everywhere without re-importing the module.
- `PrismaService` extends `PrismaClient` directly and handles `$connect`/`$disconnect` via `OnModuleInit`/`OnModuleDestroy`.
- Prisma schema lives in `backend/prisma/schema.prisma`; generated client outputs to default location (`node_modules/.prisma`).
- `backend/tsconfig.json` overrides base: uses `CommonJS` + `emitDecoratorMetadata: true` (required by Nest decorators).

### Frontend (Next.js)
- App Router only — no `pages/` directory.
- `next.config.ts` sets `transpilePackages: ['@expense-tracker/shared']` so the shared package is compiled by Next's bundler.
- `frontend/tsconfig.json` uses `moduleResolution: Bundler` (Next.js requirement), overriding the base `NodeNext`.

### Shared tsconfig
`tsconfig.base.json` at repo root defines `strict`, `ES2022`, `NodeNext` defaults. Both apps extend it and selectively override — check each app's own `tsconfig.json` before assuming base settings apply.

### Environment
Copy `.env.example` → `.env` (root and in `backend/`, `frontend/` as needed).  
`DATABASE_URL` is read by Prisma at `backend/prisma/schema.prisma`. The docker-compose Postgres uses `postgres:postgres@localhost:5432/expense_tracker`.
