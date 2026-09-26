/* The page-wide state every section reads: which language and page the URL
   says, the copy for that language, and the ONE stay the guest is shaping.
   The stay lives here, not in the calendar, because the room rows carry their
   own Book links and must hand Godo the same nights and party the calendar
   holds ([[booking-range-calendar-pattern]]). */
import { createContext, useContext } from 'react'
import type { Copy } from './copy'
import type { Lang, PageKey } from './paths'

export type Stay = { checkin: Date | null; checkout: Date | null; adults: number; children: number }

export type Site = {
  lang: Lang
  page: PageKey
  t: Copy
  stay: Stay
  setStay: (next: Partial<Stay>) => void
  /** null until mounted: a prerendered page must not bake the build day in */
  today: Date | null
}

export const SiteContext = createContext<Site | null>(null)

export function useSite(): Site {
  const s = useContext(SiteContext)
  if (!s) throw new Error('useSite outside SiteContext')
  return s
}
