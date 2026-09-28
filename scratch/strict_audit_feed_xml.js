const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const xml = fs.readFileSync(path.join(ROOT, 'public', 'feed.xml'), 'utf8');

const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
let idx = 0;
const errors = [];
const warnings = [];

while ((match = itemRegex.exec(xml)) !== null) {
  idx++;
  const item = match[1];

  const getTag = (tag) => {
    const m = item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    return m ? m[1].trim() : '';
  };

  const id = getTag('g:id');
  const title = getTag('title');
  const link = getTag('link');
  const gLink = getTag('g:link');
  const desc = getTag('description');
  const img = getTag('g:image_link');
  const price = getTag('g:price');
  const salePrice = getTag('g:sale_price');
  const avail = getTag('g:availability');
  const brand = getTag('g:brand');
  const gpc = getTag('g:google_product_category');

  // Check 1: ID
  if (!id) errors.push(`[Item ${idx}] Missing g:id`);
  if (id.length > 100) errors.push(`[Item ${idx} ${id}] ID length > 100: ${id.length}`);
  if (/\s/.test(id)) errors.push(`[Item ${idx} ${id}] ID contains whitespace`);

  // Check 2: Title
  if (!title) errors.push(`[Item ${idx} ${id}] Missing title`);
  if (title.length > 100) errors.push(`[Item ${idx} ${id}] Title > 100 chars (${title.length}): "${title}"`);

  // Check 3: Link
  if (!link || !link.startsWith('https://')) errors.push(`[Item ${idx} ${id}] Invalid link: ${link}`);
  if (link !== gLink) warnings.push(`[Item ${idx} ${id}] link != g:link`);

  // Check 4: Image Link
  if (!img || !img.startsWith('https://')) errors.push(`[Item ${idx} ${id}] Invalid image_link: ${img}`);

  // Check 5: Price & Sale Price
  if (!price.endsWith(' USD')) errors.push(`[Item ${idx} ${id}] Invalid price: ${price}`);
  if (!salePrice.endsWith(' USD')) errors.push(`[Item ${idx} ${id}] Invalid sale_price: ${salePrice}`);
  const pVal = parseFloat(price);
  const spVal = parseFloat(salePrice);
  if (isNaN(pVal) || isNaN(spVal)) errors.push(`[Item ${idx} ${id}] NaN price`);
  if (spVal >= pVal) warnings.push(`[Item ${idx} ${id}] sale_price (${spVal}) >= price (${pVal})`);

  // Check 6: Availability
  if (!['in stock', 'out of stock', 'preorder'].includes(avail)) {
    errors.push(`[Item ${idx} ${id}] Invalid availability: ${avail}`);
  }

  // Check 7: Description
  if (!desc) errors.push(`[Item ${idx} ${id}] Missing description`);
  if (desc.length > 5000) errors.push(`[Item ${idx} ${id}] Description > 5000 chars: ${desc.length}`);

  // Check 8: Media tags
  const enclosure = item.match(/<enclosure url="(.*?)"/);
  if (!enclosure || !enclosure[1].startsWith('https://')) {
    warnings.push(`[Item ${idx} ${id}] Bad or missing enclosure URL`);
  }
}

console.log(`Audited ${idx} items in public/feed.xml.`);
console.log(`Errors: ${errors.length}`);
errors.forEach(e => console.log('  ❌ ' + e));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach(w => console.log('  ⚠️ ' + w));
