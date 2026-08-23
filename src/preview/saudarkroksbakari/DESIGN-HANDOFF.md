# Sauðárkróksbakarí — Design Handoff
**Concept:** "Krókurinn" — Calm Bakery Morning  
**Built:** 2026-06 | **Stack:** Vite + React 18 + TS + Tailwind v4 + Framer Motion  
**Live preview route:** `/preview/saudarkroksbakari`  
**Page file:** `src/preview/saudarkroksbakari/Page.tsx`  
**Data file:** `src/preview/saudarkroksbakari/data.ts`  
**Images needed:** `src/preview/saudarkroksbakari/IMAGE-PROMPTS.md` (12 shots, Seedream 4.5, Unlimited ON — zero credits)

---

## Creative Direction

**One-line brief:** Awwwards-level calm minimalism — an Apple gallery crossed with Starbucks warmth, for Iceland's oldest bakery.

**What it must feel like:** Picking up a warm roll of bread from a sunlit marble counter. No noise. No busyness. The photography does the talking; the UI recedes. Warm, human, rooted in place.

**Anti-pattern (explicitly rejected by client):**
- Dark→light crossfade hero (built, reverted — client said "jittery, doesn't work")
- Bodoni Moda / Playfair / Cormorant / Fraunces — any high-contrast Didone fashion serif reads as "AI slop" here
- Sharp right-angle corners anywhere
- Dense maximalist 7-section layout
- Scroll-jacking or ambient zoom
- Cold white canvas
- Generic hero-over-image + two buttons + rotating ticker

---

## Design Tokens

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `CREAM` | `#F4F1EA` | Primary canvas — warm flour/oat white. Never cold white. Every section bg. |
| `OAT` | `#EBE6DA` | Alternating section bands (Sagan + Heimsókn). Slightly darker cream. |
| `CARD` | `#FBFAF7` | Card/tile surfaces. Warm near-white — lighter than CREAM. |
| `INK` | `#2A2420` | Primary text. Near-black, warm-tinted (not cold #000 or #111). |
| `MUT` | `rgba(42,36,32, 0.66)` | Body / descriptive text. |
| `MUT2` | `rgba(42,36,32, 0.50)` | Captions, meta, labels. |
| `HAIR` | `rgba(42,36,32, 0.12)` | Hairlines, card borders. |
| `CLAY` | `#9A4B2E` | Terracotta accent. Used for CTAs, eyebrows, price, phone card bg, map pin. AA on CREAM. Use sparingly. |
| `SAGE` | `#56654F` | Calm soft green. "Opið núna" badge ONLY. |

**Palette rule:** One warm accent (CLAY), used 4–5 times per page. No secondary accent. The warmth comes from the canvas, not from colourful UI.

### Picture shadow system

```
PIC_SHADOW    = '0 26px 64px -34px rgba(42,36,32,0.55)'  // hero + big section images
PIC_SHADOW_SM = '0 16px 38px -26px rgba(42,36,32,0.5)'   // product card images
```

This is the "Apple move" — each photo has one soft warm shadow as if it's physically resting on the cream surface. No card borders on images. No outer glow. Just this one shadow.

### Corner Radii

| Element | Radius |
|---|---|
| Hero image | `28px` |
| Section feature images | `24px` |
| Product card images | `20px` |
| Info cards (address, hours) | `20px` |
| CTAs / pill buttons | `9999px` (full pill) |
| Tags / badges | `9999px` (full pill) |

**Rule:** Rounded everywhere. No sharp corners in the UI.

### Typography

| Role | Font | Weight | Treatment |
|---|---|---|---|
| Display headings (h1, h2, h3) | **Bricolage Grotesque** | 600 (semibold) | `lowercase`, tight tracking `-0.02em` to `-0.025em`, leading `1.02`–`1.05` |
| Eyebrows | **Hanken Grotesk** | 700 | `uppercase`, `tracking-[0.22em]`, `11px` |
| Body / UI | **Hanken Grotesk** | 400/500/600 | Normal case, `leading-relaxed` |
| Price labels | **Hanken Grotesk** | 600 | CLAY colour |
| Meta / captions | **Hanken Grotesk** | 400 | MUT2 colour, `13px` |

**Critical type rule:** All display headings are `lowercase` in CSS. This is intentional — it's the warm, humble artisan voice of the bakery, not a fashion editorial. Bricolage Grotesque in lowercase with tight tracking at large sizes reads as calm and characterful, not cheap.

**Fluid sizing:**
- h1 hero: `clamp(2.6rem, 7.5vw, 5.25rem)` 
- h2 chapter: `clamp(2rem, 5.2vw, 3.4rem)`
- h2 sections: `clamp(1.8rem–2rem, 4–4.8vw, 2.6–3.2rem)`
- h3 product cards: `text-lg` (18px)

**Google Fonts loaded:** Bricolage Grotesque, Hanken Grotesk (both in `index.html`). Tailwind utilities: `font-bricolage`, `font-hanken`.

---

## Layout Architecture (5 Sections)

### Masthead (sticky)
- Frosted cream: `rgba(244,241,234,0.78)` + `backdrop-blur-md`
- Hairline bottom border
- Left: `Sauðárkróksbakarí` in Bricolage (semibold) + small `est. 1880` meta tag
- Right: 2 plain text nav links + 1 INK full-pill CTA "Heimsókn"

### Chapter 1 — Landing (`#top`)
Background: `CREAM`

**Layout (max-w-6xl):**
1. Eyebrow: `Bakarí · Sauðárkrókur · síðan 1880`
2. h1: `nýbakað á hverjum morgni` — clamp fluid, lowercase, INK
3. Body: one warm sentence in Icelandic (MUT, 19px, max-w-xl)
4. Two CTAs side by side: CLAY pill "Sjá úr ofninum" + plain INK link "Hringja · 455 5000"
5. **The 4K picture** — full-width `aspect-[16/9]`, `rounded-[28px]`, PIC_SHADOW; Reveal fade-in
6. Below image: subtle caption row (address · stars · opening hour) in MUT2

**Spacing:** `pt-16 md:pt-24` section, `mt-14 md:mt-20` before image. Generous.

### Chapter 2 — Úr ofninum (`#bordid`)
Background: `CREAM`, `pt-28 md:pt-36`

1. Eyebrow + h2 + body (max-w-2xl intro block)
2. **Signature feature:** 2-col grid `md:grid-cols-2` — image left (4:5, `rounded-[24px]`, PIC_SHADOW), text right. Signature product is `PRODUCTS[0]` (chocolate snúður). Text includes: OAT-bg CLAY-text pill tag, h3, Icelandic en-gloss in MUT2, long blurb, CLAY price.
3. **Gallery grid:** `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` — `PRODUCTS[1..7]`. Each is a `ProductCard`: image `rounded-[20px]` PIC_SHADOW_SM, with hover-scale `.sb-card-img`, caption below (h3 name + CLAY price inline, blurb in MUT). Staggered reveal delays.
4. Fine-print disclaimer in MUT2.

### Chapter 3 — Sagan (`#sagan`)
Background: `OAT`, `py-24 md:py-32`

Two-column grid `lg:grid-cols-[1fr_1.05fr]`:
- Left: baker's hands image (5:6 aspect, `rounded-[24px]`, PIC_SHADOW) in Reveal
- Right: Eyebrow + h2 + 2 body paragraphs (heritage story) + 3 stats in `<dl>` (1880 / 146 / 4,7★), stats use Bricolage for big number, Hanken small-caps for label

### Chapter 4 — Staðurinn + Umsagnir
Background: `CREAM`, `pt-28 md:pt-36`

1. **Wide interior image** — full-width `aspect-[2/1]`, `rounded-[28px]`, PIC_SHADOW, Reveal
2. Below: 2-col grid — Eyebrow + h2 ("bjart hús með fjörutíu sætum") left; body paragraph right (self-end aligned)
3. **Reviews block** — `mt-24 md:mt-32`, header with Eyebrow + h2 ("4,7 stjörnur og travelers' choice") left, disclaimer right
4. 3-col review grid: each `<li>` has top hairline border → Bricolage quote (INK, `xl`) → Hanken author (INK, `sm`, semibold) → meta (MUT2)

### Chapter 5 — Heimsókn (`#finna`)
Background: `OAT`, `py-24 md:py-32`

Eyebrow + h2 ("aðalgata 5, í hjarta bæjarins") + body intro.

2-col grid `lg:grid-cols-[1fr_1fr]`:
- Left: 2×2 grid of 4 CARD tiles (`rounded-[20px]`, HAIR border):
  - **Address card:** Eyebrow + street name (Bricolage xl) + town + region + CLAY "Opna í kortum" link
  - **Hours card:** Eyebrow + live open/closed badge (SAGE or MUT) + dl hours list + "Sýnishorn" label
  - **Phone card:** CLAY background, CREAM text, Bricolage "455 5000" + phone SVG icon
  - **Email card:** CARD bg, CLAY eyebrow + plain email address
- Right: Bespoke SVG paper map — old-town grid, fjord shape in SAGE-tinted green, CLAY Aðalgata highlight line, animated pulse around pin, label box. Map link button (CLAY pill) anchored bottom-right. **No GPS coordinates anywhere** — map link uses `google.com/maps/search/?query=Sauðárkróksbakarí%2C+Aðalgata+5%2C+Sauðárkrókur`.

### Mobile Sticky Bar
Fixed bottom, slides in after 85vh scroll. Two full-pill buttons: INK "Hringja" + CLAY "Finna okkur". `md:hidden`.

---

## Motion System

**Philosophy:** stillness. Chrome barely moves. Photography breathes.

| Element | Motion |
|---|---|
| Section reveals | `Reveal` component: IntersectionObserver, `opacity 0→1 + translateY 20px→0`, `0.8s`, `--ease-plate`, staggered per grid item. One-shot. |
| Product card image | CSS: `.sb-card-img { transition: transform 0.8s var(--ease-plate) }` hover → `scale(1.04)` |
| Nav CTA / pill buttons | `hover:-translate-y-0.5` (Tailwind) — 2px lift only |
| Map pin | SVG `<animate>` pulse: `r` 22→32→22 + opacity 0.2→0.05 over 3.4s. Decorative only. |
| Mobile bar | CSS `transition-transform duration-300` translate-y |
| Scroll-jacking | **None. Zero. Forbidden.** |
| rAF / Framer scroll hooks | **None** — they don't work in the preview environment anyway |
| `prefers-reduced-motion` | `useReducedMotion()` disables all Reveal transitions; CSS also has `@media (prefers-reduced-motion: reduce)` to kill card hover |

---

## Content (Icelandic — Fact-Checked)

All Icelandic verified against real reviews (Tripadvisor/HappyCow) and bakery sources.

**Verified facts:**
- Founded ~1880 — one of Iceland's oldest bakeries
- Address: Aðalgata 5, 550 Sauðárkrókur
- Phone: +354 455 5000
- Email: saudarkroksbakari@gmail.com
- Fire in 1979, rebuilt, oven re-lit
- Tripadvisor 4.7 stars + Travelers' Choice
- ~40 seats indoor + outdoor
- Region: Skagafjörður

**Products (fact-checked — only items tied to this bakery in real reviews):**

| ID | Icelandic | English | Price |
|---|---|---|---|
| snudur-sukkuladi | Snúður með súkkulaði | Chocolate-glazed cinnamon bun | frá 450 kr |
| snudur-karamellu | Snúður með karamellu | Caramel-glazed cinnamon bun | frá 450 kr |
| snudur-sykur | Snúður með sykri | Sugar-glazed cinnamon bun | frá 450 kr |
| kleinuhringur-bleikur | Bleikur kleinuhringur | Pink-iced donut | frá 390 kr |
| nutellastong | Nutellastöng | Nutella-filled pastry | frá 590 kr |
| rugbraud | Danskt rúgbrauð | Danish-style rye bread | frá 890 kr |
| vegan-croissant | Vegan croissant | Vegan croissant | frá 790 kr |
| kaffi | Kaffi | Coffee | frá 590 kr |

**Do NOT add:** kransakaka, hálfmánar, randalín, marengs, lakkrístoppar — none are sourced to this bakery.

**Sample hours (labelled as sýnishorn):**
- Mán–Fös: 7:30–18:00
- Laugardaga: 8:00–16:00
- Sunnudaga: 9:00–16:00

---

## Images Required (12 shots)

**All generated in Higgsfield web app — Seedream 4.5, Unlimited toggle ON (zero credits). Do NOT use Higgsfield MCP (burns credits even for unlimited models).**

Full prompts in `IMAGE-PROMPTS.md`. Drop files into `public/saudarkroksbakari/` with exact filenames below:

| Filename | Aspect | Section used |
|---|---|---|
| `hero-swirl-wide.jpg` | 16:9 | Chapter 1 hero (full-width) |
| `hero-swirl.jpg` | 4:5 | Mobile hero crop |
| `oven-hands.jpg` | 4:5 | Chapter 3 Sagan (baker's hands) |
| `snudur-sukkuladi.jpg` | 4:5 | Signature feature + product card |
| `snudur-karamellu.jpg` | 4:5 | Product card |
| `snudur-sykur.jpg` | 4:5 | Product card |
| `kleinuhringur-bleikur.jpg` | 4:5 | Product card |
| `nutellastong.jpg` | 4:5 | Product card |
| `rugbraud.jpg` | 4:5 | Product card |
| `vegan-croissant.jpg` | 4:5 | Product card |
| `kaffi.jpg` | 4:5 | Product card |
| `interior-marble.jpg` | 3:2 | Chapter 4 wide interior shot |

**Mood:** Every shot is bright Nordic morning, pale Carrara marble, natural pine, warm espresso tones. No dark/noir. See IMAGE-PROMPTS.md for full per-shot prompts.

---

## Accessibility

- One `<h1>` only (hero)
- Every section has an `<h2>`
- Products have `<h3>`
- All `<Img>` have descriptive Icelandic `alt` text
- Decorative SVGs: `aria-hidden="true"`
- CTAs: minimum 44–52px height touch targets
- CLAY on CREAM: passes WCAG AA for text (verified)
- SAGE used only for a small badge with text, not as sole meaning indicator
- Focus rings: via `:focus-visible` (Tailwind default)
- `<nav>` landmark, `<main>`, `<header>`, `<section>` with `aria-label`

---

## After Images Land

1. `npm run dev` → navigate to `/preview/saudarkroksbakari`
2. Confirm each image slot loads (check no cream gradients remain)
3. `npm run lint && npm run build` — must be clean
4. Add route to postbuild prerender list in `package.json` if not already there
5. `git commit` + `git push main` → auto-deploys to GitHub Pages in ~30s
6. Curl `https://sindrimar02.github.io/iceland-frumgerdir/preview/saudarkroksbakari/` for HTTP 200

---

## What NOT to Change

- Do not add GPS coordinates anywhere — all map links use `google.com/maps/search/?query=` format
- Do not add scroll-jacking, pinned heroes, or rAF loops
- Do not switch to Bodoni Moda, Playfair, Fraunces, or any Didone serif
- Do not change the `lowercase` CSS on headings — it's intentional
- Do not add more sections (currently 5 calm chapters — that's the limit)
- Do not use the Higgsfield MCP for image generation (always burns credits)

---

## Key File Paths

```
src/preview/saudarkroksbakari/
  Page.tsx              ← full page (self-contained)
  data.ts               ← all content, products, hours, reviews
  IMAGE-PROMPTS.md      ← full Seedream 4.5 prompts for all 12 shots
  DESIGN-HANDOFF.md     ← this file

public/saudarkroksbakari/
  README.md             ← drop-zone instructions for images
  (12 .jpg files go here)

src/preview/companies.ts   ← route registration + company metadata
src/App.tsx                ← lazy route import
```

---

## Owner Contact

**Sindri** manages outreach. Owner email: `saudarkroksbakari@gmail.com`  
Outreach email template: see `src/preview/companies.ts` → `outreach` field + `memory/outreach-email-guide.md`.  
Send the owner their clean link: `https://sindrimar02.github.io/iceland-frumgerdir/preview/saudarkroksbakari/`  
(No `?tools` in the URL — that exposes the internal dashboard panel.)
