# EarnSpace — Multi-Provider Advertising Engine Architecture

## Overview
The EarnSpace Multi-Provider Advertising Engine provides a non-blocking, generic ad-network abstraction layer. It supports external ad networks (Google AdSense, Adsterra), direct advertiser campaigns, and platform house ads with automated fallback degradation.

---

## Smart Selection Sequence

```text
Ad Request (Slot, Device, Country)
            │
            ▼
┌─────────────────────────┐
│ Direct Campaign Match?  │ ──(Yes)──► Render Direct Creative
└─────────────────────────┘
            │ (No)
            ▼
┌─────────────────────────┐
│ External Ad Provider?   │ ──(Yes)──► Render AdSense / Adsterra Slot
└─────────────────────────┘
            │ (No / Offline)
            ▼
┌─────────────────────────┐
│ House Ad Fallback       │ ──► Render EarnSpace Feature Card
└─────────────────────────┘
```

---

## Ad Placements Supported
- `SOCIAL_FEED_TOP`, `SOCIAL_FEED_MID`, `SOCIAL_FEED_BOTTOM`
- `PROFILE_FEED`
- `VIDEO_PRE_ROLL`, `VIDEO_MID_ROLL`, `VIDEO_POST_ROLL`
- `REELS_FEED`
- `STORY_AD`
- `BLOG_TOP`, `BLOG_MID`, `BLOG_BOTTOM`
- `EXPLORE_FEED`
- `SEARCH_RESULTS`
- `PERSONAL_SPACE_HEADER`, `PERSONAL_SPACE_CONTENT`, `PERSONAL_SPACE_SIDEBAR`, `PERSONAL_SPACE_FOOTER`
- `DASHBOARD_SPONSOR`

