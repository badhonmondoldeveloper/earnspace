# Media Architecture

Media flows should use the storage abstraction rather than coupling product routes to one storage vendor. Profile photos, covers, post media, videos, reels, thumbnails, and future Personal Space assets need validation, ownership checks, size limits, safe filenames, and access policy.

Authenticated users can upload device files through `POST /api/v1/uploads` using multipart form data with a purpose (`avatar`, `cover`, `post-image`, `story-image`, `thumbnail`, `video`, or `reel`). The endpoint validates the declared media type, extension, magic bytes where supported, and purpose-specific size limits before calling the storage abstraction. Profile, post, video, reel, and story composers use this endpoint instead of requiring users to paste URLs.

Large video processing should be asynchronous: upload, validate, store, process, create thumbnail/resolutions, publish, and record analytics. Synchronous web requests should not transcode large files.

Object storage, CDN delivery, image transformation, video transcoding, retention, and backup require provider configuration. They are not considered live solely because the application has upload routes.

The current local provider writes to `public/uploads`, which is suitable for local development only. Vercel/serverless production must use a durable object-storage provider implementing the same `StorageProvider` interface before uploaded files are considered production-safe.
