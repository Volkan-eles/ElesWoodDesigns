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

console.log(`CSV Rows: ${csvListings.length}`);
console.log(`JSON Products: ${products.length}`);

// Match listings by image ID or exact title
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

const titleChanges = [];
const descChanges = [];
const tagChanges = [];
const priceChanges = [];
const imageChanges = [];
const matchedProducts = [];
const unmatchedJson = [];

products.forEach(p => {
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

  // Fallback match by title
  if (!match) {
    match = csvByTitle.get((p.name || '').trim().toLowerCase());
  }

  if (!match) {
    unmatchedJson.push(p);
    return;
  }

  matchedProducts.push({ product: p, csv: match });

  // 1. Title
  if (p.name !== match.title) {
    titleChanges.push({ id: p.id, old: p.name, new: match.title });
  }

  // 2. Desc
  if ((p.longDescription || '').trim() !== match.desc) {
    descChanges.push({ id: p.id, name: p.name });
  }

  // 3. Tags
  const oldTags = (p.tags || []).join(',');
  const newTags = match.tags.join(',');
  if (oldTags !== newTags && match.tags.length > 0) {
    tagChanges.push({ id: p.id, name: p.name, old: oldTags, new: newTags });
  }

  // 4. Price
  const origPrice = match.price;
  const expectedSalePrice = Math.max(0.5, Math.round(origPrice * 0.75 * 100) / 100);
  if (Math.abs((p.originalPrice || 0) - origPrice) > 0.01 || Math.abs(p.price - expectedSalePrice) > 0.01) {
    priceChanges.push({ id: p.id, name: p.name, oldOrig: p.originalPrice, newOrig: origPrice, oldSale: p.price, newSale: expectedSalePrice });
  }

  // 5. Image
  if (match.images.length > 0 && match.images[0] && match.images[0] !== p.image) {
    imageChanges.push({ id: p.id, name: p.name, old: p.image, new: match.images[0] });
  }
});

console.log('\n--- DETECTION REPORT ---');
console.log(`Matched products: ${matchedProducts.length}`);
console.log(`Unmatched JSON products (kept on site): ${unmatchedJson.length}`);
console.log(`Title changes: ${titleChanges.length}`);
titleChanges.forEach(t => console.log(`  [${t.id}] OLD: "${t.old}"\n         NEW: "${t.new}"`));

console.log(`\nDescription changes: ${descChanges.length}`);
descChanges.forEach(d => console.log(`  [${d.id}] ${d.name}`));

console.log(`\nTag changes: ${tagChanges.length}`);
tagChanges.forEach(t => console.log(`  [${t.id}] ${t.name}\n    OLD: ${t.old}\n    NEW: ${t.new}`));

console.log(`\nPrice changes: ${priceChanges.length}`);
priceChanges.forEach(pr => console.log(`  [${pr.id}] ${pr.name}: Orig $${pr.oldOrig} -> $${pr.newOrig}, Sale $${pr.oldSale} -> $${pr.newSale}`));

console.log(`\nImage changes: ${imageChanges.length}`);
imageChanges.forEach(im => console.log(`  [${im.id}] ${im.name}`));
