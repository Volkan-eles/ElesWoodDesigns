'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const { cart, subtotal, removeFromCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent accessing checkout with empty cart
  useEffect(() => {
    if (isMounted && cart.length === 0) {
      router.push('/products/');
    }
  }, [cart, isMounted, router]);

  // Handle case where we have only 1 item (should redirect to Polar directly)
  useEffect(() => {
    if (isMounted && cart.length === 1) {
      const url = cart[0].product.polarCheckoutUrl || "https://sandbox.polar.sh/checkout/demo";
      router.replace(url);
    }
  }, [cart, isMounted, router]);

  if (!isMounted || cart.length === 0 || cart.length === 1) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF0]">
        <div className="font-black text-xl uppercase tracking-widest animate-pulse">Redirecting to Polar...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="border-t-4 border-black bg-[#FFFDF0] min-h-[80vh] py-12">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-black text-4xl tracking-tighter uppercase mb-2">
              Checkout
            </h1>
            <p className="text-sm font-bold text-gray-500 max-w-2xl">
              You have selected multiple woodworking plans. Since Polar.sh processes transactions per-product, 
              please click the checkout buttons below to purchase each plan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: List of items to pay for */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2 className="font-black text-xl uppercase tracking-tight border-b-2 border-black pb-2">Your Items</h2>
              
              {cart.map(({ product }) => (
                <div 
                  key={product.id}
                  className="card-neo p-5 flex gap-5 items-center flex-wrap bg-white"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 border-2 border-black">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-[200px]">
                    <span className="badge-neo text-[9px] mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-black text-base uppercase mb-1">
                      {product.shortTitle}
                    </h3>
                    <div className="flex gap-4 items-center">
                      <span className="text-lg font-black">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-600 font-bold text-xs underline cursor-pointer hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Polar Checkout CTA */}
                  <a
                    href={product.polarCheckoutUrl || "https://sandbox.polar.sh/checkout/demo"}
                    data-polar-checkout
                    data-polar-checkout-theme="light"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neo py-2.5 px-5 text-sm uppercase font-black"
                    style={{ background: 'var(--amber)' }}
                  >
                    💳 Pay — ${product.price.toFixed(2)}
                  </a>
                </div>
              ))}
            </div>

            {/* Right Column: Checkout Info & Progress */}
            <div className="flex flex-col gap-6">
              <div className="card-neo p-6 bg-white">
                <h3 className="font-black text-lg uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
                  Summary
                </h3>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="text-gray-500 uppercase">Selected Plans</span>
                    <span>{cart.length} plans</span>
                  </div>
                  <div className="flex justify-between items-center font-black text-base border-t-2 border-black border-dashed pt-3">
                    <span className="uppercase">Total</span>
                    <span className="text-2xl">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Instructions Callout */}
                <div className="border-2 border-black bg-[#FFFDF0] p-4 text-xs font-bold leading-relaxed mb-6 shadow-neo-sm">
                  <h4 className="uppercase font-black mb-2 text-sm text-[#FF5C00]">💡 Secure Checkout Guide</h4>
                  <ol className="list-decimal pl-4 flex flex-col gap-2">
                    <li>Click <strong>&quot;Pay&quot;</strong> on each item block to open the secure Polar.sh checkout overlay.</li>
                    <li>Enter your email during payment; your digital PDF plans will be delivered instantly.</li>
                  </ol>
                </div>

                {/* Secure Checkout Badges */}
                <div className="border-2 border-black p-4 bg-white shadow-neo-sm">
                  <div className="flex justify-around items-center gap-2 flex-wrap border-b border-dashed border-gray-300 pb-3 mb-3">
                    <span className="text-[10px] font-black text-gray-500">🔒 SSL SECURE</span>
                    <span className="text-[10px] font-black text-gray-500">💳 STRIPE</span>
                    <span className="text-[10px] font-black text-gray-500">🅿️ PAYPAL</span>
                  </div>
                  <div className="flex flex-col gap-2 text-[10px] font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm leading-none">⚡</span>
                      <span>INSTANT DIGITAL PDF DOWNLOAD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm leading-none">🛡️</span>
                      <span>100% SATISFACTION GUARANTEED</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <Link href="/products/" className="btn-neo-secondary w-full text-center py-2 text-sm">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
