const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'public', 'EtsyListingsDownload.csv');

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

const content = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(content);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const qtyIdx = headers.indexOf('QUANTITY');
const tagsIdx = headers.indexOf('TAGS');
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

// Load existing JSON
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));

console.log('=== EtsyListingsDownload.csv (public/) ===');
console.log('CSV satır sayısı:', dataRows.length);
console.log('Mevcut JSON ürün sayısı:', products.length);

console.log('\n=== YENİ ÜRÜNLER ===');
let newCount = 0;
for (const r of dataRows) {
  const t = (r[titleIdx] || '').trim();
  if (!t || existingTitles.has(t.toLowerCase())) continue;
  newCount++;
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf('IMAGE' + i);
    if (idx >= 0 && r[idx] && r[idx].startsWith('http')) imgs.push(r[idx]);
  }
  console.log(`\n${newCount}. ${t}`);
  console.log(`   Fiyat: ${r[priceIdx]} | Adet: ${r[qtyIdx]} | Görsel: ${imgs.length}`);
  imgs.forEach((img, i) => console.log(`   IMG${i+1}: ${img}`));
  console.log(`   Tags: ${(r[tagsIdx]||'').slice(0,120)}`);
}
console.log(`\nToplam yeni ürün: ${newCount}`);

console.log('\n=== TÜM CSV BAŞLIKLARI ===');
dataRows.forEach((r, i) => {
  const t = (r[titleIdx] || '').trim();
  const isNew = t && !existingTitles.has(t.toLowerCase());
  console.log(`${isNew ? '🆕' : '✅'} ${i+1}. ${t.slice(0,90)}`);
});
