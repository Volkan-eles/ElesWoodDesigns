import csv, re

with open('EtsyListingsDownload.csv', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

for r in rows[:5]:
    img = r.get('IMAGE1', '')
    # Etsy CDN path: /il/HASH/LISTING_ID/il_fullxfull.LISTING_ID_xxx.jpg
    m = re.search(r'/(\d{8,})/il_fullxfull', img)
    if m:
        listing_id = m.group(1)
        etsy_url = 'https://www.etsy.com/listing/' + listing_id + '/'
    else:
        etsy_url = 'NOT FOUND'
    print(r['TITLE'][:55], '->', etsy_url)
