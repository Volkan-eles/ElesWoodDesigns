const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const rows = [];
  let i = 0, len = content.length;
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

function makeThumbnail(url) {
  if (!url) return '';
  return url.replace(/\/il_fullxfull\./, '/il_794xN.').replace(/\/il_1588xN\./, '/il_794xN.');
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
const pinImageCopies = [];
let updatedCount = 0;

const updatedProducts = products.map(p => {
  let match = null;

  // Match by image first (since title may have changed)
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
    // Keep removed product as-is on site
    return p;
  }

  let itemChanged = false;
  const updated = { ...p };

  // 1. Title & Slug
  if (p.name !== match.title) {
    const oldSlug = p.slug;
    const newSlug = makeSlug(match.title);
    if (oldSlug !== newSlug) {
      redirectPairs.push({ oldSlug, newSlug, id: p.id });
      pinImageCopies.push({ oldSlug, newSlug });
      updated.slug = newSlug;
    }
    updated.name = match.title;
    itemChanged = true;
    console.log(`[${p.id}] Title updated: ${p.name.slice(0, 40)} -> ${match.title.slice(0, 40)}`);
  }

  // 2. Description
  if (match.desc && (p.longDescription || '').trim() !== match.desc) {
    updated.longDescription = match.desc;
    updated.description = match.desc.replace(/\n+/g, ' ').trim().slice(0, 220);
    itemChanged = true;
    console.log(`[${p.id}] Description updated`);
  }

  // 3. Tags (only if CSV has tags; if empty, preserve existing tags)
  if (match.tags.length > 0) {
    const oldTags = (p.tags || []).join(',');
    const newTags = match.tags.join(',');
    if (oldTags !== newTags) {
      updated.tags = match.tags;
      updated.features = match.tags.slice(0, 5);
      itemChanged = true;
      console.log(`[${p.id}] Tags updated (${match.tags.length} tags)`);
    }
  }

  // 4. Price & Discount (ensure 25% off formula)
  const origPrice = match.price;
  const salePrice = Math.max(0.5, Math.round(origPrice * 0.75 * 100) / 100);
  if (Math.abs((p.originalPrice || 0) - origPrice) > 0.001 || Math.abs(p.price - salePrice) > 0.001) {
    console.log(`[${p.id}] Price updated: Orig $${p.originalPrice} -> $${origPrice}, Sale $${p.price} -> $${salePrice}`);
    updated.originalPrice = origPrice;
    updated.price = salePrice;
    itemChanged = true;
  }

  // 5. Stock
  if (!isNaN(match.qty)) {
    updated.stockQuantity = match.qty;
    updated.inStock = match.qty > 0;
  }

  // 6. Images
  if (match.images.length > 0) {
    const mainImg = match.images[0];
    if (mainImg !== p.image || JSON.stringify(match.images) !== JSON.stringify(p.images)) {
      console.log(`[${p.id}] Images updated: ${match.images.length} images`);
      updated.image = mainImg;
      updated.thumbnail = makeThumbnail(mainImg);
      updated.images = match.images;
      updated.imagesThumbnails = match.images.map(makeThumbnail);
      itemChanged = true;
    }
  }

  if (itemChanged) updatedCount++;
  return updated;
});

// Write updated JSON
fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(updatedProducts, null, 2), 'utf8');

// Copy Pinterest pin images for new slugs if old image exists
const pinDir = path.join(ROOT, 'public', 'pinterest-images');
if (fs.existsSync(pinDir)) {
  pinImageCopies.forEach(({ oldSlug, newSlug }) => {
    const oldFile = path.join(pinDir, `${oldSlug}.jpg`);
    const newFile = path.join(pinDir, `${newSlug}.jpg`);
    if (fs.existsSync(oldFile) && !fs.existsSync(newFile)) {
      fs.copyFileSync(oldFile, newFile);
      console.log(`Copied pin image: ${oldSlug}.jpg -> ${newSlug}.jpg`);
    }
  });
}

// Save redirects
fs.writeFileSync(path.join(ROOT, 'scratch', 'oct02_redirects.json'), JSON.stringify(redirectPairs, null, 2), 'utf8');

console.log('\n=== OCT 02 SYNC COMPLETE ===');
console.log(`Total products in catalog: ${updatedProducts.length}`);
console.log(`Updated products: ${updatedCount}`);
console.log(`New redirects needed: ${redirectPairs.length}`);
redirectPairs.forEach(r => {
  console.log(`  /products/${r.oldSlug}/ -> /products/${r.newSlug}/`);
});
