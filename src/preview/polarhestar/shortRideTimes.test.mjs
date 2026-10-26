import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const load = (file) => {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const exports = {}
  Function('exports', js)(exports)
  return exports
}
const { timesOn, departureNote } = load('./shortRideTimes.ts')
const tour = { times: ['09:00', '09:30', '10:00', '14:00'] }

test('09:00 is excluded throughout November–February, including leap days, every year', () => {
  for (const year of [2026, 2027, 2028, 2032]) {
    for (const month of [1, 2, 11, 12]) {
      const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
      for (let day = 1; day <= last; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        assert.deepEqual(timesOn(tour, date), ['09:30', '10:00', '14:00'], date)
      }
    }
    for (const date of [`${year}-03-01`, `${year}-10-31`]) assert.deepEqual(timesOn(tour, date), tour.times)
  }
})

test('annual schedule, on-request rides, and a winter ride with only 09:00 remain distinct', () => {
  assert.deepEqual(timesOn(tour), tour.times)
  assert.deepEqual(timesOn({}, '2026-12-01'), [])
  assert.deepEqual(timesOn({ times: ['09:00'] }, '2026-12-01'), [])
  assert.deepEqual(timesOn({ times: ['09:00'] }, '2027-03-01'), ['09:00'])
  for (const lang of ['is', 'en', 'de']) {
    assert.match(departureNote(tour, lang), /09:00/)
    assert.equal(departureNote({ times: ['09:30'] }, lang), '')
    assert.equal(departureNote({}, lang), '')
  }
})

// Exercise the actual booking-window functions without rendering or contacting the API.
const source = readFileSync(new URL('./Page.tsx', import.meta.url), 'utf8')
const snippet = source.slice(source.indexOf('const LEAD_HOURS'), source.indexOf('/** Trilingual inline pick'))
const js = ts.transpileModule(snippet, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
const { startsOf, requestWindow } = Function('timesOn', `${js}; return { startsOf, requestWindow }`)(timesOn)

test('booking window skips winter 09:00-only days without treating them as on-request', () => {
  assert.deepEqual(startsOf(tour, '2026-11-01'), [570, 600, 840])
  assert.deepEqual(startsOf({}, '2026-11-01'), [0])
  assert.deepEqual(startsOf({ times: ['09:00'] }, '2026-11-01'), [])
  const window = requestWindow({ times: ['09:00'] }, Date.parse('2026-11-01T00:00:00Z'))
  assert.equal(window.minIso, '2027-03-01')
  assert.equal(window.maxIso, '2027-10-31')
})
