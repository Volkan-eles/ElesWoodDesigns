const fs = require('fs');
const path = require('path');

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

const content = fs.readFileSync(path.join(__dirname, '..', 'public', 'feed.csv'), 'utf8');
const rows = parseCSV(content);
const headers = rows[0];
const mediaIdx = headers.indexOf('Media URL');
const titleIdx = headers.indexOf('Title');
const mediaUrls = rows.slice(1).map(r => r[mediaIdx]);

const seen = new Map();
const duplicates = [];

rows.slice(1).forEach((r) => {
  const url = r[mediaIdx];
  const title = r[titleIdx];
  if (seen.has(url)) {
    duplicates.push({ title, url, duplicateOf: seen.get(url) });
  } else {
    seen.set(url, title);
  }
});

console.log('Total Pins in CSV:', rows.length - 1);
console.log('Unique Media URLs count:', seen.size);
console.log('Duplicates count:', duplicates.length);
if (duplicates.length > 0) {
  console.log('Duplicates detail:', duplicates);
} else {
  console.log('🎉 No duplicates found! Every single Media URL is 100% unique.');
}
