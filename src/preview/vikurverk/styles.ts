/*
 * Víkurverk — the visual system, round 3 (2026-10-10).
 * Torn down from lightshiprv.com (Awwwards SOTD 2023 + 2026, premium travel trailers):
 * teardown in 04-platform/sndr-teardowns/teardowns/lightship-vikurverk-2026-10-10, values
 * lifted from vendor/www.lightshiprv.com/assets/styles/main.css (literal clamps, eases,
 * radii, header glass). Shop + choosing flow from Mammut and Pebble
 * (_docs/vikurverk-reference-hunt-2026-10-10). Víkurverk's pine replaces Lightship's red.
 * Mona Sans 400 stands in for F37 Bolton. Motion budget: an opening, reveals that play
 * once, hover feedback. No pinning, no scrubbed parallax.
 * Prefix `vv`, so nothing here reaches another route.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0E100F'
export const PINE = '#01483A'
export const PINE_INK = '#0B2B23'
const F = `${B}fonts/vikurverk/`

export const CSS = `
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'VvT';src:url('${F}mona-sans-v4-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:#FFFFFF}
html.vv-menu,html.vv-menu body{overflow:hidden}

.vv{
  --ink:${INK};--paper:#FFFFFF;--beige:#FAF6EF;--sand:#F2EFEA;--grey:#D9D9D9;--grey-d:#C1C1C1;--grey-l:#F4F4F4;--grey-ll:#F7F7F7;
  --steel:#6E6C68;--line:#E4E2DD;--pine:${PINE};--pine-h:#02372D;--pi:${PINE_INK};--mint:#CFE6DA;--err:#B00012;
  --ease:cubic-bezier(.38,0,.215,1);--out:cubic-bezier(.23,1,.32,1);--out3:cubic-bezier(.165,.84,.44,1);--slow:cubic-bezier(0,1,.4,1);
  --t-fast:.15s;--t:.3s;--t-med:.45s;--t-slow:.6s;--t-slower:.9s;
  --r-sm:8px;--r-md:12px;--r-card:10px;--r-lg:18px;
  --sp-xs:clamp(1.25rem,1.0714rem + .8929vw,1.875rem);--sp-sm:clamp(1.875rem,1.6964rem + .8929vw,2.5rem);--sp-md:clamp(2.5rem,2.2857rem + 1.0714vw,3.25rem);
  --sp-lg:clamp(3.25rem,2.75rem + 2.5vw,5rem);--sp-xl:clamp(5rem,4.6429rem + 1.7857vw,6.25rem);--sp-2xl:clamp(6.25rem,5.3571rem + 4.4643vw,9.375rem);--sp-3xl:clamp(9.375rem,8.4821rem + 4.4643vw,12.5rem);
  --h-3xl:clamp(4rem,2.5rem + 7.5vw,9.25rem);--h-2xl:clamp(2.0625rem,1.2946rem + 3.8393vw,4.75rem);--h-xl:clamp(2.375rem,1.7679rem + 3.0357vw,4.5rem);
  --h-lg:clamp(2.125rem,1.5893rem + 2.6786vw,4rem);--h-md:clamp(1.5rem,1.0714rem + 2.1429vw,3rem);--h-sm:clamp(1.5rem,1.3214rem + .8929vw,2.125rem);
  --h-xs:clamp(1.375rem,1.3393rem + .1786vw,1.5rem);--h-2xs:clamp(1.125rem,1.0893rem + .1786vw,1.25rem);
  --t-xs:clamp(.6875rem,.65rem + .1786vw,.75rem);--t-sm:clamp(.8125rem,.7768rem + .1786vw,.875rem);--t-md:clamp(.875rem,.8393rem + .1786vw,1rem);--t-lg:clamp(1.125rem,1.0536rem + .3571vw,1.375rem);
  --gutter:8px;--margin:16px;--edge:8px;--hdr:50px;--banner:0px;
  font-family:'VvT',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
@media (min-width:700px){.vv{--margin:clamp(1rem,-0.9286rem + 9.6429vw,7.75rem);--gutter:12px}}
.vv[data-banner="1"]{--banner:40px}
.vv *{box-sizing:border-box}
.vv a{color:inherit;text-decoration:none}
.vv p,.vv h1,.vv h2,.vv h3,.vv h4,.vv figure,.vv ul,.vv ol,.vv dl,.vv dd{margin:0}
.vv ul,.vv ol{padding:0;list-style:none}
.vv img{display:block;max-width:100%}
.vv button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.vv a,.vv button,.vv label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.vv :focus-visible{outline:2px solid var(--pine);outline-offset:3px}
.vv .on-dark :focus-visible,.vv-menu-panel :focus-visible{outline-color:#fff}
.vv .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vv .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--ink);color:#fff;padding:12px 18px;border-radius:999px}
.vv .skip:focus{top:16px}
.vv section[id],.vv [data-anchor]{scroll-margin-top:96px}
.vv .wrap{width:100%;max-width:1680px;margin:0 auto;padding-inline:var(--margin)}
.vv .edge{width:100%;padding-inline:var(--edge)}
.vv .num{font-variant-numeric:tabular-nums}
.vv .muted{color:var(--steel)}

/* ── type: one weight, tight tracking, sentence case ── */
.vv h1,.vv h2,.vv .hd{font-weight:400;letter-spacing:-.05em;line-height:1;text-wrap:balance}
.vv .h-3xl{font-size:var(--h-3xl)}
.vv .h-2xl{font-size:var(--h-2xl)}
.vv .h-xl{font-size:var(--h-xl)}
.vv .h-lg{font-size:var(--h-lg)}
.vv .h-md{font-size:var(--h-md)}
.vv .h-sm{font-size:var(--h-sm);line-height:1.2}
.vv .h-xs{font-size:var(--h-xs);letter-spacing:-.03em;line-height:1.25;font-weight:400}
.vv h3{font-weight:400;letter-spacing:-.02em;line-height:1.25}
.vv .eyebrow{font-size:var(--t-sm);line-height:1.25;color:var(--steel)}
.vv .lede{font-size:var(--t-lg);line-height:1.35;color:var(--steel);max-width:40ch}
.vv .small{font-size:var(--t-sm);line-height:1.4}
.vv .lm{display:block;overflow:hidden;padding:.12em .04em .14em;margin:-.12em -.04em -.14em}
.vv .lm > span{display:block}

/* ── buttons: Lightship's c-button (pill, label rolls) ── */
.vv .btn{--bh:44px;--bg:var(--ink);--fg:#fff;--bg-h:var(--pine);--fg-h:#fff;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:var(--bh);min-width:var(--bh);padding:0 20px;
  border-radius:999px;background:var(--bg);color:var(--fg);font-size:var(--t-sm);font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;isolation:isolate;
  transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.vv .btn:active{transform:scale(.97)}
.vv .btn .lbl{position:relative;display:inline-block;overflow:hidden;height:1.25em;line-height:1.25em}
.vv .btn .lbl > span{display:block;transition:transform var(--t) var(--out)}
.vv .btn .lbl > span + span{position:absolute;left:0;top:100%}
.vv .btn svg{flex:none;transition:transform var(--t) var(--out)}
.vv .btn.lg{--bh:50px;padding:0 28px;font-size:var(--t-md)}
.vv .btn.sm{--bh:34px;padding:0 14px}
.vv .btn.sq{border-radius:var(--r-sm)}
.vv .btn.white{--bg:#fff;--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.vv .btn.pine{--bg:var(--pine);--fg:#fff;--bg-h:var(--pine-h)}
.vv .btn.grey{--bg:var(--grey-ll);--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.vv .btn.beige{--bg:var(--beige);--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.vv .btn.line{--bg:transparent;--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff;box-shadow:inset 0 0 0 1px var(--grey-d)}
.vv .btn.glass{--bg:rgba(255,255,255,.2);--fg:#fff;--bg-h:#fff;--fg-h:var(--ink);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
.vv .btn.glass-d{--bg:rgba(0,0,0,.4);--fg:#fff;--bg-h:var(--pine);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
@media (hover:hover) and (pointer:fine){
  .vv .btn:hover{background:var(--bg-h);color:var(--fg-h)}
  .vv .btn:hover .lbl > span{transform:translateY(-100%)}
  .vv .btn:hover svg{transform:translateX(3px)}
}
.vv .ibtn{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.05);color:var(--ink);flex:none;transition:background-color var(--t-fast),color var(--t-fast),opacity var(--t-fast)}
.vv .ibtn.light{background:rgba(255,255,255,.22);color:#fff;-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
.vv .ibtn:disabled{opacity:.35;cursor:default}
@media (hover:hover) and (pointer:fine){.vv .ibtn:not(:disabled):hover{background:var(--ink);color:#fff}.vv .ibtn.light:hover{background:#fff;color:var(--ink)}}
.vv .tlink{display:inline-flex;align-items:center;gap:6px;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;text-decoration-color:var(--grey-d);min-height:32px;transition:text-decoration-color var(--t)}
@media (hover:hover){.vv .tlink:hover{text-decoration-color:currentColor}}

/* ── banner (Lightship's announcement bar) ── */
.vv .banner{position:fixed;inset:0 0 auto 0;height:var(--banner);z-index:70;display:flex;align-items:center;justify-content:center;gap:12px;padding:0 48px;
  background:var(--pi);color:rgba(255,255,255,.88);font-size:var(--t-sm);padding-top:env(safe-area-inset-top);box-sizing:content-box}
.vv[data-banner="0"] .banner{display:none}
.vv .banner a{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;transition:background-color var(--t-fast)}
@media (hover:hover){.vv .banner a:hover{background:rgba(255,255,255,.26)}}
.vv .banner .x{position:absolute;right:8px;top:50%;margin-top:calc(env(safe-area-inset-top) / 2);transform:translateY(-50%);width:40px;height:40px;display:grid;place-items:center;color:rgba(255,255,255,.7)}
@media (max-width:599px){.vv .banner .hide-s{display:none}}

/* ── header: floating glass capsule ── */
.vv .hdr{position:fixed;left:var(--edge);right:var(--edge);top:calc(var(--banner) + var(--edge) + env(safe-area-inset-top));z-index:60;display:flex;justify-content:center;pointer-events:none}
.vv .cap{pointer-events:auto;position:relative;width:100%;max-width:100%;height:var(--hdr);border-radius:var(--r-md);display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;padding:0 6px;
  background:color-mix(in oklab,#fff 60%,transparent);-webkit-backdrop-filter:blur(66px);backdrop-filter:blur(66px);color:var(--ink);
  transition:background-color var(--t),color var(--t)}
.vv[data-over="1"] .cap{background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;color:#fff}
.vv .cap .nav{display:flex;align-items:center;gap:0}
.vv .cap .nav > .dd > button,.vv .cap .nav > a{display:inline-flex;align-items:center;gap:4px;height:var(--hdr);padding:0 14px;font-size:var(--t-sm)}
.vv .cap .nav svg{opacity:.6;transition:transform .2s var(--out)}
.vv .dd[data-open="1"] > button svg{transform:rotate(180deg)}
.vv .cap .nav [aria-current="true"]{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:1px}
.vv .cap .logo{display:grid;place-items:center;height:var(--hdr);padding:0 16px}
.vv .cap .logo img{height:38px;width:auto}
.vv .cap .logo .lw{display:none}
.vv[data-over="1"] .cap .logo .lc{display:none}
.vv[data-over="1"] .cap .logo .lw{display:block}
.vv .cap .acts{display:flex;align-items:center;justify-content:flex-end;gap:4px}
.vv .cap .bag{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:50%}
.vv .cap .bag .n{position:absolute;top:2px;right:0;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--pine);color:#fff;font-size:11px;display:grid;place-items:center;line-height:1}
.vv .cap .burger{display:none;width:44px;height:44px;place-items:center;border-radius:50%}
.vv .cap .btn{--bh:38px}
.vv[data-over="1"] .cap .btn{--bg:#fff;--fg:var(--ink)}
@media (hover:hover){.vv .cap .nav > .dd > button:hover,.vv .cap .nav > a:hover{opacity:.6}}
.vv .dd{position:relative}
.vv .dd .panel{position:absolute;top:calc(100% + 8px);left:0;width:min(560px,calc(100vw - 32px));display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:8px;padding:8px;border-radius:var(--r-md);
  background:#fff;color:var(--ink);box-shadow:0 30px 60px -30px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.04);
  opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .16s ease-out,transform .22s var(--out),visibility 0s .22s}
.vv .dd[data-open="1"] .panel{opacity:1;visibility:visible;transform:none;transition:opacity .18s ease-out,transform .25s var(--out)}
.vv .dd .panel ul{display:grid;align-content:start}
.vv .dd .panel a{display:grid;gap:2px;padding:10px 12px;border-radius:var(--r-sm);transition:background-color var(--t-fast)}
.vv .dd .panel a b{font-weight:400;font-size:var(--t-md)}
.vv .dd .panel a span{font-size:var(--t-sm);color:var(--steel);line-height:1.35}
@media (hover:hover){.vv .dd .panel a:hover{background:var(--grey-ll)}}
.vv .dd .panel figure{position:relative;border-radius:var(--r-sm);overflow:hidden;min-height:200px;background:var(--beige)}
.vv .dd .panel figure img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vv .dd .panel figcaption{position:absolute;left:10px;bottom:10px;right:10px;color:#fff;font-size:var(--t-sm);line-height:1.25;text-shadow:0 1px 8px rgba(0,0,0,.4)}
@media (max-width:1023px){
  .vv .cap{grid-template-columns:auto minmax(0,1fr) auto}
  .vv .cap .nav{display:none}
  .vv .cap .logo{justify-content:start;padding-left:10px}
  .vv .cap .burger{display:grid}
  .vv .cap .acts{grid-column:3}
}
@media (max-width:599px){.vv .cap .acts .btn{display:none}.vv .cap .logo img{height:26px}}

/* ── menu: a white sheet under the capsule ── */
.vv-menu-panel{position:fixed;left:var(--edge);right:var(--edge);top:calc(var(--banner) + var(--edge) + env(safe-area-inset-top));bottom:var(--edge);z-index:120;border-radius:var(--r-md);background:#fff;color:var(--ink);
  display:flex;flex-direction:column;padding:0 var(--sp-xs) var(--sp-xs);overflow-y:auto;overscroll-behavior:contain;box-shadow:0 30px 80px -30px rgba(0,0,0,.4)}
.vv-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;height:var(--hdr);margin:0 calc(var(--sp-xs) * -1 + 6px) 0 -6px}
.vv-menu-panel .mtop img{height:26px;width:auto;margin-left:10px}
.vv-menu-panel .mx{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:var(--grey-ll)}
.vv-menu-panel .mgroups{display:grid;gap:28px;margin-top:24px}
.vv-menu-panel .mg p{font-size:var(--t-sm);color:var(--steel);margin-bottom:6px}
.vv-menu-panel .mg a{display:block;font-size:var(--h-md);letter-spacing:-.05em;line-height:1.15;padding:2px 0}
.vv-menu-panel .mg a[aria-current="page"]{color:var(--pine)}
.vv-menu-panel .mfoot{margin-top:auto;display:grid;gap:8px;padding-top:32px;font-size:var(--t-md);color:var(--steel)}
.vv-menu-panel .mfoot a,.vv-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.vv-menu-panel .mfoot a.big{font-size:var(--h-sm);letter-spacing:-.04em;color:var(--ink)}

/* ── media ── */
.vv .ph{position:relative;overflow:hidden;background:var(--beige)}
.vv .ph > img,.vv .ph > picture img{width:100%;height:100%;object-fit:cover}
.vv [data-rv-img]{overflow:hidden}
.vv .zoom img{transition:transform var(--t-slower) var(--out)}
@media (hover:hover) and (pointer:fine){.vv a:hover > .zoom img,.vv a:hover .zoom img,.vv .zoom:hover img{transform:scale(1.03)}}

/* ── 1 · hero: framed, full height, no pin ── */
.vv .hero{position:relative;height:100svh;min-height:560px;padding:calc(var(--banner) + var(--edge) + env(safe-area-inset-top)) var(--edge) var(--edge);color:#fff}
.vv .hero .mask{position:relative;height:100%;border-radius:var(--r-md);overflow:hidden;background:#1d2420;clip-path:inset(0 round var(--r-md))}
.vv .hero .mask img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% 55%}
.vv .hero .mask::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.42) 0%,rgba(0,0,0,.18) 34%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.vv .hero .inner{position:absolute;inset:0;z-index:1;display:grid;grid-template-rows:auto 1fr auto;padding:0 calc(var(--edge) + 20px)}
.vv .hero .copy{grid-row:1;display:grid;justify-items:center;text-align:center;gap:18px;margin:0 auto;max-width:900px;padding-top:calc(var(--hdr) + clamp(48px,9svh,110px))}
.vv .hero .cta{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px}
.vv .hero h1{font-size:var(--h-2xl);text-shadow:0 2px 30px rgba(0,0,0,.2)}
.vv .hero .sub{font-size:var(--t-lg);line-height:1.35;max-width:40ch;opacity:.94;text-shadow:0 1px 16px rgba(0,0,0,.25)}
.vv .hero .bot{grid-row:3;align-self:end;position:relative;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0}
.vv .hero .rule{position:absolute;left:0;right:0;top:0;height:1px;background:currentColor;opacity:.5;transform-origin:left}
.vv .hero .bot p{font-size:var(--t-sm);opacity:.9}
@media (max-width:699px){
  .vv .hero{height:92svh}
  .vv .hero .mask img{object-position:50% 60%}
  .vv .hero .inner{padding:0 18px}
  .vv .hero h1{font-size:clamp(2.5rem,11vw,3.5rem)}
  .vv .hero .copy{gap:14px}
  .vv .hero .bot p:last-child{display:none}
  .vv .hero .copy{padding-top:calc(var(--hdr) + 40px)}
  .vv .hero .cta{width:100%}
  .vv .hero .cta .btn{flex:1}
}

/* ── 2 · intro: quiet centred paragraph, then a statement ── */
.vv .intro-c{display:grid;justify-items:center;text-align:center;gap:var(--sp-md);padding:var(--sp-2xl) var(--margin) 0}
.vv .intro-c .q{max-width:44ch;font-size:var(--t-md);color:var(--steel);line-height:1.45}
.vv .intro-c h2{max-width:16ch}

/* section heads */
.vv .sec{padding-top:var(--sp-2xl)}
.vv .shead{display:flex;justify-content:space-between;align-items:flex-end;gap:16px 40px;flex-wrap:wrap;margin-bottom:var(--sp-md)}
.vv .shead .t{display:grid;gap:12px;max-width:820px}
.vv .shead .t p{color:var(--steel);max-width:48ch}
.vv .shead .tools{display:flex;align-items:center;gap:8px}
.vv .center-head{display:grid;justify-items:center;text-align:center;gap:20px;margin-bottom:var(--sp-lg)}

/* ── rail: Lightship's captioned card carousel (native scroll, snap, arrows) ── */
.vv .rail{display:grid;grid-auto-flow:column;grid-auto-columns:var(--cw,calc((100% - 2 * var(--gutter)) / 3.15));gap:var(--gutter);overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-padding-inline:var(--margin);padding-inline:var(--margin);margin-inline:calc(var(--margin) * -1);scrollbar-width:none;overscroll-behavior-x:contain}
.vv .rail::-webkit-scrollbar{display:none}
.vv .rail > *{scroll-snap-align:start;min-width:0}
.vv .rail-ft{display:flex;align-items:center;gap:8px;margin-top:16px}
.vv .rail-ft .dots{display:flex;gap:6px;margin-left:8px}
.vv .rail-ft .dots i{width:6px;height:6px;border-radius:50%;background:var(--grey-d);transition:background-color var(--t),transform var(--t)}
.vv .rail-ft .dots i.on{background:var(--ink)}
@media (max-width:999px){.vv .rail{grid-auto-columns:calc((100% - var(--gutter)) / 2.2)}}
@media (max-width:599px){.vv .rail{grid-auto-columns:82%}.vv .rail.pr{grid-auto-columns:calc((100% - var(--gutter)) / 2.15)}}

/* the captioned photo card */
.vv .pc{position:relative;display:block;aspect-ratio:var(--ar,592 / 644);border-radius:var(--r-card);overflow:hidden;color:#fff;background:#2b302d;isolation:isolate}
.vv .pc .ph{position:absolute;inset:0;background:transparent}
.vv .pc::after{content:'';position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(0,0,0,.32) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%);pointer-events:none}
.vv .pc .top{position:absolute;left:14px;right:14px;top:12px;z-index:1;display:flex;justify-content:space-between;gap:8px;font-size:var(--t-sm)}
.vv .pc .bt{position:absolute;left:14px;right:14px;bottom:14px;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.vv .pc .bt h3{font-size:var(--h-xs);letter-spacing:-.03em;line-height:1.15;max-width:18ch}
.vv .pc .bt p{font-size:var(--t-sm);opacity:.86;margin-top:4px}
.vv .pc .ibtn{background:rgba(255,255,255,.24);color:#fff}
@media (hover:hover) and (pointer:fine){.vv a.pc:hover .ibtn{background:#fff;color:var(--ink)}}
.vv .pill{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:rgba(0,0,0,.28);font-size:var(--t-xs);color:#fff;white-space:nowrap}
.vv .pill.solid{background:var(--ink);color:#fff}
.vv .pill.pine{background:var(--pine);color:#fff}
.vv .pill.light{background:#fff;color:var(--ink)}

/* trip chooser (Pebble TabbedCarousel: ten-column slides, faded neighbours, tabs follow the swipe) */
.vv .itabs{display:inline-flex;gap:2px;padding:3px;border-radius:var(--r-md);background:var(--sand);max-width:100%;overflow-x:auto;scrollbar-width:none}
.vv .itabs::-webkit-scrollbar{display:none}
.vv .itabs button{min-height:44px;padding:0 16px;border-radius:10px;font-size:var(--t-md);white-space:nowrap;transition:background-color var(--t) var(--out)}
.vv .itabs button[aria-selected="true"]{background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.vv .itrack{position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:min(1160px,calc(100vw - 2 * var(--margin)));gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;padding-inline:calc((100vw - min(1160px,calc(100vw - 2 * var(--margin)))) / 2);scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x pan-y}
.vv .itrack::-webkit-scrollbar{display:none}
.vv .itrack > li{scroll-snap-align:center;opacity:.25;transition:opacity var(--t) var(--out)}
.vv .itrack > li[data-on="1"]{opacity:1}
.vv .icard{display:grid;grid-template-columns:minmax(0,448px) minmax(0,1fr);gap:8px;padding:8px;border-radius:var(--r-lg);background:var(--sand);height:min(72svh,576px)}
.vv .ipanel{display:flex;flex-direction:column;gap:12px;padding:clamp(20px,2.6vw,40px);border-radius:var(--r-md);background:var(--beige);align-items:flex-start}
.vv .ipanel h3{letter-spacing:-.05em}
.vv .ifit{width:100%;display:grid;border-top:1px solid rgba(0,0,0,.08);margin:auto 0 8px}
.vv .ifit a{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(0,0,0,.08);font-size:var(--t-md)}
.vv .ifit a .num{color:var(--steel);white-space:nowrap}
@media (hover:hover){.vv .ifit a:hover span:first-child{text-decoration:underline;text-underline-offset:4px}}
.vv .iimg{position:relative;border-radius:var(--r-md);overflow:hidden;background:var(--grey-l)}
.vv .iimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
@media (max-width:899px){
  .vv .itrack{grid-auto-columns:calc(100vw - 2 * var(--margin) - 16px);padding-inline:calc(var(--margin) + 8px)}
  .vv .icard{grid-template-columns:minmax(0,1fr);grid-template-rows:240px auto;height:auto}
  .vv .iimg{order:-1}
  .vv .ifit{margin-top:8px}
  .vv .center-head .itabs{justify-content:flex-start}
}

/* ── 4 · four ways in: a four-up grid of tall cards ── */
.vv .ways{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.vv .ways .pc{--ar:3 / 4}
@media (max-width:999px){.vv .ways{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.vv .ways{grid-template-columns:minmax(0,1fr)}.vv .ways .pc{--ar:4 / 3.4}}

/* ── 5 · closer look: the framed full-width photo with a centred line ── */
.vv .look{position:relative;margin-top:var(--sp-2xl);border-radius:var(--r-md);overflow:hidden;min-height:clamp(420px,56vw,820px);display:grid;place-items:center;text-align:center;color:#fff;isolation:isolate}
.vv .look > .ph{position:absolute;inset:0;z-index:-1;background:#2b302d}
.vv .look::after{content:'';position:absolute;inset:0;z-index:-1;background:rgba(0,0,0,.3)}
.vv .look .c{display:grid;justify-items:center;gap:22px;padding:24px}
.vv .look h2{max-width:14ch}
.vv .stmt{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);padding-top:var(--sp-md)}
.vv .stmt p.big{grid-column:1 / 9;font-size:var(--h-md);letter-spacing:-.05em;line-height:1.08}
.vv .stmt .side{grid-column:10 / 13;align-self:end;display:grid;gap:14px;justify-items:start;color:var(--steel);font-size:var(--t-md)}
@media (max-width:899px){.vv .stmt p.big,.vv .stmt .side{grid-column:1 / -1}.vv .stmt .side{margin-top:16px}}

/* ── 6 · the rental band: night scene + glass list ── */
.vv .band{position:relative;margin-top:var(--sp-2xl);border-radius:var(--r-md);overflow:hidden;color:#fff;isolation:isolate;min-height:clamp(560px,52vw,800px);display:grid;align-items:end}
.vv .band > .ph{position:absolute;inset:0;z-index:-1;background:#1e2b3a}
.vv .band::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.12) 55%,rgba(0,0,0,0) 100%)}
.vv .band .in{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:24px 48px;align-items:end;padding:var(--sp-lg) clamp(18px,4vw,56px)}
.vv .band .copy{display:grid;gap:18px;justify-items:start}
.vv .band .copy p{opacity:.88;max-width:38ch}
.vv .glass{border-radius:var(--r-md);background:color-mix(in oklab,#fff 14%,transparent);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);overflow:hidden}
.vv .glass a{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.14);transition:background-color var(--t-fast)}
.vv .glass a:last-child{border-bottom:0}
.vv .glass img{width:64px;height:48px;border-radius:6px;object-fit:cover}
.vv .glass b{font-weight:400;font-size:var(--t-lg);letter-spacing:-.02em;display:block;line-height:1.2}
.vv .glass small{font-size:var(--t-sm);opacity:.8}
.vv .glass .pr{font-size:var(--t-sm);text-align:right;white-space:nowrap}
@media (hover:hover){.vv .glass a:hover{background:rgba(255,255,255,.1)}}
@media (max-width:899px){.vv .band .in{grid-template-columns:minmax(0,1fr)}.vv .band::after{background:linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(0,0,0,.55) 60%)}}
@media (max-width:599px){.vv .glass a{grid-template-columns:52px minmax(0,1fr)}.vv .glass img{width:52px;height:40px}.vv .glass .pr{grid-column:2;text-align:left}}

/* ── 7 · shop (Mammut: category tiles, product grid on grey, editorial between) ── */
.vv .cats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.vv .cat{display:grid;gap:10px}
.vv .cat .ph{aspect-ratio:1;border-radius:var(--r-card);background:var(--grey-l);display:grid;place-items:center}
.vv .cat .ph img{width:62%;height:62%;object-fit:contain;mix-blend-mode:multiply}
.vv .cat b{font-weight:400;font-size:var(--t-md);display:flex;justify-content:space-between;align-items:center;gap:8px}
.vv .cat small{color:var(--steel);font-size:var(--t-sm)}
@media (max-width:899px){.vv .cats{grid-template-columns:repeat(2,minmax(0,1fr))}}
.vv .pgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px var(--gutter)}
@media (max-width:1099px){.vv .pgrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:699px){.vv .pgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px var(--gutter)}}
.vv .pcard{position:relative;display:grid;gap:10px;align-content:start}
.vv .pcard .media{position:relative}
.vv .pcard .ph{display:grid;aspect-ratio:4 / 5;border-radius:var(--r-sm);background:var(--grey-l);display:grid;place-items:center}
.vv .pcard .ph img{width:72%;height:72%;object-fit:contain;mix-blend-mode:multiply;transition:transform var(--t-slower) var(--out)}
.vv .pcard .ph .pill{position:absolute;left:10px;top:10px}
.vv .pcard .add{position:absolute;right:10px;bottom:10px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--ink);box-shadow:0 4px 14px -6px rgba(0,0,0,.25);transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.vv .pcard .add[aria-pressed="true"]{background:var(--pine);color:#fff}
.vv .pcard .add:active{transform:scale(.92)}
.vv .pcard .br{font-size:var(--t-xs);color:var(--steel);text-transform:uppercase;letter-spacing:.06em}
.vv .pcard .nm{font-size:var(--t-md);line-height:1.3;font-weight:400}
.vv .pcard .pr{font-size:var(--t-md)}
.vv .pcard .bd{display:grid;gap:4px}
@media (hover:hover) and (pointer:fine){.vv .pcard:hover .ph img{transform:scale(1.05)}.vv .pcard .add:not([aria-pressed="true"]):hover{background:var(--ink);color:#fff}}
.vv .editorial{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);margin:var(--sp-lg) 0;align-items:stretch}
.vv .editorial .ph{grid-column:1 / 8;border-radius:var(--r-card);min-height:420px}
.vv .editorial .tl2{grid-column:8 / 13;display:flex;flex-direction:column;border-radius:var(--r-card);background:var(--sand);padding:clamp(18px,2vw,28px)}
.vv .tl2 h3{font-size:var(--h-sm);letter-spacing:-.05em;line-height:1.1}
.vv .tl2 > p{color:var(--steel);margin-top:10px;font-size:var(--t-md)}
.vv .tl2 ul{margin:18px 0;display:grid;border-top:1px solid rgba(0,0,0,.08)}
.vv .tl2 li{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.08);font-size:var(--t-sm)}
.vv .tl2 li img{width:48px;height:48px;object-fit:contain;mix-blend-mode:multiply;background:#fff;border-radius:6px;padding:4px}
.vv .tl2 .tot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px;gap:12px;flex-wrap:wrap}
.vv .tl2 .tot b{font-weight:400;font-size:var(--t-lg)}
@media (max-width:899px){.vv .editorial .ph,.vv .editorial .tl2{grid-column:1 / -1}.vv .editorial .ph{min-height:0;aspect-ratio:4 / 3}}

/* ── 8 · people ── */
.vv .ppl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.vv .ppl a{display:grid;gap:2px;align-content:start;padding:18px;border-radius:var(--r-card);background:var(--beige);min-height:150px;transition:background-color var(--t)}
.vv .ppl b{font-weight:400;font-size:var(--t-lg);letter-spacing:-.02em}
.vv .ppl span{font-size:var(--t-sm);color:var(--steel)}
.vv .ppl small{margin-top:auto;padding-top:18px;font-size:var(--t-sm);word-break:break-all}
@media (hover:hover){.vv .ppl a:hover{background:var(--sand)}}
@media (max-width:899px){.vv .ppl{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ── 9 · questions (Pebble): sand panel, white rows ── */
.vv .faq{margin-top:var(--sp-2xl);border-radius:var(--r-md);background:var(--sand);padding:var(--sp-xl) var(--margin)}
.vv .faq .center-head{margin-bottom:var(--sp-md)}
.vv .acc-list{display:grid;gap:6px;max-width:880px;margin:0 auto}
.vv .acc{border-radius:var(--r-sm);background:#fff}
.vv .acc-b{width:100%;display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;gap:16px;min-height:60px;padding:10px 12px 10px 18px;text-align:left;font-size:var(--t-md)}
.vv .acc-b .pm{position:relative;width:32px;height:32px;border-radius:50%;background:var(--grey-ll)}
.vv .acc-b .pm::before,.vv .acc-b .pm::after{content:'';position:absolute;left:50%;top:50%;width:11px;height:1.5px;margin:-.75px 0 0 -5.5px;background:var(--ink);transition:transform var(--t) var(--out)}
.vv .acc-b .pm::after{transform:rotate(90deg)}
.vv .acc.is-open .acc-b .pm::after{transform:rotate(0)}
.vv .acc-p{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--t) var(--out)}
.vv .acc.is-open .acc-p{grid-template-rows:1fr}
.vv .acc-p > div{overflow:hidden}
.vv .acc-p p{padding:0 60px 18px 18px;color:var(--steel);font-size:var(--t-md);max-width:70ch}
.vv .faq .more{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:var(--sp-sm)}
@media (max-width:599px){.vv .acc-p p{padding-right:18px}}

/* ── 10 · two tiles before the footer ── */
.vv .tiles{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--gutter);margin-top:var(--sp-2xl)}
.vv .tile{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:200px;padding:16px 16px 16px 20px;border-radius:var(--r-card);color:#fff;background:#5E5E5C;transition:background-color var(--t)}
.vv .tile.pine{background:var(--pine)}
.vv .tile small{font-size:var(--t-sm);opacity:.8}
.vv .tile .tb{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.vv .tile b{font-weight:400;font-size:var(--h-xs);letter-spacing:-.03em;line-height:1.15}
@media (hover:hover){.vv .tile:hover{background:#4C4C4A}.vv .tile.pine:hover{background:var(--pine-h)}.vv .tile:hover .ibtn{background:#fff;color:var(--ink)}}
@media (max-width:599px){.vv .tiles{grid-template-columns:minmax(0,1fr)}.vv .tile{min-height:150px}}

/* ── inner pages ── */
.vv .page{padding:calc(var(--banner) + var(--edge) + var(--hdr) + var(--sp-lg) + env(safe-area-inset-top)) 0 0}
.vv .ptitle{display:grid;gap:16px;margin-bottom:var(--sp-lg);max-width:980px}
.vv .ptitle .crumb{display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm);color:var(--steel);min-height:32px;width:max-content}
@media (hover:hover){.vv .ptitle .crumb:hover{color:var(--ink)}}
.vv .ptitle h1{font-size:var(--h-2xl)}
.vv .note{font-size:var(--t-sm);color:var(--steel);margin-top:var(--sp-sm);max-width:90ch}

/* catalogue (Mammut PLP: filter bar, count, grid) */
.vv .fbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:var(--sp-sm)}
.vv .fbar .count{margin-right:auto;font-size:var(--t-sm);color:var(--steel)}
.vv .fbar select{height:38px;padding:0 34px 0 14px;border-radius:999px;border:0;background:var(--grey-ll);font:var(--t-sm) 'VvT',sans-serif;color:var(--ink);-webkit-appearance:none;appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 17px) 52%,calc(100% - 12px) 52%;background-size:5px 5px;background-repeat:no-repeat}
.vv .chips{display:flex;gap:6px;flex-wrap:wrap}
.vv .chip{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;background:var(--grey-ll);font-size:var(--t-sm);transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.vv .chip[aria-pressed="true"]{background:var(--ink);color:#fff}
.vv .chip:active{transform:scale(.97)}
@media (hover:hover){.vv .chip:not([aria-pressed="true"]):hover{background:var(--grey)}}
.vv .fpanel{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:20px;padding:var(--sp-xs);border-radius:var(--r-md);background:var(--grey-ll);margin-bottom:var(--sp-sm)}
.vv .fpanel .fg{display:grid;gap:10px;align-content:start}
.vv .fpanel .fg > span{font-size:var(--t-sm);color:var(--steel)}
.vv .fpanel .chip{background:#fff}
.vv .fpanel .chip[aria-pressed="true"]{background:var(--ink)}
@media (max-width:1099px){.vv .fpanel{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.vv .fpanel{grid-template-columns:minmax(0,1fr)}}
.vv .ugrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--sp-sm) var(--gutter)}
@media (max-width:1099px){.vv .ugrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.vv .ugrid{grid-template-columns:minmax(0,1fr)}}
.vv .uc{display:grid;gap:12px;align-content:start}
.vv .uc .ph{aspect-ratio:4 / 3;border-radius:var(--r-card);background:var(--grey-l)}
.vv .uc .ph img{position:absolute;inset:0;width:100%;height:100%;transition:opacity var(--t-med) var(--out),transform var(--t-slower) var(--out)}
.vv .uc .ph .shot{object-fit:cover}
.vv .uc .ph .plan{object-fit:contain;padding:12% 9%;mix-blend-mode:multiply;opacity:0}
.vv .uc .tags{position:absolute;left:10px;top:10px;display:flex;gap:6px;z-index:1}
.vv .uc .bd{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;align-items:baseline}
.vv .uc .br{grid-column:1 / -1;font-size:var(--t-sm);color:var(--steel)}
.vv .uc .nm{font-size:var(--h-xs);letter-spacing:-.03em;line-height:1.2;font-weight:400}
.vv .uc .pr{font-size:var(--t-md);white-space:nowrap}
.vv .uc .facts{grid-column:1 / -1;display:flex;flex-wrap:wrap;gap:2px 12px;font-size:var(--t-sm);color:var(--steel)}
@media (hover:hover) and (pointer:fine){.vv .uc:hover .ph .plan{opacity:1}.vv .uc:hover .ph .shot.has-plan{opacity:0}.vv .uc:hover .ph .shot:not(.has-plan){transform:scale(1.03)}.vv .uc .ph{background:var(--grey-l)}}
.vv .empty{padding:var(--sp-md) var(--sp-sm);border-radius:var(--r-md);background:var(--beige);display:grid;gap:12px;justify-items:start}
.vv .empty h3{font-size:var(--h-sm);letter-spacing:-.05em}

/* towing tool */
.vv .tow{margin-top:var(--sp-2xl);border-radius:var(--r-md);background:var(--beige);padding:var(--sp-lg) clamp(18px,3vw,48px)}
.vv .tow-head{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:16px 56px;align-items:end;margin-bottom:var(--sp-md)}
.vv .tow-head p{color:var(--steel);max-width:52ch}
.vv .tow-in{display:grid;grid-template-columns:auto auto minmax(0,1fr);gap:10px 18px;align-items:center}
.vv .tow-in > span{font-size:var(--t-sm);color:var(--steel)}
.vv .tow-in output{font-size:var(--h-md);letter-spacing:-.05em;line-height:1;min-width:6.2ch}
.vv .tow-in input{width:100%;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:pan-y}
.vv .tow-in input::-webkit-slider-runnable-track{height:2px;background:var(--ink)}
.vv .tow-in input::-moz-range-track{height:2px;background:var(--ink)}
.vv .tow-in input::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-12px;border-radius:50%;background:var(--ink);border:4px solid #fff;box-shadow:0 0 0 1px var(--ink)}
.vv .tow-in input::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--ink);border:4px solid #fff}
.vv .scale{position:relative;height:110px;margin:26px 0 8px;border-bottom:1px solid var(--ink)}
.vv .scale .zone{position:absolute;left:0;bottom:0;height:6px;border-radius:3px 3px 0 0;background:var(--pine);transition:width .12s linear}
.vv .scale .tick{position:absolute;bottom:-26px;transform:translateX(-50%);font-size:var(--t-xs);color:var(--steel)}
.vv .scale .pin{position:absolute;bottom:0;transform:translateX(-50%);display:grid;justify-items:center;gap:4px}
.vv .scale .pin i{order:2;width:1px;height:58px;background:var(--grey-d);transition:background-color .2s}
.vv .scale .pin.l0 i{height:18px}.vv .scale .pin.l1 i{height:48px}.vv .scale .pin.l2 i{height:78px}
.vv .scale .pin em{order:1;font-style:normal;font-size:var(--t-xs);white-space:nowrap;padding:3px 8px;border-radius:999px;background:#fff;color:var(--steel);transition:background-color .2s,color .2s}
.vv .scale .pin.ok i{background:var(--pine)}
.vv .scale .pin.ok em{background:var(--pine);color:#fff}
.vv .tow-sum{margin-top:40px;font-size:var(--t-md)}
.vv .tow-cards{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:var(--gutter);margin-top:var(--sp-sm)}
.vv .tc{display:grid;gap:2px;padding-bottom:12px;border-radius:var(--r-card);background:#fff;overflow:hidden;height:100%;transition:opacity .25s,filter .25s}
.vv .tc .ph{aspect-ratio:4 / 3;display:grid;place-items:center;margin-bottom:8px;background:#fff}
.vv .tc .ph .plan{width:100%;height:100%;object-fit:contain;padding:10%;mix-blend-mode:multiply}
.vv .tc > :not(.ph){padding-inline:12px}
.vv .tc b{font-weight:400;font-size:var(--t-md);line-height:1.25}
.vv .tc .kg,.vv .tc .pr,.vv .tc .muted{font-size:var(--t-sm);color:var(--steel)}
.vv .tc .fit{justify-self:start;margin:8px 12px 0;font-size:var(--t-xs);padding:3px 9px;border-radius:999px;background:var(--grey-l);color:var(--steel)}
.vv .tc .fit.ok{background:var(--pine);color:#fff}
.vv .tow-cards li[data-ok="0"] .tc{opacity:.5;filter:grayscale(1)}
@media (hover:hover){.vv .tc:hover{opacity:1!important;filter:none!important}}
@media (max-width:1099px){.vv .tow-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:899px){
  .vv .tow-head{grid-template-columns:minmax(0,1fr)}
  .vv .tow-in{grid-template-columns:auto minmax(0,1fr)}
  .vv .tow-in input{grid-column:1 / -1}
  .vv .scale{height:44px}
  .vv .scale .pin em{display:none}
  .vv .scale .pin i{height:26px!important}
  .vv .tow-cards{grid-template-columns:repeat(2,minmax(0,1fr))}
}

/* unit detail (Lightship AE.1: framed hero, figures, view switch, spec sheet, sticky price) */
.vv .dhero{position:relative;height:min(88svh,940px);min-height:520px;padding:calc(var(--banner) + var(--edge) + env(safe-area-inset-top)) var(--edge) 0;color:#fff}
.vv .dhero .mask{position:relative;height:100%;border-radius:var(--r-md);overflow:hidden;background:#2b302d}
.vv .dhero .mask > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vv .dhero .mask::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,.6) 100%)}
.vv .dhero .in{position:absolute;left:0;right:0;bottom:0;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding:24px clamp(18px,2.4vw,32px)}
.vv .dhero .crumb{position:absolute;left:clamp(18px,2.4vw,32px);top:calc(var(--hdr) + 24px);z-index:1;display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm);opacity:.9}
.vv .dhero h1{font-size:var(--h-2xl)}
.vv .dhero .meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.vv .dhero .pr{font-size:var(--h-xs);letter-spacing:-.03em;white-space:nowrap}
@media (max-width:699px){.vv .dhero{height:78svh}.vv .dhero .in{flex-direction:column;align-items:flex-start;gap:8px}}
.vv .figs{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:var(--gutter);margin-top:var(--gutter)}
.vv .figs div{display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:120px;padding:14px 16px;border-radius:var(--r-card);background:var(--sand)}
.vv .figs b{font-weight:400;font-size:var(--h-xs);letter-spacing:-.03em}
.vv .figs span{font-size:var(--t-sm);color:var(--steel)}
@media (max-width:699px){.vv .figs{grid-template-columns:repeat(2,minmax(0,1fr))}.vv .figs div{min-height:96px}}
.vv .dgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);padding-top:var(--sp-xl)}
.vv .dgrid .dtext{grid-column:1 / 8;display:grid;gap:16px}
.vv .dgrid .dtext p:first-child{font-size:var(--h-sm);letter-spacing:-.04em;line-height:1.2;color:var(--ink)}
.vv .dgrid .dtext p{color:var(--steel);font-size:var(--t-md);max-width:62ch}
.vv .dgrid .dside{grid-column:9 / 13;display:grid;gap:12px;align-content:start}
.vv .dside .sellers{display:grid;border-top:1px solid var(--line)}
.vv .dside .sellers a{display:flex;justify-content:space-between;gap:12px;align-items:center;min-height:48px;border-bottom:1px solid var(--line);font-size:var(--t-md)}
.vv .dside .sellers a span{color:var(--steel);font-size:var(--t-sm)}
.vv .dside .fin{font-size:var(--t-sm);color:var(--steel)}
.vv .dside .fin a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
@media (max-width:899px){.vv .dgrid .dtext,.vv .dgrid .dside{grid-column:1 / -1}}
.vv .views{margin-top:var(--sp-2xl)}
.vv .seg{display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:var(--grey-ll)}
.vv .seg button{height:34px;padding:0 16px;border-radius:999px;font-size:var(--t-sm);transition:background-color var(--t-fast),color var(--t-fast)}
.vv .seg button[aria-pressed="true"]{background:var(--ink);color:#fff}
.vv .stage{position:relative;margin-top:16px;border-radius:var(--r-md);overflow:hidden;aspect-ratio:16 / 9;background:var(--grey-l)}
.vv .stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity var(--t) var(--out)}
.vv .stage img.plan{object-fit:contain;padding:6%;mix-blend-mode:multiply}
.vv .stage img.on{opacity:1}
.vv .stage .nav2{position:absolute;right:14px;bottom:14px;display:flex;gap:6px;z-index:1}
.vv .sheet{margin-top:var(--sp-2xl)}
.vv .sheet .panel{border-radius:var(--r-md);background:var(--sand);padding:8px 20px}
.vv .sheet dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px}
.vv .sheet dl div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;padding:14px 0;border-bottom:1px solid rgba(0,0,0,.08);font-size:var(--t-sm)}
.vv .sheet dt{color:var(--steel)}
.vv .sheet dd{color:var(--ink)}
@media (max-width:899px){.vv .sheet dl{grid-template-columns:minmax(0,1fr)}}
.vv .files{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.vv .buybar{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));z-index:55;width:min(680px,calc(100% - 16px));display:flex;align-items:center;gap:16px;padding:6px 6px 6px 18px;border-radius:var(--r-md);
  background:color-mix(in oklab,#111 72%,transparent);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);color:#fff;
  transform:translate(-50%,calc(100% + 28px));transition:transform .4s var(--out)}
.vv[data-buy="1"] .buybar{transform:translate(-50%,0)}
.vv .buybar .bn{display:grid;min-width:0;margin-right:auto}
.vv .buybar .bn b{font-weight:400;font-size:var(--t-md);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vv .buybar .bn span{font-size:var(--t-sm);opacity:.75}
@media (max-width:599px){.vv .buybar{padding-left:14px;gap:8px}.vv .buybar .btn.glass{display:none}}

/* rental */
.vv .rlist{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gutter)}
.vv .rcard{display:grid;gap:14px;align-content:start}
.vv .rcard .ph{aspect-ratio:4 / 3;border-radius:var(--r-card)}
.vv .rcard .bd{display:grid;gap:8px;justify-items:start}
.vv .rcard h2{font-size:var(--h-sm);letter-spacing:-.05em}
.vv .rcard .pp{font-size:var(--t-md)}
.vv .rcard .free{display:flex;gap:6px;flex-wrap:wrap}
.vv .rcard .free span{font-size:var(--t-xs);height:26px;padding:0 10px;display:inline-flex;align-items:center;border-radius:999px;background:var(--mint);color:var(--pi)}
@media (max-width:899px){.vv .rlist{grid-template-columns:minmax(0,1fr)}}
.vv .cal{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}
.vv .wk{position:relative;display:grid;gap:4px;padding:10px 12px 12px;text-align:left;border-radius:var(--r-sm);background:var(--grey-ll);min-height:78px;transition:background-color .2s,color .2s,transform .12s}
.vv .wk:active{transform:scale(.97)}
.vv .wk .s{font-size:var(--t-xs);color:var(--steel)}
.vv .wk .d{font-size:var(--t-sm);line-height:1.25}
.vv .wk .p{font-size:var(--t-xs);color:var(--steel)}
.vv .wk[data-peak="1"]::after{content:'';position:absolute;right:10px;top:10px;width:7px;height:7px;border-radius:50%;background:var(--pine)}
.vv .wk:disabled{background:repeating-linear-gradient(135deg,var(--grey-l) 0 6px,#fff 6px 12px);color:#9A9893;cursor:not-allowed}
.vv .wk:disabled .d{text-decoration:line-through}
.vv .wk[aria-pressed="true"]{background:var(--ink);color:#fff}
.vv .wk[aria-pressed="true"] .s,.vv .wk[aria-pressed="true"] .p{color:rgba(255,255,255,.7)}
@media (hover:hover){.vv .wk:not(:disabled):not([aria-pressed="true"]):hover{background:var(--grey)}}
@media (max-width:1099px){.vv .cal{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (max-width:599px){.vv .cal{grid-template-columns:repeat(2,minmax(0,1fr))}}
.vv .legend{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:var(--t-sm);color:var(--steel);margin-top:12px}
.vv .legend span{display:inline-flex;align-items:center;gap:8px}
.vv .legend i{width:14px;height:14px;display:inline-block;border-radius:4px}
.vv .legend .f{background:var(--grey-ll);box-shadow:inset 0 0 0 1px var(--grey)}
.vv .legend .b{background:repeating-linear-gradient(135deg,var(--grey) 0 3px,#fff 3px 6px)}
.vv .legend .s{background:var(--ink)}
.vv .legend .pk{width:7px;height:7px;border-radius:50%;background:var(--pine)}
.vv .sumbox{display:grid;border-radius:var(--r-md);background:var(--sand);padding:8px 20px}
.vv .sumbox div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(0,0,0,.08);font-size:var(--t-md)}
.vv .sumbox div:last-child{border:0;font-size:var(--t-lg)}
.vv .terms{display:grid;border-top:1px solid var(--line)}
.vv .terms li{padding:12px 0;border-bottom:1px solid var(--line);font-size:var(--t-sm);color:var(--steel)}

/* forms */
.vv .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--sp-lg);align-items:start}
@media (max-width:899px){.vv .book-grid{grid-template-columns:minmax(0,1fr);gap:var(--sp-md)}}
.vv .aside{display:grid;gap:14px;font-size:var(--t-md);color:var(--steel)}
.vv .aside h3{font-size:var(--h-xs);color:var(--ink)}
.vv .aside .ph{border-radius:var(--r-card);aspect-ratio:16 / 10;margin-top:4px}
.vv .form{display:grid;gap:18px;max-width:720px}
.vv .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
@media (max-width:599px){.vv .form .two{grid-template-columns:minmax(0,1fr)}}
.vv .form label > span,.vv .form legend{display:block;font-size:var(--t-sm);margin-bottom:8px;color:var(--ink)}
.vv .form .hint{display:block;font-size:var(--t-xs);color:var(--steel);margin-top:6px}
.vv .form input,.vv .form select,.vv .form textarea{width:100%;min-height:50px;padding:12px 16px;border:1px solid transparent;border-radius:var(--r-sm);background:var(--grey-ll);color:var(--ink);
  font:16px 'VvT',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,background-color .2s,box-shadow .2s}
.vv .form textarea{min-height:120px;resize:vertical}
.vv .form select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 19px) 52%,calc(100% - 14px) 52%;background-size:5px 5px;background-repeat:no-repeat;padding-right:40px}
.vv .form input:focus,.vv .form select:focus,.vv .form textarea:focus{background:#fff;border-color:var(--ink);box-shadow:0 0 0 3px rgba(0,0,0,.06)}
.vv .form input[type="file"]{padding:13px 16px}
.vv .form [aria-invalid="true"]{border-color:var(--err);background:#fff}
.vv .form .err{font-size:var(--t-sm);color:var(--err);margin-top:6px}
.vv .form fieldset{border:0;padding:0;margin:0;min-width:0}
.vv .form .opts{display:flex;gap:6px;flex-wrap:wrap}
.vv .form .opt{position:relative}
.vv .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.vv .form .opt > span{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;background:var(--grey-ll);font-size:var(--t-sm);transition:background-color .2s,color .2s}
.vv .form .opt input:checked + span{background:var(--ink);color:#fff}
.vv .form .opt input:focus-visible + span{outline:2px solid var(--pine);outline-offset:2px}
.vv .form .bigopt > span{display:grid;align-items:start;gap:3px;padding:12px 16px;border-radius:var(--r-sm);min-width:200px;max-width:320px;text-align:left}
.vv .form .bigopt > span b{font-weight:400;font-size:var(--t-md);line-height:1.2}
.vv .form .bigopt > span small{font-size:var(--t-xs);opacity:.75;line-height:1.35}
@media (max-width:899px){.vv .form .bigopt{flex:1 1 100%}.vv .form .bigopt > span{width:100%;max-width:none}}
.vv .form .check{display:flex;gap:10px;align-items:flex-start;font-size:var(--t-md);min-height:44px;padding-top:10px}
.vv .form .check input{width:22px;min-height:22px;height:22px;padding:0;flex:none;margin-top:1px;-webkit-appearance:checkbox;appearance:auto;accent-color:var(--pine)}
.vv .form .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vv .proto-note{font-size:var(--t-xs);color:var(--steel);margin-top:12px}
.vv .picked{display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;align-items:center;padding:10px;border-radius:var(--r-sm);background:var(--grey-ll)}
.vv .picked img{width:110px;aspect-ratio:4 / 3;object-fit:cover;border-radius:6px}
.vv .picked b{font-weight:400;font-size:var(--t-lg);display:block;line-height:1.2}
.vv .picked span{font-size:var(--t-sm);color:var(--steel)}
.vv .done{padding:var(--sp-sm);border-radius:var(--r-md);background:var(--sand);max-width:720px}
.vv .done h2{font-size:var(--h-md)}
.vv .done dl{margin:20px 0;display:grid}
.vv .done dl div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid rgba(0,0,0,.08);font-size:var(--t-md)}
.vv .done dt{color:var(--steel)}
.vv .done dd{text-align:right}
.vv .done .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}

/* trip list */
.vv .tl-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--sp-lg);align-items:start}
.vv .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.vv .tl{display:grid;border-top:1px solid var(--line)}
.vv .tli{display:grid;grid-template-columns:72px minmax(0,1fr) auto auto;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.vv .tli img{width:72px;height:72px;object-fit:contain;background:var(--grey-l);border-radius:var(--r-sm);mix-blend-mode:multiply;padding:6px}
.vv .tli b{font-weight:400;font-size:var(--t-md);line-height:1.3;display:block}
.vv .tli small{color:var(--steel);font-size:var(--t-sm)}
.vv .qty{display:inline-flex;align-items:center;border-radius:999px;background:var(--grey-ll)}
.vv .qty button{width:40px;height:40px;display:grid;place-items:center;border-radius:50%}
.vv .qty span{min-width:24px;text-align:center}
.vv .tli .rm{width:40px;height:40px;display:grid;place-items:center;color:var(--steel);border-radius:50%}
@media (hover:hover){.vv .qty button:hover,.vv .tli .rm:hover{background:var(--grey)}}
.vv .ship{position:relative;height:4px;border-radius:2px;background:var(--grey-l);margin:12px 0 6px;overflow:hidden}
.vv .ship i{position:absolute;inset:0;background:var(--pine);transform-origin:left;transition:transform var(--t-slow) var(--out)}
@media (max-width:899px){.vv .tl-grid{grid-template-columns:minmax(0,1fr)}.vv .tli{grid-template-columns:56px minmax(0,1fr) auto;row-gap:6px}.vv .tli img{width:56px;height:56px}.vv .tli .qty{grid-column:2}.vv .tli .rm{grid-column:3;grid-row:1}}

/* staff inbox */
.vv .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:12px 18px;border-radius:var(--r-sm);background:var(--pi);color:#fff;margin-bottom:20px;font-size:var(--t-sm)}
.vv .inbox table{width:100%;border-collapse:collapse;font-size:var(--t-sm)}
.vv .inbox th{text-align:left;font-weight:400;color:var(--steel);padding:0 12px 10px 0;border-bottom:1px solid var(--ink)}
.vv .inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.vv .inbox td:first-child{white-space:nowrap}
.vv .inbox .kind{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:var(--grey-ll)}
.vv .inbox .st{display:inline-flex;align-items:center;gap:6px}
.vv .inbox .st i{width:8px;height:8px;border-radius:50%;background:var(--pine)}
.vv .inbox .st.new i{background:#E0662C}
.vv .inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.vv .inbox .ia button,.vv .inbox .ia a{height:34px;padding:0 12px;display:inline-flex;align-items:center;border-radius:999px;background:var(--grey-ll)}
.vv .inbox .ia button{background:var(--ink);color:#fff}
.vv .inbox small{color:var(--steel)}
@media (max-width:899px){.vv .inbox table,.vv .inbox tbody,.vv .inbox tr,.vv .inbox td{display:block}.vv .inbox thead{display:none}.vv .inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}.vv .inbox td{padding:3px 0;border:0}}
.vv .doc{max-width:760px;display:grid;gap:22px}
.vv .doc p{font-size:var(--t-lg);line-height:1.45}

/* shop listing: Mammut's 300px filter rail beside an open grid; a drawer on phones */
.vv .shop{display:grid;grid-template-columns:260px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:start}
.vv .frail{position:sticky;top:calc(var(--banner) + var(--edge) + var(--hdr) + 24px);display:grid;gap:28px}
.vv .fg{display:grid;gap:10px;align-content:start}
.vv .fg > span{font-size:var(--t-sm);color:var(--steel)}
.vv .opts-list{display:grid}
.vv .opts-list button{width:100%;display:flex;justify-content:space-between;align-items:center;min-height:40px;padding:0 12px;border-radius:var(--r-sm);font-size:var(--t-md);text-align:left;transition:background-color var(--t-fast)}
.vv .opts-list button small{color:var(--steel);font-size:var(--t-xs)}
.vv .opts-list button[aria-pressed="true"]{background:var(--ink);color:#fff}
.vv .opts-list button[aria-pressed="true"] small{color:rgba(255,255,255,.7)}
@media (hover:hover){.vv .opts-list button:not([aria-pressed="true"]):hover{background:var(--grey-ll)}}
.vv .results .pgrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:56px var(--gutter)}
.vv .only-s{display:none}
@media (max-width:1023px){
  .vv .shop{grid-template-columns:minmax(0,1fr)}
  .vv .frail{display:none}
  .vv .only-s{display:inline-flex}
  .vv .results .pgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px var(--gutter)}
}
.vv .fdrawer{position:fixed;inset:0;z-index:130}
.vv .fdrawer .scrim{position:absolute;inset:0;background:rgba(0,0,0,.45);width:100%;height:100%}
.vv .fdrawer .sheet-in{position:absolute;left:0;top:0;bottom:0;width:min(345px,calc(100% - 45px));background:#fff;display:flex;flex-direction:column;animation:vv-in-l .4s cubic-bezier(.645,.045,.355,1) both}
@keyframes vv-in-l{from{transform:translateX(-100%)}to{transform:none}}
.vv .fdrawer .dtop{display:flex;justify-content:space-between;align-items:center;padding:calc(14px + env(safe-area-inset-top)) 16px 14px;border-bottom:1px solid var(--line)}
.vv .fdrawer .dtop b{font-weight:400;font-size:var(--t-lg)}
.vv .fdrawer .dbody{flex:1;overflow-y:auto;padding:20px 16px;display:grid;gap:28px;align-content:start;overscroll-behavior:contain}
.vv .fdrawer .dfoot{padding:14px 16px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--line);box-shadow:0 -2px 24px rgba(0,0,0,.06)}
.vv .w100{width:100%}

/* product page (Mammut PDP: big stage, sticky purchase column, details) */
.vv .pdp .crumb{display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm);color:var(--steel)}
.vv .pdp-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:start}
.vv .stagep{position:relative;aspect-ratio:4 / 5;max-height:78svh;border-radius:var(--r-md);background:var(--grey-l);display:grid;place-items:center;overflow:hidden}
.vv .stagep img{width:70%;height:70%;object-fit:contain;mix-blend-mode:multiply}
.vv .buy{position:sticky;top:calc(var(--banner) + var(--edge) + var(--hdr) + 24px)}
.vv .buy-in{display:grid;gap:14px}
.vv .buy h1{font-size:var(--h-md)}
.vv .buy .pr{font-size:var(--h-xs);letter-spacing:-.02em;margin-top:6px}
.vv .row-buy{display:flex;gap:8px;margin-top:10px}
.vv .row-buy .qty{flex:none}
.vv .row-buy .qty button{width:46px;height:50px}
.vv .grow{flex:1}
.vv .buy .facts{display:grid;gap:8px;font-size:var(--t-sm);color:var(--steel);margin-top:4px}
.vv .buy .facts li{display:flex;gap:8px;align-items:center}
.vv .pacc{display:grid;border-top:1px solid var(--ink);margin-top:14px}
.vv .pacc .acc{border-radius:0;background:transparent;border-bottom:1px solid var(--line)}
.vv .pacc .acc-b{padding-left:0;min-height:60px}
.vv .pacc .acc-p p{padding:0 0 18px;color:var(--steel)}
@media (max-width:899px){.vv .pdp-grid{grid-template-columns:minmax(0,1fr)}.vv .buy{position:static}.vv .stagep{aspect-ratio:1}}

/* the "added" panel: lower right, confirms the exact item (Mammut) */
.vv .added{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:140;width:min(380px,calc(100% - 32px));padding:14px;border-radius:var(--r-md);background:#fff;box-shadow:0 24px 60px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05);display:grid;gap:12px}
.vv .added .atop{display:flex;justify-content:space-between;align-items:center}
.vv .added .atop b{font-weight:400;font-size:var(--t-md)}
.vv .added .aitem{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center}
.vv .added .aitem img{width:64px;height:64px;object-fit:contain;background:var(--grey-l);border-radius:var(--r-sm);mix-blend-mode:multiply;padding:6px}
.vv .added .nm{display:block;font-size:var(--t-md);line-height:1.3}
.vv .added small{color:var(--steel);font-size:var(--t-sm)}
.vv .added .aacts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
@media (max-width:899px){.vv .added{left:8px;right:8px;width:auto;bottom:calc(68px + env(safe-area-inset-bottom))}}

/* ── footer (Lightship: statement + columns, quiet legal) ── */
.vv-foot{padding:var(--sp-2xl) 0 calc(var(--sp-sm) + env(safe-area-inset-bottom))}
.vv-foot .mark{display:flex;justify-content:center;margin-bottom:var(--sp-xl)}
.vv-foot .mark img{width:clamp(140px,14vw,200px);height:auto}
.vv-foot .ftop{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px var(--gutter)}
.vv-foot .fbrand{grid-column:1 / 5;display:grid;gap:8px;align-content:start}
.vv-foot .fbrand b{font-weight:400;font-size:var(--t-md)}
.vv-foot .fbrand p{font-size:var(--t-sm);color:var(--steel);max-width:36ch}
.vv-foot .fnav{grid-column:7 / 13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.vv-foot .fnav h3{font-size:var(--t-sm);color:var(--steel);margin-bottom:6px}
.vv-foot .fnav a,.vv-foot .fnav p{display:block;font-size:var(--t-sm);line-height:1.4;padding:5px 0;border-bottom:1px solid var(--line)}
@media (hover:hover){.vv-foot .fnav a:hover{color:var(--pine)}}
.vv-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:var(--sp-xl);font-size:var(--t-xs);color:var(--steel)}
.vv-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.vv-foot .proto{font-size:var(--t-xs);line-height:1.6;color:var(--steel);margin-top:14px;max-width:120ch}
@media (max-width:899px){.vv-foot .fbrand,.vv-foot .fnav{grid-column:1 / -1}.vv-foot .fnav{grid-template-columns:repeat(2,minmax(0,1fr))}.vv-foot{padding-bottom:calc(96px + env(safe-area-inset-bottom))}}

/* ── mobile quick bar (a capsule, like the header) ── */
.vv-sticky{position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:54;display:none;grid-template-columns:1fr 1.25fr 1fr;gap:4px;padding:4px;border-radius:var(--r-md);
  background:color-mix(in oklab,#fff 70%,transparent);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);box-shadow:0 10px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05);
  transform:translateY(calc(100% + 24px));transition:transform var(--t-slow) var(--out)}
.vv-sticky a,.vv-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:46px;border-radius:var(--r-sm);font-size:var(--t-sm);color:var(--ink)}
.vv-sticky a:nth-child(2){background:var(--ink);color:#fff}
@media (max-width:899px){.vv-sticky{display:grid}}
.vv[data-sticky="1"] .vv-sticky{transform:none}
.vv.menu-open .vv-sticky,.vv[data-buy="1"] .vv-sticky{transform:translateY(calc(100% + 24px))}

/* the assistant takes Víkurverk's colours */
.vv sndr-chat{--chat-accent:${PINE};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#6E6C68;--chat-line:#E4E2DD;--chat-sunk:#F7F7F7;--chat-radius:12px;--chat-font:'VvT',system-ui,sans-serif}
@media (max-width:899px){.vv sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .vv *,.vv *::before,.vv *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
}
`
