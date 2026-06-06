const fs = require('fs');
const path = require('path');
const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

let updatedCount = 0;
for (const p of products) {
  const t = p.name.toLowerCase();
  if (t.includes('horse cards – jockey silks roster') && !p.etsy_url) {
    p.etsy_url = 'https://www.etsy.com/listing/4497729297/kentucky-derby-2026-horse-cards-jockey';
    updatedCount++;
  } else if (t.includes('race lineup & jockey silks') && !p.etsy_url) {
    p.etsy_url = 'https://www.etsy.com/listing/4497486232/2026-kentucky-derby-race-lineup-jockey';
    updatedCount++;
  } else if (t.includes('l shaped corner bench') && !p.etsy_url) {
    p.etsy_url = 'https://www.etsy.com/listing/4494192465/l-shaped-corner-bench-plans-built-in';
    updatedCount++;
  } else if (t.includes('modern firewood shed plan') && !p.etsy_url) {
    p.etsy_url = 'https://www.etsy.com/listing/4380408404/8x10-firewood-shed-plans-diy-sloped-roof';
    updatedCount++;
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${updatedCount} missing URLs in etsy_products.json`);
