import { useEffect, useRef, useState } from 'react'

/** Explicit controls appear only when the associated data table overflows. */
export function ScrollArrows({ target }: { target: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ overflow: false, start: true, end: false })
  const find = () => ref.current?.parentElement?.querySelector<HTMLElement>(target)
  useEffect(() => {
    const el = find()
    if (!el) return
    const update = () => setEdges({ overflow: el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2, start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    el.addEventListener('scroll', update, { passive: true }); update()
    return () => { observer.disconnect(); el.removeEventListener('scroll', update) }
  }, [target])
  const move = (direction: number) => {
    const el = find()
    el?.scrollBy({ left: direction * el.clientWidth * .65, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <div ref={ref} className="hb-scrollArrows" hidden={!edges.overflow} aria-label="Fleiri dálkar">
    <span>Fleiri dálkar</span><button type="button" aria-label="Fyrri dálkar" disabled={edges.start} onClick={() => move(-1)}>←</button><button type="button" aria-label="Næstu dálkar" disabled={edges.end} onClick={() => move(1)}>→</button>
  </div>
}
