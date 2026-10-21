/* Skipavík on the Set engine. Everything is scoped under .skv, every keyframe is prefixed skv-, tokens live on .skv
   (never :root), so nothing bleeds into the other previews in this SPA. Tokens: Skipavík's own colours, measured
   2026-10-21 (DESIGN.md §2): logo navy #0B436C, the copper of their header band #CF9253 (preset1.css), a deeper
   navy for dark panels. Engine names kept: --petrol is the dark navy, --green the copper accent (never text on white). */

export const skvCss = (B: string) => `
html:has(.skv),body:has(.skv){background-color:#FFFFFF}
@font-face{font-family:"SetDisplay";src:url("${B}fonts/set/StrichpunktSans-Variable.woff2") format("woff2");font-weight:400 900;font-stretch:100% 200%;font-display:swap}
@font-face{font-family:"SetText";src:url("${B}fonts/set/Switzer-Variable.woff2") format("woff2");font-weight:100 900;font-display:swap}

.skv{--ink:#111111;--muted:#5C6166;--paper:#FFFFFF;--card:#F2F0EC;--card2:#E6E3DD;--petrol:#082F4D;--green:#CF9253;--gdeep:#8A5A2B;--navy:#0B436C;
  --rule:rgba(17,17,17,.14);--ease:cubic-bezier(.16,1,.3,1);--io:cubic-bezier(.87,0,.13,1);
  --gut:16px;--bar:64px;--sec:clamp(88px,9.38vw,160px);
  --d:"SetDisplay",Helvetica Neue,Arial,sans-serif;--t:"SetText",Helvetica Neue,Arial,sans-serif;
  background:var(--paper);color:var(--ink);font-family:var(--t);font-size:17px;line-height:1.5;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;touch-action:manipulation;-webkit-tap-highlight-color:rgba(207,146,83,.25);min-height:100vh;min-height:100svh;overflow-x:clip}
@media (min-width:1024px){.skv{--gut:max(24px,2.34vw)}}
.skv *,.skv *::before,.skv *::after{box-sizing:border-box}
.skv :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd){margin:0;padding:0}
.skv :where(ul,ol){list-style:none}
.skv :where(a){color:inherit;text-decoration:none}
.skv :where(button,input,select,textarea){font:inherit;color:inherit}
.skv :where(button){background:none;border:0;padding:0;cursor:pointer}
.skv img{display:block;max-width:100%}
.skv ::selection{background:var(--green);color:var(--ink)}
.skv :focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.skv .skv-dark :focus-visible,.skv-dark :focus-visible{outline-color:#fff}
.skv-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skv-skip:focus{position:fixed!important;left:12px;top:12px;width:auto;height:auto;clip:auto;z-index:500;background:var(--ink);color:#fff;padding:12px 16px}
.skv .skv-wrap{padding-inline:var(--gut)}
.skv .skv-tnum{font-variant-numeric:tabular-nums}

/* ---------- type ---------- */
.skv .skv-d{font-family:var(--d);font-stretch:160%;font-weight:760;text-transform:uppercase;line-height:.86;letter-spacing:-.02em;overflow-wrap:normal;word-break:normal;hyphens:none}
.skv .skv-d--xl{font-size:clamp(64px,13.2vw,232px)}
@media (max-width:600px){.skv .skv-d--xl{font-size:21vw}.skv .skv-d--l,.skv .skv-rail__head .skv-d{font-size:15vw}}
.skv .skv-d--l{font-size:clamp(48px,8.4vw,150px)}
.skv .skv-h{font-family:var(--d);font-stretch:108%;font-weight:600;line-height:1.06;letter-spacing:-.02em}
.skv .skv-h,.skv .skv-lede,.skv .skv-acc__body,.skv .skv-row__desc{text-wrap:pretty}
.skv .skv-h{text-wrap:balance}
.skv .skv-az__group{content-visibility:auto;contain-intrinsic-size:auto 400px}
.skv .skv-lede{font-size:clamp(17px,1.35vw,20px);line-height:1.5;color:var(--muted);max-width:40ch}
/* the mask is taller than the .86 line box: Icelandic accents (Ö Á Í Ð) sit above the cap height and must not be cut */
.skv .skv-lm{display:block;overflow:hidden;padding:.24em 0 .1em;margin:-.24em 0 -.1em}
.skv .skv-ll{display:block}
.skv .skv-w{display:inline-block}
.skv .skv-label{font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.skv .skv-dots{height:2px;background-image:radial-gradient(circle,var(--ink) .8px,transparent 1.05px);background-size:5px 2px;background-repeat:repeat-x;opacity:.8}

/* ---------- ring device: the logo's stroke logic (black pipe wall, white bore line) ---------- */
.skv .skv-ring{position:relative;display:inline-grid;place-items:center;width:44px;height:44px;flex:none;color:var(--ink)}
.skv .skv-ring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.skv .skv-ring .r-wall{fill:none;stroke:currentColor;stroke-width:3.2}
.skv .skv-ring .r-bore{fill:none;stroke:var(--paper);stroke-width:.9}
.skv .skv-ring .r-draw{fill:none;stroke:var(--green);stroke-width:3.2;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s var(--ease)}
.skv .skv-ring .r-arr{position:relative;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6}
@media (hover:hover) and (pointer:fine){.skv a:hover>.skv-ring .r-draw,.skv button:hover>.skv-ring .r-draw,.skv .skv-ringlink:hover .r-draw{stroke-dashoffset:0}}
.skv .skv-ringlink{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-weight:500;font-size:15px}
.skv .skv-dark .skv-ring .r-bore{stroke:var(--petrol)}

/* ---------- buttons ---------- */
.skv .skv-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:52px;padding:0 18px 0 22px;background:var(--ink);color:#fff;font-weight:500;font-size:15px;letter-spacing:.04em;text-transform:uppercase;border:1px solid var(--ink);transition:background-color .3s,color .3s}
.skv .skv-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.skv .skv-btn:hover svg{transform:translate(2px,-2px)}}
.skv .skv-btn:hover{background:var(--petrol);border-color:var(--petrol)}
.skv .skv-btn--line{background:transparent;color:var(--ink)}
.skv .skv-btn--line:hover{background:var(--ink);color:#fff}
.skv .skv-btn--green{background:var(--green);border-color:var(--green);color:var(--ink)}
.skv .skv-btn--green:hover{background:#DCA672;border-color:#DCA672}
.skv .skv-btn[disabled]{opacity:.4;cursor:not-allowed}
.skv .skv-link{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;min-height:44px;display:inline-flex;align-items:center}
.skv .skv-link:hover{text-decoration-thickness:2px}

/* ---------- chrome: the house mobile standard (constant glass bar + sticky awning), at every width ---------- */
.skv .skv-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:140;background:var(--paper);pointer-events:none}
.skv .skv-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:calc(var(--bar) + env(safe-area-inset-top,0px));padding-top:env(safe-area-inset-top,0px);background-color:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.skv .skv-bar__in{height:100%;display:flex;align-items:center;gap:24px;padding:0 var(--gut)}
.skv .skv-bar__logo{display:inline-flex;align-items:center;min-height:44px;margin-right:auto;overflow:hidden;padding-block:6px;visibility:hidden;transition:visibility 0s .5s}
.skv .skv-bar__logo svg{height:40px;width:auto;fill:var(--navy);transform:translate3d(0,120%,0);opacity:0;transition:transform .5s var(--ease),opacity .3s var(--ease)}
.skv .skv-bar__logo.is-in{visibility:visible;transition:visibility 0s}
.skv .skv-bar__logo.is-in svg{transform:none;opacity:1;transition:transform .7s var(--ease),opacity .45s var(--ease)}
.skv .skv-nav{display:flex;gap:4px}
.skv .skv-nav a{position:relative;display:inline-flex;align-items:center;min-height:44px;padding:0 12px;font-size:15px;font-weight:500}
.skv .skv-nav a::after{content:"";position:absolute;left:12px;right:12px;bottom:10px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.skv .skv-nav a[aria-current="true"]::after{transform:scaleX(1);transform-origin:left}
@media (hover:hover) and (pointer:fine){.skv .skv-nav a:hover::after{transform:scaleX(1);transform-origin:left}}
.skv .skv-nav a[aria-current="true"]::before{content:"";position:absolute;left:3px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:var(--green)}
.skv .skv-listbtn{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 6px 0 14px;border:1px solid var(--ink);font-size:15px;font-weight:500}
.skv .skv-listbtn:hover{background:var(--ink);color:#fff}
.skv .skv-count{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 8px;border-radius:999px;background:var(--green);color:var(--ink);font-size:13px;font-weight:600;overflow:hidden}
.skv .skv-count span{display:block;animation:skv-roll .5s var(--ease)}
@keyframes skv-roll{from{transform:translateY(110%)}to{transform:none}}
.skv .skv-lang{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;font-size:14px;font-weight:500;letter-spacing:.06em}
.skv .skv-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center}
.skv .skv-burger i{display:block;width:22px;height:1.5px;background:var(--ink);position:relative}
.skv .skv-burger i::before,.skv .skv-burger i::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:var(--ink)}
.skv .skv-burger i::before{top:-7px}.skv .skv-burger i::after{top:7px}
@media (max-width:900px){.skv .skv-nav,.skv .skv-bar .skv-lang{display:none}.skv .skv-burger{display:inline-flex}.skv .skv-bar__in{gap:10px}.skv .skv-listbtn__t{display:none}.skv .skv-listbtn{padding:0 8px;border:0}}
.skv .skv-menu{position:fixed;inset:var(--bar) 0 0 0;z-index:149;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:24px var(--gut) calc(24px + env(safe-area-inset-bottom));overflow:auto;overscroll-behavior:contain;opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.skv .skv-menu.is-open{opacity:1;visibility:visible;transition:opacity .35s}
.skv .skv-menu a{display:flex;align-items:baseline;gap:16px;min-height:56px;border-bottom:1px solid var(--rule);font-family:var(--d);font-stretch:125%;font-weight:620;font-size:clamp(28px,8vw,40px)}
.skv .skv-menu a small{font-family:var(--t);font-size:14px;font-weight:500;color:var(--muted);min-width:24px}

/* ---------- loader: the logo's contours draw on over petrol, then the Live-up shutter ---------- */
.skv .skv-load{position:fixed;inset:0;z-index:400;pointer-events:none}
.skv .skv-load__field{position:absolute;inset:0;background:var(--petrol);transition:transform 1.2s var(--io)}
.skv .skv-load__mark{position:absolute;left:50%;top:50%;width:min(34vw,180px);transform:translate(-50%,-50%);transition:opacity .5s}
.skv .skv-load__mark svg{width:100%;height:auto;overflow:visible}
.skv .skv-logo__path{fill:#fff;fill-opacity:0;stroke:#fff;stroke-width:1.4px;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:skv-draw 1.1s var(--ease) .1s forwards,skv-fill .5s ease 1s forwards}
@keyframes skv-draw{to{stroke-dashoffset:0}}
@keyframes skv-fill{to{fill-opacity:1}}
.skv .skv-load.is-leaving .skv-load__field{transform:translate3d(0,-100%,0)}
.skv .skv-load.is-leaving .skv-load__mark{opacity:0}

/* ---------- hero ---------- */
.skv .skv-hero{position:relative;padding-top:calc(var(--bar) + 20px);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-inline:var(--gut)}
.skv .skv-hero__text{grid-column:1/8;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,3vw,48px) 0 clamp(32px,4vw,56px)}
.skv .skv-hero__mark{margin-bottom:auto;padding-bottom:40px}
.skv .skv-hero__mark svg{display:block;width:clamp(96px,10vw,176px);height:auto;fill:var(--navy)}
.skv .skv-hero__kicker{display:flex;align-items:center;gap:10px;margin-bottom:clamp(20px,3vw,40px)}
.skv .skv-hero__kicker::before{content:"";width:12px;height:12px;border-radius:50%;border:2.5px solid var(--ink);box-shadow:inset 0 0 0 1px var(--paper),inset 0 0 0 5px var(--green)}
.skv .skv-hero h1{font-size:clamp(40px,6.3vw,116px);max-width:11.5ch}
.skv .skv-hero__sub{margin-top:clamp(20px,2.4vw,32px)}
.skv .skv-hero__cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:clamp(28px,3vw,44px)}
.skv .skv-hero__fig{grid-column:8/13;position:relative}
.skv .skv-hero__frame{position:relative;overflow:hidden;height:calc(100svh - var(--bar) - 64px);min-height:540px;max-height:940px;background:var(--card)}
.skv .skv-hero__frame img{width:100%;height:100%;object-fit:cover;will-change:transform}
.skv .skv-cap{margin-top:12px;font-size:14px;line-height:1.45;color:var(--muted);max-width:52ch}
@media (max-width:900px){.skv .skv-hero__mark{display:none}.skv .skv-hero__text,.skv .skv-hero__fig{grid-column:1/-1}.skv .skv-hero__frame{height:auto;aspect-ratio:4/4.4;min-height:0}}

/* ---------- catalogue ---------- */
.skv .skv-cat{padding-top:var(--sec)}
.skv .skv-cat__head{padding-inline:var(--gut)}
.skv .skv-cat__lead{margin-top:clamp(20px,2vw,28px);max-width:62ch;color:var(--muted)}
.skv .skv-cat .skv-dots{margin:clamp(28px,3vw,44px) var(--gut) 0}
.skv .skv-filter{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;padding:16px var(--gut)}
.skv .skv-filter label{display:inline-flex;align-items:center;gap:10px;font-size:15px}
.skv .skv-filter label>span{font-weight:500}
.skv .skv-select{appearance:none;-webkit-appearance:none;min-height:44px;padding:0 40px 0 12px;border:1px solid rgba(17,17,17,.3);background:var(--paper) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m2.5 4.5 3.5 3.5 3.5-3.5' fill='none' stroke='%23111' stroke-width='1.4'/%3E%3C/svg%3E") no-repeat right 12px center/12px;border-radius:0;font-size:16px;max-width:100%}
.skv .skv-search{display:flex;align-items:center;flex:1 1 240px;max-width:420px;min-height:44px;border-bottom:1px solid var(--ink)}
.skv .skv-search svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6}
.skv .skv-search input{flex:1;min-width:0;min-height:44px;border:0;background:transparent;padding:0 10px;font-size:16px;outline:none}
.skv .skv-search:focus-within{outline:2px solid var(--ink);outline-offset:3px}
.skv .skv-filter__count{font-size:14px;color:var(--muted)}
.skv .skv-toggle{display:inline-flex;margin-left:auto}
.skv .skv-toggle button{min-width:44px;height:44px;padding:0 12px;font-size:13px;font-weight:600;letter-spacing:.04em;border:1px solid var(--ink);display:inline-grid;place-items:center}
.skv .skv-toggle button+button{border-left:0}
.skv .skv-toggle button[aria-pressed="true"]{background:var(--ink);color:#fff}
.skv .skv-toggle svg{width:16px;height:16px;fill:currentColor}
.skv .skv-stage{transition:opacity .2s var(--ease)}
.skv .skv-stage.is-swapping{opacity:0}

.skv .skv-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(40px,4.6vw,76px) var(--gut) 0}
.skv .skv-row__text{grid-column:1/4;display:flex;flex-direction:column;min-width:0}
.skv .skv-row__n{font-size:14px;font-weight:500;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.skv .skv-row__n::after{content:"";flex:1;max-width:48px;height:1px;background:var(--ink);opacity:.4}
.skv .skv-row__text h3{font-size:clamp(24px,2vw,34px);overflow-wrap:normal}
.skv .skv-row__desc{margin-top:14px;font-size:16px;line-height:1.5;color:var(--muted)}
.skv .skv-row__meta{margin-top:12px;font-size:13px;color:var(--muted)}
.skv .skv-row__links{margin-top:auto;padding-top:24px;display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.skv .skv-row__docs{display:flex;gap:16px;font-size:14px}
.skv .skv-row__cards{grid-column:4/13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-width:0}
@media (max-width:900px){
  .skv .skv-row{display:block}
  .skv .skv-row__links{padding-top:12px;flex-direction:row;flex-wrap:wrap;align-items:center;gap:4px 18px}
  .skv .skv-row__cards{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:20px calc(var(--gut)*-1) 0;padding:0 var(--gut) 6px;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none}
  .skv .skv-row__cards::-webkit-scrollbar{display:none}
  .skv .skv-row__cards>*{flex:0 0 min(72vw,300px);scroll-snap-align:start}
}

/* product card: Set's own white-background photos multiplied into the card grey */
.skv .skv-card{position:relative;display:flex;flex-direction:column;background:var(--card);padding:14px;min-width:0;aspect-ratio:1/1.22;container-type:inline-size}
.skv .skv-card__leaf{font-size:12.5px;line-height:1.3;color:var(--muted);display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;padding-right:4px}
.skv .skv-card__img{flex:1;min-height:0;display:grid;place-items:center;padding:8% 6%;overflow:hidden}
.skv .skv-card__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;transition:transform .9s var(--ease)}
.skv .skv-card__img.is-tile{padding:0;margin:4px 0}
.skv .skv-card__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
.skv .skv-prod__img.is-tile{padding:0}
.skv .skv-prod__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
@media (hover:hover) and (pointer:fine){.skv .skv-card:hover .skv-card__img img{transform:scale(1.045)}}
.skv .skv-card__ph{width:52%;aspect-ratio:1;color:rgba(17,17,17,.2)}
.skv .skv-card__ph svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2}
.skv .skv-card__name{font-size:15px;font-weight:500;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
.skv .skv-card__name a::after{content:"";position:absolute;inset:0}
.skv .skv-card__foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:6px}
.skv .skv-card__sku{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.skv .skv-add{position:relative;z-index:2;flex:none;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--ink);background:var(--paper);transition:background-color .25s,color .25s}
.skv .skv-add svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}
.skv .skv-add:hover{background:var(--ink);color:#fff}
.skv .skv-add.is-on{background:var(--green);border-color:var(--green);color:var(--ink)}
.skv .skv-add.is-on svg{animation:skv-pop .35s var(--ease)}
@keyframes skv-pop{from{transform:scale(.6)}to{transform:none}}
.skv .skv-card--skel{animation:skv-pulse 1.4s ease-in-out infinite alternate}
@keyframes skv-pulse{from{opacity:1}to{opacity:.55}}

/* A–Ö list */
.skv .skv-az{padding:24px var(--gut) 0}
.skv .skv-az__jump{display:flex;flex-wrap:wrap;gap:2px;padding-bottom:16px;border-bottom:1px solid var(--rule)}
.skv .skv-az__jump a{min-width:40px;min-height:44px;display:grid;place-items:center;font-weight:500;font-size:15px}
.skv .skv-az__jump a:hover{background:var(--card)}
.skv .skv-az__group{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-top:28px;scroll-margin-top:calc(var(--bar) + 16px)}
.skv .skv-az__letter{grid-column:1/3;font-size:clamp(40px,4vw,64px)}
.skv .skv-az__rows{grid-column:3/13}
.skv .skv-az__row{display:grid;grid-template-columns:minmax(96px,150px) minmax(0,1fr) minmax(0,.7fr) 44px;align-items:center;gap:16px;min-height:52px;border-bottom:1px solid var(--rule);font-size:15px}
.skv .skv-az__row a:hover{text-decoration:underline;text-underline-offset:3px}
.skv .skv-az__sku{color:var(--muted);font-variant-numeric:tabular-nums}
.skv .skv-az__leaf{color:var(--muted);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skv .skv-az .skv-add{width:44px;height:44px}
@media (max-width:900px){.skv .skv-az__group{display:block}.skv .skv-az__letter{margin-bottom:8px}.skv .skv-az__row{grid-template-columns:minmax(0,1fr) 44px;gap:4px 12px;padding:8px 0}.skv .skv-az__sku{grid-row:2;font-size:13px}.skv .skv-az__leaf{display:none}.skv .skv-az__row .skv-add{grid-row:1/3;grid-column:2}}
.skv .skv-empty{padding:40px var(--gut);color:var(--muted)}

/* ---------- family + product pages ---------- */
.skv .skv-page{padding-top:calc(var(--bar) + clamp(28px,4vw,56px))}
.skv .skv-crumbs{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:14px;color:var(--muted);padding:0 var(--gut) 20px}
.skv .skv-crumbs a{text-decoration:underline;text-underline-offset:3px;min-height:32px;display:inline-flex;align-items:center}
.skv .skv-crumbs span[aria-hidden]{opacity:.5}
.skv .skv-fam__head{padding:0 var(--gut)}
.skv .skv-fam__intro{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);margin-top:clamp(24px,3vw,40px);padding:0 var(--gut)}
.skv .skv-fam__intro p{grid-column:1/7}
.skv .skv-fam__intro div{grid-column:9/13;display:flex;flex-direction:column;align-items:flex-start}
@media (max-width:900px){.skv .skv-fam__intro p,.skv .skv-fam__intro div{grid-column:1/-1}.skv .skv-fam__intro div{margin-top:12px}}
.skv .skv-tabs{display:flex;gap:2px 22px;flex-wrap:wrap;padding:0 var(--gut)}
.skv .skv-tabs button{position:relative;min-height:44px;font-size:15px;color:var(--muted);text-align:left}
.skv .skv-tabs button::after{content:"";position:absolute;left:0;right:0;bottom:8px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.skv .skv-tabs button:hover,.skv .skv-tabs button[aria-pressed="true"]{color:var(--ink)}
.skv .skv-tabs button:hover::after,.skv .skv-tabs button[aria-pressed="true"]::after{transform:scaleX(1);transform-origin:left}
.skv .skv-tabs sup{font-size:11px;margin-left:3px}
.skv .skv-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:12px var(--gut) 0}
@media (max-width:1100px){.skv .skv-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.skv .skv-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.skv .skv-card{padding:10px}.skv .skv-card__name{font-size:14px}}
.skv .skv-pager{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px var(--gut) 0}
.skv .skv-pager button[aria-current="page"] .skv-ring{color:var(--ink)}
.skv .skv-pager__n{display:inline-grid;place-items:center;width:44px;height:44px;font-size:15px;font-variant-numeric:tabular-nums}
.skv .skv-pager__n[aria-current="page"]{position:relative}
.skv .skv-pager__n[aria-current="page"]::before{content:"";position:absolute;inset:3px;border-radius:50%;border:1.5px dashed var(--ink)}
.skv .skv-pager button[disabled]{opacity:.3;cursor:default}

.skv .skv-prod{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.skv .skv-prod__img{grid-column:1/7;background:var(--card);aspect-ratio:1;display:grid;place-items:center;padding:10%}
.skv .skv-prod__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.skv .skv-prod__img .skv-card__ph{width:40%}
.skv .skv-prod__info{grid-column:8/13;display:flex;flex-direction:column;gap:20px;padding-top:4px}
.skv .skv-prod h1{font-size:clamp(30px,3vw,48px);line-height:1.08;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
.skv .skv-prod__sku{font-size:15px;color:var(--muted)}
.skv .skv-prod__sku b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.skv .skv-spec{border-top:1px solid var(--ink)}
.skv .skv-spec div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid var(--rule);font-size:15px}
.skv .skv-spec dt{color:var(--muted)}
.skv .skv-spec dd{font-variant-numeric:tabular-nums}
.skv .skv-buy{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
.skv .skv-buy .skv-btn{flex:1 1 200px}
.skv .skv-prod__links{display:flex;flex-wrap:wrap;gap:4px 20px;font-size:15px}
.skv .skv-prod__on{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:500}
.skv .skv-prod__on span{width:10px;height:10px;border-radius:50%;background:var(--green)}
.skv .skv-prod__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.skv .skv-prod__img,.skv .skv-prod__info{grid-column:1/-1}.skv .skv-prod__info{margin-top:24px}}
.skv .skv-related{padding-top:var(--sec)}
.skv .skv-related h2{padding:0 var(--gut) 20px;font-size:clamp(24px,2.4vw,36px)}

/* qty stepper + unit */
.skv .skv-qty{display:inline-flex;align-items:stretch;border:1px solid rgba(17,17,17,.3);height:48px}
.skv .skv-qty button{width:44px;display:grid;place-items:center;font-size:20px;line-height:1}
.skv .skv-qty button:hover{background:var(--card)}
.skv .skv-qty input{width:64px;border:0;border-inline:1px solid rgba(17,17,17,.15);text-align:center;font-size:16px;font-variant-numeric:tabular-nums;background:transparent;-moz-appearance:textfield;appearance:textfield}
.skv .skv-qty input::-webkit-inner-spin-button,.skv .skv-qty input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.skv .skv-buy .skv-select,.skv .skv-line .skv-select{min-height:48px}

/* ---------- numbered accordion (image 2) ---------- */
.skv .skv-how{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:var(--sec) var(--gut) 0}
.skv .skv-how__head{grid-column:1/5;display:flex;flex-direction:column;align-items:flex-start;gap:32px}
.skv .skv-how__head .skv-d{font-size:clamp(44px,5.6vw,96px)}
.skv .skv-how__list{grid-column:6/13}
@media (max-width:900px){.skv .skv-how__head,.skv .skv-how__list{grid-column:1/-1}.skv .skv-how__list{margin-top:28px}.skv .skv-how__head .skv-btn{order:3}}
.skv .skv-acc{position:relative;border-bottom:1px solid rgba(17,17,17,.55)}
.skv .skv-acc::before,.skv .skv-acc::after{content:"";position:absolute;bottom:0;width:1px;height:7px;background:rgba(17,17,17,.55)}
.skv .skv-acc::before{left:0}.skv .skv-acc::after{right:0}
.skv .skv-acc__btn{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 44px;align-items:center;gap:12px;min-height:72px;text-align:left}
.skv .skv-acc__n{display:inline-grid;place-items:center;width:34px;height:26px;font-size:14px;font-weight:500;font-variant-numeric:tabular-nums;transition:background-color .4s}
.skv .skv-acc.is-open .skv-acc__n{background:var(--green)}
.skv .skv-acc__t{font-family:var(--d);font-stretch:118%;font-weight:600;font-size:clamp(16px,1.35vw,20px);text-transform:uppercase;letter-spacing:.01em;line-height:1.2}
.skv .skv-acc__pm{justify-self:end;position:relative;width:26px;height:26px;border:1px solid var(--ink)}
.skv .skv-acc__pm::before,.skv .skv-acc__pm::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:1.2px;margin:-.6px 0 0 -6px;background:var(--ink);transition:transform .4s var(--ease)}
.skv .skv-acc__pm::after{transform:rotate(90deg)}
.skv .skv-acc.is-open .skv-acc__pm::after{transform:rotate(0)}
.skv .skv-acc__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s var(--ease)}
.skv .skv-acc.is-open .skv-acc__panel{grid-template-rows:1fr}
.skv .skv-acc__panel>div{overflow:hidden;min-height:0;visibility:hidden;transition:visibility 0s .5s}
.skv .skv-acc.is-open .skv-acc__panel>div{visibility:visible;transition:visibility 0s}
.skv .skv-acc__body{padding:0 56px 26px 64px;color:var(--muted);max-width:62ch}
.skv .skv-acc__body a{color:var(--ink)}
@media (max-width:600px){.skv .skv-acc__btn{grid-template-columns:44px minmax(0,1fr) 44px}.skv .skv-acc__body{padding:0 0 22px 56px}}

/* ---------- production rail: card-flick (Whitedesert), active card petrol ---------- */
.skv .skv-rail{padding-top:var(--sec)}
.skv .skv-rail__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);align-items:end;padding:0 var(--gut)}
.skv .skv-rail__head .skv-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.skv .skv-rail__head p{grid-column:1/7;margin-top:22px}
.skv .skv-rail__arrows{grid-column:10/13;justify-self:end;display:flex;gap:8px}
@media (max-width:900px){.skv .skv-rail__head p{grid-column:1/-1}.skv .skv-rail__arrows{grid-column:1/-1;justify-self:start;margin-top:16px}}
.skv .skv-rail__track{display:flex;gap:12px;height:clamp(520px,44vw,640px);padding:36px var(--gut) 0}
.skv .skv-rc{position:relative;flex:1 1 0;min-width:0;display:flex;flex-direction:column;background:var(--card2);overflow:hidden;cursor:pointer;transition:flex-grow .75s var(--ease),background-color .4s,color .4s;text-align:left}
.skv .skv-rc.is-on{flex-grow:5;background:var(--petrol);color:#fff;cursor:default}
.skv .skv-rc__top{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 0}
.skv .skv-rc__n{position:relative;display:inline-grid;place-items:center;min-width:38px;height:28px;padding:0 6px;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;transition:background-color .4s,color .4s}
.skv .skv-rc.is-on .skv-rc__n{background:var(--green);color:var(--ink)}
.skv .skv-rc__arr{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.skv .skv-rc__media{position:relative;flex:1;min-height:0;margin:14px 16px 0;overflow:hidden}
.skv .skv-rc__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.15)}
.skv .skv-rc__noimg{position:absolute;inset:0;display:grid;place-items:center}
.skv .skv-rc__noimg svg{width:min(60%,240px);height:auto;fill:none;stroke:currentColor;stroke-width:1.4;opacity:.55}
.skv .skv-rc__body{padding:16px;display:grid;gap:8px}
.skv .skv-rc__y{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.skv .skv-rc__t{font-family:var(--d);font-stretch:118%;font-weight:620;font-size:clamp(18px,1.5vw,24px);line-height:1.1;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.skv .skv-rc.is-on .skv-rc__t{white-space:normal}
.skv .skv-rc__b{font-size:15px;line-height:1.45;max-width:46ch;opacity:0;max-height:0;transition:opacity .4s}
.skv .skv-rc.is-on .skv-rc__b{opacity:.88;max-height:none;transition:opacity .5s .3s}
.skv .skv-rc__cap{font-size:12.5px;opacity:0;line-height:1.4}
.skv .skv-rc.is-on .skv-rc__cap{opacity:.66;transition:opacity .5s .35s}
.skv .skv-rc__links{display:flex;gap:16px;visibility:hidden;opacity:0}
.skv .skv-rc.is-on .skv-rc__links{visibility:visible;opacity:1;transition:opacity .5s .35s}
.skv .skv-rc__links a{text-decoration:underline;text-underline-offset:3px;min-height:44px;display:inline-flex;align-items:center}
@media (max-width:900px),(hover:none){
  .skv .skv-rail__track{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none;padding-bottom:6px}
  .skv .skv-rail__track::-webkit-scrollbar{display:none}
  .skv .skv-rc{flex:0 0 min(80vw,380px);scroll-snap-align:start;min-height:520px}
  .skv .skv-rc.is-on{flex-grow:0}
  .skv .skv-rc__b,.skv .skv-rc__cap{opacity:.88;max-height:none}
  .skv .skv-rc__links{visibility:visible;opacity:1}
  .skv .skv-rc__t{white-space:normal}
  .skv .skv-rc__media{flex:0 0 auto;aspect-ratio:4/3}
}

/* ---------- material list teaser ---------- */
.skv .skv-teaser{margin-top:var(--sec);background:var(--card);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(56px,6vw,104px) var(--gut)}
.skv .skv-teaser__text{grid-column:1/7;display:flex;flex-direction:column;align-items:flex-start;gap:24px}
.skv .skv-teaser__text .skv-d{font-size:clamp(44px,6.6vw,120px)}
.skv .skv-teaser__list{grid-column:8/13;align-self:end;background:var(--paper)}
.skv .skv-teaser__list li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:16px 18px;border-bottom:1px solid var(--rule);font-size:15px}
.skv .skv-teaser__list li span{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.skv .skv-teaser__foot svg{height:20px;width:auto;fill:#fff}
.skv .skv-teaser__list .skv-teaser__foot{display:flex;justify-content:space-between;align-items:center;background:var(--petrol);color:#fff;border:0}
.skv .skv-teaser__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.skv .skv-teaser__text,.skv .skv-teaser__list{grid-column:1/-1}.skv .skv-teaser__list{margin-top:32px}}

/* ---------- material list page ---------- */
.skv .skv-lp{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.skv .skv-lp__head{grid-column:1/-1;margin-bottom:clamp(28px,3vw,44px)}
.skv .skv-lp__head .skv-lede{max-width:64ch;margin-top:20px}
.skv .skv-lp__main{grid-column:1/8;min-width:0}
.skv .skv-lp__side{grid-column:9/13;min-width:0}
@media (max-width:1000px){.skv .skv-lp__main,.skv .skv-lp__side{grid-column:1/-1}.skv .skv-lp__side{margin-top:48px}}
.skv .skv-lp__name{display:grid;gap:6px;margin-bottom:18px}
.skv .skv-lines{border-top:1px solid var(--ink)}
.skv .skv-line{display:grid;grid-template-columns:minmax(64px,84px) minmax(0,1fr) auto auto 44px;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--rule)}
.skv .skv-line__sku{font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}
.skv .skv-line__name{font-size:15px;font-weight:500;min-width:0}
.skv .skv-line__name a:hover{text-decoration:underline;text-underline-offset:3px}
.skv .skv-line__rm{width:44px;height:44px;display:grid;place-items:center}
.skv .skv-line__rm svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.skv .skv-line__rm:hover{background:var(--card)}
.skv .skv-lines__hd{display:grid;grid-template-columns:minmax(64px,84px) minmax(0,1fr) auto 44px;gap:14px;padding:10px 0;font-size:13px;color:var(--muted);border-bottom:1px solid var(--rule)}
@media (max-width:760px){
  .skv .skv-lines__hd{display:none}
  .skv .skv-line{grid-template-columns:minmax(0,1fr) 44px;gap:8px 10px}
  .skv .skv-line__sku{grid-column:1}.skv .skv-line__name{grid-column:1;grid-row:2}
  .skv .skv-line__rm{grid-column:2;grid-row:1/3}
  .skv .skv-line .skv-qty,.skv .skv-line .skv-select{grid-row:3}
  .skv .skv-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
}
@media (min-width:761px){.skv .skv-line__ctl{display:contents}}
.skv .skv-lp__tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.skv .skv-lp__tools .skv-btn{min-height:44px;font-size:13px;gap:14px}
.skv .skv-saved{margin-top:12px;border:1px solid var(--rule)}
.skv .skv-saved li{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 14px;border-bottom:1px solid var(--rule);font-size:15px}
.skv .skv-saved li:last-child{border-bottom:0}
.skv .skv-saved li button:first-child{flex:1;text-align:left;min-height:44px}
.skv .skv-saved small{color:var(--muted);font-size:13px}
.skv .skv-fld{display:grid;gap:6px;margin-bottom:16px}
.skv .skv-fld>span{font-size:14px;font-weight:500}
.skv .skv-fld>span em{font-style:normal;color:var(--muted);font-weight:400}
.skv .skv-inp{width:100%;min-height:48px;padding:10px 12px;border:1px solid rgba(17,17,17,.3);border-radius:0;background:var(--paper);font-size:16px}
.skv textarea.skv-inp{min-height:104px;resize:vertical;line-height:1.45}
.skv .skv-inp:focus{outline:2px solid var(--ink);outline-offset:1px}
.skv .skv-fs{border:0;padding:0;margin:0 0 28px}
.skv .skv-fs legend{font-family:var(--d);font-stretch:118%;font-weight:620;text-transform:uppercase;font-size:18px;padding:0 0 14px;border-bottom:1px solid var(--ink);width:100%;margin-bottom:16px}
.skv .skv-radio{display:flex;align-items:center;gap:12px;min-height:44px;font-size:15px;cursor:pointer}
.skv .skv-radio input{width:20px;height:20px;accent-color:var(--ink)}
.skv .skv-file{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.skv .skv-file label{cursor:pointer}
.skv .skv-file small,.skv .skv-help{font-size:13px;color:var(--muted)}
.skv .skv-lp__send{display:grid;gap:12px;position:sticky;top:calc(var(--bar) + 16px)}
.skv .skv-lp__send .skv-btn{width:100%}
.skv .skv-warn{font-size:14px;color:var(--ink);background:#FBF3EA;border-left:3px solid var(--green);padding:10px 12px}
.skv .skv-empty-list{padding:28px;background:var(--card);display:grid;gap:14px;justify-items:start}

/* ---------- drawer + modal: the video's blur backdrop, panel resolves from blur ---------- */
.skv .skv-scrim{position:fixed;inset:0;z-index:300;visibility:hidden;transition:visibility 0s .2s}
.skv .skv-scrim::before{content:"";position:absolute;inset:0 0 -140px 0;background:rgba(255,255,255,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .2s var(--ease)}
.skv .skv-scrim.is-open{visibility:visible;transition:visibility 0s}
.skv .skv-scrim.is-open::before{opacity:1;transition-duration:.25s}
.skv .skv-panel{opacity:0;filter:blur(12px);transform:translate3d(0,8px,0);transition:opacity .2s var(--ease),filter .2s var(--ease),transform .2s var(--ease)}
.skv .skv-drawer.skv-panel{filter:blur(8px);transform:translate3d(24px,0,0)}
.skv .skv-scrim.is-open .skv-panel{transition-duration:.3s}
.skv .skv-scrim.is-open .skv-panel{opacity:1;filter:none;transform:none}
.skv .skv-drawer{z-index:1;position:absolute;top:0;right:0;bottom:0;width:min(480px,100%);background:var(--paper);border-left:1px solid var(--rule);display:flex;flex-direction:column}
/* iOS 26 Safari shows page under its minimised toolbar, below a fixed bottom:0 edge: the drawer's paper runs on under it */
.skv .skv-drawer::after{content:"";position:absolute;left:-1px;right:0;top:100%;height:140px;background:var(--paper);border-left:1px solid var(--rule)}
.skv .skv-drawer__head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 8px 0 20px;min-height:var(--bar);background:var(--petrol);color:#fff}
.skv .skv-drawer__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:20px}
.skv .skv-x{width:44px;height:44px;display:grid;place-items:center}
.skv .skv-x svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}
.skv .skv-drawer__body{flex:1;overflow:auto;overscroll-behavior:contain;padding:8px 20px}
.skv .skv-drawer__foot{padding:16px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--rule);display:grid;gap:10px}
.skv .skv-drawer .skv-line{grid-template-columns:minmax(0,1fr) 44px}
.skv .skv-drawer .skv-line__sku{grid-column:1}
.skv .skv-drawer .skv-line__name{grid-column:1;grid-row:2}
.skv .skv-drawer .skv-line__rm{grid-column:2;grid-row:1/3}
.skv .skv-drawer .skv-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
.skv .skv-modal{z-index:1;position:absolute;left:50%;top:50%;width:min(640px,calc(100% - 24px));max-height:calc(100% - 24px);translate:-50% -50%;background:var(--paper);border:1px solid var(--rule);display:flex;flex-direction:column}
.skv .skv-modal__head{display:flex;align-items:center;justify-content:space-between;padding:4px 8px 4px 24px;border-bottom:1px solid var(--rule);min-height:64px}
.skv .skv-modal__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:clamp(18px,2vw,24px)}
.skv .skv-modal__body{overflow:auto;overscroll-behavior:contain;padding:20px 24px;display:grid;gap:16px}
.skv .skv-modal__foot{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;padding:16px 24px;border-top:1px solid var(--rule)}
.skv .skv-sum{display:grid;gap:0;border-top:1px solid var(--ink)}
.skv .skv-sum div{display:grid;grid-template-columns:minmax(110px,.6fr) minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--rule);font-size:15px}
.skv .skv-sum dt{color:var(--muted)}
.skv .skv-sum .is-missing dd{color:var(--ink);font-weight:500}
.skv .skv-sum .is-missing dd::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:8px;vertical-align:1px}
.skv .skv-ack{display:grid;gap:14px;justify-items:start}
.skv .skv-ack__ring{width:72px;height:72px}
.skv .skv-ack__ring circle{fill:none;stroke-width:5;stroke-dasharray:1;stroke-dashoffset:1;animation:skv-draw .9s var(--ease) .15s forwards}
.skv .skv-ack__ring .a{stroke:var(--ink)}.skv .skv-ack__ring .b{stroke:var(--green);stroke-width:2}

/* ---------- staff review ---------- */
.skv .skv-rv{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.skv .skv-rv__q{grid-column:1/8;min-width:0}
.skv .skv-rv__d{grid-column:8/13;min-width:0}
@media (max-width:1000px){.skv .skv-rv__q,.skv .skv-rv__d{grid-column:1/-1}.skv .skv-rv__d{margin-top:32px}}
.skv .skv-tbl{width:100%;border-collapse:collapse;font-size:15px}
.skv .skv-tbl th{text-align:left;font-size:13px;font-weight:500;color:var(--muted);padding:10px 12px 10px 0;border-bottom:1px solid var(--ink)}
.skv .skv-tbl td{padding:0 12px 0 0;border-bottom:1px solid var(--rule);vertical-align:middle}
.skv .skv-tbl td button{display:block;width:100%;min-height:56px;text-align:left}
.skv .skv-tbl tr.is-sel td{background:var(--card)}
.skv .skv-tbl tr:hover td{background:#F7F7F5}
.skv .skv-tag{display:inline-block;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 7px;border:1px solid rgba(17,17,17,.35);white-space:nowrap}
.skv .skv-tag--you{background:var(--green);border-color:var(--green)}
.skv .skv-st{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.skv .skv-st::before{content:"";width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink)}
.skv .skv-st--review::before{background:linear-gradient(90deg,var(--ink) 50%,transparent 50%)}
.skv .skv-st--quoted::before{background:var(--ink)}
.skv .skv-rv__tblwrap{overflow-x:auto}
@media (max-width:640px){.skv .skv-tbl .c-from,.skv .skv-tbl .c-date{display:none}}
.skv .skv-rv__card{background:var(--card);padding:22px;display:grid;gap:16px}
.skv .skv-rv__card h2{font-size:22px}
.skv .skv-flags{display:flex;flex-wrap:wrap;gap:8px}
.skv .skv-flag{font-size:13px;padding:5px 10px;background:var(--paper);border-left:3px solid var(--green)}
.skv .skv-rv__lines li{display:grid;grid-template-columns:minmax(80px,110px) minmax(0,1fr) auto;gap:10px;padding:8px 0;border-bottom:1px solid var(--rule);font-size:14px}
.skv .skv-rv__lines span:first-child{color:var(--muted);font-variant-numeric:tabular-nums}
.skv .skv-rv__lines span:last-child{font-variant-numeric:tabular-nums;white-space:nowrap}

/* ---------- footer ---------- */
.skv .skv-foot{margin-top:var(--sec);background:var(--petrol);color:#fff;padding:clamp(56px,6vw,96px) var(--gut) 40px}
.skv .skv-foot__logo svg{height:clamp(44px,5vw,72px);width:auto;fill:#fff}
.skv .skv-foot__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);row-gap:36px;margin-top:48px}
.skv .skv-foot__col{grid-column:span 3;display:grid;gap:6px;align-content:start;font-size:15px;line-height:1.55}
.skv .skv-foot__col h3{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin-bottom:8px}
.skv .skv-foot__col a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.4);min-height:32px;display:inline-flex;align-items:center}
.skv .skv-foot__col a:hover{text-decoration-color:#fff}
.skv .skv-foot__small{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,.18);display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.7)}
@media (max-width:1000px){.skv .skv-foot__col{grid-column:span 6}}
@media (max-width:560px){.skv .skv-foot__col{grid-column:1/-1}}

/* reduced motion: nothing moves on its own; the engine is never started */
@media (prefers-reduced-motion:reduce){
  .skv .skv-bar__logo svg{transform:none!important}
  .skv *,.skv *::before,.skv *::after{transition-duration:.2s!important;animation-duration:.01ms!important;animation-delay:0s!important}
  .skv .skv-logo__path{stroke-dashoffset:0;fill-opacity:1}
  .skv .skv-panel{filter:none!important;transform:none!important}
  .skv .skv-rc{transition:background-color .2s,color .2s}
}

/* ---------- Skipavík additions ---------- */
/* the slipway's published dimensions as dimension lines: a hairline with end ticks over each figure */
.skv .skv-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gut);margin-top:clamp(32px,4vw,56px);max-width:620px}
.skv .skv-fact{position:relative;padding-top:14px}
.skv .skv-fact::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ink)}
.skv .skv-fact::after{content:"";position:absolute;left:0;right:0;top:-5px;height:11px;border-inline:1px solid var(--ink)}
.skv .skv-fact dd{margin:0}
.skv .skv-fact b{font-family:var(--d);font-stretch:130%;font-weight:700;font-size:clamp(30px,3.4vw,52px);line-height:1;letter-spacing:-.02em}
.skv .skv-fact span{margin-left:6px;font-size:15px;font-weight:500}
@media (max-width:700px){.skv .skv-fact span{display:block;margin:4px 0 0}.skv .skv-facts{gap:14px}}
.skv .skv-fact__l{margin-top:6px!important;font-size:13px;line-height:1.35;color:var(--muted)}
/* the division's people */
.skv .skv-people{display:grid;gap:12px;margin:0 0 16px}
.skv .skv-people li{display:grid;gap:2px;font-size:15px}
.skv .skv-people b{font-weight:500}
.skv .skv-people span{color:var(--muted);font-size:14px}
.skv .skv-people .skv-link{justify-self:start;min-height:32px;display:inline-flex;align-items:center}
.skv .skv-people.is-compact{margin-top:28px;padding-top:20px;border-top:1px solid var(--rule)}
.skv .skv-fld2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
/* request lines: one per job, the division instead of quantity and unit */
.skv .skv-line--job{grid-template-columns:minmax(64px,84px) minmax(0,1fr) auto 44px}
.skv .skv-line__div{font-size:14px;color:var(--muted)}
@media (max-width:760px){.skv .skv-line--job{grid-template-columns:minmax(0,1fr) 44px}.skv .skv-line--job .skv-line__div{grid-column:1;grid-row:3}}
.skv .skv-drawer .skv-line--job .skv-line__div{grid-column:1;grid-row:3}
.skv .skv-card__fact{align-self:end;justify-self:start;display:grid;gap:8px;padding:0 4% 6%;width:100%;border-bottom:0}
.skv .skv-card__fact b{font-family:var(--d);font-stretch:130%;font-weight:700;font-size:clamp(34px,3.6vw,60px);line-height:.95;letter-spacing:-.02em;color:var(--navy)}
.skv .skv-card__fact span{font-size:14px;line-height:1.4;color:var(--muted);max-width:26ch}
.skv .skv-card__fact::before{content:"";display:block;height:11px;border-inline:1px solid var(--ink);background:linear-gradient(var(--ink),var(--ink)) center/100% 1px no-repeat;margin-bottom:10px}
.skv .skv-card__fact.is-big b{font-size:clamp(56px,7vw,120px)}
.skv .skv-card__fact.is-text b{font-size:clamp(24px,2.2vw,34px);line-height:1.1;text-transform:none}
.skv .skv-card__fact.is-big.is-text b{font-size:clamp(32px,3.4vw,52px)}
/* focus-guard.css, scoped: no ring after a tap or click, every ring for the keyboard; containers never ring */
html[data-input="pointer"] .skv :focus-visible:not(input):not(textarea):not(select){outline:none}
.skv [tabindex="-1"]:focus{outline:none}
`
