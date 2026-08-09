import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS, BOOKING_URL,
  INSTAGRAM, FACEBOOK, NAV, HERO, ARRIVAL, STATEMENT, STATEMENT_BODY, RENOVATED,
  ROOMS, ROOMS_NOTE, MATERIALS, BARN, ISLANDS, SUMMER, TIMELINE, SAGA, CIERRE,
  CREDIT_NOTE, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)
/* expose for the QA/transplant-gate probe (parity with the reference, whose
   globals are visible) */
if (typeof window !== 'undefined') (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger

const company = getPreviewCompany('drangar')

/* ── „Húsin muna" — the buildings remember. ─────────────────────────────────
   Studio Granda kept every trace of what the farm was; the page does the
   same. Engine: normalisboring.es studied line-by-line at source (2026-08-09,
   scratchpad NIB-MASTER-TEARDOWN): pinned horizontal journey measured at
   progress(1), room ACCORDION (15vw→58vw), padding-parallax materials with a
   cursor that becomes content, pin-in-pin barn filmstrip, edge-aware button
   fills, odometer rollovers, per-instance data-driven flip peels, a patina
   value that ages the page's copper as you travel, and a footer where the
   1980s state-blueprint gable morphs into Studio Granda's silhouette. ───── */

/* Palette — WCAG (computed in QA gate, headless):
   INK #131211 on PLASTER #EDEBE6 ...... ~15.9:1 AAA (and inverted on bands)
   COPPER #9C6B4A on PLASTER ........... large/decorative only
   ACCENT #B4372B on PLASTER ........... large text + focus ring
   room fields carry their own ink, per-pair checked. */
const PLASTER = '#EDEBE6'
const INK = '#131211'
const ACCENT = '#B4372B'

const INK_SOFT = 'rgba(19,18,17,.78)'
const INK_MUTE = 'rgba(19,18,17,.66)'
const PLASTER_SOFT = 'rgba(237,235,230,.86)'
const PLASTER_MUTE = 'rgba(237,235,230,.64)'
const HAIR_INK = 'rgba(19,18,17,.16)'
const HAIR_PLASTER = 'rgba(237,235,230,.22)'

const DISPLAY = "'Sentient', 'Times New Roman', serif"
const GROTESK = "'Supreme', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Azeret Mono', 'Courier New', monospace"

const FONTS = `${import.meta.env.BASE_URL}fonts/drangar/`

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4372B]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Patina — copper's aging timeline drives the page's copper elements
   (rules, chips, plate borders, progress bar). Never the ground, never body
   text. One onUpdate, everything derived from raw progress (ledger #26b). ── */
const PATINA_STOPS = [
  { p: 0.0, c: '#A5643E' },  // raw copper
  { p: 0.45, c: '#6E4653' }, // aubergine
  { p: 1.0, c: '#5E7D66' },  // Spanish green
]
function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => {
    const va = (pa >> s) & 255
    const vb = (pb >> s) & 255
    return Math.round(va + (vb - va) * t)
  }
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}
function patinaAt(p: number): string {
  const c = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < PATINA_STOPS.length - 2 && c > PATINA_STOPS[i + 1].p) i += 1
  const a = PATINA_STOPS[i]
  const b = PATINA_STOPS[i + 1]
  return mixHex(a.c, b.c, (c - a.p) / (b.p - a.p))
}

/* Footer morph — the standard 1980s gable profile → Studio Granda's
   renovated silhouette (raised barn roof + bridge to the promontory).
   Identical command structure so the raw `d` attribute interpolates without
   a plugin. ViewBox 0 0 1000 260, both paths M + 10 L + Z. */
const GABLE_OLD =
  'M0,240 L120,240 L210,150 L300,240 L430,240 L520,150 L610,240 L760,240 L850,150 L940,240 L1000,240'
const GABLE_NEW =
  'M0,240 L100,240 L210,96 L320,240 L410,240 L520,60 L680,88 L780,180 L850,180 L940,240 L1000,240'

/* ── Page-local styles. Everything dr- prefixed, keyframes included
   (no-style-bleed rule). ─────────────────────────────────────────────────── */
const PAGE_STYLES = `
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-Extralight.woff2') format('woff2'); font-weight: 200; font-style: normal; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-ExtralightItalic.woff2') format('woff2'); font-weight: 200; font-style: italic; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-Light.woff2') format('woff2'); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${FONTS}Supreme-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${FONTS}Supreme-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Azeret Mono'; src: url('${FONTS}AzeretMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }

.dr-root {
  --dr-patina: ${PATINA_STOPS[0].c};
  --dr-100vh: 100svh;
  background: ${PLASTER};
  color: ${INK};
  font-family: ${GROTESK};
  font-kerning: none;
}
.dr-root ::selection { background: ${INK}; color: ${PLASTER}; }
.dr-root h1, .dr-root h2, .dr-root h3, .dr-root p { margin: 0; font-weight: 400; }
.dr-root img { max-width: 100%; }

/* type helpers */
.dr-display { font-family: ${DISPLAY}; font-weight: 200; }
.dr-it { font-family: ${DISPLAY}; font-weight: 200; font-style: italic; }
.dr-mono { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }
.dr-caps { font-family: ${GROTESK}; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; }

/* split-line hygiene: EVERY SplitText mask carries ascender/descender
   headroom, compensated with negative margins (Icelandic accents + Sentient
   descenders both clear). Applies wherever cascade() creates .dr-line. */
.dr-root .dr-line { overflow: clip; padding-top: .16em; margin-top: -.16em; padding-bottom: .18em; margin-bottom: -.18em; }
.dr-line > span { display: inline-block; }
.dr-wordspace { display: inline-block; width: .3em; }

/* ── media plumbing — two-copy peel + one-var parallax (reference's exact
   mechanism: --clip inset on the up layer, oversized source below). ── */
.dr-flip { position: relative; overflow: clip; display: block; }
.dr-m { position: absolute; inset: 0; }
.dr-m-up { z-index: 2; }
.dr-m img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
/* parallax room: the source is center-oversized so GSAP's yPercent drift
   (ONE writer, merged with the peel's scale) never exposes an edge */
.dr-par .dr-m-src img { height: 116%; top: -8%; }
.dr-spec { position: absolute; left: 0; bottom: 0; z-index: 3; display: flex; gap: 1.1em;
  padding: .55em .9em; background: ${PLASTER_SOFT}; color: ${INK};
  border-top: 1px solid var(--dr-patina); backdrop-filter: blur(4px); }

/* ── buttons: edge-aware fill (reference's --posX/--posY plate). ── */
.dr-btn { position: relative; display: inline-block; cursor: pointer; white-space: nowrap;
  font-family: ${GROTESK}; font-size: 12px; letter-spacing: .18em; text-transform: uppercase;
  padding: calc(.85em - 1.5px) calc(1.9em - 1.5px); border: 1.5px solid currentColor;
  border-radius: calc((.85em - 1.5px) * 3); overflow: hidden; }
.dr-btn { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
.dr-btn:active { transform: scale(.97); }
.dr-btn > span { position: relative; display: block; z-index: 2; overflow: clip; }
.dr-btn::before { content: ''; position: absolute; width: 102%; height: 102%; top: 0; left: 0;
  border-radius: inherit; z-index: 1; background: var(--dr-fill, ${INK});
  transform: translate(var(--dr-px, -102%), var(--dr-py, 0%)); }
.dr-btn[data-armed='0']::before { transform: translate(-102%, 0%); }

/* underline links: two-phase wipe */
.dr-under { position: relative; --dr-w: 100%; --dr-x: 0%; }
.dr-under::after { content: ''; position: absolute; left: var(--dr-x); bottom: -.1em;
  width: var(--dr-w); height: 1px; background: currentColor; }

/* odometer roll links */
.dr-roll { position: relative; display: inline-block; overflow: clip; }
.dr-roll .dr-roll-b { position: absolute; top: 0; left: 0; }
.dr-roll .dr-roll-b span { transform: translateY(110%); }
.dr-roll span { display: inline-block; will-change: transform; }

/* ── cursor ── */
.dr-cursor { position: fixed; top: 0; left: 0; width: .8rem; height: .8rem; z-index: 200;
  pointer-events: none; mix-blend-mode: difference;
  transition: width .33s cubic-bezier(.34,1.56,.64,1), height .33s cubic-bezier(.34,1.56,.64,1); }
.dr-cursor > div { position: relative; width: 100%; height: 100%; transform: translate(-50%,-50%);
  background: ${ACCENT}; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.dr-cursor span { color: #fff; font-family: ${GROTESK}; font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; opacity: 0; white-space: nowrap; transition: opacity .33s cubic-bezier(.34,1.56,.64,1); }
.dr-cursor.is-grown { width: 7.15rem; height: 7.15rem; mix-blend-mode: normal; }
.dr-cursor.is-grown span { opacity: 1; }
.dr-cursor.is-hidden { opacity: 0; }
@media (max-width: 1023px), (pointer: coarse) { .dr-cursor { display: none; } }

/* ── preloader ── */
.dr-loader { position: fixed; inset: 0; z-index: 120; background: ${INK}; color: ${PLASTER};
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2.2rem; }
.dr-loader-word { font-family: ${DISPLAY}; font-weight: 200; font-size: clamp(2.4rem, 7vw, 5rem);
  letter-spacing: .04em; overflow: clip; padding-top: .1em; }
.dr-loader-word span { display: inline-block; }
.dr-loader-bar { position: relative; width: min(46vw, 340px); height: 1px; background: ${HAIR_PLASTER}; }
.dr-loader-bar i { position: absolute; inset: 0; transform-origin: left center; transform: scaleX(0);
  background: var(--dr-patina); }
.dr-loader-pct { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .18em; color: ${PLASTER_MUTE}; }

/* ── header — ONE difference layer, legible over anything (the reference's
   exact mechanism: blend at container level). ── */
.dr-top { position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.65rem; pointer-events: none;
  mix-blend-mode: difference; color: #FFFFFF; }
.dr-top a, .dr-top button { pointer-events: all; }
.dr-top .dr-wordmark { font-family: ${DISPLAY}; font-weight: 200; font-size: 1.35rem; letter-spacing: .1em; color: inherit; text-decoration: none; }
.dr-top-links { display: flex; gap: 1.6rem; align-items: center; }
.dr-top-links a { color: inherit; text-decoration: none; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
@media (max-width: 1023px) { .dr-top-links { display: none; } }

/* burger */
.dr-burger { display: block; position: relative; width: 44px; height: 44px; background: none; border: 0; cursor: pointer; }
.dr-burger i { position: absolute; left: 10px; right: 10px; height: 1.5px; background: currentColor;
  transition: transform .4s cubic-bezier(.32,.72,0,1), top .4s cubic-bezier(.32,.72,0,1); }
.dr-burger i:nth-child(1) { top: 18px; }
.dr-burger i:nth-child(2) { top: 26px; }
.dr-burger[aria-expanded='true'] i:nth-child(1) { top: 22px; transform: rotate(45deg); }
.dr-burger[aria-expanded='true'] i:nth-child(2) { top: 22px; transform: rotate(-45deg); }

/* menu overlay, all viewports (sibling of header — ledger #29) */
.dr-menu { position: fixed; inset: 0; z-index: 55; background: ${INK}; color: ${PLASTER};
  display: flex; flex-direction: column; justify-content: center; padding: 6rem 2rem 3rem; }
.dr-menu-media { display: none; }
@media (min-width: 1024px) {
  .dr-menu { display: grid; grid-template-columns: 38vw 1fr; align-items: center;
    gap: 6vw; padding: 6rem 5vw 3rem; }
  .dr-menu-media { display: block; position: relative; height: 62svh; overflow: clip;
    clip-path: inset(0 0 0 100%); animation: drMenuMedia .75s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .dr-menu-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    transform: translateX(35%); animation: drMenuMediaImg 1.1s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .dr-menu-media figcaption { position: absolute; left: 0; bottom: 0; z-index: 2;
    padding: .55em .9em; background: rgba(19,18,17,.72); color: ${PLASTER};
    font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }
  .dr-menu-link { font-size: clamp(2.2rem, 3.6vw, 3.6rem); }
}
@keyframes drMenuMedia { to { clip-path: inset(0 0 0 0%); } }
@keyframes drMenuMediaImg { to { transform: translateX(0); } }
.dr-menu-num { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em;
  color: var(--dr-patina); margin-right: 1rem; vertical-align: .9em; }
.dr-menu a { color: inherit; text-decoration: none; }
.dr-menu-link { display: block; font-family: ${DISPLAY}; font-weight: 200;
  font-size: clamp(2rem, 8vw, 3.2rem); line-height: 1.22; }
.dr-menu-link em { font-style: italic; }
.dr-menu-item { overflow: clip; padding-top: .12em; margin-top: -.06em; padding-bottom: .14em; margin-bottom: -.06em; }
.dr-menu-item > * { display: block; transform: translateY(115%); animation: drMenuRise .7s cubic-bezier(.16,1,.3,1) forwards; }
.dr-menu-item:nth-child(1) > * { animation-delay: .08s } .dr-menu-item:nth-child(2) > * { animation-delay: .15s }
.dr-menu-item:nth-child(3) > * { animation-delay: .22s } .dr-menu-item:nth-child(4) > * { animation-delay: .29s }
.dr-menu-item:nth-child(5) > * { animation-delay: .36s } .dr-menu-item:nth-child(6) > * { animation-delay: .43s }
@keyframes drMenuRise { to { transform: translateY(0) } }
.dr-menu-foot { margin-top: auto; display: flex; flex-direction: column; gap: .6rem; }

/* progress bar (journey only) */
.dr-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 2px; z-index: 70;
  transform-origin: left center; transform: scaleX(0); background: var(--dr-patina); }

/* ══ THE JOURNEY (desktop) ══ */
.dr-journey { position: relative; overflow: clip; }
.dr-track { display: flex; width: fit-content; }
.dr-panel { position: relative; height: var(--dr-100vh); flex: none; }

/* hero */
.dr-hero { width: 100vw; display: grid; grid-template-rows: 1fr auto; background: ${PLASTER}; }
.dr-hero-word-zone { position: relative; display: flex; align-items: flex-end; justify-content: center; }
.dr-hero-word { position: relative; font-family: ${DISPLAY}; font-weight: 200;
  font-size: min(13.2vw, 34svh); line-height: .82; letter-spacing: .015em; white-space: nowrap; }
.dr-hero-word .dr-hero-mask { overflow: clip; padding-top: .18em; }
.dr-hero-word .dr-hero-mask span { display: inline-block; }
.dr-waterline { position: relative; height: 1px; background: ${INK}; margin: 0 1.65rem; }
.dr-hero-band { position: relative; height: 38svh; margin: 0; }
.dr-hero-band .dr-flip { position: absolute; inset: 0; }
.dr-hero-kicker { position: absolute; top: calc(1.1rem + 54px); left: 1.65rem; color: ${INK_MUTE}; }
.dr-hero-sub { position: absolute; left: 1.65rem; bottom: calc(38svh + 2rem); max-width: 15.5rem;
  font-size: .85rem; line-height: 1.5; color: ${INK_SOFT}; }
.dr-hero-rotmenu { position: absolute; top: calc(1.1rem + 54px); right: .55rem; transform-origin: bottom right;
  transform: rotate(-90deg); display: flex; flex-wrap: nowrap; gap: 1.2rem; color: ${INK_MUTE}; white-space: nowrap; }

/* arrival — one full-height architecture slab (reference image-single) */
.dr-arrival { width: 76vw; background: ${PLASTER}; }
.dr-arrival-big { position: absolute; inset: 0; }
.dr-arrival-big .dr-flip { position: absolute; inset: 0; }
.dr-arrival-big .dr-m img { width: 114%; max-width: none; }
@media (max-width: 1023px) {
  .dr-arrival { width: 100%; }
  .dr-arrival-big { position: relative; inset: auto; }
  .dr-arrival-big .dr-flip { position: relative; aspect-ratio: 1279/900; }
  .dr-arrival-big .dr-m img { width: 100%; }
}

/* renovated (images-text) */
.dr-reno { width: 120vw; background: ${PLASTER}; }
.dr-reno-fig { position: absolute; left: 4vw; top: 50%; transform: translateY(-50%);
  width: 34vw; aspect-ratio: 4/3; }
.dr-reno-fig .dr-flip, .dr-reno-fig-sm .dr-flip { position: absolute; inset: 0; }
.dr-reno-copy { position: absolute; left: 44vw; top: 50%; transform: translateY(-50%); width: 38vw; }
.dr-reno-quote { font-size: min(2.5vw, 5.2svh); line-height: 1.24; }
.dr-reno-fig-sm { position: absolute; right: 4vw; bottom: 10svh; width: 22vw; aspect-ratio: 3/4; }
@media (max-width: 1023px) {
  .dr-reno { width: 100%; padding: 4rem 1.65rem; }
  .dr-reno-fig, .dr-reno-copy, .dr-reno-fig-sm { position: relative; left: auto; right: auto; top: auto; bottom: auto; transform: none; width: 100%; }
  .dr-reno-fig .dr-flip { position: relative; aspect-ratio: 4/3; }
  .dr-reno-copy { margin: 2rem 0; }
  .dr-reno-quote { font-size: 6.4vw; }
  .dr-reno-fig-sm { width: 68%; margin-left: auto; }
  .dr-reno-fig-sm .dr-flip { position: relative; aspect-ratio: 3/4; }
}

/* summer slab */
.dr-summer { width: 100vw; position: relative; }
.dr-summer .dr-flip { position: absolute; inset: 0; }
.dr-summer-chip { position: absolute; right: 1.65rem; bottom: 1.65rem; z-index: 4;
  background: ${PLASTER_SOFT}; color: ${INK}; padding: .7rem 1rem; }
@media (max-width: 1023px) { .dr-summer { height: 62svh; } }

/* hero © */
.dr-hero-copy { position: absolute; left: 1.65rem; bottom: calc(38svh + 1.2rem); color: ${INK_MUTE}; }
@media (max-width: 1023px) { .dr-hero-copy { display: none; } }

/* statement */
.dr-statement { width: 92vw; display: flex; align-items: center; background: ${INK}; color: ${PLASTER};
  box-shadow: 0 0 0 1px ${INK}; }
.dr-statement-in { padding: 0 7vw; width: 100%; }
.dr-statement .dr-sline { font-family: ${DISPLAY}; font-weight: 200; font-size: min(4.1vw, 8.4svh);
  line-height: 1.08; white-space: nowrap; }
.dr-statement .dr-sline em { font-style: italic; }
.dr-statement .dr-cont { position: relative; display: inline-block; }
.dr-statement-body { max-width: 30rem; margin-top: 2.6rem; color: ${PLASTER_MUTE};
  font-size: .85rem; line-height: 1.6; }
.dr-statement-body .dr-char { opacity: 1; }

/* accordion — FIXED total width (the reference's sizeProjects): items open
   INSIDE a constant footprint, so nothing downstream ever shifts and every
   later trigger window stays true. The trailing space is consumed ahead of
   the traveler as items open. */
.dr-acc { display: flex; width: 232vw; height: var(--dr-100vh); }
.dr-acc-item { position: relative; width: 58vw; height: 100%; overflow: clip; display: flex; flex-direction: column; }
.dr-acc-media { position: relative; height: 60svh; flex: none; overflow: clip; }
.dr-acc-media .dr-flip { position: absolute; inset: 0; }
.dr-acc-body { position: relative; flex: 1; display: flex; align-items: center; padding: 0 3.2vw; overflow: clip; }
.dr-acc-detail { display: none; }
@media (min-width: 1024px) {
  /* content laid out at OPEN width; the closed panel just clips it (reference) */
  .dr-acc-textwrap { width: 30vw; min-width: 30vw; }
  .dr-acc-detail { display: block; order: 2; width: 13vw; min-width: 13vw; aspect-ratio: 3/4;
    margin-left: 3vw; align-self: center; overflow: clip; max-height: 34svh; }
  .dr-acc-detail img { width: 100%; height: 100%; object-fit: cover;
    transition: transform .7s cubic-bezier(.16,1,.3,1); }
  .dr-acc-item:hover .dr-acc-detail img { transform: scale(1.045); }
}
.dr-acc-num { position: absolute; top: 1.2rem; left: 1.4rem; z-index: 3; font-family: ${MONO};
  font-size: 10.5px; letter-spacing: .18em; color: #fff; mix-blend-mode: difference; }
.dr-acc-name { font-family: ${DISPLAY}; font-weight: 200; font-size: min(3.4vw, 3.4rem); line-height: 1; }
.dr-acc-livery { margin-top: .7rem; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; opacity: .82; }
.dr-acc-line { margin-top: 1rem; max-width: 21rem; font-size: .85rem; line-height: 1.55; opacity: .92; }
.dr-acc-cta { margin-top: 1.5rem; }
.dr-acc-textwrap > * { overflow: clip; }
.dr-acc-textwrap .dr-pop { display: block; }

/* shed note */
.dr-shednote { width: 44vw; background: ${PLASTER}; display: flex; align-items: center; }
.dr-shednote-in { padding: 0 6vw; }
.dr-shednote-body { font-size: .95rem; line-height: 1.65; color: ${INK_SOFT}; max-width: 24rem; }
@media (max-width: 1023px) { .dr-shednote { width: 100%; } .dr-shednote-in { padding: 3.5rem 1.65rem; } }

/* materials — width just past one viewport plus the drift runway; a wider
   panel leaves a dead plaster stretch before the barn's ink edge */
.dr-mat { width: 112vw; background: ${PLASTER}; display: flex; flex-direction: column;
  justify-content: space-between; padding: 5.5rem 1.65rem 2.2rem; }
.dr-mat-rail { position: absolute; top: 50%; left: 1.1rem; transform: rotate(-90deg) translateY(-50%);
  transform-origin: center left; color: ${INK_MUTE}; }
.dr-mat-term { position: relative; display: flex; align-items: center; width: 100%;
  border-top: 1px solid ${HAIR_INK}; padding-top: 1.6svh; padding-bottom: 1.6svh; }
.dr-mat-term:last-of-type { border-bottom: 1px solid ${HAIR_INK}; }
.dr-mat-idx { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em;
  color: var(--dr-patina); margin-right: 2vw; min-width: 2.4rem; }
@media (min-width: 1024px) and (hover: hover) {
  .dr-mat-term { cursor: none; }
  .dr-mat-term .dr-mat-title { transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .dr-mat-term:hover .dr-mat-title { transform: translateX(.6vw); }
}
.dr-mat-title { position: relative; z-index: 20; font-family: ${DISPLAY}; font-weight: 200;
  font-size: min(7.2vw, 15svh); line-height: .95; mix-blend-mode: difference; }
.dr-mat-title > span { display: inline-block; filter: invert(100%); color: #000000; }
.dr-mat-text { position: relative; width: 17rem; min-width: 17rem; margin-left: 4vw; }
.dr-mat-text-single { font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; }
.dr-mat-stack { position: absolute; width: 24vw; aspect-ratio: 4/3; pointer-events: none;
  transform: translate(-50%, -50%) scale(0); z-index: 10; overflow: clip; }
.dr-mat-stack img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0; --dr-clip: 0% 0% 0% 0%; clip-path: inset(var(--dr-clip)); }
.dr-mat-stack img.is-on { opacity: 1; z-index: 2; }
.dr-mat-stack img.is-prev { opacity: 1; z-index: 1; }

/* barn pin-in-pin — the stage counter-slides against the journey so it holds
   the viewport while the vertical film plays (the reference's last-item). */
.dr-barn { width: 220vw; background: ${INK}; color: ${PLASTER}; overflow: clip;
  box-shadow: 0 0 0 1px ${INK}; }
.dr-barn-stage { position: absolute; top: 0; left: 0; width: 100vw; height: 100%; will-change: transform; }
.dr-barn-content { position: absolute; top: 0; left: 0; width: 46vw; height: 100%;
  display: flex; flex-direction: column; justify-content: center; padding: 0 0 0 6vw; }
.dr-barn-title { font-family: ${DISPLAY}; font-weight: 200; font-size: min(4.8vw, 10svh); line-height: 1; }
.dr-barn-title em { font-style: italic; }
.dr-barn-body { margin-top: 1.6rem; max-width: 24rem; color: ${PLASTER_MUTE}; font-size: .85rem; line-height: 1.6; }
.dr-barn-strip { position: absolute; top: 0; left: 54vw; width: 40vw; will-change: transform; }
.dr-barn-cell { position: relative; height: 44svh; margin-bottom: 2svh; overflow: clip; }
.dr-barn-cell img { width: 100%; height: 100%; object-fit: cover; }
.dr-barn-cell figcaption { position: absolute; left: 0; bottom: 0; z-index: 2;
  padding: .5em .85em; background: rgba(19,18,17,.72); color: ${PLASTER};
  font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }

/* islands full-bleed */
.dr-isl { width: 100vw; position: relative; }
.dr-isl .dr-flip { position: absolute; inset: 0; }
.dr-isl-chip { position: absolute; left: 1.65rem; bottom: 1.65rem; z-index: 4; background: ${INK};
  color: ${PLASTER}; padding: 1rem 1.2rem; max-width: 22rem; overflow: clip; }
.dr-isl-line { font-family: ${DISPLAY}; font-weight: 200; font-size: 1.5rem; line-height: 1.25; }
.dr-isl-line .dr-travel { position: relative; display: inline-block; font-style: italic; color: var(--dr-patina); }

/* sagan */
.dr-saga { width: 118vw; background: ${PLASTER}; display: flex; align-items: center; gap: 4vw; padding: 0 5vw; }
.dr-saga-fig { position: relative; width: 46vw; height: 64svh; flex: none; overflow: clip; }
.dr-saga-fig .dr-m-src img { height: 118%; }
.dr-saga-copy { max-width: 30rem; }
.dr-saga-title { font-family: ${DISPLAY}; font-weight: 200; font-size: min(4.4vw, 9svh); line-height: 1.02; }
.dr-saga-credit { margin-top: .9rem; color: ${INK_MUTE}; font-size: .8rem; }
.dr-saga-rows { margin-top: 2.2rem; }
.dr-saga-row { display: grid; grid-template-columns: 8.5rem 1fr; gap: 1.4rem; padding: .78em 0;
  border-top: 1px solid ${HAIR_INK}; font-size: .85rem; line-height: 1.5; }
.dr-saga-row dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; color: var(--dr-patina); padding-top: .25em; }
.dr-saga-award { margin-top: 1.6rem; font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; max-width: 26rem; }

/* cierre */
.dr-cierre { width: 120vw; background: ${ACCENT}; color: ${PLASTER}; overflow: clip; }
.dr-cierre-in { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 6vw; width: 88vw; }
.dr-cierre-word { font-family: ${DISPLAY}; font-weight: 200; font-size: min(11vw, 24svh); line-height: .92; white-space: nowrap; }
.dr-cierre-sub { margin-top: 2rem; font-size: .9rem; color: rgba(237,235,230,.85); }
.dr-cierre-ctas { margin-top: 2rem; display: flex; gap: 1.2rem; align-items: center; }
.dr-cierre-strip { position: absolute; top: 8svh; right: -4vw; width: 34vw; height: 30svh; overflow: clip; opacity: .92; }
.dr-cierre-strip img { width: 130%; height: 100%; object-fit: cover; }

/* ══ FOOTER (vertical, after the journey) ══ */
.dr-footer { position: relative; background: ${INK}; color: ${PLASTER}; padding: 7rem 1.65rem 2rem; overflow: clip; }
.dr-footer-gable { position: absolute; inset: auto 0 0 0; height: min(38vw, 420px); width: 100%; opacity: .5; pointer-events: none; }
.dr-footer-gable path { fill: none; stroke: var(--dr-patina); stroke-width: 1.5; }
.dr-footer-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 3rem; max-width: 1200px; }
.dr-footer h2 { font-family: ${DISPLAY}; font-weight: 200; font-size: clamp(2.2rem, 4.6vw, 4rem); line-height: 1; }
.dr-footer dl { margin: 0; }
.dr-footer dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: ${PLASTER_MUTE}; margin-top: 1.2rem; }
.dr-footer dd { margin: .3rem 0 0; font-size: .95rem; }
.dr-footer a { color: inherit; text-decoration: none; }
.dr-footer-corners { position: relative; z-index: 2; display: flex; justify-content: space-between;
  margin-top: 5rem; padding-top: 1.2rem; border-top: 1px solid ${HAIR_PLASTER};
  color: ${PLASTER_MUTE}; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; }
.dr-footer-credit { position: relative; z-index: 2; margin-top: 1rem; color: rgba(237,235,230,.4); font-size: 11px; line-height: 1.6; max-width: 46rem; }

/* ══ MOBILE / VERTICAL document ══ */
@media (max-width: 1023px) {
  .dr-track { display: block; width: 100%; }
  .dr-panel { height: auto; width: 100% !important; }
  .dr-acc { width: 100%; }
  .dr-hero { min-height: 100svh; }
  .dr-hero-word { font-size: min(13.4vw, 17svh); }
  .dr-hero-sub { position: static; margin: 1.2rem 1.65rem 2rem auto; }
  .dr-hero-rotmenu { display: none; }
  .dr-statement { padding: 5rem 0; }
  .dr-statement .dr-sline { font-size: 7vw; white-space: normal; }
  .dr-statement-in { padding: 0 1.65rem; }
  .dr-acc { display: block; height: auto; }
  .dr-acc-item { width: 100%; }
  .dr-acc-media { height: 52svh; }
  .dr-acc-body { padding: 1.8rem 1.65rem 2.6rem; }
  .dr-acc-name { font-size: 2rem; }
  .dr-mat { width: 100%; padding: 4.5rem 1.65rem; }
  .dr-mat-rail { display: none; }
  .dr-mat-term { flex-direction: column; align-items: flex-start; gap: .9rem; margin-bottom: 2.6rem; }
  .dr-mat-title { font-size: 11vw; mix-blend-mode: normal; }
  .dr-mat-title > span { filter: none; color: ${INK}; }
  .dr-mat-text { width: 100%; min-width: 0; margin-left: 0; }
  .dr-mat-fig-m { width: 100%; aspect-ratio: 4/3; overflow: clip; }
  .dr-mat-fig-m img { width: 100%; height: 100%; object-fit: cover; }
  .dr-barn { width: 100%; }
  .dr-barn-stage { position: static; width: 100%; height: auto; }
  .dr-barn-content { position: static; width: 100%; padding: 4.5rem 1.65rem 1rem; }
  .dr-barn-strip { position: static; width: 100%; padding: 0 1.65rem 3rem; }
  .dr-barn-cell { height: 46svh; margin-bottom: 1rem; }
  .dr-isl { height: 72svh; }
  .dr-saga { display: block; padding: 4.5rem 1.65rem; }
  .dr-saga-fig { width: 100%; height: 46svh; margin-bottom: 2.2rem; }
  .dr-cierre { padding: 5rem 0; }
  .dr-cierre-in { position: static; width: 100%; padding: 0 1.65rem; }
  .dr-cierre-word { font-size: 15vw; white-space: normal; }
  .dr-cierre-strip { display: none; }
  .dr-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}

/* desktop-only bits */
@media (min-width: 1024px) {
  .dr-mat-fig-m { display: none; }
  .dr-track { will-change: transform; backface-visibility: hidden; }
}

/* touch targets: 44px legal minimum without changing the visual weight */
@media (max-width: 1023px), (pointer: coarse) {
  .dr-btn { padding: calc(1.15em - 1px) calc(2.1em - 1px); }
  .dr-top .dr-wordmark { padding: .55rem .6rem; margin: -.55rem -.6rem; }
  .dr-footer dd a, .dr-menu-foot a {
    display: inline-block; padding: .62rem 0; margin: -.42rem 0; }
  .dr-cierre-ctas .dr-under { display: inline-block; padding: .85rem 0; margin: -.55rem 0; }
}

/* reduced motion: resting CSS is the finished page */
@media (prefers-reduced-motion: reduce) {
  .dr-cursor, .dr-progress { display: none !important; }
  .dr-menu-item > * { animation: none; transform: none; }
  .dr-roll .dr-roll-b { display: none; }
}
`

/* module-scoped journey handle for anchor nav */
let journeyNav: { master: ScrollTrigger; track: HTMLElement; lenis: Lenis } | null = null
let pageLenis: Lenis | null = null

function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pageLenis?.stop()
    return () => {
      document.body.style.overflow = prev
      pageLenis?.start()
    }
  }, [locked])
}

/* ── flip media figure ── */
function Media(props: {
  src: string
  alt: string
  dir?: 'up' | 'left' | 'right'
  spec?: string[]
  cursor?: string
  eager?: boolean
  scrub?: boolean
  className?: string
}) {
  const { src, alt, dir = 'up', spec, cursor, eager, scrub, className } = props
  return (
    <figure
      className={`dr-flip dr-par ${className ?? ''}`}
      data-dr-dir={dir}
      data-dr-scrub={scrub ? '1' : '0'}
      data-cursor={cursor}
      style={{ margin: 0 }}
    >
      <div className="dr-m dr-m-src" aria-hidden="true">
        <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <div className="dr-m dr-m-up">
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {spec && (
        <figcaption className="dr-spec dr-mono">
          {spec.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export default function DrangarPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaderDone, setLoaderDone] = useState(
    () => prefersReduced() || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dr_seen') === '1'),
  )
  useBodyLock(menuOpen)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    setThemeColor(PLASTER)
    document.title = 'Drangar Country Guesthouse | Skógarströnd'
  }, [])

  /* ── preloader (arm-once: StrictMode re-runs must not restart tweens) ── */
  const loaderArmed = useRef(false)
  useEffect(() => {
    if (loaderDone || loaderArmed.current) return
    const root = rootRef.current
    if (!root) return
    const word = root.querySelector('.dr-loader-word')
    const bar = root.querySelector<HTMLElement>('.dr-loader-bar i')
    const pct = root.querySelector<HTMLElement>('.dr-loader-pct')
    if (!word || !bar || !pct) return
    loaderArmed.current = true
    const chars = Array.from(word.querySelectorAll('span'))
    gsap.fromTo(chars, { xPercent: 120 }, {
      xPercent: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out', delay: 0.25,
    })
    /* bounded fake counter: never outruns real image progress (reference) */
    const imgs = Array.from(document.images)
    let loaded = 0
    const bump = () => { loaded += 1 }
    imgs.forEach((im) => {
      const t = new Image()
      t.onload = bump
      t.onerror = bump
      t.src = im.src
    })
    let fake = 0
    const iv = window.setInterval(() => {
      const real = imgs.length ? Math.floor((loaded / imgs.length) * 100) : 100
      /* crawl toward 90 while assets land; the last 10% belongs to reality */
      const ceiling = real === 100 ? 100 : Math.max(real, Math.min(fake + 3, 90))
      fake = Math.min(fake + 3, ceiling)
      bar.style.transform = `scaleX(${fake / 100})`
      pct.textContent = `${fake}%`
      if (fake >= 100) {
        window.clearInterval(iv)
        sessionStorage.setItem('dr_seen', '1')
        gsap.to([bar.parentElement, pct], { opacity: 0, duration: 0.4, ease: 'none' })
        gsap.to(root.querySelector('.dr-loader'), {
          yPercent: -100, duration: 0.9, ease: 'power3.inOut', delay: 0.4,
          onComplete: () => setLoaderDone(true),
        })
      }
    }, 16)
    /* no cleanup: StrictMode's simulated unmount must not kill the one real
       run; the interval clears itself at 100. */
  }, [loaderDone])

  /* ── the engine ── */
  useEffect(() => {
    if (!loaderDone) return
    const root = rootRef.current
    if (!root) return
    if (prefersReduced()) return // resting CSS is the finished page

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const cleanupFns: Array<() => void> = []
    const ctx = gsap.context(() => {
      const TS = 1.15 // global speed dial (reference)

      /* ── shared: split helpers ── */
      const cascade = (el: Element, tl: gsap.core.Timeline, pos: string | number = '<+=.05') => {
        SplitText.create(el, { type: 'lines,chars', linesClass: 'dr-line', charsClass: 'dr-char' })
        el.querySelectorAll('.dr-line').forEach((line, i) => {
          const from = i % 2 !== 0 ? -110 : 110
          tl.from(line.querySelectorAll('.dr-char'), {
            yPercent: from, duration: 0.65, stagger: 0.03, ease: 'power3.out',
          }, i === 0 ? pos : '<+=.05')
        })
      }

      /* odometer roll links (nav + footer) */
      root.querySelectorAll<HTMLElement>('.dr-rollify').forEach((el) => {
        const inner = el.innerHTML
        el.classList.add('dr-roll')
        el.innerHTML = `<span class="dr-roll-a">${inner}</span><span class="dr-roll-b" aria-hidden="true">${inner}</span>`
        const a = el.querySelector('.dr-roll-a') as HTMLElement
        const b = el.querySelector('.dr-roll-b') as HTMLElement
        const sa = SplitText.create(a, { type: 'chars' }).chars
        const sb = SplitText.create(b, { type: 'chars' }).chars
        gsap.set(sb, { yPercent: 110 })
        el.addEventListener('mouseenter', () => {
          gsap.killTweensOf([...sa, ...sb])
          gsap.to(sb, { yPercent: 0, duration: 0.5, ease: 'power2.inOut', stagger: 0.025 })
          gsap.to(sa, { yPercent: -110, duration: 0.5, delay: 0.025, ease: 'power2.inOut', stagger: 0.025 })
        })
        el.addEventListener('mouseleave', () => {
          gsap.killTweensOf([...sa, ...sb])
          gsap.to(sa, { yPercent: 0, duration: 0.5, ease: 'power2.inOut', stagger: 0.025 })
          gsap.to(sb, { yPercent: 110, duration: 0.5, delay: 0.025, ease: 'power2.inOut', stagger: 0.025 })
        })
      })

      /* edge-aware pill fills */
      if (fine) {
        root.querySelectorAll<HTMLElement>('.dr-btn').forEach((btn) => {
          const span = btn.querySelector(':scope > span') as HTMLElement
          const edge = (ev: MouseEvent) => {
            const r = btn.getBoundingClientRect()
            const d = [ev.clientX - r.left, r.right - ev.clientX, ev.clientY - r.top, r.bottom - ev.clientY]
            const m = Math.min(...d)
            if (m === d[0]) return { px: ['-102%', '102%'], py: ['0%', '0%'], sx: ['200%', '-200%'], sy: ['0%', '0%'] }
            if (m === d[1]) return { px: ['102%', '-102%'], py: ['0%', '0%'], sx: ['-200%', '200%'], sy: ['0%', '0%'] }
            if (m === d[2]) return { px: ['0%', '0%'], py: ['-102%', '102%'], sx: ['0%', '0%'], sy: ['200%', '-200%'] }
            return { px: ['0%', '0%'], py: ['102%', '-102%'], sx: ['0%', '0%'], sy: ['-200%', '200%'] }
          }
          btn.addEventListener('mouseenter', (ev) => {
            const e = edge(ev as MouseEvent)
            gsap.killTweensOf([btn, span])
            gsap.fromTo(span, { x: 0, y: 0 }, {
              x: e.sx[0], y: e.sy[0], duration: 0.33, ease: 'power3.in',
              onComplete: () => {
                btn.classList.add('is-filled')
                /* the label re-enters over the swept fill: swap its ink
                   (reference recolors at the throw midpoint) */
                if (btn.dataset.fillInk) gsap.set(span, { color: btn.dataset.fillInk })
              },
            })
            gsap.fromTo(btn, { '--dr-px': e.px[0], '--dr-py': e.py[0] }, { '--dr-px': '0%', '--dr-py': '0%', duration: 0.25, delay: 0.1, ease: 'power3.in' })
            gsap.fromTo(span, { x: e.sx[1], y: e.sy[1] }, { x: 0, y: 0, duration: 0.33, delay: 0.25, ease: 'power3.out' })
          })
          btn.addEventListener('mouseleave', (ev) => {
            const e = edge(ev as MouseEvent)
            gsap.killTweensOf([btn, span])
            gsap.fromTo(span, { x: 0, y: 0 }, {
              x: e.sx[1], y: e.sy[1], duration: 0.33, ease: 'power3.in',
              onComplete: () => {
                btn.classList.remove('is-filled')
                gsap.set(span, { color: '' })
              },
            })
            gsap.fromTo(btn, { '--dr-px': '0%', '--dr-py': '0%' }, { '--dr-px': e.px[1], '--dr-py': e.py[1], duration: 0.25, delay: 0.1, ease: 'power3.in' })
            gsap.fromTo(span, { x: e.sx[0], y: e.sy[0] }, { x: 0, y: 0, duration: 0.33, delay: 0.25, ease: 'power3.out' })
          })
        })
      }

      /* ── flip peels + parallax. ONE writer per image: GSAP owns clip-path
         on the up layer and scale+yPercent on the source img (it merges its
         own transform channels; a CSS calc() transform would fight the
         inline one and jitter). Accordion media peel one-shot only — its
         panel geometry animates, so scrubbed starts there go stale. ── */
      const armFlips = (container: (t: Element) => ScrollTrigger.Vars) => {
        root.querySelectorAll<HTMLElement>('.dr-flip').forEach((fig) => {
          const up = fig.querySelector('.dr-m-up') as HTMLElement
          const src = fig.querySelector('.dr-m-src img') as HTMLElement
          const inAccordion = !!fig.closest('.dr-acc-media')
          const dir = fig.dataset.drDir ?? 'up'
          const scrub = fig.dataset.drScrub === '1' && !inAccordion
          const dur = parseFloat(fig.dataset.drDur ?? '1.5')
          const clipFrom = dir === 'up' ? 'inset(100% 0% 0% 0%)' : dir === 'right' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(up, { clipPath: clipFrom }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'power2.out', immediateRender: true }, 0)
          tl.from(src, { scale: 1.2, duration: dur + 0.5, ease: 'power2.out' }, 0)
          ScrollTrigger.create({
            ...container(fig),
            animation: tl,
            ...(scrub ? { scrub: 0.35, end: '+=75%' } : { toggleActions: 'play none none reverse' }),
          })
          if (!inAccordion && fig.classList.contains('dr-par')) {
            const par = gsap.timeline({ paused: true })
            par.fromTo(src, { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0)
            ScrollTrigger.create({ ...container(fig), animation: par, scrub: 0.5, end: '+=120%' })
          }
        })
      }

      if (isDesktop) {
        /* ══ THE HORIZONTAL JOURNEY ══ */
        const lenis = new Lenis()
        pageLenis = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector<HTMLElement>('.dr-journey')!
        const track = root.querySelector<HTMLElement>('.dr-track')!
        gsap.set(root.querySelector('.dr-progress'), { scaleX: 0 })

        /* accordion timeline FIRST (widths change the track length) */
        const accItems = Array.from(root.querySelectorAll<HTMLElement>('.dr-acc-item'))
        const projectsTl = gsap.timeline({ paused: true })
        const accTextTls: gsap.core.Timeline[] = []
        accItems.forEach((item, i) => {
          const media = item.querySelector('.dr-acc-media') as HTMLElement
          const textwrap = item.querySelector('.dr-acc-textwrap') as HTMLElement
          const pops = Array.from(textwrap.querySelectorAll<HTMLElement>('.dr-pop'))
          const nameChars = SplitText.create(item.querySelector('.dr-acc-name'), { type: 'chars' }).chars
          const tTl = gsap.timeline({ paused: true, delay: 0.1 })
          tTl.fromTo(pops[0], { yPercent: 100 }, { yPercent: 0, duration: 0.33, ease: 'power2.out' }, 0)
          if (pops[1]) tTl.fromTo(pops[1], { yPercent: 100 }, { yPercent: 0, duration: 0.33, ease: 'power2.out' }, 0.2)
          if (pops[2]) tTl.fromTo(pops[2], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.33, ease: 'power2.out' }, 0.4)
          tTl.fromTo(nameChars, { yPercent: 100 }, { yPercent: 0, duration: 0.25, ease: 'power2.out', stagger: 0.05 }, 0.5)
          accTextTls.push(tTl)
          const time = i * 1
          projectsTl.fromTo(item, { width: '15vw' }, { width: '58vw', duration: 1, ease: 'power1.inOut' }, time)
          projectsTl.fromTo(media, { height: '82svh' }, { height: '60svh', duration: 1, ease: 'power1.inOut' }, time)
        })
        /* text pops fire ONCE per crossing with hysteresis; a scrubbed .005s
           step re-fires on every jitter frame and reads as a glitch. */
        const accFired = accItems.map(() => false)
        const watchAccText = (self: ScrollTrigger) => {
          const t = self.progress * projectsTl.duration()
          accItems.forEach((_, i) => {
            const at = i * 1 + 0.55
            if (t >= at && !accFired[i]) {
              accFired[i] = true
              accTextTls[i].pause()
              accTextTls[i].timeScale(1).play()
            } else if (t < at - 0.12 && accFired[i]) {
              accFired[i] = false
              accTextTls[i].pause()
              accTextTls[i].timeScale(2.5)
              accTextTls[i].reverse()
            }
          })
        }

        /* the accordion's container width is FIXED, so the track measures the
           same at any progress; function-based for same-branch resizes. */
        const measureMaxX = () => track.scrollWidth - window.innerWidth
        const journeyTween = gsap.to(track, { x: () => -measureMaxX(), duration: 100, ease: 'none' })
        const master = ScrollTrigger.create({
          animation: journeyTween,
          trigger: journeyEl,
          pin: journeyEl,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          start: 'top top',
          end: () => `+=${measureMaxX()}`,
          onUpdate: (self) => {
            const patina = patinaAt(self.progress)
            root.style.setProperty('--dr-patina', patina)
            const bar = root.querySelector<HTMLElement>('.dr-progress')
            if (bar) bar.style.transform = `scaleX(${self.progress})`
          },
        })
        journeyNav = { master, track, lenis }

        const onJourney = (t: Element, start: string): ScrollTrigger.Vars => ({
          trigger: t, containerAnimation: journeyTween, start,
        })

        /* accordion driver */
        ScrollTrigger.create({
          ...onJourney(accItems[0], '0% 80%'),
          animation: projectsTl,
          end: `+=${58 * accItems.length}%`,
          scrub: 0,
          onUpdate: watchAccText,
        })

        /* hero intro ceremony */
        const intro = gsap.timeline({ paused: true })
        const heroMasks = Array.from(root.querySelectorAll('.dr-hero-mask span'))
        intro.from(heroMasks, { yPercent: 120, duration: 1.1, stagger: { each: 0.06, from: 'center' }, ease: 'power3.out' }, 0.15)
        intro.from(root.querySelector('.dr-waterline'), { scaleX: 0, transformOrigin: 'center', duration: 1.1, ease: 'power2.inOut' }, 0.1)
        const kick = root.querySelector('.dr-hero-kicker')
        if (kick) cascade(kick, intro, 0.55)
        intro.from(root.querySelector('.dr-hero-sub'), { y: 22, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
        intro.from(root.querySelectorAll('.dr-hero-rotmenu a'), { y: '2.5rem', opacity: 0, duration: 1, stagger: -0.15, ease: 'power3.out' }, 0.9)
        intro.from(root.querySelector('.dr-hero-copy'), { opacity: 0, duration: 0.5, ease: 'none' }, 1.1)
        /* intro hands off to scrub: the arrival image slides during the intro,
           then a scrubbed trigger takes the same value home (reference). */
        const arrivalImg = root.querySelector<HTMLElement>('.dr-arrival-big .dr-m-src img')
        if (arrivalImg) {
          gsap.set(arrivalImg, { x: '-4vw' })
          intro.call(() => {
            gsap.to(arrivalImg, {
              x: '-10vw', duration: 1.25, ease: 'power2.out',
              onComplete: () => {
                const handTl = gsap.timeline({ paused: true })
                handTl.fromTo(arrivalImg, { x: '-10vw' }, { x: '0vw', ease: 'none' })
                ScrollTrigger.create({
                  ...onJourney(root.querySelector('.dr-arrival')!, '0% 78%'),
                  animation: handTl, end: '90% 100%', scrub: 0.5,
                })
              },
            })
          }, [], 1.2)
        }
        intro.timeScale(TS).play()

        /* statement: line 4 slides into justification + scrubbed reading */
        const contEl = root.querySelector<HTMLElement>('.dr-statement .dr-cont')
        if (contEl) {
          const off = contEl.scrollWidth - (contEl.parentElement as HTMLElement).clientWidth
          const stTl = gsap.timeline({ paused: true })
          stTl.from(contEl, { x: off > 0 ? off : 120, duration: 2, ease: 'power1.inOut' }, 0)
          ScrollTrigger.create({
            ...onJourney(root.querySelector('.dr-statement')!, '0% 50%'),
            animation: stTl, end: '100% 50%', scrub: 0,
          })
        }
        const stBody = root.querySelector('.dr-statement-body p')
        if (stBody) {
          const split = SplitText.create(stBody, { type: 'lines,chars', charsClass: 'dr-char' })
          const opTl = gsap.timeline({ paused: true })
          opTl.fromTo(split.chars, { opacity: 0.25 }, { opacity: 1, duration: 0.5, stagger: 0.005, ease: 'none' })
          ScrollTrigger.create({
            ...onJourney(root.querySelector('.dr-statement')!, '0% 70%'),
            animation: opTl, end: '70% 30%', scrub: 0.5,
          })
        }
        root.querySelectorAll('.dr-statement .dr-sline').forEach((line, i) => {
          const tl = gsap.timeline({ paused: true })
          cascade(line, tl, 0)
          ScrollTrigger.create({
            ...onJourney(root.querySelector('.dr-statement')!, `${i * 4}% 75%`),
            animation: tl, toggleActions: 'play none none reverse',
          })
        })

        /* renovated quote: reading-highlight lines (reference images-text) */
        const renoQuote = root.querySelector('.dr-reno-quote')
        if (renoQuote) {
          const split = SplitText.create(renoQuote, { type: 'lines' })
          const rTl = gsap.timeline({ paused: true })
          rTl.from(split.lines, { opacity: 0.2, duration: 0.2, stagger: 0.1, ease: 'none' })
          ScrollTrigger.create({
            ...onJourney(root.querySelector('.dr-reno')!, '0% 75%'),
            animation: rTl, end: '0% 25%', scrub: 0,
          })
        }

        /* materials: padding parallax + hover machinery */
        const mat = root.querySelector<HTMLElement>('.dr-mat')
        if (mat) {
          gsap.set(mat, { width: mat.offsetWidth })
          const terms = Array.from(mat.querySelectorAll<HTMLElement>('.dr-mat-term'))
          const pTl = gsap.timeline({ paused: true })
          pTl.to(terms[0], { paddingLeft: '8vw', ease: 'none' }, 0)
          pTl.to(terms[1], { paddingRight: '3vw', ease: 'none' }, 0)
          pTl.to(terms[2], { paddingLeft: '11vw', ease: 'none' }, 0)
          if (terms[3]) pTl.to(terms[3], { paddingLeft: '5vw', ease: 'none' }, 0)
          ScrollTrigger.create({ ...onJourney(mat, '0% 100%'), animation: pTl, end: '100% 0%', scrub: 1 })

          const stack = mat.querySelector<HTMLElement>('.dr-mat-stack')!
          const stackImgs = Array.from(stack.querySelectorAll('img'))
          let cur = 0
          terms.forEach((term, i) => {
            term.addEventListener('mouseenter', () => {
              if (cur === i) return
              stackImgs.forEach((im) => im.classList.remove('is-prev'))
              stackImgs[cur].classList.add('is-prev')
              stackImgs[cur].classList.remove('is-on')
              stackImgs[i].classList.add('is-on')
              gsap.fromTo(stackImgs[i], { '--dr-clip': '100% 0% 0% 0%' }, { '--dr-clip': '0% 0% 0% 0%', duration: 1.25, ease: 'power3.out' })
              gsap.fromTo(stackImgs[i], { scale: 2 }, { scale: 1, duration: 2, delay: -0.75, ease: 'power2.out' })
              cur = i
            })
          })

          /* cursor becomes content over the materials */
          if (fine && cursorRef.current) {
            mat.addEventListener('mouseenter', () => {
              cursorSwap(stack)
            })
            mat.addEventListener('mouseleave', () => {
              cursorSwap(null)
            })
          }
        }

        /* barn pin-in-pin filmstrip: the stage rides the journey (the
           reference's lastProject x-travel) while a vertical film drifts
           inside it. Deterministic geometry: fixed cells, strip taller than
           the viewport for the WHOLE travel, one linear phase — photos are
           on screen from the first frame of the panel to the last. */
        const barn = root.querySelector<HTMLElement>('.dr-barn')
        if (barn) {
          const stage = barn.querySelector<HTMLElement>('.dr-barn-stage')!
          const strip = barn.querySelector<HTMLElement>('.dr-barn-strip')!
          const cells = barn.querySelectorAll<HTMLElement>('.dr-barn-cell').length
          const stripH = cells * 46 - 2            // svh: 44svh cells + 2svh gaps
          const yFrom = 10                          // first two photos visible at entry
          const yTo = -(stripH - 100)               // last photo lands flush at the end
          const travel = 120                        // barn 220vw − 100vw stage
          const bTl = gsap.timeline({ paused: true })
          bTl.fromTo(stage, { x: '0vw' }, { x: `${travel}vw`, duration: 1, ease: 'none' }, 0)
          bTl.fromTo(strip, { y: `${yFrom}svh` }, { y: `${yTo}svh`, duration: 1, ease: 'none' }, 0)
          ScrollTrigger.create({
            ...onJourney(barn, 'left 0%'), animation: bTl, end: `left -${travel}%`, scrub: 0,
          })
          const bTitle = barn.querySelector('.dr-barn-title')
          if (bTitle) {
            const tl = gsap.timeline({ paused: true })
            cascade(bTitle, tl, 0)
            tl.from(barn.querySelector('.dr-barn-body'), { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<+=.3')
            ScrollTrigger.create({ ...onJourney(barn, 'left 60%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        /* islands: traveling word */
        const isl = root.querySelector<HTMLElement>('.dr-isl')
        if (isl) {
          const travel = isl.querySelector<HTMLElement>('.dr-travel')
          if (travel) {
            const line = travel.closest('.dr-isl-line') as HTMLElement
            const tl = gsap.timeline({ paused: true })
            tl.from(travel, {
              x: () => line.clientWidth - travel.offsetWidth - travel.offsetLeft,
              duration: 1.25, ease: 'power2.out',
            })
            ScrollTrigger.create({ ...onJourney(isl, 'left 55%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        /* sagan: three-axis settle + rows */
        const saga = root.querySelector<HTMLElement>('.dr-saga')
        if (saga) {
          const fig = saga.querySelector<HTMLElement>('.dr-saga-fig')!
          const figImg = fig.querySelector('.dr-m-src img')
          const sTl = gsap.timeline({ paused: true })
          sTl.from(fig, { '--dr-clip': '100% 0% 0% 0%', duration: 2 / 1.4, ease: 'power3.inOut' }, 0)
          sTl.from(figImg, { y: '20%', scale: 1.4, duration: 3 / 1.4, ease: 'power2.out' }, 0)
          sTl.from(fig, { height: '84svh', width: '54vw', duration: 1.25 / 1.4, ease: 'power3.inOut' }, 0.35)
          sTl.from(saga.querySelectorAll('.dr-saga-row'), { y: 24, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, 0.7)
          sTl.from(saga.querySelector('.dr-saga-award'), { opacity: 0, duration: 0.6, ease: 'none' }, 1.1)
          const sTitle = saga.querySelector('.dr-saga-title')
          if (sTitle) cascade(sTitle, sTl, 0.25)
          ScrollTrigger.create({ ...onJourney(saga, 'left 65%'), animation: sTl, toggleActions: 'play none none reverse' })
        }

        /* cierre: content drift + inner strip parallax + cascade */
        const cierre = root.querySelector<HTMLElement>('.dr-cierre')
        if (cierre) {
          const inEl = cierre.querySelector<HTMLElement>('.dr-cierre-in')!
          const cTl = gsap.timeline({ paused: true })
          cTl.fromTo(inEl, { x: '0%' }, { x: '18%', ease: 'none' }, 0)
          ScrollTrigger.create({ ...onJourney(cierre, 'left 0%'), animation: cTl, end: 'left -20%', scrub: 0 })
          const strip = cierre.querySelector<HTMLElement>('.dr-cierre-strip img')
          if (strip) {
            const pTl = gsap.timeline({ paused: true })
            pTl.from(strip, { x: '-24%', ease: 'none' }, 0)
            ScrollTrigger.create({ ...onJourney(cierre, 'left 100%'), animation: pTl, end: 'left 0%', scrub: 0.1 })
          }
          const word = cierre.querySelector('.dr-cierre-word')
          if (word) {
            const tl = gsap.timeline({ paused: true })
            cascade(word, tl, 0)
            tl.from(cierre.querySelector('.dr-cierre-sub'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '<+=.35')
            tl.from(cierre.querySelector('.dr-cierre-ctas'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '<+=.15')
            ScrollTrigger.create({ ...onJourney(cierre, 'left 55%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        /* flips on the journey (left-based starts) */
        armFlips((t) => {
          const flip = t as HTMLElement
          const scrubbed = flip.dataset.drScrub === '1'
          return { trigger: flip, containerAnimation: journeyTween, start: scrubbed ? 'left 100%' : 'left 82%' }
        })
      } else {
        /* ══ VERTICAL DOCUMENT (mobile / tablet) ══ */
        const hero = root.querySelector('.dr-hero')
        if (hero) {
          const intro = gsap.timeline({ paused: true })
          intro.from(root.querySelectorAll('.dr-hero-mask span'), { yPercent: 120, duration: 1, stagger: { each: 0.05, from: 'center' }, ease: 'power3.out' }, 0.1)
          intro.from(root.querySelector('.dr-waterline'), { scaleX: 0, duration: 1, ease: 'power2.inOut' }, 0.05)
          intro.from(root.querySelector('.dr-hero-sub'), { y: 18, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.7)
          intro.timeScale(TS).play()
        }
        root.querySelectorAll('.dr-statement .dr-sline, .dr-barn-title, .dr-saga-title, .dr-cierre-word').forEach((el) => {
          const tl = gsap.timeline({ paused: true })
          cascade(el, tl, 0)
          ScrollTrigger.create({ trigger: el, start: 'top 82%', animation: tl, toggleActions: 'play none none reverse' })
        })
        root.querySelectorAll('.dr-saga-row, .dr-acc-body, .dr-barn-body, .dr-cierre-sub, .dr-cierre-ctas, .dr-mat-term').forEach((el) => {
          gsap.from(el, {
            y: 26, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          })
        })
        /* mobile accordion media: scrubbed height + scale (reference mobile) */
        root.querySelectorAll<HTMLElement>('.dr-acc-media').forEach((media) => {
          const img = media.querySelector('.dr-m-src img')
          const tl = gsap.timeline({ paused: true })
          if (img) tl.from(img, { scale: 1.4, y: '-12%', ease: 'none' }, 0)
          ScrollTrigger.create({ trigger: media, start: 'top 92%', end: 'top 28%', animation: tl, scrub: 0.25 })
        })
        armFlips((t) => ({ trigger: t, start: 'top 85%' }))
      }

      /* footer gable morph — both branches (vertical section below journey) */
      const gable = root.querySelector<SVGPathElement>('.dr-footer-gable path')
      if (gable) {
        const mTl = gsap.timeline({ paused: true })
        mTl.to(gable, { attr: { d: GABLE_NEW }, duration: 1, ease: 'none' })
        ScrollTrigger.create({
          trigger: root.querySelector('.dr-footer'), start: 'top 65%', end: 'bottom bottom',
          animation: mTl, scrub: 2,
        })
      }
      const foot = root.querySelector('.dr-footer')
      if (foot) {
        gsap.from(foot.querySelectorAll('.dr-footer-grid > *'), {
          y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: foot, start: 'top 70%', toggleActions: 'play none none reverse' },
        })
      }

      /* refresh once assets settle (collapsed-track race) */
      const imgs = Array.from(root.querySelectorAll('img'))
      Promise.allSettled([document.fonts.ready, ...imgs.map((im) => (im as HTMLImageElement).decode?.().catch(() => undefined))]).then(() => {
        ScrollTrigger.refresh()
      })

      /* branch fork is structural: crossing it re-runs the whole engine
         (the reference reloads across its fork too) */
      const fork = window.matchMedia('(min-width: 1024px)')
      const onFork = () => window.location.reload()
      fork.addEventListener('change', onFork)
      cleanupFns.push(() => fork.removeEventListener('change', onFork))
    }, root)

    /* cursor — lerp + swell + content-swap */
    let cursorCleanup: (() => void) | undefined
    const cursorSwapRef = { el: null as HTMLElement | null }
    function cursorSwap(stack: HTMLElement | null) {
      const dot = cursorRef.current
      if (!dot) return
      if (stack) {
        cursorSwapRef.el = stack
        dot.classList.add('is-hidden')
        gsap.fromTo(stack, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.33, ease: 'power2.out' })
      } else {
        const prev = cursorSwapRef.el
        if (prev) gsap.to(prev, { scale: 0, opacity: 0, duration: 0.33, ease: 'power2.out' })
        cursorSwapRef.el = null
        dot.classList.remove('is-hidden')
      }
    }
    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024 && cursorRef.current) {
      const dot = cursorRef.current
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const mouse = { x: pos.x, y: pos.y }
      let speed = 0.2
      const setX = gsap.quickSetter(dot, 'x', 'px')
      const setY = gsap.quickSetter(dot, 'y', 'px')
      const tick = () => {
        const dt = 1 - Math.pow(1 - speed, gsap.ticker.deltaRatio())
        pos.x += (mouse.x - pos.x) * dt
        pos.y += (mouse.y - pos.y) * dt
        setX(pos.x)
        setY(pos.y)
        const sw = cursorSwapRef.el
        if (sw) {
          const parent = sw.offsetParent as HTMLElement | null
          const r = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 }
          sw.style.left = `${pos.x - r.left}px`
          sw.style.top = `${pos.y - r.top}px`
        }
      }
      gsap.ticker.add(tick)
      const move = (e: MouseEvent) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
        speed = cursorSwapRef.el ? 0.1 : 0.2
      }
      window.addEventListener('mousemove', move)
      const over = (e: MouseEvent) => {
        const t = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
        const label = dot.querySelector('span') as HTMLElement
        if (t && t.dataset.cursor) {
          label.textContent = t.dataset.cursor
          dot.classList.add('is-grown')
        } else {
          dot.classList.remove('is-grown')
        }
      }
      window.addEventListener('mouseover', over)
      cursorCleanup = () => {
        gsap.ticker.remove(tick)
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseover', over)
      }
    }

    return () => {
      ctx.revert()
      cleanupFns.forEach((fn) => fn())
      cursorCleanup?.()
      if (journeyNav) {
        journeyNav.lenis.destroy()
        journeyNav = null
      }
      pageLenis = null
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [loaderDone])

  /* anchor navigation (Lenis owns scrolling — ledger) */
  const go = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    if (journeyNav) {
      const { master, track, lenis } = journeyNav
      const panel = el.closest('.dr-panel') as HTMLElement | null
      const target = panel ?? el
      const maxX = track.scrollWidth - window.innerWidth
      const x = Math.min(target.offsetLeft, maxX)
      const scrollY = master.start + (x / maxX) * (master.end - master.start)
      lenis.scrollTo(scrollY, { duration: 1.4 })
    } else {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' }))
    }
  }

  return (
    <div ref={rootRef} className="dr-root" style={{ minHeight: '100svh' }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {!loaderDone && (
        <div className="dr-loader" role="status" aria-label="Loading">
          <div className="dr-loader-word" aria-hidden="true">
            {HERO.word.split('').map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
          <div className="dr-loader-bar"><i /></div>
          <div className="dr-loader-pct">0%</div>
        </div>
      )}

      <div className="dr-cursor" ref={cursorRef} aria-hidden="true">
        <div><span /></div>
      </div>
      <div className="dr-progress" aria-hidden="true" />

      <header>
        <div className="dr-top">
          <a
            href="#top"
            className={`dr-wordmark ${FOCUS}`}
            onClick={(e) => { e.preventDefault(); go('top') }}
          >
            Drangar
          </a>
          <nav className="dr-top-links" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`dr-rollify ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>
                {n.label}
              </a>
            ))}
          </nav>
          <button
            className={`dr-burger ${FOCUS}`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="dr-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <figure className="dr-menu-media" aria-hidden="true" style={{ margin: 0 }}>
            <img src={IMG.duskShore} alt="" />
            <figcaption>Breiðafjörður, dusk</figcaption>
          </figure>
          <nav>
            {NAV.map((n, i) => (
              <div className="dr-menu-item" key={n.id}>
                <a href={`#${n.id}`} className={`dr-menu-link ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>
                  <span className="dr-menu-num" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  {n.label}
                </a>
              </div>
            ))}
            <div className="dr-menu-item">
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={`dr-menu-link ${FOCUS}`}>
                <em>Book a room</em>
              </a>
            </div>
          </nav>
          <div className="dr-menu-foot dr-caps">
            <a href={EMAIL_HREF} className={FOCUS}>{EMAIL}</a>
            <a href={PHONE_HREF} className={FOCUS}>{PHONE_DISPLAY}</a>
          </div>
        </div>
      )}

      <main id="top">
        <div className="dr-journey">
          <div className="dr-track">

            {/* 1 ── HERO */}
            <section className="dr-panel dr-hero" aria-label="Drangar">
              <p className="dr-hero-kicker dr-caps">{HERO.kicker}</p>
              <div className="dr-hero-word-zone">
                <h1 className="dr-hero-word" aria-label="Drangar">
                  <span className="dr-hero-mask" aria-hidden="true">
                    {HERO.word.split('').map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </span>
                </h1>
              </div>
              <div>
                <div className="dr-waterline" />
                <div className="dr-hero-band">
                  <Media src={IMG.estate} alt="The renovated Drangar farm buildings against the ridge, copper barn to the left" dir="up" eager
                    spec={['Skógarströnd', '65°02´N', 'EST. UM 1980 / 2019']} />
                </div>
              </div>
              <p className="dr-hero-sub">{HERO.sub}</p>
              <nav className="dr-hero-rotmenu dr-caps" aria-label="Flýtileiðir">
                <a href="#sagan" className={FOCUS} onClick={(e) => { e.preventDefault(); go('sagan') }}>Story</a>
                <a href="#skemman" className={FOCUS} onClick={(e) => { e.preventDefault(); go('skemman') }}>Rooms</a>
              </nav>
              <p className="dr-hero-copy dr-mono" aria-hidden="true">{HERO.copyright}</p>
            </section>

            {/* 1b ── ARRIVAL: the copper barn elevation, one full-height slab */}
            <section className="dr-panel dr-arrival" aria-label="Arriving at Drangar">
              <div className="dr-arrival-big">
                <Media src={IMG.barnGable} alt={ARRIVAL.bigAlt} dir="up" spec={ARRIVAL.bigSpec} cursor="View" />
              </div>
            </section>

            {/* 2 ── STATEMENT */}
            <section className="dr-panel dr-statement" aria-label="About the farm">
              <div className="dr-statement-in">
                {STATEMENT.map((line, i) => (
                  <h2 className="dr-sline dr-display" key={i}>
                    {i === 3 ? <span className="dr-cont">{line}</span> : i === 1 ? (
                      <>and a <em>cow barn,</em></>
                    ) : (
                      line
                    )}
                  </h2>
                ))}
                <div className="dr-statement-body">
                  <p>{STATEMENT_BODY}</p>
                </div>
              </div>
            </section>

            {/* 2b ── RENOVATED, in their own words (images-text module) */}
            <section className="dr-panel dr-reno" aria-label="The renovation, in their own words">
              <div className="dr-reno-fig">
                <Media src={IMG.breakfastRoom} alt={RENOVATED.photoAlt} dir="up" />
              </div>
              <div className="dr-reno-copy">
                <p className="dr-reno-quote dr-display">
                  {RENOVATED.quote}
                </p>
                <p className="dr-caps" style={{ color: INK_MUTE, marginTop: '1.3rem' }}>{RENOVATED.attribution}</p>
              </div>
              <div className="dr-reno-fig-sm">
                <Media src={IMG.corridorLight} alt={RENOVATED.photo2Alt} dir="right" />
              </div>
            </section>

            {/* 3 ── TRACTOR SHED ACCORDION */}
            <section className="dr-panel" id="skemman" aria-label="The Tractor Shed rooms" style={{ width: 'auto' }}>
              <div className="dr-acc">
                {ROOMS.map((r) => (
                  <article key={r.id} className="dr-acc-item" style={{ background: r.field, color: r.ink }}>
                    <div className="dr-acc-num">{r.num} / {HERO.word}</div>
                    <div className="dr-acc-media">
                      <Media src={r.photo} alt={r.photoAlt} dir={Number(r.num) % 2 ? 'right' : 'up'} scrub cursor="View" />
                    </div>
                    <div className="dr-acc-body">
                      <figure className="dr-acc-detail" aria-hidden="false" style={{ margin: 0 }}>
                        <img src={r.photo2} alt={r.photo2Alt} loading="eager" decoding="async" />
                      </figure>
                      <div className="dr-acc-textwrap">
                        <h3 className="dr-acc-name dr-display">{r.name}</h3>
                        <div style={{ overflow: 'clip' }}><span className="dr-pop dr-acc-livery">In the livery of {r.livery}</span></div>
                        <div style={{ overflow: 'clip' }}><span className="dr-pop dr-acc-line">{r.line}</span></div>
                        <div style={{ overflow: 'clip' }}>
                          <span className="dr-pop dr-acc-cta">
                            <a
                              href={BOOKING_URL}
                              target="_blank"
                              rel="noreferrer"
                              className={`dr-btn ${FOCUS}`}
                              style={{ ['--dr-fill' as string]: PLASTER, color: 'inherit' }}
                              data-cursor="Book"
                              data-fill-ink={INK}
                            >
                              <span>Book</span>
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className="dr-spec dr-mono" style={{ position: 'absolute', right: 0, bottom: 0, left: 'auto', background: 'transparent', borderTop: `1px solid ${r.ink}`, color: 'inherit' }}>
                        {r.plate.map((p) => <span key={p}>{p}</span>)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 3b ── SHED NOTE */}
            <section className="dr-panel dr-shednote" aria-label="About the Tractor Shed rooms">
              <div className="dr-shednote-in">
                <p className="dr-caps" style={{ color: INK_MUTE, marginBottom: '1rem' }}>The Tractor Shed</p>
                <p className="dr-shednote-body">{ROOMS_NOTE}</p>
              </div>
            </section>

            {/* 4 ── MATERIALS */}
            <section className="dr-panel dr-mat" id="efnin" aria-label="The materials">
              <p className="dr-mat-rail dr-caps">Efnin ✳ the materials</p>
              {MATERIALS.map((m, i) => (
                <div className="dr-mat-term" key={m.id}>
                  <span className="dr-mat-idx" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  <h3 className="dr-mat-title"><span>{m.title}</span></h3>
                  <div className="dr-mat-text">
                    <p className="dr-mat-text-single is-on">{m.body}</p>
                  </div>
                  <div className="dr-mat-fig-m">
                    <img src={m.photo} alt={m.photoAlt} loading="lazy" />
                  </div>
                </div>
              ))}
              <div className="dr-mat-stack" aria-hidden="true">
                {MATERIALS.map((m, i) => (
                  <img key={m.id} src={m.photo} alt="" className={i === 0 ? 'is-on' : ''} loading="eager" decoding="async" />
                ))}
              </div>
            </section>

            {/* 5 ── COW BARN */}
            <section className="dr-panel dr-barn" id="fjosid" aria-label="The Cow Barn">
              <div className="dr-barn-stage">
                <div className="dr-barn-content">
                  <h2 className="dr-barn-title dr-display">
                    <em>{BARN.is}</em>, the Cow Barn
                  </h2>
                  <p className="dr-barn-body">{BARN.body}</p>
                </div>
                <div className="dr-barn-strip">
                  {BARN.photos.map((p) => (
                    <figure className="dr-barn-cell" key={p.src} style={{ margin: 0 }}>
                      <img src={p.src} alt={p.alt} loading="eager" decoding="async" />
                      <figcaption>{p.cap}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* 6 ── ISLANDS */}
            <section className="dr-panel dr-isl" aria-label="Breiðafjörður">
              <Media src={IMG.islands} alt="Dusk over the islands of Breiðafjörður from the Drangar shore" dir="right" scrub />
              <div className="dr-isl-chip">
                <p className="dr-caps" style={{ color: PLASTER_MUTE, marginBottom: '.5rem' }}>{ISLANDS.kicker}</p>
                <p className="dr-isl-line">
                  The estate keeps a handful of the countless{' '}
                  <span className="dr-travel">{ISLANDS.travelWord}</span>.
                </p>
              </div>
            </section>

            {/* 7 ── SAGAN */}
            <section className="dr-panel dr-saga" id="sagan" aria-label="The story">
              <div className="dr-saga-fig dr-flip dr-par" data-dr-dir="up">
                <div className="dr-m dr-m-src"><img src={IMG.entranceDusk} alt="" loading="eager" decoding="async" /></div>
                <div className="dr-m dr-m-up"><img src={IMG.entranceDusk} alt="The concrete entrance and glazing at dusk, terrace toward the sea" loading="eager" decoding="async" /></div>
              </div>
              <div className="dr-saga-copy">
                <h2 className="dr-saga-title">{SAGA.title}</h2>
                <p className="dr-saga-credit">{SAGA.credit}</p>
                <dl className="dr-saga-rows">
                  {TIMELINE.map((t) => (
                    <div className="dr-saga-row" key={t.year}>
                      <dt>{t.year}</dt>
                      <dd>{t.text}</dd>
                    </div>
                  ))}
                </dl>
                <p className="dr-saga-award">{SAGA.award}</p>
              </div>
            </section>

            {/* 6b ── SUMMER slab */}
            <section className="dr-panel dr-summer" aria-label="Summer at Drangar">
              <Media src={IMG.summerMeadow} alt="Green summer meadow at Drangar, a white farmhouse across the water" dir="up" scrub />
              <div className="dr-summer-chip dr-caps">{SUMMER.kicker}</div>
            </section>

            {/* 8 ── CIERRE */}
            <section className="dr-panel dr-cierre" aria-label="Booking">
              <div className="dr-cierre-in">
                <h2 className="dr-cierre-word">
                  <span className="dr-line">{CIERRE.lineA}</span>
                  <span className="dr-line"><em className="dr-it">{CIERRE.lineB}</em></span>
                </h2>
                <p className="dr-cierre-sub">{CIERRE.sub}</p>
                <div className="dr-cierre-ctas">
                  <a href={BOOKING_URL} target="_blank" rel="noreferrer" data-cursor="Book"
                    className={`dr-btn ${FOCUS}`} style={{ ['--dr-fill' as string]: PLASTER, color: PLASTER }}
                    data-fill-ink={ACCENT}>
                    <span>Check availability</span>
                  </a>
                  <a href={EMAIL_HREF} className={`dr-under ${FOCUS}`} style={{ color: PLASTER, textDecoration: 'none', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase' }}>
                    or write to us
                  </a>
                </div>
              </div>
              <div className="dr-cierre-strip" aria-hidden="true">
                <img src={IMG.gate} alt="" loading="eager" decoding="async" />
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER — vertical, after the journey */}
        <footer className="dr-footer" id="heimsokn">
          <svg className="dr-footer-gable" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
            <path d={GABLE_OLD} />
          </svg>
          <div className="dr-footer-grid">
            <div>
              <h2>Drangar,<br />Skógarströnd</h2>
            </div>
            <dl>
              <dt>Write</dt>
              <dd><a className={`dr-rollify ${FOCUS}`} href={EMAIL_HREF}>{EMAIL}</a></dd>
              <dt>Call</dt>
              <dd><a className={`dr-rollify ${FOCUS}`} href={PHONE_HREF}>{PHONE_DISPLAY}</a></dd>
              <dt>Book</dt>
              <dd><a className={`dr-rollify ${FOCUS}`} href={BOOKING_URL} target="_blank" rel="noreferrer">Live availability</a></dd>
            </dl>
            <dl>
              <dt>Find us</dt>
              <dd>{ADDRESS}</dd>
              <dd style={{ color: PLASTER_MUTE, marginTop: '.4rem', fontSize: '.85rem' }}>
                Midway between Stykkishólmur and Búðardalur, two hours from Reykjavík.
              </dd>
              <dt>Follow</dt>
              <dd style={{ display: 'flex', gap: '1.1rem' }}>
                <a className={`dr-rollify ${FOCUS}`} href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
                <a className={`dr-rollify ${FOCUS}`} href={FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
              </dd>
            </dl>
          </div>
          <div className="dr-footer-corners">
            <span>Drangar</span>
            <span>Country guesthouse</span>
          </div>
          <p className="dr-footer-credit">{CREDIT_NOTE}</p>
        </footer>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
