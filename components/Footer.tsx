import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-black mb-4">BUILD IT YOURSELF.</h3>
        <p className="mb-8 font-bold text-gray-400">Handcrafted plans for the modern maker.</p>
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">Instagram</a>
          <a href="#" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">Pinterest</a>
          <a href="https://www.etsy.com/shop/ElesWoodDesigns" target="_blank" className="hover:text-[#FFE500] font-bold uppercase tracking-widest text-xs">Etsy Shop</a>
        </div>
        <div className="text-xs font-mono text-gray-500">
          © {new Date().getFullYear()} ELESWOODDESIGNS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
