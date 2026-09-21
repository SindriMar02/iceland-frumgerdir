/**
 * A chapter heading that is piped on, the way the logo is in the loader.
 *
 * Tailored from Naustið, whose headings write themselves letter by letter as
 * SVG glyph outlines. That exact mechanism is NOT copied: outlines take the
 * heading's text out of the HTML, and a crawler or an AI assistant reading this
 * page (neither runs JavaScript) would see an <svg> where "Úr ofninum" should
 * be. What transplants is the behaviour — a hand drawing the words as you
 * arrive — built from Reynir's own vocabulary:
 *
 *  1. The heading stays a real <h2>. It is revealed left to right with a
 *     clip, and the gold nozzle from the intro loader rides the leading edge,
 *     so the words read as piped rather than wiped.
 *  2. Underneath, one unbroken line draws itself: a shell border, the loop a
 *     baker pipes round the edge of a cake. Naustið's line is their fish; this
 *     is the bakery's.
 *
 * Each title watches itself (IntersectionObserver), so it does not depend on
 * whichever reveal wrapper happens to sit above it. Reduced motion: the words
 * and the line are simply there.
 */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { GOLD, GOLD_LIGHT } from './tokens'

/* The piped loop line: a prolate cycloid (d > r) makes a row of closed
   loops, which is what a nozzle leaves when it is walked along a cake edge.
   Flipped so the loops rise, and leaned forward a third, it reads as a line
   of handwritten "e"s — the same hand as the script in their logo. Computed
   once, bounds measured from the points so the viewBox never clips a loop. */
const LOOPS = 5
const R = 4.0
const D = 9.5
const Y_SCALE = 0.8
const LEAN = 0.35
const LINE_W = 150
const { SHELL, VIEWBOX } = (() => {
  const steps = 420
  const tMax = LOOPS * Math.PI * 2
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax
    const y = -D * Math.cos(t) * Y_SCALE
    xs.push(R * t - D * Math.sin(t) + LEAN * y)
    ys.push(y)
  }
  const pad = 1.5
  const x0 = Math.min(...xs) - pad
  const y0 = Math.min(...ys) - pad
  const w = Math.max(...xs) - x0 + pad
  const h = Math.max(...ys) - y0 + pad
  const d = `M${xs.map((x, i) => `${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(' L')}`
  return { SHELL: d, VIEWBOX: `${x0.toFixed(2)} ${y0.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}` }
})()

const CSS = `
.rb-piped { position:relative; width:fit-content; max-width:100%; }
.rb-piped[data-align="center"] { margin-inline:auto; }
.rb-piped-words { position:relative; }
.rb-piped-words > h2 { clip-path:inset(-0.1em 100% -0.3em -0.1em); }
.rb-piped[data-shown] .rb-piped-words > h2 { animation:rb-pipe-words 1.05s cubic-bezier(.5,.05,.2,1) both; }
@keyframes rb-pipe-words { to { clip-path:inset(-0.1em -0.1em -0.3em -0.1em); } }

/* the nozzle: the loader's gold tip, riding the edge of the words */
.rb-piped-track { position:absolute; inset:0; pointer-events:none; }
/* the TRACK travels (transform, so it stays on the compositor); a percentage
   translate is of the element's own width, and the track is exactly as wide
   as the words, so 100% lands the tip on their last letter */
.rb-piped-tip { position:absolute; top:52%; left:0; width:10px; height:10px; margin:-5px 0 0 -5px;
  border-radius:50%; opacity:0; pointer-events:none;
  background:radial-gradient(circle, ${GOLD_LIGHT} 0%, ${GOLD} 52%, transparent 74%);
  box-shadow:0 0 16px 4px rgba(200,168,119,.45); }
.rb-piped[data-shown] .rb-piped-track { animation:rb-pipe-track 1.05s cubic-bezier(.5,.05,.2,1) both; }
.rb-piped[data-shown] .rb-piped-tip { animation:rb-pipe-tip 1.05s linear both; }
@keyframes rb-pipe-track { from { transform:translateX(0); } to { transform:translateX(100%); } }
@keyframes rb-pipe-tip { 0% { opacity:0; } 10% { opacity:1; } 84% { opacity:1; } 100% { opacity:0; } }

/* the shell border underneath */
.rb-piped-line { display:block; width:${LINE_W}px; max-width:60%; height:auto; margin-top:16px; overflow:visible; }
.rb-piped[data-align="center"] .rb-piped-line { margin-inline:auto; }
.rb-piped-line path { fill:none; stroke:${GOLD}; stroke-width:1.2; stroke-linecap:round; stroke-linejoin:round;
  opacity:.62; stroke-dasharray:1; stroke-dashoffset:1; }
.rb-piped[data-shown] .rb-piped-line path { animation:rb-pipe-line 1.25s cubic-bezier(.45,0,.2,1) .75s both; }
@keyframes rb-pipe-line { to { stroke-dashoffset:0; } }

@media (prefers-reduced-motion: reduce) {
  .rb-piped-words > h2 { clip-path:none; animation:none !important; }
  .rb-piped-tip { display:none; }
  .rb-piped-line path { stroke-dashoffset:0; animation:none !important; }
}
`

export function PipedTitle({
  children, style, align = 'start',
}: {
  children: ReactNode
  style?: CSSProperties
  align?: 'start' | 'center'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      /* the words start once they are properly on screen, not the instant
         their top pixel crosses the fold */
      { threshold: 0.6, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="rb-piped" data-align={align} data-shown={shown || undefined}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rb-piped-words">
        <h2 style={style}>{children}</h2>
        <span className="rb-piped-track" aria-hidden="true"><span className="rb-piped-tip" /></span>
      </div>
      <svg className="rb-piped-line" viewBox={VIEWBOX} aria-hidden="true" focusable="false">
        <path d={SHELL} pathLength={1} />
      </svg>
    </div>
  )
}
