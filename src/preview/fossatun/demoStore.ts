/**
 * THE TWO-SIDED DEMO STORE.
 *
 * One booking, two screens: the guest makes a request on the redesign, and it
 * appears in the owner's dashboard as a pending item. That single loop explains
 * the product better than any paragraph, so it has to actually work.
 *
 * WHY NO BACKEND. Both pages are the same origin, so `localStorage` is the
 * store and `BroadcastChannel` pushes changes between open tabs, with the
 * `storage` event as a fallback. Two tabs side by side update live. There is
 * no server to pay for, nothing to authenticate, and it still works with no
 * network, which matters when the demo is being driven in someone's kitchen.
 *
 * The trade is that it is one browser: a booking made on a phone will not show
 * on a laptop. That is the right trade for a demo one person drives, and the
 * real multi-device version already exists in sndr-platform behind owner auth.
 * Do NOT reach for the Worker and KV to show somebody a screen.
 *
 * Everything here is demo data and says so. `reset()` wipes it.
 */

import type { Booking } from '../../booking/types'

const KEY = 'fossatun_demo_bookings_v2'
const CHANNEL = 'fossatun_demo'

export type DemoStatus = 'REQUESTED' | 'CONFIRMED' | 'DECLINED'

export interface DemoBooking extends Booking {
  /** Set when the row was made from the dashboard rather than the guest page. */
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

  /**
   * Fires on any change, from this tab or another one. Returns an unsubscribe.
   * Both channels are wired because BroadcastChannel does not fire in the tab
   * that posted, and the storage event does not fire in the tab that wrote.
   * Together they cover both directions.
   */
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
