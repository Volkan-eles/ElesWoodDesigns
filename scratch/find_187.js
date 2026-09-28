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
const imgIdx = headers.indexOf('IMAGE1');
const priceIdx = headers.indexOf('PRICE');

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p187 = products.find(x => x.id === 'etsy-187');
console.log('etsy-187:');
console.log('Title:', p187.name);
console.log('Image:', p187.image);
console.log('Images:', p187.images);

// Find in CSV rows which row was NOT matched by any of the 125 unchanged or 10 changed
// Total CSV rows: 136. 125 + 10 = 135. Exactly 1 row in CSV was not matched!
const matchedTitles = new Set([
  ...products.map(p => p.name.trim().toLowerCase()),
  'kids mud kitchen plans | wooden outdoor play station build guide',
  'diy farm stand blueprint | wood produce & flower stand plans (pdf download)',
  'diy farm stand plans | backyard produce & flower display blueprint (pdf)',
  'outdoor kitchen plans | grill station with bar & sink cabinet, diy blueprint',
  'backyard sauna plans | modern cedar outdoor sauna with window, diy build blueprint pdf',
  '10x24 gazebo plans | diy backyard pavilion & pergola build blueprint (pdf)',
  'diy treehouse plans | backyard tree fort for kids (pdf download)',
  'outdoor mud kitchen plans | easy diy kids play kitchen blueprint (pdf)',
  'farm stand plans | mobile wood display stand, diy build guide (pdf)',
  'modern slatted firewood shed plans | 2 cord capacity, diy blueprint (pdf)'
]);

rows.slice(1).forEach((r, idx) => {
  const t = (r[titleIdx] || '').trim();
  if (!matchedTitles.has(t.toLowerCase())) {
    console.log(`\nUnmatched CSV Row ${idx}:`);
    console.log('Title:', t);
    console.log('Price:', r[priceIdx]);
    console.log('Image:', r[imgIdx]);
  }
});
