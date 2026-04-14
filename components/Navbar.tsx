import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="ElesWoodDesigns Logo" 
            width={120} 
            height={120} 
            className="h-12 w-auto md:h-16 object-contain"
            priority
          />
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/products" className="font-bold hover:underline decoration-4 underline-offset-4 text-sm md:text-base">
            ALL PLANS
          </Link>
          <a
            href="https://www.etsy.com/shop/ElesWoodDesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo py-2 px-3 md:px-5 text-xs md:text-sm whitespace-nowrap"
          >
            SHOP ON ETSY
          </a>
        </div>
      </div>
    </nav>
  );
}
