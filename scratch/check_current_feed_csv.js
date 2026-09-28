const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const csv = fs.readFileSync(path.join(ROOT, 'public', 'feed.csv'), 'utf8');

function parseCSV(content) {
  const rows = [];
  let i = 0; const len = content.length;
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
            if (i+1 < len && content[i+1] === '"') { field += '"'; i+=2; }
            else { i++; break; }
          } else { field += content[i]; i++; }
        }
      } else {
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') { field += content[i]; i++; }
      }
      row.push(field);
      if (i < len && content[i] === ',') i++;
      else inField = false;
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
  }
  return rows;
}

const rows = parseCSV(csv);
const headers = rows[0];
console.log('Headers:', headers);
console.log('Total rows:', rows.length - 1);

const issues = [];
rows.slice(1).forEach((r, idx) => {
  const id = r[0];
  const title = r[1];
  const link = r[3];
  const img = r[4];
  const price = r[5];
  const salePrice = r[6];
  const shipping = r[12];

  if (!id) issues.push(`Row ${idx+1}: Missing ID`);
  if (!title) issues.push(`Row ${idx+1}: Missing title`);
  if (title && title.length > 100) issues.push(`Row ${idx+1} (${id}): Title length > 100 (${title.length})`);
  if (!link || !link.startsWith('http')) issues.push(`Row ${idx+1} (${id}): Invalid link: ${link}`);
  if (!img || !img.startsWith('http')) issues.push(`Row ${idx+1} (${id}): Invalid img: ${img}`);
  if (!price || !price.includes('USD')) issues.push(`Row ${idx+1} (${id}): Bad price: ${price}`);
  if (!shipping) issues.push(`Row ${idx+1} (${id}): Missing shipping`);
});

console.log('Issues in public/feed.csv:', issues.length);
issues.forEach(iss => console.log('  ⚠️ ' + iss));
