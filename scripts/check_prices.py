import csv, json

with open('EtsyListingsDownload.csv', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print('CSV fiyatlari:')
for r in rows:
    title = r['TITLE'][:55]
    price = r['PRICE']
    print(f"  {title:55s}  CSV=${price}")

data = json.load(open('data/etsy_products.json', encoding='utf-8'))
print()
print('JSON fiyatlari:')
for p in data:
    name = p['name'][:55]
    print(f"  {name:55s}  price=${p['price']}  orig=${p['originalPrice']}")
