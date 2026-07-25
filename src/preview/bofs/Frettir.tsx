/**
 * Öruggt skjól — "Fréttir" (news).
 * Real, current, source-linked items from the agency's own newsroom and
 * Icelandic media, curated for the concept; a production build would pull
 * these automatically from the feeds.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Eyebrow, Footer, Header, useLang, Arrow } from './ui'
import { NewsList } from './sections'
import { NEWS, UI } from './data'

export default function BofsFrettir() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = `${pick(NEWS.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-32 sm:px-8 sm:pt-36">
            <Reveal y={14}>
              <Link to="/preview/bofs" className="bofs-focus mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold" style={{ background: '#fff', color: C.cocoa }}>
                <Arrow className="rotate-180" />
                {pick({ is: 'Forsíða', en: 'Home' })}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <Eyebrow>{pick(NEWS.eyebrow)}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(34px,6vw,58px)]">{pick(NEWS.title)}</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="bofs-pretty mt-5 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.body }}>
                {pick(NEWS.lead)}
              </p>
              <p className="mt-3 text-[13px]" style={{ color: C.body }}>
                {pick(NEWS.updated)}
              </p>
            </Reveal>
          </div>
        </section>

        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
            <Reveal>
              <div className="rounded-[20px] px-6 py-2" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <NewsList items={NEWS.items} />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-6 rounded-[16px] px-5 py-4 text-[13.5px] leading-relaxed" style={{ background: C.cream2, color: C.body }}>
                {pick(NEWS.note)}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
