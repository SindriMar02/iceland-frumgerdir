import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CLOSE_MIN,
  CLOSING,
  DISCLAIMER,
  EMAIL,
  FIND,
  HERO,
  IMG,
  LANTERN,
  MAPS_URL,
  MENU,
  NAV,
  OPEN_MIN,
  PHONE,
  PHONE_HREF,
  RESERVE,
  REVIEWS,
  SOUP,
  srcSet,
  STORY,
  u,
  UIMG,
} from './data'

const company = getPreviewCompany('naustid')

/* ── Palette (brief-locked, sampled from the client's own photography) ─────
 * GROUND #F7F1E2 warm paper · INK #211D14 (≈15:1 on ground, AAA)
 * ACCENT #F0B429 the yellow house (ink-on-accent ≈10:1, AAA)
 * HARBOUR #3E6478 Skjálfandi blue-grey (≈5.1:1 on ground, AA)
 * SOUPC #D97B3F paprika orange — decoration inside the soup section ONLY
 * NIGHT #101820 the lantern section's harbour-night ground                */
const GROUND = '#F7F1E2'
const CARD = '#FFFCF2'
const INK = '#211D14'
const MUTED = '#5C543F'
const ACCENT = '#F0B429'
const HARBOUR = '#3E6478'
const SOUPC = '#D97B3F'
const NIGHT = '#101820'
const DUSK = '#0B141B'
const HAIRLINE = 'rgba(33,29,20,.14)'
const CREAM_ON_DARK = 'rgba(247,241,226,.92)'
const CREAM_DIM = 'rgba(247,241,226,.66)'

const EASE = 'cubic-bezier(.22,.61,.21,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211D14]'
const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F1E2]'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const goTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })

/* ── useInViewOnce — IO on an UNTRANSFORMED wrapper (ledger #7), failsafe
 * gated by viewport position so below-fold choreography survives (#25). ── */
function useInViewOnce(threshold = 0.18) {
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
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const r2 = el.getBoundingClientRect()
      if (r2.top < window.innerHeight) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [threshold])
  return { ref, shown }
}

/* ── Reveal — rise + de-blur (NO overflow clip masks: Icelandic Í/Á accents
 * on Fraunces stay unclipped, per the accent-clipping rule). ─────────────── */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li' | 'p'
}) {
  const { ref, shown } = useInViewOnce(0.2)
  const reduced = useReducedMotion()
  const Tag = as
  const on = shown || !!reduced
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        reduced
          ? style
          : {
              ...style,
              opacity: on ? 1 : 0,
              transform: on ? 'none' : `translateY(${y}px)`,
              filter: on ? 'blur(0px)' : 'blur(7px)',
              transition: `opacity .72s ${EASE} ${delay}ms, transform .72s ${EASE} ${delay}ms, filter .72s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

/* ── ClipImg — content photos wipe open from the bottom as they enter view.
 * Wrapper carries the aspect + IO; the inner layer clips (ledger #7/#12). ── */
function ClipImg({
  src,
  imgSrcSet,
  sizes,
  alt,
  className = '',
  delay = 0,
  fallbackClassName,
}: {
  src: string
  imgSrcSet?: string
  sizes?: string
  alt: string
  className?: string
  delay?: number
  fallbackClassName?: string
}) {
  const { ref, shown } = useInViewOnce(0.16)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={
          reduced
            ? undefined
            : {
                clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                transition: `clip-path .95s ${EASE} ${delay}ms`,
              }
        }
      >
        <Img
          src={src}
          srcSet={imgSrcSet}
          sizes={sizes}
          alt={alt}
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  transform: on ? 'scale(1)' : 'scale(1.09)',
                  transition: `transform 1.25s ${EASE} ${delay}ms`,
                }
          }
          fallbackClassName={fallbackClassName ?? 'bg-gradient-to-br from-[#c9bfa3] to-[#7b7259]'}
        />
      </div>
    </div>
  )
}

/* ── The fish mark — a clean vector cut of the silhouette on Naustið's own
 * black facade sign (white fish + lowercase wordmark), not an invented logo. */
function FishMark({ size = 34, color = '#F7F1E2' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={(size * 30) / 68} viewBox="0 0 68 30" aria-hidden fill="none">
      <path
        d="M2 15C11 5.5 27 2.5 41.5 9.5L60 3.5c-3.2 3.8-4.6 7.7-4.6 11.5s1.4 7.7 4.6 11.5l-18.5-6C27 27.5 11 24.5 2 15Z"
        fill={color}
      />
      <circle cx="11.5" cy="13.6" r="1.7" fill={color === '#F7F1E2' ? INK : GROUND} />
    </svg>
  )
}

/* ── Live open/closed against the verified daily hours, Iceland time ─────── */
function isOpenNow(): boolean {
  try {
    const hm = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Atlantic/Reykjavik',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())
    const [h, m] = hm.split(':').map(Number)
    const mins = h * 60 + m
    return mins >= OPEN_MIN && mins < CLOSE_MIN
  } catch {
    return true
  }
}
function useOpenNow() {
  const [open, setOpen] = useState(isOpenNow)
  useEffect(() => {
    const t = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  return open
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV — transparent over the dusk hero, warm paper once scrolled          */
/* ══════════════════════════════════════════════════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const solid = scrolled || menuOpen
  const linkColor = solid ? INK : CREAM_ON_DARK
  const go = (id: string) => {
    setMenuOpen(false)
    goTo(id)
  }
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? 'rgba(247,241,226,.96)' : 'transparent',
        borderBottom: `1px solid ${solid ? HAIRLINE : 'transparent'}`,
        backdropFilter: solid ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: solid ? 'blur(10px)' : undefined,
        transition: 'background-color .35s ease, border-color .35s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`flex items-center gap-2.5 ${solid ? FOCUS : FOCUS_DARK}`}
          aria-label="Naustið, efst á síðu"
        >
          <FishMark size={30} color={solid ? INK : '#F7F1E2'} />
          <span
            className="font-display text-[20px] font-semibold lowercase italic leading-none"
            style={{ color: linkColor }}
          >
            naustið
          </span>
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`na-navlink font-sans text-[13.5px] font-medium ${solid ? FOCUS : FOCUS_DARK}`}
              style={{ color: linkColor }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={PHONE_HREF}
            className={`font-mono text-[13px] font-bold tracking-[0.02em] ${solid ? FOCUS : FOCUS_DARK}`}
            style={{ color: linkColor }}
          >
            {PHONE}
          </a>
          <button
            onClick={() => go('panta')}
            className={`na-cta inline-flex min-h-[40px] items-center rounded-full px-5 font-sans text-[13px] font-bold ${FOCUS}`}
            style={{ background: ACCENT, color: INK }}
          >
            Panta borð
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
          className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${solid ? FOCUS : FOCUS_DARK}`}
          style={{ color: linkColor }}
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
        <div className="border-t px-5 pb-6 pt-2 lg:hidden" style={{ borderColor: HAIRLINE, background: GROUND }}>
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
          <div className="mt-4 flex items-center justify-between gap-3">
            <a
              href={PHONE_HREF}
              className={`inline-flex min-h-[44px] items-center font-mono text-[14px] font-bold ${FOCUS}`}
              style={{ color: INK }}
            >
              {PHONE}
            </a>
            <button
              onClick={() => go('panta')}
              className={`inline-flex min-h-[44px] items-center rounded-full px-6 font-sans text-[14px] font-bold ${FOCUS}`}
              style={{ background: ACCENT, color: INK }}
            >
              Panta borð
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO — THE SIGNATURE: the approach across the harbour.                  */
/*  A 230vh band. A sticky stage holds the dusk water while the real        */
/*  yellow house scales from a small framed panel on the shore to a         */
/*  full-bleed arrival at the red door. Ordinary scroll, never locked:      */
/*  the headline block scrolls away in normal flow, and every scrubbed      */
/*  property is a raw MotionValue (no CSS transitions on them, #19).        */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const houseScale = useTransform(scrollYProgress, [0, 0.62, 1], [0.38, 1.02, 1.34])
  const houseY = useTransform(scrollYProgress, [0, 0.62, 1], ['11%', '0%', '0%'])
  const houseRadius = useTransform(scrollYProgress, [0, 0.55], [36, 0])
  const waterScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const duskOpacity = useTransform(scrollYProgress, [0, 0.7], [0.34, 0.72])
  const textOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.16], [0, -48])

  const stagger = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(22px)',
          filter: mounted ? 'blur(0px)' : 'blur(8px)',
          transition: `opacity .8s ${EASE} ${120 + i * 110}ms, transform .8s ${EASE} ${120 + i * 110}ms, filter .8s ${EASE} ${120 + i * 110}ms`,
        }

  /* Reduced-motion swaps the backdrop for the bright yellow exterior photo,
   * so ACCENT (also yellow) on the eyebrow/h1b would collide there — fall
   * back to cream in that branch only (ledger contrast fix). */
  const heroAccentColor = reduced ? CREAM_ON_DARK : ACCENT

  const headline = (
    <>
      <p className="font-mono text-[12px] font-bold uppercase tracking-[0.22em]" style={{ ...stagger(0), color: heroAccentColor }}>
        {HERO.eyebrow}
      </p>
      <h1
        className="mt-5 font-display font-semibold"
        style={{ color: '#F7F1E2', fontSize: 'clamp(2.5rem,7.2vw,5.2rem)', lineHeight: 1.16, letterSpacing: '-0.015em' }}
      >
        <span className="block" style={stagger(1)}>
          {HERO.h1a}
        </span>
        <span className="block italic" style={{ ...stagger(2), color: heroAccentColor }}>
          {HERO.h1b}
        </span>
      </h1>
      <p className="mt-6 max-w-[44ch] font-sans text-[15.5px] leading-[1.65]" style={{ ...stagger(3), color: CREAM_ON_DARK }}>
        {HERO.sub}
      </p>
      <p className="mt-5 font-mono text-[12.5px] tracking-[0.04em]" style={{ ...stagger(4), color: CREAM_ON_DARK }}>
        {HERO.hoursLine}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4" style={stagger(5)}>
        <a
          href={PHONE_HREF}
          className={`na-cta inline-flex min-h-[50px] items-center rounded-full px-7 font-sans text-[15px] font-bold ${FOCUS_DARK}`}
          style={{ background: ACCENT, color: INK }}
        >
          {HERO.ctaCall}
        </a>
        <button
          onClick={() => goTo('panta')}
          className={`inline-flex min-h-[50px] items-center rounded-full border px-7 font-sans text-[15px] font-semibold ${FOCUS_DARK}`}
          style={{ borderColor: 'rgba(247,241,226,.45)', color: CREAM_ON_DARK }}
        >
          {HERO.ctaTable}
        </button>
      </div>
    </>
  )

  /* Reduced motion: one calm viewport, the real house, everything visible. */
  if (reduced) {
    return (
      <header className="relative" style={{ background: DUSK }}>
        <div className="relative min-h-[100svh] overflow-hidden">
          <Img
            src={IMG.exterior}
            srcSet={IMG.exteriorSrcSet}
            sizes="100vw"
            alt={HERO.houseAlt}
            fetchpriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#3E6478] to-[#0B141B]"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(11,20,27,.82), rgba(11,20,27,.6))' }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-20 pt-28 md:px-8">
            <div className="max-w-[640px]">{headline}</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="relative" style={{ background: DUSK }}>
      <div ref={wrapRef} className="relative h-[230vh]">
        {/* STAGE — the sticky viewport the walk happens inside */}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* dusk water, mount-triggered entrance (full-bleed bg = eager, #12) */}
          <motion.div className="absolute inset-0" style={{ scale: waterScale }}>
            <Img
              src={u(UIMG.dockDusk, 2000)}
              srcSet={srcSet(UIMG.dockDusk)}
              sizes="100vw"
              alt=""
              aria-hidden
              fetchpriority="high"
              loading="eager"
              className="h-full w-full object-cover"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 1.3s ${EASE}`,
                filter: 'saturate(.82) brightness(.9)',
              }}
              fallbackClassName="bg-gradient-to-b from-[#22384A] to-[#0B141B]"
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: duskOpacity, background: DUSK }}
            aria-hidden
          />

          {/* THE HOUSE — one real asset, scroll-scaled from shore to doorstep */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              scale: houseScale,
              y: houseY,
              borderRadius: houseRadius,
              transformOrigin: '52% 62%',
              boxShadow: '0 34px 90px rgba(0,0,0,.5)',
            }}
          >
            <Img
              src={IMG.exterior}
              srcSet={IMG.exteriorSrcSet}
              sizes="100vw"
              alt={HERO.houseAlt}
              fetchpriority="high"
              loading="eager"
              className="h-full w-full object-cover"
              style={{
                objectPosition: '58% 46%',
                opacity: mounted ? 1 : 0,
                transition: `opacity 1.1s ${EASE} .35s`,
              }}
              fallbackClassName="bg-gradient-to-br from-[#F0B429] to-[#877720]"
            />
          </motion.div>
        </div>

        {/* HEADLINE — normal flow over the first viewport; scrolls away as
            the visitor starts walking. Phone + hours live here at 0%. */}
        <motion.div
          className="absolute inset-x-0 top-0 z-10 flex h-[100svh] items-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="pointer-events-none mx-auto w-full max-w-6xl px-5 pt-14 md:px-8">
            <div
              className="pointer-events-auto max-w-[620px] rounded-[24px] p-5 sm:p-7"
              style={{ background: 'rgba(11,20,27,.5)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
            >
              {headline}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  2 · SOUP — the door opens onto the signature dish                       */
/* ══════════════════════════════════════════════════════════════════════ */
function SoupSection() {
  return (
    <section id="supan" style={{ background: GROUND }} className="py-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: INK }}>
                {SOUP.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-4 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(2rem,4.4vw,3.3rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
              >
                {SOUP.heading}
              </h2>
            </Reveal>
            <Reveal delay={140} as="p" className="mt-6 max-w-[52ch] font-sans text-[16px] leading-[1.7]" style={{ color: INK }}>
              {SOUP.body1}
            </Reveal>
            <Reveal delay={190} as="p" className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.7]" style={{ color: MUTED }}>
              {SOUP.body2}
            </Reveal>
            <Reveal delay={250}>
              <figure className="m-0 mt-8 rounded-[16px] p-5" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                <blockquote className="font-sans text-[15.5px] italic leading-[1.6]" style={{ color: INK }}>
                  “{SOUP.quote}”
                </blockquote>
                <figcaption className="mt-3 font-mono text-[11.5px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                  {SOUP.quoteName} · {SOUP.quoteSource}
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={310}>
              <div className="mt-7">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  {SOUP.priceLabel}
                </p>
                <p className="mt-1 font-mono text-[clamp(1.4rem,3vw,1.9rem)] font-bold tabular-nums" style={{ color: INK }}>
                  {SOUP.priceValue}
                  <span
                    className="ml-3 inline-block h-[3px] w-14 translate-y-[-6px] rounded-full"
                    style={{ background: SOUPC }}
                    aria-hidden
                  />
                </p>
                <p className="mt-2 font-sans text-[12.5px]" style={{ color: MUTED }}>
                  {SOUP.priceNote}
                </p>
              </div>
            </Reveal>
          </div>
          <div>
            <ClipImg
              src={IMG.soup}
              alt={SOUP.imgAlt}
              className="aspect-[4/5] w-full rounded-[16px]"
              fallbackClassName="bg-gradient-to-br from-[#D97B3F] to-[#7b4a25]"
            />
            <Reveal delay={420}>
              <p className="mt-3 font-mono text-[11.5px]" style={{ color: MUTED }}>
                Fiskisúpan á útiborði fyrir framan húsið. Mynd staðarins.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  3 · MENU — the day's placard, real dishes, honest small print           */
/* ══════════════════════════════════════════════════════════════════════ */
function MenuSection() {
  return (
    <section id="matsedill" style={{ background: GROUND }} className="pb-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="max-w-[640px] font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(2rem,4.2vw,3.1rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
          >
            {MENU.heading}
          </h2>
        </Reveal>
        <Reveal delay={90} as="p" className="mt-5 max-w-[62ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: MUTED }}>
          {MENU.intro}
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* the placard — set like the black fish sign on the lawn */}
          <Reveal className="rounded-[16px] p-7 sm:p-9" style={{ background: INK, border: '1px solid rgba(247,241,226,.1)' }}>
            <div className="flex items-center justify-between gap-4">
              <FishMark size={40} />
              <span className="font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: 'rgba(247,241,226,.55)' }}>
                seafood restaurant
              </span>
            </div>
            {MENU.groups.map((g, gi) => (
              <div key={g.title} className={gi === 0 ? 'mt-8' : 'mt-9'}>
                <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                  {g.title}
                </h3>
                <ul className="mt-3 list-none p-0">
                  {g.items.map((it, i) => (
                    <Reveal
                      as="li"
                      key={it.name}
                      delay={60 + i * 55}
                      y={10}
                      className={i === 0 ? 'py-2.5' : 'border-t py-2.5'}
                      style={{ borderColor: 'rgba(247,241,226,.1)' }}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <span className="font-display text-[19px] font-medium" style={{ color: CREAM_ON_DARK }}>
                          {it.name}
                        </span>
                        <span className="font-sans text-[13px]" style={{ color: 'rgba(247,241,226,.6)' }}>
                          {it.note}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          <div className="lg:sticky lg:top-24">
            <ClipImg
              src={IMG.salmon}
              alt={MENU.imgAlt}
              className="aspect-[4/5] w-full rounded-[16px]"
              delay={120}
              fallbackClassName="bg-gradient-to-br from-[#c9bfa3] to-[#7b7259]"
            />
            <Reveal delay={260}>
              <p className="mt-3 font-mono text-[11.5px]" style={{ color: MUTED }}>
                Grillaður lax af matseðlinum. Mynd staðarins.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <p
                className="mt-6 rounded-[16px] p-5 font-sans text-[13.5px] leading-[1.65]"
                style={{ background: CARD, border: `1px solid ${HAIRLINE}`, color: MUTED }}
              >
                {MENU.smallPrint}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  4 · ROPE — one quiet mariner texture band, pure texture, not a gauge    */
/* ══════════════════════════════════════════════════════════════════════ */
function RopeDivider() {
  return (
    <div aria-hidden className="relative h-[110px] overflow-hidden md:h-[150px]">
      <Img
        src={u(UIMG.rope, 1800)}
        srcSet={srcSet(UIMG.rope)}
        sizes="100vw"
        alt=""
        className="h-full w-full object-cover"
        style={{ filter: 'saturate(.6) brightness(.92)' }}
        fallbackClassName="bg-[#8a8272]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(247,241,226,.3), transparent 32%, transparent 68%, rgba(247,241,226,.3))',
        }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  5 · STORY — the 1931 house Sel and the two sisters-in-law               */
/* ══════════════════════════════════════════════════════════════════════ */
function StorySection() {
  return (
    <section id="sagan" style={{ background: GROUND }} className="py-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-2">
          <ClipImg
            src={IMG.interior}
            alt={STORY.imgAlt}
            className="aspect-[4/5] w-full rounded-[16px]"
            fallbackClassName="bg-gradient-to-br from-[#9aa68f] to-[#4a5245]"
          />
          <div>
            <Reveal>
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: HARBOUR }}>
                {STORY.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-4 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.8rem)', lineHeight: 1.18, letterSpacing: '-0.01em' }}
              >
                {STORY.heading}
              </h2>
            </Reveal>
            <Reveal delay={150} as="p" className="mt-6 max-w-[54ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: INK }}>
              {STORY.body1}
            </Reveal>
            <Reveal delay={210} as="p" className="mt-4 max-w-[54ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: MUTED }}>
              {STORY.body2}
            </Reveal>
          </div>
        </div>

        {/* the walk in years — plainly counted facts, no invented meters */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-9 md:grid-cols-4" style={{ borderColor: HAIRLINE }}>
          {STORY.timeline.map((t2, i) => (
            <Reveal key={t2.year} delay={i * 90} y={14}>
              <div className="font-mono text-[clamp(1.3rem,2.4vw,1.7rem)] font-bold tabular-nums" style={{ color: INK }}>
                {t2.year}
              </div>
              <div className="mt-1.5 font-sans text-[13px] leading-snug" style={{ color: MUTED }}>
                {t2.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  6 · REVIEWS — real quotes, honest sourcing                              */
/* ══════════════════════════════════════════════════════════════════════ */
function ReviewsSection() {
  return (
    <section style={{ background: GROUND }} className="pb-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="max-w-[560px] font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(2rem,4.2vw,3.1rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
          >
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <Reveal delay={90} as="p" className="mt-5 max-w-[58ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: MUTED }}>
          {REVIEWS.body}
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.quotes.map((q, i) => (
            <Reveal
              key={q.name}
              delay={i * 110}
              className="na-card flex flex-col rounded-[16px] p-6"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
            >
              <p className="flex-1 font-sans text-[15px] italic leading-[1.6]" style={{ color: INK }}>
                “{q.text}”
              </p>
              <div className="mt-5 border-t pt-3.5" style={{ borderColor: HAIRLINE }}>
                <div className="font-sans text-[13.5px] font-bold" style={{ color: INK }}>
                  {q.name}
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                  {q.source}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={340}>
          <p className="mt-5 font-sans text-[12px]" style={{ color: MUTED }}>
            {REVIEWS.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  7 · LANTERN — hours as a window that is actually lit right now          */
/* ══════════════════════════════════════════════════════════════════════ */
function LanternSection() {
  const open = useOpenNow()
  const reduced = useReducedMotion()
  return (
    <section id="opid" style={{ background: NIGHT }} className="py-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-12 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-[420px]">
            <ClipImg
              src={u(UIMG.windowGlow, 1400)}
              imgSrcSet={srcSet(UIMG.windowGlow)}
              sizes="(max-width:768px) 90vw, 420px"
              alt={LANTERN.imgAlt}
              className="aspect-[3/4] w-full rounded-[16px]"
              fallbackClassName="bg-gradient-to-b from-[#2a2313] to-[#05070a]"
            />
            {/* live glow, driven by the verified hours against Iceland time */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 rounded-[16px] ${open && !reduced ? 'na-lantern' : ''}`}
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 52%, rgba(240,180,41,.42), transparent 68%)',
                opacity: open ? 1 : 0,
                transition: 'opacity 1.2s ease',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{ background: 'rgba(5,8,12,.62)', opacity: open ? 0 : 1, transition: 'opacity 1.2s ease' }}
            />
          </div>

          <div>
            <Reveal>
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                {LANTERN.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-4 font-display font-semibold"
                style={{ color: CREAM_ON_DARK, fontSize: 'clamp(2rem,4.2vw,3.1rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
              >
                {LANTERN.heading}
              </h2>
            </Reveal>
            <Reveal delay={140} as="p" className="mt-5 max-w-[50ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: CREAM_DIM }}>
              {LANTERN.body}
            </Reveal>

            <Reveal delay={200}>
              <div
                className="mt-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2"
                style={{ borderColor: open ? 'rgba(240,180,41,.5)' : 'rgba(247,241,226,.25)' }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: open ? ACCENT : 'rgba(247,241,226,.35)' }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[12.5px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: open ? ACCENT : CREAM_DIM }}
                >
                  {open ? LANTERN.openNow : LANTERN.closedNow} · {open ? LANTERN.closesAt : LANTERN.opensAt}
                </span>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p
                className="mt-7 font-mono font-bold tabular-nums"
                style={{ color: CREAM_ON_DARK, fontSize: 'clamp(1.8rem,4.6vw,3rem)', lineHeight: 1.2 }}
              >
                {LANTERN.hours}
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-7 flex flex-col gap-2.5">
                <a
                  href={PHONE_HREF}
                  className={`w-fit font-mono text-[clamp(1.5rem,3.6vw,2.2rem)] font-bold underline-offset-[6px] hover:underline ${FOCUS_DARK}`}
                  style={{ color: ACCENT }}
                >
                  {PHONE}
                </a>
                <p className="font-sans text-[15px]" style={{ color: CREAM_DIM }}>
                  {ADDRESS}
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className={`w-fit font-sans text-[14.5px] underline underline-offset-[3px] ${FOCUS_DARK}`}
                  style={{ color: CREAM_DIM }}
                >
                  {EMAIL}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  8 · RESERVATIONS — a note under the door, honestly a request            */
/* ══════════════════════════════════════════════════════════════════════ */
type NoteDraft = { name: string; contact: string; guests: string; when: string; message: string }
const EMPTY_NOTE: NoteDraft = { name: '', contact: '', guests: '', when: '', message: '' }

function ReserveSection() {
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_NOTE)
  const [sent, setSent] = useState<NoteDraft | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent({ ...draft }) // snapshot at submit (ledger #25)
  }

  const mailto = sent
    ? `mailto:${EMAIL}?subject=${encodeURIComponent('Borðapöntun á Naustinu')}&body=${encodeURIComponent(
        `Nafn: ${sent.name}\nSamband: ${sent.contact}\nFjöldi gesta: ${sent.guests}\nDagur og tími: ${sent.when}\nSkilaboð: ${sent.message}`,
      )}`
    : `mailto:${EMAIL}`

  const field = (
    key: keyof NoteDraft,
    label: string,
    opts?: { textarea?: boolean; required?: boolean; half?: boolean },
  ) => (
    <div className={opts?.half ? '' : 'sm:col-span-2'}>
      <label
        htmlFor={`na-${key}`}
        className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color: MUTED }}
      >
        {label}
      </label>
      {opts?.textarea ? (
        <textarea
          id={`na-${key}`}
          rows={3}
          value={draft[key]}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          className="na-input min-h-[44px] w-full rounded-[12px] px-3.5 py-3 font-sans text-[15px]"
        />
      ) : (
        <input
          id={`na-${key}`}
          type="text"
          required={opts?.required}
          value={draft[key]}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          className="na-input min-h-[44px] w-full rounded-[12px] px-3.5 py-3 font-sans text-[15px]"
        />
      )}
    </div>
  )

  return (
    <section id="panta" style={{ background: GROUND }} className="py-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-stretch gap-x-14 gap-y-10 md:grid-cols-2">
          <div className="relative hidden md:block">
            <ClipImg
              src={u(UIMG.tableNote, 1400)}
              imgSrcSet={srcSet(UIMG.tableNote)}
              sizes="(max-width:768px) 100vw, 50vw"
              alt={RESERVE.imgAlt}
              className="h-full min-h-[520px] w-full rounded-[16px]"
              fallbackClassName="bg-gradient-to-br from-[#4a3928] to-[#1c130b]"
            />
          </div>

          <div>
            <Reveal>
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: HARBOUR }}>
                {RESERVE.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-4 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(2rem,4.2vw,3rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
              >
                {RESERVE.heading}
              </h2>
            </Reveal>
            <Reveal delay={140} as="p" className="mt-5 max-w-[52ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: MUTED }}>
              {RESERVE.body}
            </Reveal>

            <Reveal delay={200}>
              {sent ? (
                <div className="mt-8 rounded-[16px] p-6 sm:p-7" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                  <h3 className="font-display text-[24px] font-semibold" style={{ color: INK }}>
                    {RESERVE.successHeading}
                  </h3>
                  <p className="mt-2 font-sans text-[14.5px] leading-[1.65]" style={{ color: MUTED }}>
                    {RESERVE.successBody}
                  </p>
                  <div className="mt-5 space-y-1.5 border-t pt-4 font-sans text-[14px]" style={{ borderColor: HAIRLINE, color: INK }}>
                    {sent.name && (
                      <div>
                        {RESERVE.fields.name}: <strong>{sent.name}</strong>
                      </div>
                    )}
                    {sent.contact && (
                      <div>
                        {RESERVE.fields.contact}: <strong>{sent.contact}</strong>
                      </div>
                    )}
                    {sent.guests && (
                      <div>
                        {RESERVE.fields.guests}: <strong>{sent.guests}</strong>
                      </div>
                    )}
                    {sent.when && (
                      <div>
                        {RESERVE.fields.when}: <strong>{sent.when}</strong>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={mailto}
                      className={`na-cta inline-flex min-h-[46px] items-center rounded-full px-6 font-sans text-[14px] font-bold ${FOCUS}`}
                      style={{ background: INK, color: GROUND }}
                    >
                      {RESERVE.successMail}
                    </a>
                    <a
                      href={PHONE_HREF}
                      className={`inline-flex min-h-[46px] items-center rounded-full border px-6 font-sans text-[14px] font-semibold ${FOCUS}`}
                      style={{ borderColor: 'rgba(33,29,20,.3)', color: INK }}
                    >
                      {RESERVE.successCall}
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setSent(null)
                      setDraft(EMPTY_NOTE)
                    }}
                    className={`mt-4 font-sans text-[13px] underline underline-offset-[3px] ${FOCUS}`}
                    style={{ color: MUTED }}
                  >
                    Skrifa nýjan miða
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="mt-8 rounded-[16px] p-6 sm:p-7"
                  style={{ background: CARD, border: `1px solid ${HAIRLINE}`, boxShadow: '0 14px 44px rgba(33,29,20,.08)' }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field('name', RESERVE.fields.name, { required: true, half: true })}
                    {field('contact', RESERVE.fields.contact, { required: true, half: true })}
                    {field('guests', RESERVE.fields.guests, { half: true })}
                    {field('when', RESERVE.fields.when, { half: true })}
                    {field('message', RESERVE.fields.message, { textarea: true })}
                  </div>
                  <button
                    type="submit"
                    className={`na-cta mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-7 font-sans text-[15px] font-bold sm:w-auto ${FOCUS}`}
                    style={{ background: ACCENT, color: INK }}
                  >
                    {RESERVE.submit}
                  </button>
                  <p className="mt-4 font-sans text-[12.5px] leading-[1.6]" style={{ color: MUTED }}>
                    {RESERVE.disclaimer}
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  9 · FIND US — address, region context, honestly captioned atmosphere    */
/* ══════════════════════════════════════════════════════════════════════ */
function FindSection() {
  return (
    <section id="stadsetning" style={{ background: GROUND }} className="pb-[clamp(72px,10vw,132px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="max-w-[560px] font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(2rem,4.2vw,3.1rem)', lineHeight: 1.18, letterSpacing: '-0.01em' }}
          >
            {FIND.heading}
          </h2>
        </Reveal>
        <Reveal delay={90} as="p" className="mt-5 max-w-[62ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: MUTED }}>
          {FIND.body}
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
          <figure className="m-0">
            <ClipImg
              src={u(UIMG.harbourTown, 1800)}
              imgSrcSet={srcSet(UIMG.harbourTown)}
              sizes="(max-width:768px) 100vw, 62vw"
              alt={FIND.harbourAlt}
              className="aspect-[16/10] w-full rounded-[16px]"
              fallbackClassName="bg-gradient-to-br from-[#3E6478] to-[#1d3341]"
            />
            <figcaption className="mt-3 font-mono text-[11.5px]" style={{ color: MUTED }}>
              {FIND.harbourCaption}
            </figcaption>
          </figure>

          <div className="flex flex-col gap-6">
            <Reveal delay={140} className="rounded-[16px] p-6" style={{ background: HARBOUR }}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(247,241,226,.92)' }}>
                {FIND.addressLabel}
              </p>
              <p className="mt-3 font-display text-[clamp(1.4rem,2.4vw,1.7rem)] font-semibold leading-[1.3]" style={{ color: '#F7F1E2' }}>
                Ásgarðsvegur 1<br />
                640 Húsavík
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className={`na-cta mt-5 inline-flex min-h-[44px] items-center rounded-full px-6 font-sans text-[13.5px] font-bold ${FOCUS_DARK}`}
                style={{ background: GROUND, color: INK }}
              >
                {FIND.mapsCta}
              </a>
            </Reveal>

            <Reveal
              delay={220}
              as="figure"
              className="m-0 flex-1 overflow-hidden rounded-[16px]"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
            >
              <ClipImg
                src={u(UIMG.puffin, 1200)}
                imgSrcSet={srcSet(UIMG.puffin)}
                sizes="(max-width:768px) 100vw, 32vw"
                alt={FIND.puffinAlt}
                className="aspect-[16/9] w-full"
                delay={120}
                fallbackClassName="bg-gradient-to-br from-[#7d8a93] to-[#3c464d]"
              />
              <figcaption className="p-4 font-sans text-[13.5px] leading-snug" style={{ color: MUTED }}>
                {FIND.puffinCaption}
              </figcaption>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  10 · CLOSING — the yellow band, the real sign, the honesty note         */
/* ══════════════════════════════════════════════════════════════════════ */
function ClosingSection() {
  return (
    <>
      <section style={{ background: ACCENT }} className="py-[clamp(64px,9vw,110px)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <Reveal>
              <h2
                className="font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(2.1rem,4.6vw,3.4rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
              >
                {CLOSING.heading}
              </h2>
            </Reveal>
            <Reveal delay={90} as="p" className="mt-4 max-w-[46ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: 'rgba(33,29,20,.78)' }}>
              {CLOSING.sub}
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={PHONE_HREF}
                  className={`na-cta inline-flex min-h-[52px] items-center rounded-full px-8 font-mono text-[16px] font-bold ${FOCUS}`}
                  style={{ background: INK, color: GROUND }}
                >
                  {PHONE}
                </a>
                <span className="font-mono text-[13px] font-bold" style={{ color: INK }}>
                  {ADDRESS} · 11:30–21:30
                </span>
              </div>
            </Reveal>
          </div>

          {/* the facade sign, rebuilt as it hangs on the house */}
          <Reveal
            delay={220}
            className="shrink-0 rounded-[14px] px-9 py-7 text-center"
            style={{ background: INK, boxShadow: '0 22px 60px rgba(33,29,20,.35)' }}
          >
            <div className="flex justify-center">
              <FishMark size={64} />
            </div>
            <div className="mt-2 font-display text-[34px] font-semibold lowercase italic leading-none" style={{ color: CREAM_ON_DARK }}>
              naustið
            </div>
            <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.3em]" style={{ color: 'rgba(247,241,226,.65)' }}>
              seafood restaurant
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: GROUND }} className="px-5 py-10 md:px-8">
        <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.65]" style={{ color: MUTED }}>
          {DISCLAIMER}{' '}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
            {EMAIL}
          </a>{' '}
          · {PHONE} · {ADDRESS}.
        </p>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  STICKY MOBILE CTA                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function StickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', background: INK }}
    >
      <a
        href={PHONE_HREF}
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14.5px] font-bold ${FOCUS_DARK}`}
        style={{ background: ACCENT, color: INK }}
      >
        Hringja · {PHONE}
      </a>
      <button
        onClick={() => goTo('panta')}
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14.5px] font-bold ${FOCUS_DARK}`}
        style={{ color: CREAM_ON_DARK }}
      >
        Panta borð
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Page() {
  useEffect(() => {
    document.title = 'Naustið · Sjávarréttir við höfnina á Húsavík'
    setThemeColor(DUSK)
    return () => setThemeColor('#0a1320')
  }, [])

  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
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
  }, [])

  return (
    <div lang="is" className="font-sans overflow-x-clip" style={{ background: GROUND, color: INK }}>
      <style>{`
        #na-root ::selection { background:${ACCENT}; color:${INK}; }

        .na-navlink { position:relative; }
        .na-navlink::after {
          content:''; position:absolute; left:0; right:100%; bottom:-4px; height:2px;
          background:${ACCENT}; transition:right .3s ${EASE};
        }
        .na-navlink:hover::after { right:0; }

        .na-cta { transition:transform .16s ease, filter .25s ease; }
        .na-cta:hover { filter:brightness(.94); }
        .na-cta:active { transform:scale(.98); }

        .na-card { transition:transform .45s ${EASE}, box-shadow .45s ${EASE}; }
        @media (hover:hover) and (pointer:fine) {
          .na-card:hover { transform:translateY(-4px); box-shadow:0 18px 44px rgba(33,29,20,.12); }
        }

        .na-input {
          background:#FFFFFF; border:1px solid rgba(33,29,20,.28); color:${INK};
          transition:border-color .2s ease, box-shadow .2s ease;
        }
        .na-input:focus { outline:none; border-color:${HARBOUR}; box-shadow:0 0 0 3px rgba(62,100,120,.24); }

        @media (prefers-reduced-motion: no-preference) {
          .na-lantern { animation: na-lantern 5.5s ease-in-out infinite alternate; }
          @keyframes na-lantern {
            from { opacity:.72; }
            to { opacity:1; }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .na-navlink::after, .na-cta, .na-card { transition:none !important; }
          .na-lantern { animation:none !important; }
        }
      `}</style>
      <div id="na-root">
        <PreviewChrome company={company} />
        <TopNav />
        <main>
          <Hero />
          <SoupSection />
          <MenuSection />
          <RopeDivider />
          <StorySection />
          <ReviewsSection />
          <LanternSection />
          <ReserveSection />
          <FindSection />
          <ClosingSection />
        </main>
        <div className="h-[54px] md:hidden" aria-hidden />
        <PreviewFooter company={company} />
        <div className="h-[54px] md:hidden" aria-hidden />
        <StickyCta />
      </div>
    </div>
  )
}
