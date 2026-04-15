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
          backgroundColor: '#000',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Background Image with slight zoom/scale */}
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

        {/* Dark Overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Top Header: DIY Badge */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#FFE500',
            border: '10px solid black',
            padding: '20px 80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '15px 15px 0px 0px rgba(0,0,0,1)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 100, fontWeight: 900, textTransform: 'uppercase', color: 'black' }}>
            DIY
          </span>
        </div>

        {/* Bottom Section: Project Name & Plans Label */}
        <div
          style={{
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              border: '10px solid black',
              padding: '50px 40px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '20px 20px 0px 0px rgba(0,0,0,1)',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <span style={{ 
              fontSize: 65,
              fontWeight: 900, 
              textTransform: 'uppercase', 
              color: 'black', 
              lineHeight: 1.1,
              marginBottom: '20px',
            }}>
              {product.name}
            </span>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#FF5C00',
              padding: '10px 30px',
              border: '6px solid black',
              alignSelf: 'center',
              boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
            }}>
              <span style={{ fontSize: 50, fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>
                BUILD PLANS
              </span>
            </div>
          </div>
          
          {/* 70% OFF Badge */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              right: '-20px',
              backgroundColor: '#FF5C00',
              border: '8px solid black',
              padding: '15px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
              transform: 'rotate(-10deg)',
              zIndex: 30,
            }}
          >
            <span style={{ fontSize: 60, fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
              70% OFF
            </span>
          </div>
          
          <div
            style={{
              marginTop: '40px',
              backgroundColor: '#FFE500',
              border: '8px solid black',
              padding: '15px 40px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
            }}
          >
            <span style={{ fontSize: 35, fontWeight: 900, textTransform: 'uppercase', color: 'black' }}>
              Instant PDF Download
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
