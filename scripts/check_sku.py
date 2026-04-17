import csv, re

with open('EtsyListingsDownload.csv', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print('SKU column samples:')
for r in rows[:10]:
    print(' SKU:', repr(r.get('SKU', '')))
    img1 = r.get('IMAGE1','')
    # Different pattern: check path structure
    # https://i.etsystatic.com/SHOPID/r/il/HASH/IMAGEID/il_fullxfull.IMAGEID_xxx.jpg
    parts = img1.split('/')
    print('   img parts:', parts[3:8] if len(parts) > 7 else parts)
