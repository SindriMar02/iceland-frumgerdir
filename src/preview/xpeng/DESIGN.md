# Una / XPENG: "Hringinn á rafmagni"

Spec prototype for Bílaumboðið Una (bilaumbodiduna.is), the importer, dealer and service partner for
XPENG in Iceland (Vínlandsleið 6-8). Built 2026-10-11. Nobody at Una has been contacted. Every fact comes
from the harvest in `_docs/xpeng-una-harvest-2026-10-11/` (raw pages, text extracts, the October 2026 price
list transcribed to `pricelist/prices-2026-10.json`, the OpenStreetMap pulls) and the Codex audit in
`_docs/XPENG-UNA-BUILD-PLAN-2026-10-11.md`.

## Design read

Redesign (overhaul) of a single-brand importer site for private EV buyers, in the calm, image-led dealer
language of our ÍSBAND and Vatt builds. It is a dealer layer in front of `xpeng.com/is`, not a replacement:
the brand site keeps the story and the configurator, this site owns what a global template cannot:
Icelandic prices as tables, test-drive and service requests, a trade-in request, news, and the answer to
"does it make the ring road?".

- **Base: ÍSBAND/Vatt** (`../isband`, `../vatt`, which is Benni plus Suðurverk). Kept as it is: Host Grotesk
  in sentence case, the Drivehub-shaped chrome (contact bar, two-plate header coloured at the section edge,
  sticky phone bar), the Spyker ease `cubic-bezier(.625,.05,0,1)`, masked characters .8s/.018, clip-scale media,
  buttons opening from the middle, the statement band's inset clip, position-tied reveals, the page-only
  `<sndr-chat>` answerer, the booking forms and the staff-side preview. Suðurverk's staged opening and
  pinned chapter.
- **New structure (it must not read as the same pitch as ÍSBAND or Vatt):**

| ÍSBAND / Vatt | Una |
|---|---|
| Two-way split / six-plate brand selector | **Four model plates** (L03, G6, G9, X9), one accordion, G6 open |
| Veil lifting off brand plates (launch chapter) | **Hringvegurinn chapter**: the line is the real OSM ring road (relation 65617, 1,317 km), drawn in Una's gradient as you scroll; the stops are real fast chargers; the counters read the plan for the chosen car |
| Catalogue with filters | **Price list as tables**: eleven trims, list price and price with the Orkusjóður grant, range, 0-100 |
| Fleet and finance bands | A plain **charging-record band**: 12:23, the dealer's own hedged wording |
| Vatt green on slate | **Una's gradient**: green #18ED7F (ink text on it) to blue #186DEF (white text on it), ink #0F1316 |

Dials: variance 6, motion 6, density 4.

## Tokens

- Canvas `#FFFFFF`, stone `#EFF1F1`, line `#DDE1E2`, mute `#5A646B` (6.05:1 on white).
- Ink `#0F1316`. Una green `#18ED7F` (11.96:1 on ink; never on white). Una blue `#186DEF` (4.7:1 under white text).
  Both sampled from Una's logo PNG (`una-logo.png`, a gradient #18ED7F to #186DEF).
- Statement band: green to teal gradient, ink text.
- Type: Host Grotesk 400/500/600 (Icelandic glyphs verified in the Vatt build), sentence case. h1 clamp(40,4.6vw,76),
  h2 clamp(34,3.8vw,56). Masks carry .24em headroom for Þ Ð Á Í Ö.
- Radius 6px media, 4px buttons, 999 chips and header pill. No shadows except the sticky bar.
- Class prefix `xg`, keyframes and vars scoped under `.xg`, fonts in `public/fonts/xpeng/`.

## The Hringvegurinn planner (a calculation, labelled as one; full fact check in `_docs/XPENG-HRINGVEGURINN-FACTCHECK-2026-10-11.md`)

- Route: OSM relation "Hringvegur" stitched by shortest path round the island (1,317.0 km; Wikipedia says 1,309, the page prints both).
- Stations in three evidence tiers (generator `osm/build_ring.py` writes `geo.ts`): `dc` (CCS/CHAdeMO tagged, 50 kW or more, 31 sites, always
  used), `unk` (a known operator's site with no connector or power tags, 4 sites, opt-in, assumed 50 kW, includes ON at Mývatn), `dcx` (never used).
  Left out and counted: Tesla Supercharger (8: 4 customers-only, 3 open, 1 untagged), customers-only sites, AC-only sites. Each stop shows its
  OSM last-edit date and whether access is recorded.
- Model: full battery at the start, arrive with 10 % or more, never charge above 80 %, consumption 1/range per km (the visitor's own 0-40 %
  winter slider on top), detours cost twice the distance, the car's average DC power derived from the price list (0.7 x kWh over the rated
  10-80 % minutes), a slower station stretches the time. A dynamic programme picks the stops with the least charging time (6 minute penalty
  per stop). Best case: no taper, no cold battery, no queue.
- Output: stops, per-stop arrival and target charge, minutes, a battery-level chart along the route (the sawtooth that never dips under 10 %), and
  the longest gap. When the car cannot make it, the page says where it runs out and whether the unconfirmed Mývatn station would fix it.

## Motion map

| Device | Where | Numbers |
|---|---|---|
| Staged opening | home hero, every route's intro | header 0.28 s, eyebrow 0.45 s, masked lines 0.72 s stagger 0.08, photo 0.85 s from 12 %, body 0.55 s |
| Masked character titles | every h2 | 0.8 s, 0.018 stagger, scrub over 100 %→86 % |
| Media clip reveal | every frame | inset 20 % → 0, picture 1.1 → 1, over 100 %→70 % |
| Model accordion | plates | flex-grow 1 → 2.6, 0.6 s Spyker ease |
| Ring chapter | home | desktop pins the stage for 1,700 px, scrub 0.6; the road's dashoffset 1 → 0 is the scroll progress; the car head (a radial glow, no filter) follows `getPointAtLength` by transform; stops, their labels and the battery chart's dots light when the progress passes their km; two stacked SVG layers (the still coast, road and sites are painted once, only the thin overlay changes); phones tie it to the map's own position, no pin. Measured in the preview browser: 837 frames scrubbing the chapter, median 6.1 ms (this display's refresh), p99 6.8 ms, worst 7 ms, none over 17 ms |
| Statement band | "Heitt á könnunni" | inset 10 % → 0 → 10 % |
| Reduced motion | all | static render; the ring chapter shows the finished route and final counters |

Lenis on fine pointers only (lerp 0.125). Phones keep native scroll.

## Facts and copy

- Prices and specs: price list October 2026 (cover date; the Issuu metadata says 2024, the cover and the
  document id say 2026, ask Una for the validity date). G9 and X9 print no grant price; none is shown.
- Una's own words reused: "Heitt á könnunni" (g6-g9 page), the 12:23 record with "gert ráð fyrir að hér sé um
  Íslandsmet að ræða" quoted as their hedge, never a certified record.
- Not claimed: a workshop at Vínlandsleið (Una says "þjónustuaðili", it names no workshop address), financing
  terms (none published), stock or delivery times, service hours, the other brand's configurator contents.
- Dealer owner: "Una er að öllu leyti í eigu Vekru", logo "Hluti af Inchcape". The preview does not touch
  that: it uses Una's logo with its own footer line.
- No em-dashes or en-dashes in visible copy.

## Open before anything is sent

1. XPENG brand rules for logo and press photos (the XPENG mark and the s-cdn images are brand material).
2. Who decides at Vekra/Askja/Inchcape; whether the group mandates a platform or agency.
3. Pages 5, 7, 9 of the price list (equipment lists) are not read; no equipment is shown yet.
4. iOS Simulator pass and a Codex measured audit are queued (see the board line).
