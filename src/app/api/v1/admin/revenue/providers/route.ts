import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'ads.view')) {
      return errorResponse('Permission denied', 403);
    }

    const providers = await prisma.adProvider.findMany({
      orderBy: { priority: 'asc' },
    });

    // Hide sensitive API credentials from list response
    const safeProviders = providers.map((p) => ({
      ...p,
      credentialsJson: '[PROTECTED]',
    }));

    return successResponse(safeProviders);
  } catch (error) {
    console.error('Admin ad providers error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'ads.providers.manage')) {
      return errorResponse('Permission denied', 403);
    }

    const { name, providerKey, priority, placementsJson, credentialsJson } = await req.json();
    if (!name || !providerKey) {
      return errorResponse('Provider name and key are required', 400);
    }

    const provider = await prisma.adProvider.create({
      data: {
        name,
        providerKey,
        priority: priority || 1,
        placementsJson: typeof placementsJson === 'string' ? placementsJson : JSON.stringify(placementsJson || []),
        credentialsJson: typeof credentialsJson === 'string' ? credentialsJson : JSON.stringify(credentialsJson || {}),
        status: 'active',
      },
    });

    return successResponse(provider, 'Ad provider created successfully', 201);
  } catch (error) {
    console.error('Admin create ad provider error:', error);
    return errorResponse('Internal server error', 500);
  }
}

