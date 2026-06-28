import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { PartialPrototypeBanner } from '../PartialPrototypeBanner'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  AMENITIES,
  CLOSING,
  COTTAGES,
  EMAIL,
  EXPERIENCES,
  FAQ,
  FIND,
  GUESTHOUSE,
  GUEST,
  IMG,
  PLACE,
  srcSet,
  STAY,
  STILLNESS_NOTE,
  STORY,
  TABLE,
  TRUST,
  u,
  UNITS,
} from './data'
import type { Cottage } from './data'

const company = getPreviewCompany('sireksstadir')

/* ── Palette — misty East-Iceland stone & clay (see brief rationale) ────── */
const GROUND = '#EAE7E0' // cool stone-oat
const SURFACE = '#F3F1EB' // paler bone (cards/bands)
const INK = '#26282A' // slatey near-black (~12.4:1 on ground)
const MUTED = '#5C6360' // sage-grey (~5.0:1 on ground)
const CLAY = '#A6593C' // accent — button FILLS only (FBF8F3-on-clay = 4.82:1)
const CLAY_TEXT = '#8F4A30' // darker clay for text-on-ground links (~5.5:1, AA)
const SAGE = '#7C8A7E' // lichen — hairlines / hover wash, non-text

/* shared keyboard focus ring — INK outline reads on clay, stone and bone */
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26282A]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* In-page anchor targets for the nav. */
const NAV = [
  { id: 'stay-story', label: 'Stay' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'table', label: 'Table' },
  { id: 'valley', label: 'The valley' },
  { id: 'find', label: 'Find us' },
] as const

/* ── Reveal — IntersectionObserver + CSS transition, throttle-safe ──────── */
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

/* in-view hook for bespoke section composites (returns shown + ref) */
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

/* ── Overline — thin sage rule + Inter label ────────────────────────────── */
function Overline({
  children,
  color = MUTED,
  line = SAGE,
}: {
  children: ReactNode
  color?: string
  line?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8" style={{ background: line }} aria-hidden />
      <span
        className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em]"
        style={{ color }}
      >
        {children}
      </span>
    </div>
  )
}

/* ── Amenity glyphs — small inline SVGs (sage stroke) ────────────────────── */
function Glyph({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: CLAY_TEXT,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'plate':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.4" />
        </svg>
      )
    case 'cup':
      return (
        <svg {...common}>
          <path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
          <path d="M16 9h2.5a2 2 0 0 1 0 4H16" />
          <path d="M8 3v2M11 3v2" />
        </svg>
      )
    case 'sofa':
      return (
        <svg {...common}>
          <path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
          <path d="M3 12a2 2 0 0 1 2 2v3h14v-3a2 2 0 0 1 2-2v0a2 2 0 0 0-2 2v0H5v0a2 2 0 0 0-2-2Z" />
          <path d="M6 17v2M18 17v2" />
        </svg>
      )
    case 'wash':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <circle cx="12" cy="13" r="4" />
          <path d="M8 6h.01M11 6h.01" />
        </svg>
      )
    case 'wifi':
      return (
        <svg {...common}>
          <path d="M3 9a14 14 0 0 1 18 0" />
          <path d="M6.5 12.5a9 9 0 0 1 11 0" />
          <path d="M10 16a4 4 0 0 1 4 0" />
          <circle cx="12" cy="19" r="0.6" fill={CLAY_TEXT} />
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
    case 'bath':
      return (
        <svg {...common}>
          <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
          <path d="M6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
          <path d="M9 6h2" />
        </svg>
      )
    case 'pot':
      return (
        <svg {...common}>
          <path d="M5 10h14v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4Z" />
          <path d="M3 10h18" />
          <path d="M9 6c0-1 1-1 1.5-2M13 6c0-1 1-1 1.5-2" />
        </svg>
      )
    default:
      return null
  }
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  STICKY NAV — fades to GROUND once past hero; active-anchor underline    */
/* ══════════════════════════════════════════════════════════════════════ */
function StickyNav({ onRequest }: { onRequest: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('stay-story')

  useEffect(() => {
    if (prefersReduced()) {
      setScrolled(true)
    } else {
      const onScroll = () => setScrolled((window.scrollY || 0) > window.innerHeight * 0.7)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id)
          })
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      )
      NAV.forEach((n) => {
        const el = document.getElementById(n.id)
        if (el) io.observe(el)
      })
      return () => {
        window.removeEventListener('scroll', onScroll)
        io.disconnect()
      }
    }
    // reduced-motion: still track active anchor (no scroll fade needed)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 top-0 z-30"
      style={{
        background: scrolled ? 'rgba(234,231,224,.9)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${SAGE}` : '1px solid transparent',
        backdropFilter: scrolled ? 'saturate(1.1) blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(1.1) blur(8px)' : 'none',
        transition: 'background .4s ease, border-color .4s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <button
          onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`font-ranade text-[17px] font-medium tracking-[-0.01em] ${FOCUS}`}
          style={{ color: INK }}
        >
          Síreksstaðir
        </button>
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`relative px-3 py-2 font-sans text-[13.5px] font-medium transition-colors ${FOCUS}`}
              style={{ color: active === n.id ? INK : MUTED }}
            >
              {n.label}
              <span
                className="absolute inset-x-3 -bottom-0.5 h-px origin-left"
                style={{
                  background: CLAY,
                  transform: active === n.id ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform .3s cubic-bezier(.2,.7,.2,1)',
                }}
                aria-hidden
              />
            </button>
          ))}
        </div>
        <button
          onClick={onRequest}
          className={`hidden min-h-[40px] items-center rounded-full px-5 py-2 font-sans text-[13.5px] font-semibold transition-transform active:scale-[0.98] sm:inline-flex ${FOCUS}`}
          style={{ background: CLAY, color: '#FBF8F3' }}
        >
          Request to stay
        </button>
      </div>
    </nav>
  )
}

/* Mobile docked CTA — bottom-right, always reachable */
function DockedCTA({ onRequest }: { onRequest: () => void }) {
  return (
    <button
      onClick={onRequest}
      className={`fixed bottom-4 right-4 z-30 inline-flex min-h-[48px] items-center gap-2 rounded-full px-5 py-3 font-sans text-[14px] font-semibold shadow-lg transition-transform active:scale-[0.97] sm:hidden ${FOCUS}`}
      style={{ background: CLAY, color: '#FBF8F3', boxShadow: '0 10px 30px rgba(38,40,42,.28)' }}
    >
      Request to stay
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  1. HERO — near-full viewport, valley bleeds off the right & bottom      */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero({ onRequest }: { onRequest: () => void }) {
  return (
    <header
      id="top"
      className="relative overflow-hidden"
      style={{ background: GROUND, color: INK, minHeight: '88vh' }}
    >
      <div
        className="mx-auto grid h-full max-w-6xl items-center gap-x-8 px-6 md:grid-cols-[48fr_52fr]"
        style={{ minHeight: '88vh', paddingTop: 'clamp(112px,15vh,160px)', paddingBottom: 'clamp(40px,6vw,72px)' }}
      >
        {/* LEFT — quiet stone canvas */}
        <div className="relative z-10 py-6">
          <p
            className="sk-rise font-sans text-[12px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: MUTED, ['--d' as string]: '40ms' }}
          >
            {PLACE.overline}
          </p>
          <h1
            className="m-0 mt-7 font-ranade font-medium"
            style={{
              fontSize: 'clamp(2.3rem,5.6vw,4.4rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            {PLACE.lede.map((line, i) => (
              <span
                key={line}
                className={`sk-rise block${i === 1 ? ' md:ml-[clamp(0px,3vw,2.6rem)]' : ''}`}
                style={{ ['--d' as string]: `${180 + i * 90}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="sk-rise mt-7 max-w-[34ch] font-sans leading-[1.6]"
            style={{ color: MUTED, fontSize: 'clamp(15px,1.4vw,17px)', ['--d' as string]: '430ms' }}
          >
            {PLACE.intro}
          </p>

          <div
            className="sk-rise mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ ['--d' as string]: '520ms' }}
          >
            <button
              onClick={onRequest}
              className={`inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 font-sans text-[15px] font-semibold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: CLAY, color: '#FBF8F3' }}
            >
              Request to stay
            </button>
            <a
              href="#rooms"
              className={`inline-flex min-h-[44px] items-center font-sans text-[15px] font-medium underline-offset-[5px] transition-opacity hover:underline hover:opacity-80 ${FOCUS}`}
              style={{ color: INK }}
            >
              See the rooms →
            </a>
          </div>

          {/* trust baseline — 4 marks */}
          <div
            className="sk-rise mt-10 grid max-w-[460px] grid-cols-2 gap-x-8 gap-y-5 border-t pt-6 sm:grid-cols-4"
            style={{ borderColor: 'rgba(92,99,96,.22)', ['--d' as string]: '600ms' }}
          >
            {TRUST.map((t) => (
              <div key={t.label}>
                <div className="font-ranade text-[19px] font-medium leading-none" style={{ color: INK }}>
                  {t.value}
                </div>
                <div className="mt-1.5 font-sans text-[11px] leading-tight" style={{ color: MUTED }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — large valley, bleeds off right & bottom of the hero */}
        <figure className="relative m-0 hidden h-full md:block">
          <div className="sk-mistwrap absolute inset-y-0 left-0 -right-[max(0px,calc((100vw-72rem)/2+1.5rem))] overflow-hidden">
            <Img
              src={u(IMG.valley, 2200)}
              srcSet={srcSet(IMG.valley)}
              sizes="55vw"
              alt="Misty green valley with low cloud over the mountains of Sunnudalur, Vopnafjörður"
              fetchpriority="high"
              className="sk-heroimg block h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-b from-[#9aa49a] to-[#5C6360]"
            />
            {/* GROUND blend on the inner (left) edge so text meets image softly */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-40"
              style={{ background: `linear-gradient(90deg, ${GROUND}, rgba(234,231,224,0))` }}
              aria-hidden
            />
            {/* SIGNATURE mist layer */}
            <div className="sk-mist pointer-events-none absolute inset-0" aria-hidden />
          </div>
        </figure>
      </div>

      {/* MOBILE valley — full-bleed band beneath the copy */}
      <figure className="sk-mistwrap relative m-0 block md:hidden">
        <div className="relative overflow-hidden">
          <Img
            src={u(IMG.valley, 1400)}
            srcSet={srcSet(IMG.valley)}
            sizes="100vw"
            alt="Misty green valley with low cloud over the mountains of Sunnudalur, Vopnafjörður"
            className="sk-heroimg block aspect-[4/3] w-full object-cover"
            fallbackClassName="bg-gradient-to-b from-[#9aa49a] to-[#5C6360]"
          />
          <div className="sk-mist pointer-events-none absolute inset-0" aria-hidden />
        </div>
        <figcaption className="px-6 pt-3 font-ranade text-[13px] italic" style={{ color: MUTED }}>
          {PLACE.caption}
        </figcaption>
      </figure>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  2. STORY — full-bleed mountains band + italic pull-quote                */
/* ══════════════════════════════════════════════════════════════════════ */
function Story() {
  const { ref, shown } = useInView(0.18)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section id="stay-story" style={{ background: SURFACE }} className="py-[clamp(64px,9vw,120px)]">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-x-12 gap-y-10 md:grid-cols-[44fr_56fr]">
          {/* copy */}
          <div
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(18px)',
              transition: `opacity .6s ${ease}, transform .6s ${ease}`,
            }}
          >
            <Overline>{STORY.overline}</Overline>
            <h2
              className="mt-5 font-ranade font-medium"
              style={{ color: INK, fontSize: 'clamp(2rem,3.8vw,3rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}
            >
              {STORY.heading}
            </h2>
            {STORY.body.map((p) => (
              <p key={p.slice(0, 18)} className="mt-5 max-w-[46ch] font-sans text-[16px] leading-[1.65]" style={{ color: MUTED }}>
                {p}
              </p>
            ))}
            <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[12px] sm:grid-cols-3" style={{ background: SAGE }}>
              {STORY.facts.map((f) => (
                <div key={f.value} className="px-5 py-4" style={{ background: GROUND }}>
                  <dt className="font-ranade text-[16px] font-medium leading-tight" style={{ color: INK }}>
                    {f.value}
                  </dt>
                  <dd className="mt-1 font-sans text-[12.5px] leading-snug" style={{ color: MUTED }}>
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* full-feature mountains image with italic pull-quote lower-left */}
          <div className="relative">
            <div
              className="overflow-hidden rounded-[14px]"
              style={{
                opacity: shown ? 1 : 0,
                transition: `opacity .7s ${ease}`,
              }}
            >
              <Img
                src={u(IMG[STORY.image], 1800)}
                srcSet={srcSet(IMG[STORY.image])}
                sizes="(max-width:768px) 100vw, 52vw"
                alt={STORY.imageAlt}
                className={`block aspect-[4/3] w-full object-cover md:aspect-[16/11] ${shown ? 'sk-settle' : ''}`}
                fallbackClassName="bg-gradient-to-br from-[#b7ad9c] to-[#54514a]"
              />
            </div>
            <blockquote
              className="absolute bottom-5 left-3 m-0 max-w-[19rem] rounded-[12px] px-6 py-5 font-ranade text-[clamp(1.25rem,2.1vw,1.65rem)] italic leading-[1.24] md:-left-10"
              style={{
                color: INK,
                background: 'rgba(243,241,235,.94)',
                boxShadow: '0 18px 44px rgba(38,40,42,.16)',
                backdropFilter: 'blur(2px)',
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity .7s ${ease} .14s, transform .7s ${ease} .14s`,
              }}
            >
              “{STORY.pullQuote}”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Full-bleed atmospheric divider band (settles on first view). */
function Divider({ img, alt, ratio = 'aspect-[21/7]' }: { img: string; alt: string; ratio?: string }) {
  const { ref, shown } = useInView(0.1)
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ background: INK }}>
      <Img
        src={u(img, 2200)}
        srcSet={srcSet(img)}
        sizes="100vw"
        alt={alt}
        className={`block w-full object-cover ${ratio} ${shown && !prefersReduced() ? 'sk-settle' : ''}`}
        fallbackClassName="bg-gradient-to-br from-[#6c655a] to-[#2c2a26]"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(38,40,42,.12), rgba(38,40,42,.04))' }} aria-hidden />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  3. ROOMS & COTTAGES — guesthouse feature + per-unit galleries           */
/* ══════════════════════════════════════════════════════════════════════ */
function CottageCard({ c, onChoose, offset }: { c: Cottage; onChoose: (u: string) => void; offset: boolean }) {
  const [active, setActive] = useState(0)
  return (
    <Reveal
      as="figure"
      dur={0.66}
      y={26}
      className="m-0 flex flex-col overflow-hidden rounded-[16px]"
      style={{ background: SURFACE, marginTop: offset ? 'clamp(0px,4vw,56px)' : undefined }}
    >
      {/* large primary plate with cross-fade swap */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        {c.gallery.map((g, i) => (
          <Img
            key={g.key}
            src={u(IMG[g.key], 1300)}
            srcSet={srcSet(IMG[g.key])}
            sizes="(max-width:768px) 100vw, 46vw"
            alt={g.alt}
            className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-200"
            style={{ opacity: i === active ? 1 : 0 } as CSSProperties}
            fallbackClassName="bg-gradient-to-br from-[#cfcabd] to-[#8a9089]"
          />
        ))}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em]"
          style={{ background: 'rgba(38,40,42,.78)', color: '#FBF8F3' }}
        >
          {c.overline}
        </span>
      </div>

      {/* thumbnail strip */}
      <div className="flex gap-2 px-4 pt-4" role="group" aria-label={`${c.name} gallery`}>
        {c.gallery.map((g, i) => (
          <button
            key={g.key}
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1} of ${c.name}`}
            aria-pressed={i === active}
            className={`relative aspect-square w-full overflow-hidden rounded-[8px] transition-transform active:scale-[0.97] ${FOCUS}`}
            style={{ outline: i === active ? `2px solid ${CLAY}` : 'none', outlineOffset: 2 }}
          >
            <Img
              src={u(IMG[g.key], 320)}
              alt=""
              className="block h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#cfcabd] to-[#8a9089]"
            />
            {i !== active && <span className="absolute inset-0" style={{ background: 'rgba(243,241,235,.28)' }} aria-hidden />}
          </button>
        ))}
      </div>

      <figcaption className="flex flex-1 flex-col p-6 pt-5">
        <h3 className="font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.6rem,2.6vw,2.1rem)', lineHeight: 1.06 }}>
          {c.name}
        </h3>
        <p className="mt-3 font-sans text-[15px] leading-[1.6]" style={{ color: MUTED }}>
          {c.desc}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-sans text-[14px] font-medium tabular-nums" style={{ color: INK }}>
          {c.specs.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {c.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full px-3 py-1 font-sans text-[12px] font-medium"
              style={{ background: GROUND, color: MUTED }}
            >
              {a}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 border-t pt-5" style={{ borderColor: 'rgba(92,99,96,.2)' }}>
          <div>
            <div className="font-sans text-[13px]" style={{ color: MUTED }}>
              from
            </div>
            <div className="font-sans text-[20px] font-semibold tabular-nums" style={{ color: INK }}>
              {c.priceFrom} <span style={{ color: CLAY }}>kr</span>
              <span className="font-normal" style={{ color: MUTED, fontSize: '0.7em' }}>
                {' '}/ nótt · sample
              </span>
            </div>
          </div>
          <button
            onClick={() => onChoose(c.id)}
            className={`inline-flex min-h-[44px] shrink-0 items-center font-sans text-[14px] font-semibold underline-offset-[5px] transition-opacity hover:underline hover:opacity-80 ${FOCUS}`}
            style={{ color: CLAY_TEXT }}
          >
            Request this cottage →
          </button>
        </div>
      </figcaption>
    </Reveal>
  )
}

function Rooms({ onChoose }: { onChoose: (unit: string) => void }) {
  return (
    <section id="rooms" style={{ background: GROUND }} className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Overline>Rooms &amp; cottages</Overline>
        </Reveal>
        <Reveal delay={70}>
          <h2
            className="mt-5 max-w-[760px] font-ranade font-medium"
            style={{ color: INK, fontSize: 'clamp(2.2rem,4.4vw,3.4rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}
          >
            Seven rooms and two cottages, plainly told.
          </h2>
        </Reveal>

        {/* guesthouse — wide 16:9 feature plate + spec column */}
        <Reveal delay={120} className="mt-14 grid gap-7 md:grid-cols-[60fr_40fr]">
          <figure className="group m-0 overflow-hidden rounded-[16px]">
            <Img
              src={u(IMG[GUESTHOUSE.image], 1600)}
              srcSet={srcSet(IMG[GUESTHOUSE.image])}
              sizes="(max-width:768px) 100vw, 56vw"
              alt={GUESTHOUSE.imageAlt}
              className="sk-plate block aspect-[16/9] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#cfcabd] to-[#8a9089]"
            />
          </figure>
          <div className="flex flex-col justify-center rounded-[16px] p-7" style={{ background: SURFACE }}>
            <Overline>{GUESTHOUSE.overline}</Overline>
            <h3 className="mt-4 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.6rem,2.4vw,2rem)', lineHeight: 1.1 }}>
              {GUESTHOUSE.name}
            </h3>
            <p className="mt-3.5 font-sans text-[15px] leading-[1.6]" style={{ color: MUTED }}>
              {GUESTHOUSE.body}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 font-sans text-[14px] font-medium" style={{ color: INK }}>
              {GUESTHOUSE.specs.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full" style={{ background: SAGE }} aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: 'rgba(92,99,96,.2)' }}>
              <span className="font-sans text-[14px]" style={{ color: MUTED }}>
                {GUESTHOUSE.priceNote}
              </span>
              <button
                onClick={() => onChoose('guesthouse')}
                className={`inline-flex min-h-[44px] items-center font-sans text-[14px] font-semibold underline-offset-[5px] transition-opacity hover:underline hover:opacity-80 ${FOCUS}`}
                style={{ color: CLAY_TEXT }}
              >
                Request a room →
              </button>
            </div>
          </div>
        </Reveal>

        {/* two cottages — offset grid, each a gallery */}
        <div className="mt-7 grid gap-7 md:grid-cols-2">
          {COTTAGES.map((c, i) => (
            <CottageCard key={c.id} c={c} onChoose={onChoose} offset={i === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  4. AMENITIES — scannable icon grid                                      */
/* ══════════════════════════════════════════════════════════════════════ */
function Amenities() {
  return (
    <section style={{ background: SURFACE }} className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-[640px]">
          <Reveal>
            <Overline>What’s included</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.9rem,3.4vw,2.7rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              The plain comforts of a farm that has hosted people a long time.
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] sm:grid-cols-3 lg:grid-cols-4" style={{ background: SAGE }}>
          {AMENITIES.map((a, i) => (
            <Reveal key={a.title} delay={i * 60} y={16} className="flex flex-col gap-3 p-6" style={{ background: GROUND }}>
              <Glyph name={a.icon} />
              <div>
                <div className="font-sans text-[15px] font-semibold" style={{ color: INK }}>
                  {a.title}
                </div>
                <div className="mt-1 font-sans text-[13px] leading-snug" style={{ color: MUTED }}>
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
/*  5. FARM TABLE — main image + pull-quote, then morning/evening pair      */
/* ══════════════════════════════════════════════════════════════════════ */
function FarmTable() {
  const { ref, shown } = useInView(0.22)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section id="table" style={{ background: GROUND }} className="py-[clamp(64px,9vw,120px)]">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[40fr_60fr]">
          {/* LEFT — copy */}
          <div
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(18px)',
              transition: `opacity .6s ${ease}, transform .6s ${ease}`,
            }}
          >
            <Overline>{TABLE.overline}</Overline>
            <h2 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(2rem,3.6vw,3rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
              {TABLE.name}
            </h2>
            <p className="mt-5 max-w-[420px] font-sans text-[16px] leading-[1.65]" style={{ color: MUTED }}>
              {TABLE.body}
            </p>
            <div className="mt-6 rounded-[12px] p-5" style={{ background: SURFACE }}>
              <p className="font-sans text-[14.5px] font-medium leading-[1.5]" style={{ color: INK }}>
                {TABLE.serviceNote}
              </p>
              <p className="mt-1.5 font-sans text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                {TABLE.serviceNoteEn}
              </p>
            </div>
          </div>

          {/* RIGHT — main table image with overlapping italic pull-quote */}
          <div className="relative">
            <div
              className="overflow-hidden rounded-[14px]"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateX(0)' : 'translateX(20px)',
                transition: `opacity .65s ${ease}, transform .65s ${ease}`,
              }}
            >
              <Img
                src={u(IMG[TABLE.image], 1600)}
                srcSet={srcSet(IMG[TABLE.image])}
                sizes="(max-width:768px) 100vw, 56vw"
                alt={TABLE.imageAlt}
                className="block aspect-[16/11] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#b7ad9c] to-[#6c655a]"
              />
            </div>
            <blockquote
              className="absolute bottom-6 left-3 m-0 max-w-[19rem] rounded-[12px] px-6 py-5 font-ranade text-[clamp(1.3rem,2.2vw,1.75rem)] italic leading-[1.22] md:-left-10"
              style={{
                color: INK,
                background: 'rgba(243,241,235,.94)',
                boxShadow: '0 18px 44px rgba(38,40,42,.16)',
                backdropFilter: 'blur(2px)',
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity .7s ${ease} .12s, transform .7s ${ease} .12s`,
              }}
            >
              “{TABLE.pullQuote}”
            </blockquote>
          </div>
        </div>

        {/* morning / evening pair */}
        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {[TABLE.morning, TABLE.evening].map((b, i) => (
            <Reveal key={b.overline} delay={i * 110} as="figure" className="m-0 overflow-hidden rounded-[14px]" style={{ background: SURFACE }}>
              <div className="group overflow-hidden">
                <Img
                  src={u(IMG[b.image], 1300)}
                  srcSet={srcSet(IMG[b.image])}
                  sizes="(max-width:768px) 100vw, 46vw"
                  alt={b.imageAlt}
                  className="sk-plate block aspect-[16/10] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#cabf9e] to-[#7a6f54]"
                />
              </div>
              <figcaption className="p-6">
                <Overline>{b.overline}</Overline>
                <p className="mt-3 font-sans text-[15px] leading-[1.6]" style={{ color: MUTED }}>
                  {b.body}
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
/*  6. THE VALLEY — experiences mosaic (1 tall + 2 wide)                    */
/* ══════════════════════════════════════════════════════════════════════ */
function Valley() {
  return (
    <section id="valley" style={{ background: SURFACE }} className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Reveal>
              <Overline>Out the door</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(2.1rem,4vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
                The valley is the thing you came for.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[34ch] font-sans text-[15px] leading-[1.6]" style={{ color: MUTED }}>
              No activity menu, no booking desk. Just what is already here, in every season.
            </p>
          </Reveal>
        </div>

        {/* mosaic: tall tile spans 2 rows on the left, two wide tiles stack right */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 md:grid-rows-2">
          {EXPERIENCES.map((e, i) => (
            <Reveal
              key={e.title}
              delay={e.span === 'tall' ? 0 : 120 + i * 80}
              as="figure"
              className={`group relative m-0 overflow-hidden rounded-[16px] ${e.span === 'tall' ? 'md:row-span-2' : ''}`}
            >
              <Img
                src={u(IMG[e.image], e.span === 'tall' ? 1300 : 1500)}
                srcSet={srcSet(IMG[e.image])}
                sizes={e.span === 'tall' ? '(max-width:768px) 100vw, 48vw' : '(max-width:768px) 100vw, 48vw'}
                alt={e.imageAlt}
                className={`sk-plate block w-full object-cover ${e.span === 'tall' ? 'aspect-[4/5] md:h-full' : 'aspect-[16/9]'}`}
                fallbackClassName="bg-gradient-to-br from-[#5b6a6a] to-[#23282b]"
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(38,40,42,0) 30%, rgba(38,40,42,.5) 62%, rgba(38,40,42,.9))' }} aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'rgba(243,241,235,.92)' }}>
                  {e.overline}
                </span>
                <h3 className="mt-2 font-ranade font-medium" style={{ color: '#FBF8F3', fontSize: 'clamp(1.3rem,2vw,1.7rem)', lineHeight: 1.12 }}>
                  {e.title}
                </h3>
                <p className="mt-2 max-w-[40ch] font-sans text-[13.5px] leading-[1.55]" style={{ color: 'rgba(243,241,235,.95)' }}>
                  {e.body}
                </p>
              </figcaption>
            </Reveal>
          ))}
        </div>

        {/* stillness note — quiet closing line for the band */}
        <Reveal delay={120} className="mt-6 rounded-[16px] p-7 md:p-9" style={{ background: GROUND }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
            <h3 className="shrink-0 font-ranade text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium italic" style={{ color: INK }}>
              {STILLNESS_NOTE.title}
            </h3>
            <p className="max-w-[52ch] font-sans text-[15.5px] leading-[1.6]" style={{ color: MUTED }}>
              {STILLNESS_NOTE.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  7. GUEST WORDS — quote + disclaimed score row, dark mountain scrim band */
/* ══════════════════════════════════════════════════════════════════════ */
function GuestWords() {
  return (
    <section className="relative overflow-hidden" style={{ background: INK }}>
      <Img
        src={u(IMG.mountains, 2200)}
        srcSet={srcSet(IMG.mountains)}
        sizes="100vw"
        alt=""
        className="absolute inset-0 block h-full w-full object-cover"
        fallbackClassName="bg-gradient-to-br from-[#4a4742] to-[#1d1c1a]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(38,40,42,.9), rgba(38,40,42,.82))' }} aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6 py-[clamp(72px,10vw,128px)] text-center">
        <Reveal>
          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgba(243,241,235,.7)' }}>
            {GUEST.overline}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <blockquote className="mx-auto mt-7 max-w-[40rem] font-ranade text-[clamp(1.6rem,3.2vw,2.6rem)] italic leading-[1.2]" style={{ color: '#FBF8F3' }}>
            “{GUEST.quote}”
          </blockquote>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 font-sans text-[13px]" style={{ color: 'rgba(243,241,235,.8)' }}>
            {GUEST.attribution}
          </p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {GUEST.scores.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} y={16}>
              <div className="font-ranade text-[clamp(1.7rem,3vw,2.3rem)] font-medium leading-none" style={{ color: '#FBF8F3' }}>
                {s.value}
              </div>
              <div className="mt-2 font-sans text-[13px] font-semibold" style={{ color: 'rgba(243,241,235,.92)' }}>
                {s.label}
              </div>
              <div className="mt-1 font-sans text-[11.5px] leading-snug" style={{ color: 'rgba(243,241,235,.78)' }}>
                {s.note}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  8. FIND US — bespoke SVG map with clay pin + drive panel + FAQ          */
/* ══════════════════════════════════════════════════════════════════════ */
function MapPanel() {
  const { ref, shown } = useInView(0.25)
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[16px]" style={{ background: '#DFE0D7', border: `1px solid ${SAGE}` }}>
      <svg viewBox="0 0 600 420" className="block aspect-[16/11] w-full" role="img" aria-label="Stylised map of northeast Iceland showing Síreksstaðir up Sunnudalur near Vopnafjörður">
        {/* sea */}
        <rect width="600" height="420" fill="#CDD3CF" />
        {/* land mass */}
        <path d="M0 150 C 90 110 150 140 220 120 C 300 96 360 130 430 110 C 500 92 560 120 600 100 L600 420 L0 420 Z" fill="#E4E2DA" />
        {/* fjord inlet */}
        <path d="M250 100 C 280 150 300 170 290 220 C 285 250 310 270 340 280" fill="none" stroke="#CDD3CF" strokeWidth="22" strokeLinecap="round" />
        {/* valley line (Sunnudalur) up from the coast to the pin */}
        <path d="M300 250 C 350 240 400 220 440 190" fill="none" stroke={SAGE} strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
        {/* contour hints */}
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${360 + k * 18} ${150 - k * 14} C ${420 + k * 14} ${130 - k * 12}, ${480 + k * 10} ${160 - k * 10}, ${520 + k * 8} ${140 - k * 8}`}
            fill="none"
            stroke="#C9CCC2"
            strokeWidth="1.4"
          />
        ))}
        {/* village dot + label */}
        <circle cx="305" cy="255" r="4" fill={MUTED} />
        <text x="300" y="278" textAnchor="end" fontSize="13" fill={MUTED} fontFamily="Inter, sans-serif">
          Vopnafjörður
        </text>
        {/* the pin */}
        <g transform="translate(440 188)" style={{ transformOrigin: '440px 188px' }}>
          {/* ripple */}
          <circle
            cx="0"
            cy="0"
            r="10"
            fill="none"
            stroke={CLAY}
            strokeWidth="2"
            className={shown ? 'sk-ripple' : ''}
            style={{ opacity: prefersReduced() ? 0 : undefined }}
          />
          <g
            className={shown && !prefersReduced() ? 'sk-pin' : ''}
            style={{ transformOrigin: '0px 0px' }}
          >
            <path d="M0 -20 C 11 -20 16 -11 16 -4 C 16 6 4 14 0 22 C -4 14 -16 6 -16 -4 C -16 -11 -11 -20 0 -20 Z" fill={CLAY} />
            <circle cx="0" cy="-4" r="5" fill="#F3F1EB" />
          </g>
        </g>
        <text x="440" y="172" textAnchor="middle" fontSize="13.5" fontWeight="600" fill={INK} fontFamily="Inter, sans-serif">
          Síreksstaðir
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
    <div className="border-t" style={{ borderColor: 'rgba(92,99,96,.24)' }}>
      <h3 className="m-0">
        <button
          onClick={onToggle}
          aria-expanded={open}
          className={`flex w-full items-center justify-between gap-4 py-5 text-left ${FOCUS}`}
        >
          <span className="font-sans text-[16px] font-medium" style={{ color: INK }}>
            {q}
          </span>
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{ background: GROUND, color: CLAY_TEXT, transition: 'transform .3s ease', transform: open ? 'rotate(45deg)' : 'none' }}
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
        <p className="pb-5 pr-10 font-sans text-[15px] leading-[1.65]" style={{ color: MUTED }}>
          {a}
        </p>
      </div>
    </div>
  )
}

function FindUs() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="find" style={{ background: GROUND }} className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-[680px]">
          <Reveal>
            <Overline>{FIND.overline}</Overline>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(2rem,3.8vw,3rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
              {FIND.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-[52ch] font-sans text-[16px] leading-[1.65]" style={{ color: MUTED }}>
              {FIND.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-[58fr_42fr]">
          {/* map + small road vignette */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <MapPanel />
            </Reveal>
            <Reveal delay={90} as="figure" className="group m-0 overflow-hidden rounded-[14px]">
              <Img
                src={u(IMG[FIND.roadImage], 1400)}
                srcSet={srcSet(IMG[FIND.roadImage])}
                sizes="(max-width:1024px) 100vw, 56vw"
                alt={FIND.roadAlt}
                className="sk-plate block aspect-[16/7] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#6c655a] to-[#2c2a26]"
              />
            </Reveal>
          </div>

          {/* orientation panel */}
          <Reveal delay={120} className="flex flex-col rounded-[16px] p-7" style={{ background: SURFACE }}>
            <div className="font-sans text-[14px] leading-[1.6]" style={{ color: INK }}>
              <div className="font-semibold">{FIND.address}</div>
              <div className="mt-1 tabular-nums" style={{ color: MUTED }}>
                {FIND.coords}
              </div>
            </div>
            <a
              href={FIND.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full px-5 py-2.5 font-sans text-[14px] font-semibold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: CLAY, color: '#FBF8F3' }}
            >
              Open in maps ↗
            </a>
            <div className="mt-7 flex flex-col gap-px overflow-hidden rounded-[12px]" style={{ background: SAGE }}>
              {FIND.drives.map((d) => (
                <div key={d.from} className="flex items-center justify-between gap-4 px-4 py-3.5" style={{ background: SURFACE }}>
                  <div>
                    <div className="font-sans text-[14px] font-medium" style={{ color: INK }}>
                      from {d.from}
                    </div>
                    <div className="font-sans text-[12px] leading-snug" style={{ color: MUTED }}>
                      {d.note}
                    </div>
                  </div>
                  <span className="shrink-0 font-sans text-[14px] font-semibold tabular-nums" style={{ color: CLAY_TEXT }}>
                    {d.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-[12px] leading-[1.5]" style={{ color: MUTED }}>
              Drive times are approximate / indicative; allow extra in winter and check road.is.
            </p>
          </Reveal>
        </div>

        {/* FAQ */}
        <div className="mt-16 grid gap-x-12 gap-y-8 md:grid-cols-[34fr_66fr]">
          <div>
            <Reveal>
              <Overline>Before you come</Overline>
            </Reveal>
            <Reveal delay={70}>
              <h3 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', lineHeight: 1.1 }}>
                Know before you go.
              </h3>
            </Reveal>
          </div>
          <Reveal delay={90}>
            <div className="border-b" style={{ borderColor: 'rgba(92,99,96,.24)' }}>
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
/*  9. REQUEST TO STAY — balanced 2-column band (form + side panel)         */
/* ══════════════════════════════════════════════════════════════════════ */
function Stay({ unit, setUnit }: { unit: string; setUnit: (u: string) => void }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', arrive: '', depart: '', notes: '' })
  const [party, setParty] = useState(2)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const field =
    'w-full rounded-[10px] px-3.5 py-3 font-sans text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  const fieldStyle: CSSProperties = {
    border: '1px solid rgba(92,99,96,.34)',
    background: '#FFFFFF',
    color: INK,
    outlineColor: CLAY,
  }
  const labelCls = 'mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.1em]'

  return (
    <section id="stay" style={{ background: SURFACE }} className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 overflow-hidden rounded-[18px] md:grid-cols-[40fr_60fr]" style={{ background: GROUND, border: `1px solid ${SAGE}` }}>
          {/* side info panel + image */}
          <aside className="relative flex flex-col">
            <div className="p-7 md:p-9">
              <Overline>{STAY.panelOverline}</Overline>
              <h2 className="mt-5 font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.9rem,3.2vw,2.6rem)', lineHeight: 1.06, letterSpacing: '-0.015em' }}>
                {STAY.name}
              </h2>
              <p className="mt-4 font-sans text-[15px] leading-[1.65]" style={{ color: MUTED }}>
                {STAY.panelBody}
              </p>
              <div className="mt-6 flex flex-col gap-2 font-sans text-[14px]">
                <a href={`mailto:${EMAIL}`} className={`inline-flex min-h-[40px] items-center font-semibold underline-offset-[4px] hover:underline ${FOCUS}`} style={{ color: CLAY_TEXT }}>
                  {EMAIL}
                </a>
                <span style={{ color: MUTED }}>{STAY.checkIn}</span>
                <span style={{ color: MUTED }}>{STAY.checkOut}</span>
                <span className="text-[12.5px] leading-[1.5]" style={{ color: MUTED }}>
                  {STAY.cancellation}
                </span>
              </div>
            </div>
            <figure className="m-0 mt-auto hidden overflow-hidden md:block">
              <Img
                src={u(IMG[STAY.sideImage], 900)}
                srcSet={srcSet(IMG[STAY.sideImage])}
                sizes="40vw"
                alt={STAY.sideImageAlt}
                className="block aspect-[4/3] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#cfcabd] to-[#8a9089]"
              />
            </figure>
          </aside>

          {/* the form */}
          <div className="p-7 md:p-9" style={{ background: SURFACE }}>
            {sent ? (
              <Reveal className="py-10 text-center">
                <Overline>Request sent</Overline>
                <p className="mx-auto mt-6 max-w-[26rem] font-ranade font-medium" style={{ color: INK, fontSize: 'clamp(1.7rem,3vw,2.4rem)', lineHeight: 1.12 }}>
                  {STAY.confirmation}
                </p>
                <p className="mt-5 font-sans text-[15px]" style={{ color: MUTED }}>
                  We’ll reply to <span style={{ color: INK }}>{form.email || 'your email'}</span>. This is a concept preview, so nothing was actually sent.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className={`mt-7 inline-flex min-h-[44px] items-center font-sans text-[14px] font-semibold underline-offset-[5px] hover:underline ${FOCUS}`}
                  style={{ color: CLAY_TEXT }}
                >
                  ← Write another note
                </button>
              </Reveal>
            ) : (
              <div>
                <Overline>{STAY.overline}</Overline>
                <p className="mt-4 font-sans text-[15.5px] leading-[1.6]" style={{ color: MUTED }}>
                  {STAY.reassure}
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
                      <div className="flex items-center justify-between rounded-[10px] px-2 py-1.5" style={{ border: '1px solid rgba(92,99,96,.34)', background: '#FFFFFF' }}>
                        <button type="button" onClick={() => setParty(Math.max(1, party - 1))} disabled={party <= 1} aria-label="Fewer guests" className={`grid h-11 w-11 place-items-center rounded-[8px] text-[20px] leading-none transition-opacity disabled:opacity-35 ${FOCUS}`} style={{ background: GROUND, color: INK }}>
                          −
                        </button>
                        <span className="font-sans text-[17px] font-semibold tabular-nums" style={{ color: INK }}>
                          {party}
                        </span>
                        <button type="button" onClick={() => setParty(Math.min(8, party + 1))} disabled={party >= 8} aria-label="More guests" className={`grid h-11 w-11 place-items-center rounded-[8px] text-[20px] leading-none transition-opacity disabled:opacity-35 ${FOCUS}`} style={{ background: GROUND, color: INK }}>
                          +
                        </button>
                      </div>
                    </div>
                    <label>
                      <span className={labelCls} style={{ color: MUTED }}>Which place</span>
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

                  <button type="submit" className={`mt-1 w-full rounded-[10px] py-4 font-sans text-[16px] font-semibold transition-transform active:scale-[0.99] ${FOCUS}`} style={{ background: CLAY, color: '#FBF8F3' }}>
                    Send request
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
/*  10. CLOSING — full-bleed valley sign-off + CTA                          */
/* ══════════════════════════════════════════════════════════════════════ */
function Closing({ onRequest }: { onRequest: () => void }) {
  const { ref, shown } = useInView(0.2)
  const ease = 'cubic-bezier(.2,.7,.2,1)'
  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: INK }}>
      <Img
        src={u(IMG[CLOSING.image], 2200)}
        srcSet={srcSet(IMG[CLOSING.image])}
        sizes="100vw"
        alt={CLOSING.imageAlt}
        className={`absolute inset-0 block h-full w-full object-cover ${shown && !prefersReduced() ? 'sk-settle' : ''}`}
        fallbackClassName="bg-gradient-to-b from-[#9aa49a] to-[#3a3d3c]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(38,40,42,.62), rgba(38,40,42,.8))' }} aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-[clamp(96px,15vw,180px)] text-center">
        <h2
          className="font-ranade font-medium"
          style={{
            color: '#FBF8F3',
            fontSize: 'clamp(2.4rem,6vw,4.5rem)',
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease}, transform .7s ${ease}`,
          }}
        >
          {CLOSING.line}
        </h2>
        <p
          className="mx-auto mt-5 max-w-[34ch] font-sans text-[16px] leading-[1.6]"
          style={{
            color: 'rgba(243,241,235,.9)',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease} .1s, transform .7s ${ease} .1s`,
          }}
        >
          {CLOSING.sub}
        </p>
        <button
          onClick={onRequest}
          className={`mt-9 inline-flex min-h-[48px] items-center rounded-full px-8 py-4 font-sans text-[16px] font-semibold transition-transform active:scale-[0.98] ${FOCUS}`}
          style={{
            background: CLAY,
            color: '#FBF8F3',
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(18px)',
            transition: `opacity .7s ${ease} .18s, transform .7s ${ease} .18s`,
          }}
        >
          Request to stay
        </button>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SIGNATURE — "the mist that clears as you read" (untouched)              */
/* ══════════════════════════════════════════════════════════════════════ */
function useMistClearing() {
  useEffect(() => {
    const root = document.getElementById('sk-root')
    if (!root) return
    if (prefersReduced()) {
      root.style.setProperty('--mist-o', '0.15')
      root.style.setProperty('--mist-b', '2px')
      return
    }
    const onScroll = () => {
      const span = window.innerHeight * 0.8
      const p = Math.min(1, Math.max(0, (window.scrollY || 0) / span))
      const o = (0.55 * (1 - p)).toFixed(3)
      const b = (8 * (1 - p)).toFixed(2)
      root.style.setProperty('--mist-o', o)
      root.style.setProperty('--mist-b', `${b}px`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function SireksstadirPage() {
  const [unit, setUnit] = useState('guesthouse')
  useMistClearing()

  useEffect(() => {
    document.title = 'Síreksstaðir · Farm-stay in Sunnudalur, Vopnafjörður'
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
        #sk-root ::selection { background:${SAGE}; color:${INK}; }
        .sk-mist {
          opacity: var(--mist-o, 0.15);
          backdrop-filter: blur(var(--mist-b, 2px));
          -webkit-backdrop-filter: blur(var(--mist-b, 2px));
          background:
            radial-gradient(120% 80% at 30% 12%, rgba(243,241,235,.92), rgba(243,241,235,0) 62%),
            radial-gradient(120% 90% at 78% 88%, rgba(124,138,126,.55), rgba(124,138,126,0) 60%);
          transition: opacity .18s linear, backdrop-filter .18s linear;
        }
        .sk-rise { opacity:1; }
        @media (prefers-reduced-motion: no-preference) {
          .sk-rise { animation: sk-rise .6s cubic-bezier(.2,.7,.2,1) var(--d,0ms) both; }
          @keyframes sk-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
          .sk-heroimg { animation: sk-settle 1.4s cubic-bezier(.2,.7,.2,1) both; }
          .sk-settle { animation: sk-settle 1.4s cubic-bezier(.2,.7,.2,1) both; }
          @keyframes sk-settle { from { transform:scale(1.06); } to { transform:scale(1); } }
          .sk-plate { transition: transform .35s ease; }
          .group:hover .sk-plate { transform: scale(1.04); }
          .sk-pin { animation: sk-drop .6s cubic-bezier(.2,.9,.3,1.4) both; }
          @keyframes sk-drop { 0% { transform: translateY(-16px) scale(.6); opacity:0; } 60% { opacity:1; } 100% { transform: translateY(0) scale(1); opacity:1; } }
          .sk-ripple { animation: sk-ripple 1.6s ease-out .4s 1 both; }
          @keyframes sk-ripple { 0% { r:8; opacity:.7; } 100% { r:30; opacity:0; } }
        }
      `}</style>
      <div id="sk-root">
        <PreviewChrome company={company} />
        <PartialPrototypeBanner />
        <StickyNav onRequest={goRequest} />
        <DockedCTA onRequest={goRequest} />
        <main>
          <Hero onRequest={goRequest} />
          <Story />
          <Rooms onChoose={choose} />
          <Amenities />
          <FarmTable />
          <Divider img={IMG.mountains} alt="" />
          <Valley />
          <GuestWords />
          <FindUs />
          <Stay unit={unit} setUnit={setUnit} />
          <Closing onRequest={goRequest} />
        </main>

        {/* honesty disclosure — demoted to a quiet pre-footer line */}
        <section style={{ background: SURFACE }} className="px-6 py-9">
          <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.6]" style={{ color: MUTED }}>
            A note on honesty: the cottage and room interiors shown are{' '}
            <span style={{ color: INK }}>indicative stock photography</span> — the real cottages have no photos yet. Every price is a{' '}
            <span style={{ color: INK }}>sample</span> (no rates are published). The farm restaurant has no published menu or hours. The Booking.com and TripAdvisor scores are{' '}
            <span style={{ color: INK }}>indicative / to confirm</span> and no third-party membership or award is claimed here. Confirmed details: family farm at 691 Vopnafjörður · on-site restaurant · breakfast buffet for a fee · shared lounge, laundry, free wifi &amp; parking · check-in 16:00 / check-out by 12:00 · free cancellation 30+ days before arrival · {EMAIL}.
          </p>
        </section>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
