/**
 * Öruggt skjól — the blocks the inner pages are built from.
 *
 * Rebuilt 2026-09-17 in the same language as the landing page: type,
 * paintings and hairlines. No rounded cards, no pills, no coloured dots, no
 * count-up tiles, no circle badges, no arrow icons, no entrance animations.
 * Nine blocks that no page used any more were removed in the same pass.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Footer, Header, IslandLink, PageHead, Torn, useLang, WordReveal } from './ui'
import {
  FAQ,
  FOSTER_STEPS,
  HELP,
  INSTITUTIONS,
  ISLAND,
  type NewsItem,
  NEWS,
  NEWS_SOURCES,
  NOTFOUND,
  ORG,
  REPORT,
  STATS,
  TIMELINE,
  UI,
} from './data'

/* ── national figures: plain numbers on a rule ─────────────────────────── */

const fmt = (n: number, lang: 'is' | 'en') => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'is' ? '.' : ',')

export function StatsBand({ link }: { link?: { href: string; label: { is: string; en: string } } }) {
  const [lang, , pick] = useLang()
  if (STATS.items.length < 3) return null
  return (
    <section id="tolur" className="bofs-wash scroll-mt-20" style={{ background: C.cream2 }}>
      <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8">
        <WordReveal as="h2" soft text={pick(STATS.title)} className="bofs-display max-w-2xl text-[clamp(28px,4vw,44px)]" />
        <p className="bofs-pretty mt-4 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
          {pick(STATS.lead)}
        </p>
        <dl className="mt-12 grid border-t sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: C.cocoa }}>
          {STATS.items.map((s, i) => (
            <div key={i} className="border-b py-6 sm:pr-8" style={{ borderColor: C.line }}>
              <dt className="sr-only">{pick(s.label)}</dt>
              <dd className="bofs-display bofs-num text-[clamp(36px,4vw,52px)] leading-none" style={{ color: C.clay }}>
                {fmt(s.value, lang)}
              </dd>
              <dd className="mt-3 text-[15px] leading-snug" style={{ color: C.cocoa }} aria-hidden="true">
                {pick(s.label)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13.5px]" style={{ color: C.body }}>
          {pick(STATS.source)}
        </p>
        {link && (
          <p className="mt-4">
            <IslandLink to={link} />
          </p>
        )}
      </div>
    </section>
  )
}

/* ── history: years in the margin ──────────────────────────────────────── */

export function Timeline() {
  const [, , pick] = useLang()
  return (
    <ol className="border-t" style={{ borderColor: C.cocoa }}>
      {TIMELINE.items.map((m) => (
        <li key={m.year} className="grid gap-x-8 gap-y-2 border-b py-6 sm:grid-cols-[7rem_1fr]" style={{ borderColor: C.line }}>
          <span className="bofs-display bofs-num text-[28px] leading-none" style={{ color: C.clay }}>
            {m.year}
          </span>
          <span>
            <span className="bofs-display bofs-display-sm block text-[21px]">{pick(m.title)}</span>
            <span className="bofs-pretty mt-2 block max-w-2xl text-[16px] leading-relaxed" style={{ color: C.cocoa }}>
              {pick(m.body)}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ── questions and answers ─────────────────────────────────────────────── */

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: C.line }}>
      <h3>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="bofs-focus group flex w-full items-baseline justify-between gap-6 py-5 text-left">
          <span className="bofs-display bofs-display-sm bofs-way text-[19px] leading-snug" style={{ color: C.cocoa }}>
            {q}
          </span>
          <span aria-hidden="true" className="bofs-num shrink-0 text-[22px] leading-none" style={{ color: C.clay, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .24s cubic-bezier(.23,1,.32,1)' }}>
            +
          </span>
        </button>
      </h3>
      <div className="bofs-faq grid" style={{ gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .26s cubic-bezier(.32,.72,0,1)' }}>
        <div className="overflow-hidden">
          <p className="bofs-pretty max-w-2xl pb-6 text-[16.5px] leading-relaxed" style={{ color: C.cocoa }}>
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FaqList() {
  const [, , pick] = useLang()
  if (FAQ.items.length < 3) return null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.items.map((f) => ({ '@type': 'Question', name: f.q.is, acceptedAnswer: { '@type': 'Answer', text: f.a.is } })),
  }
  return (
    <section id="spurningar" className="bofs-wash scroll-mt-20" style={{ background: C.cream }}>
      <Torn color={C.cream} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <WordReveal as="h2" soft text={pick(FAQ.title)} className="bofs-display text-[clamp(28px,4vw,44px)]" />
          <p className="mt-5">
            <IslandLink to={ISLAND.faq} />
          </p>
        </div>
        <div className="border-t lg:col-span-8" style={{ borderColor: C.cocoa }}>
          {FAQ.items.map((f, i) => (
            <FaqItem key={i} q={pick(f.q)} a={pick(f.a)} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}

/* ── related institutions ──────────────────────────────────────────────── */

export function InstitutionsAndClose() {
  const [, , pick] = useLang()
  return (
    <section id="stofnanir" className="bofs-wash scroll-mt-20" style={{ background: C.oat }}>
      <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-8 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
        <h2 className="bofs-display text-[clamp(26px,3.4vw,40px)] lg:col-span-4">{pick(INSTITUTIONS.title)}</h2>
        <ul className="border-t lg:col-span-8" style={{ borderColor: C.cocoa }}>
          {INSTITUTIONS.items.map((it) => (
            <li key={it.name} className="grid gap-x-8 gap-y-1 border-b py-4 sm:grid-cols-[1fr_1.2fr]" style={{ borderColor: C.line }}>
              {it.href ? (
                <a href={it.href} target="_blank" rel="noopener noreferrer" className="bofs-focus group rounded text-[16px] font-semibold" style={{ color: C.cocoa }}>
                  <span className="bofs-way">{it.name}</span>
                  <span className="sr-only"> {pick({ is: '(opnast í nýjum flipa)', en: '(opens in a new tab)' })}</span>
                </a>
              ) : (
                <span className="text-[16px] font-semibold" style={{ color: C.cocoa }}>
                  {it.name}
                </span>
              )}
              <span className="text-[15px]" style={{ color: C.cocoa }}>
                {pick(it.role)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── news ──────────────────────────────────────────────────────────────── */

/*
 * Source-label colours, darkened to clear WCAG AA at 12.5px on white.
 * The display hues (C.sky 3.97:1, C.sage 3.98:1, C.terra 3.20:1) all failed;
 * these measured variants sit between 5.2:1 and 5.9:1.
 */
/*
 * Measured against the provenance panel's own C.cream2 ground, not against
 * the page. C.clay is 4.35:1 there and fails AA at this size; C.clayText is
 * the token that exists for exactly this, at 5.02:1. Every hue below is >=4.5.
 */
const SOURCE_HUE: Record<string, string> = {
  BOFS: C.clayText,
  GEV: '#3D6B87',
  'Stjórnarráðið': '#4A6E4A',
  'Umboðsmaður barna': '#7A5B86',
  'Vísir': '#A8471F',
}

const MONTHS: Record<'is' | 'en', string[]> = {
  is: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

/** '24.07.2026' → { is: 'júlí 2026', en: 'July 2026' }. Grouping key is 'MM.YYYY'. */
export function monthOf(date: string) {
  const [, m, y] = date.split('.')
  const i = Number(m) - 1
  return { key: `${m}.${y}`, label: { is: `${MONTHS.is[i]} ${y}`, en: `${MONTHS.en[i]} ${y}` } }
}

/** The publisher, coloured. Hues are the audited ones, never opacity-dimmed. */
function SourceMark({ source }: { source: NewsItem['source'] }) {
  const [, , pick] = useLang()
  return (
    <span className="text-[13.5px] font-semibold" style={{ color: SOURCE_HUE[source] ?? C.body }}>
      {source}
      <span className="sr-only">{pick({ is: '(opnast á vef útgefandans)', en: '(opens on the publisher’s site)' })}</span>
    </span>
  )
}

/** The lead story: set large on the page, the headline is the link. */
export function NewsFeature({ item, as: H = 'h2' }: { item: NewsItem; as?: 'h2' | 'h3' }) {
  const [, , pick] = useLang()
  return (
    <article className="group relative border-t pt-6" style={{ borderColor: C.cocoa }}>
      <p className="flex flex-wrap gap-x-3 text-[13.5px]" style={{ color: C.body }}>
        <span className="font-semibold" style={{ color: C.clayText }}>
          {pick(NEWS.featuredLabel)}
        </span>
        <span className="bofs-num">{item.date}</span>
        <SourceMark source={item.source} />
      </p>
      <H className="bofs-display bofs-balance mt-3 max-w-3xl text-[clamp(24px,3vw,36px)] leading-[1.14]">
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="bofs-focus rounded after:absolute after:inset-0 after:content-['']" style={{ color: C.cocoa }}>
          <span className="bofs-way">{pick(item.title)}</span>
        </a>
      </H>
      {item.summary && (
        <p className="bofs-pretty mt-4 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
          {pick(item.summary)}
        </p>
      )}
      {item.stats && (
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          {item.stats.map((s) => (
            <div key={s.value}>
              <dt className="bofs-display bofs-num text-[28px] leading-none" style={{ color: C.clay }}>
                {s.value}
              </dt>
              <dd className="mt-1.5 max-w-[180px] text-[14px] leading-snug" style={{ color: C.cocoa }}>
                {pick(s.label)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}

function NewsRow({ item }: { item: NewsItem }) {
  const [, , pick] = useLang()
  return (
    <li className="group relative border-b py-5" style={{ borderColor: C.line }}>
      <p className="flex flex-wrap gap-x-3 text-[13.5px]" style={{ color: C.body }}>
        <span className="bofs-num">{item.date}</span>
        <SourceMark source={item.source} />
      </p>
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="bofs-focus mt-1 block rounded text-[17px] font-semibold leading-snug after:absolute after:inset-0 after:content-['']" style={{ color: C.cocoa }}>
        <span className="bofs-way">{pick(item.title)}</span>
      </a>
      {item.summary && (
        <p className="bofs-pretty mt-2 max-w-[68ch] text-[15px] leading-relaxed" style={{ color: C.cocoa }}>
          {pick(item.summary)}
        </p>
      )}
    </li>
  )
}

/** Grouped by month. */
export function NewsGroupedList({ items }: { items: NewsItem[] }) {
  const [, , pick] = useLang()
  const groups: { key: string; label: { is: string; en: string }; items: NewsItem[] }[] = []
  for (const item of items) {
    const { key, label } = monthOf(item.date)
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.items.push(item)
    else groups.push({ key, label, items: [item] })
  }
  return (
    <div className="space-y-12">
      {groups.map((g) => (
        <section key={g.key} aria-label={pick(g.label)}>
          <h3 className="border-b pb-2 text-[14px] font-semibold" style={{ color: C.clayText, borderColor: C.cocoa }}>
            {pick(g.label)}
          </h3>
          <ul>
            {g.items.map((n) => (
              <NewsRow key={n.href} item={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** Where the items come from, said plainly. */
export function NewsSources() {
  const [, , pick] = useLang()
  return (
    <div className="border-t pt-6" style={{ borderColor: C.cocoa }}>
      <h2 className="bofs-display text-[22px]">{pick(NEWS.sourcesTitle)}</h2>
      <dl className="mt-4 space-y-2">
        {NEWS_SOURCES.map((s) => (
          <div key={s.id} className="grid grid-cols-[9rem_1fr] gap-4">
            <dt className="text-[14px] font-semibold" style={{ color: SOURCE_HUE[s.id] ?? C.body }}>
              {s.id}
            </dt>
            <dd className="text-[15px] leading-snug" style={{ color: C.cocoa }}>
              {pick(s.label)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="bofs-pretty mt-5 text-[15px] leading-relaxed" style={{ color: C.cocoa }}>
        {pick(NEWS.sourcesNote)}
      </p>
    </div>
  )
}

/* ── not found ─────────────────────────────────────────────────────────── */

export function NotFoundPage() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = `${pick(NOTFOUND.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <main id="main">
        <section className="bofs-wash min-h-[80svh]" style={{ background: C.cream }}>
          <PageHead crumb={pick(NOTFOUND.title)} title={pick(NOTFOUND.title)} lead={pick(NOTFOUND.lead)} />
          <ul className="mx-auto max-w-4xl border-t px-5 sm:px-8" style={{ borderColor: C.cocoa }}>
            {NOTFOUND.links.map((l) => (
              <li key={l.to} className="border-b" style={{ borderColor: C.line }}>
                <Link to={l.to} className="bofs-focus group block rounded py-4 text-[19px]" style={{ color: C.cocoa }}>
                  <span className="bofs-display bofs-way bofs-way-ink">{pick(l.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="h-24" />
        </section>
      </main>
      <Footer />
    </div>
  )
}

/* ── where a service sits on the path (service pages) ──────────────────── */

export function JourneyStrip({ serviceName }: { serviceName: string }) {
  const [, , pick] = useLang()
  const nodes = [
    { label: pick({ is: 'Áhyggjur og tilkynning', en: 'A concern is reported' }), to: '/preview/bofs#tilkynna' },
    { label: pick({ is: 'Barnavernd metur stöðuna', en: 'Child protection assesses' }), to: '/preview/bofs/kerfid#ferlid' },
    { label: serviceName, to: null },
    { label: pick({ is: 'Eftirfylgd', en: 'Follow-up' }), to: '/preview/bofs/kerfid#ferlid' },
  ]
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-8">
      <h2 className="text-[14px] font-semibold" style={{ color: C.clayText }}>
        {pick(UI.wherePath)}
      </h2>
      <ol className="mt-3 flex flex-wrap items-center gap-y-2">
        {nodes.map((n, i) => (
          <li key={i} className="flex items-center">
            {n.to ? (
              <Link to={n.to} className="bofs-focus group rounded text-[16px]" style={{ color: C.cocoa }}>
                <span className="bofs-way">{n.label}</span>
              </Link>
            ) : (
              <span aria-current="step" className="bofs-display text-[18px]" style={{ color: C.clay }}>
                {n.label}
              </span>
            )}
            {i < nodes.length - 1 && (
              <span className="mx-3 w-8 sm:w-12" aria-hidden="true">
                <span className="bofs-rule" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── becoming a foster parent (fostur page only) ───────────────────────── */

export function FosterSteps() {
  const [, , pick] = useLang()
  return (
    <section id="gerast" className="bofs-wash scroll-mt-20" style={{ background: C.cream2 }}>
      <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <WordReveal as="h2" soft text={pick(FOSTER_STEPS.eyebrow)} className="bofs-display text-[clamp(28px,4vw,44px)]" />
          <p className="bofs-pretty mt-4 text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
            {pick(FOSTER_STEPS.lead)}
          </p>
          <p className="mt-6 flex flex-col gap-3">
            <IslandLink to={ISLAND.fosterBecome} button className="self-start" />
            <a href={`mailto:${ORG.email}`} className="bofs-focus group rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
              <span className="bofs-way">{pick(FOSTER_STEPS.cta)}</span>
            </a>
          </p>
        </div>
        <ol className="border-t lg:col-span-8" style={{ borderColor: C.cocoa }}>
          {FOSTER_STEPS.steps.map((step) => (
            <li key={step.n} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b py-6" style={{ borderColor: C.line }}>
              <span className="bofs-display bofs-num text-[28px] leading-none" style={{ color: C.clay }}>
                {step.n}
              </span>
              <span>
                <span className="bofs-display bofs-display-sm block text-[21px]">{pick(step.title)}</span>
                <span className="bofs-pretty mt-2 block text-[16.5px] leading-relaxed" style={{ color: C.cocoa }}>
                  {pick(step.body)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── help lines (Kerfið page) ──────────────────────────────────────────── */

export function HelpBand() {
  const [, , pick] = useLang()
  return (
    <section id="help" className="bofs-wash scroll-mt-20" style={{ background: C.cream2 }}>
      <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <WordReveal as="h2" soft text={pick(HELP.title)} className="bofs-display bofs-balance text-[clamp(28px,4vw,44px)]" />
          <p className="bofs-pretty mt-4 text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
            {pick(HELP.lead)}
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <IslandLink to={ISLAND.report} button />
            <IslandLink to={ISLAND.municipal} />
          </p>
          <p className="mt-6 text-[14.5px]" style={{ color: C.cocoa }}>
            {pick(REPORT.emergency)}
          </p>
        </div>
        <ul className="border-t lg:col-span-7" style={{ borderColor: C.cocoa }}>
          {HELP.lines.map((line, i) => (
            <li key={line.value} className="border-b" style={{ borderColor: C.line }}>
              <a href={`tel:${line.value.replace(/\s/g, '')}`} className="bofs-focus group flex items-center justify-between gap-6 py-5">
                <span>
                  <span className="block text-[17px] font-semibold" style={{ color: C.cocoa }}>
                    {pick(line.label)}
                  </span>
                  <span className="mt-0.5 block text-[14.5px]" style={{ color: C.body }}>
                    {pick(line.blurb)}
                  </span>
                </span>
                <span className="bofs-display bofs-num bofs-way shrink-0 whitespace-nowrap text-[clamp(24px,3vw,36px)]" style={{ color: i === 0 ? '#A83A24' : C.clay }}>
                  {line.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

