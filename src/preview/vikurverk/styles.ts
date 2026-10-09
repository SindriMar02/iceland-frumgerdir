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
@font-face{font-family:'VvD';src:url('${F}mona-sans-v4-latin_latin-ext-900italic.woff2') format('woff2');font-weight:900;font-style:italic;font-display:swap}
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
.vv h1,.vv h2,.vv .disp{font-family:'VvD','VvT',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-.012em;line-height:.96;text-wrap:balance;overflow-wrap:normal;word-break:normal;hyphens:manual}
.vv-learn h2{font-size:clamp(34px,3.6vw,56px)}
.vv h1{font-size:clamp(46px,6.4vw,104px)}
.vv h2{font-size:clamp(34px,4.2vw,68px)}
.vv h3{font-weight:600;letter-spacing:-.01em;line-height:1.2;text-wrap:balance}
/* italic overhang + accent headroom (masked-reveal-clips-icelandic-accents) */
.vv [data-chars] .ch-mask,.vv .lm{padding:.26em .12em .1em .02em;margin:-.26em -.12em -.1em -.02em}
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
.vv .row .logo{display:block;flex:none}
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
.vv-menu-panel .mg a{display:block;font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(28px,8vw,44px);line-height:1.1;padding:3px .1em 3px 0}
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

/* ── 1 · hero: words left, the photo under the swoosh right ── */
.vv-hero{padding:calc(var(--bar) + var(--hdr) + clamp(28px,4vw,64px) + env(safe-area-inset-top)) 0 clamp(48px,6vw,96px);background:#fff}
.vv-hero .hgrid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:24px 64px;align-items:end}
.vv-hero h1{font-size:min(118px,calc(((100vw - 2 * var(--pad)) - 64px) * .5833 / 7.15));line-height:.92}
.vv-hero h1 .lm:last-child span{color:var(--pine)}
.vv-hero .lede{margin-top:26px}
.vv-hero .ctas{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}
.vv-hero .vk{display:block;margin-top:22px}
.vv-hero .hfig{position:relative;margin:0}
.vv-hero .hmask{position:relative;aspect-ratio:4 / 4.4;max-height:calc(100svh - var(--bar) - var(--hdr) - 80px);width:100%;overflow:hidden;background:var(--fog2);
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 24 C 28 22 62 11 100 0 L100 100 L0 100 Z'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 24 C 28 22 62 11 100 0 L100 100 L0 100 Z'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat}
.vv-hero .hmask img{width:100%;height:100%;object-fit:cover;object-position:50% 60%}
.vv-hero .hmask .hp{position:absolute;inset:0}
.vv-hero .hbox{position:relative}
.vv-hero .hsw{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.vv-hero .hsw path{fill:var(--pine)}
.vv-hero figcaption{margin-top:12px}
@media (max-width:899px){
  .vv-hero{padding-top:calc(var(--bar) + var(--hdr) + 22px + env(safe-area-inset-top))}
  .vv-hero .hgrid{grid-template-columns:minmax(0,1fr);gap:28px}
  .vv-hero h1{font-size:min(84px,calc((100vw - 2 * var(--pad)) / 7.15))}
  .vv-hero .lede{margin-top:16px;font-size:17px}
  .vv-hero .ctas{margin-top:20px}
  .vv-hero .ctas .btn{flex:1 1 auto}
  .vv-hero .hmask{aspect-ratio:5 / 4;max-height:none}
  .vv-hero .vk{display:none}
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
.vv .plate b{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(28px,2.6vw,44px);line-height:1;margin-top:8px;padding-right:.1em}
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
.vv .uc .nm{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(22px,1.8vw,28px);line-height:1.02;padding-right:.1em}
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
.vv .rc .nm{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(24px,2vw,30px);line-height:1;padding-right:.1em}
.vv .rc .pp{font-size:15px;color:rgba(255,255,255,.84)}
.vv .rc .pp b{color:#fff;font-size:20px;font-weight:600}
.vv .rc .free{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.vv .rc .free span{display:inline-flex;align-items:center;height:30px;padding:0 10px;background:var(--mint);color:var(--pi)}
.vv .rc .go{display:inline-flex;align-items:center;gap:8px;font-weight:600;margin-top:8px}
@media (hover:hover){.vv .rc:hover{background:rgba(255,255,255,.1)}.vv .rc:hover .ph img{transform:scale(1.04)}}
@media (max-width:899px){.vv-rent .rgrid{grid-template-columns:minmax(0,1fr)}}

/* ── 5 · trade-in strip ── */
.vv-trade{padding-top:var(--sec)}
.vv-trade .tbox{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:32px 64px;align-items:end;background:var(--fog);padding:clamp(28px,4vw,64px)}
.vv-trade form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.vv-trade label{grid-column:1 / -1;font-size:14px;font-weight:600}
.vv-trade input{min-height:52px;padding:0 16px;border:1px solid rgba(15,26,23,.36);background:#fff;color:var(--ink);font:17px 'VvT',sans-serif;border-radius:0;-webkit-appearance:none;appearance:none;text-transform:uppercase;letter-spacing:.08em}
.vv-trade input:focus{outline:none;border-color:var(--pine);box-shadow:0 0 0 3px rgba(1,72,58,.2)}
.vv-trade .fine{grid-column:1 / -1;font-size:13.5px;color:var(--steel)}
@media (max-width:899px){.vv-trade .tbox{grid-template-columns:minmax(0,1fr)}.vv-trade form{grid-template-columns:minmax(0,1fr)}}

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
.vv .trip b{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(24px,2vw,32px);line-height:1;padding-right:.1em}
.vv .trip span{font-size:14.5px;color:var(--steel);transition:color .3s}
.vv .trip .tt{font-weight:600;color:var(--ink);margin-top:8px}
@media (hover:hover){.vv .trip:hover{background:var(--ink);color:#fff}.vv .trip:hover span,.vv .trip:hover .tt{color:rgba(255,255,255,.86)}}
@media (max-width:899px){.vv .trips{grid-template-columns:minmax(0,1fr)}}

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
.vv .empty h3{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:32px;padding-right:.1em}
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
.vv-foot .fbrand .sl{font-family:'VvD',sans-serif;font-weight:900;font-style:italic;text-transform:uppercase;font-size:clamp(30px,3vw,46px);line-height:1;margin-top:28px;padding-right:.1em}
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
