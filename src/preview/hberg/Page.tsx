import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { setThemeColor } from '../../lib/preview'
import {
  Bendill, C, CSS, Cas, Haus, Merki, Ord, Reveal, faraA, isCompact, isPhone, lenisOf, reduced, step, useMjukSkrun, useWatchdog,
} from './ui'
import { Poki, POKA_CSS, SettIPoka, poki } from './poki'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { VoruRegn, REGN_CSS } from './regn'
import { Popup, POP_CSS, pop, type PopState } from './popup'
import { Skjahvila, SKJAHVILA_CSS } from './skjahvila'
import { Eydublad, EYD_CSS } from './eydublad'
import { SPYRJA } from './forms'
import { KATALOGUR } from './katalogur'
import { leita, skilmali, stutt } from './ofnaemi'
import { ALLERGENS, PK, PRODUCTS, productBySlug, type Allergen, V } from './vorur'
import {
  ERINDI, FYRIRTAEKI, GALLERI, HERO_REITIR, JSON_LD, KORT3, LINUR, SETNING, SETNING_HRINGUR, SOGUHOPAR, SPJOLD, SPURT, TEXTI,
  TEYMI, TILVITNUN, type Leid,
} from './data'



const B = import.meta.env.BASE_URL
const M = (slug: string) => PK(slug, 'pack', 'm')
// 'laus:pNN' = a single loose nut or fruit (hberg/laus), everything else a pack shot.
const Ms = (slug: string) => slug.startsWith('laus:') ? `${B}hberg/laus/${slug.slice(5)}.webp${V}`
  : slug.startsWith('hero:') ? `${B}hberg/hero/${slug.slice(5)}.webp${V}` : PK(slug, 'pack', 's')


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
@media(prefers-reduced-motion:reduce){
.hb-linur{height:auto!important}.hb-linurP{position:relative!important;height:auto!important;overflow:visible!important}
.hb-linurL{overflow-x:auto;transform:none!important}.hb-lina2{transform:none!important}
.hb-bendill{display:none!important}.hb-up,.hb-lina{transform:none!important}
}

.hb-reit img{filter:drop-shadow(0 18px 16px rgba(20,12,8,.30)) drop-shadow(0 3px 3px rgba(20,12,8,.25))}
.hb-spjaldM img{filter:drop-shadow(0 34px 30px rgba(20,12,8,.30)) drop-shadow(0 4px 4px rgba(20,12,8,.22))}
@media(hover:hover) and (pointer:fine){.hb-reit:hover img{transform:translateY(-4%) rotate(-3deg);transition:transform .45s var(--ease)}.hb-spjaldM:hover img.nu{transform:translateY(-3%)}}

@media (hover:none),(pointer:coarse){
  .hb-reit img,.hb-spjaldM img,.hb-galI img,.hb-lina2 figure img,.hb-faqM img,.hb-vMynd img,.hb-regn img{filter:none !important}
}

.hb-heroP{position:relative}
.hb-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}

.hb-heroT{display:flex;flex-direction:column;padding:max(12.96vh,calc(2.0833vw + 56px + 1.5rem)) var(--gut) var(--gut) var(--gut)}
.hb-heroT h1{font-size:4.17vw}
.hb-heroAr{color:var(--c-rautt)}
.hb-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.hb-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:1.04vw;padding:14.72svh var(--gut) 5svh 3.75vw;height:100%}
.hb-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur)}
.hb-reit img{position:absolute;inset:10% 9%;width:82%;height:80%;object-fit:contain;scale:var(--k,1);filter:drop-shadow(0 14px 18px rgba(28,18,12,.28))}
.hb-rist:not(.on) .hb-reit img{transform:translateY(125%)}
.hb-reit:nth-child(1){grid-area:1/1/2/2}.hb-reit:nth-child(2){grid-area:1/2/2/3}
.hb-reit:nth-child(3){grid-area:2/2/3/3}.hb-reit:nth-child(4){grid-area:2/3/3/4}
.hb-reit:nth-child(5){grid-area:2/4/3/5}.hb-reit:nth-child(6){grid-area:3/1/4/2}
.hb-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .hb-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .hb-heroT{padding:calc(var(--haus-h,60px) + 9.091vh) var(--gut) 2.604vw}
  .hb-heroT h1{font-size:7.292vw}
  .hb-heroSlag{margin-top:2rem}
  .hb-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:2.604vw;height:auto}
  .hb-reit{aspect-ratio:3/4}
  .hb-reit:nth-child(n){grid-area:auto}
  .hb-reit:nth-child(1){grid-column:1}.hb-reit:nth-child(2){grid-column:2}
  .hb-reit:nth-child(3){grid-column:2}.hb-reit:nth-child(4){grid-column:3}
  .hb-reit:nth-child(5){display:none}
  .hb-reit:nth-child(6){grid-column:1}.hb-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .hb-heroT{padding:calc(var(--haus-h,60px) + 16vw) var(--gut) 5.556vw}
  .hb-heroT h1{font-size:min(13.333vw,3.4rem)}
  .hb-rist{padding:2.778vw}
}


.hb-tilvS{display:flex;justify-content:center}
.hb-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.hb-setning{width:80.078vw}}
@media (max-width:479px){.hb-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.hb-setL{display:block}
.hb-setL span{margin:0 .08em}
.hb-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.hb-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;
  transform:translateY(115%);transition:transform .5s var(--ease)}
.hb-bitiM img.nu{transform:none}
.hb-bitiM img.farin{transform:translateY(-115%)}


.hb-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.hb-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.hb-spjald:nth-child(2){background:var(--c-el2)}
.hb-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer}
.hb-spjaldM img{position:absolute;inset:8% 10%;width:80%;height:84%;object-fit:contain;
  filter:drop-shadow(0 28px 34px rgba(28,18,12,.28));transform:translateY(130%);transition:transform .8s var(--ease)}
.hb-spjaldM img.nu{transform:none}
.hb-spjaldM img.farin{transform:translateY(-130%)}
.hb-spjald:not(.on) .hb-spjaldM img.nu{transform:translateY(130%)}
.hb-root.hb-allt .hb-spjaldM img.nu{transform:none}
.hb-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.hb-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.hb-stika b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.9vw;letter-spacing:-.02em;line-height:1.05}
.hb-stika .hb-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.hb-lit{display:flex;flex-direction:column;gap:.4rem}
.hb-lit div{display:flex;gap:.25rem}
.hb-lit button{width:28px;height:28px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.hb-lit button::before{content:'';width:16px;height:16px;border-radius:50%;background:var(--l);
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:box-shadow .25s var(--ease)}
.hb-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.hb-takkar{display:flex;gap:.4rem}
.hb-takkar .hb-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .hb-vorur{grid-template-columns:1fr;height:auto}
  .hb-spjald{height:calc(100svh - 10.416vw)}
  .hb-stika b{font-size:3.6vw}
}
@media (max-width:479px){
  .hb-spjald{height:calc(100svh - 22.223vw)}
  .hb-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .hb-stika b{font-size:7vw}
  .hb-takkar{grid-column:1/-1}
  .hb-takkar > *{flex:1}
}


.hb-kostir{display:flex;flex-direction:column;row-gap:6.4815vh;padding:0 var(--gut)}
.hb-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.hb-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.hb-kort:nth-child(2){background:var(--c-el3)}
.hb-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.25vw}
.hb-kort small{font-size:.8rem;color:var(--c-ink-med)}
.hb-kort h3{margin:0;font-weight:400;text-align:center;font-family:var(--f-disp);font-size:2.08vw;line-height:1.05;letter-spacing:-.02em;padding:0 8%}
.hb-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .hb-kostir{row-gap:2.273vh}
  .hb-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .hb-kortin::-webkit-scrollbar{display:none}
  .hb-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .hb-kort h3{font-size:3.255vw}
}
@media (max-width:479px){
  .hb-kostir{row-gap:3.125vh}
  .hb-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:2.778vw}
  .hb-kort{width:100%;flex:none;height:94.444vw}
  .hb-kort h3{font-size:7.4vw}
  .hb-kort > div{padding:4vw}
}


.hb-gal{display:flex;flex-direction:column;row-gap:9.2593vh}
.hb-galT{width:62vw}
.hb-galK{overflow:hidden;padding:4.5vh 0 0}
.hb-galL{display:flex;gap:.7vw;padding:0 var(--gut);list-style:none;margin:0;will-change:transform;width:max-content}
.hb-galL li{width:21.1111vh;height:25.9259vh;flex:none;overflow:hidden}
.hb-galI{display:block;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:var(--g);position:relative;
  transform-origin:50% 100%;transition:transform .6s var(--ease)}
.hb-galI img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.3));
  transform:translateY(130%);transition:transform var(--dur,2.44s) var(--ease);transition-delay:var(--d,0s)}
.on .hb-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .hb-galL li{overflow:visible}
  .hb-galK{padding-top:9vh;margin-top:-4.5vh;padding-bottom:9rem;margin-bottom:-9rem;position:relative;z-index:3;pointer-events:none}
  .hb-galL{pointer-events:auto}
  .hb-galL li{position:relative}
  .hb-galI{border-radius:4px;transition:transform .45s var(--ease),box-shadow .45s var(--ease)}
  .hb-galL li:hover .hb-galI,.hb-galI:focus-visible{transform:translateY(-6px);box-shadow:0 18px 34px -18px rgba(28,18,12,.45)}
  .hb-galI img{transition:transform var(--dur,2.44s) var(--ease),inset .45s var(--ease)}
  .hb-galInfo{position:absolute;left:2px;right:2px;top:calc(100% + 12px);display:grid;gap:.15rem;text-align:left;
    color:var(--c-ink);font-size:.78rem;line-height:1.3;pointer-events:none;
    opacity:0;transform:translateY(-4px);transition:opacity .2s ease,transform .35s var(--ease)}
  .hb-galInfo b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hb-galInfo small{color:var(--c-ink-med);font-size:.7rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hb-galL li:hover .hb-galInfo,.hb-galI:focus-visible .hb-galInfo{opacity:1;transform:none}
}
@media not ((hover:hover) and (pointer:fine) and (min-width:992px)){.hb-galInfo{display:none}}
@media (prefers-reduced-motion:reduce){.hb-galI,.hb-galInfo,.hb-galI img{transition:none !important}}
@media (max-width:991px){
  .hb-gal{row-gap:3.788vh}
  .hb-galT{width:auto;padding:0 var(--gut)}
  .hb-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .hb-galK::-webkit-scrollbar{display:none}
  .hb-galL li{width:14.714vw;height:19.01vw;scroll-snap-align:start}
}
@media (max-width:479px){.hb-gal{row-gap:3.75vh}.hb-galL li{width:34.167vw;height:44.444vw}}


.hb-form{padding:0 var(--gut)}
.hb-flipar{display:flex;gap:2.5vw;align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.hb-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:color .4s var(--ease)}
.hb-flipar button[aria-selected="true"]{color:var(--c-ink)}
.hb-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.hb-formP{background:var(--c-el);padding:1.6vw;display:grid;gap:1rem}
.hb-quiz{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:.35rem;align-items:stretch}
.hb-quizQ{margin:0 0 .8rem}
.hb-svar{background:var(--c-form);color:#172D4D;display:flex}
.hb-svarI{padding:1.6vw;display:flex;flex-direction:column;align-items:flex-start;gap:.9rem;width:100%;
  animation:hb-svarinn .45s var(--ease) both}
.hb-svarI.tomt{justify-content:center}
@keyframes hb-svarinn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.hb-svarT{margin:0;font-family:var(--f-disp);font-size:1.6vw;line-height:1.2;letter-spacing:-.015em;max-width:30ch}
.hb-svarI .hb-btn{margin-top:auto}
.hb-lbl{display:block;font-size:.78rem;color:rgba(23,45,77,.6);position:absolute;left:1.04vw;top:.55rem;pointer-events:none}
.hb-reitir input,.hb-reitir textarea{padding-top:1.7rem !important}
@media (prefers-reduced-motion:reduce){.hb-svarI{animation:none}}
.hb-formP > p{margin:0}
.hb-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.hb-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.8vw;
  transition:background .25s var(--ease),color .25s var(--ease);
  padding:0 1.04vw;cursor:pointer;color:#172D4D}
.hb-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #172D4D;margin:0;flex:none;
  transition:box-shadow .2s var(--ease)}
.hb-val input:checked{box-shadow:inset 0 0 0 4px #FFFDF8,inset 0 0 0 9px #172D4D}
.hb-val label span{display:grid;gap:.1rem;padding:.7rem 0}
.hb-val label b{font-weight:500}
.hb-val label small{font-size:.8rem;color:rgba(23,45,77,.6)}
.hb-val label.valid{background:#172D4D;color:#FFFDF8}
.hb-val label.valid small{color:rgba(255,253,248,.7)}
.hb-val label.valid input{border-color:#FFFDF8;box-shadow:inset 0 0 0 4px #172D4D,inset 0 0 0 9px #FFFDF8}
.hb-val label:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:2px}
@media (hover:hover) and (pointer:fine){.hb-val label:not(.valid):hover{background:#F4EDE3}}
.hb-nidur{background:var(--c-form);padding:1.2rem 1.04vw;color:#172D4D;display:grid;gap:.7rem}
.hb-nidur p{margin:0}
.hb-nidur .hb-btn{justify-self:start}
.hb-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.hb-reitir .heild{grid-column:1/-1}
.hb-reitir label{position:relative;display:block}
.hb-reitir input,.hb-reitir textarea{width:100%;border:0;background:var(--c-form);color:#172D4D;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem 1.04vw;min-height:4.063vw;border-radius:0}
.hb-reitir textarea{min-height:8rem;resize:vertical}
.hb-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:background .2s}
.hb-reitir label.gott i{background:#88C159}.hb-reitir label.villa i{background:#DC5B5B}
.hb-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.hb-teymiL div{background:var(--c-form);padding:.8rem 1.04vw;color:#172D4D;font-size:.86rem}
.hb-teymiL b{display:block;font-weight:500}
.hb-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.hb-form{padding:0}.hb-flipar{padding:0 var(--gut)}.hb-formP{max-width:none;padding:2.6vw var(--gut)}
  .hb-val label,.hb-reitir input{min-height:6.51vw}.hb-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:991px){.hb-svarT{font-size:2.9vw}.hb-svarI{padding:2.6vw}.hb-lbl{left:1.6vw}}

@media (max-width:479px){
  .hb-flipar.hb-disp{font-size:1.02rem;letter-spacing:0;line-height:1.2;display:grid;grid-template-columns:1fr 1fr;gap:2px;
    margin:0 var(--gut) .6rem;padding:0;font-family:inherit;font-weight:500}
  .hb-flipar button{min-height:48px;background:var(--c-el);color:var(--c-ink-med);padding:0 .6rem}
  .hb-flipar button[aria-selected="true"]{background:var(--c-btn);color:var(--c-btn-t)}
  .hb-flipar button::before{display:none}
  .hb-quiz{grid-template-columns:1fr}
  .hb-svarT{font-size:5.4vw}
  .hb-svarI{padding:5vw}
  .hb-svarI .hb-btn{width:100%}
  .hb-lbl{left:4vw}
}
@media (max-width:479px){.hb-val,.hb-reitir{grid-template-columns:1fr}.hb-val label,.hb-reitir input{min-height:13.889vw}
  .hb-teymiL{grid-template-columns:1fr}}


.hb-um{display:flex;flex-direction:column;row-gap:5.1852vh}
.hb-um > .hb-wrap{width:100%}
.hb-umK{display:flex}
.hb-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.hb-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem 2vw}
.hb-umC:nth-child(2){background:var(--c-el3)}
.hb-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--grunnur)}
.hb-umM img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;transition:transform .7s var(--ease)}
.hb-umM img + img{transform:translateY(135%)}
@media (hover:hover) and (pointer:fine){.hb-umC:hover .hb-umM img:first-child{transform:translateY(-135%)}
  .hb-umC:hover .hb-umM img + img{transform:none}}
.hb-umN b{display:block;font-weight:500}
.hb-umN small{color:var(--c-ink-med)}
.hb-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.hb-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:2.08vw;line-height:1.1;letter-spacing:-.02em;max-width:26ch}
@media (max-width:991px){.hb-umC{min-height:52.083vw}.hb-umM{width:14vw}.hb-umQ{font-size:3.255vw}}
@media (max-width:479px){.hb-umK{flex-direction:column}.hb-umC{width:100%;min-height:auto}.hb-umI{grid-template-columns:1fr}
  .hb-umT{grid-column:1;grid-row:auto}.hb-umM{width:30vw}.hb-umQ{font-size:6.4vw}}


.hb-saga{display:flex;flex-direction:column;row-gap:6.2963vh;padding:0 var(--gut)}
.hb-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.hb-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.hb-sagaR span{display:inline-block;padding:.35rem .8333vw;margin-left:-.8333vw;transition:transform .4s var(--ease),background-color 0s}
.hb-sagaR b{font-family:var(--f-disp);font-weight:400;font-size:2.08vw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.hb-sagaR:hover span{background:var(--c-form);color:#172D4D;transform:translateX(.8333vw)}}
@media (max-width:991px){.hb-sagaR b{font-size:3.255vw}}
@media (max-width:479px){.hb-sagaH{grid-template-columns:1fr}.hb-sagaR b{font-size:6.4vw}}


.hb-linur{position:relative}
.hb-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:6.2963vh;overflow:hidden}
.hb-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.hb-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.hb-lina2:nth-child(3n+2){background:var(--c-el2)}.hb-lina2:nth-child(3n+3){background:var(--c-el)}
.hb-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.hb-lina2 figure img{position:absolute;inset:12%;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(28,18,12,.28));
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.hb-lina2:hover figure img{transform:scale(1.06) rotate(-2deg)}}
.hb-lina2 > div{display:flex;flex-direction:column;padding:1.25vw;gap:.6rem}
.hb-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:400;font-size:2.08vw;line-height:1.05;letter-spacing:-.02em}
.hb-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.hb-lina2 .hb-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .hb-linur{height:auto !important}
  .hb-linurP{position:relative;height:auto;overflow:visible}
  .hb-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .hb-linurL::-webkit-scrollbar{display:none}
  .hb-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .hb-lina2 h3{font-size:3.255vw}
}
@media (max-width:479px){.hb-lina2{width:83.333vw;height:111.111vw}.hb-lina2 h3{font-size:7vw}.hb-lina2 > div{padding:4vw}}


.hb-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:4.4444vh;padding:0 var(--gut)}
.hb-yfirl .hb-sub{width:min(58vw,60rem);text-align:center}

.hb-panta{display:flex;align-items:center;gap:2.5vw;contain:layout}
.hb-panta p{margin:0;max-width:24ch;font-size:.92rem}
.hb-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:width .5s var(--ease);height:max(3vw,44px)}
.hb-pantaM img{height:100%;width:auto;max-width:none}
@media (hover:hover) and (pointer:fine){.hb-panta:has(.hb-btn:hover) .hb-pantaM{width:var(--bw,10rem)}}
@media (max-width:991px){.hb-yfirl .hb-sub{width:80vw}.hb-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.hb-yfirl{align-items:flex-start}.hb-yfirl .hb-sub{width:auto;text-align:left}
  .hb-panta{align-items:flex-start;text-align:left}}


.hb-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.hb-faqK{position:sticky;top:var(--gut);height:79.4444vh;background:var(--c-el);display:flex;flex-direction:column;
  justify-content:space-between;padding:1.25vw;overflow:hidden}
.hb-faqM{position:relative;flex:1;overflow:hidden}
.hb-faqM img{position:absolute;inset:10% 15%;width:70%;height:80%;object-fit:contain;filter:drop-shadow(0 24px 30px rgba(28,18,12,.28));
  transform:translateY(135%);transition:transform .8s var(--ease)}
.hb-faqM img.nu{transform:none}.hb-faqM img.farin{transform:translateY(-135%)}
.hb-faqT{display:flex;justify-content:space-between;gap:.5rem}
.hb-faqL{display:grid;gap:.35rem}
.hb-faqR{background:var(--c-form);color:#172D4D}
.hb-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 1.04vw;min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.hb-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(23,45,77,.08)}
.hb-faqR button svg{transition:transform .32s var(--ease)}
.hb-faqR.opid button svg{transform:rotate(45deg)}
.hb-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s var(--ease)}
.hb-faqR.opid .hb-faqB{grid-template-rows:1fr}
.hb-faqB > div{overflow:hidden}
.hb-faqB p{margin:0;padding:0 1.04vw 1.1rem;max-width:60ch;opacity:0;transition:opacity .16s var(--ease)}
.hb-faqR.opid .hb-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.hb-faq{grid-template-columns:46.094vw 1fr}.hb-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.hb-faqT{display:grid;grid-template-columns:1fr 1fr}.hb-faq{grid-template-columns:1fr}.hb-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:9.375vh}}


.hb-fotM{position:relative;overflow:hidden}
.hb-fot{background:#204A8E;color:#FAF5EA;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.hb-fotRod{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;font-size:.86rem;line-height:1.7}
.hb-fotRod > div{display:flex;gap:4vw;flex-wrap:wrap}
.hb-fotRod small{display:block;opacity:.7;font-size:.78rem}
.hb-fot a{text-decoration:none;display:inline-flex;min-height:44px;min-width:44px;align-items:center}
@media (hover:hover) and (pointer:fine){.hb-fot a:hover{text-decoration:underline;text-underline-offset:3px}}
.hb-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:flex-start}
.hb-fotMerki{width:clamp(12rem,26vw,24rem);margin:8.1481vh auto 4vh}
.hb-fotMerki img{width:100%;height:auto}
.hb-slogan{font-family:var(--f-disp);font-weight:400;font-size:12.2vw;line-height:1;letter-spacing:-.035em;
  white-space:nowrap;text-align:center;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.hb-slogan span{display:inline-block;will-change:transform;transition:color .18s ease-out}
.hb-slogan span > span{display:inline-block;transition:transform .28s ease-out}
.hb-fotBot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.78rem;opacity:.8}
@media (max-width:479px){.hb-fotRod > div{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1rem}.hb-slogan{font-size:13.4vw}}


.hb-root{--r:clamp(10px,.9vw,16px)}
.hb-reit,.hb-kort,.hb-galI,.hb-formP,.hb-svar,.hb-val label,.hb-nidur,.hb-teymiL div,
.hb-reitir input,.hb-reitir textarea,.hb-lina2,.hb-lina2 figure,.hb-faqK,.hb-faqR,.hb-umM,.hb-vMynd,.hb-ofnK{border-radius:var(--r)}
.hb-lina2 figure{border-radius:var(--r) 0 0 var(--r)}
@media (max-width:991px){.hb-lina2 figure{border-radius:var(--r) var(--r) 0 0}}
.hb-bitiM{border-radius:.16em}
.hb-magn,.hb-tegund,.hb-reitur input,.hb-reitur textarea,.hb-kvittun,.hb-pokiH b{border-radius:var(--r)}
.hb-btn,.hb-hnappur,.hb-sett,.hb-haus .hb-pokiH,.hb-braud{border-radius:999px}
.hb-faqR{overflow:hidden}
.hb-disp{letter-spacing:-.02em}
.hb-lit div{flex-wrap:wrap;max-width:none;gap:0}
.hb-lit button{width:44px;height:44px}
@media (max-width:479px){.hb-lit div{max-width:132px}}
@media (max-width:1600px){.hb-stika{grid-template-columns:minmax(0,1fr) auto}.hb-takkar{grid-column:1/-1}}
@media (max-width:479px){.hb-slogan{font-size:min(13.4vw,4.4rem)}}
@media (min-width:992px){
  .hb-reit:nth-child(1){grid-area:1/1/2/2}.hb-reit:nth-child(2){grid-area:1/3/2/4}
  .hb-reit:nth-child(3){grid-area:2/2/3/3}.hb-reit:nth-child(4){grid-area:2/4/3/5}
  .hb-reit:nth-child(5){grid-area:3/1/4/2}.hb-reit:nth-child(6){grid-area:3/3/4/4}
  .hb-reit:nth-child(7){grid-area:3/4/4/5}
}
@media (max-width:991px){.hb-reit:nth-child(5){display:block}.hb-reit:nth-child(7){grid-column:3}}


.hb-ofn .hb-quizQ{max-width:38ch}
.hb-ofnR{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(5.4rem,1fr));gap:.35rem;width:100%}
.hb-ofnR li{min-width:0}
.hb-ofnK{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:.3rem;width:100%;height:100%;padding:.6rem .3rem .5rem;border:0;cursor:pointer;
  background:var(--g);color:#172D4D;font-size:.72rem;font-weight:500;line-height:1.15;text-align:center;min-height:44px;transition:transform .25s var(--ease)}
.hb-ofnK img{height:4.4rem;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 6px 8px rgba(16,32,56,.25))}
@media (hover:hover) and (pointer:fine){.hb-ofnK:hover{transform:translateY(-3px)}}
.hb-ofn .hb-val label{min-height:3.4rem}
@media (max-width:991px){.hb-ofn .hb-val label{min-height:4.4rem}}
@media (max-width:479px){.hb-ofn .hb-val{grid-template-columns:1fr 1fr}.hb-ofn .hb-val label{padding:0 3vw}.hb-ofnR{grid-template-columns:repeat(3,minmax(0,1fr))}}
`



function Hero() {
  return (
    <div className="hb-heroP">
      <section className="hb-hero" id="top">
        <Reveal className="hb-heroT">
          <div>
            <Merki>H-Berg · Grandatröð 12, Hafnarfirði</Merki>
            <h1 className="hb-disp">
              {TEXTI.heroLinur.map((l, i) => (
                <span className="hb-mask" key={l}><span className="hb-up hb-lina" style={step(i)}>{l}</span></span>
              ))}
              <span className="hb-mask">
                <span className="hb-up hb-lina hb-heroAr" style={step(TEXTI.heroLinur.length)}>{TEXTI.heroAr}</span>
              </span>
            </h1>
          </div>
          <p className="hb-heroSlag hb-mask hb-maskP">
            <span className="hb-up" style={{ ...step(4), ['--dur' as string]: '.75s' }}>{TEXTI.heroUndir}</span>
          </p>
        </Reveal>
        <Reveal className="hb-rist">
          {HERO_REITIR.map((r, i) => (
            <figure className="hb-reit hb-mask" key={r.img} style={{ '--grunnur': r.grunnur, '--k': r.k } as CSSProperties}>
              <img className="hb-up" style={step(i)} src={Ms(r.img)} alt={r.n} width={300} height={340}
                loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ))}
        </Reveal>
      </section>
    </div>
  )
}


function Biti({ n, grunnur, b, fyrsta, hlid }: { n: string; grunnur: string; b?: number; fyrsta: string; hlid: number }) {
  const myndir = SETNING_HRINGUR[n] ?? [fyrsta]
  const [k, setK] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (myndir.length < 2 || reduced()) return
    let t = 0
    let synilegt = false
    
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
    <span className="hb-bitiM" ref={ref} style={{ '--grunnur': productBySlug(myndir[k])?.tint ?? grunnur, '--b': b ?? 1 } as CSSProperties}>
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
    <section className="hb-tilvS" aria-label="H-Berg í einni setningu">
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="hb-disp hb-setning">
          {SETNING.map((lina, li) => (
            <span className="hb-mask hb-setL" key={li}>
              <span className="hb-up hb-lina" style={{ ...step(li), ['--dur' as string]: '1.36s' }}>
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
    <Reveal className="hb-spjald" as="article" style={{ background: v.lit }}>
      <div className="hb-spjaldM" role="button" tabIndex={0} aria-label={`${v.n}, nánar`} data-bendill="Skoða" onClick={opna} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opna()}}}>
        {s.tegundir.map((t, j) => (
          <img key={t.slug} src={M(t.slug)} alt={j === k ? t.n : ''} width={720} height={820} loading="lazy" decoding="async"
            className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
            style={j !== k && j !== fyrri ? { transition: 'none' } : { transitionDelay: fyrri < 0 ? `${0.12 * i}s` : '0s' }} />
        ))}
      </div>
      <div className="hb-stika">
        <div>
          <small>{s.merki}</small>
          <b>{v.n}</b>
          <span className="hb-pk">{v.d}</span>
        </div>
        <div className="hb-lit">
          <small>Tegund</small>
          <div role="group" aria-label={`Tegundir af ${s.titill}`}>
            {s.tegundir.map((t, j) => (
              <button key={t.n} aria-pressed={j === k} aria-label={t.n} style={{ ['--l' as string]: t.lit }}
                onClick={() => { if (j !== k) { setFyrri(k); setK(j) } }} />
            ))}
          </div>
        </div>
        <div className="hb-takkar">
          <button className="hb-btn sc hb-casH" onClick={opna}><Cas t="Nánar" /></button>
          <SettIPoka slug={v.slug} />
        </div>
      </div>
    </Reveal>
  )
}

function Vorur() {
  return (
    <section className="hb-vorur" id="vorur" aria-label="Vörur">
      {SPJOLD.map((s, i) => <Spjald key={s.titill} s={s} i={i} />)}
    </section>
  )
}

function Kostir() {
  return (
    <section className="hb-kostir">
      <Reveal><Ord className="hb-disp" text="H-Berg | frá 2007" /></Reveal>
      <Reveal className="hb-kortin" hver>
        {KORT3.map((k, i) => (
          <div className="hb-kort hb-mask" key={k.nr}>
            <div className="hb-up" style={{ ...step(i), ['--dur' as string]: '1.24s' }}>
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
    <section className="hb-gal" aria-labelledby="hb-gal-t">
      <Reveal className="hb-galT hb-midja" margin="0px 0px -40% 0px">
        <Ord id="hb-gal-t" className="hb-disp" text={"Allt H-Berg | í einni | hillu"} />
      </Reveal>
      <div className="hb-galK">
        <Reveal as="ul" className="hb-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.img}>
              <button className="hb-galI" style={{ ['--g' as string]: g.g, ['--d' as string]: `${(Math.min(i, 10) * 0.06).toFixed(2)}s` }}
                aria-label={`${g.n}, nánar`}
                onClick={() => pop.open({ k: 'vara', slug: g.img })}>
                <img src={Ms(g.img)} alt="" width={300} height={340} loading="lazy" decoding="async" />
                <span className="hb-galInfo" aria-hidden="true">
                  <b>{g.n}</b>
                  <small>{g.a.length > 0 ? `${g.d} · Inniheldur ${g.a.join(', ').toLowerCase()}` : g.d}</small>
                </span>
              </button>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}


function GalleriDrift() {
  useEffect(() => {
    const k = document.querySelector<HTMLElement>('.hb-galK')
    const l = document.querySelector<HTMLElement>('.hb-galL')
    if (!k || !l || isCompact() || reduced()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    // drift only when the pointer sits in the outer 18% of the strip; stop over the middle so a tile can be aimed at
    let cx = 0, v = 0, raf = 0
    const tick = () => {
      const max = Math.max(0, l.scrollWidth - k.getBoundingClientRect().width)
      cx = Math.min(0, Math.max(-max, cx - v))
      l.style.transform = `translate3d(${cx.toFixed(1)}px,0,0)`
      raf = v !== 0 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: MouseEvent) => {
      const r = k.getBoundingClientRect(), f = (e.clientX - r.left) / r.width, z = 0.18
      v = f < z ? -((z - f) / z) * 14 : f > 1 - z ? ((f - (1 - z)) / z) * 14 : 0
      if (v && !raf) raf = requestAnimationFrame(tick)
    }
    const leave = () => { v = 0 }
    k.addEventListener('mouseleave', leave)
    k.addEventListener('mousemove', move)
    return () => { k.removeEventListener('mousemove', move); k.removeEventListener('mouseleave', leave); cancelAnimationFrame(raf) }
  }, [])
  return null
}


function Ofnaemi() {
  const [avoid, setAvoid] = useState<Allergen[]>([])
  const { henta, oljost } = leita(avoid)
  const kunn = PRODUCTS.filter((p) => p.allergens !== null).length
  const skipta = (a: Allergen) => setAvoid((c) => (c.includes(a) ? c.filter((x) => x !== a) : [...c, a]))
  return (
    <section className="hb-form hb-ofn" id="ofnaemi" aria-labelledby="hb-ofn-t">
      <Reveal className="hb-flipar hb-disp">
        <Ord id="hb-ofn-t" className="hb-disp" text="Ofnæmisvaldar" />
      </Reveal>
      <Reveal className="hb-formP hb-mask" margin="0px 0px -20% 0px">
        <div className="hb-up" style={{ display: 'grid', gap: '1rem' }}>
          <div className="hb-quiz">
            <div>
              <p className="hb-quizQ" id="hb-ofn-q">Veldu ofnæmisvald. {kunn} af {PRODUCTS.length} vörum hafa innihaldslýsingu á vef H-Berg.</p>
              <div className="hb-val" role="group" aria-labelledby="hb-ofn-q">
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
            <div className="hb-svar" aria-live="polite">
              {avoid.length === 0 ? (
                <div className="hb-svarI tomt">
                  <p className="hb-svarT">Veldu ofnæmisvald og listinn breytist strax.</p>
                  <button className="hb-nobg" style={{ color: '#172D4D' }} onClick={() => pop.open({ k: 'ofnaemi' })}>Sjá allt ofnæmisyfirlitið <i>→</i></button>
                </div>
              ) : (
                <div className="hb-svarI" key={avoid.join(',')}>
                  <p className="hb-merki" style={{ margin: 0, color: 'rgba(23,45,77,.6)' }}>Nefnt í innihaldi: {avoid.map(stutt).join(', ')}</p>
                  <p className="hb-svarT">{henta.length ? `${henta.length} ${henta.length === 1 ? 'vara' : 'vörur'} fundust` : 'Engin samsvörun í innihaldslýsingum'}{oljost.length ? `, ${oljost.length} óstaðfestar` : ''}</p>
                  <ul className="hb-ofnR">
                    {henta.map((p) => (
                      <li key={p.slug}>
                        <button type="button" className="hb-ofnK" style={{ ['--g' as string]: p.tint }} aria-label={`${p.name.is}, nánar`}
                          onClick={() => pop.open({ k: 'vara', slug: p.slug })}>
                          <img src={Ms(p.slug)} alt="" width={60} height={68} loading="lazy" /><span>{p.name.is}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {oljost.length > 0 && <p className="hb-smatt" style={{ color: 'rgba(23,45,77,.6)' }}>Óstaðfest ofnæmisgögn, staðfest á umbúðum: {oljost.map((p) => p.name.is).join(', ')}.</p>}
                  <button className="hb-nobg" style={{ color: '#172D4D' }} onClick={() => pop.open({ k: 'ofnaemi' })}>Sjá allt ofnæmisyfirlitið <i>→</i></button>
                </div>
              )}
            </div>
          </div>
          <p className="hb-smatt">{skilmali}</p>
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
    else if (l.hlekkur === '#staerra') pop.open({ k: 'staerra' })
    else if (l.hlekkur === '#hvar') pop.open({ k: 'hvar' })
    else faraA('#ofnaemi')
  }
  return (
    <section className="hb-form" id="erindi">
      <div className="hb-flipar hb-disp" role="tablist" aria-label="Hafa samband">
        <button role="tab" id="hb-t1" aria-controls="hb-tp" aria-selected={flipi === 'quiz'} onClick={() => setFlipi('quiz')}>Hvert er erindið?</button>
        <button role="tab" id="hb-t2" aria-controls="hb-tp" aria-selected={flipi === 'spyrja'} onClick={() => setFlipi('spyrja')}>Senda fyrirspurn</button>
      </div>
      <Reveal className="hb-formP hb-mask" margin="0px 0px -20% 0px">
        <div className="hb-up" id="hb-tp" role="tabpanel" aria-labelledby={flipi === 'quiz' ? 'hb-t1' : 'hb-t2'} style={{ display: 'grid', gap: '1rem' }}>
          {flipi === 'quiz' ? (
            
            <div className="hb-quiz">
              <div>
                <p className="hb-quizQ" id="hb-quiz-q">Hvað ert þú að leita að?</p>
                <div className="hb-val" role="radiogroup" aria-labelledby="hb-quiz-q">
                  {ERINDI.map((e, i) => (
                    <label key={e.nafn} className={val === i ? 'valid' : ''}>
                      <span><b>{e.nafn}</b><small>{e.stutt}</small></span>
                      <input type="radio" name="hb-erindi" checked={val === i} onChange={() => setVal(i)} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="hb-svar" aria-live="polite">
                {leid ? (
                  <div className="hb-svarI" key={leid.nafn}>
                    <p className="hb-merki" style={{ margin: 0, color: 'rgba(23,45,77,.6)' }}>{leid.nafn}</p>
                    <p className="hb-svarT">{leid.nota}</p>
                    <button className="hb-btn hb-casH" onClick={() => gera(leid)}><Cas t={leid.ord} /></button>
                    <button className="hb-nobg" style={{ color: '#172D4D' }} onClick={() => setFlipi('spyrja')}>Eða sendu okkur línu <i>→</i></button>
                  </div>
                ) : (
                  <div className="hb-svarI tomt">
                    <p className="hb-svarT">Veldu erindi og þú sérð strax hvernig best er að snúa sér.</p>
                    <p className="hb-smatt" style={{ color: 'rgba(23,45,77,.6)', margin: 0 }}>Sími {FYRIRTAEKI.simi} · {FYRIRTAEKI.netfang}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Eydublad cfg={SPYRJA} />
              <div className="hb-teymiL">
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
    { n: 'H-Berg', m: 'Fjölskyldufyrirtæki frá 2007', a: 'mondlur', b: 'kajuhnetur-heilarristadar', g: '#B98B60',
      t: 'H-Berg var stofnað í júlí 2007 af Halldóri Berg Jónssyni og fjölskyldu. Við pökkum þurrkuðum ávöxtum og hnetum undir eigin vörumerki.', q: 'Grandatröð 12, Hafnarfirði.' },
    { n: 'Framleiðslan', m: 'Neytendaumbúðir og stærri einingar', a: 'hnetusmjor', b: 'kasjusmjor', g: '#D7B45D',
      t: 'Við pökkum í neytendaumbúðir og stærri einingar fyrir matvælafyrirtæki, matsölustaði og stóreldhús. Við framleiðum líka H-Berg smjör.', q: 'Hnetur, ávextir og smjör.' },
  ]
  return (
    <section className="hb-um" id="um" aria-labelledby="hb-um-t">
      <Reveal className="hb-wrap"><Ord id="hb-um-t" className="hb-disp" text="Nokkur orð | um okkur" /></Reveal>
      <Reveal className="hb-umK" hver margin="0px 0px -20% 0px">
        {kort.map((k, i) => (
          <article className="hb-umC hb-mask" key={k.n} style={{ '--grunnur': k.g } as CSSProperties}>
            <div className="hb-up hb-umI" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              <div className="hb-umM"><img src={Ms(k.a)} alt="" width={300} height={340} loading="lazy" /><img src={Ms(k.b)} alt="" width={300} height={340} loading="lazy" /></div>
              <p className="hb-umT">{k.t}</p>
              <div className="hb-umN"><b>{k.n}</b><small>{k.m}</small></div>
              <p className="hb-umQ">{k.q}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

function Saga() {
  return (
    <section className="hb-saga" id="saga">
      <Reveal><Ord className="hb-disp" text="Gamalt og nýtt" /></Reveal>
      <Reveal hver>
        {SOGUHOPAR.map((h, i) => (
          <div className="hb-sagaH hb-mask" key={h.h}>
            <p className="hb-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>{h.h}</p>
            <div className="hb-up" style={{ ...step(i), ['--dur' as string]: '1.12s' }}>
              {h.r.map((r) => (
                <div className="hb-sagaR" key={r.t}><span>{r.t}</span><b>{r.a}</b></div>
              ))}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}


function Linur() {
  const PIN = 4
  const ref = useFramvinda((el) => {
    const l = el.querySelector<HTMLElement>('.hb-linurL')
    if (!l) return
    const cards = [...l.children] as HTMLElement[]
    if (isCompact() || reduced()) { cards.forEach((c) => { c.style.transform = '' }); return }
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
      
      if (t === n - 1) x = Math.max(x, room * k - w * 0.2 * k)
      c.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
    })
  })
  return (
    <section className="hb-linur" id="linur" ref={ref} style={{ height: `calc(100svh + ${PIN * 100}svh)` }}>
      <div className="hb-linurP">
        <Reveal className="hb-wrap"><Ord className="hb-disp" text="Vörulínur" /></Reveal>
        <div className="hb-linurL">
          {LINUR.map((l) => {
            const f = KATALOGUR.find((x) => x.s === l.s)
            return (
              <button className="hb-lina2" key={l.s} data-bendill="Opna" style={{ ['--g' as string]: l.g }}
                onClick={() => pop.open({ k: 'flokkur', s: l.s })}>
                <figure><img src={M(l.img)} alt="" width={400} height={450} loading="lazy" /></figure>
                <div>
                  <h3>{l.t}</h3>
                  <p>{l.d}</p>
                  <span className="hb-lf"><span>{f?.items.length ?? 0} vörur</span><span>Skoða ↗</span></span>
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
    <section className="hb-yfirl" aria-label="Í þeirra eigin orðum">
      <Reveal className="hb-mask hb-maskP" margin="0px 0px -20% 0px">
        <h2 className="hb-sub hb-up" style={{ ['--dur' as string]: '1.24s' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="hb-panta">
        <p>Pantar þú fyrir verslun eða stóreldhús? Settu vörur á listann og opnaðu pöntunina í tölvupósti.</p>
        <span className="hb-pantaM"><img ref={mynd} src={Ms('kasjusmjor')} alt="" width={460} height={110} /></span>
        <button className="hb-btn hb-casH" onClick={() => poki.open(true)}><Cas t="Opna pöntunarlistann" /></button>
      </div>
    </section>
  )
}

function Faq() {
  const [opid, setOpid] = useState(-1)
  const MYNDIR = ['mondlur', 'heslihnetur-med-sukkuladi-afrit', 'kajuhnetur-heilarristadar', 'graskersfrae-2', 'aprikosur-2', 'dodlur-2']
  const [k, setK] = useState(0)
  const [fyrri, setFyrri] = useState(-1)
  return (
    <section className="hb-faq" id="spurt">
      <div className="hb-faqK">
        <Reveal><Ord className="hb-disp" text="Spurt og | svarað" /></Reveal>
        <div className="hb-faqM" role="button" tabIndex={0} aria-label="Næsta vörumynd" onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setFyrri(k);setK((k+1)%MYNDIR.length)}}} data-bendill="Næsta" onClick={() => { setFyrri(k); setK((k + 1) % MYNDIR.length) }}>
          {MYNDIR.map((m, j) => (
            <img key={m} src={M(m)} alt="" width={400} height={450} loading="lazy" className={j === k ? 'nu' : j === fyrri ? 'farin' : ''}
              style={j !== k && j !== fyrri ? { transition: 'none' } : undefined} />
          ))}
        </div>
        <div className="hb-faqT">
          <button className="hb-btn hb-casH" onClick={() => { setFyrri(k); setK((k + 1 + Math.floor(Math.random() * (MYNDIR.length - 1))) % MYNDIR.length) }}><Cas t="Handahóf" /></button>
          <button className="hb-btn sc hb-casH" onClick={() => faraA('#linur')}><Cas t="Vörulínur" /></button>
        </div>
      </div>
      <Reveal className="hb-faqL" hver>
        {SPURT.map((s, i) => (
          <div className={`hb-faqR hb-mask${opid === i ? ' opid' : ''}`} key={s.q}>
            <div className="hb-up" style={{ ...step(i % 4), ['--dur' as string]: '1.12s' }}>
              <button aria-expanded={opid === i} aria-controls={`hb-faq-answer-${i}`} onClick={() => setOpid(opid === i ? -1 : i)}>
                {s.q}
                <i><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.3" /></svg></i>
              </button>
              <div className="hb-faqB" id={`hb-faq-answer-${i}`}><div><p>{s.a}</p></div></div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}


const SLAGORD = 'Hnetur og ávextir'
const PENSILL = ['#BEA458', '#F0CB1F', '#FFFFFF', '#B27FD0', '#8FD06A']

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
    <div className="hb-fotM" ref={mask} style={{ height: H || undefined }}>
      <footer className="hb-fot" ref={fot}>
        <div className="hb-fotRod">
          <div>
            <div><small>Hafa samband</small>
              <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
              <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a><br />
              <a href={`mailto:${FYRIRTAEKI.fjarofloun}`}>{FYRIRTAEKI.fjarofloun}</a>
            </div>
            <div><small>H-Berg</small>
              <a href="#vorur" onClick={(e) => { e.preventDefault(); faraA('#vorur') }}>Vörur</a><br />
              <a href="#linur" onClick={(e) => { e.preventDefault(); faraA('#linur') }}>Vörulínur</a><br />
              <a href="#ofnaemi" onClick={(e) => { e.preventDefault(); faraA('#ofnaemi') }}>Ofnæmisvaldar</a><br />
              <a href="#spurt" onClick={(e) => { e.preventDefault(); faraA('#spurt') }}>Spurt og svarað</a>
            </div>
            <div><small>Fyrirtæki</small>
              <a href="#poki" onClick={(e) => { e.preventDefault(); poki.open(true) }}>Pöntunarlisti</a><br />
              <a href="#staerra" onClick={(e) => opna(e, { k: 'staerra' })}>Stærri pakkningar</a><br />
              <a href="#hvar" onClick={(e) => opna(e, { k: 'hvar' })}>Hvar fæst H-Berg</a><br />
            </div>
            <div><small>{FYRIRTAEKI.logadi}</small>
              <a href={FYRIRTAEKI.kort} target="_blank" rel="noopener noreferrer">{FYRIRTAEKI.heimili}</a>
            </div>
          </div>
          <button className="hb-fotUpp hb-casH" onClick={upp}><Cas t="Aftur upp" /> ↑</button>
        </div>
        <div className="hb-fotMerki">
          <a href="#top" aria-label="H-Berg, forsíða"><img src={`${B}hberg/brand/logo.svg${V}`} alt="H-Berg" width={280} height={129} loading="lazy" /></a>
        </div>
        <p className="hb-slogan" ref={slag} aria-label={SLAGORD}>
          {[...SLAGORD].map((c, i) => <span key={i} aria-hidden="true"><span>{c === ' ' ? '\u00A0' : c}</span></span>)}
        </p>
        <div className="hb-fotBot">
          <span>{FYRIRTAEKI.logadi}</span>
          <span>Fjölskyldufyrirtæki frá 2007</span>
        </div>
        <p style={{fontSize:".8rem"}}>Hönnun: <a href="https://sndrstudio.is" target="_blank" rel="noopener noreferrer">SNDR Studio</a></p>
      </footer>
    </div>
  )
}

function HbergExperience() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'H-Berg | Hnetur og ávextir frá 2007'
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
    <div className="hb-root">
      <style>{CSS}{PAGE_CSS}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}{POP_CSS}{SKJAHVILA_CSS}{EYD_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
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
        <VoruRegn />
        <Form />
        <Um />
        <Saga />
        <Linur />
        <Yfirlysing />
        <Faq />
        <Fotur />
      </main>
    </div>
  )
}

export default function HbergPage(){
  const [rm,setRm]=useState(reduced)
  useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setRm(q.matches);q.addEventListener('change',update);return()=>q.removeEventListener('change',update)},[])
  return <HbergExperience key={String(rm)}/>
}
