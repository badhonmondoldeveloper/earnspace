import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { CronJobsService } from '@/services/cronJobsService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startTime;

    const totalUsers = await prisma.user.count();
    const activeAdProviders = await prisma.adProvider.count({ where: { status: 'active' } });
    const pendingWithdrawals = await prisma.withdrawalRequest.count({ where: { status: 'requested' } });

    return successResponse({
      status: 'healthy',
      dbStatus: 'connected',
      dbLatencyMs,
      metrics: {
        totalUsers,
        activeAdProviders,
        pendingWithdrawals,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('System health diagnostic error:', error);
    return errorResponse('System health check failed', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const jobResults = await CronJobsService.runAllJobs();
    return successResponse(jobResults, 'Background cron jobs executed successfully');
  } catch (error: any) {
    console.error('Cron job execution error:', error);
    return errorResponse(error.message || 'Background job execution failed', 500);
  }
}
