import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminSession } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from '@/services/financialLedgerService';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    const session = await getSession();

    // Check if requester is Admin or Super Admin
    if (!admin && session?.role !== 'Super Admin' && session?.role !== 'Finance Manager') {
      return errorResponse('Forbidden: Admin finance permissions required', 403);
    }

    const body = await req.json();
    const { action, transactionId, userId, amount, rejectionReason, note } = body;

    if (!action) {
      return errorResponse('Action parameter is required (APPROVE, REJECT, MANUAL_ADJUSTMENT)', 400);
    }

    // 1. APPROVE MANUAL PAYMENT
    if (action === 'APPROVE') {
      if (!transactionId) return errorResponse('transactionId is required for APPROVE', 400);

      const txn = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        include: { user: true },
      });

      if (!txn) return errorResponse('Payment transaction not found', 404);
      if (txn.status === 'VERIFIED' || txn.status === 'AVAILABLE') {
        return errorResponse('Transaction has already been verified and credited', 400);
      }

      const creditAmount = amount ? parseFloat(amount) : txn.amount;

      // Atomic Ledger Credit
      const ledgerResult = await FinancialLedgerService.recordTransaction({
        userId: txn.userId,
        type: 'deposit',
        amount: creditAmount,
        currency: 'BDT',
        referenceType: 'MANUAL_VERIFICATION',
        referenceId: txn.id,
        idempotencyKey: `verify_txn_${txn.id}`,
        description: `Manual Deposit verified via ${txn.provider} (TrxID: ${txn.transactionId})`,
      });

      // Update PaymentTransaction status
      await prisma.paymentTransaction.update({
        where: { id: txn.id },
        data: {
          status: 'VERIFIED',
          amount: creditAmount,
        },
      });

      // If tied to a PaymentIntent, mark intent COMPLETED
      if (txn.matchedPaymentIntentId) {
        await prisma.paymentIntent.update({
          where: { id: txn.matchedPaymentIntentId },
          data: { status: 'COMPLETED' },
        }).catch(() => {});
      }

      return successResponse(
        ledgerResult,
        `Transaction ${txn.transactionId} verified successfully. ৳${creditAmount} credited to user @${txn.user?.username || txn.userId}.`
      );
    }

    // 2. REJECT MANUAL PAYMENT
    if (action === 'REJECT') {
      if (!transactionId) return errorResponse('transactionId is required for REJECT', 400);

      const txn = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
      });

      if (!txn) return errorResponse('Payment transaction not found', 404);

      await prisma.paymentTransaction.update({
        where: { id: txn.id },
        data: {
          status: 'REJECTED',
          rawSmsText: rejectionReason ? `Rejected: ${rejectionReason}` : 'Rejected by Admin',
        },
      });

      return successResponse(null, `Transaction ${txn.transactionId} has been rejected.`);
    }

    // 3. MANUAL BALANCE ADJUSTMENT (+ / -)
    if (action === 'MANUAL_ADJUSTMENT') {
      if (!userId || amount === undefined) {
        return errorResponse('userId and amount are required for MANUAL_ADJUSTMENT', 400);
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount === 0) {
        return errorResponse('Amount must be a non-zero number', 400);
      }

      const type = parsedAmount > 0 ? 'deposit' : 'fee';
      const absAmount = Math.abs(parsedAmount);

      const ledgerResult = await FinancialLedgerService.recordTransaction({
        userId,
        type,
        amount: absAmount,
        currency: 'BDT',
        referenceType: 'ADMIN_MANUAL_ADJUSTMENT',
        referenceId: `adj_${Date.now()}`,
        idempotencyKey: `admin_adj_${userId}_${Date.now()}`,
        description: note || `Admin manual balance adjustment by ${admin?.email || 'Admin'}`,
      });

      return successResponse(
        ledgerResult,
        `Successfully ${parsedAmount > 0 ? 'credited' : 'debited'} ৳${absAmount} to user wallet.`
      );
    }

    return errorResponse('Invalid action specified', 400);
  } catch (error: any) {
    console.error('POST /api/v1/admin/finance/verify-payment error:', error);
    return errorResponse(error.message || 'Failed to process admin payment action', 500);
  }
}
