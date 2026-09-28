const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

const pinsFileContent = fs.readFileSync(path.join(ROOT, 'lib', 'pinterest-pins.ts'), 'utf8');
const pinFiles = new Set(
  [...pinsFileContent.matchAll(/"([^"]+\.jpg)"/g)].map(m => m[1])
);

console.log('Total pin files in TS set:', pinFiles.size);

let missingImages = 0;
let pinCount = 0;
let etsyImageCount = 0;

products.forEach(p => {
  const hasPin = pinFiles.has(`${p.slug}.jpg`);
  const rawImage = (p.images && p.images[0]) ? p.images[0] : '';

  if (!rawImage && !hasPin) {
    console.error(`[NO IMAGE AT ALL] ${p.id}: ${p.slug}`);
    missingImages++;
  }

  if (hasPin) {
    const pinPath = path.join(ROOT, 'public', 'pinterest-images', `${p.slug}.jpg`);
    if (!fs.existsSync(pinPath)) {
      console.warn(`[PIN FILE IN SET BUT MISSING ON DISK] ${p.slug}.jpg`);
    } else {
      pinCount++;
    }
  } else {
    etsyImageCount++;
  }
});

console.log(`\nAudit result:`);
console.log(`Products with static pin image on disk: ${pinCount}`);
console.log(`Products falling back to Etsy image: ${etsyImageCount}`);
console.log(`Products missing images: ${missingImages}`);
