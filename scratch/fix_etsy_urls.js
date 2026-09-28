const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'etsy_products.json'), 'utf8'));

// Products removed from Etsy - clear their etsy_url so "Also Available on Etsy" button is hidden
// These were identified in the sync: not in CSV anymore
const removedFromEtsy = [
  'etsy-199', // Mahjong tiles
  'etsy-18',  // Costco Font SVG
  'etsy-180', // Sauna
  'etsy-104', // Mahjong tiles 2
  'etsy-17',  // 13FT Windmill duplicate
  'etsy-105', // Mahjong hand tracker
  'etsy-119', // Mahjong SVG
  'etsy-122', // Mahjong SVG 2
  'etsy-200', // Costco Halloween
  'etsy-59',  // Costco New Year
  'etsy-202', // Costco Halloween 2
  'etsy-60',  // Costco party signs
  'etsy-61',  // Costco employee
];

// Fix etsy URLs from CSV - the two unmatched CSV rows are updated versions of existing listings
// CSV: "DIY 13 FT Big Wooden Windmill Head Plans, Western Farmhouse Garden Decor" => etsy-1 (DIY 13 FT Windmill Plans)
// CSV: "DIY Modern Outdoor Sauna Plans PDF | Backyard Blueprint With Window & Shower Porch" => etsy-180

// Also clean up dirty URLs (etsy-82, etsy-83 have tracking params)
const dirtyUrls = {
  'etsy-82': 'https://www.etsy.com/listing/4495651856/diy-wardrobe-plans-montessori-kids',
  'etsy-83': 'https://www.etsy.com/listing/4495514351/corner-bookshelf-plans-pdf-modern',
};

let removedCount = 0;
let urlFixCount = 0;

const updated = products.map(p => {
  const result = { ...p };

  // Clear etsy_url for removed listings
  if (removedFromEtsy.includes(p.id)) {
    result.etsy_url = '';
    result.etsyUrl = '';
    removedCount++;
  }

  // Clean dirty URLs
  if (dirtyUrls[p.id]) {
    result.etsy_url = dirtyUrls[p.id];
    result.etsyUrl = dirtyUrls[p.id];
    urlFixCount++;
  }

  return result;
});

fs.writeFileSync(path.join(ROOT, 'data', 'etsy_products.json'), JSON.stringify(updated, null, 2), 'utf8');

console.log(`Cleared etsy_url for ${removedCount} removed Etsy listings`);
console.log(`Cleaned up ${urlFixCount} dirty URLs with tracking params`);
console.log('✅ Done!');
