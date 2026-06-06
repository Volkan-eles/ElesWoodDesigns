
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

const bad = products.filter(p => p.name.includes('?"') || p.description.includes('?"'));
console.log(`Found ${bad.length} products with corrupted encoding characters (?")`);
bad.forEach(p => console.log(`- ${p.slug}`));
