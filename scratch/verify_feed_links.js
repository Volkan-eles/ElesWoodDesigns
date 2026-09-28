const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const xml = fs.readFileSync(path.join(ROOT, 'public', 'feed.xml'), 'utf8');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

const productSlugs = new Set(products.map(p => p.slug));

const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
let count = 0;
const missingSlugs = [];

while ((match = itemRegex.exec(xml)) !== null) {
  count++;
  const item = match[1];
  const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
  const m = link.match(/\/products\/([^\/]+)\/?/);
  if (m) {
    const slug = m[1];
    if (!productSlugs.has(slug)) {
      missingSlugs.push({ link, slug });
    }
  } else {
    missingSlugs.push({ link, slug: 'NO_MATCH' });
  }
}

console.log(`Audited ${count} links in feed.xml.`);
console.log(`Missing/unmatched slugs in feed.xml: ${missingSlugs.length}`);
missingSlugs.forEach(s => console.log('  ⚠️ ' + s.slug + ' -> ' + s.link));
