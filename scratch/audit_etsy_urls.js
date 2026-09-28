// Audit all etsy_url fields:
// - Detect clearly fake/placeholder IDs (e.g. 4540000001, 4540000002, etc.)
// - Detect URLs missing slug text (bare /listing/ID/ only)
// - Detect empty etsy_urls
// - Detect duplicate etsy_urls

const fs = require('fs');
const path = require('path');
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'etsy_products.json'), 'utf8'));

// Placeholder IDs look like 4540000001, 4540000002... - sequential round numbers
function isPlaceholder(url) {
  if (!url) return false;
  const m = url.match(/listing\/(\d+)/);
  if (!m) return false;
  const id = m[1];
  // Check if it's a suspiciously round number (ends in multiple zeros)
  if (/0{4,}/.test(id)) return true; // e.g. 4540000001 has 4 zeros
  return false;
}

function hasBareUrl(url) {
  if (!url) return false;
  return /listing\/\d+\/$/.test(url); // ends with just /ID/
}

const placeholders = [];
const bare = [];
const empty = [];
const urlMap = new Map();
const dupes = [];

products.forEach(p => {
  const url = p.etsy_url || '';
  if (!url) {
    empty.push({ id: p.id, name: p.name });
    return;
  }
  if (isPlaceholder(url)) placeholders.push({ id: p.id, name: p.name, etsy_url: url });
  if (hasBareUrl(url)) bare.push({ id: p.id, name: p.name, etsy_url: url });
  
  // Track dupes
  if (urlMap.has(url)) {
    dupes.push({ a: urlMap.get(url), b: p.id, url });
  } else {
    urlMap.set(url, p.id);
  }
});

console.log('=== PLACEHOLDER ETSY URLs (fake listing IDs) ===');
placeholders.forEach(p => console.log(`[${p.id}] ${p.name}\n  ${p.etsy_url}`));
console.log(`\nTotal placeholders: ${placeholders.length}`);

console.log('\n=== BARE URLs (no slug text, just /listing/ID/) ===');
console.log('(These may or may not work but are non-descriptive)');
bare.forEach(p => console.log(`[${p.id}] ${p.name}\n  ${p.etsy_url}`));
console.log(`\nTotal bare: ${bare.length}`);

console.log('\n=== EMPTY etsy_url (Etsy button hidden — by design) ===');
empty.forEach(p => console.log(`[${p.id}] ${p.name}`));
console.log(`\nTotal empty: ${empty.length}`);

if (dupes.length > 0) {
  console.log('\n=== DUPLICATE Etsy URLs ===');
  dupes.forEach(d => console.log(`${d.a} and ${d.b} share: ${d.url}`));
}

console.log('\n=== ALL etsy_url AUDIT ===');
products.forEach(p => {
  const url = p.etsy_url || '';
  const flags = [];
  if (!url) flags.push('EMPTY');
  if (isPlaceholder(url)) flags.push('PLACEHOLDER');
  console.log(`[${p.id}] ${flags.length ? '⚠️ ' + flags.join(',') + ' |' : '✅'} ${p.name}`);
  if (url) console.log(`       ${url}`);
});
