/**
 * Öruggt skjól — "Kerfið": how child protection works, step by step.
 *
 * Rebuilt 2026-09-17 in the page language: a plain opening, the painted
 * road, the steps as a numbered list on a rule that fills as the reader
 * scrolls, children's rights as convention articles, the laws as a ruled
 * list, then questions and help. Each part hands off to island.is.
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { asset, BofsStyles, C, Footer, Header, IslandLink, PageHead, ScrollRail, SubNav, Torn, useLang, WordReveal } from './ui'
import { FaqList, HelpBand } from './sections'
import { ISLAND, KERFID, UI } from './data'

export default function BofsKerfid() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const stationsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    document.title = `${pick(KERFID.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { scrollYProgress } = useScroll({ target: stationsRef, offset: ['start 0.7', 'end 0.6'] })

  const subnav = [
    { id: 'ferlid', label: pick({ is: 'Ferlið', en: 'The process' }) },
    { id: 'rettindi', label: pick(KERFID.rights.eyebrow) },
    { id: 'login', label: pick(KERFID.laws.eyebrow) },
    { id: 'spurningar', label: pick({ is: 'Spurningar', en: 'Questions' }) },
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
        <section className="bofs-wash" style={{ background: C.cream }}>
          <PageHead crumb={pick(KERFID.hero.kicker)} title={pick(KERFID.hero.title)} lead={pick(KERFID.hero.lead)} wide>
            <IslandLink to={ISLAND.report} button />
            <IslandLink to={ISLAND.system} className="self-center" />
          </PageHead>
          <figure className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
            <div className="bofs-wet">
              <Img
                src={asset('art-kerfid.jpg')}
                srcSet={`${asset('art-kerfid-1600.jpg')} 1600w, ${asset('art-kerfid.jpg')} 3024w`}
                sizes="(min-width: 1200px) 1120px, 100vw"
                width={3024}
                height={1296}
                alt={pick({ is: 'Vatnslitamynd: stígur liggur yfir hæðir, framhjá vörðu og brú, að húsi með ljós í glugga', en: 'Watercolour: a path runs over hills, past a cairn and a bridge, to a house with a light in the window' })}
                className="bofs-open-settle h-[220px] w-full object-cover sm:h-[340px]"
                fallbackClassName="bg-gradient-to-br from-[#F8EAD8] to-[#CFD7C4]"
              />
            </div>
          </figure>
        </section>

        <SubNav sections={subnav} />

        {/* ── the steps ─────────────────────────────────────────────────── */}
        <section id="ferlid" className="bofs-wash scroll-mt-20" style={{ background: C.cream2 }}>
          <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <WordReveal
                as="h2"
                soft
                text={pick({ is: 'Frá áhyggjum að stuðningi, í sex skrefum', en: 'From a concern to support, in six steps' })}
                mark={pick({ is: 'sex skrefum', en: 'six steps' })}
                markColor={C.clay}
                className="bofs-display bofs-balance text-[clamp(28px,4vw,44px)]"
              />
              <p className="mt-5">
                <IslandLink to={ISLAND.childProtection} />
              </p>
            </div>
            <ol ref={stationsRef} className="relative lg:col-span-8">
              {/* the rule fills as the reader moves down the steps */}
              <span className="pointer-events-none absolute bottom-6 left-[15px] top-6 w-[2px]" aria-hidden="true">
                <ScrollRail progress={reduce ? undefined : scrollYProgress} className="h-full w-full" />
              </span>
              {KERFID.stations.map((st, i) => (
                <li key={i} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 py-6">
                  <span className="bofs-display bofs-num relative z-10 grid h-8 w-8 place-items-center text-[20px] leading-none" style={{ background: C.cream2, color: C.clay }}>
                    {i + 1}
                  </span>
                  <span className="border-b pb-6" style={{ borderColor: C.line }}>
                    <span className="bofs-display bofs-display-sm block text-[22px]">{pick(st.title)}</span>
                    <span className="bofs-pretty mt-2 block max-w-2xl text-[16.5px] leading-relaxed" style={{ color: C.cocoa }}>
                      {pick(st.body)}
                    </span>
                    <span className="mt-3 block text-[14px]" style={{ color: C.body }}>
                      {pick(st.law)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── children's rights ─────────────────────────────────────────── */}
        <section id="rettindi" className="bofs-wash scroll-mt-20" style={{ background: C.oat }}>
          <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <WordReveal as="h2" soft text={pick(KERFID.rights.title)} className="bofs-display bofs-balance text-[clamp(28px,4vw,44px)]" />
              <p className="bofs-pretty mt-5 text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick(KERFID.rights.lead)}
              </p>
            </div>
            <ol className="grid border-t sm:grid-cols-2 sm:gap-x-12 lg:col-span-8" style={{ borderColor: C.cocoa }}>
              {[...KERFID.rights.items]
                .sort((x, y) => parseInt(x.article.is) - parseInt(y.article.is))
                .map((r) => (
                  <li key={r.article.is} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 border-b py-6" style={{ borderColor: C.line }}>
                    <span className="bofs-display bofs-num text-[40px] leading-none" style={{ color: C.clay }}>
                      {parseInt(r.article.is)}
                      <span className="sr-only"> {pick(r.article)}</span>
                    </span>
                    <span>
                      <span className="block text-[13px]" style={{ color: C.body }} aria-hidden="true">
                        {pick(r.article)}
                      </span>
                      <span className="bofs-pretty mt-1 block text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                        {pick(r.text)}
                      </span>
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        </section>

        {/* ── the laws ──────────────────────────────────────────────────── */}
        <section id="login" className="bofs-wash scroll-mt-20" style={{ background: C.cream2 }}>
          <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <WordReveal as="h2" soft text={pick(KERFID.laws.title)} className="bofs-display bofs-balance text-[clamp(28px,4vw,44px)]" />
              <p className="mt-5 flex flex-col items-start gap-3">
                <IslandLink to={ISLAND.laws} />
                <IslandLink to={ISLAND.forms} />
              </p>
            </div>
            <ul className="border-t lg:col-span-8" style={{ borderColor: C.cocoa }}>
              {KERFID.laws.items.map((law, i) => (
                <li key={i} className="border-b py-6" style={{ borderColor: C.line }}>
                  <h3 className="bofs-display bofs-display-sm text-[21px]">{pick(law.name)}</h3>
                  <p className="bofs-pretty mt-2 max-w-2xl text-[16.5px] leading-relaxed" style={{ color: C.cocoa }}>
                    {pick(law.body)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FaqList />
        <HelpBand />
      </main>

      <Footer />
    </div>
  )
}
