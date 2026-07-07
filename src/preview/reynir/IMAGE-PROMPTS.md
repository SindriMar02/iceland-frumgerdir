# Reynir bakari — pistasíusnúður hero image (1 shot)

**Generate in the Higgsfield WEB APP (higgsfield.ai) with an UNLIMITED model —
Seedream 4.5, Unlimited toggle ON = zero credits. Do NOT generate via the
Higgsfield MCP (always burns credits). Best background accuracy: Recraft V4.1
`utility` mode with `background_color: #131313` IF it's on your unlimited tier.**

## What a pistasíusnúður is
An Icelandic **pistachio swirl bun** (snúður): a cinnamon-roll-style spiral of
golden-brown baked dough, topped with a **pale green pistachio glaze / frosting**
spread over the swirl, and sprinkled with **chopped green pistachios**. Greenish
pistachio filling shows in the swirl. (Sources: gotteri.is, mbl.is 2025.)

## The shot
| File | Drops into | Size |
|---|---|---|
| `pistasiusnudur.jpg` | `public/reynir/pistasiusnudur.jpg` | 1:1, ≥1600px |

Same rules as the Passion hero so it spins cleanly on scroll: **perfect top-down,
centered**, on a **flat solid #131313** ground (so the square edges dissolve into
the page), with a **soft radially-even contact shadow** (no directional offset —
an off-axis shadow looks wrong mid-rotation).

## Prompt (Seedream 4.5 / Recraft utility, 1:1, 4K)

> Ultra realistic overhead studio photograph of a single freshly baked pistachio
> cinnamon roll (snúður), shot directly from above, perfectly centered. Golden
> brown laminated spiral dough, a pale green pistachio glaze spread over the
> swirl, generous chopped green pistachios sprinkled on top, a hint of green
> pistachio filling in the layers. Background is a seamless flat solid near-black,
> exact hex #131313, completely uniform edge to edge, no texture, no gradient, no
> props, no plate, no crumbs. Soft warm overhead key light, a delicate gold rim
> light around the roll, one small soft even contact shadow directly beneath it.
> Moody premium dark food photography, razor sharp detail, square 1:1.

## After generating (paste the URL to Claude, or do it yourself)
1. Download, then flatten the near-uniform background to EXACT #131313 and
   optimize (same recipe as the Passion Cinnabon):
   `magick raw.png -fuzz 11% -fill "#131313" -floodfill +0+0 "#141414" ... -resize 1400x1400 -quality 90 public/reynir/pistasiusnudur.jpg`
2. Verify in-browser that the image edges decode rgb(19,19,19) == page ground.
3. The featured "Pistasíusnúður" medallion picks it up automatically and spins
   on scroll. Commit `public/reynir/pistasiusnudur.jpg` + deploy.

---

# Shot 2 (fallback) — torn-open pistachio snúður (static product image)

If the travelling-medallion animation doesn't feel premium enough on real
devices, drop the motion and use a rich static "hero product" shot instead:
the same pistachio snúður, TORN OPEN and gooey/mouth-watering, on the same
flat #131313 ground. Same generation rules (web app, unlimited, NOT the MCP).

## Prompt (Seedream 4.5 / Recraft utility, 1:1, 4K)

> Ultra realistic close-up food photograph of a pistachio cinnamon roll (snúður)
> torn and pulled apart into two halves, revealing a soft, steaming, layered
> interior. Golden-brown laminated spiral dough, pale green pistachio glaze
> oozing and stretching in glossy sticky strands between the two halves, gooey
> pistachio cream, chopped green pistachios, warm steam rising, moist tender
> crumb catching the light. One half lifted slightly away so the melting strands
> stretch between them. Fresh from the oven, indulgent and mouth-watering.
> Background is a seamless flat solid near-black, exact hex #131313, completely
> uniform edge to edge, no texture, no gradient, no props, no plate. Soft warm
> directional key light, gentle gold rim light, appetizing highlights on the
> glaze. Premium dark food photography, extremely sharp, slight shallow depth of
> field, three-quarter angle, square 1:1.

## After generating (paste the URL to Claude)
- It's a STATIC product image (no rotation), so no even-shadow constraint.
- Flatten the background to exact #131313 (Passion recipe) OR feather the edges
  into the page, so it blends into the product slot.
- If we drop the animation: hero shows the top-down bun (static), the featured
  "Pistasíusnúður" slot shows this torn-open shot. Simple, premium, no motion.
