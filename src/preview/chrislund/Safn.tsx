import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CONTACT, JSON_LD, SERIES_META, WORKS, arOf, seriesName, srcSet,
} from './data'
import type { Work } from './data'
import {
  BackLink, ClFoot, ClNav, CursorRing, Headline, ROUTE, Rule, SHARED_CSS,
  buildEntrance, createLenis, createRevealSweep, fluid, reduced,
} from './shared'
import type { SmoothScroller } from './shared'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('chrislund')

/* ── SAFNIÐ — the gallery page behind the exhibition wall ───────────────────
   Clicking any work on the front page lands here with that work hung on the
   stage: the photograph uncropped on an ink ground, its caption beside it,
   its siblings from the same series beneath, and then the whole catalogue.
   Clicking any thumbnail re-hangs the stage; the URL carries the selection
   (?verk=) so a single work can be sent as a link. */

function useSafnMotion(ready: boolean, root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!ready) return
    const el = root.current
    if (!el) return
    if (reduced()) {
      el.classList.add('cl-static')
      el.classList.remove('cl-pre')
      return
    }
    el.classList.add('cl-js')

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    el.querySelectorAll('.cl-rv:not(.is-in)').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add('is-in')
      io.observe(n)
    })

    const entrance = buildEntrance(el)
    const revealSweep = createRevealSweep(el)
    const sweep = () => { ScrollTrigger.update(); revealSweep.tick() }
    window.addEventListener('scroll', sweep, { passive: true })

    let lenis: SmoothScroller | null = null
    let tick: ((t: number) => void) | null = null
    let disposed = false
    createLenis().then((l) => {
      if (!l) return
      if (disposed) { l.destroy(); return }
      lenis = l
      ;(window as unknown as { __clLenis?: SmoothScroller | null }).__clLenis = l
      l.on('scroll', sweep)
      tick = (t: number) => { l.raf(t * 1000) }
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      disposed = true
      io.disconnect()
      entrance.kill()
      if (tick) gsap.ticker.remove(tick)
      window.removeEventListener('scroll', sweep)
      lenis?.destroy()
      ;(window as unknown as { __clLenis?: SmoothScroller | null }).__clLenis = null
    }
  }, [ready, root])
}

/* Both grids here are already grouped by series, so a series tag on every
   thumbnail is noise; the caption is the wall label and nothing else. Widths
   come from each photograph's own ratio (see .cl-jrow) so a row of mixed
   crops hangs at ONE height and the captions land on one line. */
function Thumb({ w, active, onPick, sizes }: {
  w: Work; active: boolean; onPick: (id: string) => void; sizes: string
}) {
  return (
    <button
      type="button"
      className={`cl-thumb ${active ? 'is-selected' : ''}`}
      style={{ '--ar': arOf(w.photo.ratio) } as React.CSSProperties}
      onClick={() => onPick(w.id)}
      data-cursor="Skoða"
      aria-label={`${w.title}, ${seriesName(w.series)}`}
      aria-current={active ? 'true' : undefined}
    >
      <span className="cl-thumb-media">
        <img src={w.photo.src} srcSet={srcSet(w.photo.src)} sizes={sizes}
          style={{ aspectRatio: w.photo.ratio }}
          alt={w.photo.alt} loading="lazy" decoding="async" />
      </span>
      <span className="cl-thumb-cap">
        <span className="cl-thumb-title">{w.title}</span>
      </span>
    </button>
  )
}

export default function ChrisLundSafnPage() {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [params, setParams] = useSearchParams()
  /* the holding class must be on the first painted frame, never set in an effect */
  const holdRef = useRef(!reduced())

  const selected = useMemo(() => {
    const id = params.get('verk')
    return WORKS.find((w) => w.id === id) ?? WORKS.find((w) => w.id === 'thoka') ?? WORKS[0]
  }, [params])

  const siblings = useMemo(
    () => WORKS.filter((w) => w.series === selected.series && w.id !== selected.id),
    [selected],
  )

  useEffect(() => {
    setThemeColor('#131311')
    document.title = `${selected.title} · Safnið · Christopher Lund`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDescription = meta.content
    meta.content = `Safn Christophers Lund: ${WORKS.length} verk úr myndaröðunum sex. ${selected.title}, úr röðinni ${seriesName(selected.series)}.`
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    setReady(true)
    return () => {
      meta.content = prevDescription
      document.documentElement.lang = prevLang
    }
    // title/description follow the selection
  }, [selected])

  useSafnMotion(ready, rootRef)

  /* land on a series when the front page's picker sent one */
  useEffect(() => {
    const rod = params.get('rod')
    if (!rod || params.get('verk')) return
    const el = document.getElementById(`rod-${rod}`)
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    // only on first mount: a rod link is an entry point, not live state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const scroller = () =>
    (window as unknown as { __clLenis?: { scrollTo: (t: number | Element, o?: object) => void } | null }).__clLenis

  const pick = (id: string) => {
    setParams({ verk: id }, { replace: false })
    const lenis = scroller()
    if (lenis && !reduced()) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' })
  }

  const jumpToSeries = (key: string) => {
    const el = document.getElementById(`rod-${key}`)
    if (!el) return
    const lenis = scroller()
    if (lenis && !reduced()) lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
  }

  /* A series with a single work (Vitni) unmounts the siblings section, so the
     next selection remounts a .cl-rv the mount-time observer never saw. Catch
     those up whenever the selection changes, or they stay clipped forever. */
  useEffect(() => {
    if (reduced()) return
    const el = rootRef.current
    if (!el) return
    const t = window.setTimeout(() => {
      el.querySelectorAll('.cl-rv:not(.is-in)').forEach((n) => {
        if (n.getBoundingClientRect().top < window.innerHeight * 1.2) n.classList.add('is-in')
      })
    }, 80)
    return () => window.clearTimeout(t)
  }, [selected])

  const idx = WORKS.findIndex((w) => w.id === selected.id)
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length]
  const next = WORKS[(idx + 1) % WORKS.length]

  return (
    <div ref={rootRef} className={`cl-root cl-safn-root ${holdRef.current ? 'cl-pre' : ''}`}>
      <style>{SHARED_CSS + CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <CursorRing />
      <ClNav home={false} />

      <main>
      {/* the stage: the chosen work hung on ink, uncropped */}
      <section className="cl-stage" aria-label="Valið verk">
        <div className="cl-stage-back">
          <BackLink light fallback={ROUTE} label="Til baka á vegginn" />
        </div>
        <div className="cl-stage-media" data-cl-enter="media">
          <figure className="cl-stage-fig" key={selected.id}>
            <img
              src={selected.photo.src} srcSet={srcSet(selected.photo.src)}
              sizes="(max-width: 991px) 100vw, 62vw"
              alt={selected.photo.alt} decoding="async" {...{ fetchpriority: 'high' }}
            />
          </figure>
        </div>
        <div className="cl-stage-rail">
          <p className="cl-stage-kicker" data-cl-enter="item">Safnið · {seriesName(selected.series)}</p>
          <Headline as="h1" key={`t-${selected.id}`} text={selected.title} size={64} floor={30} enter />
          <p className="cl-body cl-stage-note" data-cl-enter="item">{selected.note}</p>
          <dl className="cl-stage-facts" data-cl-enter="item">
            <div>
              <dt>Myndaröð</dt>
              <dd>{seriesName(selected.series)}</dd>
            </div>
            {selected.print && (
              <div>
                <dt>Prent</dt>
                <dd>Fáanleg sem FineArt prent eða til birtinga</dd>
              </div>
            )}
          </dl>
          <div className="cl-stage-ctas" data-cl-enter="item">
            <a className="cl-stage-tel" href={CONTACT.phoneHref}>Spyrja um verkið · {CONTACT.phone}</a>
          </div>
          <div className="cl-stage-steps" data-cl-enter="item" aria-label="Fletta verkum">
            <button type="button" className="cl-step" onClick={() => pick(prev.id)}>&larr; {prev.title}</button>
            <button type="button" className="cl-step cl-step-next" onClick={() => pick(next.id)}>{next.title} &rarr;</button>
          </div>
        </div>
      </section>

      {/* the same series, directly beneath the chosen work */}
      {siblings.length > 0 && (
        <section className="cl-sibl" aria-label="Svipuð verk">
          <Rule
            label="Meira úr sömu röð"
            right={(
              <button type="button" className="cl-rulehead-jump" onClick={() => jumpToSeries(selected.series)}>
                {seriesName(selected.series)}, öll röðin ({siblings.length + 1}) &darr;
              </button>
            )}
          />
          <div className="cl-jrow cl-jrow-sibl">
            {siblings.map((w) => (
              <Thumb key={w.id} w={w} active={false} onPick={pick}
                sizes="(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 34vw" />
            ))}
          </div>
        </section>
      )}

      {/* the whole catalogue, series by series */}
      <section className="cl-cat" aria-label="Allt safnið">
        <div className="cl-cat-head">
          <Rule label="Allt safnið" />
          <Headline text="Sex raðir, öll verkin." size={64} floor={28} measure={640} />
        </div>
        {SERIES_META.map((s) => {
          const works = WORKS.filter((w) => w.series === s.key)
          if (!works.length) return null
          return (
            <div key={s.key} id={`rod-${s.key}`} className="cl-cat-series">
              <div className="cl-cat-series-head cl-rv">
                <h3 className="cl-cat-series-name">{s.name}</h3>
                <span className="cl-cat-series-note">{s.note}</span>
              </div>
              <div className="cl-jrow cl-jrow-cat">
                {works.map((w) => (
                  <Thumb key={w.id} w={w} active={w.id === selected.id} onPick={pick}
                    sizes="(max-width: 700px) 92vw, (max-width: 1200px) 34vw, 25vw" />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* close: the same doorway the front page ends on */}
      <section className="cl-safn-close">
        <Headline text="Næsta mynd byrjar á símtali." size={72} floor={30} measure={720} />
        <a className="cl-safn-close-tel cl-rv" href={CONTACT.phoneHref}>822 7601</a>
      </section>

      <ClFoot />
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

const CSS = `
.cl-safn-root { background: #131311; }

/* the stage */
.cl-stage {
  display: grid; grid-template-columns: 1.6fr 1fr;
  column-gap: calc(var(--u) * 60); row-gap: calc(var(--u) * 24);
  grid-template-rows: auto 1fr;
  align-items: center; min-height: 100svh; background: #131311; color: #EFEDE7;
  padding: calc(var(--u) * 96) calc(var(--u) * 34) calc(var(--u) * 70);
}
.cl-stage-back { grid-column: 1 / -1; grid-row: 1; align-self: start; }
.cl-stage-media { grid-row: 2; }
.cl-stage-rail { grid-row: 2; }
.cl-stage-media { display: grid; place-items: center; min-height: 0; }
.cl-stage-fig { margin: 0; width: 100%; display: grid; place-items: center; }
.cl-stage-fig img {
  max-width: 100%; max-height: min(76svh, 900px); width: auto; height: auto;
  display: block; background: #1D1D1A;
  box-shadow: 0 30px 80px rgb(0 0 0 / .45);
}
.cl-js .cl-stage-fig { animation: cl-stage-in 1s cubic-bezier(.23,1,.32,1) both; }
@keyframes cl-stage-in {
  from { opacity: 0; transform: translateY(18px) scale(.985); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) { .cl-stage-fig { animation: none !important; } }
.cl-stage-kicker { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 11)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-gold); margin: 0 0 calc(var(--u) * 18); }
.cl-stage-rail .cl-headline { color: #F4F1EA; }
.cl-stage-note { color: #B9B7AE; }
.cl-stage-facts { margin: calc(var(--u) * 34) 0 0; display: grid; gap: 14px; }
.cl-stage-facts div { display: grid; grid-template-columns: minmax(88px, auto) 1fr; gap: 18px; padding-top: 12px; border-top: 1px solid rgb(239 237 231 / .16); }
.cl-stage-facts dt { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(11.5, 11)}; letter-spacing: .13em; text-transform: uppercase; color: #8F8D84; }
.cl-stage-facts dd { margin: 0; font-size: ${fluid(15, 13.5)}; color: #D9D7CE; }
.cl-stage-ctas { margin-top: calc(var(--u) * 30); }
.cl-stage-tel {
  display: inline-block; font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(14, 12.5)};
  letter-spacing: .04em; color: var(--cl-gold); text-decoration: none;
  border-bottom: 1px solid currentColor; padding-bottom: 2px;
  transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-stage-tel:hover { color: #EFEDE7; }
.cl-stage-steps { display: flex; justify-content: space-between; gap: 16px; margin-top: calc(var(--u) * 44); }
.cl-step {
  background: none; border: none; padding: 0; cursor: pointer; font-family: 'Space Mono', ui-monospace, monospace;
  font-size: ${fluid(12.5, 11.5)}; letter-spacing: .06em; color: #B9B7AE;
  transition: color .25s cubic-bezier(.16,1,.3,1); text-align: left;
}
.cl-step-next { text-align: right; }
.cl-step:hover { color: #EFEDE7; }

/* siblings + catalogue share the paper ground */
.cl-sibl { background: var(--cl-paper); padding: calc(var(--u) * 76) calc(var(--u) * 34) calc(var(--u) * 30); }

/* JUSTIFIED ROWS — the gallery-wall fix for mixed crops.
   In equal-width columns, photographs of different shapes end at different
   heights and the captions land on three different lines, which reads as an
   accident. Here every item's width is proportional to its own aspect ratio
   (basis AND grow both scale with --ar), so a row resolves to width = ar * K
   for one shared K: every photograph in the row is exactly the same height,
   every caption sits on one line, and the row is flush left and right. It
   also means a series of any length lays out with no empty cell, because
   there are no cells. */
.cl-jrow { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 30); align-items: flex-start; }
.cl-jrow .cl-thumb {
  flex-grow: var(--ar); flex-shrink: 0;
  flex-basis: calc(var(--ar) * var(--rowh));
  /* keeps a short last row from stretching one print across the page */
  max-width: calc(var(--ar) * var(--rowh) * 1.42);
}
.cl-jrow-sibl { --rowh: clamp(184px, 19vw, 292px); }
.cl-jrow-cat { --rowh: clamp(150px, 13.6vw, 208px); }

.cl-cat { background: var(--cl-paper); padding: calc(var(--u) * 90) calc(var(--u) * 34) calc(var(--u) * 60); }
.cl-cat-head { margin-bottom: calc(var(--u) * 40); }
.cl-cat-series { padding: calc(var(--u) * 30) 0 calc(var(--u) * 20); }
.cl-cat-series { scroll-margin-top: calc(var(--u) * 70 + 24px); }
.cl-cat-series-head { display: flex; align-items: baseline; gap: 18px; flex-wrap: wrap; margin-bottom: calc(var(--u) * 24); padding-top: 14px; border-top: 1px solid var(--cl-hair); }
.cl-cat-series-name { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(30, 21)}; margin: 0; }
.cl-cat-series-note { font-size: ${fluid(13.5, 12.5)}; color: var(--cl-mute); }

/* thumbnails */
.cl-thumb {
  display: block; padding: 0; margin: 0; background: none; border: none;
  text-align: left; color: inherit; cursor: pointer; font-family: inherit;
}
.cl-thumb-media { display: block; overflow: hidden; background: #E4E2DB; }
.cl-thumb-media img { width: 100%; height: auto; display: block; transition: transform .8s cubic-bezier(.23,1,.32,1); }
@media (hover: hover) and (pointer: fine) {
  .cl-thumb:hover .cl-thumb-media img { transform: scale(1.035); }
}
.cl-thumb-cap { display: block; padding-top: 10px; }
.cl-thumb-title { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(16.5, 14.5)}; transition: color .3s; }
.cl-thumb:hover .cl-thumb-title { color: var(--cl-gold-text); }

/* the jump from a work's siblings to that whole series in the catalogue */
.cl-rulehead-jump {
  background: none; border: none; padding: 0; cursor: pointer; color: var(--cl-gold-text);
  font: inherit; letter-spacing: inherit; text-transform: inherit;
  transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-rulehead-jump:hover { color: var(--cl-ink); }
.cl-thumb.is-selected .cl-thumb-media { outline: 2px solid var(--cl-gold); outline-offset: 4px; }
.cl-thumb.is-selected .cl-thumb-title::after { content: ' · valið'; font-family: 'Space Mono', ui-monospace, monospace; font-size: .72em; letter-spacing: .1em; text-transform: uppercase; color: var(--cl-gold-text); }

/* close */
.cl-safn-close { background: var(--cl-paper); text-align: center; padding: calc(var(--u) * 120) calc(var(--u) * 34) calc(var(--u) * 130); }
.cl-safn-close .cl-headline { margin-inline: auto; }
.cl-safn-close-tel {
  display: inline-block; font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(90, 40)};
  letter-spacing: -.02em; color: var(--cl-ink); text-decoration: none; margin-top: calc(var(--u) * 12);
  transition: color .3s cubic-bezier(.16,1,.3,1); font-variant-numeric: tabular-nums;
}
.cl-safn-close-tel:hover { color: var(--cl-gold-text); }

/* responsive */
@media (max-width: 991px) {
  .cl-stage {
    grid-template-columns: 1fr; grid-template-rows: auto auto auto;
    row-gap: calc(var(--u) * 26); min-height: 0; padding-top: calc(var(--u) * 84);
  }
  .cl-stage-media { grid-row: 2; }
  .cl-stage-rail { grid-row: 3; }
  .cl-stage-fig img { max-height: 62svh; }
}
/* below the point where a justified row can hold two prints, one print per
   row: two thumbnails on a phone are smaller than the work deserves */
@media (max-width: 700px) {
  .cl-jrow { gap: 26px; }
  .cl-jrow .cl-thumb { flex: 1 1 100%; max-width: none; }
}
@media (max-width: 640px) {
  .cl-stage, .cl-sibl, .cl-cat, .cl-safn-close { padding-left: 20px; padding-right: 20px; }
}
`
