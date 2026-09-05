import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });

    const isMaintenance = setting ? setting.value === 'true' : false;
    const messageSetting = await prisma.platformSetting.findUnique({
      where: { key: 'maintenance_message' },
    });

    return successResponse({
      maintenanceMode: isMaintenance,
      message: messageSetting ? messageSetting.value : 'EarnSpace is undergoing scheduled maintenance. Please check back shortly.',
    });
  } catch (error: any) {
    console.error('Maintenance setting fetch error:', error);
    return errorResponse('Failed to fetch maintenance setting', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const { enabled, message } = await req.json();

    await prisma.platformSetting.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: String(enabled), category: 'maintenance' },
      create: { key: 'maintenance_mode', value: String(enabled), category: 'maintenance' },
    });

    if (message) {
      await prisma.platformSetting.upsert({
        where: { key: 'maintenance_message' },
        update: { value: message, category: 'maintenance' },
        create: { key: 'maintenance_message', value: message, category: 'maintenance' },
      });
    }

    // Log audit action
    await prisma.auditLog.create({
      data: {
        adminUserId: admin.adminId,
        action: 'setting.maintenance_toggle',
        targetType: 'setting',
        afterJson: JSON.stringify({ enabled, message }),
        reason: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} by admin`,
      },
    });

    return successResponse({ enabled, message }, `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error: any) {
    console.error('Maintenance update error:', error);
    return errorResponse('Failed to update maintenance settings', 500);
  }
}

