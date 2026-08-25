/**
 * Nýpugarðar — the one copy of "when are you coming, and how many of you".
 *
 * The hero picker sets it and the per-room booking links in the room list read
 * it, so a guest who chooses their nights at the top and then clicks a specific
 * room arrives on Godo with those nights already in place. Holding the dates
 * inside the picker instead would mean the room links quietly handed Godo a
 * different, default stay — the guest picks dates, clicks a room, and is asked
 * for dates again.
 *
 * Deliberately not a context: there is exactly one picker and one room list on
 * this page, both inside Page, so passing the value down is clearer than
 * wiring a provider for two consumers.
 */

import { useCallback, useMemo, useState } from 'react'
import { addDays, startOfDay } from './godo'

export type Stay = {
  checkin: Date
  checkout: Date
  adults: number
  /** Under 7. Guests 7 and older are charged as adults, per her Godo rules. */
  children: number
}

export function useStay(): {
  stay: Stay
  setStay: (next: Partial<Stay>) => void
  today: Date
} {
  /* One `new Date()` for the whole page. Two calls either side of midnight
     would give the picker a different "today" than the min= it validates
     against, which is a bug that only ever shows up at 00:00. */
  const today = useMemo(() => startOfDay(new Date()), [])
  const [stay, set] = useState<Stay>(() => ({
    /* Tomorrow, two nights: the shortest stay that is not "tonight", which on a
       farm 4 km off the Ring Road is almost never what someone is booking. */
    checkin: addDays(today, 1),
    checkout: addDays(today, 3),
    adults: 2,
    children: 0,
  }))

  const setStay = useCallback((next: Partial<Stay>) => {
    set((prev) => ({ ...prev, ...next }))
  }, [])

  return { stay, setStay, today }
}
