# Disaster Recovery

## Recovery objectives

Set and review an explicit RPO and RTO with the database, storage, and operations owners. This repository does not claim that backups or restore automation are active until they are configured and tested in the production providers.

## Recovery layers

1. **Database:** use managed PostgreSQL point-in-time recovery plus scheduled logical backups. Restore into an isolated environment before production recovery.
2. **Media:** retain object-storage versioning and a separate backup or replication policy for profile media, post media, video, reel, and Personal Space assets.
3. **Configuration:** keep Vercel environment variables, domain configuration, cron schedules, provider configuration, and deployment settings in a controlled operational record. Never put secrets in Git.
4. **Application:** deploy the last verified Git commit to staging, run Prisma validation and smoke tests, then promote to production.

## Recovery procedure

- Declare the incident and freeze high-risk operations when financial integrity is uncertain.
- Preserve audit logs, provider reports, database snapshots, and deployment identifiers.
- Restore a database snapshot to an isolated environment and verify users, wallets, ledger entries, withdrawals, ad attribution, and audit logs.
- Restore or reconnect media storage and validate access policies.
- Set environment variables and provider credentials from the controlled production configuration.
- Run `npx prisma validate`, `npx prisma generate`, `npx tsc --noEmit`, `npm test`, and `npm run build`.
- Reconcile financial totals against provider and payout reports before reopening withdrawals or revenue settlement.
- Record the incident, recovery point, data loss, corrective action, and follow-up owners.

Never reset a production database or rewrite financial history as a recovery shortcut. Use ledger reversal and reconciliation entries where correction is required.
