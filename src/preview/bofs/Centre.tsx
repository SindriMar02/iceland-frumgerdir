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
import { asset, BofsStyles, Button, C, Footer, Header, useLang, Arrow } from './ui'
import { HomeArt, WaveDivider } from './illustrations'
import { QuestionIndex, JourneyStrip, FosterSteps, NotFoundPage } from './sections'
import { CENTRE_PHOTO, HELP, SERVICES, UI, serviceBySlug } from './data'

/** Addresses that used to be real services and should not dead-end. */
const RETIRED_SLUGS = new Set(['fannafold'])

/** Tint the hero veil with the service's own hue so each page keeps its identity. */
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export default function BofsCentre() {
  const { slug = '' } = useParams()
  const [, , pick] = useLang()
  const service = serviceBySlug(slug)

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Barna- og fjölskyldustofa`
      setThemeColor(service.hueSoft)
    }
  }, [service])

  // A retired service URL still lands people on the hub, since it was once a
  // real address; anything else is a genuine wrong turn and gets the 404.
  if (!service) return RETIRED_SLUGS.has(slug) ? <Navigate to="/preview/bofs" replace /> : <NotFoundPage />

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
        {/* ── HERO: the service's own painting, full bleed ─────────────── */}
        <section className="relative overflow-hidden" style={{ background: service.hueSoft }}>
          {photo && (
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <Img
                src={asset(photo.src)}
                alt=""
                loading="eager"
                fetchpriority="high"
                className="h-full w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#F8EAD8] to-[#CFD7C4]"
              />
              {/* legibility veil, tinted with the service hue so each page keeps its identity */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(100deg, ${hexToRgba(service.hueSoft, 0.96)} 0%, ${hexToRgba(service.hueSoft, 0.9)} 34%, ${hexToRgba(service.hueSoft, 0.55)} 60%, ${hexToRgba(service.hueSoft, 0.2)} 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: `linear-gradient(${hexToRgba(service.hueSoft, 0)}, ${service.hueSoft})` }} />
            </div>
          )}
          <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-32 sm:px-8 sm:pt-36">
            <div className="max-w-2xl">
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
                <p className="mt-3 text-[clamp(17px,2.2vw,20px)] font-medium leading-snug" style={{ color: C.cocoa, opacity: 0.75 }}>
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

          </div>
          <WaveDivider color={C.cream} className="h-12 w-full" />
        </section>

        {/* ── WHERE IN THE PROCESS ─────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <JourneyStrip serviceName={service.name} hue={service.hue} />
        </section>

        {/* ── BODY ─────────────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8">
            {photo && (
              <Reveal>
                <p className="mb-12 border-l-2 pl-4 text-[13.5px] leading-relaxed" style={{ borderColor: service.hue, color: C.body }}>
                  {pick(photo.alt)}
                  {/*
                    Explicit measured colour, never opacity. C.body dimmed to
                    0.8 computes to #877568 on cream, which is 3.99:1 and fails
                    AA at this size; this is 5.08:1 and still reads as secondary
                    to the alt text above it. Same mistake, same fix as the
                    muted 13px text corrected on 17 July.
                  */}
                  {photo.painted && (
                    <span className="mt-1 block" style={{ color: '#786456' }}>
                      {pick({ is: 'Máluð eftir raunverulegri ljósmynd af húsinu.', en: 'Painted from a real photograph of the building.' })}
                    </span>
                  )}
                </p>
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
                    <div className="rounded-[18px] p-6" style={{ background: service.hueSoft }}>
                      <p className="text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
                        {pick(service.how)}
                      </p>
                    </div>
                  </Block>
                </div>

                {/* honest note */}
                <div className="relative rounded-[20px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
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
                <div className="overflow-hidden rounded-[20px]" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
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
                  className="bofs-focus mt-4 flex items-center gap-3 rounded-[18px] p-5 transition-transform hover:-translate-y-1"
                  style={{ background: C.deep, color: C.deepText }}
                >
                  <span className="bofs-display bofs-num grid h-12 w-16 shrink-0 place-items-center rounded-xl text-[20px]" style={{ background: 'rgba(255,255,255,.1)', color: C.sunOnPanel }}>
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

        {/* ── BECOMING A FOSTER PARENT (fostur only) ───────────────────── */}
        {slug === 'fostur' && <FosterSteps />}

        {/* ── ASK ──────────────────────────────────────────────────────────
             Placed where a question actually forms: after you have read the
             page and it did not answer you. ───────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
            <QuestionIndex compact />
          </div>
        </section>

        {/* ── NEXT + BACK ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: next.hueSoft }}>
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
