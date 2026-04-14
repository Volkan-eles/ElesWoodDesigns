import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // Replace with the actual production domain later (e.g., https://eleswooddesigns.com)
    sitemap: 'https://eleswooddesigns.com/sitemap.xml',
  };
}
