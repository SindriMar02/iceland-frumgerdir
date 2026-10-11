/*
 * Una / XPENG: the visual system. Tokens and the reasoning in DESIGN.md.
 * The ÍSBAND/Vatt dealer system (Host Grotesk, sentence case, Drivehub chrome,
 * Spyker easing) with Una's own logo gradient as the only colour: green
 * #18ED7F (ink text on it, or on ink) and blue #186DEF (white text on it).
 * Prefix `xg`, so nothing here can reach ÍSBAND, Vatt or Benni.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0F1316'
export const GREEN = '#18ED7F'
export const DEEP = '#186DEF'
export const SLATE = '#1A2126'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'XgF';src:url('${B}fonts/xpeng/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'XgF';src:url('${B}fonts/xpeng/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'XgF';src:url('${B}fonts/xpeng/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:#fff}
html.xg-menu,html.xg-menu body{overflow:hidden}

.xg{--ink:${INK};--paper:#FFFFFF;--stone:#EFF1F1;--line:#DDE1E2;--mute:#5A646B;--g:${GREEN};--deep:${DEEP};--slate:${SLATE};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(88px,10vw,152px);
  font-family:'XgF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal}
.xg *{box-sizing:border-box}
.xg a{color:inherit;text-decoration:none}
.xg p,.xg h1,.xg h2,.xg h3,.xg h4,.xg figure,.xg ul,.xg ol,.xg dl,.xg dd{margin:0}
.xg ul,.xg ol{padding:0;list-style:none}
.xg img{display:block;max-width:100%}
.xg button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.xg a,.xg button,.xg label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.xg :focus-visible{outline:2px solid var(--deep);outline-offset:3px;border-radius:3px}
.xg .on-dark :focus-visible,.xg .xg-menu-panel :focus-visible,.xg .xg-sticky :focus-visible{outline-color:var(--g)}
.xg .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.xg .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--deep);color:#fff;padding:12px 18px;border-radius:4px;font-weight:600}
.xg .skip:focus{top:16px}
.xg section[id],.xg [data-anchor]{scroll-margin-top:92px}
.xg .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.xg .num{font-variant-numeric:tabular-nums}

/* ── type ── */
.xg h1,.xg h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.xg h1{font-size:clamp(40px,4.6vw,76px)}
.xg h2{font-size:clamp(34px,3.8vw,56px)}
.xg h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.xg [data-chars] .ch-mask,.xg .lm{padding:.24em .04em .1em;margin:-.24em -.04em -.1em}
.xg .lm{display:block;overflow:hidden}
.xg .lm > span{display:block}
.xg .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:18px;font-size:14px;font-weight:500;line-height:1.2;color:var(--mute)}
.xg .eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--g);flex:none}
.xg .lede{font-size:17px;line-height:1.55;color:var(--mute);max-width:52ch}
.xg .center{text-align:center}
.xg .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label ── */
.xg .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),transform .12s}
.xg .btn:active{transform:scale(.985)}
.xg .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.xg .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.xg .btn-deep{background:var(--deep);color:#fff}
.xg .btn-dark{background:var(--ink);color:#fff}
.xg .btn-light{background:#fff;color:var(--ink)}
.xg .btn-line{box-shadow:inset 0 0 0 1px rgba(15,19,22,.24);color:var(--ink)}
.xg .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.42)}
.xg .btn-green{background:var(--g);color:var(--ink)}
@media (hover:hover){
  .xg .btn:hover .c{transform:translateY(-1.35em)}
  .xg .btn-deep:hover{background:#1458D0}
  .xg .btn-dark:hover{background:var(--slate)}
  .xg .btn-light:hover{background:var(--g);color:var(--ink)}
  .xg .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
  .xg .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .xg .btn-green:hover{background:#4DF29C}
}
.xg .tlink{display:inline-flex;align-items:center;gap:6px;font-weight:500;border-bottom:1px solid rgba(15,19,22,.3);padding-bottom:2px;transition:border-color .25s}
@media (hover:hover){.xg .tlink:hover{border-color:var(--ink)}}

/* ── chrome: contact bar + header ── */
.xg-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .55s var(--ease)}
.xg-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:var(--slate);z-index:3}
.xg-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.xg-chrome .bar,.xg-chrome .hdr{transform:translateY(var(--bar,0px))}
.xg .bar{height:36px;background:var(--slate);color:rgba(255,255,255,.82);font-size:12.5px}
.xg .bar .in{display:flex;align-items:center;gap:26px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.xg .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.xg .bar a:hover{color:#fff}}
.xg .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.xg .bar .st i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4)}
.xg .bar .st.on i{background:var(--g)}
.xg .hdr{position:relative;height:72px}
.xg .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.xg .plate.base{color:var(--ink)}
.xg .plate.top{color:#fff}
.xg-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.9);-webkit-backdrop-filter:saturate(1.4) blur(16px);backdrop-filter:saturate(1.4) blur(16px);box-shadow:0 1px 0 rgba(15,19,22,.08)}
.xg-chrome[data-solid="1"] .plate.top{background:rgba(15,19,22,.78);-webkit-backdrop-filter:saturate(1.4) blur(16px);backdrop-filter:saturate(1.4) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.xg .row{display:flex;align-items:center;gap:28px;height:72px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.xg .row .logo{display:block;flex:none}

.xg .row .links{display:flex;gap:30px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.xg .row .nl{position:relative;padding:6px 0}
.xg .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
.xg .row .nl[aria-current="page"]::after{transform:scaleX(1);transform-origin:left}
@media (hover:hover){.xg .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.xg .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.xg .row .links + .acts{margin-left:0}
.xg .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.xg .plate.base .pill{background:var(--deep);color:#fff}
.xg .plate.top .pill{background:var(--g);color:var(--ink)}
@media (hover:hover){.xg .plate.base .pill:hover{background:var(--ink)}.xg .plate.top .pill:hover{background:#fff}}
.xg .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1180px){.xg .row .links{gap:20px;font-size:14px}}
@media (max-width:1023px){
  .xg .row .links{display:none}
  .xg .row .burger{display:grid}
  .xg .row .links + .acts{margin-left:auto}
  .xg .row .logo > img{height:24px}
}
@media (max-width:639px){
  .xg .row .pill{display:none}
  .xg .bar .hide-s{display:none}
  .xg .row{gap:12px}
}

/* ── menu ── */
.xg-menu-panel{position:fixed;inset:0;z-index:120;background:var(--ink);color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.xg-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.xg-menu-panel .mtop img{height:24px;width:auto}
.xg-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.xg-menu-panel nav{display:flex;flex-direction:column;margin-top:36px}
.xg-menu-panel nav a{font-size:clamp(30px,8.4vw,48px);font-weight:500;letter-spacing:-.04em;line-height:1.2;padding:3px 0}
.xg-menu-panel nav a[aria-current="page"]{color:var(--g)}
.xg-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.xg-menu-panel .mfoot a,.xg-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.xg-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:#fff}
.xg-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── frames ── */
.xg .frame{position:relative;overflow:hidden;background:#E4E7E7;border-radius:6px}
.xg .frame .par{position:absolute;inset:-10% 0}
.xg .frame img{width:100%;height:100%;object-fit:cover}
.xg .frame .still-photo{position:absolute;inset:0}

/* ── 1 · hero (6/6, Suðurverk opening) ── */
.xg-hero{position:relative;min-height:100svh;display:grid;align-items:center;padding:calc(108px + env(safe-area-inset-top)) 0 56px;background:var(--paper);overflow:hidden}
.xg-hero .hgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:center}
.xg-hero .hcopy{max-width:600px;will-change:transform}
.xg-hero .hcopy .eyebrow{color:var(--mute)}
.xg-hero h1 .lm > span{display:block}
.xg-hero .lede{margin-top:22px}
.xg-hero .ctas{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
.xg-hero .hphoto{position:relative;margin:0}
.xg-hero .hmask{overflow:hidden;border-radius:6px;background:#E4E7E7}
.xg-hero .hmask img{width:100%;height:auto;aspect-ratio:6 / 5;object-fit:cover;object-position:52% 60%}
.xg-hero figcaption{font-size:13px;color:var(--mute);margin-top:12px}
.xg-hero .hfield{position:absolute;inset:auto 0 0 0;height:38%;background:var(--stone);z-index:0;pointer-events:none}
.xg-hero .wrap{position:relative;z-index:1}
@media (max-width:899px){
  .xg-hero{min-height:0;padding-top:calc(116px + env(safe-area-inset-top))}
  .xg-hero .hgrid{grid-template-columns:minmax(0,1fr);gap:28px}
  .xg-hero h1{font-size:clamp(38px,10.2vw,56px)}
  .xg-hero .hmask img{aspect-ratio:4 / 3}
  .xg-hero .hfield{height:30%}
}

/* ── 2 · six-plate brand selector ── */
.xg-brands{padding:calc(var(--sec) * .55) 0 var(--sec);background:var(--stone)}
.xg-brands .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:36px}
.xg-brands .plates{display:flex;gap:6px;height:clamp(380px,46vw,560px)}
.xg-brands .plate6{position:relative;flex:1 1 0;min-width:0;border-radius:6px;overflow:hidden;background:var(--slate);color:#fff;isolation:isolate;
  transition:flex-grow .6s var(--ease);display:flex;flex-direction:column;justify-content:flex-end;padding:22px;text-align:left}
.xg-brands .plate6[data-open="1"]{flex-grow:2.6}
.xg-brands .plate6 .ph{position:absolute;inset:0;z-index:-1}
.xg-brands .plate6 .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 55%;transition:transform 1.2s var(--ease)}
.xg-brands .plate6[data-open="1"] .ph img{transform:scale(1.04)}
.xg-brands .plate6 .ph::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(15,19,22,.78) 0%,rgba(15,19,22,.15) 48%,rgba(15,19,22,0) 70%)}
.xg-brands .plate6 .mark{position:absolute;top:20px;left:22px;height:22px;width:auto;max-width:calc(100% - 44px);object-fit:contain;object-position:left}
.xg-brands .plate6 .mark.tall{height:38px}
.xg-brands .plate6 .word{position:absolute;top:20px;left:22px;font-size:17px;font-weight:600;letter-spacing:-.01em}
.xg-brands .plate6 .pn{font-size:clamp(22px,2.4vw,34px);font-weight:500;letter-spacing:-.035em;line-height:1}
.xg-brands .plate6 .pl{font-size:14px;color:rgba(255,255,255,.82);margin-top:8px;opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease) .15s,transform .5s var(--ease) .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xg-brands .plate6 .go{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;opacity:0;transform:scale(.6);transition:opacity .35s var(--ease) .1s,transform .5s var(--ease) .1s}
.xg-brands .plate6[data-open="1"] .pl,.xg-brands .plate6[data-open="1"] .go{opacity:1;transform:none}
.xg-brands .plate6.soon{background:var(--slate)}
.xg-brands .plate6.soon .date{position:absolute;top:50%;left:22px;right:22px;transform:translateY(-50%);font-size:13px;font-weight:500;color:var(--g);letter-spacing:.01em}
.xg-brands .plate6.quiet{background:#DCE1E1;color:var(--ink)}
.xg-brands .plate6.quiet .pl{color:var(--mute)}
.xg-brands .plate6.quiet .word{color:var(--ink)}
.xg-brands .pnote{margin-top:18px;font-size:13.5px;color:var(--mute);max-width:70ch}
@media (max-width:899px){
  .xg-brands .plates{flex-direction:column;height:auto;gap:8px}
  .xg-brands .plate6{min-height:84px;padding:18px;flex:none;justify-content:center;padding-left:120px}
  .xg-brands .plate6[data-open="1"]{min-height:220px;justify-content:flex-end;padding-left:18px}
  .xg-brands .plate6 .mark{top:50%;transform:translateY(-50%);left:18px;height:18px;max-width:84px}
  .xg-brands .plate6 .mark.tall{height:30px}
  .xg-brands .plate6 .word{top:50%;transform:translateY(-50%);left:18px}
  .xg-brands .plate6[data-open="1"] .mark,.xg-brands .plate6[data-open="1"] .word{top:18px;transform:none}
  .xg-brands .plate6 .pn{font-size:20px}
  .xg-brands .plate6:not([data-open="1"]) .ph{opacity:.35}
  .xg-brands .plate6.soon .date{left:auto;right:18px;top:50%;transform:translateY(-50%)}
  .xg-brands .plate6[data-open="1"].soon .date{top:18px;transform:none;left:auto}
  .xg-brands .plate6 .pl{white-space:normal}
}

/* ── 3 · catalogue (Alberici tiles) ── */
.xg-cat{padding:var(--sec) 0}
.xg-cat .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:34px;flex-wrap:wrap}
.xg .filters{display:flex;gap:28px 36px;flex-wrap:wrap;margin:0 0 40px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.xg .fgroup{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.xg .fgroup > span{font-size:13px;color:var(--mute);margin-right:6px}
.xg .chip{min-height:36px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);transition:background-color .25s,box-shadow .25s,color .25s}
.xg .chip[aria-pressed="true"]{background:var(--g);color:var(--ink);box-shadow:none}
@media (hover:hover){.xg .chip:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.xg .fcount{margin-left:auto;font-size:14px;color:var(--mute);display:flex;align-items:center;gap:16px}
.xg .fcount button{font-weight:500;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.xg .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px 24px}
.xg .car{display:block}
.xg .car .ph{aspect-ratio:4 / 3;border-radius:6px;overflow:hidden;background:#E4E7E7}
.xg .car .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.xg .car:hover .ph img{transform:scale(1.035)}.xg .car:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.xg .car .meta{display:flex;gap:8px;margin-top:16px;font-size:13.5px;color:var(--mute);flex-wrap:wrap}
.xg .car .meta span:first-child{color:var(--ink);font-weight:500}
.xg .car h3{font-size:clamp(22px,1.9vw,28px);line-height:1.1;margin-top:4px}
.xg .car .pr{display:flex;align-items:baseline;gap:10px;margin-top:10px;font-size:16px;font-weight:500}
.xg .car .pr s{font-weight:400;color:var(--mute);font-size:13.5px}
.xg .car .rg{font-size:13px;color:var(--mute);margin-top:4px}
.xg .empty{padding:64px 0;text-align:center}
.xg .empty h3{font-size:24px}
.xg .empty p{color:var(--mute);margin:10px 0 20px}
.xg .fine{font-size:12.5px;color:var(--mute);margin-top:28px;max-width:80ch}
@media (max-width:1099px){.xg .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .xg .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px 12px}
  .xg .car .meta{margin-top:10px;font-size:12px}
  .xg .car .meta span:nth-child(3){display:none}
  .xg .car h3{font-size:17px}
  .xg .car .pr{font-size:14px;margin-top:6px}
  .xg .car .pr s{display:none}
  .xg .filters{gap:14px;padding:14px 0;margin-bottom:28px}
  .xg .fcount{margin-left:0;width:100%}
}

/* ── 4 · Hringvegurinn chapter (CargoKite pin, re-aimed): the line is the real ring road ── */
.xg-ring{position:relative;background:var(--ink);color:#fff}
.xg-ring .stage{padding:clamp(88px,10vw,128px) 0}
@media (min-width:992px) and (hover:hover) and (pointer:fine){.xg-ring .stage{min-height:100svh;display:grid;align-items:center;padding:96px 0 40px}}
.xg-ring .rgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:center}
.xg-ring .rcopy .eyebrow{color:var(--g)}
.xg-ring .rcopy .eyebrow i{background:var(--g)}
.xg-ring h2{font-size:clamp(38px,4.4vw,66px)}
.xg-ring .rcopy > p{color:rgba(255,255,255,.8);margin-top:20px;max-width:46ch}
.xg .rpick{display:grid;gap:8px;margin-top:22px}
.xg-ring .chip{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.xg-ring .chip[aria-pressed="true"]{background:var(--g);color:var(--ink);box-shadow:none}
@media (hover:hover){.xg-ring .chip:not([aria-pressed="true"]):hover{box-shadow:inset 0 0 0 1px #fff}}
.xg-ring .rsum{display:grid;grid-template-columns:repeat(3,auto);gap:12px 30px;justify-content:start;margin-top:26px}
.xg-ring .rsum dt{font-size:13px;color:rgba(255,255,255,.66)}
.xg-ring .rsum dd{font-size:clamp(24px,2.2vw,34px);font-weight:500;letter-spacing:-.03em;line-height:1.1;margin-top:4px}
.xg-ring .prog{height:2px;background:rgba(255,255,255,.18);margin-top:18px;max-width:360px;overflow:hidden}
.xg-ring .prog span{display:block;height:100%;background:linear-gradient(90deg,#18ED7F,#186DEF);transform:scaleX(0);transform-origin:left}
.xg-ring .rnote{font-size:13px;color:rgba(255,255,255,.66);margin-top:14px;max-width:52ch}
.xg-ring .rwarn{color:#FFD27A;font-size:14px;margin-top:12px;max-width:46ch}
.xg-ring .ctas{margin-top:22px}
.xg-ring .rmap{margin:0}
.xg-ring .rmap figcaption,.xg .pmap figcaption{font-size:13px;color:rgba(255,255,255,.66);margin-top:12px}
.xg .rmap-svg{display:block;width:100%;height:auto;overflow:visible}
.xg .rmap-svg .land{fill:rgba(255,255,255,.07);stroke:rgba(255,255,255,.22);stroke-width:1;vector-effect:non-scaling-stroke}
.xg .rmap-svg .road0{fill:none;stroke:rgba(255,255,255,.2);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.xg .rmap-svg .road1{fill:none;stroke:url(#xgGrad);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}
.xg .rmap-svg .fast{fill:rgba(255,255,255,.4)}
.xg .rmap-svg .stop .halo,.xg .rmap-svg .stop .dot,.xg .rmap-svg .stop .sn{transform-box:fill-box;transform-origin:center;opacity:0;transform:scale(.6);transition:transform .45s var(--ease),opacity .3s var(--ease)}
.xg .rmap-svg .stop .halo{fill:rgba(24,237,127,.2)}
.xg .rmap-svg .stop .dot{fill:var(--ink);stroke:var(--g);stroke-width:2.4}
.xg .rmap-svg .stop .sn{fill:#fff;font:600 12px 'XgF',system-ui,sans-serif}
.xg .rmap-svg .stop[data-on="1"] .halo,.xg .rmap-svg .stop[data-on="1"] .dot,.xg .rmap-svg .stop[data-on="1"] .sn{opacity:1;transform:none}
.xg .rmap-svg .stop .sl{fill:#fff;font:500 19px 'XgF',system-ui,sans-serif;opacity:0;transform:translateY(5px);transition:transform .5s var(--ease),opacity .4s var(--ease);paint-order:stroke;stroke:rgba(15,19,22,.85);stroke-width:5px;stroke-linejoin:round}
.xg .rmap-svg .stop[data-on="1"] .sl{opacity:1;transform:none}
.xg .rmap-svg .place{fill:rgba(255,255,255,.78);font:500 21px 'XgF',system-ui,sans-serif}
.xg .rmap-svg .car{opacity:0;transition:opacity .2s}
.xg .rmap-svg .car .core{fill:#fff;stroke:var(--g);stroke-width:3.5}
@media (max-width:899px){
  .xg-ring .stage{padding:72px 0 80px}
  .xg-ring .rgrid{grid-template-columns:minmax(0,1fr);gap:32px}
  .xg-ring .rsum{gap:12px 22px}
  .xg .rmap-svg .place{font-size:26px}
  .xg .rmap-svg .stop .sl{font-size:25px}
}

/* ── 3 · price list as tables ── */
.xg-cat .pgroups{display:grid;gap:52px}
.xg .pg{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:32px;align-items:start;padding-top:26px;border-top:2px solid var(--ink)}
.xg .pgl h3{font-size:clamp(26px,2.4vw,36px);line-height:1.05;letter-spacing:-.035em}
.xg .pgl p{color:var(--mute);margin:8px 0 16px}
.xg .ptab{width:100%;border-collapse:collapse;font-size:15.5px}
.xg .ptab th,.xg .ptab td{padding:14px 14px 14px 0;border-bottom:1px solid var(--line);text-align:left;font-weight:400;vertical-align:baseline}
.xg .ptab thead th{font-size:13px;color:var(--mute);font-weight:500;border-bottom:1px solid var(--ink)}
.xg .ptab tbody th span{display:block;font-weight:500}
.xg .ptab tbody th small{display:block;font-size:13px;color:var(--mute)}
.xg .ptab td{white-space:nowrap}
.xg .ptab td:last-child,.xg .ptab th:last-child{padding-right:0}
@media (max-width:899px){
  .xg .pg{grid-template-columns:minmax(0,1fr);gap:18px}
  .xg .ptab thead{display:none}
  .xg .ptab,.xg .ptab tbody,.xg .ptab tr{display:block}
  .xg .ptab tr{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;padding:14px 0;border-bottom:1px solid var(--line)}
  .xg .ptab th,.xg .ptab td{display:block;padding:0;border:0}
  .xg .ptab tbody th{grid-column:1 / -1;font-size:17px}
  .xg .ptab td::before{content:attr(data-l);display:block;font-size:12px;color:var(--mute)}
  .xg .ptab td{white-space:normal}
}

/* ── 5 · the charging record: a plain full-bleed photo band with a flat tint ── */
.xg-charge{position:relative;min-height:620px;color:#fff;overflow:hidden;display:flex;align-items:center;padding:120px 0;background:var(--ink)}
.xg-charge .cbg{position:absolute;inset:0;overflow:hidden}
.xg-charge .cbg .par{position:absolute;inset:-10% 0}
.xg-charge .cbg img{width:100%;height:100%;object-fit:cover;object-position:50% 60%}
.xg-charge .cshade{position:absolute;inset:0;background:rgba(15,19,22,.66)}
.xg-charge .cgrid2{position:relative;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px;align-items:center;width:100%}
.xg-charge .cnum .big{font-size:clamp(88px,13vw,200px);font-weight:500;letter-spacing:-.06em;line-height:.9;color:var(--g)}
.xg-charge .cnum .small{font-size:16px;color:rgba(255,255,255,.82);margin-top:14px}
.xg-charge h2{font-size:clamp(32px,3.6vw,54px)}
.xg-charge .ctext p{max-width:54ch;color:rgba(255,255,255,.86);margin:20px 0 26px}
@media (max-width:899px){.xg-charge{min-height:0;padding:96px 0}.xg-charge .cgrid2{grid-template-columns:minmax(0,1fr);gap:28px}}

/* ── 6 · ways: photo strip and three rows ── */
.xg-ways{padding:var(--sec) 0;background:var(--paper)}
.xg-ways .wphoto{margin:36px 0 0}
.xg-ways .wphoto figcaption{font-size:13.5px;color:var(--mute);margin-top:12px}
.xg-ways .wrows{margin-top:44px;border-top:2px solid var(--ink)}
.xg .wrow{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,6fr) auto;gap:24px;align-items:center;padding:30px 0;border-bottom:1px solid var(--line)}
.xg .wrow h3{font-size:clamp(24px,2.4vw,36px);line-height:1.05;letter-spacing:-.035em}
.xg .wrow p{color:var(--mute);max-width:50ch}
.xg .wgo{width:46px;height:46px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;transition:background-color .3s var(--ease),box-shadow .3s var(--ease)}
@media (hover:hover){.xg .wrow:hover .wgo{background:var(--g);box-shadow:none}.xg .wrow:hover h3{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
@media (max-width:899px){.xg .wrow{grid-template-columns:minmax(0,1fr);gap:8px;padding:24px 0}.xg .wgo{display:none}}

/* ── 7 · news ── */
.xg-news{padding:var(--sec) 0;background:var(--stone)}
.xg-news .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:34px;flex-wrap:wrap}
.xg .ngrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px 24px}
.xg .npost{display:block}
.xg .npost .ph{aspect-ratio:16 / 10;border-radius:6px;overflow:hidden;background:#DCE1E1}
.xg .npost .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.xg .npost .ph.big{display:grid;place-items:center;background:var(--ink);color:var(--g)}
.xg .npost .ph.big span{font-size:clamp(52px,6vw,92px);font-weight:500;letter-spacing:-.05em}
@media (hover:hover){.xg .npost:hover .ph img{transform:scale(1.035)}.xg .npost:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.xg .npost .meta{margin-top:16px;font-size:13.5px;color:var(--mute)}
.xg .npost h3{font-size:clamp(20px,1.7vw,24px);line-height:1.15;margin-top:4px}
.xg .npost .ex{color:var(--mute);font-size:15px;margin-top:8px}
@media (max-width:1099px){.xg .ngrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){.xg .ngrid{grid-template-columns:minmax(0,1fr);gap:32px}}

/* ── models page, detail extras ── */
.xg .mgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (max-width:639px){.xg .mgrid{grid-template-columns:minmax(0,1fr)}}
.xg-detail .dcol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px;margin-top:var(--sec)}
.xg .clist li{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;padding:14px 0;border-bottom:1px solid var(--line)}
.xg .clist li:first-child{border-top:1px solid var(--line)}
.xg .clist li b{font-weight:500}
.xg .clist li small{flex-basis:100%;color:var(--mute);font-size:13.5px}
@media (max-width:899px){.xg-detail .dcol{grid-template-columns:minmax(0,1fr);gap:36px}}

/* ── planner ── */
.xg-planner .pgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.xg-planner .pctl{display:grid;gap:22px}
.xg-planner .rpick{margin-top:0}
.xg .frost{display:grid;gap:8px}
.xg .frost > span{font-size:14px;font-weight:500}
.xg .frost input[type=range]{width:100%;accent-color:var(--deep);min-height:44px}
.xg .frost small{font-size:13px;color:var(--mute)}
.xg .presult{padding:22px;border-radius:6px;background:var(--stone)}
.xg .presult .big{font-size:clamp(36px,3.6vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1}
.xg .presult .big span{font-size:.38em;letter-spacing:0;color:var(--mute);font-weight:400}
.xg .presult .mins{margin-top:10px;font-weight:500}
.xg .presult .sub{font-size:14px;color:var(--mute);margin-top:6px}
.xg .presult.bad .big{font-size:clamp(26px,2.4vw,34px);color:#B3261E}
.xg .legs{border-top:2px solid var(--ink)}
.xg .legs li{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;padding:14px 0;border-bottom:1px solid var(--line);align-items:baseline}
.xg .legs .n{font-size:13.5px;color:var(--mute)}
.xg .legs .w b{font-weight:500}
.xg .legs small{display:block;font-size:13px;color:var(--mute)}
.xg .legs .d{text-align:right;font-weight:500}
.xg .pmap{background:var(--ink);border-radius:6px;padding:22px;margin:0;color:#fff}
.xg-planner .pright{display:grid;gap:18px;position:sticky;top:96px}
.xg-planner .pnotes{margin-top:var(--sec);max-width:780px}
@media (max-width:899px){.xg-planner .pgrid{grid-template-columns:minmax(0,1fr);gap:28px}.xg-planner .pright{position:static;order:-1}}


/* ── Hringvegurinn: two-layer map, battery chart, planner extras ── */
.xg .rmap-box{position:relative}
.xg .rmap-live{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.xg .rmap-live .stop{pointer-events:auto}
.xg .rmap-svg .unk{fill:none;stroke:rgba(255,255,255,.6);stroke-width:1.8}
.xg .rmap-svg .stop.hot .dot{stroke:#fff}
.xg .rmap-svg .stop.hot .halo{transform:scale(1.5)!important;fill:rgba(24,237,127,.32)}
.xg .soc{display:block;width:100%;height:auto;overflow:visible}
.xg .soc .gl{stroke:rgba(255,255,255,.2);stroke-width:1.4;stroke-dasharray:3 7}
.xg .soc .gl.res{stroke:rgba(255,179,107,.6)}
.xg .soc .gt{fill:rgba(255,255,255,.7);font:500 15px 'XgF',system-ui,sans-serif}
.xg .soc .soc1{fill:none;stroke:url(#xgGrad);stroke-width:3.4;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
.xg .soc .soc1.bad{stroke:#FFB36B}
.xg .soc .sd{fill:var(--ink);stroke:var(--g);stroke-width:2.6;opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.6);transition:transform .45s var(--ease),opacity .3s var(--ease)}
.xg .soc .sd[data-on="1"]{opacity:1;transform:none}
.xg .soc .sdot circle{fill:#fff;stroke:var(--g);stroke-width:3}
.xg .soc .stuck circle{fill:#FFB36B}
.xg .soc .stuck text{fill:#FFB36B;font:600 15px 'XgF',system-ui,sans-serif}
.xg-ring .socbox{margin-top:22px;max-width:460px}
.xg-ring .socnote{font-size:13px;color:rgba(255,255,255,.72);margin-top:4px}
.xg-ring .socnote span{color:var(--g);font-weight:600}
.xg .chk{display:flex;gap:12px;align-items:flex-start;font-size:14.5px;line-height:1.45;min-height:44px;cursor:pointer}
.xg .chk input{width:22px;height:22px;flex:none;margin-top:1px;accent-color:var(--deep)}
.xg .legs li{border-radius:4px;transition:background-color .25s var(--ease)}
.xg .legs li.hot{background:var(--stone)}
.xg .legs li:focus-visible{outline-offset:-2px}
.xg-planner .psoc{padding:18px 22px}
@media (prefers-reduced-motion:reduce){.xg .soc .soc1{stroke-dashoffset:0!important}.xg .soc .sd{opacity:1!important;transform:none!important}}

/* ── header: Una + XPENG marks ── */
.xg .row .logo{display:flex;align-items:center;gap:14px}
.xg .row .logo > img{height:26px;width:auto}
.xg .row .logo .xp{display:flex;align-items:center;padding-left:14px;border-left:1px solid currentColor}
.xg .row .logo .xp img{height:12px;width:auto}
.xg .plate.base .xp img{filter:invert(1)}
@media (max-width:639px){.xg .row .logo .xp{display:none}}

@media (prefers-reduced-motion:reduce){
  .xg .rmap-svg .road1{stroke-dashoffset:0!important}
  .xg .rmap-svg .stop .halo,.xg .rmap-svg .stop .dot,.xg .rmap-svg .stop .sn,.xg .rmap-svg .stop .sl{opacity:1!important;transform:none!important}
}

.xg-statement{position:relative;background:linear-gradient(100deg,#18ED7F 0%,#1FDDA0 55%,#2BCBB6 100%);color:var(--ink);padding:clamp(80px,9vw,128px) 0;will-change:clip-path}
.xg-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.xg-statement h2{font-size:clamp(44px,6.6vw,96px);line-height:.98;letter-spacing:-.04em}
.xg-statement h2 span{display:block}
.xg-statement p{max-width:600px;margin:28px auto 0;font-size:17px}
.xg-statement .ctas{display:flex;justify-content:center;gap:10px;margin-top:32px;flex-wrap:wrap}

/* ── 6 · service rows + finance ── */
.xg-serv{padding:var(--sec) 0;background:var(--stone)}
.xg-serv .sgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.xg-serv .sintro p{color:var(--mute);margin:20px 0 26px;max-width:44ch}
.xg .rows{border-bottom:1px solid rgba(15,19,22,.12)}
.xg .r{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:16px 24px;align-items:center;padding:20px 0;border-top:1px solid rgba(15,19,22,.12)}
.xg .r h3{font-size:19px;line-height:1.2}
.xg .r .sub{font-size:13.5px;color:var(--mute);margin-top:2px}
.xg .r .tel{font-size:17px;font-weight:500;width:max-content}
@media (hover:hover){.xg .r .tel:hover{text-decoration:underline;text-underline-offset:3px}}
.xg .r .role{font-size:14px;color:var(--mute)}
@media (max-width:767px){.xg .r{grid-template-columns:1fr auto;gap:4px 16px}.xg .r .role{grid-column:1 / -1}}
.xg-serv .sphoto{grid-column:1 / -1;margin-top:40px}
@media (max-width:899px){.xg-serv .sgrid{grid-template-columns:minmax(0,1fr);gap:28px}}

/* ── 7 · test drive band (Spyker signup) ── */
.xg-drive{position:relative;min-height:720px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:160px 0 96px}
.xg-drive .dbg{position:absolute;inset:0;overflow:hidden}
.xg-drive .dbg .par{position:absolute;inset:-10% 0}
.xg-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 55%}
.xg-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(15,19,22,.9) 0%,rgba(15,19,22,.5) 45%,rgba(15,19,22,.15) 100%)}
.xg-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.xg-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.84);margin-top:18px}
.xg-drive .dcard{padding:28px;border-radius:8px;background:rgba(15,19,22,.6);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);display:grid;gap:16px}
.xg-drive .dcard p{font-size:15px;color:rgba(255,255,255,.84)}
.xg-drive .dcard .two{display:flex;gap:10px;flex-wrap:wrap}
@media (max-width:899px){.xg-drive{min-height:0;padding:140px 0 110px}.xg-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:32px}}

/* ── route pages ── */
.xg-page{padding:calc(132px + env(safe-area-inset-top)) 0 var(--sec)}
.xg-page .intro{max-width:760px;margin-bottom:48px}
.xg-page .intro .lede{margin-top:18px}
.xg .crumb{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--mute);margin-bottom:22px}
@media (hover:hover){.xg .crumb:hover{color:var(--ink)}}
@media (max-width:899px){.xg-page{padding-top:calc(104px + env(safe-area-inset-top))}}

/* detail 4/8 */
.xg-detail .dhead{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:40px;align-items:end;margin-bottom:40px}
.xg-detail .dhead h1{font-size:clamp(36px,4.2vw,66px)}
.xg-detail .price{font-size:clamp(24px,2.2vw,32px);font-weight:500;letter-spacing:-.03em;margin-top:18px}
.xg-detail .price small{display:block;font-size:14px;font-weight:400;color:var(--mute);letter-spacing:0;margin-top:4px}
.xg-detail .dact{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
.xg-detail .dmain{border-radius:6px}
.xg-detail .specs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin:48px 0}
.xg-detail .specs div{padding-top:16px;border-top:1px solid var(--line)}
.xg-detail .specs dt{font-size:13px;color:var(--mute)}
.xg-detail .specs dd{font-size:clamp(20px,1.8vw,26px);font-weight:500;letter-spacing:-.03em;margin-top:6px;line-height:1.15}
.xg-detail .dbody{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.xg-detail .facts li{display:flex;gap:14px;padding:14px 0;border-top:1px solid var(--line);font-size:16px}
.xg-detail .facts li::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--g);flex:none;margin-top:9px}
.xg-detail .facts li:last-child{border-bottom:1px solid var(--line)}
.xg-detail .gal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.xg-detail .gal .frame:first-child{grid-column:1 / -1}
.xg-detail .src{font-size:13px;color:var(--mute);margin-top:18px}
.xg-detail .src a{text-decoration:underline;text-underline-offset:3px}
.xg-detail .more{margin-top:var(--sec)}
@media (max-width:899px){
  .xg-detail .dhead,.xg-detail .dbody{grid-template-columns:minmax(0,1fr);gap:24px}
  .xg-detail .specs{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:32px 0}
}

/* forms (booking, fleet, contact) */
.xg .form{display:grid;gap:18px;max-width:640px}
.xg .form .two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.xg .form label > span,.xg .form fieldset legend{display:block;font-size:13.5px;font-weight:500;margin-bottom:6px;color:var(--ink)}
.xg .form input,.xg .form select,.xg .form textarea{width:100%;min-height:48px;padding:10px 14px;border:1px solid rgba(15,19,22,.28);border-radius:4px;background:#fff;color:var(--ink);font:16px 'XgF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .2s,box-shadow .2s}
.xg .form textarea{min-height:120px;resize:vertical}
.xg .form select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.xg .form input:focus,.xg .form select:focus,.xg .form textarea:focus{border-color:var(--deep);box-shadow:0 0 0 3px rgba(24,109,239,.22)}
.xg .form input[aria-invalid="true"]{border-color:#B3261E}
.xg .form .err{font-size:13px;color:#B3261E;margin-top:6px}
.xg .form fieldset{border:0;padding:0;margin:0;min-width:0}
.xg .form .opts{display:flex;gap:8px;flex-wrap:wrap}
.xg .form .opt{position:relative}
.xg .form .opt input{position:absolute;opacity:0;inset:0;min-height:0;width:100%;height:100%;cursor:pointer}
.xg .form .opt span{display:inline-flex;align-items:center;min-height:42px;padding:0 16px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(15,19,22,.24);font-size:14.5px;font-weight:500;transition:background-color .2s,box-shadow .2s}
.xg .form .opt input:checked + span{background:var(--g);box-shadow:none}
.xg .form .opt input:focus-visible + span{outline:2px solid var(--deep);outline-offset:2px}
.xg .form .opt input:disabled + span{opacity:.4}
.xg .form .note{font-size:13.5px;color:var(--mute)}
.xg .form .acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px}
.xg .steps{display:flex;gap:6px;margin-bottom:28px;font-size:13.5px;color:var(--mute)}
.xg .steps span{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:var(--stone)}
.xg .steps span[aria-current="step"]{background:var(--ink);color:#fff}
.xg .done{padding:28px;border-radius:6px;background:var(--stone);max-width:640px}
.xg .done h2{font-size:clamp(26px,2.6vw,36px)}
.xg .done dl{margin:20px 0;display:grid;gap:8px}
.xg .done dl div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-top:1px solid var(--line);font-size:15px}
.xg .done dt{color:var(--mute)}
.xg .done .id{font-weight:500}
.xg .done .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.xg .proto-note{font-size:13px;color:var(--mute);margin-top:14px}
.xg .book-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:start}
.xg .aside{background:var(--stone);border-radius:6px;padding:26px;display:grid;gap:12px;font-size:15px}
.xg .aside h3{font-size:18px}
.xg .aside p{color:var(--mute)}
.xg .aside .frame{margin-top:8px}
@media (max-width:899px){.xg .book-grid{grid-template-columns:minmax(0,1fr);gap:28px}.xg .form .two{grid-template-columns:minmax(0,1fr)}}

/* staff list + contact */
.xg-contact .cgrid{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:48px;align-items:start}
.xg .people{display:grid;gap:0}
.xg .people h3{font-size:14px;color:var(--mute);font-weight:500;margin:28px 0 8px}
.xg .people h3:first-child{margin-top:0}
.xg .person{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:12px 0;border-top:1px solid var(--line);align-items:center}
.xg .person b{font-weight:500;font-size:16px}
.xg .person span{font-size:13.5px;color:var(--mute);grid-column:1}
.xg .person a{grid-column:2;grid-row:1 / 3;font-size:14.5px;font-weight:500;display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);white-space:nowrap}
@media (hover:hover){.xg .person a:hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.xg .where{display:grid;gap:10px;margin-top:40px;padding:24px;background:var(--stone);border-radius:6px;font-size:15px}
.xg .where strong{font-weight:500}
.xg .where dl div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-top:1px solid var(--line)}
.xg .where dt{color:var(--mute)}
@media (max-width:899px){.xg-contact .cgrid{grid-template-columns:minmax(0,1fr);gap:36px}.xg .person a{font-size:13px;padding:0 10px}}

/* staff-side preview */
.xg-inbox{padding-top:calc(120px + env(safe-area-inset-top))}
.xg-inbox .ibar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 18px;border-radius:6px;background:var(--slate);color:#fff;margin-bottom:32px;font-size:14px}
.xg-inbox .ibar b{font-weight:500}
.xg-inbox table{width:100%;border-collapse:collapse;font-size:15px}
.xg-inbox th{text-align:left;font-weight:500;font-size:13px;color:var(--mute);padding:0 12px 10px 0;border-bottom:1px solid var(--ink)}
.xg-inbox td{padding:14px 12px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.xg-inbox td:first-child{font-weight:500;white-space:nowrap}
.xg-inbox .kind{display:inline-flex;align-items:center;min-height:26px;padding:0 10px;border-radius:999px;background:var(--stone);font-size:13px;white-space:nowrap}
.xg-inbox .st{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:500}
.xg-inbox .st i{width:7px;height:7px;border-radius:50%;background:var(--g)}
.xg-inbox .st.new i{background:#D8A200}
.xg-inbox .ia{display:flex;gap:6px;flex-wrap:wrap}
.xg-inbox .ia button{min-height:36px;padding:0 12px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--line);font-size:13.5px;font-weight:500}
.xg-inbox .ia button:first-child{background:var(--deep);color:#fff;box-shadow:none}
.xg-inbox .inote{font-size:13.5px;color:var(--mute);margin-top:20px;max-width:80ch}
@media (max-width:899px){
  .xg-inbox table,.xg-inbox tbody,.xg-inbox tr,.xg-inbox td{display:block}
  .xg-inbox thead{display:none}
  .xg-inbox tr{padding:16px 0;border-bottom:1px solid var(--line)}
  .xg-inbox td{padding:3px 0;border:0}
}

/* ── footer ── */
.xg-foot{background:var(--slate);color:#fff;padding:96px 0 44px}
.xg-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .9fr;gap:48px;align-items:start}
.xg-foot .fbrand img{width:clamp(150px,14vw,210px);height:auto}
.xg-foot .fbrand p{margin-top:18px;font-size:15px;color:rgba(255,255,255,.78);max-width:36ch}
.xg-foot .fnav{display:flex;flex-direction:column;gap:2px}
.xg-foot .fnav a{font-size:clamp(22px,2vw,30px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.xg-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.xg-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end;text-align:right}
.xg-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.xg-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.xg-foot .fside .brands{font-size:13px;color:rgba(255,255,255,.7);margin-top:12px;max-width:32ch}
.xg-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:72px;padding-top:24px;border-top:1px solid rgba(255,255,255,.16);font-size:13px;color:rgba(255,255,255,.72)}
.xg-foot .flegal a{text-decoration:underline;text-underline-offset:3px}
.xg-foot .credit{display:flex;align-items:center;gap:14px;font-size:15px;color:rgba(255,255,255,.9);zoom:1.3}
.xg-foot .credit a{text-decoration:none}
.xg-foot .credit a span{opacity:1!important}
@media (max-width:899px){.xg-foot .credit{margin-top:6px}}
.xg-foot .proto{font-size:12px;line-height:1.6;color:rgba(255,255,255,.62);margin-top:20px}
@media (max-width:899px){
  .xg-foot{padding:72px 0 calc(110px + env(safe-area-inset-bottom))}
  .xg-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .xg-foot .fside{align-items:flex-start;text-align:left}
  .xg-foot .flegal{margin-top:48px}
}

/* ── mobile sticky CTA (the SNDR fixed bar) ── */
.xg-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(15,19,22,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.xg-sticky a,.xg-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.xg-sticky a:nth-child(2){background:var(--g);color:var(--ink)}
@media (max-width:899px){.xg-sticky{display:grid}}
.xg[data-sticky="1"] .xg-sticky{transform:none}
.xg.menu-open .xg-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Vatt's colours ── */
.xg sndr-chat{--chat-accent:${DEEP};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#5A646B;--chat-line:#DDE1E2;--chat-sunk:#EFF1F1;--chat-radius:14px;--chat-font:'XgF',system-ui,sans-serif}
@media (max-width:899px){.xg sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .xg *,.xg *::before,.xg *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .xg-statement{clip-path:none!important}
}
`
