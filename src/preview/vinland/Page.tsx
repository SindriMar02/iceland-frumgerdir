import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  AMENITIES,
  CLOSING,
  COTTAGE,
  EMAIL,
  FIND,
  GUEST_QUOTES,
  HERO_PHOTO,
  IMG,
  NEARBY,
  PHONE,
  PHONE_HREF,
  PLACE,
  PODS,
  ROOMS,
  SCORES,
  STAY,
  srcSet,
  TRUST,
  u,
} from './data'
import type { ImgKey } from './data'

const company = getPreviewCompany('vinland')

/* ── Palette — cream/bone canvas, near-black ink, one rust accent ─────────
 * CREAM  vs INK    : 14.54:1  (body text, AAA)
 * RUST   vs CREAM  : 4.84:1   (AA, normal text — links/labels on cream)
 * WHITE  vs RUST   : 5.44:1   (AA — "BOOK" pill / filled buttons)
 * MUTED  vs CREAM  : 6.44:1   (AA — secondary copy)
 * CREAM  vs INK band: 14.54:1 (reversed text on the deep ink section)
 * RUST_TINT vs INK band: 5.33:1 (AA — rust-colored text on dark ground;
 *   plain RUST on INK is only 3.0:1, so the lighter tint is used there) */
const CREAM = '#F6F1E9'
const INK = '#231F1C'
const MUTED = '#5C5650'
const RUST = '#B8431C'
const RUST_TINT = '#D97A4E' // rust-on-dark only
const HAIRLINE = 'rgba(35,31,28,.14)'
const HAIRLINE_ON_INK = 'rgba(246,241,233,.16)'

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231F1C]'
const FOCUS_ON_INK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6F1E9]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV = [
  { id: 'stay-hero', label: 'Stay' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'cottage', label: 'Cottage' },
  { id: 'camping', label: 'Camping' },
  { id: 'find', label: 'Find us' },
] as const

/* ── Reveal — IntersectionObserver + CSS transition (copied pattern) ─────── */
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
    const t = window.setTimeout(() => setShown(true), 1500)
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

/* ── Small-caps overline — tracked label, rust hairline ──────────────────── */
function Overline({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-7" style={{ background: dark ? RUST_TINT : RUST }} aria-hidden />
      <span
        className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: dark ? 'rgba(246,241,233,.78)' : MUTED }}
      >
        {children}
      </span>
    </div>
  )
}

/* ── Inline glyphs (amenities) ────────────────────────────────────────────── */
function Glyph({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: RUST,
    strokeWidth: 1.7,
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
          <circle cx="12" cy="19" r="0.6" fill={RUST} />
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
    case 'plane':
      return (
        <svg {...common}>
          <path d="M3 13.5 21 7l-2.6 6.2L21 19l-6-2-3.5 4-1-5-5-2.3Z" />
        </svg>
      )
    case 'ban':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M6.4 6.4 17.6 17.6" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 10h16M8 3v4M16 3v4" />
        </svg>
      )
    default:
      return null
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV — small wordmark left, plain links, BOOK + phone/mail utility       */
/* ══════════════════════════════════════════════════════════════════════ */
function Nav({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: scrolled ? 'rgba(246,241,233,.92)' : CREAM,
        borderBottom: `1px solid ${scrolled ? HAIRLINE : 'transparent'}`,
        backdropFilter: scrolled ? 'saturate(1.1) blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(1.1) blur(8px)' : 'none',
        transition: 'background .3s ease, border-color .3s ease',
      }}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <button
          onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`flex items-center gap-2 font-sans text-[16px] font-extrabold tracking-[-0.01em] ${FOCUS}`}
          style={{ color: INK }}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-full font-sans text-[12px] font-extrabold"
            style={{ background: INK, color: CREAM }}
            aria-hidden
          >
            V
          </span>
          Vínland
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`font-sans text-[13.5px] font-semibold transition-colors hover:opacity-70 ${FOCUS}`}
              style={{ color: INK }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={PHONE_HREF}
            className={`font-sans text-[12px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-70 ${FOCUS}`}
            style={{ color: MUTED }}
          >
            {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className={`font-sans text-[12px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-70 ${FOCUS}`}
            style={{ color: MUTED }}
          >
            Email
          </a>
          <button
            onClick={onBook}
            className={`font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] transition-opacity hover:opacity-75 ${FOCUS}`}
            style={{ color: RUST }}
          >
            Book →
          </button>
        </div>

        {/* mobile: legible utility cluster, never hamburger-only */}
        <div className="flex items-center gap-3 md:hidden">
          <a href={PHONE_HREF} aria-label={`Call ${PHONE}`} className={`grid h-10 w-10 place-items-center rounded-full ${FOCUS}`} style={{ background: 'rgba(35,31,28,.06)', color: INK }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`grid h-10 w-10 place-items-center rounded-full ${FOCUS}`}
            style={{ background: RUST, color: '#FFFFFF' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {open ? (
                <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M1 4h14M1 8h14M1 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t px-5 py-5 md:hidden" style={{ borderColor: HAIRLINE, background: CREAM }}>
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`rounded-lg px-3 py-3 text-left font-sans text-[15px] font-semibold ${FOCUS}`}
                style={{ color: INK }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <a href={`mailto:${EMAIL}`} className={`font-sans text-[14px] font-medium ${FOCUS}`} style={{ color: MUTED }}>
              {EMAIL}
            </a>
            <button
              onClick={() => {
                setOpen(false)
                onBook()
              }}
              className={`inline-flex min-h-[46px] items-center justify-center rounded-full font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] ${FOCUS}`}
              style={{ background: RUST, color: '#FFFFFF' }}
            >
              Book now
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO — all-caps headline, asymmetric photo+copy, GIANT overlapping      */
/*  Abril Fatface "Vínland" wordmark bleeding across the photo's edge       */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero({ onBook }: { onBook: () => void }) {
  const { ref, shown } = useInView(0.1)
  return (
    <header id="stay-hero" className="relative" style={{ background: CREAM }}>
      <div id="top" className="absolute -top-24" aria-hidden />
      <style>{`
        .vl-hero{display:grid;grid-template-columns:1fr;grid-template-areas:"over" "head" "pic" "info";column-gap:3rem;row-gap:1rem;align-content:center;min-height:calc(100svh - 61px)}
        .vl-pic img{max-height:42vh}
        @media(min-width:768px){
          .vl-hero{grid-template-columns:53fr 47fr;grid-template-areas:"over over" "pic head" "pic info";row-gap:1.4rem}
          .vl-pic img{max-height:none}
        }
      `}</style>
      <div ref={ref} className="vl-hero mx-auto max-w-[1200px] px-5 py-5 sm:px-8 sm:py-8">
        {/* overline */}
        <Reveal style={{ gridArea: 'over' }}>
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            {PLACE.overline}
          </p>
        </Reveal>

        {/* compact headline */}
        <Reveal delay={70} style={{ gridArea: 'head' }}>
          <h1
            className="m-0 font-sans font-extrabold uppercase"
            style={{ color: INK, fontSize: 'clamp(1.5rem,2.6vw,2.3rem)', lineHeight: 1.07, letterSpacing: '-0.015em', maxWidth: '18ch' }}
          >
            {PLACE.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>

        {/* photo + signature wordmark bleeding off its bottom edge */}
        <figure
          className="vl-pic relative m-0"
          style={{ gridArea: 'pic', paddingBottom: 'clamp(34px,5.5vw,66px)', opacity: shown ? 1 : 0, transition: 'opacity .7s cubic-bezier(.2,.7,.2,1)' }}
        >
          <div className="overflow-hidden rounded-[6px]">
            <Img
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              fetchpriority="high"
              className="block aspect-[16/10] w-full object-cover md:aspect-[16/10]"
              fallbackClassName="bg-gradient-to-br from-[#c98a5c] to-[#7a4a2c]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity .8s cubic-bezier(.2,.7,.2,1) .15s, transform .8s cubic-bezier(.2,.7,.2,1) .15s',
            }}
          >
            <span
              style={{
                fontFamily: "'Stardom', Georgia, serif",
                color: RUST,
                fontSize: 'clamp(2.3rem,8vw,6rem)',
                lineHeight: 0.85,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 24px rgba(35,31,28,.16)',
                whiteSpace: 'nowrap',
              }}
            >
              Vínland
            </span>
          </div>
        </figure>

        {/* practical copy + phone + inquiry + compact trust */}
        <div style={{ gridArea: 'info' }} className="md:self-center">
          <Reveal delay={130}>
            <p className="font-sans text-[13.5px] leading-[1.62]" style={{ color: MUTED }}>
              {PLACE.practical}
            </p>
          </Reveal>
          <Reveal delay={175}>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={PHONE_HREF} className={`font-sans text-[15.5px] font-bold ${FOCUS}`} style={{ color: INK }}>
                {PHONE}
              </a>
              <button
                onClick={onBook}
                className={`inline-flex min-h-[40px] items-center gap-1.5 font-sans text-[13px] font-extrabold uppercase tracking-[0.1em] underline-offset-[6px] transition-opacity hover:underline hover:opacity-75 ${FOCUS}`}
                style={{ color: RUST }}
              >
                Send inquiry →
              </button>
            </div>
          </Reveal>
          <Reveal delay={215}>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t pt-5" style={{ borderColor: HAIRLINE }}>
              {TRUST.map((t) => (
                <div key={t.label}>
                  <div className="font-sans text-[19px] font-extrabold leading-none" style={{ color: INK }}>
                    {t.value}
                  </div>
                  <div className="mt-1 font-sans text-[11px] leading-tight" style={{ color: MUTED }}>
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  RIVER BAND — slim full-bleed Lagarfljót visual, reinforces "riverside"  */
/* ══════════════════════════════════════════════════════════════════════ */
function RiverBand() {
  const { ref, shown } = useInView(0.15)
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ background: INK }}>
      <Img
        src={u(IMG.river, 2200)}
        srcSet={srcSet(IMG.river)}
        sizes="100vw"
        alt="A mossy Icelandic river winding through a canyon (indicative — Lagarfljót area)"
        className="block aspect-[21/7] w-full object-cover transition-transform duration-[1400ms] ease-out"
        style={{ transform: shown ? 'scale(1)' : 'scale(1.06)' }}
        fallbackClassName="bg-gradient-to-br from-[#4a6a5c] to-[#1c2a24]"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(35,31,28,.1), rgba(35,31,28,.28))' }} aria-hidden />
      <p
        className="absolute bottom-3 right-4 font-sans text-[10.5px] italic sm:bottom-4 sm:right-6"
        style={{ color: 'rgba(246,241,233,.75)' }}
      >
        Lagarfljót, the river Vínland sits beside
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FEATURE BLOCK — shared asymmetric photo + tracked-caps copy rhythm      */
/* ══════════════════════════════════════════════════════════════════════ */
function FeatureBlock({
  id,
  overline,
  heading,
  body,
  specs,
  image,
  imageAlt,
  reverse = false,
  ground = CREAM,
  dark = false,
}: {
  id: string
  overline: string
  heading: string
  body: string
  specs: string[]
  image: ImgKey
  imageAlt: string
  reverse?: boolean
  ground?: string
  dark?: boolean
}) {
  const { ref, shown } = useInView(0.2)
  const textColor = dark ? CREAM : INK
  const mutedColor = dark ? 'rgba(246,241,233,.72)' : MUTED
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section id={id} style={{ background: ground }} className="py-[clamp(56px,8vw,104px)]">
      <div ref={ref} className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className={`grid items-center gap-x-12 gap-y-9 md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
          <figure
            className="group relative m-0 overflow-hidden rounded-[6px]"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(16px)',
              transition: `opacity .65s ${ease}, transform .65s ${ease}`,
            }}
          >
            <Img
              src={u(IMG[image], 1500)}
              srcSet={srcSet(IMG[image])}
              sizes="(max-width:768px) 100vw, 48vw"
              alt={imageAlt}
              className="block aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
              fallbackClassName="bg-gradient-to-br from-[#c9b79a] to-[#7a6a4f]"
            />
          </figure>

          <div
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(16px)',
              transition: `opacity .65s ${ease} .1s, transform .65s ${ease} .1s`,
            }}
          >
            <Overline dark={dark}>{overline}</Overline>
            <h2
              className="mt-4 font-sans font-extrabold"
              style={{ color: textColor, fontSize: 'clamp(1.7rem,3.2vw,2.5rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
            >
              {heading}
            </h2>
            <p className="mt-4 max-w-[48ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: mutedColor }}>
              {body}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {specs.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2.5 font-sans text-[13.5px] font-semibold"
                  style={{ color: textColor }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dark ? RUST_TINT : RUST }} aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  AMENITIES — confirmed-only strip                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function Amenities() {
  return (
    <section className="border-y" style={{ background: CREAM, borderColor: HAIRLINE }}>
      <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-5">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.title} delay={i * 60} y={12} className="flex flex-col items-start gap-2.5">
              <Glyph name={a.icon} />
              <span className="font-sans text-[13px] font-semibold leading-tight" style={{ color: INK }}>
                {a.title}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NEARBY — honest distances, card grid, deep ink band                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Nearby() {
  return (
    <section style={{ background: INK }} className="py-[clamp(56px,8vw,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <Reveal>
            <Overline dark>What’s nearby</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2
              className="mt-4 font-sans font-extrabold"
              style={{ color: CREAM, fontSize: 'clamp(1.8rem,3.6vw,2.8rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}
            >
              Everything is a short drive — or right next door.
            </h2>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEARBY.map((n, i) => (
            <Reveal
              key={n.name}
              delay={i * 70}
              y={16}
              as="figure"
              className="m-0 flex flex-col overflow-hidden rounded-[10px]"
              style={{ background: 'rgba(246,241,233,.05)', border: `1px solid ${HAIRLINE_ON_INK}` }}
            >
              {n.image ? (
                <Img
                  src={u(IMG[n.image], 900)}
                  alt={n.imageAlt ?? ''}
                  className="block aspect-[16/10] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#5a4a36] to-[#231F1C]"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center" style={{ background: 'rgba(246,241,233,.04)' }}>
                  <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'rgba(246,241,233,.32)' }}>
                    {n.name}
                  </span>
                </div>
              )}
              <figcaption className="flex flex-1 flex-col gap-1.5 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-sans text-[15.5px] font-extrabold" style={{ color: CREAM }}>
                    {n.name}
                  </h3>
                  <span
                    className="shrink-0 font-sans text-[11px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: RUST_TINT }}
                  >
                    {n.distance}
                  </span>
                </div>
                <p className="font-sans text-[13px] leading-[1.55]" style={{ color: 'rgba(246,241,233,.68)' }}>
                  {n.note}
                </p>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  GUEST WORDS — real quotes + score breakdown                             */
/* ══════════════════════════════════════════════════════════════════════ */
function GuestWords() {
  return (
    <section style={{ background: CREAM }} className="py-[clamp(56px,8vw,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <Reveal>
            <Overline>Guest words</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-4 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.8rem,3.6vw,2.8rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
              What people say after they stay.
            </h2>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-3">
          {GUEST_QUOTES.map((g, i) => (
            <Reveal key={g.attribution} delay={i * 80} y={18} as="figure" className="m-0 flex flex-col rounded-[10px] p-7" style={{ background: '#FFFFFF', border: `1px solid ${HAIRLINE}` }}>
              <span className="font-sans text-[34px] font-extrabold leading-none" style={{ color: RUST }} aria-hidden>
                “
              </span>
              <blockquote className="mt-1 flex-1 font-sans text-[15px] leading-[1.6]" style={{ color: INK }}>
                {g.quote}
              </blockquote>
              <figcaption className="mt-5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.05em]" style={{ color: MUTED }}>
                {g.attribution}
              </figcaption>
            </Reveal>
          ))}
        </div>

        {/* score breakdown — Tripadvisor + Booking.com */}
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {[
            { brand: 'Tripadvisor', s: SCORES.tripadvisor },
            { brand: 'Booking.com', s: SCORES.booking },
          ].map((b, i) => (
            <Reveal key={b.brand} delay={i * 90} y={16} className="rounded-[10px] p-7" style={{ background: CREAM, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-sans text-[14px] font-extrabold uppercase tracking-[0.08em]" style={{ color: INK }}>
                  {b.brand}
                </span>
                <span className="font-sans text-[26px] font-extrabold leading-none" style={{ color: RUST }}>
                  {b.s.value}
                  <span className="ml-1 font-sans text-[13px] font-semibold" style={{ color: MUTED }}>
                    {b.s.of}
                  </span>
                </span>
              </div>
              <p className="mt-1 font-sans text-[12.5px]" style={{ color: MUTED }}>
                {b.s.reviews}
                {'rank' in b.s && b.s.rank ? ` · ${b.s.rank}` : ''}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t pt-5 sm:grid-cols-3" style={{ borderColor: HAIRLINE }}>
                {b.s.categories.map((c) => (
                  <div key={c.label} className="flex items-center justify-between gap-2 font-sans text-[12.5px]">
                    <span style={{ color: MUTED }}>{c.label}</span>
                    <span className="font-bold tabular-nums" style={{ color: INK }}>
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FIND US — address, drives, map link                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function FindUs() {
  return (
    <section id="find" style={{ background: CREAM }} className="py-[clamp(56px,8vw,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[44fr_56fr]">
          <div>
            <Reveal>
              <Overline>{FIND.overline}</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-4 font-sans font-extrabold" style={{ color: INK, fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
                {FIND.heading}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-4 max-w-[46ch] font-sans text-[15px] leading-[1.65]" style={{ color: MUTED }}>
                {FIND.body}
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-6 rounded-[10px] p-5" style={{ background: '#FFFFFF', border: `1px solid ${HAIRLINE}` }}>
              <div className="font-sans text-[14px] font-bold" style={{ color: INK }}>
                {FIND.address}
              </div>
              <a
                href={FIND.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 font-sans text-[13px] font-extrabold uppercase tracking-[0.08em] transition-transform active:scale-[0.98] ${FOCUS}`}
                style={{ background: RUST, color: '#FFFFFF' }}
              >
                Open in maps ↗
              </a>
            </Reveal>
          </div>

          <Reveal delay={100} className="flex flex-col gap-px overflow-hidden rounded-[10px]" style={{ background: HAIRLINE }}>
            {FIND.drives.map((d) => (
              <div key={d.from} className="flex items-center justify-between gap-4 px-6 py-4.5" style={{ background: '#FFFFFF' }}>
                <div>
                  <div className="font-sans text-[14.5px] font-bold" style={{ color: INK }}>
                    {d.from}
                  </div>
                  <div className="mt-0.5 font-sans text-[12.5px]" style={{ color: MUTED }}>
                    {d.note}
                  </div>
                </div>
                <span className="shrink-0 font-sans text-[14px] font-extrabold tabular-nums" style={{ color: RUST }}>
                  {d.time}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  STAY / BOOK — no fake pricing, clean availability + inquiry panel       */
/* ══════════════════════════════════════════════════════════════════════ */
function Stay() {
  return (
    <section id="book" style={{ background: INK }} className="py-[clamp(56px,8vw,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-10 rounded-[14px] p-8 sm:p-12 md:grid-cols-[55fr_45fr]" style={{ background: 'rgba(246,241,233,.04)', border: `1px solid ${HAIRLINE_ON_INK}` }}>
          <div>
            <Reveal>
              <Overline dark>{STAY.overline}</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-4 font-sans font-extrabold" style={{ color: CREAM, fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
                {STAY.heading}
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-4 max-w-[46ch] font-sans text-[15px] leading-[1.65]" style={{ color: 'rgba(246,241,233,.7)' }}>
                {STAY.body}
              </p>
            </Reveal>
          </div>

          <Reveal delay={140} className="flex flex-col gap-4">
            <a
              href={STAY.bookHref}
              className={`inline-flex min-h-[52px] items-center justify-center rounded-full px-7 font-sans text-[15px] font-extrabold uppercase tracking-[0.08em] transition-transform active:scale-[0.98] ${FOCUS_ON_INK}`}
              style={{ background: RUST, color: '#FFFFFF' }}
            >
              {STAY.bookLabel}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border px-7 font-sans text-[15px] font-bold transition-colors hover:bg-white/5 ${FOCUS_ON_INK}`}
              style={{ borderColor: HAIRLINE_ON_INK, color: CREAM }}
            >
              {STAY.inquiryLabel}
            </a>
            <div className="mt-1 flex flex-col gap-1.5 font-sans text-[13px]" style={{ color: 'rgba(246,241,233,.6)' }}>
              <a href={PHONE_HREF} className={`font-semibold ${FOCUS_ON_INK}`} style={{ color: CREAM }}>
                {PHONE}
              </a>
              <span>{EMAIL}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  CLOSING — quiet cream sign-off                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function Closing({ onBook }: { onBook: () => void }) {
  const { ref, shown } = useInView(0.2)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section ref={ref} style={{ background: CREAM }} className="py-[clamp(72px,11vw,128px)]">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2
          className="font-sans font-extrabold"
          style={{
            color: INK,
            fontSize: 'clamp(2rem,5vw,3.6rem)',
            lineHeight: 1.04,
            letterSpacing: '-0.015em',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(16px)',
            transition: `opacity .65s ${ease}, transform .65s ${ease}`,
          }}
        >
          {CLOSING.line}
        </h2>
        <p
          className="mx-auto mt-4 max-w-[42ch] font-sans text-[15.5px] leading-[1.6]"
          style={{
            color: MUTED,
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(16px)',
            transition: `opacity .65s ${ease} .08s, transform .65s ${ease} .08s`,
          }}
        >
          {CLOSING.sub}
        </p>
        <button
          onClick={onBook}
          className={`mt-8 inline-flex min-h-[48px] items-center rounded-full px-8 font-sans text-[14.5px] font-extrabold uppercase tracking-[0.08em] transition-transform active:scale-[0.98] ${FOCUS}`}
          style={{
            background: RUST,
            color: '#FFFFFF',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(16px)',
            transition: `opacity .65s ${ease} .16s, transform .65s ${ease} .16s`,
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
export default function VinlandPage() {
  useEffect(() => {
    document.title = 'Vínland Guesthouse · Fellabær, Egilsstaðir, East Iceland'
    setThemeColor(CREAM)
    return () => setThemeColor('#0a1320')
  }, [])

  const goBook = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }

  return (
    <div className="overflow-x-hidden font-sans" style={{ background: CREAM, color: INK }}>
      <style>{`
        #vl-root ::selection { background:${RUST}; color:#FFFFFF; }
      `}</style>
      <div id="vl-root">
        <PreviewChrome company={company} />
        <Nav onBook={goBook} />
        <main>
          <Hero onBook={goBook} />
          <RiverBand />
          <FeatureBlock
            id="rooms"
            overline={ROOMS.overline}
            heading={ROOMS.heading}
            body={ROOMS.body}
            specs={ROOMS.specs}
            image={ROOMS.image}
            imageAlt={ROOMS.imageAlt}
          />
          <Amenities />
          <FeatureBlock
            id="cottage"
            overline={COTTAGE.overline}
            heading={COTTAGE.heading}
            body={COTTAGE.body}
            specs={COTTAGE.specs}
            image={COTTAGE.image}
            imageAlt={COTTAGE.imageAlt}
            reverse
            ground={INK}
            dark
          />
          <FeatureBlock
            id="camping"
            overline={PODS.overline}
            heading={PODS.heading}
            body={PODS.body}
            specs={PODS.specs}
            image={PODS.image}
            imageAlt={PODS.imageAlt}
          />
          <Nearby />
          <GuestWords />
          <FindUs />
          <Stay />
          <Closing onBook={goBook} />
        </main>

        {/* honesty disclosure — quiet pre-footer line */}
        <section style={{ background: CREAM }} className="px-6 py-9">
          <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.6]" style={{ color: MUTED }}>
            A note on honesty: the hero photo of the building is real (East Iceland tourism listing); room, cottage, pod and landscape photos shown are{' '}
            <span style={{ color: INK }}>indicative stock photography</span>, not the property's own interiors. No price is published — rates vary by season and are shown on Booking.com. Breakfast and pet policy are not claimed here as they are unconfirmed. Confirmed details: 6 en-suite guesthouse rooms · a cottage sleeping up to 6 · private camping pods · free wifi, parking &amp; airport transfer · non-smoking · open year-round · run by Ásdís and Ólafur since 2018 · Tripadvisor 4.3/5 (177 reviews) · Booking.com 8.1/10 (659 reviews) · {EMAIL} · {PHONE}.
          </p>
        </section>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
