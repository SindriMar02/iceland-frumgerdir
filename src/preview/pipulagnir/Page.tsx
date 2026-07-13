/* ─── Pípulagnir Suðurlands · „HEITT OG KALT" ────────────────────────────
   The red and blue tap markers every Icelandic household knows become the
   design system: warm and cool grounds alternate down the page the way hot
   and cold water run through a house, and a thin rail on the left edge
   fills red through warm sections and blue through cool ones as you scroll.

   FONT NOTE FOR THE LEAD — this page self-loads Archivo (variable, expanded
   width) from Google Fonts in a useEffect. To move it into index.html, add:
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..900&display=swap" rel="stylesheet" />
   Optional @theme token for index.css:
     --font-archivo: 'Archivo', 'Arial Black', sans-serif;
   Satoshi + Geist Mono load from the repo's own public/fonts. ─────────── */
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import {
  ABOUT,
  ADDRESS,
  COLD,
  CONTACT,
  EMAIL,
  FACTS,
  FOOTNOTE,
  HEAT,
  HERO,
  IMG,
  LOGO,
  MAPS,
  PHONE2_DISPLAY,
  PHONE2_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  SEO,
  SERVICES,
  u,
} from './data'

const company = getPreviewCompany('pipulagnir')

/* Palette — AA verified 2026-07-13 (WCAG relative-luminance math):
   ink on bone 15.55 · red #921B1E on bone 7.83 · blue #1E4E63 on bone 8.08
   white on red 8.76 · white on blue 9.03 · bone on near-black 16.38
   muted #5F5B54 on bone 6.04 · muted #A8A49C on near-black 7.38
   warm tint #E89B94 on dark 8.33 · cool tint #9CC6DA on dark 10.03
   red-tint text #F0C9C7 on red 5.79 · blue-tint #BFD9E4 on blue 6.13 */
const BONE = '#F4F2EE'
const INK = '#1B1A18'
const RED = '#921B1E'
const BLUE = '#1E4E63'
const DARK = '#141513'
const MUT = '#5F5B54'
const MUTD = '#A8A49C'
const WARM_TINT = '#E89B94'
const COOL_TINT = '#9CC6DA'
const RED_TINT = '#F0C9C7'
const BLUE_TINT = '#BFD9E4'
const HAIR = 'rgba(27,26,24,0.14)'

const DISPLAY = "'Archivo', 'Arial Black', Arial, sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
/* Icelandic caps (Í Á Ó Ú Ý Þ Æ Ö): open leading, normal tracking, no clip
   masks over headline glyphs anywhere on this page. */
const H_DISPLAY = { fontFamily: DISPLAY, fontWeight: 800, fontStretch: '125%', letterSpacing: '0', lineHeight: 1.06 } as const

const B = import.meta.env.BASE_URL
const EASE = [0.23, 1, 0.32, 1] as const
const ARCHIVO_HREF = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..900&display=swap'

const CSS = `
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

.ps-page { background: ${BONE}; color: ${INK}; }
.ps-page ::selection { background: ${RED}; color: #FFFFFF; }
.ps-page a, .ps-page button, .ps-page input, .ps-page textarea { -webkit-tap-highlight-color: transparent; }
.ps-page :focus-visible { outline: 2px solid ${BLUE}; outline-offset: 3px; border-radius: 2px; }
.ps-dark :focus-visible { outline-color: ${COOL_TINT}; }

/* hero photo settles in on load; scrim keeps the headline zone readable */
@keyframes ps-heroZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
.ps-heroimg { animation: ps-heroZoom 2.6s cubic-bezier(0.23, 1, 0.32, 1) both; }
@media (prefers-reduced-motion: reduce) { .ps-heroimg { animation: none; } }
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Clip-path image reveal. The observer sits on an UNCLIPPED wrapper —
    IntersectionObserver never fires on elements that clip themselves away. */
function ClipImage({
  id,
  alt,
  className,
  w = 1600,
  sizes,
}: {
  id: string
  alt: string
  className?: string
  w?: number
  sizes?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-90px' })
  const reduced = useReducedMotion()
  const img = (
    <Img
      src={u(id, w)}
      srcSet={`${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`}
      sizes={sizes ?? '(min-width: 768px) 50vw, 100vw'}
      alt={alt}
      className="h-full w-full object-cover"
    />
  )
  if (reduced) return <div className={`overflow-hidden ${className ?? ''}`}>{img}</div>
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.12 }}
          animate={{ scale: inView ? 1 : 1.12 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {img}
        </motion.div>
      </motion.div>
    </div>
  )
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const mv = useMotionValue(0)
  const final = String(to) + suffix
  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduced) {
      ref.current.textContent = final
      return
    }
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: v => {
        if (ref.current) ref.current.textContent = String(Math.round(v)) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, suffix, mv, final])
  return (
    <span ref={ref} aria-label={final}>
      {reduced || inView ? final : '0' + suffix}
    </span>
  )
}

/* ──────────────── SIGNATURE: the hot/cold temperature rail ────────────────
   A thin vertical line fixed to the page's left edge. As you scroll, a fill
   grows from the top; it runs RED through warm sections and BLUE through
   cool ones. Section markers are the round red/blue tap dots. Mechanism:
   one synchronous passive scroll handler writing transform + background
   directly to the DOM (no Framer useScroll, no rAF loop, per the ledger). */

const RAIL: { id: string; temp: 'hot' | 'cold' }[] = [
  { id: 'efst', temp: 'hot' },
  { id: 'tolur', temp: 'hot' },
  { id: 'thjonusta', temp: 'cold' },
  { id: 'golfhiti', temp: 'hot' },
  { id: 'udakerfi', temp: 'cold' },
  { id: 'um-okkur', temp: 'hot' },
  { id: 'umsagnir', temp: 'cold' },
  { id: 'hafa-samband', temp: 'hot' },
]

function TempRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [positions, setPositions] = useState<number[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    let offsets: number[] = []
    let pct: number[] = []

    const onScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / scrollable))
      const probe = window.scrollY + window.innerHeight * 0.45
      let temp: 'hot' | 'cold' = 'hot'
      for (let i = 0; i < offsets.length; i++) {
        if (probe >= offsets[i]) temp = RAIL[i].temp
      }
      const fill = fillRef.current
      if (fill) {
        fill.style.transform = `scaleY(${p})`
        fill.style.backgroundColor = temp === 'hot' ? RED : BLUE
      }
      for (let i = 0; i < dotRefs.current.length; i++) {
        const d = dotRefs.current[i]
        if (d) d.style.opacity = p >= (pct[i] ?? 0) - 0.002 ? '1' : '0.35'
      }
    }

    const measure = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      offsets = RAIL.map(s => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      pct = offsets.map(o => Math.min(0.97, o / scrollable))
      setPositions(pct)
      if (!reduced) onScroll()
    }

    measure()
    const t = window.setTimeout(measure, 900)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      if (!reduced) window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-0 left-2 top-0 z-40 w-[3px] md:left-4">
      <div className="absolute inset-0" style={{ background: HAIR }} />
      {!reduced && <div ref={fillRef} className="absolute inset-0 origin-top" style={{ background: RED, transform: 'scaleY(0)', transition: 'background-color 0.45s ease' }} />}
      {positions.map((p, i) => (
        <span
          key={RAIL[i].id}
          ref={el => {
            dotRefs.current[i] = el
          }}
          className="absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full"
          style={{
            top: `${p * 100}%`,
            background: RAIL[i].temp === 'hot' ? RED : BLUE,
            boxShadow: `0 0 0 3px ${BONE}`,
            opacity: reduced ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────── sections ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -68 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  const link = 'hidden items-center min-h-11 px-3 text-[13px] tracking-[0.12em] uppercase md:inline-flex'
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-shadow duration-500"
      style={{ background: BONE, borderBottom: `1px solid ${solid ? HAIR : 'transparent'}` }}
    >
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-5 md:px-8">
        <a href="#efst" onClick={go('#efst')} className="inline-flex min-h-11 items-center" aria-label="Pípulagnir Suðurlands, efst á síðu">
          <img src={LOGO} alt="Pípulagnir Suðurlands" className="h-8 w-auto md:h-9" />
        </a>
        <nav className="flex items-center gap-1 md:gap-2" style={{ fontFamily: MONO, color: MUT }} aria-label="Aðalvalmynd">
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>Þjónusta</a>
          <a href="#golfhiti" onClick={go('#golfhiti')} className={link}>Gólfhiti</a>
          <a href="#um-okkur" onClick={go('#um-okkur')} className={link}>Um okkur</a>
          <a
            href={PHONE_HREF}
            className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-4 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ background: RED, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const reduced = useReducedMotion()
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        }
  return (
    <section id="efst" className="relative flex min-h-[100svh] items-end overflow-hidden" style={{ background: DARK }}>
      <div className="absolute inset-0">
        <Img
          src={u(IMG.hero, 1280)}
          srcSet={`${u(IMG.hero, 828)} 828w, ${u(IMG.hero, 1280)} 1280w, ${u(IMG.hero, 2000)} 2000w`}
          sizes="100vw"
          alt={HERO.alt}
          loading="eager"
          fetchpriority="high"
          className="ps-heroimg h-full w-full object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${DARK} 6%, rgba(20,21,19,0.86) 28%, rgba(20,21,19,0.4) 60%, rgba(20,21,19,0.62) 100%)`,
        }}
      />
      <div className="ps-dark relative mx-auto w-full max-w-[1280px] px-5 pb-24 pt-32 md:px-8 md:pb-28">
        <motion.p
          className="mb-5 flex items-center gap-3 text-[12.5px] tracking-[0.2em] uppercase"
          style={{ fontFamily: MONO, color: MUTD }}
          {...enter(0.2)}
        >
          <span aria-hidden className="inline-flex items-center gap-1.5">
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: '#C4453F' }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: '#4E90AC' }} />
          </span>
          {HERO.eyebrow}
        </motion.p>
        {/* open leading + zero tracking + no clip masks: Í Á Ó accents stay whole */}
        <h1 className="max-w-5xl text-balance text-white" style={{ ...H_DISPLAY, fontSize: 'clamp(2.9rem, 9vw, 5.9rem)' }}>
          {[
            { t: HERO.headlineHot, c: WARM_TINT },
            { t: HERO.headlineAnd, c: '#FFFFFF' },
            { t: HERO.headlineCold, c: COOL_TINT },
            { t: HERO.headlineTail, c: '#FFFFFF' },
          ].map((w, i) => (
            <motion.span key={i} className="inline-block" style={{ color: w.c }} {...enter(0.3 + i * 0.1)}>
              {w.t}
              {' '}
            </motion.span>
          ))}
        </h1>
        <motion.p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white md:text-lg" style={{ fontFamily: BODY }} {...enter(0.72)}>
          {HERO.sub}
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...enter(0.86)}>
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[52px] items-center gap-2.5 rounded-sm px-7 text-[16px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ background: RED, fontFamily: BODY }}
          >
            <Phone size={17} strokeWidth={2.4} aria-hidden />
            {HERO.ctaPrimary} í {PHONE_DISPLAY}
          </a>
          <a
            href="#hafa-samband"
            className="inline-flex min-h-[52px] items-center rounded-sm border px-7 text-[16px] font-medium text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ borderColor: 'rgba(244,242,238,0.45)', background: 'rgba(20,21,19,0.45)', fontFamily: BODY }}
          >
            {HERO.ctaSecondary}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section id="tolur" className="border-b" style={{ borderColor: HAIR }}>
      <h2 className="sr-only">Fyrirtækið í tölum</h2>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {FACTS.map((f, i) => (
          <Rise key={f.label} delay={i * 0.08}>
            <p className="leading-none tabular-nums" style={{ fontFamily: MONO, color: RED, fontSize: f.num !== null ? 'clamp(2.6rem, 5vw, 3.8rem)' : 'clamp(1.5rem, 3vw, 2.1rem)' }}>
              {f.num !== null ? <CountUp to={f.num} suffix={f.suffix} /> : f.text}
            </p>
            <p className="mt-3 text-[13px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              {f.label}
            </p>
          </Rise>
        ))}
      </div>
    </section>
  )
}

/** The one functional asymmetric split: service list ⇄ photo panel. */
function ServiceIndex() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]
  return (
    <section id="thjonusta" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <Rise>
        <h2 className="max-w-3xl text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
          Öll lagnavinna á einum stað
        </h2>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
          Sjö svið, sömu hendurnar. Veldu þjónustu til að sjá hvað hún nær yfir.
        </p>
      </Rise>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        {/* photo panel first on mobile so the tap result is visible */}
        <div className="order-first md:order-last">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm md:sticky md:top-24 md:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Img src={u(IMG[s.img], 1280)} alt={s.alt} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(20,21,19,0.72), transparent)' }} />
            <p className="absolute bottom-4 left-5 text-[13px] tracking-[0.16em] uppercase text-white" style={{ fontFamily: MONO }}>
              {s.tag}
            </p>
          </div>
        </div>

        <ul className="border-t" style={{ borderColor: HAIR }}>
          {SERVICES.map((sv, i) => {
            const on = i === active
            return (
              <li key={sv.name} className="border-b" style={{ borderColor: HAIR }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="group flex w-full items-baseline gap-4 py-4 text-left md:py-5"
                >
                  <span aria-hidden className="mt-1 h-[9px] w-[9px] shrink-0 self-center rounded-full transition-colors duration-300" style={{ background: on ? BLUE : 'rgba(27,26,24,0.18)' }} />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block transition-transform duration-500 group-hover:translate-x-1.5"
                      style={{
                        ...H_DISPLAY,
                        fontWeight: 700,
                        fontSize: 'clamp(1.25rem, 2.4vw, 1.8rem)',
                        color: on ? INK : MUT,
                        transitionProperty: 'transform, color',
                      }}
                    >
                      {sv.name}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <span className="block max-w-[54ch] pt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                            {sv.desc}
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
      </div>
    </section>
  )
}

/** Warm band. Full red ground, the HEITT half of the system. */
function Heat() {
  return (
    <section id="golfhiti" className="ps-dark scroll-mt-20" style={{ background: RED }}>
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-8 md:py-32">
        <div className="flex flex-col justify-center">
          <Rise>
            <h2 className="text-balance text-white" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
              {HEAT.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-white" style={{ fontFamily: BODY }}>
              {HEAT.lead}
            </p>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: RED_TINT }}>
              {HEAT.body}
            </p>
          </Rise>
          <ul className="mt-9 space-y-3">
            {HEAT.points.map((p, i) => (
              <Rise key={p} delay={0.1 + i * 0.08}>
                <li className="flex items-center gap-4 text-[15px] text-white" style={{ fontFamily: MONO }}>
                  <span aria-hidden className="h-px w-8" style={{ background: RED_TINT }} />
                  {p}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <figure className="col-span-2 md:col-span-1">
            <ClipImage id={IMG[HEAT.imgA.img]} alt={HEAT.imgA.alt} className="aspect-[4/5] rounded-sm" w={1280} sizes="(min-width: 768px) 25vw, 100vw" />
            <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED_TINT }}>
              {HEAT.capA}
            </figcaption>
          </figure>
          <figure className="col-span-2 md:col-span-1 md:mt-14">
            <ClipImage id={IMG[HEAT.imgB.img]} alt={HEAT.imgB.alt} className="aspect-[4/5] rounded-sm" w={1280} sizes="(min-width: 768px) 25vw, 100vw" />
            <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED_TINT }}>
              {HEAT.capB}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/** Cool band. Full-bleed industrial photo under deep blue, the KALT half.
    Background photo: mount-triggered animate + eager load, never whileInView. */
function Cold() {
  const reduced = useReducedMotion()
  return (
    <section id="udakerfi" className="ps-dark relative scroll-mt-20 overflow-hidden" style={{ background: BLUE }}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <Img
          src={u(IMG[COLD.img], 1280)}
          srcSet={`${u(IMG[COLD.img], 828)} 828w, ${u(IMG[COLD.img], 1280)} 1280w, ${u(IMG[COLD.img], 2000)} 2000w`}
          sizes="100vw"
          alt=""
          loading="eager"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(30,78,99,0.86)' }} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-28 md:px-8 md:py-40">
        <div className="max-w-2xl">
          <Rise>
            {/* lighter than BLUE_TINT: AA-safe against the brightest photo pixels under the 0.86 scrim */}
            <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: '#D9E9F1' }}>
              Fyrirtæki og iðnaður
            </p>
            <h2 className="mt-4 text-balance text-white" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
              {COLD.title}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-white" style={{ fontFamily: BODY }}>
              {COLD.lead}
            </p>
          </Rise>
          <ul className="mt-9 space-y-3">
            {COLD.points.map((p, i) => (
              <Rise key={p} delay={0.1 + i * 0.08}>
                <li className="flex items-center gap-4 text-[15px] text-white" style={{ fontFamily: MONO }}>
                  <span aria-hidden className="h-px w-8" style={{ background: BLUE_TINT }} />
                  {p}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="um-okkur" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <figure>
          <ClipImage id={IMG[ABOUT.imgA.img]} alt={ABOUT.imgA.alt} className="aspect-[4/3] rounded-sm md:aspect-[4/5]" />
          <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
            {ABOUT.capA}
          </figcaption>
        </figure>
        <div className="flex flex-col justify-center">
          <Rise>
            <h2 className="text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
              {ABOUT.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
              {ABOUT.lead}
            </p>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {ABOUT.body}
            </p>
          </Rise>
          <Rise delay={0.12}>
            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t pt-7" style={{ borderColor: HAIR }}>
              <div>
                <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                  Starfsstöðin
                </p>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  <span style={{ color: INK }}>{ADDRESS.street}</span>
                  <br />
                  {ADDRESS.town}
                </p>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold underline decoration-1 underline-offset-4"
                  style={{ fontFamily: BODY, color: INK }}
                >
                  <MapPin size={15} strokeWidth={2.2} aria-hidden />
                  Opna í kortum
                </a>
              </div>
              <div>
                <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: BLUE }}>
                  Eigandi
                </p>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  <span style={{ color: INK }}>Ívar Grétarsson</span>
                  <br />
                  frá stofnun árið 2000
                </p>
              </div>
            </div>
          </Rise>
          <ClipImage id={IMG[ABOUT.imgB.img]} alt={ABOUT.imgB.alt} className="mt-10 hidden aspect-video rounded-sm md:block" />
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="umsagnir" className="ps-dark scroll-mt-20" style={{ background: DARK }}>
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
        <Rise>
          <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUTD }}>
            Sýnishorn af umsögnum
          </p>
          <h2 className="mt-4 max-w-2xl text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)', color: BONE }}>
            Orð frá viðskiptavinum
          </h2>
        </Rise>
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {REVIEWS.map((r, i) => (
            <Rise key={r.name} delay={i * 0.1}>
              <figure className="border-l-2 pl-6" style={{ borderColor: i % 2 === 0 ? '#C4453F' : '#4E90AC' }}>
                <blockquote className="text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: BONE }}>
                  „{r.quote}“
                </blockquote>
                <figcaption className="mt-5">
                  <p className="text-[15px] font-bold" style={{ fontFamily: BODY, color: BONE }}>
                    {r.name}
                  </p>
                  <p className="mt-1 text-[13px] tracking-[0.08em] uppercase" style={{ fontFamily: MONO, color: MUTD }}>
                    {r.role}
                  </p>
                </figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const nafn = String(fd.get('nafn') ?? '')
    const simi = String(fd.get('simi') ?? '')
    const verkefni = String(fd.get('verkefni') ?? '')
    const subject = encodeURIComponent(`Fyrirspurn af vefnum: ${nafn}`)
    const body = encodeURIComponent(`Nafn: ${nafn}\nSími: ${simi}\n\nVerkefnið:\n${verkefni}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }
  const label = 'block text-[13px] font-bold tracking-[0.06em] uppercase'
  const input = 'mt-2 w-full rounded-sm border bg-white px-4 py-3 text-[16px]'
  return (
    <section id="hafa-samband" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-24 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-8 md:py-32">
        <div>
          <Rise>
            <h2 className="text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
              {CONTACT.title}
            </h2>
            <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {CONTACT.body}
            </p>
          </Rise>
          <Rise delay={0.1}>
            <a
              href={PHONE_HREF}
              className="mt-8 inline-block leading-none transition-transform duration-150 active:scale-[0.98]"
              style={{ ...H_DISPLAY, color: RED, fontSize: 'clamp(3rem, 10vw, 5.6rem)' }}
            >
              {PHONE_DISPLAY}
            </a>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-7 space-y-1.5 text-[15px]" style={{ fontFamily: MONO, color: MUT }}>
              <p>
                Einnig:{' '}
                <a href={PHONE2_HREF} className="inline-flex min-h-11 items-center font-medium" style={{ color: INK }}>
                  {PHONE2_DISPLAY}
                </a>
              </p>
              <p>
                <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4" style={{ color: INK }}>
                  {EMAIL}
                </a>
              </p>
              <p>
                {ADDRESS.street}, {ADDRESS.town}
              </p>
            </div>
          </Rise>
        </div>

        <Rise delay={0.08}>
          <form onSubmit={onSubmit} className="rounded-sm border p-6 md:p-8" style={{ borderColor: HAIR, background: '#FBFAF8' }}>
            <h3 style={{ ...H_DISPLAY, fontWeight: 700, fontSize: '1.4rem' }}>{CONTACT.formTitle}</h3>
            <div className="mt-6 space-y-5" style={{ fontFamily: BODY }}>
              <div>
                <label htmlFor="ps-nafn" className={label} style={{ color: INK }}>
                  Nafn
                </label>
                <input id="ps-nafn" name="nafn" type="text" required autoComplete="name" className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <div>
                <label htmlFor="ps-simi" className={label} style={{ color: INK }}>
                  Símanúmer
                </label>
                <input id="ps-simi" name="simi" type="tel" required autoComplete="tel" className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <div>
                <label htmlFor="ps-verkefni" className={label} style={{ color: INK }}>
                  Verkefnið
                </label>
                <textarea id="ps-verkefni" name="verkefni" required rows={4} className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-sm px-7 text-[16px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
                style={{ background: RED }}
              >
                {CONTACT.submit}
              </button>
              <p className="text-[13px] leading-relaxed" style={{ color: MUT }}>
                {CONTACT.formNote}
              </p>
            </div>
          </form>
        </Rise>
      </div>
    </section>
  )
}

/** Mobile sticky CTA bar: call + quote, appears after the hero. */
function MobileCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t px-3 pt-2 transition-transform duration-500 md:hidden"
      style={{
        background: BONE,
        borderColor: HAIR,
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        transform: show ? 'translateY(0)' : 'translateY(110%)',
      }}
      aria-hidden={!show}
    >
      <a
        href={PHONE_HREF}
        tabIndex={show ? 0 : -1}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm text-[15px] font-bold text-white active:scale-[0.98]"
        style={{ background: RED, fontFamily: BODY }}
      >
        <Phone size={16} strokeWidth={2.4} aria-hidden />
        Hringja
      </a>
      <a
        href="#hafa-samband"
        tabIndex={show ? 0 : -1}
        className="inline-flex min-h-[52px] items-center justify-center rounded-sm text-[15px] font-bold text-white active:scale-[0.98]"
        style={{ background: BLUE, fontFamily: BODY }}
      >
        Fá tilboð
      </a>
    </div>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BONE)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    /* self-loaded display font (see FONT NOTE at the top of this file) */
    let font: HTMLLinkElement | null = null
    if (!document.querySelector(`link[href="${ARCHIVO_HREF}"]`)) {
      font = document.createElement('link')
      font.rel = 'stylesheet'
      font.href = ARCHIVO_HREF
      document.head.appendChild(font)
    }

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Plumber',
      name: 'Pípulagnir Suðurlands',
      telephone: '+354 482 7880',
      email: EMAIL,
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Selfoss', postalCode: '800', addressCountry: 'IS' },
      areaServed: 'Suðurland',
      foundingDate: '2000',
    })
    document.head.appendChild(ld)

    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
      font?.remove()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1 })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div className="ps-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <TempRail />
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero />
        <Facts />
        <ServiceIndex />
        <Heat />
        <Cold />
        <About />
        <Reviews />
        <Contact />
      </main>

      <div className="px-5 pb-20 pt-5 text-center md:pb-5" style={{ borderTop: `1px solid ${HAIR}` }}>
        <p className="text-[12px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
          {FOOTNOTE}
        </p>
        <p className="mt-2 text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT }}>
          FRUMGERÐ · SNDR STUDIO
        </p>
      </div>
      <MobileCta />
      <PreviewFooter company={company} />
    </div>
  )
}
