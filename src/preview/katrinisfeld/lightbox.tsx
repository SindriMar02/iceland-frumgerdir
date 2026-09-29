/**
 * TAP A PHOTOGRAPH TO SEE IT WHOLE (2026-09-27).
 *
 * On a laptop the gallery sets three photographs to a row, which is right for
 * the rhythm of the page and too small to read a joint, a grain or a handle.
 * Each gallery photograph is a link to its largest file, so it works with no
 * script at all; with script it opens here instead: one photograph at a time,
 * whole, on charcoal, in her order, with arrows, swipe and Esc.
 *
 * A native <dialog> does the hard parts (top layer, focus trap, Esc, focus
 * returned to the photograph that opened it).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Photo } from './kit'

export type LbPhoto = { id: string; alt: string }

export function useLightbox(photos: ReadonlyArray<LbPhoto>) {
  const [at, setAt] = useState<number | null>(null)
  const open = useCallback((i: number) => (e: React.MouseEvent) => {
    // a modified click still opens the file in a new tab, as a link should
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setAt(i)
  }, [])
  const box = <Lightbox photos={photos} at={at} setAt={setAt} />
  return { open, box }
}

function Lightbox({ photos, at, setAt }: { photos: ReadonlyArray<LbPhoto>; at: number | null; setAt: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const x0 = useRef<number | null>(null)
  const n = photos.length
  const go = useCallback((d: number) => setAt(at === null ? null : (at + d + n) % n), [at, n, setAt])

  // Esc closes the dialog natively; the state follows it
  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const closed = () => setAt(null)
    dlg.addEventListener('close', closed)
    return () => dlg.removeEventListener('close', closed)
  }, [setAt])

  /* the page must not scroll behind the photograph, and must be exactly where
     it was when the photograph closes (iOS resets the offset of a locked root,
     so it is put back by hand) */
  const y = useRef(0)
  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const root = document.documentElement
    if (at !== null && !dlg.open) {
      y.current = scrollY
      dlg.showModal()
      // the dialog itself takes focus, so no button wears a focus ring on a tap
      dlg.focus()
      root.classList.add('ki-lb-lock')
    }
    if (at === null) {
      if (dlg.open) dlg.close()
      if (root.classList.contains('ki-lb-lock')) {
        root.classList.remove('ki-lb-lock')
        if (Math.abs(scrollY - y.current) > 1) scrollTo({ top: y.current, behavior: 'instant' as ScrollBehavior })
      }
    }
  }, [at])

  useEffect(() => {
    if (at === null) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [at, go])

  const p = at === null ? null : photos[at]
  return (
    <dialog
      ref={ref}
      className="ki-lb"
      tabIndex={-1}
      aria-label="Myndir úr verkefninu"
      // a tap on the charcoal around the photograph closes it
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('ki-lb-stage')) setAt(null) }}
      onTouchStart={(e) => { x0.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (x0.current === null) return
        const dx = e.changedTouches[0].clientX - x0.current
        x0.current = null
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
      }}
    >
      {p && (
        <>
          <div className="ki-lb-stage">
            <Photo key={p.id} id={p.id} alt={p.alt} sizes="100vw" priority />
          </div>
          <p className="ki-lb-count" aria-live="polite">{at! + 1} / {n}</p>
          <button type="button" className="ki-lb-close" onClick={() => setAt(null)}>Loka</button>
          {n > 1 && (
            <>
              <button type="button" className="ki-lb-nav ki-lb-nav--prev" aria-label="Fyrri mynd" onClick={() => go(-1)}><span aria-hidden="true">←</span></button>
              <button type="button" className="ki-lb-nav ki-lb-nav--next" aria-label="Næsta mynd" onClick={() => go(1)}><span aria-hidden="true">→</span></button>
            </>
          )}
        </>
      )}
    </dialog>
  )
}
