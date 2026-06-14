import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, Flame, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { FLOW, HERO_ID, IMGS, PRODUCTS, SPECS } from './data'

const company = getPreviewCompany('reykkofinn')

const IMG = 'https://images.unsplash.com/'
const HERO = `${IMG}${HERO_ID}`
const Q = '&auto=format&fit=crop'
const card = (id: string, w = 1100) => `${IMG}${id}?q=80&w=${w}${Q}`

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Rise: a small whileInView reveal authored for this direction ───────── */
function Rise({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── SmokeReveal: the signature hero smoke layer ─────────────────────────
   A soft CSS smoke/gradient that gently parts on load (clears its opacity)
   and thins further as the hero scrolls away. Under reduced motion it stays
   static and light so the photo behind is always legible. The scroll
   coupling uses a manual passive listener that writes opacity synchronously
   (no Framer useScroll — this env throttles rAF for layout-bearing values). */
function SmokeReveal({ reduce, parted }: { reduce: boolean; parted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      // Thin the smoke as you scroll through the first viewport.
      const t = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.85))
      el.style.opacity = String(0.16 + (1 - t) * 0.62)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  // Two drifting smoke veils + a base haze. Decorative only.
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
            initial={{ opacity: 0.9, x: '-4%' }}
            animate={{ opacity: parted ? 0.28 : 0.9, x: parted ? '6%' : '-4%' }}
            transition={{ duration: 2.4, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-[-30%] top-[24%] h-[56%] blur-3xl"
            style={{
              background:
                'radial-gradient(55% 65% at 60% 50%, rgba(181,101,29,0.16), rgba(181,101,29,0) 72%)',
            }}
            initial={{ opacity: 0.85, x: '4%' }}
            animate={{ opacity: parted ? 0.22 : 0.85, x: parted ? '-6%' : '4%' }}
            transition={{ duration: 2.8, ease: EASE, delay: 0.15 }}
          />
        </>
      )}
    </div>
  )
}

/* ── DriftEmber: a slow, infinite ember-glow pulse (gated) ──────────────── */
function DriftEmber({ reduce, className }: { reduce: boolean; className?: string }) {
  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ background: 'radial-gradient(circle, rgba(208,138,58,0.16), transparent 70%)' }}
      />
    )
  }
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{ background: 'radial-gradient(circle, rgba(208,138,58,0.22), transparent 70%)' }}
      animate={{ opacity: [0.35, 0.8, 0.35], scale: [1, 1.08, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
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

  useEffect(() => {
    document.title = 'Reykkofinn — Reykur úr hrauninu (hugmynd)'
  }, [])

  useEffect(() => {
    // Part the smoke shortly after load so the char "emerges".
    const t = window.setTimeout(() => setParted(true), reduce ? 0 : 480)
    return () => window.clearTimeout(t)
  }, [reduce])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#181410] font-sans text-[#d8cfc2] antialiased selection:bg-[#b5651d] selection:text-[#181410]">
      <PreviewChrome company={company} />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#d8cfc2]/10 bg-[#181410]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <a
            href="#top"
            className="flex items-baseline gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d08a3a]"
          >
            <span className="text-lg font-[800] tracking-tight text-[#f3ece1]">Reykkofinn</span>
            <span
              className="hidden font-mono text-[10px] tracking-[0.18em] text-[#d08a3a] uppercase sm:inline"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-[#c8731f] px-4 py-2.5 text-xs font-semibold tracking-wide text-[#181410] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
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
              alt="Reykt silungsflök í dökkri, hlýrri lýsingu"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#221b14] via-[#181410] to-[#0f0c09]"
            />
          </div>
          <SmokeReveal reduce={reduce} parted={parted} />

          <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-16 md:min-h-[92vh] md:px-8 md:pb-24">
            <motion.p
              className="font-mono text-[11px] tracking-[0.32em] text-[#d08a3a] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: parted ? 1 : 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              Litla sveitabúðin · Hella í Mývatnssveit
            </motion.p>

            <motion.h1
              className="mt-4 max-w-3xl text-[clamp(2.6rem,9vw,5.8rem)] leading-[1.02] font-[800] text-[#f5efe4]"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: reduce ? 0 : 0.25 }}
            >
              Reykur úr hrauninu
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-[#d8cfc2]/90 md:text-lg"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.45 }}
            >
              Villtur Mývatnssilungur, hægreyktur yfir birki í kofanum úti í hrauninu.
              Ærlegt sveitahráefni — frá vatninu beint á borðið þitt.
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap items-center gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.6 }}
            >
              {['Mývatnssveit', 'reykt í hrauninu', 'villtur silungur'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#d8cfc2]/25 bg-[#181410]/40 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-[#d8cfc2]/90 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.7 }}
            >
              <a
                href="#vorur"
                className="inline-flex items-center gap-2 rounded-full bg-[#c8731f] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#181410] shadow-xl shadow-black/40 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Skoða vörur
              </a>
              <a
                href="#sveitabudin"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc2]/35 px-7 py-3.5 text-sm font-semibold tracking-wide text-[#f3ece1] transition-colors hover:bg-[#d8cfc2]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
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
              <Rise key={s.k} delay={i * 0.08} y={14}>
                <div className="flex items-start gap-4 px-1 py-6 sm:px-5">
                  <span className="font-mono text-2xl font-[800] text-[#d08a3a]">{s.k}</span>
                  <span className="pt-0.5">
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/70 uppercase">
                      {s.label}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-[#d8cfc2]/85">{s.detail}</span>
                  </span>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* ── VÖRURNAR ─────────────────────────────────────── */}
        <section id="vorur" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <Rise>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#d08a3a] uppercase">Vörurnar</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
              Reykt og grafið — beint úr kofanum
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#d8cfc2]/75">
              Verð eru sýnishorn. Pantað í sveitabúðinni eða sent heim innanlands.
            </p>
          </Rise>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Rise key={p.id} delay={i * 0.08}>
                {p.photoLight ? (
                  /* Hangikjöt — photo-light typographic tile (no honest stock photo). */
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#d08a3a]/30 bg-gradient-to-br from-[#221b14] via-[#1c1610] to-[#181410] p-6">
                    <DriftEmber
                      reduce={reduce}
                      className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
                    />
                    <div className="relative flex items-center justify-between">
                      <Flame className="h-6 w-6 text-[#d08a3a]" aria-hidden="true" />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#d8cfc2]/65 uppercase">
                        Árstíðabundið
                      </span>
                    </div>
                    <h3 className="relative mt-10 text-3xl font-[800] tracking-tight text-[#f3ece1]">
                      {p.name}
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-[#d8cfc2]/80">{p.line}</p>
                    <div className="relative mt-auto flex items-end justify-between pt-8">
                      <div>
                        <span className="block font-mono text-[10px] tracking-wide text-[#d8cfc2]/70">
                          {p.weight}
                        </span>
                        <span className="mt-1 block text-lg font-semibold text-[#d08a3a]">{p.price}</span>
                      </div>
                      <a
                        href="#hafa-samband"
                        className="rounded-full border border-[#d08a3a]/50 px-4 py-2.5 text-xs font-semibold tracking-wide text-[#f3ece1] transition-colors hover:bg-[#b5651d] hover:text-[#181410] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                      >
                        {p.cta}
                      </a>
                    </div>
                  </article>
                ) : (
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d8cfc2]/10 bg-[#221b14]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Img
                        src={p.img ?? card(HERO_ID)}
                        alt={p.alt ?? ''}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="bg-gradient-to-br from-[#221b14] via-[#181410] to-[#0f0c09]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#181410]/70 via-transparent to-transparent"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-[800] tracking-tight text-[#f3ece1]">{p.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#d8cfc2]/75">{p.line}</p>
                      <div className="mt-auto flex items-end justify-between pt-6">
                        <div>
                          <span className="block font-mono text-[10px] tracking-wide text-[#d8cfc2]/70">
                            {p.weight}
                          </span>
                          <span className="mt-1 block text-lg font-semibold text-[#d08a3a]">{p.price}</span>
                        </div>
                        <a
                          href="#hafa-samband"
                          className="rounded-full bg-[#c8731f] px-4 py-2.5 text-xs font-semibold tracking-wide text-[#181410] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
                        >
                          {p.cta}
                        </a>
                      </div>
                    </div>
                  </article>
                )}
              </Rise>
            ))}
          </div>
        </section>

        {/* ── REYKURINN — the process ──────────────────────── */}
        <section id="reykurinn" className="scroll-mt-20 border-y border-[#d8cfc2]/10 bg-[#221b14]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
            <Rise>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#d08a3a] uppercase">Reykurinn</p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
                Birki, hægur eldur og þolinmæði
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#d8cfc2]/80 md:text-base">
                Í kofanum úti í hrauninu reykjum við fiskinn hægt yfir íslensku birki. Engin gerviefni,
                enginn flýtir — bara reykur, salt og tími. Það er þessi gamli háttur sem gefur silungnum
                mjúka, ljúfa reykbragðið.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  'Aðeins íslenskt birki í eldinn',
                  'Hægreyking yfir birkireyk',
                  'Handflakað og hengt í kofanum',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#d8cfc2]/85">
                    <Flame className="mt-0.5 h-4 w-4 shrink-0 text-[#d08a3a]" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </Rise>

            <Rise delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden rounded-2xl">
                  <Img
                    src={card(IMGS.smoking, 900)}
                    alt="Eldur og reykur frá birki í reykkofanum"
                    className="aspect-[3/4] h-full w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#3a2310] via-[#221b14] to-[#181410]"
                  />
                </div>
                <div className="relative mt-8 overflow-hidden rounded-2xl">
                  <Img
                    src={card(IMGS.hanging, 900)}
                    alt="Fiskur hangir til reykingar inni í kofanum"
                    className="aspect-[3/4] h-full w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#221b14] via-[#181410] to-[#0f0c09]"
                  />
                </div>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── Frá vatni að borði — stepped reveal ──────────── */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Rise>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#d08a3a] uppercase">
              Frá vatni að borði
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.7rem,4.5vw,2.6rem)] leading-[1.08] font-[800] text-[#f3ece1]">
              Þrjú skref, engin millileið
            </h2>
          </Rise>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FLOW.map((s, i) => (
              <Rise key={s.n} delay={i * 0.14} className="h-full">
                <div className="relative flex h-full flex-col rounded-2xl border border-[#d8cfc2]/12 bg-[#221b14] p-6">
                  <span className="font-mono text-3xl font-[800] text-[#d08a3a]/70">{s.n}</span>
                  <h3 className="mt-4 text-lg font-[800] text-[#f3ece1]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d8cfc2]/80">{s.body}</p>
                  {i < FLOW.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 right-[-18px] hidden h-px w-9 bg-[#d08a3a]/40 md:block"
                    />
                  )}
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* ── MÝVATN — the place ───────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img
              src={card(IMGS.lava, 2000)}
              srcSet={`${card(IMGS.lava, 828)} 828w, ${card(IMGS.lava, 1280)} 1280w, ${card(IMGS.lava, 2000)} 2000w`}
              sizes="100vw"
              alt="Hraunbreiða í Mývatnssveit"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#3a2310] via-[#221b14] to-[#0f0c09]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#181410]/92 via-[#181410]/70 to-[#181410]/40"
            />
          </div>
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-32">
            <Rise>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#d08a3a] uppercase">Mývatn</p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.06] font-[800] text-[#f5efe4]">
                Staðurinn gerir bragðið
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#d8cfc2]/90 md:text-base">
                Mývatn er eitt tærasta og lífríkasta vatn landsins, umlukið hrauni og hverum. Silungurinn
                úr því er villtur og bragðmikill — og hraunið allt í kring er einmitt þar sem reykkofinn
                okkar stendur.
              </p>
            </Rise>
            <Rise delay={0.12}>
              <div className="overflow-hidden rounded-2xl border border-[#d8cfc2]/15 shadow-2xl shadow-black/50">
                <Img
                  src={card(IMGS.lake, 1100)}
                  alt="Mývatn í kvöldbirtu með hrauni við bakkann"
                  className="aspect-[4/3] h-full w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#221b14] via-[#1c1610] to-[#0f0c09]"
                />
              </div>
            </Rise>
          </div>
        </section>

        {/* ── SVEITABÚÐIN — farm shop ──────────────────────── */}
        <section
          id="sveitabudin"
          className="scroll-mt-20 border-y border-[#d8cfc2]/10 bg-[#221b14]"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
            <Rise>
              <div className="overflow-hidden rounded-2xl border border-[#d8cfc2]/12">
                <Img
                  src={card(IMGS.sign, 1100)}
                  alt="Skilti við litla sveitabúð úti á landi"
                  className="aspect-[4/3] h-full w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#3a2310] via-[#221b14] to-[#181410]"
                />
              </div>
            </Rise>
            <Rise delay={0.1}>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#d08a3a] uppercase">
                Litla sveitabúðin
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.06] font-[800] text-[#f3ece1]">
                Komdu við hjá okkur
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#d8cfc2]/80 md:text-base">
                Sveitabúðin okkar stendur við bæinn Hellu í Mývatnssveit, rétt við hringveginn. Þar færðu
                reyktan og grafinn silung beint úr kofanum, og hangikjöt eftir vigt um hátíðar.
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
                    <dd className="mt-1 text-sm text-[#f3ece1]">464 4000</dd>
                  </div>
                </div>
              </dl>
            </Rise>
          </div>
        </section>

        {/* ── Final CTA / contact ──────────────────────────── */}
        <section
          id="hafa-samband"
          className="relative scroll-mt-20 overflow-hidden bg-[#181410] px-5 py-24 md:py-32"
        >
          <DriftEmber
            reduce={reduce}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[60vw] max-h-[520px] w-[60vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <Rise>
              <Flame className="mx-auto h-7 w-7 text-[#d08a3a]" aria-hidden="true" />
              <h2 className="mt-5 text-[clamp(2.1rem,6vw,3.6rem)] leading-[1.05] font-[800] text-[#f5efe4]">
                Pantaðu eða komdu við
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#d8cfc2]/85 md:text-base">
                Sendu okkur fyrirspurn um reyktan silung og hangikjöt, eða líttu inn í sveitabúðina næst
                þegar þú átt leið um Mývatn.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${company.ownerEmail}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c8731f] px-8 py-4 text-sm font-semibold tracking-wide text-[#181410] shadow-xl shadow-black/40 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ece1]"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Senda fyrirspurn
                </a>
                <a
                  href="#sveitabudin"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc2]/35 px-8 py-4 text-sm font-semibold tracking-wide text-[#f3ece1] transition-colors hover:bg-[#d8cfc2]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d08a3a]"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Finna okkur
                </a>
              </div>
            </Rise>
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
          Panta reyktan silung
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
