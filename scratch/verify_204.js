const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p = products.find(x => x.id === 'etsy-204');
console.log('ID:', p.id);
console.log('Name:', p.name);
console.log('Slug:', p.slug);
console.log('Price:', p.price, 'OriginalPrice:', p.originalPrice);
console.log('Etsy URL:', p.etsy_url);
