/**
 * The Pólar Hestar tour schedule, as logic.
 *
 * Every line a guest reads about WHEN a tour runs — the pills on a long-tour
 * card, the rider line under it, the departures line, the schedule page, the
 * mailto a guest sends — is derived here from a handful of typed facts:
 * a start date per departure, the number of days, a status. Nothing about a
 * date is ever typed twice, so the card and the schedule page cannot drift,
 * and a new season is entered as dates, not as three hand-written sentences.
 *
 * Pure module: no React, no DOM, no Intl (Intl has no Icelandic), so it runs
 * the same in the browser, in Sanity scripts and under `node --test`.
 */

export type Lang = 'is' | 'en' | 'de'
export type L3 = { is: string; en: string; de: string }

/** What the owners set per departure. 'few' is theirs to set, never inferred. */
export type DepartureStatus = 'open' | 'few' | 'full' | 'cancelled'

export interface Departure {
  /** First day, YYYY-MM-DD (the pickup in Akureyri). The last day is derived from the tour's `days`. */
  start: string
  status: DepartureStatus
  /** Optional short owner note for this departure only, e.g. a German-speaking guide. */
  note?: L3
}

export type RiderLevel = 'mixed' | 'experienced'
export type Beds = 'made' | 'sleepingBag'

/** The structured facts of one long tour. */
export interface LongTourFacts {
  priceEur: number
  /** Calendar days including arrival and departure day; nights = days - 1. */
  days: number
  ridingDays: number
  level: RiderLevel
  minAge: number
  maxRiders?: number
  kmMin: number
  kmMax: number
  /** Riding days spent with the free-running herd (0 = none, halves allowed). */
  herdDays: number
  beds: Beds
  departures: Departure[]
  /** Shown instead of dates when no future departure is published. */
  datesNote?: L3
}

/* ── dates ──────────────────────────────────────────────────────────────── */
const ISO = /^\d{4}-\d{2}-\d{2}$/
export const isIsoDay = (s: unknown): s is string => {
  if (typeof s !== 'string' || !ISO.test(s)) return false
  const d = parseDay(s)
  return !Number.isNaN(d.getTime()) && toIso(d) === s
}
/** Noon UTC, so no timezone or DST shift can move the day. */
const parseDay = (iso: string) => new Date(iso + 'T12:00:00Z')
const toIso = (d: Date) => d.toISOString().slice(0, 10)
export const addDays = (iso: string, n: number) => {
  const d = parseDay(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return toIso(d)
}
export const endOf = (dep: Departure, days: number) => addDays(dep.start, Math.max(1, days) - 1)
/** Local calendar day, as the guest's own browser sees it. */
export const todayIso = (now = new Date()) =>
  new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

const MONTHS: Record<Lang, string[]> = {
  is: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
}
const MONTHS_SHORT: Record<Lang, string[]> = {
  is: ['jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
}
export const monthName = (m: number, lang: Lang) => MONTHS[lang][(m - 1 + 12) % 12]
export const monthShort = (m: number, lang: Lang) => MONTHS_SHORT[lang][(m - 1 + 12) % 12]

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

/** "6.–12. júní" · "June 6–12" · "6.–12. Juni"; across months "26. júní–3. júlí" etc. */
export function formatRange(startIso: string, endIso: string, lang: Lang, withYear = false): string {
  const a = parts(startIso)
  const b = parts(endIso)
  const M = MONTHS[lang]
  const yr = withYear ? ` ${b.y}` : ''
  const sameMonth = a.m === b.m && a.y === b.y
  if (lang === 'en') {
    const out = sameMonth ? `${M[a.m - 1]} ${a.d}–${b.d}` : `${M[a.m - 1]} ${a.d}–${M[b.m - 1]} ${b.d}`
    return withYear ? `${out}, ${b.y}` : out
  }
  if (sameMonth) return `${a.d}.–${b.d}. ${M[a.m - 1]}${yr}`
  return `${a.d}. ${M[a.m - 1]}–${b.d}. ${M[b.m - 1]}${yr}`
}

/** Full weekday of the pickup day; travellers plan flights around it. */
const WEEKDAYS: Record<Lang, string[]> = {
  is: ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
}
export const weekday = (iso: string, lang: Lang) => WEEKDAYS[lang][parseDay(iso).getUTCDay()]

/* ── departures ─────────────────────────────────────────────────────────── */
export interface DepartureRow extends Departure {
  end: string
  year: number
}

/** Valid departures, sorted, with their end day. Malformed rows are dropped, never rendered. */
export function allDepartures(t: Pick<LongTourFacts, 'departures' | 'days'>): DepartureRow[] {
  const seen = new Set<string>()
  return (t.departures ?? [])
    .filter((d) => d && isIsoDay(d.start) && !seen.has(d.start) && seen.add(d.start))
    .map((d) => ({ ...d, status: STATUSES.includes(d.status) ? d.status : 'open', end: endOf(d, t.days), year: parts(d.start).y }))
    .sort((x, y) => x.start.localeCompare(y.start))
}

/** Departures a guest can still ask for: start today or later, and not cancelled. */
export function upcoming(t: Pick<LongTourFacts, 'departures' | 'days'>, today = todayIso()): DepartureRow[] {
  return allDepartures(t).filter((d) => d.start >= today && d.status !== 'cancelled')
}

export const bookable = (d: Departure) => d.status === 'open' || d.status === 'few'

const STATUSES: DepartureStatus[] = ['open', 'few', 'full', 'cancelled']
export const STATUS_LABEL: Record<DepartureStatus, L3> = {
  open: { is: 'Opið fyrir fyrirspurnir', en: 'Open for requests', de: 'Anfragen möglich' },
  few: { is: 'Fá pláss eftir', en: 'Few places left', de: 'Wenige Plätze frei' },
  full: { is: 'Uppselt', en: 'Fully booked', de: 'Ausgebucht' },
  cancelled: { is: 'Fellur niður', en: 'Cancelled', de: 'Abgesagt' },
}
const STATUS_SUFFIX: Partial<Record<DepartureStatus, L3>> = {
  few: { is: 'fá pláss eftir', en: 'few places left', de: 'wenige Plätze frei' },
  full: { is: 'uppselt', en: 'fully booked', de: 'ausgebucht' },
}

const joinList = (items: string[], lang: Lang) => {
  if (items.length <= 1) return items.join('')
  const and = lang === 'is' ? 'og' : lang === 'de' ? 'und' : 'and'
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`
}

export const NO_DATES: L3 = {
  is: 'Næstu brottfarir hafa ekki verið birtar',
  en: 'The next departures have not been published yet',
  de: 'Die nächsten Termine sind noch nicht veröffentlicht',
}

/** "Departures 2027: June 26–July 3, July 7–14, July 18–25 (fully booked) …" */
export function departuresLine(t: LongTourFacts, lang: Lang, today = todayIso()): string {
  const up = upcoming(t, today)
  if (!up.length) return (t.datesNote?.[lang] || '').trim() || NO_DATES[lang]
  const years = [...new Set(up.map((d) => d.year))]
  const label = lang === 'is' ? 'Brottfarir' : lang === 'de' ? 'Termine' : 'Departures'
  const items = up.map((d) => {
    const suffix = STATUS_SUFFIX[d.status]?.[lang]
    const range = formatRange(d.start, d.end, lang, years.length > 1)
    return suffix ? `${range} (${suffix})` : range
  })
  return `${label}${years.length === 1 ? ` ${years[0]}` : ''}: ${joinList(items, lang)}`
}

/** Month span of the upcoming departures: "June", "June–August". Empty when none. */
export function monthSpan(t: LongTourFacts, lang: Lang, today = todayIso()): string {
  const up = upcoming(t, today)
  if (!up.length) return ''
  // first pickup month to last homecoming month, counted across a year boundary
  const first = parts(up[0].start).m
  const end = Math.max(...up.map((d) => parts(d.end).m + (parts(d.end).y - up[0].year) * 12))
  return end > first ? `${monthName(first, lang)}–${monthName(end, lang)}` : monthName(first, lang)
}

export const priceEur = (n: number, lang: Lang) => {
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')
  return lang === 'en' ? `€${s}` : `${s}${lang === 'de' ? ' ' : ''}€`
}

/** The pills on a long-tour card: "7 days · 5 riding days · June · €2,150". */
export function metaLine(t: LongTourFacts, lang: Lang, today = todayIso()): string {
  const days = lang === 'is' ? `${t.days} dagar` : lang === 'de' ? `${t.days} Tage` : `${t.days} days`
  const riding = lang === 'is' ? `${t.ridingDays} reiðdagar` : lang === 'de' ? `${t.ridingDays} Reittage` : `${t.ridingDays} riding days`
  return [days, riding, monthSpan(t, lang, today), priceEur(t.priceEur, lang)].filter(Boolean).join(' · ')
}

export const LEVEL: Record<RiderLevel, L3> = {
  mixed: { is: 'Fyrir miðlungs vana og vana knapa', en: 'Intermediate and experienced riders', de: 'Für Reiter mit mittlerer bis guter Erfahrung' },
  experienced: { is: 'Fyrir vana knapa', en: 'Experienced riders', de: 'Für geübte Reiter' },
}

/** "Experienced riders · age 12+ · max 16 riders · 25–40 km a day" */
export function requirementsLine(t: LongTourFacts, lang: Lang): string {
  const age = lang === 'is' ? `${t.minAge} ára+` : lang === 'de' ? `ab ${t.minAge} Jahren` : `age ${t.minAge}+`
  const max = t.maxRiders
    ? lang === 'is' ? `hámark ${t.maxRiders} knapar` : lang === 'de' ? `max. ${t.maxRiders} Reiter` : `max ${t.maxRiders} riders`
    : ''
  const km = lang === 'is' ? `${t.kmMin}–${t.kmMax} km á dag` : lang === 'de' ? `${t.kmMin}–${t.kmMax} km pro Tag` : `${t.kmMin}–${t.kmMax} km a day`
  return [LEVEL[t.level][lang], age, max, km].filter(Boolean).join(' · ')
}

const half = (n: number) => (Number.isInteger(n) ? String(n) : `${Math.floor(n)}½`)

export function herdLine(t: LongTourFacts, lang: Lang): string {
  if (t.herdDays <= 0) return { is: 'Án lausra hrossa', en: 'No free-running herd', de: 'Ohne freilaufende Herde' }[lang]
  if (t.herdDays >= t.ridingDays) return { is: 'Riðið með lausum hrossum', en: 'Ridden with a free-running herd', de: 'Mit freilaufender Herde' }[lang]
  const n = half(t.herdDays)
  return {
    is: `Laus hross í ${n} af ${t.ridingDays} reiðdögum`,
    en: `Free-running herd on ${n} of ${t.ridingDays} riding days`,
    de: `Freilaufende Herde an ${n} von ${t.ridingDays} Reittagen`,
  }[lang]
}

export const BEDS: Record<Beds, L3> = {
  made: { is: 'Uppábúin rúm', en: 'Made-up beds', de: 'Gemachte Betten' },
  sleepingBag: { is: 'Svefnpokagisting, takið með svefnpoka', en: 'Sleeping-bag accommodation, bring your own', de: 'Schlafsackunterkunft, bitte eigenen Schlafsack mitbringen' },
}

export function nightsLine(t: LongTourFacts, lang: Lang): string {
  const n = t.days - 1
  return lang === 'is' ? `${t.days} dagar, ${n} nætur` : lang === 'de' ? `${t.days} Tage, ${n} Nächte` : `${t.days} days, ${n} nights`
}

/* ── short tours ────────────────────────────────────────────────────────── */
/** Month ranges, wrap-aware: [11,12,1,2,3,4] → "nóv–apr". Empty/undefined → all year. */
export function monthsLabel(months: number[] | undefined, lang: Lang): string {
  const ms = [...new Set((months ?? []).filter((m) => m >= 1 && m <= 12))].sort((a, b) => a - b)
  if (!ms.length || ms.length === 12) return { is: 'Allt árið', en: 'All year', de: 'Ganzjährig' }[lang]
  // find the run start: a month whose predecessor (wrapping) is not in the set
  const has = new Set(ms)
  const starts = ms.filter((m) => !has.has(m === 1 ? 12 : m - 1))
  const runs = starts.map((s) => {
    let e = s
    while (has.has(e === 12 ? 1 : e + 1) && (e === 12 ? 1 : e + 1) !== s) e = e === 12 ? 1 : e + 1
    return s === e ? monthShort(s, lang) : `${monthShort(s, lang)}–${monthShort(e, lang)}`
  })
  return runs.join(', ')
}

/** Is month m (1–12) inside the tour's months? Empty = all year. */
export const runsIn = (months: number[] | undefined, m: number) => !months?.length || months.includes(m)

/** "All levels · age 6+" for a short tour — every short tour takes every level. */
export function shortLevel(minAge: number, lang: Lang): string {
  const all = { is: 'Fyrir alla', en: 'All levels', de: 'Alle Niveaus' }[lang]
  const age = lang === 'is' ? `${minAge} ára+` : lang === 'de' ? `ab ${minAge}` : `age ${minAge}+`
  return `${all} · ${age}`
}
