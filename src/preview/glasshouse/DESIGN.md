# The Glass House — "Upp" (looking up)

**Design read:** premium one-room stay prototype for an international couple
audience, concept-led because the property is small (1 bedroom, 2 guests) and
20 minutes from Reykjavík. The page's gravity points UP: every other build in
the catalogue shows a horizon; this one puts you on your back under the
skylight. Verified anchor: a real square skylight sits directly over the bed
(their photo), glass walls on two corners, barrel sauna and wood hot tub in
birch scrub.

**Dials:** VARIANCE 7 · MOTION 7 · DENSITY 3.

## Tokens

- **Type:** Cabinet Grotesk only (Regular 400 + Medium 500). No second family,
  no mono. Tracking scales with size: -0.03em display, -0.015em headings,
  0 body (Lightship discipline).
- **Palette:** sky-led light page. `--gh-sky #DFE7EE` (cold morning sky) page
  ground, `--gh-ink #1C2228` text, `--gh-birch #8A9179` (scrub green-grey)
  secondary surface, accent `--gh-ember #C97B4A` (evening light through
  glass) used once per screen at most. Night section (aurora) drops to
  `#0B1016` with the same ember accent. AA-checked pairs only.
- **Radius:** 0 everywhere except the capsule nav pill (12px) — the page is a
  window system, windows are rectilinear.

## Structure (7 sections, no family repeated)

1. **Hero — the ceiling.** Full-bleed `skylight.jpg` (the real over-bed
   skylight photo). Wordmark GLASS HOUSE oversized and scaled DOWN into place
   from 1.14 (settling toward the viewer, blur 14px→0), the only build whose
   wordmark arrives on the z-axis. Scroll-away: recedes UP and out through
   the glass (y -90, scale .96, blur back in).
2. **Manifesto** — one paragraph beside `bed-summer.jpg` (drift frame): the
   house is an instrument for lying down and looking up.
3. **THE WINDOW (signature pinned device).** A fixed skylight aperture
   (rectangular frame with the room's ceiling as surround) stays put while
   the SKY moves through it — inverted parallax: the sky layer translates
   DOWN as you scroll down (opposite of every parallax default), day sky →
   sunset → star field → `aurora-house.jpg` finale. Driven by one pinned
   ScrollTrigger, monotonic, clamp guarded. Reduced motion: static aurora
   frame with caption.
4. **Warm water, cold air** — sauna + hot tub row: `sauna-barrel.jpg`,
   `hottub-snow.jpg`, `pool-moss.jpg`; equal-height drift frames, the
   "wake-up sauna, goodnight bathe" review line as the header (verbatim,
   attributed).
5. **Winter/summer toggle band** — full-bleed `bed-winter.jpg` vs
   `bed-curtains.jpg` cross-clip on scroll (single clip-path inset sweep, one
   use, not the GC split).
6. **Guests** — three verbatim quotes (Toby, Richard, Goldie) + rating strip
   4.99 / 70 reviews.
7. **Booking + owner note** — request form (localStorage demo →
   /stjornbord), Agla & Haffi named as hosts, facts strip (2 guests · sauna ·
   hot tub · 20 min from Reykjavík).

## Motion identity (one per site)

"Settling downward": every reveal arrives from ABOVE (y -16 → 0), inverting
the house default; the wordmark z-settle; the sky device scrolls the wrong
way. Drift frames everywhere per Heklusýn spec (`--dz`, batched ticker,
gated off during the pin).

## Loader

Conic-gradient ring (mask: conic-gradient) around a skylight-proportioned
rectangle that fills with sky blue as real progress loads (hero decode +
fonts.ready). 1.1s floor, 2.4s cap, once per session, ?loader forces, never
under reduced motion. Exit: the rectangle expands to the full viewport (the
skylight becomes the page) via clip-path.

## Facts gate (all from the listing, retrieved 2026-08-06)

Host Agla (with Haffi), 12 years hosting, Superhost. 4.99 · 70 reviews.
1 bedroom, 2 guests. Sauna + hot tub. Mosfellsbær, ~20 min from Reykjavík
(guest reviews repeatedly say "20 minutes to town"). Golden Circle base.
NO price on page. Aurora shown only via their own night photos; copy never
promises sightings ("Clear nights are never promised" register).
