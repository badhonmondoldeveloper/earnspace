# EarnSpace Production Database Deployment Strategy

## 1. Environment Transition (SQLite to PostgreSQL/MySQL)
For production deployments, change `datasource db` in `prisma/schema.prisma` from `sqlite` to `postgresql` or `mysql`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 2. Connection Pooling & SSL Configuration
Production `DATABASE_URL` format:
```env
DATABASE_URL="postgresql://earnspace_user:SecurePassword123@db.earnspace.com:5432/earnspace_prod?sslmode=require&connection_limit=20"
```

---

## 3. Migration Execution Protocol
- **Development**: Use `npx prisma db push`.
- **Production**: Execute non-destructive schema migrations using `npx prisma migrate deploy`. Never run `prisma migrate reset` in production environments.

