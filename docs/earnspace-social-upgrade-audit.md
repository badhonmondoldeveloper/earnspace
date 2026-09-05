# EarnSpace Social Upgrade Audit & Architecture Report

## 1. Existing System Audit

### Discovered Infrastructure & Reused Architecture
- **Authentication**: JWT HttpOnly Cookie Session Management (`/api/v1/auth/*`, `getSession()`) + Admin Cookie Session (`/api/v1/admin/auth/*`, `getAdminSession()`).
- **Database Engine**: Supabase PostgreSQL database synced via Prisma ORM (`prisma/schema.prisma`).
- **User Models**: `User`, `Profile`, `UserSetting`, `UserSession`, `Follow`, `Block`, `Mute`.
- **Social Feed & Content Models**: `Post`, `PostMedia`, `PostReaction`, `Comment`, `CommentReaction`, `Save`, `Share`, `Story`, `StoryView`, `Blog`.
- **Messaging & Notifications**: `Conversation`, `ConversationMember`, `Message`, `Notification`, `Report`.
- **Creator Website Builder Engine**: `Page`, `PageBlock`, `PageSetting` (`/space/[username]`, `/dashboard/website`).
- **Monetization & Financial Engine**: `Wallet`, `WalletTransaction`, `RevenueSource`, `RevenueEvent`, `RevenueRule`, `CreatorEarning`, `WithdrawalMethod`, `WithdrawalRequest`, `Referral`, `ReferralEvent`, `Campaign`, `Advertiser`, `Subscription`, `RiskEvent`.
- **Admin & Control Center**: `AdminUser`, `AuditLog`, `ModerationAction`, `PlatformSetting` (`/admin/*`).

---

## 2. Gap Analysis & Required Upgrades for V2

| Module / Area | Current State | Required V2 Upgrade |
| :--- | :--- | :--- |
| **Profile (`/@username` / `/[username]`)** | Basic profile view with avatar, bio, posts, and websites. | Full Facebook/Creator style profile: Photos, Videos, Reels, Blogs, About tabs, action menu (Follow, Message, Share, Report, Block, Mute), cover photo overlay, responsive desktop/mobile layouts. |
| **Profile & Cover Photo** | Basic URL strings in Profile. | Integrated upload/replace/crop/positioning controls with MIME, extension, magic byte validation, and responsive mobile/desktop separation. |
| **Profile Editor & Settings** | Minimal name & bio fields. | Enhanced `/settings/profile` editor: pronouns, birthday, contact options, creator category, content niche, skills, interests, social links (Facebook, Instagram, YouTube, TikTok, X, LinkedIn). |
| **Privacy Engine** | Basic profileVisibility boolean. | Granular server-enforced permissions: whoCanFollowMe, whoCanMessageMe, whoCanComment, whoCanTagMe, whoCanMentionMe, searchVisibility, emailVisibility, phoneVisibility, locationVisibility. |
| **Social Feed (`/dashboard`)** | Simple post stream. | Multi-tab feed (For You, Following, Latest, Videos, Reels) with cursor-based pagination, engagement ranking algorithms, and zero N+1 query overhead. |
| **Universal Create Button** | Separate creation buttons across dashboard. | Centralized Create trigger on top navigation (desktop) and bottom navigation / FAB (mobile) launching modal with: Post, Photo, Video, Reel, Story, Blog options. |
| **Post Composer** | Simple text input. | Premium composer supporting text, gallery photos, videos, blogs, hashtags (#tag), user mentions (@username), feelings/activities, location tags, and post privacy selectors. |
| **Video Engine (`/video/[id]`)** | Embedded video string inside PostMedia. | Dedicated creator video publishing system (`/video/[id]`) with titles, descriptions, categories, tags, responsive video player controls, watch time tracking, and analytics. |
| **Reels Engine (`/reels` & `/reel/[id]`)** | Non-existent. | Short-form vertical 9:16 video feed (`/reels`) with mobile-first swipe, autoplay/intersection observers, mute/unmute, reactions, comments, share, and creator analytics. |
| **Content Drafts & Scheduling** | Immediate publishing only. | Draft auto-save engine (`ContentDraft`) and server-side scheduled publishing (`ScheduledContent`). |
| **Creator Studio (`/creator`)** | Scattered dashboard pages. | Centralized Creator Studio dashboard (`/creator`, `/creator/content`) with content management tabs, reach metrics, engagement breakdown, and wallet integration. |

---

## 3. Database Extensions Needed

1. **Profile Model Extensions**: `pronouns`, `birthday`, `creatorCategory`, `contentNiche`, `creatorDescription`, `publicContactOption`, `emailVisibility`, `phoneVisibility`, `locationVisibility`, `birthdayVisibility`, `skills`, `interests`.
2. **UserSetting Extensions**: `whoCanFollowMe`, `whoCanMessageMe`, `whoCanComment`, `whoCanTagMe`, `whoCanMentionMe`, `searchVisibility`.
3. **Post Extensions**: `feeling`, `location`, `commentPermission`, `sharePermission`.
4. **New Models**:
   - `Hashtag` & `PostHashtag`
   - `Mention`
   - `Video` & `VideoView`
   - `Reel` & `ReelView`
   - `ContentDraft`

---

## 4. API Endpoints Plan (`/api/v1/*`)

- `POST /api/v1/profile/avatar` — Profile photo upload & validation
- `POST /api/v1/profile/cover` — Cover photo upload & positioning
- `PUT /api/v1/profile/settings` — Profile info & social links update
- `PUT /api/v1/profile/privacy` — Granular privacy rules update
- `GET /api/v1/profiles/[username]/full` — Complete profile data with tabs
- `GET /api/v1/feed` — Multi-tab feed query with cursor pagination
- `POST /api/v1/posts/create` — Post creation with hashtags, mentions, feeling, location, privacy
- `GET /api/v1/hashtags/[tag]` — Searchable hashtag feed
- `GET /api/v1/mentions/search` — Autocomplete user mentions
- `POST /api/v1/videos/create` — Video publishing & metadata endpoint
- `GET /api/v1/videos/[id]` — Video details & stream data
- `POST /api/v1/videos/[id]/view` — Real watch-time tracking
- `POST /api/v1/reels/create` — Short-form reel publishing
- `GET /api/v1/reels` — Vertical reels feed
- `POST /api/v1/reels/[id]/view` — Reel view tracking
- `GET /api/v1/creator/analytics` — Creator Studio analytics & reach data
- `GET /api/v1/creator/content` — Creator Studio content management list

