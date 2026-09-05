import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'audit_logs.view')) {
      return errorResponse('Permission denied', 403);
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        adminUser: { select: { fullName: true, email: true, role: true } },
      },
    });

    return successResponse(logs);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

