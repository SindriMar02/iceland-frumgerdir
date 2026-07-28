import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
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
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, COMPANY_LINE, COMPANY_ADDRESS,
  OWNERS, PHOTOS, VISUALS, MOUNTAINS, HOUSES, STATUS_LABEL, DOCUMENTS, ENQUIRY_HOUSES,
  NAV,
} from './data'
import type { HouseStatus } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('hkOut', '0.25,1,0.5,1')
CustomEase.create('hkIn', '0.5,0,0.75,0')
CustomEase.create('hkInOut', '0.75,0,0.25,1')
CustomEase.create('hkDive', '0.6,0,0,1')

const company = getPreviewCompany('heklusyn')

/* ═════════════════════════════════════════════════════════════════════════
   HEKLUSÝN — "Tólf hús". REBUILD per the ERA-FIDELITY ADDENDUM: this is no
   longer an approximation driven by IntersectionObserver + CSS transitions.
   It is the real ERA machine — GSAP SplitText char/line splits, Lenis-fed
   ScrollTrigger scrub, a genuine arch-aperture preloader, a scrubbed dive-in
   hero, a rising dome, a 10-point shutter merge, a footer aperture close,
   and three independently-triggered chrome re-theme points — with the
   Heklusýn identity (chalk/sand/basalt/river, Gambetta + Supreme, land and
   river instead of arches and bougainvillea) unchanged. All facts, prices,
   Tölvumynd labelling and the palette below are the same locked values the
   previous build shipped; only the motion/structure system changed.

   FLUID CANVAS — ERA sets html{font-size:1vw} globally. This app has ~90
   other routes sharing the same <html>, so every --hk-u* token is instead
   written as calc(Nvw / var(--hk-ratio)) — mathematically identical output,
   zero global blast radius.

   Every reveal below is gsap.fromTo(...) toward the resting state — never
   gsap.from(). React always renders the full, final text; GSAP only ever
   writes a transient inline "from" style inside a
   prefers-reduced-motion:no-preference branch, then a 2s failsafe clears any
   leftover inline transform/clip-path. A crawler, a paused rAF tab or a
   screenshot mid-scroll therefore always sees complete, positioned text. ── */

const FONTS_G = `${import.meta.env.BASE_URL}fonts/gambetta/`
const FONTS_S = `${import.meta.env.BASE_URL}fonts/supreme/`

const GAMBETTA = "'HK Gambetta', Georgia, serif"
const SUPREME = "'HK Supreme', -apple-system, sans-serif"

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Palette — unchanged from the previous build, contrast pairs verified
   (relative-luminance formula):
   ink #161A17 / chalk #F0ECE4 ............ 14.92:1 (AAA)
   ink #161A17 / sand  #E4DED2 ............ 13.13:1 (AAA)
   muted #5C635C / chalk .................. 5.25:1 (AA)
   muted #5C635C / sand ................... 4.62:1 (AA)
   river #3E5C6B / chalk .................. 6.05:1 (AA, close to AAA)
   river #3E5C6B / sand ................... 5.32:1 (AA)
   tawny #8A5A28 / chalk .................. 4.99:1 (AA, LARGE TEXT ONLY below)
   tawny #8A5A28 / sand ................... 4.39:1 (fails AA normal — never used on sand)
   chalk #F0ECE4 / dark #141815 ........... 15.22:1 (AAA)
   accent #9BB6C4 / dark #141815 .......... 8.44:1 (AAA)
   chalk #F0ECE4 / river #3E5C6B .......... 6.05:1 (AA)
   muted-on-dark #A9B1A9 / dark ........... 8.15:1 (AAA)
   muted-on-river #D3DBDE / river ......... 5.07:1 (AA)                       */
const INK = '#161A17'
const CHALK = '#F0ECE4'
const SAND = '#E4DED2'
const MUTED = '#5C635C'
const RIVER = '#3E5C6B'
const TAWNY = '#8A5A28'
const DARK = '#141815'
const MUTED_ON_DARK = '#A9B1A9'
const MUTED_ON_RIVER = '#D3DBDE'
const ACCENT_ON_DARK = '#9BB6C4'

/* Duration ladder + easing — teardown Phase 6, verbatim ratios. hkDive
   (registered above, 0.6,0,0,1) is reserved for a future preloader exit
   flourish; not currently wired to a tween. */
const DUR = { s: 0.4, m: 0.8, l: 1.2 }
const EASE = { out: 'hkOut', in: 'hkIn', inout: 'hkInOut' }
const STAGGER = 0.1
const DELAY = 0.3

/* The active Lenis instance (module scope, set/cleared by Page()'s
   matchMedia branch) so Chrome's nav clicks route scroll THROUGH it —
   a native scrollIntoView while Lenis owns the wheel would be reverted the
   next frame. Null under reduced motion, where scroll is native. */
let hkLenis: Lenis | null = null

const PAGE_STYLES = `
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-Light.woff2') format('woff2'); font-weight:300; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-SemiBold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Gambetta'; src:url('${FONTS_G}Gambetta-Italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
@font-face { font-family:'HK Supreme'; src:url('${FONTS_S}Supreme-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Supreme'; src:url('${FONTS_S}Supreme-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Supreme'; src:url('${FONTS_S}Supreme-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }

/* ═══ Fluid canvas (era teardown Phase 2.1 / 13.1), scoped — see note above ═══ */
.hk-root {
  --hk-ratio: 16;
  --hk-dur-s: .4s; --hk-dur-m: .8s; --hk-dur-l: 1.2s;
  --hk-ease-out: cubic-bezier(.25,1,.5,1);
  --hk-ease-in: cubic-bezier(.5,0,.75,0);
  --hk-ease-in-out: cubic-bezier(.75,0,.25,1);
  --hk-u2: calc(2vw / var(--hk-ratio));   --hk-u4: calc(4vw / var(--hk-ratio));
  --hk-u8: calc(8vw / var(--hk-ratio));   --hk-u12: calc(12vw / var(--hk-ratio));
  --hk-u16: calc(16vw / var(--hk-ratio)); --hk-u24: calc(24vw / var(--hk-ratio));
  --hk-u32: calc(32vw / var(--hk-ratio)); --hk-u48: calc(48vw / var(--hk-ratio));
  --hk-u64: calc(64vw / var(--hk-ratio)); --hk-u96: calc(96vw / var(--hk-ratio));
  --hk-u160: calc(160vw / var(--hk-ratio));
  --hk-gutter: max(20px, var(--hk-u48));
  --hk-num: calc(240vw / var(--hk-ratio));
  --hk-d1: calc(150vw / var(--hk-ratio));
  --hk-d2: calc(84vw / var(--hk-ratio));
  --hk-d3: calc(52vw / var(--hk-ratio));
  --hk-lead: max(19px, calc(23vw / var(--hk-ratio)));
  --hk-body: max(17px, calc(18vw / var(--hk-ratio)));
  --hk-label: max(11px, calc(12vw / var(--hk-ratio)));
  font-family: ${SUPREME};
  background: ${CHALK}; color: ${INK};
  overflow-x: clip;
}
@media (max-width: 991px) { .hk-root {
  --hk-gutter: max(18px, var(--hk-u32));
  --hk-u24: var(--hk-u16); --hk-u32: var(--hk-u24); --hk-u48: var(--hk-u32);
  --hk-u64: var(--hk-u48); --hk-u96: var(--hk-u64); --hk-u160: var(--hk-u96);
} }
@media (max-width: 767px) { .hk-root { --hk-ratio: 4.16; } }
@media (min-width: 768px) and (max-width: 991px) { .hk-root { --hk-ratio: 8.34; } }
@media (max-width: 767px) { .hk-root {
  --hk-num: calc(190vw / var(--hk-ratio));
  --hk-d1: calc(76vw / var(--hk-ratio));
  --hk-d2: calc(50vw / var(--hk-ratio));
  --hk-d3: calc(34vw / var(--hk-ratio));
} }
.hk-root ::selection { background: ${INK}; color: ${CHALK}; }
.hk-root :focus-visible { outline: 2px solid var(--hk-t-accent, ${RIVER}); outline-offset: 3px; border-radius: 2px; }
/* Descendant selector, not direct-child: the footer-aperture-close wrapper
   (.hk-close-stack / .hk-enquiry-wrap) sits between <main> and every
   section, so "main > section" would silently stop matching anything. */
.hk-root main header, .hk-root main section { scroll-margin-top: 68px; }
.hk-root h1, .hk-root h2, .hk-root h3, .hk-root .hk-fit {
  overflow-wrap: break-word; word-break: break-word; hyphens: auto;
}

/* ═══ Self-theming bands — components read only the semantic tokens ═══ */
.hk-theme-chalk { --hk-t-ink:${INK}; --hk-t-ground:${CHALK}; --hk-t-muted:${MUTED}; --hk-t-accent:${RIVER}; }
.hk-theme-sand  { --hk-t-ink:${INK}; --hk-t-ground:${SAND};  --hk-t-muted:${MUTED}; --hk-t-accent:${RIVER}; }
.hk-theme-dark  { --hk-t-ink:${CHALK}; --hk-t-ground:${DARK}; --hk-t-muted:${MUTED_ON_DARK}; --hk-t-accent:${ACCENT_ON_DARK}; }
.hk-theme-river { --hk-t-ink:${CHALK}; --hk-t-ground:${RIVER}; --hk-t-muted:${MUTED_ON_RIVER}; --hk-t-accent:${CHALK}; }
.hk-band { background: var(--hk-t-ground); color: var(--hk-t-ink); }

/* ═══ Fixed chrome — wordmark, nav and CTA re-theme on THEIR OWN centre
   (teardown Phase 5.4 / 13.3), three independent ScrollTrigger instances,
   never one shared state. Colour transition only, 0.4s. ═══ */
.hk-chrome-mark, .hk-chrome-nav, .hk-chrome-cta-label { transition: color var(--hk-dur-s) var(--hk-ease-out); }
.hk-chrome-bar { transition: background-color var(--hk-dur-s) var(--hk-ease-out), border-color var(--hk-dur-s) var(--hk-ease-out); }

/* ═══ Six reveal primitives — real GSAP SplitText, not IO whole-element
   fades. Word wrappers stay inline-block/nowrap so a line never breaks
   mid-word; character masking is CSS, never the SplitText mask option
   (its wrappers render block-level here — see
   [[gsap-splittext-clearprops-traps]] — which would stack chars vertically).
   Perspective lives on the reveal-marked element itself: it is the direct
   parent of the split char spans, which is exactly where a 3D-transform
   ancestor needs to sit. ═══ */
.hk-word {
  display: inline-block;
  white-space: nowrap;
  vertical-align: top;
  overflow: hidden;
  padding-bottom: 0.20em;
  margin-bottom: -0.20em;
}
.hk-char { display: inline-block; }
[data-hk-reveal="h"], [data-hk-reveal="a"] { line-height: 1.22; }
[data-hk-reveal="p"] { line-height: 1.6; }

/* ═══ §1 Arrival — the dive-in hero. ≥300vh scrubbed runway; a sticky inner
   viewport holds the frame while GSAP scales the image 1→~1.8 from
   50%/75% and parallaxes the three text layers out at differential rates.
   position:sticky, not a ScrollTrigger pin — the brief bans scroll-jacking;
   sticky never holds the page still, it only keeps content in view while
   native scroll continues normally. No CSS transition anywhere in this
   block: every property here is rewritten every scroll tick from JS. ═══ */
.hk-hero-scroll { position: relative; height: 320vh; }
.hk-hero-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.hk-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 75%; will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .hk-hero-scroll { height: 100svh; }
  .hk-hero-sticky { position: relative; }
  .hk-hero-image { transform: none !important; }
}

/* ═══ §4 Landið — the rising dome (teardown §3 §2 / Phase 13.7). Two 50vw
   corner radii on a full-bleed section meet at the exact centre of its top
   edge, producing one continuous elliptical crest — no arc-set SVG type
   needed for that. word-spacing on the heading is scrubbed separately in
   JS (never a CSS transition, since it is rewritten every tick). ═══ */
.hk-dome {
  position: relative; overflow: hidden;
  border-top-left-radius: 50vw; border-top-right-radius: 50vw;
  margin-top: calc(-1 * var(--hk-u32));
  padding-top: calc(var(--hk-u64) + 6vw);
}
@media (max-width: 767px) {
  .hk-dome { margin-top: calc(-1 * var(--hk-u16)); padding-top: calc(var(--hk-u48) + 11vw); }
}
.hk-dome-heading { word-spacing: 0vw; }


/* The dome's own content must clear the arc. With 50vw top radii on a
   full-bleed box the top 50vw of the box IS the curve, so anything inside it
   at normal padding gets clipped by overflow:hidden. Content therefore lives
   in a centred column that is narrow enough to sit inside the arc's mouth,
   pushed below the crest. The photograph is a full-bleed band underneath,
   outside the curved zone entirely. */
.hk-dome-inner {
  max-width: 46em;
  margin-inline: auto;
  padding-inline: var(--hk-gutter);
  text-align: center;
}
.hk-dome-inner .hk-rule { margin-inline: auto; }

/* ═══ §7 Árstíðirnan — the 10-point shutter merge (teardown §3 §11). Two
   half-screen panels, each a rectangle-with-a-rectangular-hole traced as a
   single 10-point clip-path polygon, so JS can converge the hole's
   top/bottom edges, then merge its outer/inner edges to the screen centre,
   then push through with a scale — never a crossfade. Resting/no-JS state
   (plain CSS below) is the fully OPEN aperture: both panels clipped to
   zero width, so the land-river photo beneath is what a crawler, a paused
   rAF tab or a reduced-motion visitor actually sees — consistent with the
   rest of this page's "resting state is always the fully visible one"
   rule. JS scrub then closes the aperture into winter as you scroll
   through the section (Heklusýn's own reading of "the seasons": you move
   FORWARD into winter, not back out of it). ═══ */
.hk-shutter-wrap { position: relative; height: 240vh; margin-top: var(--hk-u32); }
.hk-shutter-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.hk-shutter-base { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hk-shutter-panel { position: absolute; inset: 0; overflow: hidden; }
/* One winter plate wiped in from both edges toward the centre. The earlier
   two-panel version put a visible seam down the middle and read as the same
   photograph printed twice rather than one image being revealed. */
.hk-shutter-panel-l { clip-path: inset(0 100% 0 0); }
.hk-shutter-panel-r { display: none; }
.hk-shutter-panel-img { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; }
.hk-shutter-panel-img-l { left: 0; }
.hk-shutter-panel-img-r { right: 0; }
@media (prefers-reduced-motion: reduce) {
  .hk-shutter-wrap { height: auto; margin-top: var(--hk-u32); }
  .hk-shutter-sticky { position: relative; height: 70svh; }
}

/* ═══ §10 Fyrirspurn arriving — the footer aperture close (teardown Phase
   14 catalogue). No CSS transition: scale + clip-path are rewritten every
   scroll tick by the footer-close ScrollTrigger. ═══ */
.hk-close-stack { will-change: transform, clip-path; }
.hk-enquiry-wrap { will-change: transform; }

/* ═══ Sjóndeildarhringurinn — horizon strip ═══ */
.hk-ridge { position: relative; }
.hk-ridge-btn {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: .5em;
  background: none; border: 0; padding: .5em .3em; cursor: pointer; min-height: 44px;
  color: rgba(240,236,228,.72); font-family: ${SUPREME};
}
.hk-ridge-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(240,236,228,.55); transition: background var(--hk-dur-s) var(--hk-ease-out), transform var(--hk-dur-s) var(--hk-ease-out); }
.hk-ridge-btn[aria-pressed="true"] { color: ${CHALK}; }
.hk-ridge-btn[aria-pressed="true"] .hk-ridge-dot { background: ${ACCENT_ON_DARK}; transform: scale(1.7); }

/* ═══ Tölvumynd chip — always visible, never hover-only ═══ */
.hk-chip {
  display: inline-flex; align-items: center; gap: .4em;
  background: ${INK}; color: ${CHALK};
  font-family: ${SUPREME}; font-weight: 600; font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  padding: .5em .8em; line-height: 1;
}
.hk-chip::before { content: ''; width: 6px; height: 6px; border-radius: 999px; background: ${TAWNY}; flex: none; }

/* ═══ Húsin — ledger rows as native <details>, native keyboard/no-JS safe ═══ */
.hk-row { border-top: 1px solid rgba(22,26,23,.14); }
.hk-row:last-child { border-bottom: 1px solid rgba(22,26,23,.14); }
.hk-row summary { list-style: none; cursor: pointer; min-height: 56px; }
.hk-row summary::-webkit-details-marker { display: none; }
.hk-row-plus { transition: transform var(--hk-dur-m) var(--hk-ease-in-out); }
.hk-row[open] .hk-row-plus { transform: rotate(45deg); }
.hk-row-body { overflow: hidden; }
.hk-filter-chip { min-height: 44px; transition: background-color var(--hk-dur-s) var(--hk-ease-out), color var(--hk-dur-s) var(--hk-ease-out), border-color var(--hk-dur-s) var(--hk-ease-out); }
.hk-filter-chip[aria-pressed="true"] { background: ${INK}; color: ${CHALK}; border-color: ${INK}; }

/* ═══ Enquiry form ═══ */
.hk-field { width: 100%; min-height: 48px; background: transparent; border: 0; border-bottom: 1px solid rgba(240,236,228,.4); color: ${CHALK}; font-family: ${SUPREME}; font-size: var(--hk-body); padding: .6em .1em; }
.hk-field::placeholder { color: rgba(240,236,228,.5); }
.hk-field:focus { border-bottom-color: ${ACCENT_ON_DARK}; }
.hk-field { transition: border-color var(--hk-dur-s) var(--hk-ease-out); }
select.hk-field { appearance: none; }

.hk-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: .6em;
  min-height: 48px; padding: 0 1.6em; background: ${CHALK}; color: ${INK};
  font-family: ${SUPREME}; font-weight: 600; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
}
.hk-cta { transition: transform var(--hk-dur-s) var(--hk-ease-out), background-color var(--hk-dur-s) var(--hk-ease-out); }
@media (hover: hover) { .hk-cta:hover { transform: translateY(-2px); } }

/* ═══ Preloader — 5-layer mask-composite:add arch aperture (teardown §5.1 /
   13.7). ERA's own asset is a pre-authored SVG; this page has no asset
   scope to add one, so the crown is built from two hard-edge radial
   gradients rounding the top corners of an otherwise rectangular window —
   same technique family (multiple mask layers, additive), same visible
   result (a rounded-top aperture that widens and rises), zero new files.
   Session-once, hard-capped at 2.5s, entirely absent under reduced motion
   and for any client with JS disabled (this component simply never mounts
   its overlay in that case — the page beneath is already in the DOM and
   fully visible from first paint). ═══ */
.hk-preloader {
  position: fixed; inset: 0; z-index: 100; background: ${INK};
  --hk-arch-w: 22vw; --hk-arch-y: 108vh; --hk-arch-r: calc(var(--hk-arch-w) * .16);
  mask-repeat: no-repeat;
  mask-composite: add;
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(#000,#000),
    linear-gradient(#000,#000),
    linear-gradient(#000,#000),
    radial-gradient(circle at bottom right, transparent 0 var(--hk-arch-r), #000 var(--hk-arch-r)),
    radial-gradient(circle at bottom left,  transparent 0 var(--hk-arch-r), #000 var(--hk-arch-r));
  mask-size:
    calc(50% - (var(--hk-arch-w)/2) + 1px) 100%,
    calc(50% - (var(--hk-arch-w)/2) + 1px) 100%,
    calc(var(--hk-arch-w) + 2px) max(0px, var(--hk-arch-y)),
    var(--hk-arch-r) var(--hk-arch-r),
    var(--hk-arch-r) var(--hk-arch-r);
  mask-position:
    left top,
    right top,
    center top,
    calc(50% - (var(--hk-arch-w)/2)) var(--hk-arch-y),
    calc(50% + (var(--hk-arch-w)/2) - var(--hk-arch-r)) var(--hk-arch-y);
}
.hk-preloader-word {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: ${GAMBETTA}; font-weight: 400; color: ${CHALK}; font-size: clamp(28px, 4vw, 56px);
  letter-spacing: .02em;
}
@media (prefers-reduced-motion: reduce) { .hk-preloader { display: none; } }
`

/* ═════════════════════════════════════════════════════════════════════════
   Small shared pieces
   ═════════════════════════════════════════════════════════════════════════ */

function Kicker({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'light' }) {
  return (
    <p
      className="m-0"
      style={{
        fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)',
        letterSpacing: '.22em', textTransform: 'uppercase',
        color: tone === 'light' ? 'rgba(240,236,228,.75)' : 'var(--hk-t-muted, ' + MUTED + ')',
      }}
    >
      {children}
    </p>
  )
}

function SectionRule({ tone = 'ink' }: { tone?: 'ink' | 'light' }) {
  return (
    <div
      data-hk-reveal="line"
      aria-hidden
      className="h-px w-full"
      style={{ background: tone === 'light' ? 'rgba(240,236,228,.35)' : 'rgba(22,26,23,.22)' }}
    />
  )
}

function TolvumyndChip({ label }: { label: string }) {
  return (
    <span className="hk-chip">
      Tölvumynd{label ? ` · ${label}` : ''}
    </span>
  )
}

function RealPhoto({
  file, alt, caption, priority = false, className = '', position = 'center', reveal,
}: {
  file: string; alt: string; caption?: string; priority?: boolean; className?: string; position?: string
  /** 'slide' = skewed clip wipe + inner counter-scale (the six-primitive
   *  "slide" device). 'ctn' = plain opacity+y. Omit for no scroll reveal. */
  reveal?: 'slide' | 'ctn'
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure data-hk-reveal={reveal} className={`m-0 overflow-hidden ${className}`}>
      {failed ? (
        <div className="absolute inset-0" style={{ background: SAND }} role="img" aria-label={alt} />
      ) : (
        <img
          src={IMG(file)} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      )}
      {caption ? (
        <figcaption
          className="absolute bottom-0 left-0 m-0"
          style={{
            background: DARK, color: CHALK, fontFamily: SUPREME, fontWeight: 600,
            fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase',
            padding: '.6em .9em',
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function VisPhoto({ file, alt, room }: { file: string; alt: string; room: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure data-hk-reveal="ctn" className="relative m-0 aspect-[4/3] overflow-hidden">
      {failed ? (
        <div className="absolute inset-0" style={{ background: SAND }} role="img" aria-label={alt} />
      ) : (
        <img
          src={IMG(file)} alt={alt} loading="lazy" decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <figcaption className="absolute left-0 top-0 m-0 flex w-full items-center justify-between gap-2 p-3">
        <span
          style={{
            fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.1em',
            textTransform: 'uppercase', color: CHALK, background: DARK, padding: '.4em .7em',
          }}
        >
          {room}
        </span>
        <TolvumyndChip label="" />
      </figcaption>
    </figure>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Preloader — arch-aperture, session-once, hard-capped at 2.5s
   ═════════════════════════════════════════════════════════════════════════ */
function Preloader() {
  const [visible, setVisible] = useState(false)
  const elRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReduced()) return // reduced motion: never mounts; content beneath is already visible
    let seen = false
    try { seen = sessionStorage.getItem('hk-preloader-seen') === '1' } catch { /* private mode: show every time */ }
    if (seen) return
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    const el = elRef.current
    const word = wordRef.current
    if (!el) return
    try { sessionStorage.setItem('hk-preloader-seen', '1') } catch { /* private mode */ }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let done = false
    const state = { w: 22, y: 108 }
    const applyMask = () => {
      el.style.setProperty('--hk-arch-w', `${state.w}vw`)
      el.style.setProperty('--hk-arch-y', `${state.y}vh`)
    }
    applyMask()
    if (word) gsap.set(word, { opacity: 0, y: 12 })

    const finish = () => {
      if (done) return
      done = true
      window.clearTimeout(hardCap)
      document.body.style.overflow = prevOverflow
      gsap.to(el, {
        opacity: 0, duration: DUR.s, ease: EASE.in,
        onComplete: () => setVisible(false),
      })
    }
    // Hard cap: fires regardless of image load, timeline state, or a stalled
    // network — the overlay can never trap the page past 2.5s.
    const hardCap = window.setTimeout(finish, 2500)

    const heroImg = new Image()
    heroImg.src = IMG(PHOTOS.heroEstate.file)
    const imageReady = heroImg.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          heroImg.addEventListener('load', () => resolve(), { once: true })
          heroImg.addEventListener('error', () => resolve(), { once: true })
        })

    const tl = gsap.timeline({ onComplete: finish })
    tl.fromTo(word, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out })
    tl.to({}, { duration: 0.25 }) // brief hold, wordmark legible before the arch opens

    Promise.race([imageReady, new Promise((r) => window.setTimeout(r, 1200))]).then(() => {
      if (done) return
      tl.to(state, { w: 42, y: -12, duration: 1.15, ease: EASE.inout, onUpdate: applyMask })
        .to(el, { opacity: 0, duration: DUR.s, ease: EASE.in, onComplete: finish }, '-=0.05')
    })

    return () => {
      tl.kill()
      window.clearTimeout(hardCap)
      document.body.style.overflow = prevOverflow
    }
  }, [visible])

  if (!visible) return null

  return (
    <div ref={elRef} className="hk-preloader" aria-hidden="true">
      <span ref={wordRef} className="hk-preloader-word">Heklusýn</span>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Per-element chrome theming — wordmark, nav and CTA each re-theme on
   THEIR OWN vertical centre crossing a [data-hk-bg] section boundary
   (teardown Phase 5.4 / 13.3). Three independent instances of this hook,
   never one shared state — that was the previous build's actual bug.
   ═════════════════════════════════════════════════════════════════════════ */
function useElementTheme(ref: React.RefObject<HTMLElement | null>): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    let io: IntersectionObserver | null = null
    let resizeTimer: number | undefined
    const build = () => {
      io?.disconnect()
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return // hidden below its breakpoint — leave last theme
      const winH = window.innerHeight
      const centre = rect.top + rect.height / 2
      const top = Math.max(0, Math.round(centre))
      const bottom = Math.max(0, Math.round(winH - centre - 1))
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const bg = entry.target.getAttribute('data-hk-bg')
            setTheme(bg === 'dark' || bg === 'river' ? 'dark' : 'light')
          })
        },
        { threshold: 0, rootMargin: `-${top}px 0px -${bottom}px 0px` },
      )
      document.querySelectorAll('[data-hk-bg]').forEach((section) => io!.observe(section))
    }
    build()
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      io?.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [ref])
  return theme
}

/* ═════════════════════════════════════════════════════════════════════════
   Fixed chrome — wordmark + nav + CTA, three independently-themed elements
   ═════════════════════════════════════════════════════════════════════════ */
function Chrome() {
  const markRef = useRef<HTMLAnchorElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const markTheme = useElementTheme(markRef)
  const navTheme = useElementTheme(navRef)
  const ctaTheme = useElementTheme(ctaRef)

  const barLight = markTheme === 'light'
  const barBg = barLight ? 'rgba(240,236,228,.7)' : 'rgba(20,24,21,.42)'
  const barBorder = barLight ? 'rgba(22,26,23,.12)' : 'rgba(240,236,228,.16)'

  const go = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    if (hkLenis) hkLenis.scrollTo(target, { offset: -64 })
    else target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div
      className="hk-chrome-bar fixed inset-x-0 top-0 z-40 flex items-center justify-between backdrop-blur-md"
      style={{ background: barBg, borderBottom: `1px solid ${barBorder}`, minHeight: '56px', padding: '0 var(--hk-gutter)' }}
    >
      <a
        ref={markRef}
        href="#hk-hero"
        onClick={(e) => { e.preventDefault(); if (hkLenis) hkLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }) }}
        className="hk-chrome-mark inline-flex min-h-[44px] items-center"
        style={{ color: markTheme === 'light' ? INK : CHALK, fontFamily: GAMBETTA, fontWeight: 600, fontSize: '17px', letterSpacing: '.02em' }}
      >
        Heklusýn
      </a>
      <nav ref={navRef} aria-label="Kaflar síðunnar" className="hidden items-center gap-6 lg:flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className="hk-chrome-nav min-h-[44px] whitespace-nowrap"
            style={{ color: navTheme === 'light' ? INK : CHALK, opacity: 0.82, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase' }}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <button
        ref={ctaRef}
        type="button"
        onClick={() => go('hk-enquiry')}
        className="hk-cta"
        style={{ background: ctaTheme === 'light' ? INK : CHALK, minHeight: '44px', padding: '0 1.1em', fontSize: '11px' }}
      >
        <span className="hk-chrome-cta-label" style={{ color: ctaTheme === 'light' ? CHALK : INK }}>Fyrirspurn</span>
      </button>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §1 Arrival — Koma. ≥300vh scrubbed dive-in.
   ═════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header id="hk-hero" data-hk-bg="dark" className="hk-hero-scroll">
      <div className="hk-hero-sticky" style={{ background: DARK }}>
        <img
          src={IMG(PHOTOS.heroEstate.file)} alt={PHOTOS.heroEstate.alt}
          loading="eager" decoding="async" {...{ fetchpriority: 'high' }}
          className="hk-hero-image" style={{ objectPosition: '50% 62%' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,24,21,.10) 0%, rgba(20,24,21,.22) 34%, rgba(20,24,21,.85) 52%, rgba(20,24,21,.92) 100%)' }}
        />

        <div className="relative z-10 flex h-full flex-col justify-end" style={{ padding: `0 var(--hk-gutter) calc(var(--hk-u64) + 56px)` }}>
          <p
            data-hk-reveal="ctn"
            className="hk-hero-eyebrow m-0"
            style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(240,236,228,.78)' }}
          >
            {company.location}
          </p>

          <h1
            data-hk-reveal="h"
            className="hk-hero-h1 m-0"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d1)', lineHeight: 1.18, letterSpacing: '-0.01em' }}
          >
            Heklusýn
          </h1>

          <p
            data-hk-reveal="a"
            className="hk-hero-tagline m-0"
            style={{
              fontFamily: GAMBETTA, fontStyle: 'italic', fontWeight: 400, color: CHALK,
              fontSize: 'var(--hk-d3)', lineHeight: 1.24, marginTop: 'var(--hk-u12)', maxWidth: '18em',
            }}
          >
            Landið heldur húsinu.
          </p>

          <p
            data-hk-reveal="ctn"
            className="hk-hero-body m-0"
            style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.86)', fontSize: 'var(--hk-body)', lineHeight: 1.6, marginTop: 'var(--hk-u24)', maxWidth: '30em' }}
          >
            Fimmtíu hektarar á vesturbakka Ytri-Rangár. Tólf til fjórtán hús á öllu svæðinu, ekkert fleira.
          </p>
        </div>
      </div>
    </header>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §2 Thesis — Kjarninn
   ═════════════════════════════════════════════════════════════════════════ */
function Thesis() {
  return (
    <section id="hk-thesis" data-hk-bg="chalk" className="hk-theme-chalk hk-band relative">
      <div style={{ padding: 'var(--hk-u96) var(--hk-gutter)' }}>
        <Kicker>Fágætið</Kicker>
        <SectionRule />

        {/* One typographic statement, not a stat grid. Two attempts at a grid
            here both read as broken: first a lopsided 50 beside a 12/til/14
            tower, then a floating superscript "til". The scarcity is a
            sentence, so it is set as one. Both lines share a left edge and a
            rhythm, so there is nothing to misalign. */}
        <p
          data-hk-reveal="ctn"
          className="hk-claim m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.1, letterSpacing: '-0.015em', marginTop: 'var(--hk-u32)' }}
        >
          Fimmtíu hektarar.
          <br />
          Tólf til fjórtán hús.
        </p>

        <p
          data-hk-reveal="p"
          className="mt-10"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-lead)', lineHeight: 1.6, maxWidth: '32em', marginTop: 'var(--hk-u32)' }}
        >
          Fimmtíu hektarar liggja að Ytri-Rangá. Þar munu aðeins tólf til fjórtán hús rísa, hvert á lóð sem getur
          orðið allt að fimm hekturum að stærð. Landinu var ekki skipt í sem flestar lóðir. Því var úthlutað í
          tólf til fjórtán.
        </p>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §3 SIGNATURE — Sjóndeildarhringurinn
   ═════════════════════════════════════════════════════════════════════════ */
function Horizon() {
  const [selected, setSelected] = useState(0)
  const [focusIdx, setFocusIdx] = useState(0)
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([])

  const move = (next: number) => {
    const clamped = (next + MOUNTAINS.length) % MOUNTAINS.length
    setFocusIdx(clamped)
    setSelected(clamped)
    btnRefs.current[clamped]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(focusIdx + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(focusIdx - 1) }
    else if (e.key === 'Home') { e.preventDefault(); move(0) }
    else if (e.key === 'End') { e.preventDefault(); move(MOUNTAINS.length - 1) }
  }

  return (
    <section id="hk-horizon" data-hk-bg="dark" className="relative" style={{ background: DARK }}>
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter) 0' }}>
        <Kicker tone="light">Fjöllin átta</Kicker>
        <SectionRule tone="light" />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Sjóndeildarhringurinn
        </h2>
        <p
          data-hk-reveal="ctn"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: 'var(--hk-u16)' }}
        >
          Frá landinu sjást átta fjöll. Þau eru nefnd hér og staðsett á myndinni til skýringar, ekki eftir mældri
          hnitasetningu. Veldu nafn til að sjá það á sjóndeildarhringnum.
        </p>
      </div>

      <div className="hk-ridge relative mt-8" style={{ marginTop: 'var(--hk-u32)' }}>
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <RealPhoto file={PHOTOS.landRiver.file} alt={PHOTOS.landRiver.alt} className="absolute inset-0 h-full w-full" />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,24,21,.15) 0%, rgba(20,24,21,.74) 100%)' }} />
          <span
            aria-hidden
            className="absolute left-3 top-3"
            style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: CHALK, background: DARK, padding: '.4em .7em' }}
          >
            Skýringarmynd
          </span>

          {MOUNTAINS.map((m) => (
            <div key={m.name} className="absolute bottom-0" style={{ left: `${m.pos}%`, transform: 'translateX(-50%)' }}>
              <div className="hk-ridge-dot" style={{ marginBottom: '2px' }} aria-hidden />
            </div>
          ))}

          {selected !== null ? (
            <p
              aria-live="polite"
              className="hk-fit absolute inset-x-0 bottom-0 m-0 text-center"
              style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d3)', lineHeight: 1.2, padding: '0 var(--hk-gutter) var(--hk-u24)' }}
            >
              {MOUNTAINS[selected].name}
            </p>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Fjöllin átta"
          onKeyDown={onKeyDown}
          className="flex flex-wrap items-start justify-center gap-x-1 gap-y-2"
          style={{ padding: 'var(--hk-u24) var(--hk-gutter) var(--hk-u48)' }}
        >
          {MOUNTAINS.map((m, i) => (
            <button
              key={m.name}
              ref={(el) => { btnRefs.current[i] = el }}
              type="button"
              role="button"
              aria-pressed={selected === i}
              tabIndex={focusIdx === i ? 0 : -1}
              onClick={() => { setSelected(i); setFocusIdx(i) }}
              className="hk-ridge-btn"
              style={{ fontSize: 'var(--hk-label)', letterSpacing: '.06em' }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §4 Landið — the rising dome, word-spacing scrubbed on its heading
   ═════════════════════════════════════════════════════════════════════════ */
function Land() {
  return (
    <section id="hk-land" data-hk-bg="sand" className="hk-theme-sand hk-band hk-dome relative">
      <div className="hk-dome-inner">
        <Kicker>Uppruni</Kicker>
        <SectionRule />
        <h2
          data-hk-reveal="ctn"
          className="hk-dome-heading m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Landið heldur húsinu
        </h2>
        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '34em', margin: 'var(--hk-u24) auto 0' }}
        >
          Landið var áður hluti af sögulegu bújörðinni Leirubakka. Það varð sjálfstæð eign við Ytri-Rangá árið
          2020, félagið sjálft skráð ári síðar.
        </p>
        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '34em', margin: 'var(--hk-u16) auto 0' }}
        >
          Á svæðinu er þess gætt að raska sem minnst núverandi hraunmyndunum, mosa og gróðri sem fyrir er.
        </p>
      </div>

      {/* Full-bleed band below the curve, so the photograph is never clipped. */}
      <div className="relative w-full" style={{ marginTop: 'var(--hk-u64)', height: 'min(62svh, 42vw)' }}>
        <RealPhoto
          file={PHOTOS.houseAutumn.file} alt={PHOTOS.houseAutumn.alt} reveal="ctn"
          className="absolute inset-0 h-full w-full" caption="Húsið á haustbakkanum"
        />
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §5 Húsin — ledger
   ═════════════════════════════════════════════════════════════════════════ */
function StatusPill({ status }: { status: HouseStatus }) {
  const bg = status === 'selt' ? 'rgba(22,26,23,.08)' : status === 'til-solu' ? 'rgba(62,92,107,.14)' : 'rgba(138,90,40,.14)'
  const fg = status === 'selt' ? INK : status === 'til-solu' ? '#2A4048' : '#6E4720'
  return (
    <span
      className="inline-flex items-center"
      style={{ background: bg, color: fg, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', padding: '.35em .6em' }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function Houses() {
  const [filter, setFilter] = useState<'all' | HouseStatus>('all')
  const filters: Array<{ key: 'all' | HouseStatus; label: string }> = [
    { key: 'all', label: 'Allt' },
    { key: 'selt', label: 'Selt' },
    { key: 'til-solu', label: 'Til sölu' },
    { key: 'i-byggingu', label: 'Í byggingu' },
  ]
  return (
    <section id="hk-houses" data-hk-bg="chalk" className="hk-theme-chalk hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }}>
        <Kicker>Staða húsanna</Kicker>
        <SectionRule />
        <div className="flex flex-wrap items-end justify-between gap-6" style={{ marginTop: 'var(--hk-u16)' }}>
          <h2
            data-hk-reveal="ctn"
            className="m-0"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18 }}
          >
            Húsin
          </h2>
          <div role="group" aria-label="Sía eftir stöðu" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className="hk-filter-chip"
                style={{ border: `1px solid rgba(22,26,23,.22)`, background: 'transparent', color: INK, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '0 1em' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: 'var(--hk-u16)' }}
        >
          Ein lína á hvert hús. Seld hús standa áfram í skránni og með yfirstrikun, því fágætið er röksemdin.
        </p>

        <div className="mt-8" style={{ marginTop: 'var(--hk-u32)' }}>
          {HOUSES.map((house) => {
            const dim = filter !== 'all' && !house.statuses.includes(filter)
            const sold = house.statuses.includes('selt')
            return (
              <details key={house.name} className="hk-row" style={{ opacity: dim ? 0.4 : 1, transition: 'opacity var(--hk-dur-m) var(--hk-ease-out)' }}>
                <summary className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      style={{
                        fontFamily: GAMBETTA, fontWeight: 500, color: INK, fontSize: 'var(--hk-lead)',
                        textDecoration: sold ? 'line-through' : 'none', textDecorationColor: MUTED, textDecorationThickness: '1.5px',
                      }}
                    >
                      {house.name}
                    </span>
                    <span style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--hk-body)' }}>
                      {house.size ?? 'Stærð ekki gefin upp'}
                    </span>
                    <span style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--hk-body)' }}>
                      {house.plot ?? 'Lóð ekki gefin upp'}
                    </span>
                    {house.price ? (
                      <span style={{ fontFamily: SUPREME, fontWeight: 600, color: INK, fontSize: 'var(--hk-body)' }}>
                        {house.price === 'Selt' ? 'Verð: Selt' : house.price}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-2">
                    {house.statuses.map((s) => <StatusPill key={s} status={s} />)}
                    <span className="hk-row-plus" aria-hidden style={{ fontFamily: SUPREME, fontSize: '20px', color: MUTED, lineHeight: 1 }}>+</span>
                  </span>
                </summary>
                <div className="hk-row-body">
                  <p style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '36em', paddingBottom: 'var(--hk-u16)' }}>
                    {house.note}
                  </p>
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §6 Eitt hús — Rangárslétta 2. The two paired photos use the "slide"
   primitive (skewed clip wipe + inner counter-scale).
   ═════════════════════════════════════════════════════════════════════════ */
function OneHouse() {
  const r2 = HOUSES[0]
  return (
    <section id="hk-one-house" data-hk-bg="sand" className="hk-theme-sand hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }}>
        <Kicker>Rangárslétta 2</Kicker>
        <SectionRule />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Eitt hús
        </h2>
        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '32em', marginTop: 'var(--hk-u16)' }}
        >
          Sama lóð, tvær stundir: grindin fyrst, húsið svo. {r2.size} á lóð sem er um {r2.plot} að stærð.
        </p>
        <div data-hk-reveal="ctn" className="flex flex-wrap items-baseline gap-x-5 gap-y-2" style={{ marginTop: 'var(--hk-u24)' }}>
          {r2.price ? (
            <p className="hk-fit m-0" style={{ fontFamily: GAMBETTA, fontWeight: 400, color: INK, fontSize: 'var(--hk-d3)', lineHeight: 1.15 }}>
              {r2.price}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            {r2.statuses.map((s) => <StatusPill key={s} status={s} />)}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 'var(--hk-u32)' }}>
          <RealPhoto
            file={PHOTOS.construction.file} alt={PHOTOS.construction.alt} reveal="slide"
            className="relative aspect-[4/3]" caption="Grindin rís"
          />
          <RealPhoto
            file={PHOTOS.houseBuilt.file} alt={PHOTOS.houseBuilt.alt} reveal="slide"
            className="relative aspect-[4/3] sm:mt-10" caption="Fullbúið, sama lóð"
          />
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §7 Árstíðirnar — the 10-point shutter merge
   ═════════════════════════════════════════════════════════════════════════ */
function Seasons() {
  return (
    <section id="hk-seasons" data-hk-bg="dark" className="relative" style={{ background: DARK }}>
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter) 0' }}>
        <Kicker tone="light">Árstíðirnar</Kicker>
        <SectionRule tone="light" />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Sama land, tvær árstíðir
        </h2>
        <p
          data-hk-reveal="ctn"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '30em', marginTop: 'var(--hk-u16)' }}
        >
          Áin að sumri, sama sjónarhorn í rökkri að vetri.
        </p>
      </div>

      <div className="hk-shutter-wrap">
        <div className="hk-shutter-sticky">
          <img src={IMG(PHOTOS.landRiver.file)} alt={PHOTOS.landRiver.alt} className="hk-shutter-base" />
          <div className="hk-shutter-panel hk-shutter-panel-l">
            <img src={IMG(PHOTOS.winterDusk.file)} alt={PHOTOS.winterDusk.alt} className="hk-shutter-panel-img hk-shutter-panel-img-l" loading="lazy" decoding="async" />
          </div>
          <div className="hk-shutter-panel hk-shutter-panel-r">
            <img src={IMG(PHOTOS.winterDusk.file)} alt="" aria-hidden className="hk-shutter-panel-img hk-shutter-panel-img-r" loading="lazy" decoding="async" />
          </div>
          <span
            aria-hidden
            className="absolute bottom-4 left-4 z-10"
            style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: CHALK, background: DARK, padding: '.4em .7em' }}
          >
            Áin, að degi til → vetur, í rökkri
          </span>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §8 Tölvumyndir
   ═════════════════════════════════════════════════════════════════════════ */
function Visuals() {
  const items = [VISUALS.living, VISUALS.kitchen, VISUALS.plan, VISUALS.exterior]
  return (
    <section id="hk-visuals" data-hk-bg="chalk" className="hk-theme-chalk hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }}>
        <Kicker>Tölvumyndir</Kicker>
        <SectionRule />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Tölvumyndir af innréttingum
        </h2>
        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '34em', marginTop: 'var(--hk-u16)' }}
        >
          Myndirnar hér að neðan eru tölvugerðar sjónmyndir, ekki ljósmyndir af fullbúnum húsum. Hver mynd er
          merkt sérstaklega.
        </p>

        <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 'var(--hk-u32)' }}>
          {items.map((v) => <VisPhoto key={v.file} file={v.file} alt={v.alt} room={v.room} />)}
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §9 Gögnin — compliance as monument
   ═════════════════════════════════════════════════════════════════════════ */
function Docs() {
  return (
    <section id="hk-docs" data-hk-bg="sand" className="hk-theme-sand hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }}>
        <Kicker>Tæknileg gögn</Kicker>
        <SectionRule />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Gögnin
        </h2>

        <div className="grid gap-8 sm:grid-cols-3" style={{ marginTop: 'var(--hk-u32)' }}>
          {DOCUMENTS.map((d) => (
            <div key={d.label} data-hk-reveal="ctn">
              <p className="m-0" style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d3)', lineHeight: 1.15 }}>
                {d.count}
              </p>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, color: INK, fontSize: 'var(--hk-body)', letterSpacing: '.02em', textTransform: 'uppercase', marginTop: 'var(--hk-u4)' }}>
                {d.label}
              </p>
              <p className="m-0" style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.6, marginTop: 'var(--hk-u4)' }}>
                {d.note}
              </p>
            </div>
          ))}
        </div>

        <p
          data-hk-reveal="p"
          style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '32em', marginTop: 'var(--hk-u48)', borderTop: '1px solid rgba(22,26,23,.16)', paddingTop: 'var(--hk-u16)' }}
        >
          Skjölin eru þróunaraðilans eigin gögn og eru ekki endurbirt hér.
        </p>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §10 Fyrirspurn
   ═════════════════════════════════════════════════════════════════════════ */
function Enquiry() {
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [house, setHouse] = useState(ENQUIRY_HOUSES[0])

  const mailHref = useMemo(() => {
    const subject = `Fyrirspurn um ${house}`
    const bodyLines = [
      `Nafn: ${name || '[nafn]'}`,
      `Netfang: ${addr || '[netfang]'}`,
      `Hús: ${house}`,
      '',
      'Skrifaðu skilaboð hér.',
    ]
    return `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  }, [name, addr, house])

  return (
    <section id="hk-enquiry" data-hk-bg="river" className="hk-theme-river hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter) var(--hk-u96)' }}>
        <Kicker tone="light">Hafa samband</Kicker>
        <SectionRule tone="light" />
        <h2
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Fyrirspurn
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]" style={{ marginTop: 'var(--hk-u32)' }}>
          <form
            data-hk-reveal="ctn"
            className="flex flex-col gap-6"
            onSubmit={(e) => { e.preventDefault(); window.location.href = mailHref }}
          >
            <div>
              <label htmlFor="hk-f-name" className="sr-only">Nafn</label>
              <input id="hk-f-name" className="hk-field" placeholder="Nafn" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="hk-f-email" className="sr-only">Netfang</label>
              <input id="hk-f-email" type="email" className="hk-field" placeholder="Netfang" value={addr} onChange={(e) => setAddr(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="hk-f-house" className="sr-only">Hvaða hús</label>
              <select id="hk-f-house" className="hk-field" value={house} onChange={(e) => setHouse(e.target.value)}>
                {ENQUIRY_HOUSES.map((h) => <option key={h} value={h} style={{ color: INK }}>{h}</option>)}
              </select>
            </div>
            <a href={mailHref} className="hk-cta self-start">
              Senda fyrirspurn
            </a>
            <p style={{ fontFamily: SUPREME, color: MUTED_ON_RIVER, fontSize: '13px', lineHeight: 1.5, maxWidth: '26em' }}>
              Opnast í tölvupóstforritinu þínu, stílað á {EMAIL}.
            </p>
          </form>

          <div data-hk-reveal="ctn" className="flex flex-col gap-6">
            <div>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Bein leið</p>
              <a href={EMAIL_HREF} className="mt-2 block" style={{ fontFamily: GAMBETTA, fontWeight: 400, color: CHALK, fontSize: 'var(--hk-lead)', textDecoration: 'underline', textUnderlineOffset: '.18em' }}>
                {EMAIL}
              </a>
              <a href={PHONE_HREF} className="mt-1 block" style={{ fontFamily: SUPREME, color: CHALK, fontSize: 'var(--hk-body)' }}>
                {PHONE_DISPLAY}
              </a>
            </div>
            <div style={{ borderTop: '1px solid rgba(240,236,228,.22)', paddingTop: 'var(--hk-u16)' }}>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Félagið</p>
              <p className="mt-2" style={{ fontFamily: SUPREME, color: CHALK, fontSize: 'var(--hk-body)', lineHeight: 1.6 }}>
                {COMPANY_LINE}<br />{COMPANY_ADDRESS}
              </p>
            </div>
            <div>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Eigendur</p>
              <p className="mt-2" style={{ fontFamily: SUPREME, color: MUTED_ON_RIVER, fontSize: '14px', lineHeight: 1.6, maxWidth: '28em' }}>
                {OWNERS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Page — assembles the chrome, the closing stack (sections 1–9, clipped and
   scaled down as Fyrirspurn arrives) and Fyrirspurn itself (scaled up to
   meet it). Preloader and Chrome sit OUTSIDE the closing stack deliberately:
   both use position:fixed, and a transformed ancestor would create a new
   containing block for them, breaking their viewport-relative positioning
   the moment the footer-close effect starts scaling the stack.
   ═════════════════════════════════════════════════════════════════════════ */
export default function HeklusynPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeStackRef = useRef<HTMLDivElement>(null)
  const enquiryWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Heklusýn · Tólf hús á fimmtíu hekturum'
    setThemeColor(DARK)
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !tag
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    const prev = tag.content
    tag.content = 'Fimmtíu hektarar við Ytri-Rangá, tólf til fjórtán hús. Sjóndeildarhringurinn, húsin og landið sjálft, í stað verðlauss PDF-safns.'
    return () => {
      if (created) tag?.remove()
      else if (tag) tag.content = prev
    }
  }, [])

  /* All scroll choreography — hero dive-in, dome word-spacing, the six
     reveal primitives, the shutter merge and the footer aperture close.
     Gated entirely behind prefers-reduced-motion:no-preference: under
     reduced motion this branch never runs a single tween, and the CSS
     media queries above already collapse every tall scroll runway to a
     normal single section, with panels/images at their fully visible
     resting state. Chrome theming (useElementTheme, above) is deliberately
     NOT gated here — a colour swap on scroll is not the kind of motion
     that rule guards against, matching the precedent already established
     on this app's THG and Búðir builds. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const c = ctx.conditions as { motion: boolean }
      if (!c.motion) return undefined

      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []

      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      hkLenis = lenis
      const tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* ── 1. Dive-in hero: scale 1→1.8 from 50%/75%, three text layers
         parallax out at differential rates. One ScrollTrigger, onUpdate
         reads progress directly — "ease: none" by construction, since the
         value IS the scroll position (teardown Phase 6.1's rule). ── */
      const heroScroll = q('.hk-hero-scroll')[0] as HTMLElement | undefined
      const heroImg = q('.hk-hero-image')[0] as HTMLElement | undefined
      const heroEyebrow = q('.hk-hero-eyebrow')[0] as HTMLElement | undefined
      const heroH1 = q('.hk-hero-h1')[0] as HTMLElement | undefined
      const heroLower = q('.hk-hero-tagline, .hk-hero-body') as HTMLElement[]
      if (heroScroll && heroImg) {
        ScrollTrigger.create({
          trigger: heroScroll,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(heroImg, { scale: 1 + p * 0.8 })
            if (heroEyebrow) gsap.set(heroEyebrow, { yPercent: -Math.min(1, p / 0.5) * 40, opacity: 1 - Math.min(1, p / 0.45) })
            if (heroH1) gsap.set(heroH1, { yPercent: -Math.min(1, p / 0.65) * 55, opacity: 1 - Math.min(1, p / 0.6) })
            heroLower.forEach((el) => gsap.set(el, { yPercent: -Math.min(1, p / 0.8) * 70, opacity: 1 - Math.min(1, p / 0.72) }))
          },
        })
      }

      /* ── 2. Dome word-spacing: 0 → 2vw scrubbed as the dome crests. ── */
      const domeSection = q('.hk-dome')[0] as HTMLElement | undefined
      const domeHeading = q('.hk-dome-heading')[0] as HTMLElement | undefined
      if (domeSection && domeHeading) {
        gsap.fromTo(domeHeading, { wordSpacing: '0vw' }, {
          wordSpacing: '2vw', ease: 'none',
          scrollTrigger: { trigger: domeSection, start: 'top bottom', end: 'top top', scrub: true },
        })
      }

      /* ── 3. The six reveal primitives, for real. ── */
      const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-hk-reveal]'))
      revealEls.forEach((el, i) => {
        const kind = el.dataset.hkReveal
        const stBase = { toggleActions: 'play none none none', once: true } as const

        if (kind === 'h') {
          splits.push(SplitText.create(el, {
            type: 'words,chars', wordsClass: 'hk-word', charsClass: 'hk-char', autoSplit: false,
            onSplit: (self) => {
              gsap.fromTo(self.chars,
                { yPercent: 112 },
                {
                  yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: STAGGER * 0.5,
                  delay: DELAY, clearProps: 'transform',
                  scrollTrigger: { trigger: el, start: 'top 85%', ...stBase },
                })
              return undefined
            },
          }))
        } else if (kind === 'a') {
          splits.push(SplitText.create(el, {
            type: 'words,chars', wordsClass: 'hk-word', charsClass: 'hk-char', autoSplit: false,
            onSplit: (self) => {
              gsap.fromTo(self.chars,
                { yPercent: 112, x: '0.5em' },
                {
                  yPercent: 0, x: '0em', duration: DUR.l, ease: EASE.out, stagger: STAGGER,
                  delay: DELAY, clearProps: 'transform',
                  scrollTrigger: { trigger: el, start: 'top 85%', ...stBase },
                })
              return undefined
            },
          }))
        } else if (kind === 'p') {
          splits.push(SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: false,
            onSplit: (self) => {
              gsap.fromTo(self.lines,
                { yPercent: 110 },
                {
                  yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: STAGGER,
                  scrollTrigger: { trigger: el, start: 'top 88%', ...stBase },
                })
              return undefined
            },
          }))
        } else if (kind === 'line') {
          gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, {
            clipPath: 'inset(0 0 0% 0)', duration: DUR.m, ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 92%', ...stBase },
          })
        } else if (kind === 'slide') {
          const img = el.querySelector('img')
          gsap.fromTo(el, { clipPath: 'polygon(100% 0%,100% 0%,108% 100%,24% 100%)' }, {
            clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', duration: DUR.l, ease: EASE.inout,
            scrollTrigger: { trigger: el, start: 'top 85%', ...stBase },
          })
          if (img) {
            gsap.fromTo(img, { scale: 1.35, xPercent: 14 }, {
              scale: 1, xPercent: 0, duration: DUR.l, ease: EASE.inout,
              scrollTrigger: { trigger: el, start: 'top 85%', ...stBase },
            })
          }
        } else {
          gsap.fromTo(el, { opacity: 0, y: 26 }, {
            opacity: 1, y: 0, duration: DUR.l, ease: EASE.out, delay: (i % 4) * 0.04,
            scrollTrigger: { trigger: el, start: 'top 90%', ...stBase },
          })
        }
      })

      /* ── 4. Árstíðirnar — the 10-point shutter merge. Two half-screen
         panels, each an outer-rect-with-a-hole traced as a single 10-point
         clip-path polygon (rebuilt every tick from 4 numbers via
         onUpdate — GSAP cannot safely interpolate polygon() strings whose
         point count/shape differs between phases, so the numbers are
         tweened, not the string). Phase 1 converges the hole's top/bottom
         edges toward a shared band (18.519%/81.481% — reused verbatim from
         the ERA source, the one hole geometry, not the brand, the addendum
         explicitly frees up). Phase 2 merges the remaining slit to the
         screen's centre from both sides. Phase 3 is the push-through: once
         both panels are fully opaque winter, they scale up together for a
         camera-push finish. Not a crossfade at any point. ── */
      const shutterWrap = q('.hk-shutter-wrap')[0] as HTMLElement | undefined
      const panelL = q('.hk-shutter-panel-l')[0] as HTMLElement | undefined
      const panelR = q('.hk-shutter-panel-r')[0] as HTMLElement | undefined
      const panelLImg = q('.hk-shutter-panel-img-l')[0] as HTMLElement | undefined
      const panelRImg = q('.hk-shutter-panel-img-r')[0] as HTMLElement | undefined
      if (shutterWrap && panelL && panelR) {
        const annulus = (top: number, bottom: number, x1: number, x2: number) =>
          `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${bottom}%, ${x1}% ${bottom}%, ${x1}% ${top}%, ${x2}% ${top}%, ${x2}% ${bottom}%, 0% ${bottom}%)`
        const left = { top: 0, bottom: 100, outer: 0 }
        const right = { top: 0, bottom: 100, outer: 100 }
        const inner = { left: 100, right: 0 } // centre-facing edges
        const apply = () => {
          panelL.style.clipPath = annulus(left.top, left.bottom, left.outer, inner.left)
          panelR.style.clipPath = annulus(right.top, right.bottom, inner.right, right.outer)
        }
        apply()
        const tl = gsap.timeline({
          scrollTrigger: { trigger: shutterWrap, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        tl.to(left, { top: 18.519, bottom: 81.481, duration: 0.5, ease: 'none', onUpdate: apply })
          .to(right, { top: 18.519, bottom: 81.481, duration: 0.5, ease: 'none', onUpdate: apply }, '<')
          .to(left, { outer: 50, duration: 0.2, ease: 'none', onUpdate: apply })
          .to(inner, { left: 50, right: 50, duration: 0.2, ease: 'none', onUpdate: apply }, '<')
          .to(right, { outer: 50, duration: 0.2, ease: 'none', onUpdate: apply }, '<')
        if (panelLImg && panelRImg) {
          tl.to([panelLImg, panelRImg], { scale: 1.12, duration: 0.3, ease: 'none' })
        }
      }

      /* ── 5. Footer aperture close — sections 1–9 clip to inset(8% 22%)
         and scale to 0.75 as Fyrirspurn approaches; Fyrirspurn itself
         scales 0.75→1 over the same scrub. Initial gsap.set matches
         progress:0 exactly, so there is no jump before the trigger's first
         onUpdate. ── */
      const closeStack = closeStackRef.current
      const enquiryWrap = enquiryWrapRef.current
      if (closeStack && enquiryWrap) {
        gsap.set(closeStack, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, transformOrigin: 'center center' })
        gsap.set(enquiryWrap, { scale: 0.75, transformOrigin: 'center center' })
        ScrollTrigger.create({
          trigger: enquiryWrap,
          start: 'top bottom',
          end: 'top 15%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(closeStack, { clipPath: `inset(${p * 8}% ${p * 22}% ${p * 8}% ${p * 22}%)`, scale: 1 - p * 0.25 })
            gsap.set(enquiryWrap, { scale: 0.75 + p * 0.25 })
          },
        })
      }

      document.fonts.ready.then(() => ScrollTrigger.refresh())

      /* ── Failsafe: 2s after mount, clear any leftover inline reveal
         styles regardless of whether their ScrollTrigger has fired —
         opacity:1 plus clearProps limited to transform/clipPath ONLY.
         clearProps:'all' would also wipe React's own inline
         fontSize/color/fontFamily, per [[gsap-splittext-clearprops-traps]]. ── */
      const failsafe = window.setTimeout(() => {
        gsap.set(
          root.querySelectorAll('[data-hk-reveal], [data-hk-reveal] *, .hk-hero-eyebrow, .hk-hero-h1, .hk-hero-h1 *, .hk-hero-tagline, .hk-hero-tagline *, .hk-hero-body'),
          { opacity: 1, clearProps: 'transform,clipPath' },
        )
      }, 2000)

      return () => {
        window.clearTimeout(failsafe)
        gsap.ticker.remove(tick)
        lenis.destroy()
        hkLenis = null
        splits.forEach((sp) => sp.revert())
      }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} className="hk-root relative" lang="is">
      <style>{PAGE_STYLES}</style>
      <Preloader />
      <Chrome />
      <main>
        <div ref={closeStackRef} className="hk-close-stack">
          <Hero />
          <Thesis />
          <Horizon />
          <Land />
          <Houses />
          <OneHouse />
          <Seasons />
          <Visuals />
          <Docs />
        </div>
        <div ref={enquiryWrapRef} className="hk-enquiry-wrap">
          <Enquiry />
        </div>
      </main>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
