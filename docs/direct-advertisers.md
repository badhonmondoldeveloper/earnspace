# EarnSpace — Direct Advertiser Campaign Engine

## Workflow
1. Advertiser creates account & campaign creative (title, media URL, destination URL, CTA text, targeting rules).
2. Campaign is submitted to Admin review queue (`/admin/ads/campaigns`).
3. Admin approves, pauses, or rejects campaign with audit logging.
4. Active campaigns are prioritized by `SmartAdEngine` before external ad networks.
