# EarnSpace System Architecture Blueprint — Part 1, Part 2 & Part 3

## 1. Overview
EarnSpace is a commercial-grade social platform, personal digital space builder, creator monetization engine, and advanced enterprise SaaS operations platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and MySQL/MariaDB database architecture.

## 2. Full Directory Structure Architecture
```text
earnspace/
├── docs/
│   └── architecture.md
├── public/
│   ├── icons/
│   ├── uploads/
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── (auth)/ login, register, forgot-password
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/ (Feed, Website Builder, Blog Portal)
│   │   │   ├── earnings/ (Creator Earnings & Revenue Analytics)
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── (public)/ (Landing, About, Features, Pricing, Policies)
│   │   ├── admin/ (Advanced SaaS Operations Admin Center)
│   │   │   ├── login/
│   │   │   ├── users/ & users/[id]/
│   │   │   ├── content/
│   │   │   ├── reports/
│   │   │   ├── campaigns/
│   │   │   ├── revenue/ (Rules & Split versioning)
│   │   │   ├── finance/ & wallets/ & withdrawals/
│   │   │   ├── referrals/
│   │   │   ├── ads/ & advertisers/
│   │   │   ├── subscriptions/
│   │   │   ├── settings/ (Dynamic config & Maintenance mode)
│   │   │   ├── audit-logs/
│   │   │   └── system-health/
│   │   ├── wallet/ & withdrawals/ & referrals/ & campaigns/ & advertiser/
│   │   └── api/v1/
│   │       ├── auth, users, profiles, posts, comments, stories, blogs, pages
│   │       ├── monetization, earnings, wallet, withdrawals, referrals, campaigns, advertiser, subscriptions
│   │       └── admin/ (auth, users, content, reports, finance, withdrawals, rules, ads, settings, audit-logs, health)
│   ├── components/
│   │   ├── ui, layout, feed, website-builder, wallet, earnings, campaigns
│   │   └── admin/ (AdminSidebar, AdminNavbar, MetricsGrid, UserAuditDrawer, RuleBuilder)
│   ├── services/
│   │   ├── authService, rateLimitService, storageService
│   │   ├── financialLedgerService (Immutable ledger, double-entry balance math)
│   │   ├── monetizationEngine (Revenue split, rule versioning)
│   │   ├── withdrawalService (Fund reservation, bKash/Nagad/Bank validation)
│   │   ├── referralService & riskEngineService
│   │   ├── adminAuditService (Append-only admin action tracking)
│   │   ├── adminUserService (Account state transitions & wallet freeze)
│   │   └── cronJobsService (Automated story cleanup, posts, checking checks)
│   ├── lib/ (prisma.ts, auth.ts, adminAuth.ts, sanitizer.ts, response.ts)
│   ├── types/
│   └── validations/
├── prisma/
│   └── schema.prisma
```

## 3. Security & Admin RBAC Architecture
- **Server-Side Authorization**: Admin endpoints inspect dedicated `AdminUser` sessions and check granular permissions (`users.suspend`, `withdrawals.approve`, `settings.manage`). Front-end role claims are never trusted.
- **Immutable Audit Logging (`AuditLog`)**: Every administrative action (bans, wallet freezes, withdrawal approvals, rule modifications) records actor ID, target, before/after JSON diffs, IP, user agent, timestamp, and justification reason.
- **Maintenance Mode Architecture**: `/admin/settings/maintenance` allows toggling platform maintenance mode while preserving admin accessibility.
