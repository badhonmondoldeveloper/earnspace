# 🚀 EarnSpace — Master Commercial Social & Monetization Platform

EarnSpace is a commercial-grade social platform, creator mini-site builder, business monetization engine, and administrative operations center.

---

## 🌟 Key Features

### 1. User & Creator Social Platform (Part 1)
- **User Authentication**: Secure JWT HttpOnly session management, registration, login, profile management.
- **Creator Website Builder**: Drag-and-drop page block builder (`/dashboard/website`), public mini-sites (`/space/[username]`), custom themes, sections (Bio, Links, Products, Posts, Contact).
- **Social Feed & Content**: Posts (`text`, `image`, `video`), comments, replies, reactions, 24h stories (`Story`), long-form blogs (`/dashboard/blog`).
- **Interactive Social**: Follow/unfollow, direct messaging (`/messages`), notification center (`/notifications`).

### 2. Monetization & Business Engine (Part 2)
- **Double-Entry Financial Ledger**: Append-only transactional ledger (`Wallet`, `WalletTransaction`) with decimal precision and idempotency key checks.
- **Revenue Split Engine**: Versioned rule resolution (`userShare` % + `platformShare` % = 100%), verified signature checking, settlement holds.
- **Withdrawals Center**: Multi-channel payout requests (bKash, Nagad, Bank transfer) with fund reservation and transactional reversal restoration upon rejection.
- **Growth & Marketing Modules**: Referral link generator (`/referrals`), Campaign Marketplace (`/campaigns`), Self-Serve Advertiser Portal (`/advertiser`), Subscriptions tier gating (`/pricing`).

### 3. Advanced Admin & Security Control Center (Part 3)
- **Admin Auth & RBAC**: Dedicated JWT cookie (`earnspace_admin_session`), permission maps (`super_admin`, `moderator`, `finance_admin`, `support`).
- **Operations Control Center**: Real-time aggregated platform stats (`/admin`), user management & wallet freezing (`/admin/users`), withdrawal review hub (`/admin/withdrawals`), dynamic platform settings & maintenance mode (`/admin/settings`), immutable audit log timeline (`/admin/audit-logs`), system health monitor (`/admin/system-health`).

---

## 🛠️ Quick Start & Local Execution

Copy `.env.example` to `.env` and set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`,
`ADMIN_JWT_SECRET`, and `NEXT_PUBLIC_APP_URL` before starting the application.
Authentication fails closed when either JWT secret is missing.

### 1. Installation
```bash
git clone https://github.com/earnspace/earnspace.git
cd earnspace
npm install
```

### 2. Database Setup & Client Generation
```bash
npx prisma generate
npx prisma db push
```

### 3. Run Development Server
```bash
npm run dev
# Application will be accessible at http://localhost:3000
```

### 4. Run Automated Test Suite
```bash
npm test
# Runs complete 18-point QA test suite covering Auth, RBAC, File Security, Financial Ledger, Referrals, and Admin Audit Logging.
```

### 5. Execute Production Build
```bash
npm run build
```

---

## 📚 Technical Documentation Index
- [`docs/final-system-audit.md`](docs/final-system-audit.md) — Comprehensive Phase 1 Audit Report.
- [`docs/architecture.md`](docs/architecture.md) — System Architecture Overview.
- [`docs/api.md`](docs/api.md) — Complete API v1 Route Reference.
- [`docs/security.md`](docs/security.md) — Security Hardening & RBAC Policies.
- [`docs/financial-system.md`](docs/financial-system.md) — Double-Entry Financial Ledger & Revenue Engine.
- [`docs/admin-system.md`](docs/admin-system.md) — Operations Control Center & Audit Trails.
- [`docs/cron-jobs.md`](docs/cron-jobs.md) — Settlement Cron Jobs & Background Tasks.
- [`docs/database-production.md`](docs/database-production.md) — Production Database & Indexing Strategy.
- [`docs/backup-recovery.md`](docs/backup-recovery.md) — Backup Schedules & Disaster Recovery.
- [`docs/deployment.md`](docs/deployment.md) — Production Deployment (Vercel & cPanel/Node).
- [`docs/authentication.md`](docs/authentication.md) — Session security, password reset, and auth limitations.
- [`docs/user-onboarding.md`](docs/user-onboarding.md) — Registration and onboarding architecture.
- [`docs/production.md`](docs/production.md) — Deployment requirements and external dependencies.
- [`docs/business-model.md`](docs/business-model.md) — Product, revenue, and financial boundaries.
- [`docs/creator-platform.md`](docs/creator-platform.md) — Creator identity, tools, and monetization scope.
- [`docs/monetization.md`](docs/monetization.md) — Revenue, ads, ledger, and payout safety rules.
- [`docs/search.md`](docs/search.md) — Search visibility, indexing, and discovery architecture.
- [`docs/seo.md`](docs/seo.md) — Public metadata, indexing, and domain roadmap.
- [`docs/media-architecture.md`](docs/media-architecture.md) — Storage, media validation, and video processing.
- [`docs/admin-final-audit.md`](docs/admin-final-audit.md) — Admin control-plane audit, integration status, and limitations.
- [`docs/disaster-recovery.md`](docs/disaster-recovery.md) — Recovery layers, procedures, and financial safety.

