"""
Both of Katrín's gates, from one pipeline.

The page descends into rock at the top and climbs back out of it where the
dark chapter hands back to the light one. Same photographer's material, same
grade, same maths — a different formation and a different direction.

THE KEY IS THE WHOLE JOB. The first pass keyed on brightness (lum < 150) and
shredded clean blocky ridges into combs: basalt block tops carry pale lichen
at luminance 190-215, which a brightness test calls sky, so those columns'
crests fell through to the next dark crack while the unlichened columns beside
them kept their true top. Measured on the shipped entry plate: 409 of 2400
columns keyed as much as 82px too low, and the pixels behind those slits are
flat luminance 103 — graded SKY, against rock whose own 99th percentile is 92.
Every one of them was a bright sliver cut into the ridge.

The sky is not merely bright, it is SMOOTH: a render's flat overcast, local
sigma 1-3. Rock is never smooth, lichen least of all. So sky is bright AND
featureless, everything else is stone whatever its brightness, and a
grey-scale opening across 21 columns takes out what noise remains without
touching a real step between blocks, which is dozens of columns wide.
"""
from PIL import Image
import numpy as np, colorsys
from numpy.lib.stride_tricks import sliding_window_view
Image.MAX_IMAGE_PIXELS = None

FLOOR = np.array([29., 27., 25.])          # #1D1B19, the page's own charcoal
DEST = '/Users/sindri/Documents/Website redesign mockups/_worktrees/_ki-wt/public/katrinisfeld'


def boxblur(a, r):
    p = np.pad(a, r + 1, mode='edge')
    c = p.cumsum(0).cumsum(1)
    k = 2 * r + 1
    s = c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]
    return s[:a.shape[0], :a.shape[1]] / (k * k)


def morph(sig, w, first_max):
    def f(x, mx):
        v = sliding_window_view(np.pad(x, w // 2, mode='edge'), w)
        return v.max(axis=-1) if mx else v.min(axis=-1)
    return f(f(sig, first_max), not first_max)


def gate(src, names, hold, fall, tail, above=90, lit=(55, 655)):
    raw = np.asarray(Image.open(src).convert('RGB')).astype(np.float64)
    H, W = raw.shape[:2]
    lum = raw.mean(axis=2)

    mu = boxblur(lum, 4)
    sigma = np.sqrt(np.maximum(boxblur(lum * lum, 4) - mu * mu, 0))
    sky = (lum > 150) & (sigma < 6.0)
    K = 40
    cs = np.cumsum((~sky).astype(np.int32), axis=0)
    sust = (cs[K:] - cs[:-K]) >= K * 0.75
    crest = np.argmax(sust, axis=0).astype(np.float64)
    crest[~sust.any(axis=0)] = H
    crest = morph(crest, 21, True)          # closing: no lone spires
    crest = morph(crest, 21, False)         # opening: no lone slits
    crest = np.convolve(np.pad(crest, 4, mode='edge'), np.ones(9) / 9., mode='valid')
    mc = crest.mean()

    # the same grade both gates carry: highlight compression, then the gain
    # that takes greyish basalt to hue 33 deg / sat 27% — measured off the
    # approved hero plate, not chosen
    g = np.where(raw < 40., raw, 40. + (raw - 40.) * 0.45) * np.array([1.14, 1.01, 0.86]) * 0.82

    # THE HOLES IN THE RIDGE. A crest is one row per column, but a real ridge
    # has sky visible BELOW its highest point — between the block tops, where
    # you see straight through to the horizon. Those pixels sit under the
    # crest, so they stay opaque, and they are sky: graded down they land at
    # luminance 98-110 against rock whose median is 22, which printed as pale
    # cream halos outlining every block. (The old bad key hid them by accident,
    # by pushing the crest down PAST them — the picket fence was the price.)
    # A gap between basalt blocks is a shadowed void, so that is what it is
    # painted: floor, feathered, indistinguishable from the crack it is.
    ys0 = np.arange(H, dtype=np.float64)[:, None]
    hole = np.clip((boxblur((sky & (ys0 > crest[None, :])).astype(np.float64), 2) - .12) / .5, 0, 1)
    print(f'   holes below the crest: {100 * (hole > .5).mean():.2f}% of the frame')
    g = g * (1 - hole)[..., None] + FLOOR * hole[..., None]

    # light stops reaching down. Held at full value for `hold` px under each
    # column's own crest — the sky IS the light source, so the shelf directly
    # beneath a crest is the one lit thing in the frame and a ridge without it
    # is a black cutout — then falling to floor over `fall`. The second,
    # crest-independent term guarantees every column is at floor by
    # mc + hold + fall whatever its own crest did, because the row sitting at
    # the top of the frame when the near plate is at rest has to be floor
    # exactly: anything lighter prints as a band across the join.
    # and the rim itself. An edge seen against a bright sky is a silhouette:
    # the light is behind it, not on it. Without this the topmost rows sample
    # the lit face of each block and print a pale outline tracing the whole
    # ridge — a halo, which is the tell of a cut-out rather than a horizon.
    g = g * (0.42 + 0.58 * np.clip((ys0 - crest[None, :]) / 11., 0., 1.))[..., None]

    ys = np.arange(H, dtype=np.float64)[:, None]
    t = np.clip(np.maximum((ys - crest[None, :] - hold) / fall,
                           (ys - (mc + hold - 140.)) / (fall + 140.)), 0., 1.)
    w = (1. - t) ** 1.6
    out = g * w[..., None] + FLOOR * (1. - w)[..., None]

    alpha = np.clip((ys - crest[None, :]) / 3.0 + 0.5, 0., 1.) * 255.
    out = np.where(alpha[..., None] > 0.5, out, FLOOR)     # no sky to fringe from
    rgba = np.concatenate([np.clip(out, 0, 255), alpha[..., None]], axis=2).astype(np.uint8)

    y0, y1 = int(crest.min() - above), int(mc + tail)
    crop = rgba[y0:y1]
    ch = y1 - y0
    print(f'\n{src}  crest mean {mc:.0f} min {crest.min():.0f} max {crest.max():.0f}'
          f'  ->  plate 2400x{ch}')
    fracs = {}
    for name, x0, flip in names:
        win, cw = crop[:, x0:x0 + 2400], crest[x0:x0 + 2400]
        if flip:
            win, cw = win[:, ::-1], cw[::-1]
        fracs[name] = (cw.mean() - y0) / ch
        Image.fromarray(win).save(f'{DEST}/{name}.webp', quality=88, method=6)
        print(f'   {name:<12} x={x0:<4} flip={str(flip):<5} crest {fracs[name]:.4f}')
    band = crop[int(mc - y0) + lit[0]:int(mc - y0) + lit[1], 240:2640]
    s = band[..., :3][band[..., 3] > 240].astype(np.float64)
    m = s.mean(axis=0); h, sa, _ = colorsys.rgb_to_hsv(*(m / 255.))
    print(f'   lit band  rgb {m.round(1)}  lum {s.mean(axis=1).mean():.1f}'
          f'  p90 {np.percentile(s.mean(axis=1), 90):.1f}  max {s.mean(axis=1).max():.1f}'
          f'  hue {h*360:.0f}  sat {sa*100:.1f}%  R-B {(s[:,0]-s[:,2]).mean():+.1f}')
    foot = crop[-40:, :, :3].astype(np.float64)
    print(f'   floor rows {foot.mean(axis=(0,1)).round(2)}  max deviation {np.abs(foot-FLOOR).max():.2f}')
    return fracs


# THE DESCENT — standing columns, held lit for 500px under the crest because
# at rest only the top 150px of it is on screen and that band has to read as
# material, then to floor by 2400px, which is inside the 2775px the frame
# demands at the bottom of the pin on a 16:10 screen.
e = gate('entry-raw.png', [('stone-far', 0, False), ('stone-mid', 240, True),
                           ('stone-near', 480, False)], hold=500., fall=1900., tail=2600.)
# THE ASCENT — stacked shelves. A shorter hold and a shorter fall: this plate
# starts three quarters of a frame ABOVE the viewport, so far less of it is
# ever on screen at once, and floor has to arrive by 1125px.
x = gate('exit-raw.png', [('gate-far', 0, False), ('gate-mid', 240, True),
                          ('gate-near', 480, False)], hold=260., fall=790., tail=1250.)
print('\nHome.tsx crest values:')
for k, v in {**e, **x}.items():
    print(f'  {k:<12} {v:.4f}')
