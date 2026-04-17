#!/usr/bin/env python3
"""
Etsy CSV -> etsy_products.json converter
- Reads EtsyListingsDownload.csv from project root
- Outputs data/etsy_products.json with full image arrays, descriptions, and sale prices
"""

import csv
import json
import re
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
CSV_PATH = os.path.join(PROJECT_ROOT, "EtsyListingsDownload.csv")
JSON_PATH = os.path.join(PROJECT_ROOT, "data", "etsy_products.json")

# Original prices (manual mapping, update as needed)
SALE_DISCOUNT = 0.70  # 70% discount from original

CATEGORIES = {
    # Furniture
    "table": "Furniture",
    "coffee table": "Furniture",
    "desk": "Furniture",
    "bookshelf": "Furniture",
    "shelves": "Furniture",
    "storage": "Furniture",
    "cabinet": "Furniture",
    "dresser": "Furniture",
    "sofa": "Furniture",
    "monitor": "Furniture",
    "murphy bed": "Furniture",
    "loft bed": "Furniture",
    "bed": "Furniture",
    "console": "Furniture",
    "floating shelf": "Furniture",
    "shelf": "Furniture",
    "shoe": "Furniture",
    "stool": "Furniture",
    "lounge chair": "Furniture",
    "chaise": "Furniture",
    "dog house": "Furniture",
    # Outdoor / Garden
    "pergola": "Outdoor",
    "gazebo": "Outdoor",
    "swing": "Outdoor",
    "sandbox": "Outdoor",
    "playhouse": "Outdoor",
    "treehouse": "Outdoor",
    "ping pong": "Outdoor",
    "picnic": "Outdoor",
    "bench": "Outdoor",
    "sauna": "Outdoor",
    "fence": "Outdoor",
    "outdoor lounge": "Outdoor",
    "outdoor bench": "Outdoor",
    "outdoor kitchen": "Outdoor",
    # Garden
    "planter": "Garden",
    "garden": "Garden",
    "farmstand": "Garden",
    "farm stand": "Garden",
    "farm-stand": "Garden",
    "potting bench": "Garden",
    "mailbox": "Garden",
    "greenhouse": "Garden",
    "windmill": "Garden",
    "produce stand": "Garden",
    "flower stand": "Garden",
    "bakery stand": "Garden",
    "roadside": "Garden",
    # Workshop
    "workbench": "Workshop",
    "workshop": "Workshop",
    "tool storage": "Workshop",
    "pegboard": "Workshop",
    # Kitchen / Entertaining
    "charcuterie": "Kitchen",
    "serving": "Kitchen",
    "bar cart": "Kitchen",
    "coffee cart": "Kitchen",
    "vendor cart": "Kitchen",
    "mobile bar": "Kitchen",
    "food cart": "Kitchen",
    "mobile food": "Kitchen",
    "checkout stand": "Kitchen",
    "beverage": "Kitchen",
    "mobile cart": "Kitchen",
    # Outdoor structures
    "shed": "Outdoor",
    "coop": "Outdoor",
    "chicken": "Outdoor",
    "rabbit": "Outdoor",
    "hutch": "Outdoor",
    "firewood": "Outdoor",
    # Digital / Non-woodworking
    "watercolor": "Digital",
    "portrait": "Digital",
    "svg": "Digital",
    "costco": "Digital",
    "christmas art": "Digital",
    "christmas prints": "Digital",
    "printable": "Digital",
    "pencil sketch": "Digital",
    "memorial": "Digital",
    "couple portrait": "Digital",
}

DIFFICULTIES = ["Easy", "Medium", "Hard"]

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:100]

def guess_category(title):
    title_lower = title.lower()
    for keyword, cat in CATEGORIES.items():
        if keyword in title_lower:
            return cat
    return "Furniture"

def guess_difficulty(title, description):
    combined = (title + " " + description).lower()
    if any(w in combined for w in ["beginner", "easy", "simple", "basic"]):
        return "Easy"
    if any(w in combined for w in ["advanced", "complex", "hard", "expert"]):
        return "Hard"
    return "Medium"

def extract_pages(description):
    match = re.search(r"(\d+)\s*pages?", description, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return 15

def extract_time(description):
    match = re.search(r"(\d+[-–]\d+|\d+)\s*(hours?|hrs?|days?)", description, re.IGNORECASE)
    if match:
        return match.group(0).strip()
    return "8 hours"

def parse_tags(tags_str):
    if not tags_str:
        return []
    return [t.strip() for t in tags_str.split(",") if t.strip()][:13]

def parse_materials(materials_str):
    if not materials_str:
        return ["Wood", "Plywood", "Wood Screws", "Wood Glue"]
    return [m.strip() for m in materials_str.split(",") if m.strip()][:10]

def get_images_fullxfull(row):
    images = []
    for i in range(1, 11):
        key = f"IMAGE{i}"
        val = row.get(key, "").strip()
        if val:
            # Convert to fullxfull if not already
            url = re.sub(r"il_\d+xN\.", "il_fullxfull.", val)
            url = re.sub(r"il_\d+x\d+\.", "il_fullxfull.", url)
            images.append(url)
    return images

def get_images_thumbnails(images_full):
    thumbs = []
    for url in images_full:
        thumb = url.replace("il_fullxfull.", "il_794xN.")
        thumbs.append(thumb)
    return thumbs

def get_etsy_listing_url(images_full: list, title: str) -> str:
    """Extract the Etsy listing URL from the image CDN URL.
    Etsy CDN pattern: /HASH/LISTING_ID/il_fullxfull.LISTING_ID_xxx.jpg
    """
    import re
    for img in images_full:
        m = re.search(r'/(\d{8,})/il_fullxfull', img)
        if m:
            listing_id = m.group(1)
            return f'https://www.etsy.com/listing/{listing_id}/'
    # Fallback: search URL
    return f'https://www.etsy.com/shop/ElesWoodDesigns?search_query={title[:50].replace(" ", "%20")}'


def main():
    if not os.path.exists(CSV_PATH):
        print(f"ERROR: CSV not found at {CSV_PATH}")
        sys.exit(1)

    products = []
    seen_slugs = {}

    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            title = row.get("TITLE", "").strip()
            if not title:
                continue

            description_raw = row.get("DESCRIPTION", "").strip()
            price_str = row.get("PRICE", "0").strip()
            tags_str = row.get("TAGS", "")
            materials_str = row.get("MATERIALS", "")

            try:
                price = float(price_str)
            except ValueError:
                price = 9.99

            # CSV price = original price, apply 70% discount to get sale price
            original_price = round(price, 2)
            sale_price = round(price * (1 - SALE_DISCOUNT), 2)

            # Slug
            base_slug = slugify(title)
            if base_slug in seen_slugs:
                seen_slugs[base_slug] += 1
                slug = f"{base_slug}-{seen_slugs[base_slug]}"
            else:
                seen_slugs[base_slug] = 0
                slug = base_slug

            # Images
            images_full = get_images_fullxfull(row)
            images_thumbs = get_images_thumbnails(images_full)
            main_image = images_full[0] if images_full else ""
            main_thumb = images_thumbs[0] if images_thumbs else ""

            # Short description (first 200 chars of description)
            short_desc = description_raw[:200].strip() if description_raw else title

            # Tags & materials
            tags = parse_tags(tags_str)
            materials = parse_materials(materials_str)

            # Features from tags
            features = tags[:5] if tags else [title[:50]]

            # Category, difficulty, pages, time
            category = guess_category(title)
            difficulty = guess_difficulty(title, description_raw)
            pages = extract_pages(description_raw)
            est_time = extract_time(description_raw)

            product = {
                "id": f"etsy-{idx + 1}",
                "slug": slug,
                "name": title,
                "category": category,
                "price": sale_price,
                "originalPrice": original_price,
                "rating": 4.7,
                "reviewCount": 285,
                "difficulty": difficulty,
                "estimatedTime": est_time,
                "pages": pages,
                "description": short_desc,
                "longDescription": description_raw,
                "features": features,
                "tags": tags,
                "materials": materials,
                "image": main_image,
                "thumbnail": main_thumb,
                "images": images_full,
                "imagesThumbnails": images_thumbs,
                "etsy_url": get_etsy_listing_url(images_full, title),
                "bestseller": idx < 5,
            }
            products.append(product)

    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(products)} urun JSON'a yazildi: {JSON_PATH}")
    for p in products[:5]:
        print(f"  - {p['name'][:60]} | orig=${p['originalPrice']} -> sale: ${p['price']} (70% off)")

if __name__ == "__main__":
    main()
