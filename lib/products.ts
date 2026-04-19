import productsData from '@/data/etsy_products.json';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
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
  polar_price_id?: string;
  originalPrice?: number;
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

const products: Product[] = (productsData as Product[]).map(p => ({
  ...p,
  slug: normalizeSlug(p.slug),
}));

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const normalizedInput = normalizeSlug(slug);
  return products.find(p => p.slug === normalizedInput);
}
