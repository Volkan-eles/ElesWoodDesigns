"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();

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
        <div className="hidden md:flex gap-6 items-center">
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

          {/* Cart Icon Button - Desktop */}
          <button 
            className="icon-btn cart-btn-nav border-2 border-black bg-white hover:bg-gray-100 p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer relative" 
            onClick={toggleCart} 
            aria-label="Open cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* Desktop Auth */}
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="font-bold border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors text-sm">
                SIGN IN
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="font-bold border-2 border-black bg-[#FFE500] px-4 py-2 shadow-[3px_3px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm">
                SIGN UP
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="flex md:hidden items-center gap-3">
          {/* Cart Icon Button - Mobile */}
          <button 
            className="icon-btn cart-btn-nav border-4 border-black bg-white p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer relative" 
            onClick={toggleCart} 
            aria-label="Open cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <button 
            className="p-2 border-4 border-black bg-[#FFE500] hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
          {/* Mobile Auth */}
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-2xl font-black border-4 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                SIGN IN
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="text-2xl font-black border-4 border-black bg-[#FFE500] px-8 py-4 shadow-[6px_6px_0_black]" onClick={() => setIsOpen(false)}>
                SIGN UP
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className="flex justify-center">
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}
