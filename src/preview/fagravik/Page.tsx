import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import Lenis from 'lenis'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import { AROUND, CONTACT, COTTAGES, IMG, JSON_LD, REVIEWS, SILASTADIR, type Cottage, type Photo } from './data'
import { StayPicker, STAY_CSS } from './StayPicker'

const company = getPreviewCompany('fagravik')
/* read once at module scope, never during render */
const YEAR = new Date().getFullYear()
const B = import.meta.env.BASE_URL

/*
 * Layout grammar from the stacked-sheet reference studied 21.09.2026
 * (_docs/STACKED-SCROLL-REFERENCE-2026-09-21.md), measured, not guessed:
 *  - THE PHOTOS STAND STILL. Every photo panel is a window onto an image
 *    fixed to the viewport; only the text, pills and the next sheet scroll.
 *    Frames 396-428 of the reference: the photo does not move a pixel while
 *    the copy rides up and the white sheet slides over it.
 *    Built as clip-path on the section + position:fixed on the image:
 *    background-attachment:fixed is ignored by iOS Safari, and overflow:clip
 *    does not clip fixed descendants, clip-path does.
 *  - every section after the hero is a sheet with rounded TOP corners,
 *    radius 3.8% of viewport width, pulled up over the previous section by
 *    that radius. No scroll listener anywhere.
 *  - content width about 86% of the viewport; image panels about 80vh;
 *    white sheets are the pauses between photo panels.
 *  - 2-column card grid with a tight gutter; fully round pill buttons with
 *    small uppercase tracked labels; rotated edge labels on both sides.
 * The content is Fagravík's own: their photos, cottages, drive times, scores.
 */

const INK = '#141B1A'
const PAPER = '#FCFCFB'

const CSS = `
@font-face{font-family:'FvD';src:url('${B}fonts/gambetta/Gambetta-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'FvS';src:url('${B}fonts/supreme/Supreme-Variable.woff2') format('woff2');font-weight:100 800;font-display:swap}
html,body{background-color:${INK}}
.fv{--ink:${INK};--paper:${PAPER};--mute:#5B6563;--line:rgba(20,27,26,.12);
  --r:clamp(22px,3.8vw,56px);--gut:clamp(20px,6.8vw,108px);--ease:cubic-bezier(.16,1,.3,1);
  font-family:'FvS',system-ui,sans-serif;color:var(--ink);background:${INK};overflow-x:clip;
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.fv *{box-sizing:border-box}
.fv img{display:block;width:100%;height:100%;object-fit:cover}
.fv picture{display:block;width:100%;height:100%}
.fv a{color:inherit}
.fv p{margin:0;max-width:56ch}
.fv .disp{font-family:'FvD',Georgia,serif;font-weight:400;letter-spacing:-.012em;line-height:1.06;margin:0;text-wrap:balance}
.fv .micro{font-size:11px;font-weight:560;letter-spacing:.18em;text-transform:uppercase}
/* land a jumped-to sheet with its rounded corners tucked under the 64px bar,
   or the photo above shows as a strip beneath it */
.fv section{scroll-margin-top:calc(64px - var(--r))}

/* the sheet: rounded top, pulled up over whatever came before */
/* overflow:CLIP, never hidden: hidden makes the sheet a scroll container, and
   every scroll-driven reveal inside it then measures its position inside a
   sheet that never scrolls, so the timeline freezes and nothing animates. */
.fv .sheet{position:relative;border-radius:var(--r) var(--r) 0 0;margin-top:calc(var(--r) * -1);overflow:clip}
/* photo windows: the section clips, the image is fixed to the viewport and
   never moves. No ancestor of .still may carry a transform or filter, or
   fixed turns back into absolute. */
.fv .win{clip-path:inset(0 round var(--r) var(--r) 0 0)}
.fv .fv-hero.win{clip-path:inset(0)}
/* measured on the reference: cottage-panel photos hold at 0px while their
   copy rises; the hero photo and the closing photo scroll with the page */
.fv .win .still{position:fixed;inset:0;height:100vh;height:100lvh;z-index:0}
/* A fixed layer is always "on screen" to the compositor, so five panels mean
   five full-viewport photo layers composited every scroll frame. Windows far
   from the viewport stand theirs down ('far' is set by an observer, so with no
   JS nothing is ever hidden). */
.fv .win.far .still,.fv .win.far .fv-edge{visibility:hidden}
.fv .win .veil,.fv .win .inner,.fv .win .in{z-index:1}

/* chrome: the house mobile standard (fixed from first paint, never moves,
   sticky awning in the island strip) carrying the reference's centred pill nav */
/* 106px tall but the bar is 64px: at rest its bottom must end under the bar
   (spans -42..64), or 42px of it shows as a second dark band over the hero.
   Stuck, it rests at -100..6, inside the island strip, behind the bar. */
.fv-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:140;background:${INK};pointer-events:none}
.fv-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:64px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--gut);
  background-color:rgba(20,27,26,.88);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);color:#fff}
.fv-bar .mark{font-family:'FvD',Georgia,serif;font-size:21px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;justify-self:center;grid-column:2;grid-row:1}
.fv-bar .mark b{font-family:'FvS',sans-serif;font-weight:640}
.fv-pillnav{display:flex;gap:.2rem;align-items:center;justify-self:start;grid-column:1;grid-row:1}
.fv-pillnav a{font-size:11.5px;font-weight:560;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;padding:.5rem .95rem;border-radius:999px;opacity:.82;transition:opacity .2s var(--ease)}
.fv-pillnav a:hover{opacity:1}
.fv-pillnav a[aria-current="page"]{background:#fff;color:${INK};opacity:1}
.fv-bar .end{justify-self:end;display:flex;align-items:center;gap:1rem;grid-column:3;grid-row:1}
.fv-pill{display:inline-flex;align-items:center;gap:.45rem;height:40px;padding:0 1.15rem;border-radius:999px;border:0;cursor:pointer;
  font:inherit;font-size:11.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;text-decoration:none;white-space:nowrap;
  background:#fff;color:${INK};transition:transform .25s var(--ease),background-color .25s var(--ease)}
.fv-pill:hover{background:#e9ecea}
.fv-pill:active{transform:scale(.97)}
.fv-pill.dark{background:${INK};color:#fff}
.fv-pill.dark:hover{background:#26302f}
.fv-pill.line{background:transparent;color:inherit;padding:0 .2rem}
.fv-pill.line:hover{opacity:.7}
/* .fv a{color:inherit} outranks a single class, so anchor pills need the extra class */
.fv .fv-pill{color:${INK}}
.fv .fv-pill.dark{color:#fff}
.fv .fv-pill.line{color:inherit}
.fv-pill .ar{font-size:14px;letter-spacing:0;line-height:1}
.fv-burger{display:none;background:none;border:0;color:#fff;font:inherit;font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;padding:.6rem 0}
.fv-menu{position:fixed;inset:64px 0 0 0;z-index:149;background:${INK};color:#fff;padding:2rem var(--gut) calc(2rem + env(safe-area-inset-bottom));
  display:flex;flex-direction:column;gap:1.3rem;visibility:hidden;clip-path:inset(0 0 100% 0);
  transition:clip-path .45s cubic-bezier(.7,0,.84,0),visibility 0s .45s}
.fv-menu.open{visibility:visible;clip-path:inset(0 0 0 0);transition:clip-path .7s var(--ease)}
.fv-menu a{opacity:0;transform:translateY(24px);transition:opacity .2s ease,transform .3s ease}
.fv-menu.open a{opacity:1;transform:none;transition:opacity .6s var(--ease) calc(.12s + var(--i,0) * 60ms),transform .8s var(--ease) calc(.12s + var(--i,0) * 60ms)}
.fv-burger span{display:inline-block;transition:opacity .25s ease,transform .35s var(--ease)}
.fv-burger[aria-expanded="true"] span{animation:fvSwap .35s var(--ease)}
@keyframes fvSwap{from{opacity:0;transform:translateY(6px)}}
.fv-menu a:not(.fv-pill){font-family:'FvD',Georgia,serif;font-size:2.2rem;text-decoration:none}
.fv-menu .fv-pill{align-self:flex-start;margin-top:auto}
@media (max-width:900px){.fv-pillnav,.fv-bar .end .fv-pill{display:none}.fv-burger{display:block}}

/* rotated edge labels: fixed to the viewport but inside each photo window,
   so they only show over photos and a white sheet clips them away */
.fv-edge{position:fixed;top:50%;z-index:2;font-size:10px;font-weight:560;letter-spacing:.22em;text-transform:uppercase;color:#fff;
  opacity:.85;pointer-events:none;white-space:nowrap}
.fv-edge.l{left:calc(var(--gut) * .38);transform:translate(-50%,-50%) rotate(-90deg)}
.fv-edge.r{right:calc(var(--gut) * .38);transform:translate(50%,-50%) rotate(90deg)}
@media (max-width:900px){.fv-edge{display:none}}

/* hero: the house landing formula (Villa North, Aurora Hills, Kalastaðir):
   the name itself is the hero, huge and centred over a full-bleed photo,
   two pills under it, small place text in the corners. It scrolls away
   under the first rounded sheet. */
.fv-hero{position:relative;min-height:100svh;color:#fff;background:${INK};overflow:clip;display:grid}
.fv-hero .bg{position:absolute;inset:0}
.fv-hero .veil{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 55%,rgba(10,14,14,.18),rgba(10,14,14,.58)),linear-gradient(to top,rgba(10,14,14,.55),rgba(10,14,14,0) 40%)}
.fv-hero .inner{position:relative;display:grid;place-items:center;align-content:center;text-align:center;padding:96px var(--gut) calc(var(--r) + 5rem);gap:1.6rem}
.fv-word{font-family:'FvD',Georgia,serif;font-weight:400;font-size:clamp(4.6rem,15.5vw,15rem);line-height:.92;letter-spacing:-.025em;margin:0}
.fv-word .w{padding-bottom:.06em}
.fv-hero .sub{font-size:clamp(1.05rem,1.5vw,1.3rem);max-width:30ch;opacity:.92;margin:0 auto}
.fv-hero .ctas{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap}
.fv-hero .fv-pill.ghost{background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.fv .fv-hero .fv-pill.ghost{color:#fff}
.fv-hero .fv-pill.ghost:hover{background:rgba(255,255,255,.2)}
.fv-hero .meta{position:absolute;top:calc(64px + 1.4rem);left:var(--gut);right:var(--gut);display:flex;justify-content:space-between;opacity:.85}
.fv-hero .base{position:absolute;left:0;right:0;bottom:calc(var(--r) + 1.6rem);display:flex;justify-content:center}
.fv-hero .base a{font-size:10.5px;font-weight:560;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;opacity:.8}
@media (max-width:900px){.fv-hero .meta{flex-direction:column;gap:.3rem;align-items:flex-start}}

/* white sheet: story, panorama band, cottage row (the house formula) */
.fv-about{background:var(--paper);padding:clamp(4rem,9vw,7.5rem) 0 clamp(4.5rem,9vw,7.5rem)}
.fv-about .top{padding:0 var(--gut)}
.fv-eyebrow{display:flex;align-items:center;gap:.9rem}
.fv-eyebrow::before{content:'';width:26px;height:1px;background:currentColor;opacity:.6}
.fv-about h2{font-size:clamp(2.2rem,4.2vw,4rem);margin:1.4rem 0 0;max-width:18ch}
.fv-about .cols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,5vw,5rem);margin-top:clamp(1.8rem,3vw,2.6rem);max-width:1080px}
.fv-about .cols p{color:var(--mute);font-size:15.5px}
.fv-pano{margin:clamp(3rem,6vw,5rem) 0 0;height:clamp(220px,34vw,560px);overflow:clip}
.fv-rowhead{padding:0 var(--gut);margin-top:clamp(3.5rem,7vw,6rem);display:flex;justify-content:space-between;align-items:end;gap:2rem;flex-wrap:wrap}
.fv-rowhead h2{margin:0;font-size:clamp(2rem,3.6vw,3.3rem)}
.fv-step{display:flex;align-items:center;gap:.9rem;flex-wrap:wrap}
.fv-step .ctl{display:inline-flex;align-items:center;gap:.4rem;border:1px solid var(--line);border-radius:999px;padding:.25rem}
.fv-step button{width:36px;height:36px;border-radius:50%;border:0;background:#EEF0EE;font:inherit;font-size:18px;cursor:pointer;color:var(--ink)}
.fv-step button:disabled{opacity:.35;cursor:default}
.fv-step output{min-width:7.5ch;text-align:center;font-weight:600;font-size:14px;font-variant-numeric:tabular-nums}
.fv-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(10px,1.4vw,20px);padding:0 var(--gut);margin-top:clamp(1.6rem,3vw,2.4rem)}
.fv-tile{display:grid;gap:.75rem;text-decoration:none;transition:opacity .45s var(--ease)}
.fv-tile[data-fit="no"]{opacity:.32}
.fv-tile .ph{aspect-ratio:4/5;border-radius:10px;overflow:clip;background:#dfe3e0}
.fv-tile .ph img{transition:transform 1.2s var(--ease)}
.fv-tile:hover .ph img{transform:scale(1.045)}
.fv-tile .k{font-size:11px;font-weight:560;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.fv-tile h3{font-size:clamp(1.15rem,1.5vw,1.45rem)}
.fv-tile .go{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.fv-fitnote{padding:0 var(--gut);margin-top:1.2rem;font-size:14px;color:var(--mute);min-height:1.4em}
@media (max-width:900px){.fv-about .cols{grid-template-columns:1fr}
  .fv-row{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:64vw;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gut);scrollbar-width:none;padding-bottom:.4rem}
  .fv-row::-webkit-scrollbar{display:none}.fv-tile{scroll-snap-align:start}}

/* FAQ, on the bay sheet */
.fv-faq{margin-top:clamp(3rem,6vw,5rem);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:clamp(1.5rem,5vw,5rem)}
.fv-faq h3{font-size:clamp(1.8rem,3vw,2.6rem)}
.fv-faq .side{position:sticky;top:96px;align-self:start;display:grid;gap:1.4rem}
.fv-faq .side .ph{aspect-ratio:4/5;border-radius:12px;overflow:clip}
@media (max-width:900px){.fv-faq .side{position:static}.fv-faq .side .ph{aspect-ratio:4/3}}
.fv-faq details{border-top:1px solid var(--line);padding:1.1rem 0}
.fv-faq details:last-child{border-bottom:1px solid var(--line)}
.fv-faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:1rem;font-weight:560;font-size:16px}
.fv-faq summary::-webkit-details-marker{display:none}
.fv-faq summary::after{content:'+';font-weight:400;font-size:20px;line-height:1;transition:transform .3s var(--ease)}
.fv-faq details[open] summary::after{transform:rotate(45deg)}
.fv-faq details p{margin-top:.7rem;color:var(--mute);font-size:15px}
@media (max-width:900px){.fv-faq{grid-template-columns:1fr}}

/* photo panels, one per cottage size */
.fv-panel{min-height:82svh;color:#fff;display:flex;align-items:flex-end;background:${INK}}
.fv-panel .bg{position:absolute;inset:0}
.fv-panel .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,14,14,.72) 0%,rgba(10,14,14,.36) 42%,rgba(10,14,14,0) 70%),linear-gradient(to top,rgba(10,14,14,.55),rgba(10,14,14,0) 45%)}
.fv-panel .inner{position:relative;padding:0 var(--gut) calc(var(--r) + clamp(2.6rem,7vh,4.5rem));display:grid;gap:1.1rem;max-width:calc(var(--gut) + 620px)}
.fv-panel h2{font-size:clamp(2rem,3.6vw,3.4rem)}
.fv-panel p{font-size:15.5px;opacity:.9;max-width:46ch}
.fv-panel .facts{display:flex;gap:1.6rem;flex-wrap:wrap;font-size:13.5px;opacity:.85}
.fv-panel .acts{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.4rem}
@media (max-width:900px){.fv-panel .veil{background:linear-gradient(to top,rgba(10,14,14,.82) 20%,rgba(10,14,14,.25) 70%)}}

/* white sheet: life on the bay, 2x2 cards */
.fv-bay{background:var(--paper);padding:clamp(4rem,9vw,7.5rem) var(--gut) clamp(5rem,10vw,8.5rem)}
.fv-bay .head{display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap}
.fv-bay h2{font-size:clamp(2.1rem,3.8vw,3.5rem)}
.fv-bay .lede{margin-top:1rem;color:var(--mute);font-size:15px;max-width:72ch}
.fv-proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-top:clamp(2rem,4vw,3rem);border-top:1px solid var(--line)}
.fv-proof div{padding-top:1.3rem}
.fv-proof b{display:block;font-family:'FvD',Georgia,serif;font-weight:400;font-size:clamp(3rem,6vw,5.5rem);line-height:.95;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.fv-proof span{display:block;margin-top:.6rem;font-size:13.5px;color:var(--mute)}
.fv-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,1.9vw,28px);margin-top:clamp(2rem,4vw,3rem)}
.fv-card{position:relative;border-radius:12px;overflow:clip;min-height:clamp(300px,27vw,420px);color:#fff;display:flex;align-items:flex-start}
.fv-card .bg{position:absolute;inset:0}
.fv-card .bg img{transition:transform 1.4s var(--ease)}
.fv-card:hover .bg img{transform:scale(1.035)}
.fv-card .veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,14,14,.62),rgba(10,14,14,.22) 60%,rgba(10,14,14,.1))}
.fv-card .tx{position:relative;padding:clamp(1.4rem,3vw,2.4rem);display:grid;gap:.9rem;max-width:520px}
.fv-card h3{font-size:clamp(1.5rem,2.2vw,2.1rem)}
.fv-tags{display:flex;gap:.4rem;flex-wrap:wrap}
.fv-tags span{height:24px;display:inline-flex;align-items:center;padding:0 .7rem;border-radius:999px;background:#fff;color:${INK};font-size:11px;font-weight:560}
.fv-card p{font-size:14px;opacity:.95}
.fv-sil{margin-top:clamp(2.5rem,5vw,4rem);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:clamp(1.5rem,5vw,4rem);padding-top:clamp(1.8rem,3vw,2.4rem);border-top:1px solid var(--line)}
.fv-sil h3{font-size:clamp(1.4rem,2vw,1.9rem)}
.fv-sil ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.2rem}
.fv-sil li b{display:block;font-weight:600;font-size:15px}
.fv-sil li span{display:block;font-size:13.5px;color:var(--mute);margin-top:.15rem}
@media (max-width:900px){.fv-grid{grid-template-columns:1fr}.fv-sil{grid-template-columns:1fr}.fv-sil ul{grid-template-columns:1fr 1fr}}

/* closing photo panel: the booking card lives here, by house rule */
.fv-close{min-height:92svh;color:#fff;background:${INK};padding:clamp(5rem,11vw,9rem) var(--gut)}
.fv-close .bg{position:absolute;inset:0}
.fv-close .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,14,14,.8),rgba(10,14,14,.45) 55%,rgba(10,14,14,.3))}
.fv-close .in{position:relative;display:grid;gap:clamp(2rem,4vw,3rem)}
.fv-close .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(2rem,6vw,6rem);align-items:end}
.fv-close h2{font-size:clamp(2.4rem,4.6vw,4.4rem);max-width:13ch}
.fv-close p{margin-top:1.3rem;opacity:.88;font-size:15.5px}
.fv-people{margin-top:2rem;display:grid;max-width:420px}
.fv-people a{display:flex;justify-content:space-between;padding:.95rem 0;border-bottom:1px solid rgba(255,255,255,.2);text-decoration:none;font-size:15px}
.fv-people a span{opacity:.72;font-variant-numeric:tabular-nums}
@media (max-width:900px){.fv-close .top{grid-template-columns:1fr}}

/* lightbox for "see inside" */
.fv-lb{position:fixed;inset:0;margin:auto;border:0;padding:0;background:transparent;color:#fff;
  width:min(1100px,calc(100vw - 32px));max-width:none;height:fit-content;max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain}
.fv-lb::backdrop{background:rgba(10,14,14,.96);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.fv-lb[open]{animation:fvLb .5s var(--ease)}
@keyframes fvLb{from{opacity:0;transform:scale(.97)}}
.fv .fv-lb .fv-pill.ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
@media (max-width:560px){.fv-lb .bar{flex-direction:column;align-items:stretch}.fv-lb .bar .b{display:grid;grid-template-columns:1fr 1fr 1fr}.fv-lb .bar .fv-pill{justify-content:center}}
.fv-lb .fr{border-radius:12px;overflow:clip;aspect-ratio:4/3;background:#222}
.fv-lb .bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;color:#fff;padding:.9rem .2rem;flex-wrap:wrap}
.fv-lb .bar .n{font-size:13px;opacity:.75;font-variant-numeric:tabular-nums}
.fv-lb .bar .b{display:flex;gap:.5rem}

.fv :focus-visible{outline:2px solid #fff;outline-offset:3px}
.fv .fv-about :focus-visible,.fv .fv-bay :focus-visible{outline-color:${INK}}

/* ── MOTION ────────────────────────────────────────────────────────────
   Scroll reveals are CSS scroll-driven animations: every one is scrubbed by
   the element's own position (house rule: position-tied, never a timed
   once-only reveal a fast flick can outrun). No observer to orphan on a route
   change, nothing for a prerender to bake. Browsers without support, and
   reduced motion, get the rest state, which is all the stylesheet defines.
   The still photos in the cottage panels are never animated. */
.fv .w{display:inline-block;overflow:clip;overflow-clip-margin:.2em;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.fv .w>span{display:inline-block}
@keyframes fvWord{from{transform:translateY(108%)}to{transform:none}}
@keyframes fvRise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes fvSettle{from{transform:scale(1.14)}to{transform:none}}
@keyframes fvLift{to{transform:translateY(-101%)}}
@keyframes fvDraw{from{transform:scaleX(0)}to{transform:none}}
@keyframes fvFade{from{opacity:0}}
@keyframes fvDrop{from{opacity:0;transform:translateY(-10px)}}
@media (prefers-reduced-motion:no-preference){
  @supports (animation-timeline: view()){
    .fv .rvh{view-timeline-name:--fvh}
    .fv .rvh .w>span{animation:fvWord linear both;animation-timeline:--fvh;
      animation-range:entry calc(var(--i,0) * 3%) cover calc(26% + var(--i,0) * 3%)}
    .fv .rv{animation:fvRise linear both;animation-timeline:view();
      animation-range:entry calc(var(--i,0) * 6%) cover calc(24% + var(--i,0) * 5%)}
  }
}

/* opening: an ink sheet with the site's own rounded corners lifts off the
   page once the hero photo has decoded, then the headline rises word by word.
   'pending' is set only in a real, motion-allowed browser; the rest state is
   the default, so a prerender or a no-JS load shows the finished page. */
.fv-curtain{position:fixed;inset:0;z-index:160;background:${INK};border-radius:0 0 var(--r) var(--r);pointer-events:none;display:none}
.fv[data-intro="pending"] .fv-curtain,.fv[data-intro="play"] .fv-curtain{display:block}
.fv[data-intro="pending"] .fv-hero h1 .w>span{transform:translateY(108%)}
.fv[data-intro="pending"] .fv-hero .sub,.fv[data-intro="pending"] .fv-hero .ctas,.fv[data-intro="pending"] .fv-hero .meta,.fv[data-intro="pending"] .fv-hero .base{opacity:0}
.fv[data-intro="pending"] .fv-hero .bg img{transform:scale(1.14)}
.fv[data-intro="pending"] .fv-bar>*,.fv[data-intro="pending"] .fv-hero .fv-edge{opacity:0}
.fv[data-intro="play"] .fv-curtain{animation:fvLift 1.15s cubic-bezier(.76,0,.24,1) .1s both}
.fv[data-intro="play"] .fv-hero .bg img{animation:fvSettle 2.6s cubic-bezier(.16,1,.3,1) .1s both}
.fv[data-intro="play"] .fv-hero h1 .w>span{animation:fvWord 1.25s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.7s + var(--i,0) * .055s)}
.fv[data-intro="play"] .fv-hero .sub{animation:fvRise .9s cubic-bezier(.16,1,.3,1) 1.35s both}
.fv[data-intro="play"] .fv-hero .ctas{animation:fvRise .9s cubic-bezier(.16,1,.3,1) 1.5s both}
.fv[data-intro="play"] .fv-hero .meta,.fv[data-intro="play"] .fv-hero .base{animation:fvFade 1s ease 1.7s both}
.fv[data-intro="play"] .fv-bar>*{animation:fvDrop .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.95s + var(--i,0) * .08s)}
.fv[data-intro="play"] .fv-hero .fv-edge{animation:fvFade 1s ease 1.6s both}

/* Lenis, as shipped on Aurora Hills: desktop only (never touch, never reduced
   motion), so the native smooth-scroll rule must not fight it. */
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto !important}
.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}

/* wordmark settle on arrival: oversized and soft, settling into focus */
@keyframes fvFocus{from{transform:scale(1.1);filter:blur(14px)}to{transform:none;filter:none}}
.fv[data-intro="pending"] .fv-hero h1{transform:scale(1.1);filter:blur(14px)}
.fv[data-intro="play"] .fv-hero h1{animation:fvFocus 1.7s cubic-bezier(.16,1,.3,1) .55s both}

/* photos drift inside their frames, tied to scroll position */
@keyframes fvDrift{from{transform:translate3d(0,-7%,0)}to{transform:translate3d(0,7%,0)}}
@keyframes fvAway{to{transform:translate3d(0,-110px,0);opacity:.06}}
/* the drifting photo is oversized INSIDE its frame by absolute position, never
   by negative margin: with overflow:clip (no new formatting context) a negative
   margin collapses through the frame and drags the whole frame up over the
   text above it (the panorama covered the story copy by ~100px). */
.fv .rv-img:not(.bg){position:absolute;inset:-9% 0;height:auto}
.fv-pano,.fv-tile .ph,.fv-faq .ph,.fv-about .card{position:relative}
.fv .fv-card .bg.rv-img{inset:-9% 0}
@media (max-width:900px){.fv .fv-row .rv,.fv .fv-row .rv-img{animation:none !important}}
@media (prefers-reduced-motion:no-preference){
  @supports (animation-timeline: view()){
    .fv .rv-img{animation:fvDrift linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
    /* the hero lifts away as the first sheet rises over it */
    .fv .fv-hero{view-timeline-name:--fvhero}
    .fv .fv-hero .inner,.fv .fv-hero .meta,.fv .fv-hero .base{animation:fvAway linear both;animation-timeline:--fvhero;animation-range:exit 0% exit 75%}
  }
}

/* footer: the site's own, the last rounded sheet, over the closing panel */
.fv-foot{position:relative;z-index:40;margin-top:calc(var(--r) * -1);border-radius:var(--r) var(--r) 0 0;background:#0E1413;color:#fff;
  padding:clamp(4rem,8vw,6.5rem) var(--gut) 2rem;overflow:clip}
.fv-foot .big{font-family:'FvD',Georgia,serif;font-weight:400;font-size:clamp(4.2rem,15vw,14rem);line-height:.9;letter-spacing:-.025em;margin:0 0 clamp(2.5rem,5vw,4rem);color:#fff}
.fv-foot .grid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:clamp(1.8rem,4vw,3.5rem);padding-top:clamp(2rem,4vw,3rem);border-top:1px solid rgba(255,255,255,.12)}
.fv-foot h4{margin:0 0 1rem;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:.55}
.fv-foot ul{list-style:none;margin:0;padding:0;display:grid;gap:.6rem;font-size:15px}
.fv-foot a{text-decoration:none;opacity:.88;transition:opacity .2s var(--ease)}
.fv-foot a:hover{opacity:1;text-decoration:underline;text-underline-offset:3px}
.fv-foot .tag{font-size:15px;opacity:.8;max-width:34ch}
.fv-foot .tag+.tag{margin-top:.7rem}
.fv-foot li span{opacity:.5}
.fv-foot .legal{margin-top:clamp(3rem,6vw,4.5rem);padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center;gap:1.2rem 2rem;flex-wrap:wrap;font-size:12.5px}
.fv-foot .legal p{margin:0;opacity:.6;max-width:none}
.fv-foot .proto{margin-top:1rem;font-size:12px;opacity:.5;max-width:90ch}
.fv-foot .proto a{text-decoration:underline}
/* SNDR credit: house markup, restyled in this build's faces */
.fv-foot .sndr{display:inline-flex;align-items:baseline;gap:.55rem;opacity:.9;text-decoration:none}
.fv-foot .sndr:hover{opacity:1;text-decoration:none}
.fv-foot .sndr__mark{font-family:'FvS',sans-serif;font-weight:640;font-size:15px;letter-spacing:.06em}
.fv-foot .sndr__mark i{font-style:normal;margin:0 .1em;font-size:.8em}
.fv-foot .sndr__studio{font-size:10.5px;font-weight:560;letter-spacing:.22em;opacity:.7}
@media (max-width:900px){.fv-foot .grid{grid-template-columns:1fr 1fr;gap:2.4rem 1.4rem}.fv-foot .grid>:first-child,.fv-foot .grid>:last-child{grid-column:1/-1}}
@media (max-width:560px){
  .fv-foot{padding-top:3.5rem}
  .fv-foot .big{font-size:23vw;margin-bottom:2rem}
  .fv-foot .grid>:last-child{grid-column:auto}
  .fv-foot a{overflow-wrap:anywhere}
  .fv-foot .grid>.stays{grid-column:1/-1}
  .fv-foot ul{gap:0;font-size:15px}
  .fv-foot li a{display:inline-block;padding:.5rem 0}
  .fv-foot .stays li{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;border-top:1px solid rgba(255,255,255,.1)}
  .fv-foot .stays li:last-child{border-bottom:1px solid rgba(255,255,255,.1)}
  .fv-foot .stays li span{font-size:13px}
  .fv-foot .legal{flex-direction:column;align-items:flex-start;gap:1rem;margin-top:2.5rem}
  .fv-foot .proto{font-size:11.5px}}
`

function Img({ p, sizes, eager, style }: { p: Photo; sizes: string; eager?: boolean; style?: CSSProperties }) {
  return <img src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.w} height={p.h} loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} />
}

const Ar = () => <span className="ar" aria-hidden="true">↗</span>

const iv = (i: number) => ({ '--i': i }) as CSSProperties

/** Each word in its own mask, so a heading can rise word by word. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}><span className="w"><span style={iv(i)}>{w}</span></span>{' '}</Fragment>
      ))}
    </>
  )
}

/** Each letter in its own mask, for the wordmark. */
function Letters({ text }: { text: string }) {
  return <>{[...text].map((ch, i) => <span key={i} className="w"><span style={iv(i)}>{ch}</span></span>)}</>
}

/** The house cottage row, with a guest stepper that dims the sizes too small. */
function CottageRow() {
  const [n, setN] = useState(4)
  const fits = (c: Cottage) => c.guests >= n
  const count = COTTAGES.filter(fits).reduce((s, c) => s + c.count, 0)
  return (
    <>
      <div className="fv-rowhead">
        <h2 className="disp rvh"><Words text="Five sizes on one bay." /></h2>
        <div className="fv-step rv" style={iv(1)}>
          <span className="micro">How many of you?</span>
          <span className="ctl" role="group" aria-label="Number of guests">
            <button onClick={() => setN((v) => Math.max(1, v - 1))} disabled={n <= 1} aria-label="One guest fewer">−</button>
            <output aria-live="polite">{n} {n === 1 ? 'guest' : 'guests'}</output>
            <button onClick={() => setN((v) => Math.min(18, v + 1))} disabled={n >= 18} aria-label="One guest more">+</button>
          </span>
        </div>
      </div>
      <div className="fv-row">
        {COTTAGES.map((c, i) => (
          <a key={c.id} className="fv-tile rv" style={iv(i)} href={`#c-${c.id}`} data-fit={fits(c) ? 'yes' : 'no'}>
            <div className="ph"><div className="rv-img"><Img p={c.photos[0]} sizes="(max-width:900px) 64vw, 18vw" /></div></div>
            <span className="k">Sleeps {c.guests}, {c.bedrooms.toLowerCase()}</span>
            <h3 className="disp">{c.name}</h3>
            <span className="go">{c.count === 1 ? 'Cottage' : 'Cottages'} {c.numbers} <Ar /></span>
          </a>
        ))}
      </div>
      <p className="fv-fitnote" aria-live="polite">
        {count ? `${count} of 12 cottages take ${n} ${n === 1 ? 'guest' : 'guests'}.` : `No single cottage takes ${n}. Book two together, or ask about Kjarrið at Sílastaðir II, which takes ten.`}
      </p>
    </>
  )
}

/* Only what the owners publish, nothing assumed. */
const FAQ: [string, string][] = [
  ['Are sheets and towels included?', 'Pillows and duvets are. Sheets and towels are not included in the price and can be rented, or bring your own.'],
  ['Where do we collect the keys?', 'Keys are handed out at the service house at Fagravík.'],
  ['How far is Akureyri?', 'The town centre is 4 km to the south, about five minutes by car. The pool at Þelamerkurskóli is eight minutes away.'],
  ['Does every cottage have a hot tub?', 'Yes. Every cottage has its own hot tub on the deck, with a grill and outdoor furniture.'],
  ['How do we find Fagravík?', 'On Route 1, about 1.5 miles north of Akureyri, a sign marks the road down to Fagravík.'],
]

/** Play the opening only in a real browser that allows motion. `?intro` forces it. */
function introStart(): 'pending' | 'done' {
  if (typeof window === 'undefined') return 'done'
  if (new URLSearchParams(window.location.search).has('intro')) return 'pending'
  const w = window as Window & { __PRERENDER__?: boolean }
  if (w.__PRERENDER__ || navigator.webdriver) return 'done'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done'
  return 'pending'
}

/**
 * Lenis exactly as shipped on Aurora Hills (02-clients/aurora-hills/src/design/
 * motion.ts): duration 1.1, desktop only. SKIPPED on touch, never tuned: Lenis
 * and iOS momentum fight over the scroll position every frame, and a JS-scrolled
 * document keeps Safari's tall bottom toolbar so the last ~90px goes dead.
 * Guarded on pointer, never on width. Anchor links glide, offset for the bar.
 */
function useLenis() {
  useEffect(() => {
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // ?nolenis turns smooth scroll off, to compare native scrolling on the same page
    const off = new URLSearchParams(window.location.search).has('nolenis')
    if (touch || reduce || off) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -72 } })
    let id = 0
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])
}

/** Mark photo windows more than a screen away as far, so their fixed layers stop compositing. */
function useFarWindows() {
  useEffect(() => {
    const wins = Array.from(document.querySelectorAll<HTMLElement>('.fv .win'))
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => {
      for (const e of es) e.target.classList.toggle('far', !e.isIntersecting)
    }, { rootMargin: '100% 0px' })
    wins.forEach((w) => io.observe(w))
    return () => { io.disconnect(); wins.forEach((w) => w.classList.remove('far')) }
  }, [])
}

/** The photo a cottage panel shows on a phone: its exterior, which reads in a tall crop. */
const mobilePhoto = (c: Cottage) => c.photos.find((p) => p.src.includes('-out-')) ?? c.photos[0]

/** A pair of rotated labels, placed inside a photo window. */
const Edges = () => (
  <>
    <span className="fv-edge l" aria-hidden="true">Scroll down</span>
    <span className="fv-edge r" aria-hidden="true">Scroll down</span>
  </>
)

const NAV: [string, string][] = [['#top', 'Home'], ['#cottages', 'Cottages'], ['#bay', 'The bay'], ['#book', 'Contact']]

function Bar() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const y = window.scrollY, b = document.body.style
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    return () => { b.position = ''; b.top = ''; b.width = ''; window.scrollTo(0, y) }
  }, [open])
  return (
    <>
      <header className="fv-bar">
        <a className="mark" href="#top" onClick={() => setOpen(false)} aria-label="Fagravík, home" style={iv(1)}>Fagra<b>vík</b></a>
        <nav className="fv-pillnav" aria-label="Main" style={iv(0)}>
          {NAV.map(([h, l], i) => <a key={h} href={h} aria-current={i === 0 ? 'page' : undefined}>{l}</a>)}
        </nav>
        <div className="end" style={iv(2)}>
          <a className="fv-pill" href="#book">Check dates <Ar /></a>
          <button className="fv-burger" aria-expanded={open} aria-controls="fv-menu" onClick={() => setOpen((o) => !o)}><span key={String(open)}>{open ? 'Close' : 'Menu'}</span></button>
        </div>
      </header>
      <div id="fv-menu" className={`fv-menu${open ? ' open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        {NAV.map(([h, l], i) => <a key={h} href={h} style={{ '--i': i } as CSSProperties} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{l}</a>)}
        <a className="fv-pill" href="#book" style={{ '--i': NAV.length } as CSSProperties} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Check dates <Ar /></a>
      </div>
    </>
  )
}

function Lightbox({ c, onClose }: { c: Cottage | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (c) { setI(0); if (!d.open) d.showModal() } else if (d.open) d.close()
  }, [c])
  const p = c ? c.photos[i] : null
  return (
    <dialog ref={ref} className="fv-lb" data-lenis-prevent onClose={onClose} aria-label={c ? `${c.name}, photos` : undefined}
      onClick={(e) => { if (e.target === ref.current) onClose() }}>
      {c && p && (
        <>
          <div className="fr"><img src={p.src} srcSet={p.srcSet} sizes="(max-width:1132px) calc(100vw - 32px), 1100px" alt={p.alt} /></div>
          <div className="bar">
            <span className="n">{c.name}, photo {i + 1} of {c.photos.length}</span>
            <span className="b">
              <button className="fv-pill" onClick={() => setI((i + c.photos.length - 1) % c.photos.length)}>Prev</button>
              <button className="fv-pill" autoFocus onClick={() => setI((i + 1) % c.photos.length)}>Next</button>
              <button className="fv-pill ghost" onClick={onClose}>Close</button>
            </span>
          </div>
        </>
      )}
    </dialog>
  )
}

/* Four cards on the bay sheet. Tags and lines are facts from the owners'
   pages and photos, nothing promotional added. */
const BAY_CARDS: { title: string; tags: string[]; text: string; p: Photo }[] = [
  { title: 'Midnight sun', tags: ['Summer', 'Eyjafjörður'], text: 'In early summer the sun barely sets. The evenings over the fjord run late and gold.', p: IMG.sunsetPink },
  { title: 'Deep winter', tags: ['Winter', 'Snow'], text: 'The bay freezes at the edges and the mountains across the fjord turn white.', p: IMG.heroWinter },
  { title: 'A tub at every door', tags: ['Every cottage', 'Private'], text: 'Each cottage has its own hot tub on the deck, with a grill and outdoor furniture.', p: IMG.tub },
  { title: 'Five minutes to Akureyri', tags: ['Pool 8 min', 'Skiing', 'Golf'], text: `${AROUND[2].detail} for skiing, Jaðar for golf, Húsavík for whale watching in summer.`, p: IMG.boat },
]

export default function FagravikPage() {
  const [box, setBox] = useState<Cottage | null>(null)
  useLenis()
  useFarWindows()
  const [intro, setIntro] = useState<'pending' | 'play' | 'done'>(introStart)
  useEffect(() => {
    if (intro !== 'pending') return
    let done = false
    const go = () => { if (!done) { done = true; setIntro('play') } }
    const cap = window.setTimeout(go, 1500) // never hold the page longer than this
    document.querySelector<HTMLImageElement>('.fv-hero .bg img')?.decode().then(go, go)
    return () => { done = true; window.clearTimeout(cap) }
  }, [intro])
  useEffect(() => {
    if (intro !== 'play') return
    const t = window.setTimeout(() => setIntro('done'), 2700)
    return () => window.clearTimeout(t)
  }, [intro])
  useEffect(() => {
    setThemeColor(INK)
    const t = document.title
    document.title = 'Fagravík cottages, 4 km north of Akureyri'
    const a = setMetaDescription('Twelve cottages on the shore of Eyjafjörður, 4 km north of Akureyri, each with its own hot tub. From a studio for three to a four-bedroom house for eight.')
    const b = setNoindex(true)
    return () => { document.title = t; a(); b() }
  }, [])

  // later sheets paint over earlier ones
  let z = 1
  const zi = (): CSSProperties => ({ zIndex: ++z })

  return (
    <div className="fv" lang="en" data-intro={intro}>
      <style>{CSS + STAY_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <div className="fv-awning" id="top" aria-hidden="true" />
      <div className="fv-curtain" aria-hidden="true" />
      <Bar />
      <PreviewChrome company={company} />

      <main>
        <section className="fv-hero win" aria-labelledby="fv-h1" style={{ zIndex: 1 }}>
          <div className="bg"><Img p={IMG.hero} sizes="100vw" eager /></div>
          <div className="veil" />
          <Edges />
          <div className="meta micro"><span>Eyjafjörður, 4 km north of Akureyri</span><span>Twelve cottages, one bay</span></div>
          <div className="inner">
            <h1 className="fv-word" id="fv-h1" aria-label="Fagravík"><Letters text="Fagravík" /></h1>
            <p className="sub">Twelve cottages on the shore of Eyjafjörður, each with its own hot tub.</p>
            <div className="ctas">
              <a className="fv-pill" href="#cottages">View the cottages <Ar /></a>
              <a className="fv-pill ghost" href="#book">Check dates</a>
            </div>
          </div>
          <div className="base"><a href="#story">Scroll to the bay</a></div>
        </section>

        <section className="sheet fv-about" id="story" aria-labelledby="fv-about-h" style={zi()}>
          <div className="top">
            <span className="micro fv-eyebrow rv" style={iv(0)}>About Fagravík</span>
            <h2 className="disp rvh" id="fv-about-h"><Words text="Summer, winter, autumn and spring, warm and cosy, waiting for you." /></h2>
            <div className="cols">
              <p className="rv" style={iv(1)}>Thirteen cottages stand on Fagravík bay, 4 km north of Akureyri, twelve of them to let. Every one has its own hot tub on the deck, a kitchen, a grill and outdoor furniture.</p>
              <p className="rv" style={iv(2)}>Five sizes, from a studio for three to a four-bedroom house for eight. Auður and Soffía take bookings by phone and email, and guests score the location {REVIEWS.categories[0].score} out of 10 on {REVIEWS.source}.</p>
            </div>
          </div>
          <div className="fv-pano"><div className="rv-img"><Img p={IMG.pano} sizes="100vw" /></div></div>
          <div id="cottages" style={{ scrollMarginTop: 72 }} />
          <CottageRow />
        </section>

        {COTTAGES.map((c) => (
          <section key={c.id} id={`c-${c.id}`} className="sheet fv-panel win" aria-labelledby={`h-${c.id}`} style={zi()}>
            <div className="bg still">
              {/* phones: a tall portrait crop shows a landscape photo about 3x enlarged, so an
                  interior becomes close-ups of chair legs. The exterior survives the crop. */}
              <picture>
                <source media="(max-width: 900px)" srcSet={mobilePhoto(c).srcSet} sizes="100vw" />
                <Img p={c.photos[0]} sizes="100vw" />
              </picture>
            </div>
            <div className="veil" />
            <Edges />
            <div className="inner">
              <h2 className="disp rvh" id={`h-${c.id}`}><Words text={c.name} /></h2>
              <p className="rv" style={iv(0)}>{c.beds}. A kitchen, a private hot tub on the deck, a grill and outdoor furniture.</p>
              <div className="facts rv" style={iv(1)}><span>Up to {c.guests} guests</span><span>{c.bedrooms}</span><span>{c.count === 1 ? 'Cottage' : 'Cottages'} {c.numbers}</span></div>
              <div className="acts rv" style={iv(2)}>
                <button className="fv-pill" onClick={() => setBox(c)}>See inside <Ar /></button>
                <a className="fv-pill" href="#book">Check dates</a>
              </div>
            </div>
          </section>
        ))}

        <section className="sheet fv-bay" id="bay" aria-labelledby="fv-bay-h" style={zi()}>
          <div className="head">
            <h2 className="disp rvh" id="fv-bay-h"><Words text="Life on the bay" /></h2>
            <a className="fv-pill dark rv" style={iv(1)} href={REVIEWS.url} target="_blank" rel="noopener">Read reviews <Ar /></a>
          </div>
          <p className="lede rv" style={iv(1)}>Guests score the location {REVIEWS.categories[0].score} out of 10. The fjord in two seasons, the tub on the deck, and the town five minutes away.</p>
          <div className="fv-proof">
            <div className="rv" style={iv(0)}><b>{REVIEWS.score}</b><span>out of 10 on {REVIEWS.source}</span></div>
            <div className="rv" style={iv(1)}><b>{REVIEWS.count}</b><span>guest reviews</span></div>
            <div className="rv" style={iv(2)}><b>{REVIEWS.categories[0].score}</b><span>for the location</span></div>
          </div>
          <div className="fv-grid">
            {BAY_CARDS.map((k, i) => (
              <article key={k.title} className="fv-card rv" style={iv(i % 2)}>
                <div className="bg rv-img"><Img p={k.p} sizes="(max-width:900px) 100vw, 43vw" /></div>
                <div className="veil" />
                <div className="tx">
                  <h3 className="disp">{k.title}</h3>
                  <div className="fv-tags">{k.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <p>{k.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="fv-sil">
            <div>
              <h3 className="disp rvh"><Words text={`Also ours: ${SILASTADIR.name}`} /></h3>
              <p className="rv" style={{ ...iv(1), marginTop: '.6rem', color: 'var(--mute)', fontSize: 14.5 }}>{SILASTADIR.where}.</p>
            </div>
            <ul>{SILASTADIR.units.map((u, i) => <li key={u.name} className="rv" style={iv(i)}><b>{u.name}</b><span>{u.guests}, {u.note}</span></li>)}</ul>
          </div>
          <div className="fv-faq" id="faq">
            <div className="side">
              <h3 className="disp rvh"><Words text="Good to know before you come." /></h3>
              <div className="ph rv" style={iv(1)}><div className="rv-img"><Img p={IMG.tubTall} sizes="(max-width:900px) 100vw, 36vw" /></div></div>
            </div>
            <div>{FAQ.map(([q, a], i) => (
              <details key={q} className="rv" style={iv(i)}><summary>{q}</summary><p>{a}</p></details>
            ))}</div>
          </div>
        </section>

        <section className="sheet fv-close win" id="book" aria-labelledby="fv-book-h" style={zi()}>
          <div className="bg"><Img p={IMG.sunsetField} sizes="100vw" /></div>
          <div className="veil" />
          <Edges />
          <div className="in">
            <div className="top">
              <div>
                <h2 className="disp rvh" id="fv-book-h"><Words text="Pick your nights, or just call." /></h2>
                <p className="rv" style={iv(1)}>Choose a cottage and your dates, and see the live prices on the owners’ calendar. Sheets and towels are not included and can be rented. Keys are handed out at the service house.</p>
              </div>
              <div className="fv-people rv" style={iv(2)}>
                {CONTACT.people.map((p) => <a key={p.name} href={`tel:${p.tel}`}>{p.name}<span>{p.phone}</span></a>)}
                <a href={`mailto:${CONTACT.email}`}>Email<span>{CONTACT.email}</span></a>
              </div>
            </div>
            <div className="rv" style={iv(1)}><StayPicker /></div>
          </div>
        </section>
      </main>

      <Lightbox c={box} onClose={() => setBox(null)} />
      <footer className="fv-foot">
        <p className="big" aria-hidden="true">Fagravík</p>
        <div className="grid">
          <div>
            <h4>Aurora Vacation Homes</h4>
            <p className="tag">Twelve cottages on the shore of Eyjafjörður, each with its own hot tub.</p>
            <p className="tag">Fagravík, 4 km north of Akureyri, North Iceland.</p>
          </div>
          <div className="stays">
            <h4>The cottages</h4>
            <ul>{COTTAGES.map((c) => <li key={c.id}><a href={`#c-${c.id}`}>{c.name.replace(/ cottage$/, '')}</a> <span>sleeps {c.guests}</span></li>)}</ul>
          </div>
          <div>
            <h4>Good to know</h4>
            <ul>
              <li><a href="#story">About Fagravík</a></li>
              <li><a href="#bay">Life on the bay</a></li>
              <li><a href="#faq">Before you come</a></li>
              <li><a href="#book">Check dates</a></li>
              <li><a href={REVIEWS.url} target="_blank" rel="noopener">Guest reviews</a></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              {CONTACT.people.map((p) => <li key={p.name}><a href={`tel:${p.tel}`}>{p.name}, {p.phone}</a></li>)}
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>Aurora Vacation Homes sf. · kt. 521216-1820 · Fagravík, 601 Akureyri · © {YEAR}</p>
          {/* The SNDR credit is a launch gate: wordmark + text, linked to the studio. */}
          <a className="sndr" href="https://sndrstudio.is" target="_blank" rel="noopener" aria-label="Designed by SNDR Studio" data-logotype>
            <span className="sndr__mark">SN<i>✦</i>DR</span><span className="sndr__studio">STUDIO</span>
          </a>
        </div>
        <p className="proto">
          Prototype: a design concept, not the company’s live website. Text, facts and photographs come from{' '}
          <a href={company.currentUrl} target="_blank" rel="noopener">fagravik.is</a> and the property’s {REVIEWS.source} listing, collected September 2026.
        </p>
      </footer>
    </div>
  )
}
