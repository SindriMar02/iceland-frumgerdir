import type { Lang } from './data'

type TimedRide = { times?: string[] }

/** No date means the published annual schedule. Iceland dates use ISO YYYY-MM-DD. */
export function timesOn(tour: TimedRide, date?: string): string[] {
  const times = tour.times ?? []
  if (!date) return times
  const month = Number(date.slice(5, 7))
  return times.filter((time) => time !== '09:00' || (month >= 3 && month <= 10))
}

/** Only rides whose annual schedule changes need the undated schedule note. */
export function departureNote(tour: TimedRide, lang: Lang): string {
  if (timesOn(tour).length === timesOn(tour, '2000-11-01').length) return ''
  return {
    is: 'Brottför kl. 09:00 er aðeins í boði frá mars til október.',
    en: '09:00 departures are March–October only.',
    de: 'Abfahrten um 09:00 Uhr nur von März bis Oktober.',
  }[lang]
}
