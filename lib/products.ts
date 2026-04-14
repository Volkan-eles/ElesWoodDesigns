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
  originalPrice?: number;
  bestseller?: boolean;
}

const products: Product[] = productsData as Product[];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
