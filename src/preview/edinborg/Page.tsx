import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { PartialPrototypeBanner } from '../PartialPrototypeBanner'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CATCH_TAGS,
  COORDS,
  COURSE_IMG,
  COURSES,
  GALLERY,
  HERITAGE,
  HERITAGE_BODY,
  HOURS,
  IMG,
  PHONE_DISPLAY,
  PHONE_HREF,
  QUOTES,
  RATINGS,
} from './data'

const company = getPreviewCompany('edinborg')

/* ── Palette — Harbour-dusk system (slate ink on warm ecru, one oxblood thread) ── */
const GROUND = '#EDE4D3' // warm hand-set paper
const SURFACE = '#F4EDE0' // lighter card paper
const INK = '#1F2A2E' // dusk-water slate ink (12.6:1 on ground)
const MUTED = '#52605F' // slate-grey metadata (≈4.9:1 on ground, ≈4.6:1 on surface)
const OXBLOOD = '#6E1F2B' // the single accent thread
const SLATE_PANEL = '#2E3F44' // deep harbour-slate fill
const ECRU_DIM = 'rgba(237,228,211,0.74)' // muted ecru on slate panel (≈4.6:1 on #2E3F44)
const PINK = '#E8B4BC' // tint of oxblood for on-dark/on-oxblood eyebrows

/* ── Unified dusk/sepia wash so all stock reads as one warm set ──────────── */
const WASH = 'saturate(0.78) sepia(0.10) brightness(0.97)'
const WASH_SEPIA = 'sepia(0.42) saturate(0.7) brightness(0.94)'

/* ── Unsplash helpers ─────────────────────────────────────────────────── */
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcSet = (id: string) =>
  `${u(id, 480)} 480w, ${u(id, 800)} 800w, ${u(id, 1200)} 1200w, ${u(id, 1800)} 1800w`

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isk = (n: number) => `${n.toLocaleString('de-DE')} kr.`

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

/* ── Shared: reveal-on-enter hook (IO + setTimeout failsafe, base state visible) ── */
function useInView<T extends HTMLElement>(threshold = 0.16) {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      setOn(true)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    const fs = window.setTimeout(() => setOn(true), 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [threshold])
  return { ref, on }
}

/* ── Small structural eyebrow (Cabinet Grotesk caps, tracked) ──────────── */
function Eyebrow({
  children,
  color = OXBLOOD,
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`font-cabinet inline-flex items-center gap-2.5 text-[11px] font-medium uppercase ${className}`}
      style={{ letterSpacing: '0.2em', color }}
    >
      <span aria-hidden style={{ width: 22, height: 1, background: color, display: 'inline-block' }} />
      {children}
    </span>
  )
}

/* ── Quiet inline anchor link with the oxblood arrow ───────────────────── */
function ArrowLink({
  href,
  children,
  color = OXBLOOD,
  onClick,
}: {
  href: string
  children: ReactNode
  color?: string
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="ed-arrow font-cabinet inline-flex items-center gap-2 text-[12px] font-medium uppercase"
      style={{ letterSpacing: '0.16em', color }}
    >
      {children}
      <span aria-hidden className="ed-arrow-tip">→</span>
    </a>
  )
}

/* ── Oxblood leaf glyph — marks vegetarian dishes ──────────────────────── */
function Leaf() {
  return (
    <svg
      aria-label="vegetarian"
      role="img"
      width="13"
      height="13"
      viewBox="0 0 16 16"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 7 }}
    >
      <path
        d="M14 2C7 2 2 6 2 12c0 1 .3 2 .3 2S4 11 8 9.5C5.5 11 4 13 4 13s4 1 7-2c2.6-2.6 3-9 3-9Z"
        fill={OXBLOOD}
      />
    </svg>
  )
}

/* ── Wax-seal SVG — the Edinborg mark that "stamps" the foot of the menu ── */
function WaxSeal({ stamped, size = 118 }: { stamped: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 118 118"
      aria-label="Edinborg seal"
      role="img"
      style={{
        transform: stamped ? 'scale(1) rotate(-4deg)' : 'scale(0.4) rotate(-22deg)',
        opacity: stamped ? 1 : 0,
        transition: 'transform 620ms cubic-bezier(.34,1.56,.5,1), opacity 360ms ease',
      }}
    >
      <circle cx="59" cy="59" r="55" fill={OXBLOOD} />
      <circle cx="59" cy="59" r="55" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
      <circle cx="59" cy="59" r="45" fill="none" stroke={GROUND} strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
      <text
        x="59"
        y="50"
        textAnchor="middle"
        fontFamily="'Cabinet Grotesk', sans-serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="3"
        fill={GROUND}
      >
        EST.
      </text>
      <text
        x="59"
        y="74"
        textAnchor="middle"
        fontFamily="'Cabinet Grotesk', sans-serif"
        fontSize="26"
        fontWeight="800"
        letterSpacing="1"
        fill={GROUND}
      >
        1907
      </text>
      <text
        x="59"
        y="90"
        textAnchor="middle"
        fontFamily="'Cabinet Grotesk', sans-serif"
        fontSize="8"
        fontWeight="600"
        letterSpacing="3.5"
        fill={GROUND}
      >
        EDINBORG
      </text>
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 * Masthead + Courses hero — rebuilt as a type-left / LARGE-image-right split.
 * Above-the-fold content starts visible (opacity:1); entrances are transform-
 * only CSS keyframes (run even in a throttled tab, unlike rAF/Framer), all
 * gated behind prefers-reduced-motion in the <style>.
 * ────────────────────────────────────────────────────────────────────────── */
function Hero({ openLabel, dateLabel }: { openLabel: string; dateLabel: string }) {
  return (
    <header className="relative" style={{ background: GROUND }}>
      {/* masthead band */}
      <div className="border-b" style={{ borderColor: 'rgba(110,31,43,0.32)' }}>
        <div className="mx-auto flex max-w-[1180px] items-center justify-center px-6 py-3.5">
          <span
            className="font-cabinet text-center text-[11px] font-medium uppercase sm:text-[12px]"
            style={{ letterSpacing: '0.34em', color: INK }}
          >
            Edinborg · Bistró · Ísafjörður
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-6 pb-16 pt-12 sm:pt-16 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:gap-14">
          {/* left — the wordline + status + inline actions */}
          <div>
            <div
              className="ed-rise font-cabinet text-[11px] font-medium uppercase"
              style={{ letterSpacing: '0.2em', color: OXBLOOD, ['--d' as string]: '0ms' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span aria-hidden style={{ width: 22, height: 1, background: OXBLOOD }} />
                A bill of fare by the harbour
              </span>
            </div>
            <h1
              className="font-cabinet mt-6 font-extrabold lowercase"
              style={{
                color: INK,
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(2.75rem, 7vw, 5.75rem)',
              }}
            >
              <span className="ed-rise" style={{ display: 'block', ['--d' as string]: '90ms' }}>
                a bistro told
              </span>
              <span className="ed-rise" style={{ display: 'block', ['--d' as string]: '180ms' }}>
                in{' '}
                <span className="ed-ink" style={{ color: OXBLOOD, position: 'relative' }}>
                  courses.
                </span>
              </span>
            </h1>
            <p
              className="ed-rise font-satoshi mt-7 max-w-[44ch] text-[16px] sm:text-[17px]"
              style={{ color: MUTED, lineHeight: 1.55, ['--d' as string]: '300ms' }}
            >
              Seafood, lamb and the day’s fish soup, set down in the old wooden Edinborg
              house on the Ísafjörður waterfront. Read it like a printed menu — by lamplight,
              at the close of a fjord day.
            </p>

            {/* inline action row */}
            <div
              className="ed-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
              style={{ ['--d' as string]: '380ms' }}
            >
              <ArrowLink href="#menu">View the menu</ArrowLink>
              <ArrowLink href="#reserve">Reserve a table</ArrowLink>
            </div>

            {/* "tonight" status strip */}
            <div
              className="ed-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6"
              style={{ borderColor: 'rgba(31,42,46,0.14)', ['--d' as string]: '440ms' }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="ed-dot"
                  style={{ width: 9, height: 9, borderRadius: 999, background: OXBLOOD, display: 'inline-block' }}
                />
                <span className="font-cabinet text-[16px] font-extrabold" style={{ color: INK, letterSpacing: '-0.01em' }}>
                  {openLabel}
                </span>
              </span>
              <span className="font-satoshi text-[14px]" style={{ color: MUTED }}>
                {dateLabel}
              </span>
              <a
                href="#hours"
                className="font-cabinet text-[12px] font-medium uppercase transition-opacity hover:opacity-70"
                style={{ letterSpacing: '0.16em', color: OXBLOOD }}
              >
                Hours & how to find us →
              </a>
            </div>
          </div>

          {/* right — LARGE harbour-house feature + overlapping plated-dish inset */}
          <div className="relative ed-rise" style={{ ['--d' as string]: '360ms' }}>
            <figure className="relative" style={{ margin: 0 }}>
              <div style={{ padding: 6, border: `1px solid ${OXBLOOD}`, background: SURFACE }}>
                <Img
                  src={u(IMG.house, 1200)}
                  srcSet={srcSet(IMG.house)}
                  sizes="(max-width: 1024px) 92vw, 520px"
                  width={520}
                  height={460}
                  fetchpriority="high"
                  alt="The white wooden Edinborg-style house beneath the mountain on the Ísafjörður waterfront at dusk"
                  className="block w-full object-cover"
                  style={{ height: 'clamp(320px, 52vw, 480px)', filter: WASH }}
                />
              </div>
              <figcaption className="font-satoshi mt-2 text-[12px]" style={{ color: MUTED }}>
                A Westfjords harbour house — illustrative
              </figcaption>
            </figure>

            {/* overlapping plated-dish inset — parallax drift */}
            <figure
              data-par="-0.05"
              className="absolute -bottom-6 -left-6 hidden w-[150px] sm:block sm:w-[180px]"
              style={{ margin: 0 }}
            >
              <div style={{ padding: 4, border: `1px solid rgba(31,42,46,0.2)`, background: SURFACE, boxShadow: '0 18px 40px -24px rgba(31,42,46,0.55)' }}>
                <Img
                  src={u(IMG.heroPlate, 480)}
                  srcSet={`${u(IMG.heroPlate, 320)} 320w, ${u(IMG.heroPlate, 480)} 480w`}
                  sizes="180px"
                  width={180}
                  height={140}
                  alt="A plated pan-seared fish dish in warm light, introducing the kitchen — indicative"
                  className="block h-[120px] w-full object-cover sm:h-[140px]"
                  style={{ filter: WASH }}
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 * From the Harbour — NEW full-bleed editorial sourcing band.
 * Image scales 1.06→1 on enter via a class toggle + CSS transition (no Framer).
 * ────────────────────────────────────────────────────────────────────────── */
function FromTheHarbour() {
  const { ref, on } = useInView<HTMLDivElement>(0.12)
  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: SLATE_PANEL }}>
      <div className="absolute inset-0">
        <Img
          src={u(IMG.catchBand, 1800)}
          srcSet={srcSet(IMG.catchBand)}
          sizes="100vw"
          width={1800}
          height={900}
          alt="Fresh day-boat fish on ice at a Nordic dock — indicative of the kitchen’s sourcing"
          className="ed-bandimg block h-full w-full object-cover"
          style={{ filter: WASH, transform: on ? 'scale(1)' : 'scale(1.06)' }}
        />
        {/* dark slate scrim for AA-legible ecru text */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(31,42,46,0.86) 0%, rgba(31,42,46,0.7) 42%, rgba(31,42,46,0.32) 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-[1180px] flex-col justify-center px-6" style={{ minHeight: 'clamp(420px, 62vh, 560px)' }}>
        <div
          className="max-w-[34ch] py-20"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? 'none' : 'translateY(18px)',
            transition: 'opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <Eyebrow color={PINK}>Tonight’s catch</Eyebrow>
          <h2
            className="font-cabinet mt-5 font-extrabold lowercase"
            style={{ color: GROUND, fontSize: 'clamp(2rem,5.4vw,3.6rem)', lineHeight: 0.96, letterSpacing: '-0.02em' }}
          >
            what the boats bring in,<br />
            <span style={{ color: PINK }}>by lamplight.</span>
          </h2>
          <p className="font-satoshi mt-6 text-[16px] sm:text-[17px]" style={{ color: 'rgba(237,228,211,0.92)', lineHeight: 1.6 }}>
            The kitchen cooks to the day’s landing — halibut and cod from the day-boats,
            lamb off the Westfjords fells, roots pulled from the valley. So the bill of fare
            shifts with the harbour, and the best plate is whatever came in this morning.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            {CATCH_TAGS.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: PINK }} />}
                <span
                  className="font-cabinet text-[11px] font-medium uppercase"
                  style={{ letterSpacing: '0.18em', color: ECRU_DIM }}
                >
                  {t}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 * The Menu — the signature "self-setting bill of fare".
 *
 * Driven by ONE passive synchronous scroll handler that reads each course's
 * getBoundingClientRect and sets per-course progress directly (no Framer
 * useScroll, no rAF lerp — those read 0 / never advance in the throttled
 * preview). A setTimeout failsafe sets everything to "set" so nothing can be
 * trapped un-typeset. Reduced motion renders fully set immediately.
 * ────────────────────────────────────────────────────────────────────────── */
function Menu() {
  const courseRefs = useRef<Array<HTMLElement | null>>([])
  const sealRef = useRef<HTMLDivElement>(null)
  // per-course "typeset" progress 0..1 → drives leaders + numeral draw + rows.
  const [prog, setProg] = useState<number[]>(() => COURSES.map(() => 0))
  const [active, setActive] = useState(0)
  const [sealed, setSealed] = useState(false)

  useEffect(() => {
    const reduce = prefersReduced()
    if (reduce) {
      setProg(COURSES.map(() => 1))
      setActive(COURSES.length - 1)
      setSealed(true)
      return
    }

    let ticking = false
    const compute = () => {
      ticking = false
      const vh = window.innerHeight
      let act = 0
      setProg((prev) =>
        courseRefs.current.map((el, i) => {
          if (!el) return prev[i] ?? 0
          const r = el.getBoundingClientRect()
          // 0 when the course top is at the bottom of the viewport,
          // 1 once it has risen ~62% of the way up — "printing as you read".
          const start = vh * 0.92
          const end = vh * 0.3
          const p = (start - r.top) / (start - end)
          if (r.top < vh * 0.5 && r.bottom > vh * 0.2) act = i
          return Math.max(0, Math.min(1, p))
        }),
      )
      setActive(act)
      const seal = sealRef.current
      if (seal) {
        const sr = seal.getBoundingClientRect()
        if (sr.top < vh * 0.82) setSealed(true)
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      // microtask flush keeps it synchronous-cheap without rAF dependence
      Promise.resolve().then(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    compute()
    // failsafe — if the tab was throttled and scroll never fired enough,
    // ensure the menu still fully typesets and seals after a moment in view.
    const fs = window.setTimeout(() => {
      setProg(COURSES.map(() => 1))
      setSealed(true)
    }, 2600)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(fs)
    }
  }, [])

  const onJump = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
    const el = document.getElementById(`course-${idx}`)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <section id="menu" className="relative scroll-mt-4" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>The bill of fare</Eyebrow>
            <h2 className="font-cabinet mt-4 font-extrabold lowercase" style={{ color: INK, fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              four courses,<br />set as you read.
            </h2>
          </div>
          <p className="font-satoshi max-w-[34ch] text-[13px]" style={{ color: MUTED, lineHeight: 1.5 }}>
            <span style={{ color: OXBLOOD, fontWeight: 600 }}>Sýnishorn af matseðli.</span>{' '}
            A sample menu — the kitchen cooks to the day’s catch, so dishes and the
            prices shown here are illustrative. Confirm the night’s plates in the room.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[64px_1fr] lg:gap-12">
          {/* sticky course rail — functional quick-jump nav / table of contents */}
          <nav aria-label="Courses" className="hidden lg:block">
            <ul className="sticky top-10 space-y-5">
              {COURSES.map((c, i) => (
                <li key={c.numeral}>
                  <a
                    href={`#course-${c.index}`}
                    onClick={(e) => onJump(e, c.index)}
                    aria-current={active === i ? 'true' : undefined}
                    className="font-cabinet inline-flex flex-col text-[20px] font-extrabold transition-colors"
                    style={{
                      color: active === i ? OXBLOOD : 'rgba(31,42,46,0.55)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {c.numeral}
                    <span
                      aria-hidden
                      style={{
                        marginTop: 4,
                        height: 2,
                        width: 16,
                        background: OXBLOOD,
                        transformOrigin: 'left',
                        transform: active === i ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform .3s cubic-bezier(.2,.7,.2,1)',
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* the dinner table — single reading column */}
          <div className="max-w-[760px]">
            {COURSES.map((course, ci) => {
              const p = prog[ci] ?? 0
              const dish = COURSE_IMG[course.index]
              // alternate the thumbnail side for an editorial rhythm
              const floatRight = ci % 2 === 0
              return (
                <section
                  id={`course-${course.index}`}
                  key={course.numeral}
                  ref={(el) => {
                    courseRefs.current[ci] = el
                  }}
                  className="relative scroll-mt-10"
                  style={{ paddingTop: ci === 0 ? 0 : 56, paddingBottom: 8 }}
                >
                  {/* hairline rule between courses only */}
                  {ci > 0 && (
                    <div
                      className="absolute left-0 right-0 top-0 h-px"
                      style={{ background: 'rgba(110,31,43,0.34)', transformOrigin: 'left', transform: `scaleX(${Math.max(0.06, p)})` }}
                    />
                  )}

                  <div className="mb-7 flex items-baseline gap-5">
                    {/* giant outline roman numeral, hangs into the gutter, stroke-draws */}
                    <span aria-hidden className="relative -ml-1 select-none lg:-ml-14" style={{ width: 'auto' }}>
                      <svg width="78" height="92" viewBox="0 0 78 92" style={{ overflow: 'visible' }}>
                        <text
                          x="2"
                          y="74"
                          fontFamily="'Cabinet Grotesk', sans-serif"
                          fontSize="92"
                          fontWeight="800"
                          fill="none"
                          stroke={OXBLOOD}
                          strokeWidth="1.4"
                          strokeDasharray="320"
                          strokeDashoffset={320 - 320 * Math.min(1, p * 1.4)}
                          style={{ transition: 'stroke-dashoffset 120ms linear' }}
                        >
                          {course.numeral}
                        </text>
                      </svg>
                    </span>
                    <div>
                      <span className="font-cabinet text-[11px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: MUTED }}>
                        Course {course.numeral} · {course.gloss}
                      </span>
                      <h3 className="font-cabinet mt-1 text-[26px] font-extrabold" style={{ color: INK, letterSpacing: '-0.01em' }}>
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* one framed dish thumbnail per course — fades on this course's progress */}
                  {dish && (
                    <figure
                      className={`mb-3 w-[42vw] max-w-[220px] sm:w-[240px] sm:max-w-[240px] ${
                        floatRight ? 'float-right' : 'float-left'
                      }`}
                      style={{
                        margin: floatRight ? '0 0 14px 22px' : '0 22px 14px 0',
                        opacity: p >= 0.12 ? 1 : 0,
                        transform: p >= 0.12 ? 'none' : 'translateY(10px)',
                        transition: 'opacity .55s cubic-bezier(.2,.7,.2,1), transform .55s cubic-bezier(.2,.7,.2,1)',
                      }}
                    >
                      <div style={{ padding: 4, border: `1px solid rgba(31,42,46,0.18)`, background: SURFACE }}>
                        <Img
                          src={u(dish.id, 480)}
                          srcSet={`${u(dish.id, 320)} 320w, ${u(dish.id, 480)} 480w`}
                          sizes="240px"
                          width={240}
                          height={172}
                          alt={dish.alt}
                          className="block h-[150px] w-full object-cover sm:h-[172px]"
                          style={{ filter: WASH }}
                        />
                      </div>
                      <figcaption className="font-satoshi mt-1.5 text-[12px]" style={{ color: MUTED }}>
                        {dish.cap}
                      </figcaption>
                    </figure>
                  )}

                  <ul>
                    {course.dishes.map((d, di) => {
                      // staggered down the course, gated on this course's progress
                      const rowThreshold = 0.12 + di * 0.12
                      const rowOn = p >= rowThreshold
                      // leader runs out once the row is set
                      const leader = p >= rowThreshold + 0.06 ? 1 : 0
                      return (
                        <li
                          key={d.name}
                          className="py-3.5"
                          style={{
                            opacity: rowOn ? 1 : 0,
                            transform: rowOn ? 'none' : 'translateY(8px)',
                            transition: 'opacity .5s cubic-bezier(.2,.7,.2,1), transform .5s cubic-bezier(.2,.7,.2,1)',
                          }}
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="font-ranade italic whitespace-normal sm:whitespace-nowrap" style={{ color: INK, fontSize: '23px', fontStyle: 'italic' }}>
                              {d.name}
                            </span>
                            {d.veg && <Leaf />}
                            {/* dotted price leader — "runs" to the right edge */}
                            <span
                              aria-hidden
                              className="mx-1 min-w-[24px] flex-1 self-end"
                              style={{
                                height: 0,
                                marginBottom: 6,
                                borderBottom: `2px dotted ${OXBLOOD}`,
                                opacity: 0.7,
                                transformOrigin: 'left',
                                transform: `scaleX(${leader})`,
                                transition: 'transform .5s cubic-bezier(.2,.7,.2,1)',
                              }}
                            />
                            <span
                              className="font-cabinet shrink-0 font-medium tabular-nums"
                              style={{
                                color: OXBLOOD,
                                fontSize: '17px',
                                opacity: leader,
                                transition: 'opacity .35s ease .15s',
                              }}
                            >
                              {isk(d.price)}
                            </span>
                          </div>
                          <p className="font-satoshi mt-1 max-w-[52ch] text-[15px] sm:text-[16px]" style={{ color: MUTED, lineHeight: 1.5 }}>
                            {d.desc}
                            {d.veg && <span style={{ color: OXBLOOD, fontWeight: 500 }}> · grænmetisréttur</span>}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="clear-both" />
                </section>
              )
            })}

            {/* the wax seal presses down at the foot of the bill */}
            <div ref={sealRef} className="mt-14 flex flex-col items-center gap-4 pb-2">
              <div className="h-px w-full" style={{ background: 'rgba(110,31,43,0.34)' }} />
              <div className="pt-6">
                <WaxSeal stamped={sealed} />
              </div>
              <p className="font-satoshi text-center text-[12px]" style={{ color: MUTED }}>
                Prices are a sample · the kitchen cooks to the day’s catch
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 * The Room — NEW signature-scale gallery (editorial bento + lightbox).
 * IO stagger reveal; click any tile to open a state-driven lightbox.
 * ────────────────────────────────────────────────────────────────────────── */
function Room() {
  const { ref, on } = useInView<HTMLDivElement>(0.1)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length))
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox])

  const open = lightbox !== null ? GALLERY[lightbox] : null

  return (
    <section id="room" ref={ref} className="relative" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Inside the old house</Eyebrow>
            <h2 className="font-cabinet mt-4 font-extrabold lowercase" style={{ color: INK, fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              lamp-lit, timber-walled,<br />looking over the water.
            </h2>
          </div>
          <p className="font-satoshi max-w-[32ch] text-[13px]" style={{ color: MUTED, lineHeight: 1.5 }}>
            Scroll through an evening out. Interior and food shots below are
            indicative — stand-ins that carry the room’s warmth, not photographs of the
            night you’ll have.
          </p>
        </div>

        {/* asymmetric bento — 4 cols on desktop, reflow to 2 / 1 below */}
        <div className="grid grid-cols-2 gap-3 sm:auto-rows-[230px] sm:grid-cols-4">
          {GALLERY.map((tile, i) => (
            <button
              key={tile.id + i}
              type="button"
              onClick={() => setLightbox(i)}
              className={`ed-tile group relative block overflow-hidden ${tile.span}`}
              style={{
                border: '1px solid rgba(31,42,46,0.14)',
                opacity: on ? 1 : 0,
                transform: on ? 'none' : 'translateY(22px)',
                transition: `opacity .6s cubic-bezier(.2,.7,.2,1) ${i * 70}ms, transform .6s cubic-bezier(.2,.7,.2,1) ${i * 70}ms`,
              }}
              aria-label={`Open image: ${tile.cap}`}
            >
              <Img
                src={u(tile.id, 1200)}
                srcSet={srcSet(tile.id)}
                sizes="(max-width: 640px) 50vw, 25vw"
                width={600}
                height={tile.h}
                alt={tile.alt}
                className="ed-tile-img block h-[200px] w-full object-cover sm:h-full"
                style={{ filter: WASH }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-3"
                style={{ background: 'linear-gradient(to top, rgba(31,42,46,0.72), rgba(31,42,46,0))' }}
              >
                <span className="font-cabinet text-[11px] font-medium uppercase" style={{ letterSpacing: '0.14em', color: GROUND }}>
                  {tile.cap}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="font-satoshi mt-5 text-[12px]" style={{ color: MUTED }}>
          Indicative imagery · click any frame to enlarge
        </p>
      </div>

      {/* state-driven lightbox — no library */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10"
          style={{ background: 'rgba(31,42,46,0.92)' }}
          role="dialog"
          aria-modal="true"
          aria-label={open.cap}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="font-cabinet absolute right-4 top-4 z-[61] flex h-11 w-11 items-center justify-center text-[20px]"
            style={{ color: GROUND, border: `1px solid rgba(237,228,211,0.4)`, borderRadius: 2 }}
          >
            ✕
          </button>
          <figure className="relative max-h-full max-w-[1000px]" style={{ margin: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 6, border: `1px solid ${OXBLOOD}`, background: SLATE_PANEL }}>
              <Img
                src={u(open.id, 1800)}
                srcSet={srcSet(open.id)}
                sizes="90vw"
                width={1000}
                height={680}
                alt={open.alt}
                className="block max-h-[78vh] w-full object-contain"
                style={{ filter: WASH }}
              />
            </div>
            <figcaption className="font-satoshi mt-3 flex items-center justify-between text-[13px]" style={{ color: ECRU_DIM }}>
              <span>{open.cap} — indicative</span>
              <span className="font-cabinet text-[11px] uppercase" style={{ letterSpacing: '0.14em' }}>
                {(lightbox ?? 0) + 1} / {GALLERY.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

/* ── Custom SVG fjord map (NOT a Google embed) — draws itself on enter ───── */
function FjordMap({ draw }: { draw: boolean }) {
  // a stylised Ísafjörður spit + coastline. Hand-tuned path lengths.
  const coastLen = 760
  return (
    <svg viewBox="0 0 420 320" className="block h-auto w-full" role="img" aria-label="Stylised map of the Ísafjörður harbour with the bistró marked at Aðalstræti 7">
      <rect x="0" y="0" width="420" height="320" fill={SLATE_PANEL} />
      {/* water hatching */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1="0" y1={40 + i * 40} x2="420" y2={40 + i * 40} stroke="rgba(237,228,211,0.06)" strokeWidth="1" />
      ))}
      {/* fjord landmass / the Eyri spit */}
      <path
        d="M0,250 C60,240 90,210 140,205 C180,201 200,150 250,140 C300,130 340,150 420,135 L420,320 L0,320 Z"
        fill="rgba(237,228,211,0.10)"
        stroke="#EDE4D3"
        strokeWidth="1.6"
        strokeDasharray={coastLen}
        strokeDashoffset={draw ? 0 : coastLen}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
      {/* the harbour curl of the spit */}
      <path
        d="M150,250 C175,236 168,210 195,205 C222,200 224,228 252,222"
        fill="none"
        stroke="rgba(237,228,211,0.5)"
        strokeWidth="1.2"
        strokeDasharray="180"
        strokeDashoffset={draw ? 0 : 180}
        style={{ transition: 'stroke-dashoffset 1.2s ease .2s' }}
      />
      {/* oxblood pin at Aðalstræti 7 */}
      <g
        style={{
          transform: draw ? 'translateY(0)' : 'translateY(-14px)',
          opacity: draw ? 1 : 0,
          transition: 'transform .5s cubic-bezier(.34,1.56,.5,1) 1s, opacity .4s ease 1s',
        }}
      >
        <circle className="ed-ripple" cx="206" cy="206" r="8" fill="none" stroke={OXBLOOD} strokeWidth="2" />
        <circle cx="206" cy="206" r="6" fill={OXBLOOD} />
        <circle cx="206" cy="206" r="2.4" fill={GROUND} />
      </g>
      <text x="206" y="190" textAnchor="middle" fontFamily="'Cabinet Grotesk', sans-serif" fontSize="10" fontWeight="600" letterSpacing="1.5" fill="#EDE4D3" opacity={draw ? 0.92 : 0} style={{ transition: 'opacity .4s ease 1.1s' }}>
        AÐALSTRÆTI 7
      </text>
    </svg>
  )
}

/* ── Hours & Harbour Wayfinding — slate timetable + SVG map + exterior photo ─ */
function HoursWayfinding({ todayJs }: { todayJs: number }) {
  const { ref, on: draw } = useInView<HTMLDivElement>(0.18)

  return (
    <section id="hours" ref={ref} style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <Eyebrow>Open & how to find us</Eyebrow>
        <h2 className="font-cabinet mt-4 max-w-[18ch] font-extrabold lowercase" style={{ color: INK, fontSize: 'clamp(1.9rem,4.5vw,3rem)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
          the door, and the way to it.
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* slate timetable panel */}
          <div className="ed-on-dark rounded-[2px] p-7 sm:p-9" style={{ background: SLATE_PANEL, color: GROUND }}>
            <span className="font-cabinet text-[11px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: ECRU_DIM }}>
              The week
            </span>
            <ul className="mt-6">
              {HOURS.map((row) => {
                const isToday = row.jsDays.includes(todayJs)
                return (
                  <li
                    key={row.day}
                    className="ed-dayrow group relative flex items-center justify-between gap-4 py-3.5"
                    style={{ borderTop: '1px solid rgba(237,228,211,0.14)' }}
                  >
                    {isToday && (
                      <span
                        aria-hidden
                        className="absolute -left-7 top-1/2 hidden sm:block"
                        style={{
                          width: 18,
                          height: 3,
                          background: OXBLOOD,
                          transform: draw ? 'translateY(-50%) scaleX(1)' : 'translateY(-50%) scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform .35s ease .2s',
                        }}
                      />
                    )}
                    <div className="flex items-baseline gap-3">
                      <span className="font-cabinet text-[16px] font-extrabold" style={{ color: GROUND }}>
                        {row.day}
                      </span>
                      <span className="font-satoshi text-[12px]" style={{ color: ECRU_DIM }}>
                        {row.en}
                      </span>
                      {isToday && (
                        <span className="font-cabinet text-[10px] font-medium uppercase" style={{ letterSpacing: '0.16em', color: PINK, background: OXBLOOD, padding: '2px 7px', borderRadius: 2 }}>
                          í dag
                        </span>
                      )}
                    </div>
                    <span
                      className="font-satoshi text-[15px]"
                      style={{ color: row.closed ? ECRU_DIM : GROUND, fontStyle: row.closed ? 'italic' : 'normal' }}
                    >
                      {row.hours}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="font-satoshi mt-5 text-[12px]" style={{ color: ECRU_DIM, lineHeight: 1.5 }}>
              Hours vary by season — please confirm on Facebook before setting out.
            </p>

            <div className="my-6 h-px w-full" style={{ background: 'rgba(237,228,211,0.14)' }} />
            <div className="space-y-3">
              <a href={`tel:${PHONE_HREF}`} className="font-cabinet block text-[22px] font-extrabold transition-opacity hover:opacity-75" style={{ color: GROUND, letterSpacing: '-0.01em' }}>
                {PHONE_DISPLAY}
              </a>
              <p className="font-satoshi text-[15px]" style={{ color: 'rgba(237,228,211,0.82)' }}>
                Or send a message on Facebook to confirm a table or the night’s hours.
              </p>
            </div>
          </div>

          {/* right — custom SVG map + exterior vignette diptych */}
          <div className="grid gap-6 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="overflow-hidden rounded-[2px]" style={{ border: '1px solid rgba(31,42,46,0.14)' }}>
              <FjordMap draw={draw} />
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ background: SURFACE }}>
                <div>
                  <div className="font-cabinet text-[14px] font-extrabold" style={{ color: INK }}>{ADDRESS}</div>
                  <div className="font-satoshi mt-0.5 text-[12px]" style={{ color: MUTED }}>{COORDS} approx. · in the old Edinborg house</div>
                </div>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-cabinet text-[11px] font-medium uppercase transition-opacity hover:opacity-70"
                  style={{ letterSpacing: '0.16em', color: OXBLOOD }}
                >
                  Open in maps →
                </a>
              </div>
            </div>

            {/* restored exterior vignette — promoted to a proper framed feature */}
            <figure className="flex flex-col" style={{ margin: 0 }}>
              <div className="flex-1 overflow-hidden rounded-[2px]" style={{ border: `1px solid ${OXBLOOD}`, padding: 5, background: SURFACE }}>
                <Img
                  src={u(IMG.exterior, 800)}
                  srcSet={srcSet(IMG.exterior)}
                  sizes="(max-width: 640px) 92vw, 300px"
                  width={300}
                  height={360}
                  alt="A wooden house entrance and facade in the evening, evoking the Edinborg house — indicative"
                  className="block h-full min-h-[220px] w-full object-cover"
                  style={{ filter: WASH }}
                />
              </div>
              <figcaption className="font-satoshi mt-2 text-[12px]" style={{ color: MUTED }}>
                The old wooden house, by evening — illustrative
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── The Edinborg House — heritage band with an enlarged archival print ──── */
function Heritage() {
  const { ref, on } = useInView<HTMLDivElement>(0.16)

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: OXBLOOD, color: GROUND }}>
      {/* faint 1907 watermark, parallax */}
      <span
        aria-hidden
        data-par="-0.08"
        className="font-cabinet pointer-events-none absolute -right-4 top-6 select-none font-extrabold"
        style={{
          fontSize: 'clamp(8rem,22vw,18rem)',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(237,228,211,0.16)',
          lineHeight: 1,
        }}
      >
        1907
      </span>

      <div className="relative mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <Eyebrow color={PINK}>The Edinborg house</Eyebrow>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            <h2 className="font-cabinet font-extrabold lowercase" style={{ color: GROUND, fontSize: 'clamp(2rem,5vw,3.6rem)', lineHeight: 0.94, letterSpacing: '-0.02em' }}>
              a trading hall on the water,<br />
              <span style={{ color: PINK }}>since 1907.</span>
            </h2>
            <p className="font-satoshi mt-7 max-w-[58ch] text-[17px] sm:text-[18px]" style={{ color: 'rgba(237,228,211,0.92)', lineHeight: 1.6 }}>
              {HERITAGE_BODY}
            </p>

            {/* heritage timeline rail */}
            <ol className="relative mt-10" style={{ borderLeft: '1px solid rgba(237,228,211,0.28)' }}>
              {HERITAGE.map((step, i) => (
                <li key={i} className="relative pb-7 pl-7 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-1.5"
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: on ? GROUND : 'rgba(237,228,211,0.3)',
                      transition: `background .4s ease ${i * 160 + 200}ms`,
                    }}
                  />
                  <div className="font-cabinet text-[15px] font-extrabold" style={{ color: PINK, letterSpacing: '0.04em' }}>
                    {step.year}
                  </div>
                  <div className="font-satoshi mt-1 text-[15px]" style={{ color: 'rgba(237,228,211,0.9)', lineHeight: 1.5 }}>
                    {step.label}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* LARGE archival print, pinned & rotated, with a small stacked sibling */}
          <div className="relative self-start">
            <figure
              className="relative"
              style={{
                transform: on ? 'rotate(-2deg)' : 'rotate(-4deg) translateY(-6px)',
                transition: 'transform .7s cubic-bezier(.34,1.4,.5,1)',
                margin: 0,
              }}
            >
              <div style={{ padding: 8, border: '1px solid rgba(237,228,211,0.5)', background: 'rgba(237,228,211,0.06)' }}>
                <Img
                  src={u(IMG.heritage, 1200)}
                  srcSet={srcSet(IMG.heritage)}
                  sizes="(max-width: 1024px) 92vw, 440px"
                  width={440}
                  height={520}
                  alt="An old Icelandic wooden harbour trading house, archival in feel, evoking the Edinborg house"
                  className="block w-full object-cover"
                  style={{ height: 'clamp(360px, 50vw, 500px)', filter: WASH_SEPIA }}
                />
              </div>
              <figcaption className="font-satoshi mt-3 text-[12px]" style={{ color: 'rgba(237,228,211,0.78)' }}>
                The old harbour house — archival, illustrative
              </figcaption>
            </figure>

            {/* small stacked dockside print for a layered archive feel */}
            <figure
              className="absolute -bottom-8 -left-5 hidden w-[170px] sm:block"
              style={{
                margin: 0,
                transform: on ? 'rotate(4deg)' : 'rotate(8deg) translateY(8px)',
                transition: 'transform .7s cubic-bezier(.34,1.4,.5,1) .12s',
              }}
            >
              <div style={{ padding: 5, border: '1px solid rgba(237,228,211,0.5)', background: 'rgba(237,228,211,0.06)' }}>
                <Img
                  src={u(IMG.harbour, 480)}
                  srcSet={`${u(IMG.harbour, 320)} 320w, ${u(IMG.harbour, 480)} 480w`}
                  sizes="170px"
                  width={170}
                  height={120}
                  alt="A fishing boat near a lighthouse on calm water, evoking the Ísafjörður harbour — indicative"
                  className="block h-[110px] w-full object-cover"
                  style={{ filter: WASH_SEPIA }}
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Words from the room — NEW reviews / social-proof trust band ─────────── */
function Reviews() {
  const { ref, on } = useInView<HTMLDivElement>(0.18)
  const [counts, setCounts] = useState<number[]>(() => RATINGS.map(() => 0))

  useEffect(() => {
    if (prefersReduced()) {
      setCounts(RATINGS.map((r) => r.score))
      return
    }
    if (!on) return
    const start = performance.now()
    const dur = 900
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur)
      const e = 1 - Math.pow(1 - k, 3)
      setCounts(RATINGS.map((r) => Math.round(r.score * e * 10) / 10))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    // failsafe — guarantee final values land even if rAF is throttled
    const fs = window.setTimeout(() => setCounts(RATINGS.map((r) => r.score)), 1200)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fs)
    }
  }, [on])

  return (
    <section id="reviews" ref={ref} style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          {/* left — verified, attributed ratings */}
          <div>
            <Eyebrow>Words from the room</Eyebrow>
            <h2 className="font-cabinet mt-4 font-extrabold lowercase" style={{ color: INK, fontSize: 'clamp(1.9rem,4.5vw,3rem)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              well thought of,<br />by the water.
            </h2>
            <ul className="mt-9">
              {RATINGS.map((r, i) => (
                <li
                  key={r.source}
                  className="flex items-baseline justify-between gap-4 py-4"
                  style={{ borderTop: '1px solid rgba(31,42,46,0.14)' }}
                >
                  <span
                    className="font-cabinet text-[14px] font-medium uppercase"
                    style={{ letterSpacing: '0.12em', color: INK }}
                  >
                    {r.source}
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-cabinet text-[26px] font-extrabold tabular-nums" style={{ color: OXBLOOD, letterSpacing: '-0.01em' }}>
                      {(counts[i] ?? 0).toFixed(1)}
                    </span>
                    <span className="font-satoshi text-[12px]" style={{ color: MUTED }}>
                      / {r.outOf} · {r.count}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-satoshi mt-4 text-[12px]" style={{ color: MUTED, lineHeight: 1.5 }}>
              Illustrative figures shown for this preview — indicative of the kind of standing the
              room enjoys, not verified current scores. Check each platform directly for the latest.
            </p>
          </div>

          {/* right — illustrative, labelled pull-quotes + a warm framed candid */}
          <div className="grid gap-6 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:items-stretch">
            <ul className="flex flex-col justify-center gap-8">
              {QUOTES.map((q, i) => (
                <li
                  key={i}
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateY(14px)',
                    transition: `opacity .6s cubic-bezier(.2,.7,.2,1) ${i * 120 + 120}ms, transform .6s cubic-bezier(.2,.7,.2,1) ${i * 120 + 120}ms`,
                  }}
                >
                  <p className="font-cabinet text-[20px] font-extrabold lowercase sm:text-[23px]" style={{ color: INK, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                    <span style={{ color: OXBLOOD }}>“</span>
                    {q.body}
                    <span style={{ color: OXBLOOD }}>”</span>
                  </p>
                  <span className="font-cabinet mt-3 inline-block text-[11px] font-medium uppercase" style={{ letterSpacing: '0.16em', color: MUTED }}>
                    {q.who}
                  </span>
                </li>
              ))}
            </ul>
            <figure className="hidden flex-col sm:flex" style={{ margin: 0 }}>
              <div className="flex-1 overflow-hidden rounded-[2px]" style={{ border: '1px solid rgba(31,42,46,0.16)', padding: 5, background: SURFACE }}>
                <Img
                  src={u(IMG.roomDetail, 800)}
                  srcSet={srcSet(IMG.roomDetail)}
                  sizes="220px"
                  width={220}
                  height={300}
                  alt="Coffee and cake in warm light, a candid room detail — indicative"
                  className="block h-full min-h-[220px] w-full object-cover"
                  style={{ filter: WASH }}
                />
              </div>
              <figcaption className="font-satoshi mt-2 text-[12px]" style={{ color: MUTED }}>
                In the room — illustrative
              </figcaption>
            </figure>
          </div>
        </div>
        <p className="font-satoshi mt-10 text-[12px]" style={{ color: MUTED }}>
          Pull-quotes above are representative of visitor sentiment, written for this preview —
          not transcribed from a specific named review.
        </p>
      </div>
    </section>
  )
}

/* ── Reserve a table — NEW conversion panel (mocked, disclaimed, real tel/mailto) ─ */
function Reserve({ openLabel }: { openLabel: string }) {
  const { ref, on } = useInView<HTMLDivElement>(0.18)
  const [party, setParty] = useState(2)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:30')
  const [sent, setSent] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const times = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const rowStyle = (i: number) => ({
    opacity: on ? 1 : 0,
    transform: on ? 'none' : 'translateY(10px)',
    transition: `opacity .5s cubic-bezier(.2,.7,.2,1) ${i * 80 + 100}ms, transform .5s cubic-bezier(.2,.7,.2,1) ${i * 80 + 100}ms`,
  })

  return (
    <section id="reserve" ref={ref} className="scroll-mt-4" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* slate reservation panel */}
          <div className="ed-on-dark rounded-[2px] p-7 sm:p-10" style={{ background: SLATE_PANEL, color: GROUND }}>
            <Eyebrow color={PINK}>Reserve a table</Eyebrow>
            <h2 className="font-cabinet mt-5 font-extrabold lowercase" style={{ color: GROUND, fontSize: 'clamp(1.9rem,4.4vw,3rem)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              by the harbour window.
            </h2>
            <p className="font-satoshi mt-5 max-w-[46ch] text-[16px]" style={{ color: 'rgba(237,228,211,0.9)', lineHeight: 1.6 }}>
              Tables are held by phone or message — the room is small, so book ahead on busy
              fjord nights. Tonight: <span style={{ color: GROUND, fontWeight: 600 }}>{openLabel}</span>.
            </p>

            {/* large tappable contact actions — real tel/mailto */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4" style={rowStyle(0)}>
              <a href={`tel:${PHONE_HREF}`} className="font-cabinet text-[26px] font-extrabold transition-opacity hover:opacity-75 sm:text-[30px]" style={{ color: GROUND, letterSpacing: '-0.01em' }}>
                {PHONE_DISPLAY}
              </a>
              <span className="font-satoshi text-[15px]" style={{ color: 'rgba(237,228,211,0.85)' }}>
                or message on Facebook
              </span>
            </div>

            <div className="my-7 h-px w-full" style={{ background: 'rgba(237,228,211,0.16)' }} />

            {/* mocked, disclaimed request form */}
            {sent ? (
              <div
                role="status"
                className="rounded-[2px] p-6"
                style={{ background: 'rgba(237,228,211,0.08)', border: '1px solid rgba(237,228,211,0.22)' }}
              >
                <div className="font-cabinet text-[16px] font-extrabold" style={{ color: GROUND }}>
                  Takk — request noted (illustrative)
                </div>
                <p className="font-satoshi mt-2 text-[14px]" style={{ color: ECRU_DIM, lineHeight: 1.55 }}>
                  This preview form doesn’t send anything. To actually book{' '}
                  {party} {party === 1 ? 'guest' : 'guests'}
                  {date ? ` on ${date}` : ''} at {time}, call{' '}
                  <a href={`tel:${PHONE_HREF}`} className="underline" style={{ color: GROUND }}>{PHONE_DISPLAY}</a>{' '}
                  or send a message on Facebook.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="font-cabinet mt-4 text-[12px] font-medium uppercase transition-opacity hover:opacity-75"
                  style={{ letterSpacing: '0.16em', color: PINK }}
                >
                  ← Edit the request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-5 sm:grid-cols-3">
                  {/* party size stepper */}
                  <div style={rowStyle(1)}>
                    <label className="font-cabinet block text-[11px] font-medium uppercase" style={{ letterSpacing: '0.16em', color: ECRU_DIM }}>
                      Party
                    </label>
                    <div className="mt-2 flex items-center justify-between rounded-[2px]" style={{ border: '1px solid rgba(237,228,211,0.28)' }}>
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        onClick={() => setParty((n) => Math.max(1, n - 1))}
                        className="font-cabinet h-11 w-11 text-[20px] transition-opacity hover:opacity-70"
                        style={{ color: GROUND }}
                      >
                        −
                      </button>
                      <span className="font-cabinet text-[18px] font-extrabold tabular-nums" style={{ color: GROUND }}>
                        {party}
                      </span>
                      <button
                        type="button"
                        aria-label="More guests"
                        onClick={() => setParty((n) => Math.min(12, n + 1))}
                        className="font-cabinet h-11 w-11 text-[20px] transition-opacity hover:opacity-70"
                        style={{ color: GROUND }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* date */}
                  <div style={rowStyle(2)}>
                    <label htmlFor="ed-date" className="font-cabinet block text-[11px] font-medium uppercase" style={{ letterSpacing: '0.16em', color: ECRU_DIM }}>
                      Date
                    </label>
                    <input
                      id="ed-date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="font-satoshi mt-2 h-11 w-full rounded-[2px] bg-transparent px-3 text-[15px]"
                      style={{ border: '1px solid rgba(237,228,211,0.28)', color: GROUND, colorScheme: 'dark' }}
                    />
                  </div>

                  {/* time */}
                  <div style={rowStyle(3)}>
                    <label htmlFor="ed-time" className="font-cabinet block text-[11px] font-medium uppercase" style={{ letterSpacing: '0.16em', color: ECRU_DIM }}>
                      Time
                    </label>
                    <select
                      id="ed-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="font-satoshi mt-2 h-11 w-full rounded-[2px] bg-transparent px-3 text-[15px]"
                      style={{ border: '1px solid rgba(237,228,211,0.28)', color: GROUND, colorScheme: 'dark' }}
                    >
                      {times.map((t) => (
                        <option key={t} value={t} style={{ color: INK }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="ed-cta font-cabinet mt-6 inline-flex h-12 items-center justify-center px-7 text-[13px] font-medium uppercase transition-transform"
                  style={{ letterSpacing: '0.16em', background: OXBLOOD, color: GROUND, borderRadius: 2 }}
                >
                  Request a table →
                </button>
                <p className="font-satoshi mt-4 text-[12px]" style={{ color: ECRU_DIM, lineHeight: 1.5 }}>
                  Illustrative request form — this preview doesn’t take real bookings. The phone
                  above (or a Facebook message) is the live way to reserve.
                </p>
              </form>
            )}
          </div>

          {/* warm table-by-window image */}
          <figure className="hidden flex-col lg:flex" style={{ margin: 0 }}>
            <div className="flex-1 overflow-hidden rounded-[2px]" style={{ border: `1px solid ${OXBLOOD}`, padding: 6, background: GROUND }}>
              <Img
                src={u(IMG.reserveTable, 1000)}
                srcSet={srcSet(IMG.reserveTable)}
                sizes="(max-width: 1024px) 92vw, 380px"
                width={380}
                height={520}
                alt="An intimate table set by a window with candlelight — indicative of the room"
                className="block h-full min-h-[320px] w-full object-cover"
                style={{ filter: WASH }}
              />
            </div>
            <figcaption className="font-satoshi mt-2 text-[12px]" style={{ color: MUTED }}>
              A table by the window — illustrative
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ── Harbour sign-off — NEW bespoke footer cap above the shared footer ───── */
function SignOff() {
  const { ref, on } = useInView<HTMLDivElement>(0.3)
  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: GROUND, borderTop: '1px solid rgba(110,31,43,0.28)' }}>
      <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          <WaxSeal stamped={on} size={96} />
          <div>
            <div className="font-cabinet text-[12px] font-medium uppercase" style={{ letterSpacing: '0.3em', color: OXBLOOD }}>
              Edinborg · Bistró
            </div>
            <p className="font-satoshi mx-auto mt-5 max-w-[40ch] text-[16px]" style={{ color: MUTED, lineHeight: 1.6 }}>
              In the old Edinborg house, on the water. Come for the soup, the day’s fish and a
              window over the harbour at the close of a fjord day.
            </p>
            <div className="font-satoshi mt-5 text-[14px]" style={{ color: INK }}>
              {ADDRESS}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <ArrowLink href="#reserve">Reserve a table</ArrowLink>
            <ArrowLink href="#menu">View the menu</ArrowLink>
            <a
              href={`tel:${PHONE_HREF}`}
              className="font-cabinet text-[12px] font-medium uppercase transition-opacity hover:opacity-70"
              style={{ letterSpacing: '0.16em', color: OXBLOOD }}
            >
              Call {PHONE_DISPLAY} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Transform-only parallax for [data-par] (skipped under reduced motion) ─ */
function useParallax() {
  useEffect(() => {
    if (prefersReduced()) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'))
    if (!els.length) return
    let tick = false
    const onScroll = () => {
      if (tick) return
      tick = true
      Promise.resolve().then(() => {
        const vh = window.innerHeight
        const y = window.scrollY || 0
        els.forEach((el) => {
          const r = el.getBoundingClientRect()
          const mid = r.top + y + r.height / 2
          const rel = y + vh / 2 - mid
          el.style.transform = `translate3d(0, ${(rel * Number(el.dataset.par)).toFixed(1)}px, 0)`
        })
        tick = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* ──────────────────────────────────────────────────────────────────────── */
export default function EdinborgPage() {
  useParallax()

  const now = new Date()
  const todayJs = now.getDay()
  const todayRow = HOURS.find((h) => h.jsDays.includes(todayJs))
  const closeParts = todayRow?.hours.split('–')
  const closeTime = closeParts && closeParts[1] ? closeParts[1].trim() : null
  const openLabel = todayRow && !todayRow.closed && closeTime ? `Open until ${closeTime}` : 'Closed today'
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    document.title = 'Edinborg Bistró · Ísafjörður — a bistro told in courses'
    setThemeColor(GROUND)
    return () => setThemeColor('#0a1320')
  }, [])

  return (
    <div className="font-satoshi overflow-x-hidden" style={{ background: GROUND, color: INK }}>
      <style>{`
        #ed-root ::selection { background:${OXBLOOD}; color:${GROUND}; }
        #ed-root a:focus-visible,
        #ed-root button:focus-visible,
        #ed-root input:focus-visible,
        #ed-root select:focus-visible { outline:2px solid ${OXBLOOD}; outline-offset:3px; border-radius:2px; }
        #ed-root .ed-on-dark a:focus-visible,
        #ed-root .ed-on-dark button:focus-visible,
        #ed-root .ed-on-dark input:focus-visible,
        #ed-root .ed-on-dark select:focus-visible { outline-color:${GROUND}; }
        #ed-root .ed-arrow-tip { display:inline-block; transition:transform .25s cubic-bezier(.2,.7,.2,1); }
        #ed-root .ed-arrow:hover .ed-arrow-tip { transform:translateX(4px); }
        /* Hero entrance — base state VISIBLE; the keyframe (runs even when a tab
           is backgrounded, unlike rAF/Framer) supplies a transform-only drop-in. */
        .ed-rise { opacity:1; }
        @media (prefers-reduced-motion: no-preference) {
          .ed-rise { animation: ed-rise .7s cubic-bezier(.2,.7,.2,1) var(--d,0ms) both; }
          @keyframes ed-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
          .ed-ink { animation: ed-ink .7s cubic-bezier(.7,0,.3,1) 480ms both; }
          @keyframes ed-ink { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
          .ed-dot { animation: ed-breath 2.4s ease-in-out infinite; }
          @keyframes ed-breath { 0%,100% { opacity:.5; transform:scale(.9); } 50% { opacity:1; transform:scale(1.25); } }
          .ed-dayrow:hover { transform: translateX(4px); }
          .ed-dayrow { transition: transform .25s cubic-bezier(.2,.7,.2,1); }
          .ed-ripple { animation: ed-ripple 2.6s ease-out infinite; transform-origin:center; transform-box:fill-box; }
          @keyframes ed-ripple { 0% { transform:scale(.6); opacity:.9; } 70%,100% { transform:scale(2.4); opacity:0; } }
          .ed-bandimg { transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
          .ed-tile-img { transition: transform .5s cubic-bezier(.2,.7,.2,1); }
          .ed-tile:hover .ed-tile-img { transform: scale(1.04); }
          .ed-cta:hover { transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ed-bandimg { transform:none !important; }
        }
      `}</style>
      <div id="ed-root">
        <PreviewChrome company={company} />
        <PartialPrototypeBanner />
        <main>
          <Hero openLabel={openLabel} dateLabel={dateLabel} />
          <FromTheHarbour />
          <Menu />
          <Room />
          <HoursWayfinding todayJs={todayJs} />
          <Heritage />
          <Reviews />
          <Reserve openLabel={openLabel} />
          <SignOff />
        </main>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
