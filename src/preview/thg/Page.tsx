import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor, setNoindex } from '../../lib/preview'
import {
  IMG, ADDRESS, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, KT,
  PRACTICE, TAGLINE, PROJECTS, INTERIORS, KIND_LABEL, KOLASUNDID,
  PHOTOS, DOCUMENTS, ENQUIRY_TOPICS, NAV,
  PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'
import type { ProjectKind } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('thgOut', '0.25,1,0.5,1')
CustomEase.create('thgIn', '0.5,0,0.75,0')
CustomEase.create('thgInOut', '0.75,0,0.25,1')
CustomEase.create('thgDive', '0.6,0,0,1')

const company = companyEntry

/* ═════════════════════════════════════════════════════════════════════════
   THG ARKITEKTAR — "Staðarandi", rebuilt as an EXACT transplant of the
   Heklusýn page (src/preview/heklusyn/Page.tsx), device for device:

     1. arch-aperture preloader, session-once, hard-capped at 2.5s
     2. three independently-themed chrome elements (mark / nav / CTA), each
        re-theming on ITS OWN vertical centre, never one shared state
     3. §1 the 320vh scrubbed dive-in hero, scale 1→1.8 from 50%/75%, three
        text layers parallaxing out at differential rates
     4. §4 the rising dome — two 50vw top radii meeting at the centre of a
        full-bleed section, with word-spacing 0→2vw scrubbed on its heading
     5. §7 the 10-point shutter merge (converge → merge to centre → push
        through with a scale), never a crossfade
     6. §10 the footer aperture close — sections 1–9 clip to inset(8% 22%)
        and scale to .75 while Fyrirspurn scales .75→1 to meet them
     7. the six reveal primitives on real GSAP SplitText char splits
     8. the fluid canvas (--thg-uN tokens), the self-theming bands, the
        <details> ledger with filter chips, the horizon-strip selector

   IDENTITY IS ALSO HEKLUSÝN'S, deliberately: chalk / sand / basalt / river,
   Gambetta + Supreme, the same type scale and the same air. The only things
   that changed are the FACTS and the PHOTOGRAPHS, which are THG's own.

   THREE DEVIATIONS, each forced by honesty, none structural:
   a) Heklusýn's horizon strip pins eight mountains onto one photograph.
      THG has no landscape to pin, so the same strip drives a PROJECT
      selector: the plate swaps to the selected building. No coordinate is
      asserted anywhere — the dot rail is a plain index, not a position.
   b) Heklusýn's "Tölvumynd" chip marks CGI. Every THG image is a real
      photograph, so the identical chip carries the building and the room
      instead. Labelling a photo "Tölvumynd" would be a false claim.
   c) The ledger's sold/for-sale/under-construction pills become the three
      building families THG's own site names (hótel, þjónusta og hjúkrun,
      endurhæfing). Nothing here is for sale.

   FLUID CANVAS — ERA sets html{font-size:1vw} globally. This app has ~90
   other routes sharing the same <html>, so every --thg-u* token is instead
   written as calc(Nvw / var(--thg-ratio)) — mathematically identical
   output, zero global blast radius.

   Every reveal below is gsap.fromTo(...) toward the resting state — never
   gsap.from(). React always renders the full, final text; GSAP only ever
   writes a transient inline "from" style inside a
   prefers-reduced-motion:no-preference branch, then a 2s failsafe clears
   any leftover inline transform/clip-path. A crawler, a paused rAF tab or a
   screenshot mid-scroll therefore always sees complete, positioned text. ── */

const FONTS_G = `${import.meta.env.BASE_URL}fonts/gambetta/`
const FONTS_S = `${import.meta.env.BASE_URL}fonts/supreme/`

const GAMBETTA = "'THG Gambetta', Georgia, serif"
const SUPREME = "'THG Supreme', -apple-system, sans-serif"

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Palette — Heklusýn's, carried across unchanged, contrast pairs verified
   (relative-luminance formula):
   ink #161A17 / chalk #F0ECE4 ............ 14.92:1 (AAA)
   ink #161A17 / sand  #E4DED2 ............ 13.13:1 (AAA)
   muted #5C635C / chalk .................. 5.25:1 (AA)
   muted #5C635C / sand ................... 4.62:1 (AA)
   river #3E5C6B / chalk .................. 6.05:1 (AA, close to AAA)
   river #3E5C6B / sand ................... 5.32:1 (AA)
   tawny #8A5A28 / chalk .................. 4.99:1 (AA, LARGE TEXT ONLY)
   chalk #F0ECE4 / dark #141815 ........... 15.22:1 (AAA)
   accent #9BB6C4 / dark #141815 .......... 8.44:1 (AAA)
   chalk #F0ECE4 / river #3E5C6B .......... 6.05:1 (AA)
   muted-on-dark #A9B1A9 / dark ........... 8.15:1 (AAA)
   muted-on-river #D3DBDE / river ......... 5.07:1 (AA)                     */
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

/* Duration ladder + easing — teardown Phase 6, verbatim ratios. thgDive
   (registered above, 0.6,0,0,1) is reserved for a future preloader exit
   flourish; not currently wired to a tween. */
const DUR = { s: 0.4, m: 0.8, l: 1.2 }
const EASE = { out: 'thgOut', in: 'thgIn', inout: 'thgInOut' }
const STAGGER = 0.1
const DELAY = 0.3

/* The active Lenis instance (module scope, set/cleared by Page()'s
   matchMedia branch) so Chrome's nav clicks route scroll THROUGH it — a
   native scrollIntoView while Lenis owns the wheel would be reverted the
   next frame. Null under reduced motion, where scroll is native. */
let thgLenis: Lenis | null = null

const PAGE_STYLES = `
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-Light.woff2') format('woff2'); font-weight:300; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-SemiBold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Gambetta'; src:url('${FONTS_G}Gambetta-Italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
@font-face { font-family:'THG Supreme'; src:url('${FONTS_S}Supreme-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Supreme'; src:url('${FONTS_S}Supreme-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Supreme'; src:url('${FONTS_S}Supreme-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }

/* ═══ Fluid canvas (era teardown Phase 2.1 / 13.1), scoped — see note above ═══ */
.thg-root {
  --thg-ratio: 16;
  --thg-dur-s: .4s; --thg-dur-m: .8s; --thg-dur-l: 1.2s;
  --thg-ease-out: cubic-bezier(.25,1,.5,1);
  --thg-ease-in: cubic-bezier(.5,0,.75,0);
  --thg-ease-in-out: cubic-bezier(.75,0,.25,1);
  --thg-u2: calc(2vw / var(--thg-ratio));   --thg-u4: calc(4vw / var(--thg-ratio));
  --thg-u8: calc(8vw / var(--thg-ratio));   --thg-u12: calc(12vw / var(--thg-ratio));
  --thg-u16: calc(16vw / var(--thg-ratio)); --thg-u24: calc(24vw / var(--thg-ratio));
  --thg-u32: calc(32vw / var(--thg-ratio)); --thg-u48: calc(48vw / var(--thg-ratio));
  --thg-u64: calc(64vw / var(--thg-ratio)); --thg-u96: calc(96vw / var(--thg-ratio));
  --thg-u160: calc(160vw / var(--thg-ratio));
  --thg-gutter: max(20px, var(--thg-u48));
  --thg-num: calc(240vw / var(--thg-ratio));
  --thg-d1: calc(150vw / var(--thg-ratio));
  --thg-d2: calc(84vw / var(--thg-ratio));
  --thg-d3: calc(52vw / var(--thg-ratio));
  --thg-lead: max(19px, calc(23vw / var(--thg-ratio)));
  --thg-body: max(17px, calc(18vw / var(--thg-ratio)));
  --thg-label: max(11px, calc(12vw / var(--thg-ratio)));
  font-family: ${SUPREME};
  background: ${CHALK}; color: ${INK};
  overflow-x: clip;
}
@media (max-width: 991px) { .thg-root {
  --thg-gutter: max(18px, var(--thg-u32));
  --thg-u24: var(--thg-u16); --thg-u32: var(--thg-u24); --thg-u48: var(--thg-u32);
  --thg-u64: var(--thg-u48); --thg-u96: var(--thg-u64); --thg-u160: var(--thg-u96);
} }
@media (max-width: 767px) { .thg-root { --thg-ratio: 4.16; } }
@media (min-width: 768px) and (max-width: 991px) { .thg-root { --thg-ratio: 8.34; } }
@media (max-width: 767px) { .thg-root {
  --thg-num: calc(190vw / var(--thg-ratio));
  --thg-d1: calc(76vw / var(--thg-ratio));
  --thg-d2: calc(50vw / var(--thg-ratio));
  --thg-d3: calc(34vw / var(--thg-ratio));
} }
.thg-root ::selection { background: ${INK}; color: ${CHALK}; }
.thg-root :focus-visible { outline: 2px solid var(--thg-t-accent, ${RIVER}); outline-offset: 3px; border-radius: 2px; }
/* Descendant selector, not direct-child: the footer-aperture-close wrapper
   (.thg-close-stack / .thg-enquiry-wrap) sits between <main> and every
   section, so "main > section" would silently stop matching anything. */
.thg-root main header, .thg-root main section { scroll-margin-top: 68px; }
.thg-root h1, .thg-root h2, .thg-root h3, .thg-root .thg-fit {
  overflow-wrap: break-word; word-break: break-word; hyphens: auto;
}

/* ═══ Self-theming bands — components read only the semantic tokens ═══ */
.thg-theme-chalk { --thg-t-ink:${INK}; --thg-t-ground:${CHALK}; --thg-t-muted:${MUTED}; --thg-t-accent:${RIVER}; }
.thg-theme-sand  { --thg-t-ink:${INK}; --thg-t-ground:${SAND};  --thg-t-muted:${MUTED}; --thg-t-accent:${RIVER}; }
.thg-theme-dark  { --thg-t-ink:${CHALK}; --thg-t-ground:${DARK}; --thg-t-muted:${MUTED_ON_DARK}; --thg-t-accent:${ACCENT_ON_DARK}; }
.thg-theme-river { --thg-t-ink:${CHALK}; --thg-t-ground:${RIVER}; --thg-t-muted:${MUTED_ON_RIVER}; --thg-t-accent:${CHALK}; }
.thg-band { background: var(--thg-t-ground); color: var(--thg-t-ink); }

/* ═══ Fixed chrome — wordmark, nav and CTA re-theme on THEIR OWN centre
   (teardown Phase 5.4 / 13.3), three independent ScrollTrigger instances,
   never one shared state. Colour transition only, 0.4s. ═══ */
.thg-chrome-mark, .thg-chrome-nav, .thg-chrome-cta-label { transition: color var(--thg-dur-s) var(--thg-ease-out); }
.thg-chrome-bar { transition: background-color var(--thg-dur-s) var(--thg-ease-out), border-color var(--thg-dur-s) var(--thg-ease-out); }

/* ═══ Six reveal primitives — real GSAP SplitText, not IO whole-element
   fades. Word wrappers stay inline-block/nowrap so a line never breaks
   mid-word; character masking is CSS, never the SplitText mask option
   (its wrappers render block-level here — see
   [[gsap-splittext-clearprops-traps]] — which would stack chars vertically).
   Perspective lives on the reveal-marked element itself: it is the direct
   parent of the split char spans, which is exactly where a 3D-transform
   ancestor needs to sit. ═══ */
.thg-word {
  display: inline-block;
  white-space: nowrap;
  vertical-align: top;
  overflow: hidden;
  padding-bottom: 0.20em;
  margin-bottom: -0.20em;
}
.thg-char { display: inline-block; }
[data-thg-reveal="h"], [data-thg-reveal="a"] { line-height: 1.22; }
[data-thg-reveal="p"] { line-height: 1.6; }

/* ═══ §1 Arrival — the dive-in hero. ≥300vh scrubbed runway; a sticky inner
   viewport holds the frame while GSAP scales the image 1→~1.8 from 50%/75%
   and parallaxes the three text layers out at differential rates.
   position:sticky, not a ScrollTrigger pin — the brief bans scroll-jacking;
   sticky never holds the page still, it only keeps content in view while
   native scroll continues normally. No CSS transition anywhere in this
   block: every property here is rewritten every scroll tick from JS. ═══ */
.thg-hero-scroll { position: relative; height: 320vh; }
.thg-hero-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.thg-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 75%; will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .thg-hero-scroll { height: 100svh; }
  .thg-hero-sticky { position: relative; }
  .thg-hero-image { transform: none !important; }
}

/* ═══ §4 Aðferðin — the rising dome (teardown §3 §2 / Phase 13.7). Two 50vw
   corner radii on a full-bleed section meet at the exact centre of its top
   edge, producing one continuous elliptical crest — no arc-set SVG type
   needed for that. word-spacing on the heading is scrubbed separately in
   JS (never a CSS transition, since it is rewritten every tick). ═══ */
.thg-dome {
  position: relative; overflow: hidden;
  border-top-left-radius: 50vw; border-top-right-radius: 50vw;
  margin-top: calc(-1 * var(--thg-u32));
  padding-top: calc(var(--thg-u64) + 6vw);
}
@media (max-width: 767px) {
  .thg-dome { margin-top: calc(-1 * var(--thg-u16)); padding-top: calc(var(--thg-u48) + 11vw); }
}
.thg-dome-heading { word-spacing: 0vw; }

/* The dome's own content must clear the arc. With 50vw top radii on a
   full-bleed box the top 50vw of the box IS the curve, so anything inside it
   at normal padding gets clipped by overflow:hidden. Content therefore lives
   in a centred column that is narrow enough to sit inside the arc's mouth,
   pushed below the crest. The photograph is a full-bleed band underneath,
   outside the curved zone entirely. */
.thg-dome-inner {
  max-width: 46em;
  margin-inline: auto;
  padding-inline: var(--thg-gutter);
  text-align: center;
}
.thg-dome-inner .thg-rule { margin-inline: auto; }

/* ═══ §7 Utan og innan — the 10-point shutter merge (teardown §3 §11). A
   panel traced as a single 10-point clip-path polygon, so JS can converge
   the hole's top/bottom edges, then merge its outer/inner edges to the
   screen centre, then push through with a scale — never a crossfade.
   Resting/no-JS state (plain CSS below) is the fully OPEN aperture: the
   panel clipped to zero width, so the façade beneath is what a crawler, a
   paused rAF tab or a reduced-motion visitor actually sees — consistent
   with the rest of this page's "resting state is always the fully visible
   one" rule. JS scrub then closes the aperture onto the interior as you
   scroll through the section: you move INTO the building. ═══ */
.thg-shutter-wrap { position: relative; height: 240vh; margin-top: var(--thg-u32); }
.thg-shutter-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.thg-shutter-base { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.thg-shutter-panel { position: absolute; inset: 0; overflow: hidden; }
/* One interior plate wiped in from both edges toward the centre. The earlier
   two-panel version put a visible seam down the middle and read as the same
   photograph printed twice rather than one image being revealed. */
.thg-shutter-panel-l { clip-path: inset(0 100% 0 0); }
.thg-shutter-panel-r { display: none; }
.thg-shutter-panel-img { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; }
.thg-shutter-panel-img-l { left: 0; }
.thg-shutter-panel-img-r { right: 0; }
@media (prefers-reduced-motion: reduce) {
  .thg-shutter-wrap { height: auto; margin-top: var(--thg-u32); }
  .thg-shutter-sticky { position: relative; height: 70svh; }
}

/* ═══ §10 Fyrirspurn arriving — the footer aperture close (teardown Phase
   14 catalogue). No CSS transition: scale + clip-path are rewritten every
   scroll tick by the footer-close ScrollTrigger. ═══ */
.thg-close-stack { will-change: transform, clip-path; }
.thg-enquiry-wrap { will-change: transform; }

/* ═══ Verkin — the horizon strip, driving a project selector ═══ */
.thg-ridge { position: relative; }
.thg-ridge-btn {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: .5em;
  background: none; border: 0; padding: .5em .3em; cursor: pointer; min-height: 44px;
  color: rgba(240,236,228,.72); font-family: ${SUPREME};
}
.thg-ridge-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(240,236,228,.55); transition: background var(--thg-dur-s) var(--thg-ease-out), transform var(--thg-dur-s) var(--thg-ease-out); }
.thg-ridge-btn[aria-pressed="true"] { color: ${CHALK}; }
.thg-ridge-btn[aria-pressed="true"] .thg-ridge-dot { background: ${ACCENT_ON_DARK}; transform: scale(1.7); }
.thg-ridge-dot[data-on="1"] { background: ${ACCENT_ON_DARK}; transform: scale(1.7); }
/* The plate stack: every project sits in the same frame, only opacity
   changes. Resting state (no JS) is the first plate visible, never blank. */
.thg-plate { position: absolute; inset: 0; opacity: 0; transition: opacity var(--thg-dur-m) var(--thg-ease-out); }
.thg-plate[data-on="1"] { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .thg-plate { transition: none; } }

/* ═══ Building chip — always visible, never hover-only ═══ */
.thg-chip {
  display: inline-flex; align-items: center; gap: .4em;
  background: ${INK}; color: ${CHALK};
  font-family: ${SUPREME}; font-weight: 600; font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  padding: .5em .8em; line-height: 1;
}
.thg-chip::before { content: ''; width: 6px; height: 6px; border-radius: 999px; background: ${TAWNY}; flex: none; }

/* ═══ Skráin — ledger rows as native <details>, native keyboard/no-JS safe ═══ */
.thg-row { border-top: 1px solid rgba(22,26,23,.14); }
.thg-row:last-child { border-bottom: 1px solid rgba(22,26,23,.14); }
.thg-row summary { list-style: none; cursor: pointer; min-height: 56px; }
.thg-row summary::-webkit-details-marker { display: none; }
.thg-row-plus { transition: transform var(--thg-dur-m) var(--thg-ease-in-out); }
.thg-row[open] .thg-row-plus { transform: rotate(45deg); }
.thg-row-body { overflow: hidden; }
.thg-filter-chip { min-height: 44px; transition: background-color var(--thg-dur-s) var(--thg-ease-out), color var(--thg-dur-s) var(--thg-ease-out), border-color var(--thg-dur-s) var(--thg-ease-out); }
.thg-filter-chip[aria-pressed="true"] { background: ${INK}; color: ${CHALK}; border-color: ${INK}; }

/* ═══ Enquiry form ═══ */
.thg-field { width: 100%; min-height: 48px; background: transparent; border: 0; border-bottom: 1px solid rgba(240,236,228,.4); color: ${CHALK}; font-family: ${SUPREME}; font-size: var(--thg-body); padding: .6em .1em; }
.thg-field::placeholder { color: rgba(240,236,228,.5); }
.thg-field:focus { border-bottom-color: ${ACCENT_ON_DARK}; }
.thg-field { transition: border-color var(--thg-dur-s) var(--thg-ease-out); }
select.thg-field { appearance: none; }

.thg-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: .6em;
  min-height: 48px; padding: 0 1.6em; background: ${CHALK}; color: ${INK};
  font-family: ${SUPREME}; font-weight: 600; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
}
.thg-cta { transition: transform var(--thg-dur-s) var(--thg-ease-out), background-color var(--thg-dur-s) var(--thg-ease-out); }
@media (hover: hover) { .thg-cta:hover { transform: translateY(-2px); } }

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
.thg-preloader {
  position: fixed; inset: 0; z-index: 100; background: ${INK};
  --thg-arch-w: 22vw; --thg-arch-y: 108vh; --thg-arch-r: calc(var(--thg-arch-w) * .16);
  mask-repeat: no-repeat;
  mask-composite: add;
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(#000,#000),
    linear-gradient(#000,#000),
    linear-gradient(#000,#000),
    radial-gradient(circle at bottom right, transparent 0 var(--thg-arch-r), #000 var(--thg-arch-r)),
    radial-gradient(circle at bottom left,  transparent 0 var(--thg-arch-r), #000 var(--thg-arch-r));
  mask-size:
    calc(50% - (var(--thg-arch-w)/2) + 1px) 100%,
    calc(50% - (var(--thg-arch-w)/2) + 1px) 100%,
    calc(var(--thg-arch-w) + 2px) max(0px, var(--thg-arch-y)),
    var(--thg-arch-r) var(--thg-arch-r),
    var(--thg-arch-r) var(--thg-arch-r);
  mask-position:
    left top,
    right top,
    center top,
    calc(50% - (var(--thg-arch-w)/2)) var(--thg-arch-y),
    calc(50% + (var(--thg-arch-w)/2) - var(--thg-arch-r)) var(--thg-arch-y);
}
.thg-preloader-word {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: ${GAMBETTA}; font-weight: 400; color: ${CHALK}; font-size: clamp(24px, 3.4vw, 48px);
  letter-spacing: .02em; text-align: center; padding: 0 6vw;
}
@media (prefers-reduced-motion: reduce) { .thg-preloader { display: none; } }
`

/* ═════════════════════════════════════════════════════════════════════════
   Small shared pieces
   ═════════════════════════════════════════════════════════════════════════ */

function Kicker({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'light' }) {
  return (
    <p
      className="m-0"
      style={{
        fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--thg-label)',
        letterSpacing: '.22em', textTransform: 'uppercase',
        color: tone === 'light' ? 'rgba(240,236,228,.75)' : 'var(--thg-t-muted, ' + MUTED + ')',
      }}
    >
      {children}
    </p>
  )
}

function SectionRule({ tone = 'ink' }: { tone?: 'ink' | 'light' }) {
  return (
    <div
      data-thg-reveal="line"
      aria-hidden
      className="h-px w-full"
      style={{ background: tone === 'light' ? 'rgba(240,236,228,.35)' : 'rgba(22,26,23,.22)' }}
    />
  )
}

function BuildingChip({ label }: { label: string }) {
  return <span className="thg-chip">{label}</span>
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
    <figure data-thg-reveal={reveal} className={`m-0 overflow-hidden ${className}`}>
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

/* Innandyra tile — Heklusýn's VisPhoto exactly, with the "Tölvumynd" chip
   re-captioned to the building (deviation (b) in the header note). */
function InteriorPhoto({ file, alt, room, project }: { file: string; alt: string; room: string; project: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure data-thg-reveal="ctn" className="relative m-0 aspect-[4/3] overflow-hidden">
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
        <BuildingChip label={project} />
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
    try { seen = sessionStorage.getItem('thg-preloader-seen') === '1' } catch { /* private mode: show every time */ }
    if (seen) return
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    const el = elRef.current
    const word = wordRef.current
    if (!el) return
    try { sessionStorage.setItem('thg-preloader-seen', '1') } catch { /* private mode */ }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let done = false
    const state = { w: 22, y: 108 }
    const applyMask = () => {
      el.style.setProperty('--thg-arch-w', `${state.w}vw`)
      el.style.setProperty('--thg-arch-y', `${state.y}vh`)
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
    heroImg.src = IMG(PHOTOS.hero.file)
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
    <div ref={elRef} className="thg-preloader" aria-hidden="true">
      <span ref={wordRef} className="thg-preloader-word">THG Arkitektar</span>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Per-element chrome theming — wordmark, nav and CTA each re-theme on
   THEIR OWN vertical centre crossing a [data-thg-bg] section boundary
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
            const bg = entry.target.getAttribute('data-thg-bg')
            setTheme(bg === 'dark' || bg === 'river' ? 'dark' : 'light')
          })
        },
        { threshold: 0, rootMargin: `-${top}px 0px -${bottom}px 0px` },
      )
      document.querySelectorAll('[data-thg-bg]').forEach((section) => io!.observe(section))
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
    if (thgLenis) thgLenis.scrollTo(target, { offset: -64 })
    else target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div
      className="thg-chrome-bar fixed inset-x-0 top-0 z-40 flex items-center justify-between backdrop-blur-md"
      style={{ background: barBg, borderBottom: `1px solid ${barBorder}`, minHeight: '56px', padding: '0 var(--thg-gutter)' }}
    >
      <a
        ref={markRef}
        href="#thg-hero"
        onClick={(e) => { e.preventDefault(); if (thgLenis) thgLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }) }}
        className="thg-chrome-mark inline-flex min-h-[44px] items-center"
        style={{ color: markTheme === 'light' ? INK : CHALK, fontFamily: GAMBETTA, fontWeight: 600, fontSize: '17px', letterSpacing: '.02em' }}
      >
        THG Arkitektar
      </a>
      <nav ref={navRef} aria-label="Kaflar síðunnar" className="hidden items-center gap-6 lg:flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className="thg-chrome-nav min-h-[44px] whitespace-nowrap"
            style={{ color: navTheme === 'light' ? INK : CHALK, opacity: 0.82, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase' }}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <button
        ref={ctaRef}
        type="button"
        onClick={() => go('thg-enquiry')}
        className="thg-cta"
        style={{ background: ctaTheme === 'light' ? INK : CHALK, minHeight: '44px', padding: '0 1.1em', fontSize: '11px' }}
      >
        <span className="thg-chrome-cta-label" style={{ color: ctaTheme === 'light' ? CHALK : INK }}>Fyrirspurn</span>
      </button>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §1 Arrival — Koma. ≥300vh scrubbed dive-in.
   ═════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header id="thg-hero" data-thg-bg="dark" className="thg-hero-scroll">
      <div className="thg-hero-sticky" style={{ background: DARK }}>
        <img
          src={IMG(PHOTOS.hero.file)} alt={PHOTOS.hero.alt}
          loading="eager" decoding="async" {...{ fetchpriority: 'high' }}
          className="thg-hero-image" style={{ objectPosition: '50% 42%' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,24,21,.10) 0%, rgba(20,24,21,.22) 34%, rgba(20,24,21,.85) 52%, rgba(20,24,21,.92) 100%)' }}
        />

        <div className="relative z-10 flex h-full flex-col justify-end" style={{ padding: `0 var(--thg-gutter) calc(var(--thg-u64) + 56px)` }}>
          <p
            data-thg-reveal="ctn"
            className="thg-hero-eyebrow m-0"
            style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--thg-label)', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(240,236,228,.78)' }}
          >
            {ADDRESS}
          </p>

          <h1
            data-thg-reveal="h"
            className="thg-hero-h1 m-0"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--thg-d1)', lineHeight: 1.18, letterSpacing: '-0.01em' }}
          >
            THG Arkitektar
          </h1>

          <p
            data-thg-reveal="a"
            className="thg-hero-tagline m-0"
            style={{
              fontFamily: GAMBETTA, fontStyle: 'italic', fontWeight: 400, color: CHALK,
              fontSize: 'var(--thg-d3)', lineHeight: 1.24, marginTop: 'var(--thg-u12)', maxWidth: '18em',
            }}
          >
            {TAGLINE}
          </p>

          <p
            data-thg-reveal="ctn"
            className="thg-hero-body m-0"
            style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.86)', fontSize: 'var(--thg-body)', lineHeight: 1.6, marginTop: 'var(--thg-u24)', maxWidth: '30em' }}
          >
            Stofnað 1994, {PRACTICE.staffLine}. Hótel, hjúkrunarheimili og þjónustuíbúðir sem eru teiknaðar
            inn í það sem stendur fyrir.
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
    <section id="thg-thesis" data-thg-bg="chalk" className="thg-theme-chalk thg-band relative">
      <div style={{ padding: 'var(--thg-u96) var(--thg-gutter)' }}>
        <Kicker>Kjarninn</Kicker>
        <SectionRule />

        {/* One typographic statement, not a stat grid — Heklusýn's §2 shape
            exactly. Two lines sharing a left edge and a rhythm, so there is
            nothing to misalign. */}
        <p
          data-thg-reveal="ctn"
          className="thg-claim m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.1, letterSpacing: '-0.015em', marginTop: 'var(--thg-u32)' }}
        >
          Ekkert hús stendur eitt.
          <br />
          Það stendur við annað.
        </p>

        <p
          data-thg-reveal="p"
          className="mt-10"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-lead)', lineHeight: 1.6, maxWidth: '32em', marginTop: 'var(--thg-u32)' }}
        >
          Sama hugsunin kemur fyrir í þremur verkefnum stofunnar. Gestamóttakan á Hótel Borg er hönnuð í
          Art Deko stíl í samræmi við eldri móttöku. Í Reykjavík Konsúlat er nýjum og sögulegum byggingum
          fléttað saman. Á Hótel Von var miðað við byggingarstílinn í næsta nágrenni til að fanga
          staðarandann. Þetta stendur hvergi sem ein setning á vef stofunnar. Það er samt kjarninn.
        </p>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §3 SIGNATURE — Verkin. Heklusýn's horizon strip, driving the project
   plate instead of pinning mountains (deviation (a) in the header note).
   ═════════════════════════════════════════════════════════════════════════ */
function Works() {
  const [selected, setSelected] = useState(0)
  const [focusIdx, setFocusIdx] = useState(0)
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([])

  const move = (next: number) => {
    const clamped = (next + PROJECTS.length) % PROJECTS.length
    setFocusIdx(clamped)
    setSelected(clamped)
    btnRefs.current[clamped]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(focusIdx + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(focusIdx - 1) }
    else if (e.key === 'Home') { e.preventDefault(); move(0) }
    else if (e.key === 'End') { e.preventDefault(); move(PROJECTS.length - 1) }
  }

  const active = PROJECTS[selected]
  const chipLabel = [active.place, active.year].filter(Boolean).join(' · ')

  return (
    <section id="thg-works" data-thg-bg="dark" className="relative" style={{ background: DARK }}>
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter) 0' }}>
        <Kicker tone="light">Úr verkefnaskránni</Kicker>
        <SectionRule tone="light" />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Sjö hús, eitt viðhorf
        </h2>
        <p
          data-thg-reveal="ctn"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--thg-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: 'var(--thg-u16)' }}
        >
          Sjö af verkefnum stofunnar, valin hér. Veldu nafn til að sjá húsið.
        </p>
      </div>

      <div className="thg-ridge relative mt-8" style={{ marginTop: 'var(--thg-u32)' }}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
          {PROJECTS.map((p, i) => (
            <div key={p.key} className="thg-plate" data-on={selected === i ? '1' : '0'} aria-hidden={selected !== i}>
              <img
                src={IMG(p.image)} alt={selected === i ? p.alt : ''}
                loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,24,21,.15) 0%, rgba(20,24,21,.74) 100%)' }} />
          {chipLabel ? (
            <span
              aria-hidden
              className="absolute left-3 top-3"
              style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: CHALK, background: DARK, padding: '.4em .7em' }}
            >
              {chipLabel}
            </span>
          ) : null}

          {/* Index rail, not a map: the dots mark position in the list of
              seven, and assert nothing about the photograph beneath them. */}
          <div aria-hidden className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-3">
            {PROJECTS.map((p, i) => (
              <span key={p.key} className="thg-ridge-dot" data-on={selected === i ? '1' : '0'} />
            ))}
          </div>

          <p
            aria-live="polite"
            className="thg-fit absolute inset-x-0 bottom-0 m-0 text-center"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--thg-d3)', lineHeight: 1.2, padding: '0 var(--thg-gutter) var(--thg-u24)' }}
          >
            {active.name}
          </p>
        </div>

        <div
          role="group"
          aria-label="Sjö verkefni"
          onKeyDown={onKeyDown}
          className="flex flex-wrap items-start justify-center gap-x-1 gap-y-2"
          style={{ padding: 'var(--thg-u24) var(--thg-gutter) var(--thg-u48)' }}
        >
          {PROJECTS.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => { btnRefs.current[i] = el }}
              type="button"
              aria-pressed={selected === i}
              tabIndex={focusIdx === i ? 0 : -1}
              onClick={() => { setSelected(i); setFocusIdx(i) }}
              className="thg-ridge-btn"
              style={{ fontSize: 'var(--thg-label)', letterSpacing: '.06em' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §4 Aðferðin — the rising dome, word-spacing scrubbed on its heading
   ═════════════════════════════════════════════════════════════════════════ */
function Method() {
  return (
    <section id="thg-method" data-thg-bg="sand" className="thg-theme-sand thg-band thg-dome relative">
      <div className="thg-dome-inner">
        <Kicker>Aðferðin</Kicker>
        <SectionRule />
        <h2
          data-thg-reveal="ctn"
          className="thg-dome-heading m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Að fanga staðarandann
        </h2>
        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '34em', margin: 'var(--thg-u24) auto 0' }}
        >
          {PRACTICE.services}
        </p>
        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '34em', margin: 'var(--thg-u16) auto 0' }}
        >
          Á Hótel Von var miðað við að hótelbyggingin mundi falla að þeim byggingarstíl sem er í næsta
          nágrenni. Húsið hér að neðan er sú bygging.
        </p>
      </div>

      {/* Full-bleed band below the curve, so the photograph is never clipped. */}
      <div className="relative w-full" style={{ marginTop: 'var(--thg-u64)', height: 'min(62svh, 42vw)' }}>
        <RealPhoto
          file={PHOTOS.domeBand.file} alt={PHOTOS.domeBand.alt} reveal="ctn"
          className="absolute inset-0 h-full w-full" caption="Hótel Von, Reykjavík"
        />
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §5 Skráin — ledger
   ═════════════════════════════════════════════════════════════════════════ */
function KindPill({ kind }: { kind: ProjectKind }) {
  const bg = kind === 'hotel' ? 'rgba(62,92,107,.14)' : kind === 'thjonusta' ? 'rgba(22,26,23,.08)' : 'rgba(138,90,40,.14)'
  const fg = kind === 'hotel' ? '#2A4048' : kind === 'thjonusta' ? INK : '#6E4720'
  return (
    <span
      className="inline-flex items-center"
      style={{ background: bg, color: fg, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', padding: '.35em .6em' }}
    >
      {KIND_LABEL[kind]}
    </span>
  )
}

function Ledger() {
  const [filter, setFilter] = useState<'all' | ProjectKind>('all')
  const filters: Array<{ key: 'all' | ProjectKind; label: string }> = [
    { key: 'all', label: 'Allt' },
    { key: 'hotel', label: KIND_LABEL.hotel },
    { key: 'thjonusta', label: KIND_LABEL.thjonusta },
    { key: 'endurhaefing', label: KIND_LABEL.endurhaefing },
  ]
  return (
    <section id="thg-ledger" data-thg-bg="chalk" className="thg-theme-chalk thg-band relative">
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter)' }}>
        <Kicker>Verkefnaskrá</Kicker>
        <SectionRule />
        <div className="flex flex-wrap items-end justify-between gap-6" style={{ marginTop: 'var(--thg-u16)' }}>
          <h2
            data-thg-reveal="ctn"
            className="m-0"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.18 }}
          >
            Skráin
          </h2>
          <div role="group" aria-label="Sía eftir tegund" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className="thg-filter-chip"
                style={{ border: `1px solid rgba(22,26,23,.22)`, background: 'transparent', color: INK, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '0 1em' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: 'var(--thg-u16)' }}
        >
          Ein lína á hvert verk. Reitur sem stofan hefur ekki birt stendur auður, aldrei ágiskun.
        </p>

        <div className="mt-8" style={{ marginTop: 'var(--thg-u32)' }}>
          {PROJECTS.map((p) => {
            const dim = filter !== 'all' && p.kind !== filter
            return (
              <details key={p.key} className="thg-row" style={{ opacity: dim ? 0.4 : 1, transition: 'opacity var(--thg-dur-m) var(--thg-ease-out)' }}>
                <summary className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span style={{ fontFamily: GAMBETTA, fontWeight: 500, color: INK, fontSize: 'var(--thg-lead)' }}>
                      {p.name}
                    </span>
                    <span style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)' }}>
                      {p.place ?? 'Staðsetning ekki gefin upp'}
                    </span>
                    <span style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)' }}>
                      {p.year ?? 'Ártal ekki gefið upp'}
                    </span>
                    {p.size ? (
                      <span style={{ fontFamily: SUPREME, fontWeight: 600, color: INK, fontSize: 'var(--thg-body)' }}>
                        {p.size}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-2">
                    <KindPill kind={p.kind} />
                    <span className="thg-row-plus" aria-hidden style={{ fontFamily: SUPREME, fontSize: '20px', color: MUTED, lineHeight: 1 }}>+</span>
                  </span>
                </summary>
                <div className="thg-row-body">
                  <p style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '36em', paddingBottom: p.client ? 0 : 'var(--thg-u16)' }}>
                    {p.quote}
                  </p>
                  {p.client ? (
                    <p style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)', lineHeight: 1.7, paddingBottom: 'var(--thg-u16)' }}>
                      Verkkaupi: {p.client}
                    </p>
                  ) : null}
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
   §6 Eitt verk — Reykjavík Konsúlat og Kolasundið. The two paired photos
   use the "slide" primitive (skewed clip wipe + inner counter-scale).
   ═════════════════════════════════════════════════════════════════════════ */
function OneWork() {
  const konsulat = PROJECTS.find((p) => p.key === 'konsulat')!
  return (
    <section id="thg-one-work" data-thg-bg="sand" className="thg-theme-sand thg-band relative">
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter)' }}>
        <Kicker>Reykjavík Konsúlat</Kicker>
        <SectionRule />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Eitt verk
        </h2>
        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '32em', marginTop: 'var(--thg-u16)' }}
        >
          {KOLASUNDID.body}
        </p>
        <div data-thg-reveal="ctn" className="flex flex-wrap items-baseline gap-x-5 gap-y-2" style={{ marginTop: 'var(--thg-u24)' }}>
          <p className="thg-fit m-0" style={{ fontFamily: GAMBETTA, fontWeight: 400, color: INK, fontSize: 'var(--thg-d3)', lineHeight: 1.15 }}>
            {KOLASUNDID.title}
          </p>
          <div className="flex items-center gap-2">
            <KindPill kind={konsulat.kind} />
            {konsulat.year ? (
              <span style={{ fontFamily: SUPREME, fontWeight: 600, color: MUTED, fontSize: '11px', letterSpacing: '.08em' }}>
                {konsulat.year}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 'var(--thg-u32)' }}>
          <RealPhoto
            file={PHOTOS.onePairA.file} alt={PHOTOS.onePairA.alt} reveal="slide"
            className="relative aspect-[4/3]" caption="Hafnarstræti 19, gatan"
          />
          <RealPhoto
            file={PHOTOS.onePairB.file} alt={PHOTOS.onePairB.alt} reveal="slide"
            className="relative aspect-[4/3] sm:mt-10" caption="Innandyra, sama hús"
          />
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §7 Utan og innan — the 10-point shutter merge
   ═════════════════════════════════════════════════════════════════════════ */
function InsideOut() {
  return (
    <section id="thg-inside" data-thg-bg="dark" className="relative" style={{ background: DARK }}>
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter) 0' }}>
        <Kicker tone="light">Utan og innan</Kicker>
        <SectionRule tone="light" />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Sama hús, tvö sjónarhorn
        </h2>
        <p
          data-thg-reveal="ctn"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--thg-body)', lineHeight: 1.6, maxWidth: '30em', marginTop: 'var(--thg-u16)' }}
        >
          Framhliðin við Austurvöll, og gestamóttakan innan við hana.
        </p>
      </div>

      <div className="thg-shutter-wrap">
        <div className="thg-shutter-sticky">
          <img src={IMG(PHOTOS.shutterBase.file)} alt={PHOTOS.shutterBase.alt} className="thg-shutter-base" />
          <div className="thg-shutter-panel thg-shutter-panel-l">
            <img src={IMG(PHOTOS.shutterPlate.file)} alt={PHOTOS.shutterPlate.alt} className="thg-shutter-panel-img thg-shutter-panel-img-l" loading="lazy" decoding="async" />
          </div>
          <div className="thg-shutter-panel thg-shutter-panel-r">
            <img src={IMG(PHOTOS.shutterPlate.file)} alt="" aria-hidden className="thg-shutter-panel-img thg-shutter-panel-img-r" loading="lazy" decoding="async" />
          </div>
          <span
            aria-hidden
            className="absolute bottom-4 left-4 z-10"
            style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: CHALK, background: DARK, padding: '.4em .7em' }}
          >
            Hótel Borg, framhliðin → gestamóttakan
          </span>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §8 Innandyra
   ═════════════════════════════════════════════════════════════════════════ */
function Interiors() {
  return (
    <section id="thg-interiors" data-thg-bg="chalk" className="thg-theme-chalk thg-band relative">
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter)' }}>
        <Kicker>Innandyra</Kicker>
        <SectionRule />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Rýmin sjálf
        </h2>
        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '34em', marginTop: 'var(--thg-u16)' }}
        >
          Myndirnar hér að neðan eru ljósmyndir af fullbúnum rýmum, ekki tölvumyndir. Hver mynd er merkt
          rýminu og húsinu sem hún tilheyrir.
        </p>

        <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 'var(--thg-u32)' }}>
          {INTERIORS.map((v, i) => (
            <div key={v.image} className={i === INTERIORS.length - 1 && INTERIORS.length % 2 === 1 ? 'sm:col-span-2' : undefined}>
              <InteriorPhoto file={v.image} alt={v.alt} room={v.room} project={v.project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §9 Stofan — the three numbers
   ═════════════════════════════════════════════════════════════════════════ */
function PracticeFacts() {
  return (
    <section id="thg-practice" data-thg-bg="sand" className="thg-theme-sand thg-band relative">
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter)' }}>
        <Kicker>Stofan</Kicker>
        <SectionRule />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Þrjár tölur
        </h2>

        <div className="grid gap-8 sm:grid-cols-3" style={{ marginTop: 'var(--thg-u32)' }}>
          {DOCUMENTS.map((d) => (
            <div key={d.label} data-thg-reveal="ctn">
              <p className="m-0" style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--thg-d3)', lineHeight: 1.15 }}>
                {d.count}
              </p>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, color: INK, fontSize: 'var(--thg-body)', letterSpacing: '.02em', textTransform: 'uppercase', marginTop: 'var(--thg-u4)' }}>
                {d.label}
              </p>
              <p className="m-0" style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)', lineHeight: 1.6, marginTop: 'var(--thg-u4)' }}>
                {d.note}
              </p>
            </div>
          ))}
        </div>

        <p
          data-thg-reveal="p"
          style={{ fontFamily: SUPREME, color: MUTED, fontSize: 'var(--thg-body)', lineHeight: 1.7, maxWidth: '32em', marginTop: 'var(--thg-u48)', borderTop: '1px solid rgba(22,26,23,.16)', paddingTop: 'var(--thg-u16)' }}
        >
          Verkefnin sjö á þessari síðu eru valin úr verkefnaskrá stofunnar á thg.is. Engu er bætt við
          og ekkert er sagt hér sem stofan hefur ekki þegar birt sjálf.
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
  const [topic, setTopic] = useState(ENQUIRY_TOPICS[0])

  const mailHref = useMemo(() => {
    const subject = `Fyrirspurn: ${topic}`
    const bodyLines = [
      `Nafn: ${name || '[nafn]'}`,
      `Netfang: ${addr || '[netfang]'}`,
      `Erindi: ${topic}`,
      '',
      'Skrifaðu skilaboð hér.',
    ]
    return `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  }, [name, addr, topic])

  return (
    <section id="thg-enquiry" data-thg-bg="river" className="thg-theme-river thg-band relative">
      <div style={{ padding: 'var(--thg-u64) var(--thg-gutter) var(--thg-u96)' }}>
        <Kicker tone="light">Hafa samband</Kicker>
        <SectionRule tone="light" />
        <h2
          data-thg-reveal="ctn"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--thg-d2)', lineHeight: 1.18, marginTop: 'var(--thg-u16)' }}
        >
          Fyrirspurn
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]" style={{ marginTop: 'var(--thg-u32)' }}>
          <form
            data-thg-reveal="ctn"
            className="flex flex-col gap-6"
            onSubmit={(e) => { e.preventDefault(); window.location.href = mailHref }}
          >
            <div>
              <label htmlFor="thg-f-name" className="sr-only">Nafn</label>
              <input id="thg-f-name" className="thg-field" placeholder="Nafn" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="thg-f-email" className="sr-only">Netfang</label>
              <input id="thg-f-email" type="email" className="thg-field" placeholder="Netfang" value={addr} onChange={(e) => setAddr(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="thg-f-topic" className="sr-only">Erindi</label>
              <select id="thg-f-topic" className="thg-field" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {ENQUIRY_TOPICS.map((t) => <option key={t} value={t} style={{ color: INK }}>{t}</option>)}
              </select>
            </div>
            <a href={mailHref} className="thg-cta self-start">
              Senda fyrirspurn
            </a>
            <p style={{ fontFamily: SUPREME, color: MUTED_ON_RIVER, fontSize: '13px', lineHeight: 1.5, maxWidth: '26em' }}>
              Opnast í tölvupóstforritinu þínu, stílað á {EMAIL}.
            </p>
          </form>

          <div data-thg-reveal="ctn" className="flex flex-col gap-6">
            <div>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--thg-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Bein leið</p>
              <a href={EMAIL_HREF} className="mt-2 block" style={{ fontFamily: GAMBETTA, fontWeight: 400, color: CHALK, fontSize: 'var(--thg-lead)', textDecoration: 'underline', textUnderlineOffset: '.18em' }}>
                {EMAIL}
              </a>
              <a href={PHONE_HREF} className="mt-1 block" style={{ fontFamily: SUPREME, color: CHALK, fontSize: 'var(--thg-body)' }}>
                {PHONE_DISPLAY}
              </a>
            </div>
            <div style={{ borderTop: '1px solid rgba(240,236,228,.22)', paddingTop: 'var(--thg-u16)' }}>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--thg-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Stofan</p>
              <p className="mt-2" style={{ fontFamily: SUPREME, color: CHALK, fontSize: 'var(--thg-body)', lineHeight: 1.6 }}>
                THG Arkitektar ehf. · {KT}<br />{ADDRESS}
              </p>
            </div>
            <div>
              <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--thg-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED_ON_RIVER }}>Stofnandi</p>
              <p className="mt-2" style={{ fontFamily: SUPREME, color: MUTED_ON_RIVER, fontSize: '14px', lineHeight: 1.6, maxWidth: '28em' }}>
                {PRACTICE.founder} arkitekt stofnaði stofuna í október {PRACTICE.founded}. Gæðakerfi {PRACTICE.quality}.
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
export default function ThgPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeStackRef = useRef<HTMLDivElement>(null)
  const enquiryWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => setNoindex(true), [])

  useEffect(() => {
    document.title = PAGE_TITLE
    setThemeColor(DARK)
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !tag
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    const prev = tag.content
    tag.content = PAGE_DESCRIPTION

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(script)

    return () => {
      script.remove()
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
     that rule guards against. */
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
      thgLenis = lenis
      const tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* ── 1. Dive-in hero: scale 1→1.8 from 50%/75%, three text layers
         parallax out at differential rates. One ScrollTrigger, onUpdate
         reads progress directly — "ease: none" by construction, since the
         value IS the scroll position (teardown Phase 6.1's rule). ── */
      const heroScroll = q('.thg-hero-scroll')[0] as HTMLElement | undefined
      const heroImg = q('.thg-hero-image')[0] as HTMLElement | undefined
      const heroEyebrow = q('.thg-hero-eyebrow')[0] as HTMLElement | undefined
      const heroH1 = q('.thg-hero-h1')[0] as HTMLElement | undefined
      const heroLower = q('.thg-hero-tagline, .thg-hero-body') as HTMLElement[]
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
      const domeSection = q('.thg-dome')[0] as HTMLElement | undefined
      const domeHeading = q('.thg-dome-heading')[0] as HTMLElement | undefined
      if (domeSection && domeHeading) {
        gsap.fromTo(domeHeading, { wordSpacing: '0vw' }, {
          wordSpacing: '2vw', ease: 'none',
          scrollTrigger: { trigger: domeSection, start: 'top bottom', end: 'top top', scrub: true },
        })
      }

      /* ── 3. The six reveal primitives, for real. ── */
      const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-thg-reveal]'))
      revealEls.forEach((el, i) => {
        const kind = el.dataset.thgReveal
        const stBase = { toggleActions: 'play none none none', once: true } as const

        if (kind === 'h') {
          splits.push(SplitText.create(el, {
            type: 'words,chars', wordsClass: 'thg-word', charsClass: 'thg-char', autoSplit: false,
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
            type: 'words,chars', wordsClass: 'thg-word', charsClass: 'thg-char', autoSplit: false,
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
          /* Deliberately NOT SplitText lines. Line-splitting measures the
             paragraph before layout has settled, and when it guesses wrong it
             locks every WORD into its own block wrapper, which shipped a page
             of one-word lines. A paragraph has to be readable; a masked-line
             reveal is decoration. Whole-element rise instead. */
          gsap.fromTo(el,
            { opacity: 0, y: 18 },
            {
              opacity: 1, y: 0, duration: DUR.m, ease: EASE.out,
              scrollTrigger: { trigger: el, start: 'top 88%', ...stBase },
            })
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

      /* ── 4. Utan og innan — the 10-point shutter merge. Panels traced as
         an outer-rect-with-a-hole in a single 10-point clip-path polygon
         (rebuilt every tick from 4 numbers via onUpdate — GSAP cannot
         safely interpolate polygon() strings whose point count/shape
         differs between phases, so the numbers are tweened, not the
         string). Phase 1 converges the hole's top/bottom edges toward a
         shared band (18.519%/81.481% — the ERA source's own hole
         geometry). Phase 2 merges the remaining slit to the screen's
         centre from both sides. Phase 3 is the push-through: once the
         plate is fully opaque, it scales up for a camera-push finish. Not
         a crossfade at any point. ── */
      const shutterWrap = q('.thg-shutter-wrap')[0] as HTMLElement | undefined
      const panelL = q('.thg-shutter-panel-l')[0] as HTMLElement | undefined
      const panelR = q('.thg-shutter-panel-r')[0] as HTMLElement | undefined
      const panelLImg = q('.thg-shutter-panel-img-l')[0] as HTMLElement | undefined
      const panelRImg = q('.thg-shutter-panel-img-r')[0] as HTMLElement | undefined
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
          root.querySelectorAll('[data-thg-reveal], [data-thg-reveal] *, .thg-hero-eyebrow, .thg-hero-h1, .thg-hero-h1 *, .thg-hero-tagline, .thg-hero-tagline *, .thg-hero-body'),
          { opacity: 1, clearProps: 'transform,clipPath' },
        )
      }, 2000)

      return () => {
        window.clearTimeout(failsafe)
        gsap.ticker.remove(tick)
        lenis.destroy()
        thgLenis = null
        splits.forEach((sp) => sp.revert())
      }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} className="thg-root relative" lang="is">
      <style>{PAGE_STYLES}</style>
      <Preloader />
      <Chrome />
      <main>
        <div ref={closeStackRef} className="thg-close-stack">
          <Hero />
          <Thesis />
          <Works />
          <Method />
          <Ledger />
          <OneWork />
          <InsideOut />
          <Interiors />
          <PracticeFacts />
        </div>
        <div ref={enquiryWrapRef} className="thg-enquiry-wrap">
          <Enquiry />
        </div>
      </main>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
