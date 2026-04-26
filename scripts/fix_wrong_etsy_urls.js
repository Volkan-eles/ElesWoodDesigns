/**
 * fix_wrong_etsy_urls.js
 * 
 * Problem: etsy-8, etsy-66, etsy-69 had wrong Etsy listing IDs
 * (IDs that actually belong to other products).
 * 
 * Correct URLs verified by browsing the ElesWoodDesigns Etsy shop:
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const corrections = {
  // Previously had 4461302426 (= Two Seat Bench) — WRONG
  'etsy-8':  'https://www.etsy.com/listing/4367275115/diy-mobile-bar-cart-plans-pdf',
  
  // Previously had 4440362308 (= Custom Sketch Portrait) — WRONG
  'etsy-66': 'https://www.etsy.com/listing/4461520558/modern-outdoor-sauna-plans-4-person-diy',
  
  // Previously had 4443614124 (= Memorial Portrait) — WRONG
  'etsy-69': 'https://www.etsy.com/listing/4379214236/diy-modern-dog-house-plans-insulated',
};

let fixedCount = 0;
for (const product of products) {
  if (corrections[product.id]) {
    const oldUrl = product.etsy_url;
    product.etsy_url = corrections[product.id];
    fixedCount++;
    console.log(`Fixed ${product.id}: "${product.name.slice(0, 50)}"`);
    console.log(`  OLD: ${oldUrl}`);
    console.log(`  NEW: ${product.etsy_url}`);
  }
}

// Verify no duplicate listing IDs
const listingIds = products.map(p => {
  const match = (p.etsy_url || '').match(/listing\/(\d+)/);
  return match ? match[1] : null;
}).filter(Boolean);

const duplicates = listingIds.filter((id, i) => listingIds.indexOf(id) !== i);
if (duplicates.length > 0) {
  console.log('\n❌ DUPLICATE LISTING IDs FOUND:', duplicates);
} else {
  console.log('\n✅ No duplicate listing IDs.');
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\n✅ Fixed ${fixedCount} products. etsy_products.json updated.`);
