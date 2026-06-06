const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const pubPath = path.join(ROOT, '..', 'public', 'EtsyListingsDownload.csv');

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
              field += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            field += content[i];
            i++;
          }
        }
      } else {
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') {
          field += content[i];
          i++;
        }
      }
      row.push(field);
      
      if (i < len && content[i] === ',') {
        i++;
      } else {
        inField = false;
      }
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
      rows.push(row);
    }
  }
  return rows;
}

const content = fs.readFileSync(pubPath, 'utf8');
const rows = parseCSV(content);
const headers = rows[0];
console.log('Headers:', headers);

const targets = [
  'world cup 2026 sweepstake kit',
  'american mahjong tile svg png',
  'diy farmstand plans pdf',
  'tall outdoor storage cabinet plans'
];

for (let idx = 1; idx < rows.length; idx++) {
  const row = rows[idx];
  const title = row[headers.indexOf('TITLE')];
  if (title) {
    const matched = targets.some(t => title.toLowerCase().includes(t));
    if (matched) {
      console.log('---------------------------');
      console.log('TITLE:', title);
      console.log('PRICE:', row[headers.indexOf('PRICE')]);
      console.log('QUANTITY:', row[headers.indexOf('QUANTITY')]);
      console.log('TAGS:', row[headers.indexOf('TAGS')]);
      console.log('LISTING_ID:', row[headers.indexOf('LISTING_ID')]);
      // Let's print out all fields that might contain URLs or links
      for (let h = 0; h < headers.length; h++) {
        if (row[h] && (row[h].includes('http') || headers[h].includes('URL') || headers[h].includes('LINK'))) {
          console.log(`${headers[h]}:`, row[h]);
        }
      }
    }
  }
}
