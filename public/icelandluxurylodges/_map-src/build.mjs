// Golden Circle map for Iceland Luxury Lodges: real OSM geometry → src/preview/icelandluxurylodges/geo.ts
import fs from 'node:fs'
const dir = process.argv[2], out = process.argv[3]
const J = (n) => JSON.parse(fs.readFileSync(`${dir}/${n}.json`, 'utf8')).elements
const LAT_N = 64.36, LAT_S = 63.78, LON_W = -22.10, LON_E = -20.55, W = 1000
const lat0 = (LAT_N + LAT_S) / 2, K = W / ((LON_E - LON_W) * Math.cos(lat0 * Math.PI / 180)), H = Math.round((LAT_N - LAT_S) * K)
const proj = (lat, lon) => [(lon - LON_W) * Math.cos(lat0 * Math.PI / 180) * K, (LAT_N - lat) * K]
const key = (p) => `${p.lat.toFixed(6)},${p.lon.toFixed(6)}`
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const d = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1]; if (!dx && !dy) return Math.hypot(p[0] - a[0], p[1] - a[1]); const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy)) }
  const keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true
  const st = [[0, pts.length - 1]]
  while (st.length) { const [a, b] = st.pop(); if (b - a < 2) continue; let i = a, dm = 0; for (let j = a + 1; j < b; j++) { const dd = d(pts[j], pts[a], pts[b]); if (dd > dm) { i = j; dm = dd } } if (dm > tol) { keep[i] = true; st.push([a, i], [i, b]) } }
  return pts.filter((_, i) => keep[i])
}
// stitch open ways into rings/lines by shared endpoints
function stitch(ways) {
  const segs = ways.map((w) => w.geometry.map((p) => ({ lat: p.lat, lon: p.lon }))).filter((s) => s.length > 1)
  const used = new Array(segs.length).fill(false), outLines = []
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue; used[i] = true; let line = segs[i].slice(); let grew = true
    while (grew) { grew = false; for (let j = 0; j < segs.length; j++) { if (used[j]) continue; const s = segs[j]; const a = key(line[0]), b = key(line[line.length - 1]), sa = key(s[0]), sb = key(s[s.length - 1])
      if (b === sa) { line = line.concat(s.slice(1)); used[j] = true; grew = true } else if (b === sb) { line = line.concat(s.slice(0, -1).reverse()); used[j] = true; grew = true } else if (a === sb) { line = s.slice(0, -1).concat(line); used[j] = true; grew = true } else if (a === sa) { line = s.slice(1).reverse().concat(line); used[j] = true; grew = true } } }
    outLines.push(line)
  }
  return outLines
}
const path = (pts, close) => { const s = simplify(pts.map((p) => proj(p.lat, p.lon)), 0.7); return s.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + (close ? 'Z' : '') }
const inBox = (p) => p.lat >= LAT_S - .2 && p.lat <= LAT_N + .2 && p.lon >= LON_W - .3 && p.lon <= LON_E + .3

// lakes: closed ways + relation outer members stitched
const water = J('water'); const lakes = []
for (const e of water) {
  if (e.type === 'way' && e.geometry) lakes.push({ name: e.tags?.name, pts: e.geometry })
  if (e.type === 'relation') { const outers = (e.members || []).filter((m) => m.role === 'outer' && m.geometry).map((m) => ({ geometry: m.geometry })); for (const ring of stitch(outers)) lakes.push({ name: e.tags?.name, pts: ring }) }
}
const centroid = (pts) => { let x = 0, y = 0; for (const p of pts) { x += p.lat; y += p.lon } return { lat: x / pts.length, lon: y / pts.length } }
const KEEP = new Set(['Þingvallavatn','Úlfljótsvatn','Álftavatn','Apavatn','Laugarvatn','Hestvatn','Kleifarvatn','Elliðavatn','Hafravatn','Meðalfellsvatn','Stíflisdalsvatn','Villingavatn','Hlíðarvatn','Svínavatn','Leirvogsvatn'])
const area = (pts) => { const q = pts.map((p) => proj(p.lat, p.lon)); let a = 0; for (let i = 0; i < q.length; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % q.length]; a += x1 * y2 - x2 * y1 } return Math.abs(a) / 2 }
const lakesOut = lakes.filter((l) => l.pts.length > 8 && (KEEP.has(l.name) || area(l.pts) > 70)).map((l) => ({ name: l.name || '', d: path(l.pts, true), c: proj(centroid(l.pts).lat, centroid(l.pts).lon).map((v) => +v.toFixed(1)) }))
// coast: stitched lines (land is to the left of the way direction; we only draw the line)
const coast = stitch(J('coast').filter((w) => w.geometry)).map((l) => path(l, false))
// rivers
let rivers = []; try { rivers = stitch(J('rivers').filter((w) => w.geometry)).map((l) => path(l, false)) } catch {}
// roads: by ref, merged
const roads = J('roads').filter((w) => w.geometry && w.geometry.every(inBox))
const byRef = {}
for (const w of roads) { const r = (w.tags?.ref || '').split(';')[0].trim(); const k = r || 'x'; (byRef[k] ||= []).push(w) }
const roadsOut = Object.entries(byRef).map(([ref, ws]) => ({ ref, main: /^(1|35|36|37|360|38)$/.test(ref), d: stitch(ws).map((l) => path(l, false)).join('') }))
// places
const places = J('places').filter((n) => ['city', 'town'].includes(n.tags?.place) || ['Þingvellir', 'Laugarvatn', 'Selfoss', 'Hveragerði', 'Reykjavík', 'Mosfellsbær'].includes(n.tags?.name))
  .map((n) => ({ name: n.tags.name, kind: n.tags.place, p: proj(n.lat, n.lon).map((v) => +v.toFixed(1)) }))
const ts = `/* GENERATED by scratch osm/build.mjs from OpenStreetMap (ODbL), ${new Date().toISOString().slice(0, 10)}.
   Frame ${LAT_S}–${LAT_N} N, ${LON_W}–${LON_E} E, equirectangular with cos(${lat0.toFixed(2)}), ${W}×${H}. Do not edit by hand. */
export const GEO = {
  w: ${W}, h: ${H},
  lakes: ${JSON.stringify(lakesOut)},
  coast: ${JSON.stringify(coast)},
  rivers: ${JSON.stringify(rivers)},
  roads: ${JSON.stringify(roadsOut)},
  places: ${JSON.stringify(places)},
} as const
`
fs.writeFileSync(out, ts)
console.log('lakes', lakesOut.map((l) => `${l.name}@${l.c}`).join(' | '), '\ncoast', coast.length, 'rivers', rivers.length, 'roads', roadsOut.length, 'places', places.map((p) => p.name).join(','), '\nbytes', ts.length)
