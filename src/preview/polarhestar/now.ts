/**
 * Pólar Hestar — "today", frozen for the first render of a prerendered page.
 *
 * The standalone build bakes the schedule into the HTML on build day: which
 * departures are still ahead, which month the next one falls in. If the
 * browser hydrates that HTML on a later day with a different "today", the two
 * disagree the moment a departure date has passed, and React throws the
 * markup away and rebuilds the page. So the first render everywhere, server
 * and browser, uses the build date (freezeToday in schedule.ts, called by the
 * entry points); useLiveClock() (called by each page) thaws the clock right
 * after hydration and renders once more with the real date. Visitors see the
 * live schedule; crawlers read the build-day one.
 *
 * Catalogue preview: nothing is ever frozen, so this does nothing there.
 */
import { useEffect, useState } from 'react'
import { isTodayFrozen, thawToday } from './schedule'

/** Call once per page. After hydration it unfreezes the clock and re-renders the page with the real date. */
export function useLiveClock() {
  const [, bump] = useState(0)
  useEffect(() => {
    if (!isTodayFrozen()) return
    thawToday()
    bump(1)
  }, [])
}
