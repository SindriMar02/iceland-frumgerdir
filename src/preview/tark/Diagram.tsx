import { useEffect, useRef, useState } from 'react'
import { SCALE } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   LÓNIÐ — the house and its lagoon, drawn to true scale.

   The Heklusýn/THG scale-diagram device with T.ark's own two numbers. One
   verbatim line on their Laugarás Lagoon page publishes both:

     "Hús 3000m2, lón 1000m2"

   Two squares, side = sqrt(area), no arithmetic at all — the house is
   three times its lagoon, and drawing it says what the project is: a
   building that carries a bath, not a bath with a shed.

   Honesty: a scale diagram of areas, not a survey and not a site plan —
   labelled as such on the page.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

const MAX = Math.max(...SCALE.items.map((i) => i.m2))
const M_PER_UNIT = Math.sqrt(MAX) / 100
const side = (m2: number) => Math.sqrt(m2) / M_PER_UNIT

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

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

  const [lon, hus] = SCALE.items
  const L = side(lon.m2)
  const H = side(hus.m2)

  return (
    <div ref={ref} className={`tark-sta${shown ? ' is-in' : ''}`}>
      <svg
        viewBox="-4 -4 108 108" role="img"
        aria-label={`Skýringarmynd: húsið í Laugarási ${fmt(hus.m2)} fermetrar og lónið ${fmt(lon.m2)} fermetrar, bæði teiknuð í sama kvarða.`}
      >
        {/* the house — the outer square */}
        <rect className="tark-sa" x={0} y={0} width={H} height={H} />
        {/* the lagoon inside it — solid ink */}
        <rect className="tark-sb" x={0} y={H - L} width={L} height={L} />

        <text className="tark-st tark-st-a" x={H} y={-1.4} textAnchor="end">Húsið · {fmt(hus.m2)} m²</text>
        <text className="tark-st tark-st-b" x={L + 1.8} y={H - 1.4}>Lónið · {fmt(lon.m2)} m²</text>

        {/* crop marks — drawing-sheet corners, outside the outer square */}
        <g className="tark-crop" aria-hidden>
          <path d={`M -3 0 H -0.9 M 0 -3 V -0.9`} />
          <path d={`M ${H + 0.9} 0 H ${H + 3} M ${H} -3 V -0.9`} />
          <path d={`M -3 ${H} H -0.9 M 0 ${H + 0.9} V ${H + 3}`} />
          <path d={`M ${H + 0.9} ${H} H ${H + 3} M ${H} ${H + 0.9} V ${H + 3}`} />
        </g>
      </svg>

      <dl className="tark-sta-key">
        {SCALE.items.map((i) => (
          <div key={i.label}><dt>{i.label} · {i.sub}</dt><dd>{fmt(i.m2)} m²</dd></div>
        ))}
      </dl>
    </div>
  )
}

export const DIAGRAM_CSS = `
.tark-sta{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.tark-sta{grid-template-columns:minmax(0,1fr) minmax(0,.85fr)}}
.tark-sta svg{width:100%;height:auto;overflow:visible}

.tark-sta rect{transform-box:fill-box;transform-origin:bottom left}
.tark-sa{fill:none;stroke:${INK};stroke-width:.55}
.tark-sb{fill:${INK};stroke:none}

/* the house grows out around its lagoon, which is already there */
.tark-sta .tark-sa{transform:scale(.577);opacity:0;
  transition:transform 1.5s cubic-bezier(.17,.84,.44,1),opacity .6s cubic-bezier(.17,.84,.44,1)}
.tark-sta.is-in .tark-sa{transform:scale(1);opacity:1}
.tark-sta .tark-sb{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1)}
.tark-sta.is-in .tark-sb{opacity:1;transition-delay:.85s}

.tark-st{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.tark-st-a{fill:${INK};font-size:3.6px}
@media (max-width:700px){
  .tark-st{font-size:4.4px}
  .tark-st-a{font-size:5px}
}
/* the lagoon label starts just OUTSIDE the ink square (x = L + 1.8), over
   white ground — so it is ink, not white-on-ink */
.tark-st-b{fill:${INK}}
.tark-sta text{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.tark-sta.is-in text{opacity:1}

.tark-crop path{stroke:#111111;stroke-width:.32;opacity:.35;fill:none}
.tark-sta-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.tark-sta-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.tark-sta-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.tark-sta-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right}
@media (prefers-reduced-motion:reduce){
  .tark-sta .tark-sa,.tark-sta .tark-sb,.tark-sta text{
    opacity:1!important;transform:none!important;transition:none!important}
}
`
