import { getProducts } from "@/lib/products";
import ProductListingClient from "./ProductListingClient";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Plans | ElesWoodDesigns",
  description: "Browse all our high-quality DIY woodworking plans.",
  alternates: {
    canonical: "/products/",
  },
};

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const products = getProducts();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none">All Plans</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Find your next project. Build something bold.</p>
      </div>
      
      <ProductListingClient initialProducts={products} />
    </div>
  );
}
