import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { Pizza, Flame, Leaf, Baby, CupSoda, Tag, Star } from 'lucide-react'
import Dock from '../../components/Dock'
import AskurLoading from './Loading'
import { setThemeColor } from '../../lib/preview'
import { SndrBadge } from '../SndrBadge'
import {
  ORDER, TAPROOM, PHONE_DISPLAY, PHONE_HREF, EMAIL, MAPS, SOCIAL, IMG, SLICE_GEO, SLICES,
  TRAVELLER_VEC, HERO_ORANGE, FEATURED, NAME_MARQUEE, MENU_LINKS, HOURS, TAPROOM_BAND, STORY,
  KAERLEIKS, AWARD, ADDRESS,
} from './data'

const Grainient = lazy(() => import('../../components/Grainient'))

/* Askur Pizzeria (Egilsstaðir) — redesign prototype. CLONES the flatbakan/eldofninn pizza-spin
   template (same pinned hero intro, same layout engine) but re-skinned to a DARK theme to match
   Askur's real black/white brand and their moody dark-plate photography. Their own real monoline
   pictogram logo is used directly (not replaced with an in-code silhouette). Their real overhead
   pizza-grid photo drives a cinematic Ken-Burns feature section; individual pizzas cropped from it
   fill the menu cards. The spinning hero pizza is the SAME shared asset the siblings use and is the
   one placeholder to disclose in outreach. Live ordering untouched: Panta deep-links to their menu. */

const CAT_ICON: Record<string, ReactNode> = {
  'Pizzur': <Pizza size={20} strokeWidth={1.8} />,
  'Vinsælar': <Star size={20} strokeWidth={1.8} />,
  'Sterkar': <Flame size={20} strokeWidth={1.8} />,
  'Vegan': <Leaf size={20} strokeWidth={1.8} />,
  'Barnamatseðill': <Baby size={20} strokeWidth={1.8} />,
  'Drykkir': <CupSoda size={20} strokeWidth={1.8} />,
}

const BASE = import.meta.env.BASE_URL

// ---- DARK palette (Askur brand) ----
const INK = '#141210'        // page + frame background (warm near-black)
const PANEL = '#1F1B18'      // cards / raised surfaces
const PANEL2 = '#26211C'     // bands
const TEXT = '#F4EEE4'       // primary text (off-white)
const MUTE = 'rgba(244,238,228,0.6)'
const LINE = 'rgba(244,238,228,0.14)'  // hairline borders on dark
const CHARCOAL = '#2E2823'   // solid dark pill on the amber hero
const RED = '#E64A2C'        // accent — CTAs / prices / stamps (brighter for dark)
const ORANGE = HERO_ORANGE   // hero stage only — baked into the pizza cutout, never changes

// Series-standard pairing (same as eldofninn/pizzasmiðjan): Tanker display + Satoshi body.
const DISPLAY = "'Tanker-Regular', Georgia, serif"
const SANS = "'Satoshi', system-ui, sans-serif"

/* ------------------------------------------------------------------ Reveal */
function Reveal({ children, className = '', delay = 0, y = 26 }: {
  children: ReactNode; className?: string; delay?: number; y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => { el.style.opacity = '1'; el.style.transform = 'none' }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { show(); io.disconnect() } }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    const t = window.setTimeout(show, 1600)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [])
  return <div ref={ref} className={className}
    style={{ opacity: 0, transform: `translateY(${y}px)`, transition: `opacity 1.1s ease ${delay}ms, transform 1.1s cubic-bezier(.16,.7,.2,1) ${delay}ms` }}>{children}</div>
}

/* ------------------------------------------------------------- pieces */
function Pill({ children, href = ORDER, active = false, ext = true, solid = false }: {
  children: ReactNode; href?: string; active?: boolean; ext?: boolean; solid?: boolean
}) {
  const isDark = active || solid
  return (
    <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})} className="ak-pill"
      style={{ background: isDark ? CHARCOAL : 'rgba(20,18,16,.14)', color: isDark ? TEXT : INK, borderColor: INK }}>
      {children}
    </a>
  )
}

/* ============================================================== the page === */
export default function AskurPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pizzaRef = useRef<HTMLDivElement>(null)
  const pantaRef = useRef<HTMLAnchorElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Askur Pizzeria — Eldbakað á súrdeigsbotni á Egilsstöðum'
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Loading gate — identical strategy to the sibling pages.
  const GATE_KEYS = useMemo(() => ['fonts', 'hero', 'logo', 'grain'] as const, [])
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const [forced, setForced] = useState(false)
  const mark = useCallback((k: string) => setReady((r) => (r[k] ? r : { ...r, [k]: true })), [])
  const readyCount = GATE_KEYS.reduce((n, k) => n + (ready[k] ? 1 : 0), 0)
  const assetsReady = forced || readyCount === GATE_KEYS.length
  const loadProgress = forced ? 1 : readyCount / GATE_KEYS.length

  useEffect(() => {
    let alive = true
    const safeMark = (k: string) => { if (alive) mark(k) }
    const warm = (src: string, key?: string) => {
      const im = new Image()
      im.src = src
      im.decode().catch(() => {}).finally(() => { if (key) safeMark(key) })
    }
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => safeMark('fonts'))
    warm(IMG.whole, 'hero')
    warm(IMG.logo, 'logo')
    SLICES.forEach((sl) => warm(sl.img))
    warm(IMG.slice)
    warm(IMG.grid)
    const failsafe = window.setTimeout(() => { if (alive) setForced(true) }, 4500)
    return () => { alive = false; window.clearTimeout(failsafe) }
  }, [mark])

  const [overlayMounted, setOverlayMounted] = useState(true)
  useEffect(() => {
    if (!assetsReady) return
    const t = window.setTimeout(() => setOverlayMounted(false), 780)
    return () => window.clearTimeout(t)
  }, [assetsReady])

  useEffect(() => {
    if (!assetsReady) { setThemeColor('#141210'); return }
    setThemeColor(ORANGE)
    const frame = rootRef.current?.querySelector('.ak-frame')
    if (!frame) return
    const io = new IntersectionObserver(
      ([e]) => setThemeColor(e.isIntersecting ? INK : ORANGE),
      { rootMargin: '0px 0px -92% 0px' },
    )
    io.observe(frame)
    return () => io.disconnect()
  }, [assetsReady])

  useEffect(() => {
    const el = bgRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const AMOUNT = 18
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    let raf = 0
    let pageVisible = !document.hidden
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.05
      cur.y += (target.y - cur.y) * 0.05
      el.style.transform = `translate3d(${(-cur.x * AMOUNT).toFixed(1)}px, ${(-cur.y * AMOUNT).toFixed(1)}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const tryStart = () => { if (pageVisible && raf === 0) raf = requestAnimationFrame(loop) }
    const tryStop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0 } }
    const onVis = () => {
      pageVisible = !document.hidden
      pageVisible ? tryStart() : tryStop()
    }
    document.addEventListener('visibilitychange', onVis)
    tryStart()
    return () => {
      tryStop()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current
    const pizza = pizzaRef.current
    const panta = pantaRef.current
    if (!root || !track || !stage || !pizza || !panta) return
    const s = root.style
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches

    const SPIN_A = 0.06, SPIN_B = 0.52
    const CUT_A = 0.12, CUT_B = 0.30
    const SPREAD_A = 0.30, SPREAD_B = 0.54
    const SEP_A = 0.56, SEP_B = 0.94
    const TURNS = 360
    const SPREAD_MAX = 0.10
    const DRIFT_MAX = 0.06

    let S = 0, pcx = 0, pcy = 0, bcx = 0, btnTop = 0
    const measure = () => {
      const pr = pizza.getBoundingClientRect()
      const sr = stage.getBoundingClientRect()
      const br = panta.getBoundingClientRect()
      S = pizza.offsetWidth
      pcx = (pr.left + pr.right) / 2 - sr.left
      pcy = (pr.top + pr.bottom) / 2 - sr.top
      bcx = br.left + br.width / 2
      btnTop = br.top
    }
    measure()

    const place = (seq: number) => {
      const spin = easeIO(clamp((seq - SPIN_A) / (SPIN_B - SPIN_A))) * TURNS
      const cut = clamp((seq - CUT_A) / (CUT_B - CUT_A))
      const spread = easeOut(clamp((seq - SPREAD_A) / (SPREAD_B - SPREAD_A)))
      const drift = clamp((seq - SPREAD_B) / (1 - SPREAD_B))
      const sep = easeIO(clamp((seq - SEP_A) / (SEP_B - SEP_A)))

      const spr = (spread * SPREAD_MAX + drift * DRIFT_MAX) * S
      s.setProperty('--spin', spin.toFixed(2))
      s.setProperty('--cut', cut.toFixed(3))
      s.setProperty('--spread', spr.toFixed(1) + 'px')
      const ang = spin * Math.PI / 180
      const vx = SLICE_GEO.cx * S + TRAVELLER_VEC.ux * spr
      const vy = SLICE_GEO.cy * S + TRAVELLER_VEC.uy * spr
      const natX = pcx + (vx * Math.cos(ang) - vy * Math.sin(ang))
      const natY = pcy + (vx * Math.sin(ang) + vy * Math.cos(ang))
      const wPizza = SLICE_GEO.w * S
      const wDrop = 56
      const hDrop = wDrop / 0.689
      const OVERLAP = 14
      const tgtY = btnTop + OVERLAP - hDrop / 2
      s.setProperty('--slx', lerp(natX, bcx, sep).toFixed(1) + 'px')
      s.setProperty('--sly', lerp(natY, tgtY, sep).toFixed(1) + 'px')
      s.setProperty('--slw', lerp(wPizza, wDrop, sep).toFixed(1) + 'px')
      s.setProperty('--slr', lerp(spin, -6, sep).toFixed(1) + 'deg')
      const ARMED_A = 0.85, ARMED_B = 0.97
      const armed = easeIO(clamp((seq - ARMED_A) / (ARMED_B - ARMED_A)))
      s.setProperty('--armed', armed.toFixed(3))
    }

    if (reduce) { track.style.height = '100svh'; place(0); return }
    place(0)
    s.setProperty('--seq', '0.000')

    type Phase = 'idle' | 'playing' | 'released'
    let phase: Phase = 'idle'
    const onResize = () => { measure() }

    const lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    if (import.meta.env.DEV) {
      (window as unknown as { __lenis?: Lenis; __akMeasure?: () => void; __akPhase?: () => Phase; __akPlay?: () => void }).__lenis = lenis
      ;(window as unknown as { __akMeasure?: () => void }).__akMeasure = measure
      ;(window as unknown as { __akPhase?: () => Phase }).__akPhase = () => phase
    }
    let lenisRaf = 0
    const loop = (time: number) => { lenis.raf(time); lenisRaf = requestAnimationFrame(loop) }
    lenisRaf = requestAnimationFrame(loop)

    const PLAY_MS = 3400
    let playRaf = 0
    let playStart = 0
    let releaseFailsafe = 0
    // Gesture-gap boost (per flatbakan's fix): only boost after GESTURE_GAP of input silence, since
    // one real flick streams momentum events for 1-2s and a plain cooldown would runaway-accelerate.
    let speed = 1
    let lastInputAt = 0
    const GESTURE_GAP = 300
    const SPEED_STEP = 2.1
    const SPEED_MAX = 6
    const boost = (time: number) => {
      const gap = time - lastInputAt
      lastInputAt = time
      if (gap < GESTURE_GAP) return
      if (speed >= SPEED_MAX) return
      const elapsedBefore = (time - playStart) * speed
      speed = Math.min(SPEED_MAX, speed * SPEED_STEP)
      playStart = time - elapsedBefore / speed
    }
    const release = () => {
      if (phase === 'released') return
      phase = 'released'
      window.removeEventListener('wheel', onTrigger)
      window.removeEventListener('touchmove', onTrigger)
      window.removeEventListener('keydown', onKeyTrigger)
      window.clearTimeout(releaseFailsafe)
      track.style.height = '100svh'
      place(1)
      s.setProperty('--seq', '1.000')
      lenis.start()
    }
    const playTick = (time: number) => {
      if (!playStart) playStart = time
      const t = easeOut(clamp(((time - playStart) * speed) / PLAY_MS))
      s.setProperty('--seq', t.toFixed(3))
      place(t)
      if (t < 1) { playRaf = requestAnimationFrame(playTick); return }
      release()
    }
    const onTrigger = (e: Event) => {
      if (e.type !== 'touchmove' && e.cancelable) e.preventDefault()
      if (phase !== 'idle') { boost(performance.now()); return }
      measure()
      phase = 'playing'
      playStart = 0
      speed = 1
      lastInputAt = performance.now()
      playRaf = requestAnimationFrame(playTick)
      window.clearTimeout(releaseFailsafe)
      releaseFailsafe = window.setTimeout(release, PLAY_MS * 2)
    }
    const SCROLL_KEYS = new Set([' ', 'Spacebar', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'])
    const isFormTarget = (t: EventTarget | null) => {
      if (!(t instanceof HTMLElement)) return false
      const tag = t.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable
    }
    const onKeyTrigger = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (!SCROLL_KEYS.has(e.key) || isFormTarget(e.target)) return
      onTrigger(e)
    }
    if (import.meta.env.DEV) (window as unknown as { __akPlay?: () => void }).__akPlay = () => onTrigger(new Event('debug', { cancelable: false }))

    lenis.stop()
    window.addEventListener('wheel', onTrigger, { passive: false })
    window.addEventListener('touchmove', onTrigger, { passive: true })
    window.addEventListener('keydown', onKeyTrigger)
    window.addEventListener('resize', onResize)
    let cancelled = false
    document.fonts.ready.then(() => { if (!cancelled) measure() })
    return () => {
      cancelled = true
      window.removeEventListener('wheel', onTrigger)
      window.removeEventListener('touchmove', onTrigger)
      window.removeEventListener('keydown', onKeyTrigger)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(releaseFailsafe)
      if (playRaf) cancelAnimationFrame(playRaf)
      cancelAnimationFrame(lenisRaf)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={rootRef} className="ak-root" data-revealed={assetsReady ? '' : undefined} style={{ background: INK, color: TEXT, fontFamily: SANS }}>
      <style>{CSS}</style>

      {overlayMounted && <AskurLoading visible={!assetsReady} progress={loadProgress} />}

      {/* ambient ember-glow backdrop — dark with faint warm amber grain drifting with the pointer,
          instead of a stock ingredients photo (which was toned for a cream page and would clash
          with this dark theme). Same Grainient shader the hero uses, just darker/slower/quieter. */}
      <div ref={bgRef} className="ak-bgwrap" aria-hidden>
        <Suspense fallback={null}>
          <Grainient
            className="ak-bg-grain"
            color1="#0D0B09" color2="#3A1A06" color3={ORANGE}
            contrast={0.7} saturation={0.65} grainAmount={0.09} grainScale={2.8}
            warpAmplitude={26} warpFrequency={2.1} timeSpeed={0.045} zoom={1.35}
            maxDpr={1} fps={24}
            onReady={() => {}}
          />
        </Suspense>
      </div>

      {/* ================================================= pinned pizza opener */}
      <div ref={trackRef} className="ak-track">
        <div ref={stageRef} className="ak-stage-pin">
          <Suspense fallback={null}>
            <Grainient
              className="ak-grain-hero"
              color1="#F6B663" color2={ORANGE} color3="#C17D23"
              contrast={0.9} saturation={0.85} grainAmount={0.05} grainScale={2.2}
              warpAmplitude={20} warpFrequency={3} timeSpeed={0.08} zoom={1.1}
              maxDpr={1} fps={30}
              onReady={() => mark('grain')}
            />
          </Suspense>
          <header className="ak-nav">
            <div className="ak-nav-grp">
              <Pill href="#top" ext={false} active>Heim</Pill>
              <Pill href="#sagan" ext={false}>Um okkur</Pill>
            </div>
            <a href="#top" className="ak-badge"><img src={IMG.logo} alt="Askur Pizzeria" /></a>
            <div className="ak-nav-grp">
              <Pill href="#matsedill" ext={false}>Matseðill</Pill>
              <Pill href={ORDER} solid>Panta</Pill>
            </div>
            <button type="button" className="ak-burger" data-open={menuOpen} aria-expanded={menuOpen}
              aria-controls="ak-mmenu" aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              onClick={() => setMenuOpen((v) => !v)}>
              <span className="ak-burger-lines"><span /><span /><span /></span>
            </button>
          </header>
          <div className="ak-mbackdrop" data-open={menuOpen} aria-hidden onClick={() => setMenuOpen(false)} />
          <nav id="ak-mmenu" className="ak-mmenu" data-open={menuOpen} aria-label="Aðalvalmynd" aria-hidden={!menuOpen}>
            <a href="#top" onClick={() => setMenuOpen(false)}>Heim</a>
            <a href="#sagan" onClick={() => setMenuOpen(false)}>Um okkur</a>
            <a href="#matsedill" onClick={() => setMenuOpen(false)}>Matseðill</a>
            <a href={ORDER} target="_blank" rel="noreferrer" className="ak-mmenu-cta" onClick={() => setMenuOpen(false)}>Panta núna</a>
          </nav>

          <div className="ak-hero-mid">
            <div className="ak-hero-word" aria-hidden>ASKUR</div>
            <div className="ak-hero-copy">
              <h1 className="ak-h1">Fáðu þér <span className="ak-sneid">sneið</span></h1>
              <p className="ak-lede">Eldbakað á súrdeigsbotni í hjarta Egilsstaða.</p>
              <div className="ak-claim"><span className="ak-claim-star">★</span>Má bjóða þér eina glóðvolga?</div>
            </div>
            <div ref={pizzaRef} className="ak-pizza" aria-hidden>
              <div className="ak-glow" />
              <img src={IMG.whole} alt="" className="ak-layer ak-whole" draggable={false} />
              {SLICES.filter((sl) => !sl.traveller).map((sl) => (
                <img key={sl.img} src={sl.img} alt="" className="ak-layer ak-sl" draggable={false}
                  style={{ ['--ux' as string]: sl.ux, ['--uy' as string]: sl.uy }} />
              ))}
            </div>
          </div>

          <div className="ak-scrollcue" aria-hidden><span>Skrunaðu</span><i /></div>
        </div>
      </div>

      {/* ==================================================== the framed website */}
      <div className="ak-frame">
        {/* -------------------------------------------------------- matseðill */}
        <section id="matsedill" className="ak-sec">
          <div className="ak-sec-head">
            <Reveal><h2 className="ak-h2">Vinsælustu pizzurnar</h2></Reveal>
            <Reveal delay={80}><a href={ORDER} target="_blank" rel="noreferrer" className="ak-btn">Allur matseðillinn</a></Reveal>
          </div>
          <div className="ak-cards">
            {FEATURED.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article className="ak-card">
                  <div className="ak-card-img"><img src={p.img} alt={p.name} loading="lazy" width={520} height={390} />
                    {p.best && <span className="ak-tag">Vinsæl</span>}</div>
                  <div className="ak-card-body">
                    <div className="ak-card-top"><h3>{p.name}</h3><span className="ak-price">{p.price}<em> kr</em></span></div>
                    <p>{p.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="ak-cat ak-dock-wrap">
            <Dock
              items={MENU_LINKS.map((m) => ({
                icon: CAT_ICON[m.label] ?? <Tag size={20} strokeWidth={1.8} />,
                label: m.label,
                onClick: () => window.open(ORDER, '_blank', 'noreferrer'),
              }))}
              magnification={62}
              distance={130}
              panelHeight={84}
              dockHeight={84}
              baseItemSize={44}
            />
          </div>
        </section>

        {/* ---------------------------------------- name marquee (their voice) */}
        <div className="ak-marquee" aria-hidden>
          <div className="ak-marquee-track">
            {[...NAME_MARQUEE, ...NAME_MARQUEE].map((n, i) => (
              <span key={i} className="ak-marquee-item">{n}<i>◆</i></span>
            ))}
          </div>
        </div>

        {/* ----------------------------- cinematic full-bleed overhead grid */}
        <section className="ak-cinema" aria-label="Borðið dekkað">
          <div className="ak-cinema-media" style={{ backgroundImage: `url(${IMG.grid})` }} />
          <div className="ak-cinema-veil" />
          <div className="ak-cinema-copy">
            <Reveal y={18}><p className="ak-kicker">Beint úr ofninum</p></Reveal>
            <Reveal delay={90} y={22}><h2 className="ak-cinema-h">Borðið<br />dekkað</h2></Reveal>
            <Reveal delay={180} y={18}><a href={ORDER} target="_blank" rel="noreferrer" className="ak-btn">Sjá matseðilinn</a></Reveal>
          </div>
        </section>

        {/* --------------------------------------------------------- sagan */}
        <section id="sagan" className="ak-sec ak-band">
          <div className="ak-story">
            <Reveal className="ak-story-media"><img src={IMG.interior} alt="Veitingasalur Asks á Egilsstöðum" loading="lazy" /></Reveal>
            <div className="ak-story-copy">
              <Reveal><h2 className="ak-h2">{STORY.heading}</h2></Reveal>
              <Reveal delay={70}><p className="ak-body">{STORY.body}</p></Reveal>
              <Reveal delay={130}>
                <div className="ak-award"><span className="ak-award-t">◆ {AWARD.title}</span><span className="ak-award-s">{AWARD.sub}</span></div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- taproom */}
        <section id="taproom" className="ak-sec ak-taproom">
          <div className="ak-taproom-head">
            <Reveal><h2 className="ak-h2" style={{ color: TEXT }}>Askur Taproom</h2></Reveal>
            <Reveal delay={70}><p className="ak-taproom-lede">{TAPROOM_BAND.intro}</p></Reveal>
            <Reveal delay={120}><a href={TAPROOM} target="_blank" rel="noreferrer" className="ak-btn">Kíktu á Taproom</a></Reveal>
          </div>
          <div className="ak-pkgs">
            {TAPROOM_BAND.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 70}>
                <div className="ak-pkg">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.line}</p>
                  {pkg.rates.map((r) => (
                    <div key={r.label} className="ak-rate"><span>{r.label} <em>{r.sub}</em></span><span className="ak-rate-p">{r.price}</span></div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- visit / hours */}
        <section id="stadur" className="ak-sec">
          <div className="ak-visit">
            <div>
              <Reveal><h2 className="ak-h2">{ADDRESS.street}</h2></Reveal>
              <Reveal delay={60}><p className="ak-body" style={{ marginTop: '.3rem' }}>{ADDRESS.town}. {KAERLEIKS.body}</p></Reveal>
              <Reveal delay={120}><div className="ak-visit-cta">
                <a href={MAPS} target="_blank" rel="noreferrer" className="ak-btn">Sjá á korti</a>
                <a href={PHONE_HREF} className="ak-chip">{PHONE_DISPLAY}</a>
              </div></Reveal>
            </div>
            <Reveal delay={60}><div className="ak-hours">
              {HOURS.map((h) => (<div key={h.day} className="ak-hour"><span>{h.day}</span><span>{h.time}</span></div>))}
            </div></Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- footer */}
        <footer className="ak-footer">
          <div className="ak-foot-top">
            <a href="#top" className="ak-foot-logo"><img src={IMG.logo} alt="Askur Pizzeria" /></a>
            <div className="ak-foot-links">
              <a href={MAPS} target="_blank" rel="noreferrer">{ADDRESS.street}</a>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="ak-foot-bottom">
            <span>Frumgerð í hönnun, sýnishorn, ekki opinber vefur Asks Pizzeria.</span>
            <span>Pantanir keyra á askurpizzeria.is</span>
          </div>
          <div className="ak-foot-bottom">
            <SndrBadge dark />
          </div>
        </footer>
      </div>

      <img src={IMG.slice} alt="" className="ak-slice" draggable={false} aria-hidden />

      <a ref={pantaRef} href={ORDER} target="_blank" rel="noreferrer" className="ak-sticky-panta" aria-label="Panta núna">
        <span>Panta núna</span>
        <img src={IMG.slice} alt="" className="ak-corner-slice" draggable={false} aria-hidden />
      </a>
    </div>
  )
}

/* ================================================================== styles */
const CSS = `
@font-face{font-family:'Tanker-Regular';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/tanker/fonts/Tanker-Regular.woff2') format('woff2'),
      url('${BASE}fonts/tanker/fonts/Tanker-Regular.woff') format('woff'),
      url('${BASE}fonts/tanker/fonts/Tanker-Regular.ttf') format('truetype')}
@font-face{font-family:'Satoshi';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Regular.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:500;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Medium.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:700;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Bold.woff2') format('woff2')}
.ak-root{position:relative;min-height:100vh;overflow-x:clip}

.ak-bgwrap{position:fixed;inset:-24px;z-index:0;overflow:hidden;pointer-events:none;opacity:.4;will-change:transform}
.ak-bg-grain{width:100%;height:100%;display:block}

/* ---- hero opener (NORMAL FLOW) — same architecture as the fixed sibling pages ---- */
.ak-track{position:relative;z-index:2;height:100svh}
.ak-stage-pin{position:relative;height:100svh;overflow:hidden;background:${ORANGE};
  display:flex;flex-direction:column;padding:clamp(1rem,2.4vw,1.8rem) clamp(1rem,3vw,2.4rem) clamp(1.4rem,3vw,2.2rem)}
.ak-grain-hero{position:absolute;inset:0;z-index:0;pointer-events:none}

.ak-nav{position:relative;z-index:6;width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.ak-nav-grp{display:flex;gap:.6rem}
/* their REAL wide monoline wordmark, centred on the header. On the amber hero it is filtered to a
   near-black ink so the thin white strokes read against the orange (white-on-amber would wash out);
   the footer uses the raw white version on dark. */
.ak-badge{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:44px;display:flex;align-items:center}
.ak-badge img{height:100%;width:auto;object-fit:contain;filter:brightness(0);opacity:.82}

.ak-burger{display:none;position:relative;z-index:8;width:44px;height:44px;flex:0 0 auto;padding:0;
  align-items:center;justify-content:center;background:${CHARCOAL};border:1.5px solid ${INK};
  border-radius:50%;box-shadow:2px 2px 0 ${INK};cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
.ak-burger:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.ak-burger:active{transform:translate(0,0);box-shadow:1px 1px 0 ${INK}}
.ak-burger-lines{position:relative;width:18px;height:13px}
.ak-burger-lines span{position:absolute;left:0;width:100%;height:2px;border-radius:2px;background:${TEXT};
  transition:top .3s cubic-bezier(.65,0,.35,1),transform .3s cubic-bezier(.65,0,.35,1),opacity .2s ease}
.ak-burger-lines span:nth-child(1){top:0}
.ak-burger-lines span:nth-child(2){top:5.5px}
.ak-burger-lines span:nth-child(3){top:11px}
.ak-burger[data-open="true"] .ak-burger-lines span:nth-child(1){top:5.5px;transform:rotate(45deg)}
.ak-burger[data-open="true"] .ak-burger-lines span:nth-child(2){opacity:0;transform:scaleX(0)}
.ak-burger[data-open="true"] .ak-burger-lines span:nth-child(3){top:5.5px;transform:rotate(-45deg)}

.ak-mbackdrop{display:none;position:fixed;inset:0;z-index:59;background:rgba(0,0,0,.5);
  opacity:0;pointer-events:none;transition:opacity .3s ease}
.ak-mbackdrop[data-open="true"]{opacity:1;pointer-events:auto}

.ak-mmenu{display:none;position:fixed;left:clamp(1rem,3vw,2.4rem);right:clamp(1rem,3vw,2.4rem);
  top:calc(clamp(1rem,2.4vw,1.8rem) + 60px);z-index:60;flex-direction:column;gap:.35rem;
  padding:.7rem;background:${PANEL};border:1.5px solid ${LINE};border-radius:20px;box-shadow:0 20px 50px -20px #000;
  clip-path:inset(0 0 100% 0 round 20px);transform:translateY(-6px);opacity:0;pointer-events:none;
  transition:clip-path .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1),opacity .28s ease}
.ak-mmenu[data-open="true"]{clip-path:inset(0 0 0% 0 round 20px);transform:none;opacity:1;pointer-events:auto}
.ak-mmenu a{font-family:${SANS};font-weight:700;font-size:1.05rem;color:${TEXT};text-decoration:none;
  padding:.75rem .9rem;border-radius:12px;opacity:0;transform:translateY(-8px);
  transition:background .15s ease,opacity .38s ease .1s,transform .38s cubic-bezier(.22,1,.36,1) .1s}
.ak-mmenu a:active{background:rgba(244,238,228,.07)}
.ak-mmenu[data-open="true"] a{opacity:1;transform:none}
.ak-mmenu[data-open="true"] a:nth-child(1){transition-delay:.06s}
.ak-mmenu[data-open="true"] a:nth-child(2){transition-delay:.11s}
.ak-mmenu[data-open="true"] a:nth-child(3){transition-delay:.16s}
.ak-mmenu[data-open="true"] a:nth-child(4){transition-delay:.21s}
.ak-mmenu a.ak-mmenu-cta{background:${RED};color:#fff;text-align:center;margin-top:.15rem;
  font-weight:700;text-transform:uppercase;letter-spacing:.03em;font-size:.92rem}

.ak-hero-mid{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;min-height:0;
  transform:scale(1.05);transform-origin:50% 42%;transition:transform 1.05s cubic-bezier(.16,.72,.12,1);will-change:transform}
.ak-root[data-revealed] .ak-hero-mid{transform:none}
.ak-hero-word{position:absolute;top:58%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none;
  font-family:${DISPLAY};font-weight:400;font-size:clamp(7rem,33vw,30rem);line-height:1;color:rgba(60,30,0,.22);
  letter-spacing:.02em;white-space:nowrap;text-transform:uppercase}
.ak-hero-copy{position:relative;z-index:3;text-align:center;pointer-events:none;margin-top:clamp(.6rem,3vh,2.4rem)}
.ak-h1{font-family:${DISPLAY};font-weight:400;font-size:clamp(2.4rem,6vw,4.6rem);line-height:.92;letter-spacing:-.02em;margin:0;color:${INK}}
.ak-sneid{font-family:${DISPLAY};font-style:italic;font-weight:400;font-size:1.15em;line-height:1.3;
  display:inline-block;transform:rotate(-3deg);color:#7A1F0C;
  text-shadow:0 1px 0 rgba(255,240,220,.35),0 3px 16px rgba(60,20,0,.28)}
.ak-lede{font-size:clamp(1rem,1.4vw,1.16rem);line-height:1.5;color:rgba(30,18,8,.86);max-width:40ch;margin:.85rem auto 0}
.ak-claim{display:inline-flex;align-items:center;gap:.4rem;margin-top:.9rem;padding:.5rem 1.15rem;
  background:rgba(20,14,8,.9);border:1.5px dashed rgba(255,230,200,.5);border-radius:999px;transform:rotate(-1.5deg);
  font-family:${DISPLAY};font-weight:400;font-size:.82rem;letter-spacing:.03em;text-transform:uppercase;
  color:#FFE7C8;box-shadow:0 8px 18px -10px rgba(0,0,0,.5)}
.ak-claim-star{font-size:.85em;line-height:1;color:${ORANGE}}

.ak-pizza{position:relative;width:min(60vw,465px,max(220px,calc(100svh - 26rem)));aspect-ratio:1;margin:auto;
  transform:rotate(calc(var(--spin,0)*1deg));transform-origin:50% 50%;z-index:2;will-change:transform}
.ak-glow{position:absolute;left:50%;top:52%;width:82%;height:82%;transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(90,45,0,.32),rgba(90,45,0,0) 66%);filter:blur(4px)}
.ak-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(50,25,0,.42))}
.ak-whole{opacity:calc(1 - var(--cut,0))}
.ak-sl{opacity:var(--cut,0);will-change:transform;
  transform:translate(calc(var(--ux,0) * var(--spread,0px)),calc(var(--uy,0) * var(--spread,0px)))}

.ak-slice{position:fixed;left:0;top:0;z-index:55;width:var(--slw,180px);height:auto;pointer-events:none;
  opacity:calc(var(--cut,0) * (1 - var(--armed,0)));will-change:transform;
  transform:translate(var(--slx,0),var(--sly,0)) translate(-50%,-50%) rotate(var(--slr,0));
  filter:drop-shadow(0 16px 24px rgba(0,0,0,.55))}

.ak-scrollcue{position:absolute;left:clamp(1rem,3vw,2.4rem);bottom:clamp(1rem,2.4vw,1.6rem);z-index:4;display:flex;flex-direction:column;
  align-items:flex-start;gap:.4rem;color:rgba(30,18,8,.55);font-family:${SANS};font-weight:600;font-size:.7rem;text-transform:uppercase;
  letter-spacing:.14em;opacity:calc(1 - var(--seq,0)*6);pointer-events:none}
.ak-scrollcue i{width:1px;height:26px;background:rgba(30,18,8,.45);animation:akcue 1.7s ease-in-out infinite}
@keyframes akcue{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.3}50%{transform:scaleY(1);opacity:.8}}

/* ---- pills / buttons ---- */
.ak-pill{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.86rem;
  padding:.5rem 1.05rem;border:1.5px solid ${INK};border-radius:999px;text-decoration:none;white-space:nowrap;
  box-shadow:2px 2px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease}
.ak-pill:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.ak-btn{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.92rem;
  padding:.8rem 1.5rem;border:2px solid ${RED};border-radius:999px;background:${RED};color:#fff;
  text-decoration:none;box-shadow:0 10px 26px -10px ${RED};transition:transform .15s ease,box-shadow .15s ease}
.ak-btn:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px ${RED}}
.ak-chip{display:inline-flex;align-items:center;font-family:${SANS};font-weight:600;font-size:.9rem;
  padding:.6rem 1.15rem;border:1.5px solid ${LINE};border-radius:999px;background:transparent;color:${TEXT};
  text-decoration:none;transition:background .15s,color .15s,border-color .15s}
.ak-chip:hover{background:${TEXT};color:${INK};border-color:${TEXT}}

.ak-sticky-panta{position:fixed;z-index:50;right:clamp(.9rem,2.4vw,1.6rem);bottom:clamp(.9rem,2.4vw,1.5rem);
  display:inline-flex;align-items:center;justify-content:center;
  background:${RED};color:#fff;font-family:${SANS};font-weight:700;text-transform:uppercase;letter-spacing:.05em;
  font-size:.82rem;padding:.85rem 1.4rem;border-radius:14px;border:2px solid #000;box-shadow:0 12px 30px -10px rgba(0,0,0,.7);
  text-decoration:none;transition:box-shadow .18s ease,transform .18s ease}
.ak-sticky-panta:hover{box-shadow:0 18px 40px -12px ${RED};transform:translateY(-2px)}
.ak-corner-slice{position:absolute;left:50%;top:-67px;width:56px;height:auto;pointer-events:none;
  opacity:var(--armed,0);filter:drop-shadow(0 8px 14px rgba(0,0,0,.6));
  animation:akCornerIdle 6s ease-in-out infinite}
@keyframes akCornerIdle{
  0%,100%{transform:translateX(-50%) rotate(-6deg) translateY(0)}
  50%{transform:translateX(-50%) rotate(3deg) translateY(-3px)}
}

/* ---- framed website (DARK) ---- */
.ak-frame{position:relative;z-index:1;max-width:min(1360px,90vw);margin:0 auto clamp(.9rem,2vw,1.6rem);background:${INK};
  border:1.5px solid ${LINE};border-radius:clamp(24px,3vw,40px);overflow:clip;box-shadow:0 50px 110px -50px rgba(0,0,0,.9)}
.ak-h2{font-family:${DISPLAY};font-weight:400;font-size:clamp(1.9rem,3.6vw,3rem);line-height:.98;letter-spacing:-.015em;margin:0;color:${TEXT}}
.ak-body{font-size:1.04rem;line-height:1.6;color:${MUTE};max-width:56ch}

.ak-sec{padding:clamp(3rem,6vw,5.5rem) clamp(1.2rem,4vw,3.5rem)}
.ak-sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1.5rem;flex-wrap:wrap;margin-bottom:2.2rem}
.ak-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:.85rem}
.ak-cards>div{display:flex}
.ak-card{display:flex;flex-direction:column;width:100%;background:${PANEL};border:1.5px solid ${LINE};border-radius:22px;overflow:clip;
  box-shadow:0 18px 40px -24px #000;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
.ak-card:hover{transform:translateY(-4px);box-shadow:0 30px 60px -28px rgba(0,0,0,.9),0 0 0 1px rgba(230,74,44,.4);border-color:rgba(230,74,44,.4)}
.ak-card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:#0d0b09;flex:none}
.ak-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.ak-card:hover .ak-card-img img{transform:scale(1.06)}
.ak-tag{position:absolute;top:.8rem;left:.8rem;background:${RED};color:#fff;font-family:${SANS};font-weight:700;
  font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;padding:.32rem .7rem;border-radius:999px}
.ak-card-body{display:flex;flex-direction:column;flex:1;padding:1.2rem 1.3rem 1.4rem}
.ak-card-top{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
.ak-card-top h3{font-family:${DISPLAY};font-weight:400;font-size:1.4rem;margin:0;letter-spacing:-.01em;color:${TEXT}}
.ak-price{font-family:${DISPLAY};font-weight:400;font-size:1.3rem;color:${ORANGE};white-space:nowrap}
.ak-price em{font-family:${SANS};font-size:.62em;font-style:normal;color:${MUTE}}
.ak-card-body p{font-size:.9rem;line-height:1.45;color:${MUTE};margin:.5rem 0 0;min-height:2.9em;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden}
.ak-cat{display:flex;justify-content:center;margin-top:2.4rem}

.ak-dock-wrap{position:relative;height:100px;width:100%;max-width:560px;margin:0 auto}
.ak-dock-wrap .dock-outer{margin:0;width:100%;justify-content:center}
.ak-dock-wrap .dock-panel{background:transparent;border:none;padding:0 .5rem;gap:.6rem}
.ak-dock-wrap .dock-item{background:${PANEL};border:1.5px solid ${LINE};color:${TEXT};box-shadow:0 8px 18px -10px #000}
.ak-dock-wrap .dock-item:hover,.ak-dock-wrap .dock-item:focus-visible{background:${RED};color:#fff;border-color:${RED}}
.ak-dock-wrap .dock-caption{color:${MUTE};font-family:${SANS};font-weight:600;font-size:.68rem;background:${PANEL};border:1px solid ${LINE}}

/* ---- name marquee (Askur's playful voice) ---- */
.ak-marquee{position:relative;overflow:hidden;border-top:1.5px solid ${LINE};border-bottom:1.5px solid ${LINE};
  background:${PANEL2};padding:1.1rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.ak-marquee-track{display:inline-flex;white-space:nowrap;will-change:transform;animation:akMarq 34s linear infinite}
.ak-marquee-item{display:inline-flex;align-items:center;font-family:${DISPLAY};font-weight:400;
  font-size:clamp(1.6rem,3.6vw,2.6rem);line-height:1;letter-spacing:.01em;color:transparent;
  -webkit-text-stroke:1px rgba(244,238,228,.55);text-transform:uppercase;padding:0 .2rem}
.ak-marquee-item i{font-style:normal;color:${RED};-webkit-text-stroke:0;margin:0 1.4rem;font-size:.7em}
@keyframes akMarq{to{transform:translateX(-50%)}}

/* ---- cinematic overhead grid (Ken Burns) ---- */
.ak-cinema{position:relative;height:min(80vh,760px);overflow:hidden;display:grid;place-items:center;isolation:isolate}
.ak-cinema-media{position:absolute;inset:-8%;z-index:-2;background-size:cover;background-position:center;
  will-change:transform;animation:akKen 26s ease-in-out infinite alternate}
@keyframes akKen{0%{transform:scale(1.06) translate3d(0,0,0)}100%{transform:scale(1.18) translate3d(-2.5%,-2.5%,0)}}
.ak-cinema-veil{position:absolute;inset:0;z-index:-1;
  background:radial-gradient(120% 90% at 50% 40%,rgba(20,18,16,.32),rgba(20,18,16,.86) 78%),linear-gradient(180deg,rgba(20,18,16,.5),rgba(20,18,16,.2) 40%,rgba(20,18,16,.9))}
.ak-cinema-copy{position:relative;text-align:center;padding:2rem;display:flex;flex-direction:column;align-items:center;gap:1.2rem}
.ak-kicker{font-family:${SANS};font-weight:700;font-size:.78rem;letter-spacing:.28em;text-transform:uppercase;color:${ORANGE};margin:0}
.ak-cinema-h{font-family:${DISPLAY};font-weight:400;font-size:clamp(3rem,9vw,7rem);line-height:.9;letter-spacing:-.02em;margin:0;color:#fff;
  text-shadow:0 10px 40px rgba(0,0,0,.6)}

/* ---- story band ---- */
.ak-band{background:${PANEL2};border-top:1.5px solid ${LINE};border-bottom:1.5px solid ${LINE}}
.ak-story{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(1.5rem,4vw,3.2rem);align-items:center}
.ak-story-media{display:block;overflow:hidden;border-radius:22px;border:1.5px solid ${LINE};box-shadow:0 24px 60px -30px #000}
.ak-story-media img{width:100%;height:100%;max-height:420px;object-fit:cover;display:block}
.ak-story-copy{display:flex;flex-direction:column;gap:1.1rem;align-items:flex-start}
.ak-award{display:inline-flex;flex-direction:column;padding:.7rem 1.3rem;border:1.5px dashed rgba(230,74,44,.55);border-radius:14px}
.ak-award-t{font-family:${DISPLAY};font-weight:400;color:${RED}}
.ak-award-s{font-size:.82rem;color:${MUTE}}

/* ---- taproom band ---- */
.ak-taproom{background:${INK};display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(1.5rem,4vw,3rem);align-items:start;
  border-top:1.5px solid ${LINE}}
.ak-taproom-lede{font-size:1.05rem;line-height:1.55;color:${MUTE};margin:1rem 0 1.6rem;max-width:34ch}
.ak-pkgs{display:grid;gap:1.2rem}
.ak-pkg{background:${PANEL};border:1.5px solid ${LINE};border-radius:18px;padding:1.3rem 1.4rem;box-shadow:0 18px 40px -26px #000}
.ak-pkg h3{font-family:${DISPLAY};font-weight:400;font-size:1.5rem;margin:0;color:${TEXT}}
.ak-pkg p{font-size:.9rem;line-height:1.45;color:${MUTE};margin:.4rem 0 .9rem}
.ak-rate{display:flex;justify-content:space-between;gap:1rem;padding:.5rem 0;border-top:1px solid ${LINE};font-size:.95rem;color:${TEXT}}
.ak-rate em{font-style:normal;color:${MUTE};font-size:.8rem}
.ak-rate-p{font-family:${DISPLAY};font-weight:400;color:${ORANGE};white-space:nowrap}

.ak-visit{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,3rem);align-items:center}
.ak-visit-cta{display:flex;gap:.8rem;margin-top:1.4rem;flex-wrap:wrap}
.ak-hours{border:1.5px solid ${LINE};border-radius:18px;overflow:clip;background:${PANEL}}
.ak-hour{display:flex;justify-content:space-between;gap:1rem;padding:.95rem 1.2rem;font-size:.98rem;border-bottom:1px solid ${LINE};color:${TEXT}}
.ak-hour:last-child{border-bottom:none}
.ak-hour span:first-child{color:${MUTE}}
.ak-hour span:last-child{font-weight:700}

.ak-footer{background:#0d0b09;color:${TEXT};padding:clamp(2.2rem,4vw,3rem) clamp(1.2rem,4vw,3.5rem);border-top:1.5px solid ${LINE}}
.ak-foot-top{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.ak-foot-logo{display:flex;align-items:center;height:46px}
.ak-foot-logo img{height:100%;width:auto;object-fit:contain}
.ak-foot-links{display:flex;gap:1.4rem;flex-wrap:wrap}
.ak-foot-links a{color:rgba(244,238,228,.68);text-decoration:none;font-size:.95rem}
.ak-foot-links a:hover{color:${TEXT}}
.ak-foot-bottom{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.8rem;padding-top:1.3rem;
  border-top:1px solid ${LINE};color:rgba(244,238,228,.42);font-size:.78rem}

/* ---- responsive ---- */
@media (max-width:860px){
  .ak-frame{max-width:calc(100vw - 1.2rem);margin:0 auto .6rem}
  .ak-bgwrap{display:none}
  .ak-cards,.ak-taproom,.ak-visit,.ak-story{grid-template-columns:1fr}
  .ak-story-media{order:-1}
  .ak-nav{gap:.5rem}
  .ak-pizza{width:min(85vw,385px)}
  .ak-sec-head{flex-direction:column;align-items:flex-start}
  .ak-cinema{height:min(70vh,560px)}
}
@media (max-width:520px){
  .ak-nav-grp{display:none}
  .ak-burger{display:flex}
  .ak-mbackdrop{display:block}
  .ak-mmenu{display:flex}
  .ak-badge{height:38px}
}
@media (prefers-reduced-motion:reduce){
  .ak-track{height:100svh}
  .ak-scrollcue,.ak-corner-slice{display:none}
  .ak-marquee-track,.ak-cinema-media{animation:none}
  .ak-hero-mid{transform:none;transition:none}
}
`
