# CLAUDE.md

## Repository shape

This repository is a minimal public Plancy starter:

- one public page at `/`
- `NuxtWelcome`-based UI shell
- live Prisma, Better Auth, and oRPC scaffolding
- no product dashboards or sample business modules in the public route surface

## Critical constraints

**Server Utils Auto-Import**: exports from `server/utils/*.ts` are Nuxt auto-imports. Do not import them manually.

**Pure Functions**: keep `server/utils/` pure unless a file is intentionally infrastructural, such as `auth.ts`, `email.ts`, `billing-service.ts`, `file-service.ts`, or `releases.ts`.

**Type Safety**:

- never use `any`
- prefer `Temporal` for new date logic
- import Prisma from `prisma/client.ts`

**Nuxt UI v4**:

- `:items`, not `:options`
- `value-key`, not `value-attribute`
- `label-key`, not `option-attribute`

## Expected workflow

Local bootstrap for generated apps should stay:

```bash
bun install
bunx prisma migrate dev
bun run dev
```

`.env.example` should require only `DATABASE_URL` editing for local startup. Auth and email defaults should remain safe for local development.

## Verification

```bash
bun run lint
bun run typecheck
bunx vitest run --project unit
bunx vitest run --project nuxt
```

If a test run touches shared Prisma state, run those suites sequentially.
