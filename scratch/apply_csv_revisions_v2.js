const fs = require('fs');
const path = require('path');

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
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
  }
  return rows;
}

function makeSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (base.length <= 80) return base;
  const sliced = base.slice(0, 80);
  const lastDash = sliced.lastIndexOf('-');
  return lastDash > 40 ? sliced.slice(0, lastDash) : sliced;
}

function extractImages(row, headers) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx].trim());
  }
  return imgs;
}

const ROOT = path.join(__dirname, '..');
const csvContent = fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];

const titleIdx = headers.indexOf('TITLE');
const descIdx = headers.indexOf('DESCRIPTION');
const priceIdx = headers.indexOf('PRICE');
const tagsIdx = headers.indexOf('TAGS');
const qtyIdx = headers.indexOf('QUANTITY');

const csvListings = rows.slice(1).map((r, idx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const desc = (r[descIdx] || '').trim();
  const tagsStr = (r[tagsIdx] || '').trim();
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const qty = parseInt(r[qtyIdx], 10);
  const images = extractImages(r, headers);
  return { title, price, desc, tags, qty, images, rowIdx: idx };
});

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Build lookup maps
const csvByImgId = new Map();
csvListings.forEach(c => {
  c.images.forEach(img => {
    const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
    if (m) csvByImgId.set(m[1], c);
  });
});

const csvByTitle = new Map();
csvListings.forEach(c => {
  if (c.title) csvByTitle.set(c.title.toLowerCase(), c);
});

const redirectPairs = [];
let stats = { titles: 0, descs: 0, tags: 0, prices: 0, images: 0, total: 0 };

const updatedProducts = products.map(p => {
  let match = null;

  // Match by image ID first (handles title changes)
  const allImgs = [p.image, ...(p.images || [])];
  for (const img of allImgs) {
    if (!img) continue;
    const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
    if (m && csvByImgId.has(m[1])) {
      match = csvByImgId.get(m[1]);
      break;
    }
  }

  // Fallback by title
  if (!match) {
    match = csvByTitle.get((p.name || '').trim().toLowerCase());
  }

  if (!match) {
    return p; // keep removed products as-is on site
  }

  const updated = { ...p };
  let changed = false;

  // 1. Title & Slug
  if (p.name !== match.title) {
    const oldSlug = p.slug;
    const newSlug = makeSlug(match.title);
    if (oldSlug !== newSlug) {
      redirectPairs.push({ oldSlug, newSlug, id: p.id });
      updated.slug = newSlug;
    }
    updated.name = match.title;
    stats.titles++;
    console.log(`[TITLE] ${p.id}: "${p.name}" → "${match.title}"`);
    changed = true;
  }

  // 2. Description
  if (match.desc && (p.longDescription || '').trim() !== match.desc) {
    updated.longDescription = match.desc;
    updated.description = match.desc.replace(/\n+/g, ' ').trim().slice(0, 220);
    stats.descs++;
    console.log(`[DESC]  ${p.id}: updated`);
    changed = true;
  }

  // 3. Tags
  if (match.tags.length > 0) {
    const oldTags = (p.tags || []).join(',');
    const newTags = match.tags.join(',');
    if (oldTags !== newTags) {
      updated.tags = match.tags;
      stats.tags++;
      console.log(`[TAGS]  ${p.id}: ${p.tags && p.tags.length} → ${match.tags.length} tags`);
      changed = true;
    }
  }

  // 4. Price (25% off)
  const origPrice = match.price;
  if (!isNaN(origPrice) && origPrice > 0) {
    const salePrice = Math.max(0.5, Math.round(origPrice * 0.75 * 100) / 100);
    if (Math.abs((p.originalPrice || 0) - origPrice) > 0.01 || Math.abs(p.price - salePrice) > 0.01) {
      console.log(`[PRICE] ${p.id}: orig $${p.originalPrice}→$${origPrice}, sale $${p.price}→$${salePrice}`);
      updated.originalPrice = origPrice;
      updated.price = salePrice;
      stats.prices++;
      changed = true;
    }
  }

  // 5. Images (use CSV images as canonical order)
  if (match.images.length > 0) {
    const firstCsvImg = match.images[0];
    if (firstCsvImg && firstCsvImg !== p.image) {
      console.log(`[IMG]   ${p.id}: primary image changed`);
      updated.image = firstCsvImg;
      // Merge: keep existing images but put CSV images first, deduplicate
      const allImages = [...new Set([...match.images, ...(p.images || [])])];
      updated.images = allImages;
      stats.images++;
      changed = true;
    }
  }

  // 6. Stock
  if (!isNaN(match.qty)) {
    updated.stockQuantity = match.qty;
    updated.inStock = match.qty > 0;
  }

  if (changed) stats.total++;
  return updated;
});

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(updatedProducts, null, 2), 'utf8');

// Save redirect pairs
fs.writeFileSync(path.join(ROOT, 'scratch', 'new_redirects.json'), JSON.stringify(redirectPairs, null, 2), 'utf8');

console.log('\n=== SUMMARY ===');
console.log(`Products updated: ${stats.total}`);
console.log(`  Titles changed:   ${stats.titles}`);
console.log(`  Descs changed:    ${stats.descs}`);
console.log(`  Tags changed:     ${stats.tags}`);
console.log(`  Prices changed:   ${stats.prices}`);
console.log(`  Images changed:   ${stats.images}`);
console.log(`  Redirects needed: ${redirectPairs.length}`);

if (redirectPairs.length > 0) {
  console.log('\nRequired 301 redirects:');
  redirectPairs.forEach(r => console.log(`  /products/${r.oldSlug}/ → /products/${r.newSlug}/`));
}
console.log('\n✅ data/etsy_products.json updated successfully');
