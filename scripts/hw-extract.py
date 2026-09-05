"""Extract glyph outlines from a font into SVG path data.

Emits, per requested string: one entry per word, each with its glyphs' path `d`
(already y-flipped into SVG space with the baseline at y=0) and the word's
advance width, plus the tight bounding box of the whole string.
Coordinates are scaled so 1 em = 100 units.
"""
import sys, json, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

EM = 100.0

def extract(font_path, text):
    f = TTFont(font_path)
    upm = f['head'].unitsPerEm
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    hmtx = f['hmtx']
    s = EM / upm
    words, bounds = [], []
    for word in text.split(' '):
        glyphs, x = [], 0.0
        for ch in word:
            gname = cmap.get(ord(ch))
            if gname is None:
                raise SystemExit(f'MISSING GLYPH {ch!r} ({hex(ord(ch))}) in {font_path}')
            adv = hmtx[gname][0] * s
            pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}')
            gs[gname].draw(TransformPen(pen, Transform(s, 0, 0, -s, x, 0)))
            d = pen.getCommands().strip()
            bp = BoundsPen(gs)
            gs[gname].draw(TransformPen(bp, Transform(s, 0, 0, -s, x, 0)))
            if d:
                glyphs.append({'c': ch, 'd': d, 'adv': round(adv, 2)})
                if bp.bounds:
                    bounds.append(bp.bounds)
            x += adv
        words.append({'glyphs': glyphs, 'width': round(x, 2)})
    if bounds:
        bx = [min(b[0] for b in bounds), min(b[1] for b in bounds),
              max(b[2] for b in bounds), max(b[3] for b in bounds)]
    else:
        bx = [0, 0, 0, 0]
    return {'em': EM, 'words': words, 'bbox': [round(v, 2) for v in bx]}

if __name__ == '__main__':
    font = sys.argv[1]
    print(json.dumps({t: extract(font, t) for t in sys.argv[2:]}, ensure_ascii=False))
