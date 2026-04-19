import csv, sys
path = 'EtsyListingsDownload.csv'
with open(path, encoding='utf-8-sig', errors='replace') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

with open('scripts/rowcount.txt', 'w', encoding='utf-8') as out:
    out.write(f'Total rows: {len(rows)}\n')
    if rows:
        out.write(f'Title: {rows[0].get("TITLE","?")[:80]}\n')
        out.write(f'IMAGE1: {rows[0].get("IMAGE1","?")[:80]}\n')
        out.write(f'PRICE: {rows[0].get("PRICE","?")}\n')
        out.write(f'TAGS sample: {rows[0].get("TAGS","?")[:80]}\n')
        out.write(f'COLS: {list(rows[0].keys())}\n')
