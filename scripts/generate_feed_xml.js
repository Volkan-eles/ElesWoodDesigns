/**
 * generate_feed_xml.js
 * Generates /feed.xml (static copy) from data/etsy_products.json
 * Pinterest-optimized with: enriched descriptions, custom_label targeting,
 * keyword-rich content, and proper product_type taxonomy.
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

// Build an enriched description for Pinterest SEO
function buildEnrichedDescription(product) {
  const rawDescription = product.longDescription || product.description || '';
  const cleanDesc = cleanText(rawDescription);

  // Pinterest-optimized keyword suffix by category
  const cat = (product.category || '').toLowerCase();
  let keywords = 'Instant download PDF. Easy to follow step-by-step instructions, cut list, and material list included.';
  if (cat === 'garden') keywords += ' DIY woodworking project for beginners and intermediate builders. Perfect for outdoor garden beds and raised planters.';
  else if (cat === 'outdoor') keywords += ' Build your own outdoor furniture or structure with this easy woodworking plan. Great DIY project for the backyard.';
  else if (cat === 'furniture') keywords += ' Build beautiful handcrafted furniture with this woodworking blueprint. Beginner-friendly with detailed diagrams.';
  else if (cat === 'kids') keywords += ' Safe, fun woodworking project for kids play areas. Detailed plans with safety notes.';
  else if (cat === 'digital') keywords += ' Printable digital download. Print at home instantly after purchase.';

  const tagsStr = product.tags && product.tags.length > 0 ? `Keywords: ${product.tags.slice(0, 10).join(', ')}.` : '';

  const fullDesc = [cleanDesc, keywords, tagsStr].filter(Boolean).join(' ').slice(0, 4990);
  return fullDesc.length > 80
    ? fullDesc
    : `${product.name} - Professional PDF woodworking plan with detailed diagrams, cut list, and step-by-step instructions. Instant digital download.`;
}

// Custom labels for Pinterest campaign targeting (retargeting & audience segmentation)
function getCustomLabels(product) {
  const cat = (product.category || '').toLowerCase();
  const price = product.price || 0;
  const rating = product.rating || 0;
  const bestseller = product.bestseller ? 'bestseller' : 'standard';

  // label_0: category bucket for Pinterest audience targeting
  const label0 = cat === 'garden' ? 'garden-plans' :
    cat === 'outdoor' ? 'outdoor-plans' :
    cat === 'furniture' ? 'furniture-plans' :
    cat === 'kids' ? 'kids-plans' :
    cat === 'digital' ? 'printables' : 'woodworking-plans';

  // label_1: price tier for bid strategy
  const label1 = price < 2 ? 'price-under-2' : price < 5 ? 'price-2-5' : price < 8 ? 'price-5-8' : 'price-over-8';

  // label_2: rating tier
  const label2 = rating >= 4.8 ? 'top-rated' : rating >= 4.5 ? 'high-rated' : 'standard';

  // label_3: bestseller flag for promoted pins
  const label3 = bestseller;

  // label_4: skill level
  const diff = (product.difficulty || '').toLowerCase();
  const label4 = diff === 'easy' ? 'beginner-friendly' : diff === 'hard' ? 'advanced' : 'intermediate';

  return { label0, label1, label2, label3, label4 };
}

const items = products.map((product) => {
  const title = cleanText(product.name).slice(0, 100);
  const description = buildEnrichedDescription(product);

  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const etsyUrl = product.etsy_url && product.etsy_url.startsWith('https://www.etsy.com/listing/') ? product.etsy_url : null;
  const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
  const pinImage = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;

  // Pinterest prefers portrait/square images — Pinterest-generated pin image goes first
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

  // ads_redirect → real Etsy listing URL for better conversion tracking
  const adsRedirectXml = etsyUrl
    ? `      <g:ads_redirect>${escapeXml(etsyUrl)}</g:ads_redirect>`
    : '';

  const googleCategory = getGoogleCategory(product);
  const productType = getProductType(product);
  const pinterestId = product.slug.slice(0, 100);
  const labels = getCustomLabels(product);

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
      <g:custom_label_0>${escapeXml(labels.label0)}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(labels.label1)}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(labels.label2)}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(labels.label3)}</g:custom_label_3>
      <g:custom_label_4>${escapeXml(labels.label4)}</g:custom_label_4>
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
