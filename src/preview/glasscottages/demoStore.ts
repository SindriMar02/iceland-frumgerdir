/**
 * THE TWO-SIDED DEMO STORE — Glass Cottages edition.
 *
 * One booking, two screens: the guest requests nights on the redesign and it
 * appears in Ari's dashboard as a pending row. localStorage is the store,
 * BroadcastChannel pushes between tabs, storage event as fallback. No server,
 * no auth. (Lineage: fossatun → mirrorhouse → here, only the keys change.)
 */

import type { Booking } from '../../booking/types'

const KEY = 'glasscottages_demo_bookings_v1'
const CHANNEL = 'glasscottages_demo'

export type DemoStatus = 'REQUESTED' | 'CONFIRMED' | 'DECLINED'

export interface DemoBooking extends Booking {
  viaOwner?: boolean
}

function read(): DemoBooking[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    // one corrupt row must not blind the dashboard to the rest
    return Array.isArray(parsed) ? parsed.filter((b) => b && typeof b.id === 'string') : []
  } catch {
    return []
  }
}

function write(rows: DemoBooking[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows))
  } catch {
    /* private mode: the demo still works in-memory for this tab */
  }
  try {
    new BroadcastChannel(CHANNEL).postMessage({ t: Date.now() })
  } catch {
    /* no BroadcastChannel: the storage event below still fires cross-tab */
  }
}

export const demo = {
  all: read,

  add(b: DemoBooking) {
    const rows = read()
    rows.push(b)
    write(rows)
    return rows
  },

  setStatus(id: string, status: DemoStatus) {
    const rows = read().map((b) => (b.id === id ? { ...b, status } : b))
    write(rows)
    return rows
  },

  reset() {
    write([])
    return []
  },

  subscribe(fn: () => void) {
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel(CHANNEL)
      bc.onmessage = () => fn()
    } catch {
      bc = null
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) fn()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      bc?.close()
      window.removeEventListener('storage', onStorage)
    }
  },
}
