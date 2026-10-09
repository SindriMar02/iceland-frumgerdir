/**
 * The short rides, picked by place, on the real map of the home ground.
 *
 * Dýrahjálp's "the animals sit on the map" re-aimed at a riding farm:
 * OpenStreetMap geometry of the east shore of Eyjafjörður around Grýtubakki
 * (coast, the rivers Gljúfurá and Fnjóská, road 83, Grenivík, Laufás, the
 * hill Þengilshöfði), and one loop per ride from the farm to where it goes,
 * taken from the company's own descriptions: the one-hour ride to Gljúfurá
 * and up into the hills; the two-hour ride over the meadows and moors
 * towards the fjord and the hills of the Fjörður peninsula; the three-hour
 * circuit of Höfði; the winter ride towards the fjord; ride + minigolf at
 * the farm. Tap a loop or its label to pick the ride.
 */
import { FARM, project } from './geo'
import type { Lang } from './schedule'
import type { TourX } from './sanity'

const INK = '#161B3C'
const SLATE = '#57608A'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const LAND = '#F7FAFC'
const LAND_EDGE = '#B7CFE2'
const WATER = '#D9EAF6'
const ROAD = '#C9D1DE'

const GRYTUBAKKI: [number, number] = [65.934, -18.115]
/** Where each ride turns, by tour id: verified feature where one exists (Þengilshöfði peak). */
const TURN: Record<string, { lat: number; lon: number; via?: [number, number]; lx?: number; ly?: number }> = {
  'fyrstu-kynni': { lat: 65.947, lon: -18.082, via: [65.938, -18.095], lx: -5, ly: -6 }, // along Gljúfurá, up the valley
  'moa-og-mela': { lat: 65.966, lon: -18.128, via: [65.95, -18.138], lx: 5, ly: -5 }, // meadows and moors, towards the fjord / Fjörður hills
  hofdahringur: { lat: 65.936, lon: -18.176, via: [65.925, -18.15], lx: -6, ly: -7 }, // the circuit of Þengilshöfði
  frostrosir: { lat: 65.924, lon: -18.142, via: [65.927, -18.125], lx: 5, ly: 11 }, // winter ride towards the fjord
  sumarsaela: { lat: 65.934, lon: -18.115, lx: 6, ly: 15 }, // ride + minigolf at the farm
}
// the frame is cropped to the farm's surroundings
const VIEW = (() => {
  const [x0, y0] = project(FARM, 65.978, -18.245)
  const [x1, y1] = project(FARM, 65.908, -18.02)
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
})()

export function FarmMap({ tours, lang, selected, onPick }: { tours: TourX[]; lang: Lang; selected?: string; onPick: (id: string) => void }) {
  const t = (is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
  const home = project(FARM, ...GRYTUBAKKI)
  const grenivik = project(FARM, 65.9475, -18.18)
  const laufas = project(FARM, 65.895, -18.071)
  const hofdi = project(FARM, 65.936, -18.176)
  const sea = project(FARM, 65.955, -18.215)
  const loop = (id: string) => {
    const c = TURN[id]
    if (!c) return null
    const to = project(FARM, c.lat, c.lon)
    if (!c.via) return { d: '', to }
    // out one way, back the other: a lens between the farm and the turn
    const dx = to[0] - home[0]
    const dy = to[1] - home[1]
    const n = Math.hypot(dx, dy) || 1
    const w = Math.max(9, n * 0.22)
    const ox = (-dy / n) * w
    const oy = (dx / n) * w
    const mx = home[0] + dx * 0.5
    const my = home[1] + dy * 0.5
    return {
      d: `M${home[0]} ${home[1]} Q${mx + ox} ${my + oy} ${to[0]} ${to[1]} Q${mx - ox} ${my - oy} ${home[0]} ${home[1]}`,
      to,
    }
  }
  return (
    <figure className="m-0 ph-farmmap">
      <style>{`
        .ph-farmmap .ride{cursor:pointer;outline:none}
        .ph-farmmap .ride path{transition:stroke-opacity .3s, stroke-width .3s}
        .ph-farmmap .ride:hover path, .ph-farmmap .ride:focus-visible path{stroke-opacity:1}
        .ph-farmmap .ride:focus-visible circle{stroke:#202070;stroke-width:2}
        .ph-farmmap .ride[data-on="true"] .loop{stroke-dasharray:4 3;animation:phRide 1.6s linear infinite}
        @keyframes phRide{to{stroke-dashoffset:-14}}
        @media (max-width: 640px){.ph-farmmap svg .lbl{font-size:9px}.ph-farmmap svg .lbl-sm{font-size:7.5px}.ph-farmmap svg .sea{font-size:9px}}
        @media (prefers-reduced-motion: reduce){.ph-farmmap .ride[data-on="true"] .loop{animation:none}}
      `}</style>
      <svg
        viewBox={`${VIEW.x.toFixed(0)} ${VIEW.y.toFixed(0)} ${VIEW.w.toFixed(0)} ${VIEW.h.toFixed(0)}`}
        role="group"
        aria-label={t('Kort af heimalandinu og hvert hver reiðtúr fer', 'Map of the home ground and where each ride goes', 'Karte des Hofgeländes und wohin jeder Ritt führt')}
        className="block h-auto w-full"
        style={{ borderRadius: 18 }}
      >
        <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={WATER} />
        <g fill={LAND} stroke={LAND_EDGE} strokeWidth="0.6" strokeLinejoin="round">
          {FARM.land.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="none" stroke={ROAD} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          {FARM.roads.map(([n, d], i) => <path key={n + i} d={d} />)}
        </g>
        <g fill="none" stroke={CLAY} strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          {FARM.rivers.map(([n, d], i) => <path key={n + i} d={d} />)}
        </g>
        <text x={sea[0]} y={sea[1]} className="sea" fontSize="7" fontStyle="italic" fill={SLATE} fillOpacity="0.8" textAnchor="middle">Eyjafjörður</text>
        {/* places */}
        <g>
          <circle cx={grenivik[0]} cy={grenivik[1]} r="1.6" fill={SLATE} />
          <text x={grenivik[0] + 3} y={grenivik[1] - 2.5} className="lbl-sm" fontSize="6" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="1.6">Grenivík</text>
          <circle cx={laufas[0]} cy={laufas[1]} r="1.6" fill={SLATE} />
          <text x={laufas[0] + 3} y={laufas[1] + 2} className="lbl-sm" fontSize="6" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="1.6">Laufás</text>
          <path d={`M${hofdi[0] - 4} ${hofdi[1] + 2}l4 -5 4 5z`} fill="none" stroke={SLATE} strokeWidth="0.8" strokeLinejoin="round" />
          <text x={hofdi[0] - 4} y={hofdi[1] + 8} className="lbl-sm" fontSize="6" fill={SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="1.6">Þengilshöfði</text>
          {(() => {
            const r = project(FARM, 65.956, -18.062)
            return <text x={r[0]} y={r[1]} className="lbl-sm" fontSize="6" fontStyle="italic" fill={CLAY_TX} fillOpacity="0.8" paintOrder="stroke" stroke={LAND} strokeWidth="1.6">Gljúfurá</text>
          })()}
          <path d={`M${home[0] - 4} ${home[1] + 3}v-4l4 -3.2 4 3.2v4z`} fill={INK} />
          <text x={home[0] + 6} y={home[1] + 2} className="lbl" fontSize="7" fontWeight="700" fill={INK} paintOrder="stroke" stroke={LAND} strokeWidth="1.6">Grýtubakki</text>
        </g>
        {/* one loop per ride */}
        {tours.map((tour) => {
          const l = loop(tour.id)
          if (!l) return null
          const on = tour.id === selected
          const c = TURN[tour.id]
          const lx = l.to[0] + (c.lx ?? 10)
          const ly = l.to[1] + (c.ly ?? -8)
          return (
            <g
              key={tour.id}
              className="ride"
              data-on={on}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${tour.name[lang]} · ${tour.meta[lang]}`}
              onClick={() => onPick(tour.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(tour.id) } }}
            >
              {l.d && <path className="loop" d={l.d} fill={on ? CLAY : 'none'} fillOpacity={on ? 0.08 : 0} stroke={on ? CLAY_TX : CLAY} strokeOpacity={on ? 1 : 0.55} strokeWidth={on ? 1.6 : 1.1} strokeLinecap="round" strokeLinejoin="round" />}
              {on && <circle cx={l.to[0]} cy={l.to[1]} r="8" fill={CLAY} fillOpacity="0.2" />}
              <circle cx={l.to[0]} cy={l.to[1]} r={on ? 3.6 : 2.8} fill={on ? CLAY_TX : LAND} stroke={CLAY_TX} strokeWidth="1.1" style={{ transition: 'r .3s, fill .3s' }} />
              <text x={lx} y={ly} className="lbl" fontSize={on ? 7.4 : 7} fontWeight={on ? 700 : 600} fill={INK} paintOrder="stroke" stroke={LAND} strokeWidth="1.8" strokeLinejoin="round" textAnchor={(c.lx ?? 10) < 0 ? 'end' : 'start'}>
                {tour.name[lang]}
              </text>
              <text x={lx} y={ly + 7.5} className="lbl-sm" fontSize="5.6" fill={on ? CLAY_TX : SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="1.8" strokeLinejoin="round" textAnchor={(c.lx ?? 10) < 0 ? 'end' : 'start'}>
                {tour.meta[lang]}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 font-hanken text-[0.72rem]" style={{ color: SLATE }}>
        <span>{t('Hver reiðtúr er sýndur sem hringur frá bænum. Smelltu á ferð til að velja hana.', 'Each ride is drawn as a loop from the farm. Tap one to pick it.', 'Jeder Ritt ist als Runde vom Hof gezeichnet. Tippe auf einen, um ihn zu wählen.')}</span>
        <span>{t('Kort: © OpenStreetMap', 'Map: © OpenStreetMap', 'Karte: © OpenStreetMap')}</span>
      </figcaption>
    </figure>
  )
}
