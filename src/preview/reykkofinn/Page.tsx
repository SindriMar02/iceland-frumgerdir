import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Clock, Flame, Mail, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { FLOW, HERO_ID, IMGS, PHONE_PRIMARY, PHONE_SECONDARY, PRODUCTS, SPECS, TAGLINE } from './data'

const company = getPreviewCompany('reykkofinn')

const IMG = 'https://images.unsplash.com/'
const HERO = `${IMG}${HERO_ID}`
const Q = '&auto=format&fit=crop'
const card = (id: string, w = 1100) => `${IMG}${id}?q=80&w=${w}${Q}`

const EASE = [0.22, 1, 0.36, 1] as const

/* ── THERMAL motion language ─────────────────────────────────────────────
   Reykkofinn's motion is heat, not travel. Nothing slides in horizontally —
   things "cure in": they start cool, desaturated and slightly dim, then warm
   to full ember colour over ~0.8s, as if meat taking on smoke. The one
   ambient, infinite motion is the "reykmerki": numerals (spec figures + flow
   01/02/03) faintly waver in opacity as if seen through rising heat. All of
   it collapses to static under prefers-reduced-motion. */

/* ── WarmIn: the section-reveal primitive (cool/desaturated → warm) ─────── */
function WarmIn({
  children,
  delay = 0,
  y = 10,
  className,
  reduce,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  reduce: boolean
}) {
  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        transition={{ duration: 0.4, ease: 'linear', delay: Math.min(delay, 0.1) }}
      >
        {children}
      </motion.div>
    )
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'saturate(0.55) brightness(0.82)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'saturate(1) brightness(1)' }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── Reykmerki: the signature ambient heat-waver on numerals ─────────────
   A slow ±0.08 opacity loop (+ a hair of brightness) so figures look seen
   through rising heat. The one infinite motion that ties hero smoke to the
   rest of the page. Static under reduced motion. */
function Reykmerki({
  children,
  delay = 0,
  reduce,
  className,
}: {
  children: ReactNode
  delay?: number
  reduce: boolean
  className?: string
}) {
  if (reduce) return <span className={className}>{children}</span>
  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block', willChange: 'opacity, filter' }}
      animate={{ opacity: [1, 0.92, 1, 0.96, 1], filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.span>
  )
}

/* ── SmokeReveal: the signature hero smoke layer + page-wide smoke spine ──
   A soft CSS smoke/gradient that parts on load and thins as the hero scrolls
   away. Kept as the spine: the manual passive listener writes opacity
   synchronously (no Framer useScroll — this env throttles rAF for
   layout-bearing values). Static + light under reduced motion. */
function SmokeReveal({ reduce, parted }: { reduce: boolean; parted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let ticking = false
    const apply = () => {
      ticking = false
      // Thin the smoke as you scroll through the first viewport.
      const t = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.85))
      el.style.opacity = String(0.16 + (1 - t) * 0.62)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
      {/* base haze, scroll-coupled */}
      <div
        ref={ref}
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: reduce ? 0.34 : parted ? 0.78 : 1,
          background:
            'radial-gradient(120% 90% at 50% 18%, rgba(216,207,194,0.30) 0%, rgba(34,27,20,0.0) 46%), linear-gradient(180deg, rgba(24,20,16,0.0) 28%, rgba(24,20,16,0.55) 78%, rgba(24,20,16,0.92) 100%)',
        }}
      />
      {!reduce && (
        <>
          <motion.div
            className="absolute inset-x-[-30%] top-[6%] h-[60%] blur-2xl"
            style={{
              background:
                'radial-gradient(60% 70% at 40% 50%, rgba(216,207,194,0.22), rgba(216,207,194,0) 70%)',
            }}
            initial={{ opacity: 0.9, y: '0%' }}
            animate={{ opacity: parted ? 0.28 : 0.9, y: parted ? '-5%' : '0%' }}
            transition={{ duration: 2.4, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-[-30%] top-[24%] h-[56%] blur-3xl"
            style={{
              background:
                'radial-gradient(55% 65% at 60% 50%, rgba(181,101,29,0.16), rgba(181,101,29,0) 72%)',
            }}
            initial={{ opacity: 0.85, y: '0%' }}
            animate={{ opacity: parted ? 0.22 : 0.85, y: parted ? '-6%' : '0%' }}
            transition={{ duration: 2.8, ease: EASE, delay: 0.15 }}
          />
          {/* slow ambient drift after parting — the smoke keeps breathing */}
          {parted && (
            <motion.div
              className="absolute inset-x-[-20%] top-[10%] h-[70%] blur-3xl"
              style={{
                background:
                  'radial-gradient(50% 60% at 50% 50%, rgba(216,207,194,0.10), rgba(216,207,194,0) 72%)',
              }}
              animate={{ opacity: [0.16, 0.3, 0.16], y: ['0%', '-4%', '0%'] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </>
      )}
    </div>
  )
}

/* ── DriftEmber: a slow, infinite ember-glow pulse (gated) ──────────────── */
function DriftEmber({
  reduce,
  className,
  intensity = 0.22,
}: {
  reduce: boolean
  className?: string
  intensity?: number
}) {
  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ background: `radial-gradient(circle, rgba(208,138,58,${intensity * 0.7}), transparent 70%)` }}
      />
    )
  }
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{ background: `radial-gradient(circle, rgba(208,138,58,${intensity}), transparent 70%)` }}
      animate={{ opacity: [0.35, 0.8, 0.35], scale: [1, 1.08, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ── SmokeWash: a one-shot smoke veil that clears on anchor-jumps ────────
   Reuses the parted-smoke idea as a 400ms wash so navigating between
   sections feels like stepping through smoke into the next room. */
function SmokeWash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="wash"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 40%, rgba(216,207,194,0.5) 0%, rgba(24,20,16,0.85) 60%, rgba(24,20,16,0.95) 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.72, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE, times: [0, 0.35, 1] }}
        />
      )}
    </AnimatePresence>
  )
}

const NAV = [
  { href: '#vorur', label: 'Vörur' },
  { href: '#reykurinn', label: 'Reykurinn' },
  { href: '#sveitabudin', label: 'Sveitabúðin' },
  { href: '#hafa-samband', label: 'Hafa samband' },
]

export default function Page() {
  const reduce = useReducedMotion() ?? false
  const [parted, setParted] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const [wash, setWash] = useState(false)

  useEffect(() => {
    document.title = 'Reykkofinn — Reykur úr hrauninu (hugmynd)'
  }, [])

  useEffect(() => {
    // Part the smoke shortly after load so the surface "emerges".
    const t = window.setTimeout(() => setParted(true), reduce ? 0 : 480)
    return () => window.clearTimeout(t)
  }, [reduce])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Anchor-jump smoke wash: fire the one-shot veil when an in-page link is used.
  useEffect(() => {
    if (reduce) return
    let timer = 0
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      const a = t?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (href.length < 2) return
      setWash(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setWash(false), 560)
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      window.clearTimeout(timer)
    }
  }, [reduce])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#181410] font-sans text-[#d8cfc2] antialiased selection:bg-[#b5651d] selection:text-[#181410]">
      <PreviewChrome company={company} />
      <SmokeWash show={wash} />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#d8cfc2]/10 bg-[#181410]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <a
            href="#top"
            aria-label="Reykkofinn"
            className="flex items-baseline gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d08a3a]"
          >
            <span className="text-lg font-[800] tracking-tight text-[#f3ece1]">Reykkofinn</span>
            <span
              className="hidden font-mono text-[10px] tracking-[0.18em] text-[#e0a463] uppercase sm:inline"
              aria-hidden="true"
            >
              Mývatnssveit
            </span>
          </a>
          <div className="flex items-center gap-5 md:gap-7">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hidden font-mono text-[11px] tracking-wide text-[#d8cfc2]/70 transition-colors hover:text-[#f3ece1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d08a3a] md:inline"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#vorur"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#c8731f] px-4 py-2.5 text-xs font-semibold tracking-wide text-[#181410] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d98a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Panta
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img
              src={`${HERO}?q=80&w=2000${Q}`}
              srcSet={`${HERO}?q=80&w=828${Q} 828w, ${HERO}?q=80&w=1280${Q} 1280w, ${HERO}?q=80&w=2000${Q} 2000w`}
              sizes="100vw"
              fetchpriority="high"
              loading="eager"
              alt="Glóandi hraun og reykur stíga upp í rökkri"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#3a2310] via-[#181410] to-[#0f0c09]"
            />
            {/* Stronger lower-third scrim for AA on the kicker + chips. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(24,20,16,0.18) 0%, rgba(24,20,16,0.0) 30%, rgba(24,20,16,0.55) 64%, rgba(24,20,16,0.92) 100%)',
              }}
            />
          </div>
          <SmokeReveal reduce={reduce} parted={parted} />

          <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-16 md:min-h-[88vh] md:px-8 md:pb-24">
            <motion.p
              className="font-mono text-[11px] font-semibold tracking-[0.28em] text-[#f0c089] uppercase"
              style={{ textShadow: '0 1px 14px rgba(0,0,0,0.85)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: parted ? 1 : 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              Litla sveitabúðin · Hella í Mývatnssveit
            </motion.p>

            <motion.h1
              className="mt-4 max-w-3xl text-[clamp(2.6rem,9vw,5.8rem)] leading-[1.02] font-[800] text-[#f5efe4]"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0, y: reduce ? 0 : 18, filter: reduce ? 'none' : 'brightness(0.8)' }}
              animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
              transition={{ duration: 1, ease: EASE, delay: reduce ? 0 : 0.25 }}
            >
              Reykur úr hrauninu
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-base leading-relaxed text-[#ece4d7] md:text-lg"
              style={{ textShadow: '0 1px 16px rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.45 }}
            >
              Við erum sauðfjárbændur á Hellu í Mývatnssveit. Heimareykt hangikjöt og
              lambakjöt beint frá býli — og reyktur silungur þegar vel viðrar.
            </motion.p>

            <motion.p
              className="mt-3 font-mono text-xs tracking-[0.12em] text-[#f0c089] uppercase"
              style={{ textShadow: '0 1px 14px rgba(0,0,0,0.85)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.55 }}
            >
              {TAGLINE}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.6 }}
            >
              {['hangikjöt', 'lambakjöt', 'beint frá býli', 'birkireykt'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#d8cfc2]/30 bg-[#181410]/55 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-[#ece4d7] backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.7 }}
            >
              <a
                href="#vorur"
                className="inline-flex items-center gap-2 rounded-full bg-[#c8731f] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#181410] shadow-xl shadow-black/40 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d98a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Skoða vörur
              </a>
              <a
                href="#sveitabudin"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc2]/40 bg-[#181410]/30 px-7 py-3.5 text-sm font-semibold tracking-wide text-[#f3ece1] backdrop-blur-sm transition-colors hover:bg-[#d8cfc2]/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
              >
                Koma við í sveitabúðinni
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── Spec strip ───────────────────────────────────── */}
        <section className="border-y border-[#d8cfc2]/10 bg-[#221b14]">
          <div className="mx-auto grid max-w-6xl gap-px px-5 py-2 sm:grid-cols-3 md:px-8">
            {SPECS.map((s, i) => (
              <WarmIn key={s.k} reduce={reduce} delay={i * 0.1} y={8}>
                <div className="flex items-start gap-4 px-1 py-6 sm:px-5">
                  <Reykmerki
                    reduce={reduce}
                    delay={i * 0.9}
                    className="font-mono text-2xl font-[800] text-[#d08a3a]"
                  >
                    {s.k}
                  </Reykmerki>
                  <span className="pt-0.5">
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/70 uppercase">
                      {s.label}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-[#d8cfc2]/85">{s.detail}</span>
                  </span>
                </div>
              </WarmIn>
            ))}
          </div>
        </section>

        {/* ── VÖRURNAR ─────────────────────────────────────── */}
        <section id="vorur" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <WarmIn reduce={reduce}>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#e0a463] uppercase">Vörurnar</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
              Heimareykt, beint frá býli
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#d8cfc2]/80">
              Við fullvinnum okkar afurðir sjálf og seljum beint frá býli. Verð eru sýnishorn —
              pantað í síma, með tölvupósti eða í sveitabúðinni.
            </p>
          </WarmIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <WarmIn
                key={p.id}
                reduce={reduce}
                delay={i * 0.1}
                className={p.flagship ? 'sm:col-span-2 lg:col-span-1 lg:row-span-1' : ''}
              >
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-colors duration-300 ${
                    p.flagship
                      ? 'border-2 border-[#d08a3a]/45 bg-gradient-to-br from-[#2a2014] via-[#1f1810] to-[#181410]'
                      : 'border border-[#d08a3a]/25 bg-gradient-to-br from-[#221b14] via-[#1c1610] to-[#181410]'
                  }`}
                >
                  {/* Ember bloom: swells from the lower edge on hover. */}
                  <DriftEmber
                    reduce={reduce}
                    intensity={p.flagship ? 0.26 : 0.18}
                    className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 translate-y-6 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(120% 90% at 50% 110%, rgba(208,138,58,0.28), rgba(208,138,58,0) 70%)',
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <Flame
                      className={`text-[#d08a3a] ${p.flagship ? 'h-7 w-7' : 'h-6 w-6'}`}
                      aria-hidden="true"
                    />
                    {p.tag && (
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/65 uppercase">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`relative font-[800] tracking-tight text-[#f3ece1] ${
                      p.flagship ? 'mt-12 text-4xl' : 'mt-10 text-3xl'
                    }`}
                  >
                    {p.name}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-[#d8cfc2]/80">{p.line}</p>
                  <div className="relative mt-auto flex items-end justify-between pt-8">
                    <div>
                      <span className="block font-mono text-[10px] tracking-wide text-[#d8cfc2]/70">
                        {p.weight}
                      </span>
                      <span className="mt-1 block text-lg font-semibold text-[#e0a463]">{p.price}</span>
                    </div>
                    <a
                      href="#hafa-samband"
                      className={`rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1] ${
                        p.flagship
                          ? 'bg-[#c8731f] text-[#181410] hover:bg-[#d98a3d]'
                          : 'border border-[#d08a3a]/50 text-[#f3ece1] hover:bg-[#b5651d] hover:text-[#181410] focus-visible:outline-[#d08a3a]'
                      }`}
                    >
                      {p.cta}
                    </a>
                  </div>
                </article>
              </WarmIn>
            ))}
          </div>
        </section>

        {/* ── REYKURINN — the process (sits on base #181410 for depth) ─── */}
        <section id="reykurinn" className="scroll-mt-20 bg-[#181410]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
            <WarmIn reduce={reduce}>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#e0a463] uppercase">Reykurinn</p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
                Birki, hægur eldur og þolinmæði
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#d8cfc2]/80 md:text-base">
                Í kofanum úti í hrauninu reykjum við kjötið hægt yfir íslensku birki. Engin gerviefni,
                enginn flýtir — bara reykur, salt og tími. Það er þessi gamli háttur sem gefur
                hangikjötinu og lambinu sitt djúpa, ljúfa reykbragð.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  'Aðeins íslenskt birki í eldinn',
                  'Hægreyking yfir birkireyk',
                  'Fullunnið og hengt heima á Hellu',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#d8cfc2]/85">
                    <Flame className="mt-0.5 h-4 w-4 shrink-0 text-[#d08a3a]" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </WarmIn>

            <WarmIn reduce={reduce} delay={0.12}>
              {/* Photo-light "smoke panel": the ember/smoke vocabulary instead of
                  unverifiable stock — birch fire rendered, not faked. */}
              <div className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-[#d08a3a]/30 bg-gradient-to-b from-[#241b12] via-[#1c1610] to-[#100c08] p-7">
                {/* rising ember glow from the base = the fire in the kofi */}
                <DriftEmber
                  reduce={reduce}
                  intensity={0.34}
                  className="pointer-events-none absolute -bottom-16 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full blur-xl"
                />
                {/* faint parting smoke veil, reusing the signature gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(90% 70% at 50% 8%, rgba(216,207,194,0.16) 0%, rgba(24,20,16,0) 55%)',
                  }}
                />
                <div className="relative">
                  <Flame className="h-9 w-9 text-[#d08a3a]" aria-hidden="true" />
                  <p className="mt-6 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.1] font-[800] text-[#f3ece1]">
                    Lágt og hægt
                    <br />
                    yfir birki
                  </p>
                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[#d8cfc2]/12 pt-5">
                    {SPECS.map((s, i) => (
                      <div key={s.k}>
                        <Reykmerki
                          reduce={reduce}
                          delay={i * 1.3}
                          className="font-mono text-lg font-[800] text-[#e0a463]"
                        >
                          {s.k}
                        </Reykmerki>
                        <dt className="mt-1 font-mono text-[9px] tracking-[0.18em] text-[#d8cfc2]/60 uppercase">
                          {s.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </WarmIn>
          </div>
        </section>

        {/* ── Svona pantar þú — the honest ordering path ────── */}
        <section className="border-y border-[#d8cfc2]/10 bg-[#221b14]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <WarmIn reduce={reduce}>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#e0a463] uppercase">
                Svona pantar þú
              </p>
              <h2 className="mt-3 max-w-2xl text-[clamp(1.7rem,4.5vw,2.6rem)] leading-[1.08] font-[800] text-[#f3ece1]">
                Þrjú skref, engin millileið
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#d8cfc2]/75">
                Engin netverslun — bara beint samband við bæinn. Sækir í sveitabúðinni eða sent
                heim innanlands.
              </p>
            </WarmIn>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {FLOW.map((s, i) => (
                <WarmIn key={s.n} reduce={reduce} delay={i * 0.14} className="h-full">
                  <div className="relative flex h-full flex-col rounded-2xl border border-[#d8cfc2]/12 bg-[#1c1610] p-6">
                    <Reykmerki
                      reduce={reduce}
                      delay={i * 1.1}
                      className="font-mono text-3xl font-[800] text-[#d08a3a]/75"
                    >
                      {s.n}
                    </Reykmerki>
                    <h3 className="mt-4 text-lg font-[800] text-[#f3ece1]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#d8cfc2]/80">{s.body}</p>
                    {i < FLOW.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 right-[-18px] hidden h-px w-9 bg-[#d08a3a]/40 md:block"
                      />
                    )}
                  </div>
                </WarmIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── MÝVATN — the place ───────────────────────────── */}
        <section className="relative isolate overflow-hidden bg-[#100c08]">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(80% 90% at 18% 30%, rgba(58,35,16,0.55) 0%, rgba(16,12,8,0) 60%), linear-gradient(120deg, #181410 0%, #14100b 55%, #100c08 100%)',
              }}
            />
            <DriftEmber
              reduce={reduce}
              intensity={0.16}
              className="absolute top-1/2 left-[8%] h-[40vw] max-h-[420px] w-[40vw] max-w-[420px] -translate-y-1/2 rounded-full"
            />
          </div>
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-32">
            <WarmIn reduce={reduce}>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0c089] uppercase">Mývatn</p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.06] font-[800] text-[#f5efe4]">
                Staðurinn gerir bragðið
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#ece4d7] md:text-base">
                Mývatn er eitt fegursta og lífríkasta svæði landsins, umlukið hrauni og hverum.
                Bærinn okkar, Hella, stendur þarna í hrauninu — og það er einmitt umhverfið, beitin
                og hreina loftið sem gefur afurðunum okkar sinn sérstaka karakter.
              </p>
            </WarmIn>
            <WarmIn reduce={reduce} delay={0.12}>
              <div className="group overflow-hidden rounded-2xl border border-[#d8cfc2]/15 shadow-2xl shadow-black/50">
                <Img
                  src={card(IMGS.lake, 1100)}
                  alt="Mývatn í kvöldbirtu með hrauni við bakkann"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  fallbackClassName="bg-gradient-to-br from-[#221b14] via-[#1c1610] to-[#0f0c09]"
                />
              </div>
            </WarmIn>
          </div>
        </section>

        {/* ── SVEITABÚÐIN — farm shop + find us ─────────────── */}
        <section
          id="sveitabudin"
          className="scroll-mt-20 border-y border-[#d8cfc2]/10 bg-[#221b14]"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
            <WarmIn reduce={reduce}>
              {/* Photo-light "find us" card instead of the rejected English FARMSHOP sign. */}
              <div className="relative overflow-hidden rounded-2xl border border-[#d08a3a]/30 bg-gradient-to-br from-[#2a2014] via-[#1f1810] to-[#181410] p-7">
                <DriftEmber
                  reduce={reduce}
                  intensity={0.2}
                  className="pointer-events-none absolute -bottom-12 -left-10 h-44 w-44 rounded-full"
                />
                <div className="relative">
                  <MapPin className="h-7 w-7 text-[#d08a3a]" aria-hidden="true" />
                  <p className="mt-6 font-mono text-[10px] tracking-[0.24em] text-[#d8cfc2]/65 uppercase">
                    Á hringveginum
                  </p>
                  <p className="mt-3 text-3xl font-[800] leading-tight text-[#f3ece1]">
                    Hella í<br />Mývatnssveit
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#d8cfc2]/80">
                    Sveitabúðin stendur við bæinn Hellu, rétt við þjóðveg 1 austan Mývatns. Skiltið
                    okkar blasir við af veginum — kíktu við þegar þú átt leið hjá.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hella+M%C3%BDvatnssveit"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d08a3a]/50 px-4 py-2.5 text-xs font-semibold tracking-wide text-[#f3ece1] transition-colors duration-300 hover:bg-[#b5651d] hover:text-[#181410] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Opna leiðsögn
                  </a>
                </div>
              </div>
            </WarmIn>
            <WarmIn reduce={reduce} delay={0.1}>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#e0a463] uppercase">
                Litla sveitabúðin
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
                Komdu við hjá okkur
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#d8cfc2]/80 md:text-base">
                Sveitabúðin okkar stendur við bæinn Hellu í Mývatnssveit, rétt við hringveginn. Þar
                færðu heimareykt hangikjöt og lambakjöt beint frá býli — og reyktan silung eftir
                árstíð.
              </p>

              <dl className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#d08a3a]" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/70 uppercase">
                      Opnunartími
                    </dt>
                    <dd className="mt-1 text-sm text-[#f3ece1]">
                      Sumar: alla daga 10–18 · Vetur: eftir samkomulagi
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d08a3a]" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/70 uppercase">
                      Staðsetning
                    </dt>
                    <dd className="mt-1 text-sm text-[#f3ece1]">Hella, Mývatnssveit · við hringveginn</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#d08a3a]" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/70 uppercase">
                      Sími
                    </dt>
                    <dd className="mt-1 text-sm text-[#f3ece1]">
                      <a
                        href={`tel:+354${PHONE_PRIMARY.replace(/\s/g, '')}`}
                        className="rounded-sm transition-colors hover:text-[#e0a463] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                      >
                        {PHONE_PRIMARY}
                      </a>{' '}
                      ·{' '}
                      <a
                        href={`tel:+354${PHONE_SECONDARY.replace(/\s/g, '')}`}
                        className="rounded-sm transition-colors hover:text-[#e0a463] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                      >
                        {PHONE_SECONDARY}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </WarmIn>
          </div>
        </section>

        {/* ── Final CTA / contact ──────────────────────────── */}
        <section
          id="hafa-samband"
          className="relative scroll-mt-20 overflow-hidden bg-[#181410] px-5 py-24 md:py-32"
        >
          <DriftEmber
            reduce={reduce}
            intensity={0.22}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[60vw] max-h-[520px] w-[60vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <WarmIn reduce={reduce}>
              <Flame className="mx-auto h-7 w-7 text-[#d08a3a]" aria-hidden="true" />
              <h2 className="mt-5 text-[clamp(2.1rem,6vw,3.6rem)] leading-[1.05] font-[800] text-[#f5efe4]">
                Pantaðu eða komdu við
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#d8cfc2]/85 md:text-base">
                Sendu okkur fyrirspurn um hangikjöt, lambakjöt eða reyktan silung — eða líttu inn í
                sveitabúðina næst þegar þú átt leið um Mývatn.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${company.ownerEmail}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c8731f] px-8 py-4 text-sm font-semibold tracking-wide text-[#181410] shadow-xl shadow-black/40 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d98a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Senda fyrirspurn
                </a>
                <a
                  href={`tel:+354${PHONE_PRIMARY.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc2]/35 px-8 py-4 text-sm font-semibold tracking-wide text-[#f3ece1] transition-colors hover:bg-[#d8cfc2]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Hringja {PHONE_PRIMARY}
                </a>
              </div>
            </WarmIn>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA ────────────────────────────── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#d8cfc2]/12 bg-[#181410]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href="#vorur"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c8731f] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#181410] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Panta beint frá býli
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
