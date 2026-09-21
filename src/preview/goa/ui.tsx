import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { PokaHnappur, poki } from './poki'

/* The noho.ink system, transplanted onto Góa. Source of every number here:
   _docs/noho-teardown.md (§ refs below). Re-aimed from the declined Iceherbs
   build, then rebuilt for fidelity on 2026-09-21 (Sindri: "much missing in
   terms of that entire website design, movement, scroll, layout, animations
   and overall feel"). Deviations are declared in _docs/GOA-DESIGN-2026-09-21.md.

   The two rules that carry the whole thing:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped
        parent, opacity untouched. Title lines start at 108%.
     2. One ease does almost everything: custom-our = cubic-bezier(.17,.17,0,1). */

export const C = {
  rautt: '#C21514',
  gull: '#F9D100',
  blek: '#2D1105',
  pappir: '#EFE4D0',
  pappirHreint: '#F8F1E4',
  dokkt: '#2A1A10',
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

/* §0.7: device and input are two axes. Compact = the tablet/phone layout. */
export const isCompact = () => typeof window !== 'undefined' && window.innerWidth <= 991
export const isPhone = () => typeof window !== 'undefined' && window.innerWidth <= 479

const D = (n: string) => `${import.meta.env.BASE_URL}fonts/${n}`

/* Tokens are registered so the 0.6s theme switch interpolates every one of
   them individually, which is what noho does with its 24 (§4.7): a mid-tween
   frame shows colours that belong to neither palette. */
const TOK: [string, string][] = [
  ['--c-bg', '#F8F1E4'], ['--c-el', '#EFE4D0'], ['--c-el2', '#E7D6B9'], ['--c-el3', '#D9C29C'],
  ['--c-ink', '#2D1105'], ['--c-ink-med', 'rgba(45,17,5,.6)'], ['--c-ink-max', 'rgba(45,17,5,.4)'],
  ['--c-btn', '#2D1105'], ['--c-btn-t', '#F8F1E4'], ['--c-btn2', '#FFFDF8'], ['--c-btn2-t', '#2D1105'],
  ['--c-form', '#FFFDF8'], ['--c-rautt', '#C21514'], ['--c-lina', 'rgba(45,17,5,.14)'],
]

export const CSS = `
@font-face{font-family:'GOA Gambarino';src:url('${D('gambarino/Gambarino-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'GOA General';src:url('${D('general-sans/GeneralSans-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}

${TOK.map(([k, v]) => `@property ${k}{syntax:'<color>';inherits:true;initial-value:${v}}`).join('\n')}

/* Palette, in noho's tiers (§1 of the CSS part): a warm page, three element
   grounds that cards cycle through by position, charcoal-brown ink, square
   buttons. Góa's red and gold are accents only, the way noho keeps its colour
   in the photography. Dark is warm brown, not grey (#2E241C there, the walnut
   in their photos; here the Hraun wrapper's brown), and the header chrome and
   the switches deliberately stay light in it. */
.goa-root{
  ${TOK.map(([k, v]) => `${k}:${v};`).join(' ')}
  --c-gull:#F9D100; --c-hdr:#FFFDF8; --c-hdr-t:#2D1105;
  --c-flotur:var(--c-el);
  --ease:cubic-bezier(.17,.17,0,1);
  --ease-popup:cubic-bezier(.6,0,0,1);
  --ease-cas:cubic-bezier(.2,0,.1,1);
  --f-disp:'GOA Gambarino',Georgia,serif;
  /* §4 layout primitives: one gutter and one section gap, both viewport
     units, changing twice. Sections carry no vertical padding at all. */
  --gut:2.0833vw;
  --gap:22.2222vh;
  --band:var(--gap);
  --col:1.0417vw;
  background:var(--c-bg); color:var(--c-ink);
  font-family:'GOA General',system-ui,sans-serif;
  font-size:clamp(16px,1.0417vw,19px); line-height:1.5;
  -webkit-font-smoothing:antialiased;
  transition:${TOK.map(([k]) => `${k} .6s var(--ease)`).join(',')};
  display:flex;flex-direction:column;row-gap:var(--gap);
  overflow-x:clip;
}
@media (max-width:991px){.goa-root{--gut:2.604vw;--gap:12.121vh;--col:1.302vw}}
@media (max-width:479px){.goa-root{--gut:max(2.778vw,12px);--gap:12.5vh;--col:2.778vw}}
.goa-root[data-tema="dokkt"]{
  --c-bg:#2A1A10; --c-el:#3E2A1C; --c-el2:#4E3726; --c-el3:#654832;
  --c-ink:#F3EADB; --c-ink-med:rgba(243,234,219,.6); --c-ink-max:rgba(243,234,219,.45);
  --c-btn:#F3EADB; --c-btn-t:#1C0D0D; --c-btn2:#2A1A10; --c-btn2-t:#FFFDF8;
  --c-form:#F3EADB; --c-rautt:#F9D100; --c-lina:rgba(243,234,219,.18);
  --c-hdr:#1F130B; --c-hdr-t:#F3EADB;
}
.goa-root > main{display:contents}
/* the shared prototype credit follows main inside the root; without this
   it sat one section gap below the red footer, on a bare brown/cream band */
.goa-root > main + *{margin-top:calc(-1 * var(--gap))}
.goa-root *,.goa-root *::before,.goa-root *::after{box-sizing:border-box}
.goa-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(194,21,20,.14)}
.goa-root{color-scheme:light}
.goa-root[data-tema="dokkt"]{color-scheme:dark}
/* Safari 26 tints the status and home-indicator strips from html/body, not
   from an inner wrapper, so the page colour has to live there too. */
html:has(.goa-root),body:has(.goa-root){background-color:#F8F1E4}
html:has(.goa-root[data-tema="dokkt"]),body:has(.goa-root[data-tema="dokkt"]){background-color:#2A1A10}
.goa-root :is(section[id],[id].goa-kafli){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
.goa-root img{display:block;max-width:100%;height:auto}
.goa-root a{color:inherit;text-decoration:none}
.goa-root :focus-visible{outline:2px solid var(--c-rautt);outline-offset:3px}
:where(.goa-root) button{font:inherit;color:inherit}

/* type: §5.3. Every size locked to the viewport width, a different vw per
   breakpoint, tablet and phone sharing a scale. Gambarino is Sindri's pick
   over the reference's Switzer; its tracking is opened from -0.04em to
   -0.03em because a serif at -0.04 closes its counters (declared). */
.goa-disp{font-family:var(--f-disp);font-weight:400;letter-spacing:-.03em;line-height:1;
  font-size:4.17vw;margin:0;text-wrap:balance}
@media (max-width:991px){.goa-disp{font-size:6.25vw;line-height:.95}}
@media (max-width:479px){.goa-disp{font-size:min(13.333vw,3.4rem);line-height:.95}}
.goa-sub{font-family:var(--f-disp);font-weight:400;letter-spacing:-.02em;line-height:1.05;
  font-size:2.08vw;margin:0}
@media (max-width:991px){.goa-sub{font-size:3.255vw}}
@media (max-width:479px){.goa-sub{font-size:max(1.35rem,6.4vw)}}
.goa-merki{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:var(--c-ink-med);margin:0 0 1em}
.goa-brod{max-width:52ch;margin:0;color:var(--c-ink)}
.goa-daufur{color:var(--c-ink-med)}
.goa-smatt{font-size:.8rem;line-height:1.45;color:var(--c-ink-med);margin:.25rem 0 0}
.goa-verd{font-variant-numeric:tabular-nums;font-weight:500}
.goa-wrap{padding:0 var(--gut);position:relative}
/* headings centred on desktop and tablet, flush left on a phone (§5.3:
   13 start / 11 centred at 1440, 23 / 1 at 390) */
.goa-midja{text-align:center;margin-left:auto;margin-right:auto}
@media (max-width:479px){.goa-midja{text-align:left;margin-left:0}}

/* mask rise. opacity is never animated anywhere on this page. --- */
.goa-mask{overflow:hidden;display:block}
.goa-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.goa-maskP > .goa-up{transform:translateY(118%)}
.on .goa-maskP > .goa-up,.goa-maskP.on > .goa-up,.goa-maskP > .goa-up.on{transform:translateY(0)}
.goa-root.goa-allt .goa-maskP > .goa-up{transform:translateY(0)}
/* Display masks need room at both ends for Icelandic: the acute on Ú and Í
   sits above cap height, ð g ö þ hang below the baseline. Paid back with
   negative margin so the rhythm does not move; lines start at 125%. */
.goa-disp .goa-mask,.goa-sub .goa-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
.goa-disp .goa-lina,.goa-sub .goa-lina{transform:translateY(125%)}
.on .goa-disp .goa-lina,.goa-disp.on .goa-lina,.goa-disp .goa-lina.on,
.on .goa-sub .goa-lina,.goa-sub .goa-lina.on{transform:translateY(0)}
.goa-root.goa-allt .goa-disp .goa-lina,.goa-root.goa-allt .goa-sub .goa-lina{transform:translateY(0)}
.goa-up{transform:translateY(100%);transition:transform var(--dur,1s) var(--ease);transition-delay:var(--d,0s);will-change:transform}
.goa-lina{transform:translateY(108%)}
.on .goa-up,.goa-up.on{transform:translateY(0)}
/* §4.4: on a phone a staggered group becomes one trigger per item, so the
   stagger delay goes; each item rises as it reaches the reading zone. */
@media (max-width:479px){.goa-hver > * .goa-up,.goa-hver > .goa-up{transition-delay:0s}}

/* buttons: square, noho's three kinds (§6). Labels roll per letter. */
.goa-btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;border:0;cursor:pointer;
  padding:1.042vw 2.865vw;min-height:44px;font-size:.92rem;font-weight:500;
  background:var(--c-btn);color:var(--c-btn-t);transition:transform .15s ease-out}
.goa-btn.sc{background:var(--c-btn2);color:var(--c-btn2-t)}
.goa-btn.stor{width:100%;padding:1.615vw 2.865vw}
.goa-btn:active{transform:scale(.97)}
@media (max-width:991px){.goa-btn{padding:1.628vw 7.161vw}.goa-btn.stor{padding:2.279vw 7.161vw}}
@media (max-width:479px){.goa-btn{padding:3.472vw 9vw}.goa-btn.stor{padding:4.861vw 9vw}}
.goa-btn[disabled]{opacity:.45;cursor:not-allowed}
/* the order drawer's button, kept as the same square primary */
.goa-hnappur{display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;min-height:48px;padding:0 1.5rem;
  font-size:.95rem;font-weight:500;background:var(--c-btn);color:var(--c-btn-t)}
.goa-hnappur:active{transform:scale(.98)}

/* the cascade (§3 heavy bundle, §4b.7): each label is two identical lines of
   per-letter spans in a one-line mask; on hover both lines rise one line,
   staggered across ~0.15s, on the cascade ease. Same primitive as every
   reveal on the page, applied to a 15px label. */
.goa-cas{display:inline-block;height:1.25em;line-height:1.25em;overflow:hidden;vertical-align:top}
.goa-casL{display:block;white-space:pre;height:1.25em}
.goa-casL > span{display:inline-block;transition:transform var(--cd,.5s) var(--ease-cas);
  transition-delay:calc(var(--i,0) * var(--cs,.02s))}
@media (hover:hover) and (pointer:fine){
  .goa-casH:hover .goa-casL > span,.goa-casH:focus-visible .goa-casL > span{transform:translateY(-100%)}
}

/* the no-background link: icon nudges, label dims (§4) */
.goa-nobg{display:inline-flex;align-items:center;gap:.45em;min-height:44px;font-weight:500;cursor:pointer;
  background:none;border:0;padding:0;color:var(--c-ink);transition:color .2s ease-out}
.goa-nobg i{font-style:normal;display:inline-block;transition:transform .2s ease-out}
@media (hover:hover) and (pointer:fine){.goa-nobg:hover{color:var(--c-ink-med)}.goa-nobg:hover i{transform:translateX(.417vw)}}

/* header: three headers, not one with things hidden (§5.4) ---------- */
.goa-haus{position:fixed;z-index:60;top:2.0833vw;left:2.0833vw;right:2.0833vw;
  display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none}
.goa-haus > *{pointer-events:auto}
.goa-merkid{display:inline-flex;line-height:0}
.goa-merkid img{height:clamp(44px,3.6vw,56px);width:auto}
.goa-hausH{display:flex;align-items:flex-start;gap:.5rem;position:relative}
.goa-haus .goa-pokiH{background:var(--c-hdr);color:var(--c-hdr-t);min-height:max(2.5vw,40px);padding:0 .9rem}
@media (min-width:992px){.goa-valPan{display:none}}
.goa-hausB{display:flex;align-items:stretch;color:var(--c-hdr-t);min-height:max(2.5vw,40px)}
/* desktop: the nav row lives off to the right, clipped, and slides in with
   a 0.02s stagger when the burger opens (§4b.3). */
.goa-navK{overflow:hidden;display:flex}
/* the row sits wholly past its clip box (noho parks it at left:101%) and
   each button follows with a 0.02s stagger, so at rest nothing of it shows */
.goa-nav{display:flex;align-items:stretch}
.goa-nav > *{background:var(--c-hdr);transform:translateX(calc(var(--navW,700px) + 1px));transition:transform .4s var(--ease);
  transition-delay:calc((var(--n,5) - var(--i,0)) * .02s)}
.goa-haus.opin .goa-nav > *{transform:none;transition-delay:calc(var(--i,0) * .02s)}
.goa-nav a,.goa-orka{display:inline-flex;align-items:center;gap:.5rem;padding:0 1.25vw;font-size:.86rem;
  white-space:nowrap;border:0;background:none;cursor:pointer;color:inherit;min-height:max(2.5vw,40px);
  box-shadow:inset -1px 0 0 rgba(45,17,5,.08)}
.goa-braud{width:max(2.5vw,40px);height:max(2.5vw,40px);border:0;background:var(--c-hdr);cursor:pointer;
  display:grid;place-items:center;padding:0;flex:none;color:var(--c-hdr-t)}
.goa-braud span{position:relative;width:1.1vw;min-width:16px;height:10px;display:block}
/* the burger: two steps, translate then rotate on open, reversed on close
   (0.2s + 0.2s, §4b.3). Individual transform properties let each step keep
   its own delay. */
.goa-braud i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;display:block;
  transition:translate .2s var(--ease) .2s,rotate .2s var(--ease) 0s,opacity .1s linear .2s}
.goa-braud i:nth-child(1){top:0}.goa-braud i:nth-child(2){top:4.25px}.goa-braud i:nth-child(3){top:8.5px}
.goa-haus.opin .goa-braud i{transition:translate .2s var(--ease) 0s,rotate .2s var(--ease) .2s,opacity .1s linear 0s}
.goa-haus.opin .goa-braud i:nth-child(1){translate:0 4.25px;rotate:-45deg}
.goa-haus.opin .goa-braud i:nth-child(2){opacity:0}
.goa-haus.opin .goa-braud i:nth-child(3){translate:0 -4.25px;rotate:-135deg}

/* energy readout: High/Med/Low as coloured pills in a clipped column that
   rolls one pill per state (§4.7). noho's high/med/low are orange/yellow/lime;
   here Toffí orange, crown gold and pipar lime. */
.goa-orkaG{display:inline-block;height:1.35em;overflow:hidden;border-radius:999px;vertical-align:middle;font-size:.72rem}
.goa-orkaR{display:block;transition:transform .4s var(--ease);transform:translateY(calc(var(--stig,0) * -1.85em))}
.goa-orkaR span{display:block;height:1.35em;line-height:1.35em;margin-bottom:.5em;padding:0 .6em;font-weight:600;
  color:#2D1105;border-radius:999px}
.goa-orkaR span:nth-child(1){background:#F0913F}.goa-orkaR span:nth-child(2){background:#F9D100}
.goa-orkaR span:nth-child(3){background:#BAE31C}
.goa-orka svg{transition:transform .4s var(--ease)}
.goa-orka[aria-expanded="true"] svg{transform:rotate(180deg)}

/* panels hang under the bar in a clip box and drop from -101% (§4b.3) */
.goa-panK{position:absolute;top:100%;right:0;overflow:hidden;pointer-events:none;display:grid}
/* both panels share one cell: a closed one must not take height and push the
   open one down the screen (found on the iPhone, 2026-09-21) */
.goa-panK > .goa-pan{grid-area:1/1;align-self:start}
.goa-pan{pointer-events:auto;background:var(--c-hdr);color:var(--c-hdr-t);transform:translateY(-101%);
  visibility:hidden;transition:transform .4s var(--ease),visibility 0s .4s}
.goa-pan.opid{transform:none;visibility:visible;transition:transform .4s var(--ease),visibility 0s}
.goa-orkuPan{display:grid;grid-template-columns:1fr 1fr;gap:1.6rem;padding:1.2rem 1.25vw 1.4rem;width:min(44rem,60vw)}
.goa-orkuPan h3{margin:0 0 .5rem;font-size:.86rem;font-weight:500;display:flex;gap:.5rem;align-items:center}
.goa-rofiRod{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.goa-rofi{position:relative;width:44px;height:44px;border:0;background:transparent;cursor:pointer;padding:0;
  flex-shrink:0;display:grid;place-items:center}
.goa-rofi::before{content:'';width:27px;height:14px;border-radius:50px;background:#E7D6B9;transition:background .2s var(--ease)}
.goa-rofi[aria-checked="true"]::before{background:#2D1105}
.goa-rofi i{position:absolute;left:calc(50% - 12px);top:50%;margin-top:-5.5px;width:11px;height:11px;border-radius:3px;
  background:#FFFDF8;display:block;transition:transform .2s var(--ease)}
.goa-rofi[aria-checked="true"] i{transform:translateX(13px)}
.goa-pan .goa-smatt{color:color-mix(in srgb,var(--c-hdr-t) 62%,transparent)}
.goa-root[data-tema="dokkt"] .goa-rofi::before{background:var(--c-el3)}
.goa-root[data-tema="dokkt"] .goa-rofi[aria-checked="true"]::before{background:var(--c-rautt)}

/* compact (§5.4): the mobile chrome standard, not noho's floating bar. A
   constant full-width bar in the page's own paper, never hides or moves;
   crest, the energy pill, the bag and the burger. Panels drop beneath it. */
@media (max-width:991px){
  .goa-haus{top:0;left:0;right:0;align-items:center;padding:calc(.5rem + env(safe-area-inset-top)) var(--gut) .5rem;
    background:color-mix(in srgb,var(--c-bg) 90%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    box-shadow:inset 0 -1px 0 var(--c-lina);pointer-events:auto}
  .goa-merkid img{height:44px}
  .goa-hausH{align-items:center;position:static}
  .goa-haus .goa-pokiH{background:transparent;color:var(--c-ink);padding:0 .3rem}
  .goa-hausB{background:transparent;color:var(--c-ink)}
  .goa-navK{display:none}
  .goa-orkaM{display:inline-flex}
  .goa-braud{background:var(--c-hdr);color:var(--c-hdr-t)}
  .goa-panK{left:0;right:0;top:100%}
  .goa-orkuPan{width:auto;grid-template-columns:1fr;padding:1.1rem var(--gut) 1.4rem}
}
@media (min-width:992px){.goa-orkaM{display:none}}
.goa-valPan{padding:.6rem var(--gut) calc(1rem + env(safe-area-inset-bottom));max-height:calc(100svh - 64px);overflow:auto;
  overscroll-behavior:contain}
.goa-valKort{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem}
.goa-valKort a{background:var(--c-el);display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.9rem .5rem .7rem;
  font-size:.86rem;color:var(--c-hdr-t)}
.goa-valKort img{height:96px;width:auto;object-fit:contain}
.goa-valRod{display:grid}
.goa-valRod a{display:flex;align-items:center;min-height:52px;padding:0 .9rem;background:var(--c-el);margin-bottom:2px;overflow:hidden}
.goa-valRod a span{display:block;transform:translateY(105%);transition:transform .2s cubic-bezier(.4,0,1,1)}
.goa-pan.opid .goa-valRod a span{transform:none;transition:transform .55s var(--ease);transition-delay:calc(.08s + var(--i,0) * .04s)}
.goa-valPan .goa-btn{margin-top:.4rem}

/* the magnet cursor (§4b.2): a 1.0417vw dot that grows to 8.854vw with a word
   in it. One fixed box scaled on the GPU, never resized. */
.goa-bendill{position:fixed;top:0;left:0;z-index:90;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;color:var(--c-btn-t);width:8.854vw;height:8.854vw;margin:-4.427vw 0 0 -4.427vw;
  font-size:.92rem;font-weight:500;will-change:transform}
.goa-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;background:var(--c-btn);
  transform:scale(.1177);transition:transform .4s var(--ease),background .4s var(--ease)}
.goa-bendill.stor i{transform:scale(1)}
.goa-bendill.yta i{transform:scale(.106)}
.goa-bendill.stor.yta i{transform:scale(.9)}
.goa-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.goa-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){.goa-bendill{display:none}}

@media (prefers-reduced-motion:reduce){
  .goa-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .goa-up{transform:none !important}
}
.goa-root[data-hreyfing="min"] .goa-up{transform:none !important;transition:none !important}
.goa-root.goa-allt .goa-up{transform:translateY(0)}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener.
 * ---------------------------------------------------------------- */
export function useWatchdog(ms = 12000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.goa-root')?.classList.add('goa-allt')
    }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}

/* §4.4: the default trigger is "top reaches 80% down the viewport", line
   titles fire half a viewport early. Firing early is also the fix for the
   standing rule that a fixed-duration reveal must not be outrun: content is
   resolved before it reaches the reading zone. */
export function useInview<T extends HTMLElement>(margin = '0px 0px -12% 0px', hver = false) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    /* on a phone, a group becomes one trigger per item */
    if (hver && isPhone()) {
      const kids = [...el.children] as HTMLElement[]
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } })
      }, { rootMargin: margin, threshold: 0 })
      kids.forEach((k) => io.observe(k))
      return () => io.disconnect()
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { rootMargin: margin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, hver])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style, hver = false, margin, id }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer' | 'figure'
  className?: string; children: ReactNode; style?: CSSProperties; hver?: boolean; margin?: string; id?: string
}) {
  const ref = useInview<HTMLDivElement>(margin, hver)
  return (
    <Tag ref={ref as never} id={id} className={`${className}${hver ? ' goa-hver' : ''}`} style={style}>{children}</Tag>
  )
}

/* ------------------------------------------------------------------
   The scroll: Lenis at duration 3 (§4.3). Fine pointers only; phones keep
   native momentum (declared deviation 2).
   ------------------------------------------------------------------ */
const isTouch = () => !finePointer()
type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | Element, o?: object) => void; stop: () => void; start: () => void; resize: () => void }
export const lenisOf = () => (window as unknown as { __goaLenis?: LenisLike }).__goaLenis

export function useMjukSkrun() {
  useEffect(() => {
    if (reduced()) return
    if (isTouch()) return
    let lifandi = true
    let raf = 0
    let lenis: LenisLike | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = isTouch() ? null : (new Lenis({ duration: 3, smoothWheel: true, gestureOrientation: 'vertical', allowNestedScroll: true }) as unknown as LenisLike)
      if (!lenis) return
      lenis.scrollTo(0, { immediate: true })
      ;(window as unknown as { __goaLenis?: unknown }).__goaLenis = lenis
      /* the intro holds the page still; if it is still running, stop now */
      if (document.querySelector('.goa-root.goa-hled')) lenis.stop()
      const tikk = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(tikk) }
      raf = requestAnimationFrame(tikk)
    })
    return () => {
      lifandi = false; cancelAnimationFrame(raf); lenis?.destroy()
      delete (window as unknown as { __goaLenis?: unknown }).__goaLenis
    }
  }, [])
}

/* stagger 0.12s and duration 1s: addAppearanceByTrigger's own defaults */
export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.12).toFixed(2)}s` })

/** A headline, split to lines, each rising out of its own mask at 108%. */
export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0, id }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number; id?: string
}) {
  const lines = text.split(' | ')
  return (
    <Tag className={className} id={id}>
      {lines.map((l, i) => (
        <span className="goa-mask" key={l + i}>
          <span className="goa-up goa-lina" style={{ ['--d' as string]: `${(hold + i * 0.12).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="goa-merki"><span className="goa-mask"><span className="goa-up">{children}</span></span></p>
}

/** The cascade label (§3): two stacked copies of the text, per letter. Timing
 *  is the source's own: labels of 5+ letters get a 0.15s stagger spread over
 *  a 0.5s roll, shorter ones scale down to a 0.45 floor. */
export function Cas({ t }: { t: string }) {
  const ch = [...t]
  const n = Math.max(1, ch.length)
  const k = n >= 5 ? 1 : Math.min(0.8, Math.max(0.45, n / 5))
  const st = (0.15 * k) / n
  const line = ch.map((c, i) => <span key={i} style={{ ['--i' as string]: i }}>{c === ' ' ? ' ' : c}</span>)
  return (
    <span className="goa-cas" style={{ ['--cd' as string]: `${(0.5 * k).toFixed(3)}s`, ['--cs' as string]: `${st.toFixed(4)}s` }}>
      <span className="goa-casL">{line}</span>
      <span className="goa-casL" aria-hidden="true">{line}</span>
    </span>
  )
}

/* ---------------------------------------------------------------- *
 * Magnet cursor (§4b.2). A word tells you what the click does before you
 * make it. Re-resolves under a stationary pointer while the scroll settles,
 * once on the next frame and once on a 120ms idle timer, and presses on click.
 * ---------------------------------------------------------------- */
export function Bendill() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ord, setOrd] = useState('')
  const [yta, setYta] = useState(false)
  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    if (!el) return
    let x = -200, y = -200, cx = -200, cy = -200, raf = 0, idle = 0, har = false
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      raf = Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const lesa = () => {
      if (!har) return
      const t = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; har = true
      if (!raf) raf = requestAnimationFrame(tick)
      const t = (e.target as HTMLElement)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const skrun = () => {
      requestAnimationFrame(() => requestAnimationFrame(lesa))
      window.clearTimeout(idle); idle = window.setTimeout(lesa, 120)
    }
    const nidur = () => { setYta(true); window.setTimeout(() => setYta(false), 200) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', skrun, { passive: true })
    window.addEventListener('pointerdown', nidur, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', skrun)
      window.removeEventListener('pointerdown', nidur); cancelAnimationFrame(raf); window.clearTimeout(idle)
    }
  }, [])
  return (
    <div className={`goa-bendill${ord ? ' stor' : ''}${yta ? ' yta' : ''}`} ref={ref} aria-hidden="true">
      <i /><b>{ord}</b>
    </div>
  )
}

/* React 18's types do not know `inert`, so it is set through a ref. Used only
   on the desktop nav row, which slides out of view rather than hiding. The
   dropdown panels, the popup and the order drawer are visibility:hidden when
   closed, which already takes them out of the tab order and the
   accessibility tree; toggling inert on them as well cost the first tap after
   opening on iOS Safari, which does not refresh its hit-testing when inert
   is removed (found in the Simulator, 2026-09-21). */
export const inertNar = (lokad: boolean) => (el: HTMLElement | null) => { el?.toggleAttribute('inert', lokad) }

/* ---------------------------------------------------------------- *
 * Orkunotkun (§4.7). state = (dark ? 1 : 2) - (reduce ? 1 : 0), clamped,
 * read as Mikil / Miðlungs / Lítil. prefers-reduced-motion seeds the reduce
 * switch (declared deviation 1). Stored like the reference, in localStorage.
 * ---------------------------------------------------------------- */
function useOrka() {
  const [dokkt, setDokkt] = useState(() => { try { return localStorage.getItem('goa-tema') === 'dokkt' } catch { return false } })
  const [min, setMin] = useState(() => {
    try { const v = localStorage.getItem('goa-hreyfing'); if (v) return v === 'min' } catch { /* private mode */ }
    return reduced()
  })
  const stig = Math.max(0, Math.min(2, (dokkt ? 1 : 2) - (min ? 1 : 0)))
  useEffect(() => {
    const root = document.querySelector('.goa-root') as HTMLElement | null
    if (!root) return
    root.dataset.tema = dokkt ? 'dokkt' : 'ljost'
    root.dataset.hreyfing = min ? 'min' : 'full'
    try { localStorage.setItem('goa-tema', dokkt ? 'dokkt' : 'ljost'); localStorage.setItem('goa-hreyfing', min ? 'min' : 'full') } catch { /* ignore */ }
    if (min) root.querySelectorAll('.goa-up').forEach((n) => n.classList.add('on'))
  }, [dokkt, min])
  return { dokkt, setDokkt, min, setMin, stig }
}

function OrkuMerki({ stig }: { stig: number }) {
  return (
    <span className="goa-orkaG" aria-live="polite">
      <span className="goa-orkaR" style={{ ['--stig' as string]: 2 - stig }}>
        <span>Mikil</span><span>Miðlungs</span><span>Lítil</span>
      </span>
    </span>
  )
}

const Ör = () => (
  <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
)

/* Nav targets. §4b.3: anchors close the menu, wait the 400ms hand-over, then
   scroll with the header's height as the offset. */
const NAV = [
  { h: '#vorur', t: 'Vörur' },
  { h: '#linur', t: 'Vörulínur' },
  { h: '#saga', t: 'Sagan' },
  { h: '#spurt', t: 'Spurt og svarað' },
  { h: '#erindi', t: 'Hafa samband' },
]

export function faraA(href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  const haus = document.querySelector('.goa-haus')
  const offset = isCompact() ? -((haus?.getBoundingClientRect().height ?? 60) + 12) : -24
  const l = lenisOf()
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', href)
}

/* ---------------------------------------------------------------- *
 * The header as a state machine (§4b.3). Two flags, one of which may be on.
 * Desktop: crest + burger at rest; the burger slides the nav row in, and
 * the energy panel is only reachable from inside that row. Compact: crest,
 * energy pill, bag and burger; the burger drops a panel with two product
 * cards and the nav rows; the two panels are mutually exclusive with a
 * 400ms hand-over.
 * ---------------------------------------------------------------- */
export function Haus() {
  const [valmynd, setValmynd] = useState(false)
  const [orka, setOrka] = useState(false)
  const bida = useRef(0)
  const haus = useRef<HTMLElement | null>(null)
  const o = useOrka()

  /* One panel at a time. Opening one while the other is open closes it,
     waits the 400ms hand-over, then opens (§4b.3). On desktop the energy
     panel hangs off the nav row, so closing the row closes it first. */
  const skipta = (hvad: 'valmynd' | 'orka' | null) => {
    window.clearTimeout(bida.current)
    if (hvad === null) { setOrka(false); setValmynd(false); return }
    if (isCompact()) {
      const annad = hvad === 'orka' ? valmynd : orka
      const setThis = hvad === 'orka' ? setOrka : setValmynd
      const setOther = hvad === 'orka' ? setValmynd : setOrka
      const thetta = hvad === 'orka' ? orka : valmynd
      if (thetta) { setThis(false); return }
      if (annad) { setOther(false); bida.current = window.setTimeout(() => setThis(true), 400); return }
      setThis(true); return
    }
    if (hvad === 'orka') { setOrka((v) => !v); return }
    if (valmynd && orka) { setOrka(false); bida.current = window.setTimeout(() => setValmynd(false), 400); return }
    setValmynd((v) => !v)
  }

  useEffect(() => {
    if (!valmynd && !orka) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') skipta(null) }
    const ut = (e: PointerEvent) => { if (!haus.current?.contains(e.target as Node)) skipta(null) }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', ut)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', ut) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valmynd, orka])

  useEffect(() => {
    const publish = () => {
      const nav = haus.current?.querySelector<HTMLElement>('.goa-nav')
      if (nav) nav.style.setProperty('--navW', `${nav.scrollWidth}px`)
      const h = haus.current?.getBoundingClientRect().height
      if (h) (document.querySelector('.goa-root') as HTMLElement | null)?.style.setProperty('--haus-h', `${Math.round(h)}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => window.removeEventListener('resize', publish)
  }, [])

  const fara = (e: MouseEvent<HTMLAnchorElement>, h: string) => {
    e.preventDefault()
    const compact = isCompact()
    skipta(null)
    window.setTimeout(() => faraA(h), compact ? 400 : 0)
  }

  const orkuHnappur = (cls = '') => (
    <button className={`goa-orka${cls}`} aria-expanded={orka} aria-controls="goa-orkuPan" onClick={() => skipta('orka')}>
      <span>Orkunotkun</span><OrkuMerki stig={o.stig} /><Ör />
    </button>
  )

  return (
    <header ref={haus} className={`goa-haus${valmynd ? ' opin' : ''}`}>
      <a className="goa-merkid" href="#top" aria-label="Góa, á forsíðu"
        onClick={(e) => { e.preventDefault(); const l = lenisOf(); if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src={`${import.meta.env.BASE_URL}goa/goa-merki-stort.svg`} alt="Góa, stofnað 1968" width={184} height={230} decoding="async" />
      </a>
      <div className="goa-hausH">
        <div className="goa-hausB">
          <div className="goa-navK">
            <nav className="goa-nav" aria-label="Aðalvalmynd" ref={inertNar(!valmynd)} style={{ ['--n' as string]: NAV.length + 1 }}>
              {NAV.map((n, i) => (
                <a key={n.h} href={n.h} className="goa-casH" style={{ ['--i' as string]: i }} onClick={(e) => fara(e, n.h)}><Cas t={n.t} /></a>
              ))}
              <span style={{ ['--i' as string]: NAV.length, display: 'flex' }}>{orkuHnappur()}</span>
            </nav>
          </div>
          <span className="goa-orkaM">{orkuHnappur()}</span>
        </div>
        <PokaHnappur />
        <button className="goa-braud" aria-expanded={valmynd} aria-controls="goa-valPan"
          aria-label={valmynd ? 'Loka valmynd' : 'Opna valmynd'} onClick={() => skipta('valmynd')}>
          <span><i /><i /><i /></span>
        </button>
        <div className="goa-panK">
          <div id="goa-orkuPan" className={`goa-pan goa-orkuPan${orka ? ' opid' : ''}`}>
            <div>
              <h3>Orkunotkun <OrkuMerki stig={o.stig} /></h3>
              <p className="goa-smatt" style={{ margin: 0 }}>
                Dökkt útlit og minni hreyfing spara rafhlöðu tækisins og draga úr orkunotkun síðunnar.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '.6rem' }}>
              <div>
                <div className="goa-rofiRod">
                  <span>Dökkt útlit</span>
                  <button className="goa-rofi" role="switch" aria-checked={o.dokkt} aria-label="Dökkt útlit"
                    onClick={() => o.setDokkt(!o.dokkt)}><i /></button>
                </div>
                <p className="goa-smatt">Sparar orku á OLED og AMOLED skjám.</p>
              </div>
              <div>
                <div className="goa-rofiRod">
                  <span>Minni hreyfing</span>
                  <button className="goa-rofi" role="switch" aria-checked={o.min} aria-label="Minni hreyfing"
                    onClick={() => o.setMin(!o.min)}><i /></button>
                </div>
                <p className="goa-smatt">Slekkur á hreyfingum og léttir á örgjörva tækisins.</p>
              </div>
            </div>
          </div>
          <div id="goa-valPan" className={`goa-pan goa-valPan${valmynd ? ' opid' : ''}`}
            style={{ display: undefined }}>
            <div className="goa-valKort">
              <a href="#vorur" onClick={(e) => fara(e, '#vorur')}>
                <img src={`${import.meta.env.BASE_URL}goa/hraun.webp`} alt="" width={900} height={257} style={{ height: 40 }} />Hraun
              </a>
              <a href="#vorur" onClick={(e) => fara(e, '#vorur')}>
                <img src={`${import.meta.env.BASE_URL}goa/lindu-mjolkursukkuladi.webp`} alt="" width={900} height={400} style={{ height: 52 }} />Linda
              </a>
            </div>
            <div className="goa-valRod">
              {NAV.map((n, i) => (
                <a key={n.h} href={n.h} style={{ ['--i' as string]: i }} onClick={(e) => fara(e, n.h)}><span>{n.t}</span></a>
              ))}
            </div>
            <button className="goa-btn stor" onClick={() => { skipta(null); window.setTimeout(() => poki.open(true), 400) }}>Opna nammipokann</button>
          </div>
        </div>
      </div>
    </header>
  )
}
