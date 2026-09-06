import { prisma } from '@/lib/prisma';
import { AdPlacementRequest, AdPlacementResponse } from './adProviderInterface';

export class AdProviderManager {
  static async getPlacementWithFallback(request: AdPlacementRequest): Promise<AdPlacementResponse | null> {
    const { slotName } = request;

    try {
      // 1. Fetch active providers ordered by priority (1 = highest priority)
      const activeProviders = await prisma.adProvider.findMany({
        where: { status: 'active' },
        orderBy: { priority: 'asc' },
      });

      for (const provider of activeProviders) {
        let placements: string[] = [];
        try {
          placements = JSON.parse(provider.placementsJson || '[]');
        } catch (e) {
          placements = ['all', 'feed'];
        }

        // Check if provider supports the requested slotName or "all"
        const isSupported = placements.includes(slotName) || placements.includes('all') || placements.includes('feed');
        if (isSupported) {
          if (provider.adCodeSnippet && provider.adCodeSnippet.trim()) {
            return {
              providerKey: provider.providerKey,
              providerName: provider.name,
              slotName,
              format: 'code_snippet',
              adContentHtml: provider.adCodeSnippet,
              isFallback: false,
            };
          }
        }
      }
    } catch (err) {
      console.error('AdProviderManager DB lookup error:', err);
    }

    // 2. Return fallback Native Promotion response if no active code provider matches
    return {
      providerKey: 'house',
      providerName: 'EarnSpace Native Promotion',
      slotName,
      format: 'native',
      title: 'Monetize Your Content on EarnSpace',
      description: 'Join the EarnSpace Creator Partner Program and earn revenue share from your posts, videos, and reels.',
      destinationUrl: '/creator/monetization',
      ctaText: 'Apply Now',
      isFallback: true,
    };
  }
}
