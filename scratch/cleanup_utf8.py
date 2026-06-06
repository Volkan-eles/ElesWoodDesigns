
import json

def fix_content(content):
    # e2 80 93 is UTF-8 for EN DASH 
    # e2 80 94 is UTF-8 for EM DASH
    # e2 80 98/99 are quotes
    # We replace them with ASCII equivalents
    content = content.replace('\u2013', '-')
    content = content.replace('\u2014', '-')
    content = content.replace('\u2018', "'")
    content = content.replace('\u2019', "'")
    content = content.replace('\u201c', '"')
    content = content.replace('\u201d', '"')
    return content

with open('data/etsy_products.json', 'r', encoding='utf-8') as f:
    raw = f.read()

fixed = fix_content(raw)

with open('data/etsy_products.json', 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Data cleanup (UTF-8) complete.")
