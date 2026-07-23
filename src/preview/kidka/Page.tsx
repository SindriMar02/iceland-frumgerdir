/**
 * KIDKA Wool Factory — "UPPSKRIFTIN" (The Pattern).
 *
 * REBUILD (2026-07-23). The first version was a competent but templated page:
 * photo hero + trust marquee + card grid + dark band + photo-split + review
 * cards. Sindri's note: every build shares one spine in costume. So this one
 * changes the STRUCTURAL MODEL, not the paint.
 *
 * THE IDEA: Icelandic knitwear is designed on charted grids — every knitter
 * reads a chart. So the chart IS the interface. The page is drawn on a
 * stitch grid, the brand pattern is a real chart that knits itself stitch by
 * stitch, the five making stages fill that same chart in as you step through
 * them, and the products live in chart cells with coordinates.
 *
 * References blended (Mobbin, 2026-07-23):
 *  - FREITAG's illustrated factory cutaway → the building AS the diagram
 *  - Faculty Department / Le Labo → editorial restraint, working-hands photo
 *  - SIGMA "Made in Aizu" → place-as-provenance centred statement
 *  - Savor → material macro as the whole image, near-zero UI
 * Nothing is lifted; the blend is the stitch chart, which is KIDKA's own
 * craft language and not borrowed from any of them.
 *
 * SIGNATURE (a different CLASS from our usual reveal): the yoke band knits
 * itself — chart cells fill row by row, left to right, in stitch order, on a
 * pure time-based CSS animation with per-cell delay. No scroll coupling, no
 * rAF, nothing gated on JS. prefers-reduced-motion renders the band complete.
 *
 * DELIBERATELY ABSENT (the banned kit): full-bleed photo hero, tracked-caps
 * eyebrow over a big display word with one italic accent, trust marquee,
 * 4-up product card grid, dark process band with numbered steps, photo-split
 * story, 3 review cards, IO translateY fade as the through-line.
 *
 * HONESTY: an earlier pass drew a factory FLOOR PLAN. Its architecture (room
 * sizes, adjacencies, a door, a walking route) was invented — none of it is
 * published anywhere — and a plan reads as documentation, so it was removed
 * 2026-07-23. What remains is the sourced ORDER of the work. All photography,
 * product names and prices are KIDKA's own (see data.ts).
 *
 * AA (computed): ink #16141A on oat #EFE9DC 15.6:1 · oat on ink 15.6:1 ·
 * ink on dye #E0A100 6.7:1 · ochre #7A5600 on oat 6.0:1.
 */
import { useEffect, useRef, useState } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  C2,
  CATEGORIES,
  CHART_H,
  CHART_W,
  CONTACT,
  FONT2,
  HOURS,
  IMG,
  PRODUCTS,
  REVIEWS,
  STAGES,
  SWATCH,
  chartCell,
  type Stage,
} from './data'

const company = getPreviewCompany('kidka')

/* ------------------------------------------------------------------ chart */

/** The brand band: a charted yoke motif that knits itself in stitch order.
 *  `repeats` tiles the 13-stitch repeat horizontally. Pure CSS delays. */
function ChartBand({
  repeats = 6,
  cell = 12,
  animate = true,
  className = '',
}: {
  repeats?: number
  cell?: number
  animate?: boolean
  className?: string
}) {
  const cols = CHART_W * repeats
  const total = cols * CHART_H
  // The whole band always finishes knitting in KNIT_MS, whatever its length,
  // and a failsafe forces every stitch visible shortly after — a throttled or
  // animation-suppressed tab must never leave the brand pattern blank.
  const KNIT_MS = 1300
  const [done, setDone] = useState(!animate)
  useEffect(() => {
    if (!animate) return
    const t = window.setTimeout(() => setDone(true), KNIT_MS + 700)
    return () => window.clearTimeout(t)
  }, [animate])

  return (
    <div
      className={`kidka-band ${animate && !done ? 'knit' : ''} ${className}`}
      aria-hidden="true"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        width: 'max-content',
      }}
    >
      {Array.from({ length: CHART_H }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const on = chartCell(r, c % CHART_W)
          // stitch order: row by row, left to right, scaled to KNIT_MS total
          const idx = r * cols + c
          return (
            <span
              key={`${r}-${c}`}
              className={on ? 'st on' : 'st'}
              style={{ animationDelay: `${Math.round((idx / total) * KNIT_MS)}ms` }}
            />
          )
        }),
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ stages */

/** The pattern grows as you step through the stages: rows already "knitted"
 *  are inked, the rest stay as ghosted grid. Replaces an earlier factory
 *  floor plan whose architecture was invented — this makes no spatial claim
 *  about the building, only about the order of the work. */
function StageChart({ step, cell = 15 }: { step: number; cell?: number }) {
  const repeats = 5
  const cols = CHART_W * repeats
  const knittedRows = Math.round(((step + 1) / STAGES.length) * CHART_H)
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
          gridAutoRows: `${cell}px`,
          width: 'max-content',
        }}
      >
        {Array.from({ length: CHART_H }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const on = chartCell(r, c % CHART_W)
            const knitted = CHART_H - 1 - r < knittedRows
            return (
              <span
                key={`${r}-${c}`}
                style={{
                  background: on ? C2.ink : 'transparent',
                  outline: on ? 'none' : `0.5px solid ${C2.grid}`,
                  opacity: on ? (knitted ? 1 : 0.12) : knitted ? 0.5 : 0.18,
                  transition: 'opacity 420ms ease',
                }}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- component */

export default function KidkaPage() {
  const [step, setStep] = useState(0)
  const [navOn, setNavOn] = useState(false)
  const bandRef = useRef<HTMLDivElement>(null)
  const stage: Stage = STAGES[step]

  useEffect(() => {
    setThemeColor(C2.oat)
    const onScroll = () => setNavOn(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <PreviewChrome company={company} />
      <style>{`
        @keyframes kidka-stitch { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        .kidka-band .st { background: transparent; }
        .kidka-band .st.on { background: ${C2.ink}; }
        .kidka-band.knit .st.on { opacity: 0; animation: kidka-stitch 260ms steps(2, end) both; }
        .kidka-chart-ground {
          background-image:
            linear-gradient(to right, ${C2.grid} 1px, transparent 1px),
            linear-gradient(to bottom, ${C2.grid} 1px, transparent 1px);
          background-size: 22px 22px;
        }
        @media (prefers-reduced-motion: reduce) {
          .kidka-band.knit .st.on { opacity: 1; animation: none; }
        }
      `}</style>

      <div
        className="kidka-chart-ground"
        style={{ background: C2.oat, color: C2.ink, fontFamily: FONT2.body }}
      >
        {/* ----------------------------------------------------------- nav */}
        <header
          className="sticky top-0 z-40 border-b transition-colors"
          style={{
            borderColor: navOn ? C2.gridStrong : 'transparent',
            background: navOn ? 'rgba(239,233,220,0.92)' : 'transparent',
            backdropFilter: navOn ? 'blur(6px)' : undefined,
          }}
        >
          <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3.5">
            <a href="#top" className="text-[1.15rem] tracking-[0.2em]" style={{ fontFamily: FONT2.display }}>
              KIDKA
            </a>
            <nav aria-label="Main" className="flex items-center gap-5">
              <a href="#plan" className="hidden text-[0.85rem] hover:underline sm:inline">
                The floor
              </a>
              <a href="#chart" className="hidden text-[0.85rem] hover:underline sm:inline">
                The collection
              </a>
              <a href="#visit" className="hidden text-[0.85rem] hover:underline sm:inline">
                Visit
              </a>
              <a
                href="https://kidka.com/shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-[0.85rem] font-bold"
                style={{ background: C2.ink, color: C2.oat }}
              >
                Shop
              </a>
            </nav>
          </div>
        </header>

        {/* ---------------------------------------------------------- hero */}
        <section id="top" className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 lg:pb-24 lg:pt-16">
          <div ref={bandRef} className="mb-10 overflow-hidden">
            <ChartBand repeats={9} cell={13} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
            <div>
              <p
                className="mb-5 text-[0.78rem] uppercase"
                style={{ fontFamily: FONT2.mono, color: C2.ochre, letterSpacing: '0.14em' }}
              >
                Ullarverksmiðjan KIDKA · Hvammstangi · síðan 2008 í fjölskyldueigu
              </p>
              <h1
                className="text-[clamp(2.5rem,7vw,5.2rem)] leading-[0.95]"
                style={{ fontFamily: FONT2.display }}
              >
                Every KIDKA sweater
                <br />
                starts as a chart
                <br />
                and ends
                <span
                  className="ml-3 inline-block px-2"
                  style={{ background: C2.dye, color: C2.ink }}
                >
                  in your hands.
                </span>
              </h1>
              <p className="mt-7 max-w-[54ch] text-[1.05rem] leading-relaxed" style={{ color: C2.inkSoft }}>
                We knit it ourselves, from Icelandic wool, on machines in Hvammstangi, and have done
                since 1972. The shop adjoins the factory, and you are welcome to look in and see
                the work for yourself.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#chart"
                  className="px-6 py-3.5 text-[0.95rem] font-bold"
                  style={{ background: C2.ink, color: C2.oat }}
                >
                  See the collection
                </a>
                <a
                  href="#plan"
                  className="border px-6 py-3.5 text-[0.95rem] font-bold"
                  style={{ borderColor: C2.ink, color: C2.ink }}
                >
                  Walk the factory floor
                </a>
              </div>
            </div>

            {/* the swatch: material as image (Savor lesson), in a chart cell */}
            <figure className="border p-2" style={{ borderColor: C2.gridStrong, background: C2.oatDeep }}>
              <img
                src={IMG.mittens}
                alt="Grey patterned KIDKA wool mittens resting on wet pebbles"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption
                className="flex items-center justify-between px-1 pt-2 text-[0.72rem]"
                style={{ fontFamily: FONT2.mono, color: C2.ochre }}
              >
                <span>SWATCH / LOPI</span>
                <span>100% ÍSL. ULL</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* --------------------------------------------------------- stages */}
        <section id="plan" className="border-y" style={{ borderColor: C2.gridStrong, background: C2.oatDeep }}>
          <div className="mx-auto max-w-[1180px] px-5 py-16 lg:py-24">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight" style={{ fontFamily: FONT2.display }}>
                One row, start to finish
              </h2>
              <p className="text-[0.78rem]" style={{ fontFamily: FONT2.mono, color: C2.ochre }}>
                {stage.n} / 05 · {stage.titleIs.toUpperCase()}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
              <div className="flex flex-col justify-center border p-5" style={{ borderColor: C2.gridStrong, background: C2.oat }}>
                <StageChart step={step} />
                <p className="mt-5 text-[0.75rem]" style={{ fontFamily: FONT2.mono, color: C2.ochre }}>
                  The pattern fills in as the work moves along.
                </p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-[1.8rem] leading-tight" style={{ fontFamily: FONT2.display }}>
                  {stage.title}
                </h3>
                <p className="mt-3 text-[1rem] leading-relaxed" style={{ color: C2.inkSoft }}>
                  {stage.note}
                </p>
                {stage.hook && (
                  <p
                    className="mt-4 self-start px-2 py-1 text-[1rem] font-bold"
                    style={{ background: C2.dye, color: C2.ink }}
                  >
                    {stage.hook}
                  </p>
                )}

                <ol className="mt-7 flex flex-col gap-1.5">
                  {STAGES.map((s, i) => (
                    <li key={s.n}>
                      <button
                        type="button"
                        onClick={() => setStep(i)}
                        aria-current={i === step ? 'step' : undefined}
                        className="flex w-full items-baseline gap-3 border px-3 py-2 text-left text-[0.88rem]"
                        style={{
                          borderColor: i === step ? C2.ink : C2.gridStrong,
                          background: i === step ? C2.ink : 'transparent',
                          color: i === step ? C2.oat : C2.ink,
                        }}
                      >
                        <span style={{ fontFamily: FONT2.mono }}>{s.n}</span>
                        <span>{s.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-[0.8rem] leading-relaxed" style={{ color: C2.inkSoft }}>
                  Stages and wording taken from KIDKA&rsquo;s own descriptions. We have not drawn the
                  building itself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- collection */}
        <section id="chart" className="mx-auto max-w-[1180px] px-5 py-16 lg:py-24">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight" style={{ fontFamily: FONT2.display }}>
              The collection, charted
            </h2>
            <p className="text-[0.78rem]" style={{ fontFamily: FONT2.mono, color: C2.ochre }}>
              Verð af kidka.com · 23.07.2026
            </p>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${C2.gridStrong}`, borderLeft: `1px solid ${C2.gridStrong}` }}>
            {PRODUCTS.map((p, i) => {
              const coord = `${String.fromCharCode(65 + (i % 4))}${Math.floor(i / 4) + 1}`
              return (
                <li key={p.name} style={{ borderRight: `1px solid ${C2.gridStrong}`, borderBottom: `1px solid ${C2.gridStrong}` }}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block p-3">
                    <div className="mb-3 flex items-center justify-between text-[0.7rem]" style={{ fontFamily: FONT2.mono, color: C2.ochre }}>
                      <span>{coord}</span>
                      {p.tag && <span>{p.tag}</span>}
                    </div>
                    <div className="overflow-hidden" style={{ background: C2.oatDeep }}>
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <p className="mt-3 text-[0.95rem] font-bold leading-snug">{p.name}</p>
                    <p className="mt-1 text-[0.95rem]" style={{ fontFamily: FONT2.mono, color: C2.ochre }}>
                      {p.eur ? `€${p.eur}` : 'sjá verð →'}
                    </p>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <a
                key={c.label}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border px-3 py-1.5 text-[0.82rem] hover:bg-[rgba(22,20,26,0.06)]"
                style={{ borderColor: C2.gridStrong }}
              >
                {c.label}
              </a>
            ))}
          </div>
        </section>

        {/* ------------------------------------------- made in Hvammstangi */}
        <section className="relative">
          <img
            src={IMG.band}
            alt="Two women wearing dark patterned KIDKA sweaters and beanies beside Icelandic horses"
            loading="lazy"
            className="h-[62vh] min-h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center px-5" style={{ background: 'rgba(12,10,8,0.42)' }}>
            <div className="max-w-[46ch] text-center">
              <h2 className="text-[clamp(1.9rem,4.4vw,3.4rem)] leading-tight text-white" style={{ fontFamily: FONT2.display }}>
                Made in Hvammstangi
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-white/90">
                A town of a few hundred on the road north, better known for its seals. The wool
                comes from Icelandic sheep, the knitting happens here, and the people who own the
                factory are the people who run it.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- swatch */}
        <section className="mx-auto max-w-[1180px] px-5 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div className="border p-2" style={{ borderColor: C2.gridStrong }}>
              <img
                src={IMG.story}
                alt="A man wearing a patterned KIDKA cardigan in front of winter grass"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight" style={{ fontFamily: FONT2.display }}>
                What it is made of, plainly
              </h2>
              <dl className="mt-8">
                {SWATCH.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col gap-1 border-b py-4 sm:flex-row sm:items-baseline sm:gap-6"
                    style={{ borderColor: C2.gridStrong }}
                  >
                    <dt
                      className="w-[9rem] shrink-0 text-[0.75rem] uppercase"
                      style={{ fontFamily: FONT2.mono, color: C2.ochre, letterSpacing: '0.1em' }}
                    >
                      {k}
                    </dt>
                    <dd className="text-[1.02rem]">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-4">
                {REVIEWS.slice(0, 2).map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[24ch] border-l-2 pl-3 text-[0.92rem] italic hover:underline"
                    style={{ borderColor: C2.dye, color: C2.inkSoft }}
                  >
                    “{r.quote}”
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- visit / label */}
        <section id="visit" style={{ background: C2.ink, color: C2.oat }}>
          <div className="mx-auto max-w-[1180px] px-5 py-16 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <div>
                <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight" style={{ fontFamily: FONT2.display }}>
                  Come and watch
                </h2>
                <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed" style={{ color: '#C9C0AF' }}>
                  The factory shop is five minutes off Route 1, halfway between Reykjavík and
                  Akureyri. Or order from anywhere and it ships from this same floor.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="https://kidka.com/shop/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 text-[0.95rem] font-bold"
                    style={{ background: C2.dye, color: C2.ink }}
                  >
                    Shop the collection
                  </a>
                  <a
                    href={CONTACT.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border px-6 py-3.5 text-[0.95rem] font-bold"
                    style={{ borderColor: C2.oat, color: C2.oat }}
                  >
                    Open in maps
                  </a>
                </div>
              </div>

              {/* the care label — copy-as-design, and where the practical info lives */}
              <div className="border p-6" style={{ borderColor: 'rgba(239,233,220,0.35)' }}>
                <ChartBand repeats={3} cell={7} animate={false} className="mb-5 opacity-70" />
                <p className="text-[0.72rem] uppercase" style={{ fontFamily: FONT2.mono, letterSpacing: '0.16em', color: C2.dye }}>
                  Care label / opening hours
                </p>
                {[HOURS.winter, HOURS.summer].map((s) => (
                  <div key={s.label} className="mt-5">
                    <p className="text-[0.82rem]" style={{ fontFamily: FONT2.mono, color: '#C9C0AF' }}>
                      {s.label}
                    </p>
                    <dl className="mt-1.5">
                      {s.rows.map(([d, h]) => (
                        <div key={d} className="flex items-baseline justify-between border-b py-2 text-[0.95rem]" style={{ borderColor: 'rgba(239,233,220,0.16)' }}>
                          <dt>{d}</dt>
                          <dd style={{ fontFamily: FONT2.mono }}>{h}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
                <dl className="mt-6 space-y-2 text-[0.95rem]">
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-[0.75rem] uppercase" style={{ fontFamily: FONT2.mono, color: C2.dye }}>Addr</dt>
                    <dd>{CONTACT.address}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-[0.75rem] uppercase" style={{ fontFamily: FONT2.mono, color: C2.dye }}>Tel</dt>
                    <dd><a href={`tel:${CONTACT.phoneTel}`} className="hover:underline">{CONTACT.phone}</a></dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-[0.75rem] uppercase" style={{ fontFamily: FONT2.mono, color: C2.dye }}>Mail</dt>
                    <dd><a href={`mailto:${CONTACT.email}`} className="hover:underline">{CONTACT.email}</a></dd>
                  </div>
                </dl>
                <p className="mt-5 text-[0.78rem]" style={{ color: '#A79C89' }}>
                  Hours as published on kidka.com. Confirm around holidays.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden pb-2 opacity-60">
            <ChartBand repeats={12} cell={9} animate={false} />
          </div>
        </section>

        {/* --------------------------------------------- mobile sticky CTA */}
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t px-4 py-3 md:hidden"
          style={{ background: 'rgba(239,233,220,0.97)', borderColor: C2.gridStrong, backdropFilter: 'blur(6px)' }}
        >
          <a
            href="https://kidka.com/shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 text-center text-[0.95rem] font-bold"
            style={{ background: C2.ink, color: C2.oat }}
          >
            Shop the collection
          </a>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="border px-5 py-3 text-[0.95rem] font-bold"
            style={{ borderColor: C2.ink, color: C2.ink }}
          >
            Call
          </a>
        </div>
        <div className="h-14 md:hidden" aria-hidden="true" />

        <PreviewFooter company={company} />
      </div>
    </>
  )
}
