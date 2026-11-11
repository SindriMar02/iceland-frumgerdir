# Bílageirinn · True Line — design tokens (v2, locked 2026-09-22)

One idea: a damaged panel has exactly one correct line, and the shop's whole
value is finding it again. Every device on the page is that line: it is drawn
under the headline on load, bent-then-true beside the claims process, drawn
under the phone number at the conversion moment. Nothing else decorates.

## Colour
| token | value | use |
| --- | --- | --- |
| BG | `#0F0D0B` | page ground, html/body, awning, phone bar |
| SURFACE | `#1A1613` | alternating bands (facts, claims, footer) |
| INK | `#F3F0EA` | display type, body copy, links |
| MUT | `#A9A399` | labels, bylines, metadata only, never paragraphs |
| AMBER | `#E8A23D` | the line, numerals, actions. Rationed. |
| DARKINK | `#131313` | text on amber |
| HAIR | `rgba(243,240,234,0.14)` | every rule |

## Type
- Display: Projekt Blackbird (uppercase only; Æ composed in-house), `clamp(2rem, 4.4vw, 3.4rem)` for h2, hero `clamp(3rem, 9vw, 6rem)`.
- Body: Archia Regular, 17px paragraphs, 15–16px secondary, always INK.
- Chrome: Geist Mono 400/500, tracked 0.14–0.22em uppercase for labels.
- Logo lockup only: Inter Logo subset (matches the real wordmark).

## Geometry
- Pill radius on ACTIONS only (buttons). Media 26px. No boxed content:
  no cards, no bordered panels, no gradient scrims except the hero legibility
  scrim over the cycling photo. Form fields are a hairline under type.
- Container 1320px, gutters 20/32px, section rhythm py-24 / md:py-36.

## Motion
- Ease `cubic-bezier(0.23, 1, 0.32, 1)` everywhere.
- Reveals: 0.65s rise (20px) starting as the block crosses 88% of the viewport, once.
- Signature: the claim rail line is scroll-scrubbed (bent → true); the hero
  line, thesis underline and contact line are one-shot draws on entry.
- Hero: 6.5s photo crossfade with slow drift, alignment scan on first load only,
  parallax 22%. All gated off on phones and under reduced motion.
- Buttons: light sheen on hover (pointer only), `scale(0.97)` on press.
- Lenis on desktop pointer devices only. Never on touch.

## Mobile chrome (fixed standard)
Constant opaque bar from first paint with the phone pill; sticky 106px awning
at top −100px behind it; html/body carry BG; root `overflow-x: clip`.

## Facts
Every sentence traces to bilageirinn.is, DV (2019-03-15, 2019-09-15), Víkurfréttir
(2018-04-20), bgs.is félagatal, ja.is or the live Google listing. See `data.ts`.
