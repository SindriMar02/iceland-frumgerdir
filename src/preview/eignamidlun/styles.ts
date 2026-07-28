/**
 * EIGNAMIÐLUN SUÐURNESJA — page-owned stylesheet (v2).
 * ---------------------------------------------------------------------------
 * A TS module (not a bare .css file) exporting one CSS string, rendered by
 * Page.tsx as `<style>{CSS}</style>` — the scoped equivalent of "your own css
 * file," and the only way to reach `import.meta.env.BASE_URL` inside a
 * font-face `url()` on a non-root deploy base. Every existing reference
 * build in this repo (tannlaeknavaktin, budir, heklusyn, skalakot) makes the
 * identical choice for the identical reason.
 *
 * Every class, keyframe and CSS custom property is prefixed `egm-` so
 * nothing bleeds into any other preview page (craft rule #8).
 *
 * ── THE FLUID CANVAS (mandated device 1) ────────────────────────────────
 * ERA's real trick is `html { font-size: 1vw }` at the DOCUMENT ROOT. This
 * build's brief explicitly asks for that scoped via a class added to <html>
 * on mount and removed on unmount — but PreviewChrome and PreviewFooter
 * (shared, must-not-touch, present on this same route) are built entirely
 * from Tailwind's rem-based utility scale. Actually setting the real <html>
 * font-size to 1vw — even only while this route is mounted — would rescale
 * every rem-based Tailwind class in that shared chrome along with it: at a
 * 390px phone, 1vw = 3.9px, so a `text-xs` (0.75rem) button label collapses
 * to ~2.9px and every 44px tap target in the shared "back" / "senda
 * frumgerð" controls shrinks under the a11y floor the shared brief itself
 * mandates. That is a correctness regression the shared brief's hard rules
 * (tap targets ≥44px, AA contrast) take priority over, so this build keeps
 * v1's scoped substitute instead: `.egm-canvas` sets its OWN `font-size:1vw`
 * and every token is expressed in `em`, which (unlike `rem`) resolves against
 * the nearest ancestor's *computed* font-size rather than the document root.
 * As long as nothing inside `.egm-canvas` changes ITS OWN font-size (only
 * text leaves do), every `em` used for padding/margin/gap/radius resolves
 * against that original 1vw — the whole page zooms together exactly like
 * ERA's root trick, fully scoped, with zero risk to shared chrome.
 * `--egm-ratio` (16 desktop / 4.16 mobile, breakpoint 992) and the
 * `calc(Nem / ratio)` token form are exactly as the brief and teardown
 * specify; the only substitution is rem → em, for the reason above. Type
 * tokens are further wrapped in `clamp()` with a rem floor/ceiling so no
 * heading or body size can dip under an accessible minimum between the two
 * breakpoints (992–1600px) before the canvas ratio catches up.
 */

const F = (p: string) => `${import.meta.env.BASE_URL}eignamidlun/fonts/${p}`

export const CSS = `
/* ── self-hosted type: display serif slab + one quiet grotesk ──────────── */
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-SemiBold.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Display'; src:url('${F('EpundaSlab-ExtraBold.woff2')}') format('woff2'); font-weight:800; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('GeneralSans-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('GeneralSans-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'EGM Body'; src:url('${F('GeneralSans-Semibold.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }

/* Registering the two mask-driving custom properties as real animatable
   lengths — required for the CSS *transitions* on them (device 2, the
   preloader) to interpolate smoothly instead of snapping. */
@property --egm-arch-w { syntax:'<length-percentage>'; inherits:true; initial-value:0px; }
@property --egm-arch-y { syntax:'<length-percentage>'; inherits:true; initial-value:110vh; }

/* ── the fluid canvas — palette measured from the real es.is logo
   (#1E4F8E, dominant fill) laid on a warm paper ground, per the brief ──── */
.egm-canvas{
  font-size:1vw;
  --egm-ratio:16;
  --egm-ink:#13212E; --egm-paper:#F7F1E4; --egm-stone:#ECE0C7;
  --egm-blue:#1E4F8E; --egm-blue-deep:#153762; --egm-blue-bright:#7CA6DE;
  --egm-white:#FFFFFF;
  --egm-hair-ink:rgba(19,33,46,.14); --egm-hair-paper:rgba(247,241,228,.22);
  --egm-soft-ink:rgba(19,33,46,.72); --egm-mute-ink:rgba(19,33,46,.60);
  --egm-soft-paper:rgba(247,241,228,.84); --egm-mute-paper:rgba(247,241,228,.60);

  --egm-4:calc(4em / var(--egm-ratio)); --egm-8:calc(8em / var(--egm-ratio));
  --egm-12:calc(12em / var(--egm-ratio)); --egm-16:calc(16em / var(--egm-ratio));
  --egm-20:calc(20em / var(--egm-ratio)); --egm-24:calc(24em / var(--egm-ratio));
  --egm-32:calc(32em / var(--egm-ratio)); --egm-40:calc(40em / var(--egm-ratio));
  --egm-48:calc(48em / var(--egm-ratio)); --egm-64:calc(64em / var(--egm-ratio));
  --egm-80:calc(80em / var(--egm-ratio)); --egm-96:calc(96em / var(--egm-ratio));
  --egm-120:calc(120em / var(--egm-ratio)); --egm-160:calc(160em / var(--egm-ratio));
  --egm-200:calc(200em / var(--egm-ratio)); --egm-dome:50em;

  --egm-h1:clamp(2.9rem, calc(168em / var(--egm-ratio)), 11rem);
  --egm-h2:clamp(2.1rem, calc(102em / var(--egm-ratio)), 6.6rem);
  --egm-h3:clamp(1.6rem, calc(68em / var(--egm-ratio)), 4.2rem);
  --egm-h4:clamp(1.28rem, calc(45em / var(--egm-ratio)), 2.8rem);
  --egm-h5:clamp(1.06rem, calc(27em / var(--egm-ratio)), 1.7rem);
  --egm-body:clamp(1rem, calc(18em / var(--egm-ratio)), 1.2rem);
  --egm-label:clamp(0.74rem, calc(12.5em / var(--egm-ratio)), 0.9rem);
  --egm-num:clamp(2.5rem, calc(116em / var(--egm-ratio)), 7.2rem);

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

.egm-h1,.egm-h2,.egm-h3,.egm-h4,.egm-h5{ font-family:'EGM Display', Georgia, serif; letter-spacing:-.01em; line-height:1.04; margin:0; }
/* SplitText's 'words,chars' type wraps each WORD in a plain inline-block div
   with no white-space rule of its own, so once individual chars are also
   inline-block, the browser is free to wrap between ANY two characters, not
   just at spaces — a word can split mid-letter the moment its heading gets
   narrower than one line (confirmed: "Reykjanesbær" breaking as "Reykjanesb"
   / "ær" once the dome heading below was centred into a narrower column,
   device 7 / D-FIX-2). Word-wrapper divs are always the direct children of
   the split element. Scoped to the two dome headings specifically (not
   every [data-egm-split="h"] sitewide) — applying it to the hero's own
   "Heim á Suðurnesjum" would lock that nbsp-joined run as one
   unbreakable unit and overflow it past 390px on mobile; the hero already
   controls its own break point deliberately with that nbsp. */
#fee-h > div, #svaedi-h > div{ white-space:nowrap; }
.egm-h1{ font-size:var(--egm-h1); font-weight:800; line-height:.96; }
.egm-h2{ font-size:var(--egm-h2); font-weight:700; line-height:1.02; }
.egm-h3{ font-size:var(--egm-h3); font-weight:600; line-height:1.06; }
.egm-h4{ font-size:var(--egm-h4); font-weight:600; line-height:1.1; }
.egm-h5{ font-size:var(--egm-h5); font-weight:600; line-height:1.16; }
.egm-body{ font-size:var(--egm-body); line-height:1.62; font-weight:400; }
.egm-label{ font-family:'EGM Body', system-ui, sans-serif; font-size:var(--egm-label); letter-spacing:.1em; text-transform:uppercase; font-weight:600; }
.egm-num{ font-family:'EGM Display', Georgia, serif; font-size:var(--egm-num); font-weight:800; letter-spacing:-.02em; line-height:.96; font-variant-numeric:lining-nums proportional-nums; }
.egm-data{ font-family:'EGM Body', system-ui, sans-serif; font-variant-numeric:tabular-nums lining-nums; letter-spacing:.01em; }

/* the dome — device 4. At font-size:1vw and an unmodified container, 50em
   really is 50vw: two border-radius values become a perfect architectural
   arch. No SVG, no clip-path, no mask. Used on two full-width sections.
   With a 50vw corner radius, the top-left/right corners ARE the curve for
   up to 50vw of vertical space before they fully open — so content pinned
   to the ordinary left-aligned container edge sits inside the still-curving
   zone and gets silently deleted by overflow:hidden (confirmed: "1,3%"
   rendering as ",3%", "Reykjanesbær" losing its first letters). The repo's
   other ERA-family dome (heklusyn's .hk-dome) solves this the same way: the
   opening heading lives in a narrow, CENTRED column (.egm-dome-inner below)
   instead of flush against the edge, so at its actual x-position the curve
   has already opened with only tens of px of clearance needed, not hundreds. */
.egm-arch{ border-top-left-radius:var(--egm-dome); border-top-right-radius:var(--egm-dome); overflow:hidden; position:relative; z-index:1; }
.egm-dome-inner{ max-width:min(90%, 30rem); margin-inline:auto; text-align:center; }
/* svaedid's heading ("Reykjanesbær og nágrenni") is a normal running phrase,
   not a short numeral — 30rem is too narrow for its longest word ("Reykjanesbær")
   to fit on one line once word-wrapper divs are nowrap (see rule above), which
   pushed it past the column's right edge instead. Wide enough for that word
   at the desktop clamp ceiling, still comfortably inside the arch's clearance
   at this column's x-position (verified in the harness screenshots). */
.egm-dome-inner--wide{ max-width:min(92%, 42rem); }

/* ── section grounds ──────────────────────────────────────────────────── */
.egm-gr-paper{ background:var(--egm-paper); color:var(--egm-ink); }
.egm-gr-stone{ background:var(--egm-stone); color:var(--egm-ink); }
.egm-gr-ink{ background:var(--egm-ink); color:var(--egm-paper); }

/* ── reveal primitives (device 7) — h / p / line / slide, and only these ──
   IntersectionObserver-driven (see useRevealSystem in Page.tsx), once per
   element. Base rule = the HIDDEN state; JS adds .egm-in (animated, 0.95-
   1.2s egmOut) or .egm-in-instant (already-in-view-on-mount / reduced-motion
   / failsafe — resolved with no transition, never a flash of movement).
   h itself is driven by GSAP SplitText directly in Page.tsx (chars rotateY
   90 + yPercent 50), no CSS class needed here. */
.egm-rv-p{ overflow:hidden; display:block; }
.egm-rv-p span{ display:inline-block; transform:translateY(112%); transition:transform .95s cubic-bezier(.25,1,.5,1); }
.egm-rv-p.egm-in span, .egm-rv-p.egm-in-instant span{ transform:translateY(0); }
.egm-rv-p.egm-in-instant span{ transition:none; }

.egm-rv-line{ clip-path:inset(0 100% 0 0); transition:clip-path 1s cubic-bezier(.25,1,.5,1); }
.egm-rv-line.egm-in, .egm-rv-line.egm-in-instant{ clip-path:inset(0 0 0 0); }
.egm-rv-line.egm-in-instant{ transition:none; }

/* slide — skewed polygon wipe + inner counter-scale 1.5, for image panels
   and monument headlines. Needs a nested inner wrapper (see RvSlide).
   height:100% on both: when the parent establishes a definite height (the
   hero stack, absolutely positioned/inset:0 all the way down) these fill it
   exactly; when the parent is auto-height (Frame's aspect-ratio box) a
   percentage against an indefinite height simply computes as auto, so nothing
   breaks there — see the comment above RvSlide in Page.tsx for why both
   contexts need this same wrapper. */
.egm-rv-slide{ overflow:hidden; position:relative; height:100%; width:100%; }
.egm-rv-slide .egm-slide-inner{
  height:100%; width:100%; position:relative;
  clip-path:polygon(100% 0, 100% 0, 100% 100%, 62% 100%);
  transform:scale(1.5);
  transition:clip-path 1.2s cubic-bezier(.25,1,.5,1), transform 1.2s cubic-bezier(.25,1,.5,1);
}
.egm-rv-slide.egm-in .egm-slide-inner, .egm-rv-slide.egm-in-instant .egm-slide-inner{
  clip-path:polygon(0 0, 100% 0, 100% 100%, 0 100%);
  transform:scale(1);
}
.egm-rv-slide.egm-in-instant .egm-slide-inner{ transition:none; }

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
.egm-preloader-word{ position:absolute; left:50%; bottom:20vh; transform:translateX(-50%); color:var(--egm-paper); font-family:'EGM Body',sans-serif; font-size:.8rem; letter-spacing:.26em; text-transform:uppercase; opacity:.72; }

/* ── nav / self-theming chrome (device 5) ─────────────────────────────── */
.egm-chrome{ position:fixed; top:var(--egm-20); z-index:90; transition:color .4s ease, background-color .4s ease, border-color .4s ease; }
.egm-chrome-brand{ left:var(--egm-24); display:flex; align-items:center; gap:var(--egm-12); }
.egm-chrome-cta{ right:var(--egm-24); }
@media (min-width:992px){ .egm-chrome-brand{ left:var(--egm-48); } .egm-chrome-cta{ right:var(--egm-48); } }
.egm-theme-dark{ color:var(--egm-ink); }
.egm-theme-light{ color:var(--egm-paper); }
/* header phone control — hairline-ruled, hard-edged, no pill. */
.egm-pill{ display:inline-flex; align-items:center; gap:var(--egm-8); min-height:44px; padding:0 var(--egm-20); border-radius:3px; font-family:'EGM Body',sans-serif; font-size:.86rem; font-weight:600; letter-spacing:.01em; background:var(--egm-blue); color:#fff; transition:transform .25s cubic-bezier(.34,1.4,.64,1), background-color .4s ease; text-decoration:none; }
.egm-pill:hover{ transform:translateY(-1px); }

/* ── buttons / chips / selects — hard-edged house vocabulary, no pills,
   no floating circle chrome (banned house style). A small, consistent
   3px corner reads as intentional without softening into a pill. ────── */
.egm-btn{ display:inline-flex; align-items:center; justify-content:center; min-height:52px; padding:0 var(--egm-24); border-radius:3px; font-family:'EGM Body',sans-serif; font-weight:600; font-size:.94rem; letter-spacing:.01em; text-decoration:none; transition:transform .3s cubic-bezier(.34,1.3,.64,1), background-color .3s ease, color .3s ease, border-color .3s ease; }
.egm-btn:hover{ transform:translateY(-2px); }
.egm-btn-outline{ border:1px solid var(--egm-hair-ink); color:var(--egm-ink); }
.egm-chip{ display:inline-flex; align-items:center; min-height:44px; padding:0 var(--egm-16); border-radius:3px; border:1px solid var(--egm-hair-ink); font-family:'EGM Body',sans-serif; font-size:.82rem; font-weight:600; letter-spacing:.01em; color:var(--egm-soft-ink); background:transparent; transition:background-color .3s ease, color .3s ease, border-color .3s ease; cursor:pointer; }
.egm-chip[aria-pressed="true"]{ background:var(--egm-ink); color:var(--egm-paper); border-color:var(--egm-ink); }
.egm-select{ min-height:44px; padding:0 var(--egm-40) 0 var(--egm-16); border-radius:3px; border:1px solid var(--egm-hair-ink); background:transparent; font-family:'EGM Body',sans-serif; font-size:.82rem; font-weight:600; color:var(--egm-soft-ink); appearance:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><path d='M5 8l5 5 5-5' stroke='%2313212E' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat:no-repeat; background-position:right var(--egm-16) center; background-size:11px; }

/* ── layout helpers ───────────────────────────────────────────────────── */
.egm-mt{ margin-top:var(--egm-48); }
.egm-saga-cols{ display:grid; gap:var(--egm-32); grid-template-columns:minmax(0,1fr); }
@media (min-width:768px){ .egm-saga-cols{ grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr); gap:var(--egm-64); align-items:start; } }
.egm-pillar-grid{ grid-template-columns:minmax(0,1fr); }
@media (min-width:640px){ .egm-pillar-grid{ grid-template-columns:repeat(3, minmax(0,1fr)); } }

/* ── söluskrá — device 6: real-photo list rows + asymmetric editorial ───── */
.egm-filter-group{ display:flex; flex-wrap:wrap; gap:var(--egm-8); align-items:center; }

.egm-list{ display:flex; flex-direction:column; }
.egm-row{
  display:grid; grid-template-columns:72px 1fr; gap:var(--egm-16); align-items:center;
  padding:var(--egm-12) 0; border-top:1px solid var(--egm-hair-ink);
  text-decoration:none; color:inherit;
}
@media (min-width:768px){ .egm-row{ grid-template-columns:140px 1fr auto; gap:var(--egm-24); padding:var(--egm-16) 0; } }
.egm-row-photo{ width:100%; aspect-ratio:4/3; border-radius:calc(var(--egm-8) + 2px); overflow:hidden; background:var(--egm-stone); position:relative; }
.egm-row-photo img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .5s cubic-bezier(.25,1,.5,1); }
.egm-row:hover .egm-row-photo img{ transform:scale(1.05); }
.egm-row-main{ min-width:0; }
.egm-row-price{ text-align:left; }
@media (min-width:768px){ .egm-row-price{ text-align:right; white-space:nowrap; } }
.egm-row-price.egm-row-price-offer{ color:var(--egm-blue); }

.egm-editorial{
  grid-column:1 / -1; border-radius:calc(var(--egm-8) + 2px); margin:var(--egm-8) 0;
  padding:var(--egm-24); background:var(--egm-ink); color:var(--egm-paper);
  display:flex; flex-direction:column; justify-content:center; gap:var(--egm-8);
}
.egm-editorial-staff{ display:flex; flex-direction:row; align-items:center; gap:var(--egm-16); }
.egm-editorial-photo{ width:calc(56em / var(--egm-ratio)); min-width:52px; aspect-ratio:1; border-radius:999px; overflow:hidden; flex-shrink:0; }
.egm-editorial-photo img{ width:100%; height:100%; object-fit:cover; }

/* empty state */
.egm-empty{ padding:var(--egm-48) 0; text-align:center; color:var(--egm-mute-ink); }

/* ── hero cycle (device 3) ────────────────────────────────────────────── */
.egm-hero-layer{ position:absolute; inset:0; }
.egm-hero-layer img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.egm-hero-cap{ transition:opacity .5s ease; }

/* ── staff — device 9: CSS custom-property hover state machine, no JS ──── */
.egm-staff-grid{ display:grid; gap:var(--egm-24); grid-template-columns:repeat(1,minmax(0,1fr)); }
@media (min-width:640px){ .egm-staff-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1100px){ .egm-staff-grid{ grid-template-columns:repeat(4,minmax(0,1fr)); } }
.egm-staff-card{ --egm-sf-scale:1; --egm-sf-op:0; --egm-sf-shift:10px; }
.egm-staff-photo-wrap{ overflow:hidden; border-radius:calc(var(--egm-8) + 2px); background:var(--egm-stone); position:relative; aspect-ratio:4/5; }
.egm-staff-photo-wrap img{ width:100%; height:100%; object-fit:cover; transform:scale(var(--egm-sf-scale)); transition:transform .8s cubic-bezier(.25,1,.5,1); }
.egm-staff-contact{ opacity:var(--egm-sf-op); transform:translateY(var(--egm-sf-shift)); transition:opacity .8s ease, transform .8s cubic-bezier(.25,1,.5,1); }
@media (min-width:992px){
  .egm-staff-card:hover{ --egm-sf-scale:1.045; --egm-sf-op:1; --egm-sf-shift:0px; }
}
@media (max-width:991px){
  .egm-staff-card{ --egm-sf-op:1; --egm-sf-shift:0px; }
}

/* ── focus & motion ───────────────────────────────────────────────────── */
.egm-canvas :focus-visible{ outline:2px solid var(--egm-blue); outline-offset:3px; border-radius:4px; }
@keyframes egm-bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
.egm-bob{ animation:egm-bob 2.2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce){
  .egm-rv-line{ clip-path:inset(0) !important; }
  .egm-rv-p span{ transform:none !important; }
  .egm-rv-slide .egm-slide-inner{ clip-path:polygon(0 0,100% 0,100% 100%,0 100%) !important; transform:none !important; }
  .egm-preloader{ display:none !important; }
  .egm-bob{ animation:none !important; }
  .egm-row-photo img, .egm-btn, .egm-pill, .egm-staff-photo-wrap img, .egm-staff-contact{ transition:none !important; }
}
`
