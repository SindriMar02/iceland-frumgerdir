/**
 * The landing frame: her name, centred, over a slow run of her best rooms.
 *
 * One photograph at a time, each from a different project, each captioned
 * with the project it comes from — and the caption is a link, because the
 * one question a landing photograph raises is "what is this?". The small i
 * opens the answer in place: which project, what the photograph shows, who
 * took it, and the way through to the page.
 *
 * MOTION. Only the ARRIVING slide fades. The one underneath holds at full
 * opacity until it is covered, because two opposed fades over a dark ground
 * dip to a muddy midpoint — a dissolve keeps its light, a crossfade does not
 * (see crossfade-two-fades-lose-light). The active photograph drifts on one
 * compositor transform. Under reduced motion nothing runs on its own: the
 * arrows and the dots still work.
 *
 * PRERENDER. The first slide is `is-on` in the static HTML, so a crawler and
 * the first paint both get the photograph; the timer starts on hydration.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from './link'
import { Photo, reduced } from './kit'
import { FillButton } from './flair'
import { CATEGORIES, PROJECTS } from './projects'
import { project as projPath, WORK, CONTACT_PATH } from './paths'

export interface ShowSlide {
  /** the photograph, by id — its alt comes from the project's own caption */
  id: string
  slug: string
  /** how far this photograph is graded down (0–1, default .46). A whole-frame
      tone, never a shape: a room with a window behind the name gets more. */
  tone?: number
}

const HOLD = 6400

export function HeroShow({ slides, newSlug }: {
  slides: ReadonlyArray<ShowSlide>
  /** her newest project: its slide carries a "Nýtt" badge in the caption, so
      "newest" is part of the slideshow rather than a second object in the frame */
  newSlug?: string
}) {
  const [on, setOn] = useState(0)
  const [was, setWas] = useState(-1)
  const [open, setOpen] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const n = slides.length

  const go = (to: number) => {
    setWas(on)
    setOn(((to % n) + n) % n)
  }

  /* the timer restarts from whatever slide is current, so a click never
     lands in the middle of a beat */
  useEffect(() => {
    if (n < 2 || reduced() || open) return
    const t = window.setTimeout(() => go(on + 1), HOLD)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, n, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const cur = slides[on]
  const proj = PROJECTS.find((p) => p.slug === cur.slug)!
  const photo = proj.photos.find((p) => p.id === cur.id)
  const alt = photo?.alt ?? proj.title
  const cat = CATEGORIES[proj.category].nav
  const isNew = cur.slug === newSlug

  return (
    <section className="ki-show" id="top" data-ki-band="dark" data-open={open || undefined} aria-roledescription="myndasýning" aria-label="Úrval verkefna"
      style={{ ['--tone' as string]: String(cur.tone ?? 0.46) }}
      /* a phone has no arrows in the frame: a sideways swipe is the way on */
      onTouchStart={(e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }}
      onTouchEnd={(e) => {
        const s = touch.current
        touch.current = null
        if (!s) return
        const t = e.changedTouches[0]
        const dx = t.clientX - s.x, dy = t.clientY - s.y
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(on + (dx < 0 ? 1 : -1))
      }}>
      <div className="ki-show-media">
        {slides.map((s, i) => {
          const p = PROJECTS.find((x) => x.slug === s.slug)!
          const a = p.photos.find((x) => x.id === s.id)?.alt ?? p.title
          const state = i === on ? ' is-on' : i === was ? ' was-on' : ''
          return (
            <figure key={s.id} className={`ki-show-slide${state}`} aria-hidden={i !== on}>
              <Photo id={s.id} alt={a} sizes="100vw" priority={i === 0} />
            </figure>
          )
        })}
      </div>
      <div className="ki-show-scrim" aria-hidden="true" />

      <div className="ki-show-lockup">
        <h1 className="ki-show-name">Katrín Ísfeld</h1>
        <p className="ki-show-role">innanhússarkitekt</p>
        <p className="ki-show-tag">Skipulag, innréttingar, efnisval og lýsing, teiknað í einu lagi.</p>
        <p className="ki-show-cta">
          <FillButton to={WORK}>Verkefnin</FillButton>
          <FillButton to={CONTACT_PATH}>Hafa samband</FillButton>
        </p>
      </div>

      {/* what is on screen, and the way to it */}
      {/* THE BOTTOM OF THE FRAME IS THE SLIDESHOW'S, AND ONLY ITS: the caption
          and its own progress under it on the left, the arrows on the right.
          Nothing else may sit near the progress bar, or the bar reads as the
          timer of whatever it is beside. */}
      <div className="ki-show-bar">
        <div className="ki-show-meta">
        <div className="ki-show-cap">
          <span className="ki-show-lead">
            <span className="ki-show-n" aria-hidden="true">
              {String(on + 1).padStart(2, '0')}<i>/</i>{String(n).padStart(2, '0')}
            </span>
            {isNew && <span key={cur.id} className="ki-show-new">Nýtt</span>}
          </span>
          <Link className="ki-show-title" to={projPath(proj.slug)} aria-live="polite">{proj.title}</Link>
          <button
            type="button"
            className="ki-show-i"
            aria-expanded={open}
            aria-controls="ki-show-info"
            aria-label={open ? 'Loka upplýsingum um myndina' : 'Um myndina'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true">i</span>
          </button>
        </div>
        <ol className="ki-show-dots" aria-label="Myndir">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-label={`Mynd ${i + 1} af ${n}`}
                aria-current={i === on ? 'true' : undefined}
                onClick={() => go(i)}
                style={{ ['--t' as string]: `${HOLD}ms` }}
              />
            </li>
          ))}
        </ol>
        </div>
        <div className="ki-show-nav">
          <button type="button" aria-label="Fyrri mynd" onClick={() => go(on - 1)}><span className="ki-show-arrow ki-show-arrow--back" aria-hidden="true" /></button>
          <button type="button" aria-label="Næsta mynd" onClick={() => go(on + 1)}><span className="ki-show-arrow" aria-hidden="true" /></button>
        </div>
      </div>

      <div id="ki-show-info" className="ki-show-info" hidden={!open} role="dialog" aria-label="Um myndina">
        <p className="ki-show-info-kicker">{cat}{isNew ? ' · Nýjasta verkefnið' : ''}</p>
        <p className="ki-show-info-title">{proj.title}</p>
        <p className="ki-show-info-body">{proj.lead}</p>
        <p className="ki-show-info-meta">Á myndinni: {alt}</p>
        {proj.credit && <p className="ki-show-info-meta">Ljósmyndari: {proj.credit}</p>}
        <p className="ki-show-info-cta"><FillButton to={projPath(proj.slug)}>Skoða verkefnið</FillButton></p>
        <button type="button" className="ki-show-info-x" aria-label="Loka" onClick={() => setOpen(false)}>×</button>
      </div>
    </section>
  )
}
