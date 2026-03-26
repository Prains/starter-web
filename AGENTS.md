# AGENTS.md

Codex entrypoint for the public Plancy starter.

## What this repository is

- One user-facing page: `/`
- `NuxtWelcome`-based starter shell
- Live Prisma, Better Auth, and oRPC scaffolding
- No product routes, dashboards, or sample business modules in the public surface

## Working rules

1. Read this file first.
2. Treat `.codex/docs/**` as optional archived reference material for future build-out, not as the current starter contract.
3. `CLAUDE.md` and `.claude/**` stay in sync for Claude, but the codex layer is the primary entrypoint.

## Critical constraints

### Server utils auto-import

Exports from `server/utils/*.ts` are Nuxt auto-imports. Do not import them manually.

### `server/utils/` purity

Keep `server/utils/` as pure functions without `prisma.*` calls, except for files that are intentionally infrastructural:

- `auth.ts`
- `email.ts`
- `billing-service.ts`
- `file-service.ts`
- `releases.ts`

### Type safety

- Do not use `any`.
- Prefer `Temporal` over ad-hoc `Date` helpers when adding new date logic.
- Import Prisma directly from `prisma/client.ts` when needed.

### Current starter contract

- Keep the root page minimal.
- Keep Prisma, Better Auth, and oRPC genuinely wired.
- Do not add demo CRUD modules or hidden product routes back into the public starter.
- Default local bootstrap should remain:

```bash
bun install
bunx prisma migrate dev
bun run dev
```

## Verification

Run the relevant checks after changes:

```bash
bun run lint
bun run typecheck
bunx vitest run --project unit
bunx vitest run --project nuxt
```

Run database-sensitive suites sequentially if you touch shared Prisma state.
