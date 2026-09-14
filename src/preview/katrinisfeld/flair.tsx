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
  const [id, setId] = useState<string | null>(null)

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
    const over = (e: PointerEvent) => {
      const a = (e.target as Element).closest<HTMLElement>('[data-preview]')
      if (a && el.contains(a)) {
        if (!live) { x = e.clientX + OX; y = e.clientY + OY }
        live = true
        setId(a.dataset.preview!)
        f.dataset.on = ''
      } else {
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
        {id && <Photo key={id} id={id} alt="" sizes="320px" />}
      </div>
    </div>
  )
}
