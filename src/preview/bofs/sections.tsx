/**
 * Öruggt skjól — composed sections shared by the landing and the two long
 * reference pages. Everything here obeys the page performance contract:
 * native scroll only, transform/opacity choreography, no infinite animation
 * inside a large SVG, reduced-motion renders plainly, AA contrast throughout.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { Img } from '../../components/Img'
import { asset, Arrow, Button, C, Eyebrow, SectionHead, StatCountUp, useLang } from './ui'
import { ValleyScene, ArchNotchDivider } from './illustrations'
import {
  ABOUT_TEASER,
  CLOSING,
  FAQ,
  FOSTER_STEPS,
  HELP,
  INSTITUTIONS,
  type Milestone,
  ORG,
  REPORT,
  SERVICES,
  STATS,
  TIMELINE,
  UI,
  WAYFINDER,
} from './data'

const HUE: Record<string, string> = { terra: C.terra, sky: C.sky, sun: C.sun }

/* ── Wayfinder: three house-shaped doors (audience triage) ────────────── */

export function WayfinderDoors() {
  const [, , pick] = useLang()
  return (
    <section className="scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 text-center">
          <span className="bofs-hand text-[26px] leading-none" style={{ color: C.clayText }}>
            {pick(WAYFINDER.hand)}
          </span>
          <h2 className="bofs-display bofs-balance mt-1 text-[clamp(26px,4vw,40px)]">{pick(WAYFINDER.title)}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {WAYFINDER.doors.map((d, i) => {
            const hue = HUE[d.hueKey] ?? C.clay
            const inner = (
              <>
                <div className="relative h-[70px]" style={{ background: hue, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}>
                  <span
                    className="absolute left-1/2 top-8 h-5 w-5 -translate-x-1/2 rounded-[5px]"
                    style={{ background: '#FFE6AE', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.5)' }}
                  />
                </div>
                <div className="flex flex-1 flex-col rounded-b-[26px] px-6 pb-7 pt-5" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                  <h3 className="bofs-display bofs-display-sm bofs-balance text-[20px]">{pick(d.title)}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed" style={{ color: C.body }}>
                    {pick(d.body)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: C.clayText }}>
                    {pick({ is: 'Þangað', en: 'This way' })}
                    <Arrow className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </span>
                </div>
              </>
            )
            const cls = 'bofs-focus bofs-lift group flex h-full flex-col'
            const style = { filter: 'drop-shadow(0 26px 42px rgba(58,44,34,.14))' }
            return (
              <Reveal key={d.key} delay={i * 0.08} y={20}>
                {d.to.startsWith('/') ? (
                  <Link to={d.to} className={cls} style={style}>
                    {inner}
                  </Link>
                ) : (
                  <a href={d.to} className={cls} style={style}>
                    {inner}
                  </a>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── National statistics band (verified numbers only) ─────────────────── */

export function StatsBand() {
  const [, , pick] = useLang()
  const items = STATS.items
  if (items.length < 3) return null
  return (
    <section id="tolur" className="scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHead eyebrow={pick(STATS.eyebrow)} title={pick(STATS.title)} lead={pick(STATS.lead)} align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={i} delay={(i % 4) * 0.07}>
              <div className="flex h-full flex-col rounded-[26px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <StatCountUp value={s.value} format={s.format} className="bofs-display bofs-display-xl text-[clamp(40px,5vw,60px)]" style={{ color: C.clay, lineHeight: 1 }} />
                <span className="mt-3 text-[15px] font-medium leading-snug" style={{ color: C.body }}>
                  {pick(s.label)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px]" style={{ color: C.body, opacity: 0.75 }}>
          {pick(STATS.source)}
        </p>
      </div>
    </section>
  )
}

/* ── Tilkynningarskylda: the duty to report (the page's one white band) ── */

export function ReportBand() {
  const [, , pick] = useLang()
  return (
    <section id="tilkynna" className="scroll-mt-24" style={{ background: '#FFFFFF' }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{pick(REPORT.eyebrow)}</Eyebrow>
          <h2 className="bofs-display bofs-balance mt-3 text-[clamp(28px,5vw,46px)]">{pick(REPORT.title)}</h2>
          <p className="bofs-pretty mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.body }}>
            {pick(REPORT.lead)}
          </p>
        </div>

        {/* one calm escalation line, red only where 112 is */}
        <Reveal>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-[22px] p-5 sm:flex-row" style={{ background: '#A83A24', color: '#fff' }}>
            <span className="flex items-center gap-3 text-[16px] font-semibold">
              <span className="grid h-9 w-12 shrink-0 place-items-center rounded-xl bofs-num text-[15px] font-bold" style={{ background: 'rgba(255,255,255,.16)' }}>
                112
              </span>
              {pick(REPORT.emergency)}
            </span>
            <a href="tel:112" className="bofs-focus bofs-press shrink-0 rounded-full px-5 py-2.5 text-[14px] font-bold" style={{ background: '#fff', color: '#A83A24' }}>
              {pick(REPORT.ctaSecondary)}
            </a>
          </div>
        </Reveal>

        {/* two real audiences: everyone, and professionals */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {REPORT.lanes.map((lane, li) => (
            <Reveal key={lane.key} delay={li * 0.08}>
              <div className="flex h-full flex-col rounded-[26px] p-7" style={{ background: li === 0 ? C.cream : C.cream2, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <h3 className="bofs-display bofs-display-sm text-[21px]">{pick(lane.title)}</h3>
                <ul className="mt-4 space-y-3">
                  {lane.rows.map((r, ri) => (
                    <li key={ri} className="flex gap-3 text-[15.5px] leading-relaxed" style={{ color: C.cocoa }}>
                      <span className="bofs-num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12.5px] font-bold" style={{ background: '#fff', color: C.clay, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                        {ri + 1}
                      </span>
                      <span>{pick(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the legal centrepiece, set as the band's one pull-quote */}
        <Reveal delay={0.05}>
          <figure className="relative mx-auto mt-10 max-w-3xl rounded-[26px] p-8" style={{ background: C.cream, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <span className="bofs-display absolute -top-3 left-7 text-[52px] leading-none" style={{ color: C.clay, opacity: 0.45 }}>
              &ldquo;
            </span>
            <blockquote className="bofs-statement pt-4">{pick(REPORT.statute)}</blockquote>
            <figcaption className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: C.clayText }}>
              {pick(REPORT.statuteRef)}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-10 flex justify-center">
          <Button to="/preview/bofs/kerfid" icon={<Arrow />}>
            {pick(REPORT.ctaPrimary)}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ── About teaser + history stones ────────────────────────────────────── */

export function AboutTeaser() {
  const [, , pick] = useLang()
  const stones = [TIMELINE.items[0], TIMELINE.items[4], TIMELINE.items[5]].filter(Boolean) as Milestone[]
  return (
    <section id="um" className="scroll-mt-24" style={{ background: C.oat }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Eyebrow>{pick(ABOUT_TEASER.eyebrow)}</Eyebrow>
            <h2 className="bofs-display bofs-balance mt-3 text-[clamp(26px,4.4vw,42px)]">{pick(ABOUT_TEASER.title)}</h2>
            <p className="bofs-pretty mt-4 max-w-lg text-[17px] leading-relaxed" style={{ color: C.body }}>
              {pick(ABOUT_TEASER.body)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/preview/bofs/um-stofnunina" icon={<Arrow />}>
                {pick(ABOUT_TEASER.cta)}
              </Button>
              <Button to="/preview/bofs/um-stofnunina#saga" variant="ghost">
                {pick(ABOUT_TEASER.timelineCta)}
              </Button>
            </div>
          </div>

          {/* three history stones on a static dashed line */}
          <Reveal delay={0.08}>
            <div className="relative">
              <div className="pointer-events-none absolute left-6 right-6 top-9 hidden sm:block" style={{ borderTop: `2px dashed ${C.line}` }} />
              <div className="grid grid-cols-3 gap-3">
                {stones.map((m, i) => (
                  <Link
                    key={m.year}
                    to="/preview/bofs/um-stofnunina#saga"
                    className="bofs-focus bofs-lift relative flex flex-col items-center rounded-[20px] px-3 py-5 text-center"
                    style={{ background: 'rgba(255,255,255,.72)', boxShadow: `inset 0 0 0 1px ${C.line}` }}
                  >
                    <span className="bofs-display text-[clamp(22px,3.4vw,30px)]" style={{ color: C.clay }}>
                      {m.year}
                    </span>
                    <span className="mt-1 text-[12.5px] font-semibold leading-tight" style={{ color: C.body }}>
                      {pick(m.title)}
                    </span>
                    {i === 2 && (
                      <span className="mt-2 h-2 w-2 rounded-full" style={{ background: C.sun }} />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Full history timeline (about page) ───────────────────────────────── */

export function Timeline() {
  const [, , pick] = useLang()
  return (
    <div className="relative mx-auto max-w-3xl pl-4">
      <div className="pointer-events-none absolute bottom-2 left-[27px] top-3 w-0 border-l-2 border-dashed" style={{ borderColor: C.line }} />
      <div className="space-y-8">
        {TIMELINE.items.map((m, i) => (
          <Reveal key={m.year} delay={Math.min(i, 4) * 0.05} y={18}>
            <div className="relative flex gap-5">
              <span className="bofs-display relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full text-[14px]" style={{ background: '#fff', color: C.clay, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                {m.year}
              </span>
              <div className="pb-1 pt-1.5">
                <h3 className="bofs-display bofs-display-sm text-[21px]">{pick(m.title)}</h3>
                <p className="mt-1.5 max-w-prose text-[15.5px] leading-relaxed" style={{ color: C.body }}>
                  {pick(m.body)}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── FAQ accordion (grid-rows technique, JSON-LD) ─────────────────────── */

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: C.line }}>
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="bofs-focus flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="bofs-display bofs-display-sm text-[18px] leading-snug" style={{ color: C.cocoa }}>
            {q}
          </span>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <span className="relative block h-3.5 w-3.5">
              <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded" style={{ background: C.clay, transform: open ? 'scaleY(0)' : 'scaleY(1)', transition: 'transform .24s cubic-bezier(.32,.72,0,1)' }} />
              <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded" style={{ background: C.clay }} />
            </span>
          </span>
        </button>
      </h3>
      <div className="bofs-faq grid" style={{ gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .26s cubic-bezier(.32,.72,0,1)' }}>
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-[15.5px] leading-relaxed" style={{ color: C.body }}>
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
    mainEntity: FAQ.items.map((f) => ({
      '@type': 'Question',
      name: f.q.is,
      acceptedAnswer: { '@type': 'Answer', text: f.a.is },
    })),
  }
  return (
    <section id="spurningar" className="scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="bofs-hand text-[24px]" style={{ color: C.clayText }}>
            {pick(FAQ.hand)}
          </span>
          <div className="mt-1">
            <Eyebrow>{pick(FAQ.eyebrow)}</Eyebrow>
          </div>
          <h2 className="bofs-display bofs-balance mt-3 text-[clamp(28px,5vw,44px)]">{pick(FAQ.title)}</h2>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          {FAQ.items.map((f, i) => (
            <FaqItem key={i} q={pick(f.q)} a={pick(f.a)} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}

/* ── Foster recruitment: the open-door photographic invitation ────────── */

export function FosterBand() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const service = SERVICES.find((s) => s.slug === 'fostur')
  return (
    <section id="fostur-kall" className="scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden bofs-arch" style={{ boxShadow: '0 34px 66px -46px rgba(58,44,34,.55)' }}>
              <motion.div
                initial={reduce ? undefined : { scale: 1.06 }}
                whileInView={reduce ? undefined : { scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
              >
                <Img
                  src={asset('land-coast.jpg')}
                  alt={pick({ is: 'Sveitabær við fjörð, umvafinn fjöllum', en: 'A farmstead by a fjord, embraced by mountains' })}
                  className="bofs-photo h-[320px] w-full object-cover lg:h-[440px]"
                  fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
                />
              </motion.div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <span className="bofs-hand text-[26px]" style={{ color: C.clayText }}>
                {pick({ is: 'það er pláss', en: 'there is room' })}
              </span>
              <h2 className="bofs-display bofs-balance mt-1 text-[clamp(28px,4.5vw,44px)]">
                {pick({ is: 'Börn á Íslandi þarfnast fósturfjölskyldna', en: 'Children in Iceland need foster families' })}
              </h2>
              <p className="bofs-pretty mt-4 max-w-lg text-[17px] leading-relaxed" style={{ color: C.body }}>
                {service && pick(service.card)}{' '}
                {pick({ is: 'Fósturforeldrar fara í gegnum hæfnismat og námskeið og fá stuðning alla leið.', en: 'Foster parents go through an assessment and training and are supported the whole way.' })}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/preview/bofs/fostur#gerast" icon={<Arrow />}>
                  {pick({ is: 'Sjá hvernig maður byrjar', en: 'See how to begin' })}
                </Button>
                <Button href={`tel:${ORG.phone.replace(/\s/g, '')}`} variant="ghost">
                  {ORG.phone}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Related institutions + closing CTA (one band, closes the loop) ───── */

export function InstitutionsAndClose() {
  const [, , pick] = useLang()
  return (
    <section id="stofnanir" className="scroll-mt-24" style={{ background: C.oat }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{pick(INSTITUTIONS.eyebrow)}</Eyebrow>
          <h2 className="bofs-display bofs-balance mt-3 text-[clamp(24px,4vw,38px)]">{pick(INSTITUTIONS.title)}</h2>
        </div>
        <ul className="mx-auto mt-10 max-w-3xl divide-y" style={{ borderColor: C.line }}>
          {INSTITUTIONS.items.map((it) => (
            <li key={it.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6" style={{ borderColor: C.line }}>
              {it.href ? (
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bofs-focus rounded text-[15.5px] font-semibold transition-opacity hover:opacity-70"
                  style={{ color: C.cocoa }}
                >
                  {it.name}
                  <span className="sr-only"> {pick({ is: '(opnast á nýjum vef)', en: '(opens in a new tab)' })}</span>
                </a>
              ) : (
                <span className="text-[15.5px] font-semibold" style={{ color: C.cocoa }}>
                  {it.name}
                </span>
              )}
              <span className="text-[14px] sm:max-w-[52%] sm:text-right" style={{ color: C.body }}>
                {pick(it.role)}
              </span>
            </li>
          ))}
        </ul>

        {/* closing CTA folded into the same band */}
        <div className="mx-auto mt-16 max-w-2xl border-t pt-14 text-center" style={{ borderColor: C.line }}>
          <span className="bofs-hand text-[28px]" style={{ color: C.clayText }}>
            {pick(CLOSING.hand)}
          </span>
          <h2 className="bofs-display bofs-balance mt-1 text-[clamp(26px,4.6vw,42px)]">{pick(CLOSING.title)}</h2>
          <p className="bofs-pretty mx-auto mt-4 max-w-xl text-[17px] leading-relaxed" style={{ color: C.body }}>
            {pick(CLOSING.lead)}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/preview/bofs/kerfid" icon={<Arrow />}>
              {pick(CLOSING.ctaPrimary)}
            </Button>
            <a href="#heimili" className="bofs-focus rounded-full px-6 py-3 text-[15px] font-semibold" style={{ color: C.clayText, boxShadow: `inset 0 0 0 1.5px ${C.line}` }}>
              {pick(CLOSING.ctaSecondary)}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Dusk bookend: the day of light resolves into night before the footer ─ */

export function DuskBookend() {
  const [, , pick] = useLang()
  return (
    <section className="relative overflow-hidden" style={{ background: C.deep }}>
      <ArchNotchDivider color={C.deep} className="block h-10 w-full" flip />
      <ValleyScene palette="dusk" className="absolute inset-x-0 bottom-0 h-[78%] w-full" />
      <div className="relative mx-auto max-w-4xl px-5 pb-40 pt-20 text-center sm:px-8">
        <span className="bofs-hand text-[28px]" style={{ color: C.sun }}>
          {pick({ is: 'ljósin loga alltaf', en: 'the lights stay on' })}
        </span>
        <p className="bofs-display bofs-balance mx-auto mt-2 max-w-2xl text-[clamp(22px,3.4vw,34px)]" style={{ color: C.deepText }}>
          {pick({ is: 'Hvað sem á dynur, þá logar alltaf ljós í einhverjum glugga.', en: 'Whatever the day brings, a light always stays on in some window.' })}
        </p>
      </div>
    </section>
  )
}

/* ── Journey strip: where a service sits in the whole process (Centre) ── */

export function JourneyStrip({ serviceName, hue }: { serviceName: string; hue: string }) {
  const [, , pick] = useLang()
  const nodes = [
    { label: pick({ is: 'Áhyggjur og tilkynning', en: 'Worry and report' }), to: '/preview/bofs#tilkynna', current: false },
    { label: pick({ is: 'Mat barnaverndar', en: 'Child protection assesses' }), to: '/preview/bofs/kerfid', current: false },
    { label: serviceName, to: null, current: true },
    { label: pick({ is: 'Eftirfylgd og heimferð', en: 'Follow-up and home' }), to: '/preview/bofs/kerfid', current: false },
  ]
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
      <span className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: C.body }}>
        {pick(UI.wherePath)}
      </span>
      <div className="no-scrollbar mt-4 flex items-center gap-0 overflow-x-auto pb-1">
        {nodes.map((n, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {n.to ? (
              <Link to={n.to} className="bofs-focus flex items-center gap-2 rounded-full py-1 pr-1">
                <span className="h-3 w-3 rounded-full" style={{ background: C.line }} />
                <span className="text-[13.5px] font-semibold" style={{ color: C.body }}>
                  {n.label}
                </span>
              </Link>
            ) : (
              <span className="flex items-center gap-2" aria-current="step">
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: hue }} />
                <span className="text-[13.5px] font-bold" style={{ color: C.cocoa }}>
                  {n.label}
                </span>
              </span>
            )}
            {i < nodes.length - 1 && <span className="mx-2 block h-0 w-8 shrink-0 border-t-2 border-dashed sm:w-12" style={{ borderColor: C.line }} />}
          </div>
        ))}
        <Link to="/preview/bofs/kerfid" className="bofs-focus ml-4 hidden shrink-0 text-[14px] font-bold lg:inline" style={{ color: C.clayText }}>
          {pick(UI.readSystem)}
        </Link>
      </div>
    </div>
  )
}

/* ── Foster steps (fostur page only) ──────────────────────────────────── */

export function FosterSteps() {
  const [, , pick] = useLang()
  return (
    <section id="gerast" className="scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <SectionHead eyebrow={pick(FOSTER_STEPS.eyebrow)} title={pick({ is: 'Þrjú skref að því að opna heimilið', en: 'Three steps to opening your home' })} lead={pick(FOSTER_STEPS.lead)} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FOSTER_STEPS.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-[26px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <span className="bofs-display grid h-14 w-14 place-items-center rounded-2xl text-[24px] text-white" style={{ background: [C.terra, C.sage, C.sun][i] }}>
                  {step.n}
                </span>
                <h3 className="bofs-display bofs-display-sm mt-5 text-[20px]">{pick(step.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.body }}>
                  {pick(step.body)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button href={`mailto:${ORG.email}`} icon={<Arrow />}>
            {pick(FOSTER_STEPS.cta)}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ── Help lines (shared by landing + kerfid) ──────────────────────────── */

export function HelpBand() {
  const [, , pick] = useLang()
  return (
    <section id="help" className="scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHead eyebrow={pick({ is: 'Alltaf einhver', en: 'Always someone' })} title={pick(HELP.title)} lead={pick(HELP.lead)} align="center" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {HELP.lines.map((line, i) => {
            const emphasis = i === 0
            return (
              <Reveal key={line.value} delay={(i % 2) * 0.08}>
                <a
                  href={`tel:${line.value.replace(/\s/g, '')}`}
                  className="bofs-focus bofs-lift flex items-center gap-4 rounded-[24px] p-5"
                  style={{
                    background: emphasis ? '#A83A24' : '#fff',
                    color: emphasis ? '#fff' : C.cocoa,
                    boxShadow: emphasis ? '0 20px 40px -24px rgba(168,58,36,.9)' : `inset 0 0 0 1px ${C.line}`,
                  }}
                >
                  <span
                    className="bofs-display bofs-num grid h-16 shrink-0 place-items-center whitespace-nowrap rounded-2xl px-2.5"
                    style={{
                      minWidth: 64,
                      fontSize: line.value.length > 6 ? 16 : line.value.length > 3 ? 20 : 24,
                      background: emphasis ? 'rgba(255,255,255,.15)' : C.cream2,
                      color: emphasis ? '#fff' : C.clay,
                    }}
                  >
                    {line.value}
                  </span>
                  <span>
                    <span className="block text-[17px] font-bold">{pick(line.label)}</span>
                    <span className="block text-[14px]" style={{ color: emphasis ? 'rgba(255,255,255,.85)' : C.body }}>
                      {pick(line.blurb)}
                    </span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
