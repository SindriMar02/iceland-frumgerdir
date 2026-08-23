/**
 * Demo persistence. localStorage only.
 *
 * In production this is a Cloudflare Worker + KV or D1, and the engine is
 * unchanged — that is the reason it was written pure. For showing Sindri and
 * the owners how it feels, localStorage is honest: requests survive a reload,
 * both the guest view and the owner view read the same list, and nothing
 * leaves the browser.
 */

import type { Booking, BookingStatus } from './types'

const KEY = 'bokun.polarhestar.v1'

/** Broadcast so the guest tab and the owner tab stay in sync in one session. */
const CHANGED = 'bokun:changed'

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

function persist(list: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(CHANGED))
}

export function addBooking(b: Booking) {
  persist([...loadBookings(), b])
}

export function setStatus(id: string, status: BookingStatus) {
  persist(loadBookings().map((b) => (b.id === id ? { ...b, status } : b)))
}

export function clearAll() {
  persist([])
}

export function onChange(fn: () => void) {
  window.addEventListener(CHANGED, fn)
  window.addEventListener('storage', fn)
  return () => {
    window.removeEventListener(CHANGED, fn)
    window.removeEventListener('storage', fn)
  }
}

/** Demo ids are readable so the owner list looks like a real reference. */
export function newId(): string {
  const n = loadBookings().length + 1
  return `PH-${String(n).padStart(3, '0')}`
}

/**
 * A couple of requests already in the list, so the owner view is not empty the
 * first time it is opened. Clearly fake names.
 */
export function seedIfEmpty(todayISO: string, tomorrowISO: string) {
  if (loadBookings().length) return
  const base = {
    status: 'REQUESTED' as BookingStatus,
    createdAt: new Date().toISOString(),
    quote: { lines: [], total: 0, deposit: 0, units: 1, estimate: true },
  }
  persist([
    {
      ...base,
      id: 'PH-001',
      resourceId: 'fyrstu-kynni',
      date: tomorrowISO,
      startMinute: 10 * 60,
      people: 2,
      customer: { name: 'Anna Sigurðardóttir', phone: '6641234', email: 'anna@example.is' },
      note: 'Eitt barn, 9 ára.',
      quote: { ...base.quote, total: 17000, lines: [{ label: '1 fullorðinn', amount: 9500 }, { label: '1 barn', amount: 7500 }] },
    } as Booking,
    {
      ...base,
      id: 'PH-002',
      status: 'CONFIRMED',
      resourceId: 'hofdahringur',
      date: todayISO,
      startMinute: 14 * 60,
      people: 4,
      customer: { name: 'Thomas Berger', phone: '7729911', email: 'thomas@example.de' },
      note: 'Vanir knapar, koma frá Akureyri.',
      quote: { ...base.quote, total: 72000, lines: [{ label: '4 fullorðnir', amount: 72000 }] },
    } as Booking,
  ])
}
