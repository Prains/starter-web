# Prisma Patterns

Mirror of `.codex/docs/prisma-patterns.md`.

## prisma/client.ts

Import Prisma from `prisma/client.ts`.

```ts
import { prisma } from "~~/prisma/client";
```

Do not create ad-hoc Prisma clients in page code, UI composables, or random utility modules.

## engineType = "client"

Keep the Prisma client generator in `prisma/schema.prisma` on `engineType = "client"`.

```prisma
generator client {
  provider   = "prisma-client"
  output     = "./generated/client"
  engineType = "client"
}
```

This starter expects the generated client to live in `prisma/generated/client`.

## Generator usage

When the Prisma schema changes:

1. run `bunx prisma generate`
2. review the generated client and Zod schemas
3. update RPC boundaries if new models or fields need to be exposed

The starter also uses `prisma-zod-generator` for RPC schema generation.

## Seed and local workflow

Reference files:

- `prisma/schema.prisma`
- `prisma/client.ts`
- `prisma/seed.ts`

Rules:

- migrations use PostgreSQL
- local verification can run `bunx prisma migrate dev`
- deterministic demos can run `bunx prisma db seed`
- the seed creates `demo@example.com` and starter notes for local verification

## Server boundaries

Prisma access belongs in:

- `prisma/client.ts`
- `prisma/seed.ts`
- RPC handlers
- API route handlers
- explicit server-side integration files such as auth/email when required

Avoid putting `prisma.*` calls into otherwise pure helpers.
