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
  IMG, EMAIL, EMAIL_HREF, CAMERAS, PANORAMA, HOUSES, PLACES, HOTSPOTS, T, JSON_LD,
} from './data'
import type { Lang } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)
if (typeof window !== 'undefined') (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger

const company = getPreviewCompany('nollur')

/* ── "Across the fjord" ──────────────────────────────────────────────────────
   Drangar's NIB engine (../drangar/Page.tsx, itself normalisboring.es studied
   at source) carried to nine houses on Eyjafjörður: pinned horizontal journey
   measured at progress(1), a three-place ACCORDION inside a fixed footprint,
   padding-parallax materials with a cursor that becomes content, a pin-in-pin
   filmstrip for the farm, edge-aware button fills, odometer rollovers, flip
   peels, and a footer where the glass villa's flat roofline morphs into the
   farmhouse gable. New here: the hero. Two rounds of a house-silhouette
   cutout (a pixel-scan, then a hand-corrected one checked against an overlay
   at every corner) both still read as a bad cutout once live — the fix was
   never a better trace. The wordmark now rests with its own foot tucked a
   little behind the house from the very first frame, held there by a SOFT
   mask-image on the photo's own top edge (transparent to opaque over a few
   rem — a straight, photo-agnostic fade, not a shape read from the picture),
   and scrolling through the hero sends the word further down behind the
   opaque photo until it is gone, exactly the "left left" journey-scoped
   scrub already used for the barn and the cierre panel. The owner's four
   materials are tagged as hotspots on the photo. ─────────────────────────── */

const PLASTER = '#E8E9E6'
const PLASTER_2 = '#DDDFDA'
const INK = '#121415'
const ACCENT = '#7A4E2E' // walnut, sampled from Hrafnabjörg's cladding and the Kaldbakur bed

const INK_SOFT = 'rgba(18,20,21,.78)'
const INK_MUTE = 'rgba(18,20,21,.64)'
const PLASTER_SOFT = 'rgba(232,233,230,.86)'
const PLASTER_MUTE = 'rgba(232,233,230,.64)'
const HAIR_INK = 'rgba(18,20,21,.16)'
const HAIR_PLASTER = 'rgba(232,233,230,.22)'
const LINE = 'rgba(122,78,46,.75)'

const DISPLAY = "'Redaction 35', 'Times New Roman', serif"
const DISPLAY_WORN = "'Redaction 70', 'Redaction 35', 'Times New Roman', serif"
const GROTESK = "'Overused Grotesk', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Commit Mono', 'Courier New', monospace"

const FONTS = `${import.meta.env.BASE_URL}fonts/nollur/`

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A4E2E]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Footer morph: Hrafnabjörg's flat cantilevered profile → the farmhouse gable
   at Nollur. Same command structure (M + 10 L) so the raw `d` interpolates. */
const ROOF_VILLA =
  'M0,240 L150,240 L150,140 L420,140 L420,108 L760,108 L760,178 L900,178 L900,240 L1000,240 L1000,240'
const ROOF_FARM =
  'M0,240 L120,240 L200,150 L300,150 L380,86 L520,86 L600,150 L700,150 L760,200 L900,200 L1000,240'

const readLang = (): Lang => {
  if (typeof window === 'undefined') return 'en'
  const q = new URLSearchParams(window.location.search).get('lang')
  if (q === 'de' || q === 'en') return q
  try { if (sessionStorage.getItem('nl_lang') === 'de') return 'de' } catch { /* private mode */ }
  return 'en'
}

const PAGE_STYLES = `
@font-face { font-family: 'Redaction 35'; src: url('${FONTS}Redaction_35-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Redaction 35'; src: url('${FONTS}Redaction_35-Italic.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: 'Redaction 35'; src: url('${FONTS}Redaction_35-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Redaction 70'; src: url('${FONTS}Redaction_70-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Overused Grotesk'; src: url('${FONTS}OverusedGrotesk-Roman.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Overused Grotesk'; src: url('${FONTS}OverusedGrotesk-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Commit Mono'; src: url('${FONTS}CommitMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }

.nl-root {
  --nl-line: ${LINE};
  --nl-100vh: 100svh;
  background: ${PLASTER};
  color: ${INK};
  font-family: ${GROTESK};
  font-kerning: none;
}
.nl-root ::selection { background: ${INK}; color: ${PLASTER}; }
.nl-root h1, .nl-root h2, .nl-root h3, .nl-root p { margin: 0; font-weight: 400; }
.nl-root img { max-width: 100%; }
.nl-root ul { list-style: none; margin: 0; padding: 0; }

.nl-display { font-family: ${DISPLAY}; font-weight: 400; }
.nl-it { font-family: ${DISPLAY}; font-weight: 400; font-style: italic; }
.nl-mono { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; }
.nl-caps { font-family: ${GROTESK}; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; font-weight: 500; }

.nl-root .nl-line { overflow: clip; padding-top: .16em; margin-top: -.16em; padding-bottom: .18em; margin-bottom: -.18em; }
.nl-line > span { display: inline-block; }

.nl-flip { position: relative; overflow: clip; display: block; }
.nl-m { position: absolute; inset: 0; }
.nl-m-up { z-index: 2; }
.nl-m img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.nl-par .nl-m-src img { height: 116%; top: -8%; }
.nl-spec { position: absolute; left: 0; bottom: 0; z-index: 3; display: flex; gap: 1.1em;
  padding: .55em .9em; background: ${PLASTER_SOFT}; color: ${INK};
  border-top: 1px solid var(--nl-line); backdrop-filter: blur(4px); }

.nl-btn { position: relative; display: inline-block; cursor: pointer; white-space: nowrap;
  font-family: ${GROTESK}; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; font-weight: 500;
  padding: calc(.85em - 1.5px) calc(1.9em - 1.5px); border: 1.5px solid currentColor;
  border-radius: calc((.85em - 1.5px) * 3); overflow: hidden; text-decoration: none; }
.nl-btn { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
.nl-btn:active { transform: scale(.97); }
.nl-btn > span { position: relative; display: block; z-index: 2; overflow: clip; }
.nl-btn::before { content: ''; position: absolute; width: 102%; height: 102%; top: 0; left: 0;
  border-radius: inherit; z-index: 1; background: var(--nl-fill, ${INK});
  transform: translate(var(--nl-px, -102%), var(--nl-py, 0%)); }

.nl-under { position: relative; }
.nl-under::after { content: ''; position: absolute; left: 0; bottom: -.1em; width: 100%; height: 1px; background: currentColor; }

.nl-roll { position: relative; display: inline-block; overflow: clip; }
.nl-roll .nl-roll-b { position: absolute; top: 0; left: 0; }
.nl-roll span { display: inline-block; will-change: transform; }

.nl-cursor { position: fixed; top: 0; left: 0; width: .8rem; height: .8rem; z-index: 200;
  pointer-events: none; mix-blend-mode: difference;
  transition: width .33s cubic-bezier(.34,1.56,.64,1), height .33s cubic-bezier(.34,1.56,.64,1); }
.nl-cursor > div { position: relative; width: 100%; height: 100%; transform: translate(-50%,-50%);
  background: ${ACCENT}; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.nl-cursor span { color: #fff; font-family: ${GROTESK}; font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; opacity: 0; white-space: nowrap; transition: opacity .33s cubic-bezier(.34,1.56,.64,1); }
.nl-cursor.is-grown { width: 7.15rem; height: 7.15rem; mix-blend-mode: normal; }
.nl-cursor.is-grown span { opacity: 1; }
.nl-cursor.is-hidden { opacity: 0; }
@media (max-width: 1023px), (pointer: coarse) { .nl-cursor { display: none; } }

.nl-loader { position: fixed; inset: 0; z-index: 120; background: ${INK}; color: ${PLASTER};
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2.2rem; }
.nl-loader-word { font-family: ${DISPLAY}; font-size: clamp(2.4rem, 7vw, 5rem); letter-spacing: .06em; overflow: clip; padding-top: .1em; }
.nl-loader-word span { display: inline-block; }
.nl-loader-bar { position: relative; width: min(46vw, 340px); height: 1px; background: ${HAIR_PLASTER}; }
.nl-loader-bar i { position: absolute; inset: 0; transform-origin: left center; transform: scaleX(0); background: ${ACCENT}; }
.nl-loader-pct { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .18em; color: ${PLASTER_MUTE}; }

/* header: one difference layer. Checked against the photography: the hero is
   plaster, the arrival is glass and sky, the bands are ink; |255 - bg| clears. */
.nl-top { position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.65rem; pointer-events: none;
  mix-blend-mode: difference; color: #FFFFFF; }
.nl-top a, .nl-top button { pointer-events: all; }
.nl-top .nl-wordmark { font-family: ${DISPLAY}; font-size: 1.35rem; letter-spacing: .12em; color: inherit; text-decoration: none; }
.nl-top-links { display: flex; gap: 1.6rem; align-items: center; }
.nl-top-links a { color: inherit; text-decoration: none; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
.nl-top-right { display: flex; align-items: center; gap: .6rem; }
.nl-lang { background: none; border: 1px solid currentColor; color: inherit; cursor: pointer; border-radius: 999px;
  font-family: ${GROTESK}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; padding: .45em .9em; }
@media (max-width: 1023px) { .nl-top-links { display: none; } }

.nl-burger { display: block; position: relative; width: 44px; height: 44px; background: none; border: 0; cursor: pointer; }
.nl-burger i { position: absolute; left: 10px; right: 10px; height: 1.5px; background: currentColor;
  transition: transform .4s cubic-bezier(.32,.72,0,1), top .4s cubic-bezier(.32,.72,0,1); }
.nl-burger i:nth-child(1) { top: 18px; }
.nl-burger i:nth-child(2) { top: 26px; }
.nl-burger[aria-expanded='true'] i:nth-child(1) { top: 22px; transform: rotate(45deg); }
.nl-burger[aria-expanded='true'] i:nth-child(2) { top: 22px; transform: rotate(-45deg); }

.nl-menu { position: fixed; inset: 0; z-index: 55; background: ${INK}; color: ${PLASTER};
  display: flex; flex-direction: column; justify-content: center; padding: 6rem 2rem 3rem; }
.nl-menu-media { display: none; }
@media (min-width: 1024px) {
  .nl-menu { display: grid; grid-template-columns: 38vw 1fr; align-items: center; gap: 6vw; padding: 6rem 5vw 3rem; }
  .nl-menu-media { display: block; position: relative; height: 62svh; overflow: clip;
    clip-path: inset(0 0 0 100%); animation: nlMenuMedia .75s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .nl-menu-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    transform: translateX(35%); animation: nlMenuMediaImg 1.1s cubic-bezier(.16,1,.3,1) .2s forwards; }
  .nl-menu-media figcaption { position: absolute; left: 0; bottom: 0; z-index: 2; padding: .55em .9em;
    background: rgba(18,20,21,.72); color: ${PLASTER}; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; }
  .nl-menu-link { font-size: clamp(2.2rem, 3.6vw, 3.6rem); }
}
@keyframes nlMenuMedia { to { clip-path: inset(0 0 0 0%); } }
@keyframes nlMenuMediaImg { to { transform: translateX(0); } }
.nl-menu-num { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; color: var(--nl-line); margin-right: 1rem; vertical-align: .9em; }
.nl-menu a { color: inherit; text-decoration: none; }
.nl-menu-link { display: block; font-family: ${DISPLAY}; font-size: clamp(2rem, 8vw, 3.2rem); line-height: 1.22; }
.nl-menu-link em { font-style: italic; }
.nl-menu-item { overflow: clip; padding-top: .12em; margin-top: -.06em; padding-bottom: .14em; margin-bottom: -.06em; }
.nl-menu-item > * { display: block; transform: translateY(115%); animation: nlMenuRise .7s cubic-bezier(.16,1,.3,1) forwards; }
.nl-menu-item:nth-child(1) > * { animation-delay: .08s } .nl-menu-item:nth-child(2) > * { animation-delay: .15s }
.nl-menu-item:nth-child(3) > * { animation-delay: .22s } .nl-menu-item:nth-child(4) > * { animation-delay: .29s }
.nl-menu-item:nth-child(5) > * { animation-delay: .36s } .nl-menu-item:nth-child(6) > * { animation-delay: .43s }
@keyframes nlMenuRise { to { transform: translateY(0) } }
.nl-menu-foot { margin-top: auto; display: flex; flex-direction: column; gap: .6rem; }

.nl-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 2px; z-index: 70;
  transform-origin: left center; transform: scaleX(0); background: ${ACCENT}; }

/* ══ THE JOURNEY ══ */
.nl-journey { position: relative; overflow: clip; }
.nl-track { display: flex; width: fit-content; }
.nl-panel { position: relative; height: var(--nl-100vh); flex: none; }

/* hero: the wordmark rests a little behind the house from the start (its own
   foot tucked under a SOFT mask edge, not a shape traced from the photo), and
   sinks further behind it as the journey moves on. Two rounds of tracing the
   real roofline for a clip-path both still read as a bad cutout live; a
   straight mask edge on the PHOTO's own top, faded rather than hard, needs no
   trace at all and works on any photo. */
.nl-hero { width: 100vw; position: relative; overflow: clip; background: ${PLASTER}; }
.nl-hero-word-zone { position: absolute; inset: 0 0 auto 0; height: calc(100% - 42svh + 3.4rem);
  display: flex; align-items: flex-end; justify-content: center; z-index: 1; }
.nl-hero-word { position: relative; font-family: ${DISPLAY}; font-size: min(15.5vw, 34svh); line-height: .82;
  letter-spacing: .01em; white-space: nowrap; color: ${INK}; will-change: transform; }
.nl-hero-word .nl-hero-mask { display: block; overflow: clip; padding-top: .18em; }
.nl-hero-word .nl-hero-mask span { display: inline-block; }
.nl-hero-house { position: absolute; left: 0; right: 0; bottom: 0; height: 42svh; z-index: 2;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 3.4rem);
  mask-image: linear-gradient(180deg, transparent 0, #000 3.4rem); }
.nl-hero-house .nl-flip { position: absolute; inset: 0; }
.nl-hero-hotspots { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.nl-spot { position: absolute; z-index: 3; pointer-events: auto; transform: translate(-50%, -50%); display: flex; align-items: center; gap: .55rem;
  background: none; border: 0; padding: 0; cursor: pointer; color: ${PLASTER}; }
.nl-spot i { position: relative; display: block; width: 12px; height: 12px; border-radius: 50%; background: ${PLASTER};
  box-shadow: 0 0 0 1px rgba(18,20,21,.35); }
.nl-spot i::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid ${PLASTER}; opacity: .7;
  animation: nlPulse 2.4s ease-out infinite; }
@keyframes nlPulse { 0% { transform: scale(.6); opacity: .8; } 100% { transform: scale(1.8); opacity: 0; } }
.nl-spot span { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase;
  padding: .45em .7em; background: rgba(18,20,21,.72); color: ${PLASTER}; backdrop-filter: blur(3px); white-space: nowrap;
  transition: background .3s, color .3s; }
.nl-spot:hover span, .nl-spot:focus-visible span { background: ${PLASTER}; color: ${INK}; }
.nl-hero-kicker { position: absolute; top: calc(1.1rem + 54px); left: 1.65rem; color: ${INK_MUTE}; }
/* sits directly under the kicker, out of the wordmark's own centred band
   (Drangar's spacing, same collision it was written to avoid) */
.nl-hero-sub { position: absolute; left: 1.65rem; top: calc(1.1rem + 5.2rem); max-width: 14rem;
  font-size: .85rem; line-height: 1.5; color: ${INK_SOFT}; }
.nl-hero-rotmenu { position: absolute; top: calc(1.1rem + 54px); right: .55rem; transform-origin: bottom right;
  transform: rotate(-90deg); display: flex; gap: 1.2rem; color: ${INK_MUTE}; white-space: nowrap; }
.nl-hero-rotmenu a { color: inherit; text-decoration: none; }
.nl-hero-copy { position: absolute; left: 1.65rem; bottom: calc(42svh + 1.2rem); color: ${INK_MUTE}; }

/* arrival */
.nl-arrival { width: 76vw; background: ${PLASTER}; }
.nl-arrival-big { position: absolute; inset: 0; }
.nl-arrival-big .nl-flip { position: absolute; inset: 0; }
.nl-arrival-big .nl-m img { width: 114%; max-width: none; }

/* quote */
.nl-reno { width: 120vw; background: ${PLASTER}; }
.nl-reno-fig { position: absolute; left: 4vw; top: 50%; transform: translateY(-50%); width: 34vw; aspect-ratio: 4/3; }
.nl-reno-fig .nl-flip, .nl-reno-fig-sm .nl-flip { position: absolute; inset: 0; }
.nl-reno-copy { position: absolute; left: 44vw; top: 50%; transform: translateY(-50%); width: 38vw; }
.nl-reno-quote { font-size: min(2.5vw, 5.2svh); line-height: 1.24; }
.nl-reno-fig-sm { position: absolute; right: 4vw; bottom: 10svh; width: 22vw; aspect-ratio: 3/4; }

/* statement */
.nl-statement { width: 92vw; display: flex; align-items: center; background: ${PLASTER_2}; color: ${INK}; }
.nl-statement-in { padding: 0 7vw; width: 100%; }
.nl-statement .nl-sline { font-family: ${DISPLAY}; font-size: min(4.1vw, 8.4svh); line-height: 1.08; white-space: nowrap; }
.nl-statement .nl-sline em { font-style: italic; }
.nl-statement .nl-cont { position: relative; display: inline-block; }
.nl-statement-body { max-width: 30rem; margin-top: 2.6rem; color: ${INK_SOFT}; font-size: .85rem; line-height: 1.6; }

/* accordion: three places in a FIXED footprint (3 × 58vw) */
.nl-acc { display: flex; width: 174vw; height: var(--nl-100vh); }
.nl-acc-item { position: relative; width: 58vw; height: 100%; overflow: clip; display: flex; flex-direction: column;
  background: ${PLASTER_2}; color: ${INK}; box-shadow: inset 1px 0 0 ${HAIR_INK}; }
.nl-acc-media { position: relative; height: 60svh; flex: none; overflow: clip; }
.nl-acc-media .nl-flip { position: absolute; inset: 0; }
.nl-acc-body { position: relative; flex: 1; display: flex; align-items: center; padding: 0 3.2vw; overflow: clip; }
.nl-acc-detail { display: none; }
@media (min-width: 1024px) {
  .nl-acc-textwrap { width: 31vw; min-width: 31vw; }
  .nl-acc-detail { display: block; order: 2; width: 12vw; min-width: 12vw; aspect-ratio: 3/4; margin-left: 3vw; align-self: center; overflow: clip; max-height: 34svh; }
  .nl-acc-detail img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.16,1,.3,1); }
  .nl-acc-item:hover .nl-acc-detail img { transform: scale(1.045); }
}
.nl-acc-num { position: absolute; top: 1.2rem; left: 1.4rem; z-index: 3; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .18em; color: #fff; mix-blend-mode: difference; }
.nl-acc-name { font-family: ${DISPLAY}; font-size: min(2.9vw, 2.9rem); line-height: 1; }
.nl-acc-livery { margin-top: .6rem; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--nl-line); }
.nl-acc-list { margin-top: .9rem; }
.nl-acc-list li { display: grid; grid-template-columns: 6.2rem 1fr; gap: .8rem; align-items: baseline; padding: .42em 0; border-top: 1px solid ${HAIR_INK}; font-size: .8rem; line-height: 1.4; }
.nl-acc-list li:last-child { border-bottom: 1px solid ${HAIR_INK}; }
.nl-acc-list .nl-acc-hn { font-family: ${DISPLAY}; font-size: 1.05rem; }
.nl-acc-list .nl-acc-hf { color: ${INK_SOFT}; }
.nl-acc-list .nl-acc-hr { display: inline-block; margin-left: .5em; font-family: ${MONO}; font-size: 9.5px; letter-spacing: .1em; color: var(--nl-line); text-decoration: none; white-space: nowrap; }
.nl-acc-list .nl-acc-hr:hover { text-decoration: underline; }
.nl-acc-cta { margin-top: 1.3rem; }
.nl-acc-textwrap > * { overflow: clip; }
.nl-acc-textwrap .nl-pop { display: block; }

/* farm note */
.nl-shednote { width: 44vw; background: ${PLASTER}; display: flex; align-items: center; }
.nl-shednote-in { padding: 0 6vw; }
.nl-shednote-body { font-size: .95rem; line-height: 1.65; color: ${INK_SOFT}; max-width: 24rem; }

/* materials */
.nl-mat { width: 112vw; background: ${PLASTER}; display: flex; flex-direction: column; justify-content: space-between; padding: 5.5rem 1.65rem 2.2rem; }
.nl-mat-rail { position: absolute; top: 50%; left: 1.1rem; transform: rotate(-90deg) translateY(-50%); transform-origin: center left; color: ${INK_MUTE}; }
.nl-mat-term { position: relative; display: flex; align-items: center; width: 100%; border-top: 1px solid ${HAIR_INK}; padding-top: 1.6svh; padding-bottom: 1.6svh; }
.nl-mat-term:last-of-type { border-bottom: 1px solid ${HAIR_INK}; }
.nl-mat-idx { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; color: var(--nl-line); margin-right: 2vw; min-width: 2.4rem; }
@media (min-width: 1024px) and (hover: hover) {
  .nl-mat-term { cursor: none; }
  .nl-mat-term .nl-mat-title { transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .nl-mat-term:hover .nl-mat-title { transform: translateX(.6vw); }
}
.nl-mat-title { position: relative; z-index: 20; font-family: ${DISPLAY}; font-size: min(7.2vw, 15svh); line-height: .95; mix-blend-mode: difference; }
.nl-mat-title > span { display: inline-block; filter: invert(100%); color: #000000; }
.nl-mat-text { position: relative; width: 19rem; min-width: 19rem; margin-left: 4vw; }
.nl-mat-text-single { font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; }
.nl-mat-stack { position: absolute; width: 24vw; aspect-ratio: 4/3; pointer-events: none; transform: translate(-50%, -50%) scale(0); z-index: 10; overflow: clip; }
.nl-mat-stack img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; --nl-clip: 0% 0% 0% 0%; clip-path: inset(var(--nl-clip)); }
.nl-mat-stack img.is-on { opacity: 1; z-index: 2; }
.nl-mat-stack img.is-prev { opacity: 1; z-index: 1; }

/* the farm: pin-in-pin filmstrip */
.nl-barn { width: 220vw; background: ${INK}; color: ${PLASTER}; overflow: clip; box-shadow: 0 0 0 1px ${INK}; }
.nl-barn-stage { position: absolute; top: 0; left: 0; width: 100vw; height: 100%; will-change: transform; }
.nl-barn-content { position: absolute; top: 0; left: 0; width: 48vw; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 0 0 14vw; }
.nl-barn-title { font-family: ${DISPLAY}; font-size: min(4.8vw, 10svh); line-height: 1; }
.nl-barn-title em { font-style: italic; }
.nl-barn-body { margin-top: 1.6rem; max-width: 24rem; color: ${PLASTER_MUTE}; font-size: .85rem; line-height: 1.6; }
.nl-barn-strip { position: absolute; top: 0; left: 54vw; width: 40vw; will-change: transform; }
.nl-barn-cell { position: relative; height: 44svh; margin-bottom: 2svh; overflow: clip; }
.nl-barn-cell img { width: 100%; height: 100%; object-fit: cover; }
.nl-barn-cell figcaption { position: absolute; left: 0; bottom: 0; z-index: 2; padding: .5em .85em; background: rgba(18,20,21,.72); color: ${PLASTER};
  font-family: ${MONO}; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; }

/* dusk edges: the page goes to night once (the farm and the lights), then to
   walnut, then to ink, and each of those arrives over a slow gradient rather
   than a cut */
.nl-barn::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 12vw; z-index: 5; pointer-events: none;
  background: linear-gradient(90deg, ${PLASTER}, rgba(232,233,230,0)); }
.nl-isl::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 16vw; z-index: 3; pointer-events: none;
  background: linear-gradient(270deg, ${PLASTER}, rgba(232,233,230,0)); }
.nl-cierre::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 16vw; z-index: 1; pointer-events: none;
  background: linear-gradient(90deg, ${PLASTER}, rgba(232,233,230,0)); }
.nl-footer::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 16svh; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, ${ACCENT}, rgba(122,78,46,0)); }

/* the lights, full bleed */
.nl-isl { width: 100vw; position: relative; }
.nl-isl .nl-flip { position: absolute; inset: 0; }
.nl-isl-chip { position: absolute; left: 1.65rem; bottom: 1.65rem; z-index: 4; background: ${INK}; color: ${PLASTER}; padding: 1rem 1.2rem; max-width: 24rem; overflow: clip; }
.nl-isl-line { font-family: ${DISPLAY}; font-size: 1.5rem; line-height: 1.25; }
.nl-isl-line .nl-travel { position: relative; display: inline-block; font-style: italic; color: #C9A27E; }

/* story */
.nl-saga { width: 118vw; background: ${PLASTER}; display: flex; align-items: center; gap: 4vw; padding: 0 5vw; }
.nl-saga-fig { position: relative; width: 46vw; height: 64svh; flex: none; overflow: clip; }
.nl-saga-fig .nl-m-src img { height: 118%; }
.nl-saga-copy { max-width: 30rem; }
.nl-saga-title { font-family: ${DISPLAY_WORN}; font-size: min(4.4vw, 9svh); line-height: 1.02; }
.nl-saga-credit { margin-top: .9rem; color: ${INK_MUTE}; font-size: .8rem; }
.nl-saga-rows { margin-top: 2.2rem; }
.nl-saga-row { display: grid; grid-template-columns: 5rem 1fr; gap: 1.4rem; padding: .78em 0; border-top: 1px solid ${HAIR_INK}; font-size: .85rem; line-height: 1.5; }
.nl-saga-row dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .14em; color: var(--nl-line); padding-top: .25em; }
.nl-saga-row dd { margin: 0; }
.nl-saga-award { margin-top: 1.6rem; font-size: .85rem; line-height: 1.55; color: ${INK_SOFT}; max-width: 26rem; }

/* Grenivík slab */
.nl-summer { width: 100vw; position: relative; }
.nl-summer .nl-flip { position: absolute; inset: 0; }
.nl-summer-chip { position: absolute; right: 1.65rem; bottom: 1.65rem; z-index: 4; background: ${PLASTER_SOFT}; color: ${INK}; padding: .7rem 1rem; }

/* cierre */
.nl-cierre { width: 120vw; background: ${ACCENT}; color: ${PLASTER}; overflow: clip; }
.nl-cierre-in { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 6vw; width: 88vw; }
.nl-cierre-word { font-family: ${DISPLAY}; font-size: min(9.5vw, 21svh); line-height: .96; }
.nl-cierre-row { display: block; white-space: nowrap; }
/* Redaction's glyphs fill their em: the split lines keep their headroom but the
   negative margins that tuck ordinary serifs together would stack these */
.nl-root .nl-cierre-word .nl-line, .nl-root .nl-barn-title .nl-line, .nl-root .nl-saga-title .nl-line { margin-top: 0; margin-bottom: 0; padding-top: .08em; padding-bottom: .1em; }
.nl-cierre-word { line-height: 1.02; }
.nl-cierre-sub { margin-top: 2rem; max-width: 30rem; font-size: .9rem; line-height: 1.5; color: rgba(232,233,230,.85); }
.nl-cierre-ctas { margin-top: 2rem; display: flex; gap: 1.2rem; align-items: center; }
.nl-cierre-strip { position: absolute; top: 8svh; right: -4vw; width: 34vw; height: 30svh; overflow: clip; opacity: .92; }
.nl-cierre-strip img { width: 130%; height: 100%; object-fit: cover; }

/* ══ FOOTER ══ */
.nl-footer { position: relative; background: ${INK}; color: ${PLASTER}; padding: 7rem 1.65rem 2rem; overflow: clip; }
.nl-footer-gable { position: absolute; inset: auto 0 0 0; height: min(38vw, 420px); width: 100%; opacity: .55; pointer-events: none; }
.nl-footer-gable path { fill: none; stroke: #9C6B4A; stroke-width: 1.5; }
.nl-footer-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.2fr 1fr 1.2fr; gap: 3rem; max-width: 1200px; }
.nl-footer h2 { font-family: ${DISPLAY}; font-size: clamp(2.2rem, 4.6vw, 4rem); line-height: 1; }
.nl-footer dl { margin: 0; }
.nl-footer dt { font-family: ${MONO}; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: ${PLASTER_MUTE}; margin-top: 1.2rem; }
.nl-footer dd { margin: .3rem 0 0; font-size: .95rem; }
.nl-footer dd + dd { margin-top: .5rem; color: ${PLASTER_MUTE}; font-size: .85rem; line-height: 1.5; }
.nl-footer a { color: inherit; text-decoration: none; }
.nl-footer-corners { position: relative; z-index: 2; display: flex; justify-content: space-between; margin-top: 5rem; padding-top: 1.2rem; border-top: 1px solid ${HAIR_PLASTER};
  color: ${PLASTER_MUTE}; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; }
.nl-footer-credit { position: relative; z-index: 2; margin-top: 1rem; color: rgba(232,233,230,.4); font-size: 11px; line-height: 1.6; max-width: 46rem; }

/* ══ MOBILE / VERTICAL ══ */
@media (max-width: 1023px) {
  .nl-track { display: block; width: 100%; }
  .nl-panel { height: auto; width: 100% !important; }
  .nl-hero { height: 100svh; padding-bottom: 1rem; }
  /* .nl-root p/h1 zero their margins at higher specificity; match it here */
  .nl-root .nl-hero-kicker { position: absolute; top: 7.4rem; left: 1.65rem; margin: 0; }
  .nl-root .nl-hero-word { font-size: min(19.5vw, 16svh); text-align: center; }
  .nl-hero-word-zone { height: calc(100% - 46svh + 2.2rem); }
  .nl-hero-house { height: 46svh; }
  .nl-root .nl-hero-sub { position: absolute; top: 10.6rem; left: 1.65rem; max-width: 15rem; margin: 0; }
  .nl-hero-rotmenu, .nl-hero-copy { display: none; }
  .nl-spot span { font-size: 9.5px; }
  .nl-arrival { width: 100%; }
  .nl-arrival-big { position: relative; inset: auto; }
  .nl-arrival-big .nl-flip { position: relative; aspect-ratio: 2560/1561; }
  .nl-arrival-big .nl-m img { width: 100%; }
  .nl-reno { width: 100%; padding: 4rem 1.65rem; }
  .nl-reno-fig, .nl-reno-copy, .nl-reno-fig-sm { position: relative; left: auto; right: auto; top: auto; bottom: auto; transform: none; width: 100%; }
  .nl-reno-fig .nl-flip { position: relative; aspect-ratio: 4/3; }
  .nl-reno-copy { margin: 2rem 0; }
  .nl-reno-quote { font-size: 6.4vw; }
  .nl-reno-fig-sm { width: 68%; margin-left: auto; }
  .nl-reno-fig-sm .nl-flip { position: relative; aspect-ratio: 3/4; }
  .nl-statement { padding: 5rem 0; }
  .nl-statement .nl-sline { font-size: 7vw; white-space: normal; }
  .nl-statement-in { padding: 0 1.65rem; }
  .nl-acc { display: block; width: 100%; height: auto; }
  .nl-acc-item { width: 100%; box-shadow: none; }
  .nl-acc-media { height: 52svh; }
  .nl-acc-body { padding: 1.8rem 1.65rem 2.6rem; }
  .nl-acc-name { font-size: 2rem; }
  .nl-acc-list li { grid-template-columns: 5.6rem 1fr; }
  .nl-shednote { width: 100%; }
  .nl-shednote-in { padding: 3.5rem 1.65rem; }
  .nl-mat { width: 100%; padding: 4.5rem 1.65rem; }
  .nl-mat-rail { display: none; }
  .nl-mat-term { flex-direction: column; align-items: flex-start; gap: .9rem; margin-bottom: 2.6rem; }
  .nl-mat-title { font-size: 11vw; mix-blend-mode: normal; }
  .nl-mat-title > span { filter: none; color: ${INK}; }
  .nl-mat-text { width: 100%; min-width: 0; margin-left: 0; }
  .nl-mat-fig-m { width: 100%; aspect-ratio: 4/3; overflow: clip; }
  .nl-mat-fig-m img { width: 100%; height: 100%; object-fit: cover; }
  .nl-barn { width: 100%; }
  .nl-barn-stage { position: static; width: 100%; height: auto; }
  .nl-barn-content { position: static; width: 100%; padding: 4.5rem 1.65rem 1rem; }
  .nl-barn-strip { position: static; width: 100%; padding: 0 1.65rem 3rem; }
  .nl-barn-cell { height: 46svh; margin-bottom: 1rem; }
  .nl-isl { height: 72svh; }
  .nl-summer { height: 62svh; }
  .nl-barn::before { right: 0; bottom: auto; width: auto; height: 14svh; background: linear-gradient(180deg, ${PLASTER}, rgba(232,233,230,0)); }
  .nl-isl::after { left: 0; top: auto; width: auto; height: 14svh; background: linear-gradient(0deg, ${PLASTER}, rgba(232,233,230,0)); }
  .nl-cierre::before { right: 0; bottom: auto; width: auto; height: 14svh; background: linear-gradient(180deg, ${PLASTER}, rgba(232,233,230,0)); }
  .nl-saga { display: block; padding: 4.5rem 1.65rem; }
  .nl-saga-fig { width: 100%; height: 46svh; margin-bottom: 2.2rem; }
  .nl-cierre { padding: 5rem 0; }
  .nl-cierre-in { position: static; width: 100%; padding: 0 1.65rem; }
  .nl-cierre-word { font-size: 15vw; white-space: normal; }
  .nl-cierre-strip { display: none; }
  .nl-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}
@media (min-width: 1024px) {
  .nl-mat-fig-m { display: none; }
  .nl-track { will-change: transform; backface-visibility: hidden; }
}
@media (max-width: 1023px), (pointer: coarse) {
  .nl-btn { padding: calc(1.15em - 1px) calc(2.1em - 1px); }
  .nl-top .nl-wordmark { padding: .55rem .6rem; margin: -.55rem -.6rem; }
  .nl-lang { padding: .7em .9em; font-size: 10px; }
  .nl-footer dd a, .nl-menu-foot a { display: inline-block; padding: .62rem 0; margin: -.42rem 0; }
  .nl-cierre-ctas .nl-under { display: inline-block; padding: .85rem 0; margin: -.55rem 0; }
  .nl-spot { padding: .6rem; }
  .nl-acc-list .nl-acc-hr { display: inline-block; padding: .5rem 0; margin: -.5rem 0; }
}
@media (prefers-reduced-motion: reduce) {
  .nl-cursor, .nl-progress { display: none !important; }
  .nl-menu-item > * { animation: none; transform: none; }
  .nl-roll .nl-roll-b { display: none; }
  .nl-spot i::after { animation: none; }
}
`

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

function Media(props: {
  src: string
  alt: string
  dir?: 'up' | 'left' | 'right'
  spec?: readonly string[]
  cursor?: string
  eager?: boolean
  scrub?: boolean
  className?: string
}) {
  const { src, alt, dir = 'up', spec, cursor, eager, scrub, className } = props
  return (
    <figure
      className={`nl-flip nl-par ${className ?? ''}`}
      data-nl-dir={dir}
      data-nl-scrub={scrub ? '1' : '0'}
      data-cursor={cursor}
      style={{ margin: 0 }}
    >
      <div className="nl-m nl-m-src" aria-hidden="true">
        <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <div className="nl-m nl-m-up">
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {spec && (
        <figcaption className="nl-spec nl-mono">
          {spec.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export default function NollurPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [lang] = useState<Lang>(readLang)
  const t = T[lang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaderDone, setLoaderDone] = useState(() => {
    if (prefersReduced()) return true
    try { return sessionStorage.getItem('nl_seen') === '1' } catch { return false }
  })
  useBodyLock(menuOpen)

  const switchLang = () => {
    const next: Lang = lang === 'en' ? 'de' : 'en'
    try { sessionStorage.setItem('nl_lang', next); sessionStorage.setItem('nl_seen', '1') } catch { /* private mode */ }
    const u = new URL(window.location.href)
    u.searchParams.set('lang', next)
    window.location.href = u.toString()
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    setThemeColor(PLASTER)
    document.title = t.docTitle
    const prevLang = document.documentElement.lang
    document.documentElement.lang = t.htmlLang
    return () => { document.documentElement.lang = prevLang || 'en' }
  }, [t])

  /* preloader, bounded (arm once) */
  const loaderArmed = useRef(false)
  useEffect(() => {
    if (loaderDone || loaderArmed.current) return
    const root = rootRef.current
    if (!root) return
    const word = root.querySelector('.nl-loader-word')
    const bar = root.querySelector<HTMLElement>('.nl-loader-bar i')
    const pct = root.querySelector<HTMLElement>('.nl-loader-pct')
    if (!word || !bar || !pct) return
    loaderArmed.current = true
    const chars = Array.from(word.querySelectorAll('span'))
    gsap.fromTo(chars, { xPercent: 120 }, { xPercent: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out', delay: 0.25 })
    const MIN_HOLD = 1100
    const MAX_HOLD = 2600
    const gate = Array.from(root.querySelectorAll<HTMLImageElement>('.nl-hero img, .nl-arrival img'))
    const settled = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0
    let done = gate.filter(settled).length
    gate.forEach((im) => {
      if (settled(im)) return
      const bump = () => { done += 1; im.removeEventListener('load', bump); im.removeEventListener('error', bump) }
      im.addEventListener('load', bump)
      im.addEventListener('error', bump)
    })
    const started = performance.now()
    let fake = 0
    const iv = window.setInterval(() => {
      const elapsed = performance.now() - started
      const realPct = gate.length ? (done / gate.length) * 100 : 100
      const timePct = (elapsed / MAX_HOLD) * 100
      const target = Math.max(realPct, timePct)
      const capped = elapsed < MIN_HOLD ? Math.min(target, 92) : target
      fake = Math.min(100, Math.max(fake + 1.5, Math.min(fake + 7, capped)))
      bar.style.transform = `scaleX(${fake / 100})`
      pct.textContent = `${Math.round(fake)}%`
      if (fake >= 100) {
        window.clearInterval(iv)
        try { sessionStorage.setItem('nl_seen', '1') } catch { /* private mode */ }
        gsap.to([bar.parentElement, pct], { opacity: 0, duration: 0.4, ease: 'none' })
        gsap.to(root.querySelector('.nl-loader'), { yPercent: -100, duration: 0.9, ease: 'power3.inOut', delay: 0.4, onComplete: () => setLoaderDone(true) })
      }
    }, 16)
    window.setTimeout(() => {
      window.clearInterval(iv)
      try { sessionStorage.setItem('nl_seen', '1') } catch { /* private mode */ }
      setLoaderDone(true)
    }, MAX_HOLD + 3000)
  }, [loaderDone])

  /* the engine */
  useEffect(() => {
    if (!loaderDone) return
    const root = rootRef.current
    if (!root) return
    if (prefersReduced()) return

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const cleanupFns: Array<() => void> = []
    const ctx = gsap.context(() => {
      const TS = 1.15

      const cascade = (el: Element, tl: gsap.core.Timeline, pos: string | number = '<+=.05') => {
        const split = SplitText.create(el, { type: 'lines,chars', linesClass: 'nl-line', charsClass: 'nl-char' })
        split.lines.forEach((line, i) => {
          const from = i % 2 !== 0 ? -110 : 110
          tl.from(line.querySelectorAll('.nl-char'), { yPercent: from, duration: 0.65, stagger: 0.03, ease: 'power3.out' }, i === 0 ? pos : '<+=.05')
        })
      }

      root.querySelectorAll<HTMLElement>('.nl-rollify').forEach((el) => {
        const inner = el.innerHTML
        el.classList.add('nl-roll')
        el.innerHTML = `<span class="nl-roll-a">${inner}</span><span class="nl-roll-b" aria-hidden="true">${inner}</span>`
        const a = el.querySelector('.nl-roll-a') as HTMLElement
        const b = el.querySelector('.nl-roll-b') as HTMLElement
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

      if (fine) {
        root.querySelectorAll<HTMLElement>('.nl-btn').forEach((btn) => {
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
            gsap.fromTo(span, { x: 0, y: 0 }, { x: e.sx[0], y: e.sy[0], duration: 0.33, ease: 'power3.in', onComplete: () => { if (btn.dataset.fillInk) gsap.set(span, { color: btn.dataset.fillInk }) } })
            gsap.fromTo(btn, { '--nl-px': e.px[0], '--nl-py': e.py[0] }, { '--nl-px': '0%', '--nl-py': '0%', duration: 0.25, delay: 0.1, ease: 'power3.in' })
            gsap.fromTo(span, { x: e.sx[1], y: e.sy[1] }, { x: 0, y: 0, duration: 0.33, delay: 0.25, ease: 'power3.out' })
          })
          btn.addEventListener('mouseleave', (ev) => {
            const e = edge(ev as MouseEvent)
            gsap.killTweensOf([btn, span])
            gsap.fromTo(span, { x: 0, y: 0 }, { x: e.sx[1], y: e.sy[1], duration: 0.33, ease: 'power3.in', onComplete: () => { gsap.set(span, { color: '' }) } })
            gsap.fromTo(btn, { '--nl-px': '0%', '--nl-py': '0%' }, { '--nl-px': e.px[1], '--nl-py': e.py[1], duration: 0.25, delay: 0.1, ease: 'power3.in' })
            gsap.fromTo(span, { x: e.sx[0], y: e.sy[0] }, { x: 0, y: 0, duration: 0.33, delay: 0.25, ease: 'power3.out' })
          })
        })
      }

      const armFlips = (container: (t: Element) => ScrollTrigger.Vars) => {
        root.querySelectorAll<HTMLElement>('.nl-flip').forEach((fig) => {
          const up = fig.querySelector('.nl-m-up') as HTMLElement
          const src = fig.querySelector('.nl-m-src img') as HTMLElement
          const inAccordion = !!fig.closest('.nl-acc-media')
          const dir = fig.dataset.nlDir ?? 'up'
          const scrub = fig.dataset.nlScrub === '1' && !inAccordion
          const dur = parseFloat(fig.dataset.nlDur ?? '1.5')
          const clipFrom = dir === 'up' ? 'inset(100% 0% 0% 0%)' : dir === 'right' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(up, { clipPath: clipFrom }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'power2.out', immediateRender: true }, 0)
          tl.from(src, { scale: 1.2, duration: dur + 0.5, ease: 'power2.out' }, 0)
          ScrollTrigger.create({ ...container(fig), animation: tl, ...(scrub ? { scrub: 0.35, end: '+=75%' } : { toggleActions: 'play none none reverse' }) })
          if (!inAccordion && fig.classList.contains('nl-par')) {
            const par = gsap.timeline({ paused: true })
            par.fromTo(src, { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0)
            ScrollTrigger.create({ ...container(fig), animation: par, scrub: 0.5, end: '+=120%' })
          }
        })
      }

      /* hero ceremony, both branches: the word surfaces, the house arrives in
         front of it, the four tags pop */
      const heroIntro = (desktop: boolean) => {
        const intro = gsap.timeline({ paused: true })
        const heroMasks = Array.from(root.querySelectorAll('.nl-hero-mask span'))
        intro.from(heroMasks, { yPercent: 120, duration: 1.1, stagger: { each: 0.06, from: 'center' }, ease: 'power3.out' }, 0.15)
        intro.from(root.querySelectorAll('.nl-spot'), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(2)' }, 1.25)
        const kick = root.querySelector('.nl-hero-kicker')
        if (kick) cascade(kick, intro, 0.55)
        intro.from(root.querySelector('.nl-hero-sub'), { y: 22, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
        if (desktop) {
          intro.from(root.querySelectorAll('.nl-hero-rotmenu a'), { y: '2.5rem', opacity: 0, duration: 1, stagger: -0.15, ease: 'power3.out' }, 0.9)
          intro.from(root.querySelector('.nl-hero-copy'), { opacity: 0, duration: 0.5, ease: 'none' }, 1.1)
        }
        return intro
      }

      if (isDesktop) {
        const lenis = new Lenis()
        pageLenis = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector<HTMLElement>('.nl-journey')!
        const track = root.querySelector<HTMLElement>('.nl-track')!
        gsap.set(root.querySelector('.nl-progress'), { scaleX: 0 })

        const accItems = Array.from(root.querySelectorAll<HTMLElement>('.nl-acc-item'))
        const projectsTl = gsap.timeline({ paused: true })
        const accTextTls: gsap.core.Timeline[] = []
        accItems.forEach((item, i) => {
          const media = item.querySelector('.nl-acc-media') as HTMLElement
          const textwrap = item.querySelector('.nl-acc-textwrap') as HTMLElement
          const pops = Array.from(textwrap.querySelectorAll<HTMLElement>('.nl-pop'))
          const nameChars = SplitText.create(item.querySelector('.nl-acc-name'), { type: 'chars' }).chars
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
        const accFired = accItems.map(() => false)
        const watchAccText = (self: ScrollTrigger) => {
          const tt = self.progress * projectsTl.duration()
          accItems.forEach((_, i) => {
            const at = i * 1 + 0.55
            if (tt >= at && !accFired[i]) { accFired[i] = true; accTextTls[i].pause(); accTextTls[i].timeScale(1).play() }
            else if (tt < at - 0.12 && accFired[i]) { accFired[i] = false; accTextTls[i].pause(); accTextTls[i].timeScale(2.5); accTextTls[i].reverse() }
          })
        }

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
            const bar = root.querySelector<HTMLElement>('.nl-progress')
            if (bar) bar.style.transform = `scaleX(${self.progress})`
          },
        })
        journeyNav = { master, track, lenis }

        const onJourney = (tr: Element, start: string): ScrollTrigger.Vars => ({ trigger: tr, containerAnimation: journeyTween, start })

        /* the wordmark already rests with its foot tucked under the house's
           soft-masked top edge (the CSS overlap); scrolling through the hero
           sends it further down, behind the opaque photo, until it is gone. */
        /* the sink has to finish EARLY: the hero panel is also sliding left as
           the journey advances, and a slow sink spent fighting that sideways
           motion reads as a messy half-hidden, half-shifted word rather than a
           clean disappearance. Ending at -18% closes it while the panel has
           barely moved. */
        const heroPanelEl = root.querySelector<HTMLElement>('.nl-hero')
        const heroWord = root.querySelector<HTMLElement>('.nl-hero-word')
        if (heroPanelEl && heroWord) {
          gsap.fromTo(heroWord, { yPercent: 0 }, {
            yPercent: 130, ease: 'none',
            scrollTrigger: { ...onJourney(heroPanelEl, 'left 0%'), end: 'left -18%', scrub: true },
          })
        }

        ScrollTrigger.create({
          ...onJourney(accItems[0], '0% 80%'),
          animation: projectsTl,
          end: `+=${58 * accItems.length}%`,
          scrub: 0,
          onUpdate: watchAccText,
        })

        const intro = heroIntro(true)
        const arrivalImg = root.querySelector<HTMLElement>('.nl-arrival-big .nl-m-src img')
        if (arrivalImg) {
          gsap.set(arrivalImg, { x: '-4vw' })
          intro.call(() => {
            gsap.to(arrivalImg, {
              x: '-10vw', duration: 1.25, ease: 'power2.out',
              onComplete: () => {
                const handTl = gsap.timeline({ paused: true })
                handTl.fromTo(arrivalImg, { x: '-10vw' }, { x: '0vw', ease: 'none' })
                ScrollTrigger.create({ ...onJourney(root.querySelector('.nl-arrival')!, '0% 78%'), animation: handTl, end: '90% 100%', scrub: 0.5 })
              },
            })
          }, [], 1.2)
        }
        intro.timeScale(TS).play()

        const contEl = root.querySelector<HTMLElement>('.nl-statement .nl-cont')
        if (contEl) {
          const off = contEl.scrollWidth - (contEl.parentElement as HTMLElement).clientWidth
          const stTl = gsap.timeline({ paused: true })
          stTl.from(contEl, { x: off > 0 ? off : 120, duration: 2, ease: 'power1.inOut' }, 0)
          ScrollTrigger.create({ ...onJourney(root.querySelector('.nl-statement')!, '0% 50%'), animation: stTl, end: '100% 50%', scrub: 0 })
        }
        const stBody = root.querySelector('.nl-statement-body p')
        if (stBody) {
          const split = SplitText.create(stBody, { type: 'lines,chars', charsClass: 'nl-char' })
          const opTl = gsap.timeline({ paused: true })
          opTl.fromTo(split.chars, { opacity: 0.25 }, { opacity: 1, duration: 0.5, stagger: 0.005, ease: 'none' })
          ScrollTrigger.create({ ...onJourney(root.querySelector('.nl-statement')!, '0% 70%'), animation: opTl, end: '70% 30%', scrub: 0.5 })
        }
        root.querySelectorAll('.nl-statement .nl-sline').forEach((line, i) => {
          const tl = gsap.timeline({ paused: true })
          cascade(line, tl, 0)
          ScrollTrigger.create({ ...onJourney(root.querySelector('.nl-statement')!, `${i * 4}% 75%`), animation: tl, toggleActions: 'play none none reverse' })
        })

        const renoQuote = root.querySelector('.nl-reno-quote')
        if (renoQuote) {
          const split = SplitText.create(renoQuote, { type: 'lines' })
          const rTl = gsap.timeline({ paused: true })
          rTl.from(split.lines, { opacity: 0.2, duration: 0.2, stagger: 0.1, ease: 'none' })
          ScrollTrigger.create({ ...onJourney(root.querySelector('.nl-reno')!, '0% 75%'), animation: rTl, end: '0% 25%', scrub: 0 })
        }

        const mat = root.querySelector<HTMLElement>('.nl-mat')
        if (mat) {
          gsap.set(mat, { width: mat.offsetWidth })
          const terms = Array.from(mat.querySelectorAll<HTMLElement>('.nl-mat-term'))
          const pTl = gsap.timeline({ paused: true })
          pTl.to(terms[0], { paddingLeft: '8vw', ease: 'none' }, 0)
          pTl.to(terms[1], { paddingRight: '3vw', ease: 'none' }, 0)
          pTl.to(terms[2], { paddingLeft: '11vw', ease: 'none' }, 0)
          if (terms[3]) pTl.to(terms[3], { paddingLeft: '5vw', ease: 'none' }, 0)
          ScrollTrigger.create({ ...onJourney(mat, '0% 100%'), animation: pTl, end: '100% 0%', scrub: 1 })

          const stack = mat.querySelector<HTMLElement>('.nl-mat-stack')!
          const stackImgs = Array.from(stack.querySelectorAll('img'))
          let cur = 0
          terms.forEach((term, i) => {
            term.addEventListener('mouseenter', () => {
              if (cur === i) return
              stackImgs.forEach((im) => im.classList.remove('is-prev'))
              stackImgs[cur].classList.add('is-prev')
              stackImgs[cur].classList.remove('is-on')
              stackImgs[i].classList.add('is-on')
              gsap.fromTo(stackImgs[i], { '--nl-clip': '100% 0% 0% 0%' }, { '--nl-clip': '0% 0% 0% 0%', duration: 1.25, ease: 'power3.out' })
              gsap.fromTo(stackImgs[i], { scale: 2 }, { scale: 1, duration: 2, delay: -0.75, ease: 'power2.out' })
              cur = i
            })
          })
          if (fine && cursorRef.current) {
            mat.addEventListener('mouseenter', () => { cursorSwap(stack) })
            mat.addEventListener('mouseleave', () => { cursorSwap(null) })
          }
        }

        const barn = root.querySelector<HTMLElement>('.nl-barn')
        if (barn) {
          const stage = barn.querySelector<HTMLElement>('.nl-barn-stage')!
          const strip = barn.querySelector<HTMLElement>('.nl-barn-strip')!
          const cells = barn.querySelectorAll<HTMLElement>('.nl-barn-cell').length
          const stripH = cells * 46 - 2
          const yFrom = 10
          const yTo = -(stripH - 100)
          const travel = 120
          const bTl = gsap.timeline({ paused: true })
          bTl.fromTo(stage, { x: '0vw' }, { x: `${travel}vw`, duration: 1, ease: 'none' }, 0)
          bTl.fromTo(strip, { y: `${yFrom}svh` }, { y: `${yTo}svh`, duration: 1, ease: 'none' }, 0)
          ScrollTrigger.create({ ...onJourney(barn, 'left 0%'), animation: bTl, end: `left -${travel}%`, scrub: 0 })
          const bTitle = barn.querySelector('.nl-barn-title')
          if (bTitle) {
            const tl = gsap.timeline({ paused: true })
            cascade(bTitle, tl, 0)
            tl.from(barn.querySelector('.nl-barn-body'), { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<+=.3')
            ScrollTrigger.create({ ...onJourney(barn, 'left 60%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        const isl = root.querySelector<HTMLElement>('.nl-isl')
        if (isl) {
          const travel = isl.querySelector<HTMLElement>('.nl-travel')
          if (travel) {
            const line = travel.closest('.nl-isl-line') as HTMLElement
            const tl = gsap.timeline({ paused: true })
            tl.from(travel, { x: () => line.clientWidth - travel.offsetWidth - travel.offsetLeft, duration: 1.25, ease: 'power2.out' })
            ScrollTrigger.create({ ...onJourney(isl, 'left 55%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        const saga = root.querySelector<HTMLElement>('.nl-saga')
        if (saga) {
          const fig = saga.querySelector<HTMLElement>('.nl-saga-fig')!
          const figImg = fig.querySelector('.nl-m-src img')
          const sTl = gsap.timeline({ paused: true })
          sTl.from(fig, { '--nl-clip': '100% 0% 0% 0%', duration: 2 / 1.4, ease: 'power3.inOut' }, 0)
          sTl.from(figImg, { y: '20%', scale: 1.4, duration: 3 / 1.4, ease: 'power2.out' }, 0)
          sTl.from(fig, { height: '84svh', width: '54vw', duration: 1.25 / 1.4, ease: 'power3.inOut' }, 0.35)
          sTl.from(saga.querySelectorAll('.nl-saga-row'), { y: 24, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, 0.7)
          sTl.from(saga.querySelector('.nl-saga-award'), { opacity: 0, duration: 0.6, ease: 'none' }, 1.1)
          const sTitle = saga.querySelector('.nl-saga-title')
          if (sTitle) cascade(sTitle, sTl, 0.25)
          ScrollTrigger.create({ ...onJourney(saga, 'left 65%'), animation: sTl, toggleActions: 'play none none reverse' })
        }

        const cierre = root.querySelector<HTMLElement>('.nl-cierre')
        if (cierre) {
          const inEl = cierre.querySelector<HTMLElement>('.nl-cierre-in')!
          const cTl = gsap.timeline({ paused: true })
          cTl.fromTo(inEl, { x: '0%' }, { x: '18%', ease: 'none' }, 0)
          ScrollTrigger.create({ ...onJourney(cierre, 'left 0%'), animation: cTl, end: 'left -20%', scrub: 0 })
          const strip = cierre.querySelector<HTMLElement>('.nl-cierre-strip img')
          if (strip) {
            const pTl = gsap.timeline({ paused: true })
            pTl.from(strip, { x: '-24%', ease: 'none' }, 0)
            ScrollTrigger.create({ ...onJourney(cierre, 'left 100%'), animation: pTl, end: 'left 0%', scrub: 0.1 })
          }
          const word = cierre.querySelector('.nl-cierre-word')
          if (word) {
            const tl = gsap.timeline({ paused: true })
            cascade(word, tl, 0)
            tl.from(cierre.querySelector('.nl-cierre-sub'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '<+=.35')
            tl.from(cierre.querySelector('.nl-cierre-ctas'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '<+=.15')
            ScrollTrigger.create({ ...onJourney(cierre, 'left 55%'), animation: tl, toggleActions: 'play none none reverse' })
          }
        }

        armFlips((tr) => {
          const flip = tr as HTMLElement
          const scrubbed = flip.dataset.nlScrub === '1'
          return { trigger: flip, containerAnimation: journeyTween, start: scrubbed ? 'left 100%' : 'left 82%' }
        })
      } else {
        heroIntro(false).timeScale(TS).play()
        const heroWordM = root.querySelector<HTMLElement>('.nl-hero-word')
        if (heroWordM) {
          gsap.fromTo(heroWordM, { yPercent: 0 }, {
            yPercent: 130, ease: 'none',
            scrollTrigger: { trigger: root.querySelector('.nl-hero'), start: 'top top', end: 'bottom top', scrub: true },
          })
        }
        root.querySelectorAll('.nl-statement .nl-sline, .nl-barn-title, .nl-saga-title, .nl-cierre-word').forEach((el) => {
          const tl = gsap.timeline({ paused: true })
          cascade(el, tl, 0)
          ScrollTrigger.create({ trigger: el, start: 'top 82%', animation: tl, toggleActions: 'play none none reverse' })
        })
        root.querySelectorAll('.nl-saga-row, .nl-acc-body, .nl-barn-body, .nl-cierre-sub, .nl-cierre-ctas, .nl-mat-term').forEach((el) => {
          gsap.from(el, { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } })
        })
        root.querySelectorAll<HTMLElement>('.nl-acc-media').forEach((media) => {
          const img = media.querySelector('.nl-m-src img')
          const tl = gsap.timeline({ paused: true })
          if (img) tl.from(img, { scale: 1.4, y: '-12%', ease: 'none' }, 0)
          ScrollTrigger.create({ trigger: media, start: 'top 92%', end: 'top 28%', animation: tl, scrub: 0.25 })
        })
        armFlips((tr) => ({ trigger: tr, start: 'top 85%' }))
      }

      const gable = root.querySelector<SVGPathElement>('.nl-footer-gable path')
      if (gable) {
        const mTl = gsap.timeline({ paused: true })
        mTl.to(gable, { attr: { d: ROOF_FARM }, duration: 1, ease: 'none' })
        ScrollTrigger.create({ trigger: root.querySelector('.nl-footer'), start: 'top 65%', end: 'bottom bottom', animation: mTl, scrub: 2 })
      }
      const foot = root.querySelector('.nl-footer')
      if (foot) {
        gsap.from(foot.querySelectorAll('.nl-footer-grid > *'), { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: foot, start: 'top 70%', toggleActions: 'play none none reverse' } })
      }

      const imgs = Array.from(root.querySelectorAll('img'))
      Promise.allSettled([document.fonts.ready, ...imgs.map((im) => (im as HTMLImageElement).decode?.().catch(() => undefined))]).then(() => { ScrollTrigger.refresh() })

      const fork = window.matchMedia('(min-width: 1024px)')
      const onFork = () => window.location.reload()
      fork.addEventListener('change', onFork)
      cleanupFns.push(() => fork.removeEventListener('change', onFork))
    }, root)

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
      const move = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; speed = cursorSwapRef.el ? 0.1 : 0.2 }
      window.addEventListener('mousemove', move)
      const over = (e: MouseEvent) => {
        const tg = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
        const label = dot.querySelector('span') as HTMLElement
        if (tg && tg.dataset.cursor) { label.textContent = tg.dataset.cursor; dot.classList.add('is-grown') }
        else dot.classList.remove('is-grown')
      }
      window.addEventListener('mouseover', over)
      cursorCleanup = () => { gsap.ticker.remove(tick); window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
    }

    return () => {
      ctx.revert()
      cleanupFns.forEach((fn) => fn())
      cursorCleanup?.()
      if (journeyNav) { journeyNav.lenis.destroy(); journeyNav = null }
      pageLenis = null
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [loaderDone])

  const go = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    if (journeyNav) {
      const { master, track, lenis } = journeyNav
      const panel = el.closest('.nl-panel') as HTMLElement | null
      const target = panel ?? el
      const maxX = track.scrollWidth - window.innerWidth
      const x = Math.min(target.offsetLeft, maxX)
      const scrollY = master.start + (x / maxX) * (master.end - master.start)
      lenis.scrollTo(scrollY, { duration: 1.4 })
    } else {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' }))
    }
  }

  const mailto = (subject: string) => `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}`
  const u = t.places.units

  return (
    <div ref={rootRef} className="nl-root" style={{ minHeight: '100svh' }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {!loaderDone && (
        <div className="nl-loader" role="status" aria-label={t.loading}>
          <div className="nl-loader-word" aria-hidden="true">
            {'NOLLUR'.split('').map((c, i) => <span key={i}>{c}</span>)}
          </div>
          <div className="nl-loader-bar"><i /></div>
          <div className="nl-loader-pct">0%</div>
        </div>
      )}

      <div className="nl-cursor" ref={cursorRef} aria-hidden="true"><div><span /></div></div>
      <div className="nl-progress" aria-hidden="true" />

      <header>
        <div className="nl-top">
          <a href="#top" className={`nl-wordmark ${FOCUS}`} onClick={(e) => { e.preventDefault(); go('top') }}>Nollur</a>
          <nav className="nl-top-links" aria-label={lang === 'de' ? 'Hauptmenü' : 'Main menu'}>
            {t.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`nl-rollify ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>{n.label}</a>
            ))}
          </nav>
          <div className="nl-top-right">
            <button type="button" className={`nl-lang ${FOCUS}`} onClick={switchLang} lang={lang === 'en' ? 'de' : 'en'} aria-label={lang === 'en' ? 'Auf Deutsch lesen' : 'Read in English'}>
              {t.switchLabel}
            </button>
            <button className={`nl-burger ${FOCUS}`} aria-expanded={menuOpen} aria-label={menuOpen ? t.menuClose : t.menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <i /><i />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="nl-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <figure className="nl-menu-media" aria-hidden="true" style={{ margin: 0 }}>
            <img src={IMG.menuNight} alt="" />
            <figcaption>{t.menuCaption}</figcaption>
          </figure>
          <nav>
            {t.nav.slice(0, 4).map((n, i) => (
              <div className="nl-menu-item" key={n.id}>
                <a href={`#${n.id}`} className={`nl-menu-link ${FOCUS}`} onClick={(e) => { e.preventDefault(); go(n.id) }}>
                  <span className="nl-menu-num" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  {n.label}
                </a>
              </div>
            ))}
            <div className="nl-menu-item">
              <a href={mailto('Nollur')} className={`nl-menu-link ${FOCUS}`}><em>{t.menuWrite}</em></a>
            </div>
          </nav>
          <div className="nl-menu-foot nl-caps">
            <a href={EMAIL_HREF} className={FOCUS}>{EMAIL}</a>
            <a href={CAMERAS} target="_blank" rel="noreferrer" className={FOCUS}>{t.footer.cameras}</a>
          </div>
        </div>
      )}

      <main id="top">
        <div className="nl-journey">
          <div className="nl-track">

            {/* 1 ── HERO: the wordmark on its own ground, the house right below it */}
            <section className="nl-panel nl-hero" aria-label="Nollur">
              <p className="nl-hero-kicker nl-caps">{t.hero.kicker}</p>
              <div className="nl-hero-word-zone">
                <h1 className="nl-hero-word" aria-label="Nollur">
                  <span className="nl-hero-mask" aria-hidden="true">
                    {'NOLLUR'.split('').map((c, i) => <span key={i}>{c}</span>)}
                  </span>
                </h1>
              </div>
              <div className="nl-hero-house">
                <Media src={IMG.heroHouse} alt={lang === 'de' ? 'Hrafnabjörg von der Einfahrt aus: ein Glaskörper über Schiefer und Walnuss, dahinter die Berge' : 'Hrafnabjörg from the drive: a glass box over shale and walnut, the mountains behind'} dir="up" eager />
                <div className="nl-hero-hotspots" aria-hidden="false">
                  {HOTSPOTS.map((h) => (
                    <button key={h.key} type="button" className={`nl-spot ${FOCUS}`} style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }} onClick={() => go('materials')} aria-label={t.hero.spot[h.key]}>
                      <i /><span>{t.hero.spot[h.key]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="nl-hero-sub">{t.hero.sub}</p>
              <nav className="nl-hero-rotmenu nl-caps" aria-label={lang === 'de' ? 'Direktlinks' : 'Shortcuts'}>
                {t.hero.rot.map((r) => (
                  <a key={r.id} href={`#${r.id}`} className={FOCUS} onClick={(e) => { e.preventDefault(); go(r.id) }}>{r.label}</a>
                ))}
              </nav>
              <p className="nl-hero-copy nl-mono" aria-hidden="true">{t.hero.copyright}</p>
            </section>

            {/* 1b ── ARRIVAL: through the glass to the town */}
            <section className="nl-panel nl-arrival" aria-label={t.arrival.spec.join(', ')}>
              <div className="nl-arrival-big">
                <Media src={IMG.arrivalView} alt={t.arrival.alt} dir="up" spec={t.arrival.spec} cursor={t.cursor.view} eager />
              </div>
            </section>

            {/* 2 ── STATEMENT */}
            <section className="nl-panel nl-statement" aria-label={lang === 'de' ? 'Über Nollur' : 'About Nollur'}>
              <div className="nl-statement-in">
                {t.statement.lines.map((line, i) => (
                  <h2 className="nl-sline nl-display" key={i}>
                    {i === 3 ? <span className="nl-cont">{line}</span> : i === t.statement.emIndex ? (
                      <>{t.statement.emBefore}<em>{t.statement.emText}</em></>
                    ) : line}
                  </h2>
                ))}
                <div className="nl-statement-body"><p>{t.statement.body}</p></div>
              </div>
            </section>

            {/* 2b ── IN THEIR OWN WORDS */}
            <section className="nl-panel nl-reno" aria-label={t.quote.attribution}>
              <div className="nl-reno-fig"><Media src={IMG.quoteChair} alt={t.quote.alt1} dir="up" /></div>
              <div className="nl-reno-copy">
                <p className="nl-reno-quote nl-display">{t.quote.text}</p>
                <p className="nl-caps" style={{ color: INK_MUTE, marginTop: '1.3rem' }}>{t.quote.attribution}</p>
              </div>
              <div className="nl-reno-fig-sm"><Media src={IMG.quoteTub} alt={t.quote.alt2} dir="right" /></div>
            </section>

            {/* 3 ── THE THREE PLACES, accordion */}
            <section className="nl-panel" id="houses" aria-label={t.nav[0].label} style={{ width: 'auto' }}>
              <div className="nl-acc">
                {PLACES.map((p) => {
                  const tp = t.places[p.id]
                  const houses = HOUSES.filter((h) => h.place === p.id)
                  return (
                    <article key={p.id} className="nl-acc-item">
                      <div className="nl-acc-num">{p.num} / NOLLUR</div>
                      <div className="nl-acc-media">
                        <Media src={p.media} alt={p.photoAlt[lang]} dir={Number(p.num) % 2 ? 'right' : 'up'} scrub cursor={t.cursor.view} />
                      </div>
                      <div className="nl-acc-body">
                        <figure className="nl-acc-detail" style={{ margin: 0 }}>
                          <img src={p.detail} alt={p.detailAlt[lang]} loading="eager" decoding="async" />
                        </figure>
                        <div className="nl-acc-textwrap">
                          <h3 className="nl-acc-name nl-display">{tp.name}</h3>
                          <div style={{ overflow: 'clip' }}><span className="nl-pop nl-acc-livery">{tp.sub}</span></div>
                          <div style={{ overflow: 'clip' }}>
                            <ul className="nl-pop nl-acc-list">
                              {houses.map((h) => (
                                <li key={h.id}>
                                  <span className="nl-acc-hn">{h.name}</span>
                                  <span className="nl-acc-hf">
                                    {h.m2} {u.m2} · {h.beds} {u.beds} · {h.baths} {u.bath} · {u.sleeps} {h.sleeps}
                                    {h.vrbo && h.rating && (
                                      <a className={`nl-acc-hr ${FOCUS}`} href={h.vrbo} target="_blank" rel="noreferrer">{h.rating} {u.rating}</a>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ overflow: 'clip' }}>
                            <span className="nl-pop nl-acc-cta">
                              <a href={mailto(`${tp.name} · Nollur`)} className={`nl-btn ${FOCUS}`} style={{ ['--nl-fill' as string]: INK, color: 'inherit' }} data-cursor={t.cursor.book} data-fill-ink={PLASTER}>
                                <span>{t.places.cta}</span>
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="nl-spec nl-mono" style={{ position: 'absolute', right: 0, bottom: 0, left: 'auto', background: 'transparent', borderTop: `1px solid ${HAIR_INK}`, color: 'inherit' }}>
                          {tp.plate.map((s) => <span key={s}>{s}</span>)}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 3b ── WHERE IS NOLLUR, their paragraph */}
            <section className="nl-panel nl-shednote" aria-label={t.farmNote.kicker}>
              <div className="nl-shednote-in">
                <p className="nl-caps" style={{ color: INK_MUTE, marginBottom: '1rem' }}>{t.farmNote.kicker}</p>
                <p className="nl-shednote-body">{t.farmNote.body}</p>
              </div>
            </section>

            {/* 4 ── MATERIALS */}
            <section className="nl-panel nl-mat" id="materials" aria-label={t.nav[1].label}>
              <p className="nl-mat-rail nl-caps">{t.materials.rail}</p>
              {t.materials.items.map((m, i) => (
                <div className="nl-mat-term" key={m.title}>
                  <span className="nl-mat-idx" aria-hidden="true">({String(i + 1).padStart(2, '0')})</span>
                  <h3 className="nl-mat-title"><span>{m.title}</span></h3>
                  <div className="nl-mat-text"><p className="nl-mat-text-single is-on">{m.body}</p></div>
                  <div className="nl-mat-fig-m">
                    <img src={[IMG.matWalnut, IMG.matShale, IMG.matGlass, IMG.matRevox][i]} alt={m.alt} loading="lazy" />
                  </div>
                </div>
              ))}
              <div className="nl-mat-stack" aria-hidden="true">
                {[IMG.matWalnut, IMG.matShale, IMG.matGlass, IMG.matRevox].map((src, i) => (
                  <img key={src} src={src} alt="" className={i === 0 ? 'is-on' : ''} loading="eager" decoding="async" />
                ))}
              </div>
            </section>

            {/* 5 ── THE FARM, pin-in-pin filmstrip */}
            <section className="nl-panel nl-barn" id="farm" aria-label={t.nav[2].label}>
              <div className="nl-barn-stage">
                <div className="nl-barn-content">
                  <h2 className="nl-barn-title nl-display"><em>{t.farm.title}</em>{t.farm.titleTail}</h2>
                  <p className="nl-barn-body">{t.farm.body}</p>
                </div>
                <div className="nl-barn-strip">
                  {[IMG.nfKaldDeck, IMG.nfKrysDusk, IMG.nfFnjoLiving, IMG.nfSulurKitchen].map((src, i) => (
                    <figure className="nl-barn-cell" key={src} style={{ margin: 0 }}>
                      <img src={src} alt={t.farm.alts[i]} loading="eager" decoding="async" />
                      <figcaption>{t.farm.caps[i]}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* 6 ── THE LIGHTS */}
            <section className="nl-panel nl-isl" aria-label={t.lights.kicker}>
              <Media src={IMG.townAurora} alt={t.lights.alt} dir="right" scrub />
              <div className="nl-isl-chip">
                <p className="nl-caps" style={{ color: PLASTER_MUTE, marginBottom: '.5rem' }}>{t.lights.kicker}</p>
                <p className="nl-isl-line">
                  {t.lights.before}<span className="nl-travel">{t.lights.travel}</span>{t.lights.after}
                </p>
              </div>
            </section>

            {/* 7 ── THE STORY */}
            <section className="nl-panel nl-saga" id="story" aria-label={t.nav[3].label}>
              <div className="nl-saga-fig nl-flip nl-par" data-nl-dir="up">
                <div className="nl-m nl-m-src"><img src={IMG.sagaHouse} alt="" loading="eager" decoding="async" /></div>
                <div className="nl-m nl-m-up"><img src={IMG.sagaHouse} alt={t.story.alt} loading="eager" decoding="async" /></div>
              </div>
              <div className="nl-saga-copy">
                <h2 className="nl-saga-title">{t.story.title}</h2>
                <p className="nl-saga-credit">{t.story.credit}</p>
                <dl className="nl-saga-rows">
                  {t.story.rows.map((r) => (
                    <div className="nl-saga-row" key={r.year}><dt>{r.year}</dt><dd>{r.text}</dd></div>
                  ))}
                </dl>
                <p className="nl-saga-award">{t.story.award}</p>
              </div>
            </section>

            {/* 7b ── GRENIVÍK slab */}
            <section className="nl-panel nl-summer" aria-label={t.grenivik.kicker}>
              <Media src={IMG.grLawn} alt={t.grenivik.alt} dir="up" scrub />
              <div className="nl-summer-chip nl-caps">{t.grenivik.kicker}</div>
            </section>

            {/* 8 ── CIERRE */}
            <section className="nl-panel nl-cierre" aria-label={t.cierre.cta}>
              <div className="nl-cierre-in">
                <h2 className="nl-cierre-word">
                  <span className="nl-cierre-row">{t.cierre.a}</span>
                  <span className="nl-cierre-row"><em className="nl-it">{t.cierre.b}</em></span>
                </h2>
                <p className="nl-cierre-sub">{t.cierre.sub}</p>
                <div className="nl-cierre-ctas">
                  <a href={mailto('Nollur')} data-cursor={t.cursor.book} className={`nl-btn ${FOCUS}`} style={{ ['--nl-fill' as string]: PLASTER, color: PLASTER }} data-fill-ink={ACCENT}>
                    <span>{t.cierre.cta}</span>
                  </a>
                  <a href={CAMERAS} target="_blank" rel="noreferrer" className={`nl-under ${FOCUS}`} style={{ color: PLASTER, textDecoration: 'none', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase' }}>
                    {t.cierre.cta2}
                  </a>
                </div>
              </div>
              <div className="nl-cierre-strip" aria-hidden="true">
                <img src={IMG.cierreDrive} alt="" loading="eager" decoding="async" />
              </div>
            </section>
          </div>
        </div>

        <footer className="nl-footer" id="contact">
          <svg className="nl-footer-gable" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
            <path d={ROOF_VILLA} />
          </svg>
          <div className="nl-footer-grid">
            <div><h2>{t.footer.h2a}<br />{t.footer.h2b}</h2></div>
            <dl>
              <dt>{t.footer.write}</dt>
              <dd><a className={`nl-rollify ${FOCUS}`} href={EMAIL_HREF}>{EMAIL}</a></dd>
              <dt>{t.footer.cameras}</dt>
              <dd><a className={`nl-rollify ${FOCUS}`} href={CAMERAS} target="_blank" rel="noreferrer">{t.footer.camerasLabel}</a></dd>
              <dt>{t.footer.panorama}</dt>
              <dd><a className={`nl-rollify ${FOCUS}`} href={PANORAMA} target="_blank" rel="noreferrer">{t.footer.panoramaLabel}</a></dd>
            </dl>
            <dl>
              <dt>{t.footer.find}</dt>
              {t.footer.places.map((p) => <dd key={p}>{p}</dd>)}
            </dl>
          </div>
          <div className="nl-footer-corners">
            <span>{t.footer.cornerA}</span>
            <span>{t.footer.cornerB}</span>
          </div>
          <p className="nl-footer-credit">{t.footer.credit}</p>
        </footer>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
