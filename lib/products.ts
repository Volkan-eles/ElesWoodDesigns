import productsData from '@/data/etsy_products.json';

export interface Product {
  id: string;
  slug: string;
  name: string;
  title: string;
  shortTitle: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  reviews: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  timeEstimate: string;
  pages: number;
  description: string;
  longDescription: string;
  features: string[];
  tags: string[];
  materials: string[];
  image: string;
  thumbnail: string;
  images: string[];
  imagesThumbnails: string[];
  etsy_url: string;
  etsyUrl?: string;
  polar_price_id?: string;
  polarCheckoutUrl?: string;
  bestseller?: boolean;
}

/** Normalize Turkish / non-ASCII chars so slugs are always valid URL segments */
function normalizeSlug(slug: string): string {
  return slug
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c');
}

const products: Product[] = (productsData as any[]).map(p => {
  const name = p.name || "";
  const shortTitle = name.split('|')[0].trim().split(':')[0].trim();
  const originalPrice = p.originalPrice || p.price;
  const discount = originalPrice > 0 ? Math.round((1 - p.price / originalPrice) * 100) : 0;
  const categorySlug = p.category ? p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') : "";
  return {
    ...p,
    slug: normalizeSlug(p.slug),
    title: name,
    shortTitle,
    reviews: p.reviewCount || 0,
    discount,
    categorySlug,
    timeEstimate: p.estimatedTime || "8 hours",
    polarCheckoutUrl: p.polar_price_id ? `https://buy.polar.sh/${p.polar_price_id}` : undefined,
    etsyUrl: p.etsy_url,
  };
});

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const normalizedInput = normalizeSlug(slug);
  return products.find(p => p.slug === normalizedInput);
}
