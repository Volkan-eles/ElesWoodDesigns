
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

products.forEach(p => {
    const img = p.images ? p.images[0] : 'MISSING';
    console.log(`${p.slug}: ${img}`);
});
