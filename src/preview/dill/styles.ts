/* Scoped stylesheet for /preview/dill.
   Ported value for value from the restaurantzimmerl.at clean-room rebuild
   (sndr-teardowns PR #2, css/site.css: tokens M2-M4, hero M5, sections M6-M11, cursor M14),
   re-tinted to Dill: leaf-green ground, rowan amber for every warm element, the logo green
   on the buttons, the oxblood of the dining-room wall in the second glow.
   Everything hangs off .dl-root; every keyframe is prefixed dl-. */

export function dillCss(B: string): string {
  const f = (name: string) => `${B}fonts/dill/${name}.woff2`
  return `
@font-face{font-family:"Dill Sprat";src:url(${f('Sprat-Light')}) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Sprat";src:url(${f('Sprat-Medium')}) format("woff2");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Sprat Cond";src:url(${f('Sprat-CondensedLight')}) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Jost";src:url(${f('Jost-300')}) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Jost";src:url(${f('Jost-400')}) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Gambetta";src:url(${f('Gambetta-Regular')}) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Dill Gambetta";src:url(${f('Gambetta-Italic')}) format("woff2");font-weight:400;font-style:italic;font-display:swap}

/* Safari samples html/body for the status and home-indicator strips: paint the page colour there (this style exists only while the route is mounted) */
html,body{background-color:#141c12}
html{color-scheme:dark}

/* one empty body line: the real line box at body size, resolved once and inherited as a length (reference G10) */
@property --dl-line{syntax:"<length>";inherits:true;initial-value:20px}

.dl-root{
  --c-bg:#141c12;--c-card:#1b2818;--c-amber:#d19a55;--c-button:#34501b;--c-button-hover:#3d5f20;--c-label:#efcd90;
  --c-glow-green:#496b35;--c-glow-wall:#6b3226;--c-text:#fff;
  --fs-body:18px;--fs-small:14px;--fs-smallest:12px;--fs-h1:46px;--fs-h2:20px;--fs-big:260px;
  --teaser:800px;--space:120px;--space-half:60px;
  --ease-out:cubic-bezier(.23,1,.32,1);--t-ui:250ms;
  --shell:auto;--bleed-c:1460px;--bleed-pad:135px;--courses-indent:135px;--menu-indent:240px;--reel-gutter:15px;
  --figure-h:200px;--tables-top:-100px;--tables-indent:135px;--stack-step:60px;--stack-gap:120px;--track-x:-67.5px;
  --portrait-shift:11px;--text-pad:120px;--card-pad:140px 100px 100px 100px;
  --f-display:"Dill Sprat","Times New Roman",serif;--f-num:"Dill Sprat Cond","Dill Sprat",serif;
  --f-label:"Dill Jost","Helvetica Neue",Arial,sans-serif;--f-body:"Dill Gambetta",Georgia,serif;
  --dl-line:1lh;
  position:relative;isolation:isolate;background:var(--c-bg);color:var(--c-text);font:normal var(--fs-body) var(--f-body);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent;
  min-height:100svh;text-size-adjust:100%;-webkit-text-size-adjust:100%;
}
@media (max-width:1500px){.dl-root{--teaser:800px;--space:100px;--fs-h1:42px;--fs-big:200px;--fs-h2:18px;--bleed-c:1170px;--bleed-pad:95px;--courses-indent:95px;--menu-indent:160px;--reel-gutter:10px;--figure-h:150px;--tables-top:-75px;--tables-indent:95px;--track-x:-47.5px;--portrait-shift:-20px;--text-pad:100px}}
@media (max-width:1200px){.dl-root{--teaser:700px;--space:90px;--fs-h1:36px;--fs-big:160px;--fs-h2:18px;--bleed-c:970px;--figure-h:125px;--tables-top:-62.5px;--stack-step:30px;--stack-gap:60px;--track-x:-45px;--portrait-shift:0px;--text-pad:80px;--card-pad:120px 80px 80px 80px}}
@media (max-width:991px){.dl-root{--teaser:600px;--space:80px;--fs-h1:33px;--fs-big:100px;--fs-h2:17px;--bleed-c:750px;--bleed-pad:75px;--menu-indent:140px;--figure-h:75px;--tables-top:-37.5px;--tables-indent:75px;--track-x:-37.5px;--text-pad:60px;--card-pad:100px 60px 60px 60px}}
@media (max-width:767px){.dl-root{--teaser:500px;--space:60px;--space-half:30px;--fs-h1:27px;--fs-h2:16px;--fs-body:16px;--courses-indent:0px;--reel-gutter:5px;--figure-h:75px;--tables-indent:8.33333333%;--stack-step:15px;--stack-gap:30px;--card-pad:60px 30px 30px 30px}}
@media (min-width:768px){.dl-root{--shell:750px}}
@media (min-width:992px){.dl-root{--shell:970px}}
@media (min-width:1200px){.dl-root{--shell:1170px}}
@media (min-width:1500px){.dl-root{--shell:1460px}}

:where(.dl-root) *,:where(.dl-root) *::before,:where(.dl-root) *::after{box-sizing:border-box}
:where(.dl-root) img{border:0;vertical-align:middle}
:where(.dl-root) :is(h1,h2,p,ul,address,figure,dl,dd){margin:0}
:where(.dl-root) ul{padding:0;list-style:none}
:where(.dl-root) address{font-style:normal}
:where(.dl-root) strong{font-weight:400}
:where(.dl-root) th,:where(.dl-root) td{padding:0}
:where(.dl-root) button{font:inherit;color:inherit;margin:0;padding:0;border:0;background:none;cursor:pointer}
:where(.dl-root) :is(a,button){touch-action:manipulation}
:where(.dl-root) a{color:var(--c-amber);text-decoration:none;background-color:transparent}
.dl-root :focus-visible{outline:2px solid var(--c-amber);outline-offset:4px}
.dl-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.dl-site{overflow:hidden}
.dl-site__end{display:block;height:var(--space)}
@media (hover:hover) and (pointer:fine){.dl-root.dl-cursor-on,.dl-root.dl-cursor-on a,.dl-root.dl-cursor-on button{cursor:none}}


/* traced logo marks: the SVG is a CSS mask, so it takes the element's colour; width follows height by the mark's own ratio */
.dl-mark{display:block;flex:none;height:var(--mh,44px);width:calc(var(--mh,44px)*var(--mr,1));background-color:currentColor;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}

/* type roles */
.dl-display{font:300 var(--fs-h1)/1.12 var(--f-display);color:var(--c-amber);text-transform:uppercase;margin:0;text-wrap:balance}
.dl-motion .dl-display{opacity:0}
.dl-lead{font:300 calc(var(--fs-h2)*.92)/1.45 var(--f-label);color:var(--c-amber);margin:0;text-transform:uppercase;letter-spacing:.07em;text-wrap:balance}
.dl-lead strong{font-weight:400}
.dl-copy{margin:0;color:rgba(255,255,255,.64)}
.dl-copy--small{font-size:85%}
.dl-center{text-align:center}
.dl-nowrap{white-space:pre-wrap}
.dl-gap-1{margin-top:var(--dl-line)}
.dl-gap-2{margin-top:calc(2*var(--dl-line))}
.dl-line-gap{height:var(--dl-line)}
.dl-line-gap--2{height:calc(2*var(--dl-line))}

/* button */
.dl-root .dl-button{display:inline-flex;align-items:center;gap:5px;padding:12px 15px;min-height:44px;margin:0;font:300 var(--fs-smallest)/1.42857143 var(--f-label);
  letter-spacing:1px;text-transform:uppercase;text-align:center;white-space:nowrap;touch-action:manipulation;user-select:none;
  background:var(--c-button);color:var(--c-label);border:0;border-radius:4px;text-decoration:none;transition:background-color var(--t-ui) var(--ease-out),transform 160ms var(--ease-out)}
@media (hover:hover) and (pointer:fine){.dl-root .dl-button:hover{background:var(--c-button-hover);color:var(--c-label)}.dl-root .dl-footer__link:hover,.dl-root .dl-footer__mail:hover,.dl-root .dl-award:hover .dl-award__line{text-decoration:underline;text-underline-offset:4px}}
.dl-root .dl-button:active{box-shadow:inset 0 3px 5px rgba(0,0,0,.125);transform:scale(.97)}
.dl-arrow{display:inline-block;width:1.7em;height:1em;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1;stroke-linecap:butt;overflow:visible}
.dl-arrow--prev{transform:scaleX(-1)}

/* layout */
.dl-shell{width:var(--shell);margin-right:auto;margin-left:auto;padding-right:15px;padding-left:15px}
.dl-col{position:relative;min-height:1px;display:flow-root}
@media (min-width:768px){
  .dl-col--menu{width:calc((var(--shell) - 30px)*11/12);padding:0 15px}
  .dl-col--concept{width:calc(var(--shell)*9/12);margin-left:calc(var(--shell)*2/12 - 15px);padding:0 15px}
}
@media (max-width:767px){.dl-col--menu{padding:0 15px}}
@media (min-width:992px){
  .dl-col--intro{width:calc(var(--shell)*10/12);margin-left:calc(var(--shell)*1/12 - 15px);padding:0 15px}
  .dl-col--story{width:calc(var(--shell)*11/12);margin-left:calc(var(--shell)*1/12 - 15px);padding:0 15px}
  .dl-col--menu{width:calc((var(--shell) - 30px)*9/12)}
  .dl-col--concept{width:calc(var(--shell)*7/12);margin-left:calc(var(--shell)*3/12 - 15px)}
}
@media (min-width:1200px){
  .dl-col--intro{width:calc(var(--shell)*8/12);margin-left:calc(var(--shell)*2/12 - 15px)}
  .dl-col--story{width:calc(var(--shell)*9/12);margin-left:calc(var(--shell)*2/12 - 15px)}
  .dl-col--menu{width:calc((var(--shell) - 30px)*7/12)}
  .dl-col--concept{width:calc(var(--shell)*5/12);margin-left:calc(var(--shell)*3/12 - 15px)}
  .dl-col--land{width:calc(var(--shell)*8/12);margin-left:calc(var(--shell)*2/12 - 15px);padding:0 15px}
}
.dl-bleed{display:block;width:auto;margin-left:calc(50% - (var(--bleed-c)/2));padding-left:var(--bleed-pad)}
@media (max-width:767px){.dl-bleed{width:100%;padding:0 0 0 15px;margin:0}}

/* sections + glows (M4) */
.dl-block{display:block;position:relative}
.dl-block__inner{position:relative;z-index:2}
.dl-glow::after{content:"";position:absolute;z-index:-1;width:100%;height:100%;top:0;background-position:center center;background-repeat:no-repeat;pointer-events:none;filter:blur(50px);
  background-image:radial-gradient(circle closest-side,var(--glow) 0%,var(--c-bg) 100%)}
.dl-glow--wall{--glow:var(--c-glow-wall)}
.dl-glow--green{--glow:var(--c-glow-green)}
.dl-glow--right::after{right:-45%}
.dl-glow--left::after{left:-45%}
.dl-glow--up::after{top:-5%}
.dl-glow--down::after{top:auto;bottom:-5%}
@media (max-width:767px){.dl-glow--lift::after{top:-25%}}

/* hero (M5) */
.dl-hero{display:block;position:relative;z-index:1;height:min(var(--teaser),100svh);min-height:420px;background:var(--c-bg)}
.dl-hero::after{content:"";position:absolute;left:0;right:0;top:0;width:100%;height:50%;pointer-events:none;background:linear-gradient(180deg,var(--c-bg) 23%,rgba(20,28,18,0) 100%);z-index:1;opacity:.8}
.dl-hero__slides{position:absolute;inset:0;width:100%;height:100%;z-index:1;overflow:hidden}
.dl-slide{position:absolute;inset:0;opacity:0;overflow:hidden}
.dl-slide.is-in{opacity:1;transition:opacity 1000ms ease}
.dl-slide__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.dl-slide.is-kb .dl-slide__img{animation:dl-kenburns 1000ms ease-out both}
@keyframes dl-kenburns{0%{transform:scale(1.35) translate(0,-10%)}100%{transform:scale(1) translate(0,0)}}
.dl-hero__controls{position:absolute;z-index:4;left:0;right:0;margin:auto;display:block;top:50%;transform:translateY(-50%);color:var(--c-amber);pointer-events:none}
.dl-hero__controls-inner{position:relative}
.dl-hero__arrow{position:absolute;top:0;transform:translateY(-50%);cursor:pointer;color:var(--c-amber);font-size:18px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;pointer-events:auto}
.dl-hero__arrow--next{right:-8px}
.dl-hero__arrow--prev{left:-8px}
.dl-hero__pause-wrap{position:absolute;z-index:4;left:0;right:0;bottom:12px;margin:auto;pointer-events:none}
.dl-hero__pause{position:relative;display:flex;align-items:center;justify-content:center;margin-left:auto;min-width:44px;min-height:44px;color:var(--c-amber);pointer-events:auto;cursor:pointer}
.dl-hero__pause svg{width:20px;height:20px}
.dl-hero__brand{position:absolute;z-index:3;top:50%;transform:translateY(-50%);left:0;right:0;margin:auto;padding:0 30px;display:block;pointer-events:none}
.dl-hero__brand .dl-shell{filter:drop-shadow(0 0 10px var(--c-bg)) drop-shadow(0 0 26px rgba(20,28,18,.65))}
.dl-hero__brand .dl-mark{--mh:min(300px,40svh);margin:auto;max-width:70%}
@media (max-width:991px){.dl-hero__brand .dl-mark{--mh:min(220px,38svh)}}
@media (max-width:767px){.dl-hero__brand .dl-mark{--mh:min(170px,36svh)}}

/* nav (M15) */
.dl-topbar{position:absolute;z-index:5;left:0;right:0;margin:auto;padding:max(20px,env(safe-area-inset-top)) 0 20px}
.dl-topbar__inner{display:flow-root}
.dl-topbar__brand{float:left;display:block;min-height:44px}
.dl-topbar__brand .dl-mark{--mh:44px}
.dl-topbar__actions{float:right;display:flex;align-items:center;padding:0}
.dl-lang{display:inline-flex;align-items:center;vertical-align:middle}
.dl-lang__globe{display:inline-block;margin-right:6px;color:var(--c-amber);width:18px;height:18px}
.dl-lang__list{display:inline-flex;align-items:center}
.dl-root .dl-lang__link{display:inline-flex;align-items:center;justify-content:center;min-width:32px;min-height:44px;font:300 var(--fs-small) var(--f-label);color:var(--c-amber);padding:0 2.5px;letter-spacing:.04em}
.dl-root .dl-lang__link.is-current{font-weight:400}
.dl-topbar__cta{margin-left:15px}
@media (max-width:767px){.dl-topbar__brand .dl-mark{--mh:36px}.dl-topbar{padding:max(12px,env(safe-area-inset-top)) 0 12px}}
@media (max-width:380px){.dl-lang__globe{display:none}.dl-topbar__cta{margin-left:8px}}

/* S2 intro (M6) */
.dl-block--intro .dl-block__inner{padding:var(--space) 0}
.dl-col--story{margin-top:var(--space)}
.dl-awards{display:flex;justify-content:center;margin-bottom:120px}
@media (max-width:767px){.dl-awards{margin-bottom:60px}}
.dl-root .dl-award{display:inline-flex;flex-direction:column;align-items:center;gap:8px;text-align:center;max-width:300px;color:var(--c-amber);padding:6px 10px}
.dl-award__star{width:34px;height:34px;color:var(--c-amber);fill:none;stroke:currentColor;stroke-width:1;stroke-linejoin:round}
.dl-award__label{font:300 var(--fs-smallest) var(--f-label);letter-spacing:.22em;text-transform:uppercase}
.dl-award__line{font:300 26px/1.1 var(--f-display);text-transform:uppercase;letter-spacing:.04em}
.dl-award__caption{font:400 15px/1.45 var(--f-body);color:rgba(255,255,255,.64);max-width:26ch}
.dl-story{display:block;margin:0 -15px}
.dl-story__media,.dl-story__text{padding:0 15px}
.dl-story__media{padding-bottom:30px}
.dl-story__gap{display:block;min-height:1px}
@media (min-width:768px){
  .dl-story__gap{display:none}
  .dl-story{display:grid;grid-template-columns:5fr 7fr;align-items:center;width:100%;margin:0 0 0 -15px}
  .dl-story__media{padding-bottom:0}
}
@media (min-width:992px){.dl-story{grid-template-columns:5fr 1fr 7fr}.dl-story__gap{display:block}}
.dl-story__portrait{margin-left:var(--portrait-shift)}
.dl-story__portrait img{display:block;width:100%;max-width:100%;height:auto}

/* S3 courses (M7) */
.dl-block--courses .dl-block__inner{padding-bottom:var(--space)}
.dl-col--menu{padding-top:var(--space-half)}
.dl-courses{position:relative;display:block}
.dl-figure{display:block;font-size:0;line-height:1;height:var(--figure-h);pointer-events:none}
.dl-figure__num,.dl-figure__label{display:inline-block;vertical-align:baseline;color:var(--c-amber)}
.dl-figure__num{font:300 var(--fs-big)/1 var(--f-num);text-shadow:0 0 22px rgba(20,28,18,.55)}
.dl-figure__label{position:relative;isolation:isolate;font:500 var(--fs-h1)/1 var(--f-display);text-transform:uppercase;margin-left:.15em;color:#e2ac68;text-shadow:0 0 12px var(--c-bg),0 0 4px var(--c-bg)}
/* a soft shade right behind the label: it sits over whatever picture is under it */
.dl-figure__label::before{content:"";position:absolute;z-index:-1;left:-14%;right:-18%;top:-30%;bottom:-30%;pointer-events:none;background:radial-gradient(closest-side,rgba(20,28,18,.9) 0%,rgba(20,28,18,.74) 55%,rgba(20,28,18,0) 100%)}
.dl-courses .dl-figure{position:absolute;left:0;top:0;z-index:5}
/* a soft top shade so the numeral label reads on any picture that slides under it (the reference shades its hero the same way, #teaser:after) */
.dl-reel-frame--courses::before,.dl-stack::after{content:"";position:absolute;left:0;right:0;top:0;height:min(220px,42%);pointer-events:none;z-index:3;
  background:linear-gradient(180deg,rgba(20,28,18,.92) 0%,rgba(20,28,18,.72) 38%,rgba(20,28,18,.28) 72%,rgba(20,28,18,0) 100%)}
.dl-stack::after{z-index:8}
.dl-reel-frame{position:relative}
.dl-reel-frame--courses{margin-left:var(--courses-indent)}
.dl-reel-viewport{overflow:hidden}
.dl-reel-viewport--visible{overflow:visible}
.dl-reel{display:block;font-size:0;white-space:nowrap;position:relative;z-index:1;margin:0 calc(-1*var(--reel-gutter));will-change:transform;cursor:pointer}
.dl-reel__item{display:inline-block;padding:0 var(--reel-gutter)}
.dl-reel__frame img{display:block;max-width:100%;height:auto}
.dl-reel--courses .dl-reel__item{vertical-align:bottom}
.dl-reel--courses .dl-reel__item--wide{width:65%;max-width:831px}
.dl-reel--courses .dl-reel__item--tall{width:35%;max-width:434px}
@media (max-width:767px){
  .dl-reel--courses{padding-right:7.5px}
  .dl-reel--courses .dl-reel__item--wide{width:90%;max-width:400px}
  .dl-reel--courses .dl-reel__item--tall{width:53%;max-width:210px;min-width:160px}
}
.dl-menu-note{margin-left:var(--menu-indent)}
@media (max-width:767px){.dl-menu-note{margin:0 -15px}}
.dl-disc{display:block;position:absolute;width:44px;height:44px;line-height:44px;text-align:center;z-index:12;border-radius:50%;background:var(--c-amber);color:var(--c-bg);right:15px;cursor:pointer;
  opacity:0;pointer-events:none;display:flex;align-items:center;justify-content:center;font-size:18px}
.dl-disc:focus-visible{opacity:1;pointer-events:auto}
.dl-disc--corner{top:auto;bottom:15px}
.dl-disc--middle{top:50%;transform:translateY(-50%)}
@media (max-width:767px){.dl-disc{opacity:1;pointer-events:auto}}

.dl-action{display:flex;flex-wrap:wrap;gap:15px}

/* S4 tables (M8) */
.dl-block--tables{margin-top:var(--space)}
.dl-block--tables .dl-block__inner{padding-bottom:var(--space)}
@media (max-width:767px){.dl-block--tables{margin-bottom:30px}}
.dl-figure--floating{position:absolute;z-index:100;top:var(--tables-top);margin-left:var(--tables-indent);pointer-events:none}
.dl-stack{position:relative;margin-bottom:var(--stack-gap);max-height:900px}
.dl-stack::before{content:"";display:block;padding-top:55%}
.dl-stack__cards{display:block;font-size:0;white-space:nowrap;z-index:1;overflow:hidden;width:100%;cursor:pointer}
.dl-stack__card{display:block;position:absolute;top:auto;right:0;left:0;bottom:0;width:100%;height:100%;z-index:6;opacity:0;transform:translate3d(0,0,0);
  transition:transform var(--t-ui) var(--ease-out),opacity var(--t-ui) var(--ease-out)}
.dl-stack__card img{display:block;width:100%;max-width:100%;height:100%;object-fit:cover}
.dl-stack__card[data-pos="1"]{z-index:5;opacity:1}
.dl-stack__card[data-pos="2"]{z-index:4;opacity:.75;transform:translate3d(var(--stack-step),var(--stack-step),0)}
.dl-stack__card[data-pos="3"]{z-index:3;opacity:.5;transform:translate3d(calc(2*var(--stack-step)),calc(2*var(--stack-step)),0)}
.dl-stack__card[data-pos="4"]{z-index:1;opacity:0;transform:translate3d(calc(3*var(--stack-step)),calc(3*var(--stack-step)),0)}
.dl-stack__track{position:absolute;top:0;bottom:0;height:100%;width:1px;background:var(--c-amber);left:var(--track-x);display:flex;flex-direction:column;justify-content:space-between;align-items:center}
.dl-stack__dot{display:block;width:10px;height:10px;border-radius:50%;background:var(--c-amber);transition:transform var(--t-ui) var(--ease-out)}
.dl-stack__dot.is-current{transform:scale(1.5)}
@media (max-width:767px){
  .dl-stack__track{width:auto;height:1px;bottom:-50px;top:auto;left:30px;right:15px;z-index:11;flex-direction:row}
  .dl-stack__dot{width:5px;height:5px}
  .dl-stack__dot.is-current{transform:scale(2)}
}

/* S5 concept + cycle (M9) */
.dl-split{display:table;table-layout:fixed;width:100%;margin-top:var(--space)}
.dl-split__image,.dl-split__body{display:table-cell;vertical-align:middle;width:50%}
.dl-split__image{position:relative;overflow:hidden}
.dl-split__image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.dl-split__text{padding:var(--text-pad);width:700px;max-width:100%}
@media (max-width:991px){
  .dl-split{display:block;width:auto}
  .dl-split__image,.dl-split__body{display:block;width:100%}
  .dl-split__image{height:400px}
  .dl-split__text{margin:auto;width:100%}
}
@media (max-width:767px){.dl-split__text{padding:30px 15px 0 15px;width:auto}}

/* S6 land and sea (M10) */
.dl-block--land .dl-block__inner{padding-top:var(--space)}
.dl-block--land{padding-bottom:var(--space)}
.dl-reel-bleed{margin-top:var(--space)}
.dl-reel--land{width:auto}
.dl-reel--land .dl-reel__item{vertical-align:middle}
.dl-reel--land .dl-reel__item--tall{width:26%}
.dl-reel--land .dl-reel__item--wide{width:44%}
.dl-reel--land .dl-reel__item--square{width:30%}
.dl-reel--land .dl-reel__frame{background:var(--c-bg)}
@media (max-width:1200px){
  .dl-reel--land .dl-reel__item--tall{width:35%}
  .dl-reel--land .dl-reel__item--wide{width:59%}
  .dl-reel--land .dl-reel__item--square{width:41%}
}
@media (max-width:767px){
  .dl-reel--land .dl-reel__item--wide{width:70%}
  .dl-reel--land .dl-reel__item--square{width:47%}
  .dl-reel--land .dl-reel__item--tall{width:45%}
}

/* S7 welcome (M11) */
.dl-block--welcome>.dl-block__inner{padding-bottom:var(--space)}
.dl-welcome{background:var(--c-card);position:relative;padding:var(--card-pad);text-align:center}
.dl-welcome__signet-wrap{position:absolute;left:0;right:0;top:-40px;z-index:4;display:flex;justify-content:center;pointer-events:none}
.dl-welcome__disc{display:flex;align-items:center;justify-content:center;width:80px;height:80px;border-radius:50%;background:var(--c-card);border:1px solid var(--c-amber);color:var(--c-amber)}
.dl-welcome__disc .dl-mark{--mh:34px}
@media (max-width:767px){.dl-welcome__signet-wrap{top:-30px}.dl-welcome__disc{width:60px;height:60px}.dl-welcome__disc .dl-mark{--mh:26px}}
.dl-offers{margin:calc(2*var(--dl-line)) auto 0;max-width:460px;width:100%}
.dl-offers__row{display:grid;grid-template-columns:1fr auto;gap:2px 20px;align-items:baseline;text-align:left}
.dl-offers__row+.dl-offers__row{margin-top:calc(1.6*var(--dl-line))}
.dl-offers__name{font:300 var(--fs-h2)/1.3 var(--f-label);color:var(--c-amber)}
.dl-offers__price{font:300 var(--fs-h2)/1.3 var(--f-label);color:var(--c-amber);white-space:nowrap;font-variant-numeric:tabular-nums}
.dl-offers__meta{grid-column:1/-1;font-size:15px;line-height:1.5;color:rgba(255,255,255,.64)}
.dl-offers__pairs{grid-column:1/-1;display:grid;grid-template-columns:1fr auto;gap:2px 24px;font-size:15px;line-height:1.5;color:rgba(255,255,255,.64);margin-top:6px}
.dl-offers__pairs dt{margin:0}
.dl-offers__pairs dd{margin:0;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.dl-fine{max-width:460px;margin-left:auto;margin-right:auto;font-size:15px;line-height:1.55}
.dl-action--center{justify-content:center}

/* footer (M12) */
.dl-footer__row{display:block}
.dl-footer__col{padding-bottom:30px}
.dl-footer__logo{--mh:34px}
.dl-root .dl-footer__link,.dl-root .dl-footer__mail{color:#fff;text-decoration:none;background:none;display:inline-block;padding:4px 0}
@media (min-width:768px){
  .dl-footer__row{display:flex;margin:0 -15px}
  .dl-footer__col{flex:0 0 33.33333333%;padding:0 15px}
  .dl-footer__col--center{text-align:center}
  .dl-footer__col--end{text-align:right}
}

/* cursor (M14) */
.dl-cursor{pointer-events:none}
.dl-cursor__ring,.dl-cursor__dot{position:fixed;top:0;left:0;z-index:1000}
.dl-cursor circle{fill:var(--c-amber)}
.dl-cursor__ring-dot{position:absolute;left:25px;top:25px;z-index:2;opacity:1;transition:opacity var(--t-ui) var(--ease-out)}
.dl-cursor__arrow{position:absolute;left:10px;top:10px;z-index:1;opacity:0;transform:scale(.4);transition:opacity var(--t-ui) var(--ease-out),transform var(--t-ui) var(--ease-out)}
.dl-cursor__ring.is-hover .dl-cursor__ring-dot{opacity:0}
.dl-cursor__ring.is-hover .dl-cursor__arrow{opacity:1;transform:scale(1)}
.dl-cursor__ring.is-pressed .dl-cursor__arrow{transform:scale(.5)!important}
.dl-cursor__ring,.dl-cursor__dot{will-change:transform}
.dl-cursor{display:none}
/* parked at the centre until the pointer has actually moved, so it never sits on the logo at load */
@media (hover:hover) and (pointer:fine) and (min-width:768px){.dl-cursor-on .dl-cursor{display:block;opacity:0}.dl-cursor-on .dl-cursor.is-live{opacity:1}}

@media (prefers-reduced-motion:reduce){
  .dl-slide.is-in{transition:opacity 250ms ease}
  .dl-slide.is-kb .dl-slide__img{animation:none}
  .dl-stack__card{transition:opacity 250ms ease}
  .dl-stack__card[data-pos="2"],.dl-stack__card[data-pos="3"],.dl-stack__card[data-pos="4"]{transform:none}
  .dl-stack__dot,.dl-root .dl-button{transition:none}
  .dl-root .dl-button:active{transform:none}
  .dl-reel{transition:none!important}
}
`
}
