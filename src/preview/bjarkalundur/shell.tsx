import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode, RefObject } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Plus, ArrowRight } from 'lucide-react'
import {
  NAV, ROOT, BOOKING_URL, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, ADDRESS, FOOTER,
} from './data'
import type { Pic } from './data'

/* v4, the Edelhaus board × the MRC scroll (teardown in
   _docs/teardowns/mrc-residences-2026-09-26/TEARDOWN.md). Tokens: DESIGN.md. */
export const BAND = '#5A1F18'
const BASE = import.meta.env.BASE_URL

export const CSS = `
@font-face{font-family:'Nyght Serif';src:url('${BASE}fonts/nyght-serif/NyghtSerif-Light.woff2') format('woff2');font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:'Nyght Serif';src:url('${BASE}fonts/nyght-serif/NyghtSerif-LightItalic.woff2') format('woff2');font-weight:300;font-style:italic;font-display:swap}
@font-face{font-family:'Nyght Serif';src:url('${BASE}fonts/nyght-serif/NyghtSerif-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Nyght Serif';src:url('${BASE}fonts/nyght-serif/NyghtSerif-RegularItalic.woff2') format('woff2');font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:'Finlandica Text';src:url('${BASE}fonts/finlandica-text/FinlandicaText-Variable.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}

/* Safari samples html/body for the status and home-indicator strips */
html:has(.bj3),body:has(.bj3){background-color:#232421}
.bj3{--ground:#ECEBE8;--paper:#F5F4F1;--ink:#1C1D1A;--text:#3A3B37;--mute:#62645E;--line:rgba(28,29,26,.14);
  --band:#5A1F18;--dark:#232421;--on:#F5F4F1;--on-mute:rgba(245,244,241,.78);
  --serif:'Nyght Serif','Cormorant Garamond',Georgia,serif;--sans:'Finlandica Text',system-ui,sans-serif;
  --gut:clamp(20px,4.6vw,72px);--sec:clamp(96px,12vw,176px);--ease:cubic-bezier(.16,1,.3,1);--r:14px;
  background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:1rem;line-height:1.65;
  -webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100svh}
.bj3 *{box-sizing:border-box}
.bj3 a{color:inherit}
.bj3 a,.bj3 button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.bj3 p{margin:0;text-wrap:pretty}
.bj3 h1,.bj3 h2,.bj3 h3{margin:0;font-weight:300}
.bj3 .wrap{width:100%;max-width:1360px;margin:0 auto;padding:0 var(--gut)}
.bj3 section[id]{scroll-margin-top:calc(64px + env(safe-area-inset-top))}
.bj3 :focus-visible{outline:2px solid var(--band);outline-offset:3px}
.bj3 .on-dark :focus-visible,.bj3 .hdr[data-state="over"] :focus-visible,.bj3 .menu :focus-visible{outline-color:var(--on)}
.bj3 .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.bj3 .skip{position:absolute;left:12px;top:-60px;z-index:60;background:var(--paper);color:var(--ink);padding:10px 14px;font-weight:560}
.bj3 .skip:focus{top:8px}

/* type */
.bj3 .t-h2{font-family:var(--serif);font-weight:300;font-size:clamp(2.5rem,5.3vw,5rem);line-height:1.02;letter-spacing:-.015em;text-wrap:balance}
.bj3 .t-h2 em,.bj3 .t-display em{font-style:italic}
.bj3 .t-h3{font-family:var(--serif);font-weight:300;font-size:clamp(1.55rem,2.1vw,2rem);line-height:1.1}
.bj3 .stagger .ln+.ln{padding-left:clamp(28px,9vw,168px)}
.bj3 .center{text-align:center}
/* Nyght Serif Italic's g and j run deep: the mask needs room below the line box */
.bj3 .ln{display:block;overflow:hidden;padding:.06em 0 .24em;margin:-.06em 0 -.24em}
.bj3 .ln>span{display:block}
.bj3 .eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:.72rem;font-weight:560;letter-spacing:.24em;text-transform:uppercase;color:var(--mute)}
.bj3 .eyebrow::before,.bj3 .eyebrow::after{content:'';width:5px;height:5px;background:currentColor;transform:rotate(45deg)}
.bj3 .on-dark .eyebrow{color:var(--on-mute)}
.bj3 .body{color:var(--text);max-width:52ch;font-size:1.02rem}
.bj3 .body+.body{margin-top:1em}
.bj3 .on-dark .body{color:var(--on-mute)}
.bj3 .small{font-size:.9rem;line-height:1.55}
.bj3 .mute{color:var(--mute)}

/* controls */
.bj3 .pill{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:0 24px;border-radius:999px;border:1px solid currentColor;
  font-size:.92rem;font-weight:520;text-decoration:none;white-space:nowrap;background:transparent;color:inherit;cursor:pointer;
  transition:background-color .3s ease,color .3s ease,border-color .3s ease,transform .16s var(--ease)}
.bj3 .pill:active{transform:scale(.97)}
.bj3 .pill-solid{background:var(--band);border-color:var(--band);color:var(--on)}
.bj3 .pill-solid:hover{background:#461711;border-color:#461711}
.bj3 .pill-ink:hover{background:var(--ink);border-color:var(--ink);color:var(--on)}
.bj3 .pill-light{color:var(--on);border-color:rgba(245,244,241,.7)}
.bj3 .pill-light:hover{background:var(--on);color:var(--ink)}
.bj3 .round{display:inline-flex;align-items:center;gap:14px;text-decoration:none;font-weight:520;font-size:.95rem}
.bj3 .round i{display:inline-grid;place-items:center;width:54px;height:54px;border-radius:50%;border:1px solid currentColor;transition:background-color .35s ease,transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.bj3 .round:hover i{background:currentColor;transform:translateX(4px)}}
.bj3 .round:hover i svg{color:var(--ground)}
.bj3 .on-dark .round:hover i svg,.bj3 .photo-copy .round:hover i svg{color:var(--ink)}
.bj3 .tlink{position:relative;display:inline-block;text-decoration:none;font-weight:520;padding-bottom:4px}
.bj3 .tlink::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;background:currentColor;transform-origin:left;transition:transform .5s var(--ease)}
.bj3 .tlink:hover::after{transform:scaleX(0);transform-origin:right}

/* header (Edelhaus, MRC small-header behaviour) */
.bj3 .hdr{position:fixed;inset:0 0 auto;z-index:40;padding-top:env(safe-area-inset-top);view-transition-name:bj3-hdr;color:var(--on);transition:transform .55s var(--ease),background-color .35s ease,color .35s ease,box-shadow .35s ease}
.bj3 .hdr .bar{height:72px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px}
.bj3 .hdr[data-state="solid"]{background:rgba(236,235,232,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:var(--ink);box-shadow:0 1px 0 var(--line)}
.bj3 .hdr[data-state="hidden"]{transform:translateY(-101%)}
.bj3 .hdr .burger{justify-self:start;display:inline-flex;align-items:center;gap:12px;min-width:44px;background:none;border:0;color:inherit;font:inherit;font-size:.85rem;font-weight:560;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;min-height:44px;padding:0}
.bj3 .hdr .burger b{position:relative;width:26px;height:10px;display:block}
.bj3 .hdr .burger b::before,.bj3 .hdr .burger b::after{content:'';position:absolute;left:0;right:0;height:1.5px;background:currentColor;transition:transform .4s var(--ease)}
.bj3 .hdr .burger b::before{top:0}.bj3 .hdr .burger b::after{bottom:0}
.bj3 .hdr .burger[aria-expanded="true"] b::before{transform:translateY(4.25px) rotate(45deg)}
.bj3 .hdr .burger[aria-expanded="true"] b::after{transform:translateY(-4.25px) rotate(-45deg)}
.bj3 .hdr .mark{justify-self:center;text-decoration:none;text-align:center;font-family:var(--serif);font-weight:400;font-size:1.02rem;letter-spacing:.3em;text-transform:uppercase;line-height:1.1;padding-left:.3em}
.bj3 .hdr .mark{transition:opacity .45s ease,visibility 0s}
.bj3 .hdr[data-state="over"] .mark.quiet{opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s}
.bj3 .hdr .mark small{display:block;font-family:var(--sans);font-size:.6rem;letter-spacing:.3em;opacity:.8;margin-top:4px}
.bj3 .hdr .right{justify-self:end;display:flex;align-items:center;gap:20px}
.bj3 .hdr .tel{font-size:.9rem;text-decoration:none;opacity:.9}
.bj3 .hdr .pill{min-height:44px;padding:0 22px}
@media (max-width:900px){.bj3 .hdr .tel,.bj3 .hdr .burger span{display:none}.bj3 .hdr .bar{height:60px}.bj3 .hdr .mark{font-size:.86rem;letter-spacing:.24em}.bj3 .hdr .mark small{display:none}}

/* side menu (MRC slides from the right; Edelhaus serif links) */
.bj3 .scrim{position:fixed;inset:0;z-index:44;background:rgba(15,15,13,.42);opacity:0;pointer-events:none;transition:opacity .5s ease}
.bj3 .scrim[data-open="true"]{opacity:1;pointer-events:auto}
.bj3 .menu{position:fixed;top:0;right:0;bottom:0;z-index:45;width:min(520px,100vw);background:var(--band);color:var(--on);
  transform:translateX(102%);transition:transform .7s var(--ease);display:flex;flex-direction:column;padding:calc(26px + env(safe-area-inset-top)) clamp(24px,4vw,48px) calc(28px + env(safe-area-inset-bottom));overflow-y:auto;overscroll-behavior:contain}
.bj3 .menu[data-open="true"]{transform:none}
.bj3 .menu:focus{outline:none}
.bj3 .menu .close{align-self:flex-end;background:none;border:0;color:inherit;font:inherit;font-size:.85rem;font-weight:560;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;min-height:44px;display:inline-flex;align-items:center;gap:10px}
.bj3 .menu ul{list-style:none;margin:clamp(24px,6vh,64px) 0 0;padding:0}
.bj3 .menu li{overflow:hidden}
.bj3 .menu li a{display:block;font-family:var(--serif);font-weight:300;font-size:clamp(2.1rem,4.6vw,3.2rem);line-height:1.18;text-decoration:none;padding:4px 0;
  transform:translateY(105%);transition:transform .8s var(--ease)}
.bj3 .menu[data-open="true"] li a{transform:none}
.bj3 .menu li a[aria-current="page"]{font-style:italic}
.bj3 .menu .foot2{margin-top:auto;padding-top:36px;display:grid;gap:10px;color:var(--on-mute);font-size:.95rem}
.bj3 .menu .foot2 .pill{justify-self:start;margin-bottom:12px}

/* phone awning (mobile chrome standard) */
.bj3 .awning{display:none}
@media (max-width:767px){
  .bj3 .awning{display:grid;grid-template-columns:1fr 1.6fr;gap:8px;position:fixed;left:0;right:0;bottom:0;z-index:38;
    padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(236,235,232,.93);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
  .bj3 .awning .pill{min-height:48px}
  .bj3{padding-bottom:calc(64px + env(safe-area-inset-bottom))}
}

/* hero (every route has one, [data-hero]): sticky, the sheet slides over it */
.bj3 .hero{position:sticky;top:0;height:101svh;z-index:1;overflow:hidden;color:var(--on);background:#2A2B27}
.bj3 .hero-media{position:absolute;inset:0 0 -9% 0;will-change:transform}
.bj3 .hero-media video,.bj3 .hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 58%;display:block}
.bj3 .hero-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,16,.52) 0%,rgba(18,18,16,.16) 40%,rgba(18,18,16,0) 58%,rgba(18,18,16,.38) 100%)}
.bj3 .hero-tint{position:absolute;inset:0;background:#121210;opacity:.18}
.bj3 .hero-copy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:clamp(112px,19svh,200px) var(--gut) 0;text-align:center}
.bj3 .hero-name{font-family:var(--serif);font-weight:300;font-size:clamp(3.1rem,15.6vw,11.5rem);line-height:.92;letter-spacing:-.02em;margin:0;white-space:nowrap;text-shadow:0 2px 40px rgba(0,0,0,.18)}
.bj3 .hero-name .mask{display:inline-block;overflow:hidden;padding:.04em 0 .12em;margin:-.04em 0 -.12em;vertical-align:top}
.bj3 .hero-name .ch{display:inline-block;animation:bj3-char 1.25s var(--ease) both;animation-delay:calc(var(--i) * 42ms + 180ms)}
.bj3 .hero-sub{margin-top:clamp(16px,2.4vw,28px);font-size:clamp(1rem,1.3vw,1.18rem);max-width:34ch;color:rgba(245,244,241,.92);text-shadow:0 1px 18px rgba(0,0,0,.35);animation:bj3-rise 1s var(--ease) .95s both}
.bj3 .hero-ctas{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:14px 26px;margin-top:clamp(20px,2.6vw,32px);animation:bj3-rise 1s var(--ease) 1.1s both}
.bj3 .hero-ctas .pill{background:var(--on);color:var(--ink);border-color:var(--on)}
.bj3 .hero-ctas .pill:hover{background:transparent;color:var(--on)}
@media (max-width:767px){.bj3 .hero-media video,.bj3 .hero-media img{object-position:36% 50%}.bj3 .hero-copy{padding-top:clamp(104px,17svh,150px)}}

/* the sheet */
.bj3 .over{position:relative;z-index:2;background:var(--ground);border-radius:22px 22px 0 0;margin-top:-22px}

/* inner-page hero: shorter, title bottom-left */
.bj3 .pg-hero{height:80svh;min-height:520px}
.bj3 .pg-hero .hero-grad{background:linear-gradient(180deg,rgba(18,18,16,.45) 0%,rgba(18,18,16,.08) 34%,rgba(18,18,16,.5) 72%,rgba(18,18,16,.72) 100%)}
.bj3 .pg-copy{position:absolute;left:0;right:0;bottom:clamp(64px,9vw,120px);display:grid;gap:18px}
.bj3 .t-display{font-family:var(--serif);font-weight:300;font-size:clamp(2.9rem,7.4vw,6rem);line-height:.98;letter-spacing:-.02em}
.bj3 .pg-sub{max-width:46ch;color:rgba(245,244,241,.9);font-size:clamp(1rem,1.2vw,1.12rem);animation:bj3-rise 1s var(--ease) .6s both}
.bj3 .intro-h .ln>span{animation:bj3-line 1.15s var(--ease) both}
.bj3 .intro-h .ln+.ln>span{animation-delay:.12s}
@keyframes bj3-line{from{transform:translateY(112%)}to{transform:none}}

/* pictures */
.bj3 .pic{position:relative;overflow:hidden;margin:0;background:#D9D8D4}
.bj3 .pic img{display:block;width:100%;height:100%;object-fit:cover}
.bj3 .rounded{border-radius:var(--r)}
.bj3 figcaption{font-size:.85rem;color:var(--mute);margin-top:10px}

/* accordion: grid rows 0fr → 1fr, the collapse mechanic */
.bj3 .acc{border-top:1px solid var(--line)}
.bj3 .acc-item{border-bottom:1px solid var(--line)}
.bj3 .acc-btn{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;cursor:pointer}
.bj3 .acc-btn .t-h3{transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.bj3 .acc-btn:hover .t-h3{transform:translateX(6px)}}
.bj3 .acc-btn:focus-visible{outline:2px solid var(--band);outline-offset:4px}
.bj3 .acc-btn i{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);flex:none;transition:transform .5s var(--ease),background-color .3s}
.bj3 .acc-btn[aria-expanded="true"] i{transform:rotate(45deg);background:var(--ink);color:var(--on);border-color:var(--ink)}
.bj3 .acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .6s var(--ease)}
.bj3 .acc-panel[data-open="true"]{grid-template-rows:1fr}
.bj3 .acc-panel>div{overflow:hidden}
.bj3 .acc-inner{padding:0 0 26px;opacity:0;transform:translateY(8px);transition:opacity .4s ease,transform .6s var(--ease)}
.bj3 .acc-panel[data-open="true"] .acc-inner{opacity:1;transform:none;transition-delay:.12s}
.bj3 .facts{display:grid;grid-template-columns:auto 1fr;gap:8px 28px;margin:0;font-size:.98rem}
.bj3 .facts dt{color:var(--mute)}
.bj3 .facts dd{margin:0;font-variant-numeric:tabular-nums}

/* footer (Edelhaus: dark, centred name) */
.bj3 .foot{background:var(--dark);color:var(--on);padding:clamp(80px,10vw,140px) 0 36px;position:relative;z-index:2}
.bj3 .foot .name{text-align:center;font-family:var(--serif);font-weight:300;font-size:clamp(3rem,11vw,10rem);line-height:1;letter-spacing:-.02em;margin:0}
.bj3 .foot .since{text-align:center;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--on-mute);margin-top:14px}
.bj3 .foot .cols{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:32px;margin-top:clamp(56px,7vw,96px);padding-top:32px;border-top:1px solid rgba(245,244,241,.16);font-size:.95rem}
.bj3 .foot h2{font-family:var(--sans);font-size:.7rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;margin:0 0 14px;color:var(--on)}
.bj3 .foot ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.bj3 .foot a,.bj3 .foot p,.bj3 .foot li{color:var(--on-mute);text-decoration:none}
.bj3 .foot a:hover{color:var(--on)}
.bj3 .foot .mid{text-align:center}
.bj3 .foot .end{text-align:right}
.bj3 .foot .fine{margin-top:56px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;font-size:.82rem;color:var(--on-mute)}
@media (max-width:767px){.bj3 .foot .cols{grid-template-columns:1fr;text-align:center}.bj3 .foot .end{text-align:center}.bj3 .foot ul{gap:0}.bj3 .foot li a{display:inline-block;padding:10px 0}}

/* page transitions between routes (View Transitions API, react-router viewTransition) */
::view-transition-old(root){animation:bj3-vt-out .55s cubic-bezier(.7,0,.84,0) both}
::view-transition-new(root){animation:bj3-vt-in .95s cubic-bezier(.16,1,.3,1) both}
::view-transition-group(bj3-hdr){animation:none}
@keyframes bj3-vt-out{to{opacity:.3;transform:scale(.965)}}
@keyframes bj3-vt-in{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}

@keyframes bj3-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes bj3-char{from{transform:translateY(112%)}to{transform:none}}
@keyframes bj3-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
  .bj3 *,.bj3 *::before,.bj3 *::after{animation:none!important;transition:none!important}
  ::view-transition-old(root),::view-transition-new(root){animation:none}
}
`

/* ───────────────────────── scroll engine ───────────────────────── */

let pageLenis: Lenis | null = null
const isTouch = () => matchMedia('(hover: none) and (pointer: coarse)').matches
export function go(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (pageLenis) { pageLenis.start(); pageLenis.scrollTo(el, { offset: -8, force: true }) }
  else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
/** React 18 has no `inert` prop; the attribute still works when spread in. */
export const inertIf = (on: boolean) => (on ? { inert: '' } : {}) as object
/** Accordions change the page height; re-measure every trigger once they settle. */
export function refreshSoon() { window.setTimeout(() => ScrollTrigger.refresh(), 680) }

/** Instant scroll (route changes, back/forward restore), in step with Lenis. */
export function jump(y: number) {
  /* native first: a Lenis made in this same commit has not measured the new page
     yet and would clamp y to its old limit; it syncs once it has */
  window.scrollTo(0, y)
  const l = pageLenis
  if (l) requestAnimationFrame(() => { l.resize(); l.scrollTo(y, { immediate: true, force: true }) })
}
export function lockScroll(on: boolean) {
  if (pageLenis) { if (on) pageLenis.stop(); else pageLenis.start() }
  document.documentElement.style.overflow = on ? 'hidden' : ''
}

/**
 * The MRC feel, ported as behaviour (TEARDOWN.md §1–5), every reveal scrubbed
 * over a short band so a fast flick can never outrun it:
 *  - Lenis lerp .1 + wheelMultiplier .5 (their weighted wheel), fine pointers only
 *  - the sticky hero drifts up at 1/13, its tint deepens over 500px, the copy leaves by 180px
 *  - headline lines rise out of their mask; copy lifts in
 *  - pictures settle 1.15 → 1 (their .bg 115% → 100%); full-bleed photos run the centred parallax
 *  - cards over a photo rise faster than the photo (depth)
 */
export function useMotion(root: RefObject<HTMLDivElement>, key: string) {
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      wide: '(min-width: 900px)',
      fine: '(hover: hover) and (pointer: fine)',
    }, (ctx) => {
      const c = ctx.conditions as { motion: boolean; wide: boolean; fine: boolean }
      if (!c.motion) return undefined
      const q = gsap.utils.selector(el)
      let tick: ((t: number) => void) | null = null
      /* never a JS scroll surface on a phone: Safari only collapses its toolbar for a native scroll */
      const lenis = c.fine && !isTouch() ? new Lenis({ lerp: 0.1, wheelMultiplier: 0.5, smoothWheel: true }) : null
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update)
        tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        pageLenis = lenis
      }

      /* 1. the sticky hero */
      const hero = q('[data-hero]')[0] as HTMLElement | undefined
      if (hero) {
        const media = hero.querySelector('.hero-media')
        const tint = hero.querySelector('.hero-tint')
        const copy = hero.querySelectorAll('.hero-leave')
        if (media) gsap.to(media, { y: () => -hero.offsetHeight / 13, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
        if (tint) gsap.fromTo(tint, { opacity: 0.18 }, { opacity: 0.62, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=500', scrub: true } })
        if (copy.length) gsap.to(copy, { opacity: 0, y: -28, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=180', scrub: true } })
      }

      /* 2. headline lines rise out of their mask */
      q('.rv-h').forEach((h) => {
        gsap.fromTo(h.querySelectorAll('.ln>span'), { yPercent: 112 }, {
          yPercent: 0, ease: 'none', stagger: 0.16,
          scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 60%', scrub: 0.5 },
        })
      })
      /* 3. copy and furniture lift in */
      q('.rv-up').forEach((u) => {
        gsap.fromTo(u, { y: 34, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: u, start: 'top 95%', end: 'top 74%', scrub: 0.5 } })
      })
      /* 4. pictures settle into their frames */
      q('.rv-settle').forEach((f) => {
        const m = f.querySelector('img,video')
        if (m) gsap.fromTo(m, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top 98%', end: 'top 30%', scrub: 0.6 } })
      })
      /* 5. full-bleed photos: the centred parallax (still at the viewport's middle) */
      q('.rv-par').forEach((f) => {
        const m = f.querySelector('img,video')
        if (m) gsap.fromTo(m, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      /* 6. a card floating over a photo rises faster than the photo */
      q('.rv-card').forEach((cd) => {
        gsap.fromTo(cd, { y: c.wide ? 120 : 60 }, { y: c.wide ? -60 : -20, ease: 'none', scrollTrigger: { trigger: cd.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      /* 7. groups step in one after another */
      q('.rv-stagger').forEach((g) => {
        gsap.fromTo(g.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: g, start: 'top 92%', end: 'top 55%', scrub: 0.5 } })
      })

      const refresh = () => ScrollTrigger.refresh()
      document.fonts?.ready.then(refresh)
      window.addEventListener('load', refresh)
      return () => {
        window.removeEventListener('load', refresh)
        if (tick) gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        pageLenis?.destroy(); pageLenis = null
      }
    })
    return () => mm.revert()
  }, [root, key])
}

/* ───────────────────────── building blocks ───────────────────────── */

/** "Line one|*italic line*" → masked lines; *…* marks italic words. */
export function Title({ text, as = 'h2', className = 't-h2', id, stagger, center, intro }: {
  text: string; as?: 'h1' | 'h2' | 'h3'; className?: string; id?: string; stagger?: boolean; center?: boolean
  /** in view at load: a timed rise instead of the scroll-tied one */
  intro?: boolean
}) {
  const Tag = as
  const lines = text.split('|')
  return (
    <Tag id={id} className={`${className} ${intro ? 'intro-h' : 'rv-h'}${stagger ? ' stagger' : ''}${center ? ' center' : ''}`}>
      {lines.map((l, i) => (
        <span key={i} className="ln"><span>
          {l.split(/(\*[^*]+\*)/).filter(Boolean).map((seg, k) =>
            seg.startsWith('*') ? <em key={k}>{seg.slice(1, -1)}</em> : <span key={k}>{seg}</span>)}
        </span></span>
      ))}
    </Tag>
  )
}

export function Photo({ pic, sizes, className = '', ratio, eager, style }: {
  pic: Pic; sizes: string; className?: string; ratio?: string; eager?: boolean; style?: CSSProperties
}) {
  return (
    <figure className={`pic ${className}`} style={{ aspectRatio: ratio ?? `${pic.w} / ${pic.h}`, ...style }}>
      <img
        src={pic.srcS ?? pic.src}
        srcSet={pic.srcS ? `${pic.srcS} 1280w, ${pic.src} ${pic.w}w` : undefined}
        sizes={sizes}
        width={pic.w}
        height={pic.h}
        alt={pic.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow rv-up ${className}`}>{children}</p>
}

export type AccItem = { id: string; head: ReactNode; body: ReactNode }
/** Expand/collapse list; one open at a time, the first open by default. */
export function Accordion({ items, initial = 0 }: { items: AccItem[]; initial?: number }) {
  const [open, setOpen] = useState<number>(initial)
  const uid = useId()
  return (
    <div className="acc">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.id} className="acc-item">
            <button type="button" className="acc-btn" aria-expanded={isOpen} aria-controls={`${uid}-${it.id}`} onClick={() => { setOpen(isOpen ? -1 : i); refreshSoon() }}>
              <span className="t-h3">{it.head}</span>
              <i aria-hidden="true"><Plus size={18} strokeWidth={1.4} /></i>
            </button>
            <div id={`${uid}-${it.id}`} className="acc-panel" data-open={isOpen} role="region" {...inertIf(!isOpen)}>
              <div><div className="acc-inner">{it.body}</div></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Route links carry a view transition; home anchors glide through Lenis. */
export function useNavTo() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onHome = pathname.replace(/\/+$/, '').endsWith(ROOT)
  return (to: string, e: MouseEvent) => {
    const [path, hash] = to.split('#')
    if (hash && onHome && path === ROOT) {
      e.preventDefault()
      go(hash)
      /* keep React Router's state: its location key is what Back restores scroll by */
      history.replaceState(history.state, '', `${BASE.replace(/\/$/, '')}${ROOT}#${hash}`)
      return
    }
    if (hash) {
      e.preventDefault()
      navigate(to, { viewTransition: true })
    }
  }
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<'over' | 'solid' | 'hidden'>('over')
  const { pathname } = useLocation()
  const navTo = useNavTo()
  const burger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const clean = pathname.replace(/\/+$/, '')
  /* the header is inert until the closing render lands, so focus waits a frame */
  const refocus = () => requestAnimationFrame(() => burger.current?.focus())

  useEffect(() => { setOpen(false) }, [pathname])

  /* MRC small header: over the hero it is transparent; past it, it hides on the way down and
     comes back solid on the way up. */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const hero = document.querySelector('[data-hero]') as HTMLElement | null
        const edge = (hero?.offsetHeight ?? 0) - 80
        const y = self.scroll()
        if (y < Math.max(edge, 10)) setState('over')
        else setState(self.direction > 0 ? 'hidden' : 'solid')
      },
    })
    return () => st.kill()
  }, [pathname])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    /* the panel itself takes focus: inside the dialog for keyboard and screen readers,
       without a focus ring landing on "Loka" after a tap */
    panel.current?.focus({ preventScroll: true })
    /* aria-modal alone is not honoured everywhere: everything beside the dialog goes inert */
    const shut = [...(panel.current?.parentElement?.children ?? [])]
      .filter((el): el is HTMLElement => el instanceof HTMLElement && el !== panel.current && !el.classList.contains('scrim') && el.tagName !== 'STYLE' && !el.hasAttribute('inert'))
    shut.forEach((el) => el.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); refocus() }
      if (e.key === 'Tab' && panel.current) {
        const f = [...panel.current.querySelectorAll<HTMLElement>('a,button')]
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); shut.forEach((el) => el.removeAttribute('inert')); lockScroll(false) }
  }, [open])

  const current = (to: string) => (!to.includes('#') && clean.endsWith(to) ? 'page' : undefined)
  const close = () => { setOpen(false); refocus() }
  return (
    <>
      <header className="hdr" data-state={open ? 'over' : state}>
        <a className="skip" href="#efni">Fara beint í efnið</a>
        <div className="wrap bar">
          <button ref={burger} type="button" className="burger" aria-expanded={open} aria-controls="bj3-menu" onClick={() => setOpen(true)}>
            <b aria-hidden="true" /><span>Valmynd</span>
          </button>
          <Link to={ROOT} viewTransition className={`mark${clean.endsWith(ROOT) ? ' quiet' : ''}`} translate="no" aria-label="Hótel Bjarkalundur, forsíða">
            Bjarkalundur<small>Hótel · síðan 1947</small>
          </Link>
          <div className="right">
            <a className="tel" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <a className="pill" href={BOOKING_URL} target="_blank" rel="noreferrer">Bóka</a>
          </div>
        </div>
      </header>
      <div className="scrim" data-open={open} onClick={close} aria-hidden="true" />
      <div id="bj3-menu" ref={panel} className="menu on-dark" data-open={open} role="dialog" aria-modal="true" aria-label="Valmynd" tabIndex={-1} {...inertIf(!open)}>
        <button type="button" className="close" onClick={close}>Loka <Plus size={18} strokeWidth={1.4} style={{ transform: 'rotate(45deg)' }} /></button>
        <ul>
          <li><Link to={ROOT} viewTransition aria-current={clean.endsWith(ROOT) ? 'page' : undefined} onClick={() => setOpen(false)} style={{ transitionDelay: open ? '120ms' : '0ms' }}>Forsíða</Link></li>
          {NAV.map((n, i) => (
            <li key={n.label}>
              <Link to={n.to} viewTransition aria-current={current(n.to)} style={{ transitionDelay: open ? `${170 + i * 55}ms` : '0ms' }}
                onClick={(e) => { setOpen(false); navTo(n.to, e) }}>{n.label}</Link>
            </li>
          ))}
        </ul>
        <div className="foot2">
          <a className="pill pill-light" href={BOOKING_URL} target="_blank" rel="noreferrer">Bóka gistingu</a>
          <a href={PHONE_HREF}>Sími {PHONE_DISPLAY}</a>
          <a href={EMAIL_HREF}>{EMAIL}</a>
          <span>{ADDRESS}</span>
        </div>
      </div>
    </>
  )
}

export function Awning() {
  return (
    <div className="awning" role="region" aria-label="Flýtileiðir">
      <a className="pill pill-ink" href={PHONE_HREF}>Hringja</a>
      <a className="pill pill-solid" href={BOOKING_URL} target="_blank" rel="noreferrer">Bóka gistingu</a>
    </div>
  )
}

export function Footer() {
  const navTo = useNavTo()
  return (
    <footer className="foot on-dark">
      <div className="wrap">
        <p className="name" translate="no">Bjarkalundur</p>
        <p className="since">Hótel · síðan 1947</p>
        <div className="cols">
          <div>
            <h2>Síður</h2>
            <ul>
              <li><Link to={ROOT} viewTransition>Forsíða</Link></li>
              {NAV.map((n) => <li key={n.label}><Link to={n.to} viewTransition onClick={(e) => navTo(n.to, e)}>{n.label}</Link></li>)}
            </ul>
          </div>
          <div className="mid">
            <h2>Hótelið</h2>
            <p>{FOOTER.tagline}</p>
            <p style={{ marginTop: 8 }}>{FOOTER.season}</p>
            <p style={{ marginTop: 22 }}><a className="round" href={BOOKING_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--on)' }}><i><ArrowRight size={20} strokeWidth={1.3} /></i>Bóka gistingu</a></p>
          </div>
          <div className="end">
            <h2>Hafa samband</h2>
            <ul>
              <li>{ADDRESS}</li>
              <li><a href={PHONE_HREF}>Sími {PHONE_DISPLAY}</a></li>
              <li><a href={EMAIL_HREF}>{EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="fine">
          <span>© Hótel Bjarkalundur</span>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer">Bókunarsíða hótelsins</a>
        </div>
      </div>
    </footer>
  )
}

/** Inner pages open on a still photo that the sheet slides over, like the film on home. */
export function PageHero({ pic, title, sub, id }: { pic: Pic; title: string; sub: string; id: string }) {
  return (
    <section className="hero pg-hero" data-hero aria-labelledby={id}>
      <div className="hero-media">
        <img src={pic.srcS ?? pic.src} srcSet={pic.srcS ? `${pic.srcS} 1280w, ${pic.src} ${pic.w}w` : undefined} sizes="100vw"
          width={pic.w} height={pic.h} alt={pic.alt} decoding="async" {...{ fetchpriority: 'high' }} />
      </div>
      <div className="hero-grad" />
      <div className="hero-tint" />
      <div className="wrap pg-copy hero-leave">
        <Title as="h1" id={id} text={title} className="t-display" intro />
        <p className="pg-sub">{sub}</p>
      </div>
    </section>
  )
}

export type Children = { children: ReactNode }
