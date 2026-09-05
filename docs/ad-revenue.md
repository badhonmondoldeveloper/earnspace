# EarnSpace — Ad Revenue Attribution & Split Rules

## Revenue Lifecycle
```text
Ad Event (Impression / Click)
            │
            ▼
Estimated Revenue Attribution (Status: 'estimated')
            │
            ▼
Ad Risk & Fraud Audit (Status: 'risk_review')
            │
            ▼
Verified Revenue Confirmation (Status: 'verified')
            │
            ▼
Append-Only Financial Ledger Credit to Creator Wallet
```

## Creator & Platform Revenue Splits
- Default model: 50% Creator / 50% Platform.
- Configurable via `RevenueRule` engine by provider, slot, creator tier, and effective date version.
- Historical earnings retain the specific `ruleVersion` active at time of attribution.

