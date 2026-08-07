import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowUpRight, GitCompareArrows, LineChart, MapPin } from 'lucide-react'
import { SHOWCASE, SHOWCASE_ITEMS } from '../data/showcase'
import type { ShowcaseItem } from '../data/showcase'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { markGalleryVisit, setThemeColor } from '../lib/preview'

/** Internal tools (dashboard link, preview send-button) only for Sindri via ?tools. */
function toolsEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('tools')
  } catch {
    return false
  }
}

const EASE = [0.21, 0.65, 0.36, 1] as const
const TOTAL = SHOWCASE_ITEMS.length

const VALUE = [
  'Sterkari fyrsta sýn',
  'Skýrari upplýsingar',
  'Betri upplifun í síma',
  'Einfaldara bókunar- og kaupferli',
]

/** Rendered card size in the 2-col grid is ~560px wide — request 760w (~1.35x) instead of 1200. */
function sized(url: string): string {
  return url.replace(/([?&])w=\d+/, '$1w=760')
}

/* ------------------------------------------------------------------ *
 * The "Index Wall" — the hub's own motion language. Plates settle onto
 * a curator's wall in reading order; a catalogue number stamps itself
 * in each plate's brand accent as it crosses center-viewport; a sticky
 * left spine tracks the current group. Structure animates, not content.
 * ------------------------------------------------------------------ */

/** Container that lays its plates down left-to-right, 40ms apart. */
const plateGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

/** A single plate settling onto the wall: short spring, y only, no scale. */
const plate: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 30, mass: 0.7 },
  },
}

/**
 * Catalogue counter: ticks 00 -> slot number once, when the plate first
 * crosses center-viewport. Snaps instantly under reduced motion.
 */
function useCatalogueTick(target: number, active: boolean, reduce: boolean): number {
  const [value, setValue] = useState(reduce ? target : 0)
  const done = useRef(reduce)
  useEffect(() => {
    if (done.current || !active) return
    done.current = true
    if (reduce || target <= 0) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 360 + target * 18 // later plates count a touch longer — reads as a catalogue
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      // ease-out so the last digits settle, not race
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target, reduce])
  return value
}

/** A plate is a showcase item plus the group label it belongs to (for the spine). */
type PlateItem = ShowcaseItem & { groupLabel: string }

interface PlateProps {
  item: PlateItem
  num: number
  reduce: boolean
  onCenter: (label: string) => void
}

function ProjectPlate({ item, num, reduce, onCenter }: PlateProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  // "atCenter" drives the signature beat: the number-stamp + sector pill
  // briefly take the card's brand accent as the plate crosses mid-viewport.
  const [atCenter, setAtCenter] = useState(false)
  const [revealed, setRevealed] = useState(reduce)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Center-band observer: fire when the plate sits in the middle third.
    const io = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting
        if (active) setRevealed(true)
        setAtCenter(active)
        if (active) onCenter(item.groupLabel)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [item.groupLabel, onCenter])

  const ticked = useCatalogueTick(num, revealed, reduce)
  const catalogue = String(ticked).padStart(2, '0')

  // brand accent leads on hover OR at-center; otherwise quiet metadata grey
  const accentNum: CSSProperties = atCenter ? { color: item.accent } : {}

  return (
    <motion.div variants={plate}>
      <Link
        ref={ref}
        to={item.route}
        className="group relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_18px_50px_-22px_rgba(0,0,0,0.85)] focus-visible:-translate-y-0.5"
        aria-label={`Skoða frumgerð: ${item.name}`}
      >
        <div className="relative">
          <Img
            src={sized(item.image)}
            alt={`${item.name} — ${item.sector}`}
            loading={num <= 2 ? 'eager' : 'lazy'}
            fetchpriority={num <= 2 ? 'high' : undefined}
            className="aspect-[16/11] w-full object-cover"
            fallbackClassName="aspect-[16/11] w-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-[#06080c]/45 to-[#06080c]/5"
            aria-hidden="true"
          />
          {/* structural accent line: draws across on hover/focus (plus a faint hint at-center) */}
          <span
            className={`absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
              atCenter ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-100'
            }`}
            style={{ background: item.accent }}
            aria-hidden="true"
          />
          {/* concept tag — top-right, so no visitor mistakes a plate for a live site */}
          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-[#06080c]/65 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/85 uppercase backdrop-blur-md">
            Frumgerð
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-grotesk text-[11px] font-semibold tabular-nums tracking-[0.1em] text-white/45 transition-colors duration-300 group-hover:[color:var(--acc)]"
                style={{ ['--acc' as string]: item.accent, ...accentNum }}
              >
                {catalogue}
              </span>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] backdrop-blur-md transition-colors duration-300"
                style={
                  atCenter
                    ? { borderColor: item.accent, color: '#fff', background: `${item.accent}26` }
                    : { borderColor: 'rgba(255,255,255,0.12)', color: '#fff', background: 'rgba(255,255,255,0.12)' }
                }
              >
                {item.sector}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-white/55">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {item.location}
              </span>
            </div>
            <h3 className="mt-3 font-tall text-2xl leading-tight font-normal md:text-3xl">{item.name}</h3>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/65">{item.blurb}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80">
              Skoða frumgerð
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home() {
  const showTools = toolsEnabled()
  const reduce = useReducedMotion() ?? false

  useEffect(() => {
    document.title = 'Endurhannanir — vefsíður fyrir íslensk fyrirtæki'
    setThemeColor('#0b0e13')
    // Only arm internal preview tooling on Sindri's own ?tools entry — owners
    // opening this hub directly must never see the outreach controls.
    if (showTools) markGalleryVisit()
  }, [showTools])

  // Sticky left "index spine" — tracks which group is currently centered.
  const [spine, setSpine] = useState({ index: 1, label: SHOWCASE[0]?.title ?? '' })
  const onCenter = (label: string) => {
    const idx = SHOWCASE.findIndex((g) => g.title === label)
    if (idx >= 0) setSpine({ index: idx + 1, label })
  }

  // running catalogue slot, assigned in reading order across all groups
  let n = 0

  return (
    <div lang="is" className="grain min-h-screen bg-[#0b0e13] font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0e13]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-grotesk text-sm font-semibold tracking-tight text-white">
            Endurhannanir <span className="text-white/40">— Sindri Már</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Aðalvalmynd">
            <a
              href="#verkefni"
              className="hidden rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:text-white sm:inline"
            >
              Verkefni
            </a>
            <Link
              to="/preview/comparison"
              className="hidden rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:text-white sm:inline"
            >
              Fyrir og eftir
            </Link>
            <a
              href="mailto:sindri@klubbr.is?subject=Fyrirspurn%20um%20vefs%C3%AD%C3%B0u"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#0b0e13] transition-colors hover:bg-white/85"
            >
              Hafa samband
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-grotesk text-[11px] font-semibold tracking-[0.34em] text-sky-300/80 uppercase">
              Safn endurhannana · 2026
            </p>
            <h1 className="mt-5 max-w-3xl font-tall text-[2.9rem] leading-[1.06] font-normal text-balance md:text-7xl">
              Nýjar vefsíður fyrir <em className="text-sky-200 italic">íslensk fyrirtæki</em>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Þetta er safn <strong className="font-semibold text-white/90">frumgerða</strong> — hugmynda að nýjum
              vefsíðum fyrir íslensk fyrirtæki, ekki raunverulegar síður þeirra. Hver hugmynd sýnir sterkari fyrstu
              sýn, skýrari upplýsingar og einfaldari leið fyrir viðskiptavini.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {VALUE.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
                >
                  {v}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-4 sm:gap-x-7">
              <a
                href="#verkefni"
                className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-sky-200"
              >
                Skoða verkefnin
              </a>
              {/* Proof figures promoted from metadata to a confident stat block. */}
              <dl className="flex items-center gap-6">
                <div className="leading-none">
                  <dt className="font-grotesk text-2xl font-semibold tabular-nums text-white md:text-3xl">
                    {TOTAL}
                  </dt>
                  <dd className="mt-1 text-xs tracking-wide text-white/50">fullunnar frumgerðir</dd>
                </div>
                <span className="h-9 w-px bg-white/15" aria-hidden="true" />
                <div className="leading-none">
                  <dt className="font-grotesk text-2xl font-semibold tabular-nums text-white md:text-3xl">
                    {SHOWCASE.length}
                  </dt>
                  <dd className="mt-1 text-xs tracking-wide text-white/50">flokkar</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </section>

        {/* Project groups — the Index Wall */}
        <section id="verkefni" className="relative scroll-mt-20 border-t border-white/10 pt-14 md:pt-20">
          {/* Sticky index spine — a thin hairline down the left edge with the
              current catalogue group tracking it. Decorative; hidden on small
              screens and under reduced motion it simply stays put. */}
          <div
            className="pointer-events-none absolute inset-y-0 left-[-1.75rem] hidden xl:block"
            aria-hidden="true"
          >
            <span className="absolute inset-y-0 left-0 w-px bg-white/10" />
            <div className="sticky top-1/2 -translate-y-1/2 pl-3">
              <span className="block font-grotesk text-[11px] font-semibold tabular-nums tracking-[0.18em] text-sky-300/80">
                {String(spine.index).padStart(2, '0')} / {SHOWCASE.length.toString().padStart(2, '0')}
              </span>
              <span
                className="mt-2 block max-w-[9rem] font-grotesk text-[11px] leading-snug tracking-[0.08em] text-white/45 transition-opacity duration-300"
                style={{ writingMode: 'vertical-rl' }}
              >
                {spine.label}
              </span>
            </div>
          </div>

          {SHOWCASE.map((group, gi) => (
            <div key={group.id} className="mb-16 md:mb-24">
              <Reveal y={0}>
                {/* per-group hairline divider draws in from the left */}
                <motion.span
                  className="block h-px origin-left bg-white/12"
                  initial={{ scaleX: reduce ? 1 : 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-grotesk text-[11px] font-semibold tabular-nums tracking-[0.18em] text-white/35">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-tall text-3xl font-normal md:text-4xl">{group.title}</h2>
                  <p className="mt-1 w-full max-w-xl text-sm leading-relaxed text-white/55 md:mt-0 md:basis-full">
                    {group.blurb}
                  </p>
                </div>
              </Reveal>

              <motion.div
                className="mt-8 grid gap-6 md:grid-cols-2"
                variants={plateGroup}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
              >
                {group.items.map((item) => {
                  n += 1
                  return (
                    <ProjectPlate
                      key={item.route}
                      item={{ ...item, groupLabel: group.title }}
                      num={n}
                      reduce={reduce}
                      onCenter={onCenter}
                    />
                  )
                })}
              </motion.div>
            </div>
          ))}
        </section>

        {/* Before & after — promoted to a headline-level proof point. */}
        <Reveal>
          <Link
            to="/preview/comparison"
            className="group block overflow-hidden rounded-[1.75rem] border border-sky-300/25 bg-gradient-to-br from-sky-400/[0.10] via-white/[0.04] to-transparent p-7 transition-colors hover:border-sky-300/45 md:p-10"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4 md:items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-300/15 text-sky-200">
                  <GitCompareArrows className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-grotesk text-[11px] font-semibold tracking-[0.22em] text-sky-300/80 uppercase">
                    Sönnun
                  </p>
                  <h2 className="mt-2 font-tall text-3xl font-normal leading-tight text-white md:text-4xl">
                    Sjáðu muninn — fyrir og eftir
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                    Berðu núverandi vefsíður og frumgerðirnar saman hlið við hlið og sjáðu nákvæmlega hverju
                    endurhönnunin breytir.
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors group-hover:bg-sky-200 md:self-auto">
                Fyrir og eftir
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Bottom-of-gallery conversion — who Sindri is + the real offer + a reply CTA.
            This is the warmest moment, so it asks instead of apologizing. */}
        <Reveal className="mt-6">
          <section
            aria-labelledby="hafa-samband-titill"
            className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-7 md:p-12"
          >
            <p className="font-grotesk text-[11px] font-semibold tracking-[0.22em] text-sky-300/80 uppercase">
              Hægt að gera þetta að alvöru
            </p>
            <h2 id="hafa-samband-titill" className="mt-4 max-w-2xl font-tall text-3xl font-normal leading-tight text-white md:text-5xl">
              Líst þér á eina af þessum hugmyndum?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Ég heiti Sindri og hjálpa íslenskum fyrirtækjum að eignast vandaða vefsíðu — og halda henni
              lifandi. Þú færð ekki bara fallega hönnun heldur fullkláraða síðu sem ég hýsi, viðhald og uppfæri
              fyrir þig, með einföldu kerfi til að breyta texta, myndum og opnunartímum sjálf.
            </p>

            <ul className="mt-7 grid gap-x-8 gap-y-3 text-sm text-white/75 sm:grid-cols-2">
              {[
                'Ný vefsíða, hönnuð sérstaklega fyrir fyrirtækið',
                'Hýsing, öryggi og afrit — þú þarft ekki að hugsa um neitt',
                'Einfaldar mánaðarlegar uppfærslur og smávægilegar lagfæringar',
                'Spjallþjónn sem svarar algengum spurningum allan sólarhringinn',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="mailto:sindri@klubbr.is?subject=Fyrirspurn%20um%20vefs%C3%AD%C3%B0u"
                className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-sky-200"
              >
                Hafa samband
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm text-white/55">
                Engin skuldbinding — ég sýni þér fyrst hvernig þín síða gæti litið út.
              </span>
            </div>
          </section>
        </Reveal>

        {/* Internal dashboard — Sindri only (?tools) */}
        {showTools && (
          <Reveal className="mt-6">
            <Link
              to="/admin/previews"
              className="group flex items-center justify-between gap-4 rounded-[1.75rem] border border-sky-400/25 bg-sky-400/[0.06] p-6 transition-colors hover:border-sky-400/50 md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-400/15 text-sky-300">
                  <LineChart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-grotesk text-[11px] font-semibold tracking-[0.2em] text-sky-300/80 uppercase">
                    Internal · ?tools
                  </p>
                  <p className="mt-1 font-tall text-2xl font-normal text-white">Verkefnayfirlit</p>
                  <p className="mt-1 max-w-md text-sm text-white/55">
                    Innra mælaborð með úttektum og útsendingu frumgerða.
                  </p>
                </div>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/20 p-3 transition-all duration-300 group-hover:rotate-45 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-slate-950 sm:block">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-12 text-center md:mt-24">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            <strong className="text-white/80">Frumgerðir — hönnunarhugmyndir.</strong> Þetta eru hugmyndir að
            nýjum vefsíðum, ekki raunverulegar vefsíður fyrirtækjanna. Texti, verð og umsagnir eru sýnishorn.
            Myndir frá Unsplash.
          </p>
          <p className="mt-4 text-xs text-white/35">
            Hugmynd og hönnun ·{' '}
            <a href="mailto:sindri@klubbr.is" className="underline underline-offset-2 hover:text-white/60">
              sindri@klubbr.is
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}
