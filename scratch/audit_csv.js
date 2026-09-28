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

const csv = fs.readFileSync('EtsyListingsDownload.csv', 'utf8');
const rows = parseCSV(csv);
const headers = rows[0];

const titleIdx = headers.indexOf('TITLE');
const priceIdx = headers.indexOf('PRICE');
const descIdx = headers.indexOf('DESCRIPTION');
const tagsIdx = headers.indexOf('TAGS');
const qtyIdx = headers.indexOf('QUANTITY');
const stateIdx = headers.indexOf('SHOULD_AUTO_RENEW') >= 0 ? headers.indexOf('SHOULD_AUTO_RENEW') : -1;
const statusIdx = headers.findIndex(h => h && h.toLowerCase().includes('status'));
const listingIdIdx = headers.findIndex(h => h && h.toLowerCase().includes('listing_id') || h && h.toLowerCase() === 'listing id');

function extractImages(row) {
  const imgs = [];
  for (let i = 1; i <= 10; i++) {
    const idx = headers.indexOf(`IMAGE${i}`);
    if (idx >= 0 && row[idx] && row[idx].startsWith('http')) imgs.push(row[idx].trim());
  }
  return imgs;
}

console.log('CSV HEADERS:', headers.slice(0, 20).join(' | '));
console.log('Total CSV rows:', rows.length - 1);
console.log('');

const csvRows = rows.slice(1).map((r, idx) => {
  const title = (r[titleIdx] || '').trim();
  const price = parseFloat(r[priceIdx]);
  const desc = (r[descIdx] || '').trim();
  const tagsStr = (r[tagsIdx] || '').trim();
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const images = extractImages(r);
  const qty = parseInt(r[qtyIdx], 10);
  const listingId = listingIdIdx >= 0 ? (r[listingIdIdx] || '').trim() : '';

  return { title, price, desc, tags, images, qty, listingId, rowIdx: idx };
});

// Show all rows
csvRows.forEach((r, i) => {
  console.log(`[Row ${i}] ${r.title}`);
  console.log(`  Price: $${r.price} | Qty: ${r.qty} | Listing: ${r.listingId}`);
  console.log(`  Tags: ${r.tags.slice(0, 3).join(', ')}`);
  console.log(`  Images: ${r.images.length}`);
  console.log('');
});
