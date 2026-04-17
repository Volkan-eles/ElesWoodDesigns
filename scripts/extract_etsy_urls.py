"""
Extract Etsy listing URLs from old DOM logs and build a title→URL mapping.
Then update etsy_products.json with the correct URLs.
"""
import re, json, os, glob

BRAIN_DIR = r"C:\Users\vlkne\.gemini\antigravity\brain\8268bd4d-8396-42fa-8b16-6d10120dc0f8\.tempmediaStorage"
JSON_PATH = r"data\etsy_products.json"

# --- Step 1: Collect all (listing_id, title) pairs from DOM logs ---
listing_map = {}   # title_lower -> clean_url

dom_files = glob.glob(os.path.join(BRAIN_DIR, "dom_*.txt"))
print(f"Found {len(dom_files)} DOM files")

pattern = re.compile(
    r"href=['\"]https://www\.etsy\.com/listing/(\d+)/[^'\"]*['\"].*?title=['\"]([^'\"]+)['\"]",
    re.DOTALL
)
# Also match reversed order
pattern2 = re.compile(
    r"title=['\"]([^'\"]+)['\"].*?href=['\"]https://www\.etsy\.com/listing/(\d+)/[^'\"]*['\"]",
    re.DOTALL
)

for dom_file in dom_files:
    try:
        content = open(dom_file, encoding="utf-8", errors="replace").read()
        for m in pattern.finditer(content):
            listing_id, title = m.group(1), m.group(2).strip()
            clean_title = title.lower().strip()
            url = f"https://www.etsy.com/listing/{listing_id}/"
            listing_map[clean_title] = url
        for m in pattern2.finditer(content):
            title, listing_id = m.group(1).strip(), m.group(2)
            clean_title = title.lower().strip()
            url = f"https://www.etsy.com/listing/{listing_id}/"
            listing_map[clean_title] = url
    except Exception as e:
        print(f"  Error reading {dom_file}: {e}")

print(f"\nFound {len(listing_map)} unique listing mappings:")
for t, u in sorted(listing_map.items())[:15]:
    print(f"  {t[:60]:60s} -> {u}")

# --- Step 2: Update etsy_products.json ---
products = json.load(open(JSON_PATH, encoding="utf-8"))

matched = 0
unmatched = []

for p in products:
    name_lower = p["name"].lower().strip()
    # Exact match
    if name_lower in listing_map:
        p["etsy_url"] = listing_map[name_lower]
        matched += 1
        continue
    # Partial match (title contains the key or key contains the title)
    found = False
    for key, url in listing_map.items():
        # Check if the product name starts with the key or vice versa
        if name_lower.startswith(key[:40]) or key.startswith(name_lower[:40]):
            p["etsy_url"] = url
            matched += 1
            found = True
            break
    if not found:
        unmatched.append(p["name"])

print(f"\nMatched: {matched}/{len(products)}")
if unmatched:
    print(f"Unmatched ({len(unmatched)}):")
    for u in unmatched:
        print(f"  - {u[:70]}")

json.dump(products, open(JSON_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("\nJSON updated!")
