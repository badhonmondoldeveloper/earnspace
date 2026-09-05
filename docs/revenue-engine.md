# EarnSpace Multi-Revenue & Ad Provider Engine

## Modular Revenue Split Engine

Every financial event in EarnSpace follows strict itemized traceability:

```text
Revenue Event -> Revenue Rule (vX) -> Creator Earning -> Financial Ledger -> Wallet
```

### Configurable Revenue Split
Revenue splits are determined per program/source and stored with exact rule versioning (`ruleVersion`):
- Net Eligible Revenue = Gross Revenue - Provider Fees
- Creator Share = Net Eligible Revenue * (User Share % / 100)
- Platform Share = Net Eligible Revenue * (Platform Share % / 100)

Historical earnings are preserved immutably when rules change.

## Multi-Ad Provider Adapter Architecture

Ad delivery uses an adapter interface (`AdProviderInterface`) with an automated fallback chain managed by `AdProviderManager`:

```text
Google AdSense -> Adsterra Network -> Direct Campaigns -> Native Fallback
```

If a primary provider is degraded or offline, advertising degrades gracefully to the next provider without crashing client viewports.
