

export function extonCss(B: string): string {
  return String.raw`
@font-face {font-family:"Exton Sans";src:url(${B}fonts/exton/CabinetGrotesk-Regular.woff2) format("woff2");font-weight:400;font-display:swap;}
@font-face {font-family:"Exton Sans";src:url(${B}fonts/exton/CabinetGrotesk-Medium.woff2) format("woff2");font-weight:500;font-display:swap;}
@font-face {font-family:"Exton Display";src:url(${B}fonts/exton/Tanker-Regular.woff2) format("woff2");font-weight:100 900;font-display:swap;} /* Tanker: single weight; the range stops faux bold */





:root {
  --navy: #0C1125;   
  --muted: #54595F;  
  --teal: #005595;   
  --white: #fff;
  --c-sea: #005595;   --c-sea-muted: #005595;   
  --c-green: #0C1125; --c-green-muted: #54595F; 
  --c-urban: #6320EE; --c-urban-muted: #6320EE; 
  --c-rare: #276BA5;  --c-rare-muted: #276BA5;  
  --picker-bg: #e4e8eb;
  --swap-bg: #dce2e6;

  --f-sans: "Exton Sans", Arial, Helvetica, sans-serif;
  --f-serif: "Exton Display", "Arial Narrow", Impact, sans-serif;
  --f-wide: "Exton Sans", var(--f-sans);

  --ease: cubic-bezier(0.7, 0.6, 0, 1);           
  --ease-tile: cubic-bezier(0.18, 0.13, 0, 0.99); 
  --t-tile: 0.8s;

  
  --s-base: 1;
  --s: var(--s-base);
  --cols: 12;
  --pad: calc(4.5vw * var(--s));
  --gap: calc(2.601vw * var(--s));

  
  --t-h1: calc(16vw * var(--s));
  --t-h2: calc(5.2vw * var(--s));
  --t-h3: calc(3.646vw * var(--s));
  --t-h4: calc(1.5vw * var(--s));
  --t-h5: calc(1.736vw * var(--s));
  --t-h6: calc(1.447vw * var(--s));
  --t-base: calc(1.2vw * var(--s));            
  --t-p: var(--t-base);                        
  --t-nav: calc(1.25vw * var(--s));
  --t-lead: var(--t-h5);
  --t-hero: var(--t-h5);
  --lh-body: 1.35;

  
  --logo-w: calc(7vw * var(--s));
  --photo: calc(20vw * var(--s));
  --copy-w: calc(42vw * var(--s));
  --copy-max: calc(35vw * var(--s));
  --action-h: calc(3.356vw * var(--s));
  --burger-w: calc(3.762vw * var(--s));

  
  --tile-h: 75svh;
  --tile-pad: calc(1.85vw * var(--s));
  --tile-mark: calc(2.66vw * var(--s));
  --tile-name: calc(3.24vw * var(--s));
  --tile-blurb: calc(0.9vw * var(--s));
  --tile-panel: 1.85;

  
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
    --pad: calc(4.5vw * 2.25);                 
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


:where(html.exton-on) *, :where(html.exton-on) *::before, :where(html.exton-on) *::after { box-sizing: border-box; user-select: none; -webkit-user-select: none; }
:where(html.exton-on) input, :where(html.exton-on) textarea { user-select: text; -webkit-user-select: text; }
html.exton-on { scrollbar-width: none; }
html.exton-on, :where(html.exton-on) body { margin: 0; height: 100svh; overflow: hidden; background: var(--white); color: var(--navy);
  font: 500 var(--t-base) / normal var(--f-sans); letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
:where(html.exton-on) body::-webkit-scrollbar { display: none; }
:where(html.exton-on) img { display: block; max-width: 100%; height: auto; -webkit-user-drag: none; }
:where(html.exton-on) a { color: inherit; text-decoration: none; }
:where(html.exton-on) h1, :where(html.exton-on) h2, :where(html.exton-on) h3, :where(html.exton-on) h4, :where(html.exton-on) h5, :where(html.exton-on) h6, :where(html.exton-on) p, :where(html.exton-on) figure, :where(html.exton-on) ul { margin: 0; padding: 0; font-weight: inherit; }
:where(html.exton-on) ul { list-style: none; }
:where(html.exton-on) h1 { font-size: var(--t-h1); line-height: 1; letter-spacing: -0.02em; }       
:where(html.exton-on) h2 { font-size: var(--t-h2); line-height: 0.94; letter-spacing: -0.03em; }
:where(html.exton-on) h3 { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; }
:where(html.exton-on) h4 { font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
:where(html.exton-on) h5 { font-size: var(--t-h5); line-height: 1.35; letter-spacing: -0.01em; }
:where(html.exton-on) h6 { font-size: var(--t-h6); line-height: 1.4; letter-spacing: -0.01em; }
:where(html.exton-on) p { font-size: var(--t-p); line-height: var(--lh-body); letter-spacing: -0.01em; }
:where(html.exton-on) button { font: inherit; color: inherit; }
:where(html.exton-on) .line { display: block; overflow: hidden; transform-origin: 50% 100%; }
:where(html.exton-on) .probe { position: fixed; top: 0; left: 0; display: block; visibility: hidden; pointer-events: none; }


:where(html.exton-on) .shell { position: relative; width: 100%; height: 100svh; overflow: hidden; }
:where(html.exton-on) .page { position: relative; z-index: 2; width: 100%; height: 100svh; overflow: hidden; background: var(--white); will-change: transform; }
:where(html.exton-on) body.is-picking .page { position: fixed; left: 0; right: 0; bottom: 0; z-index: 3; height: 100svh; overflow: clip; cursor: pointer; }
:where(html.exton-on) body.is-picking .page * { cursor: inherit; }


:where(html.exton-on) .frame { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: auto minmax(0, 1fr) auto;
  column-gap: var(--gap); row-gap: var(--gap); width: 100%; height: 100svh; max-height: 100svh; padding: var(--pad); overflow: hidden; }
:where(html.exton-on) .masthead { display: contents; }
:where(html.exton-on) .brand { grid-column: 1 / -1; grid-row: 1; justify-self: center; align-self: center; line-height: 0; }
:where(html.exton-on) .brand img { width: var(--logo-w); max-width: none; }
:where(html.exton-on) .navlink { grid-row: 1; align-self: center; font-size: var(--t-nav); white-space: nowrap; }
:where(html.exton-on) .navlink--start { grid-column: 1 / 3; justify-self: start; }
:where(html.exton-on) .navlink--end { grid-column: calc(var(--cols) - 1) / calc(var(--cols) + 1); justify-self: end; }
:where(html.exton-on) .colophon { grid-column: 1 / 3; grid-row: 3; justify-self: start; align-self: end; font-size: var(--t-nav); white-space: nowrap; }
:where(html.exton-on) .colophon small { font-size: inherit; }


:where(html.exton-on) .navlink { position: relative; display: inline-flex; }
:where(html.exton-on) .navlink::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor;
  transform: scaleX(0); transform-origin: 100% 50%; transition: transform 0.65s var(--ease); }
:where(html.exton-on) .navlink:focus-visible::after { transform: scaleX(1); transform-origin: 0% 50%; }


:where(html.exton-on) .dock { --fill: var(--navy); --ink: var(--white); --bg: var(--white); 
  position: fixed; z-index: 100; right: var(--pad); bottom: var(--pad); display: inline-flex; align-items: center; gap: 0.45em; will-change: transform; }
:where(html.exton-on) .dock__picker { display: inline-flex; align-items: center; justify-content: center; gap: 0.8em; height: var(--action-h); padding: 0 1.5em;
  font-size: var(--t-nav); line-height: 1; white-space: nowrap; color: var(--fill); border: calc(1px * 0.82) solid var(--fill);
  background: var(--bg) linear-gradient(90deg, var(--fill) 50%, var(--bg) 50%) 100% 0 / 200% 100%;
  transition: background-position 0.75s var(--ease), color 0.75s var(--ease); }

:where(html.exton-on) .dock__picker svg { width: 0.75em; height: 0.75em; fill: currentColor; flex-shrink: 0; }
:where(html.exton-on) .dock__burger { display: inline-flex; align-items: center; justify-content: center; width: var(--burger-w); height: var(--action-h);
  margin: 0; padding: 0; border: 0; background: var(--fill); color: var(--ink); cursor: pointer; line-height: 0; }
:where(html.exton-on) .dock__burger:focus:not(:focus-visible) { outline: none; }
:where(html.exton-on) .dock__burger svg, :where(html.exton-on) .drawer__close svg { width: calc(var(--burger-w) * 23 / 65); height: auto; fill: currentColor; }
:where(html.exton-on) body.drawer-open .dock__burger, :where(html.exton-on) body.drawer-open .menu-top { visibility: hidden; }


:where(html.exton-on) .hero { grid-column: 1 / -1; grid-row: 2; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; }
:where(html.exton-on) .hero::after { content: ""; } 
:where(html.exton-on) .hero__stack { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); justify-items: center; align-items: center; margin-top: -18svh; }
:where(html.exton-on) .hero__photo { grid-area: 1 / 1; position: relative; z-index: 5; width: var(--photo); height: var(--photo); overflow: hidden; }
:where(html.exton-on) .hero__photo picture, :where(html.exton-on) .hero__photo img { display: block; width: 100%; height: 100%; }
:where(html.exton-on) .hero__photo img { max-width: none; object-fit: cover; object-position: center; transform-origin: center; }
:where(html.exton-on) .ticker { grid-area: 1 / 1; position: relative; z-index: 0; width: 100vw; display: flex; align-items: center; overflow: visible; overflow-y: clip; padding-bottom: 2vw; pointer-events: none; }
:where(html.exton-on) .ticker__mask { transform-origin: 50% 100%; }
:where(html.exton-on) .ticker__track { display: flex; width: max-content; }
:where(html.exton-on) .ticker__group { display: flex; flex-shrink: 0; align-items: center; padding-right: var(--gap); }
:where(html.exton-on) .ticker__word { display: block; padding-right: var(--gap); white-space: nowrap; font-size: var(--t-h1); line-height: 1; letter-spacing: -0.02em; }
:where(html.exton-on) .hero__copy { position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; width: min(var(--copy-w), calc(100vw - var(--pad) * 2)); max-width: var(--copy-max); margin: 0 auto; text-align: center; }
:where(html.exton-on) .hero__lead { font-size: var(--t-hero); line-height: 1.3; letter-spacing: -0.01em; }
:where(html.exton-on) .chip { --b-top: 1; --b-right: 1; --b-bottom: 1; --b-left: 1;
  display: inline-block; margin: 2em 0 0; padding: 0.5em 1em 0.4em; font: 500 calc(var(--t-hero) * 0.55) / var(--lh-body) var(--f-wide);
  font-feature-settings: "ss01" 1; letter-spacing: 0.08em; text-transform: uppercase;
  background:
    linear-gradient(currentColor, currentColor) top left / calc(var(--b-top) * 100%) 1px no-repeat,
    linear-gradient(currentColor, currentColor) top right / 1px calc(var(--b-right) * 100%) no-repeat,
    linear-gradient(currentColor, currentColor) bottom right / calc(var(--b-bottom) * 100%) 1px no-repeat,
    linear-gradient(currentColor, currentColor) bottom left / 1px calc(var(--b-left) * 100%) no-repeat; }


:where(html.exton-on) body:not(.is-ready) .brand, :where(html.exton-on) body:not(.is-ready) .navlink, :where(html.exton-on) body:not(.is-ready) .menu-top, :where(html.exton-on) body:not(.is-ready) .dock, :where(html.exton-on) body:not(.is-ready) .hero__copy, :where(html.exton-on) body:not(.is-ready) .colophon, :where(html.exton-on) body:not(.is-ready) .ticker__mask { visibility: hidden; }
:where(html.exton-on) body:not(.is-ready) .hero__photo { clip-path: inset(50% 50% 50% 50%); }


:where(html.exton-on) .loader { position: fixed; inset: 0; z-index: 1200; display: none; place-items: center; color: var(--white); pointer-events: none; overflow: hidden; }
html.exton-on.is-cold body[data-page="home"] { background: var(--navy); }
html.exton-on.is-cold body[data-page="home"] .loader { display: grid; }
html.exton-on.is-cold body.loader-exit { background: var(--white); }
:where(html.exton-on) .loader__veil { position: absolute; inset: 0; z-index: 1; background: var(--navy); }
:where(html.exton-on) .loader__frames { position: relative; z-index: 2; width: var(--photo); height: var(--photo); overflow: hidden; }
:where(html.exton-on) .loader__frame { position: absolute; inset: 0; overflow: hidden; clip-path: inset(50% 50% 50% 50%); }
:where(html.exton-on) .loader__frame img { width: 100%; height: 100%; object-fit: cover; transform-origin: center; }
:where(html.exton-on) .loader__count { --digit: var(--t-h5); position: absolute; z-index: 4; left: 50%; bottom: max(6.5vh, 2.5rem); transform: translateX(-50%); }
html.exton-on:not(.count-ready) .loader__count { visibility: hidden; }
:where(html.exton-on) .loader__window { overflow: hidden; height: var(--digit); line-height: 1; }
:where(html.exton-on) .loader__digits { display: flex; gap: 0.02em; align-items: flex-start; justify-content: center; font-size: var(--digit); }
:where(html.exton-on) .loader__col { position: relative; display: block; width: 0.65em; height: var(--digit); overflow: hidden; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; line-height: 1; }
:where(html.exton-on) .loader__reel { display: flex; flex-direction: column; }
:where(html.exton-on) .loader__reel span { display: flex; align-items: center; justify-content: center; height: var(--digit); flex: 0 0 var(--digit); }


:where(html.exton-on) .picker { position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; background: var(--picker-bg); visibility: hidden; pointer-events: none; }
:where(html.exton-on) body.is-picking .picker { visibility: visible; pointer-events: auto; }
:where(html.exton-on) .picker__grid { position: relative; z-index: 4; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap); height: var(--tile-h); padding: var(--pad); padding-bottom: 0; }
:where(html.exton-on) .picker__slot { min-height: 0; }
:where(html.exton-on) .picker__slot[hidden] { display: none; }
:where(html.exton-on) .tile { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; color: var(--white); font-weight: 500; letter-spacing: -0.01em;
  transition: filter var(--t-tile) var(--ease-tile); -webkit-tap-highlight-color: transparent; }
:where(html.exton-on) .tile__panel { position: relative; flex: var(--tile-panel) 1 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto 1fr auto; align-items: start; padding: var(--tile-pad); background: var(--tile); }
:where(html.exton-on) .tile__mark { grid-area: 1 / 1; width: var(--tile-mark); max-width: none; }
:where(html.exton-on) .tile__name { grid-column: 2; grid-row: 1 / -1; align-self: end; justify-self: end; writing-mode: vertical-rl; transform: rotate(180deg); font-size: var(--tile-name); line-height: 1; letter-spacing: -0.02em; white-space: nowrap; }
:where(html.exton-on) .tile__blurb { grid-column: 1; grid-row: 3; align-self: end; max-width: 10.5vw; font-size: var(--tile-blurb); line-height: 1.35; color: #fff; opacity: 0.8; }
:where(html.exton-on) .tile__cover { position: relative; flex: 0 0 auto; width: 100%; height: 20svh; aspect-ratio: 1024 / 585; overflow: hidden; }
:where(html.exton-on) .tile__cover::after { content: ""; position: absolute; inset: 0; z-index: 2; opacity: 0; pointer-events: none; mix-blend-mode: soft-light;
  background: radial-gradient(120% 90% at 50% 45%, #ffffff52, #ffffff1a 38%, #fff0 70%); transition: opacity var(--t-tile) var(--ease-tile); }
:where(html.exton-on) .tile__cover img { width: 100%; height: 100%; object-fit: cover; filter: brightness(1) saturate(1);
  transition: transform var(--t-tile) var(--ease-tile), filter var(--t-tile) var(--ease-tile); }
:where(html.exton-on) .tile--light { --tile: var(--white); color: var(--navy); }
:where(html.exton-on) .tile--light .tile__panel { flex: 1 1 auto; }
:where(html.exton-on) .tile--light .tile__blurb { color: var(--navy); }
@media (hover: hover) {
  :where(html.exton-on) .tile:hover { filter: brightness(1.08); }
  :where(html.exton-on) .tile:hover .tile__cover img { transform: scale(1.045); filter: brightness(1.14) saturate(1.12); }
  :where(html.exton-on) .tile:hover .tile__cover::after { opacity: 1; }
  :where(html.exton-on) .tile--light:hover { filter: brightness(0.96); }
}
@media (min-width: 1025px) and (max-height: 949px) { :where(html.exton-on) .tile__blurb { max-width: 19svh; } }

@media (min-width: 1025px) { :where(html.exton-on) .tile__name { font-size: min(var(--tile-name), calc((55svh - var(--pad) - 2 * var(--tile-pad)) * 0.97 / var(--nw, 8))); } }
@media (min-width: 651px) and (max-width: 1024px) {
  :where(html.exton-on) .picker__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, 33.5svh); gap: 2svh; height: auto; padding: 3.6svh; padding-bottom: 0; }
  :where(html.exton-on) .tile__panel { flex: 1 1 0; padding: 1.7svh; }
  :where(html.exton-on) .tile__mark { width: 2.2svh; }
  :where(html.exton-on) .tile__name { writing-mode: horizontal-tb; transform: none; grid-row: 3; white-space: normal; line-height: 1.05; text-align: right; font-size: 2.8svh; }
  :where(html.exton-on) .tile__blurb { max-width: 58%; line-height: 1.3; font-size: 0.95svh; }
  :where(html.exton-on) .tile__cover { flex: 1 1 0; height: auto; aspect-ratio: auto; }
  :where(html.exton-on) .tile--light .tile__blurb { max-width: 62%; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .picker__grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(4, 18svh); height: auto; }
  :where(html.exton-on) .tile { flex-direction: row; height: 18svh; }
  :where(html.exton-on) .tile__panel { flex: 1.6 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: calc(var(--tile-pad) * 1.3); }
  :where(html.exton-on) .tile__mark { display: none; }
  :where(html.exton-on) .tile__name { writing-mode: horizontal-tb; transform: none; white-space: normal; align-self: flex-start; line-height: 1.05; }
  :where(html.exton-on) .tile__blurb { align-self: flex-start; max-width: 33.911vw; font-size: 3.271vw; line-height: 1.3; }
  :where(html.exton-on) .tile__cover { flex: 1 1 0; width: auto; height: 100%; aspect-ratio: auto; }
  :where(html.exton-on) .tile--light .tile__panel { flex: 1.6 1 0; }
  :where(html.exton-on) .tile--light .tile__blurb { max-width: 40vw; }
}


:where(html.exton-on) .drawer { --d-bg: var(--navy); --d-ink: var(--white); --d-scrim: color-mix(in srgb, var(--navy) 36%, transparent);
  position: fixed; inset: 0; z-index: 100010; visibility: hidden; pointer-events: none; }
:where(html.exton-on) body.drawer-open .drawer { visibility: visible; }
:where(html.exton-on) .drawer__scrim { position: fixed; inset: 0; background: var(--d-scrim); opacity: 0; pointer-events: none; }
:where(html.exton-on) body.drawer-open .drawer__scrim { pointer-events: auto; }
:where(html.exton-on) .drawer__panel { position: fixed; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; width: var(--drawer-w); padding: var(--drawer-pad);
  background: var(--d-bg); color: var(--d-ink); overflow: hidden; pointer-events: auto; visibility: hidden; }
:where(html.exton-on) .drawer__close { position: fixed; z-index: 2; display: inline-flex; align-items: center; justify-content: center; margin: 0; padding: 0; border: 0; background: transparent;
  color: var(--d-ink); cursor: pointer; line-height: 0; pointer-events: auto; }
:where(html.exton-on) .drawer__close:focus:not(:focus-visible) { outline: none; }
:where(html.exton-on) .drawer__links { display: flex; flex-direction: column; align-items: flex-start; gap: 0.08em; padding-top: calc(var(--action-h) + var(--drawer-pad) * 0.55); }
:where(html.exton-on) .drawer__links a { font: 600 var(--drawer-link) / 1.02 var(--f-serif); white-space: nowrap; -webkit-tap-highlight-color: transparent; }
:where(html.exton-on) .drawer__links a.rolls { display: inline-block; overflow: hidden; height: 1.08em; vertical-align: bottom; }
:where(html.exton-on) .drawer__links a.rolls > span { display: block; }
:where(html.exton-on) .drawer__links a.rolls i { display: inline-block; font-style: normal; }
:where(html.exton-on) .drawer__contact { display: flex; align-items: center; justify-content: space-between; gap: 1.5em; margin-top: calc(var(--drawer-pad) * 0.85); }
:where(html.exton-on) .drawer__contact a { display: inline-flex; align-items: center; gap: 0.55em; font-size: var(--drawer-contact); line-height: 1; white-space: nowrap; }
:where(html.exton-on) .roll-icon { display: block; width: 0.9em; overflow: hidden; line-height: 0; flex-shrink: 0; }
:where(html.exton-on) .roll-icon--wa { aspect-ratio: 20 / 19; }
:where(html.exton-on) .roll-icon--mail { aspect-ratio: 20 / 16; }
:where(html.exton-on) .roll-icon__track { --g: 0.5em; display: flex; flex-direction: column; gap: var(--g); transition: transform 0.68s cubic-bezier(0.16, 1, 0.3, 1); }
:where(html.exton-on) .roll-icon svg { display: block; width: 100%; height: auto; fill: currentColor; opacity: 0.9; }
@media (hover: hover) and (pointer: fine) { :where(html.exton-on) .drawer__contact a:hover .roll-icon__track { transform: translateY(calc(-50% - var(--g) / 2)); } }
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .drawer__links { padding-top: 0; gap: 0.32em; }
  :where(html.exton-on) .drawer__contact { margin-top: 0; padding-top: 15vw; padding-bottom: 5vw; }
  :where(html.exton-on) .drawer__close svg { width: calc(100% * 23 / 65); }
}
@media (max-width: 650px) and (orientation: portrait), (hover: none), (pointer: coarse) {
  :where(html.exton-on) .drawer__links a.rolls { height: auto; overflow: visible; }
  :where(html.exton-on) .drawer__links a.rolls > span + span { display: none; }
  :where(html.exton-on) .drawer__links a.rolls i { transform: none !important; }
}


:where(html.exton-on) .turn-device { display: none; }
@media (max-height: 650px) and (max-width: 1024px) and (orientation: landscape) {
  :where(html.exton-on) .turn-device { display: grid; position: fixed; inset: 0; z-index: 2147483000; place-items: center; margin: 0; padding: 5vw; background: var(--navy); color: var(--white);
    font: 500 18px / 1.35 var(--f-sans); letter-spacing: -0.01em; text-align: center; }
}


:where(html.exton-on) [data-category="hljod"] { --cat: var(--c-sea);   --cat-muted: var(--c-sea-muted);   --lead-max: 44vw; }
:where(html.exton-on) [data-category="svid"] { --cat: var(--c-green); --cat-muted: var(--c-green-muted); --lead-max: 35.9vw; }
:where(html.exton-on) [data-category="tjold"] { --cat: var(--c-urban); --cat-muted: var(--c-urban-muted); --lead-max: 40vw; }
:where(html.exton-on) [data-category="hljodfaeri"] { --cat: var(--c-rare);  --cat-muted: var(--c-rare-muted);  --lead-max: 35vw; }
:where(html.exton-on) [data-view="category"], :where(html.exton-on) [data-view="about"], :where(html.exton-on) body[data-page="category"], :where(html.exton-on) body[data-page="about"] {
  --sec-pad: calc(14vw * var(--s)); --sec-gap: calc(13vw * var(--s)); --facts-gap: calc(5vw * var(--s));       
  --slide-w: calc(52.083vw * var(--s)); --slide-h: calc(33.738vw * var(--s)); --slider-top: calc(5vw * var(--s)); --slider-bottom: calc(8vw * var(--s));
  --arrows-right: calc(12.5vw * var(--s)); --arrows-gap: calc(0.5vw * var(--s)); --arrow: calc(3.472vw * var(--s));
  --quote-max: calc(63vw * var(--s)); --quote-img: calc(12.674vw * var(--s)); --quote-gap: calc(4.282vw * var(--s));
  --intro-gap: calc(4.282vw * var(--s)); --rule-h: calc(4vw * var(--s)); --title-max: calc(40vw * var(--s)); --copy-max-cat: calc(25.013vw * var(--s));
  --fact-gap: calc(3vw * var(--s)); --cta-rule-gap: calc(2.604vw * var(--s)); --cta-link-gap: calc(4.282vw * var(--s));
  --next-gap: calc(1.638vw * var(--s)); --pill-y: calc(0.363vw * var(--s)); --pill-x: calc(0.8vw * var(--s)); --pill: calc(1.1vw * var(--s)); --next-title: calc(5.787vw * var(--s));
  --end-h: 110svh; --grow: 1.6; --grow-gap: 5.236vw; --hold: 5svh;                                             
  --lh-h2: 0.94; --ls-h2: -0.03em; --lh-h3: 0.92; --ls-h3: -0.05em;
  --ink: var(--white);
}
:where(html.exton-on) body[data-page="category"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--cat); color: var(--ink); } 
:where(html.exton-on) [data-view="about"], :where(html.exton-on) body[data-page="about"] { --cat: var(--navy); --cat-muted: var(--muted); }                                
:where(html.exton-on) body[data-page="about"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--white); color: var(--navy); }
html.exton-on:has(body:is([data-page="category"], [data-page="about"])) { height: auto; min-height: 100%; overflow-x: hidden; overflow-y: auto; }
html.exton-on:has(body:is([data-page="category"], [data-page="about"]).is-smooth) { overflow-y: hidden; }
html.exton-on:has(body:is([data-page="category"], [data-page="about"]).is-picking) { height: 100svh; overflow: hidden; }
:where(html.exton-on) body[data-page="category"] .shell { height: auto; min-height: 100svh; overflow: visible; background: var(--cat); }
:where(html.exton-on) body[data-page="about"] .shell { height: auto; min-height: 100svh; overflow: visible; background: var(--white); }
:where(html.exton-on) .page[data-view="category"] { height: auto; min-height: 100svh; overflow: visible; background: var(--cat); color: var(--white); }
:where(html.exton-on) .page[data-view="about"] { height: auto; min-height: 100svh; overflow: visible; background: var(--white); color: var(--navy); }
:where(html.exton-on) body.is-picking .page:is([data-view="category"], [data-view="about"]) { height: 100svh; min-height: 0; overflow: clip; }
:where(html.exton-on) :is([data-view="category"], [data-view="about"]) .frame { overflow: visible; }
:where(html.exton-on) :is([data-view="category"], [data-view="about"]) .dock, :where(html.exton-on) body:is([data-page="category"], [data-page="about"]) .shell > .dock { --fill: var(--white); --ink: var(--cat); --bg: var(--cat); bottom: 5vw; transition: bottom 0.4s ease; } 
:where(html.exton-on) body:is([data-page="category"], [data-page="about"]).past-hero .shell > .dock { --fill: var(--cat); --ink: var(--white); --bg: var(--white); bottom: var(--pad); }


:where(html.exton-on) .scene { position: relative; z-index: 0; width: 100%; background: var(--cat);
  height: calc(100svh + (var(--end-h) + var(--grow-gap)) * var(--grow) + var(--hold)); }
:where(html.exton-on) .scene > .frame { position: relative; z-index: 2; }
:where(html.exton-on) .scene__runway { position: relative; z-index: 1; width: 100%; pointer-events: none; }
:where(html.exton-on) .scene__grow { height: calc((var(--end-h) + var(--grow-gap)) * var(--grow)); }
:where(html.exton-on) .scene__hold { height: var(--hold); }
:where(html.exton-on) .page__main > .scene ~ * { position: relative; z-index: 1; }
:where(html.exton-on) .hero--category .hero__copy { width: min(var(--copy-w), calc(100vw - var(--pad) * 2)); max-width: none; }  
:where(html.exton-on) .hero--category .hero__lead { max-width: calc(var(--lead-max) * var(--s)); margin-inline: auto; line-height: var(--lh-body); }
:where(html.exton-on) .hero--category .hero__photo { will-change: width, height, transform; }


:where(html.exton-on) .intro { display: flex; flex-direction: column; align-items: center; gap: var(--intro-gap); padding-inline: var(--pad); text-align: center; }
:where(html.exton-on) .intro__rule, :where(html.exton-on) .cta__rule { display: block; width: 1px; height: var(--rule-h); background: var(--cat); opacity: 0.35; }
:where(html.exton-on) .intro__title, :where(html.exton-on) .cta__title, :where(html.exton-on) .wellness__title { max-width: var(--title-max); font: 600 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); font-feature-settings: "ss01" 1; color: var(--cat); }
:where(html.exton-on) .intro__title { text-transform: none; } 
:where(html.exton-on) .intro__text { max-width: var(--copy-max-cat); color: var(--cat-muted); }
:where(html.exton-on) .intro__title .line, :where(html.exton-on) .cta__title .line, :where(html.exton-on) .wellness__title .line, :where(html.exton-on) .quote__text .line, :where(html.exton-on) .fact__stat .line, :where(html.exton-on) .pullquote__text .line, :where(html.exton-on) .next__title .line { padding-bottom: 0.5vw; margin-bottom: -0.5vw; }  


:where(html.exton-on) .gallery { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
:where(html.exton-on) .carousel { position: relative; width: 100%; min-width: 0; margin-top: var(--slider-top); padding-bottom: var(--slider-bottom); overflow-x: clip; overscroll-behavior-x: contain; }
:where(html.exton-on) .carousel__viewport { display: grid; grid-template-columns: repeat(var(--cols), 1fr); column-gap: var(--gap); padding-inline: var(--pad); width: 100%; cursor: grab; touch-action: pan-y pinch-zoom; overscroll-behavior-x: contain; }
:where(html.exton-on) .carousel__viewport.is-dragging { cursor: grabbing; touch-action: none; }
:where(html.exton-on) .carousel__strip { grid-column: 1 / -1; display: flex; align-items: center; gap: var(--gap); rotate: -8deg; will-change: transform; }
:where(html.exton-on) .carousel__slide { flex: 0 0 var(--slide-w); width: var(--slide-w); min-width: var(--slide-w); rotate: 8deg; }
:where(html.exton-on) .carousel__slide img { width: 100%; height: var(--slide-h); object-fit: cover; background: #ffffff14; pointer-events: none; }
:where(html.exton-on) .carousel__nav { position: absolute; z-index: 2; right: var(--arrows-right); bottom: 0; display: flex; gap: var(--arrows-gap); }
:where(html.exton-on) .carousel__arrow { padding: 0; border: 0; background: none; cursor: pointer; line-height: 0; transition: opacity 0.25s ease, transform 0.25s ease; }

:where(html.exton-on) .carousel__arrow img { width: var(--arrow); height: var(--arrow); }
:where(html.exton-on) body.is-drag-scrolling, :where(html.exton-on) body.is-drag-scrolling * { cursor: grabbing !important; }


:where(html.exton-on) .outro, :where(html.exton-on) .proof { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
:where(html.exton-on) .ticker--outro { width: 100%; padding-bottom: 0; }
:where(html.exton-on) .ticker--outro .ticker__word { color: var(--cat); }
:where(html.exton-on) .quote { display: flex; flex-direction: column; align-items: center; gap: var(--quote-gap); max-width: var(--quote-max); margin: 0 auto; padding-inline: var(--pad); text-align: center; }
:where(html.exton-on) .quote__image { width: var(--quote-img); height: var(--quote-img); flex-shrink: 0; object-fit: cover; }
:where(html.exton-on) .quote__body { margin: 0; width: 100%; }
:where(html.exton-on) .quote__text { display: flow-root; font: 600 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); font-feature-settings: "ss01" 1; color: var(--cat); }
:where(html.exton-on) .quote__credit { display: flex; flex-direction: column; align-items: center; }
:where(html.exton-on) .quote__name, :where(html.exton-on) .quote__source { width: 100%; }
:where(html.exton-on) .quote__name { color: var(--cat); }
:where(html.exton-on) .quote__source { color: var(--cat-muted); }


:where(html.exton-on) .photo-break { position: relative; width: 100vw; max-width: 100vw; height: 120svh; margin-left: calc(50% - 50vw); overflow: hidden; }
:where(html.exton-on) .photo-break__window { width: 100%; height: 100%; overflow: hidden; }
:where(html.exton-on) .photo-break__window img { width: 100%; height: 100%; min-width: 100%; min-height: 100%; max-width: none; object-fit: cover; object-position: center; transform-origin: center; will-change: transform; }


:where(html.exton-on) .wellness { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); align-items: stretch; width: 100%; padding-inline: var(--pad); }
:where(html.exton-on) .wellness__copy { grid-column: 2 / 7; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--intro-gap); text-align: center; }
:where(html.exton-on) .wellness__title { max-width: 90%; }
:where(html.exton-on) .wellness__text { max-width: 27vw; color: var(--cat-muted); }
:where(html.exton-on) .wellness__figure { grid-column: calc(var(--cols) - 4) / var(--cols); overflow: hidden; aspect-ratio: 1078 / 1492; }
:where(html.exton-on) .wellness__figure img, :where(html.exton-on) .fact__figure img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
:where(html.exton-on) .facts { display: flex; flex-direction: column; gap: var(--facts-gap); width: 100%; padding-inline: var(--pad); }
:where(html.exton-on) .fact { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); align-items: stretch; }
:where(html.exton-on) .fact__figure { grid-column: 2 / 5; overflow: hidden; aspect-ratio: 708 / 908; }
:where(html.exton-on) .fact__copy { grid-column: calc(var(--cols) - 7) / calc(var(--cols) - 4); }
:where(html.exton-on) .fact--flip .fact__figure { grid-column: calc(var(--cols) - 3) / var(--cols); }
:where(html.exton-on) .fact--flip .fact__copy { grid-column: calc(var(--cols) - 6) / calc(var(--cols) - 3); }
:where(html.exton-on) .fact:nth-child(1) .fact__copy { align-self: start; }
:where(html.exton-on) .fact:nth-child(2) .fact__copy, :where(html.exton-on) .fact:nth-child(3) .fact__copy { align-self: center; }
:where(html.exton-on) .fact:nth-child(4) .fact__copy { align-self: end; }
:where(html.exton-on) .fact:nth-child(3) .fact__copy--end { align-self: end; }
:where(html.exton-on) [data-category="svid"] .fact:nth-child(4) .fact__copy { align-self: center; }
:where(html.exton-on) [data-category="svid"] .fact:nth-child(5) .fact__copy { align-self: end; }
:where(html.exton-on) .fact__stat { font-size: var(--t-h3); line-height: var(--lh-h3); letter-spacing: var(--ls-h3); color: var(--cat); }
:where(html.exton-on) .fact__text { margin-top: var(--fact-gap); color: var(--cat-muted); }
:where(html.exton-on) .pullquote { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); width: 100%; padding-inline: var(--pad); }
:where(html.exton-on) .pullquote blockquote, :where(html.exton-on) .pullquote__credit { grid-column: 2 / var(--cols); margin: 0; }
:where(html.exton-on) .pullquote__text { display: flow-root; font-size: var(--t-h3); line-height: 1; letter-spacing: -0.02em; color: var(--cat); text-align: left; }
:where(html.exton-on) .pullquote__mark { display: inline-block; padding-left: 10vw; }
:where(html.exton-on) .pullquote__credit { display: flex; flex-direction: column; align-items: flex-start; margin-top: var(--quote-gap); }


:where(html.exton-on) .cta { width: 100%; display: flex; flex-direction: column; align-items: center; padding-block: var(--sec-pad); background: var(--cat); color: var(--white); }
:where(html.exton-on) .cta__inner { display: flex; flex-direction: column; align-items: center; width: 100%; padding-inline: var(--pad); text-align: center; }
:where(html.exton-on) .cta__rule { margin-bottom: var(--cta-rule-gap); background: currentColor; }
:where(html.exton-on) .cta__title { color: inherit; }
:where(html.exton-on) .cta__link { margin-top: var(--cta-link-gap); font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
:where(html.exton-on) .cta__underline { position: relative; display: inline-flex; align-items: center; gap: 0.35em; color: var(--white); white-space: nowrap; } 
:where(html.exton-on) .cta__underline img { width: 0.576em; max-width: none; flex-shrink: 0; height: auto; filter: brightness(0) invert(1); transition: transform 0.65s var(--ease); }
:where(html.exton-on) .cta__underline::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor;
  transform: scaleX(var(--cta-line, 1)); transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
:where(html.exton-on) .cta__underline.is-drawing::after { transition: none; }
@media (hover: hover) {
  :where(html.exton-on) .cta__underline:hover::after, :where(html.exton-on) .cta__underline:focus-visible::after { transform: scaleX(0); transform-origin: 100% 50%; }
  :where(html.exton-on) .cta__underline:hover img { transform: translateX(0.2em); }
}


:where(html.exton-on) .next { position: relative; width: 100vw; max-width: 100vw; height: 50svh; min-height: 50svh; margin-left: calc(50% - 50vw); overflow: hidden; }
:where(html.exton-on) .next__window { width: 100%; height: 100%; overflow: hidden; }
:where(html.exton-on) .next__zoom { width: 100%; height: 100%; overflow: hidden; transform: scale(1); transform-origin: center; transition: transform var(--t-tile) var(--ease-tile); }
:where(html.exton-on) .next__drift { width: 100%; height: 100%; will-change: transform; }
:where(html.exton-on) .next__drift img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
:where(html.exton-on) .next__shade { position: absolute; inset: 0; background: #0003; pointer-events: none; transition: background-color var(--t-tile) var(--ease-tile); }
@media (hover: hover) {
  :where(html.exton-on) .next:hover .next__zoom { transform: scale(1.1); }
  :where(html.exton-on) .next:hover .next__shade { background-color: #0000001a; }
}
:where(html.exton-on) .next.is-leaving .next__shade { background-color: #0000001a; }
:where(html.exton-on) .next__link { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--next-gap); padding-inline: var(--pad); color: #fff; text-align: center; cursor: pointer; }
:where(html.exton-on) .next__pill { display: inline-flex; align-items: center; justify-content: center; padding: var(--pill-y) var(--pill-x); border: 1px solid currentColor; border-radius: 999px; font-size: var(--pill); font-weight: 400; line-height: 1; letter-spacing: -0.01em; }
:where(html.exton-on) .next__title { font-size: var(--next-title); font-weight: 500; line-height: 1.1; letter-spacing: -0.02em; overflow: visible; }
:where(html.exton-on) .next__text { font-size: var(--t-h6); font-weight: 400; line-height: 1.4; letter-spacing: -0.01em; }


:where(html.exton-on) .sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
:where(html.exton-on) .scene--about { --about-h: 100vw; height: var(--about-h); min-height: var(--about-h); overflow: hidden; background: transparent; }   
:where(html.exton-on) .backdrop { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
:where(html.exton-on) .backdrop__image { display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center; will-change: transform; }
:where(html.exton-on) .backdrop::after { content: ""; position: absolute; inset: 0; z-index: 1; background: #0000001a; }
:where(html.exton-on) .backdrop__shade { position: absolute; inset: 0; z-index: 2; background: #0b1219; opacity: 0; will-change: opacity; }
@media (max-width: 1024px) { :where(html.exton-on) .scene--about { --about-h: max(200vw, 150svh); } :where(html.exton-on) .backdrop__image { object-position: 20% center; } } 
:where(html.exton-on) .scene--about > .frame--over { position: absolute; top: 0; left: 0; right: 0; z-index: 1; height: 100%; max-height: 100svh; color: var(--white); }
:where(html.exton-on) .frame--over .ticker__word { color: var(--white); }
:where(html.exton-on) .hero--about::after { content: none; } 

:where(html.exton-on) .statement { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: auto auto; column-gap: var(--gap);
  row-gap: clamp(2rem, 5vw, 4.5rem); width: 100%; padding: var(--sec-pad) var(--pad); }                                          
:where(html.exton-on) .statement__label { grid-column: 1 / 3; grid-row: 1; align-self: start; margin-top: 0.3vw; }
:where(html.exton-on) .statement__title { grid-column: 3 / -1; grid-row: 1; font: 500 clamp(2rem, 3.7vw, 4rem) / 1.1 var(--f-sans); letter-spacing: -0.035em; color: var(--navy); }
:where(html.exton-on) .statement__lead { display: inline-block; margin-left: 20vw; }
:where(html.exton-on) .statement--second { grid-template-rows: auto; row-gap: 0; }
:where(html.exton-on) .statement--second .statement__title { padding-right: 7vw; }
:where(html.exton-on) .statement--second .statement__lead { margin-left: 10vw; }
:where(html.exton-on) .outro > .statement--last { padding-top: calc(var(--sec-pad) * 0.35); padding-bottom: 0; }
:where(html.exton-on) .statement__title .line:first-child { overflow: visible; }

:where(html.exton-on) .film { position: relative; width: 100%; background: var(--white); }
:where(html.exton-on) .film { --span: 4; }
:where(html.exton-on) .film__card { grid-column: calc(var(--cols) - var(--span) + 1) / -1; grid-row: 2; align-self: start; width: 100%; aspect-ratio: 1.47; } 
:where(html.exton-on) .film__frame { width: 100%; height: 100%; overflow: hidden; }
:where(html.exton-on) .film__frame.is-live { position: absolute; z-index: 50; margin: 0; }                                                              
:where(html.exton-on) .film__button { position: relative; display: block; width: 100%; height: 100%; margin: 0; padding: 0; border: 0; background: none; cursor: pointer; line-height: 0; font-size: 13.3333px; }
:where(html.exton-on) .film__stack { position: absolute; inset: 0; display: block; }
:where(html.exton-on) .film__still, :where(html.exton-on) .film__movie { position: absolute; inset: 0; display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center; }
:where(html.exton-on) .film__movie { opacity: 0; }
:where(html.exton-on) .film__play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
:where(html.exton-on) .film__disc { display: flex; align-items: center; justify-content: center; width: 4.3vw; height: 4.3vw; border-radius: 50%; background: #ffffffe0; color: var(--navy); }
:where(html.exton-on) .film__disc svg { width: 0.9em; height: auto; margin-left: 0.12em; fill: currentColor; }
:where(html.exton-on) .film__runway { width: 100%; height: 120svh; background: var(--white); }                                                           

:where(html.exton-on) .outro--about .ticker--outro .ticker__word { color: var(--navy); }
:where(html.exton-on) .outro--about .quote { gap: var(--quote-gap); }
:where(html.exton-on) .fact__index { font-size: 80%; color: var(--cat); }
:where(html.exton-on) .outro--about .fact__copy { display: flex; flex-direction: column; gap: var(--fact-gap); }                                          
:where(html.exton-on) .outro--about .fact__copy > * { margin: 0; }
:where(html.exton-on) .page[data-view="about"] .cta__title { max-width: 9em; }                                                                            


:where(html.exton-on) .cursor.is-play { mix-blend-mode: normal; }
:where(html.exton-on) .cursor.is-play .cursor__disc::before { border: 0; background: color-mix(in srgb, var(--navy) 95%, transparent); }
:where(html.exton-on) .cursor.is-play .cursor__disc::after { content: none; }
:where(html.exton-on) .cursor__words { position: absolute; inset: 0; display: none; overflow: hidden; border-radius: 50%; }
:where(html.exton-on) .cursor.is-play .cursor__words { display: block; }
:where(html.exton-on) .cursor__word { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: 500 0.8vw / 1 var(--f-sans); letter-spacing: 0.02em; color: #fff; transform: translateY(100%); }
:where(html.exton-on) .cursor.is-play:not(.is-playing) .cursor__word--play, :where(html.exton-on) .cursor.is-play.is-playing .cursor__word--stop { transform: translateY(0); }
:where(html.exton-on) .cursor.is-play.is-playing .cursor__word--play { transform: translateY(-100%); }
:where(html.exton-on) .cursor.to-stop .cursor__word--play, :where(html.exton-on) .cursor.to-play .cursor__word--stop { animation: exton-word-out var(--in) var(--c-ease) forwards; }
:where(html.exton-on) .cursor.to-stop .cursor__word--stop, :where(html.exton-on) .cursor.to-play .cursor__word--play { animation: exton-word-in var(--in) var(--c-ease) forwards; }
@keyframes exton-word-out { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@keyframes exton-word-in { from { transform: translateY(100%); } to { transform: translateY(0); } }

@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { :where(html.exton-on) .film { --span: 3; } }
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { :where(html.exton-on) .lost { padding-top: calc(var(--gap) * 1.5); } } 
@media (max-width: 650px) and (orientation: portrait) {                                                                              
  :where(html.exton-on) .statement, :where(html.exton-on) .statement--second { grid-template-rows: none; row-gap: calc(var(--gap) * 2); padding-block: calc(var(--pad) * 1.25); }
  :where(html.exton-on) .statement__label, :where(html.exton-on) .statement__title { grid-column: 1 / -1; grid-row: auto; }
  :where(html.exton-on) .statement__title { font-size: clamp(2rem, 9vw, 2.9rem); line-height: 1.1; }
  :where(html.exton-on) .statement__lead, :where(html.exton-on) .statement--second .statement__lead { margin-left: 0; }
  :where(html.exton-on) .statement--second .statement__title { padding-right: 0; }
  :where(html.exton-on) .film { --span: 3; }
  :where(html.exton-on) .film__card { grid-row: auto; justify-self: stretch; margin-top: calc(var(--gap) * 2); }
  :where(html.exton-on) .film__disc { width: 14vw; height: 14vw; }
  :where(html.exton-on) .page[data-view="about"] .cta__title { max-width: 9em; }
}


:root {
  --field: calc(0.99vw * var(--s)); --field-pad: calc(1.08vw * var(--s)); --tick: calc(0.855vw * var(--s)); --send: calc(0.99vw * var(--s));
  --form-gap: calc(0.45vw * var(--s)); --ta: calc(3.2vw * var(--s)); --label-gap: calc(0.675vw * var(--s)); --foot-top: calc(0.9vw * var(--s));
  --msg: calc(1.08vw * var(--s)); --ov-w: calc(35vw * var(--s)); --ov-pad: calc(3.6vw * var(--s)); --ov-title: calc(1.98vw * var(--s));
  --ov-gap: calc(2.5vw * var(--s)); --ov-slide: calc(18vw * var(--s)); --ov-close: calc(2.25vw * var(--s)); --ov-hit: calc(2.7vw * var(--s));
  --ov-shift: calc(2.25vw * var(--s)); --ov-dur: 0.8s; --scrim: #0C112573;
}
@media (max-width: 650px) and (orientation: portrait) {
  :root { --field: clamp(1rem, 4.25vw, 1.125rem); --tick: clamp(0.875rem, 3.6vw, 0.95rem); --send: clamp(1rem, 4.25vw, 1.125rem); --ov-title: clamp(1.35rem, 6vw, 1.75rem);
    --ov-pad: var(--pad); --ov-close: clamp(2rem, 8.5vw, 2.5rem); --ov-slide: calc(var(--ov-w) * 18 / 31.5); --msg: clamp(0.95rem, 4vw, 1.1rem); }
}
:where(html.exton-on) [data-view="contact"], :where(html.exton-on) [data-view="404"], :where(html.exton-on) body:is([data-page="contact"], [data-page="404"]) { --cat: var(--navy); --cat-muted: var(--muted); }
:where(html.exton-on) body:is([data-page="contact"], [data-page="404"]) { background: var(--white); color: var(--navy); }
:where(html.exton-on) .page--desk { background: var(--white); color: var(--navy); }
:where(html.exton-on) .desk { position: relative; height: 100svh; max-height: 100svh; overflow: hidden; }                                   
:where(html.exton-on) .desk__grid { position: relative; z-index: 1; grid-template-rows: auto minmax(0, 1fr); }                           
:where(html.exton-on) .desk__left, :where(html.exton-on) .desk__stack, :where(html.exton-on) .desk__aside { padding-top: calc(var(--gap) * 0.5); }
:where(html.exton-on) .desk__left { grid-column: 1 / 7; grid-row: 2; min-height: 0; pointer-events: none; }
:where(html.exton-on) .desk__stack, :where(html.exton-on) .desk__aside { grid-row: 2; align-self: end; min-height: 0; max-height: 100%; padding-top: 0; padding-bottom: calc(var(--gap) * 0.75); } 
:where(html.exton-on) .desk__stack { grid-column: 6 / 9; display: flex; flex-direction: column; align-items: flex-start; gap: calc(5vw * var(--s)); width: 100%; margin-left: -3.8vw; pointer-events: none; } 
:where(html.exton-on) .desk__stack > :not(.desk__spin) { pointer-events: auto; }
:where(html.exton-on) .desk__aside { grid-column: 9 / 13; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: var(--ov-gap); width: 100%; }


:where(html.exton-on) .desk__spin { position: fixed; top: 0; left: 15vw; z-index: 0; pointer-events: none; transform: rotate(90deg); transform-origin: top left; }
:where(html.exton-on) .ticker--desk { position: relative; top: -12vw; width: 100vw; padding: 0; rotate: 180deg; }
:where(html.exton-on) .ticker--desk .ticker__word { color: var(--navy); }
:where(html.exton-on) .desk__heading { width: 100%; font-size: var(--t-hero); font-weight: 400; line-height: 1.3; letter-spacing: -0.01em; color: var(--navy); }   
:where(html.exton-on) .desk__channels { display: flex; flex-direction: column; align-items: flex-start; gap: calc(var(--gap) * 1.2); width: 100%; }
:where(html.exton-on) .channel { display: flex; flex-direction: column; gap: 0.35em; width: 100%; min-width: 0; }
:where(html.exton-on) .channel__label { font-size: calc(var(--field) * 1.18); font-weight: 500; line-height: 1.2; color: var(--navy); }
:where(html.exton-on) .channel__value { position: relative; display: inline-flex; align-self: flex-start; width: fit-content; max-width: 100%; margin: 0; padding: 0; border: 0; background: none;
  font: 400 var(--field) / 1.35 var(--f-sans); letter-spacing: -0.01em; color: var(--muted); text-align: left; cursor: pointer; -webkit-appearance: none; appearance: none; }
:where(html.exton-on) .channel__value::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform: scaleX(0); transform-origin: 100% 50%;
  transition: transform 0.65s var(--ease), opacity 0.2s ease; }
:where(html.exton-on) .channel__value:focus-visible::after { transform: scaleX(1); transform-origin: 0% 50%; }
:where(html.exton-on) .channel__text { transition: opacity 0.2s ease; }
:where(html.exton-on) .channel__done { position: absolute; left: 0; top: 50%; z-index: 1; display: inline-flex; align-items: center; gap: 0.4em; padding: 0.2em 0.55em; white-space: nowrap; pointer-events: none;
  transform: translateY(-50%); opacity: 0; background: var(--navy); color: #fff; font: 400 var(--field) / 1.35 var(--f-sans); transition: opacity 0.2s ease; }     
:where(html.exton-on) .channel__tick { width: 0.95em; height: 0.95em; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
:where(html.exton-on) button.channel__value { letter-spacing: normal; }
:where(html.exton-on) .channel__copy.is-copied .channel__text, :where(html.exton-on) .channel__copy.is-copied::after { opacity: 0; }
:where(html.exton-on) .channel__copy.is-copied .channel__done { opacity: 1; }


:where(html.exton-on) .enquiry { display: flex; flex-direction: column; gap: var(--ov-gap); width: 100%; min-height: 0; max-height: 100%; overscroll-behavior: contain; scrollbar-width: none; }
:where(html.exton-on) .enquiry::-webkit-scrollbar { display: none; }
:where(html.exton-on) .enquiry__tabs { display: flex; width: 100%; margin-bottom: calc(var(--form-gap) * 0.35); border-bottom: 1px solid rgba(22, 35, 46, 0.18); }
:where(html.exton-on) .enquiry__tab { position: relative; flex: 1 1 0; margin: 0; padding: 0.7em 0.4em 0.85em; border: 0; background: transparent; color: var(--muted);
  font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; text-align: center; cursor: pointer; transition: color 0.25s var(--ease), opacity 0.25s var(--ease); }
:where(html.exton-on) .enquiry__tab::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--navy); transform: scaleX(0); transform-origin: center;
  transition: transform 0.5s var(--ease), opacity 0.5s var(--ease); }
:where(html.exton-on) .enquiry__tab.is-active { color: var(--navy); }
:where(html.exton-on) .enquiry__tab.is-active { cursor: default; }
:where(html.exton-on) .enquiry__tab.is-active::after { transform: scaleX(1); }

:where(html.exton-on) .enquiry__panels { position: relative; width: 100%; }
:where(html.exton-on) .enquiry__form { display: flex; flex-direction: column; gap: var(--form-gap); width: 100%; }
:where(html.exton-on) .enquiry__form.is-active { position: relative; z-index: 1; }
:where(html.exton-on) .enquiry__form.is-leaving { position: absolute; left: 0; right: 0; top: 0; z-index: 2; pointer-events: none; }
:where(html.exton-on) .enquiry__form[hidden] { display: none; }
:where(html.exton-on) .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--form-gap) * 2.5); align-items: end; }
:where(html.exton-on) .field-row > .field { min-width: 0; }
:where(html.exton-on) .enquiry :is(input:not([type="checkbox"]), select, textarea) { width: 100%; margin: 0; padding: var(--field-pad) 0; border: 0; border-bottom: 1px solid rgba(22, 35, 46, 0.25); border-radius: 0;
  background-color: transparent; color: var(--navy); font: 400 var(--field) / normal var(--f-sans); outline: none; transition: border-color 0.3s ease; user-select: text; -webkit-user-select: text; }
:where(html.exton-on) .enquiry :is(input, select, textarea):focus { border-bottom-color: var(--navy); }
:where(html.exton-on) .enquiry :is(input, textarea)::placeholder { color: var(--muted); opacity: 1; }
:where(html.exton-on) .enquiry textarea { height: calc(var(--ta) * 2); min-height: calc(var(--ta) * 2); max-height: calc(var(--ta) * 2); line-height: 1.45; resize: none; }
:where(html.exton-on) .enquiry select { -webkit-appearance: none; appearance: none; padding-right: 1.8em; cursor: pointer;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%230C1125' d='M1 4h10L6 9z'/%3E%3C/svg%3E") right center / 0.64em no-repeat; }
:where(html.exton-on) .enquiry select:invalid, :where(html.exton-on) .enquiry select:has(> option[value=""]:checked) { color: var(--muted); }
:where(html.exton-on) .consent { display: flex; flex-direction: column; gap: 0.85em; margin-top: var(--form-gap); }
:where(html.exton-on) .consent__label { display: flex; align-items: flex-start; gap: var(--label-gap); font: 500 var(--tick) / 1.45 var(--f-sans); color: var(--muted); cursor: pointer; }
:where(html.exton-on) .consent__label input { width: 1.16em; height: 1.16em; min-width: 13px; min-height: 13px; margin: 0.158em 0 0; flex-shrink: 0; accent-color: var(--navy); cursor: pointer; }
:where(html.exton-on) .consent__text { display: block; flex: 1; min-width: 0; }
:where(html.exton-on) .consent__policy { position: relative; display: inline; margin: 0; padding: 0; border: 0; background: none; font: inherit; letter-spacing: inherit; color: inherit; cursor: pointer; vertical-align: baseline; }
:where(html.exton-on) .consent__policy::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0.08em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }

:where(html.exton-on) .enquiry__foot { display: flex; align-items: center; justify-content: space-between; margin-top: var(--foot-top); }
:where(html.exton-on) .enquiry__send { display: inline-flex; align-items: center; justify-content: center; width: fit-content; margin: 0; padding: 0.85em 1.6em; border: 1px solid var(--navy); cursor: pointer;
  font: 500 var(--send) / normal var(--f-sans); color: var(--white); background: transparent linear-gradient(90deg, transparent 50%, var(--navy) 50%) 100% 0 / 200% 100%;
  transition: background-position 0.75s var(--ease), color 0.75s var(--ease); -webkit-appearance: none; appearance: none; }

:where(html.exton-on) .enquiry__send:disabled { opacity: 0.55; cursor: wait; pointer-events: none; }
:where(html.exton-on) .enquiry__error { font-size: var(--msg); color: #8b2e2e; }


:where(html.exton-on) .lost { display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: calc(var(--gap) * 1.5); width: 100%; min-height: 0; padding-bottom: calc(var(--gap) * 0.25); }
:where(html.exton-on) .lost__code { font: 700 clamp(4.5rem, 14vw, 9rem) / 0.9 var(--f-serif); letter-spacing: -0.04em; color: color-mix(in srgb, var(--navy) 14%, transparent); }
:where(html.exton-on) .lost__text { max-width: 22em; font-size: var(--t-hero); font-weight: 400; line-height: 1.45; letter-spacing: -0.01em; color: var(--muted); }


:where(html.exton-on) body:not(.is-ready) :is(.enquiry__tabs, #enquiry-investors > div, .channel, .desk__heading, .lost) { visibility: hidden; }


:where(html.exton-on) .panel { position: fixed; inset: 0; z-index: 2147483647; display: flex; justify-content: flex-end; visibility: hidden; pointer-events: none; transition: visibility var(--ov-dur); }
:where(html.exton-on) .panel::before { content: ""; position: fixed; inset: 0; z-index: -1; background: var(--scrim); opacity: 0; transition: opacity var(--ov-dur) var(--ease); }
:where(html.exton-on) .panel.is-open { visibility: visible; pointer-events: auto; }
:where(html.exton-on) .panel.is-open::before { opacity: 1; }
:where(html.exton-on) .panel__sheet { position: relative; display: flex; flex-direction: column; width: min(100%, calc(52vw * var(--s))); max-width: 100%; height: 100%; padding: var(--ov-pad); overflow: hidden auto;
  overscroll-behavior: contain; scrollbar-width: none; background: var(--white); clip-path: inset(0 0 0 100%); transition: clip-path var(--ov-dur) var(--ease); }
:where(html.exton-on) .panel__sheet::-webkit-scrollbar { display: none; }
:where(html.exton-on) .panel.is-open .panel__sheet { clip-path: inset(0 0 0 0%); }
:where(html.exton-on) .panel__inner { position: relative; right: calc(-1 * var(--ov-slide)); display: flex; flex: 1; flex-direction: column; gap: var(--ov-gap); transition: right var(--ov-dur) var(--ease); }
:where(html.exton-on) .panel.is-open .panel__inner { right: 0; }
:where(html.exton-on) .panel__close { position: absolute; top: 0; right: 0; z-index: 2; display: flex; align-items: center; justify-content: center; width: var(--ov-hit); height: var(--ov-hit); min-width: 36px; min-height: 36px;
  margin: 0; padding: 0; border: 0; background: var(--white); color: var(--navy); font: 400 var(--ov-close) / 1 var(--f-sans); cursor: pointer;
  transform: translate(var(--ov-slide)); transition: opacity 0.25s var(--ease), transform var(--ov-dur) var(--ease); }
:where(html.exton-on) .panel.is-open .panel__close { transform: translate(0); }

:where(html.exton-on) .panel__title { margin-top: 0.2vw; font-size: var(--ov-title); line-height: 1.25; letter-spacing: -0.01em; color: var(--navy); }
:where(html.exton-on) .panel__body { display: flex; flex-direction: column; gap: 0.35em; font: 400 var(--field) / 1.35 var(--f-sans); color: var(--muted); }
:where(html.exton-on) .panel__body, :where(html.exton-on) .panel__body * { user-select: text; -webkit-user-select: text; }
:where(html.exton-on) .panel__body p { font-size: var(--field); line-height: 1.35; }
:where(html.exton-on) .panel__body h4 { margin: calc(var(--gap) * 1.2) 0 0; font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; color: var(--navy); }
:where(html.exton-on) .panel__body p:first-child + h4 { margin-top: calc(var(--gap) * 0.6); }
:where(html.exton-on) .panel__body h5 { margin: calc(var(--gap) * 0.5) 0; font: 500 calc(var(--field) * 1.18) / 1.2 var(--f-sans); letter-spacing: normal; color: var(--navy); }
:where(html.exton-on) .panel__body b { font-weight: 500; }
:where(html.exton-on) .panel__body a { color: inherit; text-decoration: underline; cursor: pointer; }


:where(html.exton-on) .thanks { --tw: 30vw; position: fixed; inset: 0; z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: var(--pad); visibility: hidden; pointer-events: none; transition: visibility var(--ov-dur); }
:where(html.exton-on) .thanks__scrim { position: fixed; inset: 0; background: var(--scrim); opacity: 0; transition: opacity var(--ov-dur) var(--ease); }
:where(html.exton-on) .thanks__card { position: relative; z-index: 1; width: var(--tw); padding: calc(var(--ov-pad) * 1.35) calc(var(--ov-pad) * 1.1); background: var(--navy); color: var(--white); text-align: center;
  opacity: 0; transform: translateY(1.15rem) scale(0.985); transition: opacity var(--ov-dur) var(--ease), transform var(--ov-dur) var(--ease); }
:where(html.exton-on) .thanks.is-open { visibility: visible; pointer-events: auto; }
:where(html.exton-on) .thanks.is-open .thanks__scrim { opacity: 1; }
:where(html.exton-on) .thanks.is-open .thanks__card { opacity: 1; transform: none; }
:where(html.exton-on) .thanks__body { display: flex; flex-direction: column; align-items: center; gap: calc(var(--ov-gap) * 0.85); }
:where(html.exton-on) .thanks__title { font: 650 clamp(2.35rem, calc(var(--ov-title) * 2.15), 3.75rem) / 1.02 var(--f-serif); letter-spacing: -0.02em; color: var(--white); }
:where(html.exton-on) .thanks__text { font-size: calc(var(--field) * 1.05); line-height: 1.35; color: #c5dcf0; }
:where(html.exton-on) .thanks__more { margin: calc(var(--ov-gap) * 0.35) 0 0; font: 400 calc(var(--t-h4) * 0.72) / 1.35 var(--f-sans); letter-spacing: -0.01em; color: var(--white); }
:where(html.exton-on) .thanks__more button { position: relative; display: inline-flex; align-items: center; gap: 0.35em; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(html.exton-on) .thanks__more button::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
:where(html.exton-on) .thanks__more img { width: 0.576em; height: auto; filter: brightness(0) invert(1); }
@media (hover: hover) { :where(html.exton-on) .thanks__more button:hover::after { transform: scaleX(0); transform-origin: 100% 50%; } }

:where(html.exton-on) .desk .dock { display: none; } 

@media (max-width: 1024px) {
  html.exton-on:has(body:is([data-page="contact"], [data-page="404"])), :where(html.exton-on) body:is([data-page="contact"], [data-page="404"]) { height: auto; min-height: 100svh; overflow-x: hidden; overflow-y: auto; }
  html.exton-on:has(body:is([data-page="contact"], [data-page="404"]).is-smooth) { overflow-y: hidden; }
  :where(html.exton-on) body:is([data-page="contact"], [data-page="404"]) .shell, :where(html.exton-on) .page--desk, :where(html.exton-on) .page--desk .desk, :where(html.exton-on) .desk__grid { height: auto; max-height: none; min-height: 100svh; overflow: visible; }
  :where(html.exton-on) .desk__grid { grid-template-rows: auto auto auto; }
  :where(html.exton-on) .desk .dock { display: inline-flex; }
  :where(html.exton-on) .desk__left { grid-column: 1 / -1; grid-row: auto; height: auto; display: flex; flex-direction: column; align-items: center; text-align: center; } 
  :where(html.exton-on) .desk__stack { grid-column: 1 / -1; grid-row: auto; align-self: stretch; max-height: none; margin-left: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr;
    column-gap: calc(var(--gap) * 2); row-gap: calc(var(--gap) * 2); align-items: start; }
  :where(html.exton-on) .desk__spin { grid-column: 1 / -1; position: relative; top: auto; left: auto; width: 100vw; margin-inline: calc(-1 * var(--pad)); transform: none; }
  :where(html.exton-on) .ticker--desk { top: 0; rotate: none; }
  :where(html.exton-on) .desk__heading { grid-column: 1; grid-row: 2; align-self: start; }
  :where(html.exton-on) .desk__channels { grid-column: 2; grid-row: 2; }
  :where(html.exton-on) .desk__aside { grid-column: 1 / -1; grid-row: auto; align-self: auto; max-height: none; padding-bottom: 0; margin-top: calc(var(--gap) * 2); justify-content: flex-start; }
  :where(html.exton-on) .enquiry { max-height: none; }
  :where(html.exton-on) .field-row { grid-template-columns: 1fr; gap: var(--form-gap); }
}
@media (max-width: 650px) and (orientation: portrait) {                                                             
  :where(html.exton-on) .desk__grid { grid-template-rows: auto auto auto auto; }
  :where(html.exton-on) .enquiry :is(input:not([type="checkbox"]), select, textarea) { font-size: max(var(--field), 16px); }
  :where(html.exton-on) .consent { padding: 5vw 0; }
  :where(html.exton-on) .consent__label { padding: 0; }
  :where(html.exton-on) .enquiry__send { padding: 0.75em 1.4em; }
  :where(html.exton-on) .thanks { --tw: min(100%, calc(100vw - var(--pad) * 2)); }
  :where(html.exton-on) .thanks__more { font-size: calc(var(--t-h4) * 0.85); }
  :where(html.exton-on) .thanks__card { padding: calc(var(--ov-pad) * 1.45) var(--ov-pad); }
}


html.exton-on:has(body.is-routing), :where(html.exton-on) body.is-routing { height: 100svh; overflow: hidden; }
:where(html.exton-on) body.is-routing .shell { height: 100svh; min-height: 0; overflow: hidden; }
:where(html.exton-on) body.is-routing * { cursor: default; }
:where(html.exton-on) body.is-routing :is(a[href], button, .tile, .next__link) { cursor: pointer; }
:where(html.exton-on) body.is-sliding, :where(html.exton-on) body.is-sliding .shell { background: var(--swap-bg); color: var(--navy); }
:where(html.exton-on) .page.is-incoming, :where(html.exton-on) body.is-picking .page.is-incoming { z-index: 6; pointer-events: none; will-change: transform, clip-path; }
:where(html.exton-on) .page.is-outgoing { z-index: 3; pointer-events: none; }
:where(html.exton-on) .route-backdrop { position: fixed; inset: 0; z-index: 1; background: var(--swap-bg); opacity: 0; pointer-events: none; }
:where(html.exton-on) .route-backdrop--next { background: var(--cat, var(--navy)); opacity: 1; }
:where(html.exton-on) .route-separator { position: fixed; inset: 0; z-index: 5; background: #000; opacity: 0; pointer-events: none; }
:where(html.exton-on) .route-separator--swap { inset: auto 0 0 0; width: 100%; height: 100svh; will-change: transform, opacity; }
:where(html.exton-on) .route-flight { position: fixed; z-index: 110; margin: 0; padding: 0; overflow: hidden; pointer-events: none; }
:where(html.exton-on) .route-flight > *, :where(html.exton-on) .route-flight img { width: 100%; height: 100%; object-fit: cover; }
:where(html.exton-on) .next.is-leaving { margin-left: 0; max-width: none; pointer-events: none; }
:where(html.exton-on) .next.is-leaving .line { overflow: visible; padding-bottom: 0.14em; margin-bottom: -0.14em; }


:where(html.exton-on) .scrollbar { position: fixed; z-index: 9999; top: 0; right: 0; bottom: 0; width: 11px; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
:where(html.exton-on) .scrollbar.is-visible { opacity: 1; pointer-events: auto; }
:where(html.exton-on) .scrollbar__track { position: absolute; inset: 0; pointer-events: auto; }
:where(html.exton-on) .scrollbar__thumb { --tc: var(--cat-muted, var(--muted)); position: absolute; left: 1px; right: 1px; min-height: 40px; border-radius: 5px; cursor: grab; pointer-events: auto;
  background: color-mix(in srgb, var(--tc) 72%, transparent); transition: background 0.15s ease; }
:where(html.exton-on) .scrollbar__thumb:hover { background: color-mix(in srgb, var(--tc) 85%, transparent); }
:where(html.exton-on) .scrollbar__thumb:active { cursor: grabbing; background: color-mix(in srgb, var(--tc) 92%, transparent); }
@media (hover: none), (max-width: 768px) { :where(html.exton-on) .scrollbar { display: none !important; } }


:where(html.exton-on) .cursor, :where(html.exton-on) .ring { position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 100000; pointer-events: none; will-change: transform;
  --in: 0.5s; --out: 0.75s; --c-ease: cubic-bezier(0.15, 0.32, 0.2, 0.99); }
:where(html.exton-on) .cursor { mix-blend-mode: difference; transform: translate3d(var(--x, -100px), var(--y, -100px), 0); }
:where(html.exton-on) .cursor__disc, :where(html.exton-on) .ring__disc { position: absolute; left: 0; top: 0; width: 6vw; height: 6vw; border-radius: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0);
  transition: opacity var(--in) ease, transform var(--in) var(--c-ease); }
:where(html.exton-on) .cursor__disc::before { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid #fff; }
:where(html.exton-on) .cursor__disc::after { content: "\2195"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5vw; line-height: 1; color: #fff; }
:where(html.exton-on) .cursor.is-on .cursor__disc, :where(html.exton-on) .ring.is-on .ring__disc { opacity: 1; transform: translate(-50%, -50%) scale(1); }
:where(html.exton-on) .cursor.is-off .cursor__disc, :where(html.exton-on) .ring.is-off .ring__disc { opacity: 0; transform: translate(-50%, -50%) scale(0); transition: opacity var(--out) ease, transform var(--out) var(--c-ease); }
:where(html.exton-on) .ring { --size: 6vw; --stroke: 1.5px; transform: translate3d(var(--x, -100px), var(--y, -100px), 0); }
:where(html.exton-on) .ring__disc { width: var(--size); height: var(--size); mix-blend-mode: difference; }
:where(html.exton-on) .ring__disc::before { content: ""; position: absolute; inset: 0; border-radius: 50%; border: var(--stroke) solid rgba(255, 255, 255, 0.28); }
:where(html.exton-on) .ring__fill { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from -90deg, #fff var(--p, 0%), transparent 0);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--stroke)), #000 calc(100% - var(--stroke)));
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--stroke)), #000 calc(100% - var(--stroke))); }
:where(html.exton-on) .ring__label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 22%; font-size: 0.8vw; font-weight: 500; line-height: 1; letter-spacing: 0.02em;
  color: #fff; white-space: nowrap; opacity: 0; mix-blend-mode: difference; transition: opacity var(--in) ease; }
:where(html.exton-on) .ring.is-on .ring__label { opacity: 0.95; }
:where(html.exton-on) .ring.is-off .ring__label { opacity: 0; transition: opacity var(--out) ease; }
@media (hover: none) { :where(html.exton-on) .cursor { display: none; } }

@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) {
  :where(html.exton-on) [data-view="category"] .hero__copy { bottom: 5svh; }
  :where(html.exton-on) .fact__stat { font-size: calc(var(--t-h3) * 0.85); } 
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) [data-view="category"], :where(html.exton-on) body[data-page="category"] { --grow: 1.2; }
  :where(html.exton-on) :is([data-view="category"], [data-view="about"]) .dock, :where(html.exton-on) body:is([data-page="category"], [data-page="about"]) .shell > .dock { bottom: calc(4vw + env(safe-area-inset-bottom, 0px)) !important; }
  :where(html.exton-on) body:is([data-page="category"], [data-page="about"]).past-hero .shell > .dock { bottom: calc(4vw + env(safe-area-inset-bottom, 0px)) !important; }
  :where(html.exton-on) .intro__title, :where(html.exton-on) .cta__title, :where(html.exton-on) .wellness__title { max-width: 88vw; }
  :where(html.exton-on) .intro__text, :where(html.exton-on) .wellness__text, :where(html.exton-on) .next__text { max-width: 82vw; }
  :where(html.exton-on) .intro__title .line, :where(html.exton-on) .cta__title .line, :where(html.exton-on) .wellness__title .line, :where(html.exton-on) .quote__text .line, :where(html.exton-on) .fact__stat .line, :where(html.exton-on) .pullquote__text .line, :where(html.exton-on) .next__title .line { padding-bottom: calc(0.5vw * 2.25); margin-bottom: calc(-0.5vw * 2.25); }
  :where(html.exton-on) .wellness { display: flex; flex-direction: column-reverse; align-items: stretch; }
  :where(html.exton-on) .wellness__figure { width: 100%; margin: 0 auto; }
  :where(html.exton-on) .wellness__copy { padding-block: calc(var(--sec-pad) * 0.5); padding-inline: calc(var(--pad) * 0.5); }
  :where(html.exton-on) .quote { max-width: 100%; }
  :where(html.exton-on) .quote__text { font-size: calc(var(--t-h2) * 0.85); }
  :where(html.exton-on) .pullquote blockquote, :where(html.exton-on) .pullquote__credit { grid-column: 1 / -1; }
  :where(html.exton-on) .pullquote__mark { padding-left: 0; }
  :where(html.exton-on) .photo-break { height: 60svh; }
  :where(html.exton-on) .next__pill { font-size: calc(var(--pill) * 1.5); }
  :where(html.exton-on) .facts { gap: calc(var(--facts-gap) * 2); }
  :where(html.exton-on) .fact { row-gap: calc(var(--gap) * 1.5); }
  :where(html.exton-on) .fact .fact__figure, :where(html.exton-on) .fact--flip .fact__figure { grid-row: 1; grid-column: 1 / 4; align-self: start; }
  :where(html.exton-on) .fact .fact__copy, :where(html.exton-on) .fact--flip .fact__copy { grid-row: 2; grid-column: 1 / 4; align-self: start !important; text-align: left; }
  :where(html.exton-on) .fact:nth-child(2n) .fact__figure, :where(html.exton-on) .fact:nth-child(2n) .fact__copy { grid-column: 2 / -1; }
  :where(html.exton-on) .carousel { --slide-w: 82vw; --slide-h: 85vw; padding-bottom: 5vw; }
  :where(html.exton-on) .carousel__strip { rotate: -4deg; }
  :where(html.exton-on) .carousel__slide { rotate: 4deg; }
  :where(html.exton-on) .carousel__nav { right: auto; left: 50%; transform: translate(-50%); margin-bottom: calc(var(--sec-pad) * -0.714); }
  :where(html.exton-on) .carousel__arrow img { width: calc(var(--arrow) * 1.6); height: calc(var(--arrow) * 1.6); }
  :where(html.exton-on) .ring { --size: clamp(9rem, 15vw, 12.5rem); --stroke: 2.5px; }
  :where(html.exton-on) .ring__label { padding: 12%; font-size: clamp(0.9375rem, 4.8vw, 1.25rem); letter-spacing: 0.01em; }
}


@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) {
  :where(html.exton-on) .hero--home .hero__copy { max-width: 52vw; bottom: 8vw; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .brand { margin-top: 2vw; }
  :where(html.exton-on) .navlink { display: none; }
  :where(html.exton-on) .colophon { grid-column: 1 / -1; justify-self: center; text-align: center; margin: auto; }
  :where(html.exton-on) .dock { --k: calc(1.7 * 0.85); left: 0; right: 0; bottom: calc(4vw + env(safe-area-inset-bottom, 0px)); width: fit-content; margin-inline: auto; gap: calc(0.45em * var(--k)); }
  :where(html.exton-on) .dock__picker { height: calc(var(--action-h) * var(--k)); padding: 0 1.2em; gap: 0.7em; font-size: calc(var(--t-nav) * var(--k)); }
  :where(html.exton-on) .dock__burger { width: calc(var(--burger-w) * var(--k)); height: calc(var(--action-h) * var(--k)); }
  :where(html.exton-on) .dock__burger svg { width: calc(100% * 23 / 65); }
  :where(html.exton-on) .hero { gap: 15svh; }
  :where(html.exton-on) .hero__stack { top: -10svh; margin-top: 0; }
  :where(html.exton-on) .hero .ticker { padding-bottom: 5vw; }
  :where(html.exton-on) .hero__copy { display: flex; flex-direction: column; align-items: center; max-width: 70vw; bottom: 23vw; }
  :where(html.exton-on) .hero__lead { font-size: 5.5vw; }
  :where(html.exton-on) .loader__count { --digit: 5.5vw; bottom: max(8vh, 2rem); }
}
@media (prefers-reduced-motion: reduce) {
  :where(html.exton-on) .loader { display: none !important; }
  :where(html.exton-on) .navlink::after { transition: none; }
}


html.exton-on, :where(html.exton-on) body { background-color: var(--white); }
html.exton-on:has(body[data-category="hljod"]) { background-color: #005595; }
html.exton-on:has(body[data-category="svid"]) { background-color: #0C1125; }
html.exton-on:has(body[data-category="tjold"]) { background-color: #6320EE; }
html.exton-on:has(body[data-category="hljodfaeri"]) { background-color: #276BA5; }

:where(html.exton-on) .frame { padding-top: max(var(--pad), env(safe-area-inset-top, 0px)); }


:where(html.exton-on) .chip-note { margin: 0.9em 0 0; font-size: calc(var(--t-hero) * 0.5); line-height: 1.35; letter-spacing: 0; opacity: 0.72; }
:where(html.exton-on) body:not(.is-ready) .chip-note { visibility: hidden; }


:where(html.exton-on) .credit { display: flex; align-items: center; flex-wrap: wrap; gap: 0.35em 0.7em; margin: 0.55em 0 0; font-size: calc(var(--t-nav) * 0.62); line-height: 1.35; letter-spacing: 0; white-space: normal; color: inherit; }
:where(html.exton-on) .credit__text { opacity: 0.78; }
:where(html.exton-on) .sndr { display: inline-flex; align-items: baseline; gap: 0.55em; color: inherit; text-decoration: none; }
:where(html.exton-on) .sndr__mark { font: 400 1.25em / 1 "Exton Sans", var(--f-wide); letter-spacing: 0.04em; }
:where(html.exton-on) .sndr__mark i { font-style: normal; font-size: 0.8em; padding: 0 0.04em; color: var(--teal); }
:where(html.exton-on) .sndr__studio { font: 500 0.72em / 1 var(--f-wide); letter-spacing: 0.34em; opacity: 0.8; }

:where(html.exton-on) .colophon { display: flex; flex-direction: column; align-items: flex-start; }
:where(html.exton-on) .colophon .credit { margin: 0.35em 0 0; }
:where(html.exton-on) .next .credit { position: absolute; z-index: 2; left: var(--pad); right: var(--pad); bottom: var(--pad); margin: 0; color: #fff; text-shadow: 0 0 1.2em rgba(0, 0, 0, 0.45); justify-content: center; }
:where(html.exton-on) .next .credit .sndr { pointer-events: auto; }
:where(html.exton-on) .desk .credit { position: absolute; z-index: 3; left: var(--pad); bottom: calc(var(--pad) * 0.9); margin: 0; }
:where(html.exton-on) .drawer__contact { flex-direction: column; align-items: stretch; gap: 0; }
:where(html.exton-on) .drawer__row { display: flex; align-items: center; justify-content: space-between; gap: 1.5em; }
:where(html.exton-on) .roll-icon--sq { aspect-ratio: 1; }
:where(html.exton-on) .drawer__foot { margin-top: calc(var(--drawer-pad) * 0.7); font-size: var(--drawer-contact); line-height: 1.35; opacity: 0.85; }
:where(html.exton-on) .drawer__foot .credit { font-size: 0.86em; margin-top: 0.6em; }
:where(html.exton-on) .drawer__lang { display: inline-flex; align-items: center; gap: 0.55em; font-size: var(--drawer-contact); }


:where(html.exton-on) .drawer__links a.drawer__links--minor { font-size: calc(var(--drawer-link) * 0.62); opacity: 0.86; }


:where(html.exton-on) .ledger { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
:where(html.exton-on) .ledger__table { width: 100%; padding-inline: var(--pad); display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); }
:where(html.exton-on) .ledger__head, :where(html.exton-on) .ledger__row { grid-column: 2 / var(--cols); display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 0.9fr); align-items: center; column-gap: var(--gap);
  padding-block: calc(1.7vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--cat) 24%, transparent); }
:where(html.exton-on) .ledger__head { padding-block: calc(0.8vw * var(--s)); border-top: 0; color: var(--cat-muted); font-size: calc(var(--t-nav) * 0.86); line-height: 1.3; }
:where(html.exton-on) .ledger__row:last-of-type { border-bottom: 1px solid color-mix(in srgb, var(--cat) 24%, transparent); }
:where(html.exton-on) .ledger__size { font-size: var(--t-h3); line-height: 0.95; letter-spacing: -0.05em; color: var(--cat); font-variant-numeric: lining-nums; }
:where(html.exton-on) .ledger__size small { display: block; margin-top: 0.5em; font-size: calc(var(--t-p) * 0.9); letter-spacing: -0.01em; line-height: 1.3; color: var(--cat-muted); }
:where(html.exton-on) .ledger__price { font-size: var(--t-h5); line-height: 1.3; color: var(--cat); font-variant-numeric: lining-nums; }
:where(html.exton-on) .ledger__price b { font-weight: 500; white-space: nowrap; }
:where(html.exton-on) .ledger__stat { display: flex; flex-direction: column; gap: 0.7em; min-width: 0; }
:where(html.exton-on) .ledger__bar { position: relative; display: block; height: 3px; background: color-mix(in srgb, var(--cat) 16%, transparent); overflow: hidden; }
:where(html.exton-on) .ledger__bar i { position: absolute; inset: 0; background: var(--cat); transform: scaleX(var(--w, 0.5)); transform-origin: 0 50%; }
:where(html.exton-on) .ledger__tag { font-size: calc(var(--t-nav) * 0.72); line-height: 1.3; color: var(--cat-muted); }
:where(html.exton-on) .ledger__go { justify-self: end; font-size: var(--t-h4); line-height: 1.3; letter-spacing: -0.01em; }
:where(html.exton-on) .ledger__go a { position: relative; display: inline-flex; align-items: center; gap: 0.35em; color: var(--cat); white-space: nowrap; }
:where(html.exton-on) .ledger__go a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -0.3em; border-bottom: 1px solid currentColor; transform-origin: 0% 50%; transition: transform 0.65s var(--ease); }
:where(html.exton-on) .ledger__go img { width: 0.576em; height: auto; flex-shrink: 0; transition: transform 0.65s var(--ease); }
@media (hover: hover) { :where(html.exton-on) .ledger__go a:hover::after { transform: scaleX(0); transform-origin: 100% 50%; } :where(html.exton-on) .ledger__go a:hover img { transform: translateX(0.2em); } }
:where(html.exton-on) .ledger__note { grid-column: 2 / var(--cols); margin-top: calc(var(--gap) * 0.8); color: var(--cat-muted); max-width: 46em; font-size: calc(var(--t-p) * 0.86); line-height: 1.4; }
:where(html.exton-on) .ledger__note a { text-decoration: underline; text-underline-offset: 0.2em; color: inherit; }
:where(html.exton-on) .ledger__sellers { grid-column: 2 / var(--cols); margin-top: calc(var(--gap) * 0.9); color: var(--cat); font-size: calc(var(--t-p) * 0.92); line-height: 1.4; }
:where(html.exton-on) .ledger__sellers b { font-weight: 500; }
:where(html.exton-on) .ledger__sellers span { color: var(--cat-muted); }
:where(html.exton-on) .ledger .line { overflow: hidden; }


:where(html.exton-on) .board { position: relative; width: 100%; display: flex; flex-direction: column; gap: var(--sec-gap); padding-block: var(--sec-pad); background: var(--white); }
:where(html.exton-on) .board__notice { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); padding-inline: var(--pad); }
:where(html.exton-on) .board__notice-in { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 1.2em; padding-block: calc(1.1vw * var(--s)); border-block: 1px solid color-mix(in srgb, var(--navy) 24%, transparent); color: var(--navy); font-size: var(--t-p); line-height: 1.35; }
:where(html.exton-on) .board__notice-in b { flex: none; font: 500 calc(var(--t-hero) * 0.55) / 1.2 var(--f-wide); letter-spacing: 0.08em; text-transform: uppercase; }
:where(html.exton-on) .board__block { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: calc(var(--gap) * 1.4); padding-inline: var(--pad); }
:where(html.exton-on) .board__title { grid-column: 1 / 5; font: 600 var(--t-h2) / var(--lh-h2) var(--f-serif); letter-spacing: var(--ls-h2); color: var(--navy); align-self: start; }
:where(html.exton-on) .board__title small { display: block; margin-top: 1.1em; font: 500 var(--t-p) / var(--lh-body) var(--f-sans); letter-spacing: -0.01em; color: var(--muted); max-width: 22em; }
:where(html.exton-on) .board__body { grid-column: 5 / -1; display: flex; flex-direction: column; min-width: 0; }
:where(html.exton-on) .board .line { padding-bottom: 0.5vw; margin-bottom: -0.5vw; }
:where(html.exton-on) .demand__row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 2.4fr) auto; column-gap: var(--gap); align-items: center; padding-block: calc(1.5vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .demand__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .demand__name { font-size: var(--t-h5); line-height: 1.25; color: var(--navy); }
:where(html.exton-on) .demand__name small { display: block; margin-top: 0.3em; font-size: calc(var(--t-p) * 0.86); color: var(--muted); }
:where(html.exton-on) .demand__bars { display: flex; flex-direction: column; gap: 0.5vw; min-width: 0; }
:where(html.exton-on) .demand__bar { display: grid; grid-template-columns: minmax(0, 7.5em) minmax(0, 1fr); column-gap: 1em; align-items: center; font-size: calc(var(--t-p) * 0.82); color: var(--muted); }
:where(html.exton-on) .demand__bar span { position: relative; display: block; height: calc(0.9vw * var(--s)); min-height: 8px; background: color-mix(in srgb, var(--navy) 10%, transparent); overflow: hidden; }
:where(html.exton-on) .demand__bar span i { position: absolute; inset: 0; background: var(--navy); transform: scaleX(var(--w, 0.4)); transform-origin: 0 50%; }
:where(html.exton-on) .demand__bar:nth-child(2) span i { background: var(--teal); }
:where(html.exton-on) .demand__bar:nth-child(3) span i { background: color-mix(in srgb, var(--navy) 55%, white); }
:where(html.exton-on) .demand__total { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; text-align: right; }
:where(html.exton-on) .funnel { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); column-gap: calc(var(--gap) * 0.6); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .funnel__step { display: flex; flex-direction: column; gap: 0.5em; padding: calc(1.2vw * var(--s)) 0 calc(1.4vw * var(--s)); min-width: 0; }
:where(html.exton-on) .funnel__n { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; }
:where(html.exton-on) .funnel__l { font-size: calc(var(--t-p) * 0.92); line-height: 1.3; color: var(--navy); }
:where(html.exton-on) .funnel__d { font-size: calc(var(--t-p) * 0.82); line-height: 1.3; color: var(--muted); }
:where(html.exton-on) .funnel__step--stall .funnel__d { color: #8b2e2e; }
:where(html.exton-on) .funnel__note { margin-top: calc(var(--gap) * 0.7); color: var(--muted); max-width: 40em; font-size: calc(var(--t-p) * 0.92); }
:where(html.exton-on) .sellers { display: flex; flex-direction: column; }
:where(html.exton-on) .sellers__head, :where(html.exton-on) .sellers__row { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); column-gap: var(--gap); padding-block: calc(1.2vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); align-items: baseline; }
:where(html.exton-on) .sellers__head { border-top: 0; padding-block: calc(0.6vw * var(--s)); color: var(--muted); font-size: calc(var(--t-p) * 0.86); }
:where(html.exton-on) .sellers__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .sellers__name { font-size: var(--t-h5); color: var(--navy); line-height: 1.25; }
:where(html.exton-on) .sellers__num { font-size: var(--t-h5); color: var(--navy); font-variant-numeric: lining-nums; line-height: 1.25; }
:where(html.exton-on) .sellers__row--slow .sellers__num--slow { color: #8b2e2e; }
:where(html.exton-on) .tag-sample { display: inline-block; margin-left: 0.7em; padding: 0.15em 0.55em 0.1em; border: 1px solid currentColor; font: 500 calc(var(--t-p) * 0.62) / 1.2 var(--f-wide); letter-spacing: 0.08em; text-transform: uppercase; vertical-align: middle; }


:where(html.exton-on) .ticks { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; list-style: none; }
:where(html.exton-on) .ticks li { border-bottom: 1px solid rgba(22, 35, 46, 0.18); }
:where(html.exton-on) .ticks label { display: flex; align-items: flex-start; gap: var(--label-gap); padding: 0.85em 0; font: 500 var(--field) / 1.35 var(--f-sans); color: var(--navy); cursor: pointer; }
:where(html.exton-on) .ticks input { width: 1.16em; height: 1.16em; min-width: 16px; min-height: 16px; margin: 0.12em 0 0; flex-shrink: 0; accent-color: var(--navy); cursor: pointer; }
:where(html.exton-on) .ticks small { display: block; margin-top: 0.15em; font-weight: 400; color: var(--muted); font-size: 0.9em; }
:where(html.exton-on) .enquiry input[type="file"] { padding: calc(var(--field-pad) * 0.7) 0; font-size: max(var(--field), 16px); color: var(--muted); }
:where(html.exton-on) .enquiry input[type="file"]::file-selector-button { margin-right: 1em; padding: 0.4em 0.9em; border: 1px solid var(--navy); background: transparent; color: var(--navy); font: 500 0.9em var(--f-sans); cursor: pointer; }
:where(html.exton-on) .enquiry__hint { font-size: calc(var(--field) * 0.92); line-height: 1.4; color: var(--muted); }
:where(html.exton-on) .enquiry__hint a { text-decoration: underline; text-underline-offset: 0.2em; color: inherit; }
:where(html.exton-on) .enquiry__sample { display: flex; align-items: baseline; gap: 0.8em; font-size: calc(var(--field) * 0.92); color: var(--muted); line-height: 1.4; }


:where(html.exton-on) .thanks__list { display: flex; flex-direction: column; gap: 0.5em; margin: 0; padding: 0; list-style: none; font-size: calc(var(--field) * 1.05); line-height: 1.35; color: #fff; text-align: left; width: 100%; }
:where(html.exton-on) .thanks__list li { padding-top: 0.5em; border-top: 1px solid rgba(255, 255, 255, 0.22); }
:where(html.exton-on) .thanks__note { font-size: calc(var(--field) * 0.95); line-height: 1.4; color: #c5dcf0; }


:where(html.exton-on) .film__still-wrap { position: relative; display: block; width: 100%; height: 100%; margin: 0; }
:where(html.exton-on) .film__link { grid-column: calc(var(--cols) - var(--span) + 1) / -1; grid-row: 3; margin-top: calc(var(--gap) * -0.9); font-size: calc(var(--t-p) * 0.9); color: var(--navy); }
:where(html.exton-on) .film__link a { text-decoration: underline; text-underline-offset: 0.2em; }


:where(html.exton-on) .chronicle, :where(html.exton-on) .people { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); padding-inline: var(--pad); }
:where(html.exton-on) .chronicle__label, :where(html.exton-on) .people__label { grid-column: 1 / 3; margin-top: 0.3vw; }
:where(html.exton-on) .chronicle__list, :where(html.exton-on) .people__list { grid-column: 3 / -1; display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
:where(html.exton-on) .chronicle__item { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 3fr); column-gap: var(--gap); padding-block: calc(1.4vw * var(--s)); border-top: 1px solid rgba(22, 35, 46, 0.22); }
:where(html.exton-on) .chronicle__item:last-child { border-bottom: 1px solid rgba(22, 35, 46, 0.22); }
:where(html.exton-on) .chronicle__year { font-size: var(--t-h3); line-height: 0.92; letter-spacing: -0.05em; color: var(--navy); font-variant-numeric: lining-nums; }
:where(html.exton-on) .chronicle__title { font-size: var(--t-h5); line-height: 1.25; color: var(--navy); }
:where(html.exton-on) .chronicle__text { margin-top: 0.5em; color: var(--muted); max-width: 42em; }
:where(html.exton-on) .people__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--gap); }
:where(html.exton-on) .people__item { padding-block: calc(1.1vw * var(--s)); border-top: 1px solid rgba(22, 35, 46, 0.22); color: var(--navy); }
:where(html.exton-on) .people__item b { display: block; font-weight: 500; font-size: var(--t-h5); line-height: 1.25; }
:where(html.exton-on) .people__item span { display: block; color: var(--muted); margin-top: 0.15em; }
:where(html.exton-on) .chronicle .line, :where(html.exton-on) .people .line { padding-bottom: 0.3vw; margin-bottom: -0.3vw; }
:where(html.exton-on) .pick-wrap { padding-block: 0; }

@media (max-width: 1024px) {
  :where(html.exton-on) .ledger__head, :where(html.exton-on) .ledger__row { grid-column: 1 / -1; }
  :where(html.exton-on) .ledger__note, :where(html.exton-on) .ledger__sellers { grid-column: 1 / -1; }
  :where(html.exton-on) .board__title { grid-column: 1 / -1; }
  :where(html.exton-on) .board__body { grid-column: 1 / -1; }
  :where(html.exton-on) .chronicle__list, :where(html.exton-on) .people__list { grid-column: 1 / -1; }
  :where(html.exton-on) .chronicle__label, :where(html.exton-on) .people__label { grid-column: 1 / -1; margin-bottom: calc(var(--gap) * 0.6); }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .ledger__head { display: none; }
  :where(html.exton-on) .ledger__row { grid-template-columns: minmax(0, 1fr) auto; row-gap: calc(var(--gap) * 0.5); }
  :where(html.exton-on) .ledger__size { grid-column: 1 / -1; }
  :where(html.exton-on) .ledger__price { grid-column: 1; font-size: calc(var(--t-h5) * 0.95); }
  :where(html.exton-on) .ledger__stat { grid-column: 1 / -1; grid-row: 3; }
  :where(html.exton-on) .ledger__go { grid-column: 2; grid-row: 2; align-self: center; font-size: var(--t-h4); }
  :where(html.exton-on) .board__notice-in { flex-direction: column; gap: 0.5em; }
  :where(html.exton-on) .demand__row { grid-template-columns: minmax(0, 1fr) auto; row-gap: calc(var(--gap) * 0.7); }
  :where(html.exton-on) .demand__bars { grid-column: 1 / -1; grid-row: 2; }
  :where(html.exton-on) .demand__bar { grid-template-columns: minmax(0, 6.5em) minmax(0, 1fr); }
  :where(html.exton-on) .demand__bar span { height: 3vw; }
  :where(html.exton-on) .funnel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  :where(html.exton-on) .funnel__step { padding-block: calc(var(--gap) * 0.7); }
  :where(html.exton-on) .sellers__head { display: none; }
  :where(html.exton-on) .sellers__row { grid-template-columns: 1fr 1fr; row-gap: 0.4em; }
  :where(html.exton-on) .sellers__name { grid-column: 1 / -1; }
  :where(html.exton-on) .people__list { grid-template-columns: minmax(0, 1fr); }
  :where(html.exton-on) .chronicle__item { grid-template-columns: minmax(0, 1fr); row-gap: 0.4em; }
  :where(html.exton-on) .film__link { grid-column: 1 / -1; grid-row: auto; margin-top: 0; font-size: calc(var(--t-p) * 0.85); }
  :where(html.exton-on) .desk .credit { position: relative; left: auto; bottom: auto; grid-column: 1 / -1; margin-top: calc(var(--gap) * 2); }
  :where(html.exton-on) .next .credit { bottom: calc(var(--pad) * 0.8); }
}
@media (min-width: 651px) and (max-width: 1024px) { :where(html.exton-on) .desk .credit { position: relative; left: auto; bottom: auto; grid-column: 1 / -1; margin-top: calc(var(--gap) * 2); } }


:where(html.exton-on) .skip { position: fixed; left: 12px; top: 12px; z-index: 100020; padding: 0.8em 1.1em; background: #fff; color: var(--navy); font: 500 16px / 1.2 var(--f-sans); border: 1px solid var(--navy); transform: translateY(-300%); }
:where(html.exton-on) .skip:focus { transform: none; }
:where(html.exton-on) #main:focus { outline: none; }
:where(html.exton-on) .bg-root a, :where(html.exton-on) .bg-root button, :where(html.exton-on) .drawer a, :where(html.exton-on) .drawer button, :where(html.exton-on) .thanks button, :where(html.exton-on) .panel button, :where(html.exton-on) .bg-root select, :where(html.exton-on) .bg-root label { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
:where(html.exton-on) .ledger__price, :where(html.exton-on) .sellers__num, :where(html.exton-on) .demand__total, :where(html.exton-on) .funnel__n, :where(html.exton-on) .chronicle__year { font-variant-numeric: tabular-nums lining-nums; }

:where(html.exton-on) .bg-root a:focus-visible, :where(html.exton-on) .bg-root button:focus-visible, :where(html.exton-on) .drawer a:focus-visible, :where(html.exton-on) .drawer button:focus-visible, :where(html.exton-on) .thanks button:focus-visible, :where(html.exton-on) .panel button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
:where(html.exton-on) .dock__burger:focus-visible { outline-color: var(--ink); outline-offset: -5px; }
:where(html.exton-on) .enquiry :is(input, select, textarea):focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
:where(html.exton-on) .tile:focus-visible { outline: 3px solid #fff; outline-offset: -6px; }
:where(html.exton-on) .tile--light:focus-visible { outline-color: var(--navy); }

@media (pointer: coarse) {
  :where(html.exton-on) .ledger__go a, :where(html.exton-on) .cta__underline, :where(html.exton-on) .channel__value, :where(html.exton-on) .enquiry__tab, :where(html.exton-on) .thanks__more button, :where(html.exton-on) .film__link a, :where(html.exton-on) .ledger__note a, :where(html.exton-on) .enquiry__hint a { min-height: 44px; display: inline-flex; align-items: center; }
  :where(html.exton-on) .ledger__note a { min-height: 32px; }
  :where(html.exton-on) .ledger__note, :where(html.exton-on) .ledger__sellers { line-height: 1.8; }
}

@media (hover: hover) and (pointer: fine) {
  :where(html.exton-on) .navlink:hover::after { transform: scaleX(1); transform-origin: 0% 50%; }
  :where(html.exton-on) .dock__picker:hover { background-position: 0 0; color: var(--ink); }
  :where(html.exton-on) .carousel__arrow:hover { opacity: 0.65; }
  :where(html.exton-on) .channel__value:hover::after { transform: scaleX(1); transform-origin: 0% 50%; }
  :where(html.exton-on) .enquiry__tab:hover { color: var(--navy); }
  :where(html.exton-on) .enquiry__tab:not(.is-active):hover::after { transform: scaleX(0.35); opacity: 0.45; }
  :where(html.exton-on) .consent__policy:hover::after { transform: scaleX(0); transform-origin: 100% 50%; }
  :where(html.exton-on) .enquiry__send:hover { background-position: 0 0; color: var(--navy); }
  :where(html.exton-on) .panel__close:hover { opacity: 0.55; }
  :where(html.exton-on) .sndr:hover .sndr__mark { text-decoration: underline; text-underline-offset: 0.25em; }
}


:where(html.exton-on) body[data-page="home"] { height: auto; min-height: 100svh; overflow-x: hidden; background: var(--white); color: var(--navy); }
html.exton-on:has(body[data-page="home"]) { height: auto; min-height: 100%; overflow-x: hidden; overflow-y: auto; }
html.exton-on:has(body[data-page="home"].is-smooth) { overflow-y: hidden; }
html.exton-on:has(body[data-page="home"].is-picking) { height: 100svh; overflow: hidden; }
:where(html.exton-on) body[data-page="home"] .shell { height: auto; min-height: 100svh; overflow: visible; }
:where(html.exton-on) .page[data-view="home"] { height: auto; min-height: 100svh; overflow: visible; }
:where(html.exton-on) body.is-picking .page[data-view="home"] { height: 100svh; min-height: 0; overflow: clip; }
:where(html.exton-on) body[data-page="home"] .shell > .dock { --bg: var(--white); }
:where(html.exton-on) body[data-page="home"] .shell > .dock .dock__burger { box-shadow: 0 0 0 1px var(--white); }

:where(html.exton-on) .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6em; min-height: max(44px, var(--action-h)); padding: 0 1.5em; border: 1px solid var(--navy);
  color: var(--navy); background: transparent; font-size: max(15px, var(--t-nav)); line-height: 1; white-space: nowrap; transition: background-color 0.35s var(--ease), color 0.35s var(--ease); }
:where(html.exton-on) .btn--solid { background: var(--navy); color: var(--white); }
:where(html.exton-on) .btn:focus-visible { outline: 2px solid var(--navy); outline-offset: 3px; }

:where(html.exton-on) .home-hero.frame { height: auto; min-height: 100svh; max-height: none; overflow: visible; padding-bottom: calc(var(--pad) * 0.9); }
:where(html.exton-on) body:not(.is-ready) .home-hero__copy, :where(html.exton-on) body:not(.is-ready) .home-facts { visibility: hidden; }
:where(html.exton-on) .home-hero__body { grid-column: 1 / -1; grid-row: 2; display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: var(--gap); align-items: center; padding-block: calc(var(--gap) * 1.1); }
:where(html.exton-on) .home-hero__copy { grid-area: 1 / 1 / 2 / 6; }
:where(html.exton-on) .home-hero__lead { font-size: calc(var(--t-h3) * 0.84); line-height: 1.06; letter-spacing: -0.035em; text-wrap: balance; }
:where(html.exton-on) .home-hero__sub { max-width: 30em; margin-top: 1.3em; font-size: var(--t-h4); line-height: 1.4; letter-spacing: -0.01em; }
:where(html.exton-on) .home-hero__cta { display: flex; flex-wrap: wrap; gap: 0.7em; margin-top: 1.9em; }
:where(html.exton-on) .home-hero__photo.hero__photo { grid-area: 1 / 7 / 2 / 13; width: 100%; height: auto; aspect-ratio: 5 / 4; }
:where(html.exton-on) .home-facts { grid-column: 1 / -1; grid-row: 3; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: var(--gap); row-gap: 1.2em; margin: 0;
  padding-top: 1.1em; border-top: 1px solid color-mix(in srgb, var(--navy) 30%, transparent); }
:where(html.exton-on) .home-facts__item { display: flex; flex-direction: column-reverse; gap: 0.3em; }
:where(html.exton-on) .home-facts dt { font-size: calc(var(--t-p) * 0.9); color: var(--muted); }
:where(html.exton-on) .home-facts dd { margin: 0; font-size: var(--t-h5); line-height: 1.1; letter-spacing: -0.02em; }

:where(html.exton-on) .home-sec { padding: calc(var(--pad) * 1.6) var(--pad) 0; }
:where(html.exton-on) .home-sec__head { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: 0.9em; align-items: end; margin-bottom: calc(var(--gap) * 1.3); }
:where(html.exton-on) .home-sec__title { grid-column: 1 / 8; font-size: var(--t-h3); line-height: 0.98; letter-spacing: -0.04em; text-wrap: balance; }
:where(html.exton-on) .home-sec__text { grid-column: 8 / -1; max-width: 32em; color: var(--muted); line-height: 1.4; }

:where(html.exton-on) .pgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); }
:where(html.exton-on) .pcard { position: relative; display: flex; flex-direction: column; overflow: hidden; background: var(--tile); color: var(--white); }
:where(html.exton-on) .pcard__img { display: block; aspect-ratio: 3 / 2; overflow: hidden; background: var(--tile); }
:where(html.exton-on) .pcard__img img { width: 100%; height: 100%; max-width: none; object-fit: cover; transition: transform 0.9s var(--ease); }
:where(html.exton-on) .pcard__body { flex: 1; display: grid; align-content: space-between; gap: calc(var(--gap) * 0.75); padding: calc(var(--gap) * 0.85); }
:where(html.exton-on) .pcard__name { font-size: calc(var(--t-h4) * 1.55); line-height: 1.02; letter-spacing: -0.035em; }
:where(html.exton-on) .pcard__link::after { content: ""; position: absolute; inset: 0; z-index: 1; }
:where(html.exton-on) .pcard__link:focus-visible { outline: none; }
:where(html.exton-on) .pcard__link:focus-visible::after { outline: 3px solid var(--white); outline-offset: -6px; }
:where(html.exton-on) .pcard__town { margin-top: 0.4em; color: rgba(255, 255, 255, 0.8); }
:where(html.exton-on) .pcard__meta { display: flex; flex-wrap: wrap; gap: 1em 2.4em; margin: 0; }
:where(html.exton-on) .pcard__meta dt { font-size: calc(var(--t-p) * 0.9); color: rgba(255, 255, 255, 0.78); }
:where(html.exton-on) .pcard__meta dd { margin: 0.2em 0 0; font-size: var(--t-h5); line-height: 1.1; letter-spacing: -0.02em; }
:where(html.exton-on) .pcard__go { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6em 1em; font-size: max(15px, var(--t-p)); white-space: nowrap; }
:where(html.exton-on) .pcard__view { display: inline-flex; align-items: center; gap: 0.6em; }
:where(html.exton-on) .pcard__view img { width: 1.1em; height: auto; }
:where(html.exton-on) .pcard__enquire { position: relative; z-index: 2; display: inline-flex; align-items: center; min-height: 44px; padding: 0 1.3em; border: 1px solid var(--white); color: var(--white);
  transition: background-color 0.35s var(--ease), color 0.35s var(--ease); }
:where(html.exton-on) .pcard__enquire:focus-visible { outline: 3px solid var(--white); outline-offset: 3px; }

:where(html.exton-on) .more { margin-top: calc(var(--gap) * 2); padding-top: 1.5em; border-top: 1px solid color-mix(in srgb, var(--navy) 30%, transparent); }
:where(html.exton-on) .more__title { font-size: calc(var(--t-h4) * 1.3); line-height: 1.1; letter-spacing: -0.03em; }
:where(html.exton-on) .more__text { margin-top: 0.4em; color: var(--muted); }
:where(html.exton-on) .more__list { margin-top: 1.1em; }
:where(html.exton-on) .more__row { font-size: max(15px, var(--t-p)); display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 3.4fr); column-gap: var(--gap); align-items: center; padding: 0.6em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); }
:where(html.exton-on) .more__name { font-size: var(--t-h5); line-height: 1.2; letter-spacing: -0.02em; }
:where(html.exton-on) .more__town, :where(html.exton-on) .more__sellers { color: var(--muted); }
:where(html.exton-on) .more__links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0 1.6em; }
:where(html.exton-on) .more__links a, :where(html.exton-on) .end__phone, :where(html.exton-on) .need__go, :where(html.exton-on) .agtable td a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; }
:where(html.exton-on) .more__links a { display: inline-flex; align-items: center; min-height: 44px; }

:where(html.exton-on) .how { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); margin: 0; padding: 0; list-style: none; }
:where(html.exton-on) .how__step { display: grid; align-content: start; gap: 0.6em; padding-top: 1em; border-top: 1px solid var(--navy); }
:where(html.exton-on) .how__n { font: 400 calc(var(--t-p) * 0.9) / 1 var(--f-wide); color: var(--muted); }
:where(html.exton-on) .how__title { font-size: calc(var(--t-h4) * 1.3); line-height: 1.1; letter-spacing: -0.03em; }
:where(html.exton-on) .how__text { max-width: 26em; color: var(--muted); line-height: 1.4; }

:where(html.exton-on) .agtable table { width: 100%; border-collapse: collapse; }
:where(html.exton-on) .agtable th, :where(html.exton-on) .agtable td { padding: 0.8em 1.2em 0.8em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); text-align: left; vertical-align: top; font-weight: 500; font-size: var(--t-p); line-height: 1.35; }
:where(html.exton-on) .agtable thead th { padding-top: 0; border-top: 0; border-bottom: 1px solid var(--navy); font-size: calc(var(--t-p) * 0.9); font-weight: 400; color: var(--muted); }
:where(html.exton-on) .agtable tbody th { font-size: var(--t-h5); letter-spacing: -0.02em; }
:where(html.exton-on) .agtable td:nth-child(3) { color: var(--muted); }
:where(html.exton-on) .agtable td a { display: inline-flex; align-items: center; min-height: 44px; margin-block: -0.7em; }

:where(html.exton-on) .end { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--gap); row-gap: calc(var(--gap) * 1.4); align-items: start; }
:where(html.exton-on) .end__phone { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--t-h3); line-height: 1; letter-spacing: -0.04em; }
:where(html.exton-on) .end__hours { margin-top: 0.8em; color: var(--muted); }
:where(html.exton-on) .end__office .home-hero__cta { margin-top: 1.5em; }
:where(html.exton-on) .need { margin: 0; padding: 0; list-style: none; }
:where(html.exton-on) .need__row { display: flex; align-items: center; justify-content: space-between; gap: 1.2em; padding: 0.9em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .need__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .need__title { font-size: var(--t-h5); line-height: 1.2; letter-spacing: -0.02em; }
:where(html.exton-on) .need__text { margin-top: 0.3em; color: var(--muted); }
:where(html.exton-on) .need__go { font-size: max(15px, var(--t-p)); display: inline-flex; align-items: center; gap: 0.5em; min-height: 44px; white-space: nowrap; }
:where(html.exton-on) .need__go img { width: 1em; height: auto; }
:where(html.exton-on) .home-colophon.colophon { grid-column: auto; grid-row: auto; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.8em 2em; padding: calc(var(--pad) * 1.7) var(--pad) calc(var(--pad) * 1.1); white-space: normal; }

@media (hover: hover) and (pointer: fine) {
  :where(html.exton-on) .btn:hover { background: var(--navy); color: var(--white); }
  :where(html.exton-on) .btn--solid:hover { background: transparent; color: var(--navy); }
  :where(html.exton-on) .pcard:hover .pcard__img img { transform: scale(1.025); }
  :where(html.exton-on) .pcard__enquire:hover { background: var(--white); color: var(--tile); }
  :where(html.exton-on) .more__links a:hover, :where(html.exton-on) .need__go:hover, :where(html.exton-on) .end__phone:hover, :where(html.exton-on) .agtable td a:hover { text-decoration-color: transparent; }
}
@media (min-width: 1025px) {
  :where(html.exton-on) .home-facts { padding-right: calc(var(--action-h) * 4.4 + var(--gap)); } 
}
@media (min-width: 651px) and (max-width: 1024px) {
  :where(html.exton-on) .home-facts { padding-right: 230px; } 
}
@media (max-width: 1024px) {
  :where(html.exton-on) .home-hero__copy { grid-area: 1 / 1 / 2 / -1; }
  :where(html.exton-on) .home-hero__photo.hero__photo { grid-area: 2 / 1 / 3 / -1; aspect-ratio: 16 / 10; }
  :where(html.exton-on) .home-hero__lead { font-size: calc(var(--t-h3) * 0.95); }
  :where(html.exton-on) .home-sec__title, :where(html.exton-on) .home-sec__text { grid-column: 1 / -1; }
  :where(html.exton-on) .pgrid { grid-template-columns: minmax(0, 1fr); }
  :where(html.exton-on) .how { grid-template-columns: minmax(0, 1fr); }
  :where(html.exton-on) .end { grid-template-columns: minmax(0, 1fr); }
  :where(html.exton-on) .more__row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 0.1em; }
  :where(html.exton-on) .more__links { grid-column: 1 / -1; justify-content: flex-start; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .home-hero.frame { grid-template-rows: auto auto auto auto; }
  :where(html.exton-on) .home-hero__body { display: contents; }
  :where(html.exton-on) .home-hero__copy { grid-area: 2 / 1 / 3 / -1; padding-top: var(--gap); }
  :where(html.exton-on) .home-facts { grid-area: 3 / 1 / 4 / -1; }
  :where(html.exton-on) .home-hero__photo.hero__photo { grid-area: 4 / 1 / 5 / -1; }
  :where(html.exton-on) .home-hero__lead { font-size: 8.4vw; }
  :where(html.exton-on) .home-hero__cta .btn { flex: 1 1 100%; }
  :where(html.exton-on) .home-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  :where(html.exton-on) .home-sec__title { font-size: 9.4vw; }
  :where(html.exton-on) .end__phone { font-size: 11vw; }
  :where(html.exton-on) .agtable thead { display: none; }
  :where(html.exton-on) .agtable tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 1em; padding: 0.8em 0; border-top: 1px solid color-mix(in srgb, var(--navy) 18%, transparent); }
  :where(html.exton-on) .agtable th, :where(html.exton-on) .agtable td { padding: 0; border: 0; }
  :where(html.exton-on) .agtable tbody th { grid-column: 1; }
  :where(html.exton-on) .agtable td:nth-child(2) { grid-column: 2; grid-row: 1; text-align: right; }
  :where(html.exton-on) .agtable td:nth-child(3) { grid-column: 1 / -1; margin-top: 0.3em; }
  :where(html.exton-on) .agtable td a { margin-block: -0.6em; }
  :where(html.exton-on) .need__row { align-items: flex-start; flex-direction: column; gap: 0.2em; }
}
:where(html.exton-on) .fact__stat--long { font-size: min(var(--t-h3), calc(3.4vw * var(--s))); }
@media (min-width: 651px) and (max-width: 1024px) and (min-height: 950px) { :where(html.exton-on) .fact__stat--long { font-size: min(var(--t-h3), calc(2.9vw * var(--s))); } }


:where(html.exton-on) .menu-top { display: none; }
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .brand { justify-self: start; }
  :where(html.exton-on) .menu-top { grid-column: 1 / -1; grid-row: 1; justify-self: end; align-self: center; display: inline-flex; align-items: center; gap: 0.65em; min-height: 44px; margin: 0; padding: 0 0.95em;
    border: 1px solid currentColor; background: transparent; color: inherit; font: inherit; font-size: max(15px, var(--t-nav)); line-height: 1; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  :where(html.exton-on) .menu-top svg { width: 20px; height: auto; fill: currentColor; flex-shrink: 0; }
  :where(html.exton-on) .menu-top:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
}
:where(html.exton-on) .drawer__close-label { display: none; }
:where(html.exton-on) .drawer__close.is-labelled { gap: 0.65em; font-size: max(15px, var(--t-nav)); line-height: 1; }
:where(html.exton-on) .drawer__close.is-labelled .drawer__close-label { display: inline; }
:where(html.exton-on) .drawer__close.is-labelled svg { width: 20px; }


:where(html.exton-on) .thanks__card { max-height: calc(var(--vh1, 1svh) * 100 - var(--pad) * 2); overflow-y: auto; overscroll-behavior: contain; }        
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .tile__name { font-size: min(var(--tile-name), calc(41vw / var(--nw, 8))); }                                                         
  :where(html.exton-on) .drawer__links a { display: flex; align-items: center; min-height: 44px; }                                                         
  :where(html.exton-on) .drawer__links a.drawer__links--minor { min-height: 44px; }
  :where(html.exton-on) .drawer__contact a { min-height: 44px; }
  :where(html.exton-on) .chip { font-size: max(12px, calc(var(--t-hero) * 0.55)); }                                                                          
  :where(html.exton-on) .chip-note, :where(html.exton-on) .ledger__tag, :where(html.exton-on) .tag-sample, :where(html.exton-on) .enquiry__hint, :where(html.exton-on) .enquiry__sample, :where(html.exton-on) .thanks__note, :where(html.exton-on) .consent__label, :where(html.exton-on) .people__item span { font-size: max(12px, 1em); }
  :where(html.exton-on) .chip-note { font-size: max(12px, calc(var(--t-hero) * 0.5)); }
  :where(html.exton-on) .ledger__tag { font-size: max(12px, calc(var(--t-nav) * 0.72)); }
  :where(html.exton-on) .tag-sample { font-size: max(12px, calc(var(--t-p) * 0.62)); }
  :where(html.exton-on) .enquiry__hint, :where(html.exton-on) .enquiry__sample { font-size: max(12px, calc(var(--field) * 0.92)); }
  :where(html.exton-on) .thanks__note { font-size: max(12px, calc(var(--field) * 0.95)); }
  :where(html.exton-on) .consent__label { font-size: max(12px, var(--tick)); }
  :where(html.exton-on) .credit { font-size: max(12px, calc(var(--t-nav) * 0.62)); }
  :where(html.exton-on) .channel__value { font-size: max(15px, calc(var(--field) * 1.05)); }
  :where(html.exton-on) .people__item span { font-size: max(12px, 1em); }
  :where(html.exton-on) .sellers__row { row-gap: 0.7em; }
  :where(html.exton-on) .fact__index { font-size: max(12px, 80%); }
  :where(html.exton-on) .dock__picker, :where(html.exton-on) .dock__burger { min-height: 44px; }
  :where(html.exton-on) .board__notice b { font-size: max(12px, 1em); }
  :where(html.exton-on) .sellers__num[data-l]::before { content: attr(data-l); display: block; margin-bottom: 0.15em; color: var(--muted); font-size: max(12px, calc(var(--t-p) * 0.8)); line-height: 1.2; }  
}
@media (pointer: coarse) {                                                                                                          
  :where(html.exton-on) .brand { display: inline-flex; align-items: center; min-height: 44px; }
  :where(html.exton-on) .enquiry input:not([type="checkbox"]):not([type="file"]), :where(html.exton-on) .enquiry select, :where(html.exton-on) .enquiry__send, :where(html.exton-on) .consent__policy { min-height: 44px; }
  :where(html.exton-on) .consent__policy { display: inline-flex; align-items: center; }
  :where(html.exton-on) .ledger__note a { min-height: 44px; }
  :where(html.exton-on) .ledger__sellers a { white-space: nowrap; padding: 0.9em 0.2em; margin: -0.9em -0.2em; text-decoration: underline; text-underline-offset: 0.2em; }   
  :where(html.exton-on) .credit .sndr { min-height: 44px; align-items: center; }
}



:where(html.exton-on) [data-view="category"], :where(html.exton-on) [data-view="about"], :where(html.exton-on) body[data-page="category"], :where(html.exton-on) body[data-page="about"] { --ls-h2: 0em; }
:where(html.exton-on) .board__title, :where(html.exton-on) .thanks__title, :where(html.exton-on) .drawer__links a { letter-spacing: 0; }

:where(html.exton-on) .brand img { width: calc(var(--logo-w) * 1.25); height: auto; }


:where(html.exton-on) .enquiry .field { display: flex; flex-direction: column; gap: 0.15em; min-width: 0; }
:where(html.exton-on) .field__label { display: block; font: 500 calc(var(--field) * 0.86) / 1.3 var(--f-sans); letter-spacing: 0; color: var(--muted); }
:where(html.exton-on) .enquiry input[type="date"] { min-height: 2.6em; -webkit-appearance: none; appearance: none; text-align: left; }
:where(html.exton-on) .enquiry input[type="date"]::-webkit-date-and-time-value { text-align: left; }
:where(html.exton-on) .enquiry input[type="number"] { -moz-appearance: textfield; }
:where(html.exton-on) .enquiry input[type="file"] { border-bottom: 0; }
:where(html.exton-on) .field--file .enquiry__hint { margin-top: 0.2em; }
:where(html.exton-on) .enquiry__estimate { margin: 0.2em 0 0.4em; padding: 0.75em 1em; border-left: 3px solid var(--teal); background: color-mix(in srgb, var(--teal) 7%, transparent);
  font: 400 calc(var(--field) * 0.95) / 1.4 var(--f-sans); letter-spacing: -0.005em; color: var(--navy); }
:where(html.exton-on) .enquiry__estimate b { font-weight: 500; color: var(--teal); }
@media (min-width: 1025px) {
  :where(html.exton-on) .desk__aside .enquiry { overflow-y: auto; scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--navy) 30%, transparent) transparent; padding-right: 0.8em; margin-right: -0.8em; }
}
:where(html.exton-on) .thanks__list { text-align: left; }

:where(html.exton-on) .more__row--sale { grid-template-columns: minmax(0, 3fr) minmax(0, 3fr) minmax(0, 2fr); }
:where(html.exton-on) .more__row--sale .more__list, :where(html.exton-on) .more .more__list { margin-top: 0; }
:where(html.exton-on) .more__makers { display: flex; flex-wrap: wrap; gap: 0 1.4em; }
:where(html.exton-on) .more__makers a { display: inline-flex; align-items: center; min-height: 44px; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; color: var(--muted); }
@media (hover: hover) { :where(html.exton-on) .more__makers a:hover { text-decoration-color: transparent; } }
@media (max-width: 1024px) { :where(html.exton-on) .more__row--sale { grid-template-columns: minmax(0, 1fr) auto; } :where(html.exton-on) .more__row--sale .more__makers { grid-column: 1 / -1; grid-row: 2; } :where(html.exton-on) .more__row--sale .more__links { grid-column: 2; grid-row: 1; } }
:where(html.exton-on) .enquiry .field[data-off] { opacity: 0.45; }
@media (pointer: coarse) {
  :where(html.exton-on) .agtable--prices th a, :where(html.exton-on) .people__item span a, :where(html.exton-on) .chronicle__title a { display: inline-block; padding-block: 0.7em; margin-block: -0.7em; }   
}
:where(html.exton-on) .field-row--3 { grid-template-columns: 1fr 1fr 1fr; }
@media (min-width: 1025px) {
  :where(html.exton-on) .page--desk .enquiry { --field-pad: calc(0.62vw * var(--s)); --ta: calc(2.2vw * var(--s)); gap: calc(var(--ov-gap) * 0.7); }
  :where(html.exton-on) .page--desk .enquiry__form { gap: calc(var(--form-gap) * 1.6); }
  :where(html.exton-on) .page--desk[data-slug="contact"] .desk__stack { grid-column: 5 / 8; }       
  :where(html.exton-on) .page--desk[data-slug="contact"] .desk__aside { grid-column: 8 / 13; }
  :where(html.exton-on) .page--desk .enquiry textarea { height: calc(var(--ta) * 1.6); min-height: calc(var(--ta) * 1.6); max-height: calc(var(--ta) * 1.6); }
}
@media (max-width: 1024px) { :where(html.exton-on) .field-row--3 { grid-template-columns: 1fr; } }


:where(html.exton-on) .ledger__price small, :where(html.exton-on) .ledger__size small { display: block; margin-top: 0.35em; font-size: calc(var(--t-p) * 0.86); line-height: 1.3; letter-spacing: -0.01em; color: var(--cat-muted); font-weight: 400; }
:where(html.exton-on) .ledger__price--b b { font-weight: 500; white-space: normal; }   
:where(html.exton-on) .next__link { gap: calc(var(--next-gap) * 1.9); }   
:where(html.exton-on) .channel__text, :where(html.exton-on) .channel__plain { min-width: 0; overflow-wrap: anywhere; }
@media (max-width: 400px) {
  :where(html.exton-on) .page--desk[data-slug="contact"] .desk__heading { grid-column: 1 / -1; }
  :where(html.exton-on) .page--desk[data-slug="contact"] .desk__channels { grid-column: 1 / -1; grid-row: 3; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .ledger__row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: calc(var(--gap) * 0.8); row-gap: calc(var(--gap) * 0.45); }
  :where(html.exton-on) .ledger__size { grid-column: 1; grid-row: 1; }
  :where(html.exton-on) .ledger__go { grid-column: 2; grid-row: 1; align-self: center; justify-self: end; }
  :where(html.exton-on) .ledger__price { grid-column: 1; grid-row: 2; align-self: start; }
  :where(html.exton-on) .ledger__price--b { grid-column: 2; grid-row: 2; }
  :where(html.exton-on) .ledger__price[data-l]::before { content: attr(data-l); display: block; margin-bottom: 0.25em; font-size: max(12px, calc(var(--t-p) * 0.8)); line-height: 1.2; color: var(--cat-muted); font-weight: 400; }
}


:where(html.exton-on) .agtable--prices th a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; }
:where(html.exton-on) .agtable--prices tbody th small { display: block; margin-top: 0.25em; font-size: calc(var(--t-p) * 0.86); font-weight: 400; letter-spacing: -0.01em; color: var(--muted); }
:where(html.exton-on) .agtable--prices td { white-space: nowrap; font-variant-numeric: tabular-nums lining-nums; font-size: var(--t-h5); letter-spacing: -0.02em; }
:where(html.exton-on) .agtable--prices td:nth-child(3) { color: inherit; }
:where(html.exton-on) .agtable__quote { white-space: normal; font-size: var(--t-p); color: var(--muted); }
:where(html.exton-on) .agtable__na { color: var(--muted); }
@media (hover: hover) { :where(html.exton-on) .agtable--prices th a:hover { text-decoration-color: transparent; } }
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .agtable--prices tr { grid-template-columns: minmax(0, 1fr) auto auto; column-gap: 1.2em; }
  :where(html.exton-on) .agtable--prices tbody th { grid-column: 1; grid-row: 1; }
  :where(html.exton-on) .agtable--prices td:nth-child(2), :where(html.exton-on) .agtable--prices td:nth-child(3) { grid-column: auto; grid-row: 1; margin-top: 0; text-align: right; font-size: max(15px, var(--t-p)); }
  :where(html.exton-on) .agtable--prices td[colspan] { grid-column: 1 / -1; grid-row: 2; text-align: left; margin-top: 0.3em; }
  :where(html.exton-on) .agtable--prices td[data-l]::before { content: attr(data-l); display: block; font-size: max(12px, calc(var(--t-p) * 0.75)); color: var(--muted); }
}


:where(html.exton-on) .chronicle__item:has(.chronicle__year--word) { grid-template-columns: minmax(0, 1.5fr) minmax(0, 2fr); }
:where(html.exton-on) .chronicle__year--word { font-size: var(--t-h5); line-height: 1.25; letter-spacing: -0.02em; font-weight: 500; }
:where(html.exton-on) .chronicle__title a, :where(html.exton-on) .people__item span a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
:where(html.exton-on) .jobs { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gap); row-gap: calc(var(--gap) * 0.6); padding-inline: var(--pad); }
:where(html.exton-on) .jobs__label { grid-column: 1 / 3; grid-row: 1 / 3; margin-top: 0.3vw; }
:where(html.exton-on) .jobs__text { grid-column: 3 / -1; color: var(--muted); max-width: 36em; }
:where(html.exton-on) .jobs__grid { grid-column: 3 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); }
:where(html.exton-on) .jobs__item img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: color-mix(in srgb, var(--navy) 8%, transparent); }
:where(html.exton-on) .jobs__item figcaption { margin-top: 0.6em; font-size: var(--t-p); line-height: 1.3; color: var(--navy); }
@media (max-width: 1024px) {
  :where(html.exton-on) .jobs__label, :where(html.exton-on) .jobs__text, :where(html.exton-on) .jobs__grid { grid-column: 1 / -1; grid-row: auto; }
  :where(html.exton-on) .jobs__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}


:where(html.exton-on) .inbox { display: flex; flex-direction: column; }
:where(html.exton-on) .inbox__head, :where(html.exton-on) .inbox__row { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.6fr) minmax(0, 1.3fr) minmax(0, 1.15fr) minmax(0, 1.25fr) minmax(0, 0.85fr);
  column-gap: calc(var(--gap) * 0.6); align-items: baseline; padding-block: calc(1.1vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .inbox__head { border-top: 0; padding-block: calc(0.6vw * var(--s)); color: var(--muted); font-size: calc(var(--t-p) * 0.86); }
:where(html.exton-on) .inbox__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .inbox__kind { font: 500 calc(var(--t-p) * 0.72) / 1.2 var(--f-wide); letter-spacing: 0.06em; text-transform: uppercase; color: var(--teal); }
:where(html.exton-on) .inbox__what { font-size: var(--t-h5); line-height: 1.25; color: var(--navy); }
:where(html.exton-on) .inbox__cell { font-size: var(--t-p); line-height: 1.35; color: var(--muted); }
:where(html.exton-on) .inbox__status { justify-self: start; padding: 0.2em 0.6em; border: 1px solid currentColor; font-size: calc(var(--t-p) * 0.86); line-height: 1.3; color: var(--navy); white-space: nowrap; }
:where(html.exton-on) .inbox__row--flag .inbox__status { color: #8b2e2e; }
:where(html.exton-on) .brief { display: flex; flex-direction: column; margin: 0; }
:where(html.exton-on) .brief__row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr); column-gap: var(--gap); padding-block: calc(1vw * var(--s)); border-top: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .brief__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--navy) 22%, transparent); }
:where(html.exton-on) .brief__row dt { color: var(--muted); font-size: var(--t-p); line-height: 1.35; }
:where(html.exton-on) .brief__row dd { margin: 0; font-size: var(--t-h5); line-height: 1.3; color: var(--navy); }
@media (max-width: 1024px) {
  :where(html.exton-on) .inbox__head { display: none; }
  :where(html.exton-on) .inbox__row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 0.45em; padding-block: 1em; }
  :where(html.exton-on) .inbox__kind { grid-column: 1; grid-row: 1; }
  :where(html.exton-on) .inbox__status { grid-column: 2; grid-row: 1; justify-self: end; }
  :where(html.exton-on) .inbox__what, :where(html.exton-on) .inbox__cell { grid-column: 1 / -1; }
  :where(html.exton-on) .inbox__cell[data-l]::before { content: attr(data-l) ": "; color: var(--navy); }
  :where(html.exton-on) .inbox__cell .sr-only { display: none; }  
  :where(html.exton-on) .brief__row { grid-template-columns: 1fr; row-gap: 0.2em; padding-block: 0.9em; }
}
@media (max-width: 650px) and (orientation: portrait) {
  :where(html.exton-on) .inbox__cell, :where(html.exton-on) .brief__row dt { font-size: max(14px, var(--t-p)); }
  :where(html.exton-on) .inbox__kind { font-size: max(12px, calc(var(--t-p) * 0.72)); }
  :where(html.exton-on) .inbox__status { font-size: max(12px, calc(var(--t-p) * 0.86)); }
}
/* Exton adaptations: technical ledger, local request desk and sample inbox. */
:root { --exton-accent:#71D2FF; --t-p:max(16px, var(--t-base)); }
:where(html.exton-on) .brand img {width:clamp(100px,10vw,160px);height:auto;object-fit:contain;}
:where(html.exton-on) .tile__mark {width:75px;height:auto;object-fit:contain;}
:where(html.exton-on) .home-hero__lead {font-family:var(--f-serif);font-weight:500;font-size:clamp(36px,5.3vw,76px);line-height:1.08;letter-spacing:-.035em;}
:where(html.exton-on) .home-sec__title {font-size:clamp(32px,4.4vw,64px);line-height:1.1;}
:where(html.exton-on) .fact__stat {font-size:clamp(28px,4.2vw,60px);line-height:1.12;overflow-wrap:break-word;}
:where(html.exton-on) .ledger__head,:where(html.exton-on) .ledger__row {grid-template-columns:minmax(0,1.4fr) minmax(0,2fr) minmax(0,1fr) auto;}
:where(html.exton-on) .ledger__price b {font:400 max(15px,var(--t-p))/1.45 var(--f-sans);white-space:normal;}
:where(html.exton-on) .ledger__row {transition:background-color .18s;}
:where(html.exton-on) .ledger__row:focus-within {background:color-mix(in srgb,var(--cat) 6%,white);}
:where(html.exton-on) .ledger__go a {min-height:44px;min-width:44px;display:inline-flex;align-items:center;gap:.5em;}
:where(html.exton-on) .ledger__go a img {transition:transform .18s;}
:where(html.exton-on) .ledger__go a:active {transform:scale(.98);}
@media(hover:hover) and (pointer:fine){:where(html.exton-on) .ledger__row:hover {background:color-mix(in srgb,var(--cat) 6%,white);} :where(html.exton-on) .ledger__go a:hover img {transform:translateX(4px);}}
:where(html.exton-on) button,:where(html.exton-on) a,:where(html.exton-on) input,:where(html.exton-on) select,:where(html.exton-on) textarea {touch-action:manipulation;}
:where(html.exton-on) button,:where(html.exton-on) .btn,:where(html.exton-on) .navlink,:where(html.exton-on) .menu-top,:where(html.exton-on) .dock a,:where(html.exton-on) .dock button,:where(html.exton-on) .carousel__arrow {min-height:44px;min-width:44px;}
:where(html.exton-on) .enquiry__tab {white-space:normal;min-height:48px;font-size:14px;letter-spacing:.04em;}
:where(html.exton-on) .enquiry input,:where(html.exton-on) .enquiry select,:where(html.exton-on) .enquiry textarea {min-width:0;width:100%;font-size:16px;min-height:44px;}
:where(html.exton-on) .enquiry input[type=checkbox] {width:20px;min-height:20px;flex:none;}
:where(html.exton-on) .consent__label {min-height:44px;align-items:flex-start;} /* box sits on the first line of a two-line label */
:where(html.exton-on) .enquiry .field-row {min-width:0;}
:where(html.exton-on) .enquiry [aria-invalid=true] {border-color:#a51c30;outline-color:#a51c30;}
:where(html.exton-on) .equipment-row {grid-template-columns:minmax(0,1fr) 75px;align-items:end;overflow:hidden;}
:where(html.exton-on) .equipment-row + .equipment-row {margin-top:14px;}
:where(html.exton-on) .equipment-add,:where(html.exton-on) .equipment-remove {font:500 14px var(--f-sans);color:var(--navy);text-decoration:underline;text-underline-offset:4px;text-align:left;}
:where(html.exton-on) .equipment-remove {grid-column:1/-1;justify-self:start;}
:where(html.exton-on) .local-photos {display:flex;gap:12px;flex-wrap:wrap;}
:where(html.exton-on) .local-photos figure {width:100px;min-width:0;}
:where(html.exton-on) .local-photos img {width:100px;height:70px;object-fit:cover;}
:where(html.exton-on) .local-photos figcaption {font-size:12px;overflow-wrap:anywhere;}
:where(html.exton-on) .sample-request {border-bottom:1px solid #d7dee3;}
:where(html.exton-on) .sample-request .inbox__row {width:100%;text-align:left;font-family:var(--f-sans);color:var(--navy);border:0;transition:background .18s;padding:18px 10px;}
:where(html.exton-on) .sample-request .inbox__row[aria-expanded=true] {background:#e3e8eb;}
:where(html.exton-on) .sample-detail {overflow:hidden;}
:where(html.exton-on) .sample-detail>div {padding:20px;}
:where(html.exton-on) .sample-detail .brief__row dd {font-size:18px;}
:where(html.exton-on) .inbox__status {white-space:normal;}
:where(html.exton-on) .tag-sample {display:inline-block;color:#0C1125;background:#71D2FF;border-color:#0C1125;font-size:12px;letter-spacing:.02em;}
:where(html.exton-on) .more__row {grid-template-columns:minmax(0,1fr) auto;align-items:center;}
:where(html.exton-on) .pcard__meta {font-size:max(14px,var(--t-p));}
:where(html.exton-on) .pcard__meta dt,:where(html.exton-on) .pcard__town {opacity:1;color:white;}
:where(html.exton-on) .pcard__body {color:white;}
:where(html.exton-on) .chip-note {opacity:1;}
:where(html.exton-on) .channel__plain {font-size:16px;line-height:1.5;}
:where(html.exton-on) .thanks__card {max-width:min(760px,92vw);}
:where(html.exton-on) .thanks__list {font-size:16px;line-height:1.5;}
:where(html.exton-on) .thanks__title {font-size:clamp(28px,4vw,52px);}
:where(html.exton-on) .thanks__note {font-size:14px;}
:where(html.exton-on) .panel__close {min-width:44px;min-height:44px;}
@media(min-width:1025px){
 :where(html.exton-on) .page--desk[data-slug="contact"] .desk__stack {grid-column:4/7;}
 :where(html.exton-on) .page--desk[data-slug="contact"] .desk__aside {grid-column:7/13;align-self:stretch;justify-content:flex-start;min-height:0;overflow:hidden;}
 :where(html.exton-on) .desk__aside .enquiry {height:100%;max-height:100%;overflow-y:auto;overscroll-behavior:contain;padding:8px 18px 28px 4px;margin:0;--field:16px;--field-pad:6px;}
 :where(html.exton-on) .enquiry__form {gap:14px!important;}
 :where(html.exton-on) .enquiry .field-row--3 {grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;}
}
@media(max-width:650px){
 :where(html.exton-on) .home-hero__lead {font-size:clamp(32px,10vw,44px);}
 :where(html.exton-on) .home-hero__body {gap:28px;}
 :where(html.exton-on) .home-facts {grid-template-columns:repeat(2,minmax(0,1fr));}
 :where(html.exton-on) .home-facts dd {font-size:28px;}
 :where(html.exton-on) .ledger__head {display:none;}
 :where(html.exton-on) .ledger__row {grid-template-columns:minmax(0,1fr);gap:12px;padding:20px 0;}
 :where(html.exton-on) .ledger__row>* {grid-column:1!important;grid-row:auto!important;}
 :where(html.exton-on) .ledger__price::before {content:attr(data-l);display:block;font-size:12px;margin-bottom:4px;color:var(--cat);}
 :where(html.exton-on) .ledger__size {font-size:24px;}
 :where(html.exton-on) .ledger__price b {font-size:16px;}
 :where(html.exton-on) .ledger__price small,:where(html.exton-on) .ledger__size small {font-size:14px;}
 :where(html.exton-on) .enquiry .field-row {grid-template-columns:1fr;gap:12px;}
 :where(html.exton-on) .enquiry .equipment-row {grid-template-columns:minmax(0,1fr) 70px;}
 :where(html.exton-on) .more__row {grid-template-columns:1fr;gap:10px;}
 :where(html.exton-on) .inbox__what {font-size:20px;}
 :where(html.exton-on) .inbox__row {grid-template-columns:minmax(0,1fr);}
 :where(html.exton-on) .inbox__row>* {grid-column:1!important;grid-row:auto!important;justify-self:start;}
 :where(html.exton-on) .desk__aside {width:100%;min-width:0;}
 :where(html.exton-on) .drawer__links a {font-size:clamp(24px,7vw,34px);}
 :where(html.exton-on) .brand img {width:115px;}
 :where(html.exton-on) .brand {min-height:44px;}
 :where(html.exton-on) .masthead {isolation:isolate;}
 :where(html.exton-on) .dock {bottom:max(14px,env(safe-area-inset-bottom));}
 :where(html.exton-on) .turn-device {display:none!important;}
}
html.exton-on[data-input="pointer"] :focus-visible:not(input):not(textarea):not(select):not([contenteditable="true"]) {outline:none!important;box-shadow:none;}
:where(html.exton-on) [tabindex="-1"]:focus {outline:none!important;}
html.exton-on:not([data-input="pointer"]) :is(a,button,input,select,textarea):focus-visible {outline:2px solid currentColor;outline-offset:3px;}
html.exton-on[data-input="pointer"] .pcard__link:focus-visible::after {outline:none;}
@media(prefers-reduced-motion:reduce){
 :where(html.exton-on) *,:where(html.exton-on) *::before,:where(html.exton-on) *::after {animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important;}
 :where(html.exton-on) .ticker__track {transform:none!important;}
 :where(html.exton-on) .scene__runway,:where(html.exton-on) .film__runway {display:none;}
 :where(html.exton-on) .scene .frame {position:relative!important;}
 :where(html.exton-on) .scene {height:auto!important;}
}

:where(html.exton-on) .field-error {font-size:13px;line-height:1.4;color:#a51c30;}
:where(html.exton-on) .tile__blurb,:where(html.exton-on) .credit__text,:where(html.exton-on) .sndr__studio,:where(html.exton-on) .drawer__foot,:where(html.exton-on) .drawer__links a.drawer__links--minor {opacity:1;}
:where(html.exton-on) .next__shade {background:#0C1125b3!important;}
@media (hover: hover) and (pointer: fine) { :where(html.exton-on) .next:hover .next__shade {background:#0C1125a6!important;} }
:where(html.exton-on) .lost__code {color:#54595F;}
:where(html.exton-on) .thanks__text,:where(html.exton-on) .thanks__note {color:#71D2FF;}
:where(html.exton-on) .carousel__viewport {touch-action:pan-y pinch-zoom;}
:where(html.exton-on) button {user-select:none;-webkit-tap-highlight-color:transparent;}
:where(html.exton-on) .turn-device {display:none!important;}
@media (max-width:650px){
 :where(html.exton-on) .dock {bottom:max(14px,env(safe-area-inset-bottom))!important;}
 :where(html.exton-on) .colophon {white-space:normal;}
}

:where(html.exton-on) .backdrop__image {filter:brightness(.35);}
@media(max-width:650px){
 :where(html.exton-on) .agtable tr {grid-template-columns:minmax(0,1fr);gap:8px;}
 :where(html.exton-on) .agtable tr>* {grid-column:1!important;grid-row:auto!important;text-align:left!important;}
 :where(html.exton-on) .intro__title {line-height:1.12;}
}
/* Long single-word stats (Gítarmagnarar, Bassamagnarar) shrink instead of breaking mid-word */
:where(html.exton-on) .fact__stat--long {font-size:clamp(22px,2.5vw,40px);overflow-wrap:normal;hyphens:manual;}
/* Tablet: two-column ledger rows, so the size column never runs into the brand list */
@media (min-width:651px) and (max-width:1024px) {
 :where(html.exton-on) .ledger__head,:where(html.exton-on) .ledger__row {grid-template-columns:minmax(0,1fr) minmax(0,1fr);}
 :where(html.exton-on) .ledger__size {grid-column:1/-1;}
}
:where(html.exton-on) .board__title {font-size:min(var(--t-h2),3.4vw);}
/* Display face = Tanker (Sindri 2026-10-28 "better font"): condensed poster caps, set at its one real weight with open tracking */
:where(html.exton-on) .home-hero__lead {font-weight:400;letter-spacing:0.01em;line-height:0.95;font-size:clamp(46px,7.4vw,118px);} /* condensed caps take ~40% less width than Clash, so the hero line runs larger */
:where(html.exton-on) .drawer__links a,:where(html.exton-on) .intro__title,:where(html.exton-on) .cta__title,:where(html.exton-on) .wellness__title,:where(html.exton-on) .quote__text,:where(html.exton-on) .board__title,:where(html.exton-on) .thanks__title,:where(html.exton-on) .lost__code {font-weight:400;letter-spacing:0.01em;}
:where(html.exton-on) .ticker__word {font-family:var(--f-serif);font-weight:400;letter-spacing:0.01em;}
/* One type system (Sindri 2026-10-28 "so many different fonts"): Tanker for every heading and big figure on three sizes,
   Cabinet Grotesk for all reading and UI text at 400/500, no all-caps labels, arrows drawn as icons instead of fallback glyphs */
:where(html.exton-on) {--d2:clamp(40px,4.6vw,72px);--d3:clamp(26px,2.5vw,40px);}
:where(html.exton-on) .intro__title,:where(html.exton-on) .quote__text,:where(html.exton-on) .cta__title,:where(html.exton-on) .wellness__title,:where(html.exton-on) .home-sec__title,:where(html.exton-on) .statement__title,:where(html.exton-on) .next__title,:where(html.exton-on) .board__title,:where(html.exton-on) .fact__stat,:where(html.exton-on) .end__phone,:where(html.exton-on) .thanks__title {font-family:var(--f-serif);font-weight:400;font-size:var(--d2);line-height:0.98;letter-spacing:0.01em;}
:where(html.exton-on) .statement__lead {font:inherit;letter-spacing:inherit;}
:where(html.exton-on) .ledger__size,:where(html.exton-on) .tile__name,:where(html.exton-on) .pcard__link,:where(html.exton-on) .how__title,:where(html.exton-on) .need__title,:where(html.exton-on) .more__name,:where(html.exton-on) .fact__stat--long {font-family:var(--f-serif);font-weight:400;font-size:var(--d3);line-height:1;letter-spacing:0.01em;}
:where(html.exton-on) .ledger__size small {font-family:var(--f-sans);font-weight:400;letter-spacing:0;line-height:1.3;}
:where(html.exton-on) .chip,:where(html.exton-on) .board__notice-in b,:where(html.exton-on) .tag-sample,:where(html.exton-on) .inbox__kind {font-family:var(--f-sans);text-transform:none;letter-spacing:0;}
:where(html.exton-on) .how__n {font-family:var(--f-sans);}
:where(html.exton-on) .glyph {display:inline-block;width:0.7em;height:0.7em;margin-left:0.35em;vertical-align:-0.02em;}
@media (max-width:650px){ :where(html.exton-on) .ledger__size {font-size:28px;} }
:where(html.exton-on) .fact__stat {font-size:clamp(30px,3.4vw,54px);overflow-wrap:normal;hyphens:manual;} /* stats sit in a narrow column: whole words only */
`
}
