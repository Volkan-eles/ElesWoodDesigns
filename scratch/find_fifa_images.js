const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'public', 'EtsyListingsDownload (2).csv');

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
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0]);

console.log('Toplam satır:', dataRows.length);

// FIFA / World Cup araması
const fifa = dataRows.filter(r => {
  const t = (r[titleIdx] || '').toLowerCase();
  return t.includes('fifa') || t.includes('bracket') || t.includes('wall chart') || t.includes('world cup');
});

console.log('\nFIFA/World Cup ürünleri:', fifa.length);
fifa.forEach(r => {
  console.log('\n  Title:', r[titleIdx]);
  for (let i = 1; i <= 10; i++) {
    const imgIdx = headers.indexOf('IMAGE' + i);
    if (imgIdx >= 0 && r[imgIdx] && r[imgIdx].startsWith('http')) {
      console.log('  IMAGE' + i + ':', r[imgIdx]);
    }
  }
});

// Son 5 ürünü de göster
console.log('\n--- Son 5 ürün ---');
dataRows.slice(-5).forEach(r => console.log(' -', r[titleIdx].slice(0, 80)));
