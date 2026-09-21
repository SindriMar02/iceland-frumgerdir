import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from './data'

/* ── TRÉSMÍÐI RÓBERTS · "SÉRSMÍÐI ER OKKAR FAG" ─────────────────────────
   The HBH Byggir build (driessenarchitectuur.nl system, devices D1–D18 in
   _reference/driessen-teardown) re-aimed at Trésmíði Róberts ehf. after HBH
   turned out to be bankrupt (úrskurður 11.02.2026). Every mechanism is kept
   exactly as measured and gated for HBH; only the content and the brand layer
   change. See _docs/ROBERTS-BUILD-2026-09-21.md.

   Brand layer: their logo is plain black, so the colour comes from the rooms
   they build: walnut for the accent, espresso for the dark bands, amber from
   the bar lighting for the line field.

   Declared deviations from the reference, inherited from HBH: no Lenis (the
   mobile gate forbids a JS scroll surface), no film, the slider carries their
   own published focus lines because they publish no testimonials, and reduced
   motion, focus rings, one h1 and a 15px type floor are added. Unlike HBH the
   grid runs the reference's full seven cards, because Róberts names seventeen
   jobs with photographs.
   ──────────────────────────────────────────────────────────────────────── */

export const C = {
  blue: '#5C3C24',
  blueDeep: '#1E1610',
  ink: '#121417',
  paper: '#EFEDE9',
  white: '#FFFFFF',
  oak: '#B07B45',
  hairline: 'rgba(18,20,23,.12)',
}

const B = import.meta.env.BASE_URL

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ── the system stylesheet ─────────────────────────────────────────────── */
export const CSS = `
@font-face{font-family:'RobSans';src:url('${B}fonts/general-sans/GeneralSans-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'RobSans';src:url('${B}fonts/general-sans/GeneralSans-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'RobSans';src:url('${B}fonts/general-sans/GeneralSans-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}

/* the phone's status and home-indicator strips sample html/body (mobile gate) */
html:has(.rob-root), body:has(.rob-root){background-color:${C.paper}}

.rob-root{
  color-scheme:light;
  --gut:5.625vw; --band:7.5vw; --rad:0.25vw; --rise:1.25vw; --col:1.25vw;
  --t-body:clamp(15px,0.9375vw,17px);
  --t-lead:clamp(16px,1.0625vw,19px);
  --t-big:clamp(34px,4.25vw,68px);
  --t-normal:clamp(23px,2.625vw,42px);
  --t-small:clamp(19px,2vw,32px);
  --t-smaller:clamp(16px,1.5vw,24px);
  --t-num:clamp(34px,3.875vw,62px);
  --t-label:clamp(11px,0.8125vw,13px);
  --t-tag:clamp(11px,0.75vw,12px);
  background:${C.paper}; color:${C.ink};
  font-family:'RobSans',system-ui,sans-serif; font-weight:500;
  font-size:var(--t-body); line-height:1.6; letter-spacing:-0.01em;
  -webkit-font-smoothing:antialiased; overflow-x:clip;
}
@media (max-width:1080px){.rob-root{--gut:5.556vw;--band:11.111vw;--rad:0.37vw;--rise:1.852vw;--col:1.852vw;
  --t-body:clamp(15px,1.389vw,17px); --t-lead:clamp(16px,1.574vw,18px); --t-label:clamp(11px,1.204vw,13px); --t-tag:clamp(11px,1.111vw,12px)}}
@media (max-width:580px){.rob-root{--gut:6.897vw;--band:20.69vw;--rad:0.69vw;--rise:3.448vw;--col:3.448vw;
  --t-big:clamp(32px,11.724vw,44px); --t-normal:clamp(22px,6.207vw,26px); --t-small:clamp(20px,5.517vw,23px);
  --t-smaller:clamp(17px,4.138vw,19px); --t-num:clamp(32px,10.69vw,42px); --t-label:clamp(12px,3.103vw,13px); --t-tag:clamp(11px,2.759vw,12px)}}

.rob-root *{box-sizing:border-box;margin:0;padding:0}
.rob-root a,.rob-root button{touch-action:manipulation;-webkit-tap-highlight-color:rgba(92,60,36,.18)}
.rob-root [id]{scroll-margin-top:calc(var(--band) / 2 + 5vw)}
.rob-skip{position:absolute;left:-9999px;top:0;z-index:70;background:#fff;color:${C.ink};padding:.8em 1.2em;border-radius:var(--rad);font-weight:600}
.rob-skip:focus{left:1rem;top:1rem}
.rob-root img{display:block;width:100%;height:100%;object-fit:cover}
.rob-root a{color:inherit;text-decoration:none}
.rob-root ::selection{background:${C.blue};color:#fff}
.rob-root :focus-visible{outline:2px solid ${C.blue};outline-offset:3px;border-radius:2px}
/* over the photographic hero and the dark band the blue ring has too little
   contrast, so the ring goes white there */
.rob-head.light:not(.scrolled):not(.menuopen) :focus-visible,.rob-band.dark :focus-visible,
.rob-hero :focus-visible,.rob-vhero :focus-visible,.rob-quote :focus-visible,.rob-menu :focus-visible{outline-color:#fff}

/* ── layout primitives ──────────────────────────────────────────────── */
.rob-wrap{width:100%;padding:0 var(--gut);margin:0 auto}
.rob-wrap.small{padding:0 20.625vw}
@media (max-width:1080px){.rob-wrap.small{padding:0 11.111vw}}
@media (max-width:580px){.rob-wrap.small{padding:0 var(--gut)}}
.rob-band{padding:var(--band) 0;background:transparent}
.rob-band.paper{background:${C.paper}}
.rob-band.white{background:${C.white}}
.rob-band.dark{background:${C.blueDeep};color:#fff}
.rob-band.flush{padding:0}
.rob-band section{margin:var(--band) 0}
.rob-band section:first-child{margin-top:0}
.rob-band section:last-child{margin-bottom:0}

/* ── type ───────────────────────────────────────────────────────────── */
.rob-big{font-size:var(--t-big);line-height:1.02;font-weight:500;letter-spacing:-0.03em;overflow-wrap:normal;hyphens:none;text-wrap:balance}
.rob-normal{font-size:var(--t-normal);line-height:1.12;font-weight:500;letter-spacing:-0.025em;overflow-wrap:normal;text-wrap:pretty}
.rob-smallt{font-size:var(--t-small);line-height:1.12;font-weight:500;letter-spacing:-0.02em}
.rob-smallert{font-size:var(--t-smaller);line-height:1.15;font-weight:500;letter-spacing:-0.015em}
.rob-num{font-size:var(--t-num);line-height:1;font-weight:400;font-variant-numeric:tabular-nums;white-space:nowrap;display:inline-block}
.rob-num sup{font-size:0.71em;font-weight:500;vertical-align:top;margin-left:0.04em;line-height:1}
.rob-lead{font-size:var(--t-lead);line-height:1.45}
.rob-label{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;line-height:1.2;display:flex;align-items:center;gap:0.7em}
.rob-tag{font-size:var(--t-tag);border:1px solid rgba(18,20,23,.3);border-radius:var(--rad);padding:0.18em 0.6em 0.28em;color:rgba(18,20,23,.72);white-space:nowrap}
.rob-band.dark .rob-tag,.rob-hero .rob-tag,.rob-vhero .rob-tag{border-color:rgba(255,255,255,.45);color:rgba(255,255,255,.88)}

/* the label dot draws itself in, as on the reference */
.rob-dot{width:1.05em;height:1.05em;flex:none;display:block}
.rob-dot circle{fill:none;stroke:${C.blue};stroke-width:5;transform:rotate(-90deg);transform-origin:50% 50%;
  stroke-dasharray:28.27;stroke-dashoffset:28.27;transition:stroke-dashoffset .9s .3s ease-out}
.rob-band.dark .rob-dot circle{stroke:#fff}
.inview .rob-dot circle{stroke-dashoffset:0}

/* ── reveals: 1.25vw rise + fade, .45s, .15s ladder ─────────────────── */
.rob-rise{transform:translateY(var(--rise));opacity:0;transition:transform .45s var(--d,0s) ease-out,opacity .45s var(--d,0s) ease-out}
.inview .rob-rise,.rob-rise.inview{transform:translateY(0);opacity:1}
.rob-word{display:inline-block;transform:translateY(var(--rise));opacity:0;
  transition:transform .45s var(--d,0s) cubic-bezier(.33,1,.68,1),opacity .45s var(--d,0s) ease-out}
.inview .rob-word{transform:translateY(0);opacity:1}

/* ── media: parallax box, scrub overlay ─────────────────────────────── */
.rob-media{position:relative;overflow:hidden;border-radius:var(--rad);background:#d8d4cf}
.rob-media .inner{position:absolute;inset:-8% 0;height:116%;will-change:transform}
.rob-media .scrim{position:absolute;inset:0;background:${C.ink};opacity:0;z-index:2;pointer-events:none}
.rob-media figcaption{position:absolute;inset:auto 0 0 0;padding:0.6em 0.8em;font-size:var(--t-tag);color:#fff;
  background:linear-gradient(to top,rgba(30,22,16,.72),transparent);z-index:3}

/* ── buttons: label slides right, arrow swaps (.3s) ─────────────────── */
.rob-btn{position:relative;display:inline-block;overflow:hidden;cursor:pointer;
  border:1px solid ${C.ink};border-radius:var(--rad);background:${C.ink};color:#fff;
  font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;
  min-width:clamp(180px,13.75vw,220px);transition:background .3s,color .3s,border-color .3s}
/* the label slides with a transform; animating its padding ran layout on every
   hover frame for the same visual result */
.rob-btn .lab{display:block;padding:0.95em 1.2em 1em;padding-right:3.2em;transition:transform .3s cubic-bezier(0.32,0.72,0,1)}
.rob-btn .arw{position:absolute;top:50%;width:3.2em;text-align:center;transition:transform .3s,opacity .3s;line-height:0}
.rob-btn .arw.r{right:0;transform:translate(0,-50%);opacity:1}
.rob-btn .arw.l{left:0;transform:translate(-100%,-50%);opacity:0}
.rob-btn.ghost{background:transparent;color:${C.ink};border-color:${C.ink}}
.rob-btn.light{background:#fff;color:${C.ink};border-color:#fff}
.rob-btn.brand{background:${C.blue};border-color:${C.blue};color:#fff}
.rob-arrowbtn{width:clamp(44px,3.5625vw,58px);height:clamp(44px,3.5625vw,58px);border:1px solid currentColor;
  border-radius:var(--rad);background:transparent;color:inherit;cursor:pointer;position:relative;overflow:hidden;
  display:grid;place-items:center;transition:background .3s,color .3s}
.rob-arrowbtn:disabled{opacity:.3;cursor:default}
.rob-arrowbtn:disabled:hover{background:transparent;color:inherit;border-color:currentColor}

/* ── the line field: wood grain that draws itself and never settles ──── */
.rob-lines{position:absolute;left:0;right:0;pointer-events:none;z-index:0}
.rob-lines svg{display:block;width:100%;height:auto}
.rob-lines path{fill:none;stroke:${C.oak};stroke-width:1;opacity:.28;
  stroke-dasharray:var(--len);stroke-dashoffset:var(--len);transition:stroke-dashoffset 3s ease-in-out}
.rob-lines.drawn path{stroke-dashoffset:0}
.rob-band.dark .rob-lines path{stroke:#fff;opacity:.16}

/* ── intro: the reference's logo moment, once per session ────────────────
   Cream field, the mark draws its square and its wordmark, then the whole
   thing lifts and fades. 1.5s, skipped entirely under reduced motion and on
   every navigation after the first. */
.rob-intro{position:fixed;inset:0;z-index:80;background:${C.paper};display:grid;place-items:center;
  transition:opacity .45s ease-out;pointer-events:none}
.rob-intro.gone{opacity:0}
.rob-intro .mark{display:flex;align-items:baseline;gap:.4em;font-weight:600;letter-spacing:0.02em;
  font-size:clamp(34px,4.6vw,66px);color:${C.blueDeep};opacity:0;transform:translateY(14px);
  transition:opacity .5s ease-out,transform .7s cubic-bezier(.22,1,.36,1)}
.rob-intro .mark small{font-size:0.4em;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;opacity:.6}
.rob-intro .rule{position:absolute;left:50%;bottom:calc(50% - 2.6em);width:0;height:2px;background:${C.blue};
  transform:translateX(-50%);transition:width .8s .15s cubic-bezier(.22,1,.36,1)}
.rob-intro.in .mark{opacity:1;transform:translateY(0)}
.rob-intro.in .rule{width:min(38vw,320px)}
.rob-intro.lift .mark{transform:translateY(-14px);opacity:0;transition:opacity .4s ease-out,transform .5s ease-out}
.rob-intro.lift .rule{width:0;transition:width .45s ease-out}

/* ── header: floating pill, plate fades in at 20px ──────────────────── */
.rob-scroll-top{position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none}
.rob-head{position:fixed;left:4.375vw;top:1.25vw;width:calc(100vw - 8.75vw);z-index:40;
  padding:1.25vw;color:${C.ink};transition:color .3s;padding-top:max(1.25vw,env(safe-area-inset-top))}
.rob-head:before{content:'';position:absolute;inset:0;background:#fff;border-radius:var(--rad);opacity:0;transition:opacity .3s}
.rob-head.scrolled:before,.rob-head.menuopen:before{opacity:1}
.rob-head.light:not(.scrolled):not(.menuopen){color:#fff}
/* the ghost phone button inherits ink from the system and vanished over the dark
   hero until the plate faded in (caught in the landing shot, 2026-09-21) */
.rob-head.light:not(.scrolled):not(.menuopen) .rob-btn.ghost{color:#fff;border-color:rgba(255,255,255,.6)}
.rob-head .row{position:relative;display:flex;align-items:center;gap:var(--col);justify-content:space-between}
.rob-head .mark{font-weight:600;letter-spacing:0.02em;font-size:clamp(17px,1.35vw,22px);display:flex;align-items:baseline;gap:.45em}
.rob-head .mark small{font-size:0.52em;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;opacity:.65}
.rob-head nav{display:flex;gap:1.6vw;font-size:var(--t-lead);font-weight:500}
.rob-head nav a{opacity:1;transition:opacity .3s}
.rob-head .acts{display:flex;align-items:center;gap:0.8vw}
@media (max-width:1080px){.rob-head{left:3.704vw;top:1.852vw;width:calc(100vw - 7.407vw);padding:1.852vw}
  .rob-head .acts .rob-btn.tel{display:none}}
@media (max-width:760px){.rob-head{left:3.448vw;top:3.448vw;width:calc(100vw - 6.897vw);padding:3.6vw 3.448vw}
  .rob-head nav{display:none}.rob-head .acts .rob-btn{display:none}}
/* the menu button is hidden from 761px up, never below it: the base rule used
   to sit after the media query and silently won, which left a phone with no
   navigation at all (caught on the iOS simulator) */
.rob-head .burger{display:grid;width:44px;height:44px;place-items:center;background:transparent;border:0;cursor:pointer;color:inherit}
@media (min-width:761px){.rob-head .burger{display:none}}
.rob-head .burger i{display:block;position:relative;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,background .3s}
.rob-head .burger i:before,.rob-head .burger i:after{content:'';position:absolute;left:0;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,top .3s}
.rob-head .burger i:before{top:-7px}.rob-head .burger i:after{top:7px}
.rob-head.menuopen .burger i{background:transparent}
.rob-head.menuopen .burger i:before{top:0;transform:rotate(45deg)}
.rob-head.menuopen .burger i:after{top:0;transform:rotate(-45deg)}

.rob-menu{position:fixed;inset:0;z-index:35;overscroll-behavior:contain;background:${C.blueDeep};color:#fff;opacity:0;pointer-events:none;
  transition:opacity .3s,visibility 0s linear .3s;visibility:hidden;display:flex;flex-direction:column;justify-content:center;padding:0 var(--gut)}
/* visibility, not just opacity: iOS 26 Safari tints the status strip from a fixed
   element touching the top edge, and a closed menu at opacity 0 kept it espresso
   over white bands after one open (caught on the simulator, 2026-09-21) */
.rob-menu.open{opacity:1;pointer-events:auto;visibility:visible;transition:opacity .3s,visibility 0s}
/* only the navigation links take the big menu size; the two buttons keep the
   label scale, or the email address runs into its own arrow */
.rob-menu > a{font-size:clamp(30px,8.6vw,44px);line-height:1.5;font-weight:500}
.rob-menu .foot{margin-top:2.4rem;display:flex;flex-wrap:wrap;gap:0.8rem}
.rob-menu .foot .rob-btn{font-size:var(--t-label);min-width:0;flex:1 1 auto;text-align:left}
.rob-menu .foot .rob-btn .lab{padding:1.05em 1.2em 1.1em;padding-right:3.4em}

/* ── the two-dot cursor, fine pointers only ─────────────────────────── */
.rob-cursor{position:fixed;inset:0;z-index:60;pointer-events:none;display:none}
@media (hover:hover) and (pointer:fine){.rob-cursor{display:block}}
/* one 52px box per dot, sized by the independent scale property so the disc
   grows on the compositor; width, height and margin used to animate here and
   that ran layout on the element that moves every pointer frame */
.rob-cursor b{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;display:block;
  transition:scale .3s,background .3s,opacity .3s}
.rob-cursor b.lead{scale:0.173;background:${C.blueDeep};z-index:2}
.rob-cursor b.trail{scale:0.135;background:${C.blue}}
.rob-cursor.on-link b{opacity:0}
.rob-cursor.on-card b.lead{scale:1;background:${C.blue};opacity:1}
.rob-cursor.on-card b.trail{opacity:0}
.rob-cursor .arw{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;display:grid;place-items:center;
  color:#fff;opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s;z-index:3}
.rob-cursor.on-card .arw{opacity:1;transform:translateX(0)}

/* ── mobile sticky contact bar ──────────────────────────────────────── */
.rob-sticky{position:fixed;left:0;right:0;bottom:0;z-index:38;display:none;gap:8px;padding:10px 12px;
  padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(239,237,233,.94);
  backdrop-filter:blur(8px);border-top:1px solid ${C.hairline}}
@media (max-width:760px){.rob-sticky{display:flex}}
.rob-sticky a{flex:1;text-align:center;padding:14px 10px;border-radius:var(--rad);font-size:15px;font-weight:600;
  text-transform:uppercase;letter-spacing:0.05em}
.rob-sticky a.call{background:${C.blue};color:#fff}
.rob-sticky a.mail{background:transparent;color:${C.ink};border:1px solid ${C.ink}}

/* ── footer ─────────────────────────────────────────────────────────── */
.rob-foot{background:${C.paper};padding:var(--band) 0 calc(var(--band) / 2)}
.rob-foot .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:760px){.rob-foot .cols{grid-template-columns:repeat(2,1fr);gap:2rem 1rem}}
.rob-foot h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:1em;opacity:.55}
.rob-foot p,.rob-foot li{font-size:var(--t-lead);line-height:1.5}
.rob-foot .rule{height:1px;background:${C.hairline};margin:calc(var(--band) / 2) 0 1.5rem}
.rob-foot .fine{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:var(--t-tag);opacity:.7}
@media (max-width:760px){.rob-root{padding-bottom:76px}}

/* every hover effect sits behind a real pointer: on a touch screen a tap used
   to leave the label shifted and a card darkened until the next tap */
@media (hover:hover) and (pointer:fine){
  .rob-btn:hover .lab{transform:translateX(2em)}
  .rob-btn:hover .arw.r{transform:translate(100%,-50%);opacity:0}
  .rob-btn:hover .arw.l{transform:translate(0,-50%);opacity:1}
  .rob-btn.ghost:hover{background:${C.ink};color:#fff}
  .rob-btn.light:hover{background:transparent;color:#fff;border-color:#fff}
  .rob-btn.brand:hover{background:${C.blueDeep};border-color:${C.blueDeep}}
  .rob-arrowbtn:hover{background:${C.blue};border-color:${C.blue};color:#fff}
  .rob-head nav a:hover{opacity:.6}
  .rob-foot a:hover{opacity:.55}
  .rob-card:hover .rob-media .inner:after{opacity:.55}
}

@media (prefers-reduced-motion:reduce){
  /* gentler, not none: colour and opacity still carry the feedback, movement goes */
  .rob-root *,.rob-root *:before,.rob-root *:after{
    transition-property:opacity,color,background-color,border-color,fill,stroke !important;
    transition-duration:.15s !important;animation-duration:.01ms !important}
  .rob-rise,.rob-word{transform:none !important;opacity:1 !important}
  .rob-lines path{stroke-dashoffset:0 !important}
  .rob-media .inner{transform:none !important}
  .rob-cursor{display:none !important}
}
`

/* ── in-view: one observer, matching the reference's 0% 95% start ────── */
export function useInview<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('inview'); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('inview'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -5% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** Section wrapper that reveals its children on entry. */
export function Reveal({ as: Tag = 'div', className = '', children, style }: {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li'
  className?: string
  children: ReactNode
  style?: CSSProperties
}) {
  const ref = useInview<HTMLDivElement>()
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  )
}

/* 70ms between parts of one group: at 150ms an image and its own caption read
   as two separate events instead of one arrival */
export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.07).toFixed(2)}s` })

/** Word-by-word display reveal. Icelandic compounds are never split mid-word. */
export function Words({ text, className = '', hold = 0.45, tag: Tag = 'span' }: {
  text: string
  className?: string
  hold?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote'
}) {
  const words = text.split(' ')
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="rob-word" style={{ ['--d' as string]: `${(hold + i * 0.05).toFixed(2)}s` }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rob-label ${className}`}>
      <svg className="rob-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
      <span>{children}</span>
    </p>
  )
}

export function Chapter({ n }: { n: string }) {
  const [whole, part] = n.split('.')
  return (
    <span className="rob-num" aria-hidden="true">
      {whole}.<sup>{part}</sup>
    </span>
  )
}

const Arrow = ({ dir = 'right' }: { dir?: 'right' | 'left' }) => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"
    style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}>
    <path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export function Btn({ href, to, children, variant = '', onClick, ...rest }: {
  href?: string
  to?: string
  children: ReactNode
  variant?: '' | 'ghost' | 'light' | 'brand'
  onClick?: () => void
  className?: string
}) {
  const inner = (
    <>
      <span className="lab">{children}</span>
      <span className="arw l"><Arrow /></span>
      <span className="arw r"><Arrow /></span>
    </>
  )
  const cls = `rob-btn ${variant} ${rest.className ?? ''}`
  if (to) return <Link className={cls} to={to} onClick={onClick}>{inner}</Link>
  return <a className={cls} href={href} onClick={onClick}>{inner}</a>
}

export function ArrowButton({ dir, onClick, disabled, label }: {
  dir: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button type="button" className="rob-arrowbtn" onClick={onClick} disabled={disabled} aria-label={label}>
      <Arrow dir={dir} />
    </button>
  )
}

/* ── the line field ─────────────────────────────────────────────────────
   41 strokes, the reference's count. They draw in over 3s staggered from the
   end, then single lines erase and redraw forever (2.5s to 5.5s each), which
   is what keeps the page alive while nothing else moves. Paused off screen. */
export function LineField({ top = '0', height = 430, seed = 1 }: { top?: string; height?: number; seed?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [paths] = useState(() => {
    const out: string[] = []
    let s = seed * 9301
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    for (let i = 0; i < 41; i++) {
      const y = 20 + i * 11 + rnd() * 3
      const amp = 12 + rnd() * 26
      const k = 1.1 + rnd() * 0.9
      const d = [`M0 ${y.toFixed(1)}`]
      for (let x = 100; x <= 1600; x += 100) {
        const cy = y + Math.sin((x / 1600) * Math.PI * k + i * 0.35) * amp
        d.push(`S ${(x - 50).toFixed(0)} ${(cy + amp * 0.25).toFixed(1)}, ${x} ${cy.toFixed(1)}`)
      }
      out.push(d.join(' '))
    }
    return out
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const svgPaths = Array.from(el.querySelectorAll<SVGPathElement>('path'))
    svgPaths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.setProperty('--len', `${len.toFixed(0)}`)
    })
    if (reduced()) { el.classList.add('drawn'); return }

    let alive = true
    let running = false
    const timers: number[] = []
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const clear = () => { timers.splice(0).forEach(clearTimeout) }

    const cycle = (p: SVGPathElement) => {
      if (!alive || !running) return
      const len = p.getTotalLength()
      const out = rand(2.5, 5.5)
      p.style.transition = `stroke-dashoffset ${out}s ease-in-out`
      p.style.strokeDashoffset = `${len}`
      timers.push(window.setTimeout(() => {
        if (!alive || !running) return
        const back = rand(2.5, 5.5)
        p.style.transition = `stroke-dashoffset ${back}s ease-in-out`
        p.style.strokeDashoffset = '0'
        timers.push(window.setTimeout(() => cycle(p), (back + rand(0.6, 3)) * 1000))
      }, (out + rand(0, 1.5)) * 1000))
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        svgPaths.forEach((p, i) => {
          p.style.transition = `stroke-dashoffset 3s ${((svgPaths.length - 1 - i) * 0.1).toFixed(1)}s ease-in-out`
        })
        el.classList.add('drawn')
        // once the draw-in is done, hand a handful of lines to the loop
        timers.push(window.setTimeout(start, 4200))
        io.disconnect()
      })
    }, { rootMargin: '25% 0px' })
    io.observe(el)

    /* the loop is decorative, so it only runs while the field is on screen and
       the tab is in front; it used to keep repainting 41 strokes pages away */
    const start = () => {
      if (running || !alive) return
      running = true
      const pool = [...svgPaths].sort(() => Math.random() - 0.5).slice(0, 6)
      pool.forEach((p, i) => timers.push(window.setTimeout(() => cycle(p), i * rand(800, 2600))))
    }
    const stop = () => { running = false; clear() }
    const visible = { onScreen: false, tabVisible: document.visibilityState === 'visible' }
    const sync = () => { if (visible.onScreen && visible.tabVisible) start(); else stop() }
    const liveIo = new IntersectionObserver(([e]) => { visible.onScreen = e.isIntersecting; sync() }, { rootMargin: '25% 0px' })
    liveIo.observe(el)
    const onVis = () => { visible.tabVisible = document.visibilityState === 'visible'; sync() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      alive = false; running = false; clear(); io.disconnect(); liveIo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className="rob-lines" ref={ref} style={{ top, height }} aria-hidden="true">
      <svg viewBox="0 0 1600 478" preserveAspectRatio="none" style={{ height }}>
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    </div>
  )
}

/* ── scroll engine: one rAF pass for parallax and image scrims ────────── */
export function useScrollFx() {
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    let stop = false
    let onScreen = 0
    /* the node lists are read once instead of twice per frame, and the loop only
       runs while at least one parallax layer or scrim is actually on screen */
    let speedEls: HTMLElement[] = []
    let scrimEls: HTMLElement[] = []
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { onScreen += e.isIntersecting ? 1 : -1 })
      onScreen = Math.max(0, onScreen)
      if (onScreen > 0 && !raf) raf = requestAnimationFrame(run)
    }, { rootMargin: '20% 0px' })
    const collect = () => {
      io.disconnect(); onScreen = 0
      speedEls = Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))
      scrimEls = Array.from(document.querySelectorAll<HTMLElement>('[data-scrim]'))
      ;[...speedEls, ...scrimEls].forEach((el) => io.observe(el))
    }
    const run = () => {
      if (stop) return
      if (onScreen === 0) { raf = 0; return }
      const vh = window.innerHeight
      const sy = window.scrollY
      speedEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) return
        const speed = Number(el.dataset.speed)
        let y: number
        if (el.dataset.anchor === 'top') {
          y = (sy / 40) * Math.abs(speed)
        } else {
          const top = r.top + sy
          y = ((top - sy - (vh / 2 - r.height / 2)) / 20) * speed
        }
        el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`
      })
      scrimEls.forEach((el) => {
        const host = el.parentElement
        if (!host) return
        const r = host.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) return
        const max = Number(el.dataset.scrim)
        const from = vh * 0.6
        const p = Math.min(1, Math.max(0, (from - r.bottom) / from))
        el.style.opacity = (p * max).toFixed(3)
      })
      raf = requestAnimationFrame(run)
    }
    collect()
    const onResize = () => collect()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(run)
    return () => { stop = true; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])
}

/* ── the cursor ───────────────────────────────────────────────────────── */
export function Cursor() {
  useEffect(() => {
    if (reduced() || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return
    const root = document.querySelector<HTMLElement>('.rob-cursor')
    if (!root) return
    const lead = root.querySelector<HTMLElement>('b.lead')!
    const trail = root.querySelector<HTMLElement>('b.trail')!
    const arw = root.querySelector<HTMLElement>('.arw')!
    let tx = -100, ty = -100, lx = -100, ly = -100, ax = -100, ay = -100
    let raf = 0
    const move = (e: PointerEvent | MouseEvent) => {
      tx = e.clientX; ty = e.clientY
      const t = e.target as HTMLElement | null
      const card = t?.closest('[data-cursor="card"]')
      const link = t?.closest('a,button,[role="button"]')
      root.classList.toggle('on-card', !!card)
      root.classList.toggle('on-link', !!link && !card)
    }
    const tick = () => {
      lx += (tx - lx) * 0.35; ly += (ty - ly) * 0.35
      ax += (tx - ax) * 0.18; ay += (ty - ay) * 0.18
      lead.style.transform = `translate3d(${lx}px,${ly}px,0)`
      arw.style.left = '0'; arw.style.top = '0'
      arw.style.transform = `translate3d(${lx}px,${ly}px,0)`
      trail.style.transform = `translate3d(${ax}px,${ay}px,0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('mousemove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="rob-cursor" aria-hidden="true">
      <b className="trail" />
      <b className="lead" />
      <span className="arw"><Arrow /></span>
    </div>
  )
}

/* ── header ───────────────────────────────────────────────────────────── */
export function Header({ light = false }: { light?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinel = useRef<HTMLSpanElement | null>(null)
  /* the plate used to be driven by a frame loop that compared scrollY to 20 for
     the whole session; a 20px sentinel at the top of the document says the same
     thing and costs nothing while the page sits still */
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const nav = [
    { to: '/preview/roberts#verkefni', label: 'Verkefni' },
    { to: '/preview/roberts#thjonusta', label: 'Þjónusta' },
    { to: '/preview/roberts#um-okkur', label: 'Um okkur' },
  ]
  const go = (hash: string) => {
    setOpen(false)
    const el = document.querySelector(hash.slice(hash.indexOf('#')))
    if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <span ref={sentinel} className="rob-scroll-top" aria-hidden="true" />
      <a className="rob-skip" href="#efni">Fara beint í efnið</a>
      <header className={`rob-head${scrolled ? ' scrolled' : ''}${light ? ' light' : ''}${open ? ' menuopen' : ''}`}>
        <div className="row">
          <Link to="/preview/roberts" className="mark" aria-label="Trésmíði Róberts, forsíða">
            Róberts <small>trésmíði</small>
          </Link>
          <nav aria-label="Aðalvalmynd">
            {nav.map((n) => (
              <a key={n.label} href={n.to} onClick={(e) => { e.preventDefault(); go(n.to) }}>{n.label}</a>
            ))}
          </nav>
          <div className="acts">
            <Btn href={CONTACT.simiHref} variant="ghost" className="tel">{CONTACT.simi}</Btn>
            <Btn href={`mailto:${CONTACT.netfang}`} variant="brand">Hafa samband</Btn>
            <button
              type="button"
              className="burger"
              aria-expanded={open}
              aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              onClick={() => setOpen((o) => !o)}
            >
              <i />
            </button>
          </div>
        </div>
      </header>
      <div className={`rob-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        {nav.map((n) => (
          <a key={n.label} href={n.to} onClick={(e) => { e.preventDefault(); go(n.to) }} tabIndex={open ? 0 : -1}>{n.label}</a>
        ))}
        <div className="foot">
          <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
          <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
        </div>
      </div>
    </>
  )
}

/** The opening moment. Cold load only, fine pointers only.
 *
 *  It ran on a phone once and iOS Safari left it stranded as a pale film over
 *  the whole page (caught on the simulator, 2026-09-17): a timer-driven
 *  overlay can be throttled while the tab is still settling, and the failure
 *  mode is a client seeing a washed-out site. So: never on touch, advanced by
 *  a wall clock rather than by setTimeout alone, dismissed by the first scroll,
 *  tap or key, and hard-removed after 2.6s whatever happened. */
export function Intro() {
  const [phase, setPhase] = useState<'off' | 'in' | 'lift' | 'gone'>('off')
  useEffect(() => {
    if (reduced()) return
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return
    if (document.visibilityState !== 'visible') return
    let seen = false
    try { seen = sessionStorage.getItem('rob-intro') === '1' } catch { seen = false }
    if (seen) return
    try { sessionStorage.setItem('rob-intro', '1') } catch { /* private mode */ }

    setPhase('in')
    const root = document.documentElement
    root.style.overflow = 'hidden'
    const t0 = Date.now()
    let raf = 0
    let done = false
    const finish = () => {
      if (done) return
      done = true
      root.style.overflow = ''
      setPhase('gone')
      window.setTimeout(() => setPhase('off'), 500)
      cancelAnimationFrame(raf)
      for (const ev of ['scroll', 'pointerdown', 'keydown', 'visibilitychange'] as const) {
        window.removeEventListener(ev, finish)
      }
    }
    const tick = () => {
      const t = Date.now() - t0
      if (t >= 1500) { finish(); return }
      if (t >= 1000) setPhase('lift')
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    for (const ev of ['scroll', 'pointerdown', 'keydown', 'visibilitychange'] as const) {
      window.addEventListener(ev, finish, { passive: true })
    }
    return () => { cancelAnimationFrame(raf); root.style.overflow = ''; for (const ev of ['scroll', 'pointerdown', 'keydown', 'visibilitychange'] as const) window.removeEventListener(ev, finish) }
  }, [])
  if (phase === 'off') return null
  return (
    <div className={`rob-intro ${phase === 'gone' ? 'gone' : phase}`} aria-hidden="true">
      <span className="mark">Róberts <small>trésmíði</small></span>
      <span className="rule" />
    </div>
  )
}

export function StickyBar() {
  return (
    <div className="rob-sticky">
      <a className="call" href={CONTACT.simiHref}>Hringja</a>
      <a className="mail" href={`mailto:${CONTACT.netfang}`}>Senda póst</a>
    </div>
  )
}
