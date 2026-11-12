# Rafmiðlun: design brief (locked before building, 2026-10-23)

Route `/preview/rafmidlun` (+ `/thjonusta/<5 sviðs>`, `/starfsfolk`, `/verkbeidni`, `/hafa-samband`, `/jafnlaunastefna`).
Built on a copy of the Samhentir fork of the Matvélar engine (both originals untouched). Facts:
`_docs/rafmidlun-2026-10-23/FACT-CHECK.md`.

**One idea:** *Frá ráðgjöf til framkvæmdar.* Their own sentence, "ráðgjöf, hönnun, teikningar, efnisöflun og framkvæmd",
drawn as one line. The conveyor of the engine becomes a cable ladder (kapalstigi), and one switchboard travels it:
a blank sheet, a floor plan, a single-line diagram, an empty enclosure, busbars and breakers, the closed board with
its cables rising. Skápasmíði is their calling card, so the product is the board.

**Material:** their logo. A navy oval with white bold type and three conductors running through it on each side.
- Page `#f7f9fc`, paper `#fff`, ink `#0a1f3d` (text), navy `#004d91` (the logo, measured from rmlogo.png: the one ink:
  buttons, lit machine, panels, labels in the drawing, the closing block), deep `#00305c` (footer, hover).
- Copper (`#c9773f` family) lives only inside the drawing: busbars, cable cores, cables. Kraft and drum wood likewise.
- Corners 2px (square, like an enclosure). Shadows only as a 1px ring plus at most an 8px blur.

**Type:** Martian Grotesk Standard 400/500/700 for text and display (closest open face to the bold neo-grotesk of
their logo; no wide cut, the logo is not wide), Martian Mono 400 for labels. OFL, Icelandic glyphs checked in the
Samhentir build. Display letter-spacing floor -0.04em. Floors: body 15px, labels 12px, inputs 16px, tap targets 44px.

**Signature devices:**
- Hero: the conductor field, a canvas of the logo's horizontal lines run across the page; current travels along a few
  of them in the one navy, and under a fine pointer the nearest lines light. Pause control (WCAG 2.2.2).
- Divider: the logo's oval with its lines, drawn, not the PNG.
- The pinned line (engine 8.5): five stations, scrubbed camera, word swap, dot progress.
- Skápasmíði: a closed board drops onto its plinth (engine 8.7, carton replaced by the board).
- Close on their navy with the line field (engine 8.10) in white.

**Content rule:** their words only (rafmidlun.is as captured 2026-10-23: forsíða, starfsfólk, verkbeiðni, hafa samband,
jafnlaunastefna). No projects, prices, capacities or claims they have not published. Partner names appear only as the
logos they show. The five slide captions in the line are ours and describe the drawing; Baldur confirms them.
Fixes to their spelling are marked `[lagað]` in data.ts.

**The job:** their Verkbeiðni page says the forms are unavailable and asks for an email with five things. The prototype
gives that back as one request with four ways in (verkbeiðni, stóreldhústæki, nýtt verk eða útboð, starfsumsókn), each
with exactly the fields their page asks for, routed to the inbox their own pages name. Nothing is sent from the prototype.

**Declared deviations from the engine:** no enquiry list (they sell work, not a catalogue); logo PNG in the bar (as sent);
menu and drawer focus the panel on a pointer open (focus-guard rule); conductor field instead of flutes; no Lenis.

**Photographs (2026-11-12, Sindri: "super pictureless", "find some pictures"):** eight of their own photographs, all
still served from rafmidlun.is/images/ (two header slides of the 3 Nov 2026 front page, the slides and content photos
of the earlier site). Sources and crops: `_docs/rafmidlun-2026-10-23/photos/SOURCES.txt`. No credit line under them.
- Hero: the geothermal plant, edge to edge under the headline (replaces the conductor canvas and the drawn board;
  the conductors stay in the divider and the closing block). Loads with a 1.4 s scale and fade, none under reduced motion.
- Field cards: cables (Nýlagnir), electrician (Viðhald), main switchboard (Skápasmíði), smelter from the air
  (Stóriðja), hands wiring a board (Stóreldhústæki: no photograph of kitchen equipment exists on their site).
- Field pages and Gæðastefna: one `Photo` plate under the page head (2:1, 3:2 phone crop, 2px corners, 1px ring).
  The Stóreldhústæki page keeps the drawing only.
- "Um fyrirtækið" opens with the busbar connections.
- No file is scaled past its source on a 1x screen; on 2x laptops the 1600 and 1920 px sources are stretched 1.4 to 1.7x.
  Ask for originals.

**Motion added 2026-11-12:** the phone menu stays mounted and unfolds from under the bar (clip-path, .62 s), rows
follow 55 ms apart, and it folds back in .42 s; closed it is `inert` and hidden. The hero headline and lead use the
engine's line reveal (M1). Photo plates use the grid reveal (M2). Card photos scale 1.04 on hover.

**Gæðastefna (2026-11-12):** their site gained this page on 3 Nov 2026 (ISO 9001:2015). It is in the build word for
word at `/gaedastefna`, linked from the footer. Every other text on their five pages is unchanged since the 23 Oct capture.
