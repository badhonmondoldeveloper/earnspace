# EarnSpace API Documentation (`v1`)

## Overview
All EarnSpace API endpoints reside under `/api/v1/*`. Requests and responses follow a standard JSON payload format.

### Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "errors": []
}
```

---

## Authentication Endpoints (`/api/v1/auth/*`)
- **`POST /api/v1/auth/register`**: Register new user account.
- **`POST /api/v1/auth/login`**: Authenticate user and issue HttpOnly JWT session cookie.
- **`POST /api/v1/auth/logout`**: Terminate active session and invalidate cookie.
- **`GET /api/v1/auth/me`**: Retrieve authenticated user profile.

---

## Admin Endpoints (`/api/v1/admin/*`)
All admin endpoints require an active `earnspace_admin_session` cookie and server-side RBAC validation.
- **`POST /api/v1/admin/auth/login`**: Admin login and RBAC token generation.
- **`GET /api/v1/admin/dashboard`**: Operations summary statistics.
- **`GET /api/v1/admin/users`**: List users with status filters.
- **`PATCH /api/v1/admin/users`**: Update user status or freeze financial wallet.
- **`GET /api/v1/admin/withdrawals`**: List withdrawal payout requests.
- **`PATCH /api/v1/admin/withdrawals`**: Approve or reject payout requests with automated transactional ledger reversal.
- **`GET /api/v1/admin/settings`**: Fetch platform settings.
- **`PATCH /api/v1/admin/settings`**: Update settings / Maintenance Mode toggle.
- **`GET /api/v1/admin/audit-logs`**: Immutable admin audit logs timeline.
- **`GET /api/v1/admin/system-health`**: Database latency and memory health monitor.

---

## Financial & Wallet Endpoints (`/api/v1/wallet/*`, `/api/v1/withdrawals/*`)
- **`GET /api/v1/wallet`**: Retrieve wallet balance and transaction ledger history.
- **`GET /api/v1/withdrawals`**: List user payout requests and withdrawal destinations.
- **`POST /api/v1/withdrawals`**: Create a new withdrawal payout request.

---

## Social & Content Endpoints (`/api/v1/posts/*`, `/api/v1/blogs/*`, `/api/v1/stories/*`)
- **`GET /api/v1/posts`**: Social feed post stream.
- **`POST /api/v1/posts`**: Publish new post.
- **`GET /api/v1/blogs`**: List long-form blogs.
- **`POST /api/v1/blogs`**: Publish article.
- **`GET /api/v1/stories`**: Retrieve 24-hour active stories.
- **`POST /api/v1/stories`**: Post a new story.

