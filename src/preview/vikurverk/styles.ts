/*
 * Víkurverk — the visual system. Plan: _docs/VIKURVERK-BUILD-2026-10-09.md §4.
 * Set's look (white paper, square cards on grey, products multiplied onto the
 * grey, big capitals) re-aimed at Víkurverk: pine #01483A and the grey of
 * "V·E·R·K" measured from their logo, Mona Sans 900 italic capitals for display
 * (the heavy slanted VÍKUR), Mona Sans for reading, National Park for the small
 * trail-sign labels. The one curve is the swoosh from their mark.
 * Prefix `vv`, so nothing here reaches another route.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0F1A17'
export const PINE = '#01483A'
export const PINE_INK = '#0B2B23'
export const SIGNAL = '#DD0000'
const EASE = 'cubic-bezier(.625,.05,0,1)'
const F = `${B}fonts/vikurverk/`

export const CSS = `
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'VvD';src:url('${F}mona-sans-v4-latin_latin-ext-800.woff2') format('woff2');font-weight:800;font-display:swap}
@font-face{font-family:'VvS';src:url('${F}national-park-v4-latin_latin-ext-700.woff2') format('woff2');font-weight:700;font-display:swap}

/* Safari paints the status strip and the strip under the minimised toolbar from html/body */
html,body{background-color:${PINE_INK}}
html.vv-menu,html.vv-menu body{overflow:hidden}

.vv{--ink:${INK};--paper:#FFFFFF;--fog:#EEF1EF;--fog2:#E2E7E4;--line:#D3DAD6;--steel:#56605C;--grey:#7F7F7F;--pine:${PINE};--pine2:#023B30;--pi:${PINE_INK};--signal:${SIGNAL};--mint:#BFE3D2;--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(80px,9vw,140px);--hdr:70px;--bar:34px;
  font-family:'VvT',system-ui,-apple-system,sans-serif;font-size:16.5px;line-height:1.6;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
.vv *{box-sizing:border-box}
.vv a{color:inherit;text-decoration:none}
.vv p,.vv h1,.vv h2,.vv h3,.vv h4,.vv figure,.vv ul,.vv ol,.vv dl,.vv dd{margin:0}
.vv ul,.vv ol{padding:0;list-style:none}
.vv img{display:block;max-width:100%}
.vv button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;border-radius:0}
.vv a,.vv button,.vv label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.vv :focus-visible{outline:2px solid var(--pine);outline-offset:3px}
.vv .on-dark :focus-visible,.vv-menu-panel :focus-visible,.vv .vv-sticky :focus-visible{outline-color:#fff}
.vv .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vv .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--pine);color:#fff;padding:12px 18px;font-weight:600}
.vv .skip:focus{top:16px}
.vv section[id],.vv [data-anchor]{scroll-margin-top:110px}
.vv .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vv .num{font-variant-numeric:tabular-nums}

/* ── type ── */
.vv h1,.vv h2,.vv .disp{font-family:'VvD','VvT',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;letter-spacing:-.012em;line-height:.96;text-wrap:balance;overflow-wrap:normal;word-break:normal;hyphens:manual}
.vv-learn h2{font-size:clamp(34px,3.6vw,56px)}
.vv h1{font-size:clamp(46px,6.4vw,104px)}
.vv h2{font-size:clamp(34px,4.2vw,68px)}
.vv h3{font-weight:600;letter-spacing:-.01em;line-height:1.2;text-wrap:balance}
/* italic overhang + accent headroom (masked-reveal-clips-icelandic-accents) */
.vv [data-chars] .ch-mask,.vv .lm{padding:.26em .04em .1em;margin:-.26em -.04em -.1em}
.vv .lm{display:block;overflow:hidden}
.vv .lm > span{display:block}
.vv .sign{font-family:'VvS','VvT',sans-serif;font-weight:700;font-size:13px;letter-spacing:.04em;line-height:1}
.vv .lede{font-size:18.5px;line-height:1.55;color:var(--steel);max-width:44ch}
.vv .muted{color:var(--steel)}
.vv .vk{font-family:'VvT',sans-serif;font-weight:600;font-size:13px;letter-spacing:.42em;text-transform:uppercase;color:var(--grey)}

/* ── the swoosh: the curve from the mark ── */
.vv .swoosh{display:block;width:100%;height:auto;overflow:visible}
.vv .swoosh path{fill:var(--pine)}

/* ── buttons: square, rolling label ── */
.vv .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 24px;
  font-family:'VvT',sans-serif;font-size:16px;font-weight:600;letter-spacing:.005em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),transform .12s}
.vv .btn:active,.vv .chip:active,.vv .form .opt:active > span,.vv .row .cta:active,.vv .add:active,.vv .wk:active{transform:scale(.97)}
.vv .btn .lbl{display:inline-flex;overflow:hidden;height:1.3em;line-height:1.3em}
.vv .btn .c{display:inline-block;text-shadow:0 1.3em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.vv .btn-pine{background:var(--pine);color:#fff}
.vv .btn-ink{background:var(--ink);color:#fff}
.vv .btn-white{background:#fff;color:var(--ink)}
.vv .btn-line{box-shadow:inset 0 0 0 2px var(--ink);color:var(--ink)}
.vv .btn-ghost{color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
@media (hover:hover){
  .vv .btn:hover .c{transform:translateY(-1.3em)}
  .vv .btn-pine:hover{background:var(--ink)}
  .vv .btn-ink:hover{background:var(--pine)}
  .vv .btn-white:hover{background:var(--mint)}
  .vv .btn-line:hover{background:var(--ink);color:#fff}
  .vv .btn-ghost:hover{box-shadow:inset 0 0 0 2px #fff}
}
.vv .tlink{display:inline-flex;align-items:center;gap:6px;font-weight:600;border-bottom:2px solid var(--pine);padding-bottom:1px;min-height:32px}
@media (hover:hover){.vv .tlink:hover{color:var(--pine)}}

/* ── chrome: contact bar + header ── */
.vv-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .35s cubic-bezier(.23,1,.32,1)}
.vv-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:var(--pi);z-index:3}
.vv-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.vv .bar{height:var(--bar);background:var(--pi);color:rgba(255,255,255,.86);font-size:13px}
.vv .bar .in{display:flex;align-items:center;gap:24px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vv .bar a{display:inline-flex;align-items:center;gap:7px;min-height:34px}
@media (hover:hover){.vv .bar a:hover{color:#fff}}
.vv .bar .st{display:inline-flex;align-items:center;gap:8px}
.vv .bar .st i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.4)}
.vv .bar .st.on i{background:var(--mint)}
.vv .bar .ad{margin-left:auto}
.vv .hdr{height:var(--hdr);background:#fff;border-bottom:1px solid transparent;transition:border-color .3s}
.vv-chrome[data-solid="1"] .hdr{border-color:var(--line)}
.vv .row{display:flex;align-items:center;gap:28px;height:var(--hdr);max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vv .row .logo{display:block;flex:none;transition:opacity .3s,visibility .3s}
@media (min-width:901px){.vv[data-mark="1"] .row .logo{opacity:0;visibility:hidden}}
.vv .row .logo img{height:46px;width:auto}
.vv .row .links{display:flex;gap:4px;margin-left:auto;align-items:center}
.vv .dd{position:relative}
.vv .dd > button,.vv .row .nl{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;font-size:16px;font-weight:600}
.vv .dd > button svg{transition:transform .2s cubic-bezier(.23,1,.32,1)}
.vv .dd[data-open="1"] > button svg{transform:rotate(180deg)}
.vv .dd > button[aria-current="true"],.vv .row .nl[aria-current="page"]{color:var(--pine);box-shadow:inset 0 -2px 0 var(--pine)}
@media (hover:hover){.vv .dd > button:hover,.vv .row .nl:hover{color:var(--pine)}}
.vv .dd .panel{position:absolute;top:calc(100% + 12px);left:0;min-width:290px;background:#fff;box-shadow:0 0 0 1px var(--line),0 24px 48px -24px rgba(15,26,23,.35);padding:10px;display:grid;
  opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .16s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s .2s}
.vv .dd[data-open="1"] .panel{opacity:1;visibility:visible;transform:none;transition:opacity .18s ease-out,transform .22s cubic-bezier(.23,1,.32,1)}
.vv .dd .panel a{display:grid;gap:2px;padding:10px 12px;min-height:44px}
.vv .dd .panel a b{font-weight:600;font-size:15px}
.vv .dd .panel a span{font-size:13px;color:var(--steel);line-height:1.4}
@media (hover:hover){.vv .dd .panel a:hover{background:var(--fog)}}
.vv .row .acts{display:flex;align-items:center;gap:8px}
.vv .row .cta{display:inline-flex;align-items:center;height:44px;padding:0 18px;background:var(--pine);color:#fff;font-weight:600;font-size:15.5px;transition:background-color .3s}
@media (hover:hover){.vv .row .cta:hover{background:var(--ink)}}
.vv .row .bag{position:relative;display:grid;place-items:center;width:48px;height:48px}
.vv .row .bag .n{position:absolute;top:4px;right:2px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--signal);color:#fff;font-size:12px;font-weight:600;display:grid;place-items:center;line-height:1}
.vv .row .burger{display:none;width:48px;height:48px;place-items:center;margin-right:-8px}
@media (max-width:1099px){.vv .dd > button,.vv .row .nl{padding:0 9px;font-size:15.5px}}
@media (max-width:1023px){
  .vv .row .links{display:none}
  .vv .row .burger{display:grid}
  .vv .row .acts{margin-left:auto}
  .vv .row .logo img{height:40px}
  .vv .bar .ad{display:none}
}
@media (max-width:639px){
  .vv .row .cta{display:none}
  .vv .bar .hide-s{display:none}
  .vv .row{gap:10px}
}

/* ── menu ── */
.vv-menu-panel{position:fixed;inset:0;z-index:120;overscroll-behavior:contain;background:var(--pi);color:#fff;display:flex;flex-direction:column;
  padding:calc(10px + env(safe-area-inset-top)) var(--pad) calc(110px + env(safe-area-inset-bottom));overflow-y:auto}
.vv-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.vv-menu-panel .mtop img{height:38px;width:auto}
.vv-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center;margin-right:-8px}
.vv-menu-panel .mgroups{display:grid;gap:26px;margin-top:28px}
.vv-menu-panel .mg p{font-size:13px;color:rgba(255,255,255,.64);margin-bottom:4px}
.vv-menu-panel .mg a{display:block;font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(28px,8vw,44px);line-height:1.1;padding:3px .1em 3px 0}
.vv-menu-panel .mg a[aria-current="page"]{color:var(--mint)}
.vv-menu-panel .mfoot{margin-top:auto;display:grid;gap:10px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.82)}
.vv-menu-panel .mfoot a,.vv-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.vv-menu-panel .mfoot a.big{font-weight:600;font-size:30px;color:#fff}

/* ── frames ── */
.vv .frame{position:relative;overflow:hidden;background:var(--fog2)}
.vv .frame .par{position:absolute;inset:-8% 0}
.vv .frame img{width:100%;height:100%;object-fit:cover}
.vv .frame .still-photo{position:absolute;inset:0}
.vv figcaption,.vv .cap{font-size:13.5px;color:var(--steel);margin-top:10px;line-height:1.45}

/* ── 1 · hero: the headline, four real doors, then their photo full width under the swoosh ── */
.vv-hero{padding:calc(var(--bar) + var(--hdr) + clamp(24px,3.4vw,56px) + env(safe-area-inset-top)) 0 0;background:#fff}
.vv-hero .hgrid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:24px 56px;align-items:end;padding-bottom:clamp(28px,3.4vw,52px)}
.vv-hero h1{font-size:min(132px,calc(((100vw - 2 * var(--pad)) - 56px) * .5833 / 7.15));line-height:.9}
.vv-hero h1 .lm:last-child span{color:var(--pine)}
.vv .doors{display:grid;border-top:2px solid var(--ink)}
.vv .door{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 16px;padding:14px 4px 14px 0;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate}
.vv .door::before{content:'';position:absolute;inset:0;background:var(--pine);transform:scaleX(0);transform-origin:left;transition:transform .32s cubic-bezier(.23,1,.32,1);z-index:-1}
.vv .door b{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(24px,2.1vw,34px);line-height:1.05;padding-right:.1em;transition:color .2s,transform .32s cubic-bezier(.23,1,.32,1)}
.vv .door .sign{grid-column:1;color:var(--steel);transition:color .2s,transform .32s cubic-bezier(.23,1,.32,1)}
.vv .door .ar{grid-column:2;grid-row:1 / 3;transition:transform .32s cubic-bezier(.23,1,.32,1),color .2s}
.vv .door:active{transform:scale(.99)}
@media (hover:hover) and (pointer:fine){
  .vv .door:hover::before,.vv .door:focus-visible::before{transform:scaleX(1)}
  .vv .door:hover b,.vv .door:hover .sign,.vv .door:hover .ar{color:#fff}
  .vv .door:hover b,.vv .door:hover .sign{transform:translateX(14px)}
  .vv .door:hover .ar{transform:translateX(-10px)}
}
.vv-hero .hfig{position:relative;margin:0}
.vv-hero .hbox{position:relative}
.vv-hero .hmask{position:relative;height:clamp(360px,62svh,760px);width:100%;overflow:hidden;background:var(--fog2);
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 24 C 28 22 62 11 100 0 L100 100 L0 100 Z'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 24 C 28 22 62 11 100 0 L100 100 L0 100 Z'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat}
.vv-hero .hmask img{width:100%;height:100%;object-fit:cover}
.vv-hero .hmask .hp{position:absolute;inset:-4% 0 0}
.vv-hero .hsw{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.vv-hero .hsw path{fill:var(--pine)}
.vv-hero figcaption{margin-top:12px}
@media (max-width:899px){
  .vv-hero{padding-top:calc(var(--bar) + var(--hdr) + 20px + env(safe-area-inset-top))}
  .vv-hero .hgrid{grid-template-columns:minmax(0,1fr);gap:22px;padding-bottom:28px}
  .vv-hero h1{font-size:min(84px,calc((100vw - 2 * var(--pad)) / 7.15))}
  .vv .doors{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px}
  .vv .door{grid-template-columns:minmax(0,1fr);padding:12px 0 14px;min-height:84px;align-content:start}
  .vv .door b{font-size:clamp(20px,6vw,26px)}
  .vv .door .ar{display:none}
  .vv-hero .hmask{height:auto;aspect-ratio:4 / 3.4}
}

/* ── 3 · towing capacity: a kg scale and a slider ── */
.vv-tow{padding-top:var(--sec)}
.vv .tow-head{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:16px 56px;align-items:end;margin-bottom:clamp(28px,3.4vw,48px)}
.vv .tow-head p{color:var(--steel);font-size:17px;max-width:52ch}
.vv .tow-tool{background:var(--fog);padding:clamp(20px,3vw,40px)}
.vv .tow-in{display:grid;grid-template-columns:auto auto minmax(0,1fr);gap:10px 18px;align-items:center}
.vv .tow-in .sign{color:var(--steel)}
.vv .tow-in output{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;font-size:clamp(30px,3vw,46px);line-height:1;min-width:6.2ch;padding-right:.1em}
.vv .tow-in input{width:100%;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:pan-y}
.vv .tow-in input::-webkit-slider-runnable-track{height:4px;background:var(--ink)}
.vv .tow-in input::-moz-range-track{height:4px;background:var(--ink)}
.vv .tow-in input::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;margin-top:-12px;background:var(--pine);border:3px solid #fff;box-shadow:0 0 0 1px var(--pine)}
.vv .tow-in input::-moz-range-thumb{width:24px;height:24px;background:var(--pine);border:3px solid #fff;border-radius:0}
.vv .tow-in input:focus-visible{outline:2px solid var(--pine);outline-offset:4px}
.vv .scale{position:relative;height:118px;margin:28px 0 8px;border-bottom:2px solid var(--ink)}
.vv .scale .zone{position:absolute;left:0;bottom:0;height:10px;background:var(--pine);transition:width .12s linear}
.vv .scale .tick{position:absolute;bottom:-26px;transform:translateX(-50%);font-size:12.5px;color:var(--steel)}
.vv .scale .tick::before{content:'';position:absolute;left:50%;top:-8px;width:1px;height:6px;background:var(--ink)}
.vv .scale .pin{position:absolute;bottom:0;transform:translateX(-50%);display:grid;justify-items:center;gap:4px}
.vv .scale .pin i{order:2;width:2px;height:58px;background:#9AA39F;transition:background-color .2s}
.vv .scale .pin.l0 i{height:18px}
.vv .scale .pin.l1 i{height:50px}
.vv .scale .pin.l2 i{height:82px}
.vv .scale .pin em{order:1;font-style:normal;font-size:13px;font-weight:600;white-space:nowrap;padding:4px 8px;background:#fff;color:#8A938F;box-shadow:inset 0 0 0 1px var(--line);transition:background-color .2s,color .2s}
.vv .scale .pin.ok i{background:var(--pine)}
.vv .scale .pin.ok em{background:var(--pine);color:#fff;box-shadow:none}
.vv .tow-sum{margin-top:40px;font-size:15.5px}
.vv .tow-sum b{font-size:18px}
.vv .tow-cards{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin-top:8px}
.vv .tc{display:grid;gap:2px;padding:0 0 14px;background:var(--fog);height:100%;transition:opacity .25s,filter .25s}
.vv .tc .ph{aspect-ratio:4 / 3;display:grid;place-items:center;margin-bottom:10px;overflow:hidden}
.vv .tc .ph .plan{width:100%;height:100%;object-fit:contain;padding:10%;mix-blend-mode:multiply}
.vv .tc .ph .shot{width:100%;height:100%;object-fit:cover}
.vv .tc > :not(.ph){padding-inline:12px}
.vv .tc b{font-weight:600;font-size:15.5px;line-height:1.25}
.vv .tc .kg,.vv .tc .pr{font-size:13.5px;color:var(--steel)}
.vv .tc .fit{justify-self:start;margin:8px 12px 0;padding:5px 8px;background:#fff;color:#8A938F}
.vv .tc .fit.ok{background:var(--pine);color:#fff}
.vv .tow-cards li[data-ok="0"] .tc{opacity:.55;filter:grayscale(1)}
@media (hover:hover){.vv .tc:hover{opacity:1!important;filter:none!important}}
@media (max-width:1099px){.vv .tow-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:899px){
  .vv .tow-head{grid-template-columns:minmax(0,1fr)}
  .vv .tow-in{grid-template-columns:auto minmax(0,1fr)}
  .vv .tow-in input{grid-column:1 / -1}
  .vv .scale{height:44px}
  .vv .scale .pin em{display:none}
  .vv .scale .pin i,.vv .scale .pin.lo i{height:26px}
  .vv .tow-cards{grid-template-columns:repeat(2,minmax(0,1fr))}
}

/* ── section heads (stacked, never split) ── */
.vv .shead{display:grid;gap:14px;margin-bottom:clamp(28px,3.4vw,52px);max-width:900px}
.vv .shead p{color:var(--steel);max-width:58ch;font-size:17px}
.vv .shead-row{display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:clamp(28px,3.4vw,52px)}
.vv .shead-row .shead{margin-bottom:0}

/* ── 2 · brand plates (the Vatt accordion, square) ── */
.vv-plates{padding-top:var(--sec)}
.vv .plates{display:flex;gap:6px;height:clamp(380px,40vw,560px)}
.vv .plate{position:relative;flex:1 1 0;min-width:0;overflow:hidden;background:var(--pi);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;
  transition:flex-grow .6s var(--ease)}
.vv .plate img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9;transition:transform 1s var(--ease),opacity .4s}
.vv .plate::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,43,35,0) 30%,rgba(11,43,35,.9) 100%)}
.vv .plate > *:not(img){position:relative;z-index:1}
.vv .plate .sign{color:var(--mint)}
.vv .plate b{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(28px,2.6vw,44px);line-height:1;margin-top:8px;padding-right:.1em}
.vv .plate .pl{font-size:14.5px;line-height:1.45;color:rgba(255,255,255,.86);max-height:0;opacity:0;overflow:hidden;transition:max-height .5s var(--ease),opacity .35s .1s,margin .5s var(--ease)}
.vv .plate .pc{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;margin-top:10px}
@media (hover:hover) and (min-width:900px){
  .vv .plates:hover .plate,.vv .plates:focus-within .plate{flex-grow:1}
  .vv .plates .plate:hover,.vv .plates .plate:focus-visible{flex-grow:2.4}
  .vv .plate:hover img,.vv .plate:focus-visible img{transform:scale(1.04)}
  .vv .plate:hover .pl,.vv .plate:focus-visible .pl{max-height:5em;opacity:1;margin-top:8px}
}
@media (max-width:899px){
  .vv .plates{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px;margin-inline:calc(var(--pad) * -1);padding-inline:var(--pad);scrollbar-width:none}
  .vv .plates::-webkit-scrollbar{display:none}
  .vv .plate{flex:0 0 72%;aspect-ratio:4 / 5;scroll-snap-align:start}
  .vv .plate .pl{max-height:none;opacity:1;margin-top:6px}
}

/* ── unit cards: Set's grey card, the floor plan multiplied in, the photo on hover ── */
.vv .uc{display:grid;grid-template-rows:auto 1fr;background:var(--fog);transition:background-color .3s}
.vv .uc .ph{position:relative;aspect-ratio:4 / 3;overflow:hidden}
.vv .uc .ph img{position:absolute;inset:0;width:100%;height:100%;transition:opacity .3s cubic-bezier(.23,1,.32,1),transform .6s var(--ease)}
.vv .uc .ph .plan{object-fit:contain;padding:12% 8%;mix-blend-mode:multiply}
.vv .uc .ph .shot{object-fit:cover;opacity:0}
.vv .uc .ph .only{opacity:1}
.vv .uc .tags{position:absolute;left:12px;top:12px;display:flex;gap:6px;z-index:1}
.vv .tag{display:inline-flex;align-items:center;height:26px;padding:0 10px;background:#fff;color:var(--ink)}
.vv .tag.new{background:var(--pine);color:#fff}
.vv .tag.flott{background:var(--signal);color:#fff}
.vv .uc .bd{display:grid;gap:4px;padding:16px 18px 18px;align-content:start}
.vv .uc .br{color:var(--steel)}
.vv .uc .nm{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(22px,1.8vw,28px);line-height:1.02;padding-right:.1em}
.vv .uc .facts{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14px;color:var(--steel);margin-top:6px}
.vv .uc .pr{font-weight:600;font-size:18px;margin-top:10px}
@media (hover:hover){
  .vv .uc:hover{background:var(--fog2)}
  .vv .uc:hover .ph .shot{opacity:1}
  .vv .uc:hover .ph .plan{opacity:0}
  .vv .uc:hover .ph .only{transform:scale(1.04)}
}

/* ── catalogue row (Set: 3/12 heading, 9/12 cards) ── */
.vv .crow{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,9fr);gap:32px;padding-top:var(--sec)}
.vv .crow .ch{display:grid;gap:16px;align-content:start;position:sticky;top:120px}
.vv .crow .ch p{color:var(--steel)}
.vv .crow .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
@media (max-width:899px){
  .vv .crow{grid-template-columns:minmax(0,1fr);gap:24px}
  .vv .crow .ch{position:static}
  .vv .crow .cards{grid-auto-flow:column;grid-auto-columns:78%;grid-template-columns:none;overflow-x:auto;scroll-snap-type:x mandatory;margin-inline:calc(var(--pad) * -1);padding-inline:var(--pad);scrollbar-width:none}
  .vv .crow .cards::-webkit-scrollbar{display:none}
  .vv .crow .cards > *{scroll-snap-align:start}
}

/* ── 4 · rental band: the one dark block ── */
.vv-rent{margin-top:var(--sec);background:var(--pi);color:#fff;padding:var(--sec) 0}
.vv-rent .shead p{color:rgba(255,255,255,.8)}
.vv-rent .rgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.vv .rc{display:grid;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);transition:background-color .3s}
.vv .rc .ph{aspect-ratio:4 / 3;overflow:hidden;background:#fff}
.vv .rc .ph img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.vv .rc .bd{padding:18px 20px 22px;display:grid;gap:8px}
.vv .rc .nm{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(24px,2vw,30px);line-height:1;padding-right:.1em}
.vv .rc .pp{font-size:15px;color:rgba(255,255,255,.84)}
.vv .rc .pp b{color:#fff;font-size:20px;font-weight:600}
.vv .rc .free{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.vv .rc .free span{display:inline-flex;align-items:center;height:30px;padding:0 10px;background:var(--mint);color:var(--pi)}
.vv .rc .go{display:inline-flex;align-items:center;gap:8px;font-weight:600;margin-top:8px}
@media (hover:hover){.vv .rc:hover{background:rgba(255,255,255,.1)}.vv .rc:hover .ph img{transform:scale(1.04)}}
@media (max-width:899px){.vv-rent .rgrid{grid-template-columns:minmax(0,1fr)}}

/* season strip */
.vv .season{display:grid;gap:6px}
.vv .srow{display:grid;grid-template-columns:minmax(0,3.4fr) minmax(0,8fr) auto;gap:20px;align-items:center;padding:12px 0;border-top:1px solid rgba(255,255,255,.14)}
.vv .srow.shd{border:0;padding:0}
.vv .srow .who{display:grid;grid-template-columns:72px minmax(0,1fr);gap:14px;align-items:center}
.vv .srow .who img{width:72px;aspect-ratio:1;object-fit:cover;background:#fff}
.vv .srow .who b{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(20px,1.8vw,28px);line-height:1;display:block;padding-right:.1em}
.vv .srow .who small{display:block;font-size:13.5px;color:rgba(255,255,255,.76);margin-top:4px}
.vv .srow .cells{display:grid;grid-template-columns:repeat(18,minmax(0,1fr));gap:4px}
.vv .srow .cells i{display:block;height:36px;background:var(--mint);position:relative}
.vv .srow .cells i.b{background:repeating-linear-gradient(135deg,rgba(255,255,255,.18) 0 4px,transparent 4px 8px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
.vv .srow .cells i.pk::after{content:'';position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:var(--pi)}
.vv .srow .mo{color:rgba(255,255,255,.7);grid-row:1}
.vv .srow .free{display:inline-flex;align-items:center;gap:6px;color:var(--mint);white-space:nowrap}
@media (hover:hover){.vv a.srow:hover .who b{color:var(--mint)}.vv a.srow:hover .free{transform:translateX(4px)}}
.vv .srow .free{transition:transform .25s cubic-bezier(.23,1,.32,1)}
.vv-rent .legend{display:flex;flex-wrap:wrap;gap:8px 22px;font-size:13.5px;color:rgba(255,255,255,.76);margin-top:14px}
.vv-rent .legend span{display:inline-flex;align-items:center;gap:8px}
.vv-rent .legend i{width:14px;height:14px;display:inline-block;background:var(--mint)}
.vv-rent .legend i.b{background:repeating-linear-gradient(135deg,rgba(255,255,255,.3) 0 3px,transparent 3px 6px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.vv-rent .legend i.pk{background:var(--mint);position:relative}
.vv-rent .legend i.pk::after{content:'';position:absolute;inset:3px;border-radius:50%;background:var(--pi)}
@media (max-width:899px){
  .vv .srow{grid-template-columns:minmax(0,1fr) auto;gap:10px 12px}
  .vv .srow .cells{grid-column:1 / -1;grid-row:2;gap:2px}
  .vv .srow .cells i{height:28px}
  .vv .srow.shd{display:none}
}

/* year timeline */
.vv-year{padding-top:var(--sec)}
.vv .year-head{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:20px 56px;align-items:end;margin-bottom:clamp(24px,3vw,44px)}
.vv .year-head .now{display:grid;gap:16px;justify-items:start}
.vv .year-head .now p{font-size:17px}
.vv .year-head .now .sign{color:var(--pine);margin-right:6px}
.vv .yr{display:grid;border-top:2px solid var(--ink)}
.vv .yrow{display:grid;grid-template-columns:minmax(150px,2.4fr) minmax(0,9fr);gap:16px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.vv .yrow.yh{border-bottom:0;padding:8px 0}
.vv .yrow .mos{height:auto}
.vv .yrow .mos span{color:var(--steel);text-transform:uppercase;font-size:12px}
.vv .yrow .mos .cur{color:var(--pine)}
.vv .yrow b{font-weight:600;font-size:15.5px;display:block}
.vv .yrow small{font-size:13px;color:var(--steel)}
.vv .yrow .track{position:relative;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));height:22px}
.vv .yrow .track i{grid-row:1;background:var(--pine);height:12px;align-self:center}
.vv .yrow .track .curcol{grid-row:1;align-self:stretch;margin:-10px 0;background:rgba(1,72,58,.08);box-shadow:inset 2px 0 0 var(--pine)}
@media (max-width:899px){
  .vv .year-head{grid-template-columns:minmax(0,1fr)}
  .vv .yrow,.vv .yrow.yh{grid-template-columns:minmax(0,1fr)}
  .vv .yrow.yh > span:first-child{display:none}
  .vv .yrow .mos span{font-size:10px;letter-spacing:0}
  .vv .yrow{gap:6px}
}

/* ── 5 · trade-in strip ── */
.vv-trade{padding-top:var(--sec)}
.vv-trade .tbox{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:32px 64px;align-items:end;background:var(--fog);padding:clamp(28px,4vw,64px)}
.vv-trade form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.vv-trade label{grid-column:1 / -1;font-size:14px;font-weight:600}
.vv-trade input{min-height:52px;padding:0 16px;border:1px solid rgba(15,26,23,.36);background:#fff;color:var(--ink);font:17px 'VvT',sans-serif;border-radius:0;-webkit-appearance:none;appearance:none;text-transform:uppercase;letter-spacing:.08em}
.vv-trade input:focus{outline:none;border-color:var(--pine);box-shadow:0 0 0 3px rgba(1,72,58,.2)}
.vv-trade .fine{grid-column:1 / -1;font-size:13.5px;color:var(--steel)}
@media (max-width:899px){.vv-trade .tbox{grid-template-columns:minmax(0,1fr)}.vv-trade form{grid-template-columns:minmax(0,1fr)}}


/* ── home = Set's landing, re-aimed ── */
.vv .vring{position:relative;display:inline-grid;place-items:center;width:44px;height:44px;flex:none;color:var(--ink)}
.vv .vring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.vv .vring .r-wall{fill:none;stroke:currentColor;stroke-width:2.6}
.vv .vring .r-draw{fill:none;stroke:var(--pine);stroke-width:2.6;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s var(--ease)}
@media (hover:hover) and (pointer:fine){.vv .ringlink:hover .r-draw,.vv button:hover>.vring .r-draw{stroke-dashoffset:0}}
.vv .ringlink{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-weight:500;font-size:15px}
.vv .sbtn{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:52px;padding:0 18px 0 22px;background:var(--ink);color:#fff;font-weight:500;font-size:15px;letter-spacing:.04em;text-transform:uppercase;transition:background-color .3s}
.vv .sbtn svg{transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.vv .sbtn:hover{background:var(--pine)}.vv .sbtn:hover svg{transform:translateX(3px)}}
.vv .sbtn:active{transform:scale(.98)}
.vv .sd{font-family:'VvD','VvT',sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.012em;font-size:clamp(48px,7vw,124px);line-height:.88}
.vv-show .sd{font-size:min(clamp(40px,5vw,84px),calc((100vw - 2 * var(--pad)) / 6))}
.vv-steaser .sd{font-size:min(clamp(40px,5.2vw,88px),calc((100vw - 2 * var(--pad)) / 8.6))}
.vv-shero{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);padding:calc(var(--bar) + var(--hdr) + 16px + env(safe-area-inset-top)) var(--pad) 0;max-width:1440px;margin:0 auto}
.vv-shero .st{grid-column:1 / 8;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,3vw,44px) 0 clamp(32px,4vw,56px)}
.vv-shero .mark{margin-bottom:auto;padding-bottom:40px}
.vv-shero .mark img{width:clamp(150px,22vw,330px);height:auto}
.vv-shero .kick{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--steel);margin-bottom:clamp(18px,2.6vw,36px)}
.vv-shero .kick::before{content:'';width:12px;height:12px;border-radius:50%;border:2.5px solid var(--ink);box-shadow:inset 0 0 0 1px #fff,inset 0 0 0 5px var(--pine)}
.vv-shero h1{font-family:'VvT',sans-serif;font-weight:600;text-transform:none;letter-spacing:-.035em;line-height:1.02;font-size:clamp(44px,6.4vw,112px);max-width:11ch}
.vv-shero .lede{margin-top:clamp(18px,2.2vw,30px);max-width:40ch}
.vv-shero .cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:clamp(26px,3vw,42px)}
.vv-shero .sf{grid-column:8 / 13;margin:0}
.vv-shero .frame-t{position:relative;overflow:hidden;height:calc(100svh - var(--bar) - var(--hdr) - 70px);min-height:520px;max-height:900px;background:var(--fog2)}
.vv-shero .frame-t .hp{position:absolute;inset:-8% 0 0}
.vv-shero .frame-t img{width:100%;height:100%;object-fit:cover}
.vv-shero .hsw{position:absolute;left:0;right:0;top:0;width:100%;height:42%;overflow:visible;pointer-events:none}
.vv-shero .hsw path{fill:var(--pine)}
.vv-shero .cap{margin-top:12px}
@media (max-width:900px){
  .vv-shero{padding-top:calc(var(--bar) + var(--hdr) + 8px + env(safe-area-inset-top))}
  .vv-shero .mark{display:none}
  .vv-shero .st,.vv-shero .sf{grid-column:1 / -1}
  .vv-shero .st{padding-top:16px}
  .vv-shero h1{font-size:min(64px,calc((100vw - 2 * var(--pad)) / 5.6))}
  .vv-shero .frame-t{height:auto;aspect-ratio:4 / 4.2;min-height:0}
}
.vv-scat{max-width:1440px;margin:0 auto;padding:var(--sec) var(--pad) 0}
.vv-scat .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.vv-scat .lead{max-width:38ch;color:var(--steel);font-size:17px}
.vv-scat .dots{height:1px;margin:clamp(20px,2.4vw,32px) 0 0;background-image:linear-gradient(90deg,var(--ink) 1px,transparent 1px);background-size:4px 1px;opacity:.7}
.vv .srow2{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);padding-top:clamp(40px,4.6vw,76px)}
.vv .srow2 .txt{grid-column:1 / 4;display:flex;flex-direction:column;min-width:0}
.vv .srow2 .n{font-size:14px;font-weight:500;color:var(--steel);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.vv .srow2 .n::after{content:'';flex:1;max-width:48px;height:1px;background:var(--ink);opacity:.4}
.vv .srow2 h3{font-size:clamp(24px,2vw,32px);line-height:1.08;letter-spacing:-.025em;font-weight:600}
.vv .srow2 .d{margin-top:14px;font-size:16px;line-height:1.5;color:var(--steel)}
.vv .srow2 .m{margin-top:12px;font-size:13px;color:var(--steel)}
.vv .srow2 .ringlink{margin-top:auto;padding-top:24px}
.vv .srow2 .cards{grid-column:4 / 13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-width:0}
@media (max-width:900px){
  .vv .srow2{display:block}
  .vv .srow2 .ringlink{padding-top:8px}
  .vv .srow2 .cards{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:20px calc(var(--pad) * -1) 0;padding:0 var(--pad) 6px;scroll-padding-inline:var(--pad);scrollbar-width:none}
  .vv .srow2 .cards::-webkit-scrollbar{display:none}
  .vv .srow2 .cards > *{flex:0 0 min(74vw,300px);scroll-snap-align:start}
}
.vv-show{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);max-width:1440px;margin:0 auto;padding:var(--sec) var(--pad) 0}
.vv-show .hh{grid-column:1 / 5;display:flex;flex-direction:column;align-items:flex-start;gap:32px}
.vv-show .acc-list{grid-column:6 / 13}
@media (max-width:900px){.vv-show .hh,.vv-show .acc-list{grid-column:1 / -1}.vv-show .acc-list{margin-top:28px}}
.vv .acc{position:relative;border-bottom:1px solid rgba(15,26,23,.55)}
.vv .acc::before,.vv .acc::after{content:'';position:absolute;bottom:0;width:1px;height:7px;background:rgba(15,26,23,.55)}
.vv .acc::before{left:0}.vv .acc::after{right:0}
.vv .acc-b{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 44px;align-items:center;gap:12px;min-height:72px;text-align:left}
.vv .acc .an{display:inline-grid;place-items:center;width:34px;height:26px;font-size:14px;font-weight:500;transition:background-color .3s,color .3s}
.vv .acc.is-open .an{background:var(--pine);color:#fff}
.vv .acc .at{font-weight:600;font-size:clamp(17px,1.4vw,21px);letter-spacing:-.01em}
.vv .acc .pm{justify-self:end;position:relative;width:26px;height:26px;border:1px solid var(--ink)}
.vv .acc .pm::before,.vv .acc .pm::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:1.2px;margin:-.6px 0 0 -6px;background:var(--ink);transition:transform .3s cubic-bezier(.23,1,.32,1)}
.vv .acc .pm::after{transform:rotate(90deg)}
.vv .acc.is-open .pm::after{transform:rotate(0)}
.vv .acc-p{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.23,1,.32,1)}
.vv .acc.is-open .acc-p{grid-template-rows:1fr}
.vv .acc-p > div{overflow:hidden}
.vv .acc-p p{padding:0 0 22px 64px;max-width:60ch;color:var(--steel);font-size:16px}
@media (max-width:600px){.vv .acc-p p{padding-left:0}}
.vv-srail{max-width:1440px;margin:0 auto;padding:var(--sec) var(--pad) 0}
.vv-srail .rh{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px 40px;align-items:end;margin-bottom:clamp(24px,3vw,40px)}
.vv-srail .arrows{display:flex;gap:8px}
.vv-srail .arrows button:disabled{opacity:.3;cursor:default}
.vv-srail .track{display:flex;gap:10px;height:clamp(440px,40vw,560px)}
.vv .rc2{position:relative;flex:1 1 0;min-width:0;display:flex;flex-direction:column;background:var(--fog);padding:18px;cursor:pointer;transition:flex-grow .75s var(--ease),background-color .4s,color .4s}
.vv .rc2.is-on{flex-grow:3.2;background:var(--pi);color:#fff}
.vv .rc2 .n{display:inline-grid;place-items:center;width:34px;height:26px;font-size:14px;font-weight:500}
.vv .rc2.is-on .n{background:var(--mint);color:var(--pi)}
.vv .rc2 .media{flex:1;min-height:0;margin:14px 0;overflow:hidden;opacity:0;transition:opacity .4s}
.vv .rc2.is-on .media{opacity:1}
.vv .rc2 .media img{width:100%;height:100%;object-fit:cover}
.vv .rc2 .noimg{width:100%;height:100%;background:radial-gradient(circle at 50% 50%,transparent 38%,rgba(255,255,255,.18) 39%,transparent 40%)}
.vv .rc2 .y{font-size:13px;font-weight:500;color:var(--steel)}
.vv .rc2.is-on .y{color:var(--mint)}
.vv .rc2 h3{font-weight:600;font-size:clamp(18px,1.5vw,22px);line-height:1.15;margin-top:4px}
.vv .rc2 h3 button{text-align:left}
.vv .rc2 .b{font-size:14.5px;line-height:1.45;margin-top:8px;max-height:0;opacity:0;overflow:hidden;transition:opacity .3s}
.vv .rc2.is-on .b{max-height:6em;opacity:.86}
@media (max-width:900px){
  .vv-srail .rh{grid-template-columns:minmax(0,1fr)}
  .vv-srail .track{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--pad) * -1);padding:0 var(--pad);scrollbar-width:none}
  .vv-srail .track::-webkit-scrollbar{display:none}
  .vv .rc2,.vv .rc2.is-on{flex:0 0 78vw;scroll-snap-align:start;min-height:440px}
  .vv .rc2 .media,.vv .rc2 .b{opacity:1;max-height:none}
}
.vv-steaser{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);max-width:1440px;margin:0 auto;padding:var(--sec) var(--pad)}
.vv-steaser .tt{grid-column:1 / 7;display:flex;flex-direction:column;align-items:flex-start;gap:20px}
.vv-steaser .tl2{grid-column:8 / 13;align-self:end;background:var(--fog)}
.vv-steaser .tl2 li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:2px 14px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)}
.vv-steaser .tl2 li img{grid-row:1 / 3;width:56px;height:56px;object-fit:contain;mix-blend-mode:multiply}
.vv-steaser .tl2 b{font-weight:500;font-size:15px;line-height:1.3}
.vv-steaser .tl2 span{font-size:13.5px;color:var(--steel)}
.vv-steaser .tl2 .foot{display:flex;justify-content:space-between;align-items:center;background:var(--pi);color:#fff;border:0;padding:16px}
.vv-steaser .tl2 .foot span{color:rgba(255,255,255,.86)}
.vv-steaser .tl2 .foot b{color:#fff}
.vv-steaser .tl2 .foot img{width:84px;height:auto;mix-blend-mode:normal}
@media (max-width:900px){.vv-steaser .tt,.vv-steaser .tl2{grid-column:1 / -1}.vv-steaser .tl2{margin-top:32px}}


/* ── home = the Suðurverk landing order in Set's design ── */
.vv .sh{font-family:'VvT',sans-serif;font-weight:600;text-transform:none;letter-spacing:-.03em;line-height:1.06}
.vv .ss-hero{padding-top:calc(var(--bar) + var(--hdr) + env(safe-area-inset-top));background:#fff}
.vv .ss-inner{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:24px clamp(24px,4vw,64px);align-items:end;padding-top:clamp(32px,5vw,80px)}
.vv .ss-copy{padding-bottom:12px}
.vv .ss-hero .kick{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--steel);margin-bottom:clamp(18px,2.6vw,36px)}
.vv .ss-hero .kick::before{content:'';width:12px;height:12px;border-radius:50%;border:2.5px solid var(--ink);box-shadow:inset 0 0 0 1px #fff,inset 0 0 0 5px var(--pine)}
.vv .ss-hero h1{font-family:'VvT',sans-serif;font-weight:600;text-transform:none;letter-spacing:-.04em;line-height:.98;font-size:clamp(52px,6.6vw,112px)}
.vv .ss-hero .lede{margin-top:clamp(18px,2.2vw,28px);max-width:36ch}
.vv .ss-hero .cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:clamp(24px,3vw,40px)}
.vv .ss-photo{margin:0}
.vv .ss-photo .mask{position:relative;overflow:hidden;aspect-ratio:3 / 2;background:var(--fog)}
.vv .ss-photo .hp{position:absolute;inset:-6% 0 0}
.vv .ss-photo img{width:100%;height:100%;object-fit:cover}
.vv .ss-photo figcaption{display:flex;justify-content:space-between;gap:12px;margin-top:12px;font-size:14px;color:var(--steel)}
.vv .ss-dots{height:1px;margin-top:clamp(40px,5vw,72px);background-image:linear-gradient(90deg,var(--ink) 1px,transparent 1px);background-size:4px 1px;opacity:.7}
@media (max-width:900px){.vv .ss-inner{grid-template-columns:minmax(0,1fr);padding-top:24px}.vv .ss-hero h1{font-size:min(76px,calc((100vw - 2 * var(--pad)) / 5.2))}}
.vv .ss-intro{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);padding-block:clamp(64px,8vw,120px)}
.vv .ss-intro h2{grid-column:1 / 7;font-size:clamp(30px,3.6vw,54px)}
.vv .ss-intro > div{grid-column:8 / 13;display:grid;gap:16px;justify-items:start;align-content:start}
.vv .ss-intro .lead{font-size:clamp(18px,1.4vw,21px);line-height:1.5}
.vv .ss-intro p:not(.lead){color:var(--steel)}
@media (max-width:900px){.vv .ss-intro h2,.vv .ss-intro > div{grid-column:1 / -1}.vv .ss-intro > div{margin-top:20px}}
.vv .ss-sec{padding-top:var(--sec);display:grid;gap:clamp(24px,3vw,40px);justify-items:start}
.vv .ss-head{width:100%;display:flex;justify-content:space-between;align-items:flex-end;gap:16px 40px;flex-wrap:wrap}
.vv .ss-head > p{max-width:40ch;color:var(--steel);font-size:17px}
.vv .ss-feat{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.vv .ss-card{display:grid;gap:14px;background:var(--fog);padding:16px 16px 18px;transition:background-color .3s}
.vv .ss-card .leaf{display:flex;justify-content:space-between;font-size:13px;color:var(--steel)}
.vv .ss-card .ph{aspect-ratio:16 / 10;overflow:hidden;background:var(--fog2)}
.vv .ss-card .ph img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.vv .ss-card .ft{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.vv .ss-card h3{font-weight:600;font-size:clamp(20px,1.7vw,26px);letter-spacing:-.02em}
.vv .ss-card .ft p{font-size:14px;color:var(--steel);margin-top:2px}
.vv .ss-card .pr{font-size:16px!important;color:var(--ink)!important;font-weight:500;white-space:nowrap}
@media (hover:hover) and (pointer:fine){.vv .ss-card:hover{background:var(--fog2)}.vv .ss-card:hover .ph img{transform:scale(1.03)}}
@media (max-width:899px){.vv .ss-feat{grid-template-columns:minmax(0,1fr)}}
.vv .ss-rows{width:100%;border-top:1px solid var(--ink)}
.vv .ss-rows a{display:grid;grid-template-columns:110px minmax(0,1fr) 44px;gap:24px;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}
.vv .ss-rows .n{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:var(--steel)}
.vv .ss-rows .n::after{content:'';flex:1;max-width:48px;height:1px;background:var(--ink);opacity:.4}
.vv .ss-rows b{display:block;font-weight:600;font-size:clamp(22px,2.2vw,32px);letter-spacing:-.025em;line-height:1.1}
.vv .ss-rows small{display:block;font-size:15px;color:var(--steel);margin-top:4px}
@media (hover:hover) and (pointer:fine){.vv .ss-rows a:hover .r-draw{stroke-dashoffset:0}.vv .ss-rows a:hover b{color:var(--pine)}}
@media (max-width:899px){.vv .ss-rows a{grid-template-columns:44px minmax(0,1fr) 44px;gap:12px;padding:16px 0}.vv .ss-rows .n::after{display:none}}
.vv .ss-split{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(12px,2.34vw,32px);padding-top:var(--sec);align-items:center}
.vv .ss-split .vis{grid-column:1 / 7;margin:0;overflow:hidden;aspect-ratio:4 / 3.2;background:var(--fog)}
.vv .ss-split .vis img{width:100%;height:100%;object-fit:cover}
.vv .ss-split .cp{grid-column:8 / 13;display:grid;gap:18px;justify-items:start;min-width:0}
.vv .ss-split .vis{min-width:0}
.vv .ss-split .cp > p{color:var(--steel)}
.vv .ss-split .inl{display:grid;width:100%;border-top:1px solid var(--ink)}
.vv .ss-split .inl a{display:flex;justify-content:space-between;align-items:center;min-height:50px;border-bottom:1px solid var(--line);font-weight:500}
@media (hover:hover) and (pointer:fine){.vv .ss-split .inl a:hover{color:var(--pine)}}
@media (max-width:899px){.vv .ss-split .vis,.vv .ss-split .cp{grid-column:1 / -1}.vv .ss-split .cp{margin-top:28px}}
.vv .ss-people .ppl{width:100%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.vv .ss-people .ppl a{display:grid;gap:4px;padding:18px;background:var(--fog);min-height:140px;align-content:start}
.vv .ss-people .ppl b{font-weight:600;font-size:17px}
.vv .ss-people .ppl span{font-size:14px;color:var(--steel)}
.vv .ss-people .ppl small{margin-top:auto;padding-top:20px;font-size:13.5px;color:var(--pine);font-weight:500;word-break:break-all}
@media (hover:hover) and (pointer:fine){.vv .ss-people .ppl a:hover{background:var(--fog2)}}
@media (max-width:899px){.vv .ss-people .ppl{grid-template-columns:repeat(2,minmax(0,1fr))}}
.vv .ss-faq{padding-bottom:var(--sec)}
.vv .ss-shop{gap:0}
.vv .ss-shop .ss-head{margin-bottom:clamp(20px,2.4vw,32px)}
.vv .ss-shop .srow2{width:100%}
.vv .ss-shop .srow2 .txt .ringlink{margin-top:auto;padding-top:24px}
.vv .ss-teaser{width:100%;max-width:none;padding:var(--sec) 0 0;margin:0}
.vv .ss-teaser .sd{font-size:min(clamp(40px,5.2vw,88px),calc((100vw - 2 * var(--pad)) / 8.6))}
.vv-show.ss-faq .sd{font-size:min(clamp(40px,4.4vw,76px),calc((100vw - 2 * var(--pad)) / 6.4))}
.vv .ss-sec .sd,.vv .ss-split .sd{font-size:min(clamp(48px,6.6vw,116px),calc((100vw - 2 * var(--pad)) / 7.4))}
.vv .ss-split .cp .sd{font-size:min(clamp(40px,5.4vw,84px),calc((100vw - 2 * var(--pad)) / 6.8))}

/* ── product card (Set: grey, product multiplied in) ── */
.vv .pcard{display:grid;grid-template-rows:auto 1fr;background:var(--fog)}
.vv .pcard .ph{position:relative;aspect-ratio:1;display:grid;place-items:center;padding:14%}
.vv .pcard .ph img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;transition:transform .7s var(--ease)}
.vv .pcard .ph .sign{position:absolute;left:12px;top:12px;color:var(--steel)}
.vv .pcard .bd{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:14px 14px 16px 16px;align-items:end}
.vv .pcard .nm{font-weight:600;font-size:15.5px;line-height:1.3;grid-column:1 / -1}
.vv .pcard .pr{font-size:15px;color:var(--steel)}
.vv .add{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;box-shadow:inset 0 0 0 1px rgba(15,26,23,.3);font-size:14px;font-weight:600;transition:background-color .2s,color .2s,box-shadow .2s,transform .12s}
.vv .add[aria-pressed="true"]{background:var(--pine);color:#fff;box-shadow:none}
@media (hover:hover){.vv .add:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 2px var(--ink)}.vv .pcard:hover .ph img{transform:scale(1.05)}}
.vv .pgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
@media (max-width:1099px){.vv .pgrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:699px){.vv .pgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.vv .pcard .bd{grid-template-columns:minmax(0,1fr);padding:12px}.vv .add{justify-content:center}}

/* ── 6 · shop + trip list teaser ── */
.vv-shop{padding-top:var(--sec)}
.vv .trips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
.vv .trip{display:grid;gap:6px;padding:22px;background:#fff;box-shadow:inset 0 0 0 2px var(--ink);align-content:start;transition:background-color .3s,color .3s}
.vv .trip b{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(24px,2vw,32px);line-height:1;padding-right:.1em}
.vv .trip span{font-size:14.5px;color:var(--steel);transition:color .3s}
.vv .trip .tt{font-weight:600;color:var(--ink);margin-top:8px}
@media (hover:hover){.vv .trip:hover{background:var(--ink);color:#fff}.vv .trip:hover span,.vv .trip:hover .tt{color:rgba(255,255,255,.86)}}
@media (max-width:899px){.vv .trips{grid-template-columns:minmax(0,1fr)}}

.vv .shop-grid{display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr);gap:12px;align-items:stretch}
.vv .shop-grid .pgrid{grid-template-columns:repeat(4,minmax(0,1fr))}
.vv .receipts{display:grid;gap:12px;align-content:start}
.vv .rcpt{display:grid;gap:12px;padding:18px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .2s}
.vv .rcpt .thumbs{display:flex}
.vv .rcpt .thumbs img{width:56px;height:56px;object-fit:contain;background:var(--fog);mix-blend-mode:multiply;padding:6px;margin-right:-10px;box-shadow:0 0 0 2px #fff}
.vv .rcpt .rt b{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:22px;line-height:1;display:block;padding-right:.1em}
.vv .rcpt .rt small{font-size:14px;color:var(--steel)}
.vv .rcpt .rs{display:flex;justify-content:space-between;align-items:baseline;border-top:1px dashed rgba(15,26,23,.35);padding-top:10px;font-size:14px;color:var(--steel)}
.vv .rcpt .rs b{color:var(--ink);font-size:17px;font-weight:600}
@media (hover:hover){.vv .rcpt:hover{box-shadow:inset 0 0 0 2px var(--ink)}}
.vv .shop-grid .pgrid > li{display:grid}
@media (max-width:699px){.vv .shop-grid .pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:1099px){.vv .shop-grid{grid-template-columns:minmax(0,1fr)}.vv .receipts{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:699px){.vv .receipts{grid-template-columns:minmax(0,1fr)}}

/* ── 7 · workshop split ── */
.vv-work{padding-top:var(--sec)}
.vv-work .wgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:32px 64px;align-items:center}
.vv-work .frame{aspect-ratio:16 / 10}
.vv-work ul{display:grid;gap:10px;margin:22px 0 28px}
.vv-work li{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;font-size:16px}
.vv-work li svg{color:var(--pine);margin-top:3px}
@media (max-width:899px){.vv-work .wgrid{grid-template-columns:minmax(0,1fr)}}

/* ── 8 · visit: the showroom, full bleed ── */
.vv-visit{margin-top:var(--sec);position:relative;min-height:clamp(460px,52vw,720px);display:grid;align-items:end;color:#fff;overflow:hidden}
.vv-visit .bg{position:absolute;inset:0}
.vv-visit .bg img{width:100%;height:100%;object-fit:cover}
.vv-visit::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,43,35,.05) 20%,rgba(11,43,35,.88) 100%)}
.vv-visit .wrap{position:relative;z-index:1;padding-bottom:clamp(36px,5vw,72px);display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:24px 48px;align-items:end}
.vv-visit dl{display:grid;gap:0;font-size:15px}
.vv-visit dl div{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-top:1px solid rgba(255,255,255,.24)}
.vv-visit dt{color:rgba(255,255,255,.78)}
.vv-visit dd{font-weight:600;text-align:right}
@media (max-width:899px){.vv-visit .wrap{grid-template-columns:minmax(0,1fr)}}

/* ── 9 · learn + people ── */
.vv-learn{padding-top:var(--sec);padding-bottom:var(--sec)}
.vv .lgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:32px 64px;align-items:start}
.vv .vids{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;border-top:2px solid var(--ink)}
.vv .vids a{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:54px;border-bottom:1px solid var(--line);font-weight:500}
@media (hover:hover){.vv .vids a:hover{color:var(--pine)}}
.vv .people{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:48px}
.vv .people a{display:grid;gap:2px;padding:16px;background:var(--fog);min-height:44px}
.vv .people b{font-weight:600}
.vv .people span{font-size:14px;color:var(--steel)}
.vv .people small{font-size:13.5px;color:var(--pine);font-weight:600;margin-top:6px;word-break:break-all}
@media (max-width:899px){.vv .lgrid{grid-template-columns:minmax(0,1fr)}.vv .vids{grid-template-columns:minmax(0,1fr)}.vv .people{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ── pages ── */
.vv-page{padding:calc(var(--bar) + var(--hdr) + clamp(36px,4.6vw,68px) + env(safe-area-inset-top)) 0 var(--sec)}
.vv .intro{display:grid;gap:16px;margin-bottom:clamp(32px,4vw,56px);max-width:960px}
.vv .intro .crumb{display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:600;color:var(--steel);min-height:32px}
@media (hover:hover){.vv .intro .crumb:hover{color:var(--pine)}}
.vv .intro h1{font-size:min(clamp(44px,5.6vw,92px),calc((100vw - 2 * var(--pad)) / var(--fitw,6)))}

/* filters */
.vv .filters{display:grid;gap:14px;margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid var(--line)}
.vv .frow{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center}
.vv .frow > .sign{width:96px;color:var(--steel)}
.vv .chips{display:flex;flex-wrap:wrap;gap:6px}
.vv .chip{min-height:44px;padding:0 14px;font-size:14.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(15,26,23,.28);transition:background-color .2s,box-shadow .2s,color .2s,transform .12s}
.vv .chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
@media (hover:hover){.vv .chip:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 2px var(--ink)}}
.vv .ftools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;font-size:14.5px}
.vv .ftools select{min-height:44px;padding:0 34px 0 12px;border:1px solid rgba(15,26,23,.3);background:#fff;border-radius:0;font:14.5px 'VvT',sans-serif;-webkit-appearance:none;appearance:none;color:var(--ink);
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.vv .ftoggle{display:none;align-items:center;gap:10px;min-height:48px;padding:0 16px;box-shadow:inset 0 0 0 2px var(--ink);font-weight:600;width:100%}
.vv .ftoggle .chev{margin-left:auto;transition:transform .2s cubic-bezier(.23,1,.32,1)}
.vv .filters[data-open="1"] .ftoggle .chev{transform:rotate(180deg)}
@media (max-width:899px){
  .vv .ftoggle{display:flex}
  .vv .filters .fbody{display:none;gap:16px}
  .vv .filters[data-open="1"] .fbody{display:grid}
  .vv .frow > .sign{width:100%}
}
@media (min-width:900px){.vv .filters .fbody{display:grid;gap:12px}}
.vv .ugrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
@media (max-width:1099px){.vv .ugrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.vv .ugrid{grid-template-columns:minmax(0,1fr)}}
.vv .empty{padding:48px 28px;background:var(--fog);display:grid;gap:14px;justify-items:start}
.vv .empty h3{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:32px;padding-right:.1em}
.vv .note{font-size:13.5px;color:var(--steel);margin-top:24px;max-width:90ch}

/* unit detail */
.vv-detail .dgrid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:48px;align-items:start}
.vv-detail .dside{position:sticky;top:130px;display:grid;gap:18px}
.vv-detail .dside h1{font-size:clamp(40px,4vw,68px)}
.vv-detail .price{font-size:clamp(26px,2.4vw,34px);font-weight:600;letter-spacing:-.01em}
.vv-detail .keys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);box-shadow:0 0 0 1px var(--line)}
.vv-detail .keys div{background:#fff;padding:12px;display:grid;gap:6px}
.vv-detail .keys .sign{color:var(--steel)}
.vv-detail .keys b{font-size:19px;font-weight:600}
.vv-detail .dacts{display:grid;gap:8px}
.vv-detail .dacts .btn{width:100%}
.vv-detail .fin{font-size:14px;color:var(--steel)}
.vv-detail .fin a{color:var(--pine);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.vv-detail .plan{background:var(--fog);padding:clamp(20px,4vw,56px);display:grid;place-items:center}
.vv-detail .plan img{mix-blend-mode:multiply;width:100%;height:auto;max-height:420px;object-fit:contain}
.vv-detail .gal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}
.vv-detail .gal .frame{aspect-ratio:4 / 3}
.vv-detail .gal .frame:first-child{grid-column:1 / -1;aspect-ratio:16 / 9}
.vv-detail .specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 40px;margin-top:48px;border-top:2px solid var(--ink)}
.vv-detail .specs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--line);font-size:15.5px}
.vv-detail .specs dt{color:var(--steel)}
.vv-detail .specs dd{font-weight:600;text-align:right}
.vv-detail .dtext{display:grid;gap:12px;margin-top:36px;max-width:64ch;font-size:17px}
.vv-detail .files{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
.vv-detail .sellers{display:grid;gap:0;border-top:1px solid var(--line);margin-top:4px}
.vv-detail .sellers a{display:flex;justify-content:space-between;gap:12px;align-items:center;min-height:48px;border-bottom:1px solid var(--line);font-size:15px}
.vv-detail .sellers a span{color:var(--steel);font-size:14px}
@media (max-width:899px){.vv-detail .dgrid{grid-template-columns:minmax(0,1fr);gap:28px}.vv-detail .dside{position:static}.vv-detail .specs{grid-template-columns:minmax(0,1fr)}}

/* rental calendar */
.vv .rlist{display:grid;gap:12px}
.vv .rrow{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:0;background:var(--fog)}
.vv .rrow .ph{min-height:260px;background:#fff}
.vv .rrow .ph img{width:100%;height:100%;object-fit:cover}
.vv .rrow .bd{padding:clamp(20px,3vw,40px);display:grid;gap:12px;align-content:start}
.vv .rrow h2{font-size:clamp(30px,3vw,46px)}
@media (max-width:899px){.vv .rrow{grid-template-columns:minmax(0,1fr)}.vv .rrow .ph{aspect-ratio:4 / 3;min-height:0}}
.vv .cal{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;position:relative}
.vv .wk{position:relative;display:grid;gap:4px;padding:10px 10px 12px;text-align:left;background:#fff;box-shadow:inset 0 0 0 1px var(--line);min-height:76px;transition:background-color .2s,box-shadow .2s,color .2s,transform .12s}
.vv .wk .sign{color:var(--steel)}
.vv .wk .d{font-size:14px;font-weight:600;line-height:1.25}
.vv .wk .p{font-size:12.5px;color:var(--steel)}
.vv .wk[data-peak="1"]::after{content:'';position:absolute;right:8px;top:9px;width:8px;height:8px;border-radius:50%;background:var(--pine)}
.vv .wk:disabled{background:repeating-linear-gradient(135deg,var(--fog) 0 6px,#fff 6px 12px);color:#8A938F;cursor:not-allowed;box-shadow:none}
.vv .wk:disabled .d{text-decoration:line-through;text-decoration-color:var(--signal)}
.vv .wk[aria-pressed="true"]{background:var(--pine);color:#fff;box-shadow:none}
.vv .wk[aria-pressed="true"] .sign,.vv .wk[aria-pressed="true"] .p{color:var(--mint)}
.vv .wk[aria-pressed="true"]::before{content:'';position:absolute;left:0;right:0;bottom:-5px;height:3px;background:var(--pine);transform-origin:left;animation:vv-sweep .3s cubic-bezier(.23,1,.32,1) both}
@keyframes vv-sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (hover:hover){.vv .wk:not(:disabled):not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 2px var(--pine)}}
.vv .legend{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13.5px;color:var(--steel);margin:12px 0 0}
.vv .legend span{display:inline-flex;align-items:center;gap:8px}
.vv .legend i{width:14px;height:14px;display:inline-block}
.vv .legend .f{box-shadow:inset 0 0 0 1px var(--line);background:#fff}
.vv .legend .b{background:repeating-linear-gradient(135deg,var(--fog2) 0 3px,#fff 3px 6px)}
.vv .legend .s{background:var(--pine)}
.vv .legend .pk{width:8px;height:8px;border-radius:50%;background:var(--pine)}
@media (max-width:1099px){.vv .cal{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (max-width:599px){.vv .cal{grid-template-columns:repeat(2,minmax(0,1fr))}}
.vv .sumbox{display:grid;gap:0;background:var(--fog);padding:20px 22px;position:relative}
.vv .sumbox .sw{position:absolute;left:0;right:0;top:-1px;height:4px;background:var(--pine);transform-origin:left;transform:scaleX(var(--p,0));transition:transform .3s cubic-bezier(.23,1,.32,1)}
.vv .sumbox div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--line);font-size:15px}
.vv .sumbox div:last-child{border:0;font-weight:600;font-size:18px;padding-top:12px}
.vv .terms{display:grid;gap:0;border-top:1px solid var(--line)}
.vv .terms li{padding:11px 0 11px 22px;border-bottom:1px solid var(--line);position:relative;font-size:15px}
.vv .terms li::before{content:'';position:absolute;left:0;top:19px;width:10px;height:3px;background:var(--pine);transform:skewX(-20deg)}

/* forms */
.vv .form{display:grid;gap:18px;max-width:720px}
.vv .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.vv .form label > span,.vv .form fieldset legend{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:var(--ink)}
.vv .form .hint{display:block;font-size:13px;color:var(--steel);margin-top:6px;font-weight:400}
.vv .form input,.vv .form select,.vv .form textarea{width:100%;min-height:52px;padding:10px 14px;border:1px solid rgba(15,26,23,.36);border-radius:0;background:#fff;color:var(--ink);font:16px 'VvT',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,box-shadow .2s}
.vv .form textarea{min-height:120px;resize:vertical}
.vv .form select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:36px}
.vv .form input:focus,.vv .form select:focus,.vv .form textarea:focus{border-color:var(--pine);box-shadow:0 0 0 3px rgba(1,72,58,.2)}
.vv .form input[type="file"]{padding:13px 14px}
.vv .form [aria-invalid="true"]{border-color:#B00012}
.vv .form .err{font-size:13.5px;color:#B00012;margin-top:6px;font-weight:500}
.vv .form fieldset{border:0;padding:0;margin:0;min-width:0}
.vv .form .opts{display:flex;gap:8px;flex-wrap:wrap}
.vv .form .opt{position:relative}
.vv .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.vv .form .opt > span{display:inline-flex;align-items:center;min-height:46px;padding:0 16px;box-shadow:inset 0 0 0 1px rgba(15,26,23,.3);font-size:15px;font-weight:500;transition:background-color .2s,box-shadow .2s,color .2s,transform .12s}
.vv .form .opt input:checked + span{background:var(--pine);color:#fff;box-shadow:none}
.vv .form .opt input:focus-visible + span{outline:2px solid var(--pine);outline-offset:2px}
.vv .form .bigopt > span{display:grid;align-items:start;gap:3px;padding:12px 16px;min-width:200px;max-width:320px;text-align:left}
.vv .form .bigopt > span b{font-weight:600;font-size:16px;line-height:1.2}
.vv .form .bigopt > span small{font-size:13px;opacity:.8;line-height:1.35}
.vv .form .check{display:flex;gap:10px;align-items:flex-start;font-size:15px;min-height:44px;padding-top:10px}
.vv .form .check input{width:22px;min-height:22px;height:22px;padding:0;flex:none;margin-top:1px;-webkit-appearance:checkbox;appearance:auto;accent-color:var(--pine)}
.vv .form .acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vv .done{padding:28px;background:var(--fog);max-width:720px;border-top:4px solid var(--pine)}
.vv .done h2{font-size:clamp(30px,3vw,44px)}
.vv .done dl{margin:20px 0;display:grid;gap:0}
.vv .done dl div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid var(--line);font-size:15px}
.vv .done dt{color:var(--steel)}
.vv .done dd{font-weight:600;text-align:right}
.vv .done .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.vv .proto-note{font-size:13px;color:var(--steel);margin-top:14px}
.vv .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:56px;align-items:start}
.vv .aside{display:grid;gap:12px;font-size:15px;padding-top:20px;border-top:2px solid var(--ink)}
.vv .aside h3{font-weight:600;font-size:20px}
.vv .aside p,.vv .aside li{color:var(--steel)}
.vv .aside ul{display:grid;gap:8px}
.vv .aside .frame{margin-top:8px;aspect-ratio:16 / 10}
.vv .picked{display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;align-items:center;padding:12px;background:var(--fog)}
.vv .picked img{width:110px;aspect-ratio:4 / 3;object-fit:contain;mix-blend-mode:multiply}
.vv .picked b{font-weight:600;font-size:17px;display:block;line-height:1.2}
.vv .picked span{font-size:13.5px;color:var(--steel)}
@media (max-width:899px){.vv .book-grid{grid-template-columns:minmax(0,1fr);gap:36px}.vv .form .two{grid-template-columns:minmax(0,1fr)}.vv .form .bigopt{flex:1 1 100%}.vv .form .bigopt > span{width:100%;max-width:none}}

/* trip list */
.vv .tl-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:start}
.vv .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.vv .tl{display:grid;border-top:2px solid var(--ink)}
.vv .tli{display:grid;grid-template-columns:72px minmax(0,1fr) auto auto;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.vv .tli img{width:72px;height:72px;object-fit:contain;background:var(--fog);mix-blend-mode:multiply;padding:6px}
.vv .tli b{font-weight:600;font-size:15.5px;line-height:1.3;display:block}
.vv .tli small{color:var(--steel);font-size:13.5px}
.vv .qty{display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--line)}
.vv .qty button{width:44px;height:44px;display:grid;place-items:center}
.vv .qty span{min-width:28px;text-align:center;font-weight:600}
.vv .tli .rm{width:44px;height:44px;display:grid;place-items:center;color:var(--steel)}
@media (hover:hover){.vv .qty button:hover,.vv .tli .rm:hover{background:var(--fog)}}
.vv .ship{position:relative;height:6px;background:var(--fog2);margin:12px 0 6px;overflow:hidden}
.vv .ship i{position:absolute;inset:0;background:var(--pine);transform-origin:left;transition:transform .6s var(--ease)}
@media (max-width:899px){.vv .tl-grid{grid-template-columns:minmax(0,1fr)}.vv .tli{grid-template-columns:56px minmax(0,1fr) auto;row-gap:6px}.vv .tli img{width:56px;height:56px}.vv .tli .qty{grid-column:2}.vv .tli .rm{grid-column:3;grid-row:1}}

/* staff-side inbox */
.vv-inbox .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 18px;background:var(--pi);color:#fff;margin-bottom:24px;font-size:14px}
.vv-inbox table{width:100%;border-collapse:collapse;font-size:15px}
.vv-inbox th{text-align:left;font-weight:600;font-size:13px;color:var(--steel);padding:0 12px 10px 0;border-bottom:2px solid var(--ink)}
.vv-inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.vv-inbox td:first-child{font-weight:600;white-space:nowrap}
.vv-inbox .kind{display:inline-flex;align-items:center;min-height:26px;padding:0 10px;background:var(--fog)}
.vv-inbox .st{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600}
.vv-inbox .st i{width:8px;height:8px;border-radius:50%;background:var(--pine)}
.vv-inbox .st.new i{background:var(--signal)}
.vv-inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.vv-inbox .ia button,.vv-inbox .ia a{min-height:40px;padding:0 12px;display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--line);font-size:13.5px;font-weight:600}
.vv-inbox .ia button{background:var(--ink);color:#fff;box-shadow:none}
.vv-inbox small{color:var(--steel)}
.vv-inbox .inote{font-size:13.5px;color:var(--steel);margin-top:20px;max-width:80ch}
@media (max-width:899px){
  .vv-inbox table,.vv-inbox tbody,.vv-inbox tr,.vv-inbox td{display:block}
  .vv-inbox thead{display:none}
  .vv-inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}
  .vv-inbox td{padding:3px 0;border:0}
}
.vv .doc{max-width:760px;display:grid;gap:26px}
.vv .doc h2{font-size:clamp(26px,2.4vw,36px)}
.vv .doc p{font-size:17px}

/* ── footer ── */
.vv-foot{background:var(--pi);color:#fff;padding:88px 0 40px;position:relative}
.vv-foot .ftop{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.vv-foot .fbrand img{width:clamp(170px,14vw,220px);height:auto}
.vv-foot .fbrand .sl{font-family:'VvD',sans-serif;font-weight:800;font-style:normal;text-transform:uppercase;font-size:clamp(30px,3vw,46px);line-height:1;margin-top:28px;padding-right:.1em}
.vv-foot .fbrand p{margin-top:14px;font-size:15px;color:rgba(255,255,255,.8);max-width:40ch}
.vv-foot .fcols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.vv-foot h3{font-weight:600;font-size:15px;margin-bottom:8px;color:var(--mint)}
.vv-foot .fcols p,.vv-foot .fcols a{display:block;font-size:14.5px;color:rgba(255,255,255,.84);line-height:1.75}
.vv-foot .fcols a{min-height:28px}
@media (hover:hover){.vv-foot a:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}}
.vv-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:56px;padding-top:24px;border-top:1px solid rgba(255,255,255,.16);font-size:13px;color:rgba(255,255,255,.74)}
.vv-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.vv-foot .proto{font-size:12px;line-height:1.6;color:rgba(255,255,255,.62);margin-top:18px;max-width:110ch}
@media (max-width:899px){
  .vv-foot{padding:64px 0 calc(110px + env(safe-area-inset-bottom))}
  .vv-foot .ftop{grid-template-columns:minmax(0,1fr);gap:36px}
  .vv-foot .fcols{grid-template-columns:minmax(0,1fr);gap:24px}
}

/* ── mobile sticky bar ── */
.vv-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.3fr 1fr;gap:6px;padding:6px;
  background:rgba(11,43,35,.95);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .4s cubic-bezier(.23,1,.32,1)}
.vv-sticky a,.vv-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;color:#fff;font-size:15px;font-weight:600}
.vv-sticky a:nth-child(2){background:#fff;color:var(--pi)}
@media (max-width:899px){.vv-sticky{display:grid}}
.vv[data-sticky="1"] .vv-sticky{transform:none}
.vv.menu-open .vv-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Víkurverk's colours ── */
.vv sndr-chat{--chat-accent:${PINE};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#56605C;--chat-line:#D3DAD6;--chat-sunk:#EEF1EF;--chat-radius:0px;--chat-font:'VvT',system-ui,sans-serif}
@media (max-width:899px){.vv sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .vv *,.vv *::before,.vv *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .vv [data-media]{clip-path:none!important}
}
`
