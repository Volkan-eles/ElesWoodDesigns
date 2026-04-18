import csv, json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
CSV_PATH = ROOT / "EtsyListingsDownload.csv"
JSON_OUT = ROOT / "data" / "etsy_products.json"
LOG_OUT = ROOT / "scripts" / "csv_run.log"

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
      "flower stand", "planter", "garden"], "Garden"),
    (["workbench", "workshop", "garage", "shop table", "tool bench"], "Workshop"),
    (["bed frame", "bunk bed", "loft bed"], "Bedroom"),
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
    if not url:
        return ""
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
    try:
        return float(re.sub(r"[^\d.]", "", s))
    except Exception:
        return 0.0


def parse_tags(s):
    if not s:
        return []
    parts = [t.strip() for t in s.split(",") if t.strip()]
    return [re.sub(r"\s+", "_", t) for t in parts]


def load_url_map(json_path):
    if not json_path.exists():
        return {}
    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
        result = {}
        for p in data:
            name = re.sub(r"\s+", " ", p.get("name", "").lower().strip())
            url = p.get("etsy_url", "")
            if name and url:
                result[name] = url
        return result
    except Exception:
        return {}


def find_url(title, url_map):
    key = re.sub(r"\s+", " ", title.lower().strip())
    if key in url_map:
        return url_map[key]
    for existing_key, url in url_map.items():
        if existing_key[:45] == key[:45]:
            return url
    return ""


def main():
    preview = "--preview" in sys.argv

    lines = []
    lines.append(f"CSV: {CSV_PATH}")
    lines.append(f"Preview: {preview}")

    if not CSV_PATH.exists():
        lines.append("ERROR: CSV not found")
        LOG_OUT.write_text("\n".join(lines), encoding="utf-8")
        return

    url_map = load_url_map(JSON_OUT)
    lines.append(f"Loaded {len(url_map)} existing URLs")

    products = []
    idx = 1

    # CSV'yi okurken newline='' kullan (cok satirli alan sorunu)
    with open(CSV_PATH, encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = row.get("TITLE", "").strip()
            if not title:
                continue

            desc = row.get("DESCRIPTION", "").strip()
            raw_price = parse_price(row.get("PRICE", "0"))
            if raw_price <= 0:
                raw_price = 9.99

            sale_price = round(raw_price * DISCOUNT_RATE, 2)
            full_images, thumb_images = collect_images(row)
            tags = parse_tags(row.get("TAGS", ""))
            category = guess_category(title, desc)
            difficulty = guess_difficulty(title, desc)
            etsy_url = find_url(title, url_map)
            slug = slugify(title)
            short_desc = re.sub(r"\s+", " ", desc[:220]).strip()

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
            }
            products.append(product)
            idx += 1

    url_count = sum(1 for p in products if p["etsy_url"])
    img_count = sum(1 for p in products if p["image"])

    lines.append(f"Products found: {len(products)}")
    lines.append(f"With URL: {url_count}/{len(products)}")
    lines.append(f"With image: {img_count}/{len(products)}")
    lines.append("")

    for p in products:
        url_ok = "OK" if p["etsy_url"] else "--"
        img_ok = "OK" if p["image"] else "--"
        lid = p["etsy_url"].rstrip("/").split("/")[-1] if p["etsy_url"] else "no-url"
        lines.append(f"  {p['id']:>8}  {p['name'][:55]:<55}  ${p['price']:5.2f}  url={url_ok}  img={img_ok}  lid={lid}")

    LOG_OUT.write_text("\n".join(lines), encoding="utf-8")

    if preview:
        lines.append("")
        lines.append("[PREVIEW MODE - not saved]")
        return

    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    lines.append(f"SAVED -> {JSON_OUT}")
    LOG_OUT.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
