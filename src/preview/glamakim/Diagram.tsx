import { useEffect, useRef, useState } from 'react'
import { SPANS } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   ÁRIN — three renovation spans, drawn as nested squares in the same
   language as the sibling diagrams (Yrki's areas, T.ark's house and
   lagoon, THG's Vík): ink outline, dashed middle, solid smallest, one
   shared scale.

   Gláma·Kím publish no areas, so the squares here are TIME: the side of
   each square corresponds to the number of years between a building's
   original drawings and Gláma·Kím's renewal of it — pairs copied verbatim
   from their own project texts:

     Timburhús við Tjörnina   1907 → 2016   109 ár   (friðað hús)
     Háskólabíó               1959 → 2020    61 ár   (teikningar maí 1959)
     Einbýli á Arnarnesi      1968 → 2017    49 ár

   The mapping is stated on the page, not implied: "hlið hvers fernings
   svarar til árafjöldans". The only arithmetic is subtraction on their
   published years. First hairline-bar version read as a default Gantt
   chart — Sindri: "not very premium unique modern look" — so it was
   redrawn into the family's square language.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

const items = SPANS.items.map((s) => ({ ...s, years: s.to - s.from }))
const MAX = Math.max(...items.map((i) => i.years))
const side = (years: number) => (years / MAX) * 100

export function Diagram() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { rootMargin: '0px 0px -18% 0px', threshold: 0.01 },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => setShown(true), 2000)
    return () => { io.disconnect(); window.clearTimeout(failsafe) }
  }, [])

  const [big, mid, small] = [...items].sort((a, b) => b.years - a.years)
  const B = side(big.years)
  const M = side(mid.years)
  const S = side(small.years)

  return (
    <div ref={ref} className={`gk-sta${shown ? ' is-in' : ''}`}>
      <svg
        viewBox="-4 -4 108 108" role="img"
        aria-label={`Skýringarmynd: ${items.map((s) => `${s.label} frá ${s.from} til ${s.to}, ${s.years} ár`).join(', ')}. Hlið hvers fernings svarar til árafjöldans, allt í sama kvarða.`}
      >
        {/* the longest span — the protected 1907 timber house */}
        <rect className="gk-sa" x={0} y={0} width={B} height={B} />
        {/* the middle span, dashed */}
        <rect className="gk-sadd" x={0} y={B - M} width={M} height={M} />
        {/* the shortest — solid ink, the thing the others are read against */}
        <rect className="gk-sb" x={0} y={B - S} width={S} height={S} />

        <text className="gk-st gk-st-a" x={B} y={-1.4} textAnchor="end">{big.years} ár · {big.from} til {big.to}</text>
        <text className="gk-st gk-st-add" x={M + 1.6} y={B - M + 4.4}>{mid.years} ár · {mid.label}</text>
        <text className="gk-st gk-st-b" x={S + 1.8} y={B - 1.4}>{small.years} ár · {small.label}</text>

        {/* crop marks — drawing-sheet corners, outside the outer square */}
        <g className="gk-crop" aria-hidden>
          <path d={`M -3 0 H -0.9 M 0 -3 V -0.9`} />
          <path d={`M ${B + 0.9} 0 H ${B + 3} M ${B} -3 V -0.9`} />
          <path d={`M -3 ${B} H -0.9 M 0 ${B + 0.9} V ${B + 3}`} />
          <path d={`M ${B + 0.9} ${B} H ${B + 3} M ${B} ${B + 0.9} V ${B + 3}`} />
        </g>
      </svg>

      <dl className="gk-sta-key">
        {items.map((s) => (
          <div key={s.label}><dt>{s.label} · {s.note}</dt><dd>{s.from} til {s.to}</dd></div>
        ))}
      </dl>
    </div>
  )
}

export const DIAGRAM_CSS = `
.gk-sta{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.gk-sta{grid-template-columns:minmax(0,1fr) minmax(0,.85fr)}}
.gk-sta svg{width:100%;height:auto;overflow:visible}

.gk-sta rect{transform-box:fill-box;transform-origin:bottom left}
.gk-sa{fill:none;stroke:${INK};stroke-width:.55}
.gk-sadd{fill:none;stroke:${MUTED};stroke-width:.4;stroke-dasharray:2.2 1.8}
.gk-sb{fill:${INK};stroke:none}

/* the century grows out around the shortest span, which is already there */
.gk-sta .gk-sa{transform:scale(.45);opacity:0;
  transition:transform 1.5s cubic-bezier(.17,.84,.44,1),opacity .6s cubic-bezier(.17,.84,.44,1)}
.gk-sta.is-in .gk-sa{transform:scale(1);opacity:1}
.gk-sta .gk-sadd,.gk-sta .gk-sb{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1)}
.gk-sta.is-in .gk-sadd{opacity:1;transition-delay:.22s}
.gk-sta.is-in .gk-sb{opacity:1;transition-delay:1.05s}

.gk-st{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.gk-st-a{fill:${INK};font-size:3.6px}
@media (max-width:700px){
  .gk-st{font-size:4.4px}
  .gk-st-a{font-size:5px}
  /* keep the mid label inside the drawing on narrow screens — the
     start-anchored label ran past the viewport edge on the THG build */
  .gk-st-add{text-anchor:end}
}
.gk-st-b{fill:${INK}}
.gk-sta text{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.gk-sta.is-in text{opacity:1}

.gk-crop path{stroke:#111111;stroke-width:.32;opacity:.35;fill:none}
.gk-sta-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.gk-sta-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.gk-sta-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.gk-sta-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right;white-space:nowrap}
@media (prefers-reduced-motion:reduce){
  .gk-sta .gk-sa,.gk-sta .gk-sadd,.gk-sta .gk-sb,.gk-sta text{
    opacity:1!important;transform:none!important;transition:none!important}
}
`
