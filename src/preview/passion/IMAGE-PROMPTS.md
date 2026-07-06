# Passion Reykjavík — hero image prompt (1 shot)

**Generate in the Higgsfield WEB APP (higgsfield.ai) with an UNLIMITED model —
Seedream 4.5, Unlimited toggle ON = zero credits. Do NOT generate via the
Higgsfield MCP (always burns credits, even on unlimited models).**

## The one shot needed

| File | Drops into | Size |
|---|---|---|
| `hero-cinnabon.jpg` | `public/passion/hero-cinnabon.jpg` | 1:1, ≥1600px |

The page background is **INK `#111111`**. The image background must be that
exact flat hex so the square photo edges dissolve invisibly into the page and
only the roll reads (same trick as the GK/Faxi cream-matched hero). The roll
spins on scroll, so it must be a **perfect top-down shot, centered**, with a
soft radially-even contact shadow (an off-axis shadow looks wrong mid-rotation).

## Prompt (Seedream 4.5, 1:1, 4K)

> Ultra realistic overhead studio photograph of a single large freshly baked
> Cinnabon-style cinnamon roll, shot directly from above, perfectly centered.
> Generous swirl, glossy cream-cheese glaze melting into the seams, golden
> brown laminated layers, a light dusting of cinnamon. Background is a
> seamless flat solid near-black, exact hex #111111, completely uniform edge
> to edge, no texture, no gradient, no props, no plate, no crumbs. Soft warm
> key light from above, a delicate golden rim light around the roll, one
> small soft even contact shadow directly beneath it. Moody premium dark
> food photography, razor sharp detail, square 1:1.

## After generating

1. Download the pick, then optimize:
   `magick hero-cinnabon.jpg -resize 1600x -quality 84 public/passion/hero-cinnabon.jpg`
2. If the background isn't a dead-on #111111 match, crush it:
   `magick hero-cinnabon.jpg -fuzz 6% -fill "#111111" -opaque "#0d0d0d" ...`
   (or ask Claude to composite the roll onto flat #111111 — the cutout recipe
   from the Faxi hero works here too)
3. `npm run dev` → `/preview/passion` → the hero slot picks it up automatically
   (no code change needed), then commit `public/passion/hero-cinnabon.jpg` + deploy.
