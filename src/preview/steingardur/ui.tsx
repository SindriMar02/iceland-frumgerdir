import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTACT } from './data'

/* ── STEINGARÐUR · "JARÐVINNA, HEIMLAGNIR OG LJÓSLEIÐARI" ────────────────
   The Seglagerðin Ægir build (itself the HBH Byggir system, devices D1–D18 in
   _reference/driessen-teardown) re-aimed at Steingarður ehf. The mechanisms
   are kept as measured and gated there; the brand layer is rebuilt.

   Brand layer: the green of their own swoosh mark (#379440, darkened to
   #2E7D35 where it carries white text so it clears AA), the dark bands are
   asphalt, the paper is pale concrete. The line field is the swoosh itself:
   the lanes of their mark rising from the ground and bending away into the
   distance, instead of Ægir's sail seams. Type is Geist throughout (Sindri's pick 2026-10-09 from a
   four-font specimen): Bold set tight for display, Regular/Medium for text.

   Declared deviations, inherited: no Lenis (the mobile gate forbids a JS
   scroll surface), no film, reduced motion, focus rings, one h1, a 15px floor.
   New here: one grouped dropdown (Þjónusta), and the page carries a job
   builder fed by their own equipment list, feeding one request form with a
   staff-side preview of what lands in their inbox.
   ──────────────────────────────────────────────────────────────────────── */

export const C = {
  green: '#2E7D35',
  logo: '#379440',
  asphalt: '#1A1E1B',
  ink: '#141714',
  paper: '#EDEDE8',
  white: '#FFFFFF',
  swoosh: '#379440',
  hairline: 'rgba(20,23,20,.13)',
}

const B = import.meta.env.BASE_URL

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ── the system stylesheet ─────────────────────────────────────────────── */
export const CSS = `
@font-face{font-family:'StgSans';src:url('${B}fonts/geist/Geist-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'StgSans';src:url('${B}fonts/geist/Geist-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'StgSans';src:url('${B}fonts/geist/Geist-Bold.woff2') format('woff2');font-weight:600 800;font-display:swap}
@font-face{font-family:'StgDisp';src:url('${B}fonts/geist/Geist-Bold.woff2') format('woff2');font-weight:700;font-display:swap}

/* the phone's status and home-indicator strips sample html/body (mobile gate) */
html:has(.stg-root), body:has(.stg-root){background-color:${C.paper}}

.stg-root{
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
  font-family:'StgSans',system-ui,sans-serif; font-weight:400;
  font-size:var(--t-body); line-height:1.6; letter-spacing:-0.01em;
  -webkit-font-smoothing:antialiased; overflow-x:clip;
}
@media (max-width:1080px){.stg-root{--gut:5.556vw;--band:11.111vw;--rad:0.37vw;--rise:1.852vw;--col:1.852vw;
  --t-body:clamp(15px,1.389vw,17px); --t-lead:clamp(16px,1.574vw,18px); --t-label:clamp(11px,1.204vw,13px); --t-tag:clamp(11px,1.111vw,12px)}}
@media (max-width:580px){.stg-root{--gut:6.897vw;--band:20.69vw;--rad:0.69vw;--rise:3.448vw;--col:3.448vw;
  --t-big:clamp(32px,10.4vw,42px); --t-normal:clamp(22px,6.2vw,26px); --t-small:clamp(20px,5.517vw,23px);
  --t-smaller:clamp(17px,4.138vw,19px); --t-num:clamp(32px,10.69vw,42px); --t-label:clamp(12px,3.103vw,13px); --t-tag:clamp(11px,2.759vw,12px)}}

.stg-root *{box-sizing:border-box;margin:0;padding:0}
.stg-root a,.stg-root button{touch-action:manipulation;-webkit-tap-highlight-color:rgba(46,125,53,.18)}
.stg-root [id]{scroll-margin-top:calc(var(--band) / 2 + 5vw)}
@media (max-width:580px){.stg-root [id]{scroll-margin-top:calc(var(--band) / 2 + 17vw)}}
.stg-skip{position:absolute;left:-9999px;top:0;z-index:70;background:#fff;color:${C.ink};padding:.8em 1.2em;border-radius:var(--rad);font-weight:600}
.stg-skip:focus{left:1rem;top:1rem}
.stg-root img{display:block;width:100%;height:100%;object-fit:cover}
.stg-root a{color:inherit;text-decoration:none}
.stg-root ::selection{background:${C.green};color:#fff}
.stg-root :focus-visible{outline:2px solid ${C.green};outline-offset:3px;border-radius:2px}
/* over the photographic hero and the asphalt band the green ring has too little
   contrast, so the ring goes white there */
.stg-head.light:not(.scrolled):not(.menuopen) :focus-visible,.stg-band.dark :focus-visible,
.stg-hero :focus-visible,.stg-vhero :focus-visible,.stg-quote :focus-visible,.stg-menu :focus-visible{outline-color:#fff}

/* ── layout primitives ──────────────────────────────────────────────── */
.stg-wrap{width:100%;padding:0 var(--gut);margin:0 auto}
.stg-wrap.small{padding:0 20.625vw}
@media (max-width:1080px){.stg-wrap.small{padding:0 11.111vw}}
@media (max-width:580px){.stg-wrap.small{padding:0 var(--gut)}}
.stg-band{padding:var(--band) 0;background:transparent}
.stg-band.paper{background:${C.paper}}
.stg-band.white{background:${C.white}}
.stg-band.dark{background:${C.asphalt};color:#fff}
.stg-band.flush{padding:0}
.stg-band section{margin:var(--band) 0}
.stg-band section:first-child{margin-top:0}
.stg-band section:last-child{margin-bottom:0}

/* ── type ───────────────────────────────────────────────────────────── */
.stg-big{font-family:'StgDisp',system-ui,sans-serif;font-size:var(--t-big);line-height:1;font-weight:700;letter-spacing:-0.045em;overflow-wrap:normal;hyphens:none;text-wrap:balance}
.stg-normal{font-family:'StgDisp',system-ui,sans-serif;font-size:var(--t-normal);line-height:1.08;font-weight:700;letter-spacing:-0.035em;overflow-wrap:normal;text-wrap:pretty}
.stg-smallt{font-family:'StgSans',system-ui,sans-serif;font-size:var(--t-small);line-height:1.1;font-weight:700;letter-spacing:-0.03em}
.stg-smallert{font-family:'StgSans',system-ui,sans-serif;font-size:var(--t-smaller);line-height:1.15;font-weight:700;letter-spacing:-0.02em}
.stg-num{font-family:'StgSans',system-ui,sans-serif;font-size:var(--t-num);line-height:1;font-weight:400;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;white-space:nowrap;display:inline-block}
.stg-num sup{font-size:0.71em;font-weight:500;vertical-align:top;margin-left:0.04em;line-height:1}
.stg-lead{font-size:var(--t-lead);line-height:1.45}
.stg-label{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;line-height:1.2;display:flex;align-items:center;gap:0.7em}
.stg-tag{font-size:var(--t-tag);border:1px solid rgba(20,23,20,.3);border-radius:var(--rad);padding:0.18em 0.6em 0.28em;color:rgba(20,23,20,.72);white-space:nowrap}
.stg-band.dark .stg-tag,.stg-hero .stg-tag,.stg-vhero .stg-tag{border-color:rgba(255,255,255,.45);color:rgba(255,255,255,.88)}

/* the label dot draws itself in, as on the reference */
.stg-dot{width:1.05em;height:1.05em;flex:none;display:block}
.stg-dot circle{fill:none;stroke:${C.green};stroke-width:5;transform:rotate(-90deg);transform-origin:50% 50%;
  stroke-dasharray:28.27;stroke-dashoffset:28.27;transition:stroke-dashoffset .9s .3s ease-out}
.stg-band.dark .stg-dot circle{stroke:#fff}
.inview .stg-dot circle{stroke-dashoffset:0}

/* ── reveals: 1.25vw rise + fade, .45s, .15s ladder ─────────────────── */
.stg-rise{transform:translateY(var(--rise));opacity:0;transition:transform .45s var(--d,0s) ease-out,opacity .45s var(--d,0s) ease-out}
.inview .stg-rise,.stg-rise.inview{transform:translateY(0);opacity:1}
.stg-word{display:inline-block;transform:translateY(var(--rise));opacity:0;
  transition:transform .45s var(--d,0s) cubic-bezier(.33,1,.68,1),opacity .45s var(--d,0s) ease-out}
.inview .stg-word{transform:translateY(0);opacity:1}

/* ── media: parallax box, scrub overlay ─────────────────────────────── */
.stg-media{position:relative;overflow:hidden;border-radius:var(--rad);background:#d8d4cf}
.stg-media .inner{position:absolute;inset:-8% 0;height:116%;will-change:transform}
.stg-media .scrim{position:absolute;inset:0;background:${C.ink};opacity:0;z-index:2;pointer-events:none}
.stg-media figcaption{position:absolute;inset:auto 0 0 0;padding:0.6em 0.8em;font-size:var(--t-tag);color:#fff;
  background:linear-gradient(to top,rgba(26,30,27,.72),transparent);z-index:3}

/* ── buttons: label slides right, arrow swaps (.3s) ─────────────────── */
.stg-btn{position:relative;display:inline-block;overflow:hidden;cursor:pointer;
  border:1px solid ${C.ink};border-radius:var(--rad);background:${C.ink};color:#fff;
  font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;
  min-width:clamp(180px,13.75vw,220px);transition:background .3s,color .3s,border-color .3s}
/* the label slides with a transform; animating its padding ran layout on every
   hover frame for the same visual result */
.stg-btn .lab{display:block;padding:0.95em 1.2em 1em;padding-right:3.2em;transition:transform .3s cubic-bezier(0.32,0.72,0,1)}
.stg-btn .arw{position:absolute;top:50%;width:3.2em;text-align:center;transition:transform .3s,opacity .3s;line-height:0}
.stg-btn .arw.r{right:0;transform:translate(0,-50%);opacity:1}
.stg-btn .arw.l{left:0;transform:translate(-100%,-50%);opacity:0}
.stg-btn.ghost{background:transparent;color:${C.ink};border-color:${C.ink}}
.stg-btn.light{background:#fff;color:${C.ink};border-color:#fff}
.stg-btn.brand{background:${C.green};border-color:${C.green};color:#fff}
.stg-arrowbtn{width:clamp(44px,3.5625vw,58px);height:clamp(44px,3.5625vw,58px);border:1px solid currentColor;
  border-radius:var(--rad);background:transparent;color:inherit;cursor:pointer;position:relative;overflow:hidden;
  display:grid;place-items:center;transition:background .3s,color .3s}
.stg-arrowbtn:disabled{opacity:.3;cursor:default}
.stg-arrowbtn:disabled:hover{background:transparent;color:inherit;border-color:currentColor}

/* ── the line field: the swoosh lanes draw themselves and never settle ── */
.stg-lines{position:absolute;left:0;right:0;pointer-events:none;z-index:0}
.stg-lines svg{display:block;width:100%;height:auto}
.stg-lines path{fill:none;stroke:${C.swoosh};stroke-width:1;opacity:.28;
  stroke-dasharray:var(--len);stroke-dashoffset:var(--len);transition:stroke-dashoffset 3s ease-in-out}
.stg-lines.drawn path{stroke-dashoffset:0}
.stg-band.dark .stg-lines path{stroke:#fff;opacity:.16}

/* ── intro: the reference's logo moment, once per session ────────────────
   Cream field, the mark draws its square and its wordmark, then the whole
   thing lifts and fades. 1.5s, skipped entirely under reduced motion and on
   every navigation after the first. */
.stg-intro{position:fixed;inset:0;z-index:80;background:${C.paper};display:grid;place-items:center;
  transition:opacity .45s ease-out;pointer-events:none}
.stg-intro.gone{opacity:0}
.stg-intro .mark{display:block;width:clamp(180px,22vw,300px);opacity:0;transform:translateY(14px);
  transition:opacity .5s ease-out,transform .7s cubic-bezier(.22,1,.36,1)}
.stg-intro .mark img{width:100%;height:auto}
.stg-intro .rule{position:absolute;left:50%;bottom:calc(50% - 5.4em);width:0;height:2px;background:${C.green};
  transform:translateX(-50%);transition:width .8s .15s cubic-bezier(.22,1,.36,1)}
.stg-intro.in .mark{opacity:1;transform:translateY(0)}
.stg-intro.in .rule{width:min(38vw,320px)}
.stg-intro.lift .mark{transform:translateY(-14px);opacity:0;transition:opacity .4s ease-out,transform .5s ease-out}
.stg-intro.lift .rule{width:0;transition:width .45s ease-out}

/* ── header: floating pill, plate fades in at 20px ──────────────────── */
.stg-scroll-top{position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none}
.stg-head{position:fixed;left:4.375vw;top:1.25vw;width:calc(100vw - 8.75vw);z-index:40;
  padding:1.25vw;color:${C.ink};transition:color .3s;padding-top:max(1.25vw,env(safe-area-inset-top))}
.stg-head:before{content:'';position:absolute;inset:0;background:#fff;border-radius:var(--rad);opacity:0;transition:opacity .3s}
.stg-head.scrolled:before,.stg-head.menuopen:before{opacity:1}
.stg-head.light:not(.scrolled):not(.menuopen){color:#fff}
/* the ghost phone button inherits ink from the system and vanished over the dark
   hero until the plate faded in (caught in the landing shot, 2026-09-21) */
.stg-head.light:not(.scrolled):not(.menuopen) .stg-btn.ghost{color:#fff;border-color:rgba(255,255,255,.6)}
.stg-head .row{position:relative;display:flex;align-items:center;gap:var(--col);justify-content:space-between}
.stg-head .mark{display:flex;align-items:center;min-height:44px}
.stg-head .mark img{height:clamp(30px,2.5vw,40px);width:auto;display:block;transition:filter .3s}
.stg-head.light:not(.scrolled):not(.menuopen) .mark img{filter:brightness(0) invert(1)}
.stg-head.menuopen .mark img{filter:none}
.stg-head nav ul{list-style:none;display:flex;gap:1.8vw;font-size:var(--t-lead);font-weight:500;align-items:center}
.stg-head nav a,.stg-head nav .dropbtn{opacity:1;transition:opacity .3s}
.stg-head nav .dropbtn{display:inline-flex;align-items:center;gap:.5em;background:none;border:0;color:inherit;font:inherit;cursor:pointer;min-height:44px;padding:0}
.stg-head nav .dropbtn svg{transition:transform .3s}
.stg-head nav .dropbtn[aria-expanded="true"] svg{transform:rotate(180deg)}
.stg-head nav li{position:relative;display:flex;align-items:center}
/* the group panel is its own white plate, so the ink colour is set on it: the
   header text is white over the hero until the plate fades in */
.stg-head .drop{position:absolute;top:calc(100% + .9vw);left:-1.1em;min-width:19.5em;background:#fff;color:${C.ink};
  border:1px solid ${C.hairline};border-radius:var(--rad);padding:.5em;display:grid;
  opacity:0;visibility:hidden;transform:translateY(8px);
  transition:opacity .3s,transform .3s var(--e,cubic-bezier(.22,1,.36,1)),visibility 0s linear .3s}
.stg-head .drop.open{opacity:1;visibility:visible;transform:none;transition:opacity .3s,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s}
.stg-head .drop a{display:flex;gap:1em;align-items:baseline;padding:.8em .9em;border-radius:var(--rad);font-size:var(--t-lead);opacity:1}
.stg-head .drop a .n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums}
.stg-head .acts{display:flex;align-items:center;gap:0.8vw}
@media (max-width:1080px){.stg-head{left:3.704vw;top:1.852vw;width:calc(100vw - 7.407vw);padding:1.852vw}
  .stg-head .acts .stg-btn.tel{display:none}}
@media (max-width:760px){.stg-head{left:3.448vw;top:3.448vw;width:calc(100vw - 6.897vw);padding:3.6vw 3.448vw}
  .stg-head nav{display:none}.stg-head .acts .stg-btn{display:none}.stg-head .mark img{height:30px}}
/* the menu button is hidden from 761px up, never below it: the base rule used
   to sit after the media query and silently won, which left a phone with no
   navigation at all (caught on the iOS simulator) */
.stg-head .burger{display:grid;width:44px;height:44px;place-items:center;background:transparent;border:0;cursor:pointer;color:inherit}
@media (min-width:761px){.stg-head .burger{display:none}}
.stg-head .burger i{display:block;position:relative;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,background .3s}
.stg-head .burger i:before,.stg-head .burger i:after{content:'';position:absolute;left:0;width:22px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s,top .3s}
.stg-head .burger i:before{top:-7px}.stg-head .burger i:after{top:7px}
.stg-head.menuopen .burger i{background:transparent}
.stg-head.menuopen .burger i:before{top:0;transform:rotate(45deg)}
.stg-head.menuopen .burger i:after{top:0;transform:rotate(-45deg)}

.stg-menu{position:fixed;inset:0;z-index:35;overscroll-behavior:contain;background:${C.asphalt};color:#fff;opacity:0;pointer-events:none;
  transition:opacity .3s,visibility 0s linear .3s;visibility:hidden;display:flex;flex-direction:column;justify-content:flex-start;padding:0 var(--gut)}
/* visibility, not just opacity: iOS 26 Safari tints the status strip from a fixed
   element touching the top edge, and a closed menu at opacity 0 kept it espresso
   over white bands after one open (caught on the simulator, 2026-09-21) */
.stg-menu.open{opacity:1;pointer-events:auto;visibility:visible;transition:opacity .3s,visibility 0s}
/* only the navigation links take the big menu size; the two buttons keep the
   label scale, or the email address runs into its own arrow */
.stg-menu{overflow-y:auto;padding-top:calc(var(--band) + 5vw);padding-bottom:calc(var(--band) / 2)}
.stg-menu .grp > a{display:block;font-size:clamp(30px,8.6vw,44px);line-height:1.5;font-weight:500}
.stg-menu .sub{display:grid;margin:0 0 .6rem;padding-left:.2rem}
.stg-menu .sub a{font-size:var(--t-lead);line-height:1.35;padding:.5em 0;opacity:.78;min-height:44px;display:flex;align-items:center}
.stg-menu .foot{margin-top:2.4rem;display:flex;flex-wrap:wrap;gap:0.8rem}
.stg-menu .foot .stg-btn{font-size:var(--t-label);min-width:0;flex:1 1 auto;text-align:left}
.stg-menu .foot .stg-btn .lab{padding:1.05em 1.2em 1.1em;padding-right:3.4em}

/* ── the two-dot cursor, fine pointers only ─────────────────────────── */
.stg-cursor{position:fixed;inset:0;z-index:60;pointer-events:none;display:none}
@media (hover:hover) and (pointer:fine){.stg-cursor{display:block}}
/* one 52px box per dot, sized by the independent scale property so the disc
   grows on the compositor; width, height and margin used to animate here and
   that ran layout on the element that moves every pointer frame */
.stg-cursor b{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;display:block;
  transition:scale .3s,background .3s,opacity .3s}
.stg-cursor b.lead{scale:0.173;background:${C.asphalt};z-index:2}
.stg-cursor b.trail{scale:0.135;background:${C.green}}
.stg-cursor.on-link b{opacity:0}
.stg-cursor.on-card b.lead{scale:1;background:${C.green};opacity:1}
.stg-cursor.on-card b.trail{opacity:0}
.stg-cursor .arw{position:fixed;top:0;left:0;width:52px;height:52px;margin:-26px 0 0 -26px;display:grid;place-items:center;
  color:#fff;opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s;z-index:3}
.stg-cursor.on-card .arw{opacity:1;transform:translateX(0)}

/* ── mobile sticky contact bar ──────────────────────────────────────── */
.stg-sticky{position:fixed;left:0;right:0;bottom:0;z-index:34;display:none;gap:8px;padding:10px 12px;
  padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(237,237,232,.94);
  backdrop-filter:blur(8px);border-top:1px solid ${C.hairline}}
@media (max-width:760px){.stg-sticky{display:flex}}
.stg-sticky a{flex:1;text-align:center;padding:14px 10px;border-radius:var(--rad);font-size:15px;font-weight:600;
  text-transform:uppercase;letter-spacing:0.05em}
.stg-sticky a.call{background:transparent;color:${C.ink};border:1px solid ${C.ink}}
.stg-sticky a.mail{background:${C.green};color:#fff}

/* ── footer ─────────────────────────────────────────────────────────── */
.stg-foot{background:${C.paper};padding:var(--band) 0 calc(var(--band) / 2)}
.stg-foot .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:760px){.stg-foot .cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1rem}}
@media (max-width:400px){.stg-foot .cols{grid-template-columns:minmax(0,1fr)}}
.stg-foot a,.stg-foot p{overflow-wrap:anywhere}
.stg-foot h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:1em;opacity:.55}
.stg-foot p,.stg-foot li{font-size:var(--t-lead);line-height:1.5}
.stg-foot .rule{height:1px;background:${C.hairline};margin:calc(var(--band) / 2) 0 1.5rem}
.stg-foot .fine{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:var(--t-tag);opacity:.7}
@media (max-width:760px){.stg-root{padding-bottom:76px}}

/* every hover effect sits behind a real pointer: on a touch screen a tap used
   to leave the label shifted and a card darkened until the next tap */
@media (hover:hover) and (pointer:fine){
  .stg-btn:hover .lab{transform:translateX(2em)}
  .stg-btn:hover .arw.r{transform:translate(100%,-50%);opacity:0}
  .stg-btn:hover .arw.l{transform:translate(0,-50%);opacity:1}
  .stg-btn.ghost:hover{background:${C.ink};color:#fff}
  .stg-btn.light:hover{background:transparent;color:#fff;border-color:#fff}
  .stg-btn.brand:hover{background:${C.asphalt};border-color:${C.asphalt}}
  .stg-arrowbtn:hover{background:${C.green};border-color:${C.green};color:#fff}
  .stg-head nav a:hover{opacity:.6}
  .stg-foot a:hover{opacity:.55}
  .stg-card:hover .stg-media .inner:after{opacity:.55}
}

@media (prefers-reduced-motion:reduce){
  /* gentler, not none: colour and opacity still carry the feedback, movement goes */
  .stg-root *,.stg-root *:before,.stg-root *:after{
    transition-property:opacity,color,background-color,border-color,fill,stroke !important;
    transition-duration:.15s !important;animation-duration:.01ms !important}
  .stg-rise,.stg-word{transform:none !important;opacity:1 !important}
  .stg-lines path{stroke-dashoffset:0 !important}
  .stg-media .inner{transform:none !important}
  .stg-cursor{display:none !important}
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
        <span key={`${w}-${i}`} className="stg-word" style={{ ['--d' as string]: `${(hold + i * 0.05).toFixed(2)}s` }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`stg-label ${className}`}>
      <svg className="stg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
      <span>{children}</span>
    </p>
  )
}

export function Chapter({ n }: { n: string }) {
  const [whole, part] = n.split('.')
  return (
    <span className="stg-num" aria-hidden="true">
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
  const cls = `stg-btn ${variant} ${rest.className ?? ''}`
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
    <button type="button" className="stg-arrowbtn" onClick={onClick} disabled={disabled} aria-label={label}>
      <Arrow dir={dir} />
    </button>
  )
}

/* ── the line field ─────────────────────────────────────────────────────
   41 strokes, the reference's count: the lanes of Steingarður's own swoosh.
   They leave the ground spread wide, rise and bend away together toward one
   far point, the way the mark draws a road into the distance. They draw in
   over 3s staggered from the end, then single lines erase and redraw forever
   (2.5s to 5.5s each). Paused off screen. */
export function LineField({ top = '0', height = 430, seed = 1 }: { top?: string; height?: number; seed?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [paths] = useState(() => {
    const out: string[] = []
    let s = seed * 9301
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    const flip = seed % 2 === 0
    for (let i = 0; i < 41; i++) {
      const t = i / 40
      const x0 = -260 + t * 1180 + rnd() * 6
      const y1 = 26 + t * 120 + rnd() * 3
      const c1x = x0 + 120 + t * 160
      const c1y = 250 - t * 40
      const c2x = 700 + t * 260
      const c2y = y1 + 18 + rnd() * 6
      const X = (x: number) => (flip ? 1600 - x : x).toFixed(1)
      out.push(`M${X(x0)} 478 C ${X(c1x)} ${c1y.toFixed(1)}, ${X(c2x)} ${c2y.toFixed(1)}, ${X(1600)} ${y1.toFixed(1)}`)
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
    <div className="stg-lines" ref={ref} style={{ top, height }} aria-hidden="true">
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
    const root = document.querySelector<HTMLElement>('.stg-cursor')
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
    <div className="stg-cursor" aria-hidden="true">
      <b className="trail" />
      <b className="lead" />
      <span className="arw"><Arrow /></span>
    </div>
  )
}

/* ── header ───────────────────────────────────────────────────────────── */
const ROUTE = '/preview/steingardur'
const NAV: { label: string; hash: string; children?: { label: string; hash: string }[] }[] = [
  {
    label: 'Þjónusta',
    hash: '#thjonusta',
    children: [
      { label: 'Lóðagerð og heimlagnir', hash: '#thjonusta' },
      { label: 'Ljósleiðari', hash: '#ljosleidari' },
      { label: 'Snjómokstur', hash: '#snjomokstur' },
      { label: 'Tækjakostur', hash: '#taekjakostur' },
    ],
  },
  { label: 'Verkin', hash: '#verkefni' },
  { label: 'Starfsfólk', hash: '#starfsfolk' },
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
      <span ref={sentinel} className="stg-scroll-top" aria-hidden="true" />
      <a className="stg-skip" href="#efni">Fara beint í efnið</a>
      <header className={`stg-head${scrolled ? ' scrolled' : ''}${light ? ' light' : ''}${open ? ' menuopen' : ''}`}>
        <div className="row">
          <Link to={ROUTE} className="mark" aria-label="Steingarður, forsíða">
            <img src={`${B}steingardur/logo.png`} alt="" width={573} height={158} />
          </Link>
          <nav aria-label="Aðalvalmynd">
            <ul>
              {NAV.map((n) => n.children ? (
                <li key={n.label} className="has-drop" ref={dropRef}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setDrop(true) }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setDrop(false) }}>
                  <button type="button" className="dropbtn" aria-expanded={drop} aria-controls="stg-drop" onClick={() => setDrop((d) => !d)}>
                    {n.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </button>
                  <div id="stg-drop" className={`drop${drop ? ' open' : ''}`}>
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
            <Btn href="#hafa-samband" variant="brand" onClick={() => go('#hafa-samband')}>Fá tilboð</Btn>
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
      <div className={`stg-menu${open ? ' open' : ''}`} aria-hidden={!open}>
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
          <Btn href="#hafa-samband" variant="light" onClick={() => go('#hafa-samband')}>Fá tilboð</Btn>
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
    try { seen = sessionStorage.getItem('stg-intro') === '1' } catch { seen = false }
    if (seen) return
    try { sessionStorage.setItem('stg-intro', '1') } catch { /* private mode */ }

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
    <div className={`stg-intro ${phase === 'gone' ? 'gone' : phase}`} aria-hidden="true">
      <span className="mark"><img src={`${B}steingardur/logo.png`} alt="" width={573} height={158} /></span>
      <span className="rule" />
    </div>
  )
}

export function StickyBar() {
  const goto = useGoto()
  return (
    <div className="stg-sticky">
      <a className="call" href={CONTACT.simiHref}>Hringja</a>
      <a className="mail" href="#hafa-samband" onClick={(e) => { e.preventDefault(); goto('#hafa-samband') }}>Fá tilboð</a>
    </div>
  )
}
