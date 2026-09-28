const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

console.log('Testing image links and potential Pinterest errors for all 136 products...');

// Pinterest feed requirements:
// 1. Title <= 100 chars (after XML escaping!)
// 2. Description <= 5000 chars
// 3. ID <= 100 chars
// 4. Image must be valid JPG/PNG, >= 400x400 px, reachable
// 5. Link must be valid HTTP/HTTPS
// 6. Price must have valid currency
// 7. Availability must be 'in stock', 'out of stock', or 'preorder'
// 8. Shipping country

const errors = [];

products.forEach((p, idx) => {
  const pinImagePath = path.join(ROOT, 'public', 'pinterest-images', `${p.slug}.jpg`);
  const hasStaticPin = fs.existsSync(pinImagePath);
  const staticPinUrl = `https://eleswooddesigns.com/pinterest-images/${p.slug}.jpg`;
  const rawProductImage = (p.images && p.images[0]) ? p.images[0] : '';
  const primaryImage = hasStaticPin ? staticPinUrl : rawProductImage;

  // Check title length AFTER xml escape
  const title = (p.name || '').replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '').trim().slice(0, 100);
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  if (escapedTitle.length > 100) {
    errors.push({ id: p.id, slug: p.slug, type: 'TITLE_TOO_LONG', detail: `Escaped title length is ${escapedTitle.length} (>100): ${escapedTitle}` });
  }

  // Check primary image
  if (!primaryImage) {
    errors.push({ id: p.id, slug: p.slug, type: 'NO_IMAGE', detail: 'Primary image is empty' });
  }

  // Check ID length
  if (p.slug.length > 100) {
    errors.push({ id: p.id, slug: p.slug, type: 'ID_TOO_LONG', detail: `Slug length is ${p.slug.length} (>100)` });
  }

  // Check price
  if (!p.price || p.price <= 0) {
    errors.push({ id: p.id, slug: p.slug, type: 'INVALID_PRICE', detail: `Price is ${p.price}` });
  }
});

console.log(`Found ${errors.length} validation errors:`);
errors.forEach(e => console.log(`[${e.id}] (${e.type}) ${e.detail}`));
