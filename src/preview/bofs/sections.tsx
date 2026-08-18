/**
 * Öruggt skjól — composed sections shared by the landing and the two long
 * reference pages. Everything here obeys the page performance contract:
 * native scroll only, transform/opacity choreography, no infinite animation
 * inside a large SVG, reduced-motion renders plainly, AA contrast throughout.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { AUDIENCES, SPURDU, hashFor, suggestionsFor, type Audience } from './spurdu-data'
import { Reveal } from '../../components/Reveal'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { asset, Arrow, BofsStyles, Button, C, Eyebrow, Footer, Handwritten, Header, SectionHead, StatCountUp, useLang } from './ui'
import {
  ABOUT_TEASER,
  CLOSING,
  FAQ,
  FOSTER_STEPS,
  HELP,
  INSTITUTIONS,
  type Milestone,
  NEWS,
  type NewsItem,
  NEWS_SOURCES,
  NOTFOUND,
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
    <section className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 text-center">
          <Eyebrow>{pick(WAYFINDER.hand)}</Eyebrow>
          <h2 className="bofs-display bofs-balance mt-3 text-[clamp(26px,4vw,40px)]">{pick(WAYFINDER.title)}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {WAYFINDER.doors.map((d, i) => {
            const hue = HUE[d.hueKey] ?? C.clay
            const inner = (
              <>
                {/* quiet hue keel instead of a cartoon roof */}
                <span className="block h-1 w-full rounded-t-[18px]" style={{ background: hue }} />
                <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
                  <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
                    <path d="M6 16 L17 7 L28 16" fill="none" stroke={hue} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 15 V25 a3 3 0 0 0 3 3 H22 a3 3 0 0 0 3 -3 V15" fill="none" stroke={hue} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="14.5" y="18.5" width="5" height="5" rx="1.2" fill="#FFE6AE" stroke={hue} strokeWidth="1.2" />
                  </svg>
                  <h3 className="bofs-display bofs-display-sm bofs-balance mt-4 text-[20px]">{pick(d.title)}</h3>
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
            const cls = 'bofs-focus bofs-lift group flex h-full flex-col overflow-hidden rounded-[18px]'
            const style = { background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }
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
    <section id="tolur" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHead eyebrow={pick(STATS.eyebrow)} title={pick(STATS.title)} lead={pick(STATS.lead)} align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={i} delay={(i % 4) * 0.07}>
              <div className="flex h-full flex-col rounded-[20px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <StatCountUp value={s.value} format={s.format} className="bofs-display bofs-display-xl text-[clamp(40px,5vw,60px)]" style={{ color: C.clay, lineHeight: 1 }} />
                <span className="mt-3 text-[15px] font-medium leading-snug" style={{ color: C.body }}>
                  {pick(s.label)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px]" style={{ color: C.body }}>
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
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-[18px] p-5 sm:flex-row" style={{ background: '#A83A24', color: '#fff' }}>
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
              <div className="flex h-full flex-col rounded-[20px] p-7" style={{ background: li === 0 ? C.cream : C.cream2, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
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
          <figure className="relative mx-auto mt-10 max-w-3xl rounded-[20px] p-8" style={{ background: C.cream, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
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
    <section id="um" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.oat }}>
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
              <div className="bofs-rule pointer-events-none absolute left-6 right-6 top-9 hidden sm:block" />
              <div className="grid grid-cols-3 gap-3">
                {stones.map((m, i) => (
                  <Link
                    key={m.year}
                    to="/preview/bofs/um-stofnunina#saga"
                    className="bofs-focus bofs-lift relative flex flex-col items-center rounded-[16px] px-3 py-5 text-center"
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
    <section id="spurningar" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{pick(FAQ.eyebrow)}</Eyebrow>
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
    <section id="fostur-kall" className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            {/*
              Wet edge rather than the arch doorway crop: this painting now
              contains its own lit doorway, so cropping it into a second one
              doubled the metaphor and clipped the light. Cast shadow gone
              with it, since a painting does not float above the paper.
            */}
            <div className="bofs-wet overflow-hidden">
              <motion.div
                initial={reduce ? undefined : { scale: 1.06 }}
                whileInView={reduce ? undefined : { scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
              >
                <Img
                  src={asset('art-plass.jpg')}
                  /* 1800px plate for a 350px box on a phone. */
                  srcSet={`${asset('art-plass-1000.jpg')} 1000w, ${asset('art-plass.jpg')} 1800w`}
                  sizes="(min-width: 1024px) 1152px, 100vw"
                  alt={pick({
                    is: 'Vatnslitamynd: eldhús að kvöldi, borðið lagt, auður stóll með teppi og opnar dyr fram í upplýstan gang',
                    en: 'Watercolor: a kitchen in the evening, the table laid, an empty chair with a blanket, and an open door onto a lit hallway',
                  })}
                  className="h-[320px] w-full object-cover lg:h-[440px]"
                  fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
                />
              </motion.div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <Eyebrow>{pick({ is: 'Það er pláss', en: 'There is room' })}</Eyebrow>
              <h2 className="bofs-display bofs-balance mt-3 text-[clamp(28px,4.5vw,44px)]">
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
    <section id="stofnanir" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.oat }}>
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
                  className="bofs-focus inline-block rounded py-1 text-[15.5px] font-semibold transition-opacity hover:opacity-70"
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
          <Eyebrow>{pick(CLOSING.hand)}</Eyebrow>
          <h2 className="bofs-display bofs-balance mt-3 text-[clamp(26px,4.6vw,42px)]">{pick(CLOSING.title)}</h2>
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
    <section className="bofs-wash bofs-bloom relative overflow-hidden" style={{ background: C.deep }}>
      {/* the same painted valley at dusk; darkening veil settles into the footer */}
      <Img
        src={asset('art-dusk.jpg')}
        /* Decorative and sitting under a dark gradient veil, so the smaller
           plate on phones is invisible; it saves 8MB of decoded memory. */
        srcSet={`${asset('art-dusk-1600.jpg')} 1600w, ${asset('art-dusk.jpg')} 2560w`}
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
        fallbackClassName="bg-gradient-to-b from-[#55402E] to-[#4A3123]"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(rgba(58,44,34,.34), rgba(58,44,34,.55) 62%, ${C.deep} 98%)` }} />
      <div className="relative mx-auto max-w-4xl px-5 pb-44 pt-28 text-center sm:px-8">
        <Handwritten className="text-[28px]" style={{ color: C.sun }}>
          {pick({ is: 'ljósin loga alltaf', en: 'the lights stay on' })}
        </Handwritten>
        <p className="bofs-display bofs-balance mx-auto mt-2 max-w-2xl text-[clamp(22px,3.4vw,34px)]" style={{ color: '#FDF3E3', textShadow: '0 1px 24px rgba(40,28,18,.45)' }}>
          {pick({ is: 'Hvað sem á dynur, þá logar alltaf ljós í einhverjum glugga.', en: 'Whatever the day brings, a light always stays on in some window.' })}
        </p>
      </div>
    </section>
  )
}

/* ── News: real source-linked items ───────────────────────────────────── */

/*
 * Source-label colours, darkened to clear WCAG AA at 12.5px on white.
 * The display hues (C.sky 3.97:1, C.sage 3.98:1, C.terra 3.20:1) all failed;
 * these measured variants sit between 5.2:1 and 5.9:1.
 */
const SOURCE_HUE: Record<string, string> = {
  BOFS: C.clay,
  GEV: '#3D6B87',
  'Stjórnarráðið': '#4A6E4A',
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
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase" style={{ color: SOURCE_HUE[source] ?? C.body, letterSpacing: '0.12em' }}>
      {source}
      <span className="sr-only">{pick({ is: '(opnast á vef útgefandans)', en: '(opens on the publisher’s site)' })}</span>
    </span>
  )
}

/*
 * The news surfaces carry NO imagery, deliberately.
 *
 * The obvious move is to show each publisher's own picture beside its
 * headline. We built that, then looked at what island.is actually publishes:
 * most BOFS news images are generic clip art, pie charts and bar charts on
 * white. Next to a watercolour identity they read as cheap stock, and they
 * pull the eye away from the one thing that matters on a news list, which is
 * what happened. Watercolours in their place were worse: a painting beside a
 * report about placement figures implies it depicts that story, and it does
 * not.
 *
 * So the list is typographic. Date, publisher, headline, and the agency's own
 * summary where there is one. It also means the news content pulls nothing
 * from a third-party host, which keeps a content security policy simple.
 *
 * Note that the page as a whole is not yet third-party free: the shared
 * index.html of this repo still requests fonts.googleapis.com,
 * fonts.gstatic.com and api.fontshare.com for the other previews, even
 * though BOFS self-hosts its own faces. On a real government site that is
 * worth closing, and not only for speed.
 */

/**
 * The lead story. Card is an <article>; the link wraps only the headline and
 * is stretched over the whole card with an ::after, so the accessible link
 * name stays the headline alone rather than headline plus summary plus
 * figures. Heading level is caller-controlled to keep each page's outline
 * correct: h2 under the page h1 on /frettir, h3 under the band h2 on the
 * landing page.
 */
export function NewsFeature({ item, as: H = 'h2' }: { item: NewsItem; as?: 'h2' | 'h3' }) {
  const [, , pick] = useLang()
  return (
    <article
      className="group relative overflow-hidden rounded-[22px]"
      style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
    >
      {/* A brushstroke keel instead of a banner image: the lead still reads
          as the lead without pretending a picture belongs to the story. */}
      <span className="bofs-rule absolute inset-x-0 top-0 bofs-rule-clay" aria-hidden="true" />
      <div className="p-6 sm:p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-[9px] px-2.5 py-1 text-[11.5px] font-bold uppercase" style={{ background: C.clay, color: '#fff', letterSpacing: '0.1em' }}>
            {pick(NEWS.featuredLabel)}
          </span>
          <span className="bofs-num text-[13.5px] font-medium" style={{ color: C.body }}>
            {item.date}
          </span>
          <SourceMark source={item.source} />
        </div>

        <H className="bofs-display bofs-balance mt-4 text-[clamp(21px,2.6vw,29px)] leading-[1.16]">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bofs-focus rounded after:absolute after:inset-0 after:content-['']"
            style={{ color: C.cocoa }}
          >
            {pick(item.title)}
          </a>
        </H>

        {item.summary && (
          <p className="bofs-pretty mt-4 text-[16px] leading-relaxed" style={{ color: C.body }}>
            {pick(item.summary)}
          </p>
        )}

        {item.stats && (
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {item.stats.map((s) => (
              <div key={s.value}>
                <dt className="bofs-display text-[26px] leading-none" style={{ color: C.clay }}>
                  {s.value}
                </dt>
                <dd className="mt-1.5 max-w-[168px] text-[13px] leading-snug" style={{ color: C.body }}>
                  {pick(s.label)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-bold" style={{ color: C.clayText }}>
          {pick(NEWS.readMore)}
          <Arrow className="-rotate-45 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  )
}

/**
 * One row: date and publisher on a meta line, then the headline, then the
 * summary. The summary sits outside the link so the accessible link name
 * stays the headline alone rather than headline plus paragraph, while the
 * anchor's stretched ::after keeps the whole row clickable.
 */
export function NewsRow({ item }: { item: NewsItem }) {
  const [, , pick] = useLang()
  return (
    <li style={{ borderColor: C.line }}>
      <div className="group relative py-5">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="bofs-num text-[13px] font-medium" style={{ color: C.body }}>
            {item.date}
          </span>
          <SourceMark source={item.source} />
        </div>

        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bofs-focus rounded text-[16.5px] font-semibold leading-snug after:absolute after:inset-0 after:content-['']"
          style={{ color: C.cocoa }}
        >
          {pick(item.title)}
          <Arrow className="ml-1.5 inline-block -rotate-45 align-[-2px] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        {item.summary && (
          <p className="bofs-pretty mt-2 max-w-[68ch] text-[14.5px] leading-relaxed" style={{ color: C.body }}>
            {pick(item.summary)}
          </p>
        )}
      </div>
    </li>
  )
}

/** A flat list, used on the landing band. */
export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <ul className="divide-y" style={{ borderColor: C.line }}>
      {items.map((n) => (
        <NewsRow key={n.href} item={n} />
      ))}
    </ul>
  )
}

/** Grouped by month, used on the news page archive. */
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
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.key} aria-label={pick(g.label)}>
          <div className="mb-1 flex items-center gap-4">
            <span className="text-[12.5px] font-bold uppercase" style={{ color: C.clayText, letterSpacing: '0.14em' }}>
              {pick(g.label)}
            </span>
            <hr className="bofs-rule flex-1" aria-hidden="true" />
          </div>
          <ul className="divide-y" style={{ borderColor: C.line }}>
            {g.items.map((n) => (
              <NewsRow key={n.href} item={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** Where the items come from, said plainly rather than left to be guessed. */
export function NewsSources() {
  const [, , pick] = useLang()
  return (
    <div className="rounded-[18px] p-6 sm:p-7" style={{ background: C.cream2, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <h2 className="bofs-display text-[19px]">{pick(NEWS.sourcesTitle)}</h2>
      <dl className="mt-4 space-y-2.5">
        {NEWS_SOURCES.map((s) => (
          <div key={s.id} className="flex flex-wrap items-baseline gap-x-3">
            <dt className="w-[112px] shrink-0 text-[12.5px] font-bold uppercase" style={{ color: SOURCE_HUE[s.id] ?? C.body, letterSpacing: '0.12em' }}>
              {s.id}
            </dt>
            <dd className="flex-1 text-[14.5px] leading-snug" style={{ color: C.body }}>
              {pick(s.label)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="bofs-pretty mt-5 text-[14px] leading-relaxed" style={{ color: C.body }}>
        {pick(NEWS.sourcesNote)}
      </p>
    </div>
  )
}

export function NewsBand() {
  const [, , pick] = useLang()
  const featured = NEWS.items.find((n) => n.featured) ?? NEWS.items[0]
  const rest = NEWS.items.filter((n) => n !== featured).slice(0, 3)
  return (
    <section id="frettir" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{pick(NEWS.eyebrow)}</Eyebrow>
            <h2 className="bofs-display bofs-balance mt-3 text-[clamp(26px,4.4vw,42px)]">{pick(NEWS.title)}</h2>
            <p className="bofs-pretty mt-4 max-w-lg text-[16.5px] leading-relaxed" style={{ color: C.body }}>
              {pick(NEWS.lead)}
            </p>
            <p className="mt-3 text-[13px]" style={{ color: C.body }}>
              {pick(NEWS.updated)}
            </p>
          </div>
          <Button to="/preview/bofs/frettir" icon={<Arrow />}>
            {pick(NEWS.cta)}
          </Button>
        </div>

        <Reveal delay={0.06}>
          <div className="mt-10">
            <NewsFeature item={featured} as="h3" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 rounded-[20px] px-6 py-1" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <NewsList items={rest} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Not found: a wrong turn, handled warmly ──────────────────────────── */

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
        <section className="bofs-wash relative isolate flex min-h-[86svh] flex-col justify-center overflow-hidden" style={{ background: C.cream }}>
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Img
              src={asset('art-dawn.jpg')}
              alt=""
              aria-hidden
              /* Same measured mobile crop as the landing hero: at 62% the lit
                 house falls off the right edge on a portrait phone. */
              className="h-full w-full object-cover object-[84%_58%] md:object-[62%_60%]"
              fallbackClassName="bg-gradient-to-b from-[#F8EAD8] to-[#CFD7C4]"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(251,243,231,.96) 0%, rgba(251,243,231,.9) 40%, rgba(251,243,231,.55) 70%, rgba(251,243,231,.3) 100%)' }} />
          </div>

          <div className="mx-auto w-full max-w-3xl px-5 pb-32 pt-32 sm:px-8">
            <Reveal y={14}>
              <Handwritten className="text-[26px] leading-none" style={{ color: C.clayText }}>
                {pick(NOTFOUND.hand)}
              </Handwritten>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-2 text-[clamp(34px,6.5vw,60px)]">{pick(NOTFOUND.title)}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="bofs-pretty mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: C.body }}>
                {pick(NOTFOUND.lead)}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {NOTFOUND.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="bofs-focus bofs-lift group flex items-center justify-between gap-3 rounded-[16px] px-5 py-4 text-[15.5px] font-semibold"
                      style={{ background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }}
                    >
                      {pick(l.label)}
                      <Arrow className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button to="/preview/bofs" variant="soft" icon={<Arrow className="rotate-180" />}>
                  {pick(NOTFOUND.home)}
                </Button>
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: C.body }}>
                  <span className="bofs-num grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: '#A83A24' }}>
                    112
                  </span>
                  {pick(NOTFOUND.reassure)}
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
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
            {i < nodes.length - 1 && <span className="bofs-rule mx-2 w-8 shrink-0 sm:w-12" />}
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
    <section id="gerast" className="bofs-wash bofs-bloom scroll-mt-24" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <SectionHead eyebrow={pick(FOSTER_STEPS.eyebrow)} title={pick({ is: 'Þrjú skref að því að opna heimilið', en: 'Three steps to opening your home' })} lead={pick(FOSTER_STEPS.lead)} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FOSTER_STEPS.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-[20px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
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
    <section id="help" className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHead eyebrow={pick({ is: 'Alltaf einhver', en: 'Always someone' })} title={pick(HELP.title)} lead={pick(HELP.lead)} align="center" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {HELP.lines.map((line, i) => {
            const emphasis = i === 0
            return (
              <Reveal key={line.value} delay={(i % 2) * 0.08}>
                <a
                  href={`tel:${line.value.replace(/\s/g, '')}`}
                  className="bofs-focus bofs-lift flex items-center gap-4 rounded-[18px] p-5"
                  style={{
                    background: emphasis ? '#A83A24' : '#fff',
                    color: emphasis ? '#fff' : C.cocoa,
                    boxShadow: emphasis ? 'inset 0 0 0 1.5px rgba(168,58,36,.55)' : `inset 0 0 0 1px ${C.line}`,
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

/* ── Question index, shared by the landing and every service page ─────── */

/*
 * REPLACES an earlier version of this block that was a text input with a
 * "find answer" button. That was wrong twice over. It wore the exact costume
 * of the thing this whole concept argues against, a chatbot prompt, so the
 * site undercut its own strongest claim in its own first screen. And a bare
 * "ask us anything" box on a child protection landing page invites someone to
 * type a disclosure into it, which is precisely what /spurdu is built to
 * prevent.
 *
 * So there is no input here at all. These are the real questions, already
 * written, as links. Recognition instead of recall: a frightened person does
 * not arrive with a sentence ready, they arrive with a situation, and seeing
 * their own worry written down by somebody else is the thing that helps. It
 * also tells the truth about the system, which knows a finite set of answers
 * and should therefore show them rather than pretend to accept anything.
 */
export function QuestionIndex({ compact = false }: { compact?: boolean }) {
  const [, , pick] = useLang()
  /* Parents are the broadest audience arriving cold, so they are the default
     view; the chips are a filter, not a gate. */
  const [aud, setAud] = useState<Audience>('foreldri')
  const items = suggestionsFor(aud).slice(0, compact ? 4 : 6)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>{pick(SPURDU.indexEyebrow)}</Eyebrow>
          <h2
            className={`bofs-display bofs-balance mt-2 ${compact ? 'text-[clamp(20px,2.4vw,26px)]' : 'text-[clamp(26px,3.6vw,38px)]'}`}
          >
            {pick(compact ? SPURDU.indexTitleCompact : SPURDU.indexTitle)}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={pick(SPURDU.indexFilter)}>
          {AUDIENCES.map((a) => {
            const on = aud === a.id
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={() => setAud(a.id)}
                className="bofs-focus rounded-[12px] px-3.5 py-2 text-[13.5px] font-bold transition-colors duration-150"
                style={
                  on
                    ? { background: C.cocoa, color: C.cream }
                    : { background: '#fff', color: C.body, boxShadow: `inset 0 0 0 1px ${C.line}` }
                }
              >
                {pick(a.short)}
              </button>
            )
          })}
        </div>
      </div>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {items.map(({ group, variant }) => (
          <li key={group.id}>
            <Link
              to={`/preview/bofs/spurdu${hashFor(aud, group.id)}`}
              className="bofs-focus flex items-start gap-3 rounded-[16px] px-4 py-3.5 text-[15px] font-semibold leading-snug transition-colors duration-150"
              style={{ background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }}
            >
              <span className="flex-1">{pick(variant.q)}</span>
              <Arrow className="mt-1 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/preview/bofs/spurdu"
        className="bofs-focus mt-5 inline-flex items-center gap-2 rounded py-1 text-[15px] font-bold"
        style={{ color: C.clayText }}
      >
        {pick(SPURDU.indexAll)}
        <Arrow />
      </Link>
    </div>
  )
}

/** The landing placement: its own band, after the three doors. */
export function QuestionBand() {
  return (
    <section className="bofs-wash" style={{ background: C.cream2 }}>
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <QuestionIndex />
        </Reveal>
      </div>
    </section>
  )
}
