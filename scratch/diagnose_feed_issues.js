
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

function escapeXml(str) {
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
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('--- Diagnostic Start ---');

products.forEach(product => {
    const title = cleanText(product.name).slice(0, 100);
    const salePrice = product.price;
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
    
    let issue = '';
    if (title.length < 5) issue += 'Title too short. ';
    if (salePrice <= 0) issue += 'Price is 0 or less. ';
    if (!primaryImage) issue += 'Missing image. ';
    if (primaryImage && !primaryImage.startsWith('http')) issue += 'Invalid image URL. ';
    
    // Check for garbled characters in title/description
    if (title.includes('?')) {
        // Many products might have '?' if it was a real question mark, but '?"' is suspicious
    }
    if (product.name.includes('?"')) {
        issue += 'Suspected encoding corruption (?") in name. ';
    }
    if (product.description && product.description.includes('?"')) {
        issue += 'Suspected encoding corruption (?") in description. ';
    }

    if (issue) {
        console.log(`SLUG: ${product.slug}`);
        console.log(`ISSUES: ${issue}`);
        console.log('---');
    }
});
