import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { IMG, STAFF } from './data'
import { reduced } from './primitives'
import { DEEP } from './tokens'

/**
 * DEVICE 1 — the frame-opening preloader (mandated), three beats:
 *   1. clinic logo clip-reveals (inset 100% → 0)
 *   2. two real staff-photo frames clip-reveal beside it (inset 100% → 0),
 *      the two most tenured faces on staff (since 1989 / since 1999) — a
 *      quiet nod to the 42-year story before a single word of copy runs
 *   3. THE FRAME OPENS: the second photo frame IS the hero media wrapper —
 *      it expands via `scale` (never raw width/height, so this stays on the
 *      GPU-safe transform/opacity property list) to its resting CSS size of
 *      calc(100vw - 2rem) x calc(100svh - 2rem), expo.inOut
 * Scroll is locked only while this runs. Skippable by clicking anywhere on
 * the overlay or the explicit skip button. Absent entirely under
 * prefers-reduced-motion. Runs once per tab (sessionStorage).
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const frame1Ref = useRef<HTMLDivElement | null>(null)
  const frame2Ref = useRef<HTMLDivElement | null>(null)
  const skipButtonRef = useRef<HTMLButtonElement | null>(null)
  const skip = useRef<() => void>(() => {})
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const senior1 = STAFF.find((s) => s.name === 'Gunnar Viktorsson') ?? STAFF[0]
  const senior2 = STAFF.find((s) => s.name === 'Alma Guðjónsdóttir') ?? STAFF[1]

  useEffect(() => {
    if (reduced()) {
      onDoneRef.current()
      return
    }
    let seen: string | null = null
    try {
      seen = sessionStorage.getItem('sjr-preloader-seen')
    } catch {
      /* private mode: just show it, no harm done */
    }
    if (seen) {
      onDoneRef.current()
      return
    }
    setShow(true)
  }, [])

  useEffect(() => {
    if (!show) return
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    skipButtonRef.current?.focus()

    const finish = () => {
      html.style.overflow = prevOverflow
      try {
        sessionStorage.setItem('sjr-preloader-seen', '1')
      } catch {
        /* ignore */
      }
      onDoneRef.current()
    }

    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(frame1Ref.current, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(frame2Ref.current, { clipPath: 'inset(0 100% 0 0)', scale: 0.16 })

      const tl = gsap.timeline({ onComplete: finish })
      // beat 1 — the clinic wordmark
      tl.to(logoRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power3.out' })
      // beat 2 — two real staff-photo frames
      tl.to(frame1Ref.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.42, ease: 'power3.out' }, '-=0.14')
      tl.to(frame2Ref.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.42, ease: 'power3.out' }, '-=0.28')
      // beat 3 — THE FRAME OPENS: frame2 becomes the hero media wrapper
      tl.to(logoRef.current, { opacity: 0, duration: 0.3 }, '+=0.05')
      tl.to(frame1Ref.current, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, '<')
      tl.to(frame2Ref.current, { scale: 1, duration: 0.95, ease: 'expo.inOut' }, '<0.05')
      // handoff
      tl.to(wrapRef.current, { opacity: 0, duration: 0.32 }, '-=0.1')
      skip.current = () => tl.progress(1)
    }, wrapRef)

    const failsafe = window.setTimeout(finish, 2400)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip.current()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(failsafe)
      window.removeEventListener('keydown', onKey)
      ctx.revert()
      html.style.overflow = prevOverflow
    }
  }, [show])

  if (!show) return null

  return (
    <div
      ref={wrapRef}
      className="sjr-preloader"
      role="status"
      aria-label="Síðan er að hlaðast inn"
      onClick={() => skip.current()}
    >
      <div className="sjr-preloader-stage">
        <div ref={logoRef} className="sjr-preloader-logo">
          <img src={IMG.logo} alt="Sjúkraþjálfarinn" />
        </div>
        <div className="sjr-preloader-frames">
          <div ref={frame1Ref} className="sjr-preloader-frame sjr-preloader-frame-a">
            <img src={senior1.photo} alt={`${senior1.name}, sjúkraþjálfari hjá Sjúkraþjálfaranum.`} />
          </div>
          <div
            ref={frame2Ref}
            className="sjr-preloader-frame sjr-preloader-frame-b"
            style={{ width: 'calc(100vw - 2rem)', height: 'calc(100svh - 2rem)' }}
          >
            <img src={senior2.photo} alt={`${senior2.name}, sjúkraþjálfari hjá Sjúkraþjálfaranum.`} />
          </div>
        </div>
      </div>
      <button
        ref={skipButtonRef}
        type="button"
        className="sjr-preloader-skip"
        onClick={(e) => {
          e.stopPropagation()
          skip.current()
        }}
        style={{ background: `${DEEP}cc` }}
      >
        Sleppa kynningu
      </button>
    </div>
  )
}
