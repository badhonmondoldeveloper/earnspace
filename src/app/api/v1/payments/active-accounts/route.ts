import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { PaymentAccountService } from '@/services/paymentAccountService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const activeAccounts = await PaymentAccountService.getActiveAccounts();
    return successResponse(activeAccounts, 'Active payment collection accounts retrieved');
  } catch (error: any) {
    console.error('GET /api/v1/payments/active-accounts error:', error);
    return errorResponse('Failed to fetch active payment accounts', 500);
  }
}
