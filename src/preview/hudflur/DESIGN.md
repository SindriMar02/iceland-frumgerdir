# Design System: Húðflúrstofa Norðurlands, "Blek á húð"

Look from Sindri's SAINTS reference board (anydesign pass: `_docs/hudflur-harvest-2026-09-29/design.md`), motion from the
live-up.co.jp teardown (`04-platform/sndr-teardowns-liveup`, PR #3). Build log: `_docs/HUDFLUR-BUILD-2026-09-29.md`.

## 1. Visual Theme & Atmosphere
A flash sheet pinned to a studio wall: paper and ink only, every grey lives inside the photographs of their own work.
Two voices: a heavy, tight grotesk for the name and the interface, and blackletter for the soul of the trade, repeated
until it becomes skin. Density 3 (gallery airy), variance 7 (poster-centred hero, offset masonry wall, one ink section),
motion 6 (Live-up: one shutter, masked lines, a turning lettering wall, a lens on the one featured piece).

Deliberate overrides of the generic taste rules, because the brief (the SAINTS board) asks for them:
- The hero is **centred**: it is a poster lockup (eagle, NORÐURLANDS, "Húðflúrstofa"), the reference's own composition.
- The wall **overlaps** type and photo on purpose: the photo is the figure, the blackletter is the ground it is tattooed on.
  Nowhere else does anything overlap.
- The blackletter is theirs: their Facebook cover pairs a blackletter wordmark with the chrome eagle shield.

## 2. Color Palette & Roles
- **Flash Paper** (#F4F4F2): page ground, cool neutral (not the warm cream family)
- **Paper Shade** (#E9E9E6): image wells while pictures load
- **Tattoo Ink** (#0E0E0E): text, buttons, the ink section, the footer
- **Faded Ink** (#5F5F5F): secondary text on paper (5.3:1)
- **Stencil Line** (#D6D6D2): hairlines on paper
- **Night Grey** (#A3A3A0) / **Night Line** (#2C2C2C): secondary text and hairlines on ink
- No accent colour. Colour exists only in their work, and appears on hover/tap.

## 3. Typography Rules
- **Display:** Cabinet Grotesk 800, uppercase, tracking -0.035em to -0.045em, line-height 0.86 to 0.9. The hero name
  and footer name are width-fitted to their column after fonts load.
- **Blackletter:** Grenze Gotisch 400 to 500 (OFL, self-hosted, has ð þ æ ö). Only for the wall, the section glosses
  under each title (Live-up's EN title + JA gloss pairing), step numerals I to IV, and the footer name. Never uppercase,
  never below 24px, never body text.
- **Body:** General Sans 400/500, 16 to 19px, 52ch max.
- **UI labels:** Cabinet Grotesk 800, 12 to 14px, uppercase, tracking 0.07 to 0.1em.
- Masked lines carry 0.14em top padding so Á É Í Ó Ú Ð clear the mask.

## 4. Component Stylings
- **Buttons:** square, ink fill (primary) or 1.5px ink outline (ghost), 48px min height, label rolls up to its twin on
  hover (0.3s expo), 1px press. One label per intent: "Bóka tíma" everywhere.
- **Work cards:** no frame, no radius, greyscale at rest; hover (fine pointer) or tap (phone) or keyboard focus brings
  colour, a 1.03 settle and a paper veil with two masked lines (title, date). Titles in „quotes" are their own captions.
- **Filter tabs:** uppercase labels, underline draws left to right, the note under them rolls up per filter.
- **Aftercare:** a native `<details>` with a plus that becomes a minus.
- **E-mail:** fitted to the column width, click copies with a tooltip, falls back to mailto.

## 5. Layout Principles
12-column grid, gutter max(20px, 2.34vw), gap max(8px, 1.1vw), section rhythm max(88px, 9.38vw). Works wall: 4 offset
columns, 2 on phones, dealt in order. One break at 1024, one at 768; everything single-column below 768 except the
works (2) and stats (3). No horizontal scroll at 320 to 1440 (probe-verified).

## 6. Motion & Interaction
Curves: expo out `cubic-bezier(.16,1,.3,1)` for every mask and reveal, in-out `cubic-bezier(.87,0,.13,1)` for the
shutter and the first masthead drop. Intro once per visit (0.7s hold, 1.5s shutter). Masked lines and fades are scrubbed
over a short band (top of viewport bottom to 72-80%) so a flick cannot outrun them. Wall rows drift in opposite
directions over the section's pass; the featured piece rides slower and carries the WebGL lens (fine pointer, ≥1024,
sleeps when settled). Lenis desktop only, never constructed on touch. Reduced motion: no motion branch at all, plain
render is the full site.

## 7. Anti-Patterns (Banned)
No accent colour, no gradients except the veil fade, no shadows, no radii, no stock photography, no invented reviews,
names or styles, no em dashes, no scroll cues, no blackletter in capitals or body copy, no pure #000 in the UI (the intro
shutter is the only true black), no Inter, no custom cursor.
