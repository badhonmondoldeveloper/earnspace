# EarnSpace — Background Cron & Job Architecture

## Scheduled Tasks
- `cleanupExpiredStories`: Deletes 24-hour expired stories (`Story.expiresAt < now`).
- `checkProviderHealth`: Checks ad provider latency and marks unhealthy providers as `degraded`.
- `auditCampaignBudgets`: Completes direct advertiser campaigns that reached budget or expiration.
- Triggered manually via `/api/v1/admin/system-health` (POST) or scheduled background service.
