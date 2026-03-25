# CLAUDE.md

Claude entrypoint for this starter. Start here for the short rules, then use `.claude/docs/**` for the detailed conventions.

## starter overview

This repository is a public Plancy starter for Nuxt 4 applications with Better Auth, Prisma, oRPC, Pinia Colada, and Bun.

The starter keeps a single `notes` reference module to teach the baseline application flow:

- auth and redirect-safe route protection
- typed RPC wrappers
- overlay-driven modals
- `UForm` plus Zod validation
- Prisma-backed CRUD with generated schemas

## critical rules

- Treat `server/utils/*.ts` as Nuxt auto-imports unless a file is intentionally imported directly.
- Keep `server/utils/` pure by default. Put `prisma.*` calls in RPC handlers, API routes, Prisma helpers, or explicit exceptions like `auth.ts` and `email.ts`.
- Import Prisma from `prisma/client.ts`.
- Keep Prisma configured with `engineType = "client"` in `prisma/schema.prisma`.
- Use generated Prisma Zod schemas at the RPC boundary and small handwritten schemas for form state only.
- Prefer wrapper composables around RPC access in the UI.
- Open programmatic modals through `useOverlay()` and dedicated helpers from `app/composables/modals.ts`.
- Use `UForm` plus Zod for forms. Submit actions stay inside the form; modals close only after success.
- This starter uses Nuxt UI v4.
  - `:items`, not `:options`
  - `value-key`, not `value-attribute`
  - `label-key`, not `option-attribute`
- Keep files focused, use `kebab-case`, and avoid `any`.

## verification commands

```bash
bun install
bun run lint
bunx nuxi typecheck
bunx prisma generate
bunx prisma migrate dev
bunx prisma db seed
bunx vitest run
```

## deeper docs

- `.claude/docs/ui-patterns.md`
- `.claude/docs/vue-patterns.md`
- `.claude/docs/rpc-patterns.md`
- `.claude/docs/auth-patterns.md`
- `.claude/docs/prisma-patterns.md`

The canonical source remains `.codex/docs/**`. Keep the Claude docs mirrored to those conventions rather than inventing separate starter rules.
