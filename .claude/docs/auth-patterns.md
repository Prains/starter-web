# Auth Patterns

Mirror of `.codex/docs/auth-patterns.md`.

## Better Auth

This starter uses Better Auth for email/password, email verification, password reset, and magic-link flows.

Reference files:

- `server/utils/auth.ts`
- `app/utils/auth-client.ts`
- `server/api/auth/[...all].ts`
- `app/utils/auth-pages.ts`
- `shared/auth-routes.ts`

Core envs:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `AUTH_EMAIL_MODE`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## redirect rules

All auth redirects must be sanitized through `shared/auth-routes.ts`.

Reference functions:

- `sanitizeAppRedirect()`
- `buildLoginRedirect()`
- `buildVerifyPagePath()`
- `buildResetPagePath()`
- `buildMagicLinkPagePath()`

Rules:

- only allow `/app` and `/app/**` redirect targets
- fall back to `/app` when the target is missing or unsafe
- keep guest users on auth pages only when they do not already have a session
- redirect expired protected sessions to `/auth/login?redirect=<current-app-path>`

## Route protection

Use route middleware:

- `app/middleware/auth.ts` for authenticated pages
- `app/middleware/guest.ts` for login/register/reset/verify/magic-link pages

The current session is fetched through Better Auth, then reduced to redirect-safe page behavior.

## Auth email mode behavior

`AUTH_EMAIL_MODE=log` is the local-first default.

- auth links are printed to the terminal
- verification/reset/magic-link URLs are rewritten to starter completion pages

`AUTH_EMAIL_MODE=smtp` switches email delivery to the configured SMTP transport.

Rules:

- keep local development deterministic with `log` mode
- document both modes in README
- keep email handlers in `server/utils/email.ts`
