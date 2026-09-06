import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { MembershipService } from '@/services/membershipService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return errorResponse('creatorId search parameter is required', 400);
    }

    const tiers = await MembershipService.getCreatorTiers(creatorId);
    return successResponse(tiers, 'Creator membership tiers retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/memberships/tiers error:', error);
    return errorResponse(error.message || 'Failed to fetch membership tiers', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { name, price, currency, perks } = body;

    if (!name || price === undefined) {
      return errorResponse('Name and price are required', 400);
    }

    const tier = await MembershipService.createTier({
      creatorId: session.userId,
      name,
      price: parseFloat(price),
      currency: currency || 'BDT',
      perks: Array.isArray(perks) ? perks : [],
    });

    return successResponse(tier, 'Creator membership tier created', 201);
  } catch (error: any) {
    console.error('POST /api/v1/memberships/tiers error:', error);
    return errorResponse(error.message || 'Failed to create membership tier', 500);
  }
}
