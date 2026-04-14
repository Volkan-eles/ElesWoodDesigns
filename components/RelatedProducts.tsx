import { getProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedProducts({ currentSlug, category }: RelatedProductsProps) {
  const allProducts = getProducts();
  
  // Try to find products in the same category first, excluding the current one
  let related = allProducts.filter(p => p.category === category && p.slug !== currentSlug);
  
  // If not enough in the same category, fill with other bestsellers
  if (related.length < 3) {
    const others = allProducts.filter(p => p.slug !== currentSlug && p.category !== category && p.bestseller);
    related = [...related, ...others];
  }
  
  // Only take top 3
  const topRelated = related.slice(0, 3);

  if (topRelated.length === 0) return null;

  return (
    <div className="mt-24 pt-12 border-t-4 border-black">
      <div className="flex flex-col items-center text-center mb-10">
        <span className="bg-black text-white px-2 py-1 font-bold text-xs uppercase tracking-widest mb-2">Customers Also Bought</span>
        <h2 className="text-4xl font-black uppercase">Related Plans</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topRelated.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
