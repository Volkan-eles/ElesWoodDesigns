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

    // Full description cleaned up and trimmed (Google Merchant Center max 5000 chars)
    const rawDescription = product.longDescription || product.description || title;
    const featuresStr = (product.features && product.features.length > 0) ? ` Features: ${product.features.join(', ')}.` : '';
    const materialsStr = (product.materials && product.materials.length > 0) ? ` Materials: ${product.materials.join(', ')}.` : '';
    const tagsString = (product.tags && product.tags.length > 0) ? ` | Tags: ${product.tags.join(', ')}` : '';
    const description = cleanText(rawDescription + featuresStr + materialsStr + tagsString).slice(0, 4990);

    // Product URL — must always be the verified domain for Pinterest
    const siteUrl = `${baseUrl}/products/${product.slug}/`;
    const etsyUrl = product.etsy_url || null;

    // Main image
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';

    // Additional images (skip the first one already used as primary)
    // NOTE: We DO NOT include the Pinterest pinImage here because Google Merchant Center forbids text overlays
    const extraImagesList = [
      ...(product.images || []).slice(1, 10).filter(Boolean),
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

    // Correct Google Product Category (GPC) — Full multi-level paths (fixes Uyarı 126)
    // Using 4+ level paths for maximum search visibility on Pinterest
    const isPortrait = product.slug.includes('portrait') || product.slug.includes('sketch');
    const isKids = product.category === 'Kids' || product.slug.includes('treehouse') || product.slug.includes('mud-kitchen') || product.slug.includes('playhouse');
    const isBedroom = product.category === 'Bedroom' || product.slug.includes('loft-bed') || product.slug.includes('murphy-desk') || product.slug.includes('storage-bench');
    const isGarden = product.category === 'Garden' || product.slug.includes('planter') || product.slug.includes('plant-stand') || product.slug.includes('garden') || product.slug.includes('farmstand') || product.slug.includes('farm-stand');
    const isOutdoor = product.category === 'Outdoor' || product.slug.includes('pergola') || product.slug.includes('swing') || product.slug.includes('arbor') || product.slug.includes('sauna') || product.slug.includes('treehouse') || product.slug.includes('chicken-coop') || product.slug.includes('fence') || product.slug.includes('shed') || product.slug.includes('windmill');
    const isDigitalArt = product.category === 'Digital' && (product.slug.includes('christmas') || product.slug.includes('costco') || product.slug.includes('watercolour') || product.slug.includes('memorial'));
    
    // Full deep category paths per product type (4+ levels to fix Uyarı 126)
    let googleCategory: string;
    if (isPortrait) {
      // Arts > Artwork > Prints
      googleCategory = 'Arts & Entertainment > Hobbies & Creative Arts > Artwork > Posters, Prints, & Visual Artwork';
    } else if (isDigitalArt) {
      // Digital art prints category
      googleCategory = 'Arts & Entertainment > Hobbies & Creative Arts > Artwork > Posters, Prints, & Visual Artwork';
    } else if (isKids) {
      // Toy > Outdoor play equipment for kids builds
      googleCategory = 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Crafting Patterns & Molds';
    } else if (isBedroom) {
      // Furniture plans specifically
      googleCategory = 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Crafting Patterns & Molds';
    } else {
      // Default: Woodworking plans — full 4-level path
      googleCategory = 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Crafting Patterns & Molds';
    }

    // Google Merchant Center limits g:id to 50 chars. We use the short unique internal ID.
    const googleId = product.id;

    // Product Type (Internal taxonomy) — 4+ levels for Pinterest recommendations (fixes Uyarı 126)
    const internalCategory = product.category || 'Workshop';
    let productType: string;
    if (isPortrait || isDigitalArt) {
      productType = 'Decor > Digital Art > Printable Designs > Portrait & Wall Art';
    } else if (isKids) {
      productType = `Woodworking Plans > ${internalCategory} > DIY Blueprint > Outdoor Play Structures`;
    } else if (isGarden) {
      productType = `Woodworking Plans > ${internalCategory} > DIY Blueprint > Garden & Planter Builds`;
    } else if (isOutdoor) {
      productType = `Woodworking Plans > ${internalCategory} > DIY Blueprint > Outdoor Furniture & Structures`;
    } else if (isBedroom) {
      productType = `Woodworking Plans > ${internalCategory} > DIY Blueprint > Bedroom & Storage Furniture`;
    } else {
      productType = `Woodworking Plans > ${internalCategory} > DIY Blueprint > Beginner-Friendly PDF`;
    }

    return `
    <item>
      <g:id>${escapeXml(googleId)}</g:id>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description>${escapeXml(description)}</description>
      <g:description>${escapeXml(description)}</g:description>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImagesXml}
${adsRedirectXml}
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:item_group_id>${escapeXml(googleId)}</g:item_group_id>
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
