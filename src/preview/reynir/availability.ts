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
