from PIL import Image
import numpy as np
Image.MAX_IMAGE_PIXELS = None
"""
The page's own bedrock — the surface the dark chapter is laid on.

The hero descends INTO the rock and the exit gate climbs back out of it, so
between them the page is inside the material, not on a flat charcoal. This is
the same photograph both gates are cut from, taken from well below the crest
where there is no sky in it, graded on the identical curve, and then crushed
until it is a texture rather than a picture: mean 34 against the page's own
29, sigma 9. That is a whisper — deliberately. Anything with more contrast
than this competes with her photography, which is the one thing on the page
that has to win.

Vertically seamless by mirror, not by a blend: [A ; flip(A) without the
duplicated end rows] repeats with no join at all, which a cross-faded tile
cannot promise. Only vertical seamlessness is needed — background-size
100% auto means it never repeats sideways.
"""
raw = np.asarray(Image.open('exit-raw.png').convert('RGB')).astype(np.float64)
band = raw[2520:5120]                                   # below the deepest crest
im = Image.fromarray(band.astype(np.uint8)).resize((1440, 1300), Image.LANCZOS)
a = np.asarray(im).astype(np.float64)

g = np.where(a < 40., a, 40. + (a - 40.) * 0.45)        # the gates' own grade
g = g * np.array([1.14, 1.01, 0.86]) * 0.82

lum = g.mean(axis=2)
tgt_m, tgt_s = 34.0, 9.0
scaled = (lum - lum.mean()) / lum.std() * tgt_s + tgt_m
ratio = np.divide(scaled, np.maximum(lum, 1e-6))[..., None]
out = np.clip(g * ratio, 0, 255)

tile = np.concatenate([out, out[::-1][1:-1]], axis=0)
Image.fromarray(tile.astype(np.uint8)).save(
    '/Users/sindri/Documents/Website redesign mockups/_worktrees/_ki-wt/public/katrinisfeld/bedrock.webp',
    quality=86, method=6)
l = tile.mean(axis=2)
print('bedrock %dx%d  lum mean %.1f sigma %.1f  p1 %.0f p99 %.0f  mean rgb %s' % (
    tile.shape[1], tile.shape[0], l.mean(), l.std(), np.percentile(l, 1), np.percentile(l, 99),
    tile.reshape(-1, 3).mean(axis=0).round(1)))
print('seam: top row vs the row that follows it when repeated: %.2f levels' % np.abs(tile[0] - tile[-1]).mean())
