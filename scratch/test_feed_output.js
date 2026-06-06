const products = require('../data/etsy_products.json');
const fs = require('fs');

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\]\]>/g, ']] ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const items = products.map((product) => {
    const rawDescription = product.longDescription || product.description || product.name;
    const description = cleanText(rawDescription).slice(0, 9000);
    return `
    <item>
      <title>${escapeXml(product.name)}</title>
      <description>${escapeXml(description)}</description>
      <g:description>${escapeXml(description)}</g:description>
    </item>`;
}).join('');

fs.writeFileSync('scratch/test_feed_output.xml', items);
console.log('Written to scratch/test_feed_output.xml');
