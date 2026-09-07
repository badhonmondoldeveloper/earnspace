import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { DeviceAuthService } from '@/services/deviceAuthService';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const devices = await prisma.paymentDevice.findMany({
      where: { userId: session.userId },
      orderBy: { lastSeenAt: 'desc' },
    });

    return successResponse(devices, 'Paired companion devices retrieved');
  } catch (error: any) {
    console.error('GET /api/v1/wallet/devices error:', error);
    return errorResponse(error.message || 'Failed to fetch devices', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { deviceName, devicePublicKey, appVersion } = body;

    if (!deviceName || !devicePublicKey) {
      return errorResponse('deviceName and devicePublicKey are required', 400);
    }

    const device = await DeviceAuthService.registerDevice(
      session.userId,
      deviceName,
      devicePublicKey,
      appVersion
    );

    return successResponse(device, 'Android companion device paired successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/wallet/devices error:', error);
    return errorResponse(error.message || 'Failed to pair device', 500);
  }
}
