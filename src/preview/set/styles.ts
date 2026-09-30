/* Set styles. Everything is scoped under .set, every keyframe is prefixed set-, tokens live on .set (never :root),
   so nothing bleeds into the other previews in this SPA (memory: no-style-bleed-between-designs).
   Tokens: _docs/set-build/DESIGN.md §3. Square everywhere; the only curves are the ring device and the count pill. */

export const setCss = (B: string) => `
html:has(.set),body:has(.set){background-color:#FFFFFF}
@font-face{font-family:"SetDisplay";src:url("${B}fonts/set/StrichpunktSans-Variable.woff2") format("woff2");font-weight:400 900;font-stretch:100% 200%;font-display:swap}
@font-face{font-family:"SetText";src:url("${B}fonts/set/Switzer-Variable.woff2") format("woff2");font-weight:100 900;font-display:swap}

.set{--ink:#111111;--muted:#5C6166;--paper:#FFFFFF;--card:#F2F2F0;--card2:#E8E8E5;--petrol:#002D3D;--green:#83B635;--gdeep:#4F7A14;
  --rule:rgba(17,17,17,.14);--ease:cubic-bezier(.16,1,.3,1);--io:cubic-bezier(.87,0,.13,1);
  --gut:16px;--bar:64px;--sec:clamp(88px,9.38vw,160px);
  --d:"SetDisplay",Helvetica Neue,Arial,sans-serif;--t:"SetText",Helvetica Neue,Arial,sans-serif;
  background:var(--paper);color:var(--ink);font-family:var(--t);font-size:17px;line-height:1.5;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;touch-action:manipulation;-webkit-tap-highlight-color:rgba(131,182,53,.25);min-height:100vh;min-height:100svh;overflow-x:clip}
@media (min-width:1024px){.set{--gut:max(24px,2.34vw)}}
.set *,.set *::before,.set *::after{box-sizing:border-box}
.set :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd){margin:0;padding:0}
.set :where(ul,ol){list-style:none}
.set :where(a){color:inherit;text-decoration:none}
.set :where(button,input,select,textarea){font:inherit;color:inherit}
.set :where(button){background:none;border:0;padding:0;cursor:pointer}
.set img{display:block;max-width:100%}
.set ::selection{background:var(--green);color:var(--ink)}
.set :focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.set .set-dark :focus-visible,.set-dark :focus-visible{outline-color:#fff}
.set-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.set-skip:focus{position:fixed!important;left:12px;top:12px;width:auto;height:auto;clip:auto;z-index:500;background:var(--ink);color:#fff;padding:12px 16px}
.set .set-wrap{padding-inline:var(--gut)}
.set .set-tnum{font-variant-numeric:tabular-nums}

/* ---------- type ---------- */
.set .set-d{font-family:var(--d);font-stretch:160%;font-weight:760;text-transform:uppercase;line-height:.86;letter-spacing:-.02em;overflow-wrap:normal;word-break:normal;hyphens:none}
.set .set-d--xl{font-size:clamp(64px,13.2vw,232px)}
@media (max-width:600px){.set .set-d--xl{font-size:21vw}.set .set-d--l,.set .set-rail__head .set-d{font-size:15vw}}
.set .set-d--l{font-size:clamp(48px,8.4vw,150px)}
.set .set-h{font-family:var(--d);font-stretch:108%;font-weight:600;line-height:1.06;letter-spacing:-.02em}
.set .set-h,.set .set-lede,.set .set-acc__body,.set .set-row__desc{text-wrap:pretty}
.set .set-h{text-wrap:balance}
.set .set-az__group{content-visibility:auto;contain-intrinsic-size:auto 400px}
.set .set-lede{font-size:clamp(17px,1.35vw,20px);line-height:1.5;color:var(--muted);max-width:40ch}
/* the mask is taller than the .86 line box: Icelandic accents (Ö Á Í Ð) sit above the cap height and must not be cut */
.set .set-lm{display:block;overflow:hidden;padding:.24em 0 .1em;margin:-.24em 0 -.1em}
.set .set-ll{display:block}
.set .set-w{display:inline-block}
.set .set-label{font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.set .set-dots{height:2px;background-image:radial-gradient(circle,var(--ink) .8px,transparent 1.05px);background-size:5px 2px;background-repeat:repeat-x;opacity:.8}

/* ---------- ring device: the logo's stroke logic (black pipe wall, white bore line) ---------- */
.set .set-ring{position:relative;display:inline-grid;place-items:center;width:44px;height:44px;flex:none;color:var(--ink)}
.set .set-ring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.set .set-ring .r-wall{fill:none;stroke:currentColor;stroke-width:3.2}
.set .set-ring .r-bore{fill:none;stroke:var(--paper);stroke-width:.9}
.set .set-ring .r-draw{fill:none;stroke:var(--green);stroke-width:3.2;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s var(--ease)}
.set .set-ring .r-arr{position:relative;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6}
@media (hover:hover) and (pointer:fine){.set a:hover>.set-ring .r-draw,.set button:hover>.set-ring .r-draw,.set .set-ringlink:hover .r-draw{stroke-dashoffset:0}}
.set .set-ringlink{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-weight:500;font-size:15px}
.set .set-dark .set-ring .r-bore{stroke:var(--petrol)}

/* ---------- buttons ---------- */
.set .set-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:52px;padding:0 18px 0 22px;background:var(--ink);color:#fff;font-weight:500;font-size:15px;letter-spacing:.04em;text-transform:uppercase;border:1px solid var(--ink);transition:background-color .3s,color .3s}
.set .set-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.set .set-btn:hover svg{transform:translate(2px,-2px)}}
.set .set-btn:hover{background:var(--petrol);border-color:var(--petrol)}
.set .set-btn--line{background:transparent;color:var(--ink)}
.set .set-btn--line:hover{background:var(--ink);color:#fff}
.set .set-btn--green{background:var(--green);border-color:var(--green);color:var(--ink)}
.set .set-btn--green:hover{background:#9BCB52;border-color:#9BCB52}
.set .set-btn[disabled]{opacity:.4;cursor:not-allowed}
.set .set-link{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;min-height:44px;display:inline-flex;align-items:center}
.set .set-link:hover{text-decoration-thickness:2px}

/* ---------- chrome: the house mobile standard (constant glass bar + sticky awning), at every width ---------- */
.set .set-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:140;background:var(--paper);pointer-events:none}
.set .set-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:calc(var(--bar) + env(safe-area-inset-top,0px));padding-top:env(safe-area-inset-top,0px);background-color:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.set .set-bar__in{height:100%;display:flex;align-items:center;gap:24px;padding:0 var(--gut)}
.set .set-bar__logo{display:inline-flex;align-items:center;min-height:44px;margin-right:auto;overflow:hidden;padding-block:6px;visibility:hidden;transition:visibility 0s .5s}
.set .set-bar__logo svg{height:28px;width:auto;transform:translate3d(0,120%,0);opacity:0;transition:transform .5s var(--ease),opacity .3s var(--ease)}
.set .set-bar__logo.is-in{visibility:visible;transition:visibility 0s}
.set .set-bar__logo.is-in svg{transform:none;opacity:1;transition:transform .7s var(--ease),opacity .45s var(--ease)}
.set .set-nav{display:flex;gap:4px}
.set .set-nav a{position:relative;display:inline-flex;align-items:center;min-height:44px;padding:0 12px;font-size:15px;font-weight:500}
.set .set-nav a::after{content:"";position:absolute;left:12px;right:12px;bottom:10px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.set .set-nav a[aria-current="true"]::after{transform:scaleX(1);transform-origin:left}
@media (hover:hover) and (pointer:fine){.set .set-nav a:hover::after{transform:scaleX(1);transform-origin:left}}
.set .set-nav a[aria-current="true"]::before{content:"";position:absolute;left:3px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:var(--green)}
.set .set-listbtn{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 6px 0 14px;border:1px solid var(--ink);font-size:15px;font-weight:500}
.set .set-listbtn:hover{background:var(--ink);color:#fff}
.set .set-count{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 8px;border-radius:999px;background:var(--green);color:var(--ink);font-size:13px;font-weight:600;overflow:hidden}
.set .set-count span{display:block;animation:set-roll .5s var(--ease)}
@keyframes set-roll{from{transform:translateY(110%)}to{transform:none}}
.set .set-lang{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;font-size:14px;font-weight:500;letter-spacing:.06em}
.set .set-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center}
.set .set-burger i{display:block;width:22px;height:1.5px;background:var(--ink);position:relative}
.set .set-burger i::before,.set .set-burger i::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:var(--ink)}
.set .set-burger i::before{top:-7px}.set .set-burger i::after{top:7px}
@media (max-width:900px){.set .set-nav,.set .set-bar .set-lang{display:none}.set .set-burger{display:inline-flex}.set .set-bar__in{gap:10px}.set .set-listbtn__t{display:none}.set .set-listbtn{padding:0 8px;border:0}}
.set .set-menu{position:fixed;inset:var(--bar) 0 0 0;z-index:149;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:24px var(--gut) calc(24px + env(safe-area-inset-bottom));overflow:auto;overscroll-behavior:contain;opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.set .set-menu.is-open{opacity:1;visibility:visible;transition:opacity .35s}
.set .set-menu a{display:flex;align-items:baseline;gap:16px;min-height:56px;border-bottom:1px solid var(--rule);font-family:var(--d);font-stretch:125%;font-weight:620;font-size:clamp(28px,8vw,40px)}
.set .set-menu a small{font-family:var(--t);font-size:14px;font-weight:500;color:var(--muted);min-width:24px}

/* ---------- loader: the logo's contours draw on over petrol, then the Live-up shutter ---------- */
.set .set-load{position:fixed;inset:0;z-index:400;pointer-events:none}
.set .set-load__field{position:absolute;inset:0;background:var(--petrol);transition:transform 1.2s var(--io)}
.set .set-load__mark{position:absolute;left:50%;top:50%;width:min(46vw,300px);transform:translate(-50%,-50%);transition:opacity .5s}
.set .set-load__mark svg{width:100%;height:auto;overflow:visible}
.set .set-logo__path{fill:#fff;fill-opacity:0;stroke:#fff;stroke-width:1.4px;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:set-draw 1.1s var(--ease) .1s forwards,set-fill .5s ease 1s forwards}
@keyframes set-draw{to{stroke-dashoffset:0}}
@keyframes set-fill{to{fill-opacity:1}}
.set .set-load.is-leaving .set-load__field{transform:translate3d(0,-100%,0)}
.set .set-load.is-leaving .set-load__mark{opacity:0}

/* ---------- hero ---------- */
.set .set-hero{position:relative;padding-top:calc(var(--bar) + 20px);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-inline:var(--gut)}
.set .set-hero__text{grid-column:1/8;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,3vw,48px) 0 clamp(32px,4vw,56px)}
.set .set-hero__mark{margin-bottom:auto;padding-bottom:40px}
.set .set-hero__mark svg{display:block;width:clamp(150px,27vw,470px);height:auto}
.set .set-hero__kicker{display:flex;align-items:center;gap:10px;margin-bottom:clamp(20px,3vw,40px)}
.set .set-hero__kicker::before{content:"";width:12px;height:12px;border-radius:50%;border:2.5px solid var(--ink);box-shadow:inset 0 0 0 1px var(--paper),inset 0 0 0 5px var(--green)}
.set .set-hero h1{font-size:clamp(40px,6.3vw,116px);max-width:11.5ch}
.set .set-hero__sub{margin-top:clamp(20px,2.4vw,32px)}
.set .set-hero__cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:clamp(28px,3vw,44px)}
.set .set-hero__fig{grid-column:8/13;position:relative}
.set .set-hero__frame{position:relative;overflow:hidden;height:calc(100svh - var(--bar) - 64px);min-height:540px;max-height:940px;background:var(--card)}
.set .set-hero__frame img{width:100%;height:100%;object-fit:cover;will-change:transform}
.set .set-hero__ring{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.set .set-hero__ring ellipse{fill:none;stroke:var(--green);stroke-width:5;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1}
.set .set-hero__ring.is-on ellipse{transition:stroke-dashoffset 1.6s var(--ease);stroke-dashoffset:0}
.set .set-hero__ring ellipse+ellipse{stroke:#fff;stroke-width:1.2;opacity:.9}
.set .set-cap{margin-top:12px;font-size:14px;line-height:1.45;color:var(--muted);max-width:52ch}
@media (max-width:900px){.set .set-hero__mark{display:none}.set .set-hero__text,.set .set-hero__fig{grid-column:1/-1}.set .set-hero__frame{height:auto;aspect-ratio:4/4.4;min-height:0}}

/* ---------- catalogue ---------- */
.set .set-cat{padding-top:var(--sec)}
.set .set-cat__head{padding-inline:var(--gut)}
.set .set-cat__lead{margin-top:clamp(20px,2vw,28px);max-width:62ch;color:var(--muted)}
.set .set-cat .set-dots{margin:clamp(28px,3vw,44px) var(--gut) 0}
.set .set-filter{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;padding:16px var(--gut)}
.set .set-filter label{display:inline-flex;align-items:center;gap:10px;font-size:15px}
.set .set-filter label>span{font-weight:500}
.set .set-select{appearance:none;-webkit-appearance:none;min-height:44px;padding:0 40px 0 12px;border:1px solid rgba(17,17,17,.3);background:var(--paper) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m2.5 4.5 3.5 3.5 3.5-3.5' fill='none' stroke='%23111' stroke-width='1.4'/%3E%3C/svg%3E") no-repeat right 12px center/12px;border-radius:0;font-size:16px;max-width:100%}
.set .set-search{display:flex;align-items:center;flex:1 1 240px;max-width:420px;min-height:44px;border-bottom:1px solid var(--ink)}
.set .set-search svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6}
.set .set-search input{flex:1;min-width:0;min-height:44px;border:0;background:transparent;padding:0 10px;font-size:16px;outline:none}
.set .set-search:focus-within{outline:2px solid var(--ink);outline-offset:3px}
.set .set-filter__count{font-size:14px;color:var(--muted)}
.set .set-toggle{display:inline-flex;margin-left:auto}
.set .set-toggle button{min-width:44px;height:44px;padding:0 12px;font-size:13px;font-weight:600;letter-spacing:.04em;border:1px solid var(--ink);display:inline-grid;place-items:center}
.set .set-toggle button+button{border-left:0}
.set .set-toggle button[aria-pressed="true"]{background:var(--ink);color:#fff}
.set .set-toggle svg{width:16px;height:16px;fill:currentColor}
.set .set-stage{transition:opacity .2s var(--ease)}
.set .set-stage.is-swapping{opacity:0}

.set .set-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(40px,4.6vw,76px) var(--gut) 0}
.set .set-row__text{grid-column:1/4;display:flex;flex-direction:column;min-width:0}
.set .set-row__n{font-size:14px;font-weight:500;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.set .set-row__n::after{content:"";flex:1;max-width:48px;height:1px;background:var(--ink);opacity:.4}
.set .set-row__text h3{font-size:clamp(24px,2vw,34px);overflow-wrap:normal}
.set .set-row__desc{margin-top:14px;font-size:16px;line-height:1.5;color:var(--muted)}
.set .set-row__meta{margin-top:12px;font-size:13px;color:var(--muted)}
.set .set-row__links{margin-top:auto;padding-top:24px;display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.set .set-row__docs{display:flex;gap:16px;font-size:14px}
.set .set-row__cards{grid-column:4/13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-width:0}
@media (max-width:900px){
  .set .set-row{display:block}
  .set .set-row__links{padding-top:12px;flex-direction:row;flex-wrap:wrap;align-items:center;gap:4px 18px}
  .set .set-row__cards{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:20px calc(var(--gut)*-1) 0;padding:0 var(--gut) 6px;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none}
  .set .set-row__cards::-webkit-scrollbar{display:none}
  .set .set-row__cards>*{flex:0 0 min(72vw,300px);scroll-snap-align:start}
}

/* product card: Set's own white-background photos multiplied into the card grey */
.set .set-card{position:relative;display:flex;flex-direction:column;background:var(--card);padding:14px;min-width:0;aspect-ratio:1/1.22;container-type:inline-size}
.set .set-card__leaf{font-size:12.5px;line-height:1.3;color:var(--muted);display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;padding-right:4px}
.set .set-card__img{flex:1;min-height:0;display:grid;place-items:center;padding:8% 6%;overflow:hidden}
.set .set-card__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;transition:transform .9s var(--ease)}
.set .set-card__img.is-tile{padding:0;margin:4px 0}
.set .set-card__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
.set .set-prod__img.is-tile{padding:0}
.set .set-prod__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
@media (hover:hover) and (pointer:fine){.set .set-card:hover .set-card__img img{transform:scale(1.045)}}
.set .set-card__ph{width:52%;aspect-ratio:1;color:rgba(17,17,17,.2)}
.set .set-card__ph svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2}
.set .set-card__name{font-size:15px;font-weight:500;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
.set .set-card__name a::after{content:"";position:absolute;inset:0}
.set .set-card__foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:6px}
.set .set-card__sku{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.set .set-add{position:relative;z-index:2;flex:none;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--ink);background:var(--paper);transition:background-color .25s,color .25s}
.set .set-add svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}
.set .set-add:hover{background:var(--ink);color:#fff}
.set .set-add.is-on{background:var(--green);border-color:var(--green);color:var(--ink)}
.set .set-add.is-on svg{animation:set-pop .35s var(--ease)}
@keyframes set-pop{from{transform:scale(.6)}to{transform:none}}
.set .set-card--skel{animation:set-pulse 1.4s ease-in-out infinite alternate}
@keyframes set-pulse{from{opacity:1}to{opacity:.55}}

/* A–Ö list */
.set .set-az{padding:24px var(--gut) 0}
.set .set-az__jump{display:flex;flex-wrap:wrap;gap:2px;padding-bottom:16px;border-bottom:1px solid var(--rule)}
.set .set-az__jump a{min-width:40px;min-height:44px;display:grid;place-items:center;font-weight:500;font-size:15px}
.set .set-az__jump a:hover{background:var(--card)}
.set .set-az__group{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-top:28px;scroll-margin-top:calc(var(--bar) + 16px)}
.set .set-az__letter{grid-column:1/3;font-size:clamp(40px,4vw,64px)}
.set .set-az__rows{grid-column:3/13}
.set .set-az__row{display:grid;grid-template-columns:minmax(96px,150px) minmax(0,1fr) minmax(0,.7fr) 44px;align-items:center;gap:16px;min-height:52px;border-bottom:1px solid var(--rule);font-size:15px}
.set .set-az__row a:hover{text-decoration:underline;text-underline-offset:3px}
.set .set-az__sku{color:var(--muted);font-variant-numeric:tabular-nums}
.set .set-az__leaf{color:var(--muted);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.set .set-az .set-add{width:44px;height:44px}
@media (max-width:900px){.set .set-az__group{display:block}.set .set-az__letter{margin-bottom:8px}.set .set-az__row{grid-template-columns:minmax(0,1fr) 44px;gap:4px 12px;padding:8px 0}.set .set-az__sku{grid-row:2;font-size:13px}.set .set-az__leaf{display:none}.set .set-az__row .set-add{grid-row:1/3;grid-column:2}}
.set .set-empty{padding:40px var(--gut);color:var(--muted)}

/* ---------- family + product pages ---------- */
.set .set-page{padding-top:calc(var(--bar) + clamp(28px,4vw,56px))}
.set .set-crumbs{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:14px;color:var(--muted);padding:0 var(--gut) 20px}
.set .set-crumbs a{text-decoration:underline;text-underline-offset:3px;min-height:32px;display:inline-flex;align-items:center}
.set .set-crumbs span[aria-hidden]{opacity:.5}
.set .set-fam__head{padding:0 var(--gut)}
.set .set-fam__intro{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);margin-top:clamp(24px,3vw,40px);padding:0 var(--gut)}
.set .set-fam__intro p{grid-column:1/7}
.set .set-fam__intro div{grid-column:9/13;display:flex;flex-direction:column;align-items:flex-start}
@media (max-width:900px){.set .set-fam__intro p,.set .set-fam__intro div{grid-column:1/-1}.set .set-fam__intro div{margin-top:12px}}
.set .set-tabs{display:flex;gap:2px 22px;flex-wrap:wrap;padding:0 var(--gut)}
.set .set-tabs button{position:relative;min-height:44px;font-size:15px;color:var(--muted);text-align:left}
.set .set-tabs button::after{content:"";position:absolute;left:0;right:0;bottom:8px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.set .set-tabs button:hover,.set .set-tabs button[aria-pressed="true"]{color:var(--ink)}
.set .set-tabs button:hover::after,.set .set-tabs button[aria-pressed="true"]::after{transform:scaleX(1);transform-origin:left}
.set .set-tabs sup{font-size:11px;margin-left:3px}
.set .set-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:12px var(--gut) 0}
@media (max-width:1100px){.set .set-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.set .set-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.set .set-card{padding:10px}.set .set-card__name{font-size:14px}}
.set .set-pager{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px var(--gut) 0}
.set .set-pager button[aria-current="page"] .set-ring{color:var(--ink)}
.set .set-pager__n{display:inline-grid;place-items:center;width:44px;height:44px;font-size:15px;font-variant-numeric:tabular-nums}
.set .set-pager__n[aria-current="page"]{position:relative}
.set .set-pager__n[aria-current="page"]::before{content:"";position:absolute;inset:3px;border-radius:50%;border:1.5px dashed var(--ink)}
.set .set-pager button[disabled]{opacity:.3;cursor:default}

.set .set-prod{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.set .set-prod__img{grid-column:1/7;background:var(--card);aspect-ratio:1;display:grid;place-items:center;padding:10%}
.set .set-prod__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.set .set-prod__img .set-card__ph{width:40%}
.set .set-prod__info{grid-column:8/13;display:flex;flex-direction:column;gap:20px;padding-top:4px}
.set .set-prod h1{font-size:clamp(30px,3vw,48px);line-height:1.08;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
.set .set-prod__sku{font-size:15px;color:var(--muted)}
.set .set-prod__sku b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.set .set-spec{border-top:1px solid var(--ink)}
.set .set-spec div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid var(--rule);font-size:15px}
.set .set-spec dt{color:var(--muted)}
.set .set-spec dd{font-variant-numeric:tabular-nums}
.set .set-buy{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
.set .set-buy .set-btn{flex:1 1 200px}
.set .set-prod__links{display:flex;flex-wrap:wrap;gap:4px 20px;font-size:15px}
.set .set-prod__on{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:500}
.set .set-prod__on span{width:10px;height:10px;border-radius:50%;background:var(--green)}
.set .set-prod__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.set .set-prod__img,.set .set-prod__info{grid-column:1/-1}.set .set-prod__info{margin-top:24px}}
.set .set-related{padding-top:var(--sec)}
.set .set-related h2{padding:0 var(--gut) 20px;font-size:clamp(24px,2.4vw,36px)}

/* qty stepper + unit */
.set .set-qty{display:inline-flex;align-items:stretch;border:1px solid rgba(17,17,17,.3);height:48px}
.set .set-qty button{width:44px;display:grid;place-items:center;font-size:20px;line-height:1}
.set .set-qty button:hover{background:var(--card)}
.set .set-qty input{width:64px;border:0;border-inline:1px solid rgba(17,17,17,.15);text-align:center;font-size:16px;font-variant-numeric:tabular-nums;background:transparent;-moz-appearance:textfield;appearance:textfield}
.set .set-qty input::-webkit-inner-spin-button,.set .set-qty input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.set .set-buy .set-select,.set .set-line .set-select{min-height:48px}

/* ---------- numbered accordion (image 2) ---------- */
.set .set-how{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:var(--sec) var(--gut) 0}
.set .set-how__head{grid-column:1/5;display:flex;flex-direction:column;align-items:flex-start;gap:32px}
.set .set-how__head .set-d{font-size:clamp(44px,5.6vw,96px)}
.set .set-how__list{grid-column:6/13}
@media (max-width:900px){.set .set-how__head,.set .set-how__list{grid-column:1/-1}.set .set-how__list{margin-top:28px}.set .set-how__head .set-btn{order:3}}
.set .set-acc{position:relative;border-bottom:1px solid rgba(17,17,17,.55)}
.set .set-acc::before,.set .set-acc::after{content:"";position:absolute;bottom:0;width:1px;height:7px;background:rgba(17,17,17,.55)}
.set .set-acc::before{left:0}.set .set-acc::after{right:0}
.set .set-acc__btn{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 44px;align-items:center;gap:12px;min-height:72px;text-align:left}
.set .set-acc__n{display:inline-grid;place-items:center;width:34px;height:26px;font-size:14px;font-weight:500;font-variant-numeric:tabular-nums;transition:background-color .4s}
.set .set-acc.is-open .set-acc__n{background:var(--green)}
.set .set-acc__t{font-family:var(--d);font-stretch:118%;font-weight:600;font-size:clamp(16px,1.35vw,20px);text-transform:uppercase;letter-spacing:.01em;line-height:1.2}
.set .set-acc__pm{justify-self:end;position:relative;width:26px;height:26px;border:1px solid var(--ink)}
.set .set-acc__pm::before,.set .set-acc__pm::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:1.2px;margin:-.6px 0 0 -6px;background:var(--ink);transition:transform .4s var(--ease)}
.set .set-acc__pm::after{transform:rotate(90deg)}
.set .set-acc.is-open .set-acc__pm::after{transform:rotate(0)}
.set .set-acc__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s var(--ease)}
.set .set-acc.is-open .set-acc__panel{grid-template-rows:1fr}
.set .set-acc__panel>div{overflow:hidden;min-height:0;visibility:hidden;transition:visibility 0s .5s}
.set .set-acc.is-open .set-acc__panel>div{visibility:visible;transition:visibility 0s}
.set .set-acc__body{padding:0 56px 26px 64px;color:var(--muted);max-width:62ch}
.set .set-acc__body a{color:var(--ink)}
@media (max-width:600px){.set .set-acc__btn{grid-template-columns:44px minmax(0,1fr) 44px}.set .set-acc__body{padding:0 0 22px 56px}}

/* ---------- production rail: card-flick (Whitedesert), active card petrol ---------- */
.set .set-rail{padding-top:var(--sec)}
.set .set-rail__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);align-items:end;padding:0 var(--gut)}
.set .set-rail__head .set-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.set .set-rail__head p{grid-column:1/7;margin-top:22px}
.set .set-rail__arrows{grid-column:10/13;justify-self:end;display:flex;gap:8px}
@media (max-width:900px){.set .set-rail__head p{grid-column:1/-1}.set .set-rail__arrows{grid-column:1/-1;justify-self:start;margin-top:16px}}
.set .set-rail__track{display:flex;gap:12px;height:clamp(520px,44vw,640px);padding:36px var(--gut) 0}
.set .set-rc{position:relative;flex:1 1 0;min-width:0;display:flex;flex-direction:column;background:var(--card2);overflow:hidden;cursor:pointer;transition:flex-grow .75s var(--ease),background-color .4s,color .4s;text-align:left}
.set .set-rc.is-on{flex-grow:5;background:var(--petrol);color:#fff;cursor:default}
.set .set-rc__top{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 0}
.set .set-rc__n{position:relative;display:inline-grid;place-items:center;min-width:38px;height:28px;padding:0 6px;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;transition:background-color .4s,color .4s}
.set .set-rc.is-on .set-rc__n{background:var(--green);color:var(--ink)}
.set .set-rc__arr{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.set .set-rc__media{position:relative;flex:1;min-height:0;margin:14px 16px 0;overflow:hidden}
.set .set-rc__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.15)}
.set .set-rc__noimg{position:absolute;inset:0;display:grid;place-items:center}
.set .set-rc__noimg svg{width:min(60%,240px);height:auto;fill:none;stroke:currentColor;stroke-width:1.4;opacity:.55}
.set .set-rc__body{padding:16px;display:grid;gap:8px}
.set .set-rc__y{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.set .set-rc__t{font-family:var(--d);font-stretch:118%;font-weight:620;font-size:clamp(18px,1.5vw,24px);line-height:1.1;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.set .set-rc.is-on .set-rc__t{white-space:normal}
.set .set-rc__b{font-size:15px;line-height:1.45;max-width:46ch;opacity:0;max-height:0;transition:opacity .4s}
.set .set-rc.is-on .set-rc__b{opacity:.88;max-height:none;transition:opacity .5s .3s}
.set .set-rc__cap{font-size:12.5px;opacity:0;line-height:1.4}
.set .set-rc.is-on .set-rc__cap{opacity:.66;transition:opacity .5s .35s}
.set .set-rc__links{display:flex;gap:16px;visibility:hidden;opacity:0}
.set .set-rc.is-on .set-rc__links{visibility:visible;opacity:1;transition:opacity .5s .35s}
.set .set-rc__links a{text-decoration:underline;text-underline-offset:3px;min-height:44px;display:inline-flex;align-items:center}
@media (max-width:900px),(hover:none){
  .set .set-rail__track{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none;padding-bottom:6px}
  .set .set-rail__track::-webkit-scrollbar{display:none}
  .set .set-rc{flex:0 0 min(80vw,380px);scroll-snap-align:start;min-height:520px}
  .set .set-rc.is-on{flex-grow:0}
  .set .set-rc__b,.set .set-rc__cap{opacity:.88;max-height:none}
  .set .set-rc__links{visibility:visible;opacity:1}
  .set .set-rc__t{white-space:normal}
  .set .set-rc__media{flex:0 0 auto;aspect-ratio:4/3}
}

/* ---------- material list teaser ---------- */
.set .set-teaser{margin-top:var(--sec);background:var(--card);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(56px,6vw,104px) var(--gut)}
.set .set-teaser__text{grid-column:1/7;display:flex;flex-direction:column;align-items:flex-start;gap:24px}
.set .set-teaser__text .set-d{font-size:clamp(44px,6.6vw,120px)}
.set .set-teaser__list{grid-column:8/13;align-self:end;background:var(--paper)}
.set .set-teaser__list li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:16px 18px;border-bottom:1px solid var(--rule);font-size:15px}
.set .set-teaser__list li span{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.set .set-teaser__foot svg{height:20px;width:auto;fill:#fff}
.set .set-teaser__list .set-teaser__foot{display:flex;justify-content:space-between;align-items:center;background:var(--petrol);color:#fff;border:0}
.set .set-teaser__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.set .set-teaser__text,.set .set-teaser__list{grid-column:1/-1}.set .set-teaser__list{margin-top:32px}}

/* ---------- material list page ---------- */
.set .set-lp{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.set .set-lp__head{grid-column:1/-1;margin-bottom:clamp(28px,3vw,44px)}
.set .set-lp__head .set-lede{max-width:64ch;margin-top:20px}
.set .set-lp__main{grid-column:1/8;min-width:0}
.set .set-lp__side{grid-column:9/13;min-width:0}
@media (max-width:1000px){.set .set-lp__main,.set .set-lp__side{grid-column:1/-1}.set .set-lp__side{margin-top:48px}}
.set .set-lp__name{display:grid;gap:6px;margin-bottom:18px}
.set .set-lines{border-top:1px solid var(--ink)}
.set .set-line{display:grid;grid-template-columns:minmax(92px,120px) minmax(0,1fr) auto auto 44px;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--rule)}
.set .set-line__sku{font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}
.set .set-line__name{font-size:15px;font-weight:500;min-width:0}
.set .set-line__name a:hover{text-decoration:underline;text-underline-offset:3px}
.set .set-line__rm{width:44px;height:44px;display:grid;place-items:center}
.set .set-line__rm svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.set .set-line__rm:hover{background:var(--card)}
.set .set-lines__hd{display:grid;grid-template-columns:minmax(92px,120px) minmax(0,1fr) auto auto 44px;gap:14px;padding:10px 0;font-size:13px;color:var(--muted);border-bottom:1px solid var(--rule)}
@media (max-width:760px){
  .set .set-lines__hd{display:none}
  .set .set-line{grid-template-columns:minmax(0,1fr) 44px;gap:8px 10px}
  .set .set-line__sku{grid-column:1}.set .set-line__name{grid-column:1;grid-row:2}
  .set .set-line__rm{grid-column:2;grid-row:1/3}
  .set .set-line .set-qty,.set .set-line .set-select{grid-row:3}
  .set .set-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
}
@media (min-width:761px){.set .set-line__ctl{display:contents}}
.set .set-lp__tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.set .set-lp__tools .set-btn{min-height:44px;font-size:13px;gap:14px}
.set .set-saved{margin-top:12px;border:1px solid var(--rule)}
.set .set-saved li{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 14px;border-bottom:1px solid var(--rule);font-size:15px}
.set .set-saved li:last-child{border-bottom:0}
.set .set-saved li button:first-child{flex:1;text-align:left;min-height:44px}
.set .set-saved small{color:var(--muted);font-size:13px}
.set .set-fld{display:grid;gap:6px;margin-bottom:16px}
.set .set-fld>span{font-size:14px;font-weight:500}
.set .set-fld>span em{font-style:normal;color:var(--muted);font-weight:400}
.set .set-inp{width:100%;min-height:48px;padding:10px 12px;border:1px solid rgba(17,17,17,.3);border-radius:0;background:var(--paper);font-size:16px}
.set textarea.set-inp{min-height:104px;resize:vertical;line-height:1.45}
.set .set-inp:focus{outline:2px solid var(--ink);outline-offset:1px}
.set .set-fs{border:0;padding:0;margin:0 0 28px}
.set .set-fs legend{font-family:var(--d);font-stretch:118%;font-weight:620;text-transform:uppercase;font-size:18px;padding:0 0 14px;border-bottom:1px solid var(--ink);width:100%;margin-bottom:16px}
.set .set-radio{display:flex;align-items:center;gap:12px;min-height:44px;font-size:15px;cursor:pointer}
.set .set-radio input{width:20px;height:20px;accent-color:var(--ink)}
.set .set-file{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.set .set-file label{cursor:pointer}
.set .set-file small,.set .set-help{font-size:13px;color:var(--muted)}
.set .set-lp__send{display:grid;gap:12px;position:sticky;top:calc(var(--bar) + 16px)}
.set .set-lp__send .set-btn{width:100%}
.set .set-warn{font-size:14px;color:var(--ink);background:#F4F8EC;border-left:3px solid var(--green);padding:10px 12px}
.set .set-empty-list{padding:28px;background:var(--card);display:grid;gap:14px;justify-items:start}

/* ---------- drawer + modal: the video's blur backdrop, panel resolves from blur ---------- */
.set .set-scrim{position:fixed;inset:0;z-index:300;visibility:hidden;transition:visibility 0s .2s}
.set .set-scrim::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .2s var(--ease)}
.set .set-scrim.is-open{visibility:visible;transition:visibility 0s}
.set .set-scrim.is-open::before{opacity:1;transition-duration:.25s}
.set .set-panel{opacity:0;filter:blur(12px);transform:translate3d(0,8px,0);transition:opacity .2s var(--ease),filter .2s var(--ease),transform .2s var(--ease)}
.set .set-drawer.set-panel{filter:blur(8px);transform:translate3d(24px,0,0)}
.set .set-scrim.is-open .set-panel{transition-duration:.3s}
.set .set-scrim.is-open .set-panel{opacity:1;filter:none;transform:none}
.set .set-drawer{z-index:1;position:absolute;top:0;right:0;bottom:0;width:min(480px,100%);background:var(--paper);border-left:1px solid var(--rule);display:flex;flex-direction:column}
.set .set-drawer__head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 8px 0 20px;min-height:var(--bar);background:var(--petrol);color:#fff}
.set .set-drawer__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:20px}
.set .set-x{width:44px;height:44px;display:grid;place-items:center}
.set .set-x svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}
.set .set-drawer__body{flex:1;overflow:auto;overscroll-behavior:contain;padding:8px 20px}
.set .set-drawer__foot{padding:16px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--rule);display:grid;gap:10px}
.set .set-drawer .set-line{grid-template-columns:minmax(0,1fr) 44px}
.set .set-drawer .set-line__sku{grid-column:1}
.set .set-drawer .set-line__name{grid-column:1;grid-row:2}
.set .set-drawer .set-line__rm{grid-column:2;grid-row:1/3}
.set .set-drawer .set-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
.set .set-modal{z-index:1;position:absolute;left:50%;top:50%;width:min(640px,calc(100% - 24px));max-height:calc(100% - 24px);translate:-50% -50%;background:var(--paper);border:1px solid var(--rule);display:flex;flex-direction:column}
.set .set-modal__head{display:flex;align-items:center;justify-content:space-between;padding:4px 8px 4px 24px;border-bottom:1px solid var(--rule);min-height:64px}
.set .set-modal__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:clamp(18px,2vw,24px)}
.set .set-modal__body{overflow:auto;overscroll-behavior:contain;padding:20px 24px;display:grid;gap:16px}
.set .set-modal__foot{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;padding:16px 24px;border-top:1px solid var(--rule)}
.set .set-sum{display:grid;gap:0;border-top:1px solid var(--ink)}
.set .set-sum div{display:grid;grid-template-columns:minmax(110px,.6fr) minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--rule);font-size:15px}
.set .set-sum dt{color:var(--muted)}
.set .set-sum .is-missing dd{color:var(--ink);font-weight:500}
.set .set-sum .is-missing dd::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:8px;vertical-align:1px}
.set .set-ack{display:grid;gap:14px;justify-items:start}
.set .set-ack__ring{width:72px;height:72px}
.set .set-ack__ring circle{fill:none;stroke-width:5;stroke-dasharray:1;stroke-dashoffset:1;animation:set-draw .9s var(--ease) .15s forwards}
.set .set-ack__ring .a{stroke:var(--ink)}.set .set-ack__ring .b{stroke:var(--green);stroke-width:2}

/* ---------- staff review ---------- */
.set .set-rv{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.set .set-rv__q{grid-column:1/8;min-width:0}
.set .set-rv__d{grid-column:8/13;min-width:0}
@media (max-width:1000px){.set .set-rv__q,.set .set-rv__d{grid-column:1/-1}.set .set-rv__d{margin-top:32px}}
.set .set-tbl{width:100%;border-collapse:collapse;font-size:15px}
.set .set-tbl th{text-align:left;font-size:13px;font-weight:500;color:var(--muted);padding:10px 12px 10px 0;border-bottom:1px solid var(--ink)}
.set .set-tbl td{padding:0 12px 0 0;border-bottom:1px solid var(--rule);vertical-align:middle}
.set .set-tbl td button{display:block;width:100%;min-height:56px;text-align:left}
.set .set-tbl tr.is-sel td{background:var(--card)}
.set .set-tbl tr:hover td{background:#F7F7F5}
.set .set-tag{display:inline-block;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 7px;border:1px solid rgba(17,17,17,.35);white-space:nowrap}
.set .set-tag--you{background:var(--green);border-color:var(--green)}
.set .set-st{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.set .set-st::before{content:"";width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink)}
.set .set-st--review::before{background:linear-gradient(90deg,var(--ink) 50%,transparent 50%)}
.set .set-st--quoted::before{background:var(--ink)}
.set .set-rv__tblwrap{overflow-x:auto}
@media (max-width:640px){.set .set-tbl .c-from,.set .set-tbl .c-date{display:none}}
.set .set-rv__card{background:var(--card);padding:22px;display:grid;gap:16px}
.set .set-rv__card h2{font-size:22px}
.set .set-flags{display:flex;flex-wrap:wrap;gap:8px}
.set .set-flag{font-size:13px;padding:5px 10px;background:var(--paper);border-left:3px solid var(--green)}
.set .set-rv__lines li{display:grid;grid-template-columns:minmax(80px,110px) minmax(0,1fr) auto;gap:10px;padding:8px 0;border-bottom:1px solid var(--rule);font-size:14px}
.set .set-rv__lines span:first-child{color:var(--muted);font-variant-numeric:tabular-nums}
.set .set-rv__lines span:last-child{font-variant-numeric:tabular-nums;white-space:nowrap}

/* ---------- footer ---------- */
.set .set-foot{margin-top:var(--sec);background:var(--petrol);color:#fff;padding:clamp(56px,6vw,96px) var(--gut) 40px}
.set .set-foot__logo svg{height:clamp(44px,5vw,72px);width:auto;fill:#fff}
.set .set-foot__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);row-gap:36px;margin-top:48px}
.set .set-foot__col{grid-column:span 3;display:grid;gap:6px;align-content:start;font-size:15px;line-height:1.55}
.set .set-foot__col h3{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin-bottom:8px}
.set .set-foot__col a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.4);min-height:32px;display:inline-flex;align-items:center}
.set .set-foot__col a:hover{text-decoration-color:#fff}
.set .set-foot__small{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,.18);display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.7)}
@media (max-width:1000px){.set .set-foot__col{grid-column:span 6}}
@media (max-width:560px){.set .set-foot__col{grid-column:1/-1}}

/* reduced motion: nothing moves on its own; the engine is never started */
@media (prefers-reduced-motion:reduce){
  .set .set-bar__logo svg{transform:none!important}
  .set *,.set *::before,.set *::after{transition-duration:.2s!important;animation-duration:.01ms!important;animation-delay:0s!important}
  .set .set-logo__path{stroke-dashoffset:0;fill-opacity:1}
  .set .set-panel{filter:none!important;transform:none!important}
  .set .set-rc{transition:background-color .2s,color .2s}
}
`
