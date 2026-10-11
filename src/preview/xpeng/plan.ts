import { RING, type FastCharger } from './geo'

/*
 * Hringvegurinn planner. A calculation, not a measurement, and the page says so.
 *
 * What the price list gives (per trim): WLTP range, battery kWh, DC 10-80 % minutes.
 * What OpenStreetMap gives: the ring road (relation "Hringvegur", measured 1,317 km along
 * its graph) and every charging site within 3 km of it, sorted into evidence tiers by the
 * generator (osm/build_ring.py):
 *   dc   CCS or CHAdeMO tagged, output tag 50 kW or more       -> always used
 *   unk  a known operator's site with NO connector tags         -> off by default, assumed 50 kW
 *   dcx  DC tagged without a usable power tag                   -> shown, never used
 *
 * The model, every part of which is printed on the page:
 *  - Reykjavik with a full battery; arrive home with at least 10 %; charge to 80 % at most.
 *  - Consumption is 1 / range per km (the printed WLTP range, less the visitor's own
 *    winter/wind reduction). A trip to a site off the road costs twice its distance.
 *  - The car's average DC power is derived from the price list: 70 % of the battery divided
 *    by the rated 10-80 % time (G6 Long Range: 56.6 kWh in 12 min = about 283 kW). A site
 *    slower than that stretches the charge by the ratio.
 *  - Charging only the energy the next leg needs, never past 80 %. A dynamic programme picks
 *    the stops that minimise charging time (plus a small penalty per stop).
 * It is a best case: no taper above 80 %, no cold battery, no queue, no shared power.
 */

export const RESERVE = 10
export const LIMIT = 80
const STOP_PENALTY = 6 /* minutes of hassle per stop, only to prefer fewer stops between equals */
const UNK_KW = 50

export type Car = { range: number; dcMin: number; kwh: number }
export type Opts = { frost?: number; useUnk?: boolean }
export type Site = FastCharger & { kwUsed: number }
export type Stop = Site & { arrive: number; to: number; minutes: number }
export type Point = { km: number; soc: number }
export type Plan = {
  ok: boolean
  stops: Stop[]
  legs: number[]
  minutes: number
  km: number
  profile: Point[]
  reach: number /* how far the car gets before it must stop, when it cannot finish */
  endSoc: number
}

export const kwhNum = (s: string) => parseFloat(s.replace(',', '.'))
export const carAvgKw = (c: Car) => (0.7 * c.kwh) / (c.dcMin / 60)

export function sites(useUnk: boolean): Site[] {
  return RING.chargers
    .filter((c) => c.tier === 'dc' || (useUnk && c.tier === 'unk'))
    .map((c) => ({ ...c, kwUsed: c.kw >= 50 ? c.kw : UNK_KW }))
    .sort((a, b) => a.km - b.km)
}

export function gapInfo(useUnk: boolean) {
  const pts = [0, ...sites(useUnk).map((c) => c.km), RING.km]
  let g = 0, a = 0, b = 0
  for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > g) { g = pts[i] - pts[i - 1]; a = pts[i - 1]; b = pts[i] }
  return { g, a, b }
}

const memo = new Map<string, Plan>()

export function planRing(car: Car, opts: Opts = {}): Plan {
  const frost = opts.frost ?? 0
  const useUnk = !!opts.useUnk
  const key = `${car.range}|${car.dcMin}|${car.kwh}|${frost}|${useUnk}`
  const hit = memo.get(key)
  if (hit) return hit

  const S = sites(useUnk)
  const L = RING.km
  const cons = 100 / (car.range * (1 - frost)) /* % of battery per km */
  const avg = carAvgKw(car)
  const minutesFor = (from: number, to: number, kw: number) => ((to - from) / 70) * car.dcMin * Math.max(1, avg / kw)

  /* nodes: 0 = start, 1..n = sites, n+1 = end */
  const n = S.length
  const km = [0, ...S.map((c) => c.km), L]
  const off = [0, ...S.map((c) => 2 * c.off), 0]
  const INF = 1e9
  const dp: number[][] = Array.from({ length: n + 2 }, () => new Array(101).fill(INF))
  const prev: ({ i: number; s: number; arr: number } | null)[][] = Array.from({ length: n + 2 }, () => new Array(101).fill(null))
  dp[0][100] = 0
  let bestEnd = INF, endFrom: { i: number; s: number; arr: number } | null = null
  let reach = 0

  for (let i = 0; i <= n; i++) {
    for (let s = RESERVE; s <= 100; s++) {
      const base = dp[i][s]
      if (base >= INF) continue
      reach = Math.max(reach, km[i] + (s - RESERVE) / cons)
      for (let j = i + 1; j <= n + 1; j++) {
        const d = km[j] - km[i] + off[j]
        const arr = s - cons * d
        if (arr < RESERVE - 1e-9) { if (j <= n) continue; else break }
        if (j === n + 1) {
          if (base < bestEnd) { bestEnd = base; endFrom = { i, s, arr } }
          continue
        }
        const a0 = Math.ceil(arr)
        for (let t = Math.max(a0 + 2, RESERVE); t <= LIMIT; t++) {
          const c = base + minutesFor(arr, t, S[j - 1].kwUsed) + STOP_PENALTY
          if (c < dp[j][t]) { dp[j][t] = c; prev[j][t] = { i, s, arr } }
        }
      }
    }
  }

  let plan: Plan
  if (endFrom === null) {
    plan = { ok: false, stops: [], legs: [], minutes: 0, km: L, profile: [], reach: Math.min(reach, L), endSoc: 0 }
  } else {
    /* walk back from the best end state */
    const chain: { j: number; arr: number; to: number }[] = []
    let cur = endFrom
    const finalArr = endFrom.arr
    while (cur.i !== 0) {
      chain.push({ j: cur.i, arr: prev[cur.i][cur.s]!.arr, to: cur.s })
      const p = prev[cur.i][cur.s]!
      cur = { i: p.i, s: p.s, arr: p.arr }
    }
    chain.reverse()
    const stops: Stop[] = chain.map((c) => ({ ...S[c.j - 1], arrive: Math.round(c.arr), to: c.to, minutes: Math.max(1, Math.round(minutesFor(c.arr, c.to, S[c.j - 1].kwUsed))) }))
    const legs: number[] = []
    let from = 0
    for (const s of stops) { legs.push(s.km - from); from = s.km }
    legs.push(L - from)
    /* the profile the chart draws: a sawtooth that never dips under the reserve */
    const profile: Point[] = [{ km: 0, soc: 100 }]
    for (const s of stops) { profile.push({ km: s.km, soc: s.arrive }, { km: s.km, soc: s.to }) }
    profile.push({ km: L, soc: Math.round(finalArr) })
    plan = { ok: true, stops, legs, minutes: stops.reduce((a, s) => a + s.minutes, 0), km: L, profile, reach: L, endSoc: Math.round(finalArr) }
  }
  memo.set(key, plan)
  return plan
}
