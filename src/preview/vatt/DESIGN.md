# Vatt: "Eitt hús, sex merki"

Spec prototype for Vatt ehf (vatt.is), Skeifan 17: BYD, Maxus and Aiways today, OMODA, EXLANTIX
and JAECOO from January 2027. Built 2026-10-08. Nobody at Vatt has been contacted. Facts come only
from `_docs/VATT-FACTCHECK-2026-10-08.md` and the primary pages in `_docs/vatt-harvest-2026-10-08/`.

## Design read

Redesign (overhaul) of an importer-and-dealer site for private EV buyers and fleet buyers, in a
calm, image-led dealer language. A hybrid of two of our own systems, re-aimed:

- **Base: Benni/ÍSBAND** (`../benni`, `../isband`). Kept: Host Grotesk in sentence case, the
  Drivehub-shaped page (contact bar, header, browse rail, grid, practical rows, test-drive band),
  the statement band, the page-only `<sndr-chat>` answerer, the Spyker ease
  `cubic-bezier(.625,.05,0,1)`, position-tied reveals.
- **Blend: Suðurverk** (`03-prototypes/sudurverk`, live sudurverk-preview). Taken: the CargoKite
  staged opening (header 280 ms, eyebrow, masked heading lines 720 ms / 80 ms stagger, masked
  photo 850 ms, body, button; no loading curtain), the pinned chapter with a progress line
  (desktop, fine pointer only), the Alberici browsing model for the catalogue (equal tiles,
  image / title / dated metadata, filters with an empty state and reset, detail page 4/8).

Dials: variance 6, motion 6, density 4.

## What is different from ÍSBAND (it must not read as the same pitch)

| ÍSBAND | Vatt |
|---|---|
| Red #EC1840, ink text | Vatt green #7DB03A (the lightning mark) with ink text; deep green #4F7A1D under white text; slate #495C6A from the wordmark for dark plates |
| Loader curtain, car hero with copy over the photo | No curtain. 6/6 split hero: copy on white, masked photo on the right (Suðurverk opening) |
| Two-way split with a drag handle | **Six-plate brand selector**: an accordion of plates, one per brand, hover or tap widens a plate; the three January plates are slate with the wordmark and the date, no invented photos |
| Featured grid, one route | **Catalogue route** `/bilar` with brand, body, drivetrain and EV/PHEV filters, a count, an empty state, and `/bilar/:slug` detail pages |
| Statement "Breyttur bíll. Óbreytt ábyrgð." | The launch chapter: "Við lyftum hulunni í janúar." Scrolling lifts a veil off the three brand plates one after another (Vatt's own banner line), with a counter and a progress line; then the green statement strip "Taktu janúar frá." |
| Heritage float | Fleet band: intro, one photo, the three vans with ex-VAT prices; the quote form lives on /fyrirtaeki |
| mailto booking | Working test-drive and workshop booking flows with a staff-side preview `/afgreidsla` |

Class prefix `vt`; keyframes and vars are scoped under `.vt`; fonts copied to `public/fonts/vatt/`.

## Tokens

- Canvas `#FFFFFF`; stone `#F2F4F1` (a cool, slightly green-grey instead of ÍSBAND's warm stone)
- Ink `#121A1F`; mute `#5B6770`; line `#E1E6E3`
- Vatt green `#7DB03A` (measured, 61k opaque px of the logo): mark, statement band, chips, focus
  on dark; ink text only (6.8:1). Never white text on it (2.6:1).
- Deep green `#4F7A1D`: buttons and links carrying white text (5.1:1).
- Slate `#495C6A` (measured, 159k px): header on dark, launch plates, footer (6.9:1 with white).
- Type: Host Grotesk 400/500/600, sentence case. h1 `clamp(40px,4.6vw,76px)` 500, -0.04em,
  1.02; h2 `clamp(34px,3.8vw,56px)`; body 16/1.6. Masks on split titles carry `.24em` headroom
  for Þ Ð Á Í Ö (`masked-reveal-clips-icelandic-accents`).
- Radius: 6px on media, 4px on buttons, 999 on the header pill and chips. Shadows: none except
  the sticky bar.

## Motion map

| Device | Where | Numbers |
|---|---|---|
| Staged opening | home hero, every route's intro | header 0.28 s, eyebrow 0.45 s, masked lines 0.72 s stagger 0.08, photo 0.85 s from 12 %, body 0.55 s, button 0.28 s (Suðurverk) |
| Masked character titles | every h2 | 0.8 s, 0.018 stagger, scrub over 100 %→86 % (Spyker/Benni) |
| Media clip reveal | every frame | inset 20 % → 0, picture 1.1 → 1, over 100 %→70 % |
| Buttons open from the middle | every button below the fold | inset(0 50 %) → 0 |
| Hero parallax | home, desktop fine pointer | photo +8 %, copy -18 % over the first 700 px |
| Brand accordion | selector | flex-grow 1 → 2.6, 0.6 s Spyker ease; copy fades in at the widened plate |
| Pinned chapter | January 2027 | pin 900 px, scrub 0.6; each veil yPercent 0 → -112 over 26 % of the pin, 30 % apart, power2.inOut; the wordmark under it 0.25 → 1 opacity, .94 → 1 scale; counter 0 → 3; progress scaleX 0 → 1 (CargoKite shift device via Suðurverk, re-aimed). Phone: no pin, each veil tied to its plate (top 88 % → 45 %) |
| Statement band | the green launch strip | inset 10 % → 0 → 10 % (Benni) |
| Filter grid | catalogue | framer `layout` + popLayout, 0.5 s |
| Reduced motion | all | static render, nothing hidden |

Lenis on fine pointers only (lerp 0.125). Phones keep native scroll.

## Copy and facts

- Hours: sales Mon–Thu 8:30–17, Fri 8:30–16, Sat 13–16 (closed Saturdays in high summer and
  December); workshop Mon–Thu 8–17, Fri 8–16 (vatt.is footer and /thjonusta/, read 2026-10-08).
- Prices: BYD from the byd.is Verðskrá PDFs (image PDFs, read by eye, dated 2025/2026 on the
  sheet); Maxus from the maxus.is Verðskrá PDFs (text). Where a model has "verð m/styrk" the page
  shows the list price and the Orkusjóður line separately. Aiways: no model, no price.
- Not repeated from vatt.is: "eingöngu 100 % rafmagnsbílar", "SAIC stærsti í Kína", the 2019 export
  figure, "eini framleiðandinn…", "yfir 70 löndum".
- Aiways appears once, in the footer brand list and the chat, as "þjónusta og varahlutir fyrir
  Aiways U5" only; the fact check records the brand's collapse in Europe.
- Fixed from the "Broken" list: phone first screen has a headline and two buttons; the workshop
  button opens a working flow; staff mailto links are real `mailto:` to the addresses printed on
  vatt.is (steini@vatt.is, not vattt.is); no Lorem, no Suzuki, no Norway, no RSA footer;
  `lang="is"`; alt on every image; one H2 per section with text; a privacy link to a real route;
  a contact form; the typos are not carried over.
