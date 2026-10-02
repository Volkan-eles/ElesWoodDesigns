const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const rows = [];
  let i = 0, len = content.length;
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

const ROOT = path.join(__dirname, '..');
const csv = parseCSV(fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8'));
const headers = csv[0];
const titleIdx = headers.indexOf('TITLE');
const descIdx = headers.indexOf('DESCRIPTION');
const priceIdx = headers.indexOf('PRICE');
const tagsIdx = headers.indexOf('TAGS');
const qtyIdx = headers.indexOf('QUANTITY');

function extractImages(row) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf('IMAGE' + i);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx].trim());
  }
  return imgs;
}

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

const csvRows = csv.slice(1).map((r, idx) => ({
  title: (r[titleIdx] || '').trim(),
  price: parseFloat(r[priceIdx]),
  desc: (r[descIdx] || '').trim(),
  tags: (r[tagsIdx] || '').split(',').map(t => t.trim()).filter(Boolean),
  qty: parseInt(r[qtyIdx], 10),
  images: extractImages(r),
  rowIdx: idx
}));

console.log('Total CSV listings:', csvRows.length);
console.log('Total JSON products:', products.length);

const csvByImgId = new Map();
csvRows.forEach(c => {
  c.images.forEach(img => {
    const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
    if (m) csvByImgId.set(m[1], c);
  });
});

const csvByTitle = new Map();
csvRows.forEach(c => {
  if (c.title) csvByTitle.set(c.title.toLowerCase(), c);
});

let matchedCount = 0;
const diffs = [];

products.forEach(p => {
  let match = null;
  const allImgs = [p.image, ...(p.images || [])];
  for (const img of allImgs) {
    if (!img) continue;
    const m = img.match(/\/il_(?:fullxfull|794xN|1588xN)\.(\d+)/);
    if (m && csvByImgId.has(m[1])) {
      match = csvByImgId.get(m[1]);
      break;
    }
  }
  if (!match) {
    match = csvByTitle.get((p.name || '').trim().toLowerCase());
  }

  if (match) {
    matchedCount++;
    const changes = {};
    if (p.name !== match.title) {
      changes.title = { old: p.name, new: match.title };
    }
    if ((p.longDescription || '').trim() !== match.desc) {
      changes.desc = { oldLen: (p.longDescription || '').length, newLen: match.desc.length };
    }
    const oldTags = (p.tags || []).join(',');
    const newTags = match.tags.join(',');
    if (oldTags !== newTags) {
      changes.tags = { old: p.tags, new: match.tags };
    }
    const origPrice = match.price;
    const salePrice = Math.max(0.5, Math.round(origPrice * 0.75 * 100) / 100);
    if (Math.abs((p.originalPrice || 0) - origPrice) > 0.001 || Math.abs(p.price - salePrice) > 0.001) {
      changes.price = { oldOrig: p.originalPrice, newOrig: origPrice, oldSale: p.price, newSale: salePrice };
    }
    if (match.images.length > 0 && (match.images[0] !== p.image || JSON.stringify(match.images) !== JSON.stringify(p.images))) {
      changes.image = { old: p.image, new: match.images[0], totalCsvImgs: match.images.length, totalJsonImgs: (p.images || []).length };
    }
    if (Object.keys(changes).length > 0) {
      diffs.push({ id: p.id, slug: p.slug, changes });
    }
  }
});

console.log('Matched count:', matchedCount);
console.log('Products with changes:', diffs.length);
diffs.forEach(d => {
  console.log('--- ' + d.id + ' (' + d.slug + ') ---');
  if (d.changes.title) console.log('  TITLE:', d.changes.title.old, '->', d.changes.title.new);
  if (d.changes.price) console.log('  PRICE:', d.changes.price);
  if (d.changes.image) console.log('  IMAGE:', d.changes.image);
  if (d.changes.tags) console.log('  TAGS count:', d.changes.tags.old.length, '->', d.changes.tags.new.length);
  if (d.changes.desc) console.log('  DESC updated');
});
