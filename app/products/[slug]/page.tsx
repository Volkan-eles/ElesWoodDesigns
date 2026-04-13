"use client";

import { products } from "@/data/products";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Star, Clock, BookOpen, Hammer, Check, 
  ShoppingCart, Download, ChevronRight, 
  Toolbox, ShieldCheck, Truck, Store,
  ChevronLeft, Heart, Share2, Info
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
        <h1 className="text-2xl font-bold">Plan Not Found</h1>
        <Link href="/products" className="btn btn-primary mt-8">Back to All Plans</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20 pb-20">
      <div className="container px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-primary">Woodworking Plans</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. LEFT COLUMN: Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                <Image 
                  src={activeImage || product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-4 transition-transform duration-500"
                  priority
                  unoptimized={true}
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">BEST SELLER</span>
                  {product.badge && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">{product.badge}</span>
                  )}
                </div>

                {/* Interaction Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:text-primary transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center hover:bg-white transition-all transform -translate-x-12 group-hover:translate-x-0">
                  <ChevronLeft size={24} />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center hover:bg-white transition-all transform translate-x-12 group-hover:translate-x-0">
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.imagesThumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(product.images[idx])}
                      className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === product.images[idx] ? "border-primary shadow-sm" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <Image src={thumb} alt="thumb" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. MIDDLE COLUMN: Info */}
          <div className="lg:col-span-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-primary hover:underline cursor-pointer">WoodCraft Plans</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center text-primary font-bold text-sm">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" className="opacity-30" />
                  <span className="ml-1">4.9</span>
                </div>
              </div>

              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">${(product.price * 1.5).toFixed(2)}</span>
                <span className="text-green-600 font-bold text-sm">-30%</span>
              </div>

              {/* Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Clock size={16} /></div>
                  <span className="font-medium">Build Time: <b>{product.estimatedTime}</b></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><BookOpen size={16} /></div>
                  <span className="font-medium">Documentation: <b>{product.pages} Page Detailed PDF</b></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Hammer size={16} /></div>
                  <span className="font-medium">Difficulty Level: <b>{product.difficulty}</b></span>
                </div>
              </div>

              {/* Detail Tabs/Accordions */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                   <Info size={18} className="text-gray-400" />
                   What's included?
                </h3>
                <ul className="space-y-3">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: Buy Box */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
                <div className="mb-6">
                  <div className="text-2xl font-extrabold text-primary mb-1">${product.price.toFixed(2)}</div>
                  <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <Truck size={14} /> Free instant delivery
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => addItem(product)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-orange-100 text-sm overflow-hidden"
                  >
                    Add to Cart
                  </button>
                  <a 
                    href={product.etsy_url}
                    target="_blank"
                    className="w-full border-2 border-primary text-primary hover:bg-orange-50 font-bold py-4 rounded-xl transition-all text-center block text-sm"
                  >
                    Buy Now on Etsy
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span><b>Guaranteed</b> Instant PDF Download</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <Store size={18} className="text-blue-500" />
                    <span>Seller: <b>WoodCraft Plans (8.8)</b></span>
                  </div>
                </div>
              </div>

              {/* Campaigns Card */}
              <div className="p-4 border border-gray-50 rounded-xl bg-blue-50/30">
                <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2">Exclusive Offer</h4>
                <p className="text-xs text-gray-800 leading-snug">
                  Buy <b>3 Plans</b> and get <b>1 Free</b>. Discount automatically applied at checkout.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Full Details Area */}
        <div className="mt-16 pt-16 border-t border-gray-100">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Detailed Project Information</h2>
            <div className="prose prose-orange max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg whitespace-pre-wrap">{product.longDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="bg-gray-50 p-8 rounded-2xl">
                 <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-900">
                   <Toolbox size={20} className="text-primary" /> Required Materials
                 </h4>
                 <ul className="grid grid-cols-1 gap-4">
                    {product.materials.map(m => (
                      <li key={m} className="flex items-center gap-3 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {m}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl">
                 <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-900">
                   <Hammer size={20} className="text-primary" /> Key Features
                 </h4>
                 <ul className="grid grid-cols-1 gap-4">
                    {product.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {f}
                      </li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container { max-width: 1240px; margin: 0 auto; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media (max-width: 1024px) {
          .sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}
