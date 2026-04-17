import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

function cleanText(str: string): string {
  // Remove emoji and normalize whitespace
  return str
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/\t/g, ' ')   // no tabs in TSV values
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'price',
    'sale_price',
    'availability',
    'condition',
    'brand',
    'google_product_category',
    'product_type',
    'shipping',
  ].join('\t');

  const rows = products.map((product) => {
    const desc = cleanText(
      product.longDescription || product.description || product.name
    ).slice(0, 500);

    const primaryImage = product.images?.[0] ?? '';
    const origPrice = product.originalPrice ?? Math.round((product.price / 0.30) * 100) / 100;
    const salePrice = product.price;

    return [
      product.slug,
      cleanText(product.name),
      desc,
      `${baseUrl}/products/${product.slug}/`,
      primaryImage,
      `${origPrice.toFixed(2)} USD`,
      `${salePrice.toFixed(2)} USD`,
      'in stock',
      'new',
      'ElesWoodDesigns',
      '505307',
      'Craft Supplies & Tools > Patterns & Instructions',
      'US::Digital Download:0.00 USD',
    ].join('\t');
  });

  const tsv = [headers, ...rows].join('\n');

  return new Response(tsv, {
    headers: {
      'Content-Type': 'text/tab-separated-values; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Disposition': 'inline; filename="pinterest-feed.tsv"',
    },
  });
}
