# EarnSpace — Security Hardening & Isolation

## Security Policies
1. **Secrets Isolation**: Provider API keys and private tokens remain in server-side `credentialsJson` or environment variables, never sent to frontend clients.
2. **Server-Side Authorization**: Enforces strict session verification for user (`getAuthUser`) and admin (`getAdminSession`) endpoints.
3. **Idempotent Operations**: All financial ledger credits, debits, reversals, and ad impression events require unique idempotency keys.
4. **Append-Only Auditing**: Admin actions generate immutable audit log records.
