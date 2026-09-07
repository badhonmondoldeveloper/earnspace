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
      priority: priority ? parseInt(priority, 10) : 1,
    });

    return successResponse(houseAd, 'House ad created successfully');
  } catch (error: any) {
    console.error('Admin house ad creation error:', error);
    return errorResponse(error.message || 'Failed to create house ad', 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);
    if (!hasAdminPermission(admin.role, 'ads.manage')) return errorResponse('Permission denied', 403);

    const body = await req.json();
    const { id, title, description, mediaUrl, destinationUrl, ctaText, placement, priority, status } = body;

    if (!id) {
      return errorResponse('Ad ID is required', 400);
    }

    const updated = await HouseAdService.updateHouseAd(id, {
      title,
      description,
      mediaUrl,
      destinationUrl,
      ctaText,
      placement,
      priority: priority ? parseInt(priority, 10) : undefined,
      status,
    });

    return successResponse(updated, 'House ad updated successfully');
  } catch (error: any) {
    console.error('Admin house ad update error:', error);
    return errorResponse(error.message || 'Failed to update house ad', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);
    if (!hasAdminPermission(admin.role, 'ads.manage')) return errorResponse('Permission denied', 403);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Ad ID is required', 400);
    }

    const toggled = await HouseAdService.toggleHouseAdStatus(id);
    return successResponse(toggled, `Ad status updated to ${toggled.status}`);
  } catch (error: any) {
    console.error('Admin house ad toggle error:', error);
    return errorResponse(error.message || 'Failed to toggle house ad status', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);
    if (!hasAdminPermission(admin.role, 'ads.manage')) return errorResponse('Permission denied', 403);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Ad ID is required', 400);
    }

    await HouseAdService.deleteHouseAd(id);
    return successResponse(null, 'House ad deleted successfully');
  } catch (error: any) {
    console.error('Admin house ad delete error:', error);
    return errorResponse(error.message || 'Failed to delete house ad', 400);
  }
}
