# EarnSpace Background Cron & Settlement Engine

## Overview
`CronJobsService` manages periodic automated platform processes including story expiration, post scheduling, and pending earnings settlement.

---

## Registered Background Tasks
1. **Story Expiration Cleanup**: Purges stories past their 24-hour lifetime (`expiresAt < NOW()`).
2. **Scheduled Post & Blog Publishing**: Transitions scheduled content from `scheduled` to `published`.
3. **Pending Earning Settlement**: Auto-approves `pending` creator earnings once `pendingUntil` date is reached and records verified wallet ledger transactions.
4. **Subscription Expiration Sweep**: Transitions expired active subscriptions to `expired` status.

---

## Execution Configuration
In production environments (Node.js/cPanel/Vercel Cron), schedule `CronJobsService` runner via a system crontab or cron job endpoint:

```bash
# Execute settlement and cleanup sweep every 5 minutes
*/5 * * * * cd /home/user/earnspace && npx tsx -e "import { CronJobsService } from './src/services/cronJobsService'; CronJobsService.runAll();" >> /var/log/earnspace-cron.log 2>&1
```

