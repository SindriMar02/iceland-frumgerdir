import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { Percent, Pizza, Leaf, UtensilsCrossed, CupSoda, Gift, Tag } from 'lucide-react'
import Dock from '../../components/Dock'
import FlatbakanLoading from './Loading'
import { setThemeColor } from '../../lib/preview'
import {
  ORDER, PHONE_DISPLAY, PHONE_HREF, EMAIL, MAPS, SOCIAL, IMG, SLICE_GEO, SLICES, TRAVELLER_VEC, HERO_ORANGE,
  FEATURED, MENU_LINKS, HOURS, TRUCK, STORY, KAERLEIKS, AWARD, ADDRESS,
} from './data'

const Grainient = lazy(() => import('../../components/Grainient'))

/* Flatbakan - redesign prototype.
   OPENER: a full-bleed orange stage that PINS while you scroll. The real Higgsfield pizza starts
   whole, spins one slow turn and cross-fades into its spaced 8-slice self, then the bottom slice
   detaches and rides down into the corner order CTA. The page does not advance until that
   sequence completes. It then releases into the framed cream "magazine" site. A real photo of
   scattered pizza ingredients sits fixed behind everything, blurred, drifting gently with the
   pointer. Live upsell.is ordering untouched: every Panta action deep-links to the real /order. */

// Icelandic category label -> icon, for the Dock-style matseðill category row
const CAT_ICON: Record<string, ReactNode> = {
  'Tilboð': <Percent size={20} strokeWidth={1.8} />,
  'Bökur': <Pizza size={20} strokeWidth={1.8} />,
  'Vegan': <Leaf size={20} strokeWidth={1.8} />,
  'Meðlæti': <UtensilsCrossed size={20} strokeWidth={1.8} />,
  'Drykkir': <CupSoda size={20} strokeWidth={1.8} />,
  'Gjafabréf': <Gift size={20} strokeWidth={1.8} />,
}

const BASE = import.meta.env.BASE_URL

const CREAM = '#F3EBD8'
const INK = '#1C1712'
const CREAM_LT = '#FCF5E7'
const RED = '#C8371C'
const MUTE = 'rgba(28,23,18,0.6)'
// The solid nav pills (Heim/Panta) sit on a hard offset box-shadow drawn in INK for the "sticker"
// 3D pop used throughout this page - filling the pill with that SAME ink made the fill and its own
// shadow indistinguishable, so the offset read as a flat, edgeless black blob instead of a raised
// button. A visibly lighter dark grey keeps the "solid/dark" pill variant but restores the edge.
const CHARCOAL = '#443C34'
// Exact solid orange both pizza images are generated on, so the cutouts have no seam.
const ORANGE = HERO_ORANGE

// The studio's own licensed display face, self-hosted from flatbakan.is (public/fonts/flatbakan) -
// matches the real site's h1/h2 headline type exactly, weight 400 only (no bold cut exists, so
// headline hierarchy comes from size, same as the source site - see the font-weight:400 below).
const DISPLAY = "'HorndonBecker', Georgia, serif"
const SANS = "'CabinetGrotesk-Variable', 'CabinetGrotesk-Regular', system-ui, sans-serif"

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
    <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})} className="fb-pill"
      style={{ background: isDark ? CHARCOAL : 'rgba(252,245,231,.9)', color: isDark ? CREAM_LT : INK, borderColor: INK }}>
      {children}
    </a>
  )
}

/* ============================================================== the page === */
export default function FlatbakanPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pizzaRef = useRef<HTMLDivElement>(null)
  const pantaRef = useRef<HTMLAnchorElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Every other prototype in this repo sets its own title + mobile-browser-chrome tint on mount
  // (see lib/preview.ts) - flatbakan had neither, so in-app browsers (Mail, etc.) fell back to
  // sampling the page's own rendered colour for their toolbar tint, which is the hero's ORANGE for
  // as long as .fb-stage-pin is pinned/near the top - and then stayed stuck on that colour even once
  // scrolled well past it into the cream-framed site. Setting an explicit theme-color pins the
  // chrome to the site's actual dominant background instead of an arbitrary sampled one.
  useEffect(() => {
    document.title = 'Flatbakan — Steinbökuð súrdeigspizza í Kópavogi'
    setThemeColor(CREAM)
  }, [])

  // close the mobile menu on Escape; scoped to only listen while it's actually open
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Loading gate. The overlay stays up until EVERYTHING a visitor sees the instant they land is
  // genuinely ready - not just this component's JS chunk. Landing on a half-warmed page is what
  // caused the residual "glitch": the self-hosted brand fonts (only discovered once this component
  // renders - the index.html Fontshare preload registers different family names), the hero pizza +
  // fixed ingredient backdrop images, the logo, AND the lazy WebGL grain shader's first painted
  // frame all resolve at slightly different times, so revealing on the earliest of them let the
  // rest pop/swap in afterwards. Gating on ALL of them means the reveal is a fade onto a page
  // that's already 100% painted - nothing left to load into view. The 8 explode slices are warmed
  // too (so the scroll sequence can't hitch on an undecoded image) but do NOT gate the reveal:
  // they're offscreen until the user scrolls, so decoding them shouldn't delay landing.
  // GRAIN_KEY readiness is signalled by <Grainient onReady>. Own state/effect, fully decoupled
  // from the scroll-driving effect below.
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
    // non-blocking: warm the explode slices + traveller so the spin sequence never hits an
    // undecoded image, but don't hold the reveal on them (they're offscreen until scroll)
    SLICES.forEach((sl) => warm(sl.img))
    warm(IMG.slice)
    // never trap a visitor behind the loader if a resource (or the WebGL context) stalls
    const failsafe = window.setTimeout(() => { if (alive) setForced(true) }, 4500)
    return () => { alive = false; window.clearTimeout(failsafe) }
  }, [mark])

  // Fully UNMOUNT the loading overlay a beat after it finishes fading out. Left mounted at
  // opacity:0 (the old behaviour), its pulsing glow + ring + badge keep running their CSS
  // animations forever - continuous compositor work behind the live site for a fully invisible
  // element. That lingering cost is a real source of the "lag after landing"; removing the node
  // stops it dead. Delay covers the .62s fade with margin.
  const [overlayMounted, setOverlayMounted] = useState(true)
  useEffect(() => {
    if (!assetsReady) return
    const t = window.setTimeout(() => setOverlayMounted(false), 780)
    return () => window.clearTimeout(t)
  }, [assetsReady])

  // the fixed ingredients backdrop drifts gently with the pointer - the scattered toppings shift a
  // touch as you move the mouse. It shows through the side gutters of the centred .fb-frame across
  // the whole menu/story/footer, so it's on screen for most of the visit.
  useEffect(() => {
    const el = bgRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const AMOUNT = 18                    // < the .fb-bgwrap -24px inset, so the drift never bares an edge
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
    // Only pause for a genuinely hidden tab. (The previous version also gated on the HERO being on
    // screen, which was backwards: during the hero the backdrop is hidden behind the opaque orange
    // stage, and once you scroll into the framed section - where the backdrop actually shows - that
    // gate PAUSED the drift. So the pointer parallax was effectively never visible. Fixed.)
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

    // sub-phase windows across the pinned sequence (seq 0..1)
    const SPIN_A = 0.06, SPIN_B = 0.52     // one slow eased turn
    const CUT_A = 0.12, CUT_B = 0.30       // whole dissolves into the assembled slices
    const SPREAD_A = 0.30, SPREAD_B = 0.54 // the 8 slices fan apart (the "spaced out" moment)
    const SEP_A = 0.56, SEP_B = 0.94       // the bottom slice detaches and rides to the CTA
    const TURNS = 360                      // degrees of spin
    const SPREAD_MAX = 0.10                // peak radial spread of the fast fan-out, as a fraction of pizza width
    const DRIFT_MAX = 0.06                 // extra slow continued drift added AFTER the fan-out, same units

    // Cached layout geometry - constant for the ENTIRE pinned sequence, so we read it here (mount +
    // resize) instead of every scroll frame. Reading it per-frame (as the original did) forces a
    // synchronous style/layout flush on every tick because the previous frame's setProperty calls
    // just dirtied the tree - measured ~1ms/call here (~200x the cost of the same reads with no
    // pending writes). place()/update() below never read the DOM, only write.
    //
    // CRITICAL: the pizza centre is cached RELATIVE TO THE STICKY STAGE (subtract the stage's own
    // rect), NOT as a viewport-absolute coordinate. Both rects scroll together so their difference
    // is constant AND equals the pizza's on-screen position while the stage is pinned at top:0 -
    // making this correct no matter what scroll position measure() runs at. Caching the raw
    // viewport centre was a bug: measure() also fires on `resize`, and a mobile URL-bar collapse
    // fires one mid-scroll, which cached the pizza's scrolled-away (negative) Y and launched the
    // traveller slice from far above the screen ("dropping from the sky"). panta is position:fixed
    // so its rect is already viewport-stable.
    let vh = 0, trackTop = 0, span = 1, S = 0, pcx = 0, pcy = 0, bcx = 0, btnTop = 0
    const measure = () => {
      vh = window.innerHeight || 800
      trackTop = track.offsetTop
      span = Math.max(1, track.offsetHeight - vh)
      const pr = pizza.getBoundingClientRect()
      const sr = stage.getBoundingClientRect()
      const br = panta.getBoundingClientRect()
      S = pizza.offsetWidth                                  // true diameter (rotation-invariant)
      pcx = (pr.left + pr.right) / 2 - sr.left               // pizza centre relative to the pinned stage
      pcy = (pr.top + pr.bottom) / 2 - sr.top
      bcx = br.left + br.width / 2
      btnTop = br.top
    }
    measure()

    const place = (seq: number) => {
      const spin = easeIO(clamp((seq - SPIN_A) / (SPIN_B - SPIN_A))) * TURNS
      const cut = clamp((seq - CUT_A) / (CUT_B - CUT_A))
      const spread = easeOut(clamp((seq - SPREAD_A) / (SPREAD_B - SPREAD_A)))
      // once fanned out, the pieces don't freeze - they keep drifting apart very slowly for the
      // REST of the scroll (linear, not eased - a steady ambient continuation, not another "event"),
      // independently of the traveller's own journey toward the corner button
      const drift = clamp((seq - SPREAD_B) / (1 - SPREAD_B))
      const sep = easeIO(clamp((seq - SEP_A) / (SEP_B - SEP_A)))

      // slice geometry - the traveller is `position:fixed` (viewport-relative, rendered as a root
      // sibling so it can never be trapped in a lower stacking context than the corner button), so
      // every coordinate here is plain viewport px - no stage-local conversion needed. S/pcx/pcy/
      // bcx/btnTop come from measure() above, not read here (see comment there).
      const spr = (spread * SPREAD_MAX + drift * DRIFT_MAX) * S
      s.setProperty('--spin', spin.toFixed(2))
      s.setProperty('--cut', cut.toFixed(3))
      s.setProperty('--spread', spr.toFixed(1) + 'px')       // drives the 7 CSS slices
      const ang = spin * Math.PI / 180
      const vx = SLICE_GEO.cx * S + TRAVELLER_VEC.ux * spr   // traveller fans out with the others...
      const vy = SLICE_GEO.cy * S + TRAVELLER_VEC.uy * spr
      const natX = pcx + (vx * Math.cos(ang) - vy * Math.sin(ang))
      const natY = pcy + (vx * Math.sin(ang) + vy * Math.cos(ang))
      // the corner button is small and fixed bottom-right - the slice shrinks to a garnish that
      // rests ABOVE it (only a small overlap onto the button's top edge, never covering the label).
      // wDrop/OVERLAP must match .fb-corner-slice's CSS exactly, so the JS flight ends EXACTLY where
      // the static idle-animated garnish sits - no jump at the handoff.
      const wPizza = SLICE_GEO.w * S
      const wDrop = 56
      const hDrop = wDrop / 0.689                           // slice crop aspect (326x473)
      const OVERLAP = 14                                    // px the garnish dips onto the button
      const tgtY = btnTop + OVERLAP - hDrop / 2              // slice CENTER (translate(-50%,-50%))
      s.setProperty('--slx', lerp(natX, bcx, sep).toFixed(1) + 'px')
      s.setProperty('--sly', lerp(natY, tgtY, sep).toFixed(1) + 'px')
      s.setProperty('--slw', lerp(wPizza, wDrop, sep).toFixed(1) + 'px')
      s.setProperty('--slr', lerp(spin, -6, sep).toFixed(1) + 'deg')
      // continuous crossfade to the static landed garnish - NOT a binary switch, so the flying
      // slice's fade-out and the static garnish's fade-in move in perfect lockstep, same value,
      // same frame, no flash/gap between them. Based on seq (not sep) so the fade has its own
      // clear, gradual window - ends just after SEP_B, once sep has truly settled at 1 (matching
      // the static garnish's position exactly) so the tail of the dissolve is pixel-perfect.
      const ARMED_A = 0.85, ARMED_B = 0.97
      const armed = easeIO(clamp((seq - ARMED_A) / (ARMED_B - ARMED_A)))
      s.setProperty('--armed', armed.toFixed(3))
    }

    // reduced motion: no pin, no spin - a clean, still, intact hero, corner CTA always visible
    if (reduce) { track.style.height = '100svh'; place(0); return }
    place(0)
    s.setProperty('--seq', '0.000')

    // ---- one-flick autoplay -------------------------------------------------------------
    // A 240svh scroll-scrubbed sequence necessarily "halts" between individual wheel flicks -
    // momentum always decays to zero between gestures, no matter how Lenis is tuned, because the
    // whole point of a scrub is that physical scroll distance IS the timeline. Instead: the first
    // scroll/swipe input is captured as a TRIGGER (not applied to the page), which plays the whole
    // spin->cut->spread->separate sequence as one autonomous, time-driven rAF tween - genuinely
    // continuous, not stitched from scroll deltas. Real scrolling stays fully locked (lenis.stop()
    // reliably preventDefaults wheel+touch - confirmed against the installed Lenis source, both
    // event types share one handler gated on isStopped) until the tween finishes, then the real
    // scroll position is snapped to match the now-fully-played visual state and normal scrolling
    // hands off exactly where the animation left - so the very next scroll moves the actual page.
    type Phase = 'idle' | 'playing' | 'released'
    let phase: Phase = 'idle'
    // Recompute cached geometry on resize (matters only before the intro is triggered; the trigger
    // re-measures too). There is deliberately NO scroll-linked "update" - the intro is autonomous
    // and time-driven, then frozen; the finished sequence is never re-driven by scroll position.
    const onResize = () => { measure() }

    // duration matches the repo's other Lenis pages (bofs 1.1, reykjavikdistillery 1.15) - this
    // page was an outlier at 1.3s, which reads as extra input lag on top of trackpad momentum.
    const lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    if (import.meta.env.DEV) {
      // debug-only: bypass the rAF-batched onTick for direct/synchronous verification (harness
      // preview tabs throttle rAF unreliably - see redesign-playbook memory)
      (window as unknown as { __lenis?: Lenis; __fbMeasure?: () => void; __fbGeo?: unknown; __fbPhase?: () => Phase; __fbPlay?: () => void }).__lenis = lenis
      ;(window as unknown as { __fbMeasure?: () => void }).__fbMeasure = measure
      ;(window as unknown as { __fbGeo?: unknown }).__fbGeo = { get: () => ({ vh, trackTop, span, S, pcx, pcy, bcx, btnTop }) }
      ;(window as unknown as { __fbPhase?: () => Phase }).__fbPhase = () => phase
    }
    let lenisRaf = 0
    const loop = (time: number) => { lenis.raf(time); lenisRaf = requestAnimationFrame(loop) }
    lenisRaf = requestAnimationFrame(loop)

    const PLAY_MS = 3400 // total time for the whole one-flick sequence - long enough that the
    // deceleration into the landing reads as deliberate, not rushed
    // outer time->seq shape is ease-OUT (fast pickup, gentle tail), NOT ease-in-out: an eased-IN
    // start was tried and measured to be worse, not better - place() already has its own SPIN_A
    // dead-zone (nothing rotates until raw seq passes 0.06), and layering a slow-start outer curve
    // on top of that pushed the first visible motion out to ~800ms, which reads as exactly the
    // "did my scroll even register?" dead air this is meant to fix. Reusing the same easeOut
    // cubic place() already uses for the spread phase gets seq past that threshold in ~70ms
    // (instant feedback the trigger landed) while still decelerating smoothly into the finish.
    let playRaf = 0
    let playStart = 0
    const playTick = (time: number) => {
      if (!playStart) playStart = time
      const t = easeOut(clamp((time - playStart) / PLAY_MS))
      s.setProperty('--seq', t.toFixed(3))
      place(t)
      if (t < 1) { playRaf = requestAnimationFrame(playTick); return }
      // intro complete: freeze at the landed state and collapse the pinned timeline to a single
      // screen, so the rest of the page scrolls normally from here. The finished sequence is NEVER
      // re-driven by scroll position again - that scroll-scrub is exactly what let a big scroll rush
      // it, a small one stall short of the end, and scrolling back up run it in reverse. We stayed
      // locked at the very top the whole time, so there is no scroll snap: the frozen hero simply
      // sits at the top with the real content directly below, and the next scroll moves the page.
      phase = 'released'
      window.removeEventListener('wheel', onTrigger)
      window.removeEventListener('touchmove', onTrigger)
      window.removeEventListener('keydown', onKeyTrigger)
      track.style.height = '100svh'
      place(1)
      s.setProperty('--seq', '1.000')
      lenis.start()
    }
    const onTrigger = (e: Event) => {
      if (phase !== 'idle') { if (e.cancelable) e.preventDefault(); return }
      if (e.cancelable) e.preventDefault()
      measure() // defensive re-measure right before playing, in case anything shifted since mount
      phase = 'playing'
      playStart = 0
      playRaf = requestAnimationFrame(playTick)
    }
    // native keyboard scrolling is a code path Lenis's stop() doesn't touch (confirmed by reading
    // its source) - space/arrow/page/home/end all move the document scroll position directly,
    // bypassing the wheel/touch lock entirely. Treat the same set of keys as a trigger, but only
    // when nothing else on the page already claimed the keystroke (defaultPrevented - covers the
    // Dock's own Enter/Space activation) or the target is an actual form control.
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
    if (import.meta.env.DEV) (window as unknown as { __fbPlay?: () => void }).__fbPlay = () => onTrigger(new Event('debug', { cancelable: false }))

    lenis.stop()
    window.addEventListener('wheel', onTrigger, { passive: false })
    window.addEventListener('touchmove', onTrigger, { passive: false })
    window.addEventListener('keydown', onKeyTrigger)
    window.addEventListener('resize', onResize)
    // the corner button's width depends on webfont-rendered text ("Panta núna" in CabinetGrotesk)
    // - measure() above can run before that font swaps in (FOUT), caching a fallback-font width
    // and landing the slice a few px off target. Re-measure once fonts are actually ready to
    // correct for that; harmless no-op if they were already loaded by the time we got here.
    let cancelled = false
    document.fonts.ready.then(() => { if (!cancelled) measure() })
    return () => {
      cancelled = true
      window.removeEventListener('wheel', onTrigger)
      window.removeEventListener('touchmove', onTrigger)
      window.removeEventListener('keydown', onKeyTrigger)
      window.removeEventListener('resize', onResize)
      if (playRaf) cancelAnimationFrame(playRaf)
      cancelAnimationFrame(lenisRaf)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={rootRef} className="fb-root" data-revealed={assetsReady ? '' : undefined} style={{ background: CREAM, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/flatbakan/css/flatbakan.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <style>{CSS}</style>

      {/* same component App.tsx shows as this route's Suspense fallback - stays up until fonts,
          images AND the grain shader's first frame are ready, then eases up + fades onto a
          fully-painted hero (no font swap, no image pop-in, no grain flash). progress drives the
          ring. Unmounted shortly after (overlayMounted) so its animations don't run behind the site. */}
      {overlayMounted && <FlatbakanLoading visible={!assetsReady} progress={loadProgress} />}

      {/* fixed backdrop - real scattered ingredients, bg removed + blurred, drifts with the pointer */}
      <div className="fb-bgwrap" aria-hidden>
        <img ref={bgRef} src={IMG.ingredientsBg} alt="" className="fb-bgimg" draggable={false} />
      </div>

      {/* ================================================= pinned pizza opener */}
      <div ref={trackRef} className="fb-track">
        <div ref={stageRef} className="fb-stage-pin">
          {/* subtle living backdrop - tones stay within the SAME orange hue as the flat fallback
              background beneath it, so the pizza's exact-colour-matted cutout never shows a seam */}
          <Suspense fallback={null}>
            <Grainient
              className="fb-grain-hero"
              color1="#F6B663" color2={ORANGE} color3="#C17D23"
              contrast={0.9} saturation={0.85} grainAmount={0.05} grainScale={2.2}
              warpAmplitude={20} warpFrequency={3} timeSpeed={0.08} zoom={1.1}
              maxDpr={1} fps={30}
              onReady={() => mark('grain')}
            />
          </Suspense>
          <header className="fb-nav">
            <div className="fb-nav-grp">
              <Pill href="#top" ext={false} active>Heim</Pill>
              <Pill href="#sagan" ext={false}>Um okkur</Pill>
            </div>
            <a href="#top" className="fb-badge"><img src={IMG.logoBadge} alt="Flatbakan" /></a>
            <div className="fb-nav-grp">
              <Pill href="#matsedill" ext={false}>Matseðill</Pill>
              <Pill href={ORDER} solid>Panta</Pill>
            </div>
            <button type="button" className="fb-burger" data-open={menuOpen} aria-expanded={menuOpen}
              aria-controls="fb-mmenu" aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              onClick={() => setMenuOpen((v) => !v)}>
              <span className="fb-burger-lines"><span /><span /><span /></span>
            </button>
          </header>
          <div className="fb-mbackdrop" data-open={menuOpen} aria-hidden onClick={() => setMenuOpen(false)} />
          <nav id="fb-mmenu" className="fb-mmenu" data-open={menuOpen} aria-label="Aðalvalmynd" aria-hidden={!menuOpen}>
            <a href="#top" onClick={() => setMenuOpen(false)}>Heim</a>
            <a href="#sagan" onClick={() => setMenuOpen(false)}>Um okkur</a>
            <a href="#matsedill" onClick={() => setMenuOpen(false)}>Matseðill</a>
            <a href={ORDER} target="_blank" rel="noreferrer" className="fb-mmenu-cta" onClick={() => setMenuOpen(false)}>Panta núna</a>
          </nav>

          <div className="fb-hero-mid">
            <div className="fb-hero-word" aria-hidden>FLATBAKAN</div>
            <div className="fb-hero-copy">
              <h1 className="fb-h1">Fáðu þér <span className="fb-sneid">sneið</span></h1>
              <p className="fb-lede">Steinbökuð súrdeigspizza í Bæjarlind 2.</p>
              <div className="fb-claim"><span className="fb-claim-star">★</span>Besta pizza í Kópavogi</div>
            </div>
            <div ref={pizzaRef} className="fb-pizza" aria-hidden>
              <div className="fb-glow" />
              <img src={IMG.whole} alt="" className="fb-layer fb-whole" draggable={false} />
              {SLICES.filter((sl) => !sl.traveller).map((sl) => (
                <img key={sl.img} src={sl.img} alt="" className="fb-layer fb-sl" draggable={false}
                  style={{ ['--ux' as string]: sl.ux, ['--uy' as string]: sl.uy }} />
              ))}
            </div>
          </div>

          <div className="fb-scrollcue" aria-hidden><span>Skrunaðu</span><i /></div>
        </div>
      </div>

      {/* ==================================================== the framed website */}
      <div className="fb-frame">
        {/* -------------------------------------------------------- matseðill */}
        <section id="matsedill" className="fb-sec">
          <div className="fb-sec-head">
            <Reveal><h2 className="fb-h2">Vinsælustu bökurnar</h2></Reveal>
            <Reveal delay={80}><a href={ORDER} target="_blank" rel="noreferrer" className="fb-btn">Allur matseðillinn</a></Reveal>
          </div>
          <div className="fb-cards">
            {FEATURED.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article className="fb-card">
                  <div className="fb-card-img"><img src={p.img} alt={p.name} loading="lazy" width={520} height={390} />
                    {p.best && <span className="fb-tag">Best seller</span>}</div>
                  <div className="fb-card-body">
                    <div className="fb-card-top"><h3>{p.name}</h3><span className="fb-price">{p.price}<em> kr</em></span></div>
                    <p>{p.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="fb-cat fb-dock-wrap">
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
        <section id="sagan" className="fb-sec fb-band">
          <div className="fb-story">
            <Reveal><h2 className="fb-h2">Frá 2015, í hjarta Kópavogs</h2></Reveal>
            <Reveal delay={70}><p className="fb-body">{STORY.body}</p></Reveal>
            <Reveal delay={130}>
              <div className="fb-award"><span className="fb-award-t">★ {AWARD.title}</span><span className="fb-award-s">{AWARD.sub}</span></div>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------- pizza truck */}
        <section id="truck" className="fb-sec fb-truck">
          <div className="fb-truck-head">
            <Reveal><h2 className="fb-h2" style={{ color: CREAM_LT }}>Pizza Truck</h2></Reveal>
            <Reveal delay={70}><p className="fb-truck-lede">{TRUCK.intro}</p></Reveal>
            <Reveal delay={120}><a href={`mailto:${EMAIL}?subject=Fyrirspurn um Pizza Truck`} className="fb-btn fb-btn-cream">Senda fyrirspurn</a></Reveal>
          </div>
          <div className="fb-pkgs">
            {TRUCK.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 70}>
                <div className="fb-pkg">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.line}</p>
                  {pkg.rates.map((r) => (
                    <div key={r.label} className="fb-rate"><span>{r.label} <em>{r.sub}</em></span><span className="fb-rate-p">{r.price} kr</span></div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- visit / hours */}
        <section id="stadur" className="fb-sec">
          <div className="fb-visit">
            <div>
              <Reveal><h2 className="fb-h2">{ADDRESS.street}</h2></Reveal>
              <Reveal delay={60}><p className="fb-body" style={{ marginTop: '.3rem' }}>{ADDRESS.town}. {KAERLEIKS.heading} og allur ágóði í Sollusjóðinn.</p></Reveal>
              <Reveal delay={120}><div className="fb-visit-cta">
                <a href={MAPS} target="_blank" rel="noreferrer" className="fb-btn">Sjá á korti</a>
                <a href={PHONE_HREF} className="fb-chip">{PHONE_DISPLAY}</a>
              </div></Reveal>
            </div>
            <Reveal delay={60}><div className="fb-hours">
              {HOURS.map((h) => (<div key={h.day} className="fb-hour"><span>{h.day}</span><span>{h.time}</span></div>))}
            </div></Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- footer */}
        <footer className="fb-footer">
          <div className="fb-foot-top">
            <a href="#top" className="fb-badge fb-badge-sm"><img src={IMG.logoBadge} alt="Flatbakan" /></a>
            <div className="fb-foot-links">
              <a href={MAPS} target="_blank" rel="noreferrer">{ADDRESS.street}</a>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="fb-foot-bottom">
            <span>Frumgerð í hönnun, sýnishorn, ekki opinber vefur Flatbökunnar.</span>
            <span>Keyrir á upsell.is</span>
          </div>
        </footer>
      </div>

      {/* the one travelling slice - a root-level `position:fixed` sibling of the corner CTA (NOT
          nested inside .fb-track), so its z-index is compared directly against the button's and
          always wins - it can never be trapped behind it mid-flight. Viewport coords, JS-driven. */}
      <img src={IMG.slice} alt="" className="fb-slice" draggable={false} aria-hidden />

      {/* the corner order CTA - always visible, the slice's landing target; once it lands, a
          static garnish crossfades in and idles there for the rest of the scroll */}
      <a ref={pantaRef} href={ORDER} target="_blank" rel="noreferrer" className="fb-sticky-panta" aria-label="Panta núna">
        <span>Panta núna</span>
        <img src={IMG.slice} alt="" className="fb-corner-slice" draggable={false} aria-hidden />
      </a>
    </div>
  )
}

/* ================================================================== styles */
const CSS = `
@font-face{font-family:'Fontjek';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/flatbakan/fonts/FontJek.woff2') format('woff2'),
      url('${BASE}fonts/flatbakan/fonts/FontJek.woff') format('woff'),
      url('${BASE}fonts/flatbakan/fonts/FontJek.otf') format('opentype')}
@font-face{font-family:'Arkipelago';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/flatbakan/fonts/Arkipelago.otf') format('opentype')}
.fb-root{position:relative;min-height:100vh;overflow-x:clip}

/* fixed ingredients backdrop - sits behind the frame + hero, drifts with the pointer (JS) */
.fb-bgwrap{position:fixed;inset:-24px;z-index:0;overflow:hidden;pointer-events:none}
.fb-bgimg{width:100%;height:100%;object-fit:cover;display:block;will-change:transform}

/* ---- pinned opener ---- */
.fb-track{position:relative;z-index:2;height:240svh}
.fb-stage-pin{position:sticky;top:0;height:100svh;overflow:hidden;background:${ORANGE};
  display:flex;flex-direction:column;padding:clamp(1rem,2.4vw,1.8rem) clamp(1rem,3vw,2.4rem) clamp(1.4rem,3vw,2.2rem)}
/* sits on the flat orange fallback (kept as a safety net if the canvas fails), behind everything
   else in the stage - z-index:0 first in DOM so nav/copy/pizza (all z-index>=2) paint above it */
.fb-grain-hero{position:absolute;inset:0;z-index:0;pointer-events:none}

.fb-nav{position:relative;z-index:6;width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.fb-nav-grp{display:flex;gap:.6rem}
.fb-badge{width:64px;height:64px;border-radius:50%;background:${INK};display:flex;align-items:center;justify-content:center;
  flex:0 0 auto;box-shadow:0 8px 20px -8px rgba(28,18,8,.55)}
.fb-badge img{width:80%;height:80%;object-fit:contain;filter:brightness(0) invert(1)}
/* Logo is pulled out of the flex flow and centred on the header itself, not on the two flanking
   pill groups - so it stays dead-centre even when those groups don't hold equal weight (e.g. one
   group loses a pill at a breakpoint, or the mobile burger button sits alone on one side). */
.fb-nav .fb-badge{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}

/* ---- mobile hamburger + dropdown (replaces the pill nav below 520px) ---- */
.fb-burger{display:none;position:relative;z-index:8;width:44px;height:44px;flex:0 0 auto;padding:0;
  align-items:center;justify-content:center;background:${CREAM_LT};border:1.5px solid ${INK};
  border-radius:50%;box-shadow:2px 2px 0 ${INK};cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
.fb-burger:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.fb-burger:active{transform:translate(0,0);box-shadow:1px 1px 0 ${INK}}
.fb-burger-lines{position:relative;width:18px;height:13px}
.fb-burger-lines span{position:absolute;left:0;width:100%;height:2px;border-radius:2px;background:${INK};
  transition:top .3s cubic-bezier(.65,0,.35,1),transform .3s cubic-bezier(.65,0,.35,1),opacity .2s ease}
.fb-burger-lines span:nth-child(1){top:0}
.fb-burger-lines span:nth-child(2){top:5.5px}
.fb-burger-lines span:nth-child(3){top:11px}
.fb-burger[data-open="true"] .fb-burger-lines span:nth-child(1){top:5.5px;transform:rotate(45deg)}
.fb-burger[data-open="true"] .fb-burger-lines span:nth-child(2){opacity:0;transform:scaleX(0)}
.fb-burger[data-open="true"] .fb-burger-lines span:nth-child(3){top:5.5px;transform:rotate(-45deg)}

.fb-mbackdrop{display:none;position:fixed;inset:0;z-index:59;background:rgba(28,18,8,.28);
  opacity:0;pointer-events:none;transition:opacity .3s ease}
.fb-mbackdrop[data-open="true"]{opacity:1;pointer-events:auto}

/* dropdown reveal is a clip-path wipe (not scaleY) so the border/shadow never distorts mid-transition -
   it genuinely unrolls from the header like a menu flap, each link cascading in a beat after the last */
.fb-mmenu{display:none;position:fixed;left:clamp(1rem,3vw,2.4rem);right:clamp(1rem,3vw,2.4rem);
  top:calc(clamp(1rem,2.4vw,1.8rem) + 64px + .6rem);z-index:60;flex-direction:column;gap:.35rem;
  padding:.7rem;background:${CREAM_LT};border:2px solid ${INK};border-radius:20px;box-shadow:5px 5px 0 ${INK};
  clip-path:inset(0 0 100% 0 round 20px);transform:translateY(-6px);opacity:0;pointer-events:none;
  transition:clip-path .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1),opacity .28s ease}
.fb-mmenu[data-open="true"]{clip-path:inset(0 0 0% 0 round 20px);transform:none;opacity:1;pointer-events:auto}
.fb-mmenu a{font-family:${SANS};font-weight:700;font-size:1.05rem;color:${INK};text-decoration:none;
  padding:.75rem .9rem;border-radius:12px;opacity:0;transform:translateY(-8px);
  transition:background .15s ease,opacity .38s ease .1s,transform .38s cubic-bezier(.22,1,.36,1) .1s}
.fb-mmenu a:active{background:rgba(28,18,8,.07)}
.fb-mmenu[data-open="true"] a{opacity:1;transform:none}
.fb-mmenu[data-open="true"] a:nth-child(1){transition-delay:.06s}
.fb-mmenu[data-open="true"] a:nth-child(2){transition-delay:.11s}
.fb-mmenu[data-open="true"] a:nth-child(3){transition-delay:.16s}
.fb-mmenu[data-open="true"] a:nth-child(4){transition-delay:.21s}
.fb-mmenu a.fb-mmenu-cta{background:${RED};color:${CREAM_LT};text-align:center;margin-top:.15rem;
  font-weight:700;text-transform:uppercase;letter-spacing:.03em;font-size:.92rem}

/* the hero content's half of the "arrive": it sits very slightly enlarged behind the orange
   loading screen and eases down to rest as that screen lifts away, so the hero reads as settling
   into focus rather than hard-cutting in. Pure transform (GPU compositor) - and the scroll
   sequence re-measures on its own trigger (see onTrigger), so this transient scale never poisons
   the pinned-pizza geometry. Longer than the overlay's own fade so you see it finish settling. */
.fb-hero-mid{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;min-height:0;
  transform:scale(1.05);transform-origin:50% 42%;transition:transform 1.05s cubic-bezier(.16,.72,.12,1);will-change:transform}
.fb-root[data-revealed] .fb-hero-mid{transform:none}
.fb-hero-word{position:absolute;top:58%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none;
  font-family:${DISPLAY};font-weight:400;font-size:clamp(5.5rem,21vw,19rem);line-height:1;color:rgba(150,80,6,.20);
  letter-spacing:.01em;white-space:nowrap;text-transform:uppercase}
.fb-hero-copy{position:relative;z-index:3;text-align:center;pointer-events:none;margin-top:clamp(.6rem,3vh,2.4rem)}
.fb-h1{font-family:${DISPLAY};font-weight:400;font-size:clamp(2.4rem,6vw,4.6rem);line-height:.92;letter-spacing:-.02em;margin:0;color:${INK}}
/* "sneið" - accent word set in the same HorndonBecker headline face as .fb-h1, just italicised
   (synthetic slant - the face only ships one upright style) and rotated a touch, so it reads as
   a flourish off the headline rather than a second typeface. Same RED as the CTA buttons
   (.fb-sticky-panta / "Allur matseðillinn"), not a separate accent color, no gradient. */
.fb-sneid{font-family:${DISPLAY};font-style:italic;font-weight:400;font-size:1.15em;line-height:1.3;
  display:inline-block;transform:rotate(-3deg);color:${RED};
  text-shadow:0 1px 0 rgba(28,17,8,.55),0 3px 16px rgba(28,17,8,.3)}
.fb-lede{font-size:clamp(1rem,1.4vw,1.16rem);line-height:1.5;color:rgba(28,18,8,.82);max-width:40ch;margin:.85rem auto 0}
/* "Besta pizza í Kópavogi" - pulled out of the lede sentence into its own stamped claim badge,
   echoing the dashed award-stamp motif used later at .fb-award (promise here, proof there). */
.fb-claim{display:inline-flex;align-items:center;gap:.4rem;margin-top:.9rem;padding:.5rem 1.15rem;
  background:${CREAM_LT};border:1.5px dashed ${RED};border-radius:999px;transform:rotate(-1.5deg);
  font-family:${DISPLAY};font-weight:400;font-size:.82rem;letter-spacing:.03em;text-transform:uppercase;
  color:${RED};box-shadow:0 8px 18px -10px rgba(28,18,8,.45)}
.fb-claim-star{font-size:.85em;line-height:1}

/* pizza layers - whole cross-fades into the spaced cut body, both spinning together.
   A normal (non-absolute) flex child with margin:auto, NOT a fixed top:60% anchor - the old fixed
   percentage was tuned for a 2-line hero-copy block and silently started overlapping the claim
   badge once a 3rd line was added, since it never accounted for the copy block's real height.
   margin:auto in a column flex container centers the pizza in whatever space is left BELOW
   hero-copy, however tall that content happens to be - correct by construction, not tuning. */
/* the 3rd min() term bounds pizza height by whatever's actually left in the 100svh stage after
   nav + hero-copy + padding + a real gap - without it, on shorter/wider viewports hero-copy plus
   a full 465px pizza can simply exceed the available box, leaving margin:auto nothing to
   distribute (auto margins can't invent space that isn't there). The max(220px, ...) floor matters
   on genuinely short viewports (e.g. phones in landscape, ~400px tall): the calc() term alone goes
   NEGATIVE there, and min() picking a negative width clamps to 0 - the pizza vanished entirely
   until this floor was added. 220px keeps it a real, clearly visible hero image even then. */
.fb-pizza{position:relative;width:min(60vw,465px,max(220px,calc(100svh - 26rem)));aspect-ratio:1;margin:auto;
  transform:rotate(calc(var(--spin,0)*1deg));transform-origin:50% 50%;z-index:2;will-change:transform}
.fb-glow{position:absolute;left:50%;top:52%;width:82%;height:82%;transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(120,60,0,.26),rgba(120,60,0,0) 66%);filter:blur(4px)}
.fb-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 12px 18px rgba(90,45,0,.30))}
.fb-whole{opacity:calc(1 - var(--cut,0))}
/* will-change:transform promotes each of the 7 slices to its own compositor layer, so the
   per-frame --spread transform is a cheap GPU move instead of re-rasterizing the drop-shadow
   filter from .fb-layer on every tick (filter+transform together are expensive to redo). */
.fb-sl{opacity:var(--cut,0);will-change:transform;
  transform:translate(calc(var(--ux,0) * var(--spread,0px)),calc(var(--uy,0) * var(--spread,0px)))}

/* the travelling slice - position:fixed (viewport px, JS-driven), rendered as a root sibling of
   .fb-sticky-panta so z-index:55 is compared DIRECTLY against its z-index:50 and always wins - it
   can never end up trapped inside a lower stacking context and disappear behind the button
   mid-flight. Fades out as it hands off to the static landed garnish on the corner button. */
.fb-slice{position:fixed;left:0;top:0;z-index:55;width:var(--slw,180px);height:auto;pointer-events:none;
  opacity:calc(var(--cut,0) * (1 - var(--armed,0)));will-change:transform;
  transform:translate(var(--slx,0),var(--sly,0)) translate(-50%,-50%) rotate(var(--slr,0));
  filter:drop-shadow(0 16px 24px rgba(90,45,0,.42))}

.fb-scrollcue{position:absolute;left:clamp(1rem,3vw,2.4rem);bottom:clamp(1rem,2.4vw,1.6rem);z-index:4;display:flex;flex-direction:column;
  align-items:flex-start;gap:.4rem;color:rgba(28,18,8,.5);font-family:${SANS};font-weight:600;font-size:.7rem;text-transform:uppercase;
  letter-spacing:.14em;opacity:calc(1 - var(--seq,0)*6);pointer-events:none}
.fb-scrollcue i{width:1px;height:26px;background:rgba(28,18,8,.4);animation:fbcue 1.7s ease-in-out infinite}
@keyframes fbcue{0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.3}50%{transform:scaleY(1);opacity:.8}}

/* ---- pills / buttons (magazine style) ---- */
.fb-pill{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.86rem;
  padding:.5rem 1.05rem;border:1.5px solid ${INK};border-radius:999px;text-decoration:none;white-space:nowrap;
  box-shadow:2px 2px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease}
.fb-pill:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${INK}}
.fb-btn{display:inline-flex;align-items:center;font-family:${SANS};font-weight:700;font-size:.92rem;
  padding:.8rem 1.5rem;border:2px solid ${INK};border-radius:999px;background:${RED};color:${CREAM_LT};
  text-decoration:none;box-shadow:3px 3px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease}
.fb-btn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 ${INK}}
.fb-btn-cream{background:${CREAM_LT};color:${INK}}
.fb-chip{display:inline-flex;align-items:center;font-family:${SANS};font-weight:600;font-size:.9rem;
  padding:.6rem 1.15rem;border:1.5px solid ${INK};border-radius:999px;background:transparent;color:${INK};
  text-decoration:none;transition:background .15s,color .15s}
.fb-chip:hover{background:${INK};color:${CREAM_LT}}

/* fixed corner order CTA - always visible; the flying slice's landing target. Once it lands,
   a static garnish crossfades in on top and idles there gently for the rest of the scroll. */
.fb-sticky-panta{position:fixed;z-index:50;right:clamp(.9rem,2.4vw,1.6rem);bottom:clamp(.9rem,2.4vw,1.5rem);
  display:inline-flex;align-items:center;justify-content:center;
  background:${RED};color:${CREAM_LT};font-family:${SANS};font-weight:700;text-transform:uppercase;letter-spacing:.05em;
  font-size:.82rem;padding:.85rem 1.4rem;border-radius:14px;border:2px solid ${INK};box-shadow:3px 3px 0 ${INK};
  text-decoration:none;transition:box-shadow .18s ease,transform .18s ease}
.fb-sticky-panta:hover{box-shadow:5px 5px 0 ${INK};transform:translate(-2px,-2px)}
/* width/top here MUST match the JS wDrop/OVERLAP math exactly (see place()) so the flying slice's
   landing spot and this static garnish's rest spot are pixel-identical - the crossfade is then a
   pure dissolve in place, not a jump. --armed is a continuous JS value each frame, no CSS transition
   here (one would fight the constantly-updating value and reintroduce lag/mismatch). */
.fb-corner-slice{position:absolute;left:50%;top:-67px;width:56px;height:auto;pointer-events:none;
  opacity:var(--armed,0);filter:drop-shadow(0 8px 14px rgba(90,45,0,.4));
  animation:fbCornerIdle 6s ease-in-out infinite}
@keyframes fbCornerIdle{
  0%,100%{transform:translateX(-50%) rotate(-6deg) translateY(0)}
  50%{transform:translateX(-50%) rotate(3deg) translateY(-3px)}
}

/* ---- framed website ---- */
.fb-frame{position:relative;z-index:1;max-width:min(1360px,90vw);margin:0 auto clamp(.9rem,2vw,1.6rem);background:${CREAM};
  border:9px solid ${INK};border-radius:clamp(24px,3vw,40px);overflow:clip;box-shadow:0 40px 90px -50px rgba(28,18,8,.6)}
.fb-h2{font-family:${DISPLAY};font-weight:400;font-size:clamp(1.9rem,3.6vw,3rem);line-height:.98;letter-spacing:-.015em;margin:0}
.fb-body{font-size:1.04rem;line-height:1.6;color:${MUTE};max-width:56ch}

.fb-sec{padding:clamp(3rem,6vw,5.5rem) clamp(1.2rem,4vw,3.5rem)}
.fb-sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1.5rem;flex-wrap:wrap;margin-bottom:2.2rem}
.fb-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:.85rem}
.fb-cards>div{display:flex}
.fb-card{display:flex;flex-direction:column;width:100%;background:${CREAM_LT};border:2px solid ${INK};border-radius:22px;overflow:clip;box-shadow:5px 5px 0 ${INK};
  transition:transform .18s ease,box-shadow .18s ease}
.fb-card:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 ${INK}}
.fb-card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:${CREAM};flex:none}
.fb-card-img img{width:100%;height:100%;object-fit:cover;display:block}
.fb-tag{position:absolute;top:.8rem;left:.8rem;background:${RED};color:${CREAM_LT};font-family:${SANS};font-weight:700;
  font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;padding:.32rem .7rem;border-radius:999px;border:1.5px solid ${INK}}
.fb-card-body{display:flex;flex-direction:column;flex:1;padding:1.2rem 1.3rem 1.4rem}
.fb-card-top{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
.fb-card-top h3{font-family:${DISPLAY};font-weight:400;font-size:1.4rem;margin:0;letter-spacing:-.01em}
.fb-price{font-family:${DISPLAY};font-weight:400;font-size:1.3rem;color:${RED};white-space:nowrap}
.fb-price em{font-family:${SANS};font-size:.62em;font-style:normal;color:${MUTE}}
.fb-card-body p{font-size:.9rem;line-height:1.45;color:${MUTE};margin:.5rem 0 0;min-height:2.9em;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden}
.fb-cat{display:flex;justify-content:center;margin-top:2.4rem}

/* Dock-style category row - recoloured to the brand (cream/ink) instead of the default dark glass */
.fb-dock-wrap{position:relative;height:100px;width:100%;max-width:520px;margin:0 auto}
.fb-dock-wrap .dock-outer{margin:0;width:100%;justify-content:center}
.fb-dock-wrap .dock-panel{background:transparent;border:none;padding:0 .5rem;gap:.6rem}
.fb-dock-wrap .dock-item{background:${CREAM_LT};border:1.5px solid ${INK};color:${INK};box-shadow:2px 2px 0 ${INK}}
.fb-dock-wrap .dock-item:hover,.fb-dock-wrap .dock-item:focus-visible{background:${RED};color:${CREAM_LT}}
.fb-dock-wrap .dock-caption{color:${MUTE};font-family:${SANS};font-weight:600;font-size:.68rem}

/* Grainient - a subtle animated grain+gradient texture behind the story section, brand-toned */
.fb-band{background:${CREAM_LT};border-top:2px solid ${INK};border-bottom:2px solid ${INK}}
.fb-story{max-width:760px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.2rem}
.fb-award{display:inline-flex;flex-direction:column;padding:.7rem 1.3rem;border:1.5px dashed ${RED};border-radius:14px}
.fb-award-t{font-family:${DISPLAY};font-weight:400;color:${RED}}
.fb-award-s{font-size:.82rem;color:${MUTE}}

.fb-truck{background:${ORANGE};border-top:2px solid ${INK};border-bottom:2px solid ${INK};
  display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(1.5rem,4vw,3rem);align-items:start}
.fb-truck-lede{font-size:1.05rem;line-height:1.5;color:rgba(28,18,8,.82);margin:1rem 0 1.6rem;max-width:32ch}
.fb-pkgs{display:grid;gap:1.2rem}
.fb-pkg{background:${CREAM_LT};border:2px solid ${INK};border-radius:18px;padding:1.3rem 1.4rem;box-shadow:4px 4px 0 ${INK}}
.fb-pkg h3{font-family:${DISPLAY};font-weight:400;font-size:1.5rem;margin:0}
.fb-pkg p{font-size:.9rem;line-height:1.4;color:${MUTE};margin:.4rem 0 .9rem}
.fb-rate{display:flex;justify-content:space-between;gap:1rem;padding:.5rem 0;border-top:1px solid rgba(28,23,18,.14);font-size:.95rem}
.fb-rate em{font-style:normal;color:${MUTE};font-size:.8rem}
.fb-rate-p{font-family:${DISPLAY};font-weight:400;color:${RED};white-space:nowrap}

.fb-visit{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,3rem);align-items:center}
.fb-visit-cta{display:flex;gap:.8rem;margin-top:1.4rem;flex-wrap:wrap}
.fb-hours{border:2px solid ${INK};border-radius:18px;overflow:clip}
.fb-hour{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 1.2rem;font-size:.98rem;border-bottom:1px solid rgba(28,23,18,.12)}
.fb-hour:last-child{border-bottom:none}
.fb-hour span:first-child{color:${MUTE}}
.fb-hour span:last-child{font-weight:700}

.fb-footer{background:${INK};color:${CREAM_LT};padding:clamp(2.2rem,4vw,3rem) clamp(1.2rem,4vw,3.5rem)}
.fb-foot-top{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.fb-badge-sm{width:54px;height:54px;background:${CREAM_LT}}
.fb-badge-sm img{filter:none}
.fb-foot-links{display:flex;gap:1.4rem;flex-wrap:wrap}
.fb-foot-links a{color:rgba(252,245,231,.72);text-decoration:none;font-size:.95rem}
.fb-foot-links a:hover{color:${CREAM_LT}}
.fb-foot-bottom{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.8rem;padding-top:1.3rem;
  border-top:1px solid rgba(252,245,231,.16);color:rgba(252,245,231,.5);font-size:.78rem}

/* ---- responsive ---- */
@media (max-width:860px){
  /* fill the width minus a tight gutter and CENTER (auto margins). The base rule's max-width:90vw
     left slack that a fixed .6rem left margin pushed off-centre, so override max-width here too. */
  .fb-frame{max-width:calc(100vw - 1.2rem);margin:0 auto .6rem;border-width:6px}
  .fb-cards,.fb-truck,.fb-visit{grid-template-columns:1fr}
  .fb-nav{gap:.5rem}
  .fb-pizza{width:min(85vw,385px)}
  .fb-sec-head{flex-direction:column;align-items:flex-start}
}
@media (max-width:520px){
  .fb-nav-grp{display:none}
  .fb-burger{display:flex}
  .fb-mbackdrop{display:block}
  .fb-mmenu{display:flex}
}
@media (prefers-reduced-motion:reduce){
  .fb-track{height:100svh}
  /* pizza is a flow layout child now (margin:auto), not translate-anchored - --spin already
     resolves to 0 here (place(0) never enters the spin window), so no override is needed to
     hold it still; forcing the OLD translate(-50%,-50%) would now shift it by half its own
     size and break the layout. */
  .fb-scrollcue{display:none}
  .fb-corner-slice{animation:none}
  /* no scale-settle reveal for reduced-motion - hero is simply at rest */
  .fb-hero-mid{transform:none;transition:none}
}
`
