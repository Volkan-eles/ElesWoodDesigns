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
const csvContent = fs.readFileSync(path.join(ROOT, 'EtsyListingsDownload.csv'), 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];

const titleIdx = headers.indexOf('TITLE');
const descIdx = headers.indexOf('DESCRIPTION');
const priceIdx = headers.indexOf('PRICE');
const tagsIdx = headers.indexOf('TAGS');
const imgIdx = headers.indexOf('IMAGE1');
const qtyIdx = headers.indexOf('QUANTITY');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Build CSV map by image ID and title
const csvByImg = new Map();
const csvByTitle = new Map();

rows.slice(1).forEach((r, idx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const desc = r[descIdx] || '';
  const tagsStr = r[tagsIdx] || '';
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const img = (r[imgIdx] || '').trim();
  const qty = parseInt(r[qtyIdx], 10);

  const imgMatch = img.match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
  const imgKey = imgMatch ? imgMatch[1] : null;

  const data = { title, price, desc, tags, tagsStr, img, qty, rowIdx: idx };

  if (title) csvByTitle.set(title.toLowerCase(), data);
  if (imgKey) csvByImg.set(imgKey, data);
});

console.log('Comparing CSV with JSON...');

const changes = [];

products.forEach(p => {
  // Find match
  let match = csvByTitle.get(p.name.trim().toLowerCase());
  if (!match) {
    const imgMatch = (p.image || '').match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
    if (imgMatch) match = csvByImg.get(imgMatch[1]);
  }
  if (!match && p.images && p.images.length > 0) {
    for (const otherImg of p.images) {
      const m = otherImg.match(/\/il_(?:fullxfull|794xN)\.(\d+)/);
      if (m && csvByImg.get(m[1])) {
        match = csvByImg.get(m[1]);
        break;
      }
    }
  }

  if (!match) {
    console.warn(`[NOT MATCHED] ${p.id}: ${p.name}`);
    return;
  }

  const pChanges = { id: p.id, fields: [] };

  // 1. Check title
  if (p.name !== match.title) {
    pChanges.fields.push({
      field: 'title',
      old: p.name,
      new: match.title
    });
  }

  // 2. Check tags
  const oldTagsStr = (p.tags || []).join(',');
  const newTagsStr = match.tags.join(',');
  if (oldTagsStr !== newTagsStr) {
    pChanges.fields.push({
      field: 'tags',
      oldCount: (p.tags || []).length,
      newCount: match.tags.length,
      oldSample: (p.tags || []).slice(0, 3).join(', '),
      newSample: match.tags.slice(0, 3).join(', ')
    });
  }

  // 3. Check description
  if ((p.longDescription || '') !== match.desc) {
    pChanges.fields.push({
      field: 'description',
      oldLen: (p.longDescription || '').length,
      newLen: match.desc.length
    });
  }

  // 4. Check price
  if (Math.abs(p.originalPrice - match.price) > 0.001) {
    pChanges.fields.push({
      field: 'price',
      oldOrig: p.originalPrice,
      newOrig: match.price
    });
  }

  if (pChanges.fields.length > 0) {
    changes.push({ product: p, match, pChanges });
  }
});

console.log(`\nFound ${changes.length} products with differences.`);

changes.forEach(({ product, pChanges }) => {
  console.log(`\n[${product.id}]`);
  pChanges.fields.forEach(f => {
    if (f.field === 'title') {
      console.log(`  TITLE:\n    OLD: ${f.old}\n    NEW: ${f.new}`);
    } else if (f.field === 'tags') {
      console.log(`  TAGS: (${f.oldCount} -> ${f.newCount} tags) New sample: ${f.newSample}`);
    } else if (f.field === 'description') {
      console.log(`  DESCRIPTION: length changed (${f.oldLen} -> ${f.newLen} chars)`);
    } else if (f.field === 'price') {
      console.log(`  PRICE: $${f.oldOrig} -> $${f.newOrig}`);
    }
  });
});
