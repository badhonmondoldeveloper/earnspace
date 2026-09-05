import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }

    const programs = await prisma.monetizationProgram.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true, creators: true } },
      },
    });

    return successResponse(programs);
  } catch (error) {
    console.error('Admin programs error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }

    const body = await req.json();
    const { name, type, description, eligibilityRulesJson, revenueSharePercent, minimumThreshold, pendingDays } = body;

    if (!name || !type || !description) {
      return errorResponse('Program name, type, and description are required', 400);
    }

    const program = await prisma.monetizationProgram.create({
      data: {
        name,
        type,
        description,
        eligibilityRulesJson: typeof eligibilityRulesJson === 'string' ? eligibilityRulesJson : JSON.stringify(eligibilityRulesJson || {}),
        revenueSharePercent: revenueSharePercent || 70.0,
        minimumThreshold: minimumThreshold || 100.0,
        pendingDays: pendingDays || 7,
        status: 'active',
      },
    });

    return successResponse(program, 'Monetization program created successfully', 201);
  } catch (error) {
    console.error('Admin create program error:', error);
    return errorResponse('Internal server error', 500);
  }
}

