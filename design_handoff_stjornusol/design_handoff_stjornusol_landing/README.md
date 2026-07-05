# Handoff: Stjörnusól landing page (v4, "Mjúka stjarnan")

## Overview
Single-page marketing site for **Stjörnusól**, a tanning salon (sólbaðsstofa) at Fjarðargata 17, 220 Hafnarfjörður, Iceland. One conversion goal: get visitors to book at **https://www.noona.is/stjornusol**. The only booking verb, everywhere, is **"Bóka tíma"**.

The design's signature: a dark "UV room" hero where fluorescent tubes and the headline itself strike to life with realistic flicker, then the page steps out into soft blush "morning light" for pricing (the morgunverð story), and returns to the dark room for the finale.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Astro, plain HTML/CSS, etc.) using its established patterns — or, if no environment exists yet, choose the most appropriate stack (this page is static content + light interactivity; a static site with a sprinkle of JS is ideal). Do not ship the prototype's runtime (`support.js`) — it is a preview harness only.

`Stjörnusól v4.dc.html` opens directly in a browser (keep `support.js`, `fonts/`, `assets/` siblings). The `<x-dc>` region contains the full markup with inline styles; the `<script data-dc-script>` block at the bottom holds all interactive logic as a readable class.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy, and motion are final design intent. Recreate pixel-perfectly. All Icelandic copy is verified fact — reproduce it **verbatim** (see Content Rules).

## Content Rules (non-negotiable)
- All prices, hours, bed names, and contact details are real, verified against solbadsstofa.is. Do not invent, round, or "improve" any number or claim.
- No em-dashes anywhere in copy. Icelandic orthography as given.
- "Bóka tíma" is the only booking CTA label. Booking always links to https://www.noona.is/stjornusol.
- K11 Air Loft has no listed price — it is described only as "bókanlegur á Noona".

## Screens / Views
One page, five chapters + fixed chrome + intro overlay. Max content width 1180px, side padding clamp(20px, 5vw, 64px). Section vertical padding clamp(90px, 12vw, 150px).

### 0. Intro loader (overlay, ~2.1s, once per load)
- Full-viewport sheet, gradient `#FBE3EC → #F8CFDD` (180deg), z-index 90, above everything.
- Center stack (gap 24px): the **ray glyph** (80px box) and the wordmark.
- Glyph: 8 rounded rays (`width .075em`, long rays `.3em` at 0/90/180/270°, short `.18em` at diagonals, inner gap `translateY(-.13em)`, color `#C4145C`) grow outward (`scaleY 0 → 1.18 → 1`, .5s, cubic-bezier(.32,.72,0,1)), staggered .18s → .6s clockwise from 12 o'clock; center dot (.12em, `#A8154F`) pops first (scale 0 → 1.5 → 1 at .05s).
- Wordmark "Stjörnusól": EB Garamond 500, 46px, `#C4145C`, letter-spacing .01em; each letter strikes in with the uvStrike flicker (per-letter delays .12s–.7s, see Motion).
- At ~74% of 2.1s the sheet slides up (`translateY(-101%)`, cubic-bezier(.7,0,.2,1)); after 2.4s it is removed (`display:none`).

### 1. `#ljosin` — Hero: the UV room (dark)
- Background `linear-gradient(180deg, #0B0212 0%, #12051C 58%, #1A0A28 100%)`, min-height 100svh, content centered.
- 12 vertical tube lights spread edge-to-edge (`justify-content:space-between`, padding 0 clamp(8px,3.4vw,56px)), each `clamp(2px,.4vw,5px)` wide, full height, gradient `#FFC2E1 → #FFF6FB 30–62% → #FFC2E1`, layered pink glows (see tokens), base opacity .55. Each strikes on load (uvStrike 1.9s, staggered delays .2–2.3s) then hums forever (uvHum 5.9–12.1s loops, staggered).
- Dark radial scrim `radial-gradient(130% 96% at 50% 86%, rgba(8,1,14,.92) → .55 → .06)` over tubes, plus film-grain SVG noise overlay at opacity .07 (tweakable).
- 3 twinkle stars (✦, `#FFD9EC`, 10–12px) at (13%,10%), (18%,87%), (9%,52%).
- Kicker: "✦ sólbaðsstofa í hafnarfirði", 13px/600, letter-spacing .26em, `#FF9EC6`.
- Sub-kicker: "Morgunverð alla daga fyrir kl. 14", clamp(17px,2.2vw,22px)/700, `#FFD9EC`.
- **h1** (the wow moment): "Frá 2.190 kr." — EB Garamond 500, `clamp(54px, 11.5vw, 152px)`, line-height 1, letter-spacing -.01em, `#FFF8F5`, text-shadow `0 0 60px rgba(255,124,178,.32)`, lining numerals (`font-feature-settings:'lnum' 1`, tabular). Every glyph is a span that strikes in individually (uvStrike 1.6s, delays .15–1.75s) and keeps humming (uvHum 7.9–11.2s). `aria-label="Morgunverð frá 2.190 kr. fyrir kl. 14"` on the h1; spans aria-hidden.
- Body: "Gildir frá kl. 10 til 14, dagverð tekur við eftir það. Stjörnusól er sólbaðsstofa á Fjarðargötu 17 í Hafnarfirði, opið alla daga frá 10 til 22." — clamp(16px,2vw,19px), `#E9D9E4`, max 54ch, centered.
- CTAs: primary pill "Bóka tíma" (#CA1D64 fill, white, 17px/700, padding 18px 38px, radius 999, shadow `0 14px 40px rgba(202,29,100,.4)`; hover lifts -3px + ctaBuzz flicker; active scale .97). Ghost pill "Sjá verðskrá ↓" (white text, 1px rgba(255,255,255,.24) border).
- Chip link: "✦ Nýjasti bekkurinn, K11 Air Loft, er kominn" → `#k11` (pill, rgba(202,29,100,.14) fill, rgba(255,158,198,.34) border, `#FFD9EC`).
- Content parallaxes down at `scrollY * 0.16` while hero is in view.
- **Optional hero film**: on load, HEAD-check `assets/k11.mp4`. If present, fetch → object URL → `<video muted loop playsinline>` behind everything, fade in 1.2s, tubes dim to opacity .2, play/pause via IntersectionObserver. Poster `assets/poster.jpg`. (Prompts for generating this film: `HIGGSFIELD-BRIEF.md`.)

### 2. `#k11` — K11 Air Loft (dark, `#0E0318`)
- Label "02 · nýjasti bekkurinn" (13px/600, .26em, `#FF9EC6`).
- h2 "K11 Air Loft" — EB Garamond 500, clamp(44px,7vw,92px), `#FFF8F5`.
- Body: "ALL LED bekkur með SunFinity ljósatækni og SunControl sérsniðinni brúnku. Loft Infinity speglar og kæling fyrir líkama og andlit."
- Stat pair (right column, 1px left border rgba(255,255,255,.12)): "+26% meira UVA í andliti og á hálssvæði", "+33% meira UVB í andliti og á hálssvæði" — numbers EB Garamond 500 clamp(44px,5.5vw,68px) with pink glow shadow.
- "þú velur áfangastað" list, 3 rows (radius 20, rgba(255,248,238,.04) fill, rgba(255,158,198,.13) border, hover lift -3px):
  1. "Sólarupprás á Capri 40,6°N" / "Fyrir þá sem fara reglulega í ljós." / chip "miðlungs sól" — 64px sun-disc gradient (sunrise) with a drifting glow-dot (sunCapri 7s).
  2. "Hámarkssólskin frá Hawaii 19,6°N" / "Fyrir þrælvana." / chip "mikil sól" — noon disc, sunHawaii 9s arc.
  3. "Sólsetur í Hamptons 40,9°N" / "Fyrir viðkvæmari húð og þá sem koma sjaldnar." / chip "viðkvæm sól" — sunset disc, sunHamptons 8s.
  Titles EB Garamond 500 clamp(19px,2.6vw,24px); latitude tags 13px `#C4A9BC`.
- CTA "Bóka tíma" + note "Bókanlegur á Noona."

### 3. `#verdskra` — Verðskrá (BLUSH — the page steps into morning light)
- Background `linear-gradient(180deg, #FBE3EC 0%, #F8CFDD 100%)`. Two crossfading radial tints at top: warm dawn `rgba(255,170,110,.3)` when Morgunverð selected, pink day `rgba(232,57,126,.2)` when Dagverð.
- Label "03 · verðskrá" (`#A8154F`). h2 "Sami tími,\ntvö verð." — EB Garamond 500, ink `#331021`.
- Side notes (right-aligned): "Morgunverð gildir alla daga frá kl. 10 til 14." / "Öryrkjar fá 10% afslátt." (`#6B4455`).
- **Toggle** (pill track rgba(196,20,92,.08) fill, rgba(196,20,92,.22) border, min-width 420px): two buttons "Morgunverð" / "Dagverð" with a white knob (#FFFDF8, rgba(196,20,92,.28) border, shadow `0 4px 14px rgba(122,26,74,.16)`) under the selected side. Selected label `#A8154F`, idle `#6B4455`; label text re-strikes (uvStrike .9s) on every flip. A 7px dot marks which rate is live right now by the clock (morgun = 10:00–13:59). Below: "Morgunverð gildir núna." / "Dagverð gildir núna." Default selection follows the clock (prop can force either).
- **Price rows** (6): group labels "stakir tímar" and "kort" (12px/600, .22em, `#A8154F`); rows separated by 1px rgba(51,16,33,.16). Left: name 700 ink + minutes muted; sub-line lists both rates + savings chip ("þú sparar 200/500/1.000/2.000 kr.", `#A8154F` 700, dims to 25% opacity when Dagverð). Right: the big price — EB Garamond 500, clamp(30px,5vw,46px), ink, lining tabular numerals — a **two-line roller** (overflow hidden, 1.15em tall; inner column translates -1.15em on flip, .55s cubic-bezier(.6,.1,.2,1), staggered .06s per row top-to-bottom):
  - Hálfur tími · 7 mínútur — 2.190 / 2.390 kr.
  - Stakur tími · 14 mínútur — 2.590 / 2.790 kr.
  - 1½ tími · 21 mínúta — 3.690 / 4.190 kr.
  - 5 tíma kort — 11.900 / 12.900 kr.
  - 10 tíma kort — 21.900 / 23.900 kr.
  - 15 tíma kort — 30.900 / 32.900 kr.
  (First figure = morgunverð, second = dagverð.)
- Footer row: "K11 Air Loft er bókanlegur á Noona. Bókun fer fram á Noona." + "Bóka tíma" CTA.

### 4. `#bekkirnir` — Bekkirnir (cream `#FFF8EE`)
- Label "04 · bekkirnir" (`#A8154F`); h2 "Fjórir bekkir, eitt ljós." EB Garamond 500 ink.
- 4 index rows (grid: number / name / meta / mini-tubes; 1px rgba(51,16,33,.16) separators; hover translateX(8px)):
  1. Megasun 5600 Ultra Power — "frá megaSun"
  2. Luxura X10 — "frá Luxura"
  3. Megasun 6800 — "frá megaSun"
  4. K11 Air Loft — chip link "sjá kaflann ↑" → `#k11` (`#A8154F`, rgba(196,20,92,.32) border)
  Names EB Garamond 500 clamp(24px,4.6vw,48px) ink; numbers 14px `#8A5B72` tabular; each row ends with 3 tiny humming tube bars (3×26px, gradient `#E86FA8 → #FFD3E7`).
- **Bed peek** (fine pointers only): hovering a row shows a 300px (max 34vw) 4:3 image card that follows the cursor (lerp .2, offset +24px, clamped to viewport), radius 18, border rgba(255,158,198,.28), shadow `0 30px 70px rgba(4,0,8,.6)`; images `assets/beds/*.jpg` crossfade .25s per row.

### 5. `#stofan` — Stofan + finale + footer (dark gradient `#0B0212 → #12051C 70% → #1A0A28`)
- Giant slow-spinning ✦ watermark (40vw, rgba(202,29,100,.07), 90s rotation) top-right.
- Label "05 · stofan"; h2 "Sjáumst í ljósinu." EB Garamond 500, clamp(46px,8vw,100px), `#FFF8F5`.
- Three info columns (labels 12px/600 .2em `#FF9EC6`; values 19px/700 `#FFF8F5`):
  - heimilisfang: "Fjarðargata 17 / 220 Hafnarfjörður" + "Opna í kortum ↗" (Google Maps search link)
  - opnunartími: "Alla daga / 10:00 til 22:00" + "Morgunverð til kl. 14"
  - samband: tel 555 7272 (`tel:+3545557272`), hafnarfjordur@stjornusol.is, Facebook ↗ facebook.com/stjornusol, Instagram ↗ instagram.com/stjornusol
- Finale: centered "Bóka tíma" mega-pill (clamp(18px,2.4vw,22px)/800, padding 22px 52px, shadow `0 18px 60px rgba(202,29,100,.45)`) + "Bókun fer fram á Noona". The sticky mobile bar hides while this is on screen.
- Footer (1px top border rgba(255,255,255,.1)): glyph (17px, on-dark colors) + "Stjörnusól" EB Garamond 18px, and "© 2026 Stjörnusól · Fjarðargata 17, 220 Hafnarfjörður · 555 7272".

### Fixed chrome
- **Header**: fixed, transparent at top; after 20px scroll gains `rgba(11,2,18,.72)` + blur(18px) + hairline border, .45s ease. Left: glyph (22px, on-dark SVG with pink drop-shadow) + "Stjörnusól" EB Garamond 500 22px `#FFF8F5`. Right: "Bóka tíma" pill (#CA1D64).
- **Chapter rail** (left, ≥1220px only): 01 ljósin / 02 k11 air loft / 03 verðskrá / 04 bekkirnir / 05 stofan — 11px/700, .14em. Active section tracked by IntersectionObserver. Colors theme by ground: on dark sections idle `#9A7E90`, active `#FF9EC6`; on light chapters (03, 04) idle `#7A4A62`, active `#A8154F`.
- **Progress tube** (right edge): 3px track rgba(255,158,198,.12); fill gradient `#FFF6FB → #FF7CB2 40% → #CA1D64` with glow, scaleY = scroll progress (rAF), hums.
- **Cursor glow**: 520px radial rgba(255,124,178,.15) blob, mix-blend screen, lerps to cursor (.18), fine pointers only.
- **Sticky mobile bar** (bottom, ≤400px wide pill): phone icon button (tel:) + full-width "Bóka tíma"; dark glass rgba(14,4,24,.82) + blur; slides away at finale.
- **Skip link** "Beint í efnið" → `#efni` (visible on focus).

## Interactions & Behavior
- Smooth scrolling (`scroll-behavior:smooth`, disabled under reduced motion); `scroll-padding-top:96px`.
- Anchor navigation only; no routing.
- Price slot state: `'morgun' | 'dag'`; initialized from clock (10–14 → morgun) unless overridden; flipping animates knob, labels (uvStrike), all 6 rollers (staggered), savings chips, and the dawn/day tint crossfade.
- Active-section state drives rail colors (thresholds .25/.5).
- Video: only loads if `assets/k11.mp4` exists (HEAD probe); never autoplays under reduced motion; pauses off-screen.
- All hover physics: transforms + shadows only (compositor-cheap). CTA hover plays ctaBuzz brightness flicker once.
- **prefers-reduced-motion: reduce** → every tube/twinkle/reveal/flicker renders steady-on (final state), no parallax, no cursor glow, no bed peek, no video autoplay, progress bar still updates (via scroll handler, no rAF loop).

## State Management
Component state: `slot` (morgun/dag), `nowSlot`, `scrolled` (>20px), `activeSec`, `barHidden` (finale visible), `introDone` (2.4s timer), `videoOn`, `peek` (0–4). Listeners: scroll (passive), pointermove (fine only), 3 IntersectionObservers (video, finale, sections), one rAF loop (progress, parallax, glow/peek lerp) — all cleaned up on unmount.

## Design Tokens
Colors — dark world: bg `#0B0212` / `#12051C` / `#0E0318` / `#1A0A28`; text `#FFF8F5`; body `#E9D9E4`; muted `#C4A9BC` / `#9A7E90`; accents `#FF9EC6`, `#FFD9EC`, `#FF7CB2`, `#FFC2E1`.
Colors — light world: blush `#FBE3EC → #F8CFDD`; cream `#FFF8EE`; ink `#331021`; muted `#6B4455`; soft `#8A5B72` / `#7A4A62`; accent small-text `#A8154F`; deep accent `#C4145C`; vivid brand pink `#E8397E` (blush grounds only).
Shared: CTA fill `#CA1D64` (white text, 5.9:1); selection bg `#CA1D64`; focus ring `#FF6BB0` 3px offset 3.
Tube glow recipe: `box-shadow: 0 0 12px 2px rgba(255,140,196,.6), 0 0 40px 12px rgba(233,72,142,.3), 0 0 90px 30px rgba(202,29,100,.12)`.
Typography: **EB Garamond** 500 (600 available) for h1/h2, prices, bed/destination names, wordmark — always `font-feature-settings:'lnum' 1` + `font-variant-numeric:tabular-nums` for numerals; **Hanken Grotesk** variable (400–900, file included) for body, labels, buttons, UI. Labels: 13px/600, letter-spacing .26em, lowercase. Type scale: h1 clamp(54px,11.5vw,152px); h2 clamp(44px,7vw,92px) (stofan clamp(46px,8vw,100px)); row names clamp(24px,4.6vw,48px); prices clamp(30px,5vw,46px); body 16–19px; small 13–14px.
Radii: pills/buttons 999px; cards 20px; peek card 18px; skip link 12px.
Easing: house `cubic-bezier(.32,.72,0,1)`; price roll `cubic-bezier(.6,.1,.2,1)`; intro sheet `cubic-bezier(.7,0,.2,1)`.
Keyframes (steps(1,end) for all flicker):
- `uvStrike`: 0% .04 → 9% .55 → 12% .08 → 21% .85 → 26% .12 → 33% .06 → 41% 1 → 52% .3 → 58% 1 → 74% .55 → 79–100% 1
- `uvHum`: 1 until 90.6% → 91% .78 → 91.5% 1 → 94.8% .92 → 95.1% 1 → 97.6% .85 → 97.9% 1 (loop durations 5.9–12.1s, staggered delays)
- `twinkle`, `revealUp` (opacity 0 / y+30 → in; scroll-driven via `animation-timeline:view()` entry 0–40/45% — polyfill or IO-based reveal in production), `ctaBuzz`, `rayGrow`, `dotPop`, `sunCapri/Hawaii/Hamptons`, `spinSlow`, `introShow`.
Spacing: section padding clamp(90px,12vw,150px); content max 1180px; row padding 18px 4px (prices), clamp(20px,3.4vw,30px) 4px (beds).

## SEO / Semantics
- One h1 (the price claim, with the full-sentence aria-label); h2 per section; real `<button>`/`<a>`; focus-visible rings follow element radius.
- Title: "Stjörnusól, sólbaðsstofa í Hafnarfirði. Bóka tíma á Noona". Meta description in the file.
- JSON-LD `TanningSalon` (address, phone, email, hours 10:00–22:00 daily, priceRange, sameAs, ReserveAction → Noona) — copy verbatim from the prototype `<head>`.

## Accessibility notes
- WCAG AA verified pairs: white on #CA1D64 (5.9:1); #A8154F on blush (≥5.5:1); #331021 on blush (≥12:1); #6B4455 on blush (≥5:1); #FFF8F5/#E9D9E4 on dark (≥14:1). Keep these pairings when refactoring.
- All decorative elements (tubes, twinkles, glyphs, sun discs, peek images) are `aria-hidden` with empty alt.
- Hit targets ≥44px on mobile; sticky bar respects `env(safe-area-inset-bottom)`.

## Assets
- `assets/beds/*.jpg` — AI-generated bed visuals (hover peek). Replace with real photography when available.
- `assets/poster.jpg` — designed poster frame for the hero film (dark room, pink light seam).
- `assets/brand/glyph-on-dark.svg / glyph-on-cream.svg / glyph-on-blush.svg` — the ray-glyph mark in the three ground-specific colorways. Wordmark is live text (EB Garamond 500), never an image.
- `fonts/HankenGrotesk-Variable.ttf` — self-hosted. EB Garamond loads from Google Fonts (`wght 500;600`) — self-host both in production.
- `HIGGSFIELD-BRIEF.md` — prompts/settings for generating the optional `assets/k11.mp4` hero film (K11 bed powering on in a dark room; drop the file at `assets/k11.mp4` and the page auto-uses it).
- `assets/x10.mp4` exists in the design project but is NOT used in v4 (previous concept).

## Files
- `Stjörnusól v4.dc.html` — the full design (markup + logic). Open in a browser next to `support.js`, `fonts/`, `assets/`.
- `support.js` — prototype preview runtime only; do not ship.
