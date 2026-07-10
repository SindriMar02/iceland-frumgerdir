/**
 * Öruggt skjól — per-centre / per-service page (shared template).
 * Renders any of the 8 services from the URL slug; unknown slugs
 * (including the retired Fannafold) redirect to the hub.
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { asset, BofsStyles, Button, C, Footer, Header, useLang, useSmoothScroll, Arrow } from './ui'
import { HomeArt, ValleyScene, WaveDivider } from './illustrations'
import { CENTRE_PHOTO, HELP, SERVICES, UI, serviceBySlug } from './data'

export default function BofsCentre() {
  const { slug = '' } = useParams()
  const [, , pick] = useLang()
  const service = serviceBySlug(slug)

  useSmoothScroll()

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Barna- og fjölskyldustofa`
      setThemeColor(service.hueSoft)
    }
  }, [service])

  if (!service) return <Navigate to="/preview/bofs" replace />

  const idx = SERVICES.findIndex((s) => s.slug === slug)
  const next = SERVICES[(idx + 1) % SERVICES.length]
  const photo = CENTRE_PHOTO[slug]

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: service.hueSoft }}>
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal y={14}>
                <Link
                  to="/preview/bofs"
                  className="bofs-focus inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold"
                  style={{ background: 'rgba(255,255,255,.7)', color: C.cocoa }}
                >
                  <Arrow className="rotate-180" />
                  {pick(UI.backToAll)}
                </Link>
              </Reveal>
              <Reveal delay={0.06}>
                <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold" style={{ background: '#fff', color: C.cocoa }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: service.hue }} />
                  {pick(service.kind)}
                </span>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="bofs-display mt-4 text-[clamp(40px,7vw,68px)]">{service.name}</h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="bofs-hand mt-1 text-[clamp(22px,3vw,30px)]" style={{ color: C.cocoa, opacity: 0.72 }}>
                  {pick(service.tagline)}
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-5 max-w-xl text-[18px] leading-relaxed" style={{ color: C.cocoa, opacity: 0.82 }}>
                  {pick(service.card)}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="#hvernig" icon={<Arrow />}>
                    {pick(UI.howToReach)}
                  </Button>
                  <Button href="tel:112" variant="soft">
                    {pick(UI.emergencyChip)}
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.16} className="flex justify-center">
              <div className="bofs-float w-[68%] max-w-[320px] lg:w-full">
                <HomeArt art={service.art} hue={service.hue} hueSoft="#FFFFFF" className="h-auto w-full drop-shadow-xl" />
              </div>
            </Reveal>
          </div>
          <WaveDivider color={C.cream} className="h-12 w-full" />
        </section>

        {/* ── BODY ─────────────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            {photo && (
              <Reveal>
                <figure className="mb-16 overflow-hidden rounded-[30px]" style={{ boxShadow: `0 34px 66px -46px rgba(58,44,34,.55)` }}>
                  <Img
                    src={asset(photo.src)}
                    alt={pick(photo.alt)}
                    className="h-[240px] w-full object-cover sm:h-[380px]"
                    fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
                  />
                </figure>
              </Reveal>
            )}
            <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
              {/* left: narrative */}
              <div className="space-y-12">
                <Block eyebrow={pick(UI.whoFor)} hue={service.hue}>
                  <p className="text-[19px] leading-relaxed" style={{ color: C.cocoa }}>
                    {pick(service.who)}
                  </p>
                </Block>

                <Block eyebrow={pick(UI.whatHappens)} hue={service.hue}>
                  <p className="text-[18px] leading-relaxed" style={{ color: C.body }}>
                    {pick(service.what)}
                  </p>
                </Block>

                <div id="hvernig" className="scroll-mt-24">
                  <Block eyebrow={pick(UI.howToReach)} hue={service.hue}>
                    <div className="rounded-[24px] p-6" style={{ background: service.hueSoft }}>
                      <p className="text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                        {pick(service.how)}
                      </p>
                    </div>
                  </Block>
                </div>

                {/* honest note */}
                <div className="relative rounded-[26px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                  <span className="bofs-display absolute -top-3 left-6 text-[52px] leading-none" style={{ color: service.hue, opacity: 0.5 }}>
                    “
                  </span>
                  <p className="bofs-display pt-4 text-[clamp(20px,2.6vw,26px)] leading-[1.3]" style={{ color: C.cocoa }}>
                    {pick(service.note)}
                  </p>
                </div>
              </div>

              {/* right: facts card (sticky) */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="overflow-hidden rounded-[28px]" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}, 0 30px 60px -44px rgba(58,44,34,.5)` }}>
                  <div className="px-6 py-5" style={{ background: service.hueSoft }}>
                    <span className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: C.cocoa }}>
                      {pick(UI.keyFacts)}
                    </span>
                  </div>
                  <dl className="divide-y" style={{ borderColor: C.line }}>
                    {service.facts.map((f) => (
                      <div key={pick(f.label)} className="flex items-start justify-between gap-4 px-6 py-4">
                        <dt className="text-[14px] font-semibold" style={{ color: C.body }}>
                          {pick(f.label)}
                        </dt>
                        <dd className="max-w-[62%] text-right text-[14.5px] font-bold" style={{ color: C.cocoa }}>
                          {pick(f.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="px-6 py-5" style={{ background: C.cream2 }}>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: C.body }}>
                      {pick({
                        is: 'Aðgangur að úrræðum er í gegnum barnavernd í þínu sveitarfélagi.',
                        en: 'Access to services is through child protection in your municipality.',
                      })}
                    </p>
                  </div>
                </div>

                {/* mini help */}
                <a
                  href={`tel:${HELP.lines[1].value}`}
                  className="bofs-focus mt-4 flex items-center gap-3 rounded-[22px] p-5 transition-transform hover:-translate-y-1"
                  style={{ background: C.deep, color: C.deepText }}
                >
                  <span className="bofs-display grid h-12 w-16 shrink-0 place-items-center rounded-xl text-[20px]" style={{ background: 'rgba(255,255,255,.1)', color: C.sun }}>
                    {HELP.lines[1].value}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold">{pick(HELP.lines[1].label)}</span>
                    <span className="block text-[13px]" style={{ color: 'rgba(246,232,213,.75)' }}>
                      {pick(HELP.lines[1].blurb)}
                    </span>
                  </span>
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* ── NEXT + BACK ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: next.hueSoft }}>
          <ValleyScene ambient={false} className="absolute inset-x-0 bottom-0 h-40 w-full opacity-40" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: C.body }}>
                {pick(UI.nextCentre)}
              </span>
              <Link to={`/preview/bofs/${next.slug}`} className="bofs-focus group mt-2 flex items-center gap-4 rounded-2xl">
                <HomeArt art={next.art} hue={next.hue} hueSoft="#FFFFFF" className="h-16 w-16 shrink-0" />
                <span>
                  <span className="bofs-display block text-[clamp(26px,4vw,38px)] transition-transform group-hover:translate-x-1">{next.name}</span>
                  <span className="text-[14px]" style={{ color: C.body }}>
                    {pick(next.kind)}
                  </span>
                </span>
              </Link>
            </div>
            <Button to="/preview/bofs" variant="soft" icon={<Arrow className="rotate-180" />}>
              {pick(UI.allServices)}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Block({ eyebrow, hue, children }: { eyebrow: string; hue: string; children: ReactNode }) {
  return (
    <Reveal>
      <div>
        <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: C.cocoa }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: hue }} />
          {eyebrow}
        </span>
        <div className="mt-4">{children}</div>
      </div>
    </Reveal>
  )
}
