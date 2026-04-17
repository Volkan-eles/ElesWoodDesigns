"""
Search for the 8 unmatched products in all available DOM log files.
"""
import re, glob

BRAIN_DIRS = [
    r"C:\Users\vlkne\.gemini\antigravity\brain\8268bd4d-8396-42fa-8b16-6d10120dc0f8\.tempmediaStorage",
    r"C:\Users\vlkne\.gemini\antigravity\brain\2d150b5a-1f4b-4c7a-b26d-4f8d9ce03e03\.tempmediaStorage",
    r"C:\Users\vlkne\.gemini\antigravity\brain\caf16901-4964-439e-bf4d-5451261360bd\.tempmediaStorage",
]

UNMATCHED_KEYWORDS = [
    "two seat bench",
    "lift top coffee table",
    "rotating shoe rack",
    "outdoor kitchen",
    "watercolor portrait",
    "greenhouse",
    "treehouse",
    "watercolour portrait",
]

# href attr pattern
pattern = re.compile(r"href=['\"]https://www\.etsy\.com/listing/(\d+)/([^'\"?]*)")

found = {}

for brain_dir in BRAIN_DIRS:
    dom_files = glob.glob(brain_dir + "\\dom_*.txt")
    for dom_file in dom_files:
        try:
            content = open(dom_file, encoding="utf-8", errors="replace").read()
            for m in pattern.finditer(content):
                listing_id = m.group(1)
                slug = m.group(2).lower()
                url = f"https://www.etsy.com/listing/{listing_id}/"
                for kw in UNMATCHED_KEYWORDS:
                    kw_slug = kw.replace(" ", "-")
                    if kw_slug in slug or kw.replace(" ", "") in slug.replace("-",""):
                        key = kw
                        if key not in found:
                            found[key] = []
                        if url not in found[key]:
                            found[key].append(url)
        except:
            pass

print("Found listings for unmatched products:")
for kw, urls in found.items():
    print(f"\n  [{kw}]")
    for u in urls[:3]:
        print(f"    {u}")
