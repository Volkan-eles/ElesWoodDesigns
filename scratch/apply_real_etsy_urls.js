const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const productsPath = path.join(ROOT, 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const fixes = {
  'etsy-167': 'https://www.etsy.com/listing/4539273914/10x24-gazebo-build-plans-diy-backyard',
  'etsy-166': 'https://www.etsy.com/listing/4539271087/large-cigar-humidor-cabinet-plan-diy',
  'etsy-168': 'https://www.etsy.com/listing/4529545856/diy-pyramid-strawberry-planter-plans-4',
  'etsy-170': 'https://www.etsy.com/listing/4531239534/diy-cordless-drill-storage-plans-power',
  'etsy-173': 'https://www.etsy.com/listing/4532889137/circular-pergola-porch-swing-plans',
  'etsy-169': 'https://www.etsy.com/listing/4538014002/garage-cabinet-plans-with-drawers',
  'etsy-174': 'https://www.etsy.com/listing/4533934502/diy-wall-shelf-plans-wood-shoe-rack'
};

let updatedCount = 0;
const updatedProducts = products.map(p => {
  if (fixes[p.id]) {
    p.etsy_url = fixes[p.id];
    p.etsyUrl = fixes[p.id];
    updatedCount++;
    console.log(`Updated [${p.id}] -> ${fixes[p.id]}`);
  }
  return p;
});

fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} products.`);
