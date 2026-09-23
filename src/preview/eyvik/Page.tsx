import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import { CONTACT, COTTAGES, FILM, HOST, IMG, INSIDE, JSON_LD, KNOW, NEAR, RIDGE, SPEC, THEIR_WORDS, VOICES, type Photo } from './data'
import { StayPicker, STAY_CSS, type Unit } from './StayPicker'

/*
 * EYVÍK — "Five cottages, one ridge". DESIGN.md beside this file.
 *
 * Built from Sindri's three boards (22.09.2026): the split poster (a paper
 * panel beside a full-bleed photograph), tall condensed serif caps, one italic
 * swash word, small mono labels, underlined links. Palette sampled from the
 * owners' own frames: haze paper, dry-grass ochre, moor rust, moss, aurora night.
 *
 * Mechanics carried from our own shipped systems, not their looks:
 *  - Mirror House: one scroll = one day, the panel colour follows the light.
 *  - Samara (Mobbin) "Five sizes": one cottage centred, neighbours clipped.
 *  - Aurora Hills → Riverbank → Fagravík: the stay picker, now five calendars.
 *  - Reynir: the constant bar + awning chrome. No Lenis, anywhere.
 * Reveals are position-tied (CSS view timelines), never timed.
 */

const company = getPreviewCompany('eyvik')
const YEAR = new Date().getFullYear()
const B = import.meta.env.BASE_URL

const INK = '#1D1A14'
const MOSS_DEEP = '#242C1C'

/* grain, drawn once: a paper panel without it reads as flat UI */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const CSS = `
@font-face{font-family:'EvC';src:url('${B}fonts/sprat/Sprat-CondensedLight.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'EvC';src:url('${B}fonts/sprat/Sprat-CondesedRegular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'EvI';src:url('${B}fonts/instrument-serif/InstrumentSerif-Italic.woff2') format('woff2');font-style:italic;font-weight:400;font-display:swap}
@font-face{font-family:'EvS';src:url('${B}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'EvS';src:url('${B}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'EvS';src:url('${B}fonts/switzer/Switzer-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'EvM';src:url('${B}fonts/fragment-mono/FragmentMono-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
html,body{background-color:${MOSS_DEEP}}
.ev{--paper:#EAE2D0;--sand:#DCCEB2;--grass:#9E7C4D;--rust:#9A542B;--moss:#34402A;--moss-deep:${MOSS_DEEP};--night:#0A1A14;--ink:${INK};--mute:#6E6553;
  --line:rgba(29,26,20,.14);--gut:clamp(18px,4.6vw,72px);--ease:cubic-bezier(.16,1,.3,1);--r:clamp(14px,1.6vw,22px);
  font-family:'EvS',system-ui,sans-serif;font-size:16px;line-height:1.6;color:var(--ink);background:var(--paper);overflow-x:clip;-webkit-font-smoothing:antialiased}
.ev *{box-sizing:border-box}
.ev img,.ev video{display:block;width:100%;height:100%;object-fit:cover}
.ev a{color:inherit}
.ev p{margin:0}
.ev h1,.ev h2,.ev h3{margin:0;font-weight:400}
.ev section{scroll-margin-top:0}
.ev .cap{font-family:'EvC',Georgia,serif;font-weight:300;text-transform:uppercase;letter-spacing:.005em;line-height:.88}
.ev h2.cap{display:grid}
.ev .ln{display:block;overflow:clip;padding:.16em .06em .08em;margin:-.16em -.06em -.08em}
.ev .ln>span{display:inline-block}
.ev .ev-rule{transform-origin:left}
.ev .q,.ev h1{text-wrap:balance}
.ev p{text-wrap:pretty}
.ev a,.ev button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.ev .skip{position:fixed;left:1rem;top:-100px;z-index:200;background:var(--paper);color:var(--ink);padding:.7rem 1rem;border-radius:999px;text-decoration:none}
.ev .skip:focus{top:calc(72px + env(safe-area-inset-top))}
.ev h2.cap>span:nth-child(2){padding-left:.7em}
.ev h2.cap>span:nth-child(3){padding-left:.25em}
@media (max-width:620px){.ev h2.cap{font-size:clamp(2.4rem,11.6vw,3.4rem)!important}.ev h2.cap>span:nth-child(2){padding-left:.4em}}
.ev sup.u{font-family:'EvS',sans-serif;font-size:.34em;vertical-align:super;letter-spacing:0;margin-left:.08em;text-transform:none}
.ev .sw{font-family:'EvI',Georgia,serif;font-style:italic;text-transform:none;letter-spacing:-.01em}
.ev .mono{font-family:'EvM',ui-monospace,monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.ev .grain{position:relative;isolation:isolate}
.ev .grain::after{content:'';position:absolute;inset:0;background-image:${GRAIN};opacity:.16;mix-blend-mode:multiply;pointer-events:none;z-index:0}
.ev .grain>*{position:relative;z-index:1}
.ev .ev-link{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.28em;transition:text-decoration-color .3s var(--ease)}
@media (hover:hover){.ev .ev-link:hover{text-decoration-color:transparent}}
.ev .ev-pill{display:inline-flex;align-items:center;gap:.5rem;height:46px;padding:0 1.25rem;border-radius:999px;border:1px solid currentColor;text-decoration:none;font-size:14px;font-weight:500;letter-spacing:.01em;cursor:pointer;background:transparent;transition:background-color .3s var(--ease),color .3s var(--ease),transform .3s var(--ease)}
.ev .ev-pill.dark{background:var(--moss);color:var(--paper);border-color:var(--moss)}
.ev .ev-pill.light{background:var(--paper);color:var(--moss);border-color:var(--paper)}
@media (hover:hover){.ev .ev-pill:hover{transform:translateY(-1px)}.ev .ev-pill.dark:hover{background:var(--moss-deep)}}
.ev .ev-pill:active{transform:scale(.98)}
.ev .ev-pill:focus-visible,.ev button:focus-visible,.ev a:focus-visible{outline:2px solid var(--rust);outline-offset:3px}
.ev .star{display:inline-block;width:.62em;height:.62em;vertical-align:.08em}

/* ── chrome: the constant bar + the awning (mobile-chrome-standard) ── */
.ev-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:148;pointer-events:none;background:transparent;
  -webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);-webkit-mask-image:linear-gradient(180deg,#000 88%,transparent);mask-image:linear-gradient(180deg,#000 88%,transparent)}
/* the awning again (mobile-chrome-standard), but colourless: iOS paints only the
   SCROLLING layer in the status-bar strip, so a sticky blur is the only thing that
   can soften text passing up there. Fixed elements paint nothing above the viewport. */
.ev-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:calc(64px + env(safe-area-inset-top));padding-top:env(safe-area-inset-top)!important;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 var(--gut);
  background:transparent;color:#EAE2D0;mix-blend-mode:difference}
/* self-theming chrome (Mirror House): no plate, no blur. Everything in the bar is
   drawn in paper and blended by difference, so it inverts against whatever passes
   beneath: light over the photos and the night, dark over the paper sections. */
.ev-bar .ev-pill.light{background:transparent;color:inherit;border-color:currentColor}
.ev-burger{border-color:currentColor!important;color:inherit!important}
.ev-bar .mark{display:inline-flex;align-items:baseline;gap:.35rem;text-decoration:none;font-family:'EvC',Georgia,serif;font-size:26px;letter-spacing:.06em;line-height:1}
.ev-bar .mark small{font-family:'EvM',monospace;font-size:10px;letter-spacing:.16em;opacity:.7}
.ev-bar .end{display:flex;align-items:center;gap:.8rem}
.ev-bar .ev-pill{height:40px;padding:0 1rem;font-size:13.5px}
.ev-burger{display:none;height:40px;min-width:64px;padding:0 .9rem;border-radius:999px;border:1px solid rgba(234,226,208,.4);background:transparent;color:var(--paper);font:inherit;font-size:13.5px;cursor:pointer}
.ev-menu{position:fixed;inset:calc(64px + env(safe-area-inset-top)) 0 0 0;z-index:149;background:${MOSS_DEEP};color:var(--paper);padding:2rem var(--gut) calc(2rem + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:.4rem;
  visibility:hidden;clip-path:inset(0 0 100% 0);transition:clip-path .45s var(--ease),visibility 0s .45s;overscroll-behavior:contain}
.ev-menu.open{visibility:visible;clip-path:inset(0 0 0 0);transition:clip-path .6s var(--ease)}
.ev-menu a{font-family:'EvC',Georgia,serif;font-size:3rem;line-height:1.05;text-transform:uppercase;text-decoration:none;opacity:0;transform:translateY(18px);transition:opacity .2s,transform .3s}
.ev-menu.open a{opacity:1;transform:none;transition:opacity .5s var(--ease) calc(.1s + var(--i,0)*55ms),transform .7s var(--ease) calc(.1s + var(--i,0)*55ms)}
.ev-menu .foot{margin-top:auto;display:grid;gap:.3rem;font-size:15px;opacity:.8}
.ev-menu .foot a{font-family:inherit;font-size:15px;text-transform:none;opacity:1;transform:none}
@media (max-width:900px){.ev-bar .end .ev-pill{display:none}.ev-burger{display:block}}


/* ── the ridge nav: horizon, five cottages, a sun that crosses with the page ── */
.ev-ridgenav{position:absolute;left:50%;top:calc(env(safe-area-inset-top) + 6px);transform:translateX(-50%);width:min(330px,44vw);display:grid;justify-items:center;gap:1px}
.ev-ridgenav svg{width:100%;height:auto;overflow:visible;display:block}
.ev-ridgenav .hz{stroke:currentColor;stroke-width:1;opacity:.55}
.ev-ridgenav .hs{color:inherit;cursor:pointer;outline:none}
.ev-ridgenav .hit{fill:transparent}
.ev-ridgenav .h{fill:none;stroke:currentColor;stroke-width:1.15;stroke-linejoin:round;opacity:.62;transition:opacity .25s var(--ease),transform .35s var(--ease);transform-box:fill-box;transform-origin:center bottom}
.ev-ridgenav .h .w{fill:transparent;transition:fill .3s var(--ease)}
.ev-ridgenav .h .dk{stroke-width:.8}
.ev-ridgenav .hs.on .h{opacity:1}
.ev-ridgenav .hs.on .h .w{fill:currentColor}
@media (hover:hover) and (pointer:fine){.ev-ridgenav .hs.hv .h{opacity:1;transform:translateY(-2px)}}
.ev-ridgenav .hs:focus-visible .h{opacity:1;stroke-width:1.8}
.ev-ridgenav .sun .disc{fill:currentColor;transition:opacity .4s}
.ev-ridgenav .sun .moon{fill:currentColor;opacity:0;transition:opacity .4s}
.ev-ridgenav .sun[data-night="1"] .disc{opacity:0}
.ev-ridgenav .sun[data-night="1"] .moon{opacity:1}
.ev-ridgenav .lbl{font-size:9.5px;letter-spacing:.2em;opacity:.8;white-space:nowrap}
@media (max-width:900px){.ev-bar .mark small{display:none}.ev-ridgenav{width:min(168px,42vw);left:auto;right:calc(var(--gut) + 76px);transform:none}.ev-ridgenav .lbl{font-size:8.5px}}
@media (max-width:360px){.ev-ridgenav .lbl{display:none}}
/* progressive blur under the bar: no colour, so it stays seamless, but words passing
   beneath soften instead of colliding with the header. A SIBLING of the bar, because
   backdrop-filter on the bar itself would flatten its difference blend. */
.ev-veil{position:fixed;inset:0 0 auto 0;height:calc(92px + env(safe-area-inset-top));z-index:149;pointer-events:none;-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);
  -webkit-mask-image:linear-gradient(180deg,#000 0%,#000 45%,transparent 100%);mask-image:linear-gradient(180deg,#000 0%,#000 45%,transparent 100%)}

/* ── cursor ring (board 2), fine pointers only ── */
.ev-cursor{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;pointer-events:none;z-index:160;mix-blend-mode:difference;opacity:0;transition:opacity .25s var(--ease)}
.ev-cursor i{position:absolute;inset:0;border:1px solid var(--paper);border-radius:50%;transition:transform .3s var(--ease)}
.ev-cursor.on{opacity:1}
.ev-cursor.big i{transform:scale(1.9)}
@media (hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.ev-cursor{display:none}}

/* ── 1 · the split poster hero ── */
.ev-hero{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);min-height:100svh;background:var(--moss);color:var(--paper)}
.ev-hero .panel{container-type:inline-size;display:flex;flex-direction:column;justify-content:space-between;gap:3rem;padding:calc(64px + clamp(1.6rem,3.4vw,3.2rem)) var(--gut) clamp(1.4rem,2.6vw,2.4rem)}
.ev-hero .panel .grain-wrap{display:contents}
.ev-hero .top{display:flex;justify-content:space-between;gap:1rem;opacity:.78}
.ev-hero h1{font-size:min(16cqi,9rem);display:grid;gap:.02em}
.ev-hero h1 .l2{padding-left:.45em}
.ev-hero h1 .l3{padding-left:.3em}
.ev-hero h1 .sw{font-size:1.02em;color:var(--sand)}
.ev-hero .foot{display:grid;justify-items:start;gap:1.1rem}
.ev-hero .lede{max-width:24ch;font-family:'EvI',Georgia,serif;font-style:italic;font-size:clamp(1.3rem,1.9vw,1.75rem);line-height:1.2;opacity:.92}
.ev-hero .ctas{display:flex;flex-wrap:wrap;gap:.7rem 1.4rem;align-items:center;margin-top:1.2rem}
.ev-hero .word{font-family:'EvS',sans-serif;font-weight:500;font-size:min(27cqi,13.5rem);line-height:.8;letter-spacing:-.045em;display:flex;align-items:flex-start;gap:.08em;margin-left:-.05em}
.ev-hero .word .star{width:.3em;height:.3em;margin-top:.04em;color:var(--sand)}
.ev-hero .proof{opacity:.7}
.ev-hero .photo{position:relative;overflow:clip}
.ev-hero .photo img,.ev-hero .photo video{scale:1.06;animation:evSettle 2.6s var(--ease) both}
.ev-hero .photo .tag{position:absolute;left:1.2rem;bottom:1.1rem;color:var(--paper);text-shadow:0 1px 12px rgba(0,0,0,.35)}
@keyframes evSettle{from{scale:1.16}to{scale:1.06}}
.ev-hero .rise{display:block;overflow:clip;padding-bottom:.06em}
.ev-hero .rise>span{display:block;animation:evRise 1.1s var(--ease) both;animation-delay:calc(.15s + var(--i,0)*.09s)}
.ev-hero .fade{animation:evFade 1s var(--ease) both;animation-delay:calc(.5s + var(--i,0)*.08s)}
@keyframes evRise{from{transform:translateY(105%)}to{transform:none}}
@keyframes evFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (max-width:900px){
  .ev-hero{grid-template-columns:1fr;grid-template-rows:auto minmax(58svh,1fr);min-height:0}
  .ev-hero .photo{order:-1;border-radius:0;height:calc(58svh + 64px)}
  .ev-hero .panel{gap:1.6rem;padding-top:clamp(1.6rem,6vw,2.4rem)}
}


/* ── 2 · their line ── */
.ev-line{background:var(--paper);padding:clamp(4.5rem,11vw,10rem) var(--gut) clamp(3.5rem,8vw,7rem)}
.ev-line .q{font-size:clamp(2.4rem,6.2vw,6.6rem);max-width:15ch}
.ev-line .q .sw{color:var(--rust)}
.ev-line .by{margin-top:1.6rem;color:var(--mute)}
.ev-line .spec{margin-top:clamp(3rem,7vw,6rem);display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}
.ev-line .spec div{padding:1.4rem 1rem 0 0;display:grid;gap:.3rem}
.ev-line .spec div+div{padding-left:1rem;border-left:1px solid var(--line)}
.ev-line .spec b{font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(2.6rem,5vw,4.6rem);line-height:.9}
.ev-line .spec span{color:var(--mute);font-size:14.5px}
@media (max-width:760px){.ev-line .spec{grid-template-columns:1fr 1fr}.ev-line .spec div:nth-child(3){border-left:0;padding-left:0}.ev-line .spec div:nth-child(n+3){border-top:1px solid var(--line);margin-top:1.4rem}}

/* ── 3 · along the ridge: desktop pins and travels sideways, phones stack ── */
.ev-ridge{position:relative;overflow:clip;color:var(--ink)}
.ev-ridge .track{display:flex;align-items:center;gap:clamp(3rem,6vw,7rem);width:max-content;height:100svh;padding:64px 7vw 0;
  background:linear-gradient(90deg,#DCCEB2 0%,#D3BD93 22%,#B8925A 42%,#6A6150 62%,#262C2A 80%,#0A1A14 100%)}
.ev-ridge .intro{flex:none;width:min(34rem,36vw);display:grid;gap:1.3rem;align-self:center}
.ev-ridge .intro h2{font-size:clamp(3.4rem,6.6vw,7.4rem)}
.ev-ridge .intro h2 .sw{color:var(--rust)}
.ev-ridge .intro p{max-width:30ch}
.ev-ridge .hint{display:flex;align-items:center;gap:.8rem}
.ev-ridge .hint i{display:block;width:3.4rem;height:1px;background:currentColor}
.ev-ridge .pn{flex:none;width:var(--w);display:grid;gap:1.1rem;align-self:var(--a,center)}
.ev-ridge .fr{margin:0;height:var(--h);border-radius:var(--r);overflow:clip;position:relative;background:rgba(0,0,0,.08)}
.ev-ridge .fr img,.ev-ridge .fr video{scale:1.16}
.ev-ridge .cap-in{display:grid;grid-template-columns:auto 1fr;gap:.2rem 1.4rem;align-items:baseline;max-width:44rem}
.ev-ridge .cap-in .mono{opacity:.72}
.ev-ridge h3{font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(1.9rem,2.8vw,3rem);line-height:.95;text-transform:uppercase}
.ev-ridge blockquote{grid-column:2;margin:.2rem 0 0;font-family:'EvI',Georgia,serif;font-style:italic;font-size:clamp(1.05rem,1.3vw,1.3rem);line-height:1.3;max-width:34ch;opacity:.9}
.ev-ridge cite{display:block;margin-top:.3rem;font-family:'EvM',monospace;font-style:normal;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
.ev-ridge .pn.dark{color:var(--paper)}
.ev-ridge .end{flex:none;width:min(30rem,32vw);color:var(--paper);display:grid;gap:1.2rem;align-self:center}
.ev-ridge .end h3{font-size:clamp(2.6rem,4vw,4.4rem)}
.ev-ridge .end .sw{color:#9FD8B4;text-transform:none}
.ev-ridge .rp{position:absolute;left:7vw;right:7vw;bottom:clamp(1.2rem,3vh,2.2rem);height:1px;background:currentColor;opacity:.22}
.ev-ridge .rp i{position:absolute;inset:0;background:currentColor;transform:scaleX(var(--rp,0));transform-origin:left;opacity:1}
@media (max-width:1023px),(pointer:coarse){
  .ev-ridge .track{flex-direction:column;align-items:stretch;width:auto;height:auto;padding:clamp(4rem,12vw,6rem) var(--gut);gap:clamp(3.2rem,12vw,5rem);
    background:linear-gradient(180deg,#DCCEB2 0%,#D3BD93 22%,#B8925A 42%,#6A6150 62%,#262C2A 80%,#0A1A14 100%)}
  .ev-ridge .intro,.ev-ridge .pn,.ev-ridge .end{width:auto;align-self:stretch}
  .ev-ridge .fr{height:auto;aspect-ratio:var(--ar)}
  .ev-ridge .fr img,.ev-ridge .fr video{scale:1}
  .ev-ridge .hint,.ev-ridge .rp{display:none}
  .ev-ridge .cap-in{grid-template-columns:1fr}
  .ev-ridge blockquote{grid-column:1}
}

/* ── 4 · the five ── */
.ev-five{background:var(--sand);padding:clamp(4.5rem,10vw,9rem) 0 clamp(4rem,8vw,7rem)}
.ev-five .head{padding:0 var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,26rem);gap:2rem;align-items:end}
.ev-five h2{font-size:clamp(3rem,7.4vw,7.8rem)}
.ev-five h2 .sw{color:var(--rust)}
.ev-five .head p{color:var(--ink);opacity:.82}
.ev-five .head .by{margin-top:.8rem;font-family:'EvI',Georgia,serif;font-style:italic;font-size:1.15rem;opacity:1}
.ev-row{position:relative;margin-top:clamp(2.4rem,5vw,4rem);overflow:clip}
.ev-row .strip{display:flex;gap:0;transform:translateX(calc(50vw - (var(--i,0) + .5) * var(--cw)));transition:transform .55s var(--ease);--cw:min(62vw,760px)}
.ev-row .cot{flex:none;width:var(--cw);padding:0 1.2rem;display:grid;justify-items:center;cursor:pointer;border:0;background:none;color:var(--ink);font:inherit;opacity:.32;transition:opacity .6s var(--ease)}
.ev-row .cot.on{opacity:1;cursor:default}
.ev-row .cot svg{width:100%;height:auto;overflow:visible}
.ev-row .letter{font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(3rem,6vw,5.4rem);line-height:1;margin-top:-.2rem}
.ev-row .ctl{position:absolute;top:38%;left:0;right:0;display:flex;justify-content:space-between;padding:0 var(--gut);pointer-events:none}
.ev-row .ctl button{pointer-events:auto;width:48px;height:48px;border-radius:50%;border:1px solid var(--line);background:rgba(234,226,208,.85);color:var(--ink);font-size:18px;cursor:pointer}
.ev-row .ctl button:disabled{opacity:.3;cursor:default}
.ev-five .dots{display:flex;justify-content:center;gap:.5rem;margin-top:1.4rem}
.ev-five .dots button{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:transparent;font-family:'EvC',Georgia,serif;font-size:20px;color:var(--ink);cursor:pointer;transition:background-color .3s,color .3s}
.ev-five .dots button[aria-pressed="true"]{background:var(--moss);color:var(--paper);border-color:var(--moss)}
.ev-five .card{margin:clamp(2rem,4vw,3rem) auto 0;width:min(100% - 2*var(--gut),62rem);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:clamp(1.4rem,4vw,3.4rem);border-top:1px solid var(--line);padding-top:1.6rem}
.ev-five .card .facts{display:grid;align-content:start;gap:.2rem}
.ev-five .card .facts .rt{font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(3rem,5vw,4.4rem);line-height:.9}
.ev-five .card .facts .mono{color:var(--mute)}
.ev-five .card .facts .badge{margin-top:.7rem;justify-self:start;border:1px solid var(--rust);color:var(--rust);border-radius:999px;padding:.25rem .7rem}
.ev-five .card .facts .moment{margin-top:1rem;font-size:15.5px}
.ev-five .card .own{list-style:none;margin:1rem 0 0;padding:0;border-top:1px solid var(--line)}
.ev-five .card .own li{display:flex;gap:.8rem;align-items:baseline;padding:.45rem 0;border-bottom:1px solid var(--line);font-size:14px}
.ev-five .card .own b{font-family:'EvC',Georgia,serif;font-weight:300;font-size:1.5rem;line-height:1}
.ev-five .card .own span{color:var(--ink);opacity:.82}
.ev-five .card blockquote{margin:0;font-family:'EvI',Georgia,serif;font-style:italic;font-size:clamp(1.35rem,2.2vw,1.9rem);line-height:1.25}
.ev-five .card cite{display:block;margin-top:.8rem;font-style:normal;color:var(--mute)}
.ev-five .card .act{margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:.8rem 1.4rem;align-items:center}
.ev-five .same{padding:0 var(--gut);margin-top:clamp(2.4rem,5vw,3.6rem);text-align:center;color:var(--mute)}
@media (max-width:760px){
  .ev-five .head{grid-template-columns:1fr}
  .ev-row .strip{--cw:78vw}
  .ev-row .ctl{display:none}
  .ev-five .card{grid-template-columns:1fr}
}

/* ── 5 · inside 32 m² (board 1: tall / text / taller) ── */
.ev-in{background:var(--paper);padding:clamp(4.5rem,10vw,9rem) var(--gut)}
.ev-in .grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1fr) minmax(0,1.05fr);gap:clamp(1rem,2.6vw,2.4rem);align-items:start}
.ev-in .ph{border-radius:var(--r);overflow:clip}
.ev-in .ph.a{aspect-ratio:3/4;margin-top:clamp(3rem,8vw,7rem)}
.ev-in .ph.c{aspect-ratio:3/4.3}
.ev-in h2{font-size:clamp(2.8rem,5.6vw,5.8rem)}
.ev-in h2 .sw{color:var(--rust)}
.ev-in .txt p{margin-top:1rem;max-width:36ch}
.ev-in .plan{margin-top:1.6rem;color:var(--ink)}
.ev-in .plan svg{width:100%;height:auto}
.ev-in ul{list-style:none;padding:0;margin:1.4rem 0 0;border-top:1px solid var(--line)}
.ev-in li{display:grid;grid-template-columns:6.5rem 1fr;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--line);font-size:14.5px}
.ev-in li b{font-weight:500}
.ev-in .strip{margin-top:clamp(2.4rem,5vw,4rem);display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(.6rem,1.4vw,1.2rem)}
.ev-in .strip figure{margin:0;aspect-ratio:4/3;border-radius:calc(var(--r) - 6px);overflow:clip}
@media (max-width:900px){
  .ev-in .grid{grid-template-columns:1fr 1fr}
  .ev-in .txt{grid-column:1/-1;order:-1}
  .ev-in .ph.a{margin-top:0}
  .ev-in .strip{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:72%;overflow-x:auto;scroll-snap-type:x mandatory;margin-right:calc(var(--gut)*-1);padding-right:var(--gut);scrollbar-width:none}
  .ev-in .strip figure{scroll-snap-align:start}
}

/* ── 6 · the tub (board 3 split: sand panel, staggered rust caps) ── */
.ev-tub{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:92svh;background:var(--sand)}
.ev-tub .panel{padding:clamp(3rem,7vw,6rem) var(--gut);display:flex;flex-direction:column;justify-content:center;gap:1.4rem;color:var(--rust)}
.ev-tub h2{font-size:clamp(3.4rem,8vw,8.4rem);display:grid}
.ev-tub h2 span:nth-child(2){padding-left:1.4em}
.ev-tub h2 span:nth-child(3){padding-left:.5em}
.ev-tub .their{color:var(--ink);max-width:34ch;font-size:clamp(16px,1.3vw,18px)}
.ev-tub .their small{display:block;margin-top:.6rem;color:var(--mute)}
.ev-tub .pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem;color:var(--ink);margin-top:1rem;max-width:40rem}
.ev-tub .pair blockquote{margin:0;font-family:'EvI',Georgia,serif;font-style:italic;font-size:1.15rem;line-height:1.3}
.ev-tub .pair cite{display:block;margin-top:.4rem;font-style:normal;color:var(--mute)}
.ev-tub .photo{position:relative;overflow:clip}
.ev-tub .photo .inset{position:absolute;left:clamp(1rem,3vw,2.4rem);bottom:clamp(1rem,3vw,2.4rem);width:38%;aspect-ratio:4/3;border-radius:calc(var(--r) - 4px);overflow:clip;box-shadow:0 18px 40px -18px rgba(0,0,0,.5)}
@media (max-width:900px){.ev-tub{grid-template-columns:1fr}.ev-tub .photo{height:70svh;order:-1}.ev-tub .pair{grid-template-columns:1fr}}

/* ── 7 · near, in minutes ── */
.ev-near{position:relative;color:var(--paper);background:var(--night);overflow:clip}
.ev-near .bg{position:absolute;inset:0}
.ev-near .bg::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,26,20,.9) 0%,rgba(10,26,20,.78) 50%,rgba(10,26,20,.7) 100%)}
.ev-near .in{position:relative;padding:clamp(4.5rem,10vw,9rem) var(--gut);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(2rem,6vw,6rem)}
.ev-near h2{font-size:clamp(3rem,6.8vw,7rem)}
.ev-near h2 .sw{color:var(--sand)}
.ev-near .lede{margin-top:1.3rem;max-width:34ch;opacity:.86}
.ev-near .lede small{display:block;margin-top:.8rem;opacity:.7}
.ev-near ol{list-style:none;margin:0;padding:0;border-top:1px solid rgba(234,226,208,.22)}
.ev-near li{display:grid;grid-template-columns:5.2rem 1fr auto;align-items:baseline;gap:1rem;padding:.85rem 0;border-bottom:1px solid rgba(234,226,208,.22)}
.ev-near li b{font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(2.4rem,3.6vw,3.4rem);line-height:.9}
.ev-near li b small{font-family:'EvM',monospace;font-size:10px;letter-spacing:.12em;margin-left:.3rem;opacity:.7}
.ev-near li span{font-size:17px}
.ev-near li em{font-style:normal;font-size:13.5px;opacity:.7;text-align:right}
@media (max-width:900px){.ev-near .in{grid-template-columns:1fr}.ev-near .bg::after{background:linear-gradient(180deg,rgba(10,26,20,.55),rgba(10,26,20,.92) 45%)}.ev-near li{grid-template-columns:4.4rem 1fr}.ev-near li em{grid-column:2;text-align:left;margin-top:-.4rem}}

/* ── 8 · hosts next door, winter ── */
.ev-host{background:var(--paper);padding:clamp(4.5rem,10vw,9rem) var(--gut)}
.ev-host .grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(2rem,6vw,6rem);align-items:start}
.ev-host h2{font-size:clamp(3rem,6.6vw,7rem)}
.ev-host h2 .sw{color:var(--rust)}
.ev-host .said{margin-top:1.6rem;font-family:'EvI',Georgia,serif;font-style:italic;font-size:clamp(1.4rem,2.4vw,2.1rem);line-height:1.22;max-width:24ch}
.ev-host .said small{display:block;margin-top:.5rem;font-family:'EvM',monospace;font-style:normal;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.ev-host .stats{margin-top:2.2rem;display:grid;grid-template-columns:repeat(3,auto);justify-content:start;gap:1rem 2.4rem}
.ev-host .stats b{display:block;font-family:'EvC',Georgia,serif;font-weight:300;font-size:clamp(2.6rem,4.4vw,4rem);line-height:.9}
.ev-host .stats span{font-size:13.5px;color:var(--mute)}
.ev-host .bio{margin-top:1.8rem;max-width:40ch}
.ev-host .pics{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.6rem,1.4vw,1rem)}
.ev-host .pics figure{margin:0;border-radius:var(--r);overflow:clip}
.ev-host .pics .big{grid-column:1/-1;aspect-ratio:4/3}
.ev-host .pics .sm{aspect-ratio:1}
.ev-host .guest{margin-top:1.4rem;padding-top:1.2rem;border-top:1px solid var(--line)}
.ev-host .guest blockquote{margin:0;font-size:16px}
.ev-host .guest cite{display:block;margin-top:.4rem;font-style:normal;color:var(--mute);font-size:13.5px}
@media (max-width:900px){.ev-host .grid{grid-template-columns:1fr}.ev-host .stats{grid-template-columns:repeat(3,1fr);gap:1rem}}

/* ── 9 · voices ── */
.ev-voices{background:var(--sand);padding:clamp(4rem,9vw,8rem) 0}
.ev-voices .head{padding:0 var(--gut);display:flex;justify-content:space-between;align-items:end;gap:1.6rem;flex-wrap:wrap}
.ev-voices h2{font-size:clamp(2.8rem,6vw,6rem)}
.ev-voices h2 .sw{color:var(--rust)}
.ev-voices .rail{margin-top:2.4rem;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(19rem,26rem);gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 var(--gut) .6rem;scroll-padding:0 var(--gut);scrollbar-width:none;overscroll-behavior-x:contain}
.ev-voices .rail::-webkit-scrollbar{display:none}
.ev-voices figure{margin:0;scroll-snap-align:start;background:var(--paper);border-radius:var(--r);padding:1.6rem 1.5rem;display:flex;flex-direction:column;justify-content:space-between;gap:1.6rem;min-height:15rem}
.ev-voices figure blockquote{margin:0;font-family:'EvI',Georgia,serif;font-style:italic;font-size:1.35rem;line-height:1.28;white-space:pre-line}
.ev-voices figcaption{color:var(--mute)}
@media (max-width:620px){.ev-voices .rail{grid-auto-columns:84%}}

/* ── 10 · book (the booking engine lives at the bottom, always) ── */
.ev-book{background:var(--moss);color:var(--paper);padding:clamp(4.5rem,10vw,9rem) var(--gut)}
.ev-book .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,24rem);gap:2rem;align-items:end;margin-bottom:clamp(2rem,4vw,3rem)}
.ev-book h2{font-size:clamp(3.2rem,7.6vw,8rem)}
.ev-book h2 .sw{color:var(--sand)}
.ev-book .top p{opacity:.86}
.ev-book .top .ev-link{display:inline-block;margin-top:.6rem}
.ev-book .know{margin-top:clamp(2rem,4vw,3rem);display:grid;grid-template-columns:repeat(3,1fr);gap:0 2rem;border-top:1px solid rgba(234,226,208,.22)}
.ev-book .know div{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 0;border-bottom:1px solid rgba(234,226,208,.22);font-size:14.5px}
.ev-book .know b{font-weight:500}
.ev-book .know span{opacity:.8;text-align:right}
@media (max-width:900px){.ev-book .top{grid-template-columns:1fr}.ev-book .know{grid-template-columns:1fr}}

/* ── footer (mobile-footer-structure) ── */
.ev-foot{background:${MOSS_DEEP};color:var(--paper);padding:clamp(3rem,7vw,5rem) var(--gut) calc(2rem + env(safe-area-inset-bottom))}
.ev-foot .word{font-family:'EvS',sans-serif;font-weight:500;font-size:clamp(4rem,17vw,17rem);line-height:.8;letter-spacing:-.05em;display:flex;align-items:flex-start;gap:.06em}
.ev-foot .word .star{width:.26em;height:.26em;color:var(--sand)}
.ev-foot .grid{margin-top:clamp(2rem,5vw,3.4rem);display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:2rem;border-top:1px solid rgba(234,226,208,.16);padding-top:1.6rem}
.ev-foot h4{margin:0 0 .6rem;font-family:'EvM',monospace;font-weight:400;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6}
.ev-foot ul{list-style:none;margin:0;padding:0;display:grid;gap:0}
.ev-foot li a{display:inline-block;padding:.4rem 0;text-decoration:none;overflow-wrap:anywhere;opacity:.88}
@media (hover:hover){.ev-foot li a:hover{opacity:1;text-decoration:underline;text-underline-offset:3px}}
.ev-foot .spec li{display:flex;justify-content:space-between;gap:1rem;padding:.4rem 0;border-bottom:1px solid rgba(234,226,208,.12);font-size:14.5px}
.ev-foot .spec li span{opacity:.65}
.ev-foot .tag{opacity:.78;max-width:30ch;font-size:14.5px}
.ev-foot .legal{margin-top:2.4rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-size:13px;opacity:.72}
.ev-foot .proto{margin-top:1rem;font-size:12.5px;opacity:.55;max-width:70ch}
.ev-foot .sndr{display:inline-flex;align-items:baseline;gap:.4rem;text-decoration:none;color:var(--paper)}
.ev-foot .sndr__mark{font-weight:600;letter-spacing:.08em}
.ev-foot .sndr__mark i{font-style:normal;color:var(--sand);margin:0 .08em}
.ev-foot .sndr__studio{font-family:'EvM',monospace;font-size:10px;letter-spacing:.2em;opacity:.7}
.ev-foot .credit{font-size:13px;opacity:.8}
@media (max-width:900px){.ev-foot .grid{grid-template-columns:1fr 1fr}.ev-foot .grid>.brand,.ev-foot .grid>.spec{grid-column:1/-1}}
@media (max-width:560px){.ev-foot .word{font-size:23vw}.ev-foot .legal{flex-direction:column;align-items:flex-start}}

@media (prefers-reduced-motion:reduce){
  .ev *,.ev *::before,.ev *::after{animation:none!important;transition:none!important}
  .ev .ev-day .ch{transform:none!important;transition:opacity .2s linear!important}
  .ev .ev-row .cot{transition:opacity .2s linear!important}
}
`

/* ───────────────────────── small parts ───────────────────────── */

function Img({ p, sizes, eager, className }: { p: Photo; sizes: string; eager?: boolean; className?: string }) {
  return (
    <img className={className} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.w} height={p.h}
      loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchpriority: 'high' } : {})} />
  )
}

const Star = () => (
  <svg className="star" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 0v20M0 10h20M2.9 2.9l14.2 14.2M17.1 2.9 2.9 17.1" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
)

/** A title whose one italic word is the swash, in the SAND board's way. */
function Swash({ lines, swash, as = 'h2', id, className }: { lines: readonly string[]; swash: string; as?: 'h1' | 'h2'; id?: string; className?: string }) {
  const T = as
  return (
    <T className={`cap ${className ?? ''}`} id={id}>
      {lines.map((l, i) => <span key={i} className="ln"><span className={l === swash ? 'sw' : undefined}>{l}</span></span>)}
    </T>
  )
}

/**
 * EACH COTTAGE, DRAWN AS IT IS. The form comes from the owners' winter photos
 * (A15, A16, B14, C20): gable end to the plain, white barge boards, horizontal
 * corrugated cladding, two big windows either side of the door under the roof's
 * overhang, a deck across the front, the tub in a boarded screen at the side.
 * Width is to scale: 32 m² for A, B and C, 39 m² for the newer D and E
 * (Booking.com's house list). The one thing drawn in on top of each is what its
 * own guests wrote about THAT deck, never a decoration.
 */
function CottageDrawing({ c }: { c: (typeof COTTAGES)[number] }) {
  const cx = 280, W = c.m2 === 39 ? 262 : 214, x0 = cx - W / 2, x1 = cx + W / 2
  const eave = 128, apex = eave - W * 0.2, ground = 236, deckY = 214
  const ribs: number[] = []
  for (let y = eave + 8; y < deckY; y += 7) ribs.push(y)
  const bay = W / (c.m2 === 39 ? 4 : 3)
  const tubX = x0 - 84
  return (
    <svg viewBox="0 0 560 280" role="img" aria-label={`Cottage ${c.id}, ${c.m2} square metres, drawn from the front: gable to the plain, deck across the front, hot tub in its screen at the side`}>
      <defs><clipPath id={`wall-${c.id}`}><rect x={x0} y={eave} width={W} height={deckY - eave} /></clipPath></defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
        {/* the moment, behind the house */}
        {c.id === 'A' && <g opacity=".75"><path d={`M${x0 - 40} 52 C ${x0 + 30} 18, ${cx - 10} 70, ${cx + 60} 34 S ${x1 + 60} 26, ${x1 + 90} 48`} /><path d={`M${x0 - 20} 66 C ${x0 + 50} 36, ${cx + 10} 82, ${cx + 80} 50`} strokeWidth=".7" /><circle cx={x1 + 70} cy="22" r="1.2" fill="currentColor" /><circle cx={x0 - 30} cy="28" r="1" fill="currentColor" /></g>}
        {c.id === 'C' && <g opacity=".6" strokeWidth=".9"><path d={`M${x1 + 50} ${ground - 30} L${x1 + 92} ${ground - 58} L${x1 + 110} ${ground - 50} L${x1 + 140} ${ground - 66} L${x1 + 176} ${ground - 34}`} /><path d={`M0 ${ground - 26} L34 ${ground - 40} L60 ${ground - 32}`} strokeWidth=".7" /></g>}
        {/* the deck across the front, wider than the house */}
        <path d={`M${x0 - 34} ${deckY} H${x1 + 34}`} />
        <path d={`M${x0 - 34} ${deckY - 22} H${x1 + 34}`} strokeWidth="1" />
        {Array.from({ length: Math.round((W + 68) / 17) + 1 }, (_, i) => x0 - 34 + i * ((W + 68) / Math.round((W + 68) / 17))).map((x) => <line key={x} x1={x} y1={deckY - 22} x2={x} y2={deckY} strokeWidth=".6" />)}
        <path d={`M${x0 - 34} ${deckY} V${ground} M${x1 + 34} ${deckY} V${ground}`} strokeWidth=".9" />
        {/* the house */}
        <path d={`M${x0 - 16} ${eave + 6} L${cx} ${apex} L${x1 + 16} ${eave + 6}`} strokeWidth="1.6" />
        <path d={`M${x0} ${eave} V${deckY} M${x1} ${eave} V${deckY} M${x0} ${eave} L${cx} ${apex + 10} L${x1} ${eave}`} />
        <g clipPath={`url(#wall-${c.id})`} strokeWidth=".45" opacity=".55">{ribs.map((y) => <line key={y} x1={x0} y1={y} x2={x1} y2={y} />)}</g>
        {/* front: windows either side of the door; the larger two get a fourth bay */}
        {Array.from({ length: c.m2 === 39 ? 4 : 3 }, (_, i) => {
          const bx = x0 + i * bay, mid = c.m2 === 39 ? i === 1 : i === 1
          return mid
            ? <rect key={i} x={bx + bay / 2 - 13} y={eave + 14} width="26" height={deckY - eave - 14} fill="var(--paper)" />
            : <g key={i}><rect x={bx + 12} y={eave + 14} width={bay - 24} height="40" fill="var(--paper)" /><line x1={bx + bay / 2} y1={eave + 14} x2={bx + bay / 2} y2={eave + 54} /></g>
        })}
        {/* porch posts under the roof's overhang, as on the deck photos */}
        <path d={`M${x0 - 12} ${eave + 5} V${deckY} M${x1 + 12} ${eave + 5} V${deckY}`} strokeWidth="1.1" />
        {/* the tub in its boarded screen; B's is the tall, sheltered one its guest wrote about */}
        {(() => { const h = c.id === 'B' ? 70 : 48; return (
          <g>
            <rect x={tubX} y={deckY - h} width="58" height={h} fill="var(--sand)" />
            {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={tubX + i * 9.7} y1={deckY - h} x2={tubX + i * 9.7} y2={deckY} strokeWidth=".6" />)}
            <path d={`M${tubX + 16} ${deckY - h - 6} q-6 -10 2 -18 M${tubX + 30} ${deckY - h - 4} q-6 -12 3 -20 M${tubX + 44} ${deckY - h - 6} q-5 -9 2 -16`} strokeWidth=".8" opacity=".6" />
          </g>) })()}
        {/* D: the arctic fox and a ptarmigan on the deck */}
        {c.id === 'D' && <g strokeWidth="1.1">
          {/* fox, sitting on the deck, tail curled round */}
          <path d={`M${x1 + 40} ${deckY} q-2 -22 8 -30 l-2 -12 l8 7 l8 -7 l-1 13 q9 10 4 32 z`} fill="var(--paper)" />
          <path d={`M${x1 + 56} ${deckY} q20 2 18 -14 q-2 10 -14 8`} fill="var(--paper)" />
          <circle cx={x1 + 51} cy={deckY - 28} r=".9" fill="currentColor" />
          {/* ptarmigan on the railing */}
          <path d={`M${x0 - 6} ${deckY - 22} q2 -12 13 -12 q5 -7 10 -1 l-4 3 q5 8 -3 10 z`} fill="var(--paper)" />
        </g>}
        {/* E: Hestvatn below the cottages */}
        {c.id === 'E' && <g opacity=".7" strokeWidth=".9"><path d={`M${cx - 190} 256 h120 M${cx - 40} 256 h210 M${cx - 150} 264 h90 M${cx + 10} 264 h130 M${cx - 90} 272 h170`} /></g>}
        <line x1="0" y1={ground} x2="560" y2={ground} strokeWidth="1.4" />
      </g>
    </svg>
  )
}

/** Plan from the owners' own drawing: living and kitchen 17.1 m², bedroom 7.3, bath 2.7, deck on two sides. */
function Plan() {
  return (
    <svg viewBox="0 0 360 250" role="img" aria-label="Floor plan: living room and kitchen 17.1 square metres, bedroom 7.3, bathroom 2.7, the deck on two sides with the hot tub">
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="120" y="10" width="160" height="170" />
        <line x1="200" y1="10" x2="200" y2="80" />
        <line x1="200" y1="80" x2="280" y2="80" />
        <line x1="120" y1="58" x2="170" y2="58" />
        <line x1="170" y1="10" x2="170" y2="58" />
        <path d="M20 10 H120 M20 10 V250 H280 V180" strokeDasharray="3 4" opacity=".7" />
        <circle cx="52" cy="46" r="20" />
      </g>
      <g fontFamily="EvM, monospace" fontSize="9" letterSpacing=".8" fill="currentColor">
        <text x="210" y="46">BEDROOM 7.3</text>
        <text x="126" y="38">BATH 2.7</text>
        <text x="146" y="128">LIVING + KITCHEN 17.1</text>
        <text x="34" y="84">HOT TUB</text>
        <text x="70" y="226">DECK, ON TWO SIDES</text>
      </g>
    </svg>
  )
}

/** The hero is their aurora over a lit cottage, moving: their own frame, given
 *  gentle motion (Kling, from the still). Autoplay is an ATTRIBUTE and a call,
 *  never only one (autoplay-flag-hides-the-bug); reduced motion keeps the poster. */
function HeroFilm() {
  const v = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = v.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.pause(); return }
    el.play().catch(() => {})
  }, [])
  return (
    <video ref={v} autoPlay muted loop playsInline preload="auto" poster={FILM.aurora.poster} aria-label={IMG.aurora.alt}>
      <source src={FILM.aurora.src} type="video/mp4" />
    </video>
  )
}

/* ───────────────────────── chrome ───────────────────────── */

const NAV: [string, string][] = [['#ridge', 'The ridge'], ['#five', 'The five'], ['#inside', 'Inside'], ['#near', 'Nearby'], ['#book', 'Book']]

/**
 * THE HEADER IS THE RIDGE. A single horizon line with the five cottages on it,
 * one per section, is the navigation. The cottage for the section you are in
 * switches its windows on; a sun crosses the sky above the row with your
 * progress down the page, and becomes the moon for the last stretch: the same
 * day the ridge journey tells. Everything is drawn in paper and blended by
 * difference, so the whole bar inverts against whatever passes beneath it.
 * Constant chrome (mobile-chrome-standard): it never hides or moves; only the
 * lights and the sun inside it change, driven by position, not by time.
 */
const HOUSE_X = [30, 90, 150, 210, 270]
function RidgeNav({ active, onGo }: { active: number; onGo: (i: number) => void }) {
  const [hover, setHover] = useState(-1)
  const sun = useRef<SVGGElement>(null)
  useEffect(() => {
    let raf = 0
    const paint = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = Math.min(1, Math.max(0, max > 0 ? scrollY / max : 0))
      const x = 8 + p * 284, y = 31 - Math.sin(p * Math.PI) * 25
      const g = sun.current
      if (g) { g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); g.dataset.night = p > 0.8 ? '1' : '0' }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(paint) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    paint()
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [])
  const shown = hover >= 0 ? hover : active
  return (
    <nav className="ev-ridgenav" aria-label="Sections, drawn as the five cottages" onPointerLeave={() => setHover(-1)}>
      <svg viewBox="0 0 300 44" aria-hidden="false">
        <line className="hz" x1="0" y1="34" x2="300" y2="34" />
        <g ref={sun} className="sun" transform="translate(8 31)">
          <circle className="disc" r="3.4" />
          <path className="moon" d="M1.2 -3.3 A3.4 3.4 0 1 0 1.2 3.3 A2.6 2.6 0 1 1 1.2 -3.3 Z" />
        </g>
        {NAV.map(([h, l], i) => {
          const x = HOUSE_X[i]
          return (
            <a key={h} href={h} aria-label={l} aria-current={i === active ? 'location' : undefined}
              className={`hs${i === active ? ' on' : ''}${i === hover ? ' hv' : ''}`}
              onClick={(e) => { e.preventDefault(); onGo(i) }} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)}>
              <rect className="hit" x={x - 30} y="0" width="60" height="44" />
              <g className="h" transform={`translate(${x} 0)`}>
                <path d="M-17 22 L-9 13 L13 13 L17 22" />
                <path d="M-14 22 V34 H12 V22" />
                <rect className="w" x="-10.5" y="25" width="7" height="5" />
                <rect className="w" x="3" y="25" width="5" height="5" />
                <path d="M12 28 H19 V34" className="dk" />
              </g>
            </a>
          )
        })}
      </svg>
      <span className="lbl mono" aria-live="polite">{shown >= 0 ? NAV[shown][1] : 'Eyvík, Grímsnes'}</span>
    </nav>
  )
}

/** The colour under a point: the first opaque background walking up, dark for photos and films. */
function toneAt(x: number, y: number) {
  let el = document.elementFromPoint(x, y) as HTMLElement | null
  while (el && !el.classList.contains('ev')) {
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO') return '#1D1A14'
    if (el.classList.contains('track') && el.closest('.ev-ridge')) {
      const r = el.getBoundingClientRect(), t = r.width > r.height ? (x - r.left) / r.width : (y - r.top) / r.height
      return t < 0.34 ? '#D8C8A6' : t < 0.55 ? '#B8925A' : t < 0.72 ? '#6A6150' : '#141F1A'
    }
    const bg = getComputedStyle(el).backgroundColor
    if (bg && bg !== 'transparent' && !bg.endsWith(', 0)')) return bg
    el = el.parentElement
  }
  return '#EAE2D0'
}

function Bar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  useEffect(() => {
    let raf = 0, lastTone = ''
    const ids = NAV.map(([h]) => h.slice(1))
    const paint = () => {
      raf = 0
      let a = -1
      ids.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) a = i })
      setActive(a)
      /* the strip above the bar: Safari tints the status and tab strips from body and
         theme-color, so they follow the section passing under the bar. Discrete, never
         animated, and only written when it changes. */
      const tone = toneAt(innerWidth / 2, 70)
      if (tone !== lastTone) { lastTone = tone; document.body.style.backgroundColor = tone; setThemeColor(tone) }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(paint) }
    addEventListener('scroll', on, { passive: true })
    paint()
    return () => { removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); document.body.style.backgroundColor = '' }
  }, [])
  useEffect(() => {
    if (!open) return
    const y = window.scrollY, b = document.body.style
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', esc)
    return () => { b.position = ''; b.top = ''; b.width = ''; window.scrollTo(0, y); window.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <>
      <header className="ev-bar">
        <a className="mark" href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); if (pageLenis) pageLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Eyvík Cottages, top of page" translate="no">EYVÍK <small>COTTAGES</small></a>
        <RidgeNav active={active} onGo={(i) => { setOpen(false); go(NAV[i][0].slice(1)) }} />
        <div className="end">
          <a className="ev-pill light" href="#book" onClick={(e) => { e.preventDefault(); go('book') }}>Check dates</a>
          <button className="ev-burger" aria-expanded={open} aria-controls="ev-menu" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </header>
      <div id="ev-menu" className={`ev-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        {NAV.map(([h, l], i) => <a key={h} href={h} style={{ '--i': i } as CSSProperties} tabIndex={open ? 0 : -1} onClick={(e) => { e.preventDefault(); setOpen(false); window.setTimeout(() => go(h.slice(1)), 60) }}>{l}</a>)}
        <div className="foot">
          <a href={`tel:${CONTACT.tel}`} tabIndex={open ? 0 : -1}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} tabIndex={open ? 0 : -1}>{CONTACT.email}</a>
        </div>
      </div>
    </>
  )
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || !el) return
    let x = 0, y = 0, cx = 0, cy = 0, id = 0, on = false
    const tick = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; el.style.transform = `translate3d(${cx}px,${cy}px,0)`; id = requestAnimationFrame(tick) }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (!on) { on = true; cx = x; cy = y; el.classList.add('on') }
      el.classList.toggle('big', !!(e.target as Element).closest?.('a,button'))
    }
    const leave = () => { on = false; el.classList.remove('on') }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    id = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave) }
  }, [])
  return <div className="ev-cursor" ref={ref} aria-hidden="true"><i /></div>
}

/* ───────────────────────── 3 · along the ridge ───────────────────────── */

/* The Lenis instance drives the scroll on fine pointers, so native scrollTo /
   scrollIntoView would be reverted next frame (Búðir gotcha 1). Every
   programmatic jump goes through go(). Null on touch and reduced motion. */
let pageLenis: Lenis | null = null
const isTouch = () => matchMedia('(hover: none) and (pointer: coarse)').matches
function go(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (pageLenis) pageLenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

const RIDGE_H = ['64vh', '70vh', '46vh', '58vh', '52vh', '66vh']
const RIDGE_A = ['end', 'start', 'end', 'center', 'start', 'center']

function Ridge() {
  return (
    <section className="ev-ridge" id="ridge" aria-labelledby="ev-ridge-h">
      <div className="track">
        <div className="intro">
          <p className="mono ev-up">One day at Eyvík</p>
          <Swash id="ev-ridge-h" lines={['Along', 'the', 'ridge']} swash="ridge" />
          <p className="ev-lines">First light to the aurora, in their own photos.</p>
          <p className="mono hint ev-up" aria-hidden="true"><i />Keep scrolling</p>
        </div>
        {RIDGE.map((p, k) => (
          <article key={p.key} className={`pn${k >= 3 ? ' dark' : ''}`}
            style={{ '--w': `${p.w}vw`, '--h': RIDGE_H[k], '--a': RIDGE_A[k], '--ar': p.r } as CSSProperties}>
            <figure className="fr ev-peel">
              {'film' in p && p.film
                ? <video muted playsInline loop preload="metadata" poster={p.film.poster} aria-label={p.img.alt}><source src={p.film.src} type="video/mp4" /></video>
                : <Img p={p.img} sizes="(max-width:1023px) 100vw, 60vw" />}
            </figure>
            <div className="cap-in">
              <span className="mono">{p.time}</span>
              <h3>{p.title}</h3>
              <blockquote>“{p.quote}”<cite>{p.who}</cite></blockquote>
            </div>
          </article>
        ))}
        <div className="end">
          <h3 className="cap">Five decks, <span className="sw">one view.</span></h3>
          <a className="ev-link" href="#five" onClick={(e) => { e.preventDefault(); go('five') }}>Meet the five cottages ↓</a>
        </div>
      </div>
      <div className="rp" aria-hidden="true"><i /></div>
    </section>
  )
}

/* ───────────────────────── motion ───────────────────────── */

/**
 * The Búðir motion kit (memory budir-design-system), with one change the
 * Kleif Rossar pass forced: every reveal is SCRUBBED over a short band tied
 * to position (scroll-reveals-must-be-position-tied), never a timed tween a
 * fast flick can outrun. Resting CSS is fully visible: reduced motion and
 * no-JS get a finished page, and nothing is created at all.
 *  - Lenis lerp .1 on FINE pointers only (lenis-mobile-damage), wired to
 *    ScrollTrigger through the gsap ticker, lagSmoothing(0).
 *  - Ridge: desktop pins and scrubs ONE track tween sideways; inner parallax
 *    and captions ride containerAnimation; the films play only on screen.
 *  - Headlines: masked lines rise, staggered. Paragraphs: SplitText lines in
 *    alternating directions (the Búðir signature). Photos: curtain wipe +
 *    scale settle. Big images: parallax. Rules: draw.
 */
function useMotion(root: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const mm = gsap.matchMedia()
    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      wide: '(min-width: 1024px) and (pointer: fine)',
      fine: '(hover: hover) and (pointer: fine)',
    }, (ctx) => {
      const c = ctx.conditions as { motion: boolean; wide: boolean; fine: boolean }
      const q = gsap.utils.selector(el)
      const vids = q('.ev-ridge video') as HTMLVideoElement[]
      if (!c.motion) return undefined
      const splits: SplitText[] = []
      let tick: ((t: number) => void) | null = null
      /* never a JS scroll surface on a phone: Safari only collapses its toolbar for a native scroll */
      const lenis = c.fine && !isTouch() ? new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true }) : null
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update)
        tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        pageLenis = lenis
      }

      /* 1 — the ridge, created FIRST so every later trigger measures with its pin spacing */
      const ridge = q('.ev-ridge')[0] as HTMLElement
      const track = ridge.querySelector('.track') as HTMLElement
      let journey: gsap.core.Tween | null = null
      if (c.wide) {
        const dist = () => track.scrollWidth - window.innerWidth
        journey = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: ridge, pin: true, start: 'top top', end: () => `+=${dist()}`, scrub: 1,
            anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (s) => ridge.style.setProperty('--rp', s.progress.toFixed(4)),
          },
        })
        ridge.querySelectorAll('.fr').forEach((fr) => {
          const m = fr.querySelector('img,video')
          if (m) gsap.fromTo(m, { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: fr, containerAnimation: journey!, start: 'left right', end: 'right left', scrub: true } })
        })
        ridge.querySelectorAll('.cap-in').forEach((cp) => {
          gsap.fromTo(cp.children, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: cp, containerAnimation: journey!, start: 'left 96%', end: 'left 72%', scrub: 0.4 } })
        })
        vids.forEach((v) => ScrollTrigger.create({
          trigger: v.parentElement, containerAnimation: journey!, start: 'left right', end: 'right left',
          onToggle: (s) => { if (s.isActive) v.play().catch(() => {}); else v.pause() },
        }))
      } else {
        vids.forEach((v) => ScrollTrigger.create({
          trigger: v.parentElement, start: 'top bottom', end: 'bottom top',
          onToggle: (s) => { if (s.isActive) v.play().catch(() => {}); else v.pause() },
        }))
      }

      /* 2 — headlines: each masked line rises, staggered, over a short band */
      q('h2.cap').forEach((h) => {
        gsap.fromTo(h.querySelectorAll('.ln>span'), { yPercent: 118 }, {
          yPercent: 0, ease: 'none', stagger: 0.14,
          scrollTrigger: { trigger: h, start: 'top 94%', end: 'top 60%', scrub: 0.4 },
        })
      })
      /* 3 — paragraphs: alternating line cascade */
      q('.ev-lines').forEach((p) => {
        splits.push(SplitText.create(p, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.lines, { yPercent: (i: number) => (i % 2 ? -110 : 110) }, {
            yPercent: 0, ease: 'none', stagger: 0.08,
            scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 66%', scrub: 0.4 },
          }),
        }))
      })
      /* 4 — furniture: labels, lists, cards */
      q('.ev-up').forEach((u) => {
        gsap.fromTo(u, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: u, start: 'top 96%', end: 'top 74%', scrub: 0.4 } })
      })
      /* 5 — photos: curtain wipe from the bottom + scale settle (never a translate of a duplicate) */
      q('.ev-peel').forEach((f) => {
        if (journey && f.closest('.ev-ridge')) return
        const m = f.querySelector('img,video')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 94%', end: 'top 42%', scrub: 0.4 } })
        tl.fromTo(f, { clipPath: 'inset(24% 6% 0% 6% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'none' }, 0)
        if (m) tl.fromTo(m, { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
      })
      /* 6 — big images drift inside their frames */
      q('.ev-par').forEach((f) => {
        const m = f.querySelector('img,video')
        if (m) gsap.fromTo(m, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      /* 7 — rules draw */
      q('.ev-rule').forEach((r) => {
        gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: r, start: 'top 96%', end: 'top 70%', scrub: 0.4 } })
      })
      /* 8 — the hero leaves: photo sinks, the panel type lifts away */
      const hero = q('.ev-hero')[0]
      if (hero && c.wide) {
        gsap.to(hero.querySelector('.photo video'), { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
        gsap.to(hero.querySelector('h1'), { yPercent: -22, opacity: .25, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      }
      /* 9 — the footer word rises out of its mask */
      const fw = q('.ev-foot .word')[0]
      if (fw) gsap.fromTo(fw, { yPercent: 40, opacity: .2 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: fw, start: 'top bottom', end: 'top 60%', scrub: 0.4 } })

      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      return () => {
        splits.forEach((sp) => sp.revert())
        vids.forEach((v) => v.pause())
        if (tick) gsap.ticker.remove(tick)
        pageLenis?.destroy(); pageLenis = null
      }
    })
    return () => mm.revert()
  }, [root])
}

/* ───────────────────────── 4 · the five ───────────────────────── */

function Five({ onBook }: { onBook: (u: Unit) => void }) {
  const [i, setI] = useState(0)
  const c = COTTAGES[i]
  const go = (n: number) => setI(Math.max(0, Math.min(COTTAGES.length - 1, n)))
  return (
    <section className="ev-five grain" id="five" aria-labelledby="ev-five-h">
      <div className="head">
        <div><Swash id="ev-five-h" lines={['Five', 'cottages,', 'one row']} swash="one row" /></div>
        <div className="ev-up">
          <p className="ev-lines">Side by side, each with its own deck and tub. What sets them apart is what happened on each deck.</p>
        </div>
      </div>

      <div className="ev-row" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}>
        <div className="strip" style={{ '--i': i } as CSSProperties}>
          {COTTAGES.map((x, k) => (
            <button key={x.id} type="button" className={`cot${k === i ? ' on' : ''}`} onClick={() => go(k)} tabIndex={k === i ? -1 : 0} aria-label={`Show cottage ${x.id}`}>
              <CottageDrawing c={x} />
              <span className="letter" aria-hidden="true">{x.id}</span>
            </button>
          ))}
        </div>
        <div className="ctl">
          <button type="button" aria-label="Previous cottage" disabled={i === 0} onClick={() => go(i - 1)}>←</button>
          <button type="button" aria-label="Next cottage" disabled={i === COTTAGES.length - 1} onClick={() => go(i + 1)}>→</button>
        </div>
      </div>
      <div className="dots" role="group" aria-label="Choose a cottage">
        {COTTAGES.map((x, k) => <button key={x.id} type="button" aria-pressed={k === i} onClick={() => go(k)}>{x.id}</button>)}
      </div>

      <div className="card" aria-live="polite">
        <div className="facts">
          <span className="mono">Cottage {c.id} on Airbnb</span>
          <span className="rt">{c.rating}</span>
          <span className="mono">{c.reviews} reviews</span>
          {c.badge && <span className="badge mono">{c.badge}</span>}
          <p className="moment">{c.moment}</p>
          <ul className="own">
            <li><b>{c.m2}<sup className="u">m²</sup></b><span>{c.m2 === 39 ? 'one of the two larger houses' : 'like A, B and C'}</span></li>
            {c.own.map((o) => <li key={o}><span>{o}</span></li>)}
          </ul>
        </div>
        <div>
          <blockquote key={c.id}>“{c.quote.text}”</blockquote>
          <cite className="mono">{c.quote.who}, cottage {c.id}, {c.quote.when}</cite>
          <div className="act">
            <button type="button" className="ev-pill dark" onClick={() => onBook(c.id)}>See cottage {c.id}’s free nights</button>
            <a className="ev-link" href={`https://www.airbnb.com/rooms/${c.airbnb}`} target="_blank" rel="noopener">Its Airbnb listing ↗</a>
          </div>
        </div>
      </div>
      <p className="same mono">Three at 32 m², two at 39 m², one view · {HOST.reviews} reviews across the five at {HOST.rating}</p>
    </section>
  )
}

/* ───────────────────────── page ───────────────────────── */

export default function EyvikPage() {
  const [unit, setUnit] = useState<Unit>('any')
  const rootRef = useRef<HTMLDivElement>(null)
  useMotion(rootRef)
  const book = (u: Unit) => { setUnit(u); go('book') }
  useEffect(() => {
    setThemeColor(MOSS_DEEP)
    const t = document.title
    document.title = 'Eyvík Cottages | Five cottages with hot tubs, Golden Circle'
    const a = setMetaDescription('Five cottages in a row on the farm at Eyvík, Grímsnes. Each has a 30 m² deck with its own hot tub and a view to Hekla. Rated 4.98 across 1,368 guest reviews.')
    const b = setNoindex(true)
    return () => { document.title = t; a(); b() }
  }, [])

  return (
    <div className="ev" lang="en" ref={rootRef}>
      <style>{CSS + STAY_CSS + '.ev .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <div className="ev-awning" id="top" aria-hidden="true" />
      <a className="skip" href="#main">Skip to content</a>
      <div className="ev-veil" aria-hidden="true" />
      <Bar />
      <Cursor />
      <PreviewChrome company={company} />

      <main id="main">
        {/* 1 — split poster */}
        <section className="ev-hero" aria-labelledby="ev-h1">
          <div className="panel grain">
            <h1 className="cap" id="ev-h1" aria-label="Five cottages, one ridge">
              {['Five', 'cottages,', 'one'].map((w, i) => (
                <span key={w} className={`rise l${i + 1}`}><span style={{ '--i': i } as CSSProperties}>{w}{i === 2 ? <> <span className="sw" style={{ display: 'inline' }}>ridge.</span></> : null}</span></span>
              ))}
            </h1>
            <div className="foot">
              <p className="lede fade" style={{ '--i': 2 } as CSSProperties}>A hot tub on every deck. Hekla on the horizon.</p>
              <a className="ev-pill light fade" style={{ '--i': 3 } as CSSProperties} href="#book" onClick={(e) => { e.preventDefault(); go('book') }}>Check dates</a>
              <p className="proof mono fade" style={{ '--i': 4 } as CSSProperties}>{HOST.rating} · {HOST.reviews} reviews · Superhost</p>
            </div>
          </div>
          <div className="photo">
            <HeroFilm />
          </div>
        </section>

        {/* 2 — their own line */}
        <section className="ev-line grain" aria-labelledby="ev-line-h">
          <h2 className="cap q ev-up" id="ev-line-h">From the deck you can see <span className="sw">Hekla,</span> the queen of Icelandic volcanoes.</h2>
          <p className="by mono ev-up">Smári and Íris, on every one of their listings</p>
          <div className="spec ev-up">
            {SPEC.map(([n, l]) => <div key={l}><b>{n.replace(' m²', '')}{n.endsWith('m²') && <sup className="u">m²</sup>}</b><span>{l}</span></div>)}
          </div>
        </section>

        {/* 3 — along the ridge */}
        <Ridge />

        {/* 4 — the five */}
        <Five onBook={book} />

        {/* 5 — inside */}
        <section className="ev-in grain" id="inside" aria-labelledby="ev-in-h">
          <div className="grid">
            <figure className="ph a ev-peel"><Img p={IMG.living} sizes="(max-width:900px) 50vw, 30vw" /></figure>
            <div className="txt">
              <Swash id="ev-in-h" lines={['Inside,', 'one', 'bedroom']} swash="bedroom" />
              <p className="ev-lines">{THEIR_WORDS.built}</p>
              <div className="plan"><Plan /><p className="mono" style={{ marginTop: '.6rem', opacity: .7 }}>The owners’ plan of the 32 m² cottages, A to C</p></div>
              <ul>{INSIDE.map(([k, v]) => <li key={k}><b>{k}</b><span>{v}</span></li>)}</ul>
            </div>
            <figure className="ph c ev-peel"><Img p={IMG.bedC} sizes="(max-width:900px) 50vw, 32vw" /></figure>
          </div>
          <div className="strip">
            {[IMG.kitchenView, IMG.diningTv, IMG.bath, IMG.deckDay].map((p) => <figure key={p.src} className="ev-peel"><Img p={p} sizes="(max-width:900px) 72vw, 24vw" /></figure>)}
          </div>
        </section>

        {/* 6 — the tub */}
        <section className="ev-tub grain" aria-labelledby="ev-tub-h">
          <div className="panel">
            <Swash id="ev-tub-h" lines={['Hot', 'water,', 'day and night']} swash="day and night" />
            <p className="their ev-up">“{THEIR_WORDS.tub}”<small className="mono">Smári and Íris</small></p>
              <p className="their ev-up" style={{ marginTop: '.4rem' }}>“{COTTAGES[2].quote.text.split('. ')[0]}.”<small className="mono">Mike, cottage C</small></p>
          </div>
          <div className="photo ev-par">
            <Img p={IMG.tub} sizes="(max-width:900px) 100vw, 50vw" />
            <figure className="inset" style={{ margin: 0 }}><Img p={IMG.deckNight} sizes="20vw" /></figure>
          </div>
        </section>

        {/* 7 — near */}
        <section className="ev-near" id="near" aria-labelledby="ev-near-h">
          <div className="bg ev-par"><Img p={IMG.drone} sizes="100vw" /></div>
          <div className="in">
            <div>
              <Swash id="ev-near-h" lines={['The Golden', 'Circle,', 'in minutes']} swash="in minutes" />
              <p className="lede">{THEIR_WORDS.lake}<small className="mono">Drive times from the owners’ own maps</small></p>
            </div>
            <ol className="ev-up">
              {NEAR.map((n) => <li key={n.place}><b>{n.min}<small>{n.unit}</small></b><span>{n.place}</span><em>{n.note}</em></li>)}
            </ol>
          </div>
        </section>

        {/* 8 — hosts next door */}
        <section className="ev-host grain" aria-labelledby="ev-host-h">
          <div className="grid">
            <div>
              <Swash id="ev-host-h" lines={['Hosts', 'next', 'door']} swash="door" />
              <p className="said">“{THEIR_WORDS.winter}”<small>Smári and Íris, winter service</small></p>
              <div className="stats">
                <div><b>{HOST.reviews}</b><span>reviews</span></div>
                <div><b>{HOST.rating}</b><span>average</span></div>
                <div><b>{HOST.years}</b><span>years hosting</span></div>
              </div>
              <div className="guest">
                <blockquote>“{VOICES[1].text}”</blockquote>
                <cite>{VOICES[1].who}, {VOICES[1].when}</cite>
              </div>
            </div>
            <div className="pics">
              <figure className="big ev-peel"><Img p={IMG.snowrow} sizes="(max-width:900px) 100vw, 45vw" /></figure>
              <figure className="sm ev-peel"><Img p={IMG.snowedIn} sizes="(max-width:900px) 50vw, 22vw" /></figure>
              <figure className="sm ev-peel"><Img p={IMG.horses} sizes="(max-width:900px) 50vw, 22vw" /></figure>
            </div>
          </div>
        </section>

        {/* 9 — voices */}
        <section className="ev-voices grain" aria-labelledby="ev-voices-h">
          <div className="head">
            <Swash id="ev-voices-h" lines={['In their', 'guests’', 'words']} swash="words" />
            <p className="mono">Verbatim, from the five Airbnb listings</p>
          </div>
          <div className="rail" tabIndex={0} aria-label="Guest reviews">
            {[...VOICES.filter((_, k) => k !== 1), ...COTTAGES.map((c) => ({ text: c.quote.text, who: `${c.quote.who}, cottage ${c.id}`, when: c.quote.when }))].map((v, k) => (
              <figure key={k}><blockquote>“{v.text}”</blockquote><figcaption className="mono">{v.who} · {v.when}</figcaption></figure>
            ))}
          </div>
        </section>

        {/* 10 — book: the engine, at the bottom */}
        <section className="ev-book grain" id="book" aria-labelledby="ev-book-h">
          <div className="top">
            <Swash id="ev-book-h" lines={['Pick', 'your', 'nights']} swash="nights" />
            <div>
              <p className="ev-lines">Pick a cottage, or let the calendar find one that is free.</p>
              <a className="ev-link" href={`tel:${CONTACT.tel}`}>Or call {CONTACT.phone}</a>
            </div>
          </div>
          <StayPicker unit={unit} setUnit={setUnit} />
          <div className="know">
            {KNOW.map(([k, v]) => <div key={k}><b>{k}</b><span>{v}</span></div>)}
          </div>
        </section>
      </main>

      <footer className="ev-foot">
        <p className="word" aria-hidden="true" translate="no">EYVÍK<Star /></p>
        <div className="grid">
          <div className="brand">
            <h4>Eyvík Cottages</h4>
            <p className="tag">Five cottages in a row on the farm at Eyvík, each with its own deck and hot tub.</p>
          </div>
          <div className="spec">
            <h4>The five</h4>
            <ul>{COTTAGES.map((c) => <li key={c.id}><a href="#five">Cottage {c.id}</a><span>{c.rating} · {c.reviews}</span></li>)}</ul>
          </div>
          <div>
            <h4>The site</h4>
            <ul>{NAV.map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a href={`https://www.airbnb.com/rooms/${COTTAGES[0].airbnb}`} target="_blank" rel="noopener">On Airbnb ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>Urðarholt ehf. · Eyvík, 805 Selfoss · © {YEAR}</p>
          <span className="credit">Designed by{' '}
            <a className="sndr" href="https://sndrstudio.is" target="_blank" rel="noopener" aria-label="Designed by SNDR Studio" data-logotype>
              <span className="sndr__mark">SN<i>✦</i>DR</span><span className="sndr__studio">STUDIO</span>
            </a>
          </span>
        </div>
        <p className="proto">
          Prototype: a design concept, not the company’s website. Facts, photographs and calendars come from the owners’ five Airbnb listings and their guests’ reviews, collected September 2026.
        </p>
      </footer>
    </div>
  )
}

