/**
 * fix_specific_products.js
 * Fix the multi-match and no-match warnings from the previous script
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Map by ID for precise updates
const byId = {};
for (const p of products) byId[p.id] = p;

const fixes = [
  // corner-bench: No match - need to find the right one
  // L Shaped Corner Bench Plans: $12.7, qty 3
  { id: 'etsy-22', price: 12.70, stockQuantity: 3 }, // corner bench

  // planter-box-plans multiple matches:
  // diy-planter-box-plans-zero-waste-cedar-fence-picket-design: $15.64, qty 2
  { id: 'etsy-7', price: 15.64, stockQuantity: 2 },  // cedar fence picket planter box
  // tiered-planter-box already updated correctly as etsy-1

  // loft-bed multiple matches:
  // diy-full-size-loft-bed: $27.99, qty 1
  { id: 'etsy-3', price: 27.99, stockQuantity: 1 },  // full size loft bed
  // twin loft bed - not in CSV so leave it

  // arbor-swing-plans multiple matches:
  // arbor-swing-plans-pergola-roof-a-frame-freestanding: $24.63, qty 3
  { id: 'etsy-13', price: 24.63, stockQuantity: 3 }, // arbor swing plans

  // farmstand-plan multiple matches:
  // diy-farmstand-plans-mobile-market-stall: $22.99, qty 27
  { id: 'etsy-15', price: 22.99, stockQuantity: 27 },
  // diy-farmstand-plans-pdf-portable-roadside: $28.99, qty 22 (diy-farm-stand-plans match)
  { id: 'etsy-8', price: 28.99, stockQuantity: 22 },

  // mobile-bar-cart multiple matches - use CSV title to match:
  // "DIY Mobile Bar Cart Plans PDF: Collapsible Serving Cart Project" $25.99, qty 92
  { id: 'etsy-24', price: 25.99, stockQuantity: 92 }, // mobile bar cart collapsible

  // diy-farm-stand-plans multiple matches:
  // "DIY Farm Stand Plans: Roadside Egg, Plant, Flower Cart" $28.99 -> update etsy-63 (already has $10.8)  
  { id: 'etsy-63', price: 28.99, stockQuantity: 15 },
];

// find corner bench first
const cornerBench = products.find(p => p.slug.includes('corner-bench') || p.slug.includes('l-shaped-bench') || p.name.toLowerCase().includes('corner bench'));
if (cornerBench) {
  console.log(`Found corner bench: ${cornerBench.id} - ${cornerBench.slug}`);
  cornerBench.price = 12.70;
  cornerBench.stockQuantity = 3;
  console.log(`  Updated corner bench: price -> 12.70, stock -> 3`);
} else {
  console.warn('Corner bench not found!');
  // List all benches
  const benches = products.filter(p => p.slug.includes('bench'));
  console.log('Available benches:', benches.map(p => `${p.id}: ${p.slug}`).join('\n'));
}

for (const fix of fixes) {
  const p = byId[fix.id];
  if (!p) {
    console.warn(`Product ${fix.id} not found!`);
    continue;
  }
  const oldPrice = p.price;
  const oldStock = p.stockQuantity;
  p.price = fix.price;
  p.stockQuantity = fix.stockQuantity;
  p.originalPrice = Math.round((fix.price / 0.30) * 100) / 100;
  console.log(`Updated ${p.id} (${p.slug.slice(0, 50)}): price ${oldPrice} -> ${fix.price}, stock ${oldStock} -> ${fix.stockQuantity}`);
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\nSaved. Total: ${products.length} products`);
