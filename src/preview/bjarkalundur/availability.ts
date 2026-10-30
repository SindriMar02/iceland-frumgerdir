import { addDays } from './godo'

export type PriceSnapshot = {
  currency: string
  rooms: Record<string, { from: number | null }>
  availability?: { start: string; days: number; rooms: Record<string, string> }
}

// An empty glob is valid: credentials and a snapshot are not needed to build.
const snapshots = import.meta.glob<PriceSnapshot>('./prices.json', { eager: true, import: 'default' })
export const prices = snapshots['./prices.json']

const dayNumber = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000

/** Unknown is deliberately different from zero, including failed room calls. */
export function inventory(room: string, day: Date, snapshot = prices): number | null {
  const a = snapshot?.availability
  if (!a || !/^\d{4}-\d{2}-\d{2}$/.test(a.start)) return null
  const index = dayNumber(day) - Date.parse(`${a.start}T00:00:00Z`) / 86_400_000
  if (!Number.isInteger(index) || index < 0 || index >= a.days) return null
  const digit = a.rooms[room]?.[index]
  return digit && /^[0-9]$/.test(digit) ? Number(digit) : null
}

/** Checkout is not an occupied night. Unknown dates stay bookable through Godo. */
export function soldOut(room: string, start: Date | null, end: Date | null, snapshot = prices): boolean {
  if (!start || !end) return false
  for (let day = start; day < end; day = addDays(day, 1)) {
    if (inventory(room, day, snapshot) === 0) return true
  }
  return false
}
