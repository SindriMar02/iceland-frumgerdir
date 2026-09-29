import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { PokaHnappur, poki } from './poki'

/* The noho.ink system as rebuilt for Góa (2026-09-21), re-aimed at Katla after
   Góa declined (2026-09-28). Source of every number here: _docs/noho-teardown.md
   (§ refs below). Katla keeps 90% of it and changes 10% on purpose so it is not
   a copy of the reference: Erode for display, soft corners and pill buttons
   (their oval and the red-lidded tubs), a reshuffled hero scatter, and the
   footer in the red of their oval. See _docs/KATLA-BUILD-2026-09-28.md.

   The two rules that carry the whole thing:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped
        parent, opacity untouched. Title lines start at 108%.
     2. One ease does almost everything: custom-our = cubic-bezier(.17,.17,0,1). */

export const C = {
  rautt: '#D9161C',
  gull: '#E7A93B',
  blek: '#2A1614',
  pappir: '#F2EBE0',
  pappirHreint: '#FAF6EF',
  dokkt: '#241513',
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
  ['--c-bg', '#FAF6EF'], ['--c-el', '#F2EBE0'], ['--c-el2', '#E9DECD'], ['--c-el3', '#DCCBB2'],
  ['--c-ink', '#2A1614'], ['--c-ink-med', 'rgba(42,22,20,.6)'], ['--c-ink-max', 'rgba(42,22,20,.4)'],
  ['--c-btn', '#2A1614'], ['--c-btn-t', '#FAF6EF'], ['--c-btn2', '#FFFDF8'], ['--c-btn2-t', '#2A1614'],
  ['--c-form', '#FFFDF8'], ['--c-rautt', '#D9161C'], ['--c-lina', 'rgba(42,22,20,.14)'],
]

export const CSS = `
@font-face{font-family:'KAT Erode';src:url('${D('erode/Erode-Medium.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'KAT General';src:url('${D('general-sans/GeneralSans-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'KAT General';src:url('${D('general-sans/GeneralSans-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'KAT General';src:url('${D('general-sans/GeneralSans-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}

${TOK.map(([k, v]) => `@property ${k}{syntax:'<color>';inherits:true;initial-value:${v}}`).join('\n')}

/* Palette, in noho's tiers (§1 of the CSS part): a warm page, three element
   grounds that cards cycle through by position, charcoal-brown ink, square
   buttons. Katla's red and the waffle gold are accents only, the way noho keeps its colour
   in the photography. Dark is warm brown, not grey (#2E241C there, the walnut
   in their photos; here a cocoa brown), and the header chrome and
   the switches deliberately stay light in it. */
.kat-root{
  ${TOK.map(([k, v]) => `${k}:${v};`).join(' ')}
  --c-gull:#E7A93B; --c-hdr:#FFFDF8; --c-hdr-t:#2A1614;
  --c-flotur:var(--c-el);
  --ease:cubic-bezier(.17,.17,0,1);
  --ease-popup:cubic-bezier(.6,0,0,1);
  --ease-cas:cubic-bezier(.2,0,.1,1);
  --f-disp:'KAT Erode',Georgia,serif;
  /* §4 layout primitives: one gutter and one section gap, both viewport
     units, changing twice. Sections carry no vertical padding at all. */
  --gut:2.0833vw;
  --gap:22.2222vh;
  --band:var(--gap);
  --col:1.0417vw;
  background:var(--c-bg); color:var(--c-ink);
  font-family:'KAT General',system-ui,sans-serif;
  font-size:clamp(16px,1.0417vw,19px); line-height:1.5;
  -webkit-font-smoothing:antialiased;
  transition:${TOK.map(([k]) => `${k} .6s var(--ease)`).join(',')};
  display:flex;flex-direction:column;row-gap:var(--gap);
  overflow-x:clip;
}
@media (max-width:991px){.kat-root{--gut:2.604vw;--gap:12.121vh;--col:1.302vw}}
@media (max-width:479px){.kat-root{--gut:max(2.778vw,12px);--gap:12.5vh;--col:2.778vw}}
.kat-root > main{display:contents}
/* the shared prototype credit follows main inside the root; without this
   it sat one section gap below the red footer, on a bare brown/cream band */
.kat-root > main + *{margin-top:calc(-1 * var(--gap))}
.kat-root *,.kat-root *::before,.kat-root *::after{box-sizing:border-box}
.kat-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(217,22,28,.14)}
.kat-root{color-scheme:light}
/* Safari 26 tints the status and home-indicator strips from html/body, not
   from an inner wrapper, so the page colour has to live there too. */
html:has(.kat-root),body:has(.kat-root){background-color:#FAF6EF}
.kat-root :is(section[id],[id].kat-kafli){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
.kat-root img{display:block;max-width:100%;height:auto}
.kat-root a{color:inherit;text-decoration:none}
.kat-root :focus-visible{outline:2px solid var(--c-rautt);outline-offset:3px}
:where(.kat-root) button{font:inherit;color:inherit}

/* type: §5.3. Every size locked to the viewport width, a different vw per
   breakpoint, tablet and phone sharing a scale. Erode Medium (Katla) replaces Góa's Gambarino
   over the reference's Switzer; its tracking is opened from -0.04em to
   -0.03em because a serif at -0.04 closes its counters (declared). */
.kat-disp{font-family:var(--f-disp);font-weight:400;letter-spacing:-.03em;line-height:1;
  font-size:4.17vw;margin:0;text-wrap:balance}
@media (max-width:991px){.kat-disp{font-size:6.25vw;line-height:.95}}
@media (max-width:479px){.kat-disp{font-size:min(13.333vw,3.4rem);line-height:.95}}
.kat-sub{font-family:var(--f-disp);font-weight:400;letter-spacing:-.02em;line-height:1.05;
  font-size:2.08vw;margin:0}
@media (max-width:991px){.kat-sub{font-size:3.255vw}}
@media (max-width:479px){.kat-sub{font-size:max(1.35rem,6.4vw)}}
.kat-merki{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:var(--c-ink-med);margin:0 0 1em}
.kat-brod{max-width:52ch;margin:0;color:var(--c-ink)}
.kat-daufur{color:var(--c-ink-med)}
.kat-smatt{font-size:.8rem;line-height:1.45;color:var(--c-ink-med);margin:.25rem 0 0}
.kat-verd{font-variant-numeric:tabular-nums;font-weight:500}
.kat-wrap{padding:0 var(--gut);position:relative}
/* headings centred on desktop and tablet, flush left on a phone (§5.3:
   13 start / 11 centred at 1440, 23 / 1 at 390) */
.kat-midja{text-align:center;margin-left:auto;margin-right:auto}
@media (max-width:479px){.kat-midja{text-align:left;margin-left:0}}

/* mask rise. opacity is never animated anywhere on this page. --- */
.kat-mask{overflow:hidden;display:block}
.kat-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.kat-maskP > .kat-up{transform:translateY(118%)}
.on .kat-maskP > .kat-up,.kat-maskP.on > .kat-up,.kat-maskP > .kat-up.on{transform:translateY(0)}
.kat-root.kat-allt .kat-maskP > .kat-up{transform:translateY(0)}
/* Display masks need room at both ends for Icelandic: the acute on Ú and Í
   sits above cap height, ð g ö þ hang below the baseline. Paid back with
   negative margin so the rhythm does not move; lines start at 125%. */
.kat-disp .kat-mask,.kat-sub .kat-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
.kat-disp .kat-lina,.kat-sub .kat-lina{transform:translateY(125%)}
.on .kat-disp .kat-lina,.kat-disp.on .kat-lina,.kat-disp .kat-lina.on,
.on .kat-sub .kat-lina,.kat-sub .kat-lina.on{transform:translateY(0)}
.kat-root.kat-allt .kat-disp .kat-lina,.kat-root.kat-allt .kat-sub .kat-lina{transform:translateY(0)}
.kat-up{transform:translateY(100%);transition:transform var(--dur,1s) var(--ease);transition-delay:var(--d,0s);will-change:transform}
.kat-lina{transform:translateY(108%)}
.on .kat-up,.kat-up.on{transform:translateY(0)}
/* §4.4: on a phone a staggered group becomes one trigger per item, so the
   stagger delay goes; each item rises as it reaches the reading zone. */
@media (max-width:479px){.kat-hver > * .kat-up,.kat-hver > .kat-up{transition-delay:0s}}

/* buttons: square, noho's three kinds (§6). Labels roll per letter. */
.kat-btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;border:0;cursor:pointer;
  padding:1.042vw 2.865vw;min-height:44px;font-size:.92rem;font-weight:500;
  background:var(--c-btn);color:var(--c-btn-t);transition:transform .15s ease-out}
.kat-btn.sc{background:var(--c-btn2);color:var(--c-btn2-t)}
.kat-btn.stor{width:100%;padding:1.615vw 2.865vw}
.kat-btn:active{transform:scale(.97)}
@media (max-width:991px){.kat-btn{padding:1.628vw 7.161vw}.kat-btn.stor{padding:2.279vw 7.161vw}}
@media (max-width:479px){.kat-btn{padding:3.472vw 9vw}.kat-btn.stor{padding:4.861vw 9vw}}
.kat-btn[disabled]{opacity:.45;cursor:not-allowed}
/* the order drawer's button, kept as the same square primary */
.kat-hnappur{display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;min-height:48px;padding:0 1.5rem;
  font-size:.95rem;font-weight:500;background:var(--c-btn);color:var(--c-btn-t)}
.kat-hnappur:active{transform:scale(.98)}

/* the cascade (§3 heavy bundle, §4b.7): each label is two identical lines of
   per-letter spans in a one-line mask; on hover both lines rise one line,
   staggered across ~0.15s, on the cascade ease. Same primitive as every
   reveal on the page, applied to a 15px label. */
.kat-cas{display:inline-block;height:1.25em;line-height:1.25em;overflow:hidden;vertical-align:top}
.kat-casL{display:block;white-space:pre;height:1.25em}
.kat-casL > span{display:inline-block;transition:transform var(--cd,.5s) var(--ease-cas);
  transition-delay:calc(var(--i,0) * var(--cs,.02s))}
@media (hover:hover) and (pointer:fine){
  .kat-casH:hover .kat-casL > span,.kat-casH:focus-visible .kat-casL > span{transform:translateY(-100%)}
}

/* the no-background link: icon nudges, label dims (§4) */
.kat-nobg{display:inline-flex;align-items:center;gap:.45em;min-height:44px;font-weight:500;cursor:pointer;
  background:none;border:0;padding:0;color:var(--c-ink);transition:color .2s ease-out}
.kat-nobg i{font-style:normal;display:inline-block;transition:transform .2s ease-out}
@media (hover:hover) and (pointer:fine){.kat-nobg:hover{color:var(--c-ink-med)}.kat-nobg:hover i{transform:translateX(.417vw)}}

/* header (Sindri 2026-09-28: "too many pages, some should be dropdowns to keep
   it neat, also remove the orkunotkun"). Not noho's burger-slide row any more:
   desktop shows three items in one pill bar, two of them dropdowns; compact
   keeps the constant mobile bar with a burger panel of the same groups. One
   fixed theme, no energy switch. */
.kat-haus{position:fixed;z-index:60;top:2.0833vw;left:2.0833vw;right:2.0833vw;
  display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none}
.kat-haus > *{pointer-events:auto}
.kat-merkid{display:inline-flex;line-height:0}
.kat-merkid img{height:clamp(44px,3.6vw,56px);width:auto}
.kat-hausH{display:flex;align-items:center;gap:.5rem;position:relative}
.kat-haus .kat-pokiH{background:var(--c-hdr);color:var(--c-hdr-t);min-height:max(2.5vw,42px);padding:0 1rem}
.kat-nav{display:flex;align-items:stretch;background:var(--c-hdr);color:var(--c-hdr-t);border-radius:999px;
  min-height:max(2.5vw,42px);padding:0 .35rem;box-shadow:0 1px 0 rgba(42,22,20,.06)}
.kat-navL{display:inline-flex;align-items:center;gap:.4rem;padding:0 1rem;font-size:.9rem;font-weight:500;white-space:nowrap;
  border:0;background:none;cursor:pointer;color:inherit;min-height:max(2.5vw,42px)}
.kat-navL svg{transition:transform .2s cubic-bezier(.23,1,.32,1)}
.kat-navL[aria-expanded="true"] svg{transform:rotate(180deg)}
.kat-navH{position:relative;display:flex}
/* the dropdown: drops 6px into place from under its own item */
.kat-fell{position:absolute;top:calc(100% + .5rem);left:0;min-width:15.5rem;background:var(--c-hdr);color:var(--c-hdr-t);
  border-radius:var(--r,14px);padding:.45rem;box-shadow:0 18px 40px -12px rgba(42,22,20,.28),0 0 0 1px rgba(42,22,20,.06);
  opacity:0;transform:translateY(-6px);transform-origin:top left;visibility:hidden;
  transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s .2s}
.kat-fell.opid{opacity:1;transform:none;visibility:visible;transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s}
.kat-fell a,.kat-fell button{display:flex;flex-direction:column;align-items:flex-start;width:100%;padding:.6rem .75rem;
  border:0;background:none;cursor:pointer;color:inherit;text-align:left;border-radius:calc(var(--r,14px) - 4px);font-size:.92rem}
.kat-fell small{font-size:.78rem;color:color-mix(in srgb,var(--c-hdr-t) 58%,transparent)}
@media (hover:hover) and (pointer:fine){.kat-fell a:hover,.kat-fell button:hover{background:var(--c-el)}}
.kat-fell a:focus-visible,.kat-fell button:focus-visible{outline:2px solid var(--c-rautt);outline-offset:-2px}
.kat-braud{display:none;width:44px;height:44px;border:0;background:var(--c-hdr);cursor:pointer;
  place-items:center;padding:0;flex:none;color:var(--c-hdr-t)}
.kat-braud span{position:relative;width:18px;height:10px;display:block}
.kat-braud i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;display:block;
  transition:translate .2s var(--ease) .2s,rotate .2s var(--ease) 0s,opacity .1s linear .2s}
.kat-braud i:nth-child(1){top:0}.kat-braud i:nth-child(2){top:4.25px}.kat-braud i:nth-child(3){top:8.5px}
.kat-haus.opin .kat-braud i{transition:translate .2s var(--ease) 0s,rotate .2s var(--ease) .2s,opacity .1s linear 0s}
.kat-haus.opin .kat-braud i:nth-child(1){translate:0 4.25px;rotate:-45deg}
.kat-haus.opin .kat-braud i:nth-child(2){opacity:0}
.kat-haus.opin .kat-braud i:nth-child(3){translate:0 -4.25px;rotate:-135deg}

/* the compact panel hangs under the bar in a clip box and drops from -101% */
.kat-panK{position:absolute;top:100%;right:0;overflow:hidden;pointer-events:none;display:none}
.kat-pan{pointer-events:auto;background:var(--c-hdr);color:var(--c-hdr-t);transform:translateY(-101%);
  visibility:hidden;transition:transform .4s var(--ease),visibility 0s .4s}
.kat-pan.opid{transform:none;visibility:visible;transition:transform .4s var(--ease),visibility 0s}

@media (max-width:991px){
  .kat-haus{top:0;left:0;right:0;align-items:center;padding:calc(.5rem + env(safe-area-inset-top)) var(--gut) .5rem;
    background:color-mix(in srgb,var(--c-bg) 90%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    box-shadow:inset 0 -1px 0 var(--c-lina);pointer-events:auto}
  .kat-merkid img{height:44px}
  .kat-hausH{position:static}
  .kat-nav{display:none}
  .kat-haus .kat-pokiH{background:transparent;color:var(--c-ink);padding:0 .3rem}
  .kat-braud{display:grid}
  .kat-panK{display:grid;left:0;right:0;top:100%}
}
.kat-valPan{padding:.6rem var(--gut) calc(1rem + env(safe-area-inset-bottom));max-height:calc(100svh - 64px);overflow:auto;
  overscroll-behavior:contain}
.kat-valKort{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem}
.kat-valKort a{background:var(--c-el);display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.9rem .5rem .7rem;
  font-size:.86rem;color:var(--c-hdr-t);border-radius:var(--r,14px)}
.kat-valKort img{height:96px;width:auto;object-fit:contain}
.kat-valHop{margin:.9rem 0 .35rem;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:color-mix(in srgb,var(--c-hdr-t) 55%,transparent)}
.kat-valRod{display:grid;gap:2px}
.kat-valRod a{display:flex;align-items:center;min-height:52px;padding:0 .9rem;background:var(--c-el);overflow:hidden;border-radius:10px}
.kat-valRod a span{display:block;transform:translateY(105%);transition:transform .2s cubic-bezier(.4,0,1,1)}
.kat-pan.opid .kat-valRod a span{transform:none;transition:transform .55s var(--ease);transition-delay:calc(.08s + var(--i,0) * .04s)}
.kat-valPan .kat-btn{margin-top:.9rem}

/* the magnet cursor (§4b.2): a 1.0417vw dot that grows to 8.854vw with a word
   in it. One fixed box scaled on the GPU, never resized. */
.kat-bendill{position:fixed;top:0;left:0;z-index:90;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;color:var(--c-btn-t);width:8.854vw;height:8.854vw;margin:-4.427vw 0 0 -4.427vw;
  font-size:.92rem;font-weight:500;will-change:transform}
.kat-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;background:var(--c-btn);
  transform:scale(.1177);transition:transform .4s var(--ease),background .4s var(--ease)}
.kat-bendill.stor i{transform:scale(1)}
.kat-bendill.yta i{transform:scale(.106)}
.kat-bendill.stor.yta i{transform:scale(.9)}
.kat-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.kat-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){.kat-bendill{display:none}}

@media (prefers-reduced-motion:reduce){
  .kat-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .kat-up{transform:none !important}
}
.kat-root.kat-allt .kat-up{transform:translateY(0)}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener.
 * ---------------------------------------------------------------- */
export function useWatchdog(ms = 12000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.kat-root')?.classList.add('kat-allt')
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
    <Tag ref={ref as never} id={id} className={`${className}${hver ? ' kat-hver' : ''}`} style={style}>{children}</Tag>
  )
}

/* ------------------------------------------------------------------
   The scroll: Lenis at duration 3 (§4.3). Fine pointers only; phones keep
   native momentum (declared deviation 2).
   ------------------------------------------------------------------ */
const isTouch = () => !finePointer()
type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | Element, o?: object) => void; stop: () => void; start: () => void; resize: () => void;
  on: (e: 'scroll' | 'virtual-scroll', f: () => void) => () => void; readonly isScrolling: false | 'smooth' | 'native' }
export const lenisOf = () => (window as unknown as { __katLenis?: LenisLike }).__katLenis

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
      ;(window as unknown as { __katLenis?: unknown }).__katLenis = lenis
      /* the intro holds the page still; if it is still running, stop now */
      if (document.querySelector('.kat-root.kat-hled')) lenis.stop()
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
      delete (window as unknown as { __katLenis?: unknown }).__katLenis
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
        <span className="kat-mask" key={l + i}>
          <span className="kat-up kat-lina" style={{ ['--d' as string]: `${(hold + i * 0.12).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="kat-merki"><span className="kat-mask"><span className="kat-up">{children}</span></span></p>
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
    <span className="kat-cas" style={{ ['--cd' as string]: `${(0.5 * k).toFixed(3)}s`, ['--cs' as string]: `${st.toFixed(4)}s` }}>
      <span className="kat-casL">{line}</span>
      <span className="kat-casL" aria-hidden="true">{line}</span>
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
    <div className={`kat-bendill${ord ? ' stor' : ''}${yta ? ' yta' : ''}`} ref={ref} aria-hidden="true">
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
type NavLina = { h: string; t: string; d?: string; poki?: boolean }
const HOPAR: { t: string; id: string; rows: NavLina[] }[] = [
  { t: 'Vörur', id: 'vorur', rows: [
    { h: '#vorur', t: 'Dropar og smákökudeig', d: 'Tegundir, vörunúmer og pakkningar' },
    { h: '#linur', t: 'Allar vörulínur', d: 'Neytendavörur, bakarí og kjötvinnslur' },
    { h: '#poki', t: 'Pöntunarlisti', d: 'Fyrir verslanir og fyrirtæki', poki: true },
  ] },
  { t: 'Katla', id: 'katla', rows: [
    { h: '#um', t: 'Um okkur', d: 'Fjölskyldufyrirtæki síðan 1954' },
    { h: '#saga', t: 'Sagan', d: 'Frá 1954 til Costco 2024' },
    { h: '#spurt', t: 'Spurt og svarað' },
  ] },
]
const SAMBAND: NavLina = { h: '#erindi', t: 'Hafa samband' }

export function faraA(href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  const haus = document.querySelector('.kat-haus')
  const offset = isCompact() ? -((haus?.getBoundingClientRect().height ?? 60) + 12) : -24
  const l = lenisOf()
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', href)
}

/* ---------------------------------------------------------------- *
 * The header. Desktop: crest, a pill bar with Vörur ▾, Katla ▾ and Hafa
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
      haus.current?.querySelector<HTMLElement>(`[aria-controls="kat-fell-${hver}"],.kat-braud`)?.focus()
    }
    const ut = (e: PointerEvent) => { if (!haus.current?.contains(e.target as Node)) setOpid(null) }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', ut)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', ut) }
  }, [opid])

  useEffect(() => {
    const publish = () => {
      const h = haus.current?.getBoundingClientRect().height
      if (h) (document.querySelector('.kat-root') as HTMLElement | null)?.style.setProperty('--haus-h', `${Math.round(h)}px`)
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
    window.setTimeout(() => faraA(l.h), compact ? 400 : 0)
  }
  /* hover intent on a fine pointer: open at once, close after a short grace so
     the pointer can travel from the item into its panel */
  const inn = (id: string) => { if (!finePointer()) return; window.clearTimeout(loka.current); setOpid(id) }
  const ut = () => { if (!finePointer()) return; window.clearTimeout(loka.current); loka.current = window.setTimeout(() => setOpid((v) => (v === 'valmynd' ? v : null)), 180) }

  return (
    <header ref={haus} className={`kat-haus${valmynd ? ' opin' : ''}`}>
      <a className="kat-merkid" href="#top" aria-label="Katla, á forsíðu"
        onClick={(e) => { e.preventDefault(); setOpid(null); const l = lenisOf(); if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src={`${import.meta.env.BASE_URL}katla/katla-merki.svg`} alt="Katla" width={1476} height={660} decoding="async" />
      </a>
      <div className="kat-hausH">
        <nav className="kat-nav" aria-label="Aðalvalmynd">
          {HOPAR.map((g) => (
            <div className="kat-navH" key={g.id} onPointerEnter={() => inn(g.id)} onPointerLeave={ut}>
              <button className="kat-navL" aria-expanded={opid === g.id} aria-controls={`kat-fell-${g.id}`}
                onClick={() => setOpid(opid === g.id ? null : g.id)}>
                {g.t}<Ör />
              </button>
              <div id={`kat-fell-${g.id}`} className={`kat-fell${opid === g.id ? ' opid' : ''}`}>
                {g.rows.map((r) => (
                  <a key={r.h} href={r.h} tabIndex={opid === g.id ? 0 : -1} onClick={(e) => fara(e, r)}>
                    {r.t}{r.d ? <small>{r.d}</small> : null}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <a className="kat-navL kat-casH" href={SAMBAND.h} onClick={(e) => fara(e, SAMBAND)}><Cas t={SAMBAND.t} /></a>
        </nav>
        <PokaHnappur />
        <button className="kat-braud" aria-expanded={valmynd} aria-controls="kat-valPan"
          aria-label={valmynd ? 'Loka valmynd' : 'Opna valmynd'} onClick={() => setOpid(valmynd ? null : 'valmynd')}>
          <span><i /><i /><i /></span>
        </button>
        <div className="kat-panK">
          <div id="kat-valPan" className={`kat-pan kat-valPan${valmynd ? ' opid' : ''}`}>
            <div className="kat-valKort">
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={`${import.meta.env.BASE_URL}katla/vanilludropar.webp`} alt="" width={178} height={450} style={{ height: 52 }} />Dropar
              </a>
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={`${import.meta.env.BASE_URL}katla/smakokudeig-piparkokur.webp`} alt="" width={450} height={98} style={{ height: 30 }} />Smákökudeig
              </a>
            </div>
            {HOPAR.map((g, gi) => (
              <div key={g.id}>
                <p className="kat-valHop">{g.t}</p>
                <div className="kat-valRod">
                  {g.rows.map((r, i) => (
                    <a key={r.h} href={r.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: gi * 3 + i }} onClick={(e) => fara(e, r)}><span>{r.t}</span></a>
                  ))}
                </div>
              </div>
            ))}
            <div className="kat-valRod" style={{ marginTop: '.9rem' }}>
              <a href={SAMBAND.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: 6 }} onClick={(e) => fara(e, SAMBAND)}><span>{SAMBAND.t}</span></a>
            </div>
            <button className="kat-btn stor" tabIndex={valmynd ? 0 : -1} onClick={() => { setOpid(null); window.setTimeout(() => poki.open(true), 400) }}>Opna pöntunarlistann</button>
          </div>
        </div>
      </div>
    </header>
  )
}
