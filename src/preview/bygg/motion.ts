/* eslint-disable */
// @ts-nocheck
/* BYGG motion engine: the Realevate clean-room rebuild's js/app.js (sndr-teardowns PR #1), ported value for value
 * into a mountable module. The reference is a static multi-page site with a fetch-based router; here the page
 * markup comes from pages.ts (renderPage) and the module cleans up after itself so the React route can unmount.
 * Values come from teardowns/realevate-agency-2026-09-28/TEARDOWN.md; "#n" = motion catalogue row, "M n" = module,
 * "G n" = gap entry (Module 17). Every deviation from the source is marked "BYGG:".
 * Libraries: GSAP, ScrollTrigger, SplitText (3.15; the source ran 3.12.2).
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
ScrollTrigger.config({ ignoreMobileResize: true }) // BYGG: iOS URL-bar resize must not refresh mid-fling (ios-momentum-killers)

export interface EngineConfig {
  base: string                                   // '/preview/bygg' or '/preview/bygg/en' incl. the deploy base
  routes: Array<{ key: string; slug: string; view: string; category: string }>
  render: (key: string) => { title: string; description: string; theme: string; html: string; view: string; category: string; heroes: string[] }
  onCommit?: (d: { title: string; description: string; theme: string; view: string; category: string }) => void
  t: Record<string, string>
  lang: 'is' | 'en'
  countries: { codes: readonly string[]; excluded: readonly string[]; dial: Record<string, string>; example: Record<string, string>; first: string }
  policyHtml: string
  arrow: string
  flow: (form: HTMLFormElement) => { title: string; text: string; list: string[]; note: string }
  fontProbe: string
}

export function mountBygg(cfg: EngineConfig): () => void {
  const KILL = new AbortController()
  const sigOf = (o) => {
    const opts = typeof o === 'object' && o ? { ...o } : { capture: !!o }
    opts.signal = opts.signal ? AbortSignal.any([opts.signal, KILL.signal]) : KILL.signal
    return opts
  }
  const addEventListener = (t, f, o) => window.addEventListener(t, f, sigOf(o))
  const docOn = (t, f, o) => document.addEventListener(t, f, sigOf(o))
  const extra = [] // nodes appended to body by the engine (cursor, ring, scrollbar, panels, probe)
  const T = cfg.t
  const prevScrollRestoration = history.scrollRestoration

  /* ── values ────────────────────────────────────────────────── */
  const V = {
    easeStd: [0.7, 0.6, 0, 1],                       // M2 standard easing, picker timeline
    line: { hidden: "inset(0% 0% 100% 0%)", shown: "inset(-40% 0% -28% 0%)", y: 70, skew: 0, dur: 0.7, ease: "power2.out", lines: 0.07, els: 0.1 }, // #11 #15 (BYGG: calmer than the reference: y 100 -> 70, skew -1 -> 0, 0.8 -> 0.7 s)
    logo: { hidden: "inset(0% 0% 100% 0%)", shown: "inset(0% 0% 0% 0%)", y: 115, skew: -1, dur: 0.8, ease: "power2.out" }, // #8
    ticker: { hidden: "inset(0% 0% 100% 0%)", shown: "inset(0% 0% -20% 0%)", y: 140, skew: 0, dur: 1, ease: "power2.out", secondsPerVw: 22 }, // #13 #14 (BYGG: marquee 15 -> 22 s per viewport width)
    photo: { hidden: "inset(50% 50% 50% 50%)", shown: "inset(0% 0% 0% 0%)", scale: 1.15, dur: 1.1, ease: "power4.out" }, // #7 (BYGG: 1.5 -> 1.15, 1.5 -> 1.1 s)
    t: { photo: 0.3, content: 0.6, aboutShift: -0.2 },   // M6 timeline anchors
    pop: { y: 16, scale: 0.92, dur: 0.7, ease: "power3.out", iconDur: 0.75, iconDelay: 0.1 }, // #9 #10
    chip: { extra: 0.42, fade: 0.22, side: 0.28, gap: 0.16 },  // #12
    dockHide: { y: 50, dur: 0.55, ease: "power2.out" },         // #29
    loader: { imageDelay: 0.35, reveal: 1.1, revealEase: "power4.out", scaleFrom: 1.15, steps: [27, 42, 68, 92, 99],
      countIn: 0.6, countInEase: "power4.out", tick: 0.5, tickEase: "expo.out", countOut: 0.7, countOutEase: "power3.in",
      exitReveal: 0.4, wipe: 0.9, wipeBezier: [0.73, 0.15, 0.15, 0.99], morphDelay: 0.1, morph: 0.65, morphEase: "power2.inOut", timeoutMs: 12000 }, // M5 #1-#6 (BYGG: the reference runs 3.7 s, this 2.7 s)
    picker: { total: 1, staggerRatio: 0.14, lead: 0.05, inner: 0.035, markRatio: 0.7, textRatio: 0.75,
      card: { yPercent: 110, opacity: 0 }, mark: { opacity: 0, y: 12 }, name: { opacity: 0, x: 20 }, blurb: { opacity: 0, y: 16 } }, // M8 #33 #34
    drawer: { bezier: [0.4, 0.3, 0, 0.99], line: 0.6, panel: 0.7, scrim: 0.8, links: 0.7, linkStagger: 0.045, linkDelay: 0.2,
      closeLinks: 0.18, closeStagger: 0.025, closeRest: 0.6, closeDelay: 0.12, bar: 13, barDur: 0.5, roll: 0.5, rollStagger: 0.01 }, // M9 #39-#42
    wheel: 0.8, touch: 2.5,                                   // M1
    rows: { from: { y: 24, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1 }, dur: 0.65, ease: "power3.out", stagger: 0.08, fields: 0.2 }, // #58 xe (A:98)
    route: { slide: { dur: 0.8, bezier: [0.5, 0.2, 0, 1], outY: -30, inY: 50, clip0: "inset(50% 30% 15% 29%)", clip1: "inset(0% 0% 0% 0%)", sep: 0.6 }, // M10 A
      swap: { enter: 0.5, inBelow: 55, outBelow: 45, sep: 0.5, fade: 0.2 },                                                                          // M10 B
      next: { bezier: [0.5, 0.2, 0, 1], reset: 0.3, expand: 0.85, text: 0.55, stagger: 0.06, textAt: 0.12, shade: 0.35, shadeAt: 0.15, fly: 1.05, content: 0.3 } }, // M10 C
  };

  /* ── helpers ───────────────────────────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => matchMedia("(max-width: 650px) and (orientation: portrait)").matches;
  const tablet = () => matchMedia("(min-width: 651px) and (max-width: 1024px)").matches;
  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
  const vw = () => document.documentElement.clientWidth || innerWidth;
  const vh = () => window.visualViewport?.height ?? innerHeight;
  const bezier = (x1, y1, x2, y2) => (t) => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let lo = 0, hi = 1;
    for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; (3 * (1 - m) ** 2 * m * x1 + 3 * (1 - m) * m * m * x2 + m ** 3 < t) ? (lo = m) : (hi = m); }
    const c = (lo + hi) / 2; return 3 * (1 - c) ** 2 * c * y1 + 3 * (1 - c) * c * c * y2 + c ** 3;
  };
  const easeStd = bezier(...V.easeStd);
  const easeDrawer = bezier(...V.drawer.bezier);
  const body = document.body;

  const units = () => { const d = document.documentElement; d.style.setProperty("--vw1", vw() * 0.01 + "px"); d.style.setProperty("--vh1", vh() * 0.01 + "px"); };
  addEventListener("resize", units); window.visualViewport?.addEventListener("resize", units, { signal: KILL.signal });

  /* ── masked line reveals (#11, #15) ────────────────────────── */
  const Lines = {
    split(el) {
      if (el._split) { el._split.revert(); el._split = null; }
      gsap.set(el, { autoAlpha: 1 });
      const s = new SplitText(el, { type: "lines", linesClass: "line" });
      el._split = s; return s.lines;
    },
    hide(targets, r = V.line) { gsap.set(targets, { yPercent: r.y, skewY: r.skew, opacity: 1, clipPath: r.hidden }); },
    show(targets, tl, at, r = V.line) {
      const v = { yPercent: 0, skewY: 0, clipPath: r.shown, duration: r.dur, ease: r.ease };
      if (targets.length > 1 && r.lines) v.stagger = r.lines;
      return tl ? tl.to(targets, v, at) : gsap.to(targets, v);
    },
    settle(el) { const l = $$(".line", el); if (l.length) gsap.set(l, { clipPath: "none", overflow: "visible" }); },
  };

  /* ── ticker / marquee (#14) ────────────────────────────────── */
  const Ticker = {
    start(t) {
      const track = $(".ticker__track", t), group = $(".ticker__group", t);
      if (!track || !group) return;
      t._tw?.kill(); $$(".ticker__group", track).slice(1).forEach((g) => g.remove());
      const w = group.offsetWidth; if (!w) { setTimeout(() => this.start(t), 100); return; }
      const copies = Math.max(3, Math.ceil((2 * innerWidth) / w) + 1);
      for (let i = 0; i < copies; i++) track.appendChild(group.cloneNode(true));
      const f = innerWidth < 479 ? 0.25 : innerWidth < 991 ? 0.5 : 1;
      const rev = t.dataset.dir === "reverse" && matchMedia("(min-width: 1025px)").matches;
      const x0 = t._phase != null ? -((t._phase % 1) + 1) % 1 * w : rev ? -w : 0; t._phase = null;
      gsap.set(track, { x: x0 });
      t._w = w;
      t._tw = gsap.to(track, { x: rev ? `+=${w}` : `-=${w}`, duration: (w / innerWidth) * V.ticker.secondsPerVw * f, ease: "none", repeat: -1,
        modifiers: { x: (x) => { let p = parseFloat(x) % w; if (p > 0) p -= w; return p + "px"; } } });
    },
    rebuild(root = document) { $$(".ticker", root).forEach((t) => { if (!t._tw) return; const x = parseFloat(gsap.getProperty($(".ticker__track", t), "x")) || 0; t._phase = t._w ? -x / t._w : 0; this.start(t); }); },
  };

  /* ── dock (nav actions) ─────────────────────────────────────── */
  const Dock = {
    node: null,
    el() { if (!this.node || !this.node.isConnected) this.node = $(".dock"); return this.node; },
    use(d) { this.tween?.kill(); this.tween = null; this.reasons.clear(); this.node = d || null; },
    hideForIntro(d = this.el()) { if (!d) return; gsap.set(d, { autoAlpha: 0, yPercent: V.pop.y, scale: V.pop.scale, pointerEvents: "none", transformOrigin: "center center" }); gsap.set($("svg", d), { scale: 0, transformOrigin: "center center" }); },
    intro(tl, at, d = this.el()) { // #9 #10
      if (!d) return; this.hideForIntro(d);
      tl.to(d, { autoAlpha: 1, yPercent: 0, scale: 1, pointerEvents: "auto", duration: V.pop.dur, ease: V.pop.ease }, at);
      tl.to($("svg", d), { scale: 1, duration: V.pop.iconDur, ease: V.pop.ease }, at + V.pop.iconDelay);
    },
    reasons: new Set(), tween: null,
    hide(reason, on, animate = true) { // #29
      on ? this.reasons.add(reason) : this.reasons.delete(reason);
      const d = this.el(); if (!d) return; const hidden = this.reasons.size > 0;
      const to = { autoAlpha: hidden ? 0 : 1, yPercent: hidden ? V.dockHide.y : 0, pointerEvents: hidden ? "none" : "auto" };
      this.tween?.kill(); this.tween = animate && !reduced() ? gsap.to(d, { ...to, duration: V.dockHide.dur, ease: V.dockHide.ease, overwrite: "auto" }) : gsap.set(d, to);
    },
  };

  /* ── loader (M5, #1-#6) ─────────────────────────────────────── */
  const Loader = {
    root: () => $(".loader"),
    active() { return document.documentElement.classList.contains("is-cold") && body.dataset.page === "home" && !!this.root(); },
    reels() { return $$(".loader__reel", this.root()); },
    count(n, animate = true) {
      const v = clamp(Math.round(n), 0, 99), y = [-Math.floor(v / 10) * 10, -(v % 10) * 10], r = this.reels();
      if (!animate) { r.forEach((e, i) => gsap.set(e, { yPercent: y[i] })); return; }
      gsap.to(r, { yPercent: (i) => y[i], duration: V.loader.tick, ease: V.loader.tickEase, overwrite: "auto" });
    },
    prepare() {
      const e = this.root(), L = V.loader;
      gsap.set($$(".loader__frame", e), { clipPath: "inset(50% 50% 50% 50%)" });
      gsap.set($$(".loader__frame img", e), { scale: L.scaleFrom, transformOrigin: "center center" });
      gsap.set($(".loader__digits", e), { yPercent: 100 });
      this.count(L.steps[0], false);
      document.documentElement.classList.add("count-ready");
    },
    run(onReveal) {
      const e = this.root(), L = V.loader, frames = $$(".loader__frame", e), n = frames.length - 1;
      const box = $(".loader__frames", e), digits = $(".loader__digits", e), win = $(".loader__window", e), veil = $(".loader__veil", e);
      const photo = $(".hero__photo"), wipe = bezier(...L.wipeBezier), to = {};
      return new Promise((done) => {
        const tl = gsap.timeline();
        tl.fromTo(digits, { yPercent: 100 }, { yPercent: 0, duration: L.countIn, ease: L.countInEase }, 0);
        frames.forEach((f, i) => {
          const t = i * L.imageDelay;
          tl.fromTo(f, { clipPath: "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: L.reveal, ease: L.revealEase }, t);
          tl.fromTo($("img", f), { scale: L.scaleFrom }, { scale: 1, duration: L.reveal, ease: L.revealEase }, t);
          if (i > 0 && i < n) tl.call(() => this.count(L.steps[i]), null, t);
          if (i === n) {
            const reveal = t + L.exitReveal, morph = reveal + L.morphDelay, end = t + Math.max(L.exitReveal + L.wipe, L.exitReveal + L.morphDelay + L.morph, L.countOut);
            tl.call(() => {
              this.count(L.steps[L.steps.length - 1]); body.classList.add("loader-exit");
              const r = box.getBoundingClientRect(); gsap.set(box, { position: "fixed", top: r.top, left: r.left, width: r.width, height: r.height, margin: 0 });
              gsap.set(photo, { autoAlpha: 0 });
            }, null, t);
            tl.to(digits, { yPercent: -100, duration: L.countOut, ease: L.countOutEase }, t);
            tl.to(win, { clipPath: "inset(100% 0% 0% 0%)", duration: L.countOut, ease: L.countOutEase }, t);
            tl.to(veil, { clipPath: "inset(0% 0% 100% 0%)", duration: L.wipe, ease: wipe }, reveal);
            tl.call(onReveal, null, reveal);
            tl.call(() => { const r = photo.getBoundingClientRect(); Object.assign(to, { top: r.top, left: r.left, width: r.width, height: r.height }); }, null, morph);
            tl.to(box, { top: () => to.top, left: () => to.left, width: () => to.width, height: () => to.height, duration: L.morph, ease: L.morphEase }, morph);
            tl.call(() => { gsap.set(photo, { autoAlpha: 1, clipPath: "none" }); e.remove(); body.classList.remove("loader-exit"); document.documentElement.classList.remove("is-cold"); done(); }, null, end);
          }
        });
      });
    },
    skip() { this.root()?.remove(); document.documentElement.classList.remove("is-cold"); },
  };

  /* ── page intro (M6) ────────────────────────────────────────── */
  const INTRO_TEXT = ".hero__lead, .hero__copy p, .navlink, .colophon small, [data-intro-text]";
  const HERO_TICKER = ".hero .ticker, .desk__spin .ticker";
  const Intro = {
    tl: null, locked: false, pending: null,
    prepare(root) {
      gsap.set($(".brand", root), { autoAlpha: 0 });
      Dock.hideForIntro($(".dock", root) || Dock.el());
      $$(INTRO_TEXT, root).forEach((e) => gsap.set(e, { autoAlpha: 0 }));
      $$(".chip", root).forEach((c) => gsap.set(c, { "--b-top": 0, "--b-right": 0, "--b-bottom": 0, "--b-left": 0 }));
      $$("[data-intro-fade]", root).forEach((e) => gsap.set(e, { autoAlpha: 0, y: 14 }));
      const m = $(HERO_TICKER + " .ticker__mask", root); if (m) gsap.set(m, { yPercent: V.ticker.y, skewY: V.ticker.skew, clipPath: V.ticker.hidden });
      const r = Intro.rows(root); if (r.all.length) gsap.set(r.all, V.rows.from);
    },
    rows(root) { const channels = $$(".channel", root), tabs = $$(".enquiry__tabs", root), fields = $$("#enquiry-investors > div", root); return { channels, tabs, fields, all: [...tabs, ...channels, ...fields] }; }, // rh() A:1495
    play(root, { skipPhoto = false, onDone, content, dock = true, deferText = false } = {}) {
      body.classList.add("is-ready");
      const tl = gsap.timeline({ onComplete: () => { if (!deferText) $$(INTRO_TEXT, root).forEach(Lines.settle); const m = $(HERO_TICKER + " .ticker__mask", root); if (m) gsap.set(m, { clipPath: "none" }); onDone?.(); } });
      this.tl = tl;
      const at = content ?? V.t.content, tickerAt = root.dataset.view === "about" ? at + V.t.aboutShift : at;
      this.locked = true; Smooth.hold("intro", true); tl.call(() => { this.locked = false; Smooth.hold("intro", false); }, null, tickerAt + V.ticker.dur); // scroll lock off at marquee end (M8)
      const img = $(".hero__photo img", root);
      if (img && !skipPhoto) { // #7
        tl.fromTo($(".hero__photo", root), { clipPath: V.photo.hidden }, { clipPath: V.photo.shown, duration: V.photo.dur, ease: V.photo.ease }, V.t.photo);
        tl.fromTo(img, { scale: V.photo.scale }, { scale: 1, duration: V.photo.dur, ease: V.photo.ease }, V.t.photo);
      } else if (img) gsap.set($(".hero__photo", root), { clipPath: "none" });
      const brand = $(".brand", root); // #8
      if (brand) { gsap.set(brand, { autoAlpha: 1, overflow: "hidden" }); Lines.hide([brand], V.logo); Lines.show([brand], tl, at, V.logo); tl.set(brand, { clearProps: "overflow,clipPath,transform" }, at + V.logo.dur); }
      if (dock) Dock.intro(tl, at, $(".dock", root) || Dock.el()); // during A/B the incoming dock waits for the commit (tf() A:2552)
      const text = (host, t0) => $$(INTRO_TEXT, root).filter((e) => e.textContent.trim()).forEach((el, i) => { // #11 #12
        const lines = Lines.split(el); Lines.hide(lines);
        const isChip = el.classList.contains("chip"), t = t0 + i * V.line.els + (isChip ? V.chip.extra : 0), tl = host;
        if (isChip) {
          gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: V.chip.fade, ease: "power2.out" }, t);
          ["top", "right", "bottom", "left"].forEach((s, k) => tl.to(el, { [`--b-${s}`]: 1, duration: V.chip.side, ease: "power2.inOut" }, t + k * V.chip.gap));
        }
        Lines.show(lines, tl, t);
      });
      const fades = $$("[data-intro-fade]", root); // BYGG: buttons and the facts row arrive after the headline
      const fadeAt = (host, t0) => fades.forEach((e, i) => host.to(e, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "transform" }, t0 + 0.35 + i * 0.12));
      if (deferText) this.pending = () => { this.pending = null; const t2 = gsap.timeline({ onComplete: () => $$(INTRO_TEXT, root).forEach(Lines.settle) }); text(t2, 0); fadeAt(t2, 0); }; // C28
      else { text(tl, at); fadeAt(tl, at); }
      const mask = $(HERO_TICKER + " .ticker__mask", root); // #13
      if (mask) { Lines.show([mask], tl, tickerAt, V.ticker); tl.call(() => $$(HERO_TICKER, root).forEach((t) => Ticker.start(t)), null, tickerAt); }
      const r = this.rows(root), R = V.rows, rv = { ...R.to, duration: R.dur, ease: R.ease, stagger: R.stagger, clearProps: "transform" }; // #58: channels, then tabs and investor rows +0.2
      if (r.channels.length) tl.fromTo(r.channels, R.from, rv, at);
      if (r.tabs.length) tl.fromTo(r.tabs, R.from, { ...rv, stagger: 0 }, at + R.fields);
      if (r.fields.length) tl.fromTo(r.fields, R.from, rv, at + R.fields);
      return tl;
    },
  };

  /* ── Our Selection picker (M8, #33-#35) ─────────────────────── */
  const Picker = {
    open: false, busy: false, tl: null, frozen: 0,
    root: () => $(".picker"),
    tiles() { return $$(".picker__slot:not([hidden]) .tile", this.root()); },
    parts: (t) => [$(".tile__mark", t), $(".tile__name", t), $(".tile__blurb", t)],
    timing(n) { const P = V.picker, s = P.total * P.staggerRatio, d = P.total - s; return { stagger: n > 1 ? s / (n - 1) : 0, dur: d, mark: d * P.markRatio, text: d * P.textRatio }; },
    reset(tile) { const [m, n, b] = this.parts(tile), P = V.picker; gsap.set(tile, P.card); gsap.set(m, P.mark); gsap.set(n, P.name); gsap.set(b, P.blurb); },
    // page shrinks into the strip under the tiles: width of 2 tiles + gap (desktop) or full inner width
    pose() {
      const g = $(".picker__grid"), cs = getComputedStyle(g), inner = innerWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), gap = parseFloat(cs.columnGap) || 0;
      const scale = clamp((mobile() || tablet() ? inner : ((inner - gap * 3) / 4) * 2 + gap) / innerWidth, 0.1, 1);
      const below = innerHeight - (g.getBoundingClientRect().bottom + (parseFloat(cs.rowGap) || 0));
      return { scale, y: Math.max(innerHeight * scale - Math.max(below, 0), 0) };
    },
    showSlots() {
      const cat = body.dataset.category;
      $$(".picker__slot", this.root()).forEach((s) => { s.hidden = s.dataset.slot === "home" ? !cat : s.dataset.slot === cat; });
      const home = $('.picker__slot[data-slot="home"]'); if (cat && home) home.parentNode.prepend(home);
      $$(".tile__cover img[data-src]", this.root()).forEach((i) => { if (!i.src) i.src = i.dataset.src; });
    },
    show() {
      if (this.open || this.busy || Router.busy) return;
      if (Drawer.isOpen) { Drawer.close(() => this.show()); return; }
      const page = $(".page"); this.showSlots(); const tiles = this.tiles(), T = this.timing(tiles.length), P = V.picker;
      this.frozen = Scroll.y(); Scroll.lock(true);
      if (this.frozen && page.firstElementChild) gsap.set(page.firstElementChild, { y: -this.frozen });
      this.open = this.busy = true; Dock.hide("picker", true); tiles.forEach((t) => this.reset(t));
      gsap.set(page, { transformOrigin: "50% 100%", scale: 1, y: 0 }); gsap.set(this.root(), { autoAlpha: 1 });
      const tl = (this.tl = gsap.timeline({ defaults: { ease: easeStd }, onComplete: () => { this.busy = false; } }));
      tl.add(() => { body.classList.add("is-picking"); this.root().setAttribute("aria-hidden", "false"); $$("[data-picker-toggle]").forEach((b) => b.setAttribute("aria-expanded", "true")); }, 0); // ticker keeps running (M8, verified live)
      tl.to(page, { ...this.pose(), duration: P.total }, 0);
      tl.to(tiles, { yPercent: 0, opacity: 1, duration: T.dur, stagger: T.stagger }, 0);
      tiles.forEach((t, i) => { const [m, n, b] = this.parts(t), at = i * T.stagger + P.lead;
        tl.to(m, { opacity: 1, y: 0, duration: T.mark }, at).to(n, { opacity: 1, x: 0, duration: T.text }, at + P.inner).to(b, { opacity: 1, y: 0, duration: T.text }, at + P.inner * 2); });
    },
    closeInto(tl, tiles) { // reverse order from the end: blurb → name → mark
      const T = this.timing(tiles.length), P = V.picker;
      tl.to(tiles, { ...P.card, duration: T.dur, stagger: { each: T.stagger, from: "end" } }, 0);
      tiles.forEach((t, i) => { const [m, n, b] = this.parts(t), at = (tiles.length - 1 - i) * T.stagger + P.lead;
        tl.to(b, { ...P.blurb, duration: T.text }, at).to(n, { ...P.name, duration: T.text }, at + P.inner).to(m, { ...P.mark, duration: T.mark }, at + P.inner * 2); });
    },
    hide(then) {
      if (!this.open) { then?.(); return; }
      const page = $(".page"), tiles = this.tiles(); this.tl?.kill(); this.busy = true;
      Dock.hide("picker", false); // actions come back as the close starts (M8)
      const tl = (this.tl = gsap.timeline({ defaults: { ease: easeStd }, onComplete: () => { this.finish(tiles, true); then?.(); } }));
      this.closeInto(tl, tiles); tl.to(page, { scale: 1, y: 0, duration: V.picker.total }, 0);
    },
    finish(tiles, restore) {
      const page = $(".page");
      this.open = this.busy = false; body.classList.remove("is-picking"); this.root().setAttribute("aria-hidden", "true");
      $$("[data-picker-toggle]").forEach((b) => b.setAttribute("aria-expanded", "false"));
      gsap.set(this.root(), { autoAlpha: 0 }); gsap.set(page, { clearProps: "transform,transformOrigin" }); gsap.set(tiles, { clearProps: "transform,opacity" });
      tiles.forEach((t) => gsap.set(this.parts(t), { clearProps: "transform,opacity" }));
      if (page.firstElementChild) gsap.set(page.firstElementChild, { clearProps: "transform" });
      Scroll.lock(false); if (restore) Scroll.to(this.frozen, true);
      if (Dock.reasons.has("picker")) Dock.hide("picker", false, false);
    },
    bind() {
      gsap.set(this.root(), { autoAlpha: 0 });
      docOn("click", (e) => { const b = e.target.closest("[data-picker-toggle]"); if (!b) return; e.preventDefault(); e.stopPropagation(); this.open ? this.hide() : this.show(); });
      docOn("click", (e) => { // clicking the shrunk page closes it
        if (!this.open || this.busy || !e.target.closest(".page") || e.target.closest(".dock")) return; e.preventDefault(); e.stopPropagation(); this.hide();
      }, true);
      $$(".tile", this.root()).forEach((t) => {
        t.addEventListener("pointerenter", () => Router.prefetch(t.dataset.route));
        t.addEventListener("click", (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; e.preventDefault(); e.stopPropagation(); if (this.open && !Router.busy) Router.go(t.dataset.route, "swap"); });
      });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && this.open) this.hide(); });
      addEventListener("resize", () => { if (this.open && !this.busy) gsap.set($(".page"), { transformOrigin: "50% 100%", ...this.pose() }); });
      // BYGG: the reference home has no scroll, so a downward wheel or swipe opened the picker there. Ours scrolls; the picker opens from "Til sölu" only.
      const can = (t) => false && body.dataset.page === "home" && !this.open && !this.busy && !Router.busy && !Drawer.isOpen && body.classList.contains("is-ready") && !Intro.locked && !t?.closest?.(".drawer, .picker, form, .ticker"); // locked until the marquee reveal ends (M8)
      addEventListener("wheel", (e) => { if (e.ctrlKey || e.metaKey || !can(e.target) || e.deltaY * V.wheel <= 0) return; e.preventDefault(); e.stopPropagation(); this.show(); }, { passive: false, capture: true });
      let y0 = null;
      addEventListener("touchstart", (e) => { y0 = can(e.target) ? e.touches[0].clientY : null; }, { passive: true, capture: true });
      addEventListener("touchmove", (e) => { if (y0 == null || e.touches.length > 1 || !can(e.target)) { y0 = null; return; } const d = (y0 - e.touches[0].clientY) * V.touch; y0 = e.touches[0].clientY; if (d > 0) { e.preventDefault(); y0 = null; this.show(); } }, { passive: false, capture: true });
    },
  };

  /* ── drawer / nav menu (M9, #39-#43) ────────────────────────── */
  const Drawer = {
    isOpen: false, busy: false, tl: null,
    root: () => $(".drawer"),
    parts() { const r = this.root(); return { scrim: $(".drawer__scrim", r), panel: $(".drawer__panel", r), close: $(".drawer__close", r), links: $$(".drawer__links a", r), contact: $(".drawer__contact", r) }; },
    button() { // BYGG: the labelled header button while it is on screen (phones), otherwise the dock's
      const t = $(".menu-top"); if (t && t.offsetParent) { const r = t.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) return t; }
      return $(".dock__burger");
    },
    inVw: (px) => (px / vw()) * 100 + "vw",
    colours() { // M9 colours per page
      const r = this.root()?.style; if (!r) return;
      if (!this.button()) { r.setProperty("--d-bg", "var(--navy)"); r.setProperty("--d-ink", "var(--white)"); r.setProperty("--d-scrim", "rgba(31, 43, 94, 0.24)"); return; } // no actions (contact, 404): the rg fallback (A:9414)
      const cat = body.dataset.category || body.dataset.page === "about", past = body.classList.contains("past-hero");
      if (!cat) { r.removeProperty("--d-bg"); r.removeProperty("--d-ink"); r.removeProperty("--d-scrim"); return; }
      const c = "var(--cat)"; // C3
      r.setProperty("--d-bg", past ? c : "var(--white)"); r.setProperty("--d-ink", past ? "var(--white)" : c); r.setProperty("--d-scrim", `color-mix(in srgb, ${c} 36%, transparent)`);
    },
    origin() { // BYGG: the rect the panel grows from. On phones the panel always drops from the header button's place, even when the dock's button opened it after a scroll
      const b = this.button(); if (!b) return null;
      const rb = b.getBoundingClientRect(); if (!mobile() || b.classList.contains("menu-top")) return rb;
      const t = $(".menu-top"), pad = Probe.px("var(--pad)", "width"), w = t?.offsetWidth || 119, h = t?.offsetHeight || 44;
      return { top: pad, bottom: pad + h, left: vw() - pad - w, right: vw() - pad, width: w, height: h };
    },
    place() {
      const { panel, close } = this.parts(), b = this.button(); if (!b) return;
      const r = this.origin(), dock = b.closest(".dock");
      if (dock && !mobile()) { const d = dock.getBoundingClientRect(); Object.assign(panel.style, { top: "auto", bottom: this.inVw(innerHeight - d.bottom), right: this.inVw(vw() - d.right), width: "" }); }
      else Object.assign(panel.style, { top: this.inVw(r.top), bottom: "auto", right: this.inVw(vw() - r.right), width: mobile() ? this.inVw(2 * r.right - vw()) : "" }); // the panel opens downward from the header button
      Object.assign(close.style, { top: this.inVw(r.top), left: this.inVw(r.left), width: this.inVw(r.width), height: this.inVw(r.height) }); close.hidden = false; close.classList.toggle("is-labelled", mobile() || !dock);
    },
    clipTo(panel, el) { const p = panel.getBoundingClientRect(), o = el.getBoundingClientRect ? el.getBoundingClientRect() : el; return `inset(${Math.max(o.top - p.top, 0)}px ${Math.max(p.right - o.right, 0)}px ${Math.max(p.bottom - o.bottom, 0)}px ${Math.max(o.left - p.left, 0)}px)`; },
    bar(el, x, animate = true) { if (!el) return; gsap.killTweensOf(el); animate ? gsap.to(el, { attr: { x }, duration: V.drawer.barDur, ease: "power2.inOut" }) : gsap.set(el, { attr: { x } }); },
    open() {
      if (this.isOpen || this.busy) return;
      if (Picker.open) { Picker.hide(() => this.open()); return; }
      const { scrim, panel, close, links, contact } = this.parts(), b = this.button(), D = V.drawer; if (!b) return;
      this.colours(); this.isOpen = this.busy = true; body.classList.add("drawer-open"); this.root().setAttribute("aria-hidden", "false");
      $$("[data-drawer-toggle]").forEach((x) => { x.setAttribute("aria-expanded", "true"); x.setAttribute("aria-label", T.menuClose); });
      panel.style.visibility = "visible"; gsap.set(panel, { clearProps: "clipPath" }); this.place();
      this.bar($(".bar-short", b), D.bar); this.bar($(".bar-short", close), D.bar, false);
      gsap.set(scrim, { opacity: 0 }); gsap.set(panel, { clipPath: this.clipTo(panel, this.origin()) });
      gsap.set($(".bar-long", close), { clipPath: "inset(0px 0px 0px 0px)" });
      const L = { ...V.line, dur: D.links, ease: easeDrawer };
      links.forEach((a) => { a._blk = a.classList.contains("rolls") ? a.firstElementChild : a; a._twin = a.classList.contains("rolls") ? a.lastElementChild : null; if (a._twin) gsap.set(a._twin, { autoAlpha: 0 }); gsap.set(a._blk, { display: "block", overflow: "hidden", transformOrigin: "50% 100%" }); Lines.hide([a._blk], L); });
      gsap.set(contact, { opacity: 0 });
      const tl = (this.tl = gsap.timeline({ onComplete: () => { this.busy = false; } }));
      tl.to($(".bar-long", close), { clipPath: "inset(0px 0px 100% 0px)", duration: D.line, ease: easeDrawer }, 0);
      tl.to(scrim, { opacity: 1, duration: D.scrim, ease: easeDrawer }, 0);
      tl.to(panel, { clipPath: "inset(0px 0px 0px 0px)", duration: D.panel, ease: easeDrawer }, 0);
      links.forEach((a, i) => { const at = D.linkDelay + i * D.linkStagger; Lines.show([a._blk], tl, at, L); tl.call(() => { gsap.set(a._blk, { clipPath: "none", overflow: "visible", clearProps: "transform" }); if (a._twin) gsap.set(a._twin, { autoAlpha: 1 }); }, null, at + L.dur); });
      tl.to(contact, { opacity: 1, duration: D.links * 0.8, ease: easeDrawer }, D.linkDelay + D.links * 0.45);
    },
    close(then) {
      if (!this.isOpen) { then?.(); return; }
      const { scrim, panel, close, links, contact } = this.parts(), b = this.button(), D = V.drawer;
      this.busy = true; this.tl?.kill(); this.place();
      const done = () => {
        body.classList.remove("drawer-open"); this.root().setAttribute("aria-hidden", "true");
        $$("[data-drawer-toggle]").forEach((x) => { x.setAttribute("aria-expanded", "false"); x.setAttribute("aria-label", T.menuOpen); });
        close.hidden = true; panel.style.visibility = "hidden"; gsap.set(panel, { clearProps: "clipPath" }); gsap.set([...links, contact], { clearProps: "opacity" });
        gsap.set($(".bar-long", close), { clipPath: "inset(0px 0px 0px 0px)" }); this.bar($(".bar-short", close), 0, false); this.bar($(".bar-short", b), 0, false);
        this.isOpen = this.busy = false; b?.focus({ preventScroll: true }); then?.();
      };
      const tl = (this.tl = gsap.timeline({ onComplete: done }));
      tl.to([contact, ...links.slice().reverse()], { opacity: 0, duration: D.closeLinks, stagger: D.closeStagger, ease: "power2.in" }, 0);
      tl.to(scrim, { opacity: 0, duration: D.closeRest, ease: easeDrawer }, D.closeDelay);
      tl.to(panel, { clipPath: this.clipTo(panel, this.origin()), duration: D.closeRest, ease: easeDrawer }, D.closeDelay);
      tl.to($(".bar-long", close), { clipPath: "inset(0px 0px 0px 0px)", duration: D.closeRest, ease: easeDrawer }, D.closeDelay);
      this.bar($(".bar-short", close), 0);
    },
    rolls(a) { // #42 two stacked copies, letters roll up
      if (!fine()) return; const txt = a.textContent.trim(); a.classList.add("rolls"); a.replaceChildren();
      const copy = () => { const s = document.createElement("span"); [...txt].forEach((ch) => { const i = document.createElement("i"); i.textContent = ch === " " ? " " : ch; s.appendChild(i); }); return s; };
      const b = copy(); b.setAttribute("aria-hidden", "true"); a.append(copy(), b);
      const letters = $$("i", a); let tw = null;
      const go = (up) => { tw?.kill(); tw = gsap.to(letters, { yPercent: up ? -100 : 0, duration: V.drawer.roll, stagger: up ? V.drawer.rollStagger : 0, ease: "power4.out", overwrite: "auto" }); };
      a.addEventListener("mouseenter", () => go(true)); a.addEventListener("mouseleave", () => go(false));
    },
    bind() {
      const { scrim, panel, links } = this.parts(); links.forEach((a) => this.rolls(a)); panel.style.visibility = "hidden";
      docOn("click", (e) => {
        if (e.target.closest("[data-drawer-toggle]")) { e.preventDefault(); e.stopPropagation(); this.isOpen ? this.close() : this.open(); return; }
        if (e.target.closest(".drawer__close")) { e.preventDefault(); this.close(); return; }
        if (this.isOpen && !e.target.closest(".drawer__panel")) this.close();
      });
      scrim.addEventListener("click", (e) => { e.preventDefault(); this.close(); });
      links.forEach((a) => a.addEventListener("click", (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); e.stopPropagation(); const h = a.getAttribute("href"); this.close(() => Router.go(h, "auto")); }));
      addEventListener("keydown", (e) => { if (e.key === "Escape" && this.isOpen) { e.preventDefault(); this.close(); } });
      // #41 burger bottom bar slides right on hover
      docOn("mouseover", (e) => { const b = e.target.closest("[data-drawer-toggle]"); if (!this.isOpen && b && !b.contains(e.relatedTarget)) this.bar($(".bar-short", b), V.drawer.bar); });
      docOn("mouseout", (e) => { const b = e.target.closest("[data-drawer-toggle]"); if (!this.isOpen && b && !b.contains(e.relatedTarget)) this.bar($(".bar-short", b), 0); });
      addEventListener("resize", () => { if (this.isOpen) this.place(); });
    },
  };

  /* ── page scope: listeners, frame callbacks and triggers that die with a page ── */
  const Scope = {
    ctl: null, ctx: null, offs: [],
    open(root) { this.close(); this.ctl = new AbortController(); this.ctx = gsap.context(() => {}, root); },
    get signal() { return this.ctl?.signal; },
    frame(fn) { this.offs.push(Frame.add(fn)); },
    run(fn) { return this.ctx ? this.ctx.add(fn) : fn(); },
    close() { this.ctl?.abort(); this.ctl = null; this.offs.forEach((f) => f()); this.offs = []; this.ctx?.kill(false); this.ctx = null; }, // kill without reverting (the leaving page keeps its look)
  };

  /* ── frame loop: one rAF drives the scroller and every per-frame module ── */
  const Frame = {
    fns: new Set(), last: performance.now(), running: false, id: 0,
    add(fn) { this.fns.add(fn); this.start(); return () => this.fns.delete(fn); },
    start() { if (this.running) return; this.running = true; this.last = performance.now(); const tick = (now) => { if (!this.running) return; const dt = Math.min((now - this.last) / 1000, 0.1); this.last = now; this.fns.forEach((f) => f(dt)); this.id = requestAnimationFrame(tick); }; this.id = requestAnimationFrame(tick); },
    stop() { this.running = false; cancelAnimationFrame(this.id); this.fns.clear(); },
  };
  const ease120 = (k, dt) => 1 - Math.pow(1 - k, dt * 120); // frame-rate independent lerp (M1)
  const Pointer = { x: innerWidth / 2, y: innerHeight / 2, seen: false };
  addEventListener("pointermove", (e) => { Pointer.x = e.clientX; Pointer.y = e.clientY; Pointer.seen = true; }, { passive: true });
  addEventListener("pointerdown", (e) => { Pointer.x = e.clientX; Pointer.y = e.clientY; Pointer.seen = true; }, { passive: true });

  /* ── smooth scroll (M1): fine pointers only; touch keeps native scroll (standing deviation) ── */
  const refreshHook = () => Smooth.measure();
  const Smooth = {
    on: false, target: 0, current: 0, holds: new Set(), drag: null,
    get locked() { return this.holds.size > 0; },
    max() { return Math.max(0, document.documentElement.scrollHeight - innerHeight); },
    y() { return this.on ? this.current : scrollY; },
    measure() { if (!this.on || !body.classList.contains("is-smooth")) return; body.style.height = ""; const sh = $(".shell"); body.style.height = Math.max(sh ? sh.offsetHeight : 0, document.documentElement.scrollHeight) + "px"; },
    hold(reason, on) { on ? this.holds.add(reason) : this.holds.delete(reason); if (this.on && on) this.target = this.current; },
    to(y, now = false) {
      const v = clamp(y, 0, this.max());
      if (!this.on) { scrollTo(0, v); return; }
      this.target = v; if (now) { this.current = v; scrollTo(0, v); }
    },
    by(d) { if (!this.on || this.locked) return; this.target = clamp(this.target + d, 0, this.max()); },
    page() { // called for every page: home has no document scroll
      const scrolls = true; // BYGG: home is a scrolling page too
      body.classList.toggle("is-smooth", this.on && scrolls);
      this.holds.delete("route"); this.current = this.target = 0; if (scrolls) this.measure(); else body.style.height = ""; scrollTo(0, 0);
    },
    init() {
      history.scrollRestoration = "manual";
      if (!fine() || reduced()) { Frame.add(() => ScrollTrigger.update()); return; } // native scroll
      this.on = true; document.documentElement.style.scrollBehavior = "auto";
      body.classList.toggle("is-smooth", true);
      this.measure(); this.current = this.target = scrollY;
      // BYGG: no scrollerProxy (it would outlive this route and hijack every other preview's ScrollTrigger). The smooth
      // scroller writes window.scrollTo(0, current) every frame, so ScrollTrigger reads the same value from the window.
      ScrollTrigger.addEventListener("refresh", refreshHook);
      addEventListener("wheel", (e) => {
        if (e.ctrlKey) return;
        if (Picker.open || Drawer.isOpen) { e.preventDefault(); return; }
        if (e.target.closest?.(".carousel__viewport") && Carousel.horizontal(e)) { e.preventDefault(); return; }
        const inner = Inner.at(e.target); if (inner) { e.preventDefault(); Inner.by(inner, e.deltaY * V.wheel); return; }
        if (this.locked) { e.preventDefault(); return; }
        this.by(e.deltaY * V.wheel); e.preventDefault();
      }, { passive: false });
      addEventListener("mousedown", (e) => { if (e.button !== 0 || this.locked || Picker.open || Drawer.isOpen) return; this.drag = { y: e.clientY, moved: false }; });
      addEventListener("mousemove", (e) => {
        const d = this.drag; if (!d || Carousel.capturing() || this.locked) return;
        if (!d.moved && Math.abs(e.clientY - d.y) < 5) return;
        if (!d.moved) { d.moved = true; body.classList.add("is-drag-scrolling"); Cursor.show(); }
        const delta = (d.y - e.clientY) * V.touch; Continue.feed(delta, e.target); this.by(delta); d.y = e.clientY;
      });
      addEventListener("mouseup", () => {
        const d = this.drag; this.drag = null; if (!d?.moved) return;
        body.classList.remove("is-drag-scrolling"); Cursor.hide();
        addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true, once: true });
      });
      // keyboard (accessibility addition: the reference blocks native keys by hiding overflow)
      addEventListener("keydown", (e) => {
        if (this.locked || Picker.open || Drawer.isOpen || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
        const page = innerHeight * 0.9, k = { ArrowDown: 80, ArrowUp: -80, PageDown: page, PageUp: -page, " ": e.shiftKey ? -page : page, End: 1e9, Home: -1e9 }[e.key];
        if (k == null) return; e.preventDefault(); this.by(k);
      });
      Frame.add((dt) => {
        if (!body.classList.contains("is-smooth")) { ScrollTrigger.update(); return; }
        if (this.locked) this.target = this.current;
        else { this.current += (this.target - this.current) * ease120(0.042, dt); if (Math.abs(this.target - this.current) < 0.01) this.current = this.target; }
        scrollTo(0, this.current);
        ScrollTrigger.update(); // BYGG: after the scroll write, so the triggers see this frame's position (the source ran it first, one frame behind)
      });
      addEventListener("resize", () => { this.measure(); this.target = clamp(this.target, 0, this.max()); this.current = clamp(this.current, 0, this.max()); });
    },
  };
  const Inner = { // an overflowing side panel or form scrolls itself (getOverlayScrollElFromTarget A:11794)
    el: null, cur: 0, tgt: 0,
    at(t) { const el = t?.closest?.(".panel.is-open .panel__sheet, .enquiry"); return el && el.scrollHeight > el.clientHeight + 1 ? el : null; },
    by(el, d) {
      if (this.el !== el) { this.el = el; this.cur = this.tgt = el.scrollTop; if (!this.on) { this.on = true; Frame.add((dt) => this.tick(dt)); } }
      this.tgt = clamp(this.tgt + d, 0, el.scrollHeight - el.clientHeight);
    },
    tick(dt) { const el = this.el; if (!el?.isConnected) { this.el = null; return; } this.cur += (this.tgt - this.cur) * ease120(0.042, dt); if (Math.abs(this.tgt - this.cur) < 0.1) this.cur = this.tgt; el.scrollTop = this.cur; },
    reset() { this.el = null; },
  };
  window.scroller = { to: (y, now) => Smooth.to(y, now), get current() { return Smooth.y(); }, get max() { return Smooth.max(); } }; // test hook
  const Scroll = { y: () => Smooth.y(), lock(on) { Smooth.hold("lock", on); }, to(y, now) { Smooth.to(y, now); } };

  /* ── drag cursor (M14: only while the page is being drag-scrolled) ── */
  const Cursor = {
    el: null, x: 0, y: 0, on: false, t: null,
    make() { if (this.el) return this.el; const e = document.createElement("div"); e.className = "cursor"; e.setAttribute("aria-hidden", "true"); e.innerHTML = '<span class="cursor__disc"><span class="cursor__words"><span class="cursor__word cursor__word--play">' + T.play + '</span><span class="cursor__word cursor__word--stop">' + T.stop + '</span></span></span>'; body.appendChild(e); extra.push(e); this.el = e; Frame.add((dt) => this.tick(dt)); return e; },
    place() { this.el.style.setProperty("--x", this.x + "px"); this.el.style.setProperty("--y", this.y + "px"); },
    show(mode = "drag", playing = false) {
      if (!fine()) return; const e = this.make(); clearTimeout(this.t); clearTimeout(this.wt);
      if (!this.on) { this.x = Pointer.x; this.y = Pointer.y; this.place(); }
      const stale = mode === "play" && e.classList.contains("is-play") && e.classList.contains("is-playing") !== playing; // re-entry while exiting: roll (uy() A:5454)
      this.on = true; e.classList.remove("is-off", "to-play", "to-stop"); e.classList.toggle("is-play", mode === "play");
      if (stale) this.playing(playing, false); else e.classList.toggle("is-playing", mode === "play" && playing);
      if (!e.classList.contains("is-on")) requestAnimationFrame(() => this.on && e.classList.add("is-on"));
    },
    hide() { if (!this.el || !this.on) return; this.on = false; this.el.classList.add("is-off"); this.t = setTimeout(() => this.el.classList.remove("is-on", "is-off", "is-play", "is-playing"), 750); },
    playing(on, instant = true) { // Play ↔ Stop: instant on the film's play/pause events, 0.5 s roll otherwise (A9, td()/ed() A:5422-5518)
      const e = this.el; if (!e?.classList.contains("is-play") || e.classList.contains("is-playing") === on) return;
      clearTimeout(this.wt); e.classList.remove("to-play", "to-stop"); e.classList.toggle("is-playing", on); if (instant) return;
      void e.offsetWidth; e.classList.add(on ? "to-stop" : "to-play"); this.wt = setTimeout(() => e.classList.remove("to-play", "to-stop"), 500);
    },
    tick(dt) { if (!this.on && !this.el.classList.contains("is-off")) return; const k = ease120(0.1, dt); this.x += (Pointer.x - this.x) * k; this.y += (Pointer.y - this.y) * k; this.place(); },
  };

  /* ── scroll-continue ring (M10, C20) ──────────────────────── */
  const Continue = {
    acc: 0, shown: 0, on: false, done: false, el: null, x: 0, y: 0, t: null,
    limit: () => (mobile() ? 900 : 1100),
    link: () => $(".next__link"),
    bottom() { const m = Smooth.max(); return m <= 0 || Math.max(Smooth.y(), Smooth.on ? Smooth.target : 0) >= m - 32; },
    can(t) { return /^(category|about)$/.test(body.dataset.page) && !this.done && !Picker.open && !Drawer.isOpen && !Router.busy && body.classList.contains("is-ready") && !Intro.locked && !Smooth.locked && !t?.closest?.(".carousel__viewport, .carousel__arrow") && !!this.link() && this.bottom(); },
    feed(delta, target) {
      if (!delta || this.done || !this.link()) return;
      const n = clamp(delta, -64, 64);
      if (n < 0) { if (this.acc <= 0 && this.shown <= 0.5) return; this.acc = Math.max(0, this.acc + n); return; }
      if (this.can(target)) this.acc = Math.min(this.limit(), this.acc + n);
    },
    make() {
      if (this.el) return this.el; const e = document.createElement("div"); e.className = "ring"; e.setAttribute("aria-hidden", "true");
      e.innerHTML = '<span class="ring__disc"><span class="ring__fill"></span><span class="ring__label">' + T.scroll + '</span></span>'; body.appendChild(e); extra.push(e); this.el = e; return e;
    },
    spot() { if (mobile()) return { x: innerWidth * 0.5, y: innerHeight * 0.72 }; return Pointer.seen ? { x: Pointer.x, y: Pointer.y } : { x: innerWidth * 0.5, y: innerHeight * 0.72 }; },
    place() { this.el.style.setProperty("--x", this.x + "px"); this.el.style.setProperty("--y", this.y + "px"); },
    fill(p) { this.make().style.setProperty("--p", clamp(p, 0, 100) + "%"); },
    show() { const e = this.make(); clearTimeout(this.t); if (!this.on) { const s = this.spot(); this.x = s.x; this.y = s.y; this.place(); } this.on = true; e.classList.remove("is-off"); if (!e.classList.contains("is-on")) requestAnimationFrame(() => this.on && e.classList.add("is-on")); },
    hide() { if (!this.el || !this.on) return; this.on = false; this.el.classList.add("is-off"); this.t = setTimeout(() => { this.el.classList.remove("is-on", "is-off"); this.fill(0); }, 750); },
    tick(dt) {
      if (this.el && (this.on || this.el.classList.contains("is-off"))) { const s = this.spot(), k = ease120(0.1, dt); this.x += (s.x - this.x) * k; this.y += (s.y - this.y) * k; this.place(); }
      if (this.done || !/^(category|about)$/.test(body.dataset.page) || Router.busy) return;
      const atEnd = !!this.link() && this.bottom() && !Intro.locked;
      if (!atEnd && this.acc > 0) this.acc = 0;
      const has = this.acc > 0.5 || this.shown > 0.5;
      if (atEnd || has) this.show(); else if (this.on) this.hide();
      if (!atEnd && !has) return;
      const k = ease120(this.shown > this.acc + 0.5 ? 0.16 : 0.042, dt);
      this.shown += (this.acc - this.shown) * k; if (Math.abs(this.shown - this.acc) < 0.35) this.shown = this.acc;
      this.fill((this.shown / this.limit()) * 100);
      if (atEnd && this.acc >= this.limit() && this.shown >= this.limit() - 2) this.complete();
    },
    complete() {
      this.done = true; this.fill(100); Scroll.lock(true);
      const a = this.link(); requestAnimationFrame(() => requestAnimationFrame(() => { this.hide(); Router.go(a.getAttribute("href"), "next", a.closest(".next")); }));
    },
    reset(hard = false) { this.acc = this.shown = 0; this.done = false; if (!this.on) return; if (!hard) { this.hide(); return; } this.on = false; clearTimeout(this.t); this.el.classList.remove("is-on", "is-off"); this.fill(0); }, // hard = Zf() A:5351
    bind() {
      Frame.add((dt) => this.tick(dt));
      addEventListener("wheel", (e) => { if (!e.ctrlKey) this.feed(e.deltaY * V.wheel, e.target); }, { passive: true });
      let ty = null;
      addEventListener("touchstart", (e) => { ty = e.touches[0]?.clientY ?? null; }, { passive: true });
      addEventListener("touchmove", (e) => { const y = e.touches[0]?.clientY; if (y == null || ty == null) return; this.feed((ty - y) * V.touch, e.target); ty = y; }, { passive: true });
    },
  };

  /* ── custom scrollbar (M1, C23) ───────────────────────────── */
  const Scrollbar = {
    mount() {
      if (!Smooth.on || matchMedia("(hover: none), (max-width: 768px)").matches) return;
      const bar = document.createElement("div"); bar.className = "scrollbar"; bar.innerHTML = '<div class="scrollbar__track"><div class="scrollbar__thumb"></div></div>'; body.appendChild(bar); extra.push(bar);
      const track = bar.firstElementChild, thumb = track.firstElementChild; let last = null, t1 = null, t2 = null, dragging = false, y0 = 0, pos = 0, want = null;
      const size = (y) => { const m = Smooth.max(), h = track.getBoundingClientRect().height, th = m <= 0 ? h : Math.max(40, h * (innerHeight / Math.max(document.documentElement.scrollHeight, 1))); thumb.style.height = th + "px"; thumb.style.transform = `translateY(${m <= 0 ? 0 : (y / m) * (h - th)}px)`; };
      const later = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(() => { t2 = setTimeout(() => { if (!dragging) bar.classList.remove("is-visible"); }, 2000); }, 200); };
      Frame.add(() => { const y = Smooth.y(); size(y); if (last !== null && Math.abs(y - last) > 0.5) { bar.classList.add("is-visible"); later(); } last = y; });
      track.addEventListener("mousedown", (e) => { if (e.target !== track) return; e.preventDefault(); bar.classList.add("is-visible"); later(); const r = track.getBoundingClientRect(); Smooth.to(clamp((e.clientY - r.top) / r.height, 0, 1) * Smooth.max(), true); });
      const move = (e) => { if (!dragging) return; const r = track.getBoundingClientRect(), free = r.height - thumb.offsetHeight, d = e.clientY - y0; y0 = e.clientY; if (free <= 0) return; pos = clamp(pos + (d / free) * Smooth.max(), 0, Smooth.max()); size(pos); if (want === null) requestAnimationFrame(() => { if (want !== null) Smooth.to(want); want = null; }); want = pos; };
      const up = () => { dragging = false; removeEventListener("mousemove", move); removeEventListener("mouseup", up); later(); };
      thumb.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); bar.classList.add("is-visible"); dragging = true; y0 = e.clientY; pos = Smooth.y(); addEventListener("mousemove", move); addEventListener("mouseup", up); });
    },
  };

  /* ── projects carousel (M11 #2, C9) ────────────────────────── */
  const Carousel = {
    api: null,
    horizontal(e) { const dx = Math.abs(e.deltaX), dy = Math.abs(e.deltaY); return e.shiftKey && dy > 3 ? true : dx < 3 ? false : dx > dy * 1.75; },
    capturing() { return !!this.api?.capturing(); },
    mount(root) {
      const box = $(".carousel", root), vp = $(".carousel__viewport", root), strip = $(".carousel__strip", root);
      if (!box || !vp || !strip) return;
      const C = { snap: 500, ease: bezier(0.31, 0.04, 0, 0.99), couple: 1, ahead: 0.12, drag: 2.5, fling: 1200, flingMin: 0.15, follow: 0.08, release: 0.12, lock: 5, wheel: 0.8, wheelEase: 0.22, wheelMs: 120 };
      const items = $$(".carousel__slide", strip), n = items.length; if (!n) return;
      const pre = document.createDocumentFragment(), post = document.createDocumentFragment();
      items.forEach((it) => { const a = it.cloneNode(true), b = it.cloneNode(true); a.setAttribute("aria-hidden", "true"); b.setAttribute("aria-hidden", "true"); pre.appendChild(a); post.appendChild(b); });
      strip.prepend(pre); strip.append(post);
      const gallery = box.closest(".gallery") || box;
      const inView = () => { const r = gallery.getBoundingClientRect(); return r.bottom > 0 && r.top <= innerHeight * (1 + C.ahead); };
      let pitch = 0, setW = 0, base = 0, want = 0, x = 0, anchor = 0, at = Scroll.y(), offset = 0, vel = 0, free = false, gen = 0, snapping = false;
      let down = false, moved = false, locked = false, sx = 0, sy = 0, lx = 0, lt = 0, avg = 0, wasIn = false, wheelUntil = 0; const samples = [];
      const paint = () => { strip.style.transform = `translate3d(${-x}px, 0, 0)`; };
      const centre = (i) => { const it = items[i]; return it ? strip.offsetLeft + it.offsetLeft + it.offsetWidth / 2 - vp.clientWidth / 2 : base; };
      const nearest = (pos) => { const c = vp.clientWidth / 2; let best = 0, d = Infinity; for (let i = 0; i < n; i++) { const it = items[i], e = Math.abs(strip.offsetLeft + it.offsetLeft - pos + it.offsetWidth / 2 - c); if (e < d) { d = e; best = i; } } return best; };
      const wrap = () => { if (!setW) return; while (want >= base + setW) { want -= setW; x -= setW; offset -= setW; } while (want < base) { want += setW; x += setW; offset += setW; } };
      const coupled = () => anchor - (Scroll.y() - at) * C.couple;
      const goal = () => (inView() ? coupled() : anchor);
      const reanchor = () => { anchor = x - offset; at = Scroll.y(); };
      const settle = () => { free = false; offset = want - goal(); reanchor(); };
      const measure = () => {
        const p = items[1] ? items[1].offsetLeft - items[0].offsetLeft : items[0].offsetWidth + (parseFloat(getComputedStyle(strip).gap) || 0), w = p * n;
        if (w && setW) { const b0 = base, x0 = x; pitch = p; setW = w; base = centre(0); const d = base - b0; if (d) { x = x0 + d; want = x; anchor += d; } reanchor(); }
        else { pitch = p; setW = w; base = centre(0); want = x = anchor = base; at = Scroll.y(); offset = 0; wasIn = inView(); }
        wrap(); paint();
      };
      const readX = () => { const m = strip.style.transform.match(/translate3d\((-?[\d.]+)px/); if (!m) return x; x = want = -parseFloat(m[1]); return x; };
      const snapTo = (from, dir) => { const j = (nearest(from) + dir + n * 2) % n; let t = centre(j); const d = t - from; if (d > setW / 2) t -= setW; else if (d < -setW / 2) t += setW; return t; };
      const step = (dir) => {
        if (down || !pitch) return; vel = 0; if (free) { x = want; settle(); }
        const from = readX(); reanchor(); offset = from - goal(); free = false; const g = ++gen; snapping = true;
        const to = snapTo(from, dir), t0 = performance.now();
        const run = (now) => { if (g !== gen) return; const p = Math.min((now - t0) / C.snap, 1); x = from + (to - from) * C.ease(p); want = x; paint();
          if (p < 1) requestAnimationFrame(run); else { snapping = false; x = want = to; offset = to - goal(); reanchor(); wrap(); paint(); } };
        requestAnimationFrame(run);
      };
      const pt = (e) => ({ x: e.clientX ?? e.touches?.[0]?.clientX, y: e.clientY ?? e.touches?.[0]?.clientY });
      const start = (e) => { if (e.target.closest(".carousel__arrow")) return; gen++; snapping = false; reanchor(); down = true; moved = false; locked = false; vel = 0; avg = 0; samples.length = 0; want = x; const p = pt(e); sx = lx = p.x; sy = p.y; lt = performance.now(); };
      const release = () => { if (!down) return; down = false; moved = false; locked = false; vp.classList.remove("is-dragging"); };
      const move = (e) => {
        if (!down) return; const p = pt(e); if (p.x == null) return; const dx = p.x - sx, dy = p.y - sy;
        if (!locked) { if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > C.lock) { locked = true; free = true; vp.classList.add("is-dragging"); } else if (Math.abs(dy) > C.lock && Math.abs(dy) >= Math.abs(dx)) { release(); return; } else return; }
        e.preventDefault(); moved = true; const now = performance.now(), dt = now - lt;
        if (dt > 0) { samples.push((p.x - lx) / dt); if (samples.length > 5) samples.shift(); avg = samples.reduce((a, b) => a + b, 0) / samples.length; }
        lx = p.x; lt = now; want += -dx * C.drag; sx = p.x; sy = p.y; wrap();
      };
      const end = () => { if (!down) return; down = false; vp.classList.remove("is-dragging"); if (moved && Math.abs(avg) > C.flingMin) vel = -avg * C.fling; else settle(); moved = false; };
      const hdelta = (e) => (e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX);
      const signal = Scope.signal;
      vp.addEventListener("mousedown", start, { signal }); addEventListener("mousemove", move, { capture: true, signal }); addEventListener("mouseup", end, { signal });
      vp.addEventListener("touchstart", start, { passive: true, signal }); addEventListener("touchmove", move, { capture: true, passive: false, signal }); addEventListener("touchend", end, { signal });
      vp.addEventListener("wheel", (e) => { if (!this.horizontal(e)) return; e.preventDefault(); offset += hdelta(e) * C.wheel; want = goal() + offset; wrap(); wheelUntil = performance.now() + C.wheelMs; }, { passive: false });
      $('.carousel__arrow[data-step="prev"]', box)?.addEventListener("click", () => pitch && step(1));
      $('.carousel__arrow[data-step="next"]', box)?.addEventListener("click", () => pitch && step(-1));
      $$("img", strip).forEach((i) => { if (!i.complete) i.addEventListener("load", measure, { once: true }); });
      addEventListener("resize", measure, { signal });
      measure(); reanchor();
      Scope.frame((dt) => {
        const flinging = free && !down && !snapping && Math.abs(vel) > 0.5;
        if (flinging) { want += vel * dt; vel *= Math.pow(0.94, 60 * dt); if (Math.abs(vel) < 0.5) vel = 0; wrap(); }
        if (!snapping) {
          if (free) { x += (want - x) * ease120(down ? C.follow : C.release, dt); wrap(); if (!down && !flinging && Math.abs(want - x) < 0.5) { x = want; settle(); } }
          else {
            const iv = inView(); if (iv && !wasIn) reanchor(); else if (!iv && wasIn) { anchor = x - offset; at = Scroll.y(); }
            wasIn = iv; want = goal() + offset; wrap();
            if (performance.now() < wheelUntil && Math.abs(want - x) > 0.5) { x += (want - x) * ease120(C.wheelEase, dt); wrap(); } else x = want;
          }
        }
        paint();
      });
      this.api = { capturing: () => down && locked, measure, reanchor };
      signal?.addEventListener("abort", () => { this.api = null; });
    },
  };

  /* ── length probe: one parked element resolves any CSS length (svh, var(), calc) to px ── */
  const Probe = {
    el: null,
    px(len, axis = "height") {
      if (!this.el) { this.el = document.createElement("i"); this.el.className = "probe"; this.el.setAttribute("aria-hidden", "true"); }
      if (!this.el.isConnected) { body.appendChild(this.el); extra.push(this.el); }
      const w = axis === "width"; this.el.style.width = w ? len : "0px"; this.el.style.height = w ? "0px" : len;
      const r = this.el.getBoundingClientRect(); return w ? r.width : r.height;
    },
  };

  /* ── category page: hero grow + exit, parallax, reveals, CTA (M11, C4-C8, C16, C18, C19) ── */
  const Category = {
    past(on) { if (body.classList.contains("past-hero") === on) return; body.classList.toggle("past-hero", on); },
    grow(root) {
      const stage = $(".scene", root), photo = $(".hero--category .hero__photo", root); if (!stage || !photo) return;
      if (reduced()) { const theme = (st) => this.past(st.progress > 0); ScrollTrigger.create({ trigger: stage, start: "bottom bottom", end: "bottom top", onUpdate: theme, onRefresh: theme }); return; } // R1/R2: no grow, no exit; past-hero kept
      const toVw = (px) => (px / innerWidth) * 100, g = {};
      const endH = () => { g.endH = Math.max(toVw(Probe.px("110svh")), toVw(innerHeight) + 2 * 2); body.style.setProperty("--end-h", g.endH + "vw"); };
      const layout = () => {
        endH();
        g.w0 = Probe.px("var(--photo)", "width"); g.h0 = Probe.px("var(--photo)");
        gsap.set(photo, { width: g.w0, height: g.h0, x: 0, y: "0vw" });
        const cs = getComputedStyle(body); g.grow = parseFloat(cs.getPropertyValue("--grow")) || 1; g.gap = 5.236; g.hold = toVw(Probe.px("5svh"));
        g.sa = (g.endH + g.gap) * g.grow;
        const top = toVw(photo.getBoundingClientRect().top - stage.getBoundingClientRect().top);
        g.y = toVw(stage.offsetHeight) - toVw(innerHeight) / 2 - (top - (g.endH - toVw(g.h0)) / 2 + g.endH / 2);
      };
      const tl = gsap.timeline({ paused: true });
      const fill = () => {
        tl.clear();
        tl.fromTo(photo, { width: g.w0, height: g.h0, y: "0vw" }, { width: "100vw", height: g.endH + "vw", y: g.y + "vw", ease: "none", duration: 1, immediateRender: true }, 0);
        const copy = $(".hero--category .hero__copy", root); // BYGG: the headline and price step aside as the photo starts to grow instead of sitting under it
        if (copy) tl.fromTo(copy, { opacity: 1 }, { opacity: 0, duration: 0.14, ease: "none", immediateRender: false }, 0); // fromTo: a refresh mid-scroll must not record 0 as the start
        if (g.hold > 0) tl.to({}, { duration: g.hold / g.sa, ease: "none" }, ">");
      };
      const pastAt = (p) => this.past(p / (g.sa / (g.sa + g.hold)) >= 1);
      layout(); fill();
      ScrollTrigger.create({ trigger: stage, start: "top top", end: "bottom bottom", scrub: 0, animation: tl, invalidateOnRefresh: true,
        onRefreshInit: endH, onRefresh: (st) => { layout(); fill(); tl.progress(st.progress); pastAt(st.progress); }, onUpdate: (st) => pastAt(st.progress) });
      gsap.fromTo(stage, { opacity: 1, yPercent: 0, immediateRender: false }, { opacity: 0.3, yPercent: 10, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: stage, start: "bottom bottom", end: "bottom top", scrub: true } }); // C7
    },
    parallax(root) {
      const drift = (el, trigger, travel, from, to) => {
        gsap.set(el, { yPercent: -travel, scale: from, force3D: true, transformOrigin: "center center" });
        if (reduced()) return; // parked at the start state (F0()/q0() set it before returning, R1)
        const v = { yPercent: travel, ease: "none", immediateRender: false, scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.3, invalidateOnRefresh: true } };
        if (to != null) v.scale = to;
        const tw = gsap.fromTo(el, { yPercent: -travel, ...(to != null ? { scale: from } : {}) }, v);
        const img = el.tagName === "IMG" ? el : $("img", el); if (img && !img.complete) img.addEventListener("load", () => tw.scrollTrigger?.refresh(), { once: true });
      };
      $$(".photo-break", root).forEach((s) => drift($("img", s), s, 6, 1.1, 1));        // C8 (BYGG: travel 10 -> 6, scale 1.2 -> 1.1)
      $$(".next", root).forEach((s) => drift($(".next__drift", s), s, 4, 1.1, null));
      $$(".fact__figure, .wellness__figure", root).forEach((f) => drift($("img", f), f, 5, 1.08, null));
    },
    reveals(root) { // C19
      const main = $(".page__main", root) || root, skip = ".hero__copy, .ticker, form, button, [hidden], .sr-only, .desk__stack, .enquiry";
      $$("h1, h2, h3, h4, h5, h6, p", main).filter((e) => !e.closest(skip) && e.textContent.trim()).forEach((el) => {
        const line = el.matches(".cta__link") ? $(".cta__underline", el) : null;
        if (reduced()) { if (line) line.style.setProperty("--cta-line", 1); return; }
        const lines = Lines.split(el); Lines.hide(lines);
        if (line) gsap.set(line, { "--cta-line": 0 });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => {
          Lines.show(lines).eventCallback("onComplete", () => Lines.settle(el));
          if (line) gsap.delayedCall(V.line.dur + 0.12, () => { line.classList.add("is-drawing"); gsap.fromTo(line, { "--cta-line": 0 }, { "--cta-line": 1, duration: 0.65, ease: "power2.inOut", overwrite: "auto", onComplete: () => line.classList.remove("is-drawing") }); }); // C16
        } });
      });
    },
    cta(root) { const c = $(".cta", root); if (!c) return; // C18
      ScrollTrigger.create({ trigger: c, start: "top bottom", end: "bottom top", onEnter: () => Dock.hide("cta", true), onEnterBack: () => Dock.hide("cta", true), onLeave: () => Dock.hide("cta", false), onLeaveBack: () => Dock.hide("cta", false) }); },
    images(root) { // C26: photo-break images load at once; other lazy images one viewport ahead
      $$(".photo-break img[loading='lazy'], .carousel img[loading='lazy']", root).forEach((i) => { i.loading = "eager"; }); // BYGG: slides sit off-screen sideways, so the vertical observer below never reaches them
      const lazy = $$("img[loading='lazy']", root); if (!lazy.length || !("IntersectionObserver" in window)) return;
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.loading = "eager"; io.unobserve(e.target); } }), { rootMargin: `${Math.round(innerHeight)}px 0px ${Math.round(innerHeight)}px 0px` });
      lazy.forEach((i) => io.observe(i));
    },
    mount(root) {
      this.images(root);
      const dock = $(".dock", root); if (dock) { $(".shell").appendChild(dock); Dock.use(dock); } // C24: fixed actions live outside the transformed page
      $$(".ticker--outro", root).forEach((t) => Ticker.start(t));
      Scope.run(() => { this.grow(root); this.parallax(root); Carousel.mount(root); this.reveals(root); this.cta(root); });
      addEventListener("load", () => ScrollTrigger.refresh(), { signal: Scope.signal });
    },
  };

  /* ── About: hero drift + exit, film (M12, A1-A14) ───────────── */
  const About = {
    hero(root) {
      const stage = $(".scene--about", root), img = $(".backdrop__image", root), shade = $(".backdrop__shade", root); if (!stage) return;
      const theme = (st) => Category.past(st.progress > 0); // past-hero as soon as the exit starts (A:10952)
      if (reduced()) { ScrollTrigger.create({ trigger: stage, start: "bottom bottom", end: "bottom top", onUpdate: theme, onRefresh: theme }); return; }
      gsap.fromTo(img, { yPercent: 0 }, { yPercent: 26, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } }); // A4 (BYGG: 40 -> 26)
      gsap.timeline({ scrollTrigger: { trigger: stage, start: "bottom bottom", end: "bottom top", scrub: true, onUpdate: theme, onRefresh: theme } })
        .fromTo(stage, { yPercent: 0 }, { yPercent: 10, ease: "none", duration: 1 }, 0)
        .fromTo(shade, { opacity: 0 }, { opacity: 1, ease: "none", duration: 1 }, 0);
    },
    mount(root) {
      Category.images(root);
      const dock = $(".dock", root); if (dock) { $(".shell").appendChild(dock); Dock.use(dock); } // C24
      $$(".ticker--outro", root).forEach((t) => Ticker.start(t));
      Scope.run(() => { this.hero(root); Category.parallax(root); Film.mount(root); Category.reveals(root); Category.cta(root); });
      addEventListener("load", () => ScrollTrigger.refresh(), { signal: Scope.signal });
    },
  };

  /* ── home (BYGG): a plain scrolling page. Calm reveals, an anchor that scrolls, the dock beside the page ── */
  const Home = {
    reveals(root) {
      if (reduced()) return;
      $$("[data-reveal]", root).forEach((g) => {
        const items = g.matches(".pgrid, .how") ? [...g.children] : [g];
        items.forEach((el, i) => {
          gsap.set(el, { opacity: 0, y: 22 });
          ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 2) * 0.08, clearProps: "transform,opacity" }) });
        });
      });
    },
    anchors(root) {
      root.addEventListener("click", (e) => {
        const a = e.target.closest?.("a[data-scroll]"); if (!a) return;
        const t = $(a.getAttribute("href"), root); if (!t) return;
        e.preventDefault();
        const y = t.getBoundingClientRect().top + Scroll.y();
        if (Smooth.on) Scroll.to(y); else scrollTo({ top: y, behavior: reduced() ? "auto" : "smooth" });
        t.focus({ preventScroll: true });
      }, { signal: Scope.signal });
    },
    mount(root) {
      Category.images(root);
      const dock = $(".dock", root); if (dock) { $(".shell").appendChild(dock); Dock.use(dock); }
      Scope.run(() => { this.reveals(root); this.anchors(root); });
      addEventListener("load", () => ScrollTrigger.refresh(), { signal: Scope.signal });
    },
  };

  const Film = {
    mount(root) {
      const stage = $(".film", root), cell = $(".film__card", root), frame = $(".film__frame", root), btn = $(".film__button", root); if (!stage || !cell || !frame) return;
      const still = $(".film__still", frame), movie = $(".film__movie", frame), disc = $(".film__play", frame), signal = Scope.signal;
      // BYGG: BYGG's own film sits on Vimeo with embedding limited to bygg.is, so the card keeps the scroll-expand device with a still and no player.
      const player = !!(btn && movie);
      const X = { dur: 0.75, ease: "power2.inOut" }; // A8
      let playing = false, tl = null;
      const label = () => btn?.setAttribute("aria-label", playing ? T.filmPause : T.filmPlay);
      const ready = () => new Promise((ok) => { if (movie.readyState >= 2) return ok(); if (!movie.src) { movie.src = movie.dataset.src; movie.load(); } movie.addEventListener("loadeddata", ok, { once: true }); setTimeout(ok, 4000); });
      const start = async () => {
        playing = true; label();
        await ready(); if (!playing) return;
        movie.muted = false; movie.volume = 0; movie.currentTime = 0; gsap.set(movie, { opacity: 0 });
        try { await movie.play(); } catch { stop(); return; }
        tl?.kill();
        if (reduced()) { gsap.set(still, { opacity: 0 }); gsap.set(movie, { opacity: 1 }); gsap.set(disc, { opacity: 0 }); movie.volume = 1; return; }
        tl = gsap.timeline({ defaults: X }).to(still, { opacity: 0 }, 0).to(movie, { opacity: 1 }, 0).to(disc, { opacity: 0 }, 0).to(movie, { volume: 1 }, 0);
      };
      const stop = () => {
        playing = false; label(); tl?.kill();
        const done = () => { movie.pause(); movie.muted = true; };
        if (reduced()) { gsap.set(still, { opacity: 1 }); gsap.set(movie, { opacity: 0 }); gsap.set(disc, { opacity: 1 }); done(); return; }
        tl = gsap.timeline({ defaults: X, onComplete: done }).to(movie, { volume: 0 }, 0).to(still, { opacity: 1 }, 0).to(movie, { opacity: 0 }, 0).to(disc, { opacity: 1 }, 0);
      };
      if (player) {
        btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); playing ? stop() : start(); }, { signal });
        movie.addEventListener("ended", () => { if (playing) stop(); }, { signal });
        const live = () => !movie.paused && !movie.ended;
        ["play", "playing", "pause", "ended"].forEach((t) => movie.addEventListener(t, () => Cursor.playing(live()), { signal }));
        btn.addEventListener("pointerenter", () => Cursor.show("play", live()), { signal });
        btn.addEventListener("pointerleave", () => Cursor.hide(), { signal });
        signal?.addEventListener("abort", () => { movie.pause(); Cursor.hide(); });
      }
      // scroll-expand (A7): the cell never moves (it is the trigger); the frame grows from its rect to the viewport
      const lerp = (a, b, t) => a + (b - a) * t;
      let hold = null, S = null;
      const apply = (p) => {
        if (p <= 0) { hold = null; S = null; frame.classList.remove("is-live"); gsap.set(frame, { clearProps: "top,left,width,height" }); return; }
        const s = stage.getBoundingClientRect(), W = innerWidth, H = vh();
        if (!S) { const r = cell.getBoundingClientRect(); S = { top: r.top, left: r.left, w: r.width, h: r.height }; } // start rect = where the card is at the first update (K() A:12612)
        frame.classList.add("is-live");
        if (p >= 1) { if (hold == null) hold = -s.top; gsap.set(frame, { top: hold, left: -s.left, width: W, height: H }); return; } // then it scrolls on with the page
        hold = null; const e = 1 - (1 - p) * (1 - p); // position out-quad, size linear
        gsap.set(frame, { top: lerp(S.top, 0, e) - s.top, left: lerp(S.left, 0, e) - s.left, width: lerp(S.w, W, p), height: lerp(S.h, H, p) });
      };
      ScrollTrigger.create({ trigger: cell, start: "bottom bottom", endTrigger: stage, end: "bottom bottom", scrub: true, invalidateOnRefresh: true,
        onUpdate: (st) => apply(st.progress), onRefresh: (st) => { hold = null; apply(st.progress); } });
      addEventListener("resize", () => { S = null; }, { signal }); // a resize re-reads the start rect (uS() A:12520)
    },
  };

  /* ── Contact + 404 (M13) ─────────────────────────────────────── */
  const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const Flow = { prefill: null }; // BYGG: a ledger button carries its project and size band to the enquiry form

  const Phone = { // guarded dial prefix in the phone field (t0()/Qv() A:10440-10489)
    prefix: (el) => (el.dataset.dial ? el.dataset.dial + " " : ""),
    check(el) { const p = this.prefix(el); el.setCustomValidity(!p || el.value.slice(p.length).replace(/\D/g, "").length ? "" : T.phoneNeeded); },
    set(el, code, d) {
      const dial = d.dial[code] ? "+" + d.dial[code] : ""; if (!dial) return;
      const old = this.prefix(el); const was = el.dataset.dial || ""; let rest = old && el.value.startsWith(old) ? el.value.slice(old.length) : was && el.value.startsWith(was) ? el.value.slice(was.length).trimStart() : el.value.trim() === dial ? "" : el.value.replace(/^\+\d+\s*/, "");
      rest = rest.trim(); el.value = `${dial} ${rest}`; el.dataset.dial = dial; el.placeholder = d.example[code] || dial; this.check(el);
      try { el.focus({ preventScroll: true }); el.setSelectionRange(el.value.length, el.value.length); } catch {}
    },
    guard(el, signal) {
      const k = () => this.prefix(el).length, caret = (a, b = a) => { try { el.setSelectionRange(a, b); } catch {} };
      el.addEventListener("keydown", (e) => {
        const n = k(); if (!n) return; const a = el.selectionStart ?? 0, b = el.selectionEnd ?? 0;
        if ((e.key === "Backspace" || e.key === "Delete") && a < n) { e.preventDefault(); caret(n, Math.max(b, n)); return; }
        if (e.key === "Home") { e.preventDefault(); caret(n, e.shiftKey ? b : n); return; }
        if (e.key === "ArrowLeft" && a <= n && !e.shiftKey) { e.preventDefault(); caret(n); return; }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && a < n) { e.preventDefault(); caret(n); }
      }, { signal });
      el.addEventListener("input", () => {
        const p = this.prefix(el);
        if (p) { const dial = el.dataset.dial, raw = el.value; // prefix, then the bare dial code (space deleted), then any other +code (Kv() A:10355)
          const v = raw.startsWith(p) ? raw.slice(p.length) : raw.startsWith(dial) ? raw.slice(dial.length).trimStart() : raw.replace(/^\+\d+\s*/, ""), next = p + v.replace(/[^\d\s\-()]/g, "");
          if (next !== el.value) { const at = Math.max(p.length, Math.min(el.selectionStart ?? next.length, next.length)); el.value = next; caret(at); } }
        this.check(el);
      }, { signal });
      ["focus", "click"].forEach((t) => el.addEventListener(t, () => { const n = k(); if (n && (el.selectionStart ?? 0) < n) caret(n, Math.max(el.selectionEnd ?? n, n)); }, { signal }));
    },
  };

  const Panel = { // side panel (kv()/Rg() A:10078-10620); BYGG: the text is the preview's own note on personal data, not the reference's policy
    el: null,
    build() { // made at page init, hidden (Dv() → kv() A:10078)
      if (this.el) return;
      const e = document.createElement("div"); e.className = "panel"; e.setAttribute("role", "dialog"); e.setAttribute("aria-modal", "true"); e.setAttribute("aria-hidden", "true"); e.setAttribute("aria-labelledby", "policy-title");
      e.innerHTML = '<div class="panel__sheet"><div class="panel__inner"><button type="button" class="panel__close" aria-label="' + esc(T.close) + '" data-close>&times;</button><h3 class="panel__title" id="policy-title">' + esc(T.policyTitle) + '</h3><div class="panel__body">' + cfg.policyHtml + '</div></div></div>';
      e.addEventListener("click", (ev) => { if (ev.target === e || ev.target.closest("[data-close]")) this.close(); });
      body.appendChild(e); this.el = e; void e.offsetWidth;
    },
    open() {
      this.build(); const e = this.el; if (!e) return; $(".panel__sheet", e).scrollTop = 0; Inner.reset(); e.classList.add("is-open"); e.setAttribute("aria-hidden", "false"); Smooth.hold("panel", true);
    },
    close() { if (!this.el?.classList.contains("is-open")) return; this.el.classList.remove("is-open"); this.el.setAttribute("aria-hidden", "true"); Smooth.hold("panel", false); },
    drop() { this.el?.remove(); this.el = null; Smooth.hold("panel", false); },
  };

  const Thanks = { // thank-you modal (Bv()/Vv()/Ag() A:10198-10275); BYGG: it also says where the enquiry would go
    el: null, t: null,
    open(info = {}) {
      clearTimeout(this.t); this.el?.remove(); this.el = null;
      const list = info.list || [];
      const e = document.createElement("div"); e.className = "thanks"; e.setAttribute("role", "dialog"); e.setAttribute("aria-modal", "true"); e.setAttribute("aria-labelledby", "thanks-title");
      e.innerHTML = '<div class="thanks__scrim" data-thanks-close aria-hidden="true"></div><div class="thanks__card"><div class="thanks__body"><h2 class="thanks__title" id="thanks-title">' + esc(info.title || T.thanksTitle) + '</h2><p class="thanks__text">' + esc(info.text || T.thanksText) + '</p>'
        + (list.length ? '<ul class="thanks__list">' + list.map((li) => '<li>' + esc(li) + '</li>').join("") + '</ul>' : "")
        + '<p class="thanks__note">' + esc(info.note || T.thanksNote) + '</p><h4 class="thanks__more"><button type="button" data-thanks-close>' + esc(T.thanksMore) + ' <img src="' + cfg.arrow + '" alt="" width="17" height="15"></button></h4></div></div>';
      e.addEventListener("click", (ev) => { if (ev.target.closest("[data-thanks-close]")) { ev.preventDefault(); this.close(); } });
      body.appendChild(e); this.el = e; void e.offsetWidth;
      document.activeElement?.blur?.(); e.classList.add("is-open"); e.setAttribute("aria-hidden", "false"); Smooth.hold("thanks", true);
      const focusClose = () => $("button", e)?.focus({ preventScroll: true }); requestAnimationFrame(focusClose); setTimeout(focusClose, 160); // BYGG: focus lands once the card is visible (Safari ignores it while visibility is still hidden)
    },
    close() { const e = this.el; if (!e?.classList.contains("is-open")) return; e.classList.remove("is-open"); e.setAttribute("aria-hidden", "true"); Smooth.hold("thanks", false); this.t = setTimeout(() => { e.remove(); if (this.el === e) this.el = null; }, 800); },
    drop() { clearTimeout(this.t); this.el?.remove(); this.el = null; Smooth.hold("thanks", false); },
  };
  addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (Thanks.el?.classList.contains("is-open")) Thanks.close(); else if (Panel.el?.classList.contains("is-open")) Panel.close(); });

  const Contact = {
    mount(root) {
      const signal = Scope.signal;
      const dk = $(".dock", root); if (dk && matchMedia("(max-width: 1024px)").matches) { $(".shell").appendChild(dk); Dock.use(dk); } // BYGG: where the desk page scrolls its dock stays put like About's (C24)
      this.copy(root, signal); this.tabs(root, signal); this.countries(root, signal); this.forms(root, signal); this.prefill(root);
      if ($("[data-policy]", root)) Panel.build();
      $$("[data-policy]", root).forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); Panel.open(); }, { signal }));
      Scope.run(() => Category.reveals(root)); // 404: the numeral and message are plain paragraphs (scroll line reveal)
    },
    async write(text) { // clipboard, textarea fallback (mS() A:13029)
      try { await navigator.clipboard.writeText(text); return true; } catch {}
      const t = document.createElement("textarea"); t.value = text; t.readOnly = true; t.style.cssText = "position:fixed;left:-9999px"; body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch {} t.remove(); return ok;
    },
    copy(root, signal) {
      $$("[data-copy]", root).forEach((b) => { let t = null;
        b.addEventListener("click", async () => { if (b.classList.contains("is-copied") || !(await this.write(b.dataset.copy))) return; clearTimeout(t); b.classList.add("is-copied"); t = setTimeout(() => b.classList.remove("is-copied"), 1000); }, { signal }); });
    },
    tabs(root, signal) {
      const bar = $(".enquiry__tabs", root); if (!bar) return;
      const tabs = $$("[data-tab]", bar), forms = { investors: $("#enquiry-investors", root), partners: $("#enquiry-partners", root) }, panels = $(".enquiry__panels", root), R = V.rows;
      let cur = "investors", tl = null, gen = 0;
      const rows = (f) => [...f.children];
      const hold = () => { // panels keep the taller form's height (pS() A:12900)
        const h = Math.max(0, ...Object.values(forms).map((f) => { const was = f.hidden, css = f.style.cssText; f.hidden = false; f.style.position = "absolute"; f.style.visibility = "hidden"; f.style.pointerEvents = "none"; const v = f.getBoundingClientRect().height; f.style.cssText = css; f.hidden = was; return v; }));
        if (h) panels.style.minHeight = Math.ceil(h) + "px";
      };
      const mark = (k) => tabs.forEach((t) => { const on = t.dataset.tab === k; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      const clean = (f) => { gsap.killTweensOf([f, ...rows(f)]); gsap.set([f, ...rows(f)], { clearProps: "opacity,visibility,transform" }); };
      const show = (k) => {
        if (!forms[k] || k === cur) return;
        const from = forms[cur], to = forms[k], g = ++gen; const err = $(".enquiry__error", root); if (err) err.hidden = true;
        tl?.kill(); tl = null; cur = k; mark(k); hold();
        if (reduced()) { clean(from); from.hidden = true; from.inert = true; from.classList.remove("is-active", "is-leaving"); to.hidden = false; to.inert = false; to.classList.add("is-active"); hold(); return; }
        clean(to); from.classList.remove("is-active"); from.classList.add("is-leaving"); from.inert = true;
        to.hidden = false; to.inert = false; to.classList.add("is-active"); to.classList.remove("is-leaving");
        gsap.set(from, { autoAlpha: 1 }); gsap.set(to, { autoAlpha: 0 }); gsap.set(rows(to), R.from);
        tl = gsap.timeline({ onComplete: () => { if (g !== gen) return; from.hidden = true; from.classList.remove("is-leaving"); clean(from); gsap.set(to, { clearProps: "opacity,visibility" }); hold(); tl = null; } })
          .to(rows(from), { opacity: 0, y: -18, duration: 0.22, ease: "power2.in", stagger: 0.02 }, 0)
          .to(from, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0)
          .set(to, { autoAlpha: 1 })
          .fromTo(rows(to), R.from, { ...R.to, duration: R.dur, ease: R.ease, stagger: R.stagger, clearProps: "transform" }, "-=0.05");
      };
      bar.addEventListener("click", (e) => { const t = e.target.closest("[data-tab]"); if (t) show(t.dataset.tab); }, { signal });
      bar.addEventListener("keydown", (e) => {
        const i = tabs.findIndex((t) => t.classList.contains("is-active")); let j;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") j = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; else if (e.key === "Home") j = 0; else if (e.key === "End") j = tabs.length - 1; else return;
        e.preventDefault(); show(tabs[j].dataset.tab); tabs[j].focus();
      }, { signal });
      hold(); requestAnimationFrame(() => requestAnimationFrame(hold)); addEventListener("resize", hold, { signal });
    },
    countries(root, signal) { // ISO list minus the exclusions, named by Intl.DisplayNames in the page language (Yv()/Oc() A:10305-10521)
      const sels = $$("select[data-countries]", root); if (!sels.length) return;
      const d = cfg.countries, skip = new Set(d.excluded);
      let names = null; try { names = new Intl.DisplayNames([cfg.lang], { type: "region" }); } catch {}
      const list = d.codes.filter((c) => !skip.has(c)).map((c) => ({ c, n: (names && names.of(c)) || c }));
      list.sort((a, b) => (a.c === d.first ? -1 : b.c === d.first ? 1 : a.n.localeCompare(b.n, cfg.lang))); // BYGG: the home market first
      sels.forEach((s) => {
        const v = s.value; list.forEach(({ c, n }) => { const o = new Option(n, n); o.dataset.code = c; s.add(o); }); s.value = v;
        const tel = s.closest(".field-row")?.querySelector('input[type="tel"]'); if (!tel) return;
        Phone.guard(tel, signal); s.addEventListener("change", () => { if (s.value) Phone.set(tel, s.selectedOptions[0]?.dataset.code, d); }, { signal });
      });
    },
    prefill(root) { // BYGG: project and size band chosen on a collection page
      const pf = Flow.prefill; Flow.prefill = null; if (!pf) return;
      const f = $("#enquiry-investors", root); if (!f) return;
      if (pf.tab) $('[data-tab="' + pf.tab + '"]', root)?.click(); // BYGG: the home page's rental link opens the commercial tab
      Object.entries(pf).forEach(([k, v]) => { if (k === "tab") return; const el = $('[name="' + k + '"]', f); if (el) el.value = v; });
    },
    forms(root, signal) {
      $$(".enquiry__form", root).forEach((f) => f.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!f.checkValidity()) { f.reportValidity(); return; }
        const err = $(".enquiry__error", root); if (err) err.hidden = true;
        const btn = $("[type=submit]", f), label = $("span", btn), text = label.textContent; btn.disabled = true; label.textContent = T.sending;
        setTimeout(() => { // local only: the preview never sends anything (the reference POSTs to formsubmit.co, M13)
          btn.disabled = false; label.textContent = text; if (!f.isConnected) return;
          const info = cfg.flow(f);
          f.reset(); $$('input[type="tel"]', f).forEach((t) => { delete t.dataset.dial; t.placeholder = T.phonePh; t.setCustomValidity(""); });
          Thanks.open(info);
        }, 700);
      }, { signal }));
    },
  };

  /* ── page lifecycle ─────────────────────────────────────────── */
  const Page = {
    mount(root) {
      Scope.open(root); Smooth.page(); Continue.reset(); Router.current = Router.path(location.href);
      Dock.use($(".dock", root) || $(".shell > .dock"));
      Drawer.colours(); // the menu takes the page's colours at init (Vi() A:9558)
      if (root.dataset.view === "category") Category.mount(root);
      else if (root.dataset.view === "about") About.mount(root);
      else if (root.dataset.view === "home") Home.mount(root);
      else if (root.dataset.view === "contact" || root.dataset.view === "404") Contact.mount(root);
      ScrollTrigger.refresh();
    },
  };

  /* ── SPA router + transitions (M10) ──────────────────────────── */
  // BYGG: routes come from the config; a route key is the path below the language base ("/", "/asvellir", ...)
  const ROUTES = Object.fromEntries(cfg.routes.map((r) => [r.key, r.view]));
  const BUILT = new Set(cfg.routes.map((r) => r.key));
  const hrefOf = (key) => cfg.base + (key === "/" ? "/" : key + "/");
  const Router = {
    busy: false, cache: new Map(), current: null, pos: new Map(), restore: null, // BYGG: pos remembers each route's scroll for Back
    path(href) {
      try { const u = new URL(href, location.href); if (u.origin !== location.origin) return null;
        if (u.pathname !== cfg.base && !u.pathname.startsWith(cfg.base + "/")) return null;
        const rest = u.pathname.slice(cfg.base.length).replace(/\/+$/, "") || "/"; return rest in ROUTES ? rest : null; } catch { return null; }
    },
    load(p) {
      if (!this.cache.has(p)) {
        const r = cfg.render(p), doc = new DOMParser().parseFromString(r.html, "text/html"), page = doc.querySelector(".page");
        this.cache.set(p, Promise.resolve({ path: p, title: r.title, description: r.description, theme: r.theme, page, view: r.view, category: r.category || "", heroes: r.heroes }));
      }
      return this.cache.get(p);
    },
    prefetch(href) { if (dead) return; const p = this.path(href); if (!p || !BUILT.has(p)) return; this.load(p).then((d) => d.heroes.forEach((src) => { const i = new Image(); i.decoding = "async"; i.src = src; })).catch(() => {}); },
    stage(d) { const el = document.importNode(d.page, true); el.classList.add("is-incoming"); return el; },
    layer(cls) { const e = document.createElement("div"); e.className = cls; e.setAttribute("aria-hidden", "true"); return e; },
    run(fn, ease = easeStd) { return new Promise((done) => { const tl = gsap.timeline({ defaults: { ease }, onComplete: done }); fn(tl); }); },
    fixed(el, { top = true, h = innerHeight } = {}) { gsap.set(el, { position: "fixed", left: 0, right: 0, width: "100%", top: top ? 0 : "auto", bottom: top ? "auto" : 0, height: h, minHeight: h, maxHeight: h, overflow: "clip" }); },
    leave(out) { // the leaving page keeps its look; its triggers and listeners stop
      Scope.close(); Continue.reset(true); Cursor.hide(); Panel.drop(); Thanks.drop(); Inner.reset(); Smooth.hold("route", true);
      const dock = $(".shell > .dock"); if (dock && out) out.appendChild(dock); // actions travel with their page (A:1845)
    },
    freeze(out) { const y = Scroll.y(), main = out.firstElementChild; this.fixed(out); if (main && y) gsap.set(main, { y: -y }); },
    intro(inc, opts) { Intro.prepare(inc); return Intro.play(inc, { dock: false, deferText: inc.dataset.view === "home", ...opts }); }, // C28: home's lines wait for the commit
    reveal(d) { if (!d) return; gsap.set($("svg", d), { scale: 1 }); gsap.fromTo(d, { autoAlpha: 0, yPercent: V.dockHide.y, scale: 1 }, { autoAlpha: 1, yPercent: 0, pointerEvents: "auto", duration: V.dockHide.dur, ease: V.dockHide.ease }); }, // shows after the commit (sl() A:1753)
    commit(inc, d, out) {
      out?.remove(); $$(".route-backdrop, .route-separator, .route-flight").forEach((e) => e.remove());
      inc.classList.remove("is-incoming"); gsap.set(inc, { clearProps: "all" });
      body.dataset.page = d.view; if (d.category) body.dataset.category = d.category; else delete body.dataset.category;
      body.classList.remove("past-hero", "is-routing", "is-sliding", "is-swapping", "is-nexting"); document.title = d.title; cfg.onCommit?.(d);
      Dock.use($(".dock", inc)); Page.mount(inc);
      // BYGG: iOS Safari kept the old page's scroll offset across the swap (a card link opened the project 1100 px down). Commit the intended position after layout settles.
      const y = this.restore ?? 0; this.restore = null;
      const settle = () => { if (Smooth.on) Scroll.to(y, true); else { scrollTo(0, y); if (document.scrollingElement) document.scrollingElement.scrollTop = y; } };
      settle(); requestAnimationFrame(() => { settle(); requestAnimationFrame(() => { ScrollTrigger.refresh(); settle(); }); });
      if (Intro.pending) requestAnimationFrame(() => Intro.pending?.()); // deferred home lines start one frame after the commit (Sw() A:7533)
    },
    async go(href, kind = "auto", from = null, { replace = false, history: push = true } = {}) {
      const p = this.path(href); if (!p) { location.assign(href); return; }
      if (push) this.restore = null;
      if (this.busy) return;
      const here = this.current ?? this.path(location.href);
      if (p === here && kind !== "logo") { if (Picker.open && !Picker.busy) Picker.hide(); return; }
      if (!BUILT.has(p)) { if (Picker.open && !Picker.busy) Picker.hide(() => location.assign(href)); else location.assign(href); return; }
      if (Drawer.isOpen) { Drawer.close(() => this.go(href, kind, from, { replace, history: push })); return; }
      if (Picker.open) { if (Picker.busy && !Picker.tl?.isActive?.()) return; kind = "swap"; }
      if (kind === "auto") kind = ROUTES[p] === "category" ? "cut" : "slide";
      if (kind === "logo") kind = "slide";
      if (reduced()) kind = "cut";
      this.pos.set(here, Scroll.y());
      this.busy = true;
      try {
        const d = await this.load(p);
        if (push) history[replace || p === here ? "replaceState" : "pushState"]({ ...(history.state || {}), path: p }, "", hrefOf(p));
        await this[kind](d, from);
      } catch (e) { location.assign(href); return; }
      finally { this.busy = false; body.classList.remove("is-routing", "is-sliding", "is-swapping", "is-nexting"); }
    },
    async cut(d) { // plain swap, the new page plays its intro (A:8608-8617)
      const out = $(".page"); if (Picker.open) { await new Promise((r) => Picker.hide(r)); }
      this.leave(out); const inc = this.stage(d); inc.classList.remove("is-incoming"); out.replaceWith(inc);
      this.commit(inc, d, null); this.intro(inc);
    },
    async slide(d) { // A · home-logo (M10)
      const R = V.route.slide, ease = bezier(...R.bezier), out = $(".page"), shell = $(".shell"), vh = innerHeight;
      this.leave(out); this.freeze(out); out.classList.add("is-outgoing"); body.classList.remove("past-hero"); body.classList.add("is-routing", "is-sliding");
      const back = this.layer("route-backdrop"), sep = this.layer("route-separator"), inc = this.stage(d);
      shell.insertBefore(back, out); out.after(sep); shell.appendChild(inc);
      const about = d.view === "about";
      this.fixed(inc, { top: about }); gsap.set(inc, { transformOrigin: about ? "50% 0%" : "50% 100%", scale: 1, y: (vh * R.inY) / 100, clipPath: R.clip0 });
      gsap.set(out, { transformOrigin: "50% 50%", scale: 1, y: 0 });
      this.intro(inc);
      await this.run((tl) => {
        tl.to(back, { opacity: 1, duration: R.dur }, 0).to(sep, { opacity: R.sep, duration: R.dur }, 0)
          .to(out, { scale: 1, y: (vh * R.outY) / 100, duration: R.dur }, 0).to(inc, { scale: 1, y: 0, clipPath: R.clip1, duration: R.dur }, 0);
      }, ease);
      this.commit(inc, d, out); this.reveal(Dock.el());
    },
    async swap(d) { // B · selection swap (M10)
      const S = V.route.swap, out = $(".page"), shell = $(".shell"), vh = innerHeight;
      Picker.tl?.progress(1); Picker.tl?.kill();
      const sc = Number(gsap.getProperty(out, "scale")) || 1, y0 = Number(gsap.getProperty(out, "y")) || 0, inY = y0 + (vh * S.inBelow) / 100, outY = y0 + (vh * S.outBelow) / 100;
      this.leave(out); out.classList.add("is-outgoing"); body.classList.add("is-routing", "is-swapping");
      const inc = this.stage(d), sep = this.layer("route-separator route-separator--swap");
      out.after(sep); shell.appendChild(inc);
      this.fixed(inc, { top: false }); gsap.set(inc, { transformOrigin: "50% 100%", scale: sc, y: inY, autoAlpha: 1 });
      gsap.set(sep, { transformOrigin: "50% 100%", scale: sc, y: inY, opacity: 0 });
      this.intro(inc);
      await this.run((tl) => { tl.to(inc, { y: y0, duration: S.enter }, 0).to(sep, { y: y0, opacity: S.sep, duration: S.enter }, 0); });
      const tiles = Picker.tiles();
      await this.run((tl) => { Picker.closeInto(tl, tiles); tl.to(inc, { scale: 1, y: 0, duration: V.picker.total }, 0).to(out, { y: outY, autoAlpha: 0, duration: S.fade }, 0).to(sep, { y: outY, opacity: 0, duration: S.fade }, 0); });
      Picker.finish(tiles, false);
      this.commit(inc, d, out); this.reveal(Dock.el());
    },
    async next(d, block) { // C · category-next (M10)
      const N = V.route.next, ease = bezier(...N.bezier), out = $(".page"), shell = $(".shell");
      block = block || $(".next", out); if (!block) return this.cut(d);
      const zoom = $(".next__zoom", block), drift = $(".next__drift", block), shade = $(".next__shade", block), texts = [".next__pill", ".next__title", ".next__text"].map((q) => $(q, block)).filter(Boolean);
      const z0 = Number(gsap.getProperty(zoom, "scaleX")) || 1, ds = Number(gsap.getProperty(drift, "scaleX")) || 1, dy = Number(gsap.getProperty(drift, "yPercent")) || 0;
      this.leave(out); Scroll.lock(true);
      const r = block.getBoundingClientRect(), spacer = document.createElement("div"); spacer.style.height = r.height + "px"; block.before(spacer);
      texts.forEach((t) => { Lines.settle(t); gsap.set($$(".line", t), { clearProps: "transform,clipPath" }); });
      gsap.set(zoom, { scale: z0 }); gsap.set(drift, { scale: ds, yPercent: dy });
      gsap.set(block, { position: "fixed", top: r.top, left: r.left, width: r.width, height: r.height, minHeight: r.height, maxHeight: r.height, margin: 0, zIndex: 100, overflow: "hidden" });
      gsap.set(texts, { clipPath: "inset(-45% 0% -35% 0%)", yPercent: 0, opacity: 1 });
      block.classList.add("is-leaving"); body.appendChild(block);
      this.freeze(out); body.classList.add("is-routing", "is-nexting");
      if (z0 !== 1 || dy !== 0) await this.run((tl) => { if (z0 !== 1) tl.to(zoom, { scale: 1, duration: N.reset, ease: "power2.out" }, 0); if (dy !== 0) tl.to(drift, { yPercent: 0, duration: N.reset, ease: "power2.out" }, 0); });
      const W = innerWidth, H = innerHeight;
      await this.run((tl) => {
        tl.to(block, { top: 0, left: 0, width: W, height: H, minHeight: H, maxHeight: H, duration: N.expand, ease }, 0);
        tl.to(texts, { yPercent: -120, clipPath: "inset(0% 0% 100% 0%)", opacity: 0, duration: N.text, ease: "power2.in", stagger: N.stagger }, N.textAt);
        if (shade) tl.to(shade, { opacity: 0, duration: N.shade, ease: "power2.out" }, N.shadeAt);
      });
      // the next page mounts underneath, its hero waiting for the image
      const inc = this.stage(d), back = this.layer("route-backdrop route-backdrop--next");
      if (d.category) back.dataset.category = d.category;
      shell.prepend(back); gsap.set(out, { autoAlpha: 0 });
      gsap.set(inc, { position: "fixed", top: 0, left: 0, right: 0, width: "100%", minHeight: "100svh", zIndex: 2 });
      shell.appendChild(inc);
      Intro.prepare(inc); const photo = $(".hero__photo", inc); gsap.set(photo, { autoAlpha: 0, clipPath: "none" });
      $$("img[loading='lazy']", inc).forEach((i) => { i.loading = "eager"; });
      const pending = $$(".hero__photo img", inc).filter((i) => !i.complete).map((i) => new Promise((ok) => { i.addEventListener("load", ok, { once: true }); i.addEventListener("error", ok, { once: true }); }));
      await Promise.race([Promise.all(pending), new Promise((ok) => setTimeout(ok, 2500))]);
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      gsap.set(block, { top: 0, left: 0, width: innerWidth, height: innerHeight, minHeight: innerHeight, maxHeight: innerHeight });
      const zr = zoom.getBoundingClientRect(), flight = this.layer("route-flight"), media = drift.cloneNode(true);
      flight.appendChild(media); body.appendChild(flight);
      gsap.set(flight, { top: zr.top, left: zr.left, width: zr.width, height: zr.height });
      const fs = Number(gsap.getProperty(drift, "scaleX")) || 1, fy = Number(gsap.getProperty(drift, "yPercent")) || 0;
      gsap.set(media, { transformOrigin: "center center", scale: fs, yPercent: fy, force3D: true });
      await new Promise((ok) => requestAnimationFrame(ok));
      gsap.set(block, { autoAlpha: 0, pointerEvents: "none" });
      const t = photo.getBoundingClientRect();
      await this.run((tl) => { tl.to(flight, { top: t.top, left: t.left, width: t.width, height: t.height, duration: N.fly, ease }, 0); if (fs !== 1 || fy !== 0) tl.to(media, { scale: 1, yPercent: 0, duration: N.fly, ease }, 0); });
      gsap.set(photo, { autoAlpha: 1, clipPath: "none" }); spacer.remove(); block.remove();
      this.commit(inc, d, out); Scroll.lock(false);
      Intro.play(inc, { skipPhoto: true, content: N.content }); // hero intro after the flight (A:8203-8233)
    },
    bind() {
      docOn("click", (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const a = e.target.closest("a[href]"); if (!a || a.target === "_blank" || a.closest(".picker, .drawer")) return;
        if (a.dataset.prefill) { try { Flow.prefill = JSON.parse(a.dataset.prefill); } catch {} }
        const href = a.getAttribute("href"); if (!href || href.startsWith("#") || /^(mailto|tel):/.test(href)) return;
        const p = this.path(href); if (!p) return;
        e.preventDefault();
        if (a.matches(".brand")) { if (Picker.open) { if (!Picker.busy) Picker.hide(); return; } this.go(href, "logo"); return; } // logo replays A even on home (A:6874)
        const next = a.closest(".next"); if (next && ROUTES[p] === "category") { this.go(href, "next", next); return; }
        this.go(href, "auto");
      });
      const warm = (e) => { const a = e.target.closest?.("a[href]"); if (a) this.prefetch(a.getAttribute("href")); };
      ["pointerover", "focusin", "pointerdown"].forEach((t) => docOn(t, warm, { passive: true }));
      addEventListener("popstate", () => { const to = this.path(location.href); if (!to) return; this.restore = this.pos.get(to) ?? 0; this.go(location.href, "slide", null, { history: false }); }); // BYGG: a step out of the preview belongs to the app router
      const c = navigator.connection; if (!c?.saveData && (!c?.effectiveType || c.effectiveType === "4g")) (window.requestIdleCallback || ((f) => setTimeout(f, 2000)))(() => BUILT.forEach((p) => this.prefetch(hrefOf(p)))); // idle prefetch (M10)
    },
  };

  /* ── boot ──────────────────────────────────────────────────── */
  function boot() {
    Smooth.init(); Picker.bind(); Drawer.bind(); Router.bind(); Continue.bind(); Scrollbar.mount();
    // BYGG: on phones the dock slides away while scrolling down and comes back on scroll up, so it never sits over what is being read
    let lastY = scrollY;
    addEventListener("scroll", () => { if (!mobile() || Picker.open || Drawer.isOpen || Router.busy) { lastY = scrollY; return; } const y = scrollY, d = y - lastY; if (Math.abs(d) < 12) return; lastY = y; Dock.hide("scroll", d > 0 && y > 120); }, { passive: true });
    let rt = null;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => Ticker.rebuild(), 150); });
    const root = $(".page");
    const fonts = Promise.all([document.fonts?.ready, document.fonts?.load?.(cfg.fontProbe)].map((p) => Promise.resolve(p).catch(() => {})));
    fonts.then(() => {
      if (dead) return;
      Page.mount(root); // lines split after the fonts are in
      if (reduced()) { body.classList.add("is-ready"); $$(HERO_TICKER).forEach((t) => Ticker.start(t)); Loader.skip(); return; }
      Intro.prepare(root);
      if (Loader.active()) {
        Loader.prepare();
        const imgs = $$(".loader__frame img").map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
        Promise.race([Promise.all(imgs), new Promise((r) => setTimeout(r, V.loader.timeoutMs))]).then(() => Loader.run(() => Intro.play(root, { skipPhoto: true })));
      } else { Loader.skip(); Intro.play(root); }
    });
  }
  /* ── teardown ── */
  let dead = false
  function destroy() {
    if (dead) return; dead = true
    KILL.abort()
    Frame.stop()
    try { Scope.close() } catch {}
    try { ScrollTrigger.getAll().forEach((s) => s.kill()) } catch {}
    try { ScrollTrigger.removeEventListener('refresh', refreshHook) } catch {}
    try { gsap.globalTimeline.clear() } catch {}
    Panel.drop(); Thanks.drop(); Inner.reset()
    extra.forEach((n) => n.remove()); $$('.route-backdrop, .route-separator, .route-flight').forEach((e) => e.remove())
    const d = document.documentElement
    ;['is-cold', 'count-ready'].forEach((c) => d.classList.remove(c))
    ;['--vw1', '--vh1'].forEach((p) => d.style.removeProperty(p))
    d.style.scrollBehavior = ''
    const cls = [...body.classList].filter((c) => /^(is-|drawer-open|loader-exit|past-hero|category-)/.test(c) || c === 'is-ready')
    cls.forEach((c) => body.classList.remove(c))
    body.style.height = ''
    delete body.dataset.page; delete body.dataset.category
    history.scrollRestoration = prevScrollRestoration
  }
  boot()
  return destroy
}
