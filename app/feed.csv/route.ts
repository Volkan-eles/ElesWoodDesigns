import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

function cleanText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function getGoogleCategory(slug: string, cat: string): string {
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('costco') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital' && (slug.includes('kentucky-derby') || slug.includes('party') || slug.includes('game') || slug.includes('betting') || slug.includes('cards') || slug.includes('mothers-day') || slug.includes('handprint') || slug.includes('craft') || slug.includes('keepsake') || slug.includes('mahjong') || slug.includes('sweepstake') || slug.includes('world-cup'));
  if (isPortrait || isDigitalArt || isPartyPrintable) return '500044';
  return '505378';
}

function getProductType(slug: string, cat: string): string {
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('costco') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital' && (slug.includes('kentucky-derby') || slug.includes('party') || slug.includes('game') || slug.includes('betting') || slug.includes('cards') || slug.includes('mothers-day') || slug.includes('handprint') || slug.includes('craft') || slug.includes('keepsake') || slug.includes('mahjong') || slug.includes('sweepstake') || slug.includes('world-cup'));
  const isKids = cat === 'Kids' || slug.includes('treehouse') || slug.includes('mud-kitchen') || slug.includes('playhouse');
  const isGarden = cat === 'Garden' || slug.includes('planter') || slug.includes('plant-stand') || slug.includes('garden') || slug.includes('farmstand') || slug.includes('farm-stand');
  const isOutdoor = cat === 'Outdoor' || slug.includes('pergola') || slug.includes('swing') || slug.includes('arbor') || slug.includes('sauna') || slug.includes('treehouse') || slug.includes('chicken-coop') || slug.includes('fence') || slug.includes('shed') || slug.includes('windmill');
  const isBedroom = cat === 'Bedroom' || slug.includes('loft-bed') || slug.includes('murphy-desk') || slug.includes('storage-bench');

  if (isPortrait || isDigitalArt) return 'Decor > Digital Art > Printable Designs > Portrait & Wall Art';
  if (isPartyPrintable) return 'Decor > Digital Art > Printable Designs > Party Games & Printables';
  if (isKids) return `Woodworking Plans > ${cat} > DIY Blueprint > Outdoor Play Structures`;
  if (isGarden) return `Woodworking Plans > ${cat} > DIY Blueprint > Garden & Planter Builds`;
  if (isOutdoor) return `Woodworking Plans > ${cat} > DIY Blueprint > Outdoor Furniture & Structures`;
  if (isBedroom) return `Woodworking Plans > ${cat} > DIY Blueprint > Bedroom & Storage Furniture`;
  return `Woodworking Plans > ${cat} > DIY Blueprint > Beginner-Friendly PDF`;
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
  ];

  const shippingStr = 'US::Digital Download:0.00 USD,CA::Digital Download:0.00 USD,GB::Digital Download:0.00 USD,AU::Digital Download:0.00 USD,DE::Digital Download:0.00 USD,FR::Digital Download:0.00 USD,NL::Digital Download:0.00 USD';

  const csvRows = [headers.join(',')];

  products.forEach((product) => {
    const pinterestId = product.slug.slice(0, 100);
    const title = cleanText(product.name).replace(/&/g, 'and').slice(0, 95);

    const rawDescription = product.longDescription || product.description || title;
    const featuresStr = (product.features && product.features.length > 0) ? ` Features: ${product.features.join(', ')}.` : '';
    const materialsStr = (product.materials && product.materials.length > 0) ? ` Materials: ${product.materials.join(', ')}.` : '';
    const tagsString = (product.tags && product.tags.length > 0) ? ` | Tags: ${product.tags.join(', ')}` : '';
    const description = cleanText(rawDescription + featuresStr + materialsStr + tagsString).slice(0, 4990);

    const siteUrl = `${baseUrl}/products/${product.slug}/`;
    // Clean original product photo without overlays
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : (product.image || '');

    const salePrice = product.price;
    const origPrice = product.originalPrice ?? Math.round((salePrice / 0.75) * 100) / 100;

    const googleCategory = getGoogleCategory(product.slug, product.category || '');
    const productType = getProductType(product.slug, product.category || '');

    const row = [
      pinterestId,
      title,
      description,
      siteUrl,
      primaryImage,
      `${origPrice.toFixed(2)} USD`,
      `${salePrice.toFixed(2)} USD`,
      'in stock',
      'new',
      'ElesWoodDesigns',
      googleCategory,
      productType,
      shippingStr,
    ];

    csvRows.push(row.map(escapeCsvValue).join(','));
  });

  return new Response(csvRows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Disposition': 'inline; filename="pinterest-feed.csv"',
    },
  });
}
