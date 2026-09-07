import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { PaymentIntentService } from '@/services/paymentIntentService';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const intents = await prisma.paymentIntent.findMany({
      where: { userId: session.userId },
      include: { paymentAccount: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse(intents, 'Payment intents retrieved');
  } catch (error: any) {
    console.error('GET /api/v1/wallet/intents error:', error);
    return errorResponse(error.message || 'Failed to fetch intents', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { amount, currency, paymentAccountId, description, expiresInMinutes } = body;

    if (!amount) {
      return errorResponse('Amount is required', 400);
    }

    const intent = await PaymentIntentService.createIntent({
      userId: session.userId,
      amount: parseFloat(amount),
      currency: currency || 'BDT',
      paymentAccountId,
      description,
      expiresInMinutes: expiresInMinutes ? parseInt(expiresInMinutes) : 30,
    });

    return successResponse(intent, 'Payment intent generated successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/wallet/intents error:', error);
    return errorResponse(error.message || 'Failed to create payment intent', 500);
  }
}
