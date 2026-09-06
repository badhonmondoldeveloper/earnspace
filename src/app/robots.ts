import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://earnspace-chi.vercel.app';

  return {
    rules: [
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/messages/', '/settings/', '/notifications/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
