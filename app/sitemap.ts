import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { getPosts } from '@/lib/blog';

// Static date — update this when you publish new content
// Using a fixed date prevents Google from thinking all URLs change every second
const LAST_UPDATED = '2026-04-26';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eleswooddesigns.com';

  // --- Products ---
  const products = getProducts();
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // --- Blog Posts ---
  const blogPosts = getPosts();
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // --- Category pages ---
  const categories = [
    'furniture',
    'garden',
    'outdoor',
    'kitchen',
    'workshop',
    'digital',
    'kids',
    'bedroom',
  ];
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/plans/${cat}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    // Core pages — highest priority
    {
      url: `${baseUrl}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Secondary pages
    {
      url: `${baseUrl}/about/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Category pages
    ...categoryUrls,
    // All 79 product pages
    ...productUrls,
    // Blog posts
    ...blogUrls,
  ];
}
