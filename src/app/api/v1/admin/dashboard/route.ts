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
    if (!hasAdminPermission(adminSession.role, 'analytics.view')) {
      return errorResponse('Permission denied', 403);
    }

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      bannedUsers,
      newUsersToday,
      newUsersThisWeek,
      totalCreators,
      activeCreators,
      monetizedCreatorGroups,
      pendingCreatorApplications,
      totalBusinesses,
      totalPosts,
      totalPhotos,
      totalVideos,
      totalReels,
      totalBlogs,
      totalStories,
      totalComments,
      pendingReports,
      activeCampaigns,
      activeAdvertisers,
      earningsAggregate,
      pendingWithdrawals,
      completedWithdrawals,
      riskAlertsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { status: 'suspended' } }),
      prisma.user.count({ where: { status: 'banned' } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.user.count({ where: { accountType: 'CREATOR' } }),
      prisma.user.count({ where: { accountType: 'CREATOR', status: 'active' } }),
      prisma.creatorMonetization.groupBy({ by: ['userId'], where: { status: 'active' } }),
      prisma.monetizationApplication.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { accountType: 'BUSINESS' } }),
      prisma.post.count(),
      prisma.postMedia.count({ where: { type: { in: ['image', 'photo'] } } }),
      prisma.video.count(),
      prisma.reel.count(),
      prisma.blog.count(),
      prisma.story.count(),
      prisma.comment.count(),
      prisma.report.count({ where: { status: { in: ['pending', 'open'] } } }),
      prisma.campaign.count({ where: { status: 'active' } }),
      prisma.advertiser.count({ where: { status: 'active' } }),
      prisma.creatorEarning.aggregate({
        _sum: { grossAmount: true, userShare: true, platformShare: true },
      }),
      prisma.withdrawalRequest.count({ where: { status: { in: ['requested', 'under_review'] } } }),
      prisma.withdrawalRequest.count({ where: { status: 'paid' } }),
      prisma.riskEvent.count({ where: { riskLevel: 'critical' } }),
    ]);

    return successResponse({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        banned: bannedUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
      },
      creators: {
        total: totalCreators,
        active: activeCreators,
        monetized: monetizedCreatorGroups.length,
        pendingApplications: pendingCreatorApplications,
      },
      businesses: {
        total: totalBusinesses,
      },
      content: {
        posts: totalPosts,
        photos: totalPhotos,
        videos: totalVideos,
        reels: totalReels,
        blogs: totalBlogs,
        stories: totalStories,
        comments: totalComments,
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
      advertisers: activeAdvertisers,
      riskAlerts: riskAlertsCount,
    });
  } catch (error) {
    console.error('Admin Dashboard error:', error);
    return errorResponse('Internal server error', 500);
  }
}

