/*
 * Bílabúð Benna — the whole visual system. Tokens in DESIGN.md.
 * One family: Host Grotesk, a normal-width neo-grotesk, set tight and in
 * sentence case the way the Drivehub reference is. Colour: ink, white, stone
 * and one yellow, the #FEE101 sampled from Benni's own logo.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0C0C0B'
export const YELLOW = '#FEE101'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'BnF';src:url('${B}fonts/benni/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'BnF';src:url('${B}fonts/benni/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'BnF';src:url('${B}fonts/benni/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:${INK}}
html.bn-menu,html.bn-menu body{overflow:hidden}

.bn{--ink:${INK};--paper:#FFFFFF;--stone:#F3F2EE;--line:#E6E5E0;--mute:#62625C;--y:${YELLOW};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(96px,11vw,168px);
  font-family:'BnF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal;font-feature-settings:'ss01' 0}
.bn *{box-sizing:border-box}
.bn a{color:inherit;text-decoration:none}
.bn p,.bn h1,.bn h2,.bn h3,.bn figure,.bn ul,.bn ol,.bn dl,.bn dd{margin:0}
.bn ul,.bn ol{padding:0;list-style:none}
.bn img{display:block;max-width:100%}
.bn button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.bn a,.bn button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.bn :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px}
.bn .bn-hero :focus-visible,.bn .bn-split :focus-visible,.bn .bn-drive :focus-visible,
.bn .bar :focus-visible,.bn .bn-menu-panel :focus-visible,.bn .bn-sticky :focus-visible,.bn .plate.top .kf{outline:2px solid var(--y);outline-offset:3px}
.bn .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.bn .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--y);color:var(--ink);padding:12px 18px;border-radius:4px;font-weight:600}
.bn .skip:focus{top:16px}
.bn section[id]{scroll-margin-top:84px}
.bn .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bn .tab,.bn .up,.bn .tel,.bn .pr{font-variant-numeric:tabular-nums}

/* ── type ── */
.bn h1,.bn h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.bn h2{font-size:clamp(38px,4.3vw,64px)}
.bn h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.bn [data-chars] .ch-mask{padding:.16em .04em .1em;margin:-.16em -.04em -.1em}
.bn .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:20px;font-size:14px;font-weight:500;line-height:1.2;letter-spacing:-.005em;color:var(--mute)}
.bn .eyebrow i{width:5px;height:5px;border-radius:50%;background:var(--ink);flex:none}
.bn .center{text-align:center}
.bn .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label, Drivehub's plain shape ── */
.bn .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease)}
.bn .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.bn .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.bn .btn-light{background:#fff;color:var(--ink)}
.bn .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.bn .btn-dark{background:var(--ink);color:#fff}
.bn .btn-yellow{background:var(--y);color:var(--ink)}
.bn .btn-line{box-shadow:inset 0 0 0 1px rgba(12,12,11,.22);color:var(--ink)}
@media (hover:hover){
  .bn .btn:hover .c{transform:translateY(-1.35em)}
  .bn .btn-light:hover{background:var(--y)}
  .bn .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .bn .btn-dark:hover{background:#2A2A27}
  .bn .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
}

/* ── loader ── */
.bn-loader{position:fixed;inset:0;z-index:250;background:${INK};display:grid;place-content:center;justify-items:center;gap:26px}
.bn-loader .mk img{width:min(58vw,380px);height:auto}
.bn-loader .yr{font-size:15px;font-weight:500;letter-spacing:-.01em;color:rgba(255,255,255,.72);opacity:0;visibility:hidden}

/* ── chrome ── */
.bn-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .55s var(--ease)}
.bn-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:${INK};z-index:3}
.bn-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.bn-chrome .bar,.bn-chrome .hdr{transform:translateY(var(--bar,0px))}
.bn .bar{height:38px;background:${INK};color:rgba(255,255,255,.74);font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.07)}
.bn .bar .in{display:flex;align-items:center;gap:28px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bn .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.bn .bar a:hover{color:#fff}}
.bn .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.bn .bar .st i{width:6px;height:6px;border-radius:50%;background:#77776F}
.bn .bar .st.on i{background:var(--y)}
.bn .hdr{position:relative;height:74px}
.bn .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.bn .plate.base{color:var(--ink)}
.bn .plate.top{color:#fff}
.bn-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.88);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(12,12,11,.07)}
.bn-chrome[data-solid="1"] .plate.top{background:rgba(12,12,11,.78);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.bn .row{display:flex;align-items:center;gap:28px;height:74px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.bn .row .logo{display:block;flex:none}
.bn .row .logo img{height:42px;width:auto}
.bn .row .links{display:flex;gap:32px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.bn .row .nl{position:relative;padding:6px 0}
.bn .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
@media (hover:hover){.bn .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.bn .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.bn .row .links + .acts{margin-left:0}
.bn .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.bn .plate.base .pill{background:var(--ink);color:#fff}
.bn .plate.top .pill{background:#fff;color:var(--ink)}
@media (hover:hover){.bn .plate .pill:hover{background:var(--y);color:var(--ink)}}
.bn .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1100px){.bn .row .links{gap:22px;font-size:14px}}
@media (max-width:1023px){
  .bn .row .links{display:none}
  .bn .row .burger{display:grid}
  .bn .row .links + .acts{margin-left:auto}
  .bn .row .logo img{height:38px}
}
@media (max-width:639px){
  .bn .row .pill{display:none}
  .bn .bar .hide-s{display:none}
  .bn .row{gap:12px}
}

/* ── menu ── */
.bn-menu-panel{position:fixed;inset:0;z-index:120;background:${INK};color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.bn-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.bn-menu-panel .mtop img{height:38px;width:auto}
.bn-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.bn-menu-panel nav{display:flex;flex-direction:column;margin-top:40px}
.bn-menu-panel nav a{font-size:clamp(34px,9.4vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1.18;padding:4px 0}
.bn-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.bn-menu-panel .mfoot a,.bn-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.bn-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:var(--y)}
.bn-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── 1 · hero ── */
.bn-hero{position:relative;height:100svh;min-height:640px;background:var(--paper)}
.bn-hero .hframe{position:absolute;inset:0;overflow:hidden;background:#15181B;color:#fff;will-change:transform}
.bn-hero .hpar{position:absolute;inset:0 0 -18% 0}
.bn-hero .hpic{width:100%;height:100%;object-fit:cover;object-position:40% 48%}
.bn-hero .shade{position:absolute;inset:0;background:
  linear-gradient(270deg,rgba(8,10,12,.72) 0%,rgba(8,10,12,.42) 34%,rgba(8,10,12,0) 60%),
  linear-gradient(0deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 40%),
  linear-gradient(180deg,rgba(8,10,12,.5) 0%,rgba(8,10,12,0) 22%)}
.bn-hero .copy{position:absolute;right:0;bottom:clamp(72px,12vh,140px);width:min(43%,620px);padding-right:var(--pad)}
.bn-hero .eyebrow{color:rgba(255,255,255,.78)}
.bn-hero h1{font-size:clamp(46px,5.2vw,84px)}
.bn-hero h1 span{display:block}
.bn-hero .lede{max-width:420px;margin-top:22px;font-size:17px;line-height:1.55;color:rgba(255,255,255,.82)}
.bn-hero .ctas{display:flex;gap:10px;margin-top:32px;flex-wrap:wrap}
.bn-hero .hmeta{position:absolute;left:var(--pad);bottom:clamp(24px,4vh,40px);font-size:12.5px;color:rgba(255,255,255,.6)}
@media (max-width:899px){
  .bn-hero .hpar{inset:0 0 30% 0}
  .bn-hero .hpic{object-position:34% 58%}
  .bn-hero .shade{background:linear-gradient(0deg,#15181B 0%,#15181B 38%,rgba(21,24,27,.6) 52%,rgba(21,24,27,0) 66%),linear-gradient(180deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 24%)}
  .bn-hero .copy{left:0;width:auto;padding-inline:var(--pad);bottom:calc(104px + env(safe-area-inset-bottom))}
  .bn-hero h1{font-size:clamp(40px,11.4vw,58px)}
  .bn-hero .lede{font-size:16px;margin-top:16px}
  .bn-hero .ctas{margin-top:24px}
  .bn-hero .hmeta{bottom:calc(82px + env(safe-area-inset-bottom));font-size:12px}
}

/* ── frames (media reveal + inner parallax) ── */
.bn .frame{position:relative;overflow:hidden;background:#E4E3DD}
.bn .frame .par{position:absolute;inset:-10% 0}
.bn .frame img{width:100%;height:100%;object-fit:cover}
.bn .frame .still-photo{position:absolute;inset:0}
.bn .frame.whole-photo img{object-fit:contain}

/* ── section heads with arrows ── */
.bn .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:48px}
.bn .arrows{display:flex;gap:8px;flex:none}
.bn .arrows button{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,opacity .25s}
@media (hover:hover){.bn .arrows button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.bn .arrows button:disabled{opacity:.3;cursor:default}
.bn .rail{display:grid;grid-auto-flow:column;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;
  padding-inline:var(--pad);scroll-padding-inline:var(--pad);scrollbar-width:none;-ms-overflow-style:none;cursor:grab}
.bn .rail::-webkit-scrollbar{display:none}
.bn .rail.drag{scroll-snap-type:none;cursor:grabbing;user-select:none}
.bn .rail.drag a{pointer-events:none}
@media (max-width:767px){.bn .head .arrows{display:none}}

/* ── 2 · categories ── */
.bn-cats{padding:var(--sec) 0 calc(var(--sec) * .72)}
.bn-cats .rail{grid-auto-columns:clamp(260px,28.6vw,440px)}
.bn-cats .cat{position:relative;display:block;aspect-ratio:1 / 1.08;border-radius:8px;overflow:hidden;color:#fff;scroll-snap-align:start;isolation:isolate}
.bn-cats .cph{position:absolute;inset:0;border-radius:inherit}
.bn-cats .cshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,0) 38%)}
.bn-cats .clab{position:absolute;left:22px;bottom:20px;font-size:21px;font-weight:500;letter-spacing:-.025em}
.bn-cats .cgo{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;transition:transform .5s var(--ease),background-color .3s}
@media (hover:hover){.bn-cats .cat:hover .cgo{transform:rotate(45deg);background:var(--y)}}
@media (max-width:767px){.bn-cats .rail{grid-auto-columns:76vw}}

/* ── 3 · KGM | Porsche ── */
.bn-split{--x:50%;position:relative;height:clamp(640px,100svh,940px);overflow:hidden;color:#fff;background:#0E1012;touch-action:pan-y;user-select:none}
.bn-split .side{position:absolute;inset:0}
.bn-split .side.kgm{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.bn-split .sbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.bn-split .kgm .sbg{object-position:18% 62%}
.bn-split .por .sbg{object-position:86% 60%}
.bn-split .sshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.78) 0%,rgba(8,10,12,.2) 40%,rgba(8,10,12,0) 60%),linear-gradient(180deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,.1) 30%,rgba(8,10,12,0) 45%)}
.bn-split .sbody{position:absolute;bottom:clamp(96px,12vh,128px);width:min(380px,36vw)}
.bn-split .scopy{position:absolute;inset:0;pointer-events:none}
.bn-split .sbody.kgm{left:var(--pad)}
.bn-split .sbody.por{right:var(--pad);text-align:right}
.bn-split .sbody[hidden]{display:none}
.bn-split .sbody .slink{pointer-events:auto}
.bn-split .sname{font-size:clamp(64px,9vw,148px);font-weight:500;letter-spacing:-.05em;line-height:.9}
.bn-split .ssub{font-size:15px;line-height:1.5;color:rgba(255,255,255,.82);margin:16px 0 16px}
.bn-split .slink{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:500;color:#fff;border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:2px}
@media (hover:hover){.bn-split .slink:hover{border-color:var(--y);color:var(--y)}}
.bn-split .stitle{position:absolute;top:clamp(124px,15vh,170px);left:0;right:0;text-align:center;pointer-events:none;padding-inline:var(--pad)}
.bn-split .stitle .eyebrow{justify-content:center;color:rgba(255,255,255,.78)}
.bn-split .stitle h2{font-size:clamp(40px,4.6vw,72px)}
.bn-split .divider{position:absolute;top:0;bottom:0;left:var(--x);width:1px;background:rgba(255,255,255,.8);transform:translateX(-.5px);pointer-events:none}
.bn-split .handle{position:absolute;top:58%;left:var(--x);transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:var(--y);color:var(--ink);
  display:flex;align-items:center;justify-content:center;cursor:ew-resize;touch-action:none;box-shadow:0 10px 34px rgba(0,0,0,.35);transition:transform .35s var(--ease)}
@media (hover:hover){.bn-split .handle:hover{transform:translate(-50%,-50%) scale(1.08)}}
.bn-split .stabs{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;display:none;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.bn-split .stabs button{min-height:40px;padding:0 18px;border-radius:999px;font-size:14px;font-weight:500;color:#fff}
@media (hover:none),(max-width:899px){.bn-split .stabs{display:flex}}
@media (max-width:899px){
  .bn-split{height:max(620px,90svh)}
  .bn-split .stabs{bottom:calc(90px + env(safe-area-inset-bottom))}
  .bn-split .sbody{width:calc(50% - var(--pad) - 28px);bottom:calc(160px + env(safe-area-inset-bottom))}
  .bn-split .sname{font-size:clamp(28px,8.4vw,64px)}
  .bn-split .ssub{font-size:12px;margin:12px 0 0}
  .bn-split .slink{margin-top:12px;font-size:14px}
  .bn-split .stitle{top:calc(100px + env(safe-area-inset-top))}
  .bn-split .stitle h2{font-size:clamp(34px,9.6vw,48px)}
  .bn-split .kgm .sbg{object-position:22% 62%}
}

/* ── 4 · featured ── */
.bn-feat{padding:var(--sec) 0;background:var(--stone)}
.bn-feat .filters{display:flex;justify-content:center;gap:28px;margin:30px 0 56px;flex-wrap:wrap}
.bn-feat .filters button{position:relative;min-height:40px;font-size:15px;font-weight:500;color:var(--mute);transition:color .25s}
.bn-feat .filters button::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1.5px;background:var(--ink);transform:scaleX(0);transition:transform .45s var(--ease)}
.bn-feat .filters button[aria-pressed="true"]{color:var(--ink)}
.bn-feat .filters button[aria-pressed="true"]::after{transform:scaleX(1)}
@media (hover:hover){.bn-feat .filters button:hover{color:var(--ink)}}
.bn-feat .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:56px 24px}
.bn-feat .car{display:block}
.bn-feat .ph{aspect-ratio:4 / 3;border-radius:8px;overflow:hidden;background:#E6E5DF}
.bn-feat .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.bn-feat .car:hover .ph img{transform:scale(1.035)}.bn-feat .car:hover .pr svg{transform:translate(2px,-2px)}}
.bn-feat .meta{display:flex;gap:10px;margin-top:18px;font-size:13.5px;color:var(--mute)}
.bn-feat .meta span:first-child{color:var(--ink);font-weight:500}
.bn-feat h3{font-size:clamp(24px,2vw,30px);line-height:1.1;margin-top:4px}
.bn-feat .pr{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:16px;font-weight:500}
.bn-feat .pr svg{transition:transform .4s var(--ease)}
.bn-feat .note{font-size:12.5px;color:var(--mute);margin-top:6px;line-height:1.5}
.bn-feat .fine{text-align:center;font-size:12.5px;color:var(--mute);margin-top:56px}
@media (max-width:1099px){.bn-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .bn-feat .grid{grid-template-columns:minmax(0,1fr);gap:44px}
  .bn-feat .filters{flex-wrap:nowrap;justify-content:flex-start;gap:22px;overflow-x:auto;margin:22px calc(var(--pad) * -1) 32px;padding-inline:var(--pad);scrollbar-width:none}
  .bn-feat .filters::-webkit-scrollbar{display:none}
  .bn-feat .filters button{flex:none}
}

/* ── 5 · used ── */
.bn-used{padding:var(--sec) 0 calc(var(--sec) * .8)}
.bn-used .rail{grid-auto-columns:clamp(260px,23.6vw,360px);gap:20px}
.bn-used .uc{display:block;scroll-snap-align:start}
.bn-used .uph{border-radius:8px}
.bn-used .um{margin-top:16px;font-size:13.5px;color:var(--mute)}
.bn-used h3{font-size:19px;line-height:1.3;margin-top:4px}
.bn-used .up{display:flex;gap:10px;align-items:baseline;margin-top:8px;font-size:16px;font-weight:500}
.bn-used .up s{font-size:13.5px;font-weight:400;color:var(--mute)}
@media (hover:hover){.bn-used .uc:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.bn-used .ufoot{display:flex;justify-content:space-between;align-items:center;gap:24px 48px;margin-top:56px;flex-wrap:wrap}
.bn-used .ufoot p{max-width:620px;font-size:14px;color:var(--mute)}
@media (max-width:767px){.bn-used .rail{grid-auto-columns:74vw}}

/* ── 6 · service collage ── */
.bn-serv{padding:var(--sec) 0 calc(var(--sec) * 1.1);background:#fff}
.bn-serv .collage{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;row-gap:96px;align-items:start}
.bn-serv .intro{grid-column:1 / 6;grid-row:1}
.bn-serv .intro p{color:rgba(12,12,11,.78);max-width:440px;margin:24px 0 28px}
.bn-serv .hrs{max-width:440px;margin-bottom:32px}
.bn-serv .hrs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid var(--line);font-size:15px}
.bn-serv .hrs dt{color:var(--mute)}
.bn-serv .hrs a{font-weight:500}
.bn-serv .f{margin:0}
.bn-serv .fa{grid-column:7 / 13;grid-row:1;margin-top:40px}
.bn-serv .fb{grid-column:1 / 7;grid-row:2}
.bn-serv .fd{grid-column:8 / 12;grid-row:2;align-self:start;margin-top:120px}
.bn-serv .fc{grid-column:4 / 9;grid-row:3}
.bn-serv .frame{border-radius:6px}
.bn-serv figcaption{font-size:13.5px;line-height:1.55;color:var(--mute);margin-top:14px;max-width:380px}
.bn-serv figcaption a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.bn-serv .sos{display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:240px;background:var(--y);color:var(--ink);padding:28px;border-radius:6px;transition:transform .5s var(--ease)}
.bn-serv .sos .k{font-size:15px;font-weight:500;max-width:240px;line-height:1.4}
.bn-serv .sos .v{font-size:clamp(52px,5vw,80px);font-weight:500;line-height:.95;letter-spacing:-.045em}
@media (max-width:899px){
  .bn-serv .collage{grid-template-columns:minmax(0,1fr);row-gap:56px}
  .bn-serv .intro,.bn-serv .fa,.bn-serv .fb,.bn-serv .fc,.bn-serv .fd{grid-column:1;grid-row:auto;margin-top:0}
  .bn-serv .sos{min-height:200px}
}

/* ── 7 · statement, in Benni's yellow ── */
.bn-statement{position:relative;background:var(--y);color:var(--ink);padding:clamp(96px,10vw,150px) 0 clamp(96px,11vw,160px);will-change:clip-path}
.bn-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.bn-statement .roman{font-size:14px;font-weight:600;letter-spacing:.3em;margin-bottom:28px;opacity:.7}
.bn-statement h2{font-size:clamp(52px,8.2vw,136px);line-height:.96;letter-spacing:-.05em}
.bn-statement h2 span{display:block}
.bn-statement p{max-width:560px;margin:32px auto 0;font-size:17px;color:rgba(12,12,11,.8)}
.bn-statement .sfig{max-width:1080px;margin:80px auto 0;padding-inline:var(--pad)}
.bn-statement .frame{background:#E3C900;border-radius:6px}
.bn-statement figcaption{text-align:center;font-size:13px;color:rgba(12,12,11,.62);margin-top:14px}

/* ── 8 · heritage float ── */
.bn-heritage{position:relative;padding:calc(var(--sec) * .5) 0 calc(var(--sec) * .6);background:#fff;overflow:hidden}
.bn-heritage .fstage{position:relative;min-height:max(780px,120vh);display:grid;place-items:center}
.bn-heritage .floats{position:absolute;inset:0;pointer-events:none}
.bn-heritage .fl{position:absolute;margin:0}
.bn-heritage .fl img{width:100%;height:auto;border-radius:6px}
.bn-heritage .fl figcaption{font-size:13px;color:var(--mute);margin-top:10px}
.bn-heritage .f1{left:3%;top:4%;width:22vw}
.bn-heritage .f2{right:5%;top:0;width:18vw}
.bn-heritage .f3{left:6%;top:52%;width:26vw}
.bn-heritage .f4{right:3%;top:38%;width:21vw}
.bn-heritage .f5{right:22%;top:76%;width:18vw}
.bn-heritage .hcopy{position:relative;z-index:2;max-width:540px;text-align:center;padding:40px var(--pad);background:radial-gradient(closest-side,rgba(255,255,255,.97) 60%,rgba(255,255,255,0))}
.bn-heritage .hcopy .eyebrow{justify-content:center}
.bn-heritage .hcopy h2{font-size:clamp(44px,5.4vw,84px)}
.bn-heritage .hcopy p{color:rgba(12,12,11,.78);margin:24px auto 32px;max-width:440px}
@media (max-width:899px){
  .bn-heritage .fstage{min-height:0;padding:220px 0 240px}
  .bn-heritage .f1{left:3%;top:0;width:44vw}
  .bn-heritage .f2{right:3%;top:48px;width:40vw}
  .bn-heritage .f3{left:5%;top:auto;bottom:0;width:46vw}
  .bn-heritage .f4{right:4%;top:auto;bottom:44px;width:38vw}
  .bn-heritage .f5{display:none}
  .bn-heritage .fl figcaption{font-size:11.5px}
}

/* ── 9 · practical ── */
.bn-info{padding:var(--sec) 0;background:var(--stone)}
.bn-info .head1{margin-bottom:48px}
.bn-info .head1 .sub{margin-top:14px;font-size:14px;color:var(--mute)}
.bn-info .rows{border-bottom:1px solid rgba(12,12,11,.12)}
.bn-info .r{display:grid;grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px;gap:24px;align-items:center;padding:26px 0;border-top:1px solid rgba(12,12,11,.12)}
.bn-info .r h3{font-size:22px;line-height:1.2}
.bn-info .r > a{font-size:15px;width:max-content}
@media (hover:hover){.bn-info .r > a:hover{text-decoration:underline;text-underline-offset:3px}}
.bn-info .r .tel{font-size:18px;font-weight:500}
.bn-info .r dl div{display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:2px 0}
.bn-info .r dt{color:var(--mute)}
.bn-info .st{justify-self:end;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-size:13px;font-weight:500;padding:6px 12px;border-radius:999px;background:#fff}
.bn-info .st i{width:6px;height:6px;border-radius:50%;background:#9A9A93}
.bn-info .st.on{background:var(--y)}
.bn-info .st.on i{background:var(--ink)}
.bn-info .r.em{grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px}
.bn-info .r.em > span{font-size:15px;color:var(--mute)}
@media (max-width:1099px){
  .bn-info .r,.bn-info .r.em{grid-template-columns:1fr auto;gap:8px 16px;padding:22px 0}
  .bn-info .r h3{grid-column:1}
  .bn-info .r .st{grid-column:2;grid-row:1}
  .bn-info .r > a,.bn-info .r dl,.bn-info .r.em > span{grid-column:1 / -1}
  .bn-info .r dl{max-width:420px;margin-top:6px}
}

/* ── 10 · test drive ── */
.bn-drive{position:relative;min-height:780px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:180px 0 104px}
.bn-drive .dbg{position:absolute;inset:0;overflow:hidden}
.bn-drive .dbg .par{position:absolute;inset:-10% 0}
.bn-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 58%}
.bn-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.9) 0%,rgba(8,10,12,.55) 42%,rgba(8,10,12,.2) 100%)}
.bn-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.bn-drive h2{font-size:clamp(38px,4.3vw,64px)}
.bn-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.82);margin-top:18px}
.bn-drive .dcopy .demo{font-size:13.5px;color:rgba(255,255,255,.62);margin-top:12px}
.bn-drive .dform{display:grid;gap:16px;padding:30px;border-radius:10px;background:rgba(12,12,11,.62);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.bn-drive label span{display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:2px}
.bn-drive input,.bn-drive select{width:100%;height:48px;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.4);border-radius:0;color:#fff;font:16px 'BnF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .25s}
.bn-drive select{background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.bn-drive select option{color:var(--ink)}
.bn-drive input:focus,.bn-drive select:focus{border-bottom-color:var(--y);box-shadow:0 1px 0 0 var(--y)}
.bn-drive .dform .btn{justify-self:start;margin-top:8px}
.bn-drive .done{font-size:14px;background:rgba(255,255,255,.08);padding:12px 14px;border-left:3px solid var(--y);border-radius:2px}
@media (max-width:899px){
  .bn-drive{min-height:0;padding:150px 0 110px}
  .bn-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .bn-drive .dshade{background:linear-gradient(rgba(8,10,12,.66),rgba(8,10,12,.66)),linear-gradient(0deg,rgba(8,10,12,.9),rgba(8,10,12,.2))}
  .bn-drive .dcopy p,.bn-drive .dcopy .demo{color:#fff}
  .bn-drive .dform{padding:22px}
}

/* ── footer ── */
.bn-foot{background:#fff;padding:104px 0 48px}
.bn-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:48px;align-items:start}
.bn-foot .fbrand img{width:clamp(180px,17vw,250px);height:auto}
.bn-foot .fbrand p{margin-top:18px;font-size:15px;color:var(--mute)}
.bn-foot .fnav{display:flex;flex-direction:column;gap:2px}
.bn-foot .fnav a{font-size:clamp(24px,2.2vw,32px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.bn-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.bn-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end}
.bn-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.bn-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.bn-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:80px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.bn-foot .proto{font-size:12px;line-height:1.6;color:var(--mute);margin-top:20px}
@media (max-width:899px){
  .bn-foot{padding:80px 0 calc(110px + env(safe-area-inset-bottom))}
  .bn-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:40px}
  .bn-foot .fside{align-items:flex-start}
  .bn-foot .flegal{margin-top:56px}
}

/* ── mobile sticky CTA ── */
.bn-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(12,12,11,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.bn-sticky a,.bn-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.bn-sticky a:nth-child(2){background:var(--y);color:var(--ink)}
@media (max-width:899px){.bn-sticky{display:grid}}
.bn[data-sticky="1"] .bn-sticky{transform:none}
.bn.menu-open .bn-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes Benni's colours, never SNDR's ── */
.bn sndr-chat{--chat-accent:${YELLOW};--chat-on-accent:${INK};--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#62625C;--chat-line:#E6E5E0;--chat-sunk:#F3F2EE;--chat-radius:14px;--chat-font:'BnF',system-ui,sans-serif}
@media (max-width:899px){.bn sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .bn *,.bn *::before,.bn *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .bn-statement{clip-path:none!important}
}
`
