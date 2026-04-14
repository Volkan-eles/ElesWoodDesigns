import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-black mb-4">BUILD IT YOURSELF.</h3>
        <p className="mb-8 font-bold text-gray-400">Handcrafted plans for the modern maker.</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          <Link href="/about/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">About</Link>
          <Link href="/products/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">Plans</Link>
          <Link href="/contact/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">Contact</Link>
          <Link href="/faq/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">FAQ</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 border-t border-gray-800 pt-8">
          <Link href="/privacy/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-[10px] text-gray-500">Privacy Policy</Link>
          <Link href="/terms/" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-[10px] text-gray-500">Terms of Service</Link>
          <a href="https://www.etsy.com/shop/ElesWoodDesigns" target="_blank" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-[10px] text-gray-500">Etsy Shop</a>
        </div>
        <div className="text-[10px] font-mono text-gray-600">
          © {new Date().getFullYear()} ELESWOODDESIGNS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
