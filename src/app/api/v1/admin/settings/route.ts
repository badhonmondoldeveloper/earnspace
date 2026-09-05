import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';
import { AdminAuditService } from '@/services/adminAuditService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'settings.view')) {
      return errorResponse('Permission denied', 403);
    }

    const settings = await prisma.platformSetting.findMany({
      orderBy: { category: 'asc' },
    });

    return successResponse(settings);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'settings.manage')) {
      return errorResponse('Permission denied', 403);
    }

    const body = await req.json();
    const { key, value, category, reason } = body;

    if (!key || value === undefined || !reason) {
      return errorResponse('Key, value, and reason required', 400);
    }

    const existing = await prisma.platformSetting.findUnique({ where: { key } });

    const updated = await prisma.platformSetting.upsert({
      where: { key },
      update: { value, category: category || 'general' },
      create: { key, value, category: category || 'general' },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await AdminAuditService.logAction({
      adminUserId: adminSession.adminId,
      action: 'setting.update',
      targetType: 'platform_setting',
      targetId: key,
      beforeJson: existing ? { value: existing.value } : {},
      afterJson: { value },
      reason,
      ipAddress: ip,
    });

    return successResponse(updated, 'Platform setting saved');
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

