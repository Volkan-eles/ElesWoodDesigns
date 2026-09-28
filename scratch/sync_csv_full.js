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
  return url.replace(/\/il_fullxfull\./, '/il_794xN.');
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

function extractImages(row) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) {
      imgs.push(row[idx].trim());
    }
  }
  return imgs;
}

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Build CSV rows index
const csvListings = rows.slice(1).map((r, idx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const desc = (r[descIdx] || '').trim();
  const tagsStr = (r[tagsIdx] || '').trim();
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const qty = parseInt(r[qtyIdx], 10);
  const images = extractImages(r);

  return { title, price, desc, tags, qty, images, rowIdx: idx };
});

// Explicit overrides for products that changed both title and images
const manualMatchById = {
  'etsy-36': 'Lean-To Greenhouse Plans PDF | DIY Wood Patio Glasshouse Blueprint | Digital Download Garden Building Guide',
  'etsy-131': 'DIY Mobile Miter Saw Station Plans | Rolling Workbench Cart Blueprint (PDF)'
};

let titleChanges = [];
let descChanges = [];
let tagChanges = [];
let priceChanges = [];
let imgChanges = [];

products.forEach(p => {
  // Find matching CSV row
  let match = null;

  if (manualMatchById[p.id]) {
    match = csvListings.find(c => c.title.toLowerCase() === manualMatchById[p.id].toLowerCase());
  }

  if (!match) {
    match = csvListings.find(c => c.title.toLowerCase() === p.name.trim().toLowerCase());
  }

  if (!match) {
    // Match by primary image ID
    const imgMatch = (p.image || '').match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
    if (imgMatch) {
      match = csvListings.find(c => c.images[0] && c.images[0].includes(imgMatch[1]));
    }
  }

  if (!match && p.images && p.images.length > 0) {
    for (const otherImg of p.images) {
      const m = otherImg.match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
      if (m) {
        match = csvListings.find(c => c.images.some(ci => ci.includes(m[1])));
        if (match) break;
      }
    }
  }

  if (!match) {
    console.error(`Could not match product: [${p.id}] ${p.name}`);
    return;
  }

  // 1. Title change
  if (p.name !== match.title) {
    titleChanges.push({ id: p.id, old: p.name, new: match.title });
    p.name = match.title;
  }

  // 2. Description change
  if ((p.longDescription || '').trim() !== match.desc) {
    descChanges.push({ id: p.id, title: p.name });
    p.longDescription = match.desc;
    p.description = match.desc.replace(/\n+/g, ' ').trim().slice(0, 220);
  }

  // 3. Tags change
  if (match.tags.length > 0) {
    const oldTags = (p.tags || []).join(',');
    const newTags = match.tags.join(',');
    if (oldTags !== newTags) {
      tagChanges.push({ id: p.id, title: p.name, count: match.tags.length });
      p.tags = match.tags;
      p.features = match.tags.slice(0, 5);
    }
  }

  // 4. Price & 25% discount
  const origPrice = match.price;
  const salePrice = Math.max(0.50, Math.round(origPrice * 0.75 * 100) / 100);
  if (Math.abs(p.originalPrice - origPrice) > 0.001 || Math.abs(p.price - salePrice) > 0.001) {
    priceChanges.push({ id: p.id, old: `$${p.originalPrice} ($${p.price})`, new: `$${origPrice} ($${salePrice})` });
  }
  p.originalPrice = origPrice;
  p.price = salePrice;

  // 5. Stock
  if (!isNaN(match.qty)) {
    p.stockQuantity = match.qty;
    p.inStock = match.qty > 0;
  }

  // 6. Images (if updated in CSV)
  if (match.images.length > 0 && match.images[0] !== p.image) {
    imgChanges.push({ id: p.id, old: p.image, new: match.images[0] });
    p.image = match.images[0];
    p.thumbnail = makeThumbnail(match.images[0]);
    p.images = match.images;
    p.imagesThumbnails = match.images.map(makeThumbnail);
  }
});

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(products, null, 2), 'utf8');

console.log('\n=== UPDATE RESULTS ===');
console.log(`Titles updated (${titleChanges.length}):`);
titleChanges.forEach(t => console.log(`  [${t.id}] OLD: ${t.old}\n         NEW: ${t.new}`));

console.log(`\nDescriptions updated: ${descChanges.length} products`);
console.log(`Tags updated: ${tagChanges.length} products`);
console.log(`Prices updated: ${priceChanges.length} products`);
priceChanges.forEach(pc => console.log(`  [${pc.id}] ${pc.old} -> ${pc.new}`));

console.log(`Images updated: ${imgChanges.length} products`);
imgChanges.forEach(ic => console.log(`  [${ic.id}] new cover image: ${ic.new}`));

console.log('\n✅ data/etsy_products.json successfully updated!');
