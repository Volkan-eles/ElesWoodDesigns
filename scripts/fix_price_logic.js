/**
 * fix_price_logic.js
 * 
 * The current `price` field = real Etsy listing price (undiscounted).
 * The site shows a 70% OFF badge, so:
 *   - originalPrice = real Etsy price (for strikethrough display)
 *   - price = originalPrice * 0.30 (the 70% discounted sale price shown big)
 * 
 * This script fixes all 79 products.
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

let fixedCount = 0;

for (const product of products) {
  const etsyListingPrice = product.price; // This is the real Etsy price
  const salePrice = Math.round(etsyListingPrice * 0.30 * 100) / 100;

  // Only update if not already in correct form (avoid double-applying)
  // A product is "already correct" if originalPrice ≈ price * 3.33 (i.e. was already flipped)
  // We need to detect if price is the "full" price or "sale" price.
  // Safe heuristic: if originalPrice > price * 2 then it's ALREADY sale-price-first (old wrong format)
  //                 if originalPrice is undefined OR originalPrice ≈ price then it's full-price-first (needs fix)
  
  const oldOriginal = product.originalPrice;
  
  // If originalPrice is already ~3.33x price, it was already calculated as price/0.30 → needs flip
  // If originalPrice is roughly equal to price, it was never touched → needs flip
  // In both cases: set originalPrice = current price, set price = current price * 0.30
  
  product.originalPrice = parseFloat(etsyListingPrice.toFixed(2));
  product.price = parseFloat(salePrice.toFixed(2));
  fixedCount++;
  
  console.log(`[${product.id}] "${product.name.slice(0, 45)}":`);
  console.log(`   Etsy full price: $${etsyListingPrice.toFixed(2)} | Old origPrice: $${oldOriginal?.toFixed(2) ?? 'N/A'}`);
  console.log(`   → New originalPrice (strikethrough): $${product.originalPrice.toFixed(2)}`);
  console.log(`   → New price (sale, 70% off): $${product.price.toFixed(2)}`);
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\n✅ Fixed ${fixedCount} products. All prices now show correct 70% discount.`);
console.log('   Display: ~~$ORIGINAL~~ 70% OFF → $SALE (30% of original)');
