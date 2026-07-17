/**
 * Öruggt skjól — "Kerfið" (the child-protection system, end to end).
 *
 * The landing hero shows a path winding to a glowing home; this page walks it.
 * Six honest stations, including the part the agency does NOT run (municipal
 * child protection), spined by the site's one scroll-scrubbed signature.
 */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion, useScroll } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, Button, C, Eyebrow, Footer, Header, ScrollRail, SectionHead, SubNav, useLang, Arrow } from './ui'
import { HillDivider, WaveDivider } from './illustrations'
import { HelpBand } from './sections'
import { KERFID, UI } from './data'

const STATION_HUES = [C.terra, C.sage, C.sun, C.sky, C.rose, C.clay]

export default function BofsKerfid() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const stationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${pick(KERFID.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { scrollYProgress } = useScroll({ target: stationsRef, offset: ['start 0.7', 'end 0.6'] })

  const subnav = [
    { id: 'ferlid', label: pick({ is: 'Ferlið', en: 'The process' }) },
    { id: 'rettindi', label: pick(KERFID.rights.eyebrow) },
    { id: 'login', label: pick(KERFID.laws.eyebrow) },
    { id: 'help', label: pick(UI.nav.help) },
  ]

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ background: C.cream2 }}>
          <div className="mx-auto max-w-4xl px-5 pb-16 pt-32 text-center sm:px-8 sm:pt-36">
            <Reveal y={14}>
              <Link to="/preview/bofs" className="bofs-focus mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold" style={{ background: '#fff', color: C.cocoa }}>
                <Arrow className="rotate-180" />
                {pick({ is: 'Forsíða', en: 'Home' })}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <Eyebrow>{pick(KERFID.hero.kicker)}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(34px,6vw,62px)]">{pick(KERFID.hero.title)}</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="bofs-pretty mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.body }}>
                {pick(KERFID.hero.lead)}
              </p>
            </Reveal>
          </div>
        </section>

        <SubNav sections={subnav} />

        {/* ── STATIONS ─────────────────────────────────────────────────── */}
        <section id="ferlid" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <SectionHead eyebrow={pick(KERFID.stationsEyebrow)} title={pick({ is: 'Sex skref frá áhyggjum að öryggi', en: 'Six steps from worry to safety' })} align="center" />
            <div ref={stationsRef} className="relative mx-auto mt-14 max-w-3xl">
              {/* the one scroll-scrubbed signature: a filling rail */}
              <div className="pointer-events-none absolute bottom-4 left-[21px] top-4 w-[3px] sm:left-[25px]">
                <ScrollRail progress={reduce ? undefined : scrollYProgress} className="h-full w-full" />
              </div>
              <ol className="space-y-7">
                {KERFID.stations.map((st, i) => (
                  <li key={i}>
                    <Reveal y={16} delay={Math.min(i, 3) * 0.04}>
                      <div className="relative flex gap-5">
                        <span
                          className="bofs-display relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px] text-white sm:h-[52px] sm:w-[52px]"
                          style={{ background: STATION_HUES[i % STATION_HUES.length] }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 rounded-[24px] p-6" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                          <h3 className="bofs-display bofs-display-sm bofs-balance text-[21px]">{pick(st.title)}</h3>
                          <p className="mt-2 text-[15.5px] leading-relaxed" style={{ color: C.body }}>
                            {pick(st.body)}
                          </p>
                          <span className="mt-4 inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold" style={{ background: C.cream2, color: C.clayText }}>
                            {pick(st.law)}
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <HillDivider color={C.oat} className="block w-full" />
        </section>

        {/* ── CHILDREN'S RIGHTS ────────────────────────────────────────── */}
        <section id="rettindi" className="scroll-mt-24" style={{ background: C.oat }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(KERFID.rights.eyebrow)} title={pick(KERFID.rights.title)} lead={pick(KERFID.rights.lead)} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {KERFID.rights.items.map((r, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col rounded-[22px] p-6" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                    <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.cream2, color: C.clayText }}>
                      <span className="h-4 w-4 rounded-[3px]" style={{ background: '#FFE6AE', boxShadow: 'inset 0 0 0 1px rgba(224,169,79,.5)' }} />
                      {pick(r.article)}
                    </span>
                    <p className="text-[16px] leading-relaxed" style={{ color: C.cocoa }}>
                      {pick(r.text)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <WaveDivider color={C.cream2} className="block w-full" />
        </section>

        {/* ── THE LAW ──────────────────────────────────────────────────── */}
        <section id="login" className="scroll-mt-24" style={{ background: C.cream2 }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(KERFID.laws.eyebrow)} title={pick(KERFID.laws.title)} align="center" />
            <div className="mx-auto mt-12 max-w-4xl space-y-4">
              {KERFID.laws.items.map((law, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="rounded-[24px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                    <h3 className="bofs-display bofs-display-sm text-[20px]">{pick(law.name)}</h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed" style={{ color: C.body }}>
                      {pick(law.body)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button to="/preview/bofs#tilkynna" icon={<Arrow />}>
                {pick({ is: 'Hefur þú áhyggjur af barni?', en: 'Are you worried about a child?' })}
              </Button>
            </div>
          </div>
        </section>

        {/* ── HELP ─────────────────────────────────────────────────────── */}
        <HelpBand />
      </main>

      <Footer />
    </div>
  )
}
