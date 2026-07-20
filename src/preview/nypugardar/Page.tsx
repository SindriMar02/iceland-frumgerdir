import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import Lenis from 'lenis'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BOOKING_URL,
  DINNER_QUOTE,
  DISTANCES,
  EMAIL,
  FOOTNOTE,
  HOUSE_RULES,
  IMG,
  NAV,
  PHONE,
  PHONE_HREF,
  QUOTES,
  ROOM_PHOTOS,
  SCORE,
  UNITS,
} from './data'

const company = getPreviewCompany('nypugardar')

/* ── Palette (from the farm's own photography — dusk sun, cabin lamplight, ice)
 * INK on GROUND ≈ 15:1 (AAA) · ACCENT on GROUND ≈ 5.5:1 (AA, large + labels)
 * GROUND text on ACCENT fill ≈ 5.5:1 (AA) — CTA labels are dark-on-amber. */
const GROUND = '#15130F' // night has fallen, dinner is lit
const ACCENT = '#D97D3D' // dinner-table ember
const HAIR = 'rgba(244,238,226,0.14)'
const BODY = 'rgba(244,238,226,0.76)'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2]'

/* ── The evening arc: one scrollYProgress drives sky colour + eyebrow ink +
 * the section rule fills, all computed from the raw value in ONE callback. */
type Stop = [number, [number, number, number]]
const SKY_STOPS: Stop[] = [
  [0, [220, 228, 230]], // pale cold daylight (#DCE4E6)
  [0.55, [217, 125, 61]], // ember amber (#D97D3D)
  [1, [21, 19, 15]], // night = ground (#15130F), so the arc resolves seamlessly
]
const INK_STOPS: Stop[] = [
  [0, [185, 203, 214]], // glacier ice
  [0.5, [217, 125, 61]], // ember
  [1, [217, 125, 61]],
]
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
function atStops(stops: Stop[], v: number): string {
  const t = clamp01(v)
  let a = stops[0]
  let b = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      a = stops[i]
      b = stops[i + 1]
      break
    }
  }
  const span = b[0] - a[0] || 1
  const k = (t - a[0]) / span
  const c = a[1].map((n, i) => Math.round(n + (b[1][i] - n) * k))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

/* ── Reveal — IntersectionObserver on an untransformed wrapper; the failsafe is
 * gated by viewport position (never an unconditional timeout). */
function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setShown(true), 60)
      return () => window.clearTimeout(t)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  const style: CSSProperties | undefined = reduced
    ? undefined
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.75s ${EASE} ${delay}ms, transform 0.75s ${EASE} ${delay}ms`,
      }
  return (
    <div ref={ref} className={className} style={style} data-show={shown || reduced}>
      {children}
    </div>
  )
}

/* ── ClipImg — clip-path reveal for STANDALONE content photos only (explicit
 * aspect on the wrapper; the observer target never transforms itself). */
function ClipImg({
  src,
  alt,
  aspect,
  caption,
  delay = 0,
  className = '',
  imgClassName = '',
}: {
  src: string
  alt: string
  aspect: string
  caption?: string
  delay?: number
  className?: string
  imgClassName?: string
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setShown(true), 80)
      return () => window.clearTimeout(t)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  const on = shown || reduced
  return (
    <figure ref={ref} className={className}>
      <div className={`${aspect} overflow-hidden rounded-sm`}>
        <Img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={
            reduced
              ? undefined
              : {
                  clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  transform: on ? 'scale(1)' : 'scale(1.06)',
                  transition: `clip-path 0.95s ${EASE} ${delay}ms, transform 1.25s ${EASE} ${delay}ms`,
                }
          }
        />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#F4EEE2]/55">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ── Eyebrow — carries the evening-arc signature: mono label tinted by the sky
 * (--skyink) + a thin rule that fills as the section passes the viewport
 * centre band. --rule is written raw per frame in the single scroll callback. */
function Eyebrow({
  label,
  register,
  reduced,
  className = '',
}: {
  label: string
  register: (el: HTMLSpanElement) => () => void
  reduced: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return register(el)
  }, [register])
  return (
    <span className={`block ${className}`}>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.24em]"
        style={{ color: 'var(--skyink, #B9CBD6)' }}
      >
        {label}
      </span>
      <span ref={ref} className="mt-2.5 block h-[2px] w-28 rounded-full bg-[#F4EEE2]/15">
        <span
          className="block h-full w-full origin-left rounded-full bg-[#D97D3D]"
          style={{ transform: reduced ? 'scaleX(1)' : 'scaleX(var(--rule, 0))' }}
        />
      </span>
    </span>
  )
}

/* ── CTA — dark ink on amber (AA). */
function BookLink({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-[#D97D3D] px-6 py-3.5 font-sans text-[15px] font-semibold text-[#15130F] transition-[transform,background-color] duration-200 ease-out hover:bg-[#E68C4C] active:scale-[0.98] ${FOCUS} ${className}`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}

export default function Page() {
  const reduced = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const rules = useRef(new Set<HTMLSpanElement>())
  const [mounted, setMounted] = useState(false)
  const [barShown, setBarShown] = useState(false)
  const barRef = useRef(false)
  const { scrollYProgress } = useScroll()

  /* ── Mobile menu — hamburger state, measured nav height (so the overlay's
   * padding-top lines up under the real nav bar), body-scroll lock + Escape. */
  const [menuOpen, setMenuOpen] = useState(false)
  const navRowRef = useRef<HTMLDivElement>(null)
  const [navHeight, setNavHeight] = useState(84)

  useEffect(() => {
    const el = navRowRef.current
    if (!el) return
    const measure = () => setNavHeight(el.getBoundingClientRect().height)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const register = useCallback((el: HTMLSpanElement) => {
    rules.current.add(el)
    return () => {
      rules.current.delete(el)
    }
  }, [])

  /* Close the overlay first, then hand off to the browser's smooth scroll on
   * the next frame — never both at once. */
  const handleNavLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      setMenuOpen(false)
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      })
    },
    [reduced],
  )

  /* The ONE signature: sky colour, eyebrow ink and every rule fill are derived
   * from the raw progress value inside this single callback — no sibling
   * useTransform .get() reads, no CSS transitions on scrubbed values. */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    const root = rootRef.current
    if (!root) return
    root.style.setProperty('--sky', atStops(SKY_STOPS, v))
    root.style.setProperty('--skyink', atStops(INK_STOPS, v))
    const vh = window.innerHeight || 800
    rules.current.forEach((el) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--rule', clamp01((vh * 0.86 - r.top) / (vh * 0.52)).toFixed(4))
    })
    if (!barRef.current && v > 0.02) {
      barRef.current = true
      setBarShown(true)
    }
  })

  /* Lenis smooth scroll — skipped entirely under prefers-reduced-motion. */
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.1 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) setBarShown(true)
    const t = window.setTimeout(() => setMounted(true), 40)
    return () => window.clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    document.title = 'Nýpugarðar · Kvöldverðurinn á Mýrum'
    setThemeColor(GROUND)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BedAndBreakfast',
      name: 'Nýpugarðar',
      telephone: '+354 893 1826',
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Nýpugarðar',
        addressLocality: 'Höfn í Hornafirði',
        postalCode: '781',
        addressCountry: 'IS',
      },
      petsAllowed: false,
      checkinTime: '16:00',
      checkoutTime: '11:00',
    })
    document.head.appendChild(s)
    return () => {
      document.head.removeChild(s)
    }
  }, [])

  const on = mounted || reduced
  const rise = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: on ? 1 : 0,
          transform: on ? 'none' : 'translateY(26px)',
          filter: on ? 'none' : 'blur(6px)',
          transition: `opacity 0.85s ${EASE} ${140 + i * 90}ms, transform 0.85s ${EASE} ${140 + i * 90}ms, filter 0.85s ${EASE} ${140 + i * 90}ms`,
        }

  return (
    <div
      ref={rootRef}
      lang="en"
      className="min-h-screen font-sans text-[#F4EEE2] antialiased"
      style={{ background: GROUND, '--sky': '#DCE4E6', '--skyink': '#B9CBD6' } as CSSProperties}
    >
      <PreviewChrome company={company} />

      {/* The sky band — a thin fixed atmosphere behind the headlines. Its colour
       * IS the evening: daylight blue at the top of the page, ember by dinner,
       * and exactly the ground colour by the final CTA, so it melts into night. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[44vh]"
        style={{ background: 'linear-gradient(to bottom, var(--sky), transparent)', opacity: 0.32 }}
      />

      {/* ── 1 · HERO — Arrival ─────────────────────────────────────────── */}
      {/* No explicit z-index here (z-auto): this box must NOT form its own
       * stacking context, or it would trap the nav bar inside it and drag
       * the whole hero above the mobile menu overlay along with it. Leaving
       * it z-auto lets the nav bar's own z-40 rank above the overlay while
       * the hero photo/copy (z-auto/5/10) stay ranked below it — see the
       * overlay's comment right after </header>. */}
      <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Img
          src={IMG.hero}
          alt="Turf-roofed farm outbuilding and the red-roofed guesthouse at Nýpugarðar, a glacier tongue in the distance"
          fetchpriority="high"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  opacity: on ? 1 : 0,
                  transform: on ? 'scale(1)' : 'scale(1.05)',
                  transition: `opacity 1.4s ${EASE}, transform 2.2s ${EASE}`,
                }
          }
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/45 to-[#15130F]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-[#15130F]/75 to-transparent"
        />

        <nav
          className="absolute inset-x-0 top-0 z-40"
          aria-label="Main"
          style={{
            background: menuOpen ? GROUND : 'transparent',
            transition: reduced ? 'none' : `background-color 0.3s ${EASE}`,
          }}
        >
          <div
            ref={navRowRef}
            className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8"
          >
            <a href="#top" className={`font-display text-xl tracking-tight ${FOCUS}`}>
              Nýpugarðar
            </a>
            <div className="hidden items-center gap-7 md:flex">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/80 transition-colors duration-200 hover:text-[#F4EEE2] ${FOCUS}`}
                >
                  {n.label}
                </a>
              ))}
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className={`hidden bg-[#D97D3D] px-4 py-2 text-[13px] font-semibold text-[#15130F] transition-colors duration-200 hover:bg-[#E68C4C] sm:inline-block ${FOCUS}`}
            >
              Check availability
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden ${FOCUS}`}
            >
              <span aria-hidden="true" className="relative block h-4 w-6">
                <span
                  className="absolute left-0 top-0 block h-[2px] w-6 rounded-full"
                  style={{
                    background: menuOpen ? ACCENT : '#F4EEE2',
                    transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'translateY(0) rotate(0deg)',
                    transition: reduced ? 'none' : `transform 0.3s ${EASE}, background-color 0.3s ${EASE}`,
                  }}
                />
                <span
                  className="absolute bottom-0 left-0 block h-[2px] w-6 rounded-full"
                  style={{
                    background: menuOpen ? ACCENT : '#F4EEE2',
                    transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0) rotate(0deg)',
                    transition: reduced ? 'none' : `transform 0.3s ${EASE}, background-color 0.3s ${EASE}`,
                  }}
                />
              </span>
            </button>
          </div>
        </nav>

        <div id="top" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
          <p
            lang="is"
            className="font-mono text-[11.5px] uppercase tracking-[0.26em] text-[#B9CBD6]"
            style={rise(0)}
          >
            Kvöldverðurinn á Mýrum
          </p>
          <h1
            className="mt-4 max-w-4xl font-display text-[clamp(3.1rem,9vw,6.5rem)] font-medium leading-[1.16] tracking-tight"
            style={rise(1)}
          >
            Nýpugarðar
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#F4EEE2]/85" style={rise(2)}>
            A working sheep and horse farm between Höfn and Jökulsárlón. Stay the night and sit
            down to dinner.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4" style={rise(3)}>
            <BookLink>Check availability</BookLink>
            <a
              href={PHONE_HREF}
              className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-6 py-3.5 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE}
            </a>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay — a SIBLING of <header>, never nested inside
       * it or <nav>. It is `fixed`, so it always sizes to the real viewport
       * regardless of anything a scroll effect does to an ancestor (a
       * transform/backdrop-filter on an ancestor would otherwise become the
       * containing block for a fixed descendant and collapse it to zero).
       * z-30 sits below the nav bar's z-40 (header itself is z-auto, so it
       * can't drag the nav along with it) and above the hero photo/copy
       * (z-auto/z-5/z-10), so the nav row — solid background, hamburger
       * morphed into an X — stays visible and tappable on top of it while
       * the hero underneath is fully hidden. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-30 flex flex-col md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        style={{
          background: GROUND,
          paddingTop: navHeight,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: reduced
            ? 'none'
            : menuOpen
              ? `opacity 0.3s ${EASE}, visibility 0s`
              : `opacity 0.3s ${EASE}, visibility 0s 0.3s`,
        }}
      >
        <nav className="flex flex-1 flex-col justify-center px-6" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.id} className="overflow-hidden">
                <a
                  href={`#${n.id}`}
                  onClick={(e) => handleNavLinkClick(e, `#${n.id}`)}
                  className={`block py-2 font-display text-[clamp(2.5rem,13vw,4.5rem)] font-medium leading-[1.1] tracking-tight text-[#F4EEE2] ${FOCUS}`}
                  style={{
                    transform: menuOpen || reduced ? 'translateY(0%)' : 'translateY(100%)',
                    transition: reduced
                      ? 'none'
                      : `transform 0.6s ${EASE} ${menuOpen ? 60 + i * 60 : 0}ms`,
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="mt-8 block h-[2px] w-16 origin-left rounded-full"
            style={{
              background: ACCENT,
              transform: menuOpen || reduced ? 'scaleX(1)' : 'scaleX(0)',
              transition: reduced
                ? 'none'
                : `transform 0.5s ${EASE} ${menuOpen ? 60 + NAV.length * 60 : 0}ms`,
            }}
          />
        </nav>
        <div className="px-6 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-4">
          <BookLink
            className="w-full justify-center py-4 text-base"
            onClick={() => setMenuOpen(false)}
          >
            Check availability
          </BookLink>
        </div>
      </div>

      <main className="relative z-[1]">
        {/* ── 2 · THE FARM — sheep ─────────────────────────────────────── */}
        <section id="farm" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <Eyebrow label="The flock" register={register} reduced={reduced} />
              <Reveal delay={60}>
                <h2 className="mt-6 font-display text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                  About 600 sheep, give or take
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-[58ch] leading-relaxed" style={{ color: BODY }}>
                  Nýpugarðar is a real working farm, not a themed hotel. The sheep share the hill
                  with the horses, a dog and a cat. In spring, guests are welcome to watch the
                  lambing. In winter, you can lend a hand with light farm work if you feel like
                  it.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <dl className="mt-10 grid grid-cols-2 gap-6 border-t pt-8" style={{ borderColor: HAIR }}>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                      Sheep on the farm
                    </dt>
                    <dd className="mt-1 font-display text-4xl" style={{ color: ACCENT }}>
                      ~600
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                      Horses
                    </dt>
                    <dd className="mt-1 font-display text-4xl" style={{ color: ACCENT }}>
                      ~20
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
            <ClipImg
              src={IMG.sheep}
              alt="Two white Icelandic sheep on a green hillside, looking at the camera"
              aspect="aspect-[4/3]"
              caption="Icelandic sheep in summer pasture"
            />
          </div>
        </section>

        {/* ── 3 · THE FARM — horses ────────────────────────────────────── */}
        <section className="relative flex min-h-[82svh] items-end overflow-hidden">
          <Img
            src={IMG.horses}
            alt="Five Icelandic horses of different coat colours grazing together under a mountain ridge"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/55 to-[#15130F]/20"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:px-8 md:pb-20">
            <div className="grid items-end gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <Eyebrow label="The horses" register={register} reduced={reduced} />
                <Reveal delay={60}>
                  <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                    About twenty horses share the hill
                  </h2>
                </Reveal>
                <Reveal delay={140}>
                  <p className="mt-5 max-w-[54ch] leading-relaxed text-[#F4EEE2]/85">
                    The herd grazes the slopes around the guesthouse. You will hear them before
                    breakfast and pass them on the way to your car.
                  </p>
                </Reveal>
              </div>
              <ClipImg
                src={IMG.horsesPair}
                alt="Two Icelandic horses, one black and one brown, standing nose to nose on grassland"
                aspect="aspect-[4/3]"
                delay={160}
                className="hidden w-72 md:block"
                caption="Nose to nose on the grassland"
              />
            </div>
          </div>
        </section>

        {/* ── 4 · GLACIER & SETTING ────────────────────────────────────── */}
        <section className="relative flex min-h-[86svh] items-end overflow-hidden">
          <Img
            src={IMG.glacier}
            alt="A wide glacier tongue descending between mountains, with green farmland in the foreground"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/55 to-[#15130F]/20"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:px-8 md:pb-20">
            <Eyebrow label="The glacier light" register={register} reduced={reduced} />
            <Reveal delay={60}>
              <h2 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                A small hill with the whole horizon
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-[60ch] leading-relaxed text-[#F4EEE2]/85">
                The guesthouse stands on a low hill above the lowlands of Mýrar. The bright rooms
                look out over Hornafjörður fjord and Hvannadalshnjúkur, the highest mountain in
                Iceland.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <dl
                className="mt-10 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3"
                style={{ borderColor: 'rgba(244,238,226,0.25)' }}
              >
                {DISTANCES.map((d) => (
                  <div key={d.label}>
                    <dd className="font-display text-3xl text-[#F4EEE2] md:text-4xl">{d.n}</dd>
                    <dt className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9CBD6]">
                      {d.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Glacier — secondary panel */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <ClipImg
              src={IMG.ridge}
              alt="Snow-capped mountain ridge with a glacier at its base under a blue sky"
              aspect="aspect-[4/3]"
              caption="The ridge behind the farm"
            />
            <div>
              <Reveal>
                <h2 className="font-display text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl">
                  Four kilometres off the Ring Road, then quiet
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p className="mt-5 max-w-[56ch] leading-relaxed" style={{ color: BODY }}>
                  The farm sits a short drive off Route 1, a little east of the river Hólmsá.
                  Close enough for a morning at Jökulsárlón, far enough that the evenings stay
                  quiet. Hólmi Zoo is 5 km away, and Þórbergssetur museum and the Hornafjörður
                  swimming pool are both within half an hour.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 5 · ACCOMMODATION ────────────────────────────────────────── */}
        <section id="rooms" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label="Your room" register={register} reduced={reduced} />
            <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-end">
              <Reveal>
                <h2 className="font-display text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                  Thirteen simple places to sleep
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p className="max-w-[52ch] leading-relaxed md:justify-self-end" style={{ color: BODY }}>
                  Bright, warm rooms in the main house and two small cottages with their own
                  bathrooms. Nothing fussy, everything you need, and that view from the pillow.
                </p>
              </Reveal>
            </div>

            <Reveal delay={140}>
              <dl
                className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4"
                style={{ borderColor: HAIR }}
              >
                {UNITS.map((u) => (
                  <div key={u.label}>
                    <dd className="font-display text-5xl" style={{ color: ACCENT }}>
                      {u.n}
                    </dd>
                    <dt className="mt-2 max-w-[16ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#F4EEE2]/60">
                      {u.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {ROOM_PHOTOS.map((r, i) => (
                <ClipImg
                  key={r.src}
                  src={r.src}
                  alt={r.alt}
                  aspect="aspect-[3/4]"
                  caption={r.caption}
                  delay={i * 90}
                />
              ))}
            </div>

            {/* Cottages */}
            <div className="mt-20 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              <div>
                <Reveal>
                  <h3 className="font-display text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl">
                    The two cottages
                  </h3>
                </Reveal>
                <Reveal delay={90}>
                  <p className="mt-5 max-w-[52ch] leading-relaxed" style={{ color: BODY }}>
                    Two timber cottages of 20 and 25 square metres stand beside the main house,
                    each with its own bathroom. Room for two to four guests, with the fields
                    right outside the door.
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <ul className="mt-8 space-y-2.5 border-t pt-7" style={{ borderColor: HAIR }}>
                    {HOUSE_RULES.map((h) => (
                      <li
                        key={h}
                        className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/65"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={220}>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <BookLink>Check availability</BookLink>
                    <p className="text-sm text-[#F4EEE2]/55">Live dates and prices on Booking.com</p>
                  </div>
                </Reveal>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <ClipImg
                  src={IMG.cottage1}
                  alt="Red-roofed cottage at Nýpugarðar in warm evening light with snow on the ground"
                  aspect="aspect-[3/4]"
                  caption="Cottage in winter light"
                />
                <ClipImg
                  src={IMG.cottage2}
                  alt="Second cottage at Nýpugarðar under a dusk sky, green grass around it"
                  aspect="aspect-[3/4]"
                  caption="Cottage at dusk"
                  delay={110}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 · THE DINNER BUFFET — the signature offering ───────────── */}
        <section id="dinner" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label="Dinner is served" register={register} reduced={reduced} />
            <Reveal delay={60}>
              <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.16] tracking-tight">
                A dinner buffet with lamb
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed" style={{ color: BODY }}>
                This is what guests remember. Booking.com describes Nýpugarðar simply: a sheep
                farm with simple, fresh rooms, a home-cooked breakfast and a dinner buffet with
                lamb. Traditional Icelandic cooking with local ingredients, eaten in a dining
                room whose windows face the ice.
              </p>
            </Reveal>

            <ClipImg
              src={IMG.dining}
              alt="The dining room at Nýpugarðar, tables set for about twenty guests in front of full-height windows facing the glacier"
              aspect="aspect-[1280/577]"
              caption="The dining room, windows facing the glacier"
              className="mt-12"
            />

            <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-14">
              <Reveal>
                <blockquote>
                  <p className="font-display text-2xl italic leading-[1.4] text-[#F4EEE2]/90 md:text-[1.7rem]">
                    “{DINNER_QUOTE.text}”
                  </p>
                  <footer className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                    {DINNER_QUOTE.name}, {DINNER_QUOTE.place} · guest review on Booking.com
                  </footer>
                </blockquote>
              </Reveal>
              <div>
                <Reveal delay={80}>
                  <p className="leading-relaxed" style={{ color: BODY }}>
                    Breakfast comes with the room. Dinner is cooked when it is ordered ahead, so
                    tell the farm you want a seat at the table when you book. The restaurant is
                    on site and opens for dinner, and prices are confirmed when you order.
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <a
                      href={PHONE_HREF}
                      className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-5 py-3 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {PHONE}
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-5 py-3 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {EMAIL}
                    </a>
                  </div>
                </Reveal>
                <ClipImg
                  src={IMG.deck}
                  alt="Dusk view from the guesthouse deck at Nýpugarðar, benches facing wide grassland and a low sun"
                  aspect="aspect-[3/4]"
                  caption="The deck, just before dinner"
                  delay={200}
                  className="mt-8 max-w-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · SEASONS ──────────────────────────────────────────────── */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2 className="sr-only">The seasons at Nýpugarðar</h2>
            <div className="grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[#F4EEE2]/15">
              <Reveal className="md:pr-14">
                <h3 className="font-display text-3xl font-medium leading-[1.16] tracking-tight">
                  Spring is for lambing
                </h3>
                <p className="mt-4 max-w-[50ch] leading-relaxed" style={{ color: BODY }}>
                  When the lambs arrive, guests are welcome in the sheep shed to watch. It is the
                  busiest, loudest, best time of year on the farm.
                </p>
              </Reveal>
              <Reveal delay={110} className="md:pl-14">
                <h3 className="font-display text-3xl font-medium leading-[1.16] tracking-tight">
                  Winter is for dark skies
                </h3>
                <p className="mt-4 max-w-[50ch] leading-relaxed" style={{ color: BODY }}>
                  The house is open all year. Guide to Iceland calls it an ideal location for
                  spotting the northern lights in the winter months, and there is light farm
                  work to join if you want to earn your dinner.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 8 · REVIEWS ──────────────────────────────────────────────── */}
        <section id="reviews" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label="Guests" register={register} reduced={reduced} />
            <h2 className="sr-only">Guest reviews</h2>
            <div className="mt-8 grid items-end gap-10 md:grid-cols-[auto_1fr] md:gap-16">
              <Reveal>
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-[6rem] leading-none text-[#F4EEE2] md:text-[8rem]">
                    {SCORE.value}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-[0.18em] text-[#B9CBD6]">
                    / 10
                  </span>
                </p>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#F4EEE2]/70">
                  “{SCORE.word}” · {SCORE.count} guest reviews on Booking.com
                </p>
              </Reveal>
              <Reveal delay={100}>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {SCORE.categories.map((c) => (
                    <div key={c.label} className="border-t pt-3" style={{ borderColor: HAIR }}>
                      <dd className="font-display text-2xl" style={{ color: ACCENT }}>
                        {c.n}
                      </dd>
                      <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#F4EEE2]/55">
                        {c.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
              {QUOTES.map((q, i) => (
                <Reveal key={q.name} delay={i * 100}>
                  <blockquote className="border-t pt-6" style={{ borderColor: HAIR }}>
                    <p className="leading-relaxed text-[#F4EEE2]/85">“{q.text}”</p>
                    <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9CBD6]">
                      {q.name}, {q.place}
                      {q.note ? <span className="mt-1 block text-[#F4EEE2]/60">{q.note}</span> : null}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
            <Reveal delay={140}>
              <p className="mt-10 text-sm text-[#F4EEE2]/50">
                Guest reviews via{' '}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline underline-offset-4 hover:text-[#F4EEE2]/80 ${FOCUS}`}
                >
                  Booking.com
                </a>
                . Individual review dates are not published there.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 9 · PRACTICAL INFO ───────────────────────────────────────── */}
        <section id="info" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label="Finding us" register={register} reduced={reduced} />
            <Reveal delay={60}>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                Easy to reach, hard to leave
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
              <div className="space-y-8">
                <Reveal>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    Call the farm
                  </p>
                  <a
                    href={PHONE_HREF}
                    className={`mt-2 inline-block font-display text-5xl transition-colors duration-200 hover:text-[#E68C4C] md:text-6xl ${FOCUS}`}
                    style={{ color: ACCENT }}
                  >
                    {PHONE}
                  </a>
                </Reveal>
                <Reveal delay={80}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    Write to us
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className={`mt-2 inline-flex items-center gap-3 text-xl text-[#F4EEE2]/90 underline-offset-4 hover:underline md:text-2xl ${FOCUS}`}
                  >
                    <Mail className="h-5 w-5 text-[#B9CBD6]" aria-hidden="true" />
                    {EMAIL}
                  </a>
                </Reveal>
                <Reveal delay={160}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    The address
                  </p>
                  <p className="mt-2 flex items-start gap-3 text-xl text-[#F4EEE2]/90 md:text-2xl">
                    <MapPin className="mt-1.5 h-5 w-5 shrink-0 text-[#B9CBD6]" aria-hidden="true" />
                    {ADDRESS}
                  </p>
                </Reveal>
              </div>
              <div>
                <Reveal delay={100}>
                  <p className="leading-relaxed" style={{ color: BODY }}>
                    Booking works instantly through Booking.com, where the farm keeps its live
                    availability. Nýpugarðar is also listed with HeyIceland and Guide to Iceland.
                    For dinner pre-orders and anything else, the phone is quickest.
                  </p>
                </Reveal>
                <Reveal delay={180}>
                  <ul className="mt-8 space-y-2.5 border-t pt-7" style={{ borderColor: HAIR }}>
                    {DISTANCES.map((d) => (
                      <li
                        key={d.label}
                        className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/65"
                      >
                        {d.n} · {d.label}
                      </li>
                    ))}
                    <li className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/65">
                      Open all year
                    </li>
                  </ul>
                </Reveal>
                <Reveal delay={240}>
                  <p className="mt-8 text-sm text-[#F4EEE2]/60">
                    Nýpugarðar ehf. is an active, registered Icelandic company, kt. 510805-0380.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 · FINAL CTA — night ───────────────────────────────────── */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden">
          <Img
            src={IMG.dusk}
            alt="The sun setting over open grassland at Nýpugarðar, mountains silhouetted on the horizon"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/40 to-transparent"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40 text-center md:px-8 md:pb-28">
            <div className="mx-auto w-fit">
              <Eyebrow label="Nightfall" register={register} reduced={reduced} />
            </div>
            <Reveal delay={60}>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.6rem,6.5vw,4.6rem)] font-medium leading-[1.16] tracking-tight">
                Book your evening at Nýpugarðar
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#F4EEE2]/85">
                A room with the horizon in the window, and a seat at the table when the lamb
                comes out of the kitchen.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <BookLink>Book your evening at Nýpugarðar</BookLink>
                <a
                  href={PHONE_HREF}
                  className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-6 py-3.5 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {PHONE}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Honesty note — required disclosure before the shared footer */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
            <p className="text-xs leading-relaxed text-[#F4EEE2]/60">{FOOTNOTE}</p>
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA — the booking path stays two taps away, always.
       * Hidden while the full-screen menu is open so it doesn't double up
       * with the overlay's own "Check availability" button at the bottom. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
        style={{
          borderColor: HAIR,
          background: 'rgba(21,19,15,0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transform: barShown && !menuOpen ? 'translateY(0)' : 'translateY(110%)',
          transition: reduced ? 'none' : `transform 0.5s ${EASE}`,
        }}
      >
        <div className="flex items-stretch gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex flex-1 items-center justify-center gap-2 bg-[#D97D3D] px-4 py-3 text-[15px] font-semibold text-[#15130F] active:scale-[0.98] ${FOCUS}`}
          >
            Check availability
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={PHONE_HREF}
            aria-label={`Call Nýpugarðar, ${PHONE}`}
            className={`flex w-14 items-center justify-center border border-[#F4EEE2]/35 ${FOCUS}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
