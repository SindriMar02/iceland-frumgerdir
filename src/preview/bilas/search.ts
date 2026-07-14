/* ── Bílás search engine ──────────────────────────────────────────────────
   Marketplace-grade query understanding over the live inventory, all
   client-side (24 cars — no server needed). Understands, in Icelandic:
   · free text with accent-insensitive + typo-tolerant matching
     ("jagur" → JAGUAR, "disel" → Dísel)
   · price: "undir 3m", "yfir 1,5m", "1-3m", "undir 2.500.000", bare "3m"
   · year: "2018", "eftir 2020", "fyrir 2015", "árgerð 2019"
   · fuel/gear words incl. synonyms: rafbíll, bensínbíll, sjálfskiptur...
   · "tilboð" and "án vsk"
   Every parsed constraint is surfaced back as an "understood" chip so the
   user sees exactly how the engine read their query.                    */

import type { Car } from './data'

/* accent/case normalization — Icelandic-aware so "bíll" matches "bill" */
const FOLD: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ý: 'y', ö: 'o', æ: 'ae', ð: 'd', þ: 'th',
}
export function norm(s: string): string {
  return s.toLowerCase().replace(/[áéíóúýöæðþ]/g, (c) => FOLD[c] ?? c)
}

/* small-word-friendly edit distance for typo tolerance */
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
  return dp[a.length][b.length]
}
function fuzzyEq(term: string, word: string): boolean {
  if (word.startsWith(term)) return true
  const tol = term.length >= 6 ? 2 : term.length >= 4 ? 1 : 0
  return tol > 0 && editDistance(term, word) <= tol
}

export type Parsed = {
  terms: string[]
  fuel: 'Bensín' | 'Dísel' | 'Rafmagn' | 'hybrid' | null
  gear: 'Sjálfskipting' | 'Beinskipting' | null
  tilbod: boolean
  anVsk: boolean
  priceMin: number | null
  priceMax: number | null
  yearMin: number | null
  yearMax: number | null
  yearExact: number | null
  /* human-readable chips: how the engine read the query */
  understood: string[]
}

const FUEL_WORDS: [string, NonNullable<Parsed['fuel']>][] = [
  ['rafbill', 'Rafmagn'], ['rafbilar', 'Rafmagn'], ['rafmagn', 'Rafmagn'], ['rafmagnsbill', 'Rafmagn'],
  ['disel', 'Dísel'], ['diesel', 'Dísel'], ['diselbill', 'Dísel'],
  ['bensin', 'Bensín'], ['bensinbill', 'Bensín'],
  ['hybrid', 'hybrid'], ['tvinnbill', 'hybrid'], ['tengiltvinnbill', 'hybrid'], ['tengiltvinn', 'hybrid'],
]
const GEAR_WORDS: [string, NonNullable<Parsed['gear']>][] = [
  ['sjalfskiptur', 'Sjálfskipting'], ['sjalfskipting', 'Sjálfskipting'], ['sjalfskiptir', 'Sjálfskipting'],
  ['beinskiptur', 'Beinskipting'], ['beinskipting', 'Beinskipting'], ['beinskiptir', 'Beinskipting'],
]

/* "3", "2,5", "2.500.000", with an optional m/millj suffix nearby */
function toIsk(numStr: string, hasMillion: boolean): number {
  const clean = numStr.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(clean)
  if (Number.isNaN(n)) return NaN
  if (hasMillion) return Math.round(n * 1_000_000)
  /* bare numbers: 390000 style is absolute; small bare numbers mean millions */
  return n >= 10_000 ? Math.round(n) : Math.round(n * 1_000_000)
}
const fmtIsk = (n: number) => `${n.toLocaleString('de-DE')} kr.`

const NUM = String.raw`(\d+(?:[.,]\d+)*)`
const MILL = String.raw`\s*(m\b|millj\w*)?`

export function parseQuery(raw: string): Parsed {
  let q = ` ${norm(raw.trim())} `
  const p: Parsed = {
    terms: [], fuel: null, gear: null, tilbod: false, anVsk: false,
    priceMin: null, priceMax: null, yearMin: null, yearMax: null, yearExact: null,
    understood: [],
  }
  if (!q.trim()) return p

  const eat = (re: RegExp, onMatch: (m: RegExpMatchArray) => void): void => {
    const m = q.match(re)
    if (m) { onMatch(m); q = q.replace(re, ' ') }
  }

  /* price ranges first (most specific patterns first) */
  eat(new RegExp(String.raw`(?:milli\s+)?${NUM}${MILL}\s*(?:-|til)\s*${NUM}${MILL}(?:\s*kr\w*)?`), (m) => {
    const hasM = Boolean(m[2] || m[4])
    const a = toIsk(m[1], hasM); const b = toIsk(m[3], hasM)
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      p.priceMin = Math.min(a, b); p.priceMax = Math.max(a, b)
      p.understood.push(`${fmtIsk(p.priceMin)} - ${fmtIsk(p.priceMax)}`)
    }
  })
  eat(new RegExp(String.raw`(?:undir|max|hamark)\s+${NUM}${MILL}(?:\s*kr\w*)?`), (m) => {
    const v = toIsk(m[1], Boolean(m[2]))
    if (!Number.isNaN(v)) { p.priceMax = v; p.understood.push(`undir ${fmtIsk(v)}`) }
  })
  eat(new RegExp(String.raw`(?:yfir|fra|lagmark)\s+${NUM}${MILL}(?:\s*kr\w*)?`), (m) => {
    const v = toIsk(m[1], Boolean(m[2]))
    if (!Number.isNaN(v)) { p.priceMin = v; p.understood.push(`yfir ${fmtIsk(v)}`) }
  })
  /* bare "3m" / "2,5 milljónir" → a budget: treat as a band around it */
  eat(new RegExp(String.raw`${NUM}\s*(m\b|millj\w*)`), (m) => {
    const v = toIsk(m[1], true)
    if (!Number.isNaN(v)) {
      p.priceMin = Math.round(v * 0.8); p.priceMax = Math.round(v * 1.2)
      p.understood.push(`um ${fmtIsk(v)}`)
    }
  })

  /* years — after prices so "2.500.000" can't be misread */
  eat(/(?:eftir|nyrri en)\s+((?:19|20)\d{2})/, (m) => {
    p.yearMin = Number(m[1]); p.understood.push(`árgerð eftir ${m[1]}`)
  })
  eat(/(?:fyrir|eldri en)\s+((?:19|20)\d{2})/, (m) => {
    p.yearMax = Number(m[1]); p.understood.push(`árgerð fyrir ${m[1]}`)
  })
  eat(/(?:argerd\s+)?\b((?:19|20)\d{2})\b/, (m) => {
    p.yearExact = Number(m[1]); p.understood.push(`árgerð ${m[1]}`)
  })

  /* flags */
  eat(/\btilbod\w*/, () => { p.tilbod = true; p.understood.push('Tilboð') })
  eat(/\ban\s+vsk\w*/, () => { p.anVsk = true; p.understood.push('án vsk.') })

  /* filler words that carry no constraint of their own ("árgerð eftir
     2020" leaves a dangling "árgerð" once the year clause is consumed) */
  const STOP = new Set(['argerd', 'arg', 'bill', 'bilar', 'bilinn', 'bila', 'kr', 'kronur', 'verd', 'og'])

  /* remaining words: fuel/gear vocab (fuzzy), rest become text terms */
  for (const word of q.split(/\s+/).filter(Boolean)) {
    if (STOP.has(word)) continue
    const fuel = FUEL_WORDS.find(([w]) => fuzzyEq(word, w) || fuzzyEq(w, word))
    if (fuel && !p.fuel) {
      p.fuel = fuel[1]
      p.understood.push(fuel[1] === 'hybrid' ? 'Hybrid' : fuel[1])
      continue
    }
    const gear = GEAR_WORDS.find(([w]) => fuzzyEq(word, w) || fuzzyEq(w, word))
    if (gear && !p.gear) {
      p.gear = gear[1]
      p.understood.push(gear[1])
      continue
    }
    p.terms.push(word)
  }
  return p
}

/* score a car against parsed constraints; null = filtered out.
   makeTerms get OR semantics ("volvo vw" = either brand), all other
   text terms get AND semantics ("bmw x3" = both must match). */
export function scoreCar(car: Car, p: Parsed, makeTerms: string[] = [], textTerms: string[] = p.terms): number | null {
  if (p.fuel === 'hybrid' ? !car.fuel.includes('/') : p.fuel ? car.fuel !== p.fuel : false) return null
  if (p.gear && car.gear !== p.gear) return null
  if (p.tilbod && !car.tilbod) return null
  if (p.anVsk && !car.anVsk) return null
  if (p.priceMin !== null && car.priceNum < p.priceMin) return null
  if (p.priceMax !== null && car.priceNum > p.priceMax) return null
  const year = Number(car.reg.split('/')[1])
  if (p.yearExact !== null && year !== p.yearExact) return null
  if (p.yearMin !== null && year < p.yearMin) return null
  if (p.yearMax !== null && year > p.yearMax) return null

  let score = 1
  const makeWords = norm(car.make).split(/[\s-]+/)
  const modelWords = norm(car.model).split(/[\s-]+/)
  const termHit = (t: string): number => {
    let hit = 0
    for (const w of makeWords) {
      if (w === t) hit = Math.max(hit, 100)
      else if (w.startsWith(t)) hit = Math.max(hit, 60)
      else if (fuzzyEq(t, w)) hit = Math.max(hit, 40)
    }
    for (const w of modelWords) {
      if (w === t) hit = Math.max(hit, 80)
      else if (w.startsWith(t)) hit = Math.max(hit, 50)
      else if (fuzzyEq(t, w)) hit = Math.max(hit, 30)
    }
    return hit
  }
  if (makeTerms.length) {
    const best = Math.max(...makeTerms.map(termHit))
    if (best === 0) return null /* none of the requested brands */
    score += best
  }
  for (const t of textTerms) {
    const hit = termHit(t)
    if (hit === 0) return null /* every non-brand term must match */
    score += hit
  }
  return score
}

export function searchCars(cars: readonly Car[], raw: string): { car: Car; score: number }[] {
  const p = parseQuery(raw)

  /* split text terms into brand terms (OR) and the rest (AND) */
  const makeVocab = new Set(cars.flatMap((c) => norm(c.make).split(/[\s-]+/)))
  const makeTerms: string[] = []
  const textTerms: string[] = []
  for (const t of p.terms) {
    let isMake = false
    for (const w of makeVocab) if (fuzzyEq(t, w)) { isMake = true; break }
    ;(isMake ? makeTerms : textTerms).push(t)
  }

  const out: { car: Car; score: number }[] = []
  for (const car of cars) {
    const s = scoreCar(car, p, makeTerms, textTerms)
    if (s !== null) out.push({ car, score: s })
  }
  out.sort((a, b) => b.score - a.score || a.car.priceNum - b.car.priceNum)
  return out
}
