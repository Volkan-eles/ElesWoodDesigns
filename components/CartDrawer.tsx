'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, removeFromCart, toggleCart, subtotal, totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close cart drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, toggleCart]);

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`cart-overlay${isCartOpen ? ' open' : ''}`}
        onClick={toggleCart}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div 
        ref={drawerRef}
        className={`cart-drawer${isCartOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-title">
            Shopping Cart <span className="cart-count">({totalItems})</span>
          </h2>
          <button 
            className="cart-close-btn" 
            onClick={toggleCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Explore our premium woodworking plans and start building today!</p>
              <Link 
                href="/products/" 
                className="btn-neo mt-6 w-full text-center"
                onClick={toggleCart}
                style={{ justifyContent: 'center' }}
              >
                Shop All Plans →
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(({ product }) => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-img">
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      width={80} 
                      height={80} 
                      className="object-cover border-2 border-black"
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">
                      <Link href={`/products/${product.slug}/`} onClick={toggleCart}>
                        {product.shortTitle}
                      </Link>
                    </h4>
                    <div className="cart-item-meta">
                      <span className="cart-item-category">{product.category}</span>
                    </div>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">${product.price.toFixed(2)}</span>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.shortTitle}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Only show if cart has items) */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal</span>
              <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="cart-promo-alert">
              🎉 <strong>Free Instant Delivery!</strong> Blueprints are instantly delivered as PDF files via email and in your dashboard.
            </div>

            <div className="cart-actions">
              {totalItems === 1 ? (
                <a 
                  href={cart[0].product.polarCheckoutUrl || "https://sandbox.polar.sh/checkout/demo"}
                  data-polar-checkout
                  data-polar-checkout-theme="light"
                  className="btn-neo cart-checkout-btn w-full text-center py-3 text-base justify-center"
                  onClick={toggleCart}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  Checkout on Polar 💳
                </a>
              ) : (
                <Link 
                  href="/checkout/" 
                  className="btn-neo cart-checkout-btn w-full text-center py-3 text-base justify-center"
                  onClick={toggleCart}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  Proceed to Checkout 💳
                </Link>
              )}
              <button 
                className="btn-neo-secondary w-full text-center py-2 text-sm justify-center"
                onClick={toggleCart}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
