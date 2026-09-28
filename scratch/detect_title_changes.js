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

const ROOT = path.join(__dirname, '..');
const csvContent = fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const imgIdx = headers.indexOf('IMAGE1');
const descIdx = headers.indexOf('DESCRIPTION');
const qtyIdx = headers.indexOf('QUANTITY');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

console.log(`Total CSV rows: ${rows.length - 1}`);
console.log(`Total JSON products: ${products.length}`);

// Build maps from CSV
const csvByImg = new Map();
const csvByTitle = new Map();

rows.slice(1).forEach((r, idx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const img = (r[imgIdx] || '').trim();
  const desc = r[descIdx] || '';
  const qty = parseInt(r[qtyIdx], 10);

  // Extract base image id
  const imgMatch = img.match(/\/il_fullxfull\.(\d+)/);
  const imgKey = imgMatch ? imgMatch[1] : img;

  if (title) {
    csvByTitle.set(title.toLowerCase(), { title, price, img, desc, qty, rowIdx: idx });
    if (imgKey) {
      csvByImg.set(imgKey, { title, price, img, desc, qty, rowIdx: idx });
    }
  }
});

// Check matches for each JSON product
const unchanged = [];
const changedTitles = [];
const unmatchedInCsv = [];

products.forEach(p => {
  // Try exact title match first
  const exactMatch = csvByTitle.get(p.name.trim().toLowerCase());
  if (exactMatch) {
    unchanged.push({ id: p.id, name: p.name });
    return;
  }

  // Try image match
  const imgMatch = (p.image || '').match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
  const imgKey = imgMatch ? imgMatch[1] : null;

  let match = imgKey ? csvByImg.get(imgKey) : null;

  // If not by image 1, check other images
  if (!match && p.images && p.images.length > 0) {
    for (const otherImg of p.images) {
      const m = otherImg.match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
      if (m && csvByImg.get(m[1])) {
        match = csvByImg.get(m[1]);
        break;
      }
    }
  }

  if (match) {
    changedTitles.push({
      id: p.id,
      slug: p.slug,
      oldTitle: p.name,
      newTitle: match.title,
      price: match.price,
      etsy_url: p.etsy_url
    });
  } else {
    unmatchedInCsv.push({ id: p.id, name: p.name, image: p.image });
  }
});

console.log(`\n--- RESULTS ---`);
console.log(`Unchanged titles: ${unchanged.length}`);
console.log(`Changed titles detected: ${changedTitles.length}`);
console.log(`Unmatched in CSV: ${unmatchedInCsv.length}`);

if (changedTitles.length > 0) {
  console.log(`\n=== CHANGED TITLES ===`);
  changedTitles.forEach((c, i) => {
    console.log(`\n${i + 1}. [${c.id}]`);
    console.log(`   ESKİ BAŞLIK: ${c.oldTitle}`);
    console.log(`   YENİ BAŞLIK: ${c.newTitle}`);
    console.log(`   FİYAT: $${c.price}`);
  });
}

if (unmatchedInCsv.length > 0) {
  console.log(`\n=== UNMATCHED PRODUCTS ===`);
  unmatchedInCsv.forEach(u => {
    console.log(`[${u.id}] ${u.name}`);
  });
}
