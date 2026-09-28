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

console.log('Headers:', headers);

const targets = [
  'American Mahjong Tile SVG PNG Bundle',
  'Costco Halloween Trunk or Treat',
  'Mobile Farm Stand Plans',
  'DIY Farmstand Plans PDF | Mobile Market Stand'
];

rows.slice(1).forEach((r) => {
  const title = r[headers.indexOf('TITLE')] || '';
  if (targets.some(t => title.includes(t))) {
    console.log('\n--- Match:', title);
    console.log('SKU:', r[headers.indexOf('SKU')]);
    console.log('PRICE:', r[headers.indexOf('PRICE')]);
    console.log('IMAGE1:', r[headers.indexOf('IMAGE1')]);
  }
});
