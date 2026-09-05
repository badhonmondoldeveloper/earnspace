import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { validateFileUpload } from '@/lib/uploadSanitizer';
import { storageService } from '@/services/storageService';
import { successResponse, errorResponse } from '@/lib/response';

export const dynamic = 'force-dynamic';

type UploadPurpose = 'avatar' | 'cover' | 'post-image' | 'story-image' | 'thumbnail' | 'video' | 'reel';

const policies: Record<UploadPurpose, { mimeTypes: string[]; maxBytes: number }> = {
  avatar: { mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], maxBytes: 5 * 1024 * 1024 },
  cover: { mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], maxBytes: 10 * 1024 * 1024 },
  'post-image': { mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], maxBytes: 10 * 1024 * 1024 },
  'story-image': { mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], maxBytes: 10 * 1024 * 1024 },
  thumbnail: { mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], maxBytes: 5 * 1024 * 1024 },
  video: { mimeTypes: ['video/mp4', 'video/webm'], maxBytes: 100 * 1024 * 1024 },
  reel: { mimeTypes: ['video/mp4', 'video/webm'], maxBytes: 100 * 1024 * 1024 },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const formData = await req.formData();
    const file = formData.get('file');
    const purpose = formData.get('purpose');

    if (!(file instanceof File)) return errorResponse('A file is required', 400);
    if (typeof purpose !== 'string' || !(purpose in policies)) return errorResponse('Invalid upload purpose', 400);

    const policy = policies[purpose as UploadPurpose];
    if (!policy.mimeTypes.includes(file.type)) return errorResponse('This file type is not supported for this upload', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = validateFileUpload(buffer, file.name, file.type, policy.maxBytes);
    if (!validation.valid) return errorResponse(validation.error || 'File validation failed', 400);

    const url = await storageService.uploadFile(buffer, file.name, file.type);
    return successResponse({ url, mimeType: file.type, size: buffer.length, purpose }, 'File uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Upload failed. Please try again.', 500);
  }
}
