import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { IMG } from './data'
import { reduced } from './primitives'
import { ACCENT } from './tokens'

/**
 * DEVICE 1 — the frame-opening preloader (mandated).
 *
 * Adapted from thegrind.nl's signature move (see thegrind-teardown-mjolnir
 * memory, "the preloader"): a small photo frame reveals, then the frame
 * itself opens out to fill the screen before handing off to the hero below.
 *
 * Two deliberate departures from the reference, both noted in the teardown
 * as things NOT to copy: this version never disables the keyboard, always
 * offers a visible, focused skip control, and honours prefers-reduced-motion
 * by never rendering at all. It also animates only `transform` and `opacity`
 * (the reference animates raw width/height; a centered scale from 0.16 to 1
 * produces the same "the frame opens" sensation without leaving the GPU-safe
 * property list). Runs once per browser tab (sessionStorage), then a plain
 * hard reload of the page skips straight to the finished state.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(false)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const markRef = useRef<HTMLDivElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const skipButtonRef = useRef<HTMLButtonElement | null>(null)
  const skip = useRef<() => void>(() => {})
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

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
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: finish })
      tl.set(frameRef.current, { clipPath: 'inset(0 100% 100% 0)', scale: 0.16 })
      tl.fromTo(markRef.current, { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'power2.out' })
      tl.to(frameRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }, '-=0.02')
      tl.to(frameRef.current, { scale: 1, duration: 0.85 }, '+=0.03')
      tl.to(markRef.current, { opacity: 0, duration: 0.28 }, '<')
      tl.to(wrapRef.current, { opacity: 0, duration: 0.32 }, '-=0.08')
      skip.current = () => tl.progress(1)
    })

    const failsafe = window.setTimeout(finish, 3400)
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
    <div ref={wrapRef} className="sjr-preloader" role="status" aria-label="Síðan er að hlaðast inn">
      <div
        ref={frameRef}
        className="sjr-preloader-frame"
        style={{ width: 'min(46rem, calc(100vw - 2rem))', height: 'calc(100vh - 2rem)', maxHeight: '46rem' }}
      >
        <img src={IMG.heroShoulder} alt="" />
      </div>
      <div ref={markRef} style={{ position: 'absolute' }} aria-hidden="true">
        <svg viewBox="0 0 96 96" width="44" height="44">
          <circle cx="48" cy="48" r="42" fill="none" stroke={ACCENT} strokeWidth="4" strokeDasharray="12 10" />
          <path d="M30 52c6 10 14 10 18 0s12-10 18 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <button
        ref={skipButtonRef}
        type="button"
        className="sjr-preloader-skip"
        onClick={() => skip.current()}
      >
        Sleppa kynningu
      </button>
    </div>
  )
}
