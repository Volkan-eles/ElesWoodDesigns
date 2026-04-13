import productsData from './etsy_products.json';

export type Category = "Furniture" | "Garden" | "Decoration" | "Kids" | "Kitchen";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  reviewCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  pages: number;
  description: string;
  longDescription: string;
  features: string[];
  materials: string[];
  image: string;
  badge?: string;
  etsy_url?: string;
  bestseller?: boolean;
}

export const products: Product[] = productsData as Product[];
