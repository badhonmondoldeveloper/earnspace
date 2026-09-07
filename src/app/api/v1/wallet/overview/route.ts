import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { WalletCoreService } from '@/services/walletCoreService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const overview = await WalletCoreService.getWalletOverview(session.userId);
    return successResponse(overview, 'Wallet overview retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/wallet/overview error:', error);
    return errorResponse(error.message || 'Failed to fetch wallet overview', 500);
  }
}
