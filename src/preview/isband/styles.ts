/*
 * ÍSBAND — the whole visual system, transplanted from Bílabúð Benna. Tokens in
 * DESIGN.md. One family: Host Grotesk, set tight and in sentence case. Colour:
 * ink, white, stone and one red. The logo keeps the #EC1840 sampled from
 * ÍSBAND's own mark; surfaces that carry white text use #E0123D, the nearest
 * red that clears 4.5:1 against white (#EC1840 measures 4.4:1).
 */
const B = import.meta.env.BASE_URL
export const INK = '#0C0C0B'
export const RED = '#E0123D'
const EASE = 'cubic-bezier(.625,.05,0,1)'

export const CSS = `
@font-face{font-family:'IbF';src:url('${B}fonts/isband/host-grotesk-v5-latin_latin-ext-regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'IbF';src:url('${B}fonts/isband/host-grotesk-v5-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'IbF';src:url('${B}fonts/isband/host-grotesk-v5-latin_latin-ext-600.woff2') format('woff2');font-weight:600;font-display:swap}

html,body{background-color:${INK}}
html.ib-menu,html.ib-menu body{overflow:hidden}

.ib{--ink:${INK};--paper:#FFFFFF;--stone:#F3F2EE;--line:#E6E5E0;--mute:#62625C;--r:${RED};--ease:${EASE};
  --pad:clamp(16px,3.4vw,48px);--sec:clamp(96px,11vw,168px);
  font-family:'IbF',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.006em;color:var(--ink);background:var(--paper);
  overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-kerning:normal;font-feature-settings:'ss01' 0}
.ib *{box-sizing:border-box}
.ib a{color:inherit;text-decoration:none}
.ib p,.ib h1,.ib h2,.ib h3,.ib figure,.ib ul,.ib ol,.ib dl,.ib dd{margin:0}
.ib ul,.ib ol{padding:0;list-style:none}
.ib img{display:block;max-width:100%}
.ib button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.ib a,.ib button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.ib :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px}
.ib .ib-hero :focus-visible,.ib .ib-split :focus-visible,.ib .ib-drive :focus-visible,
.ib .bar :focus-visible,.ib .ib-menu-panel :focus-visible,.ib .ib-sticky :focus-visible,.ib .plate.top .kf{outline:2px solid var(--r);outline-offset:3px}
.ib .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ib .skip{position:fixed;left:16px;top:-120px;z-index:300;background:var(--r);color:#fff;padding:12px 18px;border-radius:4px;font-weight:600}
.ib .skip:focus{top:16px}
.ib section[id]{scroll-margin-top:84px}
.ib .wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.ib .tab,.ib .up,.ib .tel,.ib .pr{font-variant-numeric:tabular-nums}

/* ── type ── */
.ib h1,.ib h2{font-weight:500;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.ib h2{font-size:clamp(38px,4.3vw,64px)}
.ib h3{font-weight:500;letter-spacing:-.02em;text-wrap:balance}
.ib [data-chars] .ch-mask{padding:.16em .04em .1em;margin:-.16em -.04em -.1em}
.ib .eyebrow{display:flex;align-items:center;gap:9px;margin-bottom:20px;font-size:14px;font-weight:500;line-height:1.2;letter-spacing:-.005em;color:var(--mute)}
.ib .eyebrow i{width:5px;height:5px;border-radius:50%;background:var(--ink);flex:none}
.ib .center{text-align:center}
.ib .center .eyebrow{justify-content:center}

/* ── buttons: Spyker's open-from-the-middle and rolling label, Drivehub's plain shape ── */
.ib .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 22px;border-radius:4px;
  font-size:15px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;
  transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease)}
.ib .btn .lbl{display:inline-flex;overflow:hidden;height:1.35em;line-height:1.35em}
.ib .btn .c{display:inline-block;text-shadow:0 1.35em 0 currentColor;transition:transform .32s var(--ease);transition-delay:calc(var(--i) * 6ms)}
.ib .btn-light{background:#fff;color:var(--ink)}
.ib .btn-ghost{color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.ib .btn-dark{background:var(--ink);color:#fff}
.ib .btn-red{background:var(--r);color:#fff}
.ib .btn-line{box-shadow:inset 0 0 0 1px rgba(12,12,11,.22);color:var(--ink)}
@media (hover:hover){
  .ib .btn:hover .c{transform:translateY(-1.35em)}
  .ib .btn-light:hover{background:var(--r);color:#fff}
  .ib .btn-red:hover{background:#B80E31}
  .ib .btn-ghost:hover{box-shadow:inset 0 0 0 1px #fff}
  .ib .btn-dark:hover{background:#2A2A27}
  .ib .btn-line:hover{box-shadow:inset 0 0 0 1px var(--ink)}
}

/* ── loader ── */
.ib-loader{position:fixed;inset:0;z-index:250;background:${INK};display:grid;place-content:center;justify-items:center;gap:26px}
.ib-loader .mk img{width:min(64vw,420px);height:auto}
.ib-loader .yr{font-size:15px;font-weight:500;letter-spacing:-.01em;color:rgba(255,255,255,.72);opacity:0;visibility:hidden}

/* ── chrome ── */
.ib-chrome{position:fixed;inset:0 0 auto 0;z-index:60;padding-top:env(safe-area-inset-top);transition:transform .55s var(--ease)}
.ib-chrome::before{content:'';position:absolute;inset:0 0 auto 0;height:env(safe-area-inset-top);background:${INK};z-index:3}
.ib-chrome[data-hide="1"]{transform:translateY(calc(-100% - 2px))}
.ib-chrome .bar,.ib-chrome .hdr{transform:translateY(var(--bar,0px))}
.ib .bar{height:38px;background:${INK};color:rgba(255,255,255,.74);font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.07)}
.ib .bar .in{display:flex;align-items:center;gap:28px;height:100%;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.ib .bar a{display:inline-flex;align-items:center;gap:7px;transition:color .2s}
@media (hover:hover){.ib .bar a:hover{color:#fff}}
.ib .bar .st{margin-left:auto;display:inline-flex;align-items:center;gap:8px}
.ib .bar .st i{width:6px;height:6px;border-radius:50%;background:#77776F}
.ib .bar .st.on i{background:var(--r)}
.ib .hdr{position:relative;height:74px}
.ib .plate{position:absolute;inset:0;transition:background-color .35s var(--ease)}
.ib .plate.base{color:var(--ink)}
.ib .plate.top{color:#fff}
.ib-chrome[data-solid="1"] .plate.base{background:rgba(255,255,255,.88);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(12,12,11,.07)}
.ib-chrome[data-solid="1"] .plate.top{background:rgba(12,12,11,.78);-webkit-backdrop-filter:saturate(1.5) blur(16px);backdrop-filter:saturate(1.5) blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.ib .row{display:flex;align-items:center;gap:28px;height:74px;max-width:1440px;margin:0 auto;padding-inline:var(--pad)}
.ib .row .logo{display:block;flex:none}
.ib .row .logo img{height:30px;width:auto}
.ib .row .links{display:flex;gap:32px;margin:0 auto;font-size:15px;font-weight:500;letter-spacing:-.01em}
.ib .row .nl{position:relative;padding:6px 0}
.ib .row .nl::after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .45s var(--ease)}
@media (hover:hover){.ib .row .nl:hover::after{transform:scaleX(1);transform-origin:left}}
.ib .row .acts{display:flex;align-items:center;gap:8px;margin-left:auto}
.ib .row .links + .acts{margin-left:0}
.ib .row .pill{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:999px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;transition:background-color .3s var(--ease),color .3s var(--ease)}
.ib .plate.base .pill{background:var(--ink);color:#fff}
.ib .plate.top .pill{background:#fff;color:var(--ink)}
@media (hover:hover){.ib .plate .pill:hover{background:var(--r);color:#fff}}
.ib .row .burger{display:none;width:44px;height:44px;place-items:center}
@media (max-width:1100px){.ib .row .links{gap:22px;font-size:14px}}
@media (max-width:1023px){
  .ib .row .links{display:none}
  .ib .row .burger{display:grid}
  .ib .row .links + .acts{margin-left:auto}
  .ib .row .logo img{height:26px}
}
@media (max-width:639px){
  .ib .row .pill{display:none}
  .ib .bar .hide-s{display:none}
  .ib .row{gap:12px}
}

/* ── menu ── */
.ib-menu-panel{position:fixed;inset:0;z-index:120;background:${INK};color:#fff;display:flex;flex-direction:column;
  padding:calc(12px + env(safe-area-inset-top)) var(--pad) calc(24px + env(safe-area-inset-bottom));overflow-y:auto}
.ib-menu-panel .mtop{display:flex;justify-content:space-between;align-items:center;min-height:56px}
.ib-menu-panel .mtop img{height:26px;width:auto}
.ib-menu-panel .mx{width:48px;height:48px;display:grid;place-items:center}
.ib-menu-panel nav{display:flex;flex-direction:column;margin-top:40px}
.ib-menu-panel nav a{font-size:clamp(34px,9.4vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1.18;padding:4px 0}
.ib-menu-panel .mfoot{margin-top:auto;display:grid;gap:12px;padding-top:32px;font-size:15px;color:rgba(255,255,255,.78)}
.ib-menu-panel .mfoot a,.ib-menu-panel .mfoot button{display:inline-flex;align-items:center;gap:10px;min-height:44px}
.ib-menu-panel .mfoot a{font-size:26px;font-weight:500;letter-spacing:-.03em;color:#fff}
.ib-menu-panel .mfoot p{font-size:13px;color:rgba(255,255,255,.58)}

/* ── 1 · hero ── */
.ib-hero{position:relative;height:100svh;min-height:640px;background:var(--paper)}
.ib-hero .hframe{position:absolute;inset:0;overflow:hidden;background:#15181B;color:#fff;will-change:transform}
.ib-hero .hpar{position:absolute;inset:0 0 -18% 0}
.ib-hero .hpic{width:100%;height:100%;object-fit:cover;object-position:60% 52%}
.ib-hero .shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(8,10,12,.74) 0%,rgba(8,10,12,.44) 34%,rgba(8,10,12,0) 60%),
  linear-gradient(0deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 40%),
  linear-gradient(180deg,rgba(8,10,12,.5) 0%,rgba(8,10,12,0) 22%)}
.ib-hero .copy{position:absolute;left:0;bottom:clamp(72px,12vh,140px);width:min(46%,660px);padding-left:var(--pad)}
.ib-hero .eyebrow{color:rgba(255,255,255,.78)}
.ib-hero h1{font-size:clamp(46px,5.2vw,84px)}
.ib-hero h1 span{display:block}
.ib-hero .lede{max-width:420px;margin-top:22px;font-size:17px;line-height:1.55;color:rgba(255,255,255,.82)}
.ib-hero .ctas{display:flex;gap:10px;margin-top:32px;flex-wrap:wrap}
.ib-hero .hmeta{position:absolute;left:var(--pad);bottom:clamp(24px,4vh,40px);font-size:12.5px;color:rgba(255,255,255,.6)}
@media (max-width:899px){
  .ib-hero .hpar{inset:0 0 30% 0}
  .ib-hero .hpic{object-position:74% 58%}
  .ib-hero .shade{background:linear-gradient(0deg,#15181B 0%,#15181B 38%,rgba(21,24,27,.6) 52%,rgba(21,24,27,0) 66%),linear-gradient(180deg,rgba(8,10,12,.55) 0%,rgba(8,10,12,0) 24%)}
  .ib-hero .copy{left:0;right:0;width:auto;padding-inline:var(--pad);bottom:calc(104px + env(safe-area-inset-bottom))}
  .ib-hero h1{font-size:clamp(40px,11.4vw,58px)}
  .ib-hero .lede{font-size:16px;margin-top:16px}
  .ib-hero .ctas{margin-top:24px}
  .ib-hero .hmeta{bottom:calc(82px + env(safe-area-inset-bottom));font-size:12px}
}

/* ── frames (media reveal + inner parallax) ── */
.ib .frame{position:relative;overflow:hidden;background:#E4E3DD}
.ib .frame .par{position:absolute;inset:-10% 0}
.ib .frame img{width:100%;height:100%;object-fit:cover}
.ib .frame .still-photo{position:absolute;inset:0}
.ib .frame.whole-photo img{object-fit:contain}

/* ── section heads with arrows ── */
.ib .head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:48px}
.ib .arrows{display:flex;gap:8px;flex:none}
.ib .arrows button{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,opacity .25s}
@media (hover:hover){.ib .arrows button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--ink)}}
.ib .arrows button:disabled{opacity:.3;cursor:default}
.ib .rail{display:grid;grid-auto-flow:column;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;
  padding-inline:var(--pad);scroll-padding-inline:var(--pad);scrollbar-width:none;-ms-overflow-style:none;cursor:grab}
.ib .rail::-webkit-scrollbar{display:none}
.ib .rail.drag{scroll-snap-type:none;cursor:grabbing;user-select:none}
.ib .rail.drag a{pointer-events:none}
@media (max-width:767px){.ib .head .arrows{display:none}}

/* ── 2 · categories ── */
.ib-cats{padding:var(--sec) 0 calc(var(--sec) * .72)}
.ib-cats .rail{grid-auto-columns:clamp(260px,28.6vw,440px)}
.ib-cats .cat{position:relative;display:block;aspect-ratio:1 / 1.08;border-radius:8px;overflow:hidden;color:#fff;scroll-snap-align:start;isolation:isolate}
.ib-cats .cph{position:absolute;inset:0;border-radius:inherit}
.ib-cats .cshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,0) 38%)}
.ib-cats .clab{position:absolute;left:22px;bottom:20px;font-size:21px;font-weight:500;letter-spacing:-.025em}
.ib-cats .cgo{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;transition:transform .5s var(--ease),background-color .3s}
@media (hover:hover){.ib-cats .cat:hover .cgo{transform:rotate(45deg);background:var(--r)}}
@media (max-width:767px){.ib-cats .rail{grid-auto-columns:76vw}}

/* ── 3 · Jeep og RAM | Leapmotor ── */
.ib-split{--x:50%;position:relative;height:clamp(640px,100svh,940px);overflow:hidden;color:#fff;background:#0E1012;touch-action:pan-y;user-select:none}
.ib-split .side{position:absolute;inset:0}
.ib-split .side.jr{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.ib-split .sbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ib-split .jr .sbg{object-position:8% 62%}
.ib-split .lp .sbg{object-position:82% 58%}
.ib-split .sshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.78) 0%,rgba(8,10,12,.2) 40%,rgba(8,10,12,0) 60%),linear-gradient(180deg,rgba(8,10,12,.62) 0%,rgba(8,10,12,.1) 30%,rgba(8,10,12,0) 45%)}
.ib-split .sbody{position:absolute;bottom:clamp(96px,12vh,128px);width:min(560px,40vw)}
.ib-split .scopy{position:absolute;inset:0;pointer-events:none}
.ib-split .sbody.jr{left:var(--pad)}
.ib-split .sbody.lp{right:var(--pad);text-align:right}
.ib-split .sbody[hidden]{display:none}
.ib-split .sbody .slink{pointer-events:auto}
.ib-split .sname{font-size:clamp(56px,7vw,116px);font-weight:500;letter-spacing:-.05em;line-height:.9}
.ib-split .sname.two{font-size:clamp(52px,6.2vw,104px)}
.ib-split .sname.two span{font-weight:400;opacity:.62}
.ib-split .ssub{font-size:15px;line-height:1.5;color:rgba(255,255,255,.82);margin:16px 0 16px}
.ib-split .slink{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:500;color:#fff;border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:2px}
@media (hover:hover){.ib-split .slink:hover{border-color:#fff}}
.ib-split .stitle{position:absolute;top:clamp(124px,15vh,170px);left:0;right:0;text-align:center;pointer-events:none;padding-inline:var(--pad)}
.ib-split .stitle .eyebrow{justify-content:center;color:rgba(255,255,255,.78)}
.ib-split .stitle h2{font-size:clamp(40px,4.6vw,72px)}
.ib-split .divider{position:absolute;top:0;bottom:0;left:var(--x);width:1px;background:rgba(255,255,255,.8);transform:translateX(-.5px);pointer-events:none}
.ib-split .handle{position:absolute;top:58%;left:var(--x);transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:var(--r);color:#fff;
  display:flex;align-items:center;justify-content:center;cursor:ew-resize;touch-action:none;box-shadow:0 10px 34px rgba(0,0,0,.35);transition:transform .35s var(--ease)}
@media (hover:hover){.ib-split .handle:hover{transform:translate(-50%,-50%) scale(1.08)}}
.ib-split .stabs{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;display:none;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.ib-split .stabs button{min-height:40px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;color:#fff;white-space:nowrap}
@media (hover:none),(max-width:899px){.ib-split .stabs{display:flex}}
@media (max-width:899px){
  .ib-split{height:max(620px,90svh)}
  .ib-split .stabs{bottom:calc(90px + env(safe-area-inset-bottom))}
  .ib-split .sbody{width:calc(50% - var(--pad) - 28px);bottom:calc(178px + env(safe-area-inset-bottom))}
  .ib-split .sname{font-size:clamp(26px,7.2vw,56px)}
  .ib-split .sname.two{font-size:clamp(26px,7.2vw,56px)}
  .ib-split .ssub{font-size:12px;margin:12px 0 0}
  .ib-split .slink{margin-top:12px;font-size:14px}
  .ib-split .stitle{top:calc(100px + env(safe-area-inset-top))}
  .ib-split .stitle h2{font-size:clamp(34px,9.6vw,48px)}
  .ib-split .jr .sbg{object-position:14% 62%}
}

/* ── 4 · featured ── */
.ib-feat{padding:var(--sec) 0;background:var(--stone)}
.ib-feat .filters{display:flex;justify-content:center;gap:28px;margin:30px 0 56px;flex-wrap:wrap}
.ib-feat .filters button{position:relative;min-height:40px;font-size:15px;font-weight:500;color:var(--mute);transition:color .25s}
.ib-feat .filters button::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1.5px;background:var(--ink);transform:scaleX(0);transition:transform .45s var(--ease)}
.ib-feat .filters button[aria-pressed="true"]{color:var(--ink)}
.ib-feat .filters button[aria-pressed="true"]::after{transform:scaleX(1)}
@media (hover:hover){.ib-feat .filters button:hover{color:var(--ink)}}
.ib-feat .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:56px 24px}
.ib-feat .car{display:block}
.ib-feat .ph{aspect-ratio:4 / 3;border-radius:8px;overflow:hidden;background:#E6E5DF}
.ib-feat .ph.studio{background:#fff}
.ib-feat .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover){.ib-feat .car:hover .ph img{transform:scale(1.035)}.ib-feat .car:hover .pr svg{transform:translate(2px,-2px)}}
.ib-feat .meta{display:flex;gap:10px;margin-top:18px;font-size:13.5px;color:var(--mute)}
.ib-feat .meta span:first-child{color:var(--ink);font-weight:500}
.ib-feat h3{font-size:clamp(24px,2vw,30px);line-height:1.1;margin-top:4px}
.ib-feat .pr{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:16px;font-weight:500}
.ib-feat .pr svg{transition:transform .4s var(--ease)}
.ib-feat .note{font-size:12.5px;color:var(--mute);margin-top:6px;line-height:1.5}
.ib-feat .fine{text-align:center;font-size:12.5px;color:var(--mute);margin-top:20px}
.ib-feat .loan{display:flex;justify-content:space-between;align-items:center;gap:16px 40px;flex-wrap:wrap;margin-top:72px;padding:22px 26px;border-radius:8px;background:#fff;font-size:15px}
.ib-feat .loan p{max-width:760px;color:var(--mute)}
.ib-feat .loan strong{color:var(--ink);font-weight:500}
.ib-feat .loan a{display:inline-flex;align-items:center;gap:6px;font-weight:500;border-bottom:1px solid rgba(12,12,11,.3);padding-bottom:2px;white-space:nowrap}
@media (hover:hover){.ib-feat .loan a:hover{border-color:var(--ink)}}
.ib-feat .filters button svg{vertical-align:-1px;margin-left:4px}
@media (max-width:1099px){.ib-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:639px){
  .ib-feat .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 12px}
  .ib-feat .ph{border-radius:6px}
  .ib-feat .meta{margin-top:12px;font-size:12.5px}
  .ib-feat .meta span:last-child{display:none}
  .ib-feat h3{font-size:18px;line-height:1.15}
  .ib-feat .pr{font-size:14px;margin-top:6px}
  .ib-feat .pr svg{display:none}
  .ib-feat .note{font-size:11.5px;line-height:1.45}
  .ib-feat .loan{margin-top:48px;padding:18px}
  .ib-feat .filters{flex-wrap:nowrap;justify-content:flex-start;gap:22px;overflow-x:auto;margin:22px calc(var(--pad) * -1) 32px;padding-inline:var(--pad);scrollbar-width:none}
  .ib-feat .filters::-webkit-scrollbar{display:none}
  .ib-feat .filters button{flex:none}
}

/* ── 5 · used ── */
.ib-used{padding:var(--sec) 0 calc(var(--sec) * .8)}
.ib-used .rail{grid-auto-columns:clamp(260px,23.6vw,360px);gap:20px}
.ib-used .uc{display:block;scroll-snap-align:start}
.ib-used .uph{border-radius:8px}
.ib-used .um{margin-top:16px;font-size:13.5px;color:var(--mute)}
.ib-used h3{font-size:19px;line-height:1.3;margin-top:4px}
.ib-used .up{display:flex;gap:10px;align-items:baseline;margin-top:8px;font-size:16px;font-weight:500}
.ib-used .up s{font-size:13.5px;font-weight:400;color:var(--mute)}
@media (hover:hover){.ib-used .uc:hover h3{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}}
.ib-used .ufoot{display:flex;justify-content:space-between;align-items:center;gap:24px 48px;margin-top:56px;flex-wrap:wrap}
.ib-used .ufoot p{max-width:620px;font-size:14px;color:var(--mute)}
@media (max-width:767px){.ib-used .rail{grid-auto-columns:74vw}}

/* ── 6 · service collage ── */
.ib-serv{padding:var(--sec) 0 calc(var(--sec) * 1.1);background:#fff}
.ib-serv .collage{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;row-gap:96px;align-items:start}
.ib-serv .intro{grid-column:1 / 6;grid-row:1}
.ib-serv .intro p{color:rgba(12,12,11,.78);max-width:440px;margin:24px 0 28px}
.ib-serv .hrs{max-width:440px;margin-bottom:32px}
.ib-serv .hrs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid var(--line);font-size:15px}
.ib-serv .hrs dt{color:var(--mute)}
.ib-serv .hrs a{font-weight:500}
.ib-serv .f{margin:0}
.ib-serv .fa{grid-column:7 / 13;grid-row:1;margin-top:40px}
.ib-serv .fb{grid-column:1 / 7;grid-row:2}
.ib-serv .fd{grid-column:8 / 12;grid-row:2;align-self:start;margin-top:120px}
.ib-serv .fc{grid-column:4 / 9;grid-row:3}
.ib-serv .frame{border-radius:6px}
.ib-serv figcaption{font-size:13.5px;line-height:1.55;color:var(--mute);margin-top:14px;max-width:380px}
.ib-serv figcaption a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.ib-serv .sos{display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:240px;background:var(--r);color:#fff;padding:28px;border-radius:6px;transition:transform .5s var(--ease)}
.ib-serv .sos .k{font-size:15px;font-weight:500;max-width:240px;line-height:1.4}
.ib-serv .sos .v{font-size:clamp(52px,5vw,80px);font-weight:500;line-height:.95;letter-spacing:-.045em}
@media (max-width:899px){
  .ib-serv .collage{grid-template-columns:minmax(0,1fr);row-gap:56px}
  .ib-serv .intro,.ib-serv .fa,.ib-serv .fb,.ib-serv .fc,.ib-serv .fd{grid-column:1;grid-row:auto;margin-top:0}
  .ib-serv .sos{min-height:200px}
}

/* ── 7 · statement, in ÍSBAND red ── */
.ib-statement{position:relative;background:var(--r);color:#fff;padding:clamp(96px,10vw,150px) 0 clamp(96px,11vw,160px);will-change:clip-path}
.ib-statement .scopy{max-width:1100px;margin:0 auto;text-align:center;padding-inline:var(--pad)}
.ib-statement .roman{font-size:14px;font-weight:600;letter-spacing:.18em;margin-bottom:28px;opacity:.86}
.ib-statement h2{font-size:clamp(52px,8.2vw,136px);line-height:.96;letter-spacing:-.05em}
.ib-statement h2 span{display:block}
.ib-statement p{max-width:600px;margin:32px auto 0;font-size:17px;color:#fff}
.ib-statement .spk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;max-width:900px;margin:48px auto 0;background:rgba(255,255,255,.28);border-radius:8px;overflow:hidden}
.ib-statement .spk a{display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;text-align:left;padding:18px 20px;background:var(--r);transition:background-color .3s var(--ease)}
.ib-statement .spk span:first-child{font-weight:500;font-size:16px}
.ib-statement .spk span:nth-child(2){grid-row:2;font-size:14px;opacity:.86}
.ib-statement .spk svg{grid-row:1 / 3;grid-column:2}
@media (hover:hover){.ib-statement .spk a:hover{background:#C40F35}}
@media (max-width:767px){.ib-statement .spk{grid-template-columns:minmax(0,1fr)}}
.ib-statement .sfig{max-width:1080px;margin:80px auto 0;padding-inline:var(--pad)}
.ib-statement .frame{background:#B80E31;border-radius:6px}
.ib-statement figcaption{text-align:center;font-size:13px;color:rgba(255,255,255,.86);margin-top:14px}

/* ── 8 · heritage float ── */
.ib-heritage{position:relative;padding:calc(var(--sec) * .5) 0 calc(var(--sec) * .6);background:#fff;overflow:hidden}
.ib-heritage .fstage{position:relative;min-height:max(780px,120vh);display:grid;place-items:center}
.ib-heritage .floats{position:absolute;inset:0;pointer-events:none}
.ib-heritage .fl{position:absolute;margin:0}
.ib-heritage .fl img{width:100%;height:auto;border-radius:6px}
.ib-heritage .fl figcaption{font-size:13px;color:var(--mute);margin-top:10px}
.ib-heritage .f1{left:3%;top:4%;width:22vw}
.ib-heritage .f2{right:5%;top:0;width:18vw}
.ib-heritage .f3{left:6%;top:52%;width:26vw}
.ib-heritage .f4{right:3%;top:38%;width:21vw}
.ib-heritage .f5{right:22%;top:76%;width:18vw}
.ib-heritage .hcopy{position:relative;z-index:2;max-width:540px;text-align:center;padding:40px var(--pad);background:radial-gradient(closest-side,rgba(255,255,255,.97) 60%,rgba(255,255,255,0))}
.ib-heritage .hcopy .eyebrow{justify-content:center}
.ib-heritage .hcopy h2{font-size:clamp(44px,5.4vw,84px)}
.ib-heritage .hcopy p{color:rgba(12,12,11,.78);margin:24px auto 32px;max-width:440px}
@media (max-width:899px){
  .ib-heritage .fstage{min-height:0;padding:220px 0 240px}
  .ib-heritage .f1{left:3%;top:0;width:44vw}
  .ib-heritage .f2{right:3%;top:48px;width:40vw}
  .ib-heritage .f3{left:5%;top:auto;bottom:0;width:46vw}
  .ib-heritage .f4{right:4%;top:auto;bottom:44px;width:38vw}
  .ib-heritage .f5{display:none}
  .ib-heritage .fl figcaption{font-size:11.5px}
}

/* ── 9 · practical ── */
.ib-info{padding:var(--sec) 0;background:var(--stone)}
.ib-info .head1{margin-bottom:48px}
.ib-info .head1 .sub{margin-top:14px;font-size:14px;color:var(--mute)}
.ib-info .rows{border-bottom:1px solid rgba(12,12,11,.12)}
.ib-info .r{display:grid;grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px;gap:24px;align-items:center;padding:26px 0;border-top:1px solid rgba(12,12,11,.12)}
.ib-info .r h3{font-size:22px;line-height:1.2}
.ib-info .r > a{font-size:15px;width:max-content}
@media (hover:hover){.ib-info .r > a:hover{text-decoration:underline;text-underline-offset:3px}}
.ib-info .r .tel{font-size:18px;font-weight:500}
.ib-info .r dl div{display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:2px 0}
.ib-info .r dt{color:var(--mute)}
.ib-info .st{justify-self:end;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-size:13px;font-weight:500;padding:6px 12px;border-radius:999px;background:#fff}
.ib-info .st i{width:6px;height:6px;border-radius:50%;background:#9A9A93}
.ib-info .st.on{background:var(--r);color:#fff}
.ib-info .st.on i{background:#fff}
.ib-info .r dl .dn{font-size:12.5px;color:var(--mute);padding-top:4px}
.ib-info .r.em{grid-template-columns:1.4fr 1fr .8fr 1.6fr 150px}
.ib-info .r.em > span{font-size:15px;color:var(--mute)}
@media (max-width:1099px){
  .ib-info .r,.ib-info .r.em{grid-template-columns:1fr auto;gap:8px 16px;padding:22px 0}
  .ib-info .r h3{grid-column:1}
  .ib-info .r .st{grid-column:2;grid-row:1}
  .ib-info .r > a,.ib-info .r dl,.ib-info .r.em > span{grid-column:1 / -1}
  .ib-info .r dl{max-width:420px;margin-top:6px}
}

/* ── 10 · test drive ── */
.ib-drive{position:relative;min-height:780px;color:#fff;overflow:hidden;display:flex;align-items:flex-end;padding:180px 0 104px}
.ib-drive .dbg{position:absolute;inset:0;overflow:hidden}
.ib-drive .dbg .par{position:absolute;inset:-10% 0}
.ib-drive .dbg img{width:100%;height:100%;object-fit:cover;object-position:50% 58%}
.ib-drive .dshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,10,12,.9) 0%,rgba(8,10,12,.55) 42%,rgba(8,10,12,.2) 100%)}
.ib-drive .dgrid{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:end}
.ib-drive h2{font-size:clamp(38px,4.3vw,64px)}
.ib-drive .dcopy p{max-width:440px;color:rgba(255,255,255,.82);margin-top:18px}
.ib-drive .dcopy .demo{font-size:13.5px;color:rgba(255,255,255,.62);margin-top:12px}
.ib-drive .dform{display:grid;gap:16px;padding:30px;border-radius:10px;background:rgba(12,12,11,.62);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.ib-drive label span{display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:2px}
.ib-drive input,.ib-drive select{width:100%;height:48px;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.4);border-radius:0;color:#fff;font:16px 'IbF',sans-serif;-webkit-appearance:none;appearance:none;outline:none;transition:border-color .25s}
.ib-drive select{background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.ib-drive select option{color:var(--ink);background-color:#fff}
.ib-drive input:focus,.ib-drive select:focus{border-bottom-color:var(--r);box-shadow:0 1px 0 0 var(--r)}
.ib-drive .dform .btn{justify-self:start;margin-top:8px}
.ib-drive .done{font-size:14px;background:rgba(255,255,255,.08);padding:12px 14px;border-left:3px solid var(--r);border-radius:2px}
@media (max-width:899px){
  .ib-drive{min-height:0;padding:150px 0 110px}
  .ib-drive .dgrid{grid-template-columns:minmax(0,1fr);gap:36px}
  .ib-drive .dshade{background:linear-gradient(rgba(8,10,12,.66),rgba(8,10,12,.66)),linear-gradient(0deg,rgba(8,10,12,.9),rgba(8,10,12,.2))}
  .ib-drive .dcopy p,.ib-drive .dcopy .demo{color:#fff}
  .ib-drive .dform{padding:22px}
}

/* ── footer ── */
.ib-foot{background:#fff;padding:104px 0 48px}
.ib-foot .fgrid{display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:48px;align-items:start}
.ib-foot .fbrand img{width:clamp(180px,17vw,250px);height:auto}
.ib-foot .fbrand p{margin-top:18px;font-size:15px;color:var(--mute)}
.ib-foot .fnav{display:flex;flex-direction:column;gap:2px}
.ib-foot .fnav a{font-size:clamp(24px,2.2vw,32px);font-weight:500;line-height:1.3;letter-spacing:-.035em;width:max-content}
@media (hover:hover){.ib-foot .fnav a:hover{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px}}
.ib-foot .fside{display:flex;flex-direction:column;gap:6px;font-size:15px;align-items:flex-end}
.ib-foot .fside a{min-height:30px;display:inline-flex;align-items:center}
@media (hover:hover){.ib-foot .fside a:hover{text-decoration:underline;text-underline-offset:3px}}
.ib-foot .flegal{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:80px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.ib-foot .proto{font-size:12px;line-height:1.6;color:var(--mute);margin-top:20px}
@media (max-width:899px){
  .ib-foot{padding:80px 0 calc(110px + env(safe-area-inset-bottom))}
  .ib-foot .fgrid{grid-template-columns:minmax(0,1fr);gap:40px}
  .ib-foot .fside{align-items:flex-start}
  .ib-foot .flegal{margin-top:56px}
}

/* ── mobile sticky CTA ── */
.ib-sticky{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:none;grid-template-columns:1fr 1.35fr 1fr;gap:6px;padding:6px;
  background:rgba(12,12,11,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 12px 40px -12px rgba(0,0,0,.5);
  transform:translateY(calc(100% + 24px));transition:transform .55s var(--ease)}
.ib-sticky a,.ib-sticky button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px;border-radius:9px;color:#fff;font-size:15px;font-weight:500;letter-spacing:-.01em}
.ib-sticky a:nth-child(2){background:var(--r);color:#fff}
@media (max-width:899px){.ib-sticky{display:grid}}
.ib[data-sticky="1"] .ib-sticky{transform:none}
.ib.menu-open .ib-sticky{transform:translateY(calc(100% + 24px))}

/* ── the assistant takes ÍSBAND's colours, never SNDR's ── */
.ib sndr-chat{--chat-accent:${RED};--chat-on-accent:#FFFFFF;--chat-bg:#FFFFFF;--chat-ink:${INK};--chat-muted:#62625C;--chat-line:#E6E5E0;--chat-sunk:#F3F2EE;--chat-radius:14px;--chat-font:'IbF',system-ui,sans-serif}
@media (max-width:899px){.ib sndr-chat::part(launcher){display:none}}

@media (prefers-reduced-motion:reduce){
  .ib *,.ib *::before,.ib *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
  .ib-statement{clip-path:none!important}
}
`
