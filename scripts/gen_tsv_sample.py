import json, os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(PROJECT_ROOT, "data", "etsy_products.json")

data = json.load(open(JSON_PATH, encoding="utf-8"))

BASE_URL = "https://eleswooddesigns.com"

headers = [
    "id", "title", "description", "link", "image_link",
    "price", "sale_price", "availability", "condition",
    "brand", "google_product_category", "product_type",
    "shipping"
]

rows = ["\t".join(headers)]

for p in data[:10]:  # first 10 products as sample
    desc_raw = (p.get("longDescription") or p.get("description") or p["name"])
    desc = " ".join(desc_raw.replace("\n", " ").split())[:500]
    # remove emoji
    import re
    desc = re.sub(r'[^\x00-\x7F\u00C0-\u024F\u0370-\u03FF]+', '', desc).strip()

    orig = p.get("originalPrice") or p["price"]
    sale = p["price"]
    img  = p["images"][0] if p.get("images") else ""

    row = [
        p["slug"],
        p["name"],
        desc,
        f"{BASE_URL}/products/{p['slug']}/",
        img,
        f"{float(orig):.2f} USD",
        f"{float(sale):.2f} USD",
        "in stock",
        "new",
        "ElesWoodDesigns",
        "505307",
        "Craft Supplies & Tools > Patterns & Instructions",
        "US::Digital Download:0.00 USD",
    ]
    rows.append("\t".join(row))

output = "\n".join(rows)
print(output)
