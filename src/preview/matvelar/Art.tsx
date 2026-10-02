import { memo, type Ref } from 'react'
import { BELT, ITEM_FORMS, ITEM_X, STATIONS, beltPoint, box, camera, iso, overview, rod, type Shape } from './iso'

/* The isometric artwork. Our own drawing, built from iso.ts: no path here is
   traced from anything. Roles are coloured by the stylesheet (.mv-iso .t, .l …),
   so the lit machine, the product and the outlines are all driven from CSS and
   the scroll scene only moves a camera and toggles data-on. */

const Paths = ({ shapes }: { shapes: Shape[] }) => (
  <>
    {shapes.map((s, i) => (
      <path key={i} className={s.cls ? `${s.role} ${s.cls}` : s.role} d={s.d} />
    ))}
  </>
)

export const viewBoxOf = (view: 'overview' | number) => (view === 'overview' ? overview() : camera(view)).map((n) => Math.round(n * 100) / 100).join(' ')

export interface LineSvgProps {
  /** the lit station (0 to 4), or null for none */
  active: number | null
  /** the camera: the whole line, or one station */
  view: 'overview' | number
  /** the form the product has (0 raw … 5 packed) */
  form?: number
  svgRef?: Ref<SVGSVGElement>
  label?: string
  className?: string
}

/** The production line: five machines on one belt, the product travelling along it. */
export const LineSvg = memo(function LineSvg({ active, view, form = 1, svgRef, label, className = '' }: LineSvgProps) {
  const at = typeof view === 'number' ? Math.min(view, 4) : 0
  const [ix, iy] = beltPoint(ITEM_X[at])
  return (
    <svg
      ref={svgRef}
      className={`mv-iso ${className}`}
      viewBox={viewBoxOf(view)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {STATIONS.map((s, i) => (
        <g key={`b${s.id}`} className="st" data-i={i} data-on={active === i ? 1 : 0}>
          <Paths shapes={s.back} />
        </g>
      ))}
      <g className="belt"><Paths shapes={BELT} /></g>
      <g className="item" data-item transform={`translate(${ix.toFixed(2)} ${iy.toFixed(2)})`}>
        {ITEM_FORMS.map((f, k) => (
          <g key={k} data-form={k} style={{ opacity: k === form ? 1 : 0 }}><Paths shapes={f} /></g>
        ))}
      </g>
      {STATIONS.map((s, i) => (
        <g key={`f${s.id}`} className="st" data-i={i} data-on={active === i ? 1 : 0}>
          <Paths shapes={s.front} />
        </g>
      ))}
    </svg>
  )
})

/* ── the crate that drops onto the belt (the "who we serve" section) ───── */
const slab: Shape[] = [
  ...box(0, 0, 0, 84, 84, 6),
  ...[14, 28, 42, 56, 70].flatMap((n) => [rod([n, 0, 6], [n, 84, 6], 'roll'), rod([0, n, 6], [84, n, 6], 'roll')]),
]
const crate: Shape[] = [
  ...box(14, 14, 6, 56, 56, 38, ['o', 'o', 'o']),
  ...[0, 1, 2].map((i) => rod([14, 70, 6 + 10 + i * 10], [70, 70, 6 + 10 + i * 10], 'slat')),
  ...[0, 1, 2].map((i) => rod([70, 14, 6 + 10 + i * 10], [70, 70, 6 + 10 + i * 10], 'slat')),
]

export const CUBE_LIFT = 130

export const CubeDrop = memo(function CubeDrop() {
  /* three dotted guides run from the crate's lower corners down to the slab; they shorten as it lands */
  const corners = [iso(14, 70, 6), iso(70, 70, 6), iso(70, 14, 6)]
  return (
    <svg className="mv-iso mv-iso--dark" viewBox="-95 -176 190 272" aria-hidden="true" focusable="false" data-cube-svg>
      <g data-slab><Paths shapes={slab} /></g>
      <g className="guides">
        {corners.map((p, i) => (
          <line key={i} data-guide x1={p[0]} x2={p[0]} y1={p[1] - CUBE_LIFT} y2={p[1]} />
        ))}
      </g>
      <g data-crate transform={`translate(0 ${-CUBE_LIFT})`}><Paths shapes={crate} /></g>
    </svg>
  )
})
