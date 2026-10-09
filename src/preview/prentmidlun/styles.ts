/* Scoped stylesheet for /preview/prentmidlun ("Frá skrá að dyrum", 2026-10-09).
   System: Live-up (via the /preview/hudflur port): the expo curve .16,1,.3,1 on every mask, the in-out curve
   .87,0,.13,1 on the shutter and the masthead drop, 108% masked lines, the clip-path drawer, the works veil with
   per-line masked labels, the width-fitted e-mail. Re-aimed for a print broker: a book serif (Sentient) in
   sentence case with an English italic gloss instead of uppercase display + JA gloss; printer's crop marks and
   signature letters; their logo blue only where a printer uses blue (marks, rules, the active state).
   Every rest state is the visible state; motion.ts only adds the travel. Everything hangs off .pm. */

export function prentCss(B: string): string {
  const f = (p: string) => `${B}fonts/${p}`
  return `
@font-face{font-family:"PM Sentient";src:url(${f('sentient/Sentient-Light.woff2')}) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"PM Sentient";src:url(${f('sentient/Sentient-Regular.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"PM Sentient";src:url(${f('sentient/Sentient-LightItalic.woff2')}) format("woff2");font-weight:300;font-style:italic;font-display:swap}
@font-face{font-family:"PM Sentient";src:url(${f('sentient/Sentient-Italic.woff2')}) format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"PM Switzer";src:url(${f('switzer/Switzer-Variable.woff2')}) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}

html,body{background-color:#f4f3f1}
html{color-scheme:light;scroll-padding-top:88px}

.pm{
  --paper:#f4f3f1;--well:#e6e4e2;--ink:#15191c;--ink-2:#3a3f43;--mute:#5d6266;--hair:#d9d7d3;
  --blue:#3a91c7;--blue-ink:#1f5f8b;--night:#15191c;--night-mute:#a7adb1;--night-hair:#2d3337;
  --f-serif:"PM Sentient",ui-serif,Georgia,serif;--f-sans:"PM Switzer",ui-sans-serif,system-ui,sans-serif;
  --ease-expo:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.87,0,.13,1);
  --gutter:max(20px,2.34vw);--gap:max(10px,1.1vw);--pad:max(88px,9.38vw);
  --fs-body:clamp(16px,1.1vw,18px);--fs-small:clamp(13px,.86vw,15px);--fs-ui:clamp(12px,.78vw,13px);
  --fs-title:clamp(48px,7.6vw,148px);
  background:var(--paper);color:var(--ink);font-family:var(--f-sans);font-size:var(--fs-body);line-height:1.58;
  -webkit-font-smoothing:antialiased;overflow-x:clip;font-feature-settings:"ss01"
}
.pm *,.pm ::before,.pm ::after{box-sizing:border-box}
.pm ::selection{background:var(--blue);color:#fff}
.pm img{display:block;max-width:100%}
:where(.pm) a{color:inherit}
.pm :focus-visible{outline:2px solid var(--blue);outline-offset:3px}
.pm button,.pm a{touch-action:manipulation}
.pm p{text-wrap:pretty}
.pm h1,.pm h2,.pm h3{text-wrap:balance}
.pm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pm-skip{position:fixed;left:12px;top:-60px;z-index:300;background:var(--ink);color:var(--paper);padding:10px 14px;font:600 14px var(--f-sans);text-decoration:none}
.pm-skip:focus{top:12px}

/* masked line, with room above for Á É Í Ó Ú Ð Þ (memory: masked-reveal-clips-icelandic-accents) */
.pm-line{display:block;overflow:hidden;padding-top:.24em;margin-top:-.24em;padding-bottom:.14em;margin-bottom:-.14em}
.pm-flora__big .pm-line{padding-bottom:.24em;margin-bottom:-.24em}
.pm-line > span{display:block;will-change:transform}

/* ---------- intro: their logo on ink, then the shutter wipes up (live-up M2) ---------- */
.pm-intro{position:fixed;inset:0;z-index:400}
.pm-intro__veil,.pm-intro__shutter{position:absolute;inset:0;background:var(--night)}
.pm-intro__veil{z-index:1;transition:opacity .7s ease}
.pm-intro__shutter{z-index:2;transition:transform 1.5s var(--ease-io) .35s;will-change:transform}
.pm-intro__mark{position:fixed;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%);display:grid;justify-items:center;gap:18px;opacity:0;transition:opacity .65s cubic-bezier(.25,.46,.45,.94) .06s}
.pm-intro__mark img{width:clamp(200px,22vw,320px);height:auto}
.pm-intro__mark span{font:300 italic clamp(15px,1.1vw,18px)/1 var(--f-serif);color:var(--night-mute)}
.pm-intro.is-lit .pm-intro__mark{opacity:1}
.pm-intro.is-leaving .pm-intro__veil{opacity:0}
.pm-intro.is-leaving .pm-intro__shutter{transform:translate3d(0,-100%,0)}
.pm-intro.is-leaving .pm-intro__mark{opacity:0;transition:opacity 1.2s var(--ease-io) .2s}

/* ---------- masthead: paper bar, drops in once (live-up M3), hides on the way down ---------- */
.pm-head{position:fixed;inset:0 0 auto 0;z-index:200;display:flex;align-items:center;justify-content:space-between;gap:24px;
  padding:calc(env(safe-area-inset-top) + 18px) var(--gutter) 18px;background:color-mix(in srgb,var(--paper) 92%,transparent);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid transparent;
  transition:transform .35s var(--ease-expo),border-color .4s;animation:pm-drop 2.3s var(--ease-io) .2s both}
.pm.is-quick .pm-head{animation:pm-drop .7s var(--ease-expo) 0s both}
.pm-head.is-condensed{padding-top:calc(env(safe-area-inset-top) + 12px);padding-bottom:12px;border-bottom-color:var(--hair)}
.pm-head.is-hidden{transform:translateY(-105%)}
.pm-head.is-menu{background:transparent;border-color:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;z-index:320;transform:none}
@keyframes pm-drop{from{transform:translateY(-110%)}to{transform:none}}
.pm-brand{display:block;line-height:0}
.pm-brand img{height:clamp(20px,1.55vw,26px);width:auto}
.pm-brand .is-light{display:none}
.pm-head.is-menu .pm-brand .is-dark{display:none}
.pm-head.is-menu .pm-brand .is-light{display:block}
.pm-nav{display:flex;align-items:center;gap:clamp(18px,2.2vw,40px)}
.pm-nav a{position:relative;font:550 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;text-decoration:none;padding:8px 0;transition:opacity .3s}
.pm-nav a::before{content:"";position:absolute;left:-12px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:var(--blue);opacity:0;transition:opacity .3s}
.pm-nav a[aria-current="page"]::before{opacity:1}
@media (hover:hover) and (pointer:fine){.pm-nav:hover a{opacity:.55}.pm-nav a:hover{opacity:1}}
.pm-nav a.pm-nav__cta{padding:12px 16px;background:var(--ink);color:var(--paper)}
.pm-nav a.pm-nav__cta::before{display:none}
.pm-burger{display:none;position:relative;min-width:44px;height:44px;margin-right:-6px;padding:0 6px;border:0;background:none;color:var(--ink);cursor:pointer;perspective:200px}
.pm-head.is-menu .pm-burger{color:var(--paper)}
.pm-burger__face{grid-area:1 / 1;display:grid;place-items:center end;font:600 12px/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;backface-visibility:hidden;transition:transform .62s var(--ease-expo),opacity .62s var(--ease-expo)}
.pm-burger__face--close{opacity:0;transform:rotateX(-90deg)}
.pm-head.is-menu .pm-burger__face--open{opacity:0;transform:rotateX(90deg)}
.pm-head.is-menu .pm-burger__face--close{opacity:1;transform:none}

/* drawer: ink panel rolled down with clip-path (live-up G8-G11) */
.pm-drawer{position:fixed;inset:0;z-index:310;display:grid;align-content:center;gap:32px;padding:calc(env(safe-area-inset-top) + 96px) var(--gutter) 40px;background:var(--night);color:var(--paper);clip-path:inset(0 0 100% 0);transition:clip-path .45s var(--ease-expo);overflow-y:auto;overscroll-behavior:contain}
.pm-drawer.is-open{clip-path:inset(0);transition-duration:.8s}
.pm-drawer__links{display:grid;gap:4px}
.pm-drawer__links a{transform:translateY(40px);opacity:0;transition:transform .7s var(--ease-expo),opacity .5s var(--ease-expo);font:300 clamp(36px,10vw,60px)/1.12 var(--f-serif);text-decoration:none;letter-spacing:-.02em}
.pm-drawer__links a[aria-current="page"]{color:var(--blue)}
.pm-drawer.is-open .pm-drawer__links a{transform:none;opacity:1}
${[1, 2, 3, 4, 5, 6].map((i) => `.pm-drawer.is-open .pm-drawer__links a:nth-child(${i}){transition-delay:${(0.08 + i * 0.05).toFixed(2)}s}`).join('')}
.pm-drawer__meta{display:grid;gap:8px;font-size:16px;color:var(--night-mute)}
.pm-drawer__meta a{text-decoration:none;color:var(--paper)}

/* ---------- printer's marks: crop marks at the four corners, a registration target ---------- */
.pm-marks{position:relative;--mk:1}
.pm-marks::before,.pm-marks::after{content:"";position:absolute;inset:-14px;pointer-events:none;z-index:3;opacity:var(--mk);
  background:
    linear-gradient(var(--blue),var(--blue)) 0 13px/calc(10px * var(--mk)) 1px no-repeat,
    linear-gradient(var(--blue),var(--blue)) 13px 0/1px calc(10px * var(--mk)) no-repeat,
    linear-gradient(var(--blue),var(--blue)) 100% 13px/calc(10px * var(--mk)) 1px no-repeat,
    linear-gradient(var(--blue),var(--blue)) calc(100% - 13px) 0/1px calc(10px * var(--mk)) no-repeat}
.pm-marks::after{transform:scaleY(-1)}
.pm-reg{display:inline-block;width:14px;height:14px;flex:none;color:var(--blue)}

/* ---------- section titles: the book serif + the English italic gloss ---------- */
.pm-sig{display:flex;align-items:center;gap:10px;margin:0 0 clamp(14px,1.4vw,24px);font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--blue-ink)}
.pm-title{margin:0;font:300 var(--fs-title)/.98 var(--f-serif);letter-spacing:-.035em}
.pm-gloss{display:block;margin-top:clamp(6px,.8vw,14px);font:300 italic clamp(20px,1.9vw,34px)/1.1 var(--f-serif);letter-spacing:-.01em;color:var(--mute)}
.pm-sec{padding:var(--pad) var(--gutter)}
.pm-rule{border-top:1px solid var(--hair)}

/* buttons: square, ink, with the live-up label roll */
.pm-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:52px;padding:0 24px;border:1.5px solid var(--ink);background:var(--ink);color:var(--paper);
  font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;text-decoration:none;white-space:nowrap;cursor:pointer;transition:background .2s var(--ease-expo),color .2s var(--ease-expo),transform .12s ease-out}
.pm-btn--ghost{background:transparent;color:var(--ink)}
.pm-btn__roll{display:block;overflow:hidden;height:1.5em;line-height:1.5}
.pm-btn__roll span{display:block;height:1.5em;transition:transform .3s var(--ease-expo)}
.pm-btn:active{transform:scale(.97)}
.pm-btn__arrow{width:16px;height:16px;flex:none;transition:transform .3s var(--ease-expo)}
@media (hover:hover) and (pointer:fine){
  .pm-btn:hover .pm-btn__roll span{transform:translateY(-100%)}
  .pm-btn:hover .pm-btn__arrow{transform:translateX(3px)}
  .pm-btn:hover{background:transparent;color:var(--ink)}
  .pm-btn--ghost:hover{background:var(--ink);color:var(--paper)}
}
.pm-night .pm-btn{border-color:var(--paper);background:var(--paper);color:var(--ink)}
@media (hover:hover) and (pointer:fine){.pm-night .pm-btn:hover{background:transparent;color:var(--paper)}}
.pm-link{color:var(--blue-ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}

/* ---------- hero ---------- */
.pm-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);align-items:end;padding:calc(env(safe-area-inset-top) + 112px) var(--gutter) max(32px,2.6vw)}
.pm-hero__text{grid-column:1 / 8;grid-row:1;align-self:center;display:grid;gap:clamp(22px,2.2vw,40px);position:relative;z-index:2}
.pm-hero__title{margin:0;font:300 clamp(46px,6.6vw,128px)/.98 var(--f-serif);letter-spacing:-.038em}
.pm-hero__title .pm-gloss{font-size:clamp(19px,1.7vw,30px);margin-top:clamp(12px,1.2vw,22px)}
.pm-hero__lead{margin:0;max-width:44ch;color:var(--ink-2);font-size:clamp(17px,1.2vw,20px)}
.pm-hero__ctas{display:flex;gap:10px;flex-wrap:wrap}
.pm-hero__photo{grid-column:8 / 13;grid-row:1;align-self:center;position:relative;margin:0;aspect-ratio:4/5;background:var(--well)}
.pm-hero__photo .pm-hero__clip{position:absolute;inset:0;overflow:hidden}
.pm-hero__photo img,.pm-hero__photo canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pm-hero__photo img{transform-origin:center;object-position:50% 50%}
.pm-hero__photo canvas{opacity:0;transition:opacity .6s ease}
.pm-hero__photo.is-gl canvas{opacity:1}
.pm-hero__cap{position:absolute;left:0;right:0;bottom:-30px;display:flex;justify-content:space-between;gap:12px;font:500 var(--fs-ui)/1.3 var(--f-sans);color:var(--mute)}
.pm-hero__meta{grid-column:1 / -1;grid-row:2;display:flex;flex-wrap:wrap;gap:8px 28px;margin-top:clamp(40px,4vw,72px);padding-top:16px;border-top:1px solid var(--hair);font:500 var(--fs-small)/1.4 var(--f-sans);color:var(--mute)}
.pm-hero__meta a{text-decoration:none}
.pm-rise{display:block;animation:pm-rise 1.3s var(--ease-expo) 1.25s both}
.pm-rise--2{animation-delay:1.36s}.pm-rise--3{animation-delay:1.48s}.pm-rise--4{animation-delay:1.6s}
.pm.is-quick .pm-rise{animation-delay:.08s}.pm.is-quick .pm-rise--2{animation-delay:.16s}.pm.is-quick .pm-rise--3{animation-delay:.24s}.pm.is-quick .pm-rise--4{animation-delay:.32s}
@keyframes pm-rise{from{transform:translate3d(0,108%,0)}to{transform:none}}
.pm-fadein{animation:pm-fadein 1.2s var(--ease-expo) 1.5s both}
.pm.is-quick .pm-fadein{animation-delay:.3s}
@keyframes pm-fadein{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
.pm-unveil{animation:pm-unveil 1.6s var(--ease-io) 1.1s both}
.pm.is-quick .pm-unveil{animation-delay:.05s;animation-duration:1.1s}
@keyframes pm-unveil{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0)}}

/* ---------- statement + figures ---------- */
.pm-state{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap)}
.pm-state__text{grid-column:3 / 12;margin:0;font:300 clamp(26px,3vw,54px)/1.18 var(--f-serif);letter-spacing:-.02em;text-indent:clamp(48px,8vw,160px)}
.pm-state__text em{font-style:italic;color:var(--blue-ink)}
.pm-figs{grid-column:3 / 13;display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap);margin:clamp(48px,5vw,96px) 0 0;padding-top:clamp(18px,1.6vw,28px);border-top:1px solid var(--ink)}
.pm-figs div{display:grid;gap:8px;align-content:start}
.pm-figs dt{order:2;font-size:var(--fs-small);line-height:1.4;color:var(--mute);max-width:26ch}
.pm-figs dd{order:1;margin:0;font:300 clamp(44px,4.6vw,88px)/1 var(--f-serif);letter-spacing:-.04em;font-variant-numeric:oldstyle-nums}

/* ---------- services index (live-up domain list) ---------- */
.pm-svc__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);align-items:end;margin-bottom:clamp(32px,4vw,72px)}
.pm-svc__head > div{grid-column:1 / 9}
.pm-svc__head p{grid-column:9 / 13;margin:0;color:var(--mute);max-width:36ch}
.pm-index{position:relative;list-style:none;margin:0;padding:0;border-top:1px solid var(--ink)}
.pm-index li{border-bottom:1px solid var(--hair)}
.pm-index a{position:relative;display:grid;grid-template-columns:3rem minmax(0,5fr) minmax(0,4fr) 24px;align-items:center;gap:var(--gap);min-height:clamp(84px,7.4vw,128px);padding:14px 0;text-decoration:none;transition:color .3s}
.pm-index__t{transition:transform .22s var(--ease-expo)}
.pm-index__n{font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.12em;color:var(--blue-ink)}
.pm-index__t{display:grid;gap:2px}
.pm-index__t strong{font:300 clamp(30px,3.2vw,60px)/1.02 var(--f-serif);letter-spacing:-.03em}
.pm-index__t em{font:300 italic clamp(15px,1.05vw,19px)/1.2 var(--f-serif);color:var(--mute)}
.pm-index__s{color:var(--ink-2);max-width:38ch}
.pm-index svg{width:22px;height:22px;transition:transform .4s var(--ease-expo)}
.pm .pm-index__thumb{display:none}
.pm-peek{position:absolute;right:calc(24px + var(--gap) * 2);top:0;width:clamp(180px,17vw,300px);aspect-ratio:4/3;pointer-events:none;z-index:4;opacity:0;transform:translate3d(0,var(--py,0px),0) scale(.94);transition:opacity .35s var(--ease-expo),transform .42s var(--ease-expo);background:var(--well);overflow:hidden}
.pm-peek.is-on{opacity:1;transform:translate3d(0,var(--py,0px),0) scale(1)}
.pm-peek img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s ease}
.pm-peek img.is-on{opacity:1}
@media (hover:hover) and (pointer:fine){
  .pm-index a:hover .pm-index__t{transform:translateX(14px)}
  .pm-index a:hover svg{transform:translateX(4px)}
  .pm-index:hover a:not(:hover){color:color-mix(in srgb,var(--ink) 45%,var(--paper))}
}

/* ---------- works wall (live-up M8) ---------- */
.pm-works__head{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);align-items:end;margin-bottom:clamp(28px,3.4vw,64px)}
.pm-works__head > div:first-child{grid-column:1 / 6}
.pm-works__filters{grid-column:6 / 13;display:grid;gap:14px;justify-items:end}
.pm-tabs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:4px clamp(14px,1.5vw,26px);list-style:none;margin:0;padding:0}
.pm-tab{position:relative;min-height:40px;padding:10px 0;border:0;background:none;cursor:pointer;color:var(--mute);font:550 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;transition:color .35s var(--ease-expo)}
.pm-tab sup{margin-left:3px;font-size:.8em;color:var(--mute)}
.pm-tab::after{content:"";position:absolute;left:0;right:0;bottom:6px;height:1.5px;background:var(--blue);transform:scaleX(0);transform-origin:right center;transition:transform .3s var(--ease-expo)}
.pm-tab[aria-pressed="true"]{color:var(--ink)}
.pm-tab[aria-pressed="true"]::after{transform:scaleX(1);transform-origin:left center}
@media (hover:hover){.pm-tab:hover{color:var(--ink)}.pm-tab:hover::after{transform:scaleX(1);transform-origin:left center}}
.pm-note{position:relative;height:1.6em;overflow:hidden;width:100%;max-width:46ch;text-align:right;color:var(--mute);font-size:var(--fs-small)}
.pm-note p{position:absolute;inset:0;margin:0;animation:pm-note .48s var(--ease-expo) both}
@keyframes pm-note{from{transform:translate3d(0,108%,0)}to{transform:none}}
.pm-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap);align-items:start;transition:opacity .5s var(--ease-expo) .05s}
.pm-grid.is-swapping{opacity:0;transition-delay:0s;transition-duration:.25s}
.pm-col{display:grid;gap:var(--gap)}
.pm-col:nth-child(2){margin-top:clamp(24px,4vw,80px)}
.pm-col:nth-child(4){margin-top:clamp(12px,2vw,40px)}
.pm-work{position:relative;margin:0;overflow:hidden;background:var(--well);cursor:default;-webkit-tap-highlight-color:transparent}
.pm-work img{width:100%;height:auto;transition:transform 1.6s var(--ease-expo)}
.pm-work__veil{position:absolute;inset:auto 0 0 0;padding:clamp(12px,1.1vw,18px);background:linear-gradient(to top,rgba(244,243,241,.96),rgba(244,243,241,.96) 72%,rgba(244,243,241,0));transform:translateY(101%);transition:transform .45s var(--ease-expo)}
.pm-work__line{display:block;overflow:hidden;padding-top:.2em;margin-top:-.2em}
.pm-work__line span{display:block;transform:translate3d(0,108%,0);transition:transform .5s var(--ease-expo)}
.pm-work__line:nth-child(2) span{transition-delay:.06s}
.pm-work__title{font:400 clamp(16px,1.15vw,20px)/1.25 var(--f-serif);letter-spacing:-.01em}
.pm-work__cat{font:550 var(--fs-ui)/1.6 var(--f-sans);letter-spacing:.06em;text-transform:uppercase;color:var(--blue-ink)}
.pm-work:focus-visible{outline-offset:-3px}
.pm-work.is-open img,.pm-work:focus-visible img{transform:scale(1.03)}
.pm-work.is-open .pm-work__veil,.pm-work.is-open .pm-work__line span,.pm-work:focus-visible .pm-work__veil,.pm-work:focus-visible .pm-work__line span{transform:none}
@media (hover:hover) and (pointer:fine){
  .pm-work:hover img{transform:scale(1.03)}
  .pm-work:hover .pm-work__veil,.pm-work:hover .pm-work__line span{transform:none}
}
.pm-works__more{display:flex;justify-content:center;margin-top:clamp(32px,3.4vw,60px)}
.pm-works__src{margin:clamp(20px,2vw,32px) 0 0;text-align:center;color:var(--mute);font-size:var(--fs-small)}

/* ---------- the biggest job: Flóra Íslands, set as type ---------- */
.pm-flora{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);align-items:end}
.pm-flora__big{grid-column:1 / 7;margin:0;font:300 clamp(120px,19vw,360px)/.8 var(--f-serif);letter-spacing:-.06em;font-variant-numeric:lining-nums}
.pm-flora__big small{font-size:.32em;letter-spacing:-.02em;margin-left:.08em;font-style:italic}
.pm-flora__text{grid-column:8 / 13;display:grid;gap:16px;padding-bottom:clamp(8px,1.4vw,28px)}
.pm-flora__text h3{margin:0;font:300 clamp(28px,2.6vw,48px)/1.08 var(--f-serif);letter-spacing:-.02em}
.pm-flora__text h3 em{display:block;font-size:.55em;color:var(--mute);margin-top:6px}
.pm-flora__text p{margin:0;max-width:44ch;color:var(--ink-2)}

/* ---------- process: the one ink section ---------- */
.pm-night{background:var(--night);color:var(--paper)}
.pm-night ::selection{background:var(--paper);color:var(--night)}
.pm-night .pm-gloss{color:var(--night-mute)}
.pm-night .pm-sig{color:#7fb9de}
.pm-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(40px,4vw,72px) var(--gap);list-style:none;margin:clamp(48px,5vw,96px) 0 0;padding:0}
.pm-step{display:grid;align-content:start;gap:12px;padding-top:18px;border-top:1px solid var(--night-hair)}
.pm-step__n{font:300 italic clamp(40px,3.4vw,64px)/1 var(--f-serif);color:#7fb9de;font-variant-numeric:oldstyle-nums}
.pm-step h3{margin:0;font:400 clamp(21px,1.6vw,28px)/1.15 var(--f-serif);letter-spacing:-.01em}
.pm-step p{margin:0;color:var(--night-mute);max-width:36ch}
.pm-process__foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-top:clamp(48px,5vw,96px);padding-top:24px;border-top:1px solid var(--night-hair);color:var(--night-mute)}

/* ---------- samples + about teaser ---------- */
.pm-about{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);align-items:start}
.pm-about__photo{grid-column:1 / 5;margin:0}
.pm-frame{position:relative;margin:0;aspect-ratio:3/4;overflow:hidden;background:var(--well)}
.pm-frame img{position:absolute;left:0;top:-10%;width:100%;height:120%;object-fit:cover;will-change:transform}
.pm-frame--bw img{filter:grayscale(1) contrast(1.05)}
.pm-about__cap{margin:12px 0 0;font-size:var(--fs-small);color:var(--mute)}
.pm-about__text{grid-column:6 / 13;display:grid;gap:clamp(20px,2vw,32px);align-content:start}
.pm-about__text p{margin:0;max-width:56ch}
.pm-about__text .pm-quote{font:300 clamp(24px,2.3vw,42px)/1.2 var(--f-serif);letter-spacing:-.015em;max-width:30ch;margin:0}
.pm-chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}
.pm-chips li{padding:9px 14px;border:1px solid var(--hair);font:500 var(--fs-small)/1 var(--f-sans);background:#fff}

/* ---------- contact: the e-mail fitted to the column (live-up M11) ---------- */
.pm-contact__lead{margin:clamp(20px,2vw,32px) 0 0;max-width:48ch}
.pm-mail{position:relative;display:block;width:100%;margin:clamp(40px,4.4vw,88px) 0 0;padding:0;border:0;background:none;color:var(--ink);cursor:pointer;text-align:left}
.pm-mail__addr{display:block;font:300 var(--mail-size,7vw)/1.15 var(--f-serif);letter-spacing:-.035em;white-space:nowrap}
.pm-mail__rule{display:block;height:1.5px;margin-top:.4vw;background:var(--blue);transform-origin:left;transform:scaleX(1)}
.pm-mail__tip{position:absolute;right:0;top:-2.6em;padding:8px 12px;background:var(--ink);color:var(--paper);font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;pointer-events:none;transition:opacity .3s var(--ease-expo),transform .3s var(--ease-expo)}
.pm-mail__tip.is-off{opacity:0;transform:translateY(6px)}
.pm-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap);margin:clamp(40px,4vw,80px) 0 0}
.pm-facts div{display:grid;align-content:start;gap:8px;padding-top:14px;border-top:1px solid var(--hair)}
.pm-facts dt{font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.09em;text-transform:uppercase;color:var(--mute)}
.pm-facts dd{margin:0;line-height:1.5}
.pm-facts a{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}

/* ---------- inner pages ---------- */
.pm-page{padding:calc(env(safe-area-inset-top) + 140px) var(--gutter) var(--pad)}
.pm-crumbs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 clamp(24px,2.6vw,48px);padding:0;list-style:none;font:500 var(--fs-small)/1 var(--f-sans);color:var(--mute)}
.pm-crumbs a{text-decoration:none}
.pm-crumbs li+li::before{content:"/";margin-right:8px;color:var(--hair)}
.pm-detail{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);margin-top:clamp(40px,4.4vw,88px);align-items:start}
.pm-detail__photo{grid-column:1 / 6;margin:0;position:sticky;top:110px}
.pm-detail__photo .pm-frame{aspect-ratio:4/5}
.pm-detail__photo .pm-frame img{top:0;height:100%}
.pm-detail__text{grid-column:7 / 13;display:grid;gap:clamp(18px,1.6vw,28px)}
.pm-detail__lead{margin:0;font:300 clamp(24px,2.2vw,40px)/1.22 var(--f-serif);letter-spacing:-.015em}
.pm-detail__text > p{margin:0;max-width:58ch}
.pm-spec{display:grid;margin:8px 0 0;border-top:1px solid var(--ink)}
.pm-spec div{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:var(--gap);padding:14px 0;border-bottom:1px solid var(--hair)}
.pm-spec dt{font:600 var(--fs-ui)/1.5 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.pm-spec dd{margin:0}
.pm-opts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(24px,2.4vw,44px) var(--gap);margin-top:clamp(40px,4vw,72px)}
.pm-opts h3{margin:0 0 12px;padding-top:12px;border-top:1px solid var(--ink);font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.1em;text-transform:uppercase}
.pm-opts ul{margin:0;padding:0;list-style:none;display:grid;gap:6px;color:var(--ink-2)}
.pm-cta-band{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-top:clamp(56px,6vw,112px);padding:clamp(24px,2.4vw,40px);border:1px solid var(--ink)}
.pm-cta-band p{margin:0;font:300 clamp(22px,2vw,34px)/1.2 var(--f-serif);letter-spacing:-.015em;max-width:30ch}
.pm-more{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap);margin-top:clamp(28px,3vw,56px)}
.pm-prose{max-width:68ch;display:grid;gap:16px}
.pm-prose h2{margin:24px 0 0;font:400 clamp(22px,1.8vw,30px)/1.2 var(--f-serif)}
.pm-prose p,.pm-prose ul{margin:0}

/* ---------- quote builder ---------- */
.pm-q{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--gap);margin-top:clamp(40px,4vw,80px);align-items:start}
.pm-q__form{grid-column:1 / 8;display:grid;gap:clamp(36px,3.4vw,60px)}
.pm-q__side{grid-column:9 / 13;position:sticky;top:104px;display:grid;gap:16px}
.pm-fs{margin:0;padding:0;border:0;display:grid;gap:16px;min-width:0}
.pm-fs legend{display:flex;align-items:baseline;gap:12px;padding:0 0 14px;margin-bottom:4px;width:100%;border-bottom:1px solid var(--ink);font:400 clamp(22px,1.8vw,30px)/1.1 var(--f-serif);letter-spacing:-.01em}
.pm-fs legend span{font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.12em;color:var(--blue-ink)}
.pm-types{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap)}
.pm-type{position:relative;display:grid;gap:8px;padding:0 0 10px;border:0;background:none;text-align:left;cursor:pointer;color:var(--ink);font:inherit}
.pm-type__img{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:var(--well);outline:1.5px solid transparent;outline-offset:3px;transition:outline-color .2s}
.pm-type__img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease-expo)}
.pm-type strong{font:400 clamp(16px,1.1vw,19px)/1.2 var(--f-serif)}
.pm-type em{font:300 italic var(--fs-small)/1 var(--f-serif);color:var(--mute)}
.pm-type[aria-pressed="true"] .pm-type__img{outline-color:var(--blue)}
.pm-type[aria-pressed="true"] strong::before{content:"";display:inline-block;width:7px;height:7px;margin:0 8px 2px 0;border-radius:50%;background:var(--blue)}
@media (hover:hover) and (pointer:fine){.pm-type:hover .pm-type__img img{transform:scale(1.04)}}
.pm-hint{display:flex;gap:12px;align-items:flex-start;margin:0;padding:14px 16px;background:#fff;border-left:2px solid var(--blue);font-size:var(--fs-small);color:var(--ink-2)}
.pm-hint .pm-reg{margin-top:2px}
.pm-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px var(--gap)}
.pm-field{display:grid;gap:8px;min-width:0}
.pm-field > span,.pm-field legend{font:600 var(--fs-ui)/1.3 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.pm-field small{font-size:var(--fs-small);color:var(--mute);line-height:1.4}
.pm-in{width:100%;min-height:50px;padding:12px 14px;border:1px solid #bfbcb7;border-radius:0;background:#fff;color:var(--ink);font:400 16px/1.3 var(--f-sans);-webkit-appearance:none;appearance:none}
.pm-in:focus{outline:2px solid var(--blue);outline-offset:0;border-color:var(--blue)}
.pm-in[aria-invalid="true"]{border-color:#a3261f}
select.pm-in{background-image:linear-gradient(45deg,transparent 50%,var(--ink) 50%),linear-gradient(135deg,var(--ink) 50%,transparent 50%);background-position:calc(100% - 20px) 50%,calc(100% - 15px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:40px}
textarea.pm-in{min-height:120px;resize:vertical}
input[type="date"].pm-in{-webkit-appearance:none;appearance:none;min-height:50px;display:block;width:100%;min-width:0;text-align:left}
.pm-step-in{display:grid;grid-template-columns:50px minmax(0,1fr) 50px;border:1px solid #bfbcb7;background:#fff}
.pm-step-in button{border:0;background:none;font:400 22px/1 var(--f-sans);color:var(--ink);cursor:pointer;min-height:48px}
.pm-step-in button:active{background:var(--well)}
.pm-step-in input{border:0;border-left:1px solid var(--hair);border-right:1px solid var(--hair);text-align:center;font:500 17px/1 var(--f-sans);font-variant-numeric:tabular-nums;min-width:0;padding:0 6px;background:#fff;color:var(--ink)}
.pm-step-in input:focus{outline:2px solid var(--blue);outline-offset:-2px}
.pm-pills{display:flex;flex-wrap:wrap;gap:8px}
.pm-pill{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border:1px solid #bfbcb7;background:#fff;color:var(--ink);font:500 15px/1.2 var(--f-sans);cursor:pointer;text-align:left}
.pm-pill[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.pm-pill[aria-pressed="true"]::before{content:"✓";font-size:12px}
.pm-docket{background:#fff;border:1px solid var(--ink);padding:clamp(18px,1.6vw,26px);display:grid;gap:14px}
.pm-docket h2{margin:0;display:flex;justify-content:space-between;align-items:baseline;gap:12px;font:400 clamp(22px,1.6vw,28px)/1.1 var(--f-serif)}
.pm-docket h2 span{font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--blue-ink)}
.pm-docket dl{margin:0;display:grid}
.pm-docket dl div{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:10px;padding:8px 0;border-bottom:1px dashed var(--hair);font-size:var(--fs-small)}
.pm-docket dt{color:var(--mute)}
.pm-docket dd{margin:0;font-weight:500}
.pm-docket__price{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding-top:6px;font:400 18px/1.2 var(--f-serif)}
.pm-docket__price b{font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.08em;text-transform:uppercase}
.pm-err{margin:0;color:#a3261f;font-size:var(--fs-small)}
.pm-sent{display:grid;gap:16px;padding:clamp(22px,2vw,36px);border:1px solid var(--ink);background:#fff}
.pm-sent h2{margin:0;font:300 clamp(30px,2.8vw,52px)/1.05 var(--f-serif);letter-spacing:-.02em}
.pm-sent p{margin:0;max-width:56ch}
.pm-sent__acts{display:flex;flex-wrap:wrap;gap:10px}
.pm-mbar{display:none}

/* ---------- staff view ---------- */
.pm-inbox{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--gap);margin-top:clamp(32px,3vw,56px);align-items:start;border-top:1px solid var(--ink)}
.pm-inbox__list{list-style:none;margin:0;padding:0}
.pm-inbox__list button{display:grid;gap:6px;width:100%;padding:16px 14px;border:0;border-bottom:1px solid var(--hair);background:none;text-align:left;cursor:pointer;color:var(--ink);font:inherit}
.pm-inbox__list button[aria-current="true"]{background:#fff;box-shadow:inset 2px 0 0 var(--blue)}
.pm-inbox__top{display:flex;justify-content:space-between;gap:10px;font:600 var(--fs-ui)/1.3 var(--f-sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.pm-inbox__list strong{font:400 19px/1.2 var(--f-serif)}
.pm-inbox__list small{color:var(--mute)}
.pm-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid currentColor;font:600 11px/1.2 var(--f-sans);letter-spacing:.08em;text-transform:uppercase}
.pm-badge[data-s="ny"]{color:var(--blue-ink)}
.pm-badge[data-s="tilbod"]{color:#8a5a00}
.pm-badge[data-s="prentun"]{color:#2d6a3a}
.pm-inbox__card{padding:clamp(18px,2vw,32px);background:#fff;border-left:1px solid var(--hair);display:grid;gap:18px;min-height:420px}
.pm-inbox__card h2{margin:0;font:300 clamp(28px,2.4vw,44px)/1.05 var(--f-serif);letter-spacing:-.02em}
.pm-inbox__acts{display:flex;flex-wrap:wrap;gap:8px}
.pm-demo{display:inline-block;margin-left:8px;padding:2px 6px;background:var(--well);font:600 10px/1.3 var(--f-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}

/* ---------- footer ---------- */
.pm-foot{padding:clamp(64px,6vw,120px) var(--gutter) max(28px,2.4vw);overflow:hidden}
.pm-foot__name{display:block;font:300 var(--foot-size,13vw)/1.08 var(--f-serif);white-space:nowrap;letter-spacing:-.05em;padding-top:.08em}
.pm-foot__grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px var(--gap);margin-top:clamp(28px,3vw,56px);padding-top:24px;border-top:1px solid var(--night-hair);color:var(--night-mute);font-size:var(--fs-small)}
.pm-foot__grid > div{display:grid;gap:8px;align-content:start}
.pm-foot__grid > div:nth-child(1){grid-column:1 / 5}
.pm-foot__grid > div:nth-child(2){grid-column:5 / 8}
.pm-foot__grid > div:nth-child(3){grid-column:8 / 11}
.pm-foot__grid > div:nth-child(4){grid-column:11 / 13}
.pm-foot__grid h2{margin:0 0 4px;font:600 var(--fs-ui)/1 var(--f-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--paper)}
.pm-foot a{text-decoration:none}
.pm-foot a:hover{color:var(--paper)}
.pm-foot__logo{width:min(240px,60%);height:auto;margin-bottom:6px}
.pm-foot__legal{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;margin-top:clamp(28px,3vw,48px);padding-top:18px;border-top:1px solid var(--night-hair);color:var(--night-mute);font-size:var(--fs-small)}

/* ---------- ≤1024 / ≤768 ---------- */
@media (max-width:1024px){
  .pm-works__head{grid-template-columns:1fr}
  .pm-works__head > div:first-child,.pm-works__filters{grid-column:1 / -1;justify-items:start}
  .pm-tabs{justify-content:flex-start}.pm-note{text-align:left}
  .pm-steps{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pm-facts{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:28px}
  .pm-types{grid-template-columns:repeat(3,minmax(0,1fr))}
  .pm-q__form{grid-column:1 / -1}.pm-q__side{grid-column:1 / -1;position:static}
  .pm-opts{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pm-state__text{grid-column:1 / -1}.pm-figs{grid-column:1 / -1}
}
@media (max-width:768px){
  html{scroll-padding-top:72px}
  .pm-nav{display:none}.pm-burger{display:grid}
  .pm-head{padding-top:calc(env(safe-area-inset-top) + 12px);padding-bottom:12px}
  .pm-hero{min-height:auto;grid-template-columns:minmax(0,1fr);padding-top:calc(env(safe-area-inset-top) + 92px);align-items:start}
  .pm-hero__text{grid-column:1;grid-row:1}
  .pm-hero__title{font-size:clamp(40px,11.4vw,64px)}
  .pm-hero__ctas{flex-direction:column;align-items:stretch}
  .pm-hero__photo{grid-column:1;grid-row:2;margin:40px 14px 30px;aspect-ratio:5/4}
  .pm-hero__meta{grid-row:3;margin-top:24px}
  .pm-hero__cap{bottom:-26px}
  .pm-svc__head{grid-template-columns:1fr}.pm-svc__head > div,.pm-svc__head p{grid-column:1 / -1}
  .pm-svc__head p{margin-top:16px}
  .pm-index a{grid-template-columns:64px minmax(0,1fr) 20px;grid-template-areas:"img t arr" "img s arr";row-gap:4px;column-gap:14px;min-height:96px}
  .pm-index__n{display:none}
  .pm .pm-index__thumb{display:block;grid-area:img;width:64px;height:64px;object-fit:cover;background:var(--well)}
  .pm-index__t{grid-area:t}.pm-index__s{grid-area:s;font-size:var(--fs-small);color:var(--mute)}
  .pm-index svg{grid-area:arr}
  .pm-index__t em{display:none}
  .pm-peek{display:none}
  .pm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pm-col:nth-child(2){margin-top:40px}.pm-col:nth-child(4){margin-top:0}
  .pm-work__veil{padding:10px}
  .pm-tabs{gap:0 16px}
  .pm-work{cursor:pointer}
  .pm-figs{grid-template-columns:1fr;gap:24px}
  .pm-flora__big,.pm-flora__text{grid-column:1 / -1}
  .pm-flora__big{font-size:clamp(120px,40vw,200px)}
  .pm-steps{grid-template-columns:1fr}
  .pm-about__photo,.pm-about__text{grid-column:1 / -1}
  .pm-about__photo{max-width:320px}
  .pm-facts{grid-template-columns:1fr}
  .pm-mail__tip{display:none}
  .pm-page{padding-top:calc(env(safe-area-inset-top) + 100px)}
  .pm-detail__photo,.pm-detail__text{grid-column:1 / -1}
  .pm-detail__photo{position:static}
  .pm-detail__photo .pm-frame{aspect-ratio:5/4}
  .pm-opts{grid-template-columns:1fr}
  .pm-more{grid-template-columns:1fr}
  .pm-types{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pm-row{grid-template-columns:1fr}
  .pm-q{padding-bottom:84px}
  .pm-q:has(input:focus,textarea:focus,select:focus) + .pm-mbar{display:none}
  .pm-mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:150;gap:12px;align-items:center;justify-content:space-between;padding:10px var(--gutter) calc(10px + env(safe-area-inset-bottom));background:var(--paper);border-top:1px solid var(--ink)}
  .pm-mbar p{margin:0;font-size:var(--fs-small);line-height:1.3;min-width:0}
  .pm-mbar p strong{display:block;font:400 16px/1.2 var(--f-serif)}
  .pm-mbar .pm-btn{min-height:46px;padding:0 16px;flex:none}
  .pm-inbox{grid-template-columns:1fr}
  .pm-inbox__card{border-left:0;border-top:1px solid var(--hair);min-height:0}
  .pm-foot__grid > div:nth-child(n){grid-column:1 / -1}
}

@media (prefers-reduced-motion:reduce){
  .pm-head,.pm-rise,.pm-fadein,.pm-unveil,.pm-note p{animation:none}
  .pm-work img,.pm-work__veil,.pm-work__line span,.pm-btn__roll span,.pm-drawer,.pm-btn__arrow,.pm-peek,.pm-index a,.pm-index__t{transition:none}
  .pm-drawer__links a{transform:none;opacity:1;transition:none}
}
`
}
