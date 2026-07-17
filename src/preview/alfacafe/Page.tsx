import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS_LINES,
  ADDRESS_NOTE,
  AV,
  CLOSING,
  DISTANCE_NOTE,
  EMAIL,
  FOLKLORE,
  HERO,
  HONESTY,
  LANTERN,
  MAPS_URL,
  MENU,
  NAV,
  OPEN_BAND,
  PHONE,
  PHONE_HREF,
  PRACTICAL,
  PUFFINS,
  REVIEWS,
  SEASON,
  STORY,
  variantSet,
} from './data'

const company = getPreviewCompany('alfacafe')

/* ══════════════════════════════════════════════════════════════════════════
   "Á mörkum heima" — Álfacafé, Bakkagerði.
   The café as the lit doorway between the human village and Álfaborg.

   Palette (AA-checked):
     GROUND #F2E9D8 parchment · INK #23301F on GROUND 13.8:1 (AAA)
     AMBER  #C97A2E — large glyphs/rules on GROUND only; on INK it is only
            4.17:1, which fails AA for normal text, so CTA/link TEXT on INK
            uses AMBER_ON_INK (#E2A25C, 6.3:1) instead — see const below.
     AMBER_INK #8F5418 on GROUND ≈ 5.6:1 (small amber-toned labels)
     DUSK   #3A4A52 — the hidden-world band; GROUND text on DUSK 8.6:1 (AAA)
     MUTED  #4E5947 on GROUND ≈ 7.2:1
   ══════════════════════════════════════════════════════════════════════════ */
const GROUND = '#F2E9D8'
const SURFACE = '#F9F3E6' // slightly lifted section surface on parchment
const INK = '#23301F'
const MUTED = '#4E5947'
const AMBER = '#C97A2E'
const AMBER_INK = '#8F5418'
// Lighter ember for CTA/link TEXT set on INK: #E2A25C on #23301F = 6.3:1 (AA).
// AMBER itself only reaches 4.17:1 on INK, so it stays reserved for large
// glyphs/lantern/borders — never for normal-size text on an ink fill.
const AMBER_ON_INK = '#E2A25C'
const DUSK = '#3A4A52'
const DUSK_DEEP = '#2E3B42'
const HAIRLINE = 'rgba(35,48,31,.16)'
const PARCH_ON_DUSK = 'rgba(242,233,216,.86)'

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23301F]'
const FOCUS_ON_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2E9D8]'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal — IO + CSS transition (repo convention; framer whileInView stalls
   in this preview tooling). Reduced motion renders plainly. The failsafe is
   VIEWPORT-GATED per craft-ledger #25: it never force-shows below-fold nodes. */
function Reveal({
  children,
  delay = 0,
  y = 20,
  dur = 0.7,
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
  as?: 'div' | 'figure' | 'li' | 'section'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  const [settled, setSettled] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
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
      { rootMargin: '0px 0px -7% 0px', threshold: 0.15 },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  useEffect(() => {
    if (!shown || settled) return
    const t = window.setTimeout(() => setSettled(true), dur * 1000 + delay + 80)
    return () => window.clearTimeout(t)
  }, [shown, settled, dur, delay])
  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        settled
          ? { ...style, opacity: 1 }
          : {
              ...style,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${y}px)`,
              transition: `opacity ${dur}s ${EASE} ${delay}ms, transform ${dur}s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
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
    return () => io.disconnect()
  }, [threshold])
  return { ref, shown }
}

/* ── ClipPhoto — standalone content photo with an explicit aspect, revealing
   via clip-path. Observer sits on the UNtransformed wrapper (ledger #7);
   only the inner <img> clips/scales. Never used for full-bleed backgrounds. */
function ClipPhoto({
  src,
  srcSet,
  sizes,
  alt,
  aspectClass,
  caption,
  captionColor = MUTED,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  aspectClass: string
  caption?: string
  captionColor?: string
}) {
  const { ref, shown } = useInView(0.18)
  const [settled, setSettled] = useState(() => prefersReduced())
  useEffect(() => {
    if (!shown || settled) return
    const t = window.setTimeout(() => setSettled(true), 1050)
    return () => window.clearTimeout(t)
  }, [shown, settled])
  return (
    <figure className="m-0">
      <div ref={ref} className={`overflow-hidden rounded-[6px] ${aspectClass}`}>
        <Img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className="block h-full w-full object-cover"
          style={
            settled
              ? undefined
              : {
                  clipPath: shown ? 'inset(0 0 0 0)' : 'inset(10% 0 10% 0)',
                  transform: shown ? 'scale(1)' : 'scale(1.07)',
                  transition: `clip-path .95s ${EASE}, transform 1.05s ${EASE}`,
                }
          }
          fallbackClassName="bg-gradient-to-br from-[#cbbf9f] to-[#6d6a55]"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 font-sans text-[12px] leading-snug" style={{ color: captionColor }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ── Lugtin — the lantern glyph. Lit state is computed from the verified
   season window (4 May – 30 Sept), which IS the hours-conflict fix. ──────── */
function Lantern({ lit, size = 44, glow = true }: { lit: boolean; size?: number; glow?: boolean }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size * (34 / 26) }} aria-hidden>
      {lit && glow ? (
        <span
          className="ac-glow pointer-events-none absolute"
          style={{
            left: '50%',
            top: '58%',
            width: size * 1.7,
            height: size * 1.7,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(201,122,46,.55) 0%, rgba(201,122,46,.22) 42%, rgba(201,122,46,0) 70%)',
            filter: 'blur(2px)',
          }}
        />
      ) : null}
      <svg
        viewBox="0 0 26 34"
        width={size}
        height={size * (34 / 26)}
        fill="none"
        className="relative"
        style={{ display: 'block' }}
      >
        <path d="M9.5 5.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 8.5h9l-1.4 2.4h-6.2L8.5 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="8.9" y="10.9" width="8.2" height="12.2" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 23.1h10l1.2 3.4H6.8L8 23.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {lit ? (
          <path
            d="M13 13.4c1.35 1.75 2.05 2.95 2.05 4.15a2.05 2.05 0 1 1-4.1 0c0-1.2.7-2.4 2.05-4.15Z"
            fill={AMBER}
            className="ac-flame"
          />
        ) : (
          <path
            d="M13 19.2c.6-.9.6-2 .05-3"
            stroke="rgba(242,233,216,.55)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  )
}

/* ── EmberTrail — THE one scroll-linked signature. A 2px line down the left
   margin: bright amber at the hero, cooled to fjord-slate at the folklore
   band mid-page, warming back to amber by the practical-info block. Values
   are written raw per frame (manual scroll handler + rAF, no CSS transition
   on scrubbed values). Reduced motion renders the fully-resolved gradient. */
const AMBER_RGB: [number, number, number] = [201, 122, 46]
const DUSK_RGB: [number, number, number] = [90, 110, 120]

function EmberTrail({ reduced }: { reduced: boolean }) {
  const fillRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    const el = fillRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      const cool = 1 - Math.abs(p - 0.5) * 2 // 0 at both ends, 1 mid-page
      const r = Math.round(AMBER_RGB[0] + (DUSK_RGB[0] - AMBER_RGB[0]) * cool)
      const g = Math.round(AMBER_RGB[1] + (DUSK_RGB[1] - AMBER_RGB[1]) * cool)
      const b = Math.round(AMBER_RGB[2] + (DUSK_RGB[2] - AMBER_RGB[2]) * cool)
      el.style.transform = `scaleY(${Math.max(0.045, p)})`
      el.style.backgroundColor = `rgb(${r} ${g} ${b})`
      el.style.opacity = String(1 - cool * 0.4)
      el.style.boxShadow = `0 0 ${Math.round(9 - cool * 6)}px rgb(${r} ${g} ${b})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 top-0 z-30 w-[2px]"
      style={{ left: 'max(8px, calc((100vw - 1200px) / 2 - 40px))' }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(35,48,31,.1)' }} />
      {reduced ? (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${AMBER} 0%, #5A6E78 50%, ${AMBER} 100%)` }}
        />
      ) : (
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top"
          style={{ backgroundColor: AMBER, transform: 'scaleY(0.045)', boxShadow: `0 0 9px ${AMBER}` }}
        />
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   NAV — seamless over the hero photo, settles to parchment after scroll
   ══════════════════════════════════════════════════════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const solid = scrolled || menuOpen
  const linkColor = solid ? INK : GROUND
  const go = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? 'rgba(242,233,216,.94)' : 'transparent',
        borderBottom: `1px solid ${solid ? HAIRLINE : 'transparent'}`,
        backdropFilter: solid ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: solid ? 'blur(10px)' : undefined,
        transition: 'background .35s ease, border-color .35s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`font-display text-[19px] font-semibold ${solid ? FOCUS : FOCUS_ON_DARK}`}
          style={{ color: linkColor, letterSpacing: '-0.01em' }}
        >
          Álfacafé
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`ac-navlink font-sans text-[13.5px] font-medium ${solid ? FOCUS : FOCUS_ON_DARK}`}
              style={{ color: linkColor }}
            >
              {n.label}
            </button>
          ))}
          <a
            href={PHONE_HREF}
            className={`ac-btn inline-flex min-h-[38px] items-center gap-2 rounded-[4px] px-4 font-sans text-[13px] font-bold ${solid ? FOCUS : FOCUS_ON_DARK}`}
            style={{ background: INK, color: AMBER_ON_INK }}
          >
            <PhoneGlyph />
            {PHONE}
          </a>
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
          className={`grid h-11 w-11 place-items-center md:hidden ${solid ? FOCUS : FOCUS_ON_DARK}`}
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
          <a
            href={PHONE_HREF}
            className={`ac-btn mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[4px] font-sans text-[14px] font-bold ${FOCUS}`}
            style={{ background: INK, color: AMBER_ON_INK }}
          >
            <PhoneGlyph />
            {PHONE}
          </a>
        </div>
      )}
    </nav>
  )
}

function PhoneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   1 · HERO — the drive out. Full-bleed road photo, mount-triggered entrance
   (never whileInView for an absolute-inset background, ledger #12).
   ══════════════════════════════════════════════════════════════════════════ */
function Hero({ inSeason }: { inSeason: boolean }) {
  const [entered, setEntered] = useState(false)
  const [imgSettled, setImgSettled] = useState(() => prefersReduced())
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    const t = prefersReduced() ? undefined : window.setTimeout(() => setImgSettled(true), 1600)
    return () => {
      cancelAnimationFrame(raf)
      if (t) window.clearTimeout(t)
    }
  }, [])
  const reduced = prefersReduced()
  const step = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: entered ? 1 : 0,
          transform: entered ? 'none' : 'translateY(22px)',
          transition: `opacity .8s ${EASE} ${120 + i * 110}ms, transform .8s ${EASE} ${120 + i * 110}ms`,
        }
  return (
    <header
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      style={{ background: DUSK_DEEP }}
    >
      <Img
        src={AV('road-1280.jpg')}
        srcSet={variantSet('road')}
        sizes="100vw"
        alt={HERO.imgAlt}
        fetchpriority="high"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
        style={
          imgSettled || reduced
            ? { objectPosition: '50% 65%' }
            : {
                objectPosition: '50% 65%',
                filter: entered ? 'blur(0px)' : 'blur(18px)',
                transform: entered ? 'scale(1)' : 'scale(1.12)',
                transition: `filter 1.5s ${EASE}, transform 1.6s ${EASE}`,
              }
        }
        fallbackClassName="bg-gradient-to-b from-[#46555e] to-[#232c31]"
      />
      {/* dusk grade + text scrim */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,40,45,.42) 0%, rgba(30,40,45,.18) 38%, rgba(24,31,26,.62) 74%, rgba(24,31,26,.84) 100%)',
        }}
      />
      {/* dedicated nav scrim — independent of the grade above so the
          transparent-state TopNav (wordmark/hamburger/links) clears AA even
          when a bright sky crop sits at the very top of the photo (mobile) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(180deg, rgba(20,26,22,.55) 0%, rgba(20,26,22,0) 100%)' }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-[clamp(84px,12vh,128px)] pt-32 md:px-8">
        <div style={step(0)}>
          {/* open leading + no overflow mask: the Á accent must never clip (ledger #23) */}
          <h1
            className="m-0 font-display font-semibold"
            style={{
              color: GROUND,
              fontSize: 'clamp(2.7rem, 8.5vw, 5.4rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.015em',
              textShadow: '0 2px 22px rgba(20,26,22,.45)',
            }}
          >
            {HERO.h1}
          </h1>
        </div>
        <div style={step(1)}>
          <p
            className="mt-4 max-w-[38ch] font-sans text-[16px] leading-[1.6] md:text-[17.5px]"
            style={{ color: 'rgba(242,233,216,.94)' }}
          >
            {HERO.sub}
          </p>
        </div>
        <div style={step(2)} className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className={`ac-btn inline-flex min-h-[48px] items-center rounded-[4px] px-6 font-sans text-[14px] font-bold ${FOCUS_ON_DARK}`}
            style={{ background: INK, color: AMBER_ON_INK, border: '1px solid rgba(201,122,46,.4)' }}
          >
            {HERO.ctaDirections}
          </a>
          <button
            onClick={() =>
              document
                .getElementById('matsedill')
                ?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
            }
            className={`ac-btn inline-flex min-h-[48px] items-center rounded-[4px] px-6 font-sans text-[14px] font-semibold ${FOCUS_ON_DARK}`}
            style={{ background: 'rgba(242,233,216,.12)', color: GROUND, border: '1px solid rgba(242,233,216,.45)' }}
          >
            {HERO.ctaMenu}
          </button>
        </div>
        {/* Lugtin — the live season/hours utility, the page's honest core */}
        <div style={step(3)} className="mt-9">
          <div
            className="inline-flex max-w-full flex-wrap items-center gap-x-5 gap-y-3 rounded-[6px] px-5 py-4"
            style={{
              background: 'rgba(24,31,26,.66)',
              border: '1px solid rgba(242,233,216,.22)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <span style={{ color: inSeason ? AMBER : 'rgba(242,233,216,.7)' }}>
              <Lantern lit={inSeason} size={34} />
            </span>
            <div>
              <div
                className="font-mono text-[13px] font-bold tracking-[0.08em]"
                style={{ color: inSeason ? '#E2A25C' : 'rgba(242,233,216,.85)' }}
              >
                {inSeason ? LANTERN.litLabel : LANTERN.unlitLabel}
              </div>
              <div className="mt-0.5 font-mono text-[12px] tracking-[0.06em]" style={{ color: 'rgba(242,233,216,.75)' }}>
                {inSeason ? SEASON.rangeMono : LANTERN.unlitSub}
              </div>
            </div>
            <a
              href={PHONE_HREF}
              className={`inline-flex min-h-[44px] items-center font-sans text-[15px] font-bold underline-offset-4 hover:underline ${FOCUS_ON_DARK}`}
              style={{ color: GROUND }}
            >
              Sími {PHONE}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   2 · OPEN BAND — the hours-conflict fix in plain words + a giant phone
   ══════════════════════════════════════════════════════════════════════════ */
function OpenBand({ inSeason }: { inSeason: boolean }) {
  return (
    <section style={{ background: GROUND }} className="py-[clamp(52px,7vw,84px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-8 md:grid-cols-2">
          <div>
            <Reveal>
              <h2
                className="m-0 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,2.7rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
              >
                {OPEN_BAND.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 max-w-[52ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED }}>
                {OPEN_BAND.body}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-[52ch] font-sans text-[13.5px] font-medium leading-[1.6]" style={{ color: AMBER_INK }}>
                {LANTERN.confirmLine}
              </p>
            </Reveal>
          </div>
          <Reveal delay={120} className="md:justify-self-end">
            <div className="rounded-[6px] p-6 md:p-8" style={{ background: INK }}>
              <div className="flex items-center gap-3">
                <span style={{ color: inSeason ? AMBER : 'rgba(242,233,216,.6)' }}>
                  <Lantern lit={inSeason} size={30} />
                </span>
                <span className="font-mono text-[12.5px] font-bold tracking-[0.08em]" style={{ color: '#E2A25C' }}>
                  {inSeason ? LANTERN.litLabel : LANTERN.unlitLabel}
                </span>
              </div>
              <a
                href={PHONE_HREF}
                className={`mt-4 block font-display font-semibold leading-none ${FOCUS_ON_DARK}`}
                style={{ color: GROUND, fontSize: 'clamp(2.4rem,6vw,3.6rem)', letterSpacing: '-0.01em' }}
              >
                {PHONE}
              </a>
              <div className="mt-3 font-mono text-[12px] tracking-[0.05em]" style={{ color: 'rgba(242,233,216,.72)' }}>
                {SEASON.startLabel} – {SEASON.endLabel}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   3 · MENU — the soup leads; verified items only; a range, not a price list
   ══════════════════════════════════════════════════════════════════════════ */
function MenuSection() {
  return (
    <section id="matsedill" style={{ background: GROUND }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          <Reveal className="order-2 md:order-1">
            <ClipPhoto
              src={AV('soup-828.jpg')}
              srcSet={variantSet('soup')}
              sizes="(max-width:768px) 100vw, 50vw"
              alt={MENU.soupImgAlt}
              aspectClass="aspect-[4/5]"
              caption={MENU.soupCaption}
            />
          </Reveal>
          <div className="order-1 md:order-2">
            <Reveal>
              <h2
                className="m-0 max-w-[16ch] font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
              >
                {MENU.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 max-w-[54ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED }}>
                {MENU.body}
              </p>
            </Reveal>
            <ul className="mt-8 flex flex-col">
              {MENU.items.map((item, i) => (
                <Reveal
                  key={item.name}
                  as="li"
                  delay={i * 70}
                  y={14}
                  className="flex items-baseline justify-between gap-4 border-b py-3.5 first:border-t"
                  style={{ borderColor: HAIRLINE }}
                >
                  <span className="font-sans text-[15.5px] font-semibold" style={{ color: INK }}>
                    {item.name}
                  </span>
                  <span className="text-right font-sans text-[13px] leading-snug" style={{ color: MUTED }}>
                    {item.note}
                  </span>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={120}>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="font-display text-[1.5rem] font-semibold" style={{ color: INK }}>
                  {MENU.priceRange}
                </span>
                <span className="font-sans text-[13.5px] font-medium" style={{ color: AMBER_INK }}>
                  {MENU.vegNote}
                </span>
              </div>
              <p className="mt-2 font-sans text-[12.5px] leading-snug" style={{ color: MUTED }}>
                {MENU.disclaimer}
              </p>
            </Reveal>
          </div>
        </div>
        {/* the café's own food photos — small, native scale, honest */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {MENU.strip.map((ph, i) => (
              <Reveal key={ph.file} delay={i * 90} y={16}>
                <ClipPhoto src={AV(ph.file)} alt={ph.alt} aspectClass="aspect-square" />
              </Reveal>
            ))}
          </div>
          <Reveal delay={140}>
            <p className="mt-3 font-sans text-[12px]" style={{ color: MUTED }}>
              {MENU.stripCaption}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   4 · STORY — first to open each summer; shares its house with Alfa Stein
   ══════════════════════════════════════════════════════════════════════════ */
function StorySection() {
  return (
    <section
      id="sagan"
      style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
      className="py-[clamp(72px,10vw,128px)]"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          <div>
            <Reveal>
              <h2
                className="m-0 max-w-[18ch] font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
              >
                {STORY.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <blockquote className="m-0 mt-7 p-0">
                <p className="m-0 font-tall text-[1.45rem] italic leading-[1.4] md:text-[1.7rem]" style={{ color: INK }}>
                  „{STORY.quote}“
                </p>
                <footer className="mt-3 font-sans text-[12.5px]" style={{ color: MUTED }}>
                  {STORY.quoteSource}
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-7 max-w-[56ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: MUTED }}>
                {STORY.body1}
              </p>
              <p className="mt-4 max-w-[56ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: MUTED }}>
                {STORY.body2}
              </p>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal delay={80}>
              <ClipPhoto
                src={AV('fb-01-terrace.jpg')}
                alt={STORY.imgAlt}
                aspectClass="aspect-[4/3]"
                caption={STORY.imgCaption}
              />
            </Reveal>
            <Reveal delay={140} className="md:max-w-[70%] md:self-end">
              <ClipPhoto
                src={AV('fb-04-alfastein.jpg')}
                alt={STORY.stoneImgAlt}
                aspectClass="aspect-square"
                caption={STORY.stoneCaption}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   5 · FOLKLORE — the dusk band; the ember trail is coldest right here
   ══════════════════════════════════════════════════════════════════════════ */
function FolkloreSection() {
  return (
    <section id="alfaborg" style={{ background: DUSK }} className="py-[clamp(80px,11vw,140px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal>
            <h2
              className="m-0 font-display font-semibold"
              style={{ color: GROUND, fontSize: 'clamp(2rem,4.6vw,3.1rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
            >
              {FOLKLORE.heading}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="mx-auto mt-6 max-w-[26ch] font-tall text-[1.6rem] italic leading-[1.35] md:text-[2rem]"
              style={{ color: '#E2A25C' }}
            >
              „{FOLKLORE.pull}“
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p
              className="mx-auto mt-7 max-w-[62ch] text-left font-sans text-[15.5px] leading-[1.7] md:text-center"
              style={{ color: PARCH_ON_DUSK }}
            >
              {FOLKLORE.body1}
            </p>
            <p
              className="mx-auto mt-4 max-w-[62ch] text-left font-sans text-[15.5px] leading-[1.7] md:text-center"
              style={{ color: PARCH_ON_DUSK }}
            >
              {FOLKLORE.body2}
            </p>
          </Reveal>
        </div>
        <div className="mx-auto mt-12 grid max-w-[640px] grid-cols-2 gap-4 md:gap-6">
          {FOLKLORE.photos.map((ph, i) => (
            <Reveal key={ph.file} delay={i * 110} y={18}>
              <ClipPhoto
                src={AV(ph.file)}
                alt={ph.alt}
                aspectClass="aspect-square"
                caption={ph.caption}
                captionColor="rgba(242,233,216,.82)"
              />
            </Reveal>
          ))}
        </div>
        <Reveal delay={180}>
          <p className="mx-auto mt-4 max-w-[640px] font-sans text-[12px]" style={{ color: 'rgba(242,233,216,.78)' }}>
            {FOLKLORE.photoCredit}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   6 · PUFFINS — Hafnarhólmi, the other reason to make the drive
   ══════════════════════════════════════════════════════════════════════════ */
function PuffinSection() {
  return (
    <section id="lundar" style={{ background: GROUND }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-[1.05fr_1fr]">
          <div className="order-2 md:order-1">
            <Reveal>
              <h2
                className="m-0 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
              >
                {PUFFINS.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 max-w-[56ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: MUTED }}>
                {PUFFINS.body}
              </p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
              {PUFFINS.facts.map((f, i) => (
                <Reveal key={f.label} delay={i * 80} y={14}>
                  <div className="font-mono text-[15px] font-bold leading-snug" style={{ color: INK }}>
                    {f.value}
                  </div>
                  <div className="mt-1 font-sans text-[12.5px] leading-snug" style={{ color: MUTED }}>
                    {f.label}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={160}>
              <p className="mt-8 font-tall text-[1.35rem] italic leading-[1.4]" style={{ color: AMBER_INK }}>
                {PUFFINS.itinerary}
              </p>
            </Reveal>
            <Reveal delay={200} className="mt-8 md:max-w-[62%]">
              <ClipPhoto
                src={AV('puffin-detail-828.jpg')}
                srcSet={variantSet('puffin-detail')}
                sizes="(max-width:768px) 100vw, 30vw"
                alt={PUFFINS.detailAlt}
                aspectClass="aspect-[5/4]"
                caption={PUFFINS.detailCaption}
              />
            </Reveal>
          </div>
          <Reveal delay={80} className="order-1 md:order-2">
            <ClipPhoto
              src={AV('puffin-borgarfjordur-828.jpg')}
              srcSet={variantSet('puffin-borgarfjordur')}
              sizes="(max-width:768px) 100vw, 50vw"
              alt={PUFFINS.mainAlt}
              aspectClass="aspect-[4/5]"
              caption={PUFFINS.mainCaption}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   7 · REVIEWS — three real, attributed Google quotes + honest badges
   ══════════════════════════════════════════════════════════════════════════ */
function ReviewsSection() {
  return (
    <section style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }} className="py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="m-0 font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,2.7rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
          >
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <div className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
          {REVIEWS.badges.map((b, i) => (
            <Reveal key={b.label} delay={i * 80} y={14}>
              <div className="font-display text-[2rem] font-semibold leading-none" style={{ color: INK }}>
                {b.value}
              </div>
              <div className="mt-1.5 font-sans text-[12.5px] font-medium" style={{ color: MUTED }}>
                {b.label}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {REVIEWS.quotes.map((q, i) => (
            <Reveal
              key={q.name}
              delay={i * 100}
              y={18}
              className="flex flex-col justify-between rounded-[6px] p-6"
              style={{ background: GROUND, border: `1px solid ${HAIRLINE}` }}
            >
              <p className="m-0 font-sans text-[14.5px] leading-[1.62]" style={{ color: INK }} lang="en">
                “{q.text}”
              </p>
              <div
                className="mt-5 border-t pt-3 font-sans text-[13px] font-semibold"
                style={{ color: MUTED, borderColor: HAIRLINE }}
              >
                {q.name}
                <span className="font-normal"> · Google</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <p className="mt-5 font-sans text-[12px]" style={{ color: MUTED }}>
            {REVIEWS.sourceNote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   8 · PRACTICAL — the arrival. The second lantern ignites here: the ember
   trail's destination, beside the address and phone.
   ══════════════════════════════════════════════════════════════════════════ */
function PracticalSection({ inSeason }: { inSeason: boolean }) {
  const { ref, shown } = useInView(0.35)
  return (
    <section id="hvar" style={{ background: INK }} className="py-[clamp(80px,11vw,140px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div ref={ref} className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <span
            style={{
              color: inSeason ? AMBER : 'rgba(242,233,216,.6)',
              opacity: shown ? 1 : 0.25,
              transform: shown ? 'scale(1)' : 'scale(0.92)',
              transition: `opacity .9s ${EASE}, transform .9s ${EASE}`,
              display: 'inline-block',
            }}
          >
            <Lantern lit={inSeason} size={40} glow={shown} />
          </span>
          {/* Á with acute: open leading, no overflow mask (ledger #23) */}
          <h2
            className="m-0 font-display font-semibold"
            style={{ color: GROUND, fontSize: 'clamp(2.2rem,5vw,3.4rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
          >
            {PRACTICAL.heading}
          </h2>
        </div>
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          <Reveal>
            <div className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#E2A25C' }}>
              Heimilisfang
            </div>
            <address
              className="mt-3 font-display text-[1.5rem] font-medium not-italic leading-[1.35]"
              style={{ color: GROUND }}
            >
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-3 max-w-[46ch] font-sans text-[12.5px] leading-[1.55]" style={{ color: 'rgba(242,233,216,.62)' }}>
              {ADDRESS_NOTE}
            </p>
            <p className="mt-2 font-sans text-[13.5px] font-medium" style={{ color: 'rgba(242,233,216,.85)' }}>
              {DISTANCE_NOTE}
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-flex min-h-[44px] items-center font-sans text-[14px] font-bold underline underline-offset-4 ${FOCUS_ON_DARK}`}
              style={{ color: AMBER_ON_INK }}
            >
              Opna í kortum
            </a>
          </Reveal>
          <Reveal delay={90}>
            <div className="font-sans text-[12.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#E2A25C' }}>
              Sími og netfang
            </div>
            <a
              href={PHONE_HREF}
              className={`mt-3 block font-display font-semibold leading-none ${FOCUS_ON_DARK}`}
              style={{ color: GROUND, fontSize: 'clamp(2.2rem,5.5vw,3.2rem)', letterSpacing: '-0.01em' }}
            >
              {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className={`mt-3 inline-flex min-h-[44px] items-center font-sans text-[15px] font-medium underline-offset-4 hover:underline ${FOCUS_ON_DARK}`}
              style={{ color: 'rgba(242,233,216,.85)' }}
            >
              {EMAIL}
            </a>
            <div className="mt-7 font-sans text-[12.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#E2A25C' }}>
              {PRACTICAL.seasonLabel}
            </div>
            <div className="mt-2 font-display text-[1.5rem] font-medium" style={{ color: GROUND }}>
              {PRACTICAL.seasonValue}
            </div>
            <p className="mt-2 max-w-[46ch] font-sans text-[12.5px] leading-[1.55]" style={{ color: 'rgba(242,233,216,.62)' }}>
              {LANTERN.confirmLine}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   9 · CLOSING — the lit doorway, said plainly
   ══════════════════════════════════════════════════════════════════════════ */
function ClosingSection() {
  return (
    <section style={{ background: GROUND }} className="py-[clamp(80px,11vw,140px)]">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <h2
            className="m-0 font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(2.1rem,5vw,3.2rem)', lineHeight: 1.16, letterSpacing: '-0.01em' }}
          >
            {CLOSING.heading}
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <p className="mx-auto mt-4 max-w-[44ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED }}>
            {CLOSING.body}
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={PHONE_HREF}
            className={`ac-btn inline-flex min-h-[50px] items-center gap-2 rounded-[4px] px-7 font-sans text-[14.5px] font-bold ${FOCUS}`}
            style={{ background: INK, color: AMBER_ON_INK }}
          >
            <PhoneGlyph />
            {PRACTICAL.ctaCall} {PHONE}
          </a>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className={`ac-btn inline-flex min-h-[50px] items-center rounded-[4px] px-7 font-sans text-[14.5px] font-semibold ${FOCUS}`}
            style={{ background: 'transparent', color: INK, border: `1.5px solid ${INK}` }}
          >
            {PRACTICAL.ctaDirections}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ── mobile sticky CTA — call + directions, always reachable ─────────────── */
function StickyCall() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden"
      style={{
        background: INK,
        borderTop: '1px solid rgba(242,233,216,.18)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <a
        href={PHONE_HREF}
        className={`flex min-h-[54px] items-center justify-center gap-2 font-sans text-[14px] font-bold ${FOCUS_ON_DARK}`}
        style={{ color: AMBER_ON_INK, borderRight: '1px solid rgba(242,233,216,.18)' }}
      >
        <PhoneGlyph />
        {PRACTICAL.ctaCall}
      </a>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noreferrer"
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14px] font-bold ${FOCUS_ON_DARK}`}
        style={{ color: GROUND }}
      >
        Leiðbeiningar
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const [reduced] = useState(() => prefersReduced())
  const [inSeason] = useState(() => SEASON.isOpenSeason(new Date()))

  useEffect(() => {
    document.title = 'Álfacafé · Á mörkum heima'
    setThemeColor(DUSK_DEEP)
    return () => setThemeColor('#0a1320')
  }, [])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return (
    <div style={{ background: GROUND }} className="pb-[54px] md:pb-0">
      <style>{`
        .ac-navlink { position: relative; }
        .ac-navlink::after {
          content: ''; position: absolute; left: 0; bottom: -4px; height: 1.5px; width: 100%;
          background: currentColor; transform: scaleX(0); transform-origin: left;
          transition: transform .35s ${EASE};
        }
        .ac-navlink:hover::after { transform: scaleX(1); }
        .ac-btn { transition: transform .16s ${EASE}, opacity .25s ease; }
        .ac-btn:hover { opacity: .92; }
        .ac-btn:active { transform: scale(.98); }
        @keyframes ac-pulse { from { opacity: .8; } to { opacity: 1; } }
        .ac-glow { animation: ac-pulse 3s ease-in-out infinite alternate; }
        .ac-flame { animation: ac-pulse 3s ease-in-out infinite alternate; }
        ::selection { background: rgba(201,122,46,.32); }
        @media (prefers-reduced-motion: reduce) {
          .ac-glow, .ac-flame { animation: none !important; }
          .ac-btn, .ac-navlink::after { transition: none !important; }
        }
      `}</style>
      <PreviewChrome company={company} />
      <EmberTrail reduced={reduced} />
      <TopNav />
      <main lang="is">
        <Hero inSeason={inSeason} />
        <OpenBand inSeason={inSeason} />
        <MenuSection />
        <StorySection />
        <FolkloreSection />
        <PuffinSection />
        <ReviewsSection />
        <PracticalSection inSeason={inSeason} />
        <ClosingSection />
      </main>
      {/* honesty notes — required by the brief, plainly worded */}
      <section
        aria-label="Fyrirvarar"
        style={{ background: GROUND, borderTop: `1px solid ${HAIRLINE}` }}
        className="px-5 py-10 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {HONESTY.map((line) => (
            <p key={line.slice(0, 24)} className="m-0 font-sans text-[12px] leading-[1.6]" style={{ color: MUTED }}>
              {line}
            </p>
          ))}
        </div>
      </section>
      <PreviewFooter company={company} />
      <StickyCall />
    </div>
  )
}
