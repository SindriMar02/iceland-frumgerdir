import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ChevronDown, Info, MapPin, Phone, Search, SlidersHorizontal, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CARS,
  CONTACT,
  FEES,
  HERO_SLIDES,
  HOURS,
  JSON_LD,
  LOGO,
  META,
  PHOTO,
  STAFF,
  carImg,
  fmtPrice,
} from './data'
import type { Car } from './data'

const company = getPreviewCompany('bilas')

/* ── Á STAÐNUM. The whole site is the lot itself: the dealer's own photos
      of the 24 cars physically parked at Smiðjuvellir right now, with the
      price and km printed on every one, browsable in two taps. Night-lot
      asphalt ground, one xenon-blue accent borrowed from headlight glass,
      Anton poster caps. The scroll signature is an odometer readout that
      counts the cars as you walk past them. ─────────────────────────── */
const BG = '#0A0C10'
const SURFACE = '#12151C'
const INK = '#F2F5F9'
const MUT = '#9DA9BA' /* ~7.4:1 on BG */
const XENON = '#8FC6FF' /* ~10.6:1 on BG */
const DARKINK = '#0A0F16' /* on xenon: ~10:1 */
const HAIR = 'rgba(242,245,249,0.13)'

const DISPLAY = "'Anton', sans-serif"
const BODY = "'Space Grotesk', sans-serif"
const MONO = "'Space Mono', monospace"

const EASE = [0.32, 0.72, 0, 1] as const

const CSS = `
  .bilas-page ::selection { background: ${XENON}; color: ${DARKINK}; }
  .bilas-page a:focus-visible, .bilas-page button:focus-visible {
    outline: 2px solid ${XENON}; outline-offset: 3px; border-radius: 2px;
  }
  @keyframes bilas-kenburns {
    from { transform: scale(1.12) translateY(-1.5%); }
    to   { transform: scale(1.0) translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bilas-kenburns { animation: none !important; }
  }
`

/* ── shared reveal: content blocks rise in view; full-bleed backgrounds
      mount-animate instead (IO never fires for self-clipping elements) ── */
function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── nav ── */
function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -64 })
    else el.scrollIntoView()
  }
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(10,12,16,0.82)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#efst" onClick={(e) => { e.preventDefault(); go('efst') }} aria-label="Bílás, efst á síðu">
          <img src={LOGO.src} alt={LOGO.alt} className="h-10 w-auto" />
        </a>
        <nav className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => go('bilar')}
            className="hidden text-[13px] tracking-[0.14em] uppercase md:block"
            style={{ fontFamily: MONO, color: MUT }}
          >
            Bílarnir
          </button>
          <button
            onClick={() => go('salan')}
            className="hidden text-[13px] tracking-[0.14em] uppercase md:block"
            style={{ fontFamily: MONO, color: MUT }}
          >
            Seljum þinn
          </button>
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-transform duration-300 active:scale-[0.97]"
            style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={14} aria-hidden />
            {CONTACT.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  )
}

/* ── hero: a slow, smooth crossfade through five real cars on the lot,
      each with a minimal circular info button that reveals its specs
      without ever leaving the hero or breaking the cinematic frame ── */
const HERO_ROTATE_MS = 5500

function Hero({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)
  const slides = HERO_SLIDES.length ? HERO_SLIDES : [null]
  const car = slides[index]

  useEffect(() => {
    if (reduce || infoOpen || slides.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), HERO_ROTATE_MS)
    return () => clearInterval(t)
  }, [reduce, infoOpen, slides.length])

  /* no overflow masks here: Anton\'s uppercase Í/Á accents overshoot the em
     box and masked lines clip or bleed them. A heavy rise + unblur reads
     just as cinematic and cannot clip a diacritic. */
  const line = (text: string, delay: number) =>
    reduce ? (
      <span className="block">{text}</span>
    ) : (
      <motion.span
        className="block"
        initial={{ y: '0.45em', opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {text}
      </motion.span>
    )
  const goBilar = () => {
    const el = document.getElementById('bilar')
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -64 })
    else el.scrollIntoView()
  }
  return (
    <section id="efst" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0" aria-hidden={!car}>
        {slides.map((s, i) => {
          const src = s ? s.img : PHOTO.heroJaguar
          const active = i === index
          return (
            <motion.img
              key={s ? s.href : 'fallback'}
              src={carImg(src, 1280)}
              srcSet={`${carImg(src, 640)} 640w, ${carImg(src, 784)} 784w, ${carImg(src, 1280)} 1280w`}
              sizes="100vw"
              alt={s ? `${s.make} ${s.model}, á plani Bíláss` : ''}
              // @ts-expect-error React 18 DOM typings want the lowercase attribute
              fetchpriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? undefined : 'lazy'}
              className="bilas-kenburns absolute inset-0 h-full w-full object-cover object-[62%_center]"
              style={{
                animation: reduce || i !== 0 ? 'none' : 'bilas-kenburns 2.6s cubic-bezier(0.32,0.72,0,1) both',
              }}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0.3 : 1.1, ease: EASE }}
            />
          )
        })}
        {/* night-lot wash so the type owns the frame */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${BG} 4%, rgba(10,12,16,0.72) 34%, rgba(10,12,16,0.32) 62%, rgba(10,12,16,0.55) 100%)`,
          }}
        />
      </div>

      {/* minimal info toggle for the car currently on screen */}
      {car && (
        <div className="absolute right-5 top-20 z-20 md:right-8 md:top-24">
          <button
            onClick={() => setInfoOpen((v) => !v)}
            aria-expanded={infoOpen}
            aria-label={infoOpen ? 'Loka upplýsingum um bílinn' : 'Sjá upplýsingar um bílinn á mynd'}
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-200 active:scale-[0.94]"
            style={{
              background: 'rgba(10,12,16,0.42)',
              borderColor: 'rgba(242,245,249,0.28)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: INK,
            }}
          >
            {infoOpen ? <X size={18} aria-hidden /> : <Info size={18} aria-hidden />}
          </button>

          <AnimatePresence>
            {infoOpen && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="absolute right-0 top-14 w-64 rounded-2xl border p-5"
                style={{
                  background: 'rgba(10,12,16,0.72)',
                  borderColor: 'rgba(242,245,249,0.16)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="text-[18px] uppercase leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
                  {car.make} <span style={{ color: MUT }}>{car.model}</span>
                </div>
                <div className="mt-2 text-[12px]" style={{ fontFamily: MONO, color: MUT }}>
                  {car.reg}{car.km ? ` · ${car.km}` : ''} · {car.fuel}
                </div>
                <div className="mt-3 text-[20px]" style={{ fontFamily: MONO, color: XENON }}>
                  {fmtPrice(car)}
                </div>
                <a
                  href={car.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
                  style={{ color: INK, fontFamily: BODY }}
                >
                  Skoða nánar
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-28 md:px-8 md:pb-20">
        <h1
          /* leading 1.16 minimum: Anton draws uppercase acutes (Í, Á) high
             and detached, so at tighter leading line 2\'s Á accent reads as
             a mark under line 1. Do not tighten this. */
          className="max-w-6xl text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[1.16]"
          style={{ fontFamily: DISPLAY, color: INK }}
        >
          {line('Næsti bíllinn þinn \u00a0', 0.15)}
          {line('er á staðnum.', 0.3)}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          className="mt-6 max-w-xl text-base md:text-lg"
          style={{ color: INK, fontFamily: BODY }}
        >
          {CARS.length} bílar á planinu á Akranesi. Verð, akstur og myndir birt á hverjum einasta.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={goBilar}
            className="group flex items-center gap-3 rounded-full py-3 pl-6 pr-2 text-[15px] font-semibold transition-transform duration-300 active:scale-[0.97]"
            style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
          >
            Skoða bílana
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-y-0.5"
              style={{ background: 'rgba(10,15,22,0.14)' }}
            >
              <ArrowDown size={16} aria-hidden />
            </span>
          </button>
          <a
            href={CONTACT.phoneHref}
            className="rounded-full border px-6 py-3 text-[15px] font-medium transition-colors duration-300 hover:border-white/60"
            style={{ borderColor: 'rgba(242,245,249,0.35)', color: INK, fontFamily: BODY }}
          >
            Hringja í {CONTACT.phoneDisplay}
          </a>

          {slides.length > 1 && (
            <div className="ml-auto flex items-center gap-2" aria-hidden>
              {slides.map((s, i) => (
                <span
                  key={s ? s.href : i}
                  className="h-1 rounded-full transition-[width,background-color] duration-500"
                  style={{ width: i === index ? 22 : 8, background: i === index ? XENON : 'rgba(242,245,249,0.3)' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ── inventory browser: filters + odometer + the 24 real cars ── */
type FuelFilter = 'allir' | 'bensin' | 'disel' | 'rafmagn' | 'hybrid' | 'tilbod'

const FILTERS: { key: FuelFilter; label: string }[] = [
  { key: 'allir', label: 'Allir' },
  { key: 'bensin', label: 'Bensín' },
  { key: 'disel', label: 'Dísel' },
  { key: 'rafmagn', label: 'Rafmagn' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'tilbod', label: 'Tilboð' },
]

function matches(c: Car, f: FuelFilter): boolean {
  switch (f) {
    case 'allir': return true
    case 'bensin': return c.fuel === 'Bensín'
    case 'disel': return c.fuel === 'Dísel'
    case 'rafmagn': return c.fuel === 'Rafmagn'
    case 'hybrid': return c.fuel.includes('/')
    case 'tilbod': return c.tilbod
  }
}

const MAKES = Array.from(new Set(CARS.map((c) => c.make))).sort()
type GearFilter = 'allir' | 'Sjálfskipting' | 'Beinskipting'

/* a single aesthetic "more filters" dropdown (make + price range + gearbox)
   layered on top of the fuel chips + search box, closes on outside click */
function FiltersDropdown({
  make, setMake, gear, setGear, minPrice, setMinPrice, maxPrice, setMaxPrice,
}: {
  make: string
  setMake: (v: string) => void
  gear: GearFilter
  setGear: (v: GearFilter) => void
  minPrice: string
  setMinPrice: (v: string) => void
  maxPrice: string
  setMaxPrice: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const activeCount = (make !== 'allir' ? 1 : 0) + (gear !== 'allir' ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const reset = () => { setMake('allir'); setGear('allir'); setMinPrice(''); setMaxPrice('') }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97]"
        style={{
          fontFamily: BODY,
          background: activeCount ? XENON : 'transparent',
          color: activeCount ? DARKINK : INK,
          borderColor: activeCount ? XENON : HAIR,
        }}
      >
        <SlidersHorizontal size={14} aria-hidden />
        Fleiri síur
        {activeCount > 0 && (
          <span
            className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
            style={{ background: DARKINK, color: XENON, fontFamily: MONO }}
          >
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Fleiri síur"
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute left-0 top-[calc(100%+10px)] z-30 w-[300px] rounded-2xl border p-5"
            style={{
              background: 'rgba(18,21,28,0.92)',
              borderColor: HAIR,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <label className="block text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
              Tegund
            </label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
              style={{ background: BG, borderColor: HAIR, color: INK, fontFamily: BODY }}
            >
              <option value="allir">Allar tegundir</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <label className="mt-5 block text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
              Verðbil (kr.)
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Frá"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                aria-label="Verð frá, kr."
                className="w-full min-w-0 rounded-lg border px-3 py-2.5 text-[14px] outline-none"
                style={{ background: BG, borderColor: HAIR, color: INK, fontFamily: MONO }}
              />
              <span style={{ color: MUT }} aria-hidden>–</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Til"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Verð til, kr."
                className="w-full min-w-0 rounded-lg border px-3 py-2.5 text-[14px] outline-none"
                style={{ background: BG, borderColor: HAIR, color: INK, fontFamily: MONO }}
              />
            </div>

            <label className="mt-5 block text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
              Gírkassi
            </label>
            <div className="mt-2 flex gap-2">
              {(['allir', 'Sjálfskipting', 'Beinskipting'] as const).map((g) => {
                const gActive = gear === g
                return (
                  <button
                    key={g}
                    onClick={() => setGear(g)}
                    aria-pressed={gActive}
                    className="flex-1 rounded-lg border py-2 text-[13px] transition-colors duration-200"
                    style={{
                      background: gActive ? XENON : 'transparent',
                      color: gActive ? DARKINK : INK,
                      borderColor: gActive ? XENON : HAIR,
                      fontFamily: BODY,
                    }}
                  >
                    {g === 'allir' ? 'Allir' : g}
                  </button>
                )
              })}
            </div>

            {activeCount > 0 && (
              <button
                onClick={reset}
                className="mt-5 w-full rounded-lg border py-2 text-[13px] transition-colors duration-200"
                style={{ borderColor: HAIR, color: MUT, fontFamily: BODY }}
              >
                Núllstilla síur
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CarCard({ car, index }: { car: Car; index: number }) {
  return (
    <motion.a
      layout
      href={car.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4), ease: EASE }}
      className="group block"
      data-bilas-car
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl" style={{ background: SURFACE }}>
        <img
          src={carImg(car.img, 784)}
          alt={`${car.make} ${car.model}, ${car.reg}, á plani Bíláss`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] group-hover:opacity-0"
        />
        <img
          src={carImg(car.img2, 784)}
          alt=""
          loading="lazy"
          aria-hidden
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[20px] uppercase leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
            {car.make} <span style={{ color: MUT }}>{car.model}</span>
          </div>
          <div className="mt-1.5 text-[12px]" style={{ fontFamily: MONO, color: MUT }}>
            {car.reg}
            {car.km ? ` · ${car.km}` : ''}
            {` · ${car.fuel}`}
            {car.gear ? ` · ${car.gear}` : ''}
          </div>
        </div>
        <ArrowUpRight size={18} style={{ color: MUT }} className="mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-[17px]" style={{ fontFamily: MONO, color: car.tilbod ? XENON : INK }}>
          {fmtPrice(car)}
        </span>
        {car.tilbod && (
          <span className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: XENON }}>
            Tilboð
          </span>
        )}
      </div>
    </motion.a>
  )
}

function Inventory() {
  const [filter, setFilter] = useState<FuelFilter>('allir')
  const [query, setQuery] = useState('')
  const [make, setMake] = useState('allir')
  const [gear, setGear] = useState<GearFilter>('allir')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [asc, setAsc] = useState(true)
  const [seen, setSeen] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)

  const q = query.trim().toLowerCase()
  const min = minPrice ? Number(minPrice) : null
  const max = maxPrice ? Number(maxPrice) : null
  const cars = useMemo(() => {
    const list = CARS.filter(
      (c) =>
        matches(c, filter) &&
        (!q || `${c.make} ${c.model}`.toLowerCase().includes(q)) &&
        (make === 'allir' || c.make === make) &&
        (gear === 'allir' || c.gear === gear) &&
        (min === null || c.priceNum >= min) &&
        (max === null || c.priceNum <= max),
    )
    return [...list].sort((a, b) => (asc ? a.priceNum - b.priceNum : b.priceNum - a.priceNum))
  }, [filter, asc, q, make, gear, min, max])

  const moreFiltersActive = make !== 'allir' || gear !== 'allir' || minPrice !== '' || maxPrice !== ''

  /* the odometer: counts the cars you have walked past. Synchronous scroll
     handler (rAF is throttled in embedded previews; this is verifiable). */
  useEffect(() => {
    const on = () => {
      const grid = gridRef.current
      if (!grid) return
      const cards = grid.querySelectorAll('[data-bilas-car]')
      const mid = window.innerHeight * 0.55
      let n = 0
      cards.forEach((el) => {
        if (el.getBoundingClientRect().top < mid) n++
      })
      setSeen(Math.max(1, Math.min(n, cards.length)))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [cars.length])

  return (
    <section id="bilar" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <Rise>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(2.6rem,6vw,5rem)] uppercase leading-none" style={{ fontFamily: DISPLAY, color: INK }}>
            Á staðnum
          </h2>
          <p className="max-w-sm text-[15px]" style={{ color: MUT, fontFamily: BODY }}>
            Hver einasti bíll hér stendur á planinu við Smiðjuvelli. Ýttu á bíl til að sjá allar myndir og skoðunarferil.
          </p>
        </div>
      </Rise>

      <Rise delay={0.1}>
        <div className="relative mt-10 max-w-md">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: MUT }} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Leita eftir tegund eða gerð, t.d. Volvo"
            aria-label="Leita í bílunum á staðnum"
            className="w-full rounded-full border py-3 pl-11 pr-4 text-[14px] outline-none transition-colors duration-200"
            style={{ background: SURFACE, borderColor: HAIR, color: INK, fontFamily: BODY }}
            onFocus={(e) => (e.currentTarget.style.borderColor = XENON)}
            onBlur={(e) => (e.currentTarget.style.borderColor = HAIR)}
          />
        </div>
      </Rise>

      <Rise delay={0.15}>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key
            const count = CARS.filter((c) => matches(c, f.key)).length
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className="rounded-full border px-4 py-2 text-[13px] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97]"
                style={{
                  fontFamily: BODY,
                  background: active ? XENON : 'transparent',
                  color: active ? DARKINK : INK,
                  borderColor: active ? XENON : HAIR,
                }}
              >
                {f.label} <span style={{ fontFamily: MONO, opacity: 0.75 }}>{count}</span>
              </button>
            )
          })}
          <FiltersDropdown
            make={make}
            setMake={setMake}
            gear={gear}
            setGear={setGear}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
          <button
            onClick={() => setAsc((v) => !v)}
            className="ml-auto rounded-full border px-4 py-2 text-[13px] transition-[border-color,transform] duration-200 active:scale-[0.97]"
            style={{ fontFamily: MONO, color: MUT, borderColor: HAIR }}
            aria-label={asc ? 'Raða eftir verði, lægsta fyrst' : 'Raða eftir verði, hæsta fyrst'}
          >
            Verð {asc ? '↑' : '↓'}
          </button>
        </div>
      </Rise>

      <div className="relative mt-12 lg:grid lg:grid-cols-[72px_1fr] lg:gap-10">
        {/* the odometer rail: hidden with zero results, nothing to count */}
        <div className={cars.length ? 'hidden lg:block' : 'hidden'}>
          <div className="sticky top-28 select-none" aria-hidden>
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: MUT }}>
              Bíll
            </div>
            <div className="mt-1 tabular-nums text-[28px] leading-none" style={{ fontFamily: MONO, color: XENON }}>
              {String(seen).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[13px] tabular-nums" style={{ fontFamily: MONO, color: MUT }}>
              / {String(cars.length).padStart(2, '0')}
            </div>
            <div className="mt-4 h-40 w-px overflow-hidden rounded-full" style={{ background: HAIR }}>
              <div
                className="w-full rounded-full transition-[height] duration-300"
                style={{ background: XENON, height: `${(seen / Math.max(cars.length, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((c, i) => (
            <CarCard key={c.href} car={c} index={i} />
          ))}
        </div>
      </div>

      {cars.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-[15px]" style={{ color: MUT, fontFamily: BODY }}>
            {q
              ? `Enginn bíll fannst fyrir „${query.trim()}“.`
              : 'Enginn bíll passar við þessa síu núna.'}{' '}
            Hringdu í {CONTACT.phoneDisplay}, næsta sending gæti verið á leiðinni.
          </p>
          {(q || filter !== 'allir' || moreFiltersActive) && (
            <button
              onClick={() => {
                setQuery('')
                setFilter('allir')
                setMake('allir')
                setGear('allir')
                setMinPrice('')
                setMaxPrice('')
              }}
              className="mt-4 rounded-full border px-5 py-2 text-[13px] transition-colors duration-200"
              style={{ borderColor: HAIR, color: INK, fontFamily: BODY }}
            >
              Hreinsa leit og síur
            </button>
          )}
        </div>
      )}
    </section>
  )
}

/* ── the lot itself: their real premises photo, full bleed ── */
function Lot() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: 'inset(12% 0% 12% 0%)', scale: 1.06 }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        aria-hidden
      >
        <img
          src={carImg(PHOTO.lotLandRover, 1280)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,12,16,0.68)' }} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-28 md:px-8 md:py-44">
        <Rise>
          <h2 className="max-w-4xl text-[clamp(2.4rem,5.5vw,4.5rem)] uppercase leading-[1.06]" style={{ fontFamily: DISPLAY, color: INK }}>
            Við þjóðveginn á Akranesi síðan 2007
          </h2>
        </Rise>
        <Rise delay={0.12}>
          <p className="mt-6 max-w-xl text-base md:text-lg" style={{ color: INK, fontFamily: BODY }}>
            Bílás er söluumboð fyrir BL og þjónustar allt Vesturland. Reynsluakstur tekur 20 mínútur og enginn þrýstingur fylgir honum.
          </p>
        </Rise>
        <div className="mt-14 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { n: String(CARS.length), l: 'bílar á planinu núna' },
            { n: '2007', l: 'starfandi frá, kt. skráð' },
            { n: '20 mín', l: 'reynsluakstur í boði' },
          ].map((s, i) => (
            <Rise key={s.l} delay={0.15 + i * 0.08}>
              <div className="border-t pt-4" style={{ borderColor: 'rgba(242,245,249,0.3)' }}>
                <div className="text-[34px] leading-none" style={{ fontFamily: MONO, color: XENON }}>{s.n}</div>
                <div className="mt-2 text-[14px]" style={{ color: INK, fontFamily: BODY }}>{s.l}</div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── verðskrá: the transparency they already practice, given a stage ── */
function Fees() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <Rise>
        <h2 className="text-[clamp(2.4rem,5.5vw,4.5rem)] uppercase leading-none" style={{ fontFamily: DISPLAY, color: INK }}>
          Verðskráin er opinber
        </h2>
        <p className="mt-5 max-w-xl text-[15px]" style={{ color: MUT, fontFamily: BODY }}>
          Sölulaunin standa á vefnum okkar, óbreytt fyrir alla. Það sem þú sérð hér er það sem þú borgar.
        </p>
      </Rise>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {FEES.sale.map((f, i) => (
          <Rise key={f.range} delay={i * 0.08}>
            <div className="rounded-2xl border p-7" style={{ borderColor: HAIR, background: SURFACE }}>
              <div className="text-[13px]" style={{ fontFamily: MONO, color: MUT }}>{f.range}</div>
              <div className="mt-4 text-[30px] leading-none" style={{ fontFamily: MONO, color: INK }}>{f.fee}</div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={0.2}>
        <ul className="mt-8 flex flex-col gap-2 md:flex-row md:gap-10">
          {FEES.notes.map((n) => (
            <li key={n} className="text-[14px]" style={{ color: MUT, fontFamily: BODY }}>
              {n}
            </li>
          ))}
        </ul>
      </Rise>
    </section>
  )
}

/* ── sell-your-car split: the one 50/50, photo answers the headline ── */
function Sell() {
  return (
    <section id="salan" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Rise>
            <h2 className="text-[clamp(2.4rem,5.5vw,4.5rem)] uppercase leading-[1.06]" style={{ fontFamily: DISPLAY, color: INK }}>
              Við seljum bílinn þinn
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-6 max-w-lg text-base" style={{ color: MUT, fontFamily: BODY }}>
              Komdu með bílinn á planið. Við myndum hann, skráum hann á bilas.is og bilasolur.is og sjáum um eigendaskiptin þegar hann selst. Verðskráin að ofan gildir, engin aukagjöld.
            </p>
          </Rise>
          <Rise delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Bíll í sölu')}`}
                className="group flex items-center gap-3 rounded-full py-3 pl-6 pr-2 text-[15px] font-semibold transition-transform duration-300 active:scale-[0.97]"
                style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
              >
                Senda póst á Alexander
                <span className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ background: 'rgba(10,15,22,0.14)' }}>
                  <ArrowUpRight size={16} aria-hidden />
                </span>
              </a>
            </div>
          </Rise>
        </div>
        <Rise delay={0.12}>
          <div className="overflow-hidden rounded-2xl">
            <motion.img
              src={carImg(PHOTO.audiSunny, 1280)}
              alt="Audi A5 Sportback í sölu hjá Bílás, merktur BILAS.IS skiltum á planinu"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </div>
        </Rise>
      </div>
    </section>
  )
}

/* ── visit: real people, real hours, the map ── */
function Visit() {
  return (
    <section className="border-t" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          <Rise>
            <div>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] uppercase leading-none" style={{ fontFamily: DISPLAY, color: INK }}>
                Opið virka daga 9-17
              </h2>
              <dl className="mt-8 flex flex-col gap-3">
                {HOURS.map((h) => (
                  <div key={h.d} className="flex items-baseline justify-between gap-6 border-b pb-3" style={{ borderColor: HAIR }}>
                    <dt className="text-[14px]" style={{ color: MUT, fontFamily: BODY }}>{h.d}</dt>
                    <dd className="text-[14px]" style={{ fontFamily: MONO, color: INK }}>{h.t}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[13px]" style={{ color: MUT, fontFamily: BODY }}>
                Neyðarsími bílaleigu: <a href={CONTACT.emergencyHref} className="inline-flex items-center py-2" style={{ color: INK }}>{CONTACT.emergencyDisplay}</a>
              </p>
            </div>
          </Rise>

          {STAFF.map((p, i) => (
            <Rise key={p.name} delay={0.1 + i * 0.08}>
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border" style={{ borderColor: HAIR }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.photo}
                    alt={`${p.name}, ${p.role} hjá Bílás`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,12,16,0.55), transparent 55%)' }} />
                </div>
                <div className="flex flex-1 flex-col justify-between p-7">
                  <div>
                    <div className="text-[24px] uppercase leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>{p.name}</div>
                    <div className="mt-2 text-[14px]" style={{ color: MUT, fontFamily: BODY }}>{p.role}</div>
                  </div>
                  <div className="mt-10 flex flex-col gap-1">
                    <a href={`mailto:${p.email}`} className="inline-flex items-center py-2 text-[14px] underline-offset-4 hover:underline" style={{ fontFamily: MONO, color: XENON }}>
                      {p.email}
                    </a>
                    <a href={CONTACT.phoneHref} className="inline-flex items-center py-2 text-[14px]" style={{ fontFamily: MONO, color: MUT }}>
                      s. {CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={0.2}>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noreferrer"
            className="mt-12 flex items-center justify-between gap-4 rounded-2xl border p-7 transition-colors duration-300 hover:border-white/40"
            style={{ borderColor: HAIR }}
          >
            <span className="flex items-center gap-4">
              <MapPin size={20} style={{ color: XENON }} aria-hidden />
              <span className="text-[16px]" style={{ color: INK, fontFamily: BODY }}>{CONTACT.address}</span>
            </span>
            <span className="text-[13px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT }}>
              Opna kort
            </span>
          </a>
        </Rise>
      </div>
    </section>
  )
}

/* ── final poster ── */
function Outro() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 text-center md:px-8 md:py-40">
      <Rise>
        <h2 className="text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.92]" style={{ fontFamily: DISPLAY, color: INK }}>
          Komdu á planið.
        </h2>
      </Rise>
      <Rise delay={0.12}>
        <p className="mx-auto mt-6 max-w-md text-[15px]" style={{ color: MUT, fontFamily: BODY }}>
          {CONTACT.addressDat}. Kaffið er heitt og lyklarnir eru á staðnum.
        </p>
      </Rise>
      <Rise delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CONTACT.phoneHref}
            className="rounded-full px-7 py-3.5 text-[15px] font-semibold transition-transform duration-300 active:scale-[0.97]"
            style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
          >
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-7 py-3.5 text-[15px] font-medium transition-colors duration-300 hover:border-white/60"
            style={{ borderColor: 'rgba(242,245,249,0.35)', color: INK, fontFamily: BODY }}
          >
            Opna kort
          </a>
        </div>
      </Rise>
    </section>
  )
}

/* ── mobile sticky bar ── */
function StickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t px-5 py-3 md:hidden"
      style={{ background: 'rgba(10,12,16,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: HAIR }}
    >
      <a href="#bilar" className="flex items-center py-2 text-[14px] font-medium" style={{ color: INK, fontFamily: BODY }}>
        {CARS.length} bílar á staðnum
      </a>
      <a
        href={CONTACT.phoneHref}
        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold"
        style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
      >
        <Phone size={14} aria-hidden />
        Hringja
      </a>
    </div>
  )
}

/* ── the page ── */
export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = META.title
    setThemeColor(BG)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1 })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div className="bilas-page min-h-screen overflow-x-clip pb-16 antialiased md:pb-0" style={{ background: BG, color: INK, fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero lenisRef={lenisRef} />
        <Inventory />
        <Lot />
        <Fees />
        <Sell />
        <Visit />
        <Outro />
      </main>
      <div className="px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
      <StickyBar />
    </div>
  )
}
