# Vélfang: "Verkin tala"

Spec prototype for Vélfang ehf (velfang.is), Gylfaflöt 32: 21 agricultural and construction
machinery brands, workshops in Reykjavík, Akureyri and Selfoss. Built 2026-10-09 on the Vatt
system (`../vatt`, declined 10-09). Nobody at Vélfang has been contacted. Facts only from
`_docs/VELFANG-FACTCHECK-2026-10-09.md`; plan and log in `_docs/VELFANG-BUILD-2026-10-09.md`.

## Design read

Redesign (overhaul) of a machinery dealer for farmers, contractors and municipalities, read on a
phone in a yard or a cab. Sturdy, image-led, industrial. Dials: variance 6, motion 6, density 5.

**Idea:** Vélfang's own slogan, *Verkin tala* (letterhead of their LiveLink PDF). The machines,
the yard and the people who fix them do the talking, and every frame opens the way the Vélfang
mark does: a peak lifting off a field.

## What changed from Vatt (it must not read as the Vatt pitch)

| Vatt | Vélfang |
|---|---|
| Host Grotesk, sentence case | Archivo Narrow 600/700 CAPITALS for display, model names, prices and spec values (the VÉLFANG and VERKIN TALA caps); Archivo 400/500/600 for reading |
| 6 / 4 / 999 px radii, pills | All square (the mark is a square) |
| Green #7DB03A + slate | Vélfang red #E7001C + field green #A8CC72, both measured on logo_275.png; graphite #1F2427 |
| 6/6 split hero | Stacked hero: words across the top, their own Gylfaflöt yard full-bleed below, opening through the peak |
| Six-plate accordion (also used by Hegas) | Typographic brand index in Vélfang's own three fields, stock count per brand, logo on hover |
| Pinned veil-lift chapter | Map chapter on real OSM coastline: each branch card drops its peak marker and adds its staff to the count (desktop, scrubbed, reversible; phone static) |
| Inset clip reveals | Peak clip: `polygon(14% 100%, 14% 100%, 50% 52%, 86% 100%, 86% 100%)` → full rectangle, position-tied |
| Test drive / fleet / finance | Viewing, quote, workshop (3 branches), parts, LiveLink access, sell / wish list, Kuhn opt-in; no finance (none published) |

Class prefix `vf`; keyframes and vars scoped under `.vf`; fonts in `public/fonts/velfang/`.

## Tokens

- Canvas #FFFFFF; concrete #ECEDEA (bands), #E2E4E0 (media placeholder)
- Ink #15181B; mute #596067 (5.4:1 on concrete); line #D9DCD7
- Red #E7001C: primary buttons, statement band, peak markers, focus ring; white text 4.8:1. Hover #C20018
- Field green #A8CC72: map land, the triangle bullets on dark, open-state square. Ink text only
- Graphite #1F2427: contact bar, footer, spec plate, Kuhn band, menu
- h1 clamp(46px,6vw,96px), hero clamp(48px,6.9vw,100px); h2 clamp(36px,4.4vw,72px); line-height .94;
  letter-spacing -.005em; statement band clamp(64px,11vw,200px) is the one poster moment
- Masks carry .26em top headroom for Á É Í Ó Ú Ý Þ in capitals
- Radius 0 everywhere. Shadows only on the dropdown panel

## Motion map

| Device | Where | Numbers |
|---|---|---|
| Staged opening | hero, every intro | masked lines .72s stagger .08 from .12s; hero peak clip PEAK_SMALL → FULL 1.25s `vf` ease from .3s, image 1.14 → 1 over 1.5s; `[data-open]` y 22 → 0 .55s stagger .07 from .4s |
| Peak reveal | every `[data-media]` frame | PEAK_WIDE → FULL + image 1.12 → 1, scrub top 100% → top 62% |
| Masked characters | every h2 `[data-chars]` | yPercent 105 → 0, .8s, stagger .016, scrub top 100% → 82% |
| Buttons open from the middle | home, below the fold | inset(0 50%) → 0, scrub top 99% → 84% |
| Map chapter | home `/` and `/utibu`, desktop fine pointer | map CSS-sticky; per card top 78% → 42% scrub .4: marker y -70 → 0 power3.out, ground ellipse scaleX 0 → 1, label fade, staff count 0 → 20 → 26 → 28, sites in words; progress line across all three |
| Dropdown | header | opacity .18s ease-out, translateY -6 → 0 .22s cubic-bezier(.23,1,.32,1) |
| Menu | phone | panel peak clip .45s, items y 14 → 0 .3s stagger .04 |
| Filter grid | /velar | framer layout + popLayout .32s cubic-bezier(.23,1,.32,1) |
| Press | buttons, chips, segments | scale(.97) .16s |
| Reduced motion | all | static render; progress line set full |

Lenis on fine pointers only (lerp .125), constructor behind `isTouch()` for mobile-gate.
