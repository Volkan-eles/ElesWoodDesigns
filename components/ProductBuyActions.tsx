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
          // Not supported — show fallback
          showGooglePayFallback();
        }
      })
      .catch(() => showGooglePayFallback());
  }

  function showGooglePayFallback() {
    if (googlePayRef.current) {
      googlePayRef.current.innerHTML = `
        <button 
          style="
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            width: 100%; padding: 0.75rem 1rem; background: #000; color: #fff;
            font-weight: 800; font-size: 0.95rem; text-decoration: none;
            border: 2px solid #000; letter-spacing: 0.02em; cursor: pointer;
            border-radius: 0px; height: 48px;
          "
        >
          Buy with G Pay
        </button>`;
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
        <button
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.75rem 1rem', background: '#000', color: '#fff',
            fontWeight: 800, fontSize: '0.95rem',
            border: '2px solid #000', letterSpacing: '0.02em', cursor: 'pointer',
            borderRadius: '0px', height: '48px',
          }}
        >
          Buy with G Pay
        </button>
      </div>

      {/* ── 2. Add to Cart Button ── */}
      <button
        onClick={() => addToCart(product)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#ffffff',
          color: '#000000',
          border: '3px solid #000000',
          boxShadow: '0px 5px 0px 0px #000000',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontWeight: '900',
          fontSize: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderRadius: '0px',
        }}
      >
        🛒 ADD TO CART
      </button>

      {/* ── 3. Polar Buy Now Button ── */}
      <a
        href={product.polarCheckoutUrl || 'https://polar.sh'}
        data-polar-checkout
        data-polar-checkout-theme="light"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#FFE500',
          color: '#000000',
          border: '3px solid #000000',
          boxShadow: '0px 5px 0px 0px #000000',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontWeight: '900',
          fontSize: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          borderRadius: '0px',
        }}
      >
        ⚡ BUY NOW — ${product.price.toFixed(2)}
      </a>

      {/* ── 4. Etsy Button ── */}
      {product.etsyUrl && (
        <a
          href={product.etsyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.75rem 1rem',
            background: '#ffffff',
            color: '#F1641E',
            border: '2px solid #F1641E',
            textDecoration: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: '700',
            fontSize: '0.95rem',
            borderRadius: '0px',
          }}
        >
          <span style={{
            background: '#F1641E',
            color: '#ffffff',
            fontSize: '0.55rem',
            fontWeight: '900',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.2rem',
            lineHeight: '1'
          }}>LF</span>
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
