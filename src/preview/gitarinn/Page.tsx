import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react'
import { ArrowLeftRight, Mail, Minus, Phone, Plus, ShoppingBag, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './gitarinn.css'
import {
  ADDRESS, BUDGETS, CATEGORIES, DV_YEAR, EMAIL, EMAIL_HREF, FEATURED_HANDLES, FEATURED_STORY,
  FIRST_ADDRESS, FONTS, FOUNDED_YEAR, JSON_LD, MAPS_URL, MOVED_YEAR, NAV, PHONE_DISPLAY,
  PHONE_HREF, POSTCODE, PRICE_HARVEST_DATE, PRODUCTS, SERVICES, SHOWROOM_QUOTE, WEEK, budgetOf,
} from './data'
import type { Budget, Category, Product } from './data'

const company = getPreviewCompany('gitarinn')

/* ── GÍTARINN v2 · "VEGGURINN" ──────────────────────────────────────────
   You are standing in front of the wall. The centrepiece (D2, mandatory) is
   a full-viewport horizontal, draggable band of the 18 real products hung
   at pegboard heights — wheel/drag/arrow-key operable, its own internally
   interactive band, never hijacking the page's vertical scroll.

   Devices: D1 hero wordmark (mix-blend-mode:difference over real product
   imagery peeking from the right) · D2 the wall · D3 rolling-list category
   filter (ported from coppermine-experimental/app.js, namespaced gt-roll-*)
   · D4 bag drawer (localStorage: gitarinn_bag) · D5 bracket buttons
   everywhere · D6 "Síðan 1989" heritage band with a numbered fact row ·
   D7 CSS marquee ticker of real brand names found in PRODUCTS.

   Ground #120d0a (warm near-black) · ink #f3e9db (warm porcelain) · accent
   #c8362e (amp-tolex red). Display: GT Monotonia. Mono: GT Space Mono.
   ─────────────────────────────────────────────────────────────────────── */

const BAG_KEY = 'gitarinn_bag'
const asset = (p: string) => `${import.meta.env.BASE_URL}gitarinn/${p}`

const FONT_FACE_CSS = `
@font-face { font-family:'GT Monotonia'; src:url('${FONTS.display}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'GT Space Mono'; src:url('${FONTS.monoRegular}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'GT Space Mono'; src:url('${FONTS.monoBold}') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
@font-face { font-family:'GT Space Mono'; src:url('${FONTS.monoItalic}') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
`

const isk = (n: number) => `${new Intl.NumberFormat('is-IS').format(n)} kr.`
const pad2 = (n: number) => String(n).padStart(2, '0')
const hhmm = (h: number) => `${pad2(h)}:00`

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const CAT_LABEL: Record<Category, string> = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label])) as Record<Category, string>

/* Deterministic pegboard heights (px), cycled by index — no Math.random so
   the layout is stable across re-renders/filter changes. */
const PEG_OFFSETS = [20, -34, 44, -12, 30, -46, 14, -26, 38, -8, 24, -40, 16, -30, 46, -18, 28, -10]

/* ── bracket buttons (D5) ────────────────────────────────────────────── */
function Bracket({ className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`gt-bracket ${className}`} {...rest}>
      <span className="gt-bracket__b" aria-hidden="true">[</span>
      <span className="gt-bracket__t">{children}</span>
      <span className="gt-bracket__b" aria-hidden="true">]</span>
    </button>
  )
}
function BracketLink({ className = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`gt-bracket ${className}`} {...rest}>
      <span className="gt-bracket__b" aria-hidden="true">[</span>
      <span className="gt-bracket__t">{children}</span>
      <span className="gt-bracket__b" aria-hidden="true">]</span>
    </a>
  )
}

/* ── reveal: IntersectionObserver + in-view-on-mount check + ≤2s failsafe ── */
function useReveal(deps: unknown[]) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]:not(.gt-in)'))
    if (reduced() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('gt-in'))
      return
    }
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('gt-in')
    })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gt-in')
            io.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    const failsafe = window.setTimeout(() => els.forEach((el) => el.classList.add('gt-in')), 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ── ticker: pause the marquee when off-screen, never gate its visibility ── */
function useTickerPause(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !('IntersectionObserver' in window)) return
    const track = el.querySelector<HTMLElement>('.gt-ticker__track')
    if (!track) return
    const io = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      },
      { threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

/* ── bag (D4) ─────────────────────────────────────────────────────────── */
interface BagLine {
  handle: string
  qty: number
}
function loadBag(): BagLine[] {
  try {
    const raw = localStorage.getItem(BAG_KEY)
    return raw ? (JSON.parse(raw) as BagLine[]) : []
  } catch {
    return []
  }
}

/* ── the wall (D2): drag + wheel-to-X + arrow keys, momentum + snap.
   Desktop: JS-driven transform on its own translated track (the page's
   vertical scroll never touches this code path). Touch: native
   overflow-x scroll-snap rail, no JS hijack at all. ─────────────────── */
function useWallEngine(count: number, resetKey: string) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [touchMode, setTouchMode] = useState(false)
  const xRef = useRef(0)
  const stepRef = useRef(220)
  const boundsRef = useRef({ min: 0, max: 0 })
  const dragRef = useRef({ active: false, lastX: 0, lastT: 0, vel: 0, moved: 0 })
  const wheelTimer = useRef<number>()

  const clampX = (v: number) => Math.min(boundsRef.current.max, Math.max(boundsRef.current.min, v))

  const syncIndex = () => {
    const step = stepRef.current || 1
    const idx = Math.round(-xRef.current / step)
    const next = Math.min(Math.max(idx, 0), Math.max(count - 1, 0))
    setIndex((cur) => (cur === next ? cur : next))
  }

  const applyX = (withTransition: boolean) => {
    const tr = trackRef.current
    if (!tr) return
    tr.style.transition = withTransition && !reduced() ? 'transform .55s cubic-bezier(.65,0,.35,1)' : 'none'
    tr.style.transform = `translate3d(${xRef.current}px,0,0)`
    syncIndex()
  }

  const measure = useCallback(() => {
    const vp = viewportRef.current
    const tr = trackRef.current
    if (!vp || !tr) return
    const kids = Array.from(tr.children) as HTMLElement[]
    if (kids.length > 1) stepRef.current = kids[1].offsetLeft - kids[0].offsetLeft
    else if (kids.length === 1) stepRef.current = kids[0].offsetWidth
    const min = -Math.max(0, tr.scrollWidth - vp.clientWidth)
    boundsRef.current = { min, max: 0 }
    xRef.current = clampX(xRef.current)
    applyX(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTouchMode(typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, count, touchMode])

  useEffect(() => {
    xRef.current = 0
    setIndex(0)
    if (viewportRef.current) viewportRef.current.scrollLeft = 0
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, measure])

  const snapTo = (target: number) => {
    xRef.current = clampX(target)
    applyX(true)
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (touchMode) return
    const d = dragRef.current
    d.active = true
    d.lastX = e.clientX
    d.lastT = performance.now()
    d.vel = 0
    d.moved = 0
    viewportRef.current?.setPointerCapture(e.pointerId)
    viewportRef.current?.classList.add('gt-wall__viewport--dragging')
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.lastX
    d.moved += Math.abs(dx)
    d.lastX = e.clientX
    const now = performance.now()
    const dt = Math.max(1, now - d.lastT)
    d.lastT = now
    d.vel = dx / dt
    const { min, max } = boundsRef.current
    let next = xRef.current + dx
    if (next > max) next = max + (next - max) * 0.35
    if (next < min) next = min + (next - min) * 0.35
    xRef.current = next
    applyX(false)
  }
  const endDrag = () => {
    const d = dragRef.current
    if (!d.active) return
    d.active = false
    viewportRef.current?.classList.remove('gt-wall__viewport--dragging')
    const step = stepRef.current || 1
    const projected = xRef.current + d.vel * 140
    snapTo(Math.round(projected / step) * step)
  }
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragRef.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (touchMode) return
    e.preventDefault()
    window.clearTimeout(wheelTimer.current)
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    xRef.current = clampX(xRef.current - delta)
    applyX(false)
    wheelTimer.current = window.setTimeout(() => {
      const step = stepRef.current || 1
      snapTo(Math.round(xRef.current / step) * step)
    }, 140)
  }
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const step = stepRef.current || 1
    const dir = e.key === 'ArrowRight' ? -1 : 1
    snapTo(Math.round(xRef.current / step) * step + dir * step)
  }
  const focusIndex = (i: number) => {
    if (touchMode) return
    snapTo(-i * (stepRef.current || 1))
  }

  useEffect(() => {
    if (!touchMode) return
    const vp = viewportRef.current
    if (!vp) return
    const onScroll = () => {
      const step = stepRef.current || 1
      const idx = Math.round(vp.scrollLeft / step)
      setIndex(Math.min(Math.max(idx, 0), Math.max(count - 1, 0)))
    }
    vp.addEventListener('scroll', onScroll, { passive: true })
    return () => vp.removeEventListener('scroll', onScroll)
  }, [touchMode, count])

  return {
    viewportRef, trackRef, index, touchMode,
    onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag,
    onWheel, onKeyDown, onClickCapture, focusIndex,
  }
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function GitarinnPage() {
  useEffect(() => setThemeColor('#120d0a'), [])

  const [menuOpen, setMenuOpen] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [bag, setBag] = useState<BagLine[]>(() => loadBag())
  const [activeCategory, setActiveCategory] = useState<Category | 'allt'>('allt')
  const [activeBudget, setActiveBudget] = useState<Budget | 'allt'>('allt')
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const today = useMemo(() => new Date().getDay(), [])

  useEffect(() => {
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag))
    } catch {
      /* private mode or full storage: bag just won't persist across reloads */
    }
  }, [bag])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!bagOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBagOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [bagOpen])

  const addToBag = useCallback((handle: string) => {
    setBag((prev) => {
      const hit = prev.find((l) => l.handle === handle)
      if (hit) return prev.map((l) => (l.handle === handle ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { handle, qty: 1 }]
    })
    setJustAdded(handle)
    window.setTimeout(() => setJustAdded((cur) => (cur === handle ? null : cur)), 1300)
  }, [])
  const setQty = useCallback((handle: string, qty: number) => {
    setBag((prev) => {
      if (qty < 1) return prev.filter((l) => l.handle !== handle)
      return prev.map((l) => (l.handle === handle ? { ...l, qty } : l))
    })
  }, [])
  const removeLine = useCallback((handle: string) => setBag((prev) => prev.filter((l) => l.handle !== handle)), [])
  const bagCount = bag.reduce((n, l) => n + l.qty, 0)
  const subtotal = bag.reduce((sum, l) => {
    const p = PRODUCTS.find((pp) => pp.handle === l.handle)
    return p ? sum + p.price * l.qty : sum
  }, 0)

  const catCounts = useMemo(() => {
    const map = new Map<Category, number>()
    PRODUCTS.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1))
    return map
  }, [])

  const wallProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (activeCategory === 'allt' || p.category === activeCategory) &&
          (activeBudget === 'allt' || budgetOf(p) === activeBudget),
      ),
    [activeCategory, activeBudget],
  )

  const wall = useWallEngine(wallProducts.length, `${activeCategory}|${activeBudget}`)

  const goToWall = () => {
    document.getElementById('vorur')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
  }
  const selectCategory = (key: Category) => {
    setActiveCategory(key)
    goToWall()
  }
  const selectBudget = (key: Budget) => {
    setActiveBudget(key)
    goToWall()
  }
  const clearFilters = () => {
    setActiveCategory('allt')
    setActiveBudget('allt')
  }

  const heroPeek = useMemo(() => PRODUCTS.slice(0, 4), [])
  const featured = useMemo(
    () => FEATURED_HANDLES.map((h) => PRODUCTS.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p)),
    [],
  )
  const tickerBrands = useMemo(() => Array.from(new Set(PRODUCTS.map((p) => p.brand))), [])

  useReveal([])
  const tickerRef = useRef<HTMLElement>(null)
  useTickerPause(tickerRef)

  return (
    <div className="gt-root">
      <style>{FONT_FACE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header className="gt-nav">
        <a href="#top" className="gt-nav__brand" aria-label="Gítarinn — efst á síðu">
          <img src={asset('real/logogit.png')} alt="Gítarinn" className="gt-nav__logo" width={151} height={15} />
        </a>
        <nav className="gt-nav__links" aria-label="Aðalvalmynd">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="gt-nav__end">
          <a href={PHONE_HREF} className="gt-nav__phone">
            <Phone size={14} aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
          <button type="button" className="gt-nav__bag" onClick={() => setBagOpen(true)} aria-label={`Karfan — ${bagCount} vörur`}>
            <ShoppingBag size={19} aria-hidden="true" />
            {bagCount > 0 && <span className="gt-nav__bag-n">{bagCount}</span>}
          </button>
          <button
            type="button"
            className="gt-nav__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <span className="gt-nav__burger-lines" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="gt-menu" id="top">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
          <a href={PHONE_HREF} className="gt-menu__phone">
            {PHONE_DISPLAY}
          </a>
        </div>
      )}

      <main id="top">
        {/* ── HERO (D1) ─────────────────────────────────────────────── */}
        <section className="gt-hero" aria-label="Gítarinn — hljóðfæraverslun í Reykjavík frá 1989">
          <div className="gt-hero__peek" aria-hidden="true">
            {heroPeek.map((p, i) => (
              <div className="gt-hero__peek-item" key={p.handle}>
                <img
                  src={p.img}
                  alt={`${p.name} frá ${p.brand}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  // @ts-expect-error React 18 DOM typings want the lowercase attribute
                  fetchpriority={i === 0 ? 'high' : undefined}
                />
              </div>
            ))}
          </div>
          <h1 className="gt-hero__word">Gítarinn</h1>
          <div className="gt-hero__foot">
            <p className="gt-hero__tag">
              Hljóðfæraverslun í Reykjavík frá {FOUNDED_YEAR}. Rafmagns- og kassagítarar, bassar, magnarar og aukahlutir.
            </p>
            <span className="gt-hero__cue">Skruna til að skoða vegginn</span>
          </div>
        </section>

        {/* ── THE WALL (D2, mandatory) ─────────────────────────────── */}
        <section className="gt-wall" id="vorur" aria-label="Veggurinn — vöruúrval">
          <div className="gt-wall__head">
            <h2 className="gt-wall__eyebrow">Veggurinn</h2>
            <span className="gt-wall__drag">
              <ArrowLeftRight aria-hidden="true" /> Dragðu
            </span>
            <span className="gt-wall__count" aria-live="polite">
              {wallProducts.length === 0 ? '00 / 00' : `${pad2(wall.index + 1)} / ${pad2(wallProducts.length)}`}
            </span>
          </div>

          {(activeCategory !== 'allt' || activeBudget !== 'allt') && (
            <div className="gt-wall__filter">
              <span>
                Sýnir: {activeCategory !== 'allt' ? CAT_LABEL[activeCategory] : 'Allt'}
                {activeBudget !== 'allt' ? ` · ${BUDGETS.find((b) => b.key === activeBudget)?.label}` : ''}
              </span>
              <button type="button" onClick={clearFilters}>
                Hreinsa síu
              </button>
            </div>
          )}

          {wallProducts.length === 0 ? (
            <div className="gt-wall__empty">
              <p>Engar vörur passa við valda síu.</p>
              <Bracket onClick={clearFilters}>Sýna allt vöruúrval</Bracket>
            </div>
          ) : (
            <div
              ref={wall.viewportRef}
              className={`gt-wall__viewport ${wall.touchMode ? 'gt-wall__viewport--touch' : ''}`}
              role="group"
              aria-label="Dragðu til hliðar, notaðu skrunhjól, eða örvatakka til að skoða hljóðfærin"
              tabIndex={0}
              onPointerDown={wall.onPointerDown}
              onPointerMove={wall.onPointerMove}
              onPointerUp={wall.onPointerUp}
              onPointerCancel={wall.onPointerCancel}
              onPointerLeave={wall.onPointerUp}
              onWheel={wall.onWheel}
              onKeyDown={wall.onKeyDown}
              onClickCapture={wall.onClickCapture}
            >
              <div className="gt-wall__track" ref={wall.trackRef}>
                {wallProducts.map((p, i) => (
                  <article
                    key={p.handle}
                    className="gt-peg"
                    style={{ transform: `translateY(${PEG_OFFSETS[i % PEG_OFFSETS.length]}px)` }}
                    onFocus={() => wall.focusIndex(i)}
                  >
                    <span className="gt-peg__ix">{pad2(i + 1)}</span>
                    <div className="gt-peg__spot">
                      <img src={p.img} alt={`${p.name} frá ${p.brand}`} loading={i < 4 ? 'eager' : 'lazy'} />
                    </div>
                    <h3 className="gt-peg__name">{p.name}</h3>
                    <p className="gt-peg__price">
                      {p.originalPrice && <span className="gt-peg__was">{isk(p.originalPrice)}</span>}
                      <span>{isk(p.price)}</span>
                    </p>
                    <Bracket className="gt-peg__add" onClick={() => addToBag(p.handle)}>
                      {justAdded === p.handle ? 'Bætt við!' : 'Bæta í körfu'}
                    </Bracket>
                  </article>
                ))}
              </div>
            </div>
          )}

          {wallProducts.length > 0 && (
            <div className="gt-wall__progress">
              <span style={{ width: `${((wall.index + 1) / wallProducts.length) * 100}%` }} />
            </div>
          )}
        </section>

        {/* ── CATEGORIES — rolling list (D3) ───────────────────────── */}
        <section className="gt-cats" aria-label="Vöruflokkar">
          <div className="gt-cats__head">
            <h2 className="gt-cats__eyebrow">Flokkar</h2>
            <span className="gt-cats__note">Smelltu til að sía vegginn</span>
          </div>
          <div className="gt-roll">
            {CATEGORIES.map((c) => {
              const rep = PRODUCTS.find((p) => p.category === c.key)
              return (
                <a
                  key={c.key}
                  href="#vorur"
                  className={`gt-roll-item ${activeCategory === c.key ? 'gt-roll-item--active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    selectCategory(c.key)
                  }}
                >
                  <div className="gt-roll-clip">
                    <div className="gt-roll-move">
                      <div className="gt-roll-state">
                        <span className="gt-roll-h">{c.label}</span>
                      </div>
                      <div className="gt-roll-state">
                        <span className="gt-roll-h gt-roll-h--hover">{c.label}</span>
                      </div>
                    </div>
                  </div>
                  <span className="gt-roll-cat">({pad2(catCounts.get(c.key) ?? 0)})</span>
                  <div className="gt-roll-img">{rep && <img src={rep.img} alt={c.label} loading="lazy" />}</div>
                </a>
              )
            })}
          </div>
        </section>

        {/* ── SPOTLIGHT — featured editorial ───────────────────────── */}
        <section className="gt-spot" id="innblastur" aria-label="Úr safninu">
          <h2 className="gt-spot__head" data-rv>
            Úr safninu
          </h2>
          {featured.map((p, i) => (
            <article key={p.handle} className={`gt-spot__row ${i % 2 ? 'gt-spot__row--rev' : ''}`} data-rv>
              <div className="gt-spot__img">
                <img src={p.img} alt={`${p.name} frá ${p.brand}`} loading="lazy" />
              </div>
              <div className="gt-spot__text">
                <span className="gt-spot__ix">{pad2(i + 1)}</span>
                <h3>{p.name}</h3>
                <p>{FEATURED_STORY[p.handle]}</p>
                <p className="gt-spot__price">{isk(p.price)}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ── HERITAGE — "Síðan 1989" (D6) ─────────────────────────── */}
        <section className="gt-heritage" id="sagan">
          <div className="gt-heritage__intro" data-rv>
            <span className="gt-heritage__eyebrow">Sagan</span>
            <h2 className="gt-heritage__head">Síðan {FOUNDED_YEAR}</h2>
            <p>
              Gítarinn opnaði á {FIRST_ADDRESS} árið {FOUNDED_YEAR} og flutti á {ADDRESS} árið {MOVED_YEAR}, þar sem
              verslunin er enn í dag. Þar standa, að þeirra eigin sögn, {SHOWROOM_QUOTE}. Árið {DV_YEAR} fjallaði DV um
              verslunina og nefndi hana með eitt stærsta úrval landsins af gíturum.
            </p>
          </div>
          <ol className="gt-fact-row" data-rv>
            <li>
              <span className="gt-fact-row__n">01</span>
              <span>Stofnað {FOUNDED_YEAR}</span>
            </li>
            <li>
              <span className="gt-fact-row__n">02</span>
              <span>Fyrst til húsa á {FIRST_ADDRESS}</span>
            </li>
            <li>
              <span className="gt-fact-row__n">03</span>
              <span>Á {ADDRESS} frá {MOVED_YEAR}</span>
            </li>
            <li>
              <span className="gt-fact-row__n">04</span>
              <span>{SHOWROOM_QUOTE.charAt(0).toUpperCase() + SHOWROOM_QUOTE.slice(1)}, að eigin sögn</span>
            </li>
          </ol>
          <div className="gt-heritage__strip" data-rv>
            <img src={asset('real/bass-product.jpg')} alt="Bassi úr vöruúrvali Gítarans" loading="lazy" />
            <img src={asset('real/guitar-dacapo.jpg')} alt="Kassagítar úr vöruúrvali Gítarans" loading="lazy" />
            <img src={asset('real/guitar-tanglewood-1.jpg')} alt="Gítar úr vöruúrvali Gítarans" loading="lazy" />
            <img src={asset('real/guitar-tanglewood-2.jpg')} alt="Gítar úr vöruúrvali Gítarans" loading="lazy" />
            <p className="gt-heritage__credit">Ljósmyndir af hljóðfærum úr vöruúrvali Gítarans, sóttar {PRICE_HARVEST_DATE}.</p>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────── */}
        <section className="gt-services" aria-label="Þjónusta og skilmálar">
          <h2 data-rv>Þjónusta og skilmálar</h2>
          <ol className="gt-fact-row gt-fact-row--services" data-rv>
            {SERVICES.map((s, i) => (
              <li key={s.title}>
                <span className="gt-fact-row__n">{pad2(i + 1)}</span>
                <span className="gt-fact-row__t">{s.title}</span>
                <span className="gt-fact-row__b">{s.body}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── GUIDE — budget finder (leiðarvísir) ──────────────────── */}
        <section className="gt-guide" id="leidarvisir">
          <h2 data-rv>Finna réttu hljóðfærið</h2>
          <p data-rv>Veldu verðbil og skoðaðu úrvalið sem hentar á veggnum.</p>
          <div className="gt-guide__grid" data-rv>
            {BUDGETS.map((b) => (
              <button key={b.key} type="button" className="gt-guide__opt" onClick={() => selectBudget(b.key)}>
                <span className="gt-guide__label">{b.label}</span>
                <span className="gt-guide__note">{b.note}</span>
                <span className="gt-guide__go">Skoða á veggnum →</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── TICKER (D7) — real brand names from PRODUCTS only ────── */}
        <section className="gt-ticker" aria-label={`Vörumerki í boði: ${tickerBrands.join(', ')}`} ref={tickerRef}>
          <div className="gt-ticker__track">
            <span className="gt-ticker__set">
              {tickerBrands.map((b) => (
                <span className="gt-ticker__item" key={b}>
                  {b}
                </span>
              ))}
              <span className="gt-ticker__sep">/</span>
            </span>
            <span className="gt-ticker__set" aria-hidden="true">
              {tickerBrands.map((b) => (
                <span className="gt-ticker__item" key={`d-${b}`}>
                  {b}
                </span>
              ))}
              <span className="gt-ticker__sep">/</span>
            </span>
          </div>
        </section>

        {/* ── VISIT (heimsækja) ────────────────────────────────────── */}
        <section className="gt-visit" id="heimsaekja">
          <div data-rv>
            <span className="gt-visit__eyebrow">Heimsækja</span>
            <p className="gt-visit__addr">
              {ADDRESS}
              <br />
              {POSTCODE}
            </p>
            <BracketLink href={MAPS_URL} target="_blank" rel="noreferrer">
              Skoða á korti
            </BracketLink>
            <div className="gt-visit__contact">
              <a href={PHONE_HREF} className="gt-visit__line">
                <Phone size={15} aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className="gt-visit__line">
                <Mail size={15} aria-hidden="true" /> {EMAIL}
              </a>
            </div>
          </div>
          <div data-rv>
            <h2>Opnunartími</h2>
            <ol className="gt-hours">
              {WEEK.map((d) => (
                <li key={d.day} className={d.day === today ? 'gt-hours--today' : ''}>
                  <span>{d.label}</span>
                  <span>{d.closed ? 'Lokað' : `${hhmm(d.open)} til ${hhmm(d.close)}`}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />

      {/* ── BAG DRAWER (D4) ─────────────────────────────────────────── */}
      <div className={`gt-bag ${bagOpen ? 'gt-bag--open' : ''}`} role="dialog" aria-modal="true" aria-label="Karfan" aria-hidden={!bagOpen}>
        <button
          type="button"
          className="gt-bag__backdrop"
          onClick={() => setBagOpen(false)}
          aria-label="Loka körfu"
          tabIndex={bagOpen ? 0 : -1}
        />
        <div className="gt-bag__panel">
          <div className="gt-bag__head">
            <h2>Karfan</h2>
            <button type="button" className="gt-bag__close" onClick={() => setBagOpen(false)} aria-label="Loka">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          {bag.length === 0 ? (
            <div className="gt-bag__empty">
              <p>Karfan er tóm.</p>
              <BracketLink href="#vorur" onClick={() => setBagOpen(false)}>
                Skoða vegginn
              </BracketLink>
            </div>
          ) : (
            <>
              <ul className="gt-bag__lines">
                {bag.map((line) => {
                  const p = PRODUCTS.find((pp) => pp.handle === line.handle)
                  if (!p) return null
                  return (
                    <li key={line.handle} className="gt-bag__line">
                      <img src={p.img} alt="" loading="lazy" />
                      <div className="gt-bag__line-info">
                        <p className="gt-bag__line-name">{p.name}</p>
                        <p className="gt-bag__line-price">{isk(p.price)}</p>
                        <div className="gt-bag__qty">
                          <button type="button" aria-label={`Fækka, ${p.name}`} onClick={() => setQty(p.handle, line.qty - 1)}>
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <span>{line.qty}</span>
                          <button type="button" aria-label={`Fjölga, ${p.name}`} onClick={() => setQty(p.handle, line.qty + 1)}>
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <button type="button" className="gt-bag__remove" onClick={() => removeLine(p.handle)} aria-label={`Fjarlægja ${p.name}`}>
                        <X size={16} aria-hidden="true" />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="gt-bag__subtotal">
                <span>Samtals</span>
                <span>{isk(subtotal)}</span>
              </div>
              <p className="gt-bag__note">Sýnishorn með verðum sóttum {PRICE_HARVEST_DATE}. Ekki er hægt að ljúka kaupum hér.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
