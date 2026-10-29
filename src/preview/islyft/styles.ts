/*
 * ÍSBAND — the whole visual system, transplanted from Bílabúð Benna. Tokens in
 * DESIGN.md. One family: Host Grotesk, set tight and in sentence case. Colour:
 * ink, white, stone and one blue. The logo blue #00538D, measured from
 * Íslyft's own mark, carries white text directly (about 8:1 against white).
 * The variable keeps ÍSBAND's name RED so the transplant stays a token swap.
 */
const B = import.meta.env.BASE_URL
export const INK = '#0C0C0B'
export const RED = '#00538D'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'IlF';src:url('${B}fonts/islyft/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'IlF';src:url('${B}fonts/islyft/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'IlF';src:url('${B}fonts/islyft/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:${INK}}
html.il-menu,html.il-menu body{overflow:hidden}

.il{--ink:${INK};--paper:#FFFFFF;--stone:#F3F2EE;--line:#E6E5E0;--mute:#62625C;--r:${RED};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(96px,11vw,168px);
  font-family:'IlF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal;font-feature-settings:'ss01' 0}
.il *{box-sizing:border-box}
.il a{color:inherit;text-decoration:none}
.il p,.il h1,.il h2,.il h3,.il figure,.il ul,.il ol,.il dl,.il dd{margin:0}
.il ul,.il ol{padding:0;list-style:none}
.il img{display:block;max-width:100%}
.il button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.il a,.il button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.il :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px}
.il .il-hero :focus-visible,.il .il-split :focus-visible,.il .il-drive :focus-visible,
.il .bar :focus-visible,.il .il-menu-panel :focus-visible,.il .il-sticky :focus-visible,.il .plate.top .kf{outline:2px solid var(--r);outline-offset:3px}
.il .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.il .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--r);color:#fff;padding:12px 18px;border-radius:4px;font-weight:600}
.il .skip:focus{top:16px}
.il-menu-panel:focus{outline:none}
.il section[id]{scroll-margin-top:84px}
.il .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.il .tab,.il .up,.il .tel,.il .pr{font-variant-numeric:tabular-nums}

/* ── type ── */
.il h1,.il h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.il h2{font-size:clamp(38px,4.3vw,64px)}
.il h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.il [data-chars] .ch-mask{padding:.16em .04em .1em;margin:-.16em -.04em -.1em}
.il .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:20px;font-size:14px;font-weight:500;line-height:1.2;letter-spacing:-.005em;color:var(--mute)}
.il .eyebrow i{width:5px;height:5px;border-radius:50%;background:var(--ink);flex:none}
.il .center{text-align:center}
.il .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label, Drivehub's plain shape ── */
.il .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease)}
.il .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.il .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.il .btn-light{background:#fff;color:var(--ink)}
.il .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.il .btn-dark{background:var(--ink);color:#fff}
.il .btn-red{background:var(--r);color:#fff}
.il .btn-line{box-shadow:inset 0 0 0 1px rgba(12,12,11,.22);color:var(--ink)}
@media (hover:hover){
  .il .btn:hover .c{transform:translateY(-1.35em)}
  .il .btn-light:hover{background:var(--r);color:#fff}
  .il .btn-red:hover{background:#004574}
  .il .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .il .btn-dark:hover{background:#2A2A27}
  .il .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
}

/* ── loader ── */
.il-loader{position:fixed;inset:0;z-index:250;background:${INK};display:grid;place-content:center;justify-items:center;gap:26px}
.il-loader .mk img{width:min(64vw,420px);height:auto}
.il-loader .yr{font-size:15px;font-weight:500;letter-spacing:-.01em;color:rgba(255,255,255,.72);opacity:0;visibility:hidden}

/* ── chrome ── */
.il-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .55s var(--ease)}
.il-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:${INK};z-index:3}
.il-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.il-chrome .bar,.il-chrome .hdr{transform:translateY(var(--bar,0px))}
.il .bar{height:38px;background:${INK};color:rgba(255,255,255,.74);font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.07)}
.il .bar .in{display:flex;align-items:center;gap:28px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.il .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.il .bar a:hover{color:#fff}}
.il .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.il .bar .st i{width:6px;height:6px;border-radius:50%;background:#77776F}
.il .bar .st.on i{background:var(--r)}
.il .hdr{position:relative;height:74px}
.il .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.il .plate.base{color:var(--ink)}
.il .plate.top{color:#fff}
.il-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.88);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(12,12,11,.07)}
.il-chrome[data-solid="1"] .plate.top{background:rgba(12,12,11,.78);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.il .row{display:flex;align-items:center;gap:28px;height:74px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.il .row .logo{display:block;flex:none}
.il .row .logo img{height:30px;width:auto}
.il .row .links{display:flex;gap:32px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.il .row .nl{position:relative;padding:6px 0}
.il .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
@media (hover:hover){.il .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.il .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.il .row .links + .acts{margin-left:0}
.il .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.il .plate.base .pill{background:var(--ink);color:#fff}
.il .plate.top .pill{background:#fff;color:var(--ink)}
@media (hover:hover){.il .plate .pill:hover{background:var(--r);color:#fff}}
.il .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1100px){.il .row .links{gap:22px;font-size:14px}}
@media (max-width:1023px){
  .il .row .links{display:none}
  .il .row .burger{display:grid}
  .il .row .links + .acts{margin-left:auto}
  .il .row .logo img{height:26px}
}
@media (max-width:639px){
  .il .row .pill{display:none}
  .il .bar .hide-s{display:none}
  .il .row{gap:12px}
}

/* ── menu ── */
.il-menu-panel{position:fixed;inset:0;z-index:120;background:${INK};color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.il-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.il-menu-panel .mtop img{height:26px;width:auto}
.il-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.il-menu-panel nav{display:flex;flex-direction:column;margin-top:40px}
.il-menu-panel nav a{font-size:clamp(34px,9.4vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1.18;padding:4px 0}
.il-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.il-menu-panel .mfoot a,.il-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.il-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:#fff}
.il-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── 1 · hero ── */
.il-hero{position:relative;height:100svh;min-height:640px;background:var(--paper)}
.il-hero .hframe{position:absolute;inset:0;overflow:hidden;background:#15181B;color:#fff;will-change:transform}
.il-hero .hpar{position:absolute;inset:0 0 -18% 0}
.il-hero .hpic{width:100%;height:100%;object-fit:cover;object-position:60% 52%}
.il-hero .shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(8,10,12,.74) 0%,rgba(8,10,12,.44) 34%,rgba(8,10,12,0) 60%),
  linear-gradient(0deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 40%),
  linear-gradient(180deg,rgba(8,10,12,.5) 0%,rgba(8,10,12,0) 22%)}
.il-hero .copy{position:absolute;left:0;bottom:clamp(72px,12vh,140px);width:min(46%,660px);padding-left:var(--pad)}
.il-hero .eyebrow{color:rgba(255,255,255,.78)}
.il-hero h1{font-size:clamp(46px,5.2vw,84px)}
.il-hero h1 span{display:block}
.il-hero .lede{max-width:420px;margin-top:22px;font-size:17px;line-height:1.55;color:rgba(255,255,255,.82)}
.il-hero .ctas{display:flex;gap:10px;margin-top:32px;flex-wrap:wrap}
.il-hero .hmeta{position:absolute;left:var(--pad);bottom:clamp(24px,4vh,40px);font-size:12.5px;color:rgba(255,255,255,.6)}
@media (max-width:899px){
  .il-hero .hpar{inset:0 0 30% 0}
  .il-hero .hpic{object-position:74% 58%}
  .il-hero .shade{background:linear-gradient(0deg,#15181B 0%,#15181B 38%,rgba(21,24,27,.6) 52%,rgba(21,24,27,0) 66%),linear-gradient(180deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 24%)}
  .il-hero .copy{left:0;right:0;width:auto;padding-inline:var(--pad);bottom:calc(104px + env(safe-area-inset-bottom))}
  .il-hero h1{font-size:clamp(40px,11.4vw,58px)}
  .il-hero .lede{font-size:16px;margin-top:16px}
  .il-hero .ctas{margin-top:24px}
  .il-hero .hmeta{bottom:calc(82px + env(safe-area-inset-bottom));font-size:12px}
}

/* ── frames (media reveal + inner parallax) ── */
.il .frame{position:relative;overflow:hidden;background:#E4E3DD}
.il .frame .par{position:absolute;inset:-10% 0}
.il .frame img{width:100%;height:100%;object-fit:cover}
.il .frame .still-photo{position:absolute;inset:0}
.il .frame.whole-photo img{object-fit:contain}

/* ── section heads with arrows ── */
.il .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:48px}
.il .arrows{display:flex;gap:8px;flex:none}
.il .arrows button{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,opacity .25s}
@media (hover:hover){.il .arrows button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.il .arrows button:disabled{opacity:.3;cursor:default}
.il .rail{display:grid;grid-auto-flow:column;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;
  padding-inline:var(--pad);scroll-padding-inline:var(--pad);scrollbar-width:none;-ms-overflow-style:none;cursor:grab}
.il .rail::-webkit-scrollbar{display:none}
.il .rail.drag{scroll-snap-type:none;cursor:grabbing;user-select:none}
.il .rail.drag a{pointer-events:none}
@media (max-width:767px){.il .head .arrows{display:none}}

/* ── 2 · categories ── */
.il-cats{padding:var(--sec) 0 calc(var(--sec) * .72)}
.il-cats .rail{grid-auto-columns:clamp(260px,28.6vw,440px)}
.il-cats .cat{position:relative;display:block;aspect-ratio:1 / 1.08;border-radius:8px;overflow:hidden;color:#fff;scroll-snap-align:start;isolation:isolate}
.il-cats .cph{position:absolute;inset:0;border-radius:inherit}
.il-cats .cshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,0) 38%)}
.il-cats .clab{position:absolute;left:22px;bottom:20px;font-size:21px;font-weight:500;letter-spacing:-.025em}
.il-cats .cgo{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;transition:transform .5s var(--ease),background-color .3s}
@media (hover:hover){.il-cats .cat:hover .cgo{transform:rotate(45deg);background:var(--r)}}
@media (max-width:767px){.il-cats .rail{grid-auto-columns:76vw}}

/* ── 3 · Jeep og RAM | Leapmotor ── */
.il-split{--x:50%;position:relative;height:clamp(640px,100svh,940px);overflow:hidden;color:#fff;background:#0E1012;touch-action:pan-y;user-select:none}
.il-split .side{position:absolute;inset:0}
.il-split .side.jr{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.il-split .sbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.il-split .jr .sbg{object-position:8% 62%}
.il-split .lp .sbg{object-position:82% 58%}
.il-split .sshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.78) 0%,rgba(8,10,12,.2) 40%,rgba(8,10,12,0) 60%),linear-gradient(180deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,.1) 30%,rgba(8,10,12,0) 45%)}
.il-split .sbody{position:absolute;bottom:clamp(96px,12vh,128px);width:min(560px,40vw)}
.il-split .scopy{position:absolute;inset:0;pointer-events:none}
.il-split .sbody.jr{left:var(--pad)}
.il-split .sbody.lp{right:var(--pad);text-align:right}
.il-split .sbody[hidden]{display:none}
.il-split .sbody .slink{pointer-events:auto}
.il-split .sname{font-size:clamp(56px,7vw,116px);font-weight:500;letter-spacing:-.05em;line-height:.9}
.il-split .sname.two{font-size:clamp(52px,6.2vw,104px)}
.il-split .sname.two span{font-weight:400;opacity:.62}
.il-split .ssub{font-size:15px;line-height:1.5;color:rgba(255,255,255,.82);margin:16px 0 16px}
.il-split .slink{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:500;color:#fff;border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:2px}
@media (hover:hover){.il-split .slink:hover{border-color:#fff}}
.il-split .stitle{position:absolute;top:clamp(124px,15vh,170px);left:0;right:0;text-align:center;pointer-events:none;padding-inline:var(--pad)}
.il-split .stitle .eyebrow{justify-content:center;color:rgba(255,255,255,.78)}
.il-split .stitle h2{font-size:clamp(40px,4.6vw,72px)}
.il-split .divider{position:absolute;top:0;bottom:0;left:var(--x);width:1px;background:rgba(255,255,255,.8);transform:translateX(-.5px);pointer-events:none}
.il-split .handle{position:absolute;top:58%;left:var(--x);transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:var(--r);color:#fff;
  display:flex;align-items:center;justify-content:center;cursor:ew-resize;touch-action:none;box-shadow:0 10px 34px rgba(0,0,0,.35);transition:transform .35s var(--ease)}
@media (hover:hover){.il-split .handle:hover{transform:translate(-50%,-50%) scale(1.08)}}
.il-split .stabs{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;display:none;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.il-split .stabs button{min-height:40px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;color:#fff;white-space:nowrap}
@media (hover:none),(max-width:899px){.il-split .stabs{display:flex}}
@media (max-width:899px){
  .il-split{height:max(620px,90svh)}
  .il-split .stabs{bottom:calc(90px + env(safe-area-inset-bottom))}
  .il-split .sbody{width:calc(50% - var(--pad) - 28px);bottom:calc(178px + env(safe-area-inset-bottom))}
  .il-split .sname{font-size:clamp(26px,7.2vw,56px)}
  .il-split .sname.two{font-size:clamp(26px,7.2vw,56px)}
  .il-split .ssub{font-size:12px;margin:12px 0 0}
  .il-split .slink{margin-top:12px;font-size:14px}
  .il-split .stitle{top:calc(100px + env(safe-area-inset-top))}
  .il-split .stitle h2{font-size:clamp(34px,9.6vw,48px)}
  .il-split .jr .sbg{object-position:14% 62%}
}

/* ── 4 · featured ── */
.il-feat{padding:var(--sec) 0;background:var(--stone)}
.il-feat .filters{display:flex;justify-content:center;gap:28px;margin:30px 0 56px;flex-wrap:wrap}
.il-feat .filters button{position:relative;min-height:40px;font-size:15px;font-weight:500;color:var(--mute);transition:color .25s}
.il-feat .filters button::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1.5px;background:var(--ink);transform:scaleX(0);transition:transform .45s var(--ease)}
.il-feat .filters button[aria-pressed="true"]{color:var(--ink)}
.il-feat .filters button[aria-pressed="true"]::after{transform:scaleX(1)}
@media (hover:hover){.il-feat .filters button:hover{color:var(--ink)}}
.il-feat .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:56px 24px}
.il-feat .car{display:block}
.il-feat .ph{aspect-ratio:4 / 3;border-radius:8px;overflow:hidden;background:#E6E5DF}
.il-feat .ph.studio{background:#fff}
.il-feat .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.il-feat .car:hover .ph img{transform:scale(1.035)}.il-feat .car:hover .pr svg{transform:translate(2px,-2px)}}
.il-feat .meta{display:flex;gap:10px;margin-top:18px;font-size:13.5px;color:var(--mute)}
.il-feat .meta span:first-child{color:var(--ink);font-weight:500}
.il-feat h3{font-size:clamp(24px,2vw,30px);line-height:1.1;margin-top:4px}
.il-feat .pr{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:16px;font-weight:500}
.il-feat .pr svg{transition:transform .4s var(--ease)}
.il-feat .note{font-size:12.5px;color:var(--mute);margin-top:6px;line-height:1.5}
.il-feat .fine{text-align:center;font-size:12.5px;color:var(--mute);margin-top:20px}
.il-feat .loan{display:flex;justify-content:space-between;align-items:center;gap:16px 40px;flex-wrap:wrap;margin-top:72px;padding:22px 26px;border-radius:8px;background:#fff;font-size:15px}
.il-feat .loan p{max-width:760px;color:var(--mute)}
.il-feat .loan strong{color:var(--ink);font-weight:500}
.il-feat .loan a{display:inline-flex;align-items:center;gap:6px;font-weight:500;border-bottom:1px solid rgba(12,12,11,.3);padding-bottom:2px;white-space:nowrap}
@media (hover:hover){.il-feat .loan a:hover{border-color:var(--ink)}}
.il-feat .filters button svg{vertical-align:-1px;margin-left:4px}
@media (max-width:1099px){.il-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .il-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 12px}
  .il-feat .ph{border-radius:6px}
  .il-feat .meta{margin-top:12px;font-size:12.5px}
  .il-feat .meta span:last-child{display:none}
  .il-feat h3{font-size:18px;line-height:1.15}
  .il-feat .pr{font-size:14px;margin-top:6px}
  .il-feat .pr svg{display:none}
  .il-feat .note{font-size:11.5px;line-height:1.45}
  .il-feat .loan{margin-top:48px;padding:18px}
  .il-feat .filters{flex-wrap:nowrap;justify-content:flex-start;gap:22px;overflow-x:auto;margin:22px calc(var(--pad) * -1) 32px;padding-inline:var(--pad);scrollbar-width:none}
  .il-feat .filters::-webkit-scrollbar{display:none}
  .il-feat .filters button{flex:none}
}

/* ── 5 · used ── */
.il-used{padding:var(--sec) 0 calc(var(--sec) * .8)}
.il-used .rail{grid-auto-columns:clamp(260px,23.6vw,360px);gap:20px}
.il-used .uc{display:block;scroll-snap-align:start}
.il-used .uph{border-radius:8px}
.il-used .um{margin-top:16px;font-size:13.5px;color:var(--mute)}
.il-used h3{font-size:19px;line-height:1.3;margin-top:4px}
.il-used .up{display:flex;gap:10px;align-items:baseline;margin-top:8px;font-size:16px;font-weight:500}
.il-used .up s{font-size:13.5px;font-weight:400;color:var(--mute)}
@media (hover:hover){.il-used .uc:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.il-used .ufoot{display:flex;justify-content:space-between;align-items:center;gap:24px 48px;margin-top:56px;flex-wrap:wrap}
.il-used .ufoot p{max-width:620px;font-size:14px;color:var(--mute)}
@media (max-width:767px){.il-used .rail{grid-auto-columns:74vw}}

/* ── 6 · service collage ── */
.il-serv{padding:var(--sec) 0 calc(var(--sec) * 1.1);background:#fff}
.il-serv .collage{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;row-gap:96px;align-items:start}
.il-serv .intro{grid-column:1 / 6;grid-row:1}
.il-serv .intro p{color:rgba(12,12,11,.78);max-width:440px;margin:24px 0 28px}
.il-serv .hrs{max-width:440px;margin-bottom:32px}
.il-serv .hrs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid var(--line);font-size:15px}
.il-serv .hrs dt{color:var(--mute)}
.il-serv .hrs a{font-weight:500}
.il-serv .f{margin:0}
.il-serv .fa{grid-column:7 / 13;grid-row:1;margin-top:40px}
.il-serv .fb{grid-column:1 / 7;grid-row:2}
.il-serv .fd{grid-column:8 / 12;grid-row:2;align-self:start;margin-top:120px}
.il-serv .fc{grid-column:4 / 9;grid-row:3}
.il-serv .frame{border-radius:6px}
.il-serv figcaption{font-size:13.5px;line-height:1.55;color:var(--mute);margin-top:14px;max-width:380px}
.il-serv figcaption a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.il-serv .sos{display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:240px;background:var(--r);color:#fff;padding:28px;border-radius:6px;transition:transform .5s var(--ease)}
.il-serv .sos .k{font-size:15px;font-weight:500;max-width:240px;line-height:1.4}
.il-serv .sos .v{font-size:clamp(52px,5vw,80px);font-weight:500;line-height:.95;letter-spacing:-.045em}
@media (max-width:899px){
  .il-serv .collage{grid-template-columns:minmax(0,1fr);row-gap:56px}
  .il-serv .intro,.il-serv .fa,.il-serv .fb,.il-serv .fc,.il-serv .fd{grid-column:1;grid-row:auto;margin-top:0}
  .il-serv .sos{min-height:200px}
}

/* ── 7 · statement, in ÍSBAND red ── */
.il-statement{position:relative;background:var(--r);color:#fff;padding:clamp(96px,10vw,150px) 0 clamp(96px,11vw,160px);will-change:clip-path}
.il-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.il-statement .roman{font-size:14px;font-weight:600;letter-spacing:.18em;margin-bottom:28px;opacity:.86}
.il-statement h2{font-size:clamp(52px,8.2vw,136px);line-height:.96;letter-spacing:-.05em}
.il-statement h2 span{display:block}
.il-statement p{max-width:600px;margin:32px auto 0;font-size:17px;color:#fff}
.il-statement .spk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;max-width:900px;margin:48px auto 0;background:rgba(255,255,255,.28);border-radius:8px;overflow:hidden}
.il-statement .spk a{display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;text-align:left;padding:18px 20px;background:var(--r);transition:background-color .3s var(--ease)}
.il-statement .spk span:first-child{font-weight:500;font-size:16px}
.il-statement .spk span:nth-child(2){grid-row:2;font-size:14px;opacity:.86}
.il-statement .spk svg{grid-row:1 / 3;grid-column:2}
@media (hover:hover){.il-statement .spk a:hover{background:#004B80}}
@media (max-width:767px){.il-statement .spk{grid-template-columns:minmax(0,1fr)}}
.il-statement .sfig{max-width:1080px;margin:80px auto 0;padding-inline:var(--pad)}
.il-statement .frame{background:#004574;border-radius:6px}
.il-statement figcaption{text-align:center;font-size:13px;color:rgba(255,255,255,.86);margin-top:14px}

/* ── 8 · heritage float ── */
.il-heritage{position:relative;padding:calc(var(--sec) * .5) 0 calc(var(--sec) * .6);background:#fff;overflow:hidden}
.il-heritage .fstage{position:relative;min-height:max(780px,120vh);display:grid;place-items:center}
.il-heritage .floats{position:absolute;inset:0;pointer-events:none}
.il-heritage .fl{position:absolute;margin:0}
.il-heritage .fl img{width:100%;height:auto;border-radius:6px}
.il-heritage .fl figcaption{font-size:13px;color:var(--mute);margin-top:10px}
.il-heritage .f1{left:3%;top:4%;width:22vw}
.il-heritage .f2{right:5%;top:0;width:18vw}
.il-heritage .f3{left:6%;top:52%;width:26vw}
.il-heritage .f4{right:3%;top:38%;width:21vw}
.il-heritage .f5{right:22%;top:76%;width:18vw}
.il-heritage .hcopy{position:relative;z-index:2;max-width:540px;text-align:center;padding:40px var(--pad);background:radial-gradient(closest-side,rgba(255,255,255,.97) 60%,rgba(255,255,255,0))}
.il-heritage .hcopy .eyebrow{justify-content:center}
.il-heritage .hcopy h2{font-size:clamp(44px,5.4vw,84px)}
.il-heritage .hcopy p{color:rgba(12,12,11,.78);margin:24px auto 32px;max-width:440px}
@media (max-width:899px){
  .il-heritage .fstage{min-height:0;padding:220px 0 240px}
  .il-heritage .f1{left:3%;top:0;width:44vw}
  .il-heritage .f2{right:3%;top:48px;width:40vw}
  .il-heritage .f3{left:5%;top:auto;bottom:0;width:46vw}
  .il-heritage .f4{right:4%;top:auto;bottom:44px;width:38vw}
  .il-heritage .f5{display:none}
  .il-heritage .fl figcaption{font-size:11.5px}
}

/* ── 9 · practical ── */
.il-info{padding:var(--sec) 0;background:var(--stone)}
.il-info .head1{margin-bottom:48px}
.il-info .head1 .sub{margin-top:14px;font-size:14px;color:var(--mute)}
.il-info .rows{border-bottom:1px solid rgba(12,12,11,.12)}
.il-info .r{display:grid;grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px;gap:24px;align-items:center;padding:26px 0;border-top:1px solid rgba(12,12,11,.12)}
.il-info .r h3{font-size:22px;line-height:1.2}
.il-info .r > a{font-size:15px;width:max-content}
@media (hover:hover){.il-info .r > a:hover{text-decoration:underline;text-underline-offset:3px}}
.il-info .r .tel{font-size:18px;font-weight:500}
.il-info .r dl div{display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:2px 0}
.il-info .r dt{color:var(--mute)}
.il-info .st{justify-self:end;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-size:13px;font-weight:500;padding:6px 12px;border-radius:999px;background:#fff}
.il-info .st i{width:6px;height:6px;border-radius:50%;background:#9A9A93}
.il-info .st.on{background:var(--r);color:#fff}
.il-info .st.on i{background:#fff}
.il-info .r dl .dn{font-size:12.5px;color:var(--mute);padding-top:4px}
.il-info .r.em{grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px}
.il-info .r.em > span{font-size:15px;color:var(--mute)}
@media (max-width:1099px){
  .il-info .r,.il-info .r.em{grid-template-columns:1fr auto;gap:8px 16px;padding:22px 0}
  .il-info .r h3{grid-column:1}
  .il-info .r .st{grid-column:2;grid-row:1}
  .il-info .r > a,.il-info .r dl,.il-info .r.em > span{grid-column:1 / -1}
  .il-info .r dl{max-width:420px;margin-top:6px}
}

/* ── 10 · test drive ── */
.il-drive{position:relative;min-height:780px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:180px 0 104px}
.il-drive .dbg{position:absolute;inset:0;overflow:hidden}
.il-drive .dbg .par{position:absolute;inset:-10% 0}
.il-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 58%}
.il-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.9) 0%,rgba(8,10,12,.55) 42%,rgba(8,10,12,.2) 100%)}
.il-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.il-drive h2{font-size:clamp(38px,4.3vw,64px)}
.il-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.82);margin-top:18px}
.il-drive .dcopy .demo{font-size:13.5px;color:rgba(255,255,255,.62);margin-top:12px}
.il-drive .dform{display:grid;gap:16px;padding:30px;border-radius:10px;background:rgba(12,12,11,.62);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.il-drive label span{display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:2px}
.il-drive input,.il-drive select{width:100%;height:48px;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.4);border-radius:0;color:#fff;font:16px 'IlF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .25s}
.il-drive select{background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.il-drive select option{color:var(--ink);background-color:#fff}
.il-drive input:focus,.il-drive select:focus{border-bottom-color:var(--r);box-shadow:0 1px 0 0 var(--r)}
.il-drive .dform .btn{justify-self:start;margin-top:8px}
.il-drive .done{font-size:14px;background:rgba(255,255,255,.08);padding:12px 14px;border-left:3px solid var(--r);border-radius:2px}
@media (max-width:899px){
  .il-drive{min-height:0;padding:150px 0 110px}
  .il-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .il-drive .dshade{background:linear-gradient(rgba(8,10,12,.66),rgba(8,10,12,.66)),linear-gradient(0deg,rgba(8,10,12,.9),rgba(8,10,12,.2))}
  .il-drive .dcopy p,.il-drive .dcopy .demo{color:#fff}
  .il-drive .dform{padding:22px}
}

/* ── footer ── */
.il-foot{background:#fff;padding:104px 0 48px}
.il-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:48px;align-items:start}
.il-foot .fbrand img{width:clamp(180px,17vw,250px);height:auto}
.il-foot .fbrand p{margin-top:18px;font-size:15px;color:var(--mute)}
.il-foot .fnav{display:flex;flex-direction:column;gap:2px}
.il-foot .fnav a{font-size:clamp(24px,2.2vw,32px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.il-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.il-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end}
.il-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.il-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.il-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:80px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.il-foot .proto{font-size:12px;line-height:1.6;color:var(--mute);margin-top:20px}
@media (max-width:899px){
  .il-foot{padding:80px 0 calc(110px + env(safe-area-inset-bottom))}
  .il-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:40px}
  .il-foot .fside{align-items:flex-start}
  .il-foot .flegal{margin-top:56px}
}

/* ── mobile sticky CTA ── */
.il-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(12,12,11,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.il-sticky a,.il-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.il-sticky a:nth-child(2){background:var(--r);color:#fff}
@media (max-width:899px){.il-sticky{display:grid}}
.il[data-sticky="1"] .il-sticky{transform:none}
.il.menu-open .il-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes ÍSBAND's colours, never SNDR's ── */
.il sndr-chat{--chat-accent:${RED};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#62625C;--chat-line:#E6E5E0;--chat-sunk:#F3F2EE;--chat-radius:14px;--chat-font:'IlF',system-ui,sans-serif}
@media (max-width:899px){.il sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .il *,.il *::before,.il *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .il-statement{clip-path:none!important}
}
`
