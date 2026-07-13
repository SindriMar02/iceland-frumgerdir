import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ABOUT_BODY, ABOUT_HEADING, ADDRESS, AREA_BODY, AREA_LINE_A, AREA_LINE_B,
  CLOSING_LINE, CLOSING_SUB, CONTACT_HEADING_A, CONTACT_HEADING_B, CONTACT_PHOTO_CAPTION,
  CONTACT_SUB, EMAIL, FACTS, FAQ, FAQ_HEADING, FOOTER_CREDIT, HERO, HOURS_SHORT, IMG, JSON_LD,
  META, NAV, PHONE_DISPLAY, PHONE_HREF, PORTFOLIO_HEADING, PORTFOLIO_INTRO, PROCESS,
  PROCESS_HEADING, PROCESS_INTRO, SERVICES, SERVICES_HEADING, SERVICES_INTRO, SPECIMENS,
  WHY_HEADING_A, WHY_HEADING_B, WHY_INTRO, WHY_POINTS,
} from './data'

const company = getPreviewCompany('prentverk')

/* ── YFIRPRENT v3 — same two-colour print house, restructured on the
      Bílageirinn pattern: full-bleed photo moments carry the page (hero,
      craft, contact), one functional split (the service index, which has
      to be a split because it's interactive), everything else stacks in
      clean single- or balanced-column rhythm. Eight real photographs. ── */

const PAPER = '#FAFAF7'
const RED = '#D1232A'
const INK = '#231F20'
const GREY = '#8E8B88'
const GREY_TEXT = 'rgba(35,31,32,0.74)'
const PAPER_SOFT = 'rgba(250,250,247,0.78)'

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Tanker-Regular', 'Arial Narrow', sans-serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'GeistMono-Regular', ui-monospace, monospace"
const MONO_MED = "'GeistMono-Medium', ui-monospace, monospace"

const HAIR = 'rgba(35,31,32,0.16)'
const HAIR_LT = 'rgba(250,250,247,0.28)'
const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────────────────────────────── the signature: coming into register ── */
function Register({ children, main, ghost, dx = 9, dy = 7, delay = 0, block = false, style }: {
  children: ReactNode; main: string; ghost: string; dx?: number; dy?: number
  delay?: number; block?: boolean; style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const disp = block ? 'block' : 'inline-block'
  if (reduced) {
    return <span className={`relative ${disp}`} style={{ color: main, ...style }}>{children}</span>
  }
  return (
    <span className={`relative ${disp}`} style={style}>
      <motion.span
        aria-hidden
        className="absolute inset-0 select-none"
        style={{ color: ghost }}
        initial={{ x: -dx, y: dy }}
        whileInView={{ x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
      <motion.span
        className="relative inline-block"
        style={{ color: main }}
        initial={{ x: dx * 0.55, y: -dy * 0.55 }}
        whileInView={{ x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* ─────────────────────────────────────────────── small print-trade pieces ── */
function Crops({ color = GREY, inset = 0 }: { color?: string; inset?: number }) {
  const s: CSSProperties = { position: 'absolute', width: 14, height: 14, pointerEvents: 'none' }
  const b = `1px solid ${color}`
  return (
    <span aria-hidden>
      <span style={{ ...s, top: inset, left: inset, borderTop: b, borderLeft: b }} />
      <span style={{ ...s, top: inset, right: inset, borderTop: b, borderRight: b }} />
      <span style={{ ...s, bottom: inset, left: inset, borderBottom: b, borderLeft: b }} />
      <span style={{ ...s, bottom: inset, right: inset, borderBottom: b, borderRight: b }} />
    </span>
  )
}

/** Their registration-mark emblem, redrawn from the recovered logo. */
function Emblem({ size = 36, ink = INK, red = RED }: { size?: number; ink?: string; red?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <circle cx="20" cy="20" r="13" fill="none" stroke={ink} strokeWidth="1.6" />
      <path d="M20 20 L20 7 A13 13 0 0 1 33 20 Z" fill={red} />
      <path d="M20 20 L20 33 A13 13 0 0 1 7 20 Z" fill={ink} />
      <line x1="20" y1="0" x2="20" y2="40" stroke={ink} strokeWidth="1.2" />
      <line x1="0" y1="20" x2="40" y2="20" stroke={ink} strokeWidth="1.2" />
    </svg>
  )
}

function Burst({ size = 44, color = RED, className = '' }: { size?: number; color?: string; className?: string }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return { x2: 20 + Math.cos(a) * 17, y2: 20 + Math.sin(a) * 17, x1: 20 + Math.cos(a) * 6, y1: 20 + Math.sin(a) * 6 }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className={className}>
      {spokes.map((l, i) => (
        <line key={i} {...l} stroke={color} strokeWidth="2.4" strokeLinecap="square" />
      ))}
    </svg>
  )
}

function Greek({ lines = 5, color = 'rgba(35,31,32,0.24)' }: { lines?: number; color?: string }) {
  return (
    <span aria-hidden className="block">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="mb-[7%] block h-[4%] min-h-[3px]"
          style={{ background: color, width: i === lines - 1 ? '62%' : '100%' }} />
      ))}
    </span>
  )
}

function CtaLink({ href, children, variant, className = '' }: {
  href: string; children: ReactNode; variant: 'red' | 'ink' | 'paper' | 'paperline'; className?: string
}) {
  const styles: Record<string, CSSProperties> = {
    red: { background: RED, color: PAPER },
    ink: { background: 'transparent', color: INK, boxShadow: `inset 0 0 0 1.5px ${INK}` },
    paper: { background: PAPER, color: INK },
    paperline: { background: 'transparent', color: PAPER, boxShadow: `inset 0 0 0 1.5px ${PAPER}` },
  }
  return (
    <a href={href} className={`pv-cta inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] ${className}`}
      style={{ fontFamily: SANS_BOLD, letterSpacing: '0.01em', ...styles[variant] }}>
      {children}
    </a>
  )
}

/** Photo reveal: clip wipes up while the image settles from a slight zoom.
 *  `eager` plays on mount (for above-the-fold photos, which are already in
 *  view at load so whileInView's IntersectionObserver never gets an "enter"
 *  crossing to fire on). Below-the-fold photos use whileInView as normal. */
function ClipPhoto({ src, alt, className, imgClassName, eager = false }: {
  src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean
}) {
  const reveal = eager
    ? { animate: { clipPath: 'inset(0 0 0% 0)' } }
    : { whileInView: { clipPath: 'inset(0 0 0% 0)' }, viewport: { once: true, margin: '-80px' } }
  const scaleReveal = eager
    ? { animate: { scale: 1 } }
    : { whileInView: { scale: 1 }, viewport: { once: true, margin: '-80px' } }
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ''}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      {...reveal}
      transition={{ duration: 1.05, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        initial={{ scale: 1.12 }}
        {...scaleReveal}
        transition={{ duration: 1.3, ease: EASE }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────── the interactive service index ── */
const SERVICE_IMGS = [IMG.paperstack, IMG.colorproof, IMG.guillotine, IMG.newspapers, IMG.redglove]
const SERVICE_ALTS = [
  'Vifta af hvítum pappírsörkum, tilbúnar í prentun',
  'Litrófssönnunarörk með mörgum litum hlið við hlið',
  'Pappír skorinn í rétta stærð í skurðarvél',
  'Stakkur af prentuðum blöðum og bæklingum',
  'Hönd í rauðum hanska við blekvalta prentvélar',
]

function ServiceIndex() {
  const [active, setActive] = useState(0)
  return (
    <section id="thjonusta" aria-labelledby="thjonusta-h" className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <h2 id="thjonusta-h" className="pv-display pv-balance m-0 max-w-[16ch] text-[clamp(2.6rem,7vw,5.5rem)]">
          <Register main={INK} ghost={RED} dx={6} dy={5}>{SERVICES_HEADING}</Register>
        </h2>
        <p className="max-w-[38ch] text-[16px] leading-relaxed md:text-right" style={{ color: GREY_TEXT }}>
          {SERVICES_INTRO}
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
        <ul className="m-0 list-none p-0" style={{ borderTop: `1px solid ${HAIR}` }}>
          {SERVICES.map((s, i) => {
            const on = i === active
            return (
              <li key={s.name} style={{ borderBottom: `1px solid ${HAIR}` }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="group flex w-full items-baseline gap-4 py-6 text-left"
                >
                  <span aria-hidden className="pv-row-mark mt-1.5 inline-block h-[11px] w-[11px] shrink-0 self-start transition-colors duration-300"
                    style={{ background: on ? RED : GREY }} />
                  <span className="min-w-0 flex-1">
                    <span className="pv-display block text-[clamp(1.5rem,3.6vw,2.3rem)] transition-transform duration-500 group-hover:translate-x-1.5"
                      style={{ color: on ? INK : GREY_TEXT }}>
                      {s.name}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          <span className="block max-w-[48ch] pt-2 text-[15px] leading-relaxed" style={{ color: GREY_TEXT }}>
                            {s.desc}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[420px]">
          <Crops color={PAPER_SOFT} inset={10} />
          <AnimatePresence initial={false}>
            <motion.img
              key={active}
              src={`${BASE}${SERVICE_IMGS[active]}`}
              alt={SERVICE_ALTS[active]}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════ the page ═ */
export default function PrentverkPage() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const pressBar = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  useEffect(() => {
    document.title = META.title
    setThemeColor(PAPER)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content = META.description
    return () => { meta.content = prev }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1 })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <div lang="is" className="pv-root min-h-[100svh] overflow-x-hidden antialiased"
      style={{ background: PAPER, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/tanker/css/tanker.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/geist-mono/css/geist-mono.css`} />
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>

      <style>{`
        .pv-root{-webkit-font-smoothing:antialiased}
        .pv-display{font-family:${DISPLAY};text-transform:uppercase;line-height:.9;letter-spacing:.005em}
        .pv-balance{text-wrap:balance}
        .pv-cta{transition:transform .16s ease,opacity .16s ease}
        .pv-cta:hover{transform:translate(0,-2px)}
        .pv-cta:active{transform:translate(0,0)}
        .pv-navlink{position:relative;padding:6px 2px;min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
        .pv-navlink::after{content:"";position:absolute;left:0;right:100%;bottom:8px;height:2px;background:${RED};transition:right .22s ease}
        .pv-navlink:hover::after{right:0}
        .pv-faq summary{cursor:pointer;list-style:none;min-height:44px}
        .pv-faq summary::-webkit-details-marker{display:none}
        .pv-faq summary .pv-faq-x{transition:transform .22s ease}
        .pv-faq[open] summary .pv-faq-x{transform:rotate(45deg)}
        .pv-root :focus-visible{outline:3px solid ${RED};outline-offset:3px}
        .pv-on-red :focus-visible{outline-color:${INK}}
        .pv-on-ink :focus-visible{outline-color:${PAPER}}
        @keyframes pv-heroZoom{from{transform:scale(1.1)}to{transform:scale(1)}}
        .pv-heroimg{animation:pv-heroZoom 2.4s cubic-bezier(0.16,1,0.3,1) both}
        @media (prefers-reduced-motion: reduce){
          .pv-root *, .pv-root *::before, .pv-root *::after{
            transition-duration:.01ms!important;animation-duration:.01ms!important}
          .pv-heroimg{animation:none}
        }
      `}</style>

      {!reduced && (
        <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
          style={{ background: RED, scaleX: pressBar }} />
      )}

      {/* ── header — flat, sharp, a printed letterhead ─────────────────────── */}
      <header className="sticky top-0 z-50" style={{ background: PAPER, borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#efst" aria-label="Prentverk Selfoss, efst á síðu" className="flex min-h-[44px] items-center">
            <img src={`${BASE}${IMG.logo}`} alt="Prentverk Selfoss" width={604} height={229} className="h-9 w-auto md:h-10" />
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="pv-navlink text-[15px]" style={{ fontFamily: SANS_MED }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={PHONE_HREF} className="hidden min-h-[44px] items-center text-[15px] sm:inline-flex"
              style={{ fontFamily: MONO_MED, color: INK }}>
              {PHONE_DISPLAY}
            </a>
            <CtaLink href="#samband" variant="red">Hafa samband</CtaLink>
          </div>
        </div>
      </header>

      <main id="efst">
        {/* ── 1 · hero — full-bleed press photo, wordmark coming into register ── */}
        <section aria-label="Prentverk Selfoss" className="relative flex min-h-[calc(100svh-72px)] flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={`${BASE}${IMG.hero}`}
              alt="Prentvél með litrófi af blekvölsum í gangi"
              className="pv-heroimg h-full w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0"
              style={{ background: `linear-gradient(to top, rgba(20,17,17,0.92) 0%, rgba(20,17,17,0.8) 22%, rgba(20,17,17,0.35) 55%, rgba(20,17,17,0.08) 82%, transparent 100%)` }} />
          </div>
          <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-14 pt-36 md:px-8 md:pb-20">
            <Crops color={PAPER_SOFT} inset={10} />
            <p className="mb-6 text-[13px]" style={{ fontFamily: MONO, color: PAPER_SOFT, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
              Prentsmiðja á Selfossi · síðan 2009
            </p>
            <h1 className="pv-display pv-balance m-0 text-[clamp(3.6rem,13vw,10rem)]">
              <Register main={PAPER} ghost={RED} block>{HERO.linja1}</Register>
              <Register main={RED} ghost={PAPER} delay={0.12} block>{HERO.linja2}</Register>
            </h1>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[34rem]">
                <p className="text-[clamp(1.2rem,2.2vw,1.5rem)] leading-snug" style={{ fontFamily: SANS_MED, color: PAPER }}>
                  {HERO.promise}
                </p>
                <p className="mt-3 text-[16px] leading-relaxed" style={{ color: PAPER_SOFT }}>{HERO.sub}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CtaLink href={PHONE_HREF} variant="red">Hringja í {PHONE_DISPLAY}</CtaLink>
                <CtaLink href={`mailto:${EMAIL}`} variant="paperline">{EMAIL}</CtaLink>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2 · trust marquee ──────────────────────────────────────────────── */}
        <div className="border-b py-4" style={{ borderColor: HAIR }}>
          <p className="mx-auto max-w-[1200px] px-5 text-center text-[11px] tracking-[0.08em] md:px-8" style={{ fontFamily: MONO, color: GREY_TEXT }}>
            {HERO.specLine}
          </p>
        </div>

        {/* ── 3 · facts strip — symmetric, mono, no arbitrary asymmetry ──────── */}
        <section aria-label="Staðreyndir" className="border-b" style={{ borderColor: HAIR }}>
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-8 md:py-16">
            {FACTS.map((f) => (
              <div key={f.label}>
                <p className="pv-display" style={{ fontSize: 'clamp(1.4rem,2.6vw,1.9rem)', color: INK }}>
                  {f.value}
                </p>
                <p className="mt-1 text-[11.5px] tracking-[0.08em] uppercase" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4 · service index — the one functional split, photo swaps live ── */}
        <ServiceIndex />

        {/* ── 5 · portfolio — real job types at true relative paper sizes ────── */}
        <section id="verkefni" aria-labelledby="verkefni-h" className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-5 pb-20 md:px-8 md:pb-28">
          <h2 id="verkefni-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7vw,5.5rem)]">
            <Register main={RED} ghost={INK} dx={6} dy={5}>{PORTFOLIO_HEADING}</Register>
          </h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ color: GREY_TEXT }}>
            {PORTFOLIO_INTRO}
          </p>

          <div className="relative mt-12 px-4 py-12 md:px-10 md:py-16" style={{ border: `1px solid ${HAIR}` }}>
            <Crops color={GREY} inset={-1} />
            <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-12 md:gap-x-14">
              {/* A4 félagsblað */}
              <figure className="m-0 w-[13.5rem] md:w-[17rem]">
                <div className="relative flex aspect-[210/297] flex-col p-[9%]"
                  style={{ background: PAPER, border: `1px solid ${INK}`, boxShadow: `6px 6px 0 rgba(35,31,32,0.08)` }}>
                  <span className="pv-display block text-[clamp(1.5rem,4.2vw,2.2rem)]" style={{ color: INK }}>Félagsblað</span>
                  <span aria-hidden className="mt-[6%] block h-[3px] w-[38%]" style={{ background: RED }} />
                  <span className="mt-[10%] block"><Greek lines={7} /></span>
                  <span className="mt-auto inline-flex self-start px-[8%] py-[3%] text-[10px] tracking-[0.1em]"
                    style={{ fontFamily: MONO_MED, background: RED, color: PAPER }}>1. TBL</span>
                </div>
                <figcaption className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                  <span style={{ fontFamily: MONO_MED, color: INK }}>{SPECIMENS.felagsblad.caption}</span> · {SPECIMENS.felagsblad.format}
                  <span className="block">{SPECIMENS.felagsblad.desc}</span>
                </figcaption>
              </figure>

              {/* A5 flugeldablað */}
              <figure className="m-0 w-[17rem] md:w-[23rem]">
                <div className="relative flex aspect-[210/148] flex-col justify-between p-[6%]"
                  style={{ background: INK, boxShadow: `6px 6px 0 rgba(35,31,32,0.08)` }}>
                  <span className="flex items-start justify-between">
                    <Burst size={40} />
                    <Burst size={26} color={PAPER} />
                  </span>
                  <span className="pv-display block text-[clamp(1.7rem,5vw,2.7rem)]" style={{ color: PAPER }}>
                    Flugelda<span style={{ color: RED }}>blaðið</span>
                  </span>
                </div>
                <figcaption className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                  <span style={{ fontFamily: MONO_MED, color: INK }}>{SPECIMENS.flugeldablad.caption}</span> · {SPECIMENS.flugeldablad.format}
                  <span className="block">{SPECIMENS.flugeldablad.desc}</span>
                </figcaption>
              </figure>

              {/* A6 jólakort */}
              <figure className="m-0 w-[8.5rem] md:w-[10.5rem]">
                <div className="relative flex aspect-[105/148] flex-col items-center justify-center gap-[8%] p-[10%] text-center"
                  style={{ background: RED, boxShadow: `6px 6px 0 rgba(35,31,32,0.08)` }}>
                  <Emblem size={26} ink={PAPER} red={INK} />
                  <span className="pv-display block text-[clamp(1.15rem,3vw,1.6rem)]" style={{ color: PAPER }}>
                    Gleðileg jól
                  </span>
                </div>
                <figcaption className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                  <span style={{ fontFamily: MONO_MED, color: INK }}>{SPECIMENS.jolakort.caption}</span> · {SPECIMENS.jolakort.format}
                  <span className="block">{SPECIMENS.jolakort.desc}</span>
                </figcaption>
              </figure>

              {/* nafnspjald */}
              <figure className="m-0 w-[12rem] md:w-[13.5rem]">
                <div className="relative flex aspect-[85/55] items-center gap-[6%] p-[7%]"
                  style={{ background: PAPER, border: `1px solid ${INK}`, boxShadow: `6px 6px 0 rgba(35,31,32,0.08)` }}>
                  <Emblem size={30} />
                  <span className="min-w-0">
                    <span className="pv-display block text-[15px] leading-tight" style={{ color: INK }}>Prentverk Selfoss</span>
                    <span className="mt-[4%] block text-[9.5px] tracking-[0.04em]" style={{ fontFamily: MONO_MED, color: RED }}>
                      898 3877 · pvs@pvs.is
                    </span>
                  </span>
                </div>
                <figcaption className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                  <span style={{ fontFamily: MONO_MED, color: INK }}>{SPECIMENS.nafnspjald.caption}</span> · {SPECIMENS.nafnspjald.format}
                  <span className="block">{SPECIMENS.nafnspjald.desc}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── 6 · craft — full-bleed, the hand on the rollers ────────────────── */}
        <section aria-labelledby="why-h" className="relative overflow-hidden">
          <ClipPhoto
            src={`${BASE}${IMG.inkhand}`}
            alt="Hönd leggur rautt blek á prentplötu"
            className="absolute inset-0"
            imgClassName=""
            eager
          />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(35,31,32,0.88) 0%, rgba(35,31,32,0.72) 42%, rgba(209,35,42,0.55) 100%)' }} />
          <div className="pv-on-red relative mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
            <div className="max-w-2xl">
              <h2 id="why-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7.5vw,6rem)]" style={{ color: PAPER }}>
                {WHY_HEADING_A} {WHY_HEADING_B}
              </h2>
              <p className="mt-6 max-w-[56ch] text-[18px] leading-relaxed" style={{ fontFamily: SANS_MED, color: PAPER }}>
                {WHY_INTRO}
              </p>
              <div className="mt-12 grid gap-8 sm:grid-cols-3">
                {WHY_POINTS.map((p) => (
                  <div key={p.title}>
                    <h3 className="pv-display m-0 text-[clamp(1.2rem,2.4vw,1.6rem)]" style={{ color: PAPER }}>{p.title}</h3>
                    <p className="m-0 mt-2 text-[15px] leading-relaxed" style={{ color: PAPER_SOFT }}>{p.body}</p>
                  </div>
                ))}
              </div>
              <a href={PHONE_HREF} className="pv-display mt-12 inline-flex min-h-[44px] items-center text-[clamp(2.2rem,7vw,4.5rem)] leading-none"
                style={{ color: PAPER, textDecorationColor: PAPER }}>
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* ── 7 · process ──────────────────────────────────────────────────── */}
        <section id="ferlid" aria-labelledby="ferlid-h" className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <h2 id="ferlid-h" className="pv-display pv-balance m-0 max-w-[14ch] text-[clamp(2.6rem,7vw,5.5rem)]">
              <Register main={INK} ghost={RED} dx={6} dy={5}>{PROCESS_HEADING}</Register>
            </h2>
            <p className="max-w-[34ch] text-[16px] leading-relaxed md:text-right" style={{ color: GREY_TEXT }}>
              {PROCESS_INTRO}
            </p>
          </div>
          <ol className="relative m-0 grid list-none gap-10 p-0 md:grid-cols-4 md:gap-8">
            <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-16px)] w-px md:left-0 md:top-[5px] md:h-px md:w-full"
              style={{ background: HAIR }} />
            {PROCESS.map((p, i) => (
              <li key={p.step} className="relative pl-8 md:pl-0 md:pt-8">
                <span aria-hidden className="absolute left-0 top-2 h-[11px] w-[11px] md:top-0"
                  style={{ background: i === 1 ? RED : INK }} />
                <span className="text-[12px] tracking-[0.1em]" style={{ fontFamily: MONO_MED, color: i === 1 ? RED : GREY_TEXT }}>
                  {p.step.toUpperCase()}
                </span>
                <h3 className="pv-display m-0 mt-2 text-[1.55rem]" style={{ color: INK }}>{p.title}</h3>
                <p className="m-0 mt-3 max-w-[36ch] text-[15.5px] leading-relaxed" style={{ color: GREY_TEXT }}>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 8 · about — balanced split, text and a real interior photo ────── */}
        <section id="um-okkur" aria-labelledby="um-h" className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-5 pb-20 md:px-8 md:pb-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <h2 id="um-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7vw,5rem)]">
                <Register main={INK} ghost={RED} dx={6} dy={5}>{ABOUT_HEADING}</Register>
              </h2>
              {ABOUT_BODY.map((p) => (
                <p key={p.slice(0, 18)} className="mt-6 max-w-[58ch] text-[17px] leading-relaxed">{p}</p>
              ))}
              <div className="mt-8 flex items-center gap-3">
                <Emblem size={30} />
                <span className="pv-display text-[1.2rem]" style={{ color: INK }}>Prentverk Selfoss ehf</span>
              </div>
            </div>
            <ClipPhoto
              src={`${BASE}${IMG.interior}`}
              alt="Nútímalegt prentverkstæði með vélum og vinnusvæði"
              className="aspect-[4/3] md:aspect-auto md:min-h-[420px]"
            />
          </div>
        </section>

        {/* ── 9 · service area — one loud typographic band ─────────────────── */}
        <section aria-labelledby="svaedi-h" className="mx-auto w-full max-w-[1200px] px-5 pb-20 md:px-8 md:pb-28">
          <div className="py-14 md:py-20" style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
            <h2 id="svaedi-h" className="pv-display pv-balance m-0 text-center text-[clamp(2.8rem,9.5vw,7.5rem)]">
              <Register main={INK} ghost={RED} block>{AREA_LINE_A}</Register>
              <Register main={RED} ghost={INK} delay={0.1} block>{AREA_LINE_B}</Register>
            </h2>
            <p className="mx-auto mt-6 max-w-[46ch] text-center text-[16px] leading-relaxed" style={{ color: GREY_TEXT }}>
              {AREA_BODY}
            </p>
          </div>
        </section>

        {/* ── 10 · FAQ ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-h" className="mx-auto w-full max-w-[820px] px-5 pb-20 md:px-8 md:pb-28">
          <h2 id="faq-h" className="pv-display pv-balance m-0 text-[clamp(2.2rem,6vw,4rem)]">
            <Register main={INK} ghost={RED} dx={5} dy={4}>{FAQ_HEADING}</Register>
          </h2>
          <div className="mt-8" style={{ borderTop: `1px solid ${HAIR}` }}>
            {FAQ.map((f) => (
              <details key={f.q} className="pv-faq" style={{ borderBottom: `1px solid ${HAIR}` }}>
                <summary className="flex items-center justify-between gap-6 py-5 text-[17px]" style={{ fontFamily: SANS_MED }}>
                  {f.q}
                  <span aria-hidden className="pv-faq-x shrink-0 text-[22px] leading-none" style={{ color: RED, fontFamily: MONO }}>+</span>
                </summary>
                <p className="m-0 max-w-[58ch] pb-6 text-[16px] leading-relaxed" style={{ color: GREY_TEXT }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 11 · contact — full-bleed, the real building ───────────────────── */}
        <section id="samband" aria-labelledby="samband-h" className="pv-on-ink relative scroll-mt-20 overflow-hidden">
          <ClipPhoto
            src={`${BASE}${IMG.husid}`}
            alt={CONTACT_PHOTO_CAPTION}
            className="absolute inset-0"
            imgClassName="grayscale contrast-[1.05]"
            eager
          />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(35,31,32,0.55) 0%, rgba(35,31,32,0.88) 65%, rgba(35,31,32,0.96) 100%)' }} />
          <div className="relative mx-auto w-full max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
            <h2 id="samband-h" className="pv-display pv-balance m-0 text-[clamp(3rem,10vw,7rem)]" style={{ color: PAPER }}>
              {CONTACT_HEADING_A} {CONTACT_HEADING_B}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed" style={{ color: PAPER_SOFT }}>{CONTACT_SUB}</p>
            <dl className="m-0 mt-10 grid max-w-2xl gap-y-5 text-[16px] sm:grid-cols-2" style={{ borderTop: `1px solid ${HAIR_LT}` }}>
              {[
                { t: 'Sími', d: <a href={PHONE_HREF} style={{ fontFamily: MONO_MED, color: PAPER }} className="inline-flex min-h-[44px] items-center text-[20px]">{PHONE_DISPLAY}</a> },
                { t: 'Netfang', d: <a href={`mailto:${EMAIL}`} style={{ fontFamily: MONO_MED, color: PAPER }} className="inline-flex min-h-[44px] items-center text-[20px]">{EMAIL}</a> },
                { t: 'Heimilisfang', d: <span style={{ color: PAPER }}>{ADDRESS}</span> },
                { t: 'Opnunartími', d: <span style={{ color: PAPER }}>{HOURS_SHORT}</span> },
              ].map((r) => (
                <div key={r.t} className="grid grid-cols-[7.5rem_1fr] items-center gap-4 pt-4" style={{ borderBottom: `1px solid ${HAIR_LT}` }}>
                  <dt className="text-[12px] tracking-[0.1em]" style={{ fontFamily: MONO, color: 'rgba(250,250,247,0.6)' }}>{r.t.toUpperCase()}</dt>
                  <dd className="m-0 pb-4">{r.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 12 · closing plate — full red ────────────────────────────────── */}
        <section aria-label="Lokakall" className="pv-on-red" style={{ background: RED, color: PAPER }}>
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
            <h2 className="pv-display pv-balance m-0 text-[clamp(3.4rem,13vw,10rem)]">
              <Register main={INK} ghost={PAPER} dx={11} dy={8}>{CLOSING_LINE}</Register>
            </h2>
            <p className="mt-5 text-[16px]" style={{ fontFamily: MONO, color: PAPER }}>{CLOSING_SUB}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CtaLink href={PHONE_HREF} variant="paper">Hringja í {PHONE_DISPLAY}</CtaLink>
              <CtaLink href={`mailto:${EMAIL}`} variant="paperline">Senda fyrirspurn</CtaLink>
            </div>
          </div>
        </section>
      </main>

      {/* ── footer — the imprint ───────────────────────────────────────────── */}
      <footer className="pv-on-ink" style={{ background: INK, color: PAPER }}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <img src={`${BASE}${IMG.logo}`} alt="Prentverk Selfoss" width={604} height={229} className="h-10 w-auto self-start md:self-auto"
            style={{ filter: 'brightness(0) invert(0.97)' }} />
          <p className="m-0 text-[11.5px] leading-relaxed tracking-[0.06em]" style={{ fontFamily: MONO, color: 'rgba(250,250,247,0.6)' }}>
            PRENTVERK SELFOSS EHF · KT. 470909-0990 · {ADDRESS.toUpperCase()}
            <span className="block">{FOOTER_CREDIT.toUpperCase()}</span>
          </p>
        </div>
      </footer>

      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
