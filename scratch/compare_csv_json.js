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
const dataRows = rows.slice(1).filter(r => r.length > 3 && r[titleIdx] && r[titleIdx].trim());

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

console.log(`CSV Listings Count: ${dataRows.length}`);
console.log(`JSON Products Count: ${products.length}`);

// Compare titles
const jsonTitles = new Set(products.map(p => p.name.trim().toLowerCase()));
const missingInJson = dataRows.filter(r => !jsonTitles.has(r[titleIdx].trim().toLowerCase()));

console.log(`\nListings in CSV but not matching JSON title exactly: ${missingInJson.length}`);
missingInJson.slice(0, 10).forEach(r => {
  console.log(' - ' + r[titleIdx]);
});
