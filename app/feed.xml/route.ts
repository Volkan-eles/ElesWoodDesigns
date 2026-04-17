import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    const title = product.name;

    // Full description (long first, fallback to short)
    const rawDescription = product.longDescription || product.description || title;
    const description = rawDescription
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    const link = `${baseUrl}/products/${product.slug}/`;

    // Pinterest-optimised branded image (1000x1500, product name as text overlay)
    const imageLink = `${baseUrl}/api/pin/${product.slug}/pin.jpg/`;

    // All product images as additional_image_link entries
    const additionalImages = (product.images || [])
      .filter(Boolean)
      .slice(0, 10)
      .map((img) => `      <g:additional_image_link>${img}</g:additional_image_link>`)
      .join('\n');

    // Prices
    const salePrice  = product.price;
    const origPrice  = product.originalPrice ?? Math.round(salePrice / 0.30 * 100) / 100;
    const salePriceStr = `${salePrice.toFixed(2)} USD`;
    const origPriceStr = `${origPrice.toFixed(2)} USD`;

    const availability = 'in stock';

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${description}]]></description>
      <g:id>${product.slug}</g:id>
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:image_link>${imageLink}</g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>505307</g:google_product_category>
      <g:product_type><![CDATA[Hardware > Tools > Blueprints & Templates]]></g:product_type>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ElesWoodDesigns Product Feed</title>
    <link>${baseUrl}</link>
    <description>Professional Woodworking Plans for DIY Enthusiasts</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
