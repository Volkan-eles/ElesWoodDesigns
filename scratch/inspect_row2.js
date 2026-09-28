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

const row2 = rows[3]; // Row 2 in slice(1)
console.log('--- Row 2 details ---');
headers.forEach((h, idx) => {
  if (['TITLE', 'PRICE', 'QUANTITY', 'TAGS', 'MATERIALS', 'IMAGE1'].includes(h)) {
    console.log(`${h}: ${row2[idx]}`);
  }
});
console.log('DESCRIPTION (preview):', row2[headers.indexOf('DESCRIPTION')]?.slice(0, 150));

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p = products.find(x => x.etsy_url && x.etsy_url.includes('4580616210'));
console.log('\n--- Current Product in JSON ---');
console.log('ID:', p.id);
console.log('Name:', p.name);
console.log('Slug:', p.slug);
console.log('Etsy URL:', p.etsy_url);
console.log('Price:', p.price, 'OriginalPrice:', p.originalPrice);
