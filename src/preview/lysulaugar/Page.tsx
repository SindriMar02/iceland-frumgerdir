import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { IMG, WATER, FACILITIES, VISIT, TIPS } from './data'

const company = getPreviewCompany('lysulaugar')

/* Palette — warm, earthy GREEN (distinct from any teal elsewhere) */
const MOSS = '#2f6b4f'
const ALGAE = '#3f8f63'
const CREAM = '#f6f2e8'
const INK = '#16352a'
/* A lighter algae tint for small accent text on dark photo scrims (AA) */
const ALGAE_LIGHT = '#bfe6cf'

const HERO = `https://images.unsplash.com/${IMG.heroId}?q=80&w=2000&auto=format&fit=crop`
const HERO_SRCSET = [828, 1280, 2000]
  .map((w) => `https://images.unsplash.com/${IMG.heroId}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * Soft, slow scroll reveal — our own (not the shared Reveal).
 * Deliberately calm: rises once, settles, and never re-triggers. The page
 * "barely moves; the water keeps glowing."
 */
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
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Small leaf/drop mark used as a quiet ornament. */
function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 3c5 3.5 7 7 7 10.5A7 7 0 0 1 5 13.5C5 10 7 6.5 12 3Z"
        fill="currentColor"
      />
      <path d="M12 7v11" stroke={CREAM} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

const NAV = [
  { href: '#laugin', label: 'Laugin' },
  { href: '#vatnid', label: 'Vatnið' },
  { href: '#adstada', label: 'Aðstaða' },
  { href: '#heimsokn', label: 'Heimsókn' },
]

export default function Page() {
  const reduce = useReducedMotion()
  const [showBar, setShowBar] = useState(false)
  const heroImgRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = 'Lýsulaugar — Græna lindin (hugmynd)'
    const onScrollBar = () => setShowBar(window.scrollY > 520)
    onScrollBar()
    window.addEventListener('scroll', onScrollBar, { passive: true })
    return () => window.removeEventListener('scroll', onScrollBar)
  }, [])

  /* Near-static hold for the hero photo — a very gentle settle, not a travel
     parallax. The "motion" of this surface lives in the water, not the page.
     Manual passive scroll listener writing transform synchronously (Framer
     useScroll does not update in this preview). Disabled under reduced motion. */
  useEffect(() => {
    if (reduce) return
    let ticking = false
    const apply = () => {
      ticking = false
      const sec = heroSectionRef.current
      const el = heroImgRef.current
      if (!sec || !el) return
      const rect = sec.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      // Very small drift (0.05) — the page is meant to feel almost motionless.
      const shift = Math.max(-26, Math.min(26, -rect.top * 0.05))
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`
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
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#f6f2e8] font-sans text-[#16352a] antialiased"
    >
      <PreviewChrome company={company} />

      {/* ── Minimal sticky nav ───────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#16352a]/10 bg-[#f6f2e8]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <a
            href="#top"
            className="flex items-baseline gap-2 font-newsreader text-xl font-medium tracking-normal text-[#16352a] md:text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f] rounded-sm"
          >
            <span className="italic">Lýsulaugar</span>
            <span className="font-mono text-[10px] font-normal tracking-[0.18em] text-[#2f6b4f] uppercase not-italic">
              Græna&nbsp;lindin
            </span>
          </a>

          <div className="flex items-center gap-5">
            <ul className="hidden items-center gap-6 md:flex">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-sm font-medium text-[#16352a]/70 transition-colors hover:text-[#16352a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f] rounded-sm"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <WetButton href="#heimsokn" lang="is" variant="moss" size="sm">
              Plana heimsókn
            </WetButton>
          </div>
        </nav>
      </header>

      <main>
        {/* ── HERO: the calm, luminous GREEN water ───────────
            The hero IS green mineral water. We render the luminous water
            surface (layered green gradients) and carry the caustic-shimmer
            signature on it, so the brand hook and the signature are the same
            thing. A real photo sits underneath at low opacity purely as
            organic texture/depth — never dictating the scene. */}
        <section ref={heroSectionRef} className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Base: the green mineral-water surface itself */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 90% at 30% 18%, #4fa473 0%, ${ALGAE} 26%, ${MOSS} 58%, ${INK} 100%)`,
              }}
              aria-hidden="true"
            />
            {/* Real water photo as faint texture only, with a slow settle.
                Masked so it fades to nothing at the top — the literal lake
                scene dissolves into pure mineral-green water. */}
            <div ref={heroImgRef} className="absolute inset-0 will-change-transform">
              <Img
                src={HERO}
                srcSet={HERO_SRCSET}
                sizes="100vw"
                alt="Græn, steinefnarík náttúrulaug með kyrru vatnsborði"
                className="h-full w-full object-cover opacity-30 mix-blend-overlay"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.15) 78%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.15) 78%, transparent 100%)',
                }}
                fallbackClassName="bg-transparent"
                fetchpriority="high"
                loading="eager"
              />
            </div>
            {/* Deepen + unify into unmistakable mineral green */}
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background: `linear-gradient(155deg, ${ALGAE} 0%, ${MOSS} 50%, ${INK} 100%)`,
                opacity: 0.55,
              }}
              aria-hidden="true"
            />
            {/* Luminous algae-light core — the water glowing from within */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(70% 55% at 34% 30%, ${ALGAE_LIGHT}40 0%, transparent 62%)`,
              }}
              aria-hidden="true"
              animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }}
              transition={reduce ? undefined : { duration: 15, ease: 'easeInOut', repeat: Infinity }}
            />
            {/* THE SIGNATURE: caustic shimmer — sunlight refracting through
                green mineral water. The one motion no other surface has. */}
            <Caustics reduce={!!reduce} />
            {/* Readability scrim toward the bottom where text sits */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${INK}f2 0%, ${INK}a8 30%, ${INK}33 60%, transparent 80%)`,
              }}
              aria-hidden="true"
            />
            <GreenRipple reduce={!!reduce} />
          </div>

          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pt-32 pb-14 md:px-8 md:pb-24">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#16352a]/55 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-[#f6f2e8] uppercase ring-1 ring-white/30 backdrop-blur-sm"
            >
              <LeafMark className="h-3.5 w-3.5 text-[#bfe6cf]" />
              Snæfellsnes · steinefnaríkt grænt vatn
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-6 max-w-3xl font-newsreader text-[3rem] leading-[1.04] font-medium text-[#f6f2e8] md:text-[5.25rem]"
            >
              <span className="italic">Græna</span> lindin
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.2, ease: EASE }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[#f6f2e8]/90 md:text-lg"
            >
              Sjaldgæf, græn steinefnalind á bæ undir Snæfellsjökli. Volgt, steinefnaríkt vatn,
              kyrrð og hægur tími — rólega andstæðan við fjölmennu böðin.
            </motion.p>

            {/* Season + hours surfaced immediately for the passing traveller */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              {['15. maí – 31. ágúst', 'opið daglega 11–21', '~38°C laug'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-[#16352a]/45 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[#bfe6cf] uppercase ring-1 ring-[#bfe6cf]/25 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.4, ease: EASE }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <WetButton href="#heimsokn" lang="is" variant="cream" size="lg">
                Sjá opnunartíma og verð
              </WetButton>
              <WetButton href="#vatnid" variant="ghost" size="lg">
                Um grænu lindina
              </WetButton>
            </motion.div>
          </div>
        </section>

        {/* ── LAUGIN: the place at a glance ────────────────── */}
        <section id="laugin" className="relative scroll-mt-20 bg-[#f6f2e8]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <Rise>
                  <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#2f6b4f] uppercase">
                    Laugin
                  </p>
                </Rise>
                <Rise delay={0.05}>
                  <h2 className="mt-4 font-newsreader text-[2.1rem] leading-[1.12] font-medium text-[#16352a] md:text-[3rem]">
                    Hægur staður <span className="italic">undir jöklinum</span>
                  </h2>
                </Rise>
                <Rise delay={0.1}>
                  <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-[#16352a]/75">
                    Lítil náttúrulaug á starfandi bæ á sunnanverðu Snæfellsnesi. Hér er ekkert kapphlaup
                    — bara mosagróið land, gufa sem stígur upp og græna lindin sem finnst hvergi annars
                    staðar. Komdu og leyfðu deginum að hægja á sér.
                  </p>
                </Rise>
                <Rise delay={0.15}>
                  <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-[#16352a]/12 pt-7">
                    {[
                      ['Staðsetning', 'Lýsuhóll'],
                      ['Vatnið', 'Grænt & steinefnaríkt'],
                      ['Andrúmsloft', 'Rólegt'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[10px] tracking-[0.14em] text-[#2f6b4f] uppercase">
                          {k}
                        </dt>
                        <dd className="mt-1.5 font-newsreader text-lg text-[#16352a]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Rise>
              </div>

              <Rise delay={0.1} y={34}>
                <figure className="relative">
                  <div className="overflow-hidden rounded-[2.4rem] shadow-xl shadow-[#16352a]/15 ring-1 ring-[#16352a]/8">
                    <Img
                      src={IMG.wellnessA}
                      alt="Kyrrt, gufandi jarðhitavatn í náttúrulegri laug"
                      className="aspect-[4/5] w-full object-cover"
                      fallbackClassName="bg-gradient-to-br from-[#3f8f63] to-[#16352a]"
                    />
                  </div>
                  {/* small overlapping mossy chip */}
                  <div className="absolute -bottom-7 -left-5 hidden w-40 overflow-hidden rounded-[1.6rem] shadow-lg shadow-[#16352a]/25 ring-4 ring-[#f6f2e8] sm:block">
                    <Img
                      src={IMG.mossA}
                      alt="Mosagróið hraun á Snæfellsnesi"
                      className="aspect-square w-full object-cover"
                      fallbackClassName="bg-gradient-to-br from-[#2f6b4f] to-[#16352a]"
                    />
                  </div>
                </figure>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── VATNIÐ: the green mineral water ──────────────── */}
        <section id="vatnid" className="relative scroll-mt-20 overflow-hidden bg-[#16352a] text-[#f6f2e8]">
          {/* faint living-green field + caustic light behind */}
          <GreenField reduce={!!reduce} />
          <Caustics reduce={!!reduce} band />
          <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="max-w-2xl">
              <Rise>
                <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#bfe6cf] uppercase">
                  Vatnið
                </p>
              </Rise>
              <Rise delay={0.05}>
                <h2 className="mt-4 font-newsreader text-[2.1rem] leading-[1.12] font-medium md:text-[3.1rem]">
                  Vatn sem er <span className="italic text-[#bfe6cf]">grænt</span> af náttúrunnar hendi
                </h2>
              </Rise>
              <Rise delay={0.1}>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-[#f6f2e8]/85">
                  Steinefnaríkt jarðhitavatn með sínum sérstaka, græna blæ — liturinn kemur frá
                  klórellu, grænþörungum sem þrífast í lindinni. Mjúkt, volgt og róandi; það er hér
                  sem Lýsulaugar skera sig úr.
                </p>
              </Rise>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {WATER.map((w, i) => (
                <Rise key={w.label} delay={0.08 * i} y={30}>
                  <WaterCard label={w.label} title={w.title} body={w.body} reduce={!!reduce} />
                </Rise>
              ))}
            </div>

            <Rise delay={0.12} className="mt-12">
              <p className="max-w-xl text-xs leading-relaxed text-[#f6f2e8]/55">
                Lýsulaugar bjóða upp á slökun í náttúrulegu umhverfi. Hér eru engin loforð um lækningu —
                bara rólegt bað, hreint loft og kyrrð undir jöklinum.
              </p>
            </Rise>
          </div>
        </section>

        {/* ── AÐSTAÐA: real facilities (the proof) ─────────── */}
        <section id="adstada" className="relative scroll-mt-20 bg-[#e7dfce]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <Rise>
                  <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#2f6b4f] uppercase">
                    Aðstaða
                  </p>
                </Rise>
                <Rise delay={0.05}>
                  <h2 className="mt-4 font-newsreader text-[2.1rem] leading-[1.12] font-medium text-[#16352a] md:text-[3rem]">
                    Lítil laug, <span className="italic">raunveruleg aðstaða</span>
                  </h2>
                </Rise>
                <Rise delay={0.1}>
                  <p className="mt-5 text-[1.02rem] leading-relaxed text-[#16352a]/75">
                    Aðstaðan var öll endurnýjuð árið 2019: aðallaugin með grænu steinefnalindinni um
                    38°C, tveir heitir pottar, köld ískelda fyrir þá sem þora, og lítið kaffihús þar
                    sem þú getur sest niður á eftir.
                  </p>
                </Rise>
              </div>

              {/* Number-led facility cards — vertical-rule treatment, not glass boxes */}
              <div className="md:col-span-7">
                <Rise delay={0.08} y={30}>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-8 sm:gap-x-12">
                    {FACILITIES.map((f) => (
                      <div key={f.label} className="border-l-2 border-[#2f6b4f]/35 pl-4">
                        <dt className="font-mono text-[10px] tracking-[0.16em] text-[#2f6b4f] uppercase">
                          {f.label}
                        </dt>
                        <dd className="mt-1.5 font-newsreader text-[2rem] leading-none text-[#16352a]">
                          {f.value}
                        </dd>
                        <dd className="mt-2 text-sm leading-relaxed text-[#16352a]/70">{f.note}</dd>
                      </div>
                    ))}
                  </dl>
                </Rise>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAÐURINN: the setting / farm ────────────────── */}
        <section className="relative bg-[#f6f2e8]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <Rise>
                  <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#2f6b4f] uppercase">
                    Staðurinn
                  </p>
                </Rise>
                <Rise delay={0.05}>
                  <h2 className="mt-4 font-newsreader text-[2.1rem] leading-[1.12] font-medium text-[#16352a] md:text-[3rem]">
                    Á bæ í <span className="italic">mosagrónu</span> landi
                  </h2>
                </Rise>
                <Rise delay={0.1}>
                  <p className="mt-5 text-[1.02rem] leading-relaxed text-[#16352a]/75">
                    Lýsulaugar standa á starfandi bæ við Lýsuhól í Staðarsveit, þar sem hraunið er
                    klætt mjúkum mosa og Snæfellsjökull gnæfir yfir. Það er landið sjálft sem gefur
                    tóninn: hægan, jarðbundinn og kyrran.
                  </p>
                </Rise>
              </div>

              <div className="md:col-span-7">
                <Rise delay={0.08} y={32}>
                  <div className="grid grid-cols-2 gap-4">
                    <figure className="col-span-2 overflow-hidden rounded-[2rem] shadow-lg shadow-[#16352a]/12 ring-1 ring-[#16352a]/8">
                      <Img
                        src={IMG.mossB}
                        alt="Víðáttumikið mosagróið landslag á Snæfellsnesi"
                        className="aspect-[16/9] w-full object-cover"
                        fallbackClassName="bg-gradient-to-br from-[#3f8f63] to-[#2f6b4f]"
                      />
                    </figure>
                    <figure className="overflow-hidden rounded-[1.6rem] shadow-lg shadow-[#16352a]/12 ring-1 ring-[#16352a]/8">
                      <Img
                        src={IMG.farm}
                        alt="Sveitabær með fjöllum í baksýn"
                        className="aspect-square w-full object-cover"
                        fallbackClassName="bg-gradient-to-br from-[#2f6b4f] to-[#16352a]"
                      />
                    </figure>
                    <figure className="overflow-hidden rounded-[1.6rem] shadow-lg shadow-[#16352a]/12 ring-1 ring-[#16352a]/8">
                      <Img
                        src={IMG.wellnessB}
                        alt="Gufa rís upp af heitri náttúrulaug"
                        className="aspect-square w-full object-cover"
                        fallbackClassName="bg-gradient-to-br from-[#3f8f63] to-[#16352a]"
                      />
                    </figure>
                  </div>
                </Rise>
              </div>
            </div>
          </div>
        </section>

        {/* ── HEIMSÓKN / OPNUNARTÍMI: the practical block ───── */}
        <section id="heimsokn" className="scroll-mt-20 bg-[#e7dfce]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Rise>
              <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#2f6b4f] uppercase">
                Heimsókn · Opnunartími
              </p>
            </Rise>
            <Rise delay={0.05}>
              <h2 className="mt-4 max-w-2xl font-newsreader text-[2.1rem] leading-[1.12] font-medium text-[#16352a] md:text-[3rem]">
                Allt sem þú þarft til að <span className="italic">plana heimsókn</span>
              </h2>
            </Rise>

            {/* Quick reassurance chips pulled up near the action */}
            <Rise delay={0.1}>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {['Tekið við korti', 'Sturta skyld fyrir bað', 'Ekki hægt að bóka — komdu við', 'Fjölskylduvænt'].map(
                  (chip) => (
                    <li
                      key={chip}
                      className="rounded-full bg-[#16352a]/8 px-3.5 py-1.5 text-xs font-medium text-[#16352a]/75 ring-1 ring-[#16352a]/10"
                    >
                      {chip}
                    </li>
                  ),
                )}
              </ul>
            </Rise>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              {/* Season + hours */}
              <Rise y={28} className="lg:col-span-5">
                <div className="flex h-full flex-col gap-7 rounded-[2rem] bg-[#16352a] p-8 text-[#f6f2e8] md:p-9">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] text-[#bfe6cf] uppercase">
                      Tímabil
                    </p>
                    <p className="mt-2 font-newsreader text-[1.9rem] leading-tight">{VISIT.season}</p>
                  </div>
                  <div className="border-t border-[#bfe6cf]/20 pt-7">
                    <p className="font-mono text-[10px] tracking-[0.16em] text-[#bfe6cf] uppercase">
                      Opið daglega
                    </p>
                    <p className="mt-2 font-newsreader text-[1.9rem] leading-tight">{VISIT.daily}</p>
                    <p className="mt-2 text-sm text-[#f6f2e8]/70">
                      Opið alla daga á tímabilinu. Lokað utan sumars.
                    </p>
                  </div>
                </div>
              </Rise>

              {/* Prices */}
              <Rise delay={0.07} y={28} className="lg:col-span-3">
                <div className="flex h-full flex-col rounded-[2rem] bg-white p-8 ring-1 ring-[#16352a]/8">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#2f6b4f] uppercase">
                    Aðgangseyrir
                  </p>
                  <ul className="mt-4 flex flex-col divide-y divide-[#16352a]/12">
                    {VISIT.prices.map((p) => (
                      <li key={p.who} className="flex items-baseline justify-between gap-3 py-3">
                        <span className="text-sm text-[#16352a]/80">{p.who}</span>
                        <span className="font-newsreader text-lg text-[#16352a]">{p.price}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-5 text-[11px] leading-relaxed text-[#16352a]/70">
                    Verð eru sýnishorn.
                  </p>
                </div>
              </Rise>

              {/* How to find + map */}
              <Rise delay={0.14} y={28} className="lg:col-span-4">
                <div className="flex h-full flex-col rounded-[2rem] bg-white p-8 ring-1 ring-[#16352a]/8 shadow-sm">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#2f6b4f] uppercase">
                    Hvar
                  </p>
                  <p className="mt-3 font-newsreader text-xl leading-snug text-[#16352a]">
                    {VISIT.address}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#16352a]/70">
                    Sunnanvert Snæfellsnes, skammt frá Lýsuhóli. Skiltað af þjóðvegi.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <WetButton href={VISIT.mapUrl} external lang="is" variant="moss" size="sm">
                      Finna á korti
                    </WetButton>
                    <a
                      href={`tel:${VISIT.phone.replace(/\s/g, '')}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-[#16352a] ring-1 ring-[#16352a]/20 transition-colors hover:bg-[#16352a]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]"
                    >
                      Hringja · {VISIT.phone}
                    </a>
                  </div>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── GOTT AÐ VITA: practical tips ─────────────────── */}
        <section className="bg-[#f6f2e8]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <Rise>
              <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#2f6b4f] uppercase">
                Gott að vita
              </p>
            </Rise>
            <Rise delay={0.05}>
              <h2 className="mt-4 font-newsreader text-[1.9rem] leading-[1.14] font-medium text-[#16352a] md:text-[2.6rem]">
                Áður en þú <span className="italic">kíkir í bað</span>
              </h2>
            </Rise>
            <div className="mt-11 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {TIPS.map((t, i) => (
                <Rise key={t.title} delay={0.06 * i} y={22}>
                  <div className="flex gap-4">
                    <LeafMark className="mt-0.5 h-5 w-5 shrink-0 text-[#2f6b4f]" />
                    <div>
                      <h3 className="font-newsreader text-xl text-[#16352a]">{t.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#16352a]/72">{t.body}</p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#16352a] text-[#f6f2e8]">
          <GreenField reduce={!!reduce} subtle />
          <Caustics reduce={!!reduce} band />
          <div className="relative mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
            <Rise>
              <LeafMark className="mx-auto h-8 w-8 text-[#bfe6cf]" />
            </Rise>
            <Rise delay={0.05}>
              <h2 className="mt-6 font-newsreader text-[2.4rem] leading-[1.1] font-medium md:text-[3.6rem]">
                Komdu og finndu <span className="italic text-[#bfe6cf]">grænu lindina</span>
              </h2>
            </Rise>
            <Rise delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[#f6f2e8]/85">
                Opið 15. maí–31. ágúst, daglega 11–21. Áttu leið um Snæfellsnes? Stoppaðu, andaðu og
                leyfðu deginum að hægja á sér.
              </p>
            </Rise>
            <Rise delay={0.16}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <WetButton href={VISIT.mapUrl} external lang="is" variant="cream" size="lg">
                  Finna á korti
                </WetButton>
                <WetButton href={`mailto:${VISIT.email}`} variant="ghost" size="lg">
                  Hafa samband
                </WetButton>
              </div>
            </Rise>
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#16352a]/10 bg-[#f6f2e8]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href="#heimsokn"
          lang="is"
          className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#2f6b4f] px-5 py-3 text-sm font-semibold text-[#f6f2e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352a]"
        >
          Opnunartími og verð
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── Liquid CTA ───────────────────────────────────────────── */

/**
 * A button that behaves like water: on hover a soft radial "wet sheen"
 * drifts across the surface (~600ms) and the fill deepens one step, paired
 * with a small lift so it reads as surface tension, not a mechanical pop.
 * Reduced motion keeps the lift/colour but skips the travelling sheen.
 */
function WetButton({
  href,
  children,
  variant,
  size,
  external = false,
  lang,
}: {
  href: string
  children: ReactNode
  variant: 'moss' | 'cream' | 'ghost'
  size: 'sm' | 'lg'
  external?: boolean
  lang?: string
}) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)

  const sizeCx =
    size === 'lg' ? 'px-6 py-3.5 text-sm' : 'px-5 py-3 text-sm'
  const base =
    'group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full font-semibold transition-[transform,background-color,box-shadow,color] duration-300 hover:-translate-y-0.5'

  const variantCx =
    variant === 'moss'
      ? 'bg-[#2f6b4f] text-[#f6f2e8] hover:bg-[#27593f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352a]'
      : variant === 'cream'
        ? 'bg-[#f6f2e8] text-[#16352a] shadow-lg shadow-black/30 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]'
        : 'text-[#f6f2e8] ring-1 ring-white/40 backdrop-blur-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]'

  // Sheen tint adapts to button luminance so it always reads as wet light.
  const sheen =
    variant === 'cream'
      ? 'rgba(63,143,99,0.30)'
      : 'rgba(255,255,255,0.45)'

  return (
    <a
      href={href}
      lang={lang}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${base} ${sizeCx} ${variantCx}`}
    >
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={false}
          animate={hover ? { x: ['-60%', '60%'], opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            background: `radial-gradient(40% 120% at 0% 50%, ${sheen} 0%, transparent 70%)`,
          }}
        />
      )}
      <span className="relative">{children}</span>
    </a>
  )
}

/* ── Signature pieces ─────────────────────────────────────── */

/**
 * THE SIGNATURE: a continuous, slow CAUSTIC SHIMMER — layered very-low-opacity
 * light bands that drift and overlap, evoking sunlight refracting through
 * green mineral water. Multiple offset layers at different durations so the
 * pattern never visibly repeats. This is the one motion no other surface has:
 * organic light on water, not movement of objects.
 *
 * `band` = tuned for dark sections (uses light algae bands).
 * Fully removed under reduced motion (a still luminous-green wash remains
 * from the underlying gradients).
 */
function Caustics({ reduce, band = false }: { reduce: boolean; band?: boolean }) {
  if (reduce) return null
  const tint = band ? ALGAE_LIGHT : CREAM
  // Three offset light-band layers, each a soft diagonal stripe gradient that
  // drifts on a different long loop. Opacity breathes so highlights overlap.
  const layers: { dur: number; x: [string, string]; op: [number, number, number]; angle: number }[] = [
    { dur: 13, x: ['-8%', '8%'], op: [0.0, band ? 0.1 : 0.16, 0.0], angle: 18 },
    { dur: 19, x: ['6%', '-6%'], op: [0.0, band ? 0.08 : 0.13, 0.0], angle: -24 },
    { dur: 9, x: ['-5%', '5%'], op: [0.0, band ? 0.07 : 0.1, 0.0], angle: 8 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {layers.map((l, i) => (
        <motion.div
          key={i}
          className="absolute -inset-x-[20%] -inset-y-[10%]"
          style={{
            background: `repeating-linear-gradient(${l.angle}deg, transparent 0px, transparent 60px, ${tint} 110px, transparent 170px, transparent 240px)`,
            mixBlendMode: 'soft-light',
          }}
          animate={{ x: l.x, opacity: l.op }}
          transition={{ duration: l.dur, ease: 'easeInOut', repeat: Infinity, delay: i * 1.6 }}
        />
      ))}
    </div>
  )
}

/**
 * Two slow concentric "ripples" drifting up over the hero water — calming,
 * very low opacity. Gated off under reduced motion.
 */
function GreenRipple({ reduce }: { reduce: boolean }) {
  if (reduce) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 bottom-[12%] h-[60vw] w-[60vw] max-h-[520px] max-w-[520px] -translate-x-1/2 rounded-full"
          style={{
            border: `1px solid ${ALGAE_LIGHT}`,
            opacity: 0.0,
          }}
          animate={{ scale: [0.4, 1.5], opacity: [0, 0.16, 0] }}
          transition={{
            duration: 11,
            ease: 'easeOut',
            repeat: Infinity,
            delay: i * 5.5,
          }}
        />
      ))}
    </div>
  )
}

/**
 * A faint, slow-drifting green radial field for dark sections — a 12–16s
 * opacity+hue "breath" so the green looks alive and mineral. Static (single
 * gradient) under reduced motion.
 */
function GreenField({ reduce, subtle = false }: { reduce: boolean; subtle?: boolean }) {
  const base = (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(60% 70% at 78% 18%, ${ALGAE}55 0%, transparent 60%), radial-gradient(55% 65% at 12% 92%, ${MOSS}55 0%, transparent 62%)`,
        opacity: subtle ? 0.5 : 0.7,
      }}
      aria-hidden="true"
    />
  )
  if (reduce) return base
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(60% 70% at 78% 18%, ${ALGAE}55 0%, transparent 60%), radial-gradient(55% 65% at 12% 92%, ${MOSS}55 0%, transparent 62%)`,
      }}
      aria-hidden="true"
      animate={{ opacity: subtle ? [0.4, 0.6, 0.4] : [0.55, 0.8, 0.55] }}
      transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
    />
  )
}

/**
 * Vatnið water card — gets a faint INNER GLOW brightening on hover (ring +
 * background lighten) rather than a lift/scale, so it feels like surface
 * tension catching light. Honours reduced motion via CSS transitions only.
 */
function WaterCard({
  label,
  title,
  body,
  reduce,
}: {
  label: string
  title: string
  body: string
  reduce: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] bg-[#f6f2e8]/[0.06] p-7 ring-1 ring-[#bfe6cf]/15 backdrop-blur-sm transition-[background-color,box-shadow] duration-500 hover:bg-[#f6f2e8]/[0.1] hover:ring-[#bfe6cf]/35"
    >
      {/* inner glow that breathes brighter on hover */}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={false}
          animate={{ opacity: hover ? 0.5 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            background: `radial-gradient(70% 60% at 50% 0%, ${ALGAE_LIGHT}33 0%, transparent 70%)`,
          }}
        />
      )}
      <span className="relative font-mono text-xs tracking-[0.16em] text-[#bfe6cf]">{label}</span>
      <h3 className="relative mt-4 font-newsreader text-[1.4rem] leading-snug text-[#f6f2e8]">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-[#f6f2e8]/80">{body}</p>
    </article>
  )
}
