const fs = require('fs');

function parseCSV(content) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        if (char === '\r') i++;
      } else {
        currentField += char;
      }
    }
  }
  if (currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const content = fs.readFileSync('EtsyListingsDownload.csv', 'utf8');
const data = parseCSV(content);
const headers = data[0];
const items = data.slice(1).map(row => {
  const item = {};
  headers.forEach((h, i) => {
    item[h.trim()] = row[i];
  });
  return item;
});

const categories = new Set();
const tags = new Set();

items.forEach(item => {
  if (item.TAGS) {
    item.TAGS.split(',').forEach(tag => tags.add(tag.trim().toLowerCase()));
  }
});

console.log('Total Products:', items.length);
console.log('Titles:', items.map(i => i.TITLE).filter(t => t).slice(0, 5));
console.log('Common Tags:', Array.from(tags).slice(0, 20));
