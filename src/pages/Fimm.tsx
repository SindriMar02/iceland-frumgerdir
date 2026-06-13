import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react'
import { fromGallery, setNoindex, setThemeColor } from '../lib/preview'
import { Reveal } from '../components/Reveal'
import { COMPANIES, PREMISE } from './fimm/data'
import { FimmCompanies } from './fimm/FimmCompanies'
import { FimmMatrix } from './fimm/FimmMatrix'
import { FimmRoadmap } from './fimm/FimmRoadmap'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Fimm() {
  useEffect(() => {
    document.title = 'FIMM — An Opportunity Thesis'
    setThemeColor('#08090c')
    const restore = setNoindex(true)
    return restore
  }, [])

  // Private strategy artifact: only reachable from the gallery flow or ?tools.
  if (!fromGallery()) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-fimm-bg font-sans text-fimm-mid antialiased">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-fimm-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <Link to="/" lang="is" className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-fimm-mid uppercase transition-colors hover:text-fimm-hi focus-visible:outline-fimm-signal">
            <ArrowLeft className="h-3.5 w-3.5" />
            Frumgerðir
          </Link>
          <span className="font-mono text-xs tracking-[0.32em] text-fimm-hi uppercase">FIMM</span>
          <a href="#close" className="hidden font-mono text-xs tracking-[0.2em] text-fimm-mid uppercase transition-colors hover:text-fimm-hi focus-visible:outline-fimm-signal sm:inline-flex">
            Thesis
          </a>
        </div>
      </header>

      {/* 01 — COLD OPEN / THESIS */}
      <section aria-labelledby="thesis-h" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-20 md:px-10">
        {/* latent-energy field */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-fimm-signal/[0.07] blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-[26rem] w-[26rem] rounded-full bg-fimm-rise/[0.05] blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase"
          >
            An opportunity thesis · five Icelandic businesses
          </motion.p>
          <motion.h1
            id="thesis-h"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8, ease: EASE }}
            className="mt-6 max-w-4xl font-grotesk text-[clamp(2.4rem,6.4vw,5rem)] leading-[1.02] font-semibold tracking-tight text-fimm-hi text-balance"
          >
            Iceland’s best small businesses are hiding behind{' '}
            <span className="text-fimm-signal">its worst websites.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7, ease: EASE }}
            className="mt-7 max-w-xl text-base leading-relaxed text-fimm-mid md:text-lg"
          >
            Five proven, profitable-looking operators — a creamery, a fish house, a salt-cod producer, a harbour café,
            a sea-kayak crew — each with demand its digital presence can’t hold. This is the case for closing that gap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            <span className="font-grotesk text-5xl font-semibold text-fimm-hi tabular-nums md:text-6xl">05</span>
            <span className="max-w-[12rem] font-mono text-[11px] leading-relaxed tracking-[0.16em] text-fimm-low uppercase">
              businesses · 5 regions · one quadrant of opportunity
            </span>
          </motion.div>
        </div>

        <motion.a
          href="#premise"
          aria-label="Scroll to the premise"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-fimm-low transition-colors hover:text-fimm-hi focus-visible:outline-fimm-signal"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.a>
      </section>

      {/* 01b — THE PREMISE */}
      <section id="premise" aria-labelledby="premise-h" className="border-t border-white/8 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase">01 — The Premise</p>
          <h2 id="premise-h" className="mt-3 max-w-3xl font-grotesk text-4xl font-semibold tracking-tight text-fimm-hi text-balance md:text-5xl">
            Why these, and why now
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2">
            {PREMISE.map((p, i) => (
              <Reveal key={p.k} delay={i * 0.06}>
                <div className="h-full bg-fimm-bg p-7 md:p-9">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-fimm-signal uppercase">{p.k}</p>
                  <p className="mt-3 text-base leading-relaxed text-fimm-mid">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — THE FIVE */}
      <FimmCompanies />

      {/* 03 — THE OPPORTUNITY */}
      <FimmMatrix />

      {/* 04 — THE ROADMAP */}
      <FimmRoadmap />

      {/* 05 — FUTURE STATE / CLOSE */}
      <section id="close" aria-labelledby="close-h" className="relative overflow-hidden border-t border-white/8 px-5 py-28 md:px-10 md:py-40">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fimm-rise/[0.06] blur-[130px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase">05 — The Future State</p>
          <h2 id="close-h" className="mt-4 font-grotesk text-4xl font-semibold tracking-tight text-fimm-hi text-balance md:text-6xl">
            Same businesses. <span className="text-fimm-rise">Realized.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fimm-mid">
            The product was never the problem. Give these five the digital presence their reputations already earned,
            and the demand stops leaking — it compounds. That is the entire thesis.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:sindrimar02@gmail.com?subject=FIMM%20—%20opportunity%20thesis"
              className="inline-flex items-center gap-2 rounded-full bg-fimm-signal px-7 py-3.5 font-grotesk text-sm font-semibold text-fimm-bg transition-colors hover:bg-[color-mix(in_oklab,var(--color-fimm-signal),white_14%)] focus-visible:outline-fimm-rise"
            >
              Discuss the thesis
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-grotesk text-sm font-semibold text-fimm-mid ring-1 ring-white/15 transition-colors hover:text-fimm-hi hover:ring-white/30 focus-visible:outline-fimm-signal"
            >
              See the prototypes
            </Link>
          </div>

          {/* region ledger */}
          <ul className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.18em] text-fimm-low uppercase">
            {COMPANIES.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
                {c.region}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer / disclaimer */}
      <footer className="border-t border-white/8 px-5 py-10 text-center md:px-10">
        <p className="mx-auto max-w-2xl font-mono text-[10px] leading-relaxed tracking-[0.08em] text-fimm-low uppercase">
          Private opportunity concept · prepared by sindrimar02@gmail.com. Company facts are public; all scores and
          projections are studio estimates, not measured data or financial advice. The named businesses are independent
          and unaffiliated, and have not endorsed this concept.
        </p>
      </footer>
    </div>
  )
}
