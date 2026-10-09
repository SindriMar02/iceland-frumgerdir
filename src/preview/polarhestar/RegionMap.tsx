/**
 * Schematic map of the riding country between Eyjafjörður and Mývatn.
 *
 * Hotel Laugar's grounds plan, re-aimed: one still map, pins that light per
 * chapter. Here the chapters are the days of a long tour — as a day scrolls
 * into reading position its places light up and the route drawn so far
 * reaches them. Water shapes are drawn by hand to the same projection as the
 * places (see itineraries.ts); it is a diagram of where a day goes, not a
 * survey, and says so.
 */
import { ITINERARIES, MAP_PLACE, type ItineraryDay } from './itineraries'
import type { Lang } from './schedule'

const INK = '#161B3C'
const SLATE = '#57608A'
const CLAY_TX = '#2160A6'
const CLAY = '#3B8FD4'
const ICE = '#9BD8F3'
const LAND = '#F7FAFC'
const WATER = '#D7EBF7'

/* water, in map units (viewBox 0 0 1000 700): ocean, Eyjafjörður, the two
   small fjords of Fjörður, Skjálfandi bay, the lakes */
const OCEAN = 'M0 0H1000V52C900 60 760 48 640 56 520 64 430 52 360 60 300 66 260 58 220 64 160 70 90 60 0 70Z'
const EYJAFJORDUR = 'M229 444C214 400 206 350 196 300 184 250 172 200 150 150 136 118 118 90 96 70L30 70C50 120 70 180 96 240 122 300 150 360 180 420 196 440 212 448 229 444Z'
const HVALVATNSFJORDUR = 'M232 64C240 80 246 92 250 104 254 116 262 104 266 94 270 84 268 72 272 62Z'
const THORGEIRSFJORDUR = 'M282 62C286 76 290 88 296 100 300 110 310 96 314 86 318 76 316 68 320 60Z'
const SKJALFANDI = 'M356 58C372 100 384 140 400 178 416 196 450 200 480 198 510 194 540 182 556 160 562 120 560 90 566 58Z'
const MYVATN = 'M792 498C800 480 832 476 860 486 882 494 884 520 864 532 840 544 806 540 792 526 784 518 786 506 792 498Z'

export function RegionMap({
  tourId,
  activeDay,
  lang,
  onPick,
}: {
  tourId: string
  /** 1-based day currently in reading position */
  activeDay: number
  lang: Lang
  onPick?: (day: number) => void
}) {
  const days: ItineraryDay[] = ITINERARIES[tourId]?.days ?? []
  // the route in map order: every place of every day, de-duplicated per step
  const steps = days.flatMap((d) => d.places.map((p) => ({ day: d.n, p: MAP_PLACE[p] }))).filter((s) => s.p)
  const litSteps = steps.filter((s) => s.day <= activeDay)
  const path = (list: typeof steps) => list.map((s, i) => `${i ? 'L' : 'M'}${s.p.x} ${s.p.y}`).join(' ')
  const used = new Map<string, number[]>()
  for (const s of steps) used.set(s.p.id, [...(used.get(s.p.id) ?? []), s.day])
  const anchors = ['grytubakki', 'akureyri', 'grenivik', 'godafoss', 'myvatn']
  const shown = new Set([...used.keys(), ...anchors.filter((a) => MAP_PLACE[a])])

  return (
    <figure className="m-0 ph-regionmap">
      {/* the drawing is 1000 units wide; on a phone that is ~360px, so every
          label is set in larger units there to stay readable */}
      <style>{`@media (max-width: 640px){.ph-regionmap svg text{font-size:26px}.ph-regionmap svg circle{r:12px}}`}</style>
      <svg
        viewBox="0 0 1000 700"
        role="img"
        aria-label={
          lang === 'is'
            ? `Skýringarkort af leið ferðarinnar, dagur ${activeDay}`
            : lang === 'de'
              ? `Schematische Karte der Tourroute, Tag ${activeDay}`
              : `Schematic map of the tour route, day ${activeDay}`
        }
        className="block h-auto w-full"
        style={{ fontFamily: 'inherit' }}
      >
        <rect width="1000" height="700" fill={LAND} rx="24" />
        <g fill={WATER} stroke={ICE} strokeWidth="1.5">
          <path d={OCEAN} />
          <path d={EYJAFJORDUR} />
          <path d={HVALVATNSFJORDUR} />
          <path d={THORGEIRSFJORDUR} />
          <path d={SKJALFANDI} />
          <path d={MYVATN} />
          <ellipse cx="63" cy="190" rx="14" ry="20" fill={LAND} />
          <circle cx={MAP_PLACE.vestmannsvatn.x} cy={MAP_PLACE.vestmannsvatn.y} r="9" />
          <circle cx={MAP_PLACE.masvatn.x} cy={MAP_PLACE.masvatn.y} r="10" />
        </g>
        <text x="40" y="104" fontSize="15" fill={SLATE} fontStyle="italic">Eyjafjörður</text>
        <text x="412" y="96" fontSize="15" fill={SLATE} fontStyle="italic">Skjálfandi</text>
        <text x="52" y="194" fontSize="11" fill={SLATE}>Hrísey</text>

        {/* the whole route, faint; the part ridden so far, in fjord blue */}
        <path d={path(steps)} fill="none" stroke={CLAY} strokeOpacity="0.22" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={path(litSteps)}
          fill="none"
          stroke={CLAY_TX}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: 'd .6s cubic-bezier(.2,.7,.2,1)' }}
        />

        {[...shown].map((id) => {
          const p = MAP_PLACE[id]
          const its = used.get(id) ?? []
          const on = its.includes(activeDay)
          const passed = its.some((d) => d < activeDay)
          const home = id === 'grytubakki'
          const r = on ? 9 : home ? 7 : 5
          const fill = on ? CLAY_TX : passed ? CLAY : its.length ? LAND : '#C9D1DE'
          const stroke = on || passed ? CLAY_TX : its.length ? CLAY : '#C9D1DE'
          const labelAbove = p.y > 60
          return (
            <g
              key={id}
              style={{ cursor: onPick && its.length ? 'pointer' : 'default', transition: 'opacity .4s' }}
              opacity={its.length || home ? 1 : 0.7}
              onClick={onPick && its.length ? () => onPick(its[0]) : undefined}
            >
              {on && <circle cx={p.x} cy={p.y} r="18" fill={CLAY} fillOpacity="0.18" />}
              <circle cx={p.x} cy={p.y} r={r} fill={fill} stroke={stroke} strokeWidth="2.5" style={{ transition: 'r .35s, fill .35s' }} />
              {home && <circle cx={p.x} cy={p.y} r="2.5" fill={LAND} />}
              <text
                x={p.x + (on ? 14 : 10)}
                y={labelAbove ? p.y - (on ? 12 : 9) : p.y + 20}
                fontSize={on ? 15 : its.length ? 13 : 12}
                fontWeight={on ? 600 : 400}
                fill={on ? INK : its.length ? SLATE : '#8A93AE'}
                paintOrder="stroke"
                stroke={LAND}
                strokeWidth="4"
                strokeLinejoin="round"
              >
                {p.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 font-hanken text-[0.7rem]" style={{ color: SLATE }}>
        {lang === 'is'
          ? 'Skýringarkort, ekki í mælikvarða. Leiðin sýnir hvert hver dagur fer.'
          : lang === 'de'
            ? 'Schematische Karte, nicht maßstabsgetreu. Die Linie zeigt, wohin jeder Tag führt.'
            : 'Schematic map, not to scale. The line shows where each day goes.'}
      </figcaption>
    </figure>
  )
}
