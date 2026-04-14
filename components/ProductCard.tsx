"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import Badge from "./Badge";
import { Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
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
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="text-2xl font-black">${product.price}</span>
          <Link href={`/products/${product.slug}`} className="btn-neo py-2 px-4 text-xs uppercase whitespace-nowrap">
            View Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
