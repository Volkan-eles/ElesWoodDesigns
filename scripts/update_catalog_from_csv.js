/**
 * update_catalog_from_csv.js
 * 
 * Reads EtsyListingsDownload.csv, updates prices/stock/images in etsy_products.json,
 * and adds 4 new products with their Etsy listing URLs.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'EtsyListingsDownload.csv');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');

// The 4 new listing URLs (from user)
const NEW_LISTING_URLS = {
  'modern-firewood-shed-plan-8x10-lean-to-wood-storage-pdf-2-cord-capacity': 'https://www.etsy.com/listing/4494721445/modern-firewood-shed-plan-8x10-lean-to',
  'diy-picnic-table-plans-outdoor-table-with-backrest-umbrella-hole-pdf-download': 'https://www.etsy.com/listing/4494695588/diy-picnic-table-plans-outdoor-table',
  'diy-storage-bench-plans-modern-wooden-chest-blueprint-pdf-download': 'https://www.etsy.com/listing/4494429592/diy-storage-bench-plans-modern-wooden',
  '8x10-firewood-shed-plans-diy-sloped-roof': 'https://www.etsy.com/listing/4380408404/8x10-firewood-shed-plans-diy-sloped-roof',
};

// --- CSV Parser (handles multi-line quoted fields) ---
function parseCSV(content) {
  const rows = [];
  let i = 0;
  const len = content.length;
  
  while (i < len) {
    const row = [];
    // Skip CR/LF between rows
    while (i < len && (content[i] === '\r' || content[i] === '\n')) i++;
    if (i >= len) break;
    
    let inField = true;
    while (inField && i < len) {
      let field = '';
      if (content[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        while (i < len) {
          if (content[i] === '"') {
            if (i + 1 < len && content[i + 1] === '"') {
              field += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            field += content[i];
            i++;
          }
        }
      } else {
        // Unquoted field - read until comma or newline
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') {
          field += content[i];
          i++;
        }
      }
      row.push(field);
      
      if (i < len && content[i] === ',') {
        i++; // skip comma, continue with next field
      } else {
        inField = false; // end of row
      }
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
      rows.push(row);
    }
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
  // Convert il_fullxfull to il_794xN
  return url.replace(/\/il_fullxfull\./, '/il_794xN.');
}

function makeImages(csvRow, headers) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && csvRow[idx] && csvRow[idx].startsWith('http')) {
      imgs.push(csvRow[idx]);
    }
  }
  return imgs;
}

function determineCategory(title, tags) {
  const t = (title + ' ' + tags).toLowerCase();
  if (t.includes('mud kitchen') || t.includes('treehouse') || t.includes('playhouse') || t.includes('kids')) return 'Kids';
  if (t.includes('loft bed') || t.includes('murphy') || t.includes('bedroom') || t.includes('storage bench') || t.includes('bookshelf') || t.includes('bookcase') || t.includes('shoe rack') || t.includes('shoe carousel')) return 'Bedroom';
  if (t.includes('planter') || t.includes('garden') || t.includes('plant stand') || t.includes('farmstand') || t.includes('farm stand') || t.includes('raised bed') || t.includes('raised garden')) return 'Garden';
  if (t.includes('shed') || t.includes('firewood') || t.includes('pergola') || t.includes('swing') || t.includes('arbor') || t.includes('sauna') || t.includes('chicken') || t.includes('picnic') || t.includes('adirondack') || t.includes('bench') || t.includes('outdoor') || t.includes('patio') || t.includes('chaise') || t.includes('lounge') || t.includes('corner bench')) return 'Outdoor';
  if (t.includes('cart') || t.includes('bar cart') || t.includes('vendor') || t.includes('digital') || t.includes('wall art') || t.includes('portrait')) return 'Digital';
  return 'Workshop';
}

function getGoogleCategory(category, slug) {
  return 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking';
}

// --- Main ---
const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];

console.log(`CSV headers: ${headers.slice(0, 5).join(', ')} ...`);
console.log(`Total CSV rows (incl header): ${rows.length}`);

const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

console.log(`Data rows: ${dataRows.length}`);

// Build CSV product map by title (normalized)
const csvByTitle = new Map();
for (const row of dataRows) {
  const title = row[headers.indexOf('TITLE')];
  const price = parseFloat(row[headers.indexOf('PRICE')]);
  const qty = parseInt(row[headers.indexOf('QUANTITY')], 10);
  const tags = row[headers.indexOf('TAGS')] || '';
  const description = row[headers.indexOf('DESCRIPTION')] || '';
  const imgs = makeImages(row, headers);
  
  csvByTitle.set(title.trim().toLowerCase(), { title, price, qty, tags, description, imgs });
}

// Load existing JSON
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
console.log(`Existing products: ${products.length}`);

// Track existing slugs to avoid duplication
const existingSlugs = new Set(products.map(p => p.slug));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));

// Update existing products from CSV
let updatedCount = 0;
for (const product of products) {
  const csvMatch = csvByTitle.get(product.name.trim().toLowerCase());
  if (csvMatch) {
    let changed = false;
    
    // Update price
    if (csvMatch.price && Math.abs(csvMatch.price - product.price) > 0.001) {
      console.log(`  Updating price for "${product.name.slice(0,50)}": ${product.price} -> ${csvMatch.price}`);
      product.price = csvMatch.price;
      product.originalPrice = Math.round((csvMatch.price / 0.30) * 100) / 100;
      changed = true;
    }
    
    // Update stock
    if (typeof csvMatch.qty === 'number' && !isNaN(csvMatch.qty)) {
      if (product.stockQuantity !== csvMatch.qty) {
        console.log(`  Updating stock for "${product.name.slice(0,50)}": ${product.stockQuantity} -> ${csvMatch.qty}`);
        product.stockQuantity = csvMatch.qty;
        product.inStock = csvMatch.qty > 0;
        changed = true;
      }
    }
    
    // Update images if CSV has more/different images
    if (csvMatch.imgs.length > 0) {
      const csvImg0 = csvMatch.imgs[0];
      if (product.image !== csvImg0) {
        console.log(`  Updating images for "${product.name.slice(0,50)}"`);
        product.image = csvImg0;
        product.thumbnail = makeThumbnail(csvImg0);
        product.images = csvMatch.imgs;
        product.imagesThumbnails = csvMatch.imgs.map(makeThumbnail);
        changed = true;
      }
    }
    
    if (changed) updatedCount++;
  }
}
console.log(`\nUpdated ${updatedCount} existing products`);

// Find new products in CSV not in existing JSON
const newProducts = [];
let maxId = products.reduce((max, p) => {
  const num = parseInt(p.id.replace('etsy-', ''), 10);
  return isNaN(num) ? max : Math.max(max, num);
}, 75);

// Titles of the 4 specifically mentioned new products
const newProductTitles = [
  'Modern Firewood Shed Plan | 8x10 Lean-To Wood Storage PDF (2 Cord Capacity)',
  'DIY Picnic Table Plans | Outdoor Table with Backrest, Umbrella Hole (PDF Download)',
  'DIY Storage Bench Plans | Modern Wooden Chest Blueprint (PDF Download)',
  '8x10 Firewood Shed Plans | DIY Sloped Roof Wood Storage (PDF Download)',
];

// Also check: which CSV rows are new
for (const row of dataRows) {
  const title = (row[headers.indexOf('TITLE')] || '').trim();
  if (!title) continue;
  
  const titleLower = title.toLowerCase();
  if (existingTitles.has(titleLower)) continue;
  
  // Only add the 4 specifically mentioned ones (to avoid unintended mass additions)
  // Check partial title match against our target list
  const isTarget = newProductTitles.some(t => {
    const clean = t.toLowerCase().replace(/[|:,()&]/g, ' ').replace(/\s+/g, ' ').trim();
    const csvClean = titleLower.replace(/[|:,()&]/g, ' ').replace(/\s+/g, ' ').trim();
    // Match on first ~30 chars
    return csvClean.startsWith(clean.slice(0, 30)) || clean.startsWith(csvClean.slice(0, 30));
  });
  
  if (!isTarget) continue;
  
  const price = parseFloat(row[headers.indexOf('PRICE')]);
  const qty = parseInt(row[headers.indexOf('QUANTITY')], 10);
  const tags = row[headers.indexOf('TAGS')] || '';
  const description = (row[headers.indexOf('DESCRIPTION')] || '').trim();
  const imgs = makeImages(row, headers);
  
  if (!imgs.length) {
    console.warn(`  WARNING: No images for new product "${title}"`);
    continue;
  }
  
  maxId++;
  const slug = slugify(title);
  const category = determineCategory(title, tags);
  const tagsList = tags.split(',').map(t => t.trim()).filter(Boolean);
  
  // Determine Etsy URL - match by slug
  let etsyUrl = '';
  for (const [urlSlug, url] of Object.entries(NEW_LISTING_URLS)) {
    if (slug.includes(urlSlug.slice(0, 20)) || urlSlug.includes(slug.slice(0, 20))) {
      etsyUrl = url;
      break;
    }
  }
  
  // Better matching: match by title keywords
  if (!etsyUrl) {
    const titleWords = title.toLowerCase();
    if (titleWords.includes('8x10') && titleWords.includes('lean-to')) {
      etsyUrl = 'https://www.etsy.com/listing/4494721445/modern-firewood-shed-plan-8x10-lean-to';
    } else if (titleWords.includes('picnic table')) {
      etsyUrl = 'https://www.etsy.com/listing/4494695588/diy-picnic-table-plans-outdoor-table';
    } else if (titleWords.includes('storage bench') && titleWords.includes('modern wooden')) {
      etsyUrl = 'https://www.etsy.com/listing/4494429592/diy-storage-bench-plans-modern-wooden';
    } else if (titleWords.includes('8x10') && titleWords.includes('sloped')) {
      etsyUrl = 'https://www.etsy.com/listing/4380408404/8x10-firewood-shed-plans-diy-sloped-roof';
    }
  }
  
  const descShort = description.slice(0, 220).split('\n')[0];
  
  const newProduct = {
    id: `etsy-${maxId}`,
    slug,
    name: title,
    category,
    price,
    originalPrice: Math.round((price / 0.30) * 100) / 100,
    rating: 0,
    reviewCount: 0,
    difficulty: 'Easy',
    estimatedTime: 'Weekend',
    pages: 15,
    description: descShort,
    longDescription: description,
    features: tagsList.slice(0, 5),
    tags: tagsList,
    materials: ['Digital Download', 'PDF File', 'Instant Download'],
    image: imgs[0],
    thumbnail: makeThumbnail(imgs[0]),
    images: imgs,
    imagesThumbnails: imgs.map(makeThumbnail),
    etsy_url: etsyUrl,
    bestseller: false,
    inStock: qty > 0,
    stockQuantity: qty,
    google_product_category: getGoogleCategory(category, slug),
  };
  
  newProducts.push(newProduct);
  existingTitles.add(titleLower);
  existingSlugs.add(slug);
  console.log(`  + New product [etsy-${maxId}]: "${title.slice(0, 60)}" (${category}) -> ${etsyUrl}`);
}

console.log(`\nNew products to add: ${newProducts.length}`);

// Append new products to array
const updatedProducts = [...products, ...newProducts];

// Write updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(updatedProducts, null, 2), 'utf8');
console.log(`\n✅ etsy_products.json updated: ${products.length} -> ${updatedProducts.length} products`);
console.log(`   - Updated: ${updatedCount} existing`);
console.log(`   - Added: ${newProducts.length} new`);
