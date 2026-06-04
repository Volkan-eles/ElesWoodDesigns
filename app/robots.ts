import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/pin/'],
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/'],
      },
      {
        userAgent: 'Pinterestbot',
        allow: ['/', '/api/pin/'],
        disallow: ['/admin/'],
      },
    ],
    sitemap: 'https://eleswooddesigns.com/sitemap.xml',
    host: 'https://eleswooddesigns.com',
  };
}
