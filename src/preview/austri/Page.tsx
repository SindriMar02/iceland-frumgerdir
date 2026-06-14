import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Beer,
  ChevronDown,
  Clock,
  Instagram,
  MapPin,
  Mountain,
  Phone,
  Wheat,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import {
  BARLEY_ID,
  BEERS,
  GLASS_ID,
  HERO_ID,
  LANDSCAPE_ID,
  STOCKISTS,
  TANKS_ID,
  TAPROOM_ID,
  VOICES,
  img,
} from './data'

const company = getPreviewCompany('austri')

const U = 'https://images.unsplash.com/'
const heroSrc = `${U}${HERO_ID}?q=80&w=2000&auto=format&fit=crop`
const heroSrcSet = [828, 1280, 2000]
  .map((w) => `${U}${HERO_ID}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

const EASE = [0.22, 1, 0.36, 1] as const

/* ------------------------------------------------------------------ */
/* Own motion primitive — IntersectionObserver-based (whileInView).    */
/* No shared Reveal; no scroll-linked layout transforms.               */
/* ------------------------------------------------------------------ */
function Rise({
  children,
  delay = 0,
  y = 22,
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
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* Section eyebrow label — accent-aware via the swapping CSS var */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium tracking-[0.32em] text-[color:var(--soft)] uppercase transition-colors duration-700">
      {children}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* SIGNATURE — interactive tap list.                                   */
/* Selecting a beer swaps the page accent (CSS vars) + reveals notes.  */
/* Hover selects on desktop; click/tap on every device. Smooth colour  */
/* transition, no scroll-jack. Degrades to a tap-to-expand list.       */
/* ------------------------------------------------------------------ */
function TapList({ onAccentChange }: { onAccentChange: (i: number) => void }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const beer = BEERS[active]

  function select(i: number) {
    setActive(i)
    onAccentChange(i)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      {/* The list of taps */}
      <ul className="flex flex-col" role="list">
        {BEERS.map((b, i) => {
          const on = i === active
          return (
            <li key={b.name}>
              <button
                type="button"
                onClick={() => select(i)}
                onMouseEnter={() => select(i)}
                onFocus={() => select(i)}
                aria-pressed={on}
                style={{ '--c': b.accent, '--s': b.accentSoft } as CSSProperties}
                className={`group flex w-full items-center gap-4 border-b border-white/[0.08] py-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--s)] sm:gap-5 sm:py-6 ${
                  on ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Tap number */}
                <span
                  className={`font-mono text-xs tabular-nums transition-colors duration-300 ${
                    on ? 'text-[color:var(--s)]' : 'text-white/35'
                  }`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Active marker bar */}
                <span
                  aria-hidden="true"
                  className={`h-9 w-[3px] shrink-0 rounded-full transition-all duration-300 ${
                    on ? 'bg-[color:var(--c)]' : 'bg-white/10 group-hover:bg-white/25'
                  }`}
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={`font-grotesk text-2xl leading-[1.1] font-bold tracking-normal transition-colors duration-300 sm:text-3xl ${
                        on ? 'text-[#f1ead9]' : 'text-white/75 group-hover:text-[#f1ead9]'
                      }`}
                    >
                      {b.name}
                    </span>
                    <span className="font-sans text-sm text-white/55">{b.style}</span>
                  </span>
                </span>

                {/* ABV — mono spec voice */}
                <span className="shrink-0 text-right">
                  <span
                    className={`block font-mono text-base font-bold tabular-nums transition-colors duration-300 ${
                      on ? 'text-[color:var(--s)]' : 'text-white/55'
                    }`}
                  >
                    {b.abv}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-white/55 uppercase">ABV</span>
                </span>
              </button>
            </li>
          )
        })}
        <li>
          <a
            href="#heimsokn"
            lang="is"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-white/55 uppercase transition-colors hover:text-[#f1ead9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soft)]"
          >
            Hvar á að smakka
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </li>
      </ul>

      {/* The selected beer — notes, spec, landmark. Glass + accent wash. */}
      <div className="relative">
        <div className="lg:sticky lg:top-24">
          <motion.div
            key={beer.name}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ '--c': beer.accent, '--s': beer.accentSoft } as CSSProperties}
            className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#16241c]"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <Img
                src={img(GLASS_ID, 1200)}
                alt={`Glas af handverksbjór sem stendur fyrir ${beer.name}`}
                className="h-full w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#c8772b] via-[#16241c] to-[#0e1a14]"
              />
              {/* Accent wash — transitions with the swap */}
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-colors duration-700"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, #16241c 4%, color-mix(in oklab, var(--c) 38%, transparent) 60%, transparent 100%)',
                }}
              />
              <span
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#0e1a14]/75 px-3 py-1.5 font-mono text-[11px] tracking-wide text-[color:var(--s)] backdrop-blur-sm"
              >
                <Beer className="h-3.5 w-3.5" aria-hidden="true" />
                Á krana núna
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-grotesk text-3xl leading-[1.08] font-bold text-[#f1ead9] sm:text-4xl">
                    {beer.name}
                  </h3>
                  <p className="mt-1.5 font-sans text-sm text-white/55">{beer.style}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block font-mono text-2xl font-bold tabular-nums text-[color:var(--s)]">
                    {beer.abv}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-white/35 uppercase">
                    {beer.ibu} IBU
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {beer.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color:var(--c)]/40 bg-[color:var(--c)]/[0.12] px-3 py-1 font-mono text-[11px] tracking-wide text-[color:var(--s)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-[#d8d0bd]">{beer.notes}</p>

              <div className="mt-6 flex items-start gap-3 border-t border-white/[0.08] pt-5">
                <Mountain className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--s)]" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-white/65">
                  <span className="font-semibold text-[#f1ead9]">Nefndur eftir {beer.landmark}</span>
                  <span className="mt-0.5 block text-white/50">{beer.landmarkNote}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile sticky CTA — find on tap / visit the taproom.                */
/* ------------------------------------------------------------------ */
function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0e1a14]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-grotesk text-sm font-bold text-[#f1ead9]">Austri Brugghús</p>
          <p className="truncate font-mono text-[11px] text-white/50">Egilsstaðir · á krana víða</p>
        </div>
        <a
          href="#heimsokn"
          lang="is"
          className="shrink-0 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-bold text-[#0e1a14] transition-colors duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Finna á krana
        </a>
      </div>
    </div>
  )
}

const NAV = [
  { href: '#bjorinn', label: 'Bjórinn' },
  { href: '#brugghusid', label: 'Brugghúsið' },
  { href: '#heimsokn', label: 'Heimsókn' },
  { href: '#hafa-samband', label: 'Hafa samband' },
]

export default function Page() {
  const reduce = useReducedMotion()
  // The live page accent — swaps when a beer is chosen on the tap list.
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Austri Brugghús — Fjallabjór (hugmynd)'
  }, [])

  // Write the accent CSS vars synchronously on the root container so the whole
  // page (CTAs, eyebrows, marks) re-tints with one smooth transition.
  function setAccent(i: number) {
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--accent', BEERS[i].accent)
    el.style.setProperty('--soft', BEERS[i].accentSoft)
  }

  return (
    <div
      ref={rootRef}
      lang="is"
      className="min-h-screen scroll-smooth bg-[#0e1a14] font-sans text-[#f1ead9] antialiased"
      style={{ '--accent': BEERS[0].accent, '--soft': BEERS[0].accentSoft } as CSSProperties}
    >
      <PreviewChrome company={company} />
      <MobileBar />

      {/* Sticky nav */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[0.07] bg-[#0e1a14]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-10">
          <a
            href="#top"
            className="flex items-center gap-2.5 pl-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soft)] md:pl-12"
          >
            <Mountain className="h-5 w-5 text-[color:var(--accent)] transition-colors duration-700" aria-hidden="true" />
            <span className="font-grotesk text-base font-bold tracking-normal text-[#f1ead9]">Austri</span>
          </a>
          <nav className="flex items-center gap-6 md:gap-7" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hidden font-sans text-sm text-white/60 transition-colors hover:text-[#f1ead9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soft)] md:inline"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#heimsokn"
              className="rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-bold text-[#0e1a14] transition-colors duration-700 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Finna á krana
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Img
          src={heroSrc}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt="Gylltum handverksbjór hellt í glas, freyðandi kragi efst"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchpriority="high"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#3a2a16] via-[#16241c] to-[#0e1a14]"
        />
        {/* Scrim for AA contrast on light text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a14] via-[#0e1a14]/72 to-[#0e1a14]/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-colors duration-700"
          style={{
            backgroundImage:
              'radial-gradient(120% 90% at 15% 100%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 md:px-10 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: EASE }}
            className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.3em] text-[color:var(--soft)] uppercase transition-colors duration-700"
          >
            <Mountain className="h-4 w-4" aria-hidden="true" />
            Handverksbrugghús · Austurland
          </motion.p>

          <h1 className="mt-5 max-w-4xl font-grotesk text-[15vw] leading-[1.02] font-bold text-balance sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
              className="block py-[0.04em]"
            >
              Bjór úr
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.7, ease: EASE }}
              className="block py-[0.04em] text-[color:var(--accent)] transition-colors duration-700"
            >
              fjöllunum
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.7, ease: EASE }}
            className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-[#d8d0bd] md:text-lg">
              Handverksbrugghús á Egilsstöðum. Hver bjór er nefndur eftir fjalli eða kennileiti á
              Austurlandi — Austurland í glasi, bruggað með íslensku byggi.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#bjorinn"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-7 py-4 text-sm font-bold tracking-wide text-[#0e1a14] shadow-xl transition-all duration-700 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Skoða bjórinn
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#heimsokn"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soft)]"
              >
                Finna á krana
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-white/55 uppercase sm:gap-x-4"
          >
            {['Egilsstaðir', 'síðan 2015', 'á krana víða'].map((t, i) => (
              <li key={t} className="flex items-center gap-3 sm:gap-4">
                {i > 0 && <span aria-hidden="true" className="text-[color:var(--soft)] transition-colors duration-700">·</span>}
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {!reduce && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/55"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        )}
      </section>

      {/* THE TAP LIST — signature */}
      <section id="bjorinn" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Rise className="max-w-2xl">
            <Eyebrow>Tap-línan</Eyebrow>
            <h2 className="mt-4 font-grotesk text-4xl leading-[1.05] font-bold text-balance md:text-6xl">
              Veldu fjall. Sjáðu bjórinn.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#c8c0ad]">
              Hver bjór ber nafn fjalls eða kennileitis á Austurlandi. Veldu úr listanum — síðan
              tekur lit bjórsins og sýnir bragðnótur, styrk og kennileitið að baki. Bragðnótur og
              styrkur eru sýnishorn; spurðu eftir núverandi línu á krana.
            </p>
          </Rise>

          <Rise delay={0.1} className="mt-12">
            <TapList onAccentChange={setAccent} />
          </Rise>
        </div>
      </section>

      {/* BRUGGHÚSIÐ — story */}
      <section id="brugghusid" className="scroll-mt-20 border-y border-white/[0.07] bg-[#16241c] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Rise>
              <Eyebrow>Brugghúsið</Eyebrow>
              <h2 className="mt-4 font-grotesk text-4xl leading-[1.06] font-bold text-balance md:text-5xl">
                Bruggað þar sem fjöllin enda
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#c8c0ad]">
                Austri var stofnaður á Egilsstöðum árið 2015 með einfaldri hugmynd: að brugga bjór
                sem bragðast eins og Austurland. Á milli Lagarfljóts og fjallanna spruttu fyrstu
                bjórarnir — hver og einn nefndur eftir kennileiti sem heimamenn þekkja.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#c8c0ad]">
                Við bruggum með byggi sem ræktað er í Vallanesi, örfáa kílómetra frá kötlunum.
                Vatnið kemur úr austfirsku bergi. Útkoman er bjór með rætur — Austurland í glasi.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Wheat, big: 'Vallanes', small: 'íslenskt bygg' },
                  { icon: Mountain, big: '2015', small: 'fyrsta bruggun' },
                  { icon: Beer, big: '5+', small: 'bjórar á krana' },
                ].map((s) => (
                  <div key={s.big} className="rounded-2xl border border-white/[0.08] bg-[#0e1a14] p-4">
                    <s.icon className="h-5 w-5 text-[color:var(--soft)] transition-colors duration-700" aria-hidden="true" />
                    <p className="mt-3 font-grotesk text-xl font-bold text-[#f1ead9]">{s.big}</p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-wider text-white/55 uppercase">
                      {s.small}
                    </p>
                  </div>
                ))}
              </div>
            </Rise>

            <Rise delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-white/[0.08]">
                <Img
                  src={img(TANKS_ID, 1200)}
                  alt="Glansandi stálkatlar í brugghúsi Austra"
                  className="aspect-[4/5] w-full object-cover"
                  fallbackClassName="aspect-[4/5] bg-gradient-to-br from-[#c8772b] via-[#16241c] to-[#0e1a14]"
                />
              </div>
            </Rise>
          </div>

          {/* Barley + landscape strip */}
          <div className="mt-12 grid gap-4 sm:grid-cols-5">
            <Rise delay={0.05} className="sm:col-span-2">
              <figure className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
                <Img
                  src={img(BARLEY_ID, 1000)}
                  alt="Þroskað byggax bærist í vindi"
                  className="aspect-[4/3] w-full object-cover sm:aspect-square"
                  fallbackClassName="aspect-[4/3] bg-gradient-to-br from-[#c9a23f] to-[#0e1a14] sm:aspect-square"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#0e1a14]/75 px-3 py-1 font-mono text-[10px] tracking-wide text-[#d8d0bd] uppercase backdrop-blur-sm">
                  Bygg frá Vallanesi
                </figcaption>
              </figure>
            </Rise>
            <Rise delay={0.12} className="sm:col-span-3">
              <figure className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
                <Img
                  src={img(LANDSCAPE_ID, 1400)}
                  alt="Fjöll og víðerni á Austurlandi"
                  className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] sm:h-full"
                  fallbackClassName="aspect-[4/3] bg-gradient-to-br from-[#16241c] to-[#0e1a14] sm:aspect-[16/9]"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#0e1a14]/75 px-3 py-1 font-mono text-[10px] tracking-wide text-[#d8d0bd] uppercase backdrop-blur-sm">
                  Austurland
                </figcaption>
              </figure>
            </Rise>
          </div>
        </div>
      </section>

      {/* HEIMSÓKN — where to taste */}
      <section id="heimsokn" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Rise>
              <Eyebrow>Heimsókn</Eyebrow>
              <h2 className="mt-4 font-grotesk text-4xl leading-[1.06] font-bold text-balance md:text-5xl">
                Hvar á að smakka Austra
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#c8c0ad]">
                Ferskasta línan er á krana á Aski, taproom og pizzeríu við brugghúsið sjálft. Þú
                finnur Austra líka á krana á völdum stöðum um allt Austurland.
              </p>

              <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.08]">
                <Img
                  src={img(TAPROOM_ID, 1200)}
                  alt="Hlýlegur taproom-bar með bjór á krana"
                  className="aspect-[16/10] w-full object-cover"
                  fallbackClassName="aspect-[16/10] bg-gradient-to-br from-[#c8772b] via-[#16241c] to-[#0e1a14]"
                />
              </div>

              {/* Practical info */}
              <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--soft)] transition-colors duration-700" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[10px] tracking-wider text-white/55 uppercase">Staðsetning</dt>
                    <dd className="mt-1 text-sm text-[#d8d0bd]">Askur, við brugghúsið<br />Egilsstaðir, Austurland</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--soft)] transition-colors duration-700" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[10px] tracking-wider text-white/55 uppercase">Opnunartími</dt>
                    <dd className="mt-1 text-sm text-[#d8d0bd]">Fim–lau 17–23<br /><span className="text-white/55">Sumartími rýmri</span></dd>
                  </div>
                </div>
              </dl>
            </Rise>

            <Rise delay={0.1}>
              <ul className="flex flex-col gap-4" role="list">
                {STOCKISTS.map((s, i) => (
                  <li
                    key={s.name}
                    className="rounded-3xl border border-white/[0.08] bg-[#16241c] p-6 transition-colors hover:border-[color:var(--accent)]/40 sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/[0.14] font-mono text-sm font-bold text-[color:var(--soft)] transition-colors duration-700"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-grotesk text-xl font-bold leading-tight text-[#f1ead9]">{s.name}</h3>
                        <p className="mt-1 font-mono text-[11px] tracking-wide text-[color:var(--soft)] uppercase transition-colors duration-700">
                          {s.where}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#c8c0ad]">{s.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </section>

      {/* RADDIR — voices */}
      <section aria-label="Umsagnir" className="border-y border-white/[0.07] bg-[#16241c] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Rise className="max-w-2xl">
            <Eyebrow>Raddir</Eyebrow>
            <h2 className="mt-4 font-grotesk text-4xl leading-[1.06] font-bold text-balance md:text-5xl">
              Það sem fólk segir
            </h2>
          </Rise>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {VOICES.map((v, i) => (
              <Rise key={v.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#0e1a14] p-7">
                  <Beer className="h-6 w-6 text-[color:var(--soft)] transition-colors duration-700" aria-hidden="true" />
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-[#d8d0bd]">
                    “{v.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/[0.08] pt-5">
                    <span className="block font-grotesk font-bold text-[#f1ead9]">{v.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] tracking-wide text-white/55">{v.context}</span>
                  </figcaption>
                </figure>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="hafa-samband" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <Rise>
            <Eyebrow>Hafa samband</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-2xl font-grotesk text-4xl leading-[1.04] font-bold text-balance md:text-6xl">
              Finndu Austra á krana
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#c8c0ad]">
              Komdu við á Aski, smakkaðu línuna og fáðu pizzu með. Vilt þú Austra á þinn stað eða
              viðburð? Sendu okkur línu — við dreifum um allt Austurland.
            </p>
          </Rise>

          <Rise delay={0.1}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://www.instagram.com/austribrugghus"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-8 py-4 text-sm font-bold tracking-wide text-[#0e1a14] shadow-xl transition-all duration-700 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                Skilaboð á Instagram
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
              <a
                href="tel:+3544701000"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--soft)]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Hringja
              </a>
            </div>
            <p className="mt-5 font-mono text-[11px] tracking-wide text-white/55">
              Egilsstaðir · Austurland · símanúmer er sýnishorn
            </p>
          </Rise>

          <Rise delay={0.18}>
            <p className="mt-12 font-grotesk text-lg italic text-[#d8d0bd]">“Skál — úr fjöllunum.”</p>
          </Rise>
        </div>
      </section>

      <PreviewFooter company={company} />
    </div>
  )
}
