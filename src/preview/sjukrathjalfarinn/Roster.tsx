import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STAFF, THERAPIST_ITHROTT, THERAPIST_MEDGANGA } from './data'
import { Rise } from './primitives'
import { ACCENT, CREAM, DEEP_HAIR, DEEP_MUTE, DISPLAY, FOCUS_DEEP, MONO } from './tokens'

/** The centre-most cell in the desktop 3-row x 6-col layout (row 1, col 2,
 *  0-indexed) — the one face that gets the dramatic scale 3 -> 1 treatment. */
const CENTER_INDEX = 8

/**
 * DEVICE 3, part A — the pinned roster "moment" (desktop only, motion on).
 * All 18 real faces scale/fade in with `stagger:{from:'center'}` and
 * `back.out(1.4)`, scrubbed to a pinned scroll range; the centre face gets
 * its own scale 3 -> 1 tween on top. The headline crossfades "Einn með
 * verkina?" -> "Ekki hjá okkur." on enter, and back on leaveBack. Mobile
 * and reduced-motion: no pin at all, faces settle in with the page's own
 * plain scrubbed Rise reveal, and the resolved second line renders static.
 */
export function RosterMoment() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const headlineRef = useRef<HTMLHeadingElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    const headline = headlineRef.current
    if (!section || !grid || !headline) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const faces = gsap.utils.toArray<HTMLElement>('.sjr-roster-face', grid)
      const center = faces[CENTER_INDEX]

      gsap.set(faces, { opacity: 0, scale: 0.32, transformOrigin: 'center center' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      })
      tl.to(
        faces,
        { opacity: 1, scale: 1, ease: 'back.out(1.4)', stagger: { each: 0.05, from: 'center', grid: [3, 6] } },
        0,
      )
      if (center) tl.fromTo(center, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(1.4)', duration: 1 }, 0)

      const swap = ScrollTrigger.create({
        trigger: section,
        start: 'center center',
        onEnter: () => headline.setAttribute('data-swapped', 'true'),
        onLeaveBack: () => headline.removeAttribute('data-swapped'),
      })

      return () => swap.kill()
    })

    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      headline.setAttribute('data-swapped', 'true')
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="sjr-roster-moment" style={{ background: ACCENT }} aria-labelledby="roster-h">
      <div className="mx-auto flex h-full max-w-[1180px] flex-col justify-center px-5 py-20 sm:px-8 sm:py-28 lg:h-screen lg:py-0">
        <h2 ref={headlineRef} id="roster-h" className="sjr-roster-headline">
          <span className="sjr-roster-headline-a">Einn með verkina?</span>
          <span className="sjr-roster-headline-b">Ekki hjá okkur.</span>
        </h2>
        <p className="sr-only">{STAFF.length} sjúkraþjálfarar, sjá nöfn og starfsstöð hér að neðan.</p>
        <div ref={gridRef} className="sjr-roster-grid mt-10 sm:mt-14" aria-hidden="true">
          {STAFF.map((s) => (
            <div key={s.name} className="sjr-roster-face">
              <img src={s.photo} alt={`${s.name}, ${s.role}`} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type Filter = 'medganga' | 'ithrott'

/**
 * DEVICE 3, part B — the browsable directory the moment settles into: name
 * + title under every real face, on the deep pine ground. The two verified
 * specialists (Meðganga / Íþróttir) get their own toggle chips; every other
 * face stays unlabelled beyond its real name, role and house.
 */
export function RosterDirectory() {
  const [filter, setFilter] = useState<Filter | null>(null)

  const shown = STAFF.filter((s) => {
    if (filter === 'medganga') return s.name === THERAPIST_MEDGANGA.name
    if (filter === 'ithrott') return s.name === THERAPIST_ITHROTT.name
    return true
  })

  return (
    <section id="starfsfolk" style={{ background: '#0E211A' }} aria-labelledby="starf-h">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Rise>
            <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.12em', color: ACCENT }} className="uppercase">
              Öll teymin, tvær starfsstöðvar
            </p>
            <h2 id="starf-h" className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(2rem, 4.6vw, 3.1rem)', letterSpacing: '-.03em', lineHeight: 1.05, color: CREAM }}>
              {STAFF.length} sjúkraþjálfarar, hver með sitt andlit
            </h2>
          </Rise>

          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Sía eftir sérsviði">
            {(['medganga', 'ithrott'] as Filter[]).map((f) => {
              const active = filter === f
              const label = f === 'medganga' ? 'Meðganga' : 'Íþróttir'
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter((prev) => (prev === f ? null : f))}
                  className={`inline-flex items-center rounded-[.375rem] px-4 ${FOCUS_DEEP}`}
                  style={{
                    minHeight: 44,
                    fontFamily: MONO,
                    fontSize: '.82rem',
                    background: active ? ACCENT : 'transparent',
                    color: active ? '#fff' : CREAM,
                    border: `1.5px solid ${active ? ACCENT : DEEP_HAIR}`,
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="sjr-roster-grid sjr-roster-grid-directory mt-11">
          {shown.map((s, i) => (
            <Rise key={s.name} delay={i % 6} as="article">
              <div className="sjr-roster-face">
                <img src={s.photo} alt={`${s.name}, ${s.role}`} loading="lazy" decoding="async" />
              </div>
              <p className="mt-2.5" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '.95rem', color: CREAM, lineHeight: 1.2 }}>
                {s.name}
              </p>
              <p style={{ fontFamily: MONO, fontSize: '.68rem', color: DEEP_MUTE, marginTop: 2 }}>{s.house}</p>
              {(s.name === THERAPIST_MEDGANGA.name || s.name === THERAPIST_ITHROTT.name) && s.note && (
                <p className="mt-1" style={{ fontSize: '.76rem', color: ACCENT, lineHeight: 1.35 }}>
                  {s.note}
                </p>
              )}
            </Rise>
          ))}
        </div>

        {filter && (
          <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.78rem', color: DEEP_MUTE }}>
            Sýnir 1 af {STAFF.length} ·{' '}
            <button type="button" onClick={() => setFilter(null)} className={`sjr-link ${FOCUS_DEEP}`} style={{ color: CREAM, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
              hreinsa síu
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
