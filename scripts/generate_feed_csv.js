/**
 * generate_feed_csv.js
 * Generates a Pinterest-compliant public/feed.csv from data/etsy_products.json.
 * Uses standard CSV escaping and mimics the categorization logic of feed.xml and feed.tsv.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const CSV_PATH = path.join(ROOT, 'public', 'feed.csv');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const baseUrl = 'https://eleswooddesigns.com';

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '') // strip emojis
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function getGoogleCategory(product) {
  const slug = product.slug || '';
  const cat = product.category || '';
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('costco') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital' && (slug.includes('kentucky-derby') || slug.includes('party') || slug.includes('game') || slug.includes('betting') || slug.includes('cards') || slug.includes('mothers-day') || slug.includes('handprint') || slug.includes('craft') || slug.includes('keepsake') || slug.includes('mahjong') || slug.includes('sweepstake') || slug.includes('world-cup'));
  if (isPortrait || isDigitalArt || isPartyPrintable) return '500044';
  return '505378';
}

function getProductType(product) {
  const slug = product.slug || '';
  const cat = product.category || '';
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

const csvRows = [headers.join(',')];

products.forEach((product) => {
  const pinterestId = product.slug.slice(0, 100);
  const title = cleanText(product.name).slice(0, 100);
  
  const rawDescription = product.longDescription || product.description || title;
  const featuresStr = (product.features && product.features.length > 0) ? ` Features: ${product.features.join(', ')}.` : '';
  const materialsStr = (product.materials && product.materials.length > 0) ? ` Materials: ${product.materials.join(', ')}.` : '';
  const tagsString = (product.tags && product.tags.length > 0) ? ` | Tags: ${product.tags.join(', ')}` : '';
  const description = cleanText(rawDescription + featuresStr + materialsStr + tagsString).slice(0, 4990);

  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const primaryImage = product.images?.[0] || '';
  
  const salePrice = product.price;
  const origPrice = product.originalPrice ?? Math.round((salePrice / 0.30) * 100) / 100;
  
  const googleCategory = getGoogleCategory(product);
  const productType = getProductType(product);

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
    'US::Digital Download:0.00 USD',
  ];

  csvRows.push(row.map(escapeCsvValue).join(','));
});

fs.writeFileSync(CSV_PATH, csvRows.join('\n'), 'utf8');
console.log(`✅ feed.csv written to ${CSV_PATH}`);
console.log(`   Products in CSV feed: ${products.length}`);
