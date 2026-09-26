import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const productSlug = slug[0];
  const product = getProductBySlug(productSlug);

  if (!product) {
    return new Response('Not Found', { status: 404 });
  }

  const width = 1000;
  const height = 1500;

  const priceStr = `$${product.price.toFixed(2)}`;
  const origPriceStr = product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : null;
  const rating = product.rating ? `★ ${product.rating} (${product.reviewCount}+ reviews)` : '★ 4.9 Stars';
  // Short name: up to pipe or colon, max 40 chars
  const shortName = (product.name || '').split('|')[0].split(':')[0].trim().slice(0, 45);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '1000px',
          height: '1500px',
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Product Image - fills top 60% */}
        <img
          src={product.image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '65%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient Overlay — fades image into black card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,1) 100%)',
          }}
        />

        {/* TOP LEFT: Brand badge */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            backgroundColor: '#FFE500',
            border: '6px solid black',
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
            zIndex: 20,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 900, textTransform: 'uppercase', color: 'black', letterSpacing: '-2px' }}>
            DIY PLANS
          </span>
        </div>

        {/* TOP RIGHT: Discount badge */}
        <div
          style={{
            position: 'absolute',
            top: '25px',
            right: '30px',
            backgroundColor: '#FF5C00',
            border: '6px solid black',
            padding: '14px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
            transform: 'rotate(4deg)',
            zIndex: 20,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1 }}>
            25%
          </span>
          <span style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '2px' }}>
            OFF
          </span>
        </div>

        {/* BOTTOM: Dark info card */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#111111',
            padding: '44px 44px 50px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            zIndex: 10,
          }}
        >
          {/* Star rating row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: 36, color: '#FFE500', fontWeight: 900 }}>
              ★★★★★
            </span>
            <span style={{ fontSize: 30, color: '#cccccc', fontWeight: 700 }}>
              {rating}
            </span>
          </div>

          {/* Product short name */}
          <span
            style={{
              fontSize: 68,
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              marginBottom: '24px',
            }}
          >
            {shortName}
          </span>

          {/* Divider */}
          <div style={{ width: '100%', height: '4px', backgroundColor: '#FFE500', marginBottom: '28px' }} />

          {/* Price + CTA row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '20px',
            }}
          >
            {/* Price block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {origPriceStr && (
                <span style={{ fontSize: 34, color: '#888888', fontWeight: 700, textDecoration: 'line-through' }}>
                  {origPriceStr}
                </span>
              )}
              <span style={{ fontSize: 80, fontWeight: 900, color: '#FFE500', lineHeight: 1, letterSpacing: '-3px' }}>
                {priceStr}
              </span>
            </div>

            {/* CTA button */}
            <div
              style={{
                backgroundColor: '#FFE500',
                border: '6px solid black',
                padding: '22px 36px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
              }}
            >
              <span style={{ fontSize: 38, fontWeight: 900, color: 'black', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                ⚡ GET PLANS
              </span>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                INSTANT DOWNLOAD
              </span>
            </div>
          </div>

          {/* Features strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '24px',
              borderTop: '2px solid #333',
              paddingTop: '20px',
            }}
          >
            <span style={{ fontSize: 26, color: '#aaaaaa', fontWeight: 600 }}>✅ Cut List</span>
            <span style={{ fontSize: 26, color: '#aaaaaa', fontWeight: 600 }}>✅ 3D Diagrams</span>
            <span style={{ fontSize: 26, color: '#aaaaaa', fontWeight: 600 }}>✅ Material List</span>
            <span style={{ fontSize: 26, color: '#FFE500', fontWeight: 900 }}>PDF ↓</span>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}
