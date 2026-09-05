# EarnSpace Payout & Withdrawal System

## Minimum Payout Threshold

By default, EarnSpace enforces a minimum withdrawal threshold of **৳10,000** ($100 equivalent). This threshold is configurable by Admin via `PlatformSetting` (`MINIMUM_WITHDRAWAL_THRESHOLD`).

## Supported Payout Channels

1. **bKash**: 11-digit mobile wallet validation (`01XXXXXXXXX`).
2. **Nagad**: 11-digit mobile wallet validation (`01XXXXXXXXX`).
3. **Rocket**: 12-digit mobile wallet validation (`01XXXXXXXXXX`).
4. **Bank Transfer**: Bangladeshi bank account destination.
5. **Binance**:
   - **Binance UID**: 8 to 12 digit numeric ID.
   - **Blockchain Wallet**: TRC20, BEP20, ERC20 validation.

## Transactional Flow & Idempotency

```text
Request Payout -> Idempotency Check -> Threshold Check -> Reserve Balance in Ledger -> Create Withdrawal Request (requested) -> Admin Review -> Approval / Rejection
```

If rejected by Admin, reserved funds are automatically returned to the creator's available wallet balance with full audit log entry.

