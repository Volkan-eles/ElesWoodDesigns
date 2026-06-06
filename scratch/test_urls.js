const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));
const csvContent = fs.readFileSync('EtsyListingsDownload.csv', 'utf8');

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
              field += '"'; i += 2;
            } else {
              i++; break;
            }
          } else {
            field += content[i]; i++;
          }
        }
      } else {
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') {
          field += content[i]; i++;
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

const rows = parseCSV(csvContent);
const headers = rows[0];
const newProductsRows = rows.slice(1).filter(r => r.length > 3 && r[0]).filter(r => {
  const t = r[headers.indexOf('TITLE')];
  return t && !existingTitles.has(t.trim().toLowerCase());
});

console.log(`Found ${newProductsRows.length} new products in CSV.`);

newProductsRows.forEach(row => {
  const title = row[headers.indexOf('TITLE')].trim();
  const titleWords = title.toLowerCase();
  let etsyUrl = '';
  
  if (titleWords.includes('outdoor dining set plans')) {
    etsyUrl = 'https://www.etsy.com/listing/4496558846/outdoor-dining-set-plans-table-and-six';
  } else if (titleWords.includes('mid-century modern bookshelf')) {
    etsyUrl = 'https://www.etsy.com/listing/4496575305/mid-century-modern-bookshelf-plans';
  } else if (titleWords.includes('party games bundle')) {
    etsyUrl = 'https://www.etsy.com/listing/4496905529/kentucky-derby-2026-party-games-bundle';
  } else if (titleWords.includes('party game – horse draw')) {
    etsyUrl = 'https://www.etsy.com/listing/4496921575/kentucky-derby-2026-party-game-horse';
  } else if (titleWords.includes('wagering ledger')) {
    etsyUrl = 'https://www.etsy.com/listing/4496922638/kentucky-derby-2026-wagering-ledger';
  } else if (titleWords.includes('betting slips')) {
    etsyUrl = 'https://www.etsy.com/listing/4496899815/kentucky-derby-2026-betting-slipsi';
  } else if (titleWords.includes('horse cards printable')) {
    etsyUrl = 'https://www.etsy.com/listing/4496891343/kentucky-derby-2026-horse-cards';
  } else if (titleWords.includes('jockey silks cards')) {
    etsyUrl = 'https://www.etsy.com/listing/4496941166/2026-kentucky-derby-jockey-silks-cards';
  } else if (titleWords.includes('collapsible coffee cart')) {
    etsyUrl = 'https://www.etsy.com/listing/4377578931/diy-mobile-coffee-cart-plans-collapsible';
  }
  
  if (etsyUrl) {
    console.log(`[HAS URL] ${title}\n  -> ${etsyUrl}`);
  } else {
    console.log(`[MISSING URL] ${title}`);
  }
});
