import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin } from 'lucide-react'
import { companyEntry } from './data'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADMISSION, CONTACT, CONTACT_SHEET, EXHIBITIONS, GRIPIR, HOURS, IMG, JSON_LD, LINKS, META,
  PROJECTS, STRATA, TIMELINE, openState,
} from './data'
import type { OpenState } from './data'

const company = companyEntry

/* ── JARÐLÖG (strata) ─────────────────────────────────────────────────────
   One continuous dig. The hero peels three strata of the museum's own TIME
   (2026 · 1943 · 1942, all real dates from saga-safnsins) off the Sjálfbær
   eining photograph; every section below keeps digging: layer-numbered
   section heads with accumulating depth ticks, small --clip peels echoing
   the hero, a timeline rule that draws downward, and a footer that closes
   like an excavation window (ERA aperture, inset(8% 22%)).

   Engine: the Heklusýn/westfjords architecture, renamed mj- and library-free
   on purpose (no GSAP, no Lenis): ONE shared rAF loop, all READS first into
   closures, then all WRITES; no per-frame setState anywhere. Peels move a
   clip-path inset custom value only, never a translated duplicate of the
   same photo (the Búðir flip-frame bug). The hero wordmark uses the Búðir
   hue-heading recipe verbatim: mix-blend-mode: difference over a photo
   pre-filtered saturate(.5) contrast(1.03) brightness(.96).

   Resting discipline: WITHOUT the .mj-js class (scripts dead) and under
   prefers-reduced-motion the page rests fully excavated: photo + wordmark +
   eyebrow visible, strata gone, timeline rule drawn, aperture open. ────── */

const GROUND = '#16130F' /* warm soot black — locked token */
const GROUND_DEEP = '#1D1710' /* one step warmer, footer band */
const TEXT = '#EDE6DA' /* warm off-white on soot ≈ 13.9:1 */
const MUT = 'rgba(237,230,218,.62)'
const SIENNA = '#9C6346' /* sampled from grunnsyning-sjalfbaer.jpg — LARGE type, hairlines, chips only */
const SIENNA_DEEP = '#793E2E' /* sampled deep variant — fills under light text */
const HAIR = 'rgba(156,99,70,.32)' /* sienna hairline does ALL structural separation */
const HAIR_STRONG = 'rgba(156,99,70,.55)'
const OPEN_DOT = '#7CA26B'
const CLOSED_DOT = '#C0584A'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const BASE = import.meta.env.BASE_URL
const F_CABINET = `${BASE}fonts/cabinet-grotesk/fonts`
const F_SENTIENT = `${BASE}fonts/sentient`
/* 'Cabinet Grotesk Var' is OURS and holds the variable face alone, so the
   wght axis can never be outranked by a same-family static (see the
   @font-face comment). Behind it: the self-hosted statics, then the
   Fontshare 'Cabinet Grotesk' index.html already loads, then the system. */
const DISPLAY = "'Cabinet Grotesk Var', 'Cabinet Grotesk Static', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif"
const SERIF = "'Sentient', ui-serif, Georgia, serif"

/* faint SVG turbulence grain, tinted by the band behind it — no fabricated
   soil photo, per the brief: the strata are CSS layers from sampled tones */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

/* the three strata tints: soot at the surface, deep sienna at the bottom of
   the dig — every stop stays inside the sampled soot→sienna family */
const STRATA_BG = [
  'linear-gradient(180deg, #1A1610 0%, #16130F 52%, #1E1811 100%)',
  'linear-gradient(180deg, #221A11 0%, #281E13 55%, #2F2115 100%)',
  'linear-gradient(180deg, #2F2013 0%, #3B2717 50%, #4C2F1D 100%)',
]

/* rest-state pre-peel (% bottom inset per band): thin slivers of the deeper
   strata show at the bottom of the viewport before the first wheel input,
   so the dig is telegraphed in the still frame */
const PEEK = [8, 4, 0]

const CSS = `
  @font-face {
    font-family: 'Cabinet Grotesk Static';
    src: url('${F_CABINET}/CabinetGrotesk-Regular.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Regular.woff') format('woff');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Cabinet Grotesk Static';
    src: url('${F_CABINET}/CabinetGrotesk-Medium.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Medium.woff') format('woff');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Cabinet Grotesk Static';
    src: url('${F_CABINET}/CabinetGrotesk-Extrabold.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Extrabold.woff') format('woff');
    font-weight: 800; font-style: normal; font-display: swap;
  }
  /* ── the variable axis (wght 100..900) — the whole excavated-weight device
     lives here, so it MUST be the face that actually gets selected, and it
     CANNOT be called 'Cabinet Grotesk'.
     MEASURED, not assumed: index.html (a shared file, not ours to touch)
     already pulls cabinet-grotesk@400,500,700,800 from the Fontshare CDN
     under exactly that family name. Whenever a static face matches the
     requested weight EXACTLY, Chrome picks it over a variable range in the
     same family, and font-variation-settings on a static face is a silent
     no-op. Probed on the real heading at 64.8px: font-weight 800 rendered
     683.72px wide at 'wght' 100 AND at 'wght' 900 (dead axis), while
     font-weight 900 — the one weight the CDN does not ship — correctly moved
     641.16px to 693.86px. Hence a private family name here: this face is the
     only member of 'Cabinet Grotesk Var', so nothing can outrank it, and the
     self-hosted statics plus the CDN family stay behind it in the stack as a
     real fallback if this file ever fails to load. ── */
  @font-face {
    font-family: 'Cabinet Grotesk Var';
    src: url('${F_CABINET}/CabinetGrotesk-Variable.woff2') format('woff2');
    font-weight: 100 900; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${F_SENTIENT}/Sentient-Light.woff2') format('woff2');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${F_SENTIENT}/Sentient-Regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }

  /* registered custom property: --mj-clip is the ONLY thing a peel ever
     animates (never a translated duplicate) */
  @property --mj-clip { syntax: '<percentage>'; inherits: false; initial-value: 0%; }

  .mj-page { overflow-x: clip; }
  .mj-page ::selection { background: ${SIENNA_DEEP}; color: ${TEXT}; }
  .mj-page a:focus-visible, .mj-page button:focus-visible, .mj-page [tabindex]:focus-visible {
    outline: 2px solid ${SIENNA}; outline-offset: 2px;
  }
  @media (prefers-reduced-motion: no-preference) {
    html:has(.mj-page) { scroll-behavior: smooth; }
  }

  .mj-skip {
    position: absolute; left: 12px; top: -60px; z-index: 100;
    background: ${SIENNA_DEEP}; color: ${TEXT}; padding: 12px 20px;
    font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
    transition: top .2s ease;
  }
  .mj-skip:focus-visible { top: 12px; }

  /* ── drift frames (Heklusýn engine): image drifts INSIDE a fixed frame.
     --dz is DERIVED from the drift value, never hardcoded. ── */
  .mj-frame { position: relative; overflow: hidden; width: 100%; }
  .mj-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
  .mj-frame-in > img { width: 100%; height: 100%; object-fit: cover; }

  /* ── text mask reveal. Resting state is VISIBLE: the hidden start exists
     only under .mj-js, so dead scripts can never strand the copy.
     .22em headroom is load-bearing BOTH WAYS: g/j/þ descenders clip below,
     and the acute tips of Ó Á Ý Ú clip above at display scale without it
     (the descender-clip trap, shipped once — and its ascender mirror). ── */
  .mj-mask {
    display: block; overflow: hidden;
    padding-bottom: 0.22em; margin-bottom: -0.22em;
    padding-top: 0.22em; margin-top: -0.22em;
  }
  .mj-js .mj-mask > .mj-mask-in { transform: translateY(132%); }
  .mj-js .mj-mask.is-in > .mj-mask-in {
    transform: translateY(0);
    transition: transform 1.05s ${EASE};
  }

  @keyframes mj-rise {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mj-js .mj-reveal { opacity: 0; transform: translateY(26px); }
  .mj-js .mj-reveal.is-in { animation: mj-rise 0.9s ${EASE} both; }

  /* ── the strata bands: full-cover layers whose clip-path bottom inset is
     driven 0% → 100% by the shared rAF job. Visible only under .mj-js;
     the resting state is always the fully excavated photo. ── */
  .mj-stratum {
    position: absolute; inset: 0; visibility: hidden;
    will-change: clip-path; clip-path: inset(0 0 0 0);
  }
  .mj-js .mj-stratum { visibility: visible; }
  .mj-stratum::before {
    content: ''; position: absolute; inset: 0;
    background-image: ${GRAIN}; opacity: .16; pointer-events: none;
  }
  .mj-stratum::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(180deg,
      rgba(237,230,218,.022) 0 1px, transparent 1px 16px);
  }
  /* the year slot: one anchor for all three bands, measured off the wordmark
     at runtime (--mj-strata-top). The percentage is only the pre-measure
     fallback for the frame before the effect runs. */
  .mj-strata-label {
    left: clamp(1.25rem, 5vw, 4rem);
    top: var(--mj-strata-top, 22%);
  }
  .mj-strata-edge {
    position: absolute; left: 0; right: 0; top: 100%; height: 2px;
    background: ${HAIR_STRONG};
    box-shadow: 0 3px 14px rgba(0,0,0,.55);
    opacity: 0; will-change: top, opacity;
  }

  /* ── hero wordmark: the Búðir hue-heading recipe. The photo beneath is
     pre-filtered so the difference-invert stays a controlled tonal hue. ── */
  .mj-hero-photo img { filter: saturate(.5) contrast(1.03) brightness(.89); }
  .mj-hero-title { mix-blend-mode: difference; color: ${TEXT}; }

  /* eyebrow + CTAs resolve as the strata clear; without JS they rest visible.
     visibility rides the same scrub as opacity so the hidden CTAs are never
     clickable or focusable before the dig reveals them */
  .mj-js .mj-hero-late { opacity: 0; visibility: hidden; transform: translateY(16px); will-change: opacity, transform; }
  .mj-hero-cue { will-change: opacity; }

  .mj-hero-outer { height: 100svh; }
  @media (prefers-reduced-motion: no-preference) {
    .mj-js .mj-hero-outer { height: 250svh; }
  }

  /* ── section peel: the hero's motion echoed quietly. A tinted stratum
     overlay clips away (clip-path only, never a moved duplicate) when the
     frame enters the viewport. Exists only under .mj-js. ── */
  .mj-peel {
    display: none; position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: linear-gradient(180deg,
      #241A12 0%, #241A12 calc(5% - 1px),
      rgba(156,99,70,.55) calc(5% - 1px), rgba(156,99,70,.55) 5%,
      #2F2115 60%, #3B2717 100%);
    clip-path: inset(0 0 var(--mj-clip) 0); will-change: clip-path;
  }
  .mj-peel::before {
    content: ''; position: absolute; inset: 0;
    background-image: ${GRAIN}; opacity: .15;
  }
  .mj-js .mj-peel { display: block; }
  /* the dig STOPS at 95%: a 5% soil ledge with a sienna face line is left
     resting on the top edge of every photograph. Hover brushes the last of
     it off (see the hover gate). Nothing here ever moves a duplicate. */
  .mj-js .mj-peel.is-dug {
    --mj-clip: 95%;
    transition: --mj-clip 1.2s ${EASE} .12s;
  }
  /* a coarse pointer has no hover to brush the last of it off, so the ledge
     would sit on the top 5% of every photograph forever (it hid the printed
     header of the exhibition poster). There, the dig simply finishes. */
  @media (hover: none), (pointer: coarse) {
    .mj-js .mj-peel.is-dug { --mj-clip: 100%; }
  }

  /* ── timeline rule as a CORE SAMPLE: not a hairline but an extracted
     column. It draws downward (scaleY) AND widens out of the ground
     (scaleX) as the reader descends, and it is banded with the sampled
     strata tints at the real vertical position of each dated stop, so the
     bands are the years. Band boundaries are measured from the rendered
     stops, never guessed. ── */
  /* the column has to be wide enough to READ as strata: at 5px the measured
     banding and its 3.5px boundary ticks were invisible sophistication and
     the whole thing read as one sienna hairline. 11px is exactly the width
     of the year markers, so the core runs behind them like a real sample. */
  .mj-tl-base, .mj-tl-rule { width: 7px; left: 2px; }
  @media (min-width: 768px) { .mj-tl-base, .mj-tl-rule { width: 11px; left: 0; } }
  .mj-tl-base { background: rgba(156,99,70,.14); }
  /* the draw is a CLIP, not a scaleY: a scaled column would squash its own
     bands and the tints would stop lining up with the years they belong to.
     scaleX is the only transform, so the core widens as it is pulled. */
  .mj-tl-rule {
    transform-origin: top center; transform: scaleX(1); clip-path: inset(0 0 0 0);
    will-change: transform, clip-path; background: ${SIENNA};
  }
  .mj-js .mj-tl-rule { transform: scaleX(.34); clip-path: inset(0 0 100% 0); }
  .mj-tl-dot { background: ${SIENNA}; transition: background .45s ease; }
  .mj-js .mj-tl-dot { background: ${GROUND}; }

  /* ── footer aperture (ERA Phase 14): the clipping wrapper closes toward
     inset(8% 22%) as the page ends. Resting/no-JS state: open. ── */
  .mj-ap { will-change: clip-path; }

  /* ── gripur strip: native horizontal scroll, snap, styled scrollbar ── */
  .mj-strip {
    overflow-x: auto; scroll-snap-type: x mandatory;
    /* snap aligns to the scrollport edge, not the padding box — without this
       the first card snaps flush to x:0 and swallows the inline padding */
    scroll-padding-inline: 1.25rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-color: ${SIENNA_DEEP} rgba(237,230,218,.08);
    scrollbar-width: thin;
  }
  @media (min-width: 768px) { .mj-strip { scroll-padding-inline: 2.5rem; } }
  .mj-strip::-webkit-scrollbar { height: 6px; }
  .mj-strip::-webkit-scrollbar-track { background: rgba(237,230,218,.08); }
  .mj-strip::-webkit-scrollbar-thumb { background: ${SIENNA_DEEP}; }

  /* ── link vocabulary: sienna underline wipes in from the left ── */
  .mj-ul { position: relative; text-decoration: none; }
  .mj-ul::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
    background: ${SIENNA}; transform: scaleX(0); transform-origin: left center;
  }
  /* focus-visible ONLY out here. The :hover branch lives in the pointer gate
     below, or a touch tap leaves this underline drawn permanently. */
  .mj-ul:focus-visible::after { transform: scaleX(1); }

  /* ── link rows: a sienna hairline wipes in from the left under the row,
     the label steps right, the arrow slides. Focus gets the same wipe so a
     keyboard user is never worse off than a mouse. ── */
  .mj-row { position: relative; transition: background .35s ease; }
  .mj-row::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
    background: ${SIENNA}; transform: scaleX(0); transform-origin: left center;
    transition: transform .55s ${EASE};
  }
  .mj-row:focus-visible::after { transform: scaleX(1); }
  .mj-row-label { transition: transform .45s ${EASE}; }

  /* no letter-spacing on hover: tracking is a LAYOUT property, and in a
     right-aligned row it slid the pill's left edge 4px out from under a
     stationary cursor. Background + brightness carry the state on the
     compositor, like every other hover on this page. */
  .mj-cta { transition: background .3s ease, filter .3s ease, border-color .3s ease; }

  /* ── credits line: resting state is the full muted register (never dimmed
     below readable), hover lifts it into the off-white and draws a hairline
     under it ── */
  .mj-panel-credits { position: relative; transition: color .4s ease, transform .4s ${EASE}; }
  .mj-panel-credits::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px;
    background: ${HAIR_STRONG}; transform: scaleX(0); transform-origin: left center;
    transition: transform .55s ${EASE};
  }

  /* ── gripur strip: the hovered object is picked up off the shelf ── */
  .mj-gripcard { transition: opacity .45s ease; }
  .mj-gripmedia { transition: transform .55s ${EASE}; }
  .mj-gripshelf {
    position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: ${SIENNA};
    transform: scaleX(0); transform-origin: left center; transition: transform .55s ${EASE};
  }
  .mj-chip { transition: background .35s ease, color .35s ease, border-color .35s ease; }

  /* ── EVERY hover effect on this page lives behind this gate, so a touch
     device can never get stranded in a hover state ── */
  @media (hover: hover) and (pointer: fine) {
    .mj-ul:hover::after { transform: scaleX(1); }
    /* !important for the same reason as the chip below: every CTA carries its
       resting background as an INLINE token, so a stylesheet rule loses. The
       outlined pills fill sienna, the filled ones brighten. No layout. */
    .mj-cta:hover { filter: brightness(1.18); background: ${SIENNA_DEEP} !important; }
    .mj-row:hover { background: rgba(156,99,70,.10); }
    .mj-row:hover::after { transform: scaleX(1); }
    .mj-row:hover .mj-row-label { transform: translateX(6px); }
    .mj-row:hover .mj-row-arrow { transform: translate(6px, -6px); }

    /* brushing the last soil off a photograph */
    .mj-js .mj-peelwrap:hover .mj-peel.is-dug,
    .mj-js .mj-panel:hover .mj-peel.is-dug { --mj-clip: 100%; }
    /* !important is load-bearing here and on the chip below: both carry
       their resting colour as an INLINE token (Pill / the credits line), and
       an inline declaration outranks a stylesheet rule */
    .mj-panel:hover .mj-panel-credits { color: ${TEXT} !important; transform: translateY(-3px); }
    .mj-panel:hover .mj-panel-credits::after { transform: scaleX(1); }

    /* picking one object up: it lifts off its shelf line, its month chip
       fills sienna, and the rest of the row steps back a stop */
    .mj-strip:hover .mj-gripcard { opacity: .42; }
    .mj-strip .mj-gripcard:hover { opacity: 1; }
    .mj-gripcard:hover .mj-gripmedia { transform: translateY(-12px); }
    .mj-gripcard:hover .mj-gripshelf { transform: scaleX(1); }
    .mj-gripcard:hover .mj-chip {
      background: ${SIENNA_DEEP} !important;
      border-color: ${SIENNA_DEEP} !important;
      color: ${TEXT} !important;
    }
  }

  /* ── 80.000 MYNDIR: the archive contact sheet. A physical sheet of frames
     on a light table: sheet edge, header strip, an even block of frames
     separated by sienna hairlines, a sequence number under every frame, and
     a foot that carries the honesty line. NOTHING is ever hidden — every
     frame is legible at rest, on every device, with scripts dead. Hover or
     keyboard focus lifts exactly ONE frame off the sheet and clears its
     desaturation; the other ten do not dim. ── */
  .mj-cs { border: 1px solid ${HAIR}; background: ${GROUND}; }
  .mj-cs-head, .mj-cs-foot {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px 24px; flex-wrap: wrap;
    padding: 13px clamp(14px, 2vw, 22px);
  }
  .mj-cs-head { border-bottom: 1px solid ${HAIR}; }
  .mj-cs-foot { border-top: 1px solid ${HAIR}; }
  /* the frame block. The 1px grid gaps ARE the sheet's separations: the
     hairline tint sits on the container and the cells paint over it. */
  .mj-cs-grid {
    display: grid; gap: 1px; background: ${HAIR_STRONG};
    border: 1px solid ${HAIR_STRONG};
    grid-template-columns: repeat(2, 1fr);
    margin: clamp(14px, 2vw, 22px);
  }
  @media (min-width: 640px) { .mj-cs-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1024px) { .mj-cs-grid { grid-template-columns: repeat(4, 1fr); } }
  .mj-cs-cell {
    position: relative; margin: 0; background: ${GROUND};
    padding: 10px 10px 9px;
  }
  .mj-cs-frame {
    transition: transform .5s ${EASE}, background .35s ease;
    outline-offset: 2px;
  }
  .mj-cs-media { position: relative; overflow: hidden; aspect-ratio: 4 / 3; }
  .mj-cs-media img {
    display: block; width: 100%; height: 100%; object-fit: cover;
    filter: saturate(.55) contrast(1.03) brightness(.92);
    transition: filter .5s ease;
  }
  .mj-cs-no { display: block; margin-top: 9px; transition: color .35s ease; }
  /* a real sheet runs out of exposures before it runs out of grid: the last
     rebate stays empty rather than being padded with a repeated picture */
  /* opaque on purpose: the grid's hairline tint is the CONTAINER background,
     so a translucent fill here would let the full sienna through and the
     empty rebate would read as a painted block */
  .mj-cs-blank {
    background-color: ${GROUND};
    background-image: linear-gradient(rgba(156,99,70,.05), rgba(156,99,70,.05));
  }

  /* the single-state lift. No shadow anywhere: this page separates with
     hairlines and scale alone. */
  .mj-cs-frame:focus-visible { transform: scale(1.05); z-index: 2; }
  .mj-cs-frame:focus-visible .mj-cs-media img { filter: saturate(.92) contrast(1.03) brightness(1); }
  .mj-cs-frame:focus-visible .mj-cs-no { color: ${TEXT} !important; }
  @media (hover: hover) and (pointer: fine) {
    .mj-cs-frame:hover { transform: scale(1.05); z-index: 2; }
    .mj-cs-frame:hover .mj-cs-media img { filter: saturate(.92) contrast(1.03) brightness(1); }
    .mj-cs-frame:hover .mj-cs-no { color: ${TEXT} !important; }
  }

  @keyframes mj-cue-drop {
    0%   { transform: scaleY(0); transform-origin: top center; }
    45%  { transform: scaleY(1); transform-origin: top center; }
    55%  { transform: scaleY(1); transform-origin: bottom center; }
    100% { transform: scaleY(0); transform-origin: bottom center; }
  }
  /* finite on purpose: the no-auto-loop hero rule — three cycles, then rest */
  .mj-cue-line { animation: mj-cue-drop 2.2s ${EASE} 3; }

  /* ── LOADER · KJARNASÝNI (the core sample) ───────────────────────────────
     The page's organising idea is a dig, so the loader is the instrument
     reading that precedes it: a narrow column of ground drawn DOWNWARD, past
     the three real dates of the museum's own time, while the page's images
     actually decode. Deliberately NOT the hero's move: the hero clips wide
     strata off a photograph; this fills a 13px tube and reads a number.
     No invented depths, metres or soil horizons — the graduations are
     unlabelled instrument marks and the only words are real years.

     Never mounts under reduced motion, never mounts twice in a session, and
     never exists at all without JS (it is created in an effect-guarded
     client render). pointer-events: none is load-bearing: the gesture that
     dismisses the loader must still reach the page underneath. ── */
  .mj-load {
    position: fixed; inset: 0; z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 0 clamp(1.25rem, 6vw, 4rem);
    background: ${GROUND};
    pointer-events: none;
    opacity: 1;
    transition: opacity .42s ${EASE} .2s;
  }
  .mj-load::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: ${GRAIN}; opacity: .1;
  }
  .mj-load-mod {
    position: relative; width: 100%; max-width: 560px;
    transition: transform .46s ${EASE}, opacity .22s linear;
  }
  .mj-load-meta {
    display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;
    font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: ${MUT};
  }
  .mj-load-pct {
    color: ${TEXT}; letter-spacing: .14em;
    font-variant-numeric: tabular-nums;
    font-variation-settings: "wght" 300;
  }
  .mj-load-mark {
    margin: 0 0 22px; font-weight: 800;
    font-size: clamp(24px, 5.2vw, 44px); line-height: 1.02;
    letter-spacing: -0.02em; text-transform: uppercase; color: ${TEXT};
  }
  .mj-load-mark span { display: block; }

  /* the strip: one hairline track, one sienna fill driven by real progress */
  .mj-load-track {
    position: relative; height: 2px; overflow: hidden;
    background: rgba(156,99,70,.22);
  }
  .mj-load-bar {
    position: absolute; inset: 0; background: ${SIENNA};
    transform: scaleX(0); transform-origin: 0 50%;
    transition: transform .34s ${EASE};
  }

  /* exit — the module lifts, then the ground goes. The hero beneath is never
     touched, so it hands off at its own resting state. */
  .mj-load.is-out { opacity: 0; }
  .mj-load.is-out .mj-load-mod { opacity: 0; transform: translateY(-22px); }
  .mj-load.is-skip { transition: opacity .26s ${EASE} .12s; }
  .mj-load.is-skip .mj-load-mod { transition: transform .3s ${EASE}, opacity .14s linear; }

  .mj-load-sr {
    position: fixed; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }

  @media (max-width: 640px) {
    .mj-load-meta { font-size: 12px; letter-spacing: .16em; }
  }
  /* belt and braces: the component already never mounts here */
  @media (prefers-reduced-motion: reduce) { .mj-load { display: none !important; } }

  @media (prefers-reduced-motion: no-preference) {
    .mj-ul::after { transition: transform .4s ${EASE}; }
  }

  @media (max-width: 640px) {
    .mj-page a[href^="mailto:"], .mj-page a[href^="http"], .mj-page a[href^="#"] {
      min-height: 44px; display: inline-flex; align-items: center;
    }
    /* micro-caps floor on small screens: the wide tracking carries the
       hierarchy, 12px carries the legibility */
    .mj-page .text-\\[11px\\] { font-size: 12px; }
  }

  /* ── resting state = final excavated state, everywhere ── */
  @media (prefers-reduced-motion: reduce) {
    .mj-stratum, .mj-strata-edge, .mj-peel { display: none !important; }
    .mj-hero-cue { display: none !important; }
    .mj-js .mj-hero-late { opacity: 1 !important; visibility: visible !important; transform: none !important; }
    .mj-hero-outer, .mj-js .mj-hero-outer { height: 100svh !important; }
    .mj-frame-in { inset: 0; transform: none !important; }
    .mj-hero-photo-in { transform: none !important; }
    .mj-js .mj-mask > .mj-mask-in { transform: none !important; transition: none !important; }
    .mj-js .mj-reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
    .mj-js .mj-tl-rule, .mj-tl-rule { transform: none !important; clip-path: none !important; }
    .mj-ap { clip-path: none !important; }
    .mj-cue-line { animation: none !important; }
    /* the contact sheet already rests fully resolved: every frame visible,
       every number legible. Only the lift stops travelling to its end state. */
    .mj-cs-frame, .mj-cs-media img, .mj-cs-no { transition: none !important; }
    /* the core sample rests fully drawn, every band and every stop set */
    .mj-js .mj-tl-dot { background: ${SIENNA} !important; }
    /* hover vocabulary keeps its end states but stops travelling to them */
    .mj-gripmedia, .mj-gripshelf, .mj-gripcard, .mj-chip,
    .mj-row, .mj-row::after, .mj-row-label, .mj-row-arrow,
    .mj-panel-credits, .mj-panel-credits::after, .mj-ul::after {
      transition: none !important;
    }
    /* the variable axis rests at its heaviest: fully excavated type. Each
       node carries its own rest weight in --mj-w, so the giant numeral rests
       at 900 and the section heads at 800. */
    .mj-wght { font-variation-settings: 'wght' var(--mj-w, 800) !important; }
  }
`

/* ── the shared rAF loop: batched reads, then batched writes ──────────────
   Each job runs its READS against the live layout and returns a WRITE
   closure (or nothing when its section is off screen). All reads for all
   jobs complete before the first write lands — never interleaved, so no
   forced synchronous layout per node (the measured Heklusýn perf bug). */
type Job = (vh: number, vw: number) => (() => void) | void

const mjJobs = new Set<Job>()
let mjRaf = 0

function mjTick() {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const writes: Array<() => void> = []
  mjJobs.forEach((job) => {
    const w = job(vh, vw)
    if (w) writes.push(w)
  })
  for (let i = 0; i < writes.length; i++) writes[i]()
  mjRaf = requestAnimationFrame(mjTick)
}

function addJob(job: Job) {
  mjJobs.add(job)
  if (!mjRaf) mjRaf = requestAnimationFrame(mjTick)
  return () => {
    mjJobs.delete(job)
    if (!mjJobs.size && mjRaf) {
      cancelAnimationFrame(mjRaf)
      mjRaf = 0
    }
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOut2 = (v: number) => 1 - (1 - v) * (1 - v)
/* smoothstep: each stratum accelerates from rest instead of snapping to full
   velocity the instant its stagger window opens (the onset-lurch fix), and
   still tapers gently into the resolve */
const easeBand = (v: number) => v * v * (3 - 2 * v)

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── THE EXCAVATED WEIGHT ─────────────────────────────────────────────────
   Cabinet Grotesk is loaded as a variable face (wght 100..900) and the axis
   is driven by the SAME scroll progress that drives the dig: a heading is
   thin and unresolved as it comes out of the ground and reaches its full
   weight once it is fully uncovered. Text that literally becomes more solid
   as you dig it up.

   Two disciplines are load-bearing here:
   1. Written straight to node.style from the shared rAF loop. No setState,
      ever, and the value is skipped when the rounded weight has not changed,
      so a still page writes nothing.
   2. A heavier weight is a WIDER glyph, and a wider glyph can wrap to one
      more line. Left alone, the light end of the scrub would un-wrap a
      heading and shift the page under the reader mid-scroll. So the box is
      measured once at the HEAVIEST weight (widest = most wraps = tallest)
      and locked with min-height. Re-measured on resize and after
      document.fonts.ready, never per frame. */
function useWeightScrub(
  ref: React.RefObject<HTMLElement | null>,
  from: number,
  to: number,
  ratio = 0.55,
  lock = false,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* reduced motion: no job at all, the CSS rest weight stands */
    if (reduced()) return

    let lockTimer = 0
    const relock = () => {
      if (!lock) return
      el.style.minHeight = ''
      const prev = el.style.fontVariationSettings
      el.style.fontVariationSettings = `"wght" ${to}`
      const h = el.getBoundingClientRect().height
      el.style.fontVariationSettings = prev
      el.style.minHeight = `${Math.ceil(h)}px`
    }
    relock()
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(relock).catch(() => {})
    }
    const onResize = () => {
      window.clearTimeout(lockTimer)
      lockTimer = window.setTimeout(relock, 180)
    }
    window.addEventListener('resize', onResize)

    let last = -1
    const stop = addJob((vh) => {
      const r = el.getBoundingClientRect()
      if (r.top > vh + 60 || r.bottom < -60) return
      const p = clamp01((vh - r.top) / (vh * ratio))
      const w = Math.round(from + (to - from) * easeOut2(p))
      if (w === last) return
      return () => {
        last = w
        el.style.fontVariationSettings = `"wght" ${w}`
      }
    })
    return () => {
      stop()
      window.clearTimeout(lockTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [ref, from, to, ratio, lock])
}

/** Register a drift node (image drifting inside its fixed frame). */
function useDriftNode(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    return addJob((vh) => {
      const host = el.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      if (r.bottom < -240 || r.top > vh + 240) return
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
      const d = Number(el.dataset.drift) || 9
      const y = (-p * d).toFixed(3)
      return () => {
        el.style.transform = `translate3d(0, ${y}%, 0)`
      }
    })
  }, [ref])
}

function DriftFrame({
  src, alt, drift = 9, className = '', style, eager = false, position, srcSet, sizes,
}: {
  src: string
  alt: string
  drift?: number
  className?: string
  style?: React.CSSProperties
  eager?: boolean
  position?: string
  srcSet?: string
  sizes?: string
}) {
  const inner = useRef<HTMLDivElement>(null)
  useDriftNode(inner)
  return (
    <div className={`mj-frame ${className}`} style={style}>
      <div
        ref={inner}
        className="mj-frame-in"
        data-drift={drift}
        style={{ ['--dz' as string]: `${Math.max(9, drift * 1.35).toFixed(2)}%` }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    </div>
  )
}

/* IO reveal — fires once, on an untransformed wrapper */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function MaskLine({
  children, className = '', delay = 0, mounted,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** when provided, the mask is mount-driven instead of IO-driven (hero) */
  mounted?: boolean
}) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const on = mounted ?? inView
  return (
    <span ref={mounted === undefined ? ref : undefined} className={`mj-mask ${on ? 'is-in' : ''} ${className}`}>
      <span className="mj-mask-in block" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </span>
    </span>
  )
}

function Reveal({
  children, className = '', delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`mj-reveal ${inView ? 'is-in' : ''} ${className}`}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── small shared furniture ── */

/* tone 'soot' is for chips that sit ON a photograph: a soot scrim keeps the
   off-white legible over any pixel underneath, and leaves the sienna fill
   free to arrive on hover */
function Pill({ children, tone = 'line', className = '' }: { children: ReactNode; tone?: 'line' | 'fill' | 'soot'; className?: string }) {
  const bg = tone === 'fill' ? SIENNA_DEEP : tone === 'soot' ? 'rgba(22,19,15,.82)' : 'transparent'
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${className}`}
      style={{
        fontFamily: DISPLAY, fontWeight: 500,
        border: `1px solid ${tone === 'fill' ? SIENNA_DEEP : HAIR_STRONG}`,
        background: bg,
        color: tone === 'line' ? SIENNA : TEXT,
      }}
    >
      {children}
    </span>
  )
}

/** the accumulating depth device: one tick per excavated layer */
function DepthTicks({ n }: { n: number }) {
  return (
    <span className="hidden items-end gap-[5px] sm:inline-flex" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="inline-block w-px"
          style={{ height: `${8 + i * 4}px`, background: HAIR_STRONG }}
        />
      ))}
    </span>
  )
}

function SectionHead({
  layer, depth, kicker, title,
}: {
  /** pill text: LAG 01 … LAG 05, or the surface markers */
  layer: string
  /** how many ticks the dig has accumulated at this depth */
  depth: number
  kicker: string
  title: string
}) {
  const h = useRef<HTMLHeadingElement>(null)
  /* 220 out of the ground, 800 fully uncovered */
  useWeightScrub(h, 220, 800, 0.55, true)
  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <Pill>{layer}</Pill>
          <DepthTicks n={depth} />
          <span className="text-[11px] uppercase tracking-[0.14em] md:text-[12px]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
            {kicker}
          </span>
          <span className="h-px flex-1" style={{ background: HAIR }} aria-hidden />
        </div>
      </Reveal>
      <h2
        ref={h}
        className="mj-wght mt-6 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(2rem,4.5vw,3.6rem)]"
        style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT, ['--mj-w' as string]: 800 }}
      >
        <MaskLine>{title}</MaskLine>
      </h2>
    </div>
  )
}

/** photo frame with the hero's peel echoed quietly: a tinted stratum overlay
    clips away (clip-path inset only) when the frame scrolls into view */
function PeelFrame(props: {
  src: string
  alt: string
  drift?: number
  className?: string
  position?: string
  srcSet?: string
  sizes?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={`mj-peelwrap relative overflow-hidden ${props.className ?? ''}`}>
      <DriftFrame
        src={props.src}
        alt={props.alt}
        drift={props.drift ?? 9}
        className="h-full"
        position={props.position}
        srcSet={props.srcSet}
        sizes={props.sizes}
      />
      <div className={`mj-peel ${inView ? 'is-dug' : ''}`} aria-hidden />
    </div>
  )
}

function RowLink({
  href, children, external = true, sub,
}: {
  href: string
  children: ReactNode
  external?: boolean
  sub?: string
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="mj-row flex min-h-[56px] items-center justify-between gap-4 px-1 py-3"
      style={{ borderTop: `1px solid ${HAIR}`, color: TEXT }}
    >
      <span className="mj-row-label flex flex-col">
        <span className="text-[16px]" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>{children}</span>
        {sub && <span className="mt-0.5 text-[12.5px]" style={{ color: MUT }}>{sub}</span>}
      </span>
      <ArrowUpRight size={17} className="mj-row-arrow shrink-0 transition-transform duration-300" style={{ color: SIENNA }} aria-hidden />
    </a>
  )
}

/* ── nav ── */
const NAV_LINKS = [
  { id: 'syningar', label: 'Sýningarnar' },
  { id: 'gripur', label: 'Gripur mánaðarins' },
  { id: 'sagan', label: 'Sagan' },
]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const el = document.getElementById('mj-hero-sentinel')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setSolid(!entry.isIntersecting))
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(22,19,15,0.92)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-[76px] md:px-10">
        <button
          onClick={() => goTo('efst')}
          className="text-left text-[13px] uppercase leading-tight tracking-[0.04em] md:text-[15px]"
          style={{
            fontFamily: DISPLAY, fontWeight: 800, color: TEXT,
            minHeight: 44, display: 'inline-flex', alignItems: 'center',
          }}
          aria-label="Minjasafn Austurlands, efst á síðu"
        >
          Minjasafn Austurlands
        </button>
        <nav className="flex items-center gap-6" aria-label="Aðalvalmynd">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="hidden text-[12px] uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-70 lg:block"
              style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => goTo('heimsokn')}
            className="mj-cta rounded-full px-5 text-[12px] uppercase tracking-[0.08em]"
            style={{
              fontFamily: DISPLAY, fontWeight: 500, background: SIENNA_DEEP, color: TEXT,
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}
          >
            Heimsókn
          </button>
        </nav>
      </div>
    </header>
  )
}

/* ── 1 · HERO — the dig itself. Resolves once over ~150vh of scroll. ── */
function SectionHero() {
  const [mounted, setMounted] = useState(false)
  const outer = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const photoIn = useRef<HTMLDivElement>(null)
  const lateA = useRef<HTMLDivElement>(null)
  const late = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 90)
    return () => clearTimeout(t)
  }, [])

  /* ── WHERE THE YEAR LABELS SIT ─────────────────────────────────────────
     The band labels carry the dig's entire honest payload (2026 · 1943 ·
     1942, all real dates). They used to be anchored at 20/30/40% of the
     viewport, which is inside the wordmark's box at every scroll depth, and
     mix-blend-mode: difference ate two of the three: '1943 · SAFNIÐ STOF'
     with the rest swallowed by the M of MINJASAFN.

     So the anchor is MEASURED off the wordmark instead of guessed as a
     percentage: one slot, a line and a half above the type, recomputed on
     resize and after the display face lands (a heavier wght is a wider
     glyph, but the line count is fixed at two, so the height is stable).
     One slot is enough and is better: each band clips away to expose the
     next, so exactly one label can ever be visible at a time — the year
     changes in place as you dig, and at each crossover the soil edge cuts
     the line in half, the outgoing year above it and the incoming below. */
  useEffect(() => {
    const place = () => {
      const st = stage.current
      const t = title.current
      if (!st || !t) return
      const sr = st.getBoundingClientRect()
      const tr = t.getBoundingClientRect()
      const lab = st.querySelector('.mj-strata-label')
      const labH = lab ? lab.getBoundingClientRect().height || 18 : 18
      const nav = document.querySelector('header')
      const navH = nav ? nav.getBoundingClientRect().height : 76
      /* the band between the nav and the top of the wordmark. On a 1440x900
         window that is 160px of room; on a 1280x620 window the wordmark eats
         the viewport and it collapses to about 35px, which still holds one
         12px line. Only if even that fails does the slot drop below the
         wordmark, where the resolving eyebrow eventually arrives. */
      const floor = navH + 10
      const ceil = tr.top - sr.top - 12 - labH
      const y = ceil >= floor
        ? Math.min(ceil, Math.max(floor, tr.top - sr.top - 46))
        : tr.bottom - sr.top + 20
      st.style.setProperty('--mj-strata-top', `${Math.round(y)}px`)
    }
    place()
    let t = 0
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(place, 160)
    }
    window.addEventListener('resize', onResize)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(place).catch(() => {})
    }
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const host = outer.current
    if (!host) return
    const bands = Array.from(host.querySelectorAll<HTMLElement>('.mj-stratum'))
    const edges = Array.from(host.querySelectorAll<HTMLElement>('.mj-strata-edge'))
    return addJob((vh) => {
      const r = host.getBoundingClientRect()
      if (r.bottom < -120) return
      const travel = Math.max(1, r.height - vh)
      const progress = clamp01(-r.top / travel)
      /* per-band stagger over the dig: band 0 (2026) first, 1942 last.
         PEEK pre-peels the upper bands a few percent at rest so the stacked
         strata (the page's whole premise) are visible before the first input */
      const insets = bands.map((_, i) =>
        Math.max(PEEK[i] ?? 0, easeBand(clamp01((progress - i * 0.26) / 0.44)) * 100),
      )
      const pE = easeOut2(progress)
      /* orientation first, action second: the eyebrow (who and where) resolves
         while the second band is still coming off, the CTAs once the dig is
         essentially done. One scrub, two windows, no extra job. */
      const lateAO = clamp01((progress - 0.22) / 0.24)
      const lateO = clamp01((progress - 0.6) / 0.28)
      const cueO = clamp01(1 - progress * 4)
      /* the wordmark itself gains weight as the strata come off it: the same
         `progress` that clips the bands drives the wght axis, 300 to 820 */
      const wght = Math.round(300 + 520 * pE)
      return () => {
        for (let i = 0; i < bands.length; i++) {
          bands[i].style.clipPath = `inset(0 0 ${insets[i].toFixed(2)}% 0)`
          const edge = edges[i]
          if (edge) {
            edge.style.top = `calc(${(100 - insets[i]).toFixed(2)}% - 2px)`
            edge.style.opacity = insets[i] > 0.5 && insets[i] < 99 ? '1' : '0'
          }
        }
        if (photoIn.current) {
          photoIn.current.style.transform = `scale(${(1.09 - 0.09 * pE).toFixed(4)})`
        }
        if (lateA.current) {
          lateA.current.style.opacity = lateAO.toFixed(3)
          lateA.current.style.visibility = lateAO < 0.05 ? 'hidden' : 'visible'
          lateA.current.style.transform = `translateY(${((1 - lateAO) * 16).toFixed(2)}px)`
        }
        if (late.current) {
          late.current.style.opacity = lateO.toFixed(3)
          late.current.style.visibility = lateO < 0.05 ? 'hidden' : 'visible'
          late.current.style.transform = `translateY(${((1 - lateO) * 16).toFixed(2)}px)`
        }
        if (cue.current) cue.current.style.opacity = cueO.toFixed(3)
        if (title.current) title.current.style.fontVariationSettings = `"wght" ${wght}`
      }
    })
  }, [])

  return (
    <section ref={outer} id="efst" className="mj-hero-outer relative" aria-label="Jarðlög, upphafskafli">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: GROUND }}>
        {/* base of the dig: the Sjálfbær eining interior, pre-desaturated for
            the difference-blend wordmark (the Búðir recipe) */}
        <div className="mj-hero-photo absolute inset-0">
          <div ref={photoIn} className="mj-hero-photo-in absolute inset-0 will-change-transform">
            <img
              src={IMG.sjalfbaer.src}
              srcSet={IMG.sjalfbaer.srcSet}
              sizes="100vw"
              alt={IMG.sjalfbaer.alt}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* scrim for the resolving eyebrow/CTA band — contrast, not mood */}
        <div
          className="absolute inset-0 z-[6]"
          aria-hidden
          style={{ background: 'linear-gradient(to top, rgba(22,19,15,0.92) 0%, rgba(22,19,15,0.55) 22%, rgba(22,19,15,0) 44%)' }}
        />

        {/* the three strata of the museum's own time — real dates, not
            invented soil science. Deepest layer lowest in the stack. */}
        {STRATA.map((s, i) => (
          <div
            key={s.label}
            className="mj-stratum"
            data-stratum={i}
            aria-hidden
            style={{ zIndex: 13 - i, background: STRATA_BG[i] }}
          >
            {/* every band puts its year in the SAME measured slot clear of the
                wordmark (see the placement effect). The clip stack makes them
                mutually exclusive, so this reads as one counter going down. */}
            <span
              className="mj-strata-label absolute flex items-center gap-3 text-[12px] uppercase tracking-[0.16em]"
              style={{ fontFamily: DISPLAY, fontWeight: 500, color: 'rgba(237,230,218,.78)' }}
            >
              <span className="inline-block h-px w-10" style={{ background: HAIR_STRONG }} />
              {s.label}
            </span>
            <span className="mj-strata-edge" />
          </div>
        ))}

        {/* the wordmark, blended over whatever depth the dig has reached */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <h1
            ref={title}
            className="mj-hero-title mj-wght text-center uppercase leading-[0.98] tracking-[-0.02em] text-[clamp(3.1rem,13.5vw,12rem)]"
            style={{ fontFamily: DISPLAY, fontWeight: 800, ['--mj-w' as string]: 820 }}
            aria-label="Minjasafn Austurlands"
          >
            {/* trailing space keeps textContent readable ("Minjasafn Austurlands",
                not "MinjasafnAusturlands") — trailing whitespace in the block
                line box collapses, so it renders identically */}
            <MaskLine mounted={mounted}>Minjasafn </MaskLine>
            <MaskLine mounted={mounted} delay={120}>Austurlands</MaskLine>
          </h1>
        </div>

        {/* resolves once the strata are cleared */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-8 md:px-10 md:pb-10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6">
            <div ref={lateA} className="mj-hero-late">
              <p className="text-[12px] uppercase tracking-[0.14em] md:text-[13px]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
                Byggðasafn Austurlands · Egilsstöðum · stofnað 1943
              </p>
              <p className="mt-2 text-[15px]" style={{ color: MUT }}>
                Lag fyrir lag.
              </p>
            </div>
            <div ref={late} className="mj-hero-late flex flex-wrap items-center gap-3">
              <button
                onClick={() => goTo('heimsokn')}
                className="mj-cta rounded-full px-6 text-[13px] uppercase tracking-[0.08em]"
                style={{
                  fontFamily: DISPLAY, fontWeight: 500, background: SIENNA_DEEP, color: TEXT,
                  minHeight: 46, display: 'inline-flex', alignItems: 'center',
                }}
              >
                Heimsókn
              </button>
              <button
                onClick={() => goTo('syningar')}
                className="mj-cta rounded-full px-6 text-[13px] uppercase tracking-[0.08em]"
                style={{
                  fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`,
                  background: 'rgba(22,19,15,0.5)', color: TEXT,
                  minHeight: 46, display: 'inline-flex', alignItems: 'center',
                }}
              >
                Sýningarnar
              </button>
            </div>
          </div>
        </div>

        {/* dig cue — fades as soon as the excavation starts */}
        <div ref={cue} className="mj-hero-cue absolute bottom-8 left-1/2 z-[24] -translate-x-1/2 md:bottom-10" aria-hidden>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[12px] uppercase tracking-[0.22em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
              Skrunaðu til að grafa
            </span>
            <span className="mj-cue-line block h-9 w-px" style={{ background: SIENNA }} />
          </div>
        </div>
      </div>

      {/* nav solidify sentinel: near the end of the first hero viewport */}
      <div id="mj-hero-sentinel" aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: 'calc(100svh - 120px)' }} />
    </section>
  )
}

/* ── 2 · STAÐAN Í DAG — status triptych at the surface ── */
function SectionStatus() {
  const [state, setState] = useState<OpenState | null>(null)
  useEffect(() => {
    setState(openState(new Date()))
  }, [])

  const season = state?.season ?? 'vetur'
  const seasonTable = (key: 'winter' | 'summer', active: boolean) => {
    const t = HOURS[key]
    return (
      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: active ? SIENNA : MUT }}>
          {t.label}{active ? ' · nú' : ''}
        </p>
        <dl className="mt-2">
          {t.rows.map(([d, h]) => (
            <div key={d} className="flex items-baseline justify-between gap-4 py-1.5" style={{ borderTop: `1px solid ${HAIR}` }}>
              <dt className="text-[14px]" style={{ color: MUT }}>{d}</dt>
              <dd className="text-[14px] tabular-nums" style={{ color: TEXT, fontFamily: DISPLAY, fontWeight: 500 }}>{h}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  return (
    <section id="heimsokn" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Yfirborð" depth={0} kicker="Staðan í dag" title="Heimsóknin" />
        <div
          className="mt-10 grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}
        >
          {/* opið í dag — computed live, Iceland runs UTC year round */}
          <Reveal className="py-8 pr-0 md:pr-10">
            <div className="flex items-center gap-3">
              <span
                id="mj-open-dot"
                className="inline-block h-2.5 w-2.5 rounded-full"
                data-open={state ? String(state.open) : 'pending'}
                style={{ background: state?.open ? OPEN_DOT : CLOSED_DOT }}
                aria-hidden
              />
              <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
                {state === null ? 'Opnunartímar' : state.open ? 'Opið núna' : 'Lokað núna'}
              </h3>
            </div>
            <p className="mt-4 text-[26px] leading-none" style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}>
              {state?.todays ? `Í dag ${state.todays}` : 'Lokað í dag'}
            </p>
            {seasonTable('winter', season === 'vetur')}
            {seasonTable('summer', season === 'sumar')}
          </Reveal>

          {/* aðgangur */}
          <Reveal delay={90} className="border-t py-8 md:border-l md:border-t-0 md:px-10" >
            <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
              Aðgangur
            </h3>
            <dl className="mt-4">
              {ADMISSION.map(([label, price]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderTop: `1px solid ${HAIR}` }}>
                  <dt className="text-[14.5px]" style={{ color: MUT }}>{label}</dt>
                  <dd className="whitespace-nowrap text-[14.5px] tabular-nums" style={{ color: TEXT, fontFamily: DISPLAY, fontWeight: 500 }}>{price}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* heimsókn */}
          <Reveal delay={160} className="border-t py-8 md:border-l md:border-t-0 md:pl-10">
            <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
              Hvar erum við
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <p className="flex items-start gap-3 text-[16px]" style={{ color: TEXT }}>
                <MapPin size={17} style={{ color: SIENNA, marginTop: 3 }} aria-hidden />
                {CONTACT.address}
              </p>
              <a href={CONTACT.emailHref} className="mj-ul flex items-center gap-3 text-[16px]" style={{ color: TEXT }}>
                <Mail size={17} style={{ color: SIENNA }} aria-hidden />
                {CONTACT.email}
              </a>
              <a href={CONTACT.website} target="_blank" rel="noreferrer" className="mj-ul flex items-center gap-3 text-[16px]" style={{ color: TEXT }}>
                <ArrowUpRight size={17} style={{ color: SIENNA }} aria-hidden />
                {CONTACT.websiteDisplay}
              </a>
              <p className="mt-2 max-w-[34ch] text-[13.5px] leading-relaxed" style={{ color: MUT }}>
                Safnið er að Laufskógum 1 á Egilsstöðum. Sendu okkur línu, við svörum.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── 3 · GRUNNSÝNINGARNAR — layer 01, two stacked panels ── */
function SectionExhibitions() {
  return (
    <section id="syningar" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 01" depth={1} kicker="Grunnsýningarnar tvær" title="Það sem stendur uppúr" />
        <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
          {EXHIBITIONS.map((ex, i) => (
            <article
              key={ex.id}
              className="mj-panel grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <Reveal className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <PeelFrame
                  src={ex.img.src}
                  alt={ex.img.alt}
                  srcSet={ex.img.srcSet}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  drift={11}
                  className="aspect-[4/3] md:aspect-[16/10]"
                  position={'imgPosition' in ex ? (ex as { imgPosition?: string }).imgPosition : undefined}
                />
              </Reveal>
              <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Reveal>
                  <Pill>Varanleg sýning</Pill>
                </Reveal>
                <h3
                  className="mt-5 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(1.8rem,3.6vw,2.9rem)]"
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}
                >
                  <MaskLine>{ex.title}</MaskLine>
                </h3>
                <Reveal delay={110}>
                  <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
                    {ex.body}
                  </p>
                </Reveal>
                {ex.credits && (
                  <Reveal delay={170}>
                    <p className="mj-panel-credits mt-4 inline-block text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
                      {ex.credits}
                    </p>
                  </Reveal>
                )}
                <Reveal delay={220}>
                  <a
                    href={ex.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mj-ul mt-6 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
                    style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
                  >
                    Sýningin á minjasafn.is
                    <ArrowUpRight size={15} aria-hidden />
                  </a>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 4 · GRIPUR MÁNAÐARINS — layer 02, the warm human strip ── */
function SectionGripur() {
  return (
    <section id="gripur" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 02" depth={2} kicker="Lifandi röð á minjasafn.is" title="Gripur mánaðarins" />
        <Reveal delay={90}>
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
            Safnkosturinn dreginn fram, einn gripur í einu. Í hverjum mánuði velur safnið einn grip úr geymslunum og segir sögu hans.
          </p>
        </Reveal>
      </div>

      <div
        className="mj-strip mt-10 flex gap-4 px-5 pb-4 md:mt-12 md:gap-6 md:px-10"
        tabIndex={0}
        role="region"
        aria-label="Gripur mánaðarins, myndaröð, skrunaðu til hliðar"
      >
        {GRIPIR.map((g) => (
          <figure key={g.month} className="mj-gripcard w-[clamp(240px,64vw,320px)] shrink-0 snap-start">
            {/* the shelf line is the ground the object was lifted off: it
                stays at the original bottom edge while the media travels up */}
            <div className="relative">
              <span className="mj-gripshelf" aria-hidden />
              <div className="mj-gripmedia relative">
                <DriftFrame src={g.src} alt={g.alt} drift={6} className="aspect-[4/3]" />
                <span className="absolute left-3 top-3 z-[4]">
                  <Pill tone="soot" className="mj-chip">{g.month}</Pill>
                </span>
              </div>
            </div>
            <figcaption className="mt-3 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
              Úr safnkostinum
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <a
            href={LINKS.gripur}
            target="_blank"
            rel="noreferrer"
            className="mj-ul mt-6 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
          >
            Allir gripir mánaðarins á minjasafn.is
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 5 · LJÓSMYNDASAFNIÐ — layer 03, type-led statement ── */
function SectionArchive() {
  const num = useRef<HTMLParagraphElement>(null)
  /* the widest use of the axis on the page: 150 out of the ground to 900 */
  useWeightScrub(num, 150, 900, 0.5)
  return (
    <section id="ljosmyndasafn" className="py-20 md:py-28" style={{ background: GROUND_DEEP }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 03" depth={3} kicker="Ljósmyndasafn Austurlands" title="Myndlagið" />
        <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              ref={num}
              className="mj-wght leading-[0.9] tracking-[-0.02em] text-[clamp(4.4rem,14vw,12.5rem)]"
              style={{ fontFamily: DISPLAY, fontWeight: 900, color: SIENNA, ['--mj-w' as string]: 900 }}
            >
              <MaskLine>
                <span aria-hidden style={{ fontSize: '.42em', verticalAlign: '0.5em', letterSpacing: 0 }}>~</span>
                <span className="sr-only">um </span>
                80.000
              </MaskLine>
            </p>
            <Reveal delay={100}>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed md:text-[19px]" style={{ color: TEXT }}>
                myndir í Ljósmyndasafni Austurlands, sérstakri deild innan Héraðsskjalasafns Austfirðinga.
              </p>
            </Reveal>
          </div>
          <Reveal delay={140} className="lg:col-span-4">
            {/* spjold, not bak: bak is the same Sjálfbær eining room as the
                hero, and the archive section is about the PICTURES — the
                gallery wall of exhibition prints tells that story */}
            <PeelFrame src={IMG.spjold.src} alt={IMG.spjold.alt} srcSet={IMG.spjold.srcSet} sizes="(min-width: 1024px) 33vw, 100vw" drift={8} className="aspect-[4/3]" />
          </Reveal>
        </div>
        <div className="mt-12">
          <RowLink href={LINKS.ljosmyndasafn} sub="Nánar um deildina og aðgang að myndunum">
            Ljósmyndasafn Austurlands á minjasafn.is
          </RowLink>
          <RowLink href={LINKS.sarpur} sub="Menningarsögulegt gagnasafn íslenskra safna">
            Safnkosturinn er skráður í Sarp
          </RowLink>
          <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
        </div>
      </div>
    </section>
  )
}

/* ── 5b · UNDIR YFIRBORÐINU — the archive contact sheet ──────────────────
   The lens that used to live here failed on its own argument twice: it hid
   the very photographs the section exists to show, and it re-buried them the
   instant the pointer left, while every other reveal on this page digs ONCE
   and stays dug. Replaced with the thing a photographic archive actually
   makes: a contact sheet. Sheet edge, header strip, an even block of frames
   on sienna hairlines, a sequence number under each, a foot line.

   Every frame is visible at rest, at every width, with scripts dead and
   under prefers-reduced-motion. There is no JS in this section at all: the
   one interactive state is a CSS lift on :hover (gated behind a fine
   pointer) mirrored exactly on :focus-visible, so a keyboard user gets the
   same frame and a touch user simply gets the whole sheet.

   HONESTY, stated in the copy AND on the foot of the sheet: these are the
   museum's own photographs of its work, events and exhibitions. They are NOT
   the digitised Ljósmyndasafn Austurlands, which is not published on the
   web. The photographs keep the page's ordinary desaturation, never aged or
   sepia-toned into looking like archive material they are not, and the
   numbers 01..11 are sheet positions, not accession numbers. ── */
function SectionContactSheet() {
  const micro = { fontFamily: DISPLAY, fontWeight: 500, color: MUT } as const
  return (
    <section id="undir-yfirbordinu" className="pb-20 md:pb-28" style={{ background: GROUND_DEEP }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 03" depth={3} kicker="Sama lagið, myndirnar sjálfar" title="Undir yfirborðinu" />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-[54ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
              Ljósmyndasafn Austurlands geymir um 80.000 myndir og er sérstök deild innan
              Héraðsskjalasafns Austfirðinga. Sá myndakostur er ekki birtur á vefnum.
            </p>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-5">
            <p className="max-w-[48ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
              Myndirnar hér að neðan eru úr starfi safnsins, viðburðum þess og sýningum.
              Þetta er boð um að leita í ljósmyndasafnið, ekki ljósmyndasafnið sjálft.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-9 md:mt-12">
          <div className="mj-cs">
            <div className="mj-cs-head">
              <span className="text-[11px] uppercase tracking-[0.16em]" style={micro}>
                Myndaörk · Starf, viðburðir og sýningar
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em]" style={{ ...micro, color: SIENNA }}>
                {CONTACT_SHEET.length} myndir
              </span>
            </div>

            <div
              className="mj-cs-grid"
              role="group"
              aria-label="Myndaörk með ellefu ljósmyndum úr starfi Minjasafns Austurlands"
            >
              {CONTACT_SHEET.map((p, i) => (
                <figure key={p.src} className="mj-cs-cell mj-cs-frame" tabIndex={0}>
                  <div className="mj-cs-media">
                    <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="mj-cs-no text-[11px] uppercase tracking-[0.16em]" style={micro}>
                    {String(i + 1).padStart(2, '0')}
                  </figcaption>
                </figure>
              ))}
              {/* the empty rebate that finishes the block: eleven exposures in
                  a twelve-cell sheet, never a repeated picture as filler */}
              <div className="mj-cs-cell mj-cs-blank" aria-hidden />
            </div>

            <div className="mj-cs-foot">
              <span className="text-[11px] uppercase tracking-[0.16em]" style={micro}>
                Myndir: Minjasafn Austurlands
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em]" style={micro}>
                Ekki úr Ljósmyndasafni Austurlands
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 6 · SAGAN — layer 04, the serif register. 1942 → í dag. ── */
/* the core sample's bands: the sampled soot→sienna family, deepest tone at
   the top of the column (1942) brightening to the accent at today */
const CORE_BANDS = ['#3B2717', '#5C3823', '#7B4A31', SIENNA]

function SectionSaga() {
  const host = useRef<HTMLDivElement>(null)
  const rule = useRef<HTMLDivElement>(null)
  const dots = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const el = host.current
    const ln = rule.current
    if (!el || !ln) return

    /* ── THE CORE SAMPLE ──────────────────────────────────────────────────
       The timeline rule stops being a hairline and becomes an extracted
       column of ground. It is banded with the strata tints at the MEASURED
       vertical position of each dated stop, so the bands are the years
       themselves, not decoration: the boundary between the 1942 band and the
       17.11.1942 band sits exactly on the second marker. As the reader
       descends, the core is drawn out of the ground (clip) and widens
       (scaleX), and each year's marker fills sienna the moment the core
       reaches it. Measured, never guessed; re-measured on resize. */
    const measure = () => {
      const hr = el.getBoundingClientRect()
      const ys = dots.current.map((d) => {
        if (!d) return 0
        const dr = d.getBoundingClientRect()
        return dr.top + dr.height / 2 - hr.top
      })
      /* the rule spans inset 8px top and bottom (top-2 / bottom-2) */
      const span = Math.max(1, hr.height - 16)
      const pct = (y: number) => clamp01((y - 8) / span) * 100
      /* the boundary tick is specified in PIXELS and converted, not as a flat
         percentage: at 0.7% of a 500px column it came out 3.5px and at a
         1200px column it would have been 8px. 3px of pale ash reads as the
         line between two beds of soil at any column height. */
      const tickPct = Math.min(3, (3 / span) * 100)
      const stops: string[] = []
      let prev = 0
      for (let i = 0; i < CORE_BANDS.length; i++) {
        const end = i === CORE_BANDS.length - 1 ? 100 : pct(ys[i + 1] ?? 0)
        stops.push(`${CORE_BANDS[i]} ${prev.toFixed(2)}% ${Math.max(prev, end).toFixed(2)}%`)
        if (i < CORE_BANDS.length - 1) {
          const line = Math.min(100, end + tickPct)
          stops.push(`rgba(237,230,218,.58) ${end.toFixed(2)}% ${line.toFixed(2)}%`)
          prev = line
        }
      }
      ln.style.backgroundImage = `linear-gradient(180deg, ${stops.join(', ')})`
      return ys
    }
    let ys = measure()
    let t = 0
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        ys = measure()
      }, 180)
    }
    window.addEventListener('resize', onResize)
    /* the first measure runs before the display face and the photographs have
       settled the column's height, and a stale height puts every band a dozen
       pixels off its own year. A ResizeObserver on the column catches the
       font swap, the image decode and any reflow, not just window resizes. */
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => { ys = measure() }).catch(() => {})
    }
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    ro?.observe(el)

    if (reduced()) {
      return () => {
        window.clearTimeout(t)
        window.removeEventListener('resize', onResize)
        ro?.disconnect()
      }
    }

    const passed = dots.current.map(() => false)
    const stop = addJob((vh) => {
      const r = el.getBoundingClientRect()
      if (r.bottom < -120 || r.top > vh + 120) return
      const p = clamp01((vh * 0.88 - r.top) / r.height)
      const drawn = 8 + p * Math.max(1, r.height - 16)
      const next = ys.map((y) => drawn >= y)
      const changed = next.some((v, i) => v !== passed[i])
      return () => {
        ln.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`
        ln.style.transform = `scaleX(${(0.34 + 0.66 * p).toFixed(3)})`
        if (changed) {
          for (let i = 0; i < next.length; i++) {
            passed[i] = next[i]
            const d = dots.current[i]
            if (d) d.style.background = next[i] ? SIENNA : GROUND
          }
        }
      }
    })

    return () => {
      stop()
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [])

  return (
    <section id="sagan" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 04" depth={4} kicker="Sagan · 1942 til dagsins í dag" title="Neðsta lagið" />
        <Reveal delay={90}>
          <p
            className="mt-6 max-w-[52ch] text-[19px] leading-relaxed md:text-[21px]"
            style={{ fontFamily: SERIF, fontWeight: 300, color: TEXT }}
          >
            Safnkosturinn varð til eins og jarðlög verða til: heimili fyrir heimili, gripur fyrir grip, lag ofan á lag.
          </p>
        </Reveal>

        <div ref={host} className="relative mt-12 md:mt-16">
          {/* the empty borehole, and the banded core drawn out of it */}
          <div className="mj-tl-base absolute bottom-2 top-2" aria-hidden />
          <div ref={rule} className="mj-tl-rule absolute bottom-2 top-2" aria-hidden />
          <ol className="flex flex-col gap-10 md:gap-12">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="relative pl-9 md:pl-12">
                <span
                  ref={(n) => { dots.current[i] = n }}
                  className="mj-tl-dot absolute left-0 top-[6px] inline-block h-[11px] w-[11px] rounded-full"
                  style={{ border: `2px solid ${SIENNA}` }}
                  aria-hidden
                />
                <Reveal delay={i * 60}>
                  <p className="text-[13px] uppercase tracking-[0.14em] tabular-nums" style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}>
                    {t.year}
                  </p>
                  <p
                    className="mt-2 max-w-[58ch] text-[17px] leading-relaxed md:text-[18px]"
                    style={{ fontFamily: SERIF, fontWeight: 400, color: 'rgba(237,230,218,.86)' }}
                  >
                    {t.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · LINDARBAKKI OG FLEIRI VERKEFNI — layer 05 ── */
function SectionProjects() {
  return (
    <section id="lindarbakki" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 05" depth={5} kicker="Út fyrir húsið" title="Lindarbakki og fleiri verkefni" />
        <Reveal className="mt-12">
          <div className="relative overflow-hidden">
            <PeelFrame
              src={IMG.lindarbakki.src}
              alt={IMG.lindarbakki.alt}
              srcSet={IMG.lindarbakki.srcSet}
              sizes="100vw"
              drift={12}
              className="aspect-[4/3] md:aspect-[21/9]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5"
              aria-hidden
              style={{ background: 'linear-gradient(to top, rgba(22,19,15,0.85), rgba(22,19,15,0))' }}
            />
            <span className="absolute left-4 top-4 z-[5] md:left-6 md:top-6">
              <Pill tone="fill">Gestastaður</Pill>
            </span>
            <p
              className="absolute bottom-4 left-4 z-[5] max-w-[44ch] text-[15px] leading-relaxed md:bottom-6 md:left-6 md:text-[16px]"
              style={{ color: TEXT }}
            >
              Lindarbakki á Borgarfirði eystra er meðal verkefna safnsins.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <RowLink href={LINKS.lindarbakki}>Lindarbakki</RowLink>
          {PROJECTS.map((p) => (
            <RowLink key={p.name} href={p.href}>{p.name}</RowLink>
          ))}
          <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
        </div>
      </div>
    </section>
  )
}

/* ── 8 · FRÆÐSLA + FYLGSTU MEÐ — back up to the surface ── */
function SectionLearning() {
  return (
    <section id="fraedsla" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Upp aftur" depth={5} kicker="Fræðsla og miðlun" title="Næsta kynslóð" />
        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <PeelFrame
              src={IMG.hreindyrKrakkar.src}
              alt={IMG.hreindyrKrakkar.alt}
              srcSet={IMG.hreindyrKrakkar.srcSet}
              sizes="(min-width: 1024px) 58vw, 100vw"
              drift={11}
              className="aspect-[4/3] md:aspect-[16/10]"
            />
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="max-w-[48ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
                Skólaheimsóknir eru fastur liður í starfi safnsins: nemendur vinna með alvöru gripi, alvöru hreindýrahorn og alvöru sögu.
              </p>
            </Reveal>
            <div className="mt-8">
              <RowLink href={LINKS.skolaheimsoknir}>Skólaheimsóknir</RowLink>
              <RowLink href={LINKS.joladagatal}>Jóladagatal safnsins</RowLink>
              <RowLink href={LINKS.frodleikur}>Fróðleikur</RowLink>
              <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="mj-cta inline-flex items-center gap-2.5 rounded-full px-5 text-[13px] uppercase tracking-[0.08em]"
                style={{ fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`, color: TEXT, minHeight: 46 }}
              >
                <Instagram size={16} style={{ color: SIENNA }} aria-hidden />
                @minjasafnausturlands
              </a>
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="mj-cta inline-flex items-center gap-2.5 rounded-full px-5 text-[13px] uppercase tracking-[0.08em]"
                style={{ fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`, color: TEXT, minHeight: 46 }}
              >
                <Facebook size={16} style={{ color: SIENNA }} aria-hidden />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER — the aperture closes over the dig ── */
function FooterAperture() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = wrap.current
    if (!el) return
    return addJob((vh, vw) => {
      const r = el.getBoundingClientRect()
      if (r.top > vh + 60) return
      const p = clamp01((vh - r.top) / r.height)
      const eased = Math.pow(p, 1.5)
      const hMax = vw >= 768 ? 22 : 10
      const rMax = vw >= 768 ? 26 : 18
      /* vertical inset in px, capped: 8% of a tall wrapper would decapitate
         the wordmark once the wrapper top has scrolled past the viewport */
      const vMax = Math.min(r.height * 0.08, 52)
      const v = (eased * vMax).toFixed(1)
      const h = (eased * hMax).toFixed(2)
      const rad = (eased * rMax).toFixed(1)
      return () => {
        el.style.clipPath = `inset(${v}px ${h}% round ${rad}px)`
      }
    })
  }, [])

  return (
    <footer aria-label="Neðanmál">
      <div ref={wrap} className="mj-ap" style={{ background: GROUND_DEEP }}>
        <div
          className="mx-auto flex min-h-[78svh] w-full max-w-[560px] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:min-h-[84svh]"
          style={{ maxWidth: 'min(560px, 52vw + 120px)' }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}>
            Lag fyrir lag
          </p>
          <p
            className="mt-4 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(1.6rem,4vw,2.8rem)]"
            style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}
          >
            Minjasafn Austurlands
          </p>
          <div className="mt-8 flex flex-col items-center gap-2.5">
            <p className="flex items-center gap-2 text-[15px]" style={{ color: MUT }}>
              <MapPin size={15} style={{ color: SIENNA }} aria-hidden />
              {CONTACT.address}
            </p>
            <a href={CONTACT.emailHref} className="mj-ul flex items-center gap-2 text-[15px]" style={{ color: TEXT }}>
              <Mail size={15} style={{ color: SIENNA }} aria-hidden />
              {CONTACT.email}
            </a>
          </div>
          <div className="mt-8 w-full" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="mt-5 text-[13px] leading-relaxed" style={{ color: MUT }}>
              Vetur, 1. sept til 31. maí: þri til fös 11:00–16:00.
              <br />
              Sumar, 1. júní til 31. ágúst: mán til fös 10:00–17:00, lau 11:00–17:00.
            </p>
          </div>
          <p className="mt-6 text-[13px]" style={{ color: MUT }}>
            Opinbert byggðasafn Austurlands, stofnað 1943.
          </p>
          <a
            href={CONTACT.website}
            target="_blank"
            rel="noreferrer"
            className="mj-ul mt-5 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
          >
            minjasafn.is
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ── LOADER · KJARNASÝNI ──────────────────────────────────────────────────
   Architecture borrowed from the Heklusýn preloader (session-once, hard
   capped, absent under reduced motion); the look and the payload are this
   page's own.

   Progress is REAL: the images of the FIRST VIEW plus one unit for the
   variable face. Two exclusions, both measured rather than assumed:
     · loading="lazy" images never decode while a full-screen overlay keeps
       them out of the viewport, so counting them would stall the reading
       until the cap (this page lazy-loads 20+ archive frames);
     · anything laid out below the first viewport — the preview chrome and
       footer furniture live down there, and one of their images never
       settled at all, which pinned the measured reading at 74% for 800ms
       until the cap released it. What is counted is exactly what the visitor
       is looking at when the loader lifts.
   Completion is polled from im.complete in the read phase rather than from
   load events, so a decode that finished before the listener was attached,
   or an image swapped by srcset, can never leave a unit hanging.

   The displayed value is min(real, elapsed/FLOOR): it can never run ahead of
   the actual decode, and it can never finish before the floor. Without that
   floor a warm cache has every image .complete at mount and the loader would
   appear and vanish inside one frame.

   Four guarantees, each one a bug already shipped once:
     · any input lands it (pointerdown / touchmove / wheel / keydown) and the
       overlay is pointer-events: none, so the dismissing gesture still
       reaches the page;
     · the scroll lock is released on skip, on completion, at the cap and on
       unmount, and the final release is a setTimeout, so a dead
       requestAnimationFrame can never leave the page locked;
     · nothing here uses background-clip: text;
     · no per-frame setState: one job on the page's shared rAF loop, reads
       first, writes second, textContent and style only. ── */
const LOAD_KEY = 'mj-kjarnasyni-seen'
const LOAD_FLOOR = 1100 /* minimum time the reading is allowed to take */
const LOAD_FORCE = 1250 /* cap on the reading phase: past this it completes */
const LOAD_FORCE_RAMP = 220 /* and it completes over this, linearly, not damped */
const LOAD_HOLD = 70 /* one beat with the reading complete */
const LOAD_EXIT = 620 /* the composed exit */
const LOAD_SKIP_EXIT = 380
const LOAD_FAILSAFE = 2240 /* absolute ceiling, independent of rAF */

function loaderShouldMount() {
  if (typeof window === 'undefined') return false
  /* reduced motion wins over everything, including ?loader */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    if (new URLSearchParams(window.location.search).has('loader')) return true
  } catch { /* malformed query string: fall through to the session check */ }
  try {
    if (sessionStorage.getItem(LOAD_KEY) === '1') return false
  } catch { /* private mode throws: show it */ }
  return true
}

function CoreSampleLoader() {
  /* lazy initialiser, not an effect: the decision is made during the first
     client render, so the page is never painted bare for a frame first */
  const [shown, setShown] = useState(loaderShouldMount)
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!shown) return
    const root = rootRef.current
    const fill = fillRef.current
    if (!root || !fill) return
    try { sessionStorage.setItem(LOAD_KEY, '1') } catch { /* private mode */ }

    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }

    /* ── real decode progress ── */
    const vh0 = window.innerHeight
    const imgs = Array.from(document.images).filter((im) => {
      if (im.loading === 'lazy') return false
      const r = im.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.top < vh0 * 1.15 && r.bottom > -1
    })
    const totalUnits = imgs.length + 1
    let fontsSettled = false
    const settleFonts = () => { fontsSettled = true }
    if (document.fonts?.ready) document.fonts.ready.then(settleFonts).catch(settleFonts)
    else settleFonts()

    const t0 = performance.now()
    let forced = 0 /* the timestamp the cap fired, 0 while it has not */
    let pAtForce = 0
    let p = 0
    let lastWhole = -1
    let finishing = false
    let stopJob: (() => void) | undefined
    let endTimer = 0
    let holdTimer = 0

    const forceTimer = window.setTimeout(() => {
      forced = performance.now()
      pAtForce = p
    }, LOAD_FORCE)

    const detachInput = () => {
      window.removeEventListener('pointerdown', onInput, true)
      window.removeEventListener('touchmove', onInput, true)
      window.removeEventListener('wheel', onInput, true)
      window.removeEventListener('keydown', onInput, true)
    }

    const finish = (skipped: boolean) => {
      if (finishing) return
      finishing = true
      window.clearTimeout(forceTimer)
      window.clearTimeout(holdTimer)
      stopJob?.()
      detachInput()
      unlock() /* released the instant the exit starts, so the gesture that
                  dismissed the loader keeps scrolling the page */
      root.classList.add('is-out')
      if (skipped) root.classList.add('is-skip')
      endTimer = window.setTimeout(
        () => setShown(false),
        (skipped ? LOAD_SKIP_EXIT : LOAD_EXIT) + 30,
      )
    }

    function onInput() { finish(true) }
    const opts: AddEventListenerOptions = { passive: true, capture: true }
    window.addEventListener('pointerdown', onInput, opts)
    window.addEventListener('touchmove', onInput, opts)
    window.addEventListener('wheel', onInput, opts)
    window.addEventListener('keydown', onInput, opts)

    stopJob = addJob(() => {
      if (finishing) return
      const now = performance.now()
      let done = fontsSettled ? 1 : 0
      for (let i = 0; i < imgs.length; i++) if (imgs[i].complete) done++
      const real = done / totalUnits
      const floorP = (now - t0) / LOAD_FLOOR
      if (forced) {
        /* past the cap the reading closes on a short linear ramp, never on
           the damper: damping the last 26% cost 445ms and pushed the exit
           into the failsafe */
        p = Math.min(1, pAtForce + (1 - pAtForce) * ((now - forced) / LOAD_FORCE_RAMP))
      } else {
        const target = Math.min(real, floorP, 1)
        const gap = target - p
        /* light damper so a step in the real count arrives as a movement of
           soil rather than a jump; snaps the last sliver so it always closes */
        p = gap < 0.006 ? target : p + gap * 0.28
      }
      const v = p
      return () => {
        fill.style.transform = `scaleX(${v.toFixed(4)})`
        const whole = Math.round(v * 100)
        if (whole !== lastWhole) {
          lastWhole = whole
          const pe = pctRef.current
          if (pe) pe.textContent = `${String(whole).padStart(3, '0')}%`
        }
        if (v >= 0.9995 && !holdTimer) {
          /* a beat with the reading complete before it is withdrawn */
          holdTimer = window.setTimeout(() => finish(false), LOAD_HOLD)
        }
      }
    })

    /* the only guarantee that survives a dead rAF */
    const failsafe = window.setTimeout(() => {
      stopJob?.()
      detachInput()
      unlock()
      setShown(false)
    }, LOAD_FAILSAFE)

    return () => {
      window.clearTimeout(forceTimer)
      window.clearTimeout(failsafe)
      window.clearTimeout(endTimer)
      window.clearTimeout(holdTimer)
      stopJob?.()
      detachInput()
      unlock()
    }
  }, [shown])

  if (!shown) return null

  return (
    <>
      <div ref={rootRef} className="mj-load" aria-hidden="true">
        <div className="mj-load-mod" style={{ fontFamily: DISPLAY }}>
          <p className="mj-load-mark">
            <span>Minjasafn</span>
            <span>Austurlands</span>
          </p>
          <div className="mj-load-track">
            <div ref={fillRef} className="mj-load-bar" />
          </div>
          <div className="mj-load-meta" style={{ marginTop: 12 }}>
            <span>Laufskógar 1, Egilsstöðum</span>
            <span ref={pctRef} className="mj-load-pct">000%</span>
          </div>
        </div>
      </div>
      <p className="mj-load-sr" role="status">Síðan er að hlaðast.</p>
    </>
  )
}

/* ── the page ── */
export default function Page() {
  /* mj-js is applied after mount so the resting no-script state is always
     the fully excavated page (photo + wordmark + copy, no strata) */
  const [js, setJs] = useState(false)
  useEffect(() => {
    setJs(true)
  }, [])

  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    /* one preload only: the variable face wins the family match at every
       weight the page uses, so preloading the three statics as well would
       just pull 60kB the renderer never paints with */
    const preloads = [
      `${F_CABINET}/CabinetGrotesk-Variable.woff2`,
    ].map((href) => {
      const l = document.createElement('link')
      l.rel = 'preload'
      l.as = 'font'
      l.type = 'font/woff2'
      l.href = href
      l.crossOrigin = 'anonymous'
      document.head.appendChild(l)
      return l
    })
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
      preloads.forEach((l) => l.remove())
    }
  }, [])

  return (
    <div
      className={`mj-page ${js ? 'mj-js' : ''} min-h-[100svh] antialiased`}
      style={{ background: GROUND, color: TEXT, fontFamily: DISPLAY, fontWeight: 400 }}
    >
      <style>{CSS}</style>
      <CoreSampleLoader />
      <a href="#efni" className="mj-skip">Beint í efnið</a>
      <Nav />
      <main id="efni">
        <SectionHero />
        <SectionStatus />
        <SectionExhibitions />
        <SectionGripur />
        <SectionArchive />
        <SectionContactSheet />
        <SectionSaga />
        <SectionProjects />
        <SectionLearning />
      </main>
      <FooterAperture />
      <div
        className="px-5 py-5 text-center text-[11px] tracking-[0.16em]"
        style={{ color: MUT, borderTop: `1px solid ${HAIR}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
