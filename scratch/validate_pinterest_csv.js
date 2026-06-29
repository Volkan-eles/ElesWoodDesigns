const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'public', 'pinterest-bulk-pins.csv');
const csv = fs.readFileSync(CSV_PATH, 'utf8');

function parseCSVLine(line) {
  const fields = [];
  let i = 0, field = '', inQ = false;
  while (i < line.length) {
    const c = line[i];
    if (c === '"' && !inQ) { inQ = true; i++; continue; }
    if (c === '"' && inQ && line[i + 1] === '"') { field += '"'; i += 2; continue; }
    if (c === '"' && inQ) { inQ = false; i++; continue; }
    if (c === ',' && !inQ) { fields.push(field); field = ''; i++; continue; }
    field += c; i++;
  }
  fields.push(field);
  return fields;
}

const lines = csv.split('\n').filter(l => l.trim());
const header = parseCSVLine(lines[0]);
console.log('Sutunlar:', header.join(' | '));
console.log('Toplam pin:', lines.length - 1);

let okCount = 0, badCount = 0;
const badRows = [];
const imgUrls = [];

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const title = (cols[0] || '').slice(0, 50);
  const mediaUrl = (cols[3] || '').trim();

  imgUrls.push(mediaUrl);

  if (!mediaUrl || !mediaUrl.startsWith('http')) {
    badCount++;
    badRows.push({ line: i + 1, title, mediaUrl: mediaUrl.slice(0, 70) });
  } else {
    okCount++;
  }
}

console.log('\n✅ Gecerli gorsel URL:', okCount);
console.log('❌ Gecersiz/eksik gorsel URL:', badCount);

if (badRows.length > 0) {
  console.log('\nProblematik satirlar:');
  badRows.forEach(r => console.log('  Satir', r.line, '|', r.title, '\n    URL:', r.mediaUrl || '(BOŞ)'));
}

// Check duplicates
const imgSet = new Set(imgUrls.filter(u => u.startsWith('http')));
const dupCount = imgUrls.filter(u => u.startsWith('http')).length - imgSet.size;
console.log('\nToplam gorsel URL:', imgUrls.length, '| Benzersiz:', imgSet.size, '| Duplikat:', dupCount);

if (dupCount > 0) {
  const seen = new Set();
  const dups = [];
  imgUrls.forEach((url, i) => {
    if (url.startsWith('http')) {
      if (seen.has(url)) dups.push({ line: i + 2, url: url.slice(0, 80) });
      else seen.add(url);
    }
  });
  console.log('\nTekrarlayan gorseller:');
  dups.slice(0, 10).forEach(d => console.log('  Satir', d.line, ':', d.url));
}
