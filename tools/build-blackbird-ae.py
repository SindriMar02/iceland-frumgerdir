"""Extend ProjektBlackbirdIS with the Æ it never got.

The SNDR build extended Blackbird's UPPERCASE Icelandic set in-house
(acutes, Ö, Ð, Þ) but missed Æ — which Bílageirinn's copy needs in
VERKSTÆÐIÐ, NÁKVÆMNI, ÞJÓNUSTUVERKSTÆÐI. Æ is composed here from the
font's own A and E at their native weight: both outlines are drawn into
one glyph and overlap-filled by the nonzero winding rule (no boolean
union needed, and no redrawing of letterforms by hand).

Lowercase Icelandic codepoints are additionally mapped onto the
uppercase glyphs. Display use is uppercased in CSS so these are never
normally reached; the mapping only keeps a stray untransformed string in
the Blackbird face instead of dropping to an Arial Black fallback.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

SRC = '/Users/sindri/Documents/Website redesign mockups/sndr-studio/public/fonts/blackbird/ProjektBlackbirdIS.otf'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/fonts/blackbird/ProjektBlackbirdIS-ext.otf'
OVERLAP = float(sys.argv[2]) if len(sys.argv) > 2 else 200.0  # 200 chosen by eye

f = TTFont(SRC)
gs = f.getGlyphSet()
cff = f['CFF '].cff
td = cff[cff.fontNames[0]]

def bounds(name):
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    return bp.bounds  # xMin, yMin, xMax, yMax

aw = f['hmtx']['A'][0]
ew = f['hmtx']['E'][0]
abx = bounds('A')
ebx = bounds('E')

# Slide E left so its left sidebearing lands on A's right edge, then pull it
# further by OVERLAP so the two strokes fuse instead of merely touching.
dx = abx[2] - ebx[0] - OVERLAP
new_w = int(round(dx + ew))
name = 'AE'

pen = T2CharStringPen(new_w, gs)
gs['A'].draw(pen)
gs['E'].draw(TransformPen(pen, (1, 0, 0, 1, dx, 0)))
cs = pen.getCharString()
cs.private = td.Private

# CFF needs the charstring appended to the index and indexed by name; the
# dict-style setter only works for glyphs that already exist.
strings = td.CharStrings
strings.charStringsIndex.append(cs)
strings.charStrings[name] = len(strings.charStringsIndex) - 1
if name not in f.getGlyphOrder():
    f.setGlyphOrder(f.getGlyphOrder() + [name])
if name not in td.charset:
    td.charset.append(name)
f['hmtx'].metrics[name] = (new_w, int(round(abx[0])))

# Æ, plus lowercase fallbacks onto the existing uppercase glyphs.
extra = {0x00C6: 'AE', 0x00E6: 'AE', 0x00FE: 'Thorn', 0x00F0: 'Eth',
         0x00F6: 'Odieresis', 0x00E1: 'Aacute', 0x00E9: 'Eacute',
         0x00ED: 'Iacute', 0x00F3: 'Oacute', 0x00FA: 'Uacute', 0x00FD: 'Yacute'}
order = set(f.getGlyphOrder())
for t in f['cmap'].tables:
    if t.isUnicode():
        for cp, gn in extra.items():
            if gn in order:
                t.cmap[cp] = gn

f.save(OUT)
print(f'built {OUT}  (A={aw} E={ew} dx={dx:.0f} AEwidth={new_w}, overlap={OVERLAP})')
