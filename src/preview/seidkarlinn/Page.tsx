import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Facebook, Instagram, Mail, MapPin, Phone, Send, ShoppingBag, Sparkles, X } from 'lucide-react'
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
  IMG,
  INSTAGRAM,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRODUCTS,
  SHIPPING_THRESHOLD,
  STORE,
  STORY,
  isk,
  u,
} from './data'
import type { Product, ProductCat } from './data'
import { SUGGESTIONS, ask, greeting } from './oracle'

const company = getPreviewCompany('seidkarlinn')

/* ── Seiðkarlinn — "Talaðu við Seiðkarlinn". You arrive not on a product grid
      but in a candlelit conversation with the sorcerer, who reads what ails you
      and prescribes from the shelf. Warm parchment + iron-ink + one rust + one
      honey-amber; folk-manuscript craft, never tarot kitsch. ─────────────── */
const PAPER = '#F3ECDD'
const PAPER_SOFT = '#EDE3CE'
const INK = '#241C13'
const MUT = '#5B4E3C'
const HAIR = 'rgba(36,28,19,0.14)'
const HAIR_HI = 'rgba(36,28,19,0.24)'
const RUST = '#9C4A1F'
const HONEY_GOLD = '#C98A2A'
const MOSS = '#3F4A32'
const BG_DARK = '#17110B' // warm candlelit near-black
const PAPER_ON_DARK = 'rgba(243,236,221,0.86)'
const MUT_ON_DARK = 'rgba(243,236,221,0.6)'

const DISPLAY = "'Gloock', Georgia, serif"
const SERIF = "'Spectral', Georgia, serif" // the sorcerer's manuscript voice
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, 'SFMono-Regular', monospace"

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

function srcset(url: string) {
  return `${u(url, 828)} 828w, ${u(url, 1280)} 1280w, ${u(url, 2000)} 2000w`
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

const CAT_ICON: Record<ProductCat, IconT> = {
  te: IconLeaf,
  hunang: IconDroplet,
  sveppir: IconMushroom,
  frost: IconSnow,
  hud: IconDroplet,
  faeda: IconCapsule,
}
/* ── The sorcerer's sigil — a hand-drawn galdrastafur that breathes while he
      is present. Reduced-motion holds it still. ─────────────────────────── */
function SorcererSigil({ speaking, reduce }: { speaking: boolean; reduce: boolean | null }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden="true"
      animate={reduce ? undefined : { scale: speaking ? [1, 1.05, 1] : [1, 1.02, 1], opacity: speaking ? [0.9, 1, 0.9] : [0.75, 0.85, 0.75] }}
      transition={{ duration: speaking ? 1.6 : 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <g fill="none" stroke={HONEY_GOLD} strokeWidth="1.4" strokeLinecap="round">
        <circle cx="50" cy="50" r="30" opacity="0.5" />
        <circle cx="50" cy="50" r="21" opacity="0.35" />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r1 = 8
          const r2 = 30
          const rad = (a * Math.PI) / 180
          return (
            <g key={a}>
              <line x1={50 + r1 * Math.cos(rad)} y1={50 + r1 * Math.sin(rad)} x2={50 + r2 * Math.cos(rad)} y2={50 + r2 * Math.sin(rad)} />
              <path d={`M${50 + r2 * Math.cos(rad)} ${50 + r2 * Math.sin(rad)} l${4 * Math.cos(rad + 0.6)} ${4 * Math.sin(rad + 0.6)}`} />
              <path d={`M${50 + r2 * Math.cos(rad)} ${50 + r2 * Math.sin(rad)} l${4 * Math.cos(rad - 0.6)} ${4 * Math.sin(rad - 0.6)}`} />
            </g>
          )
        })}
        <circle cx="50" cy="50" r="4" fill={HONEY_GOLD} stroke="none" opacity="0.9" />
      </g>
    </motion.svg>
  )
}

/* ── Typewriter reveal — setTimeout-driven (rAF is throttled in the preview),
      with a failsafe that lands the full text and click-to-skip. ────────── */
function StreamedText({ text, stream, onTick, onDone }: { text: string; stream: boolean; onTick?: () => void; onDone?: () => void }) {
  const [shown, setShown] = useState(stream ? '' : text)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!stream) {
      setShown(text)
      return
    }
    let i = 0
    let alive = true
    let timer: number | undefined
    const tick = () => {
      if (!alive) return
      i += 2
      setShown(text.slice(0, i))
      onTick?.()
      if (i < text.length) {
        timer = window.setTimeout(tick, 16)
      } else if (!doneRef.current) {
        doneRef.current = true
        onDone?.()
      }
    }
    timer = window.setTimeout(tick, 16)
    // Failsafe: if the incremental loop is throttled, land the full text.
    const failsafe = window.setTimeout(() => {
      if (!alive) return
      setShown(text)
      if (!doneRef.current) {
        doneRef.current = true
        onDone?.()
      }
    }, text.length * 16 + 900)
    return () => {
      alive = false
      window.clearTimeout(timer)
      window.clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, stream])

  return (
    <span
      onClick={() => {
        setShown(text)
        if (!doneRef.current) {
          doneRef.current = true
          onDone?.()
        }
      }}
    >
      {shown}
    </span>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Seiðkarlinn skrifar">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: HONEY_GOLD }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  )
}

function PrescriptionCard({ product, onAdd, added }: { product: Product; onAdd: () => void; added: boolean }) {
  const Icon = CAT_ICON[product.cat]
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,138,42,0.35)', background: 'rgba(243,236,221,0.06)' }}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: 'rgba(201,138,42,0.16)', color: HONEY_GOLD }}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" style={{ color: PAPER, fontFamily: BODY }}>
          {product.name}
        </p>
        <p className="text-xs" style={{ color: MUT_ON_DARK, fontFamily: MONO }}>
          {product.format} · {isk(product.price)}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
        style={{ background: added ? MOSS : HONEY_GOLD, color: added ? PAPER : INK, fontFamily: BODY, outlineColor: HONEY_GOLD }}
      >
        {added ? 'Bætt við ✓' : 'Bæta í körfu'}
      </button>
    </div>
  )
}

interface CartItem {
  key: string
  name: string
  price: number
  qty: number
}
interface Msg {
  id: number
  from: 'seid' | 'you'
  text: string
  product?: Product
  stream: boolean
}

function ProductCard({ product, onAdd, added }: { product: Product; onAdd: () => void; added: boolean }) {
  const Icon = CAT_ICON[product.cat]
  return (
    <div className="flex flex-col justify-between rounded-2xl border p-5 transition-shadow hover:shadow-[0_18px_36px_-24px_rgba(36,28,19,0.35)]" style={{ borderColor: HAIR, background: '#FBF6EB' }}>
      <div>
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: 'rgba(156,74,31,0.1)', color: RUST }}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="mt-3 text-xl leading-tight" style={{ fontFamily: DISPLAY, color: INK }}>
          {product.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: MUT }}>
          {product.format}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: HAIR }}>
        <span className="text-sm font-semibold" style={{ fontFamily: MONO, color: INK }}>
          {isk(product.price)}
        </span>
        <button onClick={onAdd} aria-label={`Bæta ${product.name} í körfu`} className="rounded-full px-3.5 py-2 text-xs font-semibold transition-colors" style={{ background: added ? MOSS : INK, color: PAPER, fontFamily: BODY, outlineColor: INK }}>
          {added ? 'Bætt við' : 'Bæta í körfu'}
        </button>
      </div>
    </div>
  )
}

/** Draw the sorcerer's counsel as a shareable "seðill" (prescription) poster. */
function drawSedill(canvas: HTMLCanvasElement, counsel: string, product: Product | undefined, dateStr: string) {
  const W = 1080
  const H = 1350
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // parchment
  ctx.fillStyle = '#F3ECDD'
  ctx.fillRect(0, 0, W, H)
  // vignette
  const grd = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75)
  grd.addColorStop(0, 'rgba(0,0,0,0)')
  grd.addColorStop(1, 'rgba(60,40,20,0.14)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)
  // border
  ctx.strokeStyle = 'rgba(36,28,19,0.28)'
  ctx.lineWidth = 3
  ctx.strokeRect(60, 60, W - 120, H - 120)

  const cx = W / 2
  ctx.textAlign = 'center'

  // header
  ctx.fillStyle = '#9C4A1F'
  ctx.font = '600 26px Georgia'
  ctx.fillText('R Á Ð   S E I Ð K A R L S I N S', cx, 170)

  // sigil ring
  ctx.strokeStyle = '#C98A2A'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, 250, 34, 0, Math.PI * 2)
  ctx.stroke()
  for (let a = 0; a < 360; a += 60) {
    const rad = (a * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(cx + 10 * Math.cos(rad), 250 + 10 * Math.sin(rad))
    ctx.lineTo(cx + 34 * Math.cos(rad), 250 + 34 * Math.sin(rad))
    ctx.stroke()
  }

  // counsel (word-wrapped serif)
  ctx.fillStyle = '#241C13'
  ctx.font = 'italic 38px Georgia'
  const words = counsel.split(' ')
  const maxW = W - 260
  let line = ''
  let y = 380
  const lh = 54
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, cx, y)
      line = w
      y += lh
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, cx, y)

  // divider
  y += 70
  ctx.strokeStyle = 'rgba(36,28,19,0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 120, y)
  ctx.lineTo(cx + 120, y)
  ctx.stroke()

  // prescription
  if (product) {
    y += 70
    ctx.fillStyle = '#5B4E3C'
    ctx.font = '600 22px Georgia'
    ctx.fillText('G A L D U R I N N   Þ I N N', cx, y)
    y += 58
    ctx.fillStyle = '#241C13'
    ctx.font = '600 44px Georgia'
    ctx.fillText(product.name, cx, y)
    y += 46
    ctx.fillStyle = '#9C4A1F'
    ctx.font = '400 26px Georgia'
    ctx.fillText(`${product.format} · ${isk(product.price)}`, cx, y)
  }

  // footer
  ctx.fillStyle = '#5B4E3C'
  ctx.font = '400 22px Georgia'
  ctx.fillText(dateStr, cx, H - 190)
  ctx.fillStyle = '#241C13'
  ctx.font = '600 30px Georgia'
  ctx.fillText('Seiðkarlinn', cx, H - 145)
  ctx.fillStyle = '#5B4E3C'
  ctx.font = '400 20px Georgia'
  ctx.fillText('seidkarlinn.is · Faxafen 14, Reykjavík', cx, H - 112)
  ctx.font = 'italic 18px Georgia'
  ctx.fillText('Frumgerð — til gamans, ekki læknisráð', cx, H - 84)
}

export default function Page() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [pending, setPending] = useState(false)
  const [input, setInput] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [checkoutNote, setCheckoutNote] = useState(false)
  const [lastRx, setLastRx] = useState<{ counsel: string; product?: Product } | null>(null)

  const seedRef = useRef(0)
  const idRef = useRef(0)
  const seededRef = useRef(false)
  const pendTimer = useRef<number>()
  const addedTimer = useRef<number>()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Seiðkarlinn — talaðu við galdramanninn'
    setThemeColor(BG_DARK)
  }, [])

  // Greeting, coloured by the real hour of day (once).
  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    const hour = new Date().getHours()
    setMessages([{ id: idRef.current++, from: 'seid', text: greeting(hour), stream: true }])
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(pendTimer.current)
      window.clearTimeout(addedTimer.current)
    },
    [],
  )

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

  const scrollToBottom = () => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }
  useLayoutEffect(scrollToBottom, [messages, pending])

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || pending) return
    setInput('')
    setMessages((m) => [...m, { id: idRef.current++, from: 'you', text: trimmed, stream: false }])
    setPending(true)
    window.clearTimeout(pendTimer.current)
    pendTimer.current = window.setTimeout(() => {
      const reply = ask(trimmed, seedRef.current++)
      setMessages((m) => [...m, { id: idRef.current++, from: 'seid', text: reply.text, product: reply.product, stream: true }])
      if (reply.product) setLastRx({ counsel: reply.text, product: reply.product })
      setPending(false)
    }, 850)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

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

  function saveSedill() {
    if (!lastRx) return
    const canvas = document.createElement('canvas')
    const dateStr = new Date().toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' })
    drawSedill(canvas, lastRx.counsel, lastRx.product, dateStr)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'rad-seidkarlsins.png'
    a.click()
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const cartLabel = `Karfa, ${cartCount} ${cartCount === 1 ? 'vara' : 'vörur'}`
  const speaking = pending || messages[messages.length - 1]?.from === 'seid'

  const shopProducts = PRODUCTS.slice(0, 8)

  return (
    <div lang="is" className="min-h-screen overflow-x-hidden antialiased" style={{ background: PAPER, color: INK, fontFamily: BODY }}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 transition-colors duration-300" style={{ background: scrolled ? PAPER : 'transparent', borderBottom: `1px solid ${scrolled ? HAIR : 'transparent'}` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="inline-flex items-center border-2 px-3 py-1.5 transition-colors" style={{ borderColor: scrolled ? INK : PAPER, color: scrolled ? INK : PAPER }}>
            <span className="text-base tracking-[0.06em] uppercase" style={{ fontFamily: DISPLAY }}>
              Seiðkarlinn
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: scrolled ? INK : PAPER }}>
            <a href="#seidur" className="transition-opacity hover:opacity-70">
              Seiðkarlinn
            </a>
            <a href="#budin" className="transition-opacity hover:opacity-70">
              Búðin
            </a>
            <a href="#verslunin" className="transition-opacity hover:opacity-70">
              Verslunin
            </a>
          </nav>
          <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="relative grid h-11 w-11 place-items-center rounded-full transition-colors" style={{ color: scrolled ? INK : PAPER }}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] font-bold" style={{ background: RUST, color: PAPER }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── The conversation — the whole front door ──────────────────────── */}
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-24 pb-14 md:px-8" style={{ background: BG_DARK }}>
        <Img src={u(IMG.hero, 2000)} srcSet={srcset(IMG.hero)} sizes="100vw" fetchpriority="high" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" fallbackClassName="bg-gradient-to-br from-[#3a2f22] to-[#120d08]" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 50% 8%, rgba(201,138,42,0.14), transparent 55%), linear-gradient(180deg, ${BG_DARK}f2, ${BG_DARK}fa 55%, ${BG_DARK})` }} />

        <div id="seidur" className="relative z-10 mx-auto w-full max-w-2xl scroll-mt-24">
          {/* the sorcerer */}
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 md:h-24 md:w-24">
              <SorcererSigil speaking={speaking} reduce={reduce} />
            </div>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ fontFamily: MONO, color: HONEY_GOLD }}>
              Talaðu við Seiðkarlinn
            </p>
            <h1 className="mt-3 text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.1]" style={{ fontFamily: DISPLAY, color: PAPER }}>
              Segðu mér hvað þig vantar.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: MUT_ON_DARK }}>
              Gamli galdramaðurinn les úr því sem þjakar þig og réttir þér rétta jurt af hillunni. Byrjaðu á orði hér að neðan eða skrifaðu honum.
            </p>
          </div>

          {/* the scroll of conversation */}
          <div
            ref={scrollRef}
            className="mt-7 max-h-[46vh] min-h-[220px] overflow-y-auto rounded-3xl border p-4 md:max-h-[42vh] md:p-6"
            style={{ borderColor: 'rgba(243,236,221,0.14)', background: 'rgba(243,236,221,0.04)', backdropFilter: 'blur(4px)' }}
            aria-live="polite"
          >
            <div className="space-y-4">
              {messages.map((m, i) =>
                m.from === 'seid' ? (
                  <div key={m.id} className="flex gap-3">
                    <span className="mt-1 h-7 w-7 shrink-0 opacity-90">
                      <SorcererSigil speaking={false} reduce={reduce} />
                    </span>
                    <div className="min-w-0">
                      <div className="rounded-2xl rounded-tl-md px-4 py-3" style={{ background: PAPER, color: INK }}>
                        <p className="text-[15px] leading-relaxed" style={{ fontFamily: SERIF }}>
                          <StreamedText text={m.text} stream={m.stream && i === messages.length - 1} onTick={scrollToBottom} onDone={scrollToBottom} />
                        </p>
                      </div>
                      {m.product && <PrescriptionCard product={m.product} onAdd={() => addToCart(m.product!.id, m.product!.name, m.product!.price)} added={justAdded === m.product.id} />}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5" style={{ background: 'rgba(201,138,42,0.16)', color: PAPER }}>
                      <p className="text-[15px] leading-relaxed" style={{ fontFamily: BODY }}>
                        {m.text}
                      </p>
                    </div>
                  </div>
                ),
              )}
              {pending && (
                <div className="flex gap-3">
                  <span className="mt-1 h-7 w-7 shrink-0 opacity-90">
                    <SorcererSigil speaking reduce={reduce} />
                  </span>
                  <div className="rounded-2xl rounded-tl-md px-4 py-3.5" style={{ background: PAPER }}>
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* suggestion chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.send)}
                disabled={pending}
                className="rounded-full border px-3.5 py-1.5 text-[13px] transition-colors disabled:opacity-50"
                style={{ borderColor: 'rgba(243,236,221,0.22)', color: PAPER_ON_DARK, fontFamily: BODY, outlineColor: HONEY_GOLD }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* the input */}
          <form onSubmit={onSubmit} className="mt-4 flex items-center gap-2 rounded-full border p-1.5 pl-5" style={{ borderColor: 'rgba(243,236,221,0.24)', background: 'rgba(243,236,221,0.05)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skrifaðu Seiðkarlinum…"
              aria-label="Skrifaðu Seiðkarlinum"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:opacity-50"
              style={{ color: PAPER, fontFamily: BODY }}
            />
            <button type="submit" disabled={pending || !input.trim()} aria-label="Senda" className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 disabled:opacity-40" style={{ background: HONEY_GOLD, color: INK, outlineColor: HONEY_GOLD }}>
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* honest frame + share */}
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-center text-[11px] leading-relaxed sm:text-left" style={{ color: 'rgba(243,236,221,0.4)' }}>
              Seiðkarlinn er til gamans — hann er enginn læknir. Í frumgerð svarar hann eftir orðum þínum; í raun myndi mál­líkan svara öllu.
            </p>
            {lastRx && (
              <button onClick={saveSedill} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors" style={{ borderColor: 'rgba(201,138,42,0.5)', color: HONEY_GOLD, fontFamily: BODY, outlineColor: HONEY_GOLD }}>
                <Sparkles className="h-3.5 w-3.5" /> Vista ráðið hans
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Who is the Seiðkarl ──────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-24" style={{ background: PAPER_SOFT }}>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[28px]" style={{ boxShadow: '0 30px 60px -30px rgba(36,28,19,0.35)' }}>
              <Img src={u(IMG.jars, 1200)} srcSet={srcset(IMG.jars)} sizes="(min-width: 768px) 50vw, 100vw" alt="Þurrkaðar jurtir og blóm í opnum glerkrukkum á tréborði" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
              {STORY.eyebrow}
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
              Nafnið er ekki tilviljun
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: MUT }}>
              „Seiður“ var galdur til forna — og teið okkar heitir enn eftir honum: Svefngaldur, Draumagaldur, Hjartagaldur. {STORY.body}
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

      {/* ── The shop ─────────────────────────────────────────────────────── */}
      <section id="budin" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RUST }}>
                  Á hillunni
                </p>
                <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)]" style={{ fontFamily: DISPLAY, color: INK }}>
                  Eða veldu sjálf
                </h2>
              </div>
              <a href="#kaflar" className="text-sm font-semibold underline underline-offset-4">
                Sjá alla kafla →
              </a>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {shopProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProductCard product={p} onAdd={() => addToCart(p.id, p.name, p.price)} added={justAdded === p.id} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Honeycomb chapters ───────────────────────────────────────────── */}
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
              const Icon = CAT_ICON[(['te', 'hunang', 'sveppir', 'frost', 'hud', 'faeda'] as ProductCat[])[i] ?? 'te']
              return (
                <Reveal key={c.key} delay={i * 0.06}>
                  <div className="group flex flex-col items-center text-center">
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
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Store ────────────────────────────────────────────────────────── */}
      <section id="verslunin" className="relative scroll-mt-20 overflow-hidden px-5 py-20 md:px-8 md:py-28" style={{ background: BG_DARK }}>
        <Img src={u(IMG.shelf, 1600)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${BG_DARK} 25%, rgba(23,17,11,0.7))` }} />
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
              <a href={MAPS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ background: PAPER, color: INK, outlineColor: PAPER }}>
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
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: 'rgba(243,236,221,0.97)', backdropFilter: 'blur(10px)', borderColor: HAIR }}>
        <a href="#seidur" className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-semibold" style={{ background: INK, color: PAPER }}>
          <Sparkles className="h-4 w-4" /> Talaðu við Seiðkarlinn
        </a>
        <button onClick={() => setCartOpen(true)} aria-label={cartLabel} className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border" style={{ borderColor: HAIR_HI, color: INK }}>
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
              initial={{ x: reduce ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : '100%' }}
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
                    Karfan er tóm. Spurðu Seiðkarlinn ráða, eða veldu af hillunni.
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
