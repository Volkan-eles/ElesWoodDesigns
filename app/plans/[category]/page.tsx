import { getProducts } from "@/lib/products";
import ProductListingClient from "../../products/ProductListingClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Define existing categories from the data
const VALID_CATEGORIES = ["furniture", "garden", "kids", "decoration"];

// Map URL slugs back to data category names
const mapSlugToCategory = (slug: string) => {
  const map: Record<string, string> = {
    furniture: "Furniture",
    garden: "Garden",
    kids: "Kids",
    decoration: "Decoration"
  };
  return map[slug.toLowerCase()];
};

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `Best DIY ${decodedCategory} Woodworking Plans | Step-by-Step PDF Guides`,
    description: `Browse our collection of high-quality DIY ${category} woodworking plans. Each plan includes 3D diagrams, material lists, and cut lists. Download and build your next ${category} project today.`,
    alternates: {
      canonical: `/plans/${category}/`,
    },
    openGraph: {
      title: `Top Rated DIY ${decodedCategory} Plans | ElesWoodDesigns`,
      description: `Premium ${category} blueprints for makers and DIY enthusiasts.`,
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const dataCategory = mapSlugToCategory(category);
  
  if (!dataCategory) notFound();

  const allProducts = getProducts();
  const filteredProducts = allProducts.filter(p => p.category === dataCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <div className="inline-block bg-[#FFE500] text-black border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 shadow-neo-sm">
           Category: {dataCategory}
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">
          {dataCategory}<br />Plans
        </h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm max-w-xl">
          Professional DIY {dataCategory.toLowerCase()} blueprints. Every plan comes with a full material list, precise cut list, and step-by-step 3D diagrams.
        </p>
      </div>
      
      <ProductListingClient initialProducts={filteredProducts} />
    </div>
  );
}
