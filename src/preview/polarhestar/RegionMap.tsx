/**
 * The route map of a long tour, on real geometry.
 *
 * Hotel Laugar's grounds plan, re-aimed: one still map, pins that light per
 * chapter. The chapters are the days — as a day scrolls into reading
 * position its leg is drawn bold, earlier legs stay, later legs are dotted,
 * and the day's end is a numbered marker. Coast, lakes and rivers are
 * OpenStreetMap geometry (geo.ts); every place is a verified lat/lon
 * projected onto the same frame.
 */
import { ITINERARIES, MAP_PLACE, type ItineraryDay } from './itineraries'
import { REGION, project } from './geo'
import type { Lang } from './schedule'

const INK = '#161B3C'
const SLATE = '#57608A'
const CLAY_TX = '#2160A6'
const CLAY = '#3B8FD4'
const LAND = '#F7FAFC'
const LAND_EDGE = '#B7CFE2'
const WATER = '#D9EAF6'
const WATER_DEEP = '#CBE2F2'
const HOME = 'grytubakki'

const pt = (id: string) => {
  const p = MAP_PLACE[id]
  return p ? project(REGION, p.lat, p.lon) : null
}

/** One leg per day: from where the previous day ended through the day's places. */
function legs(days: ItineraryDay[]) {
  let from = HOME
  return days.map((d) => {
    const ids = [from, ...d.places.filter((p) => p !== from || d.places.length === 1)]
    const end = d.places[d.places.length - 1] ?? from
    const leg = { day: d.n, ids, end, pts: ids.map(pt).filter((p): p is [number, number] => !!p) }
    from = end
    return leg
  })
}
const path = (pts: Array<[number, number]>) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(0)} ${y.toFixed(0)}`).join(' ')

export function RegionMap({ tourId, activeDay, lang, onPick }: { tourId: string; activeDay: number; lang: Lang; onPick?: (day: number) => void }) {
  const days: ItineraryDay[] = ITINERARIES[tourId]?.days ?? []
  const L = legs(days)
  const active = L.find((l) => l.day === activeDay)
  const touched = new Set(L.flatMap((l) => l.ids))
  const labelled = new Set([...touched, HOME, 'akureyri', 'godafoss', 'myvatn', 'grenivik'])
  const home = pt(HOME)!
  const t = (is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
  // label placement: a place whose label would sit on a neighbour's goes below-left instead
  const placed: Array<[number, number]> = []
  const SIDES = ['ar', 'bl', 'al', 'br'] as const
  const side = (p: [number, number]) => {
    const n = placed.filter(([x, y]) => Math.abs(x - p[0]) < 150 && Math.abs(y - p[1]) < 34).length
    placed.push(p)
    return SIDES[n % 4]
  }

  return (
    <figure className="m-0 ph-regionmap">
      <style>{`
        .ph-regionmap .leg-on{stroke-dasharray:14 10;animation:phLeg 1.4s linear infinite}
        @keyframes phLeg{to{stroke-dashoffset:-48}}
        @media (max-width: 640px){.ph-regionmap svg .lbl{font-size:34px}.ph-regionmap svg .lbl-sm{font-size:28px}.ph-regionmap svg .sea{font-size:30px}}
        @media (prefers-reduced-motion: reduce){.ph-regionmap .leg-on{animation:none}}
      `}</style>
      <svg
        viewBox={`0 0 ${REGION.width} ${REGION.height}`}
        role="img"
        aria-label={t(`Kort af leið ferðarinnar, dagur ${activeDay}`, `Map of the tour route, day ${activeDay}`, `Karte der Tourroute, Tag ${activeDay}`)}
        className="block h-auto w-full"
        style={{ fontFamily: 'inherit', borderRadius: 18 }}
      >
        <defs>
          <linearGradient id="ph-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={WATER_DEEP} />
            <stop offset="1" stopColor={WATER} />
          </linearGradient>
        </defs>
        <rect width={REGION.width} height={REGION.height} fill="url(#ph-sea)" />
        <g fill={LAND} stroke={LAND_EDGE} strokeWidth="1.6" strokeLinejoin="round">
          {REGION.land.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill={WATER} stroke={LAND_EDGE} strokeWidth="0.8">
          {REGION.lakes.map(([n, d]) => <path key={n + d.length} d={d} />)}
        </g>
        <g fill="none" stroke={CLAY} strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {REGION.rivers.map(([n, d], i) => <path key={n + i} d={d} />)}
        </g>
        {/* water + lake names, light and italic, never fighting the pins */}
        {[
          ['Eyjafjörður', 65.96, -18.32],
          ['Skjálfandi', 66.1, -17.66],
        ].map(([n, la, lo]) => {
          const [x, y] = project(REGION, la as number, lo as number)
          return (
            <text key={n as string} x={x} y={y} className="sea" fontSize="21" fontStyle="italic" fill={SLATE} fillOpacity="0.8" textAnchor="middle">
              {n as string}
            </text>
          )
        })}

        {/* legs: ridden, today, ahead */}
        {L.map((l) => {
          if (l.pts.length < 2) return null
          const state = l.day < activeDay ? 'done' : l.day === activeDay ? 'on' : 'ahead'
          return (
            <path
              key={l.day}
              d={path(l.pts)}
              fill="none"
              className={state === 'on' ? 'leg-on' : undefined}
              stroke={state === 'ahead' ? CLAY : CLAY_TX}
              strokeOpacity={state === 'ahead' ? 0.35 : state === 'done' ? 0.55 : 1}
              strokeWidth={state === 'on' ? 6 : 4}
              strokeDasharray={state === 'ahead' ? '3 9' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        })}

        {/* the farm */}
        <g>
          <path d={`M${home[0] - 13} ${home[1] + 9}v-12l13 -10 13 10v12z`} fill={INK} />
          <text x={home[0] + 19} y={home[1] + 7} className="lbl" fontSize="22" fontWeight="700" fill={INK} paintOrder="stroke" stroke={LAND} strokeWidth="6" strokeLinejoin="round">
            Grýtubakki
          </text>
        </g>

        {/* labels for every place this tour touches (small), the active day's bold */}
        {[...labelled].map((id) => {
          if (id === HOME) return null
          const p = pt(id)
          if (!p) return null
          const onToday = !!active?.ids.includes(id)
          const isEnd = L.some((l) => l.end === id)
          const where = side(p)
          return (
            <g key={id}>
              {!isEnd && <circle cx={p[0]} cy={p[1]} r={onToday ? 7 : 5} fill={onToday ? CLAY_TX : touched.has(id) ? CLAY : '#A9B4C8'} />}
              <text
                x={p[0] + (where.endsWith('r') ? (isEnd ? 22 : 12) : -(isEnd ? 22 : 12))}
                y={p[1] + (where.startsWith('a') ? -9 : 26)}
                textAnchor={where.endsWith('r') ? 'start' : 'end'}
                className={onToday ? 'lbl' : 'lbl-sm'}
                fontSize={onToday ? 22 : 18}
                fontWeight={onToday ? 700 : 400}
                fill={onToday ? INK : touched.has(id) ? SLATE : '#8A93AE'}
                paintOrder="stroke"
                stroke={LAND}
                strokeWidth="6"
                strokeLinejoin="round"
              >
                {MAP_PLACE[id].label}
              </text>
            </g>
          )
        })}

        {/* numbered day markers at each day's end */}
        {L.map((l) => {
          const p = pt(l.end)
          if (!p) return null
          const on = l.day === activeDay
          const done = l.day < activeDay
          return (
            <g key={`d${l.day}`} onClick={onPick ? () => onPick(l.day) : undefined} style={{ cursor: onPick ? 'pointer' : 'default' }}>
              {on && <circle cx={p[0]} cy={p[1]} r="34" fill={CLAY} fillOpacity="0.2" />}
              <circle cx={p[0]} cy={p[1]} r={on ? 19 : 14} fill={on ? CLAY_TX : done ? INK : LAND} stroke={on || done ? LAND : CLAY_TX} strokeWidth={on ? 4 : 3} style={{ transition: 'r .3s, fill .3s' }} />
              <text x={p[0]} y={p[1] + (on ? 7 : 5.5)} fontSize={on ? 19 : 16} fontWeight="700" fill={on || done ? LAND : CLAY_TX} textAnchor="middle">
                {l.day}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-hanken text-[0.72rem]" style={{ color: SLATE }}>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[3px] w-5 rounded" style={{ background: CLAY_TX }} /> {t(`Dagur ${activeDay}`, `Day ${activeDay}`, `Tag ${activeDay}`)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[3px] w-5 rounded" style={{ background: CLAY_TX, opacity: 0.5 }} /> {t('Riðið', 'Ridden', 'Geritten')}</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[3px] w-5 rounded border-t border-dotted" style={{ borderColor: CLAY, background: 'none' }} /> {t('Framundan', 'Ahead', 'Voraus')}</span>
        <span className="ml-auto">{t('Kort: © OpenStreetMap', 'Map: © OpenStreetMap', 'Karte: © OpenStreetMap')}</span>
      </figcaption>
    </figure>
  )
}
