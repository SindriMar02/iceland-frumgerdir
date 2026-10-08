/*
 * Vatt — the visual system. Tokens and the reasoning in DESIGN.md.
 * Host Grotesk, sentence case. Ink, white, a cool stone, Vatt green (ink text
 * only) and deep green (white text), slate from the wordmark for dark plates.
 * Prefix `vt`, so nothing here can reach Benni or ÍSBAND.
 */
const B = import.meta.env.BASE_URL
export const INK = '#121A1F'
export const GREEN = '#7DB03A'
export const DEEP = '#4F7A1D'
export const SLATE = '#495C6A'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'VtF';src:url('${B}fonts/vatt/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'VtF';src:url('${B}fonts/vatt/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'VtF';src:url('${B}fonts/vatt/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:#fff}
html.vt-menu,html.vt-menu body{overflow:hidden}

.vt{--ink:${INK};--paper:#FFFFFF;--stone:#F2F4F1;--line:#E1E6E3;--mute:#5B6770;--g:${GREEN};--deep:${DEEP};--slate:${SLATE};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(88px,10vw,152px);
  font-family:'VtF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
.vt *{box-sizing:border-box}
.vt a{color:inherit;text-decoration:none}
.vt p,.vt h1,.vt h2,.vt h3,.vt h4,.vt figure,.vt ul,.vt ol,.vt dl,.vt dd{margin:0}
.vt ul,.vt ol{padding:0;list-style:none}
.vt img{display:block;max-width:100%}
.vt button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.vt a,.vt button,.vt label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.vt :focus-visible{outline:2px solid var(--deep);outline-offset:3px;border-radius:3px}
.vt .on-dark :focus-visible,.vt .vt-menu-panel :focus-visible,.vt .vt-sticky :focus-visible{outline-color:var(--g)}
.vt .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vt .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--deep);color:#fff;padding:12px 18px;border-radius:4px;font-weight:600}
.vt .skip:focus{top:16px}
.vt section[id],.vt [data-anchor]{scroll-margin-top:92px}
.vt .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vt .num{font-variant-numeric:tabular-nums}

/* ── type ── */
.vt h1,.vt h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.vt h1{font-size:clamp(40px,4.6vw,76px)}
.vt h2{font-size:clamp(34px,3.8vw,56px)}
.vt h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.vt [data-chars] .ch-mask,.vt .lm{padding:.24em .04em .1em;margin:-.24em -.04em -.1em}
.vt .lm{display:block;overflow:hidden}
.vt .lm > span{display:block}
.vt .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:18px;font-size:14px;font-weight:500;line-height:1.2;color:var(--mute)}
.vt .eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--g);flex:none}
.vt .lede{font-size:17px;line-height:1.55;color:var(--mute);max-width:52ch}
.vt .center{text-align:center}
.vt .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label ── */
.vt .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),transform .12s}
.vt .btn:active{transform:scale(.985)}
.vt .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.vt .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.vt .btn-deep{background:var(--deep);color:#fff}
.vt .btn-dark{background:var(--ink);color:#fff}
.vt .btn-light{background:#fff;color:var(--ink)}
.vt .btn-line{box-shadow:inset 0 0 0 1px rgba(18,26,31,.24);color:var(--ink)}
.vt .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.42)}
.vt .btn-green{background:var(--g);color:var(--ink)}
@media (hover:hover){
  .vt .btn:hover .c{transform:translateY(-1.35em)}
  .vt .btn-deep:hover{background:#3F6A14}
  .vt .btn-dark:hover{background:var(--slate)}
  .vt .btn-light:hover{background:var(--g);color:var(--ink)}
  .vt .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
  .vt .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .vt .btn-green:hover{background:#8FC24C}
}
.vt .tlink{display:inline-flex;align-items:center;gap:6px;font-weight:500;border-bottom:1px solid rgba(18,26,31,.3);padding-bottom:2px;transition:border-color .25s}
@media (hover:hover){.vt .tlink:hover{border-color:var(--ink)}}

/* ── chrome: contact bar + header ── */
.vt-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .55s var(--ease)}
.vt-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:var(--slate);z-index:3}
.vt-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.vt-chrome .bar,.vt-chrome .hdr{transform:translateY(var(--bar,0px))}
.vt .bar{height:36px;background:var(--slate);color:rgba(255,255,255,.82);font-size:12.5px}
.vt .bar .in{display:flex;align-items:center;gap:26px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vt .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.vt .bar a:hover{color:#fff}}
.vt .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.vt .bar .st i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4)}
.vt .bar .st.on i{background:var(--g)}
.vt .hdr{position:relative;height:72px}
.vt .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.vt .plate.base{color:var(--ink)}
.vt .plate.top{color:#fff}
.vt-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.9);-webkit-backdrop-filter:saturate(1.4) blur(16px);backdrop-filter:saturate(1.4) blur(16px);box-shadow:0 1px 0 rgba(18,26,31,.08)}
.vt-chrome[data-solid="1"] .plate.top{background:rgba(18,26,31,.78);-webkit-backdrop-filter:saturate(1.4) blur(16px);backdrop-filter:saturate(1.4) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.vt .row{display:flex;align-items:center;gap:28px;height:72px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.vt .row .logo{display:block;flex:none}
.vt .row .logo img{height:28px;width:auto}
.vt .row .links{display:flex;gap:30px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.vt .row .nl{position:relative;padding:6px 0}
.vt .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
.vt .row .nl[aria-current="page"]::after{transform:scaleX(1);transform-origin:left}
@media (hover:hover){.vt .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.vt .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.vt .row .links + .acts{margin-left:0}
.vt .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.vt .plate.base .pill{background:var(--deep);color:#fff}
.vt .plate.top .pill{background:var(--g);color:var(--ink)}
@media (hover:hover){.vt .plate.base .pill:hover{background:var(--ink)}.vt .plate.top .pill:hover{background:#fff}}
.vt .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1180px){.vt .row .links{gap:20px;font-size:14px}}
@media (max-width:1023px){
  .vt .row .links{display:none}
  .vt .row .burger{display:grid}
  .vt .row .links + .acts{margin-left:auto}
  .vt .row .logo img{height:24px}
}
@media (max-width:639px){
  .vt .row .pill{display:none}
  .vt .bar .hide-s{display:none}
  .vt .row{gap:12px}
}

/* ── menu ── */
.vt-menu-panel{position:fixed;inset:0;z-index:120;background:var(--ink);color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.vt-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.vt-menu-panel .mtop img{height:24px;width:auto}
.vt-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.vt-menu-panel nav{display:flex;flex-direction:column;margin-top:36px}
.vt-menu-panel nav a{font-size:clamp(30px,8.4vw,48px);font-weight:500;letter-spacing:-.04em;line-height:1.2;padding:3px 0}
.vt-menu-panel nav a[aria-current="page"]{color:var(--g)}
.vt-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.vt-menu-panel .mfoot a,.vt-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.vt-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:#fff}
.vt-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── frames ── */
.vt .frame{position:relative;overflow:hidden;background:#E6EAE6;border-radius:6px}
.vt .frame .par{position:absolute;inset:-10% 0}
.vt .frame img{width:100%;height:100%;object-fit:cover}
.vt .frame .still-photo{position:absolute;inset:0}

/* ── 1 · hero (6/6, Suðurverk opening) ── */
.vt-hero{position:relative;min-height:100svh;display:grid;align-items:center;padding:calc(108px + env(safe-area-inset-top)) 0 56px;background:var(--paper);overflow:hidden}
.vt-hero .hgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:center}
.vt-hero .hcopy{max-width:600px;will-change:transform}
.vt-hero .hcopy .eyebrow{color:var(--mute)}
.vt-hero h1 .lm > span{display:block}
.vt-hero .lede{margin-top:22px}
.vt-hero .ctas{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
.vt-hero .hphoto{position:relative;margin:0}
.vt-hero .hmask{overflow:hidden;border-radius:6px;background:#E6EAE6}
.vt-hero .hmask img{width:100%;height:auto;aspect-ratio:6 / 5;object-fit:cover;object-position:52% 60%}
.vt-hero figcaption{font-size:13px;color:var(--mute);margin-top:12px}
.vt-hero .hfield{position:absolute;inset:auto 0 0 0;height:38%;background:var(--stone);z-index:0;pointer-events:none}
.vt-hero .wrap{position:relative;z-index:1}
@media (max-width:899px){
  .vt-hero{min-height:0;padding-top:calc(116px + env(safe-area-inset-top))}
  .vt-hero .hgrid{grid-template-columns:minmax(0,1fr);gap:28px}
  .vt-hero h1{font-size:clamp(38px,10.2vw,56px)}
  .vt-hero .hmask img{aspect-ratio:4 / 3}
  .vt-hero .hfield{height:30%}
}

/* ── 2 · six-plate brand selector ── */
.vt-brands{padding:calc(var(--sec) * .55) 0 var(--sec);background:var(--stone)}
.vt-brands .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:36px}
.vt-brands .plates{display:flex;gap:6px;height:clamp(380px,46vw,560px)}
.vt-brands .plate6{position:relative;flex:1 1 0;min-width:0;border-radius:6px;overflow:hidden;background:var(--slate);color:#fff;isolation:isolate;
  transition:flex-grow .6s var(--ease);display:flex;flex-direction:column;justify-content:flex-end;padding:22px;text-align:left}
.vt-brands .plate6[data-open="1"]{flex-grow:2.6}
.vt-brands .plate6 .ph{position:absolute;inset:0;z-index:-1}
.vt-brands .plate6 .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 55%;transition:transform 1.2s var(--ease)}
.vt-brands .plate6[data-open="1"] .ph img{transform:scale(1.04)}
.vt-brands .plate6 .ph::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(18,26,31,.78) 0%,rgba(18,26,31,.15) 48%,rgba(18,26,31,0) 70%)}
.vt-brands .plate6 .mark{position:absolute;top:20px;left:22px;height:22px;width:auto;max-width:calc(100% - 44px);object-fit:contain;object-position:left}
.vt-brands .plate6 .mark.tall{height:38px}
.vt-brands .plate6 .word{position:absolute;top:20px;left:22px;font-size:17px;font-weight:600;letter-spacing:-.01em}
.vt-brands .plate6 .pn{font-size:clamp(22px,2.4vw,34px);font-weight:500;letter-spacing:-.035em;line-height:1}
.vt-brands .plate6 .pl{font-size:14px;color:rgba(255,255,255,.82);margin-top:8px;opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease) .15s,transform .5s var(--ease) .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vt-brands .plate6 .go{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;opacity:0;transform:scale(.6);transition:opacity .35s var(--ease) .1s,transform .5s var(--ease) .1s}
.vt-brands .plate6[data-open="1"] .pl,.vt-brands .plate6[data-open="1"] .go{opacity:1;transform:none}
.vt-brands .plate6.soon{background:var(--slate)}
.vt-brands .plate6.soon .date{position:absolute;top:50%;left:22px;right:22px;transform:translateY(-50%);font-size:13px;font-weight:500;color:var(--g);letter-spacing:.01em}
.vt-brands .plate6.quiet{background:#DCE2DE;color:var(--ink)}
.vt-brands .plate6.quiet .pl{color:var(--mute)}
.vt-brands .plate6.quiet .word{color:var(--ink)}
.vt-brands .pnote{margin-top:18px;font-size:13.5px;color:var(--mute);max-width:70ch}
@media (max-width:899px){
  .vt-brands .plates{flex-direction:column;height:auto;gap:8px}
  .vt-brands .plate6{min-height:84px;padding:18px;flex:none;justify-content:center;padding-left:120px}
  .vt-brands .plate6[data-open="1"]{min-height:220px;justify-content:flex-end;padding-left:18px}
  .vt-brands .plate6 .mark{top:50%;transform:translateY(-50%);left:18px;height:18px;max-width:84px}
  .vt-brands .plate6 .mark.tall{height:30px}
  .vt-brands .plate6 .word{top:50%;transform:translateY(-50%);left:18px}
  .vt-brands .plate6[data-open="1"] .mark,.vt-brands .plate6[data-open="1"] .word{top:18px;transform:none}
  .vt-brands .plate6 .pn{font-size:20px}
  .vt-brands .plate6:not([data-open="1"]) .ph{opacity:.35}
  .vt-brands .plate6.soon .date{left:auto;right:18px;top:50%;transform:translateY(-50%)}
  .vt-brands .plate6[data-open="1"].soon .date{top:18px;transform:none;left:auto}
  .vt-brands .plate6 .pl{white-space:normal}
}

/* ── 3 · catalogue (Alberici tiles) ── */
.vt-cat{padding:var(--sec) 0}
.vt-cat .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:34px;flex-wrap:wrap}
.vt .filters{display:flex;gap:28px 36px;flex-wrap:wrap;margin:0 0 40px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.vt .fgroup{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.vt .fgroup > span{font-size:13px;color:var(--mute);margin-right:6px}
.vt .chip{min-height:36px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);transition:background-color .25s,box-shadow .25s,color .25s}
.vt .chip[aria-pressed="true"]{background:var(--g);color:var(--ink);box-shadow:none}
@media (hover:hover){.vt .chip:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.vt .fcount{margin-left:auto;font-size:14px;color:var(--mute);display:flex;align-items:center;gap:16px}
.vt .fcount button{font-weight:500;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.vt .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px 24px}
.vt .car{display:block}
.vt .car .ph{aspect-ratio:4 / 3;border-radius:6px;overflow:hidden;background:#E6EAE6}
.vt .car .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.vt .car:hover .ph img{transform:scale(1.035)}.vt .car:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.vt .car .meta{display:flex;gap:8px;margin-top:16px;font-size:13.5px;color:var(--mute);flex-wrap:wrap}
.vt .car .meta span:first-child{color:var(--ink);font-weight:500}
.vt .car h3{font-size:clamp(22px,1.9vw,28px);line-height:1.1;margin-top:4px}
.vt .car .pr{display:flex;align-items:baseline;gap:10px;margin-top:10px;font-size:16px;font-weight:500}
.vt .car .pr s{font-weight:400;color:var(--mute);font-size:13.5px}
.vt .car .rg{font-size:13px;color:var(--mute);margin-top:4px}
.vt .empty{padding:64px 0;text-align:center}
.vt .empty h3{font-size:24px}
.vt .empty p{color:var(--mute);margin:10px 0 20px}
.vt .fine{font-size:12.5px;color:var(--mute);margin-top:28px;max-width:80ch}
@media (max-width:1099px){.vt .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .vt .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px 12px}
  .vt .car .meta{margin-top:10px;font-size:12px}
  .vt .car .meta span:nth-child(3){display:none}
  .vt .car h3{font-size:17px}
  .vt .car .pr{font-size:14px;margin-top:6px}
  .vt .car .pr s{display:none}
  .vt .filters{gap:14px;padding:14px 0;margin-bottom:28px}
  .vt .fcount{margin-left:0;width:100%}
}

/* ── 4 · launch chapter (CargoKite pin): the veil lifts off three plates ── */
.vt-launch{position:relative;background:var(--ink);color:#fff}
.vt-launch .stage{padding:clamp(88px,10vw,140px) 0}
@media (min-width:992px) and (hover:hover) and (pointer:fine){.vt-launch .stage{min-height:100svh;display:grid;align-items:center}}
.vt-launch .lgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px;align-items:center}
.vt-launch .lcopy .eyebrow{color:var(--g)}
.vt-launch .lcopy .eyebrow i{background:var(--g)}
.vt-launch h2{font-size:clamp(38px,4.4vw,66px)}
.vt-launch .lcopy p{color:rgba(255,255,255,.8);margin-top:22px;max-width:46ch}
.vt-launch .lcount{font-size:14px;color:rgba(255,255,255,.62);margin-top:34px}
.vt-launch .lcount span{color:var(--g);font-weight:600}
.vt-launch .prog{height:2px;background:rgba(255,255,255,.18);margin-top:10px;max-width:360px;overflow:hidden}
.vt-launch .prog span{display:block;height:100%;background:var(--g);transform:scaleX(0);transform-origin:left}
.vt-launch .lplates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.vt-launch .lp{position:relative;aspect-ratio:3 / 4;border-radius:6px;background:var(--slate);display:grid;place-items:center;padding:24px;overflow:hidden;isolation:isolate}
.vt-launch .lp::before{content:'';position:absolute;inset:0;background:radial-gradient(70% 50% at 50% 100%,rgba(125,176,58,.3),transparent 70%)}
.vt-launch .lp img{position:relative;width:68%;height:auto;max-height:46%;object-fit:contain}
.vt-launch .lname{position:absolute;left:18px;bottom:16px;font-size:13px;color:rgba(255,255,255,.78)}
.vt-launch .veil{position:absolute;inset:-2% -1% -1%;z-index:2;background:linear-gradient(180deg,#5F7482 0%,#4D616E 55%,#415461 100%);box-shadow:0 18px 40px -16px rgba(0,0,0,.6);will-change:transform;border-radius:6px}
.vt-launch .veil i{position:absolute;left:16%;right:16%;top:46%;height:1px;background:rgba(255,255,255,.22)}
.vt-launch .veil::after{content:'';position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,transparent,rgba(18,26,31,.28))}
@media (max-width:899px){
  .vt-launch .stage{padding:72px 0 80px}
  .vt-launch .lgrid{grid-template-columns:minmax(0,1fr);gap:32px}
  .vt-launch .lplates{gap:8px}
  .vt-launch .lp{padding:14px}
  .vt-launch .lp img{width:78%}
  .vt-launch .lname{font-size:11px;left:12px;bottom:10px}
}
.vt-statement{position:relative;background:var(--g);color:var(--ink);padding:clamp(80px,9vw,128px) 0;will-change:clip-path}
.vt-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.vt-statement h2{font-size:clamp(44px,7.4vw,124px);line-height:.96;letter-spacing:-.05em}
.vt-statement h2 span{display:block}
.vt-statement p{max-width:600px;margin:28px auto 0;font-size:17px}
.vt-statement .ctas{display:flex;justify-content:center;gap:10px;margin-top:32px;flex-wrap:wrap}

/* ── 5 · fleet band ── */
.vt-fleet{padding:var(--sec) 0;background:var(--paper)}
.vt-fleet .fgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;align-items:center}
.vt-fleet .fintro{grid-column:1 / 6}
.vt-fleet .fintro p{margin:22px 0 26px;color:var(--mute);max-width:44ch}
.vt-fleet .fa{grid-column:7 / 13;margin:0}
.vt-fleet figcaption{font-size:13.5px;color:var(--mute);margin-top:12px}
.vt-fleet .vans{grid-column:1 / -1;margin-top:56px}
@media (max-width:899px){
  .vt-fleet .fgrid{grid-template-columns:minmax(0,1fr);gap:28px}
  .vt-fleet .fintro,.vt-fleet .fa,.vt-fleet .vans{grid-column:1}
  .vt-fleet .vans{margin-top:16px}
}

/* ── 6 · service rows + finance ── */
.vt-serv{padding:var(--sec) 0;background:var(--stone)}
.vt-serv .sgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.vt-serv .sintro p{color:var(--mute);margin:20px 0 26px;max-width:44ch}
.vt .rows{border-bottom:1px solid rgba(18,26,31,.12)}
.vt .r{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:16px 24px;align-items:center;padding:20px 0;border-top:1px solid rgba(18,26,31,.12)}
.vt .r h3{font-size:19px;line-height:1.2}
.vt .r .sub{font-size:13.5px;color:var(--mute);margin-top:2px}
.vt .r .tel{font-size:17px;font-weight:500;width:max-content}
@media (hover:hover){.vt .r .tel:hover{text-decoration:underline;text-underline-offset:3px}}
.vt .r .role{font-size:14px;color:var(--mute)}
@media (max-width:767px){.vt .r{grid-template-columns:1fr auto;gap:4px 16px}.vt .r .role{grid-column:1 / -1}}
.vt-serv .sphoto{grid-column:1 / -1;margin-top:40px}
.vt-fin{padding:var(--sec) 0;background:var(--paper)}
.vt-fin .fin{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:40px}
.vt-fin .fin article{padding:26px 0 0;border-top:2px solid var(--ink)}
.vt-fin .fin h3{font-size:21px}
.vt-fin .fin .big{font-size:clamp(40px,4vw,60px);font-weight:500;letter-spacing:-.04em;line-height:1;margin:14px 0 10px}
.vt-fin .fin p{color:var(--mute);font-size:15px}
.vt-fin .lenders{display:flex;gap:10px 28px;flex-wrap:wrap;margin-top:40px;font-size:15px;font-weight:500}
.vt-fin .lenders span{display:inline-flex;align-items:center;gap:8px}
.vt-fin .lenders i{width:6px;height:6px;border-radius:50%;background:var(--g)}
.vt-fin .gr{margin-top:22px;font-size:14px;color:var(--mute);max-width:70ch}
@media (max-width:899px){.vt-fin .fin{grid-template-columns:minmax(0,1fr)}.vt-serv .sgrid{grid-template-columns:minmax(0,1fr);gap:28px}}

/* ── 7 · test drive band (Spyker signup) ── */
.vt-drive{position:relative;min-height:720px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:160px 0 96px}
.vt-drive .dbg{position:absolute;inset:0;overflow:hidden}
.vt-drive .dbg .par{position:absolute;inset:-10% 0}
.vt-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 55%}
.vt-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(18,26,31,.9) 0%,rgba(18,26,31,.5) 45%,rgba(18,26,31,.15) 100%)}
.vt-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.vt-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.84);margin-top:18px}
.vt-drive .dcard{padding:28px;border-radius:8px;background:rgba(18,26,31,.6);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);display:grid;gap:16px}
.vt-drive .dcard p{font-size:15px;color:rgba(255,255,255,.84)}
.vt-drive .dcard .two{display:flex;gap:10px;flex-wrap:wrap}
@media (max-width:899px){.vt-drive{min-height:0;padding:140px 0 110px}.vt-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:32px}}

/* ── route pages ── */
.vt-page{padding:calc(132px + env(safe-area-inset-top)) 0 var(--sec)}
.vt-page .intro{max-width:760px;margin-bottom:48px}
.vt-page .intro .lede{margin-top:18px}
.vt .crumb{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--mute);margin-bottom:22px}
@media (hover:hover){.vt .crumb:hover{color:var(--ink)}}
@media (max-width:899px){.vt-page{padding-top:calc(104px + env(safe-area-inset-top))}}

/* detail 4/8 */
.vt-detail .dhead{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:40px;align-items:end;margin-bottom:40px}
.vt-detail .dhead h1{font-size:clamp(36px,4.2vw,66px)}
.vt-detail .price{font-size:clamp(24px,2.2vw,32px);font-weight:500;letter-spacing:-.03em;margin-top:18px}
.vt-detail .price small{display:block;font-size:14px;font-weight:400;color:var(--mute);letter-spacing:0;margin-top:4px}
.vt-detail .dact{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
.vt-detail .dmain{border-radius:6px}
.vt-detail .specs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin:48px 0}
.vt-detail .specs div{padding-top:16px;border-top:1px solid var(--line)}
.vt-detail .specs dt{font-size:13px;color:var(--mute)}
.vt-detail .specs dd{font-size:clamp(20px,1.8vw,26px);font-weight:500;letter-spacing:-.03em;margin-top:6px;line-height:1.15}
.vt-detail .dbody{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.vt-detail .facts li{display:flex;gap:14px;padding:14px 0;border-top:1px solid var(--line);font-size:16px}
.vt-detail .facts li::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--g);flex:none;margin-top:9px}
.vt-detail .facts li:last-child{border-bottom:1px solid var(--line)}
.vt-detail .gal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.vt-detail .gal .frame:first-child{grid-column:1 / -1}
.vt-detail .src{font-size:13px;color:var(--mute);margin-top:18px}
.vt-detail .src a{text-decoration:underline;text-underline-offset:3px}
.vt-detail .more{margin-top:var(--sec)}
@media (max-width:899px){
  .vt-detail .dhead,.vt-detail .dbody{grid-template-columns:minmax(0,1fr);gap:24px}
  .vt-detail .specs{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:32px 0}
}

/* forms (booking, fleet, contact) */
.vt .form{display:grid;gap:18px;max-width:640px}
.vt .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.vt .form label > span,.vt .form fieldset legend{display:block;font-size:13.5px;font-weight:500;margin-bottom:6px;color:var(--ink)}
.vt .form input,.vt .form select,.vt .form textarea{width:100%;min-height:48px;padding:10px 14px;border:1px solid rgba(18,26,31,.28);border-radius:4px;background:#fff;color:var(--ink);font:16px 'VtF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,box-shadow .2s}
.vt .form textarea{min-height:120px;resize:vertical}
.vt .form select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.vt .form input:focus,.vt .form select:focus,.vt .form textarea:focus{border-color:var(--deep);box-shadow:0 0 0 3px rgba(79,122,29,.18)}
.vt .form input[aria-invalid="true"]{border-color:#B3261E}
.vt .form .err{font-size:13px;color:#B3261E;margin-top:6px}
.vt .form fieldset{border:0;padding:0;margin:0;min-width:0}
.vt .form .opts{display:flex;gap:8px;flex-wrap:wrap}
.vt .form .opt{position:relative}
.vt .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.vt .form .opt span{display:inline-flex;align-items:center;min-height:42px;padding:0 16px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(18,26,31,.24);font-size:14.5px;font-weight:500;transition:background-color .2s,box-shadow .2s}
.vt .form .opt input:checked + span{background:var(--g);box-shadow:none}
.vt .form .opt input:focus-visible + span{outline:2px solid var(--deep);outline-offset:2px}
.vt .form .opt input:disabled + span{opacity:.4}
.vt .form .note{font-size:13.5px;color:var(--mute)}
.vt .form .acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vt .steps{display:flex;gap:6px;margin-bottom:28px;font-size:13.5px;color:var(--mute)}
.vt .steps span{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:var(--stone)}
.vt .steps span[aria-current="step"]{background:var(--ink);color:#fff}
.vt .done{padding:28px;border-radius:6px;background:var(--stone);max-width:640px}
.vt .done h2{font-size:clamp(26px,2.6vw,36px)}
.vt .done dl{margin:20px 0;display:grid;gap:8px}
.vt .done dl div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-top:1px solid var(--line);font-size:15px}
.vt .done dt{color:var(--mute)}
.vt .done .id{font-weight:500}
.vt .done .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.vt .proto-note{font-size:13px;color:var(--mute);margin-top:14px}
.vt .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:start}
.vt .aside{background:var(--stone);border-radius:6px;padding:26px;display:grid;gap:12px;font-size:15px}
.vt .aside h3{font-size:18px}
.vt .aside p{color:var(--mute)}
.vt .aside .frame{margin-top:8px}
@media (max-width:899px){.vt .book-grid{grid-template-columns:minmax(0,1fr);gap:28px}.vt .form .two{grid-template-columns:minmax(0,1fr)}}

/* staff list + contact */
.vt-contact .cgrid{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:48px;align-items:start}
.vt .people{display:grid;gap:0}
.vt .people h3{font-size:14px;color:var(--mute);font-weight:500;margin:28px 0 8px}
.vt .people h3:first-child{margin-top:0}
.vt .person{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:12px 0;border-top:1px solid var(--line);align-items:center}
.vt .person b{font-weight:500;font-size:16px}
.vt .person span{font-size:13.5px;color:var(--mute);grid-column:1}
.vt .person a{grid-column:2;grid-row:1 / 3;font-size:14.5px;font-weight:500;display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);white-space:nowrap}
@media (hover:hover){.vt .person a:hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.vt .where{display:grid;gap:10px;margin-top:40px;padding:24px;background:var(--stone);border-radius:6px;font-size:15px}
.vt .where strong{font-weight:500}
.vt .where dl div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-top:1px solid var(--line)}
.vt .where dt{color:var(--mute)}
@media (max-width:899px){.vt-contact .cgrid{grid-template-columns:minmax(0,1fr);gap:36px}.vt .person a{font-size:13px;padding:0 10px}}

/* staff-side preview */
.vt-inbox{padding-top:calc(120px + env(safe-area-inset-top))}
.vt-inbox .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 18px;border-radius:6px;background:var(--slate);color:#fff;margin-bottom:32px;font-size:14px}
.vt-inbox .ibar b{font-weight:500}
.vt-inbox table{width:100%;border-collapse:collapse;font-size:15px}
.vt-inbox th{text-align:left;font-weight:500;font-size:13px;color:var(--mute);padding:0 12px 10px 0;border-bottom:1px solid var(--ink)}
.vt-inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.vt-inbox td:first-child{font-weight:500;white-space:nowrap}
.vt-inbox .kind{display:inline-flex;align-items:center;min-height:26px;padding:0 10px;border-radius:999px;background:var(--stone);font-size:13px;white-space:nowrap}
.vt-inbox .st{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:500}
.vt-inbox .st i{width:7px;height:7px;border-radius:50%;background:var(--g)}
.vt-inbox .st.new i{background:#D8A200}
.vt-inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.vt-inbox .ia button{min-height:36px;padding:0 12px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--line);font-size:13.5px;font-weight:500}
.vt-inbox .ia button:first-child{background:var(--deep);color:#fff;box-shadow:none}
.vt-inbox .inote{font-size:13.5px;color:var(--mute);margin-top:20px;max-width:80ch}
@media (max-width:899px){
  .vt-inbox table,.vt-inbox tbody,.vt-inbox tr,.vt-inbox td{display:block}
  .vt-inbox thead{display:none}
  .vt-inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}
  .vt-inbox td{padding:3px 0;border:0}
}

/* ── footer ── */
.vt-foot{background:var(--slate);color:#fff;padding:96px 0 44px}
.vt-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .9fr;gap:48px;align-items:start}
.vt-foot .fbrand img{width:clamp(150px,14vw,210px);height:auto}
.vt-foot .fbrand p{margin-top:18px;font-size:15px;color:rgba(255,255,255,.78);max-width:36ch}
.vt-foot .fnav{display:flex;flex-direction:column;gap:2px}
.vt-foot .fnav a{font-size:clamp(22px,2vw,30px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.vt-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.vt-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end;text-align:right}
.vt-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.vt-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.vt-foot .fside .brands{font-size:13px;color:rgba(255,255,255,.7);margin-top:12px;max-width:32ch}
.vt-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:72px;padding-top:24px;border-top:1px solid rgba(255,255,255,.16);font-size:13px;color:rgba(255,255,255,.72)}
.vt-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.vt-foot .proto{font-size:12px;line-height:1.6;color:rgba(255,255,255,.62);margin-top:20px}
@media (max-width:899px){
  .vt-foot{padding:72px 0 calc(110px + env(safe-area-inset-bottom))}
  .vt-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .vt-foot .fside{align-items:flex-start;text-align:left}
  .vt-foot .flegal{margin-top:48px}
}

/* ── mobile sticky CTA (the SNDR fixed bar) ── */
.vt-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(18,26,31,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.vt-sticky a,.vt-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.vt-sticky a:nth-child(2){background:var(--g);color:var(--ink)}
@media (max-width:899px){.vt-sticky{display:grid}}
.vt[data-sticky="1"] .vt-sticky{transform:none}
.vt.menu-open .vt-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Vatt's colours ── */
.vt sndr-chat{--chat-accent:${DEEP};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#5B6770;--chat-line:#E1E6E3;--chat-sunk:#F2F4F1;--chat-radius:14px;--chat-font:'VtF',system-ui,sans-serif}
@media (max-width:899px){.vt sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .vt *,.vt *::before,.vt *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .vt-statement{clip-path:none!important}
}
`
