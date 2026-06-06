/**
 * add_fifa_products.js
 * 
 * Adds 2 new FIFA World Cup 2026 products to etsy_products.json
 * and rebuilds the feeds.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase()));
const maxId = Math.max(...products.map(x => parseInt(x.id.replace('etsy-',''),10)).filter(n=>!isNaN(n)));

// Two new FIFA products to add
const newProducts = [
  {
    id: `etsy-${maxId + 1}`,
    slug: 'fifa-world-cup-2026-bracket-poster-group-stage-knockout-tournament-chart-printable-pdf',
    name: 'FIFA World Cup 2026 Bracket Poster | Group Stage & Knockout Tournament Chart | Printable PDF',
    category: 'Digital',
    price: 2.1,
    originalPrice: 7,
    rating: 0,
    reviewCount: 0,
    difficulty: 'Easy',
    estimatedTime: 'Instant',
    pages: 2,
    description: 'Track every match of FIFA World Cup 2026 with this printable bracket poster. Includes group stage tables and knockout bracket — print and fill in as the tournament unfolds.',
    longDescription: 'Track every match of FIFA World Cup 2026 with this detailed printable bracket poster. Includes all group stage tables and the full knockout round bracket from Round of 32 through to the Final. Print it out and fill in results as the tournament unfolds — perfect for offices, schools, and football fans at home.\n\nFeatures:\n• Group Stage tables for all groups\n• Full knockout bracket (Round of 32 → Final)\n• A4 & US Letter formats included\n• High-resolution PDF — print at home or at a local print shop\n• Instant digital download — no shipping required',
    features: ['Group Stage Tables', 'Knockout Bracket', 'A4 & US Letter', 'High Resolution PDF', 'Instant Download'],
    tags: ['world cup 2026', 'fifa bracket', 'tournament bracket', 'soccer bracket', 'football poster', 'printable bracket', 'world cup poster', 'knockout bracket', 'group stage', 'world cup tracker'],
    materials: ['Digital Download', 'PDF File', 'Instant Download'],
    image: 'https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_fullxfull.8145220913',
    thumbnail: 'https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_794xN.8145220913',
    images: ['https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_fullxfull.8145220913'],
    imagesThumbnails: ['https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_794xN.8145220913'],
    etsy_url: 'https://www.etsy.com/listing/4517674909/fifa-world-cup-2026-bracket-poster-group',
    bestseller: false,
    inStock: true,
    stockQuantity: 999,
    google_product_category: 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking',
  },
  {
    id: `etsy-${maxId + 2}`,
    slug: 'fifa-world-cup-2026-wall-chart-poster-printable-tournament-schedule-pdf',
    name: 'FIFA World Cup 2026 Wall Chart Poster | Printable Tournament Schedule & Results Tracker PDF',
    category: 'Digital',
    price: 2.1,
    originalPrice: 7,
    rating: 0,
    reviewCount: 0,
    difficulty: 'Easy',
    estimatedTime: 'Instant',
    pages: 2,
    description: 'Printable FIFA World Cup 2026 wall chart poster — track every game, group standings, and knockout results. Perfect for homes, offices, and fan zones. Instant PDF download.',
    longDescription: 'Celebrate FIFA World Cup 2026 with this stunning wall chart poster! Track every single match across the group stage and knockout rounds in style. Designed for football fans who want to follow all the action from the comfort of home, the office, or a fan zone.\n\nWhat\'s included:\n• Full match schedule with dates and kick-off times\n• Group stage standings tracker\n• Knockout round results chart (Round of 32 through Final)\n• A4 & US Letter format\n• High-resolution PDF — crisp at any print size\n• Instant digital download',
    features: ['Full Match Schedule', 'Group Standings Tracker', 'Knockout Results Chart', 'A4 & US Letter', 'Instant Download'],
    tags: ['world cup 2026', 'wall chart', 'tournament chart', 'soccer wall chart', 'football wall chart', 'world cup schedule', 'printable wall chart', 'world cup tracker', 'group stage', 'knockout rounds'],
    materials: ['Digital Download', 'PDF File', 'Instant Download'],
    image: 'https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_fullxfull.8145220913',
    thumbnail: 'https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_794xN.8145220913',
    images: ['https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_fullxfull.8145220913'],
    imagesThumbnails: ['https://i.etsystatic.com/53333782/r/il/a506a8/8145220913/il_794xN.8145220913'],
    etsy_url: 'https://www.etsy.com/listing/4517694674/fifa-world-cup-2026-wall-chart-poster',
    bestseller: false,
    inStock: true,
    stockQuantity: 999,
    google_product_category: 'Arts & Entertainment > Hobbies & Creative Arts > Crafts & Hobbies > Woodworking',
  },
];

// Filter out already-existing
const toAdd = newProducts.filter(p => !existingTitles.has(p.name.trim().toLowerCase()));

if (toAdd.length === 0) {
  console.log('All products already exist in the JSON. Nothing to add.');
  process.exit(0);
}

const updated = [...products, ...toAdd];
fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`✅ Added ${toAdd.length} new products:`);
toAdd.forEach(p => console.log(`  [${p.id}] ${p.name.slice(0,70)}`));
console.log(`Total products: ${products.length} → ${updated.length}`);
