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
- UI components come from **shadcn/ui** (new-york style) with **Tailwind CSS v4**. Components live in `frontend/src/shared/ui/` and are written manually (not generated via CLI). Theme CSS variables are defined in `frontend/app/globals.css`.

#### Feature Slice Design (FSD)
The frontend follows FSD architecture. Source code lives in `frontend/src/` with these layers (top → bottom dependency direction):

```
app/              Next.js routing — thin page wrappers only, no business logic
src/
  features/       User-facing capabilities, each in its own slice
    auth/
      api/        API calls (authApi.ts)
      model/      State/context (authContext.tsx)
      ui/         React components (LoginForm, RegisterForm)
      index.ts    Public API of the slice — import only from here
  entities/       Business entities re-exported from @expense-tracker/shared
    user/
  shared/         Framework-agnostic reusable code
    ui/           shadcn/ui components (button, input, card, form, label)
    api/          Base fetch client (apiClient.ts)
    config/       Constants (routes.ts)
    lib/          Utilities (utils.ts → cn())
```

**FSD rules:**
- Layers may only import from layers below them: `features` → `entities` → `shared`.
- Cross-slice imports within the same layer are forbidden — use `shared` instead.
- Each slice exposes a single `index.ts` public API; never import from internal paths of another slice.
- `app/` route files import from `features/` only — they are thin composition roots.

## Commit convention

This project uses **Conventional Commits**: `<type>(<scope>): <description>`

| Type | When to use |
| --- | --- |
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `refactor` | Refactoring without behaviour change |
| `chore` | Tooling, deps, config, migrations |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |

**Rules:**
- Scope is optional but recommended for cross-cutting changes: `feat(auth):`, `fix(transactions):`.
- Description in lowercase, imperative mood, no period: `feat: add transaction summary endpoint`.
- One logical change per commit — don't mix features and fixes.
- Group related files into one commit (e.g. schema + migration + module handler = one `feat` commit).

### Shared tsconfig
`tsconfig.base.json` at repo root defines `strict`, `ES2022`, `NodeNext` defaults. Both apps extend it and selectively override — check each app's own `tsconfig.json` before assuming base settings apply.

### Environment
Copy `.env.example` → `.env` (root and in `backend/`, `frontend/` as needed).  
`DATABASE_URL` is read by Prisma at `backend/prisma/schema.prisma`. The docker-compose Postgres uses `postgres:postgres@localhost:5432/expense_tracker`.
