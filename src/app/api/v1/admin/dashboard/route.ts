import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalPosts,
      totalBlogs,
      totalStories,
      pendingReports,
      activeCampaigns,
      earningsAggregate,
      pendingWithdrawals,
      completedWithdrawals,
      riskAlertsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { status: 'suspended' } }),
      prisma.post.count(),
      prisma.blog.count(),
      prisma.story.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.campaign.count({ where: { status: 'active' } }),
      prisma.creatorEarning.aggregate({
        _sum: { grossAmount: true, userShare: true, platformShare: true },
      }),
      prisma.withdrawalRequest.count({ where: { status: 'requested' } }),
      prisma.withdrawalRequest.count({ where: { status: 'paid' } }),
      prisma.riskEvent.count({ where: { riskLevel: 'critical' } }),
    ]);

    return successResponse({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
      },
      content: {
        posts: totalPosts,
        blogs: totalBlogs,
        stories: totalStories,
        reports: pendingReports,
      },
      revenue: {
        gross: earningsAggregate._sum.grossAmount || 0,
        userShare: earningsAggregate._sum.userShare || 0,
        platformShare: earningsAggregate._sum.platformShare || 0,
      },
      withdrawals: {
        pending: pendingWithdrawals,
        completed: completedWithdrawals,
      },
      campaigns: activeCampaigns,
      riskAlerts: riskAlertsCount,
    });
  } catch (error) {
    console.error('Admin Dashboard error:', error);
    return errorResponse('Internal server error', 500);
  }
}

