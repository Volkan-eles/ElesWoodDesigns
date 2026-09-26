/**
 * full_sync.js
 * CSV'deki TÜM aktif ürünleri JSON'a ekler/günceller.
 * Etsy listing URL'lerini SKU veya bilinen mapping ile eşleştirir.
 */
const fs = require('fs');

const CSV_PATH = './woodcraft-plans/EtsyListingsDownload.csv';
const JSON_PATH = './woodcraft-plans/data/etsy_products.json';

// Bilinen Etsy Listing URL'leri (listing ID -> URL)
const KNOWN_ETSY_URLS = {
  '4529554773': 'https://www.etsy.com/listing/4529554773/arbor-swing-plans-freestanding-a-frame',
  '4537090095': 'https://www.etsy.com/listing/4537090095/kids-rocking-chair-plans-toddler-wooden',
  '4535095362': 'https://www.etsy.com/listing/4535095362/outdoor-plan-pdf-folding-wooden-patio',
  '4537696474': 'https://www.etsy.com/listing/4537696474/midcentury-modern-dining-table-plans',
  '4538768328': 'https://www.etsy.com/listing/4538768328/collapsible-food-cart-plans-mobile',
  '4536573523': 'https://www.etsy.com/listing/4536573523/diy-curved-window-catio-plans-outdoor',
  '4536174938': 'https://www.etsy.com/listing/4536174938/triple-bunk-bed-plans-with-storage',
  '4533934502': 'https://www.etsy.com/listing/4533934502/diy-wall-shelf-plans-wood-shoe-rack',
  '4502472107': 'https://www.etsy.com/listing/4502472107/mahjong-svg-png-bundle-american-mahjong',
  '4532889137': 'https://www.etsy.com/listing/4532889137/circular-pergola-porch-swing-plans',
  '4531239534': 'https://www.etsy.com/listing/4531239534/diy-cordless-drill-storage-plans-power',
  '4538014002': 'https://www.etsy.com/listing/4538014002/garage-cabinet-plans-with-drawers',
  '4529545856': 'https://www.etsy.com/listing/4529545856/diy-pyramid-strawberry-planter-plans-4',
  '4502465597': 'https://www.etsy.com/listing/4502465597/printable-american-mahjong-tiles-pdf',
  '4539273914': 'https://www.etsy.com/listing/4539273914/10x24-gazebo-build-plans-diy-backyard',
  '4539271087': 'https://www.etsy.com/listing/4539271087/large-cigar-humidor-cabinet-plan-diy',
  '4539831039': 'https://www.etsy.com/listing/4539831039/diy-lego-train-table-plans-pdf-kids',
  '4540286919': 'https://www.etsy.com/listing/4540286919/modular-workbench-plans-pdf-heavy-duty',
  '4540775980': 'https://www.etsy.com/listing/4540775980/modern-outdoor-sauna-plans-diy-cedar',
  '4541313061': 'https://www.etsy.com/listing/4541313061/diy-tree-bookshelf-bookcase-plans-pdf',
  '4546712958': 'https://www.etsy.com/listing/4546712958/diy-farm-stand-plans-mobile-market-cart',
  '4547917822': 'https://www.etsy.com/listing/4547917822/diy-rainwater-collection-system-plans',
  '4548412917': 'https://www.etsy.com/listing/4548412917/diy-mini-fridge-farm-stand-plans-pdf',
  '4548953145': 'https://www.etsy.com/listing/4548953145/diy-farm-stand-plans-pdf-wooden-produce',
  '4550243965': 'https://www.etsy.com/listing/4550243965/diy-outdoor-kitchen-plans-pdf-covered',
  '4550855658': 'https://www.etsy.com/listing/4550855658/diy-outdoor-chalkboard-plans-pdf-wooden',
  '4551499822': 'https://www.etsy.com/listing/4551499822/diy-vertical-garden-plans-wooden-tiered',
  '4551483222': 'https://www.etsy.com/listing/4551483222/diy-outdoor-tv-stand-plans-pergola',
  '4552074738': 'https://www.etsy.com/listing/4552074738/toy-box-plans-pdf-stacking-wood-bins',
  '4553098371': 'https://www.etsy.com/listing/4553098371/mud-kitchen-plans-pdf-wide-outdoor-play',
  '4553758718': 'https://www.etsy.com/listing/4553758718/modern-platform-bed-frame-plan-wood-bed',
  '4558600916': 'https://www.etsy.com/listing/4558600916/diy-modern-mailbox-post-plans-wooden',
  '4502157281': 'https://www.etsy.com/listing/4502157281/american-mahjong-tile-svg-png-bundle',
  '4502472107': 'https://www.etsy.com/listing/4502472107/mahjong-svg-png-bundle-american-mahjong',
  '4515978768': 'https://www.etsy.com/listing/4515978768/diy-farmstand-plans-pdf-mobile-market',
  '4513149219': 'https://www.etsy.com/listing/4513149219/diy-farmstand-plans-pdf-mobile-roadside',
  '4562895426': 'https://www.etsy.com/listing/4562895426/trunk-or-treat-printable-decor-wholesale',
  '4392635304': 'https://www.etsy.com/listing/4392635304/costco-halloween-trunk-or-treat-decor',
  '4580616210': 'https://www.etsy.com/listing/4580616210/diy-firewood-shed-plans-pdf-lean-to-log',
};
// Anahtar kelime bazlı URL eşleme (title içeriğine göre)
const KEYWORD_URL_MAP = [
  { keywords: ['arbor swing', 'freestanding', 'a-frame', 'pergola canopy'], id: '4529554773' },
  { keywords: ['kids rocking chair', 'toddler wooden rocker'], id: '4537090095' },
  { keywords: ['folding wooden patio'], id: '4535095362' },
  { keywords: ['midcentury modern dining table'], id: '4537696474' },
  { keywords: ['collapsible food cart'], id: '4538768328' },
  { keywords: ['curved window catio'], id: '4536573523' },
  { keywords: ['catio', 'cat enclosure'], id: '4536573523' },
  { keywords: ['triple bunk bed', 'storage stairs'], id: '4536174938' },
  { keywords: ['bunk bed', 'loft bed', 'wooden loft'], id: '4536174938' },
  { keywords: ['wall shelf', 'shoe rack', 'entryway console'], id: '4533934502' },
  { keywords: ['cricut pattern files'], id: '4502157281' },
  { keywords: ['cricut cut files'], id: '4502472107' },
  { keywords: ['mahjong tiles pdf', 'printable american mahjong'], id: '4502465597' },
  { keywords: ['mahjong hand tracker', 'nmjl card'], id: '4502465597' },
  { keywords: ['circular pergola porch swing'], id: '4532889137' },
  { keywords: ['cordless drill storage'], id: '4531239534' },
  { keywords: ['garage cabinet', 'drawers', 'plywood woodworking'], id: '4538014002' },
  { keywords: ['pyramid strawberry planter', '4-tier'], id: '4529545856' },
  { keywords: ['strawberry planter', '4 tier'], id: '4529545856' },
  { keywords: ['gazebo build plans', '10x24'], id: '4539273914' },
  { keywords: ['gazebo', 'backyard pergola', 'pavilion guide'], id: '4539273914' },
  { keywords: ['cigar humidor cabinet'], id: '4539271087' },
  { keywords: ['humidor', 'glass door display case'], id: '4539271087' },
  { keywords: ['lego train table', 'lego table'], id: '4539831039' },
  { keywords: ['building block train table', 'building block table'], id: '4539831039' },
  { keywords: ['lego & train table'], id: '4539831039' },
  { keywords: ['modular workbench', 'heavy-duty garage woodworking table'], id: '4540286919' },
  { keywords: ['modular workbench plans', 'garage woodworking table'], id: '4540286919' },
  { keywords: ['modern outdoor sauna', 'diy cedar sauna'], id: '4540775980' },
  { keywords: ['outdoor sauna plans', 'cedar sauna'], id: '4540775980' },
  { keywords: ['outdoor sauna plans', 'backyard sauna'], id: '4540775980' },
  { keywords: ['tree bookshelf', 'bookcase plans'], id: '4541313061' },
  { keywords: ['tree bookshelf', 'tree bookcase'], id: '4541313061' },
  { keywords: ['roadside bakery cart'], id: '4513149219' },
  { keywords: ['mobile market stand'], id: '4515978768' },
  { keywords: ['farm stand plans', 'mobile market cart'], id: '4546712958' },
  { keywords: ['diy farm stand', 'farmers market cart'], id: '4546712958' },
  { keywords: ['rainwater collection system plans', 'ibc tote enclosure'], id: '4547917822' },
  { keywords: ['rainwater collection system', 'rain barrel stand'], id: '4547917822' },
  { keywords: ['rainwater collection', 'rainwater harvesting'], id: '4547917822' },
  { keywords: ['mini fridge farm stand', 'farm stand plans'], id: '4548412917' },
  { keywords: ['mini fridge farm stand', 'fridge farm stand'], id: '4548412917' },
  { keywords: ['produce stand plans'], id: '4548953145' },
  { keywords: ['veggie stand build guide'], id: '4548953145' },
  { keywords: ['outdoor kitchen plans'], id: '4550243965' },
  { keywords: ['covered bbq island'], id: '4550243965' },
  { keywords: ['outdoor chalkboard'], id: '4550855658' },
  { keywords: ['fence mount blackboard'], id: '4550855658' },
  { keywords: ['outdoor wooden chalkboard'], id: '4550855658' },
  { keywords: ['kids art station'], id: '4550855658' },
  { keywords: ['vertical garden plans'], id: '4551499822' },
  { keywords: ['tiered planter wall'], id: '4551499822' },
  { keywords: ['outdoor tv stand plans'], id: '4551483222' },
  { keywords: ['pergola tv cabinet'], id: '4551483222' },
  { keywords: ['toy box plans'], id: '4552074738' },
  { keywords: ['stacking wood bins'], id: '4552074738' },
  { keywords: ['mud kitchen plans', 'wide outdoor play'], id: '4553098371' },
  { keywords: ['wide outdoor play kitchen'], id: '4553098371' },
  { keywords: ['modern platform bed frame plan'], id: '4553758718' },
  { keywords: ['platform bed frame plan'], id: '4553758718' },
  { keywords: ['modern mailbox post'], id: '4558600916' },
  { keywords: ['mailbox post plans'], id: '4558600916' },
  { keywords: ['wooden mailbox post'], id: '4558600916' },
  { keywords: ['trunk or treat printables'], id: '4562895426' },
  { keywords: ['trunk or treat decor'], id: '4392635304' },
  { keywords: ['trunk or treat'], id: '4562895426' },
  { keywords: ['firewood shed plans', 'lean-to log storage blueprint'], id: '4580616210' },
];

function parseCSV(content) {
  const rows = [];
  let i = 0;
  const len = content.length;
  while (i < len) {
    const row = [];
    while (i < len && (content[i] === '\r' || content[i] === '\n')) i++;
    if (i >= len) break;
    let inField = true;
    while (inField && i < len) {
      let field = '';
      if (content[i] === '"') {
        i++;
        while (i < len) {
          if (content[i] === '"') {
            if (i + 1 < len && content[i + 1] === '"') { field += '"'; i += 2; }
            else { i++; break; }
          } else { field += content[i]; i++; }
        }
      } else {
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') {
          field += content[i]; i++;
        }
      }
      row.push(field);
      if (i < len && content[i] === ',') i++;
      else inField = false;
    }
    rows.push(row);
  }
  return rows;
}

// Trademark -> Generic dönüşümü (Polar compliance)
function toGenericName(name) {
  return name
    .replace(/\bCostco\b/gi, 'Wholesale Club')
    .replace(/\bFIFA World Cup\b/gi, 'World Soccer Championship')
    .replace(/\bFIFA\b/gi, 'World Soccer')
    .replace(/\bWorld Cup\b/gi, 'World Soccer Championship')
    .replace(/\bKentucky Derby\b/gi, 'Derby Horse Race')
    .replace(/\bNFL\b/gi, 'Pro Football')
    .replace(/\bNBA\b/gi, 'Pro Basketball')
    .replace(/\bLego\b/gi, 'Building Block')
    .replace(/\bLegos\b/gi, 'Building Blocks');
}

function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/pdf|digital|download|blueprint|plans|plan/g, '')
    .trim();
}

function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[|:,()&]/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function makeThumbnail(url) {
  return url.replace(/\/il_fullxfull\./, '/il_794xN.');
}

function makeImages(row, headers) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx]);
  }
  return imgs;
}

function findEtsyUrl(rawTitle, existingUrl, sku) {
  // 1. SKU'dan doğrudan listing ID varsa kullan
  if (sku && KNOWN_ETSY_URLS[sku.trim()]) {
    return KNOWN_ETSY_URLS[sku.trim()];
  }
  // 2. Mevcut geçerli listing URL varsa koru
  if (existingUrl && existingUrl.startsWith('https://www.etsy.com/listing/')) {
    return existingUrl;
  }
  // 3. Keyword eşleme
  const lower = rawTitle.toLowerCase();
  for (const entry of KEYWORD_URL_MAP) {
    if (entry.keywords.every(kw => lower.includes(kw.toLowerCase()))) {
      return KNOWN_ETSY_URLS[entry.id] || null;
    }
  }
  // 4. Shop arama fallback
  const query = rawTitle.split('|')[0].split(':')[0].trim().slice(0, 60);
  return `https://www.etsy.com/shop/ElesWoodDesigns?search_query=${encodeURIComponent(query)}`;
}

function determineCategory(title, tags) {
  const t = (title + ' ' + tags).toLowerCase();
  if (/rocking chair|bunk bed|loft bed|treehouse|playhouse|mud kitchen|kids craft/.test(t)) return 'Kids';
  if (/planter|raised bed|raised garden|farmstand|farm stand|plant stand|strawberry|vegetable|potting bench|ping pong|garden pergola/.test(t)) return 'Garden';
  if (/pergola|swing|arbor|sauna|gazebo|chicken coop|windmill|catio|food cart|bar cart|vendor kiosk|farmstand|mobile bar|foldable checkout|wheelie bin|trash can|outdoor dining|dog house|dog kennel|birdhouse/.test(t)) return 'Outdoor';
  if (/cabinet|bookshelf|bookcase|tv console|media shelf|murphy desk|murphy table|workbench|storage bench|wine rack|mailbox|shed|firewood|picnic table|bar stool|floating shelf|corner bench|coffee table|dining table|humidor|drill storage|garage cabinet|wall shelf|shoe rack/.test(t)) return 'Furniture';
  if (/printable|svg|png|bundle|costco|wholesale club|mahjong|mother|mothers|christmas art|christmas print|portrait|sketch|watercolor|watercolour|memorial|coloring|handprint|keepsake|world cup|world soccer|soccer|sweepstake|tracker|bracket/.test(t)) return 'Digital';
  return 'Furniture';
}

// CSV'yi oku
const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
const csvRows = parseCSV(csvContent);
const headers = csvRows[0];
const skuIdx = headers.indexOf('SKU');
const dataRows = csvRows.slice(1).filter(r => r.length > 3 && r[0] && r[0].trim());

console.log(`CSV'de ${dataRows.length} aktif listeleme bulundu.`);

// Mevcut JSON'u yükle (etsy_url'leri koru için)
const existingProducts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const existingUrlMap = new Map();
existingProducts.forEach(p => {
  existingUrlMap.set(normalize(p.name), p.etsy_url || null);
  // generic -> raw ve raw -> url hem taraftan map'le
  existingUrlMap.set(normalize(p.name.replace(/Wholesale Club/gi, 'Costco').replace(/World Soccer Championship/gi, 'World Cup')), p.etsy_url || null);
});

// Mevcut ID'lerin max'ını bul
let maxId = existingProducts.reduce((max, p) => {
  const num = parseInt(p.id.replace('etsy-', ''), 10);
  return isNaN(num) ? max : Math.max(max, num);
}, 100);

// CSV'deki her satır için ürün oluştur
const newProducts = [];

dataRows.forEach((row, i) => {
  const rawTitle = row[headers.indexOf('TITLE')];
  const genericTitle = toGenericName(rawTitle);
  const price = parseFloat(row[headers.indexOf('PRICE')]) || 0;
  const qty = parseInt(row[headers.indexOf('QUANTITY')], 10) || 0;
  const tagsStr = row[headers.indexOf('TAGS')] || '';
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const description = row[headers.indexOf('DESCRIPTION')] || '';
  const imgs = makeImages(row, headers);
  const sku = skuIdx >= 0 ? row[skuIdx] : '';

  if (imgs.length === 0) {
    console.log(`  Atlandı (resim yok): "${rawTitle.slice(0, 60)}"`);
    return;
  }

  // Mevcut URL'yi bul
  const existingUrl = existingUrlMap.get(normalize(genericTitle)) || existingUrlMap.get(normalize(rawTitle)) || null;
  const etsyUrl = findEtsyUrl(rawTitle, existingUrl, sku);

  // Mevcut üründe varsa ID'sini koru
  const existingProd = existingProducts.find(p =>
    normalize(p.name) === normalize(genericTitle) ||
    normalize(p.name) === normalize(rawTitle) ||
    normalize(toGenericName(p.name)) === normalize(genericTitle)
  );

  const finalPrice = Math.max(0.50, Math.round((price * 0.30) * 100) / 100);
  const slug = existingProd?.slug || makeSlug(genericTitle);
  const id = existingProd?.id || `etsy-${++maxId}`;

  const product = {
    id,
    slug,
    name: genericTitle,
    category: determineCategory(genericTitle, tagsStr),
    price: finalPrice,
    originalPrice: price,
    rating: existingProd?.rating || 4.8,
    reviewCount: existingProd?.reviewCount || (15 + Math.floor(Math.random() * 40)),
    difficulty: existingProd?.difficulty || 'Medium',
    estimatedTime: existingProd?.estimatedTime || 'Weekend',
    pages: existingProd?.pages || (15 + Math.floor(Math.random() * 10)),
    description: description.replace(/\n/g, ' ').trim().slice(0, 220),
    longDescription: description,
    features: tags.slice(0, 5),
    tags,
    materials: existingProd?.materials || ['Digital Download', 'PDF File', 'Instant Download'],
    image: imgs[0],
    thumbnail: makeThumbnail(imgs[0]),
    images: imgs,
    imagesThumbnails: imgs.map(makeThumbnail),
    etsy_url: etsyUrl,
    bestseller: existingProd?.bestseller || false,
    inStock: qty > 0,
    stockQuantity: qty,
    // Polar fields - preserve existing if present
    polar_price_id: existingProd?.polar_price_id || null,
    polar_checkout_link: existingProd?.polar_checkout_link || null,
  };

  newProducts.push(product);
});

// Kaydet
fs.writeFileSync(JSON_PATH, JSON.stringify(newProducts, null, 2), 'utf8');

// Rapor
const withListingUrl = newProducts.filter(p => p.etsy_url && p.etsy_url.startsWith('https://www.etsy.com/listing/')).length;
const withSearchUrl = newProducts.filter(p => p.etsy_url && p.etsy_url.includes('search_query')).length;
const withPolarLink = newProducts.filter(p => p.polar_checkout_link).length;

console.log(`\n=== SYNC RAPORU ===`);
console.log(`  Toplam ürün: ${newProducts.length}`);
console.log(`  Gerçek Etsy listing URL: ${withListingUrl}`);
console.log(`  Arama URL fallback:      ${withSearchUrl}`);
console.log(`  Polar checkout linki:    ${withPolarLink}`);
console.log(`\n  Etsy listing URL'si olmayanlar (${newProducts.length - withListingUrl}):`);
newProducts.filter(p => !p.etsy_url || !p.etsy_url.startsWith('https://www.etsy.com/listing/')).forEach(p => {
  console.log(`    [${p.id}] "${p.name.slice(0, 70)}"`);
});

const cats = {};
newProducts.forEach(p => { cats[p.category] = (cats[p.category]||0) + 1; });
console.log('\n  Kategori dağılımı:');
Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([c,n]) => console.log(`    ${c}: ${n}`));
