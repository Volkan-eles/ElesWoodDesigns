const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const xml = fs.readFileSync(path.join(ROOT, 'public', 'feed.xml'), 'utf8');

// Parse items using regex
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
let count = 0;
const items = [];

while ((match = itemRegex.exec(xml)) !== null) {
  count++;
  const content = match[1];
  const getId = (content.match(/<g:id>(.*?)<\/g:id>/) || [])[1] || '';
  const getTitle = (content.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const getLink = (content.match(/<g:link>(.*?)<\/g:link>/) || [])[1] || '';
  const getImage = (content.match(/<g:image_link>(.*?)<\/g:image_link>/) || [])[1] || '';
  const getPrice = (content.match(/<g:price>(.*?)<\/g:price>/) || [])[1] || '';
  const getSalePrice = (content.match(/<g:sale_price>(.*?)<\/g:sale_price>/) || [])[1] || '';
  const getAvailability = (content.match(/<g:availability>(.*?)<\/g:availability>/) || [])[1] || '';
  const getDesc = (content.match(/<description>(.*?)<\/description>/) || [])[1] || '';
  
  items.push({
    index: count,
    id: getId,
    title: getTitle,
    link: getLink,
    image: getImage,
    price: getPrice,
    salePrice: getSalePrice,
    availability: getAvailability,
    descLen: getDesc.length,
    titleLen: getTitle.length
  });
}

console.log(`Total items found in feed.xml: ${count}`);

const ids = new Set();
const dupes = [];
const issues = [];

items.forEach(it => {
  if (ids.has(it.id)) dupes.push(it.id);
  ids.add(it.id);

  if (!it.id) issues.push(`Item ${it.index}: Missing ID`);
  if (!it.title) issues.push(`Item ${it.index}: Missing title`);
  if (it.titleLen > 100) issues.push(`Item ${it.index} (${it.id}): Title > 100 chars (${it.titleLen} chars): "${it.title.slice(0, 50)}..."`);
  if (!it.link || !it.link.startsWith('http')) issues.push(`Item ${it.index}: Invalid link: ${it.link}`);
  if (!it.image || !it.image.startsWith('http')) issues.push(`Item ${it.index}: Invalid image: ${it.image}`);
  if (!it.price) issues.push(`Item ${it.index}: Missing price`);
  if (!it.availability) issues.push(`Item ${it.index}: Missing availability`);
});

console.log(`Duplicate IDs: ${dupes.length}`);
if (dupes.length) console.log(dupes);

console.log(`Issues found: ${issues.length}`);
issues.forEach(iss => console.log('  ⚠️ ' + iss));
