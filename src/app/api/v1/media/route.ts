import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/response';
import { MediaAssetService } from '@/services/mediaAssetService';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUserIdFromReq(req: NextRequest): Promise<string> {
  const session = await getSession();
  if (session && session.userId) {
    return session.userId;
  }
  
  // Fallback to first user in system for demo/development if session not initialized
  const user = await prisma.user.findFirst();
  if (user) return user.id;
  throw new Error('Unauthorized');
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromReq(req);
    const { searchParams } = new URL(req.url);
    
    const folderId = searchParams.get('folderId') || undefined;
    const fileType = searchParams.get('fileType') || undefined;
    const purpose = searchParams.get('purpose') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 24;

    const result = await MediaAssetService.listAssets({
      userId,
      folderId,
      fileType,
      purpose,
      search,
      page,
      limit,
    });

    return successResponse(result, 'Media assets retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/media error:', error);
    return errorResponse(error.message || 'Failed to list media assets', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromReq(req);
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const purpose = (formData.get('purpose') as string) || 'general';
    const folderId = (formData.get('folderId') as string) || undefined;
    const altText = (formData.get('altText') as string) || undefined;

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await MediaAssetService.uploadAsset({
      userId,
      fileBuffer: buffer,
      originalName: file.name,
      mimeType: file.type,
      purpose,
      folderId,
      altText,
    });

    return successResponse(asset, 'Media uploaded successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/media error:', error);
    return errorResponse(error.message || 'Media upload failed', 400);
  }
}
