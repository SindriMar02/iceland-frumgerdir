import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import { A, CONTACT, DEVELOPMENTS, IMG, JSON_LD, LISTING_COUNT, OPEN_HOUSES, PROCESS, SERVICES, STAFF, TARIFF, type Photo } from './data'
import { MARK_PATH } from './merki'

/*
 * FJÁRFESTING — "The house mark, in sheets". DESIGN.md beside this file.
 *
 * A behaviour-for-behaviour transplant of wild-ag.ch, measured in
 * _reference/wildag-teardown/{SYSTEM,MOTION}.md. Same em-on-vw scale, same
 * stacked sheets with 4.33em rounded feet, same two easings, same loader
 * timeline, hero mask scrub, SplitText hero, sticky header with a 2s idle hide,
 * slogan parallax + ticker, inertia rails, drawer and modals. Our own code;
 * Fjárfesting's own photos, facts and maroon. No smooth-scroll engine: the
 * reference has none.
 *
 * Declared deviations: phones get the constant bar + awning
 * (mobile-chrome-standard), section reveals are scrubbed to position, not timed,
 * and desktop gets Lenis (Sindri, 22.09) which the reference does not have.
 */

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('fjarfesting')
const YEAR = new Date().getFullYear()
const B = import.meta.env.BASE_URL
const PAPER = '#F7F6F3'
/* the page colour Safari samples at load for its status and toolbar strips: the maroon of
 * the phone bar and the footer sheet, so all three read one source (mobile-chrome-standard) */
const M1 = '#8C3A3D'
const OUT = 'cubic-bezier(0.25, 1, 0.5, 1)'
const SEEN = 'fj-opened'

/* Lenis drives the wheel on fine pointers only (lenis-mobile-damage): a phone keeps
 * native scroll so Safari can collapse its toolbar. Overlays carry data-lenis-prevent. */
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches

const CSS = `
@font-face{font-family:'FjS';src:url('${B}fonts/hanken-grotesk/hanken-grotesk-v12-latin_latin-ext-300.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'FjS';src:url('${B}fonts/hanken-grotesk/hanken-grotesk-v12-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'FjS';src:url('${B}fonts/hanken-grotesk/hanken-grotesk-v12-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'FjS';src:url('${B}fonts/hanken-grotesk/hanken-grotesk-v12-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'FjS';src:url('${B}fonts/hanken-grotesk/hanken-grotesk-v12-latin_latin-ext-700.woff2') format('woff2');font-weight:700;font-display:swap}
@font-face{font-family:'FjI';src:url('${B}fonts/recia/Recia-Italic.woff2') format('woff2');font-style:italic;font-weight:400;font-display:swap}
@font-face{font-family:'FjI';src:url('${B}fonts/recia/Recia-LightItalic.woff2') format('woff2');font-style:italic;font-weight:300;font-display:swap}
html,body{background-color:${M1}}
.fj{--paper:${PAPER};--band:#EFEDEA;--ink:#2B2123;--mute:#5F6064;--m1:#8C3A3D;--m2:#A85A52;--rose:#E4D6D0;--hair:rgba(151,64,66,.25);
  --grad:linear-gradient(15deg,var(--m1),var(--m2));--out:${OUT};--hov:cubic-bezier(.25,.46,.45,.94);
  --mark:url('${B}fjarfesting/merki.svg');--ms:1.51vw;--gut:1.66em;--R:4.33em;--r:1em;
  --h1:3.33em;--h2:3.06em;--h3:1.8em;--h4:1.33em;--pp:1em;--lab:.8em;--disp:7.06em;
  font-family:'FjS',system-ui,sans-serif;font-size:var(--ms);font-weight:500;line-height:1.4;letter-spacing:-.01em;color:var(--mute);background:var(--paper);overflow-x:clip;-webkit-font-smoothing:antialiased}
@media (min-width:1280px){.fj{--ms:1.17vw;--gut:8.33em}}
@media (min-width:1920px){.fj{--ms:1.04vw;--gut:14.25em}}
@media (max-width:991px){.fj{--ms:1.95vw}}
@media (max-width:767px){.fj{--ms:3.13vw;--R:3.66em}}
@media (max-width:479px){.fj{--ms:4.6875vw;--gut:1em;--R:3em;--r:.86em;--h1:2.4em;--h2:2.2em;--h3:1.6em;--h4:1.2em;--pp:.93em;--lab:.73em;--disp:5.06em}}
.fj *{box-sizing:border-box}
.fj a{color:inherit;text-decoration:none}
.fj p,.fj h1,.fj h2,.fj h3,.fj h4{margin:0}
.fj img{display:block}
.fj button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.fj a,.fj button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.fj a:focus-visible,.fj button:focus-visible,.fj input:focus-visible,.fj textarea:focus-visible{outline:2px solid var(--m1);outline-offset:3px}
.fj .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fj .skip{position:fixed;left:1rem;top:-100px;z-index:100001;background:var(--paper);color:var(--ink);padding:.8em 1.2em;border-radius:999px}
.fj .skip:focus{top:1rem}
.fj section[id]{scroll-margin-top:4.2em}
.fj-hero :focus-visible,.fj .foot :focus-visible,.fj-proc :focus-visible,.fj-slogan :focus-visible{outline-color:var(--paper)!important}

/* type */
.fj .h1{font-size:var(--h1);color:var(--paper);text-transform:uppercase;font-weight:400;line-height:1;text-align:center;text-wrap:balance}
.fj .h1 em,.fj .disp em{font-family:'FjI',Georgia,serif;font-style:italic;line-height:0}
.fj .h1 em{font-size:1.08em}
/* SplitText's line masks are 1em tall and clip; the 1.08em italic Ú/Í accents reach above that, so pad the masks up and pull the padding back */
.fj .h1 > *{padding-top:.3em;margin-top:-.3em}
.fj .h2{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:400;font-size:var(--h2);text-transform:uppercase;line-height:.95;padding:.06em .04em .1em 0;
  background-image:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.fj .h2.white{background:none;-webkit-text-fill-color:var(--paper);color:var(--paper)}
.fj .mw{overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
.fj .h3{font-size:var(--h3);color:var(--paper);font-weight:600;line-height:1.2}
.fj .h4{font-size:var(--h4);color:var(--ink);font-weight:600;line-height:1.4}
.fj .p{font-size:var(--pp);text-wrap:pretty}
.fj .lab{font-size:var(--lab);font-weight:700;text-transform:uppercase;line-height:1.15;letter-spacing:.01em;color:var(--paper)}
.fj .stack{display:flex;flex-direction:column;align-items:flex-start;gap:1.33em}
.fj .ps{display:flex;flex-direction:column;gap:.66em;max-width:34em}

/* buttons: squared blocks, not pills. One shape: .4em corners, everywhere a control lives */
.fj .btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.9em;height:3.66em;padding:0 2.2em;border-radius:.4em;overflow:hidden;isolation:isolate;
  background:var(--paper);color:var(--ink);font-size:var(--lab);font-weight:700;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;
  transition:color .35s var(--hov),transform .16s var(--out)}
.fj .btn::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--ink);clip-path:inset(100% 0 0 0);transition:clip-path .45s var(--out)}
.fj .btn.grad{background:var(--grad);color:var(--paper)}
.fj .btn.line{background:transparent;color:var(--paper);box-shadow:inset 0 0 0 1px rgba(247,246,243,.6)}
.fj .btn.line::before{background:var(--paper)}
.fj .btn .n{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:400;font-size:1.5em;letter-spacing:0;text-transform:none;line-height:1}
@media (hover:hover) and (pointer:fine){
  .fj .btn:hover{color:var(--paper)}.fj .btn:hover::before{clip-path:inset(0)}
  .fj .btn.line:hover{color:var(--ink)}
}
.fj .btn:active{transform:scale(.98)}
.fj .call{display:inline-flex;flex-direction:column;align-items:flex-end;line-height:1;gap:.3em;color:var(--ink)}
.fj .call small{font-size:.62em;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.65}
.fj .call b{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:400;font-size:1.45em;letter-spacing:.01em;font-variant-numeric:tabular-nums;white-space:nowrap}
.fj .call.inv{color:var(--paper)}

/* logo */
.fj .logo{display:flex;align-items:center;gap:.6em;color:#6D6E71}
.fj .logo img{width:2.05em;height:2.4em}
.fj .logo b{display:block;font-weight:600;font-size:1.28em;letter-spacing:.07em;line-height:1}
.fj .logo small{display:block;font-weight:600;font-size:.62em;letter-spacing:.14em;line-height:1;margin-top:.45em}
.fj .logo.inv{color:var(--paper)}
.fj .logo.inv img{filter:brightness(0) invert(1)}

/* burger */
.fj .burger{width:2.66em;height:2.66em;position:relative;display:flex;align-items:center;justify-content:center}
.fj .burger i{position:absolute;width:100%;height:.13em;border-radius:9999px;overflow:hidden;transition:transform .3s var(--out);display:flex;justify-content:center}
.fj .burger i::after{content:'';display:block;width:100%;height:100%;background:currentColor;transition:transform .25s var(--hov)}
.fj .burger i:nth-child(1){transform:translateY(-.4em)}
.fj .burger i:nth-child(3){transform:translateY(.4em)}
@media (hover:hover) and (pointer:fine){.fj .burger:hover i:nth-child(2)::after{transform:scaleX(.5)}}
.fj.menu-open .burger i:nth-child(1){transform:rotate(45deg)}
.fj.menu-open .burger i:nth-child(2){transform:scaleX(0);transition-duration:.1s}
.fj.menu-open .burger i:nth-child(3){transform:rotate(-45deg)}
.fj .x{width:2.66em;height:2.66em;border-radius:9999px;background:var(--band);position:relative;display:flex;align-items:center;justify-content:center;transition:background-color .3s var(--hov);flex:none}
.fj .x i{position:absolute;width:50%;height:.13em;background:var(--m1);border-radius:9999px;transition:background-color .3s var(--hov)}
.fj .x i:first-child{transform:rotate(45deg)}.fj .x i:last-child{transform:rotate(-45deg)}
@media (hover:hover) and (pointer:fine){.fj .x:hover{background:var(--ink)}.fj .x:hover i{background:var(--paper)}}

/* arrow glyph: line + head, the line doubles on hover */
.fj .arw{width:1em;height:.66em;flex:none;overflow:visible}
.fj .arw line{transform-origin:right;transition:transform .3s var(--hov),stroke .3s var(--hov)}
.fj .arw path{transition:stroke .3s var(--hov)}

/* ── loader ── */
.fj-loader{position:fixed;inset:0;z-index:999999;background:var(--grad);display:flex;align-items:center;justify-content:center;height:100lvh}
.fj-loader .card{position:absolute;inset:0;background:var(--paper);animation:fj-card 5.9s linear forwards}
.fj-loader.quick .card{animation:none}
@keyframes fj-card{from{transform:scaleY(1);border-radius:0}to{transform:scaleY(.92);border-radius:var(--R)}}
.fj-loader .mark{position:relative;display:flex;align-items:center;gap:1.2em;color:#6D6E71}
.fj-loader svg{width:6.5em;height:7.6em;overflow:visible}
.fj-loader svg path{fill:var(--m1);fill-opacity:0;stroke:var(--m1);stroke-width:22;stroke-dasharray:1;stroke-dashoffset:1}
/* one mask per line, so the name can't show through the subtitle's slot before it rises;
   each mask is line-height:1 tall, so it gets headroom for the Á accent, pulled back out */
.fj-loader .word .l{display:block;overflow:hidden;padding-top:.35em;margin-top:-.35em}
.fj-loader .word .l > span{display:block;transform:translateY(110%);font-weight:600;letter-spacing:.07em;line-height:1}
.fj-loader .word .l:first-child{font-size:2.9em}
.fj-loader .word .l:last-child{font-size:1.4em;margin-top:.1em}
.fj-loader .word .l:last-child > span{letter-spacing:.14em}
@media (max-width:767px){.fj-loader .mark{flex-direction:column;gap:.9em;text-align:center}.fj-loader svg{width:5em;height:5.85em}.fj-loader .word .l:first-child{font-size:2.2em}.fj-loader .word .l:last-child{font-size:1.1em}}
.fj-blur{position:fixed;inset:0;z-index:999998;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);pointer-events:none}

/* ── chrome ── */
.fj-sticky{position:fixed;inset:0 0 auto 0;z-index:99997;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 .33em 1.66em rgba(43,33,35,.05)}
.fj-sticky.on{opacity:1;pointer-events:auto}
.fj-sticky .row,.fj .hero-head{display:flex;align-items:center;justify-content:space-between;padding:1em var(--gut)}
.fj-sticky .row{background:var(--paper)}
.fj .menu-btns{display:flex;align-items:center;gap:2em}
.fj-sticky .burger{color:var(--m1)}
.fj.menu-open .fj-sticky,.fj.pop-open .fj-sticky{opacity:0;pointer-events:none}
.fj-awning{display:none}
@media (max-width:767px){
  /* mobile-chrome-standard: the constant bar + a colourless awning. No behaviour. */
  .fj-sticky{opacity:1;pointer-events:auto;height:calc(3.9em + env(safe-area-inset-top));padding-top:env(safe-area-inset-top);background:rgba(140,58,61,.94);color:var(--paper);
    -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:none;border-bottom:1px solid rgba(247,246,243,.14);transition:none}
  .fj-sticky .logo{color:var(--paper)}.fj-sticky .logo img{filter:brightness(0) invert(1)}
  .fj-sticky .call{color:var(--paper)}.fj-sticky .burger{color:var(--paper)}
  .fj-sticky .row{background:transparent;height:3.9em;padding-top:0;padding-bottom:0}
  .fj-sticky .call b{font-size:1.25em}
  .fj.menu-open .fj-sticky,.fj.pop-open .fj-sticky{opacity:1;pointer-events:auto}
  .fj-awning{display:block;position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:99996;pointer-events:none;
    -webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);-webkit-mask-image:linear-gradient(180deg,#000 88%,transparent);mask-image:linear-gradient(180deg,#000 88%,transparent)}
  .fj .hero-head{visibility:hidden}
}
.fj-dim{position:fixed;inset:0;z-index:99998;opacity:0;pointer-events:none;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  background:linear-gradient(15deg,rgba(140,58,61,.5),rgba(168,90,82,.5));transition:opacity .6s var(--out)}
.fj.menu-open .fj-dim,.fj.pop-open .fj-dim{opacity:1}

/* drawer: clip-path wipe from the right, CSS-delayed choreography (Wild's menu block) */
.fj-menu{position:fixed;inset:0;z-index:99999;pointer-events:none;height:100dvh;
  --md:.6s;--del:.5s}
.fj.menu-open .fj-menu{pointer-events:auto}
.fj-menu .wrap{height:100%;overflow:hidden;cursor:pointer}
.fj.menu-open .fj-menu .wrap{overflow-y:auto;overscroll-behavior:contain}
.fj-menu nav{margin-left:auto;width:25.2em;min-height:calc(100% + 1px);background:var(--paper);cursor:auto;display:flex;flex-direction:column;
  clip-path:inset(0 0 0 100%);transition:clip-path var(--md) var(--out)}
.fj.menu-open .fj-menu nav{clip-path:inset(0 0 0 0)}
@media (min-width:1280px){.fj-menu nav{width:31.93em}}
@media (min-width:1920px){.fj-menu nav{width:37.93em}.fj-menu{--md:.65s}}
@media (max-width:991px){.fj-menu nav{width:50%}}
@media (max-width:767px){.fj-menu nav{width:100%}}
@media (max-width:479px){.fj-menu{--md:.55s}}
.fj-menu .mh{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:1.66em var(--gut) 1.79em 2.33em;background:var(--paper)}
@media (max-width:767px){.fj-menu .mh{padding:1em var(--gut) 1.13em}}
.fj-menu .mh .logo{opacity:0;transition:opacity 0s linear var(--del)}
.fj.menu-open .fj-menu .mh .logo{opacity:1;transition:opacity var(--md) var(--out) .2s}
.fj-menu .div{position:absolute;bottom:0;left:2.33em;height:.13em;background:var(--hair);border-radius:9999px;width:calc(100% - 2.33em - var(--gut));transform:scaleX(0);transform-origin:left;transition:transform 0s linear var(--del)}
.fj.menu-open .fj-menu .div{transform:none;transition:transform var(--md) var(--out) .1s}
.fj-menu .links{display:flex;flex-direction:column;gap:.66em;padding:2.73em var(--gut) 2.73em 2.33em;flex:1}
@media (max-width:767px){.fj-menu .links,.fj-menu .soc{padding-left:var(--gut)}}
.fj-menu .links a{display:block;overflow:hidden;width:max-content;max-width:100%}
.fj-menu .links span{display:inline-block;font-family:'FjI',Georgia,serif;font-style:italic;font-size:var(--h2);text-transform:uppercase;line-height:1.1;position:relative;
  background-image:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  opacity:0;transform:translateY(100%);transition:opacity 0s linear var(--del),transform 0s linear var(--del)}
.fj.menu-open .fj-menu .links span{opacity:1;transform:none;transition:opacity var(--md) var(--out) calc(.3s + var(--i) * .1s),transform var(--md) var(--out) calc(.3s + var(--i) * .1s)}
.fj-menu .links span::after{content:attr(data-t);position:absolute;inset:0;-webkit-text-fill-color:var(--ink);opacity:0;transition:opacity .3s var(--hov)}
@media (hover:hover) and (pointer:fine){.fj-menu .links a:hover span::after{opacity:1}}
.fj-menu .soc{padding:0 var(--gut) 1.66em 2.33em;display:flex;flex-direction:column;gap:.3em;opacity:0;transition:opacity 0s linear var(--del)}
.fj.menu-open .fj-menu .soc{opacity:1;transition:opacity var(--md) var(--out) 1.2s}
.fj-menu .soc a{color:var(--m1);font-weight:600}

/* modals (Wild's popups) */
.fj-pop{position:fixed;inset:0;z-index:99999;pointer-events:none;height:100dvh}
.fj-pop.on{pointer-events:auto}
.fj-pop .wrap{height:100%;overflow:hidden;opacity:0;transition:opacity .6s var(--out);cursor:pointer}
.fj-pop.on .wrap{opacity:1;overflow-y:auto;overscroll-behavior:contain}
.fj-pop .grid{display:grid;grid-template-columns:repeat(8,1fr);column-gap:1em;align-items:center;min-height:calc(100% + 1px);padding:3.66em var(--gut)}
.fj-pop .card{grid-column:2 / 8;position:relative;background:var(--paper);border-radius:var(--r);cursor:auto;transform:translateY(1em);transition:transform .6s var(--out)}
.fj-pop.on .card{transform:none}
@media (min-width:1280px){.fj-pop .grid{grid-template-columns:repeat(12,1fr)}.fj-pop .card{grid-column:3 / 11}}
@media (min-width:1920px){.fj-pop .grid{grid-template-columns:repeat(14,1fr)}.fj-pop .card{grid-column:3 / 13}}
@media (max-width:991px){.fj-pop .grid{padding:3.66em 4.33em}.fj-pop .card{grid-column:1 / -1}}
.fj-pop .close{position:absolute;top:-2.66em;right:-2.66em;z-index:3}
.fj-pop .close .x{background:var(--paper)}
.fj-pop .body{display:flex;flex-direction:column;align-items:flex-start;gap:2em;padding:1.86em 2.33em 2.33em}
.fj-pop .head{display:flex;gap:1.33em;align-items:flex-start}
.fj-pop .body .ps{max-width:none}
@media (max-width:767px){
  .fj-pop .grid{padding:0;align-items:stretch}.fj-pop .card{border-radius:0;min-height:100%}
  .fj-pop .close{position:sticky;top:0;right:auto;display:flex;justify-content:flex-end;padding:1em var(--gut);background:var(--paper);box-shadow:0 .33em 1.66em rgba(43,33,35,.05)}
  .fj-pop .close .x{background:var(--hair)}
  .fj-pop .body{padding:2.86em var(--gut) 2em}
  .fj-pop .head{gap:.9em;align-items:center}
  .fj-pop .h2{font-size:1.65em;text-wrap:balance}
  .fj-pop .num{top:0}
}
.fj .num{width:2.33em;height:2.33em;border-radius:9999px;background:var(--m1);color:var(--paper);display:flex;align-items:center;justify-content:center;flex:none;font-size:var(--pp);transition:background-color .3s var(--hov),color .3s var(--hov)}
.fj-pop .num{position:relative;top:.33em}

/* ── hero ── */
.fj-hero{position:relative;background:var(--grad);overflow:hidden}
.fj-hero .stage{position:fixed;inset:0 0 auto 0;height:100lvh;z-index:0;background:var(--grad)}
.fj-hero .stage.gone{position:absolute}
.fj-hero .mask{--top:1;--bot:1;position:absolute;inset:0;overflow:hidden;
  -webkit-mask-image:linear-gradient(0deg,rgba(0,0,0,var(--bot)) 0%,rgba(0,0,0,var(--top)) 100%);mask-image:linear-gradient(0deg,rgba(0,0,0,var(--bot)) 0%,rgba(0,0,0,var(--top)) 100%)}
.fj-hero .mask img{width:100%;height:100%;object-fit:cover;animation:fj-loop 24s linear infinite}
@keyframes fj-loop{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.fj-hero .shade{position:absolute;inset:0 0 auto 0;height:13.33em;background:linear-gradient(rgba(20,12,13,.42),rgba(20,12,13,0))}
.fj-hero .els{position:relative;z-index:1;height:100svh;min-height:11.6em;display:flex;flex-direction:column}
.fj-hero .head-wrap{flex:1;padding:1.66em 0 6.86em}
.fj .hero-head{position:sticky;top:1.66em;padding-top:0;padding-bottom:0}
/* centred slogan over the hero photo, before any scroll */
.fj-hero .hero-slogan{position:absolute;inset:0 0 auto;height:100svh;padding:0 var(--gut);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:calc(var(--h1) * 1.3);line-height:1.12;pointer-events:none;text-shadow:0 .04em .5em rgba(20,12,13,.4)}
.fj-hero .hero-slogan::before{content:'';position:absolute;inset:18% 0;z-index:-1;background:radial-gradient(ellipse 50% 45% at 50% 50%,rgba(20,12,13,.34),rgba(20,12,13,0))}
.fj-hero .hero-slogan span{display:block;white-space:nowrap}
@media (max-width:479px){.fj-hero .hero-slogan{font-size:calc(var(--h1) * .78)}}
.fj-hero .arrow{position:absolute;inset:auto 0 0 0;height:100svh;display:flex;align-items:flex-end;justify-content:center;padding:1.66em;pointer-events:none}
.fj-hero .arrow a{pointer-events:auto;overflow:hidden;color:var(--paper);display:block;padding:.4em}
.fj-hero .arrow svg{width:.66em;height:2.33em;display:block}
.fj-hero .arrow.loop svg{animation:fj-arrow 2.6s cubic-bezier(.5,1,.89,1) infinite}
@keyframes fj-arrow{0%,26.92%{transform:translateY(0)}53.84%{transform:translateY(100%)}53.85%,73.08%{transform:translateY(-100%)}100%{transform:translateY(0)}}
.fj-hero .content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:2em;padding:0 var(--gut) 7.33em}
.fj-hero .content .p{color:var(--paper);text-align:center;max-width:36em}
.fj-hero .h1wrap{display:flex;flex-direction:column;gap:1.2em;align-items:center;width:78%}
@media (min-width:1920px){.fj-hero .h1wrap{width:68%}}
@media (max-width:1279px){.fj-hero .h1wrap{width:100%}}
@media (max-width:767px){.fj-hero .content{padding-bottom:6em}.fj-hero .head-wrap{padding-bottom:5.53em}}
@media (max-width:479px){.fj-hero .content{gap:1.66em;padding-bottom:4.66em}.fj-hero .h1wrap{gap:1.06em}.fj-hero .content .btn{width:100%}}
.fj-hero .corner{position:absolute;bottom:-1px;width:var(--R);height:var(--R);z-index:2;background:radial-gradient(circle at 100% 0,transparent calc(var(--R) - .5px),var(--paper) var(--R))}
.fj-hero .corner.l{left:0}.fj-hero .corner.r{right:0;transform:scaleX(-1)}

/* ── sheets ── */
.fj .sheet{position:relative;width:100%}
.fj .gridsec{display:grid;grid-template-columns:1fr 1fr;column-gap:3.33em;padding:6.86em var(--gut) 7em;background:var(--paper)}
@media (min-width:1280px){.fj .gridsec{column-gap:4.66em}}
.fj .pic{position:relative;border-radius:.5em;overflow:hidden;background:var(--rose);width:100%}
.fj .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fj .cap{display:block;margin-top:.8em;font-size:var(--lab);color:var(--mute);letter-spacing:.01em}
.fj .tab{font-variant-numeric:tabular-nums}

/* Stofan / Gjaldskráin: the rate card — their tariff set at the size it deserves */
.fj-about{z-index:3;row-gap:6.86em}
.fj-about .pa{margin-top:4.53em;height:28.2em}
.fj-about .pbw{position:relative}
.fj-about .pb{position:absolute;top:-10.2em;height:28.2em}
.fj .rates{display:grid;grid-template-columns:1fr 1fr;width:100%;margin-top:.6em}
.fj .rate{display:flex;flex-direction:column;gap:.35em;padding:1.6em 1.6em 1.8em 0}
.fj .rate:nth-child(2n){padding-left:1.6em;padding-right:0;box-shadow:inset 1px 0 0 var(--hair)}
.fj .rate:nth-child(n+3){box-shadow:inset 0 1px 0 var(--hair)}
.fj .rate:nth-child(4){box-shadow:inset 1px 0 0 var(--hair),inset 0 1px 0 var(--hair)}
.fj .rate .fig{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;font-size:3.9em;line-height:1;letter-spacing:-.02em;padding:.04em .06em .12em 0;
  background-image:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums}
.fj .rate .h4{margin-top:.3em}
.fj .rate .p{font-size:.93em;max-width:17em}
.fj-about .note{font-size:var(--lab);color:var(--mute);margin-top:1.2em}

/* Starfsfólk: portraits on their own studio backdrop, type below, no coloured boxes */
.fj-team{z-index:3;background:var(--band);padding:6.86em 0 7.33em;display:flex;flex-direction:column;gap:2em;overflow:hidden}
.fj .rowhead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;column-gap:1em;row-gap:.8em;padding:0 var(--gut)}
.fj .rowhead .hcol{display:flex;flex-direction:column;gap:.9em}
.fj .rowhead .aside{font-size:var(--pp);max-width:28em}
.fj .arrows{display:none;gap:.5em}
.fj .arrows button{width:3.33em;height:3.33em;border-radius:.4em;background:var(--paper);display:flex;align-items:center;justify-content:center;color:var(--m1);transition:background-color .3s var(--hov),color .3s var(--hov),opacity .3s var(--hov)}
.fj .arrows button:disabled{opacity:.4;pointer-events:none}
@media (hover:hover) and (pointer:fine){.fj .arrows button:hover{background:var(--ink);color:var(--paper)}}
.fj .rail{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain}
.fj .rail::-webkit-scrollbar{display:none}
@media (hover:none){.fj .rail{scroll-snap-type:x mandatory;scroll-padding-inline:calc(var(--gut) + .01em)}.fj .rail .card2,.fj .rail .sign{scroll-snap-align:start}}
.fj .rail.drag{cursor:grabbing}
.fj .rail .list{display:flex;gap:1em}
.fj .rail .pad{flex:0 0 .66em}
@media (min-width:1280px){.fj .rail .pad{flex-basis:7.33em}}
@media (min-width:1920px){.fj .rail .pad{flex-basis:13.25em}}
@media (max-width:479px){.fj .rail .pad{flex-basis:.01em}}
.fj .person{flex:0 0 calc(25% - 1.58em);display:flex;flex-direction:column;gap:1.1em}
@media (min-width:1280px){.fj .person{flex-basis:calc(25% - 4.915em)}}
@media (min-width:1920px){.fj .person{flex-basis:calc(25% - 7.875em)}}
.fj .person .ph{position:relative;aspect-ratio:3/3.7;border-radius:.5em;overflow:hidden;background:#EADFD4}
.fj .person .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%;transition:transform .6s var(--out);pointer-events:none}
.fj .person .nm{font-family:'FjI',Georgia,serif;font-style:italic;font-size:1.55em;line-height:1.08;color:var(--ink);text-wrap:balance}
.fj .person .ro{font-size:var(--lab);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);line-height:1.35;margin-top:.45em;min-height:2.7em}
.fj .person .tl{display:inline-flex;align-items:baseline;gap:.5em;color:var(--m1);font-weight:600;font-variant-numeric:tabular-nums;margin-top:.1em;
  background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .4s var(--out)}
@media (hover:hover) and (pointer:fine){.fj .person:hover .ph img{transform:scale(1.05)}.fj .person .tl:hover{background-size:100% 1px}}

/* slogan */
.fj-slogan{height:100svh;display:flex;flex-direction:column;background:var(--paper)}
.fj-slogan .pw{position:relative;z-index:2;flex:1;overflow:hidden;border-radius:0 0 var(--R) var(--R);background:var(--rose)}
.fj-slogan .pw img{position:absolute;left:0;right:0;bottom:0;width:100%;height:200%;object-fit:cover}
.fj-slogan .band{position:relative;z-index:1;margin-top:calc(var(--R) * -1);padding:7.13em 0 2.86em;background:var(--grad);border-radius:0 0 var(--R) var(--R)}
@media (max-width:767px){.fj-slogan .band{padding:5.8em 0 2.2em}}
.fj .tick{display:flex;overflow:hidden;white-space:nowrap}
.fj .tick .ln{flex:none;will-change:transform;transform:translateX(-100%)}
.fj-slogan .tick.run .ln{animation:fj-tick 10s linear infinite}
@keyframes fj-tick{from{transform:translateX(0)}to{transform:translateX(-100%)}}
.fj .disp{font-size:var(--disp);color:var(--paper);text-transform:uppercase;font-weight:300;line-height:1.25;padding-right:.35em}
.fj .disp em{font-size:1.06em;font-weight:300}
.fj .disp .mk{display:inline-block;width:.62em;height:.72em;vertical-align:-.02em;margin:0 .28em 0 .18em;background:currentColor;
  -webkit-mask:var(--mark) center/contain no-repeat;mask:var(--mark) center/contain no-repeat}

/* Þjónusta: an index, not a stack of pills. The figure from the tariff is the right-hand column */
.fj-serv{row-gap:7.33em;padding-bottom:7.33em}
.fj-serv .pa{margin-top:4.46em;height:28.86em}
.fj-serv .pbw{position:relative}
.fj-serv .pb{position:absolute;top:-10.66em;height:28.93em}
.fj .idx{display:flex;flex-direction:column;box-shadow:inset 0 1px 0 var(--hair)}
.fj .idx .row{position:relative;display:grid;grid-template-columns:1fr auto 1.4em;align-items:center;column-gap:1.4em;width:100%;padding:1.25em .2em 1.25em 0;
  text-align:left;box-shadow:inset 0 -1px 0 var(--hair);isolation:isolate;transition:padding .45s var(--out)}
.fj .idx .row::before{content:'';position:absolute;inset:0 -1.2em;z-index:-1;border-radius:.4em;background:var(--grad);clip-path:inset(100% 0 0 0 round .4em);transition:clip-path .45s var(--out)}
.fj .idx .t{font-family:'FjI',Georgia,serif;font-style:italic;font-size:1.72em;line-height:1.1;color:var(--ink);transition:color .35s var(--hov)}
.fj .idx .f{font-weight:600;color:var(--m1);font-variant-numeric:tabular-nums;white-space:nowrap;transition:color .35s var(--hov)}
.fj .plus{position:relative;width:1.4em;height:1.4em;flex:none;color:var(--m1);transition:transform .45s var(--out),color .35s var(--hov)}
.fj .plus::before,.fj .plus::after{content:'';position:absolute;left:50%;top:50%;width:62%;height:1.5px;background:currentColor;border-radius:2px;transform:translate(-50%,-50%)}
.fj .plus::after{transform:translate(-50%,-50%) rotate(90deg)}
@media (hover:hover) and (pointer:fine){
  .fj .idx .row:hover::before{clip-path:inset(0 0 0 0 round .4em)}
  .fj .idx .row:hover .t,.fj .idx .row:hover .f,.fj .idx .row:hover .plus{color:var(--paper)}
  .fj .idx .row:hover .plus{transform:rotate(90deg)}
}

/* Í sölu: image-led prospectus cards */
.fj-proj{z-index:3;background:var(--band);padding:6.86em 0 7.33em;display:flex;flex-direction:column;gap:2em;border-radius:0 0 var(--R) var(--R);overflow:hidden}
.fj .dev{flex:0 0 calc(50% - 2.16em);display:flex;flex-direction:column;gap:1.3em}
@media (min-width:1280px){.fj .dev{flex-basis:calc(50% - 8.83em)}}
@media (min-width:1920px){.fj .dev{flex-basis:calc(50% - 14.75em)}}
.fj .dev .ph{position:relative;height:22em;border-radius:.5em;overflow:hidden;background:var(--rose)}
.fj .dev .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s var(--out);pointer-events:none}
.fj .dev .hd{display:flex;align-items:baseline;justify-content:space-between;gap:1em;padding-bottom:.9em;box-shadow:inset 0 -1px 0 var(--hair)}
.fj .dev .nm{font-family:'FjI',Georgia,serif;font-style:italic;font-size:2.1em;line-height:1;color:var(--ink)}
.fj .dev .tw{font-size:var(--lab);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);white-space:nowrap}
.fj .dev .sp{display:grid;grid-template-columns:auto 1fr;column-gap:1.2em;align-items:end}
.fj .dev .ct{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;font-size:3.1em;line-height:.9;color:var(--m1);font-variant-numeric:tabular-nums}
.fj .dev .ln2{display:flex;flex-direction:column;gap:.15em;font-variant-numeric:tabular-nums}
.fj .dev .ln2 b{color:var(--ink);font-weight:600}
.fj .dev .go{margin-top:.2em;align-self:flex-start;font-size:var(--lab);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--m1);
  background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;padding-bottom:.25em;transition:background-size .4s var(--out)}
@media (hover:hover) and (pointer:fine){.fj .dev:hover .ph img{transform:scale(1.04)}.fj .dev:hover .go{background-size:0 1px;background-position:100% 100%}}

/* Opin hús: the A-frame sign agents stand on the pavement, as a ticker */
.fj-open{z-index:2;background:var(--paper);margin-top:calc(var(--R) * -1);padding:11.19em 0 7.33em;display:flex;flex-direction:column;gap:2em;overflow:hidden}
/* a real scroller: useTicker drifts it and wraps it, so it can also be dragged or swiped by hand */
/* a scroller clips on both axes, so pad it (and pull the padding back out) to leave room for the .35em hover lift */
.fj-open .tick{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain;cursor:grab;padding:.8em 0;margin:-.8em 0}
.fj-open .tick::-webkit-scrollbar{display:none}
.fj-open .tick.drag{cursor:grabbing}
.fj-open .tick .ln{transform:none;will-change:auto}
.fj-open .row{display:flex;gap:1em;padding-right:1em}
.fj .sign{flex:none;width:15.4em;display:flex;flex-direction:column;border-radius:.5em;overflow:hidden;background:var(--band);white-space:normal;transition:transform .45s var(--out)}
.fj .sign .bar{display:flex;justify-content:space-between;align-items:center;padding:.7em 1.1em;background:var(--grad);color:var(--paper);font-size:var(--lab);font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.fj .sign .bd{display:grid;grid-template-columns:auto 1fr;column-gap:.9em;row-gap:.2em;padding:1em 1.1em .9em}
.fj .sign .dd{grid-row:span 2;font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;font-size:3.3em;line-height:.85;color:var(--m1);font-variant-numeric:tabular-nums}
.fj .sign .mo{align-self:end;font-size:var(--lab);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.fj .sign .tm{font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}
.fj .sign .ad{padding:0 1.1em;color:var(--ink);font-weight:600;line-height:1.25}
.fj .sign .me{padding:.15em 1.1em 1em;font-size:.86em;font-variant-numeric:tabular-nums}
.fj .sign .me b{display:block;color:var(--ink);font-weight:600;margin-top:.15em}
.fj .sign .ph{margin-top:auto;height:6em;position:relative;background:var(--rose)}
.fj .sign .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s var(--out)}
@media (hover:hover) and (pointer:fine){.fj .sign:hover{transform:translateY(-.35em)}.fj .sign:hover .ph img{transform:scale(1.06)}}
.fj-open .touch{display:none}
@media (hover:none){.fj-open .tick{display:none}.fj-open .touch{display:block}}
.fj-open.still .tick{display:none}.fj-open.still .touch{display:block}

/* Söluferlið: three numbered stations on one drawn line, each priced from the tariff */
.fj-proc{z-index:2;display:flex;flex-direction:column;gap:4.2em;padding:7.33em var(--gut);background:var(--grad);border-radius:0 0 var(--R) var(--R)}
.fj-proc .top{display:grid;grid-template-columns:1fr 1fr;column-gap:4.66em;align-items:end}
.fj-proc .p{color:var(--paper)}
.fj-proc .steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);column-gap:3.33em}
.fj-proc .line{position:absolute;left:0;right:0;top:0;height:1px;background:rgba(247,246,243,.25)}
.fj-proc .line i{display:block;height:100%;background:var(--paper);transform-origin:left}
.fj-proc .step{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:.5em;padding-top:1.8em;text-align:left;color:var(--paper)}
.fj-proc .step::before{content:'';position:absolute;top:-.36em;left:0;width:.72em;height:.72em;border-radius:50%;background:var(--paper);transition:transform .45s var(--out)}
.fj-proc .step .no{font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;font-size:5.2em;line-height:.9;opacity:.35;transition:opacity .45s var(--out)}
.fj-proc .step .t{font-size:var(--h4);font-weight:600;line-height:1.2}
.fj-proc .step .f{font-family:'FjI',Georgia,serif;font-style:italic;font-size:1.6em;line-height:1.1;font-variant-numeric:tabular-nums}
.fj-proc .step .fl{font-size:var(--lab);font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.fj-proc .step .more{display:inline-flex;align-items:center;gap:.6em;margin-top:.7em;font-size:var(--lab);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.fj-proc .step .plus{color:var(--paper);width:1.2em;height:1.2em}
@media (hover:hover) and (pointer:fine){.fj-proc .step:hover .no{opacity:1}.fj-proc .step:hover::before{transform:scale(1.6)}.fj-proc .step:hover .plus{transform:rotate(90deg)}}

.fj-full{z-index:1;height:calc(100svh + var(--R));margin-top:calc(var(--R) * -1);background:var(--paper)}
.fj-full .fr{height:100%;overflow:hidden;border-radius:0 0 var(--R) var(--R);background:var(--rose)}
.fj-full img{width:100%;height:100%;object-fit:cover}

/* Hafa samband: the phone number is the call to action */
.fj-contact{display:grid;grid-template-columns:repeat(12,1fr);column-gap:1em;align-items:center;padding:7.33em var(--gut) 7.33em;background:var(--paper)}
.fj-contact .form{grid-column:1 / 8;background:var(--band);border-radius:.5em;padding:3.33em}
.fj-contact .info{grid-column:9 / 13}
.fj-contact .fields{display:grid;grid-template-columns:1fr 1fr;gap:1.1em 1em;margin-bottom:1.8em}
.fj-contact .fl{display:flex;flex-direction:column;gap:.45em}
.fj-contact .fl.w{grid-column:1 / -1}
.fj-contact label{font-size:var(--lab);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.fj-contact input,.fj-contact textarea{width:100%;font:inherit;font-size:max(16px,var(--pp));color:var(--ink);background:var(--paper);border:0;box-shadow:inset 0 0 0 1px var(--hair);border-radius:.4em;height:3.3em;padding:0 1.1em;transition:box-shadow .3s var(--hov);outline:0}
.fj-contact textarea{height:8.5em;padding-top:.9em;resize:none}
.fj-contact input:focus,.fj-contact textarea:focus{box-shadow:inset 0 0 0 1.5px var(--m1)}
.fj-contact ::placeholder{color:rgba(43,33,35,.45)}
.fj-contact .done{color:var(--m1);font-weight:600;text-wrap:balance}
.fj-contact .big{display:block;font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;font-size:3.4em;line-height:1;color:var(--m1);font-variant-numeric:tabular-nums;letter-spacing:-.01em;margin:.1em 0 .05em}
.fj-contact .mail{color:var(--ink);font-weight:600;background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;padding-bottom:.1em}
.fj-contact .addr{display:grid;grid-template-columns:auto 1fr;column-gap:1.4em;row-gap:.3em;margin-top:.6em}
.fj-contact .addr dt{font-size:var(--lab);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:.2em}
.fj-contact .addr dd{margin:0;color:var(--ink)}
@media (max-width:991px){.fj-contact .form{padding:2.33em}}

/* footer: the maroon sheet rises one last time and carries the name at full width */
.fj-foot{position:relative;z-index:2;margin-top:calc(var(--R) * -1);background:var(--grad);color:var(--paper);border-radius:var(--R) var(--R) 0 0;padding:5.2em var(--gut) 2.2em;overflow:hidden}
.fj-foot .cols{display:grid;grid-template-columns:repeat(4,auto);justify-content:space-between;gap:2em;padding-bottom:3.4em}
.fj-foot h4{font-size:var(--lab);font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin-bottom:.8em}
.fj-foot ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.3em}
.fj-foot a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .4s var(--out)}
@media (hover:hover) and (pointer:fine){.fj-foot a:hover{background-size:100% 1px}}
.fj-foot .word{display:block;width:max-content;margin-left:-.02em!important;font-family:'FjI',Georgia,serif;font-style:italic;font-weight:300;text-transform:uppercase;font-size:11vw;line-height:.8;letter-spacing:-.035em;white-space:nowrap;margin:0 -.04em;padding:.06em 0 .1em;color:var(--paper)}
.fj-foot .legal{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.6em 2em;padding-top:1.4em;box-shadow:inset 0 1px 0 rgba(247,246,243,.25);font-size:var(--lab)}
.fj-foot .sndr{display:inline-flex;align-items:baseline;gap:.4em;font-weight:600;background:none}
.fj-foot .sndr i{font-style:normal;opacity:.7}
.fj-foot .sndr small{font-size:.8em;letter-spacing:.2em;opacity:.7}
.fj-foot .proto{margin-top:1em;font-size:var(--lab);opacity:.7;max-width:70em}

/* ── tablet / phone ── */
@media (max-width:991px){
  .fj-about .pa,.fj-about .pb{height:33.8em}
  .fj-serv .pa,.fj-serv .pb{height:35.86em}
  .fj .person{flex-basis:calc(33.33% - 1.77em)}
  .fj-team .arrows{display:flex}
  .fj-foot .cols{grid-template-columns:1fr 1fr}
}
@media (max-width:767px){
  .fj .gridsec{grid-template-columns:1fr;row-gap:3em;column-gap:0;padding-top:5.33em;padding-bottom:6em}
  .fj-about .pa,.fj-about .pb,.fj-serv .pa,.fj-serv .pb{height:21.46em;margin-top:0;position:relative;top:0}
  .fj-about .pbw{order:4}
  .fj-serv .pa{order:1}.fj-serv .txt{order:0}.fj-serv .idx{order:2}.fj-serv .pbw{order:3}
  .fj-team,.fj-proj{padding-top:5.33em;padding-bottom:6em;gap:1.66em}
  .fj .person{flex-basis:calc(50% - 2.16em)}
  .fj .dev{flex-basis:calc(100% - 3.33em)}
  .fj-proj .arrows{display:flex}
  .fj .rail{cursor:grab}
  .fj-open{padding-top:9.19em;padding-bottom:6em;gap:1.66em}
  .fj-proc{padding-top:5.33em;padding-bottom:6em;gap:3em}
  .fj-proc .top{grid-template-columns:1fr;row-gap:1.4em}
  .fj-proc .steps{grid-template-columns:1fr;row-gap:2.4em;padding-left:1.6em}
  .fj-proc .line{left:.36em;right:auto;top:0;bottom:0;width:1px;height:auto}
  .fj-proc .line i{width:100%;height:100%;transform-origin:top}
  .fj-proc .step{padding-top:0}
  .fj-proc .step::before{top:.2em;left:calc(-1.6em + .36em - .36em)}
  .fj-contact{grid-template-columns:1fr;row-gap:3em}
  .fj-contact .form,.fj-contact .info{grid-column:1}
  .fj-contact .info{order:-1}
  .fj-contact .fields{grid-template-columns:1fr}
  .fj-menu .soc{padding-left:var(--gut)}
  .fj-menu .div{left:var(--gut);width:calc(100% - 2 * var(--gut))}
  .fj-foot{padding-top:4em}
  .fj-foot .legal{flex-direction:column}
}
@media (max-width:479px){
  .fj .gridsec{row-gap:2.66em;padding-top:3.86em;padding-bottom:4.66em}
  .fj-about .pa,.fj-about .pb,.fj-serv .pa,.fj-serv .pb{height:14.53em}
  .fj .rates{grid-template-columns:1fr}
  .fj .rate,.fj .rate:nth-child(2n){padding:1.2em 0 1.3em;box-shadow:inset 0 1px 0 var(--hair)}
  .fj .rate:first-child{box-shadow:none;padding-top:0}
  .fj .rate .fig{font-size:3.2em}
  .fj-team,.fj-proj{padding-top:3.86em;padding-bottom:4.66em;gap:1.46em}
  .fj .person,.fj .dev{flex-basis:calc(100% - 3em)}
  .fj .dev .ph{height:15em}
  .fj .dev .hd{flex-direction:column;align-items:flex-start;gap:.35em}
  .fj .dev .nm{font-size:1.85em;text-wrap:balance}
  .fj .arrows button{width:3em;height:3em}
  .fj .idx .t{font-size:1.45em}
  .fj .idx .row{grid-template-columns:1fr 1.2em;row-gap:.2em}
  .fj .idx .f{grid-row:2;font-size:.93em}
  .fj .idx .plus{grid-column:2;grid-row:1 / span 2}
  .fj-open{padding-top:7.33em;padding-bottom:4.66em}
  .fj .sign{width:13.8em}
  .fj-proc{padding-top:3.86em;padding-bottom:4.66em}
  .fj-contact{row-gap:2.66em;padding-top:3.86em;padding-bottom:6em}
  .fj-contact .form{padding:1.6em}
  .fj-contact .big{font-size:2.9em}
  .fj .btn{height:3.5em;padding:0 1.8em}
  .fj .burger,.fj .x{width:2.2em;height:2.2em}
  .fj .logo{font-size:.83em}
  .fj-sticky .menu-btns{gap:1em}
  .fj-sticky .call small{display:none}
  .fj-sticky .call b{font-size:1.1em}
  .fj-foot .cols{grid-template-columns:1fr 1fr;gap:1.6em 1em;font-size:.9em}
  .fj-foot ul{gap:0}
  .fj-foot li a{display:inline-block;padding:.35em 0}
  .fj-foot .cols>div:nth-child(2){grid-column:1 / -1;order:-1}
  .fj-foot .legal{gap:.5em}
}
.fj.still .mask img{animation:none}
@media (prefers-reduced-motion:reduce){
  .fj-menu nav{clip-path:none!important;opacity:0;transition:opacity .2s linear}
  .fj.menu-open .fj-menu nav{opacity:1}
  .fj-menu .links span,.fj.menu-open .fj-menu .links span{transform:none;transition:opacity .2s linear}
  .fj-menu .div{transform:none}
  .fj-pop .card,.fj-pop.on .card{transform:none}
  .fj-pop .wrap,.fj-dim{transition-duration:.2s}
  .fj .burger i{transition:none}
}
`

/* ───────── small pieces ───────── */

function Img({ p, sizes, eager, className }: { p: Photo; sizes: string; eager?: boolean; className?: string }) {
  return <img className={className} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchpriority: 'high' } : {})} />
}

function Arrow({ left }: { left?: boolean }) {
  return (
    <svg className="arw" viewBox="0 0 15 10" fill="none" aria-hidden="true" style={left ? { transform: 'scaleX(-1)' } : undefined}>
      <line x1="1" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9.5 1 L14 5 L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Logo({ inv }: { inv?: boolean }) {
  return (
    <a href="#efst" className={`logo${inv ? ' inv' : ''}`} aria-label="Fjárfesting fasteignasala, efst á síðu">
      <img src={A('merki.svg')} alt="" width={65} height={76} />
      <span aria-hidden="true" translate="no"><b>FJÁRFESTING</b><small>FASTEIGNASALA EHF</small></span>
    </a>
  )
}

function Burger({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button className="burger" onClick={onClick} aria-label={open ? 'Loka valmynd' : 'Opna valmynd'} aria-expanded={open} aria-controls="fj-menu">
      <i /><i /><i />
    </button>
  )
}

function Mask({ children, as = 'h2', white, id }: { children: ReactNode; as?: 'h2' | 'h1'; white?: boolean; id?: string }) {
  const T = as
  return (
    <div className="mw">
      <T className={`h2${white ? ' white' : ''}`} data-a="mask" id={id}>{children}</T>
    </div>
  )
}

/* Opin hús ticker: drifts one sign every ~4.5s, loops seamlessly over two copies of the row,
 * and hands over to the visitor on hover, focus, drag (0.95 inertia like the rails) or a
 * trackpad swipe, resuming 2.5s after they let go. Only runs while on screen. */
function useTicker() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* look the row up live: React can swap these nodes after mount, and a kept
     * reference then measures 0 wide */
    const row = () => el.querySelector<HTMLElement>('.ln')
    let raf = 0, prev = 0, seen = false, hover = false, down = false, moved = false
    let sx = 0, sl = 0, last = 0, v = 0, idleUntil = 0, pos = 0
    const half = () => row()?.offsetWidth ?? 0
    const wrap = () => {
      const h = half()
      if (!h) return
      if (el.scrollLeft >= h) { el.scrollLeft -= h; sl -= h }
      else if (el.scrollLeft <= 0) { el.scrollLeft += h; sl += h }
      pos = el.scrollLeft
    }
    const hold = () => { idleUntil = performance.now() + 2500 }
    const frame = (t: number) => {
      const dt = prev ? Math.min(t - prev, 64) : 0
      prev = t
      const drift = !down && Math.abs(v) <= 0.5 && !hover && !el.contains(document.activeElement) && t > idleUntil
      if (drift) {
        /* keep the fractional position ourselves: scrollLeft may round, which would stall
         * a sub-pixel step on a 120Hz screen */
        const h = half()
        const n = row()?.querySelectorAll('.sign').length || 1
        pos += (h / n / 4500) * dt
        if (h && pos >= h) pos -= h
        el.scrollLeft = pos
      } else {
        if (!down && Math.abs(v) > 0.5) { el.scrollLeft -= v; v *= 0.95; hold() }
        wrap()
      }
      raf = seen ? requestAnimationFrame(frame) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting
      if (seen && !raf) { prev = 0; pos = el.scrollLeft; raf = requestAnimationFrame(frame) }
    })
    io.observe(el)
    const md = (e: MouseEvent) => { down = true; moved = false; el.classList.add('drag'); sx = last = e.pageX; sl = el.scrollLeft; v = 0 }
    const mm = (e: MouseEvent) => { if (!down) return; e.preventDefault(); if (Math.abs(e.pageX - sx) > 4) moved = true; el.scrollLeft = sl - (e.pageX - sx); v = e.pageX - last; last = e.pageX; wrap() }
    const mu = () => { if (!down) return; down = false; el.classList.remove('drag'); hold() }
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    const enter = () => { hover = true }
    const leave = () => { hover = false; mu() }
    /* trackpad / shift-wheel scrolls natively; just note it so the drift waits */
    const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) { v = 0; hold() } }
    el.scrollLeft = 1
    pos = 1
    el.addEventListener('mousedown', md)
    el.addEventListener('mousemove', mm)
    el.addEventListener('mouseup', mu)
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('click', click, true)
    el.addEventListener('wheel', wheel, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('mousedown', md)
      el.removeEventListener('mousemove', mm)
      el.removeEventListener('mouseup', mu)
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
      el.removeEventListener('click', click, true)
      el.removeEventListener('wheel', wheel)
    }
  }, [])
  return ref
}

/* Wild's rails: native scroll, mouse drag with 0.95 inertia, arrows step 2 cards (1 on phones). */
function useRail() {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ l: true, r: false })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false, sx = 0, sl = 0, last = 0, v = 0, raf = 0, moved = false
    const upd = () => {
      const max = el.scrollWidth - el.clientWidth
      setEdge({ l: el.scrollLeft <= 0, r: el.scrollLeft >= max - 1 })
    }
    const md = (e: MouseEvent) => { down = true; moved = false; el.classList.add('drag'); sx = last = e.pageX; sl = el.scrollLeft; v = 0; cancelAnimationFrame(raf) }
    const mm = (e: MouseEvent) => { if (!down) return; e.preventDefault(); if (Math.abs(e.pageX - sx) > 4) moved = true; el.scrollLeft = sl - (e.pageX - sx); v = e.pageX - last; last = e.pageX }
    const glide = () => { el.scrollLeft -= v; v *= 0.95; if (Math.abs(v) > 0.5) raf = requestAnimationFrame(glide); else upd() }
    const mu = () => { if (!down) return; down = false; el.classList.remove('drag'); glide() }
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    el.addEventListener('scroll', upd, { passive: true })
    el.addEventListener('mousedown', md)
    el.addEventListener('mousemove', mm)
    el.addEventListener('mouseup', mu)
    el.addEventListener('mouseleave', mu)
    el.addEventListener('click', click, true)
    window.addEventListener('resize', upd)
    upd()
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', upd)
      el.removeEventListener('mousedown', md)
      el.removeEventListener('mousemove', mm)
      el.removeEventListener('mouseup', mu)
      el.removeEventListener('mouseleave', mu)
      el.removeEventListener('click', click, true)
      window.removeEventListener('resize', upd)
    }
  }, [])
  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const item = el.querySelector<HTMLElement>('.card2')
    if (!item) return
    const gap = parseFloat(getComputedStyle(el.querySelector('.list')!).columnGap) || 0
    const size = innerWidth >= 767 ? item.offsetWidth * 2 + gap * 2 : item.offsetWidth + gap
    const target = dir > 0 ? Math.ceil((el.scrollLeft + 1) / size) * size : Math.max(0, Math.floor((el.scrollLeft - 1) / size) * size)
    const from = el.scrollLeft, dist = target - from
    const dur = (Math.abs(dist) / (innerWidth < 767 ? 400 : 800)) * 1000
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min((t - t0) / dur, 1)
      el.scrollLeft = from + dist * (1 - Math.pow(1 - k, 4))
      if (k < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  return { ref, edge, step }
}

function RailArrows({ edge, step, label }: { edge: { l: boolean; r: boolean }; step: (d: 1 | -1) => void; label: string }) {
  return (
    <div className="arrows">
      <button onClick={() => step(-1)} disabled={edge.l} aria-label={`Fyrri ${label}`}><Arrow left /></button>
      <button onClick={() => step(1)} disabled={edge.r} aria-label={`Næstu ${label}`}><Arrow /></button>
    </div>
  )
}

/* ───────── the page ───────── */

type Pop = { id: string; n: number; t: string; p: string[] }
const POPS: Pop[] = [
  ...SERVICES.map((s, i) => ({ id: s.id, n: i + 1, t: s.t, p: s.p })),
  ...PROCESS.map((s, i) => ({ id: s.id, n: i + 1, t: s.t, p: s.p })),
]

const NAV = [
  ['stofan', 'Stofan'],
  ['starfsfolk', 'Starfsfólk'],
  ['thjonusta', 'Þjónusta'],
  ['i-solu', 'Í sölu'],
  ['opin-hus', 'Opin hús'],
  ['soluferlid', 'Söluferlið'],
  ['hafa-samband', 'Hafa samband'],
] as const

export default function Page() {
  const [still] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [firstVisit] = useState(() => {
    try { return !sessionStorage.getItem(SEEN) } catch { return true }
  })
  const [loader, setLoader] = useState(!still)
  const [menu, setMenu] = useState(false)
  const [pop, setPop] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const team = useRail()
  const proj = useRail()
  const openTick = useTicker()

  /* head: title, meta, noindex, JSON-LD */
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Fjárfesting fasteignasala | Borgartún 31'
    setThemeColor(M1)
    const a = setMetaDescription(`Fjárfesting fasteignasala í Borgartúni 31. ${LISTING_COUNT} eignir á söluskrá, opin hús í hverri viku og frítt söluverðmat. Sími 562 4250.`)
    const b = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; a(); b(); ld.remove() }
  }, [])

  /* scroll lock while an overlay is open, with scrollbar compensation (Wild js 502) */
  useEffect(() => {
    const open = menu || !!pop
    const html = document.documentElement
    if (open) {
      const sb = innerWidth - html.clientWidth
      html.style.paddingRight = sb ? `${sb}px` : ''
      html.style.overflow = 'hidden'
      pageLenis?.stop()
    } else {
      html.style.paddingRight = ''
      if (!loader) { html.style.overflow = ''; pageLenis?.start() }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); setPop(null) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu, pop, loader])

  /* the loader timeline (MOTION §1): draw the mark, shrink the card, blur into the page */
  useEffect(() => {
    if (still) return
    const el = root.current
    if (!el) return
    const html = document.documentElement
    const L = el.querySelector<HTMLElement>('.fj-loader')
    const blur = el.querySelector<HTMLElement>('.fj-blur')
    const heads = el.querySelectorAll<HTMLElement>('.hero-head')
    const arrow = el.querySelector<HTMLElement>('.fj-hero .arrow')
    if (!L || !blur) return
    const long = firstVisit && window.self === window.top
    html.style.overflow = 'hidden'
    const tl = gsap.timeline({
      onComplete: () => {
        html.style.overflow = ''
        try { sessionStorage.setItem(SEEN, '1') } catch { /* private mode */ }
        arrow?.classList.add('loop')
        pageLenis?.start()
        setLoader(false)
      },
    })
    const slogan = el.querySelector<HTMLElement>('.hero-slogan')
    const entrance = [...heads, arrow].filter(Boolean) as HTMLElement[]
    if (slogan) { gsap.set(slogan, { opacity: 0, yPercent: 3 }); entrance.push(slogan) }
    gsap.set(heads, { yPercent: -50, opacity: 0 })
    if (arrow) gsap.set(arrow, { yPercent: 50, opacity: 0 })
    if (long) {
      const paths = L.querySelectorAll('path')
      const words = L.querySelectorAll('.word .l > span')
      tl.to(paths, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 0.3)
        .to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.7, ease: OUT }, 2.9)
        .fromTo(words, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 0.8, ease: OUT, stagger: 0.12 }, 3.3)
        .to(L, { opacity: 0, duration: 0.6, ease: OUT }, 5.0)
        .to(blur, { opacity: 0, duration: 0.6, ease: OUT }, 5.2)
        .to(entrance, { yPercent: 0, opacity: 1, duration: 0.6, ease: OUT }, 5.3)
        .set({}, {}, 5.9)
    } else {
      L.classList.add('quick')
      L.querySelector('.mark')?.setAttribute('hidden', '')
      tl.to(L, { opacity: 0, duration: 0.5, ease: OUT }, 0)
        .to(blur, { opacity: 0, duration: 0.4, ease: OUT }, 0.2)
        .to(entrance, { yPercent: 0, opacity: 1, duration: 0.6, ease: OUT }, 0.3)
        .set({}, {}, 0.9)
    }
    return () => { tl.kill(); html.style.overflow = '' }
  }, [still, firstVisit])

  /* scroll choreography (MOTION §2–9) */
  useEffect(() => {
    if (still) return
    const el = root.current
    if (!el) return
    let tick: ((t: number) => void) | null = null
    const noLenis = new URLSearchParams(location.search).has('nolenis')
    /* never a JS scroll surface on a phone: Safari only collapses its toolbar for a native scroll */
    const lenis = !isTouch() && !noLenis ? new Lenis({ lerp: 0.1, smoothWheel: true }) : null
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      pageLenis = lenis
      if (el.querySelector('.fj-loader')) lenis.stop()
    }
    const ctx = gsap.context(() => {
      const hero = el.querySelector<HTMLElement>('.fj-hero')!
      const stage = el.querySelector<HTMLElement>('.fj-hero .stage')!
      const mask = el.querySelector<HTMLElement>('.fj-hero .mask')!
      const content = el.querySelector<HTMLElement>('.fj-hero .content')!
      const h1 = content.querySelector<HTMLElement>('.h1')!
      const heroP = content.querySelector<HTMLElement>('.p')
      const heroBtn = content.querySelector<HTMLElement>('.btn')
      const arrow = el.querySelector<HTMLElement>('.fj-hero .arrow')
      const sticky = el.querySelector<HTMLElement>('.fj-sticky')!
      const desk = window.matchMedia('(min-width: 768px)')

      /* hero: the picture dissolves bottom-first into the maroon as the H1 arrives */
      ScrollTrigger.create({
        trigger: content, start: 'top bottom', end: 'bottom bottom', scrub: true,
        onUpdate: (s) => {
          mask.style.setProperty('--bot', String(1 - Math.min(s.progress * 2, 1)))
          mask.style.setProperty('--top', String(1 - s.progress))
        },
        onEnter: () => { if (arrow) gsap.to(arrow, { opacity: 0, duration: 0.15, ease: OUT }) },
        onLeaveBack: () => { if (arrow) gsap.to(arrow, { opacity: 1, duration: 0.15, ease: OUT }); reset() },
      })

      /* hero H1: SplitText lines behind masks, Wild's timing */
      let played = false
      let tl: gsap.core.Timeline | null = null
      const split = SplitText.create(h1, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (self) => { gsap.set(self.lines, played ? { yPercent: 0, opacity: 1 } : { yPercent: 100, opacity: 0 }) },
      })
      gsap.set([heroP, heroBtn], { opacity: 0 })
      const reset = () => {
        played = false
        tl?.kill()
        gsap.set(split.lines, { yPercent: 100, opacity: 0 })
        gsap.set([heroP, heroBtn], { opacity: 0 })
      }
      ScrollTrigger.create({
        trigger: h1, start: 'bottom 95%',
        onEnter: () => {
          played = true
          tl = gsap.timeline()
            .to(split.lines, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: OUT })
            .to(heroP, { opacity: 1, duration: 0.6, ease: OUT }, '>-0.3')
            .to(heroBtn, { opacity: 1, duration: 0.6, ease: OUT }, '>-0.5')
        },
      })

      /* sticky header after the hero; any scroll shows it, 2s idle hides it (desktop only) */
      let past = false, hovered = false, idle = 0
      const hideLater = () => { clearTimeout(idle); if (!hovered) idle = window.setTimeout(() => past && desk.matches && sticky.classList.remove('on'), 2000) }
      ScrollTrigger.create({
        trigger: hero, start: 'bottom top',
        onEnter: () => { past = true; stage.classList.add('gone'); sticky.classList.add('on'); hideLater() },
        onLeaveBack: () => { past = false; stage.classList.remove('gone'); sticky.classList.remove('on'); clearTimeout(idle) },
      })
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => { if (past) { sticky.classList.add('on'); hideLater() } } })
      const enter = () => { if (!past) return; hovered = true; clearTimeout(idle); sticky.classList.add('on') }
      const leave = () => { if (!past) return; hovered = false; hideLater() }
      if (window.matchMedia('(hover: hover)').matches) {
        sticky.addEventListener('mouseenter', enter)
        sticky.addEventListener('mouseleave', leave)
      }

      /* section heads: the masked rise, scrubbed over a short band from Wild's "top 85%" */
      gsap.utils.toArray<HTMLElement>('[data-a="mask"]').forEach((h) => {
        gsap.fromTo(h, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: h.parentElement, start: 'top 85%', end: 'top 65%', scrub: 0.4 } })
      })
      gsap.utils.toArray<HTMLElement>('[data-a="fade"]').forEach((g) => {
        const kids = g.querySelectorAll<HTMLElement>(':scope > *')
        gsap.fromTo(kids, { opacity: 0 }, { opacity: 1, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: g, start: 'top 85%', end: 'top 55%', scrub: 0.4 } })
      })
      /* rate card: each figure rises in its mask (above), label and note follow it */
      gsap.utils.toArray<HTMLElement>('[data-a="rate"]').forEach((r) => {
        gsap.fromTo(r.querySelectorAll('.h4, .p'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: r, start: 'top 85%', end: 'top 62%', scrub: 0.4 } })
      })
      /* services index: rows arrive one after another as the list enters */
      gsap.utils.toArray<HTMLElement>('[data-a="rows"]').forEach((l) => {
        gsap.fromTo(l.children, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: l, start: 'top 85%', end: 'bottom 75%', scrub: 0.4 } })
      })
      /* process: the line draws through the three stations */
      const line = el.querySelector<HTMLElement>('.fj-proc .line i')
      const steps = el.querySelectorAll<HTMLElement>('.fj-proc .step')
      if (line) {
        const vertical = () => window.matchMedia('(max-width: 767px)').matches
        const v = vertical()
        gsap.fromTo(line, v ? { scaleY: 0 } : { scaleX: 0 }, { ...(v ? { scaleY: 1 } : { scaleX: 1 }), ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 80%', end: v ? 'bottom 55%' : 'top 45%', scrub: 0.4 } })
        gsap.fromTo(steps, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.25, ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 85%', end: 'top 45%', scrub: 0.4 } })
      }

      /* slogan: the photo drifts at half speed, the ticker runs only in range */
      const pw = el.querySelector<HTMLElement>('.fj-slogan .pw')!
      const pic = pw.querySelector<HTMLElement>('img')!
      gsap.fromTo(pic, { y: 0 }, { y: () => pic.offsetHeight - pw.offsetHeight, ease: 'none', scrollTrigger: { trigger: pw, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
      const tick = el.querySelector<HTMLElement>('.fj-slogan .tick')!
      ScrollTrigger.create({ trigger: tick, start: 'top bottom', end: 'bottom top', toggleClass: { targets: tick, className: 'run' } })

      /* the full-bleed Naustavör frame settles once when 55% in, like Wild's contact film */
      const full = el.querySelector<HTMLElement>('.fj-full img')!
      ScrollTrigger.create({
        trigger: full, start: '55% bottom', end: 'bottom top',
        onEnter: () => gsap.fromTo(full, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power3.out' }),
        onEnterBack: () => gsap.fromTo(full, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power3.out' }),
        onLeave: () => gsap.set(full, { scale: 1.12 }),
      })

      return () => {
        clearTimeout(idle)
        sticky.removeEventListener('mouseenter', enter)
        sticky.removeEventListener('mouseleave', leave)
        split.revert()
      }
    }, el)
    return () => {
      ctx.revert()
      if (tick) gsap.ticker.remove(tick)
      pageLenis?.destroy()
      pageLenis = null
    }
  }, [still])

  /* the footer name spans exactly the content width, whatever the gutter */
  useEffect(() => {
    const w = root.current?.querySelector<HTMLElement>('.fj-foot .word')
    const box = w?.parentElement
    if (!w || !box) return
    const fit = () => {
      const cs = getComputedStyle(box)
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      w.style.fontSize = '100px'
      w.style.fontSize = `${(100 * avail) / w.scrollWidth}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const openPop = (id: string) => { setMenu(false); setPop(id) }
  const go = (id: string) => () => { setMenu(false); setPop(null); requestAnimationFrame(() => { const t = document.getElementById(id); if (!t) return; if (pageLenis) { pageLenis.start(); pageLenis.scrollTo(t, { offset: -8 }) } else t.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }) }) }
  const current = POPS.find((p) => p.id === pop)

  const OpenTile = ({ o, tab }: { o: (typeof OPEN_HOUSES)[number]; tab?: boolean }) => (
    <a className="sign" href={o.href} target="_blank" rel="noopener" tabIndex={tab === false ? -1 : undefined} aria-label={`Opið hús ${o.day}, ${o.time}, ${o.street}, ${o.town}`}>
      <span className="bar"><span>Opið hús</span><span>{o.wd}</span></span>
      <span className="bd"><span className="dd">{o.dd}</span><span className="mo">sept.</span><span className="tm">{o.time}</span></span>
      <span className="ad">{o.street}, {o.town}</span>
      <span className="me">{o.size} m², {o.rooms} herb.<b>{o.price}</b></span>
      <span className="ph"><img src={o.img} alt="" loading="lazy" width={600} height={332} /></span>
    </a>
  )

  return (
    <div ref={root} className={`fj${menu ? ' menu-open' : ''}${pop ? ' pop-open' : ''}${still ? ' still' : ''}`} id="efst">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#stofan">Fara í efni</a>

      {loader && (
        <>
          <div className="fj-loader" aria-hidden="true">
            <div className="card" />
            <div className="mark">
              <svg viewBox="0 0 650 760">
                <g transform="translate(0 760) scale(.1 -.1)">
                  <path d={MARK_PATH} pathLength={1} fillRule="evenodd" />
                </g>
              </svg>
              <div className="word"><span className="l"><span>FJÁRFESTING</span></span><span className="l"><span>FASTEIGNASALA EHF</span></span></div>
            </div>
          </div>
          <div className="fj-blur" aria-hidden="true" />
        </>
      )}

      <div className="fj-awning" aria-hidden="true" />

      <header className="fj-sticky">
        <div className="row">
          <Logo />
          <div className="menu-btns">
            <a className="call" href={`tel:${CONTACT.tel}`}><small>Sími</small><b>{CONTACT.phone}</b></a>
            <Burger open={menu} onClick={() => setMenu((m) => !m)} />
          </div>
        </div>
      </header>

      <div className="fj-dim" aria-hidden="true" />

      <div className="fj-menu" id="fj-menu" aria-hidden={!menu} {...(!menu ? { inert: '' } : {})}>
        <div className="wrap" data-lenis-prevent onClick={(e) => { if (e.target === e.currentTarget) setMenu(false) }}>
          <nav aria-label="Valmynd">
            <div className="mh">
              <Logo />
              <button className="x" onClick={() => setMenu(false)} aria-label="Loka valmynd"><i /><i /></button>
              <span className="div" />
            </div>
            <div className="links">
              {NAV.map(([id, label], i) => (
                <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id)() }}>
                  <span data-t={label} style={{ '--i': i } as CSSProperties}>{label}</span>
                </a>
              ))}
            </div>
            <div className="soc">
              <a href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
            </div>
          </nav>
        </div>
      </div>

      {POPS.map((p) => (
        <div key={p.id} className={`fj-pop${pop === p.id ? ' on' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`pop-${p.id}`} aria-hidden={pop !== p.id} {...(pop !== p.id ? { inert: '' } : {})}>
          <div className="wrap" data-lenis-prevent onClick={(e) => { if (!(e.target as HTMLElement).closest('.card')) setPop(null) }}>
            <div className="grid">
              <div className="card">
                <div className="close"><button className="x" onClick={() => setPop(null)} aria-label="Loka"><i /><i /></button></div>
                <div className="body">
                  <div className="head">
                    <span className="num">{p.n}</span>
                    <h2 className="h2" id={`pop-${p.id}`}>{p.t}.</h2>
                  </div>
                  <div className="ps">{p.p.map((t) => <p className="p" key={t}>{t}</p>)}</div>
                  <button className="btn grad" onClick={go('hafa-samband')}>Hafa samband</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <span className="sr" aria-live="polite">{current ? `${current.t} opið` : ''}</span>

      <main>
        {/* HERO */}
        <section className="fj-hero" aria-label="Forsíða">
          <div className="stage">
            <div className="mask">
              <Img p={IMG.hero} sizes="100vw" eager />
              <div className="shade" />
            </div>
          </div>
          <div className="els">
            <div className="head-wrap">
              <div className="hero-head">
                <Logo inv />
                <div className="menu-btns">
                  <a className="call inv" href={`tel:${CONTACT.tel}`}><small>Sími</small><b>{CONTACT.phone}</b></a>
                  <span style={{ color: PAPER }}><Burger open={menu} onClick={() => setMenu((m) => !m)} /></span>
                </div>
              </div>
            </div>
            <p className="h1 hero-slogan"><span><em>Rétta</em> verðið,</span> <span><em>rétti</em> kaupandinn.</span></p>
            <div className="arrow">
              <a href="#stofan" aria-label="Áfram að Stofunni">
                <svg viewBox="0 0 10 36" fill="none" aria-hidden="true"><line x1="5" y1="1" x2="5" y2="34" stroke="currentColor" strokeWidth="1.5" /><path d="M1 30 L5 34.5 L9 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </div>
          <div className="content">
            <div className="h1wrap">
              <h1 className="h1"><em>Eignir</em> til sölu og <em>frítt</em> söluverðmat, í <em>Borgartúni</em> 31.</h1>
              <p className="p">Tíu manna fasteignasala með {LISTING_COUNT} eignir á söluskrá, frá Reykjavík og Kópavogi til Keflavíkur og Borgarness.</p>
            </div>
            <button className="btn" onClick={go('i-solu')}>Eignir í sölu <span className="n">{LISTING_COUNT}</span></button>
          </div>
          <span className="corner l" aria-hidden="true" /><span className="corner r" aria-hidden="true" />
        </section>

        {/* STOFAN / GJALDSKRÁIN (Wild: Portrait. / Werte.) */}
        <section className="sheet gridsec fj-about" id="stofan" aria-labelledby="h-stofan">
          <div className="stack">
            <Mask id="h-stofan">Stofan.</Mask>
            <div className="ps" data-a="fade">
              <p className="p">Fjárfesting fasteignasala ehf. er til húsa í Borgartúni 31. Þar starfa tíu manns, þar af átta löggiltir fasteignasalar.</p>
              <p className="p">Stofan selur íbúðir, raðhús, einbýli, sumarhús, atvinnuhúsnæði og lóðir, og sér um verðmat, leigusamninga og skjalagerð.</p>
              <p className="p">Söluþóknun er umsemjanleg og byggir á mati á markaðssvæði, seljanleika og nánara samkomulagi.</p>
            </div>
          </div>
          <figure className="pa" style={{ margin: 0 }}>
            <div className="pic" style={{ height: '100%' }}><Img p={IMG.loft} sizes="(max-width: 767px) 92vw, 40vw" /></div>
          </figure>
          <div className="pbw"><div className="pic pb"><Img p={IMG.stofa} sizes="(max-width: 767px) 92vw, 40vw" /></div></div>
          <div className="stack">
            <Mask>Gjaldskráin.</Mask>
            <div className="rates">
              {TARIFF.map((v) => (
                <div className="rate" key={v.t} data-a="rate">
                  <span className="mw"><span className="fig" data-a="mask">{v.fig}</span></span>
                  <h3 className="h4">{v.t}</h3>
                  <p className="p">{v.p}</p>
                </div>
              ))}
            </div>
            <p className="note">Þóknunarfjárhæðir eru án 24% vsk nema annað sé tekið fram.</p>
          </div>
        </section>

        {/* STARFSFÓLK (Wild: Team.) */}
        <section className="sheet fj-team" id="starfsfolk" aria-labelledby="h-team">
          <div className="rowhead">
            <div className="hcol"><Mask id="h-team">Starfsfólk.</Mask>
            <p className="aside">Átta löggiltir fasteignasalar, ráðgjafi og aðstoðarmaður. Beinn sími hjá hverjum og einum.</p></div>
            <RailArrows edge={team.edge} step={team.step} label="starfsmenn" />
          </div>
          <div className="rail" ref={team.ref}>
            <div className="list">
              <span className="pad" aria-hidden="true" />
              {STAFF.map((s) => (
                <article className="person card2" key={s.key}>
                  <div className="ph"><Img p={s.img} sizes="(max-width: 479px) 85vw, (max-width: 767px) 45vw, 20vw" /></div>
                  <div>
                    <h3 className="nm">{s.name}</h3>
                    <p className="ro">{s.title}</p>
                    <a className="tl" href={`tel:${s.tel}`} aria-label={`Hringja í ${s.name}, ${s.phone}`}>{s.phone}</a>
                  </div>
                </article>
              ))}
              <span className="pad" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* SLOGAN */}
        <section className="sheet fj-slogan" aria-label="Fjárfesting fasteignasala, sími 562 4250">
          <div className="pw"><Img p={IMG.dagur} sizes="100vw" /></div>
          <div className="band">
            <div className="tick" aria-hidden="true">
              {[0, 1].map((k) => (
                <div className="ln" key={k}><p className="disp" translate="no">Fjárfesting <em>fasteignasala</em><span className="mk" />sími <em>562 4250</em><span className="mk" /></p></div>
              ))}
            </div>
          </div>
        </section>

        {/* ÞJÓNUSTA (Wild: Kompetenzen.) */}
        <section className="sheet gridsec fj-serv" id="thjonusta" aria-labelledby="h-serv">
          <div className="pic pa"><Img p={IMG.eldhus} sizes="(max-width: 767px) 92vw, 40vw" /></div>
          <div className="stack txt">
            <Mask id="h-serv">Þjónusta.</Mask>
            <div className="ps" data-a="fade">
              <p className="p">Fjárfesting annast sölu fasteigna og skráðra skipa, sölu sumarhúsa og fyrirtækja, leigu og skjalagerð.</p>
              <p className="p">Söluverðmat er frítt. Löggiltur fasteignasali veitir ráðgjöf á tímagjaldi, 35.000 kr.</p>
            </div>
          </div>
          <div className="idx" data-a="rows">
            {SERVICES.map((s) => (
              <button className="row" key={s.id} onClick={() => openPop(s.id)} aria-haspopup="dialog">
                <span className="t">{s.t}</span><span className="f">{s.fig}</span><span className="plus" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="pbw"><div className="pic pb"><Img p={IMG.utsyni} sizes="(max-width: 767px) 92vw, 40vw" /></div></div>
        </section>

        {/* Í SÖLU (Wild: Projekte.) */}
        <section className="sheet fj-proj" id="i-solu" aria-labelledby="h-proj">
          <div className="rowhead">
            <div className="hcol"><Mask id="h-proj">Í sölu.</Mask>
            <p className="aside">Fimm verkefni með {DEVELOPMENTS.reduce((n, d) => n + d.count, 0)} eignir af {LISTING_COUNT} á söluskrá.</p></div>
            <RailArrows edge={proj.edge} step={proj.step} label="verkefni" />
          </div>
          <div className="rail" ref={proj.ref}>
            <div className="list">
              <span className="pad" aria-hidden="true" />
              {DEVELOPMENTS.map((d) => (
                <a className="dev card2" key={d.key} href={CONTACT.soluskra} target="_blank" rel="noopener">
                  <div className="ph"><Img p={d.img} sizes="(max-width: 767px) 88vw, 42vw" /></div>
                  <div className="hd"><h3 className="nm">{d.name}</h3><span className="tw">{d.town}</span></div>
                  <div className="sp">
                    <span className="ct">{d.count}</span>
                    <span className="ln2"><b>{d.kind}</b><span>{d.size}</span><span>{d.price}</span></span>
                  </div>
                  <span className="go">Skoða á söluskrá</span>
                </a>
              ))}
              <span className="pad" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* OPIN HÚS (Wild: Partner.) */}
        <section className={`sheet fj-open${still ? ' still' : ''}`} id="opin-hus" aria-labelledby="h-open">
          <div className="rowhead">
            <div className="hcol"><Mask id="h-open">Opin hús.</Mask>
            <p className="aside">{OPEN_HOUSES.length} opin hús dagana 23. til 25. september. Tími og staður við hverja eign.</p></div>
          </div>
          <div className="tick" ref={openTick}>
            {[0, 1].map((k) => (
              <div className="ln" key={k} aria-hidden={k === 1 ? true : undefined}>
                <div className="row">{OPEN_HOUSES.map((o) => <OpenTile key={o.id} o={o} tab={k === 1 ? false : undefined} />)}</div>
              </div>
            ))}
          </div>
          <div className="touch rail">
            <div className="list">
              <span className="pad" aria-hidden="true" />
              {OPEN_HOUSES.map((o) => <OpenTile key={o.id} o={o} />)}
              <span className="pad" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* SÖLUFERLIÐ (Wild: Prozesse.) */}
        <section className="sheet fj-proc" id="soluferlid" aria-labelledby="h-proc">
          <div className="top">
            <Mask white id="h-proc">Söluferlið.</Mask>
            <div className="ps" data-a="fade">
              <p className="p">Frá verðmati til kaupsamnings, með gjöldunum eins og þau standa í gjaldskránni.</p>
            </div>
          </div>
          <div className="steps">
            <span className="line" aria-hidden="true"><i /></span>
            {PROCESS.map((s, i) => (
              <button className="step" key={s.id} onClick={() => openPop(s.id)} aria-haspopup="dialog">
                <span className="no" aria-hidden="true">{i + 1}</span>
                <span className="t">{s.t}</span>
                <span className="f">{s.fig}</span>
                <span className="fl">{s.figLab}</span>
                <span className="more">Nánar <span className="plus" aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </section>

        {/* FULL-BLEED */}
        <div className="sheet fj-full"><div className="fr"><Img p={IMG.kvold} sizes="100vw" /></div></div>

        {/* HAFA SAMBAND */}
        <section className="sheet fj-contact" id="hafa-samband" aria-labelledby="h-contact">
          <div className="form">
            {sent ? (
              <p className="done" role="status">Þetta er frumgerð, svo fyrirspurnin var ekki send. Hringdu í {CONTACT.phone} eða skrifaðu á {CONTACT.email}.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
                <div className="fields">
                  <div className="fl"><label htmlFor="fj-n">Nafn</label><input id="fj-n" name="nafn" autoComplete="name" required /></div>
                  <div className="fl"><label htmlFor="fj-s">Sími</label><input id="fj-s" name="simi" type="tel" autoComplete="tel" placeholder="000 0000" /></div>
                  <div className="fl w"><label htmlFor="fj-e">Netfang</label><input id="fj-e" name="netfang" type="email" autoComplete="email" spellCheck={false} placeholder="nafn@dæmi.is" required /></div>
                  <div className="fl w"><label htmlFor="fj-m">Fyrirspurn</label><textarea id="fj-m" name="skilabod" placeholder="Til dæmis: verðmat á íbúð í 105…" required /></div>
                </div>
                <button className="btn grad" type="submit">Senda fyrirspurn</button>
              </form>
            )}
          </div>
          <div className="info">
            <div className="stack">
              <Mask id="h-contact">Hafa samband.</Mask>
              <div data-a="fade">
                <p className="p">Söluverðmat er frítt. Hringdu í stofuna:</p>
                <a className="big" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
                <a className="mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <dl className="addr">
                  <dt>Stofan</dt><dd>{CONTACT.street}, {CONTACT.town}</dd>
                  <dt>Söluskrá</dt><dd><a className="mail" href={CONTACT.soluskra} target="_blank" rel="noopener">{LISTING_COUNT} eignir</a></dd>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fj-foot">
        <div className="cols">
          <div><h4>Stofan</h4><ul><li>{CONTACT.legal}</li><li>{CONTACT.street}</li><li>{CONTACT.town}</li></ul></div>
          <div><h4>Samband</h4><ul><li><a href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a></li><li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li><li><a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a></li></ul></div>
          <div><h4>Á síðunni</h4><ul>{NAV.slice(1, 6).map(([id, label]) => <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id)() }}>{label}</a></li>)}</ul></div>
          <div><h4>Skráning</h4><ul><li>kt. {CONTACT.kt}</li><li>vsknr. {CONTACT.vsk}</li><li>Aðili að Félagi fasteignasala</li></ul></div>
        </div>
        <span className="word" aria-hidden="true" translate="no">Fjárfesting</span>
        <div className="legal">
          <span>© {YEAR} {CONTACT.legal}</span>
          <span>Designed by{' '}
            <a className="sndr" href="https://sndrstudio.is" target="_blank" rel="noopener" aria-label="Designed by SNDR Studio" data-logotype>
              SN<i>✦</i>DR <small>STUDIO</small>
            </a>
          </span>
        </div>
        <p className="proto">Frumgerð: hugmynd að nýrri forsíðu, ekki vefur fasteignasölunnar. Myndir, starfsfólk, verð, eignir og opin hús eru af fjarfesting.is, sótt 22. september 2026.</p>
      </footer>
    </div>
  )
}
