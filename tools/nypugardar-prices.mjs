/**
 * Nýpugarðar — build-time price fetch.
 *
 * Writes src/preview/nypugardar/prices.json, which the page imports as plain
 * data. Run before a build, or on a schedule; the output is committed so a
 * build without credentials still ships the last known prices instead of
 * failing or silently showing nothing.
 *
 * WHY BUILD TIME AND NOT THE BROWSER: the Godo credentials are read-write
 * against her live inventory. They can never reach a client. This site is a
 * static build with no server, so the only safe place to hold them is here,
 * during the build, with the result baked into the page as inert JSON.
 *
 * WHAT "FROM" MEANS HERE: the lowest standard rate (p1) across the next year,
 * counted ONLY on dates where inventory is actually greater than zero. A price
 * for a night that cannot be booked is a lie, and this is the one number a
 * guest will hold us to.
 *
 * Usage:
 *   node tools/nypugardar-prices.mjs            # reads .env.local
 *   GODO_API_KEY=... GODO_PROP_KEY=... node tools/nypugardar-prices.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/preview/nypugardar/prices.json')

const ROOM_IDS = {
  twinSharedEconomy: '477163',
  doubleTwinShared: '145056',
  doubleTwinPrivate: '145057',
  doublePrivateExtraBed: '145058',
  double: '259673',
  cottage3: '145059',
  familyCottage: '182212',
}

/** Mirrors ROOM_GROUPS in godo.ts: the three groups the page presents. */
const GROUPS = {
  shared: ['twinSharedEconomy', 'doubleTwinShared'],
  private: ['doubleTwinPrivate', 'doublePrivateExtraBed', 'double'],
  cottage: ['cottage3', 'familyCottage'],
}

const HORIZON_DAYS = 365

function readEnvLocal() {
  const f = resolve(ROOT, '.env.local')
  if (!existsSync(f)) return {}
  const out = {}
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

const env = { ...readEnvLocal(), ...process.env }
const API_KEY = env.GODO_API_KEY
const PROP_KEY = env.GODO_PROP_KEY

if (!API_KEY || !PROP_KEY) {
  console.warn(
    '[nypugardar-prices] GODO_API_KEY / GODO_PROP_KEY not set. Leaving prices.json untouched.',
  )
  process.exit(0)
}

async function getRoomDates(roomId, from, to) {
  const res = await fetch('https://property.godo.is/api/json/getRoomDates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authentication: { apiKey: API_KEY, propKey: PROP_KEY },
      roomId,
      from,
      to,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json?.error) throw new Error(String(json.error))
  return json
}

const iso = (d) => d.toISOString().slice(0, 10)

async function main() {
  const today = new Date()
  const end = new Date(today.getTime() + HORIZON_DAYS * 86_400_000)
  const startISO = iso(today)

  /* Day index for the availability strings: 0 = today, in the property's own
   * dates as Godo returns them (keys are YYYY-MM-DD). */
  const dayIndex = (dateStr) => {
    /* Godo keys these YYYYMMDD, no separators. */
    const m = String(dateStr).match(/^(\d{4})(\d{2})(\d{2})$/)
    const isoKey = m ? `${m[1]}-${m[2]}-${m[3]}` : String(dateStr)
    const d = Math.round((Date.parse(isoKey) - Date.parse(startISO)) / 86_400_000)
    return Number.isFinite(d) && d >= 0 && d < HORIZON_DAYS ? d : null
  }

  const rooms = {}
  const availRooms = {}
  for (const [key, id] of Object.entries(ROOM_IDS)) {
    try {
      const dates = await getRoomDates(id, iso(today), iso(end))
      let min = null
      let nights = 0
      /* One digit per day: how many of this room type are free (capped at 9).
       * '0' = sold out or closed. A string, so the whole year is ~365 bytes
       * per room and diffs stay readable in git. */
      const inv = Array(HORIZON_DAYS).fill('0')
      for (const [dateStr, v] of Object.entries(dates)) {
        if (!v || typeof v !== 'object') continue
        const i = Number(v.i ?? 0)
        const di = dayIndex(dateStr)
        if (di !== null && i > 0) inv[di] = String(Math.min(9, i))
        if (i <= 0) continue /* not bookable, so not a real price */
        nights += 1
        const p = Number(v.p1)
        if (Number.isFinite(p) && p > 0 && (min === null || p < min)) min = p
      }
      rooms[key] = { from: min, bookableNights: nights }
      availRooms[key] = inv.join('')
      console.log(`  ${key.padEnd(24)} from ${min ?? '-'}  (${nights} bookable nights)`)
    } catch (e) {
      /* One room failing must not poison the whole file. */
      rooms[key] = { from: null, bookableNights: 0, error: String(e.message || e) }
      console.warn(`  ${key.padEnd(24)} FAILED: ${e.message || e}`)
    }
    await new Promise((r) => setTimeout(r, 600)) /* stay well inside rate limits */
  }

  const groups = {}
  for (const [g, keys] of Object.entries(GROUPS)) {
    const mins = keys.map((k) => rooms[k]?.from).filter((n) => typeof n === 'number')
    groups[g] = mins.length ? Math.min(...mins) : null
  }

  const anyPrice = Object.values(rooms).some((r) => typeof r.from === 'number')
  if (!anyPrice) {
    console.warn('[nypugardar-prices] every room failed; keeping the previous prices.json')
    process.exit(0)
  }

  const payload = {
    currency: 'EUR',
    fetchedAt: new Date().toISOString().slice(0, 10),
    horizonDays: HORIZON_DAYS,
    rooms,
    groups,
    /* Per-day inventory, one digit per day from `start`. The page uses it to
     * grey out sold-out nights in the date picker and to open the default stay
     * on dates that can actually be booked. Refreshed on every deploy, like
     * the prices; between deploys Godo remains the source of truth, which is
     * why the picker's caption still says prices and final availability come
     * on the next step. */
    availability: { start: startISO, days: HORIZON_DAYS, rooms: availRooms },
  }
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n')
  console.log(`\n[nypugardar-prices] wrote ${OUT}`)
  console.log(`  groups: ${JSON.stringify(groups)}`)
}

main().catch((e) => {
  console.error('[nypugardar-prices]', e)
  process.exit(0) /* never fail the build over prices */
})
