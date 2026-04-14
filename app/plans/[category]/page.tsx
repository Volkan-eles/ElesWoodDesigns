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

  const getCategoryDescription = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'garden':
        return "Transform your outdoor space into a personal sanctuary with our professional garden woodworking plans. From grand pergolas and privacy walls to functional garden beds and storage sheds, our blueprints provide the precision and detail you need to enhance your landscaping with structures that are as durable as they are beautiful.";
      case 'furniture':
        return "Build heirloom-quality pieces for your home with our expert furniture woodworking plans. Whether you're crafting a modern farmhouse dining table, a minimalist coffee table, or a custom shelving unit, our step-by-step guides offer the technical depth required to achieve professional finishes and structural longevity.";
      case 'kids':
        return "Create safe, fun, and imaginative spaces for the next generation. Our kids' woodworking projects range from sturdy jungle gyms and playhouses to beginner-friendly toy boxes and learning towers. Every plan is designed with safety and durability in mind, ensuring years of active play and exploration.";
      case 'decoration':
        return "Add the final touches to your home with our unique woodworking decoration plans. These smaller-scale projects include modern planters, geometric wall art, and custom organizer boxes – perfect for honing your skills while creating beautiful, functional accents for any interior.";
      default:
        return "Professional DIY woodworking blueprints designed for the modern maker. Every plan comes with a full material list, precise cut list, and step-by-step 3D diagrams.";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12 border-b-4 border-black pb-12">
        <div className="inline-block bg-[#FFE500] text-black border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-widest mb-6 shadow-neo-sm">
           Category: {dataCategory}
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
          {dataCategory}<br />Plans
        </h1>
        <div className="max-w-2xl">
          <p className="font-bold text-lg mb-6 leading-relaxed">
            {getCategoryDescription(category)}
          </p>
          <p className="font-bold text-gray-400 uppercase tracking-widest text-xs leading-loose">
            All our {dataCategory.toLowerCase()} blueprints include instant digital access to a high-resolution PDF guide. You'll receive clear 3D assembly diagrams, a complete shopping list to save time at the yard, and a precise cut list optimized for the best lumber yield.
          </p>
        </div>
      </div>
      
      <ProductListingClient initialProducts={filteredProducts} />
    </div>
  );
}
