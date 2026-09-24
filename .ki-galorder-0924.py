# Every project's rendered gallery must show her photographs in her order.
# Reads projects.ts (the order she set) and each built page (what visitors see).
# usage: python3 .ki-galorder-0924.py
import re, os, sys
src = open('src/preview/katrinisfeld/projects.ts').read()
blocks = re.split(r"\n  \{\n    slug: '", src)[1:]
bad = 0; checked = 0
for b in blocks:
    slug = b[:b.index("'")]
    m = re.search(r"\n    photos: \[(.*?)\n    \],", b, re.S)
    if not m: continue
    ids = re.findall(r"P\('([^']+)'", m.group(1))
    page = f'dist-katrin/verkefni/{slug}/index.html'
    if not os.path.exists(page) or len(ids) < 2: continue
    h = open(page).read()
    i = h.find('class="ki-proj-gallery"')
    if i < 0: continue
    g = h[i:h.find('ki-proj-adj', i)]
    shown = []
    for part in re.split(r'<div class="ki-gal-', g)[1:]:
        f = re.findall(r'/rs/([a-zA-Z0-9-]+?)-\d+\.(?:avif|webp)', part)
        if f: shown.append(f[0])
    checked += 1
    if shown != ids[1:]:
        bad += 1
        print(f'OUT OF ORDER  {slug}\n   hers : {ids[1:]}\n   shown: {shown}')
print(f'{checked} project galleries checked, {bad} out of her order')
sys.exit(1 if bad else 0)
