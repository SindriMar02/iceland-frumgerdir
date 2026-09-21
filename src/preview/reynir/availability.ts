/** Bakery-local availability. Reykjavik uses UTC throughout the year. */
export interface OpeningDay { open: number; close: number; closed?: boolean }
export interface DateException extends OpeningDay { date: string }
export interface Notice { leadDays: number; noticeMode?: 'hours' | 'calendarDays' }
export const bakeryDate = (now: number) => new Date(now).toISOString().slice(0, 10)
export function noticeAt(products: Notice[], now: number): number {
  return Math.max(now, ...products.map(p => p.noticeMode === 'calendarDays'
    ? Date.parse(`${bakeryDate(now)}T00:00:00Z`) + p.leadDays * 86_400_000
    : now + p.leadDays * 86_400_000))
}
export function pickupSlots(date: string, weekly: readonly OpeningDay[], exceptions: DateException[], minimum: number): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return []
  const midnight = Date.parse(`${date}T00:00:00Z`)
  if (!Number.isFinite(midnight) || bakeryDate(midnight) !== date) return []
  const day = exceptions.find(d => d.date === date) ?? weekly[new Date(midnight).getUTCDay()]
  if (!day || day.closed || !Number.isInteger(day.open) || !Number.isInteger(day.close) || day.open < 0 || day.close > 1440 || day.close <= day.open) return []
  const slots: string[] = []
  for (let m = Math.ceil(day.open / 30) * 30; m <= day.close - 30; m += 30) {
    if (midnight + m * 60_000 >= minimum) slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return slots
}

/** Date exceptions from today up to `days` ahead, soonest first: what the
 *  printed hours must mention so "every day 7 to 17" is not the whole truth
 *  on Christmas Day. */
export function upcomingExceptions<T extends DateException>(exceptions: T[], now: number, days = 21): T[] {
  const today = bakeryDate(now)
  const last = bakeryDate(now + days * 86_400_000)
  return exceptions.filter(d => d.date >= today && d.date <= last).sort((a, b) => a.date.localeCompare(b.date))
}

/** A dated notice is live from `from` through `to` inclusive (bakery dates).
 *  A missing end means it never expires on its own, which the Studio blocks. */
export function noticeIsActive(notice: { from?: string; to?: string } | null, now: number): boolean {
  if (!notice) return false
  const today = bakeryDate(now)
  return (!notice.from || notice.from <= today) && (!notice.to || today <= notice.to)
}

const MONTHS = {
  is: ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}
/** "2026-12-24" -> "24. des." / "24 Dec". Hand-rolled: Intl has no Icelandic. */
export function shortDate(date: string, lang: 'is' | 'en'): string {
  const [, m, d] = date.split('-').map(Number)
  return lang === 'is' ? `${d}. ${MONTHS.is[m - 1]}` : `${d} ${MONTHS.en[m - 1]}`
}
