# EarnSpace Security Hardening Architecture

## Overview
EarnSpace employs defense-in-depth security principles across authentication, authorization, financial ledgers, content uploads, and server-side RBAC.

---

## 1. Authentication & Session Security
- **Dual Security Domains**: Separate user (`earnspace_session`) and admin (`earnspace_admin_session`) JWT session cookies.
- **HttpOnly Cookies**: All auth tokens are stored in HttpOnly, `SameSite=Strict`, secure cookies inaccessible to client-side scripts.
- **Password Hashing**: Industry-standard `bcryptjs` with salt factor 10.
- **Server-Side Validation**: Front-end state or client tokens are never trusted for authorization decisions.

---

## 2. Role-Based Access Control (RBAC)
- Admin permissions are enforced server-side using `hasAdminPermission(role, requiredPermission)`:
  - `super_admin`: Global wildcard access (`*`).
  - `finance_admin`: `finance.*`, `withdrawals.*`, `wallets.*`.
  - `moderator`: `content.*`, `reports.*`, `users.suspend`.
  - `support`: `users.view`, `reports.view`.

---

## 3. Upload & File Security (`src/lib/uploadSanitizer.ts`)
- **Magic Bytes Header Checking**: Validates binary header signatures (PNG, JPEG, GIF, WebP, MP4, PDF) to prevent executable script injection (PHP/HTML/JS disguised as images).
- **Directory Traversal Guard**: Filenames containing `..`, `/`, or `\` are rejected.
- **File Extension Exclusion**: `html`, `js`, `exe`, `php`, `sh`, `bat`, `svg` extensions are strictly prohibited.

---

## 4. XSS & HTML Sanitization (`src/lib/sanitizer.ts`)
- All user-submitted HTML in blog posts (`Blog`) and website builder blocks (`PageBlock`) is sanitized using `sanitize-html` before rendering to block stored XSS vectors.

---

## 5. Append-Only Financial Ledger & Audit Trail
- Balance mutations occur strictly through transactional ledger entries (`WalletTransaction`).
- Every administrative action creates an immutable, append-only record in `AuditLog` including actor ID, action, target, before/after JSON snapshot, and IP address.

