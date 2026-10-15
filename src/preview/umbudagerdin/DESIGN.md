# Umbúðagerðin ehf. — DESIGN.md (locked 2026-10-15)

Route `/preview/umbudagerdin`. Prefix `ug` on every class, keyframe and token (nothing on `:root`).
Engine: Víkurverk round 3 (Lightship framing + Mammut shop + Pebble chooser), re-aimed. The behaviour is
transplanted (framed hero, floating glass capsule, label-roll pills, captioned rails, filter rail + open grid,
sticky purchase column, "added" panel, one opening per page, reveals that play once, no pins, no scrub).
What changes is the brand layer, the content and the signature instrument.

Design read: **B2B + walk-in shop for a corrugated-box factory, buyers are small businesses, web shops and
people sending or giving something; a calm product-led language that reads as the box itself.**
Dials: VARIANCE 6 · MOTION 4 · DENSITY 5 (a 338-product shop is a daily tool, not a gallery).

## 1. The idea in one line

**Hjá okkur er það stærðin sem skiptir mestu** (their own Kassagerð page). Every box on this site is a
measurement: lengd × breidd × hæð í millimetrum, innri mál. The signature instrument is **Kassamál**: you type
the three numbers, the FEFCO 0201 drawing from their own Kassamál page redraws to scale with L / B / H
dimension lines, the stock boxes that fit appear with real prices and a "setja á lista" button, and if none
fits the same numbers become a sérframleiðsla request (flute, colour, print, quantity, delivery). The
catalogue keeps your place: category, filters, sort, page and scroll position live in the URL and come back
on Back (the one thing Heiðar named first on the call).

## 2. Measured brand facts (umbudagerdin.is, 2026-10-15)

| What | Value | Source |
|---|---|---|
| Logo | "Umbúða gerðin" slab-serif wordmark with a folded-box mark in brown / red / amber, PNG 856×203 | `uploads/2021/03/Umg_logo.png` (header) |
| Brand colours | **brown `#4E3D31`** (secondary), **red `#AC2619`** (primary), **amber `#ECB54A`** (accent), text grey `#7A7A7A` | Elementor kit `post-10.css` global colours; the same three colours are the three faces of the logo mark |
| Fonts on the live site | Poppins (headings), Roboto (text), Roboto Slab (secondary) | Elementor kit. Not reused: Poppins/Roboto carry nothing of the brand; the slab is kept as the idea |
| Kraft | box flap `#8E7159`, box interior `#826D60`, studio background `#FAF9F7` | measured on their own 2020 shoot `JFM_280520_037.jpg` (5184×3888) |
| Photography | hands opening a kraft box on white (JFM 2020), open FEFCO box on kraft board (`28x28-3`, 1920×2560), honeycomb sheet (`HoneyC1`), 149 product shots on white from the Store API | harvest `img/` + `p/` |
| Stock | the iStock slides on their home page and Kassamál page | NOT reused (licensed to them, not us) |

The warm brown/red/amber family is the pipeline's banned "premium-consumer default", and here it is the
override case: the brief's own logo and kit name exactly these three colours. They are used as the logo uses
them: brown as the ink, red as the one signal, amber only where the box's third face shows.

## 3. Tokens

```
--ug-ink:      #2A2320   text (brown-black, never #000); display and hairlines
--ug-brown:    #4E3D31   logo brown: dark bands, footer, the buy bar glass
--ug-red:      #AC2619   the ONE signal: primary buttons, active chips, "á lista" state, focus ring
--ug-red-h:    #8F1F14   hover of the signal
--ug-amber:    #ECB54A   the box's third face: the "best fit" ring in Kassamál, the subscription pill, nothing else
--ug-kraft:    #C9B59B   kraft board tint, the Kassagerð band ground and the drawn box faces
--ug-kraft-d:  #A88F72   kraft shadow face
--ug-paper:    #FFFFFF   page
--ug-cream:    #F7F3EC   section ground (Lightship's beige, warmed to kraft)
--ug-sand:     #EFE9DF   panels, spec sheets, FAQ ground
--ug-grey-l:   #F3F2F0   product stage (Mammut's #F4F4F4, warmed)
--ug-steel:    #6F655C   secondary text (5.4:1 on white)
--ug-line:     #E6E0D6   hairlines
```
Radii: the engine's 8 / 12 / 10 / 18, pills full. No shadows except the capsule, the dropdown and the added panel.

## 4. Type

| Role | Face | Setting |
|---|---|---|
| Display (h1, h2, prices on the product page, the three numbers in Kassamál) | **Epunda Slab** 500 (600 for the Kassamál numbers) | the slab of their wordmark; `letter-spacing:-.025em`, lh 1, sentence case; Icelandic glyphs verified in the library index |
| Body, UI, product names, filters | **Satoshi** 400 / 500 / 700 | 16px min, lh 1.5, `tnum` on every number |
| Numbers (mm, kr., stk.) | Satoshi 500 `tnum` | a measurement is data, not display |

No Mona Sans: that is Víkurverk's voice. The slab is justified by the brand (their wordmark is a slab) and is
used with restraint: headings and the measured numbers only.

## 5. What is taken from the inspiration board (website pins only)

- **Pin 18 (Sum Hing Carton Box Factory):** one box, photographed plain, as the whole hero. Here it is their own
  2020 photo of hands opening a kraft box on white, framed full-height like Lightship, with dark text (the
  capsule stays white-text-on-photo only when the photo is dark; this one is light, so the over-hero state is ink).
- **Pins 38 / 47 / 66 (build-a-box, drawn product with dimension lines):** Kassamál = inputs on the left,
  the box drawn to scale with dimension lines on the right, the result updating live. Light, not dark.
- **Pin 85 ("I'm looking for ___ in ___"):** the home page carries the Kassamál sentence as a form:
  "Ég þarf kassa sem er [L] × [B] × [H] mm" with a single button.
- **Pins 172 / 168 / 84 (Woo filter pattern, quiet list, chapters):** the shop keeps Mammut's filter rail
  (category with counts, price bands, "í kassa / í búnti" pack size) and adds the SKU under every name and a
  page bar with real links (the fix for "Load more").
- **Pin 94 (numbered part list):** the product page lists the measurements as a part list (innri mál, bylgja,
  litur, stk. í kassa, vörunúmer) in the sand spec sheet, not prose.
- **Pins 5 / 125 (flat-photographed products on a quiet ground):** product tiles on the warmed grey stage with
  `mix-blend-mode:multiply`, the engine's own card.
- Not taken: dark industrial (95, 181), kraft-texture backgrounds as decoration (118, 130), sold templates.

## 6. Pages

`''` home · `kassamal` (the instrument) · `kassagerd` (sérframleiðsla, FEFCO styles, bylgja, prentun, áskrift)
· `verslun` (+ `?flokkur= &verd= &pakki= &rod= &sida=`) · `verslun/<slug>` · `listinn` (pöntunarlisti with the
tier table) · `fyrirspurn` (custom-box request, prefilled from Kassamál) · `um-okkur` · `afgreidsla`
(staff inbox) · `personuvernd`.

## 7. Motion budget (the engine's, unchanged)

One opening per page (capsule drop on first load, hero frame settle 1.4s, lines 0.9s), reveals that play once at
0.8s on `top 90%`, hover feedback, the Kassamál drawing re-measures with a 0.35s `--out` transition on the
dimension lines (a state transition, motivated). No pinning, no scrubbed parallax, no marquee, no lens.
`MotionConfig reducedMotion="user"`, Lenis on fine pointers only.

## 8. Facts and data

- Every price, SKU, product name, pack size and category is from the Store API dump of 2026-10-15
  (`_docs/umbudagerdin-harvest-2026-10-15/products-all.json`); 149 of 338 products are shown (the box
  categories complete, 8 per other category) and the page says so.
- Custom boxes have no public price and the prototype never shows one: Kassamál ends in a request.
- Bulk tiers: Discount Rules for WooCommerce is installed on their site with the table off; the prototype shows
  the tier *mechanism* with the rows labelled "sýnishorn", and the PDF says Umbúðagerðin sets the numbers.
- Copy is their own (Kassagerð, Kassamál, Þjónusta, Um okkur, Umhverfisábyrgð pages), lightly cut.
- Nothing is sent: requests and the list live in this browser.
