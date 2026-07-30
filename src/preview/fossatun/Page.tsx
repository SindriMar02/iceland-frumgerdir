/**
 * FOSSATÚN — "Árið í Fossatúni"
 * ---------------------------------------------------------------------------
 * THE INTERACTION MODEL, stated plainly because the last five builds failed by
 * not stating it: this page is NOT a stack of full-width bands you scroll
 * through. Its spine is the YEAR. A visitor picks when they are coming and the
 * page changes state: the light, the palette, what is open, what is bookable,
 * and which month the availability calendar opens on. Scroll position changes
 * nothing except what is on screen.
 *
 * That model is not decoration. Fossatún is shut in December and January, the
 * Trollgarden has its own separate hours, and the pods are a summer product.
 * The season IS the business, so it drives the page.
 *
 * The signature is `TrollWords`: a digital echo of the carved letter drums
 * that physically stand in their Trollgarden. It is a toy that does nothing
 * until a person touches it.
 *
 * Devices studied at source from two award references and rebuilt, not copied:
 * sticky media beside scrolling text (tengilemalamala's SanityMedia sticky),
 * a scattered image cloud rather than a uniform card grid (its ImagesCloud),
 * a CSS marquee that stays paused until seen (amourliquide's ticker), and
 * display type set LIGHT at wght 240 (tengile 220 / omai 250). Neither
 * reference uses GSAP, Lenis or WebGL, and neither does this page.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './fossatun.css'
import { StayBooking } from './BookingUI'
import { TrollWords } from './TrollWords'
import { TrollDrums3D } from './TrollDrums3D'
import { SafeDecor } from './SafeDecor'
import {
  CURRENT_BOOKING_HOST, DIRECT_DISCOUNT_CODE, EMAIL, EMAIL_HREF, FOSSATUN_ENTRY, MUSIC,
  PHONE_DISPLAY, PHONE_HREF, REGION, STAYS, TROLL, YEAR,
} from './data'

const IMG = (f: string) => `${import.meta.env.BASE_URL}fossatun/img/${f}`

const HERO = IMG('landscape-fjord-valley-01.jpg')

function seasonOf(m: number, open: boolean): string {
  if (!open) return 'shut'
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 10) return 'autumn'
  return 'winter'
}

/** Reveals that always resolve to the resting state, with a failsafe. */
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
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add('is-in')
      else waiting.push(el)
    })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    waiting.forEach((el) => io.observe(el))
    const t = window.setTimeout(() => { waiting.forEach((el) => el.classList.add('is-in')); io.disconnect() }, 2000)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [])
}

/**
 * IMAGE MASK DRIFT.
 *
 * Photographs drift inside a fixed frame rather than travelling with the page.
 * The rule that matters: every getBoundingClientRect() happens before any
 * style write. Interleaving them forces one synchronous layout per element,
 * and at a dozen tracked nodes that pins the main thread.
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
        const drift = Number(el.dataset.drift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * drift).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])
}

/** The marquee only runs once it is on screen. */
function useMarquee(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => el.classList.toggle('is-in', x.isIntersecting)),
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

export default function FossatunPage() {
  useReveal()
  useImageDrift()
  const [month, setMonth] = useState(7)
  const marqueeRef = useRef<HTMLDivElement>(null)
  useMarquee(marqueeRef)

  const state = YEAR[month - 1]
  const season = seasonOf(month, state.open)

  useEffect(() => {
    setThemeColor('#e7e3dc')
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
    <div className="fst-root" data-season={season}>
      <PreviewChrome company={FOSSATUN_ENTRY} />

      {/* ── header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'absolute', insetInline: 0, top: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '18px clamp(20px,5vw,72px)', color: '#f4f1ea',
        }}
      >
        <span
          className="fst-disp"
          style={{ fontSize: 23, fontWeight: 300, letterSpacing: '.12em', textTransform: 'uppercase' }}
        >
          Fossatún
        </span>
        <nav style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <a href="#bokun" style={{ textDecoration: 'none', fontSize: 14.5, fontWeight: 560 }}>Bóka</a>
          <a href={PHONE_HREF} style={{ textDecoration: 'none', fontSize: 14.5, fontWeight: 560 }}>
            {PHONE_DISPLAY}
          </a>
        </nav>
      </header>

      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section className="fst-hero" aria-label="Fossatún">
        <div className="fst-hero__media">
          <div className="fst-frame-in" data-drift="6">
            <img
              src={HERO}
              alt="Fossatún við Grímsá, fossarnir í forgrunni og fjallið að baki í kvöldsól"
              loading="eager"
              {...{ fetchpriority: 'high' }}
            />
          </div>
        </div>
        <div className="fst-hero__scrim" aria-hidden="true" />
        <div className="fst-hero__body fst-wrap">
          <p className="fst-label" style={{ color: 'rgba(244,241,234,.82)' }}>
            Sveitahótel í {REGION}
          </p>
          <h1>Árið í Fossatúni</h1>
          <p className="fst-hero__light">{state.light}</p>
        </div>
      </section>

      {/* ── the year band: the spine ───────────────────────────────────── */}
      <div className="fst-year">
        <div className="fst-year__inner fst-wrap" role="group" aria-label="Veldu mánuð">
          {YEAR.map((m) => (
            <button
              key={m.n}
              type="button"
              className="fst-month"
              aria-pressed={m.n === month}
              data-shut={!m.open || undefined}
              data-trail={m.trail}
              onClick={() => setMonth(m.n)}
            >
              {m.short}
              <span className="fst-month__dot" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <main>
        {/* ── what the chosen month actually means ─────────────────────── */}
        <section className="fst-sec fst-sec--wash">
          <div className="fst-wrap">
            <div className="fst-sechead">
              <span className="fst-label">Í {state.name}</span>
            </div>
            {!state.open && (
              <div className="fst-shut">
                <strong>Fossatún er lokað í {state.name}.</strong> Það stendur skýrt hér, því gestur
                á ekki að komast að því fyrst þegar hann er byrjaður að bóka.
              </div>
            )}
            <h2 style={{ maxWidth: '18ch' }}>{state.offer}</h2>
            <p className="fst-lede" style={{ marginTop: 16 }}>{trailLine}</p>
          </div>
        </section>

        {/* ── stays, filtered by the month ─────────────────────────────── */}
        <section className="fst-sec">
          <div className="fst-wrap">
            <div className="fst-sechead">
              <span className="fst-label">Gisting</span>
              <span className="fst-note">Fjórar gerðir á sama staðnum</span>
            </div>
            <div className="fst-stays">
              {openStays.map((s) => (
                <article key={s.id} className="fst-stay fst-rv" data-off={!s.on || undefined}>
                  <div className="fst-stay__rule" aria-hidden="true" />
                  <div>
                    <h3>{s.name}</h3>
                    <p className="fst-label" style={{ marginTop: 4 }}>{s.count}</p>
                  </div>
                  <p style={{ marginBottom: 0 }}>{s.blurb}</p>
                  {s.facts.length > 0 && (
                    <ul>{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>
                  )}
                  {!s.on && (
                    <p className="fst-stay__off">
                      {state.open ? `Ekki í boði í ${state.name}` : `Lokað í ${state.name}`}
                    </p>
                  )}
                </article>
              ))}
            </div>
            <p className="fst-note" style={{ marginTop: 20 }}>
              Á vef Fossatúns eru engar myndir af herbergjunum, pods, cottage eða tjaldsvæðinu í dag.
              Þess vegna eru engar myndir hér af þeim. Þær kæmu inn með einni myndatöku.
            </p>
          </div>
        </section>

        {/* ── the trail, with the signature ────────────────────────────── */}
        <section className="fst-sec">
          <div className="fst-wrap">
            <div className="fst-sechead">
              <span className="fst-label">Tröllagarðurinn</span>
            </div>
            <div className="fst-split">
              <div>
                <h2>Þar sem tröllin urðu til</h2>
                <p style={{ marginTop: 16 }}>{TROLL.origin}</p>
                <div style={{ margin: '26px 0' }}>
                  <SafeDecor fallback={<TrollWords />}>
                    <TrollDrums3D>
                      <TrollWords />
                    </TrollDrums3D>
                  </SafeDecor>
                </div>
                <p className="fst-note">
                  Stafirnir hér að ofan eru eftirmynd af stafaþrautinni sem stendur í garðinum.
                </p>
                <p style={{ marginTop: 22 }}>
                  <strong>{trailLine}</strong>
                  <br />
                  {TROLL.admissionNote}
                </p>
                <p className="fst-note">{TROLL.creditNote}</p>
                <p className="fst-note" style={{ marginTop: -6 }}>{TROLL.soldWhere}</p>
              </div>
              <div className="fst-split__media">
                <figure className="fst-figure">
                  <div className="fst-frame" style={{ aspectRatio: '4 / 5' }}>
                    <div className="fst-frame-in" data-drift="9">
                      <img
                        src={IMG('troll-head-falls.jpg')}
                        alt="Steypt tröllshöfuð við Tröllafossa, hótelið og fjallið í baksýn"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <figcaption>Tröllshöfuðið við fossana, með Fossatún í baksýn.</figcaption>
                </figure>
              </div>
            </div>

            <div className="fst-cloud" style={{ marginTop: 48 }}>
              <figure className="fst-figure fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="9">
                    <img src={IMG('troll-garden-artwork.jpg')} alt="Stafaþrautin í Tröllagarðinum, útskornir viðarkubbar á snúningsásum" loading="lazy" />
                  </div>
                </div>
                </figure>
              <figure className="fst-figure fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="12">
                    <img src={IMG('troll-chair.jpg')} alt="Risastór tröllastóll úr timbri á gönguleiðinni" loading="lazy" />
                  </div>
                </div>
              </figure>
              <figure className="fst-figure fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="10">
                    <img src={IMG('troll-cauldron.jpg')} alt="Tröllskessa með pott við gönguleiðina" loading="lazy" />
                  </div>
                </div>
              </figure>
              <figure className="fst-figure fst-rv">
                <div className="fst-frame" style={{ aspectRatio: '4 / 3' }}>
                  <div className="fst-frame-in" data-drift="13">
                    <img src={IMG('troll-board-play.jpg')} alt="Gestur að leik við tröllaskiltið í garðinum" loading="lazy" />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* ── the books, as a marquee ──────────────────────────────────── */}
        <div className="fst-marquee" ref={marqueeRef} aria-label="Tungumál bókanna">
          <div className="fst-marquee__track" aria-hidden="true">
            {[...TROLL.languages, ...TROLL.languages].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
        <div className="fst-marqueeblock">
          <div className="fst-wrap">
            <p className="fst-note">
              Tryggðatröll og Trunt Trunt hafa komið út á þessum tungumálum.
            </p>
          </div>
        </div>

        {/* ── the music ────────────────────────────────────────────────── */}
        <section className="fst-sec">
          <div className="fst-wrap">
            <div className="fst-sechead">
              <span className="fst-label">Rock ’n’ Troll</span>
            </div>
            <div className="fst-split">
              <div>
                <h2>Plötusafnið er á matseðlinum</h2>
                <p style={{ marginTop: 16 }}>{MUSIC.blurb}</p>
                <p>{MUSIC.award}</p>
                <p className="fst-note">Heimild: {MUSIC.awardSourceLabel}</p>
              </div>
              <div className="fst-split__media">
                <figure className="fst-figure">
                  <div className="fst-frame" style={{ aspectRatio: '700 / 388' }}>
                    <div className="fst-frame-in" data-drift="8">
                      <img
                        src={IMG('rocknroll-mark.jpg')}
                        alt="Merki Rock ’n’ Troll, vínylplata með tröllsandliti"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
            <figure className="fst-figure fst-rv" style={{ marginTop: 40 }}>
              <div className="fst-frame" style={{ aspectRatio: '16 / 9' }}>
                <div className="fst-frame-in" data-drift="12">
                  <img
                    src={IMG('vinyl-lounge.jpg')}
                    alt="Setustofan með plötusafninu, leðurstólar og hillur fullar af vínyl"
                    loading="lazy"
                  />
                </div>
              </div>
            </figure>
          </div>
        </section>

        {/* ── booking: the working prototype ───────────────────────────── */}
        <section className="fst-sec fst-sec--wash" id="bokun">
          <div className="fst-wrap">
            <div className="fst-sechead">
              <span className="fst-label">Bókun</span>
              <span className="fst-note">Prófaðu hana, hún virkar</span>
            </div>
            <h2 style={{ maxWidth: '20ch' }}>Bókað hjá ykkur, ekki annars staðar</h2>
            <p className="fst-lede" style={{ margin: '16px 0 30px' }}>
              Dagatalið hér að neðan les opnunina beint úr kerfinu. Lokað í desember og janúar er
              ekki setning á síðu heldur staðreynd sem dagatalið getur ekki selt.
            </p>
            <StayBooking month={month} />
          </div>
        </section>

        {/* ── practical ────────────────────────────────────────────────── */}
        <section className="fst-sec">
          <div className="fst-wrap">
            <div className="fst-sechead" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span className="fst-label">Hagnýtt</span>
              <img src={IMG('logo-mark.png')} alt="Merki Fossatúns" className="fst-mark" />
            </div>
            <div className="fst-tablewrap">
              <table className="fst-table">
                <tbody>
                  <tr><th>Opnun</th><td>Opið allt árið nema í desember og janúar</td></tr>
                  <tr><th>Tröllagarðurinn</th><td>{TROLL.hoursSummer}. {TROLL.hoursShoulder}.</td></tr>
                  <tr><th>Aðgangur</th><td className="num">{TROLL.admissionNote}</td></tr>
                  <tr><th>Sími</th><td><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></td></tr>
                  <tr><th>Netfang</th><td><a href={EMAIL_HREF}>{EMAIL}</a></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── the honest note about what this page is ──────────────────── */}
        <section className="fst-sec" style={{ borderBottom: 0 }}>
          <div className="fst-wrap">
            <div className="fst-sechead"><span className="fst-label">Um þessa frumgerð</span></div>
            <p style={{ maxWidth: '64ch' }}>
              Þetta er hönnunarhugmynd, ekki vefsíða Fossatúns. Allar myndir og upplýsingar eru sóttar
              af fossatun.is 29. júlí 2026. Gistiverð er hvergi birt á vef þeirra, svo verðin í
              bókuninni eru sýnidæmi og merkt sem slík. Verð í Tröllagarðinn eru þeirra eigin.
            </p>
            <p className="fst-note" style={{ maxWidth: '64ch' }}>
              Í dag fer bókun fram á {CURRENT_BOOKING_HOST} og afsláttarkóðinn {DIRECT_DISCOUNT_CODE} er
              sleginn inn þar. Hugmyndin hér er að sú bókun eigi heima á þeirra eigin léni.
            </p>
            <div className="fst-owner-cta">
              <p className="fst-label" style={{ marginBottom: 6 }}>Fyrir eigendur</p>
              <p style={{ marginBottom: 14, maxWidth: '58ch' }}>
                Sendu bókunarbeiðni hér að ofan og opnaðu svo stjórnborðið. Beiðnin birtist þar strax,
                og þar er hún staðfest eða henni hafnað. Ekkert kort, engin greiðsla, engin þóknun.
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
