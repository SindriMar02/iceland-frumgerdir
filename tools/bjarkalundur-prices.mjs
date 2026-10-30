/** Build-time Godo snapshot. Credentials never enter the browser bundle.
 * Run manually with npm run prices:bjarkalundur. Godo confirms final availability.
 */
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/preview/bjarkalundur/prices.json')
// Mirrors GODO_ROOM_IDS in src/preview/bjarkalundur/godo.ts.
const ROOM_IDS = {
  thaegindi: '118374',
  vaskur: '118375',
  einn: '617289',
  'hus-eldhus': '118377',
  'hus-bad': '118379',
  'hus-stort': '617286',
  'hus-litid': '616941',
  'hus-tveggja': '616940',
}
const HORIZON_DAYS = 365
const DAY = 86_400_000
const iso = (date) => date.toISOString().slice(0, 10)

function readEnvLocal() {
  const path = resolve(ROOT, '.env.local')
  if (!existsSync(path)) return {}
  const values = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!match) continue
    const value = match[2].trim()
    values[match[1]] = /^(['"]).*\1$/.test(value) ? value.slice(1, -1) : value.replace(/\s+#.*$/, '')
  }
  return values
}

async function main() {
  const env = { ...readEnvLocal(), ...process.env }
  if (!env.GODO_API_KEY || !env.GODO_PROP_KEY) {
    console.log('[bjarkalundur-prices] no keys, skipped')
    return
  }
  const start = iso(new Date())
  const startMs = Date.parse(`${start}T00:00:00Z`)
  const end = iso(new Date(startMs + (HORIZON_DAYS - 1) * DAY))
  const rooms = {}
  const availability = {}
  let succeeded = 0
  for (const [key, roomId] of Object.entries(ROOM_IDS)) {
    try {
      const response = await fetch('https://property.godo.is/api/json/getRoomDates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          authentication: { apiKey: env.GODO_API_KEY, propKey: env.GODO_PROP_KEY },
          roomId, from: start, to: end,
        }),
      })
      if (!response.ok) throw new Error('HTTP failure')
      const dates = await response.json()
      if (!dates || typeof dates !== 'object' || Array.isArray(dates) || dates.error) throw new Error('Invalid response')
      const inventory = Array(HORIZON_DAYS).fill('0')
      let from = null
      let bookableNights = 0
      let validDays = 0
      for (const [date, value] of Object.entries(dates)) {
        const normalized = date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
        const index = (Date.parse(normalized) - startMs) / DAY
        if (!Number.isInteger(index) || index < 0 || index >= HORIZON_DAYS) continue
        const count = Number(value?.i)
        if (!Number.isFinite(count) || count < 0) continue
        validDays++
        inventory[index] = String(Math.min(9, Math.floor(count)))
        if (count <= 0) continue
        bookableNights++
        const rate = Number(value.p1)
        if (Number.isFinite(rate) && rate > 0 && (from === null || rate < from)) from = rate
      }
      // An empty/malformed payload cannot prove that a whole year is sold out.
      if (!validDays) throw new Error('No valid dates')
      rooms[key] = { from, bookableNights }
      availability[key] = inventory.join('')
      succeeded++
      console.log(`[bjarkalundur-prices] ${key}: ${bookableNights} bookable nights`)
    } catch {
      // Do not log response bodies or upstream errors that might echo credentials.
      rooms[key] = { from: null, bookableNights: 0 }
      console.warn(`[bjarkalundur-prices] ${key}: request failed, inventory unknown`)
    }
    await new Promise((done) => setTimeout(done, 600))
  }
  if (!succeeded) {
    console.warn('[bjarkalundur-prices] every call failed; keeping previous file')
    return
  }
  const payload = {
    currency: 'ISK', fetchedAt: start, horizonDays: HORIZON_DAYS, rooms,
    availability: { start, days: HORIZON_DAYS, rooms: availability },
  }
  writeFileSync(`${OUT}.tmp`, `${JSON.stringify(payload, null, 2)}\n`)
  renameSync(`${OUT}.tmp`, OUT)
  console.log('[bjarkalundur-prices] wrote prices.json')
}

main().catch(() => {
  console.warn('[bjarkalundur-prices] snapshot failed; keeping previous file')
  // This optional job must never fail a build.
  process.exitCode = 0
})
