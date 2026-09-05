import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { HouseAdService } from '@/services/houseAdService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);
    if (!hasAdminPermission(admin.role, 'ads.view')) return errorResponse('Permission denied', 403);

    const houseAds = await HouseAdService.listHouseAds();
    return successResponse(houseAds);
  } catch (error: any) {
    console.error('Admin house ads error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);
    if (!hasAdminPermission(admin.role, 'ads.manage')) return errorResponse('Permission denied', 403);

    const body = await req.json();
    const { title, description, mediaUrl, destinationUrl, ctaText, placement, priority } = body;

    if (!title || !destinationUrl) {
      return errorResponse('Title and destination URL are required', 400);
    }

    const houseAd = await HouseAdService.createHouseAd({
      title,
      description,
      mediaUrl,
      destinationUrl,
      ctaText,
      placement,
      priority,
    });

    return successResponse(houseAd, 'House ad created successfully');
  } catch (error: any) {
    console.error('Admin house ad creation error:', error);
    return errorResponse(error.message || 'Failed to create house ad', 400);
  }
}

