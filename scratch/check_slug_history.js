const fs = require('fs');
const cp = require('child_process');

const log = cp.execSync('git log --format="%H" data/etsy_products.json', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
console.log(`Found ${log.length} commits touching data/etsy_products.json`);

const current = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));
const currentSlugs = new Map(current.map(p => [p.id, p.slug]));

const slugHistory = new Map();
current.forEach(p => slugHistory.set(p.id, new Set([p.slug])));

for (let i = 0; i < log.length; i++) {
  const hash = log[i];
  try {
    const content = cp.execSync(`git show ${hash}:data/etsy_products.json`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    const prev = JSON.parse(content);
    prev.forEach(p => {
      if (!p.id || !p.slug) return;
      if (!slugHistory.has(p.id)) slugHistory.set(p.id, new Set());
      slugHistory.get(p.id).add(p.slug);
    });
  } catch (e) {}
}

const missingRedirects = [];
slugHistory.forEach((slugs, id) => {
  const curSlug = currentSlugs.get(id);
  slugs.forEach(oldSlug => {
    if (oldSlug && curSlug && oldSlug !== curSlug) {
      missingRedirects.push({ id, oldSlug, curSlug });
    }
  });
});

console.log('Total changed historical slugs across all commits:', missingRedirects.length);
missingRedirects.forEach(m => console.log(`  [${m.id}] ${m.oldSlug} -> ${m.curSlug}`));

// Check which of these are currently in next.config.ts
const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
const unhandled = missingRedirects.filter(m => !nextConfig.includes(m.oldSlug));
console.log('\nUnhandled old slugs that return 404 today:', unhandled.length);
unhandled.forEach(u => console.log(`  404 -> /products/${u.oldSlug}/ (should redirect to /products/${u.curSlug}/)`));
