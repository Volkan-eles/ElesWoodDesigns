'use client';
import React, { useEffect, useRef } from 'react';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
}

export default function ProductBuyActions({ product }: Props) {
  const googlePayRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load Google Pay JS API
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => initGooglePay();
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, []);

  function initGooglePay() {
    const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
      environment: 'PRODUCTION',
      merchantInfo: {
        merchantId: 'BCR2DN5TW7T2H32L',
        merchantName: 'ElesWoodDesigns',
      },
    });

    const allowedPaymentMethods = [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_KEY || '',
        },
      },
    }];

    paymentsClient.isReadyToPay({ apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods })
      .then((res: any) => {
        if (res.result) {
          // Google Pay supported — render official button
          const btn = paymentsClient.createButton({
            onClick: () => onGooglePayClicked(paymentsClient, allowedPaymentMethods),
            buttonType: 'buy',
            buttonColor: 'black',
            buttonSizeMode: 'fill',
          });
          if (googlePayRef.current) {
            googlePayRef.current.innerHTML = '';
            googlePayRef.current.appendChild(btn);
          }
        } else {
          // Not supported — show Polar fallback button
          showPolarFallback();
        }
      })
      .catch(() => showPolarFallback());
  }

  function showPolarFallback() {
    if (googlePayRef.current) {
      googlePayRef.current.innerHTML = `
        <a 
          href="${product.polarCheckoutUrl || 'https://polar.sh'}"
          data-polar-checkout
          data-polar-checkout-theme="light"
          style="
            display:flex; align-items:center; justify-content:center; gap:0.5rem;
            width:100%; padding:0.75rem 1rem; background:#000; color:#fff;
            font-weight:800; font-size:0.95rem; text-decoration:none;
            border:2px solid #000; letter-spacing:0.02em; cursor:pointer;
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
          Buy Now — $${product.price.toFixed(2)}
        </a>`;
    }
  }

  function onGooglePayClicked(paymentsClient: any, allowedPaymentMethods: any[]) {
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods,
      merchantInfo: {
        merchantId: 'BCR2DN5TW7T2H32L',
        merchantName: 'ElesWoodDesigns',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: product.price.toFixed(2),
        currencyCode: 'USD',
        countryCode: 'US',
      },
      callbackIntents: ['PAYMENT_AUTHORIZATION'],
    };

    paymentsClient.loadPaymentData(paymentDataRequest)
      .then(() => {
        // On success → redirect to Polar checkout for fulfillment
        window.location.href = product.polarCheckoutUrl || 'https://polar.sh';
      })
      .catch((err: any) => {
        if (err.statusCode !== 'CANCELED') {
          // On real error → fallback to Polar
          window.location.href = product.polarCheckoutUrl || 'https://polar.sh';
        }
      });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', width: '100%' }}>

      {/* ── 1. Google Pay Button ── */}
      <div ref={googlePayRef} style={{ width: '100%', minHeight: '48px' }}>
        {/* Google Pay JS will render here, fallback shown while loading */}
        <a
          href={product.polarCheckoutUrl || 'https://polar.sh'}
          data-polar-checkout
          data-polar-checkout-theme="light"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.75rem 1rem', background: '#000', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
            border: '2px solid #000', letterSpacing: '0.02em', cursor: 'pointer',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 90 36" fill="none">
            <text x="0" y="26" fontFamily="Arial" fontSize="22" fontWeight="bold" fill="white">G</text>
            <text x="18" y="26" fontFamily="Arial" fontSize="22" fill="white">Pay</text>
          </svg>
          <span style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 600 }}>— ${product.price.toFixed(2)}</span>
        </a>
      </div>

      {/* ── 2. Add to Cart Button ── */}
      <button
        onClick={() => addToCart(product)}
        className="btn-neo-secondary w-full text-center py-3 text-base justify-center font-bold"
        style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--white)', color: 'var(--black)',
          border: '2px solid var(--black)',
          boxShadow: '3px 3px 0 var(--black)', cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        🛒 Add to Cart
      </button>

      {/* ── 3. Polar Buy Now Button ── */}
      <a
        href={product.polarCheckoutUrl || 'https://polar.sh'}
        data-polar-checkout
        data-polar-checkout-theme="light"
        className="btn-neo w-full text-center py-3 text-base justify-center font-bold"
        style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--amber)', color: 'var(--black)',
          border: '2px solid var(--black)',
          boxShadow: '3px 3px 0 var(--black)', cursor: 'pointer',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        ⚡ Buy Now — ${product.price.toFixed(2)}
      </a>

      {/* ── 4. Etsy Button ── */}
      {product.etsyUrl && (
        <a
          href={product.etsyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.65rem 1rem',
            background: 'var(--white)', color: '#F1641E',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            border: '2px solid #F1641E', letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#F1641E">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 8.016h-3v1.5h2.484v1.5H14.016v3h-1.5v-7.5h4.5v1.5zm-6 6h-4.5v-7.5h1.5v6h3v1.5z"/>
          </svg>
          Also Available on Etsy
        </a>
      )}

      <p style={{
        fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)',
        textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0.25rem 0 0'
      }}>
        Instant PDF delivery · Dual Imperial &amp; Metric
      </p>
    </div>
  );
}
