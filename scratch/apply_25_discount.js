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
const qtyIdx = headers.indexOf('QUANTITY');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// 11 specifically changed titles map by ID
const titleUpdates = {
  'etsy-120': 'Kids Mud Kitchen Plans | Wooden Outdoor Play Station Build Guide',
  'etsy-9':   'DIY Farm Stand Blueprint | Wood Produce & Flower Stand Plans (PDF Download)',
  'etsy-13':  'DIY Farm Stand Plans | Backyard Produce & Flower Display Blueprint (PDF)',
  'etsy-22':  'Outdoor Kitchen Plans | Grill Station With Bar & Sink Cabinet, DIY Blueprint',
  'etsy-180': 'Backyard Sauna Plans | Modern Cedar Outdoor Sauna With Window, DIY Build Blueprint PDF',
  'etsy-167': '10x24 Gazebo Plans | DIY Backyard Pavilion & Pergola Build Blueprint (PDF)',
  'etsy-10':  'DIY Treehouse Plans | Backyard Tree Fort for Kids (PDF Download)',
  'etsy-109': 'Outdoor Mud Kitchen Plans | Easy DIY Kids Play Kitchen Blueprint (PDF)',
  'etsy-7':   'Farm Stand Plans | Mobile Wood Display Stand, DIY Build Guide (PDF)',
  'etsy-204': 'Modern Slatted Firewood Shed Plans | 2 Cord Capacity, DIY Blueprint (PDF)',
  'etsy-187': 'Covered Outdoor Kitchen Plans | BBQ Grill Station Build Blueprint (PDF Download)',
};

// Apply title updates
let titlesUpdated = 0;
for (const [id, newTitle] of Object.entries(titleUpdates)) {
  const p = products.find(x => x.id === id);
  if (p) {
    console.log(`Title updated for [${id}]:\n  OLD: ${p.name}\n  NEW: ${newTitle}`);
    p.name = newTitle;
    titlesUpdated++;
  }
}

// Build map of CSV prices by normalized title
const csvPriceMap = new Map();
rows.slice(1).forEach(r => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const qty = parseInt(r[qtyIdx], 10);
  if (title && !isNaN(price)) {
    csvPriceMap.set(title.toLowerCase(), { price, qty });
  }
});

// Update all prices to 25% OFF (price = originalPrice * 0.75)
let pricesUpdated = 0;
for (const p of products) {
  const match = csvPriceMap.get(p.name.trim().toLowerCase());
  const origPrice = match ? match.price : (p.originalPrice || p.price);
  
  // 25% discount means customer pays 75%
  const salePrice = Math.max(0.50, Math.round(origPrice * 0.75 * 100) / 100);

  p.originalPrice = origPrice;
  p.price = salePrice;
  if (match && !isNaN(match.qty)) {
    p.stockQuantity = match.qty;
    p.inStock = match.qty > 0;
  }
  pricesUpdated++;
}

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(products, null, 2), 'utf8');

console.log(`\n✅ Summary:`);
console.log(`Titles updated: ${titlesUpdated}`);
console.log(`Prices updated to 25% OFF: ${pricesUpdated} products`);

// Sample 5 products
console.log(`\nSample Products with 25% Discount:`);
products.slice(0, 5).forEach(p => {
  const discountPct = Math.round((1 - p.price / p.originalPrice) * 100);
  console.log(`[${p.id}] ${p.name.slice(0, 45)}...`);
  console.log(`  Original: $${p.originalPrice.toFixed(2)} | Sale: $${p.price.toFixed(2)} | Discount: ${discountPct}% OFF`);
});
