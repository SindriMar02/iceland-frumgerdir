/*
 * Umbúðagerðin: the visual system (DESIGN.md beside this file, locked 2026-10-15).
 * The Víkurverk round-3 engine (Lightship framing, Mammut shop, Pebble chooser) with the brand layer of
 * their own logo: brown ink, one red signal, amber for the box's third face, kraft tints. Epunda Slab for
 * display (their wordmark is a slab), Satoshi for everything else. Prefix `ug`, nothing on :root.
 */
const B = import.meta.env.BASE_URL
export const INK = '#2A2320'
export const BROWN = '#4E3D31'
export const RED = '#AC2619'
const F = `${B}fonts/umbudagerdin/`

export const CSS = `
@font-face{font-family:'UgS';src:url('${F}Satoshi-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'UgS';src:url('${F}Satoshi-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'UgS';src:url('${F}Satoshi-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
@font-face{font-family:'UgD';src:url('${F}epunda-slab-v2-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'UgD';src:url('${F}epunda-slab-v2-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'UgD';src:url('${F}epunda-slab-v2-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:#FFFFFF}
html.ug-menu,html.ug-menu body,html.ug-filter-open,html.ug-filter-open body{overflow:hidden}
html:has(.ug){scroll-behavior:auto!important}

.ug{
  --ink:${INK};--paper:#FFFFFF;--brown:${BROWN};--brown-d:#3B2E25;--red:${RED};--red-h:#8F1F14;--amber:#ECB54A;--amber-d:#C9932C;
  --kraft:#C9B59B;--kraft-d:#A88F72;--kraft-l:#E4D8C6;--cream:#F7F3EC;--sand:#EFE9DF;--grey-l:#F3F2F0;--plate:#EFE9DF;--grey-ll:#F8F7F5;--grey:#DDD9D3;--grey-d:#C4BEB5;
  --steel:#6F655C;--line:#E6E0D6;--err:#B00012;--ok:#2F6B3A;
  --ease:cubic-bezier(.38,0,.215,1);--out:cubic-bezier(.23,1,.32,1);--slow:cubic-bezier(0,1,.4,1);
  --t-fast:.15s;--t:.3s;--t-med:.45s;--t-slow:.6s;--t-slower:.9s;
  --r-sm:8px;--r-md:12px;--r-card:10px;--r-lg:18px;
  --sp-xs:clamp(1.25rem,1.0714rem + .8929vw,1.875rem);--sp-sm:clamp(1.875rem,1.6964rem + .8929vw,2.5rem);--sp-md:clamp(2.5rem,2.2857rem + 1.0714vw,3.25rem);
  --sp-lg:clamp(3.25rem,2.75rem + 2.5vw,5rem);--sp-xl:clamp(5rem,4.6429rem + 1.7857vw,6.25rem);--sp-2xl:clamp(6.25rem,5.3571rem + 4.4643vw,9.375rem);
  --h-3xl:clamp(3.5rem,2.2rem + 6.5vw,8rem);--h-2xl:clamp(2.0625rem,1.2946rem + 3.8393vw,4.5rem);--h-xl:clamp(2.25rem,1.7679rem + 2.8vw,4.125rem);
  --h-lg:clamp(2rem,1.5893rem + 2.4vw,3.5rem);--h-md:clamp(1.5rem,1.0714rem + 2.1429vw,2.75rem);--h-sm:clamp(1.4rem,1.3214rem + .8929vw,2rem);
  --h-xs:clamp(1.3rem,1.3393rem + .1786vw,1.5rem);--h-2xs:clamp(1.125rem,1.0893rem + .1786vw,1.25rem);
  --t-xs:clamp(.6875rem,.65rem + .1786vw,.75rem);--t-sm:clamp(.8125rem,.7768rem + .1786vw,.875rem);--t-md:clamp(.875rem,.8393rem + .1786vw,1rem);--t-lg:clamp(1.125rem,1.0536rem + .3571vw,1.375rem);
  --f-d:'UgD',Georgia,serif;--f-s:'UgS',system-ui,-apple-system,sans-serif;
  --gutter:8px;--margin:16px;--edge:8px;--hdr:50px;--banner:0px;
  font-family:var(--f-s);font-size:16px;line-height:1.5;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
@media (min-width:700px){.ug{--margin:clamp(1rem,-0.9286rem + 9.6429vw,7.75rem);--gutter:12px}}
.ug[data-banner="1"]{--banner:40px}
.ug *{box-sizing:border-box}
.ug a{color:inherit;text-decoration:none}
.ug p,.ug h1,.ug h2,.ug h3,.ug h4,.ug figure,.ug ul,.ug ol,.ug dl,.ug dd{margin:0}
.ug ul,.ug ol{padding:0;list-style:none}
.ug img{display:block;max-width:100%}
.ug button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.ug a,.ug button,.ug label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.ug :focus-visible{outline:2px solid var(--red);outline-offset:3px}
.ug .on-dark :focus-visible,.ug-menu-panel :focus-visible{outline-color:#fff}
.ug .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ug .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--ink);color:#fff;padding:12px 18px;border-radius:999px}
.ug .skip:focus{top:16px}
.ug section[id],.ug [data-anchor]{scroll-margin-top:96px}
.ug .wrap{width:100%;max-width:1680px;margin:0 auto;padding-inline:var(--margin)}
.ug .edge{width:100%;padding-inline:var(--edge)}
.ug .num{font-variant-numeric:tabular-nums}
.ug .muted{color:var(--steel)}

/* ── type: slab display, grotesk text ── */
.ug h1,.ug h2,.ug .hd{font-family:var(--f-d);font-weight:500;letter-spacing:-.025em;line-height:1.02;text-wrap:balance}
.ug .h-3xl{font-size:var(--h-3xl)}
.ug .h-2xl{font-size:var(--h-2xl)}
.ug .h-xl{font-size:var(--h-xl)}
.ug .h-lg{font-size:var(--h-lg)}
.ug .h-md{font-size:var(--h-md)}
.ug .h-sm{font-size:var(--h-sm);line-height:1.15}
.ug .h-xs{font-size:var(--h-xs);letter-spacing:-.015em;line-height:1.2;font-weight:500}
.ug h3{font-weight:500;letter-spacing:-.01em;line-height:1.25}
.ug .eyebrow{font-size:var(--t-sm);line-height:1.25;color:var(--steel)}
.ug .lede{font-size:var(--t-lg);line-height:1.4;color:var(--steel);max-width:44ch}
.ug .small{font-size:var(--t-sm);line-height:1.4}
.ug .lm{display:block;overflow:hidden;padding:.12em .04em .16em;margin:-.12em -.04em -.16em}
.ug .lm > span{display:block}

/* ── buttons: Lightship's pill with the label roll ── */
.ug .btn{--bh:44px;--bg:var(--ink);--fg:#fff;--bg-h:var(--red);--fg-h:#fff;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:var(--bh);min-width:var(--bh);padding:0 20px;
  border-radius:999px;background:var(--bg);color:var(--fg);font-size:var(--t-sm);font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;isolation:isolate;
  transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.ug .btn:active{transform:scale(.97)}
.ug .btn .lbl{position:relative;display:inline-block;overflow:hidden;height:1.25em;line-height:1.25em}
.ug .btn .lbl > span{display:block;transition:transform var(--t) var(--out)}
.ug .btn .lbl > span + span{position:absolute;left:0;top:100%}
.ug .btn svg{flex:none;transition:transform var(--t) var(--out)}
.ug .btn.lg{--bh:50px;padding:0 28px;font-size:var(--t-md)}
.ug .btn.sm{--bh:34px;padding:0 14px}
.ug .btn.white{--bg:#fff;--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.ug .btn.red{--bg:var(--red);--fg:#fff;--bg-h:var(--red-h)}
.ug .btn.grey{--bg:var(--grey-ll);--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.ug .btn.sand{--bg:var(--sand);--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff}
.ug .btn.line{--bg:transparent;--fg:var(--ink);--bg-h:var(--ink);--fg-h:#fff;box-shadow:inset 0 0 0 1px var(--grey-d)}
.ug .btn.glass{--bg:rgba(255,255,255,.2);--fg:#fff;--bg-h:#fff;--fg-h:var(--ink);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
.ug .btn:disabled{opacity:.45;cursor:default}
@media (hover:hover) and (pointer:fine){
  .ug .btn:not(:disabled):hover{background:var(--bg-h);color:var(--fg-h)}
  .ug .btn:not(:disabled):hover .lbl > span{transform:translateY(-100%)}
  .ug .btn:not(:disabled):hover svg{transform:translateX(3px)}
}
.ug .ibtn{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.05);color:var(--ink);flex:none;transition:background-color var(--t-fast),color var(--t-fast),opacity var(--t-fast)}
.ug .ibtn.light{background:rgba(255,255,255,.22);color:#fff;-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
.ug .ibtn:disabled{opacity:.35;cursor:default}
@media (hover:hover) and (pointer:fine){.ug .ibtn:not(:disabled):hover{background:var(--ink);color:#fff}.ug .ibtn.light:hover{background:#fff;color:var(--ink)}}
.ug .tlink{display:inline-flex;align-items:center;gap:6px;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;text-decoration-color:var(--grey-d);min-height:32px;transition:text-decoration-color var(--t)}
@media (hover:hover){.ug .tlink:hover{text-decoration-color:currentColor}}

/* ── banner ── */
.ug .banner{position:fixed;inset:0 0 auto 0;height:var(--banner);z-index:70;display:flex;align-items:center;justify-content:center;gap:12px;padding:0 48px;
  background:var(--brown);color:rgba(255,255,255,.9);font-size:var(--t-sm);padding-top:env(safe-area-inset-top);box-sizing:content-box}
.ug[data-banner="0"] .banner{display:none}
.ug .banner a{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;transition:background-color var(--t-fast)}
@media (hover:hover){.ug .banner a:hover{background:rgba(255,255,255,.26)}}
.ug .banner .x{position:absolute;right:8px;top:50%;margin-top:calc(env(safe-area-inset-top) / 2);transform:translateY(-50%);width:40px;height:40px;display:grid;place-items:center;color:rgba(255,255,255,.7)}
@media (max-width:599px){.ug .banner .hide-s{display:none}}

/* ── header: floating glass capsule ── */
.ug .hdr{position:fixed;left:var(--edge);right:var(--edge);top:calc(var(--banner) + var(--edge) + env(safe-area-inset-top));z-index:60;display:flex;justify-content:center;pointer-events:none}
.ug .cap{pointer-events:auto;position:relative;width:100%;max-width:100%;height:var(--hdr);border-radius:var(--r-md);display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;padding:0 6px;
  background:color-mix(in oklab,#fff 68%,transparent);-webkit-backdrop-filter:blur(66px);backdrop-filter:blur(66px);color:var(--ink);box-shadow:0 0 0 1px rgba(42,35,32,.05)}
.ug .cap .nav{display:flex;align-items:center;gap:0}
.ug .cap .nav > .dd > button,.ug .cap .nav > a{display:inline-flex;align-items:center;gap:4px;height:var(--hdr);padding:0 14px;font-size:var(--t-sm)}
.ug .cap .nav svg{opacity:.6;transition:transform .2s var(--out)}
.ug .dd[data-open="1"] > button svg{transform:rotate(180deg)}
.ug .cap .nav [aria-current="true"]{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:1px}
.ug .cap .logo{display:grid;place-items:center;height:var(--hdr);padding:0 16px}
.ug .cap .logo img{height:28px;width:auto}
.ug .cap .acts{display:flex;align-items:center;justify-content:flex-end;gap:4px}
.ug .cap .bag{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:50%}
.ug .cap .bag .n{position:absolute;top:2px;right:0;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--red);color:#fff;font-size:11px;display:grid;place-items:center;line-height:1}
.ug .cap .burger{display:none;width:44px;height:44px;place-items:center;border-radius:50%}
.ug .cap .btn{--bh:38px}
@media (hover:hover){.ug .cap .nav > .dd > button:hover,.ug .cap .nav > a:hover{opacity:.6}}
.ug .dd{position:relative}
.ug .dd .panel{position:absolute;top:calc(100% + 8px);left:0;width:min(560px,calc(100vw - 32px));display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:8px;padding:8px;border-radius:var(--r-md);
  background:#fff;color:var(--ink);box-shadow:0 30px 60px -30px rgba(42,35,32,.3),0 0 0 1px rgba(42,35,32,.05);
  opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .16s ease-out,transform .22s var(--out),visibility 0s .22s}
.ug .dd[data-open="1"] .panel{opacity:1;visibility:visible;transform:none;transition:opacity .18s ease-out,transform .25s var(--out)}
.ug .dd .panel ul{display:grid;align-content:start}
.ug .dd .panel a{display:grid;gap:2px;padding:10px 12px;border-radius:var(--r-sm);transition:background-color var(--t-fast)}
.ug .dd .panel a b{font-weight:500;font-size:var(--t-md)}
.ug .dd .panel a span{font-size:var(--t-sm);color:var(--steel);line-height:1.35}
@media (hover:hover){.ug .dd .panel a:hover{background:var(--grey-ll)}}
.ug .dd .panel figure{position:relative;border-radius:var(--r-sm);overflow:hidden;min-height:200px;background:var(--cream)}
.ug .dd .panel figure img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ug .dd .panel figcaption{position:absolute;left:10px;bottom:10px;right:10px;color:#fff;font-size:var(--t-sm);line-height:1.25;text-shadow:0 1px 8px rgba(0,0,0,.4)}
@media (max-width:1023px){
  .ug .cap{grid-template-columns:auto minmax(0,1fr) auto}
  .ug .cap .nav{display:none}
  .ug .cap .logo{justify-content:start;padding-left:10px}
  .ug .cap .burger{display:grid}
  .ug .cap .acts{grid-column:3}
}
@media (max-width:599px){.ug .cap .acts .btn{display:none}.ug .cap .logo img{height:22px}}

/* ── menu sheet ── */
.ug-menu-panel{position:fixed;left:var(--edge);right:var(--edge);top:calc(var(--banner) + var(--edge) + env(safe-area-inset-top));bottom:var(--edge);z-index:120;border-radius:var(--r-md);background:#fff;color:var(--ink);
  display:flex;flex-direction:column;padding:0 var(--sp-xs) var(--sp-xs);overflow-y:auto;overscroll-behavior:contain;box-shadow:0 30px 80px -30px rgba(0,0,0,.4)}
.ug-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;height:var(--hdr);margin:0 calc(var(--sp-xs) * -1 + 6px) 0 -6px}
.ug-menu-panel .mtop img{height:22px;width:auto;margin-left:10px}
.ug-menu-panel .mx{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:var(--grey-ll)}
.ug-menu-panel .mgroups{display:grid;gap:28px;margin-top:24px}
.ug-menu-panel .mg p{font-size:var(--t-sm);color:var(--steel);margin-bottom:6px}
.ug-menu-panel .mg a{display:block;font-family:var(--f-d);font-weight:500;font-size:var(--h-md);letter-spacing:-.02em;line-height:1.15;padding:2px 0}
.ug-menu-panel .mg a[aria-current="page"]{color:var(--red)}
.ug-menu-panel .mfoot{margin-top:auto;display:grid;gap:8px;padding-top:32px;font-size:var(--t-md);color:var(--steel)}
.ug-menu-panel .mfoot a,.ug-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.ug-menu-panel .mfoot a.big{font-size:var(--h-sm);letter-spacing:-.02em;color:var(--ink)}

/* ── media ── */
.ug .ph{position:relative;overflow:hidden;background:var(--cream)}
.ug .ph > img,.ug .ph > picture img{width:100%;height:100%;object-fit:cover}
.ug [data-rv-img]{overflow:hidden}
.ug .zoom img{transition:transform var(--t-slower) var(--out)}
@media (hover:hover) and (pointer:fine){.ug a:hover > .zoom img,.ug a:hover .zoom img,.ug .zoom:hover img{transform:scale(1.03)}}

/* ── 1 · hero: framed, full height, LIGHT (their photo is white); the finder sentence sits in it ── */
.ug .hero{position:relative;height:100svh;min-height:600px;padding:calc(var(--banner) + var(--edge) + env(safe-area-inset-top)) var(--edge) var(--edge);color:var(--ink)}
.ug .hero .mask{position:relative;height:100%;border-radius:var(--r-md);overflow:hidden;background:#F2EEE7;clip-path:inset(0 round var(--r-md))}
.ug .hero .mask > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:72% 62%}
.ug .hero .mask::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,.1) 30%,rgba(255,255,255,0) 50%,rgba(255,255,255,.35) 100%)}
.ug .hero .inner{position:absolute;inset:0;z-index:1;display:grid;grid-template-rows:auto 1fr auto;padding:0 calc(var(--edge) + 20px)}
.ug .hero .copy{grid-row:1;display:grid;justify-items:start;text-align:left;gap:18px;max-width:760px;padding-top:calc(var(--hdr) + clamp(36px,7svh,90px))}
.ug .hero h1{font-size:var(--h-2xl);max-width:14ch}
.ug .hero .sub{font-size:var(--t-lg);line-height:1.4;max-width:42ch;color:var(--brown)}
.ug .hero .bot{grid-row:3;align-self:end;position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:20px 0}
.ug .hero .rule{position:absolute;left:0;right:0;top:0;height:1px;background:currentColor;opacity:.3;transform-origin:left}
.ug .hero .bot p{font-size:var(--t-sm);color:var(--brown)}
/* the sentence finder: "Ég þarf kassa sem er L × B × H mm" */
.ug .finder{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;padding:8px 8px 8px 18px;border-radius:var(--r-lg);background:color-mix(in oklab,#fff 78%,transparent);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);box-shadow:0 0 0 1px rgba(42,35,32,.06),0 30px 60px -36px rgba(42,35,32,.35)}
.ug .finder > span{font-size:var(--t-md);color:var(--brown);white-space:nowrap}
.ug .finder .dims{display:inline-flex;align-items:center;gap:4px}
.ug .finder .dims i{font-style:normal;color:var(--steel);padding:0 2px}
.ug .finder input{width:5.2ch;min-width:0;height:44px;padding:0 6px;border:0;border-radius:var(--r-sm);background:#fff;font:500 var(--t-lg)/1 var(--f-d);color:var(--ink);text-align:center;font-variant-numeric:tabular-nums;box-shadow:inset 0 0 0 1px var(--line);-webkit-appearance:none;appearance:none;-moz-appearance:textfield}
.ug .finder input::-webkit-outer-spin-button,.ug .finder input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.ug .finder input:focus{outline:none;box-shadow:inset 0 0 0 2px var(--ink)}
.ug .finder .u{font-size:var(--t-sm);color:var(--steel)}
.ug .finder .btn{margin-left:auto}
@media (max-width:699px){
  .ug .hero{height:auto;min-height:92svh}
  .ug .hero .mask{height:auto;min-height:calc(92svh - 16px)}
  .ug .hero .inner{position:relative;inset:auto;min-height:calc(92svh - 16px)}
  .ug .hero .mask > img{object-position:50% 55%}
  .ug .hero .inner{padding:0 14px}
  .ug .hero h1{font-size:clamp(2.3rem,10vw,3.2rem)}
  .ug .hero .copy{gap:14px;padding-top:calc(var(--hdr) + 36px)}
  .ug .hero .bot p:last-child{display:none}
  .ug .finder{padding:10px;border-radius:var(--r-md);gap:8px}
  .ug .finder > span{width:100%}
  .ug .finder input{width:4.6ch;height:42px}
  .ug .finder .btn{width:100%;margin-left:0;margin-top:4px}
}


/* ── 1 · the instrument hero: copy + finder left, the live drawing and the fits right (light, airy) ── */
.ug .hero2{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:var(--gutter);align-items:stretch;padding:calc(var(--banner) + var(--edge) + var(--hdr) + var(--sp-md) + env(safe-area-inset-top)) var(--margin) var(--sp-xs);min-height:calc(100svh - 8px)}
.ug .h2-copy{display:grid;align-content:center;gap:22px;padding:clamp(8px,2vw,32px) clamp(0px,3vw,48px) var(--sp-lg) 0}
.ug .h2-copy h1{font-size:var(--h-2xl);max-width:12ch}
.ug .h2-copy .sub{font-size:var(--t-lg);line-height:1.45;max-width:44ch;color:var(--steel)}
.ug .h2-copy .finder{background:#fff;box-shadow:0 0 0 1px var(--line),0 30px 60px -40px rgba(42,35,32,.3);-webkit-backdrop-filter:none;backdrop-filter:none}
.ug .h2-meta{font-size:var(--t-sm);color:var(--steel)}
.ug .h2-draw{position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;min-height:520px}
.ug .h2-box{position:relative;border-radius:var(--r-lg);background:var(--cream);padding:clamp(16px,2.4vw,32px);display:grid;place-items:center;overflow:hidden}
.ug .h2-box svg{width:100%;height:auto;max-height:min(58svh,560px)}
.ug .h2-num{position:absolute;left:clamp(16px,2.4vw,32px);top:clamp(14px,2vw,26px);font-family:var(--f-d);font-weight:600;font-size:var(--h-xs);letter-spacing:-.02em}
.ug .h2-num small{font:400 var(--t-sm)/1 var(--f-s);color:var(--steel);margin-left:8px}
.ug .h2-fits{display:grid;gap:4px;min-height:64px}
.ug .h2-fits > p{padding:14px 18px;border-radius:var(--r-md);background:var(--sand)}
.ug .h2-fit{display:grid;grid-template-columns:56px minmax(0,1fr) auto;gap:14px;align-items:center;padding:8px 14px 8px 8px;border-radius:var(--r-md);background:#fff;box-shadow:inset 0 0 0 1px var(--line);transition:background-color var(--t-fast)}
.ug .h2-fit img{width:56px;height:56px;object-fit:contain;padding:3px;border-radius:8px;background:var(--plate)}
.ug .h2-fit b{display:block;font-weight:500;font-size:var(--t-md);line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ug .h2-fit small{font-size:var(--t-xs);color:var(--steel)}
.ug .h2-fit .pr{font-size:var(--t-md);white-space:nowrap}
.ug .h2-fit .pr small{font-size:var(--t-xs);color:var(--steel)}
@media (hover:hover){.ug .h2-fit:hover{background:var(--grey-ll)}}
@media (max-width:899px){
  .ug .hero2{grid-template-columns:minmax(0,1fr);min-height:0;padding-top:calc(var(--banner) + var(--edge) + var(--hdr) + var(--sp-md) + env(safe-area-inset-top))}
  .ug .h2-copy{padding:0 0 var(--sp-sm)}
  .ug .h2-copy h1{font-size:clamp(2.6rem,11vw,3.6rem)}
  .ug .h2-draw{min-height:0}
  .ug .h2-box{padding:16px;grid-template-rows:auto auto;gap:12px}
  .ug .h2-num{position:static;grid-row:1;justify-self:start;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px}
  .ug .h2-num small{margin-left:0}
  .ug .h2-box svg{grid-row:2;max-height:none}
}

/* ── the factory band: photo + dense facts ── */
.ug .factory{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--sp-md) clamp(24px,4vw,64px);align-items:center}
.ug .f-ph{aspect-ratio:4 / 5;border-radius:var(--r-md)}
.ug .f-txt{display:grid;gap:20px}
.ug .f-lead{font-size:var(--t-lg);line-height:1.45;max-width:56ch}
.ug .f-rows{display:grid;border-top:1px solid var(--line)}
.ug .f-rows > div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:16px;padding:14px 0;border-bottom:1px solid var(--line);font-size:var(--t-md)}
.ug .f-rows dt{color:var(--steel)}
.ug .f-rows dd{display:flex;flex-wrap:wrap;gap:8px 18px}
.ug .f-flute{display:inline-flex;align-items:center;gap:8px;font-size:var(--t-md)}
.ug .f-flute i{display:inline-block;width:34px;height:var(--th);border-radius:2px;background:repeating-linear-gradient(90deg,var(--kraft-d) 0 2px,var(--kraft) 2px 5px)}
.ug .f-flute small{color:var(--steel);font-size:var(--t-xs)}
.ug .f-acts{display:flex;gap:8px;flex-wrap:wrap}
@media (max-width:899px){.ug .factory{grid-template-columns:minmax(0,1fr)}.ug .f-ph{aspect-ratio:4 / 3}.ug .f-rows > div{grid-template-columns:minmax(0,1fr);gap:4px}}

/* ── trust strip ── */
.ug .trust{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.ug .trust li{display:grid;gap:6px;align-content:start;padding:20px;border-radius:var(--r-card);background:var(--sand);min-height:170px}
.ug .trust li img{width:56px;height:auto;margin-bottom:6px;border-radius:50%}
.ug .trust b{font-family:var(--f-d);font-weight:500;font-size:var(--t-lg);letter-spacing:-.01em;line-height:1.2}
.ug .trust span{font-size:var(--t-sm);color:var(--steel);line-height:1.45}
@media (max-width:999px){.ug .trust{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.ug .trust{grid-template-columns:minmax(0,1fr)}.ug .trust li{min-height:0}}

/* ── 2 · intro ── */
.ug .intro-c{display:grid;justify-items:center;text-align:center;gap:var(--sp-md);padding:var(--sp-2xl) var(--margin) 0}
.ug .intro-c .q{max-width:48ch;font-size:var(--t-md);color:var(--steel);line-height:1.5}
.ug .intro-c h2{max-width:18ch}
.ug .sec{padding-top:var(--sp-2xl)}
.ug .shead{display:flex;justify-content:space-between;align-items:flex-end;gap:16px 40px;flex-wrap:wrap;margin-bottom:var(--sp-md)}
.ug .shead .t{display:grid;gap:12px;max-width:820px}
.ug .shead .t p{color:var(--steel);max-width:52ch}
.ug .shead .tools{display:flex;align-items:center;gap:8px}
.ug .center-head{display:grid;justify-items:center;text-align:center;gap:20px;margin-bottom:var(--sp-lg)}

/* ── rail ── */
.ug .rail{display:grid;grid-auto-flow:column;grid-auto-columns:var(--cw,calc((100% - 2 * var(--gutter)) / 3.15));gap:var(--gutter);overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-padding-inline:var(--margin);padding-inline:var(--margin);margin-inline:calc(var(--margin) * -1);scrollbar-width:none;overscroll-behavior-x:contain}
.ug .rail::-webkit-scrollbar{display:none}
.ug .rail > *{scroll-snap-align:start;min-width:0}
.ug .rail-ft{display:flex;align-items:center;gap:8px;margin-top:16px}
.ug .rail-ft .dots{display:flex;gap:6px;margin-left:8px}
.ug .rail-ft .dots i{width:6px;height:6px;border-radius:50%;background:var(--grey-d);transition:background-color var(--t),transform var(--t)}
.ug .rail-ft .dots i.on{background:var(--ink)}
@media (max-width:999px){.ug .rail{grid-auto-columns:calc((100% - var(--gutter)) / 2.2)}}
@media (max-width:599px){.ug .rail{grid-auto-columns:82%}.ug .rail.pr{grid-auto-columns:calc((100% - var(--gutter)) / 2.15)}}

/* the captioned photo card */
.ug .pc{position:relative;display:block;aspect-ratio:var(--ar,592 / 644);border-radius:var(--r-card);overflow:hidden;color:#fff;background:#5c4b3e;isolation:isolate}
.ug .pc .ph{position:absolute;inset:0;background:transparent}
.ug .pc::after{content:'';position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(30,20,14,.28) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 55%,rgba(30,20,14,.6) 100%);pointer-events:none}
.ug .pc .top{position:absolute;left:14px;right:14px;top:12px;z-index:1;display:flex;justify-content:space-between;gap:8px;font-size:var(--t-sm)}
.ug .pc .bt{position:absolute;left:14px;right:14px;bottom:14px;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.ug .pc .bt h3{font-family:var(--f-d);font-size:var(--h-xs);letter-spacing:-.015em;line-height:1.15;max-width:18ch}
.ug .pc .bt p{font-size:var(--t-sm);opacity:.88;margin-top:4px}
.ug .pc .ibtn{background:rgba(255,255,255,.24);color:#fff}
@media (hover:hover) and (pointer:fine){.ug a.pc:hover .ibtn{background:#fff;color:var(--ink)}}
.ug .pill{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:rgba(0,0,0,.28);font-size:var(--t-xs);color:#fff;white-space:nowrap}
.ug .pill.solid{background:var(--ink);color:#fff}
.ug .pill.red{background:var(--red);color:#fff}
.ug .pill.amber{background:var(--amber);color:var(--ink)}
.ug .pill.light{background:#fff;color:var(--ink)}
.ug .pill.sand{background:var(--sand);color:var(--ink)}

/* the chooser (Pebble TabbedCarousel) */
.ug .itabs{display:inline-flex;gap:2px;padding:3px;border-radius:var(--r-md);background:var(--sand);max-width:100%;overflow-x:auto;scrollbar-width:none}
.ug .itabs::-webkit-scrollbar{display:none}
.ug .itabs button{min-height:44px;padding:0 16px;border-radius:10px;font-size:var(--t-md);white-space:nowrap;transition:background-color var(--t) var(--out)}
.ug .itabs button[aria-selected="true"]{background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.ug .itrack{position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:min(1160px,calc(100vw - 2 * var(--margin)));gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;padding-inline:calc((100vw - min(1160px,calc(100vw - 2 * var(--margin)))) / 2);scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x pan-y}
.ug .itrack::-webkit-scrollbar{display:none}
.ug .itrack > li{scroll-snap-align:center;opacity:.25;transition:opacity var(--t) var(--out)}
.ug .itrack > li[data-on="1"]{opacity:1}
.ug .icard{display:grid;grid-template-columns:minmax(0,448px) minmax(0,1fr);gap:8px;padding:8px;border-radius:var(--r-lg);background:var(--sand);height:min(72svh,576px)}
.ug .ipanel{display:flex;flex-direction:column;gap:12px;padding:clamp(20px,2.6vw,40px);border-radius:var(--r-md);background:var(--cream);align-items:flex-start}
.ug .ipanel h3{font-family:var(--f-d);letter-spacing:-.02em}
.ug .ifit{width:100%;display:grid;border-top:1px solid rgba(42,35,32,.1);margin:auto 0 8px}
.ug .ifit a{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(42,35,32,.1);font-size:var(--t-md)}
.ug .ifit a .num{color:var(--steel);white-space:nowrap}
@media (hover:hover){.ug .ifit a:hover span:first-child{text-decoration:underline;text-underline-offset:4px}}
.ug .iimg{position:relative;border-radius:var(--r-md);overflow:hidden;background:var(--grey-l);display:grid;place-items:center}
.ug .iimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ug .iimg.prod{background:var(--plate)}.ug .iimg.prod img{object-fit:contain;padding:6%}
@media (max-width:899px){
  .ug .itrack{grid-auto-columns:calc(100vw - 2 * var(--margin) - 16px);padding-inline:calc(var(--margin) + 8px)}
  .ug .icard{grid-template-columns:minmax(0,1fr);grid-template-rows:240px auto;height:auto}
  .ug .iimg{order:-1}
  .ug .ifit{margin-top:8px}
  .ug .center-head .itabs{justify-content:flex-start}
}

/* ── four ways in ── */
.ug .ways{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.ug .ways .pc{--ar:3 / 4}
.ug .ways .pc.prod .ph{display:grid;place-items:center;background:var(--plate)}
.ug .ways .pc.prod .ph img{width:78%;height:78%;object-fit:contain}
.ug .ways .pc.prod{color:var(--ink)}
.ug .ways .pc.prod::after{display:none}
.ug .ways .pc.prod .ibtn{background:rgba(0,0,0,.06);color:var(--ink)}
.ug .ways .pc.prod .pill{background:var(--sand);color:var(--ink)}
@media (max-width:999px){.ug .ways{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.ug .ways{grid-template-columns:minmax(0,1fr)}.ug .ways .pc{--ar:4 / 3.4}}

/* ── closer look: the open box on kraft ── */
.ug .look{position:relative;margin-top:var(--sp-2xl);border-radius:var(--r-md);overflow:hidden;min-height:clamp(420px,56vw,820px);display:grid;place-items:center;text-align:center;color:#fff;isolation:isolate}
.ug .look > .ph{position:absolute;inset:0;z-index:-1;background:#8b7a66}
.ug .look::after{content:'';position:absolute;inset:0;z-index:-1;background:rgba(40,28,18,.34)}
.ug .look .c{display:grid;justify-items:center;gap:22px;padding:24px}
.ug .look h2{max-width:16ch}
.ug .stmt{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);padding-top:var(--sp-md)}
.ug .stmt p.big{grid-column:1 / 9;font-family:var(--f-d);font-weight:500;font-size:var(--h-md);letter-spacing:-.02em;line-height:1.12}
.ug .stmt .side{grid-column:10 / 13;align-self:end;display:grid;gap:14px;justify-items:start;color:var(--steel);font-size:var(--t-md)}
@media (max-width:899px){.ug .stmt p.big,.ug .stmt .side{grid-column:1 / -1}.ug .stmt .side{margin-top:16px}}

/* ── the subscription band: brown, with a glass list of rhythms ── */
.ug .band{position:relative;margin-top:var(--sp-2xl);border-radius:var(--r-md);overflow:hidden;color:#fff;isolation:isolate;min-height:clamp(520px,48vw,720px);display:grid;align-items:end;background:var(--brown)}
.ug .band > .ph{position:absolute;inset:0;z-index:-1;background:var(--brown)}
.ug .band > .ph img{opacity:.55;mix-blend-mode:luminosity}
.ug .band::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(59,46,37,.82) 0%,rgba(59,46,37,.4) 55%,rgba(59,46,37,.15) 100%)}
.ug .band .in{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:24px 48px;align-items:end;padding:var(--sp-lg) clamp(18px,4vw,56px)}
.ug .band .copy{display:grid;gap:18px;justify-items:start}
.ug .band .copy p{opacity:.9;max-width:40ch}
.ug .glass{border-radius:var(--r-md);background:color-mix(in oklab,#fff 12%,transparent);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);overflow:hidden}
.ug .glass a,.ug .glass div{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.14);transition:background-color var(--t-fast)}
.ug .glass > :last-child{border-bottom:0}
.ug .glass b{font-weight:500;font-family:var(--f-d);font-size:var(--t-lg);letter-spacing:-.01em;display:block;line-height:1.2}
.ug .glass small{font-size:var(--t-sm);opacity:.8}
@media (hover:hover){.ug .glass a:hover{background:rgba(255,255,255,.1)}}
@media (max-width:899px){.ug .band .in{grid-template-columns:minmax(0,1fr)}.ug .band::after{background:linear-gradient(180deg,rgba(59,46,37,.3) 0%,rgba(59,46,37,.85) 60%)}}

/* ── shop blocks on the home page ── */
.ug .cats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.ug .cat{display:grid;gap:10px}
.ug .cat .ph{aspect-ratio:4 / 5;border-radius:var(--r-card);background:var(--plate);box-shadow:inset 0 0 0 1px rgba(42,35,32,.05)}
.ug .cat .ph img{width:100%;height:100%;object-fit:contain;padding:8%}
.ug .cats.six{grid-template-columns:repeat(6,minmax(0,1fr))}
@media (max-width:1099px){.ug .cats.six{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:599px){.ug .cats.six{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ug .cat b{font-weight:500;font-size:var(--t-md);display:flex;justify-content:space-between;align-items:center;gap:8px}
.ug .cat small{color:var(--steel);font-size:var(--t-sm)}
@media (max-width:899px){.ug .cats{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ug .pgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px var(--gutter)}
@media (max-width:1099px){.ug .pgrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:699px){.ug .pgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px var(--gutter)}}
.ug .pcard{position:relative;display:grid;gap:10px;align-content:start}
.ug .pcard .media{position:relative}
.ug .pcard .ph{aspect-ratio:1;border-radius:var(--r-sm);background:var(--plate);box-shadow:inset 0 0 0 1px rgba(42,35,32,.05)}
.ug .pcard .ph img{width:100%;height:100%;object-fit:contain;padding:6%;transition:transform var(--t-slower) var(--out)}
.ug .pcard .ph .pill{position:absolute;left:10px;top:10px}
.ug .pcard .add{position:absolute;right:10px;bottom:10px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--ink);box-shadow:0 4px 14px -6px rgba(0,0,0,.25);transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.ug .pcard .add[aria-pressed="true"]{background:var(--red);color:#fff}
.ug .pcard .add:active{transform:scale(.92)}
.ug .pcard .br{font-size:var(--t-xs);color:var(--steel);letter-spacing:.02em}
.ug .pcard .nm{font-size:var(--t-md);line-height:1.3;font-weight:500}
.ug .pcard .pr{font-size:var(--t-md)}
.ug .pcard .pr small{color:var(--steel);font-size:var(--t-sm)}
.ug .pcard .bd{display:grid;gap:4px}
.ug .sku{font-size:var(--t-xs);color:var(--steel);font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){.ug .pcard:hover .ph img{transform:scale(1.05)}.ug .pcard .add:not([aria-pressed="true"]):hover{background:var(--ink);color:#fff}}
.ug .editorial{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);margin:var(--sp-lg) 0;align-items:stretch}
.ug .editorial .ph{grid-column:1 / 8;border-radius:var(--r-card);min-height:420px}
.ug .editorial .tl2{grid-column:8 / 13;display:flex;flex-direction:column;border-radius:var(--r-card);background:var(--sand);padding:clamp(18px,2vw,28px)}
.ug .tl2 h3{font-family:var(--f-d);font-size:var(--h-sm);letter-spacing:-.02em;line-height:1.1}
.ug .tl2 > p{color:var(--steel);margin-top:10px;font-size:var(--t-md)}
.ug .tl2 ul{margin:18px 0;display:grid;border-top:1px solid rgba(42,35,32,.1)}
.ug .tl2 li{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(42,35,32,.1);font-size:var(--t-sm)}
.ug .tl2 li img{width:48px;height:48px;object-fit:contain;padding:2px;background:var(--plate);border-radius:6px}
.ug .tl2 .tot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px;gap:12px;flex-wrap:wrap}
.ug .tl2 .tot b{font-weight:500;font-size:var(--t-lg)}
@media (max-width:899px){.ug .editorial .ph,.ug .editorial .tl2{grid-column:1 / -1}.ug .editorial .ph{min-height:0;aspect-ratio:4 / 3}}

/* ── people ── */
.ug .ppl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gutter)}
.ug .ppl li{display:grid;gap:2px;align-content:start;padding:18px;border-radius:var(--r-card);background:var(--cream);min-height:140px}
.ug .ppl b{font-weight:500;font-family:var(--f-d);font-size:var(--t-lg);letter-spacing:-.01em}
.ug .ppl span{font-size:var(--t-sm);color:var(--steel)}
.ug .ppl small{margin-top:auto;padding-top:18px;font-size:var(--t-sm)}
@media (max-width:899px){.ug .ppl{grid-template-columns:minmax(0,1fr)}.ug .ppl li{min-height:0}}

/* ── questions ── */
.ug .faq{margin-top:var(--sp-2xl);border-radius:var(--r-md);background:var(--sand);padding:var(--sp-xl) var(--margin)}
.ug .faq .center-head{margin-bottom:var(--sp-md)}
.ug .acc-list{display:grid;gap:6px;max-width:880px;margin:0 auto}
.ug .acc{border-radius:var(--r-sm);background:#fff}
.ug .acc-b{width:100%;display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;gap:16px;min-height:60px;padding:10px 12px 10px 18px;text-align:left;font-size:var(--t-md);font-weight:500}
.ug .acc-b .pm{position:relative;width:32px;height:32px;border-radius:50%;background:var(--grey-ll)}
.ug .acc-b .pm::before,.ug .acc-b .pm::after{content:'';position:absolute;left:50%;top:50%;width:11px;height:1.5px;margin:-.75px 0 0 -5.5px;background:var(--ink);transition:transform var(--t) var(--out)}
.ug .acc-b .pm::after{transform:rotate(90deg)}
.ug .acc.is-open .acc-b .pm::after{transform:rotate(0)}
.ug .acc-p{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--t) var(--out)}
.ug .acc.is-open .acc-p{grid-template-rows:1fr}
.ug .acc-p > div{overflow:hidden}
.ug .acc-p p{padding:0 60px 18px 18px;color:var(--steel);font-size:var(--t-md);max-width:70ch}
.ug .faq .more{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:var(--sp-sm)}
@media (max-width:599px){.ug .acc-p p{padding-right:18px}}

/* ── two tiles ── */
.ug .tiles{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--gutter);margin-top:var(--sp-2xl)}
.ug .tile{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:200px;padding:16px 16px 16px 20px;border-radius:var(--r-card);color:#fff;background:var(--brown);transition:background-color var(--t)}
.ug .tile.red{background:var(--red)}
.ug .tile small{font-size:var(--t-sm);opacity:.8}
.ug .tile .tb{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.ug .tile b{font-weight:500;font-family:var(--f-d);font-size:var(--h-xs);letter-spacing:-.015em;line-height:1.15}
@media (hover:hover){.ug .tile:hover{background:var(--brown-d)}.ug .tile.red:hover{background:var(--red-h)}.ug .tile:hover .ibtn{background:#fff;color:var(--ink)}}
@media (max-width:599px){.ug .tiles{grid-template-columns:minmax(0,1fr)}.ug .tile{min-height:150px}}

/* ── inner pages ── */
.ug .page{padding:calc(var(--banner) + var(--edge) + var(--hdr) + var(--sp-lg) + env(safe-area-inset-top)) 0 0}
.ug .ptitle{display:grid;gap:16px;margin-bottom:var(--sp-lg);max-width:980px}
.ug .ptitle .crumb{display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm);color:var(--steel);min-height:32px;width:max-content}
@media (hover:hover){.ug .ptitle .crumb:hover{color:var(--ink)}}
.ug .ptitle h1{font-size:var(--h-2xl)}
.ug .note{font-size:var(--t-sm);color:var(--steel);margin-top:var(--sp-sm);max-width:90ch}
.ug .doc{max-width:760px;display:grid;gap:22px}
.ug .doc p{font-size:var(--t-lg);line-height:1.45}
.ug .doc h2{font-size:var(--h-md);margin-top:12px}
.ug .doc .small{color:var(--steel)}

/* ── KASSAMÁL: the instrument (inputs left, the drawn box right, fits below) ── */
.ug .km{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--gutter);align-items:stretch}
.ug .km-in{display:grid;gap:22px;align-content:start;padding:clamp(18px,2.4vw,32px);border-radius:var(--r-md);background:var(--sand)}
.ug .km-in h2{font-size:var(--h-sm)}
.ug .dimrow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ug .dimrow label{display:grid;gap:6px}
.ug .dimrow label > span{font-size:var(--t-sm);color:var(--steel)}
.ug .dimrow .f{position:relative;display:flex;align-items:center;background:#fff;border-radius:var(--r-sm);box-shadow:inset 0 0 0 1px var(--line)}
.ug .dimrow .f:focus-within{box-shadow:inset 0 0 0 2px var(--ink)}
.ug .dimrow input{width:100%;min-width:0;height:56px;padding:0 44px 0 14px;border:0;background:transparent;font:600 var(--h-xs)/1 var(--f-d);color:var(--ink);font-variant-numeric:tabular-nums;-webkit-appearance:none;appearance:none;-moz-appearance:textfield;outline:none}
.ug .dimrow input::-webkit-outer-spin-button,.ug .dimrow input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.ug .dimrow .f i{position:absolute;right:12px;font-style:normal;font-size:var(--t-sm);color:var(--steel)}
.ug .km .fg{display:grid;gap:10px}
.ug .km .fg > span{font-size:var(--t-sm);color:var(--steel)}
.ug .km .chip{background:#fff}
.ug .km .chip[aria-pressed="true"]{background:var(--ink);color:#fff}
.ug .km .chip small{opacity:.7;font-size:var(--t-xs)}
.ug .km-sum{display:grid;gap:8px;padding-top:14px;border-top:1px solid rgba(42,35,32,.12);font-size:var(--t-sm);color:var(--steel)}
.ug .km-sum b{color:var(--ink);font-weight:500}
.ug .km-sum .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
.ug .km-draw{position:relative;border-radius:var(--r-md);background:var(--cream);min-height:420px;display:grid;grid-template-rows:auto 1fr auto;padding:clamp(16px,2vw,28px);overflow:hidden}
.ug .km-draw .ttl{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
.ug .km-draw .ttl b{font-family:var(--f-d);font-weight:500;font-size:var(--h-xs);letter-spacing:-.015em;line-height:1.15}
.ug .km-draw .ttl .num{font-family:var(--f-d);font-weight:600;font-size:var(--h-sm);letter-spacing:-.02em;white-space:nowrap}
.ug .km-draw .ttl .num small{font:400 var(--t-sm)/1 var(--f-s);color:var(--steel);margin-left:6px}
.ug .km-draw svg{width:100%;height:auto;max-height:520px;align-self:center;display:block;overflow:visible}
.ug .km-draw .dim line,.ug .km-draw .dim path{stroke:var(--ink);stroke-width:1;fill:none;vector-effect:non-scaling-stroke}
.ug .km-draw .dim text{font-family:var(--f-s);font-weight:500;fill:var(--ink);font-variant-numeric:tabular-nums}
.ug .km-draw .vol{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:var(--t-sm);color:var(--steel)}
.ug .km-fits{margin-top:var(--sp-lg)}
.ug .fitlist{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gutter)}
.ug .fit{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:start;padding:12px;border-radius:var(--r-card);background:#fff;box-shadow:inset 0 0 0 1px var(--line);position:relative}
.ug .fit[data-best="1"]{box-shadow:inset 0 0 0 2px var(--amber)}
.ug .fit .ph{width:96px;height:96px;border-radius:var(--r-sm);background:var(--grey-l);display:grid;place-items:center}
.ug .fit .ph{background:var(--plate)}.ug .fit .ph img{width:100%;height:100%;object-fit:contain;padding:6%}
.ug .fit .bd{display:grid;gap:4px;min-width:0}
.ug .fit .bd b{font-weight:500;font-size:var(--t-md);line-height:1.3}
.ug .fit .bd .sl{font-size:var(--t-xs);color:var(--steel)}
.ug .fit .bd .pr{font-size:var(--t-md);margin-top:2px}
.ug .fit .bd .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.ug .fit .best{justify-self:start;margin-bottom:2px}
@media (max-width:1099px){.ug .fitlist{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:899px){.ug .km{grid-template-columns:minmax(0,1fr)}.ug .km-draw{min-height:360px}}
@media (max-width:599px){
  .ug .fitlist{grid-template-columns:minmax(0,1fr)}
  .ug .dimrow{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
  .ug .dimrow input{padding:0 26px 0 8px;height:52px;font-size:18px}
  .ug .dimrow .f i{right:8px}
}

/* kassagerð page: the styles grid, flute rows */
.ug .styles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gutter)}
.ug .style{display:grid;gap:10px;padding:16px;border-radius:var(--r-card);background:var(--cream);min-height:200px;align-content:start}
.ug .style svg{width:100%;height:auto;max-height:120px}
.ug .style b{font-family:var(--f-d);font-weight:500;font-size:var(--t-lg)}
.ug .style p{font-size:var(--t-sm);color:var(--steel)}
@media (max-width:899px){.ug .styles{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ug .flutes{display:grid;border-top:1px solid var(--line)}
.ug .flutes li{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}
.ug .flutes .bar{height:var(--th);background:repeating-linear-gradient(90deg,var(--kraft-d) 0 2px,var(--kraft) 2px 6px);border-radius:2px;width:120px}
.ug .flutes b{font-weight:500}
.ug .flutes span{font-size:var(--t-sm);color:var(--steel)}
@media (max-width:599px){.ug .flutes li{grid-template-columns:minmax(0,1fr);gap:6px}}
.ug .two-col{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gutter);align-items:start}
.ug .two-col .txt{grid-column:1 / 7;display:grid;gap:14px}
.ug .two-col .txt p{color:var(--steel);max-width:58ch}
.ug .two-col .txt p:first-of-type{color:var(--ink);font-size:var(--t-lg);line-height:1.4}
.ug .two-col .img{grid-column:8 / 13;border-radius:var(--r-card);aspect-ratio:4 / 5}
.ug .two-col.flip .txt{grid-column:7 / 13;order:2}
.ug .two-col.flip .img{grid-column:1 / 6;order:1}
@media (max-width:899px){.ug .two-col .txt,.ug .two-col .img,.ug .two-col.flip .txt,.ug .two-col.flip .img{grid-column:1 / -1;order:0}.ug .two-col .img{aspect-ratio:4 / 3}}

/* ── catalogue ── */
.ug .fbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:var(--sp-sm)}
.ug .fbar .count{margin-right:auto;font-size:var(--t-sm);color:var(--steel)}
.ug .fbar select,.ug .form select{height:38px;padding:0 34px 0 14px;border-radius:999px;border:0;background:var(--grey-ll);font:var(--t-sm) var(--f-s);color:var(--ink);-webkit-appearance:none;appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 17px) 52%,calc(100% - 12px) 52%;background-size:5px 5px;background-repeat:no-repeat}
.ug .chips{display:flex;gap:6px;flex-wrap:wrap}
.ug .chip{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 14px;border-radius:999px;background:var(--grey-ll);font-size:var(--t-sm);transition:background-color var(--t-fast),color var(--t-fast),transform .12s}
.ug .chip[aria-pressed="true"]{background:var(--ink);color:#fff}
.ug .chip:active{transform:scale(.97)}
@media (hover:hover){.ug .chip:not([aria-pressed="true"]):hover{background:var(--grey)}}
.ug .empty{padding:var(--sp-md) var(--sp-sm);border-radius:var(--r-md);background:var(--cream);display:grid;gap:12px;justify-items:start}
.ug .empty h3{font-family:var(--f-d);font-size:var(--h-sm);letter-spacing:-.02em}
.ug .shop{display:grid;grid-template-columns:260px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:start}
.ug .frail{position:sticky;top:calc(var(--banner) + var(--edge) + var(--hdr) + 24px);display:grid;gap:28px}
.ug .fg{display:grid;gap:10px;align-content:start}
.ug .fg > span{font-size:var(--t-sm);color:var(--steel)}
.ug .opts-list{display:grid}
.ug .opts-list button{width:100%;display:flex;justify-content:space-between;align-items:center;min-height:40px;padding:0 12px;border-radius:var(--r-sm);font-size:var(--t-md);text-align:left;transition:background-color var(--t-fast)}
.ug .opts-list button small{color:var(--steel);font-size:var(--t-xs)}
.ug .opts-list button[aria-pressed="true"]{background:var(--ink);color:#fff}
.ug .opts-list button[aria-pressed="true"] small{color:rgba(255,255,255,.7)}
@media (hover:hover){.ug .opts-list button:not([aria-pressed="true"]):hover{background:var(--grey-ll)}}
.ug .results .pgrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:48px var(--gutter)}
.ug .only-s{display:none}
@media (max-width:1023px){
  .ug .shop{grid-template-columns:minmax(0,1fr)}
  .ug .frail{display:none}
  .ug .only-s{display:inline-flex}
  .ug .results .pgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px var(--gutter)}
}
.ug .pager{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:var(--sp-lg)}
.ug .pager a,.ug .pager span{display:inline-grid;place-items:center;min-width:40px;height:40px;padding:0 12px;border-radius:999px;font-size:var(--t-sm);background:var(--grey-ll);transition:background-color var(--t-fast),color var(--t-fast)}
.ug .pager [aria-current="page"]{background:var(--ink);color:#fff}
.ug .pager a.arrow{background:transparent;box-shadow:inset 0 0 0 1px var(--grey-d)}
@media (hover:hover){.ug .pager a:not([aria-current="page"]):hover{background:var(--grey)}}
.ug .fdrawer{position:fixed;inset:0;z-index:150}
.ug .fdrawer .scrim{position:absolute;inset:0;background:rgba(0,0,0,.45);width:100%;height:100%}
.ug .fdrawer .sheet-in{position:absolute;left:0;top:0;bottom:0;width:min(345px,calc(100% - 45px));background:#fff;display:flex;flex-direction:column;animation:ug-in-l .4s cubic-bezier(.645,.045,.355,1) both}
@keyframes ug-in-l{from{transform:translateX(-100%)}to{transform:none}}
.ug .fdrawer .dtop{display:flex;justify-content:space-between;align-items:center;padding:calc(14px + env(safe-area-inset-top)) 16px 14px;border-bottom:1px solid var(--line)}
.ug .fdrawer .dtop b{font-weight:500;font-size:var(--t-lg)}
.ug .fdrawer .dbody{flex:1;overflow-y:auto;padding:20px 16px;display:grid;gap:28px;align-content:start;overscroll-behavior:contain}
.ug .fdrawer .dfoot{padding:14px 16px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--line);box-shadow:0 -2px 24px rgba(0,0,0,.06)}
.ug .w100{width:100%}

/* ── product page ── */
.ug .pdp .crumb{display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm);color:var(--steel)}
.ug .pdp-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:start}
.ug .stagep{position:relative;width:100%;aspect-ratio:1;max-height:78svh;border-radius:var(--r-md);background:var(--plate);overflow:hidden;box-shadow:inset 0 0 0 1px rgba(42,35,32,.05)}
.ug .stagep img{width:100%;height:100%;object-fit:contain;padding:5%}
.ug .buy{position:sticky;top:calc(var(--banner) + var(--edge) + var(--hdr) + 24px)}
.ug .buy-in{display:grid;gap:14px}
.ug .buy h1{font-size:var(--h-md)}
.ug .buy .pr{font-family:var(--f-d);font-weight:500;font-size:var(--h-sm);letter-spacing:-.02em;margin-top:2px}
.ug .buy .pr small{font:400 var(--t-sm)/1 var(--f-s);color:var(--steel);margin-left:8px}
.ug .row-buy{display:flex;gap:8px;margin-top:6px}
.ug .row-buy .qty{flex:none}
.ug .row-buy .qty button{width:46px;height:50px}
.ug .grow{flex:1}
.ug .buy .facts{display:grid;gap:8px;font-size:var(--t-sm);color:var(--steel);margin-top:4px}
.ug .buy .facts li{display:flex;gap:8px;align-items:center}
.ug .parts{display:grid;border-top:1px solid var(--ink);margin-top:10px}
.ug .parts div{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;padding:10px 0;border-bottom:1px solid var(--line);font-size:var(--t-sm)}
.ug .parts dt{color:var(--steel)}
.ug .parts dd{text-align:right}
.ug .tiers{display:grid;border-radius:var(--r-sm);overflow:hidden;background:var(--sand);margin-top:6px}
.ug .tiers div{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:14px;padding:9px 14px;font-size:var(--t-sm);border-bottom:1px solid rgba(42,35,32,.08)}
.ug .tiers div:last-child{border-bottom:0}
.ug .tiers div[data-on="1"]{background:var(--ink);color:#fff}
.ug .tiers .lbl{font-size:var(--t-xs);color:var(--steel);padding:8px 14px 2px}
.ug .pacc{display:grid;border-top:1px solid var(--ink);margin-top:14px}
.ug .pacc .acc{border-radius:0;background:transparent;border-bottom:1px solid var(--line)}
.ug .pacc .acc-b{padding-left:0;min-height:60px}
.ug .pacc .acc-p p{padding:0 0 18px;color:var(--steel)}
@media (max-width:899px){.ug .pdp-grid{grid-template-columns:minmax(0,1fr)}.ug .buy{position:static}.ug .stagep{aspect-ratio:1}}

/* the added panel */
.ug .added{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:140;width:min(380px,calc(100% - 32px));padding:14px;border-radius:var(--r-md);background:#fff;box-shadow:0 24px 60px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05);display:grid;gap:12px}
.ug .added .atop{display:flex;justify-content:space-between;align-items:center}
.ug .added .atop b{font-weight:500;font-size:var(--t-md)}
.ug .added .aitem{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center}
.ug .added .aitem img{width:64px;height:64px;object-fit:contain;padding:3px;background:var(--plate);border-radius:var(--r-sm)}
.ug .added .nm{display:block;font-size:var(--t-md);line-height:1.3}
.ug .added small{color:var(--steel);font-size:var(--t-sm)}
.ug .added .aacts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
@media (max-width:899px){.ug .added{left:8px;right:8px;width:auto;bottom:calc(68px + env(safe-area-inset-bottom))}}

/* ── forms ── */
.ug .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--sp-lg);align-items:start}
@media (max-width:899px){.ug .book-grid{grid-template-columns:minmax(0,1fr);gap:var(--sp-md)}}
.ug .aside{display:grid;gap:14px;font-size:var(--t-md);color:var(--steel)}
.ug .aside h3{font-family:var(--f-d);font-size:var(--h-xs);color:var(--ink)}
.ug .aside .ph{border-radius:var(--r-card);aspect-ratio:16 / 10;margin-top:4px}
.ug .form{display:grid;gap:18px;max-width:720px}
.ug .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.ug .form .three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
@media (max-width:599px){.ug .form .two{grid-template-columns:minmax(0,1fr)}}
.ug .form label > span,.ug .form legend{display:block;font-size:var(--t-sm);margin-bottom:8px;color:var(--ink)}
.ug .form .hint{display:block;font-size:var(--t-xs);color:var(--steel);margin-top:6px}
.ug .form input,.ug .form select,.ug .form textarea{width:100%;min-height:50px;padding:12px 16px;border:1px solid transparent;border-radius:var(--r-sm);background:var(--grey-ll);color:var(--ink);
  font:16px var(--f-s);-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,background-color .2s,box-shadow .2s}
.ug .form select{height:50px;border-radius:var(--r-sm);padding-right:40px}
.ug .form textarea{min-height:120px;resize:vertical}
.ug .form input:focus,.ug .form select:focus,.ug .form textarea:focus{background:#fff;border-color:var(--ink);box-shadow:0 0 0 3px rgba(42,35,32,.06)}
.ug .form input[type="file"]{padding:13px 16px}
.ug .form [aria-invalid="true"]{border-color:var(--err);background:#fff}
.ug .form .err{font-size:var(--t-sm);color:var(--err);margin-top:6px}
.ug .form fieldset{border:0;padding:0;margin:0;min-width:0}
.ug .form .opts{display:flex;gap:6px;flex-wrap:wrap}
.ug .form .opt{position:relative}
.ug .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.ug .form .opt > span{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;background:var(--grey-ll);font-size:var(--t-sm);transition:background-color .2s,color .2s}
.ug .form .opt input:checked + span{background:var(--ink);color:#fff}
.ug .form .opt input:focus-visible + span{outline:2px solid var(--red);outline-offset:2px}
.ug .form .check{display:flex;gap:10px;align-items:flex-start;font-size:var(--t-md);min-height:44px;padding-top:10px}
.ug .form .check input{width:22px;min-height:22px;height:22px;padding:0;flex:none;margin-top:1px;-webkit-appearance:checkbox;appearance:auto;accent-color:var(--red)}
.ug .form .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px}
.ug .proto-note{font-size:var(--t-xs);color:var(--steel);margin-top:12px}
.ug .done{padding:var(--sp-sm);border-radius:var(--r-md);background:var(--sand);max-width:720px}
.ug .done h2{font-size:var(--h-md)}
.ug .done dl{margin:20px 0;display:grid}
.ug .done dl div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid rgba(42,35,32,.08);font-size:var(--t-md)}
.ug .done dt{color:var(--steel)}
.ug .done dd{text-align:right}
.ug .done .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.ug .sumbox{display:grid;border-radius:var(--r-md);background:var(--sand);padding:8px 20px}
.ug .sumbox div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(42,35,32,.08);font-size:var(--t-md)}
.ug .sumbox div:last-child{border:0;font-size:var(--t-lg);font-weight:500}
.ug .terms{display:grid;border-top:1px solid var(--line)}
.ug .terms li{padding:12px 0;border-bottom:1px solid var(--line);font-size:var(--t-sm);color:var(--steel)}
.ug .spec{display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;align-items:center;padding:12px;border-radius:var(--r-sm);background:var(--cream)}
.ug .spec b{font-family:var(--f-d);font-weight:600;font-size:var(--t-lg);display:block;line-height:1.2}
.ug .spec span{font-size:var(--t-sm);color:var(--steel)}

/* ── the list ── */
.ug .tl-acts{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:16px}
.ug .tl-side{position:sticky;top:calc(var(--banner) + var(--edge) + var(--hdr) + 24px)}
.ug .tli .lt{font-size:var(--t-sm);white-space:nowrap;min-width:7ch;text-align:right}
.ug .tl-bar{display:none;position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:54;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:var(--r-md);
  background:color-mix(in oklab,#fff 80%,transparent);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);box-shadow:0 10px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
.ug .tl-bar{transition:transform var(--t-med) var(--out),opacity var(--t)}
.ug .tl-bar[data-hide="1"]{transform:translateY(calc(100% + 24px));opacity:0;pointer-events:none}
.ug .tl-bar > span{display:grid;line-height:1.2}
.ug .tl-bar small{font-size:var(--t-xs);color:var(--steel)}
.ug .tl-bar b{font-family:var(--f-d);font-weight:500;font-size:var(--t-lg)}
@media (max-width:899px){.ug .tl-bar{display:grid}.ug .tl-side{position:static}.ug .tl-grid > div:last-child{padding-bottom:72px}}
.ug .tl-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--sp-lg);align-items:start}
.ug .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.ug .tl{display:grid;border-top:1px solid var(--line)}
.ug .tli{display:grid;grid-template-columns:72px minmax(0,1fr) auto auto auto;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.ug .tli img{width:72px;height:72px;object-fit:contain;padding:4px;background:var(--plate);border-radius:var(--r-sm)}
.ug .tli b{font-weight:500;font-size:var(--t-md);line-height:1.3;display:block}
.ug .tli small{color:var(--steel);font-size:var(--t-sm)}
.ug .tli .disc{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:999px;background:var(--amber);color:var(--ink);font-size:var(--t-xs);margin-left:6px}
.ug .qty{display:inline-flex;align-items:center;border-radius:999px;background:var(--grey-ll)}
.ug .qty button{width:40px;height:40px;display:grid;place-items:center;border-radius:50%}
.ug .qty input{width:56px;height:40px;border:0;background:transparent;text-align:center;font:500 16px var(--f-s);color:var(--ink);font-variant-numeric:tabular-nums;-moz-appearance:textfield;outline:none}
.ug .qty input::-webkit-outer-spin-button,.ug .qty input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.ug .qty span{min-width:24px;text-align:center}
.ug .tli .rm{width:40px;height:40px;display:grid;place-items:center;color:var(--steel);border-radius:50%}
@media (hover:hover){.ug .qty button:hover,.ug .tli .rm:hover{background:var(--grey)}}
@media (max-width:899px){.ug .tl-grid{grid-template-columns:minmax(0,1fr)}.ug .tli{grid-template-columns:56px minmax(0,1fr) auto;row-gap:8px}.ug .tli img{width:56px;height:56px;grid-row:1 / 3}.ug .tli .qty{grid-column:2;grid-row:2}.ug .tli .lt{grid-column:3;grid-row:2;align-self:center}.ug .tli .rm{grid-column:3;grid-row:1}}

/* ── staff inbox ── */
.ug .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:12px 18px;border-radius:var(--r-sm);background:var(--brown);color:#fff;margin-bottom:20px;font-size:var(--t-sm)}
.ug .inbox table{width:100%;border-collapse:collapse;font-size:var(--t-sm)}
.ug .inbox th{text-align:left;font-weight:500;color:var(--steel);padding:0 12px 10px 0;border-bottom:1px solid var(--ink)}
.ug .inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.ug .inbox td:first-child{white-space:nowrap}
.ug .inbox .kind{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:var(--grey-ll)}
.ug .inbox .st{display:inline-flex;align-items:center;gap:6px}
.ug .inbox .st i{width:8px;height:8px;border-radius:50%;background:var(--ok)}
.ug .inbox .st.new i{background:var(--red)}
.ug .inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.ug .inbox .ia button,.ug .inbox .ia a{height:34px;padding:0 12px;display:inline-flex;align-items:center;border-radius:999px;background:var(--grey-ll)}
.ug .inbox .ia button{background:var(--ink);color:#fff}
.ug .inbox small{color:var(--steel)}
@media (max-width:899px){.ug .inbox table,.ug .inbox tbody,.ug .inbox tr,.ug .inbox td{display:block}.ug .inbox thead{display:none}.ug .inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}.ug .inbox td{padding:3px 0;border:0}}

/* ── footer: the inside of the box (brown), the white wordmark, the 0201 drawn in one line ── */
.ug-foot{position:relative;margin:var(--sp-2xl) var(--edge) var(--edge);border-radius:var(--r-md);background:var(--brown);color:#fff;padding:var(--sp-xl) 0 calc(var(--sp-sm) + env(safe-area-inset-bottom));overflow:hidden;isolation:isolate}
.ug-foot .ftop{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px var(--gutter);position:relative;z-index:1}
.ug-foot .fbrand{grid-column:1 / 5;display:grid;gap:10px;align-content:start}
.ug-foot .fbrand img{width:clamp(180px,16vw,240px);height:auto;margin-bottom:6px}
.ug-foot .fbrand b{font-weight:500;font-family:var(--f-d);font-size:var(--t-lg);letter-spacing:-.01em}
.ug-foot .fbrand p{font-size:var(--t-sm);color:rgba(255,255,255,.72);max-width:38ch}
.ug-foot .fdim{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:16px;margin-top:var(--sp-xl);font-size:var(--t-xs);letter-spacing:.06em;color:var(--amber);text-transform:uppercase}
.ug-foot .fdim i{position:relative;height:1px;background:rgba(255,255,255,.28)}
.ug-foot .fdim i::before,.ug-foot .fdim i::after{content:'';position:absolute;top:-4px;width:1px;height:9px;background:rgba(255,255,255,.45)}
.ug-foot .fdim i::before{left:0}
.ug-foot .fdim i::after{right:0}
.ug-foot .fnav{grid-column:7 / 13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.ug-foot .fnav h3{font-size:var(--t-sm);color:rgba(255,255,255,.6);margin-bottom:6px;font-weight:500}
.ug-foot .fnav a,.ug-foot .fnav p{display:block;font-size:var(--t-sm);line-height:1.4;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.14);overflow-wrap:anywhere}
@media (hover:hover){.ug-foot .fnav a:hover{color:var(--amber)}}
.ug-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:var(--sp-sm);font-size:var(--t-xs);color:rgba(255,255,255,.6);position:relative;z-index:1}
.ug-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.ug-foot .proto{font-size:var(--t-xs);line-height:1.6;color:rgba(255,255,255,.6);margin-top:14px;max-width:120ch;position:relative;z-index:1}
.ug-foot .fbrand :focus-visible,.ug-foot .fnav :focus-visible,.ug-foot .flegal :focus-visible{outline-color:#fff}
@media (max-width:899px){.ug-foot .fbrand,.ug-foot .fnav{grid-column:1 / -1}.ug-foot .fnav{grid-template-columns:repeat(2,minmax(0,1fr))}.ug-foot{padding-bottom:calc(96px + env(safe-area-inset-bottom))}.ug-foot .fdim span{text-align:center;line-height:1.5}}

/* ── loader: cream curtain, the mark folds in, lifts away ── */
.ug-loader{position:fixed;inset:0;z-index:400;background:var(--cream);display:grid;place-items:center;will-change:clip-path}
.ug-loader__in{display:grid;justify-items:center;gap:14px}
.ug-loader__in svg{overflow:visible}
.ug-loader__in img{width:200px;height:auto}

/* ── page transition on forward navigation only (never on Back) ── */
.ug main.ug-in{animation:ug-page-in .38s var(--out) backwards}
@keyframes ug-page-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* ── mobile quick bar ── */
.ug-sticky{position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:54;display:none;grid-template-columns:1fr 1.25fr 1fr;gap:4px;padding:4px;border-radius:var(--r-md);
  background:color-mix(in oklab,#fff 72%,transparent);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);box-shadow:0 10px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05);
  transform:translateY(calc(100% + 24px));transition:transform var(--t-slow) var(--out)}
.ug-sticky a,.ug-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:46px;border-radius:var(--r-sm);font-size:var(--t-sm);color:var(--ink)}
.ug-sticky a:nth-child(2){background:var(--ink);color:#fff}
@media (max-width:899px){.ug-sticky{display:grid}}
.ug[data-sticky="1"] .ug-sticky{transform:none}
.ug.menu-open .ug-sticky{transform:translateY(calc(100% + 24px))}

.ug sndr-chat{--chat-accent:${RED};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#6F655C;--chat-line:#E6E0D6;--chat-sunk:#F8F7F5;--chat-radius:12px;--chat-font:'UgS',system-ui,sans-serif}
@media (max-width:899px){.ug sndr-chat::part(launcher){display:none}}

@media (pointer:coarse){
  .ug .banner .x{width:44px;height:44px}
  .ug .banner a{position:relative}
  .ug .banner a::after{content:'';position:absolute;inset:-10px 0}
  .ug .ibtn,.ug .pcard .add,.ug .tli .rm{width:44px;height:44px}
  .ug .qty button{width:44px;height:44px;flex-shrink:0}
  .ug .qty input{min-width:0}
  .ug .qty input,.ug .finder input{height:44px}
  .ug .chip,.ug .opts-list button,.ug button.tlink,.ug .ptitle .crumb,.ug .pdp > .wrap > .crumb{min-height:44px}
  .ug .btn.sm{--bh:44px}
  .ug .pager a,.ug .pager span{min-width:44px;height:44px}
  .ug .fbar select{font-size:16px;height:44px}
  .ug-foot .fnav a{min-height:44px;display:flex;align-items:center}
  .ug-foot .flegal a{display:inline-flex;align-items:center;min-height:44px}
}

@media (prefers-reduced-motion:reduce){
  .ug *,.ug *::before,.ug *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
}
`
