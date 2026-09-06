import { prisma } from '@/lib/prisma';
import { AdPlacementRequest, AdPlacementResponse } from './adProviderInterface';

export class AdProviderManager {
  static async getPlacementWithFallback(request: AdPlacementRequest): Promise<AdPlacementResponse | null> {
    const { slotName } = request;

    try {
      // Fetch active providers ordered by priority (1 = highest priority)
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

        const isSupported = placements.includes(slotName) || placements.includes('all') || placements.includes('feed');
        if (isSupported) {
          // If code snippet is available (Google AdSense, Adsterra, Custom Snippet)
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

          // If direct banner credentials are stored
          if (provider.providerType === 'direct_banner' && provider.credentialsJson) {
            try {
              const creds = JSON.parse(provider.credentialsJson);
              if (creds.destinationUrl) {
                return {
                  providerKey: provider.providerKey,
                  providerName: provider.name,
                  slotName,
                  format: 'banner',
                  title: creds.title || provider.name,
                  description: creds.description,
                  mediaUrl: creds.mediaUrl,
                  destinationUrl: creds.destinationUrl,
                  ctaText: creds.ctaText || 'Learn More',
                  isFallback: false,
                };
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error('AdProviderManager DB lookup error:', err);
    }

    // Native House Promotion Fallback
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
