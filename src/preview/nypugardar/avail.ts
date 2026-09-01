/**
 * Nýpugarðar — what the baked availability can and cannot say.
 *
 * tools/nypugardar-prices.mjs snapshots per-day inventory for all seven room
 * types into prices.json at BUILD time (one digit per day per room). This
 * module is the only reader. It exists for two jobs:
 *
 *   1. Grey out nights nobody can book in the date picker, so a guest is not
 *      sent to Godo to discover a sold-out farm on the other side.
 *   2. Open the default stay on the first window that can actually be booked.
 *      Today + 1 was the old default; measured on 2026-08-30, the next real
 *      two-night window was 53 days out, so every guest's first click died.
 *
 * WHAT IT MUST NEVER DO: overrule Godo. The snapshot ages between deploys, so
 * a stay the snapshot dislikes still gets a live handoff (the CTA never
 * disables), and once the snapshot is older than STALE_DAYS the picker stops
 * blocking dates entirely rather than blocking on fiction.
 */

import PRICES from './prices.json'
import { addDays, startOfDay, type GodoRoomKey } from './godo'

type Availability = {
  start: string
  days: number
  rooms: Partial<Record<GodoRoomKey, string>>
}

const AVAIL: Availability | null =
  (PRICES as { availability?: Availability }).availability ?? null

/** After this many days the snapshot blocks nothing: stale certainty is worse
 *  than sending the guest to Godo, which is always right. */
const STALE_DAYS = 45

function snapshotStart(): Date | null {
  if (!AVAIL) return null
  const [y, m, d] = AVAIL.start.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

const START = snapshotStart()

const STALE =
  !START ||
  (startOfDay(new Date()).getTime() - START.getTime()) / 86_400_000 >
    STALE_DAYS

/** Day index into the availability strings, or null when out of range. */
function dayIndex(d: Date): number | null {
  if (!START || !AVAIL) return null
  const i = Math.round((startOfDay(d).getTime() - START.getTime()) / 86_400_000)
  return i >= 0 && i < AVAIL.days ? i : null
}

/** Whether availability data is fresh enough for the picker to block dates. */
export function availKnown(): boolean {
  return !!AVAIL && !STALE
}

/** The day the snapshot was taken: a date that is the SAME on the build
 *  machine and in every browser, which is what the first render needs as its
 *  "today" so prerendered markup and the client's first render agree. The
 *  real clock replaces it in an effect. */
export function snapshotDate(): Date | null {
  return START ? new Date(START) : null
}

/** True when at least one room type has inventory for the NIGHT starting `d`.
 *  Out-of-range or stale data answers true — unknown is not sold out. */
export function anyRoomFree(d: Date): boolean {
  if (!availKnown()) return true
  const i = dayIndex(d)
  if (i === null) return true
  for (const s of Object.values(AVAIL!.rooms)) {
    if (s && s.charCodeAt(i) > 48 /* '0' */) return true
  }
  return false
}

/**
 * Can this exact stay be booked as one reservation? True only when a single
 * room type has inventory on every night of [checkin, checkout). A range whose
 * nights are covered by different rooms on different days is not a stay anyone
 * can actually book, and it is the case a per-night check quietly waves
 * through. Unknown/stale data answers true.
 */
export function stayBookable(checkin: Date, checkout: Date): boolean {
  if (!availKnown()) return true
  const first = dayIndex(checkin)
  if (first === null) return true
  const nights = Math.round(
    (startOfDay(checkout).getTime() - startOfDay(checkin).getTime()) /
      86_400_000,
  )
  if (nights <= 0) return false
  for (const s of Object.values(AVAIL!.rooms)) {
    if (!s) continue
    let ok = true
    for (let n = 0; n < nights; n++) {
      const i = first + n
      if (i >= s.length) break /* past the horizon: give the benefit of doubt */
      if (s.charCodeAt(i) <= 48) {
        ok = false
        break
      }
    }
    if (ok) return true
  }
  return false
}

/**
 * The first date from tomorrow onward where some room type has `nights`
 * consecutive free nights — the honest default check-in. Falls back to
 * tomorrow when data is stale or nothing matches inside the horizon.
 */
export function firstBookableCheckin(nights = 2, from: Date = new Date()): Date {
  const tomorrow = addDays(startOfDay(from), 1)
  if (!availKnown()) return tomorrow
  for (let probe = tomorrow, n = 0; n < AVAIL!.days; n++, probe = addDays(probe, 1)) {
    if (dayIndex(probe) === null) break
    if (stayBookable(probe, addDays(probe, nights))) return probe
  }
  return tomorrow
}
