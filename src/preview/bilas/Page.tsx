import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Info, MapPin, Menu as MenuIcon, Phone, Search, X } from 'lucide-react'
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
import { carKm, parseQuery, searchCars } from './search'

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
  /* the real dealer photos used in the hero all share the same overcast-sky
     glare band across their top ~10% (baked into the source photos, not a
     rendering bug). object-cover never crops that away on a tall mobile
     viewport since the image's full height already fits, so every slide
     bakes in a small permanent zoom + downward shift to crop it out. */
  @keyframes bilas-kenburns {
    from { transform: scale(1.24) translateY(-6%); }
    to   { transform: scale(1.1) translateY(-4%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bilas-kenburns { animation: none !important; }
  }
  /* dual-handle range slider: two native inputs overlaid; only the thumbs
     receive pointer events so both handles stay grabbable even overlapping.
     Touch zone is 40px tall (finger-friendly) even though the visible
     track/thumb stay slim; touch-action:none stops iOS Safari from
     fighting a near-vertical drag into a page-scroll gesture. */
  .bilas-range { position: relative; height: 40px; }
  .bilas-range-track { position: absolute; left: 0; right: 0; top: 50%; height: 4px; transform: translateY(-50%); border-radius: 9999px; background: rgba(242,245,249,0.14); }
  .bilas-range-fill { position: absolute; top: 50%; height: 4px; transform: translateY(-50%); border-radius: 9999px; background: ${XENON}; }
  .bilas-range input[type=range] { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; background: transparent; pointer-events: none; touch-action: none; -webkit-appearance: none; appearance: none; }
  .bilas-range input[type=range]:focus { outline: none; }
  .bilas-range input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: 24px; height: 24px; border-radius: 9999px; background: ${XENON}; border: 3px solid ${BG}; box-shadow: 0 1px 5px rgba(0,0,0,0.5); cursor: grab; transition: transform 0.15s ${`cubic-bezier(0.32,0.72,0,1)`}; }
  .bilas-range input[type=range]::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
  .bilas-range input[type=range]::-moz-range-thumb { pointer-events: auto; width: 24px; height: 24px; border: 3px solid ${BG}; border-radius: 9999px; background: ${XENON}; box-shadow: 0 1px 5px rgba(0,0,0,0.5); cursor: grab; }
  .bilas-range input[type=range]::-moz-range-track { background: transparent; border: none; }
  .bilas-range input[type=range]:focus-visible::-webkit-slider-thumb { outline: 2px solid ${XENON}; outline-offset: 2px; }
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
const NAV_LINKS = [
  { id: 'bilar', label: 'Bílarnir' },
  { id: 'salan', label: 'Seljum þinn' },
]

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -64 })
    else el.scrollIntoView()
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
      style={{
        background: solid || menuOpen ? 'rgba(10,12,16,0.92)' : 'transparent',
        backdropFilter: solid || menuOpen ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid || menuOpen ? 'blur(14px)' : 'none',
        borderBottom: solid || menuOpen ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#efst" onClick={(e) => { e.preventDefault(); go('efst') }} aria-label="Bílás, efst á síðu">
          {/* drop-shadow, not a scrim: reads on any photo behind it without
              putting a visible box around the logo */}
          <img
            src={LOGO.src}
            alt={LOGO.alt}
            className="h-10 w-auto"
            style={{ filter: solid ? 'none' : 'drop-shadow(0 1px 5px rgba(0,0,0,0.65)) drop-shadow(0 0 14px rgba(0,0,0,0.35))' }}
          />
        </a>
        <nav className="flex items-center gap-3 md:gap-6">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="hidden text-[13px] tracking-[0.14em] uppercase md:block"
              style={{ fontFamily: MONO, color: solid ? MUT : '#E4E9EF', textShadow: solid ? 'none' : '0 1px 5px rgba(0,0,0,0.75)' }}
            >
              {l.label}
            </button>
          ))}
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-transform duration-300 active:scale-[0.97]"
            style={{ background: XENON, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={14} aria-hidden />
            {CONTACT.phoneDisplay}
          </a>
          {/* mobile menu: the two nav destinations are otherwise unreachable
              on small screens (hidden md:block above has no fallback) */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300"
              style={{
                background: solid || menuOpen ? 'transparent' : 'rgba(10,12,16,0.42)',
                borderColor: solid || menuOpen ? HAIR : 'rgba(242,245,249,0.28)',
                color: INK,
                backdropFilter: solid || menuOpen ? 'none' : 'blur(10px)',
                WebkitBackdropFilter: solid || menuOpen ? 'none' : 'blur(10px)',
              }}
            >
              {menuOpen ? <X size={19} aria-hidden /> : <MenuIcon size={19} aria-hidden />}
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: EASE }}
                  className="absolute right-0 top-[calc(100%+10px)] z-30 w-[190px] overflow-hidden rounded-2xl border"
                  style={{ background: 'rgba(18,21,28,0.98)', borderColor: HAIR }}
                >
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => go(l.id)}
                      className="block w-full px-5 py-3.5 text-left text-[14px]"
                      style={{ fontFamily: BODY, color: INK, borderBottom: `1px solid ${HAIR}` }}
                    >
                      {l.label}
                    </button>
                  ))}
                  <a
                    href={CONTACT.phoneHref}
                    className="block w-full px-5 py-3.5 text-[14px]"
                    style={{ fontFamily: BODY, color: XENON }}
                  >
                    Hringja í {CONTACT.phoneDisplay}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                /* baseline crop for slides that never run the animation
                   (reduced motion, or any slide after the first); matches
                   the kenburns "to" keyframe so every slide crops the same
                   top glare band out consistently */
                transform: reduce || i !== 0 ? 'scale(1.1) translateY(-4%)' : undefined,
              }}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0.3 : 1.1, ease: EASE }}
            />
          )
        })}
        {/* night-lot wash so the type owns the frame. Kept light at the very
            top: a strong scrim there flattened the bright sky into a grey
            band. Only a thin nav-legibility scrim survives up there. */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${BG} 4%, rgba(10,12,16,0.72) 30%, rgba(10,12,16,0.16) 58%, rgba(10,12,16,0.22) 100%)`,
          }}
        />
        {/* a second, tightly-contained vignette just for the fixed nav above
            it: the wide wash alone isn't enough for the logo/links to read
            against a bright sky. Short falloff (~140px) reads as a soft
            vignette, not a flat band, and stays clear of the headline. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-36"
          style={{ background: 'linear-gradient(to bottom, rgba(4,6,9,0.6), rgba(4,6,9,0.22) 60%, transparent)' }}
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

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          className="mt-5 text-[11px] uppercase tracking-[0.14em]"
          style={{ fontFamily: MONO, color: MUT }}
        >
          {HOURS[0].d}: {HOURS[0].t} · Lokað um helgar
        </motion.p>
      </div>
    </section>
  )
}

/* ── inventory browser: filters + odometer + the 24 real cars ── */
const MAKES = Array.from(new Set(CARS.map((c) => c.make))).sort()

type Filters = {
  price: [number, number]
  year: [number, number]
  km: [number, number]
  make: string
  fuel: string
  gear: string
  tilbod: boolean
}

/* data-driven slider bounds (rounded to friendly steps) */
const carYear = (c: Car) => Number(c.reg.split('/')[1])
const PRICE_MIN = Math.floor(Math.min(...CARS.map((c) => c.priceNum)) / 100000) * 100000
const PRICE_MAX = Math.ceil(Math.max(...CARS.map((c) => c.priceNum)) / 100000) * 100000
const YEAR_MIN = Math.min(...CARS.map(carYear))
const YEAR_MAX = Math.max(...CARS.map(carYear))
const KM_VALUES = CARS.map(carKm).filter((v): v is number => v !== null)
const KM_MIN = 0
const KM_MAX = Math.ceil(Math.max(...KM_VALUES) / 10000) * 10000

const DEFAULT_FILTERS: Filters = {
  price: [PRICE_MIN, PRICE_MAX],
  year: [YEAR_MIN, YEAR_MAX],
  km: [KM_MIN, KM_MAX],
  make: '', fuel: '', gear: '', tilbod: false,
}

const FUELS = ['Bens\u00edn', 'D\u00edsel', 'Rafmagn', 'Hybrid']
const GEARS = ['Sj\u00e1lfskipting', 'Beinskipting']

function fuelMatch(c: Car, f: string): boolean {
  if (f === 'Hybrid') return c.fuel.includes('/')
  return c.fuel === f
}

/* applies the structured filters to a car (text search handled separately) */
function passesFilters(c: Car, f: Filters): boolean {
  if (f.price[0] > PRICE_MIN || f.price[1] < PRICE_MAX) {
    if (c.priceNum < f.price[0] || c.priceNum > f.price[1]) return false
  }
  if (f.year[0] > YEAR_MIN || f.year[1] < YEAR_MAX) {
    const y = carYear(c)
    if (y < f.year[0] || y > f.year[1]) return false
  }
  if (f.km[0] > KM_MIN || f.km[1] < KM_MAX) {
    const km = carKm(c)
    if (km === null || km < f.km[0] || km > f.km[1]) return false
  }
  if (f.make && c.make !== f.make) return false
  if (f.fuel && !fuelMatch(c, f.fuel)) return false
  if (f.gear && c.gear !== f.gear) return false
  if (f.tilbod && !c.tilbod) return false
  return true
}

function filtersActive(f: Filters): boolean {
  return (
    f.price[0] > PRICE_MIN || f.price[1] < PRICE_MAX ||
    f.year[0] > YEAR_MIN || f.year[1] < YEAR_MAX ||
    f.km[0] > KM_MIN || f.km[1] < KM_MAX ||
    Boolean(f.make || f.fuel || f.gear || f.tilbod)
  )
}

const fmtM = (v: number) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace('.', ',')}M` : `${Math.round(v / 1000)}\u00fe`)
const fmtKmShort = (v: number) => `${Math.round(v / 1000)}\u00fe`

/* dual-handle range slider (see .bilas-range CSS) */
function RangeSlider({
  min, max, step, value, onChange, format,
}: {
  min: number; max: number; step: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  format: (v: number) => string
}) {
  const [lo, hi] = value
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="bilas-range mt-3.5" aria-hidden={false}>
      <div className="bilas-range-track" />
      <div className="bilas-range-fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      <input
        type="range" min={min} max={max} step={step} value={lo}
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        aria-label={`L\u00e1gmark: ${format(lo)}`}
      />
      <input
        type="range" min={min} max={max} step={step} value={hi}
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        aria-label={`H\u00e1mark: ${format(hi)}`}
      />
    </div>
  )
}

/* styled native select with a chevron */
function FilterSelect({
  label, value, onChange, options, allLabel,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: string[]; allLabel: string
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-9 text-[13px] outline-none transition-colors duration-200"
          style={{ background: BG, borderColor: value ? XENON : HAIR, color: value ? INK : MUT, fontFamily: BODY }}
        >
          <option value="">{allLabel}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: MUT }} aria-hidden />
      </div>
    </label>
  )
}

/* the aesthetic filter card: sliders for price/year/km, selects for the rest */
function FilterPanel({ filters, setFilters, resultCount }: { filters: Filters; setFilters: (f: Filters) => void; resultCount: number }) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v })
  const active = filtersActive(filters)
  const sliders: { key: 'price' | 'year' | 'km'; label: string; min: number; max: number; step: number; format: (v: number) => string; readout: string }[] = [
    { key: 'price', label: 'Ver\u00f0', min: PRICE_MIN, max: PRICE_MAX, step: 50000, format: fmtM, readout: `${fmtM(filters.price[0])} \u2013 ${fmtM(filters.price[1])} kr.` },
    { key: 'year', label: '\u00c1rger\u00f0', min: YEAR_MIN, max: YEAR_MAX, step: 1, format: (v) => String(v), readout: `${filters.year[0]} \u2013 ${filters.year[1]}` },
    { key: 'km', label: 'Akstur', min: KM_MIN, max: KM_MAX, step: 5000, format: fmtKmShort, readout: `${fmtKmShort(filters.km[0])} \u2013 ${fmtKmShort(filters.km[1])} km` },
  ]
  return (
    <div className="rounded-2xl border p-5 md:p-6" style={{ background: SURFACE, borderColor: HAIR }}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>{s.label}</span>
              <span className="text-[12px] tabular-nums" style={{ fontFamily: MONO, color: INK }}>{s.readout}</span>
            </div>
            <RangeSlider
              min={s.min} max={s.max} step={s.step} format={s.format}
              value={filters[s.key]}
              onChange={(v) => set(s.key, v)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3" style={{ borderColor: HAIR }}>
        <FilterSelect label="Tegund" value={filters.make} onChange={(v) => set('make', v)} options={MAKES} allLabel="Allar tegundir" />
        <FilterSelect label="Eldsneyti" value={filters.fuel} onChange={(v) => set('fuel', v)} options={FUELS} allLabel="Allt eldsneyti" />
        <FilterSelect label="Skipting" value={filters.gear} onChange={(v) => set('gear', v)} options={GEARS} allLabel="Allar skiptingar" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => set('tilbod', !filters.tilbod)}
          aria-pressed={filters.tilbod}
          className="flex items-center gap-2.5 rounded-full border py-2.5 pl-2.5 pr-4 text-[13px] transition-colors duration-200"
          style={{ borderColor: filters.tilbod ? XENON : HAIR, color: INK, fontFamily: BODY }}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200"
            style={{ background: filters.tilbod ? XENON : 'transparent', border: filters.tilbod ? 'none' : `1px solid ${HAIR}` }}
          >
            {filters.tilbod && <Check size={13} style={{ color: DARKINK }} aria-hidden />}
          </span>
          Aðeins tilboð
        </button>

        <div className="flex items-center gap-4">
          <span className="text-[13px] tabular-nums" style={{ fontFamily: MONO, color: MUT }}>{resultCount} bílar</span>
          {active && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-[13px] underline-offset-4 hover:underline"
              style={{ fontFamily: BODY, color: XENON }}
            >
              Hreinsa síur
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* the whole "search engine": one input, one dropdown with everything -
   quick picks + every make when empty, live results (thumb+make+price)
   once you type. Keyboard up/down/enter, closes on outside click/escape. */
function SearchEngine({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  const q = query.trim()
  const parsed = useMemo(() => parseQuery(q), [q])
  const results = useMemo(() => (q ? searchCars(CARS, q).map((r) => r.car) : []), [q])

  useEffect(() => { setHi(0) }, [q])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return }
      if (!results.length) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setHi((i) => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHi((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && results[hi]) window.open(results[hi].href, '_blank', 'noreferrer')
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, results, hi])

  return (
    <div className="relative" ref={ref}>
      <Search size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2" style={{ color: MUT }} aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Leitaðu að tegund eða gerð..."
        aria-label="Leita í bílunum á staðnum"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full rounded-full border py-3 pl-11 pr-10 text-[14px] outline-none transition-colors duration-200"
        style={{ background: SURFACE, borderColor: open ? XENON : HAIR, color: INK, fontFamily: BODY }}
      />
      {query && (
        <button
          onClick={() => { setQuery(''); inputRef.current?.focus() }}
          aria-label="Hreinsa leit"
          className="absolute right-3.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ color: MUT }}
        >
          <X size={15} aria-hidden />
        </button>
      )}

      <AnimatePresence>
        {open && q && (
          <motion.div
            role="listbox"
            aria-label="Leitarniðurstöður"
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="absolute left-0 top-[calc(100%+10px)] z-30 max-h-[540px] w-[min(88vw,560px)] overflow-y-auto rounded-2xl border p-3"
            style={{
              background: 'rgba(18,21,28,0.96)',
              borderColor: HAIR,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {q && parsed.understood.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-1.5 border-b px-2 pb-2.5 pt-1" style={{ borderColor: HAIR }}>
                <span className="mr-1 text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
                  Skilið sem
                </span>
                {parsed.understood.map((u) => (
                  <span
                    key={u}
                    className="rounded-full px-2.5 py-1 text-[11px]"
                    style={{ background: 'rgba(143,198,255,0.14)', color: XENON, fontFamily: MONO }}
                  >
                    {u}
                  </span>
                ))}
              </div>
            )}
            {q ? (results.length ? (
              <div className="mt-2 flex flex-col gap-1 border-t pt-2" style={{ borderColor: HAIR }}>
                {results.map((c, i) => (
                  <a
                    key={c.href}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setHi(i)}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-150"
                    style={{ background: i === hi ? 'rgba(143,198,255,0.14)' : 'transparent' }}
                  >
                    <img src={carImg(c.img, 200)} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] uppercase" style={{ fontFamily: DISPLAY, color: INK }}>
                        {c.make} <span style={{ color: MUT }}>{c.model}</span>
                      </div>
                      <div className="text-[12px]" style={{ fontFamily: MONO, color: MUT }}>
                        {c.reg}{c.km ? ` · ${c.km}` : ''} · {c.fuel}
                      </div>
                    </div>
                    <div className="shrink-0 text-[13px]" style={{ fontFamily: MONO, color: c.tilbod ? XENON : INK }}>
                      {fmtPrice(c)}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-[13px]" style={{ color: MUT, fontFamily: BODY }}>
                Ekkert fannst fyrir „{query.trim()}“.
              </p>
            )) : null}
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
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [asc, setAsc] = useState(true)
  const [seen, setSeen] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)

  const q = query.trim()
  const cars = useMemo(() => {
    /* free-text search (if any) ∩ structured slider/select filters */
    const textIds = q ? new Set(searchCars(CARS, q).map((r) => r.car.href)) : null
    const list = CARS.filter((c) => (!textIds || textIds.has(c.href)) && passesFilters(c, filters))
    return list.sort((a, b) => (asc ? a.priceNum - b.priceNum : b.priceNum - a.priceNum))
  }, [q, asc, filters])

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
        <div className="mt-10 max-w-md">
          <SearchEngine query={query} setQuery={setQuery} />
        </div>
      </Rise>

      <Rise delay={0.15}>
        <div className="mt-5">
          <FilterPanel filters={filters} setFilters={setFilters} resultCount={cars.length} />
        </div>
      </Rise>

      <Rise delay={0.2}>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-[13px]" style={{ fontFamily: MONO, color: MUT }}>
            {cars.length} af {CARS.length} bílum
          </p>
          <button
            onClick={() => setAsc((v) => !v)}
            className="rounded-full border px-4 py-2.5 text-[13px] transition-[border-color,transform] duration-200 active:scale-[0.97]"
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
            {q || filtersActive(filters)
              ? 'Enginn bíll passar við leitina.'
              : 'Enginn bíll á staðnum í augnablikinu.'}{' '}
            Hringdu í {CONTACT.phoneDisplay}, næsta sending gæti verið á leiðinni.
          </p>
          {(q || filtersActive(filters)) && (
            <button
              onClick={() => { setQuery(''); setFilters(DEFAULT_FILTERS) }}
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
      <a href="#bilar" className="flex items-center py-3 text-[14px] font-medium" style={{ color: INK, fontFamily: BODY }}>
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
/* ── loading screen: the car boomerang (glint transforms in, then reverses
      back out to the plain silhouette) plays once, then the REAL chrome
      wordmark from the actual logo ("Bílás" + "Bílasala Akraness",
      chroma-keyed off logo.png) reveals beneath at the original logo's
      proportions, so the end state assembles into the real Bílás logo.
      Body scroll locked while up. */
/* the boomerang clip is 3.25s natively; played faster it still reads the
   full glint-in/glint-out arc but the loader gets out of the way sooner */
const VIDEO_RATE = 1.6

function Loader({ onFinish }: { onFinish: () => void }) {
  const reduce = useReducedMotion()
  const [wordVisible, setWordVisible] = useState(reduce)
  const videoInit = useRef(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(onFinish, 900)
      return () => clearTimeout(t)
    }
    /* fallback in case the video's onEnded never fires (slow network etc.);
       the video itself plays at 1.6x (see VIDEO_RATE below), so its real
       runtime is ~2s, not the clip's native 3.25s. */
    const t = setTimeout(() => setWordVisible(true), 2400)
    return () => clearTimeout(t)
  }, [reduce, onFinish])

  useEffect(() => {
    if (!wordVisible) return
    const t = setTimeout(onFinish, 650)
    return () => clearTimeout(t)
  }, [wordVisible, onFinish])

  if (reduce) {
    /* no motion: just show the complete original logo, then continue */
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: '#000' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={LOGO.src} alt={LOGO.alt} className="w-[220px]" />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: '#000' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="w-[260px] sm:w-[340px]">
        <video
          ref={(el) => {
            if (!el || videoInit.current) return
            videoInit.current = true
            el.muted = true
            el.playbackRate = VIDEO_RATE
            el.play().catch(() => setWordVisible(true))
          }}
          src={`${import.meta.env.BASE_URL}media/bilas-loader-car.mp4`}
          autoPlay
          muted
          playsInline
          onEnded={() => setWordVisible(true)}
          /* the loader ground is true black to match the video's own black
             frame; screen-blend erases any remaining letterbox edge */
          className="w-full mix-blend-screen"
        />
      </div>
      {/* the real "Bílás" wordmark (re-vectorised from the original logo),
          tucked under the video's settled car so together they reassemble
          the original lockup — no second car */}
      <motion.img
        src={`${import.meta.env.BASE_URL}media/bilas-logo-wordmark-hd.png`}
        alt="Bílás – Bílasala Akraness"
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={wordVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="-mt-6 w-[188px] sm:-mt-8 sm:w-[246px]"
      />
    </motion.div>
  )
}

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)
  const [loaderDone, setLoaderDone] = useState(false)

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
      <AnimatePresence>
        {!loaderDone && <Loader key="loader" onFinish={() => setLoaderDone(true)} />}
      </AnimatePresence>
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
