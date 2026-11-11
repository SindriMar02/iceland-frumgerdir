import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { setThemeColor } from '../../lib/preview'
import {
  Bendill, C, CSS, Cas, Haus, Merki, Ord, Reveal, faraA, isCompact, isPhone, lenisOf, reduced, step, useMjukSkrun, useWatchdog,
} from './ui'
import { Poki, POKA_CSS, SettIPoka, poki } from './poki'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { VoruRegn, REGN_CSS } from './regn'
import { Popup, POP_CSS, pop, type PopState } from './popup'
import { SndrBadge } from '../SndrBadge'
import { Eydublad, EYD_CSS } from './eydublad'
import { Soluadilar, MERKI_CSS } from './merki'
import { SPYRJA } from './forms'
import { KATALOGUR } from './katalogur'
import { AllergenSection } from './allergen-ui'
import { EXPERIENCE_CSS } from './experience-style'
import { ALLERGEN_CSS } from './allergen-style'
import { PK, PRODUCTS, productBySlug, V } from './vorur'
import {
  ERINDI, FYRIRTAEKI, GALLERI, HERO_REITIR, JSON_LD, LINUR, SETNING, SETNING_HRINGUR, SOGUHOPAR, SPJOLD, SPURT, TEXTI,
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
@media(hover:hover) and (pointer:fine){.hb-spjaldM:hover img.nu{transform:translateY(-3%)}}

@media (hover:none),(pointer:coarse){
  .hb-reit img,.hb-spjaldM img,.hb-galI img,.hb-lina2 figure img,.hb-faqM img,.hb-vMynd img,.hb-regn img{filter:none !important}
}

.hb-heroP{position:relative}

/* Svífandi hnetur (setningin): lausar hnetur sem lyftast og snúast hægt. */
.hb-svif{position:absolute;inset:0;z-index:-1;pointer-events:none}
.hb-svif > span{position:absolute;width:var(--s);aspect-ratio:1}
.hb-svif img{width:100%;height:100%;object-fit:contain;rotate:var(--r);animation:hbSvif var(--t) ease-in-out var(--w) infinite alternate;
  filter:drop-shadow(0 10px 12px rgba(40,24,10,.18))}
@keyframes hbSvif{from{translate:0 -10px;rotate:var(--r)}to{translate:0 12px;rotate:calc(var(--r) + 14deg)}}
.hb-hero{isolation:isolate;overflow:hidden;--mx:0;--my:0}
.hb-svifH{z-index:0;opacity:.42;clip-path:polygon(50% 0,100% 0,100% 100%,50% 100%)}.hb-heroT,.hb-rist{position:relative;z-index:1}.hb-hero::before{content:"";position:absolute;inset:0 0 0 50%;z-index:-1;background:var(--c-el)}.hb-hero .hb-rist{background:transparent}.hb-svifH > span{width:calc(var(--s) * .8)}.hb-svifH > span:nth-child(2n){filter:blur(1px) saturate(.65);opacity:.85}
.hb-svifH > span{transform:translate3d(calc(var(--mx) * var(--d) * -5px),calc(var(--my) * var(--d) * -4px),0) rotate(calc(var(--mx) * var(--d) * 2deg));will-change:transform}
@media (max-width:991px){.hb-hero::before{display:none}.hb-hero .hb-rist{background:var(--c-el)}.hb-svifH{clip-path:inset(0 0 92% 50%)}.hb-svifH > span:nth-child(n+3){display:none}.hb-svifH > span{top:4%!important;left:85%!important}.hb-svifH > span:nth-child(2){left:95%!important;top:2%!important}}
@media (max-width:479px){.hb-svif > span{width:calc(var(--s) * 1.2)}.hb-svifS{display:none}}
@media (prefers-reduced-motion:reduce){.hb-svif img{animation:none}.hb-svifH > span{transform:none;will-change:auto}}

/* Hero 30.10: upprunalega uppsetningin, betur gerð. Ferkantaðir reitir með vörumynd á eigin lit. */
.hb-hero .hb-heroT h1{font-size:clamp(2.6rem,5vw,6rem);font-weight:400;letter-spacing:-.012em;line-height:1.04}
.hb-heroT h1 .hb-mask{padding-bottom:.05em}
.hb-heroNe{margin-top:auto;display:grid;gap:1.4rem;max-width:36rem}
.hb-heroNe .hb-heroSlag{margin:0;font-size:clamp(1rem,1.15vw,1.15rem);line-height:1.5}
.hb-heroCta{margin:-8px;padding:8px}
.hb-heroCta > div{display:flex;flex-wrap:wrap;gap:.6rem}
.hb-reit{border:0;padding:0;cursor:pointer;border-radius:18px;
  transition:transform var(--motion-reveal) var(--motion-out)}
.hb-reit img{scale:1!important;filter:none!important;inset:auto!important;left:3%!important;top:50%!important;width:94%!important;height:auto!important;
  aspect-ratio:1;translate:0 -50%;object-fit:cover;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent),linear-gradient(180deg,transparent,#000 8%,#000 92%,transparent);
  -webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent),linear-gradient(180deg,transparent,#000 8%,#000 92%,transparent);mask-composite:intersect}
@media (hover:hover) and (pointer:fine){
  .hb-reit:hover{transform:translateY(-4px);box-shadow:0 22px 34px -24px rgba(40,24,10,.5)}
  .hb-rist.on .hb-reit:hover img{transform:translateY(-2%) scale(1.03)!important;transition:transform var(--motion-reveal) var(--motion-out)!important}
}
@media (max-width:991px){.hb-heroNe{margin-top:2rem}}
@media (max-width:479px){.hb-heroCta .hb-btn{flex:1 1 100%;justify-content:center}}

/* Vörumyndir 30.10: ógegnsæjar myndir á eigin lit, enginn skuggi utan um ferninginn. */
.hb-spjaldM img,.hb-galI img,.hb-lina2 figure img,.hb-faqM img{filter:none!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain}
/* Ferningsmynd í óferningslaga reit: mjúkar brúnir svo hún renni inn í litinn. */
.hb-faqM img,.hb-spjaldM img,.hb-lina2 figure img,.hb-umM img{
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent),linear-gradient(180deg,transparent,#000 7%,#000 93%,transparent);
  -webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent),linear-gradient(180deg,transparent,#000 7%,#000 93%,transparent);
  mask-composite:intersect}
.hb-hero{height:min(100svh,62.5vw);min-height:34rem;display:grid;grid-template-columns:1fr 1fr;position:relative;background:var(--c-bg)}

.hb-heroT{display:flex;flex-direction:column;padding:max(clamp(2rem,12.96vh,12rem),calc(clamp(0.5rem,2.0833vw,2.5rem) + 56px + 1.5rem)) var(--gut) var(--gut) var(--gut)}
.hb-heroT h1{font-size:clamp(1.5rem,4.17vw,5.25rem)}
.hb-heroAr{color:var(--c-rautt)}
.hb-heroSlag{margin-top:auto;font-size:.86rem;color:var(--c-ink)}
.hb-rist{background:var(--c-el);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:clamp(0.5rem,1.04vw,2.5rem);padding:clamp(2rem,14.72svh,12rem) var(--gut) clamp(1rem,5svh,6rem) clamp(0.5rem,3.75vw,2.5rem);height:100%}
.hb-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur)}
.hb-reit img{position:absolute;inset:10% 9%;width:82%;height:80%;object-fit:contain;scale:var(--k,1);filter:drop-shadow(0 14px 18px rgba(28,18,12,.28))}
.hb-rist:not(.on) .hb-reit img{transform:translateY(125%)}
.hb-reit:nth-child(1){grid-area:1/1/2/2}.hb-reit:nth-child(2){grid-area:1/2/2/3}
.hb-reit:nth-child(3){grid-area:2/2/3/3}.hb-reit:nth-child(4){grid-area:2/3/3/4}
.hb-reit:nth-child(5){grid-area:2/4/3/5}.hb-reit:nth-child(6){grid-area:3/1/4/2}
.hb-reit:nth-child(7){grid-area:3/2/4/3}
@media (max-width:991px){
  .hb-hero{height:auto;min-height:0;grid-template-columns:1fr}
  .hb-heroT{padding:calc(var(--haus-h,60px) + clamp(1rem,9.091vh,6rem)) var(--gut) clamp(0.5rem,2.604vw,2.5rem)}
  .hb-heroT h1{font-size:clamp(1.5rem,7.292vw,5.25rem)}
  .hb-heroSlag{margin-top:2rem}
  .hb-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:none;padding:clamp(0.5rem,2.604vw,2.5rem);height:auto}
  .hb-reit{aspect-ratio:3/4}
  .hb-reit:nth-child(n){grid-area:auto}
  .hb-reit:nth-child(1){grid-column:1}.hb-reit:nth-child(2){grid-column:2}
  .hb-reit:nth-child(3){grid-column:2}.hb-reit:nth-child(4){grid-column:3}
  .hb-reit:nth-child(5){display:none}
  .hb-reit:nth-child(6){grid-column:1}.hb-reit:nth-child(7){grid-column:2}
}
@media (max-width:479px){
  .hb-heroT{padding:calc(var(--haus-h,60px) + clamp(2rem,16vw,12rem)) var(--gut) clamp(1rem,5.556vw,6rem)}
  .hb-heroT h1{font-size:clamp(2.25rem,min(13.333vw,3.4rem),6rem)}
  .hb-rist{padding:clamp(0.5rem,2.778vw,2.5rem)}
}


.hb-tilvS{display:flex;justify-content:center;position:relative;isolation:isolate;padding:clamp(2rem,10vh,12rem) 0}
.hb-setning{width:56.6146vw;text-align:center}
@media (max-width:991px){.hb-setning{width:80.078vw}}
@media (max-width:479px){.hb-setning{width:auto;text-align:left;padding:0 var(--gut)}}
.hb-setL{display:block}
.hb-setL span{margin:0 .08em}
.hb-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.hb-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;
  transform:translateY(115%);transition:transform var(--motion-reveal) var(--motion-out)}
.hb-bitiM img.nu{transform:none}
.hb-bitiM img.farin{transform:translateY(-115%)}


.hb-vorur{display:grid;grid-template-columns:1fr 1fr;height:100svh}
.hb-spjald{position:relative;display:flex;flex-direction:column;padding:var(--gut);overflow:hidden;background:var(--c-el)}
.hb-spjald:nth-child(2){background:var(--c-el2)}
.hb-spjaldM{position:relative;flex:1;overflow:hidden;cursor:pointer}
.hb-spjaldM img{position:absolute;inset:8% 10%;width:80%;height:84%;object-fit:contain;
  filter:drop-shadow(0 28px 34px rgba(28,18,12,.28));transform:translateY(130%);transition:transform var(--motion-reveal) var(--motion-out)}
.hb-spjaldM img.nu{transform:none}
.hb-spjaldM img.farin{transform:translateY(-130%)}
.hb-spjald:not(.on) .hb-spjaldM img.nu{transform:translateY(130%)}
.hb-root.hb-allt .hb-spjaldM img.nu{transform:none}
.hb-stika{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:1.2rem;align-items:end;padding-top:1rem}
.hb-stika small{display:block;color:var(--c-ink-med);font-size:.78rem}
.hb-stika b{display:block;font-family:var(--f-disp);font-weight:600;font-size:clamp(1.1rem,1.9vw,2.5rem);letter-spacing:-.01em;line-height:1.05}
.hb-stika .hb-pk{font-size:.86rem;font-variant-numeric:tabular-nums}
.hb-lit{display:flex;flex-direction:column;gap:.4rem}
.hb-lit div{display:flex;gap:.25rem}
.hb-lit button{width:28px;height:28px;border:0;background:none;padding:0;cursor:pointer;display:grid;place-items:center}
.hb-lit button::before{content:'';width:16px;height:16px;border-radius:50%;background:var(--l);
  box-shadow:0 0 0 1.5px var(--c-bg),0 0 0 2.5px transparent;transition:none}
.hb-lit button[aria-pressed="true"]::before{box-shadow:0 0 0 2px var(--c-bg),0 0 0 3px var(--c-ink)}
.hb-takkar{display:flex;gap:.4rem}
.hb-takkar .hb-sett{background:var(--c-btn);color:var(--c-btn-t)}
@media (max-width:991px){
  .hb-vorur{grid-template-columns:1fr;height:auto}
  .hb-spjald{height:calc(100svh - 10.416vw)}
  .hb-stika b{font-size:clamp(1.1rem,3.6vw,2.5rem)}
}
@media (max-width:479px){
  .hb-spjald{height:calc(100svh - 22.223vw)}
  .hb-stika{grid-template-columns:1fr auto;row-gap:.8rem}
  .hb-stika b{font-size:clamp(1.5rem,7vw,5.25rem)}
  .hb-takkar{grid-column:1/-1}
  .hb-takkar > *{flex:1}
}


.hb-kostir{display:flex;flex-direction:column;row-gap:clamp(1rem,6.4815vh,6rem);padding:0 var(--gut)}
.hb-tolur{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
.hb-tala{background:var(--g);border-radius:24px;min-height:min(26vw,24rem);position:relative}
.hb-tala > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(1rem,1.6vw,1.8rem)}
.hb-tala b{font-family:var(--f-disp);font-weight:800;font-size:clamp(3rem,6.4vw,7rem);line-height:1;letter-spacing:-.01em;color:#1d2a40}
.hb-tala span{max-width:16ch;font-size:clamp(.95rem,1.1vw,1.15rem);line-height:1.3;color:#1d2a40;position:relative;z-index:1}
.hb-tala img{position:absolute;right:-6%;bottom:-8%;width:44%;rotate:-14deg;transition:rotate var(--motion-reveal) var(--motion-out),translate var(--motion-reveal) var(--motion-out);
  filter:drop-shadow(0 12px 14px rgba(40,24,10,.22))}
@media (hover:hover) and (pointer:fine){.hb-tala:hover img{rotate:12deg;translate:-6% -10%}}
@media (max-width:991px){.hb-tolur{grid-template-columns:1fr 1fr}.hb-tala{min-height:44vw}}
@media (max-width:479px){.hb-tolur{grid-template-columns:1fr}.hb-tala{min-height:52vw}.hb-tala img{width:30%}.hb-tala span{max-width:62%}}

.hb-kortin{display:flex;justify-content:space-between;gap:var(--col)}
.hb-kort{width:31.25vw;height:30.625vw;background:var(--c-el);position:relative;overflow:hidden}
.hb-kort:nth-child(2){background:var(--c-el3)}
.hb-kort > div{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(0.5rem,1.25vw,2.5rem)}
.hb-kort small{font-size:.8rem;color:var(--c-ink-med)}
.hb-kort h3{margin:0;font-weight:700;overflow-wrap:anywhere;text-align:center;font-family:var(--f-disp);font-size:clamp(1.1rem,2.08vw,2.5rem);line-height:1.05;letter-spacing:-.01em;padding:0 8%}
.hb-kort i{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums}
@media (max-width:991px){
  .hb-kostir{row-gap:clamp(0.5rem,2.273vh,2.5rem)}
  .hb-kortin{overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none}
  .hb-kortin::-webkit-scrollbar{display:none}
  .hb-kort{flex:0 0 41.797vw;height:41.797vw;scroll-snap-align:start}
  .hb-kort h3{font-size:clamp(1.1rem,3.255vw,2.5rem)}
}
@media (max-width:479px){
  .hb-kostir{row-gap:clamp(0.5rem,3.125vh,2.5rem)}
  .hb-kortin{flex-direction:column;overflow:visible;margin:0;padding:0;gap:clamp(0.5rem,2.778vw,2.5rem)}
  .hb-kort{width:100%;flex:none;height:94.444vw}
  .hb-kort h3{font-size:clamp(1.5rem,7.4vw,5.25rem)}
  .hb-kort > div{padding:clamp(1rem,4vw,6rem)}
}


.hb-gal{display:flex;flex-direction:column;row-gap:clamp(1rem,9.2593vh,6rem)}
.hb-galT{width:62vw}
.hb-galK{overflow:hidden;padding:clamp(1rem,4.5vh,6rem) 0 0}
.hb-galL{display:flex;gap:clamp(0.5rem,.7vw,2.5rem);padding:0 var(--gut);list-style:none;margin:0;width:max-content}
.hb-galW{position:relative}
.hb-galNav{display:none}
.hb-galL li{width:21.1111vh;flex:none;display:flex;flex-direction:column;gap:.75rem}
.hb-galI{display:block;width:100%;height:25.9259vh;flex:none;border:0;padding:0;cursor:pointer;background:var(--g);position:relative;
  transform-origin:50% 100%;transition:transform var(--motion-reveal) var(--motion-out);overflow:hidden}
.hb-galI img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.3));
  transform:translateY(130%);transition:transform var(--dur,var(--motion-reveal)) var(--motion-out);transition-delay:var(--d,0s)}
.on .hb-galI img{transform:none}
@media (hover:hover) and (pointer:fine) and (min-width:992px){
  .hb-galL li{overflow:visible}
.hb-galK{padding-top:clamp(1rem,9vh,6rem);margin-top:clamp(-6rem,-4.5vh,-1rem)}
  .hb-galL li:hover .hb-galI{transform:scale(1.3)}
  .hb-galL li:hover ~ li .hb-galI{transform:translateX(15%)}
  .hb-galL li:has(~ li:hover) .hb-galI{transform:translateX(-15%)}
}
/* caption under the tile: a sibling of the zooming button, so it never scales; fades in on hover */
.hb-galL li{position:relative}
/* caption is always visible under the tile (no hover discovery); the tile keeps its own height so nothing clips */
.hb-galInfo{position:relative;display:grid;gap:.2rem;text-align:left;color:var(--c-ink);font-size:clamp(.8rem,.85vw,.95rem);line-height:1.3;pointer-events:none}
.hb-galInfo b{font-weight:500;overflow-wrap:anywhere;hyphens:auto;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.hb-galInfo small{color:var(--c-ink-med);font-size:.85em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
@media (hover:hover) and (pointer:fine){
  /* the strip scrolls like a normal row: trackpad swipe, drag, or the arrows */
  .hb-galK{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;padding-bottom:3.4rem;cursor:grab;user-select:none;-webkit-user-select:none}
  .hb-galK::-webkit-scrollbar{display:none}
  .hb-galK.drag{cursor:grabbing}
  .hb-galK.drag .hb-galI{pointer-events:none}
  .hb-galNav{display:flex;gap:.5rem;position:absolute;right:var(--gut);bottom:calc(100% + .25rem);z-index:4}
  .hb-galNav button{width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid var(--c-lina);background:transparent;color:var(--c-ink);
    display:grid;place-items:center;cursor:pointer;transition:opacity var(--motion-ui) var(--motion-out)}
  .hb-galNav button:hover:not(:disabled){background:var(--c-ink);color:var(--c-bg)}
  .hb-galNav button:disabled{opacity:.3;cursor:default}
}
@media (hover:hover) and (pointer:fine) and (max-width:991px){.hb-galK{padding-top:2rem;margin-top:-1rem}.hb-galL li{overflow:visible}}
@media (max-width:991px){
  .hb-gal{row-gap:clamp(0.5rem,3.788vh,2.5rem)}
  .hb-galT{width:auto;padding:0 var(--gut)}
  .hb-galK{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-top:0}
  .hb-galK::-webkit-scrollbar{display:none}
  .hb-galL li{width:14.714vw;scroll-snap-align:start}.hb-galI{height:19.01vw}
}
@media (max-width:479px){.hb-gal{row-gap:clamp(0.5rem,3.75vh,2.5rem)}.hb-galL li{width:34.167vw}.hb-galI{height:44.444vw}}


.hb-form{padding:0 var(--gut)}
.hb-flipar{display:flex;gap:clamp(0.5rem,2.5vw,2.5rem);align-items:baseline;margin-bottom:1.4rem;flex-wrap:wrap}
.hb-flipar button{border:0;background:none;padding:0;cursor:pointer;color:var(--c-ink-max);transition:none}
.hb-flipar button[aria-selected="true"]{color:var(--c-ink)}
.hb-flipar button::before{content:'';display:inline-block;width:.18em;height:.18em;border-radius:50%;background:currentColor;
  margin-right:.25em;vertical-align:.32em}
.hb-formP{background:var(--c-el);padding:clamp(0.5rem,1.6vw,2.5rem);display:grid;gap:1rem}
.hb-quiz{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:.35rem;align-items:stretch}
.hb-quizQ{margin:0 0 .8rem}
.hb-svar{background:var(--c-form);color:#172D4D;display:flex}
.hb-svarI{padding:clamp(0.5rem,1.6vw,2.5rem);display:flex;flex-direction:column;align-items:flex-start;gap:.9rem;width:100%;
  animation:hb-svarinn .45s var(--ease) both}
.hb-svarI.tomt{justify-content:center}
@keyframes hb-svarinn{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.hb-svarT{margin:0;font-family:var(--f-disp);font-size:clamp(1.1rem,1.6vw,2.5rem);line-height:1.2;letter-spacing:-.01em;max-width:30ch}
.hb-svarI .hb-btn{margin-top:auto}
.hb-lbl{display:block;font-size:.78rem;color:rgba(23,45,77,.6);position:absolute;left:1.04vw;top:.55rem;pointer-events:none}
.hb-reitir input,.hb-reitir textarea{padding-top:1.7rem !important}
@media (prefers-reduced-motion:reduce){.hb-svarI{animation:none}}
.hb-formP > p{margin:0}
.hb-val{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.hb-val label{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--c-form);min-height:4.8vw;
  transition:none;
  padding:0 clamp(0.5rem,1.04vw,2.5rem);cursor:pointer;color:#172D4D}
.hb-val input{appearance:none;width:18px;height:18px;border-radius:50%;border:1px solid #172D4D;margin:0;flex:none;
  transition:none}
.hb-val input:checked{box-shadow:inset 0 0 0 4px #FFFDF8,inset 0 0 0 9px #172D4D}
.hb-val label span{display:grid;gap:.1rem;padding:.7rem 0}
.hb-val label b{font-weight:500}
.hb-val label small{font-size:.8rem;color:rgba(23,45,77,.6)}
.hb-val label.valid{background:#172D4D;color:#FFFDF8}
.hb-val label.valid small{color:rgba(255,253,248,.7)}
.hb-val label.valid input{border-color:#FFFDF8;box-shadow:inset 0 0 0 4px #172D4D,inset 0 0 0 9px #FFFDF8}
.hb-val label:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:2px}
@media (hover:hover) and (pointer:fine){.hb-val label:not(.valid):hover{background:#F4EDE3}}
.hb-nidur{background:var(--c-form);padding:1.2rem clamp(0.5rem,1.04vw,2.5rem);color:#172D4D;display:grid;gap:.7rem}
.hb-nidur p{margin:0}
.hb-nidur .hb-btn{justify-self:start}
.hb-reitir{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.hb-reitir .heild{grid-column:1/-1}
.hb-reitir label{position:relative;display:block}
.hb-reitir input,.hb-reitir textarea{width:100%;border:0;background:var(--c-form);color:#172D4D;font:inherit;font-size:16px;
  padding:1.2rem 2.2rem 1.2rem clamp(0.5rem,1.04vw,2.5rem);min-height:4.063vw;border-radius:0}
.hb-reitir textarea{min-height:8rem;resize:vertical}
.hb-reitir label i{position:absolute;right:1rem;top:1.35rem;width:8px;height:8px;border-radius:50%;background:transparent;transition:none}
.hb-reitir label.gott i{background:#88C159}.hb-reitir label.villa i{background:#DC5B5B}
.hb-teymiL{display:grid;grid-template-columns:repeat(4,1fr);gap:.35rem;margin-top:.4rem}
.hb-teymiL div{background:var(--c-form);padding:.8rem clamp(0.5rem,1.04vw,2.5rem);color:#172D4D;font-size:.86rem}
.hb-teymiL b{display:block;font-weight:500}
.hb-teymiL a{text-decoration:underline;text-underline-offset:2px;display:inline-flex;min-height:32px;align-items:center}
@media (max-width:991px){.hb-form{padding:0}.hb-flipar{padding:0 var(--gut)}.hb-formP{max-width:none;padding:clamp(0.5rem,2.6vw,2.5rem) var(--gut)}
  .hb-val label,.hb-reitir input{min-height:6.51vw}.hb-teymiL{grid-template-columns:1fr 1fr}}
@media (max-width:991px){.hb-svarT{font-size:clamp(1.1rem,2.9vw,2.5rem)}.hb-svarI{padding:clamp(0.5rem,2.6vw,2.5rem)}.hb-lbl{left:1.6vw}}

@media (max-width:479px){
  .hb-flipar.hb-disp{font-size:1.02rem;letter-spacing:0;line-height:1.2;display:grid;grid-template-columns:1fr 1fr;gap:2px;
    margin:0 var(--gut) .6rem;padding:0;font-family:inherit;font-weight:500}
  .hb-flipar button{min-height:48px;background:var(--c-el);color:var(--c-ink-med);padding:0 .6rem}
  .hb-flipar button[aria-selected="true"]{background:var(--c-btn);color:var(--c-btn-t)}
  .hb-flipar button::before{display:none}
  .hb-quiz{grid-template-columns:1fr}
  .hb-svarT{font-size:clamp(1.5rem,5.4vw,5.25rem)}
  .hb-svarI{padding:clamp(1rem,5vw,6rem)}
  .hb-svarI .hb-btn{width:100%}
  .hb-lbl{left:4vw}
}
@media (max-width:479px){.hb-val,.hb-reitir{grid-template-columns:1fr}.hb-val label,.hb-reitir input{min-height:13.889vw}
  .hb-teymiL{grid-template-columns:1fr}}


.hb-um{display:flex;flex-direction:column;row-gap:clamp(1rem,5.1852vh,6rem)}
.hb-um > .hb-wrap{width:100%}
.hb-umK{display:flex}
.hb-umC{width:50vw;min-height:54.1667vh;background:var(--c-el);display:flex}
.hb-umI{flex:1;padding:var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);grid-template-rows:auto 1fr auto;gap:1.2rem clamp(0.5rem,2vw,2.5rem)}
.hb-umC:nth-child(2){background:var(--c-el3)}
.hb-umM{width:9vw;aspect-ratio:1;position:relative;overflow:hidden;background:var(--grunnur);border-radius:18px}
.hb-umM img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:transform var(--motion-reveal) var(--motion-out)}
.hb-umM img + img{transform:translateY(135%)}
@media (hover:hover) and (pointer:fine){.hb-umC:hover .hb-umM img:first-child{transform:translateY(-135%)}
  .hb-umC:hover .hb-umM img + img{transform:none}}
.hb-umN b{display:block;font-weight:500}
.hb-umN small{color:var(--c-ink-med)}
.hb-umT{grid-column:2;grid-row:1/3;margin:0;font-size:.92rem}
.hb-umQ{grid-column:1/-1;margin:0;font-family:var(--f-disp);font-size:clamp(1.1rem,2.08vw,2.5rem);line-height:1.1;letter-spacing:-.01em;max-width:26ch}
@media (max-width:991px){.hb-umC{min-height:52.083vw}.hb-umM{width:14vw}.hb-umQ{font-size:clamp(1.1rem,3.255vw,2.5rem)}}
@media (max-width:479px){.hb-umK{flex-direction:column}.hb-umC{width:100%;min-height:auto}.hb-umI{grid-template-columns:1fr}
  .hb-umT{grid-column:1;grid-row:auto}.hb-umM{width:30vw}.hb-umQ{font-size:clamp(1.5rem,6.4vw,5.25rem)}}


.hb-saga{display:flex;flex-direction:column;row-gap:clamp(1rem,6.2963vh,6rem);padding:0 var(--gut)}
.hb-sagaH{display:grid;grid-template-columns:1fr 2fr;gap:var(--col);padding:1.2rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-sagaH > p{margin:0;color:var(--c-ink-med);font-size:.92rem}
.hb-sagaR{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:1rem;padding:.35rem 0}
.hb-sagaR span{display:inline-block;padding:.35rem clamp(0.5rem,.8333vw,2.5rem);margin-left:clamp(-2.5rem,-.8333vw,-0.5rem);transition:transform var(--motion-panel) var(--motion-out)}
.hb-sagaR b{font-family:var(--f-disp);font-weight:600;font-size:clamp(1.1rem,2.08vw,2.5rem);letter-spacing:-.01em;font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.hb-sagaR:hover span{background:var(--c-form);color:#172D4D;transform:translateX(.8333vw)}}
@media (max-width:991px){.hb-sagaR b{font-size:clamp(1.1rem,3.255vw,2.5rem)}}
@media (max-width:479px){.hb-sagaH{grid-template-columns:1fr}.hb-sagaR b{font-size:clamp(1.5rem,6.4vw,5.25rem)}}


.hb-linur{position:relative}
.hb-linurP{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(1rem,6.2963vh,6rem);overflow:hidden}
.hb-linurL{display:flex;gap:var(--col);padding:0 var(--gut);will-change:transform}
.hb-lina2{flex:none;width:44.1667vw;height:24.7396vw;display:grid;grid-template-columns:1fr 1fr;border:0;padding:0;cursor:pointer;
  text-align:left;background:var(--c-el3);color:var(--c-ink);will-change:transform;position:relative}
.hb-lina2:nth-child(3n+2){background:var(--c-el2)}.hb-lina2:nth-child(3n+3){background:var(--c-el)}
.hb-lina2 figure{margin:0;background:var(--g);position:relative;overflow:hidden}
.hb-lina2 figure img{position:absolute;inset:12%;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(28,18,12,.28));
  transition:transform var(--motion-reveal) var(--motion-out)}

.hb-lina2 > div{display:flex;flex-direction:column;padding:clamp(0.5rem,1.25vw,2.5rem);gap:.6rem}
.hb-lina2 h3{margin:0;font-family:var(--f-disp);font-weight:600;font-size:clamp(1.1rem,2.08vw,2.5rem);line-height:1.05;letter-spacing:-.01em}
.hb-lina2 p{margin:0;font-size:.86rem;color:var(--c-ink-med)}
.hb-lina2 .hb-lf{margin-top:auto;display:flex;justify-content:space-between;font-size:.8rem}
@media (max-width:991px){
  .hb-linur{height:auto !important}
  .hb-linurP{position:relative;height:auto;overflow:visible}
  .hb-linurL{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;transform:none !important}
  .hb-linurL::-webkit-scrollbar{display:none}
  .hb-lina2{width:39.063vw;height:52.083vw;grid-template-columns:1fr;grid-template-rows:1.1fr 1fr;scroll-snap-align:start;transform:none !important}
  .hb-lina2 h3{font-size:clamp(1.1rem,3.255vw,2.5rem)}
}
@media (max-width:479px){.hb-lina2{width:83.333vw;height:111.111vw}.hb-lina2 h3{font-size:clamp(1.5rem,7vw,5.25rem)}.hb-lina2 > div{padding:clamp(1rem,4vw,6rem)}}


.hb-yfirl{display:flex;flex-direction:column;align-items:center;row-gap:clamp(1rem,4.4444vh,6rem);padding:0 var(--gut)}
.hb-yfirl .hb-sub{width:min(58vw,60rem);text-align:center}

.hb-panta{display:flex;align-items:center;gap:clamp(0.5rem,2.5vw,2.5rem);contain:layout}
.hb-panta p{margin:0;max-width:24ch;font-size:.92rem}
.hb-pantaM{width:0;overflow:hidden;flex-shrink:0;transition:none;height:max(3vw,44px)}
.hb-pantaM img{height:100%;width:auto;max-width:none;border-radius:10px;background:var(--grunnur)}

@media (max-width:991px){.hb-yfirl .hb-sub{width:80vw}.hb-panta{flex-direction:column;text-align:center}}
@media (max-width:479px){.hb-yfirl{align-items:flex-start}.hb-yfirl .hb-sub{width:auto;text-align:left}
  .hb-panta{align-items:flex-start;text-align:left}}


.hb-faq{display:grid;grid-template-columns:46.875vw 1fr;gap:var(--col);padding:0 var(--gut);align-items:start}
.hb-faqK{position:sticky;top:calc(var(--haus-h,64px) + 1.2rem);height:calc(100svh - var(--haus-h,64px) - 3.6rem);max-height:52rem;
  background:var(--fk,var(--c-el));transition:none;border-radius:24px;display:flex;flex-direction:column;
  justify-content:space-between;padding:clamp(1.1rem,1.6vw,1.8rem);overflow:hidden;color:#172D4D}
.hb-faqK .hb-disp{position:relative;z-index:2}
.hb-faqM{margin:0 -4%}
.hb-faqT{position:relative;z-index:2}
.hb-faqR{border-radius:14px}
.hb-faqM{position:relative;flex:1;overflow:hidden}
.hb-faqM img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;
  transform:translateY(135%);transition:transform var(--motion-reveal) var(--motion-out)}
.hb-faqM img.nu{transform:none}.hb-faqM img.farin{transform:translateY(-135%)}
.hb-faqT{display:flex;justify-content:space-between;gap:.5rem}
.hb-faqL{display:grid;gap:.35rem}
.hb-faqR{background:var(--c-form);color:#172D4D}
.hb-faqR button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;border:0;background:none;
  padding:0 0 0 clamp(0.5rem,1.04vw,2.5rem);min-height:3.4rem;cursor:pointer;text-align:left;color:inherit;font-weight:500}
.hb-faqR button i{width:3.4rem;height:3.4rem;flex:none;display:grid;place-items:center;box-shadow:inset 1px 0 0 rgba(23,45,77,.08)}
.hb-faqR button svg{transition:transform var(--motion-panel) var(--motion-out)}
.hb-faqR.opid button svg{transform:rotate(45deg)}
.hb-faqB{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--motion-panel) var(--motion-out)}
.hb-faqR.opid .hb-faqB{grid-template-rows:1fr}
.hb-faqB > div{overflow:hidden}
.hb-faqB p{margin:0;padding:0 clamp(0.5rem,1.04vw,2.5rem) 1.1rem;max-width:60ch;opacity:0;transition:opacity var(--motion-fast) var(--motion-out)}
.hb-faqR.opid .hb-faqB p{opacity:1;transition-delay:.16s}
@media (max-width:991px){.hb-faq{grid-template-columns:46.094vw 1fr}.hb-faqK{height:75vw;top:calc(var(--haus-h,60px) + 1rem)}}
@media (max-width:479px){.hb-faqT{display:grid;grid-template-columns:1fr 1fr}.hb-faq{grid-template-columns:1fr}.hb-faqK{position:static;height:calc(100svh - 22.223vw);margin-bottom:clamp(1rem,9.375vh,6rem)}}


.hb-fotM{position:relative;overflow:hidden;background:#204A8E}
.hb-fot{background:#204A8E;color:#FAF5EA;padding:var(--gut) var(--gut) calc(var(--gut) + env(safe-area-inset-bottom));will-change:transform}
.hb-fotRod{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.5rem;font-size:.94rem;line-height:1.45}
.hb-fotRod > div{display:contents}.hb-fotRod > div > div{min-width:0}.hb-fotRod br{display:none}.hb-fot .hb-fotRod a{display:flex;overflow-wrap:anywhere}.hb-fotRod small{margin-bottom:.4rem}
.hb-fotRod small{display:block;opacity:.7;font-size:.78rem}
.hb-fot a{text-decoration:none;display:inline-flex;min-height:44px;min-width:44px;align-items:center}

.hb-fotUpp{border:0;background:none;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;align-self:start;justify-self:end;padding:0}
.hb-fotMerki{width:clamp(12rem,26vw,24rem);margin:clamp(3rem,7vw,6rem) auto 2rem}
.hb-fotMerki img{width:100%;height:auto}
.hb-slogan{font-family:var(--f-disp);font-weight:700;font-size:clamp(1rem,11.7vw,12rem);line-height:1.08;letter-spacing:-.01em;
  white-space:nowrap;text-align:left;overflow:hidden;padding:.12em 0 .16em;margin:0 0 .5rem;user-select:none}
.hb-slogan span{display:inline-block;will-change:transform;transition:none}
.hb-slogan span > span{display:inline-block;transition:transform var(--motion-ui) var(--motion-out)}
.hb-fotBot{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.5rem;align-items:center;font-size:.85rem}.hb-fotBot > span:nth-child(2){grid-column:2 / 5}.hb-fotBot .hb-studioBadge{grid-column:5;justify-self:end;display:inline-flex;gap:.5rem;min-height:44px;white-space:nowrap}
@media (max-width:760px){.hb-fotRod{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 1rem}.hb-fotUpp{grid-column:1 / -1;justify-self:start}.hb-fotBot{grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem 1rem}.hb-fotBot > span:nth-child(2){grid-column:1 / -1;grid-row:2}.hb-fotBot .hb-studioBadge{grid-column:2;grid-row:1}.hb-slogan{font-size:clamp(2.25rem,11.7vw,6rem);letter-spacing:-.01em}}


.hb-root{--r:clamp(10px,.9vw,16px)}
.hb-reit,.hb-kort,.hb-galI,.hb-formP,.hb-svar,.hb-val label,.hb-nidur,.hb-teymiL div,
.hb-reitir input,.hb-reitir textarea,.hb-lina2,.hb-lina2 figure,.hb-faqK,.hb-faqR,.hb-umM,.hb-vMynd,.hb-ofnK{border-radius:var(--r)}
.hb-lina2 figure{border-radius:var(--r) 0 0 var(--r)}
@media (max-width:991px){.hb-lina2 figure{border-radius:var(--r) var(--r) 0 0}}
.hb-bitiM{border-radius:.16em}
.hb-magn,.hb-tegund,.hb-reitur input,.hb-reitur textarea,.hb-kvittun,.hb-pokiH b{border-radius:var(--r)}
.hb-btn,.hb-hnappur,.hb-sett,.hb-haus .hb-pokiH,.hb-braud{border-radius:999px}
.hb-faqR{overflow:hidden}
.hb-disp{letter-spacing:-.01em}
.hb-lit div{flex-wrap:wrap;max-width:none;gap:0}
.hb-lit button{width:44px;height:44px}
@media (max-width:479px){.hb-lit div{max-width:132px}}
@media (max-width:1600px){.hb-stika{grid-template-columns:minmax(0,1fr) auto}.hb-takkar{grid-column:1/-1}}
@media (max-width:479px){.hb-slogan{font-size:clamp(2.25rem,min(13.4vw,4.4rem),6rem)}}
@media (min-width:992px){
  .hb-reit:nth-child(1){grid-area:1/1/2/2}.hb-reit:nth-child(2){grid-area:1/3/2/4}
  .hb-reit:nth-child(3){grid-area:2/2/3/3}.hb-reit:nth-child(4){grid-area:2/4/3/5}
  .hb-reit:nth-child(5){grid-area:3/1/4/2}.hb-reit:nth-child(6){grid-area:3/3/4/4}
  .hb-reit:nth-child(7){grid-area:3/4/4/5}
}
@media (max-width:991px){.hb-reit:nth-child(5){display:block}.hb-reit:nth-child(7){grid-column:3}}


${ALLERGEN_CSS}
`



// Lausar hnetur sem svífa í bakgrunni: hver með sína dýpt (d) fyrir músarhliðrun og sinn takt.
const SVIF: { p: string; x: number; y: number; s: number; d: number; r: number }[] = [
  { p: 'p00', x: 52, y: 8, s: 2.6, d: 1.2, r: -18 }, { p: 'p06', x: 58, y: 54, s: 2.2, d: .8, r: 24 },
  { p: 'p02', x: 52, y: 80, s: 3.0, d: 1.4, r: 12 }, { p: 'p08', x: 60, y: 5, s: 2.4, d: 1, r: -30 },
  { p: 'p05', x: 90, y: 6, s: 2.8, d: 1.3, r: 40 }, { p: 'p11', x: 71, y: 92, s: 2.4, d: .9, r: -8 },
  { p: 'p14', x: 94, y: 89, s: 2.2, d: 1.1, r: 16 }, { p: 'p20', x: 53, y: 88, s: 2.6, d: .7, r: -22 },
]
const VERSLANIR = ['Bónus', 'Krónunni', 'Hagkaup', 'Nettó', 'Fjarðarkaupum', 'Melabúðinni', 'Samkaupum', '10-11', 'Iceland', 'N1', 'Olís',
  'Kaupfélagi Skagfirðinga', 'Hlíðarkaupum', 'Vöruvali', 'Albínu', 'Fjölvali', 'Skeljungi', 'Kaupfélagi Steingrímsfjarðar', 'Kaupfélagi V-Húnvetninga']

export function Svif({ listi = SVIF, k = '' }: { listi?: typeof SVIF; k?: string }) {
  return (
    <div className={`hb-svif ${k}`} aria-hidden="true">
      {listi.map((n, i) => (
        <span key={i} style={{ left: `${n.x}%`, top: `${n.y}%`, '--s': `${n.s}vw`, '--d': n.d, '--r': `${n.r}deg`, '--t': `${7 + (i % 4) * 1.7}s`, '--w': `${-i * 1.3}s` } as CSSProperties}>
          <img src={`${B}hberg/laus/${n.p}.webp${V}`} alt="" width={160} height={160} decoding="async" />
        </span>
      ))}
    </div>
  )
}

function Hero() {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return
    // Mjúk fjöðrun: músin gefur markgildi, rammi fyrir ramma eltir staðan það með lerp, svo hreyfingin rennur.
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.055
      cy += (ty - cy) * 0.055
      el.style.setProperty('--mx', cx.toFixed(4))
      el.style.setProperty('--my', cy.toFixed(4))
      raf = Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : 0
    }
    const fara = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width - .5
      ty = (e.clientY - r.top) / r.height - .5
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const ut = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick) }
    el.addEventListener('pointermove', fara)
    el.addEventListener('pointerleave', ut)
    return () => { el.removeEventListener('pointermove', fara); el.removeEventListener('pointerleave', ut); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="hb-heroP">
      <section className="hb-hero" id="top" ref={ref}>
        <Svif k="hb-svifH" />
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
          <div className="hb-heroNe">
            <p className="hb-heroSlag hb-mask hb-maskP"><span className="hb-up" style={{ ...step(3), ['--dur' as string]: 'var(--motion-reveal)' }}>
              {PRODUCTS.length} vörur undir eigin merki, pakkaðar í Hafnarfirði. Fást í Bónus, Krónunni, Hagkaup og hjá {VERSLANIR.length - 3} öðrum söluaðilum.
            </span></p>
            <div className="hb-heroCta hb-mask"><div className="hb-up" style={step(4)}>
              <button className="hb-btn hb-casH" onClick={() => faraA('#vorur')}><Cas t="Skoða vörurnar" /></button>
              <button className="hb-btn sc hb-casH" onClick={(e) => poki.open(true, e)}><Cas t="Pöntun fyrir verslanir" /></button>
            </div></div>
          </div>
        </Reveal>
        <Reveal className="hb-rist">
          {HERO_REITIR.map((r, i) => (
            <button className="hb-reit hb-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}
              data-bendill="Skoða" aria-label={`${r.n}, nánar`} onClick={() => pop.open({ k: 'vara', slug: r.img.replace(/^hero:/, '') })}>
              <img className="hb-up" style={step(i)} src={PK(r.img.replace(/^hero:/, ''), 'pack', 'm')} alt="" width={800} height={800}
                loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
            </button>
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
      <Svif k="hb-svifS" listi={[{ p: 'p03', x: 8, y: 10, s: 3.4, d: 1, r: 20 }, { p: 'p09', x: 86, y: 4, s: 4, d: 1.3, r: -16 },
        { p: 'p12', x: 90, y: 78, s: 3, d: .8, r: 30 }, { p: 'p17', x: 12, y: 74, s: 3.8, d: 1.2, r: -28 }, { p: 'p24', x: 52, y: 96, s: 2.6, d: .6, r: 8 }]} />
      <Reveal margin="0px 0px -25% 0px">
        <h2 className="hb-disp hb-setning">
          {SETNING.map((lina, li) => (
            <span className="hb-mask hb-setL" key={li}>
              <span className="hb-up hb-lina" style={{ ...step(li), ['--dur' as string]: 'var(--motion-reveal)' }}>
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

// Tölur af hberg.is (um-fyrirtaekid, soluadilar, vörulisti), 30.10.
const TOLUR = [
  { n: '2007', t: 'Stofnað af Halldóri Berg og fjölskyldu', g: '#F2C98A', h: 'p00' },
  { n: String(PRODUCTS.length), t: 'Vörur undir merki H-Berg', g: '#E9B3A1', h: 'p06' },
  { n: '19', t: 'Söluaðilar um allt land, frá Bónus til Melabúðarinnar', g: '#C9D3A2', h: 'p02' },
  { n: '800', t: 'Fermetrar fyrir framleiðslu og pökkun í Hafnarfirði', g: '#B9CBD9', h: 'p08' },
]

function Kostir() {
  return (
    <section className="hb-kostir">
      <Reveal><Ord className="hb-disp" text="H-Berg | frá 2007" /></Reveal>
      <Reveal className="hb-tolur" hver>
        {TOLUR.map((k, i) => (
          <div className="hb-tala hb-mask" key={k.n} style={{ '--g': k.g } as CSSProperties}>
            <div className="hb-up" style={{ ...step(i), ['--dur' as string]: 'var(--motion-reveal)' }}>
              <b>{k.n}</b><span>{k.t}</span>
              <img src={`${B}hberg/laus/${k.h}.webp${V}`} alt="" width={160} height={160} loading="lazy" />
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
      <div className="hb-galW">
      <GalleriOrvar />
      <div className="hb-galK">
        <Reveal as="ul" className="hb-galL" margin="0px 0px -40% 0px">
          {GALLERI.map((g, i) => (
            <li key={g.img}>
              <button className="hb-galI" style={{ ['--g' as string]: g.g, ['--d' as string]: `${(Math.min(i, 10) * 0.06).toFixed(2)}s` }}
                data-bendill="Skoða" aria-label={`${g.n}, nánar`}
                onClick={() => pop.open({ k: 'vara', slug: g.img })}>
                <img src={Ms(g.img)} alt="" width={300} height={340} loading="lazy" decoding="async" />
              </button>
              <span className="hb-galInfo" aria-hidden="true">
                <b>{g.n}</b>
                <small>{g.a.length > 0 ? `${g.d} · Inniheldur ${g.a.join(', ').toLowerCase()}` : g.d}</small>
              </span>
            </li>
          ))}
        </Reveal>
      </div>
      </div>
    </section>
  )
}


const Or = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
function GalleriOrvar() {
  const [endar, setEndar] = useState<[boolean, boolean]>([true, false])
  useEffect(() => {
    const k = document.querySelector<HTMLElement>('.hb-galK')
    if (!k) return
    const upd = () => setEndar([k.scrollLeft < 4, k.scrollLeft > k.scrollWidth - k.clientWidth - 4])
    upd()
    k.addEventListener('scroll', upd, { passive: true })
    window.addEventListener('resize', upd)
    return () => { k.removeEventListener('scroll', upd); window.removeEventListener('resize', upd) }
  }, [])
  const fara = (d: number) => {
    const k = document.querySelector<HTMLElement>('.hb-galK')
    if (k) k.scrollBy({ left: d * k.clientWidth * 0.8, behavior: reduced() ? 'auto' : 'smooth' })
  }
  return (
    <div className="hb-galNav">
      <button type="button" aria-label="Fyrri vörur" disabled={endar[0]} onClick={() => fara(-1)}><Or d="M10 3 5 8l5 5" /></button>
      <button type="button" aria-label="Næstu vörur" disabled={endar[1]} onClick={() => fara(1)}><Or d="M6 3l5 5-5 5" /></button>
    </div>
  )
}

function GalleriDrift() {
  useEffect(() => {
    const k = document.querySelector<HTMLElement>('.hb-galK')
    const l = document.querySelector<HTMLElement>('.hb-galL')
    if (!k || !l) return
    // far tiles scroll in faster than lazy loading fetches them; start them all once the strip is near
    const pre = new IntersectionObserver(([e]) => { if (e.isIntersecting) { l.querySelectorAll('img').forEach((i) => { i.loading = 'eager' }); pre.disconnect() } }, { rootMargin: '100% 0px' })
    pre.observe(k)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => pre.disconnect()
    // drag to scroll; no pointer capture (it kills the tile clicks), and a drag swallows the click it ends on
    let x0 = 0, s0 = 0, nidri = false, dregid = false
    const nidur = (e: MouseEvent) => { if (e.button !== 0) return; nidri = true; dregid = false; x0 = e.clientX; s0 = k.scrollLeft }
    const hreyfa = (e: MouseEvent) => {
      if (!nidri) return
      const dx = e.clientX - x0
      if (!dregid && Math.abs(dx) > 6) { dregid = true; k.classList.add('drag') }
      if (dregid) { e.preventDefault(); k.scrollLeft = s0 - dx }
    }
    const gleypa = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    const upp = () => {
      if (!nidri) return
      nidri = false
      if (!dregid) return
      k.classList.remove('drag')
      k.addEventListener('click', gleypa, { capture: true })
      window.setTimeout(() => k.removeEventListener('click', gleypa, { capture: true }), 0)
    }
    const ekkiDraga = (e: DragEvent) => e.preventDefault()
    k.addEventListener('mousedown', nidur)
    k.addEventListener('dragstart', ekkiDraga)
    window.addEventListener('mousemove', hreyfa)
    window.addEventListener('mouseup', upp)
    return () => {
      pre.disconnect(); k.removeEventListener('mousedown', nidur); k.removeEventListener('dragstart', ekkiDraga)
      window.removeEventListener('mousemove', hreyfa); window.removeEventListener('mouseup', upp)
    }
  }, [])
  return null
}


function Ofnaemi() { return <AllergenSection /> }

function Form() {
  const [flipi, setFlipi] = useState<'quiz' | 'spyrja'>('quiz')
  const [val, setVal] = useState<number | null>(null)
  const leid: Leid | null = val === null ? null : ERINDI[val]
  const gera = (l: Leid, e: ReactMouseEvent<HTMLElement>) => {
    if (l.hlekkur === '#poki') poki.open(true, e)
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
                    <button className="hb-btn hb-casH" onClick={(e) => gera(leid, e)}><Cas t={leid.ord} /></button>
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
          <article className="hb-umC hb-mask" key={k.n} style={{ '--grunnur': productBySlug(k.a)?.tint ?? k.g } as CSSProperties}>
            <div className="hb-up hb-umI" style={{ ...step(i), ['--dur' as string]: 'var(--motion-reveal)' }}>
              <div className="hb-umM"><img src={Ms(k.a)} style={{ background: productBySlug(k.a)?.tint }} alt="" width={300} height={340} loading="lazy" /><img src={Ms(k.b)} style={{ background: productBySlug(k.b)?.tint }} alt="" width={300} height={340} loading="lazy" /></div>
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
            <p className="hb-up" style={{ ...step(i), ['--dur' as string]: 'var(--motion-reveal)' }}>{h.h}</p>
            <div className="hb-up" style={{ ...step(i), ['--dur' as string]: 'var(--motion-reveal)' }}>
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
              <button className="hb-lina2" key={l.s} data-bendill="Opna" style={{ ['--g' as string]: productBySlug(l.img)?.tint ?? l.g }}
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
        <h2 className="hb-sub hb-up" style={{ ['--dur' as string]: 'var(--motion-reveal)' }}>„{TILVITNUN}“</h2>
      </Reveal>
      <div className="hb-panta">
        <p>Pantar þú fyrir verslun eða stóreldhús? Settu vörur á listann og opnaðu pöntunina í tölvupósti.</p>
        <span className="hb-pantaM"><img ref={mynd} style={{ background: productBySlug('kasjusmjor')?.tint }} src={Ms('kasjusmjor')} alt="" width={460} height={110} /></span>
        <button className="hb-btn hb-casH" onClick={(e) => poki.open(true, e)}><Cas t="Opna pöntunarlistann" /></button>
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
      <div className="hb-faqK" style={{ '--fk': productBySlug(MYNDIR[k])?.tint } as CSSProperties}>
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
            <div className="hb-up" style={{ ...step(i % 4), ['--dur' as string]: 'var(--motion-reveal)' }}>
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
    let alive = true
    const measure = () => {
      if (!alive) return
      const s = slag.current
      if (s) {
        const advance = [...s.children].reduce((n, c) => n + c.getBoundingClientRect().width, 0)
        const size = parseFloat(getComputedStyle(s).fontSize)
        const fit = advance > 0 ? size * s.clientWidth / advance : size
        if (Math.abs(fit - size) > .05) s.style.fontSize = `${fit}px`
      }
      setH(Math.ceil(f.getBoundingClientRect().height))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(f)
    window.addEventListener('resize', measure)
    document.fonts?.addEventListener('loadingdone', measure)
    document.fonts?.ready.then(measure)
    return () => { alive = false; ro.disconnect(); window.removeEventListener('resize', measure); document.fonts?.removeEventListener('loadingdone', measure) }
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
              <a href="#poki" onClick={(e) => { e.preventDefault(); poki.open(true, e) }}>Pöntunarlisti</a><br />
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
          <SndrBadge dark className="hb-studioBadge" />
        </div>
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
      <style>{CSS}{PAGE_CSS}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}{POP_CSS}{EYD_CSS}{MERKI_CSS}{EXPERIENCE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Bendill />
      <Haus />
      <Poki />
      <Popup />
      <Hledsla />
      <GalleriDrift />
      <main>
        <Hero />
        <Soluadilar />
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
