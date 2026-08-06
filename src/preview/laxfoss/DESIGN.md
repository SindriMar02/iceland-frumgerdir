# Laxfoss Luxury Lodge — "Niðurá" (downstream)

**Design read:** premium-stay one-pager for international guests of a $900+/night
riverside lodge, calm-luxury language, single-typeface discipline, photography-led.
Dials: VARIANCE 7 · MOTION 8 · DENSITY 3.

## The one idea

**The page falls.** Laxfoss is the only property in the batch whose subject
never stops moving: the Norðurá drops over the falls beside the house all day,
all year. So this is the batch's only page whose spine moves DOWN — every other
build in the catalogue scrolls sideways, palettes, or drafts. Structure:

1. **Loader** — house system (real progress: hero decode + fonts.ready), with a
   conic-gradient ring (Lightship's `mask: conic-gradient`) instead of the bare
   numeral. Exit: the sheet falls AWAY DOWNWARD (translateY(100%)), the only
   build whose loader exits down — the first fall of the page.
2. **Hero** — `waterfall-aerial.jpg` full-bleed: the lodge on its bluff directly
   above the falls, Baula behind. Wordmark LAXFOSS pours in from above
   (yPercent −116 → 0, per-letter stagger, expo.out) under a hairline that draws
   across like the water's brink. Scroll-away: the name falls off the bottom of
   its mask (y +, scrub) while the brink line runs on. Entrance drives yPercent,
   scrub drives y — never the same component.
3. **The drop (signature scrub)** — pinned section: `rapids-dark.jpg` (the dark
   aerial of the rapids) fills the frame; a measured column of copy descends
   through three stations (Upstream / The brink / The pool) while the image
   drifts upward past them — the reader descends the falls. Monotonic, high-water
   mark, reversible. Under 768px: no pin, stations stack.
4. **1920s house** — the history block. `lodge-exterior` + original-wood story.
   Copy: built in the 1920s, renovated around the view, original floors and
   walls at the centre of the house.
5. **Rooms** — 4 bedrooms as a KOBU-style index (name, beds, one line), one
   photo each side. Sleeps 5: 2 doubles, 1 single, 1 children's bunk.
6. **Sauna + hot tub** — `sauna-night` (the circular-window barrel, glowing) as
   a full-bleed night beat. Wood-fired sauna with a view of the falls.
7. **The river** — Norðurá facts: Iceland's most prestigious fly-fishing river,
   salmon jumping the falls (guests photograph it from the balcony), permits
   separate, safe dip above the falls. Honest safety line kept.
8. **Guests** — 5.0 across 123 reviews. Verbatim quotes (Kevin June 2026 "There
   can't be many places on Earth quite like this", Soo "salmon jumping upstream
   from our balcony", Sabine, Nadine). Auto-rotating night quotes over
   `aurora-lodge`.
9. **Enquiry** — house two-sided demo form → /preview/laxfoss/stjornbord.
   CTA: "Enquire about your stay" (one label, everywhere).

## Type & colour

- **One family: General Sans.** 400 everywhere, 500 only for the wordmark and
  CTAs (Lightship's discipline). Tracking scales with size: −0.045em display,
  −0.025em headings, 0 body. NO serif, no mono labels — small labels are
  General Sans 500 at 12px+, spaced +0.14em, sparing (≤1 per 3 sections).
- **Palette from their photographs** (cold luxury, NOT beige/brass):
  river ink `#0B1B26` (the deep pool blue-black), glacial water `#7FB3CE`
  (accent, from the aerial), frost `#EEF3F5` (page ground), basalt `#2E3A40`
  (text on light). Accent used identically everywhere; AA-checked.
- Page is LIGHT (frost ground, ink sections for night beats — same family, no
  theme flip; the night sections are ink-blue, not black).

## Motion inventory

- Heklusýn drift on EVERY photo frame (`.lx-frame`/`.lx-frame-in`, `--dz =
  max(9, drift*1.35)%`, batched reads/writes in the one ticker, gated while the
  pin is active). Drift values grow with page depth: 8 up top → 13 at the pool.
- Capsule nav (Lightship): `clip-path: inset(0 0 calc(100% - 56px) round 14px)`,
  fixed, frost glass; on a dark section flips ink via the section observer.
- Word-mask headline rises per house pattern (words, never chars; .22em headroom).
- Reveals: IO arms `is-in`; CSS owns transitions; visible defaults, settle class.
- Reduced motion: no loader, no pin, everything at rest, drift static.

## Assets

public/laxfoss/: waterfall-aerial (HERO), rapids-dark (scrub), valley-twilight,
waterfall-winter, waterfall-sunset, river-canyon, sunrise-river, lodge-exterior,
kitchen-black, dining-glass, dining-window, living-fireplace, living-wide,
window-seat, bedroom, bedroom-gold, sauna-night, sauna-forest, hottub-dusk,
aurora-lodge (+ -800 variants). Fonts: GeneralSans Regular/Medium woff2.

## Facts gate (all from the live listing / laxfoss.org, 2026-08-06)

Host Gudlaug (Guðlaug), Superhost, 12 years. 5.0 · 123 reviews, Guest favorite,
top 10%. 5 guests · 4 bedrooms · 3 beds · 1.5 baths. Built 1920s, renovated.
Private sauna (wood-burning per reviews), fireplace, 50" TV. 1h20 from
Reykjavík, 20 min to Borgarnes. Winter: 4x4 recommended. River privately
managed; fishing permit required; Norðurá = Iceland's most prestigious
fly-fishing river. NO email found; contact via laxfoss.org contact... (404) —
outreach channel is Instagram/Airbnb, page carries no invented contact.
NO prices on page. Photography: their own (laxfoss.org + listing), 2026-08-06.
