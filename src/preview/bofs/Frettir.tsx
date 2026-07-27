/**
 * Öruggt skjól — "Fréttir" (news).
 *
 * Real, current, source-linked items from the agency's own newsroom, from
 * GEV, from Stjórnarráðið and from Icelandic media. A production build would
 * pull these from the feeds; here they are curated, and every item was
 * re-checked against its publisher on 27 July 2026.
 *
 * Structure: a lead story, a topic filter, then the rest grouped by month.
 * The filter drives the lead as well as the archive, so choosing "Barnahús"
 * genuinely re-leads the page rather than only shortening a list.
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Eyebrow, Footer, Header, useLang, Arrow } from './ui'
import { NewsFeature, NewsGroupedList, NewsSources } from './sections'
import { NEWS, NEWS_TOPICS, type NewsTopic, UI } from './data'

export default function BofsFrettir() {
  const [, , pick] = useLang()
  const [topic, setTopic] = useState<NewsTopic | 'all'>('all')

  useEffect(() => {
    document.title = `${pick(NEWS.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = useMemo(
    () => (topic === 'all' ? NEWS.items : NEWS.items.filter((n) => n.topic === topic)),
    [topic],
  )
  const lead = shown[0]
  const rest = shown.slice(1)

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── Masthead ──────────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pb-10 pt-32 sm:px-8 sm:pt-36">
            <Reveal y={14}>
              <Link
                to="/preview/bofs"
                className="bofs-focus mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold"
                style={{ background: '#fff', color: C.cocoa }}
              >
                <Arrow className="rotate-180" />
                {pick({ is: 'Forsíða', en: 'Home' })}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <Eyebrow>{pick(NEWS.eyebrow)}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(34px,6vw,58px)]">
                {pick(NEWS.title)}
              </h1>
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

        {/* ── Topic filter ──────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal delay={0.04}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y py-4" style={{ borderColor: C.line }}>
                <span className="text-[12.5px] font-bold uppercase" style={{ color: C.clayText, letterSpacing: '0.14em' }}>
                  {pick(NEWS.filterTitle)}
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label={pick(NEWS.filterTitle)}>
                  {[{ id: 'all' as const, label: NEWS.filterAll }, ...NEWS_TOPICS].map((tOpt) => {
                    const on = topic === tOpt.id
                    return (
                      <button
                        key={tOpt.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTopic(tOpt.id)}
                        className="bofs-focus rounded-[11px] px-3.5 py-1.5 text-[13.5px] font-bold transition-colors duration-150"
                        style={
                          on
                            ? { background: C.cocoa, color: C.cream }
                            : { background: '#fff', color: C.body, boxShadow: `inset 0 0 0 1px ${C.line}` }
                        }
                      >
                        {pick(tOpt.label)}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[13px]" style={{ color: C.body }} aria-live="polite">
                  {pick(NEWS.count(shown.length))}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Lead story ────────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
            {lead ? (
              <Reveal>
                <NewsFeature item={lead} as="h2" />
              </Reveal>
            ) : (
              <p className="rounded-[18px] px-6 py-8 text-center text-[15px]" style={{ background: '#fff', color: C.body, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                {pick(NEWS.empty)}
              </p>
            )}
          </div>
        </section>

        {/* ── Archive, grouped by month ─────────────────────────────────── */}
        {rest.length > 0 && (
          <section style={{ background: C.cream }}>
            <div className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
              <h2 className="bofs-display mb-6 text-[clamp(20px,2.4vw,26px)]">{pick(NEWS.archiveTitle)}</h2>
              <Reveal delay={0.04}>
                <div className="rounded-[20px] px-6 py-2 sm:px-8" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                  <NewsGroupedList items={rest} />
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ── Provenance + the honest note about feeds ──────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pb-24 pt-14 sm:px-8">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal>
                <NewsSources />
              </Reveal>
              <Reveal delay={0.06}>
                <p className="h-full rounded-[18px] p-6 text-[14px] leading-relaxed sm:p-7" style={{ background: C.oat, color: C.body }}>
                  {pick(NEWS.note)}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
