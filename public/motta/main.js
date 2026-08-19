/* Motta — tuft raster engine + page choreography (vanilla, one writer per element) */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));

  /* ---------- TUFT RASTER ----------
     Dot-pile halftone: radius tracks darkness (ink dots on paper).
     Draw ONCE per size; scroll only crossfades canvas/img via --tuft. */
  /* canvas.width/height must already be set by the caller; `gap` is in DEVICE pixels,
     so this works identically for an on-screen canvas and an offscreen bitmap. */
  function drawTufts(canvas, img, opts) {
    const { gap, ink, ground } = opts;
    const w = canvas.width, h = canvas.height;
    if (!w || !h || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, w, h);
    const cols = Math.ceil(w / gap), rows = Math.ceil(h / gap);
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const octx = off.getContext('2d');
    // object-cover fit of img into cols x rows
    const ir = img.naturalWidth / img.naturalHeight, cr = cols / rows;
    const bias = opts.bias == null ? .5 : opts.bias; // vertical crop bias: the mat lives low in frame
    let sw, sh, sx, sy;
    if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
    else { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) * bias; }
    let data;
    try {
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      data = octx.getImageData(0, 0, cols, rows).data;
    } catch (e) {
      canvas.style.display = 'none'; // tainted canvas: show the plain photo
      return;
    }
    ctx.fillStyle = ink;
    const invert = !!opts.invert;
    const maxR = gap * .46, minR = Math.max(.5, gap * .07);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const lum = (data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722) / 255;
        // on paper, darkness grows the tuft; on the dark hero ground, light does
        const t = Math.pow(invert ? lum : 1 - lum, 0.78); // gamma below 1
        const r = minR + t * (maxR - minR);
        ctx.beginPath();
        ctx.arc(x * gap + gap / 2, y * gap + gap / 2, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  const css = getComputedStyle(document.documentElement);
  const INK = css.getPropertyValue('--ink').trim() || '#101418';
  const PAPER = css.getPropertyValue('--paper').trim() || '#F4F6F8';

  /* ---------- HERO FILM ----------
     Their own five hero slides. Each change dissolves THROUGH the tuft raster:
     the mat re-weaves itself for the next doorway. Tuft bitmaps are pre-rendered
     once per size, so a transition is only two opacity tweens. */
  const FILM = [
    { src: 'assets/hero-30.webp', cap: 'Duck & Rose', alt: 'Logomotta með merki Duck & Rose við inngang veitingastaðarins' },
    { src: 'assets/hero-16.webp', cap: 'Iceland Parliament Hotel', alt: 'Logomotta Iceland Parliament Hotel við útidyr, Austurvöllur handan glersins' },
    { src: 'assets/hero-18.webp', cap: 'Setustofa', alt: 'Dökkblá logomotta með gylltu merki á parketi í setustofu' },
    { src: 'assets/hero-17.webp', cap: 'Móttaka', alt: 'Motta með endurteknu merki fyrir framan móttökuborð hótels' },
    { src: 'assets/hero-3.webp', cap: 'blush', alt: 'Svört logomotta með bleiku blush merki á gólfi verslunar' }
  ];
  const film = document.getElementById('film');
  let filmImg = document.getElementById('filmImg');
  const imgA = filmImg, imgB = document.getElementById('filmImgB');
  const filmCanvas = document.getElementById('filmCanvas');
  const filmCapText = document.getElementById('filmCapText');
  const filmDots = document.getElementById('filmDots');
  const filmPause = document.getElementById('filmPause');
  const SLIDE_MS = 6000;
  /* one continuous cross-dissolve; the raster rides over it as a travelling seam */
  const CROSS = 1500, SEAM_UP = 420, SEAM_DOWN = 760, SEAM_PEAK = .85;
  /* the hero raster is bone thread on a dark ground, so the white slogan stays
     legible through every weave; the band below keeps ink-on-paper. */
  const FILM_GROUND = css.getPropertyValue('--film-ground').trim() || '#0D1216';
  const FILM_THREAD = css.getPropertyValue('--bone').trim() || '#E9EEF1';
  /* must match #filmImg object-position in styles.css or photo and raster drift apart */
  const FILM_BIAS = .78;

  if (film) {
    const bitmaps = new Array(FILM.length).fill(null);
    const loaded = new Array(FILM.length).fill(null);
    let idx = 0, timer = 0, busy = false, paused = false, sized = '';

    FILM.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'film-dot';
      b.setAttribute('aria-label', `Sýna mynd ${i + 1} af ${FILM.length}`);
      b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      b.addEventListener('click', () => { stop(); go(i); });
      filmDots.appendChild(b);
    });
    const dots = [...filmDots.children];

    const loadImg = i => loaded[i] || (loaded[i] = new Promise(res => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = FILM[i].src;
    }));

    /* pre-render one slide's tuft bitmap at the current display size */
    async function bake(i) {
      const im = await loadImg(i);
      if (!im) return null;
      const w = film.clientWidth, h = film.clientHeight;
      if (!w || !h) return null;
      const dpr = Math.min(devicePixelRatio || 1, 1.35);
      const c = document.createElement('canvas');
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      drawTufts(c, im, { gap: (w < 500 ? 9 : 7) * dpr, ink: FILM_THREAD, ground: FILM_GROUND, bias: FILM_BIAS, invert: true });
      bitmaps[i] = c;
      return c;
    }

    function paint(i) {
      const bmp = bitmaps[i];
      const ctx = filmCanvas.getContext('2d');
      const dpr = Math.min(devicePixelRatio || 1, 1.35);
      filmCanvas.width = Math.round(film.clientWidth * dpr);
      filmCanvas.height = Math.round(film.clientHeight * dpr);
      ctx.fillStyle = FILM_GROUND;
      ctx.fillRect(0, 0, filmCanvas.width, filmCanvas.height);
      if (bmp) ctx.drawImage(bmp, 0, 0, filmCanvas.width, filmCanvas.height);
    }

    async function bakeAll() {
      const key = film.clientWidth + 'x' + film.clientHeight;
      if (key === sized || !film.clientWidth) return;
      sized = key;
      for (let i = 0; i < FILM.length; i++) {
        await bake(i);
        if (i === idx) paint(idx);
        await new Promise(r => setTimeout(r, 0)); // yield between slides
      }
    }

    function setKen(el) {
      if (reduced) return;
      const t = el || filmImg;
      t.style.animation = 'none';
      void t.offsetWidth;
      t.style.animation = `mt-ken ${(SLIDE_MS + CROSS * 2) / 1000}s linear forwards`;
      t.style.animationPlayState = 'running';
    }

    async function go(next) {
      if (busy || next === idx) return;
      busy = true;
      const im = await loadImg(next);
      if (im && im.decode) { try { await im.decode(); } catch (e) {} }  // never reveal an undecoded bitmap
      if (reduced) {
        idx = next;
        filmImg.src = FILM[next].src; filmImg.alt = FILM[next].alt;
        filmCapText.textContent = FILM[next].cap;
        dots.forEach((d, i) => d.setAttribute('aria-current', String(i === next)));
        busy = false;
        return;
      }
      if (!bitmaps[next]) await bake(next);

      const inc = (filmImg === imgA) ? imgB : imgA;
      const outg = filmImg;

      // stage the incoming photo underneath-but-raised, already drifting, still invisible
      inc.src = im ? im.src : FILM[next].src;
      inc.alt = FILM[next].alt;
      inc.removeAttribute('aria-hidden');
      outg.alt = '';
      outg.setAttribute('aria-hidden', 'true');
      inc.style.zIndex = '1';
      outg.style.zIndex = '0';
      inc.style.transition = 'none';
      inc.style.opacity = '0';
      setKen(inc);
      await new Promise(r => requestAnimationFrame(r));
      await new Promise(r => requestAnimationFrame(r));

      // the raster crosses as a seam; both photos are on screen the whole time
      paint(next);
      filmCanvas.classList.add('seaming');
      filmCanvas.style.transition = 'none';
      filmCanvas.style.setProperty('--seam', '0');
      filmCanvas.style.opacity = String(SEAM_PEAK);
      await new Promise(r => requestAnimationFrame(r));
      filmCanvas.style.transition = `--seam ${CROSS}ms linear`;
      filmCanvas.style.setProperty('--seam', '1');

      inc.style.transition = `opacity ${CROSS}ms cubic-bezier(.4,0,.6,1)`;
      inc.style.opacity = '1';

      idx = next;
      filmCapText.textContent = FILM[next].cap;
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === next)));

      await new Promise(r => setTimeout(r, CROSS + 80));
      filmCanvas.classList.remove('seaming');
      filmCanvas.style.transition = 'none';
      filmCanvas.style.opacity = '0';
      outg.style.transition = 'none';
      outg.style.opacity = '0';
      outg.style.animation = 'none';
      filmImg = inc;
      busy = false;
    }

    const advance = () => go((idx + 1) % FILM.length);
    function play() {
      if (reduced || paused) return;
      clearInterval(timer);
      timer = setInterval(advance, SLIDE_MS + CROSS);
    }
    function stop() { clearInterval(timer); timer = 0; }

    filmPause.addEventListener('click', () => {
      paused = !paused;
      filmPause.setAttribute('aria-pressed', String(paused));
      filmPause.setAttribute('aria-label', paused ? 'Halda myndasyrpu áfram' : 'Gera hlé á myndasyrpu');
      if (paused) stop(); else play();
    });
    // never animate against a hidden tab
    addEventListener('visibilitychange', () => { if (document.hidden) stop(); else play(); });

    let rz = 0;
    new ResizeObserver(() => {
      clearTimeout(rz);
      rz = setTimeout(() => { sized = ''; bakeAll(); }, 220);
    }).observe(film);

    /* entrance: slide 0 arrives already woven, then resolves into the photograph */
    (async () => {
      if (reduced) { filmCanvas.style.opacity = '0'; return; }
      await bake(0);
      paint(0);
      await loadImg(0);
      await new Promise(r => setTimeout(r, 700));
      filmCanvas.style.transition = `opacity 1400ms var(--ease)`;
      filmCanvas.style.opacity = '0';
      setKen();
      bakeAll().then(play);
    })();
  }

  const tuftFigs = [...document.querySelectorAll('[data-tuft]')];
  tuftFigs.forEach(fig => {
    const img = fig.querySelector('img');
    const canvas = fig.querySelector('canvas');
    const paint = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.6);
      const w = fig.clientWidth, h = fig.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      drawTufts(canvas, img, { gap: (w < 500 ? 9 : 7) * dpr, ink: INK, ground: PAPER });
    };
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); });
    ro.observe(fig);
    if (img.complete && img.naturalWidth) paint();
    img.addEventListener('load', paint);
    img.addEventListener('error', () => { canvas.style.display = 'none'; });
  });

  /* ---------- single scroll driver: writes CSS vars, batched reads ---------- */
  const band = document.querySelector('.band-media');
  const leiga = document.querySelector('.leiga');
  const loopProg = document.querySelector('.loop-prog');
  const loopSteps = [...document.querySelectorAll('.loop-step')];
  const hdr = document.getElementById('hdr');
  const ARC = 276.46;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = innerHeight;
      // reads first
      const bandR = band && band.getBoundingClientRect();
      const leigaR = leiga && leiga.getBoundingClientRect();
      const sc = scrollY > 8;
      // writes after
      hdr.classList.toggle('scrolled', sc);
      if (band && !reduced) {
        const mid = bandR.top + bandR.height / 2;
        const d = Math.abs(mid - vh / 2) / (vh * .75);
        band.style.setProperty('--tuft', clamp01(1 - d).toFixed(3));
      }
      if (leiga && loopProg && !reduced) {
        const total = leigaR.height - vh;
        const p = total > 0 ? clamp01(-leigaR.top / total) : 1;
        loopProg.style.strokeDashoffset = (ARC * (1 - p)).toFixed(1);
        const idx = Math.min(loopSteps.length - 1, Math.floor(p * loopSteps.length));
        loopSteps.forEach((s, i) => s.classList.toggle('on', i <= idx));
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  if (reduced) {
    loopSteps.forEach(s => s.classList.add('on'));
    tuftFigs.forEach(f => f.style.setProperty('--tuft', '1'));
  }

  /* ---------- reveals: IO one-shot, viewport-gated failsafe ---------- */
  const rvEls = [...document.querySelectorAll('.sec-head, .index-row, .vinnu-copy, .um-copy, .why-cell, .contact-h, .contact-tel, .wz-step, .preview')];
  rvEls.forEach(el => el.classList.add('rv'));
  document.querySelectorAll('.vinnu-media, .um-media').forEach(el => el.classList.add('dev'));
  if (reduced) {
    rvEls.forEach(el => el.classList.add('in'));
    document.querySelectorAll('.dev').forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    [...rvEls, ...document.querySelectorAll('.dev')].forEach(el => io.observe(el));
    // failsafe only for elements already inside the viewport at load
    setTimeout(() => {
      [...rvEls, ...document.querySelectorAll('.dev')].forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add('in');
      });
    }, 1500);
  }

  /* ---------- product index panel swap ---------- */
  const panelImgs = [...document.querySelectorAll('.index-panel img')];
  document.querySelectorAll('.index-row').forEach(row => {
    const show = () => {
      const i = +row.dataset.panel;
      panelImgs.forEach(img => img.classList.toggle('on', +img.dataset.i === i));
    };
    row.addEventListener('pointerenter', show);
    row.addEventListener('focus', show);
  });


  /* ---------- FYRIR ÞINN REKSTUR: tab list ---------- */
  const rekTabs = [...document.querySelectorAll('.rek-tab')];
  const rekPanels = [...document.querySelectorAll('.rek-panel')];
  if (rekTabs.length) {
    const showRek = i => {
      rekTabs.forEach((t, n) => {
        t.classList.toggle('on', n === i);
        t.setAttribute('aria-selected', String(n === i));
        t.tabIndex = n === i ? 0 : -1;
      });
      rekPanels.forEach((p, n) => { p.classList.toggle('on', n === i); p.hidden = n !== i; });
    };
    rekTabs.forEach((t, i) => {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', () => showRek(i));
      // roving focus, scoped to the tablist so it never fights the page
      t.addEventListener('keydown', e => {
        const horiz = matchMedia('(max-width: 767.9px)').matches;
        const next = (e.key === (horiz ? 'ArrowRight' : 'ArrowDown')) ? 1
                   : (e.key === (horiz ? 'ArrowLeft' : 'ArrowUp')) ? -1 : 0;
        if (!next) return;
        e.preventDefault();
        const n = (i + next + rekTabs.length) % rekTabs.length;
        showRek(n); rekTabs[n].focus();
      });
    });
  }


  /* ---------- LEIGUSTÆRÐIR: one mat drawn to scale on a metre grid ---------- */
  const msMat = document.getElementById('msMat');
  if (msMat) {
    const chips = [...document.querySelectorAll('.ms-chip')];
    const msDim = document.getElementById('msDim');
    const msArea = document.getElementById('msArea');
    const msName = document.getElementById('msName');
    const show = i => {
      const c = chips[i], w = +c.dataset.w, l = +c.dataset.l;
      chips.forEach((x, n) => {
        x.classList.toggle('on', n === i);
        x.setAttribute('aria-checked', String(n === i));
        x.tabIndex = n === i ? 0 : -1;
      });
      msMat.style.setProperty('--w', w);
      msMat.style.setProperty('--l', l);
      msDim.textContent = `${w} x ${l}`;
      msArea.textContent = (Math.round(w * l / 100) / 100).toFixed(2).replace('.', ',');
      msName.textContent = c.dataset.name;
    };
    chips.forEach((c, i) => {
      c.tabIndex = i === 0 ? 0 : -1;
      c.addEventListener('click', () => show(i));
      c.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = (i + d + chips.length) % chips.length;
        show(n); chips[n].focus();
      });
    });
  }

  /* ---------- burger / mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  function setNav(open) {
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Loka valmynd' : 'Opna valmynd');
    mnav.classList.toggle('open', open);
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('nav-locked', open);
  }
  burger.addEventListener('click', () => setNav(!burger.classList.contains('open')));
  mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('open')) { setNav(false); burger.focus(); } });

  /* ---------- logomottu-smiðjan ---------- */
  /* their published per-square-metre rates (motta.is, verified 2026-08-11) */
  const LOGO_RATES = { 'Innimotta': 25450, 'Sérpöntun': 27450, 'Útimotta': 37450 };
  const state = { gerd: 'Innimotta', stadur: 'Við inngang', staerd: '115 x 200', litur: 'Dökkblá', nafn: '' };
  const isk = n => { let s = String(Math.round(n)), o = ''; while (s.length > 3) { o = '.' + s.slice(-3) + o; s = s.slice(0, -3); } return s + o; };
  const m2str = v => (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
  function estimate() {
    const m = state.staerd.match(/(\d+)\s*x\s*(\d+)/);
    if (!m) return null;
    const m2 = (+m[1] / 100) * (+m[2] / 100);
    return { m2, verd: m2 * (LOGO_RATES[state.gerd] || 25450) };
  }
  const SW = { 'Dökkblá': '#1d2b46', 'Grá': '#5b6168', 'Rauð': '#7d2430', 'Græn': '#274a3a', 'Svört': '#191c1f' };
  const previewMat = document.getElementById('previewMat');
  const pCanvas = document.getElementById('previewCanvas');
  const wzName = document.getElementById('wzName');
  const wzSend = document.getElementById('wzSend');

  document.querySelectorAll('.pills').forEach(group => {
    const k = group.dataset.k;
    group.querySelectorAll('.pill').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.pill').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        state[k] = btn.value;
        renderPreview();
        updateMailto();
        showEstimate();
      });
    });
  });

  /* live tuft preview: the typed name rendered as carpet pile */
  function renderPreview() {
    if (!pCanvas) return;
    const matBg = SW[state.litur] || '#1d2b46';
    previewMat.style.setProperty('--mat-bg', matBg);
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    const w = previewMat.clientWidth, h = previewMat.clientHeight;
    if (!w || !h) return;
    pCanvas.width = Math.round(w * dpr);
    pCanvas.height = Math.round(h * dpr);
    const ctx = pCanvas.getContext('2d');
    ctx.scale(dpr, dpr);
    // draw text into offscreen, then re-render as tufts
    const name = (state.nafn || 'MOTTA').toUpperCase();
    const gap = 6;
    const cols = Math.ceil(w / gap), rows = Math.ceil(h / gap);
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const octx = off.getContext('2d');
    octx.fillStyle = '#000'; octx.fillRect(0, 0, cols, rows);
    octx.fillStyle = '#fff';
    let fs = rows * .42;
    octx.font = `700 ${fs}px Nippo, Arial, sans-serif`;
    while (octx.measureText(name).width > cols * .82 && fs > 6) {
      fs -= 1; octx.font = `700 ${fs}px Nippo, Arial, sans-serif`;
    }
    octx.textAlign = 'center'; octx.textBaseline = 'middle';
    octx.fillText(name, cols / 2, rows / 2 + rows * .02);
    const data = octx.getImageData(0, 0, cols, rows).data;
    // background pile: faint tufts of the mat colour itself
    ctx.clearRect(0, 0, w, h);
    const liftInk = 'rgba(255,255,255,.10)';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const on = data[i] > 128;
        ctx.fillStyle = on ? '#F4F6F8' : liftInk;
        const r = on ? gap * .40 : gap * .16;
        ctx.beginPath();
        ctx.arc(x * gap + gap / 2, y * gap + gap / 2, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }
  const wzEst = document.getElementById('wzEstimate');
  function showEstimate() {
    if (!wzEst) return;
    const e = estimate();
    if (!e) { wzEst.textContent = ''; return; }
    wzEst.innerHTML = `<span class="est-num">${isk(e.verd)} kr.</span>` +
      `<span class="est-calc">${m2str(e.m2)} m² &times; ${isk(LOGO_RATES[state.gerd])} kr./m²</span>`;
  }
  if (wzName) {
    wzName.addEventListener('input', () => { state.nafn = wzName.value.trim(); renderPreview(); updateMailto(); });
  }
  function updateMailto() {
    const e = estimate();
    const body = [
      'Góðan dag,', '',
      'Ég vil fá tilboð í logomottu:',
      `Gerð: ${state.gerd}`,
      `Staðsetning: ${state.stadur}`,
      `Stærð: ${state.staerd} cm`,
      `Grunnlitur: ${state.litur}`,
      `Nafn/merki: ${state.nafn || '(ekki skráð)'}`,
      e ? `Áætlað verð af vef: ${isk(e.verd)} kr. (${m2str(e.m2)} m² x ${isk(LOGO_RATES[state.gerd])} kr./m²)` : '',
      '', 'Kveðja,'
    ].filter(Boolean).join('\n');
    wzSend.href = `mailto:motta@motta.is?subject=${encodeURIComponent('Fyrirspurn um logomottu')}&body=${encodeURIComponent(body)}`;
  }
  if (previewMat) {
    const pro = new ResizeObserver(() => renderPreview());
    pro.observe(previewMat);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderPreview);
    renderPreview();
    updateMailto();
    showEstimate();
  }

  /* ---------- entrance ---------- */
  const start = () => {
    requestAnimationFrame(() => { document.body.classList.add('loaded'); onScroll(); });
  };
  if (document.readyState === 'complete') start();
  else addEventListener('load', start);
})();
