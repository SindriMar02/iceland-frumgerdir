/**
 * Öruggt skjól — the accessibility statement and the privacy policy.
 * One template, chosen by route. Plain opening, sections on a rule, and the
 * official policy on island.is.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Footer, Header, IslandLink, PageHead, useLang } from './ui'
import { ACCESSIBILITY, ISLAND, ORG, PRIVACY, UI } from './data'

export default function BofsLegal({ kind }: { kind: 'adgengi' | 'personuvernd' }) {
  const [, , pick] = useLang()
  const doc = kind === 'adgengi' ? ACCESSIBILITY : PRIVACY
  const other = kind === 'adgengi' ? PRIVACY : ACCESSIBILITY

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

      <main id="main" className="bofs-wash" style={{ background: C.cream }}>
        <PageHead crumb={pick(doc.title)} title={pick(doc.title)} lead={pick(doc.intro)}>
          {kind === 'personuvernd' && <IslandLink to={ISLAND.privacy} />}
        </PageHead>

        <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
          <p className="-mt-6 mb-10 text-[14px]" style={{ color: C.body }}>
            {pick(doc.updated)}
          </p>
          <div className="border-t" style={{ borderColor: C.cocoa }}>
            {doc.sections.map((s, i) => (
              <div key={i} className="grid gap-x-12 gap-y-2 border-b py-8 md:grid-cols-[14rem_1fr]" style={{ borderColor: C.line }}>
                <h2 className="bofs-display bofs-display-sm text-[21px]">{pick(s.title)}</h2>
                <p className="bofs-pretty text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                  {pick(s.body)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold">
            <Link to={kind === 'adgengi' ? '/preview/bofs/personuvernd' : '/preview/bofs/adgengi'} className="bofs-focus group rounded" style={{ color: C.cocoa }}>
              <span className="bofs-way">{pick(other.title)}</span>
            </Link>
            <a href={`mailto:${ORG.email}`} className="bofs-focus group rounded" style={{ color: C.clayText }}>
              <span className="bofs-way">{ORG.email}</span>
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
