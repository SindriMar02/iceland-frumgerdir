const B = import.meta.env.BASE_URL

export const C = {
  board: '#fafbfc',
  paper: '#ffffff',
  ink: '#191847',
  navy: '#14133b',
  blue: '#284195',
  blueDk: '#1d3070',
  line: '#dfe2ec',
  card: '#f1f3f8',
  tint: '#e9edf8',
}

/* The Matvélar engine, printed in one ink on white board. Same fluid em root (the page scales as
   one object), floating bar, line reveals, pinned line, counters and line field. The colour is
   Samhentir's own: the blue of their mark (#284195) is the only ink, their navy (#191847) carries
   text and the footer, and kraft and salmon live only inside the drawing. Type is Martian
   Grotesk, Standard for text and Wide for display (the width system Univers is known for, the
   face their brand uses), with Martian Mono for labels; all open licence, Icelandic checked. */
export const CSS = `
@font-face{font-family:'ShSans';src:url('${B}samhentir/fonts/mg-std-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'ShSans';src:url('${B}samhentir/fonts/mg-std-500.woff2') format('woff2');font-weight:500;font-display:block}
@font-face{font-family:'ShSans';src:url('${B}samhentir/fonts/mg-std-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'ShWide';src:url('${B}samhentir/fonts/mg-wd-500.woff2') format('woff2');font-weight:500;font-display:block}
@font-face{font-family:'ShWide';src:url('${B}samhentir/fonts/mg-wd-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'ShMono';src:url('${B}samhentir/fonts/martian-mono-400.woff2') format('woff2');font-weight:400;font-display:block}

html:has(.sh), body:has(.sh){background-color:${C.board}}

.sh{
  --board:${C.board}; --paper:${C.paper}; --ink:${C.ink}; --navy:${C.navy}; --blue:${C.blue}; --blue-dk:${C.blueDk};
  --line:${C.line}; --card:${C.card}; --tint:${C.tint};
  --ink-80:rgba(25,24,71,.84); --ink-60:rgba(25,24,71,.68); --ink-12:rgba(25,24,71,.12);
  --root:clamp(13px,1.111vw,18.7px); --gut:calc(var(--root) * 3);
  --ease:cubic-bezier(.65,0,.35,1); --out:cubic-bezier(.19,1,.22,1);
  --t-p:max(15px,1.125em); --t-s:max(14px,.9375em); --t-m:max(12px,.74em);
  font-size:var(--root); background:var(--board); color:var(--ink);
  font-family:'ShSans',system-ui,-apple-system,'Segoe UI',sans-serif; font-weight:400;
  line-height:1.25; letter-spacing:-.005em; -webkit-font-smoothing:antialiased;
  overflow-x:clip; min-height:100svh;
}
@media (max-width:991px){.sh{--root:clamp(14.5px,1.919vw,19px);--gut:calc(var(--root) * 2)}}
@media (max-width:767px){.sh{--root:clamp(14px,2.909vw,20px);--gut:calc(var(--root) * 1.25)}}
@media (max-width:479px){.sh{--root:clamp(14px,4.267vw,19px)}}

.sh *,.sh *::before,.sh *::after{box-sizing:border-box}
.sh :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd,blockquote){margin:0;padding:0}
.sh :where(ul,ol){list-style:none}
.sh :where(h1,h2,h3){font-weight:700;letter-spacing:-.02em}
.sh :where(a){color:inherit;text-decoration:none}
.sh :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sh :where(a,button,label,summary){touch-action:manipulation}
.sh :where(img,svg,canvas){display:block;max-width:100%}
.sh ::selection{background:var(--blue);color:#fff}
.sh .mono{font-family:'ShMono',ui-monospace,monospace;font-weight:400;font-size:var(--t-m);letter-spacing:.02em;line-height:1.35;text-transform:uppercase}
.sh-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sh-skip{position:absolute;left:-9999px;top:0;z-index:100;background:var(--blue);color:#fff;padding:.8em 1.2em;font-weight:700}
.sh-skip:focus{left:1rem;top:1rem}
.sh :focus-visible{outline:2px solid var(--blue);outline-offset:3px;border-radius:2px}
.sh-closing :focus-visible,.sh-foot :focus-visible,.sh-banner :focus-visible,.sh-stack__panel :focus-visible,.sh-where :focus-visible,.sh-stagecard :focus-visible,.sh-service__card--blue :focus-visible{outline-color:#fff}
.sh-wrap{width:100%;max-width:calc(var(--root) * 90);margin:0 auto;padding-left:var(--gut);padding-right:var(--gut)}
.sh [id]{scroll-margin-top:7em}

/* lines stay hidden until split (then revealed); a timeout and reduced motion show them anyway */
.sh [data-lines]{visibility:hidden}
.sh [data-lines].is-split,.sh-lines-fallback [data-lines]{visibility:visible}
.sh-mask{padding-block:.24em;margin-block:-.24em}

/* ── text roll on hover ──────────────────────────────────────── */
.roll{display:inline-block;flex:none;overflow:hidden;height:1.25em;line-height:1.25em;vertical-align:top;white-space:nowrap}
.roll>span{display:block;text-shadow:0 1.25em currentColor;transition:transform .22s var(--out)}
@media (hover:hover){a:hover>.roll>span,button:hover>.roll>span,a:hover .roll>span,button:hover .roll>span{transform:translateY(-1.25em)}}

/* ── buttons: square, one ink ────────────────────────────────── */
.sh-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6em;min-height:max(44px,3em);padding:.45em 1.5em;border-radius:2px;
  font-size:max(15px,1.0625em);font-weight:700;letter-spacing:-.01em;line-height:1.25;border:1px solid transparent;
  transition:background-color .25s,color .25s,border-color .25s,transform .16s var(--out);white-space:nowrap}
.sh-btn:active{transform:scale(.97)}
.sh-chip:active,.sh-steptabs button:active,.sh-opt:active,.sh-steps a:active,.sh-add:active .sh-add__box{transform:scale(.98)}
.sh-chip,.sh-steptabs button,.sh-opt,.sh-steps a,.sh-add__box{transition-property:background-color,color,border-color,transform;transition-duration:.2s;transition-timing-function:var(--out)}
.sh-btn--blue{background:var(--blue);color:#fff}
.sh-btn--white{background:var(--paper);color:var(--ink);border-color:var(--line)}
.sh-btn--ink{background:var(--ink);color:#fff}
.sh-btn--onblue{background:#fff;color:var(--blue)}
.sh-btn--ghost{border-color:rgba(255,255,255,.55);color:#fff}
.sh-btn--text{min-height:max(44px,2.75em);padding-inline:.4em;color:var(--ink-60);text-decoration:underline;text-underline-offset:.25em;font-weight:500}
@media (hover:hover){
  .sh-btn--blue:hover{background:var(--navy)}
  .sh-btn--white:hover{border-color:var(--blue);color:var(--blue)}
  .sh-btn--onblue:hover{background:var(--navy);color:#fff}
  .sh-btn--ghost:hover{background:#fff;color:var(--blue)}
  .sh-btn--text:hover{color:var(--ink)}
}
.sh-arrow{width:1em;height:1em;flex:none;transition:transform .25s var(--ease)}
@media (hover:hover){a:hover>.sh-arrow,button:hover>.sh-arrow,.sh-btn:hover .sh-arrow,.sh-textlink:hover .sh-arrow{transform:translateX(.25em)}}
.sh-textlink{display:inline-flex;align-items:center;gap:.5em;min-height:max(44px,2.75em);font-weight:700;letter-spacing:-.01em;font-size:max(15px,1em);color:var(--blue)}
.sh-link{text-decoration:underline;text-underline-offset:.2em;color:inherit;cursor:pointer;min-height:44px;display:inline-flex;align-items:center}
.sh-count{display:inline-grid;place-items:center;min-width:1.6em;height:1.6em;margin-left:.6em;padding:0 .35em;border-radius:2px;background:#fff;color:var(--blue);font-size:.8em;font-weight:700}

.sh-eyebrow{color:var(--blue);margin-bottom:1.4em}
.sh-h2{font-family:'ShWide','ShSans',sans-serif;font-weight:700;font-size:2.75em;line-height:1.06;letter-spacing:-.03em;max-width:16em;text-wrap:balance}
.sh-h3{font-family:'ShWide','ShSans',sans-serif;font-weight:700;font-size:1.5em;line-height:1.12;letter-spacing:-.02em}
.sh-head__sub{text-wrap:pretty;margin-top:1.4em;font-size:var(--t-p);line-height:1.45;color:var(--ink-60);max-width:36em}
.sh-source{color:var(--ink-60);text-transform:none;margin-top:1.6em}

/* ── banner, floating bar, menu ──────────────────────────────── */
.sh-top{position:fixed;top:0;left:0;right:0;z-index:40;padding-top:env(safe-area-inset-top);pointer-events:none}
.sh-top>*{pointer-events:auto}
.sh-banner{position:relative;display:flex;align-items:center;justify-content:center;min-height:max(44px,2.5em);padding:.45em 3em;background:var(--blue);color:#fff;
  font-size:max(14px,.9375em);text-align:center;overflow:hidden;transition:transform .35s var(--out),opacity .2s}
.sh-banner p{font-weight:400;line-height:1.35}
.sh-banner a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;gap:.3em;min-height:44px}
.sh-banner b,.sh-banner__lead{font-weight:700}
.sh-banner__x{position:absolute;right:0;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;color:#fff}
.sh-top.is-stuck .sh-banner{transform:translateY(-100%);opacity:0;pointer-events:none}
.sh-top.is-stuck .sh-nav{transform:translateY(calc(-1 * var(--bh,0px)))}
.sh-nav{display:flex;align-items:center;gap:1.6em;width:min(56em,calc(100% - 2 * var(--gut)));margin:.9em auto 0;padding:.45em .45em .45em 1em;background:rgba(255,255,255,.94);border-radius:3px;
  box-shadow:0 0 0 1px var(--line),0 4px 8px rgba(25,24,71,.06);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:transform .35s var(--out)}
.sh-nav__brand{display:flex;align-items:center;gap:.6em;font-family:'ShWide','ShSans',sans-serif;font-size:max(16px,1.15em);font-weight:700;letter-spacing:-.02em;min-height:max(44px,2.75em);flex:none;color:var(--ink)}
.sh-mark{width:1.5em;height:1.5em;color:var(--blue);flex:none}
.sh-nav__list{display:flex;align-items:center;gap:1.4em;margin-left:auto}
.sh-nav__list>li>a,.sh-nav__list>li>button{display:flex;align-items:center;gap:.4em;min-height:max(44px,2.75em);font-size:max(15px,1em);font-weight:500}
@media (hover:hover){.sh-nav__list>li>a:hover,.sh-nav__list>li>button:hover{color:var(--blue)}}
.sh-nav__drop{position:relative}
.sh-caret{width:.65em;height:.4em;transition:transform .25s var(--ease)}
.sh-nav__drop button[aria-expanded="true"] .sh-caret{transform:rotate(180deg)}
.sh-drop{position:absolute;left:0;top:calc(100% + 1em);width:36em;max-width:calc(100vw - 2 * var(--gut));padding:1.5em;background:#fff;border-radius:3px;box-shadow:0 0 0 1px var(--line),0 6px 8px rgba(25,24,71,.08)}
.sh-drop[hidden]{display:none!important}
.sh-drop{transform-origin:top left;transition:opacity .18s var(--out),transform .18s var(--out)}
@starting-style{.sh-drop{opacity:0;transform:translateY(-6px) scale(.98)}}
.sh-drop__cols{display:grid;grid-template-columns:1.4fr 1fr;gap:1.6em}
.sh-drop__two{display:grid;grid-template-columns:1fr 1fr;column-gap:1.2em}
.sh-drop__cols .mono{color:var(--blue);margin-bottom:.7em}
.sh-drop__cols li a{display:flex;align-items:center;min-height:44px;padding:.2em 0;font-size:max(15px,1em)}
@media (hover:hover){.sh-drop__cols li a:hover{color:var(--blue)}}
.sh-nav__cta{min-height:max(44px,2.9em);padding-inline:1.1em}
.sh-burger{display:none;width:max(44px,2.9em);height:max(44px,2.9em);border-radius:2px;background:var(--tint);flex-flow:column;justify-content:center;align-items:center;gap:.28em;margin-left:auto}
.sh-burger span{display:block;width:1.15em;height:2px;background:var(--ink);transition:transform .3s var(--ease),opacity .2s}
.sh-burger[aria-expanded="true"] span:nth-child(1){transform:translateY(.42em) rotate(45deg)}
.sh-burger[aria-expanded="true"] span:nth-child(2){opacity:0}
.sh-burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-.42em) rotate(-45deg)}
.sh-menu{position:fixed;inset:0;z-index:-1;background:var(--blue);color:#fff;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding-top:calc(env(safe-area-inset-top) + 7.5em);pointer-events:auto}
.sh-menu[hidden]{display:none!important}
.sh-menu__in{padding:1em var(--gut) calc(2em + env(safe-area-inset-bottom));display:flex;flex-flow:column;gap:2em;min-height:100%}
.sh-menu__close{display:none}
.sh-menu__list{display:flex;flex-flow:column;gap:1.4em}
.sh-menu__list>li>.mono{opacity:.75;margin-bottom:.5em}
.sh-menu__list a{display:block;font-family:'ShWide','ShSans',sans-serif;font-size:max(21px,1.7em);font-weight:700;letter-spacing:-.02em;line-height:1.15;padding:.18em 0}
.sh-menu__sub a{font-family:'ShSans',sans-serif;font-size:max(18px,1.35em);font-weight:500}
.sh-menu__sub--two{display:grid;grid-template-columns:1fr 1fr;column-gap:1em}
.sh-menu__foot{display:flex;flex-flow:column;gap:.5em;margin-top:auto;font-size:max(16px,1.05em);padding-top:1.5em;border-top:1px solid rgba(255,255,255,.3)}
.sh-menu__foot a{font-weight:700;min-height:max(44px,2.75em);display:flex;align-items:center}

/* ── enquiry list: button and drawer ─────────────────────────── */
.sh-dock{position:fixed;z-index:30;left:1.2em;bottom:calc(1.2em + env(safe-area-inset-bottom));display:flex;align-items:center;gap:.8em;min-height:max(44px,3em);padding:.4em .9em;background:var(--blue);color:#fff;border-radius:2px;box-shadow:0 .4em 1.6em rgba(25,24,71,.3);font-weight:700}
.sh-dock .sh-count{margin-left:0}
.sh-drawer{position:fixed;inset:0;z-index:70}
.sh-drawer__veil{position:absolute;inset:0;background:rgba(20,19,59,.55);cursor:default;transition:opacity .25s ease}
@starting-style{.sh-drawer__veil{opacity:0}.sh-drawer__panel{transform:translateX(100%)}}
.sh-drawer__panel{position:absolute;right:0;top:0;bottom:0;overscroll-behavior:contain;width:min(30em,100%);background:#fff;padding:calc(1.4em + env(safe-area-inset-top)) 1.6em calc(1.4em + env(safe-area-inset-bottom));display:flex;flex-flow:column;gap:1.4em;overflow:auto;box-shadow:-1em 0 3em rgba(25,24,71,.25);transition:transform .32s cubic-bezier(.32,.72,0,1)}
.sh-drawer__head{display:flex;justify-content:space-between;align-items:center;gap:1em}
.sh-drawer__head h2{font-family:'ShWide','ShSans',sans-serif;font-size:1.5em}
.sh-drawer__head button{min-height:max(44px,2.75em);padding:0 .8em;border:1px solid var(--line);border-radius:2px;font-weight:700}
.sh-drawer__list li{display:flex;justify-content:space-between;align-items:center;gap:1em;padding:.4em 0;border-bottom:1px solid var(--line);font-size:max(16px,1.05em);font-weight:500}
.sh-drawer__list button{min-height:max(44px,2.75em);color:var(--ink-60);text-decoration:underline;text-underline-offset:.2em;font-size:max(14px,.875em)}
.sh-drawer__empty{color:var(--ink-60);font-size:var(--t-p);line-height:1.45}
.sh-drawer__foot{margin-top:auto;display:flex;flex-flow:column;align-items:flex-start;gap:1em}

/* ── hero: the headline stands on a stack of board ───────────── */
.sh-hero{position:relative;overflow:hidden;background:var(--board);min-height:100svh;display:flex;flex-flow:column}
.sh-hero__in{position:relative;z-index:2;display:flex;flex-flow:column;align-items:flex-start;gap:1.4em;padding-top:12em;padding-bottom:2.5em}
.sh-hero__eyebrow{color:var(--blue)}
.sh-hero__title>span{display:block;white-space:nowrap}
.sh-hero__title{font-family:'ShWide','ShSans',sans-serif;font-weight:700;font-size:4.6em;line-height:1;letter-spacing:-.04em;max-width:12.5em;text-wrap:balance}
.sh-hero__sub{font-size:max(16px,1.25em);line-height:1.4;max-width:30em;color:var(--ink-80);text-wrap:pretty}
.sh-doors{display:flex;gap:.6em;flex-wrap:wrap;margin-top:.6em}
.sh-doors .sh-btn{min-width:12em}
.sh-hero__board{position:relative;flex:1;min-height:14em;border-top:2px solid var(--blue)}
.sh-hero__goods{position:absolute;right:var(--gut);bottom:-.15em;width:min(31em,34vw);margin:0;pointer-events:none}
.sh-hero__goods img{width:100%;height:auto;filter:drop-shadow(0 6px 6px rgba(25,24,71,.12))}
.sh-hero__canvas{position:absolute;inset:0;width:100%;height:100%}
.sh-hero__pause{position:absolute;right:var(--gut);bottom:calc(1em + env(safe-area-inset-bottom));z-index:3;display:grid;place-items:center;width:44px;height:44px;border-radius:2px;background:#fff;color:var(--blue);box-shadow:0 0 0 1px var(--line)}
@media (hover:hover){.sh-hero__pause:hover{background:var(--blue);color:#fff}}

/* the divider: two squares of their mark, one with the quarter-circle bite */
.sh-rule{position:relative;height:1px;background:var(--line);width:100%}
.sh-rule__sq{position:absolute;top:50%;width:.9em;height:.9em;margin-top:-.45em;background:var(--blue)}
.sh-rule__sq:first-child{left:var(--gut)}
.sh-rule__sq:last-child{right:var(--gut)}
.sh-rule__sq--bite{border-top-left-radius:100%}

/* ── the pinned line ─────────────────────────────────────────── */
.sh-stack{position:relative;padding-top:7em}
.sh-stack__intro{display:flex;flex-flow:column;align-items:flex-start}
.sh-stack__track{--unit:62svh;position:relative;height:calc(100svh + 6 * var(--unit));margin-top:2em}
.sh-stack__stage{position:sticky;top:0;display:flex;align-items:center;justify-content:center;height:100svh;padding-top:8em;padding-bottom:3em}
.sh-stack__wrap{width:100%}
.sh-stack__grid{display:grid;grid-template-columns:1fr 1fr;width:100%;height:min(43em,calc(100svh - 11.5em))}
.sh-stack__panel{position:relative;display:flex;flex-flow:column;justify-content:space-between;align-items:center;gap:2em;padding:3.4em 2em 2.4em;background:var(--blue);color:#fff;text-align:center}
.sh-plus{position:absolute;width:.75em;height:.75em;color:rgba(255,255,255,.7)}
.sh-plus svg{width:100%;height:100%}
.sh-plus--tl{top:1.25em;left:1.25em}.sh-plus--tr{top:1.25em;right:1.25em}.sh-plus--bl{bottom:1.25em;left:1.25em}.sh-plus--br{bottom:1.25em;right:1.25em}
.sh-stack__eyebrow{font-family:'ShMono',monospace;font-size:var(--t-m);text-transform:uppercase;letter-spacing:.04em;color:#dfe5f8}
.sh-stack__heads{display:grid;width:100%;max-width:30em;align-content:center;flex:1}
.sh-stack__slide{grid-area:1/1;display:flex;flex-flow:column;align-items:center;justify-content:center;gap:1.2em;visibility:hidden;opacity:0}
.sh-stack__slide:first-child{visibility:visible;opacity:1}
.sh-stack__n{color:#fff;opacity:.9}
.sh-stack__line{font-family:'ShWide','ShSans',sans-serif;font-size:2.2em;line-height:1.14;letter-spacing:-.03em;font-weight:700;color:#fff;text-wrap:balance}
.sh-stack__who{display:inline-flex;align-items:center;min-height:2.2em;padding:.35em .9em;border:1px solid rgba(255,255,255,.45);border-radius:2px;font-size:var(--t-s);font-weight:700;color:#fff}
.sh-stack__dots{display:flex;gap:.375em;width:fit-content;padding:.75em;border-radius:2px;background:rgba(255,255,255,.14)}
.sh-stack__dot{position:relative;flex:none;width:5px;height:5px;background:rgba(255,255,255,.4);overflow:hidden}
.sh-stack__dot.is-active{width:2.906em}
.sh-stack__fill{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left center}
.sh-stack__view{position:relative;display:flex;justify-content:center;align-items:center;padding:3em 2em;border:1px solid var(--line);overflow:hidden;background:var(--paper)}
.sh-stack__dotgrid{position:absolute;inset:0;background-image:radial-gradient(circle,#c3cae0 1.2px,transparent 2px);background-size:6.6em 5.8em;background-position:center}
.sh-stack__card{position:relative;width:100%;max-width:31em;aspect-ratio:481/469;max-height:100%;background:#fff;box-shadow:0 0 0 1px var(--line)}
.sh-stack__card svg{width:100%;height:100%}
.sh-steps{padding-top:2.5em;padding-bottom:1em}
.sh-steps ul{display:flex;flex-wrap:wrap;gap:.5em}
.sh-steps a{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:2px;font-weight:700;font-size:max(15px,1em);background:#fff}
.sh-steps a .mono{color:var(--blue)}
@media (hover:hover){.sh-steps a:hover{border-color:var(--blue);color:var(--blue)}}
.sh-stack--static{padding:6em 0}
.sh-stack__list{display:grid;gap:1.2em;margin-top:2.5em}
.sh-stack__list li{display:grid;grid-template-columns:1fr 1fr;min-height:24em}
.sh-stack--static .sh-stack__panel{justify-content:center;gap:1.2em}
.sh-stack--static .sh-stack__line{font-size:1.8em}

/* the isometric drawing: roles are coloured here, nowhere else.
   Machines are white and cool grey, lit in their blue; the fish is salmon; board is kraft; print is the one blue. */
.sh-iso{width:100%;height:100%;overflow:hidden}
.sh-iso path{stroke:#191847;stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.sh-iso .t{fill:#fff}.sh-iso .l{fill:#e7eaf3}.sh-iso .r{fill:#c8cee0}.sh-iso .k{fill:#191847}
.sh-iso .p{fill:#f6a07a}.sh-iso .pl{fill:#ec8159}.sh-iso .pr{fill:#d2663f}
.sh-iso .b{fill:#e4c89e}.sh-iso .bl{fill:#cba676}.sh-iso .br{fill:#ab8554}
.sh-iso .d{fill:#c39463}.sh-iso .dl{fill:#a2744a}.sh-iso .dr{fill:#845c36}
.sh-iso .u{fill:#284195}
.sh-iso .n{fill:none}.sh-iso .w{fill:#fff}.sh-iso .f{fill:#fff;fill-opacity:.5}
.sh-iso .roll,.sh-iso .rod,.sh-iso .rib,.sh-iso .fat,.sh-iso .glare,.sh-iso .print,.sh-iso .tape,.sh-iso .wrap,.sh-iso .slat{fill:none}
.sh-iso path.roll{stroke:#a9b0c6}.sh-iso path.rib{stroke:#5d6690}
.sh-iso path.fat{stroke:#fff3ec;stroke-width:1.3}
.sh-iso path.glare{stroke:#fff;stroke-width:1.6}
.sh-iso path.print{stroke:#fff;stroke-width:1.2}
.sh-iso path.tape{stroke:#f3e3c6;stroke-width:2.2}
.sh-iso path.wrap{stroke:#fff;stroke-width:1.2;stroke-opacity:.85}
.sh-iso path.slat{stroke:#6f4a29}
.sh-iso .st .t,.sh-iso .st .l,.sh-iso .st .r{transition:fill .5s var(--ease)}
.sh-iso .st[data-on="1"] .t{fill:#c7d1f1}.sh-iso .st[data-on="1"] .l{fill:#284195}.sh-iso .st[data-on="1"] .r{fill:#1c2f73}
.sh-iso [data-form]{transition:opacity .35s,visibility 0s}
.sh-iso [data-form][data-on="0"]{visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.sh-iso--drop .guides line{stroke:#284195;stroke-width:1;stroke-dasharray:2 3;vector-effect:non-scaling-stroke}

/* ── industries ──────────────────────────────────────────────── */
.sh-sectors{position:relative;padding:9em 0 7em;overflow:hidden}
.sh-sectors__grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:3em;align-items:start}
.sh-sectors__top{display:flex;flex-flow:column;gap:1.4em;position:sticky;top:8em}
.sh-sectors__title{font-family:'ShWide','ShSans',sans-serif;font-size:3.4em;line-height:1.02;letter-spacing:-.035em;max-width:9em}
.sh-sectors__sub{font-size:var(--t-p);line-height:1.45;color:var(--ink-60);max-width:28em}
.sh-sectors__art{width:100%;max-width:17em;margin-top:1em}
.sh-sectors__list{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line);border-left:1px solid var(--line)}
.sh-sectors__list li{border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.sh-sectors__list a{display:flex;flex-flow:column;gap:1.4em;height:100%;padding:1.5em 1.3em 1.3em;min-height:10.5em;background:#fff;transition:background-color .25s,color .25s}
.sh-sectors__name{font-family:'ShWide','ShSans',sans-serif;font-size:1.45em;line-height:1.1;font-weight:700;letter-spacing:-.025em}
.sh-sectors__go{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:.8em;font-size:var(--t-s);color:var(--ink-60);line-height:1.35}
.sh-sectors__go .sh-arrow{color:var(--blue)}
@media (hover:hover){.sh-sectors__list a:hover{background:var(--blue);color:#fff}.sh-sectors__list a:hover .sh-sectors__go,.sh-sectors__list a:hover .sh-arrow{color:#fff}}

/* ── the group: a ledger, one row per company ────────────────── */
.sh-group{padding:7em 0;background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sh-group__head{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:3em}
.sh-group__list{border-top:2px solid var(--ink)}
.sh-member{display:grid;grid-template-columns:1fr 1.5fr .9fr;gap:2.4em;padding:2em 0;border-bottom:1px solid var(--line)}
.sh-member__name h3{font-family:'ShWide','ShSans',sans-serif;font-size:2em;line-height:1.05;letter-spacing:-.03em;color:var(--blue)}
.sh-member__name .mono{margin-top:.8em;color:var(--ink-60)}
.sh-member__lead{font-size:max(16px,1.2em);line-height:1.35;font-weight:500;letter-spacing:-.01em}
.sh-member__own{margin-top:.8em;font-size:var(--t-s);line-height:1.5;color:var(--ink-60)}
.sh-member__joined{margin-top:.8em;padding:.7em .9em;background:var(--tint);border-radius:2px;font-size:var(--t-s);line-height:1.45;color:var(--ink-80)}
.sh-member__reach{display:flex;flex-flow:column;align-items:flex-start;gap:.1em;font-size:var(--t-s)}
.sh-member__reach a{display:inline-flex;align-items:center;gap:.4em;min-height:44px;overflow-wrap:anywhere}
.sh-member__tel{font-family:'ShWide','ShSans',sans-serif;font-size:max(20px,1.6em);font-weight:700;letter-spacing:-.02em}
@media (hover:hover){.sh-member__reach a:hover{color:var(--blue)}}

/* ── story: the quote and the first box ──────────────────────── */
.sh-story{padding:8em 0}
.sh-story__grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:4em;align-items:center}
.sh-story__art .sh-tile{max-width:24em}
.sh-quote p{font-family:'ShWide','ShSans',sans-serif;font-size:2.1em;line-height:1.18;letter-spacing:-.025em;font-weight:500;text-wrap:balance}
.sh-quote footer{margin-top:1.2em;font-size:var(--t-s);color:var(--ink-60)}
.sh-quote footer strong{color:var(--ink)}
.sh-story__p{margin-top:1.4em;font-size:var(--t-p);line-height:1.55;color:var(--ink-80);max-width:36em}

/* ── their work ──────────────────────────────────────────────── */
.sh-work{padding:7em 0;background:#fff;border-top:1px solid var(--line)}
.sh-work__grid{display:grid;grid-template-columns:repeat(6,1fr);gap:1em;margin-top:2.6em}
.sh-work__item{grid-column:span 2}
.sh-work__item--0,.sh-work__item--1{grid-column:span 3}
.sh-work__link{display:flex;flex-flow:column;height:100%;background:var(--card);border-radius:2px;overflow:hidden;transition:background-color .25s}
.sh-work__link .sh-tile{aspect-ratio:4/3!important;background:transparent}
.sh-work__link .sh-tile img{object-fit:contain;padding:1.2em}
.sh-work__link .sh-tile--photo img{object-fit:cover;padding:0}
.sh-work__cap{display:block;padding:1em 1.2em 1.2em;font-size:var(--t-s);line-height:1.4;color:var(--ink-60)}
.sh-work__cap strong{display:block;color:var(--ink);font-size:max(16px,1.1em);margin-bottom:.2em}
@media (hover:hover){a.sh-work__link:hover{background:var(--tint)}}

/* ── design and samples ──────────────────────────────────────── */
.sh-design{padding:8em 0}
.sh-design__grid{display:grid;grid-template-columns:1.2fr .8fr;gap:4em;align-items:center}
.sh-design__list{display:grid;gap:0;margin-top:2em;border-top:1px solid var(--line)}
.sh-design__list>div{display:grid;grid-template-columns:12em 1fr;gap:1.4em;padding:1.1em 0;border-bottom:1px solid var(--line)}
.sh-design__list dt{font-weight:700;letter-spacing:-.01em;font-size:max(15px,1.05em)}
.sh-design__list dd{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.sh-design__act{margin-top:2em}
.sh-design__art .sh-tile{max-width:22em;margin-left:auto}

/* ── service ─────────────────────────────────────────────────── */
.sh-service{padding:8em 0 6em;background:var(--tint)}
.sh-service__top{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:3em}
.sh-service__grid{display:grid;grid-template-columns:1fr 1.25fr;gap:1.25em}
.sh-service__card{display:flex;flex-flow:column;gap:1.1em;padding:2em 1.8em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.sh-service__card>.mono{color:var(--blue)}
.sh-service__card--blue{background:var(--blue);color:#fff;box-shadow:none}
.sh-service__card--blue>.mono{color:#dfe5f8}
.sh-phone{display:flex;flex-flow:column;gap:.35em;padding:1em 1.2em;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.3);border-radius:2px;min-height:4.8em;justify-content:center;transition:background-color .25s,color .25s,border-color .25s}
.sh-phone span{font-size:var(--t-s);opacity:.85}
.sh-phone strong{font-family:'ShWide','ShSans',sans-serif;font-size:max(22px,1.9em);letter-spacing:-.03em;font-weight:700;line-height:1}
@media (hover:hover){.sh-phone:hover{background:#fff;color:var(--blue);border-color:#fff}}
.sh-phone--light{background:var(--board);border-color:var(--line);color:var(--ink)}
@media (hover:hover){.sh-phone--light:hover{background:var(--blue);color:#fff;border-color:var(--blue)}}
.sh-service__note{font-size:var(--t-s);line-height:1.45;color:var(--ink-60)}
.sh-service__act{display:flex;flex-wrap:wrap;gap:.6em 1.4em;align-items:center;margin-top:.6em}
.sh-ready{display:flex;flex-flow:column}
.sh-ready li{display:grid;grid-template-columns:2.6em 1fr;gap:.6em;padding:1em 0;border-top:1px solid var(--line);align-items:start}
.sh-ready li:first-child{border-top:0;padding-top:0}
.sh-ready .mono{color:var(--blue);padding-top:.25em}
.sh-ready strong{font-size:max(16px,1.1em);font-weight:700;letter-spacing:-.01em}
.sh-ready p{margin-top:.35em;font-size:var(--t-s);line-height:1.45;color:var(--ink-60)}

/* ── numbers ─────────────────────────────────────────────────── */
.sh-numbers{padding:6em 0 8em}
.sh-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}
.sh-stat{display:flex;flex-flow:column;gap:1em;padding:2.2em 1.4em 2em;border-right:1px solid var(--line)}
.sh-stat:last-child{border-right:0}
.sh-stat__n{font-family:'ShWide','ShSans',sans-serif;font-size:3.9em;line-height:1;font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums;display:inline-block;color:var(--blue)}
.sh-stat__l{color:var(--ink-60);min-height:max(44px,2.6em)}
.sh-numbers__grid{display:grid;grid-template-columns:1fr 1.4fr;gap:3em;margin-top:3em;align-items:start}
.sh-numbers__stock{font-size:max(17px,1.35em);line-height:1.4;letter-spacing:-.01em;font-weight:500;max-width:22em}
.sh-certs{display:grid;gap:1em}
.sh-certs li{display:grid;grid-template-columns:10em 1fr;gap:1.2em;padding-bottom:1em;border-bottom:1px solid var(--line)}
.sh-certs strong{font-family:'ShWide','ShSans',sans-serif;color:var(--blue);font-size:max(15px,1.05em)}
.sh-certs span{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}

/* ── closing on their blue ───────────────────────────────────── */
.sh-closing{position:relative;display:flex;align-items:center;justify-content:center;min-height:92svh;background:var(--blue);color:#fff;overflow:hidden}
.sh-closing__bg{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.sh-closing__in{position:relative;z-index:2;display:flex;flex-flow:column;align-items:center;text-align:center;gap:1.6em;padding-top:10em;padding-bottom:9em}
.sh-closing__title{font-family:'ShWide','ShSans',sans-serif;font-size:4.4em;line-height:1;letter-spacing:-.04em;max-width:11em;text-wrap:balance}
.sh-closing__sub{font-size:var(--t-p);line-height:1.45;color:rgba(255,255,255,.88);max-width:30em}
.sh-closing .sh-doors{justify-content:center}

/* ── footer ──────────────────────────────────────────────────── */
.sh-foot{background:var(--navy);color:#fff;padding:5em 0 2em}
.sh-foot__grid{display:grid;grid-template-columns:1fr 1.7fr;gap:3em;align-items:start}
.sh-foot__brand .sh-mark{width:4em;height:4em;color:#fff}
.sh-foot__name{margin-top:.6em;font-family:'ShWide','ShSans',sans-serif;font-size:2.4em;font-weight:700;letter-spacing:-.03em}
.sh-foot__hours{margin-top:1em;font-size:var(--t-s);line-height:1.45;color:rgba(255,255,255,.75);max-width:20em}
.sh-foot__cols{display:grid;grid-template-columns:repeat(3,1fr);gap:2em}
.sh-foot .mono{color:#b9c4ec;margin-bottom:1em}
.sh-foot li{font-size:max(15px,1em);line-height:1.35;padding:.24em 0;font-weight:400;overflow-wrap:anywhere}
.sh-foot a{display:inline-flex;align-items:center;min-height:1.6em}
@media (max-width:991px){.sh-foot a{min-height:44px}.sh-foot li{padding:0}}
@media (hover:hover){.sh-foot a:hover{text-decoration:underline;text-underline-offset:.2em}}
.sh-foot__legal{margin-top:4em;padding-top:1.4em;border-top:1px solid rgba(255,255,255,.22);color:#c9d0ec}

/* ── tiles ───────────────────────────────────────────────────── */
.sh-tile{position:relative;margin:0;overflow:hidden;width:100%}
.sh-tile img{width:100%;height:100%;object-fit:contain}
.sh-tile--photo img{object-fit:cover}
.sh-tile--model{aspect-ratio:1/1;background:#fff}
.sh-tile--model img{object-fit:contain;padding:.6em;mix-blend-mode:multiply}
.sh-tile--art{aspect-ratio:481/469;background:#fff}
.sh-tile--art svg{width:100%;height:100%}

/* ── inner pages ─────────────────────────────────────────────── */
.sh-phead{padding:12em 0 3em}
.sh-crumbs{display:flex;gap:.2em;flex-wrap:wrap;color:var(--ink-60);margin-bottom:2em}
.sh-crumbs a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;min-height:44px}
.sh-crumbs>span{display:inline-flex;align-items:center}
.sh-crumbs>span:not(:last-child)::after{content:'/';margin:0 .7em;opacity:.6}
.sh-phead .sh-eyebrow{margin-bottom:1em}
.sh-phead__title{font-family:'ShWide','ShSans',sans-serif;font-size:4.2em;line-height:1.02;letter-spacing:-.04em;max-width:12em;overflow-wrap:normal;text-wrap:balance}
.sh-phead__sub{text-wrap:pretty;margin-top:1.3em;font-size:max(16px,1.2em);line-height:1.45;color:var(--ink-80);max-width:36em}
.sh-phead__act{display:flex;flex-wrap:wrap;gap:.8em 1.4em;align-items:center;margin-top:2em}
.sh-who{display:flex;flex-wrap:wrap;gap:.4em}
.sh-who li{display:inline-flex;align-items:center;min-height:2.3em;padding:.25em .8em;border:1px solid var(--line);border-radius:2px;font-size:var(--t-s);font-weight:700;color:var(--blue);background:#fff}
.sh-who--onblue li{border-color:rgba(255,255,255,.45);color:#fff;background:transparent}
.sh-explore{padding:1.5em 0 4em}
.sh-steptabs{display:flex;flex-wrap:wrap;gap:.5em;margin-bottom:2em}
.sh-steptabs button{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:2px;font-weight:700;font-size:max(15px,1em);background:#fff}
.sh-steptabs button .mono{color:var(--blue)}
.sh-steptabs button.is-on{background:var(--blue);color:#fff;border-color:var(--blue)}
.sh-steptabs button.is-on .mono{color:#fff}
@media (hover:hover){.sh-steptabs button:not(.is-on):hover{border-color:var(--blue)}}
.sh-stagecard{display:grid;grid-template-columns:1.2fr .8fr;margin-bottom:1.6em;background:var(--blue);color:#fff;border-radius:2px;overflow:hidden}
.sh-stagecard>div:first-child{padding:2.2em 2em;display:flex;flex-flow:column;gap:1em;justify-content:center;align-items:flex-start}
.sh-stagecard__line{font-family:'ShWide','ShSans',sans-serif;font-size:1.9em;line-height:1.14;font-weight:700;letter-spacing:-.03em}
.sh-stagecard__steps{font-size:var(--t-p);color:rgba(255,255,255,.9)}
.sh-stagecard__art{background:#fff;aspect-ratio:481/469;max-height:22em;justify-self:end;width:100%}
.sh-famgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25em}
.sh-fam{display:flex;flex-flow:column;background:#fff;border-radius:2px;overflow:hidden;box-shadow:0 0 0 1px var(--line)}
.sh-fam__media{display:block;border-bottom:1px solid var(--line)}
.sh-fam__media .sh-tile{aspect-ratio:4/3!important}
.sh-fam__body{display:flex;flex-flow:column;gap:.7em;padding:1.4em 1.4em 1.5em;flex:1}
.sh-fam__stage{color:var(--blue)}
.sh-fam h3{font-family:'ShWide','ShSans',sans-serif;font-size:1.45em;line-height:1.12;letter-spacing:-.025em}
.sh-fam h3 a{display:inline-flex;align-items:center;min-height:44px}
.sh-fam__blurb{font-size:var(--t-s);line-height:1.45;color:var(--ink-80)}
.sh-fam__sup{color:var(--ink-60)}
.sh-fam__act{display:flex;flex-wrap:wrap;gap:.4em 1.2em;align-items:center;margin-top:auto;padding-top:.6em}
.sh-add{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,2.75em);font-weight:700;font-size:max(15px,1em);letter-spacing:-.01em;text-align:left}
.sh-add__box{display:inline-grid;place-items:center;width:1.55em;height:1.55em;flex:none;border:1px solid var(--ink-60);border-radius:2px;font-size:1em;line-height:1}
.sh-add.is-on .sh-add__box{background:var(--blue);border-color:var(--blue);color:#fff}
.sh-add--small{min-width:44px;justify-content:center}
@media (hover:hover){.sh-add:hover .sh-add__box{border-color:var(--blue)}}
.sh-units{padding:2em 0 7em}
.sh-units__grid{display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:2em;align-items:start;padding-top:2.4em;border-top:2px solid var(--ink)}
.sh-unit{display:flex;flex-flow:column;gap:.7em;font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.sh-unit__name{font-family:'ShWide','ShSans',sans-serif;font-weight:700;font-size:max(17px,1.25em);color:var(--blue)}
.sh-unit a{font-weight:700;color:var(--ink);min-height:44px;display:inline-flex;align-items:center}
.sh-fampage{padding:1em 0 5em}
.sh-fampage__grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:3.5em;align-items:start}
.sh-fampage__copy{display:flex;flex-flow:column;gap:1.2em;position:sticky;top:8em}
.sh-lines{border-top:1px solid var(--line)}
.sh-lines li{padding:.75em 0;border-bottom:1px solid var(--line);font-size:max(16px,1.1em);font-weight:500}
.sh-fampage__makers,.sh-fampage__unit{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.sh-fampage__unit a{display:inline-flex;align-items:center;min-height:44px;color:var(--blue);text-decoration:underline;text-underline-offset:.2em}
.sh-fampage__count{color:var(--blue);margin-bottom:1em}
.sh-models{display:grid;grid-template-columns:repeat(3,1fr);gap:1em}
.sh-model{display:flex;flex-flow:column;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line);overflow:hidden}
.sh-model__row{display:flex;align-items:center;justify-content:space-between;gap:.6em;padding:.2em .4em .2em 1em;border-top:1px solid var(--line)}
.sh-model__name{font-weight:700;font-size:max(15px,1em);letter-spacing:-.01em}
.sh-where{padding:6em 0;background:var(--blue);color:#fff}
.sh-where__grid{display:grid;grid-template-columns:1fr 1fr;gap:3em;align-items:center}
.sh-where .sh-eyebrow{color:#dfe5f8}
.sh-where .sh-head__sub{color:rgba(255,255,255,.9)}
.sh-where .sh-who{margin:1.4em 0 .8em}
.sh-where .sh-textlink{color:#fff}
.sh-where__art{background:#fff;aspect-ratio:481/469;max-width:30em;width:100%;justify-self:end}
.sh-prep{padding:6em 0}
.sh-prep__grid{display:grid;grid-template-columns:1fr 1fr;gap:3em;align-items:start}
.sh-pn{display:grid;grid-template-columns:1fr 1fr;gap:1.25em;padding-top:1em;padding-bottom:6em}
.sh-pn a{display:flex;flex-flow:column;gap:.7em;padding:1.4em 1.4em 1.5em;border:1px solid var(--line);border-radius:2px;background:#fff;font-family:'ShWide','ShSans',sans-serif;font-size:1.4em;font-weight:700;letter-spacing:-.03em;line-height:1.1;transition:background-color .25s,color .25s}
.sh-pn a:last-child{text-align:right;align-items:flex-end}
.sh-pn .mono{color:var(--blue)}
@media (hover:hover){.sh-pn a:hover{background:var(--blue);color:#fff}.sh-pn a:hover .mono{color:#fff}}
.sh-sectorpage{padding:1em 0 5em}
.sh-sectorpage__grid{display:grid;grid-template-columns:1fr 1fr;gap:3.5em;align-items:start}
.sh-sectorpage__media .sh-tile{background:var(--card);border-radius:2px}
.sh-sectorpage__media .sh-tile--cut img{padding:1.4em}
.sh-products{border-top:2px solid var(--ink)}
.sh-products li{display:grid;grid-template-columns:1fr auto;gap:1em;align-items:start;padding:1.2em 0;border-bottom:1px solid var(--line)}
.sh-products__k{font-family:'ShWide','ShSans',sans-serif;font-size:max(17px,1.3em);line-height:1.15;letter-spacing:-.02em;margin-bottom:.4em}
.sh-products p{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.sh-sectorline{padding:5em 0;background:var(--tint)}
.sh-sectorline .sh-famgrid{margin-top:2.4em}
.sh-othersec{padding-top:4em;padding-bottom:6em}
.sh-othersec .mono{color:var(--blue);margin-bottom:1em}
.sh-othersec ul{display:flex;flex-wrap:wrap;gap:.5em}
.sh-othersec a{display:inline-flex;align-items:center;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:2px;background:#fff;font-weight:700}
@media (hover:hover){.sh-othersec a:hover{border-color:var(--blue);color:var(--blue)}}
.sh-labels{padding:1em 0 5em}
.sh-labels__wide{aspect-ratio:1920/715;border-radius:2px}
.sh-labels__grid{display:grid;grid-template-columns:repeat(6,1fr);gap:1em;margin-top:1.4em}
.sh-labels__grid li{grid-column:span 2;padding:1.4em 1.3em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.sh-labels__grid li:nth-child(4),.sh-labels__grid li:nth-child(5){grid-column:span 3}
.sh-labels__grid p{font-size:var(--t-s);line-height:1.5;color:var(--ink-80)}
.sh-files{padding:6em 0;background:var(--tint)}
.sh-files__grid{display:grid;grid-template-columns:1fr 1fr;gap:3em;align-items:start}
.sh-files__art{margin-top:2em;max-width:22em}
.sh-files .sh-ready{background:#fff;padding:1.6em;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.sh-svc,.sh-req{padding:1em 0 7em}
.sh-svc__grid,.sh-req__grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:2.4em;align-items:start}
.sh-req__grid{grid-template-columns:1.3fr .7fr}
.sh-svc__side,.sh-req__side{display:flex;flex-flow:column;gap:1.25em;position:sticky;top:8em}

/* ── the request form ────────────────────────────────────────── */
.sh-form{display:flex;flex-flow:column;gap:1.4em;padding:2.2em;background:#fff;border-radius:2px;box-shadow:0 0 0 1px var(--line)}
.sh-form__step{color:var(--ink-60)}
.sh-form__h{font-family:'ShWide','ShSans',sans-serif;font-size:2em;line-height:1.1}
.sh-form__to{color:var(--blue);margin-top:-.6em}
.sh-form__lead{font-size:var(--t-p);line-height:1.45;color:var(--ink-60)}
.sh-form__note{font-size:var(--t-s);line-height:1.5;color:var(--ink-60)}
.sh-form__note a,.sh-urgent a{text-decoration:underline;text-underline-offset:.2em;font-weight:700;color:var(--blue)}
.sh-form__proto{font-size:var(--t-s);line-height:1.5;color:var(--ink-60);padding:1em 1.1em;border:1px dashed var(--line);border-radius:2px}
.sh-form__actions{display:flex;flex-wrap:wrap;gap:.8em 1em;align-items:center}
.sh-opts{display:grid;gap:.6em}
.sh-opt{position:relative;display:flex;flex-flow:column;gap:.35em;padding:1.1em 1.3em;border:1px solid var(--line);border-radius:2px;cursor:pointer;min-height:4.5em;background:var(--board);transition:border-color .2s,background-color .2s}
.sh-opt input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0}
.sh-opt:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.sh-opt__t{font-family:'ShWide','ShSans',sans-serif;font-size:max(17px,1.3em);font-weight:700;letter-spacing:-.02em}
.sh-opt__s{font-size:var(--t-s);color:var(--ink-60);line-height:1.4}
.sh-opt__to{color:var(--blue);margin-top:.2em}
@media (hover:hover){.sh-opt:hover{border-color:var(--blue);background:#fff}}
.sh-opt.is-on{border-color:var(--blue)}
.sh-grid2{display:grid;grid-template-columns:1fr 1fr;gap:1.1em}
.sh-grid2--end{align-items:end}
.sh-fld{display:flex;flex-flow:column;gap:.55em;min-width:0;border:0;padding:0;margin:0}
.sh-fld>label:not(.sh-chip):not(.sh-filebtn),.sh-lbl,.sh-fld>legend{font-size:max(15px,1em);font-weight:700;letter-spacing:-.01em;padding:0}
.sh-fld input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),.sh-fld select,.sh-fld textarea{
  width:100%;min-height:max(44px,3.1em);padding:.7em .9em;background:var(--board);color:var(--ink);border:1px solid #c5cbdc;border-radius:2px;
  font:inherit;font-size:max(16px,1em);font-weight:400;line-height:1.3;-webkit-appearance:none;appearance:none}
.sh-fld select{background-image:linear-gradient(45deg,transparent 50%,#191847 50%),linear-gradient(135deg,#191847 50%,transparent 50%);background-position:calc(100% - 1.3em) 55%,calc(100% - .95em) 55%;background-size:.4em .4em;background-repeat:no-repeat;padding-right:2.4em}
.sh-fld textarea{resize:vertical;min-height:6em}
.sh-fld input:focus-visible,.sh-fld select:focus-visible,.sh-fld textarea:focus-visible{outline:2px solid var(--blue);outline-offset:1px;border-color:var(--blue);background:#fff}
.sh-fld input::placeholder,.sh-fld textarea::placeholder{color:#6d6f8f}
.sh-fld [aria-invalid="true"]{border-color:#b3261e}
.sh-err{color:#b3261e;font-size:var(--t-s);line-height:1.35;width:100%}
.sh-errsum{padding:1em 1.2em;border:1px solid #b3261e;border-radius:2px;background:#fdf0ef;font-size:var(--t-s)}
.sh-errsum strong{display:block;margin-bottom:.4em;font-size:max(15px,1em)}
.sh-errsum li{padding:.15em 0}
.sh-errsum a{text-decoration:underline;text-underline-offset:.2em;color:#8c1d16}
.sh-chips{flex-flow:row wrap;gap:.5em}
.sh-chips>legend{width:100%;margin-bottom:.15em}
.sh-chip{position:relative;display:inline-flex;align-items:center;min-height:max(44px,2.9em);padding:.3em 1em;border:1px solid #c5cbdc;border-radius:2px;font-weight:500;font-size:max(15px,1em);cursor:pointer;background:#fff;transition:background-color .2s,color .2s,border-color .2s}
.sh-chip input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.sh-chip:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.sh-chip.is-on{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:700}
@media (hover:hover){.sh-chip:not(.is-on):hover{border-color:var(--blue)}}
.sh-check{position:relative;display:flex;gap:.8em;align-items:center;min-height:max(44px,3em);padding:.5em 1em;border:1px solid #c5cbdc;border-radius:2px;cursor:pointer;font-weight:500;font-size:max(15px,1em);line-height:1.3;background:#fff}
.sh-check input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.sh-check::before{content:'';flex:none;width:1.3em;height:1.3em;border:1px solid #6d6f8f;border-radius:2px;background:#fff}
.sh-check.is-on{border-color:var(--blue)}
.sh-check.is-on::before{background:var(--blue) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.2 6.3 5 9l4.8-5.4' fill='none' stroke='%23fff' stroke-width='1.8'/%3E%3C/svg%3E") center/80% no-repeat;border-color:var(--blue)}
.sh-check:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.sh-urgent{padding:1em 1.1em;border:1px solid var(--blue);border-radius:2px;background:var(--tint);font-size:var(--t-s);line-height:1.5}
.sh-sect{display:flex;flex-flow:column;gap:.9em;padding-top:1.2em;border-top:1px solid var(--line)}
.sh-tags{display:flex;flex-wrap:wrap;gap:.5em}
.sh-tags li{display:inline-flex;align-items:center;gap:.6em;min-height:max(44px,2.6em);padding:.2em .3em .2em .9em;border:1px solid #c5cbdc;border-radius:2px;font-size:max(15px,1em);font-weight:500;background:#fff}
.sh-tags li .mono{color:var(--ink-60);text-transform:none}
.sh-tags button{display:grid;place-items:center;width:44px;height:44px;margin-block:-.4em;font-size:1.2em;color:var(--ink-60)}
.sh-files{gap:.7em}
.sh-filebtn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:fit-content;min-height:max(44px,3em);padding:0 1.4em;border:1px solid var(--ink-60);border-radius:2px;font-weight:700;cursor:pointer;background:#fff}
.sh-filebtn input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;font-size:16px}
.sh-filebtn:has(input:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.sh-brief{width:100%;padding:1.1em 1.2em;background:var(--board);color:var(--ink);border:1px solid #c5cbdc;border-radius:2px;font-family:'ShMono',ui-monospace,monospace;font-size:max(13px,.8125em);line-height:1.6;resize:vertical}

/* ── reduced motion: nothing moves that is not needed ────────── */
@media (prefers-reduced-motion:reduce){
  .sh *,.sh *::before,.sh *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;scroll-behavior:auto!important}
  .sh [data-lines]{visibility:visible!important}
  .roll>span{transform:none!important}
}

/* ── tablet and phone ────────────────────────────────────────── */
@media (max-width:1180px){
  .sh-nav__list{gap:1em}
}
@media (max-width:991px){
  .sh-hero__goods{display:none}
  .sh-dock{left:.9em;bottom:calc(5.6em + env(safe-area-inset-bottom))}
  .sh-nav__list,.sh-nav__cta{display:none}
  .sh-burger{display:flex}
  .sh-nav{width:calc(100% - 2 * var(--gut));justify-content:space-between;padding-right:.45em}
  .sh-banner__more{display:none}
  .sh-hero__title{font-size:3.6em}
  .sh-hero__in{padding-top:11em}
  .sh-h2{font-size:2.3em}
  .sh-stack__stage{padding-top:7.5em}
  .sh-stack__grid{grid-template-columns:1fr;grid-template-rows:auto auto;height:auto;max-height:none}
  .sh-stack__panel{padding:2.4em 1.4em 1.8em;gap:1.2em}
  .sh-stack__line{font-size:1.7em}
  .sh-stack__view{padding:1em 2em;min-height:0}
  .sh-stack__card{height:auto;width:100%;max-width:25em;aspect-ratio:481/469}
  .sh-sectors__grid,.sh-story__grid,.sh-design__grid,.sh-service__grid,.sh-numbers__grid,.sh-fampage__grid,.sh-where__grid,.sh-prep__grid,.sh-svc__grid,.sh-req__grid,.sh-sectorpage__grid,.sh-files__grid,.sh-units__grid{grid-template-columns:1fr}
  .sh-sectors__top,.sh-fampage__copy,.sh-svc__side,.sh-req__side{position:static}
  .sh-sectors__title{font-size:2.8em}
  .sh-member{grid-template-columns:1fr 1fr;gap:1.2em 2em}
  .sh-member__name{grid-column:1/-1}
  .sh-work__item,.sh-work__item--0,.sh-work__item--1{grid-column:span 3}
  .sh-stat__n{font-size:3.6em}
  .sh-stats{grid-template-columns:1fr 1fr}
  .sh-stat:nth-child(2n){border-right:0}
  .sh-stat:nth-child(-n+2){border-bottom:1px solid var(--line)}
  .sh-closing__title{font-size:3.2em}
  .sh-phead{padding-top:9.5em}
  .sh-phead__title{font-size:3.1em}
  .sh-famgrid{grid-template-columns:1fr 1fr}
  .sh-models{grid-template-columns:repeat(3,1fr)}
  .sh-stagecard{grid-template-columns:1fr}
  .sh-stagecard__art{justify-self:stretch;max-height:none;max-width:24em;margin:0 auto 1.4em}
  .sh-foot__grid{grid-template-columns:1fr}
  .sh-where__art{justify-self:start}
  .sh-design__art .sh-tile{margin-left:0}
  .sh-labels__grid li,.sh-labels__grid li:nth-child(4),.sh-labels__grid li:nth-child(5){grid-column:span 3}
}
@media (max-width:767px){
  .sh-hero__title{font-size:2.9em}
  .sh-h2{font-size:2em}
  .sh-sectors{padding:6em 0 4em}
  .sh-group,.sh-story,.sh-work,.sh-design,.sh-service{padding-block:5em}
  .sh-member{grid-template-columns:1fr}
  .sh-famgrid{grid-template-columns:1fr}
  .sh-models{grid-template-columns:1fr 1fr}
  .sh-stack__track{--unit:56svh}
  .sh-stack__stage{padding-bottom:1.2em}
  .sh-form{padding:1.4em}
  .sh-grid2{grid-template-columns:1fr}
  .sh-stack__list li{grid-template-columns:1fr}
  .sh-pn{grid-template-columns:1fr}
  .sh-pn a:last-child{text-align:left;align-items:flex-start}
  .sh-foot__cols{grid-template-columns:1fr 1fr}
  .sh-work__item,.sh-work__item--0,.sh-work__item--1{grid-column:1/-1}
  .sh-design__list>div,.sh-certs li{grid-template-columns:1fr;gap:.3em}
  .sh-labels__grid li,.sh-labels__grid li:nth-child(4),.sh-labels__grid li:nth-child(5){grid-column:1/-1}
}
@media (max-width:479px){
  .sh-hero__title{font-size:2.3em}
  .sh-hero__in{padding-top:10.6em;padding-bottom:2em}
  .sh-doors{width:100%;flex-flow:column;align-items:stretch}
  .sh-doors .sh-btn{width:100%}
  .sh-btn{padding-inline:1.1em;max-width:100%}
  .sh-banner{padding-inline:1em 2.6em;font-size:max(13.5px,.875em);justify-content:flex-start;text-align:left}
  .sh-banner__lead{display:block}
  .sh-hero__eyebrow{min-height:2.7em}
  .sh-h2{font-size:1.75em}
  .sh-stack__stage{padding-top:6.4em;padding-bottom:0}
  .sh-stack__panel{padding:2em 1em 1.2em;gap:.7em}
  .sh-stack__eyebrow{display:none}
  .sh-stack__line{font-size:1.4em;line-height:1.16}
  .sh-stack__who{font-size:max(13px,.85em)}
  .sh-stack__view{padding:.7em}
  .sh-stack__slide{gap:.7em}
  .sh-sectors__title{font-size:2.2em}
  .sh-sectors__list{grid-template-columns:1fr}
  .sh-sectors__list a{min-height:0;gap:.9em}
  .sh-member__name h3{font-size:1.7em}
  .sh-quote p{font-size:1.6em}
  .sh-stat__n{font-size:2.6em}
  .sh-stat{padding:1.6em .9em 1.4em}
  .sh-closing__title{font-size:2.3em}
  .sh-closing__in{padding-top:8em;padding-bottom:7em}
  .sh-phead__title{font-size:2.3em}
  .sh-foot__cols{grid-template-columns:1fr}
  .sh-phone strong{font-size:max(22px,1.8em)}
  .sh-form__h{font-size:1.55em}
  .sh-menu__sub--two{grid-template-columns:1fr}
  .sh-models{grid-template-columns:1fr 1fr}
}
`
