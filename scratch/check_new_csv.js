const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'EtsyListingsDownload (1).csv');
const content = fs.readFileSync(CSV_PATH, 'utf8');

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
      if (i < len && content[i] === ',') { i++; }
      else { inField = false; }
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
  }
  return rows;
}

const rows = parseCSV(content);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const img1Idx = headers.indexOf('IMAGE1');
const priceIdx = headers.indexOf('PRICE');
const descIdx = headers.indexOf('DESCRIPTION');
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

console.log('Headers:', headers.slice(0,5).join(', '));
console.log('Data rows:', dataRows.length);

// Find FIFA/World Cup products
const wc = dataRows.filter(r => {
  const t = (r[titleIdx]||'').toLowerCase();
  return t.includes('world cup') || t.includes('fifa') || t.includes('sweepstake') || t.includes('bracket');
});

console.log('\nWorld Cup / FIFA products found: ' + wc.length);
wc.forEach(r => {
  console.log(' Title:', (r[titleIdx]||'').slice(0,100));
  console.log(' Price:', r[priceIdx]);
  console.log(' Image1:', (r[img1Idx]||'').slice(0,80));
  console.log('');
});

// Also show ALL titles that are NOT in current JSON to find new ones
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));

console.log('\n=== Products in new CSV not in JSON ===');
let newCount = 0;
for (const r of dataRows) {
  const t = (r[titleIdx]||'').trim();
  if (t && !existingTitles.has(t.toLowerCase())) {
    newCount++;
    console.log(' NEW:', t.slice(0,100));
  }
}
console.log('Total new:', newCount);
