/**
 * Small pieces of delight, adapted from 21st.dev components to this site's
 * rules: no animation library, no Tailwind, CSS does the moving.
 *
 * - RollText     ← "Text Roll" (Mazyar kawa). Letters roll up and a second
 *                  copy rolls in behind them, staggered per letter.
 * - FillButton   ← "Arrow Fill Button" (hyperiux). A pill whose arrow disc
 *                  swells to fill it, the label re-inking as it passes.
 * - PreviewZone  ← "Project Showcase" (jatin-yadav05). A photograph follows
 *                  the pointer over a list of project names. The original
 *                  set React state every animation frame; this writes one
 *                  transform on a ref and stops its loop when it settles.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from './link'
import { Photo, reduced } from './kit'

/* THE LABEL IS TEXT ONCE. The rolling rows used to hold every letter as real
   text, so a crawler read "Hafa samband H a f a s a m b a n d H a f a s a m b a n d".
   Each letter now lives in data-ch and is drawn by CSS (::before content), which
   no text extractor reads; the one real copy is the screen-reader span. */
export function RollText({ text }: { text: string }) {
  const chars = Array.from(text)
  const row = (cls: string) => (
    <span className={cls} aria-hidden="true">
      {chars.map((ch, i) => (
        <i key={i} data-ch={ch} style={{ ['--i' as string]: i }} />
      ))}
    </span>
  )
  return (
    <span className="ki-roll">
      <span className="ki-sr">{text}</span>
      {row('ki-roll-a')}
      {row('ki-roll-b')}
    </span>
  )
}

function FillInner({ children }: { children: string }) {
  return (
    <>
      <span className="ki-fill-label">{children}</span>
      <span className="ki-fill-bg" aria-hidden="true" />
      {/* the re-inked copy is drawn from the attribute, so the label is text once */}
      <span className="ki-fill-ink" aria-hidden="true" data-label={children} />
      <span className="ki-fill-dot" aria-hidden="true">
        <i className="ki-fill-arrow" />
        <i className="ki-fill-arrow" />
      </span>
    </>
  )
}

export function FillButton({ to, children }: { to: string; children: string }) {
  return <Link className="ki-fill" to={to}><FillInner>{children}</FillInner></Link>
}

/** the same pill, as a form's submit button */
export function FillSubmit({ children, disabled }: { children: string; disabled?: boolean }) {
  return <button className="ki-fill" type="submit" disabled={disabled}><FillInner>{children}</FillInner></button>
}

export function PreviewZone({ children }: { children: ReactNode }) {
  const zone = useRef<HTMLDivElement>(null)
  const fig = useRef<HTMLDivElement>(null)
  const [ids, setIds] = useState<string[]>([])
  const [id, setId] = useState<string | null>(null)

  /* EVERY PHOTOGRAPH IS ALREADY THERE WHEN THE POINTER ARRIVES (2026-09-22).
     Mounting one <Photo> per hover meant each new name started a fresh
     request, so the frame was empty until it landed and a quick run down the
     register showed gaps. The whole set now mounts once, as soon as the
     register comes near the viewport, and hovering only changes which one is
     opaque. Nothing downloads on a phone: the observer never runs without a
     fine pointer. */
  useEffect(() => {
    const el = zone.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduced()) return
    const collect = () => {
      const found = [...el.querySelectorAll<HTMLElement>('[data-preview]')]
        .map((a) => a.dataset.preview!)
        .filter((v, i, arr) => arr.indexOf(v) === i)
      setIds((prev) => (prev.length ? prev : found))
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { collect(); io.disconnect() }
    }, { rootMargin: '1200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = zone.current
    const f = fig.current
    if (!el || !f) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduced()) return
    /* above the pointer, not beside it: the register is four columns wide, so
       a photograph level with the row sat on top of the neighbouring names */
    const OX = 18, OY = -218
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, live = false
    const tick = () => {
      x += (tx - x) * 0.16
      y += (ty - y) * 0.16
      f.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = live || Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX + OX
      ty = e.clientY + OY
      if (!raf) raf = requestAnimationFrame(tick)
    }
    /* THE FRAME NEVER OPENS EMPTY. On a slow connection the set is still
       arriving while the pointer is already running down the names, and an
       open frame with nothing in it reads as a broken site. The frame waits
       for its own photograph to be decoded, then appears — and if the pointer
       has moved on by then, it does not appear at all. */
    let want = ''
    const reveal = (pid: string) => {
      const img = f.querySelector<HTMLImageElement>(`[data-pid="${pid}"] img`)
      if (img && img.complete && img.naturalWidth > 0) { f.dataset.on = ''; return }
      delete f.dataset.on
      img?.addEventListener('load', () => { if (live && want === pid) f.dataset.on = '' }, { once: true })
    }
    const over = (e: PointerEvent) => {
      const a = (e.target as Element).closest<HTMLElement>('[data-preview]')
      if (a && el.contains(a)) {
        if (!live) { x = e.clientX + OX; y = e.clientY + OY }
        live = true
        /* the pointer can beat the observer on a fast scroll; mount then */
        setIds((prev) => (prev.length ? prev : [...el.querySelectorAll<HTMLElement>('[data-preview]')]
          .map((n) => n.dataset.preview!)
          .filter((v, i, arr) => arr.indexOf(v) === i)))
        setId(a.dataset.preview!)
        want = a.dataset.preview!
        reveal(want)
      } else {
        want = ''
        live = false
        delete f.dataset.on
      }
    }
    const leave = () => { live = false; delete f.dataset.on }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerover', over)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerover', over)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={zone}>
      {children}
      <div ref={fig} className="ki-peek" aria-hidden="true">
        {ids.map((x) => (
          <span key={x} className="ki-peek-slot" data-pid={x} data-on={x === id ? '' : undefined}>
            <Photo id={x} alt="" sizes="320px" />
          </span>
        ))}
      </div>
    </div>
  )
}
