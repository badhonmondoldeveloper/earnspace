import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const campaigns = await prisma.adCampaign.findMany({
      include: {
        advertiser: { select: { companyName: true, website: true } },
        creatives: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(campaigns);
  } catch (error: any) {
    console.error('Admin campaigns error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const { campaignId, status } = await req.json();
    if (!campaignId || !status) {
      return errorResponse('Campaign ID and status are required', 400);
    }

    const updated = await prisma.adCampaign.update({
      where: { id: campaignId },
      data: { status },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: admin.adminId,
        action: 'ads.campaign.status_update',
        targetType: 'ad_campaign',
        targetId: campaignId,
        afterJson: JSON.stringify({ status }),
        reason: `Admin set campaign status to ${status}`,
      },
    });

    return successResponse(updated, 'Campaign status updated');
  } catch (error: any) {
    console.error('Admin campaign update error:', error);
    return errorResponse(error.message || 'Failed to update campaign', 400);
  }
}
