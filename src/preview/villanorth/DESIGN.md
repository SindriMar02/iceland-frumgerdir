# Villa North — "MÁLSETT" (Drawn to measure)

Design read: premium hospitality one-pager for a 4-7 person family/group
choosing a North Iceland base; precise, drawing-sheet language with an amber
glow, Mirror House quality bar, own spine. Dials: VARIANCE 7 / MOTION 6 /
DENSITY 4 (a group build carries more facts than a couple build).

## The concept (one sentence to the owner)
An engineer built this villa and it shows, so the page is drawn like his
drawings: hairline elevations that resolve into the real thing, and rooms you
can plan a family into before you book.

Derived from THEIR material: the host's own profile says Engineer; a guest
review says "designed and engineered perfectly"; the photo set includes
genuine architectural detail shots (board-formed concrete + steel scupper
p11, cladding + fixture p13); the furniture is verifiably Minotti/Miele/
Stelton (Harold's review names them).

## Palette (sampled from their photos, 2026-08-04)
- `--vn-c`     #F0F1F2  drawing-paper cold white (from p11 concrete light)
- `--vn-ink`   #17181A  graphite ink
- `--vn-line`  #62656A  hairline graphite (from p11 mids)
- `--vn-amber` #C29049  the glow (from p20/p21 pendant golds) — THE accent
- `--vn-night` #101216  the glow section ground (winter-night aerials)
Amber TEXT on paper uses #8A5F1E (AA); amber shapes/lines may use #C29049.
COLD light page. Not cream, not beige.

## Type
- Display: **Apfel Grotezk** (700/500) — European precision with warmth,
  distinct from Cabinet/Technor/Switzer. Í/Á headroom rules apply.
- Body: **Onest** (400/300), 1.6 leading.
- Dimension labels: **Azeret Mono** — the measure lines, room facts, counts.

## Structure (10 sections)
1. Hero: p06 (the two-storey glass grid holding the sky) full-bleed;
   wordmark VILLA NORTH; under it the page's first MEASURE LINE draws itself
   (a hairline with end ticks + the only "dimension" that matters:
   "Gistir 7 · fjögur svefnherbergi"). Sub + CTA.
2. THE DRAWING — signature scroll device: the villa's roofline TRACED from
   their own p26 silhouette as an SVG elevation; strokes draw in on scrub
   (dashoffset), hairline hatching fills, then the drawing crossfades into
   the real p02 sunset aerial. (Gullsmiðja torn-edge lineage: trace the
   client's own artifact, never a generic shape.)
3. The valley: p05 aerial (Fnjóská river winding below) + location facts —
   Fnjóskadalur, Vaglaskógur beside it (SECOND-largest forest in Iceland,
   verified 2026-08-04; their listing's "largest" claim is NOT repeated),
   Akureyri 15-20 min through the tunnel (guests' tip: buy the 10-pass).
4. ROOMS TO MEASURE — the interaction class: a drawn room index for a group
   deciding who sleeps where. Left: schematic room list drawn as labelled
   hairline outlines (svefnherbergi 1-4 + stofa + eldhús + pallurinn), each
   with its honest facts (BR1: king + 2 singles, uppi, ATH: baðherbergin
   bæði niðri — from a guest review + listing); hover/tap/focus a room →
   right pane swaps to its real photo (p24/p25/p15/p19/p27). Explicitly a
   skýringarmynd (schematic), never claimed to scale.
5. Materials: p11 concrete + p13 cladding details, and the real names set in
   mono: Minotti / Miele / Stelton, anchored by Harold's "the real deal"
   quote (Apr 2026). No invented provenance.
6. THE GLOW: ground eases to --vn-night for the winter-night passage: p09
   (lit villa + steaming tub in snow) full-bleed, p27 (wine at golden hour)
   and the hot-tub aurora quotes (Katie, Suprina). One dark passage, then
   back to paper.
7. Welcome ritual: flowers, bubbles, chocolate, fruit — recurring across
   many reviews, so it is a fact; set as a quiet list with p18 dining.
8. Guests: 5.0 / 54 reviews / Top 10%; themes Location 24 · View 21 ·
   Hospitality 20; quotes Eric (Jun 2026), Naomi (Jul 2026), Kris (Aug 2025).
9. Booking: request form with guest count up to 7 (their max), date + nights;
   demoStore (villanorth_demo_*) → /preview/villanorth/stjornbord.
10. Footer: host Eyþór (Superhost, 3 years, engineer per his profile),
   check-in 16:00 / out 11:00, self check-in lockbox, exterior cameras
   disclosed (their safety listing). No licence number shown — none printed.

## Motion identity (ONE per site): "drafted"
Elements arrive as drawings: a hairline frame draws around the slot
(stroke-dashoffset), then the photo fades in inside it and the frame fades to
10%. Headlines rise through word masks with a measure-tick underline that
draws after the words land. Lenis wheel-only clock, reversible scrubs,
reduced motion renders everything drawn+filled. <768px: the drawing section
plays time-based (no pin), room index becomes an accordion.

## Guardrails
- Fact gate: forest claim = second-largest ONLY; no fire-pit mention (listed
  but reported absent); washer/dryer outside noted in practical facts (true,
  useful, honest); no invented sq-m, no invented floorplan geometry.
- Small assets: p08 night-tub (520px) used ONLY as an inset specimen chip at
  intrinsic-ish size (ledger #64); p10 (800px) mid-column max.
- a11y: amber text always #8A5F1E on paper; drawn frames are decoration
  (aria-hidden), room index fully keyboard operable (real buttons, focus
  ring, arrow keys optional).
- Page-scoped `vn-` classes, --u on .vn-root, page-local keyframes, noindex
  + JSON-LD, srcset -800 variants.
