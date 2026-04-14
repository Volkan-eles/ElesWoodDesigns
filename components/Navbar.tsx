"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "ABOUT", href: "/about/" },
    { name: "PLANS", href: "/products/" },
    { name: "BLOG", href: "/blog/" },
    { name: "FAQ", href: "/faq/" },
    { name: "CONTACT", href: "/contact/" },
  ];

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-black tracking-tighter hover:text-[#FFE500] transition-colors"
          onClick={() => setIsOpen(false)}
        >
          ELESWOOD<span className="bg-[#FFE500] px-1 border-2 border-black ml-1">DESIGNS</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="font-bold hover:underline decoration-4 underline-offset-4 text-base"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.etsy.com/shop/ElesWoodDesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo py-2 px-5 text-sm whitespace-nowrap"
          >
            SHOP ON ETSY
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 border-4 border-black bg-[#FFE500] hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 transition-transform duration-300 md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <button 
          className="absolute top-6 right-6 p-4 border-4 border-black bg-[#FFE500] shadow-[8px_8px_0_black]"
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>

        <div className="flex flex-col gap-8 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-4xl font-black tracking-tighter hover:text-[#FFE500]"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.etsy.com/shop/ElesWoodDesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo text-xl py-4"
          >
            SHOP ON ETSY
          </a>
        </div>
      </div>
    </nav>
  );
}
