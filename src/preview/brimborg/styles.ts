/*
 * Brimborg: the whole visual system, transplanted from Bílabúð Benna by way of ÍSBAND and
 * Íslyft. Tokens in DESIGN.md. One family: Host Grotesk, set tight and in sentence case.
 * Colour: ink, white, stone and one teal, the #00B6AD sampled from Brimborg's own mark.
 * Teal is too light for white text (2.5:1), so every teal surface carries INK text (8:1),
 * the way Benni's yellow did.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0C0C0B'
export const TEAL = '#00B6AD'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'BbF';src:url('${B}fonts/brimborg/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'BbF';src:url('${B}fonts/brimborg/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'BbF';src:url('${B}fonts/brimborg/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:${INK}}
html.bb-menu,html.bb-menu body{overflow:hidden}

.bb{--ink:${INK};--paper:#FFFFFF;--stone:#F3F2EE;--line:#E6E5E0;--mute:#62625C;--r:${TEAL};--on-r:${INK};--rd:#009F96;--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(96px,11vw,168px);
  font-family:'BbF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal;font-feature-settings:'ss01' 0}
.bb *{box-sizing:border-box}
.bb a{color:inherit;text-decoration:none}
.bb p,.bb h1,.bb h2,.bb h3,.bb figure,.bb ul,.bb ol,.bb dl,.bb dd{margin:0}
.bb ul,.bb ol{padding:0;list-style:none}
.bb img{display:block;max-width:100%}
.bb button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.bb a,.bb button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.bb :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px}
.bb .bb-hero :focus-visible,.bb .bb-split :focus-visible,.bb .bb-drive :focus-visible,
.bb .bar :focus-visible,.bb .bb-menu-panel :focus-visible,.bb .bb-sticky :focus-visible,.bb .plate.top .kf{outline:2px solid var(--r);outline-offset:3px}
.bb .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.bb .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--r);color:var(--on-r);padding:12px 18px;border-radius:4px;font-weight:600}
.bb .skip:focus{top:16px}
.bb section[id]{scroll-margin-top:84px}
.bb .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bb .tab,.bb .up,.bb .tel,.bb .pr{font-variant-numeric:tabular-nums}

/* ── type ── */
.bb h1,.bb h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.bb h2{font-size:clamp(38px,4.3vw,64px)}
.bb h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.bb [data-chars] .ch-mask{padding:.16em .04em .1em;margin:-.16em -.04em -.1em}
.bb .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:20px;font-size:14px;font-weight:500;line-height:1.2;letter-spacing:-.005em;color:var(--mute)}
.bb .eyebrow i{width:5px;height:5px;border-radius:50%;background:var(--ink);flex:none}
.bb .center{text-align:center}
.bb .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label, Drivehub's plain shape ── */
.bb .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease)}
.bb .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.bb .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.bb .btn-light{background:#fff;color:var(--ink)}
.bb .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.bb .btn-dark{background:var(--ink);color:#fff}
.bb .btn-red{background:var(--r);color:var(--on-r)}
.bb .btn-line{box-shadow:inset 0 0 0 1px rgba(12,12,11,.22);color:var(--ink)}
@media (hover:hover){
  .bb .btn:hover .c{transform:translateY(-1.35em)}
  .bb .btn-light:hover{background:var(--r);color:var(--on-r)}
  .bb .btn-red:hover{background:var(--rd)}
  .bb .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .bb .btn-dark:hover{background:#2A2A27}
  .bb .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
}

/* ── loader: the mark opens, a real progress count, one teal edge that leads the lift ── */
.bb-loader{position:fixed;inset:0;z-index:250;background:${INK};color:#fff;display:grid;grid-template-rows:1fr auto 1fr;justify-items:center;overflow:hidden}
.bb-loader .mk{grid-row:2;display:grid;justify-items:center;gap:22px}
.bb-loader .mk img{width:min(56vw,340px);height:auto}
.bb-loader .yr{font-size:15px;font-weight:500;letter-spacing:-.01em;color:rgba(255,255,255,.72)}
.bb-loader .ld-foot{position:absolute;left:var(--pad);right:var(--pad);bottom:calc(30px + env(safe-area-inset-bottom));display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.bb-loader .pct{font-size:clamp(76px,13vw,184px);font-weight:500;letter-spacing:-.065em;line-height:.78;font-variant-numeric:tabular-nums}
.bb-loader .pct small{font-size:.2em;color:var(--r);margin-left:.18em;letter-spacing:0;vertical-align:top;line-height:1}
.bb-loader .note{font-size:13.5px;line-height:1.45;color:rgba(255,255,255,.62);text-align:right;max-width:230px}
.bb-loader .bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.12)}
.bb-loader .bar i{display:block;height:100%;background:var(--r);transform-origin:left center;transform:scaleX(0)}

/* ── chrome ── */
.bb-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);translate:0 var(--iy,0px);transition:transform .55s var(--ease)}
.bb-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:${INK};z-index:3}
.bb-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.bb-chrome .bar,.bb-chrome .hdr{transform:translateY(var(--bar,0px))}
.bb .bar{height:38px;background:${INK};color:rgba(255,255,255,.74);font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.07)}
.bb .bar .in{display:flex;align-items:center;gap:28px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bb .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.bb .bar a:hover{color:#fff}}
.bb .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.bb .bar .st i{width:6px;height:6px;border-radius:50%;background:#77776F}
.bb .bar .st.on i{background:var(--r)}
.bb .hdr{position:relative;height:74px}
.bb .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.bb .plate.base{color:var(--ink)}
.bb .plate.top{color:#fff}
.bb-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.88);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(12,12,11,.07)}
.bb-chrome[data-solid="1"] .plate.top{background:rgba(12,12,11,.78);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.bb .row{display:flex;align-items:center;gap:28px;height:74px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bb .row .logo{display:block;flex:none}
.bb .row .logo img{height:38px;width:auto}
.bb .row .links{display:flex;gap:32px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.bb .row .nl{position:relative;padding:6px 0}
.bb .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
@media (hover:hover){.bb .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.bb .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.bb .row .links + .acts{margin-left:0}
.bb .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.bb .plate.base .pill{background:var(--ink);color:#fff}
.bb .plate.top .pill{background:#fff;color:var(--ink)}
@media (hover:hover){.bb .plate .pill:hover{background:var(--r);color:var(--on-r)}}
.bb .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1100px){.bb .row .links{gap:22px;font-size:14px}}
@media (max-width:1023px){
  .bb .row .links{display:none}
  .bb .row .burger{display:grid}
  .bb .row .links + .acts{margin-left:auto}
  .bb .row .logo img{height:34px}
}
@media (max-width:639px){
  .bb .row .pill{display:none}
  .bb .bar .hide-s{display:none}
  .bb .row{gap:12px}
}

/* ── menu ── */
.bb-menu-panel{position:fixed;inset:0;z-index:120;background:${INK};color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.bb-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.bb-menu-panel .mtop img{height:38px;width:auto}
.bb-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.bb-menu-panel nav{display:flex;flex-direction:column;margin-top:40px}
.bb-menu-panel nav a{font-size:clamp(34px,9.4vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1.18;padding:4px 0}
.bb-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.bb-menu-panel .mfoot a,.bb-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.bb-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:#fff}
.bb-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── 1 · hero ── */
.bb-hero{position:relative;height:100svh;min-height:640px;background:var(--paper)}
.bb-hero .hframe{position:absolute;inset:0;overflow:hidden;background:#15181B;color:#fff;will-change:transform}
.bb-hero .hpar{position:absolute;inset:0 0 -18% 0}
.bb-hero .hpic{width:100%;height:100%;object-fit:cover;object-position:60% 52%}
.bb-hero .shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(8,10,12,.74) 0%,rgba(8,10,12,.44) 34%,rgba(8,10,12,0) 60%),
  linear-gradient(0deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 40%),
  linear-gradient(180deg,rgba(8,10,12,.5) 0%,rgba(8,10,12,0) 22%)}
.bb-hero .copy{position:absolute;left:0;bottom:clamp(72px,12vh,140px);width:min(46%,660px);padding-left:var(--pad)}
.bb-hero .eyebrow{color:rgba(255,255,255,.78)}
.bb-hero h1{font-size:clamp(46px,5.2vw,84px)}
.bb-hero h1 span{display:block}
.bb-hero .lede{max-width:420px;margin-top:22px;font-size:17px;line-height:1.55;color:rgba(255,255,255,.82)}
.bb-hero .ctas{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
.bb-hero .hprice{margin-top:26px}
.bb-hero .hprice .hl{display:inline-flex;align-items:center;gap:10px;font-size:13.5px;font-weight:500;color:rgba(255,255,255,.82)}
.bb-hero .hprice .hl i{width:7px;height:7px;border-radius:50%;background:var(--r);box-shadow:0 0 0 4px rgba(0,182,173,.28)}
.bb-hero .hprice .num{display:flex;align-items:flex-end;margin-top:8px;font-size:clamp(36px,3.8vw,60px);font-weight:500;letter-spacing:-.05em}
.bb-hero .hprice .cur{font-size:.46em;margin-left:.4em;color:var(--r);letter-spacing:-.01em}
.bb-hero .hmeta{position:absolute;left:var(--pad);bottom:clamp(24px,4vh,40px);font-size:12.5px;color:rgba(255,255,255,.6)}
@media (max-width:899px){
  .bb-hero .hpar{inset:0 0 30% 0}
  .bb-hero .hpic{object-position:74% 58%}
  .bb-hero .shade{background:linear-gradient(0deg,#15181B 0%,#15181B 38%,rgba(21,24,27,.6) 52%,rgba(21,24,27,0) 66%),linear-gradient(180deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 24%)}
  .bb-hero .copy{left:0;right:0;width:auto;padding-inline:var(--pad);bottom:calc(104px + env(safe-area-inset-bottom))}
  .bb-hero h1{font-size:clamp(40px,11.4vw,58px)}
  .bb-hero .lede{display:none}
  .bb-hero .hprice{margin-top:18px}
  .bb-hero .ctas{margin-top:24px}
  .bb-hero .hmeta{bottom:calc(82px + env(safe-area-inset-bottom));font-size:12px}
}

/* ── frames (media reveal + inner parallax) ── */
.bb .frame{position:relative;overflow:hidden;background:#E4E3DD}
.bb .frame .par{position:absolute;inset:-10% 0}
.bb .frame img{width:100%;height:100%;object-fit:cover}
.bb .frame .still-photo{position:absolute;inset:0}
.bb .frame.whole-photo img{object-fit:contain}

/* ── section heads with arrows ── */
.bb .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:48px}
.bb .arrows{display:flex;gap:8px;flex:none}
.bb .arrows button{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,opacity .25s}
@media (hover:hover){.bb .arrows button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.bb .arrows button:disabled{opacity:.3;cursor:default}
.bb .rail{display:grid;grid-auto-flow:column;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;
  padding-inline:var(--pad);scroll-padding-inline:var(--pad);scrollbar-width:none;-ms-overflow-style:none;cursor:grab}
.bb .rail::-webkit-scrollbar{display:none}
.bb .rail.drag{scroll-snap-type:none;cursor:grabbing;user-select:none}
.bb .rail.drag a{pointer-events:none}
@media (max-width:767px){.bb .head .arrows{display:none}}

/* ── 2 · categories ── */
.bb-cats{padding:var(--sec) 0 calc(var(--sec) * .72)}
.bb-cats .rail{grid-auto-columns:clamp(260px,28.6vw,440px)}
.bb-cats .cat{position:relative;display:block;aspect-ratio:1 / 1.08;border-radius:8px;overflow:hidden;color:#fff;scroll-snap-align:start;isolation:isolate}
.bb-cats .cph{position:absolute;inset:0;border-radius:inherit}
.bb-cats .cshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,0) 38%)}
.bb-cats .clab{position:absolute;left:22px;bottom:20px;font-size:21px;font-weight:500;letter-spacing:-.025em}
.bb-cats .cgo{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;transition:transform .5s var(--ease),background-color .3s}
@media (hover:hover){.bb-cats .cat:hover .cgo{transform:rotate(45deg);background:var(--r)}}
@media (max-width:767px){.bb-cats .rail{grid-auto-columns:76vw}}

/* ── 3 · rafmagn | tengiltvinn ── */
.bb-split{--x:50%;position:relative;height:clamp(640px,100svh,940px);overflow:hidden;color:#fff;background:#0E1012;touch-action:pan-y;user-select:none}
.bb-split .side{position:absolute;inset:0}
.bb-split .side.jr{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.bb-split .sbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.bb-split .jr .sbg{object-position:6% 56%}
.bb-split .lp .sbg{object-position:100% 56%}
.bb-split .sshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.78) 0%,rgba(8,10,12,.2) 40%,rgba(8,10,12,0) 60%),linear-gradient(180deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,.1) 30%,rgba(8,10,12,0) 45%)}
.bb-split .sbody{position:absolute;bottom:clamp(96px,12vh,128px);width:min(560px,40vw)}
.bb-split .scopy{position:absolute;inset:0;pointer-events:none}
.bb-split .sbody.jr{left:var(--pad)}
.bb-split .sbody.lp{right:var(--pad);text-align:right}
.bb-split .sbody[hidden]{display:none}
.bb-split .sbody .slink{pointer-events:auto}
.bb-split .sname{font-size:clamp(56px,7vw,116px);font-weight:500;letter-spacing:-.05em;line-height:.9}
.bb-split .sname.two{font-size:clamp(52px,6.2vw,104px)}
.bb-split .sname.two span{font-weight:400;opacity:.62}
.bb-split .ssub{font-size:15px;line-height:1.5;color:rgba(255,255,255,.82);margin:16px 0 16px}
.bb-split .slink{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:500;color:#fff;border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:2px}
@media (hover:hover){.bb-split .slink:hover{border-color:#fff}}
.bb-split .stitle{position:absolute;top:clamp(124px,15vh,170px);left:0;right:0;text-align:center;pointer-events:none;padding-inline:var(--pad)}
.bb-split .stitle .eyebrow{justify-content:center;color:rgba(255,255,255,.78)}
.bb-split .stitle h2{font-size:clamp(40px,4.6vw,72px)}
.bb-split .divider{position:absolute;top:0;bottom:0;left:var(--x);width:1px;background:rgba(255,255,255,.8);transform:translateX(-.5px);pointer-events:none}
.bb-split .handle{position:absolute;top:58%;left:var(--x);transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:var(--r);color:var(--on-r);
  display:flex;align-items:center;justify-content:center;cursor:ew-resize;touch-action:none;box-shadow:0 10px 34px rgba(0,0,0,.35);transition:transform .35s var(--ease)}
@media (hover:hover){.bb-split .handle:hover{transform:translate(-50%,-50%) scale(1.08)}}
.bb-split .stabs{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;display:none;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.bb-split .stabs button{min-height:40px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;color:#fff;white-space:nowrap}
@media (hover:none),(max-width:899px){.bb-split .stabs{display:flex}}
@media (max-width:899px){
  .bb-split{height:max(620px,90svh)}
  .bb-split .stabs{bottom:calc(90px + env(safe-area-inset-bottom))}
  .bb-split .sbody{width:calc(50% - var(--pad) - 28px);bottom:calc(178px + env(safe-area-inset-bottom))}
  .bb-split .sname{font-size:clamp(26px,7.2vw,56px)}
  .bb-split .sname.two{font-size:clamp(26px,7.2vw,56px)}
  .bb-split .ssub{font-size:12px;margin:12px 0 0}
  .bb-split .slink{margin-top:12px;font-size:14px}
  .bb-split .stitle{top:calc(100px + env(safe-area-inset-top))}
  .bb-split .stitle h2{font-size:clamp(34px,9.6vw,48px)}
  .bb-split .jr .sbg{object-position:10% 56%}
  .bb-split .lp .sbg{object-position:100% 56%}
}

/* ── 4 · featured ── */
.bb-feat{padding:var(--sec) 0;background:var(--stone)}
.bb-feat .filters{display:flex;justify-content:center;gap:28px;margin:30px 0 56px;flex-wrap:wrap}
.bb-feat .filters button{position:relative;min-height:40px;font-size:15px;font-weight:500;color:var(--mute);transition:color .25s}
.bb-feat .filters button::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1.5px;background:var(--ink);transform:scaleX(0);transition:transform .45s var(--ease)}
.bb-feat .filters button[aria-pressed="true"]{color:var(--ink)}
.bb-feat .filters button[aria-pressed="true"]::after{transform:scaleX(1)}
@media (hover:hover){.bb-feat .filters button:hover{color:var(--ink)}}
.bb-feat .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:56px 24px}
.bb-feat .car{display:block}
.bb-feat .ph{aspect-ratio:4 / 3;border-radius:8px;overflow:hidden;background:#E6E5DF}
.bb-feat .ph.studio{background:#fff}
.bb-feat .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.bb-feat .car:hover .ph img{transform:scale(1.035)}.bb-feat .car:hover .pr svg{transform:translate(2px,-2px)}}
.bb-feat .meta{display:flex;gap:10px;margin-top:18px;font-size:13.5px;color:var(--mute)}
.bb-feat .meta span:first-child{color:var(--ink);font-weight:500}
.bb-feat h3{font-size:clamp(24px,2vw,30px);line-height:1.1;margin-top:4px}
.bb-feat .pr{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:16px;font-weight:500}
.bb-feat .pr svg{transition:transform .4s var(--ease)}
.bb-feat .note{font-size:12.5px;color:var(--mute);margin-top:6px;line-height:1.5}
.bb-feat .fine{text-align:center;font-size:12.5px;color:var(--mute);margin-top:20px}
.bb-feat .loan{display:flex;justify-content:space-between;align-items:center;gap:16px 40px;flex-wrap:wrap;margin-top:72px;padding:22px 26px;border-radius:8px;background:#fff;font-size:15px}
.bb-feat .loan p{max-width:760px;color:var(--mute)}
.bb-feat .loan strong{color:var(--ink);font-weight:500}
.bb-feat .loan a{display:inline-flex;align-items:center;gap:6px;font-weight:500;border-bottom:1px solid rgba(12,12,11,.3);padding-bottom:2px;white-space:nowrap}
@media (hover:hover){.bb-feat .loan a:hover{border-color:var(--ink)}}
.bb-feat .filters button svg{vertical-align:-1px;margin-left:4px}
@media (max-width:1099px){.bb-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .bb-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 12px}
  .bb-feat .ph{border-radius:6px}
  .bb-feat .meta{margin-top:12px;font-size:12.5px}
  .bb-feat .meta span:last-child{display:none}
  .bb-feat h3{font-size:18px;line-height:1.15}
  .bb-feat .pr{font-size:14px;margin-top:6px}
  .bb-feat .pr svg{display:none}
  .bb-feat .note{font-size:11.5px;line-height:1.45}
  .bb-feat .loan{margin-top:48px;padding:18px}
  .bb-feat .filters{flex-wrap:nowrap;justify-content:flex-start;gap:22px;overflow-x:auto;margin:22px calc(var(--pad) * -1) 32px;padding-inline:var(--pad);scrollbar-width:none}
  .bb-feat .filters::-webkit-scrollbar{display:none}
  .bb-feat .filters button{flex:none}
}

/* ── 5 · used ── */
.bb-used{padding:var(--sec) 0 calc(var(--sec) * .8)}
.bb-used .rail{grid-auto-columns:clamp(260px,23.6vw,360px);gap:20px}
.bb-used .uc{display:block;scroll-snap-align:start}
.bb-used .uph{border-radius:8px}
.bb-used .um{margin-top:16px;font-size:13.5px;color:var(--mute)}
.bb-used h3{font-size:19px;line-height:1.3;margin-top:4px}
.bb-used .up{display:flex;gap:10px;align-items:baseline;margin-top:8px;font-size:16px;font-weight:500}
.bb-used .up s{font-size:13.5px;font-weight:400;color:var(--mute)}
@media (hover:hover){.bb-used .uc:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.bb-used .ufoot{display:flex;justify-content:space-between;align-items:center;gap:24px 48px;margin-top:56px;flex-wrap:wrap}
.bb-used .ufoot p{max-width:620px;font-size:14px;color:var(--mute)}
@media (max-width:767px){.bb-used .rail{grid-auto-columns:74vw}}

/* ── 6 · service collage ── */
.bb-serv{padding:var(--sec) 0 calc(var(--sec) * 1.1);background:#fff}
.bb-serv .collage{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;row-gap:96px;align-items:start}
.bb-serv .intro{grid-column:1 / 6;grid-row:1}
.bb-serv .intro p{color:rgba(12,12,11,.78);max-width:440px;margin:24px 0 28px}
.bb-serv .hrs{max-width:440px;margin-bottom:32px}
.bb-serv .hrs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid var(--line);font-size:15px}
.bb-serv .hrs dt{color:var(--mute)}
.bb-serv .hrs a{font-weight:500}
.bb-serv .f{margin:0}
.bb-serv .fa{grid-column:7 / 13;grid-row:1;margin-top:40px}
.bb-serv .fb{grid-column:1 / 7;grid-row:2}
.bb-serv .fd{grid-column:8 / 12;grid-row:2;align-self:start;margin-top:120px}
.bb-serv .fc{grid-column:4 / 9;grid-row:3}
.bb-serv .frame{border-radius:6px}
.bb-serv figcaption{font-size:13.5px;line-height:1.55;color:var(--mute);margin-top:14px;max-width:380px}
.bb-serv figcaption a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.bb-serv .sos{display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:240px;background:var(--r);color:var(--on-r);padding:28px;border-radius:6px;transition:transform .5s var(--ease)}
.bb-serv .sos .k{font-size:15px;font-weight:500;max-width:240px;line-height:1.4}
.bb-serv .sos .v{font-size:clamp(52px,5vw,80px);font-weight:500;line-height:.95;letter-spacing:-.045em}
@media (max-width:899px){
  .bb-serv .collage{grid-template-columns:minmax(0,1fr);row-gap:56px}
  .bb-serv .intro,.bb-serv .fa,.bb-serv .fb,.bb-serv .fc,.bb-serv .fd{grid-column:1;grid-row:auto;margin-top:0}
  .bb-serv .sos{min-height:200px}
}

/* ── 7 · statement, in Brimborg teal ── */
.bb-statement{position:relative;background:var(--r);color:var(--on-r);padding:clamp(96px,10vw,150px) 0 clamp(96px,11vw,160px);will-change:clip-path}
.bb-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.bb-statement .roman{font-size:14px;font-weight:600;letter-spacing:.18em;margin-bottom:28px;opacity:.86}
.bb-statement h2{font-size:clamp(52px,8.2vw,136px);line-height:.96;letter-spacing:-.05em}
.bb-statement h2 span{display:block}
.bb-statement p{max-width:600px;margin:32px auto 0;font-size:17px;color:var(--on-r)}
.bb-statement .spk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;max-width:900px;margin:48px auto 0;background:rgba(12,12,11,.24);border-radius:8px;overflow:hidden}
.bb-statement .spk a{display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;text-align:left;padding:18px 20px;background:var(--r);transition:background-color .3s var(--ease)}
.bb-statement .spk span:first-child{font-weight:500;font-size:16px}
.bb-statement .spk span:nth-child(2){grid-row:2;font-size:14px;opacity:.86}
.bb-statement .spk svg{grid-row:1 / 3;grid-column:2}
@media (hover:hover){.bb-statement .spk a:hover{background:var(--rd)}}
@media (max-width:767px){.bb-statement .spk{grid-template-columns:minmax(0,1fr)}}
.bb-statement .sfig{max-width:1080px;margin:80px auto 0;padding-inline:var(--pad)}
.bb-statement .frame{background:var(--rd);border-radius:6px}
.bb-statement figcaption{text-align:center;font-size:13px;color:rgba(12,12,11,.82);margin-top:14px}

/* ── 8 · heritage float ── */
.bb-heritage{position:relative;padding:calc(var(--sec) * .5) 0 calc(var(--sec) * .6);background:#fff;overflow:hidden}
.bb-heritage .fstage{position:relative;min-height:max(780px,120vh);display:grid;place-items:center}
.bb-heritage .floats{position:absolute;inset:0;pointer-events:none}
.bb-heritage .fl{position:absolute;margin:0}
.bb-heritage .fl img{width:100%;height:auto;border-radius:6px}
.bb-heritage .fl figcaption{font-size:13px;color:var(--mute);margin-top:10px}
.bb-heritage .f1{left:3%;top:4%;width:22vw}
.bb-heritage .f2{right:5%;top:0;width:18vw}
.bb-heritage .f3{left:6%;top:52%;width:26vw}
.bb-heritage .f4{right:3%;top:38%;width:21vw}
.bb-heritage .f5{right:22%;top:76%;width:18vw}
.bb-heritage .hcopy{position:relative;z-index:2;max-width:540px;text-align:center;padding:40px var(--pad);background:radial-gradient(closest-side,rgba(255,255,255,.97) 60%,rgba(255,255,255,0))}
.bb-heritage .hcopy .eyebrow{justify-content:center}
.bb-heritage .hcopy h2{font-size:clamp(44px,5.4vw,84px)}
.bb-heritage .hcopy p{color:rgba(12,12,11,.78);margin:24px auto 32px;max-width:440px}
@media (max-width:899px){
  .bb-heritage .fstage{min-height:0;padding:220px 0 240px}
  .bb-heritage .f1{left:3%;top:0;width:44vw}
  .bb-heritage .f2{right:3%;top:48px;width:40vw}
  .bb-heritage .f3{left:5%;top:auto;bottom:0;width:46vw}
  .bb-heritage .f4{right:4%;top:auto;bottom:44px;width:38vw}
  .bb-heritage .f5{display:none}
  .bb-heritage .fl figcaption{font-size:11.5px}
}

/* ── 9 · practical ── */
.bb-info{padding:var(--sec) 0;background:var(--stone)}
.bb-info .head1{margin-bottom:48px}
.bb-info .head1 .sub{margin-top:14px;font-size:14px;color:var(--mute)}
.bb-info .rows{border-bottom:1px solid rgba(12,12,11,.12)}
.bb-info .r{display:grid;grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px;gap:24px;align-items:center;padding:26px 0;border-top:1px solid rgba(12,12,11,.12)}
.bb-info .r h3{font-size:22px;line-height:1.2}
.bb-info .r > a{font-size:15px;width:max-content}
@media (hover:hover){.bb-info .r > a:hover{text-decoration:underline;text-underline-offset:3px}}
.bb-info .r .tel{font-size:18px;font-weight:500}
.bb-info .r dl div{display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:2px 0}
.bb-info .r dt{color:var(--mute)}
.bb-info .st{justify-self:end;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-size:13px;font-weight:500;padding:6px 12px;border-radius:999px;background:#fff}
.bb-info .st i{width:6px;height:6px;border-radius:50%;background:#9A9A93}
.bb-info .st.on{background:var(--r);color:var(--on-r)}
.bb-info .st.on i{background:var(--on-r)}
.bb-info .r dl .dn{font-size:12.5px;color:var(--mute);padding-top:4px}
.bb-info .r.em{grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px}
.bb-info .r.em > span{font-size:15px;color:var(--mute)}
@media (max-width:1099px){
  .bb-info .r,.bb-info .r.em{grid-template-columns:1fr auto;gap:8px 16px;padding:22px 0}
  .bb-info .r h3{grid-column:1}
  .bb-info .r .st{grid-column:2;grid-row:1}
  .bb-info .r > a,.bb-info .r dl,.bb-info .r.em > span{grid-column:1 / -1}
  .bb-info .r dl{max-width:420px;margin-top:6px}
}

/* ── 10 · test drive ── */
.bb-drive{position:relative;min-height:780px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:180px 0 104px}
.bb-drive .dbg{position:absolute;inset:0;overflow:hidden}
.bb-drive .dbg .par{position:absolute;inset:-10% 0}
.bb-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 58%}
.bb-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.9) 0%,rgba(8,10,12,.55) 42%,rgba(8,10,12,.2) 100%)}
.bb-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.bb-drive h2{font-size:clamp(38px,4.3vw,64px)}
.bb-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.82);margin-top:18px}
.bb-drive .dcopy .demo{font-size:13.5px;color:rgba(255,255,255,.62);margin-top:12px}
.bb-drive .dform{display:grid;gap:16px;padding:30px;border-radius:10px;background:rgba(12,12,11,.62);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.bb-drive label span{display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:2px}
.bb-drive input,.bb-drive select{width:100%;height:48px;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.4);border-radius:0;color:#fff;font:16px 'BbF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .25s}
.bb-drive select{background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.bb-drive select option{color:var(--ink);background-color:#fff}
.bb-drive input:focus,.bb-drive select:focus{border-bottom-color:var(--r);box-shadow:0 1px 0 0 var(--r)}
.bb-drive .dform .btn{justify-self:start;margin-top:8px}
.bb-drive .done{font-size:14px;background:rgba(255,255,255,.08);padding:12px 14px;border-left:3px solid var(--r);border-radius:2px}
@media (max-width:899px){
  .bb-drive{min-height:0;padding:150px 0 110px}
  .bb-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .bb-drive .dshade{background:linear-gradient(rgba(8,10,12,.66),rgba(8,10,12,.66)),linear-gradient(0deg,rgba(8,10,12,.9),rgba(8,10,12,.2))}
  .bb-drive .dcopy p,.bb-drive .dcopy .demo{color:#fff}
  .bb-drive .dform{padding:22px}
}

/* ── footer ── */
.bb-foot{background:#fff;padding:104px 0 48px}
.bb-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:48px;align-items:start}
.bb-foot .fbrand img{width:clamp(180px,17vw,250px);height:auto}
.bb-foot .fbrand p{margin-top:18px;font-size:15px;color:var(--mute)}
.bb-foot .fnav{display:flex;flex-direction:column;gap:2px}
.bb-foot .fnav a{font-size:clamp(24px,2.2vw,32px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.bb-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.bb-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end}
.bb-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.bb-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.bb-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:80px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.bb-foot .proto{font-size:12px;line-height:1.6;color:var(--mute);margin-top:20px}
@media (max-width:899px){
  .bb-foot{padding:80px 0 calc(110px + env(safe-area-inset-bottom))}
  .bb-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:40px}
  .bb-foot .fside{align-items:flex-start}
  .bb-foot .flegal{margin-top:56px}
}

/* ── mobile sticky CTA ── */
.bb-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(12,12,11,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.bb-sticky a,.bb-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.bb-sticky a:nth-child(2){background:var(--r);color:var(--on-r)}
@media (max-width:899px){.bb-sticky{display:grid}}
.bb[data-sticky="1"] .bb-sticky{transform:none}
.bb.menu-open .bb-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Brimborg's colours, never SNDR's ── */
.bb sndr-chat{--chat-accent:${TEAL};--chat-on-accent:${INK};--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#62625C;--chat-line:#E6E5E0;--chat-sunk:#F3F2EE;--chat-radius:14px;--chat-font:'BbF',system-ui,sans-serif}
@media (max-width:899px){.bb sndr-chat::part(launcher){display:none}}

/* ── digits: a price that rolls like an odometer (strip of 0-9 twice, parked on the real digit) ── */
.bb .num{font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1;line-height:1;white-space:nowrap}
.bb .dg,.bb .sep{display:inline-block;height:1em;overflow:hidden;vertical-align:top;line-height:1}
.bb .dr{display:block;will-change:transform}
.bb .dr i{display:block;font-style:normal;height:1em;line-height:1}
.bb .sep{width:.3em;text-align:center;letter-spacing:0}
.bb .num .cur{line-height:1;padding-bottom:.47em}

/* ── 2 · Polestar 5: price, lease, gallery, showroom ── */
.bb-p5{position:relative;background:#0A0B0C;color:#fff;padding:clamp(88px,10vw,150px) 0 calc(var(--sec) * .9);overflow:hidden}
.bb-p5 .eyebrow{color:rgba(255,255,255,.7)}
.bb-p5 .eyebrow i{background:var(--r)}
.bb-p5 .p5-head{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:24px 64px;align-items:end}
.bb-p5 h2{font-size:clamp(60px,10.4vw,172px);line-height:.9;letter-spacing:-.058em}
.bb-p5 .p5-lede{max-width:470px;justify-self:end;font-size:17px;line-height:1.6;color:rgba(255,255,255,.78)}
.bb-p5 .p5-price{margin-top:clamp(40px,6vw,92px);padding-top:26px;border-top:1px solid rgba(255,255,255,.16)}
.bb-p5 .p5-price .pl{font-size:14px;font-weight:500;color:rgba(255,255,255,.66)}
.bb-p5 .p5-price .num{display:flex;align-items:flex-end;margin-top:10px;font-size:clamp(50px,12.8vw,216px);font-weight:500;letter-spacing:-.062em}
.bb-p5 .p5-price .cur{font-size:.3em;margin-left:.22em;color:var(--r);letter-spacing:-.02em}
.bb-p5 .p5-tags{display:flex;flex-wrap:wrap;gap:8px 10px;margin-top:24px}
.bb-p5 .p5-tags span{display:inline-flex;align-items:center;gap:8px;padding:8px 15px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(255,255,255,.24)}
.bb-p5 .p5-tags .on{background:var(--r);color:var(--on-r);box-shadow:none}
.bb-p5 .p5-tags .on i{width:6px;height:6px;border-radius:50%;background:var(--on-r)}
.bb-p5 .p5-hero{margin:clamp(56px,7vw,104px) auto 0}
.bb-p5 .p5img{border-radius:8px;background:#15181B;aspect-ratio:21 / 9}
.bb-p5 .p5img .par{inset:-10% -5%}
.bb-p5 .p5-hero figcaption{margin-top:14px;font-size:13px;color:rgba(255,255,255,.55)}
.bb-p5 .p5-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(40px,5vw,72px);border-top:1px solid rgba(255,255,255,.16)}
.bb-p5 .st4{padding:28px 24px 4px;border-left:1px solid rgba(255,255,255,.16)}
.bb-p5 .st4:first-child{padding-left:0;border-left:0}
.bb-p5 .st4 .big{font-size:clamp(38px,4.8vw,80px);font-weight:500;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap}
.bb-p5 .st4 .big small{font-size:.36em;margin-left:.2em;color:var(--r);letter-spacing:-.01em}
.bb-p5 .st4 .lb{margin-top:14px;font-size:14.5px;font-weight:500}
.bb-p5 .st4 .sc{margin-top:3px;font-size:12.5px;color:rgba(255,255,255,.55)}
.bb-p5 .p5-gal{margin-top:clamp(72px,9vw,128px)}
.bb-p5 .p5-gal .head{margin-bottom:36px}
.bb-p5 .p5-gal h3{font-size:clamp(30px,3.2vw,48px);letter-spacing:-.04em}
.bb-p5 .arrows button{box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
@media (hover:hover){.bb-p5 .arrows button:not(:disabled):hover{box-shadow:inset 0 0 0 1px #fff}}
.bb-p5 .p5-rail{grid-auto-columns:max-content;gap:16px}
.bb-p5 .pc{position:relative;height:clamp(300px,54vh,540px);border-radius:8px;overflow:hidden;scroll-snap-align:start;background:#15181B}
.bb-p5 .pc .frame{position:absolute;inset:0;border-radius:inherit;background:#15181B}
.bb-p5 .pc .cap{position:absolute;left:18px;bottom:16px;z-index:2;font-size:14px;font-weight:500;text-shadow:0 1px 14px rgba(0,0,0,.55)}
.bb-p5 .pc::after{content:'';position:absolute;inset:auto 0 0 0;height:38%;background:linear-gradient(0deg,rgba(8,10,12,.6),rgba(8,10,12,0));pointer-events:none}
.bb-p5 .p5-show{position:relative;margin:clamp(88px,10vw,150px) auto 0}
.bb-p5 .sh-stage{position:relative}
.bb-p5 .sh-fig{margin:0}
.bb-p5 .sh-fig .frame{aspect-ratio:1.85 / 1;border-radius:8px;background:#15181B}
.bb-p5 .sh-card{position:absolute;right:24px;bottom:24px;width:min(410px,40%);padding:24px 26px;border-radius:10px;background:rgba(10,11,12,.74);
  -webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.bb-p5 .sh-card .eyebrow{margin-bottom:12px}
.bb-p5 .sh-card h3{font-size:clamp(28px,2.6vw,38px);line-height:1.05;letter-spacing:-.04em}
.bb-p5 .sh-card .ln{margin-top:12px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.74)}
.bb-p5 .sh-card address{margin-top:14px;font-style:normal;font-size:15px}
.bb-p5 .sh-card address a{border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:1px}
.bb-p5 .sh-card dl{margin-top:16px}
.bb-p5 .sh-card dl div{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-top:1px solid rgba(255,255,255,.12);font-size:14px;color:rgba(255,255,255,.7)}
.bb-p5 .sh-card dl div.today{color:#fff;font-weight:500}
.bb-p5 .sh-card dl div.today dt::before{content:'';display:inline-block;width:6px;height:6px;margin-right:8px;border-radius:50%;background:var(--r);vertical-align:1px}
.bb-p5 .sh-card .st{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:6px 13px;border-radius:999px;font-size:13px;font-weight:500;background:rgba(255,255,255,.1)}
.bb-p5 .sh-card .st i{width:6px;height:6px;border-radius:50%;background:#77776F}
.bb-p5 .sh-card .st.on{background:var(--r);color:var(--on-r)}
.bb-p5 .sh-card .st.on i{background:var(--on-r)}
.bb-p5 .sh-card .ctas{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.bb-p5 .sh-card .tel{display:inline-flex;align-items:center;gap:8px;margin-top:16px;font-size:18px;font-weight:500;font-variant-numeric:tabular-nums}
.bb-p5 .p5-fine{margin-top:22px;font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.5);max-width:760px}
@media (max-width:1023px){
  .bb-p5 .p5-head{grid-template-columns:minmax(0,1fr)}
  .bb-p5 .p5-lede{justify-self:start}
  .bb-p5 .p5-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bb-p5 .st4:nth-child(3){padding-left:0;border-left:0}
  .bb-p5 .st4:nth-child(n+3){border-top:1px solid rgba(255,255,255,.16);margin-top:24px}
  .bb-p5 .sh-card{position:static;width:auto;margin-top:16px;background:rgba(255,255,255,.06)}
  .bb-p5 .sh-fig .frame{aspect-ratio:16 / 10}
}
@media (max-width:639px){
  .bb-p5 .p5img{aspect-ratio:4 / 3.4}
  .bb-p5 .p5-tags span{font-size:13px;padding:7px 12px}
  .bb-p5 .st4{padding:22px 14px 4px 0}
  .bb-p5 .st4:nth-child(even){padding-left:16px;padding-right:0}
  .bb-p5 .pc{height:clamp(280px,46svh,420px)}
}


/* focus-guard (_tools/focus-guard): no ring after a tap or a click, every ring for the keyboard */
html[data-input="pointer"] .bb :focus-visible:not(input):not(textarea):not(select):not([contenteditable="true"]){outline:none}
.bb [tabindex="-1"]:focus{outline:none}

@media (prefers-reduced-motion:reduce){
  .bb *,.bb *::before,.bb *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .bb-statement{clip-path:none!important}
}
`
