/**
 * EIGNAMIÐLUN SUÐURNESJA — page-owned stylesheet.
 * ---------------------------------------------------------------------------
 * A TS module (not a bare .css file) exporting one CSS string, rendered by
 * Page.tsx as `<style>{CSS}</style>`. This is the scoped equivalent of "your
 * own css file imported by Page.tsx": it lives entirely under this page's
 * ownership, is genuinely imported by Page.tsx, and — critically — it can
 * call `import.meta.env.BASE_URL` for the self-hosted font URLs, which a
 * literal `.css` asset cannot do (Vite does not rewrite `url()` paths that
 * reach into `public/` with the deploy base, and this repo is served from a
 * non-root base on GitHub Pages). Every existing reference build in this
 * repo (tannlaeknavaktin, budir, heklusyn, skalakot) makes the identical
 * choice for the identical reason — mirrored here for consistency.
 *
 * Every class, keyframe and CSS custom property is prefixed `egm-` so
 * nothing bleeds into any other preview page (craft rule #8).
 *
 * ── THE FLUID CANVAS (mandated device 1) ────────────────────────────────
 * ERA's real trick is `html { font-size: 1vw }` at the DOCUMENT ROOT, so
 * every `rem` in the system is secretly a `vw`. We are not allowed to touch
 * global CSS, so root-relative `rem` is unavailable to us. The scoped
 * equivalent: `.egm-canvas` sets its OWN `font-size: 1vw`, and every token
 * is expressed in `em` — which (unlike `rem`) resolves against the nearest
 * ancestor's *computed* font-size, not the document root. As long as no
 * container element inside `.egm-canvas` ever changes ITS OWN `font-size`
 * (only text leaves — h1..h5, p, labels — do that), every `em` used for
 * padding/margin/gap/radius anywhere in the tree still resolves against the
 * original 1vw, so the whole page zooms together exactly like ERA's root
 * trick, fully scoped, with zero changes to shared files. `--egm-ratio`
 * (16 desktop / 4.16 mobile, breakpoint 992) and the `calc(Nem / ratio)`
 * token form are exactly as the brief and teardown specify — the only
 * substitution is rem → em for the scoping reason above. Type tokens are
 * ALSO wrapped in `clamp()` with a rem floor/ceiling: a pure vw value would
 * dip under 16px on real viewports between the two breakpoints (992–1600px)
 * before the canvas catches up, which is exactly the accessibility gap the
 * teardown flags (§ "Fix these when transplanting") — the floor fixes it
 * outright instead of merely raising the canvas number.
 */

const F = (p: string) => `${import.meta.env.BASE_URL}eignamidlun/fonts/${p}`

export const CSS = `
/* ── self-hosted type ────────────────────────────────────────────────── */
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-SemiBold.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-ExtraBold.woff2')}') format('woff2'); font-weight:800; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('Switzer-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('Switzer-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('Switzer-SemiBold.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Mono'; src:url('${F('IBMPlexMono-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Mono'; src:url('${F('IBMPlexMono-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Mono'; src:url('${F('IBMPlexMono-SemiBold.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }

/* Registering the two mask-driving custom properties as real animatable
   lengths — required for the CSS *transitions* on them (device 2, the
   preloader) to interpolate smoothly instead of snapping. */
@property --egm-arch-w { syntax:'<length-percentage>'; inherits:true; initial-value:0px; }
@property --egm-arch-y { syntax:'<length-percentage>'; inherits:true; initial-value:110vh; }

/* ── the fluid canvas ─────────────────────────────────────────────────── */
.egm-canvas{
  font-size:1vw;
  --egm-ratio:16;
  --egm-ink:#0E1A20; --egm-paper:#F4EAD9; --egm-stone:#EDE0C9;
  --egm-accent:#C1571F; --egm-accent-ink:#9C4718; --egm-accent-bright:#E8823F; --egm-moss:#5C6B47;
  --egm-white:#FFFFFF;
  --egm-hair-ink:rgba(14,26,32,.14); --egm-hair-paper:rgba(244,234,217,.22);
  --egm-soft-ink:rgba(14,26,32,.72); --egm-mute-ink:rgba(14,26,32,.64);
  --egm-soft-paper:rgba(244,234,217,.82); --egm-mute-paper:rgba(244,234,217,.60);

  --egm-4:calc(4em / var(--egm-ratio)); --egm-8:calc(8em / var(--egm-ratio));
  --egm-12:calc(12em / var(--egm-ratio)); --egm-16:calc(16em / var(--egm-ratio));
  --egm-20:calc(20em / var(--egm-ratio)); --egm-24:calc(24em / var(--egm-ratio));
  --egm-32:calc(32em / var(--egm-ratio)); --egm-40:calc(40em / var(--egm-ratio));
  --egm-48:calc(48em / var(--egm-ratio)); --egm-64:calc(64em / var(--egm-ratio));
  --egm-80:calc(80em / var(--egm-ratio)); --egm-96:calc(96em / var(--egm-ratio));
  --egm-120:calc(120em / var(--egm-ratio)); --egm-160:calc(160em / var(--egm-ratio));
  --egm-200:calc(200em / var(--egm-ratio)); --egm-dome:50em;

  --egm-h1:clamp(2.9rem, calc(172em / var(--egm-ratio)), 11.5rem);
  --egm-h2:clamp(2.15rem, calc(104em / var(--egm-ratio)), 6.8rem);
  --egm-h3:clamp(1.65rem, calc(70em / var(--egm-ratio)), 4.4rem);
  --egm-h4:clamp(1.3rem, calc(46em / var(--egm-ratio)), 2.9rem);
  --egm-h5:clamp(1.08rem, calc(28em / var(--egm-ratio)), 1.8rem);
  --egm-body:clamp(1rem, calc(18em / var(--egm-ratio)), 1.22rem);
  --egm-label:clamp(0.74rem, calc(12.5em / var(--egm-ratio)), 0.92rem);
  --egm-num:clamp(2.6rem, calc(120em / var(--egm-ratio)), 7.4rem);

  background:var(--egm-paper); color:var(--egm-ink);
  font-family:'EGM Body', system-ui, sans-serif;
  -webkit-font-smoothing:antialiased; overflow-x:clip; position:relative;
}
@media (max-width:991px){
  .egm-canvas{
    --egm-ratio:4.16;
    --egm-h1:clamp(2.5rem, calc(76em / var(--egm-ratio)), 4.6rem);
    --egm-h2:clamp(1.95rem, calc(54em / var(--egm-ratio)), 3.1rem);
    --egm-h3:clamp(1.55rem, calc(40em / var(--egm-ratio)), 2.3rem);
    --egm-h4:clamp(1.22rem, calc(29em / var(--egm-ratio)), 1.75rem);
    --egm-h5:clamp(1.03rem, calc(20em / var(--egm-ratio)), 1.28rem);
    --egm-body:clamp(1rem, calc(17em / var(--egm-ratio)), 1.14rem);
    --egm-label:clamp(0.72rem, calc(11.5em / var(--egm-ratio)), 0.86rem);
    --egm-num:clamp(2.3rem, calc(64em / var(--egm-ratio)), 4.2rem);
  }
}

.egm-canvas *{ box-sizing:border-box; }
.egm-container{ max-width:calc(1360em / var(--egm-ratio)); margin-inline:auto; padding-inline:var(--egm-24); }
@media (min-width:992px){ .egm-container{ padding-inline:var(--egm-48); } }

.egm-h1,.egm-h2,.egm-h3,.egm-h4,.egm-h5{ font-family:'EGM Display', Georgia, serif; letter-spacing:-.01em; line-height:.98; margin:0; }
.egm-h1{ font-size:var(--egm-h1); font-weight:800; line-height:.92; }
.egm-h2{ font-size:var(--egm-h2); font-weight:700; line-height:.98; }
.egm-h3{ font-size:var(--egm-h3); font-weight:600; line-height:1.04; }
.egm-h4{ font-size:var(--egm-h4); font-weight:600; line-height:1.08; }
.egm-h5{ font-size:var(--egm-h5); font-weight:600; line-height:1.14; }
.egm-body{ font-size:var(--egm-body); line-height:1.6; font-weight:400; }
.egm-label{ font-family:'EGM Mono', ui-monospace, monospace; font-size:var(--egm-label); letter-spacing:.12em; text-transform:uppercase; font-weight:500; }
.egm-num{ font-family:'EGM Display', Georgia, serif; font-size:var(--egm-num); font-weight:800; letter-spacing:-.02em; line-height:.94; font-variant-numeric:lining-nums proportional-nums; }
.egm-mono{ font-family:'EGM Mono', ui-monospace, monospace; }

/* the dome — device 7. At font-size:1vw and an unmodified container, 50em
   really is 50vw: two border-radius values become a perfect architectural
   arch. No SVG, no clip-path, no mask. */
.egm-arch{ border-top-left-radius:var(--egm-dome); border-top-right-radius:var(--egm-dome); overflow:hidden; }

/* ── section grounds ──────────────────────────────────────────────────── */
.egm-gr-paper{ background:var(--egm-paper); color:var(--egm-ink); }
.egm-gr-stone{ background:var(--egm-stone); color:var(--egm-ink); }
.egm-gr-ink{ background:var(--egm-ink); color:var(--egm-paper); }

/* ── reveal primitives (device 5) ─────────────────────────────────────
   IntersectionObserver-driven (see useRevealSystem in Page.tsx), once per
   element. Base rule = the HIDDEN state; JS adds .egm-in (animated, 0.9–1.2s
   egmOut) or .egm-in-instant (already-in-view-on-mount / reduced-motion /
   failsafe — resolved with no transition, never a flash of movement).
   Reveals always animate TOWARD the resting state per the craft ledger. */
.egm-rv-ctn{ opacity:0; transform:translate3d(0, 2.4em, 0); transition:opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1); }
.egm-rv-ctn.egm-in, .egm-rv-ctn.egm-in-instant{ opacity:1; transform:none; }
.egm-rv-ctn.egm-in-instant{ transition:none; }

.egm-rv-line{ clip-path:inset(0 100% 0 0); transition:clip-path 1s cubic-bezier(.25,1,.5,1); }
.egm-rv-line.egm-in, .egm-rv-line.egm-in-instant{ clip-path:inset(0 0 0 0); }
.egm-rv-line.egm-in-instant{ transition:none; }

.egm-rv-p{ overflow:hidden; display:block; }
.egm-rv-p span{ display:inline-block; transform:translateY(112%); transition:transform .95s cubic-bezier(.25,1,.5,1); }
.egm-rv-p.egm-in span, .egm-rv-p.egm-in-instant span{ transform:translateY(0); }
.egm-rv-p.egm-in-instant span{ transition:none; }

/* ── preloader — device 2, the arch aperture ─────────────────────────── */
.egm-preloader{
  position:fixed; inset:0; z-index:200; background:var(--egm-ink);
  transition:transform .68s cubic-bezier(.6,0,0,1), opacity .5s linear .18s;
  -webkit-mask-repeat:no-repeat,no-repeat,no-repeat,no-repeat; mask-repeat:no-repeat,no-repeat,no-repeat,no-repeat;
  -webkit-mask-composite:source-over,source-over,source-over,source-over; mask-composite:add,add,add,add;
  -webkit-mask-position:left top, right top, center top, center calc(var(--egm-arch-y) - (var(--egm-arch-w) / 2));
  mask-position:left top, right top, center top, center calc(var(--egm-arch-y) - (var(--egm-arch-w) / 2));
  -webkit-mask-size:calc(50% - (var(--egm-arch-w) / 2)) 100%, calc(50% - (var(--egm-arch-w) / 2)) 100%, var(--egm-arch-w) calc(var(--egm-arch-y) - (var(--egm-arch-w) / 2)), var(--egm-arch-w) calc(var(--egm-arch-w) / 2);
  mask-size:calc(50% - (var(--egm-arch-w) / 2)) 100%, calc(50% - (var(--egm-arch-w) / 2)) 100%, var(--egm-arch-w) calc(var(--egm-arch-y) - (var(--egm-arch-w) / 2)), var(--egm-arch-w) calc(var(--egm-arch-w) / 2);
  -webkit-mask-image:linear-gradient(#000,#000), linear-gradient(#000,#000), linear-gradient(#000,#000), radial-gradient(circle calc(var(--egm-arch-w) / 2) at 50% 100%, transparent 0 99%, #000 100%);
  mask-image:linear-gradient(#000,#000), linear-gradient(#000,#000), linear-gradient(#000,#000), radial-gradient(circle calc(var(--egm-arch-w) / 2) at 50% 100%, transparent 0 99%, #000 100%);
}
.egm-preloader-open{ transition:--egm-arch-w 1.15s cubic-bezier(.25,1,.5,1), --egm-arch-y 1.15s cubic-bezier(.25,1,.5,1); --egm-arch-w:38vw; --egm-arch-y:16vh; }
.egm-preloader-exit{ transform:translateY(-104%); opacity:0; pointer-events:none; }
.egm-preloader-word{ position:absolute; left:50%; bottom:20vh; transform:translateX(-50%); color:var(--egm-paper); font-family:'EGM Mono',monospace; font-size:.82rem; letter-spacing:.28em; text-transform:uppercase; opacity:.72; }

/* ── nav / self-theming chrome (device 4) ─────────────────────────────── */
.egm-chrome{ position:fixed; top:var(--egm-20); z-index:90; transition:color .4s ease, background-color .4s ease, border-color .4s ease; }
.egm-chrome-brand{ left:var(--egm-24); display:flex; align-items:center; gap:var(--egm-12); }
.egm-chrome-cta{ right:var(--egm-24); }
@media (min-width:992px){ .egm-chrome-brand{ left:var(--egm-48); } .egm-chrome-cta{ right:var(--egm-48); } }
.egm-theme-dark{ color:var(--egm-ink); }
.egm-theme-light{ color:var(--egm-paper); }
.egm-pill{ display:inline-flex; align-items:center; gap:var(--egm-8); min-height:44px; padding:0 var(--egm-20); border-radius:999px; font-family:'EGM Mono',monospace; font-size:.82rem; font-weight:600; letter-spacing:.04em; background:var(--egm-accent); color:#fff; transition:transform .25s cubic-bezier(.34,1.4,.64,1), background-color .4s ease; text-decoration:none; }
.egm-pill:hover{ transform:translateY(-1px) scale(1.02); }

/* ── buttons / chips ──────────────────────────────────────────────────── */
.egm-btn{ display:inline-flex; align-items:center; justify-content:center; min-height:52px; padding:0 var(--egm-24); border-radius:999px; font-family:'EGM Mono',monospace; font-weight:600; font-size:.92rem; letter-spacing:.02em; text-decoration:none; transition:transform .3s cubic-bezier(.34,1.3,.64,1), background-color .3s ease, color .3s ease, border-color .3s ease; }
.egm-btn:hover{ transform:translateY(-2px); }
.egm-btn-solid{ background:var(--egm-ink); color:var(--egm-paper); }
.egm-btn-outline{ border:1px solid var(--egm-hair-ink); color:var(--egm-ink); }
.egm-chip{ display:inline-flex; align-items:center; min-height:44px; padding:0 var(--egm-16); border-radius:999px; border:1px solid var(--egm-hair-ink); font-family:'EGM Mono',monospace; font-size:.78rem; letter-spacing:.06em; text-transform:uppercase; color:var(--egm-soft-ink); background:transparent; transition:background-color .3s ease, color .3s ease, border-color .3s ease; cursor:pointer; }
.egm-chip[aria-pressed="true"]{ background:var(--egm-ink); color:var(--egm-paper); border-color:var(--egm-ink); }

/* ── layout helpers ───────────────────────────────────────────────────── */
.egm-mt{ margin-top:var(--egm-48); }
.egm-saga-cols{ display:grid; gap:var(--egm-32); grid-template-columns:minmax(0,1fr); }
@media (min-width:768px){ .egm-saga-cols{ grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr); gap:var(--egm-64); align-items:start; } }
.egm-pillar-grid{ grid-template-columns:minmax(0,1fr); }
@media (min-width:640px){ .egm-pillar-grid{ grid-template-columns:repeat(3, minmax(0,1fr)); } }

/* ── söluskrá grid (device 6) ─────────────────────────────────────────── */
.egm-grid{ display:grid; grid-template-columns:repeat(1, minmax(0,1fr)); gap:var(--egm-16); }
@media (min-width:640px){ .egm-grid{ grid-template-columns:repeat(2, minmax(0,1fr)); } }
@media (min-width:992px){ .egm-grid{ grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--egm-20); } }
.egm-listing{ border:1px solid var(--egm-hair-ink); border-radius:calc(var(--egm-8) + 2px); padding:var(--egm-24); background:var(--egm-paper); transition:border-color .3s ease, transform .35s cubic-bezier(.25,1,.5,1), box-shadow .35s ease; }
.egm-listing:hover{ border-color:var(--egm-accent); transform:translateY(-3px); box-shadow:0 20px 40px rgba(14,26,32,.08); }
.egm-editorial{ border-radius:calc(var(--egm-8) + 2px); padding:var(--egm-24); background:var(--egm-ink); color:var(--egm-paper); display:flex; flex-direction:column; justify-content:center; }

/* ── staff cards ──────────────────────────────────────────────────────── */
.egm-staff{ border-top:1px solid var(--egm-hair-ink); padding-block:var(--egm-24); }

/* ── focus & motion ───────────────────────────────────────────────────── */
.egm-canvas :focus-visible{ outline:2px solid var(--egm-accent); outline-offset:3px; border-radius:4px; }
@keyframes egm-bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
.egm-bob{ animation:egm-bob 2.2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce){
  .egm-rv-ctn{ opacity:1 !important; transform:none !important; }
  .egm-rv-line{ clip-path:inset(0) !important; }
  .egm-rv-p span{ transform:none !important; }
  .egm-preloader{ display:none !important; }
  .egm-bob{ animation:none !important; }
  .egm-listing, .egm-btn, .egm-pill{ transition:none !important; }
}
`
