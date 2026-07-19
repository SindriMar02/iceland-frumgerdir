import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { brandOffsetClass, setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BAND,
  CLOSING,
  DOG_QUOTES,
  EMAIL,
  HERITAGE,
  HERO,
  IMG,
  INTRO,
  JOURNEY,
  MAILTO,
  MAPS_HREF,
  MOUNTAIN,
  NAV,
  NEARBY,
  PHONE,
  PHONE_HREF,
  PRACTICAL,
  PRICE,
  REVIEW_QUOTES,
  REVIEWS,
  ROOMS,
  ROOMS_LEDE,
  SKOLIE,
  srcSet,
  u,
} from './data'
import type { Quote } from './data'

const company = getPreviewCompany('setberg')

/* ── Palette (brief section C) ─────────────────────────────────────────────
 * GROUND #1C231E moss-basalt · INK #F4EEE0 parchment (AAA on ground)
 * ACCENT #C97B45 rust/terracotta — CTA fills carry GROUND text (AA);
 * accent-as-text only at large/bold sizes. SAGE #8B9C87 quiet labels,
 * SLATE #4A5750 card surfaces/hairlines. */
const GROUND = '#1C231E'
const INK = '#F4EEE0'
const ACCENT = '#C97B45'
const SAGE = '#8B9C87'
const SLATE = '#4A5750'
const HAIRLINE = 'rgba(244,238,224,.14)'

const EASE = 'cubic-bezier(.22,1,.36,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE0]'
const FOCUS_ON_LIGHT =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C231E]'

/* ── Reveal — IntersectionObserver on the (untransformed-at-rest) element;
 * failsafe is viewport-gated per craft-ledger #25 so below-fold reveals
 * still animate for real scrollers. ── */
function Reveal({
  children,
  delay = 0,
  y = 24,
  dur = 0.75,
  className = '',
  style,
  reduce,
}: {
  children: ReactNode
  delay?: number
  y?: number
  dur?: number
  className?: string
  style?: CSSProperties
  reduce: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(reduce)
  useEffect(() => {
    if (reduce) return
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
    const t = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reduce])
  return (
    <div
      ref={ref}
      className={className}
      style={
        reduce
          ? style
          : {
              ...style,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${y}px)`,
              transition: `opacity ${dur}s ${EASE} ${delay}ms, transform ${dur}s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  )
}

/* ── ClipFigure — standalone content image with explicit aspect; observer
 * sits on the untransformed wrapper, the inner img clips open (ledger #7/#12:
 * safe ONLY for standalone images with their own aspect, which this is). ── */
function ClipFigure({
  img,
  alt,
  caption,
  aspect,
  className = '',
  sizes = '(min-width: 768px) 50vw, 100vw',
  reduce,
}: {
  img: string
  alt: string
  caption?: string
  aspect: string
  className?: string
  sizes?: string
  reduce: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(reduce)
  useEffect(() => {
    if (reduce) return
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
    const t = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reduce])
  return (
    <figure className={className}>
      <div ref={ref} className={`relative overflow-hidden ${aspect}`}>
        <Img
          src={u(img, 1600)}
          srcSet={srcSet(img)}
          sizes={sizes}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={
            reduce
              ? undefined
              : {
                  clipPath: shown ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
                  transform: shown ? 'scale(1)' : 'scale(1.05)',
                  transition: `clip-path 1s ${EASE}, transform 1.3s ${EASE}`,
                }
          }
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8B9C87]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function QuoteRow({ q }: { q: Quote }) {
  return (
    <blockquote className="py-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      <p className="max-w-[52ch] font-sans text-[0.98rem] leading-relaxed" style={{ color: INK }}>
        &ldquo;{q.text}&rdquo;
      </p>
      <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: SAGE }}>
        {q.name} · {q.score} · {q.date}
      </footer>
    </blockquote>
  )
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export default function Page() {
  const reduce = useReducedMotion() ?? false

  /* Lenis smooth scroll — skipped entirely under reduced motion. */
  useEffect(() => {
    document.title = 'Setberg Guesthouse · Bærinn undir fjallinu'
    setThemeColor(GROUND)
    if (reduce) return
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
  }, [reduce])

  /* ── Signature: "Þokan léttir" — hero mist clears over the first ~half
   * viewport of scroll. ONE scrollYProgress; every value derived from the
   * raw progress inside one callback (ledger #26), written raw per frame,
   * zero CSS transitions on any scrubbed property. ── */
  const heroRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const mistRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const scoreRef = useRef<HTMLSpanElement>(null)
  const ctaOnRef = useRef(false)
  const [ctaOn, setCtaOn] = useState(reduce)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const apply = useCallback(
    (v: number) => {
      if (reduce) return
      const p = clamp01(v / 0.45) // mist fully lifted at 45% of one viewport
      if (photoRef.current) {
        photoRef.current.style.filter = `blur(${(12 * (1 - p)).toFixed(2)}px)`
        photoRef.current.style.transform = `scale(${(1.06 - 0.06 * p).toFixed(4)})`
      }
      if (mistRef.current) mistRef.current.style.opacity = (1 - p).toFixed(3)
      if (scrimRef.current) scrimRef.current.style.opacity = (0.25 + 0.75 * p).toFixed(3)
      if (scoreRef.current) {
        const s = 9.4 * clamp01(v / 0.4)
        scoreRef.current.textContent = s.toFixed(1).replace('.', ',')
      }
      if (navRef.current) {
        const n = clamp01((v - 0.22) / 0.2)
        navRef.current.style.opacity = n.toFixed(3)
        navRef.current.style.transform = `translateY(${(-14 * (1 - n)).toFixed(2)}px)`
        navRef.current.style.visibility = n > 0.02 ? 'visible' : 'hidden'
        navRef.current.style.pointerEvents = n > 0.6 ? 'auto' : 'none'
      }
      const on = v > 0.5
      if (on !== ctaOnRef.current) {
        ctaOnRef.current = on
        setCtaOn(on)
      }
    },
    [reduce],
  )

  useMotionValueEvent(scrollYProgress, 'change', apply)
  useEffect(() => {
    apply(scrollYProgress.get())
  }, [apply, scrollYProgress])

  /* Rooms — the page's one functional split: the list drives the photo. */
  const [room, setRoom] = useState(0)

  const heroItem = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <div lang="is" className="font-sans antialiased" style={{ background: GROUND, color: INK }}>
      <style>{`
        @keyframes setberg-drift-a { from { transform: translate3d(-3%, -2%, 0) } to { transform: translate3d(3%, 2%, 0) } }
        @keyframes setberg-drift-b { from { transform: translate3d(2%, 1%, 0) } to { transform: translate3d(-2%, -3%, 0) } }
        @media (prefers-reduced-motion: reduce) {
          .setberg-mist-a, .setberg-mist-b { animation: none !important }
        }
      `}</style>
      <PreviewChrome company={company} />

      {/* ── Nav — settles in as the mist lifts ── */}
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md"
        style={{
          borderColor: HAIRLINE,
          background: 'rgba(28,35,30,.82)',
          ...(reduce
            ? {}
            : {
                opacity: 0,
                visibility: 'hidden' as const,
                pointerEvents: 'none' as const,
                willChange: 'opacity, transform',
              }),
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a
            href="#efst"
            className={`${brandOffsetClass()} font-poster text-lg tracking-[0.08em] ${FOCUS}`}
            style={{ color: INK }}
          >
            SETBERG
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`text-sm text-[#F4EEE0]/80 transition-colors duration-200 hover:text-[#F4EEE0] ${FOCUS}`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={PHONE_HREF}
            className={`flex min-h-[44px] items-center gap-2 rounded-[3px] px-4 py-2.5 text-sm font-semibold transition-transform duration-200 active:scale-[0.98] ${FOCUS}`}
            style={{ background: ACCENT, color: GROUND }}
          >
            <Phone size={15} strokeWidth={2} aria-hidden="true" />
            {PHONE}
          </a>
        </div>
      </header>

      <main id="efst">
        {/* ── 1. HERO — Þokan léttir ── */}
        <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden" aria-label="Setberg Guesthouse">
          <div
            ref={photoRef}
            className="absolute inset-0"
            style={
              reduce ? undefined : { filter: 'blur(12px)', transform: 'scale(1.06)', willChange: 'filter, transform' }
            }
          >
            <Img
              src={u(IMG.hero, 2000)}
              srcSet={srcSet(IMG.hero)}
              sizes="100vw"
              alt={HERO.photoAlt}
              loading="eager"
              fetchpriority="high"
              className="h-full w-full object-cover"
            />
          </div>

          {/* text scrim — earns its keep once the mist is gone */}
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="absolute inset-0 z-[1]"
            style={{
              opacity: reduce ? 1 : 0.25,
              background:
                'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(28,35,30,.62), transparent 72%), linear-gradient(to top, rgba(28,35,30,.85), transparent 38%)',
            }}
          />

          {/* the mist itself — dusk fog on the mountainside */}
          {!reduce && (
            <div
              ref={mistRef}
              aria-hidden="true"
              className="absolute inset-0 z-[2]"
              style={{
                opacity: 1,
                willChange: 'opacity',
                background: 'linear-gradient(180deg, rgba(30,37,32,.90), rgba(24,30,26,.94))',
              }}
            >
              <div
                className="setberg-mist-a absolute inset-[-8%]"
                style={{
                  background:
                    'radial-gradient(55% 45% at 28% 34%, rgba(196,204,194,.34), transparent 70%), radial-gradient(40% 35% at 80% 22%, rgba(180,190,180,.22), transparent 70%)',
                  animation: 'setberg-drift-a 16s ease-in-out infinite alternate',
                }}
              />
              <div
                className="setberg-mist-b absolute inset-[-8%]"
                style={{
                  background:
                    'radial-gradient(50% 42% at 70% 64%, rgba(188,197,187,.28), transparent 70%), radial-gradient(36% 30% at 18% 78%, rgba(170,181,171,.20), transparent 70%)',
                  animation: 'setberg-drift-b 21s ease-in-out infinite alternate',
                }}
              />
            </div>
          )}

          {/* hero content */}
          <div className="relative z-[3] flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
            <motion.p {...heroItem(0)} className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#F4EEE0]/75">
              {HERO.sub}
            </motion.p>
            <motion.h1
              {...heroItem(1)}
              className="font-poster mt-4 text-[clamp(3.8rem,14vw,9.5rem)] leading-[0.95] tracking-[0.02em]"
              style={{ color: INK }}
            >
              {HERO.wordmark}
            </motion.h1>
            <motion.p
              {...heroItem(2)}
              className="font-display mt-5 max-w-xl text-[clamp(1.15rem,2.6vw,1.5rem)] italic leading-[1.35] text-[#F4EEE0]/90"
            >
              {HERO.conceptLine}
            </motion.p>
            <motion.p {...heroItem(3)} className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-[#F4EEE0]/75">
              {HERO.tagline}
            </motion.p>
            <motion.div {...heroItem(4)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PHONE_HREF}
                className={`flex items-center gap-2.5 rounded-[3px] px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-200 active:scale-[0.98] ${FOCUS}`}
                style={{ background: ACCENT, color: GROUND }}
              >
                <Phone size={17} strokeWidth={2} aria-hidden="true" />
                Hringja í {PHONE}
              </a>
              <a
                href={MAILTO}
                className={`rounded-[3px] border px-7 py-3.5 text-[0.95rem] font-medium text-[#F4EEE0] transition-colors duration-200 hover:bg-[#F4EEE0]/10 ${FOCUS}`}
                style={{ borderColor: 'rgba(244,238,224,.4)' }}
              >
                Senda fyrirspurn
              </a>
            </motion.div>
          </div>

          {/* scrubbed review counter, bottom corner */}
          <div className="absolute bottom-6 left-5 z-[3] font-mono text-[12px] tracking-[0.08em] text-[#F4EEE0]/85 md:left-8">
            <span ref={scoreRef} className="text-xl font-bold" style={{ color: ACCENT }}>
              {reduce ? '9,4' : '0,0'}
            </span>
            <span className="text-[#F4EEE0]/60"> /10 · Booking.com · 279 umsagnir</span>
          </div>
        </section>

        {/* ── 2. Fyrsta kynning ── */}
        <section className="px-5 py-24 md:py-36">
          <div className="mx-auto max-w-2xl">
            <Reveal reduce={reduce}>
              <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                {INTRO.heading}
              </h2>
            </Reveal>
            {INTRO.body.map((p, i) => (
              <Reveal key={i} reduce={reduce} delay={120 + i * 110}>
                <p className="mt-6 max-w-[62ch] text-[1.05rem] leading-[1.85] text-[#F4EEE0]/85">{p}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 3. Farm heritage ── */}
        <section className="px-5 pb-24 md:pb-32">
          <div className="mx-auto max-w-6xl">
            <Reveal reduce={reduce}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: SAGE }}>
                Nesjum · Hornafjörður
              </p>
              <h2
                className="font-display mt-3 max-w-2xl text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]"
                style={{ color: INK }}
              >
                {HERITAGE.heading}
              </h2>
              <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-[1.8] text-[#F4EEE0]/82">{HERITAGE.body}</p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-8">
              <ClipFigure
                reduce={reduce}
                img={IMG[HERITAGE.imageA.img]}
                alt={HERITAGE.imageA.alt}
                caption={HERITAGE.imageA.caption}
                aspect="aspect-[4/3]"
              />
              <ClipFigure
                reduce={reduce}
                img={IMG[HERITAGE.imageB.img]}
                alt={HERITAGE.imageB.alt}
                caption={HERITAGE.imageB.caption}
                aspect="aspect-[4/3]"
                className="md:mt-14"
              />
            </div>
          </div>
        </section>

        {/* ── 4. Rooms & rates — the one functional split ── */}
        <section id="herbergi" className="scroll-mt-20 px-5 py-24 md:py-32" style={{ background: '#171D19' }}>
          <div className="mx-auto max-w-6xl">
            <Reveal reduce={reduce}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: SAGE }}>
                Herbergi og verð
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                Einfalt, hlýtt og heiðarlegt
              </h2>
              <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-[1.8] text-[#F4EEE0]/82">{ROOMS_LEDE}</p>
            </Reveal>

            <div className="mt-12 grid gap-10 md:grid-cols-[1.05fr_1fr] md:items-start">
              {/* photo panel — driven by the list (the split's functional reason) */}
              <Reveal reduce={reduce} className="md:order-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {ROOMS.map((r, i) => (
                    <Img
                      key={r.id}
                      src={u(IMG[r.img], 1600)}
                      srcSet={srcSet(IMG[r.img])}
                      sizes="(min-width: 768px) 46vw, 100vw"
                      alt={i === room ? r.imgAlt : ''}
                      aria-hidden={i === room ? undefined : true}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ opacity: i === room ? 1 : 0, transition: `opacity 0.55s ${EASE}` }}
                    />
                  ))}
                </div>
                <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: SAGE }}>
                  {ROOMS[room].imgCaption}
                </p>
              </Reveal>

              {/* room list */}
              <div className="md:order-1">
                <ul>
                  {ROOMS.map((r, i) => (
                    <li key={r.id} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                      <button
                        type="button"
                        onClick={() => setRoom(i)}
                        onMouseEnter={() => setRoom(i)}
                        onFocus={() => setRoom(i)}
                        aria-pressed={i === room}
                        className={`w-full py-6 text-left transition-colors duration-300 ${FOCUS}`}
                        style={{ color: i === room ? INK : 'rgba(244,238,224,.6)' }}
                      >
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-display text-[1.35rem] leading-[1.25]">{r.name}</span>
                          <span
                            className="shrink-0 font-mono text-[12px] tracking-[0.08em]"
                            style={{ color: i === room ? ACCENT : SAGE }}
                          >
                            {r.size}
                          </span>
                        </span>
                        <span className="mt-2 block max-w-[46ch] text-[0.94rem] leading-relaxed text-[#F4EEE0]/68">
                          {r.desc}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border p-6" style={{ borderColor: HAIRLINE, background: 'rgba(74,87,80,.22)' }}>
                  <p className="font-mono text-[1.15rem] font-bold tracking-[0.02em]" style={{ color: ACCENT }}>
                    {PRICE.from}
                  </p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-[#F4EEE0]/70">{PRICE.note}</p>
                  <p className="mt-4 text-[0.94rem] leading-relaxed text-[#F4EEE0]/82">{PRICE.kitchen}</p>
                  <a
                    href={MAILTO}
                    className={`mt-6 inline-flex items-center gap-2.5 rounded-[3px] px-6 py-3 text-[0.93rem] font-semibold transition-transform duration-200 active:scale-[0.98] ${FOCUS}`}
                    style={{ background: ACCENT, color: GROUND }}
                  >
                    <Mail size={16} strokeWidth={2} aria-hidden="true" />
                    Senda fyrirspurn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Golden field band ── */}
        <figure className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <Img
            src={u(IMG.goldenField, 2000)}
            srcSet={srcSet(IMG.goldenField)}
            sizes="100vw"
            alt={BAND.imgAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(28,35,30,.72), transparent 55%)' }}
          />
          <figcaption className="font-display absolute bottom-6 left-5 z-[1] text-[1.25rem] italic text-[#F4EEE0]/95 [text-shadow:0_1px_14px_rgba(0,0,0,.65)] md:left-10">
            {BAND.line}
          </figcaption>
        </figure>

        {/* ── 5. Skolie ── */}
        <section className="px-5 py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
            <ClipFigure
              reduce={reduce}
              img={IMG.collie}
              alt={SKOLIE.imgAlt}
              caption={SKOLIE.imgCaption}
              aspect="aspect-[5/4]"
            />
            <div>
              <Reveal reduce={reduce}>
                <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                  {SKOLIE.heading}
                </h2>
                <p className="mt-5 max-w-[56ch] text-[1.02rem] leading-[1.8] text-[#F4EEE0]/82">{SKOLIE.body}</p>
              </Reveal>
              <Reveal reduce={reduce} delay={140}>
                <div className="mt-8">
                  {DOG_QUOTES.map((q) => (
                    <QuoteRow key={q.name} q={q} />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 6. At the foot of the mountain — full-bleed bg, plain eager render ── */}
        <section className="relative flex min-h-[78vh] items-end overflow-hidden">
          <Img
            src={u(IMG.mountain, 2000)}
            srcSet={srcSet(IMG.mountain)}
            sizes="100vw"
            alt={MOUNTAIN.imgAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(28,35,30,.88) 0%, rgba(28,35,30,.5) 45%, transparent 70%)',
            }}
          />
          <div className="relative z-[1] mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:pb-20">
            <Reveal reduce={reduce}>
              <h2 className="font-display text-[clamp(2.1rem,5.5vw,3.6rem)] leading-[1.18]" style={{ color: INK }}>
                {MOUNTAIN.heading}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-[1.8] text-[#F4EEE0]/88">{MOUNTAIN.body}</p>
            </Reveal>
          </div>
        </section>

        {/* ── 7. The journey ── */}
        <section className="px-5 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal reduce={reduce}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: SAGE }}>
                Að komast til okkar
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                {JOURNEY.heading}
              </h2>
              <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-[1.8] text-[#F4EEE0]/82">{JOURNEY.body}</p>
            </Reveal>
            <ClipFigure
              reduce={reduce}
              img={IMG.sheepRoad}
              alt={JOURNEY.imgAlt}
              caption={JOURNEY.imgCaption}
              aspect="aspect-[16/7]"
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="mt-10"
            />
            <Reveal reduce={reduce} delay={100}>
              <div
                className="mt-8 flex flex-col gap-5 border p-6 md:flex-row md:items-center md:justify-between"
                style={{ borderColor: HAIRLINE }}
              >
                <p className="flex items-start gap-3 text-[1.05rem] leading-relaxed" style={{ color: INK }}>
                  <MapPin
                    size={20}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                    style={{ color: ACCENT }}
                  />
                  <span>
                    {ADDRESS}
                    <span className="mt-1 block font-mono text-[12px] tracking-[0.08em] text-[#F4EEE0]/60">
                      14 mín akstur frá Höfn · um 15 km
                    </span>
                  </span>
                </p>
                <a
                  href={MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className={`shrink-0 rounded-[3px] border px-6 py-3 text-[0.93rem] font-medium text-[#F4EEE0] transition-colors duration-200 hover:bg-[#F4EEE0]/10 ${FOCUS}`}
                  style={{ borderColor: 'rgba(244,238,224,.4)' }}
                >
                  Opna í kortum
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 8. Reviews ── */}
        <section id="umsagnir" className="scroll-mt-20 px-5 py-24 md:py-32" style={{ background: '#171D19' }}>
          <div className="mx-auto max-w-3xl">
            <Reveal reduce={reduce}>
              <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                {REVIEWS.heading}
              </h2>
              <p className="mt-8 font-mono">
                <span className="text-[clamp(3rem,9vw,5rem)] font-bold leading-none" style={{ color: ACCENT }}>
                  {REVIEWS.scoreRange}
                </span>
                <span className="text-[1.4rem] text-[#F4EEE0]/60">{REVIEWS.scoreOutOf}</span>
              </p>
              <p className="mt-3 text-[0.98rem] text-[#F4EEE0]/82">{REVIEWS.countLine}</p>
              <p className="mt-1.5 font-mono text-[12px] tracking-[0.06em] text-[#F4EEE0]/55">{REVIEWS.breakdown}</p>
            </Reveal>
            <Reveal reduce={reduce} delay={140}>
              <div className="mt-12">
                {REVIEW_QUOTES.map((q) => (
                  <QuoteRow key={q.name} q={q} />
                ))}
              </div>
              <p className="mt-4 text-[0.82rem] italic text-[#F4EEE0]/55">{REVIEWS.languageNote}</p>
            </Reveal>
          </div>
        </section>

        {/* ── 9. Nearby ── */}
        <section className="px-5 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal reduce={reduce}>
              <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]" style={{ color: INK }}>
                {NEARBY.heading}
              </h2>
            </Reveal>
            <Reveal reduce={reduce} delay={100}>
              <dl className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                {NEARBY.items.map((it) => (
                  <div key={it.name} className="py-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                    <dt className="font-display text-[1.15rem] leading-snug" style={{ color: INK }}>
                      {it.name}
                    </dt>
                    <dd className="mt-2 font-mono text-[12px] tracking-[0.08em]" style={{ color: SAGE }}>
                      {it.info}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <div className="relative mt-12">
              <ClipFigure
                reduce={reduce}
                img={IMG.aurora}
                alt={NEARBY.auroraAlt}
                aspect="aspect-[21/9]"
                sizes="(min-width: 1152px) 1152px, 100vw"
              />
              <p className="font-display pointer-events-none absolute bottom-5 left-5 z-[1] text-[1.15rem] italic text-[#F4EEE0]/95 [text-shadow:0_1px_14px_rgba(0,0,0,.65)] md:left-8">
                {NEARBY.auroraLine}
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. Practical — the unmissable parchment band ── */}
        <section id="samband" className="scroll-mt-20 px-5 py-20 md:py-28" style={{ background: INK, color: GROUND }}>
          <div className="mx-auto max-w-6xl">
            <Reveal reduce={reduce}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: SLATE }}>
                {PRACTICAL.openLine} · {PRACTICAL.host}
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.18]">{PRACTICAL.heading}</h2>
            </Reveal>
            <Reveal reduce={reduce} delay={100}>
              <a
                href={PHONE_HREF}
                className={`font-poster mt-8 block w-fit text-[clamp(2.8rem,10vw,6.5rem)] leading-none tracking-[0.02em] transition-colors duration-200 hover:text-[#A5501F] ${FOCUS_ON_LIGHT}`}
                style={{ color: GROUND }}
              >
                {PHONE}
              </a>
            </Reveal>
            <Reveal reduce={reduce} delay={180}>
              <div
                className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3"
                style={{ borderColor: 'rgba(28,35,30,.16)' }}
              >
                <p className="flex items-start gap-2.5 text-[0.98rem] leading-relaxed">
                  <Mail
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    style={{ color: '#A5501F' }}
                  />
                  <a href={MAILTO} className={`underline underline-offset-4 ${FOCUS_ON_LIGHT}`}>
                    {EMAIL}
                  </a>
                </p>
                <p className="flex items-start gap-2.5 text-[0.98rem] leading-relaxed">
                  <MapPin
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    style={{ color: '#A5501F' }}
                  />
                  {ADDRESS}
                </p>
                <p className="flex items-start gap-2.5 text-[0.98rem] leading-relaxed">
                  <Phone
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    style={{ color: '#A5501F' }}
                  />
                  {PRACTICAL.openLine}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 11. Closing ── */}
        <section className="px-5 pb-20 pt-24 md:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal reduce={reduce}>
              <h2 className="font-display text-[clamp(2rem,5.5vw,3.4rem)] italic leading-[1.22]" style={{ color: INK }}>
                {CLOSING.line}
              </h2>
              <p className="mt-4 text-[1.05rem] text-[#F4EEE0]/80">{CLOSING.sub}</p>
            </Reveal>
            <Reveal reduce={reduce} delay={120}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={PHONE_HREF}
                  className={`flex items-center gap-2.5 rounded-[3px] px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-200 active:scale-[0.98] ${FOCUS}`}
                  style={{ background: ACCENT, color: GROUND }}
                >
                  <Phone size={17} strokeWidth={2} aria-hidden="true" />
                  Hringja í {PHONE}
                </a>
                <a
                  href={MAILTO}
                  className={`rounded-[3px] border px-7 py-3.5 text-[0.95rem] font-medium text-[#F4EEE0] transition-colors duration-200 hover:bg-[#F4EEE0]/10 ${FOCUS}`}
                  style={{ borderColor: 'rgba(244,238,224,.4)' }}
                >
                  Senda fyrirspurn
                </a>
              </div>
            </Reveal>
            <p className="mx-auto mt-14 max-w-xl text-[0.8rem] leading-relaxed text-[#F4EEE0]/65">
              {CLOSING.photoDisclaimer}
            </p>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA — engages once the mist has lifted ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t p-3 backdrop-blur-md md:hidden"
        style={{
          borderColor: HAIRLINE,
          background: 'rgba(28,35,30,.9)',
          transform: ctaOn ? 'translateY(0)' : 'translateY(110%)',
          transition: reduce ? 'none' : `transform 0.45s ${EASE}`,
          pointerEvents: ctaOn ? 'auto' : 'none',
        }}
        aria-hidden={ctaOn ? undefined : true}
      >
        <a
          href={PHONE_HREF}
          tabIndex={ctaOn ? undefined : -1}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[3px] py-3 text-[0.93rem] font-semibold ${FOCUS}`}
          style={{ background: ACCENT, color: GROUND }}
        >
          <Phone size={16} strokeWidth={2} aria-hidden="true" />
          Hringja
        </a>
        <a
          href={MAILTO}
          tabIndex={ctaOn ? undefined : -1}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[3px] border py-3 text-[0.93rem] font-medium text-[#F4EEE0] ${FOCUS}`}
          style={{ borderColor: 'rgba(244,238,224,.4)' }}
        >
          <Mail size={16} strokeWidth={2} aria-hidden="true" />
          Fyrirspurn
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
