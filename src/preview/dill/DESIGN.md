# Design System: DILL (Zimmerl design, re-aimed)

Route `/preview/dill` (Icelandic) and `/preview/dill/en`. One page, like the reference.

## 1. Visual Theme & Atmosphere
Candle-lit and quiet. A dark leaf-green room where everything warm is one rowan amber, and depth comes from
huge blurred glows parked half off-screen behind alternate sections. Photography carries the page: the
oxblood dining room, amber preserve jars, dried herbs, the country. Native scroll, no menu, no preloader.
Dials: variance 6, motion 6, density 4 (all three set by the reference, not by taste).

Idea in one sentence: **the room and the larder, by candlelight** (the November 2024 dining-room shoot and
the ingredient still lifes, both in Dill's own media library).

## 2. Color Palette & Roles
- **Leaf Ground** `#141C12` page, and the fade target of every glow
- **Card Green** `#1B2818` the welcome card
- **Rowan Amber** `#D19A55` every heading, numeral, label, icon and the cursor (the only warm colour)
- **Dill Green** `#34501B` button fill, darkened from the logo green `#59832D` for AA with the label
- **Button Label** `#EFCD90` label on the button (contrast on `#34501B` above 6:1)
- **Wall Glow** `#6B3226` the second glow, sampled from the oxblood dining-room wall
- **Leaf Glow** `#496B35` the first glow, the logo green desaturated
- Body copy: white at 64% (about 7:1 on the ground)

## 3. Typography Rules
- **Display:** Sprat Light, uppercase (role of Valky: wide, elegant, quirky caps). Numerals: Sprat Condensed Light.
- **Label / lead / buttons:** Jost 300 (role of Nord; echoes Dill's own thin lettering in the logo).
- **Body:** Gambetta Regular 18px, 16px on phones.
- All five files verified for Þ Ð Æ Ö and every acute (fontTools cmap). Self-hosted in `public/fonts/dill/`.
- The reference's display scale (52 / 47 / 40 / 37 / 30px) is re-fitted to Sprat's wider caps: 46 / 42 / 36 / 33 / 27px.
  Icelandic titles are audited for line breaks at 320 to 1440.

## 4. Component Stylings
- **Button:** 4px radius, 12px 15px, Jost 300 12px caps, 1px tracking, thin arrow. 44px minimum height (reference: 38px).
- **Reels:** click anywhere to advance one item (300ms ease), looped; a mobile disc does the same and is keyboard-focusable.
- **Stack:** five cards, each click moves all forward, dot line beside (below on phones).
- **Cursor:** amber dot plus ring on a 0.1 lerp; turns into an arrow disc over the reels and the stack. Fine pointers, 768px and up only.
- **Focus:** a visible 2px amber ring on every control (the reference removes it).

## 5. Layout Principles
Bootstrap-3 grid widths from the reference (shell 750 / 970 / 1170 / 1460), one bleed container running off the right edge,
`--dl-line` = one real body line (`1lh`) for vertical gaps, never a px constant.

## 6. Motion & Interaction
Everything from the reference's catalogue: SplitText character reveal (y 20, 1s power2.out, 0.05 stagger, replays on every
entry), picture drift y -60 to 0 on a 3s scrub, numerals sliding 60px left (fine pointers), hero fade 1s + Ken Burns 1.35 to 1,
5s autoplay. Reduced motion is a plain render branch: nothing is hidden, no autoplay, no scrub, no cursor.

## 7. Anti-Patterns (Banned here)
No invented facts (no opening hours: none are published anywhere). No Michelin artwork (a plain star and text linking to the
guide). No 2017 room photographs as the current room (the oxblood 2024 shoot is the room). No stock. No em-dashes in copy.
Nothing from the reference's own fonts, photos, copy or award logos.

## Sources for every fact
`data.ts` tags each string: [W] dillrestaurant.is, [N] noona.app/dill, [M] guide.michelin.com, [S] Skatturinn.
