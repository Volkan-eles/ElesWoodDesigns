/**
 * cleanup_duplicates.js
 * 
 * Removes duplicate FIFA/World Cup products and keeps only the correct ones with real images.
 * - Removes etsy-115 (placeholder FIFA bracket - wrong image)
 * - Removes etsy-116 (placeholder FIFA wall chart - wrong image)
 * - Removes etsy-121 (duplicate World Cup sweepstake)
 * - Keeps etsy-117 (FIFA Wall Chart - real image from CSV2)
 * - Keeps etsy-118 (FIFA Bracket - real image from CSV2)
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const toRemove = new Set(['etsy-115', 'etsy-116', 'etsy-121']);

const before = products.length;
const cleaned = products.filter(p => !toRemove.has(p.id));

console.log(`Removed: ${before - cleaned.length} duplicate/placeholder products`);
cleaned.forEach((p, i) => {
  if (['etsy-117', 'etsy-118', 'etsy-112'].includes(p.id)) {
    console.log(`  ✅ Kept: [${p.id}] ${p.name.slice(0, 70)}`);
    console.log(`     img: ${p.image.slice(0, 80)}`);
  }
});

fs.writeFileSync(JSON_PATH, JSON.stringify(cleaned, null, 2), 'utf8');
console.log(`\nTotal: ${before} → ${cleaned.length}`);
