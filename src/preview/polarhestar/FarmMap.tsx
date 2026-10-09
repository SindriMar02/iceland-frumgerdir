/**
 * The short rides, picked by place.
 *
 * Dýrahjálp's "the animals sit on the map" re-aimed at a riding farm: one
 * schematic drawing of the home ground (the fjord, the shore, Grýtubakki,
 * the river Gljúfurá rising in the hills, Höfði to the north) and a pin where
 * each ride goes, with its length. A pin selects the ride; the cards below
 * follow. Where each ride goes is taken from the company's own descriptions:
 * the one-hour ride to Gljúfurá and up into the hills, the two-hour ride over
 * the meadows and moors towards the fjord or the hills of the Fjörður
 * peninsula, the three-hour circuit of Höfði, the winter ride towards the
 * fjord, and ride + minigolf at the farm. Schematic, not to scale.
 */
import type { Lang } from './schedule'
import type { TourX } from './sanity'

const INK = '#161B3C'
const SLATE = '#57608A'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const CLAY_FILL = '#202070'
const ICE = '#9BD8F3'
const LAND = '#F7FAFC'
const WATER = '#D7EBF7'
const HILL = '#E3E9F2'

/** Where each ride goes on the drawing, by tour id (viewBox 0 0 1000 560). */
const PIN: Record<string, { x: number; y: number; dx?: number }> = {
  'fyrstu-kynni': { x: 560, y: 300 }, // along Gljúfurá, up towards the hills
  'moa-og-mela': { x: 470, y: 180 }, // meadows and moors towards the fjord / Fjörður hills
  hofdahringur: { x: 300, y: 92 }, // the circuit of Höfði
  frostrosir: { x: 330, y: 330 }, // winter ride towards the fjord
  sumarsaela: { x: 420, y: 258, dx: 18 }, // ride + minigolf at the farm
}
const FARM = { x: 400, y: 262 }

export function FarmMap({ tours, lang, selected, onPick }: { tours: TourX[]; lang: Lang; selected?: string; onPick: (id: string) => void }) {
  const t = (is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
  return (
    <figure className="m-0 ph-farmmap">
      {/* the drawing is 1000 units wide; on a phone that is ~360px, so every
          label is set in larger units there to stay readable */}
      <style>{`@media (max-width: 640px){.ph-farmmap svg text{font-size:26px}.ph-farmmap svg circle{r:12px}}`}</style>
      <svg viewBox="0 0 1000 560" role="group" aria-label={t('Skýringarmynd af heimalandinu og hvert hver reiðtúr fer', 'Schematic drawing of the home ground and where each ride goes', 'Schematische Zeichnung des Hofgeländes und wohin jeder Ritt führt')} className="block h-auto w-full">
        <rect width="1000" height="560" rx="24" fill={LAND} />
        {/* hills to the east, the fjord to the west, the shore between */}
        <path d="M620 560C660 420 700 330 760 250 820 170 900 120 1000 90V560Z" fill={HILL} />
        <path d="M700 560C740 460 790 380 860 320 920 270 960 250 1000 240V560Z" fill="#D8E0EC" />
        <path d="M0 0H240C230 80 215 150 230 230 245 310 275 380 300 440 320 490 330 530 330 560H0Z" fill={WATER} stroke={ICE} strokeWidth="1.5" />
        {/* Gljúfurá, from the hills down past the farm to the fjord */}
        <path d="M900 300C820 300 760 320 700 300 640 280 600 300 560 300 520 300 470 290 430 280 390 270 350 290 300 320 280 332 262 346 246 360" fill="none" stroke={CLAY} strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
        {/* Höfði, the Ice Age hill on the coast north of Grenivík */}
        <ellipse cx="300" cy="92" rx="58" ry="34" fill={HILL} stroke="#C9D1DE" />
        <text x="300" y="60" textAnchor="middle" fontSize="13" fill={SLATE}>Höfði</text>
        <text x="60" y="300" fontSize="15" fill={SLATE} fontStyle="italic">Eyjafjörður</text>
        <text x="820" y="150" fontSize="13" fill={SLATE} fontStyle="italic">{t('Fjöllin', 'The hills', 'Die Berge')}</text>
        <text x="700" y="325" fontSize="12" fill={CLAY_TX} fontStyle="italic">Gljúfurá</text>
        <text x="245" y="162" fontSize="12" fill={SLATE}>Grenivík</text>
        <circle cx="236" cy="170" r="4" fill={SLATE} />
        <text x="120" y="545" fontSize="12" fill={SLATE}>← Akureyri</text>
        {/* the farm */}
        <g>
          <path d={`M${FARM.x - 16} ${FARM.y + 10}v-14l16 -12 16 12v14z`} fill={CLAY_FILL} />
          <text x={FARM.x} y={FARM.y + 30} textAnchor="middle" fontSize="13" fontWeight="600" fill={INK}>Grýtubakki</text>
        </g>
        {/* one pin per ride */}
        {tours.map((tour) => {
          const p = PIN[tour.id]
          if (!p) return null
          const on = tour.id === selected
          return (
            <g key={tour.id} role="button" tabIndex={0} aria-pressed={on} aria-label={`${tour.name[lang]} · ${tour.meta[lang]}`} onClick={() => onPick(tour.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(tour.id) } }} style={{ cursor: 'pointer', outline: 'none' }} className="ph-pin">
              <line x1={FARM.x} y1={FARM.y} x2={p.x} y2={p.y} stroke={on ? CLAY_TX : CLAY} strokeOpacity={on ? 0.9 : 0.25} strokeWidth="2" strokeDasharray={on ? undefined : '4 6'} />
              {on && <circle cx={p.x} cy={p.y} r="20" fill={CLAY} fillOpacity=".18" />}
              <circle cx={p.x} cy={p.y} r={on ? 10 : 8} fill={on ? CLAY_TX : LAND} stroke={CLAY_TX} strokeWidth="2.5" style={{ transition: 'r .3s, fill .3s' }} />
              <text x={p.x + (p.dx ?? 16)} y={p.y - 8} fontSize={on ? 15 : 14} fontWeight={on ? 700 : 500} fill={INK} paintOrder="stroke" stroke={LAND} strokeWidth="4" strokeLinejoin="round">
                {tour.name[lang]}
              </text>
              <text x={p.x + (p.dx ?? 16)} y={p.y + 10} fontSize="12" fill={on ? CLAY_TX : SLATE} paintOrder="stroke" stroke={LAND} strokeWidth="4" strokeLinejoin="round">
                {tour.meta[lang]}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-2 font-hanken text-[0.7rem]" style={{ color: SLATE }}>
        {t('Skýringarmynd, ekki í mælikvarða. Smelltu á ferð til að sjá hana.', 'Schematic drawing, not to scale. Tap a ride to see it.', 'Schematische Zeichnung, nicht maßstabsgetreu. Tippe auf einen Ritt.')}
      </figcaption>
    </figure>
  )
}
