# EarnSpace — Ad Fraud & Risk Detection Engine

## Protection Mechanisms
1. **Automated Bot Filtering**: Detects headless browsers, cURL/Wget scripts, and scrapers using user-agent heuristics.
2. **IP Velocity Rate Limiting**: Caps impressions (>50 / 5m) and clicks (>10 / 5m) per IP address.
3. **Idempotency Locks**: Prevents duplicate impression logging using unique idempotency tokens.
4. **Graduated Risk Scoring**: Scores events from 0 to 100 (`low`, `medium`, `high`, `blocked`) and logs `RiskEvent` records.

