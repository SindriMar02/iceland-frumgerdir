import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { PokaHnappur } from './poki'

/* The noho.ink system, transplanted. See _docs/noho-teardown.md.
   The two rules that carry the whole thing:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped
        parent, opacity untouched. Title lines start at 108% so a descender
        on the line below never peeks above the mask edge.
     2. One ease does almost everything: cubic-bezier(0.17,0.17,0,1).
   Re-aimed from the declined Iceherbs build; deviations for Góa are listed in
   _docs/GOA-DESIGN-2026-09-21.md. */

export const C = {
  /* the Góa crown: red ribbon, gold pot, brown lettering */
  rautt: '#C21514',
  gull: '#F9D100',
  blek: '#2D1105',
  pappir: '#EFE5D2',
  pappirHreint: '#F8F1E4',
  dokkt: '#1C120C',
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

/* ---------------------------------------------------------------- *
 * Tokens. @property is what makes the 0.6s theme change actually
 * interpolate rather than snap: the reference tweens all 24 of its
 * custom properties individually, and this is the CSS equivalent.
 * ---------------------------------------------------------------- */
const D = (n: string) => `${import.meta.env.BASE_URL}fonts/${n}`

export const CSS = `
/* Type, picked by Sindri 2026-09-21 from a 25-face specimen of the hero line
   (Caprasimo and Switzer both rejected). Display is Gambarino, a one-weight
   display serif: the confectioner's calm rather than the candy shout, which
   leaves the loud part to the wrappers. Body and UI are General Sans. Both
   carry full Icelandic (Þ Ð Æ Ö and every acute), checked with fontTools.
   Gambarino has no → glyph, so every arrow on the page sits in body text. */
@font-face{font-family:'GOA Gambarino';src:url('${D('gambarino/Gambarino-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}

@property --c-bg { syntax: '<color>'; inherits: true; initial-value: #F8F1E4 }
@property --c-ink { syntax: '<color>'; inherits: true; initial-value: #2D1105 }
@property --c-rautt { syntax: '<color>'; inherits: true; initial-value: #C21514 }
@property --c-flotur { syntax: '<color>'; inherits: true; initial-value: #EFE5D2 }
@property --c-lina { syntax: '<color>'; inherits: true; initial-value: rgba(45,17,5,.16) }

.goa-root{
  --c-bg:#F8F1E4; --c-ink:#2D1105; --c-rautt:#C21514; --c-flotur:#EFE5D2;
  --c-lina:rgba(45,17,5,.16); --c-gull:#F9D100;
  --ease:cubic-bezier(.17,.17,0,1);
  --gut:clamp(1.1rem,4.2vw,4.5rem);
  --band:clamp(4.4rem,9vw,12.5rem);
  --col:clamp(.9rem,1.6vw,2rem);
  background:var(--c-bg); color:var(--c-ink);
  --f-disp:'GOA Gambarino',Georgia,serif;
  font-family:'GOA General',system-ui,sans-serif;
  font-size:clamp(16px,1.02vw,18px); line-height:1.55;
  -webkit-font-smoothing:antialiased;
  transition:--c-bg .6s var(--ease), --c-ink .6s var(--ease), --c-flotur .6s var(--ease), --c-lina .6s var(--ease);
}
.goa-root[data-tema="dokkt"]{
  --c-bg:#1C120C; --c-ink:#F3EADB; --c-rautt:#F9D100; --c-flotur:#2A1D15;
  --c-lina:rgba(243,234,219,.18);
}
/* Safari 26 tints the status and home-indicator strips from html/body, not
   from an inner wrapper, so the page colour has to live there too. */
html:has(.goa-root),body:has(.goa-root){background-color:#F8F1E4}
html:has(.goa-root[data-tema="dokkt"]),body:has(.goa-root[data-tema="dokkt"]){background-color:#1C120C}
.goa-root *,.goa-root *::before,.goa-root *::after{box-sizing:border-box}
/* Guidelines pass. touch-action kills the synthetic tap delay, and the tap
   highlight is set deliberately rather than left as the UA's grey flash -
   on the colour tiles the default reads as a dirty rectangle. */
.goa-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(194,21,20,.14)}
/* Native UI - scrollbars, form controls, the caret - has to follow the
   theme too, or the dark page keeps light scrollbars. */
.goa-root{color-scheme:light}
.goa-root[data-tema="dokkt"]{color-scheme:dark}
/* A pasted #solustadir link, or a browser restoring one, lands under the
   fixed header. The nav handler offsets for it; this covers everything
   that does not go through the handler. */
.goa-root :is(section[id]){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
.goa-root img{display:block;max-width:100%;height:auto}
.goa-root a{color:inherit;text-decoration:none}
/* the ring is the red, not the gold: gold on paper is 1.4:1 and vanishes */
.goa-root :focus-visible{outline:2px solid var(--c-rautt);outline-offset:3px}

/* type ---------------------------------------------------------- */
.goa-disp{
  font-family:var(--f-disp); font-weight:400; letter-spacing:-.018em; line-height:1;
  /* vw-locked like the reference, but capped: Breytingaskeiðið and
     Húðnæringarpakkinn overflow a 360px column at a raw 13.33vw */
  /* Gambarino is a single regular weight, lighter than the Switzer 600 this
     scale was set for, so it runs about 10% larger to hold the same mass */
  font-size:clamp(2.3rem,4.6vw,5.8rem);
  margin:0; text-wrap:balance;
}
@media (max-width:991px){ .goa-disp{ font-size:clamp(2.2rem,6.9vw,3.6rem); line-height:1 } }
@media (max-width:479px){ .goa-disp{ font-size:clamp(2rem,11.4vw,2.9rem); line-height:1 } }
.goa-mid{font-weight:500;letter-spacing:-.025em;line-height:1.1;font-size:clamp(1.25rem,2.08vw,2rem);margin:0}
.goa-merki{font-size:clamp(.72rem,.84vw,.82rem);letter-spacing:.14em;text-transform:uppercase;font-weight:500;
  color:var(--c-rautt);margin:0 0 1.1em}
.goa-brod{max-width:62ch;margin:0;color:var(--c-ink)}
.goa-verd{font-variant-numeric:tabular-nums;font-weight:500}

.goa-band{position:relative;padding:var(--band) 0}
.goa-wrap{padding:0 var(--gut);position:relative}

/* mask rise. opacity is never animated anywhere on this page. --- */
.goa-mask{overflow:hidden;display:block}
/* A mask is exactly as tall as its content, so the descenders on the last
   line of a paragraph sit on the cut. Give those masks room and pay for it
   with negative margin; because the mask is now taller, the content has to
   start at 118% rather than 100% to stay hidden behind it. */
.goa-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.goa-maskP > .goa-up{transform:translateY(118%)}
.on .goa-maskP > .goa-up,.goa-maskP > .goa-up.on{transform:translateY(0)}
.goa-root.goa-allt .goa-maskP > .goa-up{transform:translateY(0)}

/* Display masks need room at BOTH ends, and Icelandic is why. The acute on
   Ú and Í sits above cap height and the mask cut it off the top of the
   footer slogan; ð, g, ö, þ and the comma hang below the baseline and were
   cut off the bottom of the quote lines. Measured, not guessed: probes/
   goa-clip.mjs resolves each line's baseline from the font's own metrics
   and compares the ink box to the clipping ancestor. The padding is paid
   back with negative margin so the vertical rhythm does not move, and
   because the mask is taller the lines now start at 125% instead of 108%
   to stay hidden behind it. */
.goa-disp .goa-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
/* The footer slogan sets line-height .9, so its box is tighter than the
   display lines and the acutes need proportionally more room. The mask
   carries the slogan's own font-size because em on the mask would
   otherwise resolve against the inherited 16px root size, not the 144px
   the glyphs are actually drawn at - which is why .2em here bought 3px
   instead of 29px on the first attempt. */
.goa-slagM{font-size:clamp(2.4rem,11vw,9rem);padding:.2em 0 .17em;margin:-.2em 0 -.17em}
.goa-disp .goa-lina,.goa-slagM > .goa-up{transform:translateY(125%)}
.on .goa-disp .goa-lina,.goa-disp .goa-lina.on,
.on .goa-slagM > .goa-up,.goa-slagM > .goa-up.on{transform:translateY(0)}
.goa-root.goa-allt .goa-disp .goa-lina,
.goa-root.goa-allt .goa-slagM > .goa-up{transform:translateY(0)}
.goa-up{transform:translateY(100%);transition:transform 1s var(--ease);transition-delay:var(--d,0s);will-change:transform}
.goa-lina{transform:translateY(108%)}
.on .goa-up,.goa-up.on{transform:translateY(0)}

/* flotur = the one container. no rounded card, no shadow, no border box:
   a tint and a hairline above it, which is how the reference groups. -- */
.goa-flotur{background:var(--c-flotur);padding:clamp(1.1rem,2vw,1.7rem)}

.goa-hnappur{display:inline-block;padding:.95em 1.5em;background:var(--c-rautt);color:var(--c-bg);
  font-size:1rem;font-weight:500;letter-spacing:.01em;border:0;cursor:pointer;
  transition:background .3s var(--ease),transform .3s var(--ease)}
.goa-hnappur.ljos{background:transparent;color:var(--c-ink);box-shadow:inset 0 0 0 1px var(--c-lina)}
.goa-hnappur:active{transform:scale(.98)}
@media (hover:hover) and (pointer:fine){ .goa-hnappur:hover{background:var(--c-ink)} .goa-hnappur.ljos:hover{background:var(--c-flotur)} }

/* header --------------------------------------------------------- */
/* Three columns, 1fr auto 1fr: crest left, pages dead centre on the viewport,
   utilities right. The Iceherbs header right-packed the pages next to the
   utilities, which left a hole in the middle and read lopsided against the
   tall crest (Sindri, 2026-09-21). Equal outer tracks are what centre the nav
   on the page rather than in the leftover space. */
.goa-haus{position:fixed;top:0;left:0;right:0;z-index:40;display:grid;align-items:center;
  grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:1rem;padding:calc(.75rem + env(safe-area-inset-top)) var(--gut) .75rem;
  transition:background .4s var(--ease)}
.goa-haus.fest{background:color-mix(in srgb,var(--c-bg) 92%,transparent);backdrop-filter:blur(8px)}
.goa-merkid{display:inline-flex;align-items:center;line-height:0;min-height:36px}
/* The crest is portrait (114 x 143) and carries "Stofnað 1968" in its
   ribbon, so it needs real height to stay legible: 44px is the floor at
   which the ribbon text still resolves on a 3x phone. It reads on the dark
   theme as it is, so there is no second file. */
.goa-merkid img{height:clamp(44px,3.6vw,54px);width:auto}
/* The reference groups everything except the logo on the right: nav at
   x=768..1372 of 1440, burger at 1374. space-between with three children
   centred the nav instead, which put it straight on top of the hero tiles. */
.goa-hausH{display:flex;align-items:center;justify-content:flex-end;gap:clamp(.9rem,1.6vw,1.8rem);justify-self:end}
.goa-merkid{justify-self:start}

.goa-nav{display:flex;align-items:center;gap:clamp(1rem,2vw,2.1rem)}
.goa-nav a{font-size:.92rem;padding:.55rem 0;min-height:32px;display:inline-flex;align-items:center;
  position:relative}
.goa-nav a::after{content:'';position:absolute;left:0;right:0;bottom:.3rem;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:right;
  transition:transform .45s var(--ease)}
@media (hover:hover) and (pointer:fine){
  .goa-nav a:hover::after{transform:scaleX(1);transform-origin:left}
}
/* the burger is the narrow-width path; the reference carries one too */
.goa-braud{display:none;width:36px;height:36px;border:0;background:transparent;cursor:pointer;
  padding:9px 7px;flex-direction:column;justify-content:space-between}
.goa-braud i{display:block;height:1.5px;width:100%;background:var(--c-ink);
  transform-origin:center;transition:transform .25s cubic-bezier(.4,0,.2,1)}
.goa-braud.opin i{transition:transform .45s var(--ease)}
.goa-braud.opin i:nth-child(1){transform:translateY(7.5px) rotate(45deg)}
.goa-braud.opin i:nth-child(2){transform:scaleX(0)}
.goa-braud.opin i:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}
/* Both header panels stay mounted and animate between states; mounting on
   open and unmounting on close (the Iceherbs way) can only ever pop. Open is
   a clip wipe down from the header edge with the rows rising in a 40ms
   stagger; close is the same wipe back up, faster, rows not staggered, since
   closing is a response and should get out of the way (Sindri 2026-09-21:
   "needs to be smooth animation, so has everything else"). */
.goa-braudSpjald{overscroll-behavior:contain;position:absolute;top:100%;left:0;right:0;background:var(--c-flotur);
  display:grid;padding:.6rem var(--gut) 1.4rem;box-shadow:inset 0 1px 0 var(--c-lina),0 24px 40px -28px rgba(28,18,12,.35);
  clip-path:inset(0 0 100% 0);visibility:hidden;
  transition:clip-path .28s cubic-bezier(.4,0,.2,1),visibility 0s .28s}
.goa-braudSpjald.opin{clip-path:inset(0 0 -40px 0);visibility:visible;
  transition:clip-path .55s var(--ease),visibility 0s 0s}
.goa-braudSpjald a{display:block;overflow:hidden;padding:.9rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.goa-braudSpjald a:last-child{box-shadow:none}
.goa-braudSpjald a span{display:block;font-family:var(--f-disp);font-size:clamp(1.7rem,6.4vw,2.4rem);line-height:1.05;
  letter-spacing:-.015em;transform:translateY(105%);transition:transform .2s cubic-bezier(.4,0,1,1)}
.goa-braudSpjald.opin a span{transform:translateY(0);transition:transform .6s var(--ease);
  transition-delay:calc(.06s + var(--i,0) * .04s)}
.goa-haus.valmynd{background:var(--c-flotur)}
/* the centred nav needs both outer tracks wider than the utilities group,
   which stops holding under ~1100px, so the burger takes over there */
@media (max-width:1100px){
  .goa-nav{display:none}
  .goa-braud{display:flex}
}

/* Orkunotkun. The reference's best idea: the two accessibility switches
   report as a live energy reading in the header. ------------------ */
/* No position:relative here. The panel is 22rem wide and this wrapper is the
   width of a small button, so making it the containing block anchored the
   panel to the button and pushed it off the LEFT edge of a phone, cutting
   "Dökkt útlit" to "kkt útlit". It anchors to .goa-haus instead, which is fixed
   and spans the viewport, so right:var(--gut) means what it says. */
.goa-orkaW{position:static}
.goa-orka{display:flex;align-items:center;gap:.5rem;background:transparent;border:0;cursor:pointer;
  font:inherit;font-size:.82rem;color:inherit;padding:.4rem .2rem}
.goa-orkaG{height:1.15em;overflow:hidden;display:inline-block}
.goa-orkaR{display:block;transition:transform .4s var(--ease);transform:translateY(calc(var(--stig,0) * -1.15em))}
.goa-orkaR span{display:block;height:1.15em;line-height:1.15em;font-weight:600;color:var(--c-rautt)}
/* Gambarino ships one weight; every display use sets 400 so no browser
   ever synthesises a smeared faux-bold from it. */
.goa-root :is(.goa-tilv,.goa-slag,.goa-spjaldL h3,.goa-tolur b,.goa-kostur b,.goa-erindi b,.goa-opnun em,.goa-pokiT h2,.goa-sagaR b){
  font-family:var(--f-disp);font-weight:400;letter-spacing:-.015em}
.goa-spjald{overscroll-behavior:contain;position:absolute;top:100%;right:var(--gut);width:min(22rem,calc(100vw - 2 * var(--gut)));
  background:var(--c-flotur);padding:1.15rem;display:grid;gap:1rem;
  box-shadow:inset 0 1px 0 var(--c-lina),0 24px 40px -28px rgba(28,18,12,.35);
  transform-origin:100% 0;opacity:0;transform:translateY(-6px) scale(.97);visibility:hidden;
  transition:opacity .18s ease-out,transform .18s ease-out,visibility 0s .18s}
.goa-spjald.opid{opacity:1;transform:none;visibility:visible;
  transition:opacity .3s ease-out,transform .4s var(--ease),visibility 0s 0s}
.goa-rofiRod{display:flex;align-items:center;justify-content:space-between;gap:1rem}
/* The switch READS as 34x18, which is well under a finger, so the button is a
   real 44x44 and the track is drawn inside it. A pseudo element on a 34x18
   button would enlarge the hit area too, but the element's own rect would stay
   34x18 and a tap-target check could never see the difference: the control has
   to measure correct, not just behave correct. Only visible once the panel is
   open, which is why the gate now opens the disclosures before measuring. */
.goa-rofi{position:relative;width:44px;height:44px;border:0;background:transparent;
  cursor:pointer;padding:0;flex-shrink:0;display:grid;place-items:center}
.goa-rofi::before{content:'';width:34px;height:18px;border-radius:999px;
  background:var(--c-lina);transition:background .2s var(--ease)}
.goa-rofi[aria-checked="true"]::before{background:var(--c-rautt)}
.goa-rofi i{position:absolute;left:calc(50% - 15px);top:50%;margin-top:-7px;
  width:14px;height:14px;border-radius:999px;background:var(--c-bg);display:block;
  transition:transform .2s var(--ease)}
.goa-rofi[aria-checked="true"] i{transform:translateX(16px)}
.goa-smatt{font-size:.78rem;line-height:1.45;color:var(--c-ink);opacity:.75;margin:.25rem 0 0}

/* cursor --------------------------------------------------------- */
.goa-bendill{position:fixed;top:0;left:0;z-index:70;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;background:transparent;color:var(--c-bg);
  width:118px;height:118px;margin:-59px 0 0 -59px;
  font-size:.9rem;font-weight:500;overflow:hidden;will-change:transform}
/* the disc is one fixed box scaled on the GPU, never resized: animating
   width/height/margin here would be layout work on every pointer move */
.goa-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;
  background:var(--c-rautt);transform:scale(.127);
  transition:transform .4s var(--ease)}
.goa-bendill.stor i{transform:scale(1)}
.goa-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.goa-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){ .goa-bendill{display:none} }



@media (prefers-reduced-motion:reduce){
  .goa-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .goa-up{transform:none !important}
}
.goa-root[data-hreyfing="min"] .goa-up{transform:none !important;transition:none !important}
/* watchdog: nothing may stay masked forever because an observer never fired */
.goa-root.goa-allt .goa-up{transform:translateY(0)}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener. On compact
 * widths every child gets its own observer instead of a group stagger,
 * which is what the reference itself does at 390.
 * ---------------------------------------------------------------- */
/** Reveals anything still masked after 8s, so a missed observer can never
 *  leave content permanently off-screen. The reference does the same with its
 *  12s preloader watchdog. */
export function useWatchdog(ms = 8000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.goa-root')?.classList.add('goa-allt')
    }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}

export function useInview<T extends HTMLElement>(margin = '0px 0px -18% 0px') {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { rootMargin: margin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer'
  className?: string; children: ReactNode; style?: CSSProperties
}) {
  const ref = useInview<HTMLDivElement>()
  return (
    <Tag ref={ref as never} className={className} style={style}>{children}</Tag>
  )
}

/** 0.07s per step, the reference's stagger rounded to this page's tempo. */
/* stagger 0.12s and duration 1s are the reference's own defaults for
   addAppearanceByTrigger({ duration: 1, stagger: 0.12, ease: "custom-our" }).
   This build was running 0.07s, which read as a faster, busier cascade. */
/* ------------------------------------------------------------------
   The scroll. This is the reference's dominant sensation and the one
   thing a CSS-only build cannot fake: Lenis at duration 3, which puts
   half a wheel notch away in ~270ms, 90% in ~1.0s, and spends another
   1.3s on the last ten pixels. It is why a 1s reveal never reads as
   late there: the scroll is slower than the animation.

   One recorded deviation. The reference also sets syncTouch:true with
   syncTouchLerp:0.075, which intercepts touch scrolling and kills iOS
   momentum. noho accepts that because it is one pinned page; this is a
   shop, so smooth scroll is bound to fine pointers only and phones keep
   native momentum.
   ------------------------------------------------------------------ */
/* Touch devices never get a JS scroll surface: iOS only collapses its toolbar
   to the floating pill for a natively scrolled document. */
const isTouch = () => !finePointer()

export function useMjukSkrun() {
  useEffect(() => {
    if (reduced()) return
    if (isTouch()) return
    let lifandi = true
    let raf = 0
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number, o?: object) => void } | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = isTouch() ? null : new Lenis({
        duration: 3,
        smoothWheel: true,
        gestureOrientation: 'vertical',
        allowNestedScroll: true,
      })
      /* Lenis restores its own scroll position over any route reset,
         so the top has to be asserted after it exists, not before. */
      if (!lenis) return
      lenis.scrollTo(0, { immediate: true })
      /* exposed so the probes can jump the real scroller; a plain
         window.scrollTo is intercepted and animated over three seconds. */
      ;(window as unknown as { __goaLenis?: unknown }).__goaLenis = lenis
      const tikk = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(tikk) }
      raf = requestAnimationFrame(tikk)
    })
    return () => {
      lifandi = false; cancelAnimationFrame(raf); lenis?.destroy()
      delete (window as unknown as { __goaLenis?: unknown }).__goaLenis
    }
  }, [])
}

export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.12).toFixed(2)}s` })

/** A headline, split to lines, each rising out of its own mask at 108%. */
export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0 }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number
}) {
  const lines = text.split(' | ')
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span className="goa-mask" key={l + i}>
          <span className="goa-up goa-lina" style={{ ['--d' as string]: `${(hold + i * 0.08).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="goa-merki"><span className="goa-mask"><span className="goa-up">{children}</span></span></p>
}

/* ---------------------------------------------------------------- *
 * The stem. Draws itself against scroll progress through its own
 * section, driven by rAF that only runs while the section is on screen.
 * ---------------------------------------------------------------- */

/* ---------------------------------------------------------------- *
 * Magnet cursor. A dot that grows and puts a word in itself, so the
 * label tells you what the click does before you make it.
 * ---------------------------------------------------------------- */
export function Bendill() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ord, setOrd] = useState('')
  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    if (!el) return
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      /* park the loop once it has caught up; a pointer move wakes it again */
      raf = Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
      const t = (e.target as HTMLElement)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className={`goa-bendill${ord ? ' stor' : ''}`} ref={ref} aria-hidden="true">
      <i /><b>{ord}</b>
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Orkunotkun. state = (dark ? 1 : 2) - (reduce ? 1 : 0), clamped 0..2,
 * read out as Mikil / Miðlungs / Lítil. Same arithmetic as the
 * reference. prefers-reduced-motion seeds the reduce switch, which the
 * reference does not do.
 * ---------------------------------------------------------------- */
/* React 18's types do not know `inert`, so it is set through a ref. A closed
   panel is inert: out of the tab order and the accessibility tree, which is
   what unmounting used to give for free. Idempotent, so the per-render
   callback replay is harmless. */
const inertNar = (lokad: boolean) => (el: HTMLElement | null) => { el?.toggleAttribute('inert', lokad) }

export function Orkunotkun({ opid, setOpid }: { opid: boolean; setOpid: (v: boolean) => void }) {
  const [dokkt, setDokkt] = useState(false)
  const [min, setMin] = useState(() => reduced())
  const stig = Math.max(0, Math.min(2, (dokkt ? 1 : 2) - (min ? 1 : 0)))

  useEffect(() => {
    const root = document.querySelector('.goa-root') as HTMLElement | null
    if (!root) return
    root.dataset.tema = dokkt ? 'dokkt' : 'ljost'
    root.dataset.hreyfing = min ? 'min' : 'full'
    if (min) root.querySelectorAll('.goa-up').forEach((n) => n.classList.add('on'))
  }, [dokkt, min])

  return (
    <div className="goa-orkaW">
      <button className="goa-orka" aria-expanded={opid} aria-controls="goa-orka-spjald" onClick={() => setOpid(!opid)}>
        <span>Orkunotkun</span>
        <span className="goa-orkaG" aria-live="polite">
          <span className="goa-orkaR" style={{ ['--stig' as string]: stig }}>
            <span>Lítil</span><span>Miðlungs</span><span>Mikil</span>
          </span>
        </span>
      </button>
      <div id="goa-orka-spjald" className={`goa-spjald${opid ? ' opid' : ''}`} ref={inertNar(!opid)}>
          <p className="goa-smatt" style={{ margin: 0 }}>
            Dökkt útlit og minni hreyfing spara rafhlöðu og draga úr álagi á tækið.
          </p>
          <div>
            <div className="goa-rofiRod">
              <span>Dökkt útlit</span>
              <button className="goa-rofi" role="switch" aria-checked={dokkt}
                aria-label="Dökkt útlit" onClick={() => setDokkt((v) => !v)}><i /></button>
            </div>
            <p className="goa-smatt">Sparar orku á OLED skjám.</p>
          </div>
          <div>
            <div className="goa-rofiRod">
              <span>Minni hreyfing</span>
              <button className="goa-rofi" role="switch" aria-checked={min}
                aria-label="Minni hreyfing" onClick={() => setMin((v) => !v)}><i /></button>
            </div>
            <p className="goa-smatt">Slekkur á hreyfingum á síðunni.</p>
          </div>
      </div>
    </div>
  )
}

/* Their own crest, /elementsGlobal/smallLogo.png on goa.is: the "Stofnað
   1968" version. Their live header still serves the "Góa 50 ára" anniversary
   crest; this is the evergreen one they already own, trimmed to its alpha. */
const NAV = [
  { h: '#vorur', t: 'Vörur' },
  { h: '#hillan', t: 'Pöntun' },
  { h: '#erindi', t: 'Fjáröflun og styrkir' },
  { h: '#sagan', t: 'Sagan' },
  { h: '#opnun', t: 'Hafa samband' },
]

/* Lenis owns the scroll, so a bare anchor jump would either be ignored or
   fight the smooth scroller. Hand the target to Lenis when it is there and
   fall back to scrollIntoView when it is not (touch, reduced motion). */
function faraA(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  e.preventDefault()
  const haus = document.querySelector('.goa-haus')
  const offset = -((haus?.getBoundingClientRect().height ?? 56) + 12)
  const l = (window as unknown as { __goaLenis?: { scrollTo: (t: Element, o?: object) => void } }).__goaLenis
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

export function Haus() {
  const [fest, setFest] = useState(false)
  /* one flag for both panels, so opening one always closes the other */
  const [spjald, setSpjald] = useState<'valmynd' | 'orka' | null>(null)
  const opin = spjald === 'valmynd'
  const setOpin = (v: boolean) => setSpjald(v ? 'valmynd' : null)
  const haus = useRef<HTMLElement | null>(null)
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!spjald) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setSpjald(null) }
    const ut = (e: PointerEvent) => { if (!haus.current?.contains(e.target as Node)) setSpjald(null) }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', ut)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', ut) }
  }, [spjald])
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFest(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    /* scroll-margin-top needs the header's real height, which changes with
       the clamp on the logo, so publish it rather than hard-coding 64px. */
    const publish = () => {
      const h = document.querySelector('.goa-haus')?.getBoundingClientRect().height
      if (h) document.querySelector('.goa-root')?.setAttribute('style', `--haus-h:${Math.round(h)}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => { io.disconnect(); window.removeEventListener('resize', publish) }
  }, [])
  return (
    <>
      <div ref={sentinel} style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, pointerEvents: 'none' }} />
      <header ref={haus} className={`goa-haus${fest ? ' fest' : ''}${opin ? ' valmynd' : ''}`}>
        <a className="goa-merkid" href="#top" aria-label="Góa, á forsíðu"
          onClick={(e) => { e.preventDefault(); const l = (window as unknown as { __goaLenis?: { scrollTo: (t: number, o?: object) => void } }).__goaLenis; if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <img src={`${import.meta.env.BASE_URL}goa/goa-merki-stort.svg`}
            alt="Góa, stofnað 1968" width={184} height={230} decoding="async" />
        </a>
        <nav className="goa-nav" aria-label="Aðalvalmynd">
          {NAV.map((n) => (
            <a key={n.h} href={n.h} onClick={(e) => faraA(e, n.h)}>{n.t}</a>
          ))}
        </nav>
        <div className="goa-hausH">
          <Orkunotkun opid={spjald === 'orka'} setOpid={(v) => setSpjald(v ? 'orka' : null)} />
          <PokaHnappur />
          <button className={`goa-braud${opin ? ' opin' : ''}`} aria-expanded={opin} aria-controls="goa-valmynd"
            aria-label={opin ? 'Loka valmynd' : 'Opna valmynd'}
            onClick={() => setOpin(!opin)}><i /><i /><i /></button>
        </div>
        <nav id="goa-valmynd" className={`goa-braudSpjald${opin ? ' opin' : ''}`} aria-label="Valmynd"
          ref={inertNar(!opin)}>
          {NAV.map((n, i) => (
            <a key={n.h} href={n.h} style={{ ['--i' as string]: i }}
              onClick={(e) => { faraA(e, n.h); setOpin(false) }}><span>{n.t}</span></a>
          ))}
        </nav>
      </header>
    </>
  )
}

