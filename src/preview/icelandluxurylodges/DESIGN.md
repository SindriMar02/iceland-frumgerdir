# Iceland Luxury Lodges — „Húsin við vötnin"

**Design read:** luxury multi-property collection for affluent foreign travellers;
cold, waterline-led, image-first. Dials: VARIANCE 8 · MOTION 6 · DENSITY 3.
English-first (their market and their own site are English).

## Concept
One owner, four keys, two lakes. Úlfljótsskáli stands over Úlfljótsvatn,
Álftavík and Áslundur over Álftavatn, the fourth key opens a Reykjavík
apartment. **The signature is the waterline**: every estate photograph stands
above its own live CSS reflection (scaleY(-1) + mask + blur), separated by a
1px seam, and the reflection drifts in counter-phase with its source so the
page reads as still water. The landing forks into full-height doors per house
([[umbrella-multi-property-template]]); each door opens a chapter that is a
full presentation, never a teaser.

## Tokens
| | |
|---|---|
| ICE | `#EFF3F5` canvas |
| INK | `#0E161D` deep-water ink (15.6:1 on ICE, AAA) |
| DUSK | `#41607A` single accent (5.6:1 on ICE, AA) |
| Display | Gambarino (single-weight display serif, Icelandic ✓) |
| Text/UI | Switzer 300/400/500 |
| Ease | `cubic-bezier(.22,.9,.28,1)` |

Radius system: none (all sharp). One accent, locked. Light theme, locked.

## Engine
Vanilla: ONE module-scope rAF loop (read pass → write pass, off-screen frames
skipped), IntersectionObserver reveals, CSS `position: sticky` for chapter
copy. No GSAP, no Lenis. Resting CSS state is the visible one; a `.js` class
arms the hidden starts, so no-JS/crawlers/reduced-motion always see content.

## Motion table
| element | motion | trigger |
|---|---|---|
| preloader wordmark | two-stop gradient fill driven by real image-decode progress, 1.1s floor / 2.4s cap, sessionStorage `ill_seen`, `?loader` forces | mount |
| hero lines | translateY 112%→0, 1.15s, staggered 130ms | `ill:revealed` event from loader (never a guessed delay) |
| hero sub | opacity+y 16px, .9s, .7s delay | `ill:revealed` |
| waterline images | drift −p·d% (d=6–12), inset derived `max(9%, d·1.35%)` | shared rAF |
| reflections | counter-phase drift at 0.66·d | shared rAF |
| doors | opacity+y 26px, .9s, 90ms stagger; hover img scale 1.05→1.11 (1.2s) | IO / hover |
| rise text | translateY 112%→0 inside overflow mask, 1s | IO at 0.22 |
| facts | opacity+y 14px, .7s, 100ms stagger | IO |
| amenity rows | opacity+x −8px, .6s | IO |
| frames | opacity+y 30px, 1s | IO |
| burger | lines rotate to X, .45s | click |
| menu sheet links | opacity+y 14px, 55ms stagger | open |
| CTA | hover bg→DUSK, active translateY(1px) scale .99 | hover/active |

Reduced motion: loader never mounts, reflections hidden, drift loop never
arms, every element rests visible, transitions none.

## Sections (10)
Hero waterline → statement → three doors + → chapters I–III (sticky copy +
photo collage) → fourth-key ink card (text-only, honest: no photo of the
apartment exists) → quote → request-to-book (demo, localStorage, no card) →
waterline footer.

## Honesty
All facts from their own pages / their own OTA listings, dated 2026-08-14/15
in data.ts comments. No prices (they publish none). No photo attributed to a
property it wasn't harvested from; the four `fullsizeoutput_17*` estate shots
with lost provenance are NOT used in property chapters. Apartment has no
photography → text card. JSON-LD: Organization + 3 LodgingBusiness with the
one verified aggregateRating (Álftavík 4.94/162).

## Round 4 (2026-10-18): one evening, a page per house, booking that takes the booking
Sindri asked for "even better, something to really grab her", reusing a free design where it fits.
Only declined stay design free was Klettar (2 buildings, darker); chose a hybrid instead:
- **One evening** (Mirror House device 1, localised): the `.ill-dusk` band (210svh) pins the
  HERO'S OWN FRAME (Álftavík pool terrace) relit by Higgsfield Nano Banana 2.1 to blue hour,
  crossfading (`--dn`) to the same frame at night under an aurora, which carries a Kling 3.0 4K
  locked-off loop. The page canvas turns ICE → INK BEHIND the photo (`--bg/--fg/--acc`), so no
  text ever crosses mid-grey; nav + menu never scrub, they snap day/night on `.is-night` (Codex
  finding). First pass used CSS stars on a flat scrub; Sindri: "very generic" → replaced.
  Generated frames are atmosphere only, never a property fact.
- **A page per house**: `/preview/icelandluxurylodges/{ulfljotsskali,alftavik,aslundur}` =
  same `Page` with `house` prop (House.tsx keys it): own hero + lockup, its chapter, evening,
  reviews, booking preselected, the other two houses as doors. Landing doors and nav link there.
- **StayBook** (Book.tsx) replaces the enquiry form: house tiles → two-month calendar (taken
  nights struck, check-out-only day after a free run, min stay) → guests + total → details →
  "Pay securely" (Teya page on the live site; no card fields in the prototype) → reference.
  Rates/availability are SAMPLES and the note says so.
- Films re-rendered Kling 3.0 `4k` (60 cr each): hero from the empty Álftavík pool (push-in),
  aurora deck (aurora + steam + fire). Palindromed, 1920w, 8.7 MB / 5.0 MB.
- Scroll walkthrough frames deleted (Sindri: no scroll walkthroughs, they rarely work).

## Round 5 (2026-10-18, after a logged-in Pinterest pass; see ROUND5-MAP.md)
- Landing hero = the Álftavík terrace relit to GOLDEN HOUR (Nano Banana 2.1 4K, from her photo) +
  Kling 3.0 4K push-in loop. With the evening band it is one day: golden hour → blue hour → aurora.
- Dates pill in the hero (house + guests → that house's page at #bokun, guests carried over).
- House pages: copy + photos left, the house's own calendar in a sticky card right (room-detail
  pattern); bottom booking section only on the landing.
- Crossing lines (Grand Emily device): two lines of capitals across a framed photo, ink outside,
  ice inside (second layer clipped to the frame's exact inset), parting sideways on scroll. Lines are
  her own amenities only.
- Opening reveal: wordmark fills → one waterline draws across → the ICE page parts along it →
  hero settles from 1.07 while the lockup opens from its seam.
- Fixes: nav scrim/weight over the hero; `.ill-root button` reset was stripping every CTA fill
  (now `.ill-root .ill-cta`); Álftavík photo alts were describing other photos (re-checked by eye).

## Round 6 (2026-10-22, the evening before the Fri 23 Oct 13:00 meeting): premium + speed
Sindri: "can look a lot more premium, especially the booking button on the landing page and the
overall layout; the loading screen is slow, the pages take too long to load; the movement on the
landing page is poor, use a perfected generated still instead." Vault read first
(`_docs/DESIGN-VAULT-2026-10-19.md`): the waterline umbrella is ILL's own; borrowed from the
Velaa teardown (`_docs/mountain-villa-references-2026-10-22/velaa`) the paired tall villa
portraits on a pale ground, each a link to its page, and from Mont Rural the inset-photograph
rule (the ground stays the brand). Nothing dark-and-gold (memory: no dark-luxury reflex).
- **Hero = a still.** The Kling push-in loop is gone (8 MB, and it read as poor motion). The
  frame is her Álftavík terrace relit by Nano Banana 2.1 at 5056 px (3 credits, job
  `362c8999`; its sibling `159d6bf3` is the warmer/pinker alternative in the scratchpad), served
  as `r/hero-golden-{1000,1600,2400}.{avif,webp,jpg}` with `fetchpriority=high`. The 1.07 → 1
  settle on reveal and the drift on scroll are the only motion on it.
- **Loader keyed to what matters.** Progress = the hero picture decoded + `document.fonts.ready`;
  floor 0.6 s, cap 1.3 s, line +0.1, open +0.5, halves part in 1 s. The old loader counted every
  `document.images` entry, and a lazy image below the fold never reports `complete`, so it ran to
  its 2.4 s cap every visit and the booking pill arrived ~5 s in. Hero seam .6 s, words 1.1 s,
  sub +.35 s, bar +.5 s.
- **Responsive pictures.** Every photograph is `<picture>` AVIF + WebP + JPEG at 640/1000/1600
  (hero 1000/1600/2400) from `public/icelandluxurylodges/r/` (sips → cwebp q80 → avifenc q58
  s6; `Pic` in Page.tsx, `picSrc` derives the set from the file name). A 1600 original was
  300–950 KB; the AVIF a phone downloads is 40–110 KB. Aurora + evening loops re-encoded to
  1600 w, CRF 27 (4.8 → 2.9 MB, 1.7 → 1.25 MB) and mounted only when their section is within
  900 px (`useNear`), never on page load.
- **Booking bar.** The dark glass pill became an ice slab resting on the hero's bottom edge,
  half over the water and half on the page (Aman / Velaa placement): House · Guests in serif,
  caps labels in DUSK, one hairline between fields, the one ink button on the page ("Dates and
  prices", hover fills DUSK from the left). Nav "Book" is a hairline-boxed link.
- **Doors.** Three tall 3:4 portraits inset on the ICE with the collection's gutters, the middle
  one hung lower, caption on a hairline beneath (kind · name · sleeps · "See the house →"); hover
  settles the photograph from 1.045 to 1 instead of pushing in. No gradient scrim, no white type
  over a darkened photograph.
- **Statement.** Editorial split: the sentence at up to 4.1 rem left, the body set low right.
- **Chapters.** Ordinal calmed to 1.7 rem; the middle chapter mirrors (photographs left, copy
  right) so the three do not repeat one layout.

## Round 6b (same evening): doors accordion, Sentient, booking sentence, footer waterline, reviews, map data
Full state and Sindri's verbatim brief: `_docs/ILL-ROUND6-HANDOFF-2026-10-22.md`. Display face is now
**Sentient Light** (+ LightItalic, Regular for small sizes) everywhere `--serif` is used; Gambarino retired.
Hero: seam on the page's centre axis (grid 1fr | 1px | 1fr), tracked-caps line under it. Doors: full-bleed
flex accordion (hover 1.9 / others .72, .85s). Booking: `RangeCal` + `pickNight` + `stayPrefill` in Book.tsx
shared by the hero sentence bar's sheet, the landing section (two months + sticky summary) and the house
card (one month); the bar reads "A stay at [house], [dates], for [n guests]". Footer: index + Waterword
reflection. Reviews from `reviews.ts` (review-sync standard) with `review-sync.json`. Map geometry in
`geo.ts` (generated, OSM ODbL), component still to build. Lodge page: room index and photos full width
under the copy/card grid.

## Round 7 (2026-10-22, late; side session): the map, door names, phone wordmark
- **The lakes (`Map.tsx`).** Real OSM geometry from `geo.ts` drawn in the three brand colours only: the
  ICE page is the ground, Faxaflói and the lakes are DUSK at 7 % / 14 %, roads INK hairlines with
  1/35/36/37/38/360 at .9 px, coast and rivers between. Geometry is SVG (`vector-effect:
  non-scaling-stroke`, one crop per use: landing 30/110/960/610, phones 420/150/560/520 with
  "← Reykjavík" pointing off the edge, house pages 540/255/340/280); every label is HTML laid over by
  percentage so type keeps its rem size, with an ICE text-shadow halo so hairlines never cut through it.
  Pins are a ring on the LAKE (Úlfljótsvatn 690/372, Álftavatn 724/483, Reykjavík), never a parcel: the
  houses' positions are unverified and the lake is what is sold. Álftavík and Áslundur share one pin.
  Landing: `MapSection` between the chapters and the evening, 8/4 grid with an index of the four keys
  (hovering a row lights its pin, the others dim to .42). House pages: `HouseMap` at the top of
  `.ill-hp-below`, that house's pin pulsing (DUSK ring, 2.8 s, off under `.reduced`), "Where it stands"
  copy, the pin note. Layers fade in staggered on the stage's `is-on`. Credit line "Map data ©
  OpenStreetMap contributors" on every stage (ODbL).
- **Doors.** A narrowed door keeps its whole name: the size steps down (clamp 1.5rem/2.1vw/2.1rem) with
  the width; the ellipsis is gone.
- **Phone hero.** The wordmark grid rows were stretching across the whole hero (`align-content` default);
  now `grid-auto-rows:min-content; align-content:center`, so Iceland / seam / Luxury Lodges stand as one
  stack with the line under them.
- **Hero lockup centred as one block** (Sindri, 22 Oct late: "things not centred"). 6b put the seam on the
  page axis, which left the long right-hand word hanging and the title reading right-heavy against the
  centred line and bar. Now `grid-template-columns:auto auto auto; justify-content:center`: the title's
  visual middle is on the axis, the seam falls where the words meet. Same on the house pages.
- **No form in the hero** (Sindri on the sentence bar: "almost as if it's getting worse with every new
  design"). Velaa, White Desert and Mont Rural carry nothing but the photograph and the word in the hero;
  booking is one word in the bar and its own section. So: hero = picture, lockup, line, one hairline-boxed
  "Check dates" ghost button (ice on a 6 px blurred ink tint, fills ice on hover) that scrolls to #bokun.
  Nav "Book", the landing booking section and the house cards carry the booking. The sentence bar
  (`HeroPill`) stays in the code behind `HERO_BAR = false`.
- **Map pins on phones**: a pin past 45 % of the stage puts its label on the left, so it never leaves the stage.

## Round 8 (2026-10-23): photographs (Sindri: "why are the images SO low quality? fix the images and upscale if needed")
Cause: every source was 1600–1800 px (her WordPress library tops out under 1200), encoded AVIF q58 with a
1600 px srcset ceiling, so a 1440 retina screen got a soft, over-compressed file; the doors hinted 33vw
but open to ~57vw.
- **Real originals first.** Airbnb keeps the uploads: host 7351939's lodge (6456350) and Álftavík
  (1918233) listings serve 2560 px (checked native, not CDN-upscaled: grass and stone detail beat the
  1200 px version upscaled). Matched by grey-fingerprint correlation ≥ 0.985: lodge-exterior,
  lodge-gameroom, lodge-sauna, lodge-spa, villa-1, villa-2, villa-4, villa-5 → 2560 px originals.
- **2K AI upscale only where faithful** (memory feedback-ai-upscale-listing-photos; Higgsfield
  bytedance 2k, 2 credits each, 14 submitted, 28 credits). Crop-for-crop against a Lanczos resize of the
  original. Accepted, stored at 2560 w: lodge-wide (disclose: the wine bottle's label text changed, a
  movable object), lodge-suite, lodge-int-4, villa-3, villa-6, aslundur-patio, aslundur-dining,
  aslundur-terrace, lodge-int-2 (retry), aslundur-house (retry; both tries invented an object where the
  porch grill stands, so the original pixels of that 300×230 corner are pasted back). Rejected, kept as
  they were: lodge-gym (frosted glass gained a floral pattern), lodge-family (cabinet burl and tile
  redrawn), aslundur-living (painting redrawn, stray glyph in the window), aslundur-master (toile figures
  dissolved). Those four want the photographer's full-size files from Signý. 18 upscales, 36 credits.
- **Sizes by height where cover crops.** The doors are portrait boxes filled with landscape photos, so the
  photo's width follows the door's HEIGHT (92svh × 1.5): sizes `(max-width: 900px) 96vh, 140vh`, not 33vw
  (the browser was taking ~1000 px and stretching it 3×). Full-screen hero and evening band:
  `(orientation: portrait) 150vh, 100vw`. House strip: 83vh.
- **Delivery.** `encode-images.mjs`: 800/1200/1800/2400, AVIF q72 s6 + WebP q86 sharp_yuv, never above the
  source width. Doors hint 58vw. Old 640/1000/1600 variants removed.

## Round 9 (2026-10-23, after Sindri's meeting with Signý, Pocket 16be3b58): guest manual + discounts
- **House manual** (`Guests.tsx`, route `/preview/icelandluxurylodges/gestir`, noindex, not in the nav;
  linked from the footer base line "Guests" and from the booking confirmation). A guest types the code
  from the confirmation email; it opens that house's manual. Demo codes ULFL-2026 / ALFT-2026 /
  ASLU-2026 live client-side (`DEMO_CODES` in Book.tsx); the live site checks a per-booking code on the
  server and it dies after check-out. Ten sections; facts only from data.ts (locality, kind, facts,
  amenities, host phone/email, 112), every unknowable part a marked "Signý fills in" box. House map
  under "Getting there". Print stylesheet hides the index, map and buttons.
- **Discounts** (`DISCOUNTS` + `priceStay` in Book.tsx), mirroring the engine (sndr-platform
  `smartPricing.ts`) and contract grein 3.4: PER NIGHT the single largest percent applies, NEVER a sum.
  Sample rules: longer stay (highest tier: 3+ −5%, 5+ −10%, 7+ −15%, on every night), last minute (a
  night within 7 days −8%, judged per night), gap night (a single empty night booked on both sides
  −12%). Ties: gap, then stay, then last minute. One line per rule that won, with its night count when
  it won only some nights; each group rounded once to whole euros so lines sum exactly (engine prices to
  the cent: 7 × €690 at 15% = €724.50 → €725). Note under the breakdown: samples, one best discount per
  night, she sets every rule.
- Phone house maps name only the focused house when two share a pin (the pair left the stage).
- **Editable by design** (Sindri: "bulletproof and editable and customizable"): `DISCOUNTS`, `DEMO_CODES`,
  `MANUAL` and `MANUAL_LOCALITY` live in data.ts as plain content. A manual section shows the site's facts
  (`auto`), then Signý's lines (`text.all` and `text.<house>`), and its "Signý fills in" box disappears
  once she has written any; `only` limits a section to some houses. Pricing clamps percents to 0–100,
  ignores bad tiers, never goes below 0; a rule at 0 % is off. Codes match ignoring case, spaces, dashes.
