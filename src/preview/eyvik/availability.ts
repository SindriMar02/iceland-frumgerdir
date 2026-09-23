/**
 * THE FIVE CALENDARS, as Airbnb held them on 22 September 2026.
 *
 * Read from each cottage's own Airbnb availability calendar the same day the
 * site was built: one character per night from START, 344 nights, to 31 Aug 2027.
 *   x  booked or closed
 *   o  free, two-night minimum from this arrival
 *   1  free, one night allowed (Airbnb opens single nights to fill gaps)
 * Nothing here is invented. It is a snapshot, and the panel says so: the live
 * version reads the same calendars through the booking engine, which is the
 * thing being sold.
 */
export const START = '2026-09-22'
export const SNAPSHOT_DATE = '22 September 2026'

export const NIGHTS: Record<'A' | 'B' | 'C' | 'D' | 'E', string> = {
  A: 'xxxxxxxxxxxxxxx1xxxxxxxxxx1xx1ooxxoooooxxxxxooxxxxxxxxxxxxxxx1xxxx1xxxxxxoooxxxxxxxxoooooooooooooxxxxxxoooxxx1xxxoooooooooooooooxxxooooooxxxooooooxxxxxooxxxoxxooooooooooxxxooooooooooxxooooooooooooooooooooooooooooooooxxooooooooooxxooxxxooooooooooooooxxxooooooooooxxxxxxxxxxxxxoooooooooxxxxxooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  B: '1xxxx1xxooxxxxxxxxxxxx1xxxx1xxooxxxxxxxx1xxxxx1xxooooooooooxxxxxxoooooooooooooooooooooooooooooooooxxoooxxxxxooooooooooooooooooooooooxxxooooooooooooooooooooooooooooooooxxxxxooooooooxxxxxxooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooxxoooxxxoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  C: '1xxxxxooooxxxxxxxxxxxxxxxxxxx1xxxxxxxxxxxxxxxx1xxoooooooooooooxxxxxoooooxxxooooooxxxxxxxoooooooooooooooooooxxxooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooxxooxxoooooooooooooooooooooooooooooooxxxxoooooooooooooooooooooooooooooooooooooooooooooxxxxxoooooooxxoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  D: 'xxxxxxxxx1xxxxxxxxxxxx1xxxxxxxxooxxxxx1xxxxooooxx1xxxoooxxxxxx1xxxxooxxoooooxxxxxxoooooooooooooooxxxoooxxooxxoxxxxxxxooooooooooooooxxooooxxxxxxooooooooooooooxxooooooooooooooooooooooooooooxxxoxxxooooooooooooooooooooxxoooooooooooooooooooooxxxooooooooooxxxxooooooxxxxoooooxxxoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
  E: 'xxxxxxxxxxxxxooxxxxooxxxxxooxxx1xx1xx1xxoooxxxx1xxxxxxxxxoooxxxoxxxxx1xxxxxxxxxxxooxxoooooooooooxxoooxxxxoooxxxxxxxoooooooooooooxxxoooooooxxooooooxoooooooooooxxooooooooooooooooooooooooooooooxxxoooooooooooooooooooooooooooooxxxxxooooxxooooooooxooooooooooooooooooxxxoooooxxxxxoooooooxxxooooooooooxxxxxoooooooooooooooooooooooooooooooooooooooooooooo',
}

const DAY = 86_400_000
const start = new Date(2026, 8, 22)

/** 'x' | 'o' | '1', or null outside the snapshot (treated as unknown, never as free). */
export function nightState(id: keyof typeof NIGHTS, d: Date): 'x' | 'o' | '1' | null {
  const i = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - start.getTime()) / DAY)
  const c = NIGHTS[id][i]
  return c === 'x' || c === 'o' || c === '1' ? c : null
}
