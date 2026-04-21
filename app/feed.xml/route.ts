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
  if (!str) return '';
  return str
    // Remove broad range of emojis and symbols (including checkmarks, arrows, etc.)
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    // Replace non-ASCII dashes and quotes with ASCII equivalents for maximal compatibility
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Remove potential CDATA break sequence
    .replace(/\]\]>/g, ']] ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    // Pinterest titles are best kept under 100 chars
    const title = cleanText(product.name).slice(0, 100);

    // Full description cleaned up and trimmed
    const rawDescription = product.longDescription || product.description || title;
    const description = cleanText(rawDescription).slice(0, 500);

    // Product URL — must always be the verified domain for Pinterest
    const siteUrl = `${baseUrl}/products/${product.slug}/`;
    const etsyUrl = product.etsy_url || null;

    // Main image
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
    
    // Pinterest branded pin image
    const pinImage = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;

    // Additional images (skip the first one already used as primary, add pin image)
    const extraImagesList = [
      pinImage,
      ...(product.images || []).slice(1, 9).filter(Boolean),
    ];
    
    const extraImagesXml = extraImagesList
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    // Prices
    const salePrice = product.price;
    const origPrice = product.originalPrice ?? Math.round((salePrice / 0.30) * 100) / 100;
    const salePriceStr = `${salePrice.toFixed(2)} USD`;
    const origPriceStr = `${origPrice.toFixed(2)} USD`;

    // Shipping
    const shippingXml = `      <g:shipping>
        <g:country>US</g:country>
        <g:service>Digital Download</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>`;

    const adsRedirectXml = etsyUrl
      ? `      <g:ads_redirect>${escapeXml(etsyUrl)}</g:ads_redirect>`
      : '';

    // Correct Google Product Category (GPC)
    // We use full strings for better compatibility and depth
    const isPortrait = product.slug.includes('portrait') || product.slug.includes('sketch');
    
    // 500044 = Arts & Entertainment > Hobbies & Creative Arts > Artwork > Posters, Prints, & Visual Artwork
    // 505307 = Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking
    const googleCategory = isPortrait 
      ? 'Arts & Entertainment > Hobbies & Creative Arts > Artwork > Posters, Prints, & Visual Artwork' 
      : 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking';

    // Pinterest limits g:id and g:item_group_id to 100 chars
    const pinterestId = product.slug.slice(0, 100);

    // Product Type (Internal taxonomy) - Pinterest recommends 3+ levels
    const internalCategory = product.category || 'Workshop';
    const productType = isPortrait 
      ? 'Decor > Digital Art > Portrait Sketches' 
      : `Woodworking Plans > ${internalCategory} > DIY Blueprint`;

    return `
    <item>
      <g:id>${escapeXml(pinterestId)}</g:id>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description><![CDATA[${description}]]></description>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImagesXml}
${adsRedirectXml}
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category><![CDATA[${googleCategory}]]></g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      <g:item_group_id>${escapeXml(pinterestId)}</g:item_group_id>
      <g:identifier_exists>no</g:identifier_exists>
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
