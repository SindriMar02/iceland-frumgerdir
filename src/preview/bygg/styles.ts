/* Scoped stylesheet for /preview/bygg (Icelandic) and /preview/bygg/en.
   The Realevate clean-room rebuild's css/site.css (sndr-teardowns PR #1), every reference value kept, re-tinted to BYGG:
   the deep teal and the logo green from bygg.is/css/bygg.css, four collection colours taken from the cladding in the
   project renders, Albert Sans / Hedvig Letters Serif / Zalando Sans Expanded in the roles of Google Sans / Roslindale
   Display / Monument Extended. The section after "BYGG additions" is not in the reference.
   Injected only while the route is mounted, so it cannot reach another preview. */

export function byggCss(B: string): string {
  return String.raw`

/* ── fonts: Albert Sans / Hedvig Letters Serif / Zalando Sans Expanded, in the roles of Google Sans / Roslindale Display / Monument Extended ── */
@font-face { font-family: "Bygg Sans"; src: url(${B}fonts/bygg/AlbertSans-400.woff2) format("woff2"); font-weight: 400; font-display: swap; ascent-override: 105%; descent-override: 35%; line-gap-override: 0%; }
@font-face { font-family: "Bygg Sans"; src: url(${B}fonts/bygg/AlbertSans-500.woff2) format("woff2"); font-weight: 500; font-display: swap; ascent-override: 105%; descent-override: 35%; line-gap-override: 0%; }
@font-face { font-family: "Bygg Serif"; src: url(${B}fonts/bygg/HedvigLettersSerif-Regular.woff2) format("woff2"); font-weight: 200 400; font-display: swap; }
@font-face { font-family: "Bygg Blackbird"; src: url(${B}fonts/blackbird/ProjektBlackbirdIS.otf) format("opentype"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Bygg Wide"; src: url(${B}fonts/bygg/ZalandoSansExpanded-Regular.woff2) format("woff2"); font-weight: 400 500; font-display: swap; }

/* ── tokens (Modules 2-4) ───────────────────────────────────── */
:root {
  --navy: #244244;   /* BYGG deep teal, from bygg.is/css/bygg.css (#244244) */
  --muted: #617778;  /* navy mixed toward white until 4.7:1 on white */
  --teal: #5ac1a6;   /* the G in the BYGG logo */
  --white: #fff;
  --c-sea: #33493d;   --c-sea-muted: #66776e;   /* Ásvellir: the moss-green cladding */
  --c-green: #4a4038; --c-green-muted: #79726c; /* Bolholt: bronze timber and graphite */
  --c-urban: #2d3f4b; --c-urban-muted: #68757d; /* Fossvogsvegur: slate of the Fossvogur sky */
  --c-rare: #6b3a2e;  --c-rare-muted: #906b62;  /* Asparlaut: the rust panels */
  --picker-bg: #e1e8e6;
  --swap-bg: #dde5e3;

  --f-sans: "Bygg Sans", Arial, Helvetica, sans-serif;
  --f-serif: "Bygg Serif", Georgia, "Times New Roman", serif;
  --f-wide: "Bygg Wide", var(--f-sans);

  --ease: cubic-bezier(0.7, 0.6, 0, 1);           /* standard easing */
  --ease-tile: cubic-bezier(0.18, 0.13, 0, 0.99); /* selection hover */
  --t-tile: 0.8s;

  /* scale: desktop 1 · tablet 1.54 · mobile 2.25; ≥651px also × min(1, 100svh / 950px) (Module 2) */
  --s-base: 1;
  --s: var(--s-base);
  --cols: 12;
  --pad: calc(4.5vw * var(--s));
  --gap: calc(2.601vw * var(--s));

  /* type (Module 3) */
  --t-h1: calc(16vw * var(--s));
  --t-h2: calc(5.2vw * var(--s));
  --t-h3: calc(3.646vw * var(--s));
  --t-h4: calc(1.5vw * var(--s));
  --t-h5: calc(1.736vw * var(--s));
  --t-h6: calc(1.447vw * var(--s));
  --t-base: calc(1.2vw * var(--s));            /* html/body size */
  --t-p: var(--t-base);                        /* <p> size: ×1.5 on phones only */
  --t-nav: calc(1.25vw * var(--s));
  --t-lead: var(--t-h5);
  --t-hero: var(--t-h5);
  --lh-body: 1.35;

  /* chrome */
  --logo-w: calc(7vw * var(--s));
  --photo: calc(20vw * var(--s));
  --copy-w: calc(42vw * var(--s));
  --copy-max: calc(35vw * var(--s));
  --action-h: calc(3.356vw * var(--s));
  --burger-w: calc(3.762vw * var(--s));

  /* picker (Module 8, gap 17.7) */
  --tile-h: 75svh;
  --tile-pad: calc(1.85vw * var(--s));
  --tile-mark: calc(2.66vw * var(--s));
  --tile-name: calc(3.24vw * var(--s));
  --tile-blurb: calc(0.9vw * var(--s));
  --tile-panel: 1.85;

  /* drawer (Module 9, gap 17.8) */
  --drawer-w: calc(23vw * var(--s));
  --drawer-pad: calc(3vw * var(--s));
  --drawer-link: calc(2.816vw * var(--s));
  --drawer-contact: calc(1vw * var(--s));
}
@media (min-width: 651px) {
  :root { --s: calc(var(--s-base) * min(1, calc(100svh / 950px))); }
}
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) {
  :root { --s-base: 1.54; --cols: 8; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :root {
    --s-base: 2.25; --s: 2.25; --cols: 4;
    --pad: calc(4.5vw * 2.25);                 /* gap 17.5: no compact factor */
    --t-p: calc(1.2vw * 2.25 * 1.5);
    --t-h4: calc(1.5vw * 2.25 * 1.3);
    --t-nav: calc(1.25vw * 2.25 * 1.15);
    --t-hero: calc(var(--t-lead) * 1.2);
    --logo-w: 24vw;
    --tile-h: 52svh;
    --drawer-w: calc(100vw - var(--pad) * 2);
    --drawer-pad: 8vw;
    --drawer-link: 7.65vw;
    --drawer-contact: 3.65vw;
  }
}

/* ── base ───────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; user-select: none; -webkit-user-select: none; }
input, textarea { user-select: text; -webkit-user-select: text; }
html { scrollbar-width: none; }
html, body { margin: 0; height: 100svh; overflow: hidden; background: var(--white); color: var(--navy);
  font: 500 var(--t-base) / normal var(--f-sans); letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
body::-webkit-scrollbar { display: none; }
img { display: block; max-width: 100%; height: auto; -webkit-user-drag: none; }
a { color: inherit; text-decoration: none; }
h1, h2, h3, h4, h5, h6, p, figure, ul { margin: 0; padding: 0; font-weight: inherit; }
ul { list-style: none; }
h1 { font-size: var(--t-h1); line-height: 1; letter-spacing: -0.02em; }       /* element scale, C:479-509 */
h2 { font-size: var(--t-h2); line-height: 0.94; letter-spacing: -0.03em; }
h3 { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; }
h4 { font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
h5 { font-size: var(--t-h5); line-height: 1.35; letter-spacing: -0.01em; }
h6 { font-size: var(--t-h6); line-height: 1.4; letter-spacing: -0.01em; }
p { font-size: var(--t-p); line-height: var(--lh-body); letter-spacing: -0.01em; }
button { font: inherit; color: inherit; }
.line { display: block; overflow: hidden; transform-origin: 50% 100%; }
.probe { position: fixed; top: 0; left: 0; display: block; visibility: hidden; pointer-events: none; }

/* ── shell + page stage (Module 8 / 10) ─────────────────────── */
.shell { position: relative; width: 100%; height: 100svh; overflow: hidden; }
.page { position: relative; z-index: 2; width: 100%; height: 100svh; overflow: hidden; background: var(--white); will-change: transform; }
body.is-picking .page { position: fixed; left: 0; right: 0; bottom: 0; z-index: 3; height: 100svh; overflow: clip; cursor: pointer; }
body.is-picking .page * { cursor: inherit; }

/* ── viewport grid (Module 2) ───────────────────────────────── */
.frame { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: auto minmax(0, 1fr) auto;
  column-gap: var(--gap); row-gap: var(--gap); width: 100%; height: 100svh; max-height: 100svh; padding: var(--pad); overflow: hidden; }
.masthead { display: contents; }
.brand { grid-column: 1 / -1; grid-row: 1; justify-self: center; align-self: center; line-height: 0; }
.brand img { width: var(--logo-w); max-width: none; }
.navlink { grid-row: 1; align-self: center; font-size: var(--t-nav); white-space: nowrap; }
.navlink--start { grid-column: 1 / 3; justify-self: start; }
.navlink--end { grid-column: calc(var(--cols) - 1) / calc(var(--cols) + 1); justify-self: end; }
.colophon { grid-column: 1 / 3; grid-row: 3; justify-self: start; align-self: end; font-size: var(--t-nav); white-space: nowrap; }
.colophon small { font-size: inherit; }

/* underline that draws in from the left on hover (Module 14) */
.navlink { position: relative; display: inline-flex; }
.navlink::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor;
  transform: scaleX(0); transform-origin: 100% 50%; transition: transform 0.65s var(--ease); }
.navlink:focus-visible::after { transform: scaleX(1); transform-origin: 0% 50%; }

/* ── dock: Our Selection + menu (Module 2, 14, gap 17.2) ────── */
.dock { --fill: var(--navy); --ink: var(--white); --bg: transparent;
  position: fixed; z-index: 100; right: var(--pad); bottom: var(--pad); display: inline-flex; align-items: center; gap: 0.45em; will-change: transform; }
.dock__picker { display: inline-flex; align-items: center; justify-content: center; gap: 0.8em; height: var(--action-h); padding: 0 1.5em;
  font-size: var(--t-nav); line-height: 1; white-space: nowrap; color: var(--fill); border: calc(1px * 0.82) solid var(--fill);
  background: var(--bg) linear-gradient(90deg, var(--fill) 50%, var(--bg) 50%) 100% 0 / 200% 100%;
  transition: background-position 0.75s var(--ease), color 0.75s var(--ease); }

.dock__picker svg { width: 0.75em; height: 0.75em; fill: currentColor; flex-shrink: 0; }
.dock__burger { display: inline-flex; align-items: center; justify-content: center; width: var(--burger-w); height: var(--action-h);
  margin: 0; padding: 0; border: 0; background: var(--fill); color: var(--ink); cursor: pointer; line-height: 0; }
.dock__burger:focus:not(:focus-visible) { outline: none; }
.dock__burger svg, .drawer__close svg { width: calc(var(--burger-w) * 23 / 65); height: auto; fill: currentColor; }
body.drawer-open .dock__burger, body.drawer-open .menu-top { visibility: hidden; }

/* ── home hero (Module 7, gap 17.3-17.4) ────────────────────── */
.hero { grid-column: 1 / -1; grid-row: 2; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; }
.hero::after { content: ""; } /* zero-height second flex item: with the mobile gap it lifts the stack by gap/2 (M17 #14) */
.hero__stack { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); justify-items: center; align-items: center; margin-top: -18svh; }
.hero__photo { grid-area: 1 / 1; position: relative; z-index: 5; width: var(--photo); height: var(--photo); overflow: hidden; }
.hero__photo picture, .hero__photo img { display: block; width: 100%; height: 100%; }
.hero__photo img { max-width: none; object-fit: cover; object-position: center; transform-origin: center; }
.ticker { grid-area: 1 / 1; position: relative; z-index: 0; width: 100vw; display: flex; align-items: center; overflow: visible; overflow-y: clip; padding-bottom: 2vw; pointer-events: none; }
.ticker__mask { transform-origin: 50% 100%; }
.ticker__track { display: flex; width: max-content; }
.ticker__group { display: flex; flex-shrink: 0; align-items: center; padding-right: var(--gap); }
.ticker__word { display: block; padding-right: var(--gap); white-space: nowrap; font-size: var(--t-h1); line-height: 1; letter-spacing: -0.02em; }
.hero__copy { position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; width: min(var(--copy-w), calc(100vw - var(--pad) * 2)); max-width: var(--copy-max); margin: 0 auto; text-align: center; }
.hero__lead { font-size: var(--t-hero); line-height: 1.3; letter-spacing: -0.01em; }
.chip { --b-top: 1; --b-right: 1; --b-bottom: 1; --b-left: 1;
  display: inline-block; margin: 2em 0 0; padding: 0.5em 1em 0.4em; font: 500 calc(var(--t-hero) * 0.55) / var(--lh-body) var(--f-wide);
  font-feature-settings: "ss01" 1; letter-spacing: 0.08em; text-transform: uppercase;
  background:
    linear-gradient(currentColor, currentColor) top left / calc(var(--b-top) * 100%) 1px no-repeat,
    linear-gradient(currentColor, currentColor) top right / 1px calc(var(--b-right) * 100%) no-repeat,
    linear-gradient(currentColor, currentColor) bottom right / calc(var(--b-bottom) * 100%) 1px no-repeat,
    linear-gradient(currentColor, currentColor) bottom left / 1px calc(var(--b-left) * 100%) no-repeat; }

/* before the intro starts: nothing that the intro reveals is visible */
body:not(.is-ready) .brand, body:not(.is-ready) .navlink, body:not(.is-ready) .menu-top, body:not(.is-ready) .dock, body:not(.is-ready) .hero__copy,
body:not(.is-ready) .colophon, body:not(.is-ready) .ticker__mask { visibility: hidden; }
body:not(.is-ready) .hero__photo { clip-path: inset(50% 50% 50% 50%); }

/* ── loader (Module 5, gap 17.9) ─────────────────────────────── */
.loader { position: fixed; inset: 0; z-index: 1200; display: none; place-items: center; color: var(--white); pointer-events: none; overflow: hidden; }
html.is-cold body[data-page="home"] { background: var(--navy); }
html.is-cold body[data-page="home"] .loader { display: grid; }
html.is-cold body.loader-exit { background: var(--white); }
.loader__veil { position: absolute; inset: 0; z-index: 1; background: var(--navy); }
.loader__frames { position: relative; z-index: 2; width: var(--photo); height: var(--photo); overflow: hidden; }
.loader__frame { position: absolute; inset: 0; overflow: hidden; clip-path: inset(50% 50% 50% 50%); }
.loader__frame img { width: 100%; height: 100%; object-fit: cover; transform-origin: center; }
.loader__count { --digit: var(--t-h5); position: absolute; z-index: 4; left: 50%; bottom: max(6.5vh, 2.5rem); transform: translateX(-50%); }
html:not(.count-ready) .loader__count { visibility: hidden; }
.loader__window { overflow: hidden; height: var(--digit); line-height: 1; }
.loader__digits { display: flex; gap: 0.02em; align-items: flex-start; justify-content: center; font-size: var(--digit); }
.loader__col { position: relative; display: block; width: 0.65em; height: var(--digit); overflow: hidden; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; line-height: 1; }
.loader__reel { display: flex; flex-direction: column; }
.loader__reel span { display: flex; align-items: center; justify-content: center; height: var(--digit); flex: 0 0 var(--digit); }

/* ── Our Selection picker (Module 8, gap 17.7) ──────────────── */
.picker { position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; background: var(--picker-bg); visibility: hidden; pointer-events: none; }
body.is-picking .picker { visibility: visible; pointer-events: auto; }
.picker__grid { position: relative; z-index: 4; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap); height: var(--tile-h); padding: var(--pad); padding-bottom: 0; }
.picker__slot { min-height: 0; }
.picker__slot[hidden] { display: none; }
.tile { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; color: var(--white); font-weight: 500; letter-spacing: -0.01em;
  transition: filter var(--t-tile) var(--ease-tile); -webkit-tap-highlight-color: transparent; }
.tile__panel { position: relative; flex: var(--tile-panel) 1 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto 1fr auto; align-items: start; padding: var(--tile-pad); background: var(--tile); }
.tile__mark { grid-area: 1 / 1; width: var(--tile-mark); max-width: none; }
.tile__name { grid-column: 2; grid-row: 1 / -1; align-self: end; justify-self: end; writing-mode: vertical-rl; transform: rotate(180deg); font-size: var(--tile-name); line-height: 1; letter-spacing: -0.02em; white-space: nowrap; }
.tile__blurb { grid-column: 1; grid-row: 3; align-self: end; max-width: 10.5vw; font-size: var(--tile-blurb); line-height: 1.35; color: #fff; opacity: 0.8; }
.tile__cover { position: relative; flex: 0 0 auto; width: 100%; height: 20svh; aspect-ratio: 1024 / 585; overflow: hidden; }
.tile__cover::after { content: ""; position: absolute; inset: 0; z-index: 2; opacity: 0; pointer-events: none; mix-blend-mode: soft-light;
  background: radial-gradient(120% 90% at 50% 45%, #ffffff52, #ffffff1a 38%, #fff0 70%); transition: opacity var(--t-tile) var(--ease-tile); }
.tile__cover img { width: 100%; height: 100%; object-fit: cover; filter: brightness(1) saturate(1);
  transition: transform var(--t-tile) var(--ease-tile), filter var(--t-tile) var(--ease-tile); }
.tile--light { --tile: var(--white); color: var(--navy); }
.tile--light .tile__panel { flex: 1 1 auto; }
.tile--light .tile__blurb { color: var(--navy); }
@media (hover: hover) {
  .tile:hover { filter: brightness(1.08); }
  .tile:hover .tile__cover img { transform: scale(1.045); filter: brightness(1.14) saturate(1.12); }
  .tile:hover .tile__cover::after { opacity: 1; }
  .tile--light:hover { filter: brightness(0.96); }
}
@media (min-width: 1025px) and (max-height: 949px) { .tile__blurb { max-width: 19svh; } }
/* BYGG: the vertical name is fitted to the panel height (the reference has short English names) */
@media (min-width: 1025px) { .tile__name { font-size: min(var(--tile-name), calc((55svh - var(--pad) - 2 * var(--tile-pad)) * 0.97 / var(--nw, 8))); } }
@media (min-width: 651px) and (max-width: 1024px) {
  .picker__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, 33.5svh); gap: 2svh; height: auto; padding: 3.6svh; padding-bottom: 0; }
  .tile__panel { flex: 1 1 0; padding: 1.7svh; }
  .tile__mark { width: 2.2svh; }
  .tile__name { writing-mode: horizontal-tb; transform: none; grid-row: 3; white-space: normal; line-height: 1.05; text-align: right; font-size: 2.8svh; }
  .tile__blurb { max-width: 58%; line-height: 1.3; font-size: 0.95svh; }
  .tile__cover { flex: 1 1 0; height: auto; aspect-ratio: auto; }
  .tile--light .tile__blurb { max-width: 62%; }
}
@media (max-width: 650px) and (orientation: portrait) {
  .picker__grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(4, 18svh); height: auto; }
  .tile { flex-direction: row; height: 18svh; }
  .tile__panel { flex: 1.6 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: calc(var(--tile-pad) * 1.3); }
  .tile__mark { display: none; }
  .tile__name { writing-mode: horizontal-tb; transform: none; white-space: normal; align-self: flex-start; line-height: 1.05; }
  .tile__blurb { align-self: flex-start; max-width: 33.911vw; font-size: 3.271vw; line-height: 1.3; }
  .tile__cover { flex: 1 1 0; width: auto; height: 100%; aspect-ratio: auto; }
  .tile--light .tile__panel { flex: 1.6 1 0; }
  .tile--light .tile__blurb { max-width: 40vw; }
}

/* ── drawer (nav menu) (Module 9, gap 17.8) ─────────────────── */
.drawer { --d-bg: var(--navy); --d-ink: var(--white); --d-scrim: color-mix(in srgb, var(--navy) 36%, transparent);
  position: fixed; inset: 0; z-index: 100010; visibility: hidden; pointer-events: none; }
body.drawer-open .drawer { visibility: visible; }
.drawer__scrim { position: fixed; inset: 0; background: var(--d-scrim); opacity: 0; pointer-events: none; }
body.drawer-open .drawer__scrim { pointer-events: auto; }
.drawer__panel { position: fixed; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; width: var(--drawer-w); padding: var(--drawer-pad);
  background: var(--d-bg); color: var(--d-ink); overflow: hidden; pointer-events: auto; visibility: hidden; }
.drawer__close { position: fixed; z-index: 2; display: inline-flex; align-items: center; justify-content: center; margin: 0; padding: 0; border: 0; background: transparent;
  color: var(--d-ink); cursor: pointer; line-height: 0; pointer-events: auto; }
.drawer__close:focus:not(:focus-visible) { outline: none; }
.drawer__links { display: flex; flex-direction: column; align-items: flex-start; gap: 0.08em; padding-top: calc(var(--action-h) + var(--drawer-pad) * 0.55); }
.drawer__links a { font: 300 var(--drawer-link) / 1.08 var(--f-serif); white-space: nowrap; -webkit-tap-highlight-color: transparent; }
.drawer__links a.rolls { display: inline-block; overflow: hidden; height: 1.08em; vertical-align: bottom; }
.drawer__links a.rolls > span { display: block; }
.drawer__links a.rolls i { display: inline-block; font-style: normal; }
.drawer__contact { display: flex; align-items: center; justify-content: space-between; gap: 1.5em; margin-top: calc(var(--drawer-pad) * 0.85); }
.drawer__contact a { display: inline-flex; align-items: center; gap: 0.55em; font-size: var(--drawer-contact); line-height: 1; white-space: nowrap; }
.roll-icon { display: block; width: 0.9em; overflow: hidden; line-height: 0; flex-shrink: 0; }
.roll-icon--wa { aspect-ratio: 20 / 19; }
.roll-icon--mail { aspect-ratio: 20 / 16; }
.roll-icon__track { --g: 0.5em; display: flex; flex-direction: column; gap: var(--g); transition: transform 0.68s cubic-bezier(0.16, 1, 0.3, 1); }
.roll-icon svg { display: block; width: 100%; height: auto; fill: currentColor; opacity: 0.9; }
@media (hover: hover) and (pointer: fine) { .drawer__contact a:hover .roll-icon__track { transform: translateY(calc(-50% - var(--g) / 2)); } }
@media (max-width: 650px) and (orientation: portrait) {
  .drawer__links { padding-top: 0; gap: 0.32em; }
  .drawer__contact { margin-top: 0; padding-top: 15vw; padding-bottom: 5vw; }
  .drawer__close svg { width: calc(100% * 23 / 65); }
}
@media (max-width: 650px) and (orientation: portrait), (hover: none), (pointer: coarse) {
  .drawer__links a.rolls { height: auto; overflow: visible; }
  .drawer__links a.rolls > span + span { display: none; }
  .drawer__links a.rolls i { transform: none !important; }
}

/* ── rotate-device screen (Module 14) ───────────────────────── */
.turn-device { display: none; }
@media (max-height: 650px) and (max-width: 1024px) and (orientation: landscape) {
  html, body { overflow: hidden !important; }
  .turn-device { display: grid; position: fixed; inset: 0; z-index: 2147483000; place-items: center; margin: 0; padding: 5vw; background: var(--navy); color: var(--white);
    font: 500 18px / 1.35 var(--f-sans); letter-spacing: -0.01em; text-align: center; }
}

/* ── category template (Module 11, gaps C1-C22) ─────────────── */
[data-category="asvellir"]   { --cat: var(--c-sea);   --cat-muted: var(--c-sea-muted);   --lead-max: 38vw; }
[data-category="bolholt"]    { --cat: var(--c-green); --cat-muted: var(--c-green-muted); --lead-max: 35.9vw; }
[data-category="fossvogsvegur"] { --cat: var(--c-urban); --cat-muted: var(--c-urban-muted); --lead-max: 40vw; }
[data-category="asparlaut"]    { --cat: var(--c-rare);  --cat-muted: var(--c-rare-muted);  --lead-max: 35vw; }
[data-view="category"], [data-view="about"], body[data-page="category"], body[data-page="about"] {
  --sec-pad: calc(14vw * var(--s)); --sec-gap: calc(13vw * var(--s)); --facts-gap: calc(5vw * var(--s));       /* C1 */
  --slide-w: calc(52.083vw * var(--s)); --slide-h: calc(33.738vw * var(--s)); --slider-top: calc(5vw * var(--s)); --slider-bottom: calc(8vw * var(--s));
  --arrows-right: calc(12.5vw * var(--s)); --arrows-gap: calc(0.5vw * var(--s)); --arrow: calc(3.472vw * var(--s));
  --quote-max: calc(63vw * var(--s)); --quote-img: calc(12.674vw * var(--s)); --quote-gap: calc(4.282vw * var(--s));
  --intro-gap: calc(4.282vw * var(--s)); --rule-h: calc(4vw * var(--s)); --title-max: calc(40vw * var(--s)); --copy-max-cat: calc(25.013vw * var(--s));
  --fact-gap: calc(3vw * var(--s)); --cta-rule-gap: calc(2.604vw * var(--s)); --cta-link-gap: calc(4.282vw * var(--s));
  --next-gap: calc(1.638vw * var(--s)); --pill-y: calc(0.363vw * var(--s)); --pill-x: calc(0.8vw * var(--s)); --pill: calc(1.1vw * var(--s)); --next-title: calc(5.787vw * var(--s));
  --end-h: 110svh; --grow: 1.6; --grow-gap: 5.236vw; --hold: 5svh;                                             /* C4 */
  --lh-h2: 0.94; --ls-h2: -0.03em; --lh-h3: 0.92; --ls-h3: -0.05em;
  --ink: var(--white);
}
body[data-page="category"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--cat); color: var(--ink); } /* C3 */
[data-view="about"], body[data-page="about"] { --cat: var(--navy); --cat-muted: var(--muted); }                                /* A1 */
body[data-page="about"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--white); color: var(--navy); }
html:has(body:is([data-page="category"], [data-page="about"])) { height: auto; min-height: 100%; overflow-x: hidden; overflow-y: auto; }
html:has(body:is([data-page="category"], [data-page="about"]).is-smooth) { overflow-y: hidden; }
html:has(body:is([data-page="category"], [data-page="about"]).is-picking) { height: 100svh; overflow: hidden; }
body[data-page="category"] .shell { height: auto; min-height: 100svh; overflow: visible; background: var(--cat); }
body[data-page="about"] .shell { height: auto; min-height: 100svh; overflow: visible; background: var(--white); }
.page[data-view="category"] { height: auto; min-height: 100svh; overflow: visible; background: var(--cat); color: var(--white); }
.page[data-view="about"] { height: auto; min-height: 100svh; overflow: visible; background: var(--white); color: var(--navy); }
body.is-picking .page:is([data-view="category"], [data-view="about"]) { height: 100svh; min-height: 0; overflow: clip; }
:is([data-view="category"], [data-view="about"]) .frame { overflow: visible; }
:is([data-view="category"], [data-view="about"]) .dock, body:is([data-page="category"], [data-page="about"]) .shell > .dock { --fill: var(--white); --ink: var(--cat); bottom: 5vw; transition: bottom 0.4s ease; } /* C3, C22, A3 */
body:is([data-page="category"], [data-page="about"]).past-hero .shell > .dock { --fill: var(--cat); --ink: var(--white); --bg: var(--white); bottom: var(--pad); }

/* hero stage: 100svh frame + grow runway + hold (C4) */
.scene { position: relative; z-index: 0; width: 100%; background: var(--cat);
  height: calc(100svh + (var(--end-h) + var(--grow-gap)) * var(--grow) + var(--hold)); }
.scene > .frame { position: relative; z-index: 2; }
.scene__runway { position: relative; z-index: 1; width: 100%; pointer-events: none; }
.scene__grow { height: calc((var(--end-h) + var(--grow-gap)) * var(--grow)); }
.scene__hold { height: var(--hold); }
.page__main > .scene ~ * { position: relative; z-index: 1; }
.hero--category .hero__copy { width: min(var(--copy-w), calc(100vw - var(--pad) * 2)); max-width: none; }  /* C2 */
.hero--category .hero__lead { max-width: calc(var(--lead-max) * var(--s)); margin-inline: auto; line-height: var(--lh-body); }
.hero--category .hero__photo { will-change: width, height, transform; }

/* shared editorial pieces */
.intro { display: flex; flex-direction: column; align-items: center; gap: var(--intro-gap); padding-inline: var(--pad); text-align: center; }
.intro__rule, .cta__rule { display: block; width: 1px; height: var(--rule-h); background: var(--cat); opacity: 0.35; }
.intro__title, .cta__title, .wellness__title { max-width: var(--title-max); font: 200 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); font-feature-settings: "ss01" 1; color: var(--cat); }
.intro__title { text-transform: none; } /* BYGG: the reference title-cases every word; Icelandic headings are sentence case */
.intro__text { max-width: var(--copy-max-cat); color: var(--cat-muted); }
.intro__title .line, .cta__title .line, .wellness__title .line, .quote__text .line, .fact__stat .line, .pullquote__text .line, .next__title .line { padding-bottom: 0.5vw; margin-bottom: -0.5vw; }  /* C11 */

/* gallery + carousel (C1, C9) */
.gallery { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
.carousel { position: relative; width: 100%; min-width: 0; margin-top: var(--slider-top); padding-bottom: var(--slider-bottom); overflow-x: clip; overscroll-behavior-x: contain; }
.carousel__viewport { display: grid; grid-template-columns: repeat(var(--cols), 1fr); column-gap: var(--gap); padding-inline: var(--pad); width: 100%; cursor: grab; touch-action: pan-y pinch-zoom; overscroll-behavior-x: contain; }
.carousel__viewport.is-dragging { cursor: grabbing; touch-action: none; }
.carousel__strip { grid-column: 1 / -1; display: flex; align-items: center; gap: var(--gap); rotate: -8deg; will-change: transform; }
.carousel__slide { flex: 0 0 var(--slide-w); width: var(--slide-w); min-width: var(--slide-w); rotate: 8deg; }
.carousel__slide img { width: 100%; height: var(--slide-h); object-fit: cover; background: #ffffff14; pointer-events: none; }
.carousel__nav { position: absolute; z-index: 2; right: var(--arrows-right); bottom: 0; display: flex; gap: var(--arrows-gap); }
.carousel__arrow { padding: 0; border: 0; background: none; cursor: pointer; line-height: 0; transition: opacity 0.25s ease, transform 0.25s ease; }

.carousel__arrow img { width: var(--arrow); height: var(--arrow); }
body.is-drag-scrolling, body.is-drag-scrolling * { cursor: grabbing !important; }

/* outro: marquee + quote (C11) */
.outro, .proof { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
.ticker--outro { width: 100%; padding-bottom: 0; }
.ticker--outro .ticker__word { color: var(--cat); }
.quote { display: flex; flex-direction: column; align-items: center; gap: var(--quote-gap); max-width: var(--quote-max); margin: 0 auto; padding-inline: var(--pad); text-align: center; }
.quote__image { width: var(--quote-img); height: var(--quote-img); flex-shrink: 0; object-fit: cover; }
.quote__body { margin: 0; width: 100%; }
.quote__text { display: flow-root; font: 200 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); font-feature-settings: "ss01" 1; color: var(--cat); }
.quote__credit { display: flex; flex-direction: column; align-items: center; }
.quote__name, .quote__source { width: 100%; }
.quote__name { color: var(--cat); }
.quote__source { color: var(--cat-muted); }

/* photo breaks (C8, C15) */
.photo-break { position: relative; width: 100vw; max-width: 100vw; height: 120svh; margin-left: calc(50% - 50vw); overflow: hidden; }
.photo-break__window { width: 100%; height: 100%; overflow: hidden; }
.photo-break__window img { width: 100%; height: 100%; min-width: 100%; min-height: 100%; max-width: none; object-fit: cover; object-position: center; transform-origin: center; will-change: transform; }

/* proof: well-being, facts, pull quote (C12-C14) */
.wellness { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); align-items: stretch; width: 100%; padding-inline: var(--pad); }
.wellness__copy { grid-column: 2 / 7; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--intro-gap); text-align: center; }
.wellness__title { max-width: 90%; }
.wellness__text { max-width: 27vw; color: var(--cat-muted); }
.wellness__figure { grid-column: calc(var(--cols) - 4) / var(--cols); overflow: hidden; aspect-ratio: 1078 / 1492; }
.wellness__figure img, .fact__figure img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.facts { display: flex; flex-direction: column; gap: var(--facts-gap); width: 100%; padding-inline: var(--pad); }
.fact { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); align-items: stretch; }
.fact__figure { grid-column: 2 / 5; overflow: hidden; aspect-ratio: 708 / 908; }
.fact__copy { grid-column: calc(var(--cols) - 7) / calc(var(--cols) - 4); }
.fact--flip .fact__figure { grid-column: calc(var(--cols) - 3) / var(--cols); }
.fact--flip .fact__copy { grid-column: calc(var(--cols) - 6) / calc(var(--cols) - 3); }
.fact:nth-child(1) .fact__copy { align-self: start; }
.fact:nth-child(2) .fact__copy, .fact:nth-child(3) .fact__copy { align-self: center; }
.fact:nth-child(4) .fact__copy { align-self: end; }
.fact:nth-child(3) .fact__copy--end { align-self: end; }
[data-category="bolholt"] .fact:nth-child(4) .fact__copy { align-self: center; }
[data-category="bolholt"] .fact:nth-child(5) .fact__copy { align-self: end; }
.fact__stat { font-size: var(--t-h3); line-height: var(--lh-h3); letter-spacing: var(--ls-h3); color: var(--cat); }
.fact__text { margin-top: var(--fact-gap); color: var(--cat-muted); }
.pullquote { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); width: 100%; padding-inline: var(--pad); }
.pullquote blockquote, .pullquote__credit { grid-column: 2 / var(--cols); margin: 0; }
.pullquote__text { display: flow-root; font-size: var(--t-h3); line-height: 1; letter-spacing: -0.02em; color: var(--cat); text-align: left; }
.pullquote__mark { display: inline-block; padding-left: 10vw; }
.pullquote__credit { display: flex; flex-direction: column; align-items: flex-start; margin-top: var(--quote-gap); }

/* CTA (C16) */
.cta { width: 100%; display: flex; flex-direction: column; align-items: center; padding-block: var(--sec-pad); background: var(--cat); color: var(--white); }
.cta__inner { display: flex; flex-direction: column; align-items: center; width: 100%; padding-inline: var(--pad); text-align: center; }
.cta__rule { margin-bottom: var(--cta-rule-gap); background: currentColor; }
.cta__title { color: inherit; }
.cta__link { margin-top: var(--cta-link-gap); font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
.cta__underline { position: relative; display: inline-flex; align-items: center; gap: 0.35em; color: var(--white); white-space: nowrap; } /* C29 */
.cta__underline img { width: 0.576em; max-width: none; flex-shrink: 0; height: auto; filter: brightness(0) invert(1); transition: transform 0.65s var(--ease); }
.cta__underline::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor;
  transform: scaleX(var(--cta-line, 1)); transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
.cta__underline.is-drawing::after { transition: none; }
@media (hover: hover) {
  .cta__underline:hover::after, .cta__underline:focus-visible::after { transform: scaleX(0); transform-origin: 100% 50%; }
  .cta__underline:hover img { transform: translateX(0.2em); }
}

/* next category block (C17) */
.next { position: relative; width: 100vw; max-width: 100vw; height: 50svh; min-height: 50svh; margin-left: calc(50% - 50vw); overflow: hidden; }
.next__window { width: 100%; height: 100%; overflow: hidden; }
.next__zoom { width: 100%; height: 100%; overflow: hidden; transform: scale(1); transform-origin: center; transition: transform var(--t-tile) var(--ease-tile); }
.next__drift { width: 100%; height: 100%; will-change: transform; }
.next__drift img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.next__shade { position: absolute; inset: 0; background: #0003; pointer-events: none; transition: background-color var(--t-tile) var(--ease-tile); }
@media (hover: hover) {
  .next:hover .next__zoom { transform: scale(1.1); }
  .next:hover .next__shade { background-color: #0000001a; }
}
.next.is-leaving .next__shade { background-color: #0000001a; }
.next__link { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--next-gap); padding-inline: var(--pad); color: #fff; text-align: center; cursor: pointer; }
.next__pill { display: inline-flex; align-items: center; justify-content: center; padding: var(--pill-y) var(--pill-x); border: 1px solid currentColor; border-radius: 999px; font-size: var(--pill); font-weight: 400; line-height: 1; letter-spacing: -0.01em; }
.next__title { font-size: var(--next-title); font-weight: 500; line-height: 1.1; letter-spacing: -0.02em; overflow: visible; }
.next__text { font-size: var(--t-h6); font-weight: 400; line-height: 1.4; letter-spacing: -0.01em; }

/* ── About (Module 12, gaps A1-A14) ──────────────────────────── */
.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.scene--about { --about-h: 100vw; height: var(--about-h); min-height: var(--about-h); overflow: hidden; background: transparent; }   /* A2 */
.backdrop { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.backdrop__image { display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center; will-change: transform; }
.backdrop::after { content: ""; position: absolute; inset: 0; z-index: 1; background: #0000001a; }
.backdrop__shade { position: absolute; inset: 0; z-index: 2; background: #0b1a1b; opacity: 0; will-change: opacity; }
@media (max-width: 1024px) { .scene--about { --about-h: max(200vw, 150svh); } .backdrop__image { object-position: 20% center; } } /* C:3699-3716 */
.scene--about > .frame--over { position: absolute; top: 0; left: 0; right: 0; z-index: 1; height: 100%; max-height: 100svh; color: var(--white); }
.frame--over .ticker__word { color: var(--white); }
.hero--about::after { content: none; } /* the About hero column has one item (about.html H:226-238): no gap/2 lift on phones */

.statement { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: auto auto; column-gap: var(--gap);
  row-gap: clamp(2rem, 5vw, 4.5rem); width: 100%; padding: var(--sec-pad) var(--pad); }                                          /* A5 */
.statement__label { grid-column: 1 / 3; grid-row: 1; align-self: start; margin-top: 0.3vw; }
.statement__title { grid-column: 3 / -1; grid-row: 1; font: 500 clamp(2rem, 3.7vw, 4rem) / 1.1 var(--f-sans); letter-spacing: -0.035em; color: var(--navy); }
.statement__lead { display: inline-block; margin-left: 20vw; }
.statement--second { grid-template-rows: auto; row-gap: 0; }
.statement--second .statement__title { padding-right: 7vw; }
.statement--second .statement__lead { margin-left: 10vw; }
.outro > .statement--last { padding-top: calc(var(--sec-pad) * 0.35); padding-bottom: 0; }
.statement__title .line:first-child { overflow: visible; }

.film { position: relative; width: 100%; background: var(--white); }
.film { --span: 4; }
.film__card { grid-column: calc(var(--cols) - var(--span) + 1) / -1; grid-row: 2; align-self: start; width: 100%; aspect-ratio: 1.47; } /* A6: static cell = the trigger */
.film__frame { width: 100%; height: 100%; overflow: hidden; }
.film__frame.is-live { position: absolute; z-index: 50; margin: 0; }                                                              /* A7: moves inside .film */
.film__button { position: relative; display: block; width: 100%; height: 100%; margin: 0; padding: 0; border: 0; background: none; cursor: pointer; line-height: 0; font-size: 13.3333px; }
.film__stack { position: absolute; inset: 0; display: block; }
.film__still, .film__movie { position: absolute; inset: 0; display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center; }
.film__movie { opacity: 0; }
.film__play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.film__disc { display: flex; align-items: center; justify-content: center; width: 4.3vw; height: 4.3vw; border-radius: 50%; background: #ffffffe0; color: var(--navy); }
.film__disc svg { width: 0.9em; height: auto; margin-left: 0.12em; fill: currentColor; }
.film__runway { width: 100%; height: 120svh; background: var(--white); }                                                           /* A7 */

.outro--about .ticker--outro .ticker__word { color: var(--navy); }
.outro--about .quote { gap: var(--quote-gap); }
.fact__index { font-size: 80%; color: var(--cat); }
.outro--about .fact__copy { display: flex; flex-direction: column; gap: var(--fact-gap); }                                          /* C:4894 */
.outro--about .fact__copy > * { margin: 0; }
.page[data-view="about"] .cta__title { max-width: 9em; }                                                                            /* A11 */

/* play cursor over the film (A9) */
.cursor.is-play { mix-blend-mode: normal; }
.cursor.is-play .cursor__disc::before { border: 0; background: color-mix(in srgb, var(--navy) 95%, transparent); }
.cursor.is-play .cursor__disc::after { content: none; }
.cursor__words { position: absolute; inset: 0; display: none; overflow: hidden; border-radius: 50%; }
.cursor.is-play .cursor__words { display: block; }
.cursor__word { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: 500 0.8vw / 1 var(--f-sans); letter-spacing: 0.02em; color: #fff; transform: translateY(100%); }
.cursor.is-play:not(.is-playing) .cursor__word--play, .cursor.is-play.is-playing .cursor__word--stop { transform: translateY(0); }
.cursor.is-play.is-playing .cursor__word--play { transform: translateY(-100%); }
.cursor.to-stop .cursor__word--play, .cursor.to-play .cursor__word--stop { animation: word-out var(--in) var(--c-ease) forwards; }
.cursor.to-stop .cursor__word--stop, .cursor.to-play .cursor__word--play { animation: word-in var(--in) var(--c-ease) forwards; }
@keyframes word-out { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@keyframes word-in { from { transform: translateY(100%); } to { transform: translateY(0); } }

@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { .film { --span: 3; } }
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { .lost { padding-top: calc(var(--gap) * 1.5); } } /* C:3026-3031; its padding-bottom and code size lose to the base */
@media (max-width: 650px) and (orientation: portrait) {                                                                              /* A14 */
  .statement, .statement--second { grid-template-rows: none; row-gap: calc(var(--gap) * 2); padding-block: calc(var(--pad) * 1.25); }
  .statement__label, .statement__title { grid-column: 1 / -1; grid-row: auto; }
  .statement__title { font-size: clamp(2rem, 9vw, 2.9rem); line-height: 1.1; }
  .statement__lead, .statement--second .statement__lead { margin-left: 0; }
  .statement--second .statement__title { padding-right: 0; }
  .film { --span: 3; }
  .film__card { grid-row: auto; justify-self: stretch; margin-top: calc(var(--gap) * 2); }
  .film__disc { width: 14vw; height: 14vw; }
  .page[data-view="about"] .cta__title { max-width: 9em; }
}

/* ── Contact + 404 (Module 13) ─────────────────────────────── */
:root {
  --field: calc(0.99vw * var(--s)); --field-pad: calc(1.08vw * var(--s)); --tick: calc(0.855vw * var(--s)); --send: calc(0.99vw * var(--s));
  --form-gap: calc(0.45vw * var(--s)); --ta: calc(3.2vw * var(--s)); --label-gap: calc(0.675vw * var(--s)); --foot-top: calc(0.9vw * var(--s));
  --msg: calc(1.08vw * var(--s)); --ov-w: calc(35vw * var(--s)); --ov-pad: calc(3.6vw * var(--s)); --ov-title: calc(1.98vw * var(--s));
  --ov-gap: calc(2.5vw * var(--s)); --ov-slide: calc(18vw * var(--s)); --ov-close: calc(2.25vw * var(--s)); --ov-hit: calc(2.7vw * var(--s));
  --ov-shift: calc(2.25vw * var(--s)); --ov-dur: 0.8s; --scrim: #24424473;
}
@media (max-width: 650px) and (orientation: portrait) {
  :root { --field: clamp(1rem, 4.25vw, 1.125rem); --tick: clamp(0.875rem, 3.6vw, 0.95rem); --send: clamp(1rem, 4.25vw, 1.125rem); --ov-title: clamp(1.35rem, 6vw, 1.75rem);
    --ov-pad: var(--pad); --ov-close: clamp(2rem, 8.5vw, 2.5rem); --ov-slide: calc(var(--ov-w) * 18 / 31.5); --msg: clamp(0.95rem, 4vw, 1.1rem); }
}
[data-view="contact"], [data-view="404"], body:is([data-page="contact"], [data-page="404"]) { --cat: var(--navy); --cat-muted: var(--muted); }
body:is([data-page="contact"], [data-page="404"]) { background: var(--white); color: var(--navy); }
.page--desk { background: var(--white); color: var(--navy); }
.desk { position: relative; height: 100svh; max-height: 100svh; overflow: hidden; }                                   /* C:6206 */
.desk__grid { position: relative; z-index: 1; grid-template-rows: auto minmax(0, 1fr); }                           /* C:6274 */
.desk__left, .desk__stack, .desk__aside { padding-top: calc(var(--gap) * 0.5); }
.desk__left { grid-column: 1 / 7; grid-row: 2; min-height: 0; pointer-events: none; }
.desk__stack, .desk__aside { grid-row: 2; align-self: end; min-height: 0; max-height: 100%; padding-top: 0; padding-bottom: calc(var(--gap) * 0.75); } /* C:6288 */
.desk__stack { grid-column: 6 / 9; display: flex; flex-direction: column; align-items: flex-start; gap: calc(5vw * var(--s)); width: 100%; margin-left: -3.8vw; pointer-events: none; } /* C:6299 wins over C:2916 */
.desk__stack > :not(.desk__spin) { pointer-events: auto; }
.desk__aside { grid-column: 9 / 13; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: var(--ov-gap); width: 100%; }

/* vertical marquee: fixed, turned 90° from the top-left corner, the strip itself turned 180° (C:6212-6273) */
.desk__spin { position: fixed; top: 0; left: 15vw; z-index: 0; pointer-events: none; transform: rotate(90deg); transform-origin: top left; }
.ticker--desk { position: relative; top: -12vw; width: 100vw; padding: 0; rotate: 180deg; }
.ticker--desk .ticker__word { color: var(--navy); }
.desk__heading { width: 100%; font-size: var(--t-hero); font-weight: 400; line-height: 1.3; letter-spacing: -0.01em; color: var(--navy); }   /* C:6386 */
.desk__channels { display: flex; flex-direction: column; align-items: flex-start; gap: calc(var(--gap) * 1.2); width: 100%; }
.channel { display: flex; flex-direction: column; gap: 0.35em; width: 100%; min-width: 0; }
.channel__label { font-size: calc(var(--field) * 1.18); font-weight: 500; line-height: 1.2; color: var(--navy); }
.channel__value { position: relative; display: inline-flex; align-self: flex-start; width: fit-content; max-width: 100%; margin: 0; padding: 0; border: 0; background: none;
  font: 400 var(--field) / 1.35 var(--f-sans); letter-spacing: -0.01em; color: var(--muted); text-align: left; cursor: pointer; -webkit-appearance: none; appearance: none; }
.channel__value::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform: scaleX(0); transform-origin: 100% 50%;
  transition: transform 0.65s var(--ease), opacity 0.2s ease; }
.channel__value:focus-visible::after { transform: scaleX(1); transform-origin: 0% 50%; }
.channel__text { transition: opacity 0.2s ease; }
.channel__done { position: absolute; left: 0; top: 50%; z-index: 1; display: inline-flex; align-items: center; gap: 0.4em; padding: 0.2em 0.55em; white-space: nowrap; pointer-events: none;
  transform: translateY(-50%); opacity: 0; background: var(--navy); color: #fff; font: 400 var(--field) / 1.35 var(--f-sans); transition: opacity 0.2s ease; }     /* C:6477 */
.channel__tick { width: 0.95em; height: 0.95em; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
button.channel__value { letter-spacing: normal; }
.channel__copy.is-copied .channel__text, .channel__copy.is-copied::after { opacity: 0; }
.channel__copy.is-copied .channel__done { opacity: 1; }

/* enquiry: tabs + two forms (C:2052-2247, 2401-2447) */
.enquiry { display: flex; flex-direction: column; gap: var(--ov-gap); width: 100%; min-height: 0; max-height: 100%; overscroll-behavior: contain; scrollbar-width: none; }
.enquiry::-webkit-scrollbar { display: none; }
.enquiry__tabs { display: flex; width: 100%; margin-bottom: calc(var(--form-gap) * 0.35); border-bottom: 1px solid rgba(36, 66, 68, 0.18); }
.enquiry__tab { position: relative; flex: 1 1 0; margin: 0; padding: 0.7em 0.4em 0.85em; border: 0; background: transparent; color: var(--muted);
  font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; text-align: center; cursor: pointer; transition: color 0.25s var(--ease), opacity 0.25s var(--ease); }
.enquiry__tab::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--navy); transform: scaleX(0); transform-origin: center;
  transition: transform 0.5s var(--ease), opacity 0.5s var(--ease); }
.enquiry__tab.is-active { color: var(--navy); }
.enquiry__tab.is-active { cursor: default; }
.enquiry__tab.is-active::after { transform: scaleX(1); }

.enquiry__panels { position: relative; width: 100%; }
.enquiry__form { display: flex; flex-direction: column; gap: var(--form-gap); width: 100%; }
.enquiry__form.is-active { position: relative; z-index: 1; }
.enquiry__form.is-leaving { position: absolute; left: 0; right: 0; top: 0; z-index: 2; pointer-events: none; }
.enquiry__form[hidden] { display: none; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--form-gap) * 2.5); align-items: end; }
.field-row > .field { min-width: 0; }
.enquiry :is(input:not([type="checkbox"]), select, textarea) { width: 100%; margin: 0; padding: var(--field-pad) 0; border: 0; border-bottom: 1px solid rgba(36, 66, 68, 0.25); border-radius: 0;
  background-color: transparent; color: var(--navy); font: 400 var(--field) / normal var(--f-sans); outline: none; transition: border-color 0.3s ease; user-select: text; -webkit-user-select: text; }
.enquiry :is(input, select, textarea):focus { border-bottom-color: var(--navy); }
.enquiry :is(input, textarea)::placeholder { color: var(--muted); opacity: 1; }
.enquiry textarea { height: calc(var(--ta) * 2); min-height: calc(var(--ta) * 2); max-height: calc(var(--ta) * 2); line-height: 1.45; resize: none; }
.enquiry select { -webkit-appearance: none; appearance: none; padding-right: 1.8em; cursor: pointer;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23244244' d='M1 4h10L6 9z'/%3E%3C/svg%3E") right center / 0.64em no-repeat; }
.enquiry select:invalid, .enquiry select:has(> option[value=""]:checked) { color: var(--muted); }
.consent { display: flex; flex-direction: column; gap: 0.85em; margin-top: var(--form-gap); }
.consent__label { display: flex; align-items: flex-start; gap: var(--label-gap); font: 500 var(--tick) / 1.45 var(--f-sans); color: var(--muted); cursor: pointer; }
.consent__label input { width: 1.16em; height: 1.16em; min-width: 13px; min-height: 13px; margin: 0.158em 0 0; flex-shrink: 0; accent-color: var(--navy); cursor: pointer; }
.consent__text { display: block; flex: 1; min-width: 0; }
.consent__policy { position: relative; display: inline; margin: 0; padding: 0; border: 0; background: none; font: inherit; letter-spacing: inherit; color: inherit; cursor: pointer; vertical-align: baseline; }
.consent__policy::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0.08em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }

.enquiry__foot { display: flex; align-items: center; justify-content: space-between; margin-top: var(--foot-top); }
.enquiry__send { display: inline-flex; align-items: center; justify-content: center; width: fit-content; margin: 0; padding: 0.85em 1.6em; border: 1px solid var(--navy); cursor: pointer;
  font: 500 var(--send) / normal var(--f-sans); color: var(--white); background: transparent linear-gradient(90deg, transparent 50%, var(--navy) 50%) 100% 0 / 200% 100%;
  transition: background-position 0.75s var(--ease), color 0.75s var(--ease); -webkit-appearance: none; appearance: none; }

.enquiry__send:disabled { opacity: 0.55; cursor: wait; pointer-events: none; }
.enquiry__error { font-size: var(--msg); color: #8b2e2e; }

/* 404 aside (C:6832-6860) */
.lost { display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: calc(var(--gap) * 1.5); width: 100%; min-height: 0; padding-bottom: calc(var(--gap) * 0.25); }
.lost__code { font: 300 clamp(4.5rem, 14vw, 9rem) / 0.9 var(--f-serif); letter-spacing: -0.04em; color: color-mix(in srgb, var(--navy) 14%, transparent); }
.lost__text { max-width: 22em; font-size: var(--t-hero); font-weight: 400; line-height: 1.45; letter-spacing: -0.01em; color: var(--muted); }

/* before the intro: rows and channels wait (C:380-392) */
body:not(.is-ready) :is(.enquiry__tabs, #enquiry-investors > div, .channel, .desk__heading, .lost) { visibility: hidden; }

/* side panel: privacy policy (C:1949-2043, 2270-2347, 2448-2481) */
.panel { position: fixed; inset: 0; z-index: 2147483647; display: flex; justify-content: flex-end; visibility: hidden; pointer-events: none; transition: visibility var(--ov-dur); }
.panel::before { content: ""; position: fixed; inset: 0; z-index: -1; background: var(--scrim); opacity: 0; transition: opacity var(--ov-dur) var(--ease); }
.panel.is-open { visibility: visible; pointer-events: auto; }
.panel.is-open::before { opacity: 1; }
.panel__sheet { position: relative; display: flex; flex-direction: column; width: min(100%, calc(52vw * var(--s))); max-width: 100%; height: 100%; padding: var(--ov-pad); overflow: hidden auto;
  overscroll-behavior: contain; scrollbar-width: none; background: var(--white); clip-path: inset(0 0 0 100%); transition: clip-path var(--ov-dur) var(--ease); }
.panel__sheet::-webkit-scrollbar { display: none; }
.panel.is-open .panel__sheet { clip-path: inset(0 0 0 0%); }
.panel__inner { position: relative; right: calc(-1 * var(--ov-slide)); display: flex; flex: 1; flex-direction: column; gap: var(--ov-gap); transition: right var(--ov-dur) var(--ease); }
.panel.is-open .panel__inner { right: 0; }
.panel__close { position: absolute; top: 0; right: 0; z-index: 2; display: flex; align-items: center; justify-content: center; width: var(--ov-hit); height: var(--ov-hit); min-width: 36px; min-height: 36px;
  margin: 0; padding: 0; border: 0; background: var(--white); color: var(--navy); font: 400 var(--ov-close) / 1 var(--f-sans); cursor: pointer;
  transform: translate(var(--ov-slide)); transition: opacity 0.25s var(--ease), transform var(--ov-dur) var(--ease); }
.panel.is-open .panel__close { transform: translate(0); }

.panel__title { margin-top: 0.2vw; font-size: var(--ov-title); line-height: 1.25; letter-spacing: -0.01em; color: var(--navy); }
.panel__body { display: flex; flex-direction: column; gap: 0.35em; font: 400 var(--field) / 1.35 var(--f-sans); color: var(--muted); }
.panel__body, .panel__body * { user-select: text; -webkit-user-select: text; }
.panel__body p { font-size: var(--field); line-height: 1.35; }
.panel__body h4 { margin: calc(var(--gap) * 1.2) 0 0; font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; color: var(--navy); }
.panel__body p:first-child + h4 { margin-top: calc(var(--gap) * 0.6); }
.panel__body h5 { margin: calc(var(--gap) * 0.5) 0; font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; color: var(--navy); }
.panel__body b { font-weight: 500; }
.panel__body a { color: inherit; text-decoration: underline; cursor: pointer; }

/* thank-you modal (C:2490-2605) */
.thanks { --tw: 30vw; position: fixed; inset: 0; z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: var(--pad); visibility: hidden; pointer-events: none; transition: visibility var(--ov-dur); }
.thanks__scrim { position: fixed; inset: 0; background: var(--scrim); opacity: 0; transition: opacity var(--ov-dur) var(--ease); }
.thanks__card { position: relative; z-index: 1; width: var(--tw); padding: calc(var(--ov-pad) * 1.35) calc(var(--ov-pad) * 1.1); background: var(--navy); color: var(--white); text-align: center;
  opacity: 0; transform: translateY(1.15rem) scale(0.985); transition: opacity var(--ov-dur) var(--ease), transform var(--ov-dur) var(--ease); }
.thanks.is-open { visibility: visible; pointer-events: auto; }
.thanks.is-open .thanks__scrim { opacity: 1; }
.thanks.is-open .thanks__card { opacity: 1; transform: none; }
.thanks__body { display: flex; flex-direction: column; align-items: center; gap: calc(var(--ov-gap) * 0.85); }
.thanks__title { font: 400 clamp(2.35rem, calc(var(--ov-title) * 2.15), 3.75rem) / 1.05 var(--f-serif); letter-spacing: -0.02em; color: var(--white); }
.thanks__text { font-size: calc(var(--field) * 1.05); line-height: 1.35; color: #bfe6db; }
.thanks__more { margin: calc(var(--ov-gap) * 0.35) 0 0; font: 400 calc(var(--t-h4) * 0.72) / 1.35 var(--f-sans); letter-spacing: -0.01em; color: var(--white); }
.thanks__more button { position: relative; display: inline-flex; align-items: center; gap: 0.35em; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
.thanks__more button::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
.thanks__more img { width: 0.576em; height: auto; filter: brightness(0) invert(1); }
@media (hover: hover) { .thanks__more button:hover::after { transform: scaleX(0); transform-origin: 100% 50%; } }

.desk .dock { display: none; } /* C:1447-1454: no actions on the one-screen desk pages */
/* ≤1024: the screen stacks and scrolls (C:6627-6770) */
@media (max-width: 1024px) {
  html:has(body:is([data-page="contact"], [data-page="404"])), body:is([data-page="contact"], [data-page="404"]) { height: auto; min-height: 100svh; overflow-x: hidden; overflow-y: auto; }
  html:has(body:is([data-page="contact"], [data-page="404"]).is-smooth) { overflow-y: hidden; }
  body:is([data-page="contact"], [data-page="404"]) .shell, .page--desk, .page--desk .desk, .desk__grid { height: auto; max-height: none; min-height: 100svh; overflow: visible; }
  .desk__grid { grid-template-rows: auto auto auto; }
  .desk .dock { display: inline-flex; }
  .desk__left { grid-column: 1 / -1; grid-row: auto; height: auto; display: flex; flex-direction: column; align-items: center; text-align: center; } /* C:6654 */
  .desk__stack { grid-column: 1 / -1; grid-row: auto; align-self: stretch; max-height: none; margin-left: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr;
    column-gap: calc(var(--gap) * 2); row-gap: calc(var(--gap) * 2); align-items: start; }
  .desk__spin { grid-column: 1 / -1; position: relative; top: auto; left: auto; width: 100vw; margin-inline: calc(-1 * var(--pad)); transform: none; }
  .ticker--desk { top: 0; rotate: none; }
  .desk__heading { grid-column: 1; grid-row: 2; align-self: start; }
  .desk__channels { grid-column: 2; grid-row: 2; }
  .desk__aside { grid-column: 1 / -1; grid-row: auto; align-self: auto; max-height: none; padding-bottom: 0; margin-top: calc(var(--gap) * 2); justify-content: flex-start; }
  .enquiry { max-height: none; }
  .field-row { grid-template-columns: 1fr; gap: var(--form-gap); }
}
@media (max-width: 650px) and (orientation: portrait) {                                                             /* C:3395-3611 */
  .desk__grid { grid-template-rows: auto auto auto auto; }
  .enquiry :is(input:not([type="checkbox"]), select, textarea) { font-size: max(var(--field), 16px); }
  .consent { padding: 5vw 0; }
  .consent__label { padding: 0; }
  .enquiry__send { padding: 0.75em 1.4em; }
  .thanks { --tw: min(100%, calc(100vw - var(--pad) * 2)); }
  .thanks__more { font-size: calc(var(--t-h4) * 0.85); }
  .thanks__card { padding: calc(var(--ov-pad) * 1.45) var(--ov-pad); }
}

/* ── SPA routes: stages, backdrop, separators, flight (Module 10) ── */
html:has(body.is-routing), body.is-routing { height: 100svh; overflow: hidden; }
body.is-routing .shell { height: 100svh; min-height: 0; overflow: hidden; }
body.is-routing * { cursor: default; }
body.is-routing :is(a[href], button, .tile, .next__link) { cursor: pointer; }
body.is-sliding, body.is-sliding .shell { background: var(--swap-bg); color: var(--navy); }
.page.is-incoming, body.is-picking .page.is-incoming { z-index: 6; pointer-events: none; will-change: transform, clip-path; }
.page.is-outgoing { z-index: 3; pointer-events: none; }
.route-backdrop { position: fixed; inset: 0; z-index: 1; background: var(--swap-bg); opacity: 0; pointer-events: none; }
.route-backdrop--next { background: var(--cat, var(--navy)); opacity: 1; }
.route-separator { position: fixed; inset: 0; z-index: 5; background: #000; opacity: 0; pointer-events: none; }
.route-separator--swap { inset: auto 0 0 0; width: 100%; height: 100svh; will-change: transform, opacity; }
.route-flight { position: fixed; z-index: 110; margin: 0; padding: 0; overflow: hidden; pointer-events: none; }
.route-flight > *, .route-flight img { width: 100%; height: 100%; object-fit: cover; }
.next.is-leaving { margin-left: 0; max-width: none; pointer-events: none; }
.next.is-leaving .line { overflow: visible; padding-bottom: 0.14em; margin-bottom: -0.14em; }

/* custom scrollbar (Module 1, C23) */
.scrollbar { position: fixed; z-index: 9999; top: 0; right: 0; bottom: 0; width: 11px; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
.scrollbar.is-visible { opacity: 1; pointer-events: auto; }
.scrollbar__track { position: absolute; inset: 0; pointer-events: auto; }
.scrollbar__thumb { --tc: var(--cat-muted, var(--muted)); position: absolute; left: 1px; right: 1px; min-height: 40px; border-radius: 5px; cursor: grab; pointer-events: auto;
  background: color-mix(in srgb, var(--tc) 72%, transparent); transition: background 0.15s ease; }
.scrollbar__thumb:hover { background: color-mix(in srgb, var(--tc) 85%, transparent); }
.scrollbar__thumb:active { cursor: grabbing; background: color-mix(in srgb, var(--tc) 92%, transparent); }
@media (hover: none), (max-width: 768px) { .scrollbar { display: none !important; } }

/* cursor + scroll-continue ring (Module 14, C20) */
.cursor, .ring { position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 100000; pointer-events: none; will-change: transform;
  --in: 0.5s; --out: 0.75s; --c-ease: cubic-bezier(0.15, 0.32, 0.2, 0.99); }
.cursor { mix-blend-mode: difference; transform: translate3d(var(--x, -100px), var(--y, -100px), 0); }
.cursor__disc, .ring__disc { position: absolute; left: 0; top: 0; width: 6vw; height: 6vw; border-radius: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0);
  transition: opacity var(--in) ease, transform var(--in) var(--c-ease); }
.cursor__disc::before { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid #fff; }
.cursor__disc::after { content: "\2195"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5vw; line-height: 1; color: #fff; }
.cursor.is-on .cursor__disc, .ring.is-on .ring__disc { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.cursor.is-off .cursor__disc, .ring.is-off .ring__disc { opacity: 0; transform: translate(-50%, -50%) scale(0); transition: opacity var(--out) ease, transform var(--out) var(--c-ease); }
.ring { --size: 6vw; --stroke: 1.5px; transform: translate3d(var(--x, -100px), var(--y, -100px), 0); }
.ring__disc { width: var(--size); height: var(--size); mix-blend-mode: difference; }
.ring__disc::before { content: ""; position: absolute; inset: 0; border-radius: 50%; border: var(--stroke) solid rgba(255, 255, 255, 0.28); }
.ring__fill { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from -90deg, #fff var(--p, 0%), transparent 0);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--stroke)), #000 calc(100% - var(--stroke)));
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--stroke)), #000 calc(100% - var(--stroke))); }
.ring__label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 22%; font-size: 0.8vw; font-weight: 500; line-height: 1; letter-spacing: 0.02em;
  color: #fff; white-space: nowrap; opacity: 0; mix-blend-mode: difference; transition: opacity var(--in) ease; }
.ring.is-on .ring__label { opacity: 0.95; }
.ring.is-off .ring__label { opacity: 0; transition: opacity var(--out) ease; }
@media (hover: none) { .cursor { display: none; } }

@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) {
  [data-view="category"] .hero__copy { bottom: 5svh; }
  .fact__stat { font-size: calc(var(--t-h3) * 0.85); } /* the only tablet override that survives (C12) */
}
@media (max-width: 650px) and (orientation: portrait) {
  [data-view="category"], body[data-page="category"] { --grow: 1.2; }
  :is([data-view="category"], [data-view="about"]) .dock, body:is([data-page="category"], [data-page="about"]) .shell > .dock { bottom: 20vw !important; }
  body:is([data-page="category"], [data-page="about"]).past-hero .shell > .dock { bottom: var(--pad) !important; }
  .intro__title, .cta__title, .wellness__title { max-width: 88vw; }
  .intro__text, .wellness__text, .next__text { max-width: 82vw; }
  .intro__title .line, .cta__title .line, .wellness__title .line, .quote__text .line, .fact__stat .line, .pullquote__text .line, .next__title .line { padding-bottom: calc(0.5vw * 2.25); margin-bottom: calc(-0.5vw * 2.25); }
  .wellness { display: flex; flex-direction: column-reverse; align-items: stretch; }
  .wellness__figure { width: 100%; margin: 0 auto; }
  .wellness__copy { padding-block: calc(var(--sec-pad) * 0.5); padding-inline: calc(var(--pad) * 0.5); }
  .quote { max-width: 100%; }
  .quote__text { font-size: calc(var(--t-h2) * 0.85); }
  .pullquote blockquote, .pullquote__credit { grid-column: 1 / -1; }
  .pullquote__mark { padding-left: 0; }
  .photo-break { height: 60svh; }
  .next__pill { font-size: calc(var(--pill) * 1.5); }
  .facts { gap: calc(var(--facts-gap) * 2); }
  .fact { row-gap: calc(var(--gap) * 1.5); }
  .fact .fact__figure, .fact--flip .fact__figure { grid-row: 1; grid-column: 1 / 4; align-self: start; }
  .fact .fact__copy, .fact--flip .fact__copy { grid-row: 2; grid-column: 1 / 4; align-self: start !important; text-align: left; }
  .fact:nth-child(2n) .fact__figure, .fact:nth-child(2n) .fact__copy { grid-column: 2 / -1; }
  .carousel { --slide-w: 82vw; --slide-h: 85vw; padding-bottom: 5vw; }
  .carousel__strip { rotate: -4deg; }
  .carousel__slide { rotate: 4deg; }
  .carousel__nav { right: auto; left: 50%; transform: translate(-50%); margin-bottom: calc(var(--sec-pad) * -0.714); }
  .carousel__arrow img { width: calc(var(--arrow) * 1.6); height: calc(var(--arrow) * 1.6); }
  .ring { --size: clamp(9rem, 15vw, 12.5rem); --stroke: 2.5px; }
  .ring__label { padding: 12%; font-size: clamp(0.9375rem, 4.8vw, 1.25rem); letter-spacing: 0.01em; }
}

/* ── responsive: home (Module 15, gaps 17.5-17.6) ───────────── */
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) {
  .hero--home .hero__copy { max-width: 52vw; bottom: 8vw; }
}
@media (max-width: 650px) and (orientation: portrait) {
  .brand { margin-top: 2vw; }
  .navlink { display: none; }
  .colophon { grid-column: 1 / -1; justify-self: center; text-align: center; margin: auto; }
  .dock { --k: calc(1.7 * 0.85); left: 0; right: 0; bottom: 20vw; width: fit-content; margin-inline: auto; gap: calc(0.45em * var(--k)); }
  .dock__picker { height: calc(var(--action-h) * var(--k)); padding: 0 1.2em; gap: 0.7em; font-size: calc(var(--t-nav) * var(--k)); }
  .dock__burger { width: calc(var(--burger-w) * var(--k)); height: calc(var(--action-h) * var(--k)); }
  .dock__burger svg { width: calc(100% * 23 / 65); }
  .hero { gap: 15svh; }
  .hero__stack { top: -10svh; margin-top: 0; }
  .hero .ticker { padding-bottom: 5vw; }
  .hero__copy { display: flex; flex-direction: column; align-items: center; max-width: 70vw; bottom: 23vw; }
  .hero__lead { font-size: 5.5vw; }
  .loader__count { --digit: 5.5vw; bottom: max(8vh, 2rem); }
}
@media (prefers-reduced-motion: reduce) {
  .loader { display: none !important; }
  .navlink::after { transition: none; }
}

/* ══ BYGG additions: everything below is not in the reference (Realevate): the enquiry layer, the sales overview, credit ══ */
html, body { background-color: var(--white); }
html:has(body[data-category="asvellir"]) { background-color: #33493d; }
html:has(body[data-category="bolholt"]) { background-color: #4a4038; }
html:has(body[data-category="fossvogsvegur"]) { background-color: #2d3f4b; }
html:has(body[data-category="asparlaut"]) { background-color: #6b3a2e; }
/* BYGG: notch and home indicator (env() is 0 where there is none, so the 1:1 layout is untouched) */
.frame { padding-top: max(var(--pad), env(safe-area-inset-top, 0px)); }

/* line note under the price chip: where the price comes from */
.chip-note { margin: 0.9em 0 0; font-size: calc(var(--t-hero) * 0.5); line-height: 1.35; letter-spacing: 0; opacity: 0.72; }
body:not(.is-ready) .chip-note { visibility: hidden; }

/* prototype credit (sndr-footer-credit-gate): "Designed by SNDR Studio" + the wordmark, linking to sndrstudio.is */
.credit { display: flex; align-items: center; flex-wrap: wrap; gap: 0.35em 0.7em; margin: 0.55em 0 0; font-size: calc(var(--t-nav) * 0.62); line-height: 1.35; letter-spacing: 0; white-space: normal; color: inherit; }
.credit__text { opacity: 0.78; }
.sndr { display: inline-flex; align-items: baseline; gap: 0.55em; color: inherit; text-decoration: none; }
.sndr__mark { font: 400 1.25em / 1 "Bygg Blackbird", var(--f-wide); letter-spacing: 0.04em; }
.sndr__mark i { font-style: normal; font-size: 0.8em; padding: 0 0.04em; color: var(--teal); }
.sndr__studio { font: 500 0.72em / 1 var(--f-wide); letter-spacing: 0.34em; opacity: 0.8; }

.colophon { display: flex; flex-direction: column; align-items: flex-start; }
.colophon .credit { margin: 0.35em 0 0; }
.next .credit { position: absolute; z-index: 2; left: var(--pad); right: var(--pad); bottom: var(--pad); margin: 0; color: #fff; text-shadow: 0 0 1.2em rgba(0, 0, 0, 0.45); justify-content: center; }
.next .credit .sndr { pointer-events: auto; }
.desk .credit { position: absolute; z-index: 3; left: var(--pad); bottom: calc(var(--pad) * 0.9); margin: 0; }
.drawer__contact { flex-direction: column; align-items: stretch; gap: 0; }
.drawer__row { display: flex; align-items: center; justify-content: space-between; gap: 1.5em; }
.roll-icon--sq { aspect-ratio: 1; }
.drawer__foot { margin-top: calc(var(--drawer-pad) * 0.7); font-size: var(--drawer-contact); line-height: 1.35; opacity: 0.85; }
.drawer__foot .credit { font-size: 0.86em; margin-top: 0.6em; }
.drawer__lang { display: inline-flex; align-items: center; gap: 0.55em; font-size: var(--drawer-contact); }

/* extra drawer links sit a little quieter than the three primary ones */
.drawer__links a.drawer__links--minor { font-size: calc(var(--drawer-link) * 0.62); opacity: 0.86; }

/* ── enquiry ledger on every collection page: size bands with the asking price sellers publish ── */
.ledger { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
.ledger__table { width: 100%; padding-inline: var(--pad); display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); }
.ledger__head, .ledger__row { grid-column: 2 / var(--cols); display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 0.9fr); align-items: center; column-gap: var(--gap);
  padding-block: calc(1.7vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--cat) 24%, transparent); }
.ledger__head { padding-block: calc(0.8vw * var(--s)); border-top: 0; color: var(--cat-muted); font-size: calc(var(--t-nav) * 0.86); line-height: 1.3; }
.ledger__row:last-of-type { border-bottom: 1px solid color-mix(in srgb, var(--cat) 24%, transparent); }
.ledger__size { font-size: var(--t-h3); line-height: 0.95; letter-spacing: -0.05em; color: var(--cat); font-variant-numeric: lining-nums; }
.ledger__size small { display: block; margin-top: 0.5em; font-size: calc(var(--t-p) * 0.9); letter-spacing: -0.01em; line-height: 1.3; color: var(--cat-muted); }
.ledger__price { font-size: var(--t-h5); line-height: 1.3; color: var(--cat); font-variant-numeric: lining-nums; }
.ledger__price b { font-weight: 500; white-space: nowrap; }
.ledger__stat { display: flex; flex-direction: column; gap: 0.7em; min-width: 0; }
.ledger__bar { position: relative; display: block; height: 3px; background: color-mix(in srgb, var(--cat) 16%, transparent); overflow: hidden; }
.ledger__bar i { position: absolute; inset: 0; background: var(--cat); transform: scaleX(var(--w, 0.5)); transform-origin: 0 50%; }
.ledger__tag { font-size: calc(var(--t-nav) * 0.72); line-height: 1.3; color: var(--cat-muted); }
.ledger__go { justify-self: end; font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
.ledger__go a { position: relative; display: inline-flex; align-items: center; gap: 0.35em; color: var(--cat); white-space: nowrap; }
.ledger__go a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
.ledger__go img { width: 0.576em; height: auto; flex-shrink: 0; transition: transform 0.65s var(--ease); }
@media (hover: hover) { .ledger__go a:hover::after { transform: scaleX(0); transform-origin: 100% 50%; } .ledger__go a:hover img { transform: translateX(0.2em); } }
.ledger__note { grid-column: 2 / var(--cols); margin-top: calc(var(--gap) * 0.8); color: var(--cat-muted); max-width: 46em; font-size: calc(var(--t-p) * 0.86); line-height: 1.4; }
.ledger__note a { text-decoration: underline; text-underline-offset: 0.2em; color: inherit; }
.ledger__sellers { grid-column: 2 / var(--cols); margin-top: calc(var(--gap) * 0.9); color: var(--cat); font-size: calc(var(--t-p) * 0.92); line-height: 1.4; }
.ledger__sellers b { font-weight: 500; }
.ledger__sellers span { color: var(--cat-muted); }
.ledger .line { overflow: hidden; }

/* ── sales overview (board): sample data, marked as such everywhere ── */
.board { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
.board__notice { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); padding-inline: var(--pad); }
.board__notice-in { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 1.2em; padding-block: calc(1.1vw * var(--s)); border-block: 1px solid color-mix(in srgb, var(--navy) 24%, transparent); color: var(--navy); font-size: var(--t-p); line-height: 1.35; }
.board__notice-in b { flex: none; font: 500 calc(var(--t-hero) * 0.55) / 1.2 var(--f-wide); letter-spacing: 0.08em; text-transform: uppercase; }
.board__block { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: calc(var(--gap) * 1.4); padding-inline: var(--pad); }
.board__title { grid-column: 1 / 5; font: 300 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); color: var(--navy); align-self: start; }
.board__title small { display: block; margin-top: 1.1em; font: 500 var(--t-p) / var(--lh-body) var(--f-sans); letter-spacing: -0.01em; color: var(--muted); max-width: 22em; }
.board__body { grid-column: 5 / -1; display: flex; flex-direction: column; min-width: 0; }
.board .line { padding-bottom: 0.5vw; margin-bottom: -0.5vw; }
.demand__row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 2.4fr) auto; column-gap: var(--gap); align-items: center; padding-block: calc(1.5vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.demand__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.demand__name { font-size: var(--t-h5); line-height: 1.25; color: var(--navy); }
.demand__name small { display: block; margin-top: 0.3em; font-size: calc(var(--t-p) * 0.86); color: var(--muted); }
.demand__bars { display: flex; flex-direction: column; gap: 0.5vw; min-width: 0; }
.demand__bar { display: grid; grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr); column-gap: 1em; align-items: center; font-size: calc(var(--t-p) * 0.82); color: var(--muted); }
.demand__bar span { position: relative; display: block; height: calc(0.9vw * var(--s)); min-height: 8px; background: color-mix(in srgb, var(--navy) 10%, transparent); overflow: hidden; }
.demand__bar span i { position: absolute; inset: 0; background: var(--navy); transform: scaleX(var(--w, 0.4)); transform-origin: 0 50%; }
.demand__bar:nth-child(2) span i { background: var(--teal); }
.demand__bar:nth-child(3) span i { background: color-mix(in srgb, var(--navy) 55%, white); }
.demand__total { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; text-align: right; }
.funnel { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); column-gap: calc(var(--gap) * 0.6); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.funnel__step { display: flex; flex-direction: column; gap: 0.5em; padding: calc(1.2vw * var(--s)) 0 calc(1.4vw * var(--s)); min-width: 0; }
.funnel__n { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; }
.funnel__l { font-size: calc(var(--t-p) * 0.92); line-height: 1.3; color: var(--navy); }
.funnel__d { font-size: calc(var(--t-p) * 0.82); line-height: 1.3; color: var(--muted); }
.funnel__step--stall .funnel__d { color: #8b2e2e; }
.funnel__note { margin-top: calc(var(--gap) * 0.7); color: var(--muted); max-width: 40em; font-size: calc(var(--t-p) * 0.92); }
.sellers { display: flex; flex-direction: column; }
.sellers__head, .sellers__row { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); column-gap: var(--gap); padding-block: calc(1.2vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); align-items: baseline; }
.sellers__head { border-top: 0; padding-block: calc(0.6vw * var(--s)); color: var(--muted); font-size: calc(var(--t-p) * 0.86); }
.sellers__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.sellers__name { font-size: var(--t-h5); color: var(--navy); line-height: 1.25; }
.sellers__num { font-size: var(--t-h5); color: var(--navy); font-variant-numeric: lining-nums; line-height: 1.25; }
.sellers__row--slow .sellers__num--slow { color: #8b2e2e; }
.tag-sample { display: inline-block; margin-left: 0.7em; padding: 0.15em 0.55em 0.1em; border: 1px solid currentColor; font: 500 calc(var(--t-p) * 0.62) / 1.2 var(--f-wide); letter-spacing: 0.08em; text-transform: uppercase; vertical-align: middle; }

/* ── handover checklist + defect report (Mín íbúð) ── */
.ticks { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; list-style: none; }
.ticks li { border-bottom: 1px solid rgba(36, 66, 68, 0.18); }
.ticks label { display: flex; align-items: flex-start; gap: var(--label-gap); padding: 0.85em 0; font: 500 var(--field) / 1.35 var(--f-sans); color: var(--navy); cursor: pointer; }
.ticks input { width: 1.16em; height: 1.16em; min-width: 16px; min-height: 16px; margin: 0.12em 0 0; flex-shrink: 0; accent-color: var(--navy); cursor: pointer; }
.ticks small { display: block; margin-top: 0.15em; font-weight: 400; color: var(--muted); font-size: 0.9em; }
.enquiry input[type="file"] { padding: calc(var(--field-pad) * 0.7) 0; font-size: var(--field); color: var(--muted); }
.enquiry input[type="file"]::file-selector-button { margin-right: 1em; padding: 0.4em 0.9em; border: 1px solid var(--navy); background: transparent; color: var(--navy); font: 500 0.9em var(--f-sans); cursor: pointer; }
.enquiry__hint { font-size: calc(var(--field) * 0.92); line-height: 1.4; color: var(--muted); }
.enquiry__hint a { text-decoration: underline; text-underline-offset: 0.2em; color: inherit; }
.enquiry__sample { display: flex; align-items: baseline; gap: 0.8em; font-size: calc(var(--field) * 0.92); color: var(--muted); line-height: 1.4; }

/* thank-you card lists where the enquiry would go */
.thanks__list { display: flex; flex-direction: column; gap: 0.5em; margin: 0; padding: 0; list-style: none; font-size: calc(var(--field) * 1.05); line-height: 1.35; color: #fff; text-align: left; width: 100%; }
.thanks__list li { padding-top: 0.5em; border-top: 1px solid rgba(255, 255, 255, 0.22); }
.thanks__note { font-size: calc(var(--field) * 0.95); line-height: 1.4; color: #bfe6db; }

/* no film to play: the card is a still that scroll-expands */
.film__still-wrap { position: relative; display: block; width: 100%; height: 100%; margin: 0; }
.film__link { grid-column: calc(var(--cols) - var(--span) + 1) / -1; grid-row: 3; margin-top: calc(var(--gap) * -0.9); font-size: calc(var(--t-p) * 0.9); color: var(--navy); }
.film__link a { text-decoration: underline; text-underline-offset: 0.2em; }

/* about: timeline + people, in the reference's hairline vocabulary */
.chronicle, .people { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); padding-inline: var(--pad); }
.chronicle__label, .people__label { grid-column: 1 / 3; margin-top: 0.3vw; }
.chronicle__list, .people__list { grid-column: 3 / -1; display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
.chronicle__item { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 3fr); column-gap: var(--gap); padding-block: calc(1.4vw * var(--s)); border-top: 1px solid rgba(36, 66, 68, 0.22); }
.chronicle__item:last-child { border-bottom: 1px solid rgba(36, 66, 68, 0.22); }
.chronicle__year { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; }
.chronicle__title { font-size: var(--t-h5); line-height: 1.25; color: var(--navy); }
.chronicle__text { margin-top: 0.5em; color: var(--muted); max-width: 42em; }
.people__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--gap); }
.people__item { padding-block: calc(1.1vw * var(--s)); border-top: 1px solid rgba(36, 66, 68, 0.22); color: var(--navy); }
.people__item b { display: block; font-weight: 500; font-size: var(--t-h5); line-height: 1.25; }
.people__item span { display: block; color: var(--muted); margin-top: 0.15em; }
.chronicle .line, .people .line { padding-bottom: 0.3vw; margin-bottom: -0.3vw; }
.pick-wrap { padding-block: 0; }

@media (max-width: 1024px) {
  .ledger__head, .ledger__row { grid-column: 1 / -1; }
  .ledger__note, .ledger__sellers { grid-column: 1 / -1; }
  .board__title { grid-column: 1 / -1; }
  .board__body { grid-column: 1 / -1; }
  .chronicle__list, .people__list { grid-column: 1 / -1; }
  .chronicle__label, .people__label { grid-column: 1 / -1; margin-bottom: calc(var(--gap) * 0.6); }
}
@media (max-width: 650px) and (orientation: portrait) {
  .ledger__head { display: none; }
  .ledger__row { grid-template-columns: minmax(0, 1fr) auto; row-gap: calc(var(--gap) * 0.5); }
  .ledger__size { grid-column: 1 / -1; }
  .ledger__price { grid-column: 1; font-size: calc(var(--t-h5) * 0.95); }
  .ledger__stat { grid-column: 1 / -1; grid-row: 3; }
  .ledger__go { grid-column: 2; grid-row: 2; align-self: center; font-size: var(--t-h4); }
  .board__notice-in { flex-direction: column; gap: 0.5em; }
  .demand__row { grid-template-columns: minmax(0, 1fr) auto; row-gap: calc(var(--gap) * 0.7); }
  .demand__bars { grid-column: 1 / -1; grid-row: 2; }
  .demand__bar { grid-template-columns: minmax(0, 6.5em) minmax(0, 1fr); }
  .demand__bar span { height: 3vw; }
  .funnel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .funnel__step { padding-block: calc(var(--gap) * 0.7); }
  .sellers__head { display: none; }
  .sellers__row { grid-template-columns: 1fr 1fr; row-gap: 0.4em; }
  .sellers__name { grid-column: 1 / -1; }
  .people__list { grid-template-columns: minmax(0, 1fr); }
  .chronicle__item { grid-template-columns: minmax(0, 1fr); row-gap: 0.4em; }
  .film__link { grid-column: 1 / -1; grid-row: auto; margin-top: 0; font-size: calc(var(--t-p) * 0.85); }
  .desk .credit { position: relative; left: auto; bottom: auto; grid-column: 1 / -1; margin-top: calc(var(--gap) * 2); }
  .next .credit { bottom: calc(var(--pad) * 0.8); }
}
@media (min-width: 651px) and (max-width: 1024px) { .desk .credit { position: relative; left: auto; bottom: auto; grid-column: 1 / -1; margin-top: calc(var(--gap) * 2); } }


.skip { position: fixed; left: 12px; top: 12px; z-index: 100020; padding: 0.8em 1.1em; background: #fff; color: var(--navy); font: 500 16px / 1.2 var(--f-sans); border: 1px solid var(--navy); transform: translateY(-300%); }
.skip:focus { transform: none; }
#main:focus { outline: none; }
.bg-root a, .bg-root button, .drawer a, .drawer button, .thanks button, .panel button, .bg-root select, .bg-root label { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.ledger__price, .sellers__num, .demand__total, .funnel__n, .chronicle__year { font-variant-numeric: tabular-nums lining-nums; }
/* BYGG: keyboard focus is visible everywhere (the reference removes the ring on the burger and leaves fields with a colour change only) */
.bg-root a:focus-visible, .bg-root button:focus-visible, .drawer a:focus-visible, .drawer button:focus-visible, .thanks button:focus-visible, .panel button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.dock__burger:focus-visible { outline-color: var(--ink); outline-offset: -5px; }
.enquiry :is(input, select, textarea):focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
.tile:focus-visible { outline: 3px solid #fff; outline-offset: -6px; }
.tile--light:focus-visible { outline-color: var(--navy); }
/* BYGG: touch targets of at least 44px where the reference sets links in body-size type */
@media (pointer: coarse) {
  .ledger__go a, .cta__underline, .channel__value, .enquiry__tab, .thanks__more button, .film__link a, .ledger__note a, .enquiry__hint a { min-height: 44px; display: inline-flex; align-items: center; }
  .ledger__note a, .enquiry__hint a { min-height: 32px; }
  .ledger__note, .ledger__sellers { line-height: 1.8; }
}
/* BYGG: hover states only where a pointer can hover; the reference leaves them stuck after a tap on touch screens */
@media (hover: hover) and (pointer: fine) {
  .navlink:hover::after { transform: scaleX(1); transform-origin: 0% 50%; }
  .dock__picker:hover { background-position: 0 0; color: var(--ink); }
  .carousel__arrow:hover { opacity: 0.65; }
  .channel__value:hover::after { transform: scaleX(1); transform-origin: 0% 50%; }
  .enquiry__tab:hover { color: var(--navy); }
  .enquiry__tab:not(.is-active):hover::after { transform: scaleX(0.35); opacity: 0.45; }
  .consent__policy:hover::after { transform: scaleX(0); transform-origin: 100% 50%; }
  .enquiry__send:hover { background-position: 0 0; color: var(--navy); }
  .panel__close:hover { opacity: 0.55; }
  .sndr:hover .sndr__mark { text-decoration: underline; text-underline-offset: 0.25em; }
}

/* ══ BYGG home: a plain scrolling page (the reference's home is one screen with a marquee, which carried no information) ══ */
body[data-page="home"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--white); color: var(--navy); }
html:has(body[data-page="home"]) { height: auto; min-height: 100%; overflow-x: hidden; overflow-y: auto; }
html:has(body[data-page="home"].is-smooth) { overflow-y: hidden; }
html:has(body[data-page="home"].is-picking) { height: 100svh; overflow: hidden; }
body[data-page="home"] .shell { height: auto; min-height: 100svh; overflow: visible; }
.page[data-view="home"] { height: auto; min-height: 100svh; overflow: visible; }
body.is-picking .page[data-view="home"] { height: 100svh; min-height: 0; overflow: clip; }
body[data-page="home"] .shell > .dock { --bg: var(--white); }
body[data-page="home"] .shell > .dock .dock__burger { box-shadow: 0 0 0 1px var(--white); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6em; min-height: max(44px, var(--action-h)); padding: 0 1.5em; border: 1px solid var(--navy);
  color: var(--navy); background: transparent; font-size: max(15px, var(--t-nav)); line-height: 1; white-space: nowrap; transition: background-color 0.35s var(--ease), color 0.35s var(--ease); }
.btn--solid { background: var(--navy); color: var(--white); }
.btn:focus-visible { outline: 2px solid var(--navy); outline-offset: 3px; }

.home-hero.frame { height: auto; min-height: 100svh; max-height: none; overflow: visible; padding-bottom: calc(var(--pad) * 0.9); }
body:not(.is-ready) .home-hero__copy, body:not(.is-ready) .home-facts { visibility: hidden; }
.home-hero__body { grid-column: 1 / -1; grid-row: 2; display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: var(--gap); align-items: center; padding-block: calc(var(--gap) * 1.1); }
.home-hero__copy { grid-area: 1 / 1 / 2 / 6; }
.home-hero__lead { font-size: calc(var(--t-h3) * 0.84); line-height: 1.06; letter-spacing: -0.035em; text-wrap: balance; }
.home-hero__sub { max-width: 30em; margin-top: 1.3em; font-size: var(--t-h4); line-height: 1.4; letter-spacing: -0.01em; }
.home-hero__cta { display: flex; flex-wrap: wrap; gap: 0.7em; margin-top: 1.9em; }
.home-hero__photo.hero__photo { grid-area: 1 / 7 / 2 / 13; width: 100%; height: auto; aspect-ratio: 5 / 4; }
.home-facts { grid-column: 1 / -1; grid-row: 3; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: var(--gap); row-gap: 1.2em; margin: 0;
  padding-top: 1.1em; border-top: 1px solid color-mix(in srgb, var(--navy) 30%, transparent); }
.home-facts__item { display: flex; flex-direction: column-reverse; gap: 0.3em; }
.home-facts dt { font-size: calc(var(--t-p) * 0.9); color: var(--muted); }
.home-facts dd { margin: 0; font-size: var(--t-h5); line-height: 1.1; letter-spacing: -0.02em; }

.home-sec { padding: calc(var(--pad) * 1.6) var(--pad) 0; }
.home-sec__head { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: 0.9em; align-items: end; margin-bottom: calc(var(--gap) * 1.3); }
.home-sec__title { grid-column: 1 / 8; font-size: var(--t-h3); line-height: 0.98; letter-spacing: -0.04em; text-wrap: balance; }
.home-sec__text { grid-column: 8 / -1; max-width: 32em; color: var(--muted); line-height: 1.4; }

.pgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); }
.pcard { position: relative; display: flex; flex-direction: column; overflow: hidden; background: var(--tile); color: var(--white); }
.pcard__img { display: block; aspect-ratio: 3 / 2; overflow: hidden; background: var(--tile); }
.pcard__img img { width: 100%; height: 100%; max-width: none; object-fit: cover; transition: transform 0.9s var(--ease); }
.pcard__body { flex: 1; display: grid; align-content: space-between; gap: calc(var(--gap) * 0.75); padding: calc(var(--gap) * 0.85); }
.pcard__name { font-size: calc(var(--t-h4) * 1.55); line-height: 1.02; letter-spacing: -0.035em; }
.pcard__link::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.pcard__link:focus-visible { outline: none; }
.pcard__link:focus-visible::after { outline: 3px solid var(--white); outline-offset: -6px; }
.pcard__town { margin-top: 0.4em; color: rgba(255, 255, 255, 0.8); }
.pcard__meta { display: flex; flex-wrap: wrap; gap: 1em 2.4em; margin: 0; }
.pcard__meta dt { font-size: calc(var(--t-p) * 0.9); color: rgba(255, 255, 255, 0.78); }
.pcard__meta dd { margin: 0.2em 0 0; font-size: var(--t-h5); line-height: 1.1; letter-spacing: -0.02em; }
.pcard__go { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6em 1em; font-size: max(15px, var(--t-p)); white-space: nowrap; }
.pcard__view { display: inline-flex; align-items: center; gap: 0.6em; }
.pcard__view img { width: 1.1em; height: auto; }
.pcard__enquire { position: relative; z-index: 2; display: inline-flex; align-items: center; min-height: 44px; padding: 0 1.3em; border: 1px solid var(--white); color: var(--white);
  transition: background-color 0.35s var(--ease), color 0.35s var(--ease); }
.pcard__enquire:focus-visible { outline: 3px solid var(--white); outline-offset: 3px; }

.more { margin-top: calc(var(--gap) * 2); padding-top: 1.5em; border-top: 1px solid color-mix(in srgb, var(--navy) 30%, transparent); }
.more__title { font-size: calc(var(--t-h4) * 1.3); line-height: 1.1; letter-spacing: -0.03em; }
.more__text { margin-top: 0.4em; color: var(--muted); }
.more__list { margin-top: 1.1em; }
.more__row { font-size: max(15px, var(--t-p)); display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 3.4fr); column-gap: var(--gap); align-items: center; padding: 0.6em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); }
.more__name { font-size: var(--t-h5); line-height: 1.2; letter-spacing: -0.02em; }
.more__town, .more__sellers { color: var(--muted); }
.more__links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0 1.6em; }
.more__links a, .end__phone, .need__go, .agtable td a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; }
.more__links a { display: inline-flex; align-items: center; min-height: 44px; }

.how { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); margin: 0; padding: 0; list-style: none; }
.how__step { display: grid; align-content: start; gap: 0.6em; padding-top: 1em; border-top: 1px solid var(--navy); }
.how__n { font: 400 calc(var(--t-p) * 0.9) / 1 var(--f-wide); color: var(--muted); }
.how__title { font-size: calc(var(--t-h4) * 1.3); line-height: 1.1; letter-spacing: -0.03em; }
.how__text { max-width: 26em; color: var(--muted); line-height: 1.4; }

.agtable table { width: 100%; border-collapse: collapse; }
.agtable th, .agtable td { padding: 0.8em 1.2em 0.8em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); text-align: left; vertical-align: top; font-weight: 500; font-size: var(--t-p); line-height: 1.35; }
.agtable thead th { padding-top: 0; border-top: 0; border-bottom: 1px solid var(--navy); font-size: calc(var(--t-p) * 0.9); font-weight: 400; color: var(--muted); }
.agtable tbody th { font-size: var(--t-h5); letter-spacing: -0.02em; }
.agtable td:nth-child(3) { color: var(--muted); }
.agtable td a { display: inline-flex; align-items: center; min-height: 44px; margin-block: -0.7em; }

.end { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--gap); row-gap: calc(var(--gap) * 1.4); align-items: start; }
.end__phone { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--t-h3); line-height: 1; letter-spacing: -0.04em; }
.end__hours { margin-top: 0.8em; color: var(--muted); }
.end__office .home-hero__cta { margin-top: 1.5em; }
.need { margin: 0; padding: 0; list-style: none; }
.need__row { display: flex; align-items: center; justify-content: space-between; gap: 1.2em; padding: 0.9em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.need__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
.need__title { font-size: var(--t-h5); line-height: 1.2; letter-spacing: -0.02em; }
.need__text { margin-top: 0.3em; color: var(--muted); }
.need__go { font-size: max(15px, var(--t-p)); display: inline-flex; align-items: center; gap: 0.5em; min-height: 44px; white-space: nowrap; }
.need__go img { width: 1em; height: auto; }
.home-colophon.colophon { grid-column: auto; grid-row: auto; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.8em 2em; padding: calc(var(--pad) * 1.7) var(--pad) calc(var(--pad) * 1.1); white-space: normal; }

@media (hover: hover) and (pointer: fine) {
  .btn:hover { background: var(--navy); color: var(--white); }
  .btn--solid:hover { background: transparent; color: var(--navy); }
  .pcard:hover .pcard__img img { transform: scale(1.025); }
  .pcard__enquire:hover { background: var(--white); color: var(--tile); }
  .more__links a:hover, .need__go:hover, .end__phone:hover, .agtable td a:hover { text-decoration-color: transparent; }
}
@media (min-width: 1025px) {
  .home-facts { padding-right: calc(var(--action-h) * 4.4 + var(--gap)); } /* keeps the last figure clear of the fixed dock */
}
@media (min-width: 651px) and (max-width: 1024px) {
  .home-facts { padding-right: 230px; } /* the fixed dock is about 190px wide */
}
@media (max-width: 1024px) {
  .home-hero__copy { grid-area: 1 / 1 / 2 / -1; }
  .home-hero__photo.hero__photo { grid-area: 2 / 1 / 3 / -1; aspect-ratio: 16 / 10; }
  .home-hero__lead { font-size: calc(var(--t-h3) * 0.95); }
  .home-sec__title, .home-sec__text { grid-column: 1 / -1; }
  .pgrid { grid-template-columns: minmax(0, 1fr); }
  .how { grid-template-columns: minmax(0, 1fr); }
  .end { grid-template-columns: minmax(0, 1fr); }
  .more__row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 0.1em; }
  .more__links { grid-column: 1 / -1; justify-content: flex-start; }
}
@media (max-width: 650px) and (orientation: portrait) {
  .home-hero.frame { grid-template-rows: auto auto auto auto; }
  .home-hero__body { display: contents; }
  .home-hero__copy { grid-area: 2 / 1 / 3 / -1; padding-top: var(--gap); }
  .home-facts { grid-area: 3 / 1 / 4 / -1; }
  .home-hero__photo.hero__photo { grid-area: 4 / 1 / 5 / -1; }
  .home-hero__lead { font-size: 8.4vw; }
  .home-hero__cta .btn { flex: 1 1 100%; }
  .home-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-sec__title { font-size: 9.4vw; }
  .end__phone { font-size: 11vw; }
  .agtable thead { display: none; }
  .agtable tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 1em; padding: 0.8em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); }
  .agtable th, .agtable td { padding: 0; border: 0; }
  .agtable tbody th { grid-column: 1; }
  .agtable td:nth-child(2) { grid-column: 2; grid-row: 1; text-align: right; }
  .agtable td:nth-child(3) { grid-column: 1 / -1; margin-top: 0.3em; }
  .agtable td a { margin-block: -0.6em; }
  .need__row { align-items: flex-start; flex-direction: column; gap: 0.2em; }
}
.fact__stat--long { font-size: min(var(--t-h3), calc(3.4vw * var(--s))); }
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { .fact__stat--long { font-size: min(var(--t-h3), calc(2.9vw * var(--s))); } }

/* ── BYGG: a labelled menu button in the header on phones (the bottom dock's square icon was easy to miss) ── */
.menu-top { display: none; }
@media (max-width: 650px) and (orientation: portrait) {
  .brand { justify-self: start; }
  .menu-top { grid-column: 1 / -1; grid-row: 1; justify-self: end; align-self: center; display: inline-flex; align-items: center; gap: 0.65em; min-height: 44px; margin: 0; padding: 0 0.95em;
    border: 1px solid currentColor; background: transparent; color: inherit; font: inherit; font-size: max(15px, var(--t-nav)); line-height: 1; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .menu-top svg { width: 20px; height: auto; fill: currentColor; flex-shrink: 0; }
  .menu-top:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
}
.drawer__close-label { display: none; }
.drawer__close.is-labelled { gap: 0.65em; font-size: max(15px, var(--t-nav)); line-height: 1; }
.drawer__close.is-labelled .drawer__close-label { display: inline; }
.drawer__close.is-labelled svg { width: 20px; }
`
}
