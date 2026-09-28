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
const qtyIdx = headers.indexOf('QUANTITY');
const imgIdx = headers.indexOf('IMAGE1');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// 1. Explicitly update etsy-204 with its new title, price, and slug
const p204 = products.find(p => p.id === 'etsy-204');
if (p204) {
  p204.name = 'Firewood Shed Plans PDF | Modern Slatted Woodshed 2 Cord Capacity, DIY Backyard Wood Storage Blueprint';
  p204.slug = 'firewood-shed-plans-pdf-modern-slatted-woodshed-2-cord-capacity-diy-backyard-wood-storage-blueprint';
  p204.originalPrice = 7;
  p204.price = 2.10;
  p204.stockQuantity = 3;
}

// 2. Build map of all CSV listings by normalized title
const csvMap = new Map();
rows.slice(1).forEach(r => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const qty = parseInt(r[qtyIdx], 10);
  if (title && !isNaN(price)) {
    csvMap.set(title.toLowerCase(), { title, price, qty });
  }
});

let updatedCount = 0;
let matchCount = 0;

for (const p of products) {
  const match = csvMap.get(p.name.trim().toLowerCase());
  if (match) {
    matchCount++;
    if (Math.abs(match.price - p.originalPrice) > 0.001) {
      const currentRatio = (p.originalPrice && p.originalPrice > 0) ? (p.price / p.originalPrice) : 0.30;
      const newPrice = Math.max(0.50, Math.round(match.price * currentRatio * 100) / 100);
      console.log(`[Price change] ${p.id}: $${p.originalPrice} -> $${match.price} (sale: $${p.price} -> $${newPrice})`);
      p.originalPrice = match.price;
      p.price = newPrice;
      updatedCount++;
    }
  } else {
    console.log(`[Not matched in CSV] ${p.id}: "${p.name}"`);
  }
}

console.log(`\nMatched: ${matchCount} / ${products.length} products`);
console.log(`Prices updated in this pass: ${updatedCount}`);

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(products, null, 2), 'utf8');
console.log('✅ data/etsy_products.json saved successfully!');
