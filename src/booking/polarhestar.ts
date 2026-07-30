/**
 * Pólar Hestar, configured on the shared booking core.
 *
 * This is the whole point of the demo: everything below is DATA. No booking
 * logic lives here. The same engine that runs this runs a guesthouse or a
 * workshop, and setting up a new business means filling in a form like this
 * one rather than writing code.
 *
 * Every tour, price, month window, departure time and age limit is taken
 * verbatim from src/preview/polarhestar/data.ts, which was itself verified
 * against polarhestar.is. Children up to 12 pay 2.000 kr. less.
 */

import type { BusinessConfig, Resource } from './types'

export interface TourMeta {
  id: string
  name: string
  nameEn: string
  duration: string
  level: string
  price: number
  /** Months 1-12 the tour runs. Undefined = all year. */
  months?: number[]
  times: string[]
  /** Riders one guide can take out at once. */
  maxRiders: number
}

/** Their real 2026 short-tour line-up. */
export const TOURS: TourMeta[] = [
  {
    id: 'fyrstu-kynni',
    name: 'Fyrstu kynni',
    nameEn: 'Grýtubakki Charm',
    duration: '1 klukkustund',
    level: 'Fyrir alla · 6 ára+',
    price: 9500,
    times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    maxRiders: 8,
  },
  {
    id: 'moa-og-mela',
    name: 'Yfir móa og mela',
    nameEn: 'River & Mountains',
    duration: '2 klukkustundir',
    level: 'Fyrir alla · 6 ára+',
    price: 15000,
    months: [5, 6, 7, 8, 9, 10],
    times: ['10:00', '14:00'],
    maxRiders: 8,
  },
  {
    id: 'hofdahringur',
    name: 'Höfðahringur',
    nameEn: 'Fascinating Eyjafjörður',
    duration: '3 klukkustundir',
    level: 'Fyrir alla · 8 ára+',
    price: 18000,
    months: [5, 6, 7, 8, 9, 10],
    times: ['09:30', '14:00'],
    maxRiders: 6,
  },
  {
    id: 'frostrosir',
    name: 'Frostrósir',
    nameEn: 'Snowflakes & Frostroses',
    duration: '1½ klukkustund',
    level: 'Fyrir alla · 6 ára+',
    price: 12500,
    months: [11, 12, 1, 2, 3, 4],
    times: ['11:00', '14:00'],
    maxRiders: 8,
  },
  {
    id: 'sumarsaela',
    name: 'Sumarsæla',
    nameEn: 'Riding & Minigolf',
    duration: 'Reiðtúr og mínígolf',
    level: 'Fyrir alla · 6 ára+',
    price: 13500,
    months: [6, 7, 8],
    times: ['10:00', '14:00'],
    maxRiders: 8,
  },
]

export const CHILD_DISCOUNT = 2000
export const CHILD_MAX_AGE = 12

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Every departure time this tour offers, as minutes from midnight. */
export const tourTimes = (t: TourMeta) => t.times.map(toMinutes)

export const tourById = (id: string) => TOURS.find((t) => t.id === id)

/** Does this tour run in the month of the given date? */
export function runsOn(t: TourMeta, date: string): boolean {
  if (!t.months) return true
  const month = Number(date.slice(5, 7))
  return t.months.includes(month)
}

/**
 * One resource per tour: capacity is riders per departure, which is what the
 * engine's shared-capacity logic already handles (same shape as seats on a boat).
 */
const resources: Resource[] = TOURS.map((t) => ({
  id: t.id,
  name: t.name,
  capacity: t.maxRiders,
  // their real published departure times. Höfðahringur leaves at 09:30, which
  // no uniform hourly grid produces, so the resource carries its own list.
  times: tourTimes(t),
}))

export const POLARHESTAR: BusinessConfig = {
  slug: 'polarhestar',
  name: 'Pólar Hestar',
  unit: 'SLOT',
  timezone: 'Atlantic/Reykjavik',
  currency: 'ISK',
  mode: 'REQUEST',
  resources,
  availability: {
    // the farm takes rides every day; the per-tour month window narrows it
    opening: ([0, 1, 2, 3, 4, 5, 6] as const).map((d) => ({
      weekday: d,
      from: 9 * 60,
      to: 18 * 60,
    })),
    // 60 is only the minimum slot length; each tour supplies its real times
    slotMinutes: 60,
    bufferMinutes: 0,
    leadTimeHours: 12,
    horizonDays: 365,
  },
  // price is per tour, so it is applied per selection rather than from config
  pricing: {},
  copy: {
    cta: 'Senda bókunarbeiðni',
    unitSingular: 'ferð',
    unitPlural: 'ferðir',
    capacityLabel: 'knapar',
    capacitySingular: 'knapi',
    resourceLabel: 'Reiðtúr',
    confirmation:
      'Takk fyrir. Beiðnin er komin til okkar og við staðfestum hana með tölvupósti eða símtali. Ekkert er greitt á netinu.',
  },
}
