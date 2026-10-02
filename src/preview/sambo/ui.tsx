import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { PokaHnappur, poki } from './poki'
import { pop } from './popup'
import { PK } from './vorur'

/* The noho.ink system as rebuilt for Góa (2026-09-21), re-aimed at Katla and
   Ísfugl, and now at Sambó (Kólus ehf., 2026-10-02). Source of every number
   here: _docs/noho-teardown.md (§ refs below). Sambó keeps 90% of it and
   changes 10% on purpose so it is not a copy of the reference: Gloock for
   display (the family of their own wordmark), General Sans for text, soft
   corners and pill buttons, a checkerboard hero scatter, the deep teal of
   their wordmark as the ink, and the footer in the red of their packs.
   See _docs/SAMBO-BUILD-2026-10-03.md.

   The two rules that carry the whole thing:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped
        parent, opacity untouched. Title lines start at 108%.
     2. One ease does almost everything: custom-our = cubic-bezier(.17,.17,0,1). */

export const C = {
  rautt: '#D3202A',
  gull: '#D4A24C',
  blek: '#06222E',
  pappir: '#F1E8D6',
  pappirHreint: '#FAF5EA',
  dokkt: '#041A24',
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

/* §0.7: device and input are two axes. Compact = the tablet/phone layout. */
export const isCompact = () => typeof window !== 'undefined' && window.innerWidth <= 991
export const isPhone = () => typeof window !== 'undefined' && window.innerWidth <= 479

const D = (n: string) => `${import.meta.env.BASE_URL}fonts/${n}`

/* Tokens are registered so the 0.6s theme switch interpolates every one of
   them individually, which is what noho does with its 24 (§4.7): a mid-tween
   frame shows colours that belong to neither palette. */
const TOK: [string, string][] = [
  ['--c-bg', '#FAF5EA'], ['--c-el', '#F1E8D6'], ['--c-el2', '#E8DABC'], ['--c-el3', '#DBC8A0'],
  ['--c-ink', '#06222E'], ['--c-ink-med', 'rgba(6,34,46,.6)'], ['--c-ink-max', 'rgba(6,34,46,.4)'],
  ['--c-btn', '#06222E'], ['--c-btn-t', '#FAF5EA'], ['--c-btn2', '#FFFDF8'], ['--c-btn2-t', '#06222E'],
  ['--c-form', '#FFFDF8'], ['--c-rautt', '#D3202A'], ['--c-lina', 'rgba(6,34,46,.14)'],
]

export const CSS = `
@font-face{font-family:'SB Gloock';src:url('${import.meta.env.BASE_URL}sambo/fonts/gloock-400.woff2') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'SB General';src:url('${D('general-sans/GeneralSans-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'SB General';src:url('${D('general-sans/GeneralSans-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'SB General';src:url('${D('general-sans/GeneralSans-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}

${TOK.map(([k, v]) => `@property ${k}{syntax:'<color>';inherits:true;initial-value:${v}}`).join('\n')}

/* Palette, in noho's tiers (§1 of the CSS part): a warm page, three element
   grounds that cards cycle through by position, charcoal-brown ink, square
   buttons. Sambó's red and the gold of their script are accents only, the way noho keeps its colour
   in the photography. Dark is warm brown, not grey (#2E241C there, the walnut
   in their photos; here a cocoa brown), and the header chrome and
   the switches deliberately stay light in it. */
.sb-root{
  ${TOK.map(([k, v]) => `${k}:${v};`).join(' ')}
  --c-gull:#D4A24C; --c-hdr:#FFFDF8; --c-hdr-t:#06222E;
  --c-flotur:var(--c-el);
  --ease:cubic-bezier(.17,.17,0,1);
  --ease-popup:cubic-bezier(.6,0,0,1);
  --ease-cas:cubic-bezier(.2,0,.1,1);
  --f-disp:'SB Gloock',Georgia,serif;
  /* §4 layout primitives: one gutter and one section gap, both viewport
     units, changing twice. Sections carry no vertical padding at all. */
  --gut:2.0833vw;
  --gap:22.2222vh;
  --band:var(--gap);
  --col:1.0417vw;
  background:var(--c-bg); color:var(--c-ink);
  font-family:'SB General',system-ui,sans-serif;
  font-size:clamp(16px,1.0417vw,19px); line-height:1.5;
  -webkit-font-smoothing:antialiased;
  transition:${TOK.map(([k]) => `${k} .6s var(--ease)`).join(',')};
  display:flex;flex-direction:column;row-gap:var(--gap);
  overflow-x:clip;
}
@media (max-width:991px){.sb-root{--gut:2.604vw;--gap:12.121vh;--col:1.302vw}}
@media (max-width:479px){.sb-root{--gut:max(2.778vw,12px);--gap:12.5vh;--col:2.778vw}}
.sb-root > main{display:contents}
/* the shared prototype credit follows main inside the root; without this
   it sat one section gap below the red footer, on a bare brown/cream band */
.sb-root > main + *{margin-top:calc(-1 * var(--gap))}
.sb-root *,.sb-root *::before,.sb-root *::after{box-sizing:border-box}
.sb-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(211,32,42,.14)}
.sb-root{color-scheme:light}
/* Safari 26 tints the status and home-indicator strips from html/body, not
   from an inner wrapper, so the page colour has to live there too. */
html:has(.sb-root),body:has(.sb-root){background-color:#FAF5EA}
.sb-root :is(section[id],[id].sb-kafli){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
.sb-root img{display:block;max-width:100%;height:auto}
.sb-root a{color:inherit;text-decoration:none}
.sb-root :focus-visible{outline:2px solid var(--c-rautt);outline-offset:3px}
:where(.sb-root) button{font:inherit;color:inherit}

/* type: §5.3. Every size locked to the viewport width, a different vw per
   breakpoint, tablet and phone sharing a scale. Gloock (Sambó) replaces Góa's Gambarino
   over the reference's Switzer; its tracking is opened from -0.04em to
   -0.03em because a serif at -0.04 closes its counters (declared). */
.sb-disp{font-family:var(--f-disp);font-weight:400;letter-spacing:-.03em;line-height:1;
  font-size:4.17vw;margin:0;text-wrap:balance}
@media (max-width:991px){.sb-disp{font-size:6.25vw;line-height:.95}}
@media (max-width:479px){.sb-disp{font-size:min(13.333vw,3.4rem);line-height:.95}}
.sb-sub{font-family:var(--f-disp);font-weight:400;letter-spacing:-.02em;line-height:1.05;
  font-size:2.08vw;margin:0}
@media (max-width:991px){.sb-sub{font-size:3.255vw}}
@media (max-width:479px){.sb-sub{font-size:max(1.35rem,6.4vw)}}
.sb-merki{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:var(--c-ink-med);margin:0 0 1em}
.sb-brod{max-width:52ch;margin:0;color:var(--c-ink)}
.sb-daufur{color:var(--c-ink-med)}
.sb-smatt{font-size:.8rem;line-height:1.45;color:var(--c-ink-med);margin:.25rem 0 0}
.sb-verd{font-variant-numeric:tabular-nums;font-weight:500}
.sb-wrap{padding:0 var(--gut);position:relative}
/* headings centred on desktop and tablet, flush left on a phone (§5.3:
   13 start / 11 centred at 1440, 23 / 1 at 390) */
.sb-midja{text-align:center;margin-left:auto;margin-right:auto}
@media (max-width:479px){.sb-midja{text-align:left;margin-left:0}}

/* mask rise. opacity is never animated anywhere on this page. --- */
.sb-mask{overflow:hidden;display:block}
.sb-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.sb-maskP > .sb-up{transform:translateY(118%)}
.on .sb-maskP > .sb-up,.sb-maskP.on > .sb-up,.sb-maskP > .sb-up.on{transform:translateY(0)}
.sb-root.sb-allt .sb-maskP > .sb-up{transform:translateY(0)}
/* Display masks need room at both ends for Icelandic: the acute on Ú and Í
   sits above cap height, ð g ö þ hang below the baseline. Paid back with
   negative margin so the rhythm does not move; lines start at 125%. */
.sb-disp .sb-mask,.sb-sub .sb-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
.sb-disp .sb-lina,.sb-sub .sb-lina{transform:translateY(125%)}
.on .sb-disp .sb-lina,.sb-disp.on .sb-lina,.sb-disp .sb-lina.on,
.on .sb-sub .sb-lina,.sb-sub .sb-lina.on{transform:translateY(0)}
.sb-root.sb-allt .sb-disp .sb-lina,.sb-root.sb-allt .sb-sub .sb-lina{transform:translateY(0)}
.sb-up{transform:translateY(100%);transition:transform var(--dur,1s) var(--ease);transition-delay:var(--d,0s);will-change:transform}
.sb-lina{transform:translateY(108%)}
.on .sb-up,.sb-up.on{transform:translateY(0)}
/* §4.4: on a phone a staggered group becomes one trigger per item, so the
   stagger delay goes; each item rises as it reaches the reading zone. */
@media (max-width:479px){.sb-hver > * .sb-up,.sb-hver > .sb-up{transition-delay:0s}}

/* buttons: square, noho's three kinds (§6). Labels roll per letter. */
.sb-btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;border:0;cursor:pointer;
  padding:1.042vw 2.865vw;min-height:44px;font-size:.92rem;font-weight:500;
  background:var(--c-btn);color:var(--c-btn-t);transition:transform .15s ease-out}
.sb-btn.sc{background:var(--c-btn2);color:var(--c-btn2-t)}
.sb-btn.stor{width:100%;padding:1.615vw 2.865vw}
.sb-btn:active{transform:scale(.97)}
@media (max-width:991px){.sb-btn{padding:1.628vw 7.161vw}.sb-btn.stor{padding:2.279vw 7.161vw}}
@media (max-width:479px){.sb-btn{padding:3.472vw 9vw}.sb-btn.stor{padding:4.861vw 9vw}}
.sb-btn[disabled]{opacity:.45;cursor:not-allowed}
/* the order drawer's button, kept as the same square primary */
.sb-hnappur{display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;min-height:48px;padding:0 1.5rem;
  font-size:.95rem;font-weight:500;background:var(--c-btn);color:var(--c-btn-t)}
.sb-hnappur:active{transform:scale(.98)}

/* the cascade (§3 heavy bundle, §4b.7): each label is two identical lines of
   per-letter spans in a one-line mask; on hover both lines rise one line,
   staggered across ~0.15s, on the cascade ease. Same primitive as every
   reveal on the page, applied to a 15px label. */
.sb-cas{display:inline-block;height:1.25em;line-height:1.25em;overflow:hidden;vertical-align:top}
.sb-casL{display:block;white-space:pre;height:1.25em}
.sb-casL > span{display:inline-block;transition:transform var(--cd,.5s) var(--ease-cas);
  transition-delay:calc(var(--i,0) * var(--cs,.02s))}
@media (hover:hover) and (pointer:fine){
  .sb-casH:hover .sb-casL > span,.sb-casH:focus-visible .sb-casL > span{transform:translateY(-100%)}
}

/* the no-background link: icon nudges, label dims (§4) */
.sb-nobg{display:inline-flex;align-items:center;gap:.45em;min-height:44px;font-weight:500;cursor:pointer;
  background:none;border:0;padding:0;color:var(--c-ink);transition:color .2s ease-out}
.sb-nobg i{font-style:normal;display:inline-block;transition:transform .2s ease-out}
@media (hover:hover) and (pointer:fine){.sb-nobg:hover{color:var(--c-ink-med)}.sb-nobg:hover i{transform:translateX(.417vw)}}

/* header (Sindri 2026-09-28: "too many pages, some should be dropdowns to keep
   it neat, also remove the orkunotkun"). Not noho's burger-slide row any more:
   desktop shows three items in one pill bar, two of them dropdowns; compact
   keeps the constant mobile bar with a burger panel of the same groups. One
   fixed theme, no energy switch. */
.sb-haus{position:fixed;z-index:60;top:2.0833vw;left:2.0833vw;right:2.0833vw;
  display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none}
.sb-haus > *{pointer-events:auto}
.sb-merkid{display:inline-flex;line-height:0}
.sb-merkid img{height:clamp(44px,3.6vw,56px);width:auto}
.sb-hausH{display:flex;align-items:center;gap:.5rem;position:relative}
.sb-haus .sb-pokiH{background:var(--c-hdr);color:var(--c-hdr-t);min-height:max(2.5vw,44px);padding:0 1rem}
.sb-nav{display:flex;align-items:stretch;background:var(--c-hdr);color:var(--c-hdr-t);border-radius:999px;
  min-height:max(2.5vw,44px);padding:0 .35rem;box-shadow:0 1px 0 rgba(6,34,46,.06)}
.sb-navL{display:inline-flex;align-items:center;gap:.4rem;padding:0 1rem;font-size:.9rem;font-weight:500;white-space:nowrap;
  border:0;background:none;cursor:pointer;color:inherit;min-height:max(2.5vw,44px)}
.sb-navL svg{transition:transform .2s cubic-bezier(.23,1,.32,1)}
.sb-navL[aria-expanded="true"] svg{transform:rotate(180deg)}
.sb-navH{position:relative;display:flex}
/* the dropdown: drops 6px into place from under its own item */
.sb-fell{position:absolute;top:calc(100% + .5rem);left:0;min-width:15.5rem;background:var(--c-hdr);color:var(--c-hdr-t);
  border-radius:var(--r,14px);padding:.45rem;box-shadow:0 18px 40px -12px rgba(6,34,46,.28),0 0 0 1px rgba(6,34,46,.06);
  opacity:0;transform:translateY(-6px);transform-origin:top left;visibility:hidden;
  transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s .2s}
.sb-fell.opid{opacity:1;transform:none;visibility:visible;transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s}
.sb-fell a,.sb-fell button{display:flex;flex-direction:column;align-items:flex-start;width:100%;padding:.6rem .75rem;
  border:0;background:none;cursor:pointer;color:inherit;text-align:left;border-radius:calc(var(--r,14px) - 4px);font-size:.92rem}
.sb-fell small{font-size:.78rem;color:color-mix(in srgb,var(--c-hdr-t) 58%,transparent)}
@media (hover:hover) and (pointer:fine){.sb-fell a:hover,.sb-fell button:hover{background:var(--c-el)}}
.sb-fell a:focus-visible,.sb-fell button:focus-visible{outline:2px solid var(--c-rautt);outline-offset:-2px}
.sb-braud{display:none;width:44px;height:44px;border:0;background:var(--c-hdr);cursor:pointer;
  place-items:center;padding:0;flex:none;color:var(--c-hdr-t)}
.sb-braud span{position:relative;width:18px;height:10px;display:block}
.sb-braud i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;display:block;
  transition:translate .2s var(--ease) .2s,rotate .2s var(--ease) 0s,opacity .1s linear .2s}
.sb-braud i:nth-child(1){top:0}.sb-braud i:nth-child(2){top:4.25px}.sb-braud i:nth-child(3){top:8.5px}
.sb-haus.opin .sb-braud i{transition:translate .2s var(--ease) 0s,rotate .2s var(--ease) .2s,opacity .1s linear 0s}
.sb-haus.opin .sb-braud i:nth-child(1){translate:0 4.25px;rotate:-45deg}
.sb-haus.opin .sb-braud i:nth-child(2){opacity:0}
.sb-haus.opin .sb-braud i:nth-child(3){translate:0 -4.25px;rotate:-135deg}

/* the compact panel hangs under the bar in a clip box and drops from -101% */
.sb-panK{position:absolute;top:100%;right:0;overflow:hidden;pointer-events:none;display:none}
.sb-pan{pointer-events:auto;background:var(--c-hdr);color:var(--c-hdr-t);transform:translateY(-101%);
  visibility:hidden;transition:transform .4s var(--ease),visibility 0s .4s}
.sb-pan.opid{transform:none;visibility:visible;transition:transform .4s var(--ease),visibility 0s}

@media (max-width:991px){
  .sb-haus{top:0;left:0;right:0;align-items:center;padding:calc(.5rem + env(safe-area-inset-top)) var(--gut) .5rem;
    background:color-mix(in srgb,var(--c-bg) 90%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    box-shadow:inset 0 -1px 0 var(--c-lina);pointer-events:auto}
  .sb-merkid img{height:44px}
  .sb-hausH{position:static}
  .sb-nav{display:none}
  .sb-haus .sb-pokiH{background:transparent;color:var(--c-ink);padding:0 .3rem}
  .sb-braud{display:grid}
  .sb-panK{display:grid;left:0;right:0;top:100%}
}
.sb-valPan{padding:.6rem var(--gut) calc(1rem + env(safe-area-inset-bottom));max-height:calc(100svh - 64px);overflow:auto;
  overscroll-behavior:contain}
.sb-valKort{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem}
.sb-valKort a{background:var(--c-el);display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.9rem .5rem .7rem;
  font-size:.86rem;color:var(--c-hdr-t);border-radius:var(--r,14px)}
.sb-valKort img{height:96px;width:auto;object-fit:contain}
.sb-valHop{margin:.9rem 0 .35rem;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:color-mix(in srgb,var(--c-hdr-t) 55%,transparent)}
.sb-valRod{display:grid;gap:2px}
.sb-valRod a{display:flex;align-items:center;min-height:52px;padding:0 .9rem;background:var(--c-el);overflow:hidden;border-radius:10px}
.sb-valRod a span{display:block;transform:translateY(105%);transition:transform .2s cubic-bezier(.4,0,1,1)}
.sb-pan.opid .sb-valRod a span{transform:none;transition:transform .55s var(--ease);transition-delay:calc(.08s + var(--i,0) * .04s)}
.sb-valPan .sb-btn{margin-top:.9rem}

/* the magnet cursor (§4b.2): a 1.0417vw dot that grows to 8.854vw with a word
   in it. One fixed box scaled on the GPU, never resized. */
.sb-bendill{position:fixed;top:0;left:0;z-index:90;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;color:var(--c-btn-t);width:8.854vw;height:8.854vw;margin:-4.427vw 0 0 -4.427vw;
  font-size:.92rem;font-weight:500;will-change:transform}
.sb-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;background:var(--c-btn);
  transform:scale(.1177);transition:transform .4s var(--ease),background .4s var(--ease)}
.sb-bendill.stor i{transform:scale(1)}
.sb-bendill.yta i{transform:scale(.106)}
.sb-bendill.stor.yta i{transform:scale(.9)}
.sb-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.sb-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){.sb-bendill{display:none}}

@media (prefers-reduced-motion:reduce){
  .sb-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .sb-up{transform:none !important}
}
.sb-root.sb-allt .sb-up{transform:translateY(0)}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener.
 * ---------------------------------------------------------------- */
export function useWatchdog(ms = 12000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.sb-root')?.classList.add('sb-allt')
    }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}

/* §4.4: the default trigger is "top reaches 80% down the viewport", line
   titles fire half a viewport early. Firing early is also the fix for the
   standing rule that a fixed-duration reveal must not be outrun: content is
   resolved before it reaches the reading zone. */
export function useInview<T extends HTMLElement>(margin = '0px 0px -12% 0px', hver = false) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    /* on a phone, a group becomes one trigger per item */
    if (hver && isPhone()) {
      const kids = [...el.children] as HTMLElement[]
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } })
      }, { rootMargin: margin, threshold: 0 })
      kids.forEach((k) => io.observe(k))
      return () => io.disconnect()
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { rootMargin: margin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, hver])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style, hver = false, margin, id }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer' | 'figure'
  className?: string; children: ReactNode; style?: CSSProperties; hver?: boolean; margin?: string; id?: string
}) {
  const ref = useInview<HTMLDivElement>(margin, hver)
  return (
    <Tag ref={ref as never} id={id} className={`${className}${hver ? ' sb-hver' : ''}`} style={style}>{children}</Tag>
  )
}

/* ------------------------------------------------------------------
   The scroll: Lenis at duration 3 (§4.3). Fine pointers only; phones keep
   native momentum (declared deviation 2).
   ------------------------------------------------------------------ */
const isTouch = () => !finePointer()
type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | Element, o?: object) => void; stop: () => void; start: () => void; resize: () => void;
  on: (e: 'scroll' | 'virtual-scroll', f: () => void) => () => void; readonly isScrolling: false | 'smooth' | 'native' }
export const lenisOf = () => (window as unknown as { __sbLenis?: LenisLike }).__sbLenis

export function useMjukSkrun() {
  useEffect(() => {
    if (reduced()) return
    if (isTouch()) return
    let lifandi = true
    let raf = 0
    let lenis: LenisLike | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = isTouch() ? null : (new Lenis({ duration: 3, smoothWheel: true, gestureOrientation: 'vertical', allowNestedScroll: true }) as unknown as LenisLike)
      if (!lenis) return
      lenis.scrollTo(0, { immediate: true })
      ;(window as unknown as { __sbLenis?: unknown }).__sbLenis = lenis
      /* the intro holds the page still; if it is still running, stop now */
      if (document.querySelector('.sb-root.sb-hled')) lenis.stop()
      /* Lag purge (2026-09-28): the loop used to call lenis.raf every frame for
         the life of the page, so a page sitting still recalculated style ~50
         times a second. It now wakes on input (Lenis's own virtual-scroll
         event), on any scroll it reports, and on a programmatic scrollTo or
         start, and sleeps once Lenis has been still for 20 frames. */
      let still = 0
      const tikk = (t: number) => {
        raf = 0
        if (!lenis) return
        lenis.raf(t)
        still = lenis.isScrolling ? 0 : still + 1
        /* lenis.raf emits 'scroll', which calls wake and may already have
           queued the next frame: never queue a second one */
        if (still < 20 && !raf) raf = requestAnimationFrame(tikk)
      }
      const wake = () => { still = 0; if (!raf && lifandi) raf = requestAnimationFrame(tikk) }
      const l = lenis
      const scrollTo = l.scrollTo.bind(l), start = l.start.bind(l)
      l.scrollTo = (a, o) => { scrollTo(a, o); wake() }
      l.start = () => { start(); wake() }
      l.on('virtual-scroll', wake)
      l.on('scroll', wake)
      wake()
    })
    return () => {
      lifandi = false; cancelAnimationFrame(raf); lenis?.destroy()
      delete (window as unknown as { __sbLenis?: unknown }).__sbLenis
    }
  }, [])
}

/* stagger 0.12s and duration 1s: addAppearanceByTrigger's own defaults */
export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.12).toFixed(2)}s` })

/** A headline, split to lines, each rising out of its own mask at 108%. */
export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0, id }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number; id?: string
}) {
  const lines = text.split(' | ')
  return (
    <Tag className={className} id={id}>
      {lines.map((l, i) => (
        <span className="sb-mask" key={l + i}>
          <span className="sb-up sb-lina" style={{ ['--d' as string]: `${(hold + i * 0.12).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="sb-merki"><span className="sb-mask"><span className="sb-up">{children}</span></span></p>
}

/** The cascade label (§3): two stacked copies of the text, per letter. Timing
 *  is the source's own: labels of 5+ letters get a 0.15s stagger spread over
 *  a 0.5s roll, shorter ones scale down to a 0.45 floor. */
export function Cas({ t }: { t: string }) {
  const ch = [...t]
  const n = Math.max(1, ch.length)
  const k = n >= 5 ? 1 : Math.min(0.8, Math.max(0.45, n / 5))
  const st = (0.15 * k) / n
  const line = ch.map((c, i) => <span key={i} style={{ ['--i' as string]: i }}>{c === ' ' ? ' ' : c}</span>)
  return (
    <span className="sb-cas" style={{ ['--cd' as string]: `${(0.5 * k).toFixed(3)}s`, ['--cs' as string]: `${st.toFixed(4)}s` }}>
      <span className="sb-casL">{line}</span>
      <span className="sb-casL" aria-hidden="true">{line}</span>
    </span>
  )
}

/* ---------------------------------------------------------------- *
 * Magnet cursor (§4b.2). A word tells you what the click does before you
 * make it. Re-resolves under a stationary pointer while the scroll settles,
 * once on the next frame and once on a 120ms idle timer, and presses on click.
 * ---------------------------------------------------------------- */
export function Bendill() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ord, setOrd] = useState('')
  const [yta, setYta] = useState(false)
  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    if (!el) return
    let x = -200, y = -200, cx = -200, cy = -200, raf = 0, idle = 0, har = false
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      raf = Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const lesa = () => {
      if (!har) return
      const t = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; har = true
      if (!raf) raf = requestAnimationFrame(tick)
      const t = (e.target as HTMLElement)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const skrun = () => {
      requestAnimationFrame(() => requestAnimationFrame(lesa))
      window.clearTimeout(idle); idle = window.setTimeout(lesa, 120)
    }
    const nidur = () => { setYta(true); window.setTimeout(() => setYta(false), 200) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', skrun, { passive: true })
    window.addEventListener('pointerdown', nidur, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', skrun)
      window.removeEventListener('pointerdown', nidur); cancelAnimationFrame(raf); window.clearTimeout(idle)
    }
  }, [])
  return (
    <div className={`sb-bendill${ord ? ' stor' : ''}${yta ? ' yta' : ''}`} ref={ref} aria-hidden="true">
      <i /><b>{ord}</b>
    </div>
  )
}

/* React 18's types do not know `inert`, so it is set through a ref. Used only
   on the desktop nav row, which slides out of view rather than hiding. The
   dropdown panels, the popup and the order drawer are visibility:hidden when
   closed, which already takes them out of the tab order and the
   accessibility tree; toggling inert on them as well cost the first tap after
   opening on iOS Safari, which does not refresh its hit-testing when inert
   is removed (found in the Simulator, 2026-09-21). */
export const inertNar = (lokad: boolean) => (el: HTMLElement | null) => { el?.toggleAttribute('inert', lokad) }

const Ör = () => (
  <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
)

/* Nav: two dropdown groups and one direct link (Sindri: "some should be
   dropdowns to keep it neat"). Anchors close any open panel first. */
type NavLina = { h: string; t: string; d?: string; poki?: boolean; fn?: () => void }
const HOPAR: { t: string; id: string; rows: NavLina[] }[] = [
  { t: 'Vörur', id: 'vorur', rows: [
    { h: '#linur', t: 'Allar vörulínur', d: 'Lakkrís, súkkulaði, mjúkt nammi og Völusælgæti' },
    { h: '#vorur', t: 'Þristur og lakkrís', d: 'Tegundir og innihald' },
    { h: '#ofnaemi', t: 'Án ofnæmisvalda', d: 'Finndu nammi sem hentar' },
    { h: '#hvar', t: 'Hvar fæst Sambó', d: 'Netverslanir sem selja Sambó', fn: () => pop.open({ k: 'hvar' }) },
  ] },
  { t: 'Sambó', id: 'sambo', rows: [
    { h: '#poki', t: 'Pöntun fyrir verslanir', d: 'Pöntunarlisti fyrir fyrirtæki', poki: true },
    { h: '#paska', t: 'Páskafjáröflun félaga', d: 'Páskaegg og páskaboltar', fn: () => pop.open({ k: 'fjarofloun' }) },
    { h: '#um', t: 'Um okkur', d: 'Íslenskt einkafyrirtæki síðan 1962' },
    { h: '#saga', t: 'Gamalt og nýtt' },
    { h: '#spurt', t: 'Spurt og svarað' },
    { h: '#starf', t: 'Starfsumsókn', fn: () => pop.open({ k: 'starf' }) },
  ] },
]
const SAMBAND: NavLina = { h: '#erindi', t: 'Hafa samband' }

export function faraA(href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  const haus = document.querySelector('.sb-haus')
  const offset = isCompact() ? -((haus?.getBoundingClientRect().height ?? 60) + 12) : -24
  const l = lenisOf()
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', href)
}

/* ---------------------------------------------------------------- *
 * The header. Desktop: crest, a pill bar with Vörur ▾, Sambó ▾ and Hafa
 * samband, then the order list. Compact: crest, order list, burger with the
 * same groups in a drop panel. One thing open at a time; Escape and an outside
 * press close it; on a fine pointer the dropdowns also open on hover.
 * ---------------------------------------------------------------- */
export function Haus() {
  const [opid, setOpid] = useState<string | null>(null)
  const haus = useRef<HTMLElement | null>(null)
  const loka = useRef(0)
  const valmynd = opid === 'valmynd'

  useEffect(() => {
    if (!opid) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const hver = opid
      setOpid(null)
      haus.current?.querySelector<HTMLElement>(`[aria-controls="sb-fell-${hver}"],.sb-braud`)?.focus()
    }
    const ut = (e: PointerEvent) => { if (!haus.current?.contains(e.target as Node)) setOpid(null) }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', ut)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', ut) }
  }, [opid])

  useEffect(() => {
    const publish = () => {
      const h = haus.current?.getBoundingClientRect().height
      if (h) (document.querySelector('.sb-root') as HTMLElement | null)?.style.setProperty('--haus-h', `${Math.round(h)}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => window.removeEventListener('resize', publish)
  }, [])

  const fara = (e: MouseEvent<HTMLElement>, l: NavLina) => {
    e.preventDefault()
    const compact = isCompact()
    setOpid(null)
    if (l.poki) { window.setTimeout(() => poki.open(true), compact ? 400 : 0); return }
    if (l.fn) { window.setTimeout(l.fn, compact ? 400 : 0); return }
    window.setTimeout(() => faraA(l.h), compact ? 400 : 0)
  }
  /* hover intent on a fine pointer: open at once, close after a short grace so
     the pointer can travel from the item into its panel */
  const inn = (id: string) => { if (!finePointer()) return; window.clearTimeout(loka.current); setOpid(id) }
  const ut = () => { if (!finePointer()) return; window.clearTimeout(loka.current); loka.current = window.setTimeout(() => setOpid((v) => (v === 'valmynd' ? v : null)), 180) }

  return (
    <header ref={haus} className={`sb-haus${valmynd ? ' opin' : ''}`}>
      <a className="sb-merkid" href="#top" aria-label="Sambó, á forsíðu"
        onClick={(e) => { e.preventDefault(); setOpid(null); const l = lenisOf(); if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src={`${import.meta.env.BASE_URL}sambo/brand/merki.webp`} alt="Sambó" width={460} height={197} decoding="async" />
      </a>
      <div className="sb-hausH">
        <nav className="sb-nav" aria-label="Aðalvalmynd">
          {HOPAR.map((g) => (
            <div className="sb-navH" key={g.id} onPointerEnter={() => inn(g.id)} onPointerLeave={ut}>
              <button className="sb-navL" aria-expanded={opid === g.id} aria-controls={`sb-fell-${g.id}`}
                onClick={() => setOpid(opid === g.id ? null : g.id)}>
                {g.t}<Ör />
              </button>
              <div id={`sb-fell-${g.id}`} className={`sb-fell${opid === g.id ? ' opid' : ''}`}>
                {g.rows.map((r) => (
                  <a key={r.h} href={r.h} tabIndex={opid === g.id ? 0 : -1} onClick={(e) => fara(e, r)}>
                    {r.t}{r.d ? <small>{r.d}</small> : null}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <a className="sb-navL sb-casH" href={SAMBAND.h} onClick={(e) => fara(e, SAMBAND)}><Cas t={SAMBAND.t} /></a>
        </nav>
        <PokaHnappur />
        <button className="sb-braud" aria-expanded={valmynd} aria-controls="sb-valPan"
          aria-label={valmynd ? 'Loka valmynd' : 'Opna valmynd'} onClick={() => setOpid(valmynd ? null : 'valmynd')}>
          <span><i /><i /><i /></span>
        </button>
        <div className="sb-panK">
          <div id="sb-valPan" className={`sb-pan sb-valPan${valmynd ? ' opid' : ''}`}>
            <div className="sb-valKort">
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={PK('thristur', 'pack', 's')} alt="" width={460} height={520} style={{ height: 64, width: 'auto' }} />Þristur
              </a>
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={PK('lakkriskonfekt', 'pack', 's')} alt="" width={460} height={520} style={{ height: 64, width: 'auto' }} />Lakkrís
              </a>
            </div>
            {HOPAR.map((g, gi) => (
              <div key={g.id}>
                <p className="sb-valHop">{g.t}</p>
                <div className="sb-valRod">
                  {g.rows.map((r, i) => (
                    <a key={r.h} href={r.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: gi * 4 + i }} onClick={(e) => fara(e, r)}><span>{r.t}</span></a>
                  ))}
                </div>
              </div>
            ))}
            <div className="sb-valRod" style={{ marginTop: '.9rem' }}>
              <a href={SAMBAND.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: 11 }} onClick={(e) => fara(e, SAMBAND)}><span>{SAMBAND.t}</span></a>
            </div>
            <button className="sb-btn stor" tabIndex={valmynd ? 0 : -1} onClick={() => { setOpid(null); window.setTimeout(() => poki.open(true), 400) }}>Opna pöntunarlistann</button>
          </div>
        </div>
      </div>
    </header>
  )
}
