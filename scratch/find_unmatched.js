const fs = require('fs');

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

const csv = fs.readFileSync('EtsyListingsDownload.csv', 'utf8');
const rows = parseCSV(csv);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const imgIdx = headers.indexOf('IMAGE1');
const priceIdx = headers.indexOf('PRICE');

console.log('Searching CSV for greenhouse and miter:');
rows.slice(1).forEach((r, idx) => {
  const t = r[titleIdx] || '';
  if (t.toLowerCase().includes('greenhouse') || t.toLowerCase().includes('miter') || t.toLowerCase().includes('saw station')) {
    console.log(`[CSV Row ${idx}] ${t}`);
    console.log(`  Img: ${r[imgIdx]}`);
    console.log(`  Price: ${r[priceIdx]}`);
  }
});

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
['etsy-36', 'etsy-131'].forEach(id => {
  const p = products.find(x => x.id === id);
  console.log(`\nIn JSON [${id}]:`);
  console.log('  Name:', p.name);
  console.log('  Image:', p.image);
});
