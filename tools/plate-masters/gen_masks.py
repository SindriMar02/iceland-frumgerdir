#!/usr/bin/env python3
"""Natural ridge-line alpha masks for the emperador marble plates.

The previous masks were a fixed-period sine wave -> reads as a repeating
decorative scallop, not a rock edge. This uses fractal midpoint displacement
(the standard terrain-generation algorithm) so the line never repeats, plus a
real Gaussian feather on the alpha so it isn't a hard vector cutout.

Both plates share the same COARSE displacement (first N halvings) so their
macro silhouette stays coherent where they overlap, then diverge in fine
detail only - same principle as before, applied to a non-periodic curve.
"""
import random
from PIL import Image, ImageFilter, ImageDraw

W, H = 2000, 1906

def midpoint_displacement(seed, n_iter=9, roughness=0.55, base=0.0, spread=1.0):
    rnd = random.Random(seed)
    pts = {0: base + (rnd.random() * 2 - 1) * spread,
           1: base + (rnd.random() * 2 - 1) * spread}
    for it in range(n_iter):
        scale = spread * (roughness ** it)
        step = 1 / (2 ** it)
        new_pts = dict(pts)
        keys = sorted(pts.keys())
        for a, b in zip(keys, keys[1:]):
            mid = (a + b) / 2
            new_pts[mid] = (pts[a] + pts[b]) / 2 + (rnd.random() * 2 - 1) * scale
        pts = new_pts
    xs = sorted(pts.keys())
    return [pts[x] for x in xs]

def build_curve(shared_seed, detail_seed, n_iter=10):
    coarse = midpoint_displacement(shared_seed, n_iter=5, roughness=0.6, spread=1.0)
    # upsample coarse to act as the base offset for the fine pass, by
    # re-running displacement seeded off it isn't simple linear interp,
    # so just add a second, higher-iteration, lower-amplitude pass keyed
    # off a different seed on top of a resampled coarse curve.
    n_coarse = len(coarse) - 1
    fine = midpoint_displacement(detail_seed, n_iter=n_iter, roughness=0.52, spread=0.28)
    n_fine = len(fine) - 1
    out = []
    for i in range(n_fine + 1):
        t = i / n_fine
        ci = t * n_coarse
        c0 = int(ci)
        c1 = min(c0 + 1, n_coarse)
        cf = ci - c0
        cval = coarse[c0] * (1 - cf) + coarse[c1] * cf
        out.append(cval + fine[i])
    return out

def normalize(curve, lo, hi):
    mn, mx = min(curve), max(curve)
    return [lo + (v - mn) / (mx - mn) * (hi - lo) for v in curve]

def render_mask(curve_norm, edge_base_frac, feather_px, invert_above=True):
    """curve_norm: 0..1 values -> pixel Y offsets around edge_base_frac*H.
    invert_above=True: opaque BELOW the line (stone occupies lower part)."""
    n = len(curve_norm)
    img = Image.new('L', (W, H), 0)
    draw = ImageDraw.Draw(img)
    poly = []
    for i, v in enumerate(curve_norm):
        x = i / (n - 1) * W
        y = edge_base_frac * H + (v - 0.5) * H * 0.30
        poly.append((x, y))
    poly.append((W, H))
    poly.append((0, H))
    draw.polygon(poly, fill=255)
    img = img.filter(ImageFilter.GaussianBlur(feather_px))
    return img

random.seed(42)
SHARED = 4200

curve_mid_norm = normalize(build_curve(SHARED, 101), 0, 1)
curve_near_norm = normalize(build_curve(SHARED, 202), 0, 1)

mask_mid = render_mask(curve_mid_norm, edge_base_frac=0.34, feather_px=22)
mask_near = render_mask(curve_near_norm, edge_base_frac=0.46, feather_px=26)

mask_mid.save('/tmp/ki-mask-check/new-mask-mid.png')
mask_near.save('/tmp/ki-mask-check/new-mask-near.png')

def pct_opaque(img):
    hist = img.histogram()
    total = sum(hist)
    # weight by value/255 as a soft "opacity fraction"
    weighted = sum(v * i for i, v in enumerate(hist)) / 255
    return weighted / total * 100

print('mid opaque%', round(pct_opaque(mask_mid), 1))
print('near opaque%', round(pct_opaque(mask_near), 1))
