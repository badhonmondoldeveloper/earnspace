# EarnSpace Route Map

## Public routes

- `/`
- `/about`
- `/pricing`
- `/monetization-policy`
- `/referral-policy`
- `/withdrawal-policy`
- `/explore`
- `/reels`
- `/video/[id]`
- `/space/[username]`
- `/@username` via the dynamic `[username]` route
- `/blog/[slug]`
- `/forgot-password`
- `/reset-password`
- `/login`
- `/register`

## Authenticated routes

- `/dashboard`
- `/dashboard/blog`
- `/dashboard/earnings`
- `/dashboard/website`
- `/stories`
- `/messages`
- `/notifications`
- `/settings`
- `/creator`
- `/creator/analytics`
- `/creator/earnings`
- `/creator/monetization`
- `/creator/monetization/ads`
- `/wallet`
- `/wallet/payout-methods`
- `/withdrawals`
- `/referrals`
- `/campaigns`
- `/advertiser`

## Admin routes

- `/admin`
- `/admin/login`
- `/admin/users`
- `/admin/withdrawals`
- `/admin/payouts`
- `/admin/ads`
- `/admin/ads/placements`
- `/admin/ads/campaigns`
- `/admin/revenue/providers`
- `/admin/settings`
- `/admin/settings/maintenance`
- `/admin/audit-logs`
- `/admin/system-health`

## API route groups

- `/api/v1/auth/*`
- `/api/v1/admin/*`
- `/api/v1/posts/*`
- `/api/v1/profiles/*`
- `/api/v1/videos/*`
- `/api/v1/reels/*`
- `/api/v1/blogs/*`
- `/api/v1/messages`
- `/api/v1/notifications`
- `/api/v1/search`
- `/api/v1/creator/*`
- `/api/v1/wallet/*`
- `/api/v1/withdrawals`
- `/api/v1/ads/*`

## Reserved profile names

System paths such as `admin`, `api`, `dashboard`, `explore`, `login`, `register`, `settings`, `messages`, `notifications`, `creator`, `pricing`, `blog`, `help`, `support`, `search`, `about`, `contact`, `terms`, and `privacy` must not be claimed as usernames. Static routes should be created before relying on the dynamic profile route.
