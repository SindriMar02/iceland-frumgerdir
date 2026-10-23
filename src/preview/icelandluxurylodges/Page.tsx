import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import { StayBook, BOOK_STYLES, stayPrefill, RangeCal, takenFor, pickNight, fmtShort, iso, nightsBetween, type D } from './Book'
import { companyEntry } from './company'
import { REVIEW_DATA } from './reviews'
import { MapSection, HouseMap, MAP_STYLES } from './Map'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS, INSTAGRAM, FACEBOOK,
  NAV, HERO, STATEMENT, DOORS, CHAPTERS, FOURTH_KEY, REVIEWS, BOOKING, DUSK as EVENING, CROSS, STAY, ROOMS, STRIP, SCORE, JSON_LD,
} from './data'

const company = companyEntry

/* ── „Húsin við vötnin" — the houses on the lakes. ──────────────────────────
   One owner, four keys, two lakes. The page is built on THE WATERLINE:
   every estate photograph stands above its own live reflection, separated
   by a 1px seam. The reflection is real CSS (scaleY(-1) + mask + blur) and
   drifts in counter-phase with its source in the shared rAF loop, so the
   whole page reads as still water. Landing forks into full-height doors
   per house (umbrella-multi-property template), each opening a chapter.
   Engine: vanilla — ONE rAF loop, IntersectionObserver reveals, CSS sticky.
   No GSAP, no Lenis. ─────────────────────────────────────────────────────── */

/* Palette — cold water, computed contrast:
   INK #0E161D on ICE #EFF3F5 ......... 15.6:1 AAA
   DUSK #41607A on ICE ................ 5.6:1 AA (small-text safe)
   ICE on INK ......................... 15.6:1 AAA
   DUSK_SOFT large/decorative only. */
const ICE = '#EFF3F5'
const INK = '#0E161D'
const DUSK = '#41607A'

const SEEN_KEY = 'ill_seen'
const ROOT = '/preview/icelandluxurylodges'
/* round 7: the hero carries no form. Velaa, White Desert and Mont Rural put
   nothing but the photograph and the word in the hero; booking is one word in
   the bar and its own section. The sentence bar (HeroPill) stays in the code
   behind this flag in case Sindri wants it back. */
const HERO_BAR = false

/* ── responsive pictures ──────────────────────────────────────────────────
   Every photograph ships as AVIF + WebP at 800/1200/1800/2400 from
   public/icelandluxurylodges/r/ (encode-images.mjs: AVIF q72, WebP q86;
   round 6's q58 at a 1600 ceiling read soft on retina screens). A width
   above a source's own size is written at the source size, never upscaled. */
const RDIR = `${import.meta.env.BASE_URL}icelandluxurylodges/r/`
const picSrc = (src: string) => {
  const m = src.match(/\/([a-z0-9-]+)\.jpg$/i)
  if (!m) return null
  const n = m[1]
  const widths = [800, 1200, 1800, 2400]
  const set = (ext: string) => widths.map((w) => `${RDIR}${n}-${w}.${ext} ${w}w`).join(', ')
  /* no JPEG srcset: every browser that reads srcset reads WebP, so the plain
     src (the original file) is the only JPEG fallback that is ever fetched */
  return { avif: set('avif'), webp: set('webp') }
}
function Pic({ src, alt, sizes = '(orientation: portrait) 150vh, 100vw', priority = false, className }: {
  src: string; alt: string; sizes?: string; priority?: boolean; className?: string
}) {
  const s = picSrc(src)
  const img = (
    <img
      src={src} alt={alt} className={className}
      loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'sync' : 'async'}
      // @ts-expect-error React 18 types lag the attribute; the DOM takes it
      fetchpriority={priority ? 'high' : undefined}
    />
  )
  if (!s) return img
  return (
    <picture>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <source type="image/webp" srcSet={s.webp} sizes={sizes} />
      {img}
    </picture>
  )
}

/* mounts heavy media (the ambient films) only once its section is near */
function useNear<T extends HTMLElement>(ref: React.RefObject<T | null>, margin = '1800px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (reduced) return
    if ((navigator as { connection?: { saveData?: boolean } }).connection?.saveData) return
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { setNear(true); io.disconnect() }
    }, { rootMargin: `${margin} 0px` })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, near, margin])
  return near
}
/* night ends on these: INK is the night canvas, so the ink bands below the
   dusk band (fourth key, footer) melt into the page instead of sitting on it */
const NIGHT_ACC = '#9DB7CB'
const DUSK_BG = [ICE, '#C9D3DA', '#2E3E4C', INK]

/* smooth scroll. Lenis scrolls the window for real, so the drift loop's
   getBoundingClientRect reads and the frame-sequence scrubber's native
   'scroll' listener both stay correct — no extra plumbing needed. */
let pageLenis: Lenis | null = null

type DriftKind = 'img' | 'refl' | 'text' | 'x' | 'xr'
interface DriftNode { el: HTMLElement; d: number; kind: DriftKind }

/* module-scope so all frames share ONE loop (heklusyn spec) */
const driftSet = new Set<DriftNode>()
let rafId = 0
let reduced = false

function driftLoop() {
  rafId = 0
  if (!driftSet.size) return
  const vh = window.innerHeight
  /* read pass */
  const reads: { n: DriftNode; p: number; vis: boolean }[] = []
  driftSet.forEach((n) => {
    const r = n.el.getBoundingClientRect()
    const vis = r.bottom > -80 && r.top < vh + 80
    const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
    reads.push({ n, p, vis })
  })
  /* write pass */
  for (const { n, p, vis } of reads) {
    if (!vis) continue
    if (n.kind === 'x' || n.kind === 'xr') {
      /* the crossing lines part sideways, in opposite directions */
      const sx = n.kind === 'xr' ? -1 : 1
      n.el.style.transform = `translate3d(${(sx * p * n.d).toFixed(3)}%, 0, 0)`
      continue
    }
    const dir = n.kind === 'refl' ? 1 : -1
    n.el.style.transform = `translate3d(0, ${(dir * -p * n.d).toFixed(3)}%, 0)`
  }
  rafId = requestAnimationFrame(driftLoop)
}
function armDrift(el: HTMLElement | null, d: number, kind: DriftKind) {
  if (!el || reduced) return () => {}
  const node: DriftNode = { el, d, kind }
  driftSet.add(node)
  if (!rafId) rafId = requestAnimationFrame(driftLoop)
  return () => {
    driftSet.delete(node)
    el.style.transform = ''
  }
}

/* ── Full-bleed stage: the photograph, optionally alive as film ──────────
   (The mirrored-reflection strip this used to carry is gone: a flipped,
   blurred copy of a landscape photo is not a reflection, it is a smear —
   it read as a rendering fault rather than water.) ────────────────────── */
function Stage({
  src, alt, drift = 9, className = '', priority = false, videoSrc,
}: {
  src: string; alt: string; drift?: number; className?: string; priority?: boolean; videoSrc?: string
}) {
  const imgRef = useRef<HTMLDivElement>(null)
  const figRef = useRef<HTMLElement>(null)
  useEffect(() => armDrift(imgRef.current, drift, 'img'), [drift])
  const film = useNear(figRef) && !!videoSrc
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className={`ill-stage ${className}`} ref={figRef}>
      <div className="ill-stage-frame" style={{ ['--dz' as string]: `${dz}%` }}>
        <div className="ill-stage-in" ref={imgRef}>
          <Pic src={src} alt={alt} priority={priority} sizes={priority ? '(orientation: portrait) 150vh, 100vw' : '(max-width: 900px) 100vw, 60vw'} />
          {film && (
            <video
              className="ill-stage-film"
              src={videoSrc}
              poster={src}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </figure>
  )
}

/* ── Drift frame without reflection (chapter collages) ──────────────────── */
function Frame({ src, alt, drift = 10, wide = false }: { src: string; alt: string; drift?: number; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, drift, 'img'), [drift])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className={`ill-frame ${wide ? 'is-wide' : ''}`} style={{ ['--dz' as string]: `${dz}%` }}>
      <div className="ill-stage-in" ref={ref}>
        <Pic src={src} alt={alt} sizes={wide ? '(max-width: 1020px) 100vw, 58vw' : '(max-width: 640px) 100vw, (max-width: 1020px) 50vw, 29vw'} />
      </div>
    </figure>
  )
}

/* ── GUEST WORDS ──────────────────────────────────────────────────────────
   21st.dev "Design Testimonial" devices, on the night the guests describe:
   Shawn R.'s review says he watched the northern lights FROM THE HOT TUB, so
   the quotes sit on that exact deck, at night, with the aurora moving. The
   film is their own verified photograph relit — same lodge, same fire pit,
   same tub, no people — not a stock night sky.

   Class-toggled, never mount-state: every quote stays mounted and only
   `.is-on` moves. Auto-advances, and any click stops the auto-advance for
   good, because a carousel that keeps yanking itself away from a reader who
   has taken control is hostile. */
function Reviews({ only }: { only?: string } = {}) {
  const QUOTES = only ? REVIEWS.quotes.filter((q) => q.meta.startsWith(only)) : REVIEWS.quotes
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)
  const secRef = useRef<HTMLElement>(null)
  /* the aurora loop is fetched only when the section is near, never on mount */
  const film = useNear(secRef)
  const n = QUOTES.length

  useEffect(() => {
    if (reduced || held) return
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 7000)
    return () => window.clearInterval(t)
  }, [n, held])

  const go = (d: number) => { setHeld(true); setI((v) => (v + d + n) % n) }
  const cur = QUOTES[i]

  return (
    <section className="ill-rev" aria-label="Guest reviews" ref={secRef}>
      <div className="ill-rev-bed" aria-hidden="true">
        <Pic src={IMG.auroraStill} alt="" />
        {film && (
          <video className="ill-rev-film" src={IMG.auroraFilm} poster={IMG.auroraStill}
            autoPlay muted loop playsInline aria-hidden="true" />
        )}
      </div>

      <div className="ill-rev-inner">
        <span className="ill-rev-ord" aria-hidden="true" hidden>
          {QUOTES.map((q, idx) => (
            <b key={q.name} className={idx === i ? 'is-on' : ''}>{String(idx + 1).padStart(2, '0')}</b>
          ))}
        </span>

        {/* the figures come from reviews.ts, the review-sync standard shape:
            Airbnb's number rewrites itself every Monday on the live site */}
        <div className="ill-rev-scores" aria-label="Ratings">
          {REVIEW_DATA.sources.map((s) => (
            <p key={s.platform}>
              <b>{s.rating}<i>/{s.of}</i></b>
              <span>{s.count} {s.platform} reviews · {s.house}</span>
            </p>
          ))}
          <p className="ill-rev-sync"><span aria-hidden="true" />Airbnb figures update themselves every Monday</p>
        </div>

        <ul className="ill-rev-list">
          {QUOTES.map((q, idx) => (
            <li key={q.name} className={`ill-rev-q ${idx === i ? 'is-on' : ''}`} aria-hidden={idx !== i}>
              <blockquote>
                {q.text.split(' ').flatMap((w, k, all) => [
                  <span className="ill-rev-w" key={`${w}-${k}`}>
                    {/* +200ms so the words start only after the outgoing
                        quote has cleared the cell */}
                    <i style={{ transitionDelay: idx === i ? `${200 + Math.min(k, 26) * 26}ms` : '0ms' }}>{w}</i>
                  </span>,
                  ...(k < all.length - 1 ? [' '] : []),
                ])}
              </blockquote>
            </li>
          ))}
        </ul>

        <div className="ill-rev-foot">
          <p className="ill-rev-who"><i aria-hidden="true" />{cur.name} · {cur.meta}</p>
          <div className="ill-rev-nav">
            <button type="button" aria-label="Previous review" onClick={() => go(-1)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 12L6 8l4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" aria-label="Next review" onClick={() => go(1)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div className="ill-rev-rail" aria-hidden="true">
          {QUOTES.map((q, idx) => (
            <span key={q.name} className={idx === i ? 'is-on' : ''} />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── ÚLFLJÓTSSKÁLI: THE HOUSE, ROOM BY ROOM ────────────────────────────────
   An index of the lodge's spaces; pointing at (or tapping, or tabbing to) a
   name swaps the large photograph beside it. The lodge is sold on how many
   rooms it holds, so its gallery is a list of them, not a grid. */
function RoomIndex() {
  const [i, setI] = useState(0)
  return (
    <div className="ill-rooms">
      <p className="ill-rooms-h">The house, room by room</p>
      <ol className="ill-rooms-list">
        {ROOMS.map((r, k) => (
          <li key={r.name}>
            <button type="button" className={k === i ? 'is-on' : ''} aria-pressed={k === i}
              onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}>
              <span className="ill-rooms-n" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
              <span className="ill-rooms-name">{r.name}</span>
              <span className="ill-rooms-line">{r.line}</span>
            </button>
          </li>
        ))}
      </ol>
      <figure className="ill-rooms-view">
        {ROOMS.map((r, k) => (
          <img key={r.img} src={IMG[r.img]} alt={k === i ? r.alt : ''} aria-hidden={k !== i}
            className={k === i ? 'is-on' : ''} loading="lazy" decoding="async" />
        ))}
      </figure>
    </div>
  )
}

/* ── ÁSLUNDUR: THE FILMSTRIP ─────────────────────────────────────────────
   Six photographs in one full-width row: native horizontal scroll with snap
   (swipe, trackpad, keyboard), plus two arrows that step one frame. No scroll
   hijack, no pinning: the page keeps scrolling down as normal. */
function Strip({ name }: { name: string }) {
  const ref = useRef<HTMLOListElement>(null)
  const step = (d: number) => {
    const el = ref.current
    if (!el) return
    const w = (el.querySelector('li') as HTMLElement | null)?.offsetWidth ?? el.clientWidth
    el.scrollBy({ left: d * (w + 16), behavior: reduced ? 'auto' : 'smooth' })
  }
  return (
    <section className="ill-strip" aria-label={`${name} in photographs`}>
      <div className="ill-strip-head">
        <p className="ill-strip-h">{name}, frame by frame</p>
        <div className="ill-strip-nav">
          <button type="button" aria-label="Previous photograph" onClick={() => step(-1)}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 12L6 8l4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next photograph" onClick={() => step(1)}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      <ol className="ill-strip-row" ref={ref} tabIndex={0} aria-label="Photographs, scroll sideways">
        {STRIP.map((f, k) => (
          <li key={f.img}>
            <figure>
              <div className="ill-strip-img"><Pic src={IMG[f.img]} alt={f.alt} sizes="(max-width: 640px) 84vw, 83vh" /></div>
              <figcaption><span>{String(k + 1).padStart(2, '0')}</span>{f.line}</figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── ÁLFTAVÍK: ITS OWN SCORE ───────────────────────────────────────────────
   One verified number, set large on the night, counting up once when it
   arrives, with the one review that is about this house. */
function Score() {
  const ref = useRef<HTMLElement>(null)
  const [n, setN] = useState(SCORE.n)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const target = parseFloat(SCORE.n)
    setN('4.00')
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400)
        const e = 1 - Math.pow(1 - k, 3)
        setN((4 + (target - 4) * e).toFixed(2))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="ill-score" ref={ref} aria-label={`${SCORE.n} ${SCORE.of}`}>
      <p className="ill-score-n" aria-hidden="true">{n}</p>
      <p className="ill-score-of">{SCORE.of} <span>· {SCORE.tag}</span></p>
      <blockquote className="ill-score-q">{SCORE.quote}</blockquote>
      <p className="ill-score-who">{SCORE.who}</p>
    </section>
  )
}

/* ── CROSSING LINES (round 5, Grand Emily device) ─────────────────────────
   A framed photograph in the middle of the page and two lines of thin
   capitals running straight across it. One text layer in ink sits on the
   page; an identical layer in ice is clipped to exactly the photo's box, so
   each letter changes colour where it crosses the frame. The frame's inset
   and the clip are the SAME percentages, which is what keeps them aligned at
   every width. The two lines part sideways on scroll. */
function Cross({ a, b, src, alt }: { a: string; b: string; src: string; alt: string }) {
  const la = useRef<HTMLSpanElement>(null)
  const lb = useRef<HTMLSpanElement>(null)
  const la2 = useRef<HTMLSpanElement>(null)
  const lb2 = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const offs = [armDrift(la.current, 3, 'x'), armDrift(la2.current, 3, 'x'), armDrift(lb.current, 3, 'xr'), armDrift(lb2.current, 3, 'xr')]
    return () => offs.forEach((f) => f())
  }, [])
  const lines = (ra: React.RefObject<HTMLSpanElement>, rb: React.RefObject<HTMLSpanElement>) => (
    <>
      <span className="ill-cross-a" ref={ra}>{a}</span>
      <span className="ill-cross-b" ref={rb}>{b}</span>
    </>
  )
  return (
    <section className="ill-cross" aria-label={`${a} ${b}`}
      style={{ ['--cl' as string]: Math.max(a.length, b.length) }}>
      <figure className="ill-cross-frame">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </figure>
      <p className="ill-cross-type" aria-hidden="true">{lines(la, lb)}</p>
      <p className="ill-cross-type is-in" aria-hidden="true">{lines(la2, lb2)}</p>
    </section>
  )
}

/* ── THE DATES PILL (round 5): the offer on the first screen. House + guests,
   then straight to that house's own calendar with the guests carried over.
   No fake date field: the dates are chosen on the real calendar. ── */
/* ── the hero bar: House · Dates · Guests · Check availability ───────────
   Dates open the real calendar in a sheet under the bar (two months, that
   house's own taken nights); the choice travels to the house page's card. */
function HeroPill() {
  const navigate = useNavigate()
  const today = useMemo(() => iso(new Date()), [])
  const [h, setH] = useState(STAY.houses[1].id)
  const house = STAY.houses.find((x) => x.id === h)!
  const [g, setG] = useState(4)
  const [start, setStart] = useState<D | null>(null)
  const [end, setEnd] = useState<D | null>(null)
  const [hint, setHint] = useState('')
  const [open, setOpen] = useState(false)
  const [kbd, setKbd] = useState(false)
  const taken = useMemo(() => takenFor(h, today), [h, today])
  const popRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLFormElement>(null)
  const nights = start && end ? nightsBetween(start, end) : 0

  /* outside click / Escape close the sheet; pointer-open focuses the sheet
     itself, keyboard-open the first free day (focus-guard rule) */
  useEffect(() => {
    if (!open) return
    if (!kbd) popRef.current?.focus({ preventScroll: true })
    const onDoc = (e: MouseEvent) => { if (!barRef.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open, kbd])

  const tap = (d: D) => {
    const r = pickNight({ start, end }, d, taken, house.minStay, house.name)
    setStart(r.start); setEnd(r.end); setHint(r.hint)
  }
  const go = (e: React.FormEvent) => {
    e.preventDefault()
    stayPrefill.house = h
    stayPrefill.guests = Math.min(g, house.max)
    stayPrefill.start = start
    stayPrefill.end = end
    navigate(`${ROOT}/${h}#bokun`)
  }
  const dateLabel = start && end ? `${fmtShort(start)} → ${fmtShort(end)}` : start ? `${fmtShort(start)} → ?` : 'add dates'
  return (
    /* the bar reads as one sentence in the house's own serif: "A stay at
       Álftavík, 2 Nov → 5 Nov, for 4 guests" — each blank is the control */
    <form className={`ill-pill ${open ? 'is-open' : ''}`} onSubmit={go} aria-label="Check availability" ref={barRef}>
      <span className="ill-pill-w">A stay at</span>
      <label className="ill-pill-f">
        <span className="ill-sr">House</span>
        <select name="house" value={h} onChange={(e) => {
          const id = e.target.value
          setH(id); setStart(null); setEnd(null); setHint('')
          setG((v) => Math.min(v, STAY.houses.find((x) => x.id === id)!.max))
        }}>
          {STAY.houses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </label>
      <span className="ill-pill-w">,</span>
      <button type="button" className={`ill-pill-f ill-pill-d ${start ? 'has-dates' : ''}`} aria-expanded={open} aria-controls="ill-pill-pop"
        onClick={(e) => { setKbd(e.detail === 0); setOpen((v) => !v) }}>
        <span className="ill-sr">Dates</span>
        <b>{dateLabel}</b>
      </button>
      <span className="ill-pill-w">, for</span>
      <label className="ill-pill-f">
        <span className="ill-sr">Guests</span>
        <select name="guests" value={g} onChange={(e) => setG(Number(e.target.value))}>
          {Array.from({ length: house.max }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
        </select>
      </label>
      <button className="ill-pill-go" type="submit">{nights ? `Book ${nights} nights` : 'Check availability'} <i aria-hidden="true">→</i></button>

      <div className={`ill-pill-pop ${open ? 'is-open' : ''}`} id="ill-pill-pop" ref={popRef} tabIndex={-1} aria-hidden={!open}
        aria-label={`Choose nights at ${house.name}`}>
        {open && (
          <>
            <RangeCal key={h} count={2} today={today} taken={taken} start={start} end={end} onTap={tap} autoFocusFirst={kbd} />
            <div className="ill-pill-pop-foot">
              <p>{hint || (nights ? `${nights} nights at ${house.name}` : start ? 'Now choose your check-out day' : `${house.minStay}-night minimum at ${house.name}`)}</p>
              <div>
                {start && <button type="button" className="ill-sb-link" onClick={() => { setStart(null); setEnd(null); setHint('') }}>Clear</button>}
                <button type="button" className="ill-pill-pop-done" onClick={() => setOpen(false)}>Done</button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  )
}

/* ── the footer's waterline: the closing line and its reflection ───────── */
function Waterword() {
  const wRef = useRef<HTMLDivElement>(null)
  const rRef = useRef<HTMLDivElement>(null)
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    const a = armDrift(wRef.current, 5, 'text')
    return () => { a() }
  }, [])
  /* round 13 (Sindri: "water ripples in the reflection, much more elegant"): the reflection is
     water now. A horizontal turbulence field displaces it, slowly breathing (SMIL on the
     field's frequency, so no script runs per frame); reduced motion keeps it still; a browser
     without SVG filters on HTML keeps the plain mirror. */
  return (
    <div className="ill-water" aria-hidden="true">
      <svg className="ill-water-defs" width="0" height="0" focusable="false">
        <filter id="ill-ripple" x="-5%" y="-20%" width="110%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.11" numOctaves="2" seed="7" result="n">
            {!still && <animate attributeName="baseFrequency" dur="11s" values="0.006 0.11;0.008 0.13;0.006 0.11" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </svg>
      <div className="ill-water-word" ref={wRef}>Sjáumst við vatnið</div>
      <span className="ill-water-seam" />
      <div className="ill-water-refl"><div ref={rRef}>Sjáumst við vatnið</div></div>
    </div>
  )
}

/* ── Mask-reveal text helpers ───────────────────────────────────────────── */
function Rise({ as: Tag = 'div', className = '', children }: { as?: 'div' | 'h2' | 'h3' | 'p' | 'span'; className?: string; children: React.ReactNode }) {
  return (
    <Tag className={`ill-rise ${className}`}>
      <span className="ill-rise-in">{children}</span>
    </Tag>
  )
}

/* ── Preloader — real progress, Heklusýn spec ───────────────────────────── */
function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  /* load → line (the waterline draws across, the mark lets go) → open (the
     page parts along the line) → unmount */
  const [phase, setPhase] = useState<'load' | 'line' | 'open'>('load')
  const doneRef = useRef(false)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    let real = 0
    /* progress = the hero picture decoded + the fonts in, nothing else. The
       old loader counted every lazy photograph on the page, and a lazy image
       below the fold never reports complete, so it ran to its 2.4 s cap on
       every visit and the booking bar arrived five seconds in. */
    /* round 13 (Sindri: "make sure the landing page and the images load"): the curtain now also
       waits for the three doors, the first photographs a scroll reaches, so nothing arrives
       behind the reader. Doors are made eager below; capped so a slow line never strands it. */
    const ready = (img: HTMLImageElement | null) => !img || img.complete
      ? Promise.resolve()
      : new Promise<void>((r) => { img.addEventListener('load', () => r(), { once: true }); img.addEventListener('error', () => r(), { once: true }) })
    const imgs = [document.querySelector<HTMLImageElement>('.ill-hero img'), ...document.querySelectorAll<HTMLImageElement>('.ill-door img')]
    imgs.forEach((i) => { if (i && i.loading === 'lazy') i.loading = 'eager' })
    const parts: Promise<unknown>[] = [
      ...imgs.map(ready),
      'fonts' in document ? document.fonts.ready : Promise.resolve(),
    ]
    let done = 0
    parts.forEach((p) => { p.then(() => { done += 1 }) })
    const tick = () => {
      const el = performance.now() - t0
      real = Math.max(real, done / parts.length)
      const floorP = Math.min(1, el / 600)
      const capP = el / 2600
      const p = Math.min(1, Math.max(capP, Math.min(real, floorP)))
      setPct(Math.round(p * 100))
      if (p >= 1 && !doneRef.current) {
        doneRef.current = true
        window.setTimeout(() => setPhase('line'), 100)
        window.setTimeout(() => {
          setPhase('open')
          /* the hero lockup opens out of its own seam while the curtain is
             still parting, so the two seams read as one line */
          window.setTimeout(() => window.dispatchEvent(new CustomEvent('ill:revealed')), 160)
        }, 500)
        window.setTimeout(onDone, 1500)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className={`ill-loader is-${phase}`} role="status" aria-label="Loading">
      <div className="ill-loader-half is-top" aria-hidden="true" />
      <div className="ill-loader-half is-bot" aria-hidden="true" />
      <div className="ill-loader-core">
        <div className="ill-loader-mark" style={{ ['--p' as string]: `${100 - pct}%` }}>
          <span>Iceland</span>
          <span>Luxury Lodges</span>
        </div>
        <div className="ill-loader-line" aria-hidden="true" />
      </div>
      <div className="ill-loader-water" aria-hidden="true" />
    </div>
  )
}

/* ═════════════════════════════ PAGE ═════════════════════════════════════ */
/* scroll-is-one-evening helpers ([[mirrorhouse-design-system]] device 1) */
const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mixHex = (a: string, b: string, t: number) => {
  const A = hexRgb(a), B = hexRgb(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Page({ house }: { house?: string } = {}) {
  /* house mode: the same page, scoped to one house — its own hero, its own
     chapter, its own calendar, and the other houses as doors at the end */
  const HC = house ? CHAPTERS.find((c) => c.id === house) : undefined
  const HD = house ? DOORS.find((d) => d.id === house) : undefined
  /* round 6: the hero is a still. The Kling push-in loop read as poor motion
     and cost 8 MB before anything else could load; the relit terrace
     (Nano Banana 2.1, 5056px, from her own photograph) carries it alone. */
  const heroSrc = HD && HD.id !== 'alftavik' ? IMG[HD.img as keyof typeof IMG] : IMG.heroGolden
  const wm = HC && HD ? [HC.name, HC.water] : ['Iceland', 'Luxury Lodges']
  const duskRef = useRef<HTMLElement>(null)
  /* the evening loop is fetched only once the band is near */
  const eveFilm = useNear(duskRef)
  const [booted, setBooted] = useState(false)
  /* photographs within ~2 screens start loading now, not at the viewport's edge */
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return
      const img = e.target as HTMLImageElement
      img.loading = 'eager'; io.unobserve(img)
    }), { rootMargin: '1800px 0px' })
    root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [booted, house])
  const [showLoader, setShowLoader] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const seamRef = useRef<HTMLSpanElement>(null)
  const wmLRef = useRef<HTMLSpanElement>(null)
  const wmRRef = useRef<HTMLSpanElement>(null)

  /* ── THE SEAM REVEAL ([[mirrorhouse-design-system]] device 2, ported to
       vanilla). The hairline draws itself, then ICELAND opens leftward out
       of it and LUXURY LODGES rightward, with a breath of outward travel
       under the wipe so the words feel pushed out of the line rather than
       merely uncovered. Scroll then keeps parting them while the rule grows
       past them. Chains off the loader event, never a guessed delay. ── */
  useEffect(() => {
    const seam = seamRef.current
    const wmL = wmLRef.current
    const wmR = wmRRef.current
    const hero = heroRef.current
    if (!seam || !wmL || !wmR || !hero) return
    if (reduced) {
      seam.style.transform = 'scaleY(1)'
      wmL.style.clipPath = 'none'
      wmR.style.clipPath = 'none'
      return
    }
    /* resting (pre-reveal) state */
    seam.style.transform = 'scaleY(0)'
    wmL.style.clipPath = 'inset(0% 0% 0% 100%)'
    wmR.style.clipPath = 'inset(0% 100% 0% 0%)'

    /* JS is the SINGLE writer of transform on all three nodes. The reveal
       transitions it, then hands ownership to the scroll driver — a CSS
       var-based transform alongside an inline one silently loses. */
    let revealDone = false
    const open = () => {
      seam.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'
      seam.style.transform = 'scaleY(1)'
      window.setTimeout(() => {
        for (const [el, from] of [[wmL, 26], [wmR, -26]] as const) {
          el.style.transition = 'clip-path 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1)'
          el.style.transform = `translateX(${from}px)`
          requestAnimationFrame(() => {
            el.style.clipPath = 'inset(0% 0% 0% 0%)'
            el.style.transform = 'translateX(0px)'
          })
        }
        /* release the transitions so the scroll driver writes land instantly */
        window.setTimeout(() => {
          revealDone = true
          seam.style.transition = ''
          wmL.style.transition = ''
          wmR.style.transition = ''
          /* the reveal is over: drop the clip so nothing can be shaved */
          wmL.style.clipPath = 'none'
          wmR.style.clipPath = 'none'
          onScroll()
        }, 1150)
      }, 300)
    }
    window.addEventListener('ill:revealed', open, { once: true })

    /* scroll keeps parting the halves; the seam grows past them and fades */
    let raf = 0
    function onScroll() {
      if (raf || !revealDone) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = hero!.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)))
        wmL!.style.transform = `translateX(${(-14 * p).toFixed(2)}%)`
        wmR!.style.transform = `translateX(${(14 * p).toFixed(2)}%)`
        wmL!.style.opacity = wmR!.style.opacity = `${(1 - p * 0.92).toFixed(3)}`
        seam!.style.transform = `scaleY(${(1 + p * 2.4).toFixed(3)})`
        seam!.style.opacity = `${(1 - p).toFixed(3)}`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('ill:revealed', open)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    /* mount-once: re-running this on `booted` would re-arm the hidden resting
       state AFTER the reveal had already played, blanking the wordmark. */
  }, [])

  /* boot: loader decision + reveal wiring */
  useEffect(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setThemeColor(ICE)
    document.title = HC && HD
      ? `${HC.name} — ${HD.kind.replace(/^The /, 'the ')} ${HC.water} · Iceland Luxury Lodges`
      : 'Iceland Luxury Lodges — Four private houses on the lakes of the Golden Circle'
    const forced = new URLSearchParams(window.location.search).has('loader')
    let seen = false
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1' } catch { seen = true }
    if (!reduced && (forced || !seen)) {
      setShowLoader(true)
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    } else {
      setBooted(true)
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('ill:revealed')), 60)
    }
    /* HC/HD come from the house prop, and House.tsx keys the page by house,
       so they cannot change inside one mount */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* reveals: IO arms .is-on; resting CSS state is the visible one without .js */
  /* ── smooth scroll ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    pageLenis = lenis
    let id = requestAnimationFrame(function raf(t: number) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(id); lenis.destroy(); pageLenis = null }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.add('js')
    if (reduced) { root.classList.add('reduced'); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-on'); io.unobserve(en.target) }
      }),
      { threshold: 0.22 },
    )
    root.querySelectorAll('.ill-rise, .ill-rule, .ill-door, .ill-fact, .ill-amen li, .ill-frame, .ill-map-stage').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [booted])

  /* hero words chain off the loader event, never a guessed delay */
  useEffect(() => {
    const onReveal = () => rootRef.current?.classList.add('is-revealed')
    window.addEventListener('ill:revealed', onReveal)
    return () => window.removeEventListener('ill:revealed', onReveal)
  }, [])

  /* ── ONE EVENING. The page is day until the dusk band, and the band turns
       it to night: canvas ICE → blue-grey → blue hour → INK, the ink flips
       to ice only once the band covers the whole viewport (so no paragraph
       ever sits on the mid-grey crossover), stars come out, then the band's
       own line arrives. ONE writer: three vars on the route root, every
       section inherits. Reverses on the way back up. ── */
  useEffect(() => {
    const root = rootRef.current
    const band = duskRef.current
    if (!root || !band) return
    let raf = 0
    let night = false
    const write = () => {
      raf = 0
      const r = band.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / Math.max(1, r.height)))
      const q = smooth(0.5, 0.9, p)
      const seg = Math.min(2, Math.floor(q * 3))
      root.style.setProperty('--bg', mixHex(DUSK_BG[seg], DUSK_BG[seg + 1], q * 3 - seg))
      const f = smooth(0.7, 0.8, p)
      root.style.setProperty('--fg', mixHex(INK, ICE, f))
      root.style.setProperty('--acc', mixHex(DUSK, NIGHT_ACC, f))
      root.style.setProperty('--dn', smooth(0.52, 0.82, p).toFixed(3))
      root.style.setProperty('--nt', smooth(0.8, 0.95, p).toFixed(3))
      if ((f > 0.5) !== night) {
        night = f > 0.5
        root.classList.toggle('is-night', night)
        setThemeColor(night ? INK : ICE)
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(write) }
    write()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* nav: smooth anchor scroll (native; no Lenis on this page) */
  /* the nav swaps register at the foot of the hero instead of inverting */
  useEffect(() => {
    const nav = rootRef.current?.querySelector('.ill-nav')
    const hero = heroRef.current
    if (!nav || !hero) return
    const io = new IntersectionObserver(
      ([en]) => nav.classList.toggle('is-past', !en.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    /* Lenis reverts native scrollIntoView on the next frame — route through it */
    if (pageLenis) pageLenis.scrollTo(el, { offset: -10 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const [menuOpen, setMenuOpen] = useState(false)

  /* house names are pages now, not anchors */
  type NavItem = { label: string; anchor?: string; to?: string }
  const navItems: NavItem[] = house
    ? [
        { label: 'All houses', to: ROOT },
        ...DOORS.filter((d) => d.id !== house).map((d) => ({ label: d.name, to: `${ROOT}/${d.id}` })),
        { label: 'Book', anchor: 'bokun' },
      ]
    : NAV.map((n) => (DOORS.some((d) => d.id === n.id)
      ? { label: n.label, to: `${ROOT}/${n.id}` }
      : { label: n.label, anchor: n.id }))
  const navLink = (n: NavItem, extra: { style?: React.CSSProperties; after?: () => void } = {}) => (n.to
    ? <Link key={n.label} to={n.to} style={extra.style} onClick={() => extra.after?.()}>{n.label}</Link>
    : <a key={n.label} href={`#${n.anchor}`} style={extra.style} className={n.anchor === 'bokun' ? 'is-book' : undefined}
        onClick={(e) => { extra.after?.(); goTo(n.anchor!)(e) }}>{n.label}</a>)

  const doorList = house ? DOORS.filter((d) => d.id !== house) : DOORS
  const doors = (
    <section className={`ill-doors ${doorList.length === 2 ? 'is-two' : ''}`} id={house ? undefined : 'husin'}
      aria-label={house ? 'The other houses' : 'The houses'}>
      {doorList.map((d, i) => (
        <Link className="ill-door" key={d.id} to={`${ROOT}/${d.id}`} style={{ transitionDelay: `${i * 90}ms` }}>
          <div className="ill-door-media">
            <Pic src={IMG[d.img as keyof typeof IMG]} alt={d.alt} sizes="(max-width: 900px) 96vh, 140vh" />
          </div>
          <div className="ill-door-copy">
            <span className="ill-door-kind">{d.kind}</span>
            <span className="ill-door-name">{d.name}</span>
            <span className="ill-door-sleeps">{d.sleeps}</span>
            <span className="ill-door-go">See the house <i aria-hidden="true">→</i></span>
          </div>
        </Link>
      ))}
    </section>
  )

  return (
    <div className="ill-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES + BOOK_STYLES + MAP_STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {showLoader && !booted && <Preloader onDone={() => setBooted(true)} />}

      {/* ── chrome ── */}
      <header className="ill-nav">
        {house
          ? <Link className="ill-nav-mark" to={ROOT}><span>Iceland</span> <span>Luxury Lodges</span></Link>
          : <a className="ill-nav-mark" href="#top" onClick={goTo('top')}><span>Iceland</span> <span>Luxury Lodges</span></a>}
        <nav className="ill-nav-links" aria-label="Sections">
          {navItems.map((n) => navLink(n))}
        </nav>
        <button
          className={`ill-burger ${menuOpen ? 'is-x' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <i /><i />
        </button>
      </header>
      <div className={`ill-sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {navItems.map((n, i) => navLink(n, { style: { transitionDelay: `${80 + i * 55}ms` }, after: () => setMenuOpen(false) }))}
      </div>

      <main id="top">
        {/* ── HERO: the seam-reveal lockup over the living terrace ──
             ICELAND | LUXURY LODGES parted by a hairline (mirrorhouse spec). */}
        <section className="ill-hero" ref={heroRef}>
          <Stage src={heroSrc} alt={HD && HD.id !== 'alftavik' ? HD.alt : 'The infinity pool on the terrace above the lake, mountains across the water'} drift={7} className="is-hero" priority />
          <h1 className={`ill-wordmark ${house ? 'is-house' : ''}`} aria-label={house ? `${wm[0]}, ${wm[1]}` : HERO.word}>
            <span className="ill-wm-word ill-wm-l" ref={wmLRef}>{wm[0]}</span>
            <span className="ill-wm-seam" aria-hidden="true" ref={seamRef} />
            <span className="ill-wm-word ill-wm-r" ref={wmRRef}>{wm[1]}</span>
          </h1>
          <p className={`ill-hero-sub ${house || !HERO_BAR ? '' : 'has-pill'}`}>
            <span className="ill-hero-sub-in">{HD ? `${HD.kind} · ${HD.sleeps.toLowerCase()} · Iceland Luxury Lodges` : HERO.sub}</span>
          </p>
          {!house && HERO_BAR && <div className="ill-pill-wrap"><HeroPill /></div>}
          {!house && !HERO_BAR && (
            <a className="ill-hero-go" href="#bokun" onClick={goTo('bokun')}>Check dates <i aria-hidden="true">→</i></a>
          )}
        </section>

        {!house && (
          <>
            {/* ── statement ── */}
            <section className="ill-statement">
              <Rise as="h2" className="ill-statement-lead">{STATEMENT.lead}</Rise>
              <Rise as="p" className="ill-statement-body">{STATEMENT.body}</Rise>
            </section>

            {/* ── THE FORK: doors, each opening the house's own page ── */}
            {doors}
          </>
        )}

        {/* ── chapters ── */}
        {HC && HD && (
          /* ── the house's line under its hero: what it is, how many, from
               what, and its own verified score (room-detail top line) ── */
          <div className="ill-hp-strip" aria-label={`${HC.name} at a glance`}>
            <span>{HD.kind}</span>
            <span>{HD.sleeps}</span>
            <span>from {STAY.currency}{STAY.houses.find((x) => x.id === HC.id)!.rate.toLocaleString('en-GB')} a night</span>
            {HC.chip ? <span>{HC.chip.score} · {HC.chip.source.split(',')[0]}</span> : <span>{HC.water}</span>}
            <a href="#bokun" onClick={goTo('bokun')} className="ill-hp-strip-go">Check dates <i aria-hidden="true">→</i></a>
          </div>
        )}

        {HC && (
          /* ── HOUSE PAGE: copy and photographs on the left, the house's own
               calendar in a sticky card on the right (room-detail pattern) ── */
          <section className="ill-chapter is-house" id={HC.id}>
            <header className="ill-chapter-head">
              <div className="ill-chapter-ord" aria-hidden="true">{HC.ord}</div>
              <div>
                <Rise as="h2" className="ill-chapter-name">{HC.name}</Rise>
                <Rise as="p" className="ill-chapter-water">{HC.water}</Rise>
              </div>
            </header>
            <div className="ill-hp-grid">
              <div className="ill-hp-main">
                <div className="ill-hp-copy">
                  <Rise as="h3" className="ill-chapter-lead">{HC.lead}</Rise>
                  <Rise as="p" className="ill-chapter-body">{HC.body}</Rise>
                  <div className="ill-facts" role="list">
                    {HC.facts.map((f) => (
                      <div className="ill-fact" role="listitem" key={f.l}>
                        <span className="ill-fact-n">{f.n}</span>
                        <span className="ill-fact-l">{f.l}</span>
                      </div>
                    ))}
                  </div>
                  <ul className="ill-amen">
                    {HC.amenities.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              </div>
              <aside className="ill-hp-card" id="bokun" aria-label={`Book ${HC.name}`}>
                <div className="ill-hp-card-head">
                  <p><b>{STAY.currency}{STAY.houses.find((x) => x.id === HC.id)!.rate.toLocaleString('en-GB')}</b> a night</p>
                  {HC.chip && <p className="ill-hp-card-score">{HC.chip.score}</p>}
                </div>
                <StayBook initial={HC.id} compact />
              </aside>
            </div>
            {/* the house in pictures runs the full width under the copy and
                the card, so the room index and the photographs get the room
                they need instead of the copy column's 540px */}
            <div className="ill-hp-below">
              <HouseMap id={HC.id} />
              {HC.id === 'ulfljotsskali' ? <RoomIndex />
                : HC.id === 'aslundur' ? null
                : (
                  <div className="ill-chapter-photos is-house">
                    {HC.photos.map((p) => (
                      <Frame key={p.img} src={IMG[p.img]} alt={p.alt} wide={p.wide} drift={p.wide ? 12 : 9} />
                    ))}
                  </div>
                )}
            </div>
          </section>
        )}

        {HC?.id === 'aslundur' && <Strip name={HC.name} />}

        {HC && CROSS[HC.id] && (
          <Cross a={CROSS[HC.id].a} b={CROSS[HC.id].b} src={IMG[CROSS[HC.id].img]} alt={CROSS[HC.id].alt} />
        )}

        {!HC && CHAPTERS.map((c, ci) => (
          <section className={`ill-chapter ${ci % 2 ? 'is-alt' : ''}`} id={c.id} key={c.id}>
            <header className="ill-chapter-head">
              <div className="ill-chapter-ord" aria-hidden="true">{c.ord}</div>
              <div>
                <Rise as="h2" className="ill-chapter-name">{c.name}</Rise>
                <Rise as="p" className="ill-chapter-water">{c.water}</Rise>
              </div>
            </header>
            <div className="ill-chapter-grid">
              <div className="ill-chapter-copy">
                <Rise as="h3" className="ill-chapter-lead">{c.lead}</Rise>
                <Rise as="p" className="ill-chapter-body">{c.body}</Rise>
                <div className="ill-facts" role="list">
                  {c.facts.map((f) => (
                    <div className="ill-fact" role="listitem" key={f.l}>
                      <span className="ill-fact-n">{f.n}</span>
                      <span className="ill-fact-l">{f.l}</span>
                    </div>
                  ))}
                </div>
                <ul className="ill-amen">
                  {c.amenities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                {c.chip && (
                  <p className="ill-chip">
                    <strong>{c.chip.score}</strong>
                    <span>{c.chip.source}</span>
                  </p>
                )}
                <Link className="ill-chapter-go" to={`${ROOT}/${c.id}`}>
                  {c.name}: dates and booking <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="ill-chapter-photos">
                {c.photos.map((p) => (
                  <Frame key={p.img} src={IMG[p.img]} alt={p.alt} wide={p.wide} drift={p.wide ? 12 : 9} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── the lakes: the collection on one map, between the chapters
              and the evening (round 7) ── */}
        {!house && <MapSection />}

        {/* ── the evening: the band that turns the page from day to night.
              It is Álftavík's own terrace, so it belongs to the landing and to
              Álftavík only; the other houses end on their own sections. ── */}
        {(!house || house === 'alftavik') && <section className="ill-dusk" ref={duskRef} aria-labelledby="ill-dusk-h">
          {/* the opening shot again, later the same day: her terrace at blue
              hour, crossfading to the same frame under the aurora. The page
              canvas turns to night BEHIND the photograph, so no text ever
              sits on a mid-grey crossover. */}
          <div className="ill-dusk-stage" aria-hidden="true">
            <Pic className="ill-dusk-a" src={IMG.eveBlue} alt="" />
            <div className="ill-dusk-b">
              <Pic src={IMG.eveNight} alt="" />
              {eveFilm && <video src={IMG.eveFilm} poster={IMG.eveNight} autoPlay muted loop playsInline />}
            </div>
          </div>
          <div className="ill-dusk-in">
            <p className="ill-dusk-eye">{EVENING.eyebrow}</p>
            <h2 className="ill-dusk-h" id="ill-dusk-h">{EVENING.title}</h2>
            <p className="ill-dusk-p">{EVENING.body}</p>
          </div>
        </section>}

        {/* ── fourth key: no photograph of it exists, so it is set as type on
              its own band rather than pretending to be an image tile ── */}
        {!house && <section className="ill-fourth" id="apartment">
          <div className="ill-fourth-card">
            <span className="ill-fourth-rule" aria-hidden="true" />
            <Rise as="p" className="ill-fourth-place">{FOURTH_KEY.place}</Rise>
            <Rise as="h2" className="ill-fourth-name">{FOURTH_KEY.name}</Rise>
            <Rise as="p" className="ill-fourth-body">{FOURTH_KEY.body}</Rise>
            <p className="ill-fourth-meta">Reykjavík · 64°09′N 21°57′W · the nights before and after the lake</p>
            <a className="ill-fourth-go" href={`${EMAIL_HREF}?subject=${encodeURIComponent('The Reykjavík apartment')}`}>Ask about the apartment <i aria-hidden="true">→</i></a>
          </div>
        </section>}

        {/* ── guest words: the collection's on the landing, Úlfljótsskáli's own
              on its page (every Vrbo review is about that house), Álftavík's
              single verified score on its page, none invented for Áslundur ── */}
        {!house && <Reviews />}
        {house === 'ulfljotsskali' && <Reviews only="Úlfljótsskáli" />}
        {house === 'alftavik' && <Score />}

        {/* ── request-to-book (house pages book in their sticky card) ── */}
        {!house && (
          <section className="ill-book" id="bokun">
            <div className="ill-book-copy">
              <Rise as="h2">{BOOKING.title}</Rise>
              <Rise as="p">{BOOKING.body}</Rise>
            </div>
            <StayBook />
          </section>
        )}

        {house && (
          <>
            <p className="ill-others-h">The other houses</p>
            {doors}
          </>
        )}

        {/* ── footer ── */}
        {/* ── footer (round 6b): the collection's own closing. A four-column
              index on one hairline, then the signature: the closing line
              standing above its own live reflection, parted by the waterline,
              the two drifting in counter-phase like the estate photographs. ── */}
        <footer className="ill-footer">
          <div className="ill-footer-top">
            <div className="ill-footer-brand">
              {house
                ? <Link className="ill-footer-mark" to={ROOT}><span>Iceland</span> <span>Luxury Lodges</span></Link>
                : <a className="ill-footer-mark" href="#top" onClick={goTo('top')}><span>Iceland</span> <span>Luxury Lodges</span></a>}
              <p>{HERO.sub}</p>
              <p className="ill-footer-addr">{ADDRESS}</p>
            </div>
            <nav className="ill-footer-col" aria-label="The houses">
              <h3>The houses</h3>
              <ul>
                {DOORS.map((d) => <li key={d.id}><Link to={`${ROOT}/${d.id}`}>{d.name}</Link></li>)}
                <li><Link to={`${ROOT}#apartment`}>{FOURTH_KEY.place}: the apartment</Link></li>
              </ul>
            </nav>
            <div className="ill-footer-col">
              <h3>Contact</h3>
              <ul>
                <li><a href={EMAIL_HREF}>{EMAIL}</a></li>
                <li><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></li>
              </ul>
            </div>
            <div className="ill-footer-col">
              <h3>Follow</h3>
              <ul>
                <li><a href={INSTAGRAM} rel="noreferrer" target="_blank">Instagram</a></li>
                <li><a href={FACEBOOK} rel="noreferrer" target="_blank">Facebook</a></li>
              </ul>
              <a className="ill-footer-book" href="#bokun" onClick={goTo('bokun')}>Book a house <i aria-hidden="true">→</i></a>
            </div>
          </div>
          <Waterword />
          <div className="ill-footer-base">
            <span>© {new Date().getFullYear()} Luxuria ehf. · Iceland Luxury Lodges</span>
            <span>Úlfljótsvatn · Álftavatn · Reykjavík · <Link to={`${ROOT}/gestir`}>Guests</Link></span>
          </div>
          <PreviewFooter company={company} />
        </footer>
      </main>
      <PreviewChrome company={company} />
    </div>
  )
}

/* ═════════════════════════════ STYLES ═══════════════════════════════════ */
const STYLES = `
@font-face{font-family:'SentientIll';src:url('${import.meta.env.BASE_URL}fonts/sentient/Sentient-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SentientIll';src:url('${import.meta.env.BASE_URL}fonts/sentient/Sentient-LightItalic.woff2') format('woff2');font-weight:300;font-style:italic;font-display:swap}
@font-face{font-family:'SentientIll';src:url('${import.meta.env.BASE_URL}fonts/sentient/Sentient-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

.ill-root{
  --ice:${ICE}; --ink:${INK}; --dusk:${DUSK};
  /* --bg/--fg/--acc are the evening: the dusk band's scrub rewrites them, and
     every token that tints text or hairlines derives from --fg */
  --bg:${ICE}; --fg:${INK}; --acc:${DUSK};
  --ink-soft:color-mix(in srgb,var(--fg) 78%,transparent); --ink-mute:color-mix(in srgb,var(--fg) 62%,transparent);
  --ice-soft:rgba(239,243,245,.85); --ice-mute:rgba(239,243,245,.6);
  --hair:color-mix(in srgb,var(--fg) 15%,transparent); --hair-ice:rgba(239,243,245,.2);
  --serif:'SentientIll','Cormorant Garamond',Georgia,serif;
  --sans:'SwitzerIll','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.22,.9,.28,1);
  background:var(--bg); color:var(--fg);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
}
.ill-root *{box-sizing:border-box;margin:0}
/* the serif is Sentient Light everywhere; its regular cut is for small sizes only */
.ill-root h1,.ill-root h2,.ill-root h3{font-weight:300}
.ill-root img{display:block;width:100%;height:100%;object-fit:cover}
.ill-root picture{display:contents}
.ill-root a{color:inherit;text-decoration:none}
.ill-root :focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.ill-root.is-night{color-scheme:dark}
.ill-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}

/* ── loader ── */
/* the loader is two ICE halves that part along a full-width waterline */
.ill-loader{position:fixed;inset:0;z-index:80;display:grid;place-content:center;text-align:center}
.ill-loader.is-open{pointer-events:none}
.ill-loader-half{position:fixed;left:0;right:0;background:var(--ice);transition:transform 1s cubic-bezier(.76,0,.24,1)}
.ill-loader-half.is-top{top:0;bottom:calc(50% - 1px)}
.ill-loader-half.is-bot{top:calc(50% - 1px);bottom:0}
.ill-loader.is-open .ill-loader-half.is-top{transform:translateY(-101%)}
.ill-loader.is-open .ill-loader-half.is-bot{transform:translateY(101%)}
.ill-loader-core{position:relative;z-index:1;display:grid;gap:18px;
  transition:opacity .5s var(--e),transform .7s var(--e),filter .5s var(--e)}
.ill-loader.is-line .ill-loader-core,.ill-loader.is-open .ill-loader-core{opacity:0;transform:scale(.97);filter:blur(6px)}
.ill-loader-water{position:fixed;left:0;right:0;top:calc(50% - .5px);height:1px;z-index:2;background:var(--ink);
  transform:scaleX(0);transition:transform .6s cubic-bezier(.65,0,.35,1),opacity .5s var(--e) .35s}
.ill-loader.is-line .ill-loader-water{transform:scaleX(1)}
.ill-loader.is-open .ill-loader-water{transform:scaleX(1);opacity:0}
.ill-loader-mark{font-family:var(--serif);font-size:clamp(1.6rem,4.6vw,3rem);line-height:1.14;letter-spacing:.01em;display:grid;
  background:linear-gradient(90deg,var(--ink) 50%,rgba(14,22,29,.22) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ill-loader-line{width:88px;height:1px;background:var(--hair);margin:0 auto;position:relative;overflow:hidden}
.ill-loader-line::after{content:'';position:absolute;inset:0;background:var(--dusk);transform-origin:left;animation:ill-sweep 1.2s var(--e) infinite}
@keyframes ill-sweep{0%{transform:scaleX(0)}55%{transform:scaleX(1);transform-origin:left}56%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}

/* ── nav ── */
.ill-nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:clamp(14px,2.4vw,24px) clamp(18px,3.4vw,44px);color:#F5F8F9;
  transition:color .45s var(--e),background-color .45s var(--e),backdrop-filter .45s var(--e)}
/* over the hero photo: solid light on a soft scrim. Past it: the page's own
   ink on a quiet blurred surface. NEVER mix-blend-difference — over a bright
   mid-tone photograph it inverts to muddy olive/brown instead of reading as
   chrome. */
.ill-nav::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;
  inset:0 0 -64px 0;
  background:linear-gradient(to bottom,rgba(8,13,18,.72) 0%,rgba(8,13,18,.42) 55%,transparent);
  opacity:1;transition:opacity .45s var(--e)}
.ill-nav:not(.is-past){text-shadow:0 1px 16px rgba(6,11,16,.6)}
/* chrome never scrubs: it holds the day palette, then snaps to night with the
   .is-night flag, so it is never mid-grey on mid-grey during the crossover */
.ill-root.is-night .ill-nav.is-past{color:var(--ice);background:rgba(14,22,29,.86)}
.ill-nav.is-past{color:var(--ink);background:rgba(239,243,245,.86);backdrop-filter:blur(10px);
  box-shadow:0 1px 0 var(--hair)}
.ill-nav.is-past::before{opacity:0}
.ill-nav-mark{font-family:var(--serif);font-size:1.02rem;letter-spacing:.02em;display:flex;gap:.4em}
.ill-nav-links{display:flex;align-items:center;gap:clamp(14px,2vw,26px);font-size:.84rem;font-weight:500;letter-spacing:.04em}
.ill-nav-links a{position:relative;opacity:.92;transition:opacity .3s var(--e)}
.ill-nav-links a.is-book{padding:7px 15px;box-shadow:inset 0 0 0 1px currentColor;opacity:1;margin-left:6px;
  transition:background-color .3s var(--e),color .3s var(--e)}
.ill-nav-links a.is-book::after{display:none}
@media (hover:hover) and (pointer:fine){
  .ill-nav-links a.is-book:hover{background:rgba(246,249,250,.16)}
  .ill-nav.is-past .ill-nav-links a.is-book:hover{background:var(--fg);color:var(--bg)}
}
.ill-nav-links a::after{content:'';position:absolute;left:0;right:0;bottom:-5px;height:1px;background:currentColor;
  transform:scaleX(0);transform-origin:right;transition:transform .32s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-nav-links a:hover{opacity:1}
  .ill-nav-links a:hover::after{transform:scaleX(1);transform-origin:left}
}
.ill-burger{display:none;width:44px;height:44px;position:relative}
/* The bars close to the X on transform alone. They used to animate top from
   18/26px to 22px as well, which is a layout property on a control that is
   tapped on every mobile visit; translateY(±4px) reaches the same centre. */
.ill-burger i{position:absolute;left:11px;right:11px;height:1.5px;background:currentColor;transition:transform .25s var(--e)}
.ill-burger i:first-child{top:18px}
.ill-burger i:last-child{top:26px}
.ill-burger.is-x i:first-child{transform:translateY(4px) rotate(45deg)}
.ill-burger.is-x i:last-child{transform:translateY(-4px) rotate(-45deg)}
.ill-root.is-night .ill-sheet{background:var(--ink);color:var(--ice)}
.ill-sheet{position:fixed;inset:0;z-index:55;background:var(--ice);color:var(--ink);display:grid;place-content:center;gap:2px;text-align:center;
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .5s var(--e),visibility 0s linear .5s}
.ill-sheet.is-open{opacity:1;visibility:visible;pointer-events:auto;
  transition:opacity .5s var(--e),visibility 0s linear 0s}
.ill-sheet a{font-family:var(--serif);font-size:clamp(1.7rem,7vw,2.6rem);padding:.34em .2em;opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e);text-transform:uppercase;letter-spacing:.16em}
.ill-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ill-nav-links{display:none}.ill-burger{display:block}}

/* ── full-bleed stage ── */
.ill-stage{position:relative}
.ill-stage-frame{position:relative;overflow:hidden;height:100%}
.ill-stage-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.ill-stage-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

/* ── hero: seam-reveal lockup over the living terrace ── */
.ill-hero{position:relative;min-height:100svh;display:grid}
.ill-hero .ill-stage.is-hero{position:absolute;inset:0}
.js:not(.reduced) .ill-hero .ill-stage.is-hero .ill-stage-frame{transform:scale(1.07);transition:transform 2.4s cubic-bezier(.16,1,.3,1)}
.js:not(.reduced).is-revealed .ill-hero .ill-stage.is-hero .ill-stage-frame{transform:none}
/* the difference-blend wordmark needs a calmer, darker ground to read against
   a busy mid-tone photograph (mirrorhouse ran its hero at saturate(.78)) */
.ill-hero .ill-stage.is-hero img,.ill-hero .ill-stage.is-hero video{filter:saturate(.94) brightness(.9)}
.ill-hero .ill-stage.is-hero::after{content:'';position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(120% 62% at 50% 50%,rgba(14,22,29,.46) 0%,rgba(14,22,29,.16) 55%,transparent 78%),
    linear-gradient(200deg,transparent 40%,rgba(14,22,29,.5) 100%)}
/* ICELAND | LUXURY LODGES, mirrored about a hairline (mirrorhouse spec) */
/* round 7 (Sindri: "things not centred"): the LOCKUP is centred as one block,
   so its visual middle sits on the page axis with the line and the bar below;
   the seam falls where the two words meet, a little left of centre, which is
   where the eye expects it. (6b had the seam on the axis, which left the long
   right-hand word hanging and read right-heavy.) */
.ill-wordmark{position:absolute;inset:0;z-index:3;display:grid;grid-template-columns:auto auto auto;justify-content:center;align-items:center;
  margin:0;padding:0 clamp(16px,3vw,40px);pointer-events:none;color:#F6F9FA;text-shadow:0 2px 30px rgba(14,22,29,.45);
  font-family:var(--serif);font-size:clamp(30px,6.1vw,96px);line-height:1.02;font-weight:300;letter-spacing:-.005em;
  transform:translateY(-.3em)}
.ill-wordmark.is-house{font-size:clamp(28px,5vw,80px)}
/* the clip box must hold accents (Ú Á) and descenders (the j in Úlfljóts-):
   the line box at line-height 1.02 does not, so pad it and pull it back */
.ill-wm-word{display:block;white-space:nowrap;letter-spacing:.02em;will-change:clip-path,transform;
  padding-top:.22em;padding-bottom:.26em;margin-top:-.22em;margin-bottom:-.26em}
.ill-wm-l{padding-right:.32em;text-align:right}
.ill-wm-r{padding-left:.32em;text-align:left}
.ill-wm-seam{flex:none;width:1px;height:.94em;background:currentColor;opacity:.85;transform-origin:50% 50%}
.ill-hero-sub{position:absolute;left:0;right:0;top:calc(50% + clamp(30px,4.2vw,66px));z-index:3;text-align:center;padding:0 20px;overflow:hidden}
.ill-hero-sub.has-pill{top:calc(50% + clamp(30px,4.2vw,66px))}
/* ── the booking bar (round 6b): one sentence in the house's serif, on an
      ice slab resting on the hero's bottom edge. "A stay at Álftavík, add
      dates, for 4 guests" — every blank is a control, underlined by its own
      hairline, and the one ink button on the page ends the line. ── */
.ill-pill-wrap{position:absolute;left:0;right:0;bottom:0;z-index:4;display:flex;justify-content:center;padding:0 16px;
  transform:translateY(50%);opacity:0;transition:opacity .8s var(--e) .5s}
.is-revealed .ill-pill-wrap{opacity:1}
.ill-pill{display:flex;flex-wrap:wrap;align-items:center;gap:6px 0;width:min(100%,1040px);color:var(--ink);background:var(--ice);
  padding:22px clamp(22px,3vw,40px);font-family:var(--serif);font-weight:300;font-size:clamp(1.15rem,1.8vw,1.55rem);line-height:1.3;
  box-shadow:0 34px 60px -34px rgba(14,22,29,.55);
  transform:translateY(12px);transition:transform .8s var(--e) .5s}
.is-revealed .ill-pill{transform:none}
.ill-pill-w{color:var(--ink-mute);font-style:italic;white-space:pre}
.ill-pill-w + .ill-pill-f{margin-left:.32em}
.ill-pill-f{display:inline-grid;min-width:0;position:relative;color:var(--ink)}
.ill-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ill-pill select{font:inherit;color:var(--ink);background-color:var(--ice);border:0;border-bottom:1px solid var(--ink);border-radius:0;
  padding:2px 1.05em 3px .1em;appearance:none;-webkit-appearance:none;cursor:pointer;line-height:1.3;
  background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
  background-position:calc(100% - 9px) 60%,calc(100% - 4px) 60%;background-size:5px 5px;background-repeat:no-repeat;
  transition:border-color .25s var(--e)}
.ill-pill select option{color:#0E161D;font-family:var(--sans)}
@media (hover:hover) and (pointer:fine){.ill-pill select:hover{border-color:var(--dusk)}}
/* the Dates field and its calendar sheet */
.ill-root .ill-pill-d{text-align:left;cursor:pointer;padding:2px .1em 3px;margin-left:.32em;border-bottom:1px solid var(--ink);
  font:inherit;transition:border-color .25s var(--e)}
.ill-pill-d b{font-weight:300;color:var(--ink-mute);white-space:nowrap}
.ill-pill-d.has-dates b{color:var(--ink)}
.ill-pill-d[aria-expanded="true"]{border-color:var(--dusk)}
@media (hover:hover) and (pointer:fine){.ill-pill-d:hover{border-color:var(--dusk)}}
.ill-pill-pop{position:absolute;left:0;right:0;top:100%;margin-top:1px;z-index:5;background:var(--ice);color:var(--ink);
  padding:clamp(18px,2.4vw,30px) clamp(18px,2.4vw,32px) clamp(16px,2vw,24px);
  box-shadow:0 34px 60px -30px rgba(14,22,29,.5);
  opacity:0;transform:translateY(-6px);visibility:hidden;pointer-events:none;
  transition:opacity .22s var(--e),transform .22s var(--e),visibility 0s .22s}
.ill-pill-pop.is-open{opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:opacity .22s var(--e),transform .22s var(--e)}
.ill-pill-pop:focus{outline:none}
.ill-pill-pop .ill-sb-cal{gap:clamp(18px,3vw,48px)}
.ill-pill-pop-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;
  border-top:1px solid var(--hair);margin-top:18px;padding-top:14px}
.ill-pill-pop-foot p{font-size:.86rem;color:var(--ink-soft)}
.ill-pill-pop-foot > div{display:flex;align-items:center;gap:18px}
.ill-root .ill-pill-pop-done{padding:10px 20px;background:var(--ink);color:var(--ice);font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500;
  transition:background-color .25s var(--e),transform .16s var(--e)}
.ill-pill-pop-done:active{transform:scale(.97)}
@media (hover:hover) and (pointer:fine){.ill-pill-pop-done:hover{background:var(--dusk)}}
.ill-pill{position:relative}
.ill-root .ill-pill-go{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;gap:.8em;margin-left:auto;
  padding:0 28px;min-height:50px;background:var(--ink);color:var(--ice);
  font-family:var(--sans);font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;font-weight:500;white-space:nowrap;
  transition:transform .16s var(--e)}
.ill-pill-go i{font-style:normal;transition:transform .3s var(--e)}
.ill-pill-go::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--dusk);transform:scaleX(0);transform-origin:right;transition:transform .36s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-pill-go:hover::before{transform:scaleX(1);transform-origin:left}
  .ill-pill-go:hover i{transform:translateX(4px)}
}
.ill-pill-go:active{transform:scale(.98)}
@media (max-width:640px){
  .ill-hero-sub,.ill-hero-sub.has-pill{top:calc(50% + clamp(62px,19vw,84px))}
  .ill-hero-sub-in{font-size:12px;letter-spacing:.16em;max-width:30ch}
  .ill-pill-wrap{transform:translateY(40%)}
  .ill-pill{width:100%;padding:18px 20px 20px;font-size:1.2rem;gap:8px 0}
  .ill-root .ill-pill-go{width:100%;justify-content:center;min-height:52px;margin:12px 0 0}
  .ill-pill-pop{position:fixed;left:12px;right:12px;top:auto;bottom:12px;margin:0;max-height:min(78svh,640px);overflow:auto;overscroll-behavior:contain;z-index:70;transform:translateY(10px)}
  .ill-pill-pop.is-open{transform:none}
  .ill-pill-pop .ill-sb-cal{grid-template-columns:minmax(0,1fr)}
  .ill-pill-pop .ill-sb-month.is-second{display:none}
  .ill-pill-g button{width:40px;height:40px}
  .ill-pill-f > span{font-size:12px;letter-spacing:.14em}
}
.ill-hero-sub-in{display:inline-block;color:rgba(246,249,250,.88);font-size:clamp(.66rem,.9vw,.78rem);letter-spacing:.2em;text-transform:uppercase;font-weight:500;max-width:70ch;text-wrap:balance;line-height:1.7;
  text-shadow:0 1px 16px rgba(14,22,29,.5);
  opacity:0;transform:translateY(16px);transition:opacity .9s var(--e) .35s,transform .9s var(--e) .35s}
.is-revealed .ill-hero-sub-in{opacity:1;transform:none}
/* the one quiet entry in the hero: tracked caps on a hairline that fills on hover */
.ill-root .ill-hero-go{position:absolute;left:50%;top:calc(50% + clamp(84px,9.4vw,150px));transform:translateX(-50%);z-index:3;
  display:inline-flex;align-items:center;gap:.7em;padding:13px 24px 12px;color:#F6F9FA;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;font-weight:500;
  white-space:nowrap;box-shadow:inset 0 0 0 1px rgba(246,249,250,.7);background:rgba(14,22,29,.18);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  text-shadow:0 1px 10px rgba(14,22,29,.5);opacity:0;transition:opacity .9s var(--e) .7s,background .3s var(--e),color .3s var(--e)}
.ill-hero-go i{font-style:normal;transition:transform .3s var(--e)}
.is-revealed .ill-hero-go{opacity:1}
@media (hover:hover) and (pointer:fine){.ill-root .ill-hero-go:hover{background:rgba(246,249,250,.92);color:var(--ink);text-shadow:none}.ill-hero-go:hover i{transform:translateX(4px)}}
@media (max-width:640px){.ill-root .ill-hero-go{top:calc(50% + clamp(150px,44vw,190px))}}
@media (max-width:640px){
  .ill-wordmark{grid-template-columns:minmax(0,1fr);grid-auto-rows:min-content;align-content:center;justify-items:center;gap:.16em;font-size:clamp(30px,10.4vw,60px);transform:translateY(-.9em)}
  .ill-wm-l,.ill-wm-r{padding:0;margin:0;text-align:center;justify-self:center}
  .ill-wm-seam{width:.86em;height:1px}
}

/* ── statement (round 6): an editorial split, the sentence large on the
      left, the body set low on the right, instead of a centred block ── */
.ill-statement{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,6vw,110px);align-items:end;
  max-width:1500px;margin:0 auto;padding:clamp(130px,20vh,240px) clamp(20px,5vw,64px) clamp(70px,11vh,130px);text-align:left}
.ill-statement-lead .ill-rise-in{font-family:var(--serif);font-size:clamp(2rem,4.8vw,4.1rem);line-height:1.06;font-weight:300;
  letter-spacing:-.005em;text-wrap:balance}
.ill-statement-body{padding-bottom:.6em}
.ill-statement-body .ill-rise-in{color:var(--ink-soft);font-size:clamp(1rem,1.5vw,1.12rem);max-width:40ch}
@media (max-width:900px){
  .ill-statement{grid-template-columns:1fr;gap:26px;padding-top:clamp(150px,22vh,200px)}
  .ill-statement-body{padding-bottom:0}
}

/* ── doors (round 6): three tall portraits inset on the ice (Velaa's paired
      villa portraits, on our stone), the middle one hung lower, the caption
      typeset beneath on a hairline. No white type over a darkened photo. ── */
/* round 6b (Sindri: "similar to before but with expansion on hover and
   pushing the others"): full-bleed doors again, now an accordion. The door
   under the pointer grows to almost twice its share and the other two give
   way; the photograph settles from 1.04 to 1 as the door opens, the name
   stays put, the line of copy and the link rise in. */
.ill-doors{display:flex;min-height:92svh}
.ill-door{position:relative;flex:1 1 0;min-width:0;display:grid;align-content:end;overflow:hidden;isolation:isolate;
  background:var(--ink);opacity:0;transform:translateY(26px);
  transition:flex-grow .85s cubic-bezier(.22,.9,.28,1),opacity .9s var(--e),transform .9s var(--e)}
.ill-door.is-on{opacity:1;transform:none}
.ill-door-media{position:absolute;inset:0;z-index:-1;transition:filter .6s var(--e)}
.ill-door-media img{transform:scale(1.04);transition:transform 1.1s var(--e);filter:saturate(.88)}
.ill-door::after{content:'';position:absolute;inset:0;z-index:-1;
  background:linear-gradient(to top,rgba(14,22,29,.78) 0%,rgba(14,22,29,.34) 38%,rgba(14,22,29,.06) 70%,transparent 100%)}
.ill-door + .ill-door{box-shadow:inset 1px 0 0 var(--hair-ice)}
.ill-door-copy{padding:clamp(22px,3vw,44px);color:var(--ice);display:grid;gap:5px}
.ill-door-kind{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ice-mute);font-weight:500}
.ill-door-name{font-family:var(--serif);font-size:clamp(1.8rem,3.1vw,3rem);line-height:1.04;white-space:nowrap;transform-origin:0 100%;transition:transform .85s var(--e)}
.ill-door-sleeps{font-size:.86rem;color:var(--ice-soft)}
.ill-door-go{display:inline-flex;gap:.5em;align-items:center;margin-top:10px;font-size:.84rem;letter-spacing:.04em;color:var(--ice)}
.ill-door-go i{font-style:normal;transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-doors:hover .ill-door{flex-grow:.72}
  .ill-doors .ill-door:hover{flex-grow:1.9}
  /* a narrowed door keeps its whole name: the size steps down with the width, never an ellipsis */
  .ill-doors:hover .ill-door:not(:hover) .ill-door-name{transform:scale(.68)}
  .ill-door:hover .ill-door-media img{transform:scale(1)}
  .ill-doors:hover .ill-door:not(:hover) .ill-door-media{filter:brightness(.72) saturate(.7)}
  .ill-door-sleeps,.ill-door-go{opacity:0;transform:translateY(8px);transition:opacity .4s var(--e),transform .4s var(--e)}
  .ill-door:hover .ill-door-sleeps,.ill-door:hover .ill-door-go{opacity:1;transform:none}
  .ill-door:hover .ill-door-go{transition-delay:.06s}
  .ill-door:hover .ill-door-go i{transform:translateX(5px)}
}
.ill-doors.is-two{min-height:76svh}
.ill-others-h{max-width:1500px;margin:0 auto;padding:0 clamp(20px,5vw,64px) 22px;font-size:.72rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--acc)}
@media (max-width:900px){
  .ill-doors,.ill-doors.is-two{flex-direction:column;min-height:0}
  .ill-door{flex:none;min-height:64svh}
  .ill-door + .ill-door{box-shadow:inset 0 1px 0 var(--hair-ice)}
}

/* ── chapters ── */
.ill-chapter{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1500px;margin:0 auto}
.ill-chapter-head{display:flex;align-items:baseline;gap:clamp(16px,3vw,34px);border-top:1px solid var(--hair);padding-top:26px;margin-bottom:clamp(34px,6vh,64px)}
.ill-chapter-ord{font-family:var(--serif);font-size:clamp(1.3rem,2vw,1.7rem);line-height:1;color:var(--acc);opacity:.8}
/* the middle chapter mirrors: photographs left, copy right */
.ill-chapter.is-alt .ill-chapter-grid{grid-template-columns:7fr minmax(300px,5fr)}
.ill-chapter.is-alt .ill-chapter-copy{order:2}
.ill-chapter-name .ill-rise-in{font-family:var(--serif);font-size:clamp(2.2rem,5.4vw,4.2rem);line-height:1.04}
.ill-chapter-water{margin-top:6px}
.ill-chapter-water .ill-rise-in{color:var(--ink-mute);font-family:var(--serif);font-style:italic;font-size:1.15rem;letter-spacing:0}
.ill-chapter-grid{display:grid;grid-template-columns:minmax(300px,5fr) 7fr;gap:clamp(28px,4.5vw,64px);align-items:start}
.ill-chapter-copy{position:sticky;top:96px;display:grid;gap:22px}
.ill-chapter-lead .ill-rise-in{font-family:var(--serif);font-size:clamp(1.3rem,2.4vw,1.8rem);line-height:1.3}
.ill-chapter-body .ill-rise-in{color:var(--ink-soft);max-width:52ch}
.ill-facts{display:flex;gap:clamp(20px,3vw,40px)}
.ill-fact{display:grid;gap:2px;opacity:0;transform:translateY(14px);transition:opacity .7s var(--e),transform .7s var(--e)}
.ill-fact.is-on{opacity:1;transform:none}
/* 50/100ms, not 100/200: the stagger band is 30-80ms and the longer gap made
   a three-item group read as slow rather than sequenced. */
.ill-fact:nth-child(2){transition-delay:.05s}
.ill-fact:nth-child(3){transition-delay:.1s}
.ill-fact-n{font-family:var(--serif);font-size:clamp(1.9rem,3.4vw,2.8rem);line-height:1;color:var(--dusk)}
.ill-fact-l{font-size:.8rem;letter-spacing:.05em;color:var(--ink-mute)}
.ill-amen{list-style:none;padding:0;display:grid;gap:9px;max-width:40ch}
.ill-amen li{padding-left:18px;position:relative;color:var(--ink-soft);font-size:.95rem;
  opacity:0;transform:translateX(-8px);transition:opacity .6s var(--e),transform .6s var(--e)}
.ill-amen li.is-on{opacity:1;transform:none}
.ill-amen li::before{content:'';position:absolute;left:0;top:.68em;width:9px;height:1px;background:var(--dusk)}
.ill-chip{border:1px solid var(--hair);padding:12px 16px;display:inline-grid;gap:2px;max-width:max-content}
.ill-chip strong{font-weight:500;font-size:.98rem}
.ill-chip span{font-size:.8rem;color:var(--ink-mute)}
.ill-chapter-photos{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,26px)}
.ill-frame{position:relative;overflow:hidden;aspect-ratio:4/3.1;
  opacity:0;transform:translateY(30px);transition:opacity 1s var(--e),transform 1s var(--e)}
.ill-frame.is-on{opacity:1;transform:none}
.ill-frame.is-wide{grid-column:1/-1;aspect-ratio:16/8.4}
.ill-frame img{filter:saturate(.92);transition:transform .7s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-frame:hover img{transform:scale(1.04)}}
@media (max-width:1020px){.ill-chapter-grid,.ill-chapter.is-alt .ill-chapter-grid{grid-template-columns:1fr}.ill-chapter-copy,.ill-chapter.is-alt .ill-chapter-copy{position:static;order:0}}
@media (max-width:640px){.ill-chapter-photos{grid-template-columns:1fr}.ill-frame{aspect-ratio:4/3}}

/* ── house page: the line under the hero ── */
.ill-hp-strip{display:flex;align-items:center;gap:clamp(18px,3vw,44px);flex-wrap:wrap;max-width:1500px;margin:0 auto;
  padding:22px clamp(20px,5vw,64px);border-bottom:1px solid var(--hair);font-size:.86rem;color:var(--ink-soft)}
.ill-hp-strip > span{display:inline-flex;align-items:center;gap:clamp(18px,3vw,44px)}
.ill-hp-strip > span + span::before{content:'';width:1px;height:1em;background:var(--hair)}
.ill-hp-strip-go{margin-left:auto;display:inline-flex;gap:.5em;align-items:center;color:var(--fg);font-weight:400;letter-spacing:.02em}
.ill-hp-strip-go i{font-style:normal;transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-hp-strip-go:hover i{transform:translateX(4px)}}
@media (max-width:640px){.ill-hp-strip{gap:10px 16px;font-size:13px}.ill-hp-strip > span{gap:16px}.ill-hp-strip-go{margin-left:0;width:100%}}

/* ── house page: content left, the house's calendar in a sticky card ── */
.ill-hp-below{margin-top:clamp(48px,8vh,96px)}
.ill-chapter-photos.is-house{grid-template-columns:repeat(3,minmax(0,1fr))}
.ill-chapter-photos.is-house .ill-frame.is-wide{grid-column:1/-1;aspect-ratio:16/7}
.ill-hp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(330px,400px);gap:clamp(28px,4.5vw,70px);align-items:start}
.ill-hp-main{display:grid;gap:clamp(40px,7vh,72px);min-width:0}
.ill-hp-copy{display:grid;gap:22px;max-width:620px}
.ill-hp-card{position:sticky;top:84px;display:grid;gap:14px;padding:22px 22px 18px;
  background:color-mix(in srgb,var(--fg) 4%,var(--bg));box-shadow:inset 0 0 0 1px var(--hair)}
.ill-hp-card-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;
  border-bottom:1px solid var(--hair);padding-bottom:12px}
.ill-hp-card-head b{font-family:var(--serif);font-weight:300;font-size:1.7rem}
.ill-hp-card-head p{color:var(--ink-mute);font-size:.88rem}
.ill-hp-card-score{font-size:.78rem !important;text-align:right}
@media (max-width:1020px){
  .ill-hp-grid{grid-template-columns:minmax(0,1fr)}
  .ill-hp-card{position:static;max-width:560px}
  /* on one column the card belongs right after the copy, before the photos */
  .ill-hp-main{display:contents}
  .ill-hp-copy{order:1}.ill-hp-card{order:2}.ill-hp-main > :not(.ill-hp-copy){order:3}
}

/* ── room by room (Úlfljótsskáli) ── */
.ill-rooms{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,4vw,72px);align-items:start}
.ill-rooms-h{grid-column:1/-1;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--acc);
  border-top:1px solid var(--hair);padding-top:18px}
.ill-rooms-list{list-style:none;padding:0;margin:0;display:grid}
.ill-rooms-list button{width:100%;display:grid;grid-template-columns:2.2em minmax(0,1fr);column-gap:10px;row-gap:2px;
  text-align:left;padding:13px 0;border-bottom:1px solid var(--hair);color:var(--ink-mute);
  transition:color .3s var(--e)}
.ill-rooms-n{grid-row:1/3;font-family:var(--serif);font-size:.95rem;padding-top:.2em;color:var(--acc);opacity:.6}
.ill-rooms-name{font-family:var(--serif);font-size:clamp(1.25rem,2vw,1.6rem);line-height:1.15;
  transition:transform .35s var(--e)}
.ill-rooms-line{font-size:.86rem;color:var(--ink-mute);max-height:0;opacity:0;overflow:hidden;transition:max-height .35s var(--e),opacity .35s var(--e)}
.ill-rooms-list button.is-on{color:var(--fg)}
.ill-rooms-list button.is-on .ill-rooms-n{opacity:1}
.ill-rooms-list button.is-on .ill-rooms-name{transform:translateX(6px)}
.ill-rooms-list button.is-on .ill-rooms-line{max-height:3.6em;opacity:1;transform:translateX(6px)}
.ill-rooms-view{position:sticky;top:96px;margin:0;aspect-ratio:5/4;overflow:hidden;background:var(--ink)}
.ill-rooms-view img{position:absolute;inset:0;opacity:0;transform:scale(1.05);
  transition:opacity .55s var(--e),transform 1.1s var(--e)}
.ill-rooms-view img.is-on{opacity:1;transform:none}
@media (max-width:720px){
  .ill-rooms{grid-template-columns:minmax(0,1fr)}
  .ill-rooms-view{position:relative;top:auto;aspect-ratio:4/3;order:-1;grid-row:2}
  .ill-rooms-h{grid-row:1}
  .ill-rooms-list{grid-row:3}
}

/* ── Áslundur filmstrip ── */
.ill-strip{padding:clamp(20px,4vh,50px) 0 clamp(30px,6vh,70px)}
.ill-strip-head{display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:1500px;margin:0 auto 18px;padding:18px clamp(20px,5vw,64px) 0;border-top:1px solid var(--hair)}
.ill-strip-h{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--acc)}
.ill-strip-nav{display:flex;gap:8px}
.ill-strip-nav button{width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--hair);display:grid;place-content:center;
  transition:box-shadow .2s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-strip-nav button:hover{box-shadow:inset 0 0 0 1px var(--fg)}}
.ill-strip-row{list-style:none;margin:0;display:flex;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;
  scroll-snap-type:x mandatory;scroll-padding-inline:clamp(20px,5vw,64px);
  padding:0 clamp(20px,5vw,64px) 6px;scrollbar-width:none}
.ill-strip-row::-webkit-scrollbar{display:none}
.ill-strip-row li{flex:none;scroll-snap-align:start}
.ill-strip-row figure{margin:0;display:grid;gap:10px}
.ill-strip-img{height:clamp(320px,62svh,620px);aspect-ratio:4/3;overflow:hidden;background:var(--ink)}
.ill-strip-img img{transition:transform .9s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-strip-row li:hover .ill-strip-img img{transform:scale(1.035)}}
.ill-strip-row figcaption{display:flex;gap:12px;align-items:baseline;font-size:.86rem;color:var(--ink-soft)}
.ill-strip-row figcaption span{font-family:var(--serif);color:var(--acc)}
@media (max-width:640px){
  .ill-strip-img{height:auto;width:84vw}
  .ill-strip-row figcaption{font-size:13px}
}

/* ── Álftavík's score, on the night ── */
.ill-score{display:grid;justify-items:center;text-align:center;gap:10px;
  padding:clamp(90px,15vh,170px) clamp(20px,6vw,80px) clamp(60px,10vh,120px)}
.ill-score-n{font-family:var(--serif);font-size:clamp(6rem,19vw,15rem);line-height:.86;letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;color:var(--fg)}
.ill-score-of{font-size:.9rem;letter-spacing:.04em;color:var(--ink-soft)}
.ill-score-of span{color:var(--acc)}
.ill-score-q{margin:clamp(26px,5vh,48px) 0 0;font-family:var(--serif);font-size:clamp(1.4rem,3vw,2.2rem);line-height:1.2;max-width:24ch}
.ill-score-q::before{content:'\\201C'}
.ill-score-q::after{content:'\\201D'}
.ill-score-who{font-size:.76rem;letter-spacing:.08em;color:var(--ink-mute)}

/* ── crossing lines ── */
.ill-cross{position:relative;height:clamp(520px,86svh,900px);margin:clamp(30px,6vh,70px) 0;overflow:clip;
  --ci:9% 17%}
.ill-cross-frame{position:absolute;inset:var(--ci);overflow:hidden;margin:0}
/* the frame is darkened so the ice letters read over any photograph */
.ill-cross-frame img{filter:saturate(.88) brightness(.66)}
.ill-cross-type{position:absolute;inset:0;display:grid;align-content:center;gap:.06em;margin:0;pointer-events:none;
  font-family:var(--serif);font-weight:400;text-transform:uppercase;letter-spacing:.06em;line-height:.98;
  /* sized to the LONGEST line (--cl characters): Gambarino caps at .06em
     tracking average ~.76em each, so this always fits inside the gutters.
     A fixed 8.6vw ran "INDOOR AND OUTDOOR" (18) off the right edge. */
  font-size:min(138px,calc(84vw / (var(--cl,14) * .76)));color:var(--fg);white-space:nowrap}
.ill-cross-type.is-in{color:#F4F7F8;clip-path:inset(var(--ci));text-shadow:0 2px 30px rgba(6,11,16,.35)}
.ill-cross-a{justify-self:start;padding-left:7vw;will-change:transform}
.ill-cross-b{justify-self:end;padding-right:7vw;will-change:transform}
@media (max-width:640px){
  .ill-cross{height:72svh;--ci:12% 7%}
  .ill-cross-type{font-size:min(15vw,calc(92vw / (var(--cl,14) * .76)))}
  .ill-cross-a{padding-left:3vw}.ill-cross-b{padding-right:3vw}
}

/* the chapter's way into its own page */
.ill-chapter-go{justify-self:start;display:inline-flex;gap:.5em;align-items:center;font-size:.92rem;letter-spacing:.02em;
  padding:12px 0 6px;border-bottom:1px solid currentColor}
.ill-chapter-go span{transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-chapter-go:hover span{transform:translateX(4px)}}

/* ── the evening band: the hero's terrace later the same day, pinned for one
   viewport while blue hour crossfades to the aurora night ── */
/* overflow:clip, not hidden: it clips the sticky stage, whose margin-box
   (margin-bottom:-100svh) otherwise lets it hang one viewport below the band
   and show through under the next transparent section, without creating a
   scroll container that would break the sticky itself */
.ill-dusk{position:relative;height:210svh;background:var(--ink);overflow:clip}
.ill-dusk-stage,.ill-dusk-in{position:sticky;top:0;height:100svh}
.ill-dusk-stage{margin-bottom:-100svh;overflow:hidden}
.ill-dusk-stage img,.ill-dusk-stage video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:66% 50%}
.ill-dusk-b{position:absolute;inset:0;opacity:var(--dn,0)}
.ill-dusk-stage::after{content:'';position:absolute;inset:0;opacity:var(--nt,0);
  background:linear-gradient(to top,rgba(6,11,16,.82) 0%,rgba(6,11,16,.42) 34%,transparent 62%)}
.ill-dusk-in{display:grid;align-content:end;justify-items:center;gap:14px;text-align:center;
  padding:0 20px clamp(56px,13vh,130px);color:#F3F7F8;text-shadow:0 2px 28px rgba(4,8,12,.55);
  background:radial-gradient(60% 55% at 50% 72%,rgba(6,11,16,.55),transparent 75%)}
.js .ill-dusk-in{opacity:var(--nt,0);transform:translateY(calc((1 - var(--nt,0)) * 18px))}
.ill-dusk-eye{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#B9CEDC}
.ill-dusk-h{font-family:var(--serif);font-weight:300;font-size:clamp(2.3rem,6.4vw,5.4rem);line-height:1.02;letter-spacing:-.01em}
.ill-dusk-p{color:rgba(239,243,245,.88);max-width:40ch;font-size:clamp(1rem,1.7vw,1.15rem)}

/* ── fourth key ── */
/* A dark box floating on a light page, with the page showing down both sides,
   is a card — the same template tell struck off Mirror Lodge. The fourth key
   is now its own FULL-BLEED band: the section IS the dark ground, it butts
   directly against its neighbours with no gap, and the type sits on it,
   left-ranged, with no container of its own. */
.ill-fourth{background:var(--ink);color:var(--ice);
  padding:clamp(78px,13vh,150px) clamp(20px,5vw,64px)}
.ill-fourth-card{max-width:1100px;margin:0 auto;display:grid;justify-items:start;gap:15px}
.ill-fourth-meta{font-size:.78rem;letter-spacing:.08em;color:var(--ice-mute)}
.ill-root .ill-fourth-go{display:inline-flex;align-items:center;gap:.6em;margin-top:14px;min-height:46px;padding:0 20px;font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;font-weight:500;color:var(--ice);box-shadow:inset 0 0 0 1px rgba(239,243,245,.4);transition:background .25s var(--e),color .25s var(--e)}
.ill-fourth-go i{font-style:normal;transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-root .ill-fourth-go:hover{background:var(--ice);color:var(--ink)}.ill-fourth-go:hover i{transform:translateX(4px)}}
.ill-fourth-place .ill-rise-in{color:var(--ice-mute);letter-spacing:.22em;text-transform:uppercase;
  font-size:.71rem;font-weight:400}
.ill-fourth-name .ill-rise-in{font-family:var(--serif);font-size:clamp(1.9rem,4.4vw,3.1rem);
  line-height:1.02;letter-spacing:-.02em}
.ill-fourth-body .ill-rise-in{color:var(--ice-soft);max-width:52ch}
.ill-fourth-rule{width:56px;height:1px;background:rgba(233,240,243,.28);margin-bottom:6px}

/* ── quote ── */
/* ══ guest words, on the night they describe ══ */
.ill-rev{position:relative;isolation:isolate;overflow:hidden;background:var(--ink);
  padding:clamp(80px,14vh,150px) clamp(20px,6vw,80px) clamp(74px,12vh,130px)}
/* the photograph fades into the night canvas at both edges, so the section
   reads as a scene inside the night rather than a box stacked on it */
.ill-rev-bed{position:absolute;inset:0;z-index:0}
/* masked on the media themselves: a <video> is its own compositor layer and
   Chrome does not reliably clip it by a parent's mask, which left a hard edge */
.ill-rev-bed img,.ill-rev-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 14%,#000 78%,transparent);
  mask-image:linear-gradient(to bottom,transparent,#000 14%,#000 78%,transparent)}
.ill-rev-film{z-index:1}
/* the type sits on the film, so the film needs a floor */
/* two scrims, not one: a lateral wash so the column always has a dark ground,
   and a top band because the quote's first line sits against open sky, which
   is the brightest part of the frame */
.ill-rev::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 14%,#000 78%,transparent);
  mask-image:linear-gradient(to bottom,transparent,#000 14%,#000 78%,transparent);
  background:
    linear-gradient(to bottom,rgba(6,11,16,.72),rgba(6,11,16,.18) 42%,transparent 62%),
    linear-gradient(to right,rgba(6,11,16,.9),rgba(6,11,16,.7) 50%,rgba(6,11,16,.3) 86%)}
.ill-rev-inner{position:relative;z-index:2;max-width:1180px;margin:0 auto;display:grid;justify-items:start;gap:clamp(22px,3.4vh,34px)}
.ill-rev-sync{flex-basis:100%}
/* oversized ghost ordinal, bled off the right */
.ill-rev-ord{position:absolute;right:-.08em;top:-.3em;z-index:0;display:grid;
  font-family:var(--serif);font-size:clamp(8rem,17vw,15rem);line-height:.76;letter-spacing:-.04em;
  color:#EFF3F5;opacity:.07;pointer-events:none;user-select:none}
.ill-rev-ord b{grid-area:1/1;font-weight:400;opacity:0;transform:scale(1.08);filter:blur(9px);
  transition:opacity .6s var(--e),transform .6s var(--e),filter .6s var(--e)}
.ill-rev-ord b.is-on{opacity:1;transform:none;filter:none}
.ill-rev-scores{display:flex;align-items:end;gap:clamp(22px,4vw,56px);flex-wrap:wrap;color:rgba(239,243,245,.86)}
.ill-rev-scores > p{display:grid;gap:4px}
.ill-rev-scores b{font-family:var(--serif);font-weight:300;font-size:clamp(2.2rem,4.4vw,3.6rem);line-height:.95;color:#F7FAFB}
.ill-rev-scores b i{font-style:normal;font-size:.42em;color:rgba(239,243,245,.6);margin-left:.08em}
.ill-rev-scores > p > span{font-size:.74rem;letter-spacing:.06em;color:rgba(239,243,245,.66)}
.ill-rev-sync{display:inline-flex !important;align-items:center;gap:9px;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(239,243,245,.72);padding-bottom:6px}
.ill-rev-sync span{width:5px;height:5px;border-radius:50%;background:#8FBFB0;flex:none}
.ill-rev-list{list-style:none;padding:0;margin:0;display:grid;perspective:800px;width:100%}
/* ASYMMETRIC, not a crossfade. Two stacked display-size quotes fading through
   each other overlap into unreadable mush for the whole transition. Leaving is
   efficiency (fast, no delay); arriving is ceremony (waits for the outgoing to
   clear, then comes in word by word). */
.ill-rev-q{grid-area:1/1;opacity:0;pointer-events:none;transition:opacity .18s var(--e)}
.ill-rev-q.is-on{opacity:1;pointer-events:auto;transition:opacity .3s var(--e) .2s}
.ill-rev-q blockquote{margin:0;font-family:var(--serif);
  font-size:clamp(1.35rem,2.7vw,2.25rem);line-height:1.2;letter-spacing:-.012em;
  color:#F7FAFB;max-width:26ch;text-shadow:0 2px 30px rgba(4,8,12,.6)}
.ill-rev-q blockquote::before{content:'\\201C'}
.ill-rev-q blockquote::after{content:'\\201D'}
/* word-by-word arrival */
.ill-rev-w{display:inline-block;overflow:hidden;vertical-align:top}
.ill-rev-w i{display:inline-block;font-style:normal;opacity:0;
  transform:translateY(104%) rotateX(58deg);transform-origin:top center;
  transition:transform .66s var(--e),opacity .48s var(--e)}
.ill-rev-q.is-on .ill-rev-w i{opacity:1;transform:none}
.ill-rev-foot{display:flex;align-items:center;justify-content:space-between;gap:20px;
  width:100%;flex-wrap:wrap;margin-top:4px}
.ill-rev-who{display:flex;align-items:center;gap:13px;font-size:.76rem;letter-spacing:.08em;
  color:rgba(239,243,245,.72)}
.ill-rev-who i{display:block;width:32px;height:1px;background:rgba(239,243,245,.6);flex:none}
.ill-rev-nav{display:flex;gap:10px}
.ill-rev-nav button{width:42px;height:42px;border-radius:50%;border:1px solid var(--hair-ice);
  display:grid;place-content:center;color:rgba(239,243,245,.85);
  transition:color .2s var(--e),border-color .2s var(--e),background-color .2s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-rev-nav button:hover{color:#0E161D;background:#EFF3F5;border-color:#EFF3F5}
}
.ill-rev-rail{display:flex;gap:7px}
.ill-rev-rail span{width:30px;height:1px;background:var(--hair-ice);transition:background .5s var(--e)}
.ill-rev-rail span.is-on{background:rgba(239,243,245,.92)}
.ill-rev-note{font-size:.72rem;letter-spacing:.03em;color:rgba(239,243,245,.55);max-width:62ch}
@media (max-width:640px){
  .ill-rev::after{background:linear-gradient(to top,rgba(6,11,16,.9),rgba(6,11,16,.55) 60%,rgba(6,11,16,.35))}
  .ill-rev-q blockquote{max-width:18ch}
  .ill-rev-ord{font-size:7rem}
}

/* ── booking ── */
/* round 6b: the booking is the widest thing on the page. Heading and line
   across the top, then the three house tiles, then two months of calendar
   with the summary card standing beside them. */
.ill-book{max-width:1500px;margin:0 auto;padding:clamp(96px,15vh,170px) clamp(20px,5vw,64px) clamp(100px,15vh,180px);
  display:grid;gap:clamp(56px,9vh,96px)}
.ill-book-copy{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px clamp(28px,6vw,110px);align-items:end;
  border-top:1px solid var(--hair);padding-top:26px}
.ill-book-copy h2 .ill-rise-in{font-family:var(--serif);font-size:clamp(2rem,4.4vw,3.6rem);line-height:1.06}
.ill-book-copy p .ill-rise-in{color:var(--ink-soft);max-width:46ch}
@media (max-width:860px){.ill-book-copy{grid-template-columns:minmax(0,1fr)}}
.ill-field{display:grid;gap:7px}
.ill-field label{font-size:.78rem;letter-spacing:.06em;color:var(--ink-mute);font-weight:400}
.ill-field input,.ill-field select{font:inherit;color:var(--fg);background:transparent;border:1px solid var(--hair);
  padding:12px 14px;border-radius:0;min-height:46px;width:100%}
.ill-field input:focus,.ill-field select:focus{outline:2px solid var(--acc);outline-offset:1px;border-color:transparent}
.ill-field-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.ill-field-row.is-two{grid-template-columns:1fr 1fr}
/* .ill-root prefix: the base .ill-root button{background:none} reset is
   (0,1,1) and was silently stripping the fill off every CTA */
.ill-root .ill-cta{position:relative;isolation:isolate;overflow:hidden;background:var(--fg);color:var(--bg);padding:15px 30px;
  font-weight:400;letter-spacing:.04em;font-size:.94rem;min-height:48px;transition:transform .16s var(--e)}
.ill-cta::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--acc);
  transform:scaleX(0);transform-origin:right;transition:transform .36s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-cta:not(:disabled):hover::before{transform:scaleX(1);transform-origin:left}
}
.ill-cta:not(:disabled):active{transform:scale(.98)}
/* A 1fr track is minmax(auto,1fr), and that auto floor is the column's CONTENT
   width — so this track resolved to 350px inside a 320px content box on a
   360px phone and the section hung 30px off the edge. It never showed up as a
   horizontal scrollbar because .ill-root carries overflow-x:clip, which
   silently ate it. minmax(0,1fr) lets the track shrink; min-width:0 lets the
   children stop propagating their own content floor. */
@media (max-width:860px){
  .ill-book-copy,.ill-sb{min-width:0}
  .ill-field-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .ill-field-row .ill-field:last-child{grid-column:1/-1}
}

/* ── footer ── */
.ill-footer{position:relative;background:var(--ink);color:var(--ice);overflow:hidden}
.ill-footer-top{max-width:1500px;margin:0 auto;padding:clamp(70px,10vh,120px) clamp(20px,5vw,64px) clamp(44px,7vh,80px);
  display:grid;grid-template-columns:minmax(0,1.7fr) repeat(3,minmax(0,1fr));gap:clamp(28px,4vw,72px);border-top:1px solid var(--hair-ice)}
.ill-footer-brand{display:grid;gap:16px;align-content:start}
.ill-footer-mark{font-family:var(--serif);font-size:1.4rem;display:flex;gap:.4em;color:var(--ice)}
.ill-footer-brand p{color:var(--ice-soft);max-width:34ch;font-size:.95rem;text-wrap:balance}
.ill-footer-brand .ill-footer-addr{color:var(--ice-mute);font-size:.84rem}
.ill-footer-col h3{font-family:var(--sans);font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:var(--ice-mute);font-weight:500;margin-bottom:18px}
.ill-footer-col ul{list-style:none;padding:0;display:grid;gap:11px}
.ill-footer-col li a{color:var(--ice-soft);font-family:var(--serif);font-size:1.15rem;line-height:1.2;transition:color .25s var(--e)}
.ill-footer-book{display:inline-flex;gap:.6em;align-items:center;margin-top:24px;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500;
  color:var(--ice);box-shadow:inset 0 0 0 1px var(--hair-ice);padding:12px 18px;transition:background-color .3s var(--e),color .3s var(--e)}
.ill-footer-book i{font-style:normal;transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-footer-col li a:hover{color:var(--ice)}
  .ill-footer-book:hover{background:var(--ice);color:var(--ink)}
  .ill-footer-book:hover i{transform:translateX(4px)}
}
/* the waterline: word, seam, reflection. The reflection is a flipped box
   that shows the lower half of the glyphs (flex-end + overflow), masked to
   nothing, so the word reads as standing in still water. The drift loop
   writes translate on the inner nodes only, never on the flipped box. */
.ill-water{position:relative;padding:clamp(48px,10vh,110px) clamp(20px,5vw,64px) clamp(8px,2vh,20px);text-align:center;line-height:1;max-width:1500px;margin:0 auto}
.ill-water-defs{position:absolute;width:0;height:0;overflow:hidden}
.ill-water-word,.ill-water-refl > div{font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,8vw,8.2rem);letter-spacing:.005em;white-space:nowrap;color:rgba(239,243,245,.94);will-change:transform}
.ill-water-word{padding-bottom:.06em}
.ill-water-seam{display:block;height:1px;margin:0 auto;width:min(100%,1100px);background:linear-gradient(90deg,transparent,rgba(239,243,245,.5) 22%,rgba(239,243,245,.5) 78%,transparent)}
.ill-water-refl{display:flex;align-items:flex-end;justify-content:center;height:.62em;overflow:hidden;
  font-size:clamp(2.4rem,8vw,8.2rem);transform:scaleY(-1);opacity:.34;filter:url(#ill-ripple);
  -webkit-mask-image:linear-gradient(to top,#000 0%,rgba(0,0,0,.5) 45%,transparent 100%);
  mask-image:linear-gradient(to top,#000 0%,rgba(0,0,0,.5) 45%,transparent 100%)}
.ill-water-refl > div{font-size:1em;padding-bottom:.06em;transform:scaleY(.86);transform-origin:50% 100%}
.ill-footer-base{max-width:1500px;margin:0 auto;padding:clamp(28px,5vh,48px) clamp(20px,5vw,64px) clamp(20px,3vh,32px);
  display:flex;justify-content:space-between;gap:12px 24px;flex-wrap:wrap;font-size:.76rem;letter-spacing:.02em;color:var(--ice-mute)}
@media (max-width:900px){
  .ill-footer-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .ill-footer-brand{grid-column:1/-1}
}
@media (max-width:640px){
  .ill-footer-top{grid-template-columns:minmax(0,1fr);gap:34px}
  .ill-water-refl{opacity:.22}
}

/* ── rise mechanism (resting state visible; .js arms the hidden start) ── */
.ill-rise{overflow:hidden}
.ill-rise-in{display:block;padding-top:.14em;margin-top:-.14em;padding-bottom:.18em;margin-bottom:-.18em}
.js:not(.reduced) .ill-rise .ill-rise-in{transform:translateY(112%);transition:transform 1s var(--e)}
.js:not(.reduced) .ill-rise.is-on .ill-rise-in{transform:none}

/* ── reduced motion: everything rests visible, no drift, no loader ── */
@media (prefers-reduced-motion:reduce){
  .ill-stage-in{position:absolute;inset:0;transform:none !important}
  .ill-hero-line-in,.ill-hero-sub-in{transform:none;opacity:1;transition:none}
  .ill-pill-wrap{opacity:1;transition:none}
  .ill-pill{transform:none;transition:none}
  .ill-door,.ill-fact,.ill-amen li,.ill-frame{opacity:1;transform:none;transition:none}
  .js .ill-dusk-in{transform:none}
  .ill-loader-line::after{animation:none}
  /* no auto-advance and no film: every quote is shown at once, so every WORD
     must show too — the per-word reveal keys off .is-on, which only one <li>
     ever carries */
  .ill-rev-q{grid-area:auto;opacity:1;pointer-events:auto;margin-bottom:28px}
  .ill-rev-w i{opacity:1 !important;transform:none !important;transition:none}
  .ill-rev-ord b{opacity:0}
  .ill-rev-ord b.is-on{opacity:1;filter:none;transform:none}
  .ill-rev-rail,.ill-rev-nav{display:none}
}

/* ── the SHARED prototype disclaimer, dressed in this page's own language ──
   PreviewFooter ships Tailwind utilities (bg-neutral-50, text-center, default
   sans). Dropped inside a designed footer it reads as a foreign design system
   bolted on: its own background, its own alignment, its own type. These rules
   are scoped to this route only and never touch the component. */
.ill-footer footer[lang="is"]{
  background:transparent !important;
  color:var(--ice-mute);
  font-family:var(--sans);
  font-size:.76rem;
  line-height:1.7;
  text-align:left;
  /* It must land on the SAME measure as .ill-footer-grid above it or the
     footer reads as two stacked designs: the contact rules ran 64→1376 and
     these ones 120→1320, four hairlines at one width sitting over two more at
     another. The grid's content box is min(1500px,100%) minus twice its
     padding, and that must be reproduced as a WIDTH, not max-width + padding:
     the rule is
     drawn on this element's border box, so padding would push it full-bleed
     while the text stayed put. */
  width:calc(min(1500px, 100%) - 2 * clamp(20px,5vw,64px));
  margin:clamp(38px,6vh,66px) auto 0;
  padding:clamp(22px,3.4vh,34px) 0 clamp(34px,6vh,56px);
  border-top:1px solid var(--hair-ice);
}
.ill-footer footer[lang="is"] p{max-width:74ch;margin:0}
.ill-footer footer[lang="is"] p + p{margin-top:9px}
.ill-footer footer[lang="is"] strong{color:var(--ice-soft);font-weight:400}
.ill-footer footer[lang="is"] a{color:var(--ice-soft);text-decoration:underline;
  text-underline-offset:3px;text-decoration-thickness:1px;transition:color .3s var(--e)}
.ill-footer footer[lang="is"] a:hover{color:var(--dusk)}
.ill-footer footer[lang="is"] > div{justify-content:flex-start !important;
  margin:clamp(18px,2.6vh,26px) 0 0 !important;padding-top:clamp(16px,2.4vh,22px) !important;
  border-top-color:var(--hair-ice) !important}
/* the SNDR logotype carries an inline near-black colour: invisible on ink */
.ill-footer footer[lang="is"] [data-logotype] > span{color:var(--ice-soft) !important}
@media (max-width:760px){
  .ill-footer footer[lang="is"]{padding-bottom:clamp(84px,14vh,112px)}
}

/* ── MOBILE FLOORS ──
   Last in the sheet on purpose: these are single-class selectors overriding
   other single-class selectors, so source order is what decides.
   Two floors, both measured rather than guessed: no real text under 13px, and
   no standalone control under 44px. The tracked uppercase labels were sitting
   at 11.4–12.8px on a phone, which is where they stop being quiet and start
   being unreadable. Inline links inside a sentence are deliberately exempt —
   padding them to 44px would break the line box. */
@media (max-width:640px){
  .ill-eyebrow,.ill-door-kind,.ill-fact-l,.ill-rev-note,.ill-book-note,
  .ill-rev-badge,.ill-chip,.ill-chip span,.ill-fourth-place .ill-rise-in,.ill-footer-dl dt,
  .ill-field label,.ill-book label,.ill-dusk-eye,.ill-others-h{font-size:13px}
  .ill-rev-nav button{width:44px;height:44px}
  .ill-nav-mark{padding:9px 0}
  /* the shared disclaimer is dressed by this page at .76rem — 12.2px, under
     the floor. The component itself ships 15px on phones; the override is
     what dropped it, so the override is what raises it back. */
  .ill-footer footer[lang="is"]{font-size:13px}
  /* Contact links are the mobile CTA of the whole page, not links inside a
     sentence, so they get a real target instead of a 19px line box. */
  .ill-footer-dl a{display:inline-block;padding:12px 0}
}
/* A grid track may shrink, but a grid ITEM still carries min-width:auto, and
   an <input> has an intrinsic ~180px min-content width — so the two-up field
   row stayed 7px over the edge on a 360px phone even after the track was
   changed to minmax(0,1fr). The item and the control both have to release. */
.ill-field{min-width:0}
.ill-field input,.ill-field select,.ill-field textarea{min-width:0;width:100%}
`
