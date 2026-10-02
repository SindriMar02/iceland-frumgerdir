import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  Bendill, C, CSS, Cas, Haus, Merki, Ord, Reveal, faraA, isCompact, isPhone, lenisOf, reduced, step, useMjukSkrun, useWatchdog,
} from './ui'
import { Poki, POKA_CSS, SettIPoka, poki } from './poki'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { Nammiregn, REGN_CSS } from './regn'
import { Popup, POP_CSS, pop, type PopState } from './popup'
import { Skjahvila, SKJAHVILA_CSS } from './skjahvila'
import { Eydublad, EYD_CSS } from './eydublad'
import { SPYRJA } from './forms'
import { KATALOGUR } from './katalogur'
import { leita, skilmali, stutt } from './ofnaemi'
import { ALLERGENS, PK, PRODUCTS, productBySlug, type Allergen } from './vorur'
import {
  ERINDI, FYRIRTAEKI, GALLERI, HERO_REITIR, JSON_LD, KORT3, LINUR, SETNING, SETNING_HRINGUR, SOGUHOPAR, SPJOLD, SPURT, TEXTI,
  TEYMI, TILVITNUN, type Leid,
} from './data'

const company = getPreviewCompany('sambo')

/* Every image path resolves against BASE_URL: the preview deploys under
   /iceland-frumgerdir/ on GitHub Pages. M = a pack at 720 px, Ms = at 460. */
const B = import.meta.env.BASE_URL
const M = (slug: string) => PK(slug, 'pack', 'm')
const Ms = (slug: string) => PK(slug, 'pack', 's')

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
  .sb-reit img,.sb-spjaldM img,.sb-galI img,.sb-lina2 figure img,.sb-faqM img,.sb-vMynd img,.sb-regn img{filter:none !important}
}
/* HERO (§5.1-5.2): exactly one viewport on desktop, 50/50, the right half on
   the element ground holding the scattered 4x3 grid; taller than the viewport
   on tablet and phone so the grid can be a grid. */
.sb-heroP{position:relative}
.sb-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}
/* the text clears the floating header on short screens too (12.96vh alone fell
   under the wide wordmark on a 600px-tall window) */
.sb-heroT{display:flex;flex-direction:column;padding:max(12.96vh,calc(2.0833vw + 56px + 1.5rem)) var(--gut) var(--gut) var(--gut)}
.sb-heroT h1{font-size:4.17vw}
.sb-heroAr{color:var(--c-rautt)}
.sb-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.sb-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:1.04vw;padding:14.72svh var(--gut) 5svh 3.75vw;height:100%}
.sb-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur)}
.sb-reit img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 14px 18px rgba(28,18,12,.28))}
.sb-rist:not(.on) .sb-reit img{transform:translateY(125%)}
.sb-reit:nth-child(1){grid-area:1/1/2/2}.sb-reit:nth-child(2){grid-area:1/2/2/3}
.sb-reit:nth-child(3){grid-area:2/2/3/3}.sb-reit:nth-child(4){grid-area:2/3/3/4}
.sb-reit:nth-child(5){grid-area:2/4/3/5}.sb-reit:nth-child(6){grid-area:3/1/4/2}
.sb-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .sb-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .sb-heroT{padding:calc(var(--haus-h,60px) + 9.091vh) var(--gut) 2.604vw}
  .sb-heroT h1{font-size:7.292vw}
  .sb-heroSlag{margin-top:2rem}
  .sb-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:2.604vw;height:auto}
  .sb-reit{aspect-ratio:3/4}
  .sb-reit:nth-child(n){grid-area:auto}
  .sb-reit:nth-child(1){grid-column:1}.sb-reit:nth-child(2){grid-column:2}
  .sb-reit:nth-child(3){grid-column:2}.sb-reit:nth-child(4){grid-column:3}
  .sb-reit:nth-child(5){display:none}
  .sb-reit:nth-child(6){grid-column:1}.sb-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .sb-heroT{padding:calc(var(--haus-h,60px) + 16vw) var(--gut) 5.556vw}
  .sb-heroT h1{font-size:min(13.333vw,3.4rem)}
  .sb-rist{padding:2.778vw}
}

/* QUOTE (§1 quote section, §4.6): one centred sentence at the section scale,
   56.6vw wide, image chips at .81em x .72em between the words, and every
   chip cycles its own pictures forever (pause 1.5s, 0.5s mask rise). */
.sb-tilvS{display:flex;justify-content:center}
.sb-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.sb-setning{width:80.078vw}}
@media (max-width:479px){.sb-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.sb-setL{display:block}
.sb-setL span{margin:0 .08em}
.sb-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.sb-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;
  transform:translateY(115%);transition:transform .5s var(--ease)}
.sb-bitiM img.nu{transform:none}
.sb-bitiM img.farin{transform:translateY(-115%)}

/* PRODUCT (§5.2 product, §6 swatches): two half-width panels, one viewport
   tall, each a big pack on the element ground with a bottom bar: label and
   pack size, the variant swatches, then Nánar and the bag. Stacks on
   compact, each panel a screen tall less the bar. */
.sb-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.sb-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.sb-spjald:nth-child(2){background:var(--c-el2)}
.sb-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer}
.sb-spjaldM img{position:absolute;inset:8% 10%;width:80%;height:84%;object-fit:contain;
  filter:drop-shadow(0 28px 34px rgba(28,18,12,.28));transform:translateY(130%);transition:transform .8s var(--ease)}
.sb-spjaldM img.nu{transform:none}
.sb-spjaldM img.farin{transform:translateY(-130%)}
.sb-spjald:not(.on) .sb-spjaldM img.nu{transform:translateY(130%)}
.sb-root.sb-allt .sb-spjaldM img.nu{transform:none}
.sb-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.sb-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.sb-stika b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.9vw;letter-spacing:-.02em;line-height:1.05}
.sb-stika .sb-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.sb-lit{display:flex;flex-direction:column;gap:.4rem}
.sb-lit div{display:flex;gap:.25rem}
.sb-lit button{width:28px;height:28px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.sb-lit button::before{content:'';width:16px;height:16px;border-radius:50%;background:var(--l);
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:box-shadow .25s var(--ease)}
.sb-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.sb-takkar{display:flex;gap:.4rem}
.sb-takkar .sb-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .sb-vorur{grid-template-columns:1fr;height:auto}
  .sb-spjald{height:calc(100svh - 10.416vw)}
  .sb-stika b{font-size:3.6vw}
}
@media (max-width:479px){
  .sb-spjald{height:calc(100svh - 22.223vw)}
  .sb-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .sb-stika b{font-size:7vw}
  .sb-takkar{grid-column:1/-1}
  .sb-takkar > *{flex:1}
}

/* ADVANTAGES (§5.2): title, then three cards 31.25vw x 30.625vw, ground by
   position, label top-left, a line centred, index bottom-left. Tablet: a
   swipeable row, one card at a time. Phone: stacked, each card its own
   trigger. */
.sb-kostir{display:flex;flex-direction:column;row-gap:6.4815vh;padding:0 var(--gut)}
.sb-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.sb-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.sb-kort:nth-child(2){background:var(--c-el3)}
.sb-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.25vw}
.sb-kort small{font-size:.8rem;color:var(--c-ink-med)}
.sb-kort h3{margin:0;font-weight:400;text-align:center;font-family:var(--f-disp);font-size:2.08vw;line-height:1.05;letter-spacing:-.02em;padding:0 8%}
.sb-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .sb-kostir{row-gap:2.273vh}
  .sb-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .sb-kortin::-webkit-scrollbar{display:none}
  .sb-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .sb-kort h3{font-size:3.255vw}
}
@media (max-width:479px){
  .sb-kostir{row-gap:3.125vh}
  .sb-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:2.778vw}
  .sb-kort{width:100%;flex:none;height:94.444vw}
  .sb-kort h3{font-size:7.4vw}
  .sb-kort > div{padding:4vw}
}

/* GALLERY (§12 mouse-scroll): a centred headline, then a strip of packs at
   21.1vh x 25.9vh along the bottom. On a mouse: the hovered pack scales
   1.3x from its base and its neighbours slide out of the way, and the strip
   drifts toward the cursor. On touch: a native swipe row. Click opens the
   product. The slowest reveal on the page, 2.44s: the more there is to look
   at, the longer it takes to arrive (§4.4). */
.sb-gal{display:flex;flex-direction:column;row-gap:9.2593vh}
.sb-galT{width:62vw}
.sb-galK{overflow:hidden;padding:4.5vh 0 0}
.sb-galL{display:flex;gap:.7vw;padding:0 var(--gut);list-style:none;margin:0;will-change:transform;width:max-content}
.sb-galL li{width:21.1111vh;height:25.9259vh;flex:none;overflow:hidden}
.sb-galI{display:block;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:var(--g);position:relative;
  transform-origin:50% 100%;transition:transform .6s var(--ease)}
.sb-galI img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.3));
  transform:translateY(130%);transition:transform var(--dur,2.44s) var(--ease);transition-delay:var(--d,0s)}
.on .sb-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .sb-galL li{overflow:visible}
  .sb-galL li:hover .sb-galI{transform:scale(1.3)}
  .sb-galL li:hover ~ li .sb-galI{transform:translateX(15%)}
  .sb-galL li:has(~ li:hover) .sb-galI{transform:translateX(-15%)}
}
@media (max-width:991px){
  .sb-gal{row-gap:3.788vh}
  .sb-galT{width:auto;padding:0 var(--gut)}
  .sb-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .sb-galK::-webkit-scrollbar{display:none}
  .sb-galL li{width:14.714vw;height:19.01vw;scroll-snap-align:start}
}
@media (max-width:479px){.sb-gal{row-gap:3.75vh}.sb-galL li{width:34.167vw;height:44.444vw}}

/* FORM (§1 form section, §9 quiz): two tab titles side by side, the idle
   one dimmed; under them one panel on the element ground. The quiz is
   noho's shape: a question, a 2x2 grid of white option fields with a round
   radio, a full-width dark button counting the step. */
.sb-form{padding:0 var(--gut)}
.sb-flipar{display:flex;gap:2.5vw;align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.sb-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:color .4s var(--ease)}
.sb-flipar button[aria-selected="true"]{color:var(--c-ink)}
.sb-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.sb-formP{background:var(--c-el);padding:1.6vw;display:grid;gap:1rem}
.sb-quiz{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:.35rem;align-items:stretch}
.sb-quizQ{margin:0 0 .8rem}
.sb-svar{background:var(--c-form);color:#06222E;display:flex}
.sb-svarI{padding:1.6vw;display:flex;flex-direction:column;align-items:flex-start;gap:.9rem;width:100%;
  animation:sb-svarinn .45s var(--ease) both}
.sb-svarI.tomt{justify-content:center}
@keyframes sb-svarinn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.sb-svarT{margin:0;font-family:var(--f-disp);font-size:1.6vw;line-height:1.2;letter-spacing:-.015em;max-width:30ch}
.sb-svarI .sb-btn{margin-top:auto}
.sb-lbl{display:block;font-size:.78rem;color:rgba(6,34,46,.6);position:absolute;left:1.04vw;top:.55rem;pointer-events:none}
.sb-reitir input,.sb-reitir textarea{padding-top:1.7rem !important}
@media (prefers-reduced-motion:reduce){.sb-svarI{animation:none}}
.sb-formP > p{margin:0}
.sb-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.sb-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.8vw;
  transition:background .25s var(--ease),color .25s var(--ease);
  padding:0 1.04vw;cursor:pointer;color:#06222E}
.sb-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #06222E;margin:0;flex:none;
  transition:box-shadow .2s var(--ease)}
.sb-val input:checked{box-shadow:inset 0 0 0 4px #FFFDF8,inset 0 0 0 9px #06222E}
.sb-val label span{display:grid;gap:.1rem;padding:.7rem 0}
.sb-val label b{font-weight:500}
.sb-val label small{font-size:.8rem;color:rgba(6,34,46,.6)}
.sb-val label.valid{background:#06222E;color:#FFFDF8}
.sb-val label.valid small{color:rgba(255,253,248,.7)}
.sb-val label.valid input{border-color:#FFFDF8;box-shadow:inset 0 0 0 4px #06222E,inset 0 0 0 9px #FFFDF8}
.sb-val label:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:2px}
@media (hover:hover) and (pointer:fine){.sb-val label:not(.valid):hover{background:#F4EDE3}}
.sb-nidur{background:var(--c-form);padding:1.2rem 1.04vw;color:#06222E;display:grid;gap:.7rem}
.sb-nidur p{margin:0}
.sb-nidur .sb-btn{justify-self:start}
.sb-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.sb-reitir .heild{grid-column:1/-1}
.sb-reitir label{position:relative;display:block}
.sb-reitir input,.sb-reitir textarea{width:100%;border:0;background:var(--c-form);color:#06222E;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem 1.04vw;min-height:4.063vw;border-radius:0}
.sb-reitir textarea{min-height:8rem;resize:vertical}
.sb-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:background .2s}
.sb-reitir label.gott i{background:#88C159}.sb-reitir label.villa i{background:#DC5B5B}
.sb-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.sb-teymiL div{background:var(--c-form);padding:.8rem 1.04vw;color:#06222E;font-size:.86rem}
.sb-teymiL b{display:block;font-weight:500}
.sb-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.sb-form{padding:0}.sb-flipar{padding:0 var(--gut)}.sb-formP{max-width:none;padding:2.6vw var(--gut)}
  .sb-val label,.sb-reitir input{min-height:6.51vw}.sb-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:991px){.sb-svarT{font-size:2.9vw}.sb-svarI{padding:2.6vw}.sb-lbl{left:1.6vw}}
/* on a phone the two tab titles would each fill the screen at the section
   scale, so they become a two-part switch the thumb can hit */
@media (max-width:479px){
  .sb-flipar.sb-disp{font-size:1.02rem;letter-spacing:0;line-height:1.2;display:grid;grid-template-columns:1fr 1fr;gap:2px;
    margin:0 var(--gut) .6rem;padding:0;font-family:inherit;font-weight:500}
  .sb-flipar button{min-height:48px;background:var(--c-el);color:var(--c-ink-med);padding:0 .6rem}
  .sb-flipar button[aria-selected="true"]{background:var(--c-btn);color:var(--c-btn-t)}
  .sb-flipar button::before{display:none}
  .sb-quiz{grid-template-columns:1fr}
  .sb-svarT{font-size:5.4vw}
  .sb-svarI{padding:5vw}
  .sb-svarI .sb-btn{width:100%}
  .sb-lbl{left:4vw}
}
@media (max-width:479px){.sb-val,.sb-reitir{grid-template-columns:1fr}.sb-val label,.sb-reitir input{min-height:13.889vw}
  .sb-teymiL{grid-template-columns:1fr}}

/* ABOUT (§5.2 about-us, §6 photo switcher): two cards edge to edge, half the
   width each; a picture and a name at the top, the text beside it, and a
   line of their own words at the foot. Hover swaps the picture behind a mask. */
.sb-um{display:flex;flex-direction:column;row-gap:5.1852vh}
.sb-um > .sb-wrap{width:100%}
.sb-umK{display:flex}
.sb-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.sb-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem 2vw}
.sb-umC:nth-child(2){background:var(--c-el3)}
.sb-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--grunnur)}
.sb-umM img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;transition:transform .7s var(--ease)}
.sb-umM img + img{transform:translateY(135%)}
@media (hover:hover) and (pointer:fine){.sb-umC:hover .sb-umM img:first-child{transform:translateY(-135%)}
  .sb-umC:hover .sb-umM img + img{transform:none}}
.sb-umN b{display:block;font-weight:500}
.sb-umN small{color:var(--c-ink-med)}
.sb-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.sb-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:2.08vw;line-height:1.1;letter-spacing:-.02em;max-width:26ch}
@media (max-width:991px){.sb-umC{min-height:52.083vw}.sb-umM{width:14vw}.sb-umQ{font-size:3.255vw}}
@media (max-width:479px){.sb-umK{flex-direction:column}.sb-umC{width:100%;min-height:auto}.sb-umI{grid-template-columns:1fr}
  .sb-umT{grid-column:1;grid-row:auto}.sb-umM{width:30vw}.sb-umQ{font-size:6.4vw}}

/* AWARDS -> the history (§22 big-link): group labels on the left third, the
   rows on the right two thirds with the year right-aligned; hovering a row
   lays the form ground under it and slides the text in 0.8333vw. */
.sb-saga{display:flex;flex-direction:column;row-gap:6.2963vh;padding:0 var(--gut)}
.sb-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.sb-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.sb-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.sb-sagaR span{display:inline-block;padding:.35rem .8333vw;margin-left:-.8333vw;transition:transform .4s var(--ease),background-color 0s}
.sb-sagaR b{font-family:var(--f-disp);font-weight:400;font-size:2.08vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.sb-sagaR:hover span{background:var(--c-form);color:#06222E;transform:translateX(.8333vw)}}
@media (max-width:991px){.sb-sagaR b{font-size:3.255vw}}
@media (max-width:479px){.sb-sagaH{grid-template-columns:1fr}.sb-sagaR b{font-size:6.4vw}}

/* BLOG -> the lines (§14): desktop pins the section for 400% of a viewport
   and staggers the cards left, each coming to rest 20% short of the last so
   they stack. Compact: a plain swipe row. Cards 44.17vw x 24.74vw, grounds
   cycling third/second/first. */
.sb-linur{position:relative}
.sb-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:6.2963vh;overflow:hidden}
.sb-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.sb-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.sb-lina2:nth-child(3n+2){background:var(--c-el2)}.sb-lina2:nth-child(3n+3){background:var(--c-el)}
.sb-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.sb-lina2 figure img{position:absolute;inset:12%;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(28,18,12,.28));
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.sb-lina2:hover figure img{transform:scale(1.06) rotate(-2deg)}}
.sb-lina2 > div{display:flex;flex-direction:column;padding:1.25vw;gap:.6rem}
.sb-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:400;font-size:2.08vw;line-height:1.05;letter-spacing:-.02em}
.sb-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.sb-lina2 .sb-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .sb-linur{height:auto !important}
  .sb-linurP{position:relative;height:auto;overflow:visible}
  .sb-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .sb-linurL::-webkit-scrollbar{display:none}
  .sb-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .sb-lina2 h3{font-size:3.255vw}
}
@media (max-width:479px){.sb-lina2{width:83.333vw;height:111.111vw}.sb-lina2 h3{font-size:7vw}.sb-lina2 > div{padding:4vw}}

/* SUSTAINABILITY -> their own words (§20): a centred statement, then a row
   with a line and a button whose hover opens a clipped picture strip from
   width 0. */
.sb-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:4.4444vh;padding:0 var(--gut)}
.sb-yfirl .sb-sub{width:min(58vw,60rem);text-align:center}
/* contain: the hover strip animates width (noho's signature reveal, kept);
   containment keeps that layout work inside this one row */
.sb-panta{display:flex;align-items:center;gap:2.5vw;contain:layout}
.sb-panta p{margin:0;max-width:24ch;font-size:.92rem}
.sb-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:width .5s var(--ease);height:max(3vw,44px)}
.sb-pantaM img{height:100%;width:auto;max-width:none}
@media (hover:hover) and (pointer:fine){.sb-panta:has(.sb-btn:hover) .sb-pantaM{width:var(--bw,10rem)}}
@media (max-width:991px){.sb-yfirl .sb-sub{width:80vw}.sb-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.sb-yfirl{align-items:flex-start}.sb-yfirl .sb-sub{width:auto;text-align:left}
  .sb-panta{align-items:flex-start;text-align:left}}

/* FAQ (§11, §5.2): a sticky card on the left, 46.875vw x 79.44vh, with the
   title and a pack you can swap; single-open accordion rows on the right,
   white, with a plus that turns 45 degrees. Height 0.32s on custom-our; the
   answer fades in at half-way, the one fade the reference itself uses. */
.sb-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.sb-faqK{position:sticky;top:var(--gut);height:79.4444vh;background:var(--c-el);display:flex;flex-direction:column;
  justify-content:space-between;padding:1.25vw;overflow:hidden}
.sb-faqM{position:relative;flex:1;overflow:hidden}
.sb-faqM img{position:absolute;inset:10% 15%;width:70%;height:80%;object-fit:contain;filter:drop-shadow(0 24px 30px rgba(28,18,12,.28));
  transform:translateY(135%);transition:transform .8s var(--ease)}
.sb-faqM img.nu{transform:none}.sb-faqM img.farin{transform:translateY(-135%)}
.sb-faqT{display:flex;justify-content:space-between;gap:.5rem}
.sb-faqL{display:grid;gap:.35rem}
.sb-faqR{background:var(--c-form);color:#06222E}
.sb-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 1.04vw;min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.sb-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(6,34,46,.08)}
.sb-faqR button svg{transition:transform .32s var(--ease)}
.sb-faqR.opid button svg{transform:rotate(45deg)}
.sb-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s var(--ease)}
.sb-faqR.opid .sb-faqB{grid-template-rows:1fr}
.sb-faqB > div{overflow:hidden}
.sb-faqB p{margin:0;padding:0 1.04vw 1.1rem;max-width:60ch;opacity:0;transition:opacity .16s var(--ease)}
.sb-faqR.opid .sb-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.sb-faq{grid-template-columns:46.094vw 1fr}.sb-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.sb-faqT{display:grid;grid-template-columns:1fr 1fr}.sb-faq{grid-template-columns:1fr}.sb-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:9.375vh}}

/* FOOTER (§18, §19, §4.5): on desktop and tablet the footer sits in a mask
   and is pulled from yPercent -100 to 0 as the mask scrolls in, scrubbed, a
   curtain rather than a block arriving. Its last line is the slogan, split
   to letters that rise as a wave against the same scroll, and once it has
   landed the pointer paints the letters it passes in the pack colours.
   Sambó's wordmark sits above it as the statement piece; the ground is the
   red of the oval rather than noho's tan (declared). */
.sb-fotM{position:relative;overflow:hidden}
.sb-fot{background:#D3202A;color:#FAF5EA;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.sb-fotRod{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;font-size:.86rem;line-height:1.7}
.sb-fotRod > div{display:flex;gap:4vw;flex-wrap:wrap}
.sb-fotRod small{display:block;opacity:.7;font-size:.78rem}
.sb-fot a{text-decoration:none;display:inline-flex;min-height:44px;min-width:44px;align-items:center}
@media (hover:hover) and (pointer:fine){.sb-fot a:hover{text-decoration:underline;text-underline-offset:3px}}
.sb-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:flex-start}
.sb-fotMerki{width:clamp(12rem,26vw,24rem);margin:8.1481vh auto 4vh}
.sb-fotMerki img{width:100%;height:auto}
.sb-slogan{font-family:var(--f-disp);font-weight:400;font-size:12.2vw;line-height:1;letter-spacing:-.035em;
  white-space:nowrap;text-align:center;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.sb-slogan span{display:inline-block;will-change:transform;transition:color .18s ease-out}
.sb-slogan span > span{display:inline-block;transition:transform .28s ease-out}
.sb-fotBot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;opacity:.8}
@media (max-width:479px){.sb-fotRod > div{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1rem}.sb-slogan{font-size:13.4vw}}

/* ---------------------------------------------------------------
   THE 10% (Sindri, 2026-09-28: "90% website 10% difference in ui"; carried
   to Sambó 2026-10-02). Structure, rhythm, motion and every mechanism are
   the Góa/noho build; these are the deliberate departures, all from Sambó's
   own objects:
   1. soft corners on everything that is a thing you pick up (tiles, cards,
      chips, fields), from the pillow of a pack; full-bleed panels stay
      square so their seams stay clean;
   2. pill buttons instead of square ones;
   3. the hero scatter is a checkerboard (the grid of a shelf), not noho's
      mirrored pattern;
   4. Gloock for display (in ui.tsx), the high-contrast face of their own
      wordmark, tracking eased; the ink is the deep teal of that wordmark.
   --------------------------------------------------------------- */
.sb-root{--r:clamp(10px,.9vw,16px)}
.sb-reit,.sb-kort,.sb-galI,.sb-formP,.sb-svar,.sb-val label,.sb-nidur,.sb-teymiL div,
.sb-reitir input,.sb-reitir textarea,.sb-lina2,.sb-lina2 figure,.sb-faqK,.sb-faqR,.sb-umM,.sb-vMynd,.sb-ofnK{border-radius:var(--r)}
.sb-lina2 figure{border-radius:var(--r) 0 0 var(--r)}
@media (max-width:991px){.sb-lina2 figure{border-radius:var(--r) var(--r) 0 0}}
.sb-bitiM{border-radius:.16em}
.sb-magn,.sb-tegund,.sb-reitur input,.sb-reitur textarea,.sb-kvittun,.sb-pokiH b{border-radius:var(--r)}
.sb-btn,.sb-hnappur,.sb-sett,.sb-haus .sb-pokiH,.sb-braud{border-radius:999px}
.sb-faqR{overflow:hidden}
.sb-disp{letter-spacing:-.02em}
.sb-lit div{flex-wrap:wrap;max-width:none;gap:0}
.sb-lit button{width:44px;height:44px}
@media (max-width:479px){.sb-lit div{max-width:132px}}
@media (max-width:1600px){.sb-stika{grid-template-columns:minmax(0,1fr) auto}.sb-takkar{grid-column:1/-1}}
@media (max-width:479px){.sb-slogan{font-size:min(13.4vw,4.4rem)}}
@media (min-width:992px){
  .sb-reit:nth-child(1){grid-area:1/1/2/2}.sb-reit:nth-child(2){grid-area:1/3/2/4}
  .sb-reit:nth-child(3){grid-area:2/2/3/3}.sb-reit:nth-child(4){grid-area:2/4/3/5}
  .sb-reit:nth-child(5){grid-area:3/1/4/2}.sb-reit:nth-child(6){grid-area:3/3/4/4}
  .sb-reit:nth-child(7){grid-area:3/4/4/5}
}
@media (max-width:991px){.sb-reit:nth-child(5){display:block}.sb-reit:nth-child(7){grid-column:3}}

/* NEW: the allergen section, built from the quiz's own parts */
.sb-ofn .sb-quizQ{max-width:38ch}
.sb-ofnR{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(5.4rem,1fr));gap:.35rem;width:100%}
.sb-ofnR li{min-width:0}
.sb-ofnK{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:.3rem;width:100%;height:100%;padding:.6rem .3rem .5rem;border:0;cursor:pointer;
  background:var(--g);color:#06222E;font-size:.72rem;font-weight:500;line-height:1.15;text-align:center;min-height:44px;transition:transform .25s var(--ease)}
.sb-ofnK img{height:4.4rem;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 6px 8px rgba(4,26,36,.25))}
@media (hover:hover) and (pointer:fine){.sb-ofnK:hover{transform:translateY(-3px)}}
.sb-ofn .sb-val label{min-height:3.4rem}
@media (max-width:991px){.sb-ofn .sb-val label{min-height:4.4rem}}
@media (max-width:479px){.sb-ofn .sb-val{grid-template-columns:1fr 1fr}.sb-ofn .sb-val label{padding:0 3vw}.sb-ofnR{grid-template-columns:repeat(3,minmax(0,1fr))}}
`

/* ---------------------------------------------------------------- *
 * Sections
 * ---------------------------------------------------------------- */

function Hero() {
  return (
    <div className="sb-heroP">
      <section className="sb-hero" id="top">
        <Reveal className="sb-heroT">
          <div>
            <Merki>Kólus · Tunguháls 5, Reykjavík</Merki>
            <h1 className="sb-disp">
              {TEXTI.heroLinur.map((l, i) => (
                <span className="sb-mask" key={l}><span className="sb-up sb-lina" style={step(i)}>{l}</span></span>
              ))}
              <span className="sb-mask">
                <span className="sb-up sb-lina sb-heroAr" style={step(TEXTI.heroLinur.length)}>{TEXTI.heroAr}</span>
              </span>
            </h1>
          </div>
          <p className="sb-heroSlag sb-mask sb-maskP">
            <span className="sb-up" style={{ ...step(4), ['--dur' as string]: '.75s' }}>{TEXTI.heroUndir}</span>
          </p>
        </Reveal>
        <Reveal className="sb-rist">
          {HERO_REITIR.map((r, i) => (
            <figure className="sb-reit sb-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}>
              <img className="sb-up" style={step(i)} src={Ms(r.img)} alt={r.n} width={300} height={340}
                loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ))}
        </Reveal>
      </section>
    </div>
  )
}

/** A chip that cycles its own pictures forever: pause 1.5s, 0.5s rise. */
function Biti({ n, grunnur, b, fyrsta, hlid }: { n: string; grunnur: string; b?: number; fyrsta: string; hlid: number }) {
  const myndir = SETNING_HRINGUR[n] ?? [fyrsta]
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
    <span className="sb-bitiM" ref={ref} style={{ '--grunnur': productBySlug(myndir[k])?.tint ?? grunnur, '--b': b ?? 1 } as CSSProperties}>
      {myndir.map((m, i) => (
        <img key={m} src={Ms(m)} alt={i === k ? n : ''} width={120} height={136} loading="lazy" decoding="async"
          className={i === k ? 'nu' : i === fyrri && myndir.length > 1 ? 'farin' : ''}
          style={i !== k && i !== fyrri ? { transition: 'none' } : undefined} />
      ))}
    </span>
  )
}

function Tilvitnun() {
  let chip = 0
  return (
    <section className="sb-tilvS" aria-label="Sambó í einni setningu">
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="sb-disp sb-setning">
          {SETNING.map((lina, li) => (
            <span className="sb-mask sb-setL" key={li}>
              <span className="sb-up sb-lina" style={{ ...step(li), ['--dur' as string]: '1.36s' }}>
                {lina.map((b, i) =>
                  't' in b ? <span key={i}>{b.t}</span>
                    : <Biti key={i} n={b.n} grunnur={b.grunnur} b={b.b} fyrsta={b.img} hlid={chip++} />,
                )}
              </span>
            </span>
          ))}
        </h2>
      </Reveal>
    </section>
  )
}

function Spjald({ s, i }: { s: (typeof SPJOLD)[number]; i: number }) {
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  const v = s.tegundir[k]
  const opna = () => pop.open({ k: 'vara', slug: v.slug })
  return (
    <Reveal className="sb-spjald" as="article">
      <div className="sb-spjaldM" data-bendill="Skoða" onClick={opna}>
        {s.tegundir.map((t, j) => (
          <img key={t.slug} src={M(t.slug)} alt={j === k ? t.n : ''} width={720} height={820} loading="lazy" decoding="async"
            className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
            style={j !== k && j !== fyrri ? { transition: 'none' } : { transitionDelay: fyrri < 0 ? `${0.12 * i}s` : '0s' }} />
        ))}
      </div>
      <div className="sb-stika">
        <div>
          <small>{s.merki}</small>
          <b>{v.n}</b>
          <span className="sb-pk">{v.d}</span>
        </div>
        <div className="sb-lit">
          <small>Tegund</small>
          <div role="group" aria-label={`Tegundir af ${s.titill}`}>
            {s.tegundir.map((t, j) => (
              <button key={t.n} aria-pressed={j === k} aria-label={t.n} style={{ ['--l' as string]: t.lit }}
                onClick={() => { if (j !== k) { setFyrri(k); setK(j) } }} />
            ))}
          </div>
        </div>
        <div className="sb-takkar">
          <button className="sb-btn sc sb-casH" onClick={opna}><Cas t="Nánar" /></button>
          <SettIPoka slug={v.slug} />
        </div>
      </div>
    </Reveal>
  )
}

function Vorur() {
  return (
    <section className="sb-vorur" id="vorur" aria-label="Vörur">
      {SPJOLD.map((s, i) => <Spjald key={s.titill} s={s} i={i} />)}
    </section>
  )
}

function Kostir() {
  return (
    <section className="sb-kostir">
      <Reveal><Ord className="sb-disp" text="Íslenskt | síðan 1962" /></Reveal>
      <Reveal className="sb-kortin" hver>
        {KORT3.map((k, i) => (
          <div className="sb-kort sb-mask" key={k.nr}>
            <div className="sb-up" style={{ ...step(i), ['--dur' as string]: '1.24s' }}>
              <small>{k.m}</small><h3>{k.t}</h3><i>{k.nr}</i>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Galleri() {
  return (
    <section className="sb-gal" aria-labelledby="sb-gal-t">
      <Reveal className="sb-galT sb-midja" margin="0px 0px -40% 0px">
        <Ord id="sb-gal-t" className="sb-disp" text={"Allt Sambó | í einni | hillu"} />
      </Reveal>
      <div className="sb-galK">
        <Reveal as="ul" className="sb-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.img}>
              <button className="sb-galI" style={{ ['--g' as string]: g.g, ['--d' as string]: `${(i * 0.06).toFixed(2)}s` }}
                data-bendill="Skoða" aria-label={`${g.n}, nánar`}
                onClick={() => pop.open({ k: 'vara', slug: g.img })}>
                <img src={Ms(g.img)} alt="" width={300} height={340} loading="lazy" decoding="async" />
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
    const k = document.querySelector<HTMLElement>('.sb-galK')
    const l = document.querySelector<HTMLElement>('.sb-galL')
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

/* NEW (the one section the system did not have): what can I eat? Built from
   the system's own vocabulary, the quiz's option fields and white answer
   card. Only products with an ingredient label on Kólus' site can appear as
   "without X"; the rest are counted and marked "sjá umbúðir". */
function Ofnaemi() {
  const [avoid, setAvoid] = useState<Allergen[]>([])
  const { henta, oljost } = leita(avoid)
  const kunn = PRODUCTS.filter((p) => p.allergens !== null).length
  const skipta = (a: Allergen) => setAvoid((c) => (c.includes(a) ? c.filter((x) => x !== a) : [...c, a]))
  return (
    <section className="sb-form sb-ofn" id="ofnaemi" aria-labelledby="sb-ofn-t">
      <Reveal className="sb-flipar sb-disp">
        <Ord id="sb-ofn-t" className="sb-disp" text="Hvað þolir þú | ekki?" />
      </Reveal>
      <Reveal className="sb-formP sb-mask" margin="0px 0px -20% 0px">
        <div className="sb-up" style={{ display: 'grid', gap: '1rem' }}>
          <div className="sb-quiz">
            <div>
              <p className="sb-quizQ" id="sb-ofn-q">Veldu það sem þú vilt forðast. {kunn} af {PRODUCTS.length} vörum hafa innihaldslýsingu á vef Kólus.</p>
              <div className="sb-val" role="group" aria-labelledby="sb-ofn-q">
                {ALLERGENS.map((a) => {
                  const on = avoid.includes(a.id)
                  return (
                    <label key={a.id} className={on ? 'valid' : ''}>
                      <span><b>{a.is}</b></span>
                      <input type="checkbox" checked={on} onChange={() => skipta(a.id)} />
                    </label>
                  )
                })}
              </div>
            </div>
            <div className="sb-svar" aria-live="polite">
              {avoid.length === 0 ? (
                <div className="sb-svarI tomt">
                  <p className="sb-svarT">Veldu það sem þú vilt forðast og listinn breytist strax.</p>
                  <button className="sb-nobg" style={{ color: '#06222E' }} onClick={() => pop.open({ k: 'ofnaemi' })}>Sjá allt ofnæmisyfirlitið <i>→</i></button>
                </div>
              ) : (
                <div className="sb-svarI" key={avoid.join(',')}>
                  <p className="sb-merki" style={{ margin: 0, color: 'rgba(6,34,46,.6)' }}>Án {avoid.map(stutt).join(', ')}</p>
                  <p className="sb-svarT">{henta.length ? `${henta.length} ${henta.length === 1 ? 'vara' : 'vörur'} henta` : 'Engin vara með innihaldslýsingu hentar'}{oljost.length ? `, ${oljost.length} án lýsingar` : ''}</p>
                  <ul className="sb-ofnR">
                    {henta.map((p) => (
                      <li key={p.slug}>
                        <button type="button" className="sb-ofnK" style={{ ['--g' as string]: p.tint }} aria-label={`${p.name.is}, nánar`}
                          onClick={() => pop.open({ k: 'vara', slug: p.slug })}>
                          <img src={Ms(p.slug)} alt="" width={60} height={68} loading="lazy" /><span>{p.name.is}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {oljost.length > 0 && <p className="sb-smatt" style={{ color: 'rgba(6,34,46,.6)' }}>Án innihaldslýsingar á vef Kólus, ekki talin laus við neitt: {oljost.map((p) => p.name.is).join(', ')}.</p>}
                  <button className="sb-nobg" style={{ color: '#06222E' }} onClick={() => pop.open({ k: 'ofnaemi' })}>Sjá allt ofnæmisyfirlitið <i>→</i></button>
                </div>
              )}
            </div>
          </div>
          <p className="sb-smatt">{skilmali}</p>
        </div>
      </Reveal>
    </section>
  )
}

function Form() {
  const [flipi, setFlipi] = useState<'quiz' | 'spyrja'>('quiz')
  const [val, setVal] = useState<number | null>(null)
  const leid: Leid | null = val === null ? null : ERINDI[val]
  const gera = (l: Leid) => {
    if (l.hlekkur === '#poki') poki.open(true)
    else if (l.hlekkur === '#paska') pop.open({ k: 'fjarofloun' })
    else if (l.hlekkur === '#hvar') pop.open({ k: 'hvar' })
    else faraA('#ofnaemi')
  }
  return (
    <section className="sb-form" id="erindi">
      <div className="sb-flipar sb-disp" role="tablist" aria-label="Hafa samband">
        <button role="tab" id="sb-t1" aria-controls="sb-tp" aria-selected={flipi === 'quiz'} onClick={() => setFlipi('quiz')}>Hvert er erindið?</button>
        <button role="tab" id="sb-t2" aria-controls="sb-tp" aria-selected={flipi === 'spyrja'} onClick={() => setFlipi('spyrja')}>Senda fyrirspurn</button>
      </div>
      <Reveal className="sb-formP sb-mask" margin="0px 0px -20% 0px">
        <div className="sb-up" id="sb-tp" role="tabpanel" aria-labelledby={flipi === 'quiz' ? 'sb-t1' : 'sb-t2'} style={{ display: 'grid', gap: '1rem' }}>
          {flipi === 'quiz' ? (
            /* one step: choosing an errand shows its answer and its action at
               once, beside the choices on desktop and right under them on a
               phone. No disabled Next button and no second screen to go back
               from. */
            <div className="sb-quiz">
              <div>
                <p className="sb-quizQ" id="sb-quiz-q">Hvað ert þú að leita að?</p>
                <div className="sb-val" role="radiogroup" aria-labelledby="sb-quiz-q">
                  {ERINDI.map((e, i) => (
                    <label key={e.nafn} className={val === i ? 'valid' : ''}>
                      <span><b>{e.nafn}</b><small>{e.stutt}</small></span>
                      <input type="radio" name="sb-erindi" checked={val === i} onChange={() => setVal(i)} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="sb-svar" aria-live="polite">
                {leid ? (
                  <div className="sb-svarI" key={leid.nafn}>
                    <p className="sb-merki" style={{ margin: 0, color: 'rgba(6,34,46,.6)' }}>{leid.nafn}</p>
                    <p className="sb-svarT">{leid.nota}</p>
                    <button className="sb-btn sb-casH" onClick={() => gera(leid)}><Cas t={leid.ord} /></button>
                    <button className="sb-nobg" style={{ color: '#06222E' }} onClick={() => setFlipi('spyrja')}>Eða sendu okkur línu <i>→</i></button>
                  </div>
                ) : (
                  <div className="sb-svarI tomt">
                    <p className="sb-svarT">Veldu erindi og þú sérð strax hvernig best er að snúa sér.</p>
                    <p className="sb-smatt" style={{ color: 'rgba(6,34,46,.6)', margin: 0 }}>Sími {FYRIRTAEKI.simi} · {FYRIRTAEKI.netfang}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Eydublad cfg={SPYRJA} />
              <div className="sb-teymiL">
                {TEYMI.map((t) => (
                  <div key={t.nafn}><b>{t.nafn}</b><a href={t.href} {...(t.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t.texti}</a></div>
                ))}
              </div>
            </>
          )}
        </div>
      </Reveal>
    </section>
  )
}

function Um() {
  const kort = [
    { n: 'Sambó', m: 'Íslenskt einkafyrirtæki, stofnað 1962', a: 'thristur', b: 'kulusukk', g: productBySlug('thristur')!.tint,
      t: 'Kólus ehf. er íslenskt einkafyrirtæki sem býður sérstakt sælgæti og hefðbundna lakkrísvöru úr úrvals hráefni fyrir innanlandsmarkað og útflutning.',
      q: '„The flavor of tradition.“' },
    { n: 'Völusælgæti', m: 'Sykurpúðar og stangir', a: 'froskar', b: 'kokosbollur', g: productBySlug('froskar')!.tint,
      t: 'Völusælgæti er á sama vörulista: Froskar, Banana-stangir, Kókosbollur og Sexa, buff og bollur.',
      q: '„Súkkulaði- og kókoshúðaðir sykurpúðar.“' },
  ]
  return (
    <section className="sb-um" id="um" aria-labelledby="sb-um-t">
      <Reveal className="sb-wrap"><Ord id="sb-um-t" className="sb-disp" text="Nokkur orð | um okkur" /></Reveal>
      <Reveal className="sb-umK" hver margin="0px 0px -20% 0px">
        {kort.map((k, i) => (
          <article className="sb-umC sb-mask" key={k.n} style={{ '--grunnur': k.g } as CSSProperties}>
            <div className="sb-up sb-umI" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              <div className="sb-umM"><img src={Ms(k.a)} alt="" width={300} height={340} loading="lazy" /><img src={Ms(k.b)} alt="" width={300} height={340} loading="lazy" /></div>
              <p className="sb-umT">{k.t}</p>
              <div className="sb-umN"><b>{k.n}</b><small>{k.m}</small></div>
              <p className="sb-umQ">{k.q}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

function Saga() {
  return (
    <section className="sb-saga" id="saga">
      <Reveal><Ord className="sb-disp" text="Gamalt og nýtt" /></Reveal>
      <Reveal hver>
        {SOGUHOPAR.map((h, i) => (
          <div className="sb-sagaH sb-mask" key={h.h}>
            <p className="sb-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>{h.h}</p>
            <div className="sb-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              {h.r.map((r) => (
                <div className="sb-sagaR" key={r.t}><span>{r.t}</span><b>{r.a}</b></div>
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
function Linur() {
  const PIN = 4
  const ref = useFramvinda((el) => {
    const l = el.querySelector<HTMLElement>('.sb-linurL')
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
    <section className="sb-linur" id="linur" ref={ref} style={{ height: `calc(100svh + ${PIN * 100}svh)` }}>
      <div className="sb-linurP">
        <Reveal className="sb-wrap"><Ord className="sb-disp" text="Vörulínur" /></Reveal>
        <div className="sb-linurL">
          {LINUR.map((l) => {
            const f = KATALOGUR.find((x) => x.s === l.s)
            return (
              <button className="sb-lina2" key={l.s} data-bendill="Opna" style={{ ['--g' as string]: l.g }}
                onClick={() => pop.open({ k: 'flokkur', s: l.s })}>
                <figure><img src={M(l.img)} alt="" width={400} height={450} loading="lazy" /></figure>
                <div>
                  <h3>{l.t}</h3>
                  <p>{l.d}</p>
                  <span className="sb-lf"><span>{f?.items.length ?? 0} vörur</span><span>Skoða ↗</span></span>
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
    <section className="sb-yfirl" aria-label="Í þeirra eigin orðum">
      <Reveal className="sb-mask sb-maskP" margin="0px 0px -20% 0px">
        <h2 className="sb-sub sb-up" style={{ ['--dur' as string]: '1.24s' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="sb-panta">
        <p>Verslun, veitingastaður eða hótel? Settu vörur á pöntunarlistann og sendu Kólus eina fullbúna pöntun.</p>
        <span className="sb-pantaM"><img ref={mynd} src={Ms('thristur-stong')} alt="" width={460} height={110} /></span>
        <button className="sb-btn sb-casH" onClick={() => poki.open(true)}><Cas t="Opna pöntunarlistann" /></button>
      </div>
    </section>
  )
}

function Faq() {
  const [opid, setOpid] = useState(-1)
  const MYNDIR = ['thristur', 'kulusukk', 'lakkriskonfekt', 'froskar', 'snjoboltar', 'gammeldags-lakkris']
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  return (
    <section className="sb-faq" id="spurt">
      <div className="sb-faqK">
        <Reveal><Ord className="sb-disp" text="Spurt og | svarað" /></Reveal>
        <div className="sb-faqM" data-bendill="Næsta" onClick={() => { setFyrri(k); setK((k + 1) % MYNDIR.length) }}>
          {MYNDIR.map((m, j) => (
            <img key={m} src={M(m)} alt="" width={400} height={450} loading="lazy" className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
        </div>
        <div className="sb-faqT">
          <button className="sb-btn sb-casH" onClick={() => { setFyrri(k); setK((k + 1 + Math.floor(Math.random() * (MYNDIR.length - 1))) % MYNDIR.length) }}><Cas t="Handahóf" /></button>
          <button className="sb-btn sc sb-casH" onClick={() => faraA('#linur')}><Cas t="Vörulínur" /></button>
        </div>
      </div>
      <Reveal className="sb-faqL" hver>
        {SPURT.map((s, i) => (
          <div className={`sb-faqR sb-mask${opid === i ? ' opid' : ''}`} key={s.q}>
            <div className="sb-up" style={{ ...step(i % 4), ['--dur' as string]: '1.12s' }}>
              <button aria-expanded={opid === i} onClick={() => setOpid(opid === i ? -1 : i)}>
                {s.q}
                <i><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.3" /></svg></i>
              </button>
              <div className="sb-faqB"><div><p>{s.a}</p></div></div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* The footer: curtain on desktop/tablet, slogan wave, paint brush. */
const SLAGORD = 'Bragð af hefð'
const PENSILL = ['#D4A24C', '#F0CB1F', '#FFFFFF', '#B27FD0', '#8FD06A']

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

  /* the brush: the letter under the pointer lifts and takes a pack colour,
     one neighbour each side at half the lift (preset 2) */
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
        if (!c || c.textContent === ' ') return
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
  const opna = (e: ReactMouseEvent<HTMLElement>, p: PopState) => { e.preventDefault(); pop.open(p) }
  return (
    <div className="sb-fotM" ref={mask} style={{ height: H || undefined }}>
      <footer className="sb-fot" ref={fot}>
        <div className="sb-fotRod">
          <div>
            <div><small>Hafa samband</small>
              <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
              <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a><br />
              <a href={`mailto:${FYRIRTAEKI.fjarofloun}`}>{FYRIRTAEKI.fjarofloun}</a>
            </div>
            <div><small>Sambó</small>
              <a href="#vorur" onClick={(e) => { e.preventDefault(); faraA('#vorur') }}>Vörur</a><br />
              <a href="#linur" onClick={(e) => { e.preventDefault(); faraA('#linur') }}>Vörulínur</a><br />
              <a href="#ofnaemi" onClick={(e) => { e.preventDefault(); faraA('#ofnaemi') }}>Án ofnæmisvalda</a><br />
              <a href="#spurt" onClick={(e) => { e.preventDefault(); faraA('#spurt') }}>Spurt og svarað</a>
            </div>
            <div><small>Fyrirtæki og félög</small>
              <a href="#poki" onClick={(e) => { e.preventDefault(); poki.open(true) }}>Pöntunarlisti</a><br />
              <a href="#paska" onClick={(e) => opna(e, { k: 'fjarofloun' })}>Páskafjáröflun</a><br />
              <a href="#hvar" onClick={(e) => opna(e, { k: 'hvar' })}>Hvar fæst Sambó</a><br />
              <a href="#starf" onClick={(e) => opna(e, { k: 'starf' })}>Starfsumsókn</a>
            </div>
            <div><small>{FYRIRTAEKI.logadi}</small>
              <a href={FYRIRTAEKI.kort} target="_blank" rel="noopener noreferrer">{FYRIRTAEKI.heimili}</a><br />kt. {FYRIRTAEKI.kt}
            </div>
          </div>
          <button className="sb-fotUpp sb-casH" onClick={upp}><Cas t="Aftur upp" /> ↑</button>
        </div>
        <div className="sb-fotMerki">
          <img src={`${B}sambo/brand/merki-kremhvitt.webp`} alt="Sambó, the flavor of tradition" width={820} height={351} loading="lazy" />
        </div>
        <p className="sb-slogan" ref={slag} aria-label={SLAGORD}>
          {[...SLAGORD].map((c, i) => <span key={i} aria-hidden="true"><span>{c === ' ' ? '\u00A0' : c}</span></span>)}
        </p>
        <div className="sb-fotBot">
          <span>{FYRIRTAEKI.logadi} · kt. {FYRIRTAEKI.kt}</span>
          <span>Íslenskt einkafyrirtæki síðan 1962</span>
        </div>
      </footer>
    </div>
  )
}

export default function SamboPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Sambó | Bragð af hefð síðan 1962'
    document.documentElement.lang = 'is'
    setThemeColor(C.pappirHreint)
    const hash = window.location.hash
    const t = hash.length > 1 ? window.setTimeout(() => faraA(hash), 2800) : 0
    return () => {
      window.clearTimeout(t)
      poki.open(false); pop.close()
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])

  return (
    <div className="sb-root">
      <style>{CSS}{PAGE_CSS}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}{POP_CSS}{SKJAHVILA_CSS}{EYD_CSS}</style>
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
        <Kostir />
        <Galleri />
        <Ofnaemi />
        <Nammiregn />
        <Form />
        <Um />
        <Saga />
        <Linur />
        <Yfirlysing />
        <Faq />
        <Fotur />
      </main>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
