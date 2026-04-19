import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

// Escape XML special characters outside of CDATA
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Strip emoji and normalize whitespace for feed
function cleanText(str: string): string {
  return str
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')   // remove emoji
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    const title = cleanText(product.name);

    // Full description cleaned up
    const rawDescription = product.longDescription || product.description || title;
    const description = cleanText(rawDescription).slice(0, 5000);

    // Product URL — must always be the verified domain for Pinterest
    const siteUrl = `${baseUrl}/products/${product.slug}/`;
    // Etsy URL kept separately for g:ads_redirect (optional deep-link)
    const etsyUrl = product.etsy_url || null;

    // Main image: use the first real Etsy image (no trailing slash, direct jpg)
    // Pinterest requires a stable, direct image URL
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
    
    // Pinterest branded pin image as additional image
    const pinImage = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;

    // Additional Etsy images (skip the first one already used as primary, add pin image)
    const extraImages = [
      pinImage,
      ...(product.images || []).slice(1, 9).filter(Boolean),
    ]
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    // Prices — product.price = sale price, product.originalPrice = full price
    const salePrice = product.price;
    const origPrice = product.originalPrice ?? Math.round((salePrice / 0.30) * 100) / 100;
    const salePriceStr = `${salePrice.toFixed(2)} USD`;
    const origPriceStr = `${origPrice.toFixed(2)} USD`;

    // Shipping — required by Pinterest for some categories; mark as free
    const shippingXml = `      <g:shipping>
        <g:country>US</g:country>
        <g:service>Digital Download</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>`;

    const adsRedirectXml = etsyUrl
      ? `      <g:ads_redirect>${escapeXml(etsyUrl)}</g:ads_redirect>`
      : '';

    return `
    <item>
      <g:id>${escapeXml(product.slug)}</g:id>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description><![CDATA[${description}]]></description>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImages}
${adsRedirectXml}
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>505307</g:google_product_category>
      <g:product_type><![CDATA[Craft Supplies & Tools > Patterns & Instructions > Woodworking Plans]]></g:product_type>
      <g:item_group_id>${escapeXml(product.slug)}</g:item_group_id>
${shippingXml}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ElesWoodDesigns – DIY Woodworking Plans</title>
    <link>${baseUrl}/</link>
    <description>Professional DIY woodworking PDF plans with 3D diagrams, cut lists, and material lists. Instant download.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
