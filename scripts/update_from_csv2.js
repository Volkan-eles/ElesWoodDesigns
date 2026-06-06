/**
 * update_from_csv2.js
 * 
 * Reads EtsyListingsDownload (2).csv:
 * 1. Updates existing products (prices, images, descriptions)
 * 2. Adds brand new products not yet in JSON
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'public', 'EtsyListingsDownload (2).csv');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');

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
      if (i < len && content[i] === ',') { i++; }
      else { inField = false; }
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
  }
  return rows;
}

function slugify(title) {
  return title
    .toLowerCase()
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

function makeImages(csvRow, headers) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf('IMAGE' + i);
    if (idx >= 0 && csvRow[idx] && csvRow[idx].startsWith('http')) {
      imgs.push(csvRow[idx]);
    }
  }
  return imgs;
}

function determineCategory(title, tags) {
  const t = (title + ' ' + tags).toLowerCase();
  if (t.includes('mothers day') || t.includes('handprint') || t.includes('kentucky derby') ||
      t.includes('portrait') || t.includes('costco') || t.includes('memorial') ||
      t.includes('mahjong') || t.includes('sweepstake') || t.includes('world cup') ||
      t.includes('fifa') || t.includes('bracket') || t.includes('wall chart') ||
      t.includes('christmas') || t.includes('halloween') || t.includes('printable') ||
      t.includes('digital') || t.includes('vintage')) {
    return 'Digital';
  }
  if (t.includes('mud kitchen') || t.includes('treehouse') || t.includes('playhouse') || t.includes('kids')) return 'Kids';
  if (t.includes('loft bed') || t.includes('murphy') || t.includes('bedroom') || t.includes('storage bench') ||
      t.includes('bookshelf') || t.includes('bookcase') || t.includes('shoe rack') || t.includes('shoe carousel')) return 'Bedroom';
  if (t.includes('planter') || t.includes('garden') || t.includes('plant stand') || t.includes('farmstand') ||
      t.includes('farm stand') || t.includes('raised bed') || t.includes('raised garden')) return 'Garden';
  if (t.includes('shed') || t.includes('firewood') || t.includes('pergola') || t.includes('swing') ||
      t.includes('arbor') || t.includes('sauna') || t.includes('chicken') || t.includes('picnic') ||
      t.includes('adirondack') || t.includes('bench') || t.includes('outdoor') || t.includes('patio') ||
      t.includes('chaise') || t.includes('lounge') || t.includes('corner bench') || t.includes('wheelie')) return 'Outdoor';
  if (t.includes('floating shelf') || t.includes('shelf')) return 'Bedroom';
  return 'Workshop';
}

// Etsy URL mapping for known products
const ETSY_URLS = {
  'fifa world cup 2026 wall chart poster': 'https://www.etsy.com/listing/4517694674/fifa-world-cup-2026-wall-chart-poster',
  'fifa world cup 2026 bracket poster': 'https://www.etsy.com/listing/4517674909/fifa-world-cup-2026-bracket-poster-group',
  'world cup 2026 sweepstake kit': 'https://www.etsy.com/listing/4516380026/world-cup-2026-sweepstake-kit-printable',
};

function findEtsyUrl(titleLower) {
  for (const [key, url] of Object.entries(ETSY_URLS)) {
    if (titleLower.includes(key)) return url;
  }
  return '';
}

// Parse CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const qtyIdx = headers.indexOf('QUANTITY');
const tagsIdx = headers.indexOf('TAGS');
const descIdx = headers.indexOf('DESCRIPTION');
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

console.log('CSV rows:', dataRows.length);

// Load JSON
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
console.log('Existing products:', products.length);

const existingTitles = new Map(); // normalized title -> index
products.forEach((p, i) => existingTitles.set(p.name.trim().toLowerCase(), i));

let updatedCount = 0;
const newProducts = [];
let maxId = Math.max(...products.map(p => parseInt(p.id.replace('etsy-', ''), 10)).filter(n => !isNaN(n)));

for (const row of dataRows) {
  const title = (row[titleIdx] || '').trim();
  if (!title) continue;

  const price = parseFloat(row[priceIdx]) || 0;
  const qty = parseInt(row[qtyIdx], 10) || 999;
  const tagsStr = row[tagsIdx] || '';
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const description = (row[descIdx] || '').trim();
  const imgs = makeImages(row, headers);
  const category = determineCategory(title, tagsStr);
  const descShort = description.slice(0, 220).split('\n')[0];
  const titleLower = title.toLowerCase();

  if (existingTitles.has(titleLower)) {
    // UPDATE existing product
    const idx = existingTitles.get(titleLower);
    const p = products[idx];
    let changed = false;

    if (price && Math.abs(price - p.originalPrice) > 0.001) {
      p.originalPrice = price;
      p.price = Math.round((price * 0.30) * 100) / 100;
      changed = true;
    }
    if (imgs.length > 0 && p.image !== imgs[0]) {
      console.log(`  🖼  Updating images for "${title.slice(0, 60)}"`);
      p.image = imgs[0];
      p.thumbnail = makeThumbnail(imgs[0]);
      p.images = imgs;
      p.imagesThumbnails = imgs.map(makeThumbnail);
      changed = true;
    }
    if (description && p.longDescription !== description) {
      p.longDescription = description;
      p.description = descShort;
      changed = true;
    }
    if (tags.length > 0) {
      p.tags = tags;
      p.features = tags.slice(0, 5);
      changed = true;
    }
    if (p.category !== category) {
      p.category = category;
      changed = true;
    }
    if (changed) {
      updatedCount++;
      console.log(`  ✅ Updated: "${title.slice(0, 60)}"`);
    }
  } else {
    // NEW product
    if (!imgs.length) {
      console.warn(`  ⚠️  No images, skipping: "${title.slice(0, 60)}"`);
      continue;
    }
    maxId++;
    const slug = slugify(title);
    const etsyUrl = findEtsyUrl(titleLower);

    newProducts.push({
      id: `etsy-${maxId}`,
      slug,
      name: title,
      category,
      price: Math.round((price * 0.30) * 100) / 100,
      originalPrice: price,
      rating: 0,
      reviewCount: 0,
      difficulty: 'Easy',
      estimatedTime: 'Instant',
      pages: 2,
      description: descShort,
      longDescription: description,
      features: tags.slice(0, 5),
      tags,
      materials: ['Digital Download', 'PDF File', 'Instant Download'],
      image: imgs[0],
      thumbnail: makeThumbnail(imgs[0]),
      images: imgs,
      imagesThumbnails: imgs.map(makeThumbnail),
      etsy_url: etsyUrl,
      bestseller: false,
      inStock: qty > 0,
      stockQuantity: qty,
      google_product_category: 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking',
    });
    console.log(`  ➕ New [etsy-${maxId}]: "${title.slice(0, 60)}"`);
  }
}

const updated = [...products, ...newProducts];
fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Updated: ${updatedCount} products`);
console.log(`   Added:   ${newProducts.length} new products`);
console.log(`   Total:   ${products.length} → ${updated.length}`);
