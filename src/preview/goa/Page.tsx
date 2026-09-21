import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
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
import { Popup, POP_CSS, pop } from './popup'
import { Skjahvila, SKJAHVILA_CSS } from './skjahvila'
import { KATALOGUR } from './katalogur'
import {
  ERINDI, FYRIRTAEKI, GALLERI, HERO_REITIR, JSON_LD, KORT3, LINUR, SETNING, SETNING_HRINGUR, SOGUHOPAR, SPJOLD, SPURT, TEXTI,
  TEYMI, TILVITNUN,
} from './data'

const company = getPreviewCompany('goa')

/* Every image path resolves against BASE_URL: the preview deploys under
   /iceland-frumgerdir/ on GitHub Pages. */
const B = import.meta.env.BASE_URL
const S = (img: string) => `${B}${img.replace(/^\//, '')}`
const M = (slug: string) => `${B}goa/${slug}.webp`

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
/* HERO (§5.1-5.2): exactly one viewport on desktop, 50/50, the right half on
   the element ground holding the scattered 4x3 grid; taller than the viewport
   on tablet and phone so the grid can be a grid. */
.goa-heroP{position:relative}
.goa-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}
.goa-heroT{display:flex;flex-direction:column;padding:12.96vh var(--gut) var(--gut) var(--gut)}
.goa-heroT h1{font-size:4.17vw}
.goa-heroAr{color:var(--c-rautt)}
.goa-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.goa-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:1.04vw;padding:14.72svh var(--gut) 5svh 3.75vw;height:100%}
.goa-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur)}
.goa-reit img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 14px 18px rgba(28,18,12,.28))}
.goa-reit:nth-child(1){grid-area:1/1/2/2}.goa-reit:nth-child(2){grid-area:1/2/2/3}
.goa-reit:nth-child(3){grid-area:2/2/3/3}.goa-reit:nth-child(4){grid-area:2/3/3/4}
.goa-reit:nth-child(5){grid-area:2/4/3/5}.goa-reit:nth-child(6){grid-area:3/1/4/2}
.goa-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .goa-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .goa-heroT{padding:calc(var(--haus-h,60px) + 9.091vh) var(--gut) 2.604vw}
  .goa-heroT h1{font-size:7.292vw}
  .goa-heroSlag{margin-top:2rem}
  .goa-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:2.604vw;height:auto}
  .goa-reit{aspect-ratio:3/4}
  .goa-reit:nth-child(n){grid-area:auto}
  .goa-reit:nth-child(1){grid-column:1}.goa-reit:nth-child(2){grid-column:2}
  .goa-reit:nth-child(3){grid-column:2}.goa-reit:nth-child(4){grid-column:3}
  .goa-reit:nth-child(5){display:none}
  .goa-reit:nth-child(6){grid-column:1}.goa-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .goa-heroT{padding:calc(var(--haus-h,60px) + 16vw) var(--gut) 5.556vw}
  .goa-heroT h1{font-size:min(13.333vw,3.4rem)}
  .goa-rist{padding:2.778vw}
}

/* QUOTE (§1 quote section, §4.6): one centred sentence at the section scale,
   56.6vw wide, image chips at .81em x .72em between the words, and every
   chip cycles its own pictures forever (pause 1.5s, 0.5s mask rise). */
.goa-tilvS{display:flex;justify-content:center}
.goa-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.goa-setning{width:80.078vw}}
@media (max-width:479px){.goa-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.goa-setL{display:block}
.goa-setL span{margin:0 .08em}
.goa-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.goa-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;
  transform:translateY(105%);transition:transform .5s var(--ease)}
.goa-bitiM img.nu{transform:none}
.goa-bitiM img.farin{transform:translateY(-105%)}

/* PRODUCT (§5.2 product, §6 swatches): two half-width panels, one viewport
   tall, each a big pack on the element ground with a bottom bar: label and
   pack size, the variant swatches, then Nánar and the bag. Stacks on
   compact, each panel a screen tall less the bar. */
.goa-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.goa-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.goa-spjald:nth-child(2){background:var(--c-el2)}
.goa-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer}
.goa-spjaldM img{position:absolute;inset:8% 10%;width:80%;height:84%;object-fit:contain;
  filter:drop-shadow(0 28px 34px rgba(28,18,12,.28));transform:translateY(105%);transition:transform .8s var(--ease)}
.goa-spjaldM img.nu{transform:none}
.goa-spjaldM img.farin{transform:translateY(-105%)}
.goa-spjald:not(.on) .goa-spjaldM img.nu{transform:translateY(105%)}
.goa-root.goa-allt .goa-spjaldM img.nu{transform:none}
.goa-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.goa-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.goa-stika b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.9vw;letter-spacing:-.02em;line-height:1.05}
.goa-stika .goa-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.goa-lit{display:flex;flex-direction:column;gap:.4rem}
.goa-lit div{display:flex;gap:.25rem}
.goa-lit button{width:28px;height:28px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.goa-lit button::before{content:'';width:16px;height:16px;border-radius:50%;background:var(--l);
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:box-shadow .25s var(--ease)}
.goa-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.goa-takkar{display:flex;gap:.4rem}
.goa-takkar .goa-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .goa-vorur{grid-template-columns:1fr;height:auto}
  .goa-spjald{height:calc(100svh - 10.416vw)}
  .goa-stika b{font-size:3.6vw}
}
@media (max-width:479px){
  .goa-spjald{height:calc(100svh - 22.223vw)}
  .goa-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .goa-stika b{font-size:7vw}
  .goa-takkar{grid-column:1/-1}
  .goa-takkar > *{flex:1}
}

/* ADVANTAGES (§5.2): title, then three cards 31.25vw x 30.625vw, ground by
   position, label top-left, a line centred, index bottom-left. Tablet: a
   swipeable row, one card at a time. Phone: stacked, each card its own
   trigger. */
.goa-kostir{display:flex;flex-direction:column;row-gap:6.4815vh;padding:0 var(--gut)}
.goa-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.goa-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.goa-kort:nth-child(2){background:var(--c-el3)}
.goa-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.25vw}
.goa-kort small{font-size:.8rem;color:var(--c-ink-med)}
.goa-kort h3{margin:0;font-weight:400;text-align:center;font-family:var(--f-disp);font-size:2.08vw;line-height:1.05;letter-spacing:-.02em;padding:0 8%}
.goa-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .goa-kostir{row-gap:2.273vh}
  .goa-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .goa-kortin::-webkit-scrollbar{display:none}
  .goa-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .goa-kort h3{font-size:3.255vw}
}
@media (max-width:479px){
  .goa-kostir{row-gap:3.125vh}
  .goa-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:2.778vw}
  .goa-kort{width:100%;flex:none;height:94.444vw}
  .goa-kort h3{font-size:7.4vw}
  .goa-kort > div{padding:4vw}
}

/* GALLERY (§12 mouse-scroll): a centred headline, then a strip of packs at
   21.1vh x 25.9vh along the bottom. On a mouse: the hovered pack scales
   1.3x from its base and its neighbours slide out of the way, and the strip
   drifts toward the cursor. On touch: a native swipe row. Click opens the
   product. The slowest reveal on the page, 2.44s: the more there is to look
   at, the longer it takes to arrive (§4.4). */
.goa-gal{display:flex;flex-direction:column;row-gap:9.2593vh}
.goa-galT{width:62vw}
.goa-galK{overflow:hidden;padding:4.5vh 0 0}
.goa-galL{display:flex;gap:.7vw;padding:0 var(--gut);list-style:none;margin:0;will-change:transform;width:max-content}
.goa-galL li{width:21.1111vh;height:25.9259vh;flex:none;overflow:hidden}
.goa-galI{display:block;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:var(--g);position:relative;
  transform-origin:50% 100%;transition:transform .6s var(--ease)}
.goa-galI img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.3));
  transform:translateY(105%);transition:transform var(--dur,2.44s) var(--ease);transition-delay:var(--d,0s)}
.on .goa-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .goa-galL li{overflow:visible}
  .goa-galL li:hover .goa-galI{transform:scale(1.3)}
  .goa-galL li:hover ~ li .goa-galI{transform:translateX(15%)}
  .goa-galL li:has(~ li:hover) .goa-galI{transform:translateX(-15%)}
}
@media (max-width:991px){
  .goa-gal{row-gap:3.788vh}
  .goa-galT{width:auto;padding:0 var(--gut)}
  .goa-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .goa-galK::-webkit-scrollbar{display:none}
  .goa-galL li{width:14.714vw;height:19.01vw;scroll-snap-align:start}
}
@media (max-width:479px){.goa-gal{row-gap:3.75vh}.goa-galL li{width:34.167vw;height:44.444vw}}

/* FORM (§1 form section, §9 quiz): two tab titles side by side, the idle
   one dimmed; under them one panel on the element ground. The quiz is
   noho's shape: a question, a 2x2 grid of white option fields with a round
   radio, a full-width dark button counting the step. */
.goa-form{padding:0 var(--gut)}
.goa-flipar{display:flex;gap:2.5vw;align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.goa-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:color .4s var(--ease)}
.goa-flipar button[aria-selected="true"]{color:var(--c-ink)}
.goa-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.goa-formP{background:var(--c-el);padding:1.6vw;display:grid;gap:1rem;max-width:60vw}
.goa-formP > p{margin:0}
.goa-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.goa-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.063vw;
  padding:0 1.04vw;cursor:pointer;color:#2D1105}
.goa-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #2D1105;margin:0;flex:none;
  transition:box-shadow .2s var(--ease)}
.goa-val input:checked{box-shadow:inset 0 0 0 4px #FFFDF8,inset 0 0 0 9px #2D1105}
.goa-nidur{background:var(--c-form);padding:1.2rem 1.04vw;color:#2D1105;display:grid;gap:.7rem}
.goa-nidur p{margin:0}
.goa-nidur .goa-btn{justify-self:start}
.goa-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.goa-reitir .heild{grid-column:1/-1}
.goa-reitir label{position:relative;display:block}
.goa-reitir input,.goa-reitir textarea{width:100%;border:0;background:var(--c-form);color:#2D1105;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem 1.04vw;min-height:4.063vw;border-radius:0}
.goa-reitir textarea{min-height:8rem;resize:vertical}
.goa-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:background .2s}
.goa-reitir label.gott i{background:#88C159}.goa-reitir label.villa i{background:#DC5B5B}
.goa-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.goa-teymiL div{background:var(--c-form);padding:.8rem 1.04vw;color:#2D1105;font-size:.86rem}
.goa-teymiL b{display:block;font-weight:500}
.goa-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.goa-form{padding:0}.goa-flipar{padding:0 var(--gut)}.goa-formP{max-width:none;padding:2.6vw var(--gut)}
  .goa-val label,.goa-reitir input{min-height:6.51vw}.goa-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:479px){.goa-val,.goa-reitir{grid-template-columns:1fr}.goa-val label,.goa-reitir input{min-height:13.889vw}
  .goa-teymiL{grid-template-columns:1fr}}

/* ABOUT (§5.2 about-us, §6 photo switcher): two cards edge to edge, half the
   width each; a picture and a name at the top, the text beside it, and a
   line of their own words at the foot. Hover swaps the picture behind a mask. */
.goa-um{display:flex;flex-direction:column;row-gap:5.1852vh}
.goa-um > .goa-wrap{width:100%}
.goa-umK{display:flex}
.goa-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.goa-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem 2vw}
.goa-umC:nth-child(2){background:var(--c-el3)}
.goa-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--grunnur)}
.goa-umM img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;transition:transform .7s var(--ease)}
.goa-umM img + img{transform:translateY(105%)}
@media (hover:hover) and (pointer:fine){.goa-umC:hover .goa-umM img:first-child{transform:translateY(-105%)}
  .goa-umC:hover .goa-umM img + img{transform:none}}
.goa-umN b{display:block;font-weight:500}
.goa-umN small{color:var(--c-ink-med)}
.goa-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.goa-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:2.08vw;line-height:1.1;letter-spacing:-.02em;max-width:26ch}
@media (max-width:991px){.goa-umC{min-height:52.083vw}.goa-umM{width:14vw}.goa-umQ{font-size:3.255vw}}
@media (max-width:479px){.goa-umK{flex-direction:column}.goa-umC{width:100%;min-height:auto}.goa-umI{grid-template-columns:1fr}
  .goa-umT{grid-column:1;grid-row:auto}.goa-umM{width:30vw}.goa-umQ{font-size:6.4vw}}

/* AWARDS -> the history (§22 big-link): group labels on the left third, the
   rows on the right two thirds with the year right-aligned; hovering a row
   lays the form ground under it and slides the text in 0.8333vw. */
.goa-saga{display:flex;flex-direction:column;row-gap:6.2963vh;padding:0 var(--gut)}
.goa-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.goa-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.goa-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.goa-sagaR span{display:inline-block;padding:.35rem .8333vw;margin-left:-.8333vw;transition:transform .4s var(--ease),background-color 0s}
.goa-sagaR b{font-family:var(--f-disp);font-weight:400;font-size:2.08vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.goa-sagaR:hover span{background:var(--c-form);color:#2D1105;transform:translateX(.8333vw)}}
@media (max-width:991px){.goa-sagaR b{font-size:3.255vw}}
@media (max-width:479px){.goa-sagaH{grid-template-columns:1fr}.goa-sagaR b{font-size:6.4vw}}

/* BLOG -> the lines (§14): desktop pins the section for 400% of a viewport
   and staggers the cards left, each coming to rest 20% short of the last so
   they stack. Compact: a plain swipe row. Cards 44.17vw x 24.74vw, grounds
   cycling third/second/first. */
.goa-linur{position:relative}
.goa-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:6.2963vh;overflow:hidden}
.goa-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.goa-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.goa-lina2:nth-child(3n+2){background:var(--c-el2)}.goa-lina2:nth-child(3n+3){background:var(--c-el)}
.goa-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.goa-lina2 figure img{position:absolute;inset:12%;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(28,18,12,.28));
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.goa-lina2:hover figure img{transform:scale(1.06) rotate(-2deg)}}
.goa-lina2 > div{display:flex;flex-direction:column;padding:1.25vw;gap:.6rem}
.goa-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:400;font-size:2.08vw;line-height:1.05;letter-spacing:-.02em}
.goa-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.goa-lina2 .goa-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .goa-linur{height:auto !important}
  .goa-linurP{position:relative;height:auto;overflow:visible}
  .goa-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .goa-linurL::-webkit-scrollbar{display:none}
  .goa-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .goa-lina2 h3{font-size:3.255vw}
}
@media (max-width:479px){.goa-lina2{width:83.333vw;height:111.111vw}.goa-lina2 h3{font-size:7vw}.goa-lina2 > div{padding:4vw}}

/* SUSTAINABILITY -> their own words (§20): a centred statement, then a row
   with a line and a button whose hover opens a clipped picture strip from
   width 0. */
.goa-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:4.4444vh;padding:0 var(--gut)}
.goa-yfirl .goa-sub{width:min(58vw,60rem);text-align:center}
.goa-panta{display:flex;align-items:center;gap:2.5vw}
.goa-panta p{margin:0;max-width:24ch;font-size:.92rem}
.goa-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:width .5s var(--ease);height:max(3vw,44px)}
.goa-pantaM img{height:100%;width:auto;max-width:none}
@media (hover:hover) and (pointer:fine){.goa-panta:has(.goa-btn:hover) .goa-pantaM{width:var(--bw,10rem)}}
@media (max-width:991px){.goa-yfirl .goa-sub{width:80vw}.goa-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.goa-yfirl{align-items:flex-start}.goa-yfirl .goa-sub{width:auto;text-align:left}
  .goa-panta{align-items:flex-start;text-align:left}}

/* FAQ (§11, §5.2): a sticky card on the left, 46.875vw x 79.44vh, with the
   title and a pack you can swap; single-open accordion rows on the right,
   white, with a plus that turns 45 degrees. Height 0.32s on custom-our; the
   answer fades in at half-way, the one fade the reference itself uses. */
.goa-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.goa-faqK{position:sticky;top:var(--gut);height:79.4444vh;background:var(--c-el);display:flex;flex-direction:column;
  justify-content:space-between;padding:1.25vw;overflow:hidden}
.goa-faqM{position:relative;flex:1;overflow:hidden}
.goa-faqM img{position:absolute;inset:10% 15%;width:70%;height:80%;object-fit:contain;filter:drop-shadow(0 24px 30px rgba(28,18,12,.28));
  transform:translateY(105%);transition:transform .8s var(--ease)}
.goa-faqM img.nu{transform:none}.goa-faqM img.farin{transform:translateY(-105%)}
.goa-faqL{display:grid;gap:.35rem}
.goa-faqR{background:var(--c-form);color:#2D1105}
.goa-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 1.04vw;min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.goa-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(45,17,5,.08)}
.goa-faqR button svg{transition:transform .32s var(--ease)}
.goa-faqR.opid button svg{transform:rotate(45deg)}
.goa-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s var(--ease)}
.goa-faqR.opid .goa-faqB{grid-template-rows:1fr}
.goa-faqB > div{overflow:hidden}
.goa-faqB p{margin:0;padding:0 1.04vw 1.1rem;max-width:60ch;opacity:0;transition:opacity .16s var(--ease)}
.goa-faqR.opid .goa-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.goa-faq{grid-template-columns:46.094vw 1fr}.goa-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.goa-faq{grid-template-columns:1fr}.goa-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:9.375vh}}

/* FOOTER (§18, §19, §4.5): on desktop and tablet the footer sits in a mask
   and is pulled from yPercent -100 to 0 as the mask scrolls in, scrubbed, a
   curtain rather than a block arriving. Its last line is the slogan, split
   to letters that rise as a wave against the same scroll, and once it has
   landed the pointer paints the letters it passes in the pack colours.
   Góa's crest sits above it as the statement piece (Sindri's ask); the
   ground is Góa red rather than noho's tan (declared). */
.goa-fotM{position:relative;overflow:hidden}
.goa-fot{background:#C21514;color:#F8F1E4;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.goa-fotRod{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;font-size:.86rem;line-height:1.7}
.goa-fotRod > div{display:flex;gap:4vw;flex-wrap:wrap}
.goa-fotRod small{display:block;opacity:.7;font-size:.78rem}
.goa-fot a{text-decoration:none;display:inline-flex;min-height:28px;align-items:center}
@media (hover:hover) and (pointer:fine){.goa-fot a:hover{text-decoration:underline;text-underline-offset:3px}}
.goa-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:flex-start}
.goa-fotMerki{width:clamp(12rem,26vw,24rem);margin:8.1481vh auto 4vh}
.goa-fotMerki img{width:100%;height:auto}
.goa-slogan{font-family:var(--f-disp);font-weight:400;font-size:12.2vw;line-height:1;letter-spacing:-.035em;
  white-space:nowrap;text-align:center;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.goa-slogan span{display:inline-block;will-change:transform;transition:color .18s ease-out}
.goa-slogan span > span{display:inline-block;transition:transform .28s ease-out}
.goa-fotBot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;opacity:.8}
@media (max-width:479px){.goa-fotRod > div{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1rem}.goa-slogan{font-size:13.4vw}}
`

/* ---------------------------------------------------------------- *
 * Sections
 * ---------------------------------------------------------------- */

function Hero() {
  return (
    <div className="goa-heroP">
      <section className="goa-hero" id="top">
        <Reveal className="goa-heroT">
          <div>
            <Merki>Góa-Linda · Garðahrauni 2, Garðabæ</Merki>
            <h1 className="goa-disp">
              {TEXTI.heroLinur.map((l, i) => (
                <span className="goa-mask" key={l}><span className="goa-up goa-lina" style={step(i)}>{l}</span></span>
              ))}
              <span className="goa-mask">
                <span className="goa-up goa-lina goa-heroAr" style={step(TEXTI.heroLinur.length)}>{TEXTI.heroAr}</span>
              </span>
            </h1>
          </div>
          <p className="goa-heroSlag goa-mask goa-maskP">
            <span className="goa-up" style={{ ...step(4), ['--dur' as string]: '.75s' }}>{TEXTI.heroUndir}</span>
          </p>
        </Reveal>
        <Reveal className="goa-rist">
          {HERO_REITIR.map((r, i) => (
            <figure className="goa-reit goa-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}>
              <img className="goa-up" style={step(i)} src={S(r.img)} alt={r.n} width={300} height={400}
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
  useEffect(() => {
    if (myndir.length < 2 || reduced()) return
    let t = 0
    const start = window.setTimeout(() => {
      t = window.setInterval(() => {
        if (document.documentElement.querySelector('.goa-root[data-hreyfing="min"]')) return
        setK((v) => (v + 1) % myndir.length)
      }, 2000)
    }, 700 * hlid)
    return () => { window.clearTimeout(start); window.clearInterval(t) }
  }, [myndir.length, hlid])
  const fyrri = (k - 1 + myndir.length) % myndir.length
  return (
    <span className="goa-bitiM" style={{ '--grunnur': grunnur, '--b': b ?? 1 } as CSSProperties}>
      {myndir.map((m, i) => (
        <img key={m} src={M(m)} alt={i === k ? n : ''} width={120} height={106} loading="lazy" decoding="async"
          className={i === k ? 'nu' : i === fyrri && myndir.length > 1 ? 'farin' : ''}
          style={i !== k && i !== fyrri ? { transition: 'none' } : undefined} />
      ))}
    </span>
  )
}

function Tilvitnun() {
  let chip = 0
  return (
    <section className="goa-tilvS" aria-label="Um Góu í einni setningu">
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="goa-disp goa-setning">
          {SETNING.map((lina, li) => (
            <span className="goa-mask goa-setL" key={li}>
              <span className="goa-up goa-lina" style={{ ...step(li), ['--dur' as string]: '1.36s' }}>
                {lina.map((b, i) =>
                  't' in b ? <span key={i}>{b.t}</span>
                    : <Biti key={i} n={b.n} grunnur={b.grunnur} b={b.b} fyrsta={b.img.replace('/goa/', '').replace('.webp', '')} hlid={chip++} />,
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
  const vara = { nr: v.nr, n: v.n, pk: v.pk, pdf: v.pdf, img: v.img, d: '' }
  return (
    <Reveal className="goa-spjald" as="article">
      <div className="goa-spjaldM" data-bendill="Skoða" onClick={() => pop.open({ k: 'vara', v: vara, flokkur: s.merki })}>
        {s.tegundir.map((t, j) => (
          <img key={t.img} src={M(t.img)} alt={j === k ? t.n : ''} width={900} height={600} loading="lazy" decoding="async"
            className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
            style={j !== k && j !== fyrri ? { transition: 'none' } : { transitionDelay: fyrri < 0 ? `${0.12 * i}s` : '0s' }} />
        ))}
      </div>
      <div className="goa-stika">
        <div>
          <small>{s.merki}</small>
          <b>{v.n}</b>
          <span className="goa-pk">{v.pk} · vörunr. {v.nr}</span>
        </div>
        <div className="goa-lit">
          <small>Tegund</small>
          <div role="group" aria-label={`Tegundir af ${s.titill}`}>
            {s.tegundir.map((t, j) => (
              <button key={t.nr} aria-pressed={j === k} aria-label={t.n} style={{ ['--l' as string]: t.lit }}
                onClick={() => { if (j !== k) { setFyrri(k); setK(j) } }} />
            ))}
          </div>
        </div>
        <div className="goa-takkar">
          <button className="goa-btn sc goa-casH" onClick={() => pop.open({ k: 'vara', v: vara, flokkur: s.merki })}><Cas t="Nánar" /></button>
          <SettIPoka v={vara} />
        </div>
      </div>
    </Reveal>
  )
}

function Vorur() {
  return (
    <section className="goa-vorur" id="vorur" aria-label="Vörur">
      {SPJOLD.map((s, i) => <Spjald key={s.titill} s={s} i={i} />)}
    </section>
  )
}

function Kostir() {
  return (
    <section className="goa-kostir">
      <Reveal><Ord className="goa-disp" text="Góðgæti | síðan 1968" /></Reveal>
      <Reveal className="goa-kortin" hver>
        {KORT3.map((k, i) => (
          <div className="goa-kort goa-mask" key={k.nr}>
            <div className="goa-up" style={{ ...step(i), ['--dur' as string]: '1.24s' }}>
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
    <section className="goa-gal" aria-labelledby="goa-gal-t">
      <Reveal className="goa-galT goa-midja" margin="0px 0px -40% 0px">
        <Ord id="goa-gal-t" className="goa-disp" text={"Næststærsti | sælgætis\u00ADframleiðandi | landsins"} />
      </Reveal>
      <div className="goa-galK">
        <Reveal as="ul" className="goa-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.nr}>
              <button className="goa-galI" style={{ ['--g' as string]: g.g, ['--d' as string]: `${(i * 0.06).toFixed(2)}s` }}
                data-bendill="Skoða" aria-label={`${g.n}, nánar`}
                onClick={() => pop.open({ k: 'vara', v: { nr: g.nr, n: g.n, pk: g.pk, pdf: g.pdf, img: g.img, d: '' }, grunnur: g.g })}>
                <img src={M(g.img)} alt="" width={300} height={400} loading="lazy" decoding="async" />
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
    const k = document.querySelector<HTMLElement>('.goa-galK')
    const l = document.querySelector<HTMLElement>('.goa-galL')
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
  const [skref, setSkref] = useState(1)
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
  const gera = (l: Leid) => {
    if (l.hlekkur === '#hillan') { poki.open(true); return }
    window.location.href = l.hlekkur
  }
  const senda = (e: FormEvent) => {
    e.preventDefault()
    setSnert({ nafn: true, netfang: true, skilabod: true })
    if (gott.nafn && gott.netfang && gott.skilabod) setSent(true)
  }
  return (
    <section className="goa-form" id="erindi">
      <div className="goa-flipar goa-disp" role="tablist" aria-label="Hafa samband">
        <button role="tab" aria-selected={flipi === 'quiz'} onClick={() => setFlipi('quiz')}>Hvert er erindið?</button>
        <button role="tab" aria-selected={flipi === 'spyrja'} onClick={() => setFlipi('spyrja')}>Senda fyrirspurn</button>
      </div>
      <Reveal className="goa-formP goa-mask" margin="0px 0px -20% 0px">
        <div className="goa-up" style={{ display: 'grid', gap: '1rem' }}>
          {flipi === 'quiz' ? (
            skref === 1 ? (
              <>
                <p>Hvað færir þig til Góu í dag?</p>
                <div className="goa-val" role="radiogroup" aria-label="Erindi">
                  {ERINDI.map((e, i) => (
                    <label key={e.nafn}>
                      {e.nafn}
                      <input type="radio" name="goa-erindi" checked={val === i} onChange={() => setVal(i)} />
                    </label>
                  ))}
                </div>
                <button className="goa-btn stor goa-casH" disabled={val === null} onClick={() => setSkref(2)}><Cas t="Áfram 1/2" /></button>
              </>
            ) : leid ? (
              <>
                <div className="goa-nidur">
                  <p className="goa-merki" style={{ margin: 0, color: 'rgba(45,17,5,.6)' }}>{leid.nafn}</p>
                  <p>{leid.nota}</p>
                  <button className="goa-btn goa-casH" onClick={() => gera(leid)}><Cas t={leid.hlekkur === '#hillan' ? 'Opna nammipokann' : leid.ord} /></button>
                </div>
                <button className="goa-btn sc stor goa-casH" onClick={() => { setSkref(1); setVal(null) }}><Cas t="Til baka 2/2" /></button>
              </>
            ) : null
          ) : sent ? (
            <div className="goa-nidur">
              <p>Takk, {gildi.nafn.split(' ')[0]}. Svona berst fyrirspurnin á goa@goa.is.</p>
              <p className="goa-smatt" style={{ color: 'rgba(45,17,5,.6)' }}>Þetta er frumgerð og ekkert var sent.</p>
              <button className="goa-btn sc goa-casH" onClick={() => { setSent(false); setGildi({ nafn: '', netfang: '', skilabod: '' }); setSnert({}) }}><Cas t="Ný fyrirspurn" /></button>
            </div>
          ) : (
            <form onSubmit={senda} noValidate style={{ display: 'grid', gap: '.35rem' }}>
              <div className="goa-reitir">
                <label className={lbl('nafn')}>
                  <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Nafn</span>
                  <input placeholder="Nafn" autoComplete="name" value={gildi.nafn} onBlur={() => setSnert((s) => ({ ...s, nafn: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, nafn: e.target.value }))} /><i />
                </label>
                <label className={lbl('netfang')}>
                  <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Netfang</span>
                  <input placeholder="Netfang" type="email" autoComplete="email" value={gildi.netfang} onBlur={() => setSnert((s) => ({ ...s, netfang: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, netfang: e.target.value }))} /><i />
                </label>
                <label className={`heild ${lbl('skilabod')}`}>
                  <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Skilaboð</span>
                  <textarea placeholder="Skilaboð" value={gildi.skilabod} onBlur={() => setSnert((s) => ({ ...s, skilabod: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, skilabod: e.target.value }))} /><i />
                </label>
              </div>
              <button type="submit" className="goa-btn stor goa-casH"><Cas t="Senda fyrirspurn" /></button>
              <div className="goa-teymiL">
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
    { n: 'Góa', m: 'Sælgætisgerð, stofnuð 1968', a: 'karamellur', b: 'toffi-sleikjo', g: '#FFAB03',
      t: 'Til að byrja með átti fyrirtækið eina karamelluvél. Árið 1973 hófst framleiðsla á Hraun-súkkulaðinu, sem hefur verið vinsælasta vara Góu upp frá því. Samhliða framleiðslunni flytur Góa inn sælgæti sem dreift er til söluturna og dreifingaraðila.',
      q: '„Góa er í dag næststærsti sælgætisframleiðandi landsins.“' },
    { n: 'Linda', m: 'Súkkulaðigerð frá Akureyri', a: 'lindor', b: 'lindu-mjolkursukkuladi', g: '#FDC851',
      t: 'Árið 1993 runnu í eina sæng tvær ástsælustu sælgætisgerðir landsins, Góa í Hafnarfirði og Linda á Akureyri. Lindubuff, Lindor og suðusúkkulaðið eru enn á vörulistanum.',
      q: '„Sumir starfsmenn hafa starfað hjá fyrirtækinu í yfir 40 ár.“' },
  ]
  return (
    <section className="goa-um" aria-labelledby="goa-um-t">
      <Reveal className="goa-wrap"><Ord id="goa-um-t" className="goa-disp" text="Nokkur orð | um okkur" /></Reveal>
      <Reveal className="goa-umK" hver margin="0px 0px -20% 0px">
        {kort.map((k, i) => (
          <article className="goa-umC goa-mask" key={k.n} style={{ '--grunnur': k.g } as CSSProperties}>
            <div className="goa-up goa-umI" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              <div className="goa-umM"><img src={M(k.a)} alt="" width={300} height={300} loading="lazy" /><img src={M(k.b)} alt="" width={300} height={300} loading="lazy" /></div>
              <p className="goa-umT">{k.t}</p>
              <div className="goa-umN"><b>{k.n}</b><small>{k.m}</small></div>
              <p className="goa-umQ">{k.q}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

function Saga() {
  return (
    <section className="goa-saga" id="saga">
      <Reveal><Ord className="goa-disp" text="Sagan" /></Reveal>
      <Reveal hver>
        {SOGUHOPAR.map((h, i) => (
          <div className="goa-sagaH goa-mask" key={h.h}>
            <p className="goa-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>{h.h}</p>
            <div className="goa-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              {h.r.map((r) => (
                <div className="goa-sagaR" key={r.a}><span>{r.t}</span><b>{r.a}</b></div>
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
    const l = el.querySelector<HTMLElement>('.goa-linurL')
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
    <section className="goa-linur" id="linur" ref={ref} style={{ height: `calc(100svh + ${PIN * 100}svh)` }}>
      <div className="goa-linurP">
        <Reveal className="goa-wrap"><Ord className="goa-disp" text="Vörulínur" /></Reveal>
        <div className="goa-linurL">
          {LINUR.map((l) => {
            const f = KATALOGUR.find((x) => x.s === l.s)
            return (
              <button className="goa-lina2" key={l.s} data-bendill="Opna" style={{ ['--g' as string]: l.g }}
                onClick={() => pop.open({ k: 'flokkur', s: l.s })}>
                <figure><img src={M(l.img)} alt="" width={400} height={400} loading="lazy" /></figure>
                <div>
                  <h3>{l.t}</h3>
                  <p>{l.d}</p>
                  <span className="goa-lf"><span>{f?.items.length ?? 0} vörur</span><span>Skoða ↗</span></span>
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
    <section className="goa-yfirl" aria-label="Í þeirra eigin orðum">
      <Reveal className="goa-mask goa-maskP" margin="0px 0px -20% 0px">
        <h2 className="goa-sub goa-up" style={{ ['--dur' as string]: '1.24s' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="goa-panta">
        <p>Lakkríssalan í Garðahrauni 2 er opin virka daga frá 8 til 16. Verslanir panta í nammipokann.</p>
        <span className="goa-pantaM"><img ref={mynd} src={M('hraun')} alt="" width={900} height={257} /></span>
        <button className="goa-btn goa-casH" onClick={() => poki.open(true)}><Cas t="Opna nammipokann" /></button>
      </div>
    </section>
  )
}

function Faq() {
  const [opid, setOpid] = useState(-1)
  const MYNDIR = ['paskaegg-11', 'risahraun', 'bangsahlaup', 'appolo-hjup', 'karamellur']
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  return (
    <section className="goa-faq" id="spurt">
      <div className="goa-faqK">
        <Reveal><Ord className="goa-disp" text="Spurt og | svarað" /></Reveal>
        <div className="goa-faqM" data-bendill="Næsta" onClick={() => { setFyrri(k); setK((k + 1) % MYNDIR.length) }}>
          {MYNDIR.map((m, j) => (
            <img key={m} src={M(m)} alt="" width={400} height={600} loading="lazy" className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="goa-btn goa-casH" onClick={() => { setFyrri(k); setK((k + 1 + Math.floor(Math.random() * (MYNDIR.length - 1))) % MYNDIR.length) }}><Cas t="Handahóf" /></button>
          <button className="goa-btn sc goa-casH" onClick={() => faraA('#linur')}><Cas t="Vörulínur" /></button>
        </div>
      </div>
      <Reveal className="goa-faqL" hver>
        {SPURT.map((s, i) => (
          <div className={`goa-faqR goa-mask${opid === i ? ' opid' : ''}`} key={s.q}>
            <div className="goa-up" style={{ ...step(i % 4), ['--dur' as string]: '1.12s' }}>
              <button aria-expanded={opid === i} onClick={() => setOpid(opid === i ? -1 : i)}>
                {s.q}
                <i><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.3" /></svg></i>
              </button>
              <div className="goa-faqB"><div><p>{s.a}</p></div></div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* The footer: curtain on desktop/tablet, slogan wave, paint brush. */
const SLAGORD = 'góðgæti frá Góu'
const PENSILL = ['#F9D100', '#BAE31C', '#FDC851', '#FFFFFF', '#F0913F']

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
    const rm = reduced() || !!document.querySelector('.goa-root[data-hreyfing="min"]')
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
      if (!lokid.current || document.querySelector('.goa-root[data-hreyfing="min"]')) return
      const stafir = [...s.children] as HTMLElement[]
      let best = -1, bd = Infinity
      stafir.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); if (d < bd && r.width > 0) { bd = d; best = i } })
      if (best < 0) return
      settle()
      ;[[0, 0.25], [-1, 0.125], [1, 0.125]].forEach(([o, w]) => {
        const c = stafir[best + o]
        if (!c || c.textContent === ' ') return
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
  return (
    <div className="goa-fotM" ref={mask} style={{ height: H || undefined }}>
      <footer className="goa-fot" ref={fot}>
        <div className="goa-fotRod">
          <div>
            <div><small>Hafa samband</small>
              <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
              <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a><br />
              <a href={`mailto:${FYRIRTAEKI.pantanir}`}>{FYRIRTAEKI.pantanir}</a>
            </div>
            <div><small>Góa</small>
              <a href="#vorur" onClick={(e) => { e.preventDefault(); faraA('#vorur') }}>Vörur</a><br />
              <a href="#linur" onClick={(e) => { e.preventDefault(); faraA('#linur') }}>Vörulínur</a><br />
              <a href="#saga" onClick={(e) => { e.preventDefault(); faraA('#saga') }}>Sagan</a><br />
              <a href="#spurt" onClick={(e) => { e.preventDefault(); faraA('#spurt') }}>Spurt og svarað</a>
            </div>
            <div><small>Tenglar</small>
              <a href={FYRIRTAEKI.facebook} target="_blank" rel="noopener">Facebook</a><br />
              <a href="https://goa.is/uploads/Goa-logo.zip">Góa merkjapakki</a><br />
              <a href="https://goa.is/uploads/Linda-logo.zip">Linda merkjapakki</a><br />
              <a href="https://goa.is/uploads/appolo-logo.zip">Appolo merkjapakki</a>
            </div>
            <div><small>Lakkríssalan</small>
              {FYRIRTAEKI.heimili}<br />Virka daga 8.00–16.00
            </div>
          </div>
          <button className="goa-fotUpp goa-casH" onClick={upp}><Cas t="Aftur upp" /> ↑</button>
        </div>
        <div className="goa-fotMerki">
          <img src={`${B}goa/goa-merki-stort.svg`} alt="Góa, stofnað 1968" width={184} height={230} loading="lazy" />
        </div>
        <p className="goa-slogan" ref={slag} aria-label={SLAGORD}>
          {[...SLAGORD].map((c, i) => <span key={i} aria-hidden="true"><span>{c === ' ' ? ' ' : c}</span></span>)}
        </p>
        <div className="goa-fotBot">
          <span>{FYRIRTAEKI.logadi} · kt. {FYRIRTAEKI.kt}</span>
          <span>Sælgætisgerð síðan 1968</span>
        </div>
      </footer>
    </div>
  )
}

export default function GoaPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Góa | Sælgætisgerð síðan 1968'
    document.documentElement.lang = 'is'
    const root = document.querySelector('.goa-root') as HTMLElement | null
    const syncTheme = () => setThemeColor(root?.dataset.tema === 'dokkt' ? C.dokkt : C.pappirHreint)
    syncTheme()
    const mo = root ? new MutationObserver(syncTheme) : null
    mo?.observe(root as HTMLElement, { attributes: true, attributeFilter: ['data-tema'] })
    const hash = window.location.hash
    const t = hash.length > 1 ? window.setTimeout(() => faraA(hash), 2800) : 0
    return () => {
      window.clearTimeout(t)
      mo?.disconnect()
      poki.open(false); pop.close()
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])

  return (
    <div className="goa-root">
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
        <Kostir />
        <Galleri />
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
