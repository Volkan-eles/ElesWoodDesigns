const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'EtsyListingsDownload (1).csv');

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

const content = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCSV(content);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const qtyIdx = headers.indexOf('QUANTITY');
const tagsIdx = headers.indexOf('TAGS');
const descIdx = headers.indexOf('DESCRIPTION');
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

// Load existing JSON
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));

console.log('=== EtsyListingsDownload (1).csv ===');
console.log('CSV satir sayisi:', dataRows.length);
console.log('Mevcut urun sayisi:', products.length);
console.log('Sutunlar:', headers.slice(0, 15).join(' | '));

console.log('\n=== TUM URUNLER ===');
let newCount = 0;
dataRows.forEach((r, i) => {
  const t = (r[titleIdx] || '').trim();
  const isNew = t && !existingTitles.has(t.toLowerCase());
  if (isNew) newCount++;
  
  const imgs = [];
  for (let j = 1; j <= 10; j++) {
    const idx = headers.indexOf('IMAGE' + j);
    if (idx >= 0 && r[idx] && r[idx].startsWith('http')) imgs.push(r[idx]);
  }
  
  console.log(`\n${isNew ? '🆕' : '✅'} ${i+1}. ${t}`);
  console.log(`   Fiyat: $${r[priceIdx]} | Gorsel: ${imgs.length} | ${isNew ? 'YENİ' : 'MEVCUT'}`);
  if (isNew) {
    imgs.slice(0,3).forEach((img, j) => console.log(`   IMG${j+1}: ${img}`));
    console.log(`   Tags: ${(r[tagsIdx]||'').slice(0,100)}`);
  }
});

console.log(`\n\nToplam yeni: ${newCount} | Mevcut: ${dataRows.length - newCount}`);
