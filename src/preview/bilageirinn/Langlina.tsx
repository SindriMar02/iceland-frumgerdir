import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BRANDS,
  CLAIM_STEPS,
  CRAFT,
  CTA,
  EMAIL,
  FACILITY,
  HERO,
  HOURS,
  IMG,
  INSURANCE,
  LOGO,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── LANGA LÍNAN. The founder is a master aircraft mechanic; a car body has
      exactly one correct line. This page tells that story the way a flight
      log would: warm stone paper, patient serif chapters, tiny mono
      annotations — and ONE petrol line that leaves the tagline at the top,
      meanders down the whole document like an altitude trace, is drawn by
      your scroll, and finally levels off, perfectly horizontal, under the
      closing call. The line back in place is the entire argument. ─────── */

const PAPER = '#EDE7DC'
const PAPER2 = '#F3EFE6'
const INK = '#2B2620' /* 12.6:1 on paper */
const MUT = '#5C5347' /* 5.7:1 on paper */
const PETROL = '#2B5A63' /* 5.9:1 on paper */
const PETROL_DARK = '#22454C' /* the one dark chapter */
const TINT = '#DCE6E4'
const SAND = '#C7BEA9' /* hairlines only, never text */
const INK_ON_DARK = '#EDE7DC' /* 9.1:1 on petrol-dark */
const MUT_ON_DARK = 'rgba(237,231,220,0.74)'
const HAIR_ON_DARK = 'rgba(237,231,220,0.22)'

const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
const EASE = [0.22, 1, 0.36, 1] as const

/** The long line. One path, 0–100 viewBox stretched over the whole document
    (preserveAspectRatio="none"), so horizontal segments render perfectly
    level and vertical drift reads like an altitude trace. Stroke width is
    pinned with vector-effect so the stretch never fattens it. It starts
    under the hero tagline, levels twice through the story chapter (the
    2003/2004/2007 stations echo it), crosses margins between chapters, and
    ends in one long, dead-level rule beneath the closing call. */
const LINE_D = [
  'M 50 3.1',
  'L 50 5.6',
  'C 50 6.8, 5.5 7.0, 5.5 8.6',
  'L 5.5 10.6',
  'L 13 10.6',
  'L 13 13.2',
  'L 20 13.2',
  'L 20 16.4',
  'C 20 18.2, 94.5 18.4, 94.5 20.6',
  'L 94.5 32.5',
  'C 94.5 34.6, 5.5 34.8, 5.5 37.0',
  'L 5.5 49.5',
  'C 5.5 51.5, 94.5 51.7, 94.5 53.8',
  'L 94.5 63.5',
  'C 94.5 65.5, 6 65.7, 6 67.8',
  'L 6 75.5',
  'L 14 75.5',
  'L 14 78.5',
  'C 14 80.5, 50 80.3, 50 82.2',
  'L 50 85.8',
  'C 50 87.8, 4 87.8, 4 89.8',
  'L 4 93.6',
  'L 96 93.6',
].join(' ')

const CSS = `
@font-face { font-family: 'Fraunces'; src: url('${B}fonts/fraunces/fonts/Fraunces-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Fraunces'; src: url('${B}fonts/fraunces/fonts/Fraunces-SemiBold.woff2') format('woff2'); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

.ll-page { background: ${PAPER}; color: ${INK}; }
.ll-page ::selection { background: ${PETROL}; color: ${PAPER}; }
.ll-page a, .ll-page button { -webkit-tap-highlight-color: transparent; }
.ll-page :focus-visible { outline: 2px solid ${PETROL}; outline-offset: 3px; border-radius: 2px; }

/* the film poster breathes over ~50s — the single sanctioned slow motion
   besides the scroll-drawn line itself */
@keyframes ll-kenburns { from { transform: scale(1.02); } to { transform: scale(1.1); } }
.ll-kb { animation: ll-kenburns 48s linear alternate infinite; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .ll-kb { animation: none; } }
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

/** Long, quiet fade with a small drift. Whole lines only — Icelandic accents
    (Í Á Þ Æ Ö…) clip inside overflow masks, so nothing here ever masks. */
function Fade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Photos surface like a print developing: opacity + blur-to-sharp, one
    shot. Observer sits on the untransformed <figure>, never on the element
    that fades (IntersectionObserver lesson, learned the hard way). */
function Photo({
  src,
  alt,
  className,
  caption,
  captionColor = MUT,
}: {
  src: string
  alt: string
  className?: string
  caption?: string
  captionColor?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const reduced = useReducedMotion()
  return (
    <figure ref={ref} className={className}>
      <div className="h-full w-full overflow-hidden">
        {reduced ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, filter: 'blur(14px)', scale: 1.03 }}
            animate={inView ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : { opacity: 0, filter: 'blur(14px)', scale: 1.03 }}
            transition={{ duration: 1.5, ease: EASE }}
          />
        )}
      </div>
      {caption && (
        <figcaption
          className="mt-3 text-[11px] tracking-[0.18em] uppercase"
          style={{ fontFamily: MONO, color: captionColor }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Chapter mark: tiny mono numeral + name, with a short level tick — the
    line's vocabulary at label scale. */
function KafliMark({ n, name, dark = false }: { n: string; name: string; dark?: boolean }) {
  return (
    <Fade>
      <p
        className="flex items-center gap-3 text-[12px] tracking-[0.24em] uppercase"
        style={{ fontFamily: MONO, color: dark ? MUT_ON_DARK : PETROL }}
      >
        <span aria-hidden className="inline-block h-[2px] w-8" style={{ background: dark ? INK_ON_DARK : PETROL }} />
        Kafli {n} · {name}
      </p>
    </Fade>
  )
}

/** Big serif chapter title. Revealed by fade + drift only, never masked. */
function KafliTitle({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <Fade delay={0.08}>
      <h2
        className="mt-5 max-w-4xl text-balance"
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 'clamp(2.1rem, 4.6vw, 3.7rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
          color: dark ? INK_ON_DARK : INK,
        }}
      >
        {children}
      </h2>
    </Fade>
  )
}

/** THE line. Desktop: one SVG spanning the entire document, drawn by scroll
    (dash offset over a normalized pathLength, spring-smoothed upstream).
    Mobile: an honest left rail that fills top-to-bottom. Reduced motion:
    fully drawn, static. It only ever moves while the reader scrolls. */
function LongLine({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <svg className="hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {/* the flight plan: where the line will go */}
        <path d={LINE_D} stroke={SAND} strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.5} />
        {/* the flight: where you have taken it */}
        <motion.path
          d={LINE_D}
          stroke={PETROL}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : progress }}
        />
      </svg>
      <div className="absolute bottom-0 left-4 top-0 w-px md:hidden" style={{ background: SAND, opacity: 0.7 }} />
      <motion.div
        className="absolute left-4 top-0 h-full w-[2px] origin-top md:hidden"
        style={{ background: PETROL, scaleY: reduced ? 1 : progress }}
      />
    </div>
  )
}

/* ──────────────────────────────── nav ──────────────────────────────── */

function Nav({ lenisRef, kafli }: { lenisRef: RefObject<Lenis | null>; kafli: string }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const goEnd = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector('#lokakafli')
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -60 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(237,231,220,0.9)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? `1px solid ${SAND}` : '1px solid transparent',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8">
        <a href="#efst" className="inline-flex min-h-11 items-center" aria-label="Bílageirinn, efst á síðu"
          onClick={e => {
            e.preventDefault()
            if (lenisRef.current) lenisRef.current.scrollTo(0)
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img src={LOGO} alt="Bílageirinn" className="h-8 w-auto" />
        </a>
        <div className="flex items-center gap-4 md:gap-7">
          <AnimatePresence mode="wait">
            <motion.span
              key={kafli}
              className="hidden text-[11px] tracking-[0.22em] uppercase sm:inline"
              style={{ fontFamily: MONO, color: MUT }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {kafli}
            </motion.span>
          </AnimatePresence>
          <a
            href={PHONE_HREF}
            className="hidden min-h-11 items-center gap-2 text-[13px] tracking-[0.08em] md:inline-flex"
            style={{ fontFamily: MONO, color: INK }}
          >
            <Phone size={13} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
          <a
            href="#lokakafli"
            onClick={goEnd}
            className="inline-flex min-h-11 items-center border px-4 text-[13px] font-medium"
            style={{ borderColor: INK, color: INK, fontFamily: BODY }}
          >
            Hafa samband
          </a>
        </div>
      </div>
    </motion.header>
  )
}

/* ─────────────────────────── 0 · opening ─────────────────────────── */

function Opening() {
  const reduced = useReducedMotion()
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.5, ease: EASE, delay },
        }
  return (
    <section id="efst" className="relative z-[2] flex min-h-[100svh] flex-col items-center justify-center px-5 pb-28 pt-24 text-center md:px-8">
      <motion.p
        className="text-[11px] tracking-[0.26em] uppercase md:text-[12px]"
        style={{ fontFamily: MONO, color: MUT }}
        {...enter(0.2)}
      >
        Réttingar · Bílamálun · Bílaþjónusta · Grófin 14a, Reykjanesbær
      </motion.p>
      <motion.h1
        className="mt-8 max-w-5xl text-balance"
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 'clamp(3rem, 10.5vw, 8rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.015em',
        }}
        {...enter(0.45)}
      >
        {HERO.headline}
      </motion.h1>
      <motion.p
        className="mt-8 max-w-xl text-[17px] leading-[1.7] md:text-[18px]"
        style={{ fontFamily: BODY, color: MUT }}
        {...enter(0.8)}
      >
        {HERO.sub}
      </motion.p>
      <motion.p
        className="mt-7 text-[12px] tracking-[0.16em] uppercase"
        style={{ fontFamily: MONO, color: PETROL }}
        {...enter(1.05)}
      >
        {HERO.cert}
      </motion.p>
      <motion.a
        href={PHONE_HREF}
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] tracking-[0.1em]"
        style={{ fontFamily: MONO, color: INK }}
        {...enter(1.2)}
      >
        <Phone size={13} strokeWidth={2.2} aria-hidden />
        S. {PHONE_DISPLAY}
      </motion.a>
      {/* the line takes over from here — the cue just points at it */}
      <motion.div
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
        {...enter(1.5)}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
          Fylgdu línunni
        </span>
        <span aria-hidden className="block h-10 w-[2px]" style={{ background: PETROL }} />
      </motion.div>
    </section>
  )
}

/* ─────────────────────── 1 · kafli 01, flugskýlið ─────────────────────── */

/** The 2003/2004/2007 timeline as an altitude trace: the line levels at
    each year, a station dot marks it. Decorative SVG (aria-hidden); the
    real content lives in the grid beneath it. Draws once on entry —
    observer on the untransformed wrapper. */
function AltitudeTrace() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const reduced = useReducedMotion()
  const D = 'M 0 24 L 28 24 L 38 16 L 61 16 L 72 8 L 100 8'
  const stations = [
    { x: 14, y: 24, year: '2003' },
    { x: 50, y: 16, year: '2004' },
    { x: 86, y: 8, year: '2007' },
  ]
  return (
    <div ref={ref}>
      <div aria-hidden className="relative hidden md:block">
        <svg className="h-[150px] w-full" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
          <path d={D} stroke={SAND} strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.6} />
          {reduced ? (
            <path d={D} stroke={PETROL} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          ) : (
            <motion.path
              d={D}
              stroke={PETROL}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: inView ? 1 : 0 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
          )}
        </svg>
        {stations.map((s, i) => (
          <motion.div
            key={s.year}
            className="absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${s.x}%`, top: `${(s.y / 30) * 150}px` }}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 + i * 0.35 }}
          >
            <span className="-mt-[5px] block h-[10px] w-[10px] rounded-full border-2" style={{ borderColor: PETROL, background: PAPER }} />
            <span className="mt-2 text-[12px] tracking-[0.2em]" style={{ fontFamily: MONO, color: PETROL }}>
              {s.year}
            </span>
          </motion.div>
        ))}
      </div>
      {/* the readable record, desktop: one column per station */}
      <div className="mt-2 hidden gap-8 md:grid md:grid-cols-3">
        {STORY.timeline.map((t, i) => (
          <Fade key={t.year} delay={0.15 + i * 0.12}>
            <div className="px-2 text-center">
              <span className="sr-only">{t.year}</span>
              <p className="mx-auto max-w-[36ch] text-[15px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                {t.text}
              </p>
            </div>
          </Fade>
        ))}
      </div>
      {/* mobile: the same stations, vertical on the rail */}
      <ol className="space-y-9 md:hidden">
        {STORY.timeline.map((t, i) => (
          <Fade key={t.year} delay={i * 0.08}>
            <li className="relative pl-7">
              <span aria-hidden className="absolute left-0 top-[7px] block h-[10px] w-[10px] rounded-full border-2" style={{ borderColor: PETROL, background: PAPER }} />
              <p className="text-[13px] tracking-[0.2em]" style={{ fontFamily: MONO, color: PETROL }}>
                {t.year}
              </p>
              <p className="mt-2 text-[15px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                {t.text}
              </p>
            </li>
          </Fade>
        ))}
      </ol>
    </div>
  )
}

function Flugskylid() {
  return (
    <section data-kafli="KAFLI 01 / 06" className="relative z-[2] mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <KafliMark n="01" name="Flugskýlið" />
      <KafliTitle>{STORY.title}</KafliTitle>
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="max-w-[62ch]">
          <Fade delay={0.1}>
            <p
              className="text-[20px] leading-[1.65] md:text-[22px]"
              style={{ fontFamily: SERIF, fontWeight: 400, color: INK }}
            >
              {STORY.lead}
            </p>
          </Fade>
          <Fade delay={0.2}>
            <p className="mt-7 text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {STORY.body}
            </p>
          </Fade>
        </div>
        {/* the one photo of the chapter; the line's annotation pins to it */}
        <div className="relative md:mt-10">
          <Photo
            src={IMG.booth}
            alt="Bíll afmarkaður með pappír og grunnaður í sprautuklefa"
            className="aspect-[4/5]"
          />
          <Fade delay={0.4} className="absolute bottom-5 left-0">
            <p
              className="flex -translate-x-2 items-center gap-0 text-[11px] tracking-[0.18em] uppercase md:-translate-x-8"
              style={{ fontFamily: MONO, color: PETROL }}
            >
              <span aria-hidden className="inline-block h-[2px] w-10 md:w-16" style={{ background: PETROL }} />
              <span className="px-3 py-2" style={{ background: 'rgba(237,231,220,0.92)' }}>
                Undirbúningur fyrir sprautun
              </span>
            </p>
          </Fade>
        </div>
      </div>
      <div className="mt-20 md:mt-28">
        <AltitudeTrace />
      </div>
    </section>
  )
}

/* ─────────────────────── 2 · kafli 02, myndin ─────────────────────── */

const FILM_CHAPTERS = [
  { mark: 'Skoðun', desc: 'Farið yfir tjónið og verkið skipulagt' },
  { mark: 'Mæling', desc: 'Yfirbyggingin mæld á móti réttri línu' },
  { mark: 'Rétting', desc: 'Línan færð aftur á sinn stað' },
  { mark: 'Málun', desc: 'Sprautun og frágangur í málningardeild' },
  { mark: 'Afhending', desc: 'Bíllinn yfirfarinn og skilað' },
]

/** One planned film chapter on the horizontal line — illuminates when the
    scroll progress of the strip passes its station. */
function FilmStation({ progress, index, mark, desc }: { progress: MotionValue<number>; index: number; mark: string; desc: string }) {
  const reduced = useReducedMotion()
  const start = index / FILM_CHAPTERS.length
  const opacity = useTransform(progress, [start, start + 0.14], [0.32, 1])
  return (
    <motion.li className="relative pl-6 md:pl-0 md:pt-7" style={{ opacity: reduced ? 1 : opacity }}>
      <span
        aria-hidden
        className="absolute left-[-5px] top-[6px] block h-[10px] w-[10px] rounded-full border-2 md:left-0 md:top-[-5px]"
        style={{ borderColor: INK_ON_DARK, background: PETROL_DARK }}
      />
      <p className="text-[13px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: INK_ON_DARK }}>
        {mark}
      </p>
      <p className="mt-2 max-w-[24ch] text-[13.5px] leading-[1.6]" style={{ fontFamily: BODY, color: MUT_ON_DARK }}>
        {desc}
      </p>
    </motion.li>
  )
}

function Myndin() {
  const stripRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: stripRef, offset: ['start 0.9', 'end 0.55'] })
  return (
    <section data-kafli="KAFLI 02 / 06" className="relative z-[2] mx-auto max-w-[1240px] px-0 py-14 md:px-8 md:py-24">
      {/* the one dark chapter: an inset slab, so the page margins stay
          paper and the long line passes beside it */}
      <div className="px-5 py-20 md:rounded-sm md:px-14 md:py-24" style={{ background: PETROL_DARK }}>
        <KafliMark n="02" name="Myndin" dark />
        <KafliTitle dark>Verkið, tekið upp frá fyrsta handtaki til afhendingar</KafliTitle>
        <Fade delay={0.15}>
          <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT_ON_DARK }}>
            Heimildarmynd um eina tjónaviðgerð hjá Bílageiranum að Grófinni 14a er í vinnslu. Hún fylgir
            verkferlinu sjálfu, kafla fyrir kafla, og birtist hér þegar hún er tilbúin.
          </p>
        </Fade>
        {/* cinema frame — poster only, honest slate, no dead play button;
            a <video controls poster> drops straight into this frame later */}
        <Fade delay={0.2} className="mt-12 md:mt-16">
          <div className="relative aspect-video overflow-hidden" style={{ background: '#1A363C' }}>
            <img
              src={IMG.retting}
              alt="Flötur yfirbyggingar unninn með höndunum"
              loading="eager"
              decoding="async"
              className="ll-kb absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(34,69,76,0.55), transparent 35%, transparent 70%, rgba(34,69,76,0.6))' }}
            />
            <p
              className="absolute left-4 top-4 text-[11px] tracking-[0.24em] uppercase md:left-6 md:top-6"
              style={{ fontFamily: MONO, color: INK_ON_DARK }}
            >
              Heimildarmynd · Grófin 14a · Í vinnslu
            </p>
            <p
              className="absolute bottom-4 right-4 text-[11px] tracking-[0.24em] uppercase md:bottom-6 md:right-6"
              style={{ fontFamily: MONO, color: MUT_ON_DARK }}
            >
              16:9 · 5 kaflar
            </p>
          </div>
        </Fade>
        {/* the film's own little long line: five stations, lit by scroll */}
        <div ref={stripRef} className="relative mt-12 md:mt-16">
          <div aria-hidden className="absolute bottom-2 left-0 top-2 w-px md:bottom-auto md:left-0 md:right-0 md:top-0 md:h-px md:w-auto" style={{ background: HAIR_ON_DARK }} />
          <motion.div
            aria-hidden
            className="absolute bottom-2 left-0 top-2 w-[2px] origin-top md:hidden"
            style={{ background: INK_ON_DARK, scaleY: reduced ? 1 : scrollYProgress }}
          />
          <motion.div
            aria-hidden
            className="absolute left-0 right-0 top-0 hidden h-[2px] origin-left md:block"
            style={{ background: INK_ON_DARK, scaleX: reduced ? 1 : scrollYProgress }}
          />
          <ol className="grid gap-8 md:grid-cols-5 md:gap-6">
            {FILM_CHAPTERS.map((c, i) => (
              <FilmStation key={c.mark} progress={scrollYProgress} index={i} mark={c.mark} desc={c.desc} />
            ))}
          </ol>
        </div>
        <Fade delay={0.1}>
          <p className="mt-10 text-[12.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT_ON_DARK }}>
            Myndin er í framleiðslu og sýnir vinnubrögðin á verkstæðinu að Grófinni 14a.
          </p>
        </Fade>
      </div>
    </section>
  )
}

/* ─────────────────────── 3 · kafli 03, þjónustan ─────────────────────── */

const SERVICE_IMGS = [IMG.retting, IMG.malun, IMG.garage, IMG.lift, IMG.wheel, IMG.headlight, IMG.brake]
const SERVICE_ALTS = [
  'Flötur yfirbyggingar varinn og unninn með höndunum',
  'Sprautuvinna í málningarklefa',
  'Verkstæðisgólf með bílum í viðgerð',
  'Unnið undir bíl á lyftu',
  'Fjöðrunar- og hjólabúnaður í nærmynd',
  'Aðalljós á dökkum bíl',
  'Bremsubúnaður skoðaður með hjólið af',
]

function Thjonustan() {
  const [active, setActive] = useState(0)
  return (
    <section id="thjonusta" data-kafli="KAFLI 03 / 06" className="relative z-[2] mx-auto max-w-[1200px] scroll-mt-20 px-5 py-28 md:px-8 md:py-40">
      <KafliMark n="03" name="Þjónustan" />
      <KafliTitle>Allt undir sama þaki í Grófinni</KafliTitle>
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,1fr)_320px] md:gap-16 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* the reading list — no cards, just the register */}
        <ol className="border-t" style={{ borderColor: SAND }}>
          {SERVICES.map((s, i) => {
            const on = i === active
            return (
              <li key={s.name} className="border-b" style={{ borderColor: SAND }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="flex w-full items-baseline gap-5 py-6 text-left md:gap-7 md:py-7"
                >
                  <span className="w-8 shrink-0 text-[12px] tabular-nums tracking-[0.1em]" style={{ fontFamily: MONO, color: on ? PETROL : MUT }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span
                        className="block transition-colors duration-500"
                        style={{
                          fontFamily: SERIF,
                          fontWeight: on ? 600 : 400,
                          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                          lineHeight: 1.15,
                          color: on ? INK : MUT,
                        }}
                      >
                        {s.name}
                      </span>
                      <span className="text-[10.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: on ? PETROL : SAND }}>
                        {s.tag}
                      </span>
                    </span>
                    <span className="mt-2.5 block max-w-[54ch] text-[15px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                      {s.desc}
                    </span>
                    {/* mobile: the matching photo surfaces inline, quietly */}
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden md:hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE }}
                        >
                          <img
                            src={SERVICE_IMGS[i]}
                            alt={SERVICE_ALTS[i]}
                            loading="lazy"
                            decoding="async"
                            className="mt-4 aspect-video w-full object-cover"
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        {/* desktop margin: the matching photo, a documentary aside */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.img
                  key={active}
                  src={SERVICE_IMGS[active]}
                  alt={SERVICE_ALTS[active]}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </AnimatePresence>
            </div>
            <p className="mt-3 text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              {String(active + 1).padStart(2, '0')} · {SERVICES[active].name}
            </p>
          </div>
        </div>
      </div>
      <Fade delay={0.1}>
        <p className="mt-10 text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
          Smurstöðin svarar beint í{' '}
          <a
            href={LUBE_PHONE_HREF}
            className="inline-flex min-h-11 items-center font-medium underline decoration-1 underline-offset-4"
            style={{ color: INK }}
          >
            {LUBE_PHONE_DISPLAY}
          </a>
        </p>
      </Fade>
    </section>
  )
}

/* ─────────────────────── 4 · kafli 04, tjónið ─────────────────────── */

function Tjonid() {
  const railRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.8', 'end 0.7'] })
  return (
    <section id="tjon" data-kafli="KAFLI 04 / 06" className="relative z-[2] scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
        <KafliMark n="04" name="Tjónið" />
        <KafliTitle>Fjögur stopp á sömu línu</KafliTitle>
        {/* the claim rides the same line: four stations, one of them —
            the loaner car — is where the line thickens */}
        <div ref={railRef} className="relative mt-14 pl-8 md:mt-20 md:pl-12">
          <div aria-hidden className="absolute bottom-3 left-[4px] top-3 w-px" style={{ background: SAND }} />
          <motion.div
            aria-hidden
            className="absolute bottom-3 left-[4px] top-3 w-[2px] origin-top"
            style={{ background: PETROL, scaleY: reduced ? 1 : scrollYProgress }}
          />
          <ol className="space-y-14 md:space-y-20">
            {CLAIM_STEPS.map((s, i) => (
              <li key={s.title} className="relative max-w-[680px]">
                <span
                  aria-hidden
                  className="absolute -left-8 top-[6px] block h-[10px] w-[10px] rounded-full border-2 md:-left-12"
                  style={{ borderColor: PETROL, background: s.highlight ? PETROL : PAPER2 }}
                />
                {/* at the loaner-car station the line itself thickens */}
                {s.highlight && (
                  <span aria-hidden className="absolute -bottom-2 -left-8 -top-2 block w-[6px] rounded-full md:-left-12" style={{ background: PETROL }} />
                )}
                <Fade delay={i * 0.05}>
                  <div className={s.highlight ? 'p-6 md:p-8' : undefined} style={s.highlight ? { background: TINT } : undefined}>
                    <p className="text-[12px] tracking-[0.22em]" style={{ fontFamily: MONO, color: PETROL }}>
                      {String(i + 1).padStart(2, '0')}
                      {s.highlight ? ' · INNIFALIÐ' : ''}
                    </p>
                    <h3
                      className="mt-3"
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 600,
                        fontSize: s.highlight ? 'clamp(1.8rem, 3.4vw, 2.6rem)' : 'clamp(1.5rem, 2.8vw, 2.1rem)',
                        lineHeight: 1.15,
                        color: INK,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-[16px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                      {s.desc}
                    </p>
                  </div>
                </Fade>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-20 max-w-[680px] md:mt-24 md:pl-12">
          <Fade>
            <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', lineHeight: 1.2, color: INK }}>
              {INSURANCE.title}
            </h3>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {INSURANCE.body}
            </p>
            <p className="mt-5 text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              {INSURANCE.companies.join(' · ')}
            </p>
          </Fade>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── 5 · kafli 05, efnið ─────────────────────── */

function Efnid() {
  return (
    <section data-kafli="KAFLI 05 / 06" className="relative z-[2] mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <KafliMark n="05" name="Efnið" />
      <KafliTitle>{CRAFT.title}</KafliTitle>
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1fr_0.9fr] md:gap-16">
        <div className="max-w-[62ch]">
          <Fade delay={0.1}>
            <p className="text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {CRAFT.body}
            </p>
          </Fade>
          <ul className="mt-9 space-y-3.5">
            {CRAFT.points.map((p, i) => (
              <Fade key={p} delay={0.15 + i * 0.08}>
                <li className="flex items-center gap-4 text-[13px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: INK }}>
                  <span aria-hidden className="h-[2px] w-8 shrink-0" style={{ background: PETROL }} />
                  {p}
                </li>
              </Fade>
            ))}
          </ul>
          {/* the building, filed as a documentary caption */}
          <div className="mt-14 border-t pt-8" style={{ borderColor: SAND }}>
            <Fade delay={0.2}>
              <p className="text-[11px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: PETROL }}>
                Húsnæðið · Grófin 14a
              </p>
              <h3 className="mt-3" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)', lineHeight: 1.2, color: INK }}>
                {FACILITY.title}
              </h3>
              <p className="mt-3 max-w-[56ch] text-[15.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                {FACILITY.body}
              </p>
            </Fade>
          </div>
        </div>
        <div className="space-y-10">
          <Photo src={IMG.malun} alt="Sprautuvinna í málningarklefa" className="aspect-[4/3]" caption="Sprautuvinna í klefa" />
          <Photo src={IMG.garage} alt="Bílar á lyftum á verkstæðisgólfi" className="aspect-[4/3] md:ml-10" caption="Verkstæðisgólf" />
        </div>
      </div>
      {/* the authorizations, framed like documentation on the wall */}
      <div className="mt-20 grid gap-12 border-t pt-14 md:mt-28 md:grid-cols-[1fr_0.9fr] md:gap-16 md:pt-16" style={{ borderColor: SAND }}>
        <div className="max-w-[62ch]">
          <Fade>
            <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', lineHeight: 1.18, color: INK }}>
              {BRANDS.title}
            </h3>
            <p className="mt-4 text-[16px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {BRANDS.body}
            </p>
            <p className="mt-4 text-[14.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {BRANDS.note}
            </p>
          </Fade>
        </div>
        <div className="grid grid-cols-2 gap-5 self-start">
          {[
            { src: IMG.toyota, alt: 'Toyota', label: 'Skjal 01 · Toyota' },
            { src: IMG.kia, alt: 'Kia', label: 'Skjal 02 · Kia' },
          ].map((m, i) => (
            <Fade key={m.alt} delay={i * 0.1}>
              <div className="border p-6 md:p-8" style={{ borderColor: SAND, background: PAPER2 }}>
                <div className="flex h-16 items-center justify-center md:h-20">
                  <img src={m.src} alt={m.alt} loading="lazy" decoding="async" className="max-h-10 w-auto max-w-full object-contain md:max-h-12" />
                </div>
                <p className="mt-4 text-center text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                  {m.label}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── 6 · kafli 06, fólkið ─────────────────────── */

function Folkid() {
  return (
    <section data-kafli="KAFLI 06 / 06" className="relative z-[2] mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <KafliMark n="06" name="Fólkið" />
      <KafliTitle>Þrjú nöfn á sömu línu</KafliTitle>
      <div className="mt-12 border-t md:mt-16" style={{ borderColor: SAND }}>
        {TEAM.map((p, i) => (
          <Fade key={p.name} delay={i * 0.08}>
            <div className="grid gap-2 border-b py-8 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10 md:py-10" style={{ borderColor: SAND }}>
              <div>
                <p style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)', lineHeight: 1.15, color: INK }}>
                  {p.name}
                </p>
                {/* the founder's line gets its own beat — it is where the
                    whole page's precision argument comes from */}
                {p.detail && (
                  <p className="mt-3 flex items-center gap-3 text-[13px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: PETROL }}>
                    <span aria-hidden className="inline-block h-[2px] w-8" style={{ background: PETROL }} />
                    {p.detail}
                  </p>
                )}
              </div>
              <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                {p.role}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────── 7 · lokakafli, línan er komin ──────────────────── */

function Lokakafli() {
  const ruleRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ruleRef, offset: ['start 0.95', 'start 0.4'] })
  return (
    <section id="lokakafli" data-kafli="LOKAKAFLI" className="relative z-[2] mx-auto max-w-[1200px] scroll-mt-20 px-5 pb-32 pt-28 md:px-8 md:pb-44 md:pt-40">
      {/* the payoff: the meander is over — one dead-level rule, drawn flat
          across the page as you arrive. The line is back in place. */}
      <div ref={ruleRef}>
        <Fade>
          <p className="text-[11px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: PETROL }}>
            Línan er komin á sinn stað
          </p>
        </Fade>
        <div className="relative mt-6 h-[2px] w-full" style={{ background: SAND }}>
          <motion.div
            className="absolute inset-0 origin-left"
            style={{ background: PETROL, scaleX: reduced ? 1 : scrollYProgress }}
          />
        </div>
      </div>
      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-[1.15fr_1fr] md:gap-20">
        <div>
          <Fade>
            <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.9rem)', lineHeight: 1.1, letterSpacing: '-0.01em', color: INK }}>
              {CTA.title}
            </h2>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
              {CTA.body}
            </p>
          </Fade>
          <Fade delay={0.12}>
            <a
              href={PHONE_HREF}
              className="mt-10 inline-block leading-none transition-transform duration-150 active:scale-[0.98]"
              style={{ fontFamily: SERIF, fontWeight: 600, color: PETROL, fontSize: 'clamp(3rem, 9.5vw, 6rem)', letterSpacing: '-0.01em' }}
            >
              {PHONE_DISPLAY}
            </a>
          </Fade>
          <Fade delay={0.2}>
            <div className="mt-8 space-y-2 text-[14px]" style={{ fontFamily: MONO, color: MUT }}>
              <p>
                Smurstöðin:{' '}
                <a href={LUBE_PHONE_HREF} className="inline-flex min-h-11 items-center font-medium" style={{ color: INK }}>
                  {LUBE_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4" style={{ color: INK }}>
                  {EMAIL}
                </a>
              </p>
            </div>
          </Fade>
        </div>
        <Fade delay={0.15}>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-1 md:gap-12">
            <div>
              <p className="text-[11px] tracking-[0.24em] uppercase" style={{ fontFamily: MONO, color: PETROL }}>
                Opnunartími
              </p>
              <ul className="mt-4 space-y-2 text-[15px] leading-[1.6]" style={{ fontFamily: BODY, color: MUT }}>
                {HOURS.map(h => (
                  <li key={h.days}>
                    <span style={{ color: INK }}>{h.days}</span>
                    <br />
                    {h.close ? `${h.open}–${h.close}` : h.open}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.24em] uppercase" style={{ fontFamily: MONO, color: PETROL }}>
                Staðsetning
              </p>
              <p className="mt-4 text-[15px] leading-[1.6]" style={{ fontFamily: BODY, color: MUT }}>
                <span style={{ color: INK }}>{ADDRESS.street}</span>
                <br />
                {ADDRESS.town}
              </p>
              <a
                href={MAPS}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-medium underline decoration-1 underline-offset-4"
                style={{ fontFamily: BODY, color: INK }}
              >
                <MapPin size={15} strokeWidth={2.2} aria-hidden />
                Opna í kortum
              </a>
            </div>
          </div>
        </Fade>
      </div>
      <Fade delay={0.1}>
        <p className="mt-24 border-t pt-8 text-[11px] leading-[2.2] tracking-[0.18em] uppercase md:mt-32" style={{ fontFamily: MONO, color: MUT, borderColor: SAND }}>
          {TRUST_STRIP.join(' · ')}
        </p>
      </Fade>
    </section>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)
  const [kafli, setKafli] = useState('')

  /* the one long line: whole-document scroll progress, spring-smoothed so
     the stroke trails the reader by a breath */
  const { scrollYProgress } = useScroll()
  const drawn = useSpring(scrollYProgress, { stiffness: 55, damping: 22, restDelta: 0.0005 })

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(PAPER)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoBodyShop',
      name: 'Bílageirinn',
      telephone: '+354 421 6901',
      email: EMAIL,
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Reykjanesbær', postalCode: '230', addressCountry: 'IS' },
      foundingDate: '2003',
    })
    document.head.appendChild(ld)

    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15 })
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

  /* the nav's quiet chapter indicator */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-kafli]'))
    if (els.length === 0) return
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setKafli(e.target.getAttribute('data-kafli') ?? '')
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="ll-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} kafli={kafli} />
      <main className="relative">
        <LongLine progress={drawn} />
        <Opening />
        <Flugskylid />
        <Myndin />
        <Thjonustan />
        <Tjonid />
        <Efnid />
        <Folkid />
        <Lokakafli />
      </main>

      <div className="relative z-[2] px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${SAND}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}



