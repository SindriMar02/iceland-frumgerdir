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

const company = getPreviewCompany('katla')

/* Every image path resolves against BASE_URL: the preview deploys under
   /iceland-frumgerdir/ on GitHub Pages. */
const B = import.meta.env.BASE_URL
const S = (img: string) => `${B}${img.replace(/^\//, '')}`
const M = (slug: string) => `${B}katla/${slug}.webp`

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
  .kat-reit img,.kat-spjaldM img,.kat-galI img,.kat-lina2 figure img,.kat-faqM img,.kat-vMynd img,.kat-regn img{filter:none !important}
}
/* HERO (§5.1-5.2): exactly one viewport on desktop, 50/50, the right half on
   the element ground holding the scattered 4x3 grid; taller than the viewport
   on tablet and phone so the grid can be a grid. */
.kat-heroP{position:relative}
.kat-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}
/* the text clears the floating header on short screens too (12.96vh alone fell
   under Katla's wide oval on a 600px-tall window) */
.kat-heroT{display:flex;flex-direction:column;padding:max(12.96vh,calc(2.0833vw + 56px + 1.5rem)) var(--gut) var(--gut) var(--gut)}
.kat-heroT h1{font-size:4.17vw}
.kat-heroAr{color:var(--c-rautt)}
.kat-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.kat-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:1.04vw;padding:14.72svh var(--gut) 5svh 3.75vw;height:100%}
.kat-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur)}
.kat-reit img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 14px 18px rgba(28,18,12,.28))}
.kat-rist:not(.on) .kat-reit img{transform:translateY(125%)}
.kat-reit:nth-child(1){grid-area:1/1/2/2}.kat-reit:nth-child(2){grid-area:1/2/2/3}
.kat-reit:nth-child(3){grid-area:2/2/3/3}.kat-reit:nth-child(4){grid-area:2/3/3/4}
.kat-reit:nth-child(5){grid-area:2/4/3/5}.kat-reit:nth-child(6){grid-area:3/1/4/2}
.kat-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .kat-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .kat-heroT{padding:calc(var(--haus-h,60px) + 9.091vh) var(--gut) 2.604vw}
  .kat-heroT h1{font-size:7.292vw}
  .kat-heroSlag{margin-top:2rem}
  .kat-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:2.604vw;height:auto}
  .kat-reit{aspect-ratio:3/4}
  .kat-reit:nth-child(n){grid-area:auto}
  .kat-reit:nth-child(1){grid-column:1}.kat-reit:nth-child(2){grid-column:2}
  .kat-reit:nth-child(3){grid-column:2}.kat-reit:nth-child(4){grid-column:3}
  .kat-reit:nth-child(5){display:none}
  .kat-reit:nth-child(6){grid-column:1}.kat-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .kat-heroT{padding:calc(var(--haus-h,60px) + 16vw) var(--gut) 5.556vw}
  .kat-heroT h1{font-size:min(13.333vw,3.4rem)}
  .kat-rist{padding:2.778vw}
}

/* QUOTE (§1 quote section, §4.6): one centred sentence at the section scale,
   56.6vw wide, image chips at .81em x .72em between the words, and every
   chip cycles its own pictures forever (pause 1.5s, 0.5s mask rise). */
.kat-tilvS{display:flex;justify-content:center}
.kat-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.kat-setning{width:80.078vw}}
@media (max-width:479px){.kat-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.kat-setL{display:block}
.kat-setL span{margin:0 .08em}
.kat-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.kat-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;
  transform:translateY(115%);transition:transform .5s var(--ease)}
.kat-bitiM img.nu{transform:none}
.kat-bitiM img.farin{transform:translateY(-115%)}

/* PRODUCT (§5.2 product, §6 swatches): two half-width panels, one viewport
   tall, each a big pack on the element ground with a bottom bar: label and
   pack size, the variant swatches, then Nánar and the bag. Stacks on
   compact, each panel a screen tall less the bar. */
.kat-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.kat-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.kat-spjald:nth-child(2){background:var(--c-el2)}
.kat-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer}
.kat-spjaldM img{position:absolute;inset:8% 10%;width:80%;height:84%;object-fit:contain;
  filter:drop-shadow(0 28px 34px rgba(28,18,12,.28));transform:translateY(130%);transition:transform .8s var(--ease)}
.kat-spjaldM img.nu{transform:none}
.kat-spjaldM img.farin{transform:translateY(-130%)}
.kat-spjald:not(.on) .kat-spjaldM img.nu{transform:translateY(130%)}
.kat-root.kat-allt .kat-spjaldM img.nu{transform:none}
.kat-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.kat-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.kat-stika b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.9vw;letter-spacing:-.02em;line-height:1.05}
.kat-stika .kat-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.kat-lit{display:flex;flex-direction:column;gap:.4rem}
.kat-lit div{display:flex;gap:.25rem}
.kat-lit button{width:28px;height:28px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.kat-lit button::before{content:'';width:16px;height:16px;border-radius:50%;background:var(--l);
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:box-shadow .25s var(--ease)}
.kat-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.kat-takkar{display:flex;gap:.4rem}
.kat-takkar .kat-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .kat-vorur{grid-template-columns:1fr;height:auto}
  .kat-spjald{height:calc(100svh - 10.416vw)}
  .kat-stika b{font-size:3.6vw}
}
@media (max-width:479px){
  .kat-spjald{height:calc(100svh - 22.223vw)}
  .kat-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .kat-stika b{font-size:7vw}
  .kat-takkar{grid-column:1/-1}
  .kat-takkar > *{flex:1}
}

/* ADVANTAGES (§5.2): title, then three cards 31.25vw x 30.625vw, ground by
   position, label top-left, a line centred, index bottom-left. Tablet: a
   swipeable row, one card at a time. Phone: stacked, each card its own
   trigger. */
.kat-kostir{display:flex;flex-direction:column;row-gap:6.4815vh;padding:0 var(--gut)}
.kat-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.kat-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.kat-kort:nth-child(2){background:var(--c-el3)}
.kat-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.25vw}
.kat-kort small{font-size:.8rem;color:var(--c-ink-med)}
.kat-kort h3{margin:0;font-weight:400;text-align:center;font-family:var(--f-disp);font-size:2.08vw;line-height:1.05;letter-spacing:-.02em;padding:0 8%}
.kat-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .kat-kostir{row-gap:2.273vh}
  .kat-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .kat-kortin::-webkit-scrollbar{display:none}
  .kat-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .kat-kort h3{font-size:3.255vw}
}
@media (max-width:479px){
  .kat-kostir{row-gap:3.125vh}
  .kat-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:2.778vw}
  .kat-kort{width:100%;flex:none;height:94.444vw}
  .kat-kort h3{font-size:7.4vw}
  .kat-kort > div{padding:4vw}
}

/* GALLERY (§12 mouse-scroll): a centred headline, then a strip of packs at
   21.1vh x 25.9vh along the bottom. On a mouse: the hovered pack scales
   1.3x from its base and its neighbours slide out of the way, and the strip
   drifts toward the cursor. On touch: a native swipe row. Click opens the
   product. The slowest reveal on the page, 2.44s: the more there is to look
   at, the longer it takes to arrive (§4.4). */
.kat-gal{display:flex;flex-direction:column;row-gap:9.2593vh}
.kat-galT{width:62vw}
.kat-galK{overflow:hidden;padding:4.5vh 0 0}
.kat-galL{display:flex;gap:.7vw;padding:0 var(--gut);list-style:none;margin:0;will-change:transform;width:max-content}
.kat-galL li{width:21.1111vh;height:25.9259vh;flex:none;overflow:hidden}
.kat-galI{display:block;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:var(--g);position:relative;
  transform-origin:50% 100%;transition:transform .6s var(--ease)}
.kat-galI img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.3));
  transform:translateY(130%);transition:transform var(--dur,2.44s) var(--ease);transition-delay:var(--d,0s)}
.on .kat-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .kat-galL li{overflow:visible}
  .kat-galL li:hover .kat-galI{transform:scale(1.3)}
  .kat-galL li:hover ~ li .kat-galI{transform:translateX(15%)}
  .kat-galL li:has(~ li:hover) .kat-galI{transform:translateX(-15%)}
}
@media (max-width:991px){
  .kat-gal{row-gap:3.788vh}
  .kat-galT{width:auto;padding:0 var(--gut)}
  .kat-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .kat-galK::-webkit-scrollbar{display:none}
  .kat-galL li{width:14.714vw;height:19.01vw;scroll-snap-align:start}
}
@media (max-width:479px){.kat-gal{row-gap:3.75vh}.kat-galL li{width:34.167vw;height:44.444vw}}

/* FORM (§1 form section, §9 quiz): two tab titles side by side, the idle
   one dimmed; under them one panel on the element ground. The quiz is
   noho's shape: a question, a 2x2 grid of white option fields with a round
   radio, a full-width dark button counting the step. */
.kat-form{padding:0 var(--gut)}
.kat-flipar{display:flex;gap:2.5vw;align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.kat-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:color .4s var(--ease)}
.kat-flipar button[aria-selected="true"]{color:var(--c-ink)}
.kat-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.kat-formP{background:var(--c-el);padding:1.6vw;display:grid;gap:1rem}
.kat-quiz{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:.35rem;align-items:stretch}
.kat-quizQ{margin:0 0 .8rem}
.kat-svar{background:var(--c-form);color:#2A1614;display:flex}
.kat-svarI{padding:1.6vw;display:flex;flex-direction:column;align-items:flex-start;gap:.9rem;width:100%;
  animation:kat-svarinn .45s var(--ease) both}
.kat-svarI.tomt{justify-content:center}
@keyframes kat-svarinn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.kat-svarT{margin:0;font-family:var(--f-disp);font-size:1.6vw;line-height:1.2;letter-spacing:-.015em;max-width:30ch}
.kat-svarI .kat-btn{margin-top:auto}
.kat-lbl{display:block;font-size:.78rem;color:rgba(42,22,20,.6);position:absolute;left:1.04vw;top:.55rem;pointer-events:none}
.kat-reitir input,.kat-reitir textarea{padding-top:1.7rem !important}
@media (prefers-reduced-motion:reduce){.kat-svarI{animation:none}}
.kat-formP > p{margin:0}
.kat-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.kat-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.8vw;
  transition:background .25s var(--ease),color .25s var(--ease);
  padding:0 1.04vw;cursor:pointer;color:#2A1614}
.kat-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #2A1614;margin:0;flex:none;
  transition:box-shadow .2s var(--ease)}
.kat-val input:checked{box-shadow:inset 0 0 0 4px #FFFDF8,inset 0 0 0 9px #2A1614}
.kat-val label span{display:grid;gap:.1rem;padding:.7rem 0}
.kat-val label b{font-weight:500}
.kat-val label small{font-size:.8rem;color:rgba(42,22,20,.6)}
.kat-val label.valid{background:#2A1614;color:#FFFDF8}
.kat-val label.valid small{color:rgba(255,253,248,.7)}
.kat-val label.valid input{border-color:#FFFDF8;box-shadow:inset 0 0 0 4px #2A1614,inset 0 0 0 9px #FFFDF8}
.kat-val label:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:2px}
@media (hover:hover) and (pointer:fine){.kat-val label:not(.valid):hover{background:#F4EDE3}}
.kat-nidur{background:var(--c-form);padding:1.2rem 1.04vw;color:#2A1614;display:grid;gap:.7rem}
.kat-nidur p{margin:0}
.kat-nidur .kat-btn{justify-self:start}
.kat-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.kat-reitir .heild{grid-column:1/-1}
.kat-reitir label{position:relative;display:block}
.kat-reitir input,.kat-reitir textarea{width:100%;border:0;background:var(--c-form);color:#2A1614;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem 1.04vw;min-height:4.063vw;border-radius:0}
.kat-reitir textarea{min-height:8rem;resize:vertical}
.kat-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:background .2s}
.kat-reitir label.gott i{background:#88C159}.kat-reitir label.villa i{background:#DC5B5B}
.kat-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.kat-teymiL div{background:var(--c-form);padding:.8rem 1.04vw;color:#2A1614;font-size:.86rem}
.kat-teymiL b{display:block;font-weight:500}
.kat-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.kat-form{padding:0}.kat-flipar{padding:0 var(--gut)}.kat-formP{max-width:none;padding:2.6vw var(--gut)}
  .kat-val label,.kat-reitir input{min-height:6.51vw}.kat-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:991px){.kat-svarT{font-size:2.9vw}.kat-svarI{padding:2.6vw}.kat-lbl{left:1.6vw}}
/* on a phone the two tab titles would each fill the screen at the section
   scale, so they become a two-part switch the thumb can hit */
@media (max-width:479px){
  .kat-flipar.kat-disp{font-size:1.02rem;letter-spacing:0;line-height:1.2;display:grid;grid-template-columns:1fr 1fr;gap:2px;
    margin:0 var(--gut) .6rem;padding:0;font-family:inherit;font-weight:500}
  .kat-flipar button{min-height:48px;background:var(--c-el);color:var(--c-ink-med);padding:0 .6rem}
  .kat-flipar button[aria-selected="true"]{background:var(--c-btn);color:var(--c-btn-t)}
  .kat-flipar button::before{display:none}
  .kat-quiz{grid-template-columns:1fr}
  .kat-svarT{font-size:5.4vw}
  .kat-svarI{padding:5vw}
  .kat-svarI .kat-btn{width:100%}
  .kat-lbl{left:4vw}
}
@media (max-width:479px){.kat-val,.kat-reitir{grid-template-columns:1fr}.kat-val label,.kat-reitir input{min-height:13.889vw}
  .kat-teymiL{grid-template-columns:1fr}}

/* ABOUT (§5.2 about-us, §6 photo switcher): two cards edge to edge, half the
   width each; a picture and a name at the top, the text beside it, and a
   line of their own words at the foot. Hover swaps the picture behind a mask. */
.kat-um{display:flex;flex-direction:column;row-gap:5.1852vh}
.kat-um > .kat-wrap{width:100%}
.kat-umK{display:flex}
.kat-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.kat-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem 2vw}
.kat-umC:nth-child(2){background:var(--c-el3)}
.kat-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--grunnur)}
.kat-umM img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;transition:transform .7s var(--ease)}
.kat-umM img + img{transform:translateY(135%)}
@media (hover:hover) and (pointer:fine){.kat-umC:hover .kat-umM img:first-child{transform:translateY(-135%)}
  .kat-umC:hover .kat-umM img + img{transform:none}}
.kat-umN b{display:block;font-weight:500}
.kat-umN small{color:var(--c-ink-med)}
.kat-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.kat-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:2.08vw;line-height:1.1;letter-spacing:-.02em;max-width:26ch}
@media (max-width:991px){.kat-umC{min-height:52.083vw}.kat-umM{width:14vw}.kat-umQ{font-size:3.255vw}}
@media (max-width:479px){.kat-umK{flex-direction:column}.kat-umC{width:100%;min-height:auto}.kat-umI{grid-template-columns:1fr}
  .kat-umT{grid-column:1;grid-row:auto}.kat-umM{width:30vw}.kat-umQ{font-size:6.4vw}}

/* AWARDS -> the history (§22 big-link): group labels on the left third, the
   rows on the right two thirds with the year right-aligned; hovering a row
   lays the form ground under it and slides the text in 0.8333vw. */
.kat-saga{display:flex;flex-direction:column;row-gap:6.2963vh;padding:0 var(--gut)}
.kat-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kat-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.kat-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.kat-sagaR span{display:inline-block;padding:.35rem .8333vw;margin-left:-.8333vw;transition:transform .4s var(--ease),background-color 0s}
.kat-sagaR b{font-family:var(--f-disp);font-weight:400;font-size:2.08vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.kat-sagaR:hover span{background:var(--c-form);color:#2A1614;transform:translateX(.8333vw)}}
@media (max-width:991px){.kat-sagaR b{font-size:3.255vw}}
@media (max-width:479px){.kat-sagaH{grid-template-columns:1fr}.kat-sagaR b{font-size:6.4vw}}

/* BLOG -> the lines (§14): desktop pins the section for 400% of a viewport
   and staggers the cards left, each coming to rest 20% short of the last so
   they stack. Compact: a plain swipe row. Cards 44.17vw x 24.74vw, grounds
   cycling third/second/first. */
.kat-linur{position:relative}
.kat-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:6.2963vh;overflow:hidden}
.kat-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.kat-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.kat-lina2:nth-child(3n+2){background:var(--c-el2)}.kat-lina2:nth-child(3n+3){background:var(--c-el)}
.kat-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.kat-lina2 figure img{position:absolute;inset:12%;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(28,18,12,.28));
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.kat-lina2:hover figure img{transform:scale(1.06) rotate(-2deg)}}
.kat-lina2 > div{display:flex;flex-direction:column;padding:1.25vw;gap:.6rem}
.kat-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:400;font-size:2.08vw;line-height:1.05;letter-spacing:-.02em}
.kat-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.kat-lina2 .kat-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .kat-linur{height:auto !important}
  .kat-linurP{position:relative;height:auto;overflow:visible}
  .kat-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .kat-linurL::-webkit-scrollbar{display:none}
  .kat-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .kat-lina2 h3{font-size:3.255vw}
}
@media (max-width:479px){.kat-lina2{width:83.333vw;height:111.111vw}.kat-lina2 h3{font-size:7vw}.kat-lina2 > div{padding:4vw}}

/* SUSTAINABILITY -> their own words (§20): a centred statement, then a row
   with a line and a button whose hover opens a clipped picture strip from
   width 0. */
.kat-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:4.4444vh;padding:0 var(--gut)}
.kat-yfirl .kat-sub{width:min(58vw,60rem);text-align:center}
/* contain: the hover strip animates width (noho's signature reveal, kept);
   containment keeps that layout work inside this one row */
.kat-panta{display:flex;align-items:center;gap:2.5vw;contain:layout}
.kat-panta p{margin:0;max-width:24ch;font-size:.92rem}
.kat-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:width .5s var(--ease);height:max(3vw,44px)}
.kat-pantaM img{height:100%;width:auto;max-width:none}
@media (hover:hover) and (pointer:fine){.kat-panta:has(.kat-btn:hover) .kat-pantaM{width:var(--bw,10rem)}}
@media (max-width:991px){.kat-yfirl .kat-sub{width:80vw}.kat-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.kat-yfirl{align-items:flex-start}.kat-yfirl .kat-sub{width:auto;text-align:left}
  .kat-panta{align-items:flex-start;text-align:left}}

/* FAQ (§11, §5.2): a sticky card on the left, 46.875vw x 79.44vh, with the
   title and a pack you can swap; single-open accordion rows on the right,
   white, with a plus that turns 45 degrees. Height 0.32s on custom-our; the
   answer fades in at half-way, the one fade the reference itself uses. */
.kat-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.kat-faqK{position:sticky;top:var(--gut);height:79.4444vh;background:var(--c-el);display:flex;flex-direction:column;
  justify-content:space-between;padding:1.25vw;overflow:hidden}
.kat-faqM{position:relative;flex:1;overflow:hidden}
.kat-faqM img{position:absolute;inset:10% 15%;width:70%;height:80%;object-fit:contain;filter:drop-shadow(0 24px 30px rgba(28,18,12,.28));
  transform:translateY(135%);transition:transform .8s var(--ease)}
.kat-faqM img.nu{transform:none}.kat-faqM img.farin{transform:translateY(-135%)}
.kat-faqT{display:flex;justify-content:space-between;gap:.5rem}
.kat-faqL{display:grid;gap:.35rem}
.kat-faqR{background:var(--c-form);color:#2A1614}
.kat-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 1.04vw;min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.kat-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(42,22,20,.08)}
.kat-faqR button svg{transition:transform .32s var(--ease)}
.kat-faqR.opid button svg{transform:rotate(45deg)}
.kat-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s var(--ease)}
.kat-faqR.opid .kat-faqB{grid-template-rows:1fr}
.kat-faqB > div{overflow:hidden}
.kat-faqB p{margin:0;padding:0 1.04vw 1.1rem;max-width:60ch;opacity:0;transition:opacity .16s var(--ease)}
.kat-faqR.opid .kat-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.kat-faq{grid-template-columns:46.094vw 1fr}.kat-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.kat-faqT{display:grid;grid-template-columns:1fr 1fr}.kat-faq{grid-template-columns:1fr}.kat-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:9.375vh}}

/* FOOTER (§18, §19, §4.5): on desktop and tablet the footer sits in a mask
   and is pulled from yPercent -100 to 0 as the mask scrolls in, scrubbed, a
   curtain rather than a block arriving. Its last line is the slogan, split
   to letters that rise as a wave against the same scroll, and once it has
   landed the pointer paints the letters it passes in the pack colours.
   Katla's oval sits above it as the statement piece; the ground is the
   red of the oval rather than noho's tan (declared). */
.kat-fotM{position:relative;overflow:hidden}
.kat-fot{background:#D9161C;color:#FAF6EF;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.kat-fotRod{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;font-size:.86rem;line-height:1.7}
.kat-fotRod > div{display:flex;gap:4vw;flex-wrap:wrap}
.kat-fotRod small{display:block;opacity:.7;font-size:.78rem}
.kat-fot a{text-decoration:none;display:inline-flex;min-height:28px;align-items:center}
@media (hover:hover) and (pointer:fine){.kat-fot a:hover{text-decoration:underline;text-underline-offset:3px}}
.kat-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:flex-start}
.kat-fotMerki{width:clamp(12rem,26vw,24rem);margin:8.1481vh auto 4vh}
.kat-fotMerki img{width:100%;height:auto}
.kat-slogan{font-family:var(--f-disp);font-weight:400;font-size:12.2vw;line-height:1;letter-spacing:-.035em;
  white-space:nowrap;text-align:center;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.kat-slogan span{display:inline-block;will-change:transform;transition:color .18s ease-out}
.kat-slogan span > span{display:inline-block;transition:transform .28s ease-out}
.kat-fotBot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;opacity:.8}
@media (max-width:479px){.kat-fotRod > div{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1rem}.kat-slogan{font-size:13.4vw}}

/* ---------------------------------------------------------------
   THE 10% (Sindri, 2026-09-28: "90% website 10% difference in ui").
   Structure, rhythm, motion and every mechanism are the Góa/noho build;
   these are the deliberate departures, all from Katla's own objects:
   1. soft corners on everything that is a thing you pick up (tiles,
      cards, chips, fields), from the oval and the red-lidded tubs;
      full-bleed panels stay square so their seams stay clean;
   2. pill buttons instead of square ones;
   3. the hero scatter reshuffled (noho's pattern mirrored and shifted);
   4. Erode Medium for display (in ui.tsx; Sindri asked for another font
      after Fraunces), tracking eased for the sturdier serif.
   --------------------------------------------------------------- */
.kat-root{--r:clamp(10px,.9vw,16px)}
.kat-reit,.kat-kort,.kat-galI,.kat-formP,.kat-svar,.kat-val label,.kat-nidur,.kat-teymiL div,
.kat-reitir input,.kat-reitir textarea,.kat-lina2,.kat-lina2 figure,.kat-faqK,.kat-faqR,.kat-umM,.kat-vMynd{border-radius:var(--r)}
.kat-lina2 figure{border-radius:var(--r) 0 0 var(--r)}
@media (max-width:991px){.kat-lina2 figure{border-radius:var(--r) var(--r) 0 0}}
.kat-bitiM{border-radius:.16em}
.kat-magn,.kat-tegund,.kat-reitur input,.kat-reitur textarea,.kat-kvittun,.kat-pokiH b{border-radius:var(--r)}
.kat-btn,.kat-hnappur,.kat-sett,.kat-haus .kat-pokiH,.kat-braud{border-radius:999px}
.kat-faqR{overflow:hidden}
.kat-disp{letter-spacing:-.02em}
/* Katla's panels carry up to seven varieties (Góa's carried four) and
   single long words ("Kardimommudropar"): the swatches wrap four to a row,
   and below 1280 the buttons take their own row so the name keeps its room.
   The slogan is three letters longer than Góa's, so it steps down on phones. */
.kat-lit div{flex-wrap:wrap;max-width:128px}
@media (max-width:1280px){.kat-stika{grid-template-columns:minmax(0,1fr) auto}.kat-takkar{grid-column:1/-1}}
@media (max-width:479px){.kat-slogan{font-size:10.4vw}}
@media (min-width:992px){
  .kat-reit:nth-child(1){grid-area:1/2/2/3}.kat-reit:nth-child(2){grid-area:1/4/2/5}
  .kat-reit:nth-child(3){grid-area:2/1/3/2}.kat-reit:nth-child(4){grid-area:2/3/3/4}
  .kat-reit:nth-child(5){grid-area:3/2/4/3}.kat-reit:nth-child(6){grid-area:3/3/4/4}
  .kat-reit:nth-child(7){grid-area:2/2/3/3}
}
`

/* ---------------------------------------------------------------- *
 * Sections
 * ---------------------------------------------------------------- */

function Hero() {
  return (
    <div className="kat-heroP">
      <section className="kat-hero" id="top">
        <Reveal className="kat-heroT">
          <div>
            <Merki>Katla · Kletthálsi 3, Reykjavík</Merki>
            <h1 className="kat-disp">
              {TEXTI.heroLinur.map((l, i) => (
                <span className="kat-mask" key={l}><span className="kat-up kat-lina" style={step(i)}>{l}</span></span>
              ))}
              <span className="kat-mask">
                <span className="kat-up kat-lina kat-heroAr" style={step(TEXTI.heroLinur.length)}>{TEXTI.heroAr}</span>
              </span>
            </h1>
          </div>
          <p className="kat-heroSlag kat-mask kat-maskP">
            <span className="kat-up" style={{ ...step(4), ['--dur' as string]: '.75s' }}>{TEXTI.heroUndir}</span>
          </p>
        </Reveal>
        <Reveal className="kat-rist">
          {HERO_REITIR.map((r, i) => (
            <figure className="kat-reit kat-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}>
              <img className="kat-up" style={step(i)} src={S(r.img)} alt={r.n} width={300} height={400}
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
    <span className="kat-bitiM" ref={ref} style={{ '--grunnur': grunnur, '--b': b ?? 1 } as CSSProperties}>
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
    <section className="kat-tilvS" aria-label="Katla í einni setningu">
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="kat-disp kat-setning">
          {SETNING.map((lina, li) => (
            <span className="kat-mask kat-setL" key={li}>
              <span className="kat-up kat-lina" style={{ ...step(li), ['--dur' as string]: '1.36s' }}>
                {lina.map((b, i) =>
                  't' in b ? <span key={i}>{b.t}</span>
                    : <Biti key={i} n={b.n} grunnur={b.grunnur} b={b.b} fyrsta={b.img.replace('/katla/', '').replace('.webp', '')} hlid={chip++} />,
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
    <Reveal className="kat-spjald" as="article">
      <div className="kat-spjaldM" data-bendill="Skoða" onClick={() => pop.open({ k: 'vara', v: vara, flokkur: s.merki })}>
        {s.tegundir.map((t, j) => (
          <img key={t.img} src={M(t.img)} alt={j === k ? t.n : ''} width={900} height={600} loading="lazy" decoding="async"
            className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
            style={j !== k && j !== fyrri ? { transition: 'none' } : { transitionDelay: fyrri < 0 ? `${0.12 * i}s` : '0s' }} />
        ))}
      </div>
      <div className="kat-stika">
        <div>
          <small>{s.merki}</small>
          <b>{v.n}</b>
          <span className="kat-pk">{v.pk}{v.nr ? ` · vörunr. ${v.nr}` : ''}</span>
        </div>
        <div className="kat-lit">
          <small>Tegund</small>
          <div role="group" aria-label={`Tegundir af ${s.titill}`}>
            {s.tegundir.map((t, j) => (
              <button key={t.n} aria-pressed={j === k} aria-label={t.n} style={{ ['--l' as string]: t.lit }}
                onClick={() => { if (j !== k) { setFyrri(k); setK(j) } }} />
            ))}
          </div>
        </div>
        <div className="kat-takkar">
          <button className="kat-btn sc kat-casH" onClick={() => pop.open({ k: 'vara', v: vara, flokkur: s.merki })}><Cas t="Nánar" /></button>
          <SettIPoka v={vara} />
        </div>
      </div>
    </Reveal>
  )
}

function Vorur() {
  return (
    <section className="kat-vorur" id="vorur" aria-label="Vörur">
      {SPJOLD.map((s, i) => <Spjald key={s.titill} s={s} i={i} />)}
    </section>
  )
}

function Kostir() {
  return (
    <section className="kat-kostir">
      <Reveal><Ord className="kat-disp" text="Gæðavörur | síðan 1954" /></Reveal>
      <Reveal className="kat-kortin" hver>
        {KORT3.map((k, i) => (
          <div className="kat-kort kat-mask" key={k.nr}>
            <div className="kat-up" style={{ ...step(i), ['--dur' as string]: '1.24s' }}>
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
    <section className="kat-gal" aria-labelledby="kat-gal-t">
      <Reveal className="kat-galT kat-midja" margin="0px 0px -40% 0px">
        <Ord id="kat-gal-t" className="kat-disp" text={"Í flestum | matvöru\u00ADverslunum | landsins"} />
      </Reveal>
      <div className="kat-galK">
        <Reveal as="ul" className="kat-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.img}>
              <button className="kat-galI" style={{ ['--g' as string]: g.g, ['--d' as string]: `${(i * 0.06).toFixed(2)}s` }}
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
    const k = document.querySelector<HTMLElement>('.kat-galK')
    const l = document.querySelector<HTMLElement>('.kat-galL')
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
/* one line under each errand, so the choice says where it leads */
const STUTT = ['Neytendavörur í hillurnar', 'Hráefni og áhöld', 'Krydd, raspur og net', 'Hjálparefni og blöndur']
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
    <section className="kat-form" id="erindi">
      <div className="kat-flipar kat-disp" role="tablist" aria-label="Hafa samband">
        <button role="tab" id="kat-t1" aria-controls="kat-tp" aria-selected={flipi === 'quiz'} onClick={() => setFlipi('quiz')}>Hvert er erindið?</button>
        <button role="tab" id="kat-t2" aria-controls="kat-tp" aria-selected={flipi === 'spyrja'} onClick={() => setFlipi('spyrja')}>Senda fyrirspurn</button>
      </div>
      <Reveal className="kat-formP kat-mask" margin="0px 0px -20% 0px">
        <div className="kat-up" id="kat-tp" role="tabpanel" aria-labelledby={flipi === 'quiz' ? 'kat-t1' : 'kat-t2'} style={{ display: 'grid', gap: '1rem' }}>
          {flipi === 'quiz' ? (
            /* one step: choosing an errand shows its answer and its action at
               once, beside the choices on desktop and right under them on a
               phone. No disabled Next button and no second screen to go back
               from. */
            <div className="kat-quiz">
              <div>
                <p className="kat-quizQ" id="kat-quiz-q">Hvaða svið viltu ná í?</p>
                <div className="kat-val" role="radiogroup" aria-labelledby="kat-quiz-q">
                  {ERINDI.map((e, i) => (
                    <label key={e.nafn} className={val === i ? 'valid' : ''}>
                      <span><b>{e.nafn}</b><small>{STUTT[i]}</small></span>
                      <input type="radio" name="kat-erindi" checked={val === i} onChange={() => setVal(i)} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="kat-svar" aria-live="polite">
                {leid ? (
                  <div className="kat-svarI" key={leid.nafn}>
                    <p className="kat-merki" style={{ margin: 0, color: 'rgba(42,22,20,.6)' }}>{leid.nafn}</p>
                    <p className="kat-svarT">{leid.nota}</p>
                    <button className="kat-btn kat-casH" onClick={() => gera(leid)}>
                      <Cas t={leid.hlekkur === '#hillan' ? 'Opna pöntunarlistann' : leid.ord} />
                    </button>
                    <button className="kat-nobg" style={{ color: '#2A1614' }} onClick={() => setFlipi('spyrja')}>Eða sendu okkur línu <i>→</i></button>
                  </div>
                ) : (
                  <div className="kat-svarI tomt">
                    <p className="kat-svarT">Veldu erindi og þú sérð strax hvernig best er að snúa sér.</p>
                    <p className="kat-smatt" style={{ color: 'rgba(42,22,20,.6)', margin: 0 }}>Sími 567 4422 · rekstur@katla.is</p>
                  </div>
                )}
              </div>
            </div>
          ) : sent ? (
            <div className="kat-nidur">
              <p>Takk, {gildi.nafn.split(' ')[0]}. Svona berst fyrirspurnin á rekstur@katla.is.</p>
              <p className="kat-smatt" style={{ color: 'rgba(42,22,20,.6)' }}>Þetta er frumgerð og ekkert var sent.</p>
              <button className="kat-btn sc kat-casH" onClick={() => { setSent(false); setGildi({ nafn: '', netfang: '', skilabod: '' }); setSnert({}) }}><Cas t="Ný fyrirspurn" /></button>
            </div>
          ) : (
            <form onSubmit={senda} noValidate style={{ display: 'grid', gap: '.35rem' }}>
              <div className="kat-reitir">
                <label className={lbl('nafn')}>
                  <span className="kat-lbl">Nafn</span>
                  <input autoComplete="name" value={gildi.nafn} onBlur={() => setSnert((s) => ({ ...s, nafn: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, nafn: e.target.value }))} /><i />
                </label>
                <label className={lbl('netfang')}>
                  <span className="kat-lbl">Netfang</span>
                  <input type="email" autoComplete="email" value={gildi.netfang} onBlur={() => setSnert((s) => ({ ...s, netfang: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, netfang: e.target.value }))} /><i />
                </label>
                <label className={`heild ${lbl('skilabod')}`}>
                  <span className="kat-lbl">Skilaboð</span>
                  <textarea value={gildi.skilabod} onBlur={() => setSnert((s) => ({ ...s, skilabod: true }))}
                    onChange={(e) => setGildi((g) => ({ ...g, skilabod: e.target.value }))} /><i />
                </label>
              </div>
              <button type="submit" className="kat-btn stor kat-casH"><Cas t="Senda fyrirspurn" /></button>
              <div className="kat-teymiL">
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
    { n: 'Katla', m: 'Fjölskyldufyrirtæki, stofnað 1954', a: 'vofflumix', b: 'islenskar-ponnsur', g: '#E7A93B',
      t: 'Frá stofnun fyrirtækisins höfum við lagt áherslu á gæðavörur fyrir neytendur, en fyrirtækið sérhæfir sig einnig í framleiðslu og þróun lausna fyrir bakarí, kjötiðnað og fiskiðnað.',
      q: '„Starfsfólk okkar er hjarta fyrirtækisins.“' },
    { n: 'Fagsviðin', m: 'Bakarí, kjötvinnslur og fiskiðnaður', a: 'glassur', b: 'sjavarsalt', g: '#1E5DA6',
      t: 'Katla vinnur mjög náið með birgjum sínum, sem flestir eru alþjóðleg fyrirtæki í fremstu röð á sínu sviði, og leggur áherslu á að bjóða heildarlausn fyrir hvern og einn viðskiptavin.',
      q: '„Only Quality Sells.“' },
  ]
  return (
    <section className="kat-um" id="um" aria-labelledby="kat-um-t">
      <Reveal className="kat-wrap"><Ord id="kat-um-t" className="kat-disp" text="Nokkur orð | um okkur" /></Reveal>
      <Reveal className="kat-umK" hver margin="0px 0px -20% 0px">
        {kort.map((k, i) => (
          <article className="kat-umC kat-mask" key={k.n} style={{ '--grunnur': k.g } as CSSProperties}>
            <div className="kat-up kat-umI" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              <div className="kat-umM"><img src={M(k.a)} alt="" width={300} height={300} loading="lazy" /><img src={M(k.b)} alt="" width={300} height={300} loading="lazy" /></div>
              <p className="kat-umT">{k.t}</p>
              <div className="kat-umN"><b>{k.n}</b><small>{k.m}</small></div>
              <p className="kat-umQ">{k.q}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

function Saga() {
  return (
    <section className="kat-saga" id="saga">
      <Reveal><Ord className="kat-disp" text="Sagan" /></Reveal>
      <Reveal hver>
        {SOGUHOPAR.map((h, i) => (
          <div className="kat-sagaH kat-mask" key={h.h}>
            <p className="kat-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>{h.h}</p>
            <div className="kat-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              {h.r.map((r) => (
                <div className="kat-sagaR" key={r.a}><span>{r.t}</span><b>{r.a}</b></div>
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
    const l = el.querySelector<HTMLElement>('.kat-linurL')
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
    <section className="kat-linur" id="linur" ref={ref} style={{ height: `calc(100svh + ${PIN * 100}svh)` }}>
      <div className="kat-linurP">
        <Reveal className="kat-wrap"><Ord className="kat-disp" text="Vörulínur" /></Reveal>
        <div className="kat-linurL">
          {LINUR.map((l) => {
            const f = KATALOGUR.find((x) => x.s === l.s)
            return (
              <button className="kat-lina2" key={l.s} data-bendill="Opna" style={{ ['--g' as string]: l.g }}
                onClick={() => pop.open({ k: 'flokkur', s: l.s })}>
                <figure><img src={M(l.img)} alt="" width={400} height={400} loading="lazy" /></figure>
                <div>
                  <h3>{l.t}</h3>
                  <p>{l.d}</p>
                  <span className="kat-lf"><span>{f?.items.length ?? 0} vörur</span><span>Skoða ↗</span></span>
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
    <section className="kat-yfirl" aria-label="Í þeirra eigin orðum">
      <Reveal className="kat-mask kat-maskP" margin="0px 0px -20% 0px">
        <h2 className="kat-sub kat-up" style={{ ['--dur' as string]: '1.24s' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="kat-panta">
        <p>Vöruafgreiðslan á Kletthálsi 3 er opin virka daga frá 8.00 til 15.45, föstudaga til 12.00. Pantanir berist fyrir kl. 11 daginn áður.</p>
        <span className="kat-pantaM"><img ref={mynd} src={M('smakokudeig-sukkuladibitar')} alt="" width={450} height={90} /></span>
        <button className="kat-btn kat-casH" onClick={() => poki.open(true)}><Cas t="Opna pöntunarlistann" /></button>
      </div>
    </section>
  )
}

function Faq() {
  const [opid, setOpid] = useState(-1)
  const MYNDIR = ['vofflumix', 'vanilludropar', 'rasp-gullid', 'sukkuladikaka', 'glassur', 'kanill']
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  return (
    <section className="kat-faq" id="spurt">
      <div className="kat-faqK">
        <Reveal><Ord className="kat-disp" text="Spurt og | svarað" /></Reveal>
        <div className="kat-faqM" data-bendill="Næsta" onClick={() => { setFyrri(k); setK((k + 1) % MYNDIR.length) }}>
          {MYNDIR.map((m, j) => (
            <img key={m} src={M(m)} alt="" width={400} height={600} loading="lazy" className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
        </div>
        <div className="kat-faqT">
          <button className="kat-btn kat-casH" onClick={() => { setFyrri(k); setK((k + 1 + Math.floor(Math.random() * (MYNDIR.length - 1))) % MYNDIR.length) }}><Cas t="Handahóf" /></button>
          <button className="kat-btn sc kat-casH" onClick={() => faraA('#linur')}><Cas t="Vörulínur" /></button>
        </div>
      </div>
      <Reveal className="kat-faqL" hver>
        {SPURT.map((s, i) => (
          <div className={`kat-faqR kat-mask${opid === i ? ' opid' : ''}`} key={s.q}>
            <div className="kat-up" style={{ ...step(i % 4), ['--dur' as string]: '1.12s' }}>
              <button aria-expanded={opid === i} onClick={() => setOpid(opid === i ? -1 : i)}>
                {s.q}
                <i><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.3" /></svg></i>
              </button>
              <div className="kat-faqB"><div><p>{s.a}</p></div></div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* The footer: curtain on desktop/tablet, slogan wave, paint brush. */
const SLAGORD = 'Only Quality Sells'
const PENSILL = ['#E7A93B', '#8FC7A9', '#F2C94C', '#FFFFFF', '#D7832F']

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
    <div className="kat-fotM" ref={mask} style={{ height: H || undefined }}>
      <footer className="kat-fot" ref={fot}>
        <div className="kat-fotRod">
          <div>
            <div><small>Hafa samband</small>
              <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
              <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a><br />
              <a href="tel:+3545674533">567 4533</a>
            </div>
            <div><small>Katla</small>
              <a href="#vorur" onClick={(e) => { e.preventDefault(); faraA('#vorur') }}>Vörur</a><br />
              <a href="#linur" onClick={(e) => { e.preventDefault(); faraA('#linur') }}>Vörulínur</a><br />
              <a href="#saga" onClick={(e) => { e.preventDefault(); faraA('#saga') }}>Sagan</a><br />
              <a href="#spurt" onClick={(e) => { e.preventDefault(); faraA('#spurt') }}>Spurt og svarað</a>
            </div>
            <div><small>Tenglar</small>
              <a href={FYRIRTAEKI.facebook} target="_blank" rel="noopener">Facebook</a><br />
              <a href={FYRIRTAEKI.instagram} target="_blank" rel="noopener">Instagram</a><br />
              <a href={FYRIRTAEKI.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            </div>
            <div><small>Skrifstofan</small>
              {FYRIRTAEKI.heimili}<br />Mán.–fim. 8.00–16.00<br />Fös. 8.00–15.00
            </div>
          </div>
          <button className="kat-fotUpp kat-casH" onClick={upp}><Cas t="Aftur upp" /> ↑</button>
        </div>
        <div className="kat-fotMerki">
          <img src={`${B}katla/katla-merki.svg`} alt="Katla, stofnuð 1954" width={1476} height={660} loading="lazy" />
        </div>
        <p className="kat-slogan" ref={slag} aria-label={SLAGORD}>
          {[...SLAGORD].map((c, i) => <span key={i} aria-hidden="true"><span>{c === ' ' ? ' ' : c}</span></span>)}
        </p>
        <div className="kat-fotBot">
          <span>{FYRIRTAEKI.logadi} · kt. {FYRIRTAEKI.kt}</span>
          <span>Fjölskyldufyrirtæki síðan 1954</span>
        </div>
      </footer>
    </div>
  )
}

export default function KatlaPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Katla | Gæðavörur í íslenskan bakstur síðan 1954'
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
    <div className="kat-root">
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
