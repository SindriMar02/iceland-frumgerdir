/* HEGAS styles (the Set system re-aimed). Everything is scoped under .hg, every keyframe is prefixed hg-, tokens live on .hg (never :root),
   so nothing bleeds into the other previews in this SPA (memory: no-style-bleed-between-designs).
   Tokens: src/preview/hegas/DESIGN.md §3. Square everywhere, like the logo's frame; the only curves are the bore in the mark and the count pill. */

export const hgCss = (B: string) => `
html:has(.hg),body:has(.hg){background-color:#FFFFFF}
@font-face{font-family:"HgDisplay";src:url("${B}fonts/set/StrichpunktSans-Variable.woff2") format("woff2");font-weight:400 900;font-stretch:100% 200%;font-display:swap}
@font-face{font-family:"HgText";src:url("${B}fonts/set/Switzer-Variable.woff2") format("woff2");font-weight:100 900;font-display:swap}

.hg{--ink:#0E1626;--muted:#566070;--paper:#FFFFFF;--card:#F0F2F5;--card2:#E3E7ED;--navy:#0A2A78;--blue:#073ED7;--sky:#A9BDFF;
  --rule:rgba(17,17,17,.14);--ease:cubic-bezier(.16,1,.3,1);--io:cubic-bezier(.87,0,.13,1);
  --gut:16px;--bar:64px;--sec:clamp(88px,9.38vw,160px);
  --d:"HgDisplay",Helvetica Neue,Arial,sans-serif;--t:"HgText",Helvetica Neue,Arial,sans-serif;
  background:var(--paper);color:var(--ink);font-family:var(--t);font-size:17px;line-height:1.5;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;touch-action:manipulation;-webkit-tap-highlight-color:rgba(7,62,215,.18);min-height:100vh;min-height:100svh;overflow-x:clip}
@media (min-width:1024px){.hg{--gut:max(24px,2.34vw)}}
.hg *,.hg *::before,.hg *::after{box-sizing:border-box}
.hg :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd){margin:0;padding:0}
.hg :where(ul,ol){list-style:none}
.hg :where(a){color:inherit;text-decoration:none}
.hg :where(button,input,select,textarea){font:inherit;color:inherit}
.hg :where(button){background:none;border:0;padding:0;cursor:pointer}
.hg img{display:block;max-width:100%}
.hg ::selection{background:var(--blue);color:#fff}
.hg :focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.hg .hg-dark :focus-visible,.hg-dark :focus-visible{outline-color:#fff}
.hg-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.hg-skip:focus{position:fixed!important;left:12px;top:12px;width:auto;height:auto;clip:auto;z-index:500;background:var(--ink);color:#fff;padding:12px 16px}
.hg .hg-wrap{padding-inline:var(--gut)}
.hg .hg-tnum{font-variant-numeric:tabular-nums}

/* ---------- type ---------- */
.hg .hg-d{font-family:var(--d);font-stretch:160%;font-weight:760;text-transform:uppercase;line-height:.86;letter-spacing:-.02em;overflow-wrap:normal;word-break:normal;hyphens:none}
.hg .hg-d--xl{font-size:clamp(64px,13.2vw,232px)}
@media (max-width:600px){.hg .hg-d--xl{font-size:21vw}.hg .hg-d--l,.hg .hg-rail__head .hg-d{font-size:15vw}}
.hg .hg-d--l{font-size:clamp(48px,8.4vw,150px)}
.hg .hg-h{font-family:var(--d);font-stretch:108%;font-weight:600;line-height:1.06;letter-spacing:-.02em}
.hg .hg-h,.hg .hg-lede,.hg .hg-acc__body,.hg .hg-row__desc{text-wrap:pretty}
.hg .hg-h{text-wrap:balance}
.hg .hg-az__group{content-visibility:auto;contain-intrinsic-size:auto 400px}
.hg .hg-lede{font-size:clamp(17px,1.35vw,20px);line-height:1.5;color:var(--muted);max-width:40ch}
/* the mask is taller than the .86 line box: Icelandic accents (Ö Á Í Ð) sit above the cap height and must not be cut */
.hg .hg-lm{display:block;overflow:hidden;padding:.24em 0 .1em;margin:-.24em 0 -.1em}
.hg .hg-ll{display:block}
.hg .hg-w{display:inline-block}
.hg .hg-label{font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.hg .hg-dots{height:2px;background-image:radial-gradient(circle,var(--ink) .8px,transparent 1.05px);background-size:5px 2px;background-repeat:repeat-x;opacity:.8}

/* ---------- frame device: the logo's square (ink frame, white inner line), drawn blue on hover ---------- */
.hg .hg-ring{position:relative;display:inline-grid;place-items:center;width:44px;height:44px;flex:none;color:var(--ink)}
.hg .hg-ring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.hg .hg-ring .r-wall{fill:none;stroke:currentColor;stroke-width:3.2}
.hg .hg-ring .r-bore{fill:none;stroke:var(--paper);stroke-width:.9}
.hg .hg-ring .r-draw{fill:none;stroke:var(--blue);stroke-width:3.2;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s var(--ease)}
.hg .hg-ring .r-arr{position:relative;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6}
@media (hover:hover) and (pointer:fine){.hg a:hover>.hg-ring .r-draw,.hg button:hover>.hg-ring .r-draw,.hg .hg-ringlink:hover .r-draw{stroke-dashoffset:0}}
.hg .hg-ringlink{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-weight:500;font-size:15px}
.hg .hg-dark .hg-ring .r-bore{stroke:var(--navy)}

/* ---------- buttons ---------- */
.hg .hg-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:52px;padding:0 18px 0 22px;background:var(--ink);color:#fff;font-weight:500;font-size:15px;letter-spacing:.04em;text-transform:uppercase;border:1px solid var(--ink);transition:background-color .3s,color .3s}
.hg .hg-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.hg .hg-btn:hover svg{transform:translate(2px,-2px)}}
.hg .hg-btn:hover{background:var(--navy);border-color:var(--navy)}
.hg .hg-btn--line{background:transparent;color:var(--ink)}
.hg .hg-btn--line:hover{background:var(--ink);color:#fff}
.hg .hg-btn--green{background:var(--blue);border-color:var(--blue);color:#fff}
.hg .hg-btn--green:hover{background:var(--navy);border-color:var(--navy)}
.hg .hg-btn[disabled]{opacity:.4;cursor:not-allowed}
.hg .hg-link{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;min-height:44px;display:inline-flex;align-items:center}
.hg .hg-link:hover{text-decoration-thickness:2px}

/* ---------- chrome: the house mobile standard (constant glass bar + sticky awning), at every width ---------- */
.hg .hg-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:140;background:var(--paper);pointer-events:none}
.hg .hg-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:calc(var(--bar) + env(safe-area-inset-top,0px));padding-top:env(safe-area-inset-top,0px);background-color:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.hg .hg-bar__in{height:100%;display:flex;align-items:center;gap:24px;padding:0 var(--gut)}
.hg .hg-bar__logo{display:inline-flex;align-items:center;min-height:44px;margin-right:auto;overflow:hidden;padding-block:6px;visibility:hidden;transition:visibility 0s .5s}
.hg .hg-bar__logo svg{height:28px;width:auto;transform:translate3d(0,120%,0);opacity:0;transition:transform .5s var(--ease),opacity .3s var(--ease)}
.hg .hg-bar__logo.is-in{visibility:visible;transition:visibility 0s}
.hg .hg-bar__logo.is-in svg{transform:none;opacity:1;transition:transform .7s var(--ease),opacity .45s var(--ease)}
.hg .hg-nav{display:flex;gap:4px}
.hg .hg-nav a{position:relative;display:inline-flex;align-items:center;min-height:44px;padding:0 12px;font-size:15px;font-weight:500}
.hg .hg-nav a::after{content:"";position:absolute;left:12px;right:12px;bottom:10px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.hg .hg-nav a[aria-current="true"]::after{transform:scaleX(1);transform-origin:left}
@media (hover:hover) and (pointer:fine){.hg .hg-nav a:hover::after{transform:scaleX(1);transform-origin:left}}
.hg .hg-nav a[aria-current="true"]::before{content:"";position:absolute;left:3px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:var(--blue)}
.hg .hg-listbtn{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 6px 0 14px;border:1px solid var(--ink);font-size:15px;font-weight:500}
.hg .hg-listbtn:hover{background:var(--ink);color:#fff}
.hg .hg-count{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 8px;border-radius:999px;background:var(--blue);color:#fff;font-size:13px;font-weight:600;overflow:hidden}
.hg .hg-count span{display:block;animation:hg-roll .5s var(--ease)}
@keyframes hg-roll{from{transform:translateY(110%)}to{transform:none}}
.hg .hg-lang{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;font-size:14px;font-weight:500;letter-spacing:.06em}
.hg .hg-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center}
.hg .hg-burger i{display:block;width:22px;height:1.5px;background:var(--ink);position:relative}
.hg .hg-burger i::before,.hg .hg-burger i::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:var(--ink)}
.hg .hg-burger i::before{top:-7px}.hg .hg-burger i::after{top:7px}
.hg .hg-burger i,.hg .hg-burger i::before,.hg .hg-burger i::after{transition:transform .24s var(--ease),background-color .2s}
.hg .hg-burger[aria-expanded="true"] i{background:transparent}
.hg .hg-burger[aria-expanded="true"] i::before{transform:translateY(7px) rotate(45deg)}
.hg .hg-burger[aria-expanded="true"] i::after{transform:translateY(-7px) rotate(-45deg)}
.hg .hg-menu__ext{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;vertical-align:-1px}
@media (max-width:900px){.hg .hg-nav,.hg .hg-bar .hg-lang{display:none}.hg .hg-burger{display:inline-flex}.hg .hg-bar__in{gap:10px}.hg .hg-listbtn__t{display:none}.hg .hg-listbtn{padding:0 8px;border:0}}
.hg .hg-menu{position:fixed;inset:var(--bar) 0 0 0;z-index:149;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:24px var(--gut) calc(24px + env(safe-area-inset-bottom));overflow:auto;overscroll-behavior:contain;opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.hg .hg-menu.is-open{opacity:1;visibility:visible;transition:opacity .35s}
.hg .hg-menu a{display:flex;align-items:baseline;gap:16px;min-height:56px;border-bottom:1px solid var(--rule);font-family:var(--d);font-stretch:125%;font-weight:620;font-size:clamp(28px,8vw,40px)}
.hg .hg-menu a small{font-family:var(--t);font-size:14px;font-weight:500;color:var(--muted);min-width:24px}

/* ---------- loader: the logo's contours draw on over petrol, then the Live-up shutter ---------- */
.hg .hg-load{position:fixed;inset:0;z-index:400;pointer-events:none}
.hg .hg-load__field{position:absolute;inset:0;background:var(--navy);transition:transform 1.2s var(--io)}
.hg .hg-load__mark{position:absolute;left:50%;top:50%;width:min(46vw,300px);transform:translate(-50%,-50%);transition:opacity .5s}
.hg .hg-load__mark svg{width:100%;height:auto;overflow:visible}
.hg .hg-logo__path{fill:#fff!important;fill-opacity:0;stroke:#fff;stroke-width:1.4px;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:hg-draw 1.1s var(--ease) .1s forwards,hg-fill .5s ease 1s forwards}
@keyframes hg-draw{to{stroke-dashoffset:0}}
@keyframes hg-fill{to{fill-opacity:1}}
.hg .hg-load.is-leaving .hg-load__field{transform:translate3d(0,-100%,0)}
.hg .hg-load.is-leaving .hg-load__mark{opacity:0}

/* ---------- hero ---------- */
.hg .hg-hero{position:relative;padding-top:calc(var(--bar) + 20px);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-inline:var(--gut)}
.hg .hg-hero__text{grid-column:1/8;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,3vw,48px) 0 clamp(32px,4vw,56px)}
.hg .hg-hero__mark{margin-bottom:auto;padding-bottom:40px}
.hg .hg-hero__mark svg{display:block;width:clamp(150px,27vw,470px);height:auto}
.hg .hg-hero__kicker{display:flex;align-items:center;gap:10px;margin-bottom:clamp(20px,3vw,40px)}
.hg .hg-hero__kicker::before{content:"";width:13px;height:13px;border:2.5px solid var(--blue);box-shadow:inset 0 0 0 1px var(--paper),inset 0 0 0 6px var(--blue)}
.hg .hg-hero h1{font-size:clamp(40px,6.3vw,116px);max-width:11.5ch}
.hg .hg-hero__sub{margin-top:clamp(20px,2.4vw,32px)}
.hg .hg-hero__cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:clamp(28px,3vw,44px)}
.hg .hg-hero__fig{grid-column:8/13;position:relative}
.hg .hg-hero__frame{position:relative;overflow:hidden;height:calc(100svh - var(--bar) - 64px);min-height:540px;max-height:940px;background:var(--card)}
.hg .hg-hero__frame img{width:100%;height:100%;object-fit:cover;will-change:transform}
.hg .hg-hero__ring{position:absolute;inset:0;pointer-events:none}
.hg .hg-hero__ring i{position:absolute;inset:3% 3.5%;border:5px solid var(--blue);clip-path:inset(0 100% 100% 0);transition:clip-path 1.6s var(--ease)}
.hg .hg-hero__ring i+i{inset:calc(3% + 9px) calc(3.5% + 9px);border:1.5px solid rgba(255,255,255,.95);transition-delay:.18s}
.hg .hg-hero__ring.is-on i{clip-path:inset(0)}
.hg .hg-cap{margin-top:12px;font-size:14px;line-height:1.45;color:var(--muted);max-width:52ch}
@media (max-width:900px){.hg .hg-hero__mark{display:none}.hg .hg-hero__text,.hg .hg-hero__fig{grid-column:1/-1}.hg .hg-hero__frame{height:auto;aspect-ratio:4/4.4;min-height:0}}

/* ---------- catalogue ---------- */
.hg .hg-cat{padding-top:var(--sec)}
.hg .hg-cat__head{padding-inline:var(--gut)}
.hg .hg-cat__lead{margin-top:clamp(20px,2vw,28px);max-width:62ch;color:var(--muted)}
.hg .hg-cat .hg-dots{margin:clamp(28px,3vw,44px) var(--gut) 0}
.hg .hg-filter{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;padding:16px var(--gut)}
.hg .hg-filter label{display:inline-flex;align-items:center;gap:10px;font-size:15px}
.hg .hg-filter label>span{font-weight:500}
.hg .hg-select{appearance:none;-webkit-appearance:none;min-height:44px;padding:0 40px 0 12px;border:1px solid rgba(17,17,17,.3);background:var(--paper) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m2.5 4.5 3.5 3.5 3.5-3.5' fill='none' stroke='%23111' stroke-width='1.4'/%3E%3C/svg%3E") no-repeat right 12px center/12px;border-radius:0;font-size:16px;max-width:100%}
.hg .hg-search{display:flex;align-items:center;flex:1 1 240px;max-width:420px;min-height:44px;border-bottom:1px solid var(--ink)}
.hg .hg-search svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6}
.hg .hg-search input{flex:1;min-width:0;min-height:44px;border:0;background:transparent;padding:0 10px;font-size:16px;outline:none}
.hg .hg-search:focus-within{outline:2px solid var(--ink);outline-offset:3px}
.hg .hg-filter__count{font-size:14px;color:var(--muted)}
.hg .hg-toggle{display:inline-flex;margin-left:auto}
.hg .hg-toggle button{min-width:44px;height:44px;padding:0 12px;font-size:13px;font-weight:600;letter-spacing:.04em;border:1px solid var(--ink);display:inline-grid;place-items:center}
.hg .hg-toggle button+button{border-left:0}
.hg .hg-toggle button[aria-pressed="true"]{background:var(--ink);color:#fff}
.hg .hg-toggle svg{width:16px;height:16px;fill:currentColor}
.hg .hg-stage{transition:opacity .2s var(--ease)}
.hg .hg-stage.is-swapping{opacity:0}

.hg .hg-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(40px,4.6vw,76px) var(--gut) 0}
.hg .hg-row__text{grid-column:1/4;display:flex;flex-direction:column;min-width:0}
.hg .hg-row__n{font-size:14px;font-weight:500;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.hg .hg-row__n::after{content:"";flex:1;max-width:48px;height:1px;background:var(--ink);opacity:.4}
.hg .hg-row__text h3{font-size:clamp(24px,2vw,34px);overflow-wrap:normal}
.hg .hg-row__desc{margin-top:14px;font-size:16px;line-height:1.5;color:var(--muted)}
.hg .hg-row__meta{margin-top:12px;font-size:13px;color:var(--muted)}
.hg .hg-row__links{margin-top:auto;padding-top:24px;display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.hg .hg-row__docs{display:flex;gap:16px;font-size:14px}
.hg .hg-row__cards{grid-column:4/13;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-width:0}
@media (max-width:900px){
  .hg .hg-row{display:block}
  .hg .hg-row__links{padding-top:12px;flex-direction:row;flex-wrap:wrap;align-items:center;gap:4px 18px}
  .hg .hg-row__cards{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:20px calc(var(--gut)*-1) 0;padding:0 var(--gut) 6px;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none}
  .hg .hg-row__cards::-webkit-scrollbar{display:none}
  .hg .hg-row__cards>*{flex:0 0 min(72vw,300px);scroll-snap-align:start}
}

/* product card: Set's own white-background photos multiplied into the card grey */
.hg .hg-card{position:relative;display:flex;flex-direction:column;background:var(--card);padding:14px;min-width:0;aspect-ratio:1/1.22;container-type:inline-size}
.hg .hg-card__leaf{font-size:12.5px;line-height:1.3;color:var(--muted);display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;padding-right:4px}
.hg .hg-card__img{flex:1;min-height:0;display:grid;place-items:center;padding:8% 6%;overflow:hidden}
.hg .hg-card__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;transition:transform .9s var(--ease)}
.hg .hg-card__img.is-tile{padding:0;margin:4px 0}
.hg .hg-card__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
.hg .hg-prod__img.is-tile{padding:0}
.hg .hg-prod__img.is-tile img{object-fit:cover;mix-blend-mode:normal}
@media (hover:hover) and (pointer:fine){.hg .hg-card:hover .hg-card__img img{transform:scale(1.045)}}
.hg .hg-card__ph{width:52%;aspect-ratio:1;color:rgba(17,17,17,.2)}
.hg .hg-card__ph svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2}
.hg .hg-card__name{font-size:15px;font-weight:500;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
.hg .hg-card__name a::after{content:"";position:absolute;inset:0}
.hg .hg-card__foot{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:6px}
.hg .hg-card__sku{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.hg .hg-add{position:relative;z-index:2;flex:none;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--ink);background:var(--paper);transition:background-color .25s,color .25s}
.hg .hg-add svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}
.hg .hg-add:hover{background:var(--ink);color:#fff}
.hg .hg-add.is-on{background:var(--blue);border-color:var(--blue);color:#fff}
.hg .hg-add.is-on svg{animation:hg-pop .35s var(--ease)}
@keyframes hg-pop{from{transform:scale(.6)}to{transform:none}}
.hg .hg-card--skel{animation:hg-pulse 1.4s ease-in-out infinite alternate}
@keyframes hg-pulse{from{opacity:1}to{opacity:.55}}

/* A–Ö list */
.hg .hg-az{padding:24px var(--gut) 0}
.hg .hg-az__jump{display:flex;flex-wrap:wrap;gap:2px;padding-bottom:16px;border-bottom:1px solid var(--rule)}
.hg .hg-az__jump a{min-width:40px;min-height:44px;display:grid;place-items:center;font-weight:500;font-size:15px}
.hg .hg-az__jump a:hover{background:var(--card)}
.hg .hg-az__group{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding-top:28px;scroll-margin-top:calc(var(--bar) + 16px)}
.hg .hg-az__letter{grid-column:1/3;font-size:clamp(40px,4vw,64px)}
.hg .hg-az__rows{grid-column:3/13}
.hg .hg-az__row{display:grid;grid-template-columns:minmax(96px,150px) minmax(0,1fr) minmax(0,.7fr) 44px;align-items:center;gap:16px;min-height:52px;border-bottom:1px solid var(--rule);font-size:15px}
.hg .hg-az__row a:hover{text-decoration:underline;text-underline-offset:3px}
.hg .hg-az__sku{color:var(--muted);font-variant-numeric:tabular-nums}
.hg .hg-az__leaf{color:var(--muted);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hg .hg-az .hg-add{width:44px;height:44px}
@media (max-width:900px){.hg .hg-az__group{display:block}.hg .hg-az__letter{margin-bottom:8px}.hg .hg-az__row{grid-template-columns:minmax(0,1fr) 44px;gap:4px 12px;padding:8px 0}.hg .hg-az__sku{grid-row:2;font-size:13px}.hg .hg-az__leaf{display:none}.hg .hg-az__row .hg-add{grid-row:1/3;grid-column:2}}
.hg .hg-empty{padding:40px var(--gut);color:var(--muted)}

/* ---------- family + product pages ---------- */
.hg .hg-page{padding-top:calc(var(--bar) + clamp(28px,4vw,56px))}
.hg .hg-crumbs{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:14px;color:var(--muted);padding:0 var(--gut) 20px}
.hg .hg-crumbs a{text-decoration:underline;text-underline-offset:3px;min-height:32px;display:inline-flex;align-items:center}
.hg .hg-crumbs span[aria-hidden]{opacity:.5}
.hg .hg-fam__head{padding:0 var(--gut)}
.hg .hg-fam__intro{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);margin-top:clamp(24px,3vw,40px);padding:0 var(--gut)}
.hg .hg-fam__intro p{grid-column:1/7}
.hg .hg-fam__intro div{grid-column:9/13;display:flex;flex-direction:column;align-items:flex-start}
@media (max-width:900px){.hg .hg-fam__intro p,.hg .hg-fam__intro div{grid-column:1/-1}.hg .hg-fam__intro div{margin-top:12px}}
.hg .hg-tabs{display:flex;gap:2px 22px;flex-wrap:wrap;padding:0 var(--gut)}
.hg .hg-tabs button{position:relative;min-height:44px;font-size:15px;color:var(--muted);text-align:left}
.hg .hg-tabs button::after{content:"";position:absolute;left:0;right:0;bottom:8px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.hg .hg-tabs button:hover,.hg .hg-tabs button[aria-pressed="true"]{color:var(--ink)}
.hg .hg-tabs button:hover::after,.hg .hg-tabs button[aria-pressed="true"]::after{transform:scaleX(1);transform-origin:left}
.hg .hg-tabs sup{font-size:11px;margin-left:3px}
.hg .hg-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:12px var(--gut) 0}
@media (max-width:1100px){.hg .hg-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.hg .hg-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hg .hg-card{padding:10px}.hg .hg-card__name{font-size:14px}}
.hg .hg-pager{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px var(--gut) 0}
.hg .hg-pager button[aria-current="page"] .hg-ring{color:var(--ink)}
.hg .hg-pager__n{display:inline-grid;place-items:center;width:44px;height:44px;font-size:15px;font-variant-numeric:tabular-nums}
.hg .hg-pager__n[aria-current="page"]{position:relative}
.hg .hg-pager__n[aria-current="page"]::before{content:"";position:absolute;inset:3px;border-radius:50%;border:1.5px dashed var(--ink)}
.hg .hg-pager button[disabled]{opacity:.3;cursor:default}

.hg .hg-prod{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.hg .hg-prod__img{grid-column:1/7;background:var(--card);aspect-ratio:1;display:grid;place-items:center;padding:10%}
.hg .hg-prod__img img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.hg .hg-prod__img .hg-card__ph{width:40%}
.hg .hg-prod__info{grid-column:8/13;display:flex;flex-direction:column;gap:20px;padding-top:4px}
.hg .hg-prod h1{font-size:clamp(30px,3vw,48px);line-height:1.08;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
.hg .hg-prod__sku{font-size:15px;color:var(--muted)}
.hg .hg-prod__sku b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.hg .hg-spec{border-top:1px solid var(--ink)}
.hg .hg-spec div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid var(--rule);font-size:15px}
.hg .hg-spec dt{color:var(--muted)}
.hg .hg-spec dd{font-variant-numeric:tabular-nums}
.hg .hg-buy{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
.hg .hg-buy .hg-btn{flex:1 1 200px}
.hg .hg-prod__links{display:flex;flex-wrap:wrap;gap:4px 20px;font-size:15px}
.hg .hg-prod__on{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:500}
.hg .hg-prod__on span{width:10px;height:10px;border-radius:50%;background:var(--blue)}
.hg .hg-prod__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.hg .hg-prod__img,.hg .hg-prod__info{grid-column:1/-1}.hg .hg-prod__info{margin-top:24px}}
.hg .hg-related{padding-top:var(--sec)}
.hg .hg-related h2{padding:0 var(--gut) 20px;font-size:clamp(24px,2.4vw,36px)}

/* qty stepper + unit */
.hg .hg-qty{display:inline-flex;align-items:stretch;border:1px solid rgba(17,17,17,.3);height:48px}
.hg .hg-qty button{width:44px;display:grid;place-items:center;font-size:20px;line-height:1}
.hg .hg-qty button:hover{background:var(--card)}
.hg .hg-qty input{width:64px;border:0;border-inline:1px solid rgba(17,17,17,.15);text-align:center;font-size:16px;font-variant-numeric:tabular-nums;background:transparent;-moz-appearance:textfield;appearance:textfield}
.hg .hg-qty input::-webkit-inner-spin-button,.hg .hg-qty input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.hg .hg-buy .hg-select,.hg .hg-line .hg-select{min-height:48px}

/* ---------- numbered accordion (image 2) ---------- */
.hg .hg-how{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:var(--sec) var(--gut) 0}
.hg .hg-how__head{grid-column:1/5;display:flex;flex-direction:column;align-items:flex-start;gap:32px}
.hg .hg-how__head .hg-d{font-size:clamp(44px,5.6vw,96px)}
.hg .hg-how__list{grid-column:6/13}
@media (max-width:900px){.hg .hg-how__head,.hg .hg-how__list{grid-column:1/-1}.hg .hg-how__list{margin-top:28px}.hg .hg-how__head .hg-btn{order:3}}
.hg .hg-acc{position:relative;border-bottom:1px solid rgba(17,17,17,.55)}
.hg .hg-acc::before,.hg .hg-acc::after{content:"";position:absolute;bottom:0;width:1px;height:7px;background:rgba(17,17,17,.55)}
.hg .hg-acc::before{left:0}.hg .hg-acc::after{right:0}
.hg .hg-acc__btn{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 44px;align-items:center;gap:12px;min-height:72px;text-align:left}
.hg .hg-acc__n{display:inline-grid;place-items:center;width:34px;height:26px;font-size:14px;font-weight:500;font-variant-numeric:tabular-nums;transition:background-color .4s}
.hg .hg-acc.is-open .hg-acc__n{background:var(--blue);color:#fff}
.hg .hg-acc__t{font-family:var(--d);font-stretch:118%;font-weight:600;font-size:clamp(16px,1.35vw,20px);text-transform:uppercase;letter-spacing:.01em;line-height:1.2}
.hg .hg-acc__pm{justify-self:end;position:relative;width:26px;height:26px;border:1px solid var(--ink)}
.hg .hg-acc__pm::before,.hg .hg-acc__pm::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:1.2px;margin:-.6px 0 0 -6px;background:var(--ink);transition:transform .4s var(--ease)}
.hg .hg-acc__pm::after{transform:rotate(90deg)}
.hg .hg-acc.is-open .hg-acc__pm::after{transform:rotate(0)}
.hg .hg-acc__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s var(--ease)}
.hg .hg-acc.is-open .hg-acc__panel{grid-template-rows:1fr}
.hg .hg-acc__panel>div{overflow:hidden;min-height:0;visibility:hidden;transition:visibility 0s .5s}
.hg .hg-acc.is-open .hg-acc__panel>div{visibility:visible;transition:visibility 0s}
.hg .hg-acc__body{padding:0 56px 26px 64px;color:var(--muted);max-width:62ch}
.hg .hg-acc__body a{color:var(--ink)}
@media (max-width:600px){.hg .hg-acc__btn{grid-template-columns:44px minmax(0,1fr) 44px}.hg .hg-acc__body{padding:0 0 22px 56px}}

/* ---------- production rail: card-flick (Whitedesert), active card petrol ---------- */
.hg .hg-rail{padding-top:var(--sec)}
.hg .hg-rail__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);align-items:end;padding:0 var(--gut)}
.hg .hg-rail__head .hg-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.hg .hg-rail__head p{grid-column:1/7;margin-top:22px}
.hg .hg-rail__arrows{grid-column:10/13;justify-self:end;display:flex;gap:8px}
@media (max-width:900px){.hg .hg-rail__head p{grid-column:1/-1}.hg .hg-rail__arrows{grid-column:1/-1;justify-self:start;margin-top:16px}}
.hg .hg-rail__track{display:flex;gap:12px;height:clamp(520px,44vw,640px);padding:36px var(--gut) 0}
.hg .hg-rc{position:relative;flex:1 1 0;min-width:0;display:flex;flex-direction:column;background:var(--card2);overflow:hidden;cursor:pointer;transition:flex-grow .75s var(--ease),background-color .4s,color .4s;text-align:left}
.hg .hg-rc.is-on{flex-grow:5;background:var(--navy);color:#fff;cursor:default}
.hg .hg-rc__top{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 0}
.hg .hg-rc__n{position:relative;display:inline-grid;place-items:center;min-width:38px;height:28px;padding:0 6px;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;transition:background-color .4s,color .4s}
.hg .hg-rc.is-on .hg-rc__n{background:var(--blue);color:#fff}
.hg .hg-rc__arr{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.hg .hg-rc__media{position:relative;flex:1;min-height:0;margin:14px 16px 0;overflow:hidden}
.hg .hg-rc__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.15)}
.hg .hg-rc__noimg{position:absolute;inset:0;display:grid;place-items:center}
.hg .hg-rc__noimg svg{width:min(60%,240px);height:auto;fill:none;stroke:currentColor;stroke-width:1.4;opacity:.55}
.hg .hg-rc__body{padding:16px;display:grid;gap:8px}
.hg .hg-rc__y{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.hg .hg-rc__t{font-family:var(--d);font-stretch:118%;font-weight:620;font-size:clamp(18px,1.5vw,24px);line-height:1.1;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hg .hg-rc.is-on .hg-rc__t{white-space:normal}
.hg .hg-rc__b{font-size:15px;line-height:1.45;max-width:46ch;opacity:0;max-height:0;transition:opacity .4s}
.hg .hg-rc.is-on .hg-rc__b{opacity:.88;max-height:none;transition:opacity .5s .3s}
.hg .hg-rc__cap{font-size:12.5px;opacity:0;line-height:1.4}
.hg .hg-rc.is-on .hg-rc__cap{opacity:.66;transition:opacity .5s .35s}
.hg .hg-rc__links{display:flex;gap:16px;visibility:hidden;opacity:0}
.hg .hg-rc.is-on .hg-rc__links{visibility:visible;opacity:1;transition:opacity .5s .35s}
.hg .hg-rc__links a{text-decoration:underline;text-underline-offset:3px;min-height:44px;display:inline-flex;align-items:center}
@media (max-width:900px),(hover:none){
  .hg .hg-rail__track{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gut);overscroll-behavior-x:contain;scrollbar-width:none;padding-bottom:6px}
  .hg .hg-rail__track::-webkit-scrollbar{display:none}
  .hg .hg-rc{flex:0 0 min(80vw,380px);scroll-snap-align:start;min-height:520px}
  .hg .hg-rc.is-on{flex-grow:0}
  .hg .hg-rc__b,.hg .hg-rc__cap{opacity:.88;max-height:none}
  .hg .hg-rc__links{visibility:visible;opacity:1}
  .hg .hg-rc__t{white-space:normal}
  .hg .hg-rc__media{flex:0 0 auto;aspect-ratio:4/3}
}

/* ---------- material list teaser ---------- */
.hg .hg-teaser{margin-top:var(--sec);background:var(--card);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:clamp(56px,6vw,104px) var(--gut)}
.hg .hg-teaser__text{grid-column:1/7;display:flex;flex-direction:column;align-items:flex-start;gap:24px}
.hg .hg-teaser__text .hg-d{font-size:clamp(44px,6.6vw,120px)}
.hg .hg-teaser__list{grid-column:8/13;align-self:end;background:var(--paper)}
.hg .hg-teaser__list li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:16px 18px;border-bottom:1px solid var(--rule);font-size:15px}
.hg .hg-teaser__list li span{color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.hg .hg-teaser__foot svg{height:22px;width:auto;color:#fff}
.hg .hg-teaser__list .hg-teaser__foot{display:flex;justify-content:space-between;align-items:center;background:var(--navy);color:#fff;border:0}
.hg .hg-teaser__note{font-size:14px;color:var(--muted)}
@media (max-width:900px){.hg .hg-teaser__text,.hg .hg-teaser__list{grid-column:1/-1}.hg .hg-teaser__list{margin-top:32px}}

/* ---------- material list page ---------- */
.hg .hg-lp{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.hg .hg-lp__head{grid-column:1/-1;margin-bottom:clamp(28px,3vw,44px)}
.hg .hg-lp__head .hg-lede{max-width:64ch;margin-top:20px}
.hg .hg-lp__main{grid-column:1/8;min-width:0}
.hg .hg-lp__side{grid-column:9/13;min-width:0}
@media (max-width:1000px){.hg .hg-lp__main,.hg .hg-lp__side{grid-column:1/-1}.hg .hg-lp__side{margin-top:48px}}
.hg .hg-lp__name{display:grid;gap:6px;margin-bottom:18px}
.hg .hg-lines{border-top:1px solid var(--ink)}
.hg .hg-line{display:grid;grid-template-columns:minmax(92px,120px) minmax(0,1fr) 154px 112px 104px 44px;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--rule)}
.hg .hg-line__sku{font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}
.hg .hg-line__name{font-size:15px;font-weight:500;min-width:0}
.hg .hg-line__name a:hover{text-decoration:underline;text-underline-offset:3px}
.hg .hg-line__price{font-size:15px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.hg .hg-line__price.is-enq{font-size:13px;color:var(--muted)}
.hg .hg-total{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;padding:16px 0;border-bottom:1px solid var(--ink);font-size:15px}
.hg .hg-total b{font-size:20px;font-weight:600}
.hg .hg-total small{grid-column:1/-1;font-size:13px;color:var(--muted)}
.hg .hg-line__rm{width:44px;height:44px;display:grid;place-items:center}
.hg .hg-line__rm svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5}
.hg .hg-line__rm:hover{background:var(--card)}
.hg .hg-lines__hd{display:grid;grid-template-columns:minmax(92px,120px) minmax(0,1fr) 154px 112px 104px 44px;gap:14px;padding:10px 0;font-size:13px;color:var(--muted);border-bottom:1px solid var(--rule)}
@media (max-width:760px){
  .hg .hg-lines__hd{display:none}
  .hg .hg-line{grid-template-columns:minmax(0,1fr) 44px;gap:8px 10px}
  .hg .hg-line__sku{grid-column:1}.hg .hg-line__name{grid-column:1;grid-row:2}
  .hg .hg-line__rm{grid-column:2;grid-row:1/3}
  .hg .hg-line .hg-qty,.hg .hg-line .hg-select{grid-row:3}
  .hg .hg-line__price{grid-column:1/-1;grid-row:4;text-align:left}
  .hg .hg-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
}
@media (min-width:761px){.hg .hg-line__ctl{display:contents}.hg .hg-lp .hg-line .hg-select{width:100%}.hg .hg-lines__hd span:nth-child(5){text-align:right}}
.hg .hg-lp__tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.hg .hg-lp__tools .hg-btn{min-height:44px;font-size:13px;gap:14px}
.hg .hg-saved{margin-top:12px;border:1px solid var(--rule)}
.hg .hg-saved li{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 14px;border-bottom:1px solid var(--rule);font-size:15px}
.hg .hg-saved li:last-child{border-bottom:0}
.hg .hg-saved li button:first-child{flex:1;text-align:left;min-height:44px}
.hg .hg-saved small{color:var(--muted);font-size:13px}
.hg .hg-fld{display:grid;gap:6px;margin-bottom:16px}
.hg .hg-fld>span{font-size:14px;font-weight:500}
.hg .hg-fld>span em{font-style:normal;color:var(--muted);font-weight:400}
.hg .hg-inp{width:100%;min-height:48px;padding:10px 12px;border:1px solid rgba(17,17,17,.3);border-radius:0;background:var(--paper);font-size:16px}
.hg textarea.hg-inp{min-height:104px;resize:vertical;line-height:1.45}
.hg .hg-inp:focus{outline:2px solid var(--ink);outline-offset:1px}
.hg .hg-fs{border:0;padding:0;margin:0 0 28px}
.hg .hg-fs legend{font-family:var(--d);font-stretch:118%;font-weight:620;text-transform:uppercase;font-size:18px;padding:0 0 14px;border-bottom:1px solid var(--ink);width:100%;margin-bottom:16px}
.hg .hg-radio{display:flex;align-items:center;gap:12px;min-height:44px;font-size:15px;cursor:pointer}
.hg .hg-radio input{width:20px;height:20px;accent-color:var(--ink)}
.hg .hg-file{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.hg .hg-file label{cursor:pointer}
.hg .hg-file small,.hg .hg-help{font-size:13px;color:var(--muted)}
.hg .hg-lp__send{display:grid;gap:12px;position:sticky;top:calc(var(--bar) + 16px)}
.hg .hg-lp__send .hg-btn{width:100%}
.hg .hg-warn{font-size:14px;color:var(--ink);background:#EEF2FD;border-left:3px solid var(--blue);padding:10px 12px}
.hg .hg-empty-list{padding:28px;background:var(--card);display:grid;gap:14px;justify-items:start}

/* ---------- drawer + modal: the video's blur backdrop, panel resolves from blur ---------- */
.hg .hg-scrim{position:fixed;inset:0;z-index:300;visibility:hidden;transition:visibility 0s .2s}
.hg .hg-scrim::before{content:"";position:absolute;inset:0 0 -140px 0;background:rgba(255,255,255,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .2s var(--ease)}
.hg .hg-scrim.is-open{visibility:visible;transition:visibility 0s}
.hg .hg-scrim.is-open::before{opacity:1;transition-duration:.25s}
.hg .hg-panel{opacity:0;filter:blur(12px);transform:translate3d(0,8px,0);transition:opacity .2s var(--ease),filter .2s var(--ease),transform .2s var(--ease)}
.hg .hg-drawer.hg-panel{filter:blur(8px);transform:translate3d(24px,0,0)}
.hg .hg-scrim.is-open .hg-panel{transition-duration:.3s}
.hg .hg-scrim.is-open .hg-panel{opacity:1;filter:none;transform:none}
.hg .hg-drawer{z-index:1;position:absolute;top:0;right:0;bottom:0;width:min(480px,100%);background:var(--paper);border-left:1px solid var(--rule);display:flex;flex-direction:column}
/* iOS 26 Safari shows page under its minimised toolbar, below a fixed bottom:0 edge: the drawer's paper runs on under it */
.hg .hg-drawer::after{content:"";position:absolute;left:-1px;right:0;top:100%;height:140px;background:var(--paper);border-left:1px solid var(--rule)}
.hg .hg-drawer__head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 8px 0 20px;min-height:var(--bar);background:var(--navy);color:#fff}
.hg .hg-drawer__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:20px}
.hg .hg-x{width:44px;height:44px;display:grid;place-items:center}
.hg .hg-x svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5}
.hg .hg-drawer__body{flex:1;overflow:auto;overscroll-behavior:contain;padding:8px 20px}
.hg .hg-drawer__foot{padding:16px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--rule);display:grid;gap:10px}
.hg .hg-drawer .hg-line{grid-template-columns:minmax(0,1fr) 44px}
.hg .hg-drawer .hg-line__sku{grid-column:1}
.hg .hg-drawer .hg-line__name{grid-column:1;grid-row:2}
.hg .hg-drawer .hg-line__rm{grid-column:2;grid-row:1/3}
.hg .hg-drawer .hg-line__ctl{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}
.hg .hg-drawer .hg-line__price{grid-column:1/-1;text-align:left}
.hg .hg-modal{z-index:1;position:absolute;left:50%;top:50%;width:min(640px,calc(100% - 24px));max-height:calc(100% - 24px);translate:-50% -50%;background:var(--paper);border:1px solid var(--rule);display:flex;flex-direction:column}
.hg .hg-modal__head{display:flex;align-items:center;justify-content:space-between;padding:4px 8px 4px 24px;border-bottom:1px solid var(--rule);min-height:64px}
.hg .hg-modal__head h2{font-family:var(--d);font-stretch:125%;font-weight:620;text-transform:uppercase;font-size:clamp(18px,2vw,24px)}
.hg .hg-modal__body{overflow:auto;overscroll-behavior:contain;padding:20px 24px;display:grid;gap:16px}
.hg .hg-modal__foot{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;padding:16px 24px;border-top:1px solid var(--rule)}
.hg .hg-sum{display:grid;gap:0;border-top:1px solid var(--ink)}
.hg .hg-sum div{display:grid;grid-template-columns:minmax(110px,.6fr) minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--rule);font-size:15px}
.hg .hg-sum dt{color:var(--muted)}
.hg .hg-sum .is-missing dd{color:var(--ink);font-weight:500}
.hg .hg-sum .is-missing dd::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--blue);margin-right:8px;vertical-align:1px}
.hg .hg-ack{display:grid;gap:14px;justify-items:start}
.hg .hg-ack__ring{width:72px;height:72px}
.hg .hg-ack__ring circle{fill:none;stroke-width:5;stroke-dasharray:1;stroke-dashoffset:1;animation:hg-draw .9s var(--ease) .15s forwards}
.hg .hg-ack__ring .a{stroke:var(--ink)}.hg .hg-ack__ring .b{stroke:var(--blue);stroke-width:2}

/* ---------- staff review ---------- */
.hg .hg-rv{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);padding:0 var(--gut)}
.hg .hg-rv__q{grid-column:1/8;min-width:0}
.hg .hg-rv__d{grid-column:8/13;min-width:0}
@media (max-width:1000px){.hg .hg-rv__q,.hg .hg-rv__d{grid-column:1/-1}.hg .hg-rv__d{margin-top:32px}}
.hg .hg-tbl{width:100%;border-collapse:collapse;font-size:15px}
.hg .hg-tbl th{text-align:left;font-size:13px;font-weight:500;color:var(--muted);padding:10px 12px 10px 0;border-bottom:1px solid var(--ink)}
.hg .hg-tbl td{padding:0 12px 0 0;border-bottom:1px solid var(--rule);vertical-align:middle}
.hg .hg-tbl td button{display:block;width:100%;min-height:56px;text-align:left}
.hg .hg-tbl tr.is-sel td{background:var(--card)}
.hg .hg-tbl tr:hover td{background:#F7F7F5}
.hg .hg-tag{display:inline-block;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 7px;border:1px solid rgba(17,17,17,.35);white-space:nowrap}
.hg .hg-tag--you{background:var(--blue);border-color:var(--blue);color:#fff}
.hg .hg-st{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.hg .hg-st::before{content:"";width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink)}
.hg .hg-st--review::before{background:linear-gradient(90deg,var(--ink) 50%,transparent 50%)}
.hg .hg-st--quoted::before{background:var(--ink)}
.hg .hg-rv__tblwrap{overflow-x:auto}
@media (max-width:640px){.hg .hg-tbl .c-from,.hg .hg-tbl .c-date{display:none}}
.hg .hg-rv__card{background:var(--card);padding:22px;display:grid;gap:16px}
.hg .hg-rv__card h2{font-size:22px}
.hg .hg-flags{display:flex;flex-wrap:wrap;gap:8px}
.hg .hg-flag{font-size:13px;padding:5px 10px;background:var(--paper);border-left:3px solid var(--blue)}
.hg .hg-rv__lines li{display:grid;grid-template-columns:minmax(80px,110px) minmax(0,1fr) auto;gap:10px;padding:8px 0;border-bottom:1px solid var(--rule);font-size:14px}
.hg .hg-rv__lines span:first-child{color:var(--muted);font-variant-numeric:tabular-nums}
.hg .hg-rv__lines span:last-child{font-variant-numeric:tabular-nums;white-space:nowrap}

/* ---------- footer ---------- */
.hg .hg-foot{margin-top:var(--sec);background:var(--navy);color:#fff;padding:clamp(56px,6vw,96px) var(--gut) 40px}
.hg .hg-foot__logo{color:#fff}
.hg .hg-foot__logo svg{height:clamp(56px,6vw,88px);width:auto}
.hg .hg-foot__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);row-gap:36px;margin-top:48px}
.hg .hg-foot__col{grid-column:span 3;display:grid;gap:6px;align-content:start;font-size:15px;line-height:1.55}
.hg .hg-foot__col h3{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--sky);margin-bottom:8px}
.hg .hg-foot__col a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.4);min-height:32px;display:inline-flex;align-items:center}
.hg .hg-foot__col a:hover{text-decoration-color:#fff}
.hg .hg-foot__small{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,.18);display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.7)}
@media (max-width:1000px){.hg .hg-foot__col{grid-column:span 6}}
@media (max-width:560px){.hg .hg-foot__col{grid-column:1/-1}}


/* ---------- nav: three items, two dropdowns (one fixed setting, grouped nav) ---------- */
.hg .hg-nav{align-items:center}
.hg .hg-nav__g{position:relative}
.hg .hg-nav__g>button{position:relative;display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;font-size:15px;font-weight:500}
.hg .hg-nav__g>button svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .24s var(--ease)}
.hg .hg-nav__g.is-open>button svg{transform:rotate(180deg)}
.hg .hg-nav__g>button[aria-current="true"]::before{content:"";position:absolute;left:3px;top:50%;width:5px;height:5px;margin-top:-2.5px;background:var(--blue)}
.hg .hg-nav a[aria-current="true"]::before{border-radius:0}
.hg .hg-drop{position:absolute;top:100%;left:0;min-width:260px;padding:8px;background:var(--paper);border:1px solid var(--rule);box-shadow:0 18px 40px -24px rgba(14,22,38,.35);display:grid;opacity:0;visibility:hidden;transform:translate3d(0,-6px,0);transition:opacity .18s var(--ease),transform .22s var(--ease),visibility 0s .22s}
.hg .hg-drop[data-cols="2"]{grid-template-columns:repeat(2,minmax(220px,1fr))}
.hg .hg-nav__g.is-open .hg-drop{opacity:1;visibility:visible;transform:none;transition:opacity .18s var(--ease),transform .22s var(--ease)}
.hg .hg-drop a{display:flex;align-items:center;min-height:44px;padding:0 12px;font-size:15px}
.hg .hg-drop a::after{display:none}
.hg .hg-drop a:hover{background:var(--card)}
.hg .hg-shoplink{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 6px;font-size:15px;font-weight:500}
.hg .hg-shoplink svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.6}
.hg .hg-shoplink:hover{color:var(--blue)}
@media (max-width:900px){.hg .hg-shoplink{display:none}}
.hg .hg-bar__logo svg{height:34px}
.hg .hg-menu__c{display:flex;flex-wrap:wrap;gap:8px 24px;margin-top:24px}
.hg .hg-menu .hg-menu__c a{font-family:var(--t);font-size:17px;font-weight:500;min-height:44px;border:0}

/* ---------- product price ---------- */
.hg .hg-card__meta{display:grid;gap:2px;min-width:0}
.hg .hg-card__price{font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.hg .hg-card__price.is-enq{font-size:13px;font-weight:500;color:var(--blue)}
.hg .hg-prod__price{display:grid;gap:4px;padding:16px 0;border-top:1px solid var(--ink)}
.hg .hg-prod__price b{font-size:clamp(26px,2.4vw,34px);font-weight:600;letter-spacing:-.01em}
.hg .hg-prod__price span{font-size:14px;color:var(--muted)}
.hg .hg-prod__short{font-size:16px;line-height:1.55;max-width:56ch}

/* ---------- brand page ---------- */
.hg .hg-brand{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);margin-top:clamp(24px,3vw,40px);padding:0 var(--gut)}
.hg .hg-brand__text{grid-column:1/6}
.hg .hg-brand__links{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin-top:18px}
.hg .hg-brand__fig{grid-column:7/13;aspect-ratio:4/3;overflow:hidden;background:var(--card)}
.hg .hg-brand__fig img{width:100%;height:100%;object-fit:cover}
@media (max-width:900px){.hg .hg-brand__text,.hg .hg-brand__fig{grid-column:1/-1}.hg .hg-brand__fig{margin-top:24px}}

/* ---------- six-plate brand selector (Vatt), squared to the HEGAS frame ---------- */
.hg .hg-brands{padding:var(--sec) var(--gut) 0}
.hg .hg-brands__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);align-items:end}
.hg .hg-brands__head .hg-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.hg .hg-brands__head p{grid-column:1/7;margin-top:22px}
.hg .hg-plates{display:flex;gap:6px;height:clamp(400px,44vw,580px);margin-top:36px}
.hg .hg-plate{position:relative;flex:1 1 0;min-width:0;transition:flex-grow .6s var(--ease)}
.hg .hg-plate[data-open="1"]{flex-grow:2.8}
.hg .hg-plate>button{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;text-align:left;color:#fff;background:var(--navy);overflow:hidden;isolation:isolate}
.hg .hg-plate__ph{position:absolute;inset:0;z-index:-1}
.hg .hg-plate__ph img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease),opacity .5s var(--ease)}
.hg .hg-plate[data-open="1"] .hg-plate__ph img{transform:scale(1.04)}
.hg .hg-plate__ph::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(6,18,52,.86) 0%,rgba(6,18,52,.25) 52%,rgba(6,18,52,.05) 75%)}
.hg .hg-plate:not([data-open="1"]) .hg-plate__ph img{opacity:.55}
.hg .hg-plate::after{content:"";position:absolute;inset:8px;border:1px solid rgba(255,255,255,.5);pointer-events:none;opacity:0;transition:opacity .5s var(--ease)}
.hg .hg-plate[data-open="1"]::after{opacity:1}
.hg .hg-plate__n{position:absolute;top:20px;left:20px;display:inline-grid;place-items:center;min-width:36px;height:26px;padding:0 6px;font-size:13px;font-weight:600;background:rgba(255,255,255,.14);transition:background-color .4s}
.hg .hg-plate[data-open="1"] .hg-plate__n{background:var(--blue)}
.hg .hg-plate__name{font-family:var(--d);font-stretch:130%;font-weight:700;text-transform:uppercase;font-size:clamp(20px,2.3vw,36px);line-height:1;letter-spacing:-.01em;white-space:nowrap}
.hg .hg-plate__line{font-size:14.5px;line-height:1.4;color:rgba(255,255,255,.86);margin-top:10px;max-width:40ch;opacity:0;transform:translate3d(0,8px,0);transition:opacity .4s var(--ease) .12s,transform .5s var(--ease) .12s}
.hg .hg-plate__go{position:absolute;right:18px;bottom:18px;width:44px;height:44px;display:grid;place-items:center;background:#fff;color:var(--ink);opacity:0;transform:scale(.7);transition:opacity .35s var(--ease) .1s,transform .5s var(--ease) .1s}
.hg .hg-plate__go svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6}
.hg .hg-plate[data-open="1"] .hg-plate__line,.hg .hg-plate[data-open="1"] .hg-plate__go{opacity:1;transform:none}
.hg .hg-plate[data-open="1"] .hg-plate__line{padding-right:56px}
@media (min-width:901px){.hg .hg-plate:not([data-open="1"]) .hg-plate__name{writing-mode:vertical-rl;transform:rotate(180deg);align-self:flex-start}}
.hg .hg-brands__more{display:flex;flex-wrap:wrap;align-items:center;gap:0 18px;margin-top:20px;font-size:15px;color:var(--muted)}
.hg .hg-brands__more .hg-link{color:var(--ink)}
@media (max-width:900px){
  .hg .hg-brands__head p{grid-column:1/-1}
  .hg .hg-plates{flex-direction:column;height:auto;gap:6px}
  .hg .hg-plate{flex:none;min-height:76px}
  .hg .hg-plate[data-open="1"]{min-height:260px}
  .hg .hg-plate>button{padding:16px 16px 16px 72px;justify-content:center}
  .hg .hg-plate[data-open="1"]>button{justify-content:flex-end;padding-left:16px}
  .hg .hg-plate__n{top:50%;left:16px;transform:translateY(-50%)}
  .hg .hg-plate[data-open="1"] .hg-plate__n{top:16px;transform:none}
  .hg .hg-plate__name{font-size:22px}
  .hg .hg-plate:not([data-open="1"]) .hg-plate__line{display:none}
}

/* ---------- machines ---------- */
.hg .hg-mach{padding:var(--sec) var(--gut) 0}
.hg .hg-mach__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut)}
.hg .hg-mach__head .hg-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.hg .hg-mach__head p{grid-column:1/7;margin-top:22px}
.hg .hg-mach__feature{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut);margin-top:clamp(36px,4vw,64px);background:var(--card)}
.hg .hg-mach__ffig{grid-column:1/8;aspect-ratio:3/2;overflow:hidden}
.hg .hg-mach__ffig img{width:100%;height:100%;object-fit:cover;will-change:transform}
.hg .hg-mach__ftext{grid-column:8/13;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:12px;padding:clamp(20px,2.4vw,40px) clamp(16px,2vw,36px) clamp(20px,2.4vw,40px) 0}
.hg .hg-mach__ftext h3{font-size:clamp(24px,2.4vw,38px)}
@media (max-width:900px){.hg .hg-mach__ffig,.hg .hg-mach__ftext{grid-column:1/-1}.hg .hg-mach__ftext{padding:20px 16px 24px}}
.hg .hg-mach__sub{font-family:var(--d);font-stretch:118%;font-weight:620;text-transform:uppercase;font-size:clamp(18px,1.6vw,24px);margin:clamp(48px,5vw,80px) 0 18px;padding-bottom:14px;border-bottom:1px solid var(--ink)}
.hg .hg-mach__new{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.hg .hg-mcard{position:relative;display:flex;flex-direction:column;gap:6px}
.hg .hg-mcard__img{aspect-ratio:1240/980;overflow:hidden;background:var(--card);margin-bottom:8px}
.hg .hg-mcard__img img{width:100%;height:100%;object-fit:cover}
.hg .hg-mcard h4,.hg .hg-ucard h4{font-size:17px;font-weight:600;line-height:1.25}
.hg .hg-mcard__b{font-size:14.5px;color:var(--muted);line-height:1.45}
.hg .hg-mcard .hg-link{margin-top:auto;font-size:15px}
@media (max-width:1100px){.hg .hg-mach__new{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.hg .hg-mach__new{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut)*-1);padding:0 var(--gut) 6px;scroll-padding-inline:var(--gut);scrollbar-width:none}.hg .hg-mach__new::-webkit-scrollbar{display:none}.hg .hg-mcard{flex:0 0 min(72vw,300px);scroll-snap-align:start}}
.hg .hg-mach__usedhead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:8px 24px;margin:clamp(48px,5vw,80px) 0 18px;padding-bottom:14px;border-bottom:1px solid var(--ink)}
.hg .hg-used{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px 12px}
.hg .hg-ucard{position:relative;display:flex;flex-direction:column;gap:4px}
.hg .hg-ucard__img{aspect-ratio:4/3;overflow:hidden;background:var(--card);margin-bottom:8px}
.hg .hg-ucard__img img{width:100%;height:100%;object-fit:cover}
.hg .hg-ucard h4{font-size:15.5px;font-weight:500}
.hg .hg-ucard__p{font-size:17px;font-weight:600}
.hg .hg-ucard .hg-link{font-size:14.5px;min-height:40px}
@media (max-width:1100px){.hg .hg-used{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:600px){.hg .hg-used{grid-template-columns:repeat(2,minmax(0,1fr))}}
.hg .hg-mach__links{margin-top:28px}

/* ---------- news ---------- */
.hg .hg-news{padding:var(--sec) var(--gut) 0}
.hg .hg-news__head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 32px}
.hg .hg-news__head .hg-d{font-size:clamp(48px,8.4vw,150px)}
.hg .hg-news__list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:36px 12px;margin-top:clamp(28px,3vw,48px)}
.hg .hg-nc{position:relative;display:flex;flex-direction:column;gap:8px}
.hg .hg-nc--lead{grid-column:span 2;grid-row:span 2}
.hg .hg-nc__img{aspect-ratio:4/3;overflow:hidden;background:var(--card);margin-bottom:6px}
.hg .hg-nc--lead .hg-nc__img{aspect-ratio:auto;flex:1;min-height:320px}
.hg .hg-nc__img img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
@media (hover:hover) and (pointer:fine){.hg .hg-nc:hover .hg-nc__img img{transform:scale(1.04)}}
.hg .hg-nc__d{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.hg .hg-nc__t{font-size:18px;font-weight:600;line-height:1.25;text-wrap:balance}
.hg .hg-nc--lead .hg-nc__t{font-size:clamp(22px,2.2vw,32px);font-family:var(--d);font-stretch:108%;letter-spacing:-.015em}
.hg .hg-nc__t a::after{content:"";position:absolute;inset:0}
.hg .hg-nc__t a:hover{text-decoration:underline;text-underline-offset:3px}
.hg .hg-nc__b{font-size:15px;color:var(--muted);line-height:1.45}
@media (max-width:1000px){.hg .hg-news__list{grid-template-columns:repeat(2,minmax(0,1fr))}.hg .hg-nc--lead{grid-column:1/-1;grid-row:auto}.hg .hg-nc--lead .hg-nc__img{aspect-ratio:16/10;min-height:0;flex:none}}
@media (max-width:560px){.hg .hg-news__list{grid-template-columns:minmax(0,1fr)}}

/* ---------- staff ---------- */
.hg .hg-staff{padding:var(--sec) var(--gut) 0}
.hg .hg-staff__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gut)}
.hg .hg-staff__head .hg-d{grid-column:1/-1;font-size:clamp(48px,8.4vw,150px)}
.hg .hg-staff__head p{grid-column:1/7;margin-top:22px}
@media (max-width:900px){.hg .hg-staff__head p,.hg .hg-mach__head p{grid-column:1/-1}}
.hg .hg-staff__group{margin-top:clamp(36px,4vw,60px)}
.hg .hg-staff__group>h3{padding-bottom:12px;border-bottom:1px solid var(--ink);margin-bottom:18px}
.hg .hg-staff__list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px 12px}
.hg .hg-person{display:flex;flex-direction:column;gap:2px}
.hg .hg-person__img{aspect-ratio:300/386;overflow:hidden;background:var(--card);margin-bottom:10px}
.hg .hg-person__img img{width:100%;height:100%;object-fit:cover}
.hg .hg-person h4{font-size:16.5px;font-weight:600;line-height:1.25}
.hg .hg-person__r{font-size:14.5px;color:var(--muted)}
.hg .hg-person__c{display:flex;flex-direction:column;align-items:flex-start;margin-top:6px;font-size:14.5px}
.hg .hg-person__c a{min-height:32px;display:inline-flex;align-items:center;gap:4px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.hg .hg-person__c a:hover{text-decoration:underline;text-underline-offset:3px;color:var(--blue)}
@media (max-width:1100px){.hg .hg-staff__list{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (max-width:760px){.hg .hg-staff__list{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ---------- contact ---------- */
.hg .hg-contact{padding:var(--sec) var(--gut) 0}
.hg .hg-contact .hg-d{font-size:clamp(44px,7vw,130px)}
.hg .hg-contact__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px var(--gut);margin-top:clamp(28px,3vw,48px);padding-top:20px;border-top:1px solid var(--ink)}
.hg .hg-contact__grid h3{margin-bottom:10px}
.hg .hg-contact__big{font-size:clamp(22px,2vw,30px);font-weight:500;line-height:1.3;margin-bottom:8px}
.hg .hg-contact__big a:hover{color:var(--blue)}
.hg .hg-contact__mail{display:grid;gap:2px;margin-bottom:16px;font-size:15px}
.hg .hg-contact__mail span{color:var(--muted)}
.hg .hg-contact__mail a{font-size:18px;font-weight:500;min-height:36px;display:inline-flex;align-items:center}
.hg .hg-contact__mail a:hover{color:var(--blue);text-decoration:underline;text-underline-offset:3px}
.hg .hg-hours div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--rule);font-size:15px;max-width:360px}
.hg .hg-hours dt{color:var(--muted)}
@media (max-width:900px){.hg .hg-contact__grid{grid-template-columns:minmax(0,1fr)}}
.hg .hg-foot__legal{display:flex;flex-wrap:wrap;gap:4px 18px}
.hg .hg-foot__legal a{color:#fff;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.4);min-height:32px;display:inline-flex;align-items:center}
.hg .hg-hero__frame img{object-position:50% 50%}

/* reduced motion: nothing moves on its own; the engine is never started */
@media (prefers-reduced-motion:reduce){
  .hg .hg-bar__logo svg{transform:none!important}
  .hg *,.hg *::before,.hg *::after{transition-duration:.2s!important;animation-duration:.01ms!important;animation-delay:0s!important}
  .hg .hg-logo__path{stroke-dashoffset:0;fill-opacity:1}
  .hg .hg-panel{filter:none!important;transform:none!important}
  .hg .hg-rc{transition:background-color .2s,color .2s}
  .hg .hg-plate{transition:none}
}
`
