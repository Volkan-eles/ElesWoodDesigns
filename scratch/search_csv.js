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
            if (i + 1 < len && content[i + 1] === '"') {
              field += '"'; i += 2;
            } else {
              i++; break;
            }
          } else {
            field += content[i]; i++;
          }
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

console.log('Searching CSV for Mahjong:');
rows.slice(1).forEach(r => {
  if ((r[titleIdx] || '').toLowerCase().includes('mahjong')) {
    console.log(' - ' + r[titleIdx]);
  }
});

console.log('\nSearching CSV for Trunk or Treat:');
rows.slice(1).forEach(r => {
  if ((r[titleIdx] || '').toLowerCase().includes('trunk or treat')) {
    console.log(' - ' + r[titleIdx]);
  }
});

console.log('\nSearching CSV for 4513149219 or Mobile Roadside:');
rows.slice(1).forEach(r => {
  if ((r[titleIdx] || '').toLowerCase().includes('mobile roadside') || (r[titleIdx] || '').toLowerCase().includes('bakery cart')) {
    console.log(' - ' + r[titleIdx]);
  }
});
