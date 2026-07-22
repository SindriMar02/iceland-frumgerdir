import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { Phone, MapPin, Clock, ArrowRight, Mail, ExternalLink, Star } from 'lucide-react'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, FACEBOOK, THORFISH, TRIPADVISOR,
  LOCATIONS, MENU_HERO, MENU_LIST, PRICE_ESTIMATE, PRICE_SOURCE, REVIEWS, SOURCING_QUOTE,
} from './data'

const company = getPreviewCompany('issi')

/* ISSI – Fish & Chips — "Beint af bátnum" redesign prototype.
   Real client photography (issi.is media library, converted to WebP) carries every
   section. The single scroll-linked signature is the top-of-viewport "sizzle" fryer
   rail; everything else is mount-entrance + one-shot clip-path reveals. Honest copy:
   award = finalist only, no invented prices, grandfather story attributed, phone
   843 9333, no clean founding year. Facts/quotes all from the brief + dossier. */

/* ---- Palette (all pulled from the real photography, per brief) ---- */
const CREAM = '#F7F2E7'
const INK = '#1C1712'
const GOLD = '#E0B004'
const TEAL = '#0F3B36'
const SLATE = '#3C4A55'

/* ---- Type (all four app fonts, no fifth needed) ---- */
const POSTER = 'var(--font-poster)' // Anton — hero impact only
const DISPLAY = 'var(--font-display)' // Fraunces — headlines / pull-quotes
const SANS = 'var(--font-sans)' // Inter — body / nav / buttons
const MONO = 'var(--font-mono)' // Space Mono — factual labels

const EASE = 'cubic-bezier(0.16,1,0.3,1)'

/* Shared Lenis handle so CTAs can smooth-scroll to the menu. */
let lenisRef: Lenis | null = null
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef) lenisRef.scrollTo(el, { offset: -12 })
  else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
}

/* ============================================================= Sizzle rail */
/* The one scroll-linked signature: a 3px fryer-oil progress rail pinned to the
   top edge. Only its WIDTH tracks scroll (no CSS transition on a scrubbed value).
   The bubble shimmer animates independently via CSS background-position. In the
   final 5% of scroll the gold fades to dusk-teal (day fryer -> night shop-glow),
   written per-frame via useMotionValueEvent, never a CSS transition on the scroll
   value. Omitted entirely under reduced motion. */
function ch(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}
function goldToTeal(t: number) {
  return `rgb(${ch(224, 15, t)},${ch(176, 59, t)},${ch(4, 54, t)})`
}
function SizzleRail() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const fillRef = useRef<HTMLDivElement>(null)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const el = fillRef.current
    if (!el) return
    const t = v <= 0.95 ? 0 : (v - 0.95) / 0.05
    el.style.backgroundColor = t <= 0 ? GOLD : goldToTeal(t)
  })
  if (reduce) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]" style={{ background: 'rgba(28,23,18,0.10)' }}>
      <motion.div ref={fillRef} className="issi-sizzle h-full" style={{ width, backgroundColor: GOLD }} />
    </div>
  )
}

/* ============================================================= Reveals */
/* Clip-path reveal for standalone content images. The IntersectionObserver target
   (outer) is NEVER transformed; only the inner element clips/scales (craft ledger
   #7/#12). One-shot, so a CSS transition here is legal (not scroll-scrubbed). */
function Reveal({ children, className = '', delay = 0, from = 'bottom' }: {
  children: ReactNode; className?: string; delay?: number; from?: 'bottom' | 'left'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  const hidden = from === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)'
  return (
    <div ref={ref} className={className}>
      <div
        style={{
          height: '100%',
          clipPath: shown ? 'inset(0 0 0 0)' : hidden,
          transform: shown ? 'scale(1)' : 'scale(1.05)',
          transition: reduce ? 'none' : `clip-path 860ms ${EASE} ${delay}ms, transform 1000ms ${EASE} ${delay}ms`,
          willChange: 'clip-path, transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* Text/element fade-up on scroll. Outer = untransformed IO target. */
function FadeUp({ children, className = '', delay = 0 }: {
  children: ReactNode; className?: string; delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  return (
    <div ref={ref} className={className}>
      <div
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(22px)',
          transition: reduce ? 'none' : `opacity 680ms ${EASE} ${delay}ms, transform 780ms ${EASE} ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* Small mono label chip. */
function Tag({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'cream' | 'gold' }) {
  const styles =
    tone === 'cream'
      ? { color: 'rgba(247,242,231,0.75)', border: '1px solid rgba(247,242,231,0.25)' }
      : tone === 'gold'
        ? { color: INK, background: GOLD }
        : { color: 'rgba(28,23,18,0.60)', border: '1px solid rgba(28,23,18,0.18)' }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
      style={{ fontFamily: MONO, ...styles }}
    >
      {children}
    </span>
  )
}

/* ============================================================= Buttons */
function GoldButton({ onClick, href, children }: { onClick?: () => void; href?: string; children: ReactNode }) {
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1712] focus-visible:ring-offset-2'
  const style = { fontFamily: SANS, background: GOLD, color: INK }
  if (href) return <a href={href} className={cls} style={style}>{children}</a>
  return <button onClick={onClick} className={cls} style={style}>{children}</button>
}
function GhostButton({ href, children, tone = 'ink' }: { href: string; children: ReactNode; tone?: 'ink' | 'cream' }) {
  const border = tone === 'cream' ? 'rgba(247,242,231,0.55)' : 'rgba(28,23,18,0.35)'
  const color = tone === 'cream' ? CREAM : INK
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2"
      style={{ fontFamily: SANS, border: `1.5px solid ${border}`, color }}
    >
      {children}
    </a>
  )
}

/* ============================================================= Page */
export default function Page() {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.title = 'ISSI – Fish & Chips · Beint af bátnum'
    setThemeColor(CREAM)
  }, [])

  // Lenis smooth scroll (skipped entirely under reduced motion).
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    lenisRef = lenis
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef = null
    }
  }, [reduce])

  // Mount-triggered hero stagger (not scroll-linked). Accents keep headroom.
  const heroWords = ['BEINT', 'AF', 'BÁTNUM']

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: SANS }} className="min-h-screen overflow-x-hidden">
      {/* Sizzle-rail keyframes + bubble texture. */}
      <style>{`
        .issi-sizzle {
          background-image:
            radial-gradient(circle at 18% 45%, rgba(255,255,255,0.6) 0 1px, transparent 1.6px),
            radial-gradient(circle at 62% 60%, rgba(255,255,255,0.42) 0 1px, transparent 1.6px);
          background-size: 20px 3px, 33px 3px;
          animation: issi-bubble 6s linear infinite;
        }
        @keyframes issi-bubble {
          from { background-position: 0 0, 0 0; }
          to   { background-position: 20px 0, -33px 0; }
        }
        @media (prefers-reduced-motion: reduce) { .issi-sizzle { animation: none; } }
      `}</style>

      <SizzleRail />

      {/* ---- Seamless header over the hero ---- */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-6 md:px-10 md:pt-8">
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top') }} className="select-none text-2xl leading-none tracking-tight text-white" style={{ fontFamily: POSTER, textShadow: '0 2px 18px rgba(0,0,0,0.5)' }}>
          ISSI
        </a>
        <a href={PHONE_HREF} className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors hover:bg-white/10 md:inline-flex" style={{ fontFamily: SANS, background: 'rgba(20,15,10,0.28)' }}>
          <Phone className="h-4 w-4" aria-hidden /> {PHONE_DISPLAY}
        </a>
      </header>

      {/* ==================================================== 1 · HERO */}
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Img
            src={IMG('05_steiking_1720x920.webp')}
            srcSet={`${IMG('05_steiking_1720x920-900.webp')} 900w, ${IMG('05_steiking_1720x920.webp')} 1720w`}
            sizes="100vw"
            fetchpriority="high"
            loading="eager"
            alt="Fiskur í deigi steiktur gullinn og freyðandi í heitri olíu á pönnu hjá ISSI."
            className="h-full w-full object-cover"
          />
        </motion.div>
        {/* Legibility scrim (bottom third). */}
        <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(to top, rgba(20,15,10,0.92) 0%, rgba(20,15,10,0.55) 32%, rgba(20,15,10,0.12) 55%, rgba(20,15,10,0.28) 100%)' }} />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 md:px-10 md:pb-20">
          <motion.div initial={reduce ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}>
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}>
              <span className="text-[12px] tracking-[0.22em] uppercase text-white/80" style={{ fontFamily: MONO }}>Fitjar 3 · Reykjanesbær</span>
            </motion.div>

            <h1 className="mt-4 flex flex-wrap gap-x-4 text-white" style={{ fontFamily: POSTER, lineHeight: 1.18 }}>
              {heroWords.map((w) => (
                <motion.span
                  key={w}
                  className="block text-[clamp(3.2rem,13vw,9.5rem)]"
                  style={{ textShadow: '0 4px 30px rgba(0,0,0,0.45)' }}
                  variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } } }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-5 max-w-xl text-lg text-white/90 md:text-xl"
              style={{ fontFamily: DISPLAY }}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            >
              Fiskur og franskar, steikt eftir pöntun. Sérvalinn og sjófrystur fiskur beint frá Þorbirni í Grindavík.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <GoldButton onClick={() => scrollToId('matsedill')}>Sjá matseðil <ArrowRight className="h-4 w-4" aria-hidden /></GoldButton>
              <GhostButton href={PHONE_HREF} tone="cream"><Phone className="h-4 w-4" aria-hidden /> Hringja</GhostButton>
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-white/85 ring-1 ring-white/30" style={{ fontFamily: MONO }}>
                <Clock className="h-4 w-4" aria-hidden /> Opið alla daga 11–20
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================== 2 · TRUST STRIP */}
      <section aria-label="Traust og viðurkenningar" style={{ background: INK, color: CREAM }}>
        <h2 className="sr-only">Traust og viðurkenningar</h2>
        <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-4 px-5 py-6 text-center md:grid-cols-3 md:px-10 md:text-left">
          {[
            { icon: true, t: '4,9/5 á Google · tæplega 1.200 umsagnir' },
            { icon: false, t: 'Tilnefnd til alþjóðlegra verðlauna · National Fish & Chip Awards 2026' },
            { icon: false, t: 'Allur fiskur frá Þorbirni í Grindavík' },
          ].map((item, i) => (
            <div key={item.t} className={`flex items-center justify-center gap-3 md:justify-start ${i < 2 ? 'md:border-r md:border-white/15' : ''}`}>
              {item.icon && <Star className="h-4 w-4 shrink-0" style={{ color: GOLD }} aria-hidden />}
              <p className="text-[13px] leading-snug tracking-wide" style={{ fontFamily: MONO, color: 'rgba(247,242,231,0.85)' }}>{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== 3 · MENU */}
      <section id="matsedill" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <FadeUp>
          <Tag tone="gold">Matseðill</Tag>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.08]" style={{ fontFamily: DISPLAY }}>
            Fiskur, gellur og allt sem á að fylgja
          </h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: 'rgba(28,23,18,0.7)' }}>
            Steikt þegar þú pantar, aldrei upphitað. Skammtarnir koma í kassa á dagblaðapappír, alveg eins og þeir eiga að gera.
          </p>
        </FadeUp>

        {/* Photographed hero items. */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MENU_HERO.map((it, i) => (
            <FadeUp key={it.name} delay={i * 80}>
              <article className="group flex h-full flex-col rounded-3xl p-6 transition-shadow duration-300 hover:shadow-xl" style={{ background: '#FBF8F0', border: '1px solid rgba(28,23,18,0.08)' }}>
                <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px]">
                  <Img src={it.img} alt={it.alt} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <h3 className="mt-4 text-2xl" style={{ fontFamily: DISPLAY }}>{it.name}</h3>
                <p className="mt-1 text-sm" style={{ color: 'rgba(28,23,18,0.68)' }}>{it.note}</p>
                {it.sizes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {it.sizes.map((s) => (
                      <span key={s} className="rounded-full px-2.5 py-1 text-[11px] tracking-wide uppercase" style={{ fontFamily: MONO, background: 'rgba(224,176,4,0.15)', color: INK }}>{s}</span>
                    ))}
                  </div>
                )}
              </article>
            </FadeUp>
          ))}
        </div>

        {/* Remaining real items (no standalone photo) — typographic list. */}
        <FadeUp delay={60}>
          <ul className="mt-10 grid gap-x-10 gap-y-1 md:grid-cols-2">
            {MENU_LIST.map((it) => (
              <li key={it.name} className="flex items-baseline justify-between gap-4 border-b py-4" style={{ borderColor: 'rgba(28,23,18,0.10)' }}>
                <div>
                  <span className="text-xl" style={{ fontFamily: DISPLAY }}>{it.name}</span>
                  <span className="ml-3 text-sm" style={{ color: 'rgba(28,23,18,0.72)' }}>{it.note}</span>
                </div>
                {it.sizes && <span className="shrink-0 text-[12px]" style={{ fontFamily: MONO, color: 'rgba(28,23,18,0.72)' }}>{it.sizes}</span>}
              </li>
            ))}
          </ul>
        </FadeUp>

        {/* Honest price signal — an estimate, footnoted, secondary to the food. */}
        <FadeUp delay={80}>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[13px]" style={{ fontFamily: MONO, color: INK }}>{PRICE_ESTIMATE}</span>
            <span className="text-[11px]" style={{ fontFamily: MONO, color: 'rgba(28,23,18,0.72)' }}>({PRICE_SOURCE})</span>
          </div>
        </FadeUp>
      </section>

      {/* ==================================================== 4 · SOURCING (full-bleed) */}
      <section aria-label="Fiskurinn okkar" className="relative overflow-hidden" style={{ background: SLATE }}>
        {/* Full-bleed absolute background: rendered plainly, never self-clipped
            or observer-revealed (craft-ledger #12). */}
        <div className="absolute inset-0">
          <Img
            src={IMG('04_thorbjorn_7341.webp')}
            srcSet={`${IMG('04_thorbjorn_7341-900.webp')} 900w, ${IMG('04_thorbjorn_7341.webp')} 1720w`}
            sizes="100vw"
            alt="Togarinn Ágúst GK-95 plægir í gegnum þunga norðuratlantshafsöldu."
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(to right, rgba(15,20,26,0.86) 0%, rgba(15,20,26,0.55) 55%, rgba(15,20,26,0.30) 100%)' }} />
        <div className="absolute inset-0 md:hidden" aria-hidden style={{ background: 'rgba(15,20,26,0.45)' }} />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-36">
          <FadeUp className="max-w-2xl">
            <h2 className="sr-only">Fiskurinn okkar</h2>
            <Tag tone="cream">Fiskurinn okkar</Tag>
            <blockquote className="mt-6 text-[clamp(1.7rem,4.2vw,3rem)] leading-[1.16] text-white" style={{ fontFamily: DISPLAY }}>
              „{SOURCING_QUOTE}“
            </blockquote>
            <p className="mt-6 max-w-lg text-[13px] leading-relaxed" style={{ fontFamily: MONO, color: 'rgba(247,242,231,0.7)' }}>
              Þorbjörn hf. heldur utan um rekjanleika aflans. Hægt er að fletta upp hvaðan fiskurinn kemur á{' '}
              <a href={THORFISH} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">thorfish.is</a>.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 5 · FRIED TO ORDER (asymmetric split) */}
      <section aria-label="Steikt eftir pöntun" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
          <Reveal from="left" className="overflow-hidden rounded-3xl">
            <Img
              src={IMG('01_issi_1574_1720x920.webp')}
              alt="Tveir stökkir fiskbitar í deigi með frönskum og sósu í ISSI kassa á dagblaðapappír."
              className="aspect-[16/10] w-full object-cover"
            />
          </Reveal>
          <FadeUp>
            <Tag tone="gold">Steikt eftir pöntun</Tag>
            <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1]" style={{ fontFamily: DISPLAY }}>
              Ekkert liggur tilbúið undir lampa
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'rgba(28,23,18,0.72)' }}>
              Fiskurinn fer í deigið og á pönnuna þegar þú pantar. Þess vegna kemur hann stökkur og heitur í kassann, aldrei upphitaður úr frysti. Gestir taka eftir muninum.
            </p>
            <p className="mt-6 border-l-2 pl-4 text-[13px] leading-relaxed" style={{ borderColor: GOLD, fontFamily: MONO, color: 'rgba(28,23,18,0.68)' }}>
              „The fish is done in front of your eyes.“<br />
              <span style={{ color: 'rgba(28,23,18,0.72)' }}>umsögn á TripAdvisor</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 6 · STORY */}
      <section aria-label="Issi og Hjördís" style={{ background: INK, color: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
          <Reveal className="overflow-hidden rounded-3xl">
            <Img
              src={IMG('03_issi_hjordis_1720x480.webp')}
              alt="Issi með skegg og derhúfu vinnur í eldhúsinu ásamt Hjördísi við hlið sér."
              className="aspect-[16/6] w-full object-cover"
            />
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <FadeUp>
              <Tag tone="cream">Issi &amp; Hjördís</Tag>
              <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1]" style={{ fontFamily: DISPLAY }}>
                Fjölskyldurekið, frá fyrsta degi
              </h2>
            </FadeUp>
            <FadeUp delay={80}>
              <p className="text-lg" style={{ color: 'rgba(247,242,231,0.82)' }}>
                Issi og Hjördís gengu saman í skóla í Grindavík, kynntust aftur á fullorðinsárum og hófu reksturinn saman. Þau byrjuðu með matarbíla árið 2007 og formfestu staðinn sem Tralla ehf árið 2016.
              </p>
              <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'rgba(247,242,231,0.62)' }}>
                Issi segir að afi hans hafi rekið einn af fyrstu stöðunum á Íslandi sem seldu fisk og franskar, á Akureyri í kringum 1942, og selt breskum hermönnum. Sagan segir að staðurinn hafi síðar brunnið eftir að gleymdist að slökkva á pönnunni. Þetta er sagan sem fylgir nafninu, sögð eins og hún gengur í fjölskyldunni.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ==================================================== 7 · REVIEWS */}
      <section aria-label="Umsagnir" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <FadeUp>
          <Tag tone="gold">Umsagnir</Tag>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.08]" style={{ fontFamily: DISPLAY }}>
            Fólk keyrir út á Reykjanes fyrir þetta
          </h2>
        </FadeUp>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <FadeUp key={r.author} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-3xl p-6" style={{ background: '#FBF8F0', border: '1px solid rgba(28,23,18,0.08)' }}>
                <blockquote className="flex-1 text-[17px] leading-relaxed" style={{ fontFamily: DISPLAY }}>„{r.quote}“</blockquote>
                <figcaption className="mt-5 border-t pt-4 text-[12px]" style={{ borderColor: 'rgba(28,23,18,0.10)', fontFamily: MONO, color: 'rgba(28,23,18,0.68)' }}>
                  <span className="block font-bold" style={{ color: INK }}>{r.author}</span>
                  {r.source}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={60}>
          <a href={TRIPADVISOR} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4" style={{ fontFamily: SANS, color: INK }}>
            Lesa fleiri umsagnir á TripAdvisor <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </FadeUp>
      </section>

      {/* ==================================================== 8 · CATERING (full-bleed) */}
      <section aria-label="Á ferðinni" className="relative overflow-hidden" style={{ background: INK }}>
        {/* Full-bleed absolute background: plain render (craft-ledger #12). */}
        <div className="absolute inset-0">
          <Img
            src={IMG('08_DJI_0005-2_1720x920.webp')}
            srcSet={`${IMG('08_DJI_0005-2_1720x920-900.webp')} 900w, ${IMG('08_DJI_0005-2_1720x920.webp')} 1720w`}
            sizes="100vw"
            alt="Loftmynd af ISSI vagninum dregnum eftir vegi í gegnum íslenskt hraun."
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(to top, rgba(20,15,10,0.9) 0%, rgba(20,15,10,0.45) 50%, rgba(20,15,10,0.25) 100%)' }} />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:px-10 md:py-36">
          <FadeUp className="mx-auto max-w-2xl">
            <Tag tone="cream">Á ferðinni</Tag>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.6rem)] leading-[1.1] text-white" style={{ fontFamily: DISPLAY }}>
              ISSI kemur með veisluna til þín
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
              Fiskur og franskar beint úr vagninum, hvar sem hentar. Sendu okkur línu ef þú ert að skipuleggja viðburð eða veislu.
            </p>
            <div className="mt-8 flex justify-center">
              <GoldButton href={EMAIL_HREF}><Mail className="h-4 w-4" aria-hidden /> Senda fyrirspurn</GoldButton>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 9 · LOCATIONS */}
      <section id="stadsetningar" aria-label="Finndu okkur" style={{ background: TEAL, color: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
          <FadeUp>
            <Tag tone="cream">Finndu okkur</Tag>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.08]" style={{ fontFamily: DISPLAY }}>
              Tveir staðir, sami fiskur
            </h2>
          </FadeUp>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {LOCATIONS.map((loc, i) => (
              <FadeUp key={loc.name} delay={i * 90}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl" style={{ background: 'rgba(247,242,231,0.06)', border: '1px solid rgba(247,242,231,0.14)' }}>
                  <Reveal className="overflow-hidden">
                    <Img
                      src={loc.img}
                      srcSet={loc.imgMobile !== loc.img ? `${loc.imgMobile} 900w, ${loc.img} 1720w` : undefined}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt={loc.alt}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </Reveal>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl text-white" style={{ fontFamily: DISPLAY }}>{loc.name}</h3>
                    <p className="mt-2 flex items-start gap-2 text-[15px]" style={{ color: 'rgba(247,242,231,0.85)' }}>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} aria-hidden />
                      <span>{loc.address}, {loc.place}</span>
                    </p>
                    <div className="mt-3 space-y-1">
                      {loc.hours.map((h) => (
                        <p key={h.label} className="flex items-center gap-2 text-[13px]" style={{ fontFamily: MONO, color: 'rgba(247,242,231,0.75)' }}>
                          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden /> {h.label} {h.value}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(247,242,231,0.14)' }}>
                      <iframe
                        title={`Kort: ISSI ${loc.name}`}
                        src={loc.map}
                        loading="eager"
                        className="h-44 w-full"
                        style={{ border: 0, filter: 'grayscale(0.2)' }}
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>

          {/* Big tap-to-call. */}
          <FadeUp delay={80}>
            <div className="mt-12 flex flex-col items-center gap-3 text-center">
              <span className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: 'rgba(247,242,231,0.6)' }}>Hringdu og pantaðu</span>
              <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-[clamp(2.4rem,8vw,4.5rem)] leading-none text-white transition-opacity hover:opacity-80" style={{ fontFamily: POSTER }}>
                <Phone className="h-8 w-8 md:h-10 md:w-10" style={{ color: GOLD }} aria-hidden /> {PHONE_DISPLAY}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 10 · FINAL CTA */}
      <section aria-label="Komdu við" style={{ background: INK, color: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-10 md:py-28">
          <FadeUp>
            <h2 className="text-[clamp(2.4rem,7vw,5rem)] leading-[1.18]" style={{ fontFamily: POSTER }}>BEINT AF BÁTNUM</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg" style={{ color: 'rgba(247,242,231,0.75)' }}>
              Fitjar 3 í Reykjanesbæ og við BYKO á Selfossi. Komdu við, hringdu eða sendu okkur línu.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GoldButton href={PHONE_HREF}><Phone className="h-4 w-4" aria-hidden /> {PHONE_DISPLAY}</GoldButton>
              <GhostButton href={EMAIL_HREF} tone="cream"><Mail className="h-4 w-4" aria-hidden /> {EMAIL}</GhostButton>
              <GhostButton href={FACEBOOK} tone="cream">Facebook</GhostButton>
            </div>
            <div className="mx-auto mt-10 grid max-w-lg gap-y-2 text-[13px] md:grid-cols-2" style={{ fontFamily: MONO, color: 'rgba(247,242,231,0.7)' }}>
              <p>Fitjar: alla daga 11:00–20:00</p>
              <p>Selfoss: virka daga 11:30–19:30, lau 11:30–19:00</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ---- Sticky mobile CTA bar (clears the PreviewChrome corner chips) ---- */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t p-3 md:hidden" style={{ background: 'rgba(28,23,18,0.96)', borderColor: 'rgba(247,242,231,0.14)', backdropFilter: 'blur(8px)' }}>
        <a href={PHONE_HREF} className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold" style={{ fontFamily: SANS, background: GOLD, color: INK }}>
          <Phone className="h-4 w-4" aria-hidden /> Hringja
        </a>
        <button onClick={() => scrollToId('matsedill')} className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white ring-1 ring-white/40" style={{ fontFamily: SANS }}>
          Matseðill
        </button>
      </div>

      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
