# KONONENKO REBUILD — Heklusýn `/preview/heklusyn`

**This brief SUPERSEDES BRIEF.md entirely.** The ERA direction is retired: Sindri rejected
the shipped pages ("scratch whatever design template you had in mind") and supplied
**kononenkogroup.com** as the reference to transplant "completely, in every way". The full
teardown is at `/Users/sindri/Documents/Website redesign mockups/kononenko-teardown.md` —
read it first, it is short and authoritative.

You are REPLACING `Page.tsx` wholesale. What you must KEEP from the current page: the
locked facts, the Icelandic copy blocks (reuse their text where sections map), the
Tölvumynd honesty rule, the ledger data in `data.ts` (109.000.000 kr price, Selt states),
the eight mountains, contact details. Everything visual and motion is replaced.

## THE SYSTEM (from the teardown — implement, don't approximate)

### 1. One WebGL canvas for every image
A single fixed, full-viewport `<canvas>` (THREE.js — already a repo dependency) renders
EVERY image on the page as a plane. The DOM keeps real `<img>` elements (SSR, SEO, a11y,
fallback) with `visibility` hidden only when WebGL is confirmed running; the canvas
positions each plane from `getBoundingClientRect()` of its DOM twin every frame, reading
scroll from Lenis. No per-image canvases. Use an orthographic camera mapped 1:1 to CSS
pixels, `alpha: true`, cleared transparent over the page ground.

### 2. The two shaders — their exact source, adapt minimally
Verbatim GLSL extracted from the reference is at:
- `/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/527480ad-140f-4891-87dc-062d8c864314/scratchpad/kononenko/media.frag.glsl`
  (cover-fit, in-plane scroll parallax via uParallax/uStrength, shader borders, edge feather)
- `.../kononenko/sketch.frag.glsl`
  (ink-sketch develop: luminance-ordered, blue-noise modulated, bottom-up sweep via
  uProgress; hover lens circle via uMouse/uHover/uExpandRadius with settle gating)
Adapt uniform plumbing to THREE (`ShaderMaterial`), keep the math identical. The noise
texture is at `public/heklusyn/noise.png` (256², RGB, wrap: repeat).
- `uStrength` (in-plane parallax amount): ~0.12. Drive `uParallax.y` from each plane's
  viewport position: 0 when the element enters at bottom, 1 when it leaves at top.
- Sketch `uProgress`: drive from element visibility (0→1 across its first 80% viewport
  travel). `uHover`/`uMouse` from pointer events on the DOM twin (desktop only).

### 3. Which images get which shader — THE HONESTY DEVICE
- REAL photographs (`hero-estate`, `house-built`, `land-river`, `house-autumn`,
  `winter-dusk`, `construction`): **media shader** — they are photographs and behave as
  photographs (parallax inside their frame, hairline shader border on grid items).
- TÖLVUMYND renders (`vis-living`, `vis-kitchen`, `vis-plan`, `vis-exterior`): **sketch
  shader** — they render as ink drawings that develop on scroll, and the hover lens
  reveals the render inside the drawing. Keep a small visible `Tölvumynd` text label too
  (the shader is the metaphor, the label is the disclosure — both).
- The HERO is a video (see §6) with the media shader NOT applied (plain `<video>`).

### 4. Ground, type, chrome (Kononenko verbatim, our content)
- Paper white `#fff` ground everywhere. Text near-black `#111`. Muted `#767676` (AA 4.54:1
  on white — verify). Rules/bands `#e2e2e2` / `#f0f0f0`. NO other colors. All colour on the
  page arrives through photography.
- Sans = **Switzer** (`public/fonts/switzer/`, weights 400/500/600/700).
  Serif accent = **Hedvig Letters Serif** (`public/fonts/hedvig/hedvig-latin.woff2` +
  `hedvig-latin-ext.woff2`, single weight 400; declare BOTH files with their unicode-range:
  latin `U+0000-00FF,...` and latin-ext — copy ranges from Google's css2 output for this
  family). Icelandic glyph coverage verified by the lead.
- **The mixed-typeface headline device**: in every display headline, ONE word is set in
  Hedvig serif, the rest in Switzer — e.g. hero: `Heklusýn` sans + `við Ytri-Rangá` with
  the accent word in serif. Use `<em>` with a class for the serif word (not italic).
- Nav: comma-separated plain text links top-right (`Fágætið, Fjöllin, Húsin, Gögnin,
  Fyrirspurn`), active/hover = underline only. Wordmark top-left as THREE stacked lines
  (`Heklusýn` / `Rangárslétta` / `Ytri-Rangá`). NO pills, NO buttons, NO icons anywhere.
  Chrome is dark-on-white; over the hero video, white with a soft bottom scrim.
- Master ease: `cubic-bezier(.17,.84,.44,1)`. Lenis global (desktop, no-preference).

### 5. Page anatomy (Kononenko's spine, Heklusýn's content)
1. **Hero** — full-bleed looping video `public/heklusyn/hero-film.mp4` (poster
   `hero-estate.jpg`; the lead delivers the mp4 — build the slot with poster fallback so
   the page works before/without it). Giant bottom-left mixed-type name. Minimal chrome.
2. **Manifesto + fact ledger** — "Fágæti og kyrrð" style h2 (one serif word), then the
   Kononenko h3-label/value ledger rows: Landið (50 hektarar) / Hús (12 til 14) / Lóðir
   (allt að 5 hektarar) / Upphaf (Leirubakki, sjálfstæð eign 2020) / Áin (Ytri-Rangá) /
   Verð (frá 109.000.000 kr.). Reuse existing verified copy.
3. **Services line** — one long h2, comma-separated: what they deliver (heilsárshús,
   sumarhús, lóðir, hönnun, bygging...) — from their real site wording only.
4. **Method pair** — "Frá teikningu að húsi" two-column text+media; the media here is a
   TÖLVUMYND render in the sketch shader — the section title IS the shader's story.
5. **Work grid** — the houses as a Kononenko work grid: Rangárslétta 2/3/9/10/11, each a
   plane with shader border, name + m² + status + price-or-Selt. Real photos = media
   shader; units with only renders = sketch shader + label. Grid rows alternate 2/1/2
   layout like the reference's work list.
6. **The mountains** — keep the eight-mountain interactive horizon (it is Heklusýn's own
   signature; nothing at Kononenko conflicts) but restyle it to the monochrome system:
   white section, names as text list left, `land-river.jpg` plane right (media shader),
   selected name sets the serif accent. Keep keyboard operability + skýringarmynd label.
7. **Stat monument** — Kononenko style: `2020` Landið sjálfstæð eign · `50` hektarar ·
   `12–14` hús (write "12 til 14") · `3` seld. Giant numerals, h3 labels.
8. **Fyrirspurn + footer** — mailto CTA as plain underlined text link, then the footer
   repeating the giant mixed-type wordmark. Company facts line (kt., address, phone).

### 6. Hero video slot
`<video autoplay muted loop playsinline poster=hero-estate.jpg>` with
`prefers-reduced-motion` ⇒ poster image only, no video element. The mp4 lands at
`public/heklusyn/hero-film.mp4` (~5s loop, the lead is generating it now). Do not block
on it — poster-first markup.

### 7. Fallbacks & safety (unchanged repo law)
- No WebGL / reduced-motion / touch coarse pointers ⇒ DOM `<img>`s stay visible, no canvas,
  no Lenis, sketch images show the REAL image (the label still discloses Tölvumynd).
- All text visible with zero JS. fromTo toward resting only. Failsafes clear
  `transform,clipPath` only — NEVER `clearProps:'all'`. No CSS transition on scrub-written
  properties. No SplitText line-splitting of paragraphs (word-per-line disaster, 3rd
  occurrence). Char/word splits allowed ONLY on the hero name, `words,chars` with
  inline-block word wrappers.
- One `<h1>`. AA contrast computed for every pair. No em/en dashes in copy. `hk-` prefix
  on every class/keyframe/custom property. 375/768/1366/1440 no overflow.
- WebGL canvas: `position:fixed; inset:0; pointer-events:none; z-index` above ground,
  below text. Cap DPR at 2. Dispose everything on unmount. IntersectionObserver to skip
  rendering offscreen planes.

## CONTRACT
Work ONLY in `src/preview/heklusyn/` (Page.tsx, data.ts, plus new files inside that folder
e.g. `webgl.ts` — keep everything in-folder). Do NOT touch App.tsx / companies.ts /
package.json / any other page. Do not run build or dev servers; `npx tsc --noEmit -p
tsconfig.app.json` only. Report: device-by-device implementation notes + contrast table.
