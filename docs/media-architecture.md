# Media Architecture

Media flows should use the storage abstraction rather than coupling product routes to one storage vendor. Profile photos, covers, post media, videos, reels, thumbnails, and future Personal Space assets need validation, ownership checks, size limits, safe filenames, and access policy.

Large video processing should be asynchronous: upload, validate, store, process, create thumbnail/resolutions, publish, and record analytics. Synchronous web requests should not transcode large files.

Object storage, CDN delivery, image transformation, video transcoding, retention, and backup require provider configuration. They are not considered live solely because the application has upload routes.
