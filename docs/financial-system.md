# EarnSpace — Financial System Integrity

## Accounting Principles
- Floating-point calculations are rounded to 2 decimal places using `Math.round(val * 100) / 100`.
- All wallet modifications execute inside PostgreSQL database transactions (`prisma.$transaction`).
- Reversals create debit transactions referencing the original transaction ID rather than mutating historical records.
