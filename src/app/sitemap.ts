import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://earnspace.com';

  const publicRoutes = [
    '',
    '/about',
    '/features',
    '/how-it-works',
    '/creators',
    '/explore',
    '/blog',
    '/pricing',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/community-guidelines',
    '/monetization-policy',
    '/referral-policy',
    '/withdrawal-policy',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

