/**
 * Öruggt skjól — "Fréttir": news from the agency and related bodies.
 *
 * Items are synced from the publishers and every one links to its source.
 * Rebuilt 2026-09-17 in the page language: plain opening, topic filter as
 * underlined text buttons, the lead story on a rule, the rest by month,
 * and where the items come from. No boxes, no pills.
 */

import { useEffect, useMemo, useState } from 'react'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Footer, Header, IslandLink, PageHead, useLang } from './ui'
import { NewsFeature, NewsGroupedList, NewsSources } from './sections'
import { ISLAND, NEWS, NEWS_TOPICS, type NewsTopic, UI } from './data'

export default function BofsFrettir() {
  const [, , pick] = useLang()
  const [topic, setTopic] = useState<NewsTopic | 'all'>('all')

  useEffect(() => {
    document.title = `${pick(NEWS.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = useMemo(() => (topic === 'all' ? NEWS.items : NEWS.items.filter((n) => n.topic === topic)), [topic])
  const lead = shown[0]
  const rest = shown.slice(1)

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main" className="bofs-wash" style={{ background: C.cream }}>
        <PageHead crumb={pick(NEWS.title)} title={pick(NEWS.title)} lead={pick(NEWS.lead)}>
          <IslandLink to={ISLAND.news} />
        </PageHead>

        <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
          <p className="-mt-6 mb-10 text-[14px]" style={{ color: C.body }}>
            {pick(NEWS.updated)}
          </p>

          {/* topic filter */}
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y py-4" style={{ borderColor: C.line }} role="group" aria-label={pick(NEWS.filterTitle)}>
            <span className="text-[14px]" style={{ color: C.body }}>
              {pick(NEWS.filterTitle)}
            </span>
            {[{ id: 'all' as const, label: NEWS.filterAll }, ...NEWS_TOPICS].map((opt) => {
              const on = topic === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTopic(opt.id)}
                  className="bofs-focus group rounded text-[15px] font-semibold"
                  style={{ color: on ? C.clayText : C.cocoa }}
                >
                  <span className="bofs-way" style={{ backgroundSize: on ? '100% 2px' : undefined }}>
                    {pick(opt.label)}
                  </span>
                </button>
              )
            })}
            <span className="ml-auto text-[14px]" style={{ color: C.body }} aria-live="polite">
              {pick(NEWS.count(shown.length))}
            </span>
          </div>

          <div className="mt-10">
            {lead ? (
              <NewsFeature item={lead} as="h2" />
            ) : (
              <p className="text-[17px]" style={{ color: C.cocoa }}>
                {pick(NEWS.empty)}
              </p>
            )}
          </div>

          {rest.length > 0 && (
            <div className="mt-16">
              <h2 className="bofs-display mb-4 text-[clamp(22px,2.6vw,28px)]">{pick(NEWS.archiveTitle)}</h2>
              <NewsGroupedList items={rest} />
            </div>
          )}

          <div className="mt-20 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            <NewsSources />
            <p className="bofs-pretty border-t pt-6 text-[15px] leading-relaxed" style={{ borderColor: C.cocoa, color: C.cocoa }}>
              {pick(NEWS.note)}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
