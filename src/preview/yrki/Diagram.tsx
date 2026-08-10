import { useEffect, useRef, useState } from 'react'
import { SCALE } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   KVARÐINN — the practice's spread of scale, drawn to true scale.

   Structurally this is the Heklusýn/THG scale-diagram device: nested
   squares of PUBLISHED AREAS ONLY, side = sqrt(area). Yrki's three areas
   and their statuses are copied from each project's own page fields
   (STÆRÐ / STAÐA):

     Álftaból                    210 m²   á framkvæmdastigi
     Nemendagarðar á Flateyri    468 m²   fullbyggt
     Frystigeymsla í Sundahöfn 2.280 m²   fullbyggt

   No estimate, no average, no third-party figure. The point the drawing
   makes is the firm's own: the same care spans a summerhouse at the roots
   of Hekla and a cold store in Sundahöfn.

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

  const [small, mid, big] = SCALE.items
  const S = side(small.m2)
  const M = side(mid.m2)
  const B = side(big.m2)

  return (
    <div ref={ref} className={`yrki-sta${shown ? ' is-in' : ''}`}>
      <svg
        viewBox="-4 -4 108 108" role="img"
        aria-label={`Skýringarmynd: ${small.label} ${fmt(small.m2)} fermetrar, ${mid.label} ${fmt(mid.m2)} fermetrar og ${big.label} ${fmt(big.m2)} fermetrar, öll teiknuð í sama kvarða.`}
      >
        {/* the biggest area — the outer square */}
        <rect className="yrki-sa" x={0} y={0} width={B} height={B} />
        {/* the middle area */}
        <rect className="yrki-sadd" x={0} y={B - M} width={M} height={M} />
        {/* the smallest — solid ink, the thing everything is measured against */}
        <rect className="yrki-sb" x={0} y={B - S} width={S} height={S} />

        <text className="yrki-st yrki-st-a" x={B} y={-1.4} textAnchor="end">{fmt(big.m2)} m²</text>
        <text className="yrki-st yrki-st-add" x={M + 1.6} y={B - M + 4.4}>{fmt(mid.m2)} m²</text>
        <text className="yrki-st yrki-st-b" x={S + 1.8} y={B - 1.4}>{fmt(small.m2)} m²</text>
      </svg>

      <dl className="yrki-sta-key">
        {SCALE.items.map((i) => (
          <div key={i.label}><dt>{i.label} · {i.sub}</dt><dd>{fmt(i.m2)} m²</dd></div>
        ))}
      </dl>
    </div>
  )
}

export const DIAGRAM_CSS = `
.yrki-sta{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.yrki-sta{grid-template-columns:minmax(0,1fr) minmax(0,.85fr)}}
.yrki-sta svg{width:100%;height:auto;overflow:visible}

.yrki-sta rect{transform-box:fill-box;transform-origin:bottom left}
.yrki-sa{fill:none;stroke:${INK};stroke-width:.55}
.yrki-sadd{fill:none;stroke:${MUTED};stroke-width:.4;stroke-dasharray:2.2 1.8}
.yrki-sb{fill:${INK};stroke:none}

/* the whole spread grows out around the smallest job, which is already there */
.yrki-sta .yrki-sa{transform:scale(.303);opacity:0;
  transition:transform 1.5s cubic-bezier(.17,.84,.44,1),opacity .6s cubic-bezier(.17,.84,.44,1)}
.yrki-sta.is-in .yrki-sa{transform:scale(1);opacity:1}
.yrki-sta .yrki-sadd,.yrki-sta .yrki-sb{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1)}
.yrki-sta.is-in .yrki-sadd{opacity:1;transition-delay:.22s}
.yrki-sta.is-in .yrki-sb{opacity:1;transition-delay:1.05s}

.yrki-st{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.yrki-st-a{fill:${INK};font-size:3.6px}
@media (max-width:700px){
  .yrki-st{font-size:4.4px}
  .yrki-st-a{font-size:5px}
  /* keep the mid label inside the drawing on narrow screens — the
     start-anchored label ran past the viewport edge on the THG build */
  .yrki-st-add{text-anchor:end}
}
.yrki-st-b{fill:${INK}}
.yrki-sta text{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.yrki-sta.is-in text{opacity:1}

.yrki-sta-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.yrki-sta-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.yrki-sta-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.yrki-sta-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right}
@media (prefers-reduced-motion:reduce){
  .yrki-sta .yrki-sa,.yrki-sta .yrki-sadd,.yrki-sta .yrki-sb,.yrki-sta text{
    opacity:1!important;transform:none!important;transition:none!important}
}
`
