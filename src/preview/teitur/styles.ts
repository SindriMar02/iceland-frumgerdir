/* Scoped stylesheet for /preview/teitur.
   Structure from the Premier Limo inspiration (numbered bands, request card on the hero, staggered image cards,
   fleet carousel, tall route cards), motion vocabulary from the Valecampus clean-room rebuild, one stacked-sheet hero
   (the photograph stays behind, rounded sheets slide over it), tokens re-derived from Teitur's own orange.
   Everything hangs off .tj; every keyframe is prefixed tj. Body copy is 16px and up; the inspiration is a scaled
   showcase at about 11px. */

export function teiturCss(B: string): string {
  const f = (name: string) => `${B}fonts/teitur/${name}.woff2`
  return `
@font-face{font-family:"TJ Switzer";src:url(${f('Switzer-Regular')}) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"TJ Switzer";src:url(${f('Switzer-Medium')}) format("woff2");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"TJ Switzer";src:url(${f('Switzer-Semibold')}) format("woff2");font-weight:600;font-style:normal;font-display:swap}

/* Safari samples html/body for the status and home-indicator strips: warm charcoal there (this style exists only while the route is mounted) */
html,body{background-color:#221812}
html{color-scheme:light;scroll-padding-top:80px}

.tj{
  --ink:#221812;--paper:#fff;--band:#eeeae4;--band2:#e2dbd1;--mute:#5f564e;--numeral:#b6afa5;
  --line:rgba(34,24,18,.14);--line2:rgba(34,24,18,.34);
  --orange:#e8620f;--orange-hi:#f57a2c;--orange-d:#b34509;--orange-soft:#fbe3d3;--err:#b3261e;
  --r:clamp(22px,3.6vw,52px);--gut:clamp(20px,5.4vw,84px);--bar:64px;
  --ease:cubic-bezier(.16,1,.3,1);--f:"TJ Switzer",-apple-system,"Helvetica Neue",Arial,sans-serif;
  position:relative;isolation:isolate;overflow-x:clip;background:var(--ink);color:var(--ink);
  font:400 17px/1.55 var(--f);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent;
  text-size-adjust:100%;-webkit-text-size-adjust:100%;min-height:100svh;
}
@media (max-width:640px){.tj{font-size:16px}}

:where(.tj) *,:where(.tj) *::before,:where(.tj) *::after{box-sizing:border-box}
:where(.tj) img,:where(.tj) svg{display:block;max-width:100%}
:where(.tj) :is(h1,h2,h3,h4,p,ul,ol,dl,dd,figure,address,fieldset){margin:0;padding:0}
:where(.tj) :is(ul,ol){list-style:none}
:where(.tj) :is(h1,h2,h3,h4){font-weight:400;font-size:inherit;overflow-wrap:normal;hyphens:manual}
:where(.tj) address{font-style:normal}
:where(.tj) a{color:inherit;text-decoration:none}
:where(.tj) button{font:inherit;color:inherit;margin:0;padding:0;border:0;background:none;cursor:pointer;text-align:inherit}
:where(.tj) :is(a,button,input,select,textarea,summary){touch-action:manipulation}
:where(.tj) :is(input,select,textarea){font:inherit;color:inherit;margin:0;border-radius:0}
.tj :focus-visible{outline:2px solid var(--orange);outline-offset:3px;border-radius:4px}
.tj ::selection{background:var(--orange);color:var(--ink)}

.tj-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.tj-skip:focus{width:auto;height:auto;clip-path:none;left:8px;top:8px;z-index:400;padding:.7rem 1rem;background:#fff;color:var(--ink);border-radius:6px;position:fixed}
.tj-wrap{width:min(100% - 2*var(--gut),1320px);margin-inline:auto}
.tj-fine{font-size:14px;line-height:1.45;color:var(--mute)}
.tj-center{display:flex;justify-content:center}
.tj-link{display:inline-flex;align-items:center;min-height:44px;color:var(--orange-d);font-weight:500;text-decoration:underline;text-underline-offset:3px}
.tj-link:hover{color:var(--ink)}

/* ---------- white cover until the hero picture has loaded (Valecampus M1) ---------- */
.tj-cover{position:fixed;inset:0;z-index:300;background:#fff;opacity:1;pointer-events:none;transition:opacity .45s ease .1s}
.tj-cover.is-off{opacity:0;visibility:hidden;transition:opacity .45s ease .1s,visibility 0s .6s}

/* ---------- chrome: the house mobile standard, a constant glass bar and a sticky awning ---------- */
.tj-awning{position:sticky;top:-100px;height:106px;margin-top:-42px;margin-bottom:-64px;z-index:140;background:var(--ink);pointer-events:none}
.tj-bar{position:fixed;inset:0 0 auto 0;z-index:150;height:var(--bar);background-color:rgba(34,24,18,.88);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);color:#fff}
.tj-bar__in{padding-top:env(safe-area-inset-top,0px);height:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:1.5rem;padding:0 var(--gut)}
.tj-brand{align-self:start;display:block;line-height:0}
.tj-brand img{height:56px;width:auto}
@media (max-width:640px){.tj-brand img{height:48px}}
.tj-nav ul{display:flex;gap:.25rem}
.tj-nav__item{position:relative}
.tj-nav__btn{display:inline-flex;align-items:center;gap:.4rem;min-height:44px;padding:0 .85rem;border-radius:8px;font-weight:500;font-size:15px;color:#fff;transition:background-color .2s}
.tj-nav__btn:hover,.tj-nav__btn[aria-expanded="true"]{background:rgba(255,255,255,.1)}
.tj-nav__btn svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:1.6;transition:transform .25s var(--ease)}
.tj-nav__btn[aria-expanded="true"] svg{transform:rotate(180deg)}
.tj-dd{position:absolute;top:100%;left:0;min-width:250px;padding:8px;background:var(--ink);border:1px solid rgba(255,255,255,.1);border-radius:14px;box-shadow:0 22px 60px rgba(0,0,0,.4);
  visibility:hidden;opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .3s var(--ease),visibility 0s .3s}
.tj-dd[data-open="true"]{visibility:visible;opacity:1;transform:none;transition:opacity .2s ease,transform .3s var(--ease)}
.tj-dd a{display:flex;align-items:center;min-height:44px;padding:0 .85rem;border-radius:8px;font-size:15px;color:rgba(255,255,255,.9)}
.tj-dd a:hover{background:rgba(255,255,255,.1);color:#fff}
.tj-bar__end{display:flex;align-items:center;gap:1rem;justify-self:end}
.tj-bar__agents{font-size:14px;color:rgba(255,255,255,.85);text-decoration:underline;text-underline-offset:4px;min-height:44px;display:inline-flex;align-items:center}
.tj-bar__agents:hover{color:#fff}
.tj-bar__tel{font-weight:500;font-size:15px;min-height:44px;display:inline-flex;align-items:center;font-variant-numeric:tabular-nums}
.tj-lang{display:flex;border:1px solid rgba(255,255,255,.28);border-radius:6px;overflow:hidden}
.tj-lang a{display:grid;place-items:center;min-width:44px;min-height:38px;font-size:13px;font-weight:600;letter-spacing:.06em;color:rgba(255,255,255,.85)}
.tj-lang a.is-on{background:#fff;color:var(--ink)}
.tj-bar__cta{min-height:44px}
.tj-burger{display:none;min-height:44px;padding:0 .2rem;font-size:15px;font-weight:600;letter-spacing:.04em;color:#fff}
@media (max-width:1240px){.tj-bar__agents{display:none}}
@media (max-width:1080px){.tj-bar__tel{display:none}}
@media (max-width:960px){.tj-nav,.tj-lang{display:none}.tj-burger{display:block}.tj-bar__in{grid-template-columns:auto 1fr}}
@media (max-width:479px){.tj-bar .tj-bar__cta{display:none}}
.tj-menu{position:fixed;inset:var(--bar) 0 0 0;z-index:149;background:var(--ink);color:#fff;visibility:hidden;clip-path:inset(0 0 100% 0);transition:clip-path .25s cubic-bezier(.23,1,.32,1),visibility 0s .25s}
.tj-menu.is-open{visibility:visible;clip-path:inset(0);transition:clip-path .45s var(--ease)}
.tj-menu__in{height:100%;overflow:auto;padding:1.25rem var(--gut) calc(1.5rem + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:.15rem;overscroll-behavior:contain}
.tj-menu__h{margin-top:1.25rem;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.tj-menu__in>a:not(.tj-btn){display:flex;align-items:center;min-height:52px;font-size:1.5rem;letter-spacing:-.02em;font-weight:500}
.tj-menu__in>a.tj-menu__agents{margin-top:1rem;font-size:1.1rem;color:rgba(255,255,255,.85);text-decoration:underline;text-underline-offset:4px}
.tj-menu__foot{padding:.25rem 0 .5rem;display:grid;gap:.6rem}
.tj-menu__in>a.tj-menu__solo{margin-top:1.25rem}
.tj-menu__lang{display:flex;align-items:center;justify-content:center;min-height:48px;font-size:1rem;color:rgba(255,255,255,.85)}
@media (min-width:961px){.tj-menu{display:none}}

/* ---------- buttons ---------- */
.tj-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:48px;padding:0 1.4rem;border-radius:6px;font-weight:500;font-size:16px;line-height:1;white-space:nowrap;text-align:center;
  transition:transform .2s var(--ease),background-color .2s,color .2s,border-color .2s}
.tj-btn:active{transform:scale(.97)}
.tj-btn:disabled{opacity:.45;cursor:not-allowed}
.tj-btn--orange{background:var(--orange);color:var(--ink)}
.tj-btn--orange:hover{background:var(--orange-hi)}
.tj-btn--dark{background:var(--ink);color:#fff}
.tj-btn--dark:hover{background:#3b2c22}
.tj-btn--line{border:1px solid var(--line2);color:var(--ink)}
.tj-btn--line:hover{border-color:var(--ink)}
.tj-btn--line-light{border:1px solid rgba(255,255,255,.55);color:#fff}
.tj-btn--line-light:hover{border-color:#fff;background:rgba(255,255,255,.1)}
.tj-btn--sm{min-height:44px;padding:0 1rem;font-size:15px}
.tj-btn--block{width:100%}
.tj-arr{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#fff;color:var(--ink);flex:none;transition:transform .4s var(--ease),background-color .2s}
.tj-arr svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.tj-arr--orange{background:var(--orange)}
@media (hover:hover) and (pointer:fine){a:hover>.tj-svc__foot .tj-arr,button:hover>.tj-tile__art .tj-arr,.tj-bus__go:hover .tj-arr{transform:rotate(45deg) scale(1.06)}}

/* ---------- hero: the photograph stays behind, the sheet slides over it ---------- */
.tj-hero{position:relative;z-index:0;color:#fff;background:var(--ink);display:flex;flex-direction:column;min-height:100svh}
.tj-hero__media{position:absolute;inset:0;z-index:0;overflow:hidden}
.tj-crop{display:block;width:100%;height:100%}
.tj-hero__media .tj-crop{position:absolute;inset:0}
.tj-hero__shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,14,8,.62) 0%,rgba(24,14,8,.3) 34%,rgba(24,14,8,.06) 58%,rgba(24,14,8,.5) 100%),linear-gradient(90deg,rgba(24,14,8,.66) 0%,rgba(24,14,8,.28) 45%,rgba(24,14,8,0) 70%)}
.tj-hero__in{position:relative;z-index:1;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 410px;align-items:start;gap:clamp(2rem,4vw,4rem);width:min(100% - 2*var(--gut),1320px);margin-inline:auto;padding:calc(var(--bar) + 2.5rem) 0 calc(var(--r) + 3.5rem)}
.tj-hero__copy{align-self:start;max-width:min(100%,840px);padding-top:clamp(1rem,5vh,3.5rem)}
.tj-hero__card{justify-self:end;align-self:start;margin-top:clamp(0rem,1.5vw,1.5rem)}
.tj-hero__card .tj-card{margin-left:auto}
.tj-eyebrow{display:flex;align-items:center;font-size:14px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.92);margin-bottom:1.1rem}
.tj-eyebrow::before{content:"";display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--orange);margin-right:.65rem;flex:none}
.tj-eyebrow--dark{color:var(--orange-d)}
.tj-h1{font-weight:500;font-size:clamp(2.1rem,5vw,4.6rem);line-height:1.04;letter-spacing:-.035em;text-wrap:balance}
.tj-hero .tj-h1{font-size:clamp(2.1rem,3.9vw,3.6rem);max-width:19ch;text-shadow:0 2px 30px rgba(20,12,6,.42)}
@media (min-width:1240px){.tj-hero .tj-h1{max-width:26ch}}
.tj-hero__lead{font-size:clamp(1.05rem,1.4vw,1.3rem);line-height:1.45;max-width:36ch;margin:1.25rem 0 1.6rem;color:rgba(255,255,255,.95);text-shadow:0 1px 18px rgba(20,12,6,.45)}
.tj-hero__card{transition-delay:.35s !important}
/* slideshow: crossfade 1.2s, a slow settle from 1.07 to 1 (transform and opacity only), the outgoing photograph is reset after it has faded */
.tj-slide{position:absolute;inset:0;opacity:0;transition:opacity 1.2s ease}
.tj-slide.is-on{opacity:1}
.tj-slide img{width:100%;height:100%;object-fit:cover;transform:scale(1.07);transition:transform 0s linear 1.3s}
.tj-slide.is-on img{transform:scale(1);transition:transform 7.5s linear}
.tj-slidectl{position:absolute;z-index:3;left:var(--gut);bottom:calc(var(--r) + 1.25rem);display:flex;align-items:center;gap:.35rem;color:#fff}
.tj-slidectl__pause{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(34,24,18,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:background-color .2s}
.tj-slidectl__pause:hover{background:rgba(34,24,18,.8)}
.tj-slidectl__pause svg{width:18px;height:18px;stroke:currentColor;fill:currentColor;stroke-width:2;stroke-linecap:round}
.tj-dots{display:flex}
.tj-dot{width:44px;height:44px;display:grid;place-items:center}
.tj-dot span{display:block;width:22px;height:3px;border-radius:2px;background:rgba(255,255,255,.5);transition:background-color .3s ease,width .3s var(--ease)}
.tj-dot.is-on span{background:#fff;width:30px}
.tj-dot:hover span{background:#fff}
/* the calendar opens inside the hero: lift the hero over the sheet while it is open, or the sheet would cut it off */
.tj-hero:has(.tj-pop){z-index:6}
@media (min-width:961px){.tj-hero{position:sticky;top:0;height:100svh}}
@media (min-width:961px) and (max-height:760px){.tj-hero{position:relative;height:auto;min-height:100svh}}

/* the request card on the photograph (the inspiration's one lifted object) */
.tj-card{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(20px) saturate(1.35);backdrop-filter:blur(20px) saturate(1.35);border:1px solid rgba(255,255,255,.55);color:var(--ink);border-radius:14px;padding:22px 22px 18px;width:min(100%,410px);box-shadow:0 22px 70px rgba(20,12,6,.3);display:grid;gap:.85rem}
.tj-card .tj-field__label,.tj-card .tj-card__fine{color:#3f362f}
.tj-card .tj-input::placeholder{color:#5a5048}
.tj-card .tj-input{border-bottom-color:rgba(34,24,18,.5)}
.tj-card .tj-input--btn.is-empty{color:#5a5048}
.tj-card .tj-tab:hover:not(.is-on){background:rgba(255,255,255,.55)}
.tj-card__h{font-size:1.35rem;font-weight:500;letter-spacing:-.015em}
.tj-card__row{display:grid;grid-template-columns:1.2fr 1fr;gap:1rem}
.tj-card__fine{font-size:13.5px;line-height:1.4;color:var(--mute)}
.tj-card__call{font-size:15px;color:var(--ink)}
.tj-card__call a{color:var(--orange-d);font-weight:600;text-decoration:underline;text-underline-offset:3px;font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;min-height:44px;min-width:44px}
.tj-chipline{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.25rem .75rem;font-size:14px;background:var(--orange-soft);border-radius:6px;padding:.3rem .7rem;color:#5a2606}
.tj-chipline .tj-link{min-height:36px;font-size:14px;color:#5a2606}
@media (max-width:960px){
  .tj-hero{min-height:0}
  .tj-hero__in{display:block;width:auto;margin:0;padding:0}
  .tj-hero{--ph:66.667vw}
  .tj-hero__media{position:relative;inset:auto;margin-top:var(--bar);aspect-ratio:3/2;height:auto}
  .tj-slide img,.tj-slide.is-on img{transform:none;transition:none}
  .tj-hero__shade{background:linear-gradient(180deg,rgba(24,14,8,0) 62%,rgba(24,14,8,.55) 100%)}
  .tj-hero__copy{max-width:none;align-self:auto;padding:1.6rem var(--gut) calc(var(--r) + 1.6rem);min-height:0;display:block}
  .tj-hero .tj-h1,.tj-hero__lead{text-shadow:none}
  .tj-hero .tj-h1{max-width:none}
  .tj-hero__lead{margin:.9rem 0 0}
  .tj-hero__cta{display:none}
  .tj-hero__card{position:relative;z-index:2;background:#fff;border-radius:var(--r) var(--r) 0 0;margin-top:calc(var(--r) * -1);padding:1.5rem var(--gut) calc(2.25rem + var(--r))}
  .tj-hero__card{margin-top:calc(var(--r) * -1)}
  .tj-hero__card .tj-card,.tj-card{background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;border:0;box-shadow:none;padding:0;width:100%;max-width:520px;margin-inline:auto}
  .tj-card .tj-field__label,.tj-card .tj-card__fine{color:var(--mute)}
  .tj-card .tj-input{border-bottom-color:var(--line2)}
  .tj-card .tj-input::placeholder,.tj-card .tj-input--btn.is-empty{color:#766d64}
  .tj-slidectl{left:var(--gut);right:auto;bottom:auto;top:calc(var(--bar) + var(--ph) - 3.6rem)}
}
@media (min-width:641px) and (max-width:960px){.tj-hero{--ph:62.5vw}.tj-hero__media{aspect-ratio:16/10}}
@media (max-width:420px){.tj-card__row{grid-template-columns:minmax(0,1fr)}}

/* ---------- sheets and bands ---------- */
.tj-sheet{position:relative;z-index:2;margin-top:calc(var(--r) * -1);border-radius:var(--r) var(--r) 0 0;background:var(--paper);color:var(--ink);overflow:clip}
@media (max-width:960px){.tj-sheet{margin-top:calc(var(--r) * -1)}}
.tj-page.tj-sheet{margin-top:0;padding-top:1.5rem;min-height:70svh}
.tj-sec{padding:clamp(3.75rem,7.5vw,7rem) 0;scroll-margin-top:calc(var(--bar) + 8px)}
.tj-sec--band{background:var(--band)}
.tj-shead{display:grid;grid-template-columns:1fr auto 1fr;align-items:baseline;padding-bottom:1.4rem;margin-bottom:clamp(2rem,4vw,3.5rem);border-bottom:1px solid var(--line)}
.tj-shead__n{font-size:clamp(1.7rem,2.8vw,2.6rem);letter-spacing:-.02em;color:var(--numeral);line-height:1}
.tj-shead__t{grid-column:2;text-align:center;text-wrap:balance;font-size:clamp(2rem,3.7vw,3.4rem);letter-spacing:-.035em;line-height:1.05}
@media (max-width:640px){
  .tj-shead{display:block;text-align:center}
  .tj-shead__n{display:block;font-size:1.5rem;margin-bottom:.35rem}
  .tj-shead__t{font-size:clamp(1.75rem,8vw,2.4rem)}
}
.tj-statement{max-width:30ch;margin:clamp(2rem,4vw,3.25rem) auto 1.75rem;text-align:center;font-size:clamp(1.4rem,2.3vw,2.1rem);line-height:1.22;letter-spacing:-.02em;text-wrap:balance}
.tj-statement--left{margin:0 0 1.5rem;text-align:left;max-width:56ch;font-size:clamp(1.1rem,1.5vw,1.3rem);line-height:1.45;letter-spacing:0;color:var(--mute)}

/* ---------- masked line reveals, fades and crops (Valecampus M02 to M06) ---------- */
.tj-lm{display:block;overflow:hidden;padding:.12em 0 .16em;margin:-.12em 0 -.16em}
.tj-ll{display:block}
.tj-motion [data-lines]:not(.is-split){visibility:hidden}
.tj-motion .tj-ll{transform:translateY(108%);transition:transform 1s var(--ease);transition-delay:calc(var(--i,0) * .15s)}
.tj-motion [data-lines].is-in .tj-ll{transform:none}
.tj-motion [data-reveal="fade"]{opacity:0;transition:opacity .6s ease .45s}
.tj-motion [data-reveal="fade"].is-in{opacity:1}
.tj-motion [data-reveal="crop"] .tj-crop{clip-path:inset(3%);transition:clip-path 1s var(--ease)}
.tj-motion [data-reveal="crop"].is-in .tj-crop{clip-path:inset(0)}
[data-parallax]{will-change:transform}
@media (hover:none),(pointer:coarse){[data-parallax]{will-change:auto}}
@media (prefers-reduced-motion:reduce){
  .tj *,.tj *::before,.tj *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;animation-iteration-count:1 !important}
  }

/* ---------- 01 services ---------- */
.tj-svc{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(.75rem,1.4vw,1.25rem);align-items:start;padding-bottom:clamp(1rem,3vw,2.5rem)}
.tj-svc__cell.is-tall{margin-top:clamp(1.5rem,4vw,3.5rem)}
.tj-svc__card{position:relative;display:block;aspect-ratio:4/4.5;border-radius:14px;overflow:hidden;color:#fff;isolation:isolate;background:var(--band2)}
.is-tall .tj-svc__card{aspect-ratio:4/5.2}
.tj-svc__img{position:absolute;inset:0;display:block}
.tj-svc__img img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
@media (hover:hover) and (pointer:fine){.tj-svc__card:hover .tj-svc__img img{transform:scale(1.04)}}
.tj-svc__card::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(24,14,8,.16) 0%,rgba(24,14,8,0) 30%,rgba(24,14,8,.82) 100%)}
.tj-chip{position:absolute;z-index:2;top:14px;left:14px;max-width:calc(100% - 28px);background:#f4f2f0;color:var(--ink);border-radius:6px;padding:.42rem .7rem;font-size:14px;font-weight:500;line-height:1.15}
.tj-svc__foot{position:absolute;z-index:2;left:16px;right:16px;bottom:16px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.tj-svc__text{font-size:16px;line-height:1.35;max-width:30ch}
.tj-uses{margin-top:clamp(3rem,6vw,5rem);padding-top:2rem;border-top:1px solid var(--line)}
.tj-uses__h{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-bottom:1.5rem}
.tj-uses ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1.5rem,3vw,3rem)}
.tj-uses h4{font-size:1.3rem;font-weight:500;letter-spacing:-.015em;line-height:1.15;margin-bottom:.5rem}
.tj-uses p{color:var(--mute);max-width:40ch}
@media (max-width:820px){
  .tj-svc{grid-template-columns:minmax(0,1fr);gap:1rem}
  .tj-svc__cell.is-tall{margin-top:0}
  .tj-svc__card,.is-tall .tj-svc__card{aspect-ratio:4/3.6}
  .tj-uses ul{grid-template-columns:minmax(0,1fr)}
}

/* ---------- 02 fleet ---------- */
.tj-filters{display:flex;flex-wrap:wrap;gap:.4rem}
.tj-filter{min-height:44px;padding:0 1.1rem;border-radius:6px;font-size:14px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);transition:background-color .2s,color .2s}
.tj-filter:hover{background:var(--band)}
.tj-filter.is-on{background:var(--ink);color:#fff}
.tj-rail{--pad:max(var(--gut),calc((100vw - 1320px) / 2));display:grid;grid-auto-flow:column;grid-auto-columns:min(46vw,560px);gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;
  padding:1.6rem var(--pad) 1rem;scroll-padding-inline:var(--pad);scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
.tj-rail::-webkit-scrollbar{display:none}
.tj-bus{scroll-snap-align:start;background:var(--band);border-radius:16px;padding:12px;display:flex;flex-direction:column;min-width:0}
.tj-bus__img{border-radius:12px;overflow:hidden;aspect-ratio:16/10;background:var(--band2)}
.tj-bus__img img{width:100%;height:100%;object-fit:cover}
.tj-bus__body{padding:1.1rem .6rem .4rem;display:flex;flex-direction:column;gap:.55rem;flex:1}
.tj-bus__name{font-size:1.5rem;font-weight:500;letter-spacing:-.02em;line-height:1.1}
.tj-bus__seats{color:var(--mute)}
.tj-bus__seats strong{color:var(--ink);font-weight:600;font-size:1.15rem}
.tj-bus__tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.6rem}
.tj-bus__tags li{background:#fff;border-radius:6px;padding:.3rem .6rem;font-size:14px;line-height:1.2}
.tj-bus__go{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:56px;padding-top:.6rem;border-top:1px solid var(--line);font-weight:500;text-align:left}
.tj-empty{color:var(--mute);padding:1rem 0}
.tj-railbar{display:flex;align-items:center;justify-content:space-between;gap:.75rem 1.5rem;flex-wrap:wrap;margin-top:.75rem}
.tj-railbar__nav{display:flex;align-items:center;gap:.6rem}
.tj-railbar__note{flex:1 1 240px}
.tj-round{width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);display:grid;place-items:center;transition:background-color .2s}
.tj-round:hover:not(:disabled){background:var(--band)}
.tj-round:disabled{opacity:.3;cursor:default}
.tj-round svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.tj-count{margin-left:.5rem;font-size:15px;color:var(--mute)}
@media (max-width:820px){.tj-rail{grid-auto-columns:min(84vw,420px)}}

/* ---------- 03 routes: the campus-map idea as five tall tiles ---------- */
.tj-routes{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,2.15fr);gap:clamp(2rem,5vw,5rem);align-items:start}
.tj-routes__copy{display:grid;gap:1.1rem;justify-items:start}
.tj-routes__copy p:first-child{font-size:1.2rem;line-height:1.5;max-width:34ch}
.tj-tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.tj-tile{display:flex;flex-direction:column;gap:.7rem;text-align:left;min-width:0;transition:transform .5s var(--ease)}
@media (hover:hover) and (pointer:fine){.tj-tile:hover{transform:translateY(-4px)}.tj-tile:hover .tj-route{animation:tjDash 1.4s linear infinite}}
.tj-tile__art{position:relative;display:block;aspect-ratio:3/4.3;border-radius:14px;overflow:hidden;background:#d9d1c5}
.tj-tile__map{position:absolute;inset:0;width:100%;height:100%}
.tj-land{fill:#fbf8f3}
.tj-route{fill:none;stroke:var(--orange);stroke-width:2.6px;vector-effect:non-scaling-stroke;stroke-dasharray:7 6;stroke-linecap:round;stroke-linejoin:round}
@keyframes tjDash{to{stroke-dashoffset:-26}}
.tj-pin{fill:var(--ink)}
.tj-pin--home{fill:var(--orange);stroke:#fff;stroke-width:1.6px;vector-effect:non-scaling-stroke}
.tj-tile__art .tj-chip{top:10px;left:10px;max-width:calc(100% - 20px)}
.tj-tile__foot{position:absolute;left:10px;right:10px;bottom:10px;display:flex;align-items:flex-end;justify-content:space-between;gap:8px}
.tj-tile__tab{display:inline-block;background:rgba(34,24,18,.88);color:#fff;border-radius:6px;padding:.3rem .55rem;font-size:13px;font-weight:500;line-height:1.15}
.tj-tile__stops{font-size:15px;line-height:1.35;color:var(--mute);padding:0 .15rem}
@media (max-width:1100px){
  .tj-tile__art{aspect-ratio:4/4.4}
  .tj-routes{grid-template-columns:minmax(0,1fr)}
  .tj-tiles{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:min(58vw,240px);overflow-x:auto;scroll-snap-type:x mandatory;margin-inline:calc(var(--gut) * -1);padding-inline:var(--gut);scroll-padding-inline:var(--gut);scrollbar-width:none;overscroll-behavior-x:contain}
  .tj-tiles::-webkit-scrollbar{display:none}
  .tj-tile{scroll-snap-align:start}
}

/* ---------- 04 about ---------- */
.tj-about{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(2rem,5vw,5rem);align-items:start}
.tj-about__img{display:block;aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:var(--band2)}
.tj-about__img img{width:100%;height:100%;object-fit:cover}
.tj-about__lead{margin-top:1.5rem;font-size:clamp(1.6rem,2.6vw,2.4rem);line-height:1.1;letter-spacing:-.03em;max-width:18ch;text-wrap:balance}
.tj-about__addr{margin-top:.8rem;color:var(--mute);max-width:44ch}
.tj-acc{border-top:1px solid var(--line)}
.tj-acc__i{border-bottom:1px solid var(--line)}
.tj-acc__head{display:grid;grid-template-columns:2.4rem 7.4rem minmax(0,1fr) 22px;align-items:baseline;gap:.5rem .75rem;width:100%;min-height:60px;padding:1rem 0}
.tj-acc__n{color:var(--numeral);font-size:15px}
.tj-acc__y{font-weight:600;color:var(--orange-d);font-variant-numeric:tabular-nums}
.tj-acc__t{font-size:1.15rem;letter-spacing:-.01em;line-height:1.25}
.tj-acc__pm{position:relative;width:16px;height:16px;align-self:center;justify-self:end}
.tj-acc__pm::before,.tj-acc__pm::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.6px;background:var(--ink);margin-top:-.8px;transition:transform .3s var(--ease)}
.tj-acc__pm::after{transform:rotate(90deg)}
.is-open .tj-acc__pm::after{transform:rotate(0)}
.tj-acc__panel{display:grid;grid-template-rows:0fr;visibility:hidden;transition:grid-template-rows .3s var(--ease),visibility 0s .3s}
.is-open .tj-acc__panel{grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .3s var(--ease)}
.tj-acc__panel>div{overflow:hidden}
.tj-acc__panel p{padding:0 0 1.3rem calc(2.4rem + 7.4rem + 1.5rem);color:var(--mute);max-width:60ch}
@media (max-width:960px){.tj-about{grid-template-columns:minmax(0,1fr)}}
@media (max-width:640px){
  .tj-acc__head{grid-template-columns:2rem minmax(0,1fr) 22px}
  .tj-acc__y{grid-column:2;grid-row:1}
  .tj-acc__t{grid-column:2;grid-row:2}
  .tj-acc__n{grid-row:1 / span 2;align-self:start;padding-top:.15rem}
  .tj-acc__pm{grid-column:3;grid-row:1 / span 2}
  .tj-acc__panel p{padding-left:2.75rem}
}
.tj-safety{background:var(--ink);color:#fff;border-radius:var(--r);margin:clamp(3rem,6vw,5rem) clamp(12px,1.4vw,20px) 0;padding:clamp(2.5rem,5vw,4.5rem) 0;scroll-margin-top:calc(var(--bar) + 8px)}
.tj-safety__h{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.66);margin-bottom:1.75rem}
.tj-safety__list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1.75rem,3.5vw,3.5rem)}
.tj-safety__list li{border-top:2px solid var(--orange);padding-top:1.1rem}
.tj-safety__list h4{font-size:clamp(1.3rem,1.9vw,1.7rem);font-weight:500;letter-spacing:-.02em;line-height:1.12;margin-bottom:.6rem}
.tj-safety__list p{color:rgba(255,255,255,.8);max-width:36ch}
@media (max-width:820px){.tj-safety__list{grid-template-columns:minmax(0,1fr)}}

/* ---------- 05 agents strip ---------- */
.tj-agentband{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(2rem,5vw,5rem);align-items:center}
.tj-agentband__copy>p{font-size:1.2rem;line-height:1.5;max-width:44ch}
.tj-agentband__copy ul{margin:1.5rem 0 2rem;display:grid;gap:.55rem}
.tj-agentband__copy li{position:relative;padding-left:1.7rem}
.tj-agentband__copy li::before{content:"";position:absolute;left:0;top:.8em;width:.75rem;height:2px;background:var(--orange)}
.tj-agentband__pic{position:relative}
.tj-agentband__img{display:block;aspect-ratio:16/11;border-radius:14px;overflow:hidden;background:var(--band2)}
.tj-agentband__img img{width:100%;height:100%;object-fit:cover}
.tj-mini{margin-top:1rem;background:#fff;border-radius:14px;padding:1rem 1.2rem;border:1px solid var(--line)}
.tj-mini__h{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;flex-wrap:wrap;font-weight:500;font-size:15px;margin-bottom:.35rem}
.tj-mini__h span{color:var(--orange-d);text-transform:uppercase;font-size:12px;letter-spacing:.08em;font-weight:600}
.tj-mini li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.15rem .75rem;padding:.55rem 0;border-top:1px solid var(--line);font-size:15px;line-height:1.3}
.tj-mini li span{min-width:0;flex:1 1 9rem}
.tj-mini em{font-style:normal;color:var(--mute)}
@media (max-width:960px){.tj-agentband{grid-template-columns:minmax(0,1fr)}}

/* ---------- closing panel and footer ---------- */
.tj-close{background:var(--ink);color:#fff;margin-top:calc(var(--r) * -1);border-radius:var(--r) var(--r) 0 0;position:relative;padding-top:calc(clamp(3.75rem,7.5vw,7rem) + var(--r) * .4);padding-bottom:clamp(3rem,6vw,5rem)}
.tj-close__in{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:clamp(2rem,4vw,4rem);align-items:end}
.tj-close__h{font-size:clamp(2.2rem,5.2vw,4.8rem);font-weight:500;line-height:1;letter-spacing:-.04em;max-width:15ch;margin-bottom:1.4rem;text-wrap:balance}
.tj-close__copy>p{font-size:1.2rem;color:rgba(255,255,255,.82);max-width:42ch}
.tj-close__cta{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.75rem}
.tj-close__addr{font-size:1.15rem;line-height:1.5;color:rgba(255,255,255,.85);border-top:1px solid rgba(255,255,255,.2);padding-top:1.2rem}
.tj-close__addr strong{display:block;font-weight:600;color:#fff}
.tj-close__addr a{display:inline-flex;align-items:center;min-height:44px;color:var(--orange-hi);font-weight:500}
@media (max-width:820px){.tj-close__in{grid-template-columns:minmax(0,1fr)}}
.tj-foot{background:var(--ink);color:rgba(255,255,255,.82);padding:clamp(2.5rem,5vw,4rem) 0 1.5rem;border-top:1px solid rgba(255,255,255,.1)}
.tj-foot__in{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:2rem}
.tj-foot__brand img{height:auto;width:112px;margin-bottom:1rem}
.tj-foot__brand p{font-size:16px;line-height:1.6}
.tj-foot__brand a,.tj-foot__col a{display:inline-flex;align-items:center;min-height:44px;min-width:44px;color:rgba(255,255,255,.9)}
.tj-foot__brand a:hover,.tj-foot__col a:hover{color:var(--orange-hi)}
.tj-foot__col{display:flex;flex-direction:column;align-items:flex-start}
.tj-foot__col h2{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:.4rem}
.tj-foot__note{margin-top:1.5rem;font-size:14px;color:rgba(255,255,255,.62)}
@media (max-width:820px){.tj-foot__in{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.tj-foot__brand{grid-column:1 / -1}}
.tj-pf>footer{background-color:var(--ink)}
/* Tailwind v4 utilities live in a cascade layer, so this unlayered reset would beat mx-auto in the shared footer */
.tj-pf p{margin-inline:auto}
/* the shared footer's small inline links: widen the hit area to 44px without moving the text */
.tj-pf a{display:inline-block;padding:.8rem .45rem;margin:-.8rem -.45rem}
.tj-pf p+p{margin-top:.5rem}

/* ---------- forms ---------- */
.tj-field{display:block;min-width:0}
.tj-field__label{display:block;font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1.25;color:var(--mute);margin-bottom:.1rem}
.tj-field__hint{font-size:13.5px;line-height:1.4;color:var(--mute);margin-top:.3rem}
.tj-field__error{font-size:14px;line-height:1.35;color:var(--err);margin-top:.35rem}
.tj-input{display:block;width:100%;min-height:48px;padding:.55rem 0;border:0;border-bottom:1px solid var(--line2);background:transparent;font-size:16px;line-height:1.3;color:var(--ink);-webkit-appearance:none;appearance:none;border-radius:0;transition:border-color .2s,box-shadow .2s}
.tj-input::placeholder{color:#766d64;opacity:1}
.tj-input:focus{outline:none;border-bottom-color:var(--ink);box-shadow:0 1.5px 0 0 var(--orange)}
.tj-input:focus-visible{outline:none}
.has-error .tj-input,.has-error .tj-stepper{border-bottom-color:var(--err)}
.tj-input--btn{display:flex;align-items:center;justify-content:space-between;gap:.5rem;text-align:left;cursor:pointer}
.tj-input--btn span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tj-input--btn.is-empty{color:#766d64}
.tj-input--btn svg{width:20px;height:20px;flex:none;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.tj-input--btn:focus-visible{box-shadow:0 1.5px 0 0 var(--orange)}
.tj-input--select{background-color:#fff;color:var(--ink);background-image:linear-gradient(45deg,transparent 50%,var(--ink) 50%),linear-gradient(135deg,var(--ink) 50%,transparent 50%);background-position:calc(100% - 12px) 55%,calc(100% - 7px) 55%;background-size:5px 5px;background-repeat:no-repeat;padding-right:1.75rem}
.tj-input--area{resize:vertical;min-height:112px;border:1px solid var(--line2);border-radius:8px;padding:.7rem .8rem;margin-top:.35rem}
.tj-input--area:focus{border-color:var(--ink);box-shadow:0 0 0 2px var(--orange)}
.tj-input--num{text-align:center;font-variant-numeric:tabular-nums}
.tj-stepper{display:flex;align-items:center;border-bottom:1px solid var(--line2)}
.tj-stepper .tj-input{border:0;box-shadow:none;min-width:0;flex:1}
.tj-stepper:focus-within{border-bottom-color:var(--ink);box-shadow:0 1.5px 0 0 var(--orange)}
.tj-stepper__b{width:44px;height:44px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:22px;line-height:1;transition:background-color .2s}
.tj-stepper__b:hover:not(:disabled){background:var(--band)}
.tj-stepper__b:disabled{opacity:.3;cursor:default}
.tj-tabs{display:flex;flex-wrap:wrap;gap:.3rem}
.tj-tab{min-height:44px;padding:0 .95rem;border-radius:6px;font-size:14.5px;font-weight:500;line-height:1.15;color:var(--ink);text-align:center;transition:background-color .2s}
.tj-tab:hover:not(.is-on){background:var(--band)}
.tj-tab.is-on{background:var(--orange);color:var(--ink)}
.tj-tabs--small .tj-tab{flex:1 1 auto;padding:0 .5rem;font-size:14px}
.tj-datefield{position:relative}
.tj-pop{position:absolute;z-index:40;top:calc(100% + 6px);left:0;width:min(680px,calc(100vw - 2 * var(--gut)));background:#fff;border-radius:14px;padding:16px;box-shadow:0 22px 70px rgba(20,12,6,.34),0 0 0 1px var(--line)}
.tj-pop--one{width:min(340px,calc(100vw - 2 * var(--gut)))}
.tj-pop__scrim{display:none}
.tj-pop__foot{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem}
@media (max-width:700px){
  .tj-pop,.tj-pop--one{position:fixed;left:0;right:0;bottom:0;top:auto;width:auto;z-index:250;border-radius:16px 16px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));max-height:88svh;overflow:auto}
  .tj-pop__scrim{display:block;position:fixed;inset:0;z-index:249;background:rgba(20,12,6,.5)}
}
.tj-cal__nav{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;margin-bottom:.4rem}
.tj-cal__arrow{width:44px;height:44px;border-radius:50%;display:grid;place-items:center}
.tj-cal__arrow:hover:not(:disabled){background:var(--band)}
.tj-cal__arrow:disabled{opacity:.28;cursor:default}
.tj-cal__arrow svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.tj-cal__hint{font-size:14px;color:var(--mute);text-align:center;line-height:1.3}
.tj-cal__months{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem}
.tj-cal--one .tj-cal__months{grid-template-columns:minmax(0,1fr)}
@media (max-width:700px){.tj-cal__months{grid-template-columns:minmax(0,1fr)}.tj-cal__m:nth-child(2){display:none}}
.tj-cal__title{text-align:center;font-weight:600;margin-bottom:.35rem;text-transform:capitalize}
.tj-cal__dow,.tj-cal__grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
.tj-cal__dow span{text-align:center;font-size:12.5px;color:var(--mute);padding:.3rem 0}
.tj-cal__d{position:relative;height:44px;display:grid;place-items:center;font-size:15px;font-variant-numeric:tabular-nums}
.tj-cal__d span{position:relative;z-index:1}
.tj-cal__d:hover:not(:disabled):not(.is-edge)::before{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--band)}
.tj-cal__d.is-in{background:var(--orange-soft)}
.tj-cal__d.is-edge{color:#fff}
.tj-cal__d.is-edge::before{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--ink)}
.tj-cal__d.is-first{background:linear-gradient(90deg,transparent 50%,var(--orange-soft) 50%)}
.tj-cal__d.is-last{background:linear-gradient(270deg,transparent 50%,var(--orange-soft) 50%)}
.tj-cal__d.is-past{color:#b0a89f;cursor:not-allowed}
.tj-cal__d.is-out{visibility:hidden}
.tj-cal__d.is-today span{text-decoration:underline;text-underline-offset:4px}
.tj-cal__d:focus-visible{outline-offset:-3px}

/* ---------- request journey ---------- */
.tj-page__head{padding-top:clamp(2.25rem,5vw,4rem);padding-bottom:clamp(1.5rem,3vw,2.5rem)}
.tj-h1--page{font-size:clamp(2.2rem,5vw,4.3rem);color:var(--ink);letter-spacing:-.035em}
.tj-lead{font-size:1.2rem;line-height:1.5;color:var(--mute);max-width:58ch;margin-top:1rem}
.tj-journey{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(2rem,5vw,4.5rem);align-items:start;padding-bottom:clamp(4rem,8vw,7rem)}
.tj-journey--ack{display:block}
.tj-stepper-list{display:flex;flex-wrap:wrap;gap:.1rem 1.6rem;padding-bottom:.75rem;margin-bottom:1.75rem;border-bottom:1px solid var(--line)}
.tj-stepper-list button{min-height:44px;min-width:44px;color:var(--mute);font-size:15px;font-weight:500}
.tj-stepper-list button:disabled{cursor:default}
.tj-stepper-list span{color:var(--numeral);margin-right:.2rem}
@media (max-width:480px){.tj-stepper-list{gap:.1rem .9rem}.tj-stepper-list button{font-size:14px}.tj-stepper-list span{display:none}}
.tj-stepper-list .is-on button{color:var(--ink);font-weight:600;box-shadow:inset 0 -2px 0 var(--orange)}
.tj-stepper-list .is-done button{color:var(--ink)}
.tj-step{border:0;min-width:0}
.tj-step>*+*{margin-top:1.5rem}
.tj-step__h{text-wrap:balance;display:block;width:100%;float:none;padding:0;font-size:clamp(1.6rem,2.6vw,2.2rem);letter-spacing:-.025em;line-height:1.1;margin-bottom:0}
.tj-step__h:focus{outline:none}
.tj-fine--tab{margin-top:.5rem !important}
.tj-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.4rem 2rem}
@media (max-width:640px){.tj-grid2{grid-template-columns:minmax(0,1fr)}}
.tj-presets{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem}
.tj-presets>span{font-size:14px;color:var(--mute);margin-right:.4rem}
.tj-chipbtn{min-height:44px;padding:0 .95rem;border-radius:999px;border:1px solid var(--line2);font-size:14.5px;font-weight:500;transition:background-color .2s,border-color .2s}
.tj-chipbtn:hover{border-color:var(--ink)}
.tj-chipbtn.is-on{background:var(--ink);color:#fff;border-color:var(--ink)}
.tj-stops .tj-stop{display:flex;align-items:center;gap:.5rem}
.tj-stop+.tj-stop{margin-top:.15rem}
.tj-stop__n{width:26px;height:26px;flex:none;border-radius:50%;background:var(--band);display:grid;place-items:center;font-size:13px;font-weight:600}
.tj-stop__x{width:44px;height:44px;flex:none;font-size:22px;line-height:1;color:var(--mute);border-radius:50%}
.tj-stop__x:hover{background:var(--band);color:var(--ink)}
.tj-stops__add{margin-top:.2rem}
.tj-dow{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.4rem}
.tj-dow__d{width:48px;height:48px;border-radius:50%;border:1px solid var(--line2);font-size:14px;font-weight:500;display:grid;place-items:center;transition:background-color .2s}
.tj-dow__d.is-on{background:var(--ink);color:#fff;border-color:var(--ink)}
.tj-radios{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.4rem}
.tj-check{position:relative;display:inline-flex;align-items:center;gap:.6rem;min-height:48px;padding:.4rem 1rem .4rem .8rem;border:1px solid var(--line2);border-radius:8px;cursor:pointer;font-size:16px;line-height:1.3;transition:background-color .2s,border-color .2s}
.tj-check input{width:20px;height:20px;flex:none;accent-color:var(--ink);margin:0}
.tj-check.is-on{background:var(--orange-soft);border-color:var(--orange-d)}
.tj-check:focus-within{outline:2px solid var(--orange);outline-offset:2px}
.tj-check--block{display:flex;width:100%}
.tj-check.has-error{border-color:var(--err)}
.tj-journey__foot{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:2rem}
.tj-journey__main .tj-fine{margin-top:1rem}
.tj-sumblock{margin-top:1.4rem}
.tj-sumblock__head{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:.2rem}
.tj-sumblock__head h3{font-size:1.15rem;font-weight:600}
.tj-disclaimer{margin-top:1.4rem;padding:.9rem 1rem;background:var(--orange-soft);border-radius:8px;color:#5a2606;font-weight:500}
.tj-sum>div{display:grid;grid-template-columns:8.6rem minmax(0,1fr);gap:.2rem .9rem;padding:.6rem 0;border-top:1px solid var(--line)}
.tj-sum dt{font-size:14px;color:var(--mute);line-height:1.4}
.tj-sum dd{margin:0;overflow-wrap:anywhere;line-height:1.4}
.tj-sum--flat{margin:1.5rem 0;text-align:left}
@media (max-width:420px){.tj-sum>div{grid-template-columns:minmax(0,1fr)}}
.tj-journey__side{position:sticky;top:calc(var(--bar) + 16px);background:var(--band);border-radius:16px;padding:1.5rem}
.tj-side__h{font-size:1.25rem;font-weight:600;margin-bottom:.75rem}
.tj-side__call{margin:1.25rem 0 .75rem;padding-top:1rem;border-top:1px solid var(--line2)}
.tj-side__q{font-weight:500}
.tj-side__tel{display:inline-flex;align-items:center;min-height:44px;font-size:1.5rem;font-weight:600;letter-spacing:-.02em;color:var(--ink);font-variant-numeric:tabular-nums}
@media (max-width:960px){.tj-journey{grid-template-columns:minmax(0,1fr)}.tj-journey__side{position:static}}
.tj-ack{max-width:680px;margin-inline:auto;padding:1rem 0 clamp(4rem,8vw,7rem)}
.tj-ack__mark{width:56px;height:56px;margin-bottom:1.25rem}
.tj-ack__mark circle{fill:var(--orange)}
.tj-ack__mark path{fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.tj-ack__h{font-size:clamp(1.8rem,3.4vw,2.8rem);letter-spacing:-.03em;line-height:1.05;margin-bottom:.9rem}
.tj-ack__h:focus{outline:none}
.tj-ack__urgent{margin-top:.8rem;font-weight:500}
.tj-ack__urgent a{color:var(--orange-d);text-decoration:underline;text-underline-offset:3px}
.tj-ack__actions{display:flex;flex-wrap:wrap;gap:.75rem}

/* ---------- agents and queue (static designs) ---------- */
.tj-samplebar{display:inline-block;margin-top:1.25rem;padding:.55rem .95rem;border-radius:6px;background:var(--band);font-size:15px;font-weight:500}
.tj-agents{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(2rem,5vw,5rem);align-items:start;padding-bottom:2.5rem}
.tj-agents__stage{display:grid;gap:1rem;justify-items:start}
.tj-panel{width:100%;max-width:520px;background:var(--band);border-radius:16px;padding:1.75rem;display:grid;gap:1.1rem}
.tj-panel__h{font-size:1.5rem;font-weight:500;letter-spacing:-.02em}
.tj-panel__sub{font-size:1.05rem;font-weight:600;margin-top:.5rem}
.tj-panel__top{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap}
.tj-panel__links{display:flex;gap:1.5rem;flex-wrap:wrap;font-size:15px;color:var(--mute);text-decoration:underline;text-underline-offset:3px}
.tj-panel .tj-input:disabled{opacity:.6}
.tj-rows li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.2rem .75rem;padding:.65rem 0;border-top:1px solid var(--line2)}
.tj-rows em{font-style:normal;color:var(--mute)}
.tj-agents__points li{display:grid;grid-template-columns:3rem minmax(0,1fr);gap:0 .5rem;padding:1.4rem 0;border-top:1px solid var(--line)}
.tj-agents__points li:last-child{border-bottom:1px solid var(--line)}
.tj-agents__points span{grid-row:1 / span 2;color:var(--numeral);font-size:1.4rem}
.tj-agents__points h3{font-size:1.3rem;font-weight:500;letter-spacing:-.015em;margin-bottom:.3rem}
.tj-agents__points p{color:var(--mute);max-width:44ch}
.tj-page__links{display:flex;flex-wrap:wrap;gap:.5rem 2rem;padding-bottom:clamp(4rem,8vw,7rem)}
@media (max-width:960px){.tj-agents{grid-template-columns:minmax(0,1fr)}}
.tj-pill{display:inline-block;padding:.22rem .65rem;border-radius:999px;font-size:13px;font-weight:600;line-height:1.3;background:#ece8e2;color:var(--ink);white-space:nowrap}
.tj-pill--new{background:#e4eaf7;color:#1c3568}
.tj-pill--work{background:var(--orange-soft);color:#6a2a06}
.tj-pill--wait{background:#fff0c4;color:#5f4300}
.tj-pill--done{background:#d9efdd;color:#17502a}
.tj-queue{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:2rem;align-items:start;padding-bottom:2.5rem}
.tj-queue__main .tj-filters{margin-bottom:1rem}
.tj-table{width:100%;border-collapse:collapse;font-size:15px;font-variant-numeric:tabular-nums}
.tj-table th{text-align:left;font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding:.6rem .6rem;border-bottom:1px solid var(--line2)}
.tj-table td{padding:.75rem .6rem;border-bottom:1px solid var(--line);vertical-align:top}
.tj-table tr.is-on td{background:var(--orange-soft)}
.tj-queue__detail{position:sticky;top:calc(var(--bar) + 16px);background:var(--band);border-radius:16px;padding:1.5rem;display:grid;gap:.9rem}
@media (max-width:1100px){
  .tj-queue{grid-template-columns:minmax(0,1fr)}
  .tj-queue__detail{position:static}
  .tj-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
  .tj-table,.tj-table tbody,.tj-table tr,.tj-table td{display:block}
  .tj-table tr{border:1px solid var(--line);border-radius:12px;margin-bottom:.75rem;padding:.4rem .9rem}
  .tj-table td{display:flex;justify-content:space-between;gap:1rem;border:0;padding:.35rem 0;text-align:right}
  .tj-table td::before{content:attr(data-l);color:var(--mute);font-size:14px;text-align:left}
}
`
}
