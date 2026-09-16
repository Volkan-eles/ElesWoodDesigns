const fs = require('fs');
const path = require('path');

const token = "polar_oat_WyzRHvtSuQSe45oRt8IyWNWawNNxZEtkYVY0L4WB4YW";
const orgId = "f9c5b915-16dd-466f-9c58-956bdd335b71";

const PROJECT_ROOT = path.join(__dirname, "woodcraft-plans");
const JSON_PATH = path.join(PROJECT_ROOT, "data", "etsy_products.json");

// Helper delay to avoid rate limiting
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Loading products database from:", JSON_PATH);
  const products = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

  // 1. Fetch all existing checkout links from Polar to avoid duplicate creations
  console.log("Fetching existing checkout links from Polar...");
  const existingLinksMap = new Map(); // product_price_id -> client_secret
  let linkPage = 1;
  let linksHasMore = true;

  while (linksHasMore) {
    const url = `https://api.polar.sh/v1/checkout-links/?organization_id=${orgId}&limit=100&page=${linkPage}`;
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
          for (const link of data.items) {
            if (link.product_price_id) {
              existingLinksMap.set(link.product_price_id, link.client_secret);
            }
          }
          console.log(`Loaded ${data.items.length} existing checkout links.`);
          linkPage++;
        } else {
          linksHasMore = false;
        }
      } else {
        console.error("Failed to list checkout links:", await res.text());
        linksHasMore = false;
      }
    } catch (err) {
      console.error("Error fetching checkout links:", err);
      linksHasMore = false;
    }
  }
  console.log(`Total existing checkout links on Polar: ${existingLinksMap.size}`);

  // 2. Fetch all products from Polar to map names to price IDs
  console.log("\nFetching all products from Polar to get their price IDs...");
  const polarProductPriceMap = new Map(); // truncated_name -> price_id
  let prodPage = 1;
  let prodHasMore = true;

  while (prodHasMore) {
    const url = `https://api.polar.sh/v1/products/?organization_id=${orgId}&limit=100&page=${prodPage}`;
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
              polarProductPriceMap.set(item.name.toLowerCase().trim(), item.prices[0].id);
            }
          }
          console.log(`Loaded ${data.items.length} products with price IDs.`);
          prodPage++;
        } else {
          prodHasMore = false;
        }
      } else {
        console.error("Failed to list products:", await res.text());
        prodHasMore = false;
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      prodHasMore = false;
    }
  }

  console.log(`Total products matched on Polar: ${polarProductPriceMap.size}`);

  // 3. Match each product, check if it has checkout link, if not, create it
  console.log("\nSynchronizing checkout links...");
  let createdCount = 0;
  let reusedCount = 0;
  let notFoundCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const truncatedName = p.name.length > 64 ? p.name.slice(0, 61).trim() + "..." : p.name;
    const key = truncatedName.toLowerCase().trim();

    if (!polarProductPriceMap.has(key)) {
      console.warn(`  ⚠️ Product not found on Polar: "${truncatedName}"`);
      notFoundCount++;
      continue;
    }

    const priceId = polarProductPriceMap.get(key);

    if (existingLinksMap.has(priceId)) {
      // Reuse existing checkout link client_secret
      p.polar_price_id = existingLinksMap.get(priceId);
      reusedCount++;
    } else {
      // Create new checkout link
      console.log(`[${i+1}/${products.length}] Creating checkout link for "${truncatedName}"`);
      const createUrl = "https://api.polar.sh/v1/checkout-links/";
      const payload = {
        payment_processor: "stripe",
        product_price_id: priceId,
        success_url: "https://eleswooddesigns.com/confirmation?checkout_id={CHECKOUT_ID}"
      };

      try {
        const res = await fetch(createUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (res.status === 201) {
          const data = await res.json();
          p.polar_price_id = data.client_secret;
          existingLinksMap.set(priceId, data.client_secret);
          createdCount++;
          console.log(`  ✓ Created: ${data.client_secret}`);
        } else {
          console.error(`  ❌ Failed to create link for "${truncatedName}":`, await res.text());
        }
      } catch (err) {
        console.error(`  ❌ Error creating link for "${truncatedName}":`, err);
      }

      // Add a small delay to avoid hitting rate limits
      await delay(200);
    }
  }

  console.log(`\n=== Checkout Links Synchronization Report ===`);
  console.log(`Total Products in Local JSON: ${products.length}`);
  console.log(`Reused existing links: ${reusedCount}`);
  console.log(`Created new links: ${createdCount}`);
  console.log(`Not found on Polar: ${notFoundCount}`);

  console.log("\nSaving updated products database...");
  fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), "utf8");
  console.log("Database saved successfully!");
}

main();
