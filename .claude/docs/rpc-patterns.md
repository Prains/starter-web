# RPC Patterns

Mirror of `.codex/docs/rpc-patterns.md`.

## Router structure

The starter keeps RPC code in `server/orpc/**` and exposes it through `server/routes/rpc/[...].ts`.

Reference layout:

- `server/orpc/context.ts`
- `server/orpc/base.ts`
- `server/orpc/router.ts`
- `server/orpc/routers/notes.ts`
- `server/routes/rpc/[...].ts`

## schema boundaries

Use generated Prisma Zod schemas at the RPC boundary whenever a CRUD procedure maps cleanly to Prisma operations.

Reference examples:

- `NoteFindManySchema`
- `NoteCreateOneSchema`
- `NoteUpdateOneSchema`
- `NoteDeleteOneSchema`

If the UI needs a form schema, keep that separate and handwritten, for example `shared/validation/note-form.ts`.

Do not leak raw Prisma model complexity into page components just because the RPC input type is broad.

## wrapper composables

UI code should usually talk to RPC through wrapper composables.

Reference files:

- `app/utils/orpc.ts`
- `app/composables/notes.ts`

Pattern:

- `app/utils/orpc.ts` creates the typed client and vue-colada helpers
- feature composables such as `useNotes()` or `useCreateNote()` wrap query and mutation behavior
- pages consume those wrapper composables instead of wiring every query and invalidation by hand

## Query invalidation

Mutations should invalidate the relevant list query through Pinia Colada.

For the starter notes module, `useCreateNote()`, `useUpdateNote()`, and `useDeleteNote()` all invalidate the notes list key after success.

## error handling

Use typed oRPC errors and keep the UI response predictable.

Starter error categories:

- `UNAUTHORIZED`
- `VALIDATION_ERROR`
- `INVALID_OR_EXPIRED_TOKEN`
- `NOT_FOUND`
- `INTERNAL_ERROR`

Rules:

- declare handler-level errors with `.errors({ ... })`
- prefer `throw errors.NOT_FOUND()` or `throw errors.UNAUTHORIZED()` over unstructured failures
- keep server messages short and user-safe
- in the UI, translate `UNAUTHORIZED` into a login redirect, keep `VALIDATION_ERROR` in place, and refetch after `NOT_FOUND` for the notes module
