import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry } from './company'
import { HOURS, P, PHOTOS, PHRASES, SERVICES, SHOP } from './data'
import { DAY_NAMES_L, t } from './strings'
import type { Lang } from './strings'
import { initCountUp, initParallax, initProgress, initReveals, initStage, initSweep, words } from './motion'

/**
 * Rakararnir á Klapparstíg 40.
 *
 * THE IDEA. They have no website and no photographs worth building a hero out
 * of: nine phone snapshots that hold at plate size and fall apart full-bleed.
 * So the page does not open on a photograph. It opens on a DRAWING of their
 * own building, with their own name arced over it the way the real gold
 * lettering arcs over the real door, on a field taken from their window
 * frames. Then, as you scroll, the drawing dissolves and the real photograph
 * of that same building grows up out of the kerb to replace it. The drawing
 * earns the transition because it is a drawing of the thing that arrives.
 *
 * REFERENCE, measured at source rather than described:
 *   Monte      flat colour field, no hero photo, line drawing centred, text
 *              bent around a ring, live status top-left, and the photograph
 *              only peeking in at the bottom edge as the scroll tease
 *   A24        the LIST is the headline: titles stacked bottom-left, their
 *              years set as tiny superscripts alongside
 *   Locomotive full-bleed photography pushed through a single colour so that
 *              weak source material stops being judged as photography
 *
 * SCROLL GRAMMAR, one law: everything arrives FROM BELOW, because the whole
 * page is a walk-in. Outside (oxide) -> through the glass -> inside (the room
 * inverts to a bright cream ground, which is what their corner actually looks
 * like) -> back out to the street in the footer.
 *   scrubbed, reversible   the stage dissolve, media parallax
 *   continuous             the room marquee, paused on hover
 *   one-shot, stays put    text rises, list lines, the count-up
 *   spent exactly once     blur (the dissolve) and horizontal travel (the room)
 * One distance (--rk-rise), one duration (--rk-dur), one curve (--rk-ease) for
 * every entrance on the page. Nothing fades in without also rising.
 *
 * HONESTY LEDGER (carried from data.ts, unchanged):
 *  - VERIFIED: name, address, phone, the DROP INS WELCOME window card, the
 *    gilded lettering, Pride flags year round, 9 Facebook reviews at 100%.
 *  - CORROBORATED, confirm before outreach: opening hours.
 *  - PLACEHOLDER, labelled on screen in both languages: prices, service list,
 *    the quiet-hours table.
 *  - NOT INVENTED: staff names, testimonials. Not the 1918-2017 shop.
 */

/* React 18's DOM does not map the camelCase fetchPriority prop, and the TS
   types reject the lowercase one. Passing it untyped satisfies both: the
   attribute reaches the element and the compiler stays quiet. */
const EAGER = { fetchpriority: 'high' } as Record<string, string>

const LANG_KEY = 'rk-lang'
type Status = { open: boolean; label: string; detail: string }

/** Reykjavík wall-clock, not the visitor's. A tourist in Berlin must not be
 *  told the shop is shut because it is 19:00 where they are standing. */
const rvk = (d: Date) => {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Atlantic/Reykjavik', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d)
  const g = (k: string) => p.find((x) => x.type === k)?.value ?? ''
  const days: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: days[g('weekday')] ?? d.getDay(), mins: Number(g('hour')) * 60 + Number(g('minute')) }
}

function computeStatus(now: Date, lang: Lang): Status {
  const s = t(lang).status
  const { day, mins } = rvk(now)
  const today = HOURS[day]
  const fmt = (h: number) => `${String(h).padStart(2, '0')}:00`
  if (today && mins >= today.open * 60 && mins < today.close * 60) {
    const left = today.close * 60 - mins
    return { open: true, label: s.open, detail: left <= 60 ? s.soon(left) : s.until(fmt(today.close)) }
  }
  for (let i = 0; i < 8; i++) {
    const idx = (day + i) % 7
    const slot = HOURS[idx]
    if (!slot) continue
    if (i === 0 && mins >= slot.open * 60) continue
    return {
      open: false, label: s.closed,
      detail: i === 0 ? s.today(fmt(slot.open))
        : i === 1 ? s.tomorrow(fmt(slot.open)) : s.day(DAY_NAMES_L[lang][idx], fmt(slot.open)),
    }
  }
  return { open: false, label: s.closed, detail: SHOP.phone }
}

/**
 * Heading with a masked, staggered per-word rise.
 *
 * The inter-word space MUST sit outside .rk-rise-m. That span is
 * overflow:hidden so the word can slide up out of a clipped box, and a space
 * placed inside it is clipped away with everything else, which silently welds
 * every heading on the page into one long word.
 */
function Rise({ text, className = '', as: As = 'h2' }: { text: string; className?: string; as?: 'h1' | 'h2' | 'p' }) {
  return (
    <As className={`rk-rise ${className}`} data-rv="rise">
      {words(text).map(({ w, i }) => (
        <Fragment key={`${w}-${i}`}>
          <span className="rk-rise-m">
            <span style={{ '--i': i } as React.CSSProperties}>{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </As>
  )
}

/** The live open/closed badge. The detail clause is dropped on narrow screens,
 *  where "Lokað · opnar á mánudaginn kl. 10:00" overruns the bar it sits in. */
function Live({ status, className = '' }: { status: Status; className?: string }) {
  return (
    <span className={`rk-live ${className}`} data-open={status.open ? '1' : '0'}>
      <i className="rk-dot" />{status.label}
      <em className="rk-detail"> · {status.detail}</em>
    </span>
  )
}

/** Media frame: sharp corners, clip wipe on entry, parallax inside. */
function Frame({
  src, alt, ratio, cap, par = 14, priority,
}: { src: string; alt: string; ratio: string; cap?: string; par?: number; priority?: boolean }) {
  return (
    /* data-rv goes on the FIGURE, not the frame: a clip-path:inset(0 0 100%)
       element has an empty intersection rect, so an observer on the clipped
       node itself can never fire and the reveal never runs. */
    <figure className="rk-fig" data-rv="wipe">
      <span className="rk-frame" style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} decoding="async" data-par={par}
          {...(priority ? EAGER : { loading: 'lazy' as const })} />
      </span>
      {cap && <figcaption data-rv="rise">{cap}</figcaption>}
    </figure>
  )
}

export default function RakararnirPage() {
  const company = companyEntry
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<Lang>('is')
  const [now, setNow] = useState(() => new Date())
  const [past, setPast] = useState(false)
  const [openRow, setOpenRow] = useState<number | null>(null)
  const [proofIdx, setProofIdx] = useState(0)
  const [proofPaused, setProofPaused] = useState(false)
  const [mapActive, setMapActive] = useState(false)
  const s = t(lang)
  /* card 0 is the real review stat (with its own count-up markup); the rest
     come straight from s.proof.cards. Length is fixed at module scope below
     only in spirit — computed here because it depends on the active language. */
  const proofCount = 1 + s.proof.cards.length

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'is' || saved === 'en') setLang(saved)
  }, [])
  useEffect(() => { localStorage.setItem(LANG_KEY, lang) }, [lang])
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  /* Tab title, meta description and a JSON-LD HairSalon block. The shared
     shell's own <title>/<meta> are generic ("Endurhannanir"), which read
     back to this project's own preflight check as the page having no
     identity of its own — a real SEO gap, not a cosmetic one, on a page
     whose whole pitch to the owner is better search visibility.
     JSON-LD is deliberately minimal: name, address, phone, real opening
     hours. No priceRange or offer catalogue, because the prices on the page
     are placeholders and feeding fabricated numbers to search engines and
     AI answer boxes would be a worse dishonesty than a placeholder label a
     visitor can actually read and judge for themselves. */
  useEffect(() => {
    const prevTitle = document.title
    document.title = s.seo.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', s.seo.description)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: SHOP.name,
      url: window.location.href,
      telephone: SHOP.phoneHref.replace('tel:', ''),
      address: {
        '@type': 'PostalAddress',
        streetAddress: SHOP.street,
        addressLocality: 'Reykjavík',
        postalCode: '101',
        addressCountry: 'IS',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
    })
    document.head.appendChild(ld)

    return () => {
      document.title = prevTitle
      meta?.setAttribute('content', prevDesc)
      ld.remove()
    }
  }, [lang, s.seo.title, s.seo.description])

  /* The badge is the whole promise of a walk-in shop, so it cannot go stale
     while the tab sits open over the shop's closing time. */
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const status = useMemo(() => computeStatus(now, lang), [now, lang])

  useEffect(() => {
    const el = root.current
    const st = stage.current
    if (!el || !st) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rail = el.querySelector<HTMLElement>('.rk-progress')
    const cleanups = [
      initStage(st, reduce),
      initReveals(el, reduce),
      initParallax(el, reduce),
      initSweep(el, reduce),
      initCountUp(el, reduce),
      ...(rail ? [initProgress(rail, reduce)] : []),
    ]
    // the slim header only exists once the opening has been walked through
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { threshold: 0 })
    io.observe(st)
    return () => { cleanups.forEach((c) => c()); io.disconnect() }
  }, [lang])

  /* The proof cards rotate on their own clock, the same way the live status
     clock does, and pause rather than stop so hovering never loses the place
     you were reading. Reduced motion just stops advancing; the current card
     stays fully legible either way, nothing depends on the timer to be seen. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (proofPaused) return
    const id = window.setInterval(() => setProofIdx((i) => (i + 1) % proofCount), 4800)
    return () => window.clearInterval(id)
  }, [proofPaused, proofCount])
  useEffect(() => { setProofIdx(0) }, [lang])


  const ROOM = [
    { src: PHOTOS.stofan, cap: s.shop.caps[0] },
    { src: PHOTOS.folkid, cap: s.shop.team },
    { src: PHOTOS.spegill, cap: s.shop.caps[1] },
    { src: PHOTOS.gluggiKvold, cap: s.corner.caps[1] },
    { src: PHOTOS.jolatre, cap: s.shop.caps[2] },
  ]

  return (
    <div className="rk" ref={root}>
        <style>{CSS_TEXT}</style>

        <a className="rk-skip" href="#verd">{s.skip}</a>

        {/* whole-page scroll position, a thin gold rail down the right edge.
            Purely a motion accent; carries no content, so it can be display:
            none under reduced motion without losing anything. */}
        <div className="rk-progress" aria-hidden="true"><span className="rk-progress-fill" /></div>

        {/* ── slim header, after the opening ─────────────────────────── */}
        <header className="rk-head" data-on={past ? '1' : '0'}>
          <a className="rk-head-name" href="#top">{SHOP.name}</a>
          <nav className="rk-head-nav rk-mono">
            <a href="#verd">{s.nav.prices}</a>
            <a href="#stofan">{s.nav.shop}</a>
            <a href="#hornid">{s.nav.corner}</a>
            <a href="#opnun">{s.nav.hours}</a>
          </nav>
          <div className="rk-head-r rk-mono">
            <Live status={status} />
            <a href={SHOP.phoneHref}>{SHOP.phone}</a>
            <button type="button" onClick={() => setLang(lang === 'is' ? 'en' : 'is')}>
              {lang === 'is' ? 'EN' : 'IS'}
            </button>
          </div>
        </header>

        {/* ══ 1 · THE OPENING ════════════════════════════════════════════
            No photograph. Their building, drawn, under their name on a ring,
            on a field lifted from their own window frames. */}
        <section className="rk-stage" id="top" ref={stage}>
          <div className="rk-pin" data-pin>

            <div className="rk-rail rk-mono">
              <span className="rk-rail-l">{s.nav.prices}</span>
              <span className="rk-rail-mid">
                <b>{SHOP.name}</b>
                <small>{SHOP.street}</small>
              </span>
              <span className="rk-rail-r">
                <a href={SHOP.phoneHref}>{SHOP.phone}</a>
                <button type="button" onClick={() => setLang(lang === 'is' ? 'en' : 'is')}>
                  {lang === 'is' ? 'EN' : 'IS'}
                </button>
              </span>
            </div>

            {/* Monte sets its live status and its local temperature at the
                vertical middle, flanking the mark, rather than stacking them
                into the top bar. It gives the mark the whole centre and puts
                the one fact a passer-by wants at eye level. */}
            <p className="rk-flank rk-flank-l rk-mono"><Live status={status} /></p>
            <p className="rk-flank rk-flank-r rk-mono">{SHOP.postcode}</p>

            {/* Their real hand-painted sign is RAKARARNIR arched over
                KLAPPARSTÍGUR on the corner glass, so the lockup is that sign,
                not a full ring. A ring would also carry the shop's own name
                upside down along its bottom half. */}
            <div className="rk-mark">
              <svg className="rk-ring" viewBox="0 0 400 400" role="img" aria-label={SHOP.fullName}>
                <defs>
                  <path id="rk-arch" fill="none" d="M40,215 A160,160 0 0,1 360,215" />
                </defs>
                <text className="rk-arch-t" textAnchor="middle">
                  <textPath href="#rk-arch" startOffset="50%">{s.stage.arch}</textPath>
                </text>
                <text className="rk-arch-b" x="200" y="352" textAnchor="middle">{s.stage.archUnder}</text>
              </svg>
              <img className="rk-draw" src={P('mark-rakarastong.webp')} alt={s.stage.drawAlt}
                {...EAGER} decoding="async" />
            </div>

            {/* the photograph grows up out of the kerb and takes the frame */}
            <figure className="rk-photo">
              <img src={PHOTOS.bidstofaHero} alt={s.stage.photoAlt} {...EAGER} decoding="async" />
            </figure>

            <p className="rk-tease rk-mono"><span>{s.stage.scroll}<br />↓</span></p>

            <div className="rk-plate">
              <h1>{s.stage.plateTitle}</h1>
              <p>{s.stage.plateBody}</p>
            </div>
          </div>
        </section>

        {/* ══ 2 · THE THRESHOLD ════════════════════════════════════════
            The phrase helper lives here as a sidebar rather than as its own
            screen. It is the same promise as the headline beside it, aimed at
            a different worry: you do not need an appointment, and you do not
            need Icelandic either. On its own it was a whole section of a page
            spent on something a tourist reads once. */}
        <section className="rk-sec rk-dark rk-intro" data-rv="sec">
          <div className="rk-wrap rk-intro-grid">
            <div>
              <Rise as="h2" className="rk-display" text={`${s.intro.a} ${s.intro.b}`} />
              <p className="rk-lede" data-rv="rise">{s.intro.body}</p>
            </div>

            <aside className="rk-say" data-rv="rise">
              <p className="rk-mono rk-kicker">{s.phrases.title}</p>
              <p className="rk-say-lead">{s.phrases.lead}</p>
              <dl className="rk-phrases">
                {PHRASES.map((ph) => (
                  <div key={ph.is}>
                    <dt>{ph.is}</dt>
                    <dd>{ph.en}</dd>
                    <dd className="rk-mono rk-say-it">{ph.say}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        {/* ══ 3 · THE LIST IS THE HEADLINE (A24) ══════════════════════ */}
        <section className="rk-sec rk-light" id="verd" data-rv="sec">
          <div className="rk-wrap">
            <p className="rk-mono rk-kicker" data-rv="rise">{s.prices.title}</p>
            <ul className="rk-list">
              {SERVICES.map((svc, i) => (
                <li key={svc.is} style={{ '--i': i } as React.CSSProperties}
                  data-open={openRow === i ? '1' : '0'}
                  /* Hover is the nice case, not the only one. The pointerType
                     guard keeps a tap from firing enter-then-click and
                     immediately toggling the row shut again. */
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpenRow(i) }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpenRow(null) }}>
                  <button type="button" className="rk-list-in"
                    aria-expanded={openRow === i} aria-controls={`rk-svc-${i}`}
                    onClick={() => setOpenRow(openRow === i ? null : i)}
                    /* :focus-visible, not plain focus. A tap also focuses the
                       button, so an unguarded onFocus opened the row and the
                       click that followed immediately toggled it shut again,
                       making the first tap on any row do nothing at all. */
                    onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setOpenRow(i) }}>
                    <span className="rk-list-name">{lang === 'is' ? svc.is : svc.en}</span>
                    <sup>{svc.price} {s.prices.isk}</sup>
                    <span className="rk-list-sign" aria-hidden="true" />
                  </button>
                  <div className="rk-row-body" id={`rk-svc-${i}`}>
                    <div className="rk-row-inner">
                      <div className="rk-row-text">
                        <p>{lang === 'is' ? svc.descIs : svc.descEn}</p>
                        <p className="rk-mono rk-row-meta">
                          {svc.mins} {s.prices.mins} · {lang === 'is' ? svc.noteIs : svc.noteEn}
                        </p>
                      </div>
                      <span className="rk-row-shot">
                        <img src={PHOTOS[svc.photo]} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="rk-mono rk-note" data-rv="rise">{s.prices.note}</p>
          </div>
        </section>

        {/* ══ 4 · THE ROOM — the only horizontal travel on the page ═══ */}
        <section className="rk-sec rk-light rk-room" id="stofan" data-rv="sec">
          <div className="rk-wrap">
            <p className="rk-mono rk-kicker" data-rv="rise">{s.shop.title}</p>
            <Rise as="h2" className="rk-h2" text={s.shop.lead} />
          </div>
          {/* A marquee, not a scroll-linked slide: the room should be moving
              whether or not you are scrolling. The set is rendered twice and
              the track travels exactly -50%, so the loop has no seam. The
              second copy is aria-hidden so it is not announced twice. */}
          <div className="rk-drift-wrap">
            <div className="rk-marquee">
              {[0, 1].map((copy) => (
                <Fragment key={copy}>
                  {ROOM.map((im, i) => (
                    <figure className="rk-drift-item" key={`${copy}-${i}`} aria-hidden={copy === 1}>
                      <span className="rk-frame" style={{ aspectRatio: '4/5' }}>
                        <img src={im.src} alt={copy === 0 ? im.cap : ''} loading="lazy"
                          decoding="async" data-par={8} />
                      </span>
                      <figcaption className="rk-mono">{im.cap}</figcaption>
                    </figure>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5 · EVERYONE WELCOME ════════════════════════════════════ */}
        <section className="rk-sec rk-light rk-split" data-rv="sec">
          <div className="rk-wrap rk-two">
            <div>
              <p className="rk-mono rk-kicker" data-rv="rise">{s.band2.r}</p>
              <Rise as="h2" className="rk-h2" text={s.welcome.title} />
              <p className="rk-body" data-rv="rise">{s.welcome.body}</p>
            </div>
            <Frame src={PHOTOS.fanar} ratio="4/5" alt={s.welcome.title} par={16} />
          </div>
        </section>



        {/* ══ 8 · THE CORNER ══════════════════════════════════════════
            Drawn, not photographed. Their only exterior photograph is a 2022
            phone snapshot, and an AI photograph of a real building at a real
            address would be a fabrication no caption really fixes. A drawing
            is honest on its face and does not age.

            The drawing is derived FROM that photograph rather than from a
            written description, because a written prompt invented a building:
            it put the front door on the chamfered corner, which is actually a
            window, and guessed the roof. Feeding the real photo in keeps the
            real geometry: glazed chamfer, gable end facing right with its
            attic window, four upper windows per face, plinth and fascia. */}
        <section className="rk-sec rk-light rk-corner" id="hornid" data-rv="sec">
          <div className="rk-wrap">
            <div className="rk-corner-top">
              <div>
                <p className="rk-mono rk-kicker" data-rv="rise">{s.corner.title}</p>
                <Rise as="h2" className="rk-h2" text={s.corner.caps[0]} />
              </div>
              <div>
                <p className="rk-body" data-rv="rise">{s.corner.body}</p>
                <p data-rv="rise">
                  <a className="rk-cta" href={SHOP.maps} target="_blank" rel="noreferrer noopener">
                    {s.corner.maps} ↗
                  </a>
                </p>
              </div>
            </div>
            <figure className="rk-corner-fig" data-rv="rise">
              <img className="rk-corner-draw" data-sweep src={P('teikning-hornid.webp')}
                alt={s.stage.cornerAlt} loading="lazy" decoding="async" />
              <figcaption className="rk-mono">{SHOP.street} · {SHOP.postcode}</figcaption>
            </figure>
          </div>
        </section>

        {/* ══ 9 · WHAT'S ACTUALLY TRUE ═════════════════════════════════
            NOT testimonials. Facebook's individual review text sits behind a
            login wall, and já.is lists none, so there is no real customer
            quote to put here honestly. This rotates through three things
            that ARE real and checked instead: the 100% stat (with its own
            source link) and two facts about how the shop actually runs.
            All three stay mounted at once, stacked in one grid cell, so the
            count-up's IntersectionObserver has a stable node to watch
            regardless of which card is showing when it scrolls into view. */}
        <section className="rk-sec rk-light rk-rev" data-rv="sec"
          onMouseEnter={() => setProofPaused(true)} onMouseLeave={() => setProofPaused(false)}
          onFocus={() => setProofPaused(true)} onBlur={() => setProofPaused(false)}>
          <div className="rk-wrap">
            <p className="rk-mono rk-kicker" data-rv="rise">{s.proof.kicker}</p>
            <Rise as="h2" className="rk-h2" text={s.proof.heading} />

            <div className="rk-proof-stage" data-rv="rise">
              <div className="rk-proof-slide" data-active={proofIdx === 0} aria-hidden={proofIdx !== 0}>
                <p className="rk-big"><b data-count={SHOP.recommendPct}>0</b><span>%</span></p>
                <p className="rk-body">{s.reviews.of(SHOP.reviewCount)}</p>
                <a className="rk-cta" href={SHOP.facebook} target="_blank" rel="noreferrer noopener"
                  tabIndex={proofIdx === 0 ? undefined : -1}>{s.reviews.see} ↗</a>
              </div>
              {s.proof.cards.map((c, i) => (
                <div className="rk-proof-slide rk-proof-text" key={i}
                  data-active={proofIdx === i + 1} aria-hidden={proofIdx !== i + 1}>
                  <p className="rk-proof-line">{c}</p>
                </div>
              ))}
            </div>

            <div className="rk-proof-dots" role="tablist" aria-label={s.proof.kicker}>
              {Array.from({ length: proofCount }, (_, i) => (
                <button key={i} type="button" role="tab" aria-selected={proofIdx === i}
                  aria-label={`${i + 1} / ${proofCount}`}
                  data-active={proofIdx === i} onClick={() => setProofIdx(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ 9.5 · ON THE MAP ═════════════════════════════════════════
            A real Google Maps embed (the free query iframe, no API key
            needed), desaturated then re-tinted to the shop's own palette
            with mix-blend-mode so it reads as part of the page rather than a
            foreign widget dropped in. Gated behind a tap: this project's
            ledger already has one entry about a nested scroller trapping the
            page underneath it, and an eager Maps iframe is the same trap
            with extra steps on a touch device, panning the map when the
            visitor only meant to keep scrolling past it. */}
        <section className="rk-sec rk-dark rk-map" data-rv="sec">
          <div className="rk-wrap">
            <p className="rk-mono rk-kicker" data-rv="rise">{s.map.title}</p>
            <Rise as="h2" className="rk-h2" text={SHOP.street} />
            <p className="rk-lede" data-rv="rise">{s.map.lead}</p>
            <p data-rv="rise">
              <a className="rk-cta" href={SHOP.maps} target="_blank" rel="noreferrer noopener">
                {s.map.directions} ↗
              </a>
            </p>
          </div>

          <div className="rk-map-frame rk-fig" data-rv="wipe">
            <span className="rk-frame" style={{ aspectRatio: '16/9' }}>
              <span className="rk-map-embed" data-active={mapActive}>
                <iframe
                  title={SHOP.fullName}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${SHOP.street}, ${SHOP.postcode}`)}&z=17&output=embed`}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={mapActive ? undefined : -1} aria-hidden={!mapActive} />
                <span className="rk-map-tint" aria-hidden="true" />
              </span>
              {!mapActive && (
                <button type="button" className="rk-map-gate" onClick={() => setMapActive(true)}>
                  <span className="rk-mono">{s.map.activate}</span>
                </button>
              )}
            </span>
          </div>
        </section>

        {/* ══ 10 · BACK OUT TO THE STREET ═════════════════════════════ */}
        <footer className="rk-foot" id="opnun" data-rv="sec">
          <div className="rk-wrap rk-foot-grid">
            <div>
              <p className="rk-mono rk-kicker">{s.foot.hours}</p>
              <dl className="rk-hours">
                <div><dt>{s.foot.weekdays}</dt><dd>10:00 – 18:00</dd></div>
                <div><dt>{s.foot.weekend}</dt><dd>{s.foot.closed}</dd></div>
              </dl>
              <Live status={status} className="rk-mono rk-foot-live" />
            </div>
            <div>
              <p className="rk-mono rk-kicker">{s.foot.find}</p>
              <address>
                <span className="rk-nowrap">{SHOP.street}</span><br />{SHOP.postcode}
              </address>
              <p className="rk-mono rk-kicker rk-mt">{s.foot.phone}</p>
              <a className="rk-cta" href={SHOP.phoneHref}>{SHOP.phone}</a>
            </div>
            <img className="rk-foot-mark" src={P('mark-rakarastong.webp')} alt="" aria-hidden="true" loading="lazy" />
          </div>
          <p className="rk-foot-name" aria-hidden="true">{SHOP.name}</p>
        </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}

const CSS_TEXT = `
/* ══ RAKARARNIR ══════════════════════════════════════════════════════
   Every custom property, class and keyframe is prefixed rk- so this build
   cannot bleed styles into any other preview in this workspace. */
.rk{
  --rk-oxide:#A8402E;        /* the field: their oxide window frames */
  --rk-deep:#6E2A1E;         /* under the awning */
  --rk-cream:#F2E7D8;
  --rk-paper:#F7F0E4;        /* inside: their corner is genuinely bright */
  --rk-gold:#D9A441;
  --rk-green:#5E9C6C;
  --rk-sans:"Satoshi",system-ui,-apple-system,"Segoe UI",sans-serif;
  --rk-mono:"Space Mono",ui-monospace,SFMono-Regular,monospace;
  --rk-ease:cubic-bezier(.22,1,.36,1);
  --rk-rise:20px;            /* ONE distance for every entrance */
  --rk-dur:900ms;            /* ONE duration */
  --rk-gut:clamp(1.1rem,4vw,3rem);
  background:var(--rk-oxide);
  color:var(--rk-cream);
  font-family:var(--rk-sans);
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
}
.rk *{box-sizing:border-box}
.rk img{display:block;width:100%;height:100%;object-fit:cover}
.rk h1,.rk h2,.rk p,.rk dl,.rk dd,.rk dt,.rk ul,.rk figure,.rk figcaption,.rk address{margin:0;padding:0}
.rk ul{list-style:none}
.rk address{font-style:normal;line-height:1.7}
.rk a{color:inherit}
.rk-wrap{width:min(1400px,100% - var(--rk-gut) * 2);margin-inline:auto}
.rk-mono{font-family:var(--rk-mono);font-size:.63rem;letter-spacing:.2em;text-transform:uppercase}
.rk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.rk-skip{position:absolute;left:-9999px;top:0;z-index:99;background:var(--rk-cream);color:var(--rk-deep);padding:.7rem 1.1rem}
.rk-skip:focus{left:.6rem;top:.6rem}
.rk :focus-visible{outline:2px solid var(--rk-gold);outline-offset:3px}

/* ── whole-page scroll rail ──────────────────────────────────────── */
.rk-progress{position:fixed;top:0;right:0;width:3px;height:100vh;z-index:45;
  background:rgba(242,231,216,.14);pointer-events:none}
.rk-progress-fill{display:block;width:100%;height:100%;transform:scaleY(var(--rk-p,0));
  transform-origin:top;background:var(--rk-gold)}

/* ── live status ─────────────────────────────────────────────────── */
.rk-dot{width:.42rem;height:.42rem;border-radius:50%;background:var(--rk-green);
  display:inline-block;margin-right:.5rem;flex:none}
.rk-live{display:inline-flex;align-items:center;white-space:nowrap;min-width:0}
.rk-detail{font-style:normal}
.rk-live[data-open="0"] .rk-dot{background:#C9705F}

/* ── slim header ─────────────────────────────────────────────────── */
.rk-head{position:fixed;inset:0 0 auto;z-index:30;display:flex;align-items:center;gap:1.4rem;
  padding:.8rem var(--rk-gut);background:color-mix(in oklab,var(--rk-deep) 92%,transparent);
  backdrop-filter:blur(9px);border-bottom:1px solid rgba(242,231,216,.14);
  transform:translateY(-102%);transition:transform .5s var(--rk-ease)}
.rk-head[data-on="1"]{transform:none}
.rk-head-name{font-weight:900;letter-spacing:-.03em;text-decoration:none;font-size:1rem}
.rk-head-nav{display:flex;gap:1.3rem;margin-inline:auto}
.rk-head-nav a{text-decoration:none;opacity:.72;transition:opacity .25s ease}
.rk-head-nav a:hover{opacity:1}
.rk-head-r{display:flex;align-items:center;gap:1.1rem}
.rk-head-r a{text-decoration:none}
.rk-head-r button,.rk-rail-r button{background:none;border:1px solid rgba(242,231,216,.4);color:inherit;
  font:inherit;padding:.3rem .6rem;cursor:pointer;transition:background .25s ease,color .25s ease}
.rk-head-r button:hover,.rk-rail-r button:hover{background:var(--rk-cream);color:var(--rk-deep)}

/* ══ 1 · THE OPENING ════════════════════════════════════════════════ */
.rk-stage{height:300vh;position:relative}
.rk-pin{position:sticky;top:0;height:100svh;overflow:hidden;
  background:color-mix(in oklab,var(--rk-oxide) calc((1 - var(--rk-d,0)) * 100%),var(--rk-deep))}

.rk-rail{position:absolute;inset:1.5rem var(--rk-gut) auto;z-index:6;
  display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;
  color:color-mix(in oklab,var(--rk-cream) 80%,transparent)}
.rk-rail b{font-weight:700;color:var(--rk-cream)}
.rk-rail-l{opacity:.62}
.rk-rail-mid{text-align:center;line-height:1.75}
.rk-rail-mid small{display:block;font-size:.9em;opacity:.62;letter-spacing:.18em}
.rk-rail-r{display:flex;align-items:center;gap:.9rem}
.rk-rail-r a{text-decoration:none}

/* their name arced over their building, the way the real gold lettering
   arcs over the real door */
.rk-mark{position:absolute;left:50%;top:45%;z-index:4;width:min(70vmin,600px);aspect-ratio:1;
  translate:-50% -50%;
  transform:scale(calc(1 + var(--rk-d,0) * .72));
  opacity:calc(1 - var(--rk-d,0) * 2.2);
  will-change:transform,opacity}
.rk-ring{position:absolute;inset:0;color:var(--rk-cream);overflow:visible}
.rk-ring text{fill:currentColor;text-transform:uppercase}
.rk-arch-t{font-family:var(--rk-sans);font-weight:900;font-size:38px;letter-spacing:.05em}
.rk-arch-b{font-family:var(--rk-mono);font-size:14px;letter-spacing:.34em}
.rk img.rk-draw{position:absolute;left:20%;top:16%;width:60%;height:64%;object-fit:contain}

/* the ONE blur on the page, spent here and never repeated */
.rk-photo{position:absolute;z-index:5;bottom:0;
  left:calc((1 - var(--rk-d,0)) * 7vw);right:calc((1 - var(--rk-d,0)) * 7vw);
  height:calc(13vh + var(--rk-d,0) * 87vh);
  border-radius:calc((1 - var(--rk-d,0)) * 10px) calc((1 - var(--rk-d,0)) * 10px) 0 0;
  overflow:hidden;will-change:height}
/* oversized on both axes: blur() drags transparency in at an element's own
   edges and would otherwise show as a pale rim down the sides */
.rk-photo img{position:absolute;left:-4%;top:-4%;width:108%;height:108%;
  transform:scale(calc(1.1 - var(--rk-d,0) * .1));
  filter:saturate(calc(1 + var(--rk-d,0) * .12)) blur(max(0px,calc((.4 - var(--rk-d,0)) * 9px)))}
.rk-photo::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:var(--rk-d,0);
  background:linear-gradient(180deg,rgba(110,42,30,.34),transparent 34%,transparent 62%,rgba(110,42,30,.5))}

.rk-flank{position:absolute;z-index:6;top:50%;translate:0 -50%;
  color:color-mix(in oklab,var(--rk-cream) 78%,transparent);
  opacity:calc(1 - var(--rk-d,0) * 2.2)}
.rk-flank-l{left:var(--rk-gut)}
.rk-flank-r{right:var(--rk-gut)}

.rk-tease{position:absolute;z-index:7;left:0;right:0;text-align:center;
  bottom:calc(13vh + 1.6rem);opacity:calc(1 - var(--rk-t,0) * 5);
  color:color-mix(in oklab,var(--rk-cream) 62%,transparent)}
.rk-tease span{display:block;animation:rk-nudge 2.4s var(--rk-ease) infinite}
@keyframes rk-nudge{0%,100%{transform:none}50%{transform:translateY(5px)}}

.rk-plate{position:absolute;z-index:7;left:var(--rk-gut);bottom:clamp(1.4rem,5vh,3rem);
  max-width:36ch;opacity:var(--rk-s,0);
  transform:translateY(calc((1 - var(--rk-s,0)) * var(--rk-rise)))}
.rk-plate h1{font-size:clamp(1.6rem,3.6vw,2.8rem);font-weight:900;letter-spacing:-.035em;line-height:1.02}
.rk-plate p{margin-top:.6rem;line-height:1.62;font-size:.96rem;
  color:color-mix(in oklab,var(--rk-cream) 74%,transparent)}

/* ══ SECTIONS ═══════════════════════════════════════════════════════ */
.rk-sec{padding:clamp(4.5rem,13vh,9rem) 0;position:relative}
.rk-dark{background:var(--rk-deep);color:var(--rk-cream)}
/* through the glass the page inverts: inside, their corner is bright */
.rk-light{background:var(--rk-paper);color:var(--rk-deep)}
.rk-kicker{color:var(--rk-gold);letter-spacing:.3em}
.rk-light .rk-kicker{color:#9A5236}
.rk-display{font-size:clamp(2.1rem,6.4vw,5.2rem);font-weight:900;letter-spacing:-.045em;line-height:1.06}
.rk-h2{font-size:clamp(1.6rem,4vw,3.1rem);font-weight:900;letter-spacing:-.035em;line-height:1.14;margin-top:1.1rem}
.rk-lede{margin-top:2.7rem;max-width:56ch;line-height:1.72;font-size:clamp(1rem,1.25vw,1.13rem);
  color:color-mix(in oklab,var(--rk-cream) 74%,transparent)}
.rk-body{margin-top:1.2rem;max-width:52ch;line-height:1.7;
  color:color-mix(in oklab,currentColor 76%,transparent)}
.rk-note{margin-top:1.2rem;color:color-mix(in oklab,currentColor 52%,transparent)}
.rk-ticker{margin-top:2.4rem;color:var(--rk-gold);letter-spacing:.26em}
.rk-two{display:grid;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.rk-mt{margin-top:1.6rem}
.rk-cta{display:inline-block;margin-top:1.1rem;font-family:var(--rk-mono);font-size:.66rem;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;
  border-bottom:1px solid currentColor;padding-bottom:.28rem;transition:opacity .25s ease}
.rk-cta:hover{opacity:.6}

/* ── the list is the headline (A24) ──────────────────────────────── */
.rk-list{margin-top:2.2rem;max-width:64rem;border-top:1px solid color-mix(in oklab,currentColor 22%,transparent)}
.rk-list li{border-bottom:1px solid color-mix(in oklab,currentColor 22%,transparent)}
.rk-list-in{display:flex;align-items:baseline;gap:.75rem;width:100%;
  background:none;border:0;color:inherit;text-align:left;cursor:pointer;font-family:inherit;
  padding:clamp(.65rem,1.7vh,1.05rem) 0;
  font-size:clamp(1.6rem,4.8vw,3.6rem);font-weight:900;letter-spacing:-.04em;line-height:1.06;
  transition:color .3s ease}
/* the clip that lets the line rise lives on a wrapper, because the row itself
   must be free to grow when it opens */
.rk-list li{overflow:clip}
.rk-list-in{transform:translateY(105%);transition:transform 1s var(--rk-ease),color .3s ease;
  transition-delay:calc(var(--i,0) * 70ms)}
[data-shown="true"] .rk-list-in{transform:none}
.rk-list li[data-open="1"] .rk-list-in{color:#9A5236}
.rk-list sup{font-family:var(--rk-mono);font-size:.6rem;letter-spacing:.1em;font-weight:400;
  vertical-align:super;white-space:nowrap;color:color-mix(in oklab,currentColor 62%,transparent)}

/* the sign: a plus that becomes a minus, drawn rather than typed so it never
   depends on a glyph being in the font */
.rk-list-sign{margin-left:auto;position:relative;width:.85rem;height:.85rem;flex:none;
  align-self:center;opacity:.5;transition:opacity .3s ease}
.rk-list-sign::before,.rk-list-sign::after{content:"";position:absolute;inset:50% 0 auto;
  height:1.5px;background:currentColor;translate:0 -50%;transition:rotate .45s var(--rk-ease)}
.rk-list-sign::after{rotate:90deg}
.rk-list li[data-open="1"] .rk-list-sign{opacity:1}
.rk-list li[data-open="1"] .rk-list-sign::after{rotate:0deg}

/* 0fr -> 1fr is the only way to transition to an unknown content height
   without measuring it in JS */
.rk-row-body{display:grid;grid-template-rows:0fr;
  transition:grid-template-rows .55s var(--rk-ease)}
.rk-list li[data-open="1"] .rk-row-body{grid-template-rows:1fr}
.rk-row-inner{overflow:hidden;display:flex;gap:clamp(1rem,3vw,2.2rem);align-items:flex-start;
  opacity:0;transform:translateY(var(--rk-rise));
  transition:opacity .45s var(--rk-ease),transform .45s var(--rk-ease)}
.rk-list li[data-open="1"] .rk-row-inner{opacity:1;transform:none;transition-delay:.08s}
.rk-row-text{flex:1 1 auto;padding-bottom:1.4rem}
.rk-row-text p{max-width:52ch;line-height:1.66;font-size:clamp(.94rem,1.1vw,1.02rem);
  color:color-mix(in oklab,currentColor 74%,transparent)}
.rk-row-meta{margin-top:.6rem;color:color-mix(in oklab,currentColor 50%,transparent)}
.rk-row-shot{flex:none;width:clamp(96px,13vw,168px);aspect-ratio:4/3;overflow:hidden;
  margin-bottom:1.4rem;display:block}
.rk .rk-row-shot img{width:100%;height:100%;object-fit:cover}

/* ── the room: the only horizontal travel on the page ────────────── */
.rk-drift-wrap{position:relative;overflow:hidden;margin-top:clamp(2rem,5vh,3.4rem)}
.rk-marquee{display:flex;width:max-content;animation:rk-marq 54s linear infinite;
  will-change:transform}
/* the space between plates is each item's own margin, never a flex gap: a gap
   also lands between the two copies, so the track stops being exactly twice
   one set and -50% no longer lines up, which shows as a stutter every loop */
.rk-drift-item{width:clamp(230px,26vw,400px);flex:none;margin-right:clamp(.5rem,1.4vw,1rem)}
.rk-drift-item figcaption{margin-top:.7rem;color:color-mix(in oklab,currentColor 52%,transparent)}
@keyframes rk-marq{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
.rk-drift-wrap:hover .rk-marquee,.rk-drift-wrap:focus-within .rk-marquee{animation-play-state:paused}


/* ── the corner, drawn ───────────────────────────────────────────── */
.rk-corner-top{display:grid;gap:clamp(1.2rem,4vw,3.5rem);align-items:end}
.rk-corner-fig{margin-top:clamp(1.5rem,4vh,2.6rem);text-align:center}
.rk .rk-corner-draw{width:100%;height:auto;max-width:820px;margin-inline:auto;object-fit:contain;
  /* without this the lazy-loaded image has no layout size until it decodes,
     so the whole section collapses to its text height and then jumps taller
     once the drawing loads: a real layout shift for anyone scrolling down at
     an ordinary pace, found because it was also throwing off every scroll
     target computed against sections further down the page */
  aspect-ratio:2200/1892;
  --sv:0;
  /* draws itself in as it crosses the lower part of the viewport: an
     off-axis feather so the linework resolves rather than being uncovered
     by a hard scanline, the same device this project shelved once before
     and is finally the right fit for */
  mask-image:linear-gradient(100deg,#000 calc(var(--sv) * 162% - 62%),transparent calc(var(--sv) * 162% - 8%));
  -webkit-mask-image:linear-gradient(100deg,#000 calc(var(--sv) * 162% - 62%),transparent calc(var(--sv) * 162% - 8%))}
.rk-corner-fig figcaption{margin-top:.4rem;color:color-mix(in oklab,currentColor 50%,transparent)}

/* ── the tourist helper ──────────────────────────────────────────── */
.rk-intro-grid{display:grid;gap:clamp(2.4rem,6vw,5rem);align-items:start}
.rk-say{border-top:1px solid rgba(242,231,216,.2);padding-top:1.4rem}
.rk-say-lead{margin-top:.7rem;line-height:1.6;font-size:.92rem;max-width:38ch;
  color:color-mix(in oklab,var(--rk-cream) 62%,transparent)}
.rk-phrases{margin-top:1.3rem;display:grid;gap:0}
.rk-phrases > div{display:grid;gap:.1rem;padding:.72rem 0;
  border-top:1px solid rgba(242,231,216,.12)}
.rk-phrases > div:first-child{border-top:0}
.rk-phrases dt{font-size:.98rem;font-weight:700;letter-spacing:-.01em}
.rk-phrases dd{font-size:.86rem;color:color-mix(in oklab,var(--rk-cream) 58%,transparent)}
.rk-say-it{color:var(--rk-gold);font-size:.58rem}

/* ── what's true: three real things, one slot ────────────────────── */
.rk-big{margin-top:.8rem;font-weight:900;letter-spacing:-.05em;line-height:.9;
  font-size:clamp(4rem,15vw,11rem);display:flex;align-items:baseline}
.rk-big span{font-size:.4em}
/* every slide stacks in the same grid cell, so the row auto-sizes to the
   tallest one and the count-up's target node never unmounts between rotations */
.rk-proof-stage{display:grid;margin-top:1.6rem}
.rk-proof-slide{grid-area:1/1;opacity:0;transform:translateY(14px);pointer-events:none;
  transition:opacity .6s var(--rk-ease),transform .6s var(--rk-ease)}
.rk-proof-slide[data-active="true"]{opacity:1;transform:none;pointer-events:auto}
.rk-proof-text{align-self:center;max-width:44rem;padding-block:.4rem}
.rk-proof-line{font-size:clamp(1.3rem,3.2vw,2.1rem);font-weight:700;letter-spacing:-.02em;
  line-height:1.32;max-width:26ch}
.rk-proof-dots{display:flex;gap:.55rem;margin-top:2rem}
.rk-proof-dots button{width:.55rem;height:.55rem;border-radius:50%;border:0;padding:0;
  background:color-mix(in oklab,currentColor 22%,transparent);cursor:pointer;
  transition:background .3s ease,transform .3s ease}
.rk-proof-dots button[data-active="true"]{background:#9A5236;transform:scale(1.35)}

/* ── the map: a Google embed re-skinned to the shop's own palette ─── */
.rk-map-frame{margin-top:clamp(2rem,5vh,3.4rem)}
.rk-map-frame .rk-frame{background:var(--rk-oxide-deep)}
.rk-map-embed{position:absolute;inset:0}
.rk-map-embed[data-active="false"]{pointer-events:none}
/* the filter goes on the IFRAME, not the wrapper: filter on a parent applies
   to its whole composited output, so it would run AFTER the tint below has
   already blended in and grey the colour right back out. Greyscale first,
   tint second, in that literal paint order. */
.rk-map-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;
  filter:grayscale(1) contrast(1.12) brightness(.9)}
/* mix-blend-mode:color takes hue+saturation from this layer and keeps the
   luminosity of the greyscale map beneath it: a duotone without touching
   Google's tiles or needing a Static Maps API key */
.rk-map-tint{position:absolute;inset:0;background:var(--rk-oxide);
  mix-blend-mode:color;pointer-events:none}
.rk-map-gate{position:absolute;inset:0;z-index:2;display:grid;place-items:center;
  background:rgba(20,10,7,.28);border:0;cursor:pointer;color:var(--rk-cream)}
.rk-map-gate span{border:1px solid rgba(242,231,216,.55);padding:.9rem 1.6rem;
  font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;
  background:rgba(20,10,7,.55);transition:background .25s ease,border-color .25s ease}
.rk-map-gate:hover span{background:rgba(20,10,7,.75);border-color:var(--rk-cream)}

/* ── footer: back out to the street ──────────────────────────────── */
.rk-foot{background:var(--rk-oxide);color:var(--rk-cream);padding:clamp(3.5rem,10vh,7rem) 0 0;
  position:relative;overflow:hidden}
.rk-foot-grid{display:grid;gap:clamp(2rem,5vw,4rem);align-items:start}
.rk-hours{margin-top:1rem}
.rk-hours > div{display:flex;justify-content:space-between;gap:1rem;padding:.6rem 0;
  border-bottom:1px solid rgba(242,231,216,.18)}
.rk-hours dt{color:color-mix(in oklab,var(--rk-cream) 62%,transparent)}
.rk-hours dd{font-weight:700}
.rk-foot .rk-live{margin-top:1.1rem}
.rk-nowrap{white-space:nowrap}
.rk-foot address{margin-top:.9rem}
.rk img.rk-foot-mark{width:min(230px,42vw);height:auto;aspect-ratio:1;object-fit:contain;opacity:.45;justify-self:end}
.rk-foot-name{font-weight:900;letter-spacing:-.055em;line-height:.78;text-align:center;
  font-size:clamp(4rem,19vw,17rem);margin-top:clamp(2rem,6vh,4rem);
  color:color-mix(in oklab,var(--rk-cream) 17%,transparent);
  padding-inline:var(--rk-gut);user-select:none}

/* ══ MOTION ═════════════════════════════════════════════════════════
   One curve, one distance, one duration. Nothing fades without rising. */
/* The mask has to be TALLER than the line box or it slices the descenders
   off every g, j, p and ö, and the acute accents off Í and Á. The padding
   opens the clip below the baseline and the negative margin takes the space
   back out of the layout; the hidden word then has to travel further than
   100% so it still starts outside the enlarged box.

   .rk-rise itself must NOT also clip: the padding trick above deliberately
   bleeds paint outside each word's normal-flow box (that's what the negative
   margin buys), so the heading's own auto height is exactly one line-height
   with no room for that bleed. overflow:hidden here re-clips every
   descender and accent the trick just uncut. The reveal mask doesn't need
   it — each .rk-rise-m already hides its own pre-slide-up word. */
.rk-rise{overflow:visible}
.rk-rise-m{display:inline-block;overflow:hidden;vertical-align:top;
  padding-block:.16em .26em;margin-block:-.16em -.26em}
.rk-rise-m > span{display:inline-block;transform:translateY(145%);
  transition:transform 1s var(--rk-ease);transition-delay:calc(var(--i,0) * 48ms)}
.rk-rise[data-shown="true"] .rk-rise-m > span{transform:none}

[data-rv="rise"]{opacity:0;transform:translateY(var(--rk-rise));
  transition:opacity var(--rk-dur) var(--rk-ease),transform var(--rk-dur) var(--rk-ease);
  transition-delay:calc(var(--i,0) * 55ms)}
[data-rv="rise"][data-shown="true"]{opacity:1;transform:none}

.rk-fig[data-rv="wipe"] .rk-frame{clip-path:inset(0 0 100%);
  transition:clip-path 1.05s var(--rk-ease)}
.rk-fig[data-shown="true"] .rk-frame{clip-path:inset(0 0 0)}
.rk-frame{display:block;position:relative;overflow:hidden;width:100%}
.rk-frame img{position:absolute;left:0;top:-5%;height:110%;
  transform:translate3d(0,calc(var(--py,0) * 1px),0)}
.rk-fig figcaption{margin-top:.7rem;font-family:var(--rk-mono);font-size:.62rem;
  letter-spacing:.18em;text-transform:uppercase;
  color:color-mix(in oklab,currentColor 52%,transparent)}

@media (min-width:820px){
  .rk-two{grid-template-columns:1.05fr .95fr}
  .rk-corner-top{grid-template-columns:1fr 1fr}
  /* the aside is a genuine sidebar on desktop and simply follows the
     statement once there is no room beside it */
  .rk-intro-grid{grid-template-columns:1.3fr .7fr}
  .rk-say{border-top:0;border-left:1px solid rgba(242,231,216,.2);
    padding:.4rem 0 .4rem clamp(1.4rem,3vw,2.6rem)}
  .rk-foot-grid{grid-template-columns:1fr 1fr auto}
}
@media (max-width:819px){
  .rk-head-nav{display:none}
  .rk-rail-mid small{display:none}
  /* "Lokað · opnar á mánudaginn kl. 10:00" does not fit a 390px bar next to a
     wordmark, a phone number and a language toggle. The dot plus Opið/Lokað
     still answers the only question that matters on the way past the window. */
  .rk-head .rk-detail{display:none}
  .rk-rail-l{display:none}
  /* at 390px the flanks would sit on top of the mark, so they return to a
     stacked pair above and below it */
  .rk-flank{top:auto;translate:none;text-align:center;left:var(--rk-gut);right:var(--rk-gut)}
  .rk-flank-l{bottom:calc(13vh + 4.6rem)}
  .rk-flank-r{display:none}
  .rk-head-r a{display:none}
  .rk-rail{font-size:.55rem;letter-spacing:.13em}
  .rk-mark{width:82vmin;top:43%}
  .rk-arch-t{font-size:44px}
  .rk-arch-b{font-size:16px;letter-spacing:.28em}
  .rk img.rk-foot-mark{justify-self:start;opacity:.35}
  /* the drift becomes an ordinary swipeable rail on touch: the transform is
     dropped so --dx cannot fight the user's own scrolling */
  .rk-row-inner{flex-direction:column-reverse}
  .rk-row-shot{width:100%;aspect-ratio:16/9;margin-bottom:.9rem}
}
@media (prefers-reduced-motion:reduce){
  .rk-stage{height:auto}
  .rk-pin{position:relative;height:100svh}
  .rk-ring{animation:none;rotate:0deg}
  .rk-photo img{filter:none;transform:none}
  .rk-tease span{animation:none}
  .rk-marquee{animation:none}
  .rk-drift-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .rk-rise-m > span,[data-rv="rise"],.rk-list-in{transform:none!important;opacity:1!important;transition:none}
  .rk-row-body,.rk-row-inner,.rk-list-sign::before,.rk-list-sign::after{transition:none}
  .rk-row-inner{transform:none}
  .rk-fig[data-rv="wipe"] .rk-frame{clip-path:none;transition:none}
  .rk-head{transition:none}
  .rk-progress{display:none}
  .rk .rk-corner-draw{mask-image:none;-webkit-mask-image:none}
  .rk-proof-slide{transition:none}
}
`
