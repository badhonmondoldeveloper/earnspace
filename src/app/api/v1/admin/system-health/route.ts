import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }

    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    return successResponse({
      status: 'healthy',
      database: {
        status: 'online',
        latencyMs: dbLatency,
      },
      system: {
        environment: process.env.NODE_ENV || 'development',
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse('System health check failed', 500);
  }
}

