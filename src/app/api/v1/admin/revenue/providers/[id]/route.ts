import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'ads.providers.manage')) {
      return errorResponse('Permission denied', 403);
    }

    const { id } = params;
    const body = await req.json();
    const { name, providerKey, providerType, priority, placementsJson, adCodeSnippet, headCodeSnippet, credentialsJson, status } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (providerKey !== undefined) updateData.providerKey = providerKey;
    if (providerType !== undefined) updateData.providerType = providerType;
    if (priority !== undefined) updateData.priority = parseInt(priority);
    if (placementsJson !== undefined) {
      updateData.placementsJson = typeof placementsJson === 'string' ? placementsJson : JSON.stringify(placementsJson);
    }
    if (credentialsJson !== undefined) {
      updateData.credentialsJson = typeof credentialsJson === 'string' ? credentialsJson : JSON.stringify(credentialsJson);
    }
    if (adCodeSnippet !== undefined) updateData.adCodeSnippet = adCodeSnippet;
    if (headCodeSnippet !== undefined) updateData.headCodeSnippet = headCodeSnippet;
    if (status !== undefined) updateData.status = status;

    const provider = await prisma.adProvider.update({
      where: { id },
      data: updateData,
    });

    return successResponse(provider, 'Ad provider updated successfully');
  } catch (error: any) {
    console.error('Admin update ad provider error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'ads.providers.manage')) {
      return errorResponse('Permission denied', 403);
    }

    const { id } = params;
    await prisma.adProvider.delete({
      where: { id },
    });

    return successResponse(null, 'Ad provider deleted successfully');
  } catch (error: any) {
    console.error('Admin delete ad provider error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
