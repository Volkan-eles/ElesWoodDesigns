const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const p = products.find(x => x.id === 'etsy-204');
console.log('Image in JSON:', p.image);
console.log('Images in JSON:', p.images?.length);
console.log('Tags in JSON:', p.tags);
