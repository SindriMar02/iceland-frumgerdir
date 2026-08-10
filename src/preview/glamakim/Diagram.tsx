import { useEffect, useRef, useState } from 'react'
import { SPANS } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   ÁRIN — three renovation year-pairs, drawn to true scale.

   The same diagram slot as the Heklusýn/THG scale device, but Gláma·Kím
   publish no areas — what they DO publish, on their own project pages, is
   when a building was drawn and when they renewed it:

     Timburhús við Tjörnina   1907 → 2016   "friðuðu timburhúsi frá 1907"
     Háskólabíó               1959 → 2020   "teikningarnar eru dagsettar í maí 1959"
     Einbýli á Arnarnesi      1968 → 2017   "teiknað ... árið 1968"

   Each bar's length is the span in years at one shared scale — the only
   arithmetic is subtraction on their own published years. The drawing
   makes the practice's quietest claim legible: they are trusted with
   other architects' buildings, across more than a century.

   Honesty: a scale diagram of year spans, labelled as such on the page.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

const MIN_YEAR = Math.min(...SPANS.items.map((s) => s.from))
const MAX_YEAR = Math.max(...SPANS.items.map((s) => s.to))
const X = (yr: number) => ((yr - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

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

  return (
    <div ref={ref} className={`gk-sta${shown ? ' is-in' : ''}`}>
      <svg
        viewBox="-6 -8 118 62" role="img"
        aria-label={`Skýringarmynd: ${SPANS.items.map((s) => `${s.label} frá ${s.from} til ${s.to}`).join(', ')}, öll árabil teiknuð í sama kvarða.`}
      >
        {SPANS.items.map((s, i) => {
          const y = 6 + i * 16
          return (
            <g key={s.label}>
              {/* the span bar — grows from its start year */}
              <line className="gk-bar" x1={X(s.from)} y1={y} x2={X(s.to)} y2={y} />
              {/* the two years, marked */}
              <circle className="gk-dot" cx={X(s.from)} cy={y} r={1.15} />
              <circle className="gk-dot gk-dot-end" cx={X(s.to)} cy={y} r={1.15} />
              <text className="gk-st gk-st-from" x={X(s.from)} y={y - 3} textAnchor={s.from === MIN_YEAR ? 'start' : 'middle'}>{s.from}</text>
              <text className="gk-st gk-st-to" x={X(s.to)} y={y - 3} textAnchor={s.to === MAX_YEAR ? 'end' : 'middle'}>{s.to}</text>
              <text className="gk-sl" x={X(s.from)} y={y + 5.4} textAnchor={s.from === MIN_YEAR ? 'start' : 'middle'}>{s.label} · {s.to - s.from} ár</text>
            </g>
          )
        })}
      </svg>

      <dl className="gk-sta-key">
        {SPANS.items.map((s) => (
          <div key={s.label}><dt>{s.label} · {s.note}</dt><dd>{s.from} til {s.to}</dd></div>
        ))}
      </dl>
    </div>
  )
}

export const DIAGRAM_CSS = `
.gk-sta{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.gk-sta{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr)}}
.gk-sta svg{width:100%;height:auto;overflow:visible}

.gk-bar{stroke:${INK};stroke-width:.9;stroke-linecap:round}
.gk-dot{fill:${MUTED}}
.gk-dot-end{fill:${INK}}

/* each bar draws itself from its own start year */
.gk-sta .gk-bar{stroke-dasharray:110;stroke-dashoffset:110;
  transition:stroke-dashoffset 1.5s cubic-bezier(.17,.84,.44,1)}
.gk-sta.is-in .gk-bar{stroke-dashoffset:0}
.gk-sta g:nth-child(2) .gk-bar{transition-delay:.18s}
.gk-sta g:nth-child(3) .gk-bar{transition-delay:.36s}

.gk-st{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.gk-st-to{fill:${INK}}
.gk-sl{font-size:3.1px;fill:${INK};letter-spacing:.02em}
@media (max-width:700px){
  .gk-st{font-size:4.2px}
  .gk-sl{font-size:4.2px}
}
.gk-sta text,.gk-sta circle{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.gk-sta.is-in text,.gk-sta.is-in circle{opacity:1}

.gk-sta-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.gk-sta-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.gk-sta-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.gk-sta-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right;white-space:nowrap}
@media (prefers-reduced-motion:reduce){
  .gk-sta .gk-bar{stroke-dashoffset:0!important;transition:none!important}
  .gk-sta text,.gk-sta circle{opacity:1!important;transition:none!important}
}
`
