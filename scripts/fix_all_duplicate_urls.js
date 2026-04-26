/**
 * fix_all_duplicate_urls.js
 * 
 * Fixes 14 products that had duplicate/wrong Etsy listing IDs.
 * All URLs verified by browsing ElesWoodDesigns Etsy shop.
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Verified correct listing URLs found by browsing Etsy shop
const corrections = {
  'etsy-18': 'https://www.etsy.com/listing/4352466955/',   // Customizable Costco Font SVG Pack
  'etsy-19': 'https://www.etsy.com/listing/4487620243/',   // DIY Mobile Workbench Plans PDF
  'etsy-21': 'https://www.etsy.com/listing/4486927175/',   // DIY Pergola Swing Chair Plans
  'etsy-30': 'https://www.etsy.com/listing/4367248406/',   // DIY Mobile Bar Cart Plan: Foldable Beverage
  'etsy-31': 'https://www.etsy.com/listing/4377936723/',   // DIY Farm Stand Plans: Portable Market Cart
  'etsy-34': 'https://www.etsy.com/listing/4472269006/',   // DIY Potting Bench Plans with Storage
  'etsy-41': 'https://www.etsy.com/listing/4487332329/',   // DIY Wooden Playhouse Plans with Slide
  'etsy-43': 'https://www.etsy.com/listing/4463035923/',   // Twin Loft Bed Plans with Stairs & Desk
  'etsy-46': 'https://www.etsy.com/listing/4377578931/',   // DIY Mobile Coffee Cart Plans
  'etsy-50': 'https://www.etsy.com/listing/4471814434/',   // DIY Raised Chicken Coop Plans
  'etsy-53': 'https://www.etsy.com/listing/4471846483/',   // DIY S-Shaped Floating Shelf Plans
  'etsy-54': 'https://www.etsy.com/listing/4472262068/',   // DIY Wooden Floating Shelf Plans: Geometric
  'etsy-65': 'https://www.etsy.com/listing/4463022172/',   // Wall Mounted Folding Desk Plans
  'etsy-72': 'https://www.etsy.com/listing/4439950228/',   // Custom Memorial Portrait From Photos
};

let fixedCount = 0;
for (const product of products) {
  if (corrections[product.id]) {
    const oldUrl = product.etsy_url;
    product.etsy_url = corrections[product.id];
    fixedCount++;
    console.log(`✓ ${product.id}: "${product.name.slice(0, 50)}"`);
    console.log(`  OLD: ${oldUrl}`);
    console.log(`  NEW: ${product.etsy_url}`);
  }
}

// Final duplicate check
const listingIds = products.map(p => {
  const match = (p.etsy_url || '').match(/listing\/(\d+)/);
  return match ? match[1] : null;
}).filter(Boolean);

const duplicates = listingIds.filter((id, i) => listingIds.indexOf(id) !== i);

if (duplicates.length > 0) {
  console.log('\n❌ STILL HAVE DUPLICATE IDs:', duplicates);
} else {
  console.log('\n✅ No duplicate listing IDs — all products have unique Etsy URLs!');
}

const missing = products.filter(p => !p.etsy_url || p.etsy_url === '');
if (missing.length > 0) {
  console.log('⚠️  Products still missing etsy_url:', missing.map(p => p.id).join(', '));
} else {
  console.log('✅ All products have etsy_url set.');
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\n✅ Fixed ${fixedCount} products. etsy_products.json saved.`);
