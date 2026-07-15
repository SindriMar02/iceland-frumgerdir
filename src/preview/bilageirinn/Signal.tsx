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
  useVelocity,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react'
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
  FACTS,
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

/* ── SIGNAL YELLOW. Industrial confidence: work-site hazard yellow, ink
      black, off-white paper bands. Tool-brand energy, not luxury. The page
      alternates black acts and paper acts, stitched together with hazard
      stripe dividers that physically react to your scroll. Every act says
      one thing, enormous, in Bebas caps. ─── */
const BLACK = '#0C0C0C'
const PAPER = '#F7F5EF'
const YELLOW = '#F4C400' /* signal yellow: on black 11.9:1 */
const DEEP = '#B38600' /* signal-deep: small text on paper */
const MUT = 'rgba(247,245,239,0.68)' /* muted on black */
const PMUT = 'rgba(12,12,12,0.66)' /* muted on paper */
const HAIR = 'rgba(247,245,239,0.16)'
const PHAIR = 'rgba(12,12,12,0.18)'

const DISPLAY = "'Bebas Neue', 'Arial Narrow', 'Arial Black', sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
const EASE = [0.76, 0, 0.24, 1] as const
const SLAM = { type: 'spring', stiffness: 460, damping: 30, mass: 1.05 } as const
const STAMP = { type: 'spring', stiffness: 520, damping: 21, mass: 0.9 } as const

const STRIPES = `repeating-linear-gradient(135deg, ${YELLOW} 0px, ${YELLOW} 13px, ${BLACK} 13px, ${BLACK} 26px)`

/* diagonal headline wipe — same 135° angle as the hazard stripes */
const WIPE_HIDDEN = 'polygon(0% 0%, 14% 0%, 0% 100%, 0% 100%)'
const WIPE_SHOWN = 'polygon(0% 0%, 114% 0%, 100% 100%, 0% 100%)'

const CSS = `
@font-face { font-family: 'Bebas Neue'; src: url('${B}fonts/bebas-neue/fonts/BebasNeue-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

.sg-page { background: ${BLACK}; color: ${PAPER}; }
.sg-page ::selection { background: ${YELLOW}; color: ${BLACK}; }
.sg-page a, .sg-page button { -webkit-tap-highlight-color: transparent; }
.sg-page :focus-visible { outline: 3px solid ${YELLOW}; outline-offset: 3px; }

/* hero carousel slot: photos breathe and hard-wipe between each other
   until real looping footage drops in */
@keyframes sg-breathe { from { transform: scale(1); } to { transform: scale(1.06); } }
.sg-breathe { animation: sg-breathe 16s ease-in-out infinite alternate; will-change: transform; }

/* trust marquee — two aria-separated copies, slow constant drift */
@keyframes sg-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.sg-marquee { animation: sg-marquee 64s linear infinite; }

/* process-reel frame pan — play state gated by in-view from React */
@keyframes sg-pan { from { transform: translateX(0); } to { transform: translateX(-8.5%); } }
.sg-pan { animation: sg-pan 12s ease-in-out infinite alternate; will-change: transform; }

.sg-reel { scrollbar-width: none; }
.sg-reel::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .sg-breathe { animation: none; }
  .sg-marquee { animation: none; }
  .sg-pan { animation: none; }
  .sg-page a, .sg-page button { transition: none !important; transform: none !important; }
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

/** Weighty entrance: the element lands like a dropped part. Observer sits on
    an untransformed wrapper — never on the moving element itself. */
function Slam({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 56 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...SLAM, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Section headline arrival: hard clip-path wipe along the 135° stripe
    angle. Wrapper is unclipped so IntersectionObserver always fires; the
    hidden state still shows a sliver, never a zero-size rect. Bebas accent
    trap: content keeps line-height ≥ 1.08 so Í/Ó/Æ caps stay inside the
    box the clip reveals. */
function Wipe({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: WIPE_HIDDEN }}
        animate={inView ? { clipPath: WIPE_SHOWN } : {}}
        transition={{ duration: 0.85, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Hazard-stripe divider that shears with scroll velocity — the page feels
    bolted to your thumb. Clamped hard; static under reduced motion. */
function Hazard({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 240, damping: 44, mass: 0.7 })
  const x = useTransform(smooth, [-2600, 2600], [30, -30])
  const skewX = useTransform(smooth, [-2600, 2600], [3.5, -3.5])
  return (
    <div aria-hidden className={`relative h-4 overflow-hidden md:h-5 ${className ?? ''}`} style={{ background: BLACK }}>
      <motion.div
        className="absolute inset-y-0 -left-20 -right-20"
        style={{ x: reduced ? 0 : x, skewX: reduced ? 0 : skewX, backgroundImage: STRIPES }}
      />
    </div>
  )
}

/** Mono hazard-label eyebrow, black or paper ground aware. */
function Tag({ text, onPaper = false }: { text: string; onPaper?: boolean }) {
  return (
    <p
      className="flex items-center gap-3 text-[12px] font-medium tracking-[0.26em] uppercase"
      style={{ fontFamily: MONO, color: onPaper ? DEEP : YELLOW }}
    >
      <span aria-hidden className="inline-block h-2.5 w-2.5" style={{ background: onPaper ? BLACK : YELLOW }} />
      {text}
    </p>
  )
}

/* ─────────────────────────────── sections ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -70 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  const link = 'hidden min-h-11 items-center px-3 text-[12.5px] tracking-[0.18em] uppercase transition-colors duration-150 hover:text-[#F4C400] md:inline-flex'
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-400"
      style={{
        background: solid ? 'rgba(12,12,12,0.92)' : 'transparent',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="mx-auto flex h-[66px] max-w-[1380px] items-center justify-between px-4 md:px-8">
        <a href="#" onClick={go('#efst')} className="inline-flex min-h-11 items-center transition-opacity duration-150 hover:opacity-75" aria-label="Bílageirinn, efst á síðu">
          <img src={LOGO} alt="Bílageirinn" className="h-8 w-auto md:h-9" style={{ filter: 'brightness(0) invert(1)' }} />
        </a>
        <nav className="flex items-center gap-1" style={{ fontFamily: MONO, color: MUT }}>
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>Þjónusta</a>
          <a href="#tjon" onClick={go('#tjon')} className={link}>Tjónaviðgerðir</a>
          <a href="#samband" onClick={go('#samband')} className={link}>Hafa samband</a>
          <a
            href={PHONE_HREF}
            className="ml-2 inline-flex min-h-11 items-center gap-2 px-4 text-[15px] font-bold transition-transform duration-150 hover:scale-[1.04] active:scale-[0.96]"
            style={{ background: YELLOW, color: BLACK, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.6} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </motion.header>
  )
}

/* Act 1 · hero carousel slides: one vetted photo per service offering,
   paired 1:1 with SERVICES entries (Smurstöð has no distinct photo of its
   own, so its line stays text-only down in Act 5). Booth/garage are used
   here — not malun/lift — specifically so this carousel and the Act 6
   process reel never show the exact same frame. Alt text matches the
   SERVICE_ALTS strings used later for the same photos. */
const HERO_SLIDES = [
  { img: IMG.retting, alt: 'Flötur yfirbyggingar unninn með höndunum', service: SERVICES[0] },
  { img: IMG.booth, alt: 'Bíll afmarkaður með pappír í sprautuklefa', service: SERVICES[1] },
  { img: IMG.garage, alt: 'Verkstæðisgólf með bílum í viðgerð', service: SERVICES[2] },
  { img: IMG.wheel, alt: 'Fjöðrunar- og hjólabúnaður í nærmynd', service: SERVICES[4] },
  { img: IMG.headlight, alt: 'Aðalljós á dökkum bíl', service: SERVICES[5] },
  { img: IMG.brake, alt: 'Bremsubúnaður skoðaður með hjólið af', service: SERVICES[6] },
]

/* ── Act 1 · hero. Built as a video slot: full-bleed muted loop drops in
      later; until then a carousel of vetted shop photos cycles behind the
      headline, each one breathing, wiping to the next along the same 135°
      diagonal as the hazard stripes. Headline slams in line by line —
      whole lines, no overflow masks, because Í accents sit above Bebas cap
      height and masks decapitate them. The yellow registration block
      stamps behind the final word. */
function Hero() {
  const reduced = useReducedMotion()
  const words = HERO.headline.split(' ') /* Aftur í rétta línu. */
  const lines = [words.slice(0, 2).join(' '), words[2], words[3]]
  const lineDelay = (i: number) => 0.3 + i * 0.17
  const stampDelay = lineDelay(2) + 0.28

  /* carousel: `display` trails `active` — it only catches up once the
     wipe finishes, so the base layer always holds the last fully-revealed
     photo and the wipe never uncovers bare black. Under reduced motion the
     base layer renders `active` directly and the wipe layer never mounts. */
  const [active, setActive] = useState(0)
  const [display, setDisplay] = useState(0)
  const [paused, setPaused] = useState(false)
  const slide = HERO_SLIDES[active]
  const go = (i: number) => setActive(((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setTimeout(() => go(active + 1), 5600)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced, paused])

  return (
    <section
      id="efst"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="Ljósmyndir af þjónustu Bílageirans"
    >
      {/* video slot: swap this carousel for <video autoplay muted loop playsinline> when footage lands */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={reduced ? slide.img : HERO_SLIDES[display].img}
          alt={reduced ? slide.alt : HERO_SLIDES[display].alt}
          className="sg-breathe absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'brightness(0.62) contrast(1.05)' }}
        />
        {!reduced && active !== display && (
          <motion.img
            key={active}
            src={slide.img}
            alt={slide.alt}
            className="sg-breathe absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'brightness(0.62) contrast(1.05)' }}
            initial={{ clipPath: WIPE_HIDDEN }}
            animate={{ clipPath: WIPE_SHOWN }}
            transition={{ duration: 0.85, ease: EASE }}
            onAnimationComplete={() => setDisplay(active)}
          />
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${BLACK} 2%, rgba(12,12,12,0.82) 24%, rgba(12,12,12,0.28) 60%, rgba(12,12,12,0.62) 100%)`,
        }}
      />

      {/* current-slide caption: mono hazard tag + Bebas service name */}
      <div className="absolute left-4 top-[76px] z-10 max-w-[240px] md:left-8 md:top-24">
        {reduced ? (
          <>
            <Tag text={slide.service.tag} />
            <p
              className="mt-2 uppercase"
              style={{
                fontFamily: DISPLAY,
                color: PAPER,
                fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)',
                lineHeight: 1.08,
                textShadow: '0 2px 14px rgba(0,0,0,0.7)',
              }}
            >
              {slide.service.name}
            </p>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <Tag text={slide.service.tag} />
              <p
                className="mt-2 uppercase"
                style={{
                  fontFamily: DISPLAY,
                  color: PAPER,
                  fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)',
                  lineHeight: 1.08,
                  textShadow: '0 2px 14px rgba(0,0,0,0.7)',
                }}
              >
                {slide.service.name}
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* honest note for the planned loop, plus real carousel controls — no
          fake play button anywhere. Bottom-anchored, clear of the nav band,
          so it never reads as a second header row under the real one. */}
      <div className="absolute bottom-10 right-4 z-10 flex flex-col items-end gap-2.5 md:bottom-14 md:right-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Fyrri mynd"
            className="group flex min-h-11 min-w-11 items-center justify-center border transition-colors duration-150 hover:border-current"
            style={{ borderColor: 'rgba(247,245,239,0.4)', color: PAPER }}
          >
            <ChevronLeft size={16} strokeWidth={2.4} aria-hidden className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <div className="flex items-center gap-0.5" role="tablist" aria-label="Veldu þjónustumynd">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.service.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.service.name}
                onClick={() => go(i)}
                className="group px-0.5 py-3"
              >
                <span
                  aria-hidden
                  className="block h-[3px] w-6 transition-all duration-200 md:w-8 group-hover:opacity-80"
                  style={{ background: i === active ? YELLOW : 'rgba(247,245,239,0.32)' }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Næsta mynd"
            className="group flex min-h-11 min-w-11 items-center justify-center border transition-colors duration-150 hover:border-current"
            style={{ borderColor: 'rgba(247,245,239,0.4)', color: PAPER }}
          >
            <ChevronRight size={16} strokeWidth={2.4} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
        <p
          className="text-right text-[10px] tracking-[0.18em] uppercase"
          style={{ fontFamily: MONO, color: MUT }}
        >
          Ljósmyndir þjónustunnar · Myndband væntanlegt úr Grófinni
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1380px] px-4 pb-12 pt-44 md:px-8 md:pb-16">
        <motion.p
          className="mb-6 text-[12px] font-medium tracking-[0.26em] uppercase md:text-[13px]"
          style={{ fontFamily: MONO, color: YELLOW, textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        >
          Réttingar · Bílamálun · Grófin 14a, Reykjanesbær
        </motion.p>

        <h1
          className="uppercase"
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(4rem, 14.5vw, 11.5rem)',
            lineHeight: 1.08 /* Í accents live above cap height — never tighter */,
            letterSpacing: '0.005em',
          }}
        >
          {lines.map((line, i) => {
            const last = i === lines.length - 1
            return (
              <span key={i} className="block">
                <motion.span
                  className="relative inline-block"
                  initial={reduced ? false : { opacity: 0, y: 110, scale: 1.08 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={reduced ? { duration: 0 } : { ...SLAM, delay: lineDelay(i) }}
                >
                  {last && (
                    <motion.span
                      aria-hidden
                      className="absolute -inset-x-4 -inset-y-2 md:-inset-x-7 md:-inset-y-3"
                      style={{ background: YELLOW }}
                      initial={reduced ? false : { opacity: 0, scale: 1.55 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={reduced ? { duration: 0 } : { ...STAMP, delay: stampDelay }}
                    />
                  )}
                  <motion.span
                    className="relative"
                    initial={reduced ? false : { color: PAPER }}
                    animate={{ color: last ? BLACK : PAPER }}
                    transition={reduced ? { duration: 0 } : { duration: 0.18, delay: stampDelay + 0.04 }}
                  >
                    {line}
                  </motion.span>
                </motion.span>
              </span>
            )
          })}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-[17px] leading-relaxed md:text-lg"
          style={{ fontFamily: BODY, color: PAPER, textShadow: '0 1px 10px rgba(0,0,0,0.55)' }}
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: stampDelay + 0.15 }}
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-stretch gap-3"
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: stampDelay + 0.3 }}
        >
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[56px] items-center gap-3 px-8 text-[17px] font-bold transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] max-sm:w-full max-sm:justify-center"
            style={{ background: YELLOW, color: BLACK, fontFamily: BODY }}
          >
            <Phone size={18} strokeWidth={2.6} aria-hidden />
            {HERO.ctaPrimary}
          </a>
          <a
            href="#thjonusta"
            className="inline-flex min-h-[56px] items-center border-2 border-[rgba(247,245,239,0.5)] px-8 text-[16px] font-medium text-[#F7F5EF] transition duration-150 hover:border-[#F4C400] hover:bg-[#F4C400] hover:text-[#0C0C0C] active:scale-[0.97] max-sm:w-full max-sm:justify-center"
            style={{ fontFamily: BODY }}
          >
            {HERO.ctaSecondary}
          </a>
        </motion.div>

        <motion.p
          className="mt-8 text-[12.5px] tracking-[0.14em] uppercase"
          style={{ fontFamily: MONO, color: MUT }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: stampDelay + 0.45 }}
        >
          {HERO.cert}
        </motion.p>
      </div>
    </section>
  )
}

/* ── Act 2 · trust marquee. One band, de-templated by size rhythm:
      alternating enormous Bebas and small mono items. Second copy is
      aria-hidden; the whole band drifts slowly. */
function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14"
    >
      {TRUST_STRIP.map((t, i) =>
        i % 2 === 0 ? (
          <li
            key={t}
            className="whitespace-nowrap uppercase"
            style={{ fontFamily: DISPLAY, color: PAPER, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.1 }}
          >
            {t}
          </li>
        ) : (
          <li
            key={t}
            className="flex items-center gap-10 whitespace-nowrap text-[12.5px] tracking-[0.24em] uppercase md:gap-14"
            style={{ fontFamily: MONO, color: YELLOW }}
          >
            <span aria-hidden className="inline-block h-3 w-3" style={{ background: YELLOW }} />
            {t}
          </li>
        ),
      )}
      <li aria-hidden className="inline-block h-3 w-3 shrink-0" style={{ background: YELLOW }} />
    </ul>
  )
  return (
    <div className="overflow-hidden border-b py-7 md:py-9" style={{ borderColor: HAIR }} role="marquee">
      <div className="sg-marquee flex w-max items-center">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/* ── Act 3 · verified facts as a poster: enormous yellow Bebas numerals. */
function Facts() {
  return (
    <section className="border-b" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1380px] px-4 py-16 md:px-8 md:py-24">
        <Tag text="Staðreyndir úr Grófinni" />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <Slam key={f.label} delay={i * 0.09}>
              <p
                className="uppercase"
                style={{
                  fontFamily: DISPLAY,
                  color: YELLOW,
                  fontSize: 'clamp(3.6rem, 9vw, 7.5rem)',
                  lineHeight: 1.08 /* Ö in ÖLL carries a diaeresis above cap height */,
                }}
              >
                {f.num !== null ? `${f.num}${f.suffix}` : f.text}
              </p>
              <p
                className="mt-2 max-w-[24ch] border-t pt-3 text-[11.5px] tracking-[0.18em] uppercase"
                style={{ fontFamily: MONO, color: MUT, borderColor: HAIR }}
              >
                {f.label}
              </p>
            </Slam>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Act 4 · INVERTED paper band: the aviation-precision story as a poster
      pull-quote, then the timeline as three stamped year blocks. */
function Story() {
  return (
    <section style={{ background: PAPER, color: BLACK }}>
      <div className="mx-auto max-w-[1380px] px-4 py-20 md:px-8 md:py-32">
        <Tag text="Nákvæmni úr flugskýlinu" onPaper />
        <Wipe className="mt-6">
          <h2
            className="max-w-5xl uppercase"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2.8rem, 7.5vw, 6.4rem)',
              lineHeight: 1.09,
              letterSpacing: '0.005em',
            }}
          >
            {STORY.title}
          </h2>
        </Wipe>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <Slam>
              <p className="max-w-[62ch] text-[17px] leading-relaxed md:text-[18px]" style={{ fontFamily: BODY }}>
                {STORY.lead}
              </p>
            </Slam>
            {/* the shop's thesis, set poster-size */}
            <Slam delay={0.12}>
              <blockquote
                className="mt-10 max-w-3xl border-l-[6px] pl-6 uppercase md:pl-8"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 'clamp(1.7rem, 3.6vw, 2.9rem)',
                  lineHeight: 1.14,
                  borderColor: YELLOW,
                }}
              >
                {STORY.body}
              </blockquote>
            </Slam>
          </div>
          <Slam delay={0.1} className="max-md:order-first">
            <div className="overflow-hidden border-2" style={{ borderColor: BLACK }}>
              <img
                src={IMG.polish}
                alt="Lakk fægt á dökku húddi með fægivél"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] h-auto w-full object-cover md:aspect-[4/5]"
              />
              <p
                className="flex items-center justify-between gap-4 border-t-2 px-4 py-2.5 text-[11px] tracking-[0.22em] uppercase"
                style={{ fontFamily: MONO, borderColor: BLACK, color: PMUT }}
              >
                <span>Handverk</span>
                <span aria-hidden style={{ color: DEEP }}>MÆLT · SKRÁÐ · STAÐFEST</span>
              </p>
            </div>
          </Slam>
        </div>

        {/* three stamped year blocks */}
        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3 md:gap-6">
          {STORY.timeline.map((t, i) => (
            <Slam key={t.year} delay={i * 0.12}>
              <div className="relative h-full border-2 p-6 md:p-8" style={{ borderColor: BLACK }}>
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-6 w-6"
                  style={{ background: YELLOW, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                />
                <p
                  style={{ fontFamily: DISPLAY, fontSize: 'clamp(3.4rem, 6vw, 5rem)', lineHeight: 1.05 }}
                >
                  {t.year}
                </p>
                <p className="mt-3 max-w-[44ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: PMUT }}>
                  {t.text}
                </p>
              </div>
            </Slam>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Act 5 · services as a poster index: giant outlined numerals, huge
      Bebas rows; the active row floods yellow, a side panel shows the
      photo + description. The ONE functional asymmetric layout. */
const SERVICE_IMGS = [IMG.retting, IMG.booth, IMG.garage, IMG.lift, IMG.wheel, IMG.headlight, IMG.brake]
const SERVICE_ALTS = [
  'Flötur yfirbyggingar unninn með höndunum',
  'Bíll afmarkaður með pappír í sprautuklefa',
  'Verkstæðisgólf með bílum í viðgerð',
  'Unnið undir bíl á lyftu',
  'Fjöðrunar- og hjólabúnaður í nærmynd',
  'Aðalljós á dökkum bíl',
  'Bremsubúnaður skoðaður með hjólið af',
]

function ServiceIndex() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  return (
    <section id="thjonusta" className="scroll-mt-20 border-b" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1380px] px-4 py-20 md:px-8 md:py-28">
        <Tag text="Þjónustan" />
        <Wipe className="mt-6">
          <h2
            className="max-w-4xl uppercase"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 7.5vw, 6.4rem)', lineHeight: 1.09 }}
          >
            Allt undir sama þaki
          </h2>
        </Wipe>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.35fr_1fr] md:gap-12">
          {/* photo + desc panel — first on mobile so the tap result is visible */}
          <div className="order-first md:order-last">
            <div className="md:sticky md:top-24">
              <div className="relative aspect-video overflow-hidden border md:aspect-[4/3]" style={{ borderColor: HAIR }}>
                <AnimatePresence initial={false}>
                  <motion.img
                    key={active}
                    src={SERVICE_IMGS[active]}
                    alt={SERVICE_ALTS[active]}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </AnimatePresence>
                <span
                  aria-hidden
                  className="absolute left-0 top-0 px-3 py-1.5 text-[11px] font-medium tracking-[0.2em]"
                  style={{ background: YELLOW, color: BLACK, fontFamily: MONO }}
                >
                  {SERVICES[active].tag}
                </span>
              </div>
              <div className="border border-t-0 p-5 md:p-6" style={{ borderColor: HAIR }}>
                <p className="min-h-[4.5em] text-[15.5px] leading-relaxed md:text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
                  {SERVICES[active].desc}
                </p>
              </div>
            </div>
          </div>

          <ul className="border-t" style={{ borderColor: HAIR }} role="list">
            {SERVICES.map((s, i) => {
              const on = i === active
              return (
                <li key={s.name} className="border-b" style={{ borderColor: HAIR }}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={on}
                    className="relative w-full overflow-hidden text-left"
                  >
                    {/* the yellow flood */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: YELLOW }}
                      initial={false}
                      animate={{ y: on ? '0%' : '101%' }}
                      transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
                    />
                    <span className="relative flex min-h-[64px] items-center gap-4 px-1 py-3 md:gap-6 md:py-4">
                      <span
                        aria-hidden
                        className="w-[2ch] shrink-0 transition-colors duration-300"
                        style={{
                          fontFamily: DISPLAY,
                          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                          lineHeight: 1,
                          color: 'transparent',
                          WebkitTextStroke: `1.5px ${on ? BLACK : 'rgba(247,245,239,0.5)'}`,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="min-w-0 uppercase transition-colors duration-300"
                        style={{
                          fontFamily: DISPLAY,
                          fontSize: 'clamp(1.9rem, 4.6vw, 3.4rem)',
                          lineHeight: 1.1 /* Réttingar, Hjólastilling, Ljósastilling: accented caps */,
                          color: on ? BLACK : PAPER,
                        }}
                      >
                        {s.name}
                      </span>
                      <span
                        className="ml-auto hidden shrink-0 text-[11px] tracking-[0.18em] transition-colors duration-300 lg:inline"
                        style={{ fontFamily: MONO, color: on ? BLACK : MUT }}
                      >
                        {s.tag}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-8 text-[14px]" style={{ fontFamily: BODY, color: MUT }}>
          Smurstöðin svarar beint í{' '}
          <a
            href={LUBE_PHONE_HREF}
            className="inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4 transition-opacity duration-150 hover:opacity-75"
            style={{ color: YELLOW }}
          >
            {LUBE_PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </section>
  )
}

/* ── Act 6 · process reel: horizontal scroll-snap filmstrip built as video
      slots. Native scroll, no hijacking; frame pans pause off-screen. */
const REEL = [
  { img: IMG.malun, cap: 'Sprautuklefi', alt: 'Sprautuvinna í málningarklefa' },
  { img: IMG.retting, cap: 'Réttibekkur', alt: 'Yfirbygging unnin á réttingaverkstæði' },
  { img: IMG.wheel, cap: 'Hjólastilling', alt: 'Hjóla- og fjöðrunarbúnaður í nærmynd' },
  { img: IMG.headlight, cap: 'Ljósastilling', alt: 'Aðalljós á dökkum bíl í myrkri' },
  { img: IMG.brake, cap: 'Bremsur', alt: 'Bremsubúnaður skoðaður með hjólið af' },
]

const SPROCKET = `repeating-linear-gradient(90deg, transparent 0 10px, ${PAPER} 10px 24px, transparent 24px 34px)`

function ProcessReel() {
  const stripRef = useRef<HTMLDivElement>(null)
  /* not once: pans run only while the strip is actually on screen */
  const inView = useInView(stripRef, { margin: '-15% 0px' })
  return (
    <section className="border-b" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1380px] px-4 pt-20 md:px-8 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Tag text="Af gólfinu" />
            <Wipe className="mt-6">
              <h2
                className="uppercase"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 7.5vw, 6.4rem)', lineHeight: 1.09 }}
              >
                Verkin í vinnslu
              </h2>
            </Wipe>
          </div>
          <p aria-hidden className="pb-2 text-[12px] tracking-[0.24em] uppercase" style={{ fontFamily: MONO, color: YELLOW }}>
            Dragðu →
          </p>
        </div>
      </div>

      <div
        ref={stripRef}
        className="sg-reel mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mt-14 md:gap-6 md:px-8"
        style={{ scrollPaddingInline: '1rem' }}
      >
        {REEL.map((f, i) => (
          <figure key={f.cap} className="w-[80vw] max-w-[560px] shrink-0 snap-center md:snap-start">
            {/* film frame: sprocket holes top + bottom, pan inside */}
            <div className="border border-[rgba(247,245,239,0.16)] transition duration-150 hover:border-[#F4C400] hover:brightness-110">
              <div aria-hidden className="h-3.5 opacity-25" style={{ backgroundImage: SPROCKET }} />
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={f.img}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  className="sg-pan absolute inset-y-0 left-0 h-full w-[112%] max-w-none object-cover"
                  style={{ animationPlayState: inView ? 'running' : 'paused', filter: 'brightness(0.9)' }}
                />
                <span
                  className="absolute bottom-3 left-4 uppercase"
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    lineHeight: 1.1,
                    color: PAPER,
                    textShadow: '0 2px 14px rgba(0,0,0,0.8)',
                  }}
                >
                  {f.cap}
                </span>
                <span
                  aria-hidden
                  className="absolute right-3 top-3 px-2 py-1 text-[10.5px] tracking-[0.18em]"
                  style={{ fontFamily: MONO, background: 'rgba(12,12,12,0.72)', color: YELLOW }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(REEL.length).padStart(2, '0')}
                </span>
              </div>
              <div aria-hidden className="h-3.5 opacity-25" style={{ backgroundImage: SPROCKET }} />
            </div>
          </figure>
        ))}
      </div>

      <p
        className="mx-auto max-w-[1380px] px-4 pb-16 pt-4 text-[11px] tracking-[0.22em] uppercase md:px-8 md:pb-24"
        style={{ fontFamily: MONO, color: MUT }}
      >
        Stutt myndbönd · Tekin upp á gólfinu · Væntanleg
      </p>
    </section>
  )
}

/* ── Act 7 · the claim, four numbered slabs — and the loaner car gets the
      loudest moment on the page: a full-width signal-yellow slab. */
function Claims() {
  const steps = CLAIM_STEPS.filter(s => !s.highlight)
  const loaner = CLAIM_STEPS.find(s => s.highlight)
  return (
    <section id="tjon" className="scroll-mt-20">
      <div className="mx-auto max-w-[1380px] px-4 py-20 md:px-8 md:py-28">
        <Tag text="Tjónaviðgerðir" />
        <Wipe className="mt-6">
          <h2
            className="max-w-4xl uppercase"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 7.5vw, 6.4rem)', lineHeight: 1.09 }}
          >
            {INSURANCE.title}
          </h2>
        </Wipe>
        <Slam delay={0.1}>
          <p className="mt-7 max-w-[60ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
            {INSURANCE.body}
          </p>
        </Slam>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {steps.map((s, i) => (
            <Slam key={s.title} delay={i * 0.1}>
              <div className="h-full border p-6 md:p-8" style={{ borderColor: HAIR }}>
                <p
                  aria-hidden
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 'clamp(3rem, 6vw, 4.6rem)',
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `1.5px ${YELLOW}`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mt-4 uppercase"
                  style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', lineHeight: 1.12 }}
                >
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  {s.desc}
                </p>
              </div>
            </Slam>
          ))}
        </div>
      </div>

      {/* the differentiator, full bleed */}
      {loaner && (
        <div style={{ background: YELLOW, color: BLACK }}>
          <div className="mx-auto max-w-[1380px] px-4 py-16 md:px-8 md:py-24">
            <div className="flex flex-wrap items-baseline gap-x-6">
              <p aria-hidden className="text-[13px] font-medium tracking-[0.26em]" style={{ fontFamily: MONO }}>
                04 · INNIFALIÐ
              </p>
            </div>
            <Slam>
              <h3
                className="mt-4 uppercase"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 'clamp(3.4rem, 12.5vw, 10rem)',
                  lineHeight: 1.08 /* Á in LÁNSBÍLL: accent above cap height */,
                  letterSpacing: '0.005em',
                }}
              >
                {loaner.title}
              </h3>
            </Slam>
            <Slam delay={0.12}>
              <p className="mt-5 max-w-[52ch] text-[17px] font-medium leading-relaxed md:text-[19px]" style={{ fontFamily: BODY }}>
                {loaner.desc}
              </p>
            </Slam>
          </div>
        </div>
      )}

      {/* insurance ledger line */}
      <div className="border-b" style={{ borderColor: HAIR }}>
        <div
          className="mx-auto flex max-w-[1380px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-6 md:px-8"
          style={{ fontFamily: MONO }}
        >
          <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
            Öll tryggingafélög
          </span>
          {INSURANCE.companies.map(c => (
            <span key={c} className="text-[13px] tracking-[0.18em] uppercase" style={{ color: MUT }}>
              {c}
            </span>
          ))}
          <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: MUT }}>
            · CABAS-tjónamat
          </span>
        </div>
      </div>
    </section>
  )
}

/* ── Act 8 · paper band: the marks as stenciled plates, craft checklist
      stamps, and the crew ledger. */
function BrandsCraft() {
  return (
    <section style={{ background: PAPER, color: BLACK }}>
      <div className="mx-auto max-w-[1380px] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <div>
            <Tag text="Viðurkennt þjónustuverkstæði" onPaper />
            <Wipe className="mt-6">
              <h2
                className="uppercase"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1.09 }}
              >
                {BRANDS.title}
              </h2>
            </Wipe>
            <Slam delay={0.08}>
              <p className="mt-6 max-w-[58ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY }}>
                {BRANDS.body}
              </p>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: PMUT }}>
                {BRANDS.note}
              </p>
            </Slam>

            {/* stenciled plates */}
            <div className="mt-10 grid grid-cols-2 gap-4 md:gap-5">
              {[
                { src: IMG.toyota, alt: 'Toyota' },
                { src: IMG.kia, alt: 'Kia' },
              ].map((m, i) => (
                <Slam key={m.alt} delay={i * 0.1}>
                  <div className="border-2" style={{ borderColor: BLACK }}>
                    <div className="flex aspect-[16/9] items-center justify-center p-6 md:p-8">
                      <img src={m.src} alt={m.alt} loading="lazy" decoding="async" className="max-h-14 w-auto max-w-full object-contain md:max-h-16" />
                    </div>
                    <p
                      className="border-t-2 px-3 py-1.5 text-[10.5px] tracking-[0.24em] uppercase"
                      style={{ fontFamily: MONO, borderColor: BLACK, color: PMUT }}
                    >
                      Viðurkenning · {m.alt}
                    </p>
                  </div>
                </Slam>
              ))}
            </div>
          </div>

          <div>
            <Tag text={CRAFT.title} onPaper />
            <Slam delay={0.05}>
              <p className="mt-6 max-w-[54ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY }}>
                {CRAFT.body}
              </p>
            </Slam>
            <ul className="mt-8 space-y-3">
              {CRAFT.points.map((p, i) => (
                <Slam key={p} delay={0.1 + i * 0.08}>
                  <li
                    className="flex items-center gap-4 border-2 px-4 py-3.5 text-[13px] font-medium tracking-[0.16em] uppercase"
                    style={{ fontFamily: MONO, borderColor: BLACK }}
                  >
                    <span aria-hidden className="inline-block h-3.5 w-3.5 shrink-0" style={{ background: YELLOW, border: `2px solid ${BLACK}` }} />
                    {p}
                  </li>
                </Slam>
              ))}
            </ul>

            {/* crew ledger */}
            <div className="mt-12 border-t-2 pt-2" style={{ borderColor: BLACK }}>
              <p className="pt-3 text-[11px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: DEEP }}>
                Fólkið í Grófinni
              </p>
              {TEAM.map((p, i) => (
                <Slam key={p.name} delay={i * 0.06}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 border-b py-3.5" style={{ borderColor: PHAIR }}>
                    <p className="text-[16px] font-bold" style={{ fontFamily: BODY }}>
                      {p.name}
                    </p>
                    <p className="text-[11.5px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: PMUT }}>
                      {p.role}
                      {p.detail ? ` · ${p.detail}` : ''}
                    </p>
                  </div>
                </Slam>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Act 9 · contact: near-full-viewport black act, the phone number as
      the biggest thing on the whole page. */
function Contact() {
  return (
    <section id="samband" className="scroll-mt-20 flex min-h-[92svh] flex-col justify-center">
      <div className="mx-auto w-full max-w-[1380px] px-4 py-20 md:px-8 md:py-28">
        <Tag text={CTA.title} />
        <Slam className="mt-6">
          <p className="max-w-[54ch] text-[17px] leading-relaxed md:text-[18px]" style={{ fontFamily: BODY, color: MUT }}>
            {CTA.body}
          </p>
        </Slam>
        <Slam delay={0.12}>
          <a
            href={PHONE_HREF}
            className="mt-6 inline-block transition-transform duration-150 hover:scale-[1.02] active:scale-[0.985] md:mt-8"
            style={{
              fontFamily: DISPLAY,
              color: YELLOW,
              fontSize: 'clamp(4rem, 16vw, 11rem)',
              lineHeight: 1.02 /* digits only: no accents to clip */,
              letterSpacing: '0.01em',
            }}
            aria-label={`Hringja í ${PHONE_DISPLAY}`}
          >
            {PHONE_DISPLAY}
          </a>
        </Slam>

        <div
          className="mt-12 grid gap-x-10 gap-y-8 border-t pt-10 text-[13.5px] sm:grid-cols-2 lg:grid-cols-4"
          style={{ fontFamily: MONO, borderColor: HAIR }}
        >
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
              Opnunartími
            </p>
            <ul className="mt-3 space-y-1.5 leading-relaxed" style={{ color: MUT }}>
              {HOURS.map(h => (
                <li key={h.days}>
                  <span style={{ color: PAPER }}>{h.days}</span>
                  <br />
                  {h.close ? `${h.open}–${h.close}` : h.open}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
              Staðsetning
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: MUT }}>
              <span style={{ color: PAPER }}>{ADDRESS.street}</span>
              <br />
              {ADDRESS.town}
            </p>
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 font-medium underline decoration-1 underline-offset-4 transition-opacity duration-150 hover:opacity-75"
              style={{ color: PAPER }}
            >
              <MapPin size={14} strokeWidth={2.4} aria-hidden />
              Opna í kortum
            </a>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
              Samband
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: MUT }}>
              <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 break-all transition-opacity duration-150 hover:opacity-75" style={{ color: PAPER }}>
                {EMAIL}
              </a>
              <br />
              Smurstöðin:{' '}
              <a href={LUBE_PHONE_HREF} className="inline-flex min-h-11 items-center font-medium transition-opacity duration-150 hover:opacity-75" style={{ color: PAPER }}>
                {LUBE_PHONE_DISPLAY}
              </a>
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase" style={{ color: YELLOW }}>
              {FACILITY.title}
            </p>
            <p className="mt-3 max-w-[36ch] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {FACILITY.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BLACK)
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
    const lenis = new Lenis({ duration: 1.05 })
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
    <div className="sg-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero />
        <Marquee />
        <Facts />
        <Story />
        {/* hazard divider trimmed from 4 uses to 3 — kept only where it
            stitches an actual black/paper act inversion, so it still reads
            as a signature move and not a scroll tic */}
        <Hazard />
        <ServiceIndex />
        <ProcessReel />
        <Claims />
        <Hazard />
        <BrandsCraft />
        <Hazard />
        <Contact />
      </main>

      <div
        className="px-4 py-5 text-center text-[11px] tracking-[0.16em]"
        style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
