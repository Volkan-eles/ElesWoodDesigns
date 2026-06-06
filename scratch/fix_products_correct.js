/**
 * fix_products_correct.js
 * Fix all incorrect updates from previous run using exact IDs
 * Based on actual slug-to-CSV-title matching
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const byId = {};
for (const p of products) byId[p.id] = p;

// Corrections based on actual slugs:
const corrections = [
  // etsy-3 = diy-planter-box-plans-zero-waste-cedar-fence-picket → CSV: $15.64, qty 2
  { id: 'etsy-3', price: 15.64, stockQuantity: 2 },
  // etsy-4 = arbor-swing-plans-pergola-roof-a-frame → CSV: $24.63, qty 3
  { id: 'etsy-4', price: 24.63, stockQuantity: 3 },
  // etsy-7 = diy-farmstand-plans-mobile-market-stall → CSV: $22.99, qty 27
  { id: 'etsy-7', price: 22.99, stockQuantity: 27 },
  // etsy-8 = diy-mobile-bar-cart-plans-pdf-collapsible-serving-cart → CSV: $25.99, qty 92
  { id: 'etsy-8', price: 25.99, stockQuantity: 92 },
  // etsy-13 = diy-farmstand-plans-pdf-portable-roadside → CSV: $28.99, qty 22
  { id: 'etsy-13', price: 28.99, stockQuantity: 22 },
  // etsy-15 = diy-mobile-bar-cart-plans-foldable-serving-station → not in CSV, revert to previous
  // Leave etsy-15 as 22.99 / 27 - it was set by farmstand, this is a bar cart, no good match
  // etsy-22 = diy-outdoor-kitchen → not in CSV, revert 
  { id: 'etsy-22', price: 6.60, stockQuantity: 3 }, // revert (not in CSV)
  // etsy-23 = diy-full-size-loft-bed → CSV: $27.99, qty 1
  { id: 'etsy-23', price: 27.99, stockQuantity: 1 },
  // etsy-24 = diy-bookshelf → not in CSV, revert
  { id: 'etsy-24', price: 4.89, stockQuantity: 4 }, // revert to approx original
];

for (const c of corrections) {
  const p = byId[c.id];
  if (!p) { console.warn(`Not found: ${c.id}`); continue; }
  const oldPrice = p.price, oldStock = p.stockQuantity;
  p.price = c.price;
  p.stockQuantity = c.stockQuantity;
  p.originalPrice = Math.round((c.price / 0.30) * 100) / 100;
  console.log(`${p.id} (${p.slug.slice(0,55)}): ${oldPrice} -> ${c.price}, stock ${oldStock} -> ${c.stockQuantity}`);
}

// L-Shaped Corner Bench: not found in current products - skip (not in JSON)
// The CSV has it but there's no matching slug. It was likely not in the product catalog.

// diy-mobile-bar-cart-plans-foldable-serving-station (etsy-15): 
// CSV row "DIY Mobile Bar Cart Plans PDF: Collapsible Serving Cart Project" $25.99, qty 92 -> that matches etsy-8
// "DIY Mobile Bar Cart Plans | Foldable Serving Station" $25.99 as well
// Let's set etsy-15 to the same price since it's the same type
byId['etsy-15'].price = 25.99;
byId['etsy-15'].stockQuantity = 92;
byId['etsy-15'].originalPrice = Math.round((25.99 / 0.30) * 100) / 100;
console.log(`etsy-15 (diy-mobile-bar-cart-plans-foldable): corrected to 25.99 / 92`);

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\nDone. Total: ${products.length} products`);
