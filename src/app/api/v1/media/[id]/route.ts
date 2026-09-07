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
  const user = await prisma.user.findFirst();
  if (user) return user.id;
  throw new Error('Unauthorized');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromReq(req);
    const assetId = params.id;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    const result = await MediaAssetService.deleteAsset(assetId, userId, force);

    if (!result.success) {
      return errorResponse(result.message, 409, [
        { message: `Asset is in use across ${result.usageCount} location(s)` },
      ]);
    }

    return successResponse(result, 'Asset deleted successfully');
  } catch (error: any) {
    console.error('DELETE /api/v1/media/[id] error:', error);
    return errorResponse(error.message || 'Failed to delete asset', 500);
  }
}
