const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const gFeed = fs.readFileSync(path.join(ROOT, 'public', 'google-feed.xml'), 'utf8');
const pFeed = fs.readFileSync(path.join(ROOT, 'public', 'feed.xml'), 'utf8');

console.log('--- GOOGLE FEED CHECK ---');
console.log('Includes <g:country>US</g:country>?', gFeed.includes('<g:country>US</g:country>'));
console.log('Includes <g:country>GB</g:country>?', gFeed.includes('<g:country>GB</g:country>'));
console.log('Includes <g:country>DE</g:country>?', gFeed.includes('<g:country>DE</g:country>'));
console.log('Item count in Google feed:', (gFeed.match(/<item>/g) || []).length);

console.log('\n--- PINTEREST FEED CHECK ---');
console.log('Item count in Pinterest feed:', (pFeed.match(/<item>/g) || []).length);
console.log('Enclosure count:', (pFeed.match(/<enclosure /g) || []).length);
console.log('Media:content count:', (pFeed.match(/<media:content /g) || []).length);

// Check greenhouse title
console.log('Has updated Greenhouse title?', pFeed.includes('Lean-To Greenhouse Plans PDF | DIY Wood Patio Glasshouse Blueprint'));
