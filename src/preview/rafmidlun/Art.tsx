import { memo, type Ref } from 'react'
import { BELT, DROP_BOX, DROP_CORNERS, DROP_PALLET, HERO_BOARD, ITEM_FORMS, ITEM_X, OUTPUT, STATIONS, beltPoint, camera, overview, type Shape } from './iso'

/* The isometric artwork. Our own drawing, built from iso.ts: no path here is
   traced from anything. Roles are coloured by the stylesheet (.rm-iso .t, .l …),
   so the lit station, the board and the outlines are all driven from CSS and
   the scroll scene only moves a camera and toggles data-on. */

const Paths = ({ shapes }: { shapes: Shape[] }) => (
  <>
    {shapes.map((s, i) => (
      <path key={i} className={s.cls ? `${s.role} ${s.cls}` : s.role} d={s.d} />
    ))}
  </>
)

export const LAST = STATIONS.length - 1

export const viewBoxOf = (view: 'overview' | number) => (view === 'overview' ? overview() : camera(view)).map((n) => Math.round(n * 100) / 100).join(' ')

export interface LineSvgProps {
  /** the lit station (0 to 4), or null for none */
  active: number | null
  /** the camera: the whole line, or one station */
  view: 'overview' | number
  /** the form the board has (0 blank sheet … 5 closed board) */
  form?: number
  svgRef?: Ref<SVGSVGElement>
  label?: string
  className?: string
}

/** The line: five stations, the board travelling the cable ladder past them. */
export const LineSvg = memo(function LineSvg({ active, view, form = 1, svgRef, label, className = '' }: LineSvgProps) {
  const at = typeof view === 'number' ? Math.min(view, LAST) : 0
  const [ix, iy] = beltPoint(ITEM_X[at])
  return (
    <svg
      ref={svgRef}
      className={`rm-iso ${className}`}
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
      {/* the finished board stands in front of the last wall, so it is painted after it */}
      <g className="out"><Paths shapes={OUTPUT} /></g>
      <g className="belt"><Paths shapes={BELT} /></g>
      <g className="item" data-item transform={`translate(${ix.toFixed(2)} ${iy.toFixed(2)})`}>
        {ITEM_FORMS.map((f, k) => (
          <g key={k} data-form={k} data-on={k === form ? 1 : 0} style={{ opacity: k === form ? 1 : 0 }}><Paths shapes={f} /></g>
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

/* ── the board that drops onto its plinth (the skápasmíði section) ── */
export const CUBE_LIFT = 110

export const CubeDrop = memo(function CubeDrop() {
  /* three dotted guides run from the board's lower corners down to the plinth; they shorten as it lands */
  const corners = DROP_CORNERS
  return (
    <svg className="rm-iso rm-iso--drop" viewBox="-95 -176 190 272" aria-hidden="true" focusable="false" data-cube-svg>
      <g data-slab><Paths shapes={DROP_PALLET} /></g>
      <g className="guides">
        {corners.map((p, i) => (
          <line key={i} data-guide x1={p[0]} x2={p[0]} y1={p[1] - CUBE_LIFT} y2={p[1]} />
        ))}
      </g>
      <g data-crate transform={`translate(0 ${-CUBE_LIFT})`}><Paths shapes={DROP_BOX} /></g>
    </svg>
  )
})

/* ── the finished board on its plinth, still (the hero) ── */
export const BoardArt = memo(function BoardArt({ label }: { label: string }) {
  return (
    <svg className="rm-iso rm-iso--board" viewBox="-48 -76 114 146" role="img" aria-label={label} focusable="false">
      <Paths shapes={DROP_PALLET} />
      <Paths shapes={HERO_BOARD} />
    </svg>
  )
})

