// Match the 2 unmatched CSV rows to JSON products manually:
// CSV: "DIY 13 FT Big Wooden Windmill Head Plans, Western Farmhouse Garden Decor (Digital Download)"
//   => etsy-17: "DIY 13 FT Wooden Windmill Plans: Rustic Farmhouse Yard Decor (Digital Download)"
// CSV: "DIY Modern Outdoor Sauna Plans PDF | Backyard Blueprint With Window & Shower Porch | Digital Download"
//   => etsy-180: "Backyard Sauna Plans | Modern Cedar Outdoor Sauna With Window, DIY Build Blueprint PDF"

// Both these products were removed from Etsy (not in our matched list) so they stay on site
// But we should update their data from the CSV

const fs = require('fs');
const path = require('path');

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

function makeThumbnail(url) {
  if (!url) return '';
  return url.replace(/\/il_fullxfull\./, '/il_794xN.').replace(/\/il_1588xN\./, '/il_794xN.');
}

const ROOT = path.join(__dirname, '..');
const csv = fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8');
const rows = parseCSV(csv);
const headers = rows[0];

const titleIdx = headers.indexOf('TITLE');
const descIdx = headers.indexOf('DESCRIPTION');
const priceIdx = headers.indexOf('PRICE');
const tagsIdx = headers.indexOf('TAGS');
const qtyIdx = headers.indexOf('QUANTITY');

function extractImages(row) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx].trim());
  }
  return imgs;
}

const csvRows = rows.slice(1).map(r => ({
  title: (r[titleIdx] || '').trim(),
  price: parseFloat(r[priceIdx]),
  desc: (r[descIdx] || '').trim(),
  tags: (r[tagsIdx] || '').trim().split(',').map(t => t.trim()).filter(Boolean),
  qty: parseInt(r[qtyIdx], 10),
  images: extractImages(r),
}));

// Find the two unmatched rows by title
const windmillCsv = csvRows.find(r => r.title.includes('Windmill Head'));
const saunaCsv = csvRows.find(r => r.title.includes('Sauna') && r.title.includes('Modern Outdoor'));

console.log('Windmill CSV:', windmillCsv ? windmillCsv.title : 'NOT FOUND');
console.log('Sauna CSV:', saunaCsv ? saunaCsv.title : 'NOT FOUND');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

let updates = 0;
const updated = products.map(p => {
  let csvMatch = null;
  if (p.id === 'etsy-17' && windmillCsv) csvMatch = windmillCsv;
  if (p.id === 'etsy-180' && saunaCsv) csvMatch = saunaCsv;

  if (!csvMatch) return p;

  updates++;
  const origPrice = csvMatch.price;
  const salePrice = Math.max(0.50, Math.round(origPrice * 0.75 * 100) / 100);
  const result = { ...p,
    name: csvMatch.title,
    price: salePrice,
    originalPrice: origPrice,
    longDescription: csvMatch.desc,
    description: csvMatch.desc.replace(/\n+/g, ' ').trim().slice(0, 220),
    tags: csvMatch.tags,
  };
  if (csvMatch.images.length > 0 && csvMatch.images[0] && csvMatch.images[0] !== p.image) {
    result.image = csvMatch.images[0];
    result.thumbnail = makeThumbnail(csvMatch.images[0]);
    result.images = csvMatch.images;
    result.imagesThumbnails = csvMatch.images.map(makeThumbnail);
  }
  console.log(`Updated ${p.id}: "${p.name}" -> "${csvMatch.title}"`);
  return result;
});

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(updated, null, 2), 'utf8');
console.log(`\n✅ Updated ${updates} products`);
