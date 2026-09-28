const fs = require('fs');

const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

const pairs = [
  ['etsy-119', 'etsy-122'],
  ['etsy-123', 'etsy-198'],
  ['etsy-200', 'etsy-202'],
];

pairs.forEach(([id1, id2]) => {
  const p1 = products.find(p => p.id === id1);
  const p2 = products.find(p => p.id === id2);
  console.log(`\n=== PAIR: ${id1} vs ${id2} ===`);
  console.log(`P1 (${id1}):`);
  console.log(`  Name: ${p1.name}`);
  console.log(`  Slug: ${p1.slug}`);
  console.log(`  Etsy URL: ${p1.etsy_url}`);
  console.log(`  Image: ${p1.image}`);
  console.log(`  Price: $${p1.price} (Orig: $${p1.originalPrice})`);
  console.log(`P2 (${id2}):`);
  console.log(`  Name: ${p2.name}`);
  console.log(`  Slug: ${p2.slug}`);
  console.log(`  Etsy URL: ${p2.etsy_url}`);
  console.log(`  Image: ${p2.image}`);
  console.log(`  Price: $${p2.price} (Orig: $${p2.originalPrice})`);
});
