/**
 * Where the short rides go, on the real map of the home ground.
 *
 * OpenStreetMap geometry of the east shore of Eyjafjörður around Grýtubakki
 * (coast, the rivers Gljúfurá and Fnjóská, road 83, Grenivík, Laufás, the
 * hill Þengilshöfði) with one shaded riding area around the farm. Símon,
 * 23 Oct 2026: keep the map but drop the line per ride; the guide picks the
 * way on the day, so the map says "the short rides are in this area".
 * The area spans the places the company's own ride descriptions name
 * (Gljúfurá and the hills, the meadows towards the fjord, the circuit of
 * Þengilshöfði), masked to the land.
 *
 * In this frame the stitched OSM polygon closes on the water side, so
 * FARM.land outlines the fjord: it is filled as water on a land ground.
 */
import { FARM, project } from './geo'
import type { Lang } from './schedule'

const INK = '#161B3C'
const SLATE = '#57608A'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const LAND = '#F7FAFC'
const LAND_EDGE = '#B7CFE2'
const WATER = '#D9EAF6'
const ROAD = '#C9D1DE'

const GRYTUBAKKI: [number, number] = [65.934, -18.115]
/** The riding area: centre and half-extents in degrees, from the farthest points the ride texts name. */
const AREA = { lat: 65.945, lon: -18.128, dLat: 0.031, dLon: 0.068 }
// the frame shows the area with its surroundings (the fjord, Grenivík, Laufás)
const VIEW = (() => {
  const [x0, y0] = project(FARM, 65.995, -18.29)
  const [x1, y1] = project(FARM, 65.885, -17.975)
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
})()

export function FarmMap({ lang }: { lang: Lang }) {
  const t = (is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
  const home = project(FARM, ...GRYTUBAKKI)
  const grenivik = project(FARM, 65.9475, -18.18)
  const laufas = project(FARM, 65.895, -18.071)
  const hofdi = project(FARM, 65.936, -18.176)
  const sea = project(FARM, 65.96, -18.245)
  const gljufura = project(FARM, 65.956, -18.062)
  const [cx, cy] = project(FARM, AREA.lat, AREA.lon)
  const [ex] = project(FARM, AREA.lat, AREA.lon + AREA.dLon)
  const [, ey] = project(FARM, AREA.lat - AREA.dLat, AREA.lon)
  const rx = ex - cx
  const ry = ey - cy
  const areaLabel = project(FARM, AREA.lat + AREA.dLat * 0.62, AREA.lon + 0.004)
  return (
    <figure className="m-0 ph-farmmap">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px){.ph-farmmap svg .lbl{font-size:24px}.ph-farmmap svg .lbl-sm{font-size:20px}.ph-farmmap svg .sea{font-size:21px}.ph-farmmap svg .area{font-size:25px}}
      ` }} />
      <svg
        viewBox={`${VIEW.x.toFixed(0)} ${VIEW.y.toFixed(0)} ${VIEW.w.toFixed(0)} ${VIEW.h.toFixed(0)}`}
        role="img"
        aria-label={t(
          'Kort af heimalandinu: stuttu reiðtúrarnir eru á svæðinu í kringum Grýtubakka',
          'Map of the home ground: the short rides are in the area around Grýtubakki',
          'Karte des Hofgeländes: die kurzen Ritte finden rund um Grýtubakki statt',
        )}
        className="block h-auto w-full"
        style={{ borderRadius: 18 }}
      >
        <defs>
          <mask id="ph-farm-land" maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="#fff" />
            {FARM.land.map((d, i) => <path key={i} d={d} fill="#000" />)}
          </mask>
        </defs>
        <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={LAND} />
        <g fill={WATER} stroke={LAND_EDGE} strokeWidth="1" strokeLinejoin="round">
          {FARM.land.map((d, i) => <path key={i} d={d} />)}
        </g>
        {/* the riding area, on land only */}
        <g mask="url(#ph-farm-land)">
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={CLAY} fillOpacity="0.13" stroke={CLAY_TX} strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="5 4" />
        </g>
        <g fill="none" stroke={ROAD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {FARM.roads.map(([n, d], i) => <path key={`${n}-${i}`} d={d} />)}
        </g>
        <g fill="none" stroke={CLAY} strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          {FARM.rivers.map(([n, d], i) => <path key={`${n}-${i}`} d={d} />)}
        </g>
        <text x={sea[0]} y={sea[1]} className="sea" fontSize="14" fontStyle="italic" fill={SLATE} fillOpacity="0.8" textAnchor="middle">Eyjafjörður</text>
        <text x={areaLabel[0]} y={areaLabel[1]} className="area" fontSize="16" fontWeight="700" fill={CLAY_TX} paintOrder="stroke" stroke={LAND} strokeWidth="3.4" strokeLinejoin="round" textAnchor="middle">
          {t('Stuttu reiðtúrarnir', 'The short rides', 'Die kurzen Ritte')}
        </text>
        {/* places */}
        <g>
          <circle cx={grenivik[0]} cy={grenivik[1]} r="2.2" fill={SLATE} />
          <text x={grenivik[0] - 5} y={grenivik[1] - 5} className="lbl-sm" fontSize="12" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="2.8" textAnchor="end">Grenivík</text>
          <circle cx={laufas[0]} cy={laufas[1]} r="2.2" fill={SLATE} />
          <text x={laufas[0] + 5} y={laufas[1] + 4} className="lbl-sm" fontSize="12" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="2.8">Laufás</text>
          <path d={`M${hofdi[0] - 5} ${hofdi[1] + 3}l5 -6.5 5 6.5z`} fill="none" stroke={SLATE} strokeWidth="1" strokeLinejoin="round" />
          <text x={hofdi[0]} y={hofdi[1] + 16} className="lbl-sm" fontSize="12" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="2.8" textAnchor="middle">Þengilshöfði</text>
          <text x={gljufura[0]} y={gljufura[1]} className="lbl-sm" fontSize="12" fontStyle="italic" fill={CLAY_TX} fillOpacity="0.85" paintOrder="stroke" stroke={LAND} strokeWidth="2.8">Gljúfurá</text>
          <path d={`M${home[0] - 5.5} ${home[1] + 4}v-5.5l5.5 -4.4 5.5 4.4v5.5z`} fill={INK} />
          <text x={home[0] + 10} y={home[1] + 4} className="lbl" fontSize="14" fontWeight="700" fill={INK} paintOrder="stroke" stroke={LAND} strokeWidth="3">Grýtubakki</text>
        </g>
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 font-hanken text-[0.72rem]" style={{ color: SLATE }}>
        <span>
          {t(
            'Allir stuttu reiðtúrarnir byrja á bænum og eru á þessu svæði.',
            'Every short ride starts at the farm and stays within this area.',
            'Alle kurzen Ritte beginnen am Hof und bleiben in diesem Gebiet.',
          )}
        </span>
        <span>{t('Kort: © OpenStreetMap', 'Map: © OpenStreetMap', 'Karte: © OpenStreetMap')}</span>
      </figcaption>
    </figure>
  )
}
