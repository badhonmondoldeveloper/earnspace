# EarnSpace Disaster Recovery & Backup Strategy

## 1. Backup Schedule
- **Database Dump**: Automated daily full database backup (`pg_dump` or `mysqldump`) with 30-day retention.
- **Financial Ledger Verification Snapshots**: Hourly backup of `Wallet` and `WalletTransaction` tables to offsite encrypted storage.
- **Uploaded Media Storage**: Daily rsync / S3 bucket versioning.

---

## 2. Disaster Recovery Protocol
1. **Database Rollback**:
   ```bash
   pg_restore --dbname=earnspace_prod /backups/earnspace_daily_2026-09-05.dump
   ```
2. **Ledger Integrity Audit**:
   Execute `npx tsx tests/suite.test.ts` to confirm ledger transaction totals match wallet balances.
3. **Application Restore**:
   Pull latest stable release tag and restart Node process via PM2 (`pm2 restart earnspace`).

