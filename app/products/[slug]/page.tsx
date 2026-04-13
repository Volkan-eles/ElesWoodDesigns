"use client";

import { products } from "@/data/products";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Star, Clock, BookOpen, Hammer, Check, 
  ArrowLeft, ShoppingCart, Download, ExternalLink,
  ChevronRight, Award, Toolbox
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const product = products.find(p => p.slug === params.slug);
  const [activeImage, setActiveImage] = useState<string>(product?.image || "");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container py-40 text-center">
        <h1>Plan Not Found</h1>
        <Link href="/products" className="btn btn-primary mt-8">Back to All Plans</Link>
      </div>
    );
  }

  const DIFFICULTY_COLOR: Record<string, string> = {
    Easy: "#2D5016",
    Medium: "#FF6B35",
    Hard: "#E63946",
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 mono text-xs">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:underline">Plans</Link>
          <ChevronRight size={12} />
          <span className="text-gray">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Images & Info */}
          <div className="lg:col-span-7">
            <div className="card bg-white p-4 mb-8 animate-fade">
              <div className="relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 min-h-[400px]">
                <Image 
                  src={activeImage || product.image} 
                  alt={product.name} 
                  width={1000}
                  height={1000}
                  style={{ 
                    width: 'auto', 
                    height: 'auto', 
                    maxWidth: '100%', 
                    maxHeight: '650px',
                    objectFit: 'contain'
                  }}
                  className="rounded-sm"
                  priority
                  unoptimized={true}
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 badge badge-orange z-20">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                {product.imagesThumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(product.images[idx])}
                    className={`relative w-24 h-24 flex-shrink-0 border-4 transition-all ${
                      activeImage === product.images[idx] ? "border-black scale-105" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image 
                      src={thumb} 
                      alt={`${product.name} thumbnail ${idx + 1}`} 
                      fill 
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="card bg-white p-8 animate-fade" style={{ animationDelay: "0.1s" }}>
              <h2 className="mb-6 pb-4 border-b">Project Details</h2>
              <p className="text-lg leading-relaxed mb-8">{product.longDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="flex items-center gap-2 mb-4 text-orange">
                    <Check size={20} strokeWidth={3} /> Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-black font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 mb-4 text-green">
                    <Toolbox size={20} strokeWidth={3} /> Materials
                  </h3>
                  <ul className="space-y-3">
                    {product.materials.map(m => (
                      <li key={m} className="flex items-start gap-2">
                        <span className="text-black font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions & Stats */}
          <div className="lg:col-span-5">
            <div className="card bg-white p-8 sticky top-32 animate-fade" style={{ animationDelay: "0.2s" }}>
              <div className="flex justify-between items-start mb-4">
                <span className="badge badge-cream">{product.category}</span>
                <div className="flex items-center gap-1">
                  <Star fill="#FFD60A" color="#FFD60A" size={16} />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray text-sm">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl mb-6">{product.name}</h1>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-gray-100 border-2 border-black">
                  <Clock size={20} className="mb-2" />
                  <span className="mono text-[10px] uppercase font-bold">Time</span>
                  <span className="font-bold text-sm text-center">{product.estimatedTime}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-100 border-2 border-black">
                  <Award size={20} className="mb-2" style={{ color: DIFFICULTY_COLOR[product.difficulty] }} />
                  <span className="mono text-[10px] uppercase font-bold">Difficulty</span>
                  <span className="font-bold text-sm">{product.difficulty}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-100 border-2 border-black">
                  <BookOpen size={20} className="mb-2" />
                  <span className="mono text-[10px] uppercase font-bold">Pages</span>
                  <span className="font-bold text-sm">{product.pages} PDF</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-gray mono">INC. VAT</span>
                </div>
                <p className="text-sm text-green font-bold">✓ Ready for instant download</p>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  className="btn btn-primary btn-lg btn-block py-6"
                  onClick={() => addItem(product)}
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
                <a 
                  href={product.etsy_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-lg btn-block py-6"
                >
                  <ExternalLink size={24} />
                  Buy on Etsy
                </a>
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-4 p-4 bg-yellow border-2 border-black rounded-sm">
                  <Download size={32} />
                  <div>
                    <p className="font-bold text-sm">Digital Product</p>
                    <p className="text-xs">No physical item will be shipped. A PDF link is provided after payment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .gap-2 { gap: 8px; }
        .gap-4 { gap: 16px; }
        .gap-8 { gap: 32px; }
        .gap-12 { gap: 48px; }
        .items-center { align-items: center; }
        .items-baseline { align-items: baseline; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .mb-1 { margin-bottom: 4px; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mb-10 { margin-bottom: 40px; }
        .mt-8 { margin-top: 32px; }
        .p-4 { padding: 16px; }
        .p-8 { padding: 32px; }
        .py-6 { padding-top: 24px; padding-bottom: 24px; }
        .py-40 { padding-top: 160px; padding-bottom: 160px; }
        .pb-4 { padding-bottom: 16px; }
        .border-b { border-bottom: 2px solid var(--black); }
        .border-t { border-top: 2px solid var(--black); }
        .sticky { position: sticky; }
        .top-32 { top: 128px; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-4xl { font-size: 2.25rem; }
        .font-bold { font-weight: 700; }
        .leading-relaxed { line-height: 1.625; }
        .space-y-3 > * + * { margin-top: 12px; }
        .aspect-video { aspect-ratio: 16 / 9; }
        
        @media (min-width: 1024px) {
          .lg\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
          .lg\:col-span-7 { grid-column: span 7 / span 7; }
          .lg\:col-span-5 { grid-column: span 5 / span 5; }
        }

        @media (min-width: 768px) {
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
}
