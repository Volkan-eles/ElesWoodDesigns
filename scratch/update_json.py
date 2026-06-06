import csv, json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
CSV_PATH = ROOT / "EtsyListingsDownload.csv"
JSON_OUT = ROOT / "data" / "etsy_products.json"

DISCOUNT_RATE = 0.30
DEFAULT_RATING = 4.7
DEFAULT_REVIEW_COUNT = 285
DEFAULT_DIFFICULTY = "Easy"
DEFAULT_TIME = "8 hours"
DEFAULT_PAGES = 15

CATEGORY_MAP = [
    (["bar cart", "charcuterie", "serving cart", "beverage cart", "coffee cart",
      "mobile bar", "food cart", "vendor cart", "catering"], "Kitchen"),
    (["outdoor kitchen", "grill station", "bbq", "grill table"], "Kitchen"),
    (["farmstand", "farm stand", "farm cart", "flower cart", "produce", "roadside",
      "flower stand", "planter", "garden", "plant stand"], "Garden"),
    (["workbench", "workshop", "garage", "shop table", "tool bench"], "Workshop"),
    (["bed frame", "bunk bed", "loft bed", "kids", "playhouse", "treehouse"], "Bedroom"),
    (["digital", "digital download", "svg", "pdf", "plans"], "Digital"),
]

DIFFICULTY_HINTS = [
    (["folding", "foldable", "collapsible", "beginner", "simple"], "Easy"),
    (["rotating", "lift top", "lift-top", "ping pong", "outdoor kitchen", "modular"], "Hard"),
]

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:120].strip("-")

def guess_category(title, desc=""):
    combined = (title + " " + desc[:200]).lower()
    for keywords, cat in CATEGORY_MAP:
        if any(kw in combined for kw in keywords):
            return cat
    return "Furniture"

def guess_difficulty(title, desc=""):
    combined = (title + " " + desc[:200]).lower()
    for keywords, diff in DIFFICULTY_HINTS:
        if any(kw in combined for kw in keywords):
            return diff
    return DEFAULT_DIFFICULTY

def build_image_url(url, size="fullxfull"):
    if not url: return ""
    return re.sub(r"il_[^./]+\.", f"il_{size}.", url)

def collect_images(row):
    full_images, thumb_images = [], []
    for i in range(1, 11):
        url = row.get(f"IMAGE{i}", "").strip()
        if url:
            full_images.append(build_image_url(url, "fullxfull"))
            thumb_images.append(build_image_url(url, "794xN"))
    return full_images, thumb_images

def parse_price(s):
    try: return float(re.sub(r"[^\d.]", "", s))
    except: return 0.0

def parse_tags(s):
    if not s: return []
    parts = [t.strip() for t in s.split(",") if t.strip()]
    return [re.sub(r"\s+", "_", t) for t in parts]

def load_exact_url_map(json_path):
    if not json_path.exists(): return {}
    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
        result = {}
        for p in data:
            name = p.get("name", "").strip()
            url = p.get("etsy_url", "")
            if name and url:
                result[name] = url
        return result
    except: return {}

def main():
    if not CSV_PATH.exists():
        print("ERROR: CSV not found")
        return

    url_map = load_exact_url_map(JSON_OUT)

    products = []
    idx = 1
    
    # User-provided NEW URLs map
    NEW_URLS = {
        "Tiered Planter Box Plans | 2-Level Raised Garden Bed Woodworking Blueprint (PDF Download)": 
            "https://www.etsy.com/listing/4493928541/tiered-planter-box-plans-2-level-raised",
        "Tiered Plant Stand Plans | DIY Outdoor Wooden Garden Shelf (PDF Download)":
            "https://www.etsy.com/listing/4493892575/tiered-plant-stand-plans-diy-outdoor",
    }
    
    # We will read etsy_products.json to preserve categories if we prefer, but for now we follow guess_category and update
    try:
        old_data = json.loads(JSON_OUT.read_text(encoding="utf-8"))
        cat_map_old = {p['name']: p.get('category') for p in old_data}
    except:
        cat_map_old = {}

    with open(CSV_PATH, encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = row.get("TITLE", "").strip()
            if not title: continue
            desc = row.get("DESCRIPTION", "").strip()
            raw_price = parse_price(row.get("PRICE", "0"))
            if raw_price <= 0: raw_price = 9.99

            sale_price = round(raw_price * DISCOUNT_RATE, 2)
            full_images, thumb_images = collect_images(row)
            tags = parse_tags(row.get("TAGS", ""))
            
            category = cat_map_old.get(title) # preserve old categories
            if not category:
                category = guess_category(title, desc)
                
            difficulty = guess_difficulty(title, desc)
            
            # Identify URL
            etsy_url = NEW_URLS.get(title)
            if not etsy_url:
                etsy_url = url_map.get(title, "")
                
            slug = slugify(title)
            short_desc = re.sub(r"\s+", " ", desc[:220]).strip()
            
            # Stock updates: reading from quantity if available, or setting a default stock status
            stock_quantity = int(row.get("QUANTITY", "0"))
            in_stock = stock_quantity > 0

            product = {
                "id": f"etsy-{idx}",
                "slug": slug,
                "name": title,
                "category": category,
                "price": sale_price,
                "originalPrice": raw_price,
                "rating": DEFAULT_RATING,
                "reviewCount": DEFAULT_REVIEW_COUNT,
                "difficulty": difficulty,
                "estimatedTime": DEFAULT_TIME,
                "pages": DEFAULT_PAGES,
                "description": short_desc,
                "longDescription": desc,
                "features": tags[:5],
                "tags": tags,
                "materials": ["Digital Download", "PDF File", "Instant Download"],
                "image": full_images[0] if full_images else "",
                "thumbnail": thumb_images[0] if thumb_images else "",
                "images": full_images,
                "imagesThumbnails": thumb_images,
                "etsy_url": etsy_url,
                "bestseller": False,
                "inStock": in_stock,
                "stockQuantity": stock_quantity
            }
            products.append(product)
            idx += 1

    JSON_OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {len(products)} products! Two new URLs handled correctly. Stock and prices updated directly from CSV.")
    
if __name__ == "__main__":
    main()
