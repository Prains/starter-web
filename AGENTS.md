# AGENTS.md

Codex entrypoint for this starter. Read this file first, then use `.codex/docs/**` for the deeper rules that shape day-to-day implementation.

## starter overview

This repository is a public Plancy starter built on Nuxt 4, Better Auth, Prisma, oRPC, Pinia Colada, and Bun.

It intentionally keeps one small reference module, `notes`, to demonstrate the baseline patterns:

- authenticated routes and redirect-safe auth pages
- Prisma + generated Zod schemas at the RPC boundary
- composable wrappers around RPC access in the UI
- `useOverlay()` plus dedicated overlay composables for programmatic modals
- `UForm` plus Zod for form validation

## critical rules

- `server/utils/*.ts` are Nuxt auto-imports. Do not manually import them unless the file is explicitly designed for direct imports.
- Keep `server/utils/` pure by default. Database calls belong in RPC handlers, route handlers, Prisma helpers, or explicit exceptions such as `auth.ts` and `email.ts`.
- Import Prisma from `prisma/client.ts`.
- Keep the Prisma generator in `prisma/schema.prisma` on `engineType = "client"`.
- Use generated Prisma Zod schemas for RPC inputs where possible. Use small handwritten schemas only for UI form state like the note modal.
- In the UI, prefer wrapper composables such as `useNotes()`, `useCreateNote()`, `useUpdateNote()`, `useDeleteNote()` instead of calling RPC clients inline everywhere.
- Programmatic modals should go through `useOverlay()` via dedicated helpers in `app/composables/modals.ts`.
- Forms should use `UForm` plus Zod. Keep the submit button inside the form and close the modal only after a successful mutation.
- This starter uses Nuxt UI v4, not v3.
  - Use `:items`, not `:options`
  - Use `value-key`, not `value-attribute`
  - Use `label-key`, not `option-attribute`
- Keep files focused and file names in `kebab-case`.
- Avoid `any`.

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

- `.codex/docs/ui-patterns.md`
- `.codex/docs/vue-patterns.md`
- `.codex/docs/rpc-patterns.md`
- `.codex/docs/auth-patterns.md`
- `.codex/docs/prisma-patterns.md`

`CLAUDE.md` and `.claude/docs/**` mirror the same starter conventions for Claude-based tooling, but the Codex layer is the source of truth.
