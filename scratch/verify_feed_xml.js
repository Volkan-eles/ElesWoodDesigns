const fs = require('fs');
const path = require('path');

const feedXml = fs.readFileSync(path.join(__dirname, '../public/feed.xml'), 'utf8');

console.log('--- FEED.XML VERIFICATION ---');
console.log('Has xmlns:media?', feedXml.includes('xmlns:media="http://search.yahoo.com/mrss/"'));
console.log('Count of <item>:', (feedXml.match(/<item>/g) || []).length);
console.log('Count of <enclosure>:', (feedXml.match(/<enclosure /g) || []).length);
console.log('Count of <media:content>:', (feedXml.match(/<media:content /g) || []).length);
console.log('Count of <g:image_link>:', (feedXml.match(/<g:image_link>/g) || []).length);

// Check etsy-204 in feed
const hasNewTitle = feedXml.includes('Firewood Shed Plans PDF | Modern Slatted Woodshed 2 Cord Capacity');
console.log('Has updated Firewood Shed title?', hasNewTitle);
const hasNewSlug = feedXml.includes('firewood-shed-plans-pdf-modern-slatted-woodshed-2-cord-capacity');
console.log('Has updated Firewood Shed slug?', hasNewSlug);
console.log('Has $2.10 sale price for 204?', feedXml.includes('2.10 USD'));
