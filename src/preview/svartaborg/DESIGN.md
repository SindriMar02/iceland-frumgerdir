# Svartaborg — "Svarta formið" (the black form)

**Design read:** two designer-owners (Rósa & Snæbjörn, farm Rangá) built two
black timber houses on a Diamond Circle hillside. The page's device inverts
Villa North's drawn elevation: here the building's SILHOUETTE is a filled
mask through which the photography shows. The valley appears inside the
shape of the house that looks at it. Two designers will recognise the page
is built from their own building's geometry.

**Dials:** VARIANCE 8 · MOTION 6 · DENSITY 3.

## Tokens

- **Type:** Familjen Grotesk only (400 + 500). Tracking -0.03em display,
  -0.015em headings, 0 body.
- **Palette:** charred-timber dark page. `--sb-black #101112` ground (their
  cladding), `--sb-bone #E9E6E0` text, `--sb-moor #6E7A5E` moss-moor
  secondary, accent `--sb-geo #4FA3A5` (geothermal steam teal) — sparingly.
  This is the catalogue's only DARK page in the batch; palette sampled from
  their own photography (black timber, autumn moor, teal water).
- **Radius:** 0. The house is a hard-edged form; so is the page.

## The mask device (signature)

The house silhouette is traced FROM THEIR PHOTO'S PIXELS (elevation-a.jpg,
Sobel + Hough per ledger #62 — never eyeballed): gable apex, both roof
pitches, wall verticals, ground line, as an SVG path in the photo's own
coordinate space with `preserveAspectRatio="xMidYMid slice"` so SVG and
`object-fit: cover` img crop identically at every width.

Used three ways, one mechanism (SVG clipPath on a rect, Lightship lineage):
1. **Loader:** the silhouette fills with bone on real progress; exit = the
   silhouette scales up past the viewport edges (the form swallows the page).
2. **Hero:** SVARTABORG wordmark sits inside the silhouette-clipped
   photograph (moor visible only through the house shape); on scroll the
   clip expands until the photo goes full-bleed — the house opens onto its
   own view.
3. **Section frames:** two mid-page images clipped to the gable form at rest,
   releasing to rectangles as they cross the viewport centre.

## Structure (7 sections)

1. **Hero** — silhouette-clipped `house-hillside.jpg`, wordmark reveal:
   letters rise inside the clip; scroll-away releases the clip to full bleed.
2. **Manifesto** — Rósa & Snæbjörn, designers, grandparents' farm Rangá,
   houses built 2020. Beside `living-wood.jpg` drift frame.
3. **The view held still** — `window-reflect.jpg` full-bleed with the
   picture-window as the composition; copy about the window seat.
4. **Geothermal** — `gable-tub-a.jpg` + `tub-close.jpg` + the Valerie quote
   ("easily my favorite spot we stayed on the ring road") as header.
5. **The Diamond Circle** — Goðafoss 10 min, Húsavík 20 (whales + GeoSea),
   Akureyri 30, Mývatn within reach. Facts from northiceland.is + their site.
6. **Seasons band** — `aerial-snow-a.jpg` ↔ `aerial-green.jpg` gable-clip
   crossover (the mask device's third use).
7. **Guests + booking** — Léa, Alex, Zi Qi quotes verbatim; 4.99 · 557
   reviews; request form → /stjornbord.

## Motion identity

"The form releases": clips expand outward from the silhouette; reveals slide
laterally (x -14 → 0) matching the long low building; drift frames per spec.
No downward pours (Laxfoss owns falling), no split (GC), no upward gravity
(Glass House), no drawn strokes (Villa North).

## Facts gate (their site + listing + Booking.com, retrieved 2026-08-06)

Hosts Rósa & Snæbjörn, designers, farm Rangá (grandparents built it, couple
bought + renovated 2018; houses built 2020). 4.99 · 557 reviews (Airbnb),
9.7 (Booking.com, 327). Sleeps 4 per villa. Private geothermal hot tub.
Goðafoss ~10 min, Húsavík ~20, Akureyri ~30. Diamond Circle. Contact
Svartaborg@gmail.com · +354 694 7020 (verified visible text; their hrefs are
broken template defaults — the pitch hook, never mentioned on the page).
NO price. NO aurora imagery (none exists in their set).
