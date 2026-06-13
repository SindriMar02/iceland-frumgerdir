import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Phone } from 'lucide-react'
import { getCompany } from '../data/companies'
import { brandOffsetClass, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { SendPreview } from '../components/SendPreview'
import { StickyCta } from '../components/StickyCta'
import { BackChip, ProtoFooter, WantRedesign } from '../components/Proto'
import { SurveyChrome } from './gj/SurveyChrome'
import { CrossingLedger } from './gj/CrossingLedger'
import { RouteAtlas } from './gj/RouteAtlas'
import { FleetRegister } from './gj/FleetRegister'
import { LOGBOOK } from './gj/data'

const company = getCompany('gj-travel')

const PARTY = ['1–9', '10–24', '25–63'] as const
const SEASON = ['Summer', 'Winter', 'Aurora'] as const
const TERRITORY = ['Iceland', 'Iceland + Greenland'] as const

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
            className={`border px-4 py-2 font-grotesk text-sm transition-colors duration-200 focus-visible:outline-gj-ink ${
              value === opt
                ? 'border-gj-ink bg-gj-ink text-gj-paper'
                : 'border-gj-ink/30 text-gj-ink/75 hover:border-gj-ink hover:text-gj-ink'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function GJTravel() {
  const { scrollY } = useScroll()
  const compassRotate = useTransform(scrollY, [0, 700], [0, 180])
  const [party, setParty] = useState<(typeof PARTY)[number]>('10–24')
  const [season, setSeason] = useState<(typeof SEASON)[number]>('Summer')
  const [territory, setTerritory] = useState<(typeof TERRITORY)[number]>('Iceland')

  useEffect(() => {
    document.title = 'GJ Travel — Redesign Concept'
    setThemeColor('#edf0ef')
  }, [])

  const mailto = `mailto:gjtravel@gjtravel.is?subject=${encodeURIComponent(
    `Route enquiry — ${party} travellers — ${season}`,
  )}&body=${encodeURIComponent(`Party size: ${party}\nSeason: ${season}\nTerritory: ${territory}\nPreferred dates:\n`)}`

  return (
    <div className="relative min-h-screen bg-gj-paper font-sans text-gj-ink">
      <BackChip />
      <SendPreview company={company} />
      <SurveyChrome />
      <StickyCta
        label="GJ Travel · surveyed since 1931"
        button="Plot your route"
        href="#book"
        buttonClassName="bg-gj-ink text-gj-paper shadow-gj-ink/25 focus-visible:outline-gj-ink"
        barClassName="bg-gj-paper/90 text-gj-ink border-t border-gj-ink/15"
      />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <div className={`${brandOffsetClass()} flex items-baseline gap-3`}>
          <span className="font-grotesk text-lg font-bold tracking-[0.08em]">GJ TRAVEL</span>
          <span className="hidden font-grotesk text-[10px] tracking-[0.26em] text-gj-lichen uppercase md:inline">
            Guðmundur Jónasson Travel · est. 1931
          </span>
        </div>
        <a
          href="#book"
          className="hidden border border-gj-ink px-5 py-2.5 font-grotesk text-sm font-semibold transition-colors hover:bg-gj-ink hover:text-gj-paper md:inline-flex"
        >
          Enquire
        </a>
      </header>

      {/* SHEET I — THE APPROACH */}
      <section aria-labelledby="hero-h" className="relative px-5 pt-6 pb-20 md:px-10 md:pt-10 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase"
            >
              Sheet I — The Approach · A survey of Iceland & Greenland
            </motion.p>
            <motion.h1
              id="hero-h"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-survey text-[clamp(2.9rem,8.5vw,6.2rem)] leading-[0.98] text-balance"
            >
              Ninety-five years of <em className="text-gj-cobalt italic">reading the land</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-gj-ink/70 md:text-lg"
            >
              Escorted journeys across Iceland and Greenland by the country’s oldest tour operator —
              plotted, provisioned and driven by people who learned the rivers before the bridges
              came.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <a
                href="#book"
                className="group inline-flex items-center gap-2 bg-gj-vermilion px-8 py-4 font-grotesk text-sm font-bold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[color-mix(in_oklab,var(--color-gj-vermilion),black_12%)] focus-visible:outline-gj-ink"
              >
                Plot your route
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#atlas"
                className="inline-flex items-center gap-2 font-grotesk text-sm font-semibold text-gj-ink underline decoration-gj-cobalt decoration-2 underline-offset-4 transition-colors hover:text-gj-cobalt"
              >
                Open the atlas
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-grotesk text-[10px] font-medium tracking-[0.22em] text-gj-lichen uppercase"
            >
              {['Est. 1931', 'IATA', 'USTOA', 'SAF', 'Responsible Tourism Award 2025'].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 bg-gj-cobalt" />
                  {c}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Mounted survey plate */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="border border-gj-ink/30 bg-gj-paper2 p-3">
              <div className="flex items-center justify-between pb-2 font-grotesk text-[9px] tracking-[0.22em] text-gj-lichen uppercase tabular-nums">
                <span>Plate 01 — The interior, morning fog</span>
                <span>64°N</span>
              </div>
              <div className="overflow-hidden border border-gj-ink/20">
                <Img
                  src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1400&auto=format&fit=crop"
                  srcSet="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1400&auto=format&fit=crop 1400w"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt="Fog drifting across layered Icelandic highland ridges"
                  className="aspect-[4/5] w-full object-cover object-[50%_72%] saturate-[0.9] lg:aspect-[4/4.6]"
                  loading="eager"
                  fetchpriority="high"
                  fallbackClassName="bg-gradient-to-b from-[#aebbb6] to-[#3c4a47]"
                />
              </div>
              <figcaption className="flex items-center justify-between pt-2 font-grotesk text-[9px] tracking-[0.22em] text-gj-lichen uppercase">
                <span>Surveyed continuously since 1931</span>
                <span aria-hidden className="text-gj-cobalt">●</span>
              </figcaption>
            </div>
          </motion.figure>
        </div>

        {/* Compass scroll cue */}
        <motion.div
          aria-hidden
          style={{ rotate: compassRotate }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="12" stroke="var(--color-gj-ink)" strokeOpacity="0.3" />
            <path d="M13 4 L16 14 H10 Z" fill="var(--color-gj-cobalt)" />
            <path d="M13 22 L10 14 H16 Z" fill="none" stroke="var(--color-gj-ink)" strokeOpacity="0.4" />
          </svg>
        </motion.div>
      </section>

      {/* SHEET II — heritage scrub */}
      <CrossingLedger />

      {/* SHEET III — the atlas */}
      <RouteAtlas />

      {/* NIGHT PLATE — the one inverted breath */}
      <section aria-label="Aurora interlude" className="relative overflow-hidden bg-gj-night py-36 md:py-48">
        <Img
          src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2000&auto=format&fit=crop"
          alt="Green aurora curling over the ice lagoon at night"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#0c2b22] to-[#0e1314]"
        />
        <div aria-hidden className="absolute inset-6 border border-white/20" />
        {/* centered scrim keeps caption legible over any aurora region */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_center,rgba(14,19,20,0.72),transparent_72%)]"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-grotesk text-[10px] font-medium tracking-[0.3em] text-white/90 uppercase">
              Night plate · aurora season Sep – Apr
            </p>
            <p className="mt-6 font-survey text-4xl leading-tight text-white text-balance italic md:text-6xl">
              Some roads are best read in the dark.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SHEET IV — fleet register */}
      <FleetRegister />

      {/* SHEET V — THE CONTOUR OF CARE */}
      <section id="care" aria-labelledby="care-h" className="relative overflow-hidden bg-gj-paper px-5 py-24 md:px-10 md:py-32">
        <svg
          aria-hidden
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-[0.12]"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={i}
              d={`M-20 ${360 - i * 42} C200 ${330 - i * 40} 420 ${390 - i * 46} 640 ${344 - i * 42} C860 ${300 - i * 38} 1040 ${360 - i * 44} 1220 ${320 - i * 40}`}
              fill="none"
              stroke="var(--color-gj-ink)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, delay: i * 0.12, ease: [0.65, 0, 0.35, 1] }}
            />
          ))}
        </svg>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
                Sheet V — The Contour of Care
              </p>
              <h2 id="care-h" className="mt-3 font-survey text-4xl text-gj-ink text-balance md:text-6xl">
                Tracks only in snow
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
                A company that has watched the same glaciers since 1931 takes their retreat
                personally. Every departure is carbon-offset through the Katla reforestation
                project; routes, group sizes and idle hours are engineered to leave the land as
                surveyed.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ul className="mt-8 space-y-3 border-t border-gj-ink/15 pt-6">
                {[
                  ['Katla project', 'Carbon offset on every departure, audited annually'],
                  ['Fleet discipline', 'Modern engines, full loads, no idling policy'],
                  ['Licensed & bonded', 'IATA · USTOA · SAF — legend marks of record'],
                ].map(([term, detail]) => (
                  <li key={term} className="flex gap-5 text-sm">
                    <span className="w-32 shrink-0 font-grotesk text-xs font-medium tracking-[0.14em] text-gj-cobalt uppercase">
                      {term}
                    </span>
                    <span className="text-gj-ink/75">{detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Award cartouche */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 1.06, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="border-2 border-gj-vermilion p-2"
              role="img"
              aria-label="Responsible Tourism Award 2025"
            >
              <div className="flex aspect-square w-64 flex-col items-center justify-center gap-3 border border-gj-vermilion px-6 text-center md:w-72">
                <span aria-hidden className="font-survey text-4xl text-gj-vermilion">✳</span>
                <p className="font-grotesk text-[11px] font-bold tracking-[0.3em] text-gj-vermilion-ink uppercase">
                  Responsible
                  <br />
                  Tourism Award
                </p>
                <p className="font-survey text-6xl text-gj-vermilion tabular-nums">2025</p>
                <p className="font-grotesk text-[9px] tracking-[0.22em] text-gj-vermilion-ink uppercase">
                  Awarded · held with both hands
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARGIN NOTES — the logbook */}
      <section aria-labelledby="log-h" className="bg-gj-paper2 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
              Margin notes
            </p>
            <h2 id="log-h" className="mt-3 font-survey text-4xl text-gj-ink md:text-6xl">
              From the field log
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {LOGBOOK.map((entry, i) => (
              <Reveal key={entry.stamp} delay={i * 0.1}>
                <figure className="border-t-2 border-gj-ink pt-5">
                  <figcaption className="font-grotesk text-[10px] font-medium tracking-[0.22em] text-gj-cobalt uppercase tabular-nums">
                    {entry.stamp}
                  </figcaption>
                  <blockquote className="mt-4 font-survey text-xl leading-snug text-gj-ink md:text-[1.35rem]">
                    “{entry.quote}”
                  </blockquote>
                  <p className="mt-4 font-grotesk text-xs tracking-[0.14em] text-gj-lichen uppercase">{entry.name}</p>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHEET VI — PLOT YOUR ROUTE */}
      <section id="book" aria-labelledby="book-h" className="bg-gj-paper px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute h-4 w-4 rounded-full border border-gj-vermilion" />
                <span className="h-1.5 w-1.5 rounded-full bg-gj-vermilion" />
              </span>
              <p className="font-grotesk text-[11px] font-bold tracking-[0.3em] text-gj-vermilion-ink uppercase">
                Sheet VI — You Are Here
              </p>
            </div>
            <h2 id="book-h" className="mt-4 font-survey text-4xl text-gj-ink text-balance md:text-6xl">
              Plot your route
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
              Three marks and we draw the rest. A fast, personal reply has been the GJ trademark
              since 1931.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-7 border border-gj-ink/25 bg-gj-paper2 p-7 md:p-10">
              <ChipGroup label="Party size" options={PARTY} value={party} onChange={setParty} />
              <ChipGroup label="Season" options={SEASON} value={season} onChange={setSeason} />
              <ChipGroup label="Territory" options={TERRITORY} value={territory} onChange={setTerritory} />

              <div className="flex flex-col gap-3 border-t border-gj-ink/15 pt-7 sm:flex-row sm:items-center">
                <a
                  href={mailto}
                  className="group inline-flex items-center justify-center gap-2 bg-gj-vermilion px-8 py-4 font-grotesk text-sm font-bold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[color-mix(in_oklab,var(--color-gj-vermilion),black_12%)] focus-visible:outline-gj-ink"
                >
                  Dispatch enquiry
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+3545205200"
                  className="inline-flex items-center justify-center gap-2 border border-gj-ink/30 px-8 py-4 font-grotesk text-sm font-semibold text-gj-ink transition-colors hover:border-gj-ink"
                >
                  <Phone className="h-4 w-4" />
                  +354 520 5200
                </a>
              </div>
              <p className="font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                Composes an email — nothing sent until you press send
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <WantRedesign
        company={company}
        accentClassName="bg-gj-vermilion text-white hover:bg-[color-mix(in_oklab,var(--color-gj-vermilion),black_12%)] focus-visible:outline-gj-ink"
      />
      <ProtoFooter company={company} />
    </div>
  )
}
