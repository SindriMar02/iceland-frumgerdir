/*
 * Vélfang — the visual system. Tokens and the reasoning in DESIGN.md.
 * Archivo Narrow in capitals for display, model names and numbers (the
 * VÉLFANG and VERKIN TALA caps), Archivo for reading. Everything square, like
 * the mark. Vélfang red #E7001C (white text 4.8:1) for actions and the
 * statement band, field green #A8CC72 only where the logo's field belongs:
 * the map, the ellipse under a marker, a chosen chip (ink text).
 * Prefix `vf`, so nothing here reaches Vatt or any other route.
 */
const B = import.meta.env.BASE_URL
export const INK = '#15181B'
export const RED = '#E7001C'
export const FIELD = '#A8CC72'
export const GRAPHITE = '#1F2427'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'VfT';src:url('${B}fonts/velfang/archivo-v25-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'VfT';src:url('${B}fonts/velfang/archivo-v25-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'VfT';src:url('${B}fonts/velfang/archivo-v25-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'VfD';src:url('${B}fonts/velfang/archivo-narrow-v35-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'VfD';src:url('${B}fonts/velfang/archivo-narrow-v35-latin_latin-ext-700.woff2') format('woff2');font-weight:700;font-display:swap}

/* the canvas Safari shows above and below the page (status strip, strip under the minimised toolbar) is the contact bar's graphite, not white */
html,body{background-color:${GRAPHITE}}
html.vf-menu,html.vf-menu body{overflow:hidden}

.vf{--ink:${INK};--paper:#FFFFFF;--con:#ECEDEA;--con2:#E2E4E0;--line:#D9DCD7;--mute:#596067;--red:${RED};--red2:#C20018;--field:${FIELD};--gr:${GRAPHITE};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(80px,9vw,140px);--hdr:68px;--bar:34px;
  font-family:'VfT',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
.vf *{box-sizing:border-box}
.vf a{color:inherit;text-decoration:none}
.vf p,.vf h1,.vf h2,.vf h3,.vf h4,.vf figure,.vf ul,.vf ol,.vf dl,.vf dd{margin:0}
.vf ul,.vf ol{padding:0;list-style:none}
.vf img{display:block;max-width:100%}
.vf button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;border-radius:0}
.vf a,.vf button,.vf label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.vf :focus-visible{outline:2px solid var(--red);outline-offset:3px}
.vf .on-dark :focus-visible,.vf-menu-panel :focus-visible,.vf .vf-band :focus-visible,.vf .vf-sticky :focus-visible{outline-color:#fff}
.vf .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vf .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--red);color:#fff;padding:12px 18px;font-weight:600}
.vf .skip:focus{top:16px}
.vf section[id],.vf [data-anchor]{scroll-margin-top:96px}
.vf .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vf .num{font-variant-numeric:tabular-nums}

/* ── type: Archivo Narrow capitals for display ── */
.vf h1,.vf h2,.vf .disp{font-family:'VfD','VfT',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:-.005em;line-height:.94;text-wrap:balance}
.vf h1{font-size:clamp(46px,6vw,96px)}
.vf h2{font-size:clamp(36px,4.4vw,72px)}
.vf h3{font-weight:600;letter-spacing:-.01em;line-height:1.2;text-wrap:balance}
/* masks carry headroom for Á É Í Ó Ú Ý Þ in capitals (masked-reveal-clips-icelandic-accents) */
.vf [data-chars] .ch-mask,.vf .lm{padding:.26em .04em .08em;margin:-.26em -.04em -.08em}
.vf .lm{display:block;overflow:hidden}
.vf .lm > span{display:block}
.vf .kick{font-family:'VfD',sans-serif;font-weight:600;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--red);margin-bottom:16px;display:block}
.vf .lede{font-size:18px;line-height:1.55;color:var(--mute);max-width:46ch}
.vf .muted{color:var(--mute)}

/* ── buttons: square, open from the middle below the fold, rolling label ── */
.vf .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 24px;
  font-family:'VfD',sans-serif;font-size:17px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),transform .12s}
.vf .btn:active,.vf .chip:active,.vf .seg button:active,.vf .form .opt:active > span,.vf .row .cta:active{transform:scale(.97)}
.vf .chip,.vf .seg button,.vf .form .opt > span,.vf .row .cta{transition-property:background-color,box-shadow,color,transform;transition-duration:.16s;transition-timing-function:cubic-bezier(.23,1,.32,1)}
.vf .btn .lbl{display:inline-flex;overflow:hidden;height:1.3em;line-height:1.3em}
.vf .btn .c{display:inline-block;text-shadow:0 1.3em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.vf .btn-red{background:var(--red);color:#fff}
.vf .btn-ink{background:var(--ink);color:#fff}
.vf .btn-white{background:#fff;color:var(--ink)}
.vf .btn-line{box-shadow:inset 0 0 0 2px var(--ink);color:var(--ink)}
.vf .btn-ghost{color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
@media (hover:hover){
  .vf .btn:hover .c{transform:translateY(-1.3em)}
  .vf .btn-red:hover{background:var(--red2)}
  .vf .btn-ink:hover{background:var(--red)}
  .vf .btn-white:hover{background:var(--ink);color:#fff}
  .vf .btn-line:hover{background:var(--ink);color:#fff}
  .vf .btn-ghost:hover{box-shadow:inset 0 0 0 2px #fff}
}
.vf .tlink{display:inline-flex;align-items:center;gap:6px;font-weight:600;border-bottom:2px solid var(--red);padding-bottom:1px;min-height:32px}
@media (hover:hover){.vf .tlink:hover{color:var(--red)}}

/* ── chrome: contact bar + header ── */
.vf-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .35s cubic-bezier(.23,1,.32,1)}
.vf-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:var(--gr);z-index:3}
.vf-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.vf .bar{height:var(--bar);background:var(--gr);color:rgba(255,255,255,.84);font-size:13px}
.vf .bar .in{display:flex;align-items:center;gap:24px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vf .bar a{display:inline-flex;align-items:center;gap:7px;min-height:34px}
@media (hover:hover){.vf .bar a:hover{color:#fff}}
.vf .bar .st{display:inline-flex;align-items:center;gap:8px}
.vf .bar .st i{width:7px;height:7px;background:rgba(255,255,255,.4)}
.vf .bar .st.on i{background:var(--field)}
.vf .bar .br{margin-left:auto;display:flex;gap:18px}
.vf .hdr{height:var(--hdr);background:#fff;border-bottom:1px solid transparent;transition:border-color .3s}
.vf-chrome[data-solid="1"] .hdr{border-color:var(--line)}
.vf .row{display:flex;align-items:center;gap:28px;height:var(--hdr);max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vf .row .logo{display:block;flex:none}
.vf .row .logo img{height:30px;width:auto}
.vf .row .links{display:flex;gap:4px;margin-left:auto;align-items:center}
.vf .dd{position:relative}
.vf .dd > button,.vf .row .nl{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;font-family:'VfD',sans-serif;font-size:17px;font-weight:600;letter-spacing:.03em;text-transform:uppercase}
.vf .dd > button svg{transition:transform .2s cubic-bezier(.23,1,.32,1)}
.vf .dd[data-open="1"] > button svg{transform:rotate(180deg)}
.vf .dd > button[aria-current="true"],.vf .row .nl[aria-current="page"]{color:var(--red)}
@media (hover:hover){.vf .dd > button:hover,.vf .row .nl:hover{color:var(--red)}}
.vf .dd .panel{position:absolute;top:calc(100% + 12px);left:0;min-width:280px;background:#fff;box-shadow:0 0 0 1px var(--line),0 24px 48px -24px rgba(21,24,27,.35);padding:10px;display:grid;
  opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .16s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s .2s}
.vf .dd[data-open="1"] .panel{opacity:1;visibility:visible;transform:none;transition:opacity .18s ease-out,transform .22s cubic-bezier(.23,1,.32,1)}
.vf .dd .panel a{display:grid;gap:2px;padding:10px 12px;min-height:44px}
.vf .dd .panel a b{font-weight:600;font-size:15px}
.vf .dd .panel a span{font-size:13px;color:var(--mute);line-height:1.4}
@media (hover:hover){.vf .dd .panel a:hover{background:var(--con)}}
.vf .row .acts{display:flex;align-items:center;gap:8px}
.vf .row .cta{display:inline-flex;align-items:center;height:44px;padding:0 18px;background:var(--red);color:#fff;font-family:'VfD',sans-serif;font-size:17px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;transition:background-color .3s}
@media (hover:hover){.vf .row .cta:hover{background:var(--ink)}}
.vf .row .burger{display:none;width:48px;height:48px;place-items:center;margin-right:-8px}
@media (max-width:1099px){.vf .dd > button,.vf .row .nl{padding:0 9px;font-size:16px}}
@media (max-width:1023px){
  .vf .row .links{display:none}
  .vf .row .burger{display:grid}
  .vf .row .acts{margin-left:auto}
  .vf .row .logo img{height:26px}
  .vf .bar .br{display:none}
}
@media (max-width:639px){
  .vf .row .cta{display:none}
  .vf .bar .hide-s{display:none}
  .vf .row{gap:12px}
}

/* ── menu ── */
.vf-menu-panel{position:fixed;inset:0;z-index:120;overscroll-behavior:contain;background:var(--gr);color:#fff;display:flex;flex-direction:column;
  padding:calc(10px + env(safe-area-inset-top)) var(--pad) calc(110px + env(safe-area-inset-bottom));overflow-y:auto}
.vf-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.vf-menu-panel .mtop img{height:26px;width:auto}
.vf-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center;margin-right:-8px}
.vf-menu-panel .mgroups{display:grid;gap:26px;margin-top:28px}
.vf-menu-panel .mg p{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:4px}
.vf-menu-panel .mg a{display:block;font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(28px,8vw,44px);line-height:1.08;padding:3px 0}
.vf-menu-panel .mg a[aria-current="page"]{color:var(--field)}
.vf-menu-panel .mfoot{margin-top:auto;display:grid;gap:10px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.8)}
.vf-menu-panel .mfoot a,.vf-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.vf-menu-panel .mfoot a.big{font-family:'VfD',sans-serif;font-weight:700;font-size:30px;color:#fff}

/* ── frames: square; reveal by the peak (clip-path set by the script) ── */
.vf .frame{position:relative;overflow:hidden;background:var(--con2)}
.vf .frame .par{position:absolute;inset:-8% 0}
.vf .frame img{width:100%;height:100%;object-fit:cover}
.vf .frame .still-photo{position:absolute;inset:0}
.vf figcaption,.vf .cap{font-size:13.5px;color:var(--mute);margin-top:10px;line-height:1.45}

/* ── 1 · hero: words across the top, their own yard below, opening through the peak ── */
.vf-hero{padding:calc(var(--bar) + var(--hdr) + clamp(36px,5vw,72px) + env(safe-area-inset-top)) 0 0;background:#fff}
.vf-hero .htop{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:24px 56px;align-items:end;padding-bottom:clamp(28px,3.4vw,52px)}
.vf-hero h1{font-size:clamp(48px,6.9vw,100px)}
.vf-hero h1 em{font-style:normal;color:var(--red)}
.vf-hero .hside{padding-bottom:8px}
.vf-hero .ctas{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
.vf-hero .hfig{position:relative;margin:0}
.vf-hero .hmask{position:relative;height:clamp(340px,64vh,820px);overflow:hidden;background:var(--gr)}
.vf-hero .hmask img{width:100%;height:100%;object-fit:cover;object-position:50% 62%}
.vf-hero .hmask .hp{position:absolute;inset:-6% 0 0}
.vf-hero figcaption{padding-inline:var(--pad);max-width:1440px;margin:12px auto 0}
@media (max-width:899px){
  .vf-hero{padding-top:calc(var(--bar) + var(--hdr) + 28px + env(safe-area-inset-top))}
  .vf-hero .htop{grid-template-columns:minmax(0,1fr);gap:16px}
  .vf-hero h1{font-size:clamp(44px,13.4vw,72px)}
  .vf-hero .lede{font-size:16.5px}
  .vf-hero .ctas{margin-top:18px}
  .vf-hero .ctas .btn{flex:1 1 auto;padding:0 16px}
  .vf-hero .hmask{height:auto;aspect-ratio:4 / 3.4}
}

/* ── 2 · stock rail ── */
.vf-rail{padding:var(--sec) 0 calc(var(--sec) * .8)}
.vf .shead{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:32px}
.vf .shead p{max-width:52ch;color:var(--mute);margin-top:14px}
.vf-rail .track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(300px,calc((100% - 48px) / 3));gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:18px;scrollbar-width:thin}
.vf-rail .track > li{scroll-snap-align:start}
@media (max-width:899px){.vf-rail .track{grid-auto-columns:78%;gap:14px;margin-inline:calc(var(--pad) * -1);padding-inline:var(--pad);scroll-padding-inline:var(--pad)}}
.vf .mc{display:block}
.vf .mc .ph{aspect-ratio:5 / 4;overflow:hidden;background:var(--con2);position:relative}
.vf .mc .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.vf .mc .tag{position:absolute;left:0;top:0;background:#fff;font-family:'VfD',sans-serif;font-weight:700;font-size:14px;letter-spacing:.05em;text-transform:uppercase;padding:6px 10px}
.vf .mc .tag.ny{background:var(--red);color:#fff}
@media (hover:hover){.vf .mc:hover .ph img{transform:scale(1.04)}.vf .mc:hover .nm{color:var(--red)}}
.vf .mc .br{font-family:'VfD',sans-serif;font-weight:600;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:14px}
.vf .mc .nm{font-family:'VfD',sans-serif;font-weight:700;font-size:clamp(24px,2vw,30px);line-height:1;text-transform:uppercase;transition:color .25s}
.vf .mc .mt{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14px;color:var(--mute);margin-top:8px}
.vf .mc .pr{display:flex;align-items:baseline;gap:8px;margin-top:10px;font-family:'VfD',sans-serif;font-weight:700;font-size:22px}
.vf .mc .pr small{font-family:'VfT',sans-serif;font-weight:400;font-size:13px;color:var(--mute)}

/* ── 3 · brand index ── */
.vf-index{padding:var(--sec) 0;background:var(--con)}
.vf .seg{display:flex;flex-wrap:wrap;gap:0;margin:0 0 28px;box-shadow:inset 0 0 0 2px var(--ink);width:max-content;max-width:100%}
.vf .seg button{min-height:46px;padding:0 18px;font-family:'VfD',sans-serif;font-weight:700;font-size:16px;letter-spacing:.03em;text-transform:uppercase;transition:background-color .25s,color .25s}
.vf .seg button[aria-pressed="true"]{background:var(--ink);color:#fff}
.vf .seg button small{font-family:'VfT',sans-serif;font-weight:500;font-size:12px;margin-left:6px;opacity:.7}
@media (hover:hover){.vf .seg button:not([aria-pressed="true"]):hover{color:var(--red)}}
@media (max-width:639px){.vf .seg{width:100%}.vf .seg button{flex:1 1 50%;padding:0 10px;font-size:15px}}
.vf .fline{color:var(--mute);margin:-12px 0 24px;font-size:15px;max-width:60ch;min-height:1.6em}
.vf .ix{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px;border-top:2px solid var(--ink)}
.vf .ix li{border-bottom:1px solid rgba(21,24,27,.16)}
.vf .ix a{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px 16px;min-height:76px;padding:12px 0;position:relative}
.vf .ix .bn{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(28px,2.6vw,42px);line-height:1;transition:color .2s,transform .3s cubic-bezier(.23,1,.32,1)}
.vf .ix .bl{grid-column:1;font-size:14px;color:var(--mute);line-height:1.35}
.vf .ix .bs{grid-column:2;grid-row:1 / 3;display:flex;align-items:center;gap:14px}
.vf .ix .cnt{font-size:13px;font-weight:600;white-space:nowrap}
.vf .ix .cnt b{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;background:var(--red);color:#fff;font-weight:600;margin-right:6px}
.vf .ix .lg{width:96px;height:44px;background:#fff;display:grid;place-items:center;padding:6px;opacity:0;transform:translateX(8px);transition:opacity .35s var(--ease),transform .45s var(--ease)}
.vf .ix .lg img{max-width:100%;max-height:100%;object-fit:contain}
.vf .ix .lg .lgw{font-family:'VfD',sans-serif;font-weight:700;font-size:13px;letter-spacing:.02em;text-transform:uppercase;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (hover:hover){
  .vf .ix a:hover .bn{color:var(--red);transform:translateX(6px)}
  .vf .ix a:hover .lg,.vf .ix a:focus-visible .lg{opacity:1;transform:none}
}
@media (hover:none),(max-width:899px){.vf .ix .lg{opacity:1;transform:none;width:72px;height:36px}}
.vf .ix li[hidden]{display:none}
.vf .more-b{margin-top:20px}
@media (max-width:899px){.vf .ix{grid-template-columns:minmax(0,1fr)}.vf .ix a{min-height:64px;grid-template-columns:minmax(0,1fr) auto}.vf .ix .bn{font-size:26px}.vf .ix .bs{grid-row:1}.vf .ix .bl{grid-column:1 / -1}}
@media (max-width:639px){.vf-net .pin text{font-size:44px;stroke-width:8px}}

/* ── 4 · map chapter: three workshops, one country ── */
.vf-net{padding:var(--sec) 0;background:#fff}
.vf-net .ngrid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:56px;align-items:start}
.vf-net .mapw{position:sticky;top:calc(var(--bar) + var(--hdr) + 24px)}
.vf-net .map{position:relative;background:var(--con);aspect-ratio:1000 / 695}
.vf-net .map svg{display:block;width:100%;height:auto}
.vf-net .map .land{fill:var(--field);stroke:rgba(21,24,27,.25);stroke-width:.6;vector-effect:non-scaling-stroke}
.vf-net .pin .tri{fill:var(--red)}
.vf-net .pin .gnd{fill:rgba(21,24,27,.22)}
.vf-net .pin text{font-family:'VfD',sans-serif;font-weight:700;font-size:24px;text-transform:uppercase;fill:var(--ink);paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}
.vf-net .pin.off .tri{fill:#fff;stroke:var(--ink);stroke-width:2}
.vf-net .mcount{display:flex;align-items:baseline;gap:14px;margin-top:16px;font-size:14px;color:var(--mute)}
.vf-net .mcount b{font-family:'VfD',sans-serif;font-size:44px;line-height:1;color:var(--ink)}
.vf-net .prog{height:3px;background:var(--line);margin-top:10px;overflow:hidden}
.vf-net .prog span{display:block;height:100%;background:var(--red);transform:scaleX(0);transform-origin:left}
.vf-net .cards{display:grid;gap:clamp(48px,12vh,120px);padding:2vh 0 4vh}
.vf-net .bc{display:grid;gap:14px}
.vf-net .bc .yr{font-family:'VfD',sans-serif;font-weight:700;font-size:15px;letter-spacing:.06em;color:var(--red);text-transform:uppercase}
.vf-net .bc h3{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(34px,3.4vw,54px);line-height:.95}
.vf-net .bc dl{display:grid;gap:0;border-top:2px solid var(--ink);margin-top:4px}
.vf-net .bc dl div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--line);font-size:15px}
.vf-net .bc dt{color:var(--mute)}
.vf-net .bc dd{font-weight:600;text-align:right}
.vf-net .bc .frame{aspect-ratio:4 / 3}
@media (max-width:899px){
  .vf-net .ngrid{grid-template-columns:minmax(0,1fr);gap:28px}
  .vf-net .mapw{position:relative;top:0}
  .vf-net .cards{gap:56px;padding:0}
}

/* ── 5 · statement band: Verkin tala ── */
.vf-band{background:var(--red);color:#fff;padding:clamp(72px,9vw,128px) 0;overflow:hidden}
.vf-band .bgrid{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:48px;align-items:center}
.vf-band h2{font-size:clamp(64px,11vw,200px);line-height:.86}
.vf-band p{font-size:18px;max-width:40ch;margin-top:26px;color:rgba(255,255,255,.92)}
.vf-band .ctas{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}
.vf-band .frame{aspect-ratio:4 / 3}
.vf-band figcaption{color:rgba(255,255,255,.86)}
@media (max-width:899px){.vf-band .bgrid{grid-template-columns:minmax(0,1fr);gap:32px}}

/* ── 6 · service split ── */
.vf-serv{padding:var(--sec) 0}
.vf-serv .sgrid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:56px;align-items:start}
.vf-serv .shop{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,4fr);gap:28px;align-items:end}
.vf-serv .shop .frame{aspect-ratio:3 / 4}
.vf-serv .shop h2{font-size:clamp(34px,3.2vw,52px)}
.vf-serv .shop p{color:var(--mute);margin:18px 0 22px}
.vf-serv .shop .st{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin-bottom:18px}
.vf-serv .shop .st i{width:8px;height:8px;background:var(--mute)}
.vf-serv .shop .st.on i{background:#2E8B3A}
.vf .links3{border-top:2px solid var(--ink)}
.vf .links3 a{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}
.vf .links3 b{font-family:'VfD',sans-serif;font-weight:700;font-size:clamp(24px,2vw,32px);text-transform:uppercase;line-height:1}
.vf .links3 span{grid-column:1;font-size:15px;color:var(--mute)}
.vf .links3 svg{grid-column:2;grid-row:1 / 3;transition:transform .4s var(--ease)}
@media (hover:hover){.vf .links3 a:hover b{color:var(--red)}.vf .links3 a:hover svg{transform:translateX(6px)}}
@media (max-width:899px){.vf-serv .sgrid{grid-template-columns:minmax(0,1fr);gap:40px}.vf-serv .shop{grid-template-columns:minmax(0,1fr)}.vf-serv .shop .frame{aspect-ratio:4 / 3}}

/* ── 7 · Kuhn band ── */
.vf-kuhn{background:var(--gr);color:#fff}
.vf-kuhn .kgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:stretch}
.vf-kuhn .kph{position:relative;min-height:420px;overflow:hidden}
.vf-kuhn .kph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vf-kuhn .kc{padding:clamp(56px,6vw,96px) var(--pad) clamp(56px,6vw,96px) clamp(32px,5vw,80px);max-width:720px}
.vf-kuhn .kick{color:var(--field)}
.vf-kuhn h2{font-size:clamp(34px,3.8vw,60px)}
.vf-kuhn .kc > p{color:rgba(255,255,255,.8);margin-top:18px;max-width:48ch}
.vf-kuhn ul{margin:22px 0 0;display:grid;gap:0;border-top:1px solid rgba(255,255,255,.22)}
.vf-kuhn li{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.22);font-size:15px;display:flex;gap:12px}
.vf-kuhn li::before{content:'';width:10px;height:10px;margin-top:7px;flex:none;background:var(--field);clip-path:polygon(50% 0,100% 100%,0 100%)}
.vf-kuhn form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:28px}
.vf-kuhn input{min-height:50px;padding:0 14px;border:0;background:#fff;color:var(--ink);font:16px 'VfT',sans-serif;border-radius:0;-webkit-appearance:none;appearance:none}
.vf-kuhn .err{grid-column:1 / -1;font-size:14px;color:#FFB4B4}
.vf-kuhn .ok{margin-top:24px;padding:16px;background:rgba(255,255,255,.08);font-size:15px}
@media (max-width:899px){.vf-kuhn .kgrid{grid-template-columns:minmax(0,1fr)}.vf-kuhn .kph{min-height:0;aspect-ratio:3 / 2}.vf-kuhn .kc{padding:48px var(--pad) 56px}.vf-kuhn form{grid-template-columns:minmax(0,1fr)}}

/* ── 8 · news ── */
.vf-news{padding:var(--sec) 0}
.vf-news .ngrid2{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:40px}
.vf-news .lead .frame{aspect-ratio:3 / 2}
.vf-news time{display:block;font-family:'VfD',sans-serif;font-weight:600;font-size:15px;letter-spacing:.05em;color:var(--red);margin-top:14px}
.vf-news h3{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(26px,2.4vw,38px);line-height:1;margin-top:6px}
.vf-news .lead p{color:var(--mute);margin-top:10px;max-width:52ch}
.vf-news .side{display:grid;gap:0;border-top:2px solid var(--ink)}
.vf-news .side a{display:grid;grid-template-columns:132px minmax(0,1fr);gap:18px;padding:18px 0;border-bottom:1px solid var(--line);align-items:start}
.vf-news .side .frame{aspect-ratio:1}
.vf-news .side time{margin-top:0}
.vf-news .side h3{font-size:clamp(20px,1.6vw,26px)}
@media (hover:hover){.vf-news a:hover h3{color:var(--red)}}
@media (max-width:899px){.vf-news .ngrid2{grid-template-columns:minmax(0,1fr)}.vf-news .side a{grid-template-columns:96px minmax(0,1fr)}}

/* ── 9 · people strip ── */
.vf-people{padding:0 0 var(--sec)}
.vf-people .pgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:center;padding-top:56px;border-top:2px solid var(--ink)}
.vf-people .faces{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
.vf-people .faces img{width:100%;aspect-ratio:4 / 5;object-fit:cover;background:var(--con2);filter:grayscale(.15)}
@media (max-width:899px){.vf-people .pgrid{grid-template-columns:minmax(0,1fr);gap:28px}.vf-people .faces{grid-template-columns:repeat(4,minmax(0,1fr))}.vf-people .faces img:nth-child(n+9){display:none}}

/* ── route pages ── */
.vf-page{padding:calc(var(--bar) + var(--hdr) + clamp(40px,5vw,72px) + env(safe-area-inset-top)) 0 var(--sec)}
.vf-page .intro{max-width:880px;margin-bottom:44px}
.vf-page .intro h1{font-size:clamp(44px,6vw,96px)}
.vf-page .intro .lede{margin-top:18px}
.vf .crumb{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--mute);margin-bottom:20px;min-height:32px}
@media (hover:hover){.vf .crumb:hover{color:var(--red)}}
@media (max-width:899px){.vf-page{padding-top:calc(var(--bar) + var(--hdr) + 28px + env(safe-area-inset-top))}.vf-page .intro h1{font-size:clamp(40px,12vw,64px)}}

/* catalogue */
.vf .filters{display:grid;gap:14px;margin:0 0 36px;padding:20px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}
.vf .fgroup{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.vf .fgroups{display:grid;gap:14px}
.vf .ftoggle{display:none;align-items:center;gap:10px;min-height:48px;padding:0 16px;box-shadow:inset 0 0 0 2px var(--ink);font-family:'VfD',sans-serif;font-weight:700;font-size:17px;letter-spacing:.03em;text-transform:uppercase;width:100%}
.vf .ftoggle b{display:inline-grid;place-items:center;min-width:24px;height:24px;background:var(--red);color:#fff;font-family:'VfT',sans-serif;font-size:13px}
.vf .ftoggle .chev{margin-left:auto;transition:transform .2s cubic-bezier(.23,1,.32,1)}
.vf .filters[data-open="1"] .ftoggle .chev{transform:rotate(180deg)}
@media (max-width:899px){
  .vf .ftoggle{display:flex}
  .vf .filters:not([data-open="1"]) .fgroups{display:none}
  .vf .filters{border-top:0;padding-top:0}
}
.vf .fgroup > span{font-size:13px;font-weight:600;color:var(--mute);min-width:92px}
.vf .chip{min-height:44px;padding:0 14px;font-size:14.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(21,24,27,.28);transition:background-color .2s,box-shadow .2s,color .2s}
.vf .chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
@media (hover:hover){.vf .chip:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 2px var(--ink)}}
.vf .fbar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.vf .fcount{font-size:15px;font-weight:600;display:flex;gap:16px;align-items:center}
.vf .fcount button{font-weight:600;color:var(--red);text-decoration:underline;text-underline-offset:3px;min-height:36px}
.vf .ftools{display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:14px}
.vf .ftools label{display:inline-flex;align-items:center;gap:8px;min-height:40px}
.vf .ftools select{min-height:40px;padding:0 32px 0 10px;border:1px solid rgba(21,24,27,.3);background:#fff;border-radius:0;font:14.5px 'VfT',sans-serif;-webkit-appearance:none;appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 15px) 50%,calc(100% - 10px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.vf .switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer}
.vf .switch input{appearance:none;-webkit-appearance:none;width:42px;height:24px;background:var(--line);position:relative;cursor:pointer;transition:background-color .25s;margin:0}
.vf .switch input::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;transition:transform .3s var(--ease)}
.vf .switch input:checked{background:var(--red)}
.vf .switch input:checked::after{transform:translateX(18px)}
.vf .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px 24px}
@media (max-width:1099px){.vf .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){.vf .grid{grid-template-columns:minmax(0,1fr);gap:36px}.vf .fgroup > span{min-width:100%}}
.vf .empty{padding:56px 0;border-top:1px solid var(--line)}
.vf .empty h3{font-family:'VfD',sans-serif;text-transform:uppercase;font-size:32px}
.vf .empty p{color:var(--mute);margin:10px 0 20px;max-width:52ch}
.vf .fine{font-size:13px;color:var(--mute);margin-top:28px;max-width:80ch}

/* detail: gallery 7, plate 5 */
.vf-detail .dgrid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:start}
.vf-detail .gmain{aspect-ratio:5 / 4;overflow:hidden;background:var(--con2)}
.vf-detail .gmain img{width:100%;height:100%;object-fit:cover}
.vf-detail .thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}
.vf-detail .thumbs button{aspect-ratio:5 / 4;overflow:hidden;background:var(--con2);opacity:.62;transition:opacity .25s;box-shadow:inset 0 0 0 0 var(--red)}
.vf-detail .thumbs button[aria-pressed="true"]{opacity:1;outline:3px solid var(--red);outline-offset:-3px}
.vf-detail .thumbs img{width:100%;height:100%;object-fit:cover}
.vf-detail .dside{position:sticky;top:calc(var(--bar) + var(--hdr) + 24px)}
.vf-detail .dside h1{font-size:clamp(40px,4.4vw,72px)}
.vf-detail .brn{font-family:'VfD',sans-serif;font-weight:600;font-size:16px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:8px;display:flex;gap:10px;align-items:center}
.vf-detail .brn .tag{background:var(--red);color:#fff;padding:2px 8px}
.vf-detail .brn .tag.u{background:var(--ink)}
.vf-detail .head{font-size:17px;margin-top:14px}
.vf-detail .price{margin-top:22px;padding:18px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}
.vf-detail .price b{display:block;font-family:'VfD',sans-serif;font-weight:700;font-size:clamp(34px,3vw,46px);line-height:1}
.vf-detail .price small{display:block;font-size:14px;color:var(--mute);margin-top:6px}
.vf-detail .dact{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}
.vf-detail .where{margin-top:16px;font-size:14.5px;color:var(--mute)}
.vf .plate{background:var(--gr);color:#fff;padding:24px;margin-top:40px}
.vf .plate h2{font-size:clamp(26px,2.2vw,34px);margin-bottom:14px}
.vf .plate dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px}
.vf .plate dl div{padding:12px 0;border-top:1px solid rgba(255,255,255,.18)}
.vf .plate dt{font-size:13px;color:rgba(255,255,255,.66)}
.vf .plate dd{font-family:'VfD',sans-serif;font-weight:700;font-size:22px;text-transform:uppercase;line-height:1.1;margin-top:2px}
.vf-detail .note{margin-top:28px;font-size:16.5px;max-width:62ch}
.vf-detail .note h2{font-size:clamp(26px,2.2vw,34px);margin-bottom:12px}
.vf-detail .extras{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.vf-detail .extras span{font-size:13.5px;padding:6px 10px;background:var(--con)}
.vf-detail .src{font-size:13px;color:var(--mute);margin-top:18px}
.vf-detail .more{margin-top:var(--sec)}
@media (max-width:899px){.vf-detail .dgrid{grid-template-columns:minmax(0,1fr);gap:24px}.vf-detail .dside{position:static}.vf .plate dl{grid-template-columns:minmax(0,1fr)}}

/* forms */
.vf .form{display:grid;gap:18px;max-width:680px}
.vf .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.vf .form label > span,.vf .form fieldset legend{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:var(--ink)}
.vf .form .hint{display:block;font-size:13px;color:var(--mute);margin-top:6px;font-weight:400}
.vf .form input,.vf .form select,.vf .form textarea{width:100%;min-height:50px;padding:10px 14px;border:1px solid rgba(21,24,27,.34);border-radius:0;background:#fff;color:var(--ink);font:16px 'VfT',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,box-shadow .2s}
.vf .form textarea{min-height:120px;resize:vertical}
.vf .form select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:36px}
.vf .form input:focus,.vf .form select:focus,.vf .form textarea:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(231,0,28,.18)}
.vf .form [aria-invalid="true"]{border-color:#B3001A}
.vf .form .err{font-size:13.5px;color:#B3001A;margin-top:6px;font-weight:500}
.vf .form fieldset{border:0;padding:0;margin:0;min-width:0}
.vf .form .opts{display:flex;gap:8px;flex-wrap:wrap}
.vf .form .opt{position:relative}
.vf .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.vf .form .opt > span{display:inline-flex;align-items:center;min-height:46px;padding:0 16px;box-shadow:inset 0 0 0 1px rgba(21,24,27,.3);font-size:15px;font-weight:500;transition:background-color .2s,box-shadow .2s,color .2s}
.vf .form .opt input:checked + span{background:var(--ink);color:#fff;box-shadow:none}
.vf .form .opt input:focus-visible + span{outline:2px solid var(--red);outline-offset:2px}
.vf .form .opt input:disabled + span{opacity:.4}
.vf .form .bigopt > span{display:grid;align-items:start;gap:2px;padding:12px 16px;min-width:180px}
.vf .form .bigopt > span b{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:22px;line-height:1}
.vf .form .bigopt > span small{font-size:13px;opacity:.75}
.vf .form .note{font-size:14px;color:var(--mute)}
.vf .form .acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vf .steps{display:flex;gap:0;margin-bottom:28px;font-size:14px;font-weight:600;box-shadow:inset 0 0 0 1px var(--line);width:max-content;max-width:100%}
.vf .steps span{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;color:var(--mute)}
.vf .steps span[aria-current="step"]{background:var(--ink);color:#fff}
.vf .done{padding:28px;background:var(--con);max-width:680px;border-top:4px solid var(--red)}
.vf .done h2{font-size:clamp(30px,3vw,44px)}
.vf .done dl{margin:20px 0;display:grid;gap:0}
.vf .done dl div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid var(--line);font-size:15px}
.vf .done dt{color:var(--mute)}
.vf .done dd{font-weight:600;text-align:right}
.vf .done .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.vf .proto-note{font-size:13px;color:var(--mute);margin-top:14px}
.vf .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:56px;align-items:start}
.vf .aside{display:grid;gap:12px;font-size:15px;padding-top:20px;border-top:2px solid var(--ink)}
.vf .aside h3{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:24px}
.vf .aside p{color:var(--mute)}
.vf .aside .frame{margin-top:8px;aspect-ratio:4 / 3}
.vf .picked{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:center;padding:12px;background:var(--con)}
.vf .picked img{width:96px;aspect-ratio:5 / 4;object-fit:cover}
.vf .picked b{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:20px;display:block;line-height:1.05}
.vf .picked span{font-size:13.5px;color:var(--mute)}
@media (max-width:899px){.vf .book-grid{grid-template-columns:minmax(0,1fr);gap:36px}.vf .form .two{grid-template-columns:minmax(0,1fr)}.vf .form .bigopt{flex:1 1 100%}.vf .form .bigopt > span{width:100%}}

/* staff */
.vf .sfilters{display:flex;gap:12px 28px;flex-wrap:wrap;margin-bottom:28px}
.vf .team{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 48px;border-top:2px solid var(--ink)}
.vf .person{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}
.vf .person img{width:64px;height:80px;object-fit:cover;background:var(--con2);grid-row:1 / 3}
.vf .person b{font-weight:600;font-size:16.5px;line-height:1.25}
.vf .person .ro{font-size:14px;color:var(--mute);grid-column:2}
.vf .person .ct{grid-column:3;grid-row:1 / 3;display:flex;gap:6px}
.vf .person .ct a{display:grid;place-items:center;width:44px;height:44px;box-shadow:inset 0 0 0 1px var(--line)}
@media (hover:hover){.vf .person .ct a:hover{background:var(--ink);color:#fff;box-shadow:none}}
.vf .person .em{grid-column:2 / 4;font-size:13.5px;color:var(--mute);word-break:break-all}
@media (max-width:899px){.vf .team{grid-template-columns:minmax(0,1fr)}}

/* branches page, brand page, docs */
.vf .bgrid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:48px}
.vf .bgrid3 article{border-top:2px solid var(--ink);padding-top:18px;display:grid;gap:10px;align-content:start}
.vf .bgrid3 h2{font-size:clamp(34px,3vw,48px)}
.vf .bgrid3 p{color:var(--mute);font-size:15px}
.vf .bgrid3 .kv{display:grid;gap:4px;font-size:15px}
.vf .bgrid3 .kv a{font-weight:600}
@media (max-width:899px){.vf .bgrid3{grid-template-columns:minmax(0,1fr)}}
.vf .doc{max-width:760px;display:grid;gap:30px}
.vf .doc h2{font-size:clamp(28px,2.6vw,40px)}
.vf .doc p{font-size:17px}
.vf .doc ul{display:grid;gap:0;border-top:1px solid var(--line)}
.vf .doc li{padding:12px 0 12px 26px;border-bottom:1px solid var(--line);position:relative;font-size:16px}
.vf .doc li::before{content:'';position:absolute;left:0;top:19px;width:11px;height:10px;background:var(--red);clip-path:polygon(50% 0,100% 100%,0 100%)}
.vf .doc .callout{padding:20px;background:var(--con);font-size:15.5px}
.vf .bhero{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:end;margin-bottom:48px}
.vf .bhero .blogo{background:#fff;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;aspect-ratio:3 / 1;padding:24px}
.vf .bhero .blogo img{max-height:84px;max-width:80%;object-fit:contain}
.vf .bhero .blogo span{font-family:'VfD',sans-serif;font-weight:700;font-size:48px;text-transform:uppercase}
@media (max-width:899px){.vf .bhero{grid-template-columns:minmax(0,1fr);gap:24px}}

/* staff-side inbox */
.vf-inbox .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 18px;background:var(--gr);color:#fff;margin-bottom:32px;font-size:14px}
.vf-inbox table{width:100%;border-collapse:collapse;font-size:15px}
.vf-inbox th{text-align:left;font-weight:600;font-size:13px;color:var(--mute);padding:0 12px 10px 0;border-bottom:2px solid var(--ink)}
.vf-inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.vf-inbox td:first-child{font-weight:600;white-space:nowrap}
.vf-inbox .kind{display:inline-flex;align-items:center;min-height:26px;padding:0 10px;background:var(--con);font-size:13px;font-weight:600;white-space:nowrap}
.vf-inbox .st{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600}
.vf-inbox .st i{width:8px;height:8px;background:#2E8B3A}
.vf-inbox .st.new i{background:var(--red)}
.vf-inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.vf-inbox .ia button,.vf-inbox .ia a{min-height:38px;padding:0 12px;display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--line);font-size:13.5px;font-weight:600}
.vf-inbox .ia button{background:var(--ink);color:#fff;box-shadow:none}
.vf-inbox small{color:var(--mute)}
.vf-inbox .inote{font-size:13.5px;color:var(--mute);margin-top:20px;max-width:80ch}
@media (max-width:899px){
  .vf-inbox table,.vf-inbox tbody,.vf-inbox tr,.vf-inbox td{display:block}
  .vf-inbox thead{display:none}
  .vf-inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}
  .vf-inbox td{padding:3px 0;border:0}
}

/* ── footer ── */
.vf-foot{background:var(--gr);color:#fff;padding:88px 0 40px}
.vf-foot .ftop{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:48px;align-items:start}
.vf-foot .fbrand img{width:clamp(170px,15vw,230px);height:auto}
.vf-foot .fbrand p{margin-top:18px;font-size:15px;color:rgba(255,255,255,.78);max-width:36ch}
.vf-foot .fbrand .sl{font-family:'VfD',sans-serif;font-weight:700;font-size:28px;text-transform:uppercase;color:#fff;margin-top:18px;letter-spacing:.02em}
.vf-foot .fbr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.vf-foot .fbr h3{font-family:'VfD',sans-serif;font-weight:700;text-transform:uppercase;font-size:22px;margin-bottom:8px}
.vf-foot .fbr p,.vf-foot .fbr a{display:block;font-size:14.5px;color:rgba(255,255,255,.8);line-height:1.7}
.vf-foot .fbr a{min-height:28px}
@media (hover:hover){.vf-foot a:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}}
.vf-foot .fnav{display:flex;flex-wrap:wrap;gap:6px 26px;margin-top:56px;padding-top:28px;border-top:1px solid rgba(255,255,255,.16)}
.vf-foot .fnav a{font-family:'VfD',sans-serif;font-weight:700;font-size:20px;text-transform:uppercase;min-height:36px;display:inline-flex;align-items:center}
.vf-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:40px;font-size:13px;color:rgba(255,255,255,.72)}
.vf-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.vf-foot .proto{font-size:12px;line-height:1.6;color:rgba(255,255,255,.6);margin-top:18px;max-width:110ch}
@media (max-width:899px){
  .vf-foot{padding:64px 0 calc(110px + env(safe-area-inset-bottom))}
  .vf-foot .ftop{grid-template-columns:minmax(0,1fr);gap:36px}
  .vf-foot .fbr{grid-template-columns:minmax(0,1fr);gap:24px}
}

/* ── mobile sticky bar ── */
.vf-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(31,36,39,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .4s cubic-bezier(.23,1,.32,1)}
.vf-sticky a,.vf-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;color:#fff;font-family:'VfD',sans-serif;font-size:16px;font-weight:700;letter-spacing:.03em;text-transform:uppercase}
.vf-sticky a:nth-child(2){background:var(--red)}
@media (max-width:899px){.vf-sticky{display:grid}}
.vf[data-sticky="1"] .vf-sticky{transform:none}
.vf.menu-open .vf-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Vélfang's colours ── */
.vf sndr-chat{--chat-accent:${RED};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#596067;--chat-line:#D9DCD7;--chat-sunk:#ECEDEA;--chat-radius:0px;--chat-font:'VfT',system-ui,sans-serif}
@media (max-width:899px){.vf sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .vf *,.vf *::before,.vf *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .vf [data-media],.vf .hmask{clip-path:none!important}
}
`
