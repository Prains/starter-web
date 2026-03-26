# __APP_NAME__

`__APP_NAME__` is the public Plancy full-stack starter for Nuxt 4.

It is built to be easy to start with, easy to scale, and easy to work with when you use AI coding tools and still want code that stays simple to review. The UI is intentionally minimal, but Prisma, Better Auth, and oRPC are already wired for real product work.

## Create A New App

The easiest way to start is with the CLI:

```bash
bun create plancy-app my-app
cd my-app
```

The CLI creates `.env` from `.env.example`, replaces the package/app name tokens, and initializes a git repository by default.

## Quick Start

Requirements:

- Bun
- A running PostgreSQL database

Then run:

```bash
bun install
# set DATABASE_URL in .env
bunx prisma migrate dev
bun run dev
```

Open `http://localhost:3000`.

If you are working in this template repository directly instead of a generated app, copy `.env.example` to `.env` first and then follow the same steps.

## What This Starter Gives You

- A Nuxt 4 app with a single starter page at `/`
- Prisma client, schema, and migrations already wired
- Better Auth server setup already wired
- oRPC server transport and typed client bootstrap already wired
- Safe local defaults for auth and email
- Established libraries on both the UI and backend side

The goal is not to ship a big demo app. The goal is to give you a clean full-stack foundation that is easy to extend.

## Project Map

Start here if you are new to the codebase:

- [`app/pages/index.vue`](app/pages/index.vue): the default starter page
- [`app/app.config.ts`](app/app.config.ts): app name and UI configuration
- [`app/utils/auth-client.ts`](app/utils/auth-client.ts): Better Auth client bootstrap
- [`app/utils/orpc.ts`](app/utils/orpc.ts): oRPC client bootstrap
- [`prisma/schema.prisma`](prisma/schema.prisma): your data model
- [`prisma/client.ts`](prisma/client.ts): Prisma client entrypoint
- [`server/api/auth/[...all].ts`](server/api/auth/%5B...all%5D.ts): Better Auth HTTP handler
- [`server/utils/auth.ts`](server/utils/auth.ts): Better Auth configuration
- [`server/routes/rpc/[...].ts`](server/routes/rpc/%5B...%5D.ts): `/rpc` endpoint
- [`server/orpc/router.ts`](server/orpc/router.ts): root oRPC router scaffold
- [`server/utils/env.ts`](server/utils/env.ts): environment contract
- [`.env.example`](.env.example): local environment defaults

If you only want to understand how the starter works, those files are enough.

## Local Environment

The starter ships with safe local defaults:

- `BETTER_AUTH_URL=http://localhost:3000`
- `AUTH_EMAIL_MODE=log`
- `BETTER_AUTH_SECRET` has a placeholder value for local development

You still need to set:

- `DATABASE_URL`

If you want real email delivery later, switch `AUTH_EMAIL_MODE` from `log` to SMTP and fill in the SMTP variables from `.env.example`.

## Recommended First Steps

After the app boots:

1. Replace the content in [`app/pages/index.vue`](app/pages/index.vue).
2. Update [`prisma/schema.prisma`](prisma/schema.prisma) for your domain.
3. Build your auth flows on top of the existing Better Auth server/client wiring.
4. Add your own oRPC procedures and expose them from [`server/orpc/router.ts`](server/orpc/router.ts).
5. Keep the public surface small while you shape your backend contract.

## Useful Scripts

Core development:

- `bun run dev`
- `bun run build`
- `bun run preview`
- `bun run lint`
- `bun run typecheck`
- `bun run prisma:generate`
- `bun run prisma:migrate:dev`

Verification:

- `bun run test`
- `bun run release:build-archive`
- `bun run release:verify-archive`

## Advanced / Optional

You can ignore this at first.

- [`starter.manifest.json`](starter.manifest.json) defines the contract used by `create-plancy-app`
- `release:build-archive` and `release:verify-archive` are for starter release packaging
- SMTP settings in `.env.example` are only needed if you want real email delivery

## How To Think About This Starter

This is not a demo CRUD app.

It is a full-stack foundation with:

- a minimal public starting surface
- a real database layer
- a real auth layer
- a real typed backend transport

The point is to make it easier to build performant, secure products on top of proven tools, while keeping the codebase understandable for both humans and AI.
