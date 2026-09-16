/**
 * generate_pinterest_bulk_csv.js
 * Pinterest Bulk Pin Uploader — OPTIMIZED VERSION
 * 
 * Strateji:
 * - Her ürün için 3 farklı pin (farklı görsel, başlık, açıklama, board)
 * - Pinterest SEO için güçlü anahtar kelimeler + hashtag'ler
 * - Kategori bazlı board hedefleme
 * - Portre format: /api/pin/{slug}/pin.jpg önce, sonra CDN görseller
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const BULK_OUTPUT_PATH = path.join(ROOT, 'public', 'pinterest-bulk-pins.csv');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const baseUrl = 'https://eleswooddesigns.com';

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Pinterest category hashtag sets (max 20 per pin)
const HASHTAGS = {
  Furniture: '#diyfurniture #woodworkingplans #diywoodworking #furnitureplans #handmadefurniture #woodwork #buildyourown #diyprojects #homemade #woodworking #furnitureideas #diyhome #woodworkingproject #craftsman #rusticfurniture #farmhousestyle #homeimprovement #makersmovement #diyhomedecor #buildyourown',
  Garden: '#diygarden #gardenproject #raisedbed #gardenbed #gardendesign #diygardenbed #backyardgarden #vegetablegarden #woodworkingplans #diywoodworking #gardenideas #outdoorgarden #gardenbed #planter #diyplanter #gardenbed #homestead #growandfood #homeimprovement #diyprojects',
  Outdoor: '#outdoorfurniture #backyardideas #diyoutdoor #pergolaplans #deckideas #patio #outdoorliving #backyard #diywoodworking #woodworkingplans #outdoordiy #gardendesign #deckdecor #patiodesign #backyarddiy #outdoorproject #pergola #firepit #homeimprovement #diyprojects',
  Kids: '#kidsfurniture #diykids #playhouse #treehouse #kidsroom #outdoorplay #kidsdiy #familyproject #diywoodworking #woodworkingplans #childrensfurniture #playroom #kidsoutdoor #backyardplay #kidscrafts #buildtogether #familydiy #diyplayhouse #kidsactivities #childrensroom',
  Digital: '#printable #instantdownload #digitaldowload #diycraft #homedecor #printabledecor #diyprintable #freeprintable #partyprintable #digitalcraft #craftideas #papercraft #printabledesign #homedecoration #walldecor #diydecor #printableart #craftproject #diyhomedecor #crafting',
  default: '#woodworking #diywoodworking #woodworkingplans #diyprojects #diyhome #woodcraft #handmade #buildyourown #homeimprovement #craftsman #woodwork #workshop #makersmovement #diycommunity #buildandmake #sawdust #woodworkersofinstagram #diybuilds #diyplansforsale #downloadableplan',
};

// Category → board mapping (multiple boards per category)
const BOARDS = {
  Furniture: [
    'DIY Woodworking Plans',
    'DIY Furniture Plans',
    'Woodworking Projects for Beginners',
  ],
  Garden: [
    'DIY Garden Woodworking Plans',
    'DIY Woodworking Plans',
    'Garden Ideas & Projects',
  ],
  Outdoor: [
    'DIY Outdoor Woodworking Plans',
    'DIY Woodworking Plans',
    'Backyard DIY Projects',
  ],
  Kids: [
    'DIY Kids Woodworking Plans',
    'DIY Woodworking Plans',
    'Kids Outdoor Play Ideas',
  ],
  Digital: [
    'Printable Games & Digital Crafts',
    'DIY Woodworking Plans',
    'Instant Download Printables',
  ],
  default: [
    'DIY Woodworking Plans',
    'DIY Projects & Ideas',
    'Woodworking Projects for Beginners',
  ],
};

// Power-word title templates (Pinterest search optimized)
function buildTitleVariants(product) {
  const clean = cleanText(product.name).slice(0, 90);
  const shortName = clean.split('|')[0].trim().split(':')[0].trim().slice(0, 60);
  const cat = product.category || 'Woodworking';
  const price = `$${product.price.toFixed(2)}`;

  return [
    // Variant 1: Direct keyword-rich title
    `${clean} | Step-by-Step PDF`,
    // Variant 2: Benefit-led title
    `Build Your Own ${shortName} — ${cat} PDF Plans | Instant Download`,
    // Variant 3: Value proposition title
    `${shortName} Woodworking Plans — Only ${price} | Beginner Friendly PDF`,
  ].map(t => t.slice(0, 100));
}

// Description variants — each one has different hook + CTA
function buildDescVariants(product) {
  const rawDesc = cleanText(product.longDescription || product.description || '');
  const truncDesc = rawDesc.slice(0, 200);
  const features = (product.features || []).slice(0, 3).join(' | ');
  const tags = HASHTAGS[product.category] || HASHTAGS.default;
  const price = `$${product.price.toFixed(2)}`;
  const difficulty = product.difficulty || 'Beginner';

  return [
    // Variant 1: Feature-focused
    `${truncDesc} ✅ Includes: ${features}. Instant PDF download — ${difficulty} friendly. ${tags}`.slice(0, 500),
    // Variant 2: Urgency + value
    `70% OFF TODAY ONLY! ${truncDesc} Get the complete step-by-step woodworking blueprint for only ${price}. Instant digital download. 💛 Save this pin to build later! ${tags}`.slice(0, 500),
    // Variant 3: Community/inspiration angle
    `This DIY project is one of our most-saved pins! ${truncDesc} Download the full plans for ${price} — includes cut list, 3D diagrams & material list. 📌 Save & share with your woodworking friends! ${tags}`.slice(0, 500),
  ];
}

// Collect images for the product (portrait pin image first, then CDN images)
function getImages(product) {
  const pinImg = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;
  const cdnImgs = (product.images || []).filter(Boolean);
  return [pinImg, ...cdnImgs];
}

const headers = ['Title', 'Description', 'Link', 'Media URL', 'Pinterest Board'];
const csvRows = [headers.join(',')];

const usedCombo = new Set(); // Prevent exact duplicate title+image combos

products.forEach((product) => {
  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const titles = buildTitleVariants(product);
  const descs = buildDescVariants(product);
  const images = getImages(product);
  const boards = BOARDS[product.category] || BOARDS.default;

  // Generate 3 pin variants per product
  for (let v = 0; v < 3; v++) {
    const title = titles[v] || titles[0];
    const desc = descs[v] || descs[0];
    const board = boards[v] || boards[0];
    // Rotate through images: portrait pin for v0, CDN images for v1 and v2
    const imgIdx = v === 0 ? 0 : Math.min(v, images.length - 1);
    const imageUrl = images[imgIdx] || images[0];

    const comboKey = `${title}::${imageUrl}`;
    if (usedCombo.has(comboKey)) continue;
    usedCombo.add(comboKey);

    const row = [title, desc, siteUrl, imageUrl, board];
    csvRows.push(row.map(escapeCsv).join(','));
  }
});

const csvContent = csvRows.join('\n');
fs.writeFileSync(BULK_OUTPUT_PATH, csvContent, 'utf8');
console.log(`✅ Pinterest Bulk Pin CSV written to ${BULK_OUTPUT_PATH}`);
console.log(`   Total Products: ${products.length}`);
console.log(`   Total Pins (3x per product): ${csvRows.length - 1}`);
