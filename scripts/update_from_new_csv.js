/**
 * update_from_new_csv.js
 * Reads public/EtsyListingsDownload.csv, adds new products and updates existing ones.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'public', 'EtsyListingsDownload.csv');
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
    .replace(/[|:,()&–—]/g, ' ')
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
  if (
    t.includes('mothers day') || t.includes('handprint') || t.includes('kentucky derby') ||
    t.includes('portrait') || t.includes('costco') || t.includes('memorial') ||
    t.includes('mahjong') || t.includes('sweepstake') || t.includes('world cup') ||
    t.includes('fifa') || t.includes('bracket') || t.includes('wall chart') ||
    t.includes('christmas') || t.includes('halloween') || t.includes('printable') ||
    t.includes('tracker') || t.includes('coloring') || t.includes('colouring') ||
    t.includes('tournament') || t.includes('soccer') || t.includes('digital download')
  ) return 'Digital';
  if (t.includes('mud kitchen') || t.includes('treehouse') || t.includes('playhouse')) return 'Kids';
  if (t.includes('loft bed') || t.includes('murphy bed') || t.includes('murphy desk') ||
      t.includes('bookshelf') || t.includes('bookcase') || t.includes('shoe rack') ||
      t.includes('shoe carousel') || t.includes('floating shelf') || t.includes('wardrobe') ||
      t.includes('storage bench') || t.includes('tote rack') || t.includes('garage storage')) return 'Bedroom';
  if (t.includes('planter') || t.includes('garden') || t.includes('plant stand') ||
      t.includes('farmstand') || t.includes('farm stand') || t.includes('raised bed') ||
      t.includes('raised garden') || t.includes('mailbox') || t.includes('windmill') ||
      t.includes('greenhouse') || t.includes('potting bench')) return 'Garden';
  if (t.includes('shed') || t.includes('firewood') || t.includes('pergola') || t.includes('swing') ||
      t.includes('arbor') || t.includes('sauna') || t.includes('chicken') || t.includes('picnic') ||
      t.includes('adirondack') || t.includes('bench') || t.includes('outdoor') || t.includes('patio') ||
      t.includes('chaise') || t.includes('lounge') || t.includes('wheelie') || t.includes('fence') ||
      t.includes('ping pong') || t.includes('playhouse') || t.includes('dog house') ||
      t.includes('bar stool') || t.includes('bar cart') || t.includes('food cart') ||
      t.includes('storage cabinet')) return 'Outdoor';
  return 'Workshop';
}

// Etsy URL mapping for new products (user provided or derived from listing URLs)
function findEtsyUrl(titleLower) {
  if (titleLower.includes('fifa world cup 2026 bracket tracker poster')) {
    // New listing - same product family as bracket poster
    return 'https://www.etsy.com/listing/4517674909/fifa-world-cup-2026-bracket-poster-group';
  }
  if (titleLower.includes('27 gallon tote rack')) {
    return '';  // Will need URL from user or Etsy
  }
  if (titleLower.includes('double garden chair bench')) {
    return '';  // Will need URL from user or Etsy
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

const existingTitleMap = new Map();
products.forEach((p, i) => existingTitleMap.set(p.name.trim().toLowerCase(), i));

let updatedCount = 0;
const newProducts = [];
let maxId = Math.max(...products.map(p => parseInt(p.id.replace('etsy-', ''), 10)).filter(n => !isNaN(n)));

for (const row of dataRows) {
  const title = (row[titleIdx] || '').trim();
  if (!title) continue;

  const price = parseFloat(row[priceIdx]) || 0;
  const qty = parseInt(row[qtyIdx], 10);
  const tagsStr = row[tagsIdx] || '';
  const tags = tagsStr.split(',').map(t => t.trim().replace(/_/g, ' ')).filter(Boolean);
  const description = (row[descIdx] || '').trim();
  const imgs = makeImages(row, headers);
  const category = determineCategory(title, tagsStr);
  const descShort = description.slice(0, 220).split('\n')[0];
  const titleLower = title.toLowerCase();

  if (existingTitleMap.has(titleLower)) {
    // UPDATE existing
    const idx = existingTitleMap.get(titleLower);
    const p = products[idx];
    let changed = false;

    if (price && p.originalPrice && Math.abs(price - p.originalPrice) > 0.001) {
      p.originalPrice = price;
      p.price = Math.round((price * 0.30) * 100) / 100;
      changed = true;
    }
    if (imgs.length > 0 && p.image !== imgs[0]) {
      p.image = imgs[0];
      p.thumbnail = makeThumbnail(imgs[0]);
      p.images = imgs;
      p.imagesThumbnails = imgs.map(makeThumbnail);
      changed = true;
      console.log(`  🖼  Updated images: "${title.slice(0, 55)}"`);
    }
    if (description && p.longDescription !== description) {
      p.longDescription = description;
      p.description = descShort;
      changed = true;
    }
    if (tags.length > 0 && JSON.stringify(tags) !== JSON.stringify(p.tags)) {
      p.tags = tags;
      p.features = tags.slice(0, 5);
      changed = true;
    }
    if (p.category !== category) {
      p.category = category;
      changed = true;
    }
    if (changed) updatedCount++;

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
      difficulty: category === 'Digital' ? 'Easy' : 'Intermediate',
      estimatedTime: category === 'Digital' ? 'Instant' : 'Weekend',
      pages: category === 'Digital' ? 2 : 15,
      description: descShort,
      longDescription: description,
      features: tags.slice(0, 5),
      tags,
      materials: category === 'Digital'
        ? ['Digital Download', 'PDF File', 'Instant Download']
        : ['Lumber', 'Screws', 'Basic Tools', 'PDF Plans'],
      image: imgs[0],
      thumbnail: makeThumbnail(imgs[0]),
      images: imgs,
      imagesThumbnails: imgs.map(makeThumbnail),
      etsy_url: etsyUrl,
      bestseller: false,
      inStock: !isNaN(qty) ? qty > 0 : true,
      stockQuantity: !isNaN(qty) ? qty : 999,
      google_product_category: 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking',
    });
    console.log(`  ➕ New [etsy-${maxId}]: "${title.slice(0, 70)}"`);
    console.log(`     Category: ${category} | Price: $${price} | Images: ${imgs.length}`);
    console.log(`     Slug: ${slug}`);
  }
}

const updated = [...products, ...newProducts];
fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`\n✅ Tamamlandı!`);
console.log(`   Güncellendi: ${updatedCount} ürün`);
console.log(`   Eklendi:     ${newProducts.length} yeni ürün`);
console.log(`   Toplam:      ${products.length} → ${updated.length}`);
