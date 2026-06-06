
import json
import os

def fix_text(text):
    if not text:
        return text
    # The common garbled sequence seen in the console as ?" 
    # Usually corresponds to – (EN DASH) or — (EM DASH) or similar special chars
    # We'll replace the likely culprits
    replacements = {
        "?\"": " - ",
        "?\"": " - ",
        "?": " - ",
        "": " ",
        "Â": "",
        "": " "
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Also fix some specific patterns seen in Etsy descriptions
    # e.g. "Step-by-step Mud Kitchen Diy Instructions - this is"
    # Often it was "Instructions – this is"
    return text

with open('data/etsy_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    p['name'] = fix_text(p['name'])
    p['description'] = fix_text(p['description'])
    p['longDescription'] = fix_text(p['longDescription'])

with open('data/etsy_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("Data cleanup complete.")
