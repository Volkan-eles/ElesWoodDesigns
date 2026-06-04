/**
 * generate_feed_xml.js
 * Generates /feed.xml (static copy) from data/etsy_products.json
 * Mirrors the logic in app/feed.xml/route.ts
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const FEED_PATH = path.join(ROOT, 'public', 'feed.xml');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const baseUrl = 'https://eleswooddesigns.com';

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\]\]>/g, ']] ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

const items = products.map((product) => {
  const title = cleanText(product.name).slice(0, 100);
  const rawDescription = product.longDescription || product.description || title;
  const featuresStr = (product.features && product.features.length > 0) ? ` Features: ${product.features.join(', ')}.` : '';
  const materialsStr = (product.materials && product.materials.length > 0) ? ` Materials: ${product.materials.join(', ')}.` : '';
  const tagsString = (product.tags && product.tags.length > 0) ? ` | Tags: ${product.tags.join(', ')}` : '';
  const description = cleanText(rawDescription + featuresStr + materialsStr + tagsString).slice(0, 4990);

  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const etsyUrl = product.etsy_url || null;
  const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
  const pinImage = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;

  const extraImagesList = [
    pinImage,
    ...(product.images || []).slice(1, 9).filter(Boolean),
  ];

  const extraImagesXml = extraImagesList
    .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join('\n');

  const salePrice = product.price;
  const origPrice = product.originalPrice != null ? product.originalPrice : Math.round((salePrice / 0.30) * 100) / 100;
  const salePriceStr = `${salePrice.toFixed(2)} USD`;
  const origPriceStr = `${origPrice.toFixed(2)} USD`;

  const shippingXml = `      <g:shipping>
        <g:country>US</g:country>
        <g:service>Digital Download</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>`;

  const adsRedirectXml = etsyUrl
    ? `      <g:ads_redirect>${escapeXml(etsyUrl)}</g:ads_redirect>`
    : '';

  const googleCategory = getGoogleCategory(product);
  const productType = getProductType(product);
  const pinterestId = product.slug.slice(0, 100);

  return `
    <item>
      <g:id>${escapeXml(pinterestId)}</g:id>
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

fs.writeFileSync(FEED_PATH, xml, 'utf8');
console.log(`✅ feed.xml written to ${FEED_PATH}`);
console.log(`   Products in feed: ${products.length}`);
