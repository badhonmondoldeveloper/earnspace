export interface AdPlacementConfig {
  slotKey: string;
  name: string;
  category: 'feed' | 'website' | 'profile' | 'blog' | 'store' | 'sidebar';
  allowedFormats: ('banner' | 'native_bento' | 'sticky_footer' | 'interstitial' | 'sponsored_card')[];
  defaultProvider: 'house_ads' | 'direct_advertiser' | 'external_network';
  revShareEligible: boolean;
  defaultRevSharePercent: number; // e.g. 50% to creator/space owner
  description: string;
}

export const AD_PLACEMENT_REGISTRY: Record<string, AdPlacementConfig> = {
  feed_inline_native: {
    slotKey: 'feed_inline_native',
    name: 'Main Feed Native Card',
    category: 'feed',
    allowedFormats: ['native_bento', 'sponsored_card'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 50,
    description: 'Blends natively between posts in user news feed',
  },
  website_hero_banner: {
    slotKey: 'website_hero_banner',
    name: 'Website Studio Header Banner',
    category: 'website',
    allowedFormats: ['banner'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 60,
    description: 'Displays banner at top or header of published user website spaces',
  },
  website_bento_grid: {
    slotKey: 'website_bento_grid',
    name: 'Website Studio Bento Grid Block',
    category: 'website',
    allowedFormats: ['native_bento', 'sponsored_card'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 60,
    description: 'Custom block inside website studio pages supporting sponsored cards',
  },
  website_sticky_footer: {
    slotKey: 'website_sticky_footer',
    name: 'Website Studio Floating Footer Banner',
    category: 'website',
    allowedFormats: ['sticky_footer'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 60,
    description: 'Floating bottom banner bar on published website pages',
  },
  profile_sidebar_bento: {
    slotKey: 'profile_sidebar_bento',
    name: 'User Profile Sidebar Banner',
    category: 'profile',
    allowedFormats: ['banner', 'native_bento'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 50,
    description: 'Sidebar card on creator profile pages',
  },
  blog_article_inline: {
    slotKey: 'blog_article_inline',
    name: 'Blog Article Mid-Content Ad',
    category: 'blog',
    allowedFormats: ['banner', 'sponsored_card'],
    defaultProvider: 'house_ads',
    revShareEligible: true,
    defaultRevSharePercent: 55,
    description: 'Native ad placed inside long-form blog article bodies',
  },
  store_featured_product: {
    slotKey: 'store_featured_product',
    name: 'Digital Marketplace Sponsored Card',
    category: 'store',
    allowedFormats: ['sponsored_card'],
    defaultProvider: 'direct_advertiser',
    revShareEligible: false,
    defaultRevSharePercent: 0,
    description: 'Promoted products card in marketplace grid',
  },
};

export function getPlacementConfig(slotKey: string): AdPlacementConfig {
  return (
    AD_PLACEMENT_REGISTRY[slotKey] || {
      slotKey,
      name: 'Custom Ad Slot',
      category: 'website',
      allowedFormats: ['banner', 'native_bento'],
      defaultProvider: 'house_ads',
      revShareEligible: true,
      defaultRevSharePercent: 50,
      description: 'Standard EarnSpace ad placement slot',
    }
  );
}
