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

function makeThumbnail(url) {
  if (!url) return '';
  return url.replace(/\/il_fullxfull\./, '/il_794xN.').replace(/\/il_1588xN\./, '/il_794xN.');
}

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const ROOT = path.join(__dirname, '..');
const csv = fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8');
const rows = parseCSV(csv);
const headers = rows[0];

const titleIdx = headers.indexOf('TITLE');
const descIdx = headers.indexOf('DESCRIPTION');
const priceIdx = headers.indexOf('PRICE');
const tagsIdx = headers.indexOf('TAGS');
const qtyIdx = headers.indexOf('QUANTITY');

function extractImages(row) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx].trim());
  }
  return imgs;
}

const csvListings = rows.slice(1).map((r, rowIdx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const desc = (r[descIdx] || '').trim();
  const tagsStr = (r[tagsIdx] || '').trim();
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const qty = parseInt(r[qtyIdx], 10);
  const images = extractImages(r);
  return { title, price, desc, tags, qty, images, rowIdx };
});

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Build CSV lookup by title
const csvByTitle = new Map();
csvListings.forEach(c => { if (c.title) csvByTitle.set(c.title.toLowerCase(), c); });

// Build CSV lookup by image ID
const csvByImgId = new Map();
csvListings.forEach(c => {
  c.images.forEach(img => {
    const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
    if (m) csvByImgId.set(m[1], c);
  });
});

const report = {
  csvCount: csvListings.length,
  jsonCount: products.length,
  matched: 0,
  notInCSV: [],   // products in JSON but not in CSV (removed from Etsy) 
  csvNotMatched: new Set(csvListings.map((c, i) => i)),  // CSV rows not yet matched to JSON
  updates: [],
  priceChanges: 0,
  titleChanges: [],
  descChanges: 0,
  tagChanges: 0,
  imageChanges: 0,
  etsyUrlFixes: [],
};

const updatedProducts = products.map(p => {
  let match = csvByTitle.get(p.name.trim().toLowerCase());

  if (!match) {
    const allImgs = [p.image, ...(p.images || [])];
    for (const img of allImgs) {
      if (!img) continue;
      const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
      if (m && csvByImgId.has(m[1])) {
        match = csvByImgId.get(m[1]);
        break;
      }
    }
  }

  if (!match) {
    report.notInCSV.push({ id: p.id, name: p.name, etsy_url: p.etsy_url });
    return p; // keep product as-is in the site
  }

  report.matched++;
  report.csvNotMatched.delete(match.rowIdx);

  const updated = { ...p };
  let changed = false;

  // 1. Title
  if (p.name !== match.title) {
    report.titleChanges.push({ id: p.id, old: p.name, new: match.title });
    updated.name = match.title;
    updated.slug = makeSlug(match.title).slice(0, 80);
    changed = true;
  }

  // 2. Description
  if ((p.longDescription || '').trim() !== match.desc) {
    updated.longDescription = match.desc;
    updated.description = match.desc.replace(/\n+/g, ' ').trim().slice(0, 220);
    report.descChanges++;
    changed = true;
  }

  // 3. Tags
  if (match.tags.length > 0) {
    const oldStr = (p.tags || []).join(',');
    const newStr = match.tags.join(',');
    if (oldStr !== newStr) {
      updated.tags = match.tags;
      report.tagChanges++;
      changed = true;
    }
  }

  // 4. Price - always apply 25% off
  const origPrice = match.price;
  const salePrice = Math.max(0.50, Math.round(origPrice * 0.75 * 100) / 100);
  if (Math.abs((p.originalPrice || 0) - origPrice) > 0.001 || Math.abs(p.price - salePrice) > 0.001) {
    report.priceChanges++;
    changed = true;
  }
  updated.originalPrice = origPrice;
  updated.price = salePrice;

  // 5. Stock
  if (!isNaN(match.qty)) {
    updated.stockQuantity = match.qty;
    updated.inStock = match.qty > 0;
  }

  // 6. Images
  if (match.images.length > 0 && match.images[0] && match.images[0] !== p.image) {
    report.imageChanges++;
    updated.image = match.images[0];
    updated.thumbnail = makeThumbnail(match.images[0]);
    updated.images = match.images;
    updated.imagesThumbnails = match.images.map(makeThumbnail);
    changed = true;
  }

  // 7. Fix etsy_url from CSV image
  // The etsy URL we have may need to be updated; if title changed, the etsy URL slug probably changed too
  // We keep the existing etsy_url if we can't determine the new one (it still points to the correct listing ID)

  if (changed) report.updates.push(p.id);
  return updated;
});

// Save
fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(updatedProducts, null, 2), 'utf8');

// Report
console.log('\n=== SYNC REPORT ===');
console.log(`CSV rows: ${report.csvCount} | JSON products: ${report.jsonCount}`);
console.log(`Matched: ${report.matched} | Not in CSV (kept on site): ${report.notInCSV.length}`);
console.log(`Total updated: ${report.updates.length} products`);
console.log(`  Title changes: ${report.titleChanges.length}`);
console.log(`  Desc changes: ${report.descChanges}`);
console.log(`  Tag changes: ${report.tagChanges}`);
console.log(`  Price changes: ${report.priceChanges}`);
console.log(`  Image changes: ${report.imageChanges}`);

if (report.titleChanges.length > 0) {
  console.log('\n=== TITLE CHANGES ===');
  report.titleChanges.forEach(t => {
    console.log(`[${t.id}]`);
    console.log(`  OLD: ${t.old}`);
    console.log(`  NEW: ${t.new}`);
  });
}

if (report.notInCSV.length > 0) {
  console.log('\n=== PRODUCTS REMOVED FROM ETSY (kept on site) ===');
  report.notInCSV.forEach(p => {
    console.log(`[${p.id}] ${p.name}`);
    console.log(`  etsy_url: ${p.etsy_url}`);
  });
}

// Unmatched CSV rows
const unmatchedCsv = [];
report.csvNotMatched.forEach(idx => unmatchedCsv.push(csvListings[idx].title));
if (unmatchedCsv.length > 0) {
  console.log('\n=== UNMATCHED CSV ROWS (new listings?) ===');
  unmatchedCsv.forEach(t => console.log(`  ${t}`));
}

console.log('\n✅ data/etsy_products.json saved!');
