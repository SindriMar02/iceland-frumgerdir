# Sauðárkróksbakarí — Stitch Design Handoff

## What this is

A single-page website for **Sauðárkróksbakarí**, a historic Icelandic bakery founded in 1880. The target is an Awwwards-quality, editorially distinctive page — not a template. This document is a content + constraint handoff. **You are free to invent the entire visual language, layout, motion system, and interaction design from scratch.** Do not take cues from any existing implementation.

---

## The business

- **Name:** Sauðárkróksbakarí
- **Founded:** 1880 — one of the oldest bakeries in Iceland
- **Location:** Aðalgata 5, 550 Sauðárkrókur, Skagafjörður, North Iceland
- **Phone:** +354 455 5000 (displayed as "455 5000")
- **Email:** saudarkroksbakari@gmail.com
- **Seating:** ~40 seats indoors and outdoors
- **Tripadvisor rating:** 4.7 stars, Travelers' Choice winner
- **Signature product:** Snúður (Icelandic cinnamon bun) — chocolate-glazed, caramel-glazed, or sugar-glazed
- **Story:** The building burned in 1979 and was rebuilt. The oven has been lit every morning since 1880, on the same corner.

---

## Palette & brand tokens (must use exactly)

| Token | Hex | Role |
|---|---|---|
| CREAM | `#f6efe2` | Page ground / light sections |
| PAPER2 | `#efe4d0` | Alternating toned paper band |
| INK | `#2a1c12` | Body text / primary dark |
| ESPRESSO | `#3a2417` | Dark section background |
| CRUST_TEXT | `#8a4f1e` | Warm brown, readable AA on cream |
| AMBER | `#e0892e` | Brand accent — buttons, highlights, display fills |
| AMBER_DEEP | `#9c5413` | Amber for small body text on cream (AA contrast) |
| BUTTER | `#e8b95e` | Soft warm highlight / decorative gold |

These are the only colors. You may use opacity variants (e.g. `#2a1c1240` for subtle separators) but no new hue additions.

---

## Typography (already installed in the project)

- **Display / headings:** `font-young` (Young Serif — warm editorial serif)
- **Body text:** `font-hanken` (Hanken Grotesk — clean modern sans)
- **Mono / labels / eyebrows:** `font-mono` (system mono — stamps, codes, tiny labels, tracking-heavy uppercase)

---

## Images: NO IMAGES — design the shell only

All image slots should be **empty placeholder boxes** with the correct aspect ratio and a solid color fill. The images will be dropped in later. Use the gradient fallback colors below for each placeholder:

| Slot | Aspect | Fill color |
|---|---|---|
| Hero (storefront) | 16:9 | `#3a2417` → `#7a3d16` → `#2a1c12` (gradient) |
| counter-snudur | 4:5 | `#e8b95e` → `#c98a3c` → `#7a3d16` |
| counter-braud | 4:5 | same as above |
| counter-vinarbraud | 4:5 | same |
| counter-smakokur | 4:5 | same |
| counter-kokur | 4:5 | same |
| counter-supa | 4:5 | same |
| counter-kaffi | 4:5 | same |
| interior-counter | 3:2 | `#efe4d0` → `#7a3d16` |
| process-hands | 3:2 | `#e8b95e` → `#7a3d16` |
| kransakaka (cake) | 3:4 | `#f6efe2` → `#c98a3c` |
| interior-room | 3:2 | `#efe4d0` → `#7a3d16` |

---

## Content inventory — ALL text is Icelandic unless noted

### Navigation (sticky header)
- Logo / brand name: **Sauðárkróksbakarí**
- Tagline chip: `SÍÐAN 1880`
- Nav links: `Úr ofninum` (→ #bordid), `Sagan` (→ #sagan), CTA button: `Finna okkur` (→ #finna)

### Hero section
- Eyebrow: `Sauðárkrókur · Skagafjörður`
- Sub-eyebrow mono: `Ofninn er kveiktur fyrir allar aldir`
- H1: `Bakað á Sauðárkróki` / `síðan 1880`
- Body: `Eitt elsta bakarí landsins, í hjarta gamla bæjarins. Brauð, snúðar og kaffi, nýtt úr ofninum á hverjum morgni. Vefurinn rann úr gildi, en bakaríið stendur enn.`
- CTA 1: `Sjá úr ofninum` (→ #bordid) — amber fill
- CTA 2: `Hringja · 455 5000` (tel: link) — ghost/outline
- Rotating ticker (4 phrases, cycles every ~2.8s):
  - `Ofninn er kveiktur`
  - `Snúðar beint úr ofninum`
  - `Súpa dagsins í hádeginu`
  - `Kaffi á könnunni`

### Intro strip
- Eyebrow: `Eitt elsta bakarí landsins`
- H2: `Sama horn, sami ofn, ilmurinn tekur á móti þér í dyrunum`
- Live chip: `Bakað á morgnana` (animated pulse dot)

### Signature section — "Gengið með borðinu" (id: `#bordid`)
**KEY INTERACTION:** On desktop, vertical scroll drives a horizontal product glide. On mobile, swipe carousel.

- Section eyebrow: `Heitt úr ofninum`
- H2: `Gengið með borðinu`
- Intro text: `Strjúktu þér eftir borðinu. Allt hnoðað og bakað á staðnum, eftir gömlum uppskriftum.`

**7 product cards** (left to right):
1. **Snúður** / Cinnamon bun — `Það sem bakaríið er þekktast fyrir. Mjúkur snúður með súkkulaði-, karamellu- eða sykurglassúr.` · `frá 420 kr` · oven: `07:10` · steams: yes
2. **Brauð** / Breads — `Súrdeig, rúgbrauð og fjallabrauð, hnoðuð og bökuð á staðnum frá fyrstu birtu.` · `frá 690 kr` · oven: `06:40` · steams: yes
3. **Vínarbrauð** / Pastries — `Smjördeig sem flagnar í lögum, vínarbrauð og kruðerí beint úr ofninum.` · `frá 390 kr` · oven: `07:30` · steams: no
4. **Smákökur** / Cookies — `Bakaðar eftir gömlum uppskriftum: hálfmánar, lakkrístoppar og fleira með kaffinu.` · `frá 290 kr` · oven: `08:00` · steams: no
5. **Kökur og tertur** / Cakes — `Randalín, marengs og rjómatertur. Stærri tertur bakaðar eftir pöntun fyrir tilefnin.` · `frá 750 kr` · oven: `08:30` · steams: no
6. **Súpa dagsins** / Soup of the day — `Heit súpa með nýbökuðu brauði, soðin ný á hverjum degi fyrir hádegið.` · `1.690 kr` · oven: `11:30` · steams: yes
7. **Kaffi** / Coffee — `Vel lagað kaffi og með því, til að setjast niður með í hlýjunni við borðið.` · `frá 490 kr` · oven: `allan daginn` · steams: yes

Each card shows: product photo placeholder, oven time stamp, steam ornament (if steams=yes), name, English gloss, blurb, price badge.

End of carousel: CTA `Komdu við og veldu sjálf.` with `Finna okkur` button.

- Bottom note: `Verð og tímar eru sýnishorn · skrunaðu til að ganga með borðinu`

### Heritage section — "Sagan" (id: `#sagan`)
- Eyebrow: `Sagan · síðan 1880`
- Display: large `1880` numeral + `bakað í / 146 ár`
- H2: `Sama horn, sami ofn, sama handverk`
- Body paragraphs:
  - `Sauðárkróksbakarí hefur staðið við Aðalgötu frá árinu 1880 og er eitt elsta bakarí landsins. Hér er bakað á staðnum, í höndunum, með hráefni úr héraði þar sem það er hægt.`
  - `Húsið brann árið 1979 en var endurreist, og ofninn er enn kveiktur fyrir allar aldir. Gestir geta sest niður með kaffi og nýbakað, því hér eru fjörutíu sæti inni og úti.`
- Timeline (4 entries):
  1. `1880` — `Ofninn er kveiktur við Aðalgötu. Eitt elsta bakarí landsins verður til.`
  2. `1938` — `Núverandi bakaríshús rís á horninu, hannað fyrir bæði búð og bakstur.`
  3. `1979` — `Eldur kemur upp í húsinu. Það er endurreist og ofninn kveiktur á ný.`
  4. `Í dag` — `Enn bakað á sama stað á hverjum morgni, með Travelers' Choice á Tripadvisor.`
- Stats grid (2×2):
  - `1880` / `Bakað frá`
  - `146 ár` / `Á sama horni`
  - `40` / `Sæti inni og úti`
  - `4,7` / `Stjörnur á Tripadvisor`
- Photo pair: interior-counter placeholder (large, 4:5) + process-hands placeholder (small, offset, 4:3) + circle badge `Bakað frá / 1880`

### Cakes section — "Tilefnin"
- Eyebrow: `Tilefnin · við sjáum um veisluna`
- H2: `Tertur bakaðar eftir pöntun`
- Body: `Kransakaka, súkkulaðiterta, marengs og rjómatertur fyrir fermingar, brúðkaup, afmæli og útskriftir. Segðu okkur tilefnið og við bökum það.`
- Tag chips: `Kransakaka`, `Brúðkaup`, `Fermingar`, `Afmæli`, `Útskriftir`
- CTA: `Panta tertu · 455 5000` (tel: link)
- kransakaka photo placeholder alongside

### Reviews section
- Eyebrow: `Hvað fólk segir`
- H2: `4,7 stjörnur og Travelers' Choice`
- Body: `Á Tripadvisor hefur bakaríið 4,7 stjörnur og hlaut Travelers' Choice viðurkenninguna. Umsagnirnar hér að neðan eru sýnishorn.`
- Rating badge: `4.7` stars (4 full, 1 half) + `Tripadvisor · raunveruleg viðurkenning`
- 3 review cards:
  1. Quote: `Snúðarnir eru ennþá volgir og glassúrinn bráðnar. Við stoppum alltaf þegar við keyrum norður.` / Author: `Gestur úr Skagafirði` / `Sýnishorn af umsögn`
  2. Quote: `Hlýlegt og bjart, ilmurinn tekur á móti þér í dyrunum. Besta rúgbrauð sem ég hef smakkað.` / Author: `Ferðalangur á leið norður` / `Sýnishorn af umsögn`
  3. Quote: `Gamalt bakarí með sál. Súpa dagsins og nýbakað brauð gerðu daginn okkar í Skagafirði.` / Author: `Gestur á sumardegi` / `Sýnishorn af umsögn`

### Find us section (id: `#finna`) — dark background (ESPRESSO)
- Eyebrow: `Finndu okkur`
- H2: `Aðalgata 5, í hjarta bæjarins`
- Body: `Gamli bærinn á Sauðárkróki, steinsnar frá höfninni. Hringdu á undan eða líttu bara við. Ofninn er heitur frá morgni.`
- Address card:
  - `Aðalgata 5`, `550 Sauðárkrókur`, `Skagafjörður`
  - Link: `Opna í kortum` → Google Maps name search (NOT coordinates)
  - URL template: `https://www.google.com/maps/search/?api=1&query=Sauðárkróksbakarí%2C%20Aðalgata%205%2C%20Sauðárkrókur`
- Hours card (sample — labeled as sýnishorn):
  - Mán–fös: 7:30–17:30
  - Laugardag: 8:00–16:00
  - Sunnudag: 9:00–16:00
  - Live "Opið núna / Lokað núna" badge (calculate from browser time)
- Phone CTA tile: `Hringja` / `455 5000` → `tel:+3544555000`
- Email tile: `Netfang` / `saudarkroksbakari@gmail.com`
- Decorative map: SVG-drawn abstract map of the old town — fjord on left, grid streets on right, amber pin marker at "Aðalgata 5". **No real GPS coordinates anywhere in the SVG or in any link** — use name/address search only.

### Mobile sticky CTA bar
- Appears after scrolling past the hero
- Fixed bottom: `Hringja` button + `Finna okkur` button

---

## Hard constraints (do not violate)

1. **No GPS coordinates anywhere.** No lat/lng in any href, data attribute, SVG `<text>`, or inline string. All map links use the name+address search URL pattern shown above.
2. **WCAG AA contrast.** All text must pass 4.5:1 on its background. The palette above is designed for this — do not add low-contrast combos.
3. **No horizontal page overflow on mobile.** The horizontal counter scroll must be inside a clipping container; the page itself must never overflow horizontally.
4. **Honesty label:** include a small note "Verð og tímar eru sýnishorn" (sample prices & times) near the product cards, and "Sýnishorn" near the hours list.
5. **Heading hierarchy:** one `<h1>` (hero), then `<h2>` per section. No h2 before h1. No skipped levels.
6. **Min touch target 44×44px** on all interactive elements.
7. **prefers-reduced-motion:** all animations and transitions must be disabled or simplified when the OS setting is on.
8. **`tel:+3544555000`** must be the href for all phone links.
9. The section id anchors must be preserved: `#bordid` (counter), `#sagan` (heritage), `#finna` (find us).

---

## What makes this site memorable (design brief)

This is NOT a template job. The bakery has been in the same corner since 1880. The emotional core is **continuity, warmth, craft, and the smell of bread before the town wakes up.** The design should make you feel that — not just communicate it as text.

- **The signature moment** is the product counter: scrolling vertically should feel like physically walking along the display case (horizontal reveal).
- **Typography as texture** — the `1880` year, the Icelandic words like "Snúður" and "Gengið með borðinu" should feel architectural, not decorative.
- **Motion that earns its place** — steam, ambient glow, a ticker, parallax. Every animation should be purposeful. Nothing purely decorative.
- **Contrast between warmth and craft** — cream and espresso feel like the counter itself. Amber is the ember in the oven.
- The page should feel like it was made by one person who loves this bakery, not assembled from components.

---

## Stack (if building in React/Tailwind)

- React 18 + TypeScript
- Tailwind CSS v4
- Framer Motion available
- Fonts already loaded: `font-young` (Young Serif), `font-hanken` (Hanken Grotesk), `font-mono` (system)
- Images loaded via `<img>` with a fallback `div` for missing files (use the gradient fills above as fallbacks)
- Scroll-driven effects: use synchronous passive `window.scroll` listener writing `style.transform` directly (NOT Framer `useScroll` — it is unreliable in the preview tool)
- IntersectionObserver for below-fold reveals (NOT Framer `whileInView`)
- Pinned horizontal: `position: sticky` on the inner wrapper inside a `height: 320vh` outer section
- matchMedia `(min-width: 768px) and (pointer: fine)` to gate the pinned counter — touch/small screens get `overflow-x-auto snap-x snap-mandatory`
