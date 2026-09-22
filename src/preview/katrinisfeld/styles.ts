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
/* her steinn — the ground the descent resolves into */
const STONE = '#4A3527'
/* what the descent RESOLVES to — the exact bottom of the ground plates, so
   the hero and the page below are one continuous surface */
const GROUND = '#291D15'

export const COLOURS = { CREAM, INK, CHARCOAL, WINE, STONE, GROUND }

const DISPLAY = "'Sentient', Georgia, serif"
/* EVERY HEADLINE, 2026-09-22: Katrín asked for the Aurora Hills headline face
   (Alpino Light, same weight and tracking as aurorahills.is). Sentient stays
   on exactly two things: the footer's giant KATRÍN ÍSFELD, which she named as
   the letters she loves, and the italic "i" glyph on the slideshow. */
const HEAD = "'Alpino', system-ui, sans-serif"
/* the wordmark only — high-contrast display, deliberately not the face that
   sets the rest of the site */
const DISPLAY_ALT = "'Melodrama', 'Sentient', Georgia, serif"
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
  /* the CTA arrow, as a mask so it inherits currentColor on every band */
  --ki-arrow: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E");
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

/* ── chrome ───────────────────────────────────────────────────────────── */
.ki-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  pointer-events: none;
}
/* THE ONLY WASH LEFT ON THIS PAGE, and it is chrome rather than content: a
   fixed header sits on whatever the photograph happens to be doing under it,
   and on the landing frame that is a sunlit curtain and a plant. Measured
   there, light nav on bright glass came out at 1.00 — invisible. A gradient
   that is strongest in the top few pixels and gone by the time the header
   ends reads as the top of a photograph, not as a bar: it has no edge, it
   only exists over dark bands, and it fades with the same 400ms as the type
   it is protecting. */
.ki-nav::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: calc(var(--u) * 190);
  pointer-events: none; opacity: 0; transition: opacity .4s linear;
  background: linear-gradient(to bottom,
    rgb(14 11 10 / .80) 0%, rgb(14 11 10 / .60) 34%,
    rgb(14 11 10 / .26) 66%, rgb(14 11 10 / 0) 100%);
}
.ki-nav[data-ki-tone='dark']::before { opacity: 1; }
.ki-nav > * { position: relative; }
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
/* 44×45 hit area around a 26px glyph, pulled back so the bars keep their edge */
.ki-burger { display: none; background: none; border: 0; padding: 18px 9px; margin-right: -9px; cursor: pointer; }
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
.ki-nav[data-ki-condensed='true'] .ki-nav-cta { opacity: 0; pointer-events: none; transform: translateY(-4px);
  /* hidden, not just transparent: invisible links must not take keyboard focus */
  visibility: hidden; transition: opacity .35s ${OUT}, transform .35s ${OUT}, visibility 0s linear .35s; }
.ki-nav[data-ki-condensed='true'] .ki-burger { display: block; }
/* ON A DESKTOP THE WORDS STAY. The panel behind a burger was the only way to
   another page for most of every page's height; with a real ground under the
   header there is nothing for the text links to compete with. */
@media (min-width: 861px) {
  .ki-nav[data-ki-condensed='true'] .ki-nav-links,
  .ki-nav[data-ki-condensed='true'] .ki-nav-cta { opacity: 1; visibility: visible; pointer-events: auto; transform: none; }
  .ki-nav[data-ki-condensed='true'] .ki-burger { display: none; }
}
/* THE HEADER'S OWN GROUND, once the page has moved. Transparent it let body
   copy run straight through the wordmark in the same ink. A frosted bar in
   the tone of whatever band is under it, with a hairline, replaces the wash. */
.ki-nav::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: 0;
  -webkit-backdrop-filter: blur(16px) saturate(1.1); backdrop-filter: blur(16px) saturate(1.1);
  background: rgb(239 234 226 / .84); box-shadow: inset 0 -1px 0 rgb(35 31 27 / .1);
  transition: opacity .35s linear, background-color .4s linear;
}
.ki-nav[data-ki-tone='dark']::after { background: rgb(24 21 19 / .78); box-shadow: inset 0 -1px 0 rgb(237 231 222 / .1); }
.ki-nav[data-ki-scrolled='true']::after { opacity: 1; }
.ki-nav[data-ki-scrolled='true']::before { opacity: 0; }

.ki-panel {
  position: fixed; inset: 0; z-index: 39; background: ${CHARCOAL}; color: #EDE7DE;
  display: flex; flex-direction: column; justify-content: center; gap: calc(var(--u) * 30);
  padding: 96px 24px 32px;
}
/* IT HAS TO BE ABLE TO MOVE. The hidden attribute is display:none, and nothing
   transitions out of display:none — the panel appeared and vanished on the
   frame the button was pressed. It stays in the layout and fades instead,
   with its links rising in sequence; visibility is what takes it out of
   the tab order at the end of the fade, and pointer-events at the start. */
.ki-panel[hidden] {
  display: flex; visibility: hidden; opacity: 0; pointer-events: none;
  transition: opacity .3s ${OUT}, visibility 0s linear .3s;
}
.ki-panel {
  /* the ground arrives faster than what stands on it: a long cross-fade on
     a full-screen charcoal panel means half a second of the page showing
     through it, which reads as a bug rather than as a transition */
  opacity: 1; visibility: visible;
  transition: opacity .26s ${OUT}, visibility 0s linear 0s;
}
.ki-panel nav a, .ki-panel-foot {
  transition: opacity .5s ${OUT}, transform .5s ${OUT};
}
.ki-panel[hidden] nav a, .ki-panel[hidden] .ki-panel-foot {
  opacity: 0; transform: translateY(14px); transition-duration: .2s;
}
.ki-panel nav a:nth-child(1) { transition-delay: .10s; }
.ki-panel nav a:nth-child(2) { transition-delay: .16s; }
.ki-panel nav a:nth-child(3) { transition-delay: .22s; }
.ki-panel nav a:nth-child(4) { transition-delay: .28s; }
.ki-panel nav a:nth-child(5) { transition-delay: .34s; }
.ki-panel .ki-panel-foot { transition-delay: .38s; }
.ki-panel[hidden] nav a, .ki-panel[hidden] .ki-panel-foot { transition-delay: 0s; }
@media (prefers-reduced-motion: reduce) {
  .ki-panel, .ki-panel[hidden], .ki-panel nav a, .ki-panel .ki-panel-foot { transition: none; }
  .ki-panel[hidden] { visibility: hidden; }
}
.ki-panel nav { display: flex; flex-direction: column; }
.ki-panel nav a {
  font-family: ${HEAD}; font-weight: 300; font-size: clamp(28px, 8vw, 44px);
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
.ki-headline { font-family: ${HEAD}; font-weight: 300; line-height: 1.1; letter-spacing: -.005em; text-wrap: balance; margin: 0 0 calc(var(--u) * 24); }
.ki-nowrap { white-space: nowrap; }
/* no heading of any size leaves one word alone on its last line */
.ki-root h1, .ki-root h2, .ki-root h3 { text-wrap: balance; }
.ki-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.ki-word { display: inline-block; }
.ki-body { font-size: ${fluid(17, 15.5)}; line-height: 1.68; color: var(--ki-mute, #6E675D); max-width: 62ch; margin: 0 0 calc(var(--u) * 20); }
.ki-body:last-child { margin-bottom: 0; }
.ki-body a { color: inherit; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.ki-lead { font-size: ${fluid(21, 17)}; line-height: 1.5; color: inherit; max-width: 40ch; margin: 0 0 calc(var(--u) * 30); }
.ki-stat { font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; color: var(--ki-mute, #6E675D); margin: calc(var(--u) * 30) 0 0; }
.ki-kicker { font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: #8A5A33; margin: 0 0 calc(var(--u) * 16); }
[data-ki-band='dark'] .ki-kicker, .ki-italskar .ki-kicker { color: #D9A87E; }
/* the one warm dark band in the light run: the commercial section, which
   earns the emphasis and stops nine thousand pixels of cream going flat */
.ki-italskar { background: #3B2320; color: #EFE6DC; }
.ki-italskar-studio { margin-top: calc(var(--u) * 120); padding-top: calc(var(--u) * 90); border-top: 1px solid rgb(239 230 220 / .16); }

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
.ki-form button:not(.ki-fill) { border: 0; cursor: pointer; justify-self: start; text-align: left; }
.ki-form button[disabled] { opacity: .5; cursor: progress; }
.ki-form .ki-fill { font-family: ${MONO}; cursor: pointer; appearance: none; -webkit-appearance: none; }
.ki-form-send { margin-top: calc(var(--u) * 8); }
.ki-form-err { color: #8C3A34; }
[data-ki-band='dark'] .ki-form-err { color: #E8A58F; }
/* two fields a row when the form shares a section with its heading */
.ki-form--pair { grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 22) calc(var(--u) * 28); max-width: none; }
.ki-form--pair .ki-form-wide, .ki-form--pair label:nth-of-type(3) { grid-column: 1 / -1; }
@media (max-width: 640px) { .ki-form--pair { grid-template-columns: 1fr; } }
/* the pill on a light ground: ink outline, ink disc, cream arrow */
[data-ki-band='light'] .ki-fill { color: ${INK}; border-color: rgb(35 31 27 / .4); background: transparent; }
[data-ki-band='light'] .ki-fill-bg { background: ${INK}; }
[data-ki-band='light'] .ki-fill-ink, [data-ki-band='light'] .ki-fill-dot { color: #F7F2E9; }
[data-ki-band='light'] .ki-fill:is(:hover, :focus-visible) { border-color: ${INK}; }
/* the home page's closing section: the invitation beside the form */
.ki-samband-in.ki-samband-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: calc(var(--u) * 90); align-items: start; max-width: none; }
.ki-samband-grid .ki-samband-tel { font-size: ${fluid(48, 32)}; }
@media (max-width: 860px) { .ki-samband-in.ki-samband-grid { grid-template-columns: 1fr; gap: 44px; } }
@media (prefers-reduced-motion: reduce) {
  .ki-hero-media img { transform: none !important; }
  .ki-word { transform: none !important; opacity: 1 !important; }
  .ki-root * { scroll-behavior: auto !important; }

/* ── BETWEEN PAGES ───────────────────────────────────────────────────────
   The browser holds a snapshot of the page being left, swaps the DOM and the
   scroll position underneath it, and cross-fades. The reset to the top of the
   next page happens INSIDE the fade rather than in front of it, which is the
   whole point: what used to read as a hard cut plus a jump now reads as one
   move.
   The outgoing page only fades; the incoming one fades and settles up a few
   pixels, so the direction of travel is forwards. Both are short — this is
   punctuation between pages, not an event, and a transition a visitor has to
   wait through is worse than none.
   Gated on prefers-reduced-motion, which leaves the navigation instant. */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) { animation: ki-vt-out .24s cubic-bezier(.4,0,1,1) both; }
  ::view-transition-new(root) { animation: ki-vt-in .40s ${OUT} both; }
}
@keyframes ki-vt-out { to { opacity: 0; } }
@keyframes ki-vt-in { from { opacity: 0; transform: translateY(12px); } }
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
.ki-card-name { display: inline-block; padding: 3px 0; position: relative; }
.ki-card-name::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 1px; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .725s var(--ki-ease-primary);
}
@media (hover: hover) and (pointer: fine) {
  .ki-card:hover .ki-card-name::after, .ki-card-link:focus-visible .ki-card-name::after { transform: none; }
}
/* the whole card is one link: figure and name together */
.ki-card-link { display: block; color: inherit; text-decoration: none; }
.ki-card-cat { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .08em; color: var(--ki-mute); white-space: nowrap; }

/* ── THE NEWEST PROJECT, in the corner of the landing frame ──────────────
   No box and no glass: a small photograph with a hairline, two lines of type,
   and an arrow that keeps nudging. It rests on the ground along the bottom of
   the frame, which is the one place on the landing page that is not her
   photograph, and it is the one thing there that asks to be clicked. */
.ki-newest {
  position: relative;
  display: flex; align-items: center; gap: calc(var(--u) * 18);
  color: #F8F3EA; text-decoration: none;
  text-shadow: 0 1px 16px rgb(10 8 7 / .78), 0 1px 3px rgb(10 8 7 / .5);
  /* 360u collapsed the text column to 126px on a 912-wide frame, so BOTH the
     kicker and the name broke over two lines each and it read as a cramped
     block rather than as a label. Sized off the frame with a real cap: the
     name gets one line where it fits and two clean ones where it does not. */
  max-width: min(calc(100vw - clamp(120px, 22vw, 260px)), calc(var(--u) * 430));
}
/* NO WASH BEHIND IT. The card used to sit on a soft radial of near-black,
   which reads as a smudge floating on the photograph. It sits over the
   island and the dark stone instead — the part of the frame that is already
   dark — and the type carries its own shadow so a light stroke never fizzes
   against detail. Contrast is measured, not assumed. */
.ki-newest-fig {
  flex: 0 0 auto; width: calc(var(--u) * 96); aspect-ratio: 4 / 3; overflow: hidden;
  outline: 1px solid rgb(242 236 227 / .28); outline-offset: 3px;
  transition: outline-color .5s ${OUT};
}
.ki-root .ki-newest-fig picture, .ki-root .ki-newest-fig img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s ${OUT}; }
.ki-newest-text { display: grid; gap: 5px; min-width: 0; }
/* the label is a label: it never breaks */
.ki-newest-kicker { font-family: ${MONO}; font-size: ${fluid(10.5, 10)}; letter-spacing: .2em; text-transform: uppercase; color: #F0E7D9; white-space: nowrap; }
.ki-newest-title { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(19, 16)}; line-height: 1.24; text-wrap: balance; }
.ki-newest-arrow {
  flex: 0 0 auto; width: 18px; height: 18px; background: #D9A87E;
  -webkit-mask: var(--ki-arrow) center / contain no-repeat;
  mask: var(--ki-arrow) center / contain no-repeat;
  animation: ki-nudge 1.9s cubic-bezier(.45, 0, .25, 1) infinite;
}
@keyframes ki-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(7px); } }
.ki-newest:hover .ki-newest-fig { outline-color: rgb(242 236 227 / .7); }
.ki-newest:hover .ki-newest-fig img { transform: scale(1.06); }
.ki-newest:hover .ki-newest-arrow { animation-duration: .9s; }
@media (prefers-reduced-motion: reduce) { .ki-newest-arrow { animation: none; } }
@media (max-width: 640px) {
  .ki-newest { max-width: calc(100vw - 40px); }
  .ki-newest-fig { width: 72px; }
}

/* what a cluster cannot show as a card, named in a line — the register that
   used to repeat the whole grid as text is gone */
.ki-cluster-rest { margin: calc(var(--u) * 26) 0 0; font-size: ${fluid(15, 14)}; line-height: 1.7; color: var(--ki-mute); }
.ki-cluster-rest > span:first-child { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .12em; text-transform: uppercase; margin-right: 8px; }
.ki-cluster-rest a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
/* on a phone eight names in one paragraph read as a wall: give each its own
   row of air, and a tappable height */
@media (max-width: 640px) {
  .ki-cluster-rest { line-height: 2.25; }
  .ki-cluster-rest a { display: inline-block; padding: 2px 0; line-height: 1.5; }
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
/* a portrait photograph needs the height back: at 760px it was a letterbox of
   one wall (29% of the picture). Still inside the viewport, so the pin holds. */
.ki-proj-hero[data-tall] { height: min(92svh, 940px); }
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
.ki-proj-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--u) * 34);   }
/* the two widths the gallery is built from, and the credit under it */
.ki-gal-wide { grid-column: 1 / -1; }
/* ── Í FJÖLMIÐLUM ────────────────────────────────────────────────────────
   The headline under each clipping is the page: on her site every one of them
   is pixels inside a JPEG, which is why the page has never ranked for a single
   thing she has been quoted saying. */
.ki-press {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--u) * 44) calc(var(--u) * 34);
  counter-reset: none;
}
/* the answer blocks — a question the size of a heading, an answer the size
   of a snippet, and enough air that the pair reads as one unit */
.ki-answers { margin: calc(var(--u) * 60) 0 0; }
.ki-answer { padding: calc(var(--u) * 30) 0; border-top: 1px solid var(--ki-hair); max-width: calc(var(--u) * 820); }
.ki-answer-q {
  margin: 0 0 calc(var(--u) * 12); font-family: ${HEAD}; font-weight: 300;
  font-size: ${fluid(30, 22)}; line-height: 1.2; color: var(--ki-ink); text-wrap: balance;
}
.ki-answer-a { margin: 0; font-size: ${fluid(16.5, 15.5)}; line-height: 1.65; color: var(--ki-mute); }
.ki-press-wide { grid-column: 1 / -1; }
.ki-press-half { grid-column: span 1; }
.ki-press-fig { margin: 0; }
.ki-press-cap { padding-top: calc(var(--u) * 16); }
.ki-press-head {
  margin: 0; font-family: ${HEAD}; font-weight: 300;
  font-size: ${fluid(27, 20)}; line-height: 1.24; color: var(--ki-ink);
  text-wrap: balance;
}
.ki-press-meta {
  margin: 6px 0 0; font-family: ${MONO}; font-size: ${fluid(11.5, 10.5)};
  letter-spacing: .16em; text-transform: uppercase; color: var(--ki-mute);
}
@media (max-width: 860px) {
  .ki-press { grid-template-columns: minmax(0, 1fr); gap: calc(var(--u) * 40); }
  .ki-press-wide, .ki-press-half { grid-column: 1 / -1; }
}
.ki-gal-half { grid-column: span 1; }
.ki-proj-credit {
  margin: calc(var(--u) * 30) 0 0;
  font-family: ${MONO}; font-size: ${fluid(11.5, 10.5)}; letter-spacing: .18em;
  text-transform: uppercase; color: var(--ki-mute);
}
/* the widths are decided in ProjectPage now, per photograph, not by an
   nth-child rule that could not tell a room from a door handle */
.ki-facts { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 54); margin: calc(var(--u) * 44) 0 0; padding-top: calc(var(--u) * 26); border-top: 1px solid var(--ki-hair); }
.ki-facts dt { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .12em; text-transform: uppercase; color: var(--ki-mute); margin-bottom: 6px; }
.ki-facts dd { margin: 0; font-size: ${fluid(16, 15)}; }
  border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 30); margin-top: calc(var(--u) * 70); }
.ki-nextprev a { display: block; padding: 4px 0; color: inherit; text-decoration: none; font-size: ${fluid(16, 15)}; max-width: 46%; }
.ki-nextprev small { display: block; font-family: ${MONO}; font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ki-mute); margin-bottom: 6px; }

/* ── register ─────────────────────────────────────────────────────────── */
.ki-skra-count { font-family: ${MONO}; font-size: ${fluid(14, 12.5)}; color: var(--ki-mute); margin: 0; }
.ki-skra-n { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(40, 26)}; color: currentColor; padding: 0 .1em; }
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

/* ── contact: the head of the footer, not a card in front of it ──────────
   REBUILT. What was here was a centred green capsule under a 420px arch,
   and three things were wrong with it:

     · the arch. A giant border-radius is a shape the rest of this site
       never makes anywhere else, so it read as decoration bolted on rather
       than as part of the language.
     · the colour. #16211E is a dark GREEN. Every other dark band on the
       site is charcoal, so the contact block alone drifted to a hue that
       appears nowhere in her palette — and it sat directly above the
       charcoal footer, which made the seam obvious.
     · the centring. This site is asymmetric everywhere else; a centred
       manifesto block is the one layout that says nothing about her.

   Now it is simply the top of one continuous dark footer: same charcoal,
   left-aligned, no seam between the invitation and the links below it. */
.ki-samband { padding: 0; background: ${CHARCOAL}; }
.ki-samband-in {
  padding: calc(var(--u) * 128) calc(var(--u) * 34) calc(var(--u) * 74);
  color: #EDE7DE; max-width: calc(var(--u) * 1180);
}
.ki-samband-row {
  display: flex; flex-wrap: wrap; align-items: baseline;
  gap: calc(var(--u) * 44); margin-top: calc(var(--u) * 40);
}
.ki-samband-tel { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(64, 32)}; line-height: 1; color: inherit; text-decoration: none; transition: color .3s ${OUT}; }
@media (hover: hover) and (pointer: fine) { .ki-samband-tel:hover { color: var(--ki-copper); } }
.ki-samband-addr { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .05em; color: #B9B1A5; margin-top: calc(var(--u) * 30); max-width: 64ch; line-height: 1.7; }
/* ── hafa samband ─────────────────────────────────────────────────────────
   Three blocks, one decision each. The old page opened on a five-row
   definition list sitting beside the form with a heading over each column, so
   the first thing on it was a data table competing with the one thing the
   page exists to collect — and the four steps that answer "and then what?"
   were the LAST thing on it, underneath the showroom. The steps sit beside
   the form now; the address moved into the showroom, which is the only
   context in which a street address means anything. */
.ki-samb-head { padding-bottom: calc(var(--u) * 34); }
/* the fastest door, in the head: some people will just ring, and they should
   not have to scroll past a form to find the number */
.ki-samb-direct {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: calc(var(--u) * 34);
  margin: calc(var(--u) * 40) 0 0;
}
.ki-samb-tel-lg {
  font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(44, 30)};
  line-height: 1; color: inherit; text-decoration: none;
  border-bottom: 1px solid var(--ki-hair); padding-bottom: 6px;
  transition: border-color .4s ${OUT};
}
.ki-samb-tel-lg:hover { border-bottom-color: currentColor; }
.ki-samb-mail {
  font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .06em;
  color: var(--ki-mute); text-decoration: underline; text-underline-offset: 4px;
}
.ki-samb-body { padding-top: calc(var(--u) * 20); }
.ki-samb-grid {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: calc(var(--u) * 90); align-items: start;
}
.ki-samb-grid .ki-form { max-width: none; }
.ki-samb-next { border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 26); }
.ki-samb-thanks { border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 26); }
/* the steps read as a sequence here, not as a row of equal tiles */
.ki-steps--stack { grid-template-columns: 1fr; gap: calc(var(--u) * 26); margin-top: calc(var(--u) * 22); }
.ki-facts-row {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: calc(var(--u) * 30); margin: calc(var(--u) * 34) 0 0;
}
.ki-facts-row div { border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 14); }
.ki-facts-row dt {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .1em;
  text-transform: uppercase; color: var(--ki-mute); margin-bottom: 8px;
}
.ki-facts-row dd { margin: 0; font-size: ${fluid(15.5, 15)}; line-height: 1.6; }
.ki-facts-row a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 860px) {
  .ki-samb-grid { grid-template-columns: 1fr; gap: calc(var(--u) * 54); }
}

.ki-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 70); align-items: start; }
.ki-dl { margin: 0; }
.ki-dl div { display: flex; gap: 16px; padding: 14px 0; border-top: 1px solid var(--ki-hair); }
.ki-dl dt { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .1em; text-transform: uppercase; color: var(--ki-mute); min-width: 108px; }
.ki-dl dd { margin: 0; font-size: ${fluid(16, 15)}; }
.ki-dl a { display: inline-block; padding: 3px 0; color: inherit; text-decoration: none; border-bottom: 1px solid var(--ki-hair); }
@media (hover: hover) and (pointer: fine) { .ki-dl a:hover { border-bottom-color: currentColor; } }

/* ── the link button ──────────────────────────────────────────────────────
   The 21st.dev link-button device, ported rather than installed. That
   component is Tailwind utilities plus lucide-react, and this site has no
   Tailwind classes and no icon library, so what comes across is the
   BEHAVIOUR with its own measured values:

     · the underline FLIPS ITS ORIGIN between states. At rest it is
       scaleX(0) from the RIGHT; on hover it is scaleX(1) from the LEFT. So
       it wipes in from one side and out to the other instead of growing
       symmetrically, which is the entire reason it reads as directional.
       Its curve is the reference's own: cubic-bezier(.62,.05,.01,.99), .5s.
     · the arrow rotates -45deg on the same curve, so it turns from "along"
       to "away" as the underline lands.

   Both are pseudo-elements, which is why none of the 36 existing call sites
   had to change: the arrow is ::before pinned right, the rule is ::after
   stopping short of it. The arrow is a masked data URI, not a url() to a
   file — a relative url() resolves against the stylesheet in dev and against
   the bundle root in the build, and 404s silently in one of them. */
/* LABEL AND ARROW ARE ONE CENTRED ROW. The arrow used to be absolutely placed
   off the bottom of the box, which only lined up while the label was a plain
   text node; the letter-roll wrapper moved the text and the arrow dropped
   below it. As a flex item the arrow is centred on the label whatever the
   label is made of. */
.ki-cta { position: relative; display: inline-flex; align-items: center; gap: .6em;
  font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; text-transform: uppercase;
  background: none; padding: 10px 0 12px; color: inherit;
  text-decoration: none; transition: color .3s ${OUT}, transform .16s ${OUT}; }
/* the rule underlines the LABEL and stops before the arrow (.95em + .6em gap) */
.ki-cta::after { content: ''; position: absolute; left: 0; right: 1.55em; bottom: 4px; height: 1.5px;
  background: currentColor; transform: scaleX(0); transform-origin: right;
  transition: transform .5s cubic-bezier(.62,.05,.01,.99); }
.ki-cta::before {
  content: ''; order: 1; flex: none;
  width: .95em; height: .95em; background: currentColor;
  -webkit-mask: var(--ki-arrow) center / contain no-repeat;
  mask: var(--ki-arrow) center / contain no-repeat;
  transition: transform .5s cubic-bezier(.62,.05,.01,.99);
}
@media (hover: hover) and (pointer: fine) {
  .ki-cta:hover::after, .ki-cta:focus-visible::after { transform: scaleX(1); transform-origin: left; }
  .ki-cta:hover::before, .ki-cta:focus-visible::before { transform: rotate(-45deg); }
}
/* Touch has no hover, so the rule would never appear at all — the reference
   solves this by toggling on tap, but a link that needs two taps is a bug.
   It simply rests in the drawn state instead. */
@media (hover: none), (pointer: coarse) {
  .ki-cta::after { transform: scaleX(1); transform-origin: left; opacity: .55; }
}
@media (prefers-reduced-motion: reduce) {
  .ki-cta::after { transform: scaleX(1); transform-origin: left; transition: none; }
  .ki-cta::before { transition: none; }
}
.ki-cta:active { transform: scale(.97); }
.ki-cta-row { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 40); margin-top: calc(var(--u) * 30); }

/* ── footer ───────────────────────────────────────────────────────────── */
.ki-foot { border-top: 1px solid rgb(237 231 222 / .14); padding: calc(var(--u) * 60) calc(var(--u) * 34) calc(var(--u) * 40); background: ${CHARCOAL}; color: #EDE7DE; }
.ki-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.ki-foot-grid nav, .ki-foot-grid > div { display: flex; flex-direction: column; align-items: flex-start; }
.ki-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; margin: 0 0 12px; }
.ki-foot-head { font-family: ${MONO}; font-size: ${fluid(11.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: #9C948A; margin: 0 0 12px; }
.ki-foot-line { font-size: ${fluid(13.5, 13)}; color: #B9B1A5; margin: 0 0 6px; line-height: 1.65; }
.ki-foot-line a, .ki-foot-link { color: #B9B1A5; text-decoration: none; }
.ki-foot-line a { display: inline-block; padding: 4px 0; }
.ki-foot-link { font-size: ${fluid(13.5, 13)}; padding: 7px 0; line-height: 1.4; border-bottom: 1px solid transparent; }
@media (hover: hover) and (pointer: fine) { .ki-foot-link:hover, .ki-foot-line a:hover { color: #EDE7DE; border-bottom-color: currentColor; } }
.ki-foot-fine {
  font-family: ${MONO}; font-size: 12px; color: #9C948A; margin: calc(var(--u) * 40) 0 0;
  display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between;
  gap: 14px 30px;
}
.ki-foot-fine p { margin: 0; max-width: 64ch; }
/* Hannað af SNDR Studio */
.ki-foot-fine .sndr {
  display: inline-flex; align-items: baseline; gap: .5em; text-decoration: none;
  color: #9C948A; transition: color .4s ${OUT}; white-space: nowrap; padding: 6px 0;
}
.ki-foot-fine .sndr:hover, .ki-foot-fine .sndr:focus-visible { color: var(--ki-ground, #EFEAE2); }
.sndr__mark { font-family: ${MONO}; font-size: 13px; letter-spacing: .18em; }
.sndr__mark i { font-style: normal; color: var(--ki-copper); padding: 0 .06em; }
.sndr__studio { font-family: ${MONO}; font-size: 10px; letter-spacing: .3em; opacity: .75; }
@media (max-width: 620px) { .ki-foot-fine { flex-direction: column; align-items: flex-start; } }

/* ── the name, as the last statement on the page ──────────────────────── */
/* Transplanted from the Sky Retreat footer, device for device, on this
   site's own engine: two words each in an overflow mask, rising from 105%
   on the reveal sweep with the second delayed, and the pair drifting apart
   under the scroll-linked spread primitive. No GSAP, no Lenis — the two
   motions already existed here. */
/* Laid out side by side with space-between, the two words sat at opposite
   margins with a hole between them — at 9.4vw they only filled about
   two-thirds of the line each side, so it read as two separate labels rather
   than one mark. Stacked instead, which the letterforms actually invite:
   KATRÍN and ÍSFELD are BOTH exactly six characters, so one above the other
   they set as a rectangle flush on both edges with no tracking games. The
   size is measured to fill the footer's content width, not guessed. */
.ki-footwm { display: block; margin-top: calc(var(--u) * 54); }
/* THE MASK MUST NOT EAT THE ACCENTS. At line-height .84 the line box is
   shorter than the glyph box by 47.5px top and bottom at this size, and
   overflow:hidden cut the acute off every Í — in her own name, twice. The
   padding widens the CLIP region (overflow clips at the padding edge) and the
   negative margin takes that space back out of layout, so the rhythm between
   the two lines is unchanged and the accents survive. */
/* The size lives HERE rather than on the <i>, because the padding below is in
   em and em resolves against THIS element's own font-size. Declared on the
   inner <i> it inherited the footer's 14px, so .1em came out as 1.4px of
   relief instead of 32px and the accents stayed cut. */
.ki-footwm-word {
  display: block; overflow: hidden;
  font-size: clamp(3rem, 23.8vw, 20rem);
  padding: .12em 0; margin: -.12em 0;
}
.ki-footwm-word i {
  display: flex; justify-content: space-between; font-style: normal;
  font-family: ${DISPLAY}; font-weight: 300;
  /* size comes from the mask above; 23.8vw sets each word at roughly 95% of
     the line on its own, so justification adds a little air between letters
     rather than a lot */
  line-height: .84;
  letter-spacing: 0; color: #EDE7DE;
  /* default is STANDING: no JS and reduced motion must never hide her name */
  transform: translateY(0);
}
/* only once the engine is running does it start hidden and rise */
/* 118%, not 105%: the mask is now .1em taller than the line box at each edge,
   so a 105% drop left the word peeking below the clip before it rose */
.ki-js .ki-footwm:not(.is-in) .ki-footwm-word i { transform: translateY(118%); }
.ki-js .ki-footwm.is-in .ki-footwm-word i { transform: translateY(0); transition: transform 1s ${OUT}; }
.ki-js .ki-footwm.is-in .ki-footwm-word:last-child i { transition-delay: .09s; }
.ki-static .ki-footwm-word i { transform: translateY(0); }
/* the container carries .ki-rv only as the trigger — the mask rise is the
   motion, so cancel the reveal kit's own lift and keep just its fade */
.ki-js .ki-footwm.ki-rv { transform: none; }
@media (max-width: 640px) {
  .ki-footwm { margin-top: calc(var(--u) * 34); }
  .ki-footwm-word { font-size: 21.4vw; }
}

/* ── the landing frame ────────────────────────────────────────────────────
   Her name, centred, over a slow run of her rooms (hero-show.tsx). Only the
   arriving photograph fades; the one under it holds at full opacity until it
   is covered, so the frame never dips through a muddy midpoint. */
.ki-show { position: relative; height: 100svh; min-height: 600px; overflow: hidden; display: grid; place-items: center; color: #F2ECE3; background: ${CHARCOAL}; }
.ki-show-media { position: absolute; inset: 0; animation: ki-show-in 1.6s ease-out both; }
@keyframes ki-show-in { from { opacity: 0 } to { opacity: 1 } }
.ki-show-slide { position: absolute; inset: 0; margin: 0; opacity: 0; z-index: 1; }
.ki-root .ki-show-slide picture, .ki-root .ki-show-slide picture > img { width: 100%; height: 100%; object-fit: cover; }
.ki-show-slide.was-on { opacity: 1; z-index: 2; }
.ki-show-slide.is-on { opacity: 1; z-index: 3; transition: opacity 1.7s var(--ki-ease-cross); }
/* the drift, on one compositor transform. Declared for the outgoing slide
   too, with the same value, so its animation carries on under the arriving
   one instead of snapping back to rest the frame it stops being current. */
.ki-show-slide:is(.is-on, .was-on) img { animation: ki-drift 9.5s linear both; }
@keyframes ki-drift { from { transform: scale(1.075) } to { transform: scale(1) } }
.ki-show-scrim { position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background-image: linear-gradient(180deg, rgb(14 11 9 / .38) 0%, rgb(14 11 9 / 0) 26%, rgb(14 11 9 / 0) 62%, rgb(14 11 9 / .62) 100%);
  background-color: rgb(16 12 10 / var(--tone, .46));
  transition: background-color 1.7s var(--ki-ease-cross); }
/* the letters carry a hairline of their own shade — hugging each glyph, so it
   reads as the type being crisp, not as something behind it */
.ki-show-name, .ki-show-role, .ki-show-tag { text-shadow: 0 0 1px rgb(10 8 7 / .45), 0 1px 3px rgb(10 8 7 / .4); }
/* one H1 carries the name and the role; each keeps its own line and look */
.ki-show-heading { margin: 0; font-weight: inherit; font-size: inherit; }
.ki-show-heading .ki-show-name, .ki-show-heading .ki-show-role { display: block; }

/* the lockup — the wordmark face, and nothing else on the site in it */
.ki-show-lockup { position: relative; z-index: 5; text-align: center; padding: 0 20px; max-width: calc(var(--u) * 960); animation: ki-fade-up 1.1s ${OUT} .8s both; }
/* THE SHADE THE NAME SITS IN. Seven photographs, and the brightest thing in
   most of them is a window right behind the centre of the frame: measured
   worst-pixel, cream type over that glass came out at 1.00:1. A band of
   shade the full width of the frame, plateaued over the lockup and fading
   above and below, reads as the room's own vignette rather than as a box
   behind the type. Measured after on every slide at 1440 and 390. */
/* NO SHAPE BEHIND THE NAME. The band that used to sit here read as a dark
   smudge floating across the room. The contrast now comes from grading the
   photograph itself — one even tone over the whole frame, like a print
   exposed a stop down — so there is no edge anywhere for the eye to find. */
.ki-show-name { font-family: ${DISPLAY_ALT}; font-weight: 400; font-size: clamp(46px, 9.4vw, 140px); line-height: .98; letter-spacing: .01em; margin: 0; color: #F7F2E9; text-shadow: 0 2px 30px rgb(10 8 7 / .38); }
.ki-show-role { font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; letter-spacing: .28em; text-transform: uppercase; margin: calc(var(--u) * 24) 0 0; color: #F7F2E9; }
.ki-show-tag { font-size: ${fluid(17, 15.5)}; line-height: 1.6; margin: calc(var(--u) * 18) auto 0; max-width: 44ch; color: #EDE5D9; text-shadow: 0 1px 14px rgb(10 8 7 / .5); }
/* two pills of one width, as a pair centred under the name: max-content with
   1fr tracks sizes both columns to the longer label */
.ki-show-cta { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 14px; width: max-content; margin: calc(var(--u) * 32) auto 0; }
.ki-show-cta .ki-fill { width: 100%; justify-content: center; }
.ki-show-cta .ki-fill-ink { justify-content: center; }
.ki-show .ki-cta { color: #F7F2E9; }

/* the bar: which room this is, the way to it, and the run of the show */
.ki-show-bar { position: absolute; z-index: 6; left: calc(var(--u) * 34); right: calc(var(--u) * 34); bottom: calc(var(--u) * 30);
  display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: calc(var(--u) * 30);
  animation: ki-fade-up 1s ${OUT} 1.4s both; }
.ki-show-cap { display: flex; align-items: center; gap: 14px; min-width: 0; }
.ki-show-n { font-family: ${MONO}; font-size: ${fluid(12, 11.5)}; letter-spacing: .12em; color: #D9CFC0; white-space: nowrap; }
.ki-show-n i { font-style: normal; opacity: .5; padding: 0 .35em; }
.ki-show-title { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(21, 17)}; line-height: 1.3; color: #F7F2E9; text-decoration: none;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
  border-bottom: 1px solid rgb(247 242 233 / .38); padding: 2px 0 1px; transition: border-color .4s ${OUT};
  text-shadow: 0 1px 12px rgb(10 8 7 / .6); }
.ki-show-title:hover { border-color: currentColor; }
.ki-show-i { flex: none; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgb(247 242 233 / .62); background: rgb(14 11 9 / .38);
  color: #F7F2E9; font-family: ${DISPLAY}; font-style: italic; font-size: 17px; line-height: 1; cursor: pointer; display: grid; place-items: center; padding: 0 0 2px;
  transition: background .3s ${OUT}, color .3s ${OUT}, border-color .3s ${OUT}; }
/* 32px to see, 44px to hit */
.ki-show-i { position: relative; }
.ki-show-i::after { content: ''; position: absolute; inset: -6px; }
.ki-show-corner[data-dup] { opacity: 0; visibility: hidden; transition: opacity .6s ${OUT}, visibility 0s linear .6s; }
.ki-show-i:hover, .ki-show-i[aria-expanded='true'] { background: #F7F2E9; color: ${INK}; border-color: #F7F2E9; }
.ki-show-dots { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; }
.ki-show-dots li { margin: 0; }
.ki-show-dots button { display: block; width: 32px; height: 22px; padding: 0; border: 0; background: none; cursor: pointer; position: relative; }
.ki-show-dots button::before { content: ''; position: absolute; left: 0; right: 0; top: 10px; height: 2px; background: rgb(247 242 233 / .3); }
.ki-show-dots button::after { content: ''; position: absolute; left: 0; width: 100%; top: 10px; height: 2px; background: #F7F2E9; transform: scaleX(0); transform-origin: left; }
.ki-show-dots button[aria-current='true']::after { animation: ki-fill var(--t, 6400ms) linear both; }
.ki-show[data-open] .ki-show-dots button[aria-current='true']::after { animation-play-state: paused; }
@keyframes ki-fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.ki-show-nav { display: flex; gap: 6px; }
.ki-show-nav button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgb(247 242 233 / .4); background: rgb(14 11 9 / .3); cursor: pointer;
  display: grid; place-items: center; padding: 0; color: #F7F2E9; transition: background .3s ${OUT}, border-color .3s ${OUT}; }
.ki-show-nav button:hover { background: rgb(247 242 233 / .18); border-color: rgb(247 242 233 / .85); }
.ki-show-arrow { width: 18px; height: 18px; background: currentColor; -webkit-mask: var(--ki-arrow) center / contain no-repeat; mask: var(--ki-arrow) center / contain no-repeat; }
.ki-show-arrow--back { transform: scaleX(-1); }

/* the answer to "what is this?", in place */
/* THE POPOVER OPENS OUT OF THE CAPTION. A clip grows upward from its bottom
   edge (the edge nearest the i) while the card rises the last few pixels,
   then its lines follow one after another. Closing is the same move in
   reverse, quicker, with the lines leaving first — and visibility is held
   until the clip has shut, so nothing blinks out. */
.ki-show-info { position: absolute; z-index: 7; left: calc(var(--u) * 34); bottom: calc(var(--u) * 100); width: min(calc(100% - 40px), 400px);
  padding: 22px 24px 24px; background: rgb(20 16 14 / .9); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  color: #F2ECE3; border: 1px solid rgb(247 242 233 / .16); border-radius: 4px;
  transform-origin: 0 100%;
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: translateY(12px);
  clip-path: inset(100% 0 0 0 round 4px);
  /* closing: the clip starts almost at once on an in-out curve, so the card
     is seen retracting into the caption — an ease-in with a delay left an
     empty full-height box on screen for a third of a second */
  transition: clip-path .4s cubic-bezier(.65, 0, .35, 1) .04s, transform .4s cubic-bezier(.65, 0, .35, 1) .04s,
    opacity .34s cubic-bezier(.4, 0, 1, 1) .06s, visibility 0s linear .44s; }
.ki-show[data-open] .ki-show-info {
  opacity: 1; visibility: visible; pointer-events: auto; transform: none;
  clip-path: inset(0 0 0 0 round 4px);
  transition: clip-path .72s cubic-bezier(.76, 0, .24, 1), transform .8s cubic-bezier(.16, 1, .3, 1),
    opacity .2s linear, visibility 0s linear 0s; }
.ki-show-info > :not(.ki-show-info-x) { opacity: 0; transform: translateY(8px);
  transition: opacity .12s linear, transform .2s cubic-bezier(.7, 0, .84, 0); }
.ki-show[data-open] .ki-show-info > :not(.ki-show-info-x) { opacity: 1; transform: none;
  transition: opacity .5s ${OUT} calc(.26s + var(--k, 0) * 55ms), transform .7s cubic-bezier(.16, 1, .3, 1) calc(.26s + var(--k, 0) * 55ms); }
.ki-show-info > :nth-child(2) { --k: 1; }
.ki-show-info > :nth-child(3) { --k: 2; }
.ki-show-info > :nth-child(4) { --k: 3; }
.ki-show-info > :nth-child(5) { --k: 4; }
.ki-show-info > :nth-child(6) { --k: 5; }
.ki-show-info-x { opacity: 0; transition: opacity .2s linear; }
.ki-show[data-open] .ki-show-info-x { opacity: 1; transition: opacity .4s linear .5s; }
/* the i turns into a close mark: the letter tips and fades as two strokes
   draw in, so the button says what it will do next */
.ki-show-i-glyph { display: block; transition: transform .5s cubic-bezier(.76, 0, .24, 1), opacity .3s linear; }
.ki-show-i-x { position: absolute; left: 50%; top: 50%; width: 12px; height: 12px; margin: -6px 0 0 -6px; }
.ki-show-i-x::before, .ki-show-i-x::after { content: ''; position: absolute; left: 50%; top: 50%; width: 13px; height: 1.5px; margin: -.75px 0 0 -6.5px;
  background: currentColor; border-radius: 1px; transform: rotate(45deg) scaleX(0); transition: transform .45s cubic-bezier(.76, 0, .24, 1); }
.ki-show-i-x::after { transform: rotate(-45deg) scaleX(0); }
.ki-show-i[aria-expanded='true'] .ki-show-i-glyph { transform: rotate(90deg) scale(.4); opacity: 0; }
.ki-show-i[aria-expanded='true'] .ki-show-i-x::before { transform: rotate(45deg) scaleX(1); transition-delay: .08s; }
.ki-show-i[aria-expanded='true'] .ki-show-i-x::after { transform: rotate(-45deg) scaleX(1); transition-delay: .16s; }
@media (prefers-reduced-motion: reduce) {
  .ki-show-info, .ki-show-info > *, .ki-show-i-glyph, .ki-show-i-x::before, .ki-show-i-x::after { transition: none !important; }
  .ki-show-info { clip-path: none; transform: none; }
}
.ki-show-info-kicker { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .14em; text-transform: uppercase; color: #D9A87E; margin: 0 0 8px; }
.ki-show-info-title { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(26, 21)}; line-height: 1.2; margin: 0 28px 10px 0; }
.ki-show-info-body { font-size: ${fluid(15.5, 14.5)}; line-height: 1.6; color: #D9CFC0; margin: 0 0 12px; }
.ki-show-info-meta { font-family: ${MONO}; font-size: 12px; line-height: 1.65; color: #B9B1A5; margin: 0 0 6px; }
.ki-show-info-cta { margin: 16px 0 0; }
.ki-show-info .ki-cta { color: #F7F2E9; }
.ki-show-info-x { position: absolute; top: 6px; right: 8px; width: 40px; height: 40px; background: none; border: 0; color: inherit; font-size: 24px; line-height: 1; cursor: pointer; }

/* the newest project, resting above the bar in the corner */
.ki-show-corner { position: absolute; z-index: 6; right: calc(var(--u) * 34); bottom: calc(var(--u) * 100); animation: ki-fade-up 1s ${OUT} 1.6s both; }
/* the same soft shade under the corner card, so a 10px label never lands on
   a lit worktop: 3.01:1 on the fifth slide before this, AA after */
.ki-show-corner::before {
  content: ''; position: absolute; z-index: -1; inset: -48px -60px -56px -70px; pointer-events: none;
  background: radial-gradient(ellipse at 55% 50%, rgb(14 11 9 / .62), rgb(14 11 9 / .4) 45%, rgb(14 11 9 / 0) 72%);
}

@keyframes ki-fade-up { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }
html[data-ki-seen] .ki-show-media, html[data-ki-seen] .ki-show-lockup,
html[data-ki-seen] .ki-show-bar, html[data-ki-seen] .ki-show-corner { animation-delay: 0s; animation-duration: .6s; }
@media (prefers-reduced-motion: reduce) {
  .ki-show-media, .ki-show-lockup, .ki-show-bar, .ki-show-corner, .ki-show-info { animation: none !important; }
  .ki-show-slide img { animation: none !important; }
  .ki-show-slide.is-on { transition: none; }
  .ki-show-dots button[aria-current='true']::after { animation: none; transform: none; }
}
@media (max-width: 860px) {
  .ki-show { min-height: 560px; }
  .ki-show-bar { left: 20px; right: 20px; bottom: 18px; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; }
  .ki-show-dots { display: none; }
  /* the counter goes above the name rather than beside it: a phone has no
     row for a counter, a name, a button and two arrows */
  .ki-show-cap { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 12px; align-items: center; }
  .ki-show-lead { grid-column: 1; grid-row: 1; }
  .ki-show-n { font-size: 11px; }
  .ki-show-title { grid-column: 1; grid-row: 2; font-size: 17px; }
  .ki-show-i { grid-column: 2; grid-row: 1 / 3; }
  .ki-show-nav button { width: 40px; height: 40px; }
  .ki-show-info { left: 20px; right: 20px; width: auto; bottom: 80px; }
  .ki-show-cta { gap: 26px; }
  /* ON A PHONE THE NEWEST PROJECT SITS ABOVE THE NAME, where the eye starts.
     One soft fall of shade from the top of the frame keeps it legible over a
     lit room — measured, not assumed. */
  .ki-show-corner { right: 20px; left: 20px; bottom: auto; top: calc(env(safe-area-inset-top, 0px) + 76px); }
  .ki-show-corner::before {
    content: ''; position: absolute; z-index: -1;
    left: -20px; right: -20px; top: -110px; bottom: -34px;
    background: linear-gradient(to bottom,
      rgb(12 10 9 / .82) 0%, rgb(12 10 9 / .78) 52%, rgb(12 10 9 / .55) 78%, rgb(12 10 9 / 0) 100%);
    pointer-events: none;
  }
  .ki-newest { max-width: none; width: 100%; padding-bottom: 14px; border-bottom: 1px solid rgb(242 236 227 / .26); }
  .ki-newest-arrow { margin-left: auto; }
}
/* A PHONE GETS THE LANDING FRAME, NOT THE BRIEFING. Name, role, one button,
   the room's name and its i. Everything else on this frame is one scroll
   away or one swipe: the tagline, the second link, the counter and the
   arrows go; the newest project shrinks to a single pill with a live dot. */
@media (max-width: 640px) {
  .ki-show-tag, .ki-show-n, .ki-show-nav { display: none; }
  .ki-show-name { font-size: 15vw; }
  .ki-show-role { margin-top: 14px; }
  /* both pills, stacked: side by side they need ~370px of a 350px column and
     would have to shrink below the desktop pill. Stacked they stay the same
     object, one width (the 1fr track sizes both to the longer label). */
  .ki-show-cta { margin-top: 26px; grid-auto-flow: row; gap: 8px; }
  /* a phone-sized pill: 44px tall (the tap-target floor, not below it), a
     34px disc, 11px label — the desktop pill at 54px ate the frame */
  .ki-show-cta .ki-fill { --h: 44px; --c: 34px; --r: 5px; font-size: 11px; letter-spacing: .14em; padding: 0 calc(var(--c) + var(--r) + 14px) 0 20px; }
  .ki-show-cta .ki-fill-arrow { width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; }
  .ki-show-bar { grid-template-columns: minmax(0, 1fr); }
  .ki-show-cap { grid-template-columns: minmax(0, 1fr) auto; }
  /* no counter on a phone: the lead row exists only when it carries the badge */
  .ki-show-lead:not(:has(.ki-show-new)) { display: none; }
  .ki-show-cap:not(:has(.ki-show-new)) .ki-show-title { grid-row: 1; }
  .ki-show-cap:not(:has(.ki-show-new)) .ki-show-i { grid-row: 1; }
  .ki-show-corner { right: auto; top: calc(env(safe-area-inset-top, 0px) + 74px); }
  .ki-show-corner::before { display: none; }
  .ki-newest { width: auto; max-width: calc(100vw - 40px); gap: 10px; padding: 8px 14px 8px 12px; border: 1px solid rgb(247 242 233 / .32);
    border-radius: 999px; background: rgb(14 11 9 / .38); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); text-shadow: none; }
  .ki-newest-fig { display: none; }
  .ki-newest-kicker { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .ki-newest-title { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ki-newest::before { content: ''; flex: none; width: 7px; height: 7px; border-radius: 50%; background: #D9A87E; box-shadow: 0 0 0 0 rgb(217 168 126 / .6); animation: ki-live 2.4s ease-out infinite; }
  .ki-newest-arrow { width: 14px; height: 14px; margin-left: 2px; }
}
@keyframes ki-live { 0% { box-shadow: 0 0 0 0 rgb(217 168 126 / .55); } 70%, 100% { box-shadow: 0 0 0 9px rgb(217 168 126 / 0); } }
@media (prefers-reduced-motion: reduce) { .ki-newest::before { animation: none; } }

/* THE NAME STAYS WHEN THE i OPENS; IT MAKES ROOM. hero-show.tsx measures how
   far the lockup must rise to clear the card (never under the header) and
   sets --lift. It moves on the separate translate property because the
   lockup's entrance animation fills transform and would win over it.
   Opening lifts at once; closing waits for the card to start retracting. */
.ki-show-lockup { translate: 0 calc(var(--lift, 0px) * -1); transition: translate .6s cubic-bezier(.65, 0, .35, 1) .1s; }
.ki-show[data-open] .ki-show-lockup { transition: translate .75s cubic-bezier(.76, 0, .24, 1); }
/* a screen too short for the name and the full card: the card drops the
   photo description and tightens, the project, its line and the link stay */
@media (max-height: 760px) {
  .ki-show-info { padding: 16px 18px 18px; }
  .ki-show-info-meta { display: none; }
  .ki-show-info-title { margin-bottom: 6px; }
  .ki-show-info-body { margin-bottom: 4px; }
  .ki-show-info-cta { margin-top: 10px; }
}
@media (prefers-reduced-motion: reduce) { .ki-show-lockup { transition: none; } }

/* THE ROOM'S NAME ARRIVES WITH THE ROOM. It rises out of the line it sits on
   (the link clips it) and comes into focus, a beat after the photograph
   starts its dissolve — the same rise the headlines use, never a snap. The
   span carries the ellipsis now, since a transformed child cannot inherit it. */
.ki-show-title-in { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  animation: ki-cap-in .9s cubic-bezier(.16, 1, .3, 1) .12s both; }
@keyframes ki-cap-in { from { transform: translateY(70%); opacity: 0; filter: blur(5px); } 60% { filter: blur(0); } to { transform: none; opacity: 1; filter: none; } }
.ki-show-n { transition: opacity .3s linear; }
@media (prefers-reduced-motion: reduce) { .ki-show-title-in { animation: none; } }

/* "NÝTT": her newest project, said inside the caption of its own slide. One
   copper tag between the counter and the name, arriving with the slide. */
.ki-show-lead { display: inline-flex; align-items: center; gap: 10px; flex: none; }
.ki-show-new { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px 0 8px; border-radius: 999px;
  background: #D9A87E; color: ${INK}; font-family: ${MONO}; font-size: 10.5px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase;
  line-height: 1; white-space: nowrap; animation: ki-new-in .6s ${OUT} both; }
.ki-show-new::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: ${INK}; animation: ki-new-pulse 2.4s ease-in-out .6s infinite; }
@keyframes ki-new-in { from { opacity: 0; transform: translateY(6px) scale(.9); } to { opacity: 1; transform: none; } }
@keyframes ki-new-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
@media (prefers-reduced-motion: reduce) { .ki-show-new, .ki-show-new::before { animation: none; } }

/* the caption and its progress, stacked: the bar sits under the room it times */
.ki-show-meta { display: grid; gap: 12px; justify-items: start; min-width: 0; }
.ki-show-meta .ki-show-cap { max-width: 100%; }

/* ONE NEWEST-PROJECT PILL, AT EVERY WIDTH, UNDER THE HEADER. In the bottom
   corner it sat on top of the slideshow progress bar and read as its caption.
   It now lives where the eye enters the frame, apart from the slideshow
   controls, and it is the same object on a phone and on a desktop. */
.ki-show-corner { left: calc(var(--u) * 34); right: auto; bottom: auto; top: calc(env(safe-area-inset-top, 0px) + max(86px, calc(var(--u) * 100))); }
.ki-show-corner::before { display: none; }
.ki-newest { width: auto; max-width: calc(100vw - 40px); gap: 12px; padding: 9px 16px 9px 14px;
  border: 1px solid rgb(247 242 233 / .32); border-radius: 999px; background: rgb(14 11 9 / .4);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); text-shadow: none;
  transition: border-color .4s ${OUT}, background-color .4s ${OUT}; }
.ki-newest-fig { display: none; }
.ki-newest-text { display: flex; align-items: baseline; gap: 12px; min-width: 0; }
.ki-newest-title { font-size: 16px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ki-newest::before { content: ''; flex: none; align-self: center; width: 7px; height: 7px; border-radius: 50%; background: #D9A87E; animation: ki-live 2.4s ease-out infinite; }
.ki-newest-arrow { width: 14px; height: 14px; margin-left: 2px; }
@media (hover: hover) and (pointer: fine) { .ki-newest:hover { border-color: rgb(247 242 233 / .7); background: rgb(14 11 9 / .55); } }
@media (max-width: 640px) { .ki-show-corner { left: 20px; top: calc(env(safe-area-inset-top, 0px) + 74px); } }

/* ── the doors: four ways in ──────────────────────────────────────────── */
.ki-doors { list-style: none; margin: calc(var(--u) * 64) 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: calc(var(--u) * 22); }
.ki-door { margin: 0; }
.ki-js .ki-door.is-in { transition-delay: calc(var(--i, 0) * 90ms); }
.ki-door a { display: block; color: inherit; text-decoration: none; }
.ki-door-fig { display: block; overflow: hidden; aspect-ratio: 1; background: rgb(0 0 0 / .06); }
.ki-root .ki-door-fig picture, .ki-root .ki-door-fig img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s ${OUT}; }
.ki-door-meta { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: baseline; gap: 4px 12px; padding-top: 14px; border-top: 1px solid var(--ki-hair); margin-top: 16px; }
.ki-door-no { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .12em; color: #8A5A33; }
.ki-door-label { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(24, 19)}; line-height: 1.15; }
.ki-door-count { grid-column: 2; font-family: ${MONO}; font-size: ${fluid(11.5, 11.5)}; letter-spacing: .08em; color: var(--ki-mute); }
.ki-door-arrow { grid-row: 1; grid-column: 3; align-self: center; width: 18px; height: 18px; background: currentColor;
  -webkit-mask: var(--ki-arrow) center / contain no-repeat; mask: var(--ki-arrow) center / contain no-repeat; transition: transform .5s ${OUT}; }
@media (hover: hover) and (pointer: fine) {
  .ki-door a:hover .ki-door-fig img { transform: scale(1.045); }
  .ki-door a:hover .ki-door-arrow { transform: translateX(6px); }
}
@media (max-width: 991px) { .ki-doors { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) {
  .ki-doors { gap: 14px; margin-top: 44px; }
  .ki-door-fig { aspect-ratio: 1; }
  .ki-door-label { font-size: 17px; }
  /* Atvinnuhúsnæði is one word and 130px wide: the arrow gives way to it */
  .ki-door-arrow { display: none; }
  .ki-door-meta { grid-template-columns: auto minmax(0, 1fr); }
}

/* ── the dome: materials ─────────────────────────────────────────────── */
.ki-dome { padding: calc(var(--u) * 150) calc(var(--u) * 34) calc(var(--u) * 120); text-align: center; overflow: hidden; }
.ki-dome-title { margin-inline: auto; white-space: nowrap; }
.ki-dome-arch { display: block; width: min(100%, calc(var(--u) * 900)); margin: calc(var(--u) * 40) auto 0; overflow: hidden;
  border-radius: 50% 50% 0 0 / 46% 46% 0 0; color: inherit; }
.ki-dome-arch picture, .ki-dome-arch img { width: 100%; aspect-ratio: 4 / 4.4; object-fit: cover; transition: transform 1.2s ${OUT}; }
@media (hover: hover) and (pointer: fine) { .ki-dome-arch:hover img { transform: scale(1.03); } }
.ki-dome-body { margin: calc(var(--u) * 44) auto 0; }
@media (max-width: 991px) { .ki-dome-title { white-space: normal; } }
@media (max-width: 640px) { .ki-dome { padding-left: 20px; padding-right: 20px; } }

/* ── flair (flair.tsx) ────────────────────────────────────────────────── */
/* RollText: headroom above for the acute on Í/Ó/Ú, clipped at the padding box */
.ki-roll { position: relative; display: inline-block; overflow: hidden; vertical-align: bottom; padding-top: .2em; margin-top: -.2em; line-height: 1.2; }
.ki-roll-a, .ki-roll-b { display: block; white-space: nowrap; }
.ki-roll-b { position: absolute; left: 0; top: .2em; }
.ki-roll i { display: inline-block; font-style: normal; transition: transform .52s cubic-bezier(.76,0,.24,1); transition-delay: calc(var(--i, 0) * 18ms); }
.ki-roll-b i { transform: translateY(135%); }
/* the letters are drawn from data-ch, so the label exists as text only once */
.ki-roll i::before { content: attr(data-ch); white-space: pre; }
.ki-footwm-word i > span::before { content: attr(data-ch); }
.ki-fill-ink::before { content: attr(data-label); }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  :is(a, button):hover .ki-roll-a i, :is(a, button):focus-visible .ki-roll-a i { transform: translateY(-135%); }
  :is(a, button):hover .ki-roll-b i, :is(a, button):focus-visible .ki-roll-b i { transform: none; }
}

/* FillButton */
.ki-fill { --h: 54px; --c: 42px; --r: 6px; --ease: cubic-bezier(.785,.135,.15,.86);
  --dot: calc((100% - var(--c)) / 2) var(--r) calc((100% - var(--c)) / 2) calc(100% - var(--r) - var(--c));
  position: relative; isolation: isolate; display: inline-flex; align-items: center; height: var(--h);
  padding: 0 calc(var(--c) + var(--r) + 20px) 0 26px; border-radius: 999px; overflow: hidden;
  border: 1px solid rgb(247 242 233 / .5); background: rgb(14 11 9 / .22);
  font-family: ${MONO}; font-size: ${fluid(12.5, 12)}; letter-spacing: .16em; text-transform: uppercase;
  color: #F7F2E9; text-decoration: none; white-space: nowrap; -webkit-tap-highlight-color: transparent;
  transition: border-color .45s var(--ease), transform .2s ${OUT}; }
.ki-fill-label { position: relative; z-index: 0; }
.ki-fill-bg { position: absolute; z-index: 1; inset: var(--dot); border-radius: 999px; background: #F7F2E9; transition: inset .5s var(--ease); }
.ki-fill-ink { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; padding: inherit; color: ${INK};
  clip-path: inset(var(--dot) round 999px); transition: clip-path .5s var(--ease); }
.ki-fill-dot { position: absolute; z-index: 3; right: var(--r); top: 50%; width: var(--c); height: var(--c); margin-top: calc(var(--c) / -2); border-radius: 50%; overflow: hidden; color: ${INK}; }
.ki-fill-arrow { position: absolute; left: 50%; top: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; background: currentColor;
  -webkit-mask: var(--ki-arrow) center / contain no-repeat; mask: var(--ki-arrow) center / contain no-repeat; transition: transform .5s var(--ease); }
.ki-fill-arrow:first-child { transform: translateX(-190%) scale(0); }
.ki-fill:is(:hover, :focus-visible) { border-color: #F7F2E9; }
.ki-fill:is(:hover, :focus-visible) .ki-fill-bg { inset: 0; }
.ki-fill:is(:hover, :focus-visible) .ki-fill-ink { clip-path: inset(0 round 999px); }
.ki-fill:is(:hover, :focus-visible) .ki-fill-arrow:first-child { transform: none; }
.ki-fill:is(:hover, :focus-visible) .ki-fill-arrow:last-child { transform: translateX(190%) scale(0); }
.ki-fill:active { transform: scale(.97); }
@media (prefers-reduced-motion: reduce) { .ki-fill *, .ki-fill { transition: none !important; } }

/* PreviewZone: the photograph that follows the pointer over the register */
.ki-peek { position: fixed; left: 0; top: 0; z-index: 60; width: 260px; aspect-ratio: 4 / 3; overflow: hidden; pointer-events: none;
  border-radius: 3px; box-shadow: 0 24px 60px -18px rgb(8 6 5 / .6); opacity: 0; scale: .86; rotate: -2deg;
  transition: opacity .3s ${OUT}, scale .4s ${OUT}, rotate .5s ${OUT}; will-change: transform; }
.ki-peek[data-on] { opacity: 1; scale: 1; rotate: 0deg; }
/* every register photograph is mounted; the hovered one is the visible one */
.ki-peek-slot { position: absolute; inset: 0; opacity: 0; transition: opacity .22s linear; }
.ki-peek-slot[data-on] { opacity: 1; }
.ki-root .ki-peek picture, .ki-root .ki-peek img { width: 100%; height: 100%; object-fit: cover; }
@media not all and (hover: hover) { .ki-peek { display: none; } }

/* ── the neighbours at the foot of a project ─────────────────────────── */
.ki-proj-adj { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--u) * 34); border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 40); }
.ki-proj-adj-link { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px 22px; color: inherit; text-decoration: none; }
.ki-proj-adj-link--on:only-child { grid-column: 2; }
.ki-proj-adj-fig { grid-column: 1 / -1; display: block; overflow: hidden; aspect-ratio: 16 / 10; background: rgb(0 0 0 / .06); }
.ki-root .ki-proj-adj-fig picture, .ki-root .ki-proj-adj-fig img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ${OUT}; }
.ki-proj-adj-meta { display: grid; gap: 4px; min-width: 0; }
.ki-proj-adj-meta .ki-kicker { margin: 0 0 4px; }
.ki-proj-adj-title { font-family: ${HEAD}; font-weight: 300; font-size: ${fluid(30, 22)}; line-height: 1.15; }
.ki-proj-adj-lead { font-size: ${fluid(15, 14)}; line-height: 1.55; color: var(--ki-mute); }
.ki-proj-adj-arrow { width: 22px; height: 22px; background: currentColor; -webkit-mask: var(--ki-arrow) center / contain no-repeat; mask: var(--ki-arrow) center / contain no-repeat; transition: transform .5s ${OUT}; }
.ki-proj-adj-link--back .ki-proj-adj-arrow { transform: scaleX(-1); grid-column: 1; grid-row: 2; }
.ki-proj-adj-link--back .ki-proj-adj-meta { grid-column: 2; grid-row: 2; text-align: right; }
.ki-proj-adj-link--back { grid-template-columns: auto minmax(0, 1fr); }
@media (hover: hover) and (pointer: fine) {
  .ki-proj-adj-link:hover .ki-proj-adj-fig img { transform: scale(1.035); }
  .ki-proj-adj-link--on:hover .ki-proj-adj-arrow { transform: translateX(6px); }
  .ki-proj-adj-link--back:hover .ki-proj-adj-arrow { transform: scaleX(-1) translateX(6px); }
}
@media (max-width: 860px) {
  .ki-proj-adj { grid-template-columns: 1fr; gap: 34px; }
  .ki-proj-adj-link--on:only-child { grid-column: auto; }
}

/* photographs that are links to their project */
.ki-fig-link { display: block; color: inherit; text-decoration: none; }
a.ki-verk-grid { color: inherit; text-decoration: none; }
a.ki-verk-grid .ki-slide img, .ki-fig-link .ki-slide img, .ki-fig-link .ki-shutter img { transition: transform 1.2s ${OUT}; }
@media (hover: hover) and (pointer: fine) {
  a.ki-verk-grid:hover .ki-slide.is-in img, .ki-fig-link:hover .is-in img { transform: scale(1.03); }
}

/* one project in depth */
.ki-verk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--u) * 40); }
.ki-verk-grid .ki-slide:nth-child(2) { margin-top: calc(var(--u) * 70); }
.ki-verk-grid .ki-slide:nth-child(3) { margin-top: calc(var(--u) * -50); }
@media (max-width: 991px) {
  .ki-verk-grid { grid-template-columns: 1fr; }
  .ki-verk-grid .ki-slide:nth-child(2), .ki-verk-grid .ki-slide:nth-child(3) { margin-top: 0; }
}




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
  /* AND THE VERTICAL TOO. 130u is 150px on a 1440 desktop and 57px on a
     phone, because the unit floors at .44px — so every section on the page
     was two and a half times tighter than it was drawn to be, and the
     chapter that had been given real pixels then read as a different page.
     One beat for the whole site on a phone. */
  .ki-wrap, .ki-wrap-tight {
    padding-left: 20px; padding-right: 20px;
    padding-top: 80px; padding-bottom: 80px;
  }
  .ki-pagehead { padding: 120px 20px 40px; }
  .ki-grid { --cols: 1; }
  .ki-proj-gallery { grid-template-columns: 1fr; }
  .ki-proj-gallery > *:nth-child(3n+1) { grid-column: auto; }
  .ki-samband-in { padding: 88px 20px 48px; }
  .ki-samband-row { gap: 22px; margin-top: 26px; }
  .ki-foot { padding: 40px 20px 28px; }
  .ki-foot-grid { grid-template-columns: 1fr; gap: 26px; }
  .ki-facts { gap: 26px 40px; }
}

/* ── THE PHONE FLOOR ─────────────────────────────────────────────────────
   Measured on all 33 routes at 390px: nothing overflowed and nothing broke,
   but a run of links was a 25–33px target and a run of labels sat under
   12px. Two rules for a phone, applied in one place:
   · every tap target is 44px. Underlined links get an invisible hit area on
     ::after so the line under the word does not move; controls and rows get
     real height.
   · no label is set under 12px. */
@media (max-width: 860px), (pointer: coarse) {
  .ki-nav-mark, .ki-crumbs a, .ki-cat-head a, .ki-facts-row a, .ki-samb-mail,
  .ki-cluster-rest a, .ki-dl a, .ki-body a, .ki-samband-tel { position: relative; }
  .ki-nav-mark::after, .ki-crumbs a::after, .ki-cat-head a::after, .ki-facts-row a::after, .ki-samb-mail::after,
  .ki-cluster-rest a::after, .ki-dl a::after, .ki-samband-tel::after { content: ''; position: absolute; left: -4px; right: -4px; top: 50%; height: 44px; margin-top: -22px; }
  .ki-cta { min-height: 44px; }
  .ki-form input { min-height: 44px; padding: 12px 0; }
  .ki-skra-row a { padding: 13px 0; min-height: 44px; box-sizing: border-box; }
  /* the form's heading sat on its first field: give the section its breath */
  .ki-samb-body .ki-kicker { margin-bottom: 22px; }
  .ki-foot-link { padding: 13px 0; }

  .ki-show-cta .ki-fill { font-size: 12px; letter-spacing: .12em; }
  .ki-show-new { height: 24px; font-size: 12px; letter-spacing: .12em; }
  .ki-show-n, .ki-door-no, .ki-door-count, .ki-press-meta, .ki-proj-credit { font-size: 12px; }
  .ki-cluster-rest > span:first-child { font-size: 12px; }
}
`
