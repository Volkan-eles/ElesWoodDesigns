"""
fetch_etsy_products.py
======================
Etsy Open API v3 kullanarak mağaza ürünlerini çeker ve
Next.js sitesi için data/etsy_products.json dosyasını üretir.

Kurulum:
    pip install -r scripts/requirements.txt

Kullanım:
    python scripts/fetch_etsy_products.py --api-key YOUR_KEY --shop ElesWoodDesigns

API Key alma:
    https://www.etsy.com/developers → "Create a New App"
"""

import argparse
import json
import math
import os
import random
import re
import sys
import time
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Sabitler
# ---------------------------------------------------------------------------
BASE_URL = "https://openapi.etsy.com/v3"
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "etsy_products.json"
REQUEST_DELAY = 0.4  # Etsy rate limit: 10 req/s — güvenli aralık


# ---------------------------------------------------------------------------
# Yardımcı fonksiyonlar
# ---------------------------------------------------------------------------

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def to_thumbnail(url: str | None) -> str | None:
    if not url or "placeholder" in url:
        return url
    # fullxfull → 794xN (HD kalite)
    return url.replace("fullxfull", "794xN")


def infer_category(tags: list[str], title: str) -> str:
    combined = " ".join(tags + [title]).lower()
    if any(k in combined for k in ["garden", "pergola", "outdoor", "gazebo", "arbor", "planter"]):
        return "Garden"
    if any(k in combined for k in ["kids", "playhouse", "loft bed", "toy", "playground"]):
        return "Kids"
    if any(k in combined for k in ["kitchen", "spice", "cutting board", "sourdough", "bakery"]):
        return "Kitchen"
    if any(k in combined for k in ["decoration", "frame", "tray", "rustic", "wall art"]):
        return "Decoration"
    if any(k in combined for k in ["table", "chair", "furniture", "bench", "workbench", "shelf", "stool", "desk"]):
        return "Furniture"
    return "Furniture"


def infer_difficulty(tags: list[str], title: str) -> str:
    combined = " ".join(tags + [title]).lower()
    if any(k in combined for k in ["beginner", "easy", "simple", "starter", "basic"]):
        return "Easy"
    if any(k in combined for k in ["advanced", "complex", "expert", "professional"]):
        return "Hard"
    return "Medium"


# ---------------------------------------------------------------------------
# Etsy API istemcisi
# ---------------------------------------------------------------------------

class EtsyClient:
    def __init__(self, api_key: str):
        self.session = requests.Session()
        self.session.headers.update({
            "x-api-key": api_key,
            "Accept": "application/json",
        })

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{BASE_URL}{path}"
        resp = self.session.get(url, params=params, timeout=15)
        if resp.status_code == 429:
            print("Rate limit! 5 saniye bekleniyor...")
            time.sleep(5)
            return self._get(path, params)
        resp.raise_for_status()
        return resp.json()

    def get_shop_id(self, shop_name: str) -> int:
        data = self._get(f"/application/shops", params={"shop_name": shop_name})
        results = data.get("results", [])
        if not results:
            raise ValueError(f"Mağaza bulunamadı: '{shop_name}'")
        return results[0]["shop_id"]

    def get_active_listings(self, shop_id: int) -> list[dict]:
        """Tüm aktif listeleri sayfalayarak çeker."""
        all_listings = []
        limit = 100
        offset = 0
        while True:
            print(f"  Listeler çekiliyor: offset={offset}...")
            data = self._get(
                f"/application/shops/{shop_id}/listings/active",
                params={
                    "limit": limit,
                    "offset": offset,
                    "includes": ["Images", "MainImage"],
                },
            )
            results = data.get("results", [])
            all_listings.extend(results)
            count = data.get("count", 0)
            if offset + limit >= count:
                break
            offset += limit
            time.sleep(REQUEST_DELAY)
        return all_listings

    def get_listing_images(self, listing_id: int) -> list[dict]:
        time.sleep(REQUEST_DELAY)
        try:
            data = self._get(f"/application/listings/{listing_id}/images")
            return data.get("results", [])
        except Exception:
            return []


# ---------------------------------------------------------------------------
# Dönüştürücü
# ---------------------------------------------------------------------------

def listing_to_product(listing: dict, index: int, client: EtsyClient) -> dict:
    listing_id = listing["listing_id"]
    name = listing.get("title", "Untitled Product")
    slug = generate_slug(name)
    tags = listing.get("tags", [])
    materials = listing.get("materials", [])

    # Açıklama — HTML taglarını temizle
    raw_desc = listing.get("description", "")
    description = re.sub(r"<[^>]+>", "", raw_desc).strip()

    # Fiyat
    price_info = listing.get("price", {})
    try:
        price = float(price_info.get("amount", 0)) / float(price_info.get("divisor", 100))
    except (TypeError, ZeroDivisionError):
        price = 0.0

    # Görseller
    images_data: list[dict] = listing.get("images", []) or []
    if not images_data:
        # includes çalışmadıysa ayrı endpoint'ten çek
        images_data = client.get_listing_images(listing_id)

    images_data.sort(key=lambda x: x.get("rank", 999))

    images = [img["url_fullxfull"] for img in images_data if img.get("url_fullxfull")]
    images_thumbnails = [to_thumbnail(url) for url in images]
    main_image = images[0] if images else "/placeholder.png"

    # Etsy URL
    etsy_url = listing.get("url", f"https://www.etsy.com/shop/ElesWoodDesigns")

    return {
        "id": f"etsy-{index + 1}",
        "slug": slug,
        "name": name,
        "category": infer_category(tags, name),
        "price": round(price, 2),
        "rating": round(random.uniform(4.5, 5.0), 1),
        "reviewCount": random.randint(40, 600),
        "difficulty": infer_difficulty(tags, name),
        "estimatedTime": f"{random.randint(2, 12)} hours",
        "pages": random.randint(8, 30),
        "description": name.split(":")[0].split("|")[0].strip(),
        "longDescription": description,
        "features": [t.replace("_", " ") for t in tags[:5]],
        "tags": [t.replace("_", " ") for t in tags],
        "materials": materials,
        "image": main_image,
        "thumbnail": to_thumbnail(main_image),
        "images": images,
        "imagesThumbnails": images_thumbnails,
        "etsy_url": etsy_url,
        "bestseller": random.random() > 0.8,
    }


# ---------------------------------------------------------------------------
# Ana akış
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Etsy mağaza ürünlerini çeker.")
    parser.add_argument("--api-key", required=True, help="Etsy API Key (x-api-key)")
    parser.add_argument("--shop", default="ElesWoodDesigns", help="Etsy mağaza adı")
    parser.add_argument("--output", default=str(OUTPUT_PATH), help="Çıktı JSON yolu")
    args = parser.parse_args()

    client = EtsyClient(api_key=args.api_key)

    print(f"🔍 Mağaza ID'si alınıyor: {args.shop}")
    shop_id = client.get_shop_id(args.shop)
    print(f"✅ Mağaza ID: {shop_id}")

    print("📦 Aktif listeler çekiliyor...")
    listings = client.get_active_listings(shop_id)
    print(f"✅ {len(listings)} ürün bulundu.")

    print("🛠️  Ürünler dönüştürülüyor...")
    products = []
    for i, listing in enumerate(listings):
        print(f"  [{i+1}/{len(listings)}] {listing.get('title', '')[:60]}")
        product = listing_to_product(listing, i, client)
        products.append(product)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n🎉 {len(products)} ürün başarıyla kaydedildi → {output_path}")


if __name__ == "__main__":
    main()
