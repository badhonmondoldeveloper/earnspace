import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { PaymentAccountService } from '@/services/paymentAccountService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const accounts = await PaymentAccountService.getUserAccounts(session.userId);
    return successResponse(accounts, 'Payment accounts retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/wallet/accounts error:', error);
    return errorResponse(error.message || 'Failed to fetch payment accounts', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { provider, accountType, phoneNumber, displayName } = body;

    if (!provider || !phoneNumber) {
      return errorResponse('Provider and phoneNumber are required', 400);
    }

    const account = await PaymentAccountService.addAccount({
      userId: session.userId,
      provider,
      accountType,
      phoneNumber,
      displayName,
    });

    return successResponse(account, 'Payment account registered successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/wallet/accounts error:', error);
    return errorResponse(error.message || 'Failed to add payment account', 500);
  }
}
