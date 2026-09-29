/* Scoped stylesheet for /preview/hudflur ("Blek á húð", 2026-09-29).
   Look: the SAINTS board (anydesign: _docs/hudflur-harvest-2026-09-29/design.md). Paper and ink only,
   greys live inside the photographs; a heavy sans for the name, blackletter for the trade.
   Behaviour: the live-up.co.jp clean-room rebuild (sndr-teardowns PR #3, css/main.css): the expo curve
   .16,1,.3,1 on every mask, the in-out curve .87,0,.13,1 on the shutter and masthead drop, 108% masked
   lines, the difference-blend masthead, the clip-path drawer, the works veil with per-line masked labels,
   the width-fitted e-mail. Every rest state below is the visible state; motion.ts only adds the travel.
   Everything hangs off .hf-root; keyframes are prefixed hf-. */

export function hudflurCss(B: string): string {
  const f = (p: string) => `${B}fonts/${p}`
  return `
@font-face{font-family:"HF Gotisch";src:url(${f('hudflur/GrenzeGotisch-latin.woff2')}) format("woff2");font-weight:400 900;font-style:normal;font-display:swap}
@font-face{font-family:"HF Cabinet";src:url(${f('cabinet-grotesk/CabinetGrotesk-Variable.woff2')}) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:"HF General";src:url(${f('general-sans/GeneralSans-Regular.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"HF General";src:url(${f('general-sans/GeneralSans-Medium.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:swap}

html,body{background-color:#f4f4f2}
html{color-scheme:light;scroll-padding-top:72px}

.hf-root{
  --paper:#f4f4f2;--paper-2:#e9e9e6;--ink:#0e0e0e;--ink-2:#2e2e2e;--mute:#5f5f5f;--hair:#d6d6d2;
  --night:#0e0e0e;--night-mute:#a3a3a0;--night-hair:#2c2c2c;
  --f-sans:"HF Cabinet",ui-sans-serif,system-ui,sans-serif;--f-body:"HF General",ui-sans-serif,system-ui,sans-serif;--f-black:"HF Gotisch",serif;
  --ease-expo:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.87,0,.13,1);
  --gutter:max(20px,2.34vw);--gap:max(8px,1.1vw);--pad:max(88px,9.38vw);
  --fs-body:clamp(16px,1.15vw,19px);--fs-small:clamp(13px,.86vw,15px);--fs-ui:clamp(12px,.8vw,14px);
  --fs-title:clamp(64px,10.78vw,200px);
  background:var(--paper);color:var(--ink);font-family:var(--f-body);font-size:var(--fs-body);line-height:1.55;
  -webkit-font-smoothing:antialiased;overflow-x:clip;
}
.hf-root *,.hf-root ::before,.hf-root ::after{box-sizing:border-box}
.hf-root ::selection{background:var(--ink);color:var(--paper)}
.hf-root img{display:block;max-width:100%}
:where(.hf-root) a{color:inherit}
.hf-root :focus-visible{outline:2px solid currentColor;outline-offset:3px}
.hf-root button,.hf-root a{touch-action:manipulation}
.hf-root p{text-wrap:pretty}
.hf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.hf-skip{position:fixed;left:12px;top:-60px;z-index:300;background:var(--ink);color:var(--paper);padding:10px 14px;font:600 14px var(--f-body);text-decoration:none}
.hf-skip:focus{top:12px}

/* ---------- masked line: the live-up mask, with room above for Á É Í Ó Ú Ð ---------- */
.hf-line{display:block;overflow:hidden;padding-top:.14em;margin-top:-.14em;padding-bottom:.04em}
.hf-line > span{display:block;will-change:transform}

/* ---------- intro: black veil, their eagle, a shutter that wipes up (live-up M2) ---------- */
.hf-intro{position:fixed;inset:0;z-index:400;pointer-events:auto}
.hf-intro__veil,.hf-intro__shutter{position:absolute;inset:0;background:#000}
.hf-intro__veil{z-index:1;transition:opacity .7s ease}
.hf-intro__shutter{z-index:2;transition:transform 1.5s var(--ease-io) .35s;will-change:transform}
.hf-intro__mark{position:fixed;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%);display:grid;justify-items:center;gap:14px;opacity:0;transition:opacity .65s cubic-bezier(.25,.46,.45,.94) .06s}
.hf-intro__mark img{width:clamp(64px,7vw,104px);height:auto}
.hf-intro__mark span{font:400 clamp(22px,2.2vw,34px)/1 var(--f-black);color:#e9e9e6}
.hf-intro.is-lit .hf-intro__mark{opacity:1}
.hf-intro.is-leaving .hf-intro__veil{opacity:0}
.hf-intro.is-leaving .hf-intro__shutter{transform:translate3d(0,-100%,0)}
.hf-intro.is-leaving .hf-intro__mark{opacity:0;transition:opacity 1.2s var(--ease-io) .2s}

/* ---------- masthead: fixed, difference blend so it reads on paper, ink and photos (live-up M3) ---------- */
.hf-head{position:fixed;inset:0 0 auto 0;z-index:200;display:flex;align-items:center;justify-content:space-between;gap:24px;
  padding:calc(env(safe-area-inset-top) + 22px) var(--gutter) 22px;color:#fff;mix-blend-mode:difference;
  animation:hf-drop 2.3s var(--ease-io) .2s both}
.hf-root.is-quick .hf-head{animation:hf-drop .7s var(--ease-expo) 0s both}
.hf-head.is-condensed{padding-top:calc(env(safe-area-inset-top) + 14px);padding-bottom:14px}
.hf-head.is-menu{mix-blend-mode:normal;z-index:320}
@keyframes hf-drop{from{transform:translateY(-110%)}to{transform:none}}
.hf-brand{display:flex;align-items:baseline;gap:.45em;text-decoration:none;white-space:nowrap}
.hf-brand__black{font:400 clamp(17px,1.35vw,22px)/1 var(--f-black)}
.hf-brand__sans{font:800 clamp(15px,1.15vw,19px)/1 var(--f-sans);letter-spacing:.02em;text-transform:uppercase}
.hf-nav{display:flex;align-items:center;gap:clamp(18px,2.2vw,40px)}
.hf-nav a{position:relative;font:700 var(--fs-ui)/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;text-decoration:none;padding:6px 0;transition:opacity .3s}
.hf-nav a::before{content:"";position:absolute;left:-12px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:currentColor;opacity:0;transition:opacity .3s}
.hf-nav a.is-current::before{opacity:1}
@media (hover:hover) and (pointer:fine){.hf-nav:hover a{opacity:.55}.hf-nav a:hover{opacity:1}}
.hf-nav a.hf-nav__book{border-bottom:1.5px solid currentColor}
.hf-burger{display:none;position:relative;min-width:44px;height:44px;margin-right:-6px;padding:0 6px;border:0;background:none;color:inherit;cursor:pointer;perspective:200px}
.hf-burger__face{grid-area:1 / 1;display:grid;place-items:center end;font:700 12px/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;backface-visibility:hidden;transition:transform .62s var(--ease-expo),opacity .62s var(--ease-expo)}
.hf-burger__face--close{opacity:0;transform:rotateX(-90deg)}
.hf-head.is-menu .hf-burger__face--open{opacity:0;transform:rotateX(90deg)}
.hf-head.is-menu .hf-burger__face--close{opacity:1;transform:none}

/* drawer: black panel rolled down with clip-path (live-up G8-G11) */
.hf-drawer{position:fixed;inset:0;z-index:310;display:grid;align-content:center;gap:28px;padding:96px var(--gutter) 40px;background:#0b0b0b;color:#f4f4f2;clip-path:inset(0 0 100% 0);transition:clip-path .45s var(--ease-expo);overflow-y:auto;overscroll-behavior:contain}
.hf-drawer[hidden]{display:none}
.hf-drawer.is-open{clip-path:inset(0);transition-duration:.8s}
.hf-drawer.is-open .hf-drawer__links a{transform:none;opacity:1}
.hf-drawer.is-open .hf-drawer__links a:nth-child(1){transition-delay:.12s}.hf-drawer.is-open .hf-drawer__links a:nth-child(2){transition-delay:.18s}.hf-drawer.is-open .hf-drawer__links a:nth-child(3){transition-delay:.24s}.hf-drawer.is-open .hf-drawer__links a:nth-child(4){transition-delay:.3s}
.hf-drawer__links{display:grid;gap:6px}
.hf-drawer__links a{transform:translateY(40px);opacity:0;transition:transform .7s var(--ease-expo),opacity .5s var(--ease-expo);font:800 clamp(40px,11vw,64px)/1.05 var(--f-sans);text-transform:uppercase;text-decoration:none;letter-spacing:-.01em}
.hf-drawer__meta{display:grid;gap:6px;font-size:16px;color:#bdbdb9}
.hf-drawer__meta a{text-decoration:none}

/* ---------- hero: the SAINTS lockup, the name set as the poster ---------- */
.hf-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:1fr auto;padding:calc(env(safe-area-inset-top) + 88px) var(--gutter) max(28px,2.4vw);background:var(--paper)}
.hf-hero__lockup{align-self:center;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center}
.hf-hero__eagle{width:clamp(56px,5.6vw,96px);height:auto;margin-bottom:clamp(14px,1.6vw,28px);filter:grayscale(1) contrast(1.15) brightness(.55)}
.hf-hero__name{margin:0;font:800 var(--hero-size,14.2vw)/.86 var(--f-sans);letter-spacing:-.03em;text-transform:uppercase;white-space:nowrap}
.hf-hero__black{margin-top:clamp(6px,.8vw,14px);font:400 clamp(30px,4.4vw,84px)/1 var(--f-black);letter-spacing:.01em}
.hf-hero__foot{display:flex;align-items:flex-end;justify-content:space-between;gap:20px 32px;flex-wrap:wrap}
.hf-hero__line{margin:0;max-width:34ch;font:800 var(--fs-ui)/1.5 var(--f-sans);letter-spacing:.07em;text-transform:uppercase}
.hf-hero__ctas{display:flex;gap:10px;flex-wrap:wrap}
.hf-rise{display:block;animation:hf-rise 1.3s var(--ease-expo) 1.25s both}
.hf-rise--2{animation-delay:1.36s}.hf-rise--3{animation-delay:1.5s}.hf-rise--4{animation-delay:1.62s}
.hf-root.is-quick .hf-rise{animation-delay:.1s}.hf-root.is-quick .hf-rise--2{animation-delay:.18s}.hf-root.is-quick .hf-rise--3{animation-delay:.3s}.hf-root.is-quick .hf-rise--4{animation-delay:.4s}
@keyframes hf-rise{from{transform:translate3d(0,108%,0)}to{transform:none}}
.hf-fadein{animation:hf-fadein 1.2s var(--ease-expo) 1.5s both}
.hf-root.is-quick .hf-fadein{animation-delay:.35s}
@keyframes hf-fadein{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}

/* buttons: square, ink, with the live-up label roll */
.hf-btn{position:relative;display:inline-flex;align-items:center;gap:12px;min-height:48px;padding:0 22px;border:1.5px solid var(--ink);background:var(--ink);color:var(--paper);
  font:800 var(--fs-ui)/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;text-decoration:none;white-space:nowrap;cursor:pointer;transition:background .2s var(--ease-expo),color .2s var(--ease-expo),transform .12s ease-out}
.hf-btn--ghost{background:transparent;color:var(--ink)}
.hf-btn__roll{display:block;overflow:hidden;height:1.1em;line-height:1.1}
.hf-btn__roll span{display:block;transition:transform .3s var(--ease-expo)}
.hf-btn:active{transform:scale(.97)}
.hf-btn__arrow{width:16px;height:16px;flex:none;transition:transform .3s var(--ease-expo)}
@media (hover:hover) and (pointer:fine){
  .hf-btn:hover .hf-btn__roll span{transform:translateY(-100%)}
  .hf-btn:hover .hf-btn__arrow{transform:translateX(3px)}
  .hf-btn:hover{background:transparent;color:var(--ink)}
  .hf-btn--ghost:hover{background:var(--ink);color:var(--paper)}
}
.hf-night .hf-btn{border-color:var(--paper);background:var(--paper);color:var(--ink)}
@media (hover:hover){.hf-night .hf-btn:hover{background:transparent;color:var(--paper)}}

/* ---------- the wall: blackletter rows as skin, one piece of their work on top ---------- */
.hf-wall{position:relative;overflow:hidden;padding:clamp(40px,5vw,96px) 0 clamp(64px,7vw,120px);background:var(--paper);border-top:1px solid var(--hair)}
.hf-wall__rows{display:grid;gap:0;font:500 clamp(64px,11.2vw,220px)/.98 var(--f-black);color:var(--ink);user-select:none}
.hf-wall__row{display:flex;white-space:nowrap;will-change:transform}
.hf-wall__row span{padding-right:.35em}
.hf-wall__row:nth-child(odd){transform:translateX(-18%)}
.hf-wall__row:nth-child(even){transform:translateX(-4%)}
.hf-wall__photo{position:absolute;left:50%;top:50%;width:clamp(200px,24vw,420px);aspect-ratio:4/5;margin:0;transform:translate(-50%,-50%);background:#1a1a1a;overflow:hidden;z-index:2;filter:grayscale(1) contrast(1.08)}
.hf-wall__photo img,.hf-wall__photo canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hf-wall__photo canvas{opacity:0;transition:opacity .6s ease}
.hf-wall__photo.is-gl canvas{opacity:1}
.hf-wall__cap{position:absolute;left:var(--gutter);bottom:clamp(20px,2vw,36px);margin:0;font:800 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;z-index:3}
.hf-wall__credit{position:absolute;right:var(--gutter);bottom:clamp(20px,2vw,36px);margin:0;font:500 var(--fs-ui)/1 var(--f-body);color:var(--mute);z-index:3}

/* ---------- section titles: big sans + blackletter gloss (live-up's EN title + JA gloss pairing) ---------- */
.hf-title{margin:0;font:800 var(--fs-title)/.9 var(--f-sans);letter-spacing:-.035em;text-transform:uppercase}
.hf-gloss{display:block;margin-top:clamp(8px,1vw,18px);font:400 clamp(26px,2.4vw,46px)/1 var(--f-black);letter-spacing:0;text-transform:none}
.hf-sec{padding:var(--pad) var(--gutter)}

/* ---------- works wall (live-up M8) ---------- */
.hf-works__head{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gap);align-items:end;margin-bottom:clamp(28px,3.4vw,64px)}
.hf-works__head > div:first-child{grid-column:1 / 8}
.hf-works__filters{grid-column:8 / 13;display:grid;gap:14px;justify-items:end}
.hf-tabs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px clamp(16px,1.8vw,30px);list-style:none;margin:0;padding:0}
.hf-tab{position:relative;padding:8px 0;border:0;background:none;cursor:pointer;color:var(--mute);font:800 var(--fs-ui)/1 var(--f-sans);letter-spacing:.1em;text-transform:uppercase;transition:color .35s var(--ease-expo)}
.hf-tab::after{content:"";position:absolute;left:0;right:0;bottom:2px;height:1.5px;background:currentColor;transform:scaleX(0);transform-origin:right center;transition:transform .3s var(--ease-expo)}
.hf-tab[aria-pressed="true"]{color:var(--ink)}
.hf-tab[aria-pressed="true"]::after{transform:scaleX(1);transform-origin:left center}
@media (hover:hover){.hf-tab:hover{color:var(--ink)}.hf-tab:hover::after{transform:scaleX(1);transform-origin:left center}}
.hf-note{position:relative;height:1.6em;overflow:hidden;width:100%;max-width:40ch;text-align:right;color:var(--mute);font-size:var(--fs-small)}
.hf-note p{position:absolute;inset:0;margin:0;animation:hf-note .48s var(--ease-expo) both}
@keyframes hf-note{from{transform:translate3d(0,108%,0)}to{transform:none}}
.hf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--gap);align-items:start;transition:opacity .5s var(--ease-expo) .05s}
.hf-grid.is-swapping{opacity:0;transition-delay:0s;transition-duration:.25s}
.hf-col{display:grid;gap:var(--gap)}
.hf-col:nth-child(2){margin-top:clamp(24px,4vw,80px)}
.hf-col:nth-child(4){margin-top:clamp(12px,2vw,40px)}
.hf-work{position:relative;margin:0;overflow:hidden;background:var(--paper-2);cursor:default;-webkit-tap-highlight-color:transparent}
.hf-work img{width:100%;height:auto;filter:grayscale(1) contrast(1.06);transition:transform 1.6s var(--ease-expo),filter .5s var(--ease-expo)}
.hf-work__veil{position:absolute;inset:auto 0 0 0;padding:clamp(12px,1.1vw,18px);background:linear-gradient(to top,rgba(244,244,242,.94),rgba(244,244,242,.94) 70%,rgba(244,244,242,0));transform:translateY(101%);transition:transform .45s var(--ease-expo)}
.hf-work__line{display:block;overflow:hidden}
.hf-work__line span{display:block;transform:translate3d(0,108%,0);transition:transform .5s var(--ease-expo)}
.hf-work__line:nth-child(2) span{transition-delay:.06s}
.hf-work__title{font:800 clamp(14px,1.05vw,18px)/1.3 var(--f-sans)}
.hf-work__date{font:500 var(--fs-ui)/1.5 var(--f-body);color:var(--mute)}
.hf-work:focus-visible{outline-offset:-3px}
.hf-work.is-open img,.hf-work:focus-visible img{filter:none;transform:scale(1.03)}
.hf-work.is-open .hf-work__veil,.hf-work.is-open .hf-work__line span,.hf-work:focus-visible .hf-work__veil,.hf-work:focus-visible .hf-work__line span{transform:none}
@media (hover:hover) and (pointer:fine){
  .hf-work:hover img{filter:none;transform:scale(1.03)}
  .hf-work:hover .hf-work__veil,.hf-work:hover .hf-work__line span{transform:none}
}
.hf-works__more{display:flex;justify-content:center;margin-top:clamp(32px,3.4vw,60px)}
.hf-works__src{margin:clamp(20px,2vw,32px) 0 0;text-align:center;color:var(--mute);font-size:var(--fs-small)}

/* ---------- the studio ---------- */
.hf-studio{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gap) var(--gap);border-top:1px solid var(--hair)}
.hf-studio__head{grid-column:1 / 13;margin-bottom:clamp(32px,4vw,72px)}
.hf-studio__text{grid-column:1 / 7;display:grid;align-content:start;gap:clamp(20px,2vw,32px)}
.hf-quote{margin:0;text-wrap:balance;font:500 clamp(24px,2.4vw,44px)/1.2 var(--f-sans);letter-spacing:-.015em}
.hf-quote footer{margin-top:14px;font:500 var(--fs-small)/1.4 var(--f-body);color:var(--mute);letter-spacing:0}
.hf-studio__text p{margin:0;max-width:52ch}
.hf-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap);margin:clamp(8px,1vw,16px) 0 0;padding:clamp(18px,1.6vw,28px) 0 0;border-top:1px solid var(--ink)}
.hf-stats div{display:grid;gap:6px}
.hf-stats dt{order:2;font-size:var(--fs-small);line-height:1.35;color:var(--mute)}
.hf-stats dd{order:1;margin:0;font-variant-numeric:tabular-nums;font:800 clamp(36px,3.6vw,68px)/1 var(--f-sans);letter-spacing:-.03em}
.hf-studio__photos{grid-column:8 / 13;display:grid;grid-template-columns:1fr 1fr;gap:var(--gap);align-items:start}
.hf-studio__photos figure:nth-child(2){margin-top:clamp(48px,7vw,140px)}
.hf-frame{position:relative;margin:0;aspect-ratio:3/4;overflow:hidden;background:var(--paper-2)}
.hf-frame img{position:absolute;left:0;top:-12%;width:100%;height:124%;object-fit:cover;filter:grayscale(1) contrast(1.06);will-change:transform}

/* ---------- process: the one ink section ---------- */
.hf-night{background:var(--night);color:var(--paper)}
.hf-night ::selection{background:var(--paper);color:var(--night)}
.hf-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--gap);list-style:none;margin:clamp(40px,5vw,96px) 0 0;padding:0}
.hf-step{display:grid;align-content:start;gap:12px;padding-top:18px;border-top:1px solid var(--night-hair)}
.hf-step__n{font:400 clamp(34px,3vw,56px)/1 var(--f-black)}
.hf-step h3{margin:0;font:800 clamp(20px,1.6vw,28px)/1.1 var(--f-sans);text-transform:uppercase;letter-spacing:.01em}
.hf-step p{margin:0;color:var(--night-mute);max-width:34ch}
.hf-care{margin-top:clamp(48px,5vw,96px);border-top:1px solid var(--night-hair);border-bottom:1px solid var(--night-hair)}
.hf-care summary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:72px;cursor:pointer;list-style:none;font:800 clamp(18px,1.5vw,26px)/1.2 var(--f-sans);text-transform:uppercase}
.hf-care summary::-webkit-details-marker{display:none}
.hf-care__plus{position:relative;width:18px;height:18px;flex:none}
.hf-care__plus::before,.hf-care__plus::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;margin-top:-.75px;background:currentColor;transition:transform .45s var(--ease-expo)}
.hf-care__plus::after{transform:rotate(90deg)}
.hf-care[open] .hf-care__plus::after{transform:rotate(0)}
.hf-care ul{display:grid;grid-template-columns:repeat(2,1fr);gap:10px var(--gap);margin:0;padding:0 0 28px;list-style:none;color:var(--night-mute)}
.hf-care li{padding-left:18px;position:relative;max-width:48ch}
.hf-care li::before{content:"";position:absolute;left:0;top:.72em;width:8px;height:1.5px;background:var(--paper)}

/* ---------- gift card ---------- */
.hf-gift{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gap);align-items:center}
.hf-gift__photo{grid-column:1 / 6}
.hf-gift__photo .hf-frame{aspect-ratio:1}
.hf-gift__photo .hf-frame img{filter:grayscale(1) contrast(1.08)}
.hf-gift__text{grid-column:7 / 13;display:grid;gap:clamp(20px,2vw,32px);justify-items:start}
.hf-gift__text .hf-title{font-size:clamp(56px,8.4vw,160px)}

/* ---------- contact: the e-mail fitted to the column (live-up M11) ---------- */
.hf-contact{border-top:1px solid var(--hair)}
.hf-contact__lead{margin:clamp(20px,2vw,32px) 0 0;max-width:46ch}
.hf-mail{position:relative;display:block;width:100%;margin:clamp(40px,4.4vw,88px) 0 0;padding:0;border:0;background:none;color:var(--ink);cursor:pointer;text-align:left}
.hf-mail__addr{display:block;font:800 var(--mail-size,9vw)/1 var(--f-sans);letter-spacing:-.03em;white-space:nowrap}
.hf-mail__rule{display:block;height:2px;margin-top:.6vw;background:var(--ink);transform-origin:left;transform:scaleX(1)}
.hf-mail__tip{position:absolute;right:0;top:-2.4em;padding:8px 12px;background:var(--ink);color:var(--paper);font:800 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;pointer-events:none;transition:opacity .3s var(--ease-expo),transform .3s var(--ease-expo)}
.hf-mail__tip.is-off{opacity:0;transform:translateY(6px)}
.hf-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--gap);margin:clamp(40px,4vw,80px) 0 0}
.hf-facts div{display:grid;align-content:start;gap:8px}
.hf-facts dt{font:800 var(--fs-ui)/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;color:var(--mute)}
.hf-facts dd{margin:0;font-size:var(--fs-body);line-height:1.5}
.hf-facts a{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}

/* ---------- footer: the name, fitted, in their own letter ---------- */
.hf-foot{padding:clamp(56px,6vw,120px) var(--gutter) max(28px,2.4vw);overflow:hidden}
.hf-foot__name{display:block;font:500 var(--foot-size,10vw)/.95 var(--f-black);white-space:nowrap;letter-spacing:-.01em}
.hf-foot__row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px 32px;margin-top:clamp(28px,3vw,56px);padding-top:20px;border-top:1px solid var(--night-hair);color:var(--night-mute);font-size:var(--fs-small)}
.hf-foot__row a{text-decoration:none}
.hf-foot__row a:hover{color:var(--paper)}
.hf-foot__logo{width:44px;height:auto}

/* ---------- ≤1024 / ≤768 ---------- */
@media (max-width:1024px){
  .hf-works__head{grid-template-columns:1fr}
  .hf-works__head > div:first-child,.hf-works__filters{grid-column:1 / -1;justify-items:start}
  .hf-tabs{justify-content:flex-start}.hf-note{text-align:left}
  .hf-steps{grid-template-columns:repeat(2,1fr);row-gap:clamp(32px,4vw,56px)}
  .hf-facts{grid-template-columns:repeat(2,1fr);row-gap:32px}
}
@media (max-width:768px){
  :root{scroll-padding-top:64px}
  .hf-nav{display:none}.hf-burger{display:grid}
  .hf-head{padding-top:calc(env(safe-area-inset-top) + 14px);padding-bottom:14px}
  .hf-hero{padding-top:calc(env(safe-area-inset-top) + 72px)}
  .hf-hero__foot{flex-direction:column;align-items:stretch}
  .hf-hero__ctas .hf-btn{flex:1;justify-content:center}
  .hf-wall{padding:72px 0 88px}
  .hf-wall__rows{font-size:clamp(56px,19vw,120px)}
  .hf-wall__photo{width:52vw}
  .hf-wall__credit{display:none}
  .hf-grid{grid-template-columns:repeat(2,1fr)}
  .hf-col:nth-child(2){margin-top:40px}.hf-col:nth-child(4){margin-top:0}
  .hf-work__veil{padding:10px}
  .hf-tab{min-height:44px;padding:14px 0}.hf-tab::after{bottom:10px}
  .hf-tabs{gap:0 18px}
  .hf-work{cursor:pointer}
  .hf-studio__text,.hf-studio__photos,.hf-gift__photo,.hf-gift__text{grid-column:1 / -1}
  .hf-studio__photos{margin-top:40px}
  .hf-stats{grid-template-columns:1fr 1fr 1fr}
  .hf-stats dd{font-size:clamp(28px,8.6vw,40px)}
  .hf-steps{grid-template-columns:1fr}
  .hf-care ul{grid-template-columns:1fr}
  .hf-gift__text{margin-top:32px}
  .hf-facts{grid-template-columns:1fr}
  .hf-mail__tip{display:none}
}

@media (prefers-reduced-motion:reduce){
  .hf-head,.hf-rise,.hf-fadein,.hf-note p{animation:none}
  .hf-work img,.hf-work__veil,.hf-work__line span,.hf-btn__roll span,.hf-drawer,.hf-btn__arrow{transition:none}
  .hf-drawer__links a{transform:none;opacity:1;transition:none}
}
`
}
