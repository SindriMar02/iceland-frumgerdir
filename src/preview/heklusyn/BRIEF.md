# BRIEF — Heklusýn `/preview/heklusyn`

Standalone redesign prototype for **Heklusýn ehf** (kt. 490221-0690), a residence
development on the west bank of the Ytri-Rangá in South Iceland. Icelandic-first,
no language toggle.

Design system transplanted from a full source teardown of **era-residence.com**.
Take the *mechanics*, never the identity. Banned outright: arches/domes, quatrefoil
marks, bougainvillea framing, the plum/sky/blush palette, Didone display type.

---

## 1. THE THESIS

**Tólf hús á fimmtíu hekturum.** The scarcity *is* the product. Their site buries
this; the redesign opens with it. Everything else on the page argues for that one
sentence: the land was not subdivided, it was rationed.

Codename: `Tólf hús`. Tagline: *Landið heldur húsinu.*

---

## 2. LOCKED FACTS — the page may state these and nothing more

Every one is verbatim or directly derived from heklusyn.is. Do **not** add, round,
embellish, or invent a fact that is not on this list.

| Fact | Exact source wording |
|---|---|
| Estate size | "50 hectares (124 acres)" → *50 hektarar* |
| Density | "only 12–14 houses will be built across the entire 50-hectare estate" |
| River | "Set along the banks of the river Ytri Rangá" |
| Named horizon | "Mount Búrfell, Hekla, Bjólfell, Vatnafjöll, Tindfjöll, Selsundsfjall, Eyjafjallajökull and Þríhyrningur" |
| Origin | "Once part of the historic farmland of Leirubakki, the land became an independent property by the river Ytri Rangá in 2020" |
| Ground rule | "minimal disturbance to existing lava formations, moss, and native vegetation" |
| Plot size ceiling | "up to 5 hectares (12 acres) of beautiful land" |
| Rangárslétta 2 | 1.580 sq ft year-round house (**≈147 m²**), 5.2-acre plot (**≈2,1 ha**) |
| Rangárslétta 3 | 168 m², 11.8 acres (**≈4,8 ha**) — SOLD |
| Sold | Rangárslétta 3, 9, 11 |
| For sale | Rangárslétta 10, 2 |
| In construction | Rangárslétta 2, 10, 11 |
| Owners | Skúli K. Skúlason og Sigurlaug S. Einarsdóttir, ásamt Sigurði E. Guðmundssyni og Sunnevu Eiðsdóttur |
| Contact | heklusyn@heklusyn.is · +354 822 8080 |
| Company | Heklusýn ehf., kt. 490221-0690, Furubyggð 21, 270 Mosfellsbær |

**FORBIDDEN:** any price or price range (they publish none); any review score or
star rating (none exist); any claim about build quality, materials, insulation or
heating (that content is locked inside PDFs I could not read); "luxury" as a
self-applied label in Icelandic; any distance-to-Reykjavík figure; any lat/long.

---

## 3. THE HONESTY RULE THAT DEFINES THIS BUILD

Heklusýn's image library is **roughly half computer-generated**. Their own site
mixes renders and photographs without distinguishing them. The redesign must not.

**Real photographs — may be presented as the place:**
- `hero-estate.jpg` (2400×1350) aerial, house in the plain, river and mountains beyond
- `house-built.jpg` (2200×1467) the finished black-metal-and-timber house, gravel drive
- `land-river.jpg` (2400×1350) the valley, the river winding, mountains
- `house-autumn.jpg` (2200×1238) dark house with deck on a tussocked bank
- `winter-dusk.jpg` (2048×1152) snow, purple dusk, lit windows
- `construction.jpg` (2400×1350) timber frame going up on a cleared site

**Visualisations — every single appearance must carry a visible label:**
- `vis-living.jpg`, `vis-kitchen.jpg`, `vis-plan.jpg`, `vis-exterior.jpg`

Label them in the UI as **`Tölvumynd`** — a small caps chip, always visible, never
a hover-only tooltip, never only in an `alt`. A whole section may carry one heading
label instead of per-image chips, provided nothing renders outside it. If you are
unsure whether an image is a photograph, treat it as a visualisation.

This is not a nicety. Selling houses off unlabelled CGI is the thing we are fixing.

---

## 4. WHAT WE ARE FIXING (their live site)

1. No prices anywhere, and no "verð við hæfi" explanation either — just silence.
2. **No plot map at all.** The land is the product and it exists only as a video.
3. Technical Data is a wall of **PDF links** — 11 plot sheets, planning portal,
   design drawings — with not one fact on the page.
4. Project counters render `0` while 2026 listings are live.
5. Broken video embeds, duplicated menus.
6. 1024px renditions served from 2736–5472px originals.
7. Renders and photographs presented identically.

---

## 5. ART DIRECTION

Light, land-led, cold-northern. The opposite of a dark luxury site.

```
--ground   #F0ECE4   chalk            (page)
--ground-2 #E4DED2   warm sand        (alternate bands)
--ink      #161A17   basalt           (text; 15.8:1 on chalk — AAA)
--muted    #5C635C   lichen grey      (secondary; 5.9:1 on chalk — AA)
--river    #3E5C6B   deep river       (accent; 7.4:1 on chalk — AAA)
--tawny    #8A5A28   autumn grass     (rare accent; 6.1:1 on chalk — AA)
--dark     #141815   night band       (winter/dusk sections)
```
On `--dark`, text is `#F0ECE4` (15.1:1) and the accent becomes `#9BB6C4`.
**Compute and verify every pair you actually ship — do not trust these numbers blind.**

**Type** — self-hosted, already in `public/fonts/`:
- Display: **Gambetta** (`/fonts/gambetta/Gambetta-{Light,Regular,Medium,SemiBold,Bold,Italic}.woff2`)
- Body: **Supreme** (`/fonts/supreme/Supreme-{Regular,Medium,Bold}.woff2`)

`@font-face` with `font-display: swap`, relative `url()` so Vite fingerprints them
base-path-safe. Body text at **17px minimum** — ERA's 13px body is one of its real
defects and we are not copying it.

---

## 6. THE ERA MECHANICS TO IMPLEMENT

### 6.1 Fluid canvas
```css
html { font-size: 1vw }
:root { --ratio: 16 }                        /* 1600px desktop canvas */
@media (max-width: 991px) { :root { --ratio: 4.16 } }   /* 416px mobile canvas */
--s-16: calc(16rem / var(--ratio));           /* renders as exactly 16px */
```
Every measurement becomes `calc(Nrem / var(--ratio))`. The design zooms, it never
reflows. **Add the tablet canvas ERA lacks:** `@media (min-width:768px) and
(max-width:991px) { :root { --ratio: 8.34 } }`.

### 6.2 Self-theming chrome
Four wrapper classes (`.theme-chalk`, `.theme-sand`, `.theme-dark`, `.theme-river`)
redefine `--ink` / `--ground` / `--accent`. Components reference only the semantic
names. The fixed chrome (wordmark, nav, scroll cue) gets its own observer keyed on
**that element's own vertical centre** crossing a section boundary, with a `0.4s`
colour transition. Use IntersectionObserver + CSS transitions, not GSAP
ScrollTriggers per element.

### 6.3 The six reveal primitives
`a` (script chars) · `h` (heading chars, rotateY 90 + yPercent 50) · `p` (masked
lines, yPercent 110, no opacity) · `ctn` (opacity + y) · `line` (clip-path wipe) ·
`slide` (skewed polygon + inner counter-scale). Reveal **1.2s** `cubic-bezier(.25,1,.5,1)`,
hide **0.4s** `cubic-bezier(.5,0,.75,0)`. Stagger `.1` (`.05` for heading chars).

Durations: `--dur-s: .4s`, `--dur-m: .8s`, `--dur-l: 1.2s`. Every derived duration
must be a multiple.

### 6.4 Camera moves, never plain fades
Sections dive in, rise, wipe, recede. No `opacity: 0 → 1` on its own anywhere.

---

## 7. STRUCTURE — 10 sections

Deliberately **not** the batch-11 spine (frosted nav → colossal serif hero →
alternating bands → repeating SectionHead → card grid → centred sign-off). No
`SectionHead` component. No card grid. No colossal centred closer.

1. **Arrival** — full-bleed `hero-estate.jpg`, dive-in (scale 1 → 1.12 from
   `50% 75%`, scrubbed, so you descend *into* the valley). Wordmark + one line.
   Hero text must be visible with zero JS — animate **toward** the resting state.
2. **Thesis** — chalk. Two numbers set enormous in Gambetta: **50** hektarar /
   **12–14** hús. One paragraph. Nothing else.
3. **SIGNATURE — Sjóndeildarhringurinn.** The eight named mountains as an
   interactive horizon strip across `land-river.jpg`. Selecting a name marks its
   position on the ridge and shows the name set large. Keyboard-operable
   (roving tabindex, arrow keys, `aria-pressed`). This is theirs alone and nobody
   else in the portfolio has it. Label the positions honestly as *skýringarmynd* —
   they are indicative, not surveyed.
4. **Landið** — sand band. The Leirubakki origin, 2020 independence, the
   "minimal disturbance" ground rule. `house-autumn.jpg` full-bleed alongside.
5. **Húsin — ledger.** A typeset rate-ledger, *not* cards: one row per house,
   `Rangárslétta 2 · 147 m² · 2,1 ha · Til sölu`. Three states (Selt / Til sölu /
   Í byggingu) as a filter. Sold rows stay visible and struck — the scarcity is
   the argument. Ledger rows expand in place.
6. **Eitt hús** — Rangárslétta 2 in detail. `house-built.jpg` + `construction.jpg`
   paired: the frame and the finished house, same site.
7. **Árstíðirnar** — shutter reveal (converging `clip-path` polygons) between
   summer and `winter-dusk.jpg`. Dark band. The chrome re-themes here.
8. **Tölvumyndir** — the visualisations, in a section whose heading *is* the
   disclosure: "Tölvumyndir af innréttingum". Every image additionally chipped.
9. **Gögnin** — compliance-as-monument. The 11 plot sheets, the planning portal
   and the design drawings, typeset as a monument rather than a list of PDF links.
   State plainly that the documents are the developer's own.
10. **Fyrirspurn** — enquiry. Name, email, which house. `mailto:` prefilled to
    heklusyn@heklusyn.is. No fake booking engine, no fake price calculator.

---

## 8. NON-NEGOTIABLE ENGINEERING

- **`prefers-reduced-motion`** honoured everywhere. ERA has none; this is the single
  biggest thing we fix. Reduced motion = everything visible, no scrubbing, no
  parallax, static shutter.
- **Reveals animate toward the resting state** (`gsap.fromTo(..., {opacity:1,y:0})`
  or IO + CSS transition) plus a ~2s failsafe. A crawler, a screenshot service or a
  paused rAF must never get a hero with no text. This has bitten five builds.
- **No scroll-jacking.** No pinned hero. Scrubbed parallax is fine; holding the page
  still is not.
- Never put a CSS `transition` on a property you rewrite every scroll tick.
- `:focus-visible` rings on every interactive element, visible on both grounds.
- One `<h1>`. An `<h2>` per section. Decorative SVG `aria-hidden`.
- 44px minimum tap targets.
- No horizontal overflow and no vertical text clipping at 1440, 1366, 768, 375.
- Icelandic accents need open leading (≥1.15 on display) — no clipped `ð`/`þ`/`Á`.

## 9. CONTRACT

- Write **only** inside `src/preview/heklusyn/`. Create `Page.tsx` + `data.ts`.
- Prefix every keyframe, CSS custom property and class with `hk-`. Zero bare
  utility names that could leak. No edits to `index.css` `@theme`.
- Import and render `<PreviewChrome company={…}>` once near the top and
  `<PreviewFooter company={…}>` last; get the company via `getPreviewCompany('heklusyn')`.
- Images live at `import.meta.env.BASE_URL + 'heklusyn/<file>'`. Hero gets
  `fetchpriority="high"`.
- Do **not** run `npm run build` — the lead does that.
- Do not edit `App.tsx`, `companies.ts` or `package.json` — the lead wires those.
