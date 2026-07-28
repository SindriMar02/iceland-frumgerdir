# BRIEF — THG Arkitektar `/preview/thg`

Standalone redesign prototype for **THG Arkitektar ehf** (kt. 440703-2590), a
32-year-old Reykjavík architecture practice, ~40 staff, ISO 9001:2015 certified.
Icelandic-first, no language toggle.

Design system transplanted from a source teardown of **era-residence.com** — the
mechanics only. Banned: arches/domes, the plum/sky/blush palette, Didone display
type, gold-on-black luxury styling.

**This page will be judged by architects.** Restraint beats decoration everywhere.

---

## 1. THE THESIS

They state it three times on their own site without ever noticing it is their thesis:

- **Hótel Borg** — "Gestamóttakan er hönnuð í Art Deko stíl **í samræmi við eldri móttöku**."
- **Reykjavík Konsúlat** — "The idea is to **blend new and historical constructions**."
- **Hótel Von** — "Miðað var við að hótelbyggingin mundi **falla að þeim byggingarstíl sem er í næsta nágrenni** og reynt að **fanga „staðarandann"**."

Codename: **`Staðarandi`**. Tagline: *Að fella nýtt að því sem fyrir er.*

The second, quieter idea — also nowhere on their site — is what the portfolio
actually contains: **hótel og hjúkrunarheimili.** Buildings for one night, and
buildings for the last years. Say it once, plainly, and do not sentimentalise it.

---

## 2. LOCKED FACTS — nothing beyond this list

**The practice**
| Fact | Source wording |
|---|---|
| Founded | "THG Arkitektar var stofnað af Halldóri Guðmundssyni arkitekt í október 1994" |
| Staff | ~40 named people on their About page → write "um fjörutíu manns" |
| Services | "Hönnun- og ráðgjafarþjónusta í mannvirkjagerð á sviðum arkitektúrs, skipulags- og umhverfishönnunar, auk verkumsjónar og eftirlits" |
| Quality system | "THG has certified quality management system ÍST EN ISO 9001:2015 since 2016" |
| Philosophy | "From the start, the company has aimed at fulfill the client's wishes and needs in a professional and practical manner" |
| Contact | Faxafen 9, 108 Reykjavík · (+354) 545 1600 · thg@thg.is · kt. 440703-2590 |

**The seven projects** — this is the complete verified set. Where a field says
*not published*, the page must **omit** it. Do not infer a year from a photograph.

| # | Project | Place | Year | Size / scale | Their own words |
|---|---|---|---|---|---|
| 1 | Hótel Borg | Reykjavík | *not published* | *not published* | "Gestamóttakan er hönnuð í Art Deko stíl í samræmi við eldri móttöku." First phase of the hotel's expansion; renovated ground-floor restaurant. |
| 2 | Icelandair Hótel Marina | Mýrargata 2–8, Reykjavík | 2012 | 111 herbergi | "Í húsinu eru 111 herbergi, líkamsræktaraðstaða ásamt bar og veitingaaðstöðu á jarðhæð." Client: Icelandair. |
| 3 | Reykjavík Konsúlat Hotel | Hafnarstræti 19, Reykjavík | 2015 | *not published* | "The idea is to blend new and historical constructions." Kolasundið passes through the ground floor, linking the old downtown to the former seashore. |
| 4 | Hótel Von (Von Guldsmeden) | Reykjavík | 2016–2019 | *not published* | "…falla að þeim byggingarstíl sem er í næsta nágrenni og reynt að fanga „staðarandann"." |
| 5 | EIR – Spöngin | Reykjavík | phases completed end-2009 / spring 2010 | 111 þjónustuíbúðir; ~20.000 m² total (6.000 m² þjónustu- og menningarhús + 14.000 m² íbúðir) | "Arkitektahönnun og verkefnastjórnun á 111 þjónustuíbúðum fyrir aldraða ásamt samtengdu þjónustu- og menningarhúsi við Spöng." |
| 6 | Hrafnista – Boðaþingi | Kópavogur | *not published* | *not published* | "Klasi íbúðarhúsa ásamt þjónustu fyrir aldraða við Boðaþing í Kópavogi." Client: Hrafnista. |
| 7 | Endurhæfingarmiðstöð SÁÁ, Vík | Kjalarnes | *not published* | +2.730 m² → 3.580 m² alls | "Stækkun á endurhæfingarmiðstöð SÁÁ. Húsið stækkar um samtals 2.730 m² og verður eftir stækkun samtals 3.580 m²." |

**CRITICAL — do not repeat their site's own error.** Their `/verkefni` index lists
"Hafnarstræti 19 – Hótel Curio" and "Reykjavík Konsúlat Hotel" as two projects.
**They are the same building** (Konsúlat is a Curio Collection hotel at Hafnarstræti 19).
The redesign shows it **once**. The `konsulat-*.jpg` assets are that building.

**CRITICAL — Vík is not a hotel.** It is SÁÁ's rehabilitation centre at Kjalarnes.
Treat it with the same sobriety as the care homes. No "retreat"/"getaway" framing.

**FORBIDDEN:** awards (none verified); client testimonials (none exist); staff
names beyond Halldór Guðmundsson; revenue or company financials; any project not
in the table; any year marked *not published*; the phrase "award-winning".

---

## 3. WHAT WE ARE FIXING (their live site)

1. Footer copyright frozen at **2018** on a firm that filed 2025 accounts.
2. Portfolio images served at **750px** from 2000px originals on their own CDN.
3. **Seven projects** shown for a 32-year, 40-person practice.
4. The same building listed twice under two names.
5. No viewport meta — the Squarespace theme is not properly responsive.
6. The thesis that unifies the work is invisible; each project reads as an orphan.
7. No indication the practice does both hospitality and care.

---

## 4. ART DIRECTION

Architectural, structural, sober. Concrete and graphite, with **all colour coming
from the projects' own photography**. This must not read as a sibling of any other
page in the portfolio — in particular it must not be warm, cream, or serif-led.

```
--concrete  #E8E6E1   pale concrete   (light bands)
--graphite  #1C1D1F   graphite        (dominant ground)
--ink       #16181A   near-black text on concrete (15.9:1 — AAA)
--muted     #5A5E62   secondary on concrete (5.4:1 — AA)
--brick     #A8412A   signal accent   (5.6:1 on concrete — AA)
--paper     #E8E6E1   text on graphite (14.8:1 — AAA)
```
Per-project themes for the horizontal journey, each derived from that building's
own photograph — Borg warm oxblood, Marina red/teal, Konsúlat slate/white, Von
pale grey, EIR orange/white, Hrafnista primary, SÁÁ Vík dune. **Compute and verify
every contrast pair you ship.**

**Type** — self-hosted, already in `public/fonts/`:
- Display: **Apfel Grotezk** (`/fonts/apfel/ApfelGrotezk-{Regular,Mittel,Fett}.woff2`)
- Body: **Switzer** (`/fonts/switzer/Switzer-{Regular,Medium,Semibold,Bold}.woff2`)

Both sans — deliberately the structural opposite of the serif-led sister build.
`font-display: swap`, relative `url()`. **Body text 17px minimum.**

Their gold monogram is at `public/thg/mark.jpg`. Use it small, once, in the chrome.
Do **not** build a gold-on-black luxury palette around it.

---

## 5. THE ERA MECHANICS

### 5.1 Fluid canvas
```css
html { font-size: 1vw }
:root { --ratio: 16 }
@media (min-width:768px) and (max-width:991px) { :root { --ratio: 8.34 } }  /* tablet — ERA lacks this */
@media (max-width: 767px) { :root { --ratio: 4.16 } }
--s-16: calc(16rem / var(--ratio));
```

### 5.2 Self-theming chrome
`.theme-concrete` / `.theme-graphite` / `.theme-project` redefine `--ink` /
`--ground` / `--accent`; components reference only semantic names. Fixed chrome
re-themes on **its own vertical centre** crossing a boundary, `0.4s` transition.
In the horizontal journey the chrome re-themes **per project** as it travels.

### 5.3 Six reveal primitives + duration ladder
`--dur-s:.4s`, `--dur-m:.8s`, `--dur-l:1.2s`; reveal `cubic-bezier(.25,1,.5,1)`,
hide `cubic-bezier(.5,0,.75,0)`; stagger `.1` / `.05` for heading chars.

---

## 6. STRUCTURE — 8 sections

Structurally opposite to the sister build: that one is a **vertical ledger**, this
one is a **horizontal journey**. No `SectionHead` component, no card grid, no
colossal centred sign-off.

1. **Aperture** — the ERA shutter: two `clip-path` polygons converge, merge and
   push through onto `borg-exterior.jpg`. Over it, one line: *Að fella nýtt að því
   sem fyrir er.* Then the practice line: 1994 · um fjörutíu manns · ISO 9001:2015.
   **Hero text must be readable with JS disabled** — animate toward the resting state.
2. **Staðarandi** — concrete band. The three quotations (Borg, Konsúlat, Von) set as
   evidence for the thesis, attributed to the project each came from. This is the
   intellectual spine and it should look like an argument, not a mission statement.
3. **SIGNATURE — Verkin.** Horizontal journey through the seven projects. Vertical
   scroll drives horizontal travel; section height = track `scrollWidth` for 1:1
   mapping; `ease: cubic-bezier(.25,0,.75,1)`, `scrub: .25`. Each panel carries its
   own theme and the chrome re-themes as it passes. Inner reveals use
   `containerAnimation`. Panel = one large photograph, project name in Apfel Grotezk,
   and only the fields that are published.
   **Mobile and reduced-motion: a snap rail, never a scroll-jack.** Same content,
   same order, horizontal swipe with `scroll-snap`.
4. **Innandyra** — the interiors payoff. Borg lobby/room/detail, Marina lounge/bar,
   Konsúlat room/bath. The quiet line: you have probably already been inside one of
   these. Say it once. Do not repeat it.
5. **Tvenns konar hús** — hotels and care, side by side: Marina's 111 herbergi
   against EIR's 111 þjónustuíbúðir. State the split plainly; let the reader draw
   the conclusion. **No sentimental copy.**
6. **Kolasundið** — one architectural idea told properly: the public passage
   threaded through Konsúlat's ground floor, linking the old downtown to the former
   seashore. Use `konsulat-street.jpg`. A drawn line tracing the route is welcome;
   label it a *skýringarmynd*, and do not draw a fake plan.
7. **Stofan** — compliance-as-monument: 1994, um fjörutíu manns, ÍST EN ISO
   9001:2015 frá 2016, and the services sentence verbatim. Typeset as a monument,
   not a stat-card row.
8. **Samband** — Faxafen 9, 545 1600, thg@thg.is. `mailto:`. No fake contact form
   backend, no fake project enquiry pipeline.

---

## 7. NON-NEGOTIABLE ENGINEERING

- **`prefers-reduced-motion`** everywhere: no horizontal scrub, no parallax, static
  shutter, all content visible. ERA has none of this and it is our biggest fix.
- **Reveals animate toward the resting state** + ~2s failsafe. A paused rAF, a
  crawler or a screenshot service must never see a hero with no text.
- The horizontal journey is the one place scroll drives layout — it must never
  *hold* the page. No pinned hero elsewhere.
- Never put a CSS `transition` on a property rewritten every scroll tick.
- `:focus-visible` on everything, visible on concrete *and* graphite.
- The horizontal track must be keyboard-reachable and screen-reader-linear: real
  focusable elements in DOM order, `aria-hidden` only on decoration.
- One `<h1>`, an `<h2>` per section, decorative SVG `aria-hidden`, 44px targets.
- No horizontal page overflow, no vertical text clipping, at 1440/1366/768/375.
- Icelandic accents need open leading (≥1.15 on display sizes).

## 8. CONTRACT

- Write **only** inside `src/preview/thg/`. Create `Page.tsx` + `data.ts`.
- Prefix every keyframe, custom property and class with `thg-`. No `@theme` edits.
- Render `<PreviewChrome company={…}>` once near the top, `<PreviewFooter company={…}>`
  last; company via `getPreviewCompany('thg')`.
- Images: `import.meta.env.BASE_URL + 'thg/<file>'`. Hero `fetchpriority="high"`.
  Available: `borg-exterior, borg-lobby, borg-room, borg-detail, marina-exterior,
  marina-lounge, marina-bar, konsulat-street, konsulat-room, konsulat-bath,
  saa-vik-1, saa-vik-2, eir-1, hrafnista-1, von-1, mark` (all `.jpg`).
- Do **not** run `npm run build`. Do not edit `App.tsx`, `companies.ts`, `package.json`.

---

# ERA-FIDELITY ADDENDUM (2026-07-28) — OVERRIDES THE BRIEF ABOVE WHERE THEY CONFLICT

The first build kept ERA's numbers and lost ERA's behavior. This addendum makes the page BE
the ERA system. Deliberately a DIFFERENT set-piece subset from the Heklusýn page: no
preloader here, no dome, no footer aperture.

**MANDATORY DEVICES — the lead verifies each in the DOM; "could not honour" is not accepted:**

1. **Shutter hero, full choreography** (teardown §3 §11): the two panels converge, MERGE into
   one covering plane, then push THROUGH revealing the photo — three beats, not a fade-out.
   Time-based, content beneath always in DOM.
2. **Horizontal journey, ERA-tuned** (teardown §5.6): section height = track scrollWidth for
   1:1 mapping; ease `cubic-bezier(.25,0,.75,1)` (horScroll), `scrub: .25`; tween stashed for
   `containerAnimation`; **differential title drift** — each panel's project name travels at a
   slightly different rate than its photo. Inside panels, char reveals ride containerAnimation.
   Mobile + reduced-motion stay the existing scroll-snap rail.
3. **Recede-to-dissolve** (teardown Phase 14): the journey exits by receding — scale toward
   ~2 with fade on the outgoing layer — into Innandyra. Not a hard cut.
4. **Growing-arc CTA** (teardown Phase 14): the Samband CTA draws an arc on hover/focus that
   deliberately STOPS at half. `@media (min-width:992px)` hover only; CSS custom-property
   state machine, zero JS hover.
5. **The six reveal primitives FOR REAL** (teardown §5.7): SplitText `words,chars` headings
   (keep `.thg-word` nowrap fix), masked lines, clip wipes. No whole-element IO fades as
   substitutes for h/p.
6. **Lenis** global + `lagSmoothing(0)` on desktop no-preference; native scroll otherwise.
7. **Per-project chrome theming sharpened**: chrome re-themes per panel DURING the journey,
   0.4s, driven by journey progress, each fixed element on its own trigger point.

**UNCHANGED:** the seven verified projects and every published/omitted field, Konsúlat once,
SÁÁ framing, palette, type, copy. All safety rules: fromTo toward resting + failsafe
(`opacity:1, clearProps:'transform,clipPath'` ONLY — never 'all'), full reduced-motion
coverage, zero-JS text visibility, no CSS transition on scrub-written properties, `thg-`
prefixes, AA contrast on every pair, no dashes in copy.
