# Authentication

## Current flow

EarnSpace uses an HTTP-only `earnspace_session` cookie containing a signed JWT. The JWT includes a database session id. The corresponding `UserSession` row stores only a SHA-256 hash of the cookie token, an expiry, request IP, and user agent.

Every server-side `getSession()` call verifies both the JWT and the database session. Deleting a session row therefore invalidates the cookie before JWT expiry. Logout removes the current row and clears the cookie. Password changes and password resets remove all sessions for the user.

Admin authentication uses a separate `earnspace_admin_session` cookie and requires `ADMIN_JWT_SECRET`.

## Security rules

- `JWT_SECRET` and `ADMIN_JWT_SECRET` are required in every deployed environment; there are no source-controlled fallback secrets.
- Passwords are hashed with bcrypt and are never returned in API responses.
- Reset tokens are random, expire after one hour, are single-use, and only their SHA-256 hashes are stored.
- Login, registration, forgot-password, and reset-password endpoints have rate limits.
- Forgot-password responses are neutral and do not disclose whether an email exists.
- Tokens, passwords, and secrets must not be logged.

## Session management

`GET /api/v1/auth/sessions` lists active sessions without exposing tokens. `DELETE /api/v1/auth/sessions` logs out all other sessions while preserving the current device. `POST /api/v1/auth/logout` invalidates the current session.

## External configuration

Password reset and email verification require an email delivery provider. The reset-token lifecycle is implemented, but email delivery must be connected and tested before the flow can be called production-complete. Authentication secrets must be set in Vercel project environment variables for each deployment environment.

## Remaining work

Email verification route/UI, onboarding completion, distributed rate limiting, login audit events, OAuth account linking, and 2FA/passkeys remain separate roadmap items. They must not be represented as active features until implemented and tested.
