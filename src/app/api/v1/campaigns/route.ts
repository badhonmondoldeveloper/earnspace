import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: { select: { companyName: true, website: true } },
      },
    });

    return successResponse(campaigns);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { campaignId } = body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || campaign.status !== 'active') {
      return errorResponse('Campaign not active or not found', 404);
    }

    const existing = await prisma.campaignParticipant.findUnique({
      where: {
        campaignId_userId: { campaignId, userId: session.userId },
      },
    });

    if (existing) {
      return successResponse(existing, 'Already participating in this campaign');
    }

    const participant = await prisma.campaignParticipant.create({
      data: {
        campaignId,
        userId: session.userId,
        status: 'joined',
      },
    });

    return successResponse(participant, 'Joined campaign successfully', 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

