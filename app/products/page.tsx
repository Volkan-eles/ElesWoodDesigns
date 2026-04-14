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
      <div className="mb-12 border-b-4 border-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
          Woodworking<br />Plans
        </h1>
        <div className="max-w-3xl">
          <p className="font-bold text-lg mb-6 leading-relaxed">
            Transform your workshop with our professional, field-tested DIY woodworking plans. Whether you're building a grand pergola for your garden, a modern farmhouse dining table, or a secure wood storage shed, ElesWoodDesigns provides the precision blueprints you need to succeed.
          </p>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-sm leading-loose">
            Every plan in our collection is meticulously crafted with the modern maker in mind. We provide more than just a sketch; each download includes a comprehensive PDF guide featuring hyper-realistic 3D assembly diagrams, a precise cut list to minimize waste, and a full material shopping list to streamline your trip to the lumber yard. From beginner-friendly garden projects to advanced furniture builds, our blueprints ensure professional results every time. Build it yourself, build it bold, and build it to last.
          </p>
        </div>
      </div>
      
      <ProductListingClient initialProducts={products} />
    </div>
  );
}
