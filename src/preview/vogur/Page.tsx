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
  NAV, HERO, ARRIVAL, STATEMENT, STATEMENT_BODY, QUOTE, ROOMS, ROOMS_NOTE, HOUSE,
  EVENINGS, ISLANDS, WINTER, DALIR, DISTANCES, CIERRE, CREDIT_NOTE, JSON_LD,
  MAP, PLACES, RATING, REVIEWS,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)
/* expose for the QA/transplant-gate probe (parity with the reference, whose
   globals are visible) */
if (typeof window !== 'undefined') (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger

const company = getPreviewCompany('vogur')

/* ── „Fjaran" — the shore at low tide. Vogur means an inlet; the bay outside
   it holds countless islands and skerries that the tide uncovers twice a day.
   Engine: the Drangar build (normalisboring.es studied at source), unchanged
   in its mechanics: pinned horizontal journey, room ACCORDION (15vw→58vw in a
   fixed footprint), cursor-as-content rows, pin-in-pin filmstrip, edge-aware
   fills, odometer rollovers, single-writer flip peels. Vogur's own: the
   accent ages through their day (autumn grass → bay → aurora), and the
   footer's high-tide line drains into a low-tide line with skerries.
   Devices added from the reference teardown (Son Daven, capture.mjs probe
   24 Oct): scrubbed char reading at .1→1, slow scale 1→1.25 from the
   bottom edge on the arrival slab, the footer word zooming in from 2.
   Teardown: _docs/vogur-2026-10-24/teardown/. ───────────────────────────── */

/* Palette — every value sampled from Vogur's own photographs (24 Oct):
   PAPER #F3F4F1 the white corrugated walls · INK #233542 the navy window
   frames (11.46:1 on paper) · ACCENT #88303C the red roofs from the air
   (paper on it 7.5:1). Room fields are the slate wainscot, the window navy,
   the roofs and the heather, each carrying paper ink. */
const PLASTER = '#F3F4F1'
const INK = '#233542'
const ACCENT = '#88303C'

const INK_SOFT = 'rgba(35,53,66,.82)'
const INK_MUTE = 'rgba(35,53,66,.7)'
const PLASTER_SOFT = 'rgba(243,244,241,.88)'
const PLASTER_MUTE = 'rgba(243,244,241,.7)'
const HAIR_INK = 'rgba(35,53,66,.16)'
const HAIR_PLASTER = 'rgba(243,244,241,.22)'

const DISPLAY = "'Sentient', 'Times New Roman', serif"
const GROTESK = "'Supreme', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Azeret Mono', 'Courier New', monospace"

const FONTS = `${import.meta.env.BASE_URL}fonts/drangar/`

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#88303C]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── The day — Vogur's own light drives the accent elements (rules, chips,
   plate borders, progress bar) as you travel: the autumn grass of the
   afternoon photographs, the bay at dusk, the aurora over the ridge. Never
   the ground, never body text. ── */
const PATINA_STOPS = [
  { p: 0.0, c: '#A8692B' },  // autumn grass (#BE7429 measured, deepened for paper)
  { p: 0.5, c: '#3F6C80' },  // the bay at dusk (#47778D measured)
  { p: 1.0, c: '#3F6B3E' },  // aurora green (#445F35 measured)
]

/* Footer morph — the tide line. High water: one nearly flat line. Low water:
   the same line with the skerries of the bay standing out of it. Identical
   command structure (M + 10 L) so the raw `d` interpolates without a plugin. */
const GABLE_OLD =
  'M0,232 L100,230 L200,233 L300,231 L400,232 L500,230 L600,233 L700,231 L800,232 L900,230 L1000,232'
const GABLE_NEW =
  'M0,240 L100,240 L170,196 L260,240 L400,240 L470,168 L560,240 L700,240 L790,206 L880,240 L1000,240'

/* ── Page-local styles. Everything vg- prefixed, keyframes included
   (no-style-bleed rule). ─────────────────────────────────────────────────── */
const PAGE_STYLES = `
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-Extralight.woff2') format('woff2'); font-weight: 200; font-style: normal; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-ExtralightItalic.woff2') format('woff2'); font-weight: 200; font-style: italic; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${FONTS}Sentient-Light.woff2') format('woff2'); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${FONTS}Supreme-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${FONTS}Supreme-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Azeret Mono'; src: url('${FONTS}AzeretMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }

.vg-root {
  --vg-patina: ${PATINA_STOPS[0].c};
  --vg-100vh: 100svh;
  background: ${PLASTER};
  color: ${INK};
  font-family: ${GROTESK};
  font-kerning: none;
}
.vg-root ::selection { background: ${INK}; color: ${PLASTER}; }
.vg-root h1, .vg-root h2, .vg-root h3, .vg-root p { margin: 0; font-weight: 400; }
.vg-root img { max-width: 100%; }

/* type helpers */
.vg-display { font-family: ${DISPLAY}; font-weight: 200; }
.vg-it { font-family: ${DISPLAY}; font-weight: 200; font-style: italic; }
.vg-mono { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }
.vg-caps { font-family: ${GROTESK}; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; }

/* split-line hygiene: EVERY SplitText mask carries ascender/descender
   headroom, compensated with negative margins (Icelandic accents + Sentient
   descenders both clear). Applies wherever cascade() creates .vg-line. */
.vg-root .vg-line { overflow: clip; padding-top: .16em; margin-top: -.16em; padding-bottom: .18em; margin-bottom: -.18em; }
.vg-line > span { display: inline-block; }
.vg-wordspace { display: inline-block; width: .3em; }

/* ── media plumbing — two-copy peel + one-var parallax (reference's exact
   mechanism: --clip inset on the up layer, oversized source below). ── */
.vg-flip { position: relative; overflow: clip; display: block; }
.vg-m { position: absolute; inset: 0; }
.vg-m-up { z-index: 2; }
.vg-m img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
/* parallax room: the source is center-oversized so GSAP's yPercent drift
   (ONE writer, merged with the peel's scale) never exposes an edge */
.vg-par .vg-m-src img { height: 116%; top: -8%; }
.vg-flip .vg-m-up img { height: 114%; top: -7%; }
.vg-spec { position: absolute; left: 0; bottom: 0; z-index: 3; display: flex; gap: 1.1em;
  padding: .55em .9em; background: ${PLASTER_SOFT}; color: ${INK};
  border-top: 1px solid var(--vg-patina); }

/* ── buttons: edge-aware fill (reference's --posX/--posY plate). ── */
.vg-btn { position: relative; display: inline-block; cursor: pointer; white-space: nowrap;
  font-family: ${GROTESK}; font-size: 12px; letter-spacing: .18em; text-transform: uppercase;
  padding: calc(.85em - 1.5px) calc(1.9em - 1.5px); border: 1.5px solid currentColor;
  border-radius: calc((.85em - 1.5px) * 3); overflow: hidden; }
.vg-btn { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
.vg-btn:active { transform: scale(.97); }
.vg-btn > span { position: relative; display: block; z-index: 2; overflow: clip; }
.vg-btn::before { content: ''; position: absolute; width: 102%; height: 102%; top: 0; left: 0;
  border-radius: inherit; z-index: 1; background: var(--vg-fill, ${INK});
  transform: translate(var(--vg-px, -102%), var(--vg-py, 0%)); }
.vg-btn[data-armed='0']::before { transform: translate(-102%, 0%); }

/* underline links: two-phase wipe */
.vg-under { position: relative; --vg-w: 100%; --vg-x: 0%; }
.vg-under::after { content: ''; position: absolute; left: var(--vg-x); bottom: -.1em;
  width: var(--vg-w); height: 1px; background: currentColor; }

/* odometer roll links */
.vg-roll { position: relative; display: inline-block; overflow: clip; }
.vg-roll .vg-roll-b { position: absolute; top: 0; left: 0; }
.vg-roll .vg-roll-b span { transform: translateY(110%); }
.vg-roll span { display: inline-block; will-change: transform; }

/* ── cursor ── */
.vg-cursor { position: fixed; top: 0; left: 0; width: .8rem; height: .8rem; z-index: 200;
  pointer-events: none; mix-blend-mode: difference;
  transition: width .33s cubic-bezier(.34,1.56,.64,1), height .33s cubic-bezier(.34,1.56,.64,1); }
.vg-cursor > div { position: relative; width: 100%; height: 100%; transform: translate(-50%,-50%);
  background: ${ACCENT}; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.vg-cursor span { color: #fff; font-family: ${GROTESK}; font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; opacity: 0; white-space: nowrap; transition: opacity .33s cubic-bezier(.34,1.56,.64,1); }
.vg-cursor.is-grown { width: 7.15rem; height: 7.15rem; mix-blend-mode: normal; }
.vg-cursor.is-grown span { opacity: 1; }
.vg-cursor.is-hidden { opacity: 0; }
@media (max-width: 1023px), (pointer: coarse) { .vg-cursor { display: none; } }

/* ── first paint: the hero starts in its intro pose so the wordmark is drawn
   ONCE (no loader word, no visible-then-hidden flash). The engine adds
   .is-live in the same task it builds the intro; a timer adds it anyway. ── */
@media (prefers-reduced-motion: no-preference) {
  .vg-root:not(.is-live) .vg-hero-mask span { transform: translateY(120%); }
  .vg-root:not(.is-live) .vg-waterline { transform: scaleX(0); }
  .vg-root:not(.is-live) .vg-hero-kicker,
  .vg-root:not(.is-live) .vg-hero-sub { opacity: 0; }
}

/* ── header — ONE difference layer, legible over anything (the reference's
   exact mechanism: blend at container level). ── */
.vg-top { position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.65rem; pointer-events: none;
  mix-blend-mode: difference; color: #FFFFFF; }
.vg-top a, .vg-top button { pointer-events: all; }
.vg-top .vg-wordmark { font-family: ${DISPLAY}; font-weight: 200; font-size: 1.35rem; letter-spacing: .1em; color: inherit; text-decoration: none; }
.vg-top-links { display: flex; gap: 1.6rem; align-items: center; }
.vg-top-links a { color: inherit; text-decoration: none; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
@media (max-width: 1023px) { .vg-top-links { display: none; } }

/* burger */
.vg-burger { display: block; position: relative; width: 44px; height: 44px; background: none; border: 0; cursor: pointer; }
.vg-burger i { position: absolute; left: 10px; right: 10px; height: 1.5px; background: currentColor;
  transition: transform .4s cubic-bezier(.32,.72,0,1), top .4s cubic-bezier(.32,.72,0,1); }
.vg-burger i:nth-child(1) { top: 18px; }
.vg-burger i:nth-child(2) { top: 26px; }
.vg-burger[aria-expanded='true'] i:nth-child(1) { top: 22px; transform: rotate(45deg); }
.vg-burger[aria-expanded='true'] i:nth-child(2) { top: 22px; transform: rotate(-45deg); }

/* menu overlay, all viewports (sibling of header — ledger #29) */
.vg-menu { position: fixed; inset: 0; z-index: 55; background: ${INK}; color: ${PLASTER};
  display: flex; flex-direction: column; justify-content: center; padding: 6rem 2rem 3rem; }
.vg-menu-media { display: none; }
@media (min-width: 1024px) {
  .vg-menu { display: grid; grid-template-columns: 38vw 1fr; align-items: center;
    gap: 6vw; padding: 6rem 5vw 3rem; }
  .vg-menu-media { display: block; position: relative; height: 62svh; overflow: clip;
    clip-path: inset(0 0 0 100%); animation: vgMenuMedia .75s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .vg-menu-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    transform: translateX(35%); animation: vgMenuMediaImg 1.1s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .vg-menu-media figcaption { position: absolute; left: 0; bottom: 0; z-index: 2;
    padding: .55em .9em; background: rgba(19,18,17,.72); color: ${PLASTER};
    font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }
  .vg-menu-link { font-size: clamp(2.2rem, 3.6vw, 3.6rem); }
}
@keyframes vgMenuMedia { to { clip-path: inset(0 0 0 0%); } }
@keyframes vgMenuMediaImg { to { transform: translateX(0); } }
.vg-menu-num { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em;
  color: var(--vg-patina); margin-right: 1rem; vertical-align: .9em; }
.vg-menu a { color: inherit; text-decoration: none; }
.vg-menu-link { display: block; font-family: ${DISPLAY}; font-weight: 200;
  font-size: clamp(2rem, 8vw, 3.2rem); line-height: 1.22; }
.vg-menu-link em { font-style: italic; }
.vg-menu-item { overflow: clip; padding-top: .12em; margin-top: -.06em; padding-bottom: .14em; margin-bottom: -.06em; }
.vg-menu-item > * { display: block; transform: translateY(115%); animation: vgMenuRise .7s cubic-bezier(.16,1,.3,1) forwards; }
.vg-menu-item:nth-child(1) > * { animation-delay: .08s } .vg-menu-item:nth-child(2) > * { animation-delay: .15s }
.vg-menu-item:nth-child(3) > * { animation-delay: .22s } .vg-menu-item:nth-child(4) > * { animation-delay: .29s }
.vg-menu-item:nth-child(5) > * { animation-delay: .36s } .vg-menu-item:nth-child(6) > * { animation-delay: .43s }
@keyframes vgMenuRise { to { transform: translateY(0) } }
.vg-menu-foot { margin-top: auto; display: flex; flex-direction: column; gap: .6rem; }

/* progress bar (journey only) */
.vg-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 2px; z-index: 70;
  transform-origin: left center; transform: scaleX(0); background: var(--vg-patina); }

/* ══ THE JOURNEY (desktop) ══ */
.vg-journey { position: relative; overflow: clip; }
.vg-track { display: flex; width: fit-content; }
.vg-panel { position: relative; height: var(--vg-100vh); flex: none; }

/* hero */
.vg-hero { width: 100vw; display: grid; grid-template-rows: 1fr auto; background: ${PLASTER}; }
.vg-hero-word-zone { position: relative; display: flex; align-items: flex-end; justify-content: center; }
.vg-hero-word { position: relative; font-family: ${DISPLAY}; font-weight: 200;
  font-size: min(13.2vw, 34svh); line-height: .82; letter-spacing: .015em; white-space: nowrap; }
.vg-hero-word .vg-hero-mask { display: inline-block; overflow: clip; padding-top: .18em; } /* inline boxes ignore overflow: the mask must be a box or the word shows un-masked */
.vg-hero-word .vg-hero-mask span { display: inline-block; }
.vg-waterline { position: relative; height: 1px; background: ${INK}; margin: 0 1.65rem; }
.vg-hero-band { position: relative; height: 38svh; margin: 0; }
.vg-hero-band .vg-flip { position: absolute; inset: 0; }
.vg-hero-kicker { position: absolute; top: calc(1.1rem + 54px); left: 1.65rem; color: ${INK_MUTE}; }
/* sits directly under the kicker, OUT of the wordmark's vertical band: the
   colossal word is centred and its left edge reaches ~17vw, so anything
   parked beside it at mid-height collides on shorter viewports */
.vg-hero-sub { position: absolute; left: 1.65rem; top: calc(1.1rem + 5.2rem); max-width: 14rem;
  font-size: .85rem; line-height: 1.5; color: ${INK_SOFT}; }
.vg-hero-rotmenu { position: absolute; top: calc(1.1rem + 54px); right: .55rem; transform-origin: bottom right;
  transform: rotate(-90deg); display: flex; flex-wrap: nowrap; gap: 1.2rem; color: ${INK_MUTE}; white-space: nowrap; }

/* arrival — one full-height architecture slab (reference image-single) */
.vg-arrival { width: 76vw; background: ${PLASTER}; overflow: clip; }
.vg-arrival-big { position: absolute; inset: 0; }
.vg-arrival-big .vg-flip { position: absolute; inset: 0; }
.vg-arrival-big .vg-m img { width: 114%; max-width: none; }
@media all {
  .vg-arrival { width: 100%; }
  .vg-arrival-big { position: relative; inset: auto; }
  .vg-arrival-big .vg-flip { position: relative; aspect-ratio: 1279/900; }
  .vg-arrival-big .vg-m img { width: 100%; }
}

/* renovated (images-text) */
.vg-reno { width: 120vw; background: ${PLASTER}; }
.vg-reno-fig { position: absolute; left: 4vw; top: 50%; transform: translateY(-50%);
  width: 34vw; aspect-ratio: 4/3; }
.vg-reno-fig .vg-flip, .vg-reno-fig-sm .vg-flip { position: absolute; inset: 0; }
.vg-reno-copy { position: absolute; left: 44vw; top: 50%; transform: translateY(-50%); width: 38vw; }
.vg-reno-quote { font-size: min(2.5vw, 5.2svh); line-height: 1.24; }
.vg-reno-fig-sm { position: absolute; right: 4vw; bottom: 10svh; width: 22vw; aspect-ratio: 3/4; }
@media all {
  .vg-reno { width: 100%; padding: 4rem 1.65rem; }
  .vg-reno-fig, .vg-reno-copy, .vg-reno-fig-sm { position: relative; left: auto; right: auto; top: auto; bottom: auto; transform: none; width: 100%; }
  .vg-reno-fig .vg-flip { position: relative; aspect-ratio: 4/3; }
  .vg-reno-copy { margin: 2rem 0; }
  .vg-reno-quote { font-size: 6.4vw; }
  .vg-reno-fig-sm { width: 68%; margin-left: auto; }
  .vg-reno-fig-sm .vg-flip { position: relative; aspect-ratio: 3/4; }
}

/* summer slab */
.vg-summer { width: 100vw; position: relative; }
.vg-summer .vg-flip { position: absolute; inset: 0; }
.vg-summer-chip { position: absolute; right: 1.65rem; bottom: 1.65rem; z-index: 4;
  background: ${PLASTER_SOFT}; color: ${INK}; padding: .7rem 1rem; }
@media all { .vg-summer { height: 62svh; } }

/* hero © */
.vg-hero-copy { position: absolute; left: 1.65rem; bottom: calc(38svh + 1.2rem); color: ${INK_MUTE}; }
@media all { .vg-hero-copy { display: none; } }

/* statement */
.vg-statement { width: 92vw; display: flex; align-items: center; background: ${INK}; color: ${PLASTER};
  box-shadow: 0 0 0 1px ${INK}; }
.vg-statement-in { padding: 0 7vw; width: 100%; }
.vg-statement .vg-sline { font-family: ${DISPLAY}; font-weight: 200; font-size: min(4.1vw, 8.4svh);
  line-height: 1.08; white-space: nowrap; }
.vg-statement .vg-sline em { font-style: italic; }
.vg-statement .vg-cont { position: relative; display: inline-block; }
.vg-statement-body { max-width: 30rem; margin-top: 2.6rem; color: ${PLASTER_MUTE};
  font-size: .85rem; line-height: 1.6; }
.vg-statement-body .vg-char { opacity: 1; }

/* accordion — FIXED total width (the reference's sizeProjects): items open
   INSIDE a constant footprint, so nothing downstream ever shifts and every
   later trigger window stays true. The trailing space is consumed ahead of
   the traveler as items open. */
.vg-acc { display: flex; width: 232vw; height: var(--vg-100vh); }
.vg-acc-item { position: relative; width: 58vw; height: 100%; overflow: clip; display: flex; flex-direction: column; }
.vg-acc-media { position: relative; height: 60svh; flex: none; overflow: clip; }
.vg-acc-media .vg-flip { position: absolute; inset: 0; }
.vg-acc-body { position: relative; flex: 1; display: flex; align-items: center; padding: 0 3.2vw; overflow: clip; }
.vg-acc-detail { display: none; }
@media (min-width: 1024px) {
  /* content laid out at OPEN width; the closed panel just clips it (reference) */
  .vg-acc-textwrap { width: 30vw; min-width: 30vw; }
  .vg-acc-detail { display: block; order: 2; width: 13vw; min-width: 13vw; aspect-ratio: 3/4;
    margin-left: 3vw; align-self: center; overflow: clip; max-height: 34svh; }
  .vg-acc-detail img { width: 100%; height: 100%; object-fit: cover;
    transition: transform .7s cubic-bezier(.16,1,.3,1); }
  .vg-acc-item:hover .vg-acc-detail img { transform: scale(1.045); }
}
.vg-acc-num { position: absolute; top: 1.2rem; left: 1.4rem; z-index: 3; font-family: ${MONO};
  font-size: 10.5px; letter-spacing: .18em; color: #fff; mix-blend-mode: difference; }
.vg-acc-name { font-family: ${DISPLAY}; font-weight: 200; font-size: min(3.4vw, 3.4rem); line-height: 1; }
.vg-acc-livery { margin-top: .7rem; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; opacity: .82; }
.vg-acc-line { margin-top: 1rem; max-width: 21rem; font-size: .85rem; line-height: 1.55; opacity: .92; }
.vg-acc-cta { margin-top: 1.5rem; }
.vg-acc-textwrap > * { overflow: clip; }
.vg-acc-textwrap .vg-pop { display: block; }

/* shed note */
.vg-shednote { width: 44vw; background: ${PLASTER}; display: flex; align-items: center; }
.vg-shednote-in { padding: 0 6vw; }
.vg-shednote-body { font-size: .95rem; line-height: 1.65; color: ${INK_SOFT}; max-width: 24rem; }
@media all { .vg-shednote { width: 100%; } .vg-shednote-in { padding: 3.5rem 1.65rem; } }

/* materials — width just past one viewport plus the drift runway; a wider
   panel leaves a dead plaster stretch before the barn's ink edge */
.vg-mat { width: 112vw; background: ${PLASTER}; display: flex; flex-direction: column;
  justify-content: space-between; padding: 5.5rem 1.65rem 2.2rem; }
.vg-mat-rail { position: absolute; top: 50%; left: 1.1rem; transform: rotate(-90deg) translateY(-50%);
  transform-origin: center left; color: ${INK_MUTE}; }
.vg-mat-term { position: relative; display: flex; align-items: center; width: 100%;
  border-top: 1px solid ${HAIR_INK}; padding-top: 1.6svh; padding-bottom: 1.6svh; }
.vg-mat-term:last-of-type { border-bottom: 1px solid ${HAIR_INK}; }
.vg-mat-idx { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em;
  color: var(--vg-patina); margin-right: 2vw; min-width: 2.4rem; }
@media (min-width: 1024px) and (hover: hover) {
  .vg-mat-term { cursor: none; }
  .vg-mat-term .vg-mat-title { transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .vg-mat-term:hover .vg-mat-title { transform: translateX(.6vw); }
}
.vg-mat-title { position: relative; z-index: 5; font-family: ${DISPLAY}; font-weight: 200;
  font-size: min(7.2vw, 15svh); line-height: .95; mix-blend-mode: difference; }
.vg-mat-title > span { display: inline-block; filter: invert(100%); color: #000000; }
.vg-mat-text { position: relative; width: 17rem; min-width: 17rem; margin-left: 4vw; }
.vg-mat-text-single { font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; }
.vg-mat-stack { position: absolute; width: 24vw; aspect-ratio: 4/3; pointer-events: none;
  transform: translate(-50%, -50%) scale(0); z-index: 10; overflow: clip; }
.vg-mat-stack img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0; --vg-clip: 0% 0% 0% 0%; clip-path: inset(var(--vg-clip)); }
.vg-mat-stack img.is-on { opacity: 1; z-index: 2; }
.vg-mat-stack img.is-prev { opacity: 1; z-index: 1; }

/* barn pin-in-pin — the stage counter-slides against the journey so it holds
   the viewport while the vertical film plays (the reference's last-item). */
.vg-barn { width: 220vw; background: ${INK}; color: ${PLASTER}; overflow: clip;
  box-shadow: 0 0 0 1px ${INK}; }
.vg-barn-stage { position: absolute; top: 0; left: 0; width: 100vw; height: 100%; will-change: transform; }
.vg-barn-content { position: absolute; top: 0; left: 0; width: 46vw; height: 100%;
  display: flex; flex-direction: column; justify-content: center; padding: 0 0 0 6vw; }
.vg-barn-title { font-family: ${DISPLAY}; font-weight: 200; font-size: min(4.8vw, 10svh); line-height: 1; }
.vg-barn-title em { font-style: italic; }
.vg-barn-body { margin-top: 1.6rem; max-width: 24rem; color: ${PLASTER_MUTE}; font-size: .85rem; line-height: 1.6; }
.vg-barn-strip { position: absolute; top: 0; left: 54vw; width: 40vw; will-change: transform; }
.vg-barn-cell { position: relative; height: 44svh; margin-bottom: 2svh; overflow: clip; }
.vg-barn-cell img { width: 100%; height: 100%; object-fit: cover; }
.vg-barn-cell figcaption { position: absolute; left: 0; bottom: 0; z-index: 2;
  padding: .5em .85em; background: rgba(19,18,17,.72); color: ${PLASTER};
  font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; }

/* islands full-bleed */
.vg-isl { width: 100vw; position: relative; }
.vg-isl .vg-flip { position: absolute; inset: 0; }
.vg-isl-chip { position: absolute; left: 1.65rem; bottom: 1.65rem; z-index: 4; background: ${INK};
  color: ${PLASTER}; padding: 1rem 1.2rem; max-width: 22rem; overflow: clip; }
.vg-isl-line { font-family: ${DISPLAY}; font-weight: 200; font-size: 1.5rem; line-height: 1.25; }
.vg-isl-line .vg-travel { position: relative; display: inline-block; font-style: italic; color: var(--vg-patina); }

/* sagan */
.vg-saga { width: 118vw; background: ${PLASTER}; display: flex; align-items: center; gap: 4vw; padding: 0 5vw; }
.vg-saga-fig { position: relative; width: 46vw; height: 64svh; flex: none; overflow: clip; }
.vg-saga-fig .vg-m-src img { height: 118%; }
.vg-saga-copy { max-width: 36rem; }
.vg-saga-title { overflow-wrap: normal; hyphens: manual; }
.vg-saga-title { font-family: ${DISPLAY}; font-weight: 200; font-size: min(3.6vw, 8svh); line-height: 1.04; }
.vg-saga-credit { margin-top: .9rem; color: ${INK_MUTE}; font-size: .8rem; }
.vg-saga-rows { margin-top: 2.2rem; }
.vg-saga-row { display: grid; grid-template-columns: 8.5rem 1fr; gap: 1.4rem; padding: .78em 0;
  border-top: 1px solid ${HAIR_INK}; font-size: .85rem; line-height: 1.5; }
.vg-saga-row dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; color: var(--vg-patina); padding-top: .25em; }
.vg-saga-award { margin-top: 1.6rem; font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; max-width: 26rem; }

/* cierre */
.vg-cierre { width: 120vw; background: ${ACCENT}; color: ${PLASTER}; overflow: clip; }
.vg-cierre-in { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 6vw; width: 88vw; }
.vg-cierre-word { font-family: ${DISPLAY}; font-weight: 200; font-size: min(9.5vw, 21svh); line-height: .96; }
/* each row is its own BLOCK line, so the phrase stacks instead of running off
   the panel as one nowrap row */
.vg-cierre-row { display: block; white-space: nowrap; }
.vg-cierre-sub { margin-top: 2rem; font-size: .9rem; color: rgba(237,235,230,.85); }
.vg-cierre-ctas { margin-top: 2rem; display: flex; gap: 1.2rem; align-items: center; }
.vg-cierre-strip { position: absolute; top: 8svh; right: -4vw; width: 34vw; height: 30svh; overflow: clip; opacity: .92; }
.vg-cierre-strip img { width: 130%; height: 100%; object-fit: cover; }

/* ══ FOOTER (vertical, after the journey) ══ */
.vg-footer { position: relative; background: ${INK}; color: ${PLASTER}; padding: 7rem 1.65rem 2rem; overflow: clip; }
.vg-footer-gable { position: absolute; inset: auto 0 0 0; height: min(38vw, 420px); width: 100%; opacity: .5; pointer-events: none; }
.vg-footer-gable path { fill: none; stroke: var(--vg-patina); stroke-width: 1.5; }
.vg-footer-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 3rem; max-width: 1200px; }
.vg-footer h2 { font-family: ${DISPLAY}; font-weight: 200; font-size: clamp(2.2rem, 4.6vw, 4rem); line-height: 1; }
.vg-footer dl { margin: 0; }
.vg-footer dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: ${PLASTER_MUTE}; margin-top: 1.2rem; }
.vg-footer dd { margin: .3rem 0 0; font-size: .95rem; }
.vg-footer a { color: inherit; text-decoration: none; }
.vg-footer-corners { position: relative; z-index: 2; display: flex; justify-content: space-between;
  margin-top: 5rem; padding-top: 1.2rem; border-top: 1px solid ${HAIR_PLASTER};
  color: ${PLASTER_MUTE}; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; }
.vg-footer-word { position: relative; z-index: 2; margin: 4.5rem 0 0; font-family: ${DISPLAY}; font-weight: 200;
  font-size: 19.5vw; line-height: .78; letter-spacing: .01em; text-align: center; white-space: nowrap; color: ${PLASTER}; }
.vg-footer-credit { position: relative; z-index: 2; margin-top: 1rem; color: rgba(237,235,230,.4); font-size: 11px; line-height: 1.6; max-width: 46rem; }

/* ══ THE VERTICAL DOCUMENT (every width since 24 Oct: the horizontal journey
   measured 46 ms/frame at 4× CPU; vertical measured 17 ms) ══ */
@media all {
  .vg-track { display: block; width: 100%; }
  .vg-panel { height: auto; width: 100% !important; }
  .vg-acc { width: 100%; }
  .vg-hero { min-height: 100svh; }

  .vg-hero-rotmenu { display: none; }
  .vg-statement { padding: 5rem 0; }
  .vg-statement .vg-sline { font-size: 7vw; white-space: normal; }
  .vg-statement-in { padding: 0 1.65rem; }
  .vg-acc { display: block; height: auto; }
  .vg-acc-item { width: 100%; }
  .vg-acc-media { height: 52svh; }
  .vg-acc-body { padding: 1.8rem 1.65rem 2.6rem; }
  .vg-acc-name { font-size: 2rem; }
  .vg-mat { width: 100%; padding: 4.5rem 1.65rem; }
  .vg-mat-rail { display: none; }
  .vg-mat-term { flex-direction: column; align-items: flex-start; gap: .9rem; margin-bottom: 2.6rem; }
  .vg-mat-title { font-size: 11vw; mix-blend-mode: normal; }
  .vg-mat-title > span { filter: none; color: ${INK}; }
  .vg-mat-text { width: 100%; min-width: 0; margin-left: 0; }
  .vg-mat-fig-m { width: 100%; aspect-ratio: 4/3; overflow: clip; }
  .vg-mat-fig-m img { width: 100%; height: 100%; object-fit: cover; }
  .vg-barn { width: 100%; }
  .vg-barn-stage { position: static; width: 100%; height: auto; }
  .vg-barn-content { position: static; width: 100%; padding: 4.5rem 1.65rem 1rem; }
  .vg-barn-strip { position: static; width: 100%; padding: 0 1.65rem 3rem; }
  .vg-barn-cell { height: 46svh; margin-bottom: 1rem; }
  .vg-isl { height: 72svh; }
  .vg-saga { display: block; padding: 4.5rem 1.65rem; }
  .vg-saga-fig { width: 100%; height: 46svh; margin-bottom: 2.2rem; }
  .vg-cierre { padding: 5rem 0; }
  .vg-cierre-in { position: static; width: 100%; padding: 0 1.65rem; }
  .vg-cierre-word { font-size: 15vw; white-space: normal; }
  .vg-cierre-strip { display: none; }
  .vg-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}

/* desktop-only bits */
@media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
  .vg-mat-fig-m { display: none; }
}
@media (max-width: 1023px) { .vg-hero-word { font-size: min(24vw, 19svh); line-height: .8; } .vg-hero-band { height: 46svh; } }

/* ══ MAP — edge to edge, a night chart in the window navy ══ */
.vg-mapsec { background: ${INK}; color: ${PLASTER}; padding: 6rem 0 3rem; }
.vg-mapsec-head { padding: 0 1.65rem 2.4rem; }
.vg-mapsec-title { margin-top: .8rem; font-size: clamp(2.2rem, 5.4vw, 5rem); line-height: 1; }
.vg-mapsec-title em { font-style: italic; }
.vg-map-stage { width: 100%; }
.vg-map-svg { display: block; width: 100%; height: auto; }
.vg-map-coast { fill: none; stroke: rgba(243,244,241,.5); stroke-width: .9; vector-effect: non-scaling-stroke; }
.vg-map-isl { fill: rgba(243,244,241,.78); stroke: rgba(243,244,241,.78); stroke-width: .6; vector-effect: non-scaling-stroke; }
.vg-map-mark circle { fill: var(--vg-patina); stroke: ${INK}; stroke-width: 1.2; }
.vg-map-mark text { fill: ${PLASTER}; font-family: ${GROTESK}; }
.vg-map-label { font-size: 10px; letter-spacing: .04em; }
.vg-map-note { font-size: 7.5px; fill: ${PLASTER_MUTE}; letter-spacing: .08em; }
.vg-map-num { font-size: 8px; font-family: ${MONO}; display: none; }
.vg-map-home rect { fill: ${ACCENT}; stroke: ${PLASTER}; stroke-width: 1; }
.vg-map-home text { fill: ${PLASTER}; font-family: ${DISPLAY}; font-size: 13px; letter-spacing: .14em; }
.vg-map-legend { display: none; list-style: none; margin: 0; padding: 1.6rem 1.65rem 0; }
.vg-map-legend li { display: grid; grid-template-columns: 2.4rem 1fr auto; gap: .8rem; padding: .7rem 0; border-top: 1px solid ${HAIR_PLASTER}; font-size: .9rem; }
.vg-map-legend em { font-style: normal; color: ${PLASTER_MUTE}; font-size: .8rem; }
.vg-map-credit { padding: 1.2rem 1.65rem 0; color: ${PLASTER_MUTE}; font-size: 11px; }
@media (max-width: 1023px) {
  .vg-map-label { display: none; }
  .vg-map-num { display: block; font-size: 24px; font-weight: 500; transform: translateY(-8px); }
  .vg-map-mark circle { r: 7; stroke-width: 2.4; }
  .vg-map-home rect { transform: scale(1.8); }
  .vg-map-home text { font-size: 26px; transform: translateX(8px); }
  .vg-map-legend { display: block; }
}
@media (min-width: 1024px) {
  .vg-mapsec { padding: 9rem 0 4rem; }
  .vg-mapsec-head { padding: 0 5vw 3rem; }
  .vg-map-credit { padding: 1.4rem 5vw 0; }
}

/* ══ REVIEWS ══ */
.vg-rev { background: ${PLASTER}; padding: 6rem 0; }
.vg-rev-head { padding: 0 1.65rem 2.6rem; display: flex; flex-direction: column; gap: .6rem; }
.vg-rev-score { font-size: clamp(4.5rem, 12vw, 9rem); line-height: .9; }
.vg-rev-score span { font-size: .32em; color: ${INK_MUTE}; }
.vg-rev-list { list-style: none; margin: 0; padding: 0 1.65rem; display: grid; grid-auto-flow: column; grid-auto-columns: 82%; gap: 1rem;
  overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
.vg-rev-list::-webkit-scrollbar { display: none; }
.vg-rev-card { scroll-snap-align: start; border-top: 1px solid ${INK}; padding: 1.4rem 0 0; display: flex; flex-direction: column; justify-content: space-between; gap: 1.6rem; min-height: 15rem; }
.vg-rev-card blockquote { margin: 0; font-size: 1.45rem; line-height: 1.28; }
.vg-rev-card p { color: ${INK_MUTE}; }
@media (min-width: 1024px) {
  .vg-rev { padding: 9rem 0; }
  .vg-rev-head { padding: 0 5vw 3.5rem; flex-direction: row; align-items: baseline; justify-content: space-between; }
  .vg-rev-list { padding: 0 5vw; grid-auto-flow: row; grid-template-columns: repeat(5, 1fr); grid-auto-columns: auto; overflow: visible; gap: 2.4vw; }
  .vg-rev-card blockquote { font-size: min(1.6vw, 1.55rem); }
}

/* ══ STICKY ROOM CARDS: each room holds the screen, the next slides over it ══ */
.vg-acc-item { position: sticky; top: var(--vg-head, 0px); height: calc(var(--vg-100vh) - var(--vg-head, 0px)); }
/* the dwell: each card holds still for ~60vh of scroll before the next one slides over it */
.vg-acc-item + .vg-acc-item { margin-top: 60vh; }
/* phones: the pipeline's fixed opaque bar instead of the blend header (the
   blend garbled text under it in real iOS Safari and tinted the status bar) */
@media (max-width: 1023px) {
  .vg-root { --vg-head: 66px; }
  .vg-top { mix-blend-mode: normal; color: ${INK}; background: ${PLASTER}; border-bottom: 1px solid ${HAIR_INK};
    height: var(--vg-head); padding-top: 0; padding-bottom: 0; padding-top: env(safe-area-inset-top); box-sizing: content-box; }
  .vg-hero { padding-top: var(--vg-head); }
  .vg-hero-kicker { top: calc(var(--vg-head) + 1.4rem); }
  .vg-hero-sub { position: absolute; left: 1.65rem; top: calc(var(--vg-head) + 3.6rem); max-width: 17rem; margin: 0; }
  .vg-acc-num { top: 1rem; }
}
.vg-acc-media { height: 50svh; }

/* ══ DESKTOP layouts for the vertical document ══ */
@media (min-width: 1024px) {
  .vg-hero { min-height: 100svh; }
  .vg-hero-sub { position: absolute; margin: 0; }
  .vg-hero-band { height: 44svh; }
  .vg-arrival-big .vg-flip { aspect-ratio: auto; height: 100svh; }
  .vg-statement { padding: 10rem 0; }
  .vg-statement-in { padding: 0 9vw; }
  .vg-statement .vg-sline { font-size: min(4.6vw, 9svh); white-space: nowrap; }
  .vg-reno { display: grid; grid-template-columns: 30vw 1fr 20vw; gap: 5vw; align-items: center; padding: 9rem 5vw; }
  .vg-reno-fig .vg-flip { position: relative; aspect-ratio: 1; }
  .vg-reno-copy { margin: 0; }
  .vg-reno-quote { font-size: min(2.6vw, 5.4svh); }
  .vg-reno-fig-sm { width: 100%; margin: 12rem 0 0; }
  .vg-acc-media { height: 62svh; }
  .vg-acc-body { padding: 0 6vw; }
  .vg-acc-name { font-size: min(4.2vw, 4.2rem); }
  .vg-shednote-in { padding: 8rem 5vw; display: grid; grid-template-columns: 1fr 2fr; gap: 5vw; }
  .vg-mat { padding: 9rem 5vw; }
  .vg-mat-rail { display: block; position: static; transform: none; margin-bottom: 2rem; }
  .vg-mat-term { flex-direction: row; align-items: center; margin-bottom: 0; }
  .vg-mat-title { font-size: min(7vw, 14svh); mix-blend-mode: normal; }
  .vg-mat-title > span { filter: none; color: ${INK}; }
  .vg-mat-text { width: 18rem; min-width: 18rem; margin-left: auto; }
  .vg-barn-stage { display: grid; grid-template-columns: 40vw 1fr; }
  .vg-barn-content { position: sticky; top: 0; height: var(--vg-100vh); padding: 0 4vw 0 6vw; justify-content: center; display: flex; flex-direction: column; }
  .vg-barn-strip { padding: 12svh 5vw 12svh 0; }
  .vg-barn-cell { height: 64svh; margin-bottom: 4svh; }
  .vg-barn-title { font-size: min(4.8vw, 10svh); }
  .vg-isl { height: 100svh; }
  .vg-saga { display: flex; align-items: center; gap: 5vw; padding: 9rem 5vw; }
  .vg-saga-fig { width: 46vw; height: 76svh; margin: 0; }
  .vg-summer { height: 92svh; }
  .vg-cierre { padding: 11rem 0; }
  .vg-cierre-in { padding: 0 7vw; }
  .vg-cierre-word { font-size: min(9.5vw, 21svh); white-space: nowrap; }
  .vg-cierre-strip { display: block; top: 50%; transform: translateY(-50%); right: 6vw; width: 28vw; height: 44svh; }
  .vg-cierre-strip img { width: 100%; }
  .vg-footer-grid { grid-template-columns: 1.2fr 1fr 1fr; gap: 3rem; }
}

/* touch targets: 44px legal minimum without changing the visual weight */
@media (max-width: 1023px), (pointer: coarse) {
  .vg-btn { padding: calc(1.15em - 1px) calc(2.1em - 1px); }
  .vg-top .vg-wordmark { padding: .55rem .6rem; margin: -.55rem -.6rem; }
  .vg-footer dd a, .vg-menu-foot a {
    display: inline-block; padding: .62rem 0; margin: -.42rem 0; }
  .vg-cierre-ctas .vg-under { display: inline-block; padding: .85rem 0; margin: -.55rem 0; }
}

/* reduced motion: resting CSS is the finished page */
@media (prefers-reduced-motion: reduce) {
  .vg-cursor, .vg-progress { display: none !important; }
  .vg-menu-item > * { animation: none; transform: none; }
  .vg-roll .vg-roll-b { display: none; }
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

/* ── The map: OSM coastline as one SVG, places as SVG marks so they crop with
   the viewBox. Phones get numbered marks + a legend (labels stay readable). ── */
const MAP_W = 1000
const MAP_H = 692.9
const MAP_VIEW = '170 80 810 560' // Flatey → Eiríksstaðir, Stykkishólmur → Skarð
function mapXY(lat: number, lon: number) {
  const [S, W, N, E] = MAP.bbox
  return { x: ((lon - W) / (E - W)) * MAP_W, y: ((N - lat) / (N - S)) * MAP_H }
}
function VogurMap() {
  const [paths, setPaths] = useState<{ coast: string; islands: string } | null>(null)
  useEffect(() => {
    let alive = true
    fetch(MAP.src).then((r) => r.json()).then((d: { coast: string[]; islands: { d: string }[] }) => {
      if (alive) setPaths({ coast: d.coast.join(''), islands: d.islands.map((i) => i.d).join('') })
    }).catch(() => undefined)
    return () => { alive = false }
  }, [])
  const v = mapXY(MAP.vogur.lat, MAP.vogur.lon)
  return (
    <div className="vg-map-stage">
      <svg className="vg-map-svg" viewBox={MAP_VIEW} preserveAspectRatio="xMidYMid meet" role="img"
        aria-label="Map of Breiðafjörður and Dalir around Vogur, with nearby places">
        {paths && (
          <>
            <path className="vg-map-coast" d={paths.coast} />
            <path className="vg-map-isl" d={paths.islands} />
          </>
        )}
        {PLACES.map((p, i) => {
          const { x, y } = mapXY(p.lat, p.lon)
          const left = x > 860
          return (
            <g className="vg-map-mark" key={p.name} transform={`translate(${x} ${y})`}>
              <circle r="3.2" />
              <text className="vg-map-num" y="-7" textAnchor="middle">{i + 1}</text>
              <text className="vg-map-label" x={left ? -8 : 8} y="3.2" textAnchor={left ? 'end' : 'start'}>
                {p.name}<tspan className="vg-map-note" x={left ? -8 : 8} dy="11">{p.note}</tspan>
              </text>
            </g>
          )
        })}
        <g className="vg-map-home" transform={`translate(${v.x} ${v.y})`}>
          <rect x="-5" y="-5" width="10" height="10" />
          <text x="10" y="4">VOGUR</text>
        </g>
      </svg>
    </div>
  )
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
      className={`vg-flip vg-par ${className ?? ''}`}
      data-vg-dir={dir}
      data-vg-scrub={scrub ? '1' : '0'}
      data-cursor={cursor}
      style={{ margin: 0 }}
    >
      <div className="vg-m vg-m-src" aria-hidden="true">
        <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <div className="vg-m vg-m-up">
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {spec && (
        <figcaption className="vg-spec vg-mono">
          {spec.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export default function VogurPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useBodyLock(menuOpen)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    setThemeColor(PLASTER)
    /* iOS 26 samples an opaque body/fixed bar for its chrome tint */
    const prevBg = document.body.style.backgroundColor
    document.body.style.backgroundColor = PLASTER
    document.title = 'Vogur Country Lodge | Fellsströnd, Breiðafjörður'
    return () => { document.body.style.backgroundColor = prevBg }
  }, [])

  /* ── the engine ── */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const live = window.setTimeout(() => root.classList.add('is-live'), 2500)
    if (prefersReduced()) { root.classList.add('is-live'); return } // resting CSS is the finished page

    const fine = window.matchMedia('(pointer: fine)').matches
    const cleanupFns: Array<() => void> = []
    const steps: Array<() => void> = []
    const later = (fn: () => void) => { steps.push(fn) }
    const ctx = gsap.context(() => {
      const TS = 1.15 // global speed dial (reference)

      /* ── shared: split helpers ── */
      const cascade = (el: Element, tl: gsap.core.Timeline, pos: string | number = '<+=.05') => {
        const split = SplitText.create(el, { type: 'lines,words,chars', linesClass: 'vg-line', charsClass: 'vg-char' })
        /* iterate the SPLIT'S OWN lines, never a querySelectorAll: markup that
           already carries a .vg-line class would otherwise be matched too and
           the same chars get tweened twice in opposite directions (one line
           ends up parked out of view behind its mask). */
        split.lines.forEach((line, i) => {
          const from = i % 2 !== 0 ? -110 : 110
          tl.from(line.querySelectorAll('.vg-char'), {
            yPercent: from, duration: 0.65, stagger: 0.03, ease: 'power3.out',
          }, i === 0 ? pos : '<+=.05')
        })
      }

      /* odometer roll links (nav + footer) */
      /* odometer rollovers are a hover device: mice only (touch showed both copies) */
      if (fine) root.querySelectorAll<HTMLElement>('.vg-rollify').forEach((el) => {
        const inner = el.innerHTML
        el.classList.add('vg-roll')
        el.innerHTML = `<span class="vg-roll-a">${inner}</span><span class="vg-roll-b" aria-hidden="true">${inner}</span>`
        const a = el.querySelector('.vg-roll-a') as HTMLElement
        const b = el.querySelector('.vg-roll-b') as HTMLElement
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
        root.querySelectorAll<HTMLElement>('.vg-btn').forEach((btn) => {
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
            gsap.fromTo(btn, { '--vg-px': e.px[0], '--vg-py': e.py[0] }, { '--vg-px': '0%', '--vg-py': '0%', duration: 0.25, delay: 0.1, ease: 'power3.in' })
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
            gsap.fromTo(btn, { '--vg-px': '0%', '--vg-py': '0%' }, { '--vg-px': e.px[1], '--vg-py': e.py[1], duration: 0.25, delay: 0.1, ease: 'power3.in' })
            gsap.fromTo(span, { x: e.sx[0], y: e.sy[0] }, { x: 0, y: 0, duration: 0.33, delay: 0.25, ease: 'power3.out' })
          })
        })
      }

      {
        /* ══ THE VERTICAL DOCUMENT — every width. Transform/opacity only, no
           layer wider than the viewport, sticky room cards on the compositor. ══ */
        const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
        if (!touch) { const lenis = new Lenis({ lerp: 0.1 }); pageLenis = lenis; lenis.on('scroll', ScrollTrigger.update); const raf = (t: number) => lenis.raf(t * 1000); gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0); cleanupFns.push(() => { gsap.ticker.remove(raf); lenis.destroy(); pageLenis = null }) }
        const SCRUB = touch ? 0.35 : 1
        const hero = root.querySelector('.vg-hero')
        if (hero) {
          root.classList.add('is-live') // same task as the intro: no paint in between
          const intro = gsap.timeline({ paused: true })
          intro.from(root.querySelectorAll('.vg-hero-mask span'), { yPercent: 120, duration: 1.1, stagger: { each: 0.06, from: 'center' }, ease: 'power3.out' }, 0.15)
          intro.from(root.querySelector('.vg-waterline'), { scaleX: 0, duration: 1.1, ease: 'power2.inOut' }, 0.1)
          const kick = root.querySelector('.vg-hero-kicker')
          if (kick) cascade(kick, intro, 0.55)
          intro.from(root.querySelector('.vg-hero-sub'), { y: 18, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
          intro.timeScale(TS).play()
          /* the band settles as you leave the hero */
          const band = root.querySelector('.vg-hero-band')
          if (band) gsap.fromTo(band, { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: SCRUB } })
        }
        /* everything below the fold is armed in small pieces AFTER the intro has
           started: building it all in one go was a 225 ms block (6x CPU) that
           stalled the wordmark's first frames. */
        root.querySelectorAll('.vg-statement .vg-sline, .vg-barn-title, .vg-saga-title, .vg-cierre-word').forEach((el) => later(() => {
          const tl = gsap.timeline({ paused: true })
          cascade(el, tl, 0)
          ScrollTrigger.create({ trigger: el, start: 'top 84%', animation: tl, toggleActions: 'play none none reverse' })
        }))
        /* reading reveal (Son Daven: chars .1 → 1, scrubbed top 75% → bottom 50%) */
        root.querySelectorAll('.vg-statement-body p, .vg-reno-quote').forEach((el) => later(() => {
          const split = SplitText.create(el, { type: 'words' })
          gsap.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: SCRUB } })
        }))
        later(() => root.querySelectorAll('.vg-saga-row, .vg-barn-body, .vg-cierre-sub, .vg-cierre-ctas, .vg-mat-term, .vg-shednote-body').forEach((el) => {
          gsap.from(el, {
            y: 26, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
          })
        }))
        /* sticky room cards: the card underneath sinks back as the next one slides over */
        const cards = Array.from(root.querySelectorAll<HTMLElement>('.vg-acc-item'))
        later(() => cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) return
          gsap.fromTo(card, { scale: 1 }, { scale: 0.97, transformOrigin: 'center top', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
          /* no text reveal inside a sticky card: triggers measured there go stale
             and the room name stayed hidden. Name, price and Book are simply there. */
        }))
        /* the house: cursor becomes the photograph (desktop mice only) */
        const mat = root.querySelector<HTMLElement>('.vg-mat')
        if (mat && fine && window.innerWidth >= 1024) {
          const terms = Array.from(mat.querySelectorAll<HTMLElement>('.vg-mat-term'))
          const stack = mat.querySelector<HTMLElement>('.vg-mat-stack')!
          const stackImgs = Array.from(stack.querySelectorAll('img'))
          let cur = 0
          terms.forEach((term, i) => {
            term.addEventListener('mouseenter', () => {
              if (cur === i) return
              stackImgs.forEach((im) => im.classList.remove('is-prev'))
              stackImgs[cur].classList.add('is-prev'); stackImgs[cur].classList.remove('is-on'); stackImgs[i].classList.add('is-on')
              gsap.fromTo(stackImgs[i], { '--vg-clip': '100% 0% 0% 0%' }, { '--vg-clip': '0% 0% 0% 0%', duration: 1.25, ease: 'power3.out' })
              gsap.fromTo(stackImgs[i], { scale: 1.6 }, { scale: 1, duration: 1.6, ease: 'power2.out' })
              cur = i
            })
          })
          if (cursorRef.current) {
            mat.addEventListener('mouseenter', () => cursorSwap(stack))
            mat.addEventListener('mouseleave', () => cursorSwap(null))
          }
        }
        /* photographs: a calm CSS mask — the picture opens inside its own frame
           (inset 9% 7% → 0) and settles from 1.05, scrubbed over a short band.
           One layer only; the second peel copy is hidden. */
        root.querySelectorAll<HTMLElement>('.vg-flip').forEach((fig) => later(() => {
          const up = fig.querySelector<HTMLElement>('.vg-m-up')
          const src = fig.querySelector<HTMLElement>('.vg-m-src')
          const img = up?.querySelector('img')
          if (!up || !img) return
          if (src) gsap.set(src, { autoAlpha: 0 })
          const st = { trigger: fig, start: 'top 94%', end: 'top 58%', scrub: SCRUB }
          gsap.fromTo(up, { clipPath: 'inset(9% 7% 9% 7%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: st })
          gsap.fromTo(img, { scale: 1.05 }, { scale: 1, ease: 'none', scrollTrigger: { ...st } })
          /* and a slight drift inside the frame across the whole pass */
          gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: SCRUB } })
        }))
        later(() => root.querySelectorAll<HTMLElement>('.vg-barn-cell').forEach((cell) => {
          gsap.fromTo(cell, { clipPath: 'inset(8% 6% 8% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: cell, start: 'top 94%', end: 'top 60%', scrub: SCRUB } })
        }))
        /* map + reviews: quiet entrances */
        later(() => {
        const mapSvg = root.querySelector('.vg-map-svg')
        if (mapSvg) gsap.from(mapSvg, { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: mapSvg, start: 'top 85%', toggleActions: 'play none none reverse' } })
        root.querySelectorAll('.vg-rev-card, .vg-map-legend li').forEach((el, i) => {
          gsap.from(el, { opacity: 0, y: 22, duration: 0.8, delay: (i % 5) * 0.06, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' } })
        })
        })
      }

      later(() => {
      /* footer gable morph */
      const gable = root.querySelector<SVGPathElement>('.vg-footer-gable path')
      if (gable) {
        const mTl = gsap.timeline({ paused: true })
        mTl.to(gable, { attr: { d: GABLE_NEW }, duration: 1, ease: 'none' })
        ScrollTrigger.create({
          trigger: root.querySelector('.vg-footer'), start: 'top 65%', end: 'bottom bottom',
          animation: mTl, scrub: 2,
        })
      }
      /* footer word zooms in (Son Daven probe: footer-w scale 2 → 1, origin
         center 10%) */
      const fWord = root.querySelector('.vg-footer-word')
      if (fWord) {
        gsap.fromTo(fWord, { scale: 2, transformOrigin: 'center 10%' }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: root.querySelector('.vg-footer'), start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        })
      }
      const foot = root.querySelector('.vg-footer')
      if (foot) {
        gsap.from(foot.querySelectorAll('.vg-footer-grid > *'), {
          y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: foot, start: 'top 70%', toggleActions: 'play none none reverse' },
        })
      }
      })

    }, root)

    /* the queue pump: one piece per task, so no frame waits on more than one */
    let pumpId = 0
    const pump = () => {
      const fn = steps.shift()
      if (!fn) {
        /* re-measure once fonts are in; lazy photos re-measure as they land
           (never decode() every image up front: that pulled the whole lazy
           gallery in at load) */
        document.fonts.ready.then(() => ScrollTrigger.refresh())
        return
      }
      ctx.add(fn)
      pumpId = window.setTimeout(pump, 0)
    }
    pumpId = window.setTimeout(pump, 160)
    let refreshId = 0
    const onImg = (e: Event) => {
      if ((e.target as HTMLElement).tagName !== 'IMG') return
      window.clearTimeout(refreshId)
      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    }
    root.addEventListener('load', onImg, true)
    cleanupFns.push(() => { window.clearTimeout(pumpId); window.clearTimeout(refreshId); root.removeEventListener('load', onImg, true) })

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
      window.clearTimeout(live)
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
  }, [])

  /* anchor navigation (Lenis owns scrolling — ledger) */
  const go = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    if (journeyNav) {
      const { master, track, lenis } = journeyNav
      const panel = el.closest('.vg-panel') as HTMLElement | null
      const target = panel ?? el
      const maxX = track.scrollWidth - window.innerWidth
      const x = Math.min(target.offsetLeft, maxX)
      const scrollY = master.start + (x / maxX) * (master.end - master.start)
      lenis.scrollTo(scrollY, { duration: 1.4 })
    } else {
      /* wait for the menu's body lock to release (iOS: scrolling a locked body
         does nothing, so the link closed the menu and went nowhere) */
      window.setTimeout(() => {
        const head = document.querySelector<HTMLElement>('.vg-top')
        const offset = window.matchMedia('(max-width: 1023px)').matches && head ? -head.offsetHeight : 0
        if (pageLenis) pageLenis.scrollTo(el, { duration: 1.3, offset })
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: prefersReduced() ? 'auto' : 'smooth' })
      }, 90)
    }
  }

  return (
    <div ref={rootRef} className="vg-root" style={{ minHeight: '100svh' }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <div className="vg-cursor" ref={cursorRef} aria-hidden="true">
        <div><span /></div>
      </div>
      <div className="vg-progress" aria-hidden="true" />

      <header>
        <div className="vg-top">
          <a
            href="#top"
            className={`vg-wordmark ${FOCUS}`}
            onClick={(e) => { e.preventDefault(); go('top') }}
          >
            Vogur
          </a>
          <nav className="vg-top-links" aria-label="Main">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`vg-rollify ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>
                {n.label}
              </a>
            ))}
          </nav>
          <button
            className={`vg-burger ${FOCUS}`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="vg-menu" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} ref={(el) => el?.focus({ preventScroll: true })}>
          <figure className="vg-menu-media" aria-hidden="true" style={{ margin: 0 }}>
            <img src={IMG.window} alt="" />
            <figcaption>Out of a Vogur window</figcaption>
          </figure>
          <nav>
            {NAV.map((n, i) => (
              <div className="vg-menu-item" key={n.id}>
                <a href={`#${n.id}`} className={`vg-menu-link ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>
                  <span className="vg-menu-num" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  {n.label}
                </a>
              </div>
            ))}
            <div className="vg-menu-item">
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={`vg-menu-link ${FOCUS}`}>
                <em>Book a room</em>
              </a>
            </div>
          </nav>
          <div className="vg-menu-foot vg-caps">
            <a href={EMAIL_HREF} className={FOCUS}>{EMAIL}</a>
            <a href={PHONE_HREF} className={FOCUS}>{PHONE_DISPLAY}</a>
          </div>
        </div>
      )}

      <main id="top">
        <div className="vg-journey">
          <div className="vg-track">

            {/* 1 ── HERO: the name on the waterline, the farm from the air */}
            <section className="vg-panel vg-hero" aria-label="Vogur">
              <p className="vg-hero-kicker vg-caps">{HERO.kicker}</p>
              <div className="vg-hero-word-zone">
                <h1 className="vg-hero-word" aria-label="Vogur">
                  <span className="vg-hero-mask" aria-hidden="true">
                    {HERO.word.split('').map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </span>
                </h1>
              </div>
              <div>
                <div className="vg-waterline" />
                <div className="vg-hero-band">
                  <Media src={IMG.aerial} alt="Vogur from the air: white buildings with red roofs on green fields below the mountain and its ravine" dir="up" eager />
                </div>
              </div>
              <p className="vg-hero-sub">{HERO.sub}</p>
              <nav className="vg-hero-rotmenu vg-caps" aria-label="Shortcuts">
                <a href="#dalir" className={FOCUS} onClick={(e) => { e.preventDefault(); go('dalir') }}>Dalir</a>
                <a href="#herbergin" className={FOCUS} onClick={(e) => { e.preventDefault(); go('herbergin') }}>Rooms</a>
              </nav>
              <p className="vg-hero-copy vg-mono" aria-hidden="true">{HERO.copyright}</p>
            </section>

            {/* 1b ── ARRIVAL: the view they sell, one full-height slab */}
            <section className="vg-panel vg-arrival" aria-label="The view from Vogur">
              <div className="vg-arrival-big">
                <Media src={IMG.islands} alt={ARRIVAL.bigAlt} dir="up" cursor="View" />
              </div>
            </section>

            {/* 2 ── STATEMENT */}
            <section className="vg-panel vg-statement" aria-label="About Vogur">
              <div className="vg-statement-in">
                {STATEMENT.map((line, i) => (
                  <h2 className="vg-sline vg-display" key={i}>
                    {i === 3 ? <span className="vg-cont">{line}</span> : i === 2 ? (
                      <>where the <em>tide</em> goes out</>
                    ) : (
                      line
                    )}
                  </h2>
                ))}
                <div className="vg-statement-body">
                  <p>{STATEMENT_BODY}</p>
                </div>
              </div>
            </section>

            {/* 2b ── IN THEIR OWN WORDS (images-text module) */}
            <section className="vg-panel vg-reno" aria-label="In their own words">
              <div className="vg-reno-fig">
                <Media src={IMG.sill} alt={QUOTE.photoAlt} dir="up" />
              </div>
              <div className="vg-reno-copy">
                <p className="vg-reno-quote vg-display">{QUOTE.quote}</p>
                <p className="vg-caps" style={{ color: INK_MUTE, marginTop: '1.3rem' }}>{QUOTE.attribution}</p>
              </div>
              <div className="vg-reno-fig-sm">
                <Media src={IMG.deckSun} alt={QUOTE.photo2Alt} dir="right" />
              </div>
            </section>

            {/* 3 ── ROOMS ACCORDION */}
            <section className="vg-panel" id="herbergin" aria-label="Rooms" style={{ width: 'auto' }}>
              <div className="vg-acc">
                {ROOMS.map((r) => (
                  <article key={r.id} className="vg-acc-item" style={{ background: r.field, color: r.ink }}>
                    <div className="vg-acc-num">{r.num} / {HERO.word}</div>
                    <div className="vg-acc-media">
                      <Media src={r.photo} alt={r.photoAlt} dir={Number(r.num) % 2 ? 'right' : 'up'} scrub cursor="View" />
                    </div>
                    <div className="vg-acc-body">
                      <figure className="vg-acc-detail" style={{ margin: 0 }}>
                        <img src={r.photo2} alt={r.photo2Alt} loading="eager" decoding="async" />
                      </figure>
                      <div className="vg-acc-textwrap">
                        <h3 className="vg-acc-name vg-display">{r.name}</h3>
                        <div style={{ overflow: 'clip' }}><span className="vg-pop vg-acc-livery">{r.is}</span></div>
                        <div style={{ overflow: 'clip' }}><span className="vg-pop vg-acc-line">{r.line} <b style={{ fontWeight: 500 }}>{r.price}</b> a night.</span></div>
                        <div style={{ overflow: 'clip' }}>
                          <span className="vg-pop vg-acc-cta">
                            <a
                              href={BOOKING_URL}
                              target="_blank"
                              rel="noreferrer"
                              className={`vg-btn ${FOCUS}`}
                              style={{ ['--vg-fill' as string]: PLASTER, color: 'inherit' }}
                              data-cursor="Book"
                              data-fill-ink={INK}
                            >
                              <span>Book</span>
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className="vg-spec vg-mono" style={{ position: 'absolute', right: 0, bottom: 0, left: 'auto', background: 'transparent', borderTop: `1px solid ${r.ink}`, color: 'inherit' }}>
                        {r.plate.map((p) => <span key={p}>{p}</span>)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 3b ── ROOMS NOTE */}
            <section className="vg-panel vg-shednote" aria-label="More about the rooms">
              <div className="vg-shednote-in">
                <p className="vg-caps" style={{ color: INK_MUTE, marginBottom: '1rem' }}>Herbergin, the rooms</p>
                <p className="vg-shednote-body">{ROOMS_NOTE}</p>
              </div>
            </section>

            {/* 4 ── THE HOUSE: rows, cursor becomes the photograph */}
            <section className="vg-panel vg-mat" id="husid" aria-label="The house">
              <p className="vg-mat-rail vg-caps">Húsið ✳ the house</p>
              {HOUSE.map((m, i) => (
                <div className="vg-mat-term" key={m.id}>
                  <span className="vg-mat-idx" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  <h3 className="vg-mat-title"><span>{m.title}</span></h3>
                  <div className="vg-mat-text">
                    <p className="vg-mat-text-single is-on">{m.body}</p>
                  </div>
                  <div className="vg-mat-fig-m">
                    <img src={m.photo} alt={m.photoAlt} loading="eager" decoding="async" />
                  </div>
                </div>
              ))}
              <div className="vg-mat-stack" aria-hidden="true">
                {HOUSE.map((m, i) => (
                  <img key={m.id} src={m.photo} alt="" className={i === 0 ? 'is-on' : ''} loading="eager" decoding="async" />
                ))}
              </div>
            </section>

            {/* 5 ── EVENINGS: pin-in-pin filmstrip */}
            <section className="vg-panel vg-barn" id="kvoldin" aria-label="Evenings">
              <div className="vg-barn-stage">
                <div className="vg-barn-content">
                  <h2 className="vg-barn-title vg-display">
                    <em>{EVENINGS.is}</em>, the evenings
                  </h2>
                  <p className="vg-barn-body">{EVENINGS.body}</p>
                </div>
                <div className="vg-barn-strip">
                  {EVENINGS.photos.map((p) => (
                    <figure className="vg-barn-cell" key={p.src} style={{ margin: 0 }}>
                      <img src={p.src} alt={p.alt} loading="eager" decoding="async" />
                      <figcaption>{p.cap}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* 6 ── ISLANDS: their own word travels */}
            <section className="vg-panel vg-isl" aria-label="Breiðafjörður">
              <Media src={IMG.rocks} alt="A walker on the rocks above Vogur with the islands ahead" dir="right" scrub />
              <div className="vg-isl-chip">
                <p className="vg-caps" style={{ color: PLASTER_MUTE, marginBottom: '.5rem' }}>{ISLANDS.kicker}</p>
                <p className="vg-isl-line">
                  Countless small islands and{' '}
                  <span className="vg-travel">{ISLANDS.travelWord}</span>.
                </p>
              </div>
            </section>

            {/* 7 ── DALIR: the saga country, distances by road */}
            <section className="vg-panel vg-saga" id="dalir" aria-label="Dalir">
              <div className="vg-saga-fig vg-flip vg-par" data-vg-dir="up">
                <div className="vg-m vg-m-src"><img src={IMG.road} alt="" loading="eager" decoding="async" /></div>
                <div className="vg-m vg-m-up"><img src={IMG.road} alt="The road in to Vogur between the hills of Dalir" loading="eager" decoding="async" /></div>
              </div>
              <div className="vg-saga-copy">
                <h2 className="vg-saga-title">{DALIR.title}</h2>
                <p className="vg-saga-credit">{DALIR.credit}</p>
                <dl className="vg-saga-rows">
                  {DISTANCES.map((t) => (
                    <div className="vg-saga-row" key={t.km}>
                      <dt>{t.km}</dt>
                      <dd>{t.text}</dd>
                    </div>
                  ))}
                </dl>
                <p className="vg-saga-award">{DALIR.body}</p>
              </div>
            </section>

            {/* 7a ── THE MAP: edge to edge */}
            <section className="vg-panel vg-mapsec" id="kort" aria-labelledby="vg-map-h">
              <div className="vg-mapsec-head">
                <p className="vg-caps" style={{ color: PLASTER_MUTE }}>Kortið ✳ around Vogur</p>
                <h2 id="vg-map-h" className="vg-mapsec-title vg-display">Breiðafjörður <em>and</em> Dalir</h2>
              </div>
              <VogurMap />
              <ol className="vg-map-legend">
                {PLACES.map((p, i) => (
                  <li key={p.name}><span className="vg-mono">{String(i + 1).padStart(2, '0')}</span><b>{p.name}</b><em>{p.note}</em></li>
                ))}
              </ol>
              <p className="vg-map-credit">{MAP.credit}</p>
            </section>

            {/* 7a2 ── REVIEWS: real excerpts from their Google listing */}
            <section className="vg-panel vg-rev" aria-labelledby="vg-rev-h">
              <div className="vg-rev-head">
                <p className="vg-rev-score vg-display" id="vg-rev-h">{RATING.score}<span> / 5</span></p>
                <p className="vg-caps" style={{ color: INK_MUTE }}>{RATING.count} {RATING.source} · {RATING.read}</p>
              </div>
              <ul className="vg-rev-list">
                {REVIEWS.map((r) => (
                  <li className="vg-rev-card" key={r.who}>
                    <blockquote className="vg-display">“{r.quote}”</blockquote>
                    <p className="vg-caps">{r.who} · {r.where}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7b ── WINTER slab */}
            <section className="vg-panel vg-summer" aria-label="Fellsströnd in winter">
              <Media src={IMG.winter} alt="A walker on the snowy rocks above the bay in winter" dir="up" scrub />
              <div className="vg-summer-chip vg-caps">{WINTER.kicker}</div>
            </section>

            {/* 8 ── CIERRE: the roof-red panel */}
            <section className="vg-panel vg-cierre" aria-label="Booking">
              <div className="vg-cierre-in">
                <h2 className="vg-cierre-word">
                  <span className="vg-cierre-row">{CIERRE.lineA}</span>
                  <span className="vg-cierre-row"><em className="vg-it">{CIERRE.lineB}</em></span>
                </h2>
                <p className="vg-cierre-sub">{CIERRE.sub}</p>
                <div className="vg-cierre-ctas">
                  <a href={BOOKING_URL} target="_blank" rel="noreferrer" data-cursor="Book"
                    className={`vg-btn ${FOCUS}`} style={{ ['--vg-fill' as string]: PLASTER, color: PLASTER }}
                    data-fill-ink={ACCENT}>
                    <span>Check availability</span>
                  </a>
                  <a href={EMAIL_HREF} className={`vg-under ${FOCUS}`} style={{ color: PLASTER, textDecoration: 'none', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase' }}>
                    or write to them
                  </a>
                </div>
              </div>
              <div className="vg-cierre-strip" aria-hidden="true">
                <img src={IMG.stone} alt="" loading="eager" decoding="async" />
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER — vertical, after the journey: the tide goes out */}
        <footer className="vg-footer" id="heimsokn">
          <svg className="vg-footer-gable" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
            <path d={GABLE_OLD} />
          </svg>
          <div className="vg-footer-grid">
            <div>
              <h2>Vogur,<br />Fellsströnd</h2>
            </div>
            <dl>
              <dt>Write</dt>
              <dd><a className={`vg-rollify ${FOCUS}`} href={EMAIL_HREF}>{EMAIL}</a></dd>
              <dt>Call</dt>
              <dd><a className={`vg-rollify ${FOCUS}`} href={PHONE_HREF}>{PHONE_DISPLAY}</a></dd>
              <dt>Book</dt>
              <dd><a className={`vg-rollify ${FOCUS}`} href={BOOKING_URL} target="_blank" rel="noreferrer">Live availability</a></dd>
            </dl>
            <dl>
              <dt>Find us</dt>
              <dd>{ADDRESS}</dd>
              <dd style={{ color: PLASTER_MUTE, marginTop: '.4rem', fontSize: '.85rem' }}>
                On the Fellsströnd coast, 54 km from Búðardalur and 208 km from Reykjavík by road.
              </dd>
            </dl>
          </div>
          <p className="vg-footer-word" aria-hidden="true">VOGUR</p>
          <div className="vg-footer-corners">
            <span>Vogur</span>
            <span>Country lodge</span>
          </div>
          <p className="vg-footer-credit">{CREDIT_NOTE}</p>
        </footer>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
