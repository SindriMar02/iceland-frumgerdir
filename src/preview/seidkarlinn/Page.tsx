import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Facebook, Instagram, Mail, MapPin, Phone, ShoppingBag, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import {
  ADDRESS,
  CHAPTERS,
  EMAIL,
  FACEBOOK,
  FACTS,
  FREEZE_DRIED,
  GALDUR_TEAS,
  HERO,
  HONEY,
  IMG,
  INSTAGRAM,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  QUIZ,
  SHIPPING_THRESHOLD,
  STORE,
  STORY,
  TINCTURES,
  isk,
  u,
} from './data'

const company = getPreviewCompany('seidkarlinn')

/* ── Galdrabókin — a warm Nordic apothecary. Parchment cream, near-black ink,
      one rust-terracotta accent, one honey-amber accent. Everything organizes
      around the client's own vocabulary: their tea line is already named
      "galdur" (spell) — the whole IA reads as chapters of a herb book. ──── */
const PAPER = '#F3ECDD'
const PAPER_SOFT = '#EDE3CE'
const INK = '#241C13'
const MUT = '#5B4E3C'
const HAIR = 'rgba(36,28,19,0.14)'
const HAIR_HI = 'rgba(36,28,19,0.24)'
const RUST = '#9C4A1F'
const HONEY_GOLD = '#C98A2A'
const MOSS = '#3F4A32'
const BG_DARK = '#181310'
const MUT_ON_DARK = 'rgba(243,236,221,0.75)'

const DISPLAY = "'Gloock', Georgia, serif"
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, 'SFMono-Regular', monospace"

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

function srcset(url: string) {
  return `${u(url, 828)} 828w, ${u(url, 1280)} 1280w, ${u(url, 2000)} 2000w`
}

function cartLabel(count: number) {
  return `Karfa, ${count} ${count === 1 ? 'vara' : 'vörur'}`
}

type IconProps = { className?: string; style?: CSSProperties }
type IconT = (p: IconProps) => JSX.Element

function IconLeaf({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M20 4c-8 0-14 5-14 13 0 1.5.3 2.5.3 2.5S7 19 8 12C9.5 6 14 4 20 4Z" />
      <path d="M6.5 19.5 18 6" />
    </svg>
  )
}
function IconMoon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  )
}
function IconStar({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}
function IconFlame({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 1.5 2.3 1.5 3.5A4.5 4.5 0 0 1 12 21a5 5 0 0 1-5-5c0-4 2-5 2-8 1 1 1.5 2 1.5 3 .5-2 .5-5 1.5-8Z" />
    </svg>
  )
}
function IconDroplet({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 3s6 7 6 11.5A6 6 0 0 1 6 14.5C6 10 12 3 12 3Z" />
    </svg>
  )
}
function IconSnow({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 2v20M4 7l16 10M20 7 4 17M2 12h20" />
    </svg>
  )
}
function IconMushroom({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M4 11c0-4 3.5-7 8-7s8 3 8 7c-2-1-5-1.5-8-1.5S6 10 4 11Z" />
      <path d="M10 11v6a2 2 0 0 0 4 0v-6" />
    </svg>
  )
}
function IconCapsule({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" />
      <path d="M9 10.8 15 13.2" />
    </svg>
  )
}

const QUIZ_ICON: Record<string, IconT> = { svefn: IconMoon, draumar: IconStar, hjarta: IconFlame, konur: IconLeaf, jafnvaegi: IconDroplet }
const CHAPTER_ICON: Record<string, IconT> = { te: IconLeaf, hunang: IconDroplet, sveppir: IconMushroom, frost: IconSnow, hud: IconLeaf, faeda: IconCapsule }
const TEA_ICON: Record<string, IconT> = Object.fromEntries(QUIZ.map((q) => [q.match, QUIZ_ICON[q.key]]))

interface CartItem {
  key: string
  name: string
  price: number
  qty: number
}

function ProductCard({
  name,
  format,
  price,
  icon: Icon,
  onAdd,
  added,
}: {
  name: string
  format: string
  price: number
  icon: IconT
  onAdd: () => void
  added: boolean
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border p-5 transition-shadow hover:shadow-[0_18px_36px_-24px_rgba(36,28,19,0.35)]" style={{ borderColor: HAIR, background: '#FBF6EB' }}>
      <div>
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: 'rgba(156,74,31,0.1)', color: RUST }}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="mt-3 text-xl leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
          {name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: MUT }}>
          {format}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: HAIR }}>
        <span className="text-sm font-semibold" style={{ fontFamily: MONO, color: INK }}>
          {isk(price)}
        </span>
        <button
          onClick={onAdd}
          aria-label={`Bæta ${name} í körfu`}
          className="rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
          style={{ background: added ? MOSS : INK, color: PAPER, fontFamily: BODY, outlineColor: INK }}
        >
          {added ? 'Bætt við' : 'Bæta í körfu'}
        </button>
      </div>
    </div>
  )
}

function RecipeCard({
  id,
  roman,
  name,
  format,
  price,
  note,
  icon: Icon,
  onAdd,
  added,
}: {
  id: string
  roman: string
  name: string
  format: string
  price: number
  note: string
  icon: IconT
  onAdd: () => void
  added: boolean
}) {
  return (
    <div id={id} className="scroll-mt-28 rounded-2xl border p-6" style={{ borderColor: HAIR, background: '#fff' }}>
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'rgba(156,74,31,0.1)', color: RUST }}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold tracking-[0.08em]" style={{ fontFamily: MONO, color: MUT }}>
          KAFLI {roman}
        </span>
      </div>
      <h3 className="mt-4 text-2xl leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
        {name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
        {note}
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="shrink-0 text-xs uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: MUT }}>
          {format}
        </span>
        <span className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(36,28,19,0.32)' }} />
        <span className="shrink-0 text-base font-semibold" style={{ fontFamily: MONO, color: INK }}>
          {isk(price)}
        </span>
      </div>
      <button
        onClick={onAdd}
        className="mt-5 w-full rounded-full py-2.5 text-sm font-semibold transition-colors"
        style={{ background: added ? MOSS : INK, color: PAPER, fontFamily: BODY, outlineColor: INK }}
      >
        {added ? 'Bætt við ✓' : 'Bæta í körfu'}
      </button>
    </div>
  )
}

export default function Page() {
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [quizPick, setQuizPick] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [checkoutNote, setCheckoutNote] = useState(false)
  const addedTimer = useRef<number>()

  useEffect(() => {
    document.title = 'Seiðkarlinn — frumgerð að nýjum vef'
    setThemeColor(BG_DARK)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => () => window.clearTimeout(addedTimer.current), [])

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  function addToCart(key: string, name: string, price: number) {
    setCart((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { key, name, price, qty: 1 }]
    })
    setJustAdded(key)
    window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setJustAdded(null), 1400)
  }
  function removeFromCart(key: string) {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0)

  const matchedTea = quizPick ? (GALDUR_TEAS.find((t) => t.slug === QUIZ.find((q) => q.key === quizPick)?.match) ?? null) : null
  const ActiveQuizIcon = quizPick ? QUIZ_ICON[quizPick] : undefined

  const bestsellers = [
    ...GALDUR_TEAS.map((t) => ({ key: t.slug, name: t.name, format: '100g', price: t.price, icon: TEA_ICON[t.slug] })),
    { key: 'honey-0', name: HONEY[0].name, format: HONEY[0].size, price: HONEY[0].price, icon: IconDroplet },
    { key: 'tinc-0', name: `${TINCTURES[0].name} Cordyfresh`, format: TINCTURES[0].size, price: TINCTURES[0].price, icon: IconMushroom },
    { key: 'fd-0', name: FREEZE_DRIED[0].name, format: FREEZE_DRIED[0].size, price: FREEZE_DRIED[0].price, icon: IconSnow },
  ]

  const kvennagaldur = GALDUR_TEAS.find((t) => t.slug === 'kvennagaldur')!

  return (
    <div lang="is" className="min-h-screen overflow-x-hidden antialiased" style={{ background: PAPER, color: INK, fontFamily: BODY }}>
      {/* ── Header — seamless, transparent on the hero, solid once scrolled ── */}
      <header className="fixed inset-x-0 top-0 z-40 transition-colors duration-300" style={{ background: scrolled ? PAPER : 'transparent', borderBottom: `1px solid ${scrolled ? HAIR : 'transparent'}` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="inline-flex items-center border-2 px-3 py-1.5 transition-colors" style={{ borderColor: scrolled ? INK : PAPER, color: scrolled ? INK : PAPER }}>
            <span className="text-base tracking-[0.06em] uppercase" style={{ fontFamily: DISPLAY }}>
              Seiðkarlinn
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: scrolled ? INK : PAPER }}>
            <a href="#kaflar" className="transition-opacity hover:opacity-70">
              Kaflar
            </a>
            <a href="#sagan" className="transition-opacity hover:opacity-70">
              Um okkur
            </a>
            <a href="#verslunin" className="transition-opacity hover:opacity-70">
              Verslunin
            </a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            aria-label={cartLabel(cartCount)}
            className="relative grid h-11 w-11 place-items-center rounded-full transition-colors"
            style={{ color: scrolled ? INK : PAPER }}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] font-bold" style={{ background: RUST, color: PAPER }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden" style={{ background: INK }}>
        <Img
          src={u(IMG.hero, 2000)}
          srcSet={srcset(IMG.hero)}
          sizes="100vw"
          fetchpriority="high"
          alt="Amber glös, glerkrukkur og þurrkaðar jurtir í náttúruvöruverslun"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#3a2f22] to-[#171310]"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,11,7,0.55) 0%, rgba(15,11,7,0.12) 34%, rgba(15,11,7,0.08) 55%, rgba(15,11,7,0.78) 100%)' }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-16 md:px-8 md:pb-24">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: HONEY_GOLD }}>
              {HERO.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl pb-1 text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.08] tracking-normal" style={{ fontFamily: DISPLAY, color: PAPER }}>
              {HERO.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: 'rgba(243,236,221,0.85)' }}>
              {HERO.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#galdur" className="rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: RUST, color: PAPER }}>
                {HERO.ctaPrimary}
              </a>
              <a href="#vinsælt" className="rounded-full border px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10" style={{ borderColor: 'rgba(243,236,221,0.5)', color: PAPER }}>
                {HERO.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Veldu þinn galdur — the signature moment ────────────────────── */}
      <section id="galdur" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32" style={{ background: BG_DARK }}>
        <Img src={u(IMG.bundle, 1600)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BG_DARK}dd, ${BG_DARK}f2 55%, ${BG_DARK})` }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: HONEY_GOLD }}>
              Prófaðu
            </p>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: DISPLAY, color: PAPER }}>
              Veldu þinn galdur
            </h2>
            <p className="mt-4 text-base" style={{ color: MUT_ON_DARK }}>
              Hvað vantar þig í kvöld? Veldu eitt orð, við finnum réttu jurtablönduna.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {QUIZ.map((q) => {
              const Icon = QUIZ_ICON[q.key]
              const active = quizPick === q.key
              return (
                <button
                  key={q.key}
                  onClick={() => setQuizPick(q.key)}
                  aria-pressed={active}
                  className="flex min-w-[8.5rem] flex-col items-center gap-2.5 rounded-2xl border px-5 py-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: active ? HONEY_GOLD : 'rgba(243,236,221,0.18)',
                    background: active ? 'rgba(201,138,42,0.14)' : 'rgba(243,236,221,0.04)',
                    color: PAPER,
                    outlineColor: HONEY_GOLD,
                  }}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{q.label}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-10 min-h-[1px]" aria-live="polite">
            <AnimatePresence mode="wait">
              {matchedTea && (
                <motion.div
                  key={matchedTea.slug}
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, rotate: reduceMotion ? 0 : -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                  transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
                  className="mx-auto max-w-md rounded-3xl p-7 text-left"
                  style={{ background: PAPER, color: INK }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: RUST, color: PAPER }}>
                      {ActiveQuizIcon && <ActiveQuizIcon className="h-5 w-5" />}
                    </span>
                    <span className="text-right text-xs tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                      100g · jurtate
                    </span>
                  </div>
                  <h3 className="mt-4 text-3xl" style={{ fontFamily: DISPLAY }}>
                    {matchedTea.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: MUT }}>
                    {matchedTea.desc}
                  </p>
                  {matchedTea.ingredients && (
                    <p className="mt-3 text-sm" style={{ color: MUT }}>
                      <span style={{ color: INK, fontWeight: 600 }}>Innihald: </span>
                      {matchedTea.ingredients.join(', ')}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: HAIR }}>
                    <span className="text-xl font-semibold" style={{ fontFamily: MONO }}>
                      {isk(matchedTea.price)}
                    </span>
                    <button
                      onClick={() => addToCart(matchedTea.slug, matchedTea.name, matchedTea.price)}
                      className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                      style={{ background: justAdded === matchedTea.slug ? MOSS : INK, color: PAPER, outlineColor: INK }}
                    >
                      {justAdded === matchedTea.slug ? 'Bætt við ✓' : 'Bæta í körfu'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      <section id="vinsælt" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
                  Nýjar vörur
                </p>
                <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
                  Vinsælast þessa dagana
                </h2>
              </div>
              <a href="#kaflar" className="text-sm font-semibold underline underline-offset-4">
                Sjá alla kafla →
              </a>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.key} delay={i * 0.04}>
                <ProductCard name={p.name} format={p.format} price={p.price} icon={p.icon} onAdd={() => addToCart(p.key, p.name, p.price)} added={justAdded === p.key} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kaflar — honeycomb chapter grid ──────────────────────────────── */}
      <section id="kaflar" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER_SOFT }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
              Galdrabókin
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
              Sex kaflar, ein hilla
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: MUT }}>
              Allt vöruúrvalið flokkað eins og kaflar í bók.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6">
            {CHAPTERS.map((c, i) => {
              const Icon = CHAPTER_ICON[c.key]
              return (
                <Reveal key={c.key} delay={i * 0.06}>
                  <a href={`#kafli-${c.key}`} className="group flex flex-col items-center text-center">
                    <span className="relative block h-40 w-full max-w-[220px] overflow-hidden sm:h-44" style={{ clipPath: HEX_CLIP }}>
                      <Img src={u(c.img, 600)} alt="" aria-hidden="true" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,15,10,0.15), rgba(20,15,10,0.78))' }} />
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
                        <Icon className="h-5 w-5" style={{ color: PAPER }} />
                        <span className="text-[11px] font-semibold tracking-[0.14em]" style={{ fontFamily: MONO, color: 'rgba(243,236,221,0.8)' }}>
                          KAFLI {c.roman}
                        </span>
                      </span>
                    </span>
                    <h3 className="mt-4 text-lg" style={{ fontFamily: DISPLAY, color: INK }}>
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: MUT }}>
                      {c.desc}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
                      {c.count} vörur
                    </p>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Recipe spotlight — one card per chapter, full detail ─────────── */}
      <section className="px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
              Í nærmynd
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
              Eitt úr hverjum kafla
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <RecipeCard
                id="kafli-te"
                roman="I"
                name={kvennagaldur.name}
                format="100g"
                price={kvennagaldur.price}
                note={kvennagaldur.desc}
                icon={CHAPTER_ICON.te}
                onAdd={() => addToCart(kvennagaldur.slug, kvennagaldur.name, kvennagaldur.price)}
                added={justAdded === kvennagaldur.slug}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <RecipeCard
                id="kafli-hunang"
                roman="II"
                name={HONEY[1].name}
                format={HONEY[1].size}
                price={HONEY[1].price}
                note="Hrátt hunang af hálendinu, óunnið."
                icon={CHAPTER_ICON.hunang}
                onAdd={() => addToCart('honey-1', HONEY[1].name, HONEY[1].price)}
                added={justAdded === 'honey-1'}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <RecipeCard
                id="kafli-sveppir"
                roman="III"
                name={`${TINCTURES[0].name} Cordyfresh`}
                format={TINCTURES[0].size}
                price={TINCTURES[0].price}
                note="Sveppatinktúra unnin úr Reishi, 20% styrkleiki."
                icon={CHAPTER_ICON.sveppir}
                onAdd={() => addToCart('tinc-0', TINCTURES[0].name, TINCTURES[0].price)}
                added={justAdded === 'tinc-0'}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <RecipeCard
                id="kafli-frost"
                roman="IV"
                name={FREEZE_DRIED[1].name}
                format={FREEZE_DRIED[1].size}
                price={FREEZE_DRIED[1].price}
                note="Frostþurrkuð ber til að narta í eða út á morgunmatinn."
                icon={CHAPTER_ICON.frost}
                onAdd={() => addToCart('fd-1', FREEZE_DRIED[1].name, FREEZE_DRIED[1].price)}
                added={justAdded === 'fd-1'}
              />
            </Reveal>
            <Reveal delay={0.2}>
              <RecipeCard
                id="kafli-hud"
                roman="V"
                name="CBD Skin Oil"
                format="30ml"
                price={9990}
                note="Húðolía með CBD, sativa eða indica."
                icon={CHAPTER_ICON.hud}
                onAdd={() => addToCart('cbd-0', 'CBD Skin Oil', 9990)}
                added={justAdded === 'cbd-0'}
              />
            </Reveal>
            <Reveal delay={0.25}>
              <RecipeCard
                id="kafli-faeda"
                roman="VI"
                name="Glýsín ProHealth"
                format="120 hylki"
                price={4590}
                note="Amínósýra í hylkjum."
                icon={CHAPTER_ICON.faeda}
                onAdd={() => addToCart('glycine-0', 'Glýsín ProHealth', 4590)}
                added={justAdded === 'glycine-0'}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section id="sagan" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER_SOFT }}>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[28px]" style={{ boxShadow: '0 30px 60px -30px rgba(36,28,19,0.35)' }}>
              <Img
                src={u(IMG.jars, 1200)}
                srcSet={srcset(IMG.jars)}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="Þurrkaðar jurtir og blóm í opnum glerkrukkum á tréborði"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
              {STORY.eyebrow}
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
              {STORY.headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: MUT }}>
              {STORY.body}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: HAIR }}>
              {FACTS.map((f) => (
                <div key={f.small}>
                  <p className="text-xl" style={{ fontFamily: DISPLAY, color: INK }}>
                    {f.big}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: MUT }}>
                    {f.small}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Store ────────────────────────────────────────────────────────── */}
      <section id="verslunin" className="relative scroll-mt-20 overflow-hidden px-5 py-20 md:px-8 md:py-28" style={{ background: BG_DARK }}>
        <Img src={u(IMG.shelf, 1600)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${BG_DARK} 25%, rgba(24,19,16,0.7))` }} />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: HONEY_GOLD }}>
              Verslunin
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: PAPER }}>
              {STORE.headline}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: MUT_ON_DARK }}>
              {STORE.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={MAPS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ background: PAPER, color: INK }}>
                <MapPin className="h-4 w-4" /> {ADDRESS.street}, {ADDRESS.town}
              </a>
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold" style={{ borderColor: 'rgba(243,236,221,0.4)', color: PAPER }}>
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold" style={{ borderColor: 'rgba(243,236,221,0.4)', color: PAPER }}>
                <Mail className="h-4 w-4" /> Senda tölvupóst
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-t px-5 py-8 md:px-8" style={{ borderColor: HAIR, background: PAPER }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-sm" style={{ color: MUT }}>
          <p>Frí sending á næstu DROPP stöð fyrir pantanir yfir {isk(SHIPPING_THRESHOLD)}</p>
          <div className="flex items-center gap-4">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-[--ink]" style={{ color: MUT }}>
              <Facebook className="h-4 w-4" />
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: MUT }}>
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: 'rgba(243,236,221,0.97)', backdropFilter: 'blur(10px)', borderColor: HAIR }}>
        <a href="#galdur" className="flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-[13px] font-semibold tracking-[0.02em]" style={{ background: INK, color: PAPER, outlineColor: INK }}>
          Finna minn galdur
        </a>
        <button onClick={() => setCartOpen(true)} aria-label={cartLabel(cartCount)} className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border" style={{ borderColor: HAIR_HI, color: INK }}>
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold" style={{ background: RUST, color: PAPER }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Cart drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Karfa"
              className="fixed inset-y-0 right-0 z-[75] flex w-full max-w-sm flex-col"
              style={{ background: PAPER }}
              initial={{ x: reduceMotion ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b p-5" style={{ borderColor: HAIR }}>
                <h2 className="text-lg" style={{ fontFamily: DISPLAY, color: INK }}>
                  Karfan þín
                </h2>
                <button onClick={() => setCartOpen(false)} aria-label="Loka körfu" className="rounded-full p-2 transition-colors hover:bg-black/5" style={{ color: INK }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <p className="text-sm" style={{ color: MUT }}>
                    Karfan er tóm. Prófaðu galdra-teið eða hunangið.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.key} className="flex items-center justify-between gap-3 border-b pb-4" style={{ borderColor: HAIR }}>
                        <div>
                          <p className="font-medium" style={{ color: INK }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: MUT }}>
                            {item.qty} × {isk(item.price)}
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.key)} aria-label={`Fjarlægja ${item.name}`} className="text-xs underline underline-offset-2" style={{ color: MUT }}>
                          Fjarlægja
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t p-5" style={{ borderColor: HAIR }}>
                  <div className="flex items-center justify-between text-base font-semibold" style={{ color: INK }}>
                    <span>Samtals</span>
                    <span style={{ fontFamily: MONO }}>{isk(cartTotal)}</span>
                  </div>
                  <button onClick={() => setCheckoutNote(true)} className="mt-4 w-full rounded-full py-3 text-sm font-semibold" style={{ background: INK, color: PAPER, outlineColor: INK }}>
                    Ganga frá pöntun
                  </button>
                  {checkoutNote && (
                    <p className="mt-3 text-xs" style={{ color: MUT }}>
                      Þetta er frumgerð — engin raunveruleg greiðsla fer hér fram.
                    </p>
                  )}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <PreviewChrome company={company} />
    </div>
  )
}
