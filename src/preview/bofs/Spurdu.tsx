/**
 * Öruggt skjól — "Spurðu" (ask).
 *
 * The three-audience answer router. See spurdu-data.ts for why this is emphatically
 * not a chatbot; this file is only its face.
 *
 * Interaction, in full:
 *   1. Say who you are. Three choices, because the same question has three
 *      different true answers and pretending otherwise is how sites lie.
 *   2. Type the question however it comes out. Matching folds Icelandic to a
 *      plain skeleton, so accents, inflection and typos all still land.
 *   3. Read a pre-written, sourced answer, then flip the SAME question to
 *      another audience and watch the answer change. That flip is the whole
 *      argument of the page.
 *
 * The human channels are pinned on screen the entire time rather than sitting
 * at the bottom of a funnel, and anything that reads as danger jumps the queue
 * and hands over to 112 immediately.
 *
 * Quick exit lives here and only here, because this is the page where someone
 * is most likely to be reading on a device they share with the person they are
 * reading about.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { Arrow, BofsStyles, C, Eyebrow, Footer, Header, useLang } from './ui'
import { UI } from './data'
import {
  AUDIENCES,
  CHANNELS,
  GROUPS,
  SPURDU,
  hashFor,
  otherAudiences,
  parseHash,
  search,
  suggestionsFor,
  type Audience,
} from './spurdu-data'

/* Somewhere plain, public and boring. Nobody looking over a shoulder learns
   anything from a weather forecast. */
const EXIT_URL = 'https://www.vedur.is/'

export default function BofsSpurdu() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()

  const location = useLocation()

  /*
   * A question carried over from the ask field on the landing or on a service
   * page. It arrives in router state, never in the URL, so it never reaches
   * browser history or a server log.
   */
  const carried = ((location.state as { q?: string } | null)?.q ?? '').trim()

  /* A shared link, #<audience>/<id>. Read once, on arrival. */
  const deep = parseHash(location.hash)

  const [audience, setAudience] = useState<Audience | null>(deep?.audience ?? null)
  const [query, setQuery] = useState(carried)
  const [openId, setOpenId] = useState<string | null>(deep?.id ?? null)
  const [copied, setCopied] = useState(false)

  const answerRef = useRef<HTMLHeadingElement>(null)
  /* Focus belongs on a freshly opened answer, but never on the first paint
     and never while the visitor is still typing. */
  const shouldFocus = useRef(false)

  useEffect(() => {
    document.title = `${pick(SPURDU.title)} | Barna- og fjölskyldustofa`
    setThemeColor(C.cream)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hits = useMemo(() => {
    if (!audience) return []
    return query.trim() ? search(query, audience) : suggestionsFor(audience)
  }, [query, audience])

  const openGroup = openId ? GROUPS.find((g) => g.id === openId) ?? null : null
  const openVariant = openGroup && audience ? openGroup.variants[audience] ?? null : null

  useEffect(() => {
    if (openId && shouldFocus.current) {
      shouldFocus.current = false
      answerRef.current?.focus()
    }
  }, [openId, audience])

  /*
   * Apply the deep link whenever the hash changes, not only on first mount.
   * Two real cases need this: following a shared link while already on this
   * page changes only the hash, so React never remounts, and Back/Forward
   * between two shared answers is a same-document navigation as well.
   */
  useEffect(() => {
    const d = parseHash(location.hash)
    if (!d) return
    setAudience(d.audience)
    setOpenId(d.id)
    shouldFocus.current = true
  }, [location.hash])

  /*
   * Danger opens itself. When what someone typed reads as being in immediate
   * danger, the 112 answer is already on screen rather than one tap further
   * on. Focus is deliberately NOT moved: they are mid-sentence, and yanking
   * the caret out of the field they are still typing into would be worse than
   * the extra tap it saves.
   */
  const topId = hits[0]?.group.id
  const topIsEmergency = Boolean(hits[0]?.group.emergency)
  useEffect(() => {
    if (topIsEmergency && topId && openId !== topId) setOpenId(topId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topId, topIsEmergency])

  function chooseAudience(next: Audience) {
    setAudience(next)
    /* Keep the question open across the switch when the other audience has an
       answer to it. That continuity IS the demonstration. */
    if (openId) {
      const g = GROUPS.find((x) => x.id === openId)
      if (!g?.variants[next]) setOpenId(null)
      else shouldFocus.current = true
    }
  }

  function openAnswer(id: string) {
    shouldFocus.current = true
    setOpenId(id)
  }

  const searching = query.trim().length > 0

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── Masthead ──────────────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pb-8 pt-32 sm:px-8 sm:pt-36">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Reveal y={14}>
                <Link
                  to="/preview/bofs"
                  className="bofs-focus inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-bold"
                  style={{ background: '#fff', color: C.cocoa }}
                >
                  <Arrow className="rotate-180" />
                  {pick({ is: 'Forsíða', en: 'Home' })}
                </Link>
              </Reveal>

              {/* Quick exit. location.replace, so Back does not come here. */}
              <Reveal y={14} delay={0.04}>
                <button
                  type="button"
                  onClick={() => window.location.replace(EXIT_URL)}
                  className="bofs-focus inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors duration-150"
                  style={{ background: C.cocoa, color: C.cream }}
                >
                  <CloseGlyph />
                  {pick(SPURDU.exit)}
                </button>
              </Reveal>
            </div>

            <Reveal delay={0.06}>
              <Eyebrow>{pick(SPURDU.eyebrow)}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(34px,6vw,58px)]">
                {pick(SPURDU.title)}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="bofs-pretty mt-5 max-w-2xl text-[17px] leading-relaxed" style={{ color: C.body }}>
                {pick(SPURDU.lead)}
              </p>
              <p className="mt-2 text-[13px]" style={{ color: C.body }}>
                {pick(SPURDU.exitNote)}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Step 1: who is asking ─────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal delay={0.04}>
              <div className="border-t pt-8" style={{ borderColor: C.line }}>
                <h2 className="bofs-display text-[clamp(20px,2.4vw,26px)]">{pick(SPURDU.step1)}</h2>
                <p className="mt-2 text-[14.5px]" style={{ color: C.body }}>
                  {pick(SPURDU.step1Note)}
                </p>
                {carried && !audience && (
                  <p className="mt-3 rounded-[13px] px-4 py-2.5 text-[14px]" style={{ background: C.oat, color: C.cocoa }}>
                    <span className="font-bold">{pick(SPURDU.carried)}</span> {carried}
                  </p>
                )}

                <div
                  className="mt-5 grid gap-3 sm:grid-cols-3"
                  role="group"
                  aria-label={pick(SPURDU.step1)}
                >
                  {AUDIENCES.map((a) => {
                    const on = audience === a.id
                    return (
                      <button
                        key={a.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => chooseAudience(a.id)}
                        className="bofs-focus rounded-[18px] px-5 py-4 text-left transition-colors duration-150"
                        style={
                          on
                            ? { background: C.cocoa, color: C.cream }
                            : { background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }
                        }
                      >
                        <span className="block text-[15.5px] font-bold leading-snug">{pick(a.label)}</span>
                        <span
                          className="mt-1 block text-[13.5px] leading-snug"
                          style={{ color: on ? '#DCCCBA' : C.body }}
                        >
                          {pick(a.blurb)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Step 2: the question ──────────────────────────────────────── */}
        {audience && (
          <section style={{ background: C.cream }}>
            <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
              <h2 className="bofs-display text-[clamp(20px,2.4vw,26px)]">{pick(SPURDU.step2)}</h2>

              <div className="mt-4">
                <label htmlFor="spurdu-q" className="block text-[14px] font-bold" style={{ color: C.cocoa }}>
                  {pick(SPURDU.inputLabel)}
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    id="spurdu-q"
                    type="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && hits[0]) {
                        e.preventDefault()
                        openAnswer(hits[0].group.id)
                      }
                    }}
                    placeholder={pick(SPURDU.placeholder)}
                    className="bofs-focus min-w-0 flex-1 rounded-[14px] px-4 py-3 text-[16px]"
                    style={{ background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }}
                  />
                  {searching && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        setOpenId(null)
                      }}
                      className="bofs-focus rounded-[14px] px-4 py-3 text-[14px] font-bold"
                      style={{ background: C.oat, color: C.cocoa }}
                    >
                      {pick(SPURDU.clear)}
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[13px]" style={{ color: C.body }} aria-live="polite">
                  {searching
                    ? hits.length > 0
                      ? pick(SPURDU.results(hits.length))
                      : pick(SPURDU.noMatch)
                    : pick(SPURDU.common)}
                </p>
              </div>

              {/* Matches, or the standing common questions before anything is typed. */}
              {hits.length > 0 ? (
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {hits.map(({ group, variant }) => {
                    const on = openId === group.id
                    return (
                      <li key={group.id}>
                        <button
                          type="button"
                          onClick={() => openAnswer(group.id)}
                          className="bofs-focus flex w-full items-start gap-2.5 rounded-[15px] px-4 py-3 text-left text-[15px] font-semibold leading-snug transition-colors duration-150"
                          style={
                            on
                              ? { background: C.oat, color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }
                              : { background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }
                          }
                        >
                          {group.emergency && <UrgentGlyph />}
                          <span className="flex-1">{pick(variant.q)}</span>
                          <Arrow className="mt-1 shrink-0" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                searching && (
                  <div
                    className="mt-4 rounded-[18px] p-6"
                    style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
                  >
                    <p className="text-[15.5px] font-bold" style={{ color: C.cocoa }}>
                      {pick(SPURDU.noMatch)}
                    </p>
                    <p className="bofs-pretty mt-2 text-[14.5px] leading-relaxed" style={{ color: C.body }}>
                      {pick(SPURDU.noMatchBody)}
                    </p>
                  </div>
                )
              )}

              {/* ── The answer ────────────────────────────────────────── */}
              <AnimatePresence mode="wait" initial={false}>
                {openGroup && openVariant && (
                  <motion.div
                    key={`${openGroup.id}-${audience}`}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.32, ease: [0.21, 0.65, 0.36, 1] }}
                    className="relative mt-5 overflow-hidden rounded-[22px]"
                    style={{
                      background: '#fff',
                      boxShadow: `inset 0 0 0 1px ${openGroup.emergency ? C.clay : C.line}`,
                    }}
                  >
                    {/* A brushstroke keel, clay when the answer is an emergency. */}
                    <span
                      className={`bofs-rule absolute inset-x-0 top-0 ${openGroup.emergency ? 'bofs-rule-clay' : ''}`}
                      aria-hidden="true"
                    />
                    <div className="p-6 sm:p-8">
                      {/* scroll-mt clears the fixed header when focus lands here,
                          matching the offset every other anchor target uses. */}
                      <h3
                        ref={answerRef}
                        tabIndex={-1}
                        className="bofs-display bofs-balance scroll-mt-28 text-[clamp(21px,2.8vw,28px)] outline-none"
                      >
                        {pick(openVariant.q)}
                      </h3>

                      <p
                        className="bofs-pretty mt-4 max-w-[64ch] text-[16.5px] leading-relaxed"
                        style={{ color: C.body }}
                      >
                        {pick(openVariant.a)}
                      </p>

                      {openGroup.emergency && (
                        <a
                          href="tel:112"
                          className="bofs-focus mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[16px] font-bold"
                          style={{ background: C.clay, color: '#fff' }}
                        >
                          {pick({ is: 'Hringja í 112', en: 'Call 112' })}
                        </a>
                      )}

                      {openGroup.source && (
                        <p className="mt-5 text-[13px]" style={{ color: C.body }}>
                          {pick(SPURDU.sourceLabel)}:{' '}
                          <a
                            href={openGroup.source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bofs-focus rounded font-semibold underline"
                            style={{ color: C.clayText }}
                          >
                            {pick(openGroup.source.label)}
                          </a>
                        </p>
                      )}

                      {/*
                       * Share by topic id, and only when asked. Reading an
                       * answer never writes to the URL; this writes to the
                       * clipboard, not to the address bar.
                       */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={async () => {
                            const url = `${window.location.origin}${window.location.pathname}${hashFor(audience, openGroup.id)}`
                            try {
                              await navigator.clipboard.writeText(url)
                            } catch {
                              /* clipboard blocked: show the link so it can be copied by hand */
                              window.prompt(pick(SPURDU.copy), url)
                            }
                            setCopied(true)
                            window.setTimeout(() => setCopied(false), 2400)
                          }}
                          className="bofs-focus rounded-[12px] px-3.5 py-2 text-[13.5px] font-bold"
                          style={{ background: C.oat, color: C.cocoa }}
                        >
                          {pick(SPURDU.copy)}
                        </button>
                        <span className="text-[13px]" style={{ color: C.body }} aria-live="polite">
                          {copied ? pick(SPURDU.copied) : ''}
                        </span>
                      </div>

                      {/* THE DEMO: same question, other audience, different answer. */}
                      {otherAudiences(openGroup, audience).length > 0 && (
                        <div className="mt-6 border-t pt-5" style={{ borderColor: C.line }}>
                          <p className="text-[13.5px] font-bold" style={{ color: C.cocoa }}>
                            {pick(SPURDU.alsoFor)}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {otherAudiences(openGroup, audience).map((other) => {
                              const meta = AUDIENCES.find((a) => a.id === other)!
                              return (
                                <button
                                  key={other}
                                  type="button"
                                  onClick={() => chooseAudience(other)}
                                  className="bofs-focus rounded-[12px] px-3.5 py-2 text-[13.5px] font-bold transition-colors duration-150"
                                  style={{ background: C.oat, color: C.cocoa }}
                                >
                                  {pick(meta.label)}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* ── The human channels, always present ────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
            <Reveal>
              <div className="rounded-[22px] p-6 sm:p-8" style={{ background: C.oat }}>
                <h2 className="bofs-display text-[clamp(20px,2.4vw,26px)]">{pick(SPURDU.channelsTitle)}</h2>
                <p className="bofs-pretty mt-2 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: C.body }}>
                  {pick(SPURDU.channelsLead)}
                </p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {CHANNELS.map((ch) => (
                    <li key={ch.value}>
                      <a
                        href={ch.href}
                        className="bofs-focus block rounded-[15px] px-4 py-3.5"
                        style={{
                          background: '#fff',
                          boxShadow: `inset 0 0 0 1px ${ch.urgent ? C.clay : C.line}`,
                        }}
                      >
                        <span className="flex flex-wrap items-baseline gap-x-2.5">
                          <span
                            className="bofs-num text-[19px] font-bold"
                            style={{ color: ch.urgent ? C.clayText : C.cocoa }}
                          >
                            {ch.value}
                          </span>
                          <span className="text-[14.5px] font-semibold" style={{ color: C.cocoa }}>
                            {pick(ch.name)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[13px]" style={{ color: C.body }}>
                          {pick(ch.blurb)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What this is, stated plainly ─────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-8">
            <Reveal delay={0.04}>
              <div
                className="rounded-[22px] p-6 sm:p-8"
                style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
              >
                <span className="bofs-rule bofs-rule-clay mb-5 block" aria-hidden="true" />
                <h2 className="bofs-display text-[clamp(20px,2.4vw,26px)]">{pick(SPURDU.honestTitle)}</h2>
                <p className="bofs-pretty mt-3 max-w-[68ch] text-[15px] leading-relaxed" style={{ color: C.body }}>
                  {pick(SPURDU.honestBody)}
                </p>
                <p className="bofs-pretty mt-3 max-w-[68ch] text-[15px] leading-relaxed" style={{ color: C.body }}>
                  {pick(SPURDU.honestSecond)}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ── glyphs ───────────────────────────────────────────────────────────── */

function CloseGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.5 1.5 L10.5 10.5 M10.5 1.5 L1.5 10.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function UrgentGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="7" stroke={C.clay} strokeWidth="1.6" />
      <path d="M8 4.4 V8.6" stroke={C.clay} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="11.3" r="0.95" fill={C.clay} />
    </svg>
  )
}
