import re
import urllib.parse
with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

categories_match = re.search(r'const CATEGORIES = \[(.*?)\];', text, re.DOTALL)
popular_match = re.search(r'const POPULAR_CONVERSIONS = \[(.*?)\];', text, re.DOTALL)

urls = ["https://gothicrecords.github.io/uniconvert-pro/"]

if categories_match:
    cat_ids = re.findall(r"id:\s*'([a-z0-9]+)'", categories_match.group(1))
    for cid in cat_ids:
        urls.append(f"https://gothicrecords.github.io/uniconvert-pro/?cat={cid}")

if popular_match:
    pops = re.findall(r"\{.*?\}", popular_match.group(1))
    for pop in pops:
        cat_match = re.search(r"cat:\s*'([^']+)'", pop)
        from_match = re.search(r"from:\s*'([^']+)'", pop)
        to_match = re.search(r"to:\s*'([^']+)'", pop)
        if cat_match and from_match and to_match:
            c = cat_match.group(1)
            f = urllib.parse.quote(from_match.group(1))
            t = urllib.parse.quote(to_match.group(1))
            urls.append(f"https://gothicrecords.github.io/uniconvert-pro/?cat={c}&from={f}&to={t}")

urls = [u.replace('&', '&amp;') for u in urls]

xml_urls = []
for u in urls:
    xml_urls.append(f"  <url>\n    <loc>{u}</loc>\n  </url>")

xml_body = "\n".join(xml_urls)
xml = f"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n{xml_body}\n</urlset>"

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(xml)

print(f"Generated {len(urls)} URLs.")
