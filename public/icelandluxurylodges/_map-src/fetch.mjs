// Golden Circle lakes + coast + roads + places from Overpass (UA required; mirrors fall back).
import fs from 'node:fs'
const UA = 'sndr-ill-map/1.0 (sindri@klubbr.is)'
const HOSTS = ['https://overpass.private.coffee/api/interpreter', 'https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter']
const BBOX = '63.78,-22.10,64.36,-20.55'
const Q = {
  water: `[out:json][timeout:120];(way["natural"="water"]["name"~"^(Þingvallavatn|Úlfljótsvatn|Álftavatn|Apavatn|Laugarvatn|Sogið|Hestvatn|Kleifarvatn)$"](${BBOX});relation["natural"="water"]["name"~"^(Þingvallavatn|Úlfljótsvatn|Álftavatn|Apavatn|Laugarvatn|Hestvatn|Kleifarvatn)$"](${BBOX}););out geom;`,
  rivers: `[out:json][timeout:120];way["waterway"="river"]["name"~"^(Sog|Sogið|Ölfusá|Hvítá|Brúará)$"](${BBOX});out geom;`,
  coast: `[out:json][timeout:120];way["natural"="coastline"](${BBOX});out geom;`,
  roads: `[out:json][timeout:120];way["highway"~"^(trunk|primary|secondary)$"](${BBOX});out geom;`,
  places: `[out:json][timeout:60];node["place"~"^(city|town|village)$"](${BBOX});out;`,
}
const out = process.argv[2]
for (const [n, q] of Object.entries(Q)) {
  const f = `${out}/${n}.json`
  if (fs.existsSync(f)) { console.log('have', n); continue }
  let ok = false
  for (let a = 0; a < 4 && !ok; a++) for (const h of HOSTS) {
    try {
      const r = await fetch(h, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(q), signal: AbortSignal.timeout(170000) })
      const t = await r.text(); const j = JSON.parse(t)
      if (j.elements) { fs.writeFileSync(f, t); console.log(n, 'ok', j.elements.length, 'via', h); ok = true; break }
    } catch (e) { console.log(n, 'fail', h, String(e).slice(0, 80)) }
    await new Promise((r) => setTimeout(r, 6000))
  }
  if (!ok) console.log(n, 'FAILED')
}
