import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ABOUT_BODY, ABOUT_FACTS, ABOUT_HEADING, ADDRESS, AREA_BODY, AREA_LINE_A, AREA_LINE_B,
  CLOSING_LINE, CLOSING_SUB, CONTACT_HEADING_A, CONTACT_HEADING_B, CONTACT_PHOTO_CAPTION,
  CONTACT_SUB, EMAIL, FAQ, FAQ_HEADING, FOOTER_CREDIT, HERO, HOURS_SHORT, IMG, JSON_LD,
  META, NAV, PHONE_DISPLAY, PHONE_HREF, PORTFOLIO_HEADING, PORTFOLIO_INTRO, PROCESS,
  PROCESS_HEADING, PROCESS_INTRO, SERVICES, SERVICES_HEADING, SERVICES_INTRO, SPECIMENS,
  WHY_HEADING_A, WHY_HEADING_B, WHY_INTRO, WHY_POINTS,
} from './data'

const company = getPreviewCompany('prentverk')

/* ── YFIRPRENT — a two-colour print house, set like a piece of two-colour
      print. Paper ground, spot red + ink black doing all the work. Display
      type arrives as two misregistered colour separations that slide into
      perfect register, like a press being dialed in. ── */

const PAPER = '#FAFAF7' // true off-white paper, chroma near zero
const RED = '#D1232A' // their sampled print red
const INK = '#231F20' // their sampled ink black
const GREY = '#8E8B88' // halftone grey — hairlines, marks, large mono labels only
const GREY_TEXT = 'rgba(35,31,32,0.74)' // AA-safe secondary body on paper
const PAPER_SOFT = 'rgba(250,250,247,0.78)' // AA-safe secondary body on ink/red

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Tanker-Regular', 'Arial Narrow', sans-serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'GeistMono-Regular', ui-monospace, monospace"
const MONO_MED = "'GeistMono-Medium', ui-monospace, monospace"

const HAIR = 'rgba(35,31,32,0.16)' // ink hairline on paper
const HAIR_LT = 'rgba(250,250,247,0.28)' // paper hairline on ink/red

/* ─────────────────────────────────── the signature: coming into register ── */
/** Two colour separations, misregistered by a few px, sliding into perfect
 *  register as they enter the viewport. Solid layers only — no blend modes
 *  (animated ancestors silently isolate them). Reduced motion = instant. */
function Register({ children, main, ghost, dx = 9, dy = 7, delay = 0, block = false, style }: {
  children: ReactNode; main: string; ghost: string; dx?: number; dy?: number
  delay?: number; block?: boolean; style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const
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
        transition={{ duration: 1.05, delay, ease }}
      >
        {children}
      </motion.span>
      <motion.span
        className="relative inline-block"
        style={{ color: main }}
        initial={{ x: dx * 0.55, y: -dy * 0.55 }}
        whileInView={{ x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.05, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* ─────────────────────────────────────────────── small print-trade pieces ── */
/** Crop marks — four corner ticks, used sparingly (hero sheet, specimens, photo). */
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

/** Eight-spoke firework burst for the flugeldablað specimen. */
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

/** Greeked body text on the specimen sheets — grey halftone bars. */
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

/** Photo reveal: clip wipes up while the image settles from a slight zoom.
 *  `eager` plays on mount (for above-the-fold photos, which are already in
 *  view at load so whileInView's IntersectionObserver never gets an "enter"
 *  crossing to fire on — see the whileInView self-clip gotcha). Below-the-
 *  fold photos use the default whileInView, scrolled into view normally. */
function ClipPhoto({ src, alt, className, imgClassName, eager = false }: {
  src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean
}) {
  const ease = [0.16, 1, 0.3, 1] as const
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
      transition={{ duration: 1.05, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        initial={{ scale: 1.12 }}
        {...scaleReveal}
        transition={{ duration: 1.3, ease }}
      />
    </motion.div>
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
        .pv-row{transition:background .22s ease,color .22s ease}
        .pv-row:hover{background:${INK}}
        .pv-row:hover .pv-row-name{color:${PAPER}}
        .pv-row:hover .pv-row-desc{color:${PAPER_SOFT}}
        .pv-row:hover .pv-row-mark{background:${RED}}
        .pv-faq summary{cursor:pointer;list-style:none;min-height:44px}
        .pv-faq summary::-webkit-details-marker{display:none}
        .pv-faq summary .pv-faq-x{transition:transform .22s ease}
        .pv-faq[open] summary .pv-faq-x{transform:rotate(45deg)}
        .pv-root :focus-visible{outline:3px solid ${RED};outline-offset:3px}
        .pv-on-red :focus-visible{outline-color:${INK}}
        .pv-on-ink :focus-visible{outline-color:${PAPER}}
        @media (prefers-reduced-motion: reduce){
          .pv-root *, .pv-root *::before, .pv-root *::after{
            transition-duration:.01ms!important;animation-duration:.01ms!important}
        }
      `}</style>

      {/* the press bar — a thin red line filling as the sheet runs through */}
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
        {/* ── 1 · hero — the wordmark coming into register, beside the press ── */}
        <section aria-label="Prentverk Selfoss" className="relative flex min-h-[calc(100svh-72px)] flex-col">
          <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 gap-10 px-5 py-14 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 md:px-8 md:py-20">
            <Crops color={GREY} inset={10} />
            <div>
              <p className="mb-6 text-[13px]" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                Prentsmiðja á Selfossi · síðan 2009
              </p>
              <h1 className="pv-display pv-balance m-0 text-[clamp(3.4rem,12.5vw,8.5rem)]">
                <Register main={INK} ghost={RED} block>{HERO.linja1}</Register>
                <Register main={RED} ghost={INK} delay={0.12} block>{HERO.linja2}</Register>
              </h1>
              <div className="mt-10 flex flex-col gap-8">
                <div className="max-w-[34rem]">
                  <p className="text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug" style={{ fontFamily: SANS_MED }}>
                    {HERO.promise}
                  </p>
                  <p className="mt-3 text-[17px] leading-relaxed" style={{ color: GREY_TEXT }}>{HERO.sub}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <CtaLink href={PHONE_HREF} variant="red">Hringja í {PHONE_DISPLAY}</CtaLink>
                  <CtaLink href={`mailto:${EMAIL}`} variant="ink">{EMAIL}</CtaLink>
                </div>
              </div>
            </div>
            <figure className="m-0">
              <ClipPhoto
                src={`${BASE}${IMG.hero}`}
                alt="Prentvél með litrófi af blekvölsum í gangi"
                className="aspect-[3/4] md:aspect-[4/5]"
                eager
              />
              <figcaption className="mt-3 text-[11.5px] tracking-[0.06em]" style={{ fontFamily: MONO, color: GREY_TEXT }}>
                PRENTVERK Á FULLRI FERÐ
              </figcaption>
            </figure>
          </div>
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 pb-5 md:px-8"
            style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="pt-4 text-[11px] tracking-[0.08em]" style={{ fontFamily: MONO, color: GREY_TEXT }}>
              {HERO.specLine}
            </p>
            <div className="hidden pt-4 md:block"><Emblem size={30} /></div>
          </div>
        </section>

        {/* ── 2 · services — a price list without the prices ───────────────── */}
        <section id="thjonusta" aria-labelledby="thjonusta-h" className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <h2 id="thjonusta-h" className="pv-display pv-balance m-0 max-w-[16ch] text-[clamp(2.6rem,7vw,5.5rem)]">
              <Register main={INK} ghost={RED} dx={6} dy={5}>{SERVICES_HEADING}</Register>
            </h2>
            <p className="max-w-[38ch] text-[16px] leading-relaxed md:text-right" style={{ color: GREY_TEXT }}>
              {SERVICES_INTRO}
            </p>
          </div>
          <ul className="m-0 list-none p-0" style={{ borderTop: `1px solid ${HAIR}` }}>
            {SERVICES.map((s) => (
              <li key={s.name} className="pv-row" style={{ borderBottom: `1px solid ${HAIR}` }}>
                <div className="grid gap-2 px-2 py-7 md:grid-cols-[1.1fr_1fr] md:items-baseline md:gap-10 md:px-4 md:py-9">
                  <span className="flex items-baseline gap-4">
                    <span aria-hidden className="pv-row-mark inline-block h-[11px] w-[11px] shrink-0 self-center" style={{ background: RED }} />
                    <span className="pv-display pv-row-name text-[clamp(1.7rem,4.6vw,3rem)]" style={{ color: INK }}>
                      {s.name}
                    </span>
                  </span>
                  <span className="pv-row-desc max-w-[52ch] text-[16px] leading-relaxed" style={{ color: GREY_TEXT }}>
                    {s.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 3 · portfolio — real job types at true relative paper sizes ──── */}
        <section id="verkefni" aria-labelledby="verkefni-h" className="mx-auto w-full max-w-[1200px] px-5 pb-20 md:px-8 md:pb-28">
          <h2 id="verkefni-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7vw,5.5rem)]">
            <Register main={RED} ghost={INK} dx={6} dy={5}>{PORTFOLIO_HEADING}</Register>
          </h2>
          <div className="mt-5 grid gap-8 md:grid-cols-[1fr_minmax(0,20rem)] md:items-start md:gap-12">
            <p className="max-w-[62ch] text-[17px] leading-relaxed" style={{ color: GREY_TEXT }}>
              {PORTFOLIO_INTRO}
            </p>
            <figure className="m-0 hidden md:block">
              <ClipPhoto
                src={`${BASE}${IMG.newspapers}`}
                alt="Stakkur af prentuðum blöðum og bæklingum"
                className="aspect-[4/3]"
              />
            </figure>
          </div>

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

        {/* ── 4 · why local — red plate beside a real hand inking a plate ──── */}
        <section aria-labelledby="why-h" className="pv-on-red relative overflow-hidden" style={{ background: RED, color: PAPER }}>
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-start md:gap-14 md:px-8 md:py-28">
            <div>
              <h2 id="why-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7.5vw,6rem)]">
                <Register main={PAPER} ghost={INK} block>{WHY_HEADING_A}</Register>
                <Register main={INK} ghost={PAPER} delay={0.1} block>{WHY_HEADING_B}</Register>
              </h2>
              <p className="mt-6 max-w-[56ch] text-[18px] leading-relaxed" style={{ fontFamily: SANS_MED }}>
                {WHY_INTRO}
              </p>
              <div className="mt-14" style={{ borderTop: `1px solid ${HAIR_LT}` }}>
                {WHY_POINTS.map((p) => (
                  <div key={p.title} className="grid gap-2 py-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] md:gap-10 md:py-8"
                    style={{ borderBottom: `1px solid ${HAIR_LT}` }}>
                    <h3 className="pv-display m-0 text-[clamp(1.5rem,3.6vw,2.3rem)]" style={{ color: PAPER }}>{p.title}</h3>
                    <p className="m-0 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: PAPER }}>{p.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-14 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <p className="m-0 text-[14px]" style={{ fontFamily: MONO, color: PAPER }}>
                  Beint samband, ekkert þjónustuver
                </p>
                <a href={PHONE_HREF} className="pv-display inline-flex min-h-[44px] items-center text-[clamp(2.6rem,9vw,6rem)] leading-none"
                  style={{ color: INK, textDecorationColor: INK }}>
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <figure className="m-0 hidden md:block">
              <div className="sticky top-24">
                <ClipPhoto
                  src={`${BASE}${IMG.inkhand}`}
                  alt="Hönd leggur rautt blek á prentplötu"
                  className="aspect-[3/4]"
                />
                <figcaption className="mt-3 text-[11.5px] tracking-[0.06em]" style={{ fontFamily: MONO, color: PAPER_SOFT }}>
                  HANDVERKIÐ Á BAK VIÐ HVERT VERK
                </figcaption>
              </div>
            </figure>
          </div>
        </section>

        {/* ── 5 · the craft — from file to finished piece ──────────────────── */}
        <section id="ferlid" aria-labelledby="ferlid-h" className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_minmax(0,15rem)] md:items-end md:gap-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 id="ferlid-h" className="pv-display pv-balance m-0 max-w-[14ch] text-[clamp(2.6rem,7vw,5.5rem)]">
                <Register main={INK} ghost={RED} dx={6} dy={5}>{PROCESS_HEADING}</Register>
              </h2>
              <p className="max-w-[34ch] text-[16px] leading-relaxed md:text-right" style={{ color: GREY_TEXT }}>
                {PROCESS_INTRO}
              </p>
            </div>
            <figure className="m-0 hidden md:block">
              <ClipPhoto src={`${BASE}${IMG.paperstack}`} alt="Vifta af hvítum pappírsörkum" className="aspect-[4/3]" />
            </figure>
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

        {/* ── 6 · about + colophon ─────────────────────────────────────────── */}
        <section id="um-okkur" aria-labelledby="um-h" className="mx-auto w-full max-w-[1200px] px-5 pb-20 md:px-8 md:pb-28">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <h2 id="um-h" className="pv-display pv-balance m-0 text-[clamp(2.6rem,7vw,5rem)]">
                <Register main={INK} ghost={RED} dx={6} dy={5}>{ABOUT_HEADING}</Register>
              </h2>
              {ABOUT_BODY.map((p) => (
                <p key={p.slice(0, 18)} className="mt-6 max-w-[62ch] text-[17px] leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="self-end">
              <div className="p-6 md:p-8" style={{ border: `1px solid ${INK}` }}>
                <div className="flex items-center justify-between gap-4">
                  <span className="pv-display text-[1.3rem]" style={{ color: INK }}>Prentverk Selfoss ehf</span>
                  <Emblem size={30} />
                </div>
                <ul className="m-0 mt-5 list-none p-0">
                  {ABOUT_FACTS.map((f) => (
                    <li key={f} className="py-2.5 text-[12.5px] tracking-[0.06em]"
                      style={{ fontFamily: MONO, color: GREY_TEXT, borderTop: `1px solid ${HAIR}` }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · service area — one loud typographic band ─────────────────── */}
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

        {/* ── 8 · FAQ ──────────────────────────────────────────────────────── */}
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

        {/* ── 9 · contact — the ink plate ──────────────────────────────────── */}
        <section id="samband" aria-labelledby="samband-h" className="pv-on-ink" style={{ background: INK, color: PAPER }}>
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-20 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-16 md:px-8 md:py-28">
            <div>
              <h2 id="samband-h" className="pv-display pv-balance m-0 text-[clamp(3rem,10vw,7rem)]">
                <Register main={PAPER} ghost={RED} block>{CONTACT_HEADING_A}</Register>
                <Register main={RED} ghost={PAPER} delay={0.1} block>{CONTACT_HEADING_B}</Register>
              </h2>
              <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed" style={{ color: PAPER_SOFT }}>{CONTACT_SUB}</p>
              <dl className="m-0 mt-10 grid gap-y-5 text-[16px]" style={{ borderTop: `1px solid ${HAIR_LT}` }}>
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
            <figure className="m-0">
              <div className="relative">
                <Crops color={PAPER_SOFT} inset={-9} />
                <img src={`${BASE}${IMG.husid}`} alt={CONTACT_PHOTO_CAPTION} loading="lazy" width={1200} height={600}
                  className="block w-full" style={{ filter: 'grayscale(1) contrast(1.06)', border: `1px solid ${HAIR_LT}` }} />
              </div>
              <figcaption className="mt-4 text-[12px] tracking-[0.06em]" style={{ fontFamily: MONO, color: 'rgba(250,250,247,0.6)' }}>
                {CONTACT_PHOTO_CAPTION.toUpperCase()}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 10 · closing plate — full red ────────────────────────────────── */}
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
