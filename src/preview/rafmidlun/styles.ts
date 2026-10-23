const B = import.meta.env.BASE_URL

export const C = {
  board: '#f7f9fc',
  paper: '#ffffff',
  ink: '#0a1f3d',
  navy: '#00305c',
  blue: '#004d91',
  blueDk: '#003b70',
  line: '#dde3ec',
  card: '#eef2f8',
  tint: '#e7eef7',
}

/* The Matvélar engine, by way of the Samhentir fork, printed in one ink: the navy of Rafmiðlun's
   logo (#004d91, measured from the PNG) carries buttons, panels, the lit station and the close; a
   deep navy carries the footer; copper, kraft and drum wood live only inside the drawing. Type is
   Martian Grotesk Standard for text and display (the closest open face to the bold grotesk of their
   logo, not wide), with Martian Mono for labels; all open licence, Icelandic checked. */
export const CSS = `
@font-face{font-family:'RmSans';src:url('${B}rafmidlun/fonts/mg-std-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'RmSans';src:url('${B}rafmidlun/fonts/mg-std-500.woff2') format('woff2');font-weight:500;font-display:block}
@font-face{font-family:'RmSans';src:url('${B}rafmidlun/fonts/mg-std-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'RmMono';src:url('${B}rafmidlun/fonts/martian-mono-400.woff2') format('woff2');font-weight:400;font-display:block}

html:has(.rm), body:has(.rm){background-color:${C.board}}

.rm{
  --board:${C.board}; --paper:${C.paper}; --ink:${C.ink}; --navy:${C.navy}; --blue:${C.blue}; --blue-dk:${C.blueDk};
  --line:${C.line}; --card:${C.card}; --tint:${C.tint};
  --ink-80:rgba(10,31,61,.84); --ink-60:rgba(10,31,61,.68); --ink-12:rgba(10,31,61,.12);
  --root:clamp(13px,1.111vw,18.7px); --gut:calc(var(--root) * 3);
  --ease:cubic-bezier(.65,0,.35,1); --out:cubic-bezier(.19,1,.22,1);
  --t-p:max(15px,1.125em); --t-s:max(14px,.9375em); --t-m:max(12px,.74em);
  font-size:var(--root); background:var(--board); color:var(--ink);
  font-family:'RmSans',system-ui,-apple-system,'Segoe UI',sans-serif; font-weight:400;
  line-height:1.25; letter-spacing:-.005em; -webkit-font-smoothing:antialiased;
  overflow-x:clip; min-height:100svh;
}
@media (max-width:991px){.rm{--root:clamp(14.5px,1.919vw,19px);--gut:calc(var(--root) * 2)}}
@media (max-width:767px){.rm{--root:clamp(14px,2.909vw,20px);--gut:calc(var(--root) * 1.25)}}
@media (max-width:479px){.rm{--root:clamp(14px,4.267vw,19px)}}

.rm *,.rm *::before,.rm *::after{box-sizing:border-box}
.rm :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd,blockquote){margin:0;padding:0}
.rm :where(ul,ol){list-style:none}
.rm :where(h1,h2,h3){font-weight:700;letter-spacing:-.02em}
.rm :where(a){color:inherit;text-decoration:none}
.rm :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.rm :where(a,button,label,summary){touch-action:manipulation}
.rm :where(img,svg,canvas){display:block;max-width:100%}
.rm ::selection{background:var(--blue);color:#fff}
.rm .mono{font-family:'RmMono',ui-monospace,monospace;font-weight:400;font-size:var(--t-m);letter-spacing:.02em;line-height:1.35;text-transform:uppercase}
.rm-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rm-skip{position:absolute;left:-9999px;top:0;z-index:100;background:var(--blue);color:#fff;padding:.8em 1.2em;font-weight:700}
.rm-skip:focus{left:1rem;top:1rem}
.rm :focus-visible{outline:2px solid var(--blue);outline-offset:3px;border-radius:2px}
.rm-closing :focus-visible,.rm-foot :focus-visible,.rm-banner :focus-visible,.rm-stack__panel :focus-visible,.rm-where :focus-visible,.rm-stagecard :focus-visible,.rm-service__card--blue :focus-visible{outline-color:#fff}
.rm-wrap{width:100%;max-width:calc(var(--root) * 90);margin:0 auto;padding-left:var(--gut);padding-right:var(--gut)}
.rm [id]{scroll-margin-top:7em}

/* lines stay hidden until split (then revealed); a timeout and reduced motion show them anyway */
.rm [data-lines]{visibility:hidden}
.rm [data-lines].is-split,.rm-lines-fallback [data-lines]{visibility:visible}
.rm-mask{padding-block:.24em;margin-block:-.24em}

/* ── text roll on hover ──────────────────────────────────────── */
.roll{display:inline-block;flex:none;overflow:hidden;height:1.25em;line-height:1.25em;vertical-align:top;white-space:nowrap}
.roll>span{display:block;text-shadow:0 1.25em currentColor;transition:transform .22s var(--out)}
@media (hover:hover){a:hover>.roll>span,button:hover>.roll>span,a:hover .roll>span,button:hover .roll>span{transform:translateY(-1.25em)}}

/* ── buttons: square, one ink ────────────────────────────────── */
.rm-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6em;min-height:max(44px,3em);padding:.45em 1.5em;border-radius:2px;
  font-size:max(15px,1.0625em);font-weight:700;letter-spacing:-.01em;line-height:1.25;border:1px solid transparent;
  transition:background-color .25s,color .25s,border-color .25s,transform .16s var(--out);white-space:nowrap}
.rm-btn:active{transform:scale(.97)}
.rm-chip:active,.rm-steptabs button:active,.rm-opt:active,.rm-steps a:active,.rm-add:active .rm-add__box{transform:scale(.98)}
.rm-chip,.rm-steptabs button,.rm-opt,.rm-steps a,.rm-add__box{transition-property:background-color,color,border-color,transform;transition-duration:.2s;transition-timing-function:var(--out)}
.rm-btn--blue{background:var(--blue);color:#fff}
.rm-btn--white{background:var(--paper);color:var(--ink);border-color:var(--line)}
.rm-btn--ink{background:var(--ink);color:#fff}
.rm-btn--onblue{background:#fff;color:var(--blue)}
.rm-btn--ghost{border-color:rgba(255,255,255,.55);color:#fff}
.rm-btn--text{min-height:max(44px,2.75em);padding-inline:.4em;color:var(--ink-60);text-decoration:underline;text-underline-offset:.25em;font-weight:500}
@media (hover:hover){
  .rm-btn--blue:hover{background:var(--navy)}
  .rm-btn--white:hover{border-color:var(--blue);color:var(--blue)}
  .rm-btn--onblue:hover{background:var(--navy);color:#fff}
  .rm-btn--ghost:hover{background:#fff;color:var(--blue)}
  .rm-btn--text:hover{color:var(--ink)}
}
.rm-arrow{width:1em;height:1em;flex:none;transition:transform .25s var(--ease)}
@media (hover:hover){a:hover>.rm-arrow,button:hover>.rm-arrow,.rm-btn:hover .rm-arrow,.rm-textlink:hover .rm-arrow{transform:translateX(.25em)}}
.rm-textlink{display:inline-flex;align-items:center;gap:.5em;min-height:max(44px,2.75em);font-weight:700;letter-spacing:-.01em;font-size:max(15px,1em);color:var(--blue)}
.rm-link{text-decoration:underline;text-underline-offset:.2em;color:inherit;cursor:pointer;min-height:44px;display:inline-flex;align-items:center}
.rm-count{display:inline-grid;place-items:center;min-width:1.6em;height:1.6em;margin-left:.6em;padding:0 .35em;border-radius:2px;background:#fff;color:var(--blue);font-size:.8em;font-weight:700}

.rm-eyebrow{color:var(--blue);margin-bottom:1.4em}
.rm-h2{font-family:'RmSans',sans-serif;font-weight:700;font-size:2.75em;line-height:1.06;letter-spacing:-.03em;max-width:16em;text-wrap:balance}
.rm-h3{font-family:'RmSans',sans-serif;font-weight:700;font-size:1.5em;line-height:1.12;letter-spacing:-.02em}
.rm-head__sub{text-wrap:pretty;margin-top:1.4em;font-size:var(--t-p);line-height:1.45;color:var(--ink-60);max-width:36em}
.rm-source{color:var(--ink-60);text-transform:none;margin-top:1.6em}

/* ── banner, floating bar, menu ──────────────────────────────── */
.rm-top{position:fixed;top:0;left:0;right:0;z-index:40;padding-top:env(safe-area-inset-top);pointer-events:none}
.rm-top>*{pointer-events:auto}
.rm-banner{position:relative;display:flex;align-items:center;justify-content:center;min-height:max(44px,2.5em);padding:.45em 3em;background:var(--blue);color:#fff;
  font-size:max(14px,.9375em);text-align:center;overflow:hidden;transition:transform .35s var(--out),opacity .2s}
.rm-banner p{font-weight:400;line-height:1.35}
.rm-banner a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;gap:.3em;min-height:44px}
.rm-banner b,.rm-banner__lead{font-weight:700}
.rm-banner__x{position:absolute;right:0;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;color:#fff}
.rm-top.is-stuck .rm-banner{transform:translateY(-100%);opacity:0;pointer-events:none}
.rm-top.is-stuck .rm-nav{transform:translateY(calc(-1 * var(--bh,0px)))}
.rm-nav{display:flex;align-items:center;gap:1.6em;width:min(56em,calc(100% - 2 * var(--gut)));margin:.9em auto 0;padding:.45em .45em .45em 1em;background:rgba(255,255,255,.94);border-radius:3px;
  box-shadow:0 0 0 1px var(--line),0 4px 8px rgba(10,31,61,.06);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:transform .35s var(--out)}
.rm-nav__brand{display:flex;align-items:center;min-height:max(44px,2.75em);flex:none}
.rm-logo{display:block;width:auto;height:max(30px,2.05em)}
.rm-nav__list{display:flex;align-items:center;gap:1.4em;margin-left:auto}
.rm-nav__list>li>a,.rm-nav__list>li>button{display:flex;align-items:center;gap:.4em;min-height:max(44px,2.75em);font-size:max(15px,1em);font-weight:500}
@media (hover:hover){.rm-nav__list>li>a:hover,.rm-nav__list>li>button:hover{color:var(--blue)}}
.rm-nav__drop{position:relative}
.rm-caret{width:.65em;height:.4em;transition:transform .25s var(--ease)}
.rm-nav__drop button[aria-expanded="true"] .rm-caret{transform:rotate(180deg)}
.rm-drop{position:absolute;left:0;top:calc(100% + 1em);width:36em;max-width:calc(100vw - 2 * var(--gut));padding:1.5em;background:#fff;border-radius:3px;box-shadow:0 0 0 1px var(--line),0 6px 8px rgba(10,31,61,.08)}
.rm-drop[hidden]{display:none!important}
.rm-drop{transform-origin:top left;transition:opacity .18s var(--out),transform .18s var(--out)}
@starting-style{.rm-drop{opacity:0;transform:translateY(-6px) scale(.98)}}
.rm-drop{width:30em;padding:.6em}
.rm-drop__list li a{display:flex;flex-flow:column;gap:.2em;padding:.8em .9em;border-radius:2px;min-height:44px;transition:background-color .2s}
.rm-drop__list strong{font-size:max(15px,1em);letter-spacing:-.01em}
.rm-drop__list span{font-size:var(--t-s);line-height:1.4;color:var(--ink-60)}
@media (hover:hover){.rm-drop__list li a:hover{background:var(--tint)}.rm-drop__list li a:hover strong{color:var(--blue)}}
.rm-nav__cta{min-height:max(44px,2.9em);padding-inline:1.1em}
.rm-burger{display:none;width:max(44px,2.9em);height:max(44px,2.9em);border-radius:2px;background:var(--tint);flex-flow:column;justify-content:center;align-items:center;gap:.28em;margin-left:auto}
.rm-burger span{display:block;width:1.15em;height:2px;background:var(--ink);transition:transform .3s var(--ease),opacity .2s}
.rm-burger[aria-expanded="true"] span:nth-child(1){transform:translateY(.42em) rotate(45deg)}
.rm-burger[aria-expanded="true"] span:nth-child(2){opacity:0}
.rm-burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-.42em) rotate(-45deg)}
.rm-menu{position:fixed;inset:0;z-index:-1;background:var(--blue);color:#fff;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding-top:calc(env(safe-area-inset-top) + 7.5em);pointer-events:auto}
.rm-menu[hidden]{display:none!important}
.rm-menu__in{padding:1em var(--gut) calc(2em + env(safe-area-inset-bottom));display:flex;flex-flow:column;gap:2em;min-height:100%}
.rm-menu__close{display:none}
.rm-menu__list{display:flex;flex-flow:column;gap:1.4em}
.rm-menu__list>li>.mono{opacity:.75;margin-bottom:.5em}
.rm-menu__list a{display:flex;align-items:center;min-height:44px;font-family:'RmSans',sans-serif;font-size:max(21px,1.7em);font-weight:700;letter-spacing:-.02em;line-height:1.15;padding:.18em 0}
.rm-menu__sub a{font-family:'RmSans',sans-serif;font-size:max(18px,1.35em);font-weight:500}
.rm-menu__sub--two{display:grid;grid-template-columns:1fr 1fr;column-gap:1em}
.rm-menu__foot{display:flex;flex-flow:column;gap:.5em;margin-top:auto;font-size:max(16px,1.05em);padding-top:1.5em;border-top:1px solid rgba(255,255,255,.3)}
.rm-menu__foot a{font-weight:700;min-height:max(44px,2.75em);display:flex;align-items:center}
/* ── the pinned line ─────────────────────────────────────────── */
.rm-stack{position:relative;padding-top:7em}
.rm-stack__intro{display:flex;flex-flow:column;align-items:flex-start}
.rm-stack__track{--unit:62svh;position:relative;height:calc(100svh + 5 * var(--unit));margin-top:2em}
.rm-stack__stage{position:sticky;top:0;display:flex;align-items:center;justify-content:center;height:100svh;padding-top:8em;padding-bottom:3em}
.rm-stack__wrap{width:100%}
.rm-stack__grid{display:grid;grid-template-columns:1fr 1fr;width:100%;height:min(43em,calc(100svh - 11.5em))}
.rm-stack__panel{position:relative;display:flex;flex-flow:column;justify-content:space-between;align-items:center;gap:2em;padding:3.4em 2em 2.4em;background:var(--blue);color:#fff;text-align:center}
.rm-plus{position:absolute;width:.75em;height:.75em;color:rgba(255,255,255,.7)}
.rm-plus svg{width:100%;height:100%}
.rm-plus--tl{top:1.25em;left:1.25em}.rm-plus--tr{top:1.25em;right:1.25em}.rm-plus--bl{bottom:1.25em;left:1.25em}.rm-plus--br{bottom:1.25em;right:1.25em}
.rm-stack__eyebrow{font-family:'RmMono',monospace;font-size:var(--t-m);text-transform:uppercase;letter-spacing:.04em;color:#d4e2f2}
.rm-stack__heads{display:grid;width:100%;max-width:30em;align-content:center;flex:1}
.rm-stack__slide{grid-area:1/1;display:flex;flex-flow:column;align-items:center;justify-content:center;gap:1.2em;visibility:hidden;opacity:0}
.rm-stack__slide:first-child{visibility:visible;opacity:1}
.rm-stack__n{color:#fff;opacity:.9}
.rm-stack__line{font-family:'RmSans',sans-serif;font-size:2.2em;line-height:1.14;letter-spacing:-.03em;font-weight:700;color:#fff;text-wrap:balance}
.rm-stack__who{display:inline-flex;align-items:center;min-height:2.2em;padding:.35em .9em;border:1px solid rgba(255,255,255,.45);border-radius:2px;font-size:var(--t-s);font-weight:700;color:#fff}
.rm-stack__dots{display:flex;gap:.375em;width:fit-content;padding:.75em;border-radius:2px;background:rgba(255,255,255,.14)}
.rm-stack__dot{position:relative;flex:none;width:5px;height:5px;background:rgba(255,255,255,.4);overflow:hidden}
.rm-stack__dot.is-active{width:2.906em}
.rm-stack__fill{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left center}
.rm-stack__view{position:relative;display:flex;justify-content:center;align-items:center;padding:3em 2em;border:1px solid var(--line);overflow:hidden;background:var(--paper)}
.rm-stack__dotgrid{position:absolute;inset:0;background-image:radial-gradient(circle,#c3cfdf 1.2px,transparent 2px);background-size:6.6em 5.8em;background-position:center}
.rm-stack__card{position:relative;width:100%;max-width:31em;aspect-ratio:481/469;max-height:100%;background:#fff;box-shadow:0 0 0 1px var(--line)}
.rm-stack__card svg{width:100%;height:100%}
.rm-steps{padding-top:2.5em;padding-bottom:1em}
.rm-steps ol{display:flex;flex-wrap:wrap;gap:.5em;list-style:none}
.rm-steps li{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:2px;font-weight:700;font-size:max(15px,1em);background:#fff}
.rm-steps li .mono{color:var(--blue)}
.rm-stack--static{padding:6em 0}
.rm-stack__list{display:grid;gap:1.2em;margin-top:2.5em}
.rm-stack__list li{display:grid;grid-template-columns:1fr 1fr;min-height:24em}
.rm-stack--static .rm-stack__panel{justify-content:center;gap:1.2em}
.rm-stack--static .rm-stack__line{font-size:1.8em}

/* ── hero: the headline above the conductors of their logo ───── */
.rm-hero{position:relative;overflow:hidden;background:var(--board);min-height:100svh;display:flex;flex-flow:column}
.rm-hero__in{position:relative;z-index:2;display:flex;flex-flow:column;align-items:flex-start;gap:1.4em;padding-top:12em;padding-bottom:2.5em}
.rm-hero__eyebrow{color:var(--blue)}
.rm-hero__title{font-family:'RmSans',sans-serif;font-weight:700;font-size:6.4em;line-height:.95;letter-spacing:-.045em;white-space:nowrap}
.rm-hero__sub{font-size:max(16px,1.3em);line-height:1.4;max-width:26em;color:var(--ink-80);text-wrap:pretty}
.rm-doors{display:flex;gap:.6em;flex-wrap:wrap;margin-top:.6em}
.rm-doors .rm-btn{min-width:12em}
.rm-hero__board{position:absolute;right:calc(var(--gut) + 2em);bottom:-1.2em;width:min(23em,30vw);margin:0;pointer-events:none}
.rm-hero__board svg{width:100%;height:auto;aspect-ratio:114/146}
.rm-hero__field{position:relative;flex:1;min-height:13em;border-top:2px solid var(--blue)}
.rm-hero__canvas{position:absolute;inset:0;width:100%;height:100%}
.rm-hero__pause{position:absolute;right:var(--gut);bottom:calc(1em + env(safe-area-inset-bottom));z-index:3;display:grid;place-items:center;width:44px;height:44px;border-radius:2px;background:#fff;color:var(--blue);box-shadow:0 0 0 1px var(--line)}
@media (hover:hover){.rm-hero__pause:hover{background:var(--blue);color:#fff}}

/* the divider: the oval of their logo, its three conductors running out to both edges */
.rm-rule{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:3.4em 0 0;color:var(--blue)}
.rm-rule__wires{height:13px;background:linear-gradient(currentColor 0 0) 0 0/100% 2px no-repeat,linear-gradient(currentColor 0 0) 0 50%/100% 2px no-repeat,linear-gradient(currentColor 0 0) 0 100%/100% 2px no-repeat}
.rm-rule__oval{width:7.5em;height:auto;display:block}
.rm-oval{color:var(--blue)}

/* ── the five fields of work ──────────────────────────────────── */
.rm-services{padding:8em 0 7em;background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.rm-services__head{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:3em}
.rm-scards{display:grid;grid-template-columns:repeat(6,1fr);gap:1.25em}
.rm-scards>div{grid-column:span 2}
.rm-scards>div:nth-child(4),.rm-scards>div:nth-child(5){grid-column:span 3}
.rm-scard{position:relative;display:flex;flex-flow:column;height:100%;background:var(--board);border-radius:2px;overflow:hidden;box-shadow:0 0 0 1px var(--line);transition:box-shadow .25s}
.rm-scard__media{display:block;border-bottom:1px solid var(--line)}
.rm-scard__media .rm-tile{aspect-ratio:16/10}
.rm-scard__body{display:flex;flex-flow:column;gap:.6em;padding:1.4em 1.4em 1.2em;flex:1}
.rm-scard__n{color:var(--blue)}
.rm-scard h3{font-size:1.5em;line-height:1.1;letter-spacing:-.025em}
.rm-scard h3 a{display:inline-flex;align-items:center;min-height:44px}
.rm-scard h3 a::after{content:'';position:absolute;inset:0}
.rm-scard__blurb{font-size:var(--t-s);line-height:1.45;color:var(--ink-80)}
.rm-scard .rm-textlink{margin-top:auto}
@media (hover:hover){.rm-scard:hover{box-shadow:0 0 0 1px var(--blue),0 4px 8px rgba(10,31,61,.06)}.rm-scard:hover h3{color:var(--blue)}}

/* ── skápasmíði: the board drops onto its plinth ─────────────── */
.rm-cabinets{position:relative;padding:8em 0 7em;overflow:hidden}
.rm-cabinets__grid{display:grid;grid-template-columns:1.1fr .9fr;gap:3em;align-items:center}
.rm-cabinets__copy{display:flex;flex-flow:column;align-items:flex-start;gap:1.4em}
.rm-cabinets__copy .rm-eyebrow{margin-bottom:0}
.rm-cabinets__title{font-size:3.6em;line-height:1;letter-spacing:-.04em;max-width:9em}
.rm-cabinets__sub{font-size:var(--t-p);line-height:1.45;color:var(--ink-60);max-width:28em}
.rm-cabinets__art{width:100%;max-width:22em;justify-self:center}
.rm-partners{display:grid;grid-template-columns:repeat(5,1fr);gap:.6em;width:100%;max-width:34em;margin:.6em 0}
.rm-partners li{display:grid;place-items:center;min-width:0;aspect-ratio:3/2;padding:.5em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.rm-partners img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}

/* ── the work order (home and every field page) ───────────────── */
.rm-order{padding:8em 0 6em;background:var(--tint)}
.rm-order--page{padding:5em 0}
.rm-order--page .rm-h2{margin-bottom:1.4em}
.rm-order__top{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:3em}
.rm-order__grid{display:grid;grid-template-columns:1fr 1.25fr;gap:1.25em}
.rm-order__card{display:flex;flex-flow:column;gap:1.1em;padding:2em 1.8em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.rm-order__card>.mono{color:var(--blue)}
.rm-order__card--blue{background:var(--blue);color:#fff;box-shadow:none}
.rm-order__card--blue>.mono{color:#d4e2f2}
.rm-order__act{display:flex;flex-wrap:wrap;gap:.6em 1.4em;align-items:center;margin-top:.6em}
.rm-phone{display:flex;flex-flow:column;gap:.35em;padding:1em 1.2em;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.3);border-radius:2px;min-height:4.8em;justify-content:center;transition:background-color .25s,color .25s,border-color .25s}
.rm-phone span{font-size:var(--t-s);opacity:.85}
.rm-phone strong{font-family:'RmSans',sans-serif;font-size:max(22px,1.9em);letter-spacing:-.03em;font-weight:700;line-height:1}
@media (hover:hover){.rm-phone:hover{background:#fff;color:var(--blue);border-color:#fff}}
.rm-phone--light{background:var(--board);border-color:var(--line);color:var(--ink)}
@media (hover:hover){.rm-phone--light:hover{background:var(--blue);color:#fff;border-color:var(--blue)}}
.rm-service__note{font-size:var(--t-s);line-height:1.45;color:var(--ink-60)}
.rm-service__act{display:flex;flex-wrap:wrap;gap:.6em 1.4em;align-items:center;margin-top:.6em}
.rm-ready{display:flex;flex-flow:column}
.rm-ready li{display:grid;grid-template-columns:2.6em 1fr;gap:.6em;padding:1em 0;border-top:1px solid var(--line);align-items:start}
.rm-ready li:first-child{border-top:0;padding-top:0}
.rm-ready .mono{color:var(--blue);padding-top:.25em}
.rm-ready strong{font-size:max(16px,1.1em);font-weight:700;letter-spacing:-.01em}
.rm-ready p{margin-top:.35em;font-size:var(--t-s);line-height:1.45;color:var(--ink-60)}

/* ── about ───────────────────────────────────────────────────── */
.rm-about{padding:8em 0}
.rm-about__grid{display:grid;grid-template-columns:1.25fr .75fr;gap:4em;align-items:start}
.rm-about__p{margin-top:1.3em;font-size:max(17px,1.3em);line-height:1.45;letter-spacing:-.01em;color:var(--ink-80);max-width:30em;text-wrap:pretty}
.rm-about__p:first-of-type{color:var(--ink);font-weight:500}
.rm-about__side{padding:2em 1.8em;border-top:2px solid var(--blue);background:#fff;box-shadow:0 0 0 1px var(--line)}
.rm-about__side p{margin-top:1em;font-size:var(--t-p);line-height:1.5;color:var(--ink-80)}

/* ── numbers ─────────────────────────────────────────────────── */
.rm-numbers{padding:6em 0 8em}
.rm-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}
.rm-stat{display:flex;flex-flow:column;gap:1em;padding:2.2em 1.4em 2em;border-right:1px solid var(--line)}
.rm-stat:last-child{border-right:0}
.rm-stat__n{font-family:'RmSans',sans-serif;font-size:3.9em;line-height:1;font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums;display:inline-block;color:var(--blue)}
.rm-stat__l{color:var(--ink-60);min-height:max(44px,2.6em)}
.rm-badges{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:1.25em;margin-top:3em;align-items:stretch}
.rm-badges>img,.rm-badges a{background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.rm-badges>img{width:100%;height:100%;max-height:13em;object-fit:contain;padding:1.2em}
.rm-badges a{display:flex;flex-flow:column;gap:.8em;padding:1.4em;transition:box-shadow .25s}
.rm-badges__eq img{height:8.5em;width:auto;align-self:flex-start}
.rm-badges__staff .mono{color:var(--blue)}
.rm-badges__big{font-size:max(19px,1.6em);line-height:1.12;font-weight:700;letter-spacing:-.025em;max-width:11em}
.rm-badges .rm-textlink{margin-top:auto}
@media (hover:hover){.rm-badges a:hover{box-shadow:0 0 0 1px var(--blue)}}

/* ── closing on their blue ───────────────────────────────────── */
.rm-closing{position:relative;display:flex;align-items:center;justify-content:center;min-height:92svh;background:var(--blue);color:#fff;overflow:hidden}
.rm-closing__bg{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.rm-closing__in{position:relative;z-index:2;display:flex;flex-flow:column;align-items:center;text-align:center;gap:1.6em;padding-top:10em;padding-bottom:9em}
.rm-closing__title{font-family:'RmSans',sans-serif;font-size:4.4em;line-height:1;letter-spacing:-.04em;max-width:11em;text-wrap:balance}
.rm-closing__sub{font-size:var(--t-p);line-height:1.45;color:rgba(255,255,255,.88);max-width:30em}
.rm-closing .rm-doors{justify-content:center}

/* ── footer ──────────────────────────────────────────────────── */
.rm-foot{background:var(--navy);color:#fff;padding:5em 0 2em}
.rm-foot__grid{display:grid;grid-template-columns:1fr 1.7fr;gap:3em;align-items:start}
.rm-foot__chip{display:inline-flex;padding:.7em .9em;background:#fff;border-radius:2px}
.rm-foot__chip .rm-logo{height:max(34px,2.4em)}
.rm-foot__hours{margin-top:1.6em;display:grid;gap:.35em;font-size:var(--t-s);line-height:1.45;color:rgba(255,255,255,.8);max-width:22em}
.rm-foot__hours div{display:flex;justify-content:space-between;gap:1em;border-bottom:1px solid rgba(255,255,255,.14);padding-bottom:.35em}
.rm-foot__hours dd{margin:0;font-weight:700;color:#fff;white-space:nowrap}
.rm-foot__cols{display:grid;grid-template-columns:repeat(3,1fr);gap:2em}
.rm-foot .mono{color:#a9c3e0;margin-bottom:1em}
.rm-foot li{font-size:max(15px,1em);line-height:1.35;padding:.24em 0;font-weight:400;overflow-wrap:anywhere}
.rm-foot a{display:inline-flex;align-items:center;min-height:1.6em}
@media (max-width:991px){.rm-foot a{min-height:44px}.rm-foot li{padding:0}}
@media (hover:hover){.rm-foot a:hover{text-decoration:underline;text-underline-offset:.2em}}
.rm-foot__legal{margin-top:4em;padding-top:1.4em;border-top:1px solid rgba(255,255,255,.22);color:#bdcde3}

/* ── tiles ───────────────────────────────────────────────────── */
.rm-tile{position:relative;margin:0;overflow:hidden;width:100%}
.rm-tile img{width:100%;height:100%;object-fit:contain}
.rm-tile--photo img{object-fit:cover}
.rm-tile--model{aspect-ratio:1/1;background:#fff}
.rm-tile--model img{object-fit:contain;padding:.6em;mix-blend-mode:multiply}
.rm-tile--art{aspect-ratio:481/469;background:#fff}
.rm-tile--art svg{width:100%;height:100%}

/* ── inner pages ─────────────────────────────────────────────── */
.rm-phead{padding:12em 0 3em}
.rm-crumbs{display:flex;gap:.2em;flex-wrap:wrap;color:var(--ink-60);margin-bottom:2em}
.rm-crumbs a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;min-height:44px}
.rm-crumbs>span{display:inline-flex;align-items:center}
.rm-crumbs>span:not(:last-child)::after{content:'/';margin:0 .7em;opacity:.6}
.rm-phead .rm-eyebrow{margin-bottom:1em}
.rm-phead__title{font-family:'RmSans',sans-serif;font-size:4.2em;line-height:1.02;letter-spacing:-.04em;max-width:12em;overflow-wrap:normal;text-wrap:balance}
.rm-phead__sub{text-wrap:pretty;margin-top:1.3em;font-size:max(16px,1.2em);line-height:1.45;color:var(--ink-80);max-width:36em}
.rm-phead__act{display:flex;flex-wrap:wrap;gap:.8em 1.4em;align-items:center;margin-top:2em}
.rm-field{padding:1em 0 5em}
.rm-field__grid{display:grid;grid-template-columns:1.1fr .9fr;gap:3.5em;align-items:start}
.rm-field__copy{display:flex;flex-flow:column;gap:1.2em}
.rm-field__p{font-size:max(17px,1.3em);line-height:1.45;letter-spacing:-.01em;color:var(--ink-80);max-width:30em;text-wrap:pretty}
.rm-field__items{border-top:2px solid var(--ink);margin-top:.6em}
.rm-field__items li{padding:.85em 0;border-bottom:1px solid var(--line);font-size:max(16px,1.1em);font-weight:500}
.rm-field__partners .mono{color:var(--blue);margin-bottom:.8em}
.rm-field__people{margin-top:1.2em}
.rm-field__people .rm-h3{margin-bottom:1em}
.rm-field__art{position:sticky;top:8em;background:#fff;box-shadow:0 0 0 1px var(--line)}
.rm-next{padding-top:1em;padding-bottom:6em}
.rm-next a{display:flex;align-items:center;gap:1em;padding:1.4em 1.4em 1.5em;border:1px solid var(--line);border-radius:2px;background:#fff;transition:background-color .25s,color .25s}
.rm-next .mono{color:var(--blue)}
.rm-next strong{font-size:1.5em;letter-spacing:-.03em;margin-right:auto}
@media (hover:hover){.rm-next a:hover{background:var(--blue);color:#fff}.rm-next a:hover .mono{color:#fff}}

/* ── people ──────────────────────────────────────────────────── */
.rm-jump{display:flex;flex-wrap:wrap;gap:.5em;margin-top:2em}
.rm-jump a{display:inline-flex;align-items:center;gap:.6em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:2px;background:#fff;font-weight:700}
.rm-jump .mono{color:var(--blue)}
@media (hover:hover){.rm-jump a:hover{border-color:var(--blue);color:var(--blue)}}
.rm-staff{padding:1em 0 7em}
.rm-staff__group{padding-top:2.4em;margin-top:2.4em;border-top:2px solid var(--ink)}
.rm-staff__group:first-child{margin-top:0}
.rm-staff__group .rm-h3{margin-bottom:1.2em}
.rm-people{display:grid;grid-template-columns:repeat(3,1fr);gap:1em}
.rm-person{display:flex;flex-flow:column;gap:.3em;padding:1.2em 1.2em 1em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.rm-person__name{font-size:max(16px,1.1em);font-weight:700;letter-spacing:-.01em}
.rm-person__role{font-size:var(--t-s);line-height:1.4;color:var(--ink-60);min-height:1.4em}
.rm-person__reach{display:flex;flex-flow:column;align-items:flex-start;margin-top:.4em;font-size:var(--t-s)}
.rm-person__reach a{display:inline-flex;align-items:center;min-height:44px;overflow-wrap:anywhere;color:var(--blue);font-weight:500}
@media (hover:hover){.rm-person__reach a:hover{text-decoration:underline;text-underline-offset:.2em}}
.rm-staff__job{display:flex;justify-content:space-between;align-items:center;gap:2em;flex-wrap:wrap;margin-top:4em;padding:2em;background:var(--tint);border-radius:2px}
.rm-staff__job p{margin-top:.5em;font-size:var(--t-p);color:var(--ink-80)}

/* ── contact and policy ──────────────────────────────────────── */
.rm-places{padding:1em 0 7em}
.rm-places__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25em}
.rm-place{display:flex;flex-flow:column;align-items:flex-start;gap:.5em;padding:1.8em;background:#fff;border-radius:2px;border-top:2px solid var(--blue);box-shadow:0 0 0 1px var(--line)}
.rm-place .mono{color:var(--blue)}
.rm-place__addr{font-size:max(17px,1.25em);font-weight:500;letter-spacing:-.01em}
.rm-place a{display:inline-flex;align-items:center;min-height:44px;overflow-wrap:anywhere}
.rm-place__tel{font-size:max(22px,1.9em);font-weight:700;letter-spacing:-.03em;line-height:1}
.rm-place__extra{font-size:var(--t-s);color:var(--ink-60)}
.rm-places__row{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25em;margin-top:1.25em}
.rm-places__job{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.rm-hours{display:grid;gap:.5em}
.rm-hours div{display:flex;justify-content:space-between;gap:1em;padding-bottom:.5em;border-bottom:1px solid var(--line);font-size:var(--t-s)}
.rm-hours dd{margin:0;font-weight:700;white-space:nowrap}
.rm-policy{padding:1em 0 7em}
.rm-policy__grid{display:grid;grid-template-columns:1.3fr .7fr;gap:3.5em;align-items:start}
.rm-policy__copy{display:flex;flex-flow:column;gap:1.1em;font-size:var(--t-p);line-height:1.55;color:var(--ink-80);max-width:38em}
.rm-policy__copy ul{list-style:none;border-top:2px solid var(--ink)}
.rm-policy__copy li{padding:.8em 0;border-bottom:1px solid var(--line)}
.rm-policy__badge img{width:100%;max-width:18em;height:auto;background:#fff;padding:1em;border-radius:2px;box-shadow:0 0 0 1px var(--line)}

.rm-req{padding:1em 0 7em}
.rm-req__grid{display:grid;grid-template-columns:1.3fr .7fr;gap:2.4em;align-items:start}
.rm-req__side{display:flex;flex-flow:column;gap:1.25em;position:sticky;top:8em}

/* ── the request form ────────────────────────────────────────── */
.rm-form{display:flex;flex-flow:column;gap:1.4em;padding:2.2em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.rm-form__step{color:var(--ink-60)}
.rm-form__h{font-family:'RmSans',sans-serif;font-size:2em;line-height:1.1}
.rm-form__to{color:var(--blue);margin-top:-.6em}
.rm-form__lead{font-size:var(--t-p);line-height:1.45;color:var(--ink-60)}
.rm-form__note{font-size:var(--t-s);line-height:1.5;color:var(--ink-60)}
.rm-form__note a,.rm-urgent a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline;text-underline-offset:.2em;font-weight:700;color:var(--blue)}
.rm-form__proto{font-size:var(--t-s);line-height:1.5;color:var(--ink-60);padding:1em 1.1em;border:1px dashed var(--line);border-radius:2px}
.rm-form__actions{display:flex;flex-wrap:wrap;gap:.8em 1em;align-items:center}
.rm-opts{display:grid;gap:.6em}
.rm-opt{position:relative;display:flex;flex-flow:column;gap:.35em;padding:1.1em 1.3em;border:1px solid var(--line);border-radius:2px;cursor:pointer;min-height:4.5em;background:var(--board);transition:border-color .2s,background-color .2s}
.rm-opt input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0}
.rm-opt:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.rm-opt__t{font-family:'RmSans',sans-serif;font-size:max(17px,1.3em);font-weight:700;letter-spacing:-.02em}
.rm-opt__s{font-size:var(--t-s);color:var(--ink-60);line-height:1.4}
.rm-opt__to{color:var(--blue);margin-top:.2em}
@media (hover:hover){.rm-opt:hover{border-color:var(--blue);background:#fff}}
.rm-opt.is-on{border-color:var(--blue)}
.rm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:1.1em}
.rm-grid2--end{align-items:end}
.rm-fld{display:flex;flex-flow:column;gap:.55em;min-width:0;border:0;padding:0;margin:0}
.rm-fld>label:not(.rm-chip):not(.rm-filebtn),.rm-lbl,.rm-fld>legend{font-size:max(15px,1em);font-weight:700;letter-spacing:-.01em;padding:0}
.rm-fld input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),.rm-fld select,.rm-fld textarea{
  width:100%;min-height:max(44px,3.1em);padding:.7em .9em;background:var(--board);color:var(--ink);border:1px solid #c3ccd9;border-radius:2px;
  font:inherit;font-size:max(16px,1em);font-weight:400;line-height:1.3;-webkit-appearance:none;appearance:none}
.rm-fld select{background-image:linear-gradient(45deg,transparent 50%,#0a1f3d 50%),linear-gradient(135deg,#0a1f3d 50%,transparent 50%);background-position:calc(100% - 1.3em) 55%,calc(100% - .95em) 55%;background-size:.4em .4em;background-repeat:no-repeat;padding-right:2.4em}
/* Keep the native date treatment explicit for the mobile gate; the deadline has its own row. */
.rm-fld input[type="date"]{-webkit-appearance:none;appearance:none}
.rm-fld textarea{resize:vertical;min-height:6em}
.rm-fld input:focus-visible,.rm-fld select:focus-visible,.rm-fld textarea:focus-visible{outline:2px solid var(--blue);outline-offset:1px;border-color:var(--blue);background:#fff}
.rm-fld input::placeholder,.rm-fld textarea::placeholder{color:#5e6b80}
.rm-fld [aria-invalid="true"]{border-color:#b3261e}
.rm-err{color:#b3261e;font-size:var(--t-s);line-height:1.35;width:100%}
.rm-errsum{padding:1em 1.2em;border:1px solid #b3261e;border-radius:2px;background:#fdf0ef;font-size:var(--t-s);scroll-margin-top:7em}
.rm-errsum strong{display:block;margin-bottom:.4em;font-size:max(15px,1em)}
.rm-errsum li{padding:.15em 0}
.rm-errsum a{display:flex;align-items:center;min-height:44px;text-decoration:underline;text-underline-offset:.2em;color:#8c1d16}
.rm-chips{flex-flow:row wrap;gap:.5em}
.rm-chips>legend{width:100%;margin-bottom:.15em}
.rm-chip{position:relative;display:inline-flex;align-items:center;min-height:max(44px,2.9em);padding:.3em 1em;border:1px solid #c3ccd9;border-radius:2px;font-weight:500;font-size:max(15px,1em);cursor:pointer;background:#fff;transition:background-color .2s,color .2s,border-color .2s}
.rm-chip input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.rm-chip:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.rm-chip.is-on{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:700}
@media (hover:hover){.rm-chip:not(.is-on):hover{border-color:var(--blue)}}
.rm-check{position:relative;display:flex;gap:.8em;align-items:center;min-height:max(44px,3em);padding:.5em 1em;border:1px solid #c3ccd9;border-radius:2px;cursor:pointer;font-weight:500;font-size:max(15px,1em);line-height:1.3;background:#fff}
.rm-check input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.rm-check::before{content:'';flex:none;width:1.3em;height:1.3em;border:1px solid #5e6b80;border-radius:2px;background:#fff}
.rm-check.is-on{border-color:var(--blue)}
.rm-check.is-on::before{background:var(--blue) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.2 6.3 5 9l4.8-5.4' fill='none' stroke='%23fff' stroke-width='1.8'/%3E%3C/svg%3E") center/80% no-repeat;border-color:var(--blue)}
.rm-check:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.rm-urgent{padding:1em 1.1em;border:1px solid var(--blue);border-radius:2px;background:var(--tint);font-size:var(--t-s);line-height:1.5}
.rm-sect{display:flex;flex-flow:column;gap:.9em;padding-top:1.2em;border-top:1px solid var(--line)}
.rm-tags{display:flex;flex-wrap:wrap;gap:.5em}
.rm-tags li{display:inline-flex;align-items:center;gap:.6em;min-height:max(44px,2.6em);padding:.2em .3em .2em .9em;border:1px solid #c3ccd9;border-radius:2px;font-size:max(15px,1em);font-weight:500;background:#fff}
.rm-tags li .mono{color:var(--ink-60);text-transform:none}
.rm-tags button{display:grid;place-items:center;width:44px;height:44px;margin-block:-.4em;font-size:1.2em;color:var(--ink-60)}
.rm-files{gap:.7em}
.rm-filebtn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:fit-content;min-height:max(44px,3em);padding:0 1.4em;border:1px solid var(--ink-60);border-radius:2px;font-weight:700;cursor:pointer;background:#fff}
.rm-filebtn input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;font-size:16px}
.rm-filebtn:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.rm-brief{width:100%;padding:1.1em 1.2em;background:var(--board);color:var(--ink);border:1px solid #c3ccd9;border-radius:2px;font-family:'RmMono',ui-monospace,monospace;font-size:max(16px,.8125em);line-height:1.6;resize:vertical}

/* ── reduced motion: nothing moves that is not needed ────────── */
@media (prefers-reduced-motion:reduce){
  .rm *,.rm *::before,.rm *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;scroll-behavior:auto!important}
  .rm [data-lines]{visibility:visible!important}
  .roll>span{transform:none!important}
}

/* the isometric drawing: roles are coloured here, nowhere else.
   Stations are white and cool grey, lit in their navy; copper is busbars and cable; kraft is cartons; the ink is navy. */
.rm-iso{width:100%;height:100%;overflow:hidden}
.rm-iso path{stroke:#0a1f3d;stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rm-iso .t{fill:#fff}.rm-iso .l{fill:#e8edf4}.rm-iso .r{fill:#c5cfdc}.rm-iso .k{fill:#0a1f3d}
.rm-iso .p{fill:#e7a06c}.rm-iso .pl{fill:#c9773f}.rm-iso .pr{fill:#a65c2b}
.rm-iso .b{fill:#e4c89e}.rm-iso .bl{fill:#cba676}.rm-iso .br{fill:#ab8554}
.rm-iso .d{fill:#c39463}.rm-iso .dl{fill:#a2744a}.rm-iso .dr{fill:#845c36}
.rm-iso .u{fill:#004d91}
.rm-iso .n{fill:none}.rm-iso .w{fill:#fff}.rm-iso .f{fill:#fff;fill-opacity:.5}
.rm-iso .rung,.rm-iso .rod,.rm-iso .ink,.rm-iso .scr,.rm-iso .cable,.rm-iso .handle,.rm-iso .vent,.rm-iso .rail,.rm-iso .tape{fill:none}
.rm-iso path.rung{stroke:#97a3b6}
.rm-iso path.ink{stroke:#004d91;stroke-width:1.2}
.rm-iso path.scr{stroke:#cfe0f3;stroke-width:1}
.rm-iso path.cable{stroke:#c9773f;stroke-width:1.9}
.rm-iso path.handle{stroke:#0a1f3d;stroke-width:1.8}
.rm-iso path.vent{stroke:#97a3b6}
.rm-iso path.rail{stroke:#6b778b;stroke-width:1.3}
.rm-iso path.tape{stroke:#f3e3c6;stroke-width:2.2}
.rm-iso .st[data-on="1"] .t{fill:#d5e2f1}.rm-iso .st[data-on="1"] .l{fill:#004d91}.rm-iso .st[data-on="1"] .r{fill:#00305c}
.rm-iso [data-form][data-on="0"]{visibility:hidden}
.rm-iso--drop .guides line{stroke:#004d91;stroke-width:1;stroke-dasharray:2 3;vector-effect:non-scaling-stroke}
.rm-iso .st .t,.rm-iso .st .l,.rm-iso .st .r{transition:fill .5s var(--ease)}
.rm-iso [data-form]{transition:opacity .35s,visibility 0s}
.rm-iso [data-form][data-on="0"]{transition:opacity .35s,visibility 0s .35s}
.rm-iso--board{overflow:visible}

/* ── tablet and phone ────────────────────────────────────────── */
@media (max-width:1180px){
  .rm-nav__list{gap:1em}
}
@media (max-width:991px){
  .rm-nav__list,.rm-nav__cta{display:none}
  .rm-burger{display:flex}
  .rm-nav{width:calc(100% - 2 * var(--gut));justify-content:space-between;padding-right:.45em}
  .rm-banner__more{display:none}
  .rm-hero__title{font-size:5em}
  .rm-hero__in{padding-top:11em}
  .rm-hero__board{width:min(17em,34vw);right:var(--gut)}
  .rm-h2{font-size:2.3em}
  .rm-stack__stage{padding-top:7.5em}
  .rm-stack__grid{grid-template-columns:1fr;grid-template-rows:auto auto;height:auto;max-height:none}
  .rm-stack__panel{padding:2.4em 1.4em 1.8em;gap:1.2em}
  .rm-stack__line{font-size:1.7em}
  .rm-stack__view{padding:1em 2em;min-height:0}
  .rm-stack__card{height:auto;width:100%;max-width:25em;aspect-ratio:481/469}
  .rm-cabinets__grid,.rm-order__grid,.rm-about__grid,.rm-field__grid,.rm-req__grid,.rm-policy__grid{grid-template-columns:1fr}
  .rm-req__side,.rm-field__art{position:static}
  .rm-field__art{max-width:28em}
  .rm-scards>div,.rm-scards>div:nth-child(4),.rm-scards>div:nth-child(5){grid-column:span 3}
  .rm-cabinets__title{font-size:2.9em}
  .rm-cabinets__art{max-width:16em}
  .rm-stat__n{font-size:3.6em}
  .rm-stats{grid-template-columns:1fr 1fr}
  .rm-stat:nth-child(2n){border-right:0}
  .rm-stat:nth-child(-n+2){border-bottom:1px solid var(--line)}
  .rm-badges{grid-template-columns:1fr 1fr}
  .rm-badges__staff{grid-column:1/-1}
  .rm-closing__title{font-size:3.2em}
  .rm-phead{padding-top:9.5em}
  .rm-phead__title{font-size:3.1em}
  .rm-people{grid-template-columns:1fr 1fr}
  .rm-places__grid,.rm-places__row{grid-template-columns:1fr 1fr}
  .rm-foot__grid{grid-template-columns:1fr}
}
@media (max-width:767px){
  .rm-hero__title{font-size:3.9em}
  .rm-hero__board{display:none}
  .rm-h2{font-size:2em}
  .rm-services,.rm-cabinets,.rm-order,.rm-about{padding-block:5em}
  .rm-scards>div,.rm-scards>div:nth-child(4),.rm-scards>div:nth-child(5){grid-column:1/-1}
  .rm-partners{grid-template-columns:repeat(3,1fr)}
  .rm-stack__track{--unit:56svh}
  .rm-stack__stage{padding-bottom:1.2em}
  .rm-form{padding:1.4em}
  .rm-grid2{grid-template-columns:1fr}
  .rm-stack__list li{grid-template-columns:1fr}
  .rm-foot__cols{grid-template-columns:1fr 1fr}
  .rm-people,.rm-places__grid,.rm-places__row,.rm-badges{grid-template-columns:1fr}
  .rm-rule__oval{width:6em}
}
@media (max-width:479px){
  .rm-hero__title{font-size:min(3.1em,13.6vw);white-space:normal}
  .rm-hero__in{padding-top:10.6em;padding-bottom:2em}
  .rm-doors{width:100%;flex-flow:column;align-items:stretch}
  .rm-doors .rm-btn{width:100%}
  .rm-btn{padding-inline:1.1em;max-width:100%}
  .rm-banner{padding-inline:1em 2.6em;font-size:max(13.5px,.875em);justify-content:flex-start;text-align:left}
  .rm-hero__eyebrow{min-height:2.7em}
  .rm-h2{font-size:1.75em}
  .rm-stack__stage{padding-top:6.4em;padding-bottom:0}
  .rm-stack__panel{padding:2em 1em 1.2em;gap:.7em}
  .rm-stack__eyebrow{display:none}
  .rm-stack__line{font-size:1.4em;line-height:1.16}
  .rm-stack--static .rm-stack__line{font-size:1.4em}
  .rm-stack__view{padding:.7em}
  /* Leave room for the copy and floating nav in short portrait viewports. */
  .rm-stack__card{max-width:calc((100svh - 22em) * 1.0256)}
  .rm-stack__slide{gap:.7em}
  .rm-cabinets__title{font-size:2.3em}
  .rm-stat__n{font-size:2.6em}
  /* Whole Icelandic labels need a full row, including when they are not split for motion. */
  .rm-stats{grid-template-columns:1fr}
  .rm-stat{padding:1.6em .9em 1.4em;border-right:0;border-bottom:1px solid var(--line)}
  .rm-stat:last-child{border-bottom:0}
  .rm-closing__title{font-size:2.3em}
  .rm-closing__in{padding-top:8em;padding-bottom:7em}
  .rm-phead__title{font-size:2.3em}
  .rm-phead__title--long{font-size:1.85em}
  .rm-next a{display:grid;grid-template-columns:minmax(0,1fr) auto}
  .rm-next strong{grid-column:1/-1;grid-row:2}
  .rm-next .rm-arrow{grid-column:2;grid-row:1}
  .rm-foot__cols{grid-template-columns:1fr}
  .rm-phone strong{font-size:max(22px,1.8em)}
  .rm-form__h{font-size:1.55em}
  .rm-place__tel{font-size:max(22px,1.7em)}
}
`
