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
    // Safety net: a fast flick can outrun the observer. Content must never stay hidden.
    var sweeping = false;
    var sweep = function () {
      sweeping = false;
      for (var i = rises.length - 1; i >= 0; i--) {
        var t = rises[i];
        if (t.classList.contains('in')) continue;
        if (t.getBoundingClientRect().top < window.innerHeight) { t.classList.add('in'); rio.unobserve(t); }
      }
      // headings too — a stranded heading is worse than a stranded paragraph
      for (var j = headings.length - 1; j >= 0; j--) {
        var hd = headings[j];
        if (hd.done) continue;
        if (hd.el.getBoundingClientRect().top < window.innerHeight) { hd.done = true; hd.show(); }
      }
    };
    addEventListener('scroll', function () { if (!sweeping) { sweeping = true; requestAnimationFrame(sweep); } }, { passive: true });
    addEventListener('resize', sweep, { passive: true });
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
      var prog = clamp(-dayR.top / Math.max(1, daySec.offsetHeight - vh), 0, 1);
      dayTargetX = prog * dayOver;
      // only spin the rAF while the chapter is anywhere near the viewport
      dayLive = dayR.bottom > -vh && dayR.top < vh * 2;
      kickDay();
    }

    /* hero closes into a slot; the wordmark flies into the header centre */
    if (heroR && heroMedia) {
      var hp = clamp(-heroR.top / Math.max(1, heroSec.offsetHeight - vh), 0, 1);
      var e = hp * hp;                                  // hold, then go
      heroMedia.style.setProperty('--hc', (e * 34).toFixed(2) + '%');
      heroMedia.style.setProperty('--hs', (1 + e * 0.06).toFixed(4));
      // the who-text and corner state fade well before the wordmark lands
      heroSec.style.setProperty('--ho', (1 - clamp(hp * 1.9, 0, 1)).toFixed(3));
      nav.classList.toggle('is-past', hp > 0.62);

      if (wm && wmSlot && wmHead) {
        var a = wmSlot.getBoundingClientRect();   // hero rest position (pinned, so stable)
        var b = wmHead.getBoundingClientRect();   // header target (fixed, so constant)
        var t = e;                                // same easing as the film close
        wm.style.setProperty('--wmw', a.width + 'px');
        wm.style.setProperty('--wms', (1 + (b.width / Math.max(1, a.width) - 1) * t).toFixed(4));
        wm.style.setProperty('--wmy', (a.top + (b.top - a.top) * t).toFixed(1) + 'px');
        // cream over the film -> ink once it sits on the cream bar
        wm.style.setProperty('--wmc', (1 - clamp((hp - 0.55) / 0.3, 0, 1)).toFixed(3));
      }
    }

    /* 1920 — four digits, four generations, aligned only at centre */
    if (yearR && yearDigits.length) {
      // clamp: off-screen the raw ratio runs far past 1 and the digits fly hundreds of px
      var yp = clamp((yearR.top + yearR.height / 2 - vh / 2) / (vh / 2 + yearR.height / 2), -1, 1);
      for (var d = 0; d < yearDigits.length; d++) {
        var k = parseFloat(getComputedStyle(yearDigits[d]).getPropertyValue('--k')) || 1;
        yearDigits[d].style.setProperty('--dy', (yp * k * 46).toFixed(1) + 'px');
      }
    }

    /* footer is fixed behind the page; fade its content in as it is uncovered */
    if (spacerR && footIn) {
      var fp = clamp((vh - spacerR.top) / Math.max(1, spacerR.height * 0.85), 0, 1);
      footIn.style.setProperty('--fp', fp.toFixed(3));
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

  if (!REDUCED) {
    dayOver = sizeDay(); sizeFoot();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { dayOver = sizeDay(); sizeFoot(); onScroll(); }, { passive: true });
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
    if (!v || REDUCED) return;
    v.muted = true; v.defaultMuted = true; v.loop = true;   // properties, not just attributes
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
     Counts real image decode, never a timer. 1.1s floor (on a warm
     cache every image is already .complete and it would flash), 2.4s
     hard cap, once per session, never under reduced motion.          */
  var pre = $('#pre'), fill = $('[data-fill]'), pct = $('[data-pct]');
  var started = Date.now();

  function ready() {
    document.body.classList.add('is-ready');
    dayOver = sizeDay(); sizeFoot();
    onScroll();
    startHeroVideo();
  }

  function finish() {
    if (pre) { pre.classList.add('is-done'); }
    ready();
  }

  if (!pre || REDUCED || sessionStorage.getItem('sh-seen') === '1') {
    if (pre) pre.remove();
    // let first paint settle so the entrance transitions actually run
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  } else {
    sessionStorage.setItem('sh-seen', '1');
    var imgs = $$('img').filter(function (i) { return !i.closest('.pre'); });
    var total = Math.max(1, imgs.length), done = 0, settled = false;

    var bump = function () {
      done++;
      var p = Math.round(clamp(done / total, 0, 1) * 100);
      if (pct) pct.textContent = p;
      if (fill) fill.style.width = p + '%';
      if (done >= total) settle();
    };
    var settle = function () {
      if (settled) return; settled = true;
      var wait = Math.max(0, 1100 - (Date.now() - started));   // 1.1s floor
      setTimeout(finish, wait);
    };
    imgs.forEach(function (im) {
      if (im.complete) { bump(); return; }
      im.addEventListener('load', bump, { once: true });
      im.addEventListener('error', bump, { once: true });
    });
    setTimeout(settle, 2400);                                   // hard cap
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
