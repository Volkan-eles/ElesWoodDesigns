import json
import os

path = 'data/etsy_products.json'
if not os.path.exists(path):
    print(f"Error: {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total products: {len(data)}")

issues = []
slugs = set()

for p in data:
    id_val = p.get('id', 'N/A')
    slug = p.get('slug', '')
    
    if not slug:
        issues.append(f"{id_val}: Missing slug")
    elif slug in slugs:
        issues.append(f"{id_val}: Duplicate slug ({slug})")
    slugs.add(slug)
    
    if not p.get('image'):
        issues.append(f"{id_val}: Missing image")
    
    if not p.get('price'):
        issues.append(f"{id_val}: Missing price")
        
    if not p.get('etsy_url'):
        # This might not be a Pinterest error but good to know
        issues.append(f"{id_val}: Missing etsy_url")

if not issues:
    print("No issues found in JSON structure.")
else:
    print("Issues found:")
    for issue in issues:
        print(f" - {issue}")
