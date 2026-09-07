import { prisma } from '@/lib/prisma';

export class HouseAdService {
  /**
   * Fetch fallback platform House Ads for a specific placement slot
   */
  static async getHouseAd(placement: string) {
    try {
      const houseAd = await prisma.houseAd.findFirst({
        where: {
          status: 'active',
          placement: { in: [placement, 'feed', 'all'] },
        },
        orderBy: { priority: 'asc' },
      });

      if (houseAd) {
        return {
          id: houseAd.id,
          providerKey: 'house',
          format: 'house_banner',
          title: houseAd.title,
          description: houseAd.description,
          mediaUrl: houseAd.mediaUrl,
          destinationUrl: houseAd.destinationUrl,
          ctaText: houseAd.ctaText,
          isHouseAd: true,
        };
      }

      // Default platform announcement house ad fallback
      return {
        id: 'house_default_01',
        providerKey: 'house',
        format: 'house_banner',
        title: 'Join the EarnSpace Creator Program',
        description: 'Publish original videos & reels and build your audience on EarnSpace.',
        mediaUrl: '/assets/house_ad_banner.png',
        destinationUrl: '/monetization',
        ctaText: 'Learn More',
        isHouseAd: true,
      };
    } catch (error) {
      console.error('Error fetching HouseAd:', error);
      return {
        id: 'house_fallback_emergency',
        providerKey: 'house',
        format: 'house_banner',
        title: 'EarnSpace Content Creator Hub',
        description: 'Monetize your creative content with EarnSpace Multi-Revenue Engine.',
        mediaUrl: null,
        destinationUrl: '/creator',
        ctaText: 'Get Started',
        isHouseAd: true,
      };
    }
  }

  /**
   * Create or update House Ads (Admin)
   */
  static async createHouseAd(data: {
    title: string;
    description?: string;
    mediaUrl?: string;
    destinationUrl: string;
    ctaText?: string;
    placement?: string;
    priority?: number;
  }) {
    return prisma.houseAd.create({
      data: {
        title: data.title,
        description: data.description,
        mediaUrl: data.mediaUrl,
        destinationUrl: data.destinationUrl,
        ctaText: data.ctaText || 'Learn More',
        placement: data.placement || 'feed',
        priority: data.priority || 1,
        status: 'active',
      },
    });
  }

  static async listHouseAds() {
    return prisma.houseAd.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateHouseAd(
    id: string,
    data: {
      title?: string;
      description?: string;
      mediaUrl?: string;
      destinationUrl?: string;
      ctaText?: string;
      placement?: string;
      priority?: number;
      status?: string;
    }
  ) {
    return prisma.houseAd.update({
      where: { id },
      data,
    });
  }

  static async toggleHouseAdStatus(id: string) {
    const existing = await prisma.houseAd.findUnique({ where: { id } });
    if (!existing) throw new Error('House Ad not found');
    const newStatus = existing.status === 'active' ? 'paused' : 'active';
    return prisma.houseAd.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  static async deleteHouseAd(id: string) {
    return prisma.houseAd.delete({
      where: { id },
    });
  }
}


