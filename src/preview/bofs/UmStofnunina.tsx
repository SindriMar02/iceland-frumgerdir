/**
 * Öruggt skjól — "Um stofnunina".
 *
 * Rebuilt 2026-09-17 from what the agency itself publishes on island.is:
 * /s/bofs/um-barna-og-fjoelskyldustofu (purpose, services), /hlutverk-...
 * (role and statutory tasks), /starfsfolk-... (executive board and units),
 * /stefnur-og-aaetlanir (policies), /adgengi-ad-starfsstoedvum-bofs (sites),
 * plus the 2024 annual report (staff and sites) and GEV for oversight.
 * Nothing on this page is written from memory; see data.ts ABOUT.
 *
 * Order follows what people come to an about page for: what the agency is
 * and does, what it runs, who leads it, where it is, how it is overseen,
 * and how to reach it.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Footer, Header, IslandLink, PageHead, SubNav, Torn, useLang, WordReveal } from './ui'
import { InstitutionsAndClose, StatsBand, Timeline } from './sections'
import { ABOUT, ISLAND, LEADERSHIP, ORG, TIMELINE, UI } from './data'

/** The two-column chapter used throughout this page. */
function Chapter({ id, title, ground, children, aside }: { id: string; title: string; ground: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section id={id} className="bofs-wash scroll-mt-20" style={{ background: ground }}>
      <Torn color={ground} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-8 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <WordReveal as="h2" soft text={title} className="bofs-display bofs-balance text-[clamp(28px,3.6vw,42px)]" />
          {aside && <div className="mt-5 flex flex-col items-start gap-3">{aside}</div>}
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  )
}

export default function BofsUmStofnunina() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = `${pick(ABOUT.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subnav = [
    { id: 'hlutverk', label: pick(ABOUT.role.title) },
    { id: 'urraedi', label: pick({ is: 'Úrræði', en: 'Services' }) },
    { id: 'skipulag', label: pick(ABOUT.org.title) },
    { id: 'saga', label: pick(TIMELINE.eyebrow) },
    { id: 'eftirlit', label: pick(ABOUT.oversight.eyebrow) },
    { id: 'starfsstodvar', label: pick({ is: 'Starfsstöðvar', en: 'Sites' }) },
    { id: 'samband', label: pick(ABOUT.contact.title) },
  ]

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── opening: what the agency is, in its own words ─────────────── */}
        <section className="bofs-wash" style={{ background: C.cream }}>
          <PageHead crumb={pick(ABOUT.hero.kicker)} title={pick(ABOUT.hero.title)} lead={pick(ABOUT.hero.lead)} wide>
            <IslandLink to={ISLAND.about} />
          </PageHead>
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
            <dl className="grid border-t sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: C.cocoa }}>
              {ABOUT.factband.map((f) => (
                <div key={pick(f.label)} className="border-b py-5 sm:pr-8" style={{ borderColor: C.line }}>
                  <dt className="text-[14px]" style={{ color: C.body }}>
                    {pick(f.label)}
                  </dt>
                  <dd className="bofs-display mt-1 text-[19px]" style={{ color: C.cocoa }}>
                    {pick(f.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SubNav sections={subnav} />

        {/* ── role and statutory tasks ──────────────────────────────────── */}
        <Chapter id="hlutverk" title={pick(ABOUT.role.title)} ground={C.cream2} aside={<IslandLink to={ISLAND.role} />}>
          <div className="space-y-5">
            {ABOUT.role.paras.map((p, i) => (
              <p key={i} className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick(p)}
              </p>
            ))}
          </div>
          <h3 className="mt-10 text-[15px] font-semibold" style={{ color: C.clayText }}>
            {pick({ is: 'Verkefni stofnunarinnar', en: 'The agency’s tasks' })}
          </h3>
          <ul className="mt-3 border-t" style={{ borderColor: C.cocoa }}>
            {ABOUT.role.tasks.map((task, i) => (
              <li key={i} className="border-b py-3 text-[16.5px] leading-relaxed" style={{ borderColor: C.line, color: C.cocoa }}>
                {pick(task)}
              </li>
            ))}
          </ul>
        </Chapter>

        {/* ── services it runs: our own pages ───────────────────────────── */}
        <Chapter id="urraedi" title={pick(ABOUT.services.title)} ground={C.cream}>
          <ul className="border-t" style={{ borderColor: C.cocoa }}>
            {ABOUT.services.items.map((it) => (
              <li key={it.slug} className="border-b" style={{ borderColor: C.line }}>
                <Link to={it.slug === 'studlar' ? '/preview/bofs#heimili' : `/preview/bofs/${it.slug}`} className="bofs-focus group block rounded py-4">
                  <span className="bofs-display bofs-way bofs-way-ink text-[22px]">{pick(it.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Chapter>

        {/* ── organisation: board and units ─────────────────────────────── */}
        <Chapter id="skipulag" title={pick(ABOUT.org.title)} ground={C.cream2} aside={<IslandLink to={ISLAND.staff} />}>
          <p className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
            {pick(ABOUT.org.lead)}
          </p>
          <h3 className="mt-10 text-[15px] font-semibold" style={{ color: C.clayText }}>
            {pick(ABOUT.org.boardTitle)}
          </h3>
          <ul className="mt-3 border-t" style={{ borderColor: C.cocoa }}>
            {LEADERSHIP.map((l) => (
              <li key={l.name} className="grid gap-x-8 gap-y-1 border-b py-4 sm:grid-cols-[14rem_1fr]" style={{ borderColor: C.line }}>
                <span className="bofs-display text-[19px]">{l.name}</span>
                <span className="text-[16px]" style={{ color: C.cocoa }}>
                  {pick(l.title)}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-[15px] font-semibold" style={{ color: C.clayText }}>
            {pick(ABOUT.org.unitsTitle)}
          </h3>
          <ul className="mt-3 grid border-t sm:grid-cols-2 sm:gap-x-10" style={{ borderColor: C.cocoa }}>
            {ABOUT.org.units.map((u) => (
              <li key={u.is} className="border-b py-3 text-[16px]" style={{ borderColor: C.line, color: C.cocoa }}>
                {pick(u)}
              </li>
            ))}
          </ul>
        </Chapter>

        {/* ── history ───────────────────────────────────────────────────── */}
        <Chapter id="saga" title={pick(TIMELINE.title)} ground={C.cream}>
          <Timeline />
        </Chapter>

        {/* ── figures ───────────────────────────────────────────────────── */}
        <StatsBand link={ISLAND.publications} />

        {/* ── oversight and complaints ──────────────────────────────────── */}
        <Chapter id="eftirlit" title={pick(ABOUT.oversight.title)} ground={C.cream} aside={<IslandLink to={ISLAND.gev} button />}>
          <p className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
            {pick(ABOUT.oversight.body)}
          </p>
          <p className="mt-4 text-[15.5px]" style={{ color: C.cocoa }}>
            {pick({ is: 'Gæða- og eftirlitsstofnun velferðarmála', en: 'Quality and Supervisory Authority of Welfare' })}
            <br />
            {pick(ABOUT.oversight.contact)}
          </p>
        </Chapter>

        {/* ── sites ─────────────────────────────────────────────────────── */}
        <Chapter id="starfsstodvar" title={pick(ABOUT.sites.title)} ground={C.cream2} aside={<IslandLink to={ISLAND.sites} />}>
          <p className="text-[16.5px]" style={{ color: C.cocoa }}>
            {pick(ABOUT.sites.lead)}
          </p>
          <ul className="mt-6 border-t" style={{ borderColor: C.cocoa }}>
            {ABOUT.sites.items.map((site) => (
              <li key={site.name.is} className="grid gap-x-8 gap-y-1 border-b py-4 sm:grid-cols-[14rem_1fr]" style={{ borderColor: C.line }}>
                <span className="bofs-display text-[19px]">{pick(site.name)}</span>
                <span className="text-[16px] leading-relaxed" style={{ color: C.cocoa }}>
                  {pick(site.body)}
                </span>
              </li>
            ))}
          </ul>
        </Chapter>

        {/* ── policies ──────────────────────────────────────────────────── */}
        <Chapter id="stefnur" title={pick(ABOUT.policies.title)} ground={C.cream} aside={<IslandLink to={ISLAND.policies} />}>
          <ul className="grid border-t sm:grid-cols-2 sm:gap-x-10" style={{ borderColor: C.cocoa }}>
            {ABOUT.policies.items.map((p) => (
              <li key={p.is} className="border-b py-3 text-[16.5px]" style={{ borderColor: C.line, color: C.cocoa }}>
                {pick(p)}
              </li>
            ))}
          </ul>
        </Chapter>

        <InstitutionsAndClose />

        {/* ── contact ───────────────────────────────────────────────────── */}
        <section id="samband" className="bofs-wash scroll-mt-20" style={{ background: C.deep }}>
          <Torn color={C.deep} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12">
            <WordReveal as="h2" soft text={pick(ABOUT.contact.title)} className="bofs-display text-[clamp(28px,3.6vw,42px)] lg:col-span-4" style={{ color: C.deepText }} />
            <div className="lg:col-span-8">
              <a href={`tel:${ORG.phone.replace(/\s/g, '')}`} className="bofs-focus group bofs-display block rounded text-[clamp(30px,4vw,44px)]" style={{ color: C.sunOnDeep }}>
                <span className="bofs-way">{ORG.phone}</span>
              </a>
              <a href={`mailto:${ORG.email}`} className="bofs-focus group mt-2 inline-block rounded text-[19px] font-semibold" style={{ color: C.deepText }}>
                <span className="bofs-way">{ORG.email}</span>
              </a>
              <p className="mt-4 text-[16px]" style={{ color: 'rgba(246,232,213,.9)' }}>
                {ORG.address}
                <br />
                {pick(ORG.hours)}
              </p>
              <p className="mt-8 border-t pt-5 text-[14.5px] leading-relaxed" style={{ borderColor: 'rgba(246,232,213,.2)', color: 'rgba(246,232,213,.82)' }}>
                {pick({
                  is: 'Merki og nafn Barna- og fjölskyldustofu eru eign stofnunarinnar. Þessi vefur er hugmynd að framsetningu, ekki opinber vefur hennar.',
                  en: 'The Barna- og fjölskyldustofa emblem and name belong to the agency. This site is a design concept, not its official website.',
                })}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
