"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

export default function ProductListingClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || p.category.toUpperCase() === category;
      const matchesDifficulty = difficulty === "ALL" || p.difficulty.toUpperCase() === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [initialProducts, search, category, difficulty]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <div className="lg:col-span-1 flex flex-col gap-8">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar 
          activeCategory={category} 
          onCategoryChange={setCategory}
          activeDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
        
        <div className="bg-black text-white p-6 border-4 border-white shadow-neo">
          <h4 className="font-black text-xl mb-2 italic">PRO TIP:</h4>
          <p className="font-bold text-sm text-gray-300">Measure twice, cut once! All our plans come with a full material list to save you time at the lumber yard.</p>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-4 border-dashed border-black bg-white">
            <h3 className="text-3xl font-black mb-4 uppercase text-center px-4">No plans matching<br />your search.</h3>
            <button 
              onClick={() => { setSearch(""); setCategory("ALL"); setDifficulty("ALL"); }}
              className="btn-neo"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
