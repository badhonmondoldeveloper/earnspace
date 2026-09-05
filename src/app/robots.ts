import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://earnspace.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/messages/', '/settings/', '/notifications/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

