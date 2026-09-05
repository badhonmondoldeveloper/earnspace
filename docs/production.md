# Production Readiness

## Required checks

Run the following before deployment:

```bash
npx prisma validate
npx tsc --noEmit
npm run lint
npm test
npm run build
```

## Required environment

Set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, and `NEXT_PUBLIC_APP_URL` in the deployment environment. Secrets must be unique per environment and must never be committed to the repository.

## Deployment

The project is configured for Next.js on Vercel. A push to the configured GitHub branch can trigger a Vercel deployment, but deployment status and runtime health must be checked in the Vercel project dashboard. The application build generates the Prisma client and then runs `next build`.

## Known external dependencies

Email delivery, object storage/CDN, payment billing, OAuth providers, distributed rate limiting, and production monitoring require provider configuration. The codebase should not claim these integrations are live until credentials, callbacks, migrations, and a real end-to-end test are complete.

## Database safety

Do not reset a production database. Review Prisma schema changes, generate a migration, apply it in staging, verify rollback/backup procedures, and only then apply it to production. Financial records remain append-only and must be reconciled rather than silently rewritten.
