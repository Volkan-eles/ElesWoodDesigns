const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/etsy_products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const target = products.find(p => p.id === 'etsy-204' || (p.etsy_url && p.etsy_url.includes('4580616210')));

if (!target) {
  console.error('Product not found!');
  process.exit(1);
}

console.log('Found product:', target.id);
console.log('Old Name:', target.name);
console.log('Old Slug:', target.slug);

target.name = 'DIY Firewood Shed Plans | Lean-To Log Storage Blueprint (PDF Download)';
target.slug = 'diy-firewood-shed-plans-lean-to-log-storage-blueprint-pdf-download';
target.stockQuantity = 3;

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');

console.log('\nUpdated product successfully:');
console.log('New Name:', target.name);
console.log('New Slug:', target.slug);
console.log('Stock Quantity:', target.stockQuantity);
