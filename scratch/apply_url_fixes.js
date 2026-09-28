const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/etsy_products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const updates = {
  'etsy-119': 'https://www.etsy.com/listing/4502157281/american-mahjong-tile-svg-png-bundle',
  'etsy-122': 'https://www.etsy.com/listing/4502472107/mahjong-svg-png-bundle-american-mahjong',
  'etsy-123': 'https://www.etsy.com/listing/4513149219/diy-farmstand-plans-pdf-mobile-roadside',
  'etsy-198': 'https://www.etsy.com/listing/4515978768/diy-farmstand-plans-pdf-mobile-market',
  'etsy-200': 'https://www.etsy.com/listing/4562895426/trunk-or-treat-printable-decor-wholesale',
  'etsy-202': 'https://www.etsy.com/listing/4392635304/costco-halloween-trunk-or-treat-decor',
};

let count = 0;
products.forEach(p => {
  if (updates[p.id]) {
    const old = p.etsy_url;
    p.etsy_url = updates[p.id];
    console.log(`Updated [${p.id}]:`);
    console.log(`  Name: ${p.name.slice(0, 50)}...`);
    console.log(`  Old:  ${old}`);
    console.log(`  New:  ${p.etsy_url}`);
    count++;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`\nSuccessfully updated ${count} products in etsy_products.json`);
