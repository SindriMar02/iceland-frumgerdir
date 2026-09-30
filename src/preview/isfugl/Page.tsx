import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  Bendill, C, CSS, Cas, Haus, Merki, Ord, Reveal, faraA, isCompact, isPhone, lenisOf, reduced, step, useMjukSkrun, useWatchdog,
} from './ui'
import { Poki, POKA_CSS, poki } from './poki'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { Diskaregn, REGN_CSS } from './regn'
import { Popup, POP_CSS, pop } from './popup'
import { Skjahvila, SKJAHVILA_CSS } from './skjahvila'
import { UPPSKRIFTIR } from './uppskriftir'
import { VORUR } from './vorur'
import { SOLUSTADIR } from './solustadir'
import {
  BAEIR, ERINDI, FAQ_MYNDIR, FYRIRTAEKI, GALLERI, HERO_REITIR, HOPAR, JSON_LD, KORT3, SETNING, SETNING_HRINGUR, SOGUHOPAR, SPJOLD,
  SPURT, STUTT, TEXTI, TEYMI, TILVITNUN,
} from './data'

const company = getPreviewCompany('isfugl')

/* Every image path resolves against BASE_URL: the preview deploys under
   /iceland-frumgerdir/ on GitHub Pages. */
const B = import.meta.env.BASE_URL
const S = (p: string) => `${B}isfugl/${p}.webp`
const ph = (p: string) => S(p.startsWith('ph/') ? p : `ph/${p}`)

/* custom-slogan (.17,.17,.255,.902), solved for x, for the scrubbed slogan */
function bezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by
  const X = (t: number) => ((ax * t + bx) * t + cx) * t
  const Y = (t: number) => ((ay * t + by) * t + cy) * t
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) { const e = X(t) - x; const d = dX(t); if (Math.abs(e) < 1e-4 || !d) break; t -= e / d }
    return Y(Math.min(1, Math.max(0, t)))
  }
}
const easeSlogan = bezier(0.17, 0.17, 0.255, 0.902)

/* Scroll progress of an element between two points, transform-only work on
   one rAF per scroll. Lenis drives the native scroll, so this sees it. */
function useFramvinda(fn: (el: HTMLElement) => void, deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const run = () => { raf = 0; fn(el) }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

const PAGE_CSS = `
@media (hover:none),(pointer:coarse){
  .isf-reit img.foto,.isf-spjaldM img,.isf-galI img,.isf-lina2 figure img,.isf-faqM img{filter:none !important}
}
/* HERO (§5.1-5.2): exactly one viewport on desktop, 50/50, the right half on
   the element ground holding the scattered 4x3 grid; taller than the viewport
   on tablet and phone so the grid can be a grid. */
.isf-heroP{position:relative}
.isf-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}
/* the text clears the hanging logo tag on short screens too (12.96vh alone is
   not enough on a 600px-tall window) */
.isf-heroT{display:flex;flex-direction:column;padding:max(12.96vh,calc(80px + 1.5rem)) var(--gut) var(--gut) var(--gut)}
.isf-heroT h1{font-size:4.17vw}
.isf-heroAr{color:var(--c-rautt)}
.isf-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.isf-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:1.04vw;padding:14.72svh var(--gut) 5svh 3.75vw;height:100%}
.isf-reit{margin:0;overflow:hidden;position:relative;background:var(--c-el2);border-radius:var(--r)}
.isf-reit > .isf-up{position:absolute;inset:0}
.isf-reit img.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.isf-reit img.med{position:absolute;left:5%;bottom:5%;width:46%;height:auto;filter:drop-shadow(0 8px 12px rgba(30,20,16,.35));transform:rotate(-6deg)}
.isf-reit:nth-child(1){grid-area:1/1/2/2}.isf-reit:nth-child(2){grid-area:1/2/2/3}
.isf-reit:nth-child(3){grid-area:2/2/3/3}.isf-reit:nth-child(4){grid-area:2/3/3/4}
.isf-reit:nth-child(5){grid-area:2/4/3/5}.isf-reit:nth-child(6){grid-area:3/1/4/2}
.isf-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .isf-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .isf-heroT{padding:calc(var(--haus-h,60px) + 9.091vh) var(--gut) 2.604vw}
  .isf-heroT h1{font-size:7.292vw}
  .isf-heroSlag{margin-top:2rem}
  .isf-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:2.604vw;height:auto}
  .isf-reit{aspect-ratio:3/4}
  .isf-reit:nth-child(n){grid-area:auto}
  .isf-reit:nth-child(1){grid-column:1}.isf-reit:nth-child(2){grid-column:2}
  .isf-reit:nth-child(3){grid-column:2}.isf-reit:nth-child(4){grid-column:3}
  .isf-reit:nth-child(5){display:none}
  .isf-reit:nth-child(6){grid-column:1}.isf-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .isf-heroT{padding:calc(var(--haus-h,60px) + 16vw) var(--gut) 5.556vw}
  .isf-heroT h1{font-size:min(13.333vw,3.4rem)}
  .isf-rist{padding:2.778vw}
}

/* QUOTE (§1 quote section, §4.6): one centred sentence at the section scale,
   56.6vw wide, image chips at .81em x .72em between the words, and every
   chip cycles its own pictures forever (pause 1.5s, 0.5s mask rise). */
.isf-tilvS{display:flex;justify-content:center}
.isf-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.isf-setning{width:80.078vw}}
@media (max-width:479px){.isf-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.isf-setL{display:block}
.isf-setL span{margin:0 .08em}
.isf-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.isf-bitiM.rund{border-radius:50% !important;width:.78em}
.isf-bitiM img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:translateY(115%);transition:transform .5s var(--ease)}
.isf-bitiM img.nu{transform:none}
.isf-bitiM img.farin{transform:translateY(-115%)}

/* PRODUCT (§5.2 product, §6 swatches): two half-width panels, one viewport
   tall, each a big pack on the element ground with a bottom bar: label and
   pack size, the variant swatches, then Nánar and the bag. Stacks on
   compact, each panel a screen tall less the bar. */
.isf-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.isf-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.isf-spjald:nth-child(2){background:var(--c-el2)}
.isf-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer;border-radius:var(--r);min-height:14rem}
.isf-spjaldM img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:translateY(130%);transition:transform .8s var(--ease)}
.isf-spjaldM img.nu{transform:none}
.isf-spjaldM img.farin{transform:translateY(-130%)}
.isf-spjald:not(.on) .isf-spjaldM img.nu{transform:translateY(130%)}
.isf-root.isf-allt .isf-spjaldM img.nu{transform:none}
.isf-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.isf-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.isf-stika b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.9vw;letter-spacing:-.02em;line-height:1.05}
.isf-stika .isf-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.isf-lit{display:flex;flex-direction:column;gap:.4rem}
.isf-lit div{display:flex;gap:0}
.isf-lit button{width:44px;height:44px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.isf-lit button::before{content:'';width:32px;height:32px;border-radius:50%;background:var(--l) center/cover no-repeat;
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:box-shadow .25s var(--ease)}
.isf-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.isf-takkar{display:flex;gap:.4rem}
.isf-takkar .isf-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .isf-vorur{grid-template-columns:1fr;height:auto}
  .isf-spjald{height:calc(100svh - 10.416vw)}
  .isf-stika b{font-size:3.6vw}
}
@media (max-width:479px){
  .isf-spjald{height:calc(100svh - 22.223vw)}
  .isf-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .isf-stika b{font-size:7vw}
  .isf-takkar{grid-column:1/-1}
  .isf-takkar > *{flex:1}
}

/* ADVANTAGES (§5.2): title, then three cards 31.25vw x 30.625vw, ground by
   position, label top-left, a line centred, index bottom-left. Tablet: a
   swipeable row, one card at a time. Phone: stacked, each card its own
   trigger. */
.isf-kostir{display:flex;flex-direction:column;row-gap:6.4815vh;padding:0 var(--gut)}
.isf-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.isf-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.isf-kort:nth-child(2){background:var(--c-el3)}
.isf-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.25vw}
.isf-kort small{font-size:.8rem;color:var(--c-ink-med)}
.isf-kort h3{margin:0;font-weight:400;text-align:center;font-family:var(--f-disp);font-size:2.08vw;line-height:1.05;letter-spacing:-.02em;padding:0 8%}
.isf-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .isf-kostir{row-gap:2.273vh}
  .isf-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .isf-kortin::-webkit-scrollbar{display:none}
  .isf-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .isf-kort h3{font-size:3.255vw}
}
@media (max-width:479px){
  .isf-kostir{row-gap:3.125vh}
  .isf-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:2.778vw}
  .isf-kort{width:100%;flex:none;height:94.444vw}
  .isf-kort h3{font-size:7.4vw}
  .isf-kort > div{padding:4vw}
}

/* GALLERY (§12 mouse-scroll): a centred headline, then a strip of packs at
   21.1vh x 25.9vh along the bottom. On a mouse: the hovered pack scales
   1.3x from its base and its neighbours slide out of the way, and the strip
   drifts toward the cursor. On touch: a native swipe row. Click opens the
   product. The slowest reveal on the page, 2.44s: the more there is to look
   at, the longer it takes to arrive (§4.4). */
.isf-gal{display:flex;flex-direction:column;row-gap:9.2593vh}
.isf-galT{width:62vw}
.isf-galK{overflow:hidden;padding:4.5vh 0 0}
.isf-galL{display:flex;gap:.7vw;padding:0 var(--gut);list-style:none;margin:0;will-change:transform;width:max-content}
.isf-galL li{width:21.1111vh;height:25.9259vh;flex:none;overflow:hidden}
.isf-galI{display:block;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:var(--c-el2);position:relative;border-radius:var(--r);overflow:hidden;
  transform-origin:50% 100%;transition:transform .6s var(--ease)}
.isf-galI img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:translateY(130%);transition:transform var(--dur,2.44s) var(--ease);transition-delay:var(--d,0s)}
.on .isf-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .isf-galL li{overflow:visible}
  .isf-galL li:hover .isf-galI{transform:scale(1.3)}
  .isf-galL li:hover ~ li .isf-galI{transform:translateX(15%)}
  .isf-galL li:has(~ li:hover) .isf-galI{transform:translateX(-15%)}
}
@media (max-width:991px){
  .isf-gal{row-gap:3.788vh}
  .isf-galT{width:auto;padding:0 var(--gut)}
  .isf-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .isf-galK::-webkit-scrollbar{display:none}
  .isf-galL li{width:14.714vw;height:19.01vw;scroll-snap-align:start}
}
@media (max-width:479px){.isf-gal{row-gap:3.75vh}.isf-galL li{width:34.167vw;height:44.444vw}}

/* FORM (§1 form section, §9 quiz): two tab titles side by side, the idle
   one dimmed; under them one panel on the element ground. The quiz is
   noho's shape: a question, a 2x2 grid of white option fields with a round
   radio, a full-width dark button counting the step. */
.isf-form{padding:0 var(--gut)}
.isf-flipar{display:flex;gap:2.5vw;align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.isf-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:color .4s var(--ease)}
.isf-flipar button[aria-selected="true"]{color:var(--c-ink)}
.isf-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.isf-formP{background:var(--c-el);padding:1.6vw;display:grid;gap:1rem}
.isf-quiz{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:.35rem;align-items:stretch}
.isf-quizQ{margin:0 0 .8rem}
.isf-svar{background:var(--c-form);color:#1E1410;display:flex}
.isf-svarI{padding:1.6vw;display:flex;flex-direction:column;align-items:flex-start;gap:.9rem;width:100%;
  animation:isf-svarinn .45s var(--ease) both}
.isf-svarI.tomt{justify-content:center}
@keyframes isf-svarinn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.isf-svarT{margin:0;font-family:var(--f-disp);font-size:1.6vw;line-height:1.2;letter-spacing:-.015em;max-width:30ch}
.isf-svarI .isf-btn{margin-top:auto}
.isf-lbl{display:block;font-size:.78rem;color:rgba(30,20,16,.6);position:absolute;left:1.04vw;top:.55rem;pointer-events:none}
.isf-reitir input,.isf-reitir textarea{padding-top:1.7rem !important}
@media (prefers-reduced-motion:reduce){.isf-svarI{animation:none}}
.isf-formP > p{margin:0}
.isf-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.isf-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.8vw;
  transition:background .25s var(--ease),color .25s var(--ease);
  padding:0 1.04vw;cursor:pointer;color:#1E1410}
.isf-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #1E1410;margin:0;flex:none;
  transition:box-shadow .2s var(--ease)}
.isf-val input:checked{box-shadow:inset 0 0 0 4px #F6EFE1,inset 0 0 0 9px #1E1410}
.isf-val label span{display:grid;gap:.1rem;padding:.7rem 0}
.isf-val label b{font-weight:500}
.isf-val label small{font-size:.8rem;color:rgba(30,20,16,.6)}
.isf-val label.valid{background:#1E1410;color:#F6EFE1}
.isf-val label.valid small{color:rgba(255,253,248,.7)}
.isf-val label.valid input{border-color:#F6EFE1;box-shadow:inset 0 0 0 4px #1E1410,inset 0 0 0 9px #F6EFE1}
.isf-val label:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:2px}
@media (hover:hover) and (pointer:fine){.isf-val label:not(.valid):hover{background:#EDE0C8}}
.isf-nidur{background:var(--c-form);padding:1.2rem 1.04vw;color:#1E1410;display:grid;gap:.7rem}
.isf-nidur p{margin:0}
.isf-nidur .isf-btn{justify-self:start}
.isf-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.isf-reitir .heild{grid-column:1/-1}
.isf-reitir label{position:relative;display:block}
.isf-reitir input,.isf-reitir textarea{width:100%;border:0;background:var(--c-form);color:#1E1410;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem 1.04vw;min-height:4.063vw;border-radius:0}
.isf-reitir textarea{min-height:8rem;resize:vertical}
.isf-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:background .2s}
.isf-reitir label.gott i{background:#88C159}.isf-reitir label.villa i{background:#DC5B5B}
.isf-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.isf-teymiL div{background:var(--c-form);padding:.8rem 1.04vw;color:#1E1410;font-size:.86rem}
.isf-teymiL b{display:block;font-weight:500}
.isf-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.isf-form{padding:0}.isf-flipar{padding:0 var(--gut)}.isf-formP{max-width:none;padding:2.6vw var(--gut)}
  .isf-val label,.isf-reitir input{min-height:6.51vw}.isf-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:991px){.isf-svarT{font-size:2.9vw}.isf-svarI{padding:2.6vw}.isf-lbl{left:1.6vw}}
/* on a phone the two tab titles would each fill the screen at the section
   scale, so they become a two-part switch the thumb can hit */
@media (max-width:479px){
  .isf-flipar.isf-disp{font-size:1.02rem;letter-spacing:0;line-height:1.2;display:grid;grid-template-columns:1fr 1fr;gap:2px;
    margin:0 var(--gut) .6rem;padding:0;font-family:inherit;font-weight:500}
  .isf-flipar button{min-height:48px;background:var(--c-el);color:var(--c-ink-med);padding:0 .6rem}
  .isf-flipar button[aria-selected="true"]{background:var(--c-btn);color:var(--c-btn-t)}
  .isf-flipar button::before{display:none}
  .isf-quiz{grid-template-columns:1fr}
  .isf-svarT{font-size:5.4vw}
  .isf-svarI{padding:5vw}
  .isf-svarI .isf-btn{width:100%}
  .isf-lbl{left:4vw}
}
@media (max-width:479px){.isf-val,.isf-reitir{grid-template-columns:1fr}.isf-val label,.isf-reitir input{min-height:13.889vw}
  .isf-teymiL{grid-template-columns:1fr}}

/* ABOUT (§5.2 about-us, §6 photo switcher): two cards edge to edge, half the
   width each; a picture and a name at the top, the text beside it, and a
   line of their own words at the foot. Hover swaps the picture behind a mask. */
.isf-um{display:flex;flex-direction:column;row-gap:5.1852vh}
.isf-um > .isf-wrap{width:100%}
.isf-umK{display:flex}
.isf-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.isf-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem 2vw}
.isf-umC:nth-child(2){background:var(--c-el3)}
.isf-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--c-el2);border-radius:50%}
.isf-umM img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.isf-umM img + img{transform:translateY(135%)}
@media (hover:hover) and (pointer:fine){.isf-umC:hover .isf-umM img:first-child{transform:translateY(-135%)}
  .isf-umC:hover .isf-umM img + img{transform:none}}
.isf-umN b{display:block;font-weight:500}
.isf-umN small{color:var(--c-ink-med)}
.isf-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.isf-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:2.08vw;line-height:1.1;letter-spacing:-.02em;max-width:26ch}
@media (max-width:991px){.isf-umC{min-height:52.083vw}.isf-umM{width:14vw}.isf-umQ{font-size:3.255vw}}
@media (max-width:479px){.isf-umK{flex-direction:column}.isf-umC{width:100%;min-height:auto}.isf-umI{grid-template-columns:1fr}
  .isf-umT{grid-column:1;grid-row:auto}.isf-umM{width:30vw}.isf-umQ{font-size:6.4vw}}

/* AWARDS -> the history (§22 big-link): group labels on the left third, the
   rows on the right two thirds with the year right-aligned; hovering a row
   lays the form ground under it and slides the text in 0.8333vw. */
.isf-saga{display:flex;flex-direction:column;row-gap:6.2963vh;padding:0 var(--gut)}
.isf-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.isf-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.isf-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.isf-sagaR span{display:inline-block;padding:.35rem .8333vw;margin-left:-.8333vw;transition:transform .4s var(--ease),background-color 0s}
.isf-sagaR b{font-family:var(--f-disp);font-weight:400;font-size:2.08vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.isf-sagaR:hover span{background:var(--c-form);color:#1E1410;transform:translateX(.8333vw)}}
@media (max-width:991px){.isf-sagaR b{font-size:3.255vw}}
@media (max-width:479px){.isf-sagaH{grid-template-columns:1fr}.isf-sagaR b{font-size:6.4vw}}

/* BLOG -> the lines (§14): desktop pins the section for 400% of a viewport
   and staggers the cards left, each coming to rest 20% short of the last so
   they stack. Compact: a plain swipe row. Cards 44.17vw x 24.74vw, grounds
   cycling third/second/first. */
.isf-linur{position:relative}
.isf-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:6.2963vh;overflow:hidden}
.isf-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.isf-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.isf-lina2:nth-child(3n+2){background:var(--c-el2)}.isf-lina2:nth-child(3n+3){background:var(--c-el)}
.isf-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.isf-lina2 figure img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.isf-lina2:hover figure img{transform:scale(1.06)}}
.isf-lina2 > div{display:flex;flex-direction:column;padding:1.25vw;gap:.6rem}
.isf-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:400;font-size:2.08vw;line-height:1.05;letter-spacing:-.02em}
.isf-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.isf-lina2 .isf-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .isf-linur{height:auto !important}
  .isf-linurP{position:relative;height:auto;overflow:visible}
  .isf-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .isf-linurL::-webkit-scrollbar{display:none}
  .isf-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .isf-lina2 h3{font-size:3.255vw}
}
@media (max-width:479px){.isf-lina2{width:83.333vw;height:111.111vw}.isf-lina2 h3{font-size:7vw}.isf-lina2 > div{padding:4vw}}

/* SUSTAINABILITY -> their own words (§20): a centred statement, then a row
   with a line and a button whose hover opens a clipped picture strip from
   width 0. */
.isf-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:4.4444vh;padding:0 var(--gut)}
.isf-yfirl .isf-sub{width:min(58vw,60rem);text-align:center}
/* contain: the hover strip animates width (noho's signature reveal, kept);
   containment keeps that layout work inside this one row */
.isf-panta{display:flex;align-items:center;gap:2.5vw;contain:layout}
.isf-panta p{margin:0;max-width:24ch;font-size:.92rem}
.isf-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:width .5s var(--ease);height:max(3vw,44px)}
.isf-pantaM img{height:100%;width:auto;max-width:none}
@media (hover:hover) and (pointer:fine){.isf-panta:has(.isf-btn:hover) .isf-pantaM{width:var(--bw,10rem)}}
@media (max-width:991px){.isf-yfirl .isf-sub{width:80vw}.isf-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.isf-yfirl{align-items:flex-start}.isf-yfirl .isf-sub{width:auto;text-align:left}
  .isf-panta{align-items:flex-start;text-align:left}}

/* FAQ (§11, §5.2): a sticky card on the left, 46.875vw x 79.44vh, with the
   title and a pack you can swap; single-open accordion rows on the right,
   white, with a plus that turns 45 degrees. Height 0.32s on custom-our; the
   answer fades in at half-way, the one fade the reference itself uses. */
.isf-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.isf-faqK{position:sticky;top:var(--gut);height:79.4444vh;background:var(--c-el);display:flex;flex-direction:column;
  justify-content:space-between;padding:1.25vw;overflow:hidden}
.isf-faqM{position:relative;flex:1;overflow:hidden}
.isf-faqM img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:calc(var(--r) - 4px);
  transform:translateY(135%);transition:transform .8s var(--ease)}
.isf-faqM img.nu{transform:none}.isf-faqM img.farin{transform:translateY(-135%)}
.isf-faqT{display:flex;justify-content:space-between;gap:.5rem}
.isf-faqL{display:grid;gap:.35rem}
.isf-faqR{background:var(--c-form);color:#1E1410}
.isf-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 1.04vw;min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.isf-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(30,20,16,.08)}
.isf-faqR button svg{transition:transform .32s var(--ease)}
.isf-faqR.opid button svg{transform:rotate(45deg)}
.isf-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s var(--ease)}
.isf-faqR.opid .isf-faqB{grid-template-rows:1fr}
.isf-faqB > div{overflow:hidden}
.isf-faqB p{margin:0;padding:0 1.04vw 1.1rem;max-width:60ch;opacity:0;transition:opacity .16s var(--ease)}
.isf-faqR.opid .isf-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.isf-faq{grid-template-columns:46.094vw 1fr}.isf-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.isf-faqT{display:grid;grid-template-columns:1fr 1fr}.isf-faq{grid-template-columns:1fr}.isf-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:9.375vh}}

/* FOOTER (§18, §19, §4.5): on desktop and tablet the footer sits in a mask
   and is pulled from yPercent -100 to 0 as the mask scrolls in, scrubbed, a
   curtain rather than a block arriving. Its last line is the slogan, split
   to letters that rise as a wave against the same scroll, and once it has
   landed the pointer paints the letters it passes in the pack colours.
   Katla's oval sits above it as the statement piece; the ground is the
   red of the oval rather than noho's tan (declared). */
.isf-fotM{position:relative;overflow:hidden}
.isf-fot{background:#1B1210;color:#F6EFE1;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.isf-fotRod{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;font-size:.86rem;line-height:1.7}
.isf-fotRod > div{display:flex;gap:4vw;flex-wrap:wrap}
.isf-fotRod small{display:block;opacity:.7;font-size:.78rem}
.isf-fot a{text-decoration:none;display:inline-flex;min-height:28px;align-items:center}
@media (hover:hover) and (pointer:fine){.isf-fot a:hover{text-decoration:underline;text-underline-offset:3px}}
.isf-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:flex-start}
.isf-fotMerki{width:clamp(5.5rem,9vw,8.5rem);margin:8.1481vh auto 4vh}
.isf-fotMerki img{width:100%;height:auto}
.isf-slogan{font-family:var(--f-disp);font-weight:400;font-size:8.1vw;line-height:1;letter-spacing:-.03em;
  white-space:nowrap;text-align:center;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.isf-slogan span{display:inline-block;will-change:transform;transition:color .18s ease-out}
.isf-slogan span > span{display:inline-block;transition:transform .28s ease-out}
.isf-fotBot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;opacity:.8}
@media (max-width:479px){.isf-fotRod > div{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1rem}.isf-slogan{font-size:7.6vw}}

/* ---------------------------------------------------------------
   THE 10% (Sindri 2026-09-28: "90% website 10% difference in ui").
   Structure, rhythm, motion and every mechanism are the Góa/noho build;
   these are the deliberate departures, all from Ísfugl's own objects:
   1. Alpino Bold for display (in ui.tsx) and Author for text;
   2. kraft paper for the ground and its three steps, their brand red as the
      only accent, a near-black footer like their current site;
   3. round things: the farm badges (their "Frá fjölskyldubúinu" campaign),
      the swatches, the About pictures, the plates that fall; soft corners on
      everything you pick up, pill buttons;
   4. full-bleed photographs instead of packshots on a colour ground;
   5. the hero scatter reshuffled (Katla's mirror), a hanging logo tag.
   --------------------------------------------------------------- */
.isf-root{--r:clamp(12px,1.1vw,20px)}
.isf-kort,.isf-formP,.isf-svar,.isf-val label,.isf-nidur,.isf-teymiL div,
.isf-reitir input,.isf-reitir textarea,.isf-lina2,.isf-lina2 figure,.isf-faqK,.isf-faqR{border-radius:var(--r)}
.isf-lina2 figure{border-radius:var(--r) 0 0 var(--r)}
@media (max-width:991px){.isf-lina2 figure{border-radius:var(--r) var(--r) 0 0}}
.isf-bitiM{border-radius:.16em}
.isf-magn,.isf-tegund,.isf-reitur input,.isf-reitur textarea,.isf-kvittun,.isf-pokiH b{border-radius:var(--r)}
.isf-btn,.isf-hnappur,.isf-sett,.isf-haus .isf-pokiH,.isf-braud{border-radius:999px}
.isf-faqR{overflow:hidden}
.isf-disp{letter-spacing:-.025em}
/* seven varieties of chicken and single long words ("Kryddaður í ofn"): the
   swatches wrap five to a row, and below 1280 the buttons take their own row so
   the name keeps its room. */
.isf-lit div{flex-wrap:wrap;max-width:230px}
@media (max-width:1600px){.isf-stika{grid-template-columns:minmax(0,1fr) auto}.isf-takkar{grid-column:1/-1}}
@media (min-width:992px){
  .isf-reit:nth-child(1){grid-area:1/2/2/3}.isf-reit:nth-child(2){grid-area:1/4/2/5}
  .isf-reit:nth-child(3){grid-area:2/1/3/2}.isf-reit:nth-child(4){grid-area:2/3/3/4}
  .isf-reit:nth-child(5){grid-area:3/2/4/3}.isf-reit:nth-child(6){grid-area:3/3/4/4}
  .isf-reit:nth-child(7){grid-area:2/2/3/3}
}


/* FARMS (new section, "Hvaðan er fuglinn þinn?"): the promise printed on the
   pack, made answerable. Four round badges on the pattern of their own
   "Frá fjölskyldubúinu" campaign choose one panel: a photograph that rises in
   on the page's own ease, the family's words, and the numbers printed on that
   farm's own page. Compact: badges in one row of four, panel stacked. */
.isf-baendur{padding:0 var(--gut);display:grid;gap:1.6rem}
.isf-baendurH{display:grid;gap:1rem;max-width:62rem}
.isf-baendurH .isf-brod{max-width:46ch}
.isf-baendurV{display:flex;gap:clamp(.4rem,1.2vw,1.2rem);flex-wrap:wrap;align-items:center}
.isf-medBtn{width:clamp(76px,9vw,140px);aspect-ratio:1;border:0;padding:0;background:none;cursor:pointer;border-radius:50%;flex:none;
  transition:transform .55s var(--ease),filter .4s var(--ease)}
.isf-medBtn img{width:100%;height:100%;display:block;border-radius:50%}
.isf-medBtn[aria-selected="false"]{transform:scale(.84);filter:saturate(.5) brightness(.96)}
.isf-medBtn[aria-selected="true"]{transform:scale(1)}
@media (hover:hover) and (pointer:fine){.isf-medBtn[aria-selected="false"]:hover{transform:scale(.92);filter:none}}
.isf-baendurP{display:grid;grid-template-columns:1.2fr 1fr;gap:var(--col);min-height:min(80svh,54rem)}
.isf-baendurM{position:relative;overflow:hidden;border-radius:var(--r);background:var(--c-el2);min-height:24rem}
.isf-baendurM .foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:translateY(105%);transition:transform .9s var(--ease)}
.isf-baendurM .foto.nu{transform:none}
.isf-baendurM .foto.farin{transform:translateY(-105%)}
.isf-baendurMed{position:absolute;left:4%;bottom:4%;width:clamp(120px,24%,220px);height:auto;filter:drop-shadow(0 12px 18px rgba(30,20,16,.4));
  transform:rotate(-5deg);animation:isf-medinn .9s var(--ease) both}
@keyframes isf-medinn{from{transform:translateY(70%) rotate(-16deg) scale(.8)}to{transform:rotate(-5deg)}}
.isf-baendurT{background:var(--c-el);border-radius:var(--r);padding:clamp(1.2rem,2.4vw,2.6rem);display:flex;flex-direction:column;gap:1rem;
  animation:isf-svarinn .5s var(--ease) both}
.isf-baendurT .isf-sub{font-size:3.4vw}
.isf-baendurQ{margin:0;font-family:var(--f-disp);font-size:1.6vw;line-height:1.2;letter-spacing:-.015em;max-width:26ch}
.isf-tolur{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin:.2rem 0}
.isf-tolur div{background:var(--c-form);border-radius:calc(var(--r) - 4px);padding:.7rem .9rem;display:flex;flex-direction:column-reverse;gap:.1rem}
.isf-tolur dt{font-size:.8rem;color:var(--c-ink-med)}
.isf-tolur dd{margin:0;font-family:var(--f-disp);font-size:1.7vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.isf-baendurT .isf-takkar{margin-top:auto;padding-top:.6rem}
@media (max-width:991px){
  .isf-baendurP{grid-template-columns:1fr}
  .isf-baendurM{min-height:0;aspect-ratio:4/3}
  .isf-baendurT .isf-sub{font-size:6vw}.isf-baendurQ{font-size:3.4vw;max-width:34ch}.isf-tolur dd{font-size:3.6vw}
}
@media (max-width:479px){
  .isf-baendurV{flex-wrap:nowrap;gap:.3rem}
  .isf-medBtn{width:calc((100% - 1rem) / 4);flex:none}
  .isf-baendurT .isf-sub{font-size:max(1.7rem,8vw)}.isf-baendurQ{font-size:5.4vw}.isf-tolur dd{font-size:6.4vw}
}
@media (prefers-reduced-motion:reduce){.isf-baendurMed{animation:none}}

/* STOCKISTS (new section, "Hvar færðu Ísfugl?"): their kraft-paper map, and
   their list of stores by region. Sticky map on desktop; one column on a phone. */
.isf-sol{display:flex;flex-direction:column;row-gap:6.4815vh}
.isf-solP{display:grid;grid-template-columns:1fr 1.05fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.isf-solK{background:var(--c-el);border-radius:var(--r);padding:clamp(1rem,2vw,2rem);position:sticky;top:calc(var(--haus-h,90px) + 1rem)}
.isf-solK img{width:100%;height:auto;mix-blend-mode:multiply}
.isf-solL{background:var(--c-form);border-radius:var(--r);padding:clamp(1rem,1.8vw,2rem)}
.isf-solT{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:1rem}
.isf-solT button{border:0;cursor:pointer;min-height:44px;padding:0 1rem;border-radius:999px;background:var(--c-el);color:var(--c-ink);font-weight:500;
  font-size:.9rem;display:inline-flex;gap:.5rem;align-items:center;transition:background .2s var(--ease),color .2s var(--ease)}
.isf-solT button i{font-style:normal;font-size:.78rem;opacity:.65;font-variant-numeric:tabular-nums}
.isf-solT button[aria-selected="true"]{background:var(--c-ink);color:var(--c-bg)}
.isf-solV{list-style:none;margin:0;padding:0;columns:2;column-gap:1.4rem}
.isf-solV li{break-inside:avoid;padding:.45rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);display:flex;flex-direction:column;animation:isf-svarinn .4s var(--ease) both}
.isf-solV b{font-weight:600}
.isf-solV span{color:var(--c-ink-med);font-size:.9rem}
@media (max-width:991px){.isf-solP{grid-template-columns:1fr}.isf-solK{position:static}}
@media (max-width:479px){.isf-solV{columns:1}}

/* The three quality cards each carry the photograph of their own claim, in a
   round mask like the farm badges. */
.isf-kortM{display:flex;flex-direction:column;align-items:center;gap:clamp(.8rem,1.6vw,1.6rem)}
.isf-kortM img{width:min(44%,13rem);aspect-ratio:1;object-fit:cover;border-radius:50%;background:var(--c-el2)}
.isf-kortM img[src*="/m/"]{background:none}
@media (max-width:479px){.isf-kortM img{width:min(40%,9rem)}}
.isf-solK img{mix-blend-mode:normal}
@media (max-width:479px){.isf-setL span{margin:0}}

`

/* Arrow keys move between tabs, as on a native tab bar */
function orvar(e: { key: string; currentTarget: HTMLElement }) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  const tabs = [...(e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])]
  const n = tabs[(tabs.indexOf(e.currentTarget) + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
  n?.focus(); n?.click()
}

/* ---------------------------------------------------------------- *
 * Sections
 * ---------------------------------------------------------------- */

function Hero() {
  return (
    <div className="isf-heroP">
      <section className="isf-hero" id="top">
        <Reveal className="isf-heroT">
          <div>
            <Merki>Ísfugl · Reykjavegi 36, Mosfellsbæ</Merki>
            <h1 className="isf-disp">
              {TEXTI.heroLinur.map((l, i) => (
                <span className="isf-mask" key={l}><span className="isf-up isf-lina" style={step(i)}>{l}</span></span>
              ))}
              <span className="isf-mask">
                <span className="isf-up isf-lina isf-heroAr" style={step(TEXTI.heroLinur.length)}>{TEXTI.heroAr}</span>
              </span>
            </h1>
          </div>
          <p className="isf-heroSlag isf-mask isf-maskP">
            <span className="isf-up" style={{ ...step(4), ['--dur' as string]: '.75s' }}>{TEXTI.heroUndir}</span>
          </p>
        </Reveal>
        <Reveal className="isf-rist">
          {HERO_REITIR.map((r, i) => (
            <figure className="isf-reit isf-mask" key={r.img}>
              <div className="isf-up" style={step(i)}>
                <img className="foto" src={ph(r.img)} alt={r.n} width={800} height={534} style={{ objectPosition: r.pos }}
                  loading={i < 4 ? 'eager' : 'lazy'} decoding="async" fetchPriority={i < 2 ? 'high' : undefined} />
                {r.medal ? <img className="med" src={S(`m/${r.medal}`)} alt="" width={640} height={640} loading="lazy" decoding="async" /> : null}
              </div>
            </figure>
          ))}
        </Reveal>
      </section>
    </div>
  )
}

/** A chip that cycles its own pictures forever: pause 1.5s, 0.5s rise. */
function Biti({ n, grunnur, b, hlid }: { n: string; grunnur: string; b?: number; hlid: number }) {
  const myndir = SETNING_HRINGUR[n] ?? []
  const [k, setK] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (myndir.length < 2 || reduced()) return
    let t = 0
    let synilegt = false
    /* cycle only while the sentence is on screen: off screen it used to keep
       swapping pictures (and restyling) for the life of the page */
    const io = new IntersectionObserver(([e]) => { synilegt = e.isIntersecting })
    if (ref.current) io.observe(ref.current)
    const start = window.setTimeout(() => {
      t = window.setInterval(() => {
        if (!synilegt) return
        setK((v) => (v + 1) % myndir.length)
      }, 2000)
    }, 700 * hlid)
    return () => { window.clearTimeout(start); window.clearInterval(t); io.disconnect() }
  }, [myndir.length, hlid])
  const fyrri = (k - 1 + myndir.length) % myndir.length
  return (
    <span className={`isf-bitiM${myndir[0]?.startsWith('m/') ? ' rund' : ''}`} ref={ref} style={{ '--grunnur': grunnur, '--b': b ?? 1 } as CSSProperties}>
      {myndir.map((m, i) => (
        <img key={m} src={S(m)} alt={i === k ? n : ''} width={120} height={106} loading="lazy" decoding="async"
          className={i === k ? 'nu' : i === fyrri && myndir.length > 1 ? 'farin' : ''}
          style={i !== k && i !== fyrri ? { transition: 'none' } : undefined} />
      ))}
    </span>
  )
}

function Tilvitnun() {
  let chip = 0
  return (
    <section className="isf-tilvS" aria-label="Ísfugl í einni setningu">
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="isf-disp isf-setning">
          {SETNING.map((lina, li) => (
            <span className="isf-mask isf-setL" key={li}>
              <span className="isf-up isf-lina" style={{ ...step(li), ['--dur' as string]: '1.36s' }}>
                {lina.map((b, i) =>
                  't' in b ? <span key={i}>{b.t}</span> : <Biti key={i} n={b.n} grunnur={b.ground} b={b.b} hlid={chip++} />,
                )}
              </span>
            </span>
          ))}
        </h2>
      </Reveal>
    </section>
  )
}

const VARA_LINA = (heiti: string) => {
  const v = VORUR.find((x) => x.n === heiti)
  if (!v || v.kkal == null) return 'Næringargildi í 100 g: ekki gefið upp'
  return `${v.kkal} kkal · ${String(v.prot ?? '').replace('.', ',')} g prótein í 100 g`
}

function Spjald({ s, i }: { s: (typeof SPJOLD)[number]; i: number }) {
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  const v = s.tegundir[k]
  return (
    <Reveal className="isf-spjald" as="article">
      <div className="isf-spjaldM" data-bendill="Skoða" onClick={() => pop.open({ k: 'vara', n: v.vara })}>
        {s.tegundir.map((t, j) => (
          <img key={t.mynd} src={S(`c/${t.mynd}`)} alt={j === k ? `${t.vara}, sviðsett mynd` : ''} width={900} height={1125} loading="lazy" decoding="async"
            className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
            style={j !== k && j !== fyrri ? { transition: 'none' } : { transitionDelay: fyrri < 0 ? `${0.12 * i}s` : '0s' }} />
        ))}
      </div>
      <div className="isf-stika">
        <div>
          <small>{s.merki}</small>
          <b>{v.n}</b>
          <span className="isf-pk">{VARA_LINA(v.vara)}</span>
        </div>
        <div className="isf-lit">
          <small>Skurður</small>
          <div role="group" aria-label={`Skurðir af ${s.titill.toLowerCase()}`}>
            {s.tegundir.map((t, j) => (
              <button key={t.mynd} aria-pressed={j === k} aria-label={t.n} style={{ ['--l' as string]: `url(${S(`ct/${t.mynd}`)})` }}
                onClick={() => { if (j !== k) { setFyrri(k); setK(j) } }} />
            ))}
          </div>
        </div>
        <div className="isf-takkar">
          <button className="isf-btn sc isf-casH" onClick={() => pop.open({ k: 'vara', n: v.vara })}><Cas t="Nánar" /></button>
          <button className="isf-btn isf-casH" onClick={() => pop.open({ k: 'hopur', s: s.fugl === 'kalkunn' ? 'hakk' : 'bringur', fugl: s.fugl })}><Cas t="Uppskriftir" /></button>
        </div>
      </div>
    </Reveal>
  )
}

function Vorur() {
  return (
    <section className="isf-vorur" id="vorur" aria-label="Vörur">
      {SPJOLD.map((s, i) => <Spjald key={s.titill} s={s} i={i} />)}
    </section>
  )
}

/* The farm lookup: the one thing on the pack that the site can answer. Four round
   badges (the pattern of their own "Frá fjölskyldubúinu" campaign), one panel. */
function Baendur() {
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  const b = BAEIR[k]
  const velja = (j: number) => { if (j !== k) { setFyrri(k); setK(j) } }
  return (
    <section className="isf-baendur" id="baendur" aria-labelledby="isf-baendur-t">
      <Reveal className="isf-baendurH">
        <Ord id="isf-baendur-t" className="isf-disp" text="Hvaðan er | fuglinn þinn?" />
        <p className="isf-brod">Nafn búsins stendur á umbúðunum. Veldu það hér til að sjá fjölskylduna sem ræktaði fuglinn.</p>
      </Reveal>
      <div className="isf-baendurV" role="tablist" aria-label="Búin fjögur">
        {BAEIR.map((x, j) => (
          <button key={x.id} role="tab" id={`isf-b-${x.id}`} aria-controls="isf-baendurP" aria-selected={j === k}
            className="isf-medBtn" onClick={() => velja(j)} data-bendill={x.n}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const n = (j + (e.key === 'ArrowRight' ? 1 : BAEIR.length - 1)) % BAEIR.length
                velja(n); document.getElementById(`isf-b-${BAEIR[n].id}`)?.focus()
              }
            }}>
            <img src={S(`m/${x.medal}`)} alt={`Frá bænum ${x.n}`} width={640} height={640} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <div className="isf-baendurP" id="isf-baendurP" role="tabpanel" aria-labelledby={`isf-b-${b.id}`}>
        <div className="isf-baendurM">
          {BAEIR.map((x, j) => (
            <img key={x.id} className={`foto${j === k ? ' nu' : j === fyrri ? ' farin' : ''}`} src={ph(x.mynd)} alt={j === k ? `${x.n}, ${x.stadur}` : ''}
              width={1600} height={1067} loading="lazy" decoding="async"
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
          <img key={`m-${b.id}`} className="isf-baendurMed" src={S(`m/${b.medal}`)} alt="" width={640} height={640} decoding="async" />
        </div>
        <div className="isf-baendurT" key={b.id} aria-live="polite">
          <p className="isf-merki" style={{ margin: 0 }}>{b.stadur}</p>
          <h3 className="isf-sub">{b.n}</h3>
          <p className="isf-baendurQ">{b.fyrirsogn}</p>
          <p className="isf-brod">{b.texti}</p>
          <dl className="isf-tolur">
            {b.tolur.map(([n, t]) => (<div key={t}><dt>{t}</dt><dd>{n}</dd></div>))}
          </dl>
          <p className="isf-smatt" style={{ margin: 0 }}>{b.vidbot}</p>
          <div className="isf-takkar">
            <button className="isf-btn isf-casH" onClick={() => pop.open({ k: 'bar', id: b.id })}><Cas t="Sjá bæinn" /></button>
            <a className="isf-btn sc isf-casH" href={b.hlekkur} target="_blank" rel="noopener"><Cas t="Á isfugl.is" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Kostir() {
  return (
    <section className="isf-kostir">
      <Reveal><Ord className="isf-disp" text="Gæðin byrja | á bænum" /></Reveal>
      <Reveal className="isf-kortin" hver>
        {KORT3.map((k, i) => (
          <div className="isf-kort isf-mask" key={k.nr}>
            <div className="isf-up" style={{ ...step(i), ['--dur' as string]: '1.24s' }}>
              <small>{k.m}</small>
              <div className="isf-kortM"><img src={S(k.img)} alt="" width={320} height={320} loading="lazy" decoding="async" /><h3>{k.t}</h3></div>
              <i>{k.nr}</i>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Galleri() {
  return (
    <section className="isf-gal" aria-labelledby="isf-gal-t">
      <Reveal className="isf-galT isf-midja" margin="0px 0px -40% 0px">
        <Ord id="isf-gal-t" className="isf-disp" text={"Af bæjunum, úr húsunum | og úr sláturhúsinu"} />
      </Reveal>
      <div className="isf-galK">
        <Reveal as="ul" className="isf-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.img}>
              <button className="isf-galI" style={{ ['--d' as string]: `${(i * 0.06).toFixed(2)}s` }}
                data-bendill="Skoða" aria-label={`${g.n}, stærri mynd`}
                onClick={() => pop.open({ k: 'mynd', img: g.img, n: g.n, kafli: g.k })}>
                <img src={ph(`ph/${g.img}`)} alt="" width={800} height={534} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* idle drift toward the cursor (§12: 3s power3.out). Reveal owns the list's
   ref, so the drift finds the strip by selector. */
function GalleriDrift() {
  useEffect(() => {
    const k = document.querySelector<HTMLElement>('.isf-galK')
    const l = document.querySelector<HTMLElement>('.isf-galL')
    if (!k || !l || isCompact() || reduced()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let tx = 0, cx = 0, raf = 0
    const tick = () => { cx += (tx - cx) * 0.045; l.style.transform = `translate3d(${cx.toFixed(1)}px,0,0)`; raf = Math.abs(tx - cx) > 0.3 ? requestAnimationFrame(tick) : 0 }
    const move = (e: MouseEvent) => {
      const r = k.getBoundingClientRect()
      const max = Math.max(0, l.scrollWidth - r.width)
      tx = -Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * max
      if (!raf) raf = requestAnimationFrame(tick)
    }
    k.addEventListener('mousemove', move)
    return () => { k.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return null
}

type Leid = (typeof ERINDI)[number]
function Form() {
  const [flipi, setFlipi] = useState<'quiz' | 'spyrja'>('quiz')
  const [val, setVal] = useState<number | null>(null)
  const [gildi, setGildi] = useState({ nafn: '', netfang: '', skilabod: '' })
  const [sent, setSent] = useState(false)
  const [snert, setSnert] = useState<Record<string, boolean>>({})
  const gott = {
    nafn: gildi.nafn.trim().length > 1,
    netfang: /^\S+@\S+\.\S+$/.test(gildi.netfang),
    skilabod: gildi.skilabod.trim().length > 4,
  }
  const lbl = (k: keyof typeof gott) => (snert[k] ? (gott[k] ? 'gott' : 'villa') : '')
  const leid: Leid | null = val === null ? null : ERINDI[val]
  const senda = (e: FormEvent) => {
    e.preventDefault()
    setSnert({ nafn: true, netfang: true, skilabod: true })
    if (gott.nafn && gott.netfang && gott.skilabod) setSent(true)
  }
  return (
    <section className="isf-form" id="erindi">
      <div className="isf-flipar isf-disp" role="tablist" aria-label="Hafa samband">
        <button role="tab" id="isf-t1" aria-controls="isf-tp" aria-selected={flipi === 'quiz'} onClick={() => setFlipi('quiz')} onKeyDown={orvar}>Hvert er erindið?</button>
        <button role="tab" id="isf-t2" aria-controls="isf-tp" aria-selected={flipi === 'spyrja'} onClick={() => setFlipi('spyrja')} onKeyDown={orvar}>Senda fyrirspurn</button>
      </div>
      <Reveal className="isf-formP isf-mask" margin="0px 0px -20% 0px">
        <div className="isf-up" id="isf-tp" role="tabpanel" aria-labelledby={flipi === 'quiz' ? 'isf-t1' : 'isf-t2'} style={{ display: 'grid', gap: '1rem' }}>
          {flipi === 'quiz' ? (
            /* one step: choosing an errand shows its answer and its action at
               once, beside the choices on desktop and right under them on a
               phone. No disabled Next button and no second screen to go back
               from. */
            <div className="isf-quiz">
              <div>
                <p className="isf-quizQ" id="isf-quiz-q">Hvern viltu ná í?</p>
                <div className="isf-val" role="radiogroup" aria-labelledby="isf-quiz-q">
                  {ERINDI.map((e, i) => (
                    <label key={e.nafn} className={val === i ? 'valid' : ''}>
                      <span><b>{e.nafn}</b><small>{STUTT[i]}</small></span>
                      <input type="radio" name="isf-erindi" checked={val === i} onChange={() => setVal(i)} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="isf-svar" aria-live="polite">
                {leid ? (
                  <div className="isf-svarI" key={leid.nafn}>
                    <p className="isf-merki" style={{ margin: 0, color: 'rgba(30,20,16,.64)' }}>{leid.nafn}</p>
                    <p className="isf-svarT">{leid.nota}</p>
                    <button className="isf-btn isf-casH" onClick={() => { window.location.href = leid.hlekkur }}><Cas t={leid.ord} /></button>
                    <a className="isf-nobg" style={{ color: '#1E1410' }} href={`tel:+354${leid.sima.replace(/\s/g, '')}`}>Sími {leid.sima} <i>→</i></a>
                  </div>
                ) : (
                  <div className="isf-svarI tomt">
                    <p className="isf-svarT">Veldu erindi og þú sérð strax hver svarar.</p>
                    <p className="isf-smatt" style={{ color: 'rgba(30,20,16,.64)', margin: 0 }}>Sími {FYRIRTAEKI.simi} · {FYRIRTAEKI.netfang}</p>
                  </div>
                )}
              </div>
            </div>
          ) : sent ? (
            <div className="isf-nidur">
              <p>Takk, {gildi.nafn.split(' ')[0]}. Svona berst fyrirspurnin á {FYRIRTAEKI.netfang}.</p>
              <p className="isf-smatt" style={{ color: 'rgba(30,20,16,.64)' }}>Þetta er frumgerð og ekkert var sent.</p>
              <button className="isf-btn sc isf-casH" onClick={() => { setSent(false); setGildi({ nafn: '', netfang: '', skilabod: '' }); setSnert({}) }}><Cas t="Ný fyrirspurn" /></button>
            </div>
          ) : (
            <form onSubmit={senda} noValidate style={{ display: 'grid', gap: '.35rem' }}>
              <div className="isf-reitir">
                <label className={lbl('nafn')}>
                  <span className="isf-lbl">Nafn</span>
                  <input autoComplete="name" value={gildi.nafn} onBlur={() => setSnert((s) => ({ ...s, nafn: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, nafn: e.target.value }))} /><i />
                </label>
                <label className={lbl('netfang')}>
                  <span className="isf-lbl">Netfang</span>
                  <input type="email" autoComplete="email" value={gildi.netfang} onBlur={() => setSnert((s) => ({ ...s, netfang: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, netfang: e.target.value }))} /><i />
                </label>
                <label className={`heild ${lbl('skilabod')}`}>
                  <span className="isf-lbl">Skilaboð</span>
                  <textarea value={gildi.skilabod} onBlur={() => setSnert((s) => ({ ...s, skilabod: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, skilabod: e.target.value }))} /><i />
                </label>
              </div>
              <button type="submit" className="isf-btn stor isf-casH"><Cas t="Senda fyrirspurn" /></button>
              <div className="isf-teymiL">
                {TEYMI.map((t) => (
                  <div key={t.nafn}><b>{t.nafn}</b>{t.hlutverk}<br />{t.netfang ? <a href={`mailto:${t.netfang}`}>{t.netfang}</a> : null}</div>
                ))}
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  )
}

function Um() {
  const kort = [
    { n: 'Ísfugl', m: 'Sláturhús og kjötvinnsla í Mosfellsbæ', a: 'u-gamla', b: 'u-fjolskylda',
      t: 'Ísfugl vinnur og selur eingöngu íslenska kjúklinga og kalkúna frá Ísfuglsbændum. Vörurnar eru seldar til verslana, veitingastaða og mötuneyta.',
      q: '„Við leggjum áherslu á að gæði, hollusta og ferskleiki skili sér á disk neytandans.“' },
    { n: 'Bændurnir', m: 'Fjölskyldubú í Ölfusi, Mosfellsbæ og Þingvallasveit', a: 'u-baendur', b: 'h-neslaekur',
      t: 'Bændurnir leggja inn kjúklinga og kalkúna til Ísfugls. Þeir nota engin fúkkalyf og starfa samkvæmt gæðahandbók sem er uppfærð reglulega.',
      q: '„Þú sérð frá hvaða Ísfuglsbónda kjötið þitt kemur!“' },
  ]
  return (
    <section className="isf-um" id="um" aria-labelledby="isf-um-t">
      <Reveal className="isf-wrap"><Ord id="isf-um-t" className="isf-disp" text="Nokkur orð | um Ísfugl" /></Reveal>
      <Reveal className="isf-umK" hver margin="0px 0px -20% 0px">
        {kort.map((k, i) => (
          <article className="isf-umC isf-mask" key={k.n}>
            <div className="isf-up isf-umI" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              <div className="isf-umM"><img src={ph(`ph/${k.a}`)} alt="" width={300} height={300} loading="lazy" /><img src={ph(`ph/${k.b}`)} alt="" width={300} height={300} loading="lazy" /></div>
              <p className="isf-umT">{k.t}</p>
              <div className="isf-umN"><b>{k.n}</b><small>{k.m}</small></div>
              <p className="isf-umQ">{k.q}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

function Saga() {
  return (
    <section className="isf-saga" id="saga">
      <Reveal><Ord className="isf-disp" text="Sagan" /></Reveal>
      <Reveal hver>
        {SOGUHOPAR.map((h, i) => (
          <div className="isf-sagaH isf-mask" key={h.h}>
            <p className="isf-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>{h.h}</p>
            <div className="isf-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              {h.r.map((r) => (
                <div className="isf-sagaR" key={r.t}><span>{r.t}</span>{r.a ? <b>{r.a}</b> : <b aria-hidden="true" />}</div>
              ))}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* The pin: 400% of a viewport of scroll while the cards stagger left (§14).
   Card t (t >= 1) travels -0.8 x its width x t during timeline time [t-1, t],
   so each one comes to rest overlapping the last by 80%. */
function Uppskriftir() {
  const PIN = 4
  const ref = useFramvinda((el) => {
    const l = el.querySelector<HTMLElement>('.isf-linurL')
    if (!l) return
    const cards = [...l.children] as HTMLElement[]
    if (isCompact()) { cards.forEach((c) => { c.style.transform = '' }); return }
    const r = el.getBoundingClientRect()
    const total = r.height - window.innerHeight
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)))
    const n = cards.length
    const T = p * (n - 1)
    const w = cards[0]?.offsetWidth ?? 0
    const last = cards[n - 1]
    const room = l.clientWidth - (last ? last.offsetLeft + w : 0)
    cards.forEach((c, t) => {
      if (t === 0) { c.style.transform = ''; return }
      const k = Math.min(1, Math.max(0, T - (t - 1)))
      let x = -w * 0.8 * t * k
      /* the last card lands flush with the right edge rather than overshooting */
      if (t === n - 1) x = Math.max(x, room * k - w * 0.2 * k)
      c.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
    })
  })
  return (
    <section className="isf-linur" id="uppskriftir" ref={ref} style={{ height: `calc(100svh + ${PIN * 100}svh)` }}>
      <div className="isf-linurP">
        <Reveal className="isf-wrap"><Ord className="isf-disp" text="Uppskriftir" /></Reveal>
        <div className="isf-linurL">
          {HOPAR.map((h) => {
            const fj = UPPSKRIFTIR.filter((u) => u.hopur === h.s).length
            return (
              <button className="isf-lina2" key={h.s} data-bendill="Opna" style={{ ['--g' as string]: h.g }}
                onClick={() => pop.open({ k: 'hopur', s: h.s })}>
                <figure><img src={S(`r/${h.cover}`)} alt="" width={1100} height={733} loading="lazy" /></figure>
                <div>
                  <h3>{h.t}</h3>
                  <p>{h.d}</p>
                  <span className="isf-lf"><span>{fj} uppskriftir</span><span>Skoða ↗</span></span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Yfirlysing() {
  const mynd = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    const im = mynd.current
    if (!im) return
    const set = () => im.parentElement?.style.setProperty('--bw', `${im.offsetWidth || 160}px`)
    if (im.complete) set(); else im.addEventListener('load', set, { once: true })
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
  return (
    <section className="isf-yfirl" aria-label="Í þeirra eigin orðum">
      <Reveal className="isf-mask isf-maskP" margin="0px 0px -20% 0px">
        <h2 className="isf-sub isf-up" style={{ ['--dur' as string]: '1.24s' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="isf-panta">
        <p>Allt ferskt og óunnið kjöt frá Ísfugli er rekjanlegt til bónda. Finndu verslun þar sem það fæst.</p>
        <span className="isf-pantaM"><img ref={mynd} src={S('m/strip')} alt="" width={800} height={200} /></span>
        <button className="isf-btn isf-casH" onClick={() => faraA('#solustadir')}><Cas t="Finna sölustað" /></button>
      </div>
    </section>
  )
}

function Solustadir() {
  const [k, setK] = useState(0)
  const r = SOLUSTADIR[k]
  return (
    <section className="isf-sol" id="solustadir" aria-labelledby="isf-sol-t">
      <Reveal className="isf-wrap"><Ord id="isf-sol-t" className="isf-disp" text="Hvar færðu | Ísfugl?" /></Reveal>
      <Reveal className="isf-solP">
        <div className="isf-solK isf-mask">
          <div className="isf-up">
            <img src={ph('ph/map')} alt="Kort af Íslandi með sölustöðum Ísfugls merktum með rauðum punktum" width={1600} height={1131} loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="isf-solL isf-mask">
          <div className="isf-up">
            <div className="isf-solT" role="tablist" aria-label="Landshluti">
              {SOLUSTADIR.map((x, j) => (
                <button key={x.r} role="tab" aria-selected={j === k} onClick={() => setK(j)} onKeyDown={orvar}>{x.r}<i>{x.s.length}</i></button>
              ))}
            </div>
            <ul className="isf-solV" aria-live="polite" key={r.r}>
              {r.s.map((s, i) => (<li key={`${s.a}-${s.b}-${i}`}><b>{s.a}</b>{s.b ? <span>{s.b}</span> : null}</li>))}
            </ul>
            <p className="isf-smatt">Listinn er af isfugl.is og var síðast breytt í desember 2022. Hringdu í {FYRIRTAEKI.simi} ef þú finnur ekki verslun nálægt þér.</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Faq() {
  const [opid, setOpid] = useState(-1)
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  return (
    <section className="isf-faq" id="spurt">
      <div className="isf-faqK">
        <Reveal><Ord className="isf-disp" text="Spurt og | svarað" /></Reveal>
        <div className="isf-faqM" data-bendill="Næsta" role="button" tabIndex={0} aria-label="Næsta mynd"
          onClick={() => { setFyrri(k); setK((k + 1) % FAQ_MYNDIR.length) }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFyrri(k); setK((k + 1) % FAQ_MYNDIR.length) } }}>
          {FAQ_MYNDIR.map((m, j) => (
            <img key={m} src={ph(m)} alt="" width={800} height={534} loading="lazy" className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
        </div>
        <div className="isf-faqT">
          <button className="isf-btn isf-casH" onClick={() => { setFyrri(k); setK((k + 1 + Math.floor(Math.random() * (FAQ_MYNDIR.length - 1))) % FAQ_MYNDIR.length) }}><Cas t="Handahóf" /></button>
          <button className="isf-btn sc isf-casH" onClick={() => faraA('#uppskriftir')}><Cas t="Uppskriftir" /></button>
        </div>
      </div>
      <Reveal className="isf-faqL" hver>
        {SPURT.map((s, i) => (
          <div className={`isf-faqR isf-mask${opid === i ? ' opid' : ''}`} key={s.q}>
            <div className="isf-up" style={{ ...step(i % 4), ['--dur' as string]: '1.12s' }}>
              <button aria-expanded={opid === i} onClick={() => setOpid(opid === i ? -1 : i)}>
                {s.q}
                <i><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.3" /></svg></i>
              </button>
              <div className="isf-faqB"><div><p>{s.a}</p></div></div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* The footer: curtain on desktop/tablet, slogan wave, paint brush. */
const SLAGORD = TEXTI.fotur
const PENSILL = ['#D6BF98', '#E0384A', '#F6EFE1', '#C4AA7E', '#EBCBA0']

function Fotur() {
  const fot = useRef<HTMLElement | null>(null)
  const slag = useRef<HTMLParagraphElement | null>(null)
  const [H, setH] = useState(0)
  const lokid = useRef(false)

  useEffect(() => {
    const f = fot.current
    if (!f) return
    const ro = new ResizeObserver(() => setH(f.offsetHeight))
    ro.observe(f)
    return () => ro.disconnect()
  }, [])

  const mask = useFramvinda((el) => {
    const f = fot.current, s = slag.current
    if (!f || !s) return
    const stafir = [...s.children] as HTMLElement[]
    const rm = reduced()
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const hh = r.height || 1
    /* start "top bottom", end "bottom bottom" */
    const p = rm ? 1 : Math.min(1, Math.max(0, (vh - r.top) / hh))
    if (!isPhone()) f.style.transform = `translate3d(0,${(-(1 - p) * 100).toFixed(2)}%,0)`
    else f.style.transform = ''
    const n = stafir.length
    const total = 0.6 + 0.04 * (n - 1)
    stafir.forEach((c, i) => {
      const e = easeSlogan(Math.min(1, Math.max(0, (p * total - i * 0.04) / 0.6)))
      c.style.transform = `translate3d(0,${((1 - e) * 110).toFixed(2)}%,0)`
    })
    lokid.current = p >= 0.95
  }, [H])

  /* the brush: the letter under the pointer lifts and takes a paper or kraft
     colour, one neighbour each side at half the lift (preset 2) */
  useEffect(() => {
    const s = slag.current
    if (!s || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let lit: HTMLElement[] = []
    const settle = () => { lit.forEach((c) => { c.style.color = ''; (c.firstElementChild as HTMLElement).style.transform = '' }); lit = [] }
    const move = (e: PointerEvent) => {
      if (!lokid.current) return
      const stafir = [...s.children] as HTMLElement[]
      let best = -1, bd = Infinity
      stafir.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); if (d < bd && r.width > 0) { bd = d; best = i } })
      if (best < 0) return
      settle()
      ;[[0, 0.25], [-1, 0.125], [1, 0.125]].forEach(([o, w]) => {
        const c = stafir[best + o]
        if (!c || c.textContent === '\u00A0') return
        c.style.color = PENSILL[(best + o) % PENSILL.length]
        ;(c.firstElementChild as HTMLElement).style.transform = `translateY(${(-w * 60).toFixed(1)}%)`
        lit.push(c)
      })
    }
    s.addEventListener('pointermove', move)
    s.addEventListener('pointerleave', settle)
    return () => { s.removeEventListener('pointermove', move); s.removeEventListener('pointerleave', settle) }
  }, [])

  const upp = () => { const l = lenisOf(); if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }) }
  const a = (h: string, t: string) => (<><a href={h} onClick={(e) => { e.preventDefault(); faraA(h) }}>{t}</a><br /></>)
  return (
    <div className="isf-fotM" ref={mask} style={{ height: H || undefined }}>
      <footer className="isf-fot" ref={fot}>
        <div className="isf-fotRod">
          <div>
            <div><small>Hafa samband</small>
              <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
              <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a>
            </div>
            <div><small>Ísfugl</small>
              {a('#vorur', 'Kjúklingur og kalkúnn')}
              {a('#baendur', 'Bændurnir')}
              {a('#uppskriftir', 'Uppskriftir')}
              {a('#solustadir', 'Sölustaðir')}
              {a('#spurt', 'Spurt og svarað')}
            </div>
            <div><small>Tenglar</small>
              <a href={FYRIRTAEKI.facebook} target="_blank" rel="noopener">Facebook</a><br />
              <a href={FYRIRTAEKI.vefur} target="_blank" rel="noopener">isfugl.is</a>
            </div>
            <div><small>Skrifstofan</small>
              {FYRIRTAEKI.heimili}<br />{FYRIRTAEKI.opnun}
            </div>
          </div>
          <button className="isf-fotUpp isf-casH" onClick={upp}><Cas t="Aftur upp" /> ↑</button>
        </div>
        <div className="isf-fotMerki">
          <img src={`${B}isfugl/isfugl-merki.svg`} alt="Ísfugl" width={127} height={140} loading="lazy" />
        </div>
        <p className="isf-slogan" ref={slag} aria-label={SLAGORD}>
          {[...SLAGORD].map((c, i) => <span key={i} aria-hidden="true"><span>{c === ' ' ? '\u00A0' : c}</span></span>)}
        </p>
        <div className="isf-fotBot">
          <span>{FYRIRTAEKI.logadi} · kt. {FYRIRTAEKI.kt}</span>
          <span>Sláturhús og kjötvinnsla á Reykjavegi síðan 1979</span>
        </div>
      </footer>
    </div>
  )
}

export default function IsfuglPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Ísfugl | Frá íslenskum bændum sem við þekkjum og treystum'
    document.documentElement.lang = 'is'
    setThemeColor(C.pappirHreint)
    const opna = (e: Event) => { const d = (e as CustomEvent<string>).detail; if (d === 'vorur') pop.open({ k: 'vorur' }) }
    window.addEventListener('isf-opna', opna)
    const hash = window.location.hash
    const t = hash.length > 1 ? window.setTimeout(() => faraA(hash), 2800) : 0
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('isf-opna', opna)
      poki.open(false); pop.close()
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])

  return (
    <div className="isf-root">
      <style>{CSS}{PAGE_CSS}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}{POP_CSS}{SKJAHVILA_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Bendill />
      <Haus />
      <Poki />
      <Popup />
      <Hledsla />
      <Skjahvila />
      <GalleriDrift />
      <main>
        <Hero />
        <Tilvitnun />
        <Vorur />
        <Baendur />
        <Kostir />
        <Galleri />
        <Diskaregn />
        <Form />
        <Um />
        <Saga />
        <Uppskriftir />
        <Yfirlysing />
        <Solustadir />
        <Faq />
        <Fotur />
      </main>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
