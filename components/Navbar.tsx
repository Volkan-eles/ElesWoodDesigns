import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter hover:text-[#FFE500] transition-colors">
          ELESWOOD<span className="bg-[#FFE500] px-1 border-2 border-black ml-1">DESIGNS</span>
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/about/" className="font-bold hover:underline decoration-4 underline-offset-4 text-sm md:text-base">
            ABOUT
          </Link>
          <Link href="/products/" className="font-bold hover:underline decoration-4 underline-offset-4 text-sm md:text-base">
            PLANS
          </Link>
          <Link href="/faq/" className="font-bold hover:underline decoration-4 underline-offset-4 text-sm md:text-base hidden sm:block">
            FAQ
          </Link>
          <Link href="/contact/" className="font-bold hover:underline decoration-4 underline-offset-4 text-sm md:text-base hidden md:block">
            CONTACT
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
