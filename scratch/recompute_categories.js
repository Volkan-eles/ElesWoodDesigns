
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

const mapCategory = (p) => {
    const s = p.slug.toLowerCase();
    
    // Digital / Art
    if (s.includes('portrait') || s.includes('art') || s.includes('svg') || s.includes('costco') || s.includes('sketch') || s.includes('digital-download')) {
        return 'Digital';
    }
    
    // Kids
    if (s.includes('kids') || s.includes('playhouse') || s.includes('treehouse') || s.includes('mud-kitchen') || s.includes('playground') || s.includes('clubhouse') || s.includes('tree-house')) {
        return 'Kids';
    }

    // Bedroom
    if (s.includes('loft-bed') || s.includes('murphy-bed') || s.includes('wall-bed')) {
        return 'Bedroom';
    }

    // Garden / Outdoor
    if (s.includes('farmstand') || s.includes('farm-stand') || s.includes('market-cart') || s.includes('greenhouse') || s.includes('pergola') || s.includes('arbor') || s.includes('chicken-coop') || s.includes('firewood-shed') || s.includes('woodshed') || s.includes('mailbox') || s.includes('fence') || s.includes('sauna')) {
        return 'Garden';
    }

    // Kitchen
    if (s.includes('bar-cart') || s.includes('mobile-bar') || s.includes('food-cart') || s.includes('coffee-cart') || s.includes('beverage-station') || s.includes('checkout-stand')) {
        return 'Kitchen';
    }

    // Workshop
    if (s.includes('workbench') || s.includes('workstation') || s.includes('shop-table') || s.includes('potting-bench')) {
        return 'Workshop';
    }

    // Default to existing or Furniture
    if (p.category === 'Bedroom') return 'Bedroom'; // Preserve if already Bedroom
    return p.category || 'Furniture';
};

const updatedProducts = products.map(p => ({
    ...p,
    category: mapCategory(p)
}));

fs.writeFileSync('data/etsy_products.json', JSON.stringify(updatedProducts, null, 2), 'utf8');
console.log('Successfully re-categorized products in JSON.');

// Print summary
const counts = {};
updatedProducts.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
console.log('Category Counts:', counts);
