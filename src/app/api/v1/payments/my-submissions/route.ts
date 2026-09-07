import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const submissions = await prisma.paymentTransaction.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return successResponse(submissions, 'Submissions retrieved successfully');
    } catch (err: any) {
      console.warn('GET /api/v1/payments/my-submissions fallback:', err?.message);
      return successResponse([], 'Submissions retrieved successfully');
    }
  } catch (error: any) {
    console.error('GET /api/v1/payments/my-submissions error:', error);
    return errorResponse(error.message || 'Failed to fetch submissions', 500);
  }
}
