# Fjárfesting fasteignasala — DESIGN.md (home page, 2026-09-22)

**Method:** behaviour-for-behaviour transplant of wild-ag.ch. The authority is the measured
reference in `_reference/wildag-teardown/{SYSTEM,MOTION}.md`; generic skill defaults lose
where they conflict. Our own code, Fjárfesting's own content, photos and brand. Harvest:
`03-prototypes/_harvest/fjarfesting/MANIFEST.md`.

**Design read:** estate-agency home page for Icelanders buying or selling a home, in a quiet,
typographic, stacked-sheet language (Wild), recoloured in Fjárfesting's own maroon.
Dials: variance 5 (reference is centred and symmetric), motion 6, density 4.

**The one idea (Gate 2):** Wild's brown→beige gradient becomes **Fjárfesting's own maroon
house-mark colour**. Every sheet, serif heading, card foot and CTA is the colour of their
logo, and the loader draws that logo. Traceable to `logo.png` (#974042).

## Tokens

| Token | Value | Role (Wild equivalent) |
|---|---|---|
| `--paper` | #F7F6F3 | page ground (white #faf9f4), near-neutral, not cream |
| `--band` | #EFEDEA | team / projects / form band (light #f5f1ed) |
| `--ink` | #2B2123 | H4, button text, hover fills (black #2b221c) |
| `--mute` | #5F6064 | body text: their brand grey #6D6E71 darkened to pass AA on `--band` |
| `--m1` → `--m2` | #8C3A3D → #A85A52 at 15deg | THE gradient (brown→beige). White on it ≥ 4.7:1 |
| `--rose` | #E4D6D0 | image placeholder (beige) |
| `--hair` | rgba(151,64,66,.25) | hairlines, field borders (brown-opacity) |

Type: **Hanken Grotesk** 300/400/500/600/700 (for Inter) + **Recia Italic / Light Italic** (for
Inria Serif Italic). Both Icelandic-verified. Scale = Wild's em values on a vw root:
`--ms` 1.17vw ≥1280 · 1.51vw 992–1279 · 1.95vw 768–991 · 3.13vw 480–767 · 4.6875vw ≤479.
H1 3.33em (2.4em ≤479) · H2 serif 3.06em (2.2em) · H3 1.8em (1.6em) · H4 1.33em (1.2em) ·
body 1em (0.93em) · label 0.8em (0.73em) · display 7.06em (5.06em). Gutter 8.33em ≥1280,
1.66em below, 1em ≤479. Sheet radius 4.33em (3.66 / 3em). Element radius 1em. Pills 9999px.
Easings: out `cubic-bezier(.25,1,.5,1)`, hover `cubic-bezier(.25,.46,.45,.94)` 0.3s.

## Section map (Wild → Fjárfesting)

| Wild | Fjárfesting | Content source |
|---|---|---|
| Loader (Lottie logo, card shrinks 5.9s) | Their house mark stroke-draws, wordmark appears, card shrinks | logo.png traced |
| Hero video + SplitText H1 on gradient | Their listing interior (eign 919125) with the 24s picture loop Wild uses on its project pages; H1 from their facts | gjaldskrá, söluskrá |
| Portrait. / Werte. | **Stofan.** / **Gjaldskráin.** (4 real tariff lines as the value list) | /gjaldska, /starfsmenn |
| Team rail (4) | **Starfsfólk.** rail (10 real agents) | /starfsmenn |
| Slogan parallax + ticker | Naustavör photo parallax + "Fjárfesting fasteignasala, sími 562 4250" | header |
| Kompetenzen + 5 popups | **Þjónusta.** + 5 popups from the tariff | /gjaldska |
| Projekte rail (2) | **Í sölu.** rail: 5 live developments with real counts and price ranges | söluskrá |
| Partner logo ticker | **Opin hús.** ticker of the real open houses (23–25 Sept) | home page |
| Prozesse + 3 popups | **Söluferlið.** 3 steps, each tied to a tariff line | /gjaldska |
| Full-screen video (plays at 55%) | Full-screen Naustavör dusk render, settles once at 55% | /new_buildings |
| Kontakt form + details | **Hafa samband.** (form is inert in the prototype and says so) | footer |
| Footer | kt., vsknr., Félag fasteignasala mark, SNDR credit | footer |

## Declared deviations from the reference

1. **Phone chrome:** constant fixed bar + awning (mobile-chrome-standard, HARD). Desktop keeps
   Wild's sticky header with the 2s idle hide.
2. **Reveals are position-tied** (scroll-reveals-must-be-position-tied, HARD): Wild's once-only
   0.6s mask rises and fades become scrubs over a short band with the same start (`top 85%`)
   and the same transforms. The hero SplitText and the menu keep Wild's timing.
3. **Hero picture instead of video:** there is no footage. The picture-loop amplitude is 1→1.06
   rather than 1→1.2, because the source is ~1600px.
4. **No dark mode.** The reference is light-only.
5. Two tickers kept (slogan + open houses) because the reference has two; the open-house one
   pauses on hover/focus and becomes a native swipe rail on touch.
6. Section headings keep Wild's trailing full stop ("Stofan.").
7. **Lenis on desktop** (Sindri, 22.09), `lerp .1`, skipped on `(hover:none) and (pointer:coarse)`
   and reduced motion (lenis-mobile-damage); `?nolenis` escape; overlays carry `data-lenis-prevent`.
8. **Component round 2 (Sindri: "generic AI-looking pills and sections").** Wild's own component
   kit sits in our banned vocabulary, so the behaviour stays and the components are re-cut from
   the agency's material and our stacked-sheet system:
   - pills → squared `.4em` blocks with an ink wipe; the header CTA is the phone number itself;
   - the value list → a **rate card** of their tariff figures (Frítt, 1,75%, 2,50%, 5%) at display size;
   - service pills → an **index**: serif name, the tariff figure, a plus that turns on hover;
   - gradient-foot cards → studio **portraits** with serif names; **prospectus** project cards with
     the live unit count as the numeral;
   - partner tiles → the **Opið hús A-frame sign** (maroon strip, day numeral, time, address, photo);
   - process pills → three **stations on a drawn line**, each priced from the tariff;
   - footer → a maroon sheet rising with the name set at full content width (Fagravík's closing idea).

## Banned here

Em/en dashes in copy · invented claims (no founding year: "2003" is Óskar's tenure) ·
reviews or social proof · stock or generated imagery · Wild's copy, photos, logo, fonts, Lottie.
