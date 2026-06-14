import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { IMG, WATER, VISIT, TIPS } from './data'

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

/** Soft, slow scroll reveal — our own (not the shared Reveal). */
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
  { href: '#heimsokn', label: 'Heimsókn' },
  { href: '#opnunartimi', label: 'Opnunartími' },
]

export default function Page() {
  const reduce = useReducedMotion()
  const [showBar, setShowBar] = useState(false)
  const heroImgRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  /* Manual, passive parallax for the hero photo (no Framer useScroll —
     environment throttles rAF). Disabled under reduced motion. */
  useEffect(() => {
    document.title = 'Lýsulaugar — Græna lindin (hugmynd)'
    const onScrollBar = () => setShowBar(window.scrollY > 520)
    onScrollBar()
    window.addEventListener('scroll', onScrollBar, { passive: true })
    return () => window.removeEventListener('scroll', onScrollBar)
  }, [])

  useEffect(() => {
    if (reduce) return
    let ticking = false
    const apply = () => {
      ticking = false
      const sec = heroSectionRef.current
      const el = heroImgRef.current
      if (!sec || !el) return
      const rect = sec.getBoundingClientRect()
      // Only while the hero is on/near screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const shift = Math.max(-60, Math.min(60, -rect.top * 0.12))
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
            <a
              href="#heimsokn"
              lang="is"
              className="rounded-full bg-[#2f6b4f] px-4 py-2.5 text-sm font-semibold text-[#f6f2e8] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352a]"
            >
              Plana heimsókn
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ── HERO: the calm green water ──────────────────── */}
        <section ref={heroSectionRef} className="relative overflow-hidden">
          {/* Real steam photo, far back */}
          <div className="absolute inset-0">
            <div ref={heroImgRef} className="h-full w-full will-change-transform">
              <Img
                src={HERO}
                srcSet={HERO_SRCSET}
                sizes="100vw"
                alt="Gufa rís af jarðhitavatni í kyrru landslagi"
                className="h-full w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#3f8f63] via-[#2f6b4f] to-[#16352a]"
                fetchpriority="high"
                loading="eager"
              />
            </div>
            {/* Green wash over the honest photo — we render the green, not fake it */}
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background: `linear-gradient(150deg, ${ALGAE} 0%, ${MOSS} 55%, ${INK} 100%)`,
                opacity: 0.62,
              }}
              aria-hidden="true"
            />
            {/* Readability scrim toward the bottom where text sits */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${INK}f2 0%, ${INK}99 32%, transparent 72%)`,
              }}
              aria-hidden="true"
            />
            <GreenRipple reduce={!!reduce} />
          </div>

          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pt-32 pb-14 md:px-8 md:pb-24">
            {/* Floating rounded "pool" with the slow living gradient */}
            <Rise y={18}>
              <PoolGlass reduce={!!reduce} />
            </Rise>

            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-[#f6f2e8] uppercase ring-1 ring-white/25 backdrop-blur-sm"
            >
              <LeafMark className="h-3.5 w-3.5 text-[#bfe6cf]" />
              Snæfellsnes · steinefnaríkt vatn · opið yfir sumarið
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
              Sjaldgæf, græn steinefnalind á bæ undir Snæfellsjökli. Volgt, kolsýrt vatn,
              kyrrð og hægur tími — rólega andstæðan við fjölmennu böðin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.32, ease: EASE }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#heimsokn"
                lang="is"
                className="inline-flex items-center justify-center rounded-full bg-[#f6f2e8] px-6 py-3.5 text-sm font-semibold text-[#16352a] shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]"
              >
                Plana heimsókn
              </a>
              <a
                href="#vatnid"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-[#f6f2e8] ring-1 ring-white/40 backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]"
              >
                Um vatnið
              </a>
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
                      ['Vatnið', 'Grænt & kolsýrt'],
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

        {/* ── VATNIÐ: the green carbonated mineral water ───── */}
        <section id="vatnid" className="relative scroll-mt-20 overflow-hidden bg-[#16352a] text-[#f6f2e8]">
          {/* faint living-green field behind */}
          <GreenField reduce={!!reduce} />
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
                  Steinefnaríkt og náttúrulega kolsýrt jarðhitavatn með sínum sérstaka, græna blæ.
                  Mjúkt, volgt og róandi — það er hér sem Lýsulaugar skera sig úr.
                </p>
              </Rise>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {WATER.map((w, i) => (
                <Rise key={w.label} delay={0.08 * i} y={30}>
                  <article className="flex h-full flex-col rounded-[1.8rem] bg-[#f6f2e8]/[0.06] p-7 ring-1 ring-[#bfe6cf]/15 backdrop-blur-sm">
                    <span className="font-mono text-xs tracking-[0.16em] text-[#bfe6cf]">{w.label}</span>
                    <h3 className="mt-4 font-newsreader text-[1.4rem] leading-snug text-[#f6f2e8]">
                      {w.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#f6f2e8]/80">{w.body}</p>
                  </article>
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

        {/* ── STAÐURINN: the setting / farm ────────────────── */}
        <section className="relative bg-[#e7dfce]">
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
                    Lýsulaugar standa á starfandi bæ við Lýsuhól, þar sem hraunið er klætt mjúkum mosa
                    og Snæfellsjökull gnæfir yfir. Það er landið sjálft sem gefur tóninn: hægan,
                    jarðbundinn og kyrran.
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
        <section id="heimsokn" className="scroll-mt-20 bg-[#f6f2e8]">
          <div id="opnunartimi" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
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

            <div className="mt-12 grid gap-6 lg:grid-cols-12">
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
                <div className="flex h-full flex-col rounded-[2rem] bg-[#e7dfce] p-8 ring-1 ring-[#16352a]/8">
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
                    <a
                      href={VISIT.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      lang="is"
                      className="inline-flex items-center justify-center rounded-full bg-[#2f6b4f] px-5 py-3 text-sm font-semibold text-[#f6f2e8] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352a]"
                    >
                      Finna á korti
                    </a>
                    <a
                      href={`tel:${VISIT.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-[#16352a] ring-1 ring-[#16352a]/20 transition-colors hover:bg-[#16352a]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f]"
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
        <section className="bg-[#e7dfce]">
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
                Opið yfir sumarið, 11:00–21:00. Áttu leið um Snæfellsnes? Stoppaðu, andaðu og leyfðu
                deginum að hægja á sér.
              </p>
            </Rise>
            <Rise delay={0.16}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={VISIT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  lang="is"
                  className="inline-flex items-center justify-center rounded-full bg-[#f6f2e8] px-7 py-3.5 text-sm font-semibold text-[#16352a] shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]"
                >
                  Plana heimsókn
                </a>
                <a
                  href={`mailto:${VISIT.email}`}
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-[#f6f2e8] ring-1 ring-white/40 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfe6cf]"
                >
                  Hafa samband
                </a>
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
          className="flex w-full items-center justify-center rounded-full bg-[#2f6b4f] px-5 py-3 text-sm font-semibold text-[#f6f2e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352a]"
        >
          Plana heimsókn · Opnunartími
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── Signature pieces ─────────────────────────────────────── */

/**
 * The floating rounded "pool" — a glassy lozenge with a slow living green
 * gradient/ripple. Static under reduced motion.
 */
function PoolGlass({ reduce }: { reduce: boolean }) {
  return (
    <div
      className="mb-9 h-24 w-full max-w-md overflow-hidden rounded-[5rem] ring-1 ring-white/30 backdrop-blur-sm md:h-28"
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-[200%]"
        style={{
          background: `linear-gradient(100deg, ${ALGAE} 0%, ${MOSS} 26%, #2a7e58 50%, ${MOSS} 74%, ${ALGAE} 100%)`,
          backgroundSize: '50% 100%',
        }}
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={
          reduce ? undefined : { duration: 18, ease: 'linear', repeat: Infinity }
        }
      />
    </div>
  )
}

/**
 * Two slow concentric "ripples" drifting up over the hero photo — calming,
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
 * A faint, slow-drifting green radial field for dark sections — subtle
 * organic motion. Static (single gradient) under reduced motion.
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
