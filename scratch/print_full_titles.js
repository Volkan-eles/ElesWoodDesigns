const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const check = ['etsy-119', 'etsy-122', 'etsy-123', 'etsy-198', 'etsy-200', 'etsy-202'];

check.forEach(id => {
  const p = products.find(x => x.id === id);
  console.log(`ID: ${p.id}`);
  console.log(`Tam Başlık: ${p.name}`);
  console.log(`Fiyat: $${p.originalPrice} (İndirimli: $${p.price})`);
  console.log(`Mevcut Etsy URL: ${p.etsy_url}`);
  console.log(`Görsel: ${p.image}`);
  console.log('---');
});
