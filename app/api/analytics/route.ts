import { NextRequest, NextResponse } from 'next/server';

// In-memory 24-hour analytics store
// Keyed by product slug, storing arrays of timestamps
interface AnalyticsData {
  views: number[];
  cart: number[];
  purchases: number[];
}

const analyticsStore = new Map<string, AnalyticsData>();

function getProductData(slug: string): AnalyticsData {
  if (!analyticsStore.has(slug)) {
    analyticsStore.set(slug, { views: [], cart: [], purchases: [] });
  }
  return analyticsStore.get(slug)!;
}

function cleanup(data: AnalyticsData) {
  const now = Date.now();
  const h24 = 24 * 60 * 60 * 1000;
  const h2 = 2 * 60 * 60 * 1000;
  const d7 = 7 * 24 * 60 * 60 * 1000;

  data.views = data.views.filter((ts) => now - ts < h24);
  data.cart = data.cart.filter((ts) => now - ts < h2);
  data.purchases = data.purchases.filter((ts) => now - ts < d7);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const data = getProductData(slug);
  cleanup(data);

  return NextResponse.json({
    views24h: data.views.length,
    activeCart: data.cart.length,
    recentPurchases: data.purchases.length,
    inStock: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, action } = body;

    if (!slug || !action) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const data = getProductData(slug);
    const now = Date.now();

    if (action === 'view') {
      data.views.push(now);
    } else if (action === 'cart') {
      data.cart.push(now);
    } else if (action === 'purchase') {
      data.purchases.push(now);
    }

    cleanup(data);

    return NextResponse.json({
      success: true,
      views24h: data.views.length,
      activeCart: data.cart.length,
      recentPurchases: data.purchases.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
