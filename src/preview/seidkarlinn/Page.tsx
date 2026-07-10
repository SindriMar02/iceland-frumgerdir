import { useEffect, useRef, useState } from 'react'
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
  EMAIL,
  FACEBOOK,
  FACTS,
  GALDUR_TEAS,
  HERO,
  IMG,
  INSTAGRAM,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRODUCTS,
  SHIPPING_THRESHOLD,
  STORE,
  STORY,
  getProduct,
  isk,
  u,
} from './data'
import type { Product, ProductCat } from './data'

const company = getPreviewCompany('seidkarlinn')

/* ── Úr jörðinni — a living, organic botanical catalogue. Warm bone ground,
      moss ink, honey amber. Everything soft: morphing blob image masks,
      drifting pollen, a botanical marquee, a vine that grows itself. The shop
      stays a real shop: filterable grid, visible prices, working cart. ───── */
const BONE = '#F4EFE3'
const CARD = '#FFFDF6'
const CREAM2 = '#ECE4D2'
const SAGE = '#E7EBD8'
const INK = '#232819'
const MUT = '#565B45'
const HAIR = 'rgba(35,40,25,0.14)'
const HAIR_HI = 'rgba(35,40,25,0.26)'
const MOSS = '#3E5732'
const HONEY_GOLD = '#C98A2A'
const CLAY = '#8F4C22' // AA as 12px-bold eyebrow on the amber band and as the badge fill
const FOREST = '#232A1C'
const BONE_ON_DARK = 'rgba(244,239,227,0.92)'
const MUT_ON_DARK = 'rgba(244,239,227,0.7)'

const DISPLAY = "'Fraunces', Georgia, serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"

const BLOB_A = '58% 42% 55% 45% / 48% 55% 45% 52%'
const BLOB_B = '45% 55% 52% 48% / 55% 45% 55% 45%'

function srcset(url: string) {
  return `${u(url, 828)} 828w, ${u(url, 1280)} 1280w, ${u(url, 2000)} 2000w`
}

const CSS = `
@keyframes skIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
.sk-in { opacity: 0; animation: skIn .85s cubic-bezier(.22,.8,.3,1) forwards; }
@keyframes skBlob {
  0%, 100% { border-radius: ${BLOB_A}; }
  40% { border-radius: ${BLOB_B}; }
  70% { border-radius: 52% 48% 42% 58% / 45% 56% 44% 55%; }
}
.sk-live .sk-blob { animation: skBlob 18s ease-in-out infinite; }
@keyframes skBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.sk-live .sk-breathe { animation: skBreathe 10s ease-in-out infinite; }
@keyframes skFloat { from { transform: translateY(-7px); } to { transform: translateY(9px); } }
.sk-live .sk-float { animation: skFloat 7s ease-in-out infinite alternate; }
@keyframes skMarq { to { transform: translateX(-50%); } }
.sk-live .sk-marq-inner { animation: skMarq 40s linear infinite; }
@keyframes skPollen {
  0% { transform: translateY(0); opacity: 0; }
  8% { opacity: .5; }
  80% { opacity: .2; }
  100% { transform: translateY(-72vh); opacity: 0; }
}
.sk-live .sk-pollen { animation: skPollen var(--dur, 12s) linear infinite; animation-delay: var(--delay, 0s); }
@keyframes skDriftA { from { transform: translate(0,0) scale(1); } to { transform: translate(-5vmax, 6vmax) scale(1.15); } }
@keyframes skDriftB { from { transform: translate(0,0) scale(1); } to { transform: translate(6vmax, -5vmax) scale(1.1); } }
.sk-live .sk-drift-a { animation: skDriftA 26s ease-in-out infinite alternate; }
.sk-live .sk-drift-b { animation: skDriftB 32s ease-in-out infinite alternate; }
.sk-card { transition: transform .35s cubic-bezier(.22,.8,.3,1), box-shadow .35s ease; }
.sk-card:hover { transform: translateY(-5px); box-shadow: 0 24px 44px -26px rgba(35,40,25,.38); }
.sk-icon { transition: transform .35s ease; }
.sk-card:hover .sk-icon { transform: rotate(-8deg) scale(1.08); }
.sk-vine-path { transition: stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) .15s; }
.sk-vine-leaf { transition: opacity .8s ease, transform .8s ease; }
`

type IconT = (p: { className?: string }) => JSX.Element

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 4c-8 0-14 5-14 13 0 1.5.3 2.5.3 2.5S7 19 8 12C9.5 6 14 4 20 4Z" />
      <path d="M6.5 19.5 18 6" />
    </svg>
  )
}
function IconDroplet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3s6 7 6 11.5A6 6 0 0 1 6 14.5C6 10 12 3 12 3Z" />
    </svg>
  )
}
function IconMushroom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 11c0-4 3.5-7 8-7s8 3 8 7c-2-1-5-1.5-8-1.5S6 10 4 11Z" />
      <path d="M10 11v6a2 2 0 0 0 4 0v-6" />
    </svg>
  )
}
function IconSnow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2v20M4 7l16 10M20 7 4 17M2 12h20" />
    </svg>
  )
}
function IconFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 9.4V4.5M12 19.5v-4.9M9.4 12H4.5M19.5 12h-4.9M14 10l3.4-3.4M6.6 17.4 10 14M14 14l3.4 3.4M6.6 6.6 10 10" />
    </svg>
  )
}
function IconCapsule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" />
      <path d="M9 10.8 15 13.2" />
    </svg>
  )
}

const CAT_ICON: Record<ProductCat, IconT> = {
  te: IconLeaf,
  hunang: IconDroplet,
  sveppir: IconMushroom,
  frost: IconSnow,
  hud: IconFlower,
  faeda: IconCapsule,
}
const CAT_LABEL: Record<ProductCat, string> = {
  te: 'Te-galdur',
  hunang: 'Hunang & frjó',
  sveppir: 'Sveppir',
  frost: 'Frostþurrkað',
  hud: 'Húð & hár',
  faeda: 'Fæðubót',
}

const FILTERS: { key: ProductCat | 'allt'; label: string }[] = [
  { key: 'allt', label: 'Allt' },
  { key: 'te', label: 'Te-galdrar' },
  { key: 'hunang', label: 'Hunang & frjó' },
  { key: 'sveppir', label: 'Sveppir' },
  { key: 'frost', label: 'Frostþurrkað' },
  { key: 'hud', label: 'Húð & hár' },
  { key: 'faeda', label: 'Fæðubótarefni' },
]

const MARQUEE = ['Netla', 'Hindberjalauf', 'Hafrastrá', 'Hrátt hunang', 'Býflugnafrjó', 'Propolis', 'Reishi', 'Chaga', 'Cordyceps', 'Lions Mane', 'Bláber', 'Mangó', 'Shilajit', 'Kakó']

const POLLEN = [
  { left: '6%', delay: '0s', size: 5, dur: '13s', color: MOSS },
  { left: '18%', delay: '2.6s', size: 4, dur: '11s', color: HONEY_GOLD },
  { left: '31%', delay: '5.2s', size: 6, dur: '14s', color: MOSS },
  { left: '47%', delay: '1.4s', size: 4, dur: '12s', color: HONEY_GOLD },
  { left: '63%', delay: '3.8s', size: 5, dur: '15s', color: MOSS },
  { left: '74%', delay: '6.6s', size: 4, dur: '11.5s', color: HONEY_GOLD },
  { left: '86%', delay: '0.9s', size: 6, dur: '13.5s', color: MOSS },
  { left: '93%', delay: '4.5s', size: 4, dur: '12.5s', color: HONEY_GOLD },
]

/** A vine that draws itself when scrolled into view (IO + CSS, no rAF). */
function Vine({ grown }: { grown: boolean }) {
  const leaves = [
    { d: 'M52 118 C 42 114, 38 106, 40 98 C 50 100, 54 108, 52 118Z', delay: 0.9 },
    { d: 'M68 92 C 78 88, 82 80, 80 72 C 70 74, 66 82, 68 92Z', delay: 1.2 },
    { d: 'M50 62 C 40 58, 36 50, 38 42 C 48 44, 52 52, 50 62Z', delay: 1.5 },
    { d: 'M66 36 C 76 32, 80 24, 78 16 C 68 18, 64 26, 66 36Z', delay: 1.8 },
  ]
  return (
    <svg viewBox="0 0 120 160" className="h-36 w-auto" aria-hidden="true">
      <path
        d="M60 156 C 56 128, 68 112, 60 88 C 52 66, 66 46, 58 22 C 56 15, 58 8, 60 4"
        fill="none"
        stroke={MOSS}
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={grown ? 0 : 1}
        className="sk-vine-path"
      />
      {leaves.map((l) => (
        <path
          key={l.d}
          d={l.d}
          fill={MOSS}
          opacity={grown ? 0.85 : 0}
          className="sk-vine-leaf"
          style={{ transitionDelay: `${l.delay}s`, transform: grown ? 'scale(1)' : 'scale(0.6)', transformOrigin: '60px 80px' }}
        />
      ))}
    </svg>
  )
}

interface CartItem {
  key: string
  name: string
  price: number
  qty: number
}

function ProductCard({ product, onAdd, added }: { product: Product; onAdd: () => void; added: boolean }) {
  const Icon = CAT_ICON[product.cat]
  return (
    <div className="sk-card flex h-full flex-col justify-between rounded-[26px] border p-5" style={{ borderColor: HAIR, background: CARD }}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="sk-icon grid h-10 w-10 place-items-center" style={{ background: 'rgba(62,87,50,0.1)', color: MOSS, borderRadius: BLOB_A }}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: MUT }}>
            {CAT_LABEL[product.cat]}
          </span>
        </div>
        <h3 className="mt-4 text-xl leading-snug" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 500 }}>
          {product.name}
        </h3>
        <p className="mt-1 text-sm" style={{ color: MUT }}>
          {product.format}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4" style={{ borderColor: HAIR }}>
        <span className="text-[15px] font-bold tabular-nums" style={{ color: INK }}>
          {isk(product.price)}
        </span>
        <button
          onClick={onAdd}
          aria-label={`Bæta ${product.name} í körfu`}
          className="min-h-11 rounded-full px-4 text-[13px] font-semibold transition-colors"
          style={{ background: added ? MOSS : INK, color: BONE, outlineColor: INK }}
        >
          {added ? 'Í körfunni ✓' : 'Bæta í körfu'}
        </button>
      </div>
    </div>
  )
}

function DottedRow({ product, dark, onAdd, added }: { product: Product; dark?: boolean; onAdd: () => void; added: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-lg leading-snug" style={{ fontFamily: DISPLAY, color: dark ? BONE_ON_DARK : INK, fontWeight: 500 }}>
          {product.name}
        </p>
        <p className="text-xs" style={{ color: dark ? MUT_ON_DARK : 'rgba(35,40,25,0.68)' }}>
          {product.format}
        </p>
      </div>
      <span className="mx-1 flex-1 border-b border-dotted" style={{ borderColor: dark ? 'rgba(244,239,227,0.35)' : 'rgba(35,40,25,0.35)' }} />
      <span className="shrink-0 text-[15px] font-bold tabular-nums" style={{ color: dark ? BONE_ON_DARK : INK }}>
        {isk(product.price)}
      </span>
      <button
        onClick={onAdd}
        aria-label={`Bæta ${product.name} í körfu`}
        className="min-h-11 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors"
        style={
          dark
            ? { background: added ? BONE : HONEY_GOLD, color: FOREST, outlineColor: HONEY_GOLD }
            : { background: added ? MOSS : INK, color: BONE, outlineColor: INK }
        }
      >
        {added ? '✓' : 'Bæta við'}
      </button>
    </div>
  )
}

export default function Page() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [filter, setFilter] = useState<ProductCat | 'allt'>('allt')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [checkoutNote, setCheckoutNote] = useState(false)
  const [vineGrown, setVineGrown] = useState(false)

  const addedTimer = useRef<number>()
  const vineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Seiðkarlinn · frumgerð að nýjum vef'
    setThemeColor(BONE)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => () => window.clearTimeout(addedTimer.current), [])

  // Synchronous rect check on scroll (IO callbacks can stall in throttled
  // tabs — same fix as the bakery reveals), plus a few timed re-checks after
  // mount so restored-scroll loads and throttled tabs still grow the vine.
  // The rect condition gates every path, so nothing fires off-screen.
  useEffect(() => {
    let grown = false
    const check = () => {
      if (grown) return
      const el = vineRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.78 && r.bottom > 0) {
        grown = true
        setVineGrown(true)
        window.removeEventListener('scroll', check)
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    const iv = window.setInterval(check, 600)
    const stop = window.setTimeout(() => window.clearInterval(iv), 6000)
    return () => {
      window.removeEventListener('scroll', check)
      window.clearInterval(iv)
      window.clearTimeout(stop)
    }
  }, [])

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
  const add = (p: Product) => () => addToCart(p.id, p.name, p.price)

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const cartLabel = `Karfa, ${cartCount} ${cartCount === 1 ? 'vara' : 'vörur'}`

  const filtered = filter === 'allt' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter)
  const kvenna = GALDUR_TEAS.find((t) => t.slug === 'kvennagaldur')!
  const kvennaProduct = getProduct('kvennagaldur')!
  const honeyRows = [getProduct('villibloma')!, getProduct('hafjalla')!, getProduct('byflugnafrjo')!]
  const tinctureRows = [getProduct('reishi')!, getProduct('chaga')!, getProduct('cordyceps')!, getProduct('lionsmane')!]

  return (
    <div lang="is" className={`min-h-screen overflow-x-hidden antialiased ${reduce ? '' : 'sk-live'}`} style={{ background: BONE, color: INK, fontFamily: BODY }}>
      <style>{CSS}</style>

      {/* ── Header — seamless over the hero, bone once scrolled ──────────── */}
      <header
        className="fixed inset-x-0 top-0 z-40 transition-colors duration-300"
        style={{ background: scrolled ? 'rgba(244,239,227,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: `1px solid ${scrolled ? HAIR : 'transparent'}` }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 600, color: INK }}>
            Seiðkarlinn
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" style={{ color: INK }}>
            <a href="#vorur" className="transition-opacity hover:opacity-60">
              Vörurnar
            </a>
            <a href="#um" className="transition-opacity hover:opacity-60">
              Um okkur
            </a>
            <a href="#verslunin" className="transition-opacity hover:opacity-60">
              Búðin
            </a>
          </nav>
          <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-black/5" style={{ color: INK }}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] font-bold" style={{ background: CLAY, color: BONE }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero — airy, breathing, alive ────────────────────────────────── */}
      <section id="top" className="relative flex min-h-[92svh] items-center overflow-hidden px-5 pt-28 pb-16 md:px-8">
        <div aria-hidden="true" className="sk-drift-a pointer-events-none absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(62,87,50,0.12), transparent 65%)' }} />
        <div aria-hidden="true" className="sk-drift-b pointer-events-none absolute -right-48 -bottom-48 h-[38rem] w-[38rem] rounded-full opacity-70" style={{ background: 'radial-gradient(circle, rgba(201,138,42,0.13), transparent 65%)' }} />
        {!reduce &&
          POLLEN.map((p) => (
            <span
              key={p.left}
              aria-hidden="true"
              className="sk-pollen pointer-events-none absolute bottom-0 rounded-full"
              style={{ left: p.left, width: p.size, height: p.size, background: p.color, opacity: 0, ['--dur' as string]: p.dur, ['--delay' as string]: p.delay }}
            />
          ))}

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-10">
          <div>
            <p className="sk-in text-xs font-bold tracking-[0.22em] uppercase" style={{ color: MOSS, animationDelay: '.05s' }}>
              {HERO.eyebrow}
            </p>
            <h1 className="mt-5 text-[clamp(2.9rem,7vw,5.4rem)] leading-[1.04] text-balance" style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK }}>
              <span className="sk-in inline-block" style={{ animationDelay: '.12s' }}>
                Allt sem
              </span>{' '}
              <em className="sk-in inline-block" style={{ animationDelay: '.24s', color: MOSS }}>
                jörðin
              </em>{' '}
              <span className="sk-in inline-block" style={{ animationDelay: '.36s' }}>
                gefur.
              </span>
            </h1>
            <p className="sk-in mt-6 max-w-md text-lg leading-relaxed" style={{ color: MUT, animationDelay: '.5s' }}>
              {HERO.sub}
            </p>
            <div className="sk-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: '.64s' }}>
              <a href="#vorur" className="inline-flex min-h-12 items-center rounded-full px-7 text-[15px] font-semibold transition-transform hover:scale-[1.03]" style={{ background: INK, color: BONE, outlineColor: INK }}>
                {HERO.ctaPrimary}
              </a>
              <a href="#verslunin" className="inline-flex min-h-12 items-center rounded-full border px-7 text-[15px] font-semibold transition-colors hover:bg-black/5" style={{ borderColor: HAIR_HI, color: INK }}>
                {HERO.ctaSecondary}
              </a>
            </div>
            <p className="sk-in mt-7 text-sm" style={{ color: MUT, animationDelay: '.78s' }}>
              Frí sending á næstu DROPP stöð yfir {isk(SHIPPING_THRESHOLD)}
            </p>
          </div>

          <div className="sk-in relative mx-auto w-full max-w-md md:max-w-none" style={{ animationDelay: '.3s' }}>
            <div className="sk-blob relative aspect-square overflow-hidden" style={{ borderRadius: BLOB_A, boxShadow: '0 44px 90px -44px rgba(35,40,25,0.45)' }}>
              <Img
                src={u(IMG.jars, 1200)}
                srcSet={srcset(IMG.jars)}
                sizes="(min-width: 768px) 44vw, 92vw"
                fetchpriority="high"
                alt="Þurrkaðar jurtir og blóm í opnum glerkrukkum á tréborði"
                className="sk-breathe h-full w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#d9d2bd] to-[#a9a284]"
              />
            </div>
            <div className="sk-float absolute -bottom-8 -left-4 h-28 w-28 overflow-hidden border-4 md:-left-10 md:h-36 md:w-36" style={{ borderRadius: BLOB_B, borderColor: BONE, boxShadow: '0 22px 44px -22px rgba(35,40,25,0.4)' }}>
              <Img src={u(IMG.honeycomb, 400)} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            </div>
            <div className="sk-float absolute -top-6 -right-3 h-24 w-24 overflow-hidden border-4 md:-right-8 md:h-32 md:w-32" style={{ borderRadius: BLOB_A, borderColor: BONE, boxShadow: '0 22px 44px -22px rgba(35,40,25,0.4)', animationDelay: '1.6s' }}>
              <Img src={u(IMG.driedFruit2, 400)} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Botanical marquee ────────────────────────────────────────────── */}
      <section aria-hidden="true" className="overflow-hidden border-y py-5" style={{ borderColor: HAIR }}>
        <div className="sk-marq-inner flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10 pr-10">
              {MARQUEE.map((m) => (
                <span key={`${copy}-${m}`} className="flex items-center gap-10 whitespace-nowrap">
                  <em className="text-xl" style={{ fontFamily: DISPLAY, color: 'rgba(35,40,25,0.6)' }}>
                    {m}
                  </em>
                  <span style={{ color: 'rgba(62,87,50,0.5)' }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── The shop — filterable, animated, a real store ────────────────── */}
      <section id="vorur" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: MOSS }}>
                  Vörurnar
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
                  Veldu af hillunni
                </h2>
              </div>
              <p className="text-sm" style={{ color: MUT }}>
                {PRODUCTS.length} vörur · verð af vef Seiðkarlsins
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-8">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const count = f.key === 'allt' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === f.key).length
                const active = filter === f.key
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={active}
                    className="min-h-11 rounded-full border px-4 text-[13.5px] font-semibold transition-all"
                    style={{
                      background: active ? INK : 'transparent',
                      color: active ? BONE : INK,
                      borderColor: active ? INK : HAIR_HI,
                      outlineColor: INK,
                    }}
                  >
                    {f.label} <span style={{ opacity: 0.55 }}>{count}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* Keyed by filter: swaps re-run the CSS stagger — no rAF, instant
              unmounts, works even in throttled tabs. */}
          <div key={filter} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <div key={p.id} className="sk-in h-full" style={{ animationDelay: `${Math.min(i * 0.05, 0.55)}s` }}>
                <ProductCard product={p} onAdd={add(p)} added={justAdded === p.id} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kvennagaldur ritual — their own verified recipe as the centerpiece ── */}
      <section className="px-5 py-20 md:px-8 md:py-28" style={{ background: SAGE }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative mx-auto max-w-sm md:max-w-none">
              <div className="sk-blob relative aspect-[4/5] overflow-hidden" style={{ borderRadius: BLOB_B, boxShadow: '0 40px 80px -40px rgba(35,40,25,0.4)' }}>
                <Img src={u(IMG.teaPour, 1000)} srcSet={srcset(IMG.teaPour)} sizes="(min-width: 768px) 42vw, 88vw" alt="Te hellt úr tekatli í bolla" className="sk-breathe h-full w-full object-cover" />
              </div>
              <div className="absolute inset-x-0 -bottom-7 flex justify-center gap-2 md:justify-start md:pl-6">
                {(kvenna.ingredients ?? []).map((ing, i) => (
                  <span
                    key={ing}
                    className="sk-float rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-sm"
                    style={{ background: CARD, borderColor: HAIR, color: INK, rotate: `${[-2.5, 1.5, -1][i]}deg`, animationDelay: `${i * 0.9}s` }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: MOSS }}>
              Kvennagaldur · te-galdur
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight text-balance" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
              Þrjár jurtir. Ekkert annað.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: MUT }}>
              Netla, hafrastrá og hindberjalauf, jarðbundið te til daglegrar notkunar, sett saman með konur í huga. Innihald og notkun eins og á vörusíðu Seiðkarlsins.
            </p>
            <ol className="mt-8 max-w-md">
              {['Ein teskeið í bolla', 'Heitt vatn yfir', 'Látið standa í 5 til 10 mínútur'].map((step, i) => (
                <li key={step} className="flex items-baseline gap-4 border-t py-4" style={{ borderColor: 'rgba(35,40,25,0.16)' }}>
                  <em className="text-xl" style={{ fontFamily: DISPLAY, color: MOSS }}>
                    0{i + 1}
                  </em>
                  <span className="text-base font-medium">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center justify-between gap-3 rounded-3xl border p-5" style={{ background: CARD, borderColor: HAIR }}>
              <div>
                <p className="text-lg" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
                  {kvennaProduct.name}
                </p>
                <p className="text-sm" style={{ color: MUT }}>
                  {kvennaProduct.format} · {isk(kvennaProduct.price)}
                </p>
              </div>
              <button
                onClick={add(kvennaProduct)}
                aria-label={`Bæta ${kvennaProduct.name} í körfu`}
                className="min-h-11 shrink-0 rounded-full px-5 text-[13.5px] font-semibold transition-colors"
                style={{ background: justAdded === kvennaProduct.id ? MOSS : INK, color: BONE, outlineColor: INK }}
              >
                {justAdded === kvennaProduct.id ? 'Í körfunni ✓' : 'Bæta í körfu'}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Honey band — inset amber ─────────────────────────────────────── */}
      <section className="px-4 py-16 md:px-8 md:py-20">
        <Reveal>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] px-6 py-14 md:px-14 md:py-20" style={{ background: 'linear-gradient(160deg, #F6E9CC, #EDD59F)' }}>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: CLAY }}>
                  Hunangið
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight" style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK }}>
                  Beint úr búinu
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: 'rgba(35,40,25,0.78)' }}>
                  Hrátt og óunnið hunang, villiblóma, háfjalla og rósmarín, ásamt býflugnafrjói og propolis úr sama búi.
                </p>
                <div className="mt-6">
                  {honeyRows.map((p) => (
                    <DottedRow key={p.id} product={p} onAdd={add(p)} added={justAdded === p.id} />
                  ))}
                </div>
              </div>
              <div className="sk-blob relative mx-auto aspect-square w-full max-w-sm overflow-hidden" style={{ borderRadius: BLOB_A, boxShadow: '0 40px 80px -40px rgba(90,60,10,0.5)' }}>
                <Img src={u(IMG.honeycomb, 1000)} srcSet={srcset(IMG.honeycomb)} sizes="(min-width: 768px) 38vw, 88vw" alt="Hrátt hunang í vaxkambi í nærmynd" className="sk-breathe h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Story + growing vine ─────────────────────────────────────────── */}
      <section id="um" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div ref={vineRef} className="flex justify-center">
            <Vine grown={vineGrown} />
          </div>
          <Reveal>
            <p className="mt-6 text-xs font-bold tracking-[0.22em] uppercase" style={{ color: MOSS }}>
              {STORY.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.12] text-balance" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
              {STORY.headline}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed" style={{ color: MUT }}>
              {STORY.body}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-4 border-t pt-8" style={{ borderColor: HAIR }}>
              {FACTS.map((f) => (
                <div key={f.small}>
                  <p className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
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

      {/* ── Mushroom band — inset deep forest ────────────────────────────── */}
      <section className="px-4 py-4 md:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] px-6 py-14 md:px-14 md:py-20" style={{ background: FOREST }}>
            {!reduce &&
              POLLEN.slice(0, 5).map((p) => (
                <span
                  key={`f-${p.left}`}
                  aria-hidden="true"
                  className="sk-pollen pointer-events-none absolute bottom-0 rounded-full"
                  style={{ left: p.left, width: 4, height: 4, background: HONEY_GOLD, opacity: 0, ['--dur' as string]: p.dur, ['--delay' as string]: p.delay }}
                />
              ))}
            <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className="sk-blob relative order-2 mx-auto aspect-square w-full max-w-sm overflow-hidden md:order-1" style={{ borderRadius: BLOB_B, boxShadow: '0 40px 80px -40px rgba(0,0,0,0.6)' }}>
                <Img src={u(IMG.tincture, 1000)} srcSet={srcset(IMG.tincture)} sizes="(min-width: 768px) 38vw, 88vw" alt="Brún glerflaska með dropateljara" className="sk-breathe h-full w-full object-cover" />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: HONEY_GOLD }}>
                  Tinktúrur
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight" style={{ fontFamily: DISPLAY, fontWeight: 500, color: BONE_ON_DARK }}>
                  Sveppir og rætur
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: MUT_ON_DARK }}>
                  Tinktúrur unnar úr heilsusveppum, Reishi, Chaga, Cordyceps og Lions Mane. Nokkrir dropar í drykkinn.
                </p>
                <div className="mt-6">
                  {tinctureRows.map((p) => (
                    <DottedRow key={p.id} product={p} dark onAdd={add(p)} added={justAdded === p.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Store ────────────────────────────────────────────────────────── */}
      <section id="verslunin" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28" style={{ background: CREAM2 }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: MOSS }}>
              Verslunin
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>
              {STORE.headline}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: MUT }}>
              {STORE.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={MAPS} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.02]" style={{ background: INK, color: BONE, outlineColor: INK }}>
                <MapPin className="h-4 w-4" /> {ADDRESS.street}, {ADDRESS.town}
              </a>
              <a href={PHONE_HREF} className="inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors hover:bg-black/5" style={{ borderColor: HAIR_HI, color: INK }}>
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors hover:bg-black/5" style={{ borderColor: HAIR_HI, color: INK }}>
                <Mail className="h-4 w-4" /> Senda línu
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sk-blob relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden" style={{ borderRadius: BLOB_A, boxShadow: '0 40px 80px -40px rgba(35,40,25,0.4)' }}>
              <Img src={u(IMG.shelf, 1000)} srcSet={srcset(IMG.shelf)} sizes="(min-width: 768px) 40vw, 88vw" alt="Krukkur í röðum á tréhillum" className="sk-breathe h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final line ───────────────────────────────────────────────────── */}
      <section className="px-5 py-24 text-center md:px-8 md:py-32">
        <Reveal>
          <p className="mx-auto max-w-3xl text-[clamp(1.7rem,4.4vw,3.1rem)] leading-[1.2] text-balance italic" style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK }}>
            „Það besta sem náttúran hefur upp á að bjóða.“
          </p>
          <p className="mt-4 text-sm" style={{ color: MUT }}>
            Úr orðum Seiðkarlsins sjálfs
          </p>
          <a href="#vorur" className="mt-9 inline-flex min-h-12 items-center rounded-full px-8 text-[15px] font-semibold transition-transform hover:scale-[1.03]" style={{ background: MOSS, color: BONE, outlineColor: MOSS }}>
            Skoða vörurnar
          </a>
        </Reveal>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-t px-5 py-8 md:px-8" style={{ borderColor: HAIR }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-sm" style={{ color: MUT }}>
          <p>Frí sending á næstu DROPP stöð fyrir pantanir yfir {isk(SHIPPING_THRESHOLD)}</p>
          <div className="flex items-center gap-4">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: MUT }}>
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
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: 'rgba(244,239,227,0.97)', backdropFilter: 'blur(10px)', borderColor: HAIR }}>
        <a href="#vorur" className="flex min-h-12 flex-1 items-center justify-center rounded-full px-5 text-[13.5px] font-semibold" style={{ background: INK, color: BONE, outlineColor: INK }}>
          Skoða vörurnar
        </a>
        <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border" style={{ borderColor: HAIR_HI, color: INK }}>
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold" style={{ background: CLAY, color: BONE }}>
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
              style={{ background: BONE }}
              initial={{ x: reduce ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b p-5" style={{ borderColor: HAIR }}>
                <h2 className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK }}>
                  Karfan þín
                </h2>
                <button onClick={() => setCartOpen(false)} aria-label="Loka körfu" className="rounded-full p-2 transition-colors hover:bg-black/5" style={{ color: INK }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <p className="text-sm" style={{ color: MUT }}>
                    Karfan er tóm. Byrjaðu á hunanginu eða galdra-teinu.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.key} className="flex items-center justify-between gap-3 border-b pb-4" style={{ borderColor: HAIR }}>
                        <div>
                          <p className="font-semibold" style={{ color: INK }}>
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
                  <div className="flex items-center justify-between text-base font-bold" style={{ color: INK }}>
                    <span>Samtals</span>
                    <span className="tabular-nums">{isk(cartTotal)}</span>
                  </div>
                  <button onClick={() => setCheckoutNote(true)} className="mt-4 min-h-12 w-full rounded-full text-sm font-semibold" style={{ background: INK, color: BONE, outlineColor: INK }}>
                    Ganga frá pöntun
                  </button>
                  {checkoutNote && (
                    <p className="mt-3 text-xs" style={{ color: MUT }}>
                      Þetta er frumgerð, engin raunveruleg greiðsla fer hér fram.
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
