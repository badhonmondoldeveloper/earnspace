import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { WalletTransferService } from '@/services/walletTransferService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { recipientUsernameOrEmail, amount, currency, note, idempotencyKey } = body;

    if (!recipientUsernameOrEmail || !amount) {
      return errorResponse('recipientUsernameOrEmail and amount are required', 400);
    }

    const key = idempotencyKey || `trf_${session.userId}_${Date.now()}`;

    const result = await WalletTransferService.executeTransfer({
      senderId: session.userId,
      recipientUsernameOrEmail,
      amount: parseFloat(amount),
      currency: currency || 'BDT',
      note,
      idempotencyKey: key,
    });

    return successResponse(result, 'Internal wallet transfer completed successfully');
  } catch (error: any) {
    console.error('POST /api/v1/wallet/transfers error:', error);
    return errorResponse(error.message || 'Transfer failed', 400);
  }
}
