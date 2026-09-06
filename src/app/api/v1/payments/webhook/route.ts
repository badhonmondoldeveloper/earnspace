import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { FinancialLedgerService } from '@/services/financialLedgerService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gateway, eventType, transactionRef, amount, userId, idempotencyKey } = body;

    if (!gateway || !transactionRef || !idempotencyKey) {
      return errorResponse('Missing required payment webhook parameters', 400);
    }

    // Check idempotency
    const existingWebhook = await prisma.paymentWebhook.findUnique({
      where: { idempotencyKey },
    });

    if (existingWebhook && existingWebhook.processed) {
      return successResponse({ idempotencyKey, status: 'already_processed' }, 'Webhook already processed');
    }

    return await prisma.$transaction(async (tx) => {
      // Record or update PaymentWebhook
      await tx.paymentWebhook.upsert({
        where: { idempotencyKey },
        update: {
          processed: true,
          processedAt: new Date(),
        },
        create: {
          gateway: gateway.toUpperCase(),
          eventType: eventType || 'payment_success',
          payloadJson: JSON.stringify(body),
          processed: true,
          processedAt: new Date(),
          idempotencyKey,
        },
      });

      // Update or create PaymentAttempt
      if (userId && amount) {
        await tx.paymentAttempt.upsert({
          where: { transactionRef },
          update: {
            status: 'completed',
          },
          create: {
            userId,
            gateway: gateway.toUpperCase(),
            amount: parseFloat(amount),
            currency: 'BDT',
            transactionRef,
            status: 'completed',
            metadataJson: JSON.stringify(body),
          },
        });

        // Credit user wallet
        const wallet = await FinancialLedgerService.getOrCreateWallet(userId, tx);
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            availableBalance: wallet.availableBalance + parseFloat(amount),
          },
        });

        await FinancialLedgerService.recordTransaction({
          userId,
          type: 'deposit',
          amount: parseFloat(amount),
          currency: 'BDT',
          referenceType: 'gateway_tx',
          referenceId: transactionRef,
          idempotencyKey: `wh_deposit_${idempotencyKey}`,
          description: `Deposit via ${gateway} (${transactionRef})`,
        });
      }

      return successResponse({ transactionRef, gateway, status: 'completed' }, 'Payment webhook processed successfully');
    });
  } catch (error: any) {
    console.error('POST /api/v1/payments/webhook error:', error);
    return errorResponse(error.message || 'Webhook processing failed', 500);
  }
}
