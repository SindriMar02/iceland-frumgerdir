/**
 * Öruggt skjól — the two legally required pages for an Icelandic public body:
 * the accessibility statement (aðgengisyfirlýsing) and the privacy policy
 * (persónuverndarstefna). One shared template, chosen by route.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Eyebrow, Footer, Header, useLang, Arrow } from './ui'
import { ACCESSIBILITY, PRIVACY, UI } from './data'

export default function BofsLegal({ kind }: { kind: 'adgengi' | 'personuvernd' }) {
  const [, , pick] = useLang()
  const doc = kind === 'adgengi' ? ACCESSIBILITY : PRIVACY

  useEffect(() => {
    document.title = `${pick(doc.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-3xl px-5 pb-8 pt-32 sm:px-8 sm:pt-36">
            <Reveal y={14}>
              <Link to="/preview/bofs" className="bofs-focus mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold" style={{ background: '#fff', color: C.cocoa }}>
                <Arrow className="rotate-180" />
                {pick({ is: 'Forsíða', en: 'Home' })}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <Eyebrow>{pick({ is: 'Lagaskylda', en: 'Legal' })}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(32px,5.4vw,54px)]">{pick(doc.title)}</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="bofs-pretty mt-5 text-[17.5px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick(doc.intro)}
              </p>
              <p className="mt-3 text-[13px]" style={{ color: C.body }}>
                {pick(doc.updated)}
              </p>
            </Reveal>
          </div>
        </section>

        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
            <div className="divide-y" style={{ borderColor: C.line }}>
              {doc.sections.map((s, i) => (
                <Reveal key={i} delay={Math.min(i, 3) * 0.05}>
                  <div className="py-8" style={{ borderColor: C.line }}>
                    <h2 className="bofs-display bofs-display-sm text-[21px]">{pick(s.title)}</h2>
                    <p className="bofs-pretty mt-3 text-[16.5px] leading-relaxed" style={{ color: C.body }}>
                      {pick(s.body)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={kind === 'adgengi' ? '/preview/bofs/personuvernd' : '/preview/bofs/adgengi'}
                  className="bofs-focus rounded-[13px] px-5 py-3 text-[15px] font-semibold"
                  style={{ background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }}
                >
                  {kind === 'adgengi' ? pick(PRIVACY.title) : pick(ACCESSIBILITY.title)}
                </Link>
                <a
                  href="mailto:bofs@bofs.is"
                  className="bofs-focus rounded-[13px] px-5 py-3 text-[15px] font-semibold"
                  style={{ color: C.clayText, boxShadow: `inset 0 0 0 1.5px ${C.line}` }}
                >
                  bofs@bofs.is
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
