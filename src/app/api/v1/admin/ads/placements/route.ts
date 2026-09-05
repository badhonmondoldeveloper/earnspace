import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const placements = await prisma.adPlacement.findMany({
      include: { provider: { select: { name: true, providerKey: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(placements);
  } catch (error: any) {
    console.error('Admin placements fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const { providerId, slotName, format = 'banner', frequency = 3, cooldownSeconds = 30 } = await req.json();
    if (!providerId || !slotName) {
      return errorResponse('Provider ID and slot name are required', 400);
    }

    const placement = await prisma.adPlacement.create({
      data: {
        providerId,
        slotName,
        format,
        frequency,
        cooldownSeconds,
        status: 'active',
      },
    });

    return successResponse(placement, 'Placement slot created successfully');
  } catch (error: any) {
    console.error('Admin placement creation error:', error);
    return errorResponse(error.message || 'Failed to create placement', 400);
  }
}

