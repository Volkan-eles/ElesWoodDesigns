import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return new Response('Not Found', { status: 404 });
  }

  const width = 1000;
  const height = 1500;

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
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        {/* Background Image */}
        <img
          src={product.image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient Overlay to make text readable */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          }}
        />

        {/* Top Header / Branding */}
        <div
          style={{
            marginTop: '80px',
            backgroundColor: '#FFE500',
            border: '8px solid black',
            padding: '24px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 900, textTransform: 'uppercase', color: 'black' }}>
            🔨 ElesWoodDesigns Plans
          </span>
        </div>

        {/* Bottom Product Title */}
        <div
          style={{
            marginBottom: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            width: '850px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              border: '8px solid black',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
              width: '100%',
            }}
          >
            <span style={{ 
              fontSize: product.name.length > 60 ? 45 : 60, 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              color: 'black', 
              lineHeight: 1.1,
              maxHeight: '400px',
              overflow: 'hidden'
            }}>
              {product.name}
            </span>
          </div>
          
          <div
            style={{
              marginTop: '40px',
              backgroundColor: '#FFE500',
              border: '8px solid black',
              padding: '20px 40px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 900, textTransform: 'uppercase', color: 'black' }}>
              PDF Download • Instant Access
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
