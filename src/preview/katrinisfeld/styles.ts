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
/* THE CHROME IS PART OF THE OPENING. The header sitting finished over a
   black screen while the name is still rising is what stopped the opening
   reading as one: it announced that this was the page with its pictures
   turned off. It is held with the photographs and arrives after them, on a
   transition rather than a tween, because the gate attribute coming off at
   the end of the intro is already the signal — nothing else has to know. */
html[data-ki-intro] .ki-nav { opacity: 0; }
.ki-nav { transition: opacity .85s ease .1s; }
@media (prefers-reduced-motion: reduce) { .ki-nav { transition: none; } }
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

/* ── the statement over a photograph ──────────────────────────────────────
   Geometry taken off the reference board rather than approximated. The
   device there is NOT a stacked headline with indents — that was the first
   attempt and it read as an ordinary left-aligned title. The words ZIGZAG:
   each one sits at its own point in the frame, alternating side to side and
   descending through roughly the top sixth to the bottom third, so the eye
   travels the photograph instead of scanning a block. Measured positions
   live on the component as x/y percentages; only the type and the masks are
   here.

   Two consequences of scattering that the stacked version did not have:

   1. The scrim must be EVEN. A 105deg gradient was fine when every word sat
      on the dark left end; with words at 49% and 68% across, half of them
      would land on the thin end of it and fail contrast.
   2. Below 860px absolute placement collapses — long Icelandic words at 49%
      of a 375px frame overlap each other — so the whole thing reverts to
      static flow with a small step. */
/* ── THE STATEMENT ────────────────────────────────────────────────────────
   Four words scattered across her photograph, and the whole question is how
   the type survives the picture without killing it. The version before this
   answered with a global veil heavy enough for the worst word — measured, an
   effective 0.5 to 0.6 — which is why the photograph read as murk and the
   words looked like they were floating on grey rather than sitting in a room.

   THE VEIL TRAVELS WITH THE WORD INSTEAD. The global wash is 0.16, which is
   unification and nothing more, and each word carries its own soft radial.
   Both halves are solved rather than chosen: the four positions are the
   quietest, darkest box in each word's own band of her actual photograph at
   this crop, picked on the 98th percentile so a single specular highlight
   cannot veto an otherwise clean wall; and the local alpha was then computed
   as the least each word needs to clear 4.5 on its worst pixel — 0.24, 0.48,
   0.48, 0.50. The peak is set at .58 for margin.
   RE-SOLVE IF THE PHOTOGRAPH, THE CROP OR THE TYPE SIZE CHANGES. */
.ki-stmt { position: relative; overflow: hidden; min-height: min(96svh, 900px); }
.ki-root .ki-stmt > picture, .ki-root .ki-stmt > picture > img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
.ki-stmt-scrim {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to bottom, rgb(18 15 13 / .48) 0%, rgb(18 15 13 / .52) 62%, rgb(18 15 13 / .60) 100%);
}
/* the mono/serif ratio the device is built on, kept: it sits top right,
   clear of the first word's band on the left */
.ki-stmt-eyebrow {
  position: absolute; top: calc(var(--u) * 52); right: calc(var(--u) * 46); margin: 0;
  font-family: ${MONO}; font-size: max(12px, .75rem); letter-spacing: .22em;
  text-transform: uppercase; color: #EFE3CE;
}
/* no blob behind the small type either — same reason as the words */
.ki-stmt-eyebrow > *, .ki-stmt-sub > * { position: relative; }
.ki-stmt-words { position: absolute; inset: 0; margin: 0; }
.ki-stmt-word { position: absolute; display: block; }
/* NO z-index HERE. .ki-stmt-word creates no stacking context, so a negative
   z-index does not sit behind its own word — it escapes to the nearest
   context and paints behind the PHOTOGRAPH, which is to say it does nothing
   at all. Paint order alone is enough: the veil is the first child and the
   clip below is positioned, so the type lands on top of it. */
.ki-stmt-clip { position: relative; display: block; overflow: hidden; padding-bottom: .1em; margin-bottom: -.1em; }
.ki-stmt-word i {
  display: block; font-style: normal;
  font-family: ${DISPLAY}; font-weight: 300;
  font-size: ${fluid(96, 40)}; line-height: 1.16; letter-spacing: -.02em;
  color: #FFF7E9; white-space: nowrap;
  /* a shadow measures as nothing — the pixel under the glyph is still the
     photograph — but it is what stops the edge of a light stroke fizzing
     against detail, which is the other half of legibility */
  text-shadow: 0 2px 34px rgb(10 8 7 / .55);
  transform: translateY(0);
}
.ki-js .ki-stmt-words:not(.is-in) .ki-stmt-word i { transform: translateY(112%); }
.ki-js .ki-stmt-words.is-in .ki-stmt-word i {
  transform: translateY(0);
  transition: transform 1.05s ${OUT}; transition-delay: calc(var(--s, 0) * 110ms);
}
.ki-static .ki-stmt-word i { transform: translateY(0); }
.ki-stmt-sub {
  position: absolute; left: 50%; bottom: calc(var(--u) * 46); transform: translateX(-50%);
  margin: 0; width: max-content; max-width: calc(100% - var(--u) * 60); text-align: center;
  font-family: ${MONO}; font-size: ${fluid(12.5, 11)}; letter-spacing: .2em;
  text-transform: uppercase; color: #F4EEE6;
}
@media (max-width: 860px) {
  /* the solved positions are for the desktop crop and mean nothing on a
     phone, which shows a different slice of the photograph — it stacks */
  /* 100u is 44px on a phone, and the gutter was a third one again. The
     statement keeps the page's 20 and a beat in the same family as the
     chapter's. */
  .ki-stmt { min-height: 0; padding: 88px 20px 80px; }
  /* the phone shows a different, brighter slice of the photograph, but the
     answer is still local: a lighter global wash and the veils kept */
  .ki-stmt-scrim { background: linear-gradient(to bottom, rgb(18 15 13 / .53) 0%, rgb(18 15 13 / .62) 100%); }
  .ki-stmt-eyebrow { position: relative; top: auto; right: auto; margin-bottom: calc(var(--u) * 40); }
  .ki-stmt-words { position: relative; inset: auto; }
  .ki-stmt-word {
    position: relative; left: auto !important; top: auto !important;
    margin-left: calc(var(--s, 0) * 5vw);
  }
  .ki-stmt-word i { white-space: normal; }
  .ki-stmt-sub {
    position: relative; left: auto; bottom: auto; transform: none; text-align: left;
    margin-top: calc(var(--u) * 40); letter-spacing: .12em; width: auto; max-width: none;
  }
}

/* ── the descent lockup ──────────────────────────────────────────────────
   The hero itself is the 21st.dev component now (.parallax*, styled by
   parallax-scrolling.css). This is only the type that rides its layer 3,
   which the component centres for us — so the old absolute positioning is
   gone and what is left is the scale and the scrim.

   It is her NAME, not a headline. A sentence needs to be read and then
   argued with; a name only needs to be seen, which is what survives being
   carried under the stone.

   Set in Melodrama — a high-contrast display face, hairline thins against
   full stems. It is the couture register rather than the architectural one,
   and that is the point: the type is the one delicate thing in a frame that
   is otherwise a photograph and a tonne of rock. Neither Sentient nor Archia
   could do that; both are even-weight and read as ordinary at this size.
   Verified before committing to it — internal name really is Melodrama (the
   library has mislabelled display fonts) and it carries every Icelandic
   glyph, which is not optional for Katrín Ísfeld.

   NO SCRIM. The lockup used to sit on a radial wash of near-black, which is
   the cheapest possible way to buy contrast and it fogged the photograph it
   was sitting on. Instead the lockup sits LOW in the frame, over the island
   and cabinetry, which is the dark part of her photograph — the composition
   earns the contrast rather than a gradient faking it. It also puts her name
   right above the stone edge, so the thing that goes under first is the
   thing the stone reaches first. */
/* The lockup's height in the frame is set HERE and nowhere else: the layer
   box is the top 80% of the frame, and the block hangs from its bottom edge
   with this much clearance. Raising it is one number. It carries a third
   line now — what she actually does — and that line is the lowest thing in
   the block, so it is the first thing the rising stone takes. */
.ki-plx-scene {
  height: 100%; display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 9%;
}
.ki-plx-lockup {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  width: 100%; max-width: calc(var(--u) * 1180); color: #F6F1E9;
  position: relative;
}
.ki-plx-name {
  margin: 0;
  font-family: ${DISPLAY_ALT};
  font-weight: 400;
  text-transform: uppercase;
  font-size: ${fluid(104, 34)};
  line-height: 1.02;
  /* the trailing letter carries its own tracking, which throws a centred
     line to the left by half of it — the indent puts it back */
  letter-spacing: .1em;
  text-indent: .1em;
  color: #F8F4EE;
}
/* the mask each letter rises out of. Generous above as well as below: this
   name carries an acute on a capital I, and a mask cut to the line box alone
   clips the accent clean off. The negative margins give the padding back, so
   the lockup measures exactly what it did before the letters were split. */
.ki-plx-word { display: inline-block; white-space: nowrap; }
.ki-plx-l {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .22em 0 .08em; margin: -.22em 0 -.08em;
}
.ki-plx-l > i { display: inline-block; font-style: normal; }
/* the two lines under the name are masks of their own, because they rise out
   of the ground the way the name does instead of fading up. Padding for the
   descenders in "Skipulag" and the acute in "lýsing", handed straight back
   by the negative margin so the lockup measures what it always did. */
.ki-plx-role > span, .ki-plx-tag > span { display: block; }
/* THE MASK ONLY EXISTS WHILE THE OPENING IS RUNNING. Left on permanently it
   is a box that can only ever fail closed: anything that shortens it — a flex
   parent squeezing a column, a stray line-height — stops overflowing
   harmlessly and starts DELETING her job title and the line under it, which
   is exactly what shipped. The gate attribute is up for the rise and gone
   forever after, so after the opening these are ordinary paragraphs again.
   The padding stays in both states so nothing shifts when it goes. */
html[data-ki-intro] .ki-plx-role, html[data-ki-intro] .ki-plx-tag { overflow: hidden; }
.ki-plx-role, .ki-plx-tag { padding-bottom: .3em; margin-bottom: -.3em; }
/* and the lockup's own lines never shrink: they are the content, not filler */
.ki-plx-name, .ki-plx-role, .ki-plx-tag { flex: none; }
.ki-plx-role {
  margin: calc(var(--u) * 26) 0 -.3em;
  font-family: ${MONO};
  text-transform: uppercase;
  font-size: ${fluid(13.5, 11)};
  letter-spacing: .36em;
  text-indent: .36em;
  color: #CFC6B9;
}
/* the one sentence on the landing frame. Body, not another label: a mono
   line under a mono line reads as two eyebrows arguing. It stays narrow so
   it breaks where it is written to break, and it is quiet enough that the
   name is still the thing that is seen. */
.ki-plx-tag {
  margin: calc(var(--u) * 30) 0 -.3em;
  max-width: calc(var(--u) * 470);
  font-size: ${fluid(15.5, 14)};
  line-height: 1.62;
  color: #DCD3C6;
  text-shadow: 0 1px 22px rgb(10 8 7 / .6);
}

/* WHAT ARRIVES ON THE STONE.
   It lands at 0.55 of the descent, by which point the frame is material
   rather than room, and it is deliberately quiet: at that depth the light
   in the photograph has nearly gone, so the type carries almost all of the
   contrast on its own and does not need to compete with anything. */
.ki-plx-deep {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  width: 100%; max-width: calc(var(--u) * 720);
}
.ki-plx-deep-kicker {
  margin: 0 0 calc(var(--u) * 22);
  font-family: ${MONO};
  text-transform: uppercase;
  font-size: ${fluid(12.5, 11)};
  letter-spacing: .34em; text-indent: .34em;
  color: #A79C8C;
}
.ki-plx-deep-line {
  margin: 0;
  font-family: ${DISPLAY};
  font-weight: 300;
  font-size: ${fluid(34, 21)};
  line-height: 1.32;
  color: #F2ECE3;
}
.ki-plx-deep-cta { margin: calc(var(--u) * 34) 0 0; }

/* ── THE SECTION THROUGH HER PALETTE ─────────────────────────────────────
   The bottom of the descent, and the one composition that could not be a
   centred slide: a drawing with its title block beside it.

   LEFT, held to a narrow measure and set flush left: what she says about
   material. RIGHT: five columns of the real thing, NAMED ABOVE ONE DATUM and
   hanging below it to five different depths — a section through the ground
   she has just taken the visitor down through.

   What this replaces, and why. Twice now the block has been five equal
   things in a row with their colour printed under them: first as bands in a
   box with the label across them, then as samples standing on a shelf. Both
   are a swatch row, and the hex code under each name is what fixes that
   reading — it turns her palette into a colour picker. The number does the
   opposite: 01 to 05 under a datum is a materials schedule, which is the
   document an architect actually issues, and the colour needs no caption
   because it is the photograph. */
.ki-plx-deep--strata {
  max-width: calc(var(--u) * 1360); width: 100%;
  max-height: 100%;
  display: grid; align-items: start; text-align: left;
  grid-template-columns: minmax(0, 30%) minmax(0, 1fr);
  /* ONE BAND ABOVE THE LINE, everything else below it. Row 1 is exactly the
     head band the core measures its own names against, so the datum drawn at
     its bottom edge is the same line the five columns hang from. */
  --head: clamp(26px, 4svh, 46px);
  grid-template-rows: var(--head) auto;
  column-gap: clamp(26px, 4.2vw, 80px);
}
.ki-plx-deep--strata > .ki-plx-deep-kicker {
  grid-row: 1; grid-column: 1; align-self: end; margin: 0 0 4px;
}
.ki-strata-datum {
  grid-row: 1; grid-column: 1 / -1; align-self: end;
  height: 1px; background: rgb(242 236 227 / .42); transform-origin: 0% 50%;
}
.ki-strata-say {
  grid-row: 2; grid-column: 1;
  display: flex; flex-direction: column; align-items: flex-start; text-align: left;
  padding-top: clamp(14px, 2.6svh, 30px);
}
.ki-strata-core { grid-row: 1 / span 2; grid-column: 2; }
.ki-plx-deep--strata .ki-strata-title { margin-bottom: 0; }
.ki-strata-title {
  margin: 0;
  font-family: ${DISPLAY}; font-weight: 300; line-height: 1.08;
  font-size: ${fluid(52, 30)}; color: #F2ECE3;
  text-wrap: balance;
}
.ki-strata-line {
  margin: clamp(16px, 3.4svh, 38px) 0 0; max-width: 34ch;
  font-family: ${DISPLAY}; font-weight: 300;
  font-size: ${fluid(19, 16)}; line-height: 1.46; color: #D9D1C5;
}
.ki-plx-deep--strata .ki-plx-deep-cta { margin-top: clamp(14px, 3svh, 36px); }
.ki-plx-deep--strata .ki-cta { color: #F2ECE3; }

/* THE CORE. --head is the band the names occupy above the datum, and it is a
   fixed number rather than whatever the type measures, because the rule is
   drawn against it and one line has to serve all five columns. */
.ki-strata-core { position: relative; width: 100%; }
.ki-strata {
  list-style: none; margin: 0; padding: 0; width: 100%;
  display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
  column-gap: clamp(8px, 1.5vw, 22px); align-items: start;
}
/* head band, then the material — flush to the datum, so the five columns
   hang off one line and the only ragged edge is the bottom one */
.ki-stratum { margin: 0; display: grid; grid-template-rows: var(--head) auto; }
.ki-stratum-head { display: flex; align-items: baseline; gap: .5em; min-width: 0; }
.ki-stratum-no {
  font-family: ${MONO}; font-size: ${fluid(11, 9.5)}; letter-spacing: .18em;
  color: #8E8375;
}
.ki-stratum-name {
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(26, 17)};
  letter-spacing: .01em; color: #F2ECE3; line-height: 1;
  white-space: nowrap;
}
.ki-stratum-fig {
  width: 100%; margin: 0; overflow: hidden;
  /* svh, so the section scales with the FRAME it is pinned inside. On a short
     wide window a fixed pixel floor pushed the block taller than the frame
     and clipped the heading off the top. */
  /* the material hangs BELOW the datum with a band of stone between them,
     because a rule the columns sit flush on is a rule nobody can see */
  margin-top: 13px;
  height: calc(var(--spec, 1) * clamp(104px, 38svh, 470px));
  box-shadow: 0 34px 60px -22px rgb(0 0 0 / .75), 0 6px 14px -6px rgb(0 0 0 / .5);
}
/* five depths, and no two adjacent ones close: a section is read by its
   ragged bottom edge, and an even rhythm reads as a chart */
.ki-stratum:nth-child(1) .ki-stratum-fig { --spec: 1.00; }
.ki-stratum:nth-child(2) .ki-stratum-fig { --spec: .71; }
.ki-stratum:nth-child(3) .ki-stratum-fig { --spec: .90; }
.ki-stratum:nth-child(4) .ki-stratum-fig { --spec: .56; }
.ki-stratum:nth-child(5) .ki-stratum-fig { --spec: 1.13; }
/* .ki-root picture > img sets height:auto at (0,1,2), which beat the (0,1,1)
   rule that used to sit here — so every image kept its own 3:4 inside a
   figure sized off the frame, and the tall ones stopped short. Two classes
   outrank it. */
.ki-root .ki-stratum-fig picture, .ki-root .ki-stratum-fig img { width: 100%; height: 100%; object-fit: cover; margin: 0; }

/* words arrive one at a time; each is its own box so it can move alone */
/* the window each word rises out of. Room above for the acute on rýmið and
   below for the descender in eigin; the negative margins hand the space back
   so the heading measures exactly what it did before it was split. */
.ki-whisper > span {
  display: inline-block; white-space: nowrap; overflow: hidden;
  vertical-align: bottom; padding: .2em 0 .22em; margin: -.2em 0 -.22em;
}
.ki-whisper > span > i { display: inline-block; font-style: normal; }
/* margin on the RIGHT of every word but the last. On the left it survives a
   line break and indents the wrapped line, which threw "rýmið." a quarter of
   an em off the flush-left edge it shares with everything under it. */
.ki-whisper > span:not(:last-child) { margin-right: .26em; }

@media (max-width: 860px) {
  /* ONE COLUMN, and the title block splits around the drawing: the sentence
     and the invitation belong AFTER the material on a phone, where there is
     no beside. display:contents lifts the four lines out of their plate so
     the grid can order them around the core. */
  .ki-plx-deep--strata {
    max-width: none; padding-inline: 20px;
    grid-template-columns: minmax(0, 1fr); gap: 0;
  }
  .ki-strata-say { display: contents; }
  .ki-plx-deep--strata { grid-template-rows: none; }
  .ki-plx-deep--strata > .ki-plx-deep-kicker,
  .ki-plx-deep--strata .ki-strata-say, .ki-strata-core,
  .ki-plx-deep--strata .ki-strata-title, .ki-plx-deep--strata .ki-strata-line,
  .ki-plx-deep--strata .ki-plx-deep-cta { grid-row: auto; grid-column: 1; }
  .ki-strata-say { padding-top: 0; }
  .ki-plx-deep--strata > .ki-plx-deep-kicker { order: 1; margin: 0 0 10px; }
  .ki-plx-deep--strata .ki-strata-title { order: 2; font-size: 30px; margin-bottom: 22px; }
  .ki-strata-core { order: 3; }
  .ki-plx-deep--strata .ki-strata-line { order: 4; margin-top: 22px; max-width: none; font-size: 16px; }
  .ki-plx-deep--strata .ki-plx-deep-cta { order: 5; margin-top: 18px; }
  /* the datum is a device for one row of columns; with five over three rows
     each name carries its own rule instead */
  .ki-strata-datum { display: none; }
  .ki-strata-core { --head: 23px; }
  .ki-stratum-head { border-bottom: 1px solid rgb(242 236 227 / .24); align-items: flex-end; padding-bottom: 3px; }
  .ki-strata {
    /* minmax(0, 1fr), not 1fr. A bare 1fr is minmax(AUTO, 1fr), so a column
       whose name is long refuses to shrink below it and steals width from
       its neighbour. */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 16px;
  }
  /* five into two: the last one takes the full width and reads as a wide
     plate of stone, which is what stone is. It is the only arrangement of
     five that leaves no orphan in a half-empty row. */
  .ki-stratum:last-child { grid-column: 1 / -1; }
  .ki-stratum-fig {
    margin-top: 9px;
    height: calc(var(--spec, 1) * clamp(88px, 12.5svh, 146px));
    box-shadow: 0 18px 34px -14px rgb(0 0 0 / .75), 0 4px 10px -5px rgb(0 0 0 / .5);
  }
  .ki-stratum:nth-child(1) .ki-stratum-fig { --spec: 1.00; }
  .ki-stratum:nth-child(2) .ki-stratum-fig { --spec: .84; }
  .ki-stratum:nth-child(3) .ki-stratum-fig { --spec: .84; }
  .ki-stratum:nth-child(4) .ki-stratum-fig { --spec: 1.00; }
  .ki-stratum:last-child .ki-stratum-fig { --spec: .60; }
  .ki-stratum-name { font-size: 17px; }
  .ki-stratum-no { font-size: 9.5px; letter-spacing: .14em; }
}
/* a short frame cannot carry the whole apparatus: the closing sentence is
   the part the section already says */
@media (max-height: 620px) and (min-width: 861px) {
  .ki-plx-deep--strata .ki-strata-line { display: none; }
}
/* the same section, in flow, for a visitor who has asked for no motion */
.ki-strata-static { display: none; padding: calc(var(--u) * 90) calc(var(--u) * 34); text-align: left; }
.ki-strata-static .ki-strata-core { max-width: calc(var(--u) * 900); margin: calc(var(--u) * 40) auto 0; }
.ki-strata-static .ki-plx-deep-kicker, .ki-strata-static .ki-strata-title { text-align: center; }
@media (prefers-reduced-motion: reduce) { .ki-strata-static { display: block; } }

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
.ki-newest-title { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(19, 16)}; line-height: 1.24; text-wrap: balance; }
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
/* ON A PHONE IT SITS ABOVE THE NAME, NOT UNDER IT. In the bottom corner it
   was landing on the crest of the rising stone and reading as part of the
   rock; there is also far less frame to share on a phone, so the one thing
   here that asks to be clicked belongs where the eye starts rather than
   where the ground is. Full width, hairline under it, and the lockup is
   pushed down by exactly its height so the name keeps its own place in the
   frame. */
@media (max-width: 860px) {
  .parallax__corner:has(.ki-newest) {
    right: 20px; left: 20px; bottom: auto; top: calc(env(safe-area-inset-top, 0px) + 76px);
  }
  /* THE WASH, not a box. Moved up the frame the card sits on her kitchen
     rather than on the stone, and cream type over a lit stone counter
     measured 1.00:1 — the same colour as what is behind it. The design has
     no cards and no glass here, so this is the device the header already
     uses: one soft fall of shade from the top of the frame, full bleed,
     fading out below the card. Measured after: worst pixel 4.5:1 or better. */
  .parallax__corner:has(.ki-newest)::before {
    content: ''; position: absolute; z-index: -1;
    left: -20px; right: -20px; top: -110px; bottom: -34px;
    background: linear-gradient(to bottom,
      rgb(12 10 9 / .82) 0%, rgb(12 10 9 / .78) 52%, rgb(12 10 9 / .55) 78%, rgb(12 10 9 / 0) 100%);
    pointer-events: none;
  }
  .ki-newest {
    max-width: none; width: 100%;
    padding-bottom: 14px; border-bottom: 1px solid rgb(242 236 227 / .26);
  }
  .ki-newest-arrow { margin-left: auto; }
}

/* what a cluster cannot show as a card, named in a line — the register that
   used to repeat the whole grid as text is gone */
.ki-cluster-rest { margin: calc(var(--u) * 26) 0 0; font-size: ${fluid(15, 14)}; line-height: 1.7; color: var(--ki-mute); }
.ki-cluster-rest > span:first-child { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .12em; text-transform: uppercase; margin-right: 8px; }
.ki-cluster-rest a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }

/* ── THE PASSAGE ──────────────────────────────────────────────────────────
   The only stone section on the page. The descent puts you inside the rock,
   this is the distance you travel through it, and the gate at the far end
   brings you out — everything after that is in the light.

   It used to be a strip of projects on a stone TEXTURE, and the texture
   scrolled vertically behind it while the strip was pinned, because the pin
   fixes this section for a whole viewport while its ancestor's background
   keeps moving with the page. Two motions at right angles, neither of them
   the one the visitor is making. That is what was overstimulating. So the
   rock moves sideways now, with the journey, on the same scroll arithmetic
   as the track: a wall at 0.18 of its speed and a nearer mass along the
   bottom at 0.55. Depth from the ratio, as in both gates; nothing scaled. */
/* ── THE HORIZONTAL JOURNEY ───────────────────────────────────────────────
   Built to the portable spec. The mechanism lives in the engine; what is
   here is the composition, and in this device the composition IS the widths:
   a run of equal panels reads as a slideshow, so 100vw spreads alternate
   with 85.7vw full-bleeds that are narrower than a screen on purpose, and
   the plate is sized in svh so it scales with viewport HEIGHT and holds its
   crop on a short wide window. */
.ki-hs { position: relative; background: ${CREAM}; }
.ki-hs-pin { position: relative; overflow: hidden; }
.ki-hs-track { display: flex; align-items: stretch; }
.ki-hs-slide {
  flex: 0 0 auto; position: relative; margin: 0;
  /* subpixel rounding opens a hairline of the page between adjacent
     full-height slides, which travels across the screen as a flickering
     light line. One pixel of overlap closes it. */
  margin-left: -1px;
}

/* — the intro: transparent ground, the chapter introduced — */
.ki-hs-slide.is-intro { width: 100vw; display: grid; place-items: center; padding: 0 calc(var(--u) * 90); }
.ki-hs-introbox { max-width: calc(var(--u) * 620); }
.ki-hs-lead {
  margin: calc(var(--u) * 20) 0 calc(var(--u) * 22);
  font-family: ${DISPLAY}; font-weight: 300; line-height: 1.12;
  font-size: ${fluid(66, 34)}; color: ${INK};
}
.ki-hs-count { font-family: ${MONO}; font-size: 13px; color: var(--ki-mute); margin: calc(var(--u) * 30) 0 0; }

/* — the full-bleed: image only, and the chapter's punctuation — */
.ki-hs-slide.is-bleed { width: 85.7vw; }
.ki-hs-bleedfig { position: absolute; inset: 0; display: block; overflow: hidden; background: rgb(0 0 0 / .1); }
.ki-hs-chip {
  position: absolute; left: calc(var(--u) * 46); bottom: calc(var(--u) * 52);
  display: grid; gap: 6px; color: #F4EEE6; max-width: calc(var(--u) * 420);
  text-shadow: 0 1px 26px rgb(0 0 0 / .55);
}
.ki-hs-chip .ki-kicker { color: #E4C6A8; margin: 0; }
.ki-hs-chip-title { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(34, 22)}; line-height: 1.08; }
.ki-hs-chip-title a { color: inherit; text-decoration: none; }
.ki-hs-chip-no {
  position: absolute; right: calc(var(--u) * -70); bottom: 2px;
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .2em; color: #D8CBBA;
}

/* — the split: a copy column against one figure, both centred — */
.ki-hs-slide.is-split {
  width: 100vw; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center; gap: calc(var(--u) * 80); padding: 0 calc(var(--u) * 90);
}
.ki-hs-copy { max-width: calc(var(--u) * 460); }
.ki-hs-splittitle { margin: calc(var(--u) * 14) 0 calc(var(--u) * 18); font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(44, 26)}; line-height: 1.1; }
.ki-hs-splittitle a { color: inherit; text-decoration: none; }

/* — the duo: two figures on different aspect ratios — */
.ki-hs-slide.is-duo {
  width: 100vw; display: flex; align-items: center; justify-content: center;
  gap: calc(var(--u) * 70); padding: 0 calc(var(--u) * 90);
}
.ki-hs-slide.is-duo .ki-hs-fig:first-child { width: 34vw; }
.ki-hs-slide.is-duo .ki-hs-fig:last-child { width: 24vw; align-self: flex-end; margin-bottom: 12svh; }

/* — the plate: the turn, and the only inverted slide — */
.ki-hs-slide.is-plate {
  /* never narrower than the frame. At 151.66svh it came out 80px short of a
     1600x1000 window, which left a sliver of the next photograph beside it —
     enough for the header's right-hand end to be sitting on cream while the
     rest of it sat on charcoal, and the burger themed dark against the dark
     panel. The turn should be the whole frame anyway. */
  width: max(100vw, 151.66svh); background: ${CHARCOAL}; color: #EDE7DE;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 0 calc(var(--u) * 90);
}
.ki-hs-plateline {
  margin: 0; max-width: 22ch;
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(60, 30)}; line-height: 1.16; color: #F2ECE3;
}
.ki-hs-platesub {
  margin: calc(var(--u) * 30) 0 0;
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .18em; text-transform: uppercase; color: #A79C8C;
}

/* — THE SPECTRUM. The slide says one hand runs through all of them; without
     this it says it and shows nothing, which is why the panel read as empty.
     A single rule, seven colours threaded on it: the rule is the hand, the
     colours are the rooms. Every hex is measured off her own photograph. — */
.ki-hs-spec { width: min(calc(var(--u) * 1180), 78%); margin: calc(var(--u) * 74) 0 calc(var(--u) * 8); }
.ki-hs-spec-rule {
  display: block; height: 1px; background: rgb(237 231 222 / .22);
  transform: scaleX(0); transform-origin: left center;
}
.ki-js .ki-hs-spec.is-in .ki-hs-spec-rule {
  transform: scaleX(1); transition: transform 1.3s ${OUT} .05s;
}
.ki-static .ki-hs-spec-rule, .ki-root:not(.ki-js) .ki-hs-spec-rule { transform: none; }
.ki-hs-spec-list {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(7, 1fr); align-items: start;
}
.ki-hs-spec-item {
  display: flex; flex-direction: column; align-items: center;
  /* the chip straddles the rule it is threaded on */
  margin-top: calc(var(--u) * -7);
}
.ki-js .ki-hs-spec .ki-hs-spec-item { opacity: 0; transform: translateY(calc(var(--u) * 10)); }
.ki-js .ki-hs-spec.is-in .ki-hs-spec-item {
  opacity: 1; transform: none;
  transition: opacity .7s ${OUT}, transform .7s ${OUT};
  transition-delay: calc(.28s + var(--i) * .075s);
}
.ki-static .ki-hs-spec .ki-hs-spec-item, .ki-root:not(.ki-js) .ki-hs-spec .ki-hs-spec-item {
  opacity: 1; transform: none;
}
.ki-hs-spec-chip {
  width: calc(var(--u) * 14); height: calc(var(--u) * 14); border-radius: 1px;
  box-shadow: 0 0 0 calc(var(--u) * 4) ${CHARCOAL};
}
.ki-hs-spec-name {
  margin-top: calc(var(--u) * 18);
  font-family: ${MONO}; font-size: max(10px, calc(var(--u) * 11)); letter-spacing: .14em;
  text-transform: uppercase; color: #CFC5B7;
}
.ki-hs-spec-hex {
  margin-top: calc(var(--u) * 6);
  font-family: ${MONO}; font-size: max(9px, calc(var(--u) * 10)); letter-spacing: .1em; color: #7E7466;
}

/* — the close: full bleed under a scrim, with the closing line on it — */
.ki-hs-slide.is-close { width: 100vw; display: grid; place-items: center; text-align: center; }
.ki-hs-slide.is-close > .ki-hs-img { position: absolute; inset: 0; }
.ki-hs-closescrim { position: absolute; inset: 0; background: linear-gradient(to bottom, rgb(16 13 11 / .5), rgb(16 13 11 / .66)); }
.ki-hs-closebox { position: relative; max-width: calc(var(--u) * 760); padding: 0 calc(var(--u) * 34); }
.ki-hs-closeline {
  margin: 0; font-family: ${DISPLAY}; font-weight: 300;
  font-size: ${fluid(58, 30)}; line-height: 1.16; color: #FFF7E9;
}
.ki-hs-slide.is-close .ki-cta-row { margin-top: calc(var(--u) * 40); }
.ki-hs-slide.is-close .ki-cta { color: #F4EEE6; }

/* — figures, and the counter-move the spec calls for — */
.ki-hs-fig { margin: 0; }
.ki-hs-frame { display: block; overflow: hidden; background: rgb(0 0 0 / .08); }
.ki-hs-img { display: block; overflow: hidden; height: 100%; }
/* the image is wider than its frame and drifts against the track, so the
   photograph appears to hold still in the world while its window slides over
   it. 120% with -10% is the spec's own; the engine writes at most 8% */
.ki-root .ki-hs-img picture, .ki-root .ki-hs-img img {
  width: 120%; margin-left: -10%; height: 100%; object-fit: cover; display: block;
}
.ki-hs-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-top: 14px; }
.ki-hs-title { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(24, 18)}; }
.ki-hs-title a { color: inherit; text-decoration: none; }
.ki-hs-sub { margin: 0; font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .08em; text-transform: uppercase; color: var(--ki-mute); white-space: nowrap; }

@media (min-width: 768px) and (hover: hover) and (pointer: fine) {
  /* the section's height is written by the engine: one viewport plus how far
     the track overflows, so vertical distance buys horizontal distance 1:1 */
  .ki-hs-pin { position: sticky; top: 0; height: 100svh; }
  .ki-hs-track { height: 100svh; will-change: transform; }
  .ki-hs-slide { height: 100svh; }
  .ki-js .ki-hs-img[data-ki-hpar] img { transform: translate3d(-8%, 0, 0); }
}

/* MOBILE IS A DIFFERENT LAYOUT, NOT A SCALED ONE. The JS returns early and
   this turns the row into a column; nothing survives but the content and its
   order. The inline transform the desktop path left behind has to be cleared
   here too, or the whole chapter renders off-screen. */
@media (max-width: 767px), (hover: none), (pointer: coarse) {
  /* SPACING IN PIXELS HERE, NOT IN --u. The unit is 100vw/1440 with a .44px
     floor, so on a 390 phone every one of it is .44 of a pixel: the 76 that
     reads as generous on a desktop is 33px on a phone, which is why a
     paragraph sat almost against the photograph under it and the whole
     chapter read as though its spacing rules were missing. Fixed distances
     between blocks are fixed distances; they do not scale with the window. */
  .ki-hs-track { flex-direction: column; height: auto; transform: none !important; }
  /* EVERY VARIANT NAMED, because each one carries its own padding at two
     class names and a single-class rule cannot reach past that however late
     it comes. Measured before this: intro, split, duo and close all had
     padding-top and padding-bottom of ZERO on a phone — the type ran
     straight into the photograph above and below it — and their left edge
     sat at 40px against the 20px every other section on the page uses. Four
     different gutters on one page: 20, 22, 40 and 59.
     One gutter, 20px, the same as .ki-wrap. One vertical beat. */
  .ki-hs-slide,
  .ki-hs-slide.is-intro,
  .ki-hs-slide.is-split,
  .ki-hs-slide.is-duo {
    width: 100% !important; height: auto; margin-left: 0;
    padding: 80px 20px 88px;
  }
  /* the intro is a centred grid on the desktop track, which on a phone left
     its box floating in the middle of the column with its first line 59px in
     while everything above and below it started at 20 */
  .ki-hs-slide.is-intro { place-items: start stretch; }
  .ki-hs-introbox { max-width: none; }
  /* and where two blocks of type meet, an actual rule — the edge of a
     photograph is its own divider, but nothing divided type from type */
  .ki-hs-slide + .ki-hs-slide:not(.is-bleed):not(.is-close):not(.is-plate) {
    border-top: 1px solid rgb(31 27 24 / .13);
  }
  .ki-hs-slide.is-bleed { height: 74svh; padding: 0; }
  .ki-hs-slide.is-plate { width: 100% !important; }
  /* THE THREAD TURNS. Seven columns on a phone is seven slivers with the
     names running into each other, and four columns is the same problem in
     two rows with the chips no longer on the rule. The rule stands up
     instead: one line down the left with the seven colours strung along it,
     each with its room beside it. Same idea, read top to bottom. */
  /* the base rule sets padding on .ki-hs-slide.is-plate, which outranks the
     column layout's own padding however late it comes — so the turn had no
     vertical room at all and its first line sat under the fixed wordmark */
  .ki-hs-slide.is-plate {
    text-align: left; align-items: flex-start;
    padding: 96px 20px 96px;
  }
  .ki-hs-plateline, .ki-hs-platesub { text-align: left; }
  .ki-hs-platesub { margin-top: 26px; }
  .ki-hs-spec { position: relative; width: 100%; margin: 42px 0 0; }
  .ki-hs-spec-rule {
    position: absolute; left: 6px; top: 4px; bottom: 4px;
    width: 1px; height: auto; transform: scaleY(0); transform-origin: top center;
  }
  .ki-js .ki-hs-spec.is-in .ki-hs-spec-rule { transform: scaleY(1); }
  .ki-hs-spec-list { grid-template-columns: 1fr; row-gap: 17px; }
  .ki-hs-spec-item { flex-direction: row; align-items: center; gap: 16px; margin-top: 0; }
  .ki-hs-spec-chip { width: 13px; height: 13px; box-shadow: 0 0 0 4px ${CHARCOAL}; }
  .ki-hs-spec-name { margin-top: 0; font-size: 11.5px; }
  .ki-hs-spec-hex { margin-top: 0; margin-left: auto; font-size: 10px; }
  .ki-hs-slide.is-duo { flex-direction: column; gap: 44px; }
  .ki-hs-slide.is-duo .ki-hs-fig { width: 100% !important; align-self: auto; margin-bottom: 0; }
  .ki-hs-slide.is-split { grid-template-columns: 1fr; gap: 30px; }
  .ki-hs-slide.is-close { min-height: 72svh; padding: 0 20px; }
  .ki-hs-introbox .ki-hs-count { margin-top: 30px; }
  .ki-hs-splittitle { margin: 12px 0 14px; }
  .ki-hs-meta { padding-top: 16px; }
  .ki-hs-chip { left: 20px; right: 20px; bottom: 26px; }
  .ki-hs-chip-no { position: static; display: block; margin-top: 6px; }
  .ki-root .ki-hs-img picture, .ki-root .ki-hs-img img { width: 100%; margin-left: 0; transform: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .ki-js .ki-hs-img[data-ki-hpar] img { transform: none !important; }
}

/* ── material bands: the palette, carried by the material ─────────────── */
/* default is the TOUCH build — a stacked strip. The accordion is layered on
   only where there is a real pointer; see the note on the component. */
.ki-mat { margin-top: calc(var(--u) * 56); }
/* Taller than the first cut. At 168px a band was an 8.5:1 letterbox, and the
   styled object in each frame — the bowl, the olive branch, the stacked
   plates — was sliced through the middle by it. The still-life is the whole
   point of the composition, so the band has to be tall enough to hold one. */
.ki-mat-band {
  position: relative; margin: 0; overflow: hidden;
  height: clamp(150px, calc(var(--u) * 244), 290px);
}
.ki-root .ki-mat-band picture, .ki-root .ki-mat-band picture > img {
  width: 100%; height: 100%; object-fit: cover;
}
/* The name was set in Geist Mono at label size, the same weight and size as
   the hex beside it, which is why the board read as a swatch library rather
   than a material study: mono at 13px IS the typography of a spec sheet.
   The material takes the display serif at heading size, in her own mixed
   case, and the hex drops to a quiet mono caption UNDER it — a real
   hierarchy instead of two equal strings side by side. */
.ki-mat-name {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: calc(var(--u) * 7);
  color: ${INK};
}
.ki-mat-name > span:first-child {
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(38, 24)};
  letter-spacing: .012em; line-height: 1;
}
.ki-mat-hex {
  font-family: ${MONO}; font-size: ${fluid(11, 10.5)}; letter-spacing: .2em;
  /* .62 measured 3.85 on copper and failed AA: at 11px this is body text and
     owes 4.5:1, and the size difference against the 38px name already carries
     the hierarchy without dimming it as well */
  opacity: .82;
}
/* The three dark materials take cream type over a scrim; the two light ones
   need neither — ink measures 7.12:1 and 4.93:1 on their WORST pixel under
   the label, not their average. .45 rather than .35 because eik is the
   weakest of the three (6.44 -> 7.91) and read soft on screen even though
   the lower value technically passed. Re-measure if a texture changes. */
/* THE VEIL IS LOCAL, NOT FULL-BLEED. A flat scrim across the whole band did
   fix the label contrast, and in doing so bleached every material back to
   beige — which is the one thing a colour board cannot do, since the colour
   is the entire content. So the veil is an ellipse centred on the label: at
   its middle it is strong enough to carry the type, and by the edges of the
   band it is gone and the material is her measured colour again.
   (ellipse, with two radii — a percentage radius is invalid for a circle
   keyword and silently drops the whole gradient to none.) */
.ki-mat-band .ki-mat-name::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
}
.ki-mat-band.is-dark .ki-mat-name { color: #F4EEE6; }
.ki-mat-band.is-dark .ki-mat-name::before {
  background: radial-gradient(ellipse 34% 74% at 50% 50%,
    rgb(0 0 0 / .70) 0%, rgb(0 0 0 / .52) 52%, rgb(0 0 0 / 0) 82%);
}
/* the light bands need the veil in the other direction: ink on the deep
   folds of the linen and the copper measured 3.27 and 3.57 on the worst
   pixel, and this label is a 300-weight serif, where the 3:1 large-text
   allowance assumes normal weight */
.ki-mat-band:not(.is-dark) .ki-mat-name::before {
  background: radial-gradient(ellipse 34% 74% at 50% 50%,
    rgb(243 239 232 / .78) 0%, rgb(243 239 232 / .52) 52%, rgb(243 239 232 / 0) 82%);
}
.ki-mat-band.is-dark .ki-mat-name > * { position: relative; }

/* THE ACCORDION MUST COME AFTER THE BASE RULES. Placed above them it lost
   every tie on source order — .ki-mat-hex{opacity:.82} beat the media
   query's opacity:0, so all five columns showed their hex at rest. */
@media (min-width: 861px) and (hover: hover) and (pointer: fine) {
  .ki-mat { display: flex; height: clamp(320px, calc(var(--u) * 560), 640px); }
  .ki-mat-band {
    flex: 1 1 0; height: 100%; min-width: 0;
    transition: flex-grow .5s cubic-bezier(.62,.05,.01,.99);
    outline-offset: -3px;
  }
  /* 3.4 rather than the reference's w-full: all five must stay readable as
     colour even while one is open */
  .ki-mat-band:hover, .ki-mat-band:focus-visible { flex-grow: 3.4; }
  /* the name stands upright in a narrow column and turns horizontal as the
     column opens — the label never disappears, only the hex waits */
  .ki-mat-name { flex-direction: column; gap: calc(var(--u) * 10); }
  .ki-mat-hex {
    opacity: 0; transform: translateY(6px);
    transition: opacity .42s ${OUT} .06s, transform .42s ${OUT} .06s;
  }
  .ki-mat-band:hover .ki-mat-hex, .ki-mat-band:focus-visible .ki-mat-hex {
    opacity: .82; transform: none;
  }
  /* the veil is an upright ellipse while the column is narrow, and relaxes
     into the wide one as it opens */
  .ki-mat-band .ki-mat-name::before {
    background: radial-gradient(ellipse 92% 32% at 50% 50%,
      rgb(0 0 0 / .70) 0%, rgb(0 0 0 / .52) 52%, rgb(0 0 0 / 0) 82%);
  }
  .ki-mat-band:not(.is-dark) .ki-mat-name::before {
    background: radial-gradient(ellipse 92% 32% at 50% 50%,
      rgb(243 239 232 / .80) 0%, rgb(243 239 232 / .54) 52%, rgb(243 239 232 / 0) 82%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ki-mat-band, .ki-mat-hex { transition: none !important; }
}
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
.ki-samband-tel { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(64, 32)}; line-height: 1; color: inherit; text-decoration: none; transition: color .3s ${OUT}; }
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
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(44, 30)};
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
.ki-cta { position: relative; display: inline-block;
  font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; text-transform: uppercase;
  background: none; padding: 10px 1.55em 12px 0; color: inherit;
  text-decoration: none; transition: color .3s ${OUT}, transform .16s ${OUT}; }
/* the rule underlines the LABEL and stops before the arrow */
.ki-cta::after { content: ''; position: absolute; left: 0; right: 1.55em; bottom: 4px; height: 1.5px;
  background: currentColor; transform: scaleX(0); transform-origin: right;
  transition: transform .5s cubic-bezier(.62,.05,.01,.99); }
.ki-cta::before {
  content: ''; position: absolute; right: 0; bottom: .52em;
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
.ki-foot-fine { font-family: ${MONO}; font-size: 12px; color: #9C948A; margin: calc(var(--u) * 40) 0 0; }

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

/* ── the opening ──────────────────────────────────────────────────────────
   There is no curtain any more. The page opens on the stone wall and the
   stone sinks — see ParallaxProps.intro in parallax-scrolling.tsx. */

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

/* WHAT ARRIVES ON THE LIGHT.
   The counterpart of .ki-plx-deep, and deliberately its opposite: the
   descent's copy is quiet because by then the frame has almost no light left
   in it, and this one is the heading of the whole chapter below, said at the
   moment the light actually gets there. Ink on cream, no scrim, nothing
   between the type and the sky. It rides BEHIND the near plane, so a ridge
   that has not sunk past it yet crosses in front of the words. */
.ki-gate-deep {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  width: 100%; max-width: calc(var(--u) * 900);
}
.ki-gate-rule {
  display: block; width: calc(var(--u) * 120); height: 1px;
  background: ${INK}; opacity: .28; margin-bottom: calc(var(--u) * 40);
}
/* the evidence under the claim: three rooms, each named with the two
   materials it is built from — the specimens the descent showed, now in the
   rooms they came out of */
.ki-worlds {
  list-style: none; margin: calc(var(--u) * 54) 0 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34);
}
.ki-worlds li { margin: 0; }
.ki-worlds a { display: grid; gap: 14px; color: inherit; text-decoration: none; }
.ki-worlds-fig { display: block; overflow: hidden; aspect-ratio: 4 / 3; background: rgb(0 0 0 / .06); }
.ki-root .ki-worlds-fig picture, .ki-root .ki-worlds-fig img {
  width: 100%; height: 100%; object-fit: cover; margin: 0;
  transition: transform .8s ${OUT};
}
.ki-worlds a:hover .ki-worlds-fig img { transform: scale(1.045); }
.ki-worlds-meta { display: grid; gap: 5px; text-align: left; }
.ki-worlds-title { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(21, 17)}; color: ${INK}; }
.ki-worlds-pair {
  display: flex; align-items: center; gap: 7px;
  font-family: ${MONO}; font-size: ${fluid(11, 10.5)}; letter-spacing: .14em;
  text-transform: uppercase; color: #6E675D;
}
.ki-worlds-pair i { width: 9px; height: 9px; border-radius: 50%; display: block; flex: 0 0 auto; }
.ki-worlds-pair i + i { margin-left: -3px; }
@media (max-width: 860px) {
  .ki-worlds { grid-template-columns: 1fr 1fr; gap: 18px; }
  .ki-worlds li:last-child { display: none; }
}
.ki-gate-body {
  margin: calc(var(--u) * 30) auto 0;
  max-width: calc(var(--u) * 620);
  font-size: ${fluid(17, 15.5)}; line-height: 1.68; color: #6E675D;
}
.ki-gate-title {
  margin: 0;
  font-family: ${DISPLAY};
  font-weight: 300;
  font-size: ${fluid(84, 32)};
  line-height: 1.13;
  letter-spacing: .002em;
  color: ${INK};
}


/* THE GROUND, CARRIED DOWN THE PAGE.
   The hero descends into #1d1b19 and the page stays in that ground for the
   whole projects journey — but where it finally returned to the light
   palette it did it on a hard horizontal line, which reads as the page
   cutting to a white template rather than as the ground giving way. Both
   light bands sit directly under a dark one, so the change dissolves over a
   band instead of cutting. The dissolve is painted on the BOTTOM of the dark
   section rather than the top of the light one: fading a section into cream
   from its own colour has nothing to mismatch, whereas starting a gradient
   at CHARCOAL under a section that is actually rgb(36,27,25) left a visible
   line. And it is a background-image, not a ::before, because a positioned
   pseudo-element paints ABOVE in-flow text and would grey the copy. */
[data-ki-band='dark']:not(.ki-stmt):has(+ [data-ki-band='light']) {
  background-image: linear-gradient(
    to bottom,
    rgb(239 234 226 / 0) 0,
    rgb(239 234 226 / 0.10) 30%,
    rgb(239 234 226 / 0.38) 58%,
    rgb(239 234 226 / 0.74) 82%,
    ${CREAM} 100%
  );
  background-repeat: no-repeat;
  background-position: bottom;
  /* kept under the 86px of clearance the nearest copy in these sections has
     above their bottom edge — a taller band washes cream up behind
     "Fjölmiðlar"/"Stemning" and collapses their contrast */
  background-size: 100% clamp(52px, 7vh, 80px);
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
`
