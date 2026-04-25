/**
 * fix_missing_etsy_urls.js
 * Fixes 5 products that had no etsy_url by adding the correct listing URLs
 */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const fixes = {
  'etsy-12': 'https://www.etsy.com/listing/4461302426/cedar-double-chair-bench-with-table',
  'etsy-35': 'https://www.etsy.com/listing/4470278765/5-tier-garden-planter-plans-wooden',
  'etsy-67': 'https://www.etsy.com/listing/4440362308/custom-sketch-portrait-from-photo',
  'etsy-70': 'https://www.etsy.com/listing/4443614124/add-deceased-loved-one-to-photo-custom',
  'etsy-71': 'https://www.etsy.com/listing/4440354589/custom-couple-portrait-romantic-pencil',
};

let fixedCount = 0;
for (const product of products) {
  if (fixes[product.id]) {
    console.log(`Fixing ${product.id}: "${product.name.slice(0,50)}"`);
    console.log(`  -> ${fixes[product.id]}`);
    product.etsy_url = fixes[product.id];
    fixedCount++;
  }
}

// Verify all products now have etsy_url
const stillMissing = products.filter(p => !p.etsy_url || p.etsy_url === '');
console.log(`\nFixed: ${fixedCount}`);
console.log(`Still missing etsy_url: ${stillMissing.length}`);
if (stillMissing.length > 0) {
  stillMissing.forEach(p => console.log('  -', p.id, p.name.slice(0,50)));
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log('\n✅ etsy_products.json updated');
