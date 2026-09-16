/**
 * Nýpugarðar — generate the "Getting here" map data from real geodata.
 *
 *   node tools/nypugardar-map.mjs   →  src/preview/nypugardar/map-data.json
 *
 * WHY GENERATED. The map has to be right: a guest plans a day off it. So no
 * hand-drawn schematic. Everything on it comes from OpenStreetMap:
 *   - the drives: OSRM driving routes from the farm's own coordinates to the
 *     car park of each place, so the lines ARE the roads a guest drives, spur
 *     and all, and the minutes and kilometres printed beside them are the same
 *     routes' figures;
 *   - the ground: coastline, glacier edges and lagoon shapes from Overpass.
 * Projected to a flat SVG box (equirectangular, x scaled by cos of the centre
 * latitude, which is exact enough across 60 km) and simplified.
 *
 * Output is committed JSON, so the page ships no map library, no tiles and no
 * runtime request, prerenders as real SVG, and works offline. Rerun it when a
 * place is added. Attribution (© OpenStreetMap contributors) is rendered on the
 * map itself, as ODbL requires.
 *
 * Coordinates: the farm from ferdalag.is, matching Nominatim to 5 m. Every
 * destination is a car park or the building itself, found with Overpass /
 * Nominatim on 2026-09-16 (ids in the comments), never a lagoon centroid.
 */
import { writeFileSync } from 'node:fs'

const FARM = { lat: 64.261553, lon: -15.438971 }
const UA = { 'User-Agent': 'sndr-studio-map/1.0 (nypugardar site build)' }

/* key, lat, lon: the point a guest drives to */
const PLACES = [
  { key: 'hofn', lat: 64.253986, lon: -15.208634 }, // Sundlaug Hafnar, Víkurbraut (Nominatim)
  { key: 'thorbergssetur', lat: 64.129773, lon: -16.018076 }, // Þórbergssetur building, Hali (Nominatim)
  { key: 'jokulsarlon', lat: 64.04801, lon: -16.17969 }, // "Jökulsárlón parking", way 298932452
  { key: 'diamondBeach', lat: 64.0428, lon: -16.1828 }, // beach-side car park by Breiðamerkurfjara, way 639974960
  { key: 'fjallsarlon', lat: 64.01637, lon: -16.36504 }, // Fjallsárlón car park, way 722967293
  { key: 'stokksnes', lat: 64.24509, lon: -14.97281 }, // Stokksnes car park, node 4902398497
]

const BBOX = { s: 63.985, w: -16.45, n: 64.36, e: -14.9 }
const W = 1000
const LAT0 = (BBOX.s + BBOX.n) / 2
const KX = Math.cos((LAT0 * Math.PI) / 180)
const spanX = (BBOX.e - BBOX.w) * KX
const spanY = BBOX.n - BBOX.s
const H = Math.round((W * spanY) / spanX)
const px = (lon, lat) => [((lon - BBOX.w) * KX * W) / spanX, ((BBOX.n - lat) * H) / spanY]

/* Douglas–Peucker on projected points */
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [x1, y1] = pts[a]
    const [x2, y2] = pts[b]
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy) || 1
    let max = 0
    let at = -1
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len
      if (d > max) { max = d; at = i }
    }
    if (max > tol && at > 0) {
      keep[at] = 1
      stack.push([a, at], [at, b])
    }
  }
  return pts.filter((_, i) => keep[i])
}
const d = (pts, close = false) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('') + (close ? 'Z' : '')

async function osrm(to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${FARM.lon},${FARM.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: UA })
    if (r.ok) {
      const j = await r.json()
      if (j.code === 'Ok') return j
    }
    await new Promise((res) => setTimeout(res, 1500 * (attempt + 1)))
  }
  throw new Error(`OSRM failed for ${to.key}`)
}

const places = []
for (const p of PLACES) {
  const j = await osrm(p)
  const route = j.routes[0]
  const snapped = j.waypoints.map((w) => Math.round(w.distance))
  if (snapped[1] > 400) throw new Error(`${p.key}: destination snapped ${snapped[1]} m from the car park; check the point`)
  const pts = simplify(route.geometry.coordinates.map(([lon, lat]) => px(lon, lat)), 0.8)
  const [x, y] = px(p.lon, p.lat)
  places.push({
    key: p.key,
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    km: Math.round(route.distance / 1000),
    /* rounded to 5 minutes: OSRM's demo profile ignores gravel and weather,
       so a figure to the minute would promise more than it knows */
    min: Math.max(5, Math.round(route.duration / 60 / 5) * 5),
    route: d(pts),
    snapM: snapped,
  })
  console.log(`nypugardar-map: ${p.key} ${Math.round(route.distance / 100) / 10} km, ${Math.round(route.duration / 60)} min (snap ${snapped.join('/')} m)`)
  await new Promise((res) => setTimeout(res, 1100))
}

/* ground from Overpass */
const q = `[out:json][timeout:120];
(
  way["natural"="coastline"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["natural"="glacier"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  rel["natural"="glacier"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["water"="lagoon"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  rel["water"="lagoon"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
);
(._;>;);
out geom(${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});`
const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'data=' + encodeURIComponent(q),
})
if (!res.ok) throw new Error(`Overpass ${res.status}`)
const osm = await res.json()

const ways = new Map()
for (const e of osm.elements) if (e.type === 'way' && e.geometry) ways.set(e.id, e)
const role = new Map() // way id -> 'glacier' | 'lagoon'
for (const e of osm.elements) {
  if (e.type !== 'relation') continue
  const kind = e.tags?.natural === 'glacier' ? 'glacier' : e.tags?.water === 'lagoon' ? 'lagoon' : null
  if (kind) for (const m of e.members || []) if (m.type === 'way') role.set(m.ref, kind)
}
const kindOf = (w) =>
  w.tags?.natural === 'coastline' ? 'coast' : w.tags?.natural === 'glacier' ? 'glacier' : w.tags?.water === 'lagoon' ? 'lagoon' : role.get(w.id)

/* Clipped geometry arrives with null holes where a way leaves the box: split
   there, so nothing is drawn across the gap. */
const out = { coast: [], glacier: [], lagoon: [] }
for (const w of ways.values()) {
  const kind = kindOf(w)
  if (!kind) continue
  let run = []
  const flush = () => {
    if (run.length > 1) {
      const pts = simplify(run, kind === 'lagoon' ? 0.5 : 1.1)
      const closed = w.nodes && w.nodes[0] === w.nodes.at(-1) && run.length === w.geometry.length
      if (pts.length > 1) out[kind].push(d(pts, closed && kind === 'lagoon'))
    }
    run = []
  }
  for (const g of w.geometry) {
    if (!g) { flush(); continue }
    run.push(px(g.lon, g.lat))
  }
  flush()
}

const [fx, fy] = px(FARM.lon, FARM.lat)
const data = {
  generated: new Date().toISOString().slice(0, 10),
  sources: 'OSRM driving routes and OpenStreetMap geometry (© OpenStreetMap contributors, ODbL)',
  bbox: BBOX,
  w: W,
  h: H,
  farm: { x: +fx.toFixed(1), y: +fy.toFixed(1) },
  places,
  coast: out.coast.join(''),
  glacier: out.glacier.join(''),
  lagoon: out.lagoon.join(''),
}
writeFileSync('src/preview/nypugardar/map-data.json', JSON.stringify(data))
console.log(
  `nypugardar-map: ${W}x${H}, coast ${out.coast.length}, glacier ${out.glacier.length}, lagoon ${out.lagoon.length}, ${Math.round(JSON.stringify(data).length / 1024)} KB`,
)
