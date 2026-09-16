const fs = require('fs');
const path = require('path');

const token = "polar_oat_WyzRHvtSuQSe45oRt8IyWNWawNNxZEtkYVY0L4WB4YW";
const orgId = "f9c5b915-16dd-466f-9c58-956bdd335b71";

const PROJECT_ROOT = path.join(__dirname, "woodcraft-plans");
const JSON_PATH = path.join(PROJECT_ROOT, "data", "etsy_products.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const products = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  console.log(`Loaded ${products.length} products from JSON.`);

  // 1. Fetch all products from new Polar
  console.log("Fetching all products from new Polar...");
  const newPolarProducts = new Map(); // name -> price_id
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const url = `https://api.polar.sh/v1/products/?organization_id=${orgId}&limit=100&page=${page}`;
    try {
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          for (const item of data.items) {
            if (item.prices && item.prices.length > 0) {
              newPolarProducts.set(item.name.toLowerCase().trim(), item.prices[0].id);
            }
          }
          console.log(`Page ${page}: Loaded ${data.items.length} products from new Polar.`);
          page++;
        } else {
          hasMore = false;
        }
      } else {
        console.error("Failed to list products:", await res.text());
        hasMore = false;
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      hasMore = false;
    }
  }

  console.log(`Found ${newPolarProducts.size} products on new Polar.`);

  // 2. Map and upload missing
  let updatedCount = 0;
  let uploadedCount = 0;

  for (const p of products) {
    const truncatedName = p.name.length > 64 ? p.name.slice(0, 61).trim() + "..." : p.name;
    const key = truncatedName.toLowerCase().trim();

    if (newPolarProducts.has(key)) {
      const newPriceId = newPolarProducts.get(key);
      if (p.polar_price_id !== newPriceId) {
        p.polar_price_id = newPriceId;
        updatedCount++;
      }
    } else {
      // Missing on new Polar - upload it!
      console.log(`Uploading missing product to Polar: "${truncatedName}" ($${p.price})`);
      try {
        const res = await fetch("https://api.polar.sh/v1/products/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: truncatedName,
            description: p.description || "",
            prices: [
              {
                amount_type: "fixed",
                price_amount: Math.round(p.price * 100),
                price_currency: "usd"
              }
            ],
            metadata: {
              product_id: p.id
            }
          })
        });

        if (res.status === 201 || res.status === 200) {
          const data = await res.json();
          p.polar_price_id = data.prices[0].id;
          console.log(`  ✓ Created on Polar. Price ID: ${p.polar_price_id}`);
          uploadedCount++;
        } else {
          console.error(`  ✗ Polar API Error (${res.status}):`, await res.text());
        }
      } catch (err) {
        console.error(`  ✗ Request Error:`, err);
      }
      await delay(250);
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), "utf8");
  console.log(`\nMapping finished:`);
  console.log(`  - Updated Price IDs in JSON: ${updatedCount}`);
  console.log(`  - Uploaded missing products: ${uploadedCount}`);
  console.log(`  - Total products: ${products.length}`);
}

main();
