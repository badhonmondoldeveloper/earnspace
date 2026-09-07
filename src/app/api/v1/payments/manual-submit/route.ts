import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { provider, transactionId, amount, senderNumber, reference } = body;

    if (!provider || !transactionId || !amount || !senderNumber) {
      return errorResponse('Provider, Transaction ID, Amount, and Sender Number are required', 400);
    }

    const cleanProvider = String(provider).toUpperCase().trim();
    const cleanTrxId = String(transactionId).trim().toUpperCase();
    const cleanSender = String(senderNumber).trim();
    const parsedAmount = parseFloat(amount);

    if (!['BKASH', 'NAGAD', 'ROCKET', 'UPAY'].includes(cleanProvider)) {
      return errorResponse('Invalid payment provider. Supported: BKASH, NAGAD, ROCKET, UPAY', 400);
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return errorResponse('Amount must be a valid positive number', 400);
    }

    if (cleanTrxId.length < 4) {
      return errorResponse('Please enter a valid Transaction ID (TrxID)', 400);
    }

    try {
      // Check for existing duplicate TrxID
      const existing = await prisma.paymentTransaction.findFirst({
        where: {
          provider: cleanProvider,
          transactionId: cleanTrxId,
        },
      });

      if (existing) {
        if (existing.status === 'VERIFIED' || existing.status === 'AVAILABLE' || existing.status === 'MATCHED') {
          return errorResponse('This Transaction ID (TrxID) has already been verified and credited.', 400);
        }
        if (existing.status === 'REVIEW' || existing.status === 'PENDING') {
          return errorResponse('This Transaction ID (TrxID) has already been submitted and is currently awaiting Admin verification.', 400);
        }
      }

      const transaction = await prisma.paymentTransaction.create({
        data: {
          userId: session.userId,
          provider: cleanProvider,
          transactionId: cleanTrxId,
          amount: parsedAmount,
          senderNumber: cleanSender,
          reference: reference || `MANUAL-${Date.now()}`,
          status: 'REVIEW',
          transactionType: 'CASH_IN',
          rawSmsText: `Manual User Submission | Sender: ${cleanSender} | TrxID: ${cleanTrxId} | Amount: ${parsedAmount}`,
        },
      });

      return successResponse(
        transaction,
        'Deposit request submitted successfully! EarnSpace Admin will manually verify your Transaction ID and credit your wallet shortly.',
        201
      );
    } catch (err: any) {
      console.error('Manual submission DB error:', err);
      if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
        return errorResponse('Payment system database is currently initializing. Please try again shortly.', 503);
      }
      return errorResponse(err?.message || 'Failed to submit manual payment verification', 500);
    }
  } catch (error: any) {
    console.error('POST /api/v1/payments/manual-submit error:', error);
    return errorResponse(error.message || 'Failed to submit payment verification', 500);
  }
}
