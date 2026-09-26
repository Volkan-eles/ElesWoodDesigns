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

// Build an enriched description for Pinterest SEO — keywords + hashtags + CTA
function buildEnrichedDescription(product) {
  const rawDescription = product.longDescription || product.description || '';
  const cleanDesc = cleanText(rawDescription).slice(0, 300);

  // Pinterest-optimized keyword suffix by category with hashtags
  const cat = (product.category || '').toLowerCase();
  const price = `$${(product.price || 0).toFixed(2)}`;

  let cta = `Get the complete step-by-step PDF blueprint for only ${price}. Instant download — cut list, 3D diagrams & material list included.`;

  let hashtags = '';
  if (cat === 'garden') {
    cta += ' Perfect DIY garden project for beginners and intermediate builders.';
    hashtags = '#diygarden #gardenproject #woodworkingplans #diywoodworking #raisedbed #gardenbed #backyarddiy #diyprojects #homeimprovement #gardendesign';
  } else if (cat === 'outdoor') {
    cta += ' Build beautiful outdoor furniture and structures for your backyard.';
    hashtags = '#outdoorfurniture #diyoutdoor #woodworkingplans #backyardideas #diywoodworking #pergola #patio #outdoorliving #diyprojects #homeimprovement';
  } else if (cat === 'furniture') {
    cta += ' Create beautiful handcrafted furniture with this beginner-friendly blueprint.';
    hashtags = '#diyfurniture #woodworkingplans #diywoodworking #furnitureplans #handmadefurniture #farmhousestyle #rusticfurniture #diyhomedecor #homeimprovement #diyprojects';
  } else if (cat === 'kids') {
    cta += ' Safe, fun woodworking project for kids play areas — detailed plans with safety notes.';
    hashtags = '#kidsfurniture #diykids #playhouse #treehouse #diywoodworking #woodworkingplans #familyproject #diyprojects #kidsoutdoor #backyardplay';
  } else if (cat === 'digital') {
    cta += ' Printable digital download — print at home and create instantly.';
    hashtags = '#printable #instantdownload #digitaldownload #diycraft #homedecor #printabledecor #diydecor #craftideas #diyhomedecor #crafting';
  } else {
    hashtags = '#woodworking #diywoodworking #woodworkingplans #diyprojects #diyhome #craftsman #buildyourown #homeimprovement #makersmovement #workshop';
  }

  const tagsFromProduct = product.tags && product.tags.length > 0 ? product.tags.slice(0, 5).join(', ') : '';

  const fullDesc = [cleanDesc, cta, tagsFromProduct ? `Keywords: ${tagsFromProduct}.` : '', hashtags]
    .filter(Boolean).join(' ').slice(0, 4990);
  return fullDesc.length > 80
    ? fullDesc
    : `${product.name} - Professional PDF woodworking plan with detailed diagrams, cut list, and step-by-step instructions. Instant digital download. ${hashtags}`;
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
  
  // Static 2:3 Pinterest Pin image (pre-generated, serves in 20ms from Vercel Edge CDN)
  const pinImagePath = path.join(ROOT, 'public', 'pinterest-images', `${product.slug}.jpg`);
  const hasStaticPin = fs.existsSync(pinImagePath);
  const staticPinUrl = `${baseUrl}/pinterest-images/${product.slug}.jpg`;
  const rawProductImage = (product.images && product.images[0]) ? product.images[0] : '';

  // Use vertical 2:3 pin image as primary for maximum Pinterest click-through rate, fallback to raw photo
  const primaryImage = hasStaticPin ? staticPinUrl : rawProductImage;

  // Additional images: raw product photos from Etsy CDN + any other angles
  const extraImagesList = (product.images || []).filter(img => img && img !== primaryImage).slice(0, 9);
  if (!hasStaticPin && rawProductImage) {
    // If static pin wasn't used as primary, don't duplicate
  } else if (hasStaticPin && rawProductImage) {
    extraImagesList.unshift(rawProductImage);
  }

  const extraImagesXml = extraImagesList
    .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join('\n');

  const salePrice = product.price;
  const origPrice = product.originalPrice != null ? product.originalPrice : Math.round((salePrice / 0.30) * 100) / 100;
  const salePriceStr = `${salePrice.toFixed(2)} USD`;
  const origPriceStr = `${origPrice.toFixed(2)} USD`;

  const targetCountries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL'];
  const shippingXml = targetCountries.map(country => `      <g:shipping>
        <g:country>${country}</g:country>
        <g:service>Digital Download</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>`).join('\n');

  const googleCategory = getGoogleCategory(product);
  const productType = getProductType(product);
  const pinterestId = product.slug.slice(0, 100);
  const labels = getCustomLabels(product);
  const nowIso = new Date().toISOString();

  // IMPORTANT: No <g:ads_redirect> to external etsy.com — caused Pinterest domain mismatch violation
  return `
    <item>
      <g:id>${escapeXml(pinterestId)}</g:id>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description>${escapeXml(description)}</description>
      <g:description>${escapeXml(description)}</g:description>
      <enclosure url="${escapeXml(primaryImage)}" type="image/jpeg" length="50000" />
      <media:content url="${escapeXml(primaryImage)}" medium="image" type="image/jpeg">
        <media:title>${escapeXml(title)}</media:title>
        <media:description>${escapeXml(description)}</media:description>
      </media:content>
      <media:thumbnail url="${escapeXml(primaryImage)}" />
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImagesXml}
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
      <g:updated_at>${nowIso}</g:updated_at>
${shippingXml}
    </item>`;
}).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>ElesWoodDesigns – DIY Woodworking Plans</title>
    <link>${baseUrl}/</link>
    <description>Professional DIY woodworking PDF plans with 3D diagrams, cut lists, and material lists. Instant download.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

fs.writeFileSync(FEED_PATH, xml, 'utf8');
console.log(`✅ feed.xml written to ${FEED_PATH}`);
console.log(`   Products in feed: ${products.length}`);

// Generate google-feed.xml too
try {
  const { execSync } = require('child_process');
  execSync('node scripts/generate_google_feed_xml.js', { stdio: 'inherit', cwd: ROOT });
} catch (e) {
  console.error('Error generating Google feed:', e.message);
}
