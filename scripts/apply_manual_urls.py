"""
Update the 6 missing/wrong Etsy listing URLs manually provided by user.
"""
import json, re

JSON_PATH = "data/etsy_products.json"
products = json.load(open(JSON_PATH, encoding="utf-8"))

# Manual mapping: product name substring -> clean etsy listing URL
MANUAL_URLS = {
    "two seat bench with table":               "https://www.etsy.com/listing/4461302426/",
    "lift top coffee table":                   "https://www.etsy.com/listing/4490120003/",
    "custom watercolor portrait from photo, family gift":  "https://www.etsy.com/listing/4489568684/",
    "custom watercolour portrait from photo":  "https://www.etsy.com/listing/4409731864/",
    "lean-to greenhouse":                      "https://www.etsy.com/listing/4488913068/",
    "treehouse plans pdf":                     "https://www.etsy.com/listing/4463014207/",
}

updated = []
for p in products:
    name_lower = p["name"].lower()
    matched = False
    for key, url in MANUAL_URLS.items():
        if key in name_lower:
            old = p["etsy_url"]
            p["etsy_url"] = url
            updated.append((p["name"][:60], old[:50], url))
            matched = True
            break

json.dump(products, open(JSON_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

print(f"Updated {len(updated)} products:")
for name, old, new in updated:
    print(f"  {name}")
    print(f"    OLD: {old}")
    print(f"    NEW: {new}")

# Summary
real  = sum(1 for p in products if "listing" in p["etsy_url"])
srch  = sum(1 for p in products if "search_query" in p["etsy_url"])
print(f"\nTotal: {real} real listing URLs, {srch} search fallbacks")
if srch:
    print("Remaining search fallbacks:")
    for p in products:
        if "search_query" in p["etsy_url"]:
            print(f"  - {p['name'][:70]}")
