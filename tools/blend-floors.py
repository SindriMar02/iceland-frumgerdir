"""
THE SEAM IS A CHANGE OF FORMATION, NOT A CHANGE OF TONE.
The join between the descent's last frame and the way out's first is 0.63
levels — and it still read as a line, because above it the rock is standing
columns and below it the shelf plate's deepest rows, which are smooth stone
even with 55% of their grain kept, and the eye reads a change of grain as an
edge however well the brightness matches.

So the way out's plates take the COLUMNS' grain into their deepest rows: from
their own smooth floor at the top of the region to the descent plate's own
residual, row for row, at the very bottom. The join is then the same texture
on both sides — the columns simply continue — and the shelves emerge only as
the plate lifts and its own rows come into the frame. The descent's plates
are left exactly as built: the hero ends on columns. The mirrored hem is cut
from these rows, so it carries the columns too.
"""
from PIL import Image
import numpy as np
Image.MAX_IMAGE_PIXELS = None
D = '/Users/sindri/Documents/Website redesign mockups/_worktrees/_ki-wt/public/katrinisfeld/'
FLOOR = np.array([29., 27., 25.])
NG = 1400            # the deepest 1400 of 3211 rows — floor begins at 1227, so all of these are floor

def rs(a, rows):
    im = Image.fromarray(np.clip(a + 128, 0, 255).astype(np.uint8))
    return np.asarray(im.resize((a.shape[1], rows), Image.LANCZOS)).astype(float) - 128

for x in ('far', 'mid', 'near'):
    E = np.asarray(Image.open(f'{D}stone-{x}.webp').convert('RGBA')).astype(float)
    G = np.asarray(Image.open(f'{D}gate-{x}.webp').convert('RGBA')).astype(float)
    re_ = rs(E[-NG:, :, :3] - FLOOR, NG)          # the columns' own deepest rows, same count
    rg_ = G[-NG:, :, :3] - FLOOR
    t = np.linspace(0, 1, NG)[:, None, None] ** 0.8
    G[-NG:, :, :3] = np.clip(FLOOR + (1 - t) * rg_ + t * re_, 0, 255)
    Image.fromarray(G.astype(np.uint8), 'RGBA').save(f'{D}gate-{x}.webp', quality=88, method=6)
    a = E[-60:, :, :3].mean(axis=2).ravel(); b = G[-60:, :, :3].mean(axis=2).ravel()
    print(f'{x:<5} last rows: entry sigma {a.std():.1f}  gate sigma {b.std():.1f}  correlation {np.corrcoef(a, b)[0,1]:.2f}')
