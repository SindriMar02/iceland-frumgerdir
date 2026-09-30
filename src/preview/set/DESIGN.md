# Set ehf. — DESIGN.md (locked for the gate, 2026-09-30)

Route `/preview/set` (IS), `/preview/set/en` (EN). Slug and CSS scope: `set`. Every class is prefixed `set-`, every keyframe `set-*`, and every token lives on `.set-root` (none on `:root`).

Sources: inspiration 1 (catalogue grid), inspiration 2 (orange accordion and rail), inspiration 3 (Chema video, `video-motion.md`), the Live-up rebuild (spine) and the Whitedesert card-flick (rail only). The harvest is in `_docs/set-harvest-2026-09-29/` (Store API JSON, media inventory and `photo-manifest.json`, all fetched 2026-09-29).

---

## 1. The idea in one line

**The letters of Set's logo are pipes.** The wordmark is a thick black stroke with a white bore running through it, so every letter is a pipe in section. That stroke logic becomes the one device: a black ring with a white bore line. It draws on in the loader, sits in the hero mark, rings the active rail card and replaces the inspiration's dotted circles as the "Skoða allt" button. Everything else stays white, grey and hairline, and the products do the talking.

## 2. Measured brand facts (set.is, 2026-09-29)

| What | Value | How measured |
|---|---|---|
| Logo | black contour wordmark "set", 389×200 PNG `2021/12/setlogo_dark.png` | downloaded; it will be traced to SVG with potrace (a faithful trace, not a redraw) |
| Accent | **green `#83B635`** (rgb 131,182,53) on every live button ("Sjá fleiri fréttir", SAMÞYKKJA) and on their family icon set | computed style in the browser |
| Dark | **petrol `#002D3D`** top bar; the family catalogue covers are petrol with line icons in circles | computed style and the media library |
| Red `#CC2B2B` | the Creditinfo "Framúrskarandi fyrirtæki 2024" badge, **not** the brand | located in the markup |
| `#FF6900` and similar | WordPress default block palette, unused | markup |
| Fonts | Lato (body), Poppins (headings) | computed style; not reused because they don't carry the design |
| Family numbering | **Set's own**: 1 Hitaveituefni, 2 Vatnsveituefni, 3 Fráveituefni, 4 Hlífðarrör, 5 Stálrör og fittings, 6 Verkfæri, 7 Aðrar vörur | their catalogue covers `*_kafli_*_WEB.jpg` |

**Decision: the inspiration's orange is dropped in favour of Set's own green and petrol.** It is the same role (one accent on the active number and large moments) filled by their real colours.

## 3. Tokens

```
--set-ink:      #111111   text, display, hairlines at 100%
--set-muted:    #5C6166   secondary text (6.26:1 on white, 5.58 on card)
--set-paper:    #FFFFFF   page
--set-card:     #F2F2F0   product card, list rows (ink 16.85:1)
--set-card-2:   #E8E8E5   inactive rail cards, pressed states
--set-rule:     #111111 at 1px, dotted via SVG dash 1/3 (the "dimension line")
--set-petrol:   #002D3D   active rail card, drawer head, loader field (white 14.56:1)
--set-green:    #83B635   ring stroke, active number chip, "on list" dot, focus ring fill
                          text rule: NEVER green text on white (2.41). Ink on green 7.83, green on petrol 6.04.
--set-green-deep:#4F7A14  only if small green text on white is unavoidable (5.09)
```
Radii: **square everywhere (0)**. The only curves are the ring device (circles) and one pill: the count badge on the list button. There are no shadows or gradients. Separation comes from tone (card on paper) and hairlines.

## 4. Type

| Role | Face | Setting |
|---|---|---|
| Display (VÖRUR, family names, EFNISLISTI) | **Strichpunkt Sans Variable** wdth 160, wght 760, uppercase, lh .9, ls −.02em | free-licensed and self-hosted from `~/Design fonts`; all of Á Ð É Í Ó Ú Ý Þ Æ Ö verified by cmap and rendered (specimen) |
| Section heads, rail titles | Strichpunkt wdth 130, wght 600, sentence case | |
| Body, UI | **Switzer** 400/500, 16px minimum (17px desktop body), lh 1.5 | |
| Data (SKU, dimensions, quantities) | Switzer with `tnum`; SKUs set as `2.18020` in 500 | no mono; the table carries the precision |

**Display fitting (a HARD rule, per `icelandic-titles-break-a-display-scale`).** Every display title is fitted per word from fontTools advances, never by the browser's word breaking: `font-size: min(var(--set-d), calc((100vw - 2*gutter)/var(--fitw)))` with `overflow-wrap:normal`. Measured at wdth 160/760: VATNSVEITULAGNIR is about 11.7 em, so it sets at 24.7 px across 288 px (320-wide phone) and hits the cap on desktop. VÖRUR is about 4.1 em, so 70 px on a 320 phone. The longest word in the product data is *Brunnþéttihringur* (product names are set in Switzer, never in display). The fit is audited at 320, 390, 768, 1024 and 1440 on every display title.

## 5. Layout

- 12-column grid, 16 px gutter on phones and `2.34vw` from 1024 (the Live-up gutter), `9.38vw` section rhythm.
- Header: the **mobile-chrome standard** (a constant fixed glass bar in paper at .88 with blur and a hairline, plus the sticky ink awning), with no hide or reveal. On desktop the nav runs in `mix-blend-mode:difference` over the hero (Live-up) and becomes solid once past it, via one IntersectionObserver on the hero. Items are Vörur, Framleiðsla, Um Set, Gögn, the **Efnislisti (n)** button and IS/EN.
- Catalogue rows (image 1): a left column of 3/12 (number, family name, description, ring "Skoða allt") and three cards on 9/12. On phones: the heading, then a horizontal snap rail of cards (native scroll, `scroll-snap-type:x mandatory`).

## 6. Pages (IS and EN, one URL per item per language)

1. **Forsíða** `/preview/set`: loader, hero, then VÖRUR (catalogue rows 1 to 7 with the filter), then "Hvernig við vinnum" (the numbered accordion), then FRAMLEIÐSLA (rail), then the Efnislisti teaser, then the footer.
2. **Vöruflokkur** `/preview/set/vorur/:family`: the full product list for one family, real products with filter by subcategory, A–Z/grid toggle, search inside the family and pagination with the ring device.
3. **Vara** `/preview/set/vara/:slug`: the product page (the real attributes table from the Store API, SKU, category trail, "Bæta á lista" with quantity and unit, the related family and the link to set.is's own page and PDF catalogue).
4. **Efnislisti** `/preview/set/efnislisti`: the gap (section 9).
5. **Yfirferð** `/preview/set/yfirferd`: the staff review queue, labelled **sýnigögn / sample data**.
EN mirrors each: `/preview/set/en/...`. Product names, SKUs and attribute values stay as Set publishes them (Icelandic). EN translates the UI and our copy only, and says so once ("Product names as listed by Set").

## 7. Components

- **Product card** (image 1): square, `--set-card`, brand or subcategory label top-left (13px), the product photo centred, name bottom-left (Switzer 16/500), SKU under it (muted), and two actions: "Skoða" (underlined text link) and "+ Á lista" (an icon button, 44×44 target, that turns into a green dot plus the quantity once added). Product photos are Set's own white-background shots set with `mix-blend-mode:multiply` on the card grey, so the white drops out. That gives one consistent flat-grey treatment without faking cutouts. 607 of 942 harvested products have a photo. The rest show a line-drawn ring placeholder built from the family icon, never a stock image.
- **Ring button** ("Skoða allt", pagination, arrows): a 44 px circle as a black 2px stroke with a 1px white bore line (the logo's stroke), arrow inside. Hover: the ring's dash draws around once (stroke-dashoffset, .6s expo).
- **Filter row** (image 1): "Vöruflokkur: [Allir ▾]" at left, search field, and at right the A–Z / grid toggle as two square 44 px buttons (active = ink fill). A–Z switches the catalogue from family rows to one alphabetical list of every harvested product with Icelandic collation (`localeCompare('is')`) and letter headers. Grid mode is the family rows. Both work on the real 942 products.
- **Numbered accordion** (image 2): the number (green chip when open), an uppercase row title in Strichpunkt wdth 130, a plus/minus square at 44 px, and the bracket hairline (a 1px rule with 6px end ticks) under each row. It opens via grid-template-rows 0fr→1fr at .7s expo, and `aria-expanded` is correct.
- **Framleiðsla rail** (image 2 + Whitedesert card-flick): numbered cards with photo, title and two lines of text. On desktop, hover or focus makes a card active: it takes 50% of the rail width and the others share the rest (width transition .75s `cubic-bezier(.16,1,.3,1)`). The active card turns petrol, its number becomes a green chip and a fine green ring circles the number. On touch it is a native horizontal scroll; a tap activates. It is never pinned.
- **List drawer**: a right-side sheet (full-screen on phones), petrol head with the count, rows with SKU, name, quantity stepper and unit select, a "Opna efnislista" button, and a backdrop that uses the video's blur plus white wash.
- **Footer**: petrol, the real two addresses, hours, phone and email, the IS/EN link to set.is's international sites, and the SNDR credit per the footer gate.

## 8. Content map (their words first)

| Slot | Content | Source |
|---|---|---|
| Hero line | "Við færum þér lífsgæði með lögnum." | set.is homepage, verbatim |
| Hero sub | "Vatnsrör, hitaveiturör, fráveiturör og rafmagnsrör, framleidd á Selfossi síðan 1978." | their site title plus their founding year; wording ours, facts theirs |
| Catalogue rows 1–7 | Set's own seven families, in their own numbering; each description written from the family's real contents | Store API categories and counts |
| Accordion "Hvernig við vinnum" | 01 Vörulisti og tæknihandbók · 02 Gagnasafn · 03 Tilboð (karfa, sala@set.is, 480 2700) · 04 Afhending um allt land (resellers and Flytjandi) · 05 Afgreiðsla á Selfossi og í Klettagörðum · 06 Fræðsla (Set-Plastiðnaðarskólinn and courses for customers) | `/upplysingar/`, `/fyrirtaekid/`, footer: all items exist on their site |
| Rail "Framleiðsla" | 01 1968 Steypuiðjan (B&W archive `img207`) · 02 1978 Einangruð hitaveiturör (archive `img206`, 1972 truck) · 03 1982 Fyrstu plaströrin (archive `Picture1`) · 04 Selfoss today (extrusion tool `20260202_135949`) · 05 Þýskaland, manufacturing in Germany (photo only if one is identifiable as Germany; otherwise a text card) · 06 Í jörðu (field install, winter weld `20240104_145036`) | their timeline on `/fyrirtaekid/` and the ownership notice |
| Numbers | only their own: 1968, 1978, 1982, 20–63 mm first PE pipes. **No revenue, loss, staff count or ownership figures.** | |

## 9. The gap: Efnislisti fyrir verkefni

- "+ Á lista" on every card and product page adds the item to the drawer. The count shows in the header.
- `/efnislisti`: a table (SKU · name · quantity stepper · unit: m / stk / rúlla / lengd, defaulted from the product's own attributes, e.g. Rúllulengd means rúlla or m) plus the project fields: **Verkheiti / tilvísun**, **Óskuð afhending** (date), **Afhendingarstaður** (Selfoss / Klettagarðar / flutningur), **Athugasemdir**, **Viðhengi** (a file picker that only lists the filename; nothing is uploaded).
- **Vista lista / Opna vistaðan lista**: named lists in localStorage (in the preview only, stated on the page).
- **Senda til tæknilegrar yfirferðar**: a summary step (the video's modal pattern: blur backdrop, the panel resolves), then an acknowledgement state ("Beiðni móttekin, háð yfirferð. Sölumaður hefur samband."). **Nothing posts.** A permanent fallback line reads: sala@set.is · 480 2700.
- The copy promises no price, stock or suitability: "Beiðni, háð yfirferð."
- The **demo list starts with 2.18020 PE plaströr SDR11 20 mm** (a real product with real attributes), plus two real related items from the same family.
- `/yfirferd` (staff view): the queue of incoming lists with status (Ný / Í yfirferð / Tilboð sent), the one the visitor just sent at the top, and the rest labelled **sýnigögn**. It shows what a salesperson sees: the list, missing information flagged (e.g. no unit), and a reply draft.
- Out of scope, per the brief: calculators, suitability logic, a portal or ERP link, and AI.

## 10. Motion spec (hybrid, locked by Sindri 2026-09-29)

One curve for everything: **`--set-ease: cubic-bezier(.16,1,.3,1)`** (Live-up expo). One IntersectionObserver (threshold .15, rootMargin 0 0 −40px, fires once) drives all reveals.

| # | Element | Motion | Source |
|---|---|---|---|
| M1 | Loader | a petrol field; the logo's contour strokes draw on (stroke-dashoffset, 1.1s), then the shutter wipes up 1.2s `cubic-bezier(.87,0,.13,1)`. It runs once per session (sessionStorage) and is skipped with reduced motion | Live-up loader + logo |
| M2 | **Giant display titles** (VÖRUR, the family names, FRAMLEIÐSLA, EFNISLISTI) | **masked line slide** translateY 108%→0, 1.2s, 80 ms line stagger | Live-up |
| M3 | **Section heads, body, labels** | **per-word blur resolve**: `filter: blur(10px)→0`, opacity 0→1, y 12px→0, .8s, 60 ms per-word stagger, left to right | video (hero and section headings) |
| M4 | Hero line (the one exception) | the blur resolve at the video's own pace: .9s per word, 100 ms stagger, 250 ms after the shutter | video 0–2.2s |
| M5 | Cards (catalogue, rail) | blur resolve at card level (blur 8px, y 16px), 70 ms stagger across the three | video (product tiles) |
| M6 | Photos | drift inside their frames (scale 1.08, translateY ±4% scrubbed by rAF on scroll, desktop only), one layer | Live-up core-value drift |
| M7 | Nav | difference blend over the hero, scroll-spy dot on the current section | Live-up |
| M8 | Filter change | the grid crossfades (opacity .35s out, new set resolves with M5); the active filter underline draws in scaleX 0→1 .6s | Live-up works wall |
| M9 | Accordion | grid-rows 0fr→1fr .7s; body text blur-resolves with M3; plus rotates to minus 45° .4s | native |
| M10 | Rail card-flick | flex-basis width .75s; the active card background crossfades to petrol .4s; its ring draws once | Whitedesert |
| M11 | List add | the "+" morphs to a check, a green dot pops (scale .6→1, .35s) and the header count rolls (masked digit roll, .5s) | Live-up text-roll |
| M12 | Drawer / review modal | backdrop blur 0→8px plus a white wash .25s; the panel resolves blur 12px→0, opacity 0→1, y 8px→0 in .35s. Closing reverses | video modal |
| M13 | Ring button hover | the ring dash draws around once, .6s | logo device |
| — | Scroll | Lenis on desktop (duration 1, easeOutCubic), native on touch. No pins, no page transitions, no sliders beyond the rail | Live-up |

`prefers-reduced-motion`: M1 skipped; M2/M3/M4/M5 become a 200 ms opacity fade with no blur or transform; M6 off; M10 width snaps; Lenis off. The blur is applied only while an element is animating (removed afterwards so text is never left rendered through a filter). `will-change` goes on the animating element only.

## 11. Fixes to the reference defects (on purpose)

`<html lang="is">` / `lang="en"`; no JA-style glosses; the mobile menu stack centred (the fix for Live-up G28); a proper reduced-motion branch (G-gap); the email fit (if any) measured after `document.fonts.ready`; no WebGL lens; no Lato or Poppins; `viewport` allows zoom (set.is disables it); every product image gets a real alt text (name plus SKU); privacy and terms link to set.is's real pages when they exist, otherwise the links are omitted, never `#`.

## 12. Imagery rules

Set's own photos only (`photo-manifest.json` records the source URL and fetch date for every file). Product shots: the multiply-on-grey treatment. Field and factory photos: consistent 4:5 crops, no filters except the archive photos, which keep their own black and white. The Set Mótið football photos (the giant pipe ring) are **not used**: they show children at a sports event. No generated images; Higgsfield isn't needed, because their own extrusion-tool photo is the signature image.

## 13. Open items for Sindri at the gate

1. Is the green plus petrol swap for the inspiration's orange OK? (Recommended: yes. It uses their measured colours.)
2. Rail card 05 "Þýskaland": I have no photo identifiably from the German plant, so it becomes a text-only card unless one turns up.
3. EN product names stay Icelandic (Set's data). OK?
