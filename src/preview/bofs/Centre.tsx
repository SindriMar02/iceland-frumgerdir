/**
 * Öruggt skjól — one page per service (shared template).
 *
 * Rebuilt 2026-09-17 without the old parts: no back pill, no dotted labels,
 * no gradient scrim over the painting, no rounded boxes, no quote card, no
 * dark help card, no pill buttons. The page is type, the painting of the
 * place, and hairlines. Every page hands off to the official page on
 * island.is and to the municipal child protection service.
 *
 * Renders any service from the URL slug; the retired Fannafold address goes
 * to the hub, anything else unknown gets the not-found page.
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { asset, BofsStyles, C, Footer, Header, IslandLink, PageHead, Torn, useLang } from './ui'
import { FosterSteps, JourneyStrip, NotFoundPage } from './sections'
import { CENTRE_PHOTO, HELP, ISLAND, SERVICE_ISLAND, SERVICES, UI, serviceBySlug } from './data'

/** Addresses that used to be real services and should not dead-end. */
const RETIRED_SLUGS = new Set(['fannafold'])

export default function BofsCentre() {
  const { slug = '' } = useParams()
  const [, , pick] = useLang()
  const service = serviceBySlug(slug)

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Barna- og fjölskyldustofa`
      setThemeColor(C.cream)
    }
  }, [service])

  if (!service) return RETIRED_SLUGS.has(slug) ? <Navigate to="/preview/bofs" replace /> : <NotFoundPage />

  const idx = SERVICES.findIndex((s) => s.slug === slug)
  const next = SERVICES[(idx + 1) % SERVICES.length]
  const photo = CENTRE_PHOTO[slug]
  const island = SERVICE_ISLAND[service.slug]
  const base = photo?.src.replace('.jpg', '')

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── opening: name, what it is, the painting of the place ─────── */}
        <section className="bofs-wash" style={{ background: C.cream }}>
          <PageHead
            crumb={service.name}
            title={service.name}
            lead={
              <>
                <span className="block text-[15px] font-semibold" style={{ color: C.clayText }}>
                  {pick(service.kind)}
                </span>
                <span className="mt-2 block">{pick(service.card)}</span>
              </>
            }
            wide
          >
            <a href="#hvernig" className="bofs-focus group rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
              <span className="bofs-way">{pick(UI.howToReach)}</span>
            </a>
            {island && <IslandLink to={island} />}
          </PageHead>
          {photo && (
            <figure className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
              <div className="bofs-wet">
                <Img
                  src={asset(photo.src)}
                  srcSet={`${asset(`${base}-900.jpg`)} 900w, ${asset(`${base}-1400.jpg`)} 1400w, ${asset(photo.src)} 2560w`}
                  sizes="(min-width: 1200px) 1120px, 100vw"
                  width={2560}
                  height={1440}
                  alt={pick(photo.alt)}
                  loading="eager"
                  fetchpriority="high"
                  className="bofs-open-settle aspect-[16/8] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#F8EAD8] to-[#CFD7C4]"
                />
              </div>
              {photo.painted && (
                <figcaption className="mt-3 text-[13.5px]" style={{ color: C.body }}>
                  {pick({ is: 'Vatnslitamynd, máluð eftir ljósmynd af húsinu.', en: 'Watercolour, painted from a photograph of the building.' })}
                </figcaption>
              )}
            </figure>
          )}
        </section>

        {/* ── where this service sits on the path ──────────────────────── */}
        <section className="bofs-wash" style={{ background: C.cream2 }}>
          <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
          <JourneyStrip serviceName={service.name} />
        </section>

        {/* ── the body: who, what, how, and the facts beside it ────────── */}
        <section className="bofs-wash" style={{ background: C.cream }}>
          <Torn color={C.cream} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7">
              <Part label={pick(UI.whoFor)}>
                <p className="bofs-pretty text-[19px] leading-relaxed" style={{ color: C.cocoa }}>
                  {pick(service.who)}
                </p>
              </Part>

              <Part label={pick(UI.whatHappens)}>
                <p className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
                  {pick(service.what)}
                </p>
              </Part>

              <div id="hvernig" className="scroll-mt-24">
                <Part label={pick(UI.howToReach)}>
                  <p className="bofs-pretty text-[18px] leading-relaxed" style={{ color: C.cocoa }}>
                    {pick(service.how)}
                  </p>
                  <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {service.slug === 'fostur' ? <IslandLink to={ISLAND.fosterBecome} button /> : <IslandLink to={ISLAND.municipal} button />}
                    {island && <IslandLink to={island} />}
                  </p>
                </Part>
              </div>

              <p className="bofs-display bofs-balance border-t pt-8 text-[clamp(22px,2.6vw,28px)]" style={{ borderColor: C.line, fontWeight: 500 }}>
                {pick(service.note)}
              </p>
            </div>

            {/* the facts, as a plain definition list beside the text */}
            <aside className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <h2 className="text-[14px] font-semibold" style={{ color: C.clayText }}>
                {pick(UI.keyFacts)}
              </h2>
              <dl className="mt-3 border-t" style={{ borderColor: C.cocoa }}>
                {service.facts.map((f) => (
                  <div key={pick(f.label)} className="grid grid-cols-[7rem_1fr] gap-4 border-b py-4" style={{ borderColor: C.line }}>
                    <dt className="text-[14.5px]" style={{ color: C.body }}>
                      {pick(f.label)}
                    </dt>
                    <dd className="text-[15.5px] font-semibold" style={{ color: C.cocoa }}>
                      {pick(f.value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[14.5px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick({
                  is: 'Sótt er um úrræðið í gegnum barnaverndarþjónustu sveitarfélagsins, ekki beint.',
                  en: 'The service is applied for through the municipal child protection service, not directly.',
                })}
              </p>
              <p className="mt-8 border-t pt-5 text-[15px] leading-relaxed" style={{ borderColor: C.line, color: C.cocoa }}>
                {pick({ is: 'Þarftu að tala við einhvern núna?', en: 'Need to talk to someone now?' })}{' '}
                <a href={`tel:${HELP.lines[1].value}`} className="bofs-focus group rounded font-semibold" style={{ color: C.clayText }}>
                  <span className="bofs-way">
                    {pick(HELP.lines[1].label)} {HELP.lines[1].value}
                  </span>
                </a>
                <span className="block text-[14px]" style={{ color: C.body }}>
                  {pick(HELP.lines[1].blurb)}
                </span>
              </p>
            </aside>
          </div>
        </section>

        {slug === 'fostur' && <FosterSteps />}

        {/* ── next service ─────────────────────────────────────────────── */}
        <section className="bofs-wash" style={{ background: C.oat }}>
          <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-16 pt-12 sm:px-8 md:flex-row md:items-end md:justify-between">
            <Link to={`/preview/bofs/${next.slug}`} className="bofs-focus group block rounded">
              <span className="block text-[14px] font-semibold" style={{ color: C.clayText }}>
                {pick(UI.nextCentre)}
              </span>
              <span className="bofs-display bofs-way bofs-way-ink mt-1 inline-block text-[clamp(30px,4vw,44px)]">{next.name}</span>
              <span className="mt-1 block text-[15px]" style={{ color: C.body }}>
                {pick(next.kind)}
              </span>
            </Link>
            <Link to="/preview/bofs#heimili" className="bofs-focus group rounded text-[15px] font-semibold" style={{ color: C.cocoa }}>
              <span className="bofs-way">{pick(UI.allServices)}</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[14px] font-semibold" style={{ color: C.clayText }}>
        {label}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}
