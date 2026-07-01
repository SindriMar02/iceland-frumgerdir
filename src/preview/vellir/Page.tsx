import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  AMENITIES,
  CLOSING,
  COTTAGES,
  EMAIL,
  FAQ,
  FARM,
  FIND,
  GUEST,
  GUEST_QUOTES,
  HOSTS,
  IMG,
  NEARBY,
  PETURSEY,
  PHONE,
  PHONE_HREF,
  PLACE,
  RESTAURANT,
  ROOMS_SUMMARY,
  ROOM_TYPES,
  srcSet,
  STAY,
  TRUST,
  u,
  UIMG,
  UNITS,
} from './data'
import type { RoomType } from './data'

const company = getPreviewCompany('vellir')

/* ── Palette — cream/bone canvas, near-black ink, one cool slate-blue accent ─
 * GROUND/CREAM   #F4EFE6  ·  INK on GROUND          15.16:1 (AAA)
 * ACCENT on GROUND #3D5A6C  6.37:1 (AA)  ·  white-on-ACCENT fill  7.30:1 (AA)
 * MUTED on GROUND  #5B5650  6.34:1 (AA)  ·  cream-on-DEEP        10.38:1 (AAA)
 * DEEP slate band is a DIFFERENT hue from ACCENT so fills still read on it. */
const GROUND = '#F4EFE6' // cream/bone canvas
const SURFACE = '#FFFFFF' // pure white card surface (subtle lift off cream)
const INK = '#1C1A17' // near-black ink text
const MUTED = '#5B5650' // warm ink-grey for secondary copy
const ACCENT = '#3D5A6C' // cool slate-blue — the ONE accent, used sparingly
const ACCENT_TINT = '#8FAEBE' // lightened slate, for small accents on dark bands
const DEEP = '#243A45' // deep slate-ink alternating section band
const HAIRLINE = 'rgba(28,26,23,.12)' // ink hairline on cream

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1A17]'
const FOCUS_ON_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EFE6]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV = [
  { id: 'stay', label: 'Stay' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'cottages', label: 'Cottages' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'find', label: 'Find us' },
] as const

/* ── Reveal — IntersectionObserver + CSS transition (copied from the
 * Síreksstaðir convention; framer whileInView stalls in this preview tooling) */
function Reveal({
  children,
  delay = 0,
  y = 22,
  dur = 0.62,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  dur?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.2 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1500) // failsafe
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${dur}s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform ${dur}s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [threshold])
  return { ref, shown }
}

/* ── Overline — thin accent rule + tracked small-caps label ──────────────── */
function Overline({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8" style={{ background: ACCENT }} aria-hidden />
      <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
        {children}
      </span>
    </div>
  )
}

/* ── Amenity glyphs — small inline SVGs, accent stroke ───────────────────── */
function Glyph({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: ACCENT,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'wifi':
      return (
        <svg {...common}>
          <path d="M3 9a14 14 0 0 1 18 0" />
          <path d="M6.5 12.5a9 9 0 0 1 11 0" />
          <path d="M10 16a4 4 0 0 1 4 0" />
          <circle cx="12" cy="19" r="0.6" fill={ACCENT} />
        </svg>
      )
    case 'car':
      return (
        <svg {...common}>
          <path d="M4 16v-3l2-5a2 2 0 0 1 2-1.4h8A2 2 0 0 1 18 8l2 5v3" />
          <path d="M4 13h16" />
          <circle cx="7.5" cy="16.5" r="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" />
        </svg>
      )
    case 'mountain':
      return (
        <svg {...common}>
          <path d="M3 18 9 8l4 6 2-3 6 7Z" />
          <circle cx="7.5" cy="6.5" r="1.4" />
        </svg>
      )
    case 'paw':
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="1.6" />
          <circle cx="12" cy="6" r="1.6" />
          <circle cx="17" cy="8" r="1.6" />
          <path d="M7.5 13.5c-1.8 1-2.3 3-1.2 4.4 1 1.2 2.7 1.2 4 .6.9-.4 1.7-.5 2.4-.5s1.5.1 2.4.5c1.3.6 3 .6 4-.6 1.1-1.4.6-3.4-1.2-4.4-1.4-.8-3.2-1.3-5.2-1.3s-3.8.5-5.2 1.3Z" />
        </svg>
      )
    case 'plate':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.4" />
        </svg>
      )
    case 'horse':
      return (
        <svg {...common}>
          <path d="M6 19v-5l-2-3 1-4 3-2h4l3 3v3l2 2v6" />
          <path d="M9 5V3M12 6 13 3" />
          <circle cx="13.5" cy="7" r="0.6" fill={ACCENT} />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      )
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      )
    default:
      return null
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV — small wordmark left, plain links, BOOK + phone + mail utility      */
/* ══════════════════════════════════════════════════════════════════════ */
function TopNav({ onRequest }: { onRequest: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: scrolled || menuOpen ? 'rgba(244,239,230,.96)' : 'rgba(244,239,230,.7)',
        borderBottom: `1px solid ${scrolled || menuOpen ? HAIRLINE : 'transparent'}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background .3s ease, border-color .3s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <button
          onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`font-sans text-[15px] font-extrabold uppercase tracking-[0.04em] ${FOCUS}`}
          style={{ color: INK }}
        >
          Vellir
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`font-sans text-[13.5px] font-medium transition-colors hover:opacity-70 ${FOCUS}`}
              style={{ color: INK }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={PHONE_HREF}
            className={`font-sans text-[13px] font-medium tracking-[0.02em] transition-opacity hover:opacity-70 ${FOCUS}`}
            style={{ color: MUTED }}
          >
            {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className={`font-sans text-[13px] font-medium underline-offset-[4px] transition-opacity hover:underline hover:opacity-70 ${FOCUS}`}
            style={{ color: MUTED }}
          >
            Email
          </a>
          <button
            onClick={onRequest}
            className={`font-sans text-[13px] font-bold uppercase tracking-[0.1em] underline-offset-[5px] hover:underline ${FOCUS}`}
            style={{ color: ACCENT }}
          >
            Book
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${FOCUS}`}
          style={{ color: INK }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M1 1l18 12M19 1 1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t px-5 pb-6 pt-2 md:hidden" style={{ borderColor: HAIRLINE, background: GROUND }}>
          <div className="flex flex-col">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`border-b py-3.5 text-left font-sans text-[15px] font-medium ${FOCUS}`}
                style={{ color: INK, borderColor: HAIRLINE }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a href={PHONE_HREF} className={`font-sans text-[14px] font-medium ${FOCUS}`} style={{ color: MUTED }}>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className={`font-sans text-[14px] font-medium underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: MUTED }}>
              {EMAIL}
            </a>
            <button
              onClick={() => {
                setMenuOpen(false)
                onRequest()
              }}
              className={`mt-1 inline-flex min-h-[46px] items-center justify-center rounded-full font-sans text-[14px] font-bold uppercase tracking-[0.08em] ${FOCUS}`}
              style={{ background: ACCENT, color: '#FFFFFF' }}
            >
              Book
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO — ALL-CAPS headline, asymmetric photo+copy, the GIANT overlapping  */
/*  "Vellir" wordmark signature (the one unmissable moment of the page)     */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero({ onRequest }: { onRequest: () => void }) {
  return (
    <header id="top" className="relative min-h-[100svh] overflow-x-clip" style={{ background: GROUND, color: INK }}>
      {/* full-height two-panel: content left, full-bleed image right */}
      <div className="grid md:min-h-[100svh] md:grid-cols-[1fr_1.02fr]">
        {/* LEFT — content, vertically centred; bottom padding reserves the wordmark band */}
        <div className="relative z-10 flex flex-col justify-center px-5 pb-[clamp(72px,11vh,120px)] pt-[clamp(80px,13vh,104px)] sm:px-8 md:pb-[clamp(120px,17vh,190px)] md:pl-[max(2rem,calc((100vw-1152px)/2))] md:pr-14">
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
              {PLACE.overline}
            </p>
          </Reveal>
          <h1
            className="m-0 mt-5 max-w-[27ch] font-sans font-extrabold uppercase"
            style={{ fontSize: 'clamp(1.5rem,2.7vw,2.35rem)', lineHeight: 1.08, letterSpacing: '-0.01em', color: INK }}
          >
            {PLACE.headline.map((line, i) => (
              <Reveal key={line} as="div" delay={80 + i * 90} y={16}>
                {line}
              </Reveal>
            ))}
          </h1>
          <Reveal delay={260}>
            <p className="mt-6 max-w-[46ch] font-sans text-[13.5px] leading-[1.62]" style={{ color: MUTED }}>
              {PLACE.copy}
            </p>
          </Reveal>
          <Reveal delay={310}>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href={PHONE_HREF}
                className={`font-sans text-[15px] font-semibold ${FOCUS}`}
                style={{ color: INK }}
              >
                {PHONE}
              </a>
              <button
                onClick={onRequest}
                className={`inline-flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[0.1em] underline-offset-[5px] hover:underline ${FOCUS}`}
                style={{ color: ACCENT }}
              >
                Send inquiry
                <svg width="13" height="11" viewBox="0 0 14 12" fill="none" aria-hidden>
                  <path d="M1 6h12M8 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — full-bleed property photo filling the panel to the viewport edge */}
        <figure className="relative m-0 min-h-[30svh] overflow-hidden md:min-h-0">
          <Img
            src={IMG.exterior}
            alt={PLACE.caption}
            fetchpriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#cfc6ad] to-[#8c8470]"
          />
        </figure>
      </div>

      {/* THE SIGNATURE — giant Melodrama wordmark on the baseline, crossing from
          the cream content onto the photo's lower-left. A different treatment
          from the sibling build (there the wordmark tucks under a framed photo). */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[clamp(1.25rem,4vh,3rem)] left-0 z-20 select-none whitespace-nowrap px-5 sm:px-8 md:px-0 md:left-[max(2rem,calc((100vw-1152px)/2))]"
      >
        <span
          className="block"
          style={{
            fontFamily: "'Melodrama', serif",
            fontWeight: 700,
            fontSize: 'clamp(3rem,14vw,11rem)',
            lineHeight: 0.82,
            color: ACCENT,
            letterSpacing: '-0.015em',
            textShadow: '0 2px 12px rgba(28,26,23,.30)',
          }}
        >
          Vellir
        </span>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TRUST STRIP — plain ratings, no inflation                               */
/* ══════════════════════════════════════════════════════════════════════ */
function TrustStrip() {
  return (
    <section style={{ background: DEEP }} className="py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          {TRUST.map((t, i) => (
            <Reveal key={t.label} delay={i * 70} y={14}>
              <div className="font-sans text-[1.6rem] font-extrabold leading-none tracking-[-0.01em]" style={{ color: '#FFFFFF' }}>
                {t.value}
              </div>
              <div className="mt-2 font-sans text-[11.5px] font-medium uppercase tracking-[0.06em] leading-tight" style={{ color: ACCENT_TINT }}>
                {t.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ROOMS — 9 rooms, 3 types broken down, real photos                       */
/* ══════════════════════════════════════════════════════════════════════ */
function RoomCard({ r, delay }: { r: RoomType; delay: number }) {
  return (
    <Reveal as="figure" delay={delay} y={20} className="m-0 flex flex-col overflow-hidden rounded-[4px]" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="relative overflow-hidden">
        <Img
          src={IMG[r.image]}
          alt={r.imageAlt}
          className="block aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
          fallbackClassName="bg-gradient-to-br from-[#cfc6ad] to-[#8c8470]"
        />
        <span
          className="absolute left-3.5 top-3.5 rounded-[3px] px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.06em]"
          style={{ background: 'rgba(28,26,23,.82)', color: '#FFFFFF' }}
        >
          {r.count}
        </span>
      </div>
      <figcaption className="flex flex-1 flex-col p-5 md:p-6">
        <Overline>{r.overline}</Overline>
        <h3 className="mt-3 font-sans font-bold" style={{ color: INK, fontSize: 'clamp(1.15rem,2vw,1.4rem)', lineHeight: 1.16 }}>
          {r.name}
        </h3>
        <p className="mt-2.5 font-sans text-[14px] leading-[1.6]" style={{ color: MUTED }}>
          {r.desc}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: INK }}>
          {r.specs.map((s) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </figcaption>
    </Reveal>
  )
}

function Rooms({ onChoose }: { onChoose: (unit: string) => void }) {
  return (
    <section id="rooms" style={{ background: GROUND }} className="py-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Reveal>
              <Overline>{ROOMS_SUMMARY.overline}</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
                {ROOMS_SUMMARY.heading}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-4 max-w-[54ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED }}>
                {ROOMS_SUMMARY.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[12.5px] font-bold uppercase tracking-[0.06em]"
              style={{ background: 'rgba(61,90,108,.1)', color: ACCENT }}
            >
              {ROOMS_SUMMARY.totalNote}
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ROOM_TYPES.map((r, i) => (
            <RoomCard key={r.id} r={r} delay={i * 90} />
          ))}
        </div>

        <Reveal delay={220} className="mt-8 flex justify-start">
          <button
            onClick={() => onChoose('ensuite-double')}
            className={`inline-flex min-h-[44px] items-center font-sans text-[13.5px] font-bold uppercase tracking-[0.08em] underline-offset-[5px] hover:underline ${FOCUS}`}
            style={{ color: ACCENT }}
          >
            Check availability →
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  COTTAGES — separate copy/photos, no invented capacity                   */
/* ══════════════════════════════════════════════════════════════════════ */
function Cottages({ onChoose }: { onChoose: (unit: string) => void }) {
  const { ref, shown } = useInView(0.2)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section id="cottages" style={{ background: DEEP }} className="py-[clamp(64px,9vw,116px)]">
      <div ref={ref} className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-12 gap-y-10 md:grid-cols-[44fr_56fr]">
          <div
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(18px)',
              transition: `opacity .6s ${ease}, transform .6s ${ease}`,
            }}
          >
            <Overline color={ACCENT_TINT}>{COTTAGES.overline}</Overline>
            <h2 className="mt-5 font-sans font-extrabold" style={{ color: '#FFFFFF', fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
              {COTTAGES.heading}
            </h2>
            <p className="mt-5 max-w-[46ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: 'rgba(244,239,230,.82)' }}>
              {COTTAGES.body}
            </p>
            <p className="mt-5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.06em]" style={{ color: ACCENT_TINT }}>
              {COTTAGES.note}
            </p>
            <button
              onClick={() => onChoose('cottage')}
              className={`mt-7 inline-flex min-h-[44px] items-center rounded-full px-6 py-3 font-sans text-[13.5px] font-bold uppercase tracking-[0.08em] transition-transform active:scale-[0.98] ${FOCUS_ON_DARK}`}
              style={{ background: ACCENT, color: '#FFFFFF' }}
            >
              Ask about the cottages
            </button>
          </div>

          <div
            className="overflow-hidden rounded-[4px]"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateX(0)' : 'translateX(20px)',
              transition: `opacity .65s ${ease}, transform .65s ${ease}`,
            }}
          >
            <Img
              src={IMG.cottages}
              alt={COTTAGES.imageAlt}
              className="block aspect-[4/3] w-full object-cover sm:aspect-[16/11]"
              fallbackClassName="bg-gradient-to-br from-[#5a6f63] to-[#22302a]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PÉTURSEY & NEARBY — folklore mountain + honest distances card grid       */
/* ══════════════════════════════════════════════════════════════════════ */
function PeturseyAndNearby() {
  return (
    <section id="nearby" style={{ background: GROUND }} className="py-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Pétursey feature */}
        <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[52fr_48fr]">
          <Reveal as="figure" className="m-0 overflow-hidden rounded-[4px] md:order-2">
            <Img
              src={u(UIMG[PETURSEY.image])}
              srcSet={srcSet(UIMG[PETURSEY.image])}
              sizes="(max-width:768px) 100vw, 50vw"
              alt={PETURSEY.imageAlt}
              className="block aspect-[4/3] w-full object-cover sm:aspect-[16/12]"
              fallbackClassName="bg-gradient-to-br from-[#6f7d5c] to-[#2c3622]"
            />
          </Reveal>
          <div className="md:order-1">
            <Reveal>
              <Overline>{PETURSEY.overline}</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
                {PETURSEY.heading}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-[48ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED }}>
                {PETURSEY.body}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Nearby grid */}
        <div className="mt-16">
          <Reveal>
            <Overline>What is nearby</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h3 className="mt-4 max-w-[640px] font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', lineHeight: 1.12 }}>
              Honest distances, on the South Coast.
            </h3>
          </Reveal>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NEARBY.map((n, i) => (
              <Reveal key={n.name} delay={i * 80} y={18} as="figure" className="m-0 overflow-hidden rounded-[4px]" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Img
                  src={u(UIMG[n.image], 1200)}
                  srcSet={srcSet(UIMG[n.image])}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  alt={n.imageAlt}
                  className="block aspect-[16/10] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#82796a] to-[#3a3530]"
                />
                <figcaption className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-sans text-[15.5px] font-bold leading-snug" style={{ color: INK }}>
                      {n.name}
                    </h4>
                    <span className="shrink-0 font-sans text-[12.5px] font-bold tabular-nums" style={{ color: ACCENT }}>
                      {n.distance}
                    </span>
                  </div>
                  <p className="mt-2 font-sans text-[13.5px] leading-[1.55]" style={{ color: MUTED }}>
                    {n.body}
                  </p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  THE RESTAURANT — breakfast + dinner, never claimed complimentary        */
/* ══════════════════════════════════════════════════════════════════════ */
function Restaurant() {
  const { ref, shown } = useInView(0.2)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section style={{ background: GROUND }} className="py-[clamp(56px,8vw,100px)]">
      <div ref={ref} className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[42fr_58fr]">
          <div
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(18px)',
              transition: `opacity .6s ${ease}, transform .6s ${ease}`,
            }}
          >
            <Overline>{RESTAURANT.overline}</Overline>
            <h2 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              {RESTAURANT.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-sans text-[15px] leading-[1.65]" style={{ color: MUTED }}>
              {RESTAURANT.body}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {RESTAURANT.notes.map((n) => (
                <li key={n} className="flex items-start gap-2.5 font-sans text-[14px] font-medium" style={{ color: INK }}>
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="overflow-hidden rounded-[4px]"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateX(0)' : 'translateX(20px)',
              transition: `opacity .65s ${ease}, transform .65s ${ease}`,
            }}
          >
            <Img
              src={IMG[RESTAURANT.image]}
              alt={RESTAURANT.imageAlt}
              className="block aspect-[4/3] w-full object-cover sm:aspect-[16/11]"
              fallbackClassName="bg-gradient-to-br from-[#c9bfa3] to-[#7b7259]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  THE FARM — sheep/horses/poultry, horse-riding, dogs welcome              */
/* ══════════════════════════════════════════════════════════════════════ */
function Farm() {
  return (
    <section style={{ background: GROUND }} className="pb-[clamp(56px,8vw,100px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal as="figure" className="relative m-0 overflow-hidden rounded-[4px]">
          <Img
            src={u(UIMG[FARM.image], 1800)}
            srcSet={srcSet(UIMG[FARM.image])}
            sizes="100vw"
            alt={FARM.imageAlt}
            className="block aspect-[16/9] w-full object-cover sm:aspect-[21/8]"
            fallbackClassName="bg-gradient-to-br from-[#7c8a5e] to-[#33402a]"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(28,26,23,.66) 0%, rgba(28,26,23,.28) 42%, rgba(28,26,23,0) 64%)' }}
            aria-hidden
          />
          <figcaption className="absolute inset-y-0 left-0 flex max-w-[30rem] flex-col justify-center p-7 md:p-11">
            <Overline color={ACCENT_TINT}>{FARM.overline}</Overline>
            <h3 className="mt-4 font-sans font-extrabold" style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', lineHeight: 1.1 }}>
              {FARM.heading}
            </h3>
            <p className="mt-3 font-sans text-[14.5px] leading-[1.6]" style={{ color: 'rgba(244,239,230,.9)' }}>
              {FARM.body}
            </p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  AMENITIES — scannable icon grid, conservative & accurate                */
/* ══════════════════════════════════════════════════════════════════════ */
function Amenities() {
  return (
    <section style={{ background: GROUND }} className="pb-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <Overline>What is included</Overline>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="mt-5 max-w-[640px] font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.7rem,3.2vw,2.4rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Plainly stated, nothing oversold.
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] sm:grid-cols-4" style={{ background: HAIRLINE }}>
          {AMENITIES.map((a, i) => (
            <Reveal key={a.title} delay={i * 55} y={14} className="flex flex-col gap-3 p-5 md:p-6" style={{ background: SURFACE }}>
              <Glyph name={a.icon} />
              <div>
                <div className="font-sans text-[14px] font-bold" style={{ color: INK }}>
                  {a.title}
                </div>
                <div className="mt-1 font-sans text-[12.5px] leading-snug" style={{ color: MUTED }}>
                  {a.note}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  GUEST WORDS — recent real quotes + plain rating numbers, dark band       */
/* ══════════════════════════════════════════════════════════════════════ */
function GuestWords() {
  return (
    <section style={{ background: DEEP }} className="py-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-[680px]">
          <Reveal>
            <Overline color={ACCENT_TINT}>{GUEST.overline}</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-sans font-extrabold" style={{ color: '#FFFFFF', fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', lineHeight: 1.07, letterSpacing: '-0.015em' }}>
              {GUEST.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 font-sans text-[15px] leading-[1.6]" style={{ color: 'rgba(244,239,230,.78)' }}>
              {GUEST.body}
            </p>
          </Reveal>
        </div>

        {/* score row */}
        <div className="mt-11 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {GUEST.scores.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} y={14}>
              <div className="font-sans text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-none" style={{ color: '#FFFFFF' }}>
                {s.value}
              </div>
              <div className="mt-2 font-sans text-[13px] font-bold" style={{ color: ACCENT_TINT }}>
                {s.label}
              </div>
              <div className="mt-1 font-sans text-[11.5px] leading-snug" style={{ color: 'rgba(244,239,230,.65)' }}>
                {s.note}
              </div>
            </Reveal>
          ))}
        </div>

        {/* quotes */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {GUEST_QUOTES.map((q, i) => (
            <Reveal key={q.attribution} delay={i * 90} y={18} className="rounded-[4px] p-6 md:p-7" style={{ background: 'rgba(244,239,230,.06)', border: '1px solid rgba(244,239,230,.14)' }}>
              <p className="font-sans text-[15.5px] italic leading-[1.55]" style={{ color: 'rgba(244,239,230,.95)' }}>
                “{q.quote}”
              </p>
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t pt-3" style={{ borderColor: 'rgba(244,239,230,.14)' }}>
                <span className="font-sans text-[13px] font-semibold" style={{ color: '#FFFFFF' }}>
                  {q.attribution}
                  {q.rating ? <span style={{ color: ACCENT_TINT }}> · {q.rating}</span> : null}
                </span>
                <span className="shrink-0 font-sans text-[11.5px]" style={{ color: 'rgba(244,239,230,.6)' }}>
                  {q.source}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* booking.com category breakdown */}
        <Reveal delay={140} className="mt-12 rounded-[6px] p-6 md:p-8" style={{ background: 'rgba(244,239,230,.06)', border: '1px solid rgba(244,239,230,.14)' }}>
          <p className="font-sans text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: ACCENT_TINT }}>
            Booking.com category scores
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 md:grid-cols-7">
            {GUEST.categoryScores.map((c) => (
              <div key={c.label}>
                <div className="font-sans text-[1.15rem] font-extrabold tabular-nums" style={{ color: '#FFFFFF' }}>
                  {c.value.toFixed(1)}
                </div>
                <div className="mt-1 font-sans text-[11px] leading-tight" style={{ color: 'rgba(244,239,230,.7)' }}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HOSTS — brief mention, real photo, no invented history                  */
/* ══════════════════════════════════════════════════════════════════════ */
function Hosts() {
  return (
    <section style={{ background: GROUND }} className="pb-[clamp(32px,4vw,52px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="flex flex-col items-center gap-6 border-t pt-[clamp(32px,4vw,52px)] text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left" style={{ borderColor: HAIRLINE }}>
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24" style={{ border: `2px solid ${ACCENT}` }}>
            <Img src={IMG[HOSTS.image]} alt={HOSTS.imageAlt} className="block h-full w-full object-cover" fallbackClassName="bg-gradient-to-br from-[#cfc6ad] to-[#8c8470]" />
          </div>
          <div>
            <Overline>{HOSTS.overline}</Overline>
            <h3 className="mt-3 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', lineHeight: 1.15 }}>
              {HOSTS.heading}
            </h3>
            <p className="mt-2 font-sans text-[14.5px] leading-[1.55]" style={{ color: MUTED }}>
              {HOSTS.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FIND US — address, drives, map link + FAQ accordion                     */
/* ══════════════════════════════════════════════════════════════════════ */
function MapPanel() {
  const { ref, shown } = useInView(0.25)
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[4px]" style={{ background: '#E1DCCC', border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 600 380" className="block aspect-[16/10] w-full" role="img" aria-label="Stylised map of South Iceland showing Vellir under Pétursey, near Vík í Mýrdal">
        <rect width="600" height="380" fill="#D7CFBA" />
        <path d="M0 230 C 100 210 180 250 260 230 C 340 210 420 240 500 220 C 540 210 580 220 600 210 L600 380 L0 380 Z" fill="#E7E1D0" />
        <path d="M0 250 C 120 270 260 300 340 310" fill="none" stroke="#B9C4B0" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />
        <circle cx="200" cy="288" r="3.5" fill={MUTED} />
        <text x="206" y="293" fontSize="12.5" fill={MUTED} fontFamily="Inter, sans-serif">
          Route 1 — Ring Road
        </text>
        <circle cx="430" cy="245" r="4" fill={MUTED} />
        <text x="436" y="250" fontSize="13" fill={MUTED} fontFamily="Inter, sans-serif">
          Vík í Mýrdal
        </text>
        <path d="M280 235 C 300 222 320 210 336 200" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
        <g transform="translate(338 196)" style={{ transformOrigin: '338px 196px' }}>
          <circle cx="0" cy="0" r="9" fill="none" stroke={ACCENT} strokeWidth="2" className={shown ? 'vl-ripple' : ''} style={{ opacity: prefersReduced() ? 0 : undefined }} />
          <g className={shown && !prefersReduced() ? 'vl-pin' : ''} style={{ transformOrigin: '0px 0px' }}>
            <path d="M0 -18 C 10 -18 14 -10 14 -4 C 14 5 4 12 0 19 C -4 12 -14 5 -14 -4 C -14 -10 -10 -18 0 -18 Z" fill={ACCENT} />
            <circle cx="0" cy="-4" r="4.4" fill="#F4EFE6" />
          </g>
        </g>
        <text x="338" y="180" textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily="Inter, sans-serif">
          Vellir
        </text>
        <path d="M310 100 C 330 130 320 160 336 196" fill="none" stroke="#9DA88F" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <text x="296" y="92" fontSize="11.5" fill={MUTED} fontFamily="Inter, sans-serif" fontStyle="italic">
          Pétursey
        </text>
      </svg>
      <span className="absolute bottom-3 left-4 font-sans text-[11px]" style={{ color: MUTED }}>
        Stylised location · not to scale
      </span>
    </div>
  )
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div className="border-t" style={{ borderColor: HAIRLINE }}>
      <h3 className="m-0">
        <button onClick={onToggle} aria-expanded={open} className={`flex w-full items-center justify-between gap-4 py-5 text-left ${FOCUS}`}>
          <span className="font-sans text-[15.5px] font-semibold" style={{ color: INK }}>
            {q}
          </span>
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{ background: GROUND, color: ACCENT, transition: 'transform .3s ease', transform: open ? 'rotate(45deg)' : 'none' }}
            aria-hidden
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        ref={bodyRef}
        style={{
          maxHeight: open ? (bodyRef.current?.scrollHeight ?? 240) : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: prefersReduced() ? 'none' : 'max-height .4s ease, opacity .3s ease',
        }}
      >
        <p className="pb-5 pr-10 font-sans text-[14.5px] leading-[1.6]" style={{ color: MUTED }}>
          {a}
        </p>
      </div>
    </div>
  )
}

function FindUs() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="find" style={{ background: GROUND }} className="py-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-[680px]">
          <Reveal>
            <Overline>{FIND.overline}</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.8rem,3.6vw,2.7rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              {FIND.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-[54ch] font-sans text-[15px] leading-[1.65]" style={{ color: MUTED }}>
              {FIND.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-6 lg:grid-cols-[58fr_42fr]">
          <div className="flex flex-col gap-5">
            <Reveal>
              <MapPanel />
            </Reveal>
            <Reveal delay={90} as="figure" className="m-0 overflow-hidden rounded-[4px]">
              <Img
                src={IMG[FIND.roadImage]}
                alt={FIND.roadAlt}
                className="block aspect-[16/8] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#8c8470] to-[#3a3530]"
              />
            </Reveal>
          </div>

          <Reveal delay={120} className="flex flex-col rounded-[6px] p-6 md:p-7" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="font-sans text-[14px] leading-[1.6]" style={{ color: INK }}>
              <div className="font-bold">{FIND.address}</div>
              <a href={`mailto:${EMAIL}`} className={`mt-1 inline-block underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: ACCENT }}>
                {EMAIL}
              </a>
              <div className="mt-0.5">
                <a href={PHONE_HREF} className={`underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: MUTED }}>
                  {PHONE}
                </a>
              </div>
            </div>
            <a
              href={FIND.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full px-5 py-2.5 font-sans text-[13.5px] font-bold uppercase tracking-[0.06em] transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: ACCENT, color: '#FFFFFF' }}
            >
              Open in maps ↗
            </a>
            <div className="mt-7 flex flex-col gap-px overflow-hidden rounded-[6px]" style={{ background: HAIRLINE }}>
              {FIND.drives.map((d) => (
                <div key={d.from} className="flex items-center justify-between gap-4 px-4 py-3.5" style={{ background: SURFACE }}>
                  <div>
                    <div className="font-sans text-[13.5px] font-semibold" style={{ color: INK }}>
                      from {d.from}
                    </div>
                    <div className="font-sans text-[12px] leading-snug" style={{ color: MUTED }}>
                      {d.note}
                    </div>
                  </div>
                  <span className="shrink-0 font-sans text-[13.5px] font-bold tabular-nums" style={{ color: ACCENT }}>
                    {d.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-[11.5px] leading-[1.5]" style={{ color: MUTED }}>
              Drive times are approximate; allow extra in winter and check road.is.
            </p>
          </Reveal>
        </div>

        {/* FAQ */}
        <div className="mt-16 grid gap-x-12 gap-y-8 md:grid-cols-[34fr_66fr]">
          <div>
            <Reveal>
              <Overline>Before you book</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h3 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.4rem,2.4vw,1.9rem)', lineHeight: 1.12 }}>
                Know before you go.
              </h3>
            </Reveal>
          </div>
          <Reveal delay={90}>
            <div className="border-b" style={{ borderColor: HAIRLINE }}>
              {FAQ.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  STAY / INQUIRY — no fake pricing, clean check-availability CTA           */
/* ══════════════════════════════════════════════════════════════════════ */
function Stay({ unit, setUnit }: { unit: string; setUnit: (u: string) => void }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', arrive: '', depart: '', notes: '' })
  const [party, setParty] = useState(2)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const field = 'w-full rounded-[6px] px-3.5 py-3 font-sans text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  const fieldStyle: CSSProperties = { border: `1px solid rgba(28,26,23,.22)`, background: '#FFFFFF', color: INK, outlineColor: ACCENT }
  const labelCls = 'mb-2 block font-sans text-[12px] font-bold uppercase tracking-[0.08em]'

  return (
    <section id="stay" style={{ background: GROUND }} className="py-[clamp(64px,9vw,116px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[6px] md:grid-cols-[40fr_60fr]" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <aside className="relative flex flex-col" style={{ background: GROUND }}>
            <div className="p-7 md:p-9">
              <Overline>{STAY.panelOverline}</Overline>
              <h2 className="mt-5 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.7rem,3vw,2.3rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
                {STAY.heading}
              </h2>
              <p className="mt-4 font-sans text-[14.5px] leading-[1.65]" style={{ color: MUTED }}>
                {STAY.panelBody}
              </p>
              <div className="mt-6 flex flex-col gap-2 font-sans text-[14px]">
                <a href={`mailto:${EMAIL}`} className={`inline-flex min-h-[40px] items-center font-bold underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: ACCENT }}>
                  {EMAIL}
                </a>
                <a href={PHONE_HREF} className={`inline-flex min-h-[28px] items-center font-semibold underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: MUTED }}>
                  {PHONE}
                </a>
              </div>
            </div>
            <figure className="m-0 mt-auto hidden overflow-hidden md:block">
              <Img src={IMG[STAY.sideImage]} alt={STAY.sideImageAlt} className="block aspect-[4/3] w-full object-cover" fallbackClassName="bg-gradient-to-br from-[#cfc6ad] to-[#8c8470]" />
            </figure>
          </aside>

          <div className="p-7 md:p-9">
            {sent ? (
              <Reveal className="py-10 text-center">
                <Overline>Inquiry sent</Overline>
                <p className="mx-auto mt-6 max-w-[26rem] font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', lineHeight: 1.15 }}>
                  {STAY.confirmation}
                </p>
                <p className="mt-5 font-sans text-[15px]" style={{ color: MUTED }}>
                  We will reply to <span style={{ color: INK, fontWeight: 600 }}>{form.email || 'your email'}</span>. This is a concept preview, so nothing was actually sent.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className={`mt-7 inline-flex min-h-[44px] items-center font-sans text-[14px] font-bold underline-offset-[5px] hover:underline ${FOCUS}`}
                  style={{ color: ACCENT }}
                >
                  ← Write another inquiry
                </button>
              </Reveal>
            ) : (
              <div>
                <Overline>{STAY.overline}</Overline>
                <p className="mt-4 font-sans text-[15px] leading-[1.6]" style={{ color: MUTED }}>
                  {STAY.body}
                </p>
                <form className="mt-7 flex flex-col gap-5" onSubmit={onSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Your name</span>
                      <input className={field} style={fieldStyle} type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                    </label>
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Email</span>
                      <input className={field} style={fieldStyle} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                    </label>
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Arrive</span>
                      <input className={field} style={fieldStyle} type="date" value={form.arrive} onChange={(e) => setForm({ ...form, arrive: e.target.value })} />
                    </label>
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Depart</span>
                      <input className={field} style={fieldStyle} type="date" value={form.depart} onChange={(e) => setForm({ ...form, depart: e.target.value })} />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <span className={labelCls} style={{ color: MUTED }}>Guests</span>
                      <div className="flex items-center justify-between rounded-[6px] px-2 py-1.5" style={{ border: `1px solid rgba(28,26,23,.22)`, background: '#FFFFFF' }}>
                        <button type="button" onClick={() => setParty(Math.max(1, party - 1))} disabled={party <= 1} aria-label="Fewer guests" className={`grid h-11 w-11 place-items-center rounded-[5px] text-[20px] leading-none transition-opacity disabled:opacity-35 ${FOCUS}`} style={{ background: GROUND, color: INK }}>
                          −
                        </button>
                        <span className="font-sans text-[17px] font-bold tabular-nums" style={{ color: INK }}>
                          {party}
                        </span>
                        <button type="button" onClick={() => setParty(Math.min(8, party + 1))} disabled={party >= 8} aria-label="More guests" className={`grid h-11 w-11 place-items-center rounded-[5px] text-[20px] leading-none transition-opacity disabled:opacity-35 ${FOCUS}`} style={{ background: GROUND, color: INK }}>
                          +
                        </button>
                      </div>
                    </div>
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Which room or cottage</span>
                      <div className="relative">
                        <select className={`${field} pr-10`} style={{ ...fieldStyle, appearance: 'none' }} value={unit} onChange={(e) => setUnit(e.target.value)}>
                          {UNITS.map((un) => (
                            <option key={un.value} value={un.value}>
                              {un.label}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden>
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5 6 6.5 11 1.5" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </label>
                  </div>

                  <label>
                    <span className={labelCls} style={{ color: MUTED }}>Anything we should know</span>
                    <textarea className={field} style={{ ...fieldStyle, minHeight: 96, resize: 'vertical' }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Dietary needs, arrival time, a question…" />
                  </label>

                  <button type="submit" className={`mt-1 w-full rounded-[6px] py-4 font-sans text-[15.5px] font-bold uppercase tracking-[0.04em] transition-transform active:scale-[0.99] ${FOCUS}`} style={{ background: ACCENT, color: '#FFFFFF' }}>
                    Send inquiry
                  </button>
                  <p className="text-center font-sans text-[12px]" style={{ color: MUTED }}>
                    Concept preview — nothing is actually sent.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  CLOSING — full-bleed sign-off + CTA                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Closing({ onRequest }: { onRequest: () => void }) {
  const { ref, shown } = useInView(0.2)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: INK }}>
      <Img
        src={IMG[CLOSING.image]}
        alt={CLOSING.imageAlt}
        className={`absolute inset-0 block h-full w-full object-cover ${shown && !prefersReduced() ? 'vl-settle' : ''}`}
        fallbackClassName="bg-gradient-to-b from-[#8c8470] to-[#3a3530]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(28,26,23,.6), rgba(28,26,23,.82))' }} aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-[clamp(88px,14vw,168px)] text-center">
        <h2
          className="font-sans font-extrabold"
          style={{
            color: '#FFFFFF',
            fontSize: 'clamp(2.1rem,5.4vw,4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease}, transform .7s ${ease}`,
          }}
        >
          {CLOSING.line}
        </h2>
        <p
          className="mx-auto mt-5 max-w-[34ch] font-sans text-[15.5px] leading-[1.6]"
          style={{
            color: 'rgba(244,239,230,.88)',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease} .1s, transform .7s ${ease} .1s`,
          }}
        >
          {CLOSING.sub}
        </p>
        <button
          onClick={onRequest}
          className={`mt-9 inline-flex min-h-[48px] items-center rounded-full px-8 py-4 font-sans text-[15.5px] font-bold uppercase tracking-[0.06em] transition-transform active:scale-[0.98] ${FOCUS_ON_DARK}`}
          style={{
            background: ACCENT,
            color: '#FFFFFF',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease} .18s, transform .7s ${ease} .18s`,
          }}
        >
          Check availability
        </button>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function VellirPage() {
  const [unit, setUnit] = useState('ensuite-double')

  useEffect(() => {
    document.title = 'Vellir · Guesthouse under Pétursey, Mýrdalur'
    setThemeColor(GROUND)
    return () => setThemeColor('#0a1320')
  }, [])

  const choose = (u2: string) => {
    setUnit(u2)
    document.getElementById('stay')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }
  const goRequest = () => {
    document.getElementById('stay')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }

  return (
    <div className="font-sans overflow-x-hidden" style={{ background: GROUND, color: INK }}>
      <style>{`
        #vl-root ::selection { background:${ACCENT}; color:#FFFFFF; }
        @media (prefers-reduced-motion: no-preference) {
          .vl-settle { animation: vl-settle 1.4s cubic-bezier(.2,.7,.2,1) both; }
          @keyframes vl-settle { from { transform:scale(1.06); } to { transform:scale(1); } }
          .vl-pin { animation: vl-drop .6s cubic-bezier(.2,.9,.3,1.4) both; }
          @keyframes vl-drop { 0% { transform: translateY(-14px) scale(.6); opacity:0; } 60% { opacity:1; } 100% { transform: translateY(0) scale(1); opacity:1; } }
          .vl-ripple { animation: vl-ripple 1.6s ease-out .4s 1 both; }
          @keyframes vl-ripple { 0% { r:7; opacity:.7; } 100% { r:26; opacity:0; } }
        }
      `}</style>
      <div id="vl-root">
        <PreviewChrome company={company} />
        <TopNav onRequest={goRequest} />
        <main>
          <Hero onRequest={goRequest} />
          <TrustStrip />
          <Rooms onChoose={choose} />
          <Cottages onChoose={choose} />
          <PeturseyAndNearby />
          <Restaurant />
          <Farm />
          <Amenities />
          <GuestWords />
          <Hosts />
          <FindUs />
          <Stay unit={unit} setUnit={setUnit} />
          <Closing onRequest={goRequest} />
        </main>

        {/* honesty disclosure — quiet pre-footer line */}
        <section style={{ background: GROUND }} className="px-5 py-9 md:px-8">
          <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.6]" style={{ color: MUTED }}>
            A note on honesty: Vellir is a real, moderately-rated family farm guesthouse —{' '}
            <span style={{ color: INK }}>Tripadvisor 3.7/5 (251 reviews)</span> and{' '}
            <span style={{ color: INK }}>Booking.com 7.5/10 "Good" (226 reviews)</span> are stated plainly, not inflated. No room rate is published, so none is invented here — every price is on request. The two cottages have no published capacity, so none is claimed. There is no kitchen or self-catering in any room or cottage. Property photographs are real (Hey Iceland's listing for Vellir); landscape photographs of Pétursey, the glacier and the coast are indicative Unsplash stock, labelled as such. Confirmed details: {PHONE} ·{' '}
            <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
              {EMAIL}
            </a>{' '}
            · Vellir, 871 Vík, Iceland.
          </p>
        </section>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
