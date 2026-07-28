# KONONENKO REBUILD — THG Arkitektar `/preview/thg`

**This brief SUPERSEDES BRIEF.md entirely.** The ERA direction is retired; the reference
is now **kononenkogroup.com**, transplanted completely. Read
`/Users/sindri/Documents/Website redesign mockups/kononenko-teardown.md` first — short,
authoritative. Note the reference IS an architectural bureau's own site, so this page maps
almost 1:1: THG is the same kind of business in Reykjavík.

You are REPLACING `Page.tsx` wholesale. KEEP from the current build: the seven verified
projects and their published-fields-only rule (omit anything marked not published), the
three thesis quotes, Konsúlat-appears-once, SÁÁ-Vík-is-a-rehabilitation-centre framing,
Icelandic copy blocks where sections map, contact details, `data.ts` facts.

## THE SYSTEM — identical mechanics to the sister build's brief §1–§2

One THREE.js canvas renders every image as a plane synced to DOM twins via Lenis-read
rects; the two verbatim shaders live at
`.../scratchpad/kononenko/media.frag.glsl` and `.../kononenko/sketch.frag.glsl`
(full paths in the sister brief `src/preview/heklusyn/KONONENKO-BRIEF.md` §2 — read that
section, then implement YOUR OWN copy inside `src/preview/thg/`; NO shared files between
the two pages, no imports across page folders — repo law is zero style/code bleed).
Noise texture: `public/thg/noise.png`. `thg-` prefix everywhere.

### Which images get which shader — THE THESIS DEVICE
THG's concept stays **Staðarandi** (their three quotes prove it). The Kononenko sketch
shader IS "Frá skissu að byggingu" — an architect's drawing developing into the built
photograph:
- **Work-grid images: sketch shader** — every project enters as an ink drawing and
  develops into the photograph as it travels into view; hover lens swaps back to the
  drawing around the cursor. This is the page's signature and maps to what THG sells.
- **Interiors grid (Innandyra): media shader** — photographs behaving as photographs,
  in-plane parallax, shader hairline borders.
- **Hero: video slot** (see below), no shader on it.

### Ground, type, chrome
Same monochrome paper system as the sister page (#fff / #111 / #767676 verified /
#e2e2e2 rules) — the two pages are DELIBERATELY the same reference; Sindri will diverge
one later if both clients bite. Same fonts (Switzer + Hedvig accent-word device,
`public/fonts/switzer/`, `public/fonts/hedvig/` with unicode-range declarations).
- Hero name bottom-left, mixed type: `THG` + `Arkitektar` with the serif accent on
  `Arkitektar` (mirror of the reference's "Kononenko Architectural **Bureau**").
- Wordmark top-left, three stacked lines: `THG` / `Arkitektar` / `Reykjavík`.
- Nav comma-separated text: `Verkin, Staðarandi, Innandyra, Stofan, Samband`.
- Master ease `cubic-bezier(.17,.84,.44,1)`, Lenis desktop no-preference.
- Their gold monogram (`public/thg/mark.jpg`) may appear ONCE, small, in the footer — the
  reference uses no logos in chrome, so the wordmark is text.

### Page anatomy (Kononenko's spine, THG's content)
1. **Hero** — full-bleed looping video `public/thg/hero-film.mp4` (poster
   `borg-exterior.jpg`), poster-first markup, reduced-motion = poster only. Giant
   bottom-left mixed-type name. The lead delivers the mp4; do not block on it.
2. **Manifesto + fact ledger** — thesis line as h2 with one serif word ("Að fella nýtt að
   því sem *fyrir* er."), then Kononenko fact rows: Stofnað (1994, Halldór Guðmundsson) /
   Teymið (um fjörutíu manns) / Gæðakerfi (ÍST EN ISO 9001:2015 frá 2016) / Þjónusta
   (the services sentence verbatim) / Verkkaupar (Icelandair, Hrafnista, SÁÁ, EIR).
3. **Services line** — one long comma-separated h2 from their real services sentence.
4. **The three quotes** — Borg / Konsúlat / Von quotes as the "From Sketch to Strategy"
   style method blocks: quote + its project's image (sketch shader) side by side. This
   replaces the old Staðarandi section; same verified quote text.
5. **Work grid** — all seven projects, Kononenko work-grid layout (alternating 2/1/2
   rows), sketch shader, name + place + only-published fields. Konsúlat once. Vík sober.
6. **Innandyra** — interiors as a media-shader grid (borg-lobby/room/spa, marina-lounge/
   room, konsulat-lounge/bath). Keep the one quiet line ("Þú hefur líklega þegar komið...").
7. **Stat monument** — `1994` stofnað · `~40` manns (write "um fjörutíu") · `7` verk sýnd ·
   `ISO 9001` frá 2016. ONLY verified numbers; no invented totals (their real project
   count is not published — do NOT copy Kononenko's 490+ device with a made-up number).
8. **Samband + footer** — Faxafen 9 / 545 1600 / thg@thg.is as text links, giant
   mixed-type wordmark footer, kt. line.

### Fallbacks & safety — identical repo law as the sister brief §7
No-WebGL/reduced-motion/touch ⇒ plain images (sketch images show the real photo). Zero-JS
text visibility. fromTo only; failsafe clears `transform,clipPath` only. No paragraph
line-splitting. `words,chars` splits only on the hero name. One h1, AA computed, no
dashes, no overflow at 375/768/1366/1440. Canvas fixed, DPR≤2, dispose on unmount,
skip offscreen planes.

## CONTRACT
Work ONLY in `src/preview/thg/` (Page.tsx, data.ts, new in-folder files allowed). Do NOT
touch App.tsx / companies.ts / package.json / other pages / the heklusyn folder. No build
or dev runs; `npx tsc --noEmit -p tsconfig.app.json` only. Report device-by-device notes +
contrast table.
