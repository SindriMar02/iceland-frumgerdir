/**
 * Öruggt skjól — "Um stofnunina" (about the agency).
 * Institution as typography: a letterhead fact band, the history timeline,
 * organisation, leadership, oversight and contact. Verified content only.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { asset, BofsStyles, C, Eyebrow, Footer, Header, SectionHead, SubNav, useLang, Arrow } from './ui'
import { WaveDivider } from './illustrations'
import { Timeline } from './sections'
import { ABOUT, LEADERSHIP, ORG, TIMELINE, UI } from './data'

export default function BofsUmStofnunina() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = `${pick(ABOUT.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subnav = [
    { id: 'hlutverk', label: pick(ABOUT.role.eyebrow) },
    { id: 'saga', label: pick(TIMELINE.eyebrow) },
    { id: 'skipulag', label: pick(ABOUT.org.eyebrow) },
    { id: 'stjorn', label: pick(ABOUT.leadership.eyebrow) },
    { id: 'eftirlit', label: pick(ABOUT.oversight.eyebrow) },
    { id: 'samband', label: pick(ABOUT.contact.eyebrow) },
  ]

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── HERO / CHARTER ───────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-4xl px-5 pb-14 pt-32 text-center sm:px-8 sm:pt-36">
            <Reveal y={14}>
              <Link to="/preview/bofs" className="bofs-focus mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold" style={{ background: '#fff', color: C.cocoa }}>
                <Arrow className="rotate-180" />
                {pick({ is: 'Forsíða', en: 'Home' })}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <Eyebrow>{pick(ABOUT.hero.kicker)}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(34px,6vw,62px)]">{pick(ABOUT.hero.title)}</h1>
            </Reveal>
          </div>

          {/* ruled letterhead fact band */}
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal delay={0.05}>
              <div className="grid divide-y overflow-hidden rounded-[24px] sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, borderColor: C.line }}>
                {ABOUT.factband.map((f) => (
                  <div key={pick(f.label)} className="px-6 py-5 text-center" style={{ borderColor: C.line }}>
                    <span className="block text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: C.clayText }}>
                      {pick(f.label)}
                    </span>
                    <span className="bofs-display bofs-display-sm mt-1.5 block text-[17px]" style={{ color: C.cocoa }}>
                      {pick(f.value)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* one photographic moment: the agency's people-space, arch-cropped */}
          <div className="mx-auto mt-14 max-w-5xl px-5 sm:px-8">
            <Reveal>
              <figure className="bofs-arch overflow-hidden" style={{ boxShadow: '0 34px 66px -46px rgba(58,44,34,.5)' }}>
                <Img
                  src={asset('interior-living.jpg')}
                  alt={pick({ is: 'Hlýlegt sameiginlegt rými baðað dagsbirtu', en: 'A warm shared space bathed in daylight' })}
                  className="bofs-photo h-[240px] w-full object-cover sm:h-[380px]"
                  fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
                />
              </figure>
            </Reveal>
          </div>
          <div className="h-16" />
        </section>

        <SubNav sections={subnav} />

        {/* ── ROLE ─────────────────────────────────────────────────────── */}
        <section id="hlutverk" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <SectionHead eyebrow={pick(ABOUT.role.eyebrow)} title={pick(ABOUT.role.title)} />
            <div className="mt-8 space-y-5">
              {ABOUT.role.paras.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
                    {pick(p)}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HISTORY ──────────────────────────────────────────────────── */}
        <section id="saga" className="scroll-mt-24" style={{ background: C.cream2 }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(TIMELINE.eyebrow)} title={pick(TIMELINE.title)} align="center" />
            <div className="mt-14">
              <Timeline />
            </div>
          </div>
        </section>

        {/* ── ORGANISATION ─────────────────────────────────────────────── */}
        <section id="skipulag" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(ABOUT.org.eyebrow)} title={pick(ABOUT.org.title)} lead={pick(ABOUT.org.lead)} />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {ABOUT.org.groups.map((g, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="h-full rounded-[24px] p-6" style={{ background: C.cream2, boxShadow: `inset 0 0 0 1px ${C.line}`, borderLeft: `4px solid ${[C.terra, C.sage, C.sky][i % 3]}` }}>
                    <h3 className="bofs-display bofs-display-sm text-[19px]">{pick(g.title)}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.body }}>
                      {pick(g.body)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEADERSHIP ───────────────────────────────────────────────── */}
        {LEADERSHIP.length > 0 && (
          <section id="stjorn" className="scroll-mt-24" style={{ background: C.oat }}>
            <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
              <SectionHead eyebrow={pick(ABOUT.leadership.eyebrow)} title={pick(ABOUT.leadership.title)} />
              <div className="mt-8 space-y-3">
                {LEADERSHIP.map((l) => (
                  <Reveal key={l.name}>
                    <div className="flex items-center gap-4 rounded-[22px] p-5" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                      <span className="bofs-display grid h-14 w-14 shrink-0 place-items-center rounded-full text-[20px]" style={{ background: C.cream2, color: C.clay }}>
                        {l.name.charAt(0)}
                      </span>
                      <div>
                        <span className="block text-[18px] font-bold" style={{ color: C.cocoa }}>
                          {l.name}
                        </span>
                        <span className="block text-[14px]" style={{ color: C.body }}>
                          {pick(l.title)}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── OVERSIGHT ────────────────────────────────────────────────── */}
        <section id="eftirlit" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <SectionHead eyebrow={pick(ABOUT.oversight.eyebrow)} title={pick(ABOUT.oversight.title)} />
            <Reveal delay={0.05}>
              <p className="bofs-pretty mt-6 text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick(ABOUT.oversight.body)}
              </p>
              <p className="mt-4 text-[14.5px] font-semibold" style={{ color: C.body }}>
                {pick(ABOUT.oversight.contact)}
              </p>
            </Reveal>
          </div>
          <WaveDivider color={C.deep} className="block w-full" />
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section id="samband" className="scroll-mt-24" style={{ background: C.deep }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(ABOUT.contact.eyebrow)} title={pick(ABOUT.contact.title)} onDeep />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] p-8" style={{ background: 'rgba(255,255,255,.06)', boxShadow: 'inset 0 0 0 1px rgba(246,232,213,.14)' }}>
                <a href={`tel:${ORG.phone.replace(/\s/g, '')}`} className="bofs-focus bofs-display block text-[clamp(30px,5vw,44px)]" style={{ color: C.sun }}>
                  {ORG.phone}
                </a>
                <a href={`mailto:${ORG.email}`} className="bofs-focus mt-2 block text-[18px] font-semibold" style={{ color: C.deepText }}>
                  {ORG.email}
                </a>
                <p className="mt-4 text-[15.5px]" style={{ color: 'rgba(246,232,213,.8)' }}>
                  {ORG.address}
                </p>
                <p className="mt-1 text-[14.5px]" style={{ color: 'rgba(246,232,213,.65)' }}>
                  {pick(ORG.hours)}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-[28px] p-8" style={{ background: 'rgba(255,255,255,.06)', boxShadow: 'inset 0 0 0 1px rgba(246,232,213,.14)' }}>
                <span className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: C.sun }}>
                  {pick(ORG.motto)}
                </span>
                <p className="mt-3 text-[16px] leading-relaxed" style={{ color: 'rgba(246,232,213,.85)' }}>
                  {pick({
                    is: 'Merki og nafn Barna- og fjölskyldustofu eru eign stofnunarinnar. Þessi vefur er hugmynd, ekki opinber vefur hennar.',
                    en: 'The Barna- og fjölskyldustofa emblem and name are property of the agency. This site is a concept, not its official website.',
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
