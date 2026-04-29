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
    // Link directly to the Etsy listing
    const productLink = product.etsy_url || `${baseUrl}/products/${product.slug}/`;

    // Dynamic categorizations
    const isPortrait = product.slug.includes('portrait') || product.slug.includes('sketch');
    const isKids = product.category === 'Kids' || product.slug.includes('treehouse') || product.slug.includes('mud-kitchen') || product.slug.includes('playhouse');
    const isBedroom = product.category === 'Bedroom' || product.slug.includes('loft-bed') || product.slug.includes('murphy-desk') || product.slug.includes('storage-bench');
    const isGarden = product.category === 'Garden' || product.slug.includes('planter') || product.slug.includes('plant-stand') || product.slug.includes('garden') || product.slug.includes('farmstand') || product.slug.includes('farm-stand');
    const isOutdoor = product.category === 'Outdoor' || product.slug.includes('pergola') || product.slug.includes('swing') || product.slug.includes('arbor') || product.slug.includes('sauna') || product.slug.includes('treehouse') || product.slug.includes('chicken-coop') || product.slug.includes('fence') || product.slug.includes('shed') || product.slug.includes('windmill');
    const isDigitalArt = product.category === 'Digital' && (product.slug.includes('christmas') || product.slug.includes('costco') || product.slug.includes('watercolour') || product.slug.includes('memorial'));
    const isPartyPrintable = product.category === 'Digital' && (product.slug.includes('kentucky-derby') || product.slug.includes('party') || product.slug.includes('game') || product.slug.includes('betting') || product.slug.includes('cards'));
    
    // Full deep category paths per product type using numeric IDs to fix Uyarı 126
    let googleCategory: string;
    if (isPortrait || isDigitalArt || isPartyPrintable) {
      googleCategory = '500044';
    } else {
      googleCategory = '505378';
    }

    const internalCategory = product.category || 'Workshop';
    let productType: string;
    if (isPortrait || isDigitalArt) {
      productType = 'Decor > Digital Art > Printable Designs > Portrait & Wall Art';
    } else if (isPartyPrintable) {
      productType = 'Decor > Digital Art > Printable Designs > Party Games & Printables';
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

    return [
      product.slug,
      cleanText(product.name),
      desc,
      productLink,
      primaryImage,
      `${origPrice.toFixed(2)} USD`,
      `${salePrice.toFixed(2)} USD`,
      'in stock',
      'new',
      'ElesWoodDesigns',
      googleCategory,
      productType,
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
