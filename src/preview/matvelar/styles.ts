const B = import.meta.env.BASE_URL

export const C = {
  black: '#000000',
  ink: '#0b0d0f',
  bar: '#1b1b1b',
  card: '#1f1f1f',
  line: '#2a2f34',
  slate: '#576a7c',
  steel: '#8a9aa8',
  signal: '#ffdd00',
  paper: '#f1f2f2',
}

/* The Deepbook system, re-aimed at Matvélar og umbúðir. Same fluid em root (the whole page scales
   as one object), same floating bar, line reveals, stack, counters and line field; the colour layer
   is their own: the slate of their logo carries the panels, and one signal yellow marks what moves
   and what to press. Fonts are Hubot Sans and Martian Mono (open licence), in place of the
   reference's paid faces. */
export const CSS = `
@font-face{font-family:'MvSans';src:url('${B}matvelar/fonts/hubot-400.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'MvSans';src:url('${B}matvelar/fonts/hubot-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'MvSans';src:url('${B}matvelar/fonts/hubot-600.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'MvMono';src:url('${B}matvelar/fonts/martian-400.woff2') format('woff2');font-weight:400;font-display:swap}

html:has(.mv), body:has(.mv){background-color:${C.black}}

.mv{
  --black:${C.black}; --ink:${C.ink}; --bar:${C.bar}; --card:${C.card}; --line:${C.line};
  --slate:${C.slate}; --steel:${C.steel}; --signal:${C.signal}; --paper:${C.paper};
  --white-60:rgba(255,255,255,.64); --white-12:rgba(255,255,255,.12);
  --root:clamp(13px,1.111vw,18.7px); --gut:calc(var(--root) * 3);
  --ease:cubic-bezier(.65,0,.35,1); --out:cubic-bezier(.19,1,.22,1);
  --t-p:max(15px,1.125em); --t-s:max(14px,.9375em); --t-m:max(12px,.78em);
  font-size:var(--root); background:var(--black); color:#fff;
  font-family:'MvSans',system-ui,-apple-system,'Segoe UI',sans-serif; font-weight:500;
  line-height:1.2; letter-spacing:-.01em; -webkit-font-smoothing:antialiased;
  overflow-x:clip; min-height:100svh;
}
@media (max-width:991px){.mv{--root:clamp(14.5px,1.919vw,19px);--gut:calc(var(--root) * 2)}}
@media (max-width:767px){.mv{--root:clamp(14px,2.909vw,20px);--gut:calc(var(--root) * 1.25)}}
@media (max-width:479px){.mv{--root:clamp(14px,4.267vw,19px)}}

.mv *,.mv *::before,.mv *::after{box-sizing:border-box}
.mv :where(h1,h2,h3,h4,p,ul,ol,figure,dl,dd){margin:0;padding:0}
.mv :where(ul,ol){list-style:none}
.mv :where(h1,h2,h3){font-weight:600;letter-spacing:-.03em}
.mv :where(p){font-weight:400}
.mv :where(a){color:inherit;text-decoration:none}
.mv :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mv :where(a,button,label,summary){touch-action:manipulation}
.mv :where(img,svg,canvas){display:block;max-width:100%}
.mv ::selection{background:var(--signal);color:#000}
.mv .mono{font-family:'MvMono',ui-monospace,monospace;font-weight:400;font-size:var(--t-m);letter-spacing:.02em;line-height:1.3;text-transform:uppercase}
.mv-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mv-skip{position:absolute;left:-9999px;top:0;z-index:100;background:#fff;color:#000;padding:.8em 1.2em;font-weight:600}
.mv-skip:focus{left:1rem;top:1rem}
.mv :focus-visible{outline:2px solid var(--signal);outline-offset:3px;border-radius:2px}
.mv-trial :focus-visible,.mv-foot :focus-visible{outline-color:#000}
.mv-wrap{width:100%;max-width:calc(var(--root) * 90);margin:0 auto;padding-left:var(--gut);padding-right:var(--gut)}
.mv [id]{scroll-margin-top:7em}

/* lines stay hidden until split (then revealed); a timeout and reduced motion show them anyway */
.mv [data-lines]{visibility:hidden}
.mv [data-lines].is-split,.mv-lines-fallback [data-lines]{visibility:visible}
.mv-mask{padding-block:.24em;margin-block:-.24em}

/* ── text roll on hover ──────────────────────────────────────── */
.roll{display:inline-block;flex:none;overflow:hidden;height:1.25em;line-height:1.25em;vertical-align:top;white-space:nowrap}
.roll>span{display:block;text-shadow:0 1.25em currentColor;transition:transform .2s var(--ease)}
@media (hover:hover){a:hover>.roll>span,button:hover>.roll>span,a:hover .roll>span,button:hover .roll>span{transform:translateY(-1.25em)}}

/* ── buttons ─────────────────────────────────────────────────── */
.mv-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6em;min-height:max(44px,3em);padding:.45em 1.5em;border-radius:3px;
  font-size:max(15px,1.0625em);font-weight:600;letter-spacing:-.02em;line-height:1.25;border:1px solid transparent;
  transition:background-color .25s,color .25s,border-color .25s;white-space:nowrap}
.mv-btn--signal{background:var(--signal);color:#000}
.mv-btn--white{background:#fff;color:#000}
.mv-btn--dark{background:#000;color:#fff}
.mv-btn--slate{background:var(--slate);color:#fff}
.mv-btn--ghost{border-color:rgba(255,255,255,.35);color:#fff}
.mv-btn--text{min-height:max(44px,2.75em);padding-inline:.4em;color:var(--white-60);text-decoration:underline;text-underline-offset:.25em;font-weight:500}
@media (hover:hover){
  .mv-btn--signal:hover{background:#fff}
  .mv-btn--white:hover{background:var(--signal)}
  .mv-btn--dark:hover{background:var(--slate)}
  .mv-btn--ghost:hover{background:#fff;color:#000}
  .mv-btn--text:hover{color:#fff}
}
.mv-arrow{width:1em;height:1em;flex:none;transition:transform .25s var(--ease)}
@media (hover:hover){a:hover>.mv-arrow,button:hover>.mv-arrow,.mv-btn:hover .mv-arrow,.mv-textlink:hover .mv-arrow{transform:translateX(.25em)}}
.mv-textlink{display:inline-flex;align-items:center;gap:.5em;min-height:max(44px,2.75em);font-weight:600;letter-spacing:-.02em;font-size:max(15px,1em);border-bottom:1px solid transparent}
.mv-link{text-decoration:underline;text-underline-offset:.2em;color:inherit;cursor:pointer;min-height:44px;display:inline-flex;align-items:center}
.mv-count{display:inline-grid;place-items:center;min-width:1.6em;height:1.6em;margin-left:.6em;padding:0 .35em;border-radius:3px;background:#000;color:#fff;font-size:.8em;font-weight:600}
.mv-btn--signal .mv-count{background:#000;color:#fff}

.mv-eyebrow{color:var(--signal);margin-bottom:1.6em}
.mv-eyebrow--ink{color:#000;opacity:.62}
.mv-h2{font-size:3.25em;line-height:1.04;max-width:16em}
.mv-h3{font-size:1.75em;line-height:1.1}
.mv-h1ish{font-size:4.5em;line-height:1;max-width:11em}
.mv-head{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:4em}
.mv-head__sub{text-wrap:pretty;margin-top:1.6em;font-size:var(--t-p);line-height:1.4;color:var(--white-60);max-width:36em}

/* ── banner, floating bar, menu ──────────────────────────────── */
.mv-top{position:fixed;top:0;left:0;right:0;z-index:40;padding-top:env(safe-area-inset-top);pointer-events:none}
.mv-top>*{pointer-events:auto}
.mv-banner{position:relative;display:flex;align-items:center;justify-content:center;min-height:max(44px,2.5em);padding:.45em 3em;background:var(--signal);color:#000;
  font-size:max(14px,.9375em);text-align:center;overflow:hidden;transition:max-height .35s var(--ease),min-height .35s var(--ease),padding .35s var(--ease),opacity .25s;max-height:6em}
.mv-banner p{font-weight:500;line-height:1.35}
.mv-banner a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;gap:.3em;min-height:44px}
.mv-banner b{font-weight:600}
.mv-banner__lead{font-weight:600}
.mv-banner__x{position:absolute;right:0;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;color:#000}
.mv-top.is-stuck .mv-banner{max-height:0;min-height:0;padding-block:0;opacity:0}
.mv-nav{display:flex;align-items:center;gap:1.6em;width:min(47em,calc(100% - 2 * var(--gut)));margin:.9em auto 0;padding:.5em .5em .5em 1em;background:var(--bar);border-radius:.5em;
  box-shadow:0 0 0 1px rgba(255,255,255,.04)}
.mv-nav__brand{display:flex;align-items:center;gap:.7em;font-size:max(16px,1.2em);font-weight:600;letter-spacing:-.03em;min-height:max(44px,2.75em);flex:none}
.mv-nav__sub{font-weight:400;color:var(--white-60)}
.mv-mark{width:1.7em;height:1.7em;color:var(--slate);flex:none}
.mv-nav__list{display:flex;align-items:center;gap:1.4em;margin-left:auto}
.mv-nav__list>li>a,.mv-nav__list>li>button{display:flex;align-items:center;gap:.4em;min-height:max(44px,2.75em);font-size:max(15px,1.0625em);font-weight:500}
.mv-nav__drop{position:relative}
.mv-caret{width:.65em;height:.4em;transition:transform .25s var(--ease)}
.mv-nav__drop button[aria-expanded="true"] .mv-caret{transform:rotate(180deg)}
.mv-drop{position:absolute;left:50%;top:calc(100% + 1.1em);transform:translateX(-30%);width:46em;max-width:calc(100vw - 2 * var(--gut));padding:1.6em;background:var(--bar);border-radius:.5em;box-shadow:0 1.5em 3em rgba(0,0,0,.5)}
.mv-drop[hidden]{display:none!important}
.mv-drop__cols{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6em}
.mv-drop__cols .mono{color:var(--steel);margin-bottom:.9em}
.mv-drop__cols li a{display:flex;align-items:center;min-height:44px;padding:.4em 0;font-size:max(15px,1.0625em)}
.mv-drop__cols li a:hover{color:var(--signal)}
.mv-drop__all{display:inline-flex;align-items:center;gap:.5em;margin-top:1.2em;padding-top:1.1em;border-top:1px solid var(--line);width:100%;font-weight:600;min-height:max(44px,2.75em)}
.mv-nav__tel{display:flex;flex-flow:column;font-weight:600;font-size:max(15px,1em);line-height:1.1;letter-spacing:-.02em;white-space:nowrap;min-height:max(44px,2.75em);justify-content:center}
.mv-nav__tel .mono{font-size:max(10.5px,.62em);color:var(--steel)}
.mv-nav__cta{min-height:max(44px,2.9em);padding-inline:1.1em}
.mv-burger{display:none;width:max(44px,2.9em);height:max(44px,2.9em);border-radius:3px;background:var(--white-12);flex-flow:column;justify-content:center;align-items:center;gap:.28em;margin-left:auto}
.mv-burger span{display:block;width:1.15em;height:2px;background:#fff;transition:transform .3s var(--ease),opacity .2s}
.mv-burger[aria-expanded="true"] span:nth-child(1){transform:translateY(.42em) rotate(45deg)}
.mv-burger[aria-expanded="true"] span:nth-child(2){opacity:0}
.mv-burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-.42em) rotate(-45deg)}
.mv-menu{position:fixed;inset:0;z-index:-1;background:#fff;color:#000;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding-top:calc(env(safe-area-inset-top) + 7.5em);pointer-events:auto}
.mv-menu[hidden]{display:none!important}
.mv-menu__in{padding:1em var(--gut) calc(2em + env(safe-area-inset-bottom));display:flex;flex-flow:column;gap:2em;min-height:100%}
.mv-menu__close{position:absolute;top:calc(env(safe-area-inset-top) + 1em);right:var(--gut);min-height:max(44px,2.75em);padding:0 1em;font-weight:600;display:none}
.mv-menu__list{display:flex;flex-flow:column;gap:1.4em}
.mv-menu__list>li>.mono{opacity:.55;margin-bottom:.5em}
.mv-menu__list a{display:block;font-size:max(22px,1.9em);font-weight:600;letter-spacing:-.03em;line-height:1.15;padding:.18em 0}
.mv-menu__sub a{font-size:max(19px,1.45em);font-weight:500}
.mv-menu__foot{display:flex;flex-flow:column;gap:.5em;margin-top:auto;font-size:max(16px,1.05em);padding-top:1.5em;border-top:1px solid rgba(0,0,0,.15)}
.mv-menu__foot a{font-weight:600;min-height:max(44px,2.75em);display:flex;align-items:center}
.mv-top.is-menu .mv-nav{background:#fff;color:#000}
.mv-top.is-menu .mv-nav__brand,.mv-top.is-menu .mv-nav__brand .mv-nav__sub{color:#000}
.mv-top.is-menu .mv-burger{background:rgba(0,0,0,.1)}
.mv-top.is-menu .mv-burger span{background:#000}
.mv-top.is-menu .mv-banner{background:#fff}

/* ── enquiry list: button and drawer ─────────────────────────── */
.mv-dock{position:fixed;z-index:30;left:1.2em;bottom:calc(1.2em + env(safe-area-inset-bottom));display:flex;align-items:center;gap:.8em;min-height:max(44px,3em);padding:.4em .9em;background:#fff;color:#000;border-radius:3px;box-shadow:0 .4em 1.6em rgba(0,0,0,.4);font-weight:600}
.mv-dock .mono{color:#000}
.mv-dock .mv-count{margin-left:0}
.mv-drawer{position:fixed;inset:0;z-index:70}
.mv-drawer__veil{position:absolute;inset:0;background:rgba(0,0,0,.6);cursor:default}
.mv-drawer__panel{position:absolute;right:0;top:0;bottom:0;width:min(30em,100%);background:var(--bar);padding:calc(1.4em + env(safe-area-inset-top)) 1.6em calc(1.4em + env(safe-area-inset-bottom));display:flex;flex-flow:column;gap:1.4em;overflow:auto;box-shadow:-1em 0 3em rgba(0,0,0,.5)}
.mv-drawer__head{display:flex;justify-content:space-between;align-items:center;gap:1em}
.mv-drawer__head h2{font-size:1.6em}
.mv-drawer__head button{min-height:max(44px,2.75em);padding:0 .8em;border:1px solid rgba(255,255,255,.3);border-radius:3px;font-weight:600}
.mv-drawer__list li{display:flex;justify-content:space-between;align-items:center;gap:1em;padding:.4em 0;border-bottom:1px solid var(--line);font-size:max(16px,1.1em);font-weight:500}
.mv-drawer__list button{min-height:max(44px,2.75em);color:var(--white-60);text-decoration:underline;text-underline-offset:.2em;font-size:max(14px,.875em)}
.mv-drawer__empty{color:var(--white-60);font-size:var(--t-p)}
.mv-drawer__foot{margin-top:auto;display:flex;flex-flow:column;align-items:flex-start;gap:1em}

/* ── hero ────────────────────────────────────────────────────── */
.mv-hero{position:relative;overflow:hidden;background:#000;min-height:100svh;display:flex}
.mv-hero__canvas{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.mv-hero__veil{position:absolute;inset:0;z-index:2;background-image:radial-gradient(ellipse 52% 30% at 50% 79%,rgba(0,0,0,.82),rgba(0,0,0,0) 100%),linear-gradient(#000,#0000 22% 60%,#000 99%);pointer-events:none}
.mv-hero__in{position:relative;z-index:3;display:flex;flex-flow:column;justify-content:flex-end;align-items:center;text-align:center;padding-top:9em;padding-bottom:3.75em;gap:1.5em;min-height:100svh}
.mv-hero__eyebrow{color:var(--steel);margin:0}
.mv-hero__title{font-size:4.5em;line-height:1;letter-spacing:-.035em;max-width:14em;text-wrap:balance}
.mv-hero__sub{font-size:max(16px,1.1875em);line-height:1.35;letter-spacing:-.02em;max-width:34em;color:rgba(255,255,255,.82);text-wrap:balance}
.mv-doors{display:flex;gap:.6em;flex-wrap:wrap;justify-content:center;margin-top:.8em}
.mv-doors .mv-btn{min-width:13em}
.mv-rule{position:relative;height:1px;margin:0 0 0;background:var(--line);width:100%}
.mv-rule__cube{position:absolute;top:50%;width:.75em;height:.75em;margin-top:-.375em;background:var(--signal)}
.mv-rule__cube:first-child{left:var(--gut)}
.mv-rule__cube:last-child{right:var(--gut)}

/* ── the pinned production line ──────────────────────────────── */
.mv-stack{position:relative;padding-top:3.75em}
.mv-stack__track{--unit:68svh;position:relative;height:calc(100svh + 5 * var(--unit));margin-top:4em}
.mv-stack__stage{position:sticky;top:0;display:flex;align-items:center;justify-content:center;height:100svh;padding-top:8.5em;padding-bottom:3em}
.mv-stack__wrap{width:100%}
.mv-stack__grid{display:grid;grid-template-columns:1fr 1fr;width:100%;height:min(43em,calc(100svh - 12em))}
.mv-stack__panel{position:relative;display:flex;flex-flow:column;justify-content:space-between;align-items:center;gap:2em;padding:3.4em 2em 2.4em;background:var(--slate);text-align:center}
.mv-plus{position:absolute;width:.75em;height:.75em;color:#d9d9d9}
.mv-plus svg{width:100%;height:100%}
.mv-plus--tl{top:1.25em;left:1.25em}.mv-plus--tr{top:1.25em;right:1.25em}.mv-plus--bl{bottom:1.25em;left:1.25em}.mv-plus--br{bottom:1.25em;right:1.25em}
.mv-stack__eyebrow{font-size:max(14px,.9375em);color:#e6ebef;letter-spacing:-.01em}
.mv-stack__heads{display:grid;width:100%;max-width:30em;align-content:center;flex:1}
.mv-stack__slide{grid-area:1/1;display:flex;flex-flow:column;align-items:center;justify-content:center;gap:1.2em;visibility:hidden;opacity:0}
.mv-stack__slide:first-child{visibility:visible;opacity:1}
.mv-stack__n{color:#fff;opacity:.85}
.mv-stack__line{font-size:2.5em;line-height:1.14;letter-spacing:-.03em;font-weight:600;color:#fff;text-wrap:balance}
.mv-stack__steps{font-size:var(--t-p);line-height:1.35;color:rgba(255,255,255,.88);max-width:24em}
.mv-stack__dots{display:flex;gap:.375em;width:fit-content;padding:.75em;border-radius:3px;background:rgba(255,255,255,.14);-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px)}
.mv-stack__dot{position:relative;flex:none;width:5px;height:5px;background:rgba(255,255,255,.35);overflow:hidden}
.mv-stack__dot.is-active{width:2.906em}
.mv-stack__fill{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left center}
.mv-stack__view{position:relative;display:flex;justify-content:center;align-items:center;padding:3.4em 2em;border:2px solid var(--line);overflow:hidden;background:#000}
.mv-stack__dotgrid{position:absolute;inset:0;background-image:radial-gradient(circle,#8a9aa8 1.2px,transparent 2px);background-size:6.6em 5.8em;background-position:center}
.mv-stack__card{position:relative;width:100%;max-width:30em;aspect-ratio:481/469;max-height:100%;background:#fff;padding:0}
.mv-stack__card svg{width:100%;height:100%}
.mv-steps{display:flex;flex-flow:column;gap:1em;padding-top:2.5em;padding-bottom:1em}
.mv-steps .mono{color:var(--steel)}
.mv-steps ul{display:flex;flex-wrap:wrap;gap:.6em}
.mv-steps a{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:3px;font-weight:600;font-size:max(15px,1em)}
.mv-steps a .mono{color:var(--signal)}
@media (hover:hover){.mv-steps a:hover{background:#fff;color:#000}}
.mv-stack--static{padding:6em 0}
.mv-stack__list{display:grid;gap:1.2em;margin-top:2.5em}
.mv-stack__list li{display:grid;grid-template-columns:1fr 1fr;min-height:24em}
.mv-stack--static .mv-stack__panel{justify-content:center;gap:1.4em}
.mv-stack--static .mv-stack__line{font-size:2em}

/* the isometric drawing: roles are coloured here, nowhere else.
   Machines are white and steel; everything edible is the signal yellow, fresh (p) or cooked (c). */
.mv-iso{width:100%;height:100%;overflow:hidden}
.mv-iso path{stroke:#0b0d0f;stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.mv-iso .t{fill:#fff}.mv-iso .l{fill:#e4e8eb}.mv-iso .r{fill:#c7ced3}.mv-iso .k{fill:#15181b}
.mv-iso .p{fill:var(--signal)}.mv-iso .pl{fill:#efc900}.mv-iso .pr{fill:#c9a500}
.mv-iso .c{fill:#f0a800}.mv-iso .cl{fill:#d18b00}.mv-iso .cr{fill:#a96d00}
.mv-iso .s{fill:#6b4400;stroke:none}
.mv-iso .n{fill:none}.mv-iso .w{fill:#fff;fill-opacity:.82}.mv-iso .f{fill:#fff;fill-opacity:.5}
.mv-iso .roll,.mv-iso .rod,.mv-iso .needle,.mv-iso .rack,.mv-iso .grain,.mv-iso .steam,.mv-iso .shine,.mv-iso .glare{fill:none}
.mv-iso path.roll{stroke:#a3adb5}
.mv-iso path.rack{stroke:#6a7681}
.mv-iso path.grain{stroke:#9a7f00;stroke-width:1}
.mv-iso path.steam{stroke:#9aa5ae;stroke-width:1.4}
.mv-iso path.shine{stroke:#fff;stroke-width:1.6}
.mv-iso path.glare{stroke:#fff;stroke-width:1.6;stroke-opacity:.9}
.mv-iso .st .t,.mv-iso .st .l,.mv-iso .st .r{transition:fill .5s var(--ease)}
.mv-iso .st[data-on="1"] .t{fill:#9fb0bf}.mv-iso .st[data-on="1"] .l{fill:#576a7c}.mv-iso .st[data-on="1"] .r{fill:#3f4e5b}
.mv-iso [data-form]{transition:opacity .35s,visibility 0s}
.mv-iso [data-form][data-on="0"]{visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.mv-iso--dark path{stroke:#6a7681}
.mv-iso--dark .t{fill:#1f1f1f}.mv-iso--dark .l{fill:#161616}.mv-iso--dark .r{fill:#101010}
.mv-iso--dark .p,.mv-iso--dark .pl,.mv-iso--dark .pr{stroke:#000}
.mv-iso--dark path.roll{stroke:#2a2f34}
.mv-iso--dark .guides line{stroke:#6a7681;stroke-width:1;stroke-dasharray:2 3;vector-effect:non-scaling-stroke}

/* ── who we serve ────────────────────────────────────────────── */
.mv-sectors{position:relative;padding:9em 0 6em;overflow:hidden}
.mv-sectors__top{display:flex;flex-flow:column;align-items:center;text-align:center;gap:1.4em;position:relative;z-index:2}
.mv-sectors__title{font-size:5.5em;line-height:1;letter-spacing:-.035em;color:#f3f3f3}
.mv-sectors__sub{font-size:var(--t-p);line-height:1.4;color:var(--white-60);max-width:30em}
.mv-sectors__art{width:100%;max-width:20em;margin:2em auto 0;position:relative;z-index:1}
.mv-sectors__list{display:grid;grid-template-columns:repeat(5,1fr);margin-top:2em;border-top:1px solid var(--line)}
.mv-sectors__list li{border-right:1px solid var(--line)}
.mv-sectors__list li:last-child{border-right:0}
.mv-sectors__list a{display:flex;flex-flow:column;gap:1.6em;height:100%;padding:1.6em 1.2em 1.4em;min-height:11em;transition:background-color .25s,color .25s}
.mv-sectors__list .mono{color:var(--signal)}
.mv-sectors__name{font-size:1.6em;line-height:1.1;font-weight:600;letter-spacing:-.03em;overflow-wrap:anywhere}
.mv-sectors__go{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:.8em;font-size:var(--t-s);color:var(--white-60);line-height:1.3}
@media (hover:hover){.mv-sectors__list a:hover{background:#fff;color:#000}.mv-sectors__list a:hover .mv-sectors__go{color:#000}.mv-sectors__list a:hover .mono{color:#000}}

/* ── suppliers ───────────────────────────────────────────────── */
.mv-suppliers{padding:7.5em 0 6em}
.mv-suppliers--page{padding-top:3em}
.mv-suppliers__grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25em}
.mv-suppliers__grid>div:last-child:nth-child(odd){grid-column:1/-1}
@media (min-width:992px){.mv-suppliers__grid>div:last-child:nth-child(odd) .mv-sup{flex-direction:row}.mv-suppliers__grid>div:last-child:nth-child(odd) .mv-sup__media{width:50%;flex:none;align-content:center}.mv-suppliers__grid>div:last-child:nth-child(odd) .mv-sup__body{justify-content:center}}
.mv-sup{display:flex;flex-flow:column;height:100%;background:var(--card);border-radius:3px;overflow:hidden}
.mv-sup__media{display:grid;gap:1px;background:var(--card)}
.mv-sup__media.is-strip{grid-template-columns:repeat(3,1fr)}
.mv-sup__body{display:flex;flex-flow:column;align-items:flex-start;gap:1.1em;padding:1.6em 1.6em 1.8em;flex:1}
.mv-sup__logo{display:flex;align-items:center;height:3.4em;padding:.5em .8em;background:#fff;border-radius:2px}
.mv-sup__logo img{height:100%;width:auto;max-width:12em;object-fit:contain}
.mv-sup__logo img[alt='GEA Group']{filter:grayscale(1) brightness(.45)}
.mv-sup__body .mono{color:var(--steel)}
.mv-sup__text{font-size:var(--t-p);line-height:1.42;color:rgba(255,255,255,.88);letter-spacing:-.015em}
.mv-sup__fam{display:flex;flex-wrap:wrap;gap:.5em}
.mv-sup__fam a{display:inline-flex;align-items:center;min-height:max(44px,2.5em);padding:.2em .8em;border:1px solid rgba(255,255,255,.28);border-radius:3px;font-size:max(14px,.9375em);font-weight:500}
@media (hover:hover){.mv-sup__fam a:hover{background:var(--signal);color:#000;border-color:var(--signal)}}
.mv-sup .mv-textlink{margin-top:auto}
.mv-suppliers__all{display:flex;justify-content:center;margin-top:3em}
.mv-tile{position:relative;margin:0;overflow:hidden;width:100%;background:#fff}
.mv-tile img{width:100%;height:100%;object-fit:contain}
.mv-tile--white{background:#fff}.mv-tile--grey{background:#e9eaea}.mv-tile--dark{background:#1c1c1c}
.mv-tile--dark img{object-fit:cover}
.mv-tile--white img,.mv-tile--grey img{padding:.8em}

/* ── about ───────────────────────────────────────────────────── */
.mv-about{padding:7.5em 0;border-top:1px solid var(--line)}
.mv-about__grid{display:grid;grid-template-columns:1fr 1fr;gap:4em;align-items:start}
.mv-about__title{position:sticky;top:8em}
.mv-about__text{display:flex;flex-flow:column;gap:1.6em}
.mv-about__text p{font-size:max(16px,1.1875em);line-height:1.42;letter-spacing:-.02em;color:rgba(255,255,255,.88)}

/* ── trial: the white band ───────────────────────────────────── */
.mv-trial{background:#fff;color:#000;padding:9em 0}
.mv-trial__grid{display:grid;grid-template-columns:1.1fr .9fr;gap:4em;align-items:center}
.mv-trial__copy{display:flex;flex-flow:column;align-items:flex-start;gap:1.6em}
.mv-trial__copy .mv-eyebrow{margin:0}
.mv-trial__sub{font-size:max(16px,1.1875em);line-height:1.42;letter-spacing:-.02em;color:rgba(0,0,0,.72);max-width:30em}
.mv-trial__act{margin-top:1em}
.mv-trial__art{display:flex;flex-flow:column;gap:.9em}
.mv-trial__art .mv-tile{border:1px solid rgba(0,0,0,.12)}
.mv-trial__art .mono{color:rgba(0,0,0,.6)}
.mv-trial .mv-tile--white img{padding:0;object-fit:cover}

/* ── service ─────────────────────────────────────────────────── */
.mv-service{padding:8em 0 6em}
.mv-service__top{display:flex;flex-flow:column;align-items:flex-start;margin-bottom:3.5em}
.mv-service__grid{display:grid;grid-template-columns:1fr 1.25fr;gap:1.25em}
.mv-service__card{display:flex;flex-flow:column;gap:1.2em;padding:2em 1.8em;background:rgba(255,255,255,.1);border-radius:3px}
.mv-service__card--flat{background:var(--card)}
.mv-service__card>.mono{color:var(--steel)}
.mv-phone{display:flex;flex-flow:column;gap:.35em;padding:1.1em 1.2em;background:#000;border:1px solid var(--line);border-radius:3px;min-height:5em;justify-content:center;transition:background-color .25s,color .25s,border-color .25s}
.mv-phone span{font-size:var(--t-s);color:var(--white-60);font-weight:400}
.mv-phone strong{font-size:max(24px,2.2em);letter-spacing:-.035em;font-weight:600;line-height:1}
@media (hover:hover){.mv-phone:hover{background:var(--signal);border-color:var(--signal);color:#000}.mv-phone:hover span{color:#000}}
.mv-service__note{font-size:var(--t-s);line-height:1.4;color:var(--white-60)}
.mv-service__act{margin-top:.6em}
.mv-ready{display:flex;flex-flow:column;gap:0}
.mv-ready li{display:grid;grid-template-columns:2.6em 1fr;gap:.6em;padding:1em 0;border-top:1px solid var(--line);align-items:start}
.mv-ready li:first-child{border-top:0;padding-top:0}
.mv-ready .mono{color:var(--signal);padding-top:.25em}
.mv-ready strong{font-size:max(16px,1.125em);font-weight:600;letter-spacing:-.02em}
.mv-ready p{margin-top:.35em;font-size:var(--t-s);line-height:1.4;color:var(--white-60)}

/* ── stats ───────────────────────────────────────────────────── */
.mv-statsec{padding:3em 0 8em}
.mv-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.mv-stat{display:flex;flex-flow:column;gap:1.2em;padding:2.4em 1.4em 2em;border-right:1px solid var(--line)}
.mv-stat:last-child{border-right:0}
.mv-stat__n{font-size:5.5em;line-height:1;font-weight:500;letter-spacing:-.04em;font-variant-numeric:tabular-nums;display:inline-block}
.mv-stat__l{color:var(--steel);min-height:max(44px,2.6em)}

/* ── closing line field ──────────────────────────────────────── */
.mv-closing{position:relative;display:flex;align-items:center;justify-content:center;min-height:100svh;background:#000;overflow:hidden}
.mv-closing__bg{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.mv-closing__in{position:relative;z-index:2;display:flex;flex-flow:column;align-items:center;text-align:center;gap:1.8em;padding-top:12em;padding-bottom:10em}
.mv-closing__eyebrow{color:var(--signal)}
.mv-closing__title{font-size:5em;line-height:.98;letter-spacing:-.035em;max-width:11em;text-wrap:balance}
.mv-closing__sub{font-size:var(--t-p);line-height:1.4;color:rgba(255,255,255,.8);max-width:28em}

/* ── footer ──────────────────────────────────────────────────── */
.mv-foot{background:var(--slate);color:#fff;padding:5em 0 2em}
.mv-foot__grid{display:grid;grid-template-columns:1fr 1.5fr;gap:3em;align-items:end}
.mv-foot__logo img{width:min(100%,19em);height:auto;display:block}
.mv-foot__cols{display:grid;grid-template-columns:repeat(3,1fr);gap:2em}
.mv-foot .mono{color:#dfe6ec;margin-bottom:1.1em}
.mv-foot li{font-size:max(15px,1.0625em);line-height:1.35;padding:.28em 0;font-weight:500;overflow-wrap:anywhere}
.mv-foot a{display:inline-flex;align-items:center;min-height:1.6em}
@media (max-width:991px){.mv-foot a{min-height:44px}.mv-foot li{padding:0}}
@media (hover:hover){.mv-foot a:hover{text-decoration:underline;text-underline-offset:.2em}}
.mv-foot__legal{margin-top:4em;padding-top:1.4em;border-top:1px solid rgba(255,255,255,.28);color:#e6ebef}

/* ── inner pages ─────────────────────────────────────────────── */
.mv-phead{padding:12em 0 3.5em}
.mv-crumbs{display:flex;gap:.2em;flex-wrap:wrap;color:var(--steel);margin-bottom:2.4em}
.mv-crumbs a{text-decoration:underline;text-underline-offset:.2em;display:inline-flex;align-items:center;min-height:44px}
.mv-crumbs>span{display:inline-flex;align-items:center}
.mv-crumbs>span:not(:last-child)::after{content:'/';margin:0 .7em;opacity:.6}
.mv-phead .mv-eyebrow{margin-bottom:1.2em}
.mv-phead__title{font-size:5em;line-height:1;letter-spacing:-.035em;max-width:11em;overflow-wrap:normal}
.mv-phead__sub{text-wrap:pretty;margin-top:1.4em;font-size:max(16px,1.1875em);line-height:1.4;color:var(--white-60);max-width:34em}
.mv-phead__act{display:flex;flex-wrap:wrap;gap:.8em 1.4em;align-items:center;margin-top:2.2em}
.mv-explore{padding:1.5em 0 3em}
.mv-steptabs{display:flex;flex-wrap:wrap;gap:.5em;margin-bottom:2em}
.mv-steptabs button{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,3em);padding:.4em 1em;border:1px solid var(--line);border-radius:3px;font-weight:600;font-size:max(15px,1em)}
.mv-steptabs button .mono{color:var(--signal)}
.mv-steptabs button.is-on{background:#fff;color:#000;border-color:#fff}
.mv-steptabs button.is-on .mono{color:#000}
@media (hover:hover){.mv-steptabs button:not(.is-on):hover{border-color:var(--signal)}}
.mv-stagecard{display:grid;grid-template-columns:1.2fr .8fr;gap:0;margin-bottom:1.6em;background:var(--slate);border-radius:3px;overflow:hidden}
.mv-stagecard>div:first-child{padding:2.2em 2em;display:flex;flex-flow:column;gap:1em;justify-content:center}
.mv-stagecard__line{font-size:2.2em;line-height:1.12;font-weight:600;letter-spacing:-.03em}
.mv-stagecard__steps{font-size:var(--t-p);color:rgba(255,255,255,.9)}
.mv-stagecard__art{background:#fff;aspect-ratio:481/469;max-height:22em;justify-self:end;width:100%}
.mv-famgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25em}
.mv-fam{display:flex;flex-flow:column;background:var(--card);border-radius:3px;overflow:hidden}
.mv-fam__media{display:block}
.mv-fam__media .mv-tile{aspect-ratio:3/2!important}
.mv-fam__art svg{width:100%;height:100%}
.mv-fam__body{display:flex;flex-flow:column;gap:.8em;padding:1.4em 1.4em 1.5em;flex:1}
.mv-fam__stage{color:var(--signal)}
.mv-fam h3{font-size:1.75em;line-height:1.1}
.mv-fam h3 a{display:inline-flex;align-items:center;min-height:44px}
.mv-fam__blurb{font-size:var(--t-s);line-height:1.4;color:rgba(255,255,255,.82)}
.mv-fam__sup{color:var(--steel)}
.mv-fam__act{display:flex;flex-wrap:wrap;gap:.4em 1.2em;align-items:center;margin-top:auto;padding-top:.8em}
.mv-add{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,2.75em);font-weight:600;font-size:max(15px,1em);letter-spacing:-.02em;text-align:left}
.mv-add__box{display:inline-grid;place-items:center;width:1.55em;height:1.55em;flex:none;border:1px solid rgba(255,255,255,.4);border-radius:2px;font-size:1em;line-height:1}
.mv-add.is-on .mv-add__box{background:var(--signal);border-color:var(--signal);color:#000}
@media (hover:hover){.mv-add:hover .mv-add__box{border-color:var(--signal)}}
.mv-empty{padding:2em 0;color:var(--white-60);font-size:var(--t-p)}
.mv-also{margin-top:4em;padding-top:2.4em;border-top:1px solid var(--line)}
.mv-also__sub{margin:.9em 0 1.4em;color:var(--white-60);font-size:var(--t-p);line-height:1.4;max-width:36em}
.mv-also__list{display:flex;flex-wrap:wrap;gap:.5em}
.mv-chip--btn{display:inline-flex;align-items:center;gap:.7em;min-height:max(44px,2.9em);padding:.3em 1em .3em .6em;border:1px solid var(--line);border-radius:3px;font-weight:600;font-size:max(15px,1em)}
.mv-chip--btn .mono{color:var(--steel);text-transform:none;font-size:max(11.5px,.72em)}
.mv-chip--btn.is-on{border-color:var(--signal)}
.mv-fampage{padding:2em 0 5em}
.mv-fampage__grid{display:grid;grid-template-columns:1.05fr .95fr;gap:3.5em;align-items:start}
.mv-fampage__media{display:flex;flex-flow:column;gap:1px;position:sticky;top:8em}
.mv-fampage__art{aspect-ratio:481/469!important}
.mv-fampage__more{display:grid;grid-template-columns:1fr 1fr;gap:1px}
.mv-fampage__copy{display:flex;flex-flow:column;gap:2em}
.mv-fampage__sup{display:flex;flex-flow:column;align-items:flex-start;gap:1.1em;padding-top:1.6em;border-top:1px solid var(--line)}
.mv-fampage__sup p{font-size:max(16px,1.1875em);line-height:1.42;letter-spacing:-.02em;color:rgba(255,255,255,.9)}
.mv-where{padding:6em 0;background:var(--slate)}
.mv-where__grid{display:grid;grid-template-columns:1fr 1fr;gap:3em;align-items:center}
.mv-where .mv-eyebrow{color:#fff;opacity:.85}
.mv-where .mv-head__sub{color:rgba(255,255,255,.92)}
.mv-where__steps{margin:1.4em 0 1.6em;font-size:var(--t-p);color:rgba(255,255,255,.92)}
.mv-where .mv-textlink{color:#fff;border-bottom-color:#fff}
.mv-where__art{background:#fff;aspect-ratio:481/469;max-width:30em;width:100%;justify-self:end}
.mv-prep{padding:6em 0}
.mv-prep__grid{display:grid;grid-template-columns:1fr 1fr;gap:3em;align-items:start}
.mv-pn{display:grid;grid-template-columns:1fr 1fr;gap:1.25em;padding-top:1em;padding-bottom:6em}
.mv-pn a{display:flex;flex-flow:column;gap:.7em;padding:1.4em 1.4em 1.5em;border:1px solid var(--line);border-radius:3px;font-size:1.6em;font-weight:600;letter-spacing:-.03em;line-height:1.1;transition:background-color .25s,color .25s}
.mv-pn a:last-child{text-align:right;align-items:flex-end}
.mv-pn .mono{color:var(--steel)}
@media (hover:hover){.mv-pn a:hover{background:#fff;color:#000}.mv-pn a:hover .mono{color:#000}}
.mv-svc,.mv-req{padding:1em 0 7em}
.mv-svc__grid,.mv-req__grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:2.4em;align-items:start}
.mv-req__grid{grid-template-columns:1.3fr .7fr}
.mv-req__form{order:1}.mv-req__side{order:2}
.mv-svc__side,.mv-req__side{display:flex;flex-flow:column;gap:1.25em;position:sticky;top:8em}

/* ── the request form ────────────────────────────────────────── */
.mv-form{display:flex;flex-flow:column;gap:1.5em;padding:2.2em;background:var(--card);border-radius:3px}
.mv-form__step{color:var(--steel)}
.mv-form__h{font-size:2.2em;line-height:1.08}
.mv-form__lead{font-size:var(--t-p);line-height:1.4;color:var(--white-60)}
.mv-form__note{font-size:var(--t-s);line-height:1.45;color:var(--white-60)}
.mv-form__note a,.mv-urgent a{text-decoration:underline;text-underline-offset:.2em;font-weight:600;color:#fff}
.mv-form__proto{font-size:var(--t-s);line-height:1.45;color:var(--steel);padding:1em 1.1em;border:1px dashed var(--line);border-radius:3px}
.mv-form__actions{display:flex;flex-wrap:wrap;gap:.8em 1em;align-items:center}
.mv-opts{display:grid;gap:.7em}
.mv-opt{position:relative;display:flex;flex-flow:column;gap:.35em;padding:1.2em 1.3em;border:1px solid var(--line);border-radius:3px;cursor:pointer;min-height:4.5em;background:#000;transition:border-color .2s,background-color .2s}
.mv-opt input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0}
.mv-opt:has(input:focus-visible){outline:2px solid var(--signal);outline-offset:3px}
.mv-opt__t{font-size:max(18px,1.45em);font-weight:600;letter-spacing:-.03em}
.mv-opt__s{font-size:var(--t-s);color:var(--white-60);line-height:1.35}
@media (hover:hover){.mv-opt:hover{border-color:var(--signal)}}
.mv-opt.is-on{border-color:var(--signal)}
.mv-grid2{display:grid;grid-template-columns:1fr 1fr;gap:1.1em}
.mv-fld{display:flex;flex-flow:column;gap:.55em;min-width:0;border:0;padding:0;margin:0}
.mv-fld>label:not(.mv-chip):not(.mv-filebtn),.mv-lbl,.mv-fld>legend{font-size:max(15px,1em);font-weight:600;letter-spacing:-.015em;padding:0}
.mv-fld input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),.mv-fld select,.mv-fld textarea{
  width:100%;min-height:max(44px,3.1em);padding:.7em .9em;background:#000;color:#fff;border:1px solid #3a4046;border-radius:3px;
  font:inherit;font-size:max(16px,1em);font-weight:400;letter-spacing:-.01em;line-height:1.3;-webkit-appearance:none;appearance:none;border-radius:3px}
.mv-fld select{background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 1.3em) 55%,calc(100% - .95em) 55%;background-size:.4em .4em;background-repeat:no-repeat;padding-right:2.4em}
.mv-fld textarea{resize:vertical;min-height:6em}
.mv-fld input:focus-visible,.mv-fld select:focus-visible,.mv-fld textarea:focus-visible{outline:2px solid var(--signal);outline-offset:1px;border-color:var(--signal)}
.mv-fld input::placeholder,.mv-fld textarea::placeholder{color:#7d8791}
.mv-fld [aria-invalid="true"]{border-color:#ff8f7f}
.mv-err{color:#ff9d8f;font-size:var(--t-s);line-height:1.35}
.mv-errsum{padding:1em 1.2em;border:1px solid #ff8f7f;border-radius:3px;background:rgba(255,120,100,.09);font-size:var(--t-s)}
.mv-errsum strong{display:block;margin-bottom:.4em;font-size:max(15px,1em)}
.mv-errsum li{padding:.15em 0}
.mv-errsum a{text-decoration:underline;text-underline-offset:.2em}
.mv-chips{flex-flow:row wrap;gap:.5em}
.mv-chips>legend{width:100%;margin-bottom:.15em}
.mv-chip{position:relative;display:inline-flex;align-items:center;min-height:max(44px,2.9em);padding:.3em 1em;border:1px solid #3a4046;border-radius:3px;font-weight:500;font-size:max(15px,1em);cursor:pointer;transition:background-color .2s,color .2s,border-color .2s}
.mv-chip input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.mv-chip:has(input:focus-visible){outline:2px solid var(--signal);outline-offset:3px}
.mv-chip.is-on{background:var(--signal);border-color:var(--signal);color:#000;font-weight:600}
@media (hover:hover){.mv-chip:not(.is-on):not(.mv-chip--btn):hover{border-color:var(--signal)}}
.mv-check{position:relative;display:flex;gap:.8em;align-items:center;min-height:max(44px,3em);padding:.5em 1em;border:1px solid #3a4046;border-radius:3px;cursor:pointer;font-weight:500;font-size:max(15px,1em);line-height:1.3}
.mv-check input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.mv-check::before{content:'';flex:none;width:1.3em;height:1.3em;border:1px solid #6a7681;border-radius:2px;background:#000}
.mv-check.is-on{border-color:var(--signal)}
.mv-check.is-on::before{background:var(--signal) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.2 6.3 5 9l4.8-5.4' fill='none' stroke='%23000' stroke-width='1.8'/%3E%3C/svg%3E") center/80% no-repeat;border-color:var(--signal)}
.mv-check:has(input:focus-visible){outline:2px solid var(--signal);outline-offset:3px}
.mv-urgent{padding:1em 1.1em;border-left:3px solid var(--signal);background:rgba(255,120,100,.09);font-size:var(--t-s);line-height:1.45}
.mv-sect{display:flex;flex-flow:column;gap:.9em;padding-top:1.2em;border-top:1px solid var(--line)}
.mv-tags{display:flex;flex-wrap:wrap;gap:.5em}
.mv-tags li{display:inline-flex;align-items:center;gap:.6em;min-height:max(44px,2.6em);padding:.2em .3em .2em .9em;border:1px solid #3a4046;border-radius:3px;font-size:max(15px,1em);font-weight:500}
.mv-tags li .mono{color:var(--steel);text-transform:none}
.mv-tags button{display:grid;place-items:center;width:44px;height:44px;margin-block:-.4em;font-size:1.2em;color:var(--white-60)}
.mv-files{gap:.7em}
.mv-filebtn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:fit-content;min-height:max(44px,3em);padding:0 1.4em;border:1px solid rgba(255,255,255,.4);border-radius:3px;font-weight:600;cursor:pointer}
.mv-filebtn input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;font-size:16px}
.mv-filebtn:has(input:focus-visible){outline:2px solid var(--signal);outline-offset:3px}
.mv-brief{width:100%;padding:1.1em 1.2em;background:#000;color:#fff;border:1px solid #3a4046;border-radius:3px;font-family:'MvMono',ui-monospace,monospace;font-size:max(13px,.8125em);line-height:1.6;resize:vertical}

/* ── reduced motion: nothing moves that is not needed ────────── */
@media (prefers-reduced-motion:reduce){
  .mv *,.mv *::before,.mv *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;scroll-behavior:auto!important}
  .mv [data-lines]{visibility:visible!important}
  .roll>span{transform:none!important}
}

/* ── tablet and phone ────────────────────────────────────────── */
@media (max-width:991px){
  .mv-dock{left:.9em;bottom:calc(5.6em + env(safe-area-inset-bottom))}
  .mv-nav__list,.mv-nav__tel,.mv-nav__cta{display:none}
  .mv-burger{display:flex}
  .mv-nav{width:calc(100% - 2 * var(--gut));justify-content:space-between;padding-right:.5em}
  .mv-menu__close{display:none}
  .mv-banner__more{display:none}
  .mv-hero__title{font-size:3.6em}
  .mv-h2{font-size:2.7em}
  .mv-stack__stage{padding-top:7.5em}
  .mv-stack__grid{grid-template-columns:1fr;grid-template-rows:auto auto;height:auto;max-height:none}
  .mv-stack__panel{padding:2.6em 1.4em 1.8em;gap:1.4em}
  .mv-stack__line{font-size:2.1em}
  .mv-stack__view{padding:1em 2em;min-height:0}
  .mv-stack__card{height:auto;width:100%;max-width:26em;aspect-ratio:481/469}
  .mv-sectors__title{font-size:3.8em}
  .mv-sectors__list{grid-template-columns:1fr 1fr}
  .mv-sectors__list li{border-bottom:1px solid var(--line)}
  .mv-sectors__list li:nth-child(2n){border-right:0}
  .mv-suppliers__grid,.mv-service__grid,.mv-trial__grid,.mv-about__grid,.mv-fampage__grid,.mv-where__grid,.mv-prep__grid,.mv-svc__grid,.mv-req__grid{grid-template-columns:1fr}
  .mv-about__title,.mv-fampage__media,.mv-svc__side,.mv-req__side{position:static}
  .mv-trial{padding:6em 0}
  .mv-h1ish{font-size:3.2em}
  .mv-stat__n{font-size:4em}
  .mv-stats{grid-template-columns:1fr 1fr}
  .mv-stat:nth-child(2n){border-right:0}
  .mv-stat:nth-child(-n+2){border-bottom:1px solid var(--line)}
  .mv-closing__title{font-size:3.6em}
  .mv-phead{padding-top:9.5em}
  .mv-phead__title{font-size:3.6em}
  .mv-famgrid{grid-template-columns:1fr 1fr}
  .mv-stagecard{grid-template-columns:1fr}
  .mv-stagecard__art{justify-self:stretch;max-height:none;max-width:24em;margin:0 auto 1.4em}
  .mv-foot__grid{grid-template-columns:1fr}
  .mv-foot__logo img{width:12em}
  .mv-where__art{justify-self:start}
}
@media (max-width:767px){
  .mv-hero__title{font-size:3em}
  .mv-h2{font-size:2.3em}
  .mv-sectors{padding:6em 0 4em}
  .mv-sectors__title{font-size:3em}
  .mv-suppliers{padding:5em 0 4em}
  .mv-about,.mv-service{padding-block:5em}
  .mv-famgrid{grid-template-columns:1fr}
  .mv-stack__track{--unit:58svh}
  .mv-stack__stage{padding-bottom:1.2em}
  .mv-form{padding:1.4em}
  .mv-grid2{grid-template-columns:1fr}
  .mv-stack__list li{grid-template-columns:1fr}
  .mv-pn{grid-template-columns:1fr}
  .mv-pn a:last-child{text-align:left;align-items:flex-start}
  .mv-foot__cols{grid-template-columns:1fr 1fr}
}
@media (max-width:479px){
  .mv-hero__title{font-size:2.35em;max-width:9em}
  .mv-hero__in{padding-bottom:2.4em}
  .mv-doors{width:100%;flex-flow:column;align-items:stretch}
  .mv-doors .mv-btn{width:100%}
  .mv-btn{padding-inline:1.1em;max-width:100%}
  .mv-banner{padding-inline:2.6em;font-size:max(13.5px,.875em);justify-content:flex-start;text-align:left}
  .mv-h2{font-size:2em}
  .mv-nav__sub{display:none}
  .mv-stack__stage{padding-top:6.4em;padding-bottom:0}
  
  .mv-stack__panel{padding:2.2em 1em 1.3em;gap:.8em}
  .mv-stack__eyebrow{display:none}
  .mv-stack__line{font-size:1.65em;line-height:1.15}
  .mv-stack__steps{font-size:max(14px,.9em)}
  .mv-stack__view{padding:.7em .7em}
  .mv-stack__slide{gap:.7em}
  .mv-sectors__title{font-size:2.5em}
  .mv-sectors__list{grid-template-columns:1fr}
  .mv-sectors__list li{border-right:0}
  .mv-sectors__list a{min-height:0;gap:.9em}
  .mv-sectors__name{font-size:1.5em}
  .mv-stat__n{font-size:3em}
  .mv-stat{padding:1.6em .9em 1.4em}
  .mv-closing__title{font-size:2.5em}
  .mv-closing__in{padding-top:9em;padding-bottom:8em}
  .mv-phead__title{font-size:2.55em}
  .mv-foot__cols{grid-template-columns:1fr}
  .mv-phone strong{font-size:max(24px,2em)}
  .mv-form__h{font-size:1.7em}

  .mv-fampage__more{grid-template-columns:1fr 1fr}
  .mv-sup__media.is-strip{grid-template-columns:repeat(3,1fr)}
  .mv-stats{grid-template-columns:1fr 1fr}
  .mv-stat__l{min-height:3.4em}
}
`
