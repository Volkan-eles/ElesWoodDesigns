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

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Build CSV price map by normalized title
const csvPriceMap = new Map();
rows.slice(1).forEach(r => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  if (title && !isNaN(price)) {
    csvPriceMap.set(title.toLowerCase(), { title, price });
  }
});

let updatedCount = 0;
let notFoundCount = 0;
const notFound = [];

for (const p of products) {
  const csvMatch = csvPriceMap.get(p.name.trim().toLowerCase());
  if (csvMatch) {
    const newOrigPrice = csvMatch.price;
    if (Math.abs(newOrigPrice - p.originalPrice) > 0.001) {
      // Keep the same discount ratio
      const currentRatio = p.originalPrice > 0 ? (p.price / p.originalPrice) : 0.30;
      const newPrice = Math.max(0.50, Math.round(newOrigPrice * currentRatio * 100) / 100);
      console.log(`Updated [${p.id}]: "${p.name.slice(0, 50)}" — $${p.originalPrice} → $${newOrigPrice} (sale: $${p.price} → $${newPrice})`);
      p.originalPrice = newOrigPrice;
      p.price = newPrice;
      updatedCount++;
    }
  } else {
    notFoundCount++;
    notFound.push(`[${p.id}] ${p.name.slice(0, 60)}`);
  }
}

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(products, null, 2), 'utf8');
console.log(`\n✅ Price update complete: ${updatedCount} updated, ${products.length - notFoundCount} matched`);
if (notFound.length > 0) {
  console.log(`\n⚠️  ${notFoundCount} products not matched in CSV (may be renamed/new):`);
  notFound.forEach(n => console.log('  ' + n));
}
