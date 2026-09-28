const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/etsy_products.json'), 'utf8'));

console.log('=== PRODUCT INTEGRITY AUDIT ===');
console.log(`Total Products: ${products.length}`);

// 1. Check duplicate IDs
const idCounts = {};
products.forEach(p => { idCounts[p.id] = (idCounts[p.id] || 0) + 1; });
const dupIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
console.log('Duplicate Product IDs:', dupIds.length ? dupIds : 'None (OK)');

// 2. Check duplicate Slugs
const slugCounts = {};
products.forEach(p => { slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1; });
const dupSlugs = Object.keys(slugCounts).filter(s => slugCounts[s] > 1);
console.log('Duplicate Slugs:', dupSlugs.length ? dupSlugs : 'None (OK)');

// 3. Check invalid Slugs
const invalidSlugs = products.filter(p => !p.slug || /[^a-z0-9-]/.test(p.slug));
console.log('Invalid Slugs (non-ascii/special chars):', invalidSlugs.length ? invalidSlugs.map(p => ({ id: p.id, slug: p.slug })) : 'None (OK)');

// 4. Check duplicate Titles
const titleCounts = {};
products.forEach(p => {
  const norm = p.name.trim().toLowerCase();
  titleCounts[norm] = (titleCounts[norm] || 0) + 1;
});
const dupTitles = Object.keys(titleCounts).filter(t => titleCounts[t] > 1);
console.log('Duplicate Titles:', dupTitles.length ? dupTitles : 'None (OK)');

// 5. Check Etsy URLs
const missingEtsyUrls = products.filter(p => !p.etsy_url || !p.etsy_url.startsWith('https://www.etsy.com/'));
console.log('Missing / Invalid Etsy URLs:', missingEtsyUrls.length ? missingEtsyUrls.map(p => ({ id: p.id, name: p.name.slice(0, 30) })) : 'None (OK)');

// 6. Check duplicate Etsy Listing IDs
const listingIdMap = {};
products.forEach(p => {
  const m = (p.etsy_url || '').match(/listing\/(\d+)/);
  if (m) {
    const lid = m[1];
    if (!listingIdMap[lid]) listingIdMap[lid] = [];
    listingIdMap[lid].push(p.id);
  }
});
const dupListingIds = Object.keys(listingIdMap).filter(lid => listingIdMap[lid].length > 1);
console.log('Duplicate Etsy Listing IDs:', dupListingIds.length ? dupListingIds.map(lid => ({ listingId: lid, productIds: listingIdMap[lid] })) : 'None (OK)');

// 7. Check for missing essential fields
const badFields = products.filter(p => !p.name || !p.category || !p.price || !p.image || !p.images || p.images.length === 0);
console.log('Missing Essential Fields (name, price, image):', badFields.length ? badFields.map(p => p.id) : 'None (OK)');

// 8. Check Title encoding issues (e.g. replacement chars)
const suspiciousTitles = products.filter(p => /\ufffd/.test(p.name));
console.log('Suspicious characters in Titles (\\ufffd):', suspiciousTitles.length ? suspiciousTitles.map(p => ({ id: p.id, title: p.name })) : 'None (OK)');

// 9. Inspect Etsy URL match with product names
console.log('\n=== Checking Etsy URL / Product Name Alignment ===');
let mismatchCount = 0;
products.forEach(p => {
  const m = (p.etsy_url || '').match(/listing\/\d+\/([a-z0-9-]+)/);
  if (m) {
    const urlSlug = m[1];
    const pSlug = p.slug;
    // Check if there is high divergence
    const urlWords = urlSlug.split('-').filter(w => w.length > 2);
    const pWords = pSlug.split('-').filter(w => w.length > 2);
    const shared = urlWords.filter(w => pWords.includes(w));
    if (shared.length < 2 && urlWords.length > 2) {
      console.log(`[Possible Mismatch] ${p.id}:`);
      console.log(`  Product Slug: ${p.slug}`);
      console.log(`  Etsy URL:     ${p.etsy_url}`);
      mismatchCount++;
    }
  }
});
if (mismatchCount === 0) console.log('All Etsy URLs align well with product slugs / titles (OK)');

// 10. Check sitemap and feed URLs
console.log('\n=== Checking URL format in Sitemaps / Feeds ===');
const baseUrl = 'https://eleswooddesigns.com';
const urls = products.map(p => `${baseUrl}/products/${p.slug}/`);
const dupUrls = urls.filter((u, i) => urls.indexOf(u) !== i);
console.log('Duplicate site URLs:', dupUrls.length ? dupUrls : 'None (OK)');
console.log(`Total Valid Product URLs: ${urls.length}`);

// 11. Last 4 added products check
console.log('\n=== Last 4 Products (Added Recently) ===');
products.slice(-4).forEach(p => {
  console.log(`ID: ${p.id}`);
  console.log(`Name: ${p.name}`);
  console.log(`Slug: ${p.slug}`);
  console.log(`URL: ${baseUrl}/products/${p.slug}/`);
  console.log(`Etsy URL: ${p.etsy_url}`);
  console.log(`Category: ${p.category}`);
  console.log(`Price: $${p.price} (Orig: $${p.originalPrice})`);
  console.log('---');
});
