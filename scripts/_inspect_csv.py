import csv, sys

with open('EtsyListingsDownload.csv', encoding='utf-8-sig', errors='replace') as f:
    reader = csv.DictReader(f)
    row = next(reader)
    keys = list(row.keys())

print("KEYS:", keys)
print()
for k in keys:
    v = str(row.get(k, ''))[:120]
    print(f"  [{k}] = {repr(v)}")
