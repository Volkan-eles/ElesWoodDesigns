/**
 * generate_google_feed_xml.js
 * Generates a Google Merchant Center compliant static /google-feed.xml
 * using short g:id (< 50 chars) and excluding Pinterest text-overlay images.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const FEED_PATH = path.join(ROOT, 'public', 'google-feed.xml');

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
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('costco') || slug.includes('wholesale') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital' && (slug.includes('kentucky-derby') || slug.includes('derby') || slug.includes('party') || slug.includes('game') || slug.includes('betting') || slug.includes('cards') || slug.includes('mothers-day') || slug.includes('handprint') || slug.includes('craft') || slug.includes('keepsake') || slug.includes('mahjong') || slug.includes('sweepstake') || slug.includes('world-cup') || slug.includes('world-soccer') || slug.includes('soccer') || slug.includes('coloring'));
  if (isPortrait || isDigitalArt || isPartyPrintable) return '500044';
  return '505378';
}

function getProductType(product) {
  const slug = product.slug || '';
  const cat = product.category || '';
  const name = (product.name || '').toLowerCase();
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('wholesale') || slug.includes('costco') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital';
  const isKids = cat === 'Kids' || name.includes('treehouse') || name.includes('mud kitchen') || name.includes('playhouse');
  const isGarden = cat === 'Garden' || name.includes('planter') || name.includes('plant stand') || name.includes('garden') || name.includes('farmstand') || name.includes('strawberry');
  const isOutdoor = cat === 'Outdoor' || name.includes('pergola') || name.includes('swing') || name.includes('arbor') || name.includes('sauna') || name.includes('gazebo') || name.includes('shed') || name.includes('chicken') || name.includes('catio') || name.includes('food cart');
  const isBedroom = slug.includes('loft-bed') || slug.includes('murphy-desk') || slug.includes('storage-bench') || slug.includes('bunk-bed');

  if (isPortrait || isDigitalArt) return 'Decor > Digital Art > Printable Designs > Portrait & Wall Art';
  if (isPartyPrintable) return 'Decor > Digital Art > Printable Designs > Party Games & Printables';
  if (isKids) return `Woodworking Plans > Kids > DIY Blueprint > Outdoor Play Structures`;
  if (isGarden) return `Woodworking Plans > Garden > DIY Blueprint > Garden & Planter Builds`;
  if (isOutdoor) return `Woodworking Plans > Outdoor > DIY Blueprint > Outdoor Furniture & Structures`;
  if (isBedroom) return `Woodworking Plans > Furniture > DIY Blueprint > Bedroom & Storage Furniture`;
  return `Woodworking Plans > ${cat} > DIY Blueprint > Beginner-Friendly PDF`;
}

function buildEnrichedDescription(product) {
  const rawDescription = product.longDescription || product.description || '';
  const cleanDesc = cleanText(rawDescription);
  const cat = (product.category || '').toLowerCase();
  let keywords = 'Instant download PDF. Easy to follow step-by-step instructions, cut list, and material list included.';
  if (cat === 'garden') keywords += ' DIY woodworking project for beginners and intermediate builders. Perfect for outdoor garden beds and raised planters.';
  else if (cat === 'outdoor') keywords += ' Build your own outdoor furniture or structure with this easy woodworking plan. Great DIY project for the backyard.';
  else if (cat === 'furniture') keywords += ' Build beautiful handcrafted furniture with this woodworking blueprint. Beginner-friendly with detailed diagrams.';
  else if (cat === 'kids') keywords += ' Safe, fun woodworking project for kids play areas. Detailed plans with safety notes.';
  else if (cat === 'digital') keywords += ' Printable digital download. Print at home instantly after purchase.';

  const tagsStr = product.tags && product.tags.length > 0 ? `Keywords: ${product.tags.slice(0, 10).join(', ')}.` : '';

  const fullDesc = [cleanDesc, keywords, tagsStr].filter(Boolean).join(' ').slice(0, 4990);
  return fullDesc.length > 80 ? fullDesc : `${product.name} - Professional PDF woodworking plan with detailed diagrams, cut list, and step-by-step instructions. Instant digital download.`;
}

const items = products.map((product) => {
  const title = cleanText(product.name).slice(0, 100);
  const description = buildEnrichedDescription(product);

  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const etsyUrl = product.etsy_url && product.etsy_url.startsWith('https://www.etsy.com/listing/') ? product.etsy_url : null;
  const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';

  // Google does not allow Pinterest text-overlays. We ONLY use raw product images.
  const extraImagesList = (product.images || []).slice(1, 10).filter(Boolean);

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
  
  // Google Merchant Center requires ID to be max 50 chars. We use the short product ID (e.g. etsy-101).
  const googleId = product.id;

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

fs.writeFileSync(FEED_PATH, xml, 'utf8');
console.log(`✅ google-feed.xml written to ${FEED_PATH}`);
console.log(`   Products in Google feed: ${products.length}`);
