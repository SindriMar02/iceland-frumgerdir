import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GEO } from './geo'
import { DOORS, STATEMENT } from './data'

/* ── THE LAKES: the collection's map (round 7). ────────────────────────────
   Real OpenStreetMap geometry from geo.ts (ODbL), drawn in the page's own
   three colours: the ground is the ICE page itself, the sea and the lakes
   are DUSK laid thin, roads are INK hairlines (the ring road and the Golden
   Circle routes 35/36/37/360 a touch heavier), coast and rivers a hairline
   between. Nothing is a tile, nothing is grey Google.
   The pins mark the LAKE each house stands on, never a parcel: the houses'
   exact positions are not verified, and the lake is what the guest is buying.
   Geometry lives in the SVG; every label is HTML laid over it by percentage,
   so type keeps its rem size at every width instead of scaling with the map.
   ───────────────────────────────────────────────────────────────────────── */

const ROOT = '/preview/icelandluxurylodges'

type Pt = readonly [number, number]
/* [x, y, w, h] in GEO units */
type Crop = readonly [number, number, number, number]

/* the three lakeside positions + the city key */
export const PINS: { id: string; names: string[]; lake: string; c: Pt; side: 'l' | 'r'; note?: string }[] = [
  { id: 'ulfljotsskali', names: ['Úlfljótsskáli'], lake: 'Úlfljótsvatn', c: [690, 372], side: 'l' },
  { id: 'alftavik', names: ['Álftavík', 'Áslundur'], lake: 'Álftavatn', c: [724, 483], side: 'r', note: '50\u00a0minutes from Reykjavík' },
  { id: 'reykjavik', names: ['The apartment'], lake: 'Reykjavík', c: [101.8, 315.8], side: 'r' },
]
/* which pin a house page highlights */
const PIN_OF: Record<string, string> = { ulfljotsskali: 'ulfljotsskali', alftavik: 'alftavik', aslundur: 'alftavik' }

/* towns worth a word; the capital-area cluster is one label, Reykjavík */
const TOWNS = new Set(['Selfoss', 'Hveragerði', 'Laugarvatn', 'Mosfellsbær', 'Hafnarfjörður', 'Þorlákshöfn', 'Akranes'])
/* lakes that get their own italic word */
const LAKE_WORDS: Record<string, [number, number]> = { Þingvallavatn: [643.7, 230], Apavatn: [930.5, 290], Kleifarvatn: [80.5, 652], Hestvatn: [899.1, 504] }

const CROPS: Record<string, Crop> = {
  /* the whole Golden Circle from the capital to Hvítá, landscape */
  landing: [30, 110, 960, 610],
  /* phones: the lakes themselves; Reykjavík is pointed to off the left edge */
  landingNarrow: [420, 150, 560, 520],
  /* house pages: the two lakes and the road between them */
  house: [540, 255, 340, 280],
}

/* Faxaflói: the long coast way runs from Hvalfjörður (top) to Reykjanes
   (left edge) with the land on its left hand, so closing it through the
   frame's top-left corner encloses the sea. The south coast runs along the
   bottom edge, land to its north, so it closes through the bottom-left. */
const SEA = [
  `${GEO.coast[1]}L-40 ${471.3}L-40 -40L316.6 -40Z`,
  `${GEO.coast[11]}L830 900L-40 900L-40 772.6Z`,
]

function useNarrow(q = '(max-width: 640px)') {
  const [n, setN] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setN(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return n
}

export function LakeMap({ crop, focus, legend = false }: { crop: Crop; focus?: string; legend?: boolean }) {
  const [cx, cy, cw, ch] = crop
  const narrow = useNarrow()
  /* on a phone a label to the right of a pin past mid-stage would leave the stage */
  const sideOf = (p: { c: Pt; side: 'l' | 'r' }) => (narrow && (p.c[0] - cx) / cw > 0.45 ? 'l' : p.side)
  const pct = (p: Pt) => ({ left: `${((p[0] - cx) / cw) * 100}%`, top: `${((p[1] - cy) / ch) * 100}%` })
  const inside = (p: Pt, pad = 0) => p[0] > cx + pad && p[0] < cx + cw - pad && p[1] > cy + pad && p[1] < cy + ch - pad
  const off = PINS.filter((p) => !inside(p.c, 6))
  return (
    <div className="ill-map-stage" role="group" aria-label="Map of the Golden Circle lakes: Reykjavík, Þingvallavatn, Úlfljótsvatn and Álftavatn" style={{ aspectRatio: `${cw} / ${ch}` }}>
      <svg className="ill-map-svg" viewBox={`${cx} ${cy} ${cw} ${ch}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <g className="ill-map-l ill-map-sea">{SEA.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="ill-map-l ill-map-lakes">{GEO.lakes.map((l, i) => <path key={i} d={l.d} />)}</g>
        <g className="ill-map-l ill-map-rivers">{GEO.rivers.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="ill-map-l ill-map-coast">{GEO.coast.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="ill-map-l ill-map-roads">{GEO.roads.filter((r) => !r.main).map((r) => <path key={r.ref} d={r.d} className={r.ref === 'x' ? 'is-lane' : ''} />)}</g>
        <g className="ill-map-l ill-map-main">{GEO.roads.filter((r) => r.main).map((r) => <path key={r.ref} d={r.d} />)}</g>
        <g className="ill-map-l ill-map-towns">
          {GEO.places.filter((p) => TOWNS.has(p.name) && inside(p.p, 8)).map((p) => <circle key={p.name} cx={p.p[0]} cy={p.p[1]} r={1.9} />)}
        </g>
      </svg>
      <div className="ill-map-labels">
        {Object.entries(LAKE_WORDS).filter(([, p]) => inside(p, 20)).map(([name, p]) => (
          <span key={name} className="ill-map-lake" style={pct(p)}>{name}</span>
        ))}
        {GEO.places.filter((p) => TOWNS.has(p.name) && inside(p.p, 8)).map((p) => (
          <span key={p.name} className={`ill-map-town ${p.p[0] > cx + cw * 0.82 ? 'is-flip' : ''}`} style={pct(p.p)}>{p.name}</span>
        ))}
        {PINS.filter((p) => inside(p.c, 6)).map((p) => {
          const isFocus = focus ? PIN_OF[focus] === p.id : false
          const dim = focus ? !isFocus : false
          return (
            <div key={p.id} className={`ill-map-pin is-${sideOf(p)} ${isFocus ? 'is-focus' : ''} ${dim ? 'is-dim' : ''} ${p.id === 'reykjavik' ? 'is-key' : ''}`} style={pct(p.c)}>
              <i aria-hidden="true" />
              <span className="ill-map-pin-l">
                <b>{p.names.map((n, i) => {
                  const own = !focus || DOORS.find((d) => d.id === focus)?.name === n || p.id === 'reykjavik'
                  return <em key={n} className={own ? '' : 'is-other'}>{i ? ' · ' : ''}{n}</em>
                })}</b>
                <small>{p.lake}</small>
              </span>
            </div>
          )
        })}
        {off.map((p) => (
          <span key={p.id} className="ill-map-off" style={{ top: pct(p.c).top }}>
            <i aria-hidden="true">←</i> {p.lake}
          </span>
        ))}
      </div>
      {legend && <p className="ill-map-credit">Map data © OpenStreetMap contributors</p>}
    </div>
  )
}

/* ── landing: the lakes section between the chapters and the evening ── */
export function MapSection() {
  const narrow = useNarrow()
  const [hover, setHover] = useState<string | undefined>()
  return (
    <section className="ill-map" id="vatnin" aria-labelledby="ill-map-h">
      <header className="ill-chapter-head">
        <div className="ill-chapter-ord" aria-hidden="true">~</div>
        <div>
          <h2 className="ill-chapter-name" id="ill-map-h">The lakes</h2>
          <p className="ill-chapter-water"><span className="ill-rise-in">Two lakes of the Golden Circle, inside an hour from the city</span></p>
        </div>
      </header>
      <div className="ill-map-grid">
        <LakeMap crop={narrow ? CROPS.landingNarrow : CROPS.landing} focus={hover} legend />
        <div className="ill-map-index">
          <p className="ill-map-index-p">{STATEMENT.body}</p>
          <ul className="ill-map-rows" onMouseLeave={() => setHover(undefined)}>
            {DOORS.map((d) => {
              const pin = PINS.find((p) => p.id === PIN_OF[d.id])!
              return (
                <li key={d.id} onMouseEnter={() => setHover(d.id)}>
                  <Link to={`${ROOT}/${d.id}`} onFocus={() => setHover(d.id)} onBlur={() => setHover(undefined)}>
                    <span className="ill-map-row-name">{d.name}</span>
                    <span className="ill-map-row-lake">{d.id === 'ulfljotsskali' ? 'by' : 'on'} {pin.lake}</span>
                    <span className="ill-map-row-go">{d.kind} · {d.sleeps.toLowerCase()} <i aria-hidden="true">→</i></span>
                  </Link>
                </li>
              )
            })}
            <li className="is-key">
              <span className="ill-map-row-name">The apartment</span>
              <span className="ill-map-row-lake">in Reykjavík</span>
              <span className="ill-map-row-go">The city key · ask for dates</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ── house pages: where the house stands, under the copy and the card ── */
export function HouseMap({ id }: { id: string }) {
  const pin = PINS.find((p) => p.id === PIN_OF[id])!
  const house = DOORS.find((d) => d.id === id)!
  return (
    <div className="ill-hp-map">
      <LakeMap crop={CROPS.house} focus={id} legend />
      <div className="ill-hp-map-copy">
        <p className="ill-eyebrow-sm">Where it stands</p>
        <h3>{house.name} {id === 'ulfljotsskali' ? 'by' : 'on'} {pin.lake}</h3>
        <p>
          {id === 'ulfljotsskali'
            ? 'Úlfljótsvatn lies south of Þingvallavatn where the Sog leaves it; the lodge stands on its shore, with Álftavatn and the two sister houses a few minutes down the same road.'
            : `${house.name} stands on the shore of Álftavatn, the lake the Sog widens into on its way from Þingvallavatn to the sea. ${pin.note ? pin.note + '.' : ''} Úlfljótsskáli, the collection's lodge, is on the next lake up.`}
        </p>
        <p className="ill-hp-map-note">The pin marks the lake. The house's exact position comes with your booking.</p>
      </div>
    </div>
  )
}

export const MAP_STYLES = `
/* ── the lakes (map) ── */
.ill-map{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1500px;margin:0 auto}
.ill-map-grid{display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr);gap:clamp(28px,5vw,90px);align-items:start}
.ill-map-stage{position:relative;overflow:hidden;background:color-mix(in srgb,var(--fg) 2.5%,var(--bg));box-shadow:inset 0 0 0 1px var(--hair)}
.ill-map-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.ill-map-svg path{fill:none;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.ill-map-sea path{fill:color-mix(in srgb,var(--acc) 7%,transparent)}
.ill-map-lakes path{fill:color-mix(in srgb,var(--acc) 14%,transparent);stroke:color-mix(in srgb,var(--acc) 34%,transparent);stroke-width:.6}
.ill-map-rivers path{stroke:color-mix(in srgb,var(--acc) 45%,transparent);stroke-width:.7}
.ill-map-coast path{stroke:color-mix(in srgb,var(--fg) 42%,transparent);stroke-width:.6}
.ill-map-roads path{stroke:color-mix(in srgb,var(--fg) 30%,transparent);stroke-width:.5}
.ill-map-roads path.is-lane{stroke:color-mix(in srgb,var(--fg) 16%,transparent);stroke-width:.4}
.ill-map-main path{stroke:color-mix(in srgb,var(--fg) 72%,transparent);stroke-width:.9}
.ill-map-towns circle{fill:var(--bg);stroke:color-mix(in srgb,var(--fg) 70%,transparent);stroke-width:.8;vector-effect:non-scaling-stroke}
.ill-map-towns circle.is-city{fill:var(--fg);stroke:none}
/* layers come in one after another once the stage is in view */
.js .ill-map-l{opacity:0;transition:opacity .9s var(--e)}
.js .ill-map-stage.is-on .ill-map-l{opacity:1}
.js .ill-map-stage.is-on .ill-map-lakes{transition-delay:.12s}
.js .ill-map-stage.is-on .ill-map-rivers,.js .ill-map-stage.is-on .ill-map-coast{transition-delay:.24s}
.js .ill-map-stage.is-on .ill-map-roads{transition-delay:.36s}
.js .ill-map-stage.is-on .ill-map-main{transition-delay:.48s}
.js .ill-map-stage.is-on .ill-map-towns{transition-delay:.6s}
.ill-map-labels{position:absolute;inset:0;pointer-events:none}
.ill-map-labels > *{position:absolute;text-shadow:0 0 8px var(--bg),0 0 3px var(--bg),0 0 1px var(--bg)}
.ill-map-town{transform:translate(8px,-55%);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);white-space:nowrap;font-weight:500}
.ill-map-town.is-flip{transform:translate(calc(-100% - 8px),-55%)}
.ill-map-lake{transform:translate(-50%,-50%);font-family:var(--serif);font-style:italic;font-size:.82rem;color:color-mix(in srgb,var(--acc) 75%,transparent);white-space:nowrap;letter-spacing:.01em}
.js .ill-map-town,.js .ill-map-lake,.js .ill-map-pin,.js .ill-map-off{opacity:0;transition:opacity .8s var(--e) .7s}
.js .ill-map-stage.is-on .ill-map-town,.js .ill-map-stage.is-on .ill-map-lake,.js .ill-map-stage.is-on .ill-map-pin,.js .ill-map-stage.is-on .ill-map-off{opacity:1}
/* pins: a ring on the lake, the names beside it in the serif */
.ill-map-pin{display:flex;align-items:center;gap:12px;transform:translate(-9px,-9px);transition:opacity .5s var(--e)}
.ill-map-pin.is-l{flex-direction:row-reverse;transform:translate(calc(-100% + 9px),-9px)}
.ill-map-pin.is-l .ill-map-pin-l{text-align:right}
.ill-map-pin i{position:relative;flex:none;width:18px;height:18px;border-radius:50%;background:var(--bg);box-shadow:inset 0 0 0 1px var(--fg)}
.ill-map-pin i::before{content:'';position:absolute;inset:6px;border-radius:50%;background:var(--fg)}
.ill-map-pin.is-key i{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 70%,transparent)}
.ill-map-pin.is-key i::before{inset:7px;background:color-mix(in srgb,var(--fg) 70%,transparent)}
.ill-map-pin-l{display:grid;line-height:1.15;white-space:nowrap}
.ill-map-pin-l b{font-family:var(--serif);font-weight:300;font-size:clamp(1rem,1.3vw,1.3rem);color:var(--fg)}
.ill-map-pin-l em{font-style:normal}
.ill-map-pin-l em.is-other{color:var(--ink-mute)}
.ill-map-pin-l small{font-family:var(--serif);font-style:italic;font-size:.86rem;color:var(--ink-mute)}
.ill-map-pin.is-dim{opacity:.42}
.ill-map-pin.is-focus i::after{content:'';position:absolute;inset:-1px;border-radius:50%;box-shadow:0 0 0 1px var(--acc);animation:ill-map-pulse 2.8s var(--e) infinite}
@keyframes ill-map-pulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(2.6);opacity:0}100%{transform:scale(2.6);opacity:0}}
.reduced .ill-map-pin.is-focus i::after{animation:none;transform:scale(1.5);opacity:.5}
.ill-map-off{left:14px;transform:translateY(-50%);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);font-weight:500;display:inline-flex;gap:8px;align-items:center}
.ill-map-off i{font-style:normal}
.ill-map-credit{position:absolute;right:12px;bottom:8px;font-size:.66rem;letter-spacing:.06em;color:var(--ink-mute);opacity:.7}
/* the index beside the map: one row per key, hovering a row lights its pin */
.ill-map-index{display:grid;gap:clamp(22px,3vh,34px);padding-top:4px}
.ill-map-index-p{color:var(--ink-soft);max-width:44ch}
.ill-map-rows{list-style:none;padding:0;border-top:1px solid var(--hair)}
.ill-map-rows li{border-bottom:1px solid var(--hair)}
.ill-map-rows li > a,.ill-map-rows li.is-key{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:'name lake' 'go go';gap:2px 16px;padding:18px 0;align-items:baseline}
.ill-map-row-name{grid-area:name;font-family:var(--serif);font-size:1.5rem;line-height:1.1;transition:color .3s var(--e)}
.ill-map-row-lake{grid-area:lake;font-family:var(--serif);font-style:italic;color:var(--ink-mute);font-size:1rem;white-space:nowrap}
.ill-map-row-go{grid-area:go;font-size:.8rem;color:var(--ink-mute);letter-spacing:.02em;display:inline-flex;gap:.5em;align-items:center}
.ill-map-row-go i{font-style:normal;transition:transform .3s var(--e)}
.ill-map-rows li.is-key .ill-map-row-name{color:var(--ink-soft)}
@media (hover:hover) and (pointer:fine){
  .ill-map-rows li > a:hover .ill-map-row-name{color:var(--acc)}
  .ill-map-rows li > a:hover .ill-map-row-go i{transform:translateX(5px)}
}
/* house pages */
.ill-hp-map{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,5vw,80px);align-items:center;margin-bottom:clamp(48px,8vh,96px)}
.ill-hp-map-copy{display:grid;gap:14px;max-width:460px}
.ill-hp-map-copy h3{font-family:var(--serif);font-weight:300;font-size:clamp(1.5rem,2.2vw,2rem);line-height:1.15}
.ill-hp-map-copy p{color:var(--ink-soft)}
.ill-hp-map-note{font-size:.84rem;color:var(--ink-mute) !important}
.ill-eyebrow-sm{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);font-weight:500}
@media (max-width:1020px){
  .ill-map-grid{grid-template-columns:minmax(0,1fr)}
  .ill-hp-map{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .ill-map{padding-left:0;padding-right:0}
  .ill-map .ill-chapter-head,.ill-map-index{padding-left:20px;padding-right:20px}
  .ill-map-stage{box-shadow:inset 0 -1px 0 var(--hair),inset 0 1px 0 var(--hair)}
  .ill-map-pin-l b{font-size:1rem}
  .ill-map-pin-l small{font-size:.8rem}
  .ill-map-town{font-size:.62rem}
  .ill-map-rows li > a,.ill-map-rows li.is-key{grid-template-areas:'name' 'lake' 'go';grid-template-columns:minmax(0,1fr)}
  .ill-map-row-name{font-size:1.35rem}
}
`
