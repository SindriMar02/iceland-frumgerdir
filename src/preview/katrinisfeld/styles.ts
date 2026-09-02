/**
 * Katrín Ísfeld — one stylesheet for the whole site.
 *
 * Everything is scoped under .ki-root and every keyframe is prefixed ki-,
 * because this design shares a bundle with a hundred others in the catalogue
 * build and an unscoped rule bleeds across all of them.
 *
 * The fluid unit --u is defined on .ki-root and nowhere else. Type sizes come
 * from fluid(n, floor) in kit.tsx: a viewport-scaled size with a hard pixel
 * floor, so nothing collapses below a readable size on a phone.
 */
import { fluid } from './kit'

const CREAM = '#EFEAE2'
const INK = '#231F1B'
const CHARCOAL = '#1D1B19'
const WINE = '#8C3A34'

export const COLOURS = { CREAM, INK, CHARCOAL, WINE }

const DISPLAY = "'Sentient', Georgia, serif"
const SANS = "'Archia', system-ui, sans-serif"
const MONO = "'Geist Mono', ui-monospace, monospace"
const OUT = 'cubic-bezier(.25,1,.5,1)'

export const CSS = `
.ki-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --ki-ground: ${CREAM};
  --ki-ink: ${INK};
  --ki-wine: ${WINE};
  --ki-copper: #C68A5E;
  /* Easing measured off the two dissected references, not invented — see
     DESIGN.md. primary/secondary are OH Architecture's own two curves,
     cross is the one it crossfades its facade/interior pair on. */
  --ki-ease-primary: cubic-bezier(.83, 0, .17, 1);
  --ki-ease-secondary: cubic-bezier(.16, 1, .3, 1);
  --ki-ease-cross: cubic-bezier(.76, 0, .24, 1);
  background: var(--ki-ground);
  color: var(--ki-ink);
  font-family: ${SANS};
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.ki-root [id] { scroll-margin-top: 96px; }
@media (max-width: 640px) { .ki-root [id] { scroll-margin-top: 72px; } }
.ki-root a, .ki-root button { touch-action: manipulation; }
.ki-root img, .ki-root picture { display: block; max-width: 100%; }
.ki-root picture > img { width: 100%; height: auto; }
.ki-skra-n, .ki-loader-pct, .ki-num { font-variant-numeric: tabular-nums; }
.ki-root ::selection { background: var(--ki-wine); color: #F4EEE6; }
.ki-root :focus-visible { outline: 2px solid var(--ki-copper); outline-offset: 3px; border-radius: 2px; }
.ki-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.ki-skip {
  position: fixed; top: 8px; left: 8px; z-index: 120;
  background: ${CHARCOAL}; color: #EDE7DE; padding: 10px 16px;
  font-family: ${MONO}; font-size: 13px; text-decoration: none;
  transform: translateY(-160%); transition: transform .2s ${OUT};
}
.ki-skip:focus { transform: none; }

/* section colour worlds — the semantic theme swap */
[data-ki-band] { position: relative; }
[data-ki-band='dark'] { background: ${CHARCOAL}; color: #EDE7DE; --ki-mute: #B9B1A5; --ki-hair: rgb(237 231 222 / .16); }
[data-ki-band='light'] { background: ${CREAM}; color: ${INK}; --ki-mute: #6E675D; --ki-hair: rgb(35 31 27 / .16); --ki-copper: #8A5A33; }
.ki-verk-sulu { background: #241B19; }
.ki-italskar { background: #3B2320; color: #EFE6DC; }

/* ── chrome ───────────────────────────────────────────────────────────── */
.ki-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  pointer-events: none;
}
.ki-nav a, .ki-nav button { pointer-events: auto; text-decoration: none; transition: color .4s linear, opacity .25s ${OUT}; }
.ki-nav a[data-ki-on='dark'], .ki-nav button[data-ki-on='dark'] { color: #EDE7DE; }
.ki-nav a[data-ki-on='light'], .ki-nav a:not([data-ki-on]),
.ki-nav button[data-ki-on='light'], .ki-nav button:not([data-ki-on]) { color: ${INK}; }
@media (hover: hover) and (pointer: fine) { .ki-nav a:hover { opacity: .68; } }
.ki-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; padding: 9px 0; }
.ki-nav-links { display: flex; gap: calc(var(--u) * 30); font-size: ${fluid(14, 13)}; }
.ki-nav-links a { padding: 10px 0; position: relative; }
.ki-nav-links a::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .4s ${OUT};
}
@media (hover: hover) and (pointer: fine) { .ki-nav-links a:hover::after { transform: none; } }
.ki-nav-links a[aria-current='page']::after { transform: none; opacity: .5; }
.ki-nav-cta { font-size: ${fluid(14, 13)}; border-bottom: 1px solid currentColor; padding: 9px 0 6px; }
.ki-burger { display: none; background: none; border: 0; padding: 10px 0 10px 12px; cursor: pointer; }
.ki-burger-bars { display: block; width: 26px; }
.ki-burger-bars i { display: block; height: 1px; background: currentColor; transition: transform .4s ${OUT}; }
.ki-burger-bars i + i { margin-top: 7px; }
.ki-burger[aria-expanded='true'] .ki-burger-bars i:first-child { transform: translateY(4px) rotate(9deg); }
.ki-burger[aria-expanded='true'] .ki-burger-bars i:last-child { transform: translateY(-4px) rotate(-9deg); }

/* condensed past one viewport of scroll: the full nav gives way to just the
   mark and the panel trigger, so the header stops competing with the page */
.ki-nav { transition: padding .5s ${OUT}; }
.ki-nav[data-ki-condensed='true'] { padding-top: calc(var(--u) * 13); padding-bottom: calc(var(--u) * 13); }
.ki-nav-links, .ki-nav-cta { transition: opacity .35s ${OUT}, transform .35s ${OUT}; }
.ki-nav[data-ki-condensed='true'] .ki-nav-links,
.ki-nav[data-ki-condensed='true'] .ki-nav-cta { opacity: 0; pointer-events: none; transform: translateY(-4px); }
.ki-nav[data-ki-condensed='true'] .ki-burger { display: block; }

.ki-panel {
  position: fixed; inset: 0; z-index: 39; background: ${CHARCOAL}; color: #EDE7DE;
  display: flex; flex-direction: column; justify-content: center; gap: calc(var(--u) * 30);
  padding: 96px 24px 32px;
}
.ki-panel[hidden] { display: none; }
.ki-panel nav { display: flex; flex-direction: column; }
.ki-panel nav a {
  font-family: ${DISPLAY}; font-weight: 300; font-size: clamp(28px, 8vw, 44px);
  color: inherit; text-decoration: none; padding: 9px 0;
  border-bottom: 1px solid rgb(237 231 222 / .12);
}
.ki-panel nav a.ki-panel-sub { font-family: ${SANS}; font-size: 16px; padding-left: 18px; color: #B9B1A5; }
.ki-panel-foot { display: flex; flex-wrap: wrap; gap: 20px; font-family: ${MONO}; font-size: 13px; }
.ki-panel-foot a { color: var(--ki-copper); text-decoration: none; padding: 8px 0; }
@media (max-width: 860px) {
  .ki-nav-links, .ki-nav-cta { display: none; }
  .ki-burger { display: block; }
}
/* The panel used to be hard-hidden above 861px, because the burger only
   existed on phones. The condensing nav puts a burger on desktop too, so
   that rule made the desktop burger open nothing at all. Visibility is
   already state-driven: React sets the hidden attribute when closed and
   .ki-panel[hidden] hides it, so the width rule was redundant AND the bug. */

/* ── type ─────────────────────────────────────────────────────────────── */
.ki-headline { font-family: ${DISPLAY}; font-weight: 300; line-height: 1.13; letter-spacing: .002em; margin: 0 0 calc(var(--u) * 24); }
.ki-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.ki-word { display: inline-block; }
.ki-body { font-size: ${fluid(17, 15.5)}; line-height: 1.68; color: var(--ki-mute, #6E675D); max-width: 62ch; margin: 0 0 calc(var(--u) * 20); }
.ki-body:last-child { margin-bottom: 0; }
.ki-body a { color: inherit; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.ki-lead { font-size: ${fluid(21, 17)}; line-height: 1.5; color: inherit; max-width: 40ch; margin: 0 0 calc(var(--u) * 30); }
.ki-stat { font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; color: var(--ki-mute, #6E675D); margin: calc(var(--u) * 30) 0 0; }
.ki-kicker { font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: #8A5A33; margin: 0 0 calc(var(--u) * 16); }
[data-ki-band='dark'] .ki-kicker, .ki-verk-sulu .ki-kicker, .ki-italskar .ki-kicker { color: #D9A87E; }

/* ── reveals ──────────────────────────────────────────────────────────── */
/* Word-by-word rise, staggered in CSS off each word's own index, so the
   headline entrance costs one class flip rather than a tween per word. */
.ki-js .ki-rv-h .ki-word { transform: translateY(116%); opacity: 0; }
.ki-js .ki-rv-h.is-in .ki-word {
  transform: none; opacity: 1;
  transition: transform 1.05s cubic-bezier(.16,1,.3,1) calc(var(--i, 0) * 55ms),
              opacity .7s linear calc(var(--i, 0) * 55ms);
}
.ki-static .ki-rv-h .ki-word, .ki-root:not(.ki-js) .ki-rv-h .ki-word { transform: none; opacity: 1; }

.ki-js .ki-rv { opacity: 0; transform: translateY(30px); }
.ki-js .ki-rv.is-in { opacity: 1; transform: none; transition: opacity 1.1s ${OUT}, transform 1.1s ${OUT}; }
.ki-rule { display: block; width: calc(var(--u) * 220); height: 1px; background: currentColor; opacity: .4; margin-bottom: calc(var(--u) * 34); }
.ki-js .ki-rule { transform: scaleX(0); transform-origin: left; opacity: 0; }
.ki-js .ki-rule.is-in { transform: none; opacity: .4; transition: transform 1.2s ${OUT}, opacity .6s linear; }

.ki-slide, .ki-shutter, .ki-plain { position: relative; overflow: hidden; margin: 0; background: rgb(0 0 0 / .08); }
.ki-slide picture, .ki-shutter picture, .ki-plain picture,
.ki-slide img, .ki-shutter img, .ki-plain img { width: 100%; height: 100%; object-fit: cover; }
.ki-js .ki-slide { clip-path: polygon(0 12%, 100% 0, 100% 88%, 0 100%); opacity: 0; }
.ki-js .ki-slide img { transform: scale(1.22); }
.ki-js .ki-slide.is-in { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; transition: clip-path 1.1s ${OUT}, opacity .5s ${OUT}; }
.ki-js .ki-slide.is-in img { transform: none; transition: transform 1.3s ${OUT}; }
.ki-js .ki-shutter { clip-path: inset(0 50% 0 50%); }
.ki-js .ki-shutter img { transform: scale(1.2); }
.ki-js .ki-shutter.is-in { clip-path: inset(0 0 0 0); transition: clip-path 1.2s ${OUT}; }
.ki-js .ki-shutter.is-in img { transform: none; transition: transform 1.5s ${OUT}; }

.ki-static .ki-rv, .ki-static .ki-slide, .ki-static .ki-shutter,
.ki-root:not(.ki-js) .ki-rv, .ki-root:not(.ki-js) .ki-slide, .ki-root:not(.ki-js) .ki-shutter {
  opacity: 1; transform: none; clip-path: none;
}
.ki-static .ki-slide img, .ki-static .ki-shutter img { transform: none; }
.ki-static [data-ki-par], .ki-root:not(.ki-js) [data-ki-par] { transform: none !important; }
.ki-static [data-ki-par='spread'] > span, .ki-root:not(.ki-js) [data-ki-par='spread'] > span { transform: none !important; }

/* ── the form ─────────────────────────────────────────────────────────── */
.ki-form { display: grid; gap: calc(var(--u) * 22); max-width: 34rem; }
.ki-form label { display: grid; gap: 8px; }
.ki-form label > span { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .1em; text-transform: uppercase; color: var(--ki-mute); }
.ki-form input, .ki-form textarea {
  font: inherit; font-size: 16px; /* 16px or iOS zooms the whole page on focus */
  color: inherit; background: transparent;
  border: 0; border-bottom: 1px solid var(--ki-hair); border-radius: 0;
  padding: 10px 0; width: 100%; resize: vertical;
  transition: border-color .3s ${OUT};
}
.ki-form input:focus, .ki-form textarea:focus { outline: none; border-bottom-color: var(--ki-copper); }
.ki-form input::placeholder, .ki-form textarea::placeholder { color: var(--ki-mute); opacity: .7; }
.ki-form button { border: 0; cursor: pointer; justify-self: start; text-align: left; }
.ki-form button[disabled] { opacity: .5; cursor: progress; }
@media (prefers-reduced-motion: reduce) {
  .ki-hero-media img { transform: none !important; }
  .ki-word { transform: none !important; opacity: 1 !important; }
  .ki-root * { scroll-behavior: auto !important; }
}

/* group entrances: a 45ms wave, restarted per grid so nothing accumulates */
.ki-js .ki-grid > *:nth-child(3n+2) { transition-delay: 45ms; }
.ki-js .ki-grid > *:nth-child(3n+3) { transition-delay: 90ms; }

/* ── shared layout ────────────────────────────────────────────────────── */
.ki-wrap { padding: calc(var(--u) * 130) calc(var(--u) * 34); }
.ki-proj-hero + .ki-wrap { padding-top: calc(var(--u) * 84); }
.ki-wrap-tight { padding: calc(var(--u) * 96) calc(var(--u) * 34); }
.ki-measure { max-width: calc(var(--u) * 900); }
.ki-pagehead { padding: calc(var(--u) * 190) calc(var(--u) * 34) calc(var(--u) * 70); }
.ki-pagehead .ki-headline { max-width: calc(var(--u) * 1000); }
.ki-crumbs { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .08em; color: var(--ki-mute); margin: 0 0 calc(var(--u) * 22); }
.ki-crumbs a { display: inline-block; color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; padding: 4px 0 5px; }
.ki-crumbs span { opacity: .5; padding: 0 .5em; }
.ki-lockup { height: auto; width: clamp(150px, calc(var(--u) * 210), 210px); margin: 0 0 calc(var(--u) * 34); }

/* ── the work grid ────────────────────────────────────────────────────── */
.ki-cat-head { display: flex; align-items: baseline; gap: calc(var(--u) * 14);
  font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; letter-spacing: .13em; text-transform: uppercase;
  color: #D9A87E; border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 18);
  margin: 0 0 calc(var(--u) * 28); }
[data-ki-band='light'] .ki-cat-head { color: #8A5A33; }
.ki-cat-head-n { font-family: ${SANS}; letter-spacing: 0; text-transform: none; color: var(--ki-mute); }
.ki-cat-head a { margin-left: auto; padding: 5px 0; color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; }
.ki-grid { list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
  gap: calc(var(--u) * 40) calc(var(--u) * 28); }
.ki-cluster + .ki-cluster { margin-top: calc(var(--u) * 76); }
.ki-card { position: relative; }
/* the ground is set per card to that photograph's own sampled colour, so the
   fallback here only ever shows for a card with no colour on file */
.ki-card-fig { margin: 0; overflow: hidden; position: relative; background: rgb(0 0 0 / .18); }
.ki-card-fig picture, .ki-card-fig img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.ki-card-fig img { transition: transform .7s ${OUT}; }
/* second photograph, mounted only once the card has been reached */
.ki-card-fig-alt { position: absolute; inset: 0; opacity: 0; transition: opacity 1s var(--ki-ease-cross); }
.ki-card-fig-alt picture, .ki-card-fig-alt img { width: 100%; height: 100%; aspect-ratio: auto; object-fit: cover; }
@media (hover: hover) and (pointer: fine) {
  .ki-card:hover .ki-card-fig img { transform: scale(1.045); }
  .ki-card:hover .ki-card-fig-alt, .ki-card:focus-within .ki-card-fig-alt { opacity: 1; }
}
.ki-static .ki-card-fig-alt { display: none; }
.ki-card-meta { padding-top: 12px; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.ki-card-name { font-size: ${fluid(16.5, 15)}; }
.ki-card-name a { display: inline-block; padding: 3px 0; position: relative; }
.ki-card-name a::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 1px; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .725s var(--ki-ease-primary);
}
@media (hover: hover) and (pointer: fine) {
  .ki-card:hover .ki-card-name a::after, .ki-card-name a:focus-visible::after { transform: none; }
}
.ki-card a { color: inherit; text-decoration: none; }
/* the whole card is the hit area, without nesting anything inside the link */
.ki-card a::after { content: ''; position: absolute; inset: 0; }
.ki-card-cat { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .08em; color: var(--ki-mute); white-space: nowrap; }

/* ── material bands: the palette, carried by the material ─────────────── */
.ki-mat { margin-top: calc(var(--u) * 56); }
.ki-mat-band {
  position: relative; margin: 0; overflow: hidden;
  height: clamp(104px, calc(var(--u) * 168), 200px);
}
.ki-root .ki-mat-band picture, .ki-root .ki-mat-band picture > img {
  width: 100%; height: 100%; object-fit: cover;
}
.ki-mat-name {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  gap: calc(var(--u) * 26);
  font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .28em;
  text-transform: uppercase; color: ${INK};
}
.ki-mat-hex { opacity: .55; letter-spacing: .12em; }
/* The three dark materials take cream type over a scrim; the two light ones
   need neither — ink measures 7.12:1 and 4.93:1 on their WORST pixel under
   the label, not their average. .45 rather than .35 because eik is the
   weakest of the three (6.44 -> 7.91) and read soft on screen even though
   the lower value technically passed. Re-measure if a texture changes. */
.ki-mat-band.is-dark .ki-mat-name { color: #F4EEE6; }
.ki-mat-band.is-dark .ki-mat-name::before {
  content: ''; position: absolute; inset: 0; background: rgb(0 0 0 / .45);
}
.ki-mat-band.is-dark .ki-mat-name > * { position: relative; }
@media (max-width: 640px) {
  .ki-mat-name { flex-direction: column; gap: 4px; letter-spacing: .2em; }
}

/* ── project page ─────────────────────────────────────────────────────── */
/* Arrival: the hero pins and the first section rises over it.
   Pure CSS — .ki-root uses overflow-x: clip, never hidden, so sticky
   survives (hidden would make the root a scroll container and every sticky
   descendant would silently scroll away instead of pinning).
   The pin is bounded by .ki-proj-arrival: once its bottom passes, the hero
   releases rather than staying composited for the whole page. */
.ki-proj-arrival { position: relative; }
.ki-proj-cover { position: relative; z-index: 1; }
.ki-proj-hero { position: sticky; top: 0; z-index: 0; height: min(78svh, 760px); min-height: 420px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .ki-proj-hero { position: relative; } }
.ki-root .ki-proj-hero picture, .ki-root .ki-proj-hero picture > img { width: 100%; height: 100%; object-fit: cover; }
/* Seventeen project photographs, every one a different exposure, and the
   fixed chrome sits on top of all of them. A scrim at the top is the only
   thing that makes the wordmark legible over a bright reception desk and a
   dark wardrobe alike. */
.ki-proj-hero::after {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 42%; pointer-events: none;
  background: linear-gradient(180deg, rgb(16 13 11 / .58), rgb(16 13 11 / .18) 55%, transparent);
}
.ki-proj-body { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: calc(var(--u) * 80); align-items: start; }
.ki-proj-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--u) * 34); }
.ki-proj-gallery > *:nth-child(3n+1) { grid-column: 1 / -1; }
.ki-facts { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 54); margin: calc(var(--u) * 44) 0 0; padding-top: calc(var(--u) * 26); border-top: 1px solid var(--ki-hair); }
.ki-facts dt { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .12em; text-transform: uppercase; color: var(--ki-mute); margin-bottom: 6px; }
.ki-facts dd { margin: 0; font-size: ${fluid(16, 15)}; }
.ki-nextprev { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px;
  border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 30); margin-top: calc(var(--u) * 70); }
.ki-nextprev a { display: block; padding: 4px 0; color: inherit; text-decoration: none; font-size: ${fluid(16, 15)}; max-width: 46%; }
.ki-nextprev small { display: block; font-family: ${MONO}; font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ki-mute); margin-bottom: 6px; }

/* ── register ─────────────────────────────────────────────────────────── */
.ki-skra-count { font-family: ${MONO}; font-size: ${fluid(14, 12.5)}; color: var(--ki-mute); margin: 0; }
.ki-skra-n { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(40, 26)}; color: currentColor; padding: 0 .1em; }
.ki-skra-flokkur { border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 26); }
.ki-skra-flokkur + .ki-skra-flokkur { margin-top: calc(var(--u) * 46); }
.ki-skra-cat-row { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; margin-bottom: calc(var(--u) * 16); }
.ki-skra-cat { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .13em; text-transform: uppercase; font-weight: 400; color: var(--ki-copper); margin: 0; }
.ki-skra-cat-n { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .08em; color: var(--ki-mute); }
.ki-skra-list { list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); column-gap: calc(var(--u) * 44); }
.ki-skra-row { position: relative; border-top: 1px solid var(--ki-hair); font-size: ${fluid(15.5, 14.5)}; transition: color .6s ${OUT}; }
.ki-skra-row a, .ki-skra-row > span { display: inline-block; padding: 12px 0; color: inherit; text-decoration: none; transition: transform .6s ${OUT}; }
.ki-skra-row > span { color: var(--ki-mute); }
.ki-skra-row::before { content: ''; position: absolute; left: 0; top: 50%; translate: 0 -50%;
  width: 10px; height: 1px; background: var(--ki-copper); transform: scaleX(0); transform-origin: left; transition: transform .6s ${OUT}; }
@media (hover: hover) and (pointer: fine) {
  .ki-skra-row:has(a):hover { color: var(--ki-copper); }
  .ki-skra-row:has(a):hover a { transform: translateX(18px); }
  .ki-skra-row:has(a):hover::before { transform: scaleX(1); }
}

/* ── prose blocks ─────────────────────────────────────────────────────── */
.ki-split { display: grid; grid-template-columns: 1fr 1.15fr; gap: calc(var(--u) * 70); align-items: center; }
.ki-split-fig { width: 100%; }
.ki-steps { list-style: none; margin: calc(var(--u) * 30) 0 0; padding: 0; counter-reset: ki-step;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: calc(var(--u) * 34); }
.ki-steps li { counter-increment: ki-step; border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 18); }
.ki-steps li::before { content: '0' counter(ki-step); display: block; font-family: ${MONO}; font-size: 12px; letter-spacing: .14em; color: var(--ki-copper); margin-bottom: 10px; }
.ki-steps h3 { font-family: ${SANS}; font-weight: 400; font-size: ${fluid(17, 16)}; margin: 0 0 8px; }
.ki-steps p { font-size: ${fluid(15.5, 14.5)}; line-height: 1.6; color: var(--ki-mute); margin: 0; }

.ki-faq { border-top: 1px solid var(--ki-hair); margin-top: calc(var(--u) * 34); }
.ki-faq details { border-bottom: 1px solid var(--ki-hair); }
.ki-faq summary { cursor: pointer; list-style: none; padding: calc(var(--u) * 22) 40px calc(var(--u) * 22) 0;
  font-size: ${fluid(17.5, 16)}; position: relative; }
.ki-faq summary::-webkit-details-marker { display: none; }
.ki-faq summary::after { content: ''; position: absolute; right: 6px; top: 50%; width: 11px; height: 11px;
  border-right: 1px solid currentColor; border-bottom: 1px solid currentColor;
  transform: translateY(-70%) rotate(45deg); transition: transform .35s ${OUT}; }
.ki-faq details[open] summary::after { transform: translateY(-20%) rotate(-135deg); }
.ki-faq .ki-body { padding: 0 0 calc(var(--u) * 24); }

/* ── contact ──────────────────────────────────────────────────────────── */
.ki-samband { padding: calc(var(--u) * 60) 0 0; }
.ki-samband-in { text-align: center; padding: calc(var(--u) * 130) calc(var(--u) * 34) calc(var(--u) * 64);
  background: #16211E; color: #E9EDE8;
  border-radius: calc(var(--u) * 420) calc(var(--u) * 420) 0 0; overflow: hidden;
  box-shadow: inset 0 1px 0 rgb(237 231 222 / .22); }
.ki-samband-in .ki-headline { margin-inline: auto; }
.ki-samband-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: calc(var(--u) * 34); margin-top: calc(var(--u) * 26); }
.ki-samband-tel { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(56, 30)}; color: inherit; text-decoration: none; transition: color .3s ${OUT}; }
@media (hover: hover) and (pointer: fine) { .ki-samband-tel:hover { color: var(--ki-copper); } }
.ki-samband-addr { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; color: #9AA79F; margin-top: calc(var(--u) * 20); }
.ki-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 70); align-items: start; }
.ki-dl { margin: 0; }
.ki-dl div { display: flex; gap: 16px; padding: 14px 0; border-top: 1px solid var(--ki-hair); }
.ki-dl dt { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .1em; text-transform: uppercase; color: var(--ki-mute); min-width: 108px; }
.ki-dl dd { margin: 0; font-size: ${fluid(16, 15)}; }
.ki-dl a { display: inline-block; padding: 3px 0; color: inherit; text-decoration: none; border-bottom: 1px solid var(--ki-hair); }
@media (hover: hover) and (pointer: fine) { .ki-dl a:hover { border-bottom-color: currentColor; } }

.ki-cta { position: relative; display: inline-block;
  font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; text-transform: uppercase;
  background: none; padding: 10px 0 12px; color: inherit;
  text-decoration: none; transition: color .3s ${OUT}, transform .16s ${OUT}; }
.ki-cta::after { content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 1px;
  background: currentColor; opacity: .38; transition: opacity .3s ${OUT}; }
@media (hover: hover) and (pointer: fine) { .ki-cta:hover::after { opacity: 1; } }
.ki-cta:active { transform: scale(.97); }
.ki-cta-row { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 40); margin-top: calc(var(--u) * 30); }

/* ── footer ───────────────────────────────────────────────────────────── */
.ki-foot { border-top: 1px solid rgb(237 231 222 / .14); padding: calc(var(--u) * 60) calc(var(--u) * 34) calc(var(--u) * 40); background: ${CHARCOAL}; color: #EDE7DE; }
.ki-foot-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: calc(var(--u) * 34); }
.ki-foot-grid nav, .ki-foot-grid > div { display: flex; flex-direction: column; align-items: flex-start; }
.ki-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; margin: 0 0 12px; }
.ki-foot-head { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: #9C948A; margin: 0 0 12px; }
.ki-foot-line { font-size: ${fluid(13.5, 13)}; color: #B9B1A5; margin: 0 0 6px; line-height: 1.65; }
.ki-foot-line a, .ki-foot-link { color: #B9B1A5; text-decoration: none; }
.ki-foot-line a { display: inline-block; padding: 4px 0; }
.ki-foot-link { font-size: ${fluid(13.5, 13)}; padding: 7px 0; line-height: 1.4; border-bottom: 1px solid transparent; }
@media (hover: hover) and (pointer: fine) { .ki-foot-link:hover, .ki-foot-line a:hover { color: #EDE7DE; border-bottom-color: currentColor; } }
.ki-foot-fine { font-family: ${MONO}; font-size: 12px; color: #9C948A; margin: calc(var(--u) * 40) 0 0; }

/* ── the name, as the last statement on the page ──────────────────────── */
/* Transplanted from the Sky Retreat footer, device for device, on this
   site's own engine: two words each in an overflow mask, rising from 105%
   on the reveal sweep with the second delayed, and the pair drifting apart
   under the scroll-linked spread primitive. No GSAP, no Lenis — the two
   motions already existed here. */
.ki-footwm {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: .4em; margin-top: calc(var(--u) * 46); padding-right: .06em;
}
.ki-footwm-word { display: block; overflow: hidden; }
.ki-footwm-word i {
  display: block; font-style: normal;
  font-family: ${DISPLAY}; font-weight: 300;
  /* 14.6vw is the reference's number, and it was set for SKY/RETREAT: ten
     characters in a narrow grotesk. KATRÍN/ÍSFELD is twelve in Sentient,
     which is much wider, so the pair collided in the middle and clipped both
     edges. Sized to the actual string instead, and space-between still
     pushes the two words to the margins the way the reference does. */
  font-size: clamp(2rem, 9.4vw, 8.6rem); line-height: .92;
  letter-spacing: -.01em; color: #EDE7DE;
  /* default is STANDING: no JS and reduced motion must never hide her name */
  transform: translateY(0);
}
/* only once the engine is running does it start hidden and rise */
.ki-js .ki-footwm:not(.is-in) .ki-footwm-word i { transform: translateY(105%); }
.ki-js .ki-footwm.is-in .ki-footwm-word i { transform: translateY(0); transition: transform 1s ${OUT}; }
.ki-js .ki-footwm.is-in .ki-footwm-word:last-child i { transition-delay: .09s; }
.ki-static .ki-footwm-word i { transform: translateY(0); }
/* the container carries .ki-rv only as the trigger — the mask rise is the
   motion, so cancel the reveal kit's own lift and keep just its fade */
.ki-js .ki-footwm.ki-rv { transform: none; }
@media (max-width: 640px) {
  .ki-footwm { flex-direction: column; align-items: flex-start; gap: 0; margin-top: calc(var(--u) * 34); }
}

/* ── the opening: arch curtain + dive, both CSS only ──────────────────────
   These run off the prerendered HTML, before React has parsed. The curtain is
   removed from the flow the instant its animation ends so it can never eat a
   click, and it is not rendered at all for a visitor who has already seen it
   this session — the shell's inline script stamps data-ki-seen on <html>
   before first paint, so there is no flash of a curtain that then vanishes. */
.ki-curtain {
  position: fixed; inset: 0; z-index: 90; background: ${CHARCOAL};
  display: grid; place-content: end center; pointer-events: none;
  animation: ki-curtain-lift .9s cubic-bezier(.7,0,.2,1) .35s both;
}
.ki-curtain-arch {
  width: min(74vw, 520px); height: min(56vh, 520px);
  border: 1px solid rgb(237 231 222 / .3); border-bottom: none;
  border-radius: calc(var(--u) * 400) calc(var(--u) * 400) 0 0;
  display: grid; place-content: center; text-align: center;
  animation: ki-arch-rise .95s ${OUT} both;
}
.ki-curtain-mark { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(38, 24)}; color: #EDE7DE; letter-spacing: .06em; margin: 0; }
@keyframes ki-arch-rise { from { transform: translateY(16%); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes ki-curtain-lift {
  from { opacity: 1; visibility: visible }
  99%  { opacity: 0; visibility: visible }
  to   { opacity: 0; visibility: hidden; display: none }
}
html[data-ki-seen] .ki-curtain { display: none; }
@media (prefers-reduced-motion: reduce) { .ki-curtain { display: none; } }

/* hero */
.ki-hero { position: relative; height: 100svh; min-height: 560px; overflow: hidden; display: grid; align-items: end; }
.ki-hero-media { position: absolute; inset: 0; }
/* These two containers set their own height, so the photograph inside has to
   fill it rather than fall back to its own ratio. Stated at this specificity
   deliberately: the base .ki-root picture > img height:auto rule that
   every other figure relies on out-ranks a plainer selector here, and when it
   won, the hero rendered 4:3 inside a 100svh box — fine at 1440 where the
   overflow is cropped, a third of a screen of photo above a wall of empty
   charcoal at 390. */
.ki-root .ki-hero-media picture, .ki-root .ki-hero-media picture > img { width: 100%; height: 100%; object-fit: cover; }
/* the camera settles into the first room. One transform on one element, so
   the compositor owns it and the main thread never sees the frames. */
.ki-hero-media img { animation: ki-dive 1.7s cubic-bezier(.6,0,0,1) .3s both; }
@keyframes ki-dive { from { transform: scale(2); transform-origin: 50% 75% } to { transform: none; transform-origin: 50% 75% } }
.ki-hero-scrim { position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(180deg, rgb(18 14 12 / .42), transparent 34%, rgb(16 12 10 / .55) 72%, rgb(14 11 9 / .82) 100%),
    linear-gradient(90deg, rgb(16 12 10 / .45), transparent 62%); }
.ki-hero-lockup { position: relative; z-index: 2; padding: 0 calc(var(--u) * 34) calc(var(--u) * 52); color: #F2ECE3; }
.ki-hero-title { color: inherit; }
/* The hero headline rises on arrival rather than on scroll: it is already in
   view, so waiting for an intersection would mean waiting forever. */
.ki-hero .ki-word { animation: ki-word-rise 1.15s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(.75s + var(--i, 0) * 60ms); }
@keyframes ki-word-rise { from { transform: translateY(116%); opacity: 0 } to { transform: none; opacity: 1 } }
.ki-hero-sub { font-size: ${fluid(17.5, 15.5)}; line-height: 1.6; max-width: 52ch; margin: calc(var(--u) * 20) 0 0;
  animation: ki-fade-up 1s ${OUT} 1.15s both; }
.ki-hero-cta { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 38); margin: calc(var(--u) * 26) 0 0;
  animation: ki-fade-up 1s ${OUT} 1.3s both; }
@keyframes ki-fade-up { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }
html[data-ki-seen] .ki-hero-media img,
html[data-ki-seen] .ki-hero .ki-word,
html[data-ki-seen] .ki-hero-sub,
html[data-ki-seen] .ki-hero-cta { animation-delay: 0s; }
@media (prefers-reduced-motion: reduce) {
  .ki-hero-media img, .ki-hero .ki-word, .ki-hero-sub, .ki-hero-cta { animation: none !important; }
}

/* one project in depth */
.ki-verk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--u) * 40); }
.ki-verk-grid .ki-slide:nth-child(2) { margin-top: calc(var(--u) * 70); }
.ki-verk-grid .ki-slide:nth-child(3) { margin-top: calc(var(--u) * -50); }
@media (max-width: 991px) {
  .ki-verk-grid { grid-template-columns: 1fr; }
  .ki-verk-grid .ki-slide:nth-child(2), .ki-verk-grid .ki-slide:nth-child(3) { margin-top: 0; }
}

/* the dome */
.ki-dome { padding: calc(var(--u) * 150) calc(var(--u) * 34) calc(var(--u) * 120); text-align: center; overflow: hidden; }
.ki-dome-title { margin-inline: auto; white-space: nowrap; }
.ki-dome-arch { width: min(100%, calc(var(--u) * 900)); margin: calc(var(--u) * 40) auto 0;
  border-radius: calc(var(--u) * 450) calc(var(--u) * 450) 0 0; overflow: hidden; }
.ki-dome-arch picture, .ki-dome-arch img { width: 100%; aspect-ratio: 4 / 4.4; object-fit: cover; }
.ki-dome-body { margin: calc(var(--u) * 44) auto 0; }
@media (max-width: 991px) { .ki-dome-title { white-space: normal; } }
@media (max-width: 640px) { .ki-dome { padding-left: 20px; padding-right: 20px; } }

/* ── responsive ───────────────────────────────────────────────────────── */
@media (max-width: 991px) {
  .ki-grid { --cols: 2; }
  .ki-proj-body { grid-template-columns: 1fr; gap: calc(var(--u) * 40); }
  .ki-foot-grid { grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 40) calc(var(--u) * 24); }
}
@media (max-width: 860px) {
  .ki-split, .ki-contact-grid { grid-template-columns: 1fr; gap: calc(var(--u) * 40); }
  .ki-split-fig { justify-self: stretch; max-width: none; width: 100%; }
}
@media (max-width: 640px) {
  .ki-wrap, .ki-wrap-tight { padding-left: 20px; padding-right: 20px; }
  .ki-pagehead { padding: 120px 20px 40px; }
  .ki-grid { --cols: 1; }
  .ki-proj-gallery { grid-template-columns: 1fr; }
  .ki-proj-gallery > *:nth-child(3n+1) { grid-column: auto; }
  .ki-samband-in { padding: calc(var(--u) * 130) 20px 28px; border-radius: calc(var(--u) * 620) calc(var(--u) * 620) 0 0; }
  .ki-foot { padding: 40px 20px 28px; }
  .ki-foot-grid { grid-template-columns: 1fr; gap: 26px; }
  .ki-facts { gap: 26px 40px; }
}
`
