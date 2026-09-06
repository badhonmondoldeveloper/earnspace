import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { AffiliateService } from '@/services/affiliateService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const links = await AffiliateService.getUserLinks(session.userId);
    return successResponse(links, 'Affiliate links retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/affiliate/links error:', error);
    return errorResponse(error.message || 'Failed to fetch affiliate links', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { title, targetUrl, commissionRate } = body;

    if (!title || !targetUrl) {
      return errorResponse('Title and targetUrl are required', 400);
    }

    const link = await AffiliateService.createLink({
      userId: session.userId,
      title,
      targetUrl,
      commissionRate: commissionRate ? parseFloat(commissionRate) : 5.0,
    });

    return successResponse(link, 'Affiliate link created successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/affiliate/links error:', error);
    return errorResponse(error.message || 'Failed to create affiliate link', 500);
  }
}
