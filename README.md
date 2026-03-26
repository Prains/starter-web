# __APP_NAME__

Minimal public Plancy starter built on Nuxt 4.

The UI intentionally ships with a single page, `/`, built around `NuxtWelcome`. Behind that minimal surface, Prisma, Better Auth, and oRPC stay wired and ready for real work.

## Setup

```bash
bun install
```

Copy `.env.example` to `.env` if needed and set `DATABASE_URL`.

```bash
bunx prisma migrate dev
bun run dev
```

The starter uses safe local defaults for auth and email:

- `BETTER_AUTH_URL=http://localhost:3000`
- `AUTH_EMAIL_MODE=log`
- `BETTER_AUTH_SECRET` is stubbed for local development and should be replaced before production use

## What stays wired

- Prisma client and migrations
- Better Auth server handler and client utilities
- oRPC transport, context, and typed client bootstrap

## What is intentionally absent

- Auth pages
- Dashboard and product example routes
- Seed-driven demo content
- Sample domain procedures in the public RPC surface

## Production build

```bash
bun run build
bun run preview
```

Check the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) when you are ready to deploy.
