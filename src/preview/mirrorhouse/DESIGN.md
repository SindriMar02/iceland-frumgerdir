# Design System: Mirror House Iceland — "Ein nótt" (One Night)

**Design read:** one-page cinematic pitch for a single-unit premium stay whose entire
appeal is one object (a mirror-glass cabin) in one landscape at different hours.
Audience: the owner first (Ingibjörg, seeing what her domain could be), her
international guests second. Language: English primary (her guests book in English),
Icelandic day-phase labels as structural accents (authentic, not decorative).
Leaning: ERA-style fluid canvas + GSAP/Lenis scroll choreography, cold-luminous
register. **Not** warm-cabin-rustic, **not** dark-luxury-gold-serif (banned by
standing feedback), **not** the beige+brass premium-consumer default (banned).

**Dials:** VARIANCE 7 · MOTION 8 · DENSITY 3.

## 1. The Signature — scroll is one night at the cabin

The page enacts a single stay: the canvas begins in daylight ice, passes through
dusk, and ends in aurora night. One scroll-driven value lerps the page palette
(Búðir sky-scrub lineage, different palette, different arc), section labels are
Icelandic day-phases (Síðdegi → Kvöld → Nótt), and the climax is a pinned section
where scroll scrubs a real video of the actual cabin passing from day into aurora
(Higgsfield interpolation between her own two photographs). This is the sanctioned
"theme switch on scroll" composition: ONE continuous transition, not alternating
sections. Everything else stays quiet.

Secondary device, hero only: the wordmark casts a faint inverted reflection
(scaleY(-1), gradient-masked) — the property's literal concept, done in CSS,
used exactly once.

## 2. Color Palette & Roles

Derived from her photographs, not a swatch library:

- **Ice** `#E9EFF3` — day canvas (the pale sky in the symmetrical hero shot)
- **Ice Deep** `#D3DEE6` — day canvas gradient floor / section tint on light
- **Basalt** `#0A121B` — night canvas (blue-black; never pure #000)
- **Basalt Soft** `#111C28` — elevated surfaces on night (booking panel)
- **Rock** `#37424E` — primary text on day canvas (the cliff midtone); AAA on Ice
- **Mist** `#9FB0BD` — secondary text on night; muted-steel metadata on both
- **Aurora** `#57BE8C` — THE single accent (sampled from her aurora photos,
  sat ≈ 54%): CTA fill, focus rings, the scroll-progress thread, live dots on the
  dashboard demo. Never as body-text color.
- Near-white on night: `#EDF2F5` (never pure #fff)

Dusk ambers exist only inside her photographs — never tokenized, so the palette
stays two-pole (ice/basalt) + one accent, and her golden-hour photos supply all
the warmth the page needs.

Contrast (computed): Rock/Ice 8.9:1 AAA · #EDF2F5/Basalt 15.2:1 AAA ·
Mist/Basalt 7.1:1 AA+ · Aurora/Basalt 7.9:1 (large + UI) · Basalt/Aurora 7.9:1
(CTA text-on-fill).

## 3. Typography

Single-family discipline (Amour Liquide lineage) + one utility mono:

- **Display:** `Switzer` Extralight (200) / Light (300), self-hosted from
  `~/Design fonts/Switzer/web/` (full Icelandic ✓, verified). Large sizes, tight
  leading (but ≥1.1 with descender padding on masked reveals — Icelandic ð/þ/g
  clip rule), letter-spacing -0.01em at display sizes, +0.14em on rare caps.
  Cold precision = etched glass. Weight-driven hierarchy, never raw scale.
- **Body:** `Switzer` Regular (400) / Medium (500), 65ch max, leading 1.6.
- **Utility mono:** `Fragment Mono` Regular — coordinates, review counts,
  day-phase labels, the licence number. This page is about a precise glass
  instrument in a wild place; the mono is the instrument voice. Used small
  (11-12px equivalent), never for body.

Banned here: Inter, any serif (this is not an editorial/heritage brief — the serif
reflex is the AI tell), Boska (Búðir's identity — no style bleed).

## 4. Component Stylings

- **Buttons:** flat Aurora fill with Basalt text (primary "Request to book"), or
  1px Mist outline ghost on night (secondary). Radius 2px — near-sharp, glass-edge.
  Active: translate-y 1px. No glows ever.
- **The booking panel:** Basalt Soft surface, 1px `rgba(237,242,245,.14)` hairline,
  radius 2px. Label above input, error below, Aurora focus ring (2px, offset 2).
- **Images:** full-bleed or large asymmetric frames; every frame is a Heklusýn
  drift frame (`--dz: max(9%, drift*1.35%)` inset rule). Arrival treatment =
  "condensation clearing": mask sweep + blur/saturate resolve (alrun aperture
  lineage) — this is the site's motion identity for images.
- **No cards** for content sections — hairlines and space. The ONLY elevated
  surfaces are the booking panel and dashboard rows.
- **Quotes:** max 3 lines, real typographic quotes, attribution "Name, month year"
  (their Airbnb display form). No em-dashes anywhere on the page (hard ban).

## 5. Layout Principles

- ERA fluid canvas: `html { font-size: 1vw }` scoped to this route's root,
  ratio 16 desktop (1600 canvas) / 4.16 mobile (416 canvas), breakpoint 992.
  Every measurement in rem = canvas-px/16. The design zooms, never reflows.
- Asymmetric splits (7/3, 8/4 with real offsets); hero is full-bleed with
  bottom-left type block, NOT centered-stacked.
- Section rhythm ≈ 9 sections: Hero (Dagur) · Manifesto · Arrival (Síðdegi) ·
  Interior · Hot tub (Kvöld) · The Night scrub (Nótt — pinned climax) ·
  Guest voices · The place · Booking + footer. At least 4 distinct layout
  families; zigzag capped at 2; exactly 3 labeled day-phases (eyebrow budget:
  3 on 9 sections, and they're structural, encoding the time arc).
- Mobile <992: single column, drift frames keep working (cheap), the video scrub
  degrades to a poster crossfade (day photo → aurora photo) — never a pinned
  1000vh section on touch.

## 6. Motion & Interaction

- Engine: GSAP + ScrollTrigger + Lenis (repo convention; framer-motion reveals
  are flagged unreliable in this repo's memory).
- One value drives the world: master scroll progress → palette lerp (CSS vars
  `--mh-canvas`, `--mh-ink` on the route root, single onUpdate writer).
- Video scrub: pinned section, `video.currentTime = progress * duration`, video
  preloaded + muted + `playsinline`; seek-throttled to rAF; poster fallback under
  reduced-motion and on touch.
- Text: masked line rises (yPercent 110 → 0, power3.out, ~1s, stagger .08) with
  .24em descender headroom; Icelandic accent-clip rules from Búðir applied.
- Images: condensation-clear (mask sweep 166deg + blur 10→0 + saturate .58→1)
  once per frame on entry; continuous drift while on screen (Heklusýn spec:
  batched reads-then-writes, one module-level rAF loop, off-screen skipped).
- `prefers-reduced-motion`: every device collapses (drift off, scrub → static
  aurora poster, reveals → visible resting state). Non-negotiable; ERA's own
  source omitted this — we don't.

## 7. Anti-Patterns (hard bans for this build)

No em-dashes (`—`/`–`) in any visible string. No scroll cues ("Scroll to
explore"). No dark+gold+serif luxury reflex. No pill navs, no ↗ chips, no card
grids (standing feedback). No section-number eyebrows (day-phases carry the
structure). No invented facts, prices, or history: every number on the page
(412 reviews, 4.94, 10 years, distances) comes from her listing, dated
2026-08-04. No fake urgency, no invented availability. Licence number appears
in the footer exactly as the live listing shows it. Photos: hers only, credited.
Coordinates allowed (real place, place-focused brief — the sanctioned exception).
