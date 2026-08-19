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
