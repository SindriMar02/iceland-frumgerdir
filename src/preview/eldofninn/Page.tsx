import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { Pizza, UtensilsCrossed, Tag, Coffee, CupSoda, Wine } from 'lucide-react'
import Dock from '../../components/Dock'
import EldofninnLoading from './Loading'
import { setThemeColor } from '../../lib/preview'
import { SndrBadge } from '../SndrBadge'
import {
  ORDER, PHONE_DISPLAY, PHONE_HREF, EMAIL, MAPS, SOCIAL, IMG, SLICE_GEO, SLICES, TRAVELLER_VEC, HERO_ORANGE,
  FEATURED, MENU_LINKS, HOURS, TRUCK, STORY, KAERLEIKS, AWARD, ADDRESS,
} from './data'

const Grainient = lazy(() => import('../../components/Grainient'))

/* Eldofninn - redesign prototype. CLONES the flatbakan redesign's exact template (same file
   structure, same pinned pizza-spin intro, same layout/CSS architecture) - per the brief, only
   fonts, logo, photography and copy/prices are re-skinned to this brand. The hero pizza asset
   (whole + 8 slices) is the SAME real Higgsfield-cut photo flatbakan uses, unchanged, because
   recreating an equivalent clean 8-wedge flatlay is real photography work this pass intentionally
   skips ("keep the 3D pizza image"). Live eldofninn.is ordering untouched: every Panta action
   deep-links to the real /panta/ flow. */

const CAT_ICON: Record<string, ReactNode> = {
  'Pizzur': <Pizza size={20} strokeWidth={1.8} />,
  'Meðlæti': <UtensilsCrossed size={20} strokeWidth={1.8} />,
  'Álegg': <Tag size={20} strokeWidth={1.8} />,
  'Kaffi': <Coffee size={20} strokeWidth={1.8} />,
  'Drykkir': <CupSoda size={20} strokeWidth={1.8} />,
  'Vín': <Wine size={20} strokeWidth={1.8} />,
}

const BASE = import.meta.env.BASE_URL

const CREAM = '#F3EBD8'
const INK = '#1C1712'
const CREAM_LT = '#FCF5E7'
const RED = '#C8371C'
const MUTE = 'rgba(28,23,18,0.6)'
const CHARCOAL = '#443C34'
// Exact solid orange the shared pizza asset is generated on - must not change (cutout seam).
const ORANGE = HERO_ORANGE

// Different brand faces from flatbakan's (which uses its own licensed HorndonBecker/Cabinet
// Grotesk) - both already self-hosted project-wide in public/fonts/, so no new font work needed.
// Tanker: a single bold, blocky weight - reads as a fire-oven/stamped pizzeria mark rather than
// flatbakan's softer serif display. Satoshi: a different, slightly warmer grotesk than Cabinet.
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
    <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})} className="eo-pill"
      style={{ background: isDark ? CHARCOAL : 'rgba(252,245,231,.9)', color: isDark ? CREAM_LT : INK, borderColor: INK }}>
      {children}
    </a>
  )
}

/* ============================================================== the page === */
export default function EldofninnPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pizzaRef = useRef<HTMLDivElement>(null)
  const pantaRef = useRef<HTMLAnchorElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // iOS safe-area handling - same fix as flatbakan (see that page's history): a NORMAL page, no
  // viewport-fit=cover, no fixed colour strips, no html/body background override. The fixed
  // ingredients backdrop (.eo-bgwrap) is hidden on phones so it can never define the bottom edge.
  useEffect(() => {
    document.title = 'Eldofninn — Ítölsk eldbökuð pizza í Reykjavík'
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Loading gate - identical strategy to flatbakan: stay up until fonts, hero+backdrop images,
  // logo, and the grain shader's first frame are ALL ready, then fade onto a fully-painted page.
  const GATE_KEYS = useMemo(() => ['fonts', 'hero', 'bg', 'logo', 'grain'] as const, [])
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
    warm(IMG.ingredientsBg, 'bg')
    warm(IMG.logoBadge, 'logo')
    SLICES.forEach((sl) => warm(sl.img))
    warm(IMG.slice)
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
    if (!assetsReady) { setThemeColor('#ffffff'); return }
    setThemeColor(ORANGE)
    const frame = rootRef.current?.querySelector('.eo-frame')
    if (!frame) return
    const io = new IntersectionObserver(
      ([e]) => setThemeColor(e.isIntersecting ? CREAM : ORANGE),
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

    let vh = 0, trackTop = 0, span = 1, S = 0, pcx = 0, pcy = 0, bcx = 0, btnTop = 0
    const measure = () => {
      vh = window.innerHeight || 800
      trackTop = track.offsetTop
      span = Math.max(1, track.offsetHeight - vh)
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
      (window as unknown as { __lenis?: Lenis; __eoMeasure?: () => void; __eoGeo?: unknown; __eoPhase?: () => Phase; __eoPlay?: () => void }).__lenis = lenis
      ;(window as unknown as { __eoMeasure?: () => void }).__eoMeasure = measure
      ;(window as unknown as { __eoGeo?: unknown }).__eoGeo = { get: () => ({ vh, trackTop, span, S, pcx, pcy, bcx, btnTop }) }
      ;(window as unknown as { __eoPhase?: () => Phase }).__eoPhase = () => phase
    }
    let lenisRaf = 0
    const loop = (time: number) => { lenis.raf(time); lenisRaf = requestAnimationFrame(loop) }
    lenisRaf = requestAnimationFrame(loop)

    const PLAY_MS = 3400
    let playRaf = 0
    let playStart = 0
    let releaseFailsafe = 0
    // Gesture-gap boost (per flatbakan's 2026-07-11 fix): a boost only counts after GESTURE_GAP of
    // input silence, since one real flick/drag streams momentum events for 1-2s - a plain
    // last-boost cooldown would runaway-accelerate on a single ordinary scroll.
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
    if (import.meta.env.DEV) (window as unknown as { __eoPlay?: () => void }).__eoPlay = () => onTrigger(new Event('debug', { cancelable: false }))

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
    <div ref={rootRef} className="eo-root" data-revealed={assetsReady ? '' : undefined} style={{ background: CREAM, color: INK, fontFamily: SANS }}>
      <style>{CSS}</style>

      {overlayMounted && <EldofninnLoading visible={!assetsReady} progress={loadProgress} />}

      <div className="eo-bgwrap" aria-hidden>
        <img ref={bgRef} src={IMG.ingredientsBg} alt="" className="eo-bgimg" draggable={false} />
      </div>

      {/* ================================================= pinned pizza opener */}
      <div ref={trackRef} className="eo-track">
        <div ref={stageRef} className="eo-stage-pin">
          <Suspense fallback={null}>
            <Grainient
              className="eo-grain-hero"
              color1="#F6B663" color2={ORANGE} color3="#C17D23"
              contrast={0.9} saturation={0.85} grainAmount={0.05} grainScale={2.2}
              warpAmplitude={20} warpFrequency={3} timeSpeed={0.08} zoom={1.1}
              maxDpr={1} fps={30}
              onReady={() => mark('grain')}
            />
          </Suspense>
          <header className="eo-nav">
            <div className="eo-nav-grp">
              <Pill href="#top" ext={false} active>Heim</Pill>
              <Pill href="#sagan" ext={false}>Um okkur</Pill>
            </div>
            <a href="#top" className="eo-badge"><img src={IMG.logoBadge} alt="Eldofninn" /></a>
            <div className="eo-nav-grp">
              <Pill href="#matsedill" ext={false}>Matseðill</Pill>
              <Pill href={ORDER} solid>Panta</Pill>
            </div>
            <button type="button" className="eo-burger" data-open={menuOpen} aria-expanded={menuOpen}
              aria-controls="eo-mmenu" aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              onClick={() => setMenuOpen((v) => !v)}>
              <span className="eo-burger-lines"><span /><span /><span /></span>
            </button>
          </header>
          <div className="eo-mbackdrop" data-open={menuOpen} aria-hidden onClick={() => setMenuOpen(false)} />
          <nav id="eo-mmenu" className="eo-mmenu" data-open={menuOpen} aria-label="Aðalvalmynd" aria-hidden={!menuOpen}>
            <a href="#top" onClick={() => setMenuOpen(false)}>Heim</a>
            <a href="#sagan" onClick={() => setMenuOpen(false)}>Um okkur</a>
            <a href="#matsedill" onClick={() => setMenuOpen(false)}>Matseðill</a>
            <a href={ORDER} target="_blank" rel="noreferrer" className="eo-mmenu-cta" onClick={() => setMenuOpen(false)}>Panta núna</a>
          </nav>

          <div className="eo-hero-mid">
            <div className="eo-hero-word" aria-hidden>ELDOFNINN</div>
            <div className="eo-hero-copy">
              <h1 className="eo-h1">Fáðu þér <span className="eo-sneid">sneið</span></h1>
              <p className="eo-lede">Ítölsk eldbökuð pizza í Grímsbæ.</p>
              <div className="eo-claim"><span className="eo-claim-star">★</span>Best geymda leyndarmál Reykjavíkur</div>
            </div>
            <div ref={pizzaRef} className="eo-pizza" aria-hidden>
              <div className="eo-glow" />
              <img src={IMG.whole} alt="" className="eo-layer eo-whole" draggable={false} />
              {SLICES.filter((sl) => !sl.traveller).map((sl) => (
                <img key={sl.img} src={sl.img} alt="" className="eo-layer eo-sl" draggable={false}
                  style={{ ['--ux' as string]: sl.ux, ['--uy' as string]: sl.uy }} />
              ))}
            </div>
          </div>

          <div className="eo-scrollcue" aria-hidden><span>Skrunaðu</span><i /></div>
        </div>
      </div>

      {/* ==================================================== the framed website */}
      <div className="eo-frame">
        {/* -------------------------------------------------------- matseðill */}
        <section id="matsedill" className="eo-sec">
          <div className="eo-sec-head">
            <Reveal><h2 className="eo-h2">Vinsælustu pizzurnar</h2></Reveal>
            <Reveal delay={80}><a href={ORDER} target="_blank" rel="noreferrer" className="eo-btn">Allur matseðillinn</a></Reveal>
          </div>
          <div className="eo-cards">
            {FEATURED.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article className="eo-card">
                  <div className="eo-card-img"><img src={p.img} alt={p.name} loading="lazy" width={520} height={390} />
                    {p.best && <span className="eo-tag">Best seller</span>}</div>
                  <div className="eo-card-body">
                    <div className="eo-card-top"><h3>{p.name}</h3><span className="eo-price">{p.price}<em> kr</em></span></div>
                    <p>{p.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="eo-cat eo-dock-wrap">
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

        {/* --------------------------------------------------------- sagan */}
        <section id="sagan" className="eo-sec eo-band">
          <div className="eo-story">
            <Reveal><h2 className="eo-h2">{STORY.heading}</h2></Reveal>
            <Reveal delay={70}><p className="eo-body">{STORY.body}</p></Reveal>
            <Reveal delay={130}>
              <div className="eo-award"><span className="eo-award-t">★ {AWARD.title}</span><span className="eo-award-s">{AWARD.sub}</span></div>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------- italskt kaffi */}
        <section id="kaffi" className="eo-sec eo-truck">
          <div className="eo-truck-head">
            <Reveal><h2 className="eo-h2" style={{ color: CREAM_LT }}>Ítalskt kaffi</h2></Reveal>
            <Reveal delay={70}><p className="eo-truck-lede">{TRUCK.intro}</p></Reveal>
            <Reveal delay={120}><a href={`mailto:${EMAIL}?subject=Fyrirspurn um kaffi`} className="eo-btn eo-btn-cream">Senda fyrirspurn</a></Reveal>
          </div>
          <div className="eo-pkgs">
            {TRUCK.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 70}>
                <div className="eo-pkg">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.line}</p>
                  {pkg.rates.map((r) => (
                    <div key={r.label} className="eo-rate"><span>{r.label} <em>{r.sub}</em></span><span className="eo-rate-p">{r.price} kr</span></div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- visit / hours */}
        <section id="stadur" className="eo-sec">
          <div className="eo-visit">
            <div>
              <Reveal><h2 className="eo-h2">{ADDRESS.street}</h2></Reveal>
              <Reveal delay={60}><p className="eo-body" style={{ marginTop: '.3rem' }}>{ADDRESS.town}. {KAERLEIKS.body}</p></Reveal>
              <Reveal delay={120}><div className="eo-visit-cta">
                <a href={MAPS} target="_blank" rel="noreferrer" className="eo-btn">Sjá á korti</a>
                <a href={PHONE_HREF} className="eo-chip">{PHONE_DISPLAY}</a>
              </div></Reveal>
            </div>
            <Reveal delay={60}><div className="eo-hours">
              {HOURS.map((h) => (<div key={h.day} className="eo-hour"><span>{h.day}</span><span>{h.time}</span></div>))}
            </div></Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- footer */}
        <footer className="eo-footer">
          <div className="eo-foot-top">
            <a href="#top" className="eo-badge eo-badge-sm"><img src={IMG.logoBadge} alt="Eldofninn" /></a>
            <div className="eo-foot-links">
              <a href={MAPS} target="_blank" rel="noreferrer">{ADDRESS.street}</a>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="eo-foot-bottom">
            <span>Frumgerð í hönnun, sýnishorn, ekki opinber vefur Eldofninn.</span>
            <span>Pantanir keyra á eldofninn.is</span>
          </div>
          <div className="eo-foot-bottom">
            <SndrBadge dark />
          </div>
        </footer>
      </div>

      <img src={IMG.slice} alt="" className="eo-slice" draggable={false} aria-hidden />

      <a ref={pantaRef} href={ORDER} target="_blank" rel="noreferrer" className="eo-sticky-panta" aria-label="Panta núna">
        <span>Panta núna</span>
        <img src={IMG.slice} alt="" className="eo-corner-slice" draggable={false} aria-hidden />
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
.eo-root{position:relative;min-height:100vh;overflow-x:clip}

.eo-bgwrap{position:fixed;inset:-24px;z-index:0;overflow:hidden;pointer-events:none}
.eo-bgimg{width:100%;height:100%;object-fit:cover;display:block;will-change:transform}

/* ---- hero opener (NORMAL FLOW) - same architecture as flatbakan's fixed version: relative, not
   sticky, so it can never re-trigger iOS's URL-bar dead-band bug. ---- */
.eo-track{position:relative;z-index:2;height:100svh}
.eo-stage-pin{position:relative;height:100svh;overflow:hidden;background:${ORANGE};
  display:flex;flex-direction:column;padding:clamp(1rem,2.4vw,1.8rem) clamp(1rem,3vw,2.4rem) clamp(1.4rem,3vw,2.2rem)}
.eo-grain-hero{position:absolute;inset:0;z-index:0;pointer-events:none}

.eo-nav{position:relative;z-index:6;width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.eo-nav-grp{display:flex;gap:.6rem}
.eo-badge{width:64px;height:64px;border-radius:50%;background:${INK};display:flex;align-items:center;justify-content:center;
  flex:0 0 auto;box-shadow:0 8px 20px -8px rgba(28,18,8,.55)}
.eo-badge img{width:80%;height:80%;object-fit:contain;filter:brightness(0) invert(1)}
.eo-nav .eo-badge{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}

.eo-burger{display:none;position:relative;z-index:8;width:44px;height:44px;flex:0 0 auto;padding:0;
  align-items:center;justify-content:center;background:${CREAM_LT};border:1.5px solid ${INK};
  border-radius:50%;box-shadow:2px 2px 0 ${INK};cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
.eo-burger:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.eo-burger:active{transform:translate(0,0);box-shadow:1px 1px 0 ${INK}}
.eo-burger-lines{position:relative;width:18px;height:13px}
.eo-burger-lines span{position:absolute;left:0;width:100%;height:2px;border-radius:2px;background:${INK};
  transition:top .3s cubic-bezier(.65,0,.35,1),transform .3s cubic-bezier(.65,0,.35,1),opacity .2s ease}
.eo-burger-lines span:nth-child(1){top:0}
.eo-burger-lines span:nth-child(2){top:5.5px}
.eo-burger-lines span:nth-child(3){top:11px}
.eo-burger[data-open="true"] .eo-burger-lines span:nth-child(1){top:5.5px;transform:rotate(45deg)}
.eo-burger[data-open="true"] .eo-burger-lines span:nth-child(2){opacity:0;transform:scaleX(0)}
.eo-burger[data-open="true"] .eo-burger-lines span:nth-child(3){top:5.5px;transform:rotate(-45deg)}

.eo-mbackdrop{display:none;position:fixed;inset:0;z-index:59;background:rgba(28,18,8,.28);
  opacity:0;pointer-events:none;transition:opacity .3s ease}
.eo-mbackdrop[data-open="true"]{opacity:1;pointer-events:auto}

.eo-mmenu{display:none;position:fixed;left:clamp(1rem,3vw,2.4rem);right:clamp(1rem,3vw,2.4rem);
  top:calc(clamp(1rem,2.4vw,1.8rem) + 64px + .6rem);z-index:60;flex-direction:column;gap:.35rem;
  padding:.7rem;background:${CREAM_LT};border:2px solid ${INK};border-radius:20px;box-shadow:5px 5px 0 ${INK};
  clip-path:inset(0 0 100% 0 round 20px);transform:translateY(-6px);opacity:0;pointer-events:none;
  transition:clip-path .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1),opacity .28s ease}
.eo-mmenu[data-open="true"]{clip-path:inset(0 0 0% 0 round 20px);transform:none;opacity:1;pointer-events:auto}
.eo-mmenu a{font-family:${SANS};font-weight:700;font-size:1.05rem;color:${INK};text-decoration:none;
  padding:.75rem .9rem;border-radius:12px;opacity:0;transform:translateY(-8px);
  transition:background .15s ease,opacity .38s ease .1s,transform .38s cubic-bezier(.22,1,.36,1) .1s}
.eo-mmenu a:active{background:rgba(28,18,8,.07)}
.eo-mmenu[data-open="true"] a{opacity:1;transform:none}
.eo-mmenu[data-open="true"] a:nth-child(1){transition-delay:.06s}
.eo-mmenu[data-open="true"] a:nth-child(2){transition-delay:.11s}
.eo-mmenu[data-open="true"] a:nth-child(3){transition-delay:.16s}
.eo-mmenu[data-open="true"] a:nth-child(4){transition-delay:.21s}
.eo-mmenu a.eo-mmenu-cta{background:${RED};color:${CREAM_LT};text-align:center;margin-top:.15rem;
  font-weight:700;text-transform:uppercase;letter-spacing:.03em;font-size:.92rem}

.eo-hero-mid{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;min-height:0;
  transform:scale(1.05);transform-origin:50% 42%;transition:transform 1.05s cubic-bezier(.16,.72,.12,1);will-change:transform}
.eo-root[data-revealed] .eo-hero-mid{transform:none}
.eo-hero-word{position:absolute;top:58%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none;
  font-family:${DISPLAY};font-weight:400;font-size:clamp(5.5rem,21vw,19rem);line-height:1;color:rgba(150,80,6,.20);
  letter-spacing:.01em;white-space:nowrap;text-transform:uppercase}
.eo-hero-copy{position:relative;z-index:3;text-align:center;pointer-events:none;margin-top:clamp(.6rem,3vh,2.4rem)}
.eo-h1{font-family:${DISPLAY};font-weight:400;font-size:clamp(2.4rem,6vw,4.6rem);line-height:.92;letter-spacing:-.02em;margin:0;color:${INK}}
.eo-sneid{font-family:${DISPLAY};font-style:italic;font-weight:400;font-size:1.15em;line-height:1.3;
  display:inline-block;transform:rotate(-3deg);color:${RED};
  text-shadow:0 1px 0 rgba(28,17,8,.55),0 3px 16px rgba(28,17,8,.3)}
.eo-lede{font-size:clamp(1rem,1.4vw,1.16rem);line-height:1.5;color:rgba(28,18,8,.82);max-width:40ch;margin:.85rem auto 0}
.eo-claim{display:inline-flex;align-items:center;gap:.4rem;margin-top:.9rem;padding:.5rem 1.15rem;
  background:${CREAM_LT};border:1.5px dashed ${RED};border-radius:999px;transform:rotate(-1.5deg);
  font-family:${DISPLAY};font-weight:400;font-size:.82rem;letter-spacing:.03em;text-transform:uppercase;
  color:${RED};box-shadow:0 8px 18px -10px rgba(28,18,8,.45)}
.eo-claim-star{font-size:.85em;line-height:1}

.eo-pizza{position:relative;width:min(60vw,465px,max(220px,calc(100svh - 26rem)));aspect-ratio:1;margin:auto;
  transform:rotate(calc(var(--spin,0)*1deg));transform-origin:50% 50%;z-index:2;will-change:transform}
.eo-glow{position:absolute;left:50%;top:52%;width:82%;height:82%;transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(120,60,0,.26),rgba(120,60,0,0) 66%);filter:blur(4px)}
.eo-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 12px 18px rgba(90,45,0,.30))}
.eo-whole{opacity:calc(1 - var(--cut,0))}
.eo-sl{opacity:var(--cut,0);will-change:transform;
  transform:translate(calc(var(--ux,0) * var(--spread,0px)),calc(var(--uy,0) * var(--spread,0px)))}

.eo-slice{position:fixed;left:0;top:0;z-index:55;width:var(--slw,180px);height:auto;pointer-events:none;
  opacity:calc(var(--cut,0) * (1 - var(--armed,0)));will-change:transform;
  transform:translate(var(--slx,0),var(--sly,0)) translate(-50%,-50%) rotate(var(--slr,0));
  filter:drop-shadow(0 16px 24px rgba(90,45,0,.42))}

.eo-scrollcue{position:absolute;left:clamp(1rem,3vw,2.4rem);bottom:clamp(1rem,2.4vw,1.6rem);z-index:4;display:flex;flex-direction:column;
  align-items:flex-start;gap:.4rem;color:rgba(28,18,8,.5);font-family:${SANS};font-weight:600;font-size:.7rem;text-transform:uppercase;
  letter-spacing:.14em;opacity:calc(1 - var(--seq,0)*6);pointer-events:none}
.eo-scrollcue i{width:1px;height:26px;background:rgba(28,18,8,.4);animation:eocue 1.7s ease-in-out infinite}
@keyframes eocue{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.3}50%{transform:scaleY(1);opacity:.8}}

.eo-pill{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.86rem;
  padding:.5rem 1.05rem;border:1.5px solid ${INK};border-radius:999px;text-decoration:none;white-space:nowrap;
  box-shadow:2px 2px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease}
.eo-pill:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.eo-btn{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.92rem;
  padding:.8rem 1.5rem;border:2px solid ${INK};border-radius:999px;background:${RED};color:${CREAM_LT};
  text-decoration:none;box-shadow:3px 3px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease}
.eo-btn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 ${INK}}
.eo-btn-cream{background:${CREAM_LT};color:${INK}}
.eo-chip{display:inline-flex;align-items:center;font-family:${SANS};font-weight:600;font-size:.9rem;
  padding:.6rem 1.15rem;border:1.5px solid ${INK};border-radius:999px;background:transparent;color:${INK};
  text-decoration:none;transition:background .15s,color .15s}
.eo-chip:hover{background:${INK};color:${CREAM_LT}}

.eo-sticky-panta{position:fixed;z-index:50;right:clamp(.9rem,2.4vw,1.6rem);bottom:clamp(.9rem,2.4vw,1.5rem);
  display:inline-flex;align-items:center;justify-content:center;
  background:${RED};color:${CREAM_LT};font-family:${SANS};font-weight:700;text-transform:uppercase;letter-spacing:.05em;
  font-size:.82rem;padding:.85rem 1.4rem;border-radius:14px;border:2px solid ${INK};box-shadow:3px 3px 0 ${INK};
  text-decoration:none;transition:box-shadow .18s ease,transform .18s ease}
.eo-sticky-panta:hover{box-shadow:5px 5px 0 ${INK};transform:translate(-2px,-2px)}
.eo-corner-slice{position:absolute;left:50%;top:-67px;width:56px;height:auto;pointer-events:none;
  opacity:var(--armed,0);filter:drop-shadow(0 8px 14px rgba(90,45,0,.4));
  animation:eoCornerIdle 6s ease-in-out infinite}
@keyframes eoCornerIdle{
  0%,100%{transform:translateX(-50%) rotate(-6deg) translateY(0)}
  50%{transform:translateX(-50%) rotate(3deg) translateY(-3px)}
}

.eo-frame{position:relative;z-index:1;max-width:min(1360px,90vw);margin:0 auto clamp(.9rem,2vw,1.6rem);background:${CREAM};
  border:9px solid ${INK};border-radius:clamp(24px,3vw,40px);overflow:clip;box-shadow:0 40px 90px -50px rgba(28,18,8,.6)}
.eo-h2{font-family:${DISPLAY};font-weight:400;font-size:clamp(1.9rem,3.6vw,3rem);line-height:.98;letter-spacing:-.015em;margin:0}
.eo-body{font-size:1.04rem;line-height:1.6;color:${MUTE};max-width:56ch}

.eo-sec{padding:clamp(3rem,6vw,5.5rem) clamp(1.2rem,4vw,3.5rem)}
.eo-sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1.5rem;flex-wrap:wrap;margin-bottom:2.2rem}
.eo-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:.85rem}
.eo-cards>div{display:flex}
.eo-card{display:flex;flex-direction:column;width:100%;background:${CREAM_LT};border:2px solid ${INK};border-radius:22px;overflow:clip;box-shadow:5px 5px 0 ${INK};
  transition:transform .18s ease,box-shadow .18s ease}
.eo-card:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 ${INK}}
.eo-card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:${CREAM};flex:none}
.eo-card-img img{width:100%;height:100%;object-fit:cover;display:block}
.eo-tag{position:absolute;top:.8rem;left:.8rem;background:${RED};color:${CREAM_LT};font-family:${SANS};font-weight:700;
  font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;padding:.32rem .7rem;border-radius:999px;border:1.5px solid ${INK}}
.eo-card-body{display:flex;flex-direction:column;flex:1;padding:1.2rem 1.3rem 1.4rem}
.eo-card-top{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
.eo-card-top h3{font-family:${DISPLAY};font-weight:400;font-size:1.4rem;margin:0;letter-spacing:-.01em}
.eo-price{font-family:${DISPLAY};font-weight:400;font-size:1.3rem;color:${RED};white-space:nowrap}
.eo-price em{font-family:${SANS};font-size:.62em;font-style:normal;color:${MUTE}}
.eo-card-body p{font-size:.9rem;line-height:1.45;color:${MUTE};margin:.5rem 0 0;min-height:2.9em;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden}
.eo-cat{display:flex;justify-content:center;margin-top:2.4rem}

.eo-dock-wrap{position:relative;height:100px;width:100%;max-width:520px;margin:0 auto}
.eo-dock-wrap .dock-outer{margin:0;width:100%;justify-content:center}
.eo-dock-wrap .dock-panel{background:transparent;border:none;padding:0 .5rem;gap:.6rem}
.eo-dock-wrap .dock-item{background:${CREAM_LT};border:1.5px solid ${INK};color:${INK};box-shadow:2px 2px 0 ${INK}}
.eo-dock-wrap .dock-item:hover,.eo-dock-wrap .dock-item:focus-visible{background:${RED};color:${CREAM_LT}}
.eo-dock-wrap .dock-caption{color:${MUTE};font-family:${SANS};font-weight:600;font-size:.68rem}

.eo-band{background:${CREAM_LT};border-top:2px solid ${INK};border-bottom:2px solid ${INK}}
.eo-story{max-width:760px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.2rem}
.eo-award{display:inline-flex;flex-direction:column;padding:.7rem 1.3rem;border:1.5px dashed ${RED};border-radius:14px}
.eo-award-t{font-family:${DISPLAY};font-weight:400;color:${RED}}
.eo-award-s{font-size:.82rem;color:${MUTE}}

.eo-truck{background:${ORANGE};border-top:2px solid ${INK};border-bottom:2px solid ${INK};
  display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(1.5rem,4vw,3rem);align-items:start}
.eo-truck-lede{font-size:1.05rem;line-height:1.5;color:rgba(28,18,8,.82);margin:1rem 0 1.6rem;max-width:32ch}
.eo-pkgs{display:grid;gap:1.2rem}
.eo-pkg{background:${CREAM_LT};border:2px solid ${INK};border-radius:18px;padding:1.3rem 1.4rem;box-shadow:4px 4px 0 ${INK}}
.eo-pkg h3{font-family:${DISPLAY};font-weight:400;font-size:1.5rem;margin:0}
.eo-pkg p{font-size:.9rem;line-height:1.4;color:${MUTE};margin:.4rem 0 .9rem}
.eo-rate{display:flex;justify-content:space-between;gap:1rem;padding:.5rem 0;border-top:1px solid rgba(28,23,18,.14);font-size:.95rem}
.eo-rate em{font-style:normal;color:${MUTE};font-size:.8rem}
.eo-rate-p{font-family:${DISPLAY};font-weight:400;color:${RED};white-space:nowrap}

.eo-visit{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,3rem);align-items:center}
.eo-visit-cta{display:flex;gap:.8rem;margin-top:1.4rem;flex-wrap:wrap}
.eo-hours{border:2px solid ${INK};border-radius:18px;overflow:clip}
.eo-hour{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 1.2rem;font-size:.98rem;border-bottom:1px solid rgba(28,23,18,.12)}
.eo-hour:last-child{border-bottom:none}
.eo-hour span:first-child{color:${MUTE}}
.eo-hour span:last-child{font-weight:700}

.eo-footer{background:${INK};color:${CREAM_LT};padding:clamp(2.2rem,4vw,3rem) clamp(1.2rem,4vw,3.5rem)}
.eo-foot-top{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.eo-badge-sm{width:54px;height:54px;background:${CREAM_LT}}
.eo-badge-sm img{filter:none}
.eo-foot-links{display:flex;gap:1.4rem;flex-wrap:wrap}
.eo-foot-links a{color:rgba(252,245,231,.72);text-decoration:none;font-size:.95rem}
.eo-foot-links a:hover{color:${CREAM_LT}}
.eo-foot-bottom{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.8rem;padding-top:1.3rem;
  border-top:1px solid rgba(252,245,231,.16);color:rgba(252,245,231,.5);font-size:.78rem}

/* ---- responsive ---- */
@media (max-width:860px){
  .eo-frame{max-width:calc(100vw - 1.2rem);margin:0 auto .6rem;border-width:6px}
  .eo-bgwrap{display:none}
  .eo-cards,.eo-truck,.eo-visit{grid-template-columns:1fr}
  .eo-nav{gap:.5rem}
  .eo-pizza{width:min(85vw,385px)}
  .eo-sec-head{flex-direction:column;align-items:flex-start}
}
@media (max-width:520px){
  .eo-nav-grp{display:none}
  .eo-burger{display:flex}
  .eo-mbackdrop{display:block}
  .eo-mmenu{display:flex}
}
@media (prefers-reduced-motion:reduce){
  .eo-track{height:100svh}
  .eo-scrollcue{display:none}
  .eo-corner-slice{animation:none}
  .eo-hero-mid{transform:none;transition:none}
}
`
