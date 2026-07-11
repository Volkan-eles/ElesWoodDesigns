"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import Badge from "./Badge";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="card-neo flex flex-col h-full group">
      <div className="relative aspect-video border-b-2 border-black overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge>{product.category}</Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-white">{product.difficulty}</Badge>
        </div>
        {product.bestseller && (
           <div className="absolute top-2 right-2">
            <Badge className="bg-[#FFE500]">BESTSELLER</Badge>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow bg-white">
        <h3 className="font-black text-base mb-2 line-clamp-2 uppercase leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-[#FFE500] text-black" />
          <span className="font-bold text-sm">{product.rating}</span>
          <span className="text-gray-500 text-xs">({product.reviewCount} reviews)</span>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="bg-[#FF5C00] text-white font-black text-[10px] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                {product.discount}% OFF
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex flex-col">
              <span className="text-xl font-black text-black">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through font-bold text-xs">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="btn-neo py-1.5 px-3 text-xs uppercase font-black cursor-pointer"
                style={{ background: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                🛒 + Cart
              </button>
              <Link 
                href={`/products/${product.slug}/`} 
                className="btn-neo py-1.5 px-3 text-xs uppercase font-bold" 
                style={{ background: 'white', display: 'flex', alignItems: 'center' }}
              >
                View Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
