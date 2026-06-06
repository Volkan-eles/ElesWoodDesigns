/**
 * update_products_v3.js
 * - Adds 2 new products from CSV (etsy-74, etsy-75)
 * - Updates price and stockQuantity for all products that match CSV entries
 * Run: node scratch/update_products_v3.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');

// ─── 2 NEW PRODUCTS ────────────────────────────────────────────────────────────

const newProducts = [
  {
    "id": "etsy-74",
    "slug": "3-tier-wooden-plant-stand-plan-diy-ladder-shelf-blueprint-pdf-download",
    "name": "3-Tier Wooden Plant Stand Plan | DIY Ladder Shelf Blueprint (PDF Download)",
    "category": "Garden",
    "price": 10.00,
    "originalPrice": 33.33,
    "rating": 0,
    "reviewCount": 0,
    "difficulty": "Easy",
    "estimatedTime": "Weekend",
    "pages": 15,
    "description": "Build a beautiful outdoor wood plant stand with this 3-tier tiered planter stand DIY plan. Perfect for front porch decor, patio styling, or garden display, this wooden ladder plant stand adds a charming farmhouse touch to any outdoor space.",
    "longDescription": "Build a beautiful outdoor wood plant stand with this 3-tier tiered planter stand DIY plan. Perfect for front porch decor, patio styling, or garden display, this wooden ladder plant stand adds a charming farmhouse touch to any outdoor space.\n\nThis woodworking plan is designed for both beginners and experienced DIYers who want to create a sturdy and stylish vertical planter stand. Use it to display flower pots, lanterns, or even a welcome sign for your entryway.\n\nDimensions:\nOverall Width: 18 inches\nOverall Depth: 15 1/2 inches\nOverall Height: 61 1/2 inches\n\nWhat's Included:\n- Step-by-step building instructions\n- Detailed material list\n- Precise cut list for minimal waste\n- Assembly tips and structural guidance\n- 3D visual illustrations\n\nPerfect For:\n- Front porch decor\n- Patio plant display\n- Garden styling\n- Farmhouse outdoor decoration\n- Entryway welcome setup\n\nThis tiered planter stand is a durable and cost-effective DIY project compared to store-bought alternatives. Its vertical 3-tier design maximizes space while creating a visually appealing plant display. Easily customize it with paint or stain to match your outdoor decor.\n\nImportant Note: This is a digital download. No physical product will be shipped. You will receive a printable PDF file instantly after purchase.",
    "features": [
      "outdoor_plant_stand",
      "plant_stand_plan",
      "wood_plant_stand",
      "tiered_planter",
      "ladder_plant_stand"
    ],
    "tags": [
      "outdoor_plant_stand",
      "plant_stand_plan",
      "wood_plant_stand",
      "tiered_planter",
      "ladder_plant_stand",
      "porch_planter",
      "welcome_planter",
      "farmhouse_planter",
      "garden_stand_plan",
      "plant_shelf_diy",
      "woodworking_plan",
      "digital_download",
      "printable_pdf"
    ],
    "materials": [
      "Digital Download",
      "PDF File",
      "Instant Download"
    ],
    "image": "https://i.etsystatic.com/53333782/r/il/442f8f/7949315202/il_fullxfull.7949315202_bq8x.jpg",
    "thumbnail": "https://i.etsystatic.com/53333782/r/il/442f8f/7949315202/il_794xN.7949315202_bq8x.jpg",
    "images": [
      "https://i.etsystatic.com/53333782/r/il/442f8f/7949315202/il_fullxfull.7949315202_bq8x.jpg",
      "https://i.etsystatic.com/53333782/r/il/9b6f8f/7949315206/il_fullxfull.7949315206_j6ov.jpg",
      "https://i.etsystatic.com/53333782/r/il/77a4f2/7997270527/il_fullxfull.7997270527_qgcb.jpg",
      "https://i.etsystatic.com/53333782/r/il/102c7b/7997270529/il_fullxfull.7997270529_jqdf.jpg",
      "https://i.etsystatic.com/53333782/r/il/dd2673/7997270533/il_fullxfull.7997270533_e4z2.jpg",
      "https://i.etsystatic.com/53333782/r/il/2a8722/7949315204/il_fullxfull.7949315204_8k5n.jpg"
    ],
    "imagesThumbnails": [
      "https://i.etsystatic.com/53333782/r/il/442f8f/7949315202/il_794xN.7949315202_bq8x.jpg",
      "https://i.etsystatic.com/53333782/r/il/9b6f8f/7949315206/il_794xN.7949315206_j6ov.jpg",
      "https://i.etsystatic.com/53333782/r/il/77a4f2/7997270527/il_794xN.7997270527_qgcb.jpg",
      "https://i.etsystatic.com/53333782/r/il/102c7b/7997270529/il_794xN.7997270529_jqdf.jpg",
      "https://i.etsystatic.com/53333782/r/il/dd2673/7997270533/il_794xN.7997270533_e4z2.jpg",
      "https://i.etsystatic.com/53333782/r/il/2a8722/7949315204/il_794xN.7949315204_8k5n.jpg"
    ],
    "etsy_url": "https://www.etsy.com/listing/4494247378/",
    "bestseller": false,
    "inStock": true,
    "stockQuantity": 2
  },
  {
    "id": "etsy-75",
    "slug": "3-tier-farmhouse-planter-stand-plans-diy-woodworking-blueprint-pdf-download",
    "name": "3-Tier Farmhouse Planter Stand Plans | DIY Woodworking Blueprint (PDF Download)",
    "category": "Garden",
    "price": 10.70,
    "originalPrice": 35.67,
    "rating": 0,
    "reviewCount": 0,
    "difficulty": "Easy",
    "estimatedTime": "Weekend",
    "pages": 15,
    "description": "Make your front porch unforgettable. This 3-Tier Farmhouse Planter Stand PDF gives you a complete woodworking blueprint for a tall, farmhouse-style stepped planter stand — the perfect curb appeal upgrade for any entryway, porch, or patio.",
    "longDescription": "Make your front porch unforgettable. This 3-Tier Farmhouse Planter Stand PDF gives you a complete woodworking blueprint for a tall, farmhouse-style stepped planter stand — the perfect curb appeal upgrade for any entryway, porch, or patio.\n\nStack your favorite seasonal flowers, trailing vines, lanterns, or a classic welcome sign across three staggered tiers of solid wood. This isn't a wobbly wire rack from a garden center — it's a sturdy, customizable Porch Planter Stand built to last outdoors and impress every guest who walks to your door.\n\nDimensions:\nOverall Width: 18 inches\nOverall Depth: 15 1/2 inches\nOverall Height: 61 1/2 inches\n\nWhat's Included:\n- Step-by-Step 3D Assembly Guide\n- Complete Material List\n- Precise Cut List\n- Assembly Tips\n\nPerfect For:\n- Homeowners wanting a Plant Stand Patio centerpiece\n- DIYers building a 3 Tier Wood Outdoor Planter on a budget\n- Anyone searching for Farmhouse Planter Stand designs with a full cut list\n- Gardeners wanting a Wood Garden Herb Tiered structure\n\nInstant Digital Download: Your PDF arrives immediately after purchase. No waiting, no shipping.\n\nPlease Note: This listing is for DIGITAL PLANS only. No physical stand, pots, signs, flowers, or lumber will be shipped.",
    "features": [
      "welcome_planter",
      "planter_stand_plans",
      "wood_plant_stand",
      "tall_planter_diy",
      "farmhouse_planter"
    ],
    "tags": [
      "welcome_planter",
      "planter_stand_plans",
      "wood_plant_stand",
      "tall_planter_diy",
      "welcome_sign_planter",
      "farmhouse_planter",
      "vertical_planter_diy",
      "porch_planter_stand",
      "stepped_planter",
      "ladder_shelf",
      "diy_plant_stand",
      "woodworking_plans",
      "outdoor_wood_decor"
    ],
    "materials": [
      "Digital Download",
      "PDF File",
      "Instant Download"
    ],
    "image": "https://i.etsystatic.com/53333782/r/il/84f5e1/7997196875/il_fullxfull.7997196875_52e3.jpg",
    "thumbnail": "https://i.etsystatic.com/53333782/r/il/84f5e1/7997196875/il_794xN.7997196875_52e3.jpg",
    "images": [
      "https://i.etsystatic.com/53333782/r/il/84f5e1/7997196875/il_fullxfull.7997196875_52e3.jpg",
      "https://i.etsystatic.com/53333782/r/il/4d7b8f/7949241426/il_fullxfull.7949241426_mpxf.jpg",
      "https://i.etsystatic.com/53333782/r/il/28f851/7997197207/il_fullxfull.7997197207_dty7.jpg",
      "https://i.etsystatic.com/53333782/r/il/da9136/7949241330/il_fullxfull.7949241330_g3b2.jpg",
      "https://i.etsystatic.com/53333782/r/il/0e4745/7949241410/il_fullxfull.7949241410_5p44.jpg",
      "https://i.etsystatic.com/53333782/r/il/2d4cf9/7997197227/il_fullxfull.7997197227_tkvb.jpg",
      "https://i.etsystatic.com/53333782/r/il/30a948/7997197231/il_fullxfull.7997197231_kbua.jpg"
    ],
    "imagesThumbnails": [
      "https://i.etsystatic.com/53333782/r/il/84f5e1/7997196875/il_794xN.7997196875_52e3.jpg",
      "https://i.etsystatic.com/53333782/r/il/4d7b8f/7949241426/il_794xN.7949241426_mpxf.jpg",
      "https://i.etsystatic.com/53333782/r/il/28f851/7997197207/il_794xN.7997197207_dty7.jpg",
      "https://i.etsystatic.com/53333782/r/il/da9136/7949241330/il_794xN.7949241330_g3b2.jpg",
      "https://i.etsystatic.com/53333782/r/il/0e4745/7949241410/il_794xN.7949241410_5p44.jpg",
      "https://i.etsystatic.com/53333782/r/il/2d4cf9/7997197227/il_794xN.7997197227_tkvb.jpg",
      "https://i.etsystatic.com/53333782/r/il/30a948/7997197231/il_794xN.7997197231_kbua.jpg"
    ],
    "etsy_url": "https://www.etsy.com/listing/4494235412/",
    "bestseller": false,
    "inStock": true,
    "stockQuantity": 2
  }
];

// ─── PRICE / STOCK UPDATES from CSV ────────────────────────────────────────────
// Map: slug-fragment → { price, stockQuantity }
// Using partial slug fragments to match CSV data

const csvUpdates = [
  // Row 1: 3-Tier Wooden Plant Stand (new - etsy-74, handled above)
  // Row 2: Rotating Shoe Rack - $10.3, qty 19
  { slugFragment: 'rotating-shoe-rack', price: 10.30, stockQuantity: 19 },
  // Row 3: 3-Tier Farmhouse Planter Stand (new - etsy-75, handled above)
  // Row 4: Folding Adirondack Chair - $10.7, qty 2
  { slugFragment: 'adirondack-chair', price: 10.70, stockQuantity: 2 },
  // Row 5: L Shaped Corner Bench - $12.7, qty 3
  { slugFragment: 'corner-bench', price: 12.70, stockQuantity: 3 },
  // Row 6: DIY Farmstand (roadside produce) - $28.99, qty 6
  { slugFragment: 'farmstand-plans-roadside', price: 28.99, stockQuantity: 6 },
  // Row 7: DIY Pergola Swing Chair - $20.49, qty 93
  { slugFragment: 'pergola-swing-chair', price: 20.49, stockQuantity: 93 },
  // Row 8: DIY Planter Box Plans (cedar fence picket) - $15.64, qty 2
  { slugFragment: 'planter-box-plans', price: 15.64, stockQuantity: 2 },
  // Row 9: Kids Mud Kitchen - $28.99, qty 7
  { slugFragment: 'mud-kitchen', price: 28.99, stockQuantity: 7 },
  // Row 10: DIY Full Size Loft Bed - $27.99, qty 1
  { slugFragment: 'loft-bed', price: 27.99, stockQuantity: 1 },
  // Row 11: Tiered Planter Box Plans 2-Level - $12.7, qty 3
  { slugFragment: 'tiered-planter-box', price: 12.70, stockQuantity: 3 },
  // Row 12: Tiered Plant Stand Plans - $12.97, qty 3
  { slugFragment: 'tiered-plant-stand-plans', price: 12.97, stockQuantity: 3 },
  // Row 13: Arbor Swing Plans (Pergola Roof) - $24.63, qty 3
  { slugFragment: 'arbor-swing-plans', price: 24.63, stockQuantity: 3 },
  // Row 14: DIY Collapsible Charcuterie Cart - $27.99, qty 83
  { slugFragment: 'collapsible-charcuterie', price: 27.99, stockQuantity: 83 },
  // Row 15: DIY Farmstand (mobile market stall) - $22.99, qty 27
  { slugFragment: 'farmstand-plan', price: 22.99, stockQuantity: 27 },
  // Row 16: DIY Mobile Bar Cart Plans - $25.99, qty 92
  { slugFragment: 'mobile-bar-cart', price: 25.99, stockQuantity: 92 },
  // Row 17: Treehouse Plans PDF - $22.99, qty 19
  { slugFragment: 'treehouse', price: 22.99, stockQuantity: 19 },
  // Row 18: Portable Charcuterie Cart - $26.99, qty 77
  { slugFragment: 'portable-charcuterie', price: 26.99, stockQuantity: 77 },
  // Row 19: Two Seat Bench with Table - $9.49, qty 2
  { slugFragment: 'two-seat-bench', price: 9.49, stockQuantity: 2 },
  // Row 20: DIY Farmstand PDF (portable roadside) - $28.99, qty 22
  { slugFragment: 'diy-farm-stand-plans', price: 28.99, stockQuantity: 22 },
  // Row 21: DIY Arbor Swing Plans - $25.63, qty 2
  { slugFragment: 'diy-arbor-swing', price: 25.63, stockQuantity: 2 },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

console.log(`Loaded ${products.length} existing products.`);

// Apply price/stock updates
let updatedCount = 0;
for (const update of csvUpdates) {
  const matching = products.filter(p => p.slug.includes(update.slugFragment));
  if (matching.length === 0) {
    console.warn(`  [WARN] No match for slugFragment: "${update.slugFragment}"`);
  } else if (matching.length > 1) {
    console.warn(`  [WARN] Multiple matches for "${update.slugFragment}": ${matching.map(p => p.slug).join(', ')}`);
  } else {
    const p = matching[0];
    const oldPrice = p.price;
    const oldStock = p.stockQuantity;
    p.price = update.price;
    p.stockQuantity = update.stockQuantity;
    // Recalculate originalPrice if it was auto-derived (keep if explicitly set)
    if (!p.originalPrice || Math.abs(p.originalPrice - Math.round((oldPrice / 0.30) * 100) / 100) < 0.1) {
      p.originalPrice = Math.round((update.price / 0.30) * 100) / 100;
    }
    console.log(`  Updated ${p.id} (${p.slug.slice(0, 50)}): price ${oldPrice} -> ${update.price}, stock ${oldStock} -> ${update.stockQuantity}`);
    updatedCount++;
  }
}

// Check for duplicates before adding
const existingSlugs = new Set(products.map(p => p.slug));
for (const np of newProducts) {
  if (existingSlugs.has(np.slug)) {
    console.log(`  [SKIP] Product already exists: ${np.slug}`);
  } else {
    products.push(np);
    console.log(`  Added: ${np.id} - ${np.name}`);
  }
}

console.log(`\nTotal products after update: ${products.length}`);
console.log(`Price/stock updates applied: ${updatedCount}`);

// Write back
fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log(`\nSaved to ${JSON_PATH}`);
