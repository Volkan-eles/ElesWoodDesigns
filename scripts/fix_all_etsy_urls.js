/**
 * fix_all_etsy_urls.js — Complete authoritative mapping from Etsy shop
 */
const fs = require('fs');
const path = require('path');
const JSON_PATH = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Complete Etsy shop listing: ID → title (verified by browsing all 3 pages)
const etsyShop = {
  '4375787443': 'Portable Charcuterie Cart DIY Plans: Folding Bar, Coffee, Vendor Cart',
  '4494721445': 'Modern Firewood Shed Plan | 8x10 Lean-To Wood Storage PDF (2 Cord Capacity)',
  '4494695588': 'DIY Picnic Table Plans | Outdoor Table with Backrest, Umbrella Hole',
  '4490601202': 'DIY Bookshelf Plans | Modern Bookcase Woodworking Blueprint',
  '4491054968': 'DIY Arbor Swing Plans | Pergola Roof A-Frame Freestanding Garden',
  '4486927175': 'DIY Pergola Swing Chair Plans | Free Standing Arbor Swing Frame',
  '4491615123': 'Kids Mud Kitchen Plans | DIY Wooden Outdoor Play Station Blueprint',
  '4490612122': 'DIY Full Size Loft Bed Plans | Built-In Stair Shelves & Storage',
  '4472221930': 'DIY Chaise Lounge Plans: Outdoor Pool Lounger, Adjustable Patio Sunbed',
  '4494429592': 'DIY Storage Bench Plans | Modern Wooden Chest Blueprint',
  '4491082737': 'DIY Planter Box Plans | Zero-Waste Cedar Fence Picket Design',
  '4375495325': 'DIY Collapsible Charcuterie Cart Plans: Mobile Bar Cart',
  '4462561503': 'DIY Queen Murphy Bed with Desk Plans | Horizontal Wall Bed',
  '4494247378': '3-Tier Wooden Plant Stand Plan | DIY Ladder Shelf Blueprint',
  '4490072169': 'DIY Rotating Shoe Rack Plans | Spinning Shoe Carousel & Tower',
  '4494235412': '3-Tier Farmhouse Planter Stand Plans | DIY Woodworking Blueprint',
  '4491583951': 'Folding Adirondack Chair Plans | Classic Outdoor Woodworking',
  '4494192465': 'L Shaped Corner Bench Plans | Built-In Planter Box Seating',
  '4377218039': 'DIY Farmstand Plans: Roadside Produce, Flower, and Bakery Stand',
  '4493928541': 'Tiered Planter Box Plans | 2-Level Raised Garden Bed Woodworking Blueprint',
  '4493892575': 'Tiered Plant Stand Plans | DIY Outdoor Wooden Garden Shelf',
  '4491071176': 'Arbor Swing Plans | Pergola Roof, A-Frame Freestanding',
  '4472276699': 'DIY Farmstand Plans | Mobile Market Stall Woodworking Build Guide',
  '4367275115': 'DIY Mobile Bar Cart Plans PDF: Collapsible Serving Cart Project',
  '4463014207': 'Treehouse Plans PDF, DIY Tree House Plans, Kids Playhouse Plans',
  '4461302426': 'Two Seat Bench with Table DIY Plans – Outdoor Patio Woodworking PDF',
  '4484122950': 'DIY Farmstand Plans PDF | Portable Roadside Stand for Produce, Eggs, Flowers',
  '4469210639': 'DIY Mobile Bar Cart Plans | Foldable Serving Station',
  '4379794366': 'DIY 13 FT Wooden Windmill Plans: Rustic Farmhouse Yard Decor',
  '4352466955': 'Customizable Costco Font SVG Pack: Birthday, Welcome, Signature Designs',
  '4487620243': 'DIY Mobile Workbench Plans PDF, Extra Long Garage Workstation',
  '4489524870': 'DIY Outdoor Kitchen Plans | Grill Station Bar & Sink Cabinet',
  '4487420597': 'Rustic 3 Tier Wooden Plant Stand Plans, A-Frame Garden Shelf',
  '4472225250': 'DIY Mobile Bar Plans: Outdoor Patio Beverage Station, Bar on Wheels',
  '4471950351': 'DIY Bar Stool Plans: Wooden Counter Height Stool',
  '4487526543': 'DIY Outdoor Ping Pong Table Plans | Foldable Wooden Table Tennis',
  '4490120003': 'DIY Lift Top Coffee Table Plans | Mid-Century Modern Storage',
  '4367248406': 'DIY Mobile Bar Cart Plan: Foldable Beverage & Food Cart',
  '4377936723': 'DIY Farm Stand Plans: Portable Market Cart',
  '4377932628': 'DIY Farmstand Plans: Portable Roadside Market Cart',
  '4489568684': 'Custom Watercolor Portrait from Photo, Family Gift, Mothers Day Keepsake',
  '4472269006': 'DIY Potting Bench Plans with Storage | Garden Workbench Blueprint',
  '4470278765': '5-Tier Garden Planter Plans – Wooden Raised Vegetable Planter',
  '4488913068': 'DIY Lean-To Greenhouse Plans | Wood Patio Garden Glasshouse Blueprint',
  '4372709098': 'Modern Mailbox Stand Plans | DIY Wooden Post Blueprint',
  '4487753775': 'DIY Garden Pergola Plans | 10x12 Freestanding Arbor',
  '4472103774': 'DIY Playhouse Plans: 2-Story Elevated Kids Playhouse with Balcony',
  '4487332329': 'DIY Wooden Playhouse Plans with Slide and Swings | Outdoor Kids Playset',
  '4487257877': 'DIY Outdoor Lounge Chair Plans | Adirondack Garden Chair',
  '4463035923': 'Twin Loft Bed Plans with Stairs & Desk | Space Saving High Sleeper Frame',
  '4469264015': 'DIY Mobile Food Cart Plans | Folding Vendor, Coffee, Wedding Bar Build',
  '4377578931': 'DIY Mobile Coffee Cart Plans: Collapsible Vendor Bar Blueprint',
  '4471895354': 'DIY Murphy Desk Plans: Wall Mounted Fold Down Table with Storage',
  '4378150447': 'DIY Workbench Plans with Drawers & Pegboard | Garage Workshop',
  '4409731864': 'Custom Watercolour Portrait From Photo | Mother Gift Personalized Mom Wall Art',
  '4471814434': 'DIY Raised Chicken Coop Plans: Backyard Hen House for 6-8 Chickens',
  '4380408404': 'Modern Firewood Shed Plan | 8x10 Lean-To Wood Storage PDF Download',
  '4377977620': 'DIY Modern Wood & Metal Fence Plan: Beginner-Friendly',
  '4471846483': 'DIY S-Shaped Floating Shelf Plans: Modern Woodworking Book Shelf',
  '4472262068': 'DIY Wooden Floating Shelf Plans: Modern Geometric Shelf',
  '4472252157': 'DIY Outdoor Bench Plans: Modern Backless Garden & Deck Seating',
  '4470474973': 'Heavy Duty Workbench Plans with Tool Storage',
  '4400838472': 'Vintage Christmas Art | 100+ Winter Frame TV Designs',
  '4400536294': 'Vintage Christmas Prints Bundle | 100+ Holiday Wall Art',
  '4398107797': 'Costco New Year Party Printables | Editable Food Court Decor',
  '4392803241': 'Editable Costco Party Signs | Canva Price Tags',
  '4396494290': 'Costco Employee of the Month Sign, Photo Booth Prop',
  '4392635304': 'Costco Halloween Trunk or Treat Decor: Food Court Signs',
  '4377939039': 'DIY Farm Stand Plans: Roadside Egg, Plant, Flower Cart',
  '4376012845': 'DIY Floating TV Console Plan: Wall-Mount Media Shelf',
  '4463022172': 'Wall Mounted Folding Desk Plans | Space Saving Wooden Workstation',
  '4461520558': 'Modern Outdoor Sauna Plans | 4 Person DIY Cabin Blueprint',
  '4440362308': 'Custom Pencil Sketch Portrait – Family, Couple, Pet Art',
  '4380558646': 'Modern Storage Bench Plan: DIY Wooden Chest',
  '4379214236': 'DIY Modern Dog House Plans: Insulated Large Dog Kennel',
  '4443614124': 'Custom Memorial Portrait – Add Deceased Loved One to Photo',
  '4440354589': 'Custom Couple Portrait – Romantic Pencil Sketch',
  '4439950228': 'Custom Memorial Portrait From Photos | Combine Loved Ones',
  '4377252223': 'DIY Foldable Checkout Stand Plans: Portable Coffee Cart, Vendor Kiosk',
  '4494192465': 'L Shaped Corner Bench Plans | Built-In Planter Box Seating',
  '4380408404': '8x10 Firewood Shed Plans | DIY Sloped Roof',
};

// Manual authoritative mapping: productId → listingId
// Based on name matching between JSON products and Etsy shop
const authoritative = {
  'etsy-1':  '4493928541',
  'etsy-2':  '4493892575',
  'etsy-3':  '4491082737',
  'etsy-4':  '4491071176',
  'etsy-5':  '4491615123',
  'etsy-6':  '4375495325',
  'etsy-7':  '4472276699',
  'etsy-8':  '4367275115',
  'etsy-9':  '4484122950',
  'etsy-10': '4463014207',
  'etsy-11': '4375787443',
  'etsy-12': '4461302426',
  'etsy-13': '4377218039',
  'etsy-14': '4377932628',
  'etsy-15': '4469210639',
  'etsy-16': '4489524870',
  'etsy-17': '4379794366',
  'etsy-18': '4352466955',
  'etsy-19': '4487620243',
  'etsy-20': '4462561503',
  'etsy-21': '4486927175',
  'etsy-22': '4490612122',
  'etsy-23': '4472221930',
  'etsy-24': '4487257877',
  'etsy-25': '4487420597',
  'etsy-26': '4472225250',
  'etsy-27': '4471950351',
  'etsy-28': '4487526543',
  'etsy-29': '4490120003',
  'etsy-30': '4367248406',
  'etsy-31': '4377936723',
  'etsy-32': '4377939039',
  'etsy-33': '4488913068',
  'etsy-34': '4472269006',
  'etsy-35': '4470278765',
  'etsy-36': '4372709098',
  'etsy-37': '4487753775',
  'etsy-38': '4472103774',
  'etsy-39': '4487332329',
  'etsy-40': '4487257877',
  'etsy-41': '4472103774',
  'etsy-42': '4490072169',
  'etsy-43': '4463035923',
  'etsy-44': '4469264015',
  'etsy-45': '4377578931',
  'etsy-46': '4471895354',
  'etsy-47': '4378150447',
  'etsy-48': '4470474973',
  'etsy-49': '4471814434',
  'etsy-50': '4471814434',
  'etsy-51': '4377977620',
  'etsy-52': '4471846483',
  'etsy-53': '4471846483',
  'etsy-54': '4472262068',
  'etsy-55': '4472252157',
  'etsy-56': '4400838472',
  'etsy-57': '4400536294',
  'etsy-58': '4398107797',
  'etsy-59': '4392803241',
  'etsy-60': '4396494290',
  'etsy-61': '4392635304',
  'etsy-62': '4489568684',
  'etsy-63': '4409731864',
  'etsy-64': '4376012845',
  'etsy-65': '4463022172',
  'etsy-66': '4461520558',
  'etsy-67': '4440362308',
  'etsy-68': '4380558646',
  'etsy-69': '4379214236',
  'etsy-70': '4443614124',
  'etsy-71': '4440354589',
  'etsy-72': '4439950228',
  'etsy-73': '4377252223',
  'etsy-74': '4494192465',
  'etsy-75': '4491583951',
  'etsy-76': '4494721445',
  'etsy-77': '4494695588',
  'etsy-78': '4494429592',
  'etsy-79': '4380408404',
};

// But we need to match by NAME since we don't know the exact order.
// Let me do name-based matching instead.
// Build a lookup: normalized Etsy title → listing ID
function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const etsyByNorm = {};
for (const [id, title] of Object.entries(etsyShop)) {
  etsyByNorm[normalize(title)] = id;
}

// Also build partial match index
const etsyEntries = Object.entries(etsyShop).map(([id, title]) => ({
  id, title, norm: normalize(title)
}));

function findBestMatch(productName) {
  const normName = normalize(productName);
  
  // Exact match first
  if (etsyByNorm[normName]) return etsyByNorm[normName];
  
  // Find best overlap
  let bestId = null, bestScore = 0;
  const nameWords = new Set(normName.split(' ').filter(w => w.length > 3));
  
  for (const entry of etsyEntries) {
    const entryWords = new Set(entry.norm.split(' ').filter(w => w.length > 3));
    let overlap = 0;
    for (const w of nameWords) {
      if (entryWords.has(w)) overlap++;
    }
    const score = overlap / Math.max(nameWords.size, entryWords.size);
    if (score > bestScore) {
      bestScore = score;
      bestId = entry.id;
    }
  }
  return bestScore >= 0.4 ? bestId : null;
}

// Track used IDs to detect duplicates
const usedIds = {};
let matched = 0, unmatched = [];

for (const product of products) {
  const matchedId = findBestMatch(product.name);
  if (matchedId) {
    const newUrl = `https://www.etsy.com/listing/${matchedId}/`;
    if (product.etsy_url !== newUrl) {
      console.log(`${product.id}: "${product.name.slice(0,50)}" → ${matchedId}`);
    }
    product.etsy_url = newUrl;
    usedIds[matchedId] = (usedIds[matchedId] || 0) + 1;
    matched++;
  } else {
    unmatched.push(`${product.id}: ${product.name.slice(0,50)}`);
  }
}

console.log(`\nMatched: ${matched}/79`);
if (unmatched.length) {
  console.log('UNMATCHED:');
  unmatched.forEach(u => console.log(' -', u));
}

const dups = Object.entries(usedIds).filter(([,c]) => c > 1);
if (dups.length) {
  console.log('\nDUPLICATE IDs after matching:');
  dups.forEach(([id, count]) => console.log(` ${id} used ${count}x`));
}

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log('\n✅ etsy_products.json saved.');
