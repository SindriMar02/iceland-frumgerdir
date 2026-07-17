import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Minus, Plus, ShoppingBasket, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  BOARD,
  CART,
  CATEGORIES,
  DISCLOSURES,
  EMAIL,
  FACEBOOK,
  FEATURED_IDS,
  FINALE,
  HERO,
  IMG,
  INSTAGRAM,
  JSON_LD,
  LOCATIONS,
  MEAT,
  META,
  PHONE,
  PHONE_HREF,
  PRODUCTS,
  REVIEWS,
  SHOP,
  SMOKEHOUSE,
  SOCIAL,
  STORY,
} from './data'
import type { CatId, Product } from './data'

const company = getPreviewCompany('fiskkompani')

/* ── FISK KOMPANÍ · „Dagsins afli, loksins á netinu"
      The real fish counter, finally open online. Palette pulled from the
      counter photography: glass-case off-white ground, black-fixture ink,
      marinade terracotta accent, steel-ice case tones. ONE scroll-linked
      signature: the cold-mist / birch-smoke thread that runs the page,
      condensation at the counter, smoke over the Ólafsfjörður chapter,
      clearing mist over the finale placeholder-dissolve.               ── */
const GROUND = '#F4F3EE' // fluorescent glass-case white
const SURFACE = '#FFFFFF' // card surface
const INK = '#15181A' // real black counter fixtures
const ACCENT = '#D9552B' // marinated-salmon terracotta
const ICE = '#C9D6D6' // pale steel-ice, case reflections
const STEEL = '#7C8B8C' // mid steel-grey, labels/dividers
const SMOKE = '#9C8E82' // warm birch-smoke grey
const HAIRLINE = 'rgba(21,24,26,.14)'
const EASE = 'cubic-bezier(.22,.68,.16,1)'
const EASE_ARR: [number, number, number, number] = [0.22, 0.68, 0.16, 1]

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15181A]'
const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F3EE]'

const NAV_LINKS = [
  { id: 'budin', label: 'Búðin' },
  { id: 'olafsfjordur', label: 'Ólafsfjörður' },
  { id: 'um-okkur', label: 'Um okkur' },
  { id: 'stadsetningar', label: 'Staðsetningar' },
] as const

/* ══════════════════════════════════════════════════════════════════════ */
/*  Motion primitives — IO-based, viewport-gated, reduced-motion = plain    */
/* ══════════════════════════════════════════════════════════════════════ */

function useInViewOnce(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    // Position-gated: only force-show what is already on screen at mount.
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
      { rootMargin: '0px 0px -8% 0px', threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, shown }
}

function Reveal({
  children,
  delay = 0,
  y = 24,
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
  as?: 'div' | 'li' | 'figure'
}) {
  const reduced = useReducedMotion()
  const { ref, shown } = useInViewOnce(0.16)
  const Tag = as
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    )
  }
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${dur}s ${EASE} ${delay}ms, transform ${dur}s ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

/* ── ClipPhoto — the glass-case uncover: a horizontal clip-path wipe on
      standalone content photos. Observer sits on the untransformed wrapper
      (never on the clipping element itself), the img clips + settles.    ── */
function ClipPhoto({
  src,
  alt,
  aspect,
  delay = 0,
  eager = false,
  fallbackClassName,
  imgClassName = '',
}: {
  src: string
  alt: string
  aspect: string
  delay?: number
  eager?: boolean
  fallbackClassName?: string
  imgClassName?: string
}) {
  const reduced = useReducedMotion()
  const { ref, shown } = useInViewOnce(0.14)
  const visible = reduced || eager || shown
  return (
    <div ref={ref} className={`overflow-hidden ${aspect}`}>
      <Img
        src={src}
        alt={alt}
        {...(eager ? { loading: 'eager' as const, fetchpriority: 'high' as const } : {})}
        className={`block h-full w-full object-cover ${imgClassName}`}
        style={
          reduced
            ? undefined
            : {
                clipPath: visible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transform: visible ? 'scale(1)' : 'scale(1.06)',
                transition: `clip-path 1s ${EASE} ${delay}ms, transform 1.25s ${EASE} ${delay}ms`,
              }
        }
        fallbackClassName={fallbackClassName ?? 'bg-gradient-to-br from-[#C9D6D6] to-[#7C8B8C]'}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  THE SIGNATURE — cold-mist / smoke thread, driven by scrollYProgress.    */
/*  Values are written raw per frame via motion values (no CSS transition   */
/*  on any scrubbed property). Cold case-condensation at the counter,       */
/*  warm birch smoke over the Ólafsfjörður chapter, mist clearing at the    */
/*  finale. Reduced motion: one static, low-opacity gradient wisp.          */
/* ══════════════════════════════════════════════════════════════════════ */
function WispPath({ stroke, width, blurId }: { stroke: string; width: number; blurId: string }) {
  return (
    <svg
      viewBox="0 0 200 1000"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id={blurId} x="-80%" y="-20%" width="260%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <path
        d="M112 -20 C 60 140, 168 250, 104 400 C 40 550, 176 660, 96 810 C 48 900, 128 970, 100 1030"
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        filter={`url(#${blurId})`}
      />
    </svg>
  )
}

function SmokeThread() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // Cold condensation: present at the counter (top), fades mid-page,
  // returns as clearing mist over the finale.
  const coldOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.4, 0.66, 0.88, 1],
    [0.5, 0.34, 0.08, 0.1, 0.34, 0.55],
  )
  const coldY = useTransform(scrollYProgress, [0, 1], [-50, 60])
  // Warm birch smoke: rises only across the Ólafsfjörður chapter,
  // drifting diagonally down the supply line.
  const warmOpacity = useTransform(scrollYProgress, [0.3, 0.47, 0.6, 0.76], [0, 0.5, 0.48, 0])
  const warmY = useTransform(scrollYProgress, [0.26, 0.78], [-110, 140])
  const warmX = useTransform(scrollYProgress, [0.26, 0.78], [70, -90])
  const warmScale = useTransform(scrollYProgress, [0.3, 0.55, 0.78], [0.9, 1.15, 1])

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 right-[6vw] z-[30] w-[130px] opacity-[0.12]"
      >
        <WispPath stroke={ICE} width={26} blurId="fk-wisp-static" />
      </div>
    )
  }
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
      <motion.div
        className="absolute inset-y-[-8%] right-[5vw] w-[120px] md:right-[8vw] md:w-[150px]"
        style={{ opacity: coldOpacity, y: coldY }}
      >
        <WispPath stroke={ICE} width={22} blurId="fk-wisp-cold" />
      </motion.div>
      <motion.div
        className="absolute inset-y-[-10%] right-[10vw] w-[170px] md:right-[14vw] md:w-[230px]"
        style={{ opacity: warmOpacity, y: warmY, x: warmX, scale: warmScale }}
      >
        <WispPath stroke={SMOKE} width={34} blurId="fk-wisp-warm" />
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Shared bits                                                             */
/* ══════════════════════════════════════════════════════════════════════ */

function MonoTag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-block font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]"
      style={{ color: dark ? ICE : '#5E6B6C' }}
    >
      {children}
    </span>
  )
}

/* The honest stand-in for the Ólafsfjörður smoked goods — no verified
   product photo exists, so the card carries the smoke motif instead of a
   fabricated image. */
let smokeTileSeq = 0
function SmokeTile({ compact = false }: { compact?: boolean }) {
  const idRef = useRef('')
  if (!idRef.current) {
    smokeTileSeq += 1
    idRef.current = `fk-tile-${smokeTileSeq}`
  }
  return (
    <div
      className="relative flex h-full w-full items-end overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${INK} 0%, #2A3134 58%, #3D4649 100%)` }}
      aria-hidden
    >
      <div className="absolute inset-y-[-12%] left-1/2 w-[55%] -translate-x-1/2 opacity-[0.4]">
        <WispPath stroke={SMOKE} width={30} blurId={idRef.current} />
      </div>
      {!compact && (
        <span
          className="relative z-10 p-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: ICE }}
        >
          Reykhúsið á Ólafsfirði
        </span>
      )}
    </div>
  )
}

const priceNumber = (p: Product) => parseInt(p.price.replace(/\D/g, ''), 10) || 0
const isk = (n: number) => `${n.toLocaleString('de-DE')} kr.`

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV                                                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function TopNav({
  count,
  onCart,
  goTo,
}: {
  count: number
  onCart: () => void
  goTo: (id: string) => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const solid = scrolled || menuOpen
  const go = (id: string) => {
    setMenuOpen(false)
    goTo(id)
  }
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? 'rgba(244,243,238,.94)' : 'transparent',
        borderBottom: `1px solid ${solid ? HAIRLINE : 'transparent'}`,
        backdropFilter: solid ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: solid ? 'blur(10px)' : undefined,
        transition: 'background .35s ease, border-color .35s ease',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <button
          onClick={() => go('top')}
          className={`font-display text-[17px] font-semibold tracking-[0.02em] ${solid ? FOCUS : FOCUS_DARK}`}
          style={{ color: solid ? INK : GROUND }}
        >
          FISK KOMPANÍ
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`font-sans text-[13.5px] font-medium transition-opacity hover:opacity-70 ${solid ? FOCUS : FOCUS_DARK}`}
              style={{ color: solid ? INK : GROUND }}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCart}
            aria-label={`Opna körfuna, ${count} ${count === 1 ? 'vara' : 'vörur'}`}
            className={`relative grid h-11 w-11 place-items-center rounded-[6px] transition-transform active:scale-[0.94] ${solid ? FOCUS : FOCUS_DARK}`}
            style={{ color: solid ? INK : GROUND }}
          >
            <ShoppingBasket size={21} strokeWidth={1.8} aria-hidden />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.28, ease: EASE_ARR }}
                className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10.5px] font-bold"
                style={{ background: ACCENT, color: INK }}
              >
                {count}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
            className={`grid h-11 w-11 place-items-center md:hidden ${solid ? FOCUS : FOCUS_DARK}`}
            style={{ color: solid ? INK : GROUND }}
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
      </div>
      {menuOpen && (
        <div className="border-t px-5 pb-6 pt-1 md:hidden" style={{ borderColor: HAIRLINE, background: GROUND }}>
          {NAV_LINKS.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`block w-full border-b py-3.5 text-left font-sans text-[15px] font-medium ${FOCUS}`}
              style={{ color: INK, borderColor: HAIRLINE }}
            >
              {n.label}
            </button>
          ))}
          <a
            href={PHONE_HREF}
            className={`mt-4 inline-block font-mono text-[14px] font-bold underline decoration-2 underline-offset-2 ${FOCUS}`}
            style={{ color: INK, textDecorationColor: ACCENT }}
          >
            {PHONE}
          </a>
        </div>
      )}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  1 · HERO — the real counter, full bleed, mount-triggered entrance.      */
/*  Featured products live inside the first viewport: shop first.           */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero({ onAdd, goTo }: { onAdd: (id: string) => void; goTo: (id: string) => void }) {
  const reduced = useReducedMotion()
  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p),
  )
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
  }
  const item = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 26, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: EASE_ARR },
    },
  }
  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Full-bleed section background: mount-triggered, never whileInView */}
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.07 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_ARR }}
      >
        <Img
          src={IMG.hero}
          alt={HERO.imageAlt}
          loading="eager"
          fetchpriority="high"
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#3D4649] to-[#15181A]"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(21,24,26,.45) 0%, rgba(21,24,26,.22) 42%, rgba(21,24,26,.82) 100%)',
        }}
      />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 pt-28 md:px-8 md:pb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ color: ICE }}
        >
          {HERO.eyebrow}
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-4 max-w-[16ch] font-display font-semibold"
          style={{
            color: GROUND,
            fontSize: 'clamp(2.35rem,6.4vw,4.8rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.01em',
          }}
        >
          {HERO.headline}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-4 max-w-[44ch] font-sans text-[15px] leading-[1.6] md:text-[16.5px]"
          style={{ color: 'rgba(244,243,238,.92)' }}
        >
          {HERO.sub}
        </motion.p>
        <motion.div variants={item} className="mt-6">
          <button
            onClick={() => goTo('budin')}
            className={`inline-flex min-h-[48px] items-center rounded-[6px] px-7 font-sans text-[14.5px] font-bold transition-transform active:scale-[0.97] ${FOCUS_DARK}`}
            style={{ background: ACCENT, color: INK }}
          >
            {HERO.cta}
          </button>
        </motion.div>

        {/* Featured strip — products inside the first viewport */}
        <motion.ul
          variants={item}
          className="mt-9 flex snap-x gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:grid md:grid-cols-4 md:overflow-visible"
          aria-label="Vörur dagsins"
        >
          {featured.map((p) => (
            <li
              key={p.id}
              className="flex min-w-[230px] snap-start items-center gap-3 rounded-[6px] p-2.5 md:min-w-0"
              style={{ background: 'rgba(244,243,238,.96)', border: `1px solid ${HAIRLINE}` }}
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[4px]">
                {p.img ? (
                  <Img src={IMG[p.img]} alt="" aria-hidden className="h-full w-full object-cover" />
                ) : (
                  <SmokeTile compact />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[13px] font-semibold" style={{ color: INK }}>
                  {p.name}
                </p>
                <p className="mt-0.5 font-mono text-[12px] font-bold" style={{ color: INK }}>
                  {p.price}
                  <span style={{ color: '#5E6B6C' }}>{p.unit}</span>
                </p>
              </div>
              <button
                onClick={() => onAdd(p.id)}
                aria-label={`Bæta ${p.name} í körfu`}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-[5px] transition-transform active:scale-[0.92] ${FOCUS}`}
                style={{ background: ACCENT, color: INK }}
              >
                <Plus size={17} strokeWidth={2.4} aria-hidden />
              </button>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  2 · BÚÐIN — the ecommerce spine: filter tabs + grid + working cart      */
/* ══════════════════════════════════════════════════════════════════════ */
function ProductCard({ p, onAdd, delay }: { p: Product; onAdd: (id: string) => void; delay: number }) {
  return (
    <Reveal as="li" delay={delay} y={22} className="flex flex-col">
      <div
        className="relative overflow-hidden rounded-[6px]"
        style={{ border: `1px solid ${HAIRLINE}`, background: SURFACE }}
      >
        <div className="aspect-[4/3]">
          {p.img ? <ClipPhoto src={IMG[p.img]} alt={p.alt} aspect="h-full" /> : <SmokeTile />}
        </div>
        {p.tag && (
          <span
            className="absolute left-2.5 top-2.5 rounded-[3px] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ background: 'rgba(21,24,26,.85)', color: ICE }}
          >
            {p.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="font-sans text-[15.5px] font-bold leading-snug" style={{ color: INK }}>
          {p.name}
        </h3>
        <p className="mt-1 font-sans text-[13px] leading-[1.5]" style={{ color: '#4A5254' }}>
          {p.note}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="font-mono text-[14.5px] font-bold" style={{ color: INK }}>
            {p.price}
            <span style={{ color: '#5E6B6C' }}>{p.unit}</span>
          </p>
          <button
            onClick={() => onAdd(p.id)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[5px] px-3.5 font-sans text-[12.5px] font-bold transition-transform active:scale-[0.96] ${FOCUS}`}
            style={{ background: ACCENT, color: INK }}
          >
            <Plus size={14} strokeWidth={2.6} aria-hidden />
            {SHOP.addLabel}
          </button>
        </div>
      </div>
    </Reveal>
  )
}

function Shop({ onAdd }: { onAdd: (id: string) => void }) {
  const [cat, setCat] = useState<CatId | 'allt'>('allt')
  const shown = useMemo(
    () => (cat === 'allt' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)),
    [cat],
  )
  return (
    <section id="budin" className="py-[clamp(64px,9vw,110px)]" style={{ background: GROUND }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08 }}
          >
            {SHOP.heading}
          </h2>
        </Reveal>
        <Reveal delay={70}>
          <p className="mt-3 max-w-[54ch] font-sans text-[15px] leading-[1.62]" style={{ color: '#4A5254' }}>
            {SHOP.sub}
          </p>
        </Reveal>

        {/* Category tabs — plain underline row, like the shelf-edge tags */}
        <Reveal delay={120}>
          <div
            role="tablist"
            aria-label="Vöruflokkar"
            className="mt-8 flex gap-6 overflow-x-auto border-b [-webkit-overflow-scrolling:touch]"
            style={{ borderColor: HAIRLINE }}
          >
            {CATEGORIES.map((c) => {
              const active = cat === c.id
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.id)}
                  className={`relative whitespace-nowrap pb-3 font-sans text-[13.5px] transition-colors ${active ? 'font-bold' : 'font-medium hover:opacity-70'} ${FOCUS}`}
                  style={{ color: active ? INK : '#5E6B6C' }}
                >
                  {c.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] transition-transform duration-300"
                    style={{
                      background: ACCENT,
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                </button>
              )
            })}
          </div>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} delay={(i % 4) * 80} />
          ))}
        </ul>

        <p className="mt-9 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
          {SHOP.sampleNote}
        </p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  3 · KJÖTBORÐIÐ — brief, product-forward callout                         */
/* ══════════════════════════════════════════════════════════════════════ */
function MeatBand() {
  return (
    <section className="pb-[clamp(64px,9vw,110px)]" style={{ background: GROUND }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div
          className="grid gap-8 rounded-[8px] p-5 md:grid-cols-[1fr_1.2fr] md:items-center md:p-9"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
        >
          <div>
            <Reveal>
              <MonoTag>Meira en fiskur</MonoTag>
            </Reveal>
            <Reveal delay={60}>
              <h2
                className="mt-3 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.7rem,3.2vw,2.4rem)', lineHeight: 1.1 }}
              >
                {MEAT.heading}
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-4 max-w-[44ch] font-sans text-[15px] leading-[1.65]" style={{ color: '#4A5254' }}>
                {MEAT.body}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
                {MEAT.caption}
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Reveal as="figure" className="m-0">
              <ClipPhoto src={IMG.kjotbord} alt={MEAT.imageAlt1} aspect="aspect-[3/4]" imgClassName="rounded-[5px]" />
            </Reveal>
            <Reveal as="figure" className="m-0 mt-6" delay={120}>
              <ClipPhoto src={IMG.ofnsteik} alt={MEAT.imageAlt2} aspect="aspect-[3/4]" imgClassName="rounded-[5px]" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  4 · Í BORÐINU Í DAG — split counter board, chalk-tag register           */
/* ══════════════════════════════════════════════════════════════════════ */
function Board() {
  return (
    <section className="py-[clamp(64px,9vw,110px)]" style={{ background: INK }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          {/* Anton + Icelandic Í: open leading, normal tracking, no clip mask */}
          <h2
            className="font-poster uppercase"
            style={{
              color: GROUND,
              fontSize: 'clamp(2rem,6vw,4.2rem)',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
            }}
          >
            {BOARD.heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-10 md:grid-cols-2 md:gap-14">
          {BOARD.columns.map((col, ci) => (
            <Reveal key={col.shop} delay={ci * 120}>
              <div
                className="flex items-baseline justify-between gap-4 border-b pb-3"
                style={{ borderColor: 'rgba(244,243,238,.22)' }}
              >
                <h3 className="font-mono text-[15px] font-bold uppercase tracking-[0.12em]" style={{ color: '#E8845F' }}>
                  {col.shop}
                </h3>
                <span className="font-sans text-[12px]" style={{ color: 'rgba(244,243,238,.6)' }}>
                  {col.hint}
                </span>
              </div>
              <ul className="mt-2">
                {col.items.map((it, i) => (
                  <li
                    key={it}
                    className="flex items-center justify-between gap-4 border-b py-3.5 font-mono text-[13.5px]"
                    style={{ color: ICE, borderColor: 'rgba(244,243,238,.12)' }}
                  >
                    {it}
                    <span aria-hidden className="font-mono text-[11px]" style={{ color: 'rgba(244,243,238,.4)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-8 max-w-[64ch] font-sans text-[13px] leading-[1.6]" style={{ color: 'rgba(244,243,238,.66)' }}>
            {BOARD.note}{' '}
            <a href={PHONE_HREF} className={`font-mono font-bold ${FOCUS_DARK}`} style={{ color: GROUND }}>
              {PHONE}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  5 · FRÁ ÓLAFSFIRÐI TIL AKUREYRAR — smokehouse chapter                   */
/* ══════════════════════════════════════════════════════════════════════ */
function Smokehouse() {
  return (
    <section id="olafsfjordur" className="py-[clamp(72px,10vw,124px)]" style={{ background: '#E7EDED' }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <MonoTag>{SMOKEHOUSE.eyebrow}</MonoTag>
            </Reveal>
            <Reveal delay={60}>
              <h2
                className="mt-3 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08 }}
              >
                {SMOKEHOUSE.heading}
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-[1.68]" style={{ color: '#2E3538' }}>
                {SMOKEHOUSE.body1}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.68]" style={{ color: '#2E3538' }}>
                {SMOKEHOUSE.body2}
              </p>
            </Reveal>
            <Reveal delay={190}>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Vörur reykhússins">
                {SMOKEHOUSE.products.map((pr) => (
                  <li
                    key={pr}
                    className="rounded-[4px] border px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em]"
                    style={{ borderColor: 'rgba(21,24,26,.3)', color: INK }}
                  >
                    {pr}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={230}>
              <p className="mt-6 font-sans text-[12.5px] leading-[1.6]" style={{ color: '#48585A' }}>
                {SMOKEHOUSE.distribution}
              </p>
            </Reveal>
          </div>
          <Reveal as="figure" className="m-0" delay={140}>
            <ClipPhoto
              src={IMG.vidbordid}
              alt={SMOKEHOUSE.imageAlt}
              aspect="aspect-[3/2]"
              imgClassName="rounded-[6px]"
            />
            <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
              {SMOKEHOUSE.imageCaption}
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  6 · SAGAN — four founders, real staffed shop floor                      */
/* ══════════════════════════════════════════════════════════════════════ */
function Story() {
  return (
    <section id="um-okkur" className="py-[clamp(72px,10vw,124px)]" style={{ background: GROUND }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal as="figure" className="m-0 md:order-1">
            <ClipPhoto
              src={IMG.budarbord}
              alt={STORY.imageAlt}
              aspect="aspect-[3/4] sm:aspect-[4/5]"
              imgClassName="rounded-[6px]"
            />
          </Reveal>
          <div className="md:order-2">
            <Reveal>
              <MonoTag>{STORY.eyebrow}</MonoTag>
            </Reveal>
            <Reveal delay={60}>
              <h2
                className="mt-3 font-display font-semibold"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08 }}
              >
                {STORY.heading}
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-[1.68]" style={{ color: '#4A5254' }}>
                {STORY.body1}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.68]" style={{ color: '#4A5254' }}>
                {STORY.body2}
              </p>
            </Reveal>
            <Reveal delay={190}>
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t pt-6" style={{ borderColor: HAIRLINE }}>
                <div>
                  <p className="font-display text-[1.7rem] font-semibold leading-none" style={{ color: INK }}>
                    2013
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
                    Opnað við Kjarnagötu
                  </p>
                </div>
                <div>
                  <p className="font-display text-[1.7rem] font-semibold leading-none" style={{ color: INK }}>
                    2023
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
                    Búð tvö á Glerártorgi
                  </p>
                </div>
                <div>
                  <p className="font-display text-[1.7rem] font-semibold leading-none" style={{ color: INK }}>
                    2026
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
                    Reykhúsið á Ólafsfirði
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  7 · HVAÐ FÓLK SEGIR — aggregated sentiment, disclosed                   */
/* ══════════════════════════════════════════════════════════════════════ */
function Reviews() {
  return (
    <section className="pb-[clamp(72px,10vw,124px)]" style={{ background: GROUND }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(1.7rem,3.4vw,2.5rem)', lineHeight: 1.1 }}
          >
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {REVIEWS.items.map((q, i) => (
            <Reveal
              key={q}
              delay={i * 100}
              className="rounded-[6px] p-6"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              <span aria-hidden className="font-display text-[2rem] leading-none" style={{ color: ACCENT }}>
                „
              </span>
              <p className="mt-1 font-sans text-[15px] leading-[1.6]" style={{ color: INK }}>
                {q}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={220}>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
            {REVIEWS.disclosure}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  8 · STAÐSETNINGAR — two shops, huge phone, honest hours                 */
/* ══════════════════════════════════════════════════════════════════════ */
function Locations() {
  return (
    <section id="stadsetningar" className="py-[clamp(72px,10vw,124px)]" style={{ background: '#ECEAE2' }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display font-semibold"
            style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08 }}
          >
            {LOCATIONS.heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-2 md:gap-7">
          {LOCATIONS.shops.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 120}
              className="overflow-hidden rounded-[8px]"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              <ClipPhoto src={IMG[s.img]} alt={s.alt} aspect="aspect-[16/10]" />
              <div className="p-6 md:p-7">
                <h3 className="font-display text-[1.5rem] font-semibold" style={{ color: INK }}>
                  {s.name}
                </h3>
                <p className="mt-1 font-sans text-[14px]" style={{ color: '#4A5254' }}>
                  {s.hint}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
                  {s.since}
                </p>
                {s.hours ? (
                  <dl className="mt-5 border-t pt-4" style={{ borderColor: HAIRLINE }}>
                    {s.hours.map(([d, t]) => (
                      <div key={d} className="flex items-baseline justify-between gap-4 py-1">
                        <dt className="font-sans text-[13.5px]" style={{ color: '#4A5254' }}>
                          {d}
                        </dt>
                        <dd className="font-mono text-[13px] font-bold" style={{ color: INK }}>
                          {t}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p
                    className="mt-5 border-t pt-4 font-sans text-[13.5px] leading-[1.6]"
                    style={{ color: '#4A5254', borderColor: HAIRLINE }}
                  >
                    Inni í verslunarmiðstöðinni, við hliðina á Nettó. Hringdu til að fá opnunartímann.
                  </p>
                )}
                <a
                  href={s.map}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-4 inline-block font-sans text-[13px] font-bold underline underline-offset-4 ${FOCUS}`}
                  style={{ color: INK }}
                >
                  Sjá á korti
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: '#5E6B6C' }}>
            {LOCATIONS.hoursNote}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-12 border-t pt-9 text-center" style={{ borderColor: HAIRLINE }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: '#5E6B6C' }}>
              Ein símalína, báðar búðir
            </p>
            <a
              href={PHONE_HREF}
              className={`mt-2 inline-block font-display font-semibold ${FOCUS}`}
              style={{ color: INK, fontSize: 'clamp(2.6rem,9vw,5.4rem)', lineHeight: 1.05 }}
            >
              {PHONE}
            </a>
            <p className="mt-2 font-sans text-[14px]">
              <a
                href={`mailto:${EMAIL}`}
                className={`underline underline-offset-4 ${FOCUS}`}
                style={{ color: '#4A5254' }}
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  9 · FINALE — the placeholder dissolve. Mount-triggered once in view;    */
/*  only the mist thread behind it is scroll-linked.                        */
/* ══════════════════════════════════════════════════════════════════════ */
function Finale({ goTo }: { goTo: (id: string) => void }) {
  const reduced = useReducedMotion()
  const { ref, shown } = useInViewOnce(0.28)
  const [swapped, setSwapped] = useState(false)
  useEffect(() => {
    if (!shown) return
    if (reduced) {
      setSwapped(true)
      return
    }
    const t = window.setTimeout(() => setSwapped(true), 1500)
    return () => window.clearTimeout(t)
  }, [shown, reduced])
  return (
    <section className="py-[clamp(88px,13vw,170px)]" style={{ background: GROUND }}>
      <div ref={ref} className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <p className="font-mono text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: '#5E6B6C' }}>
          {FINALE.caption}
        </p>
        {/* Both lines share one grid cell; blur/opacity crossfade only, no
            overflow mask (Anton + Í accents, leading kept open). */}
        <h2 className="m-0 mt-6 grid" aria-live="polite">
          <span
            aria-hidden={swapped}
            className="col-start-1 row-start-1 font-poster uppercase"
            style={{
              color: STEEL,
              fontSize: 'clamp(1.9rem,6.4vw,4.4rem)',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              opacity: swapped ? 0 : 1,
              filter: reduced ? 'none' : swapped ? 'blur(10px)' : 'blur(0px)',
              transition: reduced ? 'none' : `opacity 1s ${EASE}, filter 1s ${EASE}`,
            }}
          >
            {FINALE.before}
          </span>
          <span
            aria-hidden={!swapped}
            className="col-start-1 row-start-1 font-poster uppercase"
            style={{
              color: INK,
              fontSize: 'clamp(1.9rem,6.4vw,4.4rem)',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              opacity: swapped ? 1 : 0,
              filter: reduced ? 'none' : swapped ? 'blur(0px)' : 'blur(12px)',
              transition: reduced ? 'none' : `opacity 1.1s ${EASE} .25s, filter 1.1s ${EASE} .25s`,
            }}
          >
            {FINALE.after}
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] font-sans text-[15px] leading-[1.65]" style={{ color: '#4A5254' }}>
          {FINALE.body}
        </p>
        <button
          onClick={() => goTo('budin')}
          className={`mt-8 inline-flex min-h-[48px] items-center rounded-[6px] px-8 font-sans text-[14.5px] font-bold transition-transform active:scale-[0.97] ${FOCUS}`}
          style={{ background: ACCENT, color: INK }}
        >
          {FINALE.cta}
        </button>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  10 · FOOTER — contact, social, all honesty disclosures in one place     */
/* ══════════════════════════════════════════════════════════════════════ */
function SiteFooter() {
  return (
    <footer className="pb-28 pt-[clamp(56px,7vw,88px)] md:pb-16" style={{ background: INK }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-[1.4rem] font-semibold" style={{ color: GROUND }}>
              FISK KOMPANÍ
            </p>
            <p className="mt-2 max-w-[36ch] font-sans text-[13.5px] leading-[1.6]" style={{ color: 'rgba(244,243,238,.72)' }}>
              Fiskbúð og sælkeraverzlun á Akureyri frá 2013. Kjarnagata 2 og Glerártorg.
            </p>
            <a
              href={PHONE_HREF}
              className={`mt-4 inline-block font-mono text-[17px] font-bold ${FOCUS_DARK}`}
              style={{ color: '#E8845F' }}
            >
              {PHONE}
            </a>
            <p className="mt-1 font-sans text-[13px]">
              <a
                href={`mailto:${EMAIL}`}
                className={`underline underline-offset-4 ${FOCUS_DARK}`}
                style={{ color: 'rgba(244,243,238,.72)' }}
              >
                {EMAIL}
              </a>
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: ICE }}>
              Verslanir
            </p>
            <ul className="mt-3 flex flex-col gap-2 font-sans text-[13.5px]" style={{ color: 'rgba(244,243,238,.78)' }}>
              <li>Kjarnagata 2, 600 Akureyri</li>
              <li>Glerártorg, Gleráreyrum 1, 600 Akureyri</li>
            </ul>
            <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: ICE }}>
              Fylgstu með
            </p>
            <ul className="mt-3 flex flex-col gap-2 font-sans text-[13.5px]">
              <li>
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline underline-offset-4 ${FOCUS_DARK}`}
                  style={{ color: 'rgba(244,243,238,.78)' }}
                >
                  {SOCIAL.facebook}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline underline-offset-4 ${FOCUS_DARK}`}
                  style={{ color: 'rgba(244,243,238,.78)' }}
                >
                  {SOCIAL.instagram}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: ICE }}>
              Um þessa frumgerð
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {DISCLOSURES.map((d) => (
                <li key={d} className="font-sans text-[12px] leading-[1.55]" style={{ color: 'rgba(244,243,238,.62)' }}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  CART — slide-in drawer: qty steppers, remove, subtotal, sample checkout */
/* ══════════════════════════════════════════════════════════════════════ */
function CartDrawer({
  open,
  items,
  onClose,
  onInc,
  onDec,
  onRemove,
  goTo,
}: {
  open: boolean
  items: Record<string, number>
  onClose: () => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  goTo: (id: string) => void
}) {
  const reduced = useReducedMotion()
  const lines = Object.entries(items)
    .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty }))
    .filter((l): l is { p: Product; qty: number } => Boolean(l.p))
  const subtotal = lines.reduce((sum, l) => sum + priceNumber(l.p) * l.qty, 0)
  const notePieces = CART.checkoutNote.split(PHONE)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(21,24,26,.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={CART.title}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[26rem] flex-col"
            style={{ background: GROUND }}
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.45, ease: EASE_ARR }}
          >
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: HAIRLINE }}>
              <h2 className="font-display text-[1.25rem] font-semibold" style={{ color: INK }}>
                {CART.title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Loka körfunni"
                className={`grid h-10 w-10 place-items-center rounded-[6px] ${FOCUS}`}
                style={{ color: INK }}
              >
                <X size={20} strokeWidth={1.8} aria-hidden />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBasket size={34} strokeWidth={1.4} aria-hidden style={{ color: STEEL }} />
                <p className="font-sans text-[15px]" style={{ color: '#4A5254' }}>
                  {CART.empty}
                </p>
                <button
                  onClick={() => {
                    onClose()
                    goTo('budin')
                  }}
                  className={`inline-flex min-h-[44px] items-center rounded-[6px] px-6 font-sans text-[13.5px] font-bold ${FOCUS}`}
                  style={{ background: ACCENT, color: INK }}
                >
                  {CART.emptyCta}
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-3">
                  {lines.map(({ p, qty }) => (
                    <li key={p.id} className="flex items-center gap-3.5 border-b py-4" style={{ borderColor: HAIRLINE }}>
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[4px]">
                        {p.img ? (
                          <Img src={IMG[p.img]} alt="" aria-hidden className="h-full w-full object-cover" />
                        ) : (
                          <SmokeTile compact />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-[13.5px] font-semibold" style={{ color: INK }}>
                          {p.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[12.5px] font-bold" style={{ color: INK }}>
                          {p.price}
                          <span style={{ color: '#5E6B6C' }}>{p.unit}</span>
                        </p>
                        <div className="mt-2 inline-flex items-center rounded-[5px] border" style={{ borderColor: HAIRLINE }}>
                          <button
                            onClick={() => (qty > 1 ? onDec(p.id) : onRemove(p.id))}
                            aria-label={`Fækka ${p.name}`}
                            className={`grid h-11 w-11 place-items-center ${FOCUS}`}
                            style={{ color: INK }}
                          >
                            <Minus size={13} strokeWidth={2.4} aria-hidden />
                          </button>
                          <span className="min-w-[2ch] text-center font-mono text-[13px] font-bold" style={{ color: INK }}>
                            {qty}
                          </span>
                          <button
                            onClick={() => onInc(p.id)}
                            aria-label={`Fjölga ${p.name}`}
                            className={`grid h-11 w-11 place-items-center ${FOCUS}`}
                            style={{ color: INK }}
                          >
                            <Plus size={13} strokeWidth={2.4} aria-hidden />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(p.id)}
                        aria-label={`Fjarlægja ${p.name} úr körfu`}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[5px] ${FOCUS}`}
                        style={{ color: STEEL }}
                      >
                        <X size={16} strokeWidth={2} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t px-5 py-5" style={{ borderColor: HAIRLINE, background: SURFACE }}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-[14px] font-semibold" style={{ color: INK }}>
                      {CART.subtotal}
                    </span>
                    <span className="font-mono text-[17px] font-bold" style={{ color: INK }}>
                      {isk(subtotal)}
                    </span>
                  </div>
                  <button
                    disabled
                    aria-disabled="true"
                    className="mt-4 w-full cursor-not-allowed rounded-[6px] py-3.5 font-sans text-[14px] font-bold opacity-60"
                    style={{ background: INK, color: GROUND }}
                  >
                    {CART.checkout}
                  </button>
                  <p className="mt-3 font-sans text-[12px] leading-[1.55]" style={{ color: '#4A5254' }}>
                    {notePieces[0]}
                    <a href={PHONE_HREF} className={`font-mono font-bold ${FOCUS}`} style={{ color: INK }}>
                      {PHONE}
                    </a>
                    {notePieces[1]}
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Mobile sticky CTA — shop + cart always one thumb away                   */
/* ══════════════════════════════════════════════════════════════════════ */
function MobileBar({ count, onCart, goTo }: { count: number; onCart: () => void; goTo: (id: string) => void }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t px-4 pt-2.5 md:hidden"
      style={{
        background: 'rgba(21,24,26,.96)',
        borderColor: 'rgba(244,243,238,.14)',
        paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={() => goTo('budin')}
        className={`flex-1 rounded-[6px] py-3 font-sans text-[14px] font-bold ${FOCUS_DARK}`}
        style={{ background: ACCENT, color: INK }}
      >
        Skoða vörur
      </button>
      <button
        onClick={onCart}
        aria-label={`Opna körfuna, ${count} ${count === 1 ? 'vara' : 'vörur'}`}
        className={`relative grid h-[46px] w-[52px] place-items-center rounded-[6px] border ${FOCUS_DARK}`}
        style={{ borderColor: 'rgba(244,243,238,.3)', color: GROUND }}
      >
        <ShoppingBasket size={20} strokeWidth={1.8} aria-hidden />
        {count > 0 && (
          <span
            className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10.5px] font-bold"
            style={{ background: ACCENT, color: INK }}
          >
            {count}
          </span>
        )}
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.title = META.title
    setThemeColor(META.themeColor)
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(JSON_LD)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (reduced) return
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
  }, [reduced])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -56 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const addToCart = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const dec = (id: string) =>
    setCart((c) => {
      const q = (c[id] ?? 0) - 1
      if (q <= 0) {
        const rest = { ...c }
        delete rest[id]
        return rest
      }
      return { ...c, [id]: q }
    })
  const remove = (id: string) =>
    setCart((c) => {
      const rest = { ...c }
      delete rest[id]
      return rest
    })
  const count = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <div
      lang="is"
      className="min-h-[100svh] overflow-x-clip font-sans antialiased"
      style={{ background: GROUND, color: INK }}
    >
      <SmokeThread />
      <TopNav count={count} onCart={() => setDrawerOpen(true)} goTo={goTo} />
      <main>
        <Hero onAdd={addToCart} goTo={goTo} />
        <Shop onAdd={addToCart} />
        <MeatBand />
        <Board />
        <Smokehouse />
        <Story />
        <Reviews />
        <Locations />
        <Finale goTo={goTo} />
      </main>
      <SiteFooter />
      <MobileBar count={count} onCart={() => setDrawerOpen(true)} goTo={goTo} />
      <CartDrawer
        open={drawerOpen}
        items={cart}
        onClose={() => setDrawerOpen(false)}
        onInc={addToCart}
        onDec={dec}
        onRemove={remove}
        goTo={goTo}
      />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
