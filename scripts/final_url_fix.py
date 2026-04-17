import json

JSON_PATH = "data/etsy_products.json"
products = json.load(open(JSON_PATH, encoding="utf-8"))

FIXES = {
    "rotating shoe rack": "https://www.etsy.com/listing/4490072169/",
    # chicken coop already has 4380408404 from old logs - correct
    # outdoor kitchen still missing, keep search fallback for now
}

updated = []
for p in products:
    nl = p["name"].lower()
    for kw, url in FIXES.items():
        if kw in nl:
            p["etsy_url"] = url
            updated.append((p["name"][:65], url))

json.dump(products, open(JSON_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

for name, url in updated:
    print(f"Updated: {name}")
    print(f"  -> {url}")

real  = sum(1 for p in products if "listing" in p["etsy_url"])
srch  = sum(1 for p in products if "search_query" in p["etsy_url"])
print(f"\nFinal: {real} real listing URLs, {srch} search fallbacks")
for p in products:
    if "search_query" in p["etsy_url"]:
        print(f"  Still missing: {p['name'][:65]}")
