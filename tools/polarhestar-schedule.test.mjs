// Pólar Hestar schedule logic. Run: node --test tools/polarhestar-schedule.test.mjs
// Dates are relative to a fixed "today" passed in, never the real clock.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  allDepartures, departuresLine, formatRange, herdLine, metaLine, monthsLabel, requirementsLine, upcoming,
} from '../src/preview/polarhestar/schedule.ts'
import { LONG_TOURS } from '../src/preview/polarhestar/data.ts'

const BEFORE = '2026-09-21' // before every 2027 departure
const byId = (id) => LONG_TOURS.find((t) => t.id === id)

test('ranges read the way the farm writes them', () => {
  assert.equal(formatRange('2027-06-06', '2027-06-12', 'en'), 'June 6–12')
  assert.equal(formatRange('2027-06-06', '2027-06-12', 'is'), '6.–12. júní')
  assert.equal(formatRange('2027-06-26', '2027-07-03', 'de'), '26. Juni–3. Juli')
  assert.equal(formatRange('2027-06-26', '2027-07-03', 'en', true), 'June 26–July 3, 2027')
})

test('the end day is derived from the tour length, never typed', () => {
  const fn = byId('fascinating-north')
  assert.deepEqual(allDepartures(fn).map((d) => d.end), ['2027-07-03', '2027-07-14', '2027-07-25', '2027-08-05'])
  assert.deepEqual(allDepartures(byId('hidden-pearls')).map((d) => d.end), ['2027-08-16', '2027-08-28'])
})

test('card lines match the published 2027 programme', () => {
  assert.equal(metaLine(byId('midnightsun'), 'en', BEFORE), '7 days · 5 riding days · June · €2,150')
  assert.equal(metaLine(byId('fascinating-north'), 'en', BEFORE), '8 days · 6 riding days · June–August · €2,750')
  assert.equal(metaLine(byId('hidden-pearls'), 'en', BEFORE), '9 days · 7 riding days · August · €2,800')
  assert.equal(metaLine(byId('autumn-northern-lights'), 'is', BEFORE), '7 dagar · 5 reiðdagar · september · 1.950€')
  assert.equal(
    departuresLine(byId('fascinating-north'), 'en', BEFORE),
    'Departures 2027: June 26–July 3, July 7–14, July 18–25 (fully booked) and July 29–August 5 (fully booked)',
  )
  assert.equal(departuresLine(byId('midnightsun'), 'de', BEFORE), 'Termine 2027: 6.–12. Juni und 14.–20. Juni')
  assert.equal(
    requirementsLine(byId('hidden-pearls'), 'en'),
    'Experienced riders · age 14+ · max 12 riders · 20–35 km a day',
  )
  assert.equal(herdLine(byId('hidden-pearls'), 'en'), 'Free-running herd on 4 of 7 riding days')
})

test('past and cancelled departures drop off by themselves', () => {
  const t = {
    days: 7, priceEur: 1, ridingDays: 5, level: 'mixed', minAge: 12, kmMin: 1, kmMax: 2, herdDays: 0, beds: 'made',
    departures: [
      { start: '2027-06-06', status: 'open' },
      { start: '2027-06-14', status: 'cancelled' },
      { start: '2027-06-20', status: 'few' },
    ],
  }
  assert.deepEqual(upcoming(t, '2027-06-07').map((d) => d.start), ['2027-06-20'])
  assert.equal(departuresLine(t, 'en', '2027-06-07'), 'Departures 2027: June 20–26 (few places left)')
  assert.equal(departuresLine(t, 'en', '2027-07-01'), 'The next departures have not been published yet')
  assert.equal(metaLine(t, 'en', '2027-07-01'), '7 days · 5 riding days · €1', 'no month pill without a future date')
})

test('an owner note replaces the default when no dates are out', () => {
  const t = { ...byId('back-to-roots'), datesNote: { is: 'x', en: '2027 dates coming soon', de: 'y' } }
  assert.equal(departuresLine(t, 'en', BEFORE), '2027 dates coming soon')
})

test('malformed and duplicate dates are dropped, not rendered', () => {
  const t = { days: 3, departures: [{ start: '2027-02-30', status: 'open' }, { start: 'june', status: 'open' },
    { start: '2027-05-01', status: 'open' }, { start: '2027-05-01', status: 'full' }] }
  assert.deepEqual(allDepartures(t).map((d) => d.start), ['2027-05-01'])
})

test('month windows wrap the new year', () => {
  assert.equal(monthsLabel([11, 12, 1, 2, 3, 4], 'is'), 'nóv–apr')
  assert.equal(monthsLabel([6, 7, 8], 'en'), 'Jun–Aug')
  assert.equal(monthsLabel(undefined, 'de'), 'Ganzjährig')
})
