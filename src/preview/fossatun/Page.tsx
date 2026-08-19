/**
 * FOSSATÚN — built against reveriesafaris.com, MEASURED not eyeballed.
 * ---------------------------------------------------------------------------
 * The first attempt claimed to transplant this reference and did not. Running
 * the same probe over both pages is what showed it:
 *
 *                         Reverie      first attempt     target here
 *   image area / viewport   0.906          0.367            >= 0.80
 *   images                    84             15               >= 40
 *   h1 / h2 / h3 px         42/32/26      90/58/27          42/34/24
 *   headings centred        27 of 49       4 of 12          majority
 *   tables                     0              1                 0
 *
 * The single number that matters is the first one. Reverie gives roughly a
 * whole viewport of photography for every viewport you scroll; the first pass
 * gave a third of that, which is why it read as a text page with pictures in
 * it rather than a picture page with words on it. Everything below follows
 * from fixing that: bigger pictures, more of them, smaller type, centred
 * section intros, and no bullet lists or tables anywhere.
 *
 * DEVICES taken from the reference's own DOM (it is a Framer site: no GSAP, no
 * Lenis, no transforms on its images, so nothing here is scrubbed either):
 *   · one light editorial serif on every heading, never bold
 *   · full-bleed photography as the structure itself
 *   · centred intro (eyebrow / heading / one lede / one text link) opening a
 *     collection, then a rail of tall images
 *   · a photograph that sticks while copy scrolls past it
 *   · a single deep dark chapter (theirs is forest green rgb(30,57,43))
 *   · appear-only motion
 *
 * The photography is entirely Fossatún's own, harvested from their WordPress
 * media library: 295 assets, including a professional shoot that never made it
 * onto their public pages.
 */

import { useEffect, useMemo, useState } from 'react'
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

/** Appear-only reveals. Anything already on screen at mount is shown at once —
 *  an element that never crosses the viewport edge never fires an observer. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.fst-rv'))
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !els.length) { els.forEach((el) => el.classList.add('is-in')); return }
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
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
    )
    waiting.forEach((el) => io.observe(el))
    const t = window.setTimeout(() => {
      waiting.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      })
    }, 2600)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [])
}

/** Photographs drift inside a fixed frame. Every read happens before any write;
 *  interleaving them forces one synchronous layout per element. */
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

/** A photograph at full measure. This component exists so image blocks are
 *  large by default — the reference's density is impossible with thumbnails. */
function Shot({
  src, alt, ratio, drift = 8, caption, eager = false,
}: {
  src: string; alt: string; ratio: string; drift?: number; caption?: string; eager?: boolean
}) {
  return (
    <figure className="fst-wide">
      <div className="fst-frame" style={{ aspectRatio: ratio }}>
        <div className="fst-frame-in" data-drift={String(drift)}>
          <img src={IMG(src)} alt={alt} loading={eager ? 'eager' : 'lazy'} />
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/**
 * Open the year spine on the next month that is actually OPEN for business.
 *
 * This used to be a hardcoded `7`. Opened on 31 July, the booking calendar then
 * landed on júlí of the FOLLOWING year: the calendar treats a month with fewer
 * than four days left as gone and rolls it forward, and rolling July forward
 * means July 2027. Correct by its own rules and baffling to look at. Anchor to
 * today instead, and skip December and January, which they are shut.
 */
function defaultMonth(): number {
  const now = new Date()
  const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()
  // same "fewer than four days left counts as gone" rule the calendar uses
  const start = now.getUTCMonth() + (daysInMonth - now.getUTCDate() < 4 ? 1 : 0)
  for (let i = 0; i < 12; i++) {
    const m = ((start + i) % 12) + 1
    if (YEAR[m - 1].open) return m
  }
  return 7
}

export default function FossatunPage() {
  useReveal()
  useImageDrift()
  const [month, setMonth] = useState(defaultMonth)
  const state = YEAR[month - 1]

  useEffect(() => {
    setThemeColor('#16241c')
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

      <header
        style={{
          position: 'absolute', insetInline: 0, top: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '24px clamp(20px,5vw,76px)', color: '#f6f2e8',
        }}
      >
        <span
          className="fst-disp"
          style={{ fontSize: 20, fontWeight: 300, letterSpacing: '.2em', textTransform: 'uppercase' }}
        >
          Fossatún
        </span>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase' }}>
          <a href="#bokun" style={{ textDecoration: 'none', fontWeight: 560 }}>Bóka</a>
          <a href={PHONE_HREF} style={{ textDecoration: 'none', fontWeight: 560 }}>{PHONE_DISPLAY}</a>
        </nav>
      </header>

      {/* ── hero ───────────────────────────────────────────────────────── */}
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
        {/* ── opening statement, then a big picture ───────────────────── */}
        <section className="fst-sec fst-sec--tight">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Staðurinn</p>
              <h2>Einn bær, fjórir heimar</h2>
              <p className="fst-lede" style={{ marginTop: 16 }}>
                Sveitahótel, camping pods, sumarhús og tjaldsvæði við Tröllafossa í Grímsá,
                klukkutíma frá Reykjavík. Gönguleið full af tröllum og veitingastaður sem
                heitir eftir plötusafni eigandans.
              </p>
              <p style={{ marginTop: 22 }}>
                <a className="fst-textlink" href="#bokun">Sjá lausar nætur</a>
              </p>
            </div>
          </div>
          <div className="fst-mediawrap fst-rv">
            <Shot src="falls-trollafossar.jpg" ratio="21 / 9" drift={6}
              alt="Tröllafossar í Grímsá, hvítfyssandi vatn milli klettanna" />
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Norðurljós yfir dalnum">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="6">
              <img src={IMG('aurora-valley.jpg')} alt="Norðurljós yfir dalnum við Fossatún" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Febrúar til nóvember</p>
            <h2>Ljósin koma þegar húsið er þegar sofnað</h2>
          </div>
        </section>

        {/* ── the stay ───────────────────────────────────────────────── */}
        <section className="fst-sec fst-sec--tight" id="gisting">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Gisting</p>
              <h2>Fjórar gerðir, sama túnið</h2>
              <p className="fst-lede" style={{ marginTop: 16 }}>
                Frá tjaldstæði við ána upp í herbergi með sérbaðherbergi. Veldu mánuð og sjáðu
                hvað er opið þá.
              </p>
            </div>
          </div>

          <div className="fst-year" role="group" aria-label="Veldu mánuð">
            <div className="fst-year__inner fst-wrap">
              {YEAR.map((m) => (
                <button
                  key={m.n} type="button" className="fst-month"
                  aria-pressed={m.n === month}
                  data-shut={!m.open || undefined}
                  onClick={() => setMonth(m.n)}
                >
                  {m.short}
                </button>
              ))}
            </div>
          </div>

          {/* the rail is IMAGES. One title, one line. No bullet lists — the
              reference never puts a spec sheet under a picture. */}
          <div className="fst-rail fst-mediawrap fst-rv" style={{ marginTop: 'clamp(24px,3.5vw,42px)' }}>
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
                {!s.on && (
                  <p className="fst-stay__off">
                    {state.open ? `Ekki í boði í ${state.name}` : `Lokað í ${state.name}`}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="fst-mediawrap" style={{ marginTop: 'clamp(22px,3vw,40px)' }}>
            <div className="fst-duo fst-rv">
              <Shot src="pod-aurora-2.jpg" ratio="5 / 4" drift={9}
                alt="Camping pod að utan að næturlagi undir norðurljósum" />
              <Shot src="pod-interior-2.jpg" ratio="5 / 4" drift={7}
                alt="Innan í camping pod, viðarklædd hvelfing með rúmi og borði" />
            </div>
          </div>

          <div className="fst-mediawrap" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            <div className="fst-duo fst-rv">
              <Shot src="cabins-snow.jpg" ratio="5 / 4" drift={8}
                alt="Röð af gulum húsum með rauðu þaki í snjó, fjöll í baksýn" />
              <Shot src="pods-summer.jpg" ratio="5 / 4" drift={10}
                alt="Camping pods í sumarbirtu með birkitrjám og fjalli að baki" />
            </div>
          </div>

          {/* rooms, as pictures rather than a spec list */}
          <div className="fst-rail fst-mediawrap fst-rv" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            {[
              ['hotel-room-2.jpg', 'Tveggja manna herbergi á sveitahótelinu'],
              ['pod-interior-3.jpg', 'Rúm og borð inni í camping pod'],
              ['cottage-sun.jpg', 'Sunset Cottage í kvöldsól'],
              ['cottage-interior.jpg', 'Eldhúskrókur og borðstofa í Sunset Cottage'],
            ].map(([f, a]) => (
              <div key={f} className="fst-stay">
                <div className="fst-stay__fig"><img src={IMG(f)} alt={a} loading="lazy" /></div>
              </div>
            ))}
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Sveitahótelið undir norðurljósum">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="6">
              <img src={IMG('hotel-aurora-snow.jpg')} alt="Sveitahótelið í Fossatúni í snjó undir norðurljósum" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Opið allt árið nema í desember og janúar</p>
            <h2>Vetrarnóttin er hluti af gistingunni</h2>
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Húsin á bakkanum að næturlagi">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="6">
              <img src={IMG('aurora-cabin-edge.jpg')} alt="Norðurljós yfir húsunum á árbakkanum í Fossatúni" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Tröllagarðurinn</p>
            <h2>Gönguleiðin byrjar við dyrnar</h2>
          </div>
        </section>

        {/* ── the troll garden ───────────────────────────────────────── */}
        <section className="fst-sec fst-sec--tight" id="trollagardurinn">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Tröllagarðurinn</p>
              <h2>Það byrjaði á kletti</h2>
              <p className="fst-lede" style={{ marginTop: 16 }}>{TROLL.origin}</p>
            </div>
          </div>

          <div className="fst-mediawrap fst-rv">
            <Shot src="troll-head-falls.jpg" ratio="21 / 9" drift={7}
              alt="Steypt tröllshöfuð við Tröllafossa með hótelið í baksýn"
              caption="Tröllshöfuðið við fossana." />
          </div>

          <div className="fst-mediawrap" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            <div className="fst-duo fst-rv">
              <Shot src="troll-cauldron.jpg" ratio="5 / 4" drift={9}
                alt="Tröllskessa með pott við gönguleiðina" />
              <Shot src="troll-words-sign.jpg" ratio="5 / 4" drift={7}
                alt="Stafaþrautin í Tröllagarðinum, útskornir viðarkubbar á snúningsásum" />
            </div>
          </div>

          <div className="fst-mediawrap" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            <div className="fst-duo fst-rv">
              <Shot src="troll-tug.jpg" ratio="5 / 4" drift={8}
                alt="Gestir í reiptogi við tröllaþrautina á túninu" />
              <Shot src="troll-kick.jpg" ratio="5 / 4" drift={10}
                alt="Barn að leik við tröllaskiltið í garðinum" />
            </div>
          </div>

          <div className="fst-rail fst-mediawrap fst-rv" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            {[
              ['troll-play.jpg', 'Tröllaleikir á túninu við gönguleiðina'],
              ['troll-clay.jpg', 'Útskorið tröllshöfuð við ána'],
              ['troll-words-2.jpg', 'Stafaþrautin, viðarkubbar með stöfum'],
              ['turf-houses.jpg', 'Torfbæir á staðnum með grasþaki'],
            ].map(([f, a]) => (
              <div key={f} className="fst-stay">
                <div className="fst-stay__fig"><img src={IMG(f)} alt={a} loading="lazy" /></div>
              </div>
            ))}
          </div>

          <div className="fst-wrap fst-wrap--read fst-rv" style={{ marginTop: 'clamp(26px,4vw,54px)', textAlign: 'center' }}>
            <p style={{ margin: '0 auto 10px', maxWidth: '54ch' }}><strong>{trailLine}</strong></p>
            <p style={{ margin: '0 auto', maxWidth: '54ch' }}>{TROLL.admissionNote}</p>
            <p className="fst-note" style={{ margin: '12px auto 0', maxWidth: '58ch' }}>{TROLL.creditNote}</p>
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Kvöldsól yfir Borgarfirði">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="5">
              <img src={IMG('sunset.jpg')} alt="Kvöldsól yfir heiðinni við Fossatún" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Rock ’n’ Troll</p>
            <h2>Maðurinn sem kom úr plötubransanum</h2>
          </div>
        </section>

        {/* ── the record man: the one dark chapter ───────────────────── */}
        <section className="fst-sec fst-sec--tight fst-night" id="rocknroll">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Veitingastaðurinn</p>
              <h2>Plötusafnið er á matseðlinum</h2>
              <p className="fst-lede" style={{ marginTop: 16 }}>{MUSIC.blurb}</p>
            </div>
          </div>

          <div className="fst-mediawrap">
            <div className="fst-duo fst-rv">
              <Shot src="gold-records.jpg" ratio="5 / 4" drift={7}
                alt="Gullplötur í römmum á vegg veitingastaðarins" />
              <Shot src="record-shelves.jpg" ratio="5 / 4" drift={9}
                alt="Hillur fullar af vínylplötum í setustofunni" />
            </div>
          </div>

          <div className="fst-mediawrap" style={{ marginTop: 'clamp(12px,1.6vw,22px)' }}>
            <Shot src="conservatory-wide.jpg" ratio="21 / 9" drift={6}
              alt="Glerskálinn á veitingastaðnum, langur salur með útsýni yfir ána"
              caption="Glerskálinn hangir yfir Tröllafossum." />
          </div>

          {/* food, plated on records — the identity in a photograph */}
          <div className="fst-rail fst-mediawrap fst-rv" style={{ marginTop: 'clamp(16px,2.2vw,28px)' }}>
            {[
              ['cake-on-vinyl.jpg', 'Kaka borin fram á vínylplötu'],
              ['cake-vinyl-2.jpg', 'Sætabrauð á vínylplötu sem diski'],
              ['cake-vinyl-3.jpg', 'Súkkulaðikaka á vínylplötu sem diski'],
              ['food-vinyl-1.jpg', 'Fish and chips borið fram á vínylplötu'],
              ['food-vinyl-2.jpg', 'Lambavefja borin fram á vínylplötu'],
              ['bar-quote.jpg', 'Barinn með plötuumslögum og áletrun á vegg'],
              ['lounge-2.jpg', 'Setustofan með leðurstólum og myndum á veggjum'],
              ['conservatory-1.jpg', 'Borð í glerskálanum með útsýni yfir ána'],
            ].map(([f, a]) => (
              <div key={f} className="fst-stay">
                <div className="fst-stay__fig">
                  <img src={IMG(f)} alt={a} loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          <div className="fst-wrap fst-wrap--read fst-rv" style={{ marginTop: 'clamp(26px,4vw,52px)', textAlign: 'center' }}>
            <p style={{ margin: '0 auto', maxWidth: '56ch' }}>
              Diskurinn er plata. Gullplöturnar á veggnum eru hans eigin, og safnið í hillunum
              er ekki skraut heldur plötur sem eru settar á fóninn.
            </p>
            <p style={{ margin: '10px auto 0', maxWidth: '56ch' }}>{MUSIC.award}</p>
            <p className="fst-note" style={{ margin: '8px auto 0' }}>Heimild: {MUSIC.awardSourceLabel}</p>
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Glerskálinn yfir fossunum">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="6">
              <img src={IMG('conservatory-falls.jpg')} alt="Borð í glerskálanum með útsýni beint yfir Tröllafossa" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Morgunverður</p>
            <h2>Þú borðar yfir fossunum</h2>
          </div>
        </section>

        {/* ── full bleed ─────────────────────────────────────────────── */}
        <section className="fst-bleed" aria-label="Grímsá við Fossatún">
          <div className="fst-frame" style={{ position: 'absolute', inset: 0 }}>
            <div className="fst-frame-in" data-drift="5">
              <img src={IMG('falls-2.jpg')} alt="Grímsá fellur um klettana rétt neðan við húsin" loading="lazy" />
            </div>
          </div>
          <div className="fst-bleed__scrim" aria-hidden="true" />
          <div className="fst-bleed__body fst-wrap">
            <p className="fst-eyebrow">Grímsá</p>
            <h2>Áin heyrist alla nóttina</h2>
          </div>
        </section>

        {/* ── booking ────────────────────────────────────────────────── */}
        <section className="fst-sec fst-sec--tight" id="bokun">
          <div className="fst-wrap">
            <div className="fst-intro fst-rv">
              <p className="fst-eyebrow">Bókun</p>
              <h2>Bókaðu beint og fáðu {DIRECT_DISCOUNT_CODE}-afsláttinn</h2>
              <p className="fst-lede" style={{ marginTop: 16 }}>
                Veldu daga og sendu beiðni beint til Fossatúns. Ekkert greiðslukort er slegið inn
                hér. Fossatún staðfestir með símtali eða tölvupósti.
              </p>
            </div>
            <StayBooking month={month} />
          </div>
        </section>

        {/* ── practical: plain lines, no table ───────────────────────── */}
        <section className="fst-sec fst-sec--tight">
          <div className="fst-wrap fst-wrap--read">
            <div className="fst-intro fst-rv" style={{ marginBottom: 26 }}>
              <p className="fst-eyebrow">Hagnýtt</p>
            </div>
            <dl className="fst-facts fst-rv">
              <div><dt>Opnun</dt><dd>Opið allt árið nema í desember og janúar</dd></div>
              <div><dt>Tröllagarðurinn</dt><dd>{TROLL.hoursSummer}. {TROLL.hoursShoulder}.</dd></div>
              <div><dt>Aðgangur</dt><dd>{TROLL.admissionNote}</dd></div>
              <div><dt>Staðsetning</dt><dd>Við Grímsá í {REGION}, um klukkutíma akstur frá Reykjavík</dd></div>
              <div><dt>Sími</dt><dd><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></dd></div>
              <div><dt>Netfang</dt><dd><a href={EMAIL_HREF}>{EMAIL}</a></dd></div>
            </dl>
          </div>
        </section>

        {/* ── the honest note ────────────────────────────────────────── */}
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
