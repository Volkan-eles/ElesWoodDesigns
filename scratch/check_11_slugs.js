const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

const targets = ['etsy-7', 'etsy-9', 'etsy-10', 'etsy-13', 'etsy-22', 'etsy-109', 'etsy-120', 'etsy-167', 'etsy-180', 'etsy-187', 'etsy-204'];

products.filter(p => targets.includes(p.id)).forEach(p => {
  console.log(`[${p.id}]`);
  console.log(`  Name: ${p.name}`);
  console.log(`  Slug: ${p.slug}`);
});
