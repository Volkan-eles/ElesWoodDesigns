const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const pubPath = path.join(ROOT, '..', 'public', 'EtsyListingsDownload.csv');
const rootPath = path.join(ROOT, '..', 'EtsyListingsDownload.csv');

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

function getTitles(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(content);
  const headers = rows[0];
  const titleIdx = headers.indexOf('TITLE');
  const titles = new Set();
  
  for (let idx = 1; idx < rows.length; idx++) {
    const row = rows[idx];
    const title = row[titleIdx];
    if (title && title.trim()) {
      titles.add(title.trim().toLowerCase());
    }
  }
  return titles;
}

const pubTitles = getTitles(pubPath);
const rootTitles = getTitles(rootPath);

console.log('Public CSV titles count:', pubTitles.size);
console.log('Root CSV titles count:', rootTitles.size);

const newTitles = [];
for (const t of pubTitles) {
  if (!rootTitles.has(t)) {
    newTitles.push(t);
  }
}

console.log('New titles count:', newTitles.length);
console.log('New titles:', newTitles);
