# Glass Cottages — "Blár og Grænn" (the two-sided page)

**Design read:** premium-stay one-pager for a two-cottage glass retreat in a
500-hectare Hella lava field, ~$1,300/night, design-led international guests.
Dials: VARIANCE 8 · MOTION 8 · DENSITY 3.

## The one idea

**One lava field, two skies.** Two identical glass cottages 200m apart: Blár
(blue — lagoons, glaciers, ice) and Grænn (green — moss, aurora). The page is
built around that duality with the MERSI device: **opposing clip-path reveals**
(`inset()` only — no opacity toggles). Blár material reveals from the TOP,
Grænn from the BOTTOM, and at the centre of the page the two meet in a split
chooser whose centre label clips in sync with the sides (the exact MERSI
mechanism, measured from their own write-up).

1. **Loader** — house system + conic ring. Exit: the sheet SPLITS — top half
   clips up, bottom half clips down (two stacked divs, `inset` transitions) —
   the page opens like the two cottages parting.
2. **Hero** — `sunset-cottage.jpg` (glass gable holding the sunset at blue
   hour). Wordmark GLASS COTTAGES resolves from a doubled refraction: two
   copies offset ±0.06em with reduced opacity converge to one solid mark
   (transform + opacity only). Scroll-away: it re-splits, halves drifting apart
   as the hero leaves. Entrance on the copies, scrub on the parent.
3. **The field** — 500 hectares, no neighbours, wildlife haven (no hunting).
   `lava-field` wide with drift; single poetic paragraph, ballenacabo register.
4. **THE CHOOSER (signature)** — pinned split: left column Blár images clipping
   from top, right column Grænn/aurora images clipping from bottom, scrubbed;
   centre label ("Two cottages · 200 metres apart") clips with the same insets.
   Choosing a side (click/tap) FLIP-morphs that card into the section hero
   (GSAP Flip.fit, 1.2s expo.inOut — the MERSI cover move) and tints the
   accent: Blár `#7FA8C9` / Grænn `#7FA889`. Under 1024px: no pin; the two
   stacks alternate, chooser is two tap cards.
5. **Inside** — bright interiors (`interior-bright`, `bed-view`, `kitchen-dark`):
   driftwood furniture from Ísafjörður beaches, naturally-dyed hand-knitted
   wool, rescue-farm materials, own well, sunlight as primary warmth. All real,
   all from their listing text.
6. **Night** — `aurora-gable` full-bleed: the aurora THROUGH the glass roof.
   Auto-rotating verbatim quotes (Eric, Toronto: "look forward to coming back
   next winter to experience the aurora"; Nick: midnight sun; Ashley: "peaceful,
   beautiful, incredibly well thought out"). Clear-nights-never-promised line.
7. **Enquiry** — two-sided demo form with a Blár/Grænn cottage picker →
   /preview/glasscottages/stjornbord. CTA "Enquire about your stay".

## Type & colour

- **One family: Satoshi.** 400 body, 500 display/CTA. Tracking −0.04em display,
  −0.02em headings, 0 body. Labels ≥12px, ≤1 per 3 sections.
- **Palette:** basalt night `#101418` (page ground — this build is DARK; the
  glass boxes glow out of a dark field in every hero-grade photo), bone text
  `#E8ECEA`, and the two accents Blár `#7FA8C9` / Grænn `#7FA889` which are
  POSITIONAL, not decorative: Blár's accent only in Blár contexts, Grænn's in
  Grænn contexts, neutral sections carry no accent. AA-checked on `#101418`.
- One theme, no mid-page flips; the bright-interior section uses a bone panel
  INSIDE the dark page (same family).

## Motion inventory

- Heklusýn drift on every frame (`.gc-frame`/`.gc-frame-in`), gated during pin.
- All reveals are `clip-path: inset()` per MERSI — Blár-side elements clip from
  top, Grænn-side from bottom, everywhere on the page, so the duality is a
  SYSTEM, not a section. CSS transitions IO-armed; visible defaults.
- Capsule nav; conic loader ring; word-mask headlines; reduced-motion collapse.
- Flip morph only on the chooser (the one Flip on the page).

## Assets

public/glasscottages/: sunset-cottage (HERO), gable-straight, aurora-roof,
aurora-wide, aurora-gable, aurora-cottage, sunset-tub, glow-dusk, silhouette,
bed-view, bed-view-b, bed-white, daybed, interior-bright, interior-navy,
kitchen-dark, kitchen-bright, lava-field, robes, hottub-deck, sunstar,
winter-white, sunset-mirror, dusk-blue (+ -800). Fonts: Satoshi Reg/Med woff2.

## Facts gate (live listing + glasscottages.com, 2026-08-06)

Host Ari, Superhost, 13 years. Designed by Ari, Gábor and Andrej. Family-owned.
4.97 · 588 reviews (Blár listing). 2 guests · 1 queen · 1 bath per cottage.
Two cottages: Blár and Grænn, 200m apart, 500 ha lava field near Hella.
Private hot tub each; floor heating; driftwood/wool/rescue-farm interiors; own
well; vegan-friendly; no hunting on grounds. Licence IG-REK-015406. Base for
Golden Circle + south coast. Contact hello@glasscottages.com · +354 691 2012
(site). NO prices on page. Photography: their own (site + listing), 2026-08-06.
Their real booking engine exists (book.glasscottages.com) — the demo form is a
DESIGN demo, footer must not claim they lack direct booking.
