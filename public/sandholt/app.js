/* ══════════════════════════════════════════════════════════════
   SANDHOLT — motion engine + live clock.

   Signature: the page runs on the bakery's own clock. Their printed
   menu is already gated by time ("Frá kl. 07:30", "frá kl 12"), so
   that axis drives the hero photograph, the status line, the pinned
   day chapter and the menu pills. One state object, one source.

   Perf contract (ledger #59/#113): the scroll loop READS every rect
   into an array first, then WRITES every transform. Interleaving them
   forces a synchronous layout per tracked node, per frame.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ═══ 1 · CLOCK ═══════════════════════════════════════════ */
  var OPEN = 450, CLOSE = 1080;
  var PHASES = [
    { id:'nott',    from:240,  to:450,  img:'img/s-22.avif',   pos:'center 42%',
      alt:'Kanilsnúðar nýkomnir úr ofninum',
      cap:'Fyrsti ofninn, löngu fyrir opnun', now:'Bakað núna' },
    { id:'morgunn', from:450,  to:720,  img:'img/hero-b.avif', pos:'center 52%',
      alt:'Nýbakaðar kringlur á bökunarplötu',
      cap:'Kringlur, nýkomnar úr ofninum',    now:'Morgunmatur til 12:00' },
    { id:'hadegi',  from:720,  to:900,  img:'img/s-497.jpg',   pos:'center 58%',
      alt:'Bakaðir bitar á tréfjöl',
      cap:'Hádegisseðillinn er kominn',       now:'Hádegisseðill í boði' },
    { id:'siddegi', from:900,  to:1080, img:'img/s-390.jpg',   pos:'center 46%',
      alt:'Gestur með kaffi inni í Sandholti',
      cap:'Síðdegi á Laugavegi 36',           now:'Kaffi og kaka til 18:00' },
    { id:'lokad',   from:1080, to:240,  img:'img/s-0753.avif', pos:'center 30%',
      alt:'Súrdeigsbrauð með dökkri skorpu',
      cap:'Súrdeigið hvílir til morguns',     now:'Opnum kl. 07:30' }
  ];
  var GATES = { morgunn:450, alltaf:450, hadegi:720 };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* Bakery time, not visitor time — a guest in New York sees Reykjavík. */
  function readClock() {
    var h, m;
    try {
      var p = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Atlantic/Reykjavik', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      h = +p.find(function (x) { return x.type === 'hour'; }).value;
      m = +p.find(function (x) { return x.type === 'minute'; }).value;
    } catch (e) {
      var d = new Date(); h = d.getUTCHours(); m = d.getUTCMinutes(); // Iceland is UTC+0 all year
    }
    var mins = (h % 24) * 60 + m, phase = PHASES[PHASES.length - 1];
    for (var i = 0; i < PHASES.length; i++) {
      var q = PHASES[i];
      if (q.from < q.to ? (mins >= q.from && mins < q.to) : (mins >= q.from || mins < q.to)) { phase = q; break; }
    }
    return { mins: mins, phase: phase, open: mins >= OPEN && mins < CLOSE, label: pad(h) + ':' + pad(m) };
  }

  var els = {
    hstate: $('#hstate'), state: $('[data-state]'), now: $('[data-now]'),
    state2: $('[data-state2]'), sub2: $('[data-sub2]'), clock2: $('[data-clock2]'), shell: $('#shell')
  };

  function render(s) {
    if (els.hstate) els.hstate.classList.toggle('is-closed', !s.open);
    if (els.state) els.state.textContent = s.open ? 'Opið' : 'Lokað';
    if (els.now) els.now.textContent = s.open ? 'til 18:00' : 'opnum 07:30';
    if (els.shell) els.shell.classList.toggle('is-closed', !s.open);
    if (els.state2) els.state2.textContent = s.open ? 'Opið' : 'Lokað';
    if (els.sub2) els.sub2.textContent = s.open ? 'Við lokum kl. 18:00' : 'Við opnum kl. 07:30';
    if (els.clock2) els.clock2.textContent = s.label;

    $$('.day__panel').forEach(function (li) {
      li.classList.toggle('is-now', li.getAttribute('data-phase') === s.phase.id);
    });
    $$('.mgroup__h[data-gate]').forEach(function (g) {
      var start = GATES[g.getAttribute('data-gate')];
      g.classList.toggle('is-open', s.open && start != null && s.mins >= start);
    });
  }
  render(readClock());                                   // seed synchronously, never blank
  setInterval(function () { render(readClock()); }, 30000);

  /* ═══ 2 · WORD MASKS ══════════════════════════════════════
     Split on words only. Preserve <em>. The .22em headroom lives in
     CSS because Icelandic descenders (þ, g, ý) clip without it.      */
  function splitWords(el) {
    var out = [];
    (function walk(node, em) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w' + (em ? ' w--em' : '');
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
            w.appendChild(i); frag.appendChild(w); out.push(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n, em || n.tagName === 'EM');
      });
    })(el, false);
    return out;
  }

  var headings = [];
  if (!REDUCED) {
    $$('[data-words]').forEach(function (h) {
      var words = splitWords(h);
      var show = function () {
        words.forEach(function (w, i) {
          w.style.transitionDelay = (i * 55) + 'ms';
          w.classList.add('in');
        });
      };
      var rec = { el: h, show: show, done: false };
      headings.push(rec);
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting || rec.done) return;
          rec.done = true; show(); io.disconnect();
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
      io.observe(h);
    });
  } else {
    $$('[data-words]').forEach(function (h) { splitWords(h).forEach(function (w) { w.classList.add('in'); }); });
  }

  /* ═══ 3 · RISE REVEALS ════════════════════════════════════ */
  var rises = $$('[data-rise]');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    rises.forEach(function (t, i) {
      t.style.transitionDelay = (i % 4) * 80 + 'ms';
      rio.observe(t);
    });
    /* Safety net: a fast flick can outrun the observer. Content must never
       stay hidden.

       This used to run on every scroll frame and measure EVERY not-yet-shown
       element — 54 getBoundingClientRect calls a frame, every one of them a
       forced synchronous layout because it ran after the write phase. It is
       a backstop for a case the observer almost always handles, so it now
       runs at most 5x a second, prunes what it has revealed (so the cost
       falls to nothing as the page opens), and is driven from the read phase
       of the scroll loop where no writes have happened yet. */
    var pendRise = rises.slice(), pendHead = headings.slice(), sweptAt = -1e9;
    var sweep = window.__shSweep = function (force) {
      var now = Date.now();
      if (!force && now - sweptAt < 200) return;
      if (!pendRise.length && !pendHead.length) return;
      sweptAt = now;
      var vh = window.innerHeight;
      for (var i = pendRise.length - 1; i >= 0; i--) {
        var t = pendRise[i];
        if (t.classList.contains('in')) { pendRise.splice(i, 1); continue; }
        if (t.getBoundingClientRect().top < vh) { t.classList.add('in'); rio.unobserve(t); pendRise.splice(i, 1); }
      }
      // headings too — a stranded heading is worse than a stranded paragraph
      for (var j = pendHead.length - 1; j >= 0; j--) {
        var hd = pendHead[j];
        if (hd.done) { pendHead.splice(j, 1); continue; }
        if (hd.el.getBoundingClientRect().top < vh) { hd.done = true; hd.show(); pendHead.splice(j, 1); }
      }
    };
    // under reduced motion the scroll loop is not wired up, so drive it here
    if (REDUCED) {
      var sweeping = false;
      addEventListener('scroll', function () {
        if (!sweeping) { sweeping = true; requestAnimationFrame(function () { sweeping = false; sweep(); }); }
      }, { passive: true });
    }
    addEventListener('resize', function () { sweep(true); }, { passive: true });
  } else {
    rises.forEach(function (t) { t.classList.add('in'); });
  }

  var nav = $('#nav');

  /* ═══ 4 · SCROLL ENGINE ═══════════════════════════════════
     Frames drift inside fixed windows; the day chapter is pinned and
     scrubbed horizontally; the sourdough statement scrubs word opacity.
     ONE rAF loop. All reads batched before all writes.               */
  var frames = $$('.frame[data-drift]').map(function (f) {
    var drift = +f.getAttribute('data-drift') || 8;
    // derive the overhang from the drift — a fixed inset is silently
    // wrong at high drift and the image edge slides into frame
    f.style.setProperty('--dz', Math.max(9, drift * 1.35) + '%');
    return { el: f, inner: f.querySelector('.frame-in'), drift: drift };
  });

  var daySec = $('.day'), dayPin = $('.day__pin'), dayTrack = $('[data-track]'), dayRail = $('[data-rail]');
  var heroSec = $('.hero'), heroMedia = $('[data-heromedia]'), heroCenter = $('[data-herocenter]');
  var heroPin = $('.hero__pin'), heroFilm = $('[data-herofilm]');
  var heroWho = $('.hero__who'), heroState = $('#hstate');
  var barT = $('[data-bart]'), barB = $('[data-barb]');
  var wm = $('#wm'), wmSlot = $('[data-wmslot]'), wmHead = $('[data-wmhead]');
  var yearEl = $('[data-year]'), yearDigits = yearEl ? $$('span', yearEl) : [];
  var footEl = $('#foot'), footIn = $('[data-footin]'), footSpacer = $('[data-footspacer]');
  var scrubEl = $('[data-scrub]'), scrubWords = [], scrubHigh = 0;
  if (scrubEl) {
    var txt = scrubEl.textContent;
    scrubEl.textContent = '';
    txt.split(/(\s+)/).forEach(function (p) {
      if (!p) return;
      if (/^\s+$/.test(p)) { scrubEl.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span'); s.className = 'sw'; s.textContent = p;
      scrubEl.appendChild(s); scrubWords.push(s);
    });
  }

  /* Cache the digit weights once. getComputedStyle() inside the write phase
     flushed style for every digit, every frame, everywhere on the page. */
  var yearK = yearDigits.map(function (d) {
    return parseFloat(getComputedStyle(d).getPropertyValue('--k')) || 1;
  });

  /* ── GEOMETRY CACHE ──────────────────────────────────────────
     The wordmark flight needs two rects: its hero rest slot and its
     header target. Both are constant — the slot sits in a sticky pin at
     top:0, the target in a fixed header — so reading them per frame only
     bought two forced synchronous layouts per frame, inside the write
     phase, which is exactly what the perf contract above forbids.
     Measure once, and again only on a real resize.                     */
  var wmGeo = null, heroTravel = 1, dayTravel = 1;
  function sizeHero() {
    if (heroSec) heroTravel = Math.max(1, heroSec.offsetHeight - window.innerHeight);
    if (daySec) dayTravel = Math.max(1, daySec.offsetHeight - window.innerHeight);
    if (!wm || !wmSlot || !wmHead || !heroPin) return;
    // subtract the pin's own offset so this is correct even when measured
    // from a scroll position where the hero has already unstuck
    var pin = heroPin.getBoundingClientRect();
    var a = wmSlot.getBoundingClientRect();
    var b = wmHead.getBoundingClientRect();
    wmGeo = { aw: a.width, at: a.top - pin.top, bw: b.width, bt: b.top };
    // width is fixed for the whole flight — writing it per frame relaid out
    // and re-rasterised the wordmark (and its drop-shadow) every frame
    wm.style.setProperty('--wmw', a.width + 'px');
  }

  /* Only touch the DOM when a value actually changed. Custom properties are
     cheap to write and expensive to write 60 times a second for nothing. */
  var last = {};
  function setVar(el, name, v) {
    var key = name + (el.id || el.className);
    if (last[key] === v) return;
    last[key] = v; el.style.setProperty(name, v);
  }

  /* The pinned chapter needs the section tall enough to scrub the whole
     track past the viewport. Set it from the real track width. */
  function sizeFoot() {
    if (!footEl || !footSpacer) return;
    var h = footEl.offsetHeight;
    document.documentElement.style.setProperty('--footh', h + 'px');
  }

  function sizeDay() {
    if (!daySec || !dayTrack) return 0;
    var over = dayTrack.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(dayTrack).paddingLeft || 0);
    over = Math.max(0, over);
    daySec.style.height = (window.innerHeight + over) + 'px';
    return over;
  }
  var dayOver = 0;
  /* Lenis-style damping: scroll sets a TARGET, a persistent rAF eases the
     track toward it, so the horizontal move keeps gliding after the wheel
     stops instead of being welded 1:1 to scroll position. */
  var dayTargetX = 0, dayCurX = 0, dayRafId = null, dayLive = false;
  var DAMP = 0.085, EPS = 0.06;

  function dayTick() {
    var d = dayTargetX - dayCurX;
    if (Math.abs(d) > EPS) dayCurX += d * DAMP; else dayCurX = dayTargetX;
    if (dayTrack) dayTrack.style.transform = 'translate3d(' + (-dayCurX).toFixed(2) + 'px,0,0)';
    if (dayRail && dayOver > 0) dayRail.style.setProperty('--p', (dayCurX / dayOver * 100).toFixed(2) + '%');
    if (Math.abs(dayTargetX - dayCurX) > EPS || dayLive) {
      dayRafId = requestAnimationFrame(dayTick);
    } else { dayRafId = null; }
  }
  function kickDay() { if (dayRafId === null) dayRafId = requestAnimationFrame(dayTick); }

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;

    /* ---- READ PHASE: every rect first, zero writes ---- */
    // the reveal backstop reads geometry too, so it belongs here, before any
    // write — out here it was 54 forced layouts a frame
    if (window.__shSweep) window.__shSweep(false);

    var reads = [];
    for (var i = 0; i < frames.length; i++) {
      var r = frames[i].el.getBoundingClientRect();
      if (r.bottom > -200 && r.top < vh + 200) reads.push({ i: i, top: r.top, h: r.height });
    }
    var dayR = daySec ? daySec.getBoundingClientRect() : null;
    var scrubR = scrubEl ? scrubEl.getBoundingClientRect() : null;
    var heroR = heroSec ? heroSec.getBoundingClientRect() : null;
    var yearR = yearEl ? yearEl.getBoundingClientRect() : null;
    var spacerR = footSpacer ? footSpacer.getBoundingClientRect() : null;

    /* ---- WRITE PHASE ---- */
    for (var k = 0; k < reads.length; k++) {
      var d = reads[k], f = frames[d.i];
      // -1..+1 across the viewport
      var p = (d.top + d.h / 2 - vh / 2) / (vh / 2 + d.h / 2);
      f.inner.style.transform = 'translate3d(0,' + (-p * f.drift).toFixed(3) + '%,0)';
    }

    if (dayR && dayTrack) {
      var prog = clamp(-dayR.top / dayTravel, 0, 1);
      dayTargetX = prog * dayOver;
      // only spin the rAF while the chapter is anywhere near the viewport
      dayLive = dayR.bottom > -vh && dayR.top < vh * 2;
      kickDay();
    }

    /* hero closes into a slot; the wordmark flies into the header centre.
       Everything here is a transform or an opacity on a promoted layer —
       no geometry is read, so nothing forces a layout. */
    if (heroR && heroFilm && heroR.bottom > -vh && heroR.top < vh) {
      var hp = clamp(-heroR.top / heroTravel, 0, 1);
      var e = hp * hp;                                  // hold, then go
      var hs = 1 + e * 0.06;
      setVar(heroFilm, '--hs', hs.toFixed(4));
      if (barT && barB) {
        /* The bars replace a clip-path that used to sit on the SAME element as
           the scale. A clip applies in local space, before the transform, so
           the opening was scaled by --hs too. These bars cut in screen space,
           so the scale has to be folded in by hand or the letterbox edge lands
           ~9px off mid-flight (measured against the original, pixel for pixel). */
        var openHalf = (0.5 - e * 0.34) * vh * hs;
        var bar = (vh * 0.5 - openHalf).toFixed(1) + 'px';
        setVar(barT, '--hcpx', bar); setVar(barB, '--hcpx', bar);
      }
      // the who-text and corner state fade well before the wordmark lands.
      // written on the two leaf elements, never on .hero — a custom property
      // on the section restyles its whole subtree, video included.
      var ho = (1 - clamp(hp * 1.9, 0, 1)).toFixed(3);
      if (heroWho) setVar(heroWho, '--ho', ho);
      if (heroState) setVar(heroState, '--ho', ho);
      nav.classList.toggle('is-past', hp > 0.62);

      if (wm && wmGeo) {
        var t = e;                                // same easing as the film close
        setVar(wm, '--wms', (1 + (wmGeo.bw / Math.max(1, wmGeo.aw) - 1) * t).toFixed(4));
        setVar(wm, '--wmy', (wmGeo.at + (wmGeo.bt - wmGeo.at) * t).toFixed(1) + 'px');
        // cream over the film -> ink once it sits on the cream bar
        setVar(wm, '--wmc', (1 - clamp((hp - 0.55) / 0.3, 0, 1)).toFixed(3));
      }
    }

    /* 1920 — four digits, four generations, aligned only at centre */
    if (yearR && yearDigits.length && yearR.bottom > 0 && yearR.top < vh) {
      // clamp: off-screen the raw ratio runs far past 1 and the digits fly hundreds of px
      var yp = clamp((yearR.top + yearR.height / 2 - vh / 2) / (vh / 2 + yearR.height / 2), -1, 1);
      for (var d = 0; d < yearDigits.length; d++) {
        yearDigits[d].style.setProperty('--dy', (yp * yearK[d] * 46).toFixed(1) + 'px');
      }
    }

    /* footer is fixed behind the page; fade its content in as it is uncovered */
    if (spacerR && footIn && spacerR.top < vh) {
      var fp = clamp((vh - spacerR.top) / Math.max(1, spacerR.height * 0.85), 0, 1);
      setVar(footIn, '--fp', fp.toFixed(3));
    }

    if (scrubR && scrubWords.length) {
      // word i lights as the paragraph travels the middle band of the viewport
      var sp = clamp((vh * 0.82 - scrubR.top) / (vh * 0.52), 0, 1);
      var lit = Math.round(sp * scrubWords.length);
      if (lit > scrubHigh) {
        for (var w = scrubHigh; w < lit; w++) scrubWords[w].classList.add('on');
        scrubHigh = lit;   // high-water mark: never un-light what was read
      }
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function remeasure() { dayOver = sizeDay(); sizeFoot(); sizeHero(); onScroll(); }

  /* On a phone, the collapsing URL bar fires resize DURING the scroll. The
     old handler answered every one of those with sizeDay(), which reads
     scrollWidth and writes a section height — a full layout thrash mid-flick,
     which is why this felt far worse on mobile than on desktop. A width
     change is a real rotation or window drag and is handled at once; a
     height-only change is the URL bar, and waits for the scroll to settle. */
  var lastW = window.innerWidth, reT = null;
  function onResize() {
    if (window.innerWidth !== lastW) {
      lastW = window.innerWidth;
      clearTimeout(reT); reT = null;
      remeasure();
      return;
    }
    clearTimeout(reT);
    reT = setTimeout(function () { reT = null; remeasure(); }, 250);
  }

  if (!REDUCED) {
    dayOver = sizeDay(); sizeFoot(); sizeHero();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize, { passive: true });
    addEventListener('orientationchange', remeasure, { passive: true });
    frame();
  } else if (daySec) {
    // reduced motion: let the chapter be an ordinary horizontal scroller
    daySec.style.height = 'auto';
    if (dayPin) { dayPin.style.position = 'static'; dayPin.style.height = 'auto'; }
    if (dayTrack) { dayTrack.style.overflowX = 'auto'; dayTrack.style.paddingBottom = '20px'; }
    if (scrubWords.length) scrubWords.forEach(function (s) { s.classList.add('on'); });
  }

  /* ═══ 4b · HERO VIDEO ═══════════════════════════════════
     It must never need a click. Autoplay can still be refused (iOS Low
     Power Mode, Data Saver, a backgrounded tab on load), so keep asking:
     on visibility change, on the first user gesture of any kind, and
     whenever the element reports it stalled.                          */
  function startHeroVideo() {
    var v = $('[data-herovid]');
    if (!v || REDUCED || v.dataset.shWired === '1') return;
    v.dataset.shWired = '1';                                // wire once, call anywhere
    v.muted = true; v.defaultMuted = true; v.loop = true;   // properties, not just attributes
    v.playsInline = true;                                   // iOS: property, not just the attribute
    var tries = 0;
    var attempt = function () {
      if (!v.paused || tries > 60) return;
      tries++;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    attempt();
    ['loadeddata', 'canplay', 'stalled', 'suspend', 'pause'].forEach(function (ev) {
      v.addEventListener(ev, attempt);
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) attempt();
    });
    // any first gesture satisfies a browser that wanted one
    ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach(function (ev) {
      addEventListener(ev, attempt, { once: true, passive: true });
    });
    // last resort: a slow poll that gives up once it is running
    var iv = setInterval(function () {
      if (!v.paused || tries > 60) { clearInterval(iv); return; }
      attempt();
    }, 1000);
  }

  /* ═══ 5 · PRELOADER ═══════════════════════════════════════
     Counts the assets the FIRST SCREEN actually needs. Counting every
     <img> was the bug: 13 of the 15 carry loading="lazy" and cannot
     resolve while a full-screen overlay is up, so the number froze in
     the teens and the hard cap yanked the overlay away mid-count.
     1.1s floor (warm cache would otherwise flash), 2.6s hard cap, once
     per session, never under reduced motion. The bar always reaches
     100 before it leaves, cap or no cap.                             */
  var pre = $('#pre'), fill = $('[data-fill]'), pct = $('[data-pct]');
  var started = Date.now();

  function ready() {
    document.body.classList.add('is-ready');
    dayOver = sizeDay(); sizeFoot(); sizeHero();
    onScroll();
    startHeroVideo();
  }

  var preRaf = 0;
  function finish() {
    if (preRaf) cancelAnimationFrame(preRaf);
    if (pre) { pre.classList.add('is-done'); }
    ready();
  }

  if (!pre || REDUCED || sessionStorage.getItem('sh-seen') === '1') {
    if (pre) pre.remove();
    // let first paint settle so the entrance transitions actually run
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  } else {
    sessionStorage.setItem('sh-seen', '1');

    /* Get the film going behind the overlay. It is muted and inline, so it
       needs no gesture, and by the time the hero is uncovered it is already
       rolling instead of sitting on its poster under a play button. */
    startHeroVideo();

    /* Each job calls back once when its asset is genuinely usable. */
    var jobs = [];

    // the wordmark layers — in the DOM, eager, and the thing on screen
    $$('img').forEach(function (im) {
      if (im.closest('.pre') || im.loading === 'lazy') return;
      jobs.push(function (done) {
        if (im.complete) return done();
        im.addEventListener('load', done, { once: true });
        im.addEventListener('error', done, { once: true });
      });
    });

    // the hero still, which is what shows if the film cannot roll
    jobs.push(function (done) {
      var p = new Image();
      p.onload = p.onerror = done;
      p.src = 'img/hero-poster.jpg';
    });

    // the faces the wordmark and the hero line are set in
    jobs.push(function (done) {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(done, done);
      else done();
    });

    // the film itself, buffered far enough to actually play on reveal
    jobs.push(function (done) {
      var v = $('[data-herovid]');
      if (!v) return done();
      if (v.readyState >= 3) return done();
      ['canplay', 'loadeddata', 'error', 'stalled'].forEach(function (ev) {
        v.addEventListener(ev, done, { once: true });
      });
      if (v.networkState === 0) { try { v.load(); } catch (e) {} }
    });

    var total = Math.max(1, jobs.length), done = 0, capped = false, shown = 0;
    jobs.forEach(function (job) {
      var fired = false;
      job(function () { if (!fired) { fired = true; done++; } });
    });

    /* The number eases toward the real fraction rather than stepping, so a
       handful of coarse jobs still reads as motion. */
    (function tick() {
      var target = capped ? 100 : (done / total) * 100;
      shown += (target - shown) * (capped ? 0.3 : 0.12);
      if (target - shown < 0.4) shown = target;
      if (pct) pct.textContent = Math.round(shown);
      if (fill) fill.style.width = shown.toFixed(2) + '%';
      if (shown > 99.6 && target === 100 && Date.now() - started >= 1100) return finish();
      preRaf = requestAnimationFrame(tick);
    })();

    setTimeout(function () { capped = true; }, 2600);           // hard cap
  }
})();

/* ── mobile menu: hamburger morph + overlay, focus-safe ─────── */
(function () {
  'use strict';
  var burger = document.getElementById('burger');
  var ovl = document.getElementById('menu-overlay');
  if (!burger || !ovl) return;
  var open = false;

  function setOpen(next) {
    open = next;
    burger.setAttribute('aria-expanded', String(next));
    document.body.classList.toggle('is-open-menu', next);
    if (next) {
      ovl.hidden = false;
      requestAnimationFrame(function () { ovl.classList.add('is-in'); });
      var first = ovl.querySelector('a');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 120);
    } else {
      ovl.classList.remove('is-in');
      setTimeout(function () { if (!open) ovl.hidden = true; }, 520);
      burger.focus({ preventScroll: true });
    }
  }
  burger.addEventListener('click', function () { setOpen(!open); });
  ovl.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
  // a resize past the breakpoint must not strand the overlay open
  addEventListener('resize', function () { if (open && innerWidth > 860) setOpen(false); }, { passive: true });
})();
