import requests
import sys

API_KEY = "jrxoehvzdk3n8ofqfvybmhkg"
SHOP_NAME = "ElesWoodDesigns"

print(f"Etsy API test basliyor...")
print(f"API Key: {API_KEY[:8]}...")

try:
    url = f"https://openapi.etsy.com/v3/application/shops?shop_name={SHOP_NAME}"
    headers = {"x-api-key": API_KEY}
    
    print(f"URL: {url}")
    r = requests.get(url, headers=headers, timeout=15)
    
    print(f"HTTP Status: {r.status_code}")
    print(f"Response: {r.text[:600]}")
    
except Exception as e:
    print(f"HATA: {type(e).__name__}: {e}")
    sys.exit(1)
