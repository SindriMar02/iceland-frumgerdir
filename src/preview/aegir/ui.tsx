import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTACT } from './data'

/* ── SEGLAGERÐIN ÆGIR · "HÖNNUM OG SAUMUM ÞAÐ SEM ÞÉR HENTAR" ────────────
   The HBH Byggir build (driessenarchitectuur.nl system, devices D1–D18 in
   _reference/driessen-teardown) re-aimed at Seglagerðin Ægir ehf. Every
   mechanism is kept exactly as measured and gated for HBH; only the content
   and the brand layer change.

   Brand layer: the colour is the blue of their own sail mark (#0070B0), the
   dark bands are the deep water of the harbour behind it, and the line field
   is the seams of a sail: the same fan of converging panel lines their logo
   draws, instead of HBH's wood grain.

   Declared deviations from the reference, inherited from HBH: no Lenis (the
   mobile gate forbids a JS scroll surface), no film, the slider carries their
   own published lines because they publish no testimonials, and reduced
   motion, focus rings, one h1 and a 15px type floor are added. New here: the
   header has one grouped dropdown (Þjónusta), and the page carries three
   working tools built from their own published prices (a tent-hire builder,
   an awning price finder, a before/after) feeding one request form.
   ──────────────────────────────────────────────────────────────────────── */

export const C = {
  blue: '#0070B0',
  blueDeep: '#0A2A43',
  ink: '#121417',
  paper: '#EFEDE9',
  white: '#FFFFFF',
  seam: '#0070B0',
  hairline: 'rgba(18,20,23,.12)',
}

const B = import.meta.env.BASE_URL

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ── the system stylesheet ─────────────────────────────────────────────── */
export const CSS = `
@font-face{font-family:'AegSans';src:url('${B}fonts/general-sans/GeneralSans-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'AegSans';src:url('${B}fonts/general-sans/GeneralSans-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'AegSans';src:url('${B}fonts/general-sans/GeneralSans-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}

/* the phone's status and home-indicator strips sample html/body (mobile gate) */
html:has(.aeg-root), body:has(.aeg-root){background-color:${C.paper}}

.aeg-root{
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
  font-family:'AegSans',system-ui,sans-serif; font-weight:500;
  font-size:var(--t-body); line-height:1.6; letter-spacing:-0.01em;
  -webkit-font-smoothing:antialiased; overflow-x:clip;
}
@media (max-width:1080px){.aeg-root{--gut:5.556vw;--band:11.111vw;--rad:0.37vw;--rise:1.852vw;--col:1.852vw;
  --t-body:clamp(15px,1.389vw,17px); --t-lead:clamp(16px,1.574vw,18px); --t-label:clamp(11px,1.204vw,13px); --t-tag:clamp(11px,1.111vw,12px)}}
@media (max-width:580px){.aeg-root{--gut:6.897vw;--band:20.69vw;--rad:0.69vw;--rise:3.448vw;--col:3.448vw;
  --t-big:clamp(32px,11.724vw,44px); --t-normal:clamp(22px,6.207vw,26px); --t-small:clamp(20px,5.517vw,23px);
  --t-smaller:clamp(17px,4.138vw,19px); --t-num:clamp(32px,10.69vw,42px); --t-label:clamp(12px,3.103vw,13px); --t-tag:clamp(11px,2.759vw,12px)}}

.aeg-root *{box-sizing:border-box;margin:0;padding:0}
.aeg-root a,.aeg-root button{touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,112,176,.18)}
.aeg-root [id]{scroll-margin-top:calc(var(--band) / 2 + 5vw)}
@media (max-width:580px){.aeg-root [id]{scroll-margin-top:calc(var(--band) / 2 + 17vw)}}
.aeg-skip{position:absolute;left:-9999px;top:0;z-index:70;background:#fff;color:${C.ink};padding:.8em 1.2em;border-radius:var(--rad);font-weight:600}
.aeg-skip:focus{left:1rem;top:1rem}
.aeg-root img{display:block;width:100%;height:100%;object-fit:cover}
.aeg-root a{color:inherit;text-decoration:none}
.aeg-root ::selection{background:${C.blue};color:#fff}
.aeg-root :focus-visible{outline:2px solid ${C.blue};outline-offset:3px;border-radius:2px}
/* over the photographic hero and the dark band the blue ring has too little
   contrast, so the ring goes white there */
.aeg-head.light:not(.scrolled):not(.menuopen) :focus-visible,.aeg-band.dark :focus-visible,
.aeg-hero :focus-visible,.aeg-vhero :focus-visible,.aeg-quote :focus-visible,.aeg-menu :focus-visible{outline-color:#fff}

/* ── layout primitives ──────────────────────────────────────────────── */
.aeg-wrap{width:100%;padding:0 var(--gut);margin:0 auto}
.aeg-wrap.small{padding:0 20.625vw}
@media (max-width:1080px){.aeg-wrap.small{padding:0 11.111vw}}
@media (max-width:580px){.aeg-wrap.small{padding:0 var(--gut)}}
.aeg-band{padding:var(--band) 0;background:transparent}
.aeg-band.paper{background:${C.paper}}
.aeg-band.white{background:${C.white}}
.aeg-band.dark{background:${C.blueDeep};color:#fff}
.aeg-band.flush{padding:0}
.aeg-band section{margin:var(--band) 0}
.aeg-band section:first-child{margin-top:0}
.aeg-band section:last-child{margin-bottom:0}

/* ── type ───────────────────────────────────────────────────────────── */
.aeg-big{font-size:var(--t-big);line-height:1.02;font-weight:500;letter-spacing:-0.03em;overflow-wrap:normal;hyphens:none;text-wrap:balance}
.aeg-normal{font-size:var(--t-normal);line-height:1.12;font-weight:500;letter-spacing:-0.025em;overflow-wrap:normal;text-wrap:pretty}
.aeg-smallt{font-size:var(--t-small);line-height:1.12;font-weight:500;letter-spacing:-0.02em}
.aeg-smallert{font-size:var(--t-smaller);line-height:1.15;font-weight:500;letter-spacing:-0.015em}
.aeg-num{font-size:var(--t-num);line-height:1;font-weight:400;font-variant-numeric:tabular-nums;white-space:nowrap;display:inline-block}
.aeg-num sup{font-size:0.71em;font-weight:500;vertical-align:top;margin-left:0.04em;line-height:1}
.aeg-lead{font-size:var(--t-lead);line-height:1.45}
.aeg-label{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;line-height:1.2;display:flex;align-items:center;gap:0.7em}
.aeg-tag{font-size:var(--t-tag);border:1px solid rgba(18,20,23,.3);border-radius:var(--rad);padding:0.18em 0.6em 0.28em;color:rgba(18,20,23,.72);white-space:nowrap}
.aeg-band.dark .aeg-tag,.aeg-hero .aeg-tag,.aeg-vhero .aeg-tag{border-color:rgba(255,255,255,.45);color:rgba(255,255,255,.88)}

/* the label dot draws itself in, as on the reference */
.aeg-dot{width:1.05em;height:1.05em;flex:none;display:block}
.aeg-dot circle{fill:none;stroke:${C.blue};stroke-width:5;transform:rotate(-90deg);transform-origin:50% 50%;
  stroke-dasharray:28.27;stroke-dashoffset:28.27;transition:stroke-dashoffset .9s .3s ease-out}
.aeg-band.dark .aeg-dot circle{stroke:#fff}
.inview .aeg-dot circle{stroke-dashoffset:0}

/* ── reveals: 1.25vw rise + fade, .45s, .15s ladder ─────────────────── */
.aeg-rise{transform:translateY(var(--rise));opacity:0;transition:transform .45s var(--d,0s) ease-out,opacity .45s var(--d,0s) ease-out}
.inview .aeg-rise,.aeg-rise.inview{transform:translateY(0);opacity:1}
.aeg-word{display:inline-block;transform:translateY(var(--rise));opacity:0;
  transition:transform .45s var(--d,0s) cubic-bezier(.33,1,.68,1),opacity .45s var(--d,0s) ease-out}
.inview .aeg-word{transform:translateY(0);opacity:1}

/* ── media: parallax box, scrub overlay ─────────────────────────────── */
.aeg-media{position:relative;overflow:hidden;border-radius:var(--rad);background:#d8d4cf}
.aeg-media .inner{position:absolute;inset:-8% 0;height:116%;will-change:transform}
.aeg-media .scrim{position:absolute;inset:0;background:${C.ink};opacity:0;z-index:2;pointer-events:none}
.aeg-media figcaption{position:absolute;inset:auto 0 0 0;padding:0.6em 0.8em;font-size:var(--t-tag);color:#fff;
  background:linear-gradient(to top,rgba(10,42,67,.72),transparent);z-index:3}

/* ── buttons: label slides right, arrow swaps (.3s) ─────────────────── */
.aeg-btn{position:relative;display:inline-block;overflow:hidden;cursor:pointer;
  border:1px solid ${C.ink};border-radius:var(--rad);background:${C.ink};color:#fff;
  font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;
  min-width:clamp(180px,13.75vw,220px);transition:background .3s,color .3s,border-color .3s}
/* the label slides with a transform; animating its padding ran layout on every
   hover frame for the same visual result */
.aeg-btn .lab{display:block;padding:0.95em 1.2em 1em;padding-right:3.2em;transition:transform .3s cubic-bezier(0.32,0.72,0,1)}
.aeg-btn .arw{position:absolute;top:50%;width:3.2em;text-align:center;transition:transform .3s,opacity .3s;line-height:0}
.aeg-btn .arw.r{right:0;transform:translate(0,-50%);opacity:1}
.aeg-btn .arw.l{left:0;transform:translate(-100%,-50%);opacity:0}
.aeg-btn.ghost{background:transparent;color:${C.ink};border-color:${C.ink}}
.aeg-btn.light{background:#fff;color:${C.ink};border-color:#fff}
.aeg-btn.brand{background:${C.blue};border-color:${C.blue};color:#fff}
.aeg-arrowbtn{width:clamp(44px,3.5625vw,58px);height:clamp(44px,3.5625vw,58px);border:1px solid currentColor;
  border-radius:var(--rad);background:transparent;color:inherit;cursor:pointer;position:relative;overflow:hidden;
  display:grid;place-items:center;transition:background .3s,color .3s}
.aeg-arrowbtn:disabled{opacity:.3;cursor:default}
.aeg-arrowbtn:disabled:hover{background:transparent;color:inherit;border-color:currentColor}

/* ── the line field: sail seams that draw themselves and never settle ─── */
.aeg-lines{position:absolute;left:0;right:0;pointer-events:none;z-index:0}
.aeg-lines svg{display:block;width:100%;height:auto}
.aeg-lines path{fill:none;stroke:${C.seam};stroke-width:1;opacity:.28;
  stroke-dasharray:var(--len);stroke-dashoffset:var(--len);transition:stroke-dashoffset 3s ease-in-out}
.aeg-lines.drawn path{stroke-dashoffset:0}
.aeg-band.dark .aeg-lines path{stroke:#fff;opacity:.16}

/* ── intro: the reference's logo moment, once per session ────────────────
   Cream field, the mark draws its square and its wordmark, then the whole
   thing lifts and fades. 1.5s, skipped entirely under reduced motion and on
   every navigation after the first. */
.aeg-intro{position:fixed;inset:0;z-index:80;background:${C.paper};display:grid;place-items:center;
  transition:opacity .45s ease-out;pointer-events:none}
.aeg-intro.gone{opacity:0}
.aeg-intro .mark{display:block;width:clamp(180px,22vw,300px);opacity:0;transform:translateY(14px);
  transition:opacity .5s ease-out,transform .7s cubic-bezier(.22,1,.36,1)}
.aeg-intro .mark img{width:100%;height:auto}
.aeg-intro .rule{position:absolute;left:50%;bottom:calc(50% - 5.4em);width:0;height:2px;background:${C.blue};
  transform:translateX(-50%);transition:width .8s .15s cubic-bezier(.22,1,.36,1)}
.aeg-intro.in .mark{opacity:1;transform:translateY(0)}
.aeg-intro.in .rule{width:min(38vw,320px)}
.aeg-intro.lift .mark{transform:translateY(-14px);opacity:0;transition:opacity .4s ease-out,transform .5s ease-out}
.aeg-intro.lift .rule{width:0;transition:width .45s ease-out}

/* ── header: floating pill, plate fades in at 20px ──────────────────── */
.aeg-scroll-top{position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none}
.aeg-head{position:fixed;left:4.375vw;top:1.25vw;width:calc(100vw - 8.75vw);z-index:40;
  padding:1.25vw;color:${C.ink};transition:color .3s;padding-top:max(1.25vw,env(safe-area-inset-top))}
.aeg-head:before{content:'';position:absolute;inset:0;background:#fff;border-radius:var(--rad);opacity:0;transition:opacity .3s}
.aeg-head.scrolled:before,.aeg-head.menuopen:before{opacity:1}
.aeg-head.light:not(.scrolled):not(.menuopen){color:#fff}
/* the ghost phone button inherits ink from the system and vanished over the dark
   hero until the plate faded in (caught in the landing shot, 2026-09-21) */
.aeg-head.light:not(.scrolled):not(.menuopen) .aeg-btn.ghost{color:#fff;border-color:rgba(255,255,255,.6)}
.aeg-head .row{position:relative;display:flex;align-items:center;gap:var(--col);justify-content:space-between}
.aeg-head .mark{display:flex;align-items:center;min-height:44px}
.aeg-head .mark img{height:clamp(30px,2.5vw,40px);width:auto;display:block;transition:filter .3s}
.aeg-head.light:not(.scrolled):not(.menuopen) .mark img{filter:brightness(0) invert(1)}
.aeg-head.menuopen .mark img{filter:none}
.aeg-head nav ul{list-style:none;display:flex;gap:1.8vw;font-size:var(--t-lead);font-weight:500;align-items:center}
.aeg-head nav a,.aeg-head nav .dropbtn{opacity:1;transition:opacity .3s}
.aeg-head nav .dropbtn{display:inline-flex;align-items:center;gap:.5em;background:none;border:0;color:inherit;font:inherit;cursor:pointer;min-height:44px;padding:0}
.aeg-head nav .dropbtn svg{transition:transform .3s}
.aeg-head nav .dropbtn[aria-expanded="true"] svg{transform:rotate(180deg)}
.aeg-head nav li{position:relative;display:flex;align-items:center}
/* the group panel is its own white plate, so the ink colour is set on it: the
   header text is white over the hero until the plate fades in */
.aeg-head .drop{position:absolute;top:calc(100% + .9vw);left:-1.1em;min-width:19.5em;background:#fff;color:${C.ink};
  border:1px solid ${C.hairline};border-radius:var(--rad);padding:.5em;display:grid;
  opacity:0;visibility:hidden;transform:translateY(8px);
  transition:opacity .3s,transform .3s var(--e,cubic-bezier(.22,1,.36,1)),visibility 0s linear .3s}
.aeg-head .drop.open{opacity:1;visibility:visible;transform:none;transition:opacity .3s,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s}
.aeg-head .drop a{display:flex;gap:1em;align-items:baseline;padding:.8em .9em;border-radius:var(--rad);font-size:var(--t-lead);opacity:1}
.aeg-head .drop a .n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums}
.aeg-head .acts{display:flex;align-items:center;gap:0.8vw}
@media (max-width:1080px){.aeg-head{left:3.704vw;top:1.852vw;width:calc(100vw - 7.407vw);padding:1.852vw}
  .aeg-head .acts .aeg-btn.tel{display:none}}
@media (max-width:760px){.aeg-head{left:3.448vw;top:3.448vw;width:calc(100vw - 6.897vw);padding:3.6vw 3.448vw}
  .aeg-head nav{display:none}.aeg-head .acts .aeg-btn{display:none}.aeg-head .mark img{height:30px}}
/* the menu button is hidden from 761px up, never below it: the base rule used
   to sit after the media query and silently won, which left a phone with no
   navigation at all (caught on the iOS simulator) */
.aeg-head .burger{display:grid;width:44px;height:44px;place-items:center;background:transparent;border:0;cursor:pointer;color:inherit}
@media (min-width:761px){.aeg-head .burger{display:none}}
.aeg-head .burger i{display:block;position:relative;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,background .3s}
.aeg-head .burger i:before,.aeg-head .burger i:after{content:'';position:absolute;left:0;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,top .3s}
.aeg-head .burger i:before{top:-7px}.aeg-head .burger i:after{top:7px}
.aeg-head.menuopen .burger i{background:transparent}
.aeg-head.menuopen .burger i:before{top:0;transform:rotate(45deg)}
.aeg-head.menuopen .burger i:after{top:0;transform:rotate(-45deg)}

.aeg-menu{position:fixed;inset:0;z-index:35;overscroll-behavior:contain;background:${C.blueDeep};color:#fff;opacity:0;pointer-events:none;
  transition:opacity .3s,visibility 0s linear .3s;visibility:hidden;display:flex;flex-direction:column;justify-content:flex-start;padding:0 var(--gut)}
/* visibility, not just opacity: iOS 26 Safari tints the status strip from a fixed
   element touching the top edge, and a closed menu at opacity 0 kept it espresso
   over white bands after one open (caught on the simulator, 2026-09-21) */
.aeg-menu.open{opacity:1;pointer-events:auto;visibility:visible;transition:opacity .3s,visibility 0s}
/* only the navigation links take the big menu size; the two buttons keep the
   label scale, or the email address runs into its own arrow */
.aeg-menu{overflow-y:auto;padding-top:calc(var(--band) + 5vw);padding-bottom:calc(var(--band) / 2)}
.aeg-menu .grp > a{display:block;font-size:clamp(30px,8.6vw,44px);line-height:1.5;font-weight:500}
.aeg-menu .sub{display:grid;margin:0 0 .6rem;padding-left:.2rem}
.aeg-menu .sub a{font-size:var(--t-lead);line-height:1.35;padding:.5em 0;opacity:.78;min-height:44px;display:flex;align-items:center}
.aeg-menu .foot{margin-top:2.4rem;display:flex;flex-wrap:wrap;gap:0.8rem}
.aeg-menu .foot .aeg-btn{font-size:var(--t-label);min-width:0;flex:1 1 auto;text-align:left}
.aeg-menu .foot .aeg-btn .lab{padding:1.05em 1.2em 1.1em;padding-right:3.4em}

/* ── the two-dot cursor, fine pointers only ─────────────────────────── */
.aeg-cursor{position:fixed;inset:0;z-index:60;pointer-events:none;display:none}
@media (hover:hover) and (pointer:fine){.aeg-cursor{display:block}}
/* one 52px box per dot, sized by the independent scale property so the disc
   grows on the compositor; width, height and margin used to animate here and
   that ran layout on the element that moves every pointer frame */
.aeg-cursor b{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;display:block;
  transition:scale .3s,background .3s,opacity .3s}
.aeg-cursor b.lead{scale:0.173;background:${C.blueDeep};z-index:2}
.aeg-cursor b.trail{scale:0.135;background:${C.blue}}
.aeg-cursor.on-link b{opacity:0}
.aeg-cursor.on-card b.lead{scale:1;background:${C.blue};opacity:1}
.aeg-cursor.on-card b.trail{opacity:0}
.aeg-cursor .arw{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;display:grid;place-items:center;
  color:#fff;opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s;z-index:3}
.aeg-cursor.on-card .arw{opacity:1;transform:translateX(0)}

/* ── mobile sticky contact bar ──────────────────────────────────────── */
.aeg-sticky{position:fixed;left:0;right:0;bottom:0;z-index:34;display:none;gap:8px;padding:10px 12px;
  padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(239,237,233,.94);
  backdrop-filter:blur(8px);border-top:1px solid ${C.hairline}}
@media (max-width:760px){.aeg-sticky{display:flex}}
.aeg-sticky a{flex:1;text-align:center;padding:14px 10px;border-radius:var(--rad);font-size:15px;font-weight:600;
  text-transform:uppercase;letter-spacing:0.05em}
.aeg-sticky a.call{background:transparent;color:${C.ink};border:1px solid ${C.ink}}
.aeg-sticky a.mail{background:${C.blue};color:#fff}

/* ── footer ─────────────────────────────────────────────────────────── */
.aeg-foot{background:${C.paper};padding:var(--band) 0 calc(var(--band) / 2)}
.aeg-foot .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:760px){.aeg-foot .cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1rem}}
@media (max-width:400px){.aeg-foot .cols{grid-template-columns:minmax(0,1fr)}}
.aeg-foot a,.aeg-foot p{overflow-wrap:anywhere}
.aeg-foot h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:1em;opacity:.55}
.aeg-foot p,.aeg-foot li{font-size:var(--t-lead);line-height:1.5}
.aeg-foot .rule{height:1px;background:${C.hairline};margin:calc(var(--band) / 2) 0 1.5rem}
.aeg-foot .fine{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:var(--t-tag);opacity:.7}
@media (max-width:760px){.aeg-root{padding-bottom:76px}}

/* every hover effect sits behind a real pointer: on a touch screen a tap used
   to leave the label shifted and a card darkened until the next tap */
@media (hover:hover) and (pointer:fine){
  .aeg-btn:hover .lab{transform:translateX(2em)}
  .aeg-btn:hover .arw.r{transform:translate(100%,-50%);opacity:0}
  .aeg-btn:hover .arw.l{transform:translate(0,-50%);opacity:1}
  .aeg-btn.ghost:hover{background:${C.ink};color:#fff}
  .aeg-btn.light:hover{background:transparent;color:#fff;border-color:#fff}
  .aeg-btn.brand:hover{background:${C.blueDeep};border-color:${C.blueDeep}}
  .aeg-arrowbtn:hover{background:${C.blue};border-color:${C.blue};color:#fff}
  .aeg-head nav a:hover{opacity:.6}
  .aeg-foot a:hover{opacity:.55}
  .aeg-card:hover .aeg-media .inner:after{opacity:.55}
}

@media (prefers-reduced-motion:reduce){
  /* gentler, not none: colour and opacity still carry the feedback, movement goes */
  .aeg-root *,.aeg-root *:before,.aeg-root *:after{
    transition-property:opacity,color,background-color,border-color,fill,stroke !important;
    transition-duration:.15s !important;animation-duration:.01ms !important}
  .aeg-rise,.aeg-word{transform:none !important;opacity:1 !important}
  .aeg-lines path{stroke-dashoffset:0 !important}
  .aeg-media .inner{transform:none !important}
  .aeg-cursor{display:none !important}
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
        <span key={`${w}-${i}`} className="aeg-word" style={{ ['--d' as string]: `${(hold + i * 0.05).toFixed(2)}s` }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`aeg-label ${className}`}>
      <svg className="aeg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
      <span>{children}</span>
    </p>
  )
}

export function Chapter({ n }: { n: string }) {
  const [whole, part] = n.split('.')
  return (
    <span className="aeg-num" aria-hidden="true">
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
  const cls = `aeg-btn ${variant} ${rest.className ?? ''}`
  if (to) return <Link className={cls} to={to} onClick={onClick}>{inner}</Link>
  /* an in-page jump hands over to the caller's smooth scroll, so the default
     hash navigation must not also fire */
  const click = onClick ? (e: { preventDefault: () => void }) => { e.preventDefault(); onClick() } : undefined
  return <a className={cls} href={href} onClick={click}>{inner}</a>
}

export function ArrowButton({ dir, onClick, disabled, label }: {
  dir: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button type="button" className="aeg-arrowbtn" onClick={onClick} disabled={disabled} aria-label={label}>
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
    /* sail seams: 41 strokes leave the left edge spread over the full height and
       converge toward one side, bowing like panels under load, as in their mark */
    const flip = seed % 2 === 0
    for (let i = 0; i < 41; i++) {
      const t = i / 40
      const y0 = 14 + t * 420 + rnd() * 3
      const y1 = 110 + t * 190 + rnd() * 3
      const bow = (1 - Math.abs(2 * t - 1)) * (16 + rnd() * 20)
      const c1 = y0 + (y1 - y0) * 0.18 + bow
      const c2 = y0 + (y1 - y0) * 0.7 + bow * 0.55
      const d = flip
        ? `M1600 ${y0.toFixed(1)} C 1080 ${c1.toFixed(1)}, 520 ${c2.toFixed(1)}, 0 ${y1.toFixed(1)}`
        : `M0 ${y0.toFixed(1)} C 520 ${c1.toFixed(1)}, 1080 ${c2.toFixed(1)}, 1600 ${y1.toFixed(1)}`
      out.push(d)
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
    <div className="aeg-lines" ref={ref} style={{ top, height }} aria-hidden="true">
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
    const root = document.querySelector<HTMLElement>('.aeg-cursor')
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
    <div className="aeg-cursor" aria-hidden="true">
      <b className="trail" />
      <b className="lead" />
      <span className="arw"><Arrow /></span>
    </div>
  )
}

/* ── header ───────────────────────────────────────────────────────────── */
const ROUTE = '/preview/aegir'
const NAV: { label: string; hash: string; children?: { label: string; hash: string }[] }[] = [
  {
    label: 'Þjónusta',
    hash: '#thjonusta',
    children: [
      { label: 'Tjaldaleiga', hash: '#tjaldaleiga' },
      { label: 'Markísur og skyggni', hash: '#markisur' },
      { label: 'Sundlaugar og pottar', hash: '#sundlaugar' },
      { label: 'Sérsaumur og viðgerðir', hash: '#saumastofa' },
    ],
  },
  { label: 'Verkin', hash: '#verkefni' },
  { label: 'Um okkur', hash: '#um-okkur' },
]

/** Smooth-scroll to a section on this page, or, from a job page, hop to the home
 *  page and hand the hash over so the section is scrolled to once it has mounted. */
export function useGoto() {
  const navigate = useNavigate()
  return (hash: string) => {
    const el = document.querySelector(hash)
    if (el) { el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); return }
    navigate(ROUTE, { state: { hash } })
  }
}

export function Header({ light = false }: { light?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const sentinel = useRef<HTMLSpanElement | null>(null)
  const dropRef = useRef<HTMLLIElement | null>(null)
  const goto = useGoto()
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
  useEffect(() => {
    if (!drop) return
    const away = (e: Event) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrop(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [drop])

  const go = (hash: string) => { setOpen(false); setDrop(false); goto(hash) }

  return (
    <>
      <span ref={sentinel} className="aeg-scroll-top" aria-hidden="true" />
      <a className="aeg-skip" href="#efni">Fara beint í efnið</a>
      <header className={`aeg-head${scrolled ? ' scrolled' : ''}${light ? ' light' : ''}${open ? ' menuopen' : ''}`}>
        <div className="row">
          <Link to={ROUTE} className="mark" aria-label="Seglagerðin Ægir, forsíða">
            <img src={`${B}aegir/logo.png`} alt="" width={772} height={316} />
          </Link>
          <nav aria-label="Aðalvalmynd">
            <ul>
              {NAV.map((n) => n.children ? (
                <li key={n.label} className="has-drop" ref={dropRef}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setDrop(true) }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setDrop(false) }}>
                  <button type="button" className="dropbtn" aria-expanded={drop} aria-controls="aeg-drop" onClick={() => setDrop((d) => !d)}>
                    {n.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </button>
                  <div id="aeg-drop" className={`drop${drop ? ' open' : ''}`}>
                    {n.children.map((c, i) => (
                      <a key={c.hash} href={c.hash} tabIndex={drop ? 0 : -1} onClick={(e) => { e.preventDefault(); go(c.hash) }}>
                        <span className="n">{String(i + 1).padStart(2, '0')}</span>{c.label}
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={n.label}><a href={n.hash} onClick={(e) => { e.preventDefault(); go(n.hash) }}>{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="acts">
            <Btn href={CONTACT.simiHref} variant="ghost" className="tel">{CONTACT.simi}</Btn>
            <Btn href="#hafa-samband" variant="brand" onClick={() => go('#hafa-samband')}>Biðja um tilboð</Btn>
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
      <div className={`aeg-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        {NAV.map((n) => (
          <div key={n.label} className="grp">
            <a href={n.hash} onClick={(e) => { e.preventDefault(); go(n.hash) }} tabIndex={open ? 0 : -1}>{n.label}</a>
            {n.children ? (
              <div className="sub">
                {n.children.map((c) => (
                  <a key={c.hash} href={c.hash} onClick={(e) => { e.preventDefault(); go(c.hash) }} tabIndex={open ? 0 : -1}>{c.label}</a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div className="foot">
          <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
          <Btn href="#hafa-samband" variant="light" onClick={() => go('#hafa-samband')}>Biðja um tilboð</Btn>
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
    try { seen = sessionStorage.getItem('aeg-intro') === '1' } catch { seen = false }
    if (seen) return
    try { sessionStorage.setItem('aeg-intro', '1') } catch { /* private mode */ }

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
    <div className={`aeg-intro ${phase === 'gone' ? 'gone' : phase}`} aria-hidden="true">
      <span className="mark"><img src={`${B}aegir/logo.png`} alt="" width={772} height={316} /></span>
      <span className="rule" />
    </div>
  )
}

export function StickyBar() {
  const goto = useGoto()
  return (
    <div className="aeg-sticky">
      <a className="call" href={CONTACT.simiHref}>Hringja</a>
      <a className="mail" href="#hafa-samband" onClick={(e) => { e.preventDefault(); goto('#hafa-samband') }}>Biðja um tilboð</a>
    </div>
  )
}
