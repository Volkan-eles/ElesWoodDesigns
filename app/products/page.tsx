"use client";

import { products, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo } from "react";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: string[] = ["All", "Furniture", "Garden", "Decoration", "Kids", "Kitchen"];
  const difficulties: string[] = ["All", "Easy", "Medium", "Hard"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      <div className="container">
        <header className="mb-12">
          <h1 className="mb-4">All Plans</h1>
          <p className="text-gray max-w-2xl">
            Find the wood project of your dreams. All our plans are professionally prepared,
            including detailed parts lists and step-by-step instructions.
          </p>
        </header>

        {/* Filters Section */}
        <div className="card bg-white p-8 mb-12 animate-fade">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 w-full">
              <label className="block mono text-xs font-bold mb-2 uppercase">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plans... (table, shelf, etc.)"
                  className="input pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="block mono text-xs font-bold mb-2 uppercase">Category</label>
              <select 
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="w-full md:w-48">
              <label className="block mono text-xs font-bold mb-2 uppercase">Difficulty</label>
              <select 
                className="input"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {(selectedCategory !== "All" || selectedDifficulty !== "All" || searchQuery !== "") && (
              <button 
                className="btn btn-outline btn-sm h-[50px]"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSearchQuery("");
                }}
              >
                <X size={16} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid-3">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fade" style={{ animationDelay: `${(index % 8) * 0.1}s` }}>
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 card bg-white">
            <h3 className="mb-4">No matching plans found.</h3>
            <p className="text-gray mb-8">Try changing your filters or using a different search term.</p>
            <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSearchQuery("");
                }}
              >
                Show All
              </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1; }
        .items-end { align-items: flex-end; }
        .gap-8 { gap: 32px; }
        .w-full { width: 100%; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-8 { margin-bottom: 32px; }
        .mb-12 { margin-bottom: 48px; }
        .pt-24 { padding-top: 96px; }
        .pb-20 { padding-bottom: 80px; }
        .pr-10 { padding-right: 40px; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .right-4 { right: 16px; }
        .top-1/2 { top: 50%; }
        .-translate-y-1/2 { transform: translateY(-50%); }
        .block { display: block; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .text-gray { color: var(--gray-600); }
        .max-w-2xl { max-width: 42rem; }
        .text-center { text-align: center; }
        .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
        .p-8 { padding: 32px; }
        
        @media (min-width: 768px) {
          .md\:flex-row { flex-direction: row; }
          .md\:w-48 { width: 12rem; }
        }
      `}</style>
    </div>
  );
}
