# __APP_NAME__

Public Plancy starter template built on Nuxt 4, Better Auth, Prisma, oRPC, Pinia Colada, and Bun.

## env setup

Install dependencies and create your local env file:

```bash
bun install
cp .env.example .env
```

The default `.env.example` values are local-safe:

- `AUTH_EMAIL_MODE=log` prints auth links to the terminal
- `BETTER_AUTH_URL=http://localhost:3000` matches the default dev server
- `DATABASE_URL` points at a local PostgreSQL database you should replace with your real local DB name

## migrate + seed

Generate Prisma artifacts, run the local migration flow, and load the deterministic demo data:

```bash
bunx prisma generate
bunx prisma migrate dev
bunx prisma db seed
```

After that, start the app:

```bash
bun run dev
```

The app runs on `http://localhost:3000`.

## demo credentials

The starter seed creates a deterministic local demo account:

- email: `demo@example.com`
- password: `DemoPassword123!`

It also creates a small set of demo notes so the authenticated notes module is usable immediately after `migrate + seed`.

## auth email mode behavior

This starter supports two auth delivery modes:

- `AUTH_EMAIL_MODE=log`
  - verification, reset, and magic-link URLs are printed to the terminal
  - this is the recommended local development mode
- `AUTH_EMAIL_MODE=smtp`
  - Better Auth sends real emails through `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`
  - use this when you want real inbox delivery outside the local log workflow

Both modes still send users to the starter completion pages for verify/reset/magic-link flows.

## verification commands

```bash
bun run lint
bunx nuxi typecheck
bunx prisma generate
bunx prisma migrate dev
bunx prisma db seed
bunx vitest run
```
