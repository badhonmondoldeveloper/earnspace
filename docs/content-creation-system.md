# EarnSpace Content Creation System V2 Documentation

## Architecture Overview

EarnSpace Content Creation System V2 provides a production-grade, Facebook-inspired multi-modal publishing architecture supporting **Posts**, **Stories**, **Reels**, and **Long-Form Videos**.

---

## Creation Components Hierarchy (`src/components/content/`)

- `UniversalCreateModal.tsx`: Global routing hub to all specialized creators.
- `PostCreateModal.tsx`: Composer with privacy selector, multi-photo grid preview, feeling/activity picker, hashtag/mention autocomplete, draft discard modal.
- `StoryCreateModal.tsx`: Visual Text Story mode (6 gradient presets) & Photo/Video mode with 24-hour expiration (`expiresAt`).
- `ReelCreateModal.tsx`: 9:16 vertical short video creator with aspect ratio warning, live vertical player, and audio title input.
- `VideoCreateModal.tsx`: 4-step long-form video publisher (Details → Thumbnail → Audience → Monetization).
- **Supporting Components**:
  - `MediaUploader.tsx`: Drag & drop file selector with MIME and file size validation.
  - `UploadProgress.tsx`: Progress bar with percentage, status text, and retry actions.
  - `PrivacySelector.tsx`: Server-enforced privacy dropdown (Public, Followers, Only Me).
  - `FeelingActivityPicker.tsx`: Configurable feeling/activity popover.
  - `HashtagInput.tsx`: Automatic hashtag extraction & interactive tag pills.
  - `MentionInput.tsx`: User mention autocomplete.
  - `ThumbnailUploader.tsx`: 16:9 widescreen thumbnail selector.
  - `MediaPreview.tsx`: Multi-image layout grid (1, 2, 3-4, 5+ with +N count overlay).
  - `DraftDiscardModal.tsx`: Confirmation prompt for unsaved changes.

---

## API Routes & Endpoints

- `POST /api/v1/uploads`: Accepts `formData` with `file` and `purpose` (`post-image`, `story-image`, `thumbnail`, `video`, `reel`). Validates file signature, size limit, and MIME type server-side.
- `POST /api/v1/posts`: Creates text and photo posts with server-side sanitizer, hashtag/mention extractor, and privacy level.
- `POST /api/v1/stories`: Posts stories with server-enforced `expiresAt` (24h). Active queries filter out expired stories via `expiresAt: { gt: now }`.
- `POST /api/v1/reels`: Saves vertical short-form video reels and links hashtags.
- `POST /api/v1/videos`: Saves long-form videos with thumbnail, category, and monetization status check.

---

## Storage & Resiliency

- Storage is abstracted via `StorageProvider` (`LocalStorageProvider` in `storageService.ts`).
- Serverless environments (e.g. Vercel read-only filesystem) automatically fall back to Base64 Data URIs (`data:${mimeType};base64,...`) to ensure zero upload failures.

---

## Security & Privacy Rules

1. **Authentication**: All creation APIs strictly check `getSession()` on the server side. Client-provided `userId` is never trusted.
2. **Server-Side Filtering**: Private posts (`only_me` and `followers`) are restricted at the database query level (`whereClause`).
3. **Hashtag & Mention Extraction**: Sanitizes inputs and dispatches real-time user mention notifications without exposing private data.

