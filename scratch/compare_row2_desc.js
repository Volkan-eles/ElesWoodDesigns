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
const row2 = rows[3];

const csvDesc = row2[headers.indexOf('DESCRIPTION')];
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p = products.find(x => x.id === 'etsy-204');

console.log('Descriptions match exactly?', csvDesc === p.longDescription);
if (csvDesc !== p.longDescription) {
  console.log('CSV Desc length:', csvDesc.length, 'JSON Desc length:', p.longDescription.length);
}
console.log('CSV Price:', row2[headers.indexOf('PRICE')], 'JSON orig price:', p.originalPrice);
console.log('CSV Qty:', row2[headers.indexOf('QUANTITY')], 'JSON stock:', p.stockQuantity);
