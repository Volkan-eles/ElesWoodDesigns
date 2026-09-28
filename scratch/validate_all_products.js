const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

console.log(`Auditing ${products.length} products...\n`);

const issues = [];

products.forEach((p, idx) => {
  // Check required fields
  if (!p.id) issues.push(`[#${idx}] Missing ID`);
  if (!p.name) issues.push(`[${p.id}] Missing name`);
  if (!p.slug) issues.push(`[${p.id}] Missing slug`);
  if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) issues.push(`[${p.id}] Invalid price: ${p.price}`);
  if (p.originalPrice && (typeof p.originalPrice !== 'number' || isNaN(p.originalPrice) || p.originalPrice <= 0)) {
    issues.push(`[${p.id}] Invalid originalPrice: ${p.originalPrice}`);
  }
  if (!p.image || !p.image.startsWith('http')) issues.push(`[${p.id}] Invalid main image: ${p.image}`);
  if (!p.description) issues.push(`[${p.id}] Missing description`);

  // Check Etsy URL format if present
  if (p.etsy_url) {
    if (!p.etsy_url.startsWith('https://www.etsy.com/listing/')) {
      issues.push(`[${p.id}] Malformed etsy_url: ${p.etsy_url}`);
    }
  }

  // Check images array
  if (!Array.isArray(p.images) || p.images.length === 0) {
    issues.push(`[${p.id}] Missing or empty images array`);
  }
});

console.log(`Audit finished. Found ${issues.length} issues.`);
issues.forEach(iss => console.log('  ⚠️ ' + iss));

if (issues.length === 0) {
  console.log('✅ All 136 products passed validation with 0 issues!');
}
