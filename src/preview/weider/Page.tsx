import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Check,
  Cookie,
  CreditCard,
  CupSoda,
  Droplet,
  Dumbbell,
  FlaskConical,
  Globe,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'

const company = getPreviewCompany('weider')

/* ── brand: ink #08080a · surface #121214 · Weider red #e11d48 · red-light #ff5470 (AA on dark) ──
   Display = Anton (font-poster) with OPEN leading + normal tracking so Icelandic accents
   (Í Á É Ó Ú Ý Þ Æ Ö) never clip. Product/body text = Inter (font-sans) for shopping legibility.
   Spec/labels = Space Mono (font-mono). */
const RED = '#e11d48'
const REDL = '#ff5470'

const isk = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`

/* ───────────────────────── data ──────────────────────────────── */
interface Product {
  id: string
  name: string
  cat: string
  icon: LucideIcon
  variant: string
  price: number
  from?: boolean
  rating: string
  swatch: string
  best?: boolean
}

const PRODUCTS: Product[] = [
  { id: 'whey', name: 'Premium Whey', cat: 'Prótein', icon: Dumbbell, variant: 'Súkkulaði · 500 g–2,3 kg', price: 3990, from: true, rating: '4,9', swatch: '#7b1224', best: true },
  { id: 'creatine', name: 'Pure Creatine', cat: 'Kreatín', icon: FlaskConical, variant: 'Einhýdrat · 250–500 g', price: 2890, from: true, rating: '4,8', swatch: '#2b2c33', best: true },
  { id: 'rush', name: 'Total Rush 2.0', cat: 'Pre-workout', icon: Zap, variant: 'Bláber · 375 g', price: 3990, rating: '4,7', swatch: '#7a2a10', best: true },
  { id: 'eaa', name: 'Premium EAA', cat: 'Amínósýrur', icon: Leaf, variant: 'Sítróna · 390 g', price: 3790, rating: '4,8', swatch: '#10333d', best: true },
  { id: 'multivit', name: 'Multi Vítamín Gúmmí', cat: 'Vítamín', icon: Heart, variant: 'Ber · 60 stk.', price: 2290, rating: '4,7', swatch: '#7a3a0c' },
  { id: 'omega', name: 'Omega 3 Superior', cat: 'Vítamín', icon: Heart, variant: 'Fiskolía · 90 hylki', price: 2990, rating: '4,8', swatch: '#0d3142' },
  { id: 'megamass', name: 'Mega Mass', cat: 'Prótein', icon: Dumbbell, variant: 'Vanilla · 3 kg', price: 3990, rating: '4,6', swatch: '#3a1c0a' },
  { id: 'creagum', name: 'Creatine Gummies', cat: 'Kreatín', icon: FlaskConical, variant: 'Ber · 60 stk.', price: 2990, rating: '4,7', swatch: '#3a0a1a' },
  { id: 'plant', name: 'Plant Based Protein', cat: 'Prótein', icon: Leaf, variant: 'Súkkulaði · 750 g', price: 3690, rating: '4,6', swatch: '#173d1f' },
  { id: 'hydration', name: 'Premium Hydration', cat: 'Vítamín', icon: Droplet, variant: 'Stikur · 20 stk.', price: 1990, rating: '4,7', swatch: '#11546b' },
  { id: 'wafer', name: 'Whey Wafer', cat: 'Snarl & drykkir', icon: Cookie, variant: 'Súkkulaði · 35 g', price: 249, rating: '4,6', swatch: '#3a2410' },
  { id: 'drink', name: 'Prótein drykkur', cat: 'Snarl & drykkir', icon: CupSoda, variant: 'Vanilla · 250 ml', price: 349, rating: '4,7', swatch: '#2a1530' },
]

const CATEGORIES = ['Allt', 'Kreatín', 'Prótein', 'Pre-workout', 'Amínósýrur', 'Vítamín', 'Snarl & drykkir']

const GOALS: { goal: string; icon: LucideIcon; line: string; cat: string }[] = [
  { goal: 'Byggja vöðva', icon: Dumbbell, line: 'Prótein og kreatín fyrir uppbyggingu og kraft.', cat: 'Prótein' },
  { goal: 'Meiri orka', icon: Zap, line: 'Pre-workout fyrir orku og fókus í æfingunni.', cat: 'Pre-workout' },
  { goal: 'Betri endurheimt', icon: Leaf, line: 'Amínósýrur sem styðja við endurheimt.', cat: 'Amínósýrur' },
  { goal: 'Dagleg heilsa', icon: Heart, line: 'Vítamín og steinefni fyrir daglegt jafnvægi.', cat: 'Vítamín' },
]

const STATS: { to: number; suffix: string; label: string }[] = [
  { to: 90, suffix: ' ár', label: 'í íþróttanæringu' },
  { to: 120, suffix: '+', label: 'lönd um allan heim' },
  { to: 100, suffix: '%', label: 'ekta Weider vörur' },
]

/* ───────────────────────── cart store ─────────────────────────── */
interface CartLine extends Product {
  qty: number
}
interface CartApi {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (p: Product) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  open: boolean
  setOpen: (o: boolean) => void
}
const CartCtx = createContext<CartApi | null>(null)
const useCart = () => {
  const c = useContext(CartCtx)
  if (!c) throw new Error('CartCtx missing')
  return c
}

function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const add = (p: Product) =>
    setLines((prev) => {
      const found = prev.find((l) => l.id === p.id)
      if (found) return prev.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { ...p, qty: 1 }]
    })
  const setQty = (id: string, qty: number) =>
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))))
  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id))
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const api: CartApi = { lines, count, subtotal, add, setQty, remove, open, setOpen }
  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

/* ───────────────────────── primitives ─────────────────────────── */
function WeiderMark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-poster leading-none ${className}`} aria-label="Weider">
      <span aria-hidden="true">
        WEIDER<sup className="ml-[0.06em] align-super text-[0.4em]">®</sup>
      </span>
    </span>
  )
}

function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* product image panel — honest photo-light tile (no mislabelled stock photos) */
function ProductArt({ p, big = false }: { p: Product; big?: boolean }) {
  const Icon = p.icon
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `radial-gradient(120% 120% at 70% 10%, ${p.swatch} 0%, #0c0c0e 78%)` }}>
      <Icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/15 transition-transform duration-500 group-hover:scale-110 ${big ? 'h-24 w-24' : 'h-16 w-16'}`} strokeWidth={1.25} aria-hidden="true" />
      <WeiderMark className="absolute bottom-3 left-4 text-sm text-white/65 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      {p.best && (
        <span className="absolute top-3 left-3 rounded-full bg-[#e11d48] px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-white uppercase">
          Mest selt
        </span>
      )}
    </div>
  )
}

function AddButton({ p, full = false }: { p: Product; full?: boolean }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const t = useRef<number>()
  useEffect(() => () => window.clearTimeout(t.current), [])
  const onAdd = () => {
    add(p)
    setAdded(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setAdded(false), 1400)
  }
  return (
    <button
      onClick={onAdd}
      aria-label={`Bæta ${p.name} í körfu`}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-bold tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5470] ${full ? 'w-full' : ''} ${added ? 'bg-white text-[#08080a]' : 'bg-[#e11d48] text-white hover:bg-[#c4163d]'}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> Bætt í körfu
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" aria-hidden="true" /> Bæta í körfu
        </>
      )}
    </button>
  )
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121214] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/40">
      <div className="aspect-square">
        <ProductArt p={p} />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: REDL }}>{p.cat}</p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300">
            <Star className="h-3.5 w-3.5 fill-current" style={{ color: REDL }} aria-hidden="true" />
            {p.rating}
            <span className="sr-only"> af 5 stjörnum</span>
          </span>
        </div>
        <h3 className="mt-1.5 text-base font-bold text-white md:text-lg">{p.name}</h3>
        <p className="mt-1 text-[13px] leading-snug text-zinc-400" lang="is">{p.variant}</p>
        <div className="mt-4 flex items-baseline gap-1.5">
          {p.from && <span className="font-mono text-[11px] text-zinc-400">frá</span>}
          <span className="text-xl font-extrabold text-white" lang="is">{isk(p.price)}</span>
        </div>
        <div className="mt-4">
          <AddButton p={p} full />
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── nav ────────────────────────────────── */
function CartButton() {
  const { count, setOpen } = useCart()
  return (
    <button
      onClick={() => setOpen(true)}
      className="pointer-events-auto relative inline-flex items-center gap-2 rounded-full bg-[#e11d48] px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#c4163d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={`Opna körfu, ${count} vörur`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Karfa</span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#08080a]"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function Nav({ active, onPick }: { active: string; onPick: (c: string) => void }) {
  const [menu, setMenu] = useState(false)
  const go = (cat: string) => {
    onPick(cat)
    setMenu(false)
    document.getElementById('vorur')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08080a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <a href="#top" aria-label="Weider — efst"><WeiderMark className="text-xl text-white md:text-2xl" /></a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Vöruflokkar">
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              onClick={() => go(c)}
              className={`font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${active === c ? 'text-[#ff5470]' : 'text-zinc-300 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
          <a href="#saga" className="font-mono text-[11px] tracking-[0.12em] text-zinc-300 uppercase transition-colors hover:text-white">Sagan</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <CartButton />
          <button onClick={() => setMenu(true)} className="inline-flex items-center justify-center rounded-full border border-white/20 p-2.5 text-white lg:hidden" aria-label="Opna valmynd">
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#08080a] lg:hidden" onClick={() => setMenu(false)}>
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto max-w-[1400px] px-5 pt-5 pb-8"
              aria-label="Valmynd"
            >
              <div className="flex items-center justify-between">
                <WeiderMark className="text-xl text-white" />
                <button onClick={() => setMenu(false)} className="rounded-full border border-white/20 p-2.5 text-white" aria-label="Loka valmynd"><X className="h-4 w-4" aria-hidden="true" /></button>
              </div>
              <div className="mt-8 flex flex-col gap-1">
                {CATEGORIES.slice(1).map((c) => (
                  <button key={c} onClick={() => go(c)} className="border-b border-white/10 py-4 text-left font-poster text-2xl tracking-tight text-white uppercase" lang="is">{c}</button>
                ))}
                <a href="#saga" onClick={() => setMenu(false)} className="border-b border-white/10 py-4 font-poster text-2xl tracking-tight text-white uppercase">Sagan</a>
                <a href="#hafa-samband" onClick={() => setMenu(false)} className="py-4 font-poster text-2xl tracking-tight text-white uppercase">Hafa samband</a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ───────────────────────── cart drawer ────────────────────────── */
function QtyStepper({ id, qty }: { id: string; qty: number }) {
  const { setQty } = useCart()
  return (
    <div className="inline-flex items-center rounded-full border border-white/15">
      <button onClick={() => setQty(id, qty - 1)} className="grid h-8 w-8 place-items-center text-zinc-300 transition-colors hover:text-white" aria-label="Fækka um einn"><Minus className="h-3.5 w-3.5" aria-hidden="true" /></button>
      <span className="w-7 text-center font-mono text-sm text-white" aria-live="polite">{qty}</span>
      <button onClick={() => setQty(id, qty + 1)} className="grid h-8 w-8 place-items-center text-zinc-300 transition-colors hover:text-white" aria-label="Fjölga um einn"><Plus className="h-3.5 w-3.5" aria-hidden="true" /></button>
    </div>
  )
}

function CartDrawer() {
  const { lines, subtotal, count, remove, open, setOpen } = useCart()
  const [checkoutNote, setCheckoutNote] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true">
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-[#0c0c0e] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Karfa"
            lang="is"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="flex items-center gap-2 font-poster text-xl tracking-tight text-white uppercase">
                <ShoppingBag className="h-5 w-5" style={{ color: REDL }} aria-hidden="true" /> Karfan {count > 0 && <span className="text-zinc-400">({count})</span>}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Loka körfu"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag className="h-10 w-10 text-zinc-600" aria-hidden="true" />
                <p className="text-zinc-400">Karfan er tóm.</p>
                <button onClick={() => setOpen(false)} className="rounded-full bg-[#e11d48] px-6 py-3 font-mono text-[11px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#c4163d]">Versla vörur</button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-4 py-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"><ProductArt p={l} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white">{l.name}</p>
                          <button onClick={() => remove(l.id)} className="shrink-0 text-zinc-500 transition-colors hover:text-white" aria-label={`Fjarlægja ${l.name}`}><X className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                        <p className="text-[12px] text-zinc-400" lang="is">{l.variant}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <QtyStepper id={l.id} qty={l.qty} />
                          <span className="font-bold text-white" lang="is">{isk(l.price * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/10 px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-zinc-400 uppercase">Samtals</span>
                    <span className="font-poster text-2xl tracking-tight text-white" lang="is">{isk(subtotal)}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-zinc-400 uppercase">Sending reiknuð við greiðslu · Dropp 1–2 dagar</p>
                  <button onClick={() => setCheckoutNote(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#e11d48] px-6 py-4 font-mono text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#c4163d]">
                    Áfram að greiðslu <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {checkoutNote && <p className="mt-3 text-center text-[12px] text-zinc-400">Þetta er frumgerð — greiðsluferli virkjast í fullri útgáfu.</p>}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── hero ───────────────────────────────── */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#08080a]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pt-14 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-8 md:pt-20 md:pb-24">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="font-mono text-[11px] tracking-[0.3em] text-zinc-300 uppercase">
            Weider<span style={{ color: REDL }}>®</span> — Síðan 1936
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-poster text-[2.7rem] leading-[1.04] tracking-normal text-white uppercase sm:text-6xl md:text-7xl"
            lang="is"
          >
            Næring fyrir<br /><span style={{ color: RED }}>alvöru árangur</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }} className="mt-6 max-w-md text-base leading-relaxed text-zinc-300 md:text-lg">
            Hágæða prótein, kreatín og bætiefni frá Weider — sent heim að dyrum um allt land með Dropp.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#vorur" className="group inline-flex items-center gap-2 rounded-full bg-[#e11d48] px-7 py-4 font-mono text-xs font-bold tracking-[0.12em] text-white uppercase transition-all hover:-translate-y-0.5 hover:bg-[#c4163d]">
              Versla vörur <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href="#mest-selt" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 font-mono text-xs font-bold tracking-[0.12em] text-white uppercase transition-colors hover:border-white/60">
              Sjá mest selt
            </a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.36 }} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-300">
            <li className="inline-flex items-center gap-2"><Award className="h-4 w-4" style={{ color: REDL }} aria-hidden="true" /> Síðan 1936</li>
            <li className="inline-flex items-center gap-2"><Globe className="h-4 w-4" style={{ color: REDL }} aria-hidden="true" /> Yfir 120 lönd</li>
            <li className="inline-flex items-center gap-2"><Truck className="h-4 w-4" style={{ color: REDL }} aria-hidden="true" /> Sent 1–2 daga</li>
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
            <Img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1280&auto=format&fit=crop"
              srcSet="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1280&auto=format&fit=crop 1280w"
              sizes="(min-width: 768px) 44vw, 100vw"
              alt="An athlete training hard in a dark gym"
              className="h-full w-full object-cover object-[60%_30%] grayscale contrast-110"
              loading="eager"
              fetchpriority="high"
              fallbackClassName="h-full w-full bg-[#1b1c20]"
            />
            <div className="absolute inset-0 mix-blend-color opacity-80" style={{ background: RED }} aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/70 via-transparent to-transparent" aria-hidden="true" />
            <span className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[0.2em] text-white/80 uppercase">We are bodybuilding</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── best sellers ───────────────────────── */
function BestSellers() {
  const best = PRODUCTS.filter((p) => p.best)
  return (
    <section id="mest-selt" className="scroll-mt-20 bg-[#08080a]">
      <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-6 md:px-8 md:pt-12">
        <Rise className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Mest selt</p>
            <h2 className="mt-1 font-poster text-3xl leading-[1.05] tracking-normal text-white uppercase md:text-4xl" lang="is">Vinsælasta næringin</h2>
          </div>
          <a href="#vorur" className="hidden shrink-0 font-mono text-[11px] tracking-[0.12em] text-zinc-300 uppercase hover:text-white sm:inline-flex sm:items-center sm:gap-1.5">Allar vörur <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
        </Rise>
      </div>
      {/* horizontal rail on mobile, grid on desktop */}
      <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-auto md:max-w-[1400px] md:grid md:grid-cols-4 md:overflow-visible md:px-8">
        {best.map((p) => (
          <div key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── shop (filter + grid) ───────────────── */
function Shop({ active, setActive }: { active: string; setActive: (c: string) => void }) {
  const reduce = useReducedMotion()
  const list = active === 'Allt' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active)
  return (
    <section id="vorur" className="scroll-mt-16 bg-[#08080a]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <Rise>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Vöruúrval</p>
          <h2 className="mt-1 font-poster text-4xl leading-[1.04] tracking-normal text-white uppercase md:text-6xl" lang="is">Allar vörur</h2>
        </Rise>

        {/* filter chips */}
        <div className="scrollbar-none mt-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Sía eftir flokki">
          {CATEGORIES.map((c) => {
            const on = active === c
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${on ? 'border-[#e11d48] bg-[#e11d48] text-white' : 'border-white/15 text-zinc-300 hover:border-white/40 hover:text-white'}`}
                lang="is"
              >
                {c}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
          >
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </motion.div>
        </AnimatePresence>
        <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-zinc-400 uppercase">Sýnishorn · verð og einkunnir til viðmiðunar</p>
      </div>
    </section>
  )
}

/* ───────────────────────── goal finder ────────────────────────── */
function GoalFinder({ setActive }: { setActive: (c: string) => void }) {
  const go = (cat: string) => {
    setActive(cat)
    document.getElementById('vorur')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <section className="border-y border-white/10 bg-[#0c0c0e]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <Rise>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Leiðarvísir</p>
          <h2 className="mt-1 font-poster text-3xl leading-[1.05] tracking-normal text-white uppercase md:text-5xl" lang="is">Finndu réttu vöruna</h2>
        </Rise>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g, i) => {
            const Icon = g.icon
            return (
              <Rise key={g.goal} delay={i * 0.05}>
                <button onClick={() => go(g.cat)} className="group flex h-full w-full flex-col rounded-2xl border border-white/10 bg-[#121214] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#e11d48]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5470]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#e11d48]/10 ring-1 ring-[#e11d48]/30" aria-hidden="true"><Icon className="h-5 w-5" style={{ color: REDL }} /></span>
                  <h3 className="mt-4 text-lg font-bold text-white" lang="is">{g.goal}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-400">{g.line}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: REDL }}>Skoða <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </button>
              </Rise>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── heritage + trust ───────────────────── */
function CountStat({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1000)
      setN(Math.round((1 - Math.pow(1 - k, 3)) * to))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to])
  return (
    <div ref={ref}>
      <p className="font-poster text-4xl leading-[1.05] tracking-normal md:text-6xl" style={{ color: RED }}>{n}{suffix}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-zinc-400 uppercase">{label}</p>
    </div>
  )
}

function Heritage() {
  return (
    <section id="saga" className="scroll-mt-16 bg-[#08080a]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <Rise className="order-2 md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
            <Img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1280&auto=format&fit=crop"
              alt="A muscular athlete training with weights in a dark gym"
              className="h-full w-full object-cover grayscale contrast-110"
              fallbackClassName="h-full w-full bg-[#1b1c20]"
            />
            <div className="absolute inset-0 mix-blend-color opacity-55" style={{ background: RED }} aria-hidden="true" />
            <span className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[0.2em] text-white/80 uppercase">Est. 1936</span>
          </div>
        </Rise>
        <div className="order-1 md:order-2">
          <Rise>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Sagan</p>
            <h2 className="mt-2 font-poster text-4xl leading-[1.02] tracking-normal text-white uppercase md:text-6xl" lang="is">We are bodybuilding</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
              Weider er upprunalega íþróttanæringin. Frá keppnisfólki á sviði til þeirra sem vilja einfaldlega líða betur, sama nafnið og sömu gæðin hafa staðið að baki í næstum níutíu ár.
            </p>
          </Rise>
          <Rise delay={0.1}>
            <div className="mt-9 grid grid-cols-3 gap-6 border-t border-white/10 pt-7">
              {STATS.map((s) => <CountStat key={s.label} {...s} />)}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── delivery / payment ─────────────────── */
function Delivery() {
  const items: { icon: LucideIcon; t: string; d: string }[] = [
    { icon: Truck, t: 'Sent með Dropp', d: 'Um allt land, oftast 1–2 virkir dagar.' },
    { icon: ShoppingBag, t: 'Frí sending', d: 'Í boði yfir völdu lágmarki.' },
    { icon: CreditCard, t: 'Öruggar greiðslur', d: 'Greitt með korti við afgreiðslu.' },
    { icon: ShieldCheck, t: 'Ekta Weider', d: 'Upprunalegar vörur, gæðaloforð Weider.' },
  ]
  return (
    <section id="afhending" className="border-t border-white/10 bg-[#0c0c0e]">
      <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden rounded-none px-0 md:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <div key={it.t} className="flex items-start gap-4 px-5 py-8 md:px-8">
              <Icon className="mt-0.5 h-6 w-6 shrink-0" style={{ color: REDL }} aria-hidden="true" />
              <div>
                <p className="font-bold text-white" lang="is">{it.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{it.d}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────── closing CTA ────────────────────────── */
function Closing() {
  const { setOpen } = useCart()
  return (
    <section id="hafa-samband" className="scroll-mt-16 bg-[#e11d48] text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-8 md:py-24">
        <Rise>
          <h2 className="mx-auto max-w-3xl font-poster text-4xl leading-[1.04] tracking-normal uppercase md:text-6xl" lang="is">Tilbúin að versla?</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white">
            Veldu vörurnar sem henta þér og fáðu þær sendar heim með Dropp, oftast á 1–2 virkum dögum.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#vorur" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-mono text-xs font-bold tracking-[0.12em] text-[#08080a] uppercase transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Versla vörur <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-8 py-4 font-mono text-xs font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Skoða körfu
            </button>
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-white uppercase">weidervorur@gmail.com · 770 0295 · Kópavogur</p>
        </Rise>
      </div>
    </section>
  )
}

/* ───────────────────────── page ──────────────────────────────── */
function Store() {
  const [active, setActive] = useState('Allt')
  useEffect(() => {
    document.title = 'Weider — Redesign Concept'
  }, [])
  return (
    <div className="min-h-screen bg-[#08080a] font-sans text-zinc-300 antialiased">
      <PreviewChrome company={company} />
      <Nav active={active} onPick={setActive} />
      <CartDrawer />
      <main>
        <Hero />
        <BestSellers />
        <Shop active={active} setActive={setActive} />
        <GoalFinder setActive={setActive} />
        <Heritage />
        <Delivery />
        <Closing />
      </main>
      <PreviewFooter company={company} />
    </div>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <Store />
    </CartProvider>
  )
}
