import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, COMPANY_LINE, COMPANY_ADDRESS,
  OWNERS, PHOTOS, VISUALS, MOUNTAINS, HOUSES, STATUS_LABEL, DOCUMENTS, ENQUIRY_HOUSES,
  NAV,
} from './data'
import type { HouseStatus } from './data'

const company = getPreviewCompany('heklusyn')

/* ═════════════════════════════════════════════════════════════════════════
   HEKLUSÝN — "Tólf hús". Design mechanics transplanted from the era-residence
   teardown (Phase 2.1 fluid canvas, Phase 5.4 self-theming chrome, Phase 5.7
   /13.4 reveal primitives, Phase 6 easing/duration set), the IDENTITY is
   entirely Heklusýn's own: chalk/sand/basalt/river, Gambetta + Supreme, land
   and river instead of arches and bougainvillea.

   FLUID CANVAS — adapted for a multi-route SPA: ERA sets `html{font-size:1vw}`
   globally so every `rem` resolves against the viewport. This app has ~90
   other routes sharing the same <html>, so touching the root font-size would
   break every other preview. Instead every --hk-u* token is written directly
   as `calc(Nvw / var(--hk-ratio))` — mathematically identical output (1600px
   canvas at ratio 16, zooms rather than reflows) with zero global blast
   radius. Body-sized text additionally gets a `max(17px, …)` floor: the pure
   vw formula alone would drop below the 17px minimum on narrow phones
   (375px < the 416px mobile canvas), which the brief calls out by name as
   the exact defect (ERA's 13px body) this build must not repeat.

   REVEALS — six primitives (a·h·p·ctn·line·slide), but built as whole-element
   / word-level CSS transitions driven by one IntersectionObserver + a 2s
   failsafe, not GSAP SplitText per character. Every element's resting CSS
   state (no JS) is fully visible; only a JS-added [data-hk-armed] attribute
   ever introduces a hidden state, and the failsafe forces `.hk-in` after 2s
   regardless of whether the observer fired — so a crawler, a paused rAF tab,
   or a screenshot mid-scroll never catches text at opacity:0. ─────────────── */

const FONTS_G = `${import.meta.env.BASE_URL}fonts/gambetta/`
const FONTS_S = `${import.meta.env.BASE_URL}fonts/supreme/`

const GAMBETTA = "'HK Gambetta', Georgia, serif"
const SUPREME = "'HK Supreme', -apple-system, sans-serif"

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Palette — computed relative-luminance contrast ratios (verified, not the
   brief's own unverified estimates — see final report):
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

/* ═══ Phase 2.1 — fluid canvas, scoped (see note above; no html/body edit) ═══ */
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
/* Tablet canvas the ERA source itself lacks (added per brief §6.1). Declared
   AFTER the mobile rule so it wins for 768–991 by source order. */
@media (max-width: 991px) { .hk-root {
  --hk-gutter: max(18px, var(--hk-u32));
  --hk-u24: var(--hk-u16); --hk-u32: var(--hk-u24); --hk-u48: var(--hk-u32);
  --hk-u64: var(--hk-u48); --hk-u96: var(--hk-u64); --hk-u160: var(--hk-u96);
} }
@media (max-width: 767px) { .hk-root { --hk-ratio: 4.16; } }
@media (min-width: 768px) and (max-width: 991px) { .hk-root { --hk-ratio: 8.34; } }
/* Display numerators are per-tier, not one shared formula rescaled — exactly
   how the ERA source itself does it (Phase 2.2: h1 is 192 desktop but a
   separately-authored 96 on mobile, not 192 run through the mobile ratio).
   A single shared N for --hk-d1/d2/d3 would put unbroken Icelandic words
   ("Sjóndeildarhringurinn", 21 letters; "Eyjafjallajökull", 16) past the
   331px content width on a 375px phone. Below 767px every numerator gets its
   own smaller, hand-fit value; the word-break safety net below is the second
   line of defence if a string is still too long to sit on one line. */
@media (max-width: 767px) { .hk-root {
  --hk-num: calc(190vw / var(--hk-ratio));
  --hk-d1: calc(76vw / var(--hk-ratio));
  --hk-d2: calc(50vw / var(--hk-ratio));
  --hk-d3: calc(34vw / var(--hk-ratio));
} }
.hk-root ::selection { background: ${INK}; color: ${CHALK}; }
.hk-root :focus-visible { outline: 2px solid var(--hk-t-accent, ${RIVER}); outline-offset: 3px; border-radius: 2px; }
/* Every section is a scrollIntoView target from the fixed 56px chrome bar —
   without this, jumping to a section tucks its heading straight under it. */
.hk-root main > header, .hk-root main > section { scroll-margin-top: 68px; }
/* Belt-and-suspenders: no single Gambetta word (wordmark, headings, the
   mountain name display) may ever force a horizontal scrollbar, regardless
   of exact font-metric assumptions above. lang="is" is set on the root so
   browsers with an Icelandic hyphenation dictionary break cleanly; browsers
   without one still fall back to a plain break rather than overflowing. */
.hk-root h1, .hk-root h2, .hk-root h3, .hk-root .hk-fit {
  overflow-wrap: break-word; word-break: break-word; hyphens: auto;
}

/* ═══ Phase 5.4 — self-theming bands. Components read only the semantic
   tokens; a section changes its whole identity by swapping the wrapper class.
   Icelandic accents (ð/þ/Á etc.) need open leading, so every heading here
   sits at ≥1.15 line-height per brief §8. ═══ */
.hk-theme-chalk { --hk-t-ink:${INK}; --hk-t-ground:${CHALK}; --hk-t-muted:${MUTED}; --hk-t-accent:${RIVER}; }
.hk-theme-sand  { --hk-t-ink:${INK}; --hk-t-ground:${SAND};  --hk-t-muted:${MUTED}; --hk-t-accent:${RIVER}; }
.hk-theme-dark  { --hk-t-ink:${CHALK}; --hk-t-ground:${DARK}; --hk-t-muted:${MUTED_ON_DARK}; --hk-t-accent:${ACCENT_ON_DARK}; }
.hk-theme-river { --hk-t-ink:${CHALK}; --hk-t-ground:${RIVER}; --hk-t-muted:${MUTED_ON_RIVER}; --hk-t-accent:${CHALK}; }
.hk-band { background: var(--hk-t-ground); color: var(--hk-t-ink); }

/* ═══ Fixed chrome — wordmark + nav, one element re-themed together (our
   chrome is a single top row, unlike ERA's four spatially separate pieces;
   see final report for why one line-observer is the correct scoped version
   of Phase 5.4/13.3 here). 0.4s colour transition, never anything else. ═══ */
.hk-chrome { transition: color var(--hk-dur-s) var(--hk-ease-out); }
.hk-chrome-bar { transition: background-color var(--hk-dur-s) var(--hk-ease-out), border-color var(--hk-dur-s) var(--hk-ease-out); }

/* ═══ Phase 5.7/13.4 — the six reveal primitives, generalised. Resting state
   (no [data-hk-armed]) is ALWAYS the fully visible end state — a crawler or a
   pre-hydration screenshot sees complete text. JS arms the hidden start only
   after mount; the reveal hook adds .hk-in on intersect OR after a 2s
   failsafe, whichever comes first. Never opacity:0 as an unconditional start. ═══ */
[data-hk-reveal] { opacity: 1; transform: none; clip-path: none; }
[data-hk-reveal][data-hk-armed="1"] {
  transition: opacity var(--hk-dur-l) var(--hk-ease-out),
              transform var(--hk-dur-l) var(--hk-ease-out),
              clip-path var(--hk-dur-l) var(--hk-ease-out);
}
[data-hk-reveal="a"][data-hk-armed="1"]    { opacity: 0; transform: translateX(1.4em) rotateX(35deg); transform-origin: bottom left; }
[data-hk-reveal="h"][data-hk-armed="1"]    { opacity: 0; transform: translateY(38%) rotateX(40deg); transform-origin: bottom center; }
[data-hk-reveal="ctn"][data-hk-armed="1"]  { opacity: 0; transform: translateY(var(--hk-u24)); }
[data-hk-reveal="p"][data-hk-armed="1"]    { clip-path: inset(0 0 100% 0); }
[data-hk-reveal="line"][data-hk-armed="1"] { clip-path: inset(0 0 100% 0); transform-origin: left center; }
[data-hk-reveal="slide"][data-hk-armed="1"]{ clip-path: polygon(100% 0%, 100% 0%, 108% 100%, 24% 100%); }
[data-hk-reveal].hk-in {
  opacity: 1 !important; transform: none !important; clip-path: inset(0 0 0% 0) !important;
}
[data-hk-reveal="slide"].hk-in { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) !important; }
[data-hk-reveal] { perspective: 900px; }
.hk-stagger-1 { transition-delay: .06s !important; } .hk-stagger-2 { transition-delay: .12s !important; }
.hk-stagger-3 { transition-delay: .18s !important; } .hk-stagger-4 { transition-delay: .24s !important; }
.hk-stagger-5 { transition-delay: .30s !important; } .hk-stagger-6 { transition-delay: .36s !important; }
.hk-stagger-7 { transition-delay: .42s !important; } .hk-stagger-8 { transition-delay: .48s !important; }
.hk-mask { overflow: hidden; padding-top: 0.22em; margin-top: -0.22em; }

/* ═══ Arrival — scrubbed dive-in. The transform is rewritten every scroll
   tick from JS (rAF-throttled) and NEVER carries a CSS transition, per the
   brief's explicit rule against transitioning a property you rewrite on
   every tick. Reduced motion: the scroll listener is never attached at all,
   so the image simply sits at its resting scale(1). ═══ */
/* No permanent will-change: promoting a full-viewport image to its own
   compositor layer for the whole page life costs memory for no benefit while
   the hero is at rest. The scroll handler adds it only while the dive-in is
   actually running, and drops it again at rest. */
.hk-hero-img { transform: none; transform-origin: 50% 75%; }
/* Computed against the WORST case (a pure-white pixel from the source photo
   sitting directly behind the text, not just against an assumed dark patch):
   at .85 the eyebrow (chalk text at .78 element-opacity) still clears 6.6:1,
   at .90 the body line (.86 opacity) clears 7.6:1 and the solid H1/tagline
   clear 9.7:1/11.5:1. The gradient reaches .85 by 52% down the frame, well
   above where the text block actually sits, so every line in it — including
   the topmost eyebrow — sits in the guaranteed-dark zone, not the soft
   fade above it. */
.hk-hero-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(20,24,21,.10) 0%, rgba(20,24,21,.22) 34%, rgba(20,24,21,.85) 52%, rgba(20,24,21,.92) 100%);
}

/* ═══ Sjóndeildarhringurinn — horizon strip ═══ */
.hk-ridge { position: relative; }
.hk-ridge-line { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: rgba(240,236,228,.45); }
.hk-ridge-btn {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: .5em;
  background: none; border: 0; padding: .5em .3em; cursor: pointer; min-height: 44px;
  color: rgba(240,236,228,.72); font-family: ${SUPREME};
}
.hk-ridge-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(240,236,228,.55); transition: background var(--hk-dur-s) var(--hk-ease-out), transform var(--hk-dur-s) var(--hk-ease-out); }
.hk-ridge-btn[aria-pressed="true"] { color: ${CHALK}; }
.hk-ridge-btn[aria-pressed="true"] .hk-ridge-dot { background: ${ACCENT_ON_DARK}; transform: scale(1.7); }
@media (prefers-reduced-motion: no-preference) {
  .hk-ridge-dot { transition: background var(--hk-dur-s) var(--hk-ease-out), transform var(--hk-dur-s) var(--hk-ease-out); }
}

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
@media (prefers-reduced-motion: no-preference) {
  .hk-row-plus { transition: transform var(--hk-dur-m) var(--hk-ease-in-out); }
}
.hk-filter-chip { min-height: 44px; transition: background-color var(--hk-dur-s) var(--hk-ease-out), color var(--hk-dur-s) var(--hk-ease-out), border-color var(--hk-dur-s) var(--hk-ease-out); }
.hk-filter-chip[aria-pressed="true"] { background: ${INK}; color: ${CHALK}; border-color: ${INK}; }

/* ═══ Árstíðirnar — shutter reveal via converging clip-path polygons ═══ */
.hk-shutter { position: absolute; inset: 0; background: ${DARK}; }
/* Base/resting state (no JS, no [data-hk-armed]) is the OPEN state — both
   panels collapsed to zero height, winter-dusk fully visible, same rule as
   every other primitive on this page. JS arms a transient half-covering
   "closed" look; the observer/failsafe then reveals it back open — never
   the reverse, so a paused-rAF or no-JS render never gets stuck hiding the
   photo. */
.hk-shutter-top { clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%); }
.hk-shutter-bottom { clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%); }
[data-hk-armed="1"].hk-shutter-top {
  clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%);
  transition: clip-path var(--hk-dur-l) var(--hk-ease-in-out);
}
[data-hk-armed="1"].hk-shutter-bottom {
  clip-path: polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%);
  transition: clip-path var(--hk-dur-l) var(--hk-ease-in-out);
}
[data-hk-armed="1"].hk-shutter-top.hk-in { clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%); }
[data-hk-armed="1"].hk-shutter-bottom.hk-in { clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%); }

/* ═══ Enquiry form ═══ */
.hk-field { width: 100%; min-height: 48px; background: transparent; border: 0; border-bottom: 1px solid rgba(240,236,228,.4); color: ${CHALK}; font-family: ${SUPREME}; font-size: var(--hk-body); padding: .6em .1em; }
.hk-field::placeholder { color: rgba(240,236,228,.5); }
.hk-field:focus { border-bottom-color: ${ACCENT_ON_DARK}; }
@media (prefers-reduced-motion: no-preference) { .hk-field { transition: border-color var(--hk-dur-s) var(--hk-ease-out); } }
select.hk-field { appearance: none; }

.hk-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: .6em;
  min-height: 48px; padding: 0 1.6em; background: ${CHALK}; color: ${INK};
  font-family: ${SUPREME}; font-weight: 600; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
}
@media (prefers-reduced-motion: no-preference) {
  .hk-cta { transition: transform var(--hk-dur-s) var(--hk-ease-out), background-color var(--hk-dur-s) var(--hk-ease-out); }
  .hk-cta:hover { transform: translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  [data-hk-reveal][data-hk-armed="1"] { opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; }
  /* The blanket clip-path:none above would fully re-cover the winter photo
     for the shutter panels (their box is inset:0, so "no clipping" means the
     whole area) — force them to their own open/collapsed shape instead. */
  [data-hk-armed="1"].hk-shutter-top { clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%) !important; transition: none !important; }
  [data-hk-armed="1"].hk-shutter-bottom { clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%) !important; transition: none !important; }
  .hk-hero-img { transform: none !important; }
}
`

/* ═════════════════════════════════════════════════════════════════════════
   Reveal hook — one IntersectionObserver drives every [data-hk-reveal]
   element on the page; a 2s window.setTimeout failsafe (NOT rAF-based, so
   it fires even with rAF paused) forces every unrevealed element visible
   regardless of whether it ever scrolled into view. ═══════════════════════ */
function useHkReveals() {
  useEffect(() => {
    if (prefersReduced()) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-hk-reveal]'))
    if (!els.length) return
    els.forEach((el) => el.setAttribute('data-hk-armed', '1'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hk-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add('hk-in'))
    }, 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])
}

/* Self-theming fixed chrome (Phase 5.4/13.3), scoped with IntersectionObserver
   line-probes instead of a GSAP ScrollTrigger per element, per the brief. Our
   fixed chrome is a single row (wordmark + nav), so one probe line at that
   row's vertical centre is the correct, minimal application of the mechanic. */
function useHkChromeTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    let io: IntersectionObserver | null = null
    let resizeTimer: number | undefined
    const CHROME_Y = 44
    const build = () => {
      io?.disconnect()
      const winH = window.innerHeight
      const top = Math.max(0, Math.round(CHROME_Y))
      const bottom = Math.max(0, Math.round(winH - CHROME_Y - 1))
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
      document.querySelectorAll('[data-hk-bg]').forEach((el) => io!.observe(el))
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
  }, [])
  return theme
}

/* Scrubbed hero dive-in: scale(1 → 1.12) from transform-origin 50% 75%,
   tracking scroll directly (rAF-throttled), never a CSS transition on this
   property. Skipped entirely under reduced motion — the image then sits at
   its CSS-default resting scale(1), no JS, no motion. */
function useHeroDive(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    let ticking = false
    const update = () => {
      ticking = false
      const rect = el.parentElement?.getBoundingClientRect()
      const h = el.parentElement?.offsetHeight || window.innerHeight
      const top = rect ? -rect.top : 0
      const progress = Math.min(1, Math.max(0, top / h))
      // At rest, leave the element unpromoted: no transform, no will-change.
      // Promote only while the dive-in is actually moving, so the full-viewport
      // image does not hold its own compositor layer for the whole page life.
      if (progress <= 0) {
        el.style.transform = 'none'
        el.style.willChange = 'auto'
      } else {
        el.style.willChange = 'transform'
        el.style.transform = `scale(${1 + progress * 0.12})`
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])
}

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
  file, alt, caption, priority = false, className = '', position = 'center',
}: {
  file: string; alt: string; caption?: string; priority?: boolean; className?: string; position?: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`m-0 overflow-hidden ${className}`}>
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
   Fixed chrome — wordmark + nav, self-themed (Phase 5.4 mechanic)
   ═════════════════════════════════════════════════════════════════════════ */
function Chrome() {
  const theme = useHkChromeTheme()
  const light = theme === 'light'
  const ink = light ? INK : CHALK
  const barBg = light ? 'rgba(240,236,228,.7)' : 'rgba(20,24,21,.42)'
  const barBorder = light ? 'rgba(22,26,23,.12)' : 'rgba(240,236,228,.16)'

  const go = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div
      className="hk-chrome-bar fixed inset-x-0 top-0 z-40 flex items-center justify-between backdrop-blur-md"
      style={{ background: barBg, borderBottom: `1px solid ${barBorder}`, minHeight: '56px', padding: '0 var(--hk-gutter)' }}
    >
      <a
        href="#hk-hero"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }) }}
        className="hk-chrome inline-flex min-h-[44px] items-center"
        style={{ color: ink, fontFamily: GAMBETTA, fontWeight: 600, fontSize: '17px', letterSpacing: '.02em' }}
      >
        Heklusýn
      </a>
      <nav aria-label="Kaflar síðunnar" className="hidden items-center gap-6 lg:flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className="hk-chrome min-h-[44px] whitespace-nowrap"
            style={{ color: ink, opacity: 0.82, fontFamily: SUPREME, fontWeight: 600, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase' }}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => go('hk-enquiry')}
        className="hk-chrome hk-cta"
        style={{ background: ink, color: light ? CHALK : INK, minHeight: '44px', padding: '0 1.1em', fontSize: '11px' }}
      >
        Fyrirspurn
      </button>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §1 Arrival — Koma
   ═════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const imgRef = useRef<HTMLDivElement>(null)
  useHeroDive(imgRef)
  return (
    <header
      id="hk-hero"
      data-hk-bg="dark"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      style={{ background: DARK }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imgRef} className="hk-hero-img absolute inset-0">
          <img
            src={IMG(PHOTOS.heroEstate.file)} alt={PHOTOS.heroEstate.alt}
            loading="eager" decoding="async" {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover" style={{ objectPosition: '50% 62%' }}
          />
        </div>
        <div className="hk-hero-scrim" aria-hidden />
      </div>

      <div className="relative z-10" style={{ padding: `0 var(--hk-gutter) calc(var(--hk-u64) + 56px)` }}>
        <p
          data-hk-reveal="ctn"
          className="m-0"
          style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(240,236,228,.78)' }}
        >
          {company.location}
        </p>

        <h1
          data-hk-reveal="h"
          className="m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d1)', lineHeight: 1.18, letterSpacing: '-0.01em' }}
        >
          Heklusýn
        </h1>

        <p
          data-hk-reveal="a"
          className="hk-mask m-0"
          style={{
            fontFamily: GAMBETTA, fontStyle: 'italic', fontWeight: 400, color: CHALK,
            fontSize: 'var(--hk-d3)', lineHeight: 1.24, marginTop: 'var(--hk-u12)', maxWidth: '18em',
          }}
        >
          Landið heldur húsinu.
        </p>

        <p
          data-hk-reveal="ctn"
          className="hk-stagger-2 m-0"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.86)', fontSize: 'var(--hk-body)', lineHeight: 1.6, marginTop: 'var(--hk-u24)', maxWidth: '30em' }}
        >
          Fimmtíu hektarar á vesturbakka Ytri-Rangár. Tólf til fjórtán hús á öllu svæðinu, ekkert fleira.
        </p>
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

        <div
          className="mt-10 grid gap-6 sm:grid-cols-2"
          style={{ marginTop: 'var(--hk-u32)' }}
        >
          <div data-hk-reveal="h" className="hk-mask">
            <p
              className="m-0"
              style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-num)', lineHeight: 1.02, letterSpacing: '-0.02em' }}
            >
              50
            </p>
            <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.18em', textTransform: 'uppercase', color: MUTED }}>
              hektarar
            </p>
          </div>
          <div data-hk-reveal="h" className="hk-mask hk-stagger-2">
            {/* Stacked, not inline: "12 til 14" set at full --hk-num width would
                overflow narrow phones (two 2-digit numbers plus the word "til"
                side by side is far wider than "50" alone). Stacking keeps every
                line the same measured width as the "50" figure at every canvas
                size, so nothing clips at 375px. */}
            <p
              className="m-0"
              style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-num)', lineHeight: 0.98, letterSpacing: '-0.02em' }}
            >
              12
            </p>
            <p
              className="m-0"
              style={{ fontFamily: SUPREME, fontWeight: 600, color: MUTED, fontSize: 'var(--hk-label)', letterSpacing: '.18em', textTransform: 'uppercase', padding: '.15em 0' }}
            >
              til
            </p>
            <p
              className="m-0"
              style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-num)', lineHeight: 0.98, letterSpacing: '-0.02em' }}
            >
              14
            </p>
            <p className="m-0" style={{ fontFamily: SUPREME, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.18em', textTransform: 'uppercase', color: MUTED, marginTop: '.2em' }}>
              hús
            </p>
          </div>
        </div>

        <p
          data-hk-reveal="p"
          className="mt-10"
          style={{
            fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-lead)', lineHeight: 1.6,
            maxWidth: '32em', marginTop: 'var(--hk-u32)',
          }}
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
          data-hk-reveal="h"
          className="hk-mask m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Sjóndeildarhringurinn
        </h2>
        <p
          data-hk-reveal="ctn"
          className="hk-stagger-2"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: 'var(--hk-u16)' }}
        >
          Frá landinu sjást átta fjöll. Þau eru nefnd hér og staðsett á myndinni til skýringar, ekki eftir mældri
          hnitasetningu. Veldu nafn til að sjá það á sjóndeildarhringnum.
        </p>
      </div>

      <div className="hk-ridge relative mt-8" style={{ marginTop: 'var(--hk-u32)' }}>
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <RealPhoto file={PHOTOS.landRiver.file} alt={PHOTOS.landRiver.alt} className="absolute inset-0 h-full w-full" />
          {/* .74 at the bottom (verified against a worst-case white photo
              pixel: the selected mountain name still clears 6.5:1) rather
              than a softer .65, since the large display name text sits
              right at this edge. */}
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
              style={{
                fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d3)',
                lineHeight: 1.2, padding: '0 var(--hk-gutter) var(--hk-u24)',
              }}
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
   §4 Landið
   ═════════════════════════════════════════════════════════════════════════ */
function Land() {
  return (
    <section id="hk-land" data-hk-bg="sand" className="hk-theme-sand hk-band relative">
      <div className="grid gap-0 lg:grid-cols-2">
        <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }} className="flex flex-col justify-center">
          <Kicker>Uppruni</Kicker>
          <SectionRule />
          <h2
            data-hk-reveal="h"
            className="hk-mask m-0"
            style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
          >
            Landið
          </h2>
          <p
            data-hk-reveal="p"
            style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '30em', marginTop: 'var(--hk-u24)' }}
          >
            Landið var áður hluti af sögulegu bújörðinni Leirubakka. Það varð sjálfstæð eign við Ytri-Rangá árið
            2020, félagið sjálft skráð ári síðar.
          </p>
          <p
            data-hk-reveal="p"
            className="hk-stagger-2"
            style={{ fontFamily: SUPREME, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '30em', marginTop: 'var(--hk-u16)' }}
          >
            Á svæðinu er þess gætt að raska sem minnst núverandi hraunmyndunum, mosa og gróðri sem fyrir er.
          </p>
        </div>
        <div className="relative min-h-[46svh] lg:min-h-0">
          <RealPhoto
            file={PHOTOS.houseAutumn.file}
            alt={PHOTOS.houseAutumn.alt}
            className="absolute inset-0 h-full w-full"
            caption="Húsið á haustbakkanum"
          />
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §5 Húsin — ledger
   ═════════════════════════════════════════════════════════════════════════ */
function StatusPill({ status }: { status: HouseStatus }) {
  // Tinted pill backgrounds are translucent, so the visible contrast is the
  // TEXT against the flattened (tint-over-ground) colour, not against the
  // raw token — computed and verified for both chalk and sand grounds (see
  // final report). River #3E5C6B on its own 14%-tint pill only clears
  // 4.42:1 on sand (fails AA-normal at 4.5); #2A4048 (a darker river) clears
  // 6.75:1 there and 7.60:1 on chalk.
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
            data-hk-reveal="h"
            className="hk-mask m-0"
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
   §6 Eitt hús — Rangárslétta 2
   ═════════════════════════════════════════════════════════════════════════ */
function OneHouse() {
  const r2 = HOUSES[0]
  return (
    <section id="hk-one-house" data-hk-bg="sand" className="hk-theme-sand hk-band relative">
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter)' }}>
        <Kicker>Rangárslétta 2</Kicker>
        <SectionRule />
        <h2
          data-hk-reveal="h"
          className="hk-mask m-0"
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
            file={PHOTOS.construction.file} alt={PHOTOS.construction.alt}
            className="relative aspect-[4/3]" caption="Grindin rís"
          />
          <RealPhoto
            file={PHOTOS.houseBuilt.file} alt={PHOTOS.houseBuilt.alt}
            className="relative aspect-[4/3] sm:mt-10" caption="Fullbúið, sama lóð"
          />
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §7 Árstíðirnar — shutter reveal
   ═════════════════════════════════════════════════════════════════════════ */
function Seasons() {
  return (
    <section id="hk-seasons" data-hk-bg="dark" className="relative" style={{ background: DARK }}>
      <div style={{ padding: 'var(--hk-u64) var(--hk-gutter) 0' }}>
        <Kicker tone="light">Árstíðirnar</Kicker>
        <SectionRule tone="light" />
        <h2
          data-hk-reveal="h"
          className="hk-mask m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: CHALK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Árstíðirnar
        </h2>
        <p
          data-hk-reveal="ctn"
          className="hk-stagger-2"
          style={{ fontFamily: SUPREME, color: 'rgba(240,236,228,.78)', fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '30em', marginTop: 'var(--hk-u16)' }}
        >
          Sama land, tvær árstíðir.
        </p>
      </div>

      <div className="relative mt-8 w-full overflow-hidden" style={{ aspectRatio: '16 / 10', marginTop: 'var(--hk-u32)' }}>
        {/* Winter beneath, always present */}
        <RealPhoto file={PHOTOS.winterDusk.file} alt={PHOTOS.winterDusk.alt} className="absolute inset-0 h-full w-full" caption="Vetur, í rökkri" />
        {/* Summer layer above, revealed away by the shutter panels opening from the centre */}
        <div className="absolute inset-0">
          <RealPhoto file={PHOTOS.landRiver.file} alt={PHOTOS.landRiver.alt} className="absolute inset-0 h-full w-full" caption="Áin, að degi til" />
        </div>
        <div data-hk-reveal="shutter" className="hk-shutter hk-shutter-top" aria-hidden />
        <div data-hk-reveal="shutter" className="hk-shutter hk-shutter-bottom" aria-hidden />
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
          data-hk-reveal="h"
          className="hk-mask m-0"
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
          data-hk-reveal="h"
          className="hk-mask m-0"
          style={{ fontFamily: GAMBETTA, fontWeight: 300, color: INK, fontSize: 'var(--hk-d2)', lineHeight: 1.18, marginTop: 'var(--hk-u16)' }}
        >
          Gögnin
        </h2>

        <div className="grid gap-8 sm:grid-cols-3" style={{ marginTop: 'var(--hk-u32)' }}>
          {DOCUMENTS.map((d, i) => (
            <div key={d.label} data-hk-reveal="ctn" className={`hk-stagger-${i + 1}`}>
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
          data-hk-reveal="h"
          className="hk-mask m-0"
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

          <div data-hk-reveal="ctn" className="hk-stagger-2 flex flex-col gap-6">
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
   Page
   ═════════════════════════════════════════════════════════════════════════ */
export default function HeklusynPage() {
  useHkReveals()

  useEffect(() => {
    document.title = 'Heklusýn · Tólf hús á fimmtíu hekturum'
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

  return (
    <div className="hk-root relative" lang="is">
      <style>{PAGE_STYLES}</style>
      <Chrome />
      <main>
        <Hero />
        <Thesis />
        <Horizon />
        <Land />
        <Houses />
        <OneHouse />
        <Seasons />
        <Visuals />
        <Docs />
        <Enquiry />
      </main>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
