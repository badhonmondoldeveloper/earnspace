import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    let plans = await prisma.subscriptionPlan.findMany({
      where: { status: 'active' },
      orderBy: { price: 'asc' },
    });

    if (plans.length === 0) {
      // Seed default subscription plans
      plans = await prisma.$transaction([
        prisma.subscriptionPlan.create({
          data: {
            name: 'Free',
            description: 'Social profile, block website, basic posts & blogging',
            price: 0.0,
            billingInterval: 'monthly',
            featuresJson: JSON.stringify([
              'Social Profile (/@username)',
              'Block Website Builder (/space/username)',
              'Public Posts & Stories',
              'Basic Blogging',
            ]),
          },
        }),
        prisma.subscriptionPlan.create({
          data: {
            name: 'Creator Pro',
            description: 'For active creators looking to monetize and customize',
            price: 15.0,
            billingInterval: 'monthly',
            featuresJson: JSON.stringify([
              'All Free Features',
              'Creator Earning Dashboard & Wallet',
              'Custom Website Themes',
              'Partner Campaign Participation',
              'Priority Support',
            ]),
          },
        }),
        prisma.subscriptionPlan.create({
          data: {
            name: 'Business',
            description: 'For brands and businesses launching campaigns & ads',
            price: 49.0,
            billingInterval: 'monthly',
            featuresJson: JSON.stringify([
              'All Creator Pro Features',
              'Advertiser Ad Portal & Campaign Management',
              'Advanced Analytics',
              'Dedicated Campaign Manager',
            ]),
          },
        }),
      ]);
    }

    const session = await getSession();
    let currentSubscription = null;
    if (session) {
      currentSubscription = await prisma.subscription.findFirst({
        where: { userId: session.userId, status: 'active' },
        include: { plan: true },
      });
    }

    return successResponse({ plans, currentSubscription });
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
    const { planId } = body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return errorResponse('Plan not found', 444);
    }

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.userId,
        planId: plan.id,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextMonth,
      },
      include: { plan: true },
    });

    return successResponse(subscription, `Subscribed to ${plan.name} plan`, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

