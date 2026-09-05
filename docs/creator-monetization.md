# EarnSpace Creator Monetization System

## Architecture Overview

EarnSpace provides a modular, multi-revenue monetization engine tailored for Bangladeshi content creators. Rather than relying on a single advertising network, creators can generate revenue across 7 distinct programs:

1. **Ad Revenue Program**: Contextual and video/reels ad placements.
2. **Creator Partner Program**: High-engagement watch time and follower rewards.
3. **Sponsored Campaigns**: Brand-sponsored posts and promotional videos.
4. **Affiliate Program**: CPA and action-based conversion rewards.
5. **Fan Support & Tips**: Direct viewer tips with automated ledger credits.
6. **Creator Subscriptions**: Tiered monthly fan support.
7. **Referral Rewards**: Qualified active user referral incentives.

## Program Eligibility

Eligibility is dynamically checked server-side via `MonetizationProgramService.checkCreatorEligibility(userId, programId)` against configurable rules stored in `MonetizationProgram.eligibilityRulesJson`.

Example rule configuration:
```json
{
  "minFollowers": 100,
  "minViews": 1000,
  "minAgeDays": 7,
  "requireOriginalContent": true
}
```

Creators can view eligibility metrics and apply directly via `/creator/monetization`.
