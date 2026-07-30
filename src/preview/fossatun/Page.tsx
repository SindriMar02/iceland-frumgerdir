/**
 * FOSSATÚN — "Sagan af tröllunum og plötusafnaranum"
 * ---------------------------------------------------------------------------
 * THE STORY, stated first because the previous build had none: a man who spent
 * his life in the record business found a rock shaped like a troll's face by a
 * waterfall, wrote folk tales about it, built a troll trail around it, and put
 * his vinyl collection in the restaurant. You sleep in a wooden pod under the
 * aurora and eat cake served on a record. That is the page.
 *
 * REFERENCE: reveriesafaris.com, chosen by Sindri. Its devices were read out of
 * its own DOM, not guessed from a screenshot:
 *   · one very light editorial serif carries every heading, never bold
 *   · full-bleed photography IS the structure, not decoration between text
 *   · a centred intro (eyebrow / heading / one lede / one text link) opens a
 *     collection, then a horizontal rail of tall images
 *   · sticky photograph beside scrolling copy
 *   · appear-only motion. It is a Framer site: no GSAP, no Lenis, and its
 *     images carry no transforms at all. So nothing here is scrubbed either.
 *
 * WHY IT CAN WORK HERE, which I got wrong once: I said Fossatún had no room
 * photography and that a photo-led direction would lose. That was true of their
 * public PAGES and false of their MEDIA LIBRARY, which holds 295 assets — a
 * professional shoot including their camping pod under a full aurora, the hotel
 * under northern lights in snow, pod interiors, the glass conservatory hanging
 * over the falls, the gold records on the wall, and food plated on vinyl.
 * Harvest the archive before declaring an asset does not exist.
 *
 * The booking prototype and the owner dashboard are unchanged: they work, and
 * they were never the problem.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './fossatun.css'
import { StayBooking } from './BookingUI'
import {
  CURRENT_BOOKING_HOST, DIRECT_DISCOUNT_CODE, EMAIL, EMAIL_HREF, FOSSATUN_ENTRY, MUSIC,
  PHONE_DISPLAY, PHONE_HREF, REGION, STAYS, TROLL, YEAR,
} from './data'

const IMG = (f: string) => `${import.meta.env.BASE_URL}fossatun/img/${f}`

/**
 * Appear-only reveals, the way the reference does them.
 *
 * Two rules learned the hard way: anything already on screen at mount is shown
 * immediately, because an element that never crosses the viewport boundary
 * never fires an observer; and a timeout failsafe force-shows the rest, gated
 * on position so it cannot wipe out the choreography for someone scrolling.
 */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.fst-rv'))
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !els.length) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const vh = window.innerHeight
    const waiting: HTMLElement[] = []
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-in')
      else waiting.push(el)
    })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    )
    waiting.forEach((el) => io.observe(el))
    // failsafe: only force-show what should already be on screen, never the lot
    const t = window.setTimeout(() => {
      waiting.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      })
    }, 2600)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [])
}

/**
 * Photographs drift inside a fixed frame instead of travelling with the page.
 * Every getBoundingClientRect() happens before any style write; interleaving
 * them forces a synchronous layout per element and pins the main thread.
 */
function useImageDrift() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(document.querySelectorAll<HTMLElement>('.fst-frame-in'))
    if (!items.length) return
    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight
      const writes: [HTMLElement, string][] = []
      for (const el of items) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const drift = Number(el.dataset.drift || 8)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * drift).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])
}

export default function FossatunPage() {
  useReveal()
  useImageDrift()
  const [month, setMonth] = useState(7)
  const bookRef = useRef<HTMLDivElement>(null)

  const state = YEAR[month - 1]

  useEffect(() => {
    setThemeColor('#0a121f')
    const prevTitle = document.title
    document.title = 'Fossatún · Sveitahótel, Tröllagarður og Rock ’n’ Troll í Borgarfirði'
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content =
      'Sveitahótel í Borgarfirði með tólf herbergjum, camping pods, tjaldsvæði, Tröllagarði og veitingastaðnum Rock ’n’ Troll. Opið allt árið nema í desember og janúar.'
    document.head.appendChild(meta)
    return () => { document.title = prevTitle; meta.remove() }
  }, [])

  const openStays = useMemo(
    () => STAYS.map((s) => ({ ...s, on: state.open && s.months.includes(month) })),
    [month, state.open],
  )

  const trailLine =
    state.trail === 'daily' ? TROLL.hoursSummer
      : state.trail === 'weekends' ? TROLL.hoursShoulder
        : 'Tröllagarðurinn er lokaður í þessum mánuði.'

  return (
    <div className="fst-root">
      <PreviewChrome company={FOSSATUN_ENTRY} />

      {/* ── header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'absolute', insetInline: 0, top: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '22px clamp(20px,5vw,76px)', color: '#f6f2e8',
        }}
      >
        <span
          className="fst-disp"
          style={{ fontSize: 25, fontWeight: 300, letterSpacing: '.14em', textTransform: 'uppercase' }}
        >
          Fossatún
        </span>
        <nav style={{ display: 'flex', gap: 22, alignItems: 'center', fontSize: 13.5, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          <a href="#bokun" style={{ textDecoration: 'none', fontWeight: 560 }}>Bóka</a>
          <a href={PHONE_HREF} style={{ textDecoration: 'none', fontWeight: 560 }}>{PHONE_DISPLAY}</a>
        </nav>
      </header>

      {/* ── hero: their pod under the aurora ───────────────────────────── */}
      <section className="fst-hero" aria-label="Fossatún">
        <div className="fst-hero__media">
          <img
            src={IMG('hero-pod-aurora.jpg')}
            alt="Camping pod í Fossatúni með ljós innandyra, norðurljósaslæða yfir himninum"
            loading="eager"
            {...{ fetchpriority: 'high' }}
          />
        </div>
        <div className="fst-hero__scrim" aria-hidden="true" />
        <div className="fst-hero__body fst-wrap">
          <p className="fst-eyebrow">Sveitahótel í {REGION}</p>
          <h1>Sofðu þar sem tröllin urðu til</h1>
          <p className="fst-hero__sub">
            Tólf herbergi, átta pods og tjaldsvæði við Grímsá. Tröllagarður í túninu og
            plötusafn á veitingastaðnum.
          </p>
        </div>
        <span className="fst-scrollcue" aria-hidden="true">Skrunaðu</span>
      </section>

      <main>
        {/* ── the thesis ───────────────────────────────────────────────── */}
        <section className="fst-sec">
          <div className="fst-wrap">
            <div className="fst-split">
              <div className="fst-split__copy fst-rv">
                <p className="fst-eyebrow">Staðurinn</p>
                <h2>Einn bær, fjórir heimar</h2>
                <p className="fst-lede" style={{ marginTop: 22 }}>
                  Fossatún stendur við Tröllafossa í Grímsá, klukkutíma frá Reykjavík. Hér er
                  sveitahótel, camping pods, sumarhús, tjaldsvæði, gönguleið full af tröllum og
                  veitingastaður sem heitir eftir plötusafni eigandans.
                </p>
                <p>
                  Það er óvenjulegt að finna þetta allt á sama hlaðinu, og það er ástæðan fyrir
                  því að fólk kemur aftur. Þú getur gist eina nótt á leiðinni vestur, eða verið
                  í viku og gengið sömu leiðina á hverjum degi.
                </p>
                <p style={{ marginTop: 26 }}>
                  <a className="fst-textlink" href="#bokun">Sjá lausar nætur</a>
                </p>
              </div>
              <div className="fst-split__sticky fst-rv" data-d="1">
                <figure>
                  <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                    <div className="fst-frame-in" data-drift="7">
                      <img src={IMG('falls-trollafossar.jpg')} alt="Tröllafossar í Grímsá, hvítfyssandi vatn milli klettanna" loading="lazy" />
                    </div>
                  </div>
                  <figcaption>Tröllafossar, steinsnar frá húsinu.</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ── the stay, as a rail ──────────────────────────────────────── */}
        <section className="fst-sec fst-sec--tight" id="gisting">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Gisting</p>
              <h2>Fjórar gerðir, sama túnið</h2>
              <p className="fst-lede" style={{ marginTop: 18 }}>
                Frá tjaldstæði við ána upp í herbergi með sérbaðherbergi. Veldu mánuð og sjáðu
                hvað er opið þá.
              </p>
            </div>
          </div>

          <div className="fst-year" role="group" aria-label="Veldu mánuð">
            <div className="fst-year__inner fst-wrap">
              {YEAR.map((m) => (
                <button
                  key={m.n}
                  type="button"
                  className="fst-month"
                  aria-pressed={m.n === month}
                  data-shut={!m.open || undefined}
                  onClick={() => setMonth(m.n)}
                >
                  {m.short}
                </button>
              ))}
            </div>
          </div>

          {/* The reveal lives on the RAIL, never on the cards. A card scrolled out
              of view horizontally never intersects the viewport, so a per-card
              observer leaves the last two stuck at opacity 0 with their lazy
              images unloaded — on mobile you swipe across and hit blank cards. */}
          <div className="fst-rail fst-wrap fst-rv" style={{ marginTop: 'clamp(26px,4vw,44px)' }}>
            {openStays.map((s) => (
              <article key={s.id} className="fst-stay" data-off={!s.on || undefined}>
                <div className="fst-stay__fig">
                  <img src={IMG(s.img)} alt={s.imgAlt} loading="lazy" />
                </div>
                <div className="fst-stay__head">
                  <h3>{s.name}</h3>
                  <span className="fst-stay__count">{s.count}</span>
                </div>
                <p>{s.blurb}</p>
                {s.facts.length > 0 && <ul>{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
                {!s.on && (
                  <p className="fst-stay__off">
                    {state.open ? `Ekki í boði í ${state.name}` : `Lokað í ${state.name}`}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ── chapter break: the hotel under the aurora ────────────────── */}
        <section className="fst-bleed" aria-label="Norðurljós yfir Fossatúni">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="6">
              <img src={IMG('hotel-aurora-snow.jpg')} alt="Sveitahótelið í Fossatúni í snjó undir norðurljósum" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Febrúar til nóvember</p>
            <h2>Ljósin koma þegar húsið er þegar sofnað</h2>
            <p>
              Fossatún er opið allt árið nema í desember og janúar. Það stendur hér vegna þess að
              gestur á ekki að komast að því fyrst þegar hann er byrjaður að bóka.
            </p>
          </div>
        </section>

        {/* ── the troll garden ─────────────────────────────────────────── */}
        <section className="fst-sec" id="trollagardurinn">
          <div className="fst-wrap">
            <div className="fst-split fst-split--flip">
              <div className="fst-split__sticky fst-rv">
                <figure>
                  <div className="fst-frame" style={{ aspectRatio: '4 / 5' }}>
                    <div className="fst-frame-in" data-drift="9">
                      <img src={IMG('troll-head-falls.jpg')} alt="Steypt tröllshöfuð við Tröllafossa með hótelið í baksýn" loading="lazy" />
                    </div>
                  </div>
                  <figcaption>Tröllshöfuðið við fossana.</figcaption>
                </figure>
              </div>
              <div className="fst-split__copy fst-rv" data-d="1">
                <p className="fst-eyebrow">Tröllagarðurinn</p>
                <h2>Það byrjaði á kletti</h2>
                <p className="fst-lede" style={{ marginTop: 22 }}>{TROLL.origin}</p>
                <p>
                  Síðan urðu til bækurnar, og í kjölfarið gönguleiðin: tröll úr steypu og timbri
                  á víð og dreif um túnið, þrautir fyrir börn og stafaþraut sem enginn gengur
                  framhjá án þess að snúa.
                </p>
                <p><strong>{trailLine}</strong><br />{TROLL.admissionNote}</p>
                <p className="fst-note">{TROLL.creditNote}</p>
                <p className="fst-note" style={{ marginTop: -4 }}>{TROLL.soldWhere}</p>
              </div>
            </div>

            <div className="fst-grid" style={{ marginTop: 'clamp(30px,5vw,58px)' }}>
              <figure className="fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="8">
                    <img src={IMG('troll-words-sign.jpg')} alt="Stafaþrautin í Tröllagarðinum, útskornir viðarkubbar á snúningsásum" loading="lazy" />
                  </div>
                </div>
              </figure>
              <figure className="fst-rv" data-d="1">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="11">
                    <img src={IMG('troll-cauldron.jpg')} alt="Tröllskessa með pott við gönguleiðina" loading="lazy" />
                  </div>
                </div>
              </figure>
              <figure className="fst-rv" data-d="2">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="9">
                    <img src={IMG('troll-tug.jpg')} alt="Gestir í reiptogi við tröllaþrautina á túninu" loading="lazy" />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* ── the record man: the night chapter ────────────────────────── */}
        <section className="fst-sec fst-night" id="rocknroll">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Rock ’n’ Troll</p>
              <h2>Veitingastaður með plötusafn</h2>
              <p className="fst-lede" style={{ marginTop: 18 }}>{MUSIC.blurb}</p>
            </div>

            <div className="fst-split" style={{ marginTop: 'clamp(24px,4vw,52px)' }}>
              <div className="fst-split__copy fst-rv">
                <p>
                  Steinar Berg starfaði alla sína tíð í tónlist áður en hann byggði upp Fossatún.
                  Gullplöturnar á veggnum eru hans eigin, og safnið í hillunum er ekki skraut
                  heldur plötur sem eru settar á fóninn.
                </p>
                <p>{MUSIC.award}</p>
                <p className="fst-note">Heimild: {MUSIC.awardSourceLabel}</p>
                <p style={{ marginTop: 26 }}>
                  <a className="fst-textlink" href="#bokun">Bóka borð og nótt</a>
                </p>
              </div>
              <div className="fst-split__sticky fst-rv" data-d="1">
                <figure>
                  <div className="fst-frame" style={{ aspectRatio: '3 / 2' }}>
                    <div className="fst-frame-in" data-drift="7">
                      <img src={IMG('gold-records.jpg')} alt="Gullplötur í römmum á vegg veitingastaðarins" loading="lazy" />
                    </div>
                  </div>
                  <figcaption>Gullplöturnar hanga í matsalnum.</figcaption>
                </figure>
              </div>
            </div>

            <div className="fst-grid" style={{ marginTop: 'clamp(28px,4vw,54px)' }}>
              <figure className="fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '1 / 1' }}>
                  <div className="fst-frame-in" data-drift="8">
                    <img src={IMG('cake-on-vinyl.jpg')} alt="Kaka borin fram á vínylplötu í stað disks" loading="lazy" />
                  </div>
                </div>
                <figcaption>Kakan kemur á plötu. Það er ekki uppstilling, það er diskurinn.</figcaption>
              </figure>
              <figure className="fst-rv" data-d="1">
                <div className="fst-frame" style={{ aspectRatio: '1 / 1' }}>
                  <div className="fst-frame-in" data-drift="10">
                    <img src={IMG('vinyl-lounge-wide.jpg')} alt="Setustofan með plötusafninu, leðurstólar og hillur fullar af vínyl" loading="lazy" />
                  </div>
                </div>
                <figcaption>Setustofan, þar sem safnið stendur.</figcaption>
              </figure>
              <figure className="fst-rv" data-d="2">
                <div className="fst-frame" style={{ aspectRatio: '1 / 1' }}>
                  <div className="fst-frame-in" data-drift="7">
                    <img src={IMG('conservatory-falls.jpg')} alt="Glerskálinn á veitingastaðnum með útsýni beint yfir Tröllafossa" loading="lazy" />
                  </div>
                </div>
                <figcaption>Glerskálinn hangir yfir fossunum.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── booking ──────────────────────────────────────────────────── */}
        <section className="fst-sec" id="bokun" ref={bookRef}>
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Bókun</p>
              <h2>Bókaðu beint og fáðu {DIRECT_DISCOUNT_CODE}-afsláttinn</h2>
              <p className="fst-lede" style={{ marginTop: 18 }}>
                Veldu daga og sendu beiðni beint til Fossatúns. Ekkert greiðslukort er slegið inn
                hér. Fossatún staðfestir með símtali eða tölvupósti.
              </p>
            </div>
            <StayBooking month={month} />
          </div>
        </section>

        {/* ── practical ────────────────────────────────────────────────── */}
        <section className="fst-sec fst-sec--tight">
          <div className="fst-wrap fst-wrap--read">
            <p className="fst-eyebrow fst-rv">Hagnýtt</p>
            <div className="fst-tablewrap fst-rv" data-d="1">
              <table className="fst-table">
                <tbody>
                  <tr><th>Opnun</th><td>Opið allt árið nema í desember og janúar</td></tr>
                  <tr><th>Tröllagarðurinn</th><td>{TROLL.hoursSummer}. {TROLL.hoursShoulder}.</td></tr>
                  <tr><th>Aðgangur</th><td>{TROLL.admissionNote}</td></tr>
                  <tr><th>Staðsetning</th><td>Við Grímsá í {REGION}, um klukkutíma akstur frá Reykjavík</td></tr>
                  <tr><th>Sími</th><td><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></td></tr>
                  <tr><th>Netfang</th><td><a href={EMAIL_HREF}>{EMAIL}</a></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── the honest note about what this page is ──────────────────── */}
        <section className="fst-sec fst-sec--tight">
          <div className="fst-wrap fst-wrap--read">
            <p className="fst-eyebrow">Um þessa frumgerð</p>
            <p style={{ maxWidth: '64ch' }}>
              Þetta er hönnunarhugmynd, ekki vefsíða Fossatúns. Allar ljósmyndir eru þeirra eigin,
              sóttar af fossatun.is. Gistiverð er hvergi birt á vef þeirra, svo verðin í bókuninni
              eru sýnidæmi og merkt sem slík. Verð í Tröllagarðinn eru þeirra eigin.
            </p>
            <p className="fst-note" style={{ maxWidth: '64ch' }}>
              Í dag fer bókun fram á {CURRENT_BOOKING_HOST} og afsláttarkóðinn {DIRECT_DISCOUNT_CODE}{' '}
              er sleginn inn þar. Hugmyndin hér er að sú bókun eigi heima á þeirra eigin léni.
            </p>
            <div className="fst-owner-cta">
              <p className="fst-eyebrow" style={{ marginBottom: 8 }}>Fyrir eigendur</p>
              <p style={{ marginBottom: 18, maxWidth: '58ch' }}>
                Prófaðu sjálf/ur: sendu bókunarbeiðni hér að ofan og opnaðu svo stjórnborðið, helst
                í öðrum flipa. Beiðnin birtist þar í rauntíma, tilbúin til að samþykkja eða hafna.
                Ekkert kort, engin greiðsla, engin þóknun.
              </p>
              <a className="fst-cta" href={`${import.meta.env.BASE_URL}preview/fossatun/stjornbord`}>
                Opna stjórnborðið
              </a>
            </div>
          </div>
        </section>
      </main>

      <PreviewFooter company={FOSSATUN_ENTRY} />
    </div>
  )
}
