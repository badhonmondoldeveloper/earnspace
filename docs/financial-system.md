# EarnSpace Financial Ledger & Monetization Engine Architecture

## 1. Core Financial Principles
- **Append-Only Double-Entry Ledger**: All balance modifications are recorded in `WalletTransaction`. `Wallet.availableBalance` is an aggregate projection of verified ledger entries.
- **Decimal Safety**: All revenue calculations enforce explicit rounding to 4 decimal places (`Math.round(val * 10000) / 10000`).
- **Idempotency Enforcement**: Every transaction requires a unique `idempotencyKey` to prevent double-crediting or duplicate processing.

---

## 2. Revenue Event & Split Lifecycles
```
Business Revenue Event -> Verified -> Revenue Rule -> User % + Platform % -> Pending Creator Earning -> Approved -> Ledger Credit
```
1. **`RevenueEvent`**: Ingests gross revenue, fees, and net amount. Deduplicates external references.
2. **`RevenueRule`**: Resolves active split rules (e.g. 70% User / 30% Platform, 7 days pending). Historical earnings preserve their original rule version.
3. **`CreatorEarning`**: Holds pending credits during settlement hold. Upon expiration, converts to approved and executes `FinancialLedgerService.recordTransaction`.

---

## 3. Withdrawal & Reversal Processing
1. User requests withdrawal (bKash, Nagad, Bank).
2. Funds are reserved from `availableBalance`.
3. Admin reviews request in `/admin/withdrawals`.
4. **Approval**: Payout is executed; withdrawal marked `paid`.
5. **Reversal / Rejection**: Admin rejects request; `WithdrawalService` executes a `reversal` entry in `WalletTransaction`, restoring reserved funds to the user's wallet automatically.

