import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CUSTOM_SMOKING,
  EMAIL,
  FISHING_COPY,
  FISHING_CTA,
  FISHING_FACTS,
  HONESTY,
  HORSES_COPY,
  HORSES_CTA,
  IMG,
  LAND_ANCHORS,
  LAND_COPY,
  MAILTO,
  MUNICIPALITY,
  ORDER_LINE,
  OWNER,
  PHONE_1,
  PHONE_1_HREF,
  PHONE_2,
  PHONE_2_HREF,
  PLACES,
  PRICES,
  PRICES_LABEL,
  PRICES_NOTE,
  PRODUCT_CLAIM,
  PRODUCT_INTRO,
  SHEEP_COPY,
  SHEEP_FACTS,
  STAY_COPY,
  STAY_NOTE,
  STAY_PRICES,
  STAY_PRICES_LABEL,
  TAGLINE,
  TRUST_LINE,
  UIMG_EMBERS,
  UIMG_SMOKE,
  WALKS_COPY,
} from './data'
import type { PriceRow } from './data'

const company = getPreviewCompany('saudakofinn')

/* ── Palette (art-direction brief, all pairs AA-checked) ─────────────────────
 * CREAM #F3EEE3 ground · INK #221D17 on cream 14.45:1
 * CHARCOAL #24201B smoke chapter · CREAM ink on it 13.99:1
 * EMBER #A8481A on cream 5.03:1 (text OK) · EMBER_HI #C1531E on charcoal
 * 3.49:1 (large/bold + non-text only) · MOSS #57624A band, cream text on it */
const CREAM = '#F3EEE3'
const CHARCOAL = '#24201B'
const CHARCOAL_DEEP = '#1B1713'
const INK = '#221D17'
const EMBER = '#A8481A'
const EMBER_HI = '#C1531E'
const MOSS = '#57624A'
const TAN = '#A9855F'
const HAIR_DARK = 'rgba(243,238,227,.14)'
const HAIR_LIGHT = 'rgba(34,29,23,.14)'
const MUTED_ON_DARK = 'rgba(243,238,227,.72)'
const MUTED_ON_CREAM = 'rgba(34,29,23,.68)'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EEE3]'
const FOCUS_LIGHT =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221D17]'

/* Mobile menu links — mirrors the desktop nav (Verðskrá/Gisting/Hestar/Veiði/Samband) */
const NAV_LINKS: { href: string; label: string }[] = [
  { href: '#verdskra', label: 'Verðskrá' },
  { href: '#gisting', label: 'Gisting' },
  { href: '#hestar', label: 'Hestar' },
  { href: '#veidi', label: 'Veiði' },
  { href: '#samband', label: 'Samband' },
]

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal — IO on the element itself; a y-offset never removes intersection
 * (only clip/scale-to-zero does, craft-ledger #7). Failsafe is gated by
 * viewport position (ledger #25): only content already on screen force-shows. */
function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const reduced = prefersReduced()
  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${y}px)`,
              transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  )
}

/* ── ClipPhoto — clip-path reveal for STANDALONE aspect-boxed content photos
 * only (never full-bleed backgrounds, ledger #12). Observer lives on the
 * untransformed <figure>; the clipped layer is a child (ledger #7). */
function ClipPhoto({
  src,
  alt,
  aspect,
  className = '',
  caption,
  sizes,
}: {
  src: string
  alt: string
  aspect: string
  className?: string
  caption?: string
  sizes?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const reduced = prefersReduced()
  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
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
      { rootMargin: '0px 0px -6% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])
  return (
    <figure ref={ref as never} className={`m-0 ${className}`}>
      <div className={`overflow-hidden rounded-sm ${aspect}`}>
        <div
          className="h-full w-full"
          style={
            reduced
              ? undefined
              : {
                  clipPath: shown ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  transition: 'clip-path .95s cubic-bezier(.22,1,.36,1)',
                }
          }
        >
          <Img
            src={src}
            alt={alt}
            sizes={sizes}
            className="h-full w-full object-cover"
            style={
              reduced
                ? undefined
                : {
                    transform: shown ? 'scale(1)' : 'scale(1.06)',
                    transition: 'transform 1.15s cubic-bezier(.22,1,.36,1)',
                  }
            }
            fallbackClassName="bg-stone-400"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-[11px] tracking-wide" style={{ color: MUTED_ON_CREAM }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/* Caption for photos sitting on the dark ground */
function DarkCaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-2.5 font-mono text-[11px] tracking-wide" style={{ color: MUTED_ON_DARK }}>
      {children}
    </figcaption>
  )
}

/* ── The signature: smoke rail ───────────────────────────────────────────────
 * A procedurally drawn wisp in the left margin of the dark product chapter.
 * Driven ONLY by that section's own scrollYProgress; every value is derived
 * from the raw progress inside ONE callback (ledger #26: no sibling .get()
 * reads) and written straight to SVG attributes per frame, zero CSS
 * transitions on scrubbed values. Thin wisp entering → fullest curl right as
 * the price list is read → thins out to reveal the ordering CTA. Explicit
 * height + preserveAspectRatio="none" because SVG is a replaced element
 * (ledger #26). */
function buildSmoke(amp: number, phase: number): string {
  const pts: string[] = []
  for (let y = 1040; y >= -40; y -= 40) {
    const rise = 1 - y / 1040 /* 0 at bottom, 1 at top: smoke widens as it rises */
    const taper = 0.3 + 0.7 * rise
    const x = 40 + Math.sin(y * 0.012 + phase) * amp * taper
    pts.push(`${x.toFixed(1)} ${y}`)
  }
  return 'M ' + pts.join(' L ')
}

function SmokeRail({ progress }: { progress: MotionValue<number> }) {
  const smokeRef = useRef<SVGPathElement>(null)
  const emberRef = useRef<SVGPathElement>(null)
  useMotionValueEvent(progress, 'change', (v) => {
    const t = Math.min(1, Math.max(0, v))
    /* density: 0 entering → 1 mid-section (price list on screen) → back out */
    const density = t < 0.5 ? t / 0.5 : Math.max(0, 1 - (t - 0.5) / 0.45)
    const amp = 8 + density * 34
    const phase = t * 7
    const d = buildSmoke(amp, phase)
    const s = smokeRef.current
    if (s) {
      s.setAttribute('d', d)
      s.setAttribute('stroke-width', String(10 + density * 26))
      s.style.opacity = String(0.06 + density * 0.6)
    }
    const e = emberRef.current
    if (e) {
      e.setAttribute('d', d)
      e.style.opacity = String(0.04 + density * 0.3)
    }
  })
  return (
    <svg
      viewBox="0 0 80 1000"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="sk-smoke-blur" x="-80%" y="-10%" width="260%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="sk-ember-blur" x="-80%" y="-10%" width="260%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <path
        ref={emberRef}
        d={buildSmoke(14, 0)}
        fill="none"
        stroke={EMBER_HI}
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#sk-ember-blur)"
        style={{ opacity: 0.08 }}
      />
      <path
        ref={smokeRef}
        d={buildSmoke(14, 0)}
        fill="none"
        stroke={CREAM}
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#sk-smoke-blur)"
        style={{ opacity: 0.1 }}
      />
    </svg>
  )
}

/* Static faint wisp under prefers-reduced-motion (brief: plain, not animated) */
function SmokeRailStatic() {
  return (
    <svg viewBox="0 0 80 1000" preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <defs>
        <filter id="sk-smoke-blur-static" x="-80%" y="-10%" width="260%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path
        d={buildSmoke(20, 2)}
        fill="none"
        stroke={CREAM}
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#sk-smoke-blur-static)"
        style={{ opacity: 0.18 }}
      />
    </svg>
  )
}

/* ── Price rows (Space Mono voice: a real, maintained price list is an earned
 * instrument per ledger #2) ──────────────────────────────────────────────── */
function PriceRows({ rows, dark = false }: { rows: PriceRow[]; dark?: boolean }) {
  return (
    <ul className="m-0 list-none p-0">
      {rows.map((row, i) => (
        <li
          key={`${row.name}-${i}`}
          className="flex items-baseline justify-between gap-4 py-3.5"
          style={{ borderTop: i === 0 ? undefined : `1px solid ${dark ? HAIR_DARK : HAIR_LIGHT}` }}
        >
          <div className="min-w-0">
            <p className="m-0 text-[15px] font-medium leading-snug" style={{ color: dark ? CREAM : INK }}>
              {row.name}
            </p>
            {row.note ? (
              <p className="m-0 mt-0.5 text-[12.5px] leading-snug" style={{ color: dark ? MUTED_ON_DARK : MUTED_ON_CREAM }}>
                {row.note}
              </p>
            ) : null}
          </div>
          <p
            className="m-0 whitespace-nowrap font-mono text-[15px] font-bold tracking-tight"
            style={{ color: dark ? CREAM : INK }}
          >
            {row.price}
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
function CtaSolid({
  href,
  children,
  dark = false,
  className = '',
}: {
  href: string
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  /* On dark ground: cream fill + ink text (14:1). On cream: ember fill + cream text (5.03:1). */
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-transform duration-200 active:scale-[0.97] ${dark ? FOCUS_DARK : FOCUS_LIGHT} ${className}`}
      style={dark ? { background: CREAM, color: INK } : { background: EMBER, color: CREAM }}
    >
      {children}
    </a>
  )
}

function CtaGhost({
  href,
  children,
  dark = false,
  className = '',
}: {
  href: string
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full border px-7 py-3.5 text-[15px] font-semibold transition-transform duration-200 active:scale-[0.97] ${dark ? FOCUS_DARK : FOCUS_LIGHT} ${className}`}
      style={
        dark
          ? { borderColor: 'rgba(243,238,227,.4)', color: CREAM }
          : { borderColor: 'rgba(34,29,23,.35)', color: INK }
      }
    >
      {children}
    </a>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Page() {
  const reduced = prefersReduced()

  /* Mobile hamburger menu — fixes the md:flex nav links being invisible below
   * the md breakpoint (only the phone chip survived). Overlay is rendered as
   * a sibling of <header>, not a descendant, and <header> gets an explicit
   * z-index (below) so it becomes its own stacking context: nav's z-10 stays
   * confined to it instead of escaping to compete at the root against the
   * overlay. That is what lets the header (solid CHARCOAL, collapsed to just
   * the nav row while open) sit visibly above the full-screen overlay. */
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  /* Close first, then scroll on the next frame so the overlay's own unmount
   * doesn't fight the scroll (and so reduced-motion gets an instant jump). */
  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
    })
  }

  /* Lenis smooth scroll (brief: skipped entirely under reduced motion) */
  useEffect(() => {
    setThemeColor(CHARCOAL)
    if (prefersReduced()) return () => setThemeColor('#0a1320')
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
      setThemeColor('#0a1320')
    }
  }, [])

  /* Signature driver: the smoke section's OWN progress, not the whole page's */
  const smokeSection = useRef<HTMLElement>(null)
  const { scrollYProgress: smokeProgress } = useScroll({
    target: smokeSection,
    offset: ['start end', 'end start'],
  })

  /* Staggered mount entrance for the hero (ledger #12: mount-triggered animate,
   * never whileInView for anything already on screen) */
  const heroItem = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay: 0.12 + i * 0.09, ease: EASE },
        }

  return (
    <div lang="is" className="font-sans antialiased" style={{ background: CREAM, color: INK }}>
      <PreviewChrome company={company} />

      {/* ══ 1 · HERO — dark, Bæjargljúfur graded into charcoal ══ */}
      <header
        className={`relative z-40 flex flex-col ${menuOpen ? '' : 'min-h-[100svh]'}`}
        style={{ background: CHARCOAL }}
      >
        {/* Hero image + hero copy fully unmount while the mobile menu is open:
         * header then shrinks to just the nav row (solid CHARCOAL), which is
         * what lets it stay visibly above the full-screen overlay below. */}
        {!menuOpen && (
          <div className="absolute inset-0" aria-hidden="true">
            <Img
              src={IMG.baejargljufur}
              alt=""
              loading="eager"
              fetchpriority="high"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-b from-stone-700 to-stone-900"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(36,32,27,.62) 0%, rgba(36,32,27,.4) 40%, rgba(36,32,27,.78) 78%, #24201B 100%)',
              }}
            />
          </div>
        )}

        {/* Nav */}
        <motion.nav
          {...(reduced
            ? {}
            : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay: 0.05, ease: EASE } })}
          className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8"
          aria-label="Aðalvalmynd"
        >
          <a href="#top" className={`font-display text-xl tracking-tight ${FOCUS_DARK}`} style={{ color: CREAM }}>
            Sauðakofinn
          </a>
          <div className="hidden items-center gap-7 text-[14px] font-medium md:flex" style={{ color: MUTED_ON_DARK }}>
            <a href="#verdskra" className={`transition-colors hover:text-[#F3EEE3] ${FOCUS_DARK}`}>
              Verðskrá
            </a>
            <a href="#gisting" className={`transition-colors hover:text-[#F3EEE3] ${FOCUS_DARK}`}>
              Gisting
            </a>
            <a href="#hestar" className={`transition-colors hover:text-[#F3EEE3] ${FOCUS_DARK}`}>
              Hestar
            </a>
            <a href="#veidi" className={`transition-colors hover:text-[#F3EEE3] ${FOCUS_DARK}`}>
              Veiði
            </a>
            <a href="#samband" className={`transition-colors hover:text-[#F3EEE3] ${FOCUS_DARK}`}>
              Samband
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={PHONE_1_HREF}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold ${FOCUS_DARK}`}
              style={{ borderColor: 'rgba(243,238,227,.35)', color: CREAM }}
            >
              <Phone size={14} aria-hidden="true" />
              <span className="font-mono">{PHONE_1}</span>
            </a>

            {/* Hamburger — two lines morphing into an X, CREAM → TAN on open */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:hidden ${FOCUS_DARK}`}
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <motion.span
                  className="absolute left-0 top-0 block h-[2px] w-5 rounded-full"
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0, background: menuOpen ? TAN : CREAM }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 block h-[2px] w-5 rounded-full"
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0, background: menuOpen ? TAN : CREAM }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </motion.nav>

        {/* Hero copy */}
        {!menuOpen && (
          <div
            id="top"
            className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-16 pt-10 md:px-8 md:pb-24"
          >
            <motion.p
              {...heroItem(0)}
              className="m-0 font-mono text-[12px] font-bold uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              Fossnes í Skeiða- og Gnúpverjahreppi
            </motion.p>
            <motion.h1
              {...heroItem(1)}
              className="m-0 mt-4 font-display text-5xl font-medium leading-[1.08] sm:text-6xl md:text-8xl"
              style={{ color: CREAM }}
            >
              Sauðakofinn
            </motion.h1>
            <motion.p
              {...heroItem(2)}
              className="m-0 mt-5 max-w-xl text-[17px] leading-relaxed md:text-lg"
              style={{ color: MUTED_ON_DARK }}
            >
              Tvíreykt sauðakjöt úr reykhúsinu á fjallajörðinni Fossnesi. Pantað í síma eða með tölvupósti, beint frá
              býli.
            </motion.p>
            <motion.div {...heroItem(3)} className="mt-9 flex flex-wrap items-center gap-3.5">
              <CtaSolid href="#verdskra" dark>
                Sjá verðskrá og panta
              </CtaSolid>
              <CtaGhost href={PHONE_2_HREF} dark>
                <Phone size={16} aria-hidden="true" />
                <span className="font-mono">{PHONE_2}</span>
              </CtaGhost>
            </motion.div>
          </div>
        )}
      </header>

      {/* ══ Mobile menu overlay — a SIBLING of <header>, not nested inside it.
       * Neither <header> nor its own ancestors use backdrop-blur/filter/
       * transform (checked), so a fixed child would already stay viewport-
       * relative here — sibling placement is kept anyway as the robust
       * choice. z-30 sits below header's z-40 so the header, collapsed to
       * just its solid-CHARCOAL nav row while open, stays visible above this
       * panel with the X. pt-[84px] clears that collapsed nav row's own
       * height (py-5 padding + the 44px tap targets inside it). ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Valmynd"
            className="fixed inset-0 z-30 flex flex-col pt-[84px] md:hidden"
            style={{ background: CHARCOAL }}
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: 1 }}
            exit={reduced ? {} : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
          >
            <nav
              className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-10 pt-6"
              aria-label="Valmynd farsíma"
            >
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      className={`block py-3 font-display text-4xl font-medium ${FOCUS_DARK}`}
                      style={{ color: CREAM }}
                      initial={reduced ? {} : { y: '100%' }}
                      animate={reduced ? {} : { y: '0%' }}
                      exit={reduced ? {} : { y: '100%' }}
                      transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : 0.1 + i * 0.06 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <motion.div
                  className="h-px w-16 origin-left"
                  style={{ background: TAN }}
                  initial={reduced ? {} : { scaleX: 0 }}
                  animate={reduced ? {} : { scaleX: 1 }}
                  exit={reduced ? {} : { scaleX: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.42 }}
                />
                <motion.div
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  animate={reduced ? {} : { opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, ease: EASE, delay: reduced ? 0 : 0.5 }}
                >
                  <CtaGhost href={PHONE_1_HREF} dark className="mt-6 w-full">
                    <Phone size={16} aria-hidden="true" />
                    <span className="font-mono">{PHONE_1}</span>
                  </CtaGhost>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ 2 · SAUÐAKOFINN + VERÐSKRÁ — the smoke chapter, signature rail ══ */}
      <section
        id="verdskra"
        ref={smokeSection}
        aria-labelledby="verdskra-h"
        className="relative overflow-hidden"
        style={{ background: CHARCOAL }}
      >
        {/* Signature smoke rail, left margin, scroll-linked to THIS section only */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24" aria-hidden="true">
          {reduced ? <SmokeRailStatic /> : <SmokeRail progress={smokeProgress} />}
        </div>
        {/* Faint smoke atmosphere, decorative only (Unsplash, never claimed as Fossnes) */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-96 w-[42%] md:block" aria-hidden="true">
          <Img
            src={UIMG_SMOKE}
            alt=""
            className="h-full w-full object-cover opacity-[0.14]"
            style={{
              maskImage: 'linear-gradient(to bottom left, black 30%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom left, black 30%, transparent 85%)',
            }}
            fallbackClassName="bg-transparent"
          />
        </div>

        <div className="relative mx-auto max-w-6xl py-20 pl-14 pr-5 md:py-28 md:pl-28 md:pr-8">
          <Reveal>
            <h2
              id="verdskra-h"
              className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl"
              style={{ color: CREAM }}
            >
              Úr reykhúsinu
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
            {/* Left: the only real product photo in existence, deliberately small */}
            <div>
              <Reveal delay={60}>
                <figure className="m-0 max-w-[340px]">
                  <div
                    className="overflow-hidden rounded-sm p-2"
                    style={{ background: CHARCOAL_DEEP, border: `1px solid ${HAIR_DARK}` }}
                  >
                    <Img
                      src={IMG.product}
                      alt="Tvíreykt sauðalæri á skurðarbretti með hníf og gaffli"
                      className="aspect-[517/800] w-full rounded-[2px] object-cover"
                      fallbackClassName="bg-stone-800"
                    />
                  </div>
                  <DarkCaption>Tvíreykt sauðalæri, ljósmynd af fossnes.is</DarkCaption>
                </figure>
              </Reveal>
              <Reveal delay={120}>
                <p className="m-0 mt-8 max-w-md text-[15.5px] leading-relaxed" style={{ color: MUTED_ON_DARK }}>
                  {PRODUCT_INTRO}
                </p>
                <p className="m-0 mt-4 max-w-md font-display text-2xl leading-snug" style={{ color: CREAM }}>
                  {PRODUCT_CLAIM}
                </p>
              </Reveal>
            </div>

            {/* Right: the price list, mono voice */}
            <div>
              <Reveal delay={100}>
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className="m-0 font-mono text-[12px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: TAN }}
                  >
                    {PRICES_LABEL}
                  </p>
                  <p className="m-0 font-mono text-[12px]" style={{ color: MUTED_ON_DARK }}>
                    kr/kg
                  </p>
                </div>
                <div className="mt-4 border-t" style={{ borderColor: HAIR_DARK }}>
                  <PriceRows rows={PRICES} dark />
                </div>
                <p className="m-0 mt-3 text-[12.5px] leading-relaxed" style={{ color: MUTED_ON_DARK }}>
                  {PRICES_NOTE}
                </p>
              </Reveal>

              {/* Custom-smoking aside, honest and small */}
              <Reveal delay={160}>
                <div
                  className="mt-10 flex items-center gap-4 rounded-sm p-4"
                  style={{ background: CHARCOAL_DEEP, border: `1px solid ${HAIR_DARK}` }}
                >
                  <Img
                    src={UIMG_EMBERS}
                    alt=""
                    aria-hidden="true"
                    className="h-16 w-16 flex-none rounded-[2px] object-cover"
                    fallbackClassName="bg-stone-800"
                  />
                  <div>
                    <p className="m-0 text-[15px] font-medium" style={{ color: CREAM }}>
                      {CUSTOM_SMOKING}
                    </p>
                    <p className="m-0 mt-1 text-[12.5px]" style={{ color: MUTED_ON_DARK }}>
                      Hafið samband og við tökum kjötið ykkar í reyk.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* The order block: the smoke clears, the goods appear */}
              <Reveal delay={200}>
                <div className="mt-12">
                  <p className="m-0 text-[15px] leading-relaxed" style={{ color: MUTED_ON_DARK }}>
                    {ORDER_LINE}
                  </p>
                  <div className="mt-5 flex flex-col items-start gap-3">
                    <a
                      href={PHONE_1_HREF}
                      className={`font-mono text-3xl font-bold tracking-tight transition-colors hover:text-[#C1531E] md:text-4xl ${FOCUS_DARK}`}
                      style={{ color: CREAM }}
                    >
                      {PHONE_1}
                    </a>
                    <a
                      href={PHONE_2_HREF}
                      className={`font-mono text-3xl font-bold tracking-tight transition-colors hover:text-[#C1531E] md:text-4xl ${FOCUS_DARK}`}
                      style={{ color: CREAM }}
                    >
                      {PHONE_2}
                    </a>
                    <a
                      href={MAILTO}
                      className={`break-all font-mono text-lg transition-colors hover:text-[#C1531E] md:text-xl ${FOCUS_DARK}`}
                      style={{ color: MUTED_ON_DARK }}
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 · SAUÐFJÁRRÆKTIN — cream, the trust chapter (stands in for reviews) ══ */}
      <section aria-labelledby="fe-h" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <ClipPhoto
              src={IMG.flagSheep}
              alt="Íslenski fáninn við hún og fé á beit í heimahögum á Fossnesi"
              aspect="aspect-[4/3]"
              caption="Féð í heimahögum á Fossnesi"
              sizes="(min-width: 768px) 46vw, 92vw"
            />
            <div>
              <Reveal>
                <h2 id="fe-h" className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl">
                  Sauðfjárræktin á bænum
                </h2>
              </Reveal>
              {SHEEP_COPY.map((p, i) => (
                <Reveal key={i} delay={70 + i * 70}>
                  <p className="m-0 mt-5 text-[15.5px] leading-relaxed" style={{ color: MUTED_ON_CREAM }}>
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={220}>
                <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-x-6 gap-y-5 p-0 sm:grid-cols-3">
                  {SHEEP_FACTS.map((f) => (
                    <li key={f.label} className="border-t pt-3" style={{ borderColor: HAIR_LIGHT }}>
                      <p className="m-0 font-display text-2xl font-medium" style={{ color: EMBER }}>
                        {f.value}
                      </p>
                      <p className="m-0 mt-1 font-mono text-[11.5px] leading-snug" style={{ color: MUTED_ON_CREAM }}>
                        {f.label}
                      </p>
                    </li>
                  ))}
                </ul>
                <p
                  className="m-0 mt-6 inline-block rounded-full border px-4 py-1.5 text-[13px] font-medium"
                  style={{ borderColor: HAIR_LIGHT, color: INK }}
                >
                  {TRUST_LINE}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4 · LANDIÐ — full-bleed forestry photo band (eager background, ledger #12) ══ */}
      <section aria-labelledby="land-h" className="relative" style={{ background: CHARCOAL }}>
        <div className="absolute inset-0" aria-hidden="true">
          <Img
            src={IMG.forestry}
            alt=""
            className="h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-b from-stone-600 to-stone-800"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(27,23,19,.72)' }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
          <Reveal>
            <h2
              id="land-h"
              className="m-0 max-w-2xl font-display text-4xl font-medium leading-[1.14] md:text-5xl"
              style={{ color: CREAM }}
            >
              Jörð í rækt í rúm þrjátíu ár
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="m-0 mt-5 max-w-2xl text-[15.5px] leading-relaxed" style={{ color: CREAM }}>
              {LAND_COPY}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <ul className="m-0 mt-10 grid max-w-2xl list-none grid-cols-1 gap-x-8 gap-y-5 p-0 sm:grid-cols-2">
              {LAND_ANCHORS.map((a) => (
                <li key={a.label} className="border-t pt-3" style={{ borderColor: HAIR_DARK }}>
                  <p className="m-0 font-mono text-3xl font-bold tracking-tight" style={{ color: CREAM }}>
                    {a.value}
                  </p>
                  <p className="m-0 mt-1 text-[12.5px]" style={{ color: 'rgba(243,238,227,.75)' }}>
                    {a.label}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={220}>
            <p className="m-0 mt-8 font-mono text-[11px] tracking-wide" style={{ color: 'rgba(243,238,227,.6)' }}>
              Skógræktin við lækinn á Fossnesi, ljósmynd af fossnes.is
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ 5 · GISTING — cream, farmhouse + Verðskrá 2026 ══ */}
      <section id="gisting" aria-labelledby="gisting-h" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 id="gisting-h" className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl">
              Gisting á Fossnesi
            </h2>
          </Reveal>
          <div className="mt-10">
            <ClipPhoto
              src={IMG.farmhouse}
              alt="Bærinn Fossnes, hvítt íbúðarhús og rauð þök útihúsa í grænum dal"
              aspect="aspect-[3/2] md:aspect-[21/9]"
              caption="Bærinn Fossnes"
              sizes="(min-width: 768px) 92vw, 100vw"
            />
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              {STAY_COPY.map((p, i) => (
                <Reveal key={i} delay={i * 70}>
                  <p
                    className={`m-0 text-[15.5px] leading-relaxed ${i > 0 ? 'mt-4' : ''}`}
                    style={{ color: MUTED_ON_CREAM }}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={220}>
                <p
                  className="m-0 mt-6 rounded-sm p-4 text-[14px] leading-relaxed"
                  style={{ background: 'rgba(169,133,95,.16)', color: INK }}
                >
                  {STAY_NOTE}
                </p>
              </Reveal>
            </div>
            <div>
              <Reveal delay={100}>
                <p className="m-0 font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: EMBER }}>
                  {STAY_PRICES_LABEL}
                </p>
                <div className="mt-4 border-t" style={{ borderColor: HAIR_LIGHT }}>
                  <PriceRows rows={STAY_PRICES} />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <CtaSolid href={PHONE_1_HREF}>
                    <Phone size={16} aria-hidden="true" />
                    Bóka gistingu í síma
                  </CtaSolid>
                  <CtaGhost href={MAILTO}>
                    <Mail size={16} aria-hidden="true" />
                    Senda fyrirspurn
                  </CtaGhost>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6 · HESTAR — moss band ══ */}
      <section id="hestar" aria-labelledby="hestar-h" style={{ background: MOSS }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <Reveal>
                <h2
                  id="hestar-h"
                  className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl"
                  style={{ color: CREAM }}
                >
                  Hestarnir
                </h2>
              </Reveal>
              {HORSES_COPY.map((p, i) => (
                <Reveal key={i} delay={70 + i * 70}>
                  <p className="m-0 mt-5 text-[15.5px] leading-relaxed" style={{ color: 'rgba(243,238,227,.88)' }}>
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={210}>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <CtaSolid href={PHONE_2_HREF} dark>
                    <Phone size={16} aria-hidden="true" />
                    {HORSES_CTA}
                  </CtaSolid>
                  <p className="m-0 font-mono text-[13.5px] font-bold" style={{ color: CREAM }}>
                    Hagabeit 600 kr/nótt
                  </p>
                </div>
              </Reveal>
            </div>
            <ClipPhoto
              src={IMG.horses}
              alt="Hrossastóð Fossness á beit í grænni hlíð"
              aspect="aspect-[3/4]"
              className="w-full md:max-w-md md:justify-self-end"
              sizes="(min-width: 768px) 40vw, 92vw"
            />
          </div>
        </div>
      </section>

      {/* ══ 7 · VEIÐI — cream, Þverá ══ */}
      <section id="veidi" aria-labelledby="veidi-h" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <div className="md:order-2">
              <Reveal>
                <h2 id="veidi-h" className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl">
                  Veiði í Þveránni
                </h2>
              </Reveal>
              {FISHING_COPY.map((p, i) => (
                <Reveal key={i} delay={70 + i * 70}>
                  <p className="m-0 mt-5 text-[15.5px] leading-relaxed" style={{ color: MUTED_ON_CREAM }}>
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={200}>
                <dl className="m-0 mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {FISHING_FACTS.map((f) => (
                    <div key={f.label} className="border-t pt-3" style={{ borderColor: HAIR_LIGHT }}>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED_ON_CREAM }}>
                        {f.label}
                      </dt>
                      <dd className="m-0 mt-1 text-[15px] font-medium" style={{ color: INK }}>
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-8">
                  <CtaSolid href={MAILTO}>
                    <Mail size={16} aria-hidden="true" />
                    {FISHING_CTA}
                  </CtaSolid>
                </div>
              </Reveal>
            </div>
            <ClipPhoto
              src={IMG.riverValley}
              alt="Áin liðast um gróið láglendi við Fossnes"
              aspect="aspect-[4/3]"
              caption="Árdalurinn við bæinn"
              className="md:order-1"
              sizes="(min-width: 768px) 46vw, 92vw"
            />
          </div>
        </div>
      </section>

      {/* ══ 8 · GÖNGUFERÐIR — dark gallery of the named canyons ══ */}
      <section aria-labelledby="ganga-h" style={{ background: CHARCOAL }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2
              id="ganga-h"
              className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl"
              style={{ color: CREAM }}
            >
              Gljúfrin og gönguleiðirnar
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="m-0 mt-5 max-w-2xl text-[15.5px] leading-relaxed" style={{ color: MUTED_ON_DARK }}>
              {WALKS_COPY}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <ul className="m-0 mt-6 flex list-none flex-wrap gap-2.5 p-0">
              {PLACES.map((place) => (
                <li
                  key={place}
                  className="rounded-full border px-4 py-1.5 font-mono text-[12.5px]"
                  style={{ borderColor: HAIR_DARK, color: CREAM }}
                >
                  {place}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <figure className="m-0">
                <div className="overflow-hidden rounded-sm">
                  <Img
                    src={IMG.svartagljufur}
                    alt="Svartagljúfur að vetri, snævi þaktir gljúfurveggir og lækur"
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(min-width: 640px) 46vw, 92vw"
                    fallbackClassName="bg-stone-800"
                  />
                </div>
                <DarkCaption>Svartagljúfur að vetri</DarkCaption>
              </figure>
            </Reveal>
            <Reveal delay={80}>
              <figure className="m-0">
                <div className="overflow-hidden rounded-sm">
                  <Img
                    src={IMG.canyonHiker}
                    alt="Göngufólk og hundur á gljúfurbarmi í Fossneshaga"
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(min-width: 640px) 46vw, 92vw"
                    fallbackClassName="bg-stone-800"
                  />
                </div>
                <DarkCaption>Á göngu inn með Þveránni</DarkCaption>
              </figure>
            </Reveal>
            <Reveal delay={60}>
              <figure className="m-0">
                <div className="overflow-hidden rounded-sm">
                  <Img
                    src={IMG.waterfallRegional}
                    alt="Hár tveggja þrepa foss í Þjórsárdal, fólk á gljúfurbarmi"
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(min-width: 640px) 46vw, 92vw"
                    fallbackClassName="bg-stone-800"
                  />
                </div>
                <DarkCaption>Í nágrenninu: fossar Þjórsárdals</DarkCaption>
              </figure>
            </Reveal>
            <Reveal delay={140}>
              <figure className="m-0">
                <div className="overflow-hidden rounded-sm">
                  <Img
                    src={IMG.waterfallAlt}
                    alt="Foss í gljúfri í Þjórsárdal að sumri"
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(min-width: 640px) 46vw, 92vw"
                    fallbackClassName="bg-stone-800"
                  />
                </div>
                <DarkCaption>Fossaganga í Þjórsárdal, skammt frá bænum</DarkCaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 9 · SAMBAND — deep charcoal, the 5-second phone-number test ══ */}
      <section id="samband" aria-labelledby="samband-h" style={{ background: CHARCOAL_DEEP }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2
              id="samband-h"
              className="m-0 font-display text-4xl font-medium leading-[1.14] md:text-5xl"
              style={{ color: CREAM }}
            >
              Hafðu samband
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Reveal delay={80}>
              <p className="m-0 text-[15px]" style={{ color: MUTED_ON_DARK }}>
                Sigrún svarar í símann og tekur við pöntunum á kjöti, gistingu, veiði og hestbaki.
              </p>
              <div className="mt-6 flex flex-col items-start gap-4">
                <a
                  href={PHONE_1_HREF}
                  className={`font-mono text-4xl font-bold tracking-tight transition-colors hover:text-[#C1531E] md:text-6xl ${FOCUS_DARK}`}
                  style={{ color: CREAM }}
                >
                  {PHONE_1}
                </a>
                <a
                  href={PHONE_2_HREF}
                  className={`font-mono text-4xl font-bold tracking-tight transition-colors hover:text-[#C1531E] md:text-6xl ${FOCUS_DARK}`}
                  style={{ color: CREAM }}
                >
                  {PHONE_2}
                </a>
                <a
                  href={MAILTO}
                  className={`break-all font-mono text-xl transition-colors hover:text-[#C1531E] md:text-2xl ${FOCUS_DARK}`}
                  style={{ color: MUTED_ON_DARK }}
                >
                  {EMAIL}
                </a>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="border-t pt-5 md:border-l md:border-t-0 md:pl-10 md:pt-0" style={{ borderColor: HAIR_DARK }}>
                <p className="m-0 text-[15px] font-semibold" style={{ color: CREAM }}>
                  {OWNER}
                </p>
                <p className="m-0 mt-3 flex items-start gap-2 text-[15px] leading-relaxed" style={{ color: MUTED_ON_DARK }}>
                  <MapPin size={16} aria-hidden="true" className="mt-1 flex-none" style={{ color: TAN }} />
                  <span>
                    {ADDRESS}
                    <br />
                    {MUNICIPALITY}
                  </span>
                </p>
                <p className="m-0 mt-6 font-display text-xl italic leading-snug" style={{ color: TAN }}>
                  {TAGLINE}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 10 · LOKAKALL — cream, autumn order + honesty disclosure ══ */}
      <section aria-labelledby="loka-h" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-8 md:py-24">
          <Reveal>
            <h2 id="loka-h" className="m-0 mx-auto max-w-2xl font-display text-4xl font-medium leading-[1.14] md:text-5xl">
              Pantið sauðakjöt fyrir haustið
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="m-0 mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed" style={{ color: MUTED_ON_CREAM }}>
              Verðskrá haustsins 2025 er hér að neðan og pantanir berast beint til okkar í síma eða tölvupósti.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <CtaSolid href="#verdskra">Sjá verðskrá og panta</CtaSolid>
              <CtaGhost href={MAILTO}>
                <Mail size={16} aria-hidden="true" />
                {EMAIL}
              </CtaGhost>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <p
              className="m-0 mx-auto mt-14 max-w-2xl border-t pt-6 text-left text-[12px] leading-relaxed"
              style={{ borderColor: HAIR_LIGHT, color: MUTED_ON_CREAM }}
            >
              {HONESTY}
            </p>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* Sticky mobile CTA (brief: present throughout on mobile; hidden while
       * the full-screen menu — which has its own phone CTA — is open) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex gap-2.5 px-4 pt-3 md:hidden ${menuOpen ? 'hidden' : ''}`}
        style={{
          background: 'rgba(27,23,19,.96)',
          borderTop: `1px solid ${HAIR_DARK}`,
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        }}
      >
        <a
          href={PHONE_1_HREF}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[15px] font-semibold ${FOCUS_DARK}`}
          style={{ background: EMBER, color: CREAM }}
        >
          <Phone size={16} aria-hidden="true" />
          Hringja
        </a>
        <a
          href="#verdskra"
          className={`flex flex-1 items-center justify-center rounded-full border py-3 text-[15px] font-semibold ${FOCUS_DARK}`}
          style={{ borderColor: 'rgba(243,238,227,.4)', color: CREAM }}
        >
          Sjá verðskrá
        </a>
      </div>
    </div>
  )
}
