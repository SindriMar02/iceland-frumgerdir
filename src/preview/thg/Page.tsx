import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, KT, MAP_LINK,
  PRACTICE, THESIS_QUOTES, CODENAME, TAGLINE, PROJECTS, INTERIORS,
  TVENNS_KONAR, KOLASUNDID, PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'
import type { Project } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('thgOut', '0.25,1,0.5,1')
CustomEase.create('thgIn', '0.5,0,0.75,0')
CustomEase.create('thgInOut', '0.75,0,0.25,1')
CustomEase.create('thgJourney', '0.25,0,0.75,1')

const company = getPreviewCompany('thg')

/* ── THG Arkitektar — "Staðarandi" ───────────────────────────────────────
   Design system transplanted from the era-residence.com teardown (the
   MECHANICS only — fluid canvas, self-theming chrome, six reveal
   primitives, horizontal journey). Surface is entirely THG's own: concrete
   and graphite, two grotesk faces, colour drawn only from the seven
   projects' own photography. No arches, no Didone, no gold-on-black.

   Judged by architects. Restraint over decoration, always. ──────────────── */

const CONCRETE = '#E8E6E1'
const GRAPHITE = '#1C1D1F'
const INK = '#16181A'
const MUTED = '#5A5E62'
const BRICK = '#A8412A'
const PAPER = '#E8E6E1'
const PAPER_MUTED = '#A7A6A3'

const DISPLAY = "'THG Sentient', Georgia, 'Times New Roman', serif"
const BODY = "'THG Switzer', 'Helvetica Neue', Arial, sans-serif"
const FONTS_SENTIENT = `${import.meta.env.BASE_URL}fonts/sentient/`
const FONTS_SWITZER = `${import.meta.env.BASE_URL}fonts/switzer/`

/* Duration ladder + easing — BRIEF §5.3 / era teardown Phase 6, verbatim. */
const DUR = { s: 0.4, m: 0.8, l: 1.2 }
const EASE = { out: 'thgOut', in: 'thgIn', inout: 'thgInOut' }

const FOCUS_CLASS = 'thg-focus-ring'

/* ── Per-project themes — each ground colour was sampled from that
   building's OWN photograph (median-cut quantisation of the actual JPEG,
   picked for the most distinct swatch), then nudged to clear WCAG AA
   against its paired text colour. Verified ratios (relative-luminance
   formula, computed 2026-07-27):

     borg       ground #2E1911  text #E8E6E1 (paper)  → 13.33:1  AAA
     marina     ground #23302F  text #E8E6E1 (paper)  → 10.97:1  AAA
     konsulat   ground #E4E7EA  text #16181A (ink)     → 14.34:1  AAA
     von        ground #DEDDD9  text #16181A (ink)     → 13.10:1  AAA
     eir        ground #EDE7DB  text #16181A (ink)     → 14.46:1  AAA
     hrafnista  ground #E3E5EA  text #16181A (ink)     → 14.12:1  AAA
     saavik     ground #E6E1D2  text #16181A (ink)     → 13.62:1  AAA

   Each theme's small saturated "accent" (a genuine colour lifted straight
   from that project's own photo) is DECORATIVE ONLY — underlines, dots,
   the field-label rule — never body text; see contrast notes inline. ──── */
const THEME_CSS = `
.thg-root [data-thg-theme="concrete"] { --thg-bg:${CONCRETE}; --thg-fg:${INK}; --thg-fg-muted:${MUTED}; --thg-focus:${BRICK}; --thg-accent:${BRICK}; }
.thg-root [data-thg-theme="graphite"] { --thg-bg:${GRAPHITE}; --thg-fg:${PAPER}; --thg-fg-muted:${PAPER_MUTED}; --thg-focus:${PAPER}; --thg-accent:${BRICK}; }
.thg-root [data-thg-theme="borg"]      { --thg-bg:#2E1911; --thg-fg:#E8E6E1; --thg-fg-muted:#B9B7B2; --thg-focus:#E8E6E1; --thg-accent:#C79A5B; }
.thg-root [data-thg-theme="marina"]    { --thg-bg:#23302F; --thg-fg:#E8E6E1; --thg-fg-muted:#B9B7B2; --thg-focus:#E8E6E1; --thg-accent:#B36E5C; }
.thg-root [data-thg-theme="konsulat"]  { --thg-bg:#E4E7EA; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#6B7480; }
.thg-root [data-thg-theme="von"]       { --thg-bg:#DEDDD9; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#8C8A82; }
.thg-root [data-thg-theme="eir"]       { --thg-bg:#EDE7DB; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#C1642A; }
.thg-root [data-thg-theme="hrafnista"] { --thg-bg:#E3E5EA; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#4C74A8; }
.thg-root [data-thg-theme="saavik"]    { --thg-bg:#E6E1D2; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#8C8355; }
.thg-root [data-thg-theme] { background: var(--thg-bg); color: var(--thg-fg); }
`

const PAGE_STYLES = `
@font-face { font-family:'THG Sentient'; src:url('${FONTS_SENTIENT}Sentient-Light.woff2') format('woff2'); font-weight:300; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Sentient'; src:url('${FONTS_SENTIENT}Sentient-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Sentient'; src:url('${FONTS_SENTIENT}Sentient-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Sentient'; src:url('${FONTS_SENTIENT}Sentient-Italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Semibold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }

/* ═══ 1 — THE FLUID CANVAS (era teardown Phase 2.1 / BRIEF §5.1) ═══════════
   Mathematically identical to "html{font-size:1vw}" + calc(Nrem/ratio) —
   1rem at that font-size literally equals 1vw, so calc(Nrem/ratio) always
   reduces to (N/ratio)vw. Expressing it directly in vw lets the fluid
   canvas stay SCOPED to .thg-root instead of overwriting the shared
   <html> font-size for every other route in this app. */
.thg-root {
  --thg-ratio: 16;   /* desktop canvas: 1600px */
  --thg-u4:  calc(4  * 1vw / var(--thg-ratio));
  --thg-u8:  calc(8  * 1vw / var(--thg-ratio));
  --thg-u12: calc(12 * 1vw / var(--thg-ratio));
  --thg-u16: calc(16 * 1vw / var(--thg-ratio));
  --thg-u24: calc(24 * 1vw / var(--thg-ratio));
  --thg-u32: calc(32 * 1vw / var(--thg-ratio));
  --thg-u48: calc(48 * 1vw / var(--thg-ratio));
  --thg-u64: calc(64 * 1vw / var(--thg-ratio));
  --thg-u96: calc(96 * 1vw / var(--thg-ratio));
  --thg-u160: calc(160 * 1vw / var(--thg-ratio));
  --thg-gutter: var(--thg-u48);
  --thg-chrome-fg: ${PAPER};
}
@media (min-width: 768px) and (max-width: 991px) { .thg-root { --thg-ratio: 8.34; --thg-gutter: var(--thg-u24); } } /* tablet canvas: 834px */
@media (max-width: 767px) { .thg-root { --thg-ratio: 4.16; --thg-gutter: var(--thg-u24); } } /* mobile canvas: 416px */

.thg-root { font-family: ${BODY}; }
.thg-root ::selection { background: ${INK}; color: ${CONCRETE}; }
.thg-container { padding-inline: var(--thg-gutter); }

${THEME_CSS}

/* ═══ 2 — SELF-THEMING FIXED CHROME (era Phase 5.4 / addendum device 7) ════
   #thg-chrome sits outside every themed section, so it cannot inherit
   --thg-fg by cascade. Outside the journey, Page.tsx reads each themed
   VERTICAL zone's own computed --thg-fg and writes it onto the bulk
   --thg-chrome-fg only when the active zone changes. Inside the horizontal
   journey each [data-thg-chrome-part] (logo+wordmark, codename badge) is
   re-themed INDEPENDENTLY — its own bounding-box centre is tested against
   the project panel currently beneath it, era §5.4's per-element-centre
   idea adapted to the horizontal axis — via --thg-part-fg, which wins over
   the bulk colour by cascade specificity. Neither write happens on every
   scroll tick, only when the active zone/panel actually changes, so this
   0.4s colour transition never fights a per-frame write (the "no CSS
   transition on a scrub-driven property" rule). */
#thg-chrome { color: var(--thg-chrome-fg); transition: color ${DUR.s}s cubic-bezier(.25,1,.5,1); }
#thg-chrome [data-thg-chrome-part] { color: var(--thg-part-fg, inherit); transition: color ${DUR.s}s cubic-bezier(.25,1,.5,1); }

/* ═══ 3 — FOCUS — visible on both concrete and graphite grounds ═══════════
   Each theme block above defines --thg-focus to the colour that clears
   3:1 against ITS OWN ground (paper on the dark project/graphite grounds,
   brick on every light one) — see the contrast table in the comment above
   THEME_CSS. */
.thg-root .${FOCUS_CLASS}:focus-visible,
.thg-root .thg-track:focus-visible,
.thg-root a:focus-visible,
.thg-root button:focus-visible {
  outline: 2px solid var(--thg-focus, ${BRICK});
  outline-offset: 3px;
  border-radius: 1px;
}

/* ═══ 4 — SIX REVEAL PRIMITIVES, era Phase 5.7 / BRIEF §5.3 ════════════════
   Every element below keeps its ORDINARY resting layout in plain CSS —
   there is no opacity:0 default anywhere on this page. JS (inside a
   prefers-reduced-motion:no-preference matchMedia branch) calls
   gsap.from(el, hiddenState) which briefly sets an inline "from" style and
   animates BACK to the element's natural computed style. If JS never runs,
   or a crawler/screenshot service renders before ScrollTrigger fires, the
   element is simply sitting at its normal, fully visible layout — nothing
   to "clear". A 2s failsafe (Page(), below) additionally clears any
   leftover inline reveal styles as a backstop against a stuck mid-tween
   frame. Icelandic accents (þ/ð/á/é/í/ó/ú/ý/æ/ö) get line-height ≥1.22 on
   every char-split element so ascenders/accents are never guillotined by
   the SplitText line mask. */
.thg-chars { line-height: 1.22 !important; }
/* SplitText char elements MUST stay inline-block. GSAP's own mask option
   emits block-level wrappers in this version, which stacks every character
   on its own line, so the per-character mask is done here instead. */
/* Fixed-chrome legibility scrim: sits behind the bar, fades to nothing.
   Only visible where it is needed (over bright photography). */
.thg-chrome-bar { position: fixed; }
.thg-chrome-scrim {
  position: absolute; inset: -1px 0 auto 0; height: 132px; z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(18,20,22,.72) 0%, rgba(18,20,22,.46) 46%, rgba(18,20,22,0) 100%);
}
.thg-root[data-thg-chrome-ground='light'] .thg-chrome-scrim {
  background: linear-gradient(180deg, rgba(232,230,225,.88) 0%, rgba(232,230,225,.55) 46%, rgba(232,230,225,0) 100%);
}
.thg-word {
  display: inline-block;
  white-space: nowrap;
  vertical-align: top;
  overflow: hidden;
  padding-bottom: 0.20em;
  margin-bottom: -0.20em;
}
.thg-char { display: inline-block; }
/* Keeps each word atomic so a line never breaks between two characters. */
.thg-hero-h1 > div, .thg-hero-h1 > span,
[data-thg-reveal='h'] > div, [data-thg-reveal='h'] > span { display: inline-block; vertical-align: top; }
.thg-lines { line-height: 1.5; }

/* ═══ 5 — THE APERTURE SHUTTER, three beats (addendum device 1 / era §11) ═
   Resting state (no JS, and the failsafe end-state): both panels sit fully
   off-canvas (translateX ±100% of their OWN half-width) — the photo and
   the hero copy are fully visible from the very first paint, nothing to
   "clear". JS plays a TIME-BASED (not scroll-triggered) three-beat
   timeline that starts from this exact resting position, so there is no
   flash at tween creation:
     1. CONVERGE  — both panels slide in from the outer edges to translateX
        0, meeting at the centre seam and, together, covering the full
        frame (photo + hero copy included).
     2. MERGE+HOLD — an explicit pause once they read as one covering
        plane (.thg-shutter-plane, the wrapper around both halves).
     3. PUSH THROUGH — the merged plane scales past the viewer
        (scale → 1.6) while it fades, clearing the frame and revealing the
        photo underneath — echoing era's arch shutter, which scales its
        merged aperture 1 → 1.84 as "the camera pushes through".
   Only transform/opacity are ever written inline, so the ~2s failsafe
   (clearProps:'transform,clipPath', Page() below) can always recover a
   stuck mid-tween frame back to this exact resting, fully-open state. */
.thg-shutter-plane { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
.thg-shutter { position: absolute; top: 0; bottom: 0; width: 50%; background: ${GRAPHITE}; }
.thg-shutter-left  { left: 0; transform: translateX(-100%); }
.thg-shutter-right { right: 0; transform: translateX(100%); }
.thg-hero-frame { position: absolute; inset: 0; overflow: hidden; }
.thg-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 62%; }

/* ═══ 6 — THE HORIZONTAL JOURNEY (addendum device 2 / era §5.6) ═══════════
   Base state (mobile AND prefers-reduced-motion:reduce): a plain
   scroll-snap swipe rail — never a scroll-jack, never pinned. Same seven
   panels, same DOM order, real focusable content, screen-reader-linear.

   Promoted at >=992px AND prefers-reduced-motion:no-preference to era's
   OWN mechanism, not a GSAP-managed pin: .thg-journey (the outer runway)
   gets its height set in JS to .thg-track's scrollWidth — one vertical
   pixel of runway per horizontal pixel of travel, the "1:1 mapping" the
   brief asks for — while .thg-journey-sticky (the viewport window) is a
   plain CSS position:sticky, so it stays pinned to the top of the
   viewport for exactly the runway's length with no spacer div, no pin
   bookkeeping. .thg-track is the element GSAP actually translates. */
.thg-journey { position: relative; }
.thg-track {
  display: flex; overflow-x: auto; overflow-y: hidden;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.thg-track::-webkit-scrollbar { display: none; }
.thg-panel { flex: 0 0 88vw; scroll-snap-align: start; min-height: 78svh; }
@media (min-width: 480px) { .thg-panel { flex-basis: 62vw; } }
.thg-journey-label { padding: var(--thg-u32) var(--thg-gutter) var(--thg-u16); }
.thg-progress { display: none; }

@media (min-width: 992px) and (prefers-reduced-motion: no-preference) {
  .thg-journey-sticky {
    position: sticky; top: 0; height: 100svh; overflow: hidden;
    display: block;
  }
  .thg-track {
    position: relative; overflow: visible; scroll-snap-type: none;
    width: max-content; height: 100svh; align-items: stretch;
    will-change: transform; backface-visibility: hidden;
  }
  .thg-panel { flex: none; width: 100vw; height: 100svh; min-height: 0; scroll-snap-align: none; }
  .thg-panel-title { display: inline-block; will-change: transform; }
  .thg-journey-label {
    position: absolute; left: 0; bottom: 0; z-index: 5; pointer-events: none;
    padding: 0 var(--thg-gutter) var(--thg-u32);
  }
  .thg-progress {
    display: block; position: absolute; left: 0; right: 0; bottom: 0; z-index: 6;
    height: 3px; transform-origin: left center; transform: scaleX(0);
    background: ${BRICK};
  }
}

/* ═══ 7 — Reduced motion: neutralise anything decorative that remains ═════ */
@media (prefers-reduced-motion: reduce) {
  .thg-hero-img { transform: none !important; }
}

/* ═══ 8 — Misc furniture ════════════════════════════════════════════════ */
.thg-rule { height: 1px; width: 100%; transform-origin: left center; }
.thg-field-row + .thg-field-row { border-top-width: 1px; }
.thg-diagram-path { fill: none; stroke-width: 1.5; }

/* ═══ 9 — GROWING ARC CTA (addendum device 4 / era §2.7(b)) ════════════════
   Zero JS hover: a CSS custom-property state machine exactly like era's
   circle CTA. --thg-arc-dash starts at 0.0417×C (a short tick, C = 2π×44 ≈
   276.46) and is reassigned to C/2 — a half circle, NEVER the full ring —
   by :hover (gated to pointer-capable desktop widths only) and by
   :focus-visible (kept UNGATED by width, honouring the page-wide
   ":focus-visible on everything" rule ahead of the brief's narrower
   hover-only framing). The dash itself only ever transitions on those two
   discrete state changes, never on a scroll tick. */
.thg-arc-cta {
  --thg-arc-dash: 11.53;
  position: relative; display: inline-flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  width: 88px; height: 88px; border-radius: 50%;
}
.thg-arc-ring { stroke-dasharray: var(--thg-arc-dash) calc(276.46 - var(--thg-arc-dash)); transition: stroke-dasharray ${DUR.m}s cubic-bezier(.75,0,.25,1); }
.thg-arc-cta:focus-visible { --thg-arc-dash: 138.23; }
@media (min-width: 992px) {
  .thg-arc-cta:hover { --thg-arc-dash: 138.23; }
}
.thg-arc-label { position: relative; z-index: 1; text-align: center; line-height: 1.3; }
`

/* ═══════════════════════════ small helpers ════════════════════════════ */
function Kicker({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <p
      className="m-0 text-[11px] font-medium uppercase tracking-[0.24em]"
      style={{ fontFamily: BODY, color: tone ?? 'var(--thg-fg-muted)' }}
    >
      {children}
    </p>
  )
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-thg-reveal="c" className="thg-container pt-16 md:pt-20">
      <div aria-hidden className="thg-rule mb-4" style={{ background: 'var(--thg-fg)', opacity: 0.18 }} />
      <Kicker>{eyebrow}</Kicker>
      <h2
        data-thg-reveal="h"
        className="thg-chars m-0 mt-3"
        style={{ fontFamily: DISPLAY, fontWeight: 500, color: 'var(--thg-fg)', fontSize: 'clamp(1.9rem,4.4vw,3.4rem)', lineHeight: 1.12, letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="thg-field-row flex items-baseline justify-between gap-6 py-2.5" style={{ borderColor: 'color-mix(in srgb, var(--thg-fg) 16%, transparent)' }}>
      <dt className="m-0 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>{label}</dt>
      <dd className="m-0 text-right text-[17px]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>{value}</dd>
    </div>
  )
}

/* ═══════════════════════════ CHROME — the fixed logo + label ═══════════ */
function Chrome() {
  return (
    <div
      id="thg-chrome"
      className="thg-chrome-bar thg-container fixed inset-x-0 top-0 z-40 flex min-h-[56px] items-center justify-between py-3"
    >
      {/* The chrome floats over photography that can be almost white (the Borg
          hero) while its own text is paper-coloured, which left it at roughly
          1.5:1. This scrim guarantees the strip behind it is always dark
          enough to read against, and is invisible over dark grounds. */}
      <span aria-hidden className="thg-chrome-scrim" />
      <a
        href="#thg-top"
        data-thg-chrome-part="brand"
        className={`inline-flex min-h-[44px] items-center gap-2.5 ${FOCUS_CLASS}`}
        aria-label="Fara efst á síðu, THG Arkitektar"
      >
        <img src={IMG('mark')} alt="" aria-hidden className="h-6 w-6 rounded-sm object-cover md:h-7 md:w-7" />
        <span className="text-[12px] font-medium uppercase tracking-[0.22em]" style={{ fontFamily: BODY }}>
          THG Arkitektar
        </span>
      </a>
      <span aria-hidden data-thg-chrome-part="codename" className="hidden text-[11px] uppercase tracking-[0.32em] opacity-80 sm:inline" style={{ fontFamily: BODY }}>
        {CODENAME}
      </span>
    </div>
  )
}

/* ═══════════════════════════ 1 · APERTURE (hero) ════════════════════════ */
function Aperture() {
  return (
    <header
      id="thg-top"
      data-thg-theme="graphite"
      className="thg-chrome-zone relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div className="thg-hero-frame">
        <img
          src={IMG('borg-exterior')}
          alt="Viðbygging Hótel Borgar í Reykjavík, fyrsti áfangi stækkunar hótelsins sem THG Arkitektar hönnuðu."
          className="thg-hero-img"
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          /* The hero photograph is a near-white building against a pale sky, so
             a soft bottom gradient is not enough: the type zone needs a solid
             floor or the eyebrow, H1 and practice line all sit at roughly 1.5:1. */
          style={{ background: 'linear-gradient(180deg, rgba(28,29,31,0) 0%, rgba(22,24,26,.28) 40%, rgba(22,24,26,.80) 68%, rgba(22,24,26,.92) 100%)' }}
        />
      </div>
      <div className="thg-shutter-plane" aria-hidden>
        <div className="thg-shutter thg-shutter-left" />
        <div className="thg-shutter thg-shutter-right" />
      </div>

      <div className="thg-container relative z-[1] w-full pb-14 pt-32 md:pb-20">
        <p className="thg-hero-eyebrow m-0 mb-5 text-[11px] font-medium uppercase tracking-[0.3em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
          {CODENAME}
        </p>
        <h1
          className="thg-hero-h1 thg-chars m-0 max-w-[18ch]"
          style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(2.3rem,6.4vw,5.4rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
        >
          {TAGLINE}
        </h1>
        <p
          className="thg-hero-practice m-0 mt-8 text-[15px] uppercase tracking-[0.14em] md:text-[16px]"
          style={{ fontFamily: BODY, color: PAPER_MUTED }}
        >
          1994 · {PRACTICE.staffLine} · ISO 9001:2015
        </p>
      </div>
    </header>
  )
}

/* ═══════════════════════════ 2 · STAÐARANDI (the thesis) ═══════════════ */
function Stadarandi() {
  return (
    <section id="stadarandi" data-thg-theme="concrete" className="thg-chrome-zone relative pb-20 md:pb-28">
      <SectionHead eyebrow="Rökin" title="Staðarandi" />
      <div className="thg-container mt-10 md:mt-14">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[46ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Þrisvar á sínum eigin vef orðar stofan sömu hugsunina, án þess að nefna hana. Verkin sjálf segja hana best.
        </p>
        <ol className="m-0 mt-12 grid list-none gap-10 p-0 md:mt-16 md:grid-cols-3 md:gap-8">
          {THESIS_QUOTES.map((t, i) => (
            <li key={t.project} data-thg-reveal="c">
              <span aria-hidden data-thg-reveal="a" className="thg-chars block text-[12px] font-medium tracking-[0.1em]" style={{ fontFamily: BODY, color: BRICK }}>
                0{i + 1}
              </span>
              <div aria-hidden className="thg-rule my-3" style={{ background: 'var(--thg-fg)', opacity: 0.18 }} />
              <blockquote className="m-0">
                <p className="m-0 text-[19px] leading-[1.45]" style={{ fontFamily: DISPLAY, fontWeight: 400, color: 'var(--thg-fg)' }}>
                  „{t.quote}"
                </p>
              </blockquote>
              <cite className="mt-4 block text-[12px] font-medium not-italic uppercase tracking-[0.16em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
                {t.project}
              </cite>
              {t.note ? (
                <p className="m-0 mt-1 text-[12px]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>{t.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 3 · VERKIN (horizontal journey) ═══════════ */
function ProjectPanel({ project, index }: { project: Project; index: number }) {
  /* Two solid zones, not a gradient-over-photo: the photo stays at full
     strength (this IS the "one large photograph" the brief asks for), and
     the caption plate below is an OPAQUE var(--thg-bg) fill — the exact
     hex this theme's contrast ratio was computed against (see THEME_CSS
     comment above), never a partial-opacity blend that would drift off
     that verified number. */
  return (
    <article
      className="thg-panel relative flex flex-col overflow-hidden"
      data-thg-theme={project.theme}
      aria-label={project.name}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={IMG(project.image)}
          alt={project.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="thg-container relative shrink-0 py-6 md:py-8" style={{ background: 'var(--thg-bg)' }}>
        <span aria-hidden className="block text-[12px] font-medium tracking-[0.14em]" style={{ fontFamily: BODY, color: 'var(--thg-accent)' }}>
          0{index + 1} / 07
        </span>
        <h3
          data-thg-reveal="c"
          className="thg-panel-title thg-chars m-0 mt-3 max-w-[16ch]"
          style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(1.6rem,3.4vw,2.5rem)', lineHeight: 1.16 }}
        >
          {project.name}
        </h3>
        <dl className="m-0 mt-5 max-w-[30ch]" data-thg-reveal="c">
          <Field label="Staður" value={project.place} />
          <Field label="Ár" value={project.year} />
          <Field label="Umfang" value={project.size} />
          <Field label="Verkkaupi" value={project.client} />
        </dl>
      </div>
    </article>
  )
}

function Verkin() {
  return (
    <section id="verkin" data-thg-theme="graphite" className="thg-chrome-zone thg-journey">
      {/* .thg-journey-sticky is the ONLY thing that becomes position:sticky
          (desktop + no-preference, see PAGE_STYLES §6) — it is also the
          "outgoing layer" the recede-to-dissolve transition (device 3)
          scales and fades as the journey hands off to Innandyra. DOM
          order: the heading precedes the rail so reading/keyboard order
          stays "Verkin" then its seven panels on mobile (plain flow); the
          desktop media query lifts the label into an absolute bottom-left
          overlay, where DOM order no longer matters. */}
      <div className="thg-journey-sticky">
        <div className="thg-journey-label">
          <Kicker tone={PAPER_MUTED}>Sjö byggingar, þrjátíu og tvö ár</Kicker>
          <h2 className="m-0 mt-2 text-[13px] font-medium uppercase tracking-[0.24em]" style={{ fontFamily: BODY, color: PAPER }}>
            Verkin
          </h2>
        </div>
        <div
          className="thg-track"
          data-thg-track
          tabIndex={0}
          role="group"
          aria-label="Verkin, sjö byggingar. Renna lárétt eða nota örvatakka."
        >
          {PROJECTS.map((p, i) => (
            <ProjectPanel key={p.key} project={p} index={i} />
          ))}
        </div>
        <div className="thg-progress" aria-hidden />
      </div>
    </section>
  )
}

/* ═══════════════════════════ 4 · INNANDYRA ══════════════════════════════ */
function Innandyra() {
  return (
    <section id="innandyra" data-thg-theme="concrete" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Rýmin" title="Innandyra" />
      <div className="thg-container mt-8 md:mt-10">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[42ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Þú hefur líklega þegar komið inn í eitt af þessum.
        </p>
      </div>
      <div className="thg-container mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4">
        {INTERIORS.map((shot) => (
          <figure key={shot.image} data-thg-reveal="c" className="m-0">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={IMG(shot.image)} alt={shot.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-2 text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              {shot.project}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 5 · TVENNS KONAR HÚS ═══════════════════════ */
function TvennsKonarHus() {
  const { hotel, care } = TVENNS_KONAR
  return (
    <section id="tvenns-konar-hus" data-thg-theme="graphite" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Tvær áttir" title="Tvenns konar hús" />
      <div className="thg-container mt-8 md:mt-10">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[44ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Byggingar fyrir eina nótt. Og byggingar fyrir síðustu árin.
        </p>
      </div>
      <div className="thg-container mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-6">
        {[hotel, care].map((h) => (
          <div key={h.label} data-thg-reveal="c" className="flex flex-col overflow-hidden">
            <div className="aspect-[4/3] shrink-0">
              <img src={IMG(h.image)} alt={`${h.project}, ${h.label.toLowerCase()}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            {/* Solid graphite plate, not a gradient over the photo — keeps
                paper-on-graphite at the exact verified 13.52:1 (AAA). */}
            <div className="p-6 md:p-8" style={{ background: GRAPHITE }}>
              <Kicker tone={PAPER_MUTED}>{h.label}</Kicker>
              <p className="m-0 mt-2 text-[15px]" style={{ fontFamily: BODY, color: PAPER }}>{h.project}</p>
              <p className="m-0 mt-3" style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(2.6rem,6vw,4.2rem)', lineHeight: 1 }}>
                {h.figure}
                <span className="ml-3 align-middle text-[14px] font-normal uppercase tracking-[0.1em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
                  {h.unit}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 6 · KOLASUNDIÐ ══════════════════════════════ */
function Kolasundid() {
  return (
    <section id="kolasundid" data-thg-theme="concrete" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Ein hugmynd" title={KOLASUNDID.title} />
      <div className="thg-container mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div data-thg-reveal="slide" className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
          <img src={IMG(KOLASUNDID.image)} alt="Kolasundið, göngugatan sem liggur gegnum jarðhæð Reykjavík Konsúlat." loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        <div>
          <p data-thg-reveal="p" className="thg-lines m-0 text-[17px] leading-[1.75]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
            {KOLASUNDID.body}
          </p>
          <div data-thg-reveal="c" className="mt-10">
            <svg viewBox="0 0 320 90" className="w-full max-w-[22rem]" aria-hidden role="presentation">
              <path
                className="thg-diagram-path"
                d="M8 66 C 70 66, 90 20, 158 20 S 250 66, 312 24"
                style={{ stroke: 'var(--thg-accent, #A8412A)' }}
              />
              <circle cx="8" cy="66" r="3.5" style={{ fill: 'var(--thg-fg)' }} />
              <circle cx="312" cy="24" r="3.5" style={{ fill: 'var(--thg-fg)' }} />
            </svg>
            <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              <span>Gamli miðbærinn</span>
              <span>Gamla sjávarlóðin</span>
            </div>
            <p className="m-0 mt-4 text-[12px] italic" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              {KOLASUNDID.diagramLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 7 · STOFAN (compliance as monument) ═══════ */
function Stofan() {
  return (
    <section id="stofan" data-thg-theme="graphite" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Stofan" title="Stofan" />
      <div className="thg-container mt-10 md:mt-14">
        <p
          data-thg-reveal="c"
          className="thg-chars m-0"
          style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(3.4rem,11vw,9rem)', lineHeight: 1, letterSpacing: '-0.01em' }}
        >
          1994
        </p>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-10">
          <p data-thg-reveal="c" className="m-0 text-[19px] leading-[1.4]" style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER }}>
            {PRACTICE.staffLine}. {PRACTICE.quality}.
          </p>
          <p data-thg-reveal="p" className="thg-lines m-0 max-w-[46ch] text-[17px] leading-[1.75]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
            {PRACTICE.services}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 8 · SAMBAND ════════════════════════════════ */
function Samband() {
  return (
    <section id="samband" data-thg-theme="graphite" className="thg-chrome-zone pb-24 md:pb-32">
      <SectionHead eyebrow="Hafið samband" title="Samband" />
      <div className="thg-container mt-10 md:mt-14">
        {/* GROWING-ARC CTA — addendum device 4 / era §2.7(b). A fragment of
            ring (0.0417×C) grows to exactly half the circumference on
            hover/focus and deliberately stops there — see .thg-arc-cta in
            PAGE_STYLES for the CSS custom-property state machine that
            drives it; there is no JS hover handler anywhere in this file. */}
        <a
          href={EMAIL_HREF}
          className={`thg-arc-cta mb-12 ${FOCUS_CLASS}`}
          aria-label={`Senda tölvupóst á ${EMAIL}`}
        >
          <svg viewBox="0 0 100 100" width="88" height="88" className="absolute inset-0" aria-hidden focusable="false">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--thg-fg)" strokeOpacity="0.18" strokeWidth="1" />
            <circle className="thg-arc-ring" cx="50" cy="50" r="44" fill="none" stroke="var(--thg-fg)" strokeWidth="1.5" transform="rotate(-90 50 50)" />
          </svg>
          <span className="thg-arc-label text-[11px] font-medium uppercase tracking-[0.14em]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
            Senda<br />póst
          </span>
        </a>
        <dl className="m-0 max-w-[34rem]">
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Heimilisfang</dt>
            <dd className="m-0 text-right">
              <a href={MAP_LINK} target="_blank" rel="noreferrer" className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {ADDRESS}
              </a>
            </dd>
          </div>
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Sími</dt>
            <dd className="m-0 text-right">
              <a href={PHONE_HREF} className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Netfang</dt>
            <dd className="m-0 text-right">
              <a href={EMAIL_HREF} className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {EMAIL}
              </a>
            </dd>
          </div>
        </dl>
        <p className="m-0 mt-10 text-[12px]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>THG Arkitektar ehf · {KT}</p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════ PAGE ════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const journeyActiveRef = useRef(false)

  useEffect(() => {
    document.title = PAGE_TITLE
    setThemeColor(GRAPHITE)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDesc = meta.content
    meta.content = PAGE_DESCRIPTION
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => {
      s.remove()
      if (created) meta?.remove()
      else if (meta) meta.content = prevDesc
    }
  }, [])

  /* Self-theming chrome for the VERTICAL page (era §5.4 / BRIEF §5.2): the
     fixed chrome reads the CSS custom property of whichever top-level
     section currently sits at its own vertical position, and only writes
     when the active zone actually changes. Runs regardless of
     prefers-reduced-motion — a colour swap is not the kind of motion that
     rule guards against, and the chrome must stay legible either way.
     Deliberately paused (journeyActiveRef) while the horizontal journey is
     pinned; the GSAP effect below drives chrome colour there instead, keyed
     to which project panel is centred rather than page scroll position. */
  useEffect(() => {
    const chrome = document.getElementById('thg-chrome')
    if (!chrome) return
    const zones = Array.from(document.querySelectorAll<HTMLElement>('.thg-chrome-zone'))
    const CHROME_Y = 44
    let raf = 0
    let current: HTMLElement | null = null
    const apply = () => {
      if (journeyActiveRef.current) return
      let active = zones[0] ?? null
      for (const z of zones) {
        const r = z.getBoundingClientRect()
        if (r.top <= CHROME_Y && r.bottom >= CHROME_Y) { active = z; break }
      }
      if (!active || active === current) return
      current = active
      const fg = getComputedStyle(active).getPropertyValue('--thg-fg').trim()
      if (fg) chrome.style.setProperty('--thg-chrome-fg', fg)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; apply() })
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('thg:journey-released', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('thg:journey-released', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* All scroll choreography. Reduced motion: the matchMedia branch returns
     before a single tween is created — every element sits at its normal,
     fully visible resting layout; no pin, no scrub, no shutter, no journey
     pin (the CSS media query above already keeps the journey as a plain
     scroll-snap rail in that case). */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 992px)' },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean }
        if (!c.motion) return undefined
        const q = gsap.utils.selector(root)
        const splits: SplitText[] = []

        /* LENIS + lagSmoothing(0) — addendum device 6: desktop no-preference
           only. Below 992px the ScrollTrigger reveals above still run (this
           whole branch is already gated on prefers-reduced-motion, not on
           desktop), they simply ride native scroll instead of Lenis — no
           smoothing library, no ticker hookup. */
        let lenis: Lenis | undefined
        let tick: ((t: number) => void) | undefined
        if (c.desktop) {
          lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
          lenis.on('scroll', ScrollTrigger.update)
          tick = (t: number) => lenis!.raf(t * 1000)
          gsap.ticker.add(tick)
          gsap.ticker.lagSmoothing(0)
        }

        const journeyEl = q('.thg-journey')[0] as HTMLElement | undefined
        const journeySticky = q('.thg-journey-sticky')[0] as HTMLElement | undefined
        const track = q('.thg-track')[0] as HTMLElement | undefined
        const panels = q('.thg-panel') as HTMLElement[]
        const progressEl = q('.thg-progress')[0] as HTMLElement | undefined
        const chromeParts = q('[data-thg-chrome-part]') as HTMLElement[]
        const chromePanelState = new Map<HTMLElement, HTMLElement>()
        let journeyTween: gsap.core.Tween | undefined

        /* .thg-journey's height IS .thg-track's scrollWidth — the "1:1
           mapping" era §5.6 describes — so it has to be resynced whenever
           track width can change: on mount, after fonts/images finish
           loading (below), and on resize. */
        const syncJourneyHeight = () => {
          if (journeyEl && track) journeyEl.style.height = `${track.scrollWidth}px`
        }

        if (c.desktop && journeyEl && journeySticky && track) {
          syncJourneyHeight()

          /* THE HORIZONTAL JOURNEY — addendum device 2 / era §5.6. Not a
             GSAP pin: .thg-journey-sticky is a plain CSS position:sticky
             viewport (PAGE_STYLES §6), so no pin-spacer bookkeeping exists
             at all — exactly era's own mechanism, not an approximation of
             it. journeyTween is a TWEEN (never a timeline: containerAnimation
             requires one) with the exact ease/scrub/dead-zone era uses. */
          const dist = () => Math.max(1, track.scrollWidth - window.innerWidth)
          journeyTween = gsap.to(track, {
            x: () => -dist(),
            ease: 'thgJourney',
            force3D: true,
            scrollTrigger: {
              trigger: journeyEl,
              start: '2.5% top',
              end: '97.5% bottom',
              scrub: 0.25,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressEl) progressEl.style.transform = `scaleX(${self.progress})`
                journeyActiveRef.current = self.isActive

                /* PER-PROJECT CHROME, device 7: each fixed chrome element
                   (logo+wordmark, codename badge) is tested against its OWN
                   horizontal centre, independently of the others — era
                   §5.4's per-element-centre idea, adapted from "which
                   vertical section is at my centre" to "which panel is
                   under my centre right now". Only writes (and only
                   transitions, via the CSS §2 rule) when that element's own
                   panel actually changes. */
                chromeParts.forEach((part) => {
                  const r = part.getBoundingClientRect()
                  const cx = r.left + r.width / 2
                  const panel = panels.find((p) => {
                    const pr = p.getBoundingClientRect()
                    return cx >= pr.left && cx <= pr.right
                  })
                  if (!panel || chromePanelState.get(part) === panel) return
                  chromePanelState.set(part, panel)
                  const fg = getComputedStyle(panel).getPropertyValue('--thg-fg').trim()
                  if (fg) part.style.setProperty('--thg-part-fg', fg)
                })
              },
              onEnter: () => { journeyActiveRef.current = true },
              onEnterBack: () => { journeyActiveRef.current = true },
              onLeave: () => {
                journeyActiveRef.current = false
                chromeParts.forEach((part) => { part.style.removeProperty('--thg-part-fg'); chromePanelState.delete(part) })
                window.dispatchEvent(new Event('thg:journey-released'))
              },
              onLeaveBack: () => {
                journeyActiveRef.current = false
                chromeParts.forEach((part) => { part.style.removeProperty('--thg-part-fg'); chromePanelState.delete(part) })
                window.dispatchEvent(new Event('thg:journey-released'))
              },
            },
          })

          /* DIFFERENTIAL TITLE DRIFT — the second half of device 2: each
             panel's project name travels at a slightly different rate than
             its photograph (which doesn't move inside its panel at all —
             rate 0), riding the SAME containerAnimation as the horizontal
             pan itself. Rates alternate sign/magnitude per panel so no two
             neighbours drift identically. */
          const driftRates = [7, -9, 5, -11, 8, -6, 10]
          panels.forEach((panel, i) => {
            const title = panel.querySelector<HTMLElement>('.thg-panel-title')
            if (!title) return
            const rate = driftRates[i % driftRates.length]
            gsap.fromTo(title,
              { xPercent: -rate },
              {
                xPercent: rate, ease: 'none',
                scrollTrigger: { containerAnimation: journeyTween, trigger: panel, start: 'left right', end: 'right left', scrub: true },
              })
          })

          /* RECEDE-TO-DISSOLVE — addendum device 3 / era's amenities exit
             (§9 "dissolving" not "zooming"): the sticky viewport window
             (the journey's "outgoing layer") scales toward 2 while it
             fades, scrubbed across the runway's final stretch, so the
             handoff into Innandyra is a dissolve, never a hard cut. */
          gsap.fromTo(journeySticky,
            { scale: 1, opacity: 1 },
            {
              scale: 2, opacity: 0, ease: EASE.in, transformOrigin: '50% 50%',
              scrollTrigger: { trigger: journeyEl, start: '85% bottom', end: 'bottom top', scrub: 0.5 },
            })
        }

        /* Per-element trigger: inside the journey it rides
           containerAnimation with left-based positions; everywhere else
           (the seven normal vertical sections) it's a plain viewport
           trigger. Mobile/tablet (journeyTween undefined) never wires a
           containerAnimation — the track there is a native scroll-snap
           rail, not a scrub target. */
        const trig = (el: Element, v: string, h: string, extra?: Record<string, unknown>): ScrollTrigger.Vars => {
          const inTrack = !!(el as HTMLElement).closest?.('.thg-track')
          return (inTrack && journeyTween
            ? { trigger: el, containerAnimation: journeyTween, start: h, ...extra }
            : { trigger: el, start: v, ...extra }) as ScrollTrigger.Vars
        }

        /* THE APERTURE SHUTTER, three beats — addendum device 1 / era §11.
           Time-based (the hero is visible at load, not scroll-triggered).
           See PAGE_STYLES §5: the resting/failsafe state is already fully
           open (both panels off-canvas), so this timeline starts exactly
           there with no flash, closes, holds, then pushes through. */
        const shutterLeft = q('.thg-shutter-left')[0] as HTMLElement | undefined
        const shutterRight = q('.thg-shutter-right')[0] as HTMLElement | undefined
        const shutterPlane = q('.thg-shutter-plane')[0] as HTMLElement | undefined
        if (shutterLeft && shutterRight && shutterPlane) {
          gsap.timeline({ delay: 0.1 })
            // BEAT 1 — CONVERGE: both panels slide in from the outer edges
            // and meet at the centre seam, together covering the full frame.
            .fromTo(shutterLeft, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: EASE.inout })
            .fromTo(shutterRight, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: EASE.inout }, '<')
            // BEAT 2 — MERGE + HOLD: they now read as one covering plane;
            // an explicit pause before it opens.
            .to(shutterPlane, { duration: 0.2 })
            // BEAT 3 — PUSH THROUGH: the merged plane scales past the
            // viewer and fades, clearing the frame — era's arch shutter
            // scales its merged aperture 1 → 1.84 for the same "camera
            // pushes through" read.
            .to(shutterPlane, { scale: 1.6, opacity: 0, duration: 0.55, ease: EASE.in, transformOrigin: '50% 50%' })
        }
        gsap.fromTo(q('.thg-hero-img'), { scale: 1.1 }, { scale: 1, duration: 1.6, ease: EASE.out, delay: 0.1 })
        const heroH1 = q('.thg-hero-h1')[0] as HTMLElement | undefined
        if (heroH1) {
          splits.push(SplitText.create(heroH1, {
            // 'words,chars', never 'chars' alone: inline-block characters with
            // no word wrapper let the browser break a line mid-word ("fyri /
            // r er."). The word wrapper keeps each word atomic.
            // No mask option either: GSAP's mask wrappers render as block-level
            // divs here and would stack every character on its own line.
            type: 'words,chars',
            wordsClass: 'thg-word',
            charsClass: 'thg-char',
            autoSplit: false,
            onSplit: (self) => {
              // fromTo toward the resting state, never gsap.from: a from()
              // tween writes the hidden state as an inline style, so a paused
              // rAF, a crawler or a screenshot service gets an invisible H1.
              // Delay tuned to land as the shutter's push-through beat runs
              // (beat 3 starts at ~0.8s into the timeline above).
              gsap.fromTo(
                self.chars,
                { yPercent: 112 },
                { yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: 0.02, delay: 1.0, clearProps: 'transform' },
              )
              return undefined
            },
          }))
        }
        gsap.fromTo(q('.thg-hero-eyebrow'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: 0.75 })
        gsap.fromTo(q('.thg-hero-practice'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: 1.5 })

        /* THE SIX REVEAL PRIMITIVES, for real — addendum device 5 / era
           §5.7: 'h' (heading chars), 'p' (masked lines), 'line' (clip
           wipe), 'a' (accent chars, rotateX+x — used on the thesis quote
           index badges), 'slide' (skewed clip-path wipe + inner counter-
           scale — used on the Kolasundið photograph) and 'ctn' (the
           fallback branch: opacity+y, for plain containers/groups, never
           substituted for an 'h' or 'p'). Inside the track, only wired on
           desktop: on mobile/tablet the rail is a native scroll-snap
           gesture and every panel shares one vertical position, so a
           vertical ScrollTrigger there would fire for all seven at once.
           Mobile panels simply render at their normal, fully legible
           resting state instead — content is identical either way. */
        const revealables = Array.from(root.querySelectorAll<HTMLElement>('[data-thg-reveal]'))
        revealables.forEach((el, i) => {
          const inTrack = !!el.closest('.thg-track')
          if (inTrack && !c.desktop) return
          const kind = el.dataset.thgReveal
          /* Every reveal below is fromTo, toward the element's resting state.
             gsap.from() would write the hidden state as an inline style at
             ScrollTrigger init, so anything that never advances the timeline
             (paused rAF, a crawler, a screenshot service) would be left with
             permanently invisible content. */
          if (kind === 'h') {
            splits.push(SplitText.create(el, {
              // No mask option: GSAP's char mask wrappers are block-level here
              // and would stack every character on its own line. CSS masks the
              // chars instead (.thg-char), guaranteed inline-block.
              type: 'words,chars', wordsClass: 'thg-word', charsClass: 'thg-char', autoSplit: false,
              onSplit: (self) => {
                gsap.fromTo(self.chars,
                  { yPercent: 112 },
                  {
                    yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: 0.02,
                    clearProps: 'transform',
                    scrollTrigger: trig(el, 'top 85%', 'left 85%', { toggleActions: 'play none none none', once: true }),
                  })
                return undefined
              },
            }))
          } else if (kind === 'p') {
            splits.push(SplitText.create(el, {
              type: 'lines', mask: 'lines', autoSplit: false,
              onSplit: (self) => {
                gsap.fromTo(self.lines,
                  { yPercent: 112 },
                  {
                    yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: 0.08,
                    scrollTrigger: trig(el, 'top 88%', 'left 88%', { toggleActions: 'play none none none', once: true }),
                  })
                return undefined
              },
            }))
          } else if (kind === 'line') {
            gsap.fromTo(el,
              { scaleX: 0 },
              {
                scaleX: 1, duration: DUR.m, ease: EASE.inout, transformOrigin: 'left center',
                scrollTrigger: trig(el, 'top 92%', 'left 92%', { toggleActions: 'play none none none', once: true }),
              })
          } else if (kind === 'a') {
            // Accent chars — era's script/accent primitive (rotateX+x on a
            // short baseline arc). x expressed in vw (not rem) so it stays
            // fluid with .thg-root's scoped canvas rather than the page's
            // unrelated root font-size.
            splits.push(SplitText.create(el, {
              type: 'chars', charsClass: 'thg-char', autoSplit: false,
              onSplit: (self) => {
                gsap.fromTo(self.chars,
                  { yPercent: 112, x: '0.4vw' },
                  {
                    yPercent: 0, x: '0vw', duration: DUR.l, ease: EASE.out, stagger: 0.05,
                    clearProps: 'transform',
                    scrollTrigger: trig(el, 'top 88%', 'left 88%', { toggleActions: 'play none none none', once: true }),
                  })
                return undefined
              },
            }))
          } else if (kind === 'slide') {
            // Skewed clip-path wipe + inner counter-scale — era's slide
            // primitive, used here once for a real photographic reveal
            // rather than a plain opacity fade standing in for it.
            const inner = el.querySelector<HTMLImageElement>('img')
            gsap.fromTo(el,
              { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
              {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: DUR.l, ease: EASE.inout,
                scrollTrigger: trig(el, 'top 82%', 'left 82%', { toggleActions: 'play none none none', once: true }),
              })
            if (inner) {
              gsap.fromTo(inner,
                { scale: 1.5, xPercent: 25 },
                {
                  scale: 1, xPercent: 0, duration: DUR.l, ease: EASE.inout,
                  scrollTrigger: trig(el, 'top 82%', 'left 82%', { toggleActions: 'play none none none', once: true }),
                })
            }
          } else {
            gsap.fromTo(el,
              { opacity: 0, y: 22 },
              {
                opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: (i % 4) * 0.04,
                scrollTrigger: trig(el, 'top 90%', 'left 90%', { toggleActions: 'play none none none', once: true }),
              })
          }
        })

        /* Kolasundið diagram — resting state (no JS) is fully drawn; JS
           animates FROM an undrawn dash-offset back to it. */
        const diagramPath = root.querySelector<SVGPathElement>('.thg-diagram-path') ?? undefined
        if (diagramPath) {
          const len = diagramPath.getTotalLength()
          gsap.set(diagramPath, { strokeDasharray: len })
          gsap.fromTo(diagramPath,
            { strokeDashoffset: len },
            {
              strokeDashoffset: 0, duration: DUR.l * 1.8, ease: EASE.out,
              scrollTrigger: trig(diagramPath, 'top 82%', 'left 82%', { toggleActions: 'play none none none', once: true }),
            })
        }

        /* The track's scrollWidth (and so .thg-journey's JS-set height) is
           only correct once the display font (Sentient changes
           panel-name widths) and every in-track image have finished
           loading — resync + refresh after both so the runway height and
           every trigger's end/x are measured against the true track
           width. */
        document.fonts.ready.then(() => { if (c.desktop) syncJourneyHeight(); ScrollTrigger.refresh() })
        const imgs = Array.from(root.querySelectorAll('.thg-track img'))
        Promise.all(imgs.map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? new Promise<void>((res) => {
            el.addEventListener('load', () => res(), { once: true })
            el.addEventListener('error', () => res(), { once: true })
          })
        })).then(() => { if (c.desktop) syncJourneyHeight(); ScrollTrigger.refresh() })

        /* Panel width is viewport-relative (100vw × 7), so the runway
           height also has to be resynced on resize, not just once at load —
           debounced exactly like era's own resize handler (13.6). */
        let resizeTimer = 0
        const onResize = () => {
          window.clearTimeout(resizeTimer)
          resizeTimer = window.setTimeout(() => {
            if (c.desktop) syncJourneyHeight()
            ScrollTrigger.refresh()
          }, 40)
        }
        window.addEventListener('resize', onResize)

        /* ~2s failsafe (BRIEF §7): clear any leftover inline reveal styles
           regardless of whether their ScrollTrigger has fired yet, so a
           paused rAF, a crawler, or a screenshot service never renders a
           mid-tween "hidden" frame — the shutter panels are included here
           too, so a stuck mid-close frame can never permanently hide the
           hero photo. */
        const failsafe = window.setTimeout(() => {
          // Clear ONLY the properties the reveals animate. clearProps:'all'
          // also wipes React's own inline style attribute, which is where the
          // hero's font-size, font-family and colour live, so it silently
          // reset the H1 to 16px unstyled text two seconds after every load.
          gsap.set(
            root.querySelectorAll(
              '[data-thg-reveal], [data-thg-reveal] *, .thg-hero-h1, .thg-hero-h1 *, .thg-hero-eyebrow, .thg-hero-practice, .thg-shutter-plane, .thg-shutter-left, .thg-shutter-right',
            ),
            { opacity: 1, clearProps: 'transform,clipPath' },
          )
        }, 2000)

        return () => {
          window.clearTimeout(failsafe)
          window.clearTimeout(resizeTimer)
          window.removeEventListener('resize', onResize)
          if (tick) gsap.ticker.remove(tick)
          lenis?.destroy()
          if (journeyEl) journeyEl.style.removeProperty('height')
          chromeParts.forEach((part) => part.style.removeProperty('--thg-part-fg'))
          splits.forEach((sp) => sp.revert())
          journeyActiveRef.current = false
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="thg-root antialiased" style={{ background: CONCRETE, overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <PreviewChrome company={company} />
      <Chrome />
      <main>
        <Aperture />
        <Stadarandi />
        <Verkin />
        <Innandyra />
        <TvennsKonarHus />
        <Kolasundid />
        <Stofan />
        <Samband />
      </main>
      <PreviewFooter company={company} />
    </div>
  )
}
