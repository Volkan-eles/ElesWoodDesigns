const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const checkIds = ['etsy-119', 'etsy-122', 'etsy-123', 'etsy-198', 'etsy-200', 'etsy-202'];
products.filter(p => checkIds.includes(p.id)).forEach(p => {
  console.log(`[${p.id}]`);
  console.log(`  Name:     ${p.name}`);
  console.log(`  Slug:     ${p.slug}`);
  console.log(`  Etsy URL: ${p.etsy_url}`);
  console.log('---');
});
