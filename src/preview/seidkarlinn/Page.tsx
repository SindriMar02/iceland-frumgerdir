import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import {
  ADDRESS,
  EMAIL,
  FACEBOOK,
  FACTS,
  GALDUR_TEAS,
  HERO,
  INSTAGRAM,
  LOGO,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRODUCTS,
  SHIPPING_THRESHOLD,
  STORE,
  STORY,
  getProduct,
  isk,
  productImg,
} from './data'
import type { Product, ProductCat } from './data'

const company = getPreviewCompany('seidkarlinn')

/* ── Galdraskráin — the sorcerer's price-sheet as a printed broadside.
      Built from THEIR assets: the boxed wordmark is the masthead, their
      white-background product photography sits on the paper as multiply-blend
      cutouts, and the motion identity is INSCRIPTION: rules draw themselves,
      staves self-inscribe, stamps thump. Ink on paper, one stamp red.
      No pills, no cards, no cream. ─────────────────────────────────────── */
const PAPER = '#F6F4EE'
const INK = '#151310'
const RED = '#9E2B20'
const HAIR = 'rgba(21,19,16,0.16)'
const HAIR_MID = 'rgba(21,19,16,0.4)'
const MUT = 'rgba(21,19,16,0.62)'
const PAPER_MUT = 'rgba(246,244,238,0.66)'

const DISPLAY = "'Oranienbaum', 'Times New Roman', serif"
const BODY = "'Source Serif 4', Georgia, serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const CSS = `
@keyframes gkIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.gk-in { opacity: 0; animation: gkIn .8s cubic-bezier(.22,.8,.3,1) forwards; }
/* THE PRESS PRINTS THE PAGE — a blank paper sheet with the ink bar riding its
   top edge slides down off the landing, printing the broadsheet in its wake.
   transform+opacity only, so it composites (and stays verifiable) everywhere.
   The product photos are not print: they drop onto the finished sheet after. */
@keyframes gkPress {
  0% { transform: translateY(0); opacity: 1; }
  96% { opacity: 1; }
  100% { transform: translateY(101%); opacity: 0; }
}
.gk-press-sheet { animation: gkPress 1.5s cubic-bezier(.6,.05,.4,.95) .15s forwards; }
@keyframes gkLay {
  0% { opacity: 0; transform: translateY(-32px) rotate(-3deg) scale(1.05); }
  55% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
.gk-laid { opacity: 0; animation: gkLay .7s cubic-bezier(.22,.8,.34,1.12) forwards; }
.gk-stave path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s cubic-bezier(.5,.05,.3,1); }
.gk-stave.inked path { stroke-dashoffset: 0; }
@keyframes gkStamp {
  0% { opacity: 0; transform: scale(1.7) rotate(-11deg); }
  62% { opacity: 1; transform: scale(.94) rotate(-3deg); }
  100% { opacity: 1; transform: scale(1) rotate(-4deg); }
}
.gk-stamped { animation: gkStamp .38s cubic-bezier(.2,1,.4,1) forwards; }
.gk-btn { transition: transform .14s ease, box-shadow .14s ease, background .2s ease, color .2s ease; }
.gk-btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--sh); }
.gk-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--sh); }
.gk-row { transition: background .25s ease; }
.gk-row:hover { background: rgba(21,19,16,0.035); }
.gk-row .gk-leader { transition: border-color .25s ease; }
.gk-row:hover .gk-leader { border-color: rgba(21,19,16,0.55); }
.gk-cut { transition: transform .4s cubic-bezier(.22,.8,.3,1); }
.gk-cut:hover { transform: rotate(0deg) scale(1.02); }
`

/* ── Hand-drawn staves in the style of the old Icelandic magical staves —
      original drawings (never claimed as historical), used as the catalogue's
      chapter marks. pathLength=1 lets CSS inscribe them. ─────────────────── */
const STAVE_PATHS: string[][] = [
  // 0 — hero stave (elaborate)
  [
    'M50 6 V94',
    'M26 26 H74',
    'M18 50 H82',
    'M26 74 H74',
    'M26 26 l-6 -7 M26 26 l-6 7 M74 26 l6 -7 M74 26 l6 7',
    'M18 50 l-7 -6 M18 50 l-7 6 M82 50 l7 -6 M82 50 l7 6',
    'M26 74 l-6 -7 M26 74 l-6 7 M74 74 l6 -7 M74 74 l6 7',
    'M50 6 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
    'M50 94 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
  ],
  // 1 — te
  ['M50 10 V90', 'M30 34 H70', 'M36 58 H64', 'M30 34 l-5 -6 M70 34 l5 -6', 'M50 90 l-8 -8 M50 90 l8 -8'],
  // 2 — hunang
  ['M50 10 V90', 'M28 40 H72', 'M28 40 l-5 6 M72 40 l5 6', 'M50 10 l-7 7 M50 10 l7 7', 'M40 68 h20 l-10 14 z'],
  // 3 — sveppir
  ['M50 12 V88', 'M32 30 H68', 'M26 52 H74', 'M32 74 H68', 'M50 12 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0'],
  // 4 — um / colophon
  ['M50 10 V90', 'M30 50 H70', 'M30 50 l-6 -6 M30 50 l-6 6 M70 50 l6 -6 M70 50 l6 6', 'M38 24 H62', 'M38 76 H62'],
  // 5 — búðin
  ['M50 10 V90', 'M28 32 H72', 'M28 66 H72', 'M28 32 l-5 -6 M72 32 l5 -6', 'M28 66 l-5 6 M72 66 l5 6', 'M42 48 h16'],
]

function Stave({ variant, inked, className, color = INK }: { variant: number; inked?: boolean; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`gk-stave ${inked ? 'inked' : ''} ${className ?? ''}`} aria-hidden="true">
      {STAVE_PATHS[variant].map((d, i) => (
        <path key={d} d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" pathLength={1} style={{ transitionDelay: `${i * 0.12}s` }} />
      ))}
    </svg>
  )
}

/** Rect-check on scroll + timed re-checks (IO + rAF stall in throttled tabs). */
function useInkOnView<T extends HTMLElement>(threshold = 0.8) {
  const ref = useRef<T>(null)
  const [inked, setInked] = useState(false)
  useEffect(() => {
    let done = false
    const check = () => {
      if (done) return
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * threshold && r.bottom > 0) {
        done = true
        setInked(true)
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
  }, [threshold])
  return { ref, inked }
}

function SectionHead({ roman, title, note, stave, inked, innerRef }: { roman: string; title: string; note?: string; stave: number; inked: boolean; innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef}>
      <div className="h-px w-full" style={{ background: INK }} />
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 pt-5 pb-8 md:px-8">
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="text-4xl leading-none md:text-6xl" style={{ fontFamily: DISPLAY }}>
            {roman}.
          </span>
          <h2 className="text-3xl leading-none tracking-tight md:text-5xl" style={{ fontFamily: DISPLAY }}>
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {note && (
            <p className="hidden text-[11px] tracking-[0.14em] uppercase md:block" style={{ fontFamily: MONO, color: MUT }}>
              {note}
            </p>
          )}
          <Stave variant={stave} inked={inked} className="h-10 w-10 md:h-12 md:w-12" />
        </div>
      </div>
    </div>
  )
}

interface CartItem {
  key: string
  name: string
  price: number
  qty: number
}

function StampButton({ added, onClick, label, dark, ariaLabel }: { added: boolean; onClick: () => void; label?: string; dark?: boolean; ariaLabel: string }) {
  const sh = dark ? PAPER : INK
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`gk-btn shrink-0 px-3.5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase ${added ? 'gk-stamped' : ''}`}
      style={{
        fontFamily: MONO,
        border: `1.5px solid ${dark ? PAPER : INK}`,
        boxShadow: `3px 3px 0 ${sh}`,
        background: added ? (dark ? PAPER : INK) : 'transparent',
        color: added ? (dark ? INK : PAPER) : dark ? PAPER : INK,
        outlineColor: dark ? PAPER : INK,
        ['--sh' as string]: sh,
      }}
    >
      {added ? 'Í körfunni' : (label ?? 'Í körfu')}
    </button>
  )
}

function LedgerRow({ nr, product, onAdd, added, dark }: { nr: string; product: Product; onAdd: () => void; added: boolean; dark?: boolean }) {
  return (
    <div className="gk-row flex items-center gap-3 border-b px-1 py-3 md:gap-5 md:px-2" style={{ borderColor: dark ? 'rgba(246,244,238,0.22)' : HAIR }}>
      <span className="w-7 shrink-0 text-[11px]" style={{ fontFamily: MONO, color: dark ? PAPER_MUT : MUT }}>
        {nr}
      </span>
      <span className={`grid h-14 w-14 shrink-0 place-items-center ${dark ? 'border' : ''}`} style={dark ? { background: '#fff', borderColor: 'rgba(246,244,238,0.4)' } : undefined}>
        <Img src={productImg(product.id)} alt={product.name} className="h-14 w-14 object-contain" fallbackClassName="opacity-0" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg leading-tight md:text-xl" style={{ fontFamily: DISPLAY, color: dark ? PAPER : INK }}>
          {product.name}
        </p>
        <p className="text-[10.5px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: dark ? PAPER_MUT : MUT }}>
          {product.format}
        </p>
      </div>
      <span className="gk-leader mx-1 hidden flex-1 border-b border-dotted sm:block" style={{ borderColor: dark ? 'rgba(246,244,238,0.35)' : 'rgba(21,19,16,0.3)' }} />
      <span className="ml-auto shrink-0 text-[15px] font-bold sm:ml-0" style={{ fontFamily: MONO, color: dark ? PAPER : INK }}>
        {isk(product.price)}
      </span>
      <StampButton added={added} onClick={onAdd} dark={dark} ariaLabel={`Bæta ${product.name} í körfu`} />
    </div>
  )
}

const FILTERS: { key: ProductCat | 'allt'; label: string }[] = [
  { key: 'allt', label: 'Allt' },
  { key: 'te', label: 'Te-galdrar' },
  { key: 'hunang', label: 'Hunang & frjó' },
  { key: 'sveppir', label: 'Sveppir' },
  { key: 'frost', label: 'Frostþurrkað' },
  { key: 'hud', label: 'Húð & hár' },
  { key: 'faeda', label: 'Fæðubót' },
]

const TEA_INTENT: Record<string, string> = {
  kvennagaldur: 'Fyrir konur',
  svefngaldur: 'Fyrir svefninn',
  draumagaldur: 'Fyrir nóttina',
  hjartagaldur: 'Fyrir ró',
  blodrugaldur: 'Fyrir jafnvægi',
}

export default function Page() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [filter, setFilter] = useState<ProductCat | 'allt'>('allt')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [checkoutNote, setCheckoutNote] = useState(false)
  const addedTimer = useRef<number>()

  const teaInk = useInkOnView<HTMLDivElement>()
  const ledgerInk = useInkOnView<HTMLDivElement>()
  const honeyInk = useInkOnView<HTMLDivElement>()
  const sveppirInk = useInkOnView<HTMLDivElement>()
  const umInk = useInkOnView<HTMLDivElement>()
  const budInk = useInkOnView<HTMLDivElement>()

  useEffect(() => {
    document.title = 'Seiðkarlinn · frumgerð að nýjum vef'
    setThemeColor(PAPER)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480)
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

  function addToCart(p: Product) {
    setCart((prev) => {
      const found = prev.find((i) => i.key === p.id)
      if (found) return prev.map((i) => (i.key === p.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { key: p.id, name: p.name, price: p.price, qty: 1 }]
    })
    setJustAdded(p.id)
    window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setJustAdded(null), 1600)
  }
  function removeFromCart(key: string) {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const cartLabel = `Karfa, ${cartCount} ${cartCount === 1 ? 'vara' : 'vörur'}`

  const filtered = filter === 'allt' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter)
  const nrOf = (p: Product) => String(PRODUCTS.indexOf(p) + 1).padStart(2, '0')

  const teas = GALDUR_TEAS
  const kvenna = teas[0]
  const honeyRows = [getProduct('villibloma')!, getProduct('hafjalla')!, getProduct('byflugnafrjo')!, getProduct('propolis')!]
  const tinctureRows = [getProduct('reishi')!, getProduct('chaga')!, getProduct('cordyceps')!, getProduct('lionsmane')!]

  return (
    <div lang="is" className="min-h-screen overflow-x-hidden antialiased" style={{ background: PAPER, color: INK, fontFamily: BODY }}>
      <style>{CSS}</style>

      {/* ── Slim bar, slides in once the masthead has scrolled away ──────── */}
      <header
        className="fixed inset-x-0 top-0 z-40 border-b transition-transform duration-300"
        style={{ background: PAPER, borderColor: INK, transform: scrolled ? 'translateY(0)' : 'translateY(-105%)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5 md:px-8">
          <a href="#top" aria-label="Efst á síðu">
            <img src={LOGO} alt="Seiðkarlinn" className="h-5 w-auto md:h-6" />
          </a>
          <nav className="hidden items-center gap-6 text-[11px] font-bold tracking-[0.14em] uppercase md:flex" style={{ fontFamily: MONO }}>
            <a href="#verdskra" className="hover:underline">
              Verðskráin
            </a>
            <a href="#hunang" className="hover:underline">
              Hunangið
            </a>
            <a href="#budin" className="hover:underline">
              Búðin
            </a>
          </nav>
          <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="border-[1.5px] px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase" style={{ fontFamily: MONO, borderColor: INK, color: INK, outlineColor: INK }}>
            Karfa <span style={{ color: RED }}>[{cartCount}]</span>
          </button>
        </div>
      </header>

      {/* ── Masthead + hero: printed by the roller in one sweep ──────────── */}
      <section id="top" className="relative overflow-hidden">
        <div>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex items-center justify-between gap-3 py-2.5 text-[10px] tracking-[0.16em] uppercase md:text-[11px]" style={{ fontFamily: MONO, color: MUT }}>
              <span>{HERO.datelineLeft}</span>
              <span className="hidden sm:inline">Galdraskrá · Nr. 1</span>
              <span>{HERO.datelineRight}</span>
            </div>
            <div className="h-px w-full" style={{ background: INK }} />
            <div className="flex justify-center py-7 md:py-9">
              <img src={LOGO} alt="Seiðkarlinn" className="h-10 w-auto md:h-14" />
            </div>
            <div className="h-[3px] w-full" style={{ background: INK }} />
          </div>

          {/* hero spread */}
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-10 pb-14 md:grid-cols-[7fr_5fr] md:gap-8 md:px-8 md:pt-14 md:pb-20">
            <div>
              <h1 className="text-[clamp(2.9rem,7.2vw,5.6rem)] leading-[1.02] tracking-tight text-balance" style={{ fontFamily: DISPLAY }}>
                {HERO.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: MUT }}>
                {HERO.sub}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#verdskra"
                  className="gk-btn px-6 py-3.5 text-[12px] font-bold tracking-[0.16em] uppercase"
                  style={{ fontFamily: MONO, background: RED, color: PAPER, border: `1.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`, outlineColor: INK, ['--sh' as string]: INK }}
                >
                  {HERO.ctaPrimary}
                </a>
                <a
                  href="#budin"
                  className="gk-btn px-6 py-3.5 text-[12px] font-bold tracking-[0.16em] uppercase"
                  style={{ fontFamily: MONO, color: INK, border: `1.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`, outlineColor: INK, ['--sh' as string]: INK }}
                >
                  {HERO.ctaSecondary}
                </a>
              </div>
              <p className="mt-8 text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                Frí sending á næstu DROPP stöð yfir {isk(SHIPPING_THRESHOLD)}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm md:max-w-none">
              <Stave variant={0} inked className="absolute inset-x-0 top-1/2 mx-auto h-[115%] w-auto -translate-y-1/2 opacity-[0.09]" />
              <div className="relative flex items-end justify-center">
                {/* photos are objects, not print: they land on the sheet after
                    the roller has passed (wrapper animates so the imgs keep
                    their resting rotation + hover transition) */}
                <div className={`relative z-10 -mr-10 ${reduce ? '' : 'gk-laid'}`} style={{ animationDelay: '1.72s' }}>
                  <Img src={productImg('villibloma')} alt="Hrátt Villiblóma Hunang í krukku, vörumynd Seiðkarlsins" className="gk-cut h-44 w-auto object-contain md:h-56" style={{ transform: 'rotate(3deg)' }} fallbackClassName="opacity-0" />
                </div>
                <div className={reduce ? undefined : 'gk-laid'} style={{ animationDelay: '1.58s' }}>
                  <Img src={productImg('kvennagaldur')} alt="Kvennagaldur te í kraftpappírspoka, vörumynd Seiðkarlsins" className="gk-cut h-72 w-auto object-contain md:h-96" style={{ transform: 'rotate(-2deg)' }} fetchpriority="high" fallbackClassName="opacity-0" />
                </div>
              </div>
              <div className="mt-6 border-t pt-3" style={{ borderColor: INK }}>
                <p className="text-[10.5px] leading-relaxed tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                  Mynd 1 — Kvennagaldur 100g · netla, hafrastrá, hindberjalauf · {isk(kvenna.price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* the blank sheet + ink bar that "prints" the section as it slides off */}
        {!reduce && (
          <div
            aria-hidden="true"
            className="gk-press-sheet pointer-events-none absolute inset-0 z-30"
            style={{ background: PAPER, borderTop: `5px solid ${INK}`, boxShadow: '0 -4px 14px rgba(21,19,16,0.28)' }}
          />
        )}
      </section>

      {/* ── I. Galdra-te — the specimen plate ────────────────────────────── */}
      <section className="scroll-mt-14">
        <SectionHead roman="I" title="Galdra-te" note="Fimm blöndur · 100g pokar" stave={1} inked={teaInk.inked} innerRef={teaInk.ref} />
        <div className="mx-auto max-w-6xl px-5 pb-6 md:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-5 md:gap-x-0 md:divide-x" style={{ ['--tw-divide-opacity' as string]: 1 }}>
            {teas.map((t, i) => {
              const p = getProduct(t.slug)!
              return (
                <div key={t.slug} className="flex flex-col items-center px-2 text-center md:px-5" style={{ borderColor: HAIR }}>
                  <Img src={productImg(t.slug)} alt={`${t.name}, kraftpappírspoki — vörumynd Seiðkarlsins`} className="gk-cut h-40 w-auto object-contain md:h-48" style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5][i]}deg)` }} fallbackClassName="opacity-0" />
                  <p className="mt-4 text-[10px] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                    {TEA_INTENT[t.slug]}
                  </p>
                  <h3 className="mt-1.5 text-2xl leading-none" style={{ fontFamily: DISPLAY }}>
                    {t.name}
                  </h3>
                  <p className="mt-2 text-[13px] font-bold" style={{ fontFamily: MONO }}>
                    {isk(t.price)}
                  </p>
                  <div className="mt-3">
                    <StampButton added={justAdded === t.slug} onClick={() => addToCart(p)} ariaLabel={`Bæta ${t.name} í körfu`} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-10 border-t py-3 text-center text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: MUT, borderColor: HAIR }}>
            Notkun — {kvenna.brew} · Innihald af vörusíðum Seiðkarlsins
          </p>
        </div>
      </section>

      {/* ── II. Verðskráin — the full ledger ─────────────────────────────── */}
      <section id="verdskra" className="scroll-mt-14">
        <SectionHead roman="II" title="Verðskráin" note={`${PRODUCTS.length} vörur skráðar`} stave={3} inked={ledgerInk.inked} innerRef={ledgerInk.ref} />
        <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-b pb-3" style={{ borderColor: INK }}>
            {FILTERS.map((f) => {
              const count = f.key === 'allt' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === f.key).length
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className="py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors"
                  style={{ fontFamily: MONO, color: active ? RED : MUT, boxShadow: active ? `0 2px 0 ${RED}` : 'none', outlineColor: INK }}
                >
                  {f.label} ({count})
                </button>
              )
            })}
          </div>
          <div key={filter}>
            {filtered.map((p, i) => (
              <div key={p.id} className="gk-in" style={{ animationDelay: `${Math.min(i * 0.045, 0.5)}s` }}>
                <LedgerRow nr={nrOf(p)} product={p} onAdd={() => addToCart(p)} added={justAdded === p.id} />
              </div>
            ))}
          </div>
          <p className="pt-4 text-[10.5px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
            Verð af vef Seiðkarlsins · sýnishorn, sjá fyrirvara neðst
          </p>
        </div>
      </section>

      {/* ── III. Hunangið ─────────────────────────────────────────────────── */}
      <section id="hunang" className="scroll-mt-14">
        <SectionHead roman="III" title="Hunangið" note="Hrátt og óunnið" stave={2} inked={honeyInk.inked} innerRef={honeyInk.ref} />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 md:grid-cols-[5fr_7fr] md:gap-14 md:px-8">
          <div className="relative mx-auto">
            <Img src={productImg('villibloma')} alt="Hrátt Villiblóma Hunang 1kg, krukka með striga yfir lokinu" className="gk-cut h-72 w-auto object-contain md:h-96" style={{ transform: 'rotate(-2deg)' }} fallbackClassName="opacity-0" />
          </div>
          <div>
            <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUT }}>
              Villiblóma, háfjalla og rósmarín, ásamt býflugnafrjói og propolis úr sama búi. Krukkurnar koma bundnar striga, eins og þær eiga að vera.
            </p>
            <div className="mt-6">
              {honeyRows.map((p) => (
                <LedgerRow key={p.id} nr={nrOf(p)} product={p} onAdd={() => addToCart(p)} added={justAdded === p.id} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IV. Sveppir & rætur — the ink page ───────────────────────────── */}
      <section className="scroll-mt-14" style={{ background: INK }}>
        <div ref={sveppirInk.ref}>
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 pt-6 pb-8 md:px-8">
            <div className="flex items-baseline gap-4 md:gap-6">
              <span className="text-4xl leading-none md:text-6xl" style={{ fontFamily: DISPLAY, color: PAPER }}>
                IV.
              </span>
              <h2 className="text-3xl leading-none tracking-tight md:text-5xl" style={{ fontFamily: DISPLAY, color: PAPER }}>
                Sveppir & rætur
              </h2>
            </div>
            <Stave variant={3} inked={sveppirInk.inked} className="h-10 w-10 md:h-12 md:w-12" color={PAPER} />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-6 md:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {tinctureRows.map((p) => (
              <figure key={p.id} className="border p-3" style={{ borderColor: 'rgba(246,244,238,0.35)', background: '#fff' }}>
                <Img src={productImg(p.id)} alt={`${p.name} — vörumynd Seiðkarlsins`} className="mx-auto h-40 w-auto object-contain md:h-48" fallbackClassName="opacity-0" />
                <figcaption className="mt-2 border-t pt-2 text-center text-[10px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: INK, borderColor: HAIR }}>
                  {p.name}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 pb-12">
            {tinctureRows.map((p) => (
              <LedgerRow key={p.id} nr={nrOf(p)} product={p} onAdd={() => addToCart(p)} added={justAdded === p.id} dark />
            ))}
            <p className="pt-4 text-[10.5px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: PAPER_MUT }}>
              Cordyfresh tinktúrur · dropar í drykkinn
            </p>
          </div>
        </div>
      </section>

      {/* ── V. Um Seiðkarlinn — the colophon ─────────────────────────────── */}
      <section id="um" className="scroll-mt-14">
        <SectionHead roman="V" title="Um Seiðkarlinn" note="Kólófón" stave={4} inked={umInk.inked} innerRef={umInk.ref} />
        <div className="mx-auto max-w-3xl px-5 pb-12 md:px-8">
          <p className="text-xl leading-relaxed md:text-2xl" style={{ fontFamily: BODY }}>
            <span className="float-left mt-1 mr-3 text-[4.6rem] leading-[0.78] md:text-[5.8rem]" style={{ fontFamily: DISPLAY, color: RED }} aria-hidden="true">
              S
            </span>
            <span className="sr-only">S</span>
            {STORY.body.slice(1)}
          </p>
          <div className="mt-10 grid grid-cols-3 border-y" style={{ borderColor: INK }}>
            {FACTS.map((f, i) => (
              <div key={f.small} className={`py-4 text-center ${i > 0 ? 'border-l' : ''}`} style={{ borderColor: HAIR }}>
                <p className="text-2xl md:text-3xl" style={{ fontFamily: DISPLAY }}>
                  {f.big}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                  {f.small}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VI. Búðin — the imprint ──────────────────────────────────────── */}
      <section id="budin" className="scroll-mt-14">
        <SectionHead roman="VI" title="Búðin í Faxafeni" note="Afgreiðsla & samband" stave={5} inked={budInk.inked} innerRef={budInk.ref} />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:grid-cols-2 md:gap-14 md:px-8">
          <div>
            <p className="max-w-md text-lg leading-relaxed" style={{ color: MUT }}>
              {STORE.body}
            </p>
            <div className="mt-7 space-y-3 text-[13px] tracking-[0.08em] uppercase" style={{ fontFamily: MONO }}>
              <p>
                <span style={{ color: MUT }}>Heimilisfang — </span>
                <a href={MAPS} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4" style={{ outlineColor: INK }}>
                  {ADDRESS.street}, {ADDRESS.town}
                </a>
              </p>
              <p>
                <span style={{ color: MUT }}>Sími — </span>
                <a href={PHONE_HREF} className="font-bold underline underline-offset-4" style={{ outlineColor: INK }}>
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <span style={{ color: MUT }}>Netfang — </span>
                <a href={`mailto:${EMAIL}`} className="font-bold underline underline-offset-4" style={{ outlineColor: INK }}>
                  {EMAIL}
                </a>
              </p>
              <p>
                <span style={{ color: MUT }}>Samfélag — </span>
                <a href={FACEBOOK} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4" style={{ outlineColor: INK }}>
                  Facebook
                </a>{' '}
                ·{' '}
                <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4" style={{ outlineColor: INK }}>
                  Instagram
                </a>
              </p>
            </div>
          </div>
          <div className="self-center border-[1.5px] border-dashed p-6 md:p-8" style={{ borderColor: INK }}>
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
              Afhendingarmiði
            </p>
            <p className="mt-3 text-2xl leading-snug" style={{ fontFamily: DISPLAY }}>
              Sæktu pöntunina í verslun
            </p>
            <p className="mt-2 text-[12px] leading-relaxed tracking-[0.08em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              Venjulega tilbúið á 24 klst · {ADDRESS.street}, {ADDRESS.town}
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing line ─────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="text-[clamp(1.6rem,4.2vw,2.8rem)] leading-[1.25] text-balance italic">„Það besta sem náttúran hefur upp á að bjóða.“</p>
          <p className="mt-3 text-[10.5px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
            Úr orðum Seiðkarlsins sjálfs
          </p>
          <a
            href="#verdskra"
            className="gk-btn mt-9 inline-block px-7 py-3.5 text-[12px] font-bold tracking-[0.16em] uppercase"
            style={{ fontFamily: MONO, background: INK, color: PAPER, border: `1.5px solid ${INK}`, boxShadow: `3px 3px 0 ${RED}`, outlineColor: INK, ['--sh' as string]: RED }}
          >
            Aftur í verðskrána
          </a>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky bar ────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-3 border-t-[1.5px] p-3 md:hidden" style={{ background: PAPER, borderColor: INK }}>
        <a href="#verdskra" className="flex flex-1 items-center justify-center py-3 text-[12px] font-bold tracking-[0.16em] uppercase" style={{ fontFamily: MONO, background: INK, color: PAPER, outlineColor: INK }}>
          Verðskráin
        </a>
        <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="border-[1.5px] px-4 text-[12px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: MONO, borderColor: INK, color: INK, outlineColor: INK }}>
          [{cartCount}]
        </button>
      </div>

      {/* ── Pöntunarseðill — the order slip ──────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Pöntunarseðill"
              className="fixed inset-y-0 right-0 z-[75] flex w-full max-w-sm flex-col border-l-2 border-dashed"
              style={{ background: PAPER, borderColor: INK }}
              initial={{ x: reduce ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b-2 p-5" style={{ borderColor: INK }}>
                <h2 className="text-[13px] font-bold tracking-[0.22em] uppercase" style={{ fontFamily: MONO }}>
                  Pöntunarseðill
                </h2>
                <button onClick={() => setCartOpen(false)} aria-label="Loka körfu" className="p-1.5" style={{ color: INK, outlineColor: INK }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <p className="text-[12px] leading-relaxed tracking-[0.06em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                    Seðillinn er auður. Byrjaðu á galdra-teinu eða hunanginu.
                  </p>
                ) : (
                  <ul>
                    {cart.map((item) => (
                      <li key={item.key} className="flex items-baseline gap-2 border-b border-dotted py-3" style={{ borderColor: HAIR_MID }}>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold tracking-[0.04em] uppercase" style={{ fontFamily: MONO }}>
                            {item.name}
                          </p>
                          <p className="text-[11px]" style={{ fontFamily: MONO, color: MUT }}>
                            {item.qty} × {isk(item.price)}
                          </p>
                        </div>
                        <span className="ml-auto text-[13px] font-bold" style={{ fontFamily: MONO }}>
                          {isk(item.qty * item.price)}
                        </span>
                        <button onClick={() => removeFromCart(item.key)} aria-label={`Fjarlægja ${item.name}`} className="text-[11px] underline underline-offset-2" style={{ fontFamily: MONO, color: RED, outlineColor: INK }}>
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t-4 border-double p-5" style={{ borderColor: INK }}>
                  <div className="flex items-center justify-between text-[14px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: MONO }}>
                    <span>Samtals</span>
                    <span>{isk(cartTotal)}</span>
                  </div>
                  <button
                    onClick={() => setCheckoutNote(true)}
                    className="gk-btn mt-4 w-full py-3.5 text-[12px] font-bold tracking-[0.18em] uppercase"
                    style={{ fontFamily: MONO, background: RED, color: PAPER, border: `1.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`, outlineColor: INK, ['--sh' as string]: INK }}
                  >
                    Ganga frá pöntun
                  </button>
                  {checkoutNote && (
                    <p className="mt-3 text-[11px] leading-relaxed" style={{ fontFamily: MONO, color: MUT }}>
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
