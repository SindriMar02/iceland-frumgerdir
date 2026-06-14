import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  Clock,
  Leaf,
  MapPin,
  MousePointerClick,
  Phone,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { DYES, HERO_ID, MARKS, STUDIO, YARNS } from './data'
import type { DyeColour, Yarn } from './data'

const company = getPreviewCompany('hespa')

const Q = '&auto=format&fit=crop'
const HERO = `https://images.unsplash.com/${HERO_ID}`

const INK = '#2b2620'
const CREAM = '#efe7d6'

/* ── Motion language: DYE-VAT BLOOM ──────────────────────────────────
   Colour that seeps and sets, never slides. Where the siblings share a
   fade-up-on-scroll vocabulary, Hespa develops its COLOUR: text barely
   settles (8px), while accent rules and swatch fills BLEED in across one
   edge. The signature is the "vat dip" — choosing a swatch drives the dye
   into --accent and washes a colour bloom across the page. All ease-out
   colour/opacity, calm 0.5–0.9s, faint stagger. No spring, no slide. ── */

const BLOOM = [0.16, 0.84, 0.34, 1] as const // soft ease-out, like dye soaking
const DIP = [0.22, 0.9, 0.3, 1] as const

/** Whisper-soft settle — body content barely moves; colour is the star. */
function Settle({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -6% 0px' }}
      transition={{ duration: 0.7, ease: BLOOM, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A colour rule that DEVELOPS: instead of the generic scaleX wipe the
 * siblings use, the dye "bleeds" in from the left via a clip-path reveal
 * over a soft gradient, so the colour appears to soak across the line.
 */
function DyeBleed({ color, delay = 0 }: { color: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative block h-[3px] w-full overflow-hidden rounded-full" aria-hidden="true">
      {/* faint ground so the line has presence before it develops */}
      <span
        className="absolute inset-0 rounded-full opacity-30"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }}
        initial={reduce ? { clipPath: 'inset(0 0 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: BLOOM, delay }}
      />
    </span>
  )
}

/* ── Colour-field skein card (no stock photo, so no reuse) ──────────── */

/** Builds an honest woven colour field from the dye's own hex. */
function skeinStyle(hex: string, wind: Yarn['wind'], cream: string): CSSProperties {
  const top = wind === 'deep' ? 0.96 : 0.82
  const bot = wind === 'deep' ? 0.74 : 0.52
  // Diagonal "wound" hatching + a soft top-light, layered over the dye.
  return {
    backgroundColor: hex,
    backgroundImage: [
      `repeating-linear-gradient(118deg, rgba(255,255,255,0.14) 0 2px, rgba(255,255,255,0) 2px 9px)`,
      `repeating-linear-gradient(118deg, rgba(0,0,0,0.10) 0 1px, rgba(0,0,0,0) 1px 11px)`,
      `radial-gradient(120% 90% at 28% 18%, ${cream}55 0%, ${cream}00 46%)`,
      `linear-gradient(155deg, ${shade(hex, top)} 0%, ${shade(hex, bot)} 100%)`,
    ].join(', '),
  }
}

/** Mix a hex toward black by amount (0..1 keeps colour, lower = darker). */
function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '')
  const r = Math.round(parseInt(h.slice(0, 2), 16) * amt)
  const g = Math.round(parseInt(h.slice(2, 4), 16) * amt)
  const b = Math.round(parseInt(h.slice(4, 6), 16) * amt)
  return `rgb(${r},${g},${b})`
}

export default function Page() {
  const reduce = useReducedMotion()

  // The signature: which natural-dye colour is currently selected.
  const [active, setActive] = useState(DYES[0].id)
  const dye = DYES.find((d) => d.id === active) ?? DYES[0]

  // Cart: optimistic count so the "keep the sale on-site" promise is felt.
  const [cart, setCart] = useState(0)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  // Where the swatch bloom radiates from (relative to the feature panel).
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  // A monotonically rising key so AnimatePresence runs the wash on each dip.
  const dipKey = useRef(0)

  useEffect(() => {
    document.title = 'Hespa — Litir landsins (hugmynd)'
  }, [])

  // Auto-cycle ONCE on load (reduced-motion-safe) so first-time visitors
  // see the page take a colour before they ever scroll — teaches the signature.
  useEffect(() => {
    if (reduce) return
    const t = window.setTimeout(() => {
      dipKey.current += 1
      setActive(DYES[1].id)
    }, 1200)
    const t2 = window.setTimeout(() => {
      dipKey.current += 1
      setActive(DYES[0].id)
    }, 2400)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [reduce])

  /** Select a dye + capture the click origin so the wash radiates from it. */
  const dip = (d: DyeColour, e?: { clientX: number; clientY: number }) => {
    const panel = document.getElementById('dye-panel-media')
    if (e && panel) {
      const r = panel.getBoundingClientRect()
      setOrigin({
        x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
        y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
      })
    } else {
      setOrigin({ x: 50, y: 50 })
    }
    dipKey.current += 1
    setActive(d.id)
  }

  // Add to cart — optimistic, with a brief per-button confirmation.
  const addToCart = (y: Yarn) => {
    setCart((c) => c + 1)
    setJustAdded(y.id)
    window.setTimeout(() => setJustAdded((cur) => (cur === y.id ? null : cur)), 1400)
  }

  // Roving keyboard nav across the swatch row.
  const onSwatchKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1 + DYES.length) % DYES.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + DYES.length) % DYES.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = DYES.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    dip(DYES[next])
    const el = document.getElementById(`swatch-${DYES[next].id}`)
    el?.focus()
  }

  // The shop shows ALL yarns; the active family is emphasised + leads.
  const ordered = [...YARNS].sort((a, b) => {
    const aw = a.colour === active ? 0 : 1
    const bw = b.colour === active ? 0 : 1
    return aw - bw
  })
  const inFamily = YARNS.filter((y) => y.colour === active).length

  return (
    <div
      className="min-h-screen bg-[#efe7d6] font-sans text-[#2b2620] antialiased selection:bg-[var(--accent)] selection:text-[#efe7d6]"
      style={{ '--accent': dye.hex, '--ink': dye.ink } as CSSProperties}
    >
      <PreviewChrome company={company} />

      {/* sr-only live region: announces the active plant/colour on every dip */}
      <p className="sr-only" aria-live="polite">
        Nú sýnt: {dye.name} · {dye.plant}
      </p>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#2b2620]/12 bg-[#efe7d6]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="font-dmserif text-2xl leading-none text-[#2b2620]">
              Hespa
            </span>
            <span
              className="hidden font-mono text-[10px] tracking-[0.22em] text-[var(--accent)] uppercase transition-colors duration-700 sm:inline"
              aria-hidden="true"
            >
              jurtalituð ull
            </span>
          </a>
          <div className="flex items-center gap-5 md:gap-6">
            <a
              href="#garn"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Garn
            </a>
            <a
              href="#litirnir"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Litirnir
            </a>
            <a
              href="#sagan"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Sagan
            </a>
            <a
              href="#heimsokn"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Heimsókn
            </a>

            {/* Cart pill — optimistic count, the on-site-shop promise made visible */}
            <a
              href="#garn"
              lang="is"
              aria-label={`Karfa, ${cart} ${cart === 1 ? 'hespa' : 'hespur'}`}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-[#2b2620] px-4 py-2.5 font-mono text-xs tracking-wide text-[#efe7d6] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Karfa</span>
              <AnimatePresence>
                {cart > 0 && (
                  <motion.span
                    key={cart}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: DIP }}
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] leading-none text-[#efe7d6] transition-colors duration-500"
                    aria-hidden="true"
                  >
                    {cart}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img
              src={`${HERO}?q=80&w=2000${Q}`}
              srcSet={`${HERO}?q=80&w=828${Q} 828w, ${HERO}?q=80&w=1280${Q} 1280w, ${HERO}?q=80&w=2000${Q} 2000w`}
              sizes="100vw"
              fetchpriority="high"
              loading="eager"
              alt="Náttúruleg, óllituð íslensk ull í hlýjum tónum"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#c89a3c] via-[#a8492c] to-[#5a7242]"
            />
            {/* Scrim for AA contrast over the photo. A right-edge floor keeps
                the headline legible even where the photo is bright. */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(100deg, rgba(43,38,32,0.86) 0%, rgba(43,38,32,0.62) 46%, rgba(43,38,32,0.34) 100%)',
              }}
            />
            {/* The hero quietly takes the active dye too — a faint top wash */}
            <motion.div
              className="absolute inset-x-0 top-0 h-40"
              aria-hidden="true"
              animate={{
                background: `linear-gradient(180deg, ${dye.hex}40 0%, ${dye.hex}00 100%)`,
              }}
              transition={{ duration: 0.8, ease: BLOOM }}
            />
          </div>

          <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-14 md:px-8 md:pt-36 md:pb-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: BLOOM }}
              className="max-w-2xl"
            >
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] text-[#efe7d6]/90 uppercase">
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                Hespuhúsið · Ölfus
              </p>
              <h1 className="font-dmserif text-[clamp(3rem,9vw,6.5rem)] leading-[1.06] text-[#efe7d6]">
                Litir landsins
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#efe7d6]/90 md:text-xl">
                Íslensk ull, lituð með jurtum úr náttúrunni. Hver litur á sér
                plöntu — rabarbara, lúpínu, fléttur og birkilauf — og hverja
                hespu má rekja aftur til landsins sem hún kemur úr.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#garn"
                  lang="is"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 font-mono text-sm tracking-wide text-[#efe7d6] shadow-lg shadow-black/20 transition-[transform,background-color] duration-700 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Skoða garn
                </a>
                <a
                  href="#litirnir"
                  className="inline-flex items-center gap-2 rounded-full border border-[#efe7d6]/45 px-6 py-3.5 font-mono text-sm tracking-wide text-[#efe7d6] transition-colors hover:bg-[#efe7d6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
                >
                  Skoða litina
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── LITIRNIR — the signature dye-colour palette ─────── */}
        <section
          id="litirnir"
          className="scroll-mt-20 border-b border-[#2b2620]/10 px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Settle>
              <p className="font-mono text-[11px] tracking-[0.26em] text-[var(--accent)] uppercase transition-colors duration-700">
                Litaspjaldið
              </p>
              {/* The signature header out-ranks the shop: larger, with a colour field */}
              <h2 className="mt-3 max-w-3xl font-dmserif text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[1.07]">
                Veldu lit og sjáðu hvaðan hann kemur
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#2b2620]/75">
                Litirnir okkar koma ekki úr glasi heldur úr jörðinni. Smelltu á
                lit — eða notaðu örvalyklana — til að sjá jurtina að baki og
                garnið í þeirri litafjölskyldu. Öll síðan tekur litinn með þér.
              </p>
            </Settle>

            {/* "Tap a colour" affordance */}
            <Settle delay={0.05}>
              <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#2b2620]/15 bg-[#f6f0e2] px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-[#2b2620]/70">
                <MousePointerClick className="h-3.5 w-3.5 text-[var(--accent)] transition-colors duration-700" aria-hidden="true" />
                Smelltu á lit
              </p>
            </Settle>

            {/* Swatch row — physical, tactile wool circles, not filter chips */}
            <div
              role="radiogroup"
              aria-label="Náttúrulegir litir"
              className="mt-5 flex flex-wrap gap-3"
            >
              {DYES.map((d, i) => {
                const on = d.id === active
                return (
                  <button
                    key={d.id}
                    id={`swatch-${d.id}`}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${d.name} — litaður með: ${d.plant}`}
                    tabIndex={on ? 0 : -1}
                    onClick={(e) => dip(d, { clientX: e.clientX, clientY: e.clientY })}
                    onKeyDown={(e) => onSwatchKey(e, i)}
                    className="group flex min-h-[48px] items-center gap-3 rounded-full border py-2.5 pr-5 pl-2.5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
                    style={{
                      borderColor: on ? d.hex : 'rgba(43,38,32,0.18)',
                      background: on ? `${d.hex}1f` : 'transparent',
                    }}
                  >
                    <span className="relative grid place-items-center">
                      {/* the dyed-wool circle */}
                      <span
                        className="relative z-10 h-10 w-10 rounded-full transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: `radial-gradient(80% 80% at 32% 28%, ${shade(d.hex, 1.18)} 0%, ${d.hex} 52%, ${shade(d.hex, 0.78)} 100%)`,
                          boxShadow: on
                            ? `0 0 0 3px ${CREAM}, 0 0 0 5px ${d.hex}, 0 6px 16px -6px ${d.hex}`
                            : `inset 0 0 0 1px rgba(0,0,0,0.10)`,
                        }}
                        aria-hidden="true"
                      />
                      {/* soft inner bloom that wicks outward on hover */}
                      <span
                        className="pointer-events-none absolute inset-0 -z-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
                        style={{ background: d.hex }}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className="font-mono text-xs tracking-wide transition-colors duration-300"
                      style={{ color: on ? d.ink : 'rgba(43,38,32,0.7)' }}
                    >
                      {d.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Feature panel — the "vat dip". Media + plant story.
                Border + ground retint with the active dye. */}
            <motion.div
              className="mt-8 grid overflow-hidden rounded-3xl border md:grid-cols-2"
              animate={{ background: `${dye.hex}12`, borderColor: `${dye.hex}55` }}
              transition={{ duration: 0.7, ease: BLOOM }}
            >
              {/* MEDIA: old source dissolves under a wash of the new dye that
                  radiates from the clicked swatch, then the new image surfaces. */}
              <div id="dye-panel-media" className="relative min-h-[300px] md:min-h-[440px]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={dye.id}
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.6, ease: BLOOM }}
                  >
                    <Img
                      src={dye.img}
                      alt={dye.alt}
                      className="h-full w-full object-cover"
                      fallbackClassName="bg-gradient-to-br from-[#c89a3c] to-[#5a7242]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* The colour wash: full dye → transparent, radiating from origin */}
                {!reduce && (
                  <AnimatePresence>
                    <motion.div
                      key={dipKey.current}
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at ${origin.x}% ${origin.y}%, ${dye.hex} 0%, ${dye.hex} 30%, ${dye.hex}00 72%)`,
                      }}
                      initial={{ opacity: 0.92 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: BLOOM }}
                      aria-hidden="true"
                    />
                  </AnimatePresence>
                )}

                <motion.span
                  className="absolute inset-x-0 bottom-0 h-2"
                  animate={{ background: dye.hex }}
                  transition={{ duration: 0.7, ease: BLOOM }}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="h-12 w-12 shrink-0 rounded-full ring-2 ring-[#efe7d6]"
                    animate={{ background: dye.hex }}
                    transition={{ duration: 0.7, ease: BLOOM }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-700" style={{ color: dye.ink }}>
                      {dye.plantLatin}
                    </p>
                    <p className="font-dmserif text-2xl leading-tight">{dye.plant}</p>
                  </div>
                </div>
                <h3 className="font-dmserif text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12]">
                  {dye.name}
                </h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={dye.id}
                    className="text-base leading-relaxed text-[#2b2620]/80"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: BLOOM }}
                  >
                    {dye.story}
                  </motion.p>
                </AnimatePresence>
                <a
                  href="#garn"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide transition-colors duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
                  style={{ color: dye.ink }}
                >
                  Garn í þessum lit
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GARNIÐ — webshop grid (all yarns, active family leads) ─── */}
        <section id="garn" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Settle>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.26em] text-[var(--accent)] uppercase transition-colors duration-700">
                    Vefverslun
                  </p>
                  <h2 className="mt-3 font-dmserif text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1]">
                    Garnið
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-[#2b2620]/70">
                  Sýnishorn úr verslun — allar hespurnar okkar. Veldu lit að ofan
                  og fjölskyldan hans raðast fremst. Verslað beint hjá okkur.
                </p>
              </div>
              <div className="mt-6">
                <DyeBleed color={dye.hex} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs tracking-wide transition-colors duration-700" style={{ color: dye.ink }} aria-live="polite">
                  Fremst: <span className="font-semibold">{dye.name}</span> ·{' '}
                  {inFamily} {inFamily === 1 ? 'hespa' : 'hespur'} · {YARNS.length} alls
                </p>
                <p className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#2b2620]/55">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  Sendum um allt land
                </p>
              </div>
            </Settle>

            <motion.div layout className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {ordered.map((y, i) => {
                  const c = DYES.find((d) => d.id === y.colour) ?? DYES[0]
                  const on = y.colour === active
                  const added = justAdded === y.id
                  return (
                    <motion.article
                      key={y.id}
                      layout
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-8% 0px' }}
                      transition={{ duration: 0.55, ease: BLOOM, delay: Math.min(i, 5) * 0.04 }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-[#f6f0e2] transition-[border-color,box-shadow,transform] duration-500"
                      style={{
                        borderColor: on ? `${c.hex}80` : 'rgba(43,38,32,0.12)',
                        boxShadow: on ? `0 10px 30px -16px ${c.hex}` : 'none',
                        transform: on ? 'translateY(-2px)' : undefined,
                      }}
                    >
                      {/* Colour-field skein — built from the dye hex, never a stock photo */}
                      <div
                        className="relative aspect-[4/3] overflow-hidden"
                        role="img"
                        aria-label={`Hespa lituð með ${c.plant} — ${c.name}`}
                      >
                        <div
                          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                          style={skeinStyle(c.hex, y.wind, CREAM)}
                        />
                        {/* On hover the ACTIVE dye washes diagonally across the card */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(115deg, ${dye.hex}00 40%, ${dye.hex}3a 70%, ${dye.hex}00 100%)`,
                          }}
                          aria-hidden="true"
                        />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#2b2620]/80 px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#efe7d6] backdrop-blur-sm">
                          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30" style={{ background: c.hex }} aria-hidden="true" />
                          {c.name}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-dmserif text-xl leading-tight">{y.name}</h3>
                        <p className="mt-1 font-mono text-xs tracking-wide text-[#2b2620]/60">
                          {y.detail}
                        </p>
                        <div className="mt-4 flex items-center justify-between gap-3 pt-3">
                          <span className="font-dmserif text-lg" style={{ color: c.ink }}>
                            {y.price}
                          </span>
                          <button
                            type="button"
                            lang="is"
                            onClick={() => addToCart(y)}
                            aria-label={`Bæta ${y.name} í körfu`}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-xs tracking-wide text-[#efe7d6] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                            style={{ background: added ? c.hex : INK }}
                          >
                            {added ? (
                              <>
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                Komið í körfu
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                                Bæta í körfu
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            <Settle delay={0.1}>
              <div className="mt-10 flex justify-center">
                <a
                  href="#litirnir"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2b2620]/25 px-6 py-3 font-mono text-sm tracking-wide text-[#2b2620] transition-colors hover:bg-[#2b2620]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  Skoða litaspjaldið
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Settle>
          </div>
        </section>

        {/* ── THE MAKER ─────────────────────────────────────── */}
        <section
          id="sagan"
          className="scroll-mt-20 bg-[#2b2620] px-5 py-20 text-[#efe7d6] md:px-8 md:py-28"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Settle>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl">
                  <Img
                    src={`https://images.unsplash.com/photo-1737113551426-9d59e52aa51d?q=80&w=1200${Q}`}
                    alt="Hönd á óunninni, óllitaðri íslenskri ull"
                    className="aspect-[4/5] w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#c89a3c] to-[#5a7242]"
                  />
                </div>
                <div className="absolute -right-3 -bottom-3 hidden w-40 overflow-hidden rounded-2xl ring-4 ring-[#2b2620] sm:block md:-right-6 md:-bottom-6 md:w-52">
                  <Img
                    src={`https://images.unsplash.com/photo-1532623314721-cedde8730d26?q=80&w=700${Q}`}
                    alt="Íslenskt sauðfé úti í náttúrunni"
                    className="aspect-square w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#5a7242] to-[#2b2620]"
                  />
                </div>
              </div>
            </Settle>

            <div>
              <Settle>
                <p className="font-mono text-[11px] tracking-[0.26em] text-[#c89a3c] uppercase">
                  Sagan
                </p>
                <h2 className="mt-3 font-dmserif text-[clamp(2rem,5vw,3.25rem)] leading-[1.12]">
                  Guðrún Bjarnadóttir
                </h2>
                <p className="mt-2 font-mono text-xs tracking-wide text-[#efe7d6]/65">
                  grasafræðingur og jurtalitari
                </p>
                <p className="mt-6 text-base leading-relaxed text-[#efe7d6]/85">
                  Hespuhúsið byggir á þekkingu grasafræðings sem hefur árum saman
                  safnað jurtum og lært hvaða litir leynast í íslenskri náttúru.
                  Hver hespa er handlituð í litlum skömmtum, þar sem plönturnar
                  ráða tóninum — engir tveir pottar verða nákvæmlega eins.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#efe7d6]/85">
                  Vinnustofan í Ölfusi stendur opin gestum. Þar má sjá litunina,
                  þreifa á ullinni og heyra söguna á bak við hvern lit.
                </p>
              </Settle>

              <Settle delay={0.1}>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#efe7d6]/15 pt-7">
                  {MARKS.map((m) => (
                    <div key={m.label}>
                      <dt className="font-dmserif text-2xl text-[#c89a3c] md:text-3xl">
                        {m.k}
                      </dt>
                      <dd className="mt-1 font-mono text-[11px] tracking-wide text-[#efe7d6]/65">
                        {m.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Settle>
            </div>
          </div>
        </section>

        {/* ── HEIMSÓKN — visit the studio ───────────────────── */}
        <section id="heimsokn" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Settle>
              <p className="font-mono text-[11px] tracking-[0.26em] text-[var(--accent)] uppercase transition-colors duration-700">
                Heimsókn
              </p>
              <h2 className="mt-3 max-w-2xl font-dmserif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1]">
                Komdu í vinnustofuna
              </h2>
            </Settle>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Settle>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <MapPin className="h-6 w-6 text-[#a8492c]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Staðsetning</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    {STUDIO.name}
                    <br />
                    {STUDIO.street}
                    <br />
                    {STUDIO.area} · {STUDIO.region}
                  </p>
                  <a
                    href={STUDIO.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide text-[#a8492c] transition-colors hover:text-[#8f3c22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8492c]"
                  >
                    Finna okkur
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Settle>

              <Settle delay={0.05}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <Clock className="h-6 w-6 text-[#5a7242]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Opnunartími</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    Opin vinnustofa á sumrin.
                    <br />
                    Utan þess best að hafa samband og bóka heimsókn.
                  </p>
                  <p className="mt-auto font-mono text-[11px] tracking-wide text-[#2b2620]/50">
                    Tímar eru sýnishorn
                  </p>
                </div>
              </Settle>

              <Settle delay={0.1}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <Phone className="h-6 w-6 text-[#38497a]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Hafa samband</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    Spurningar um liti, garn eða heimsókn?
                  </p>
                  <a
                    href="mailto:hespa@hespa.is"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide text-[#38497a] transition-colors hover:text-[#2d3a63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38497a]"
                  >
                    hespa@hespa.is
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Settle>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <FinalCta dye={dye} reduce={!!reduce} />
      </main>

      {/* ── Mobile sticky CTA ─────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#2b2620]/12 bg-[#efe7d6]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a
          href="#garn"
          lang="is"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 font-mono text-sm tracking-wide text-[#efe7d6] transition-colors duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Skoða garn{cart > 0 ? ` · karfa (${cart})` : ''}
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── Final CTA — its own component so it can run a calm parallax + a dye
   wash without cluttering the main render. Photo is distinct (Icelandic
   landscape), NOT a reused yarn-drying shot. ─────────────────────────── */
function FinalCta({ dye, reduce }: { dye: DyeColour; reduce: boolean }) {
  const bgRef = useRef<HTMLDivElement>(null)
  const secRef = useRef<HTMLElement>(null)
  const ID = 'photo-1444492417251-9c84a5fa18e0' // autumn lakeside landscape
  const src = (w: number) => `https://images.unsplash.com/${ID}?q=80&w=${w}${Q}`

  // Manual, passive parallax (no Framer useScroll — throttled here).
  useEffect(() => {
    if (reduce) return
    let ticking = false
    const apply = () => {
      ticking = false
      const sec = secRef.current
      const el = bgRef.current
      if (!sec || !el) return
      const rect = sec.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2
      const shift = Math.max(-44, Math.min(44, -mid * 0.06))
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.12)`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduce])

  return (
    <section ref={secRef} className="relative isolate overflow-hidden px-5 py-24 md:px-8 md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.12)' }}>
          <Img
            src={src(2000)}
            srcSet={`${src(828)} 828w, ${src(1280)} 1280w, ${src(2000)} 2000w`}
            sizes="100vw"
            alt="Íslenskt haustlandslag við vatn — heiðin þar sem jurtirnar eru tíndar"
            className="h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#a8492c] via-[#c89a3c] to-[#5a7242]"
          />
        </div>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(180deg, rgba(43,38,32,0.58) 0%, rgba(43,38,32,0.80) 100%)',
          }}
        />
        {/* the CTA also takes the active dye — a soft bottom wash */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2"
          aria-hidden="true"
          animate={{ background: `linear-gradient(0deg, ${dye.hex}3a 0%, ${dye.hex}00 100%)` }}
          transition={{ duration: 0.8, ease: BLOOM }}
        />
      </div>

      <Settle className="mx-auto max-w-3xl text-center text-[#efe7d6]">
        <h2 className="font-dmserif text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.08]">
          Veldu þér lit úr landinu
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#efe7d6]/90">
          Skoðaðu garnið og verslaðu beint hjá okkur — eða komdu við í
          vinnustofunni og sjáðu litunina með eigin augum.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="#garn"
            lang="is"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-4 font-mono text-sm tracking-wide text-[#efe7d6] shadow-lg shadow-black/25 transition-[transform,background-color] duration-700 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Skoða garn
          </a>
          <a
            href="#heimsokn"
            className="inline-flex items-center gap-2 rounded-full border border-[#efe7d6]/45 px-7 py-4 font-mono text-sm tracking-wide text-[#efe7d6] transition-colors hover:bg-[#efe7d6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Heimsókn
          </a>
        </div>
      </Settle>
    </section>
  )
}
