# Mystic Light Lodge — "ATHUGUNARSTÖÐIN" (The observation post)

Design read: premium-consumer hospitality one-pager for couples chasing
quiet, wildlife and the aurora; nocturnal instrument-like language, Mirror
House quality bar, entirely different spine. Dials: VARIANCE 8 / MOTION 6 /
DENSITY 3.

## The concept (one sentence to the owner)
Your cabin is an instrument for watching: seals at low tide, sea eagles over
the fjord, the aurora through the skylight above the bed, and the page is
built as that instrument.

Derived from THEIR material: they provide a spotting scope and binoculars
(named in reviews), the huge skylight sits directly over the bed (their own
description), and guests repeatedly report seals, eagles and northern lights
from bed. NOT the mirror-seam device, NOT a page-wide palette scrub — those
belong to Mirror House.

## Palette (sampled from their photos, 2026-08-04)
- `--ml-c`     #10141B  fjord-night canvas (from p07 #1A1D24) — DARK page
- `--ml-ink`   #DEE4E8  cold moon ink
- `--ml-amber` #D9A54E  pendant-globe amber (from p07/p15 golds) — THE accent
- `--ml-blue`  #547297  fjord blue (from p15/p01) — rationed second tone
- `--ml-velvet` #203358 the bed's blue velvet (from p07) — surface tint
Amber on night passes AA large-text easily; body copy always --ml-ink.
Aurora green appears ONLY inside photography, never as a UI colour.

## Type
- Display: **Technor** (600/400) — instrument-precise, slightly technical,
  nothing like Switzer or Cabinet. Leading ≥1.12 with Í/Á headroom.
- Body: **Supreme** (400/300), 1.62 leading.
- Log labels: **Commit Mono** — tide words, wildlife names, facts.

## Structure (10 sections)
1. Hero: p01 (black box holding the storm sky) full-bleed; wordmark MYSTIC
   LIGHT split-weight (MYSTIC light, LIGHT amber); sub-line + CTA. Fixed
   borderless chrome in mist ink (no mix-blend seam theatrics).
2. The mirror: p03 summer (wildflowers + cloud in the glass) beside the
   one-way-privacy fact (their own description line, translated honestly).
3. THE SHORE — signature interactive (the page's interaction class): a wide
   shore panorama (p13 or p16) under a SPOTTING SCOPE lens. Fine pointers: a
   circular magnifier follows the cursor (transform-only, idle-cancelling
   rAF lerp); inside it the image renders 2x via a second layer. Three quiet
   marks to find: Selir (seals' skerry), Höfnin/Haförn (the eagle sky), Húsið
   (the cabin). Touch + keyboard: three tappable/focusable hotspot buttons
   that move the lens. Honest: the lodge lends you a scope; this is that.
4. THE SKYLIGHT — signature scroll device: a skylight-shaped mask (rounded
   rect, their pane proportion) fixed centre-viewport through a pinned 220vh
   passage; THEIR skies pass through it in sequence: p04 sunset → p08 winter
   sun → p05 aurora-from-bed. Crossfade on scrub, reversible; captions are
   the guests' own words (Murat: northern lights in April from my bed).
   Distinct from Alda (wordmark-window) and MH (canvas film): a window, one
   section, three real stills.
5. Inside: blue velvet bed p06, kitchenette p09, river-stone basin p10 —
   drift frames.
6. Fjaran (the tide): p17 (sheep against the cabin, fjord blue) + Connie's
   tide-and-seals line; low-tide/high-tide words as the only labels.
7. Two cabins: p12/p16 both units; honest note that the second identical
   cabin adds a private hot tub (their own listing text).
8. Guests: 5.0 / 61 reviews / Guest favorite; themes View 32 · Location 23 ·
   Hospitality 21; quotes Alina Gabriela (Jul 2026), Ben (Jan 2026), Anne the
   architects (May 2026), Peter (Jun 2026).
9. Booking: request-to-book demo → demoStore (mysticlight_demo_*) →
   /preview/mysticlight/stjornbord; pets-welcome fact on the form (true).
10. Footer: hosts Esther & Pierre, Superhost, Búðardalur / Dalabyggð, 2h from
   Reykjavík, 30 min off Ring Road 1, check-in keypad. No licence number
   shown on the listing — none printed.

## Motion identity (ONE per site): "focus pull"
Images arrive by focusing: heavy gaussian blur + slight scale 1.04 resolving
to sharp 1.0, like glass being focused. (MH's condensation was
blur+saturate+opacity wipe on mask sweep; this is a pure lens rack — no
saturate channel, no sweep.) Text rises through word masks. Lenis wheel-only
clock, reads before writes, reversible scrubs, reduced-motion renders all,
skylight passage becomes a static triptych under reduced motion and <768px.

## Guardrails
- Dark-page contrast: every ink/amber pair AA-checked with the pixel-read
  method on photo-backed text (worst-pixel, not ancestor walk).
- The smoke/CO-alarm gap is an OWNER-pitch note, never page copy.
- Sister-listing facts only from their own description; Gleymmerey (the
  third Búðardalur mirror listing) is NOT claimed as theirs.
- No em-dashes; Icelandic tide/wildlife words verified (fjara, flóð, selir,
  haförn).
- Page-scoped `ml-` classes, --u on .ml-root, page-local keyframes,
  noindex + JSON-LD, srcset -800 variants (their PNGs re-encoded to JPEG/WebP
  at build for weight).
