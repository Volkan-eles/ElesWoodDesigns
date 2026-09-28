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

const csvContent = fs.readFileSync('EtsyListingsDownload.csv', 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];
const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const imgIdx = headers.indexOf('IMAGE1');

rows.slice(1).forEach((r, idx) => {
  const t = r[titleIdx] || '';
  if (t.includes('Firewood Shed Plans PDF | Modern Slatted')) {
    console.log(`Matched Row ${idx}:`);
    console.log('Title:', t);
    console.log('Price:', r[priceIdx]);
    console.log('Image:', r[imgIdx]);
  }
});

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p = products.find(x => x.id === 'etsy-204');
console.log('\netsy-204 in JSON:');
console.log('Name:', p.name);
console.log('Price:', p.price, 'OriginalPrice:', p.originalPrice);
console.log('Image:', p.image);
console.log('Etsy URL:', p.etsy_url);
