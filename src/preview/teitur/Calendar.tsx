/* eslint-disable react-refresh/only-export-components -- the date helpers live beside the calendar they serve */
import { useEffect, useState } from 'react'
import { REQ } from './data'
import type { Lang, Tab } from './data'

/* The range calendar, ported from the stay picker (Aurora Hills, audited on a real iPhone 30 Aug 2026;
   fagravik/StayPicker.tsx): Monday-first six-row grid so the panel never changes height, three-rule click state
   machine with no clear button, hover preview of the provisional range, past days blocked.
   Teitur publishes no availability, so nothing is struck out and no day is promised: a coach request is subject to
   confirmation. `today` is read on mount only, so a prerender never bakes the build date. */

const DAY = 86_400_000
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && key(a) === key(b)
export const daysBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY) + 1

export const fmtShort = (d: Date, lang: Lang) => {
  const m = REQ[lang].months[d.getMonth()]
  return lang === 'is' ? `${d.getDate()}. ${m.slice(0, 3)}.` : `${d.getDate()} ${m.slice(0, 3)}`
}
export const fmtLong = (d: Date, lang: Lang) => {
  const m = REQ[lang].months[d.getMonth()]
  return lang === 'is' ? `${d.getDate()}. ${m} ${d.getFullYear()}` : `${d.getDate()} ${m} ${d.getFullYear()}`
}

function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(first, i - lead)
    return { date, inMonth: date.getMonth() === month.getMonth() }
  })
}

type Props = {
  lang: Lang
  tab: Tab
  start: Date | null
  end: Date | null
  onPick: (start: Date | null, end: Date | null, complete: boolean) => void
  one?: boolean
}

export function Calendar({ lang, tab, start, end, onPick, one }: Props) {
  const t = REQ[lang]
  const range = tab === 'multi'
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)

  useEffect(() => {
    const now = startOfDay(new Date())
    setToday(now)
    const base = start ?? now
    const left = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
    /* with a week or less of the month left, open on the next one (as the stay picker does) */
    setMonth(new Date(base.getFullYear(), base.getMonth() + (!start && left < 7 ? 1 : 0), 1))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pick(day: Date) {
    if (!today || day < today) return
    if (!range) return onPick(day, null, true)
    if (!start || (start && end)) return onPick(day, null, false)
    if (day <= start) return onPick(day, null, false)
    onPick(start, day, true)
  }

  const shown = month ? (one ? [month] : [month, addMonths(month, 1)]) : []
  const preview = range && start && !end && hover && hover > start ? hover : null
  const lastEnd = end ?? preview

  return (
    <div className={`tj-cal${one ? ' tj-cal--one' : ''}`}>
      <div className="tj-cal__nav">
        <button type="button" className="tj-cal__arrow" aria-label={t.cal.prev} disabled={!today || !month || month <= new Date(today.getFullYear(), today.getMonth(), 1)}
          onClick={() => month && setMonth(addMonths(month, -1))}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
        </button>
        <p className="tj-cal__hint" aria-live="polite">{start && end ? t.cal.nights(daysBetween(start, end)) : t.cal.hint[tab]}</p>
        <button type="button" className="tj-cal__arrow" aria-label={t.cal.next} onClick={() => month && setMonth(addMonths(month, 1))}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" /></svg>
        </button>
      </div>
      <div className="tj-cal__months" onMouseLeave={() => setHover(null)}>
        {shown.map((m) => (
          <div key={key(m)} className="tj-cal__m">
            <p className="tj-cal__title">{t.months[m.getMonth()]} {m.getFullYear()}</p>
            <div className="tj-cal__dow" aria-hidden="true">{t.dowShort.map((d) => <span key={d}>{d}</span>)}</div>
            <div className="tj-cal__grid">
              {monthGrid(m).map(({ date, inMonth }) => {
                const past = !today || date < today
                const isStart = same(date, start)
                const isEnd = same(date, end) || same(date, preview)
                const inside = !!start && !!lastEnd && date > start && date < lastEnd
                const cls = ['tj-cal__d', !inMonth && 'is-out', past && 'is-past', (isStart || isEnd) && 'is-edge', inside && 'is-in',
                  isStart && lastEnd && !same(start, lastEnd) && 'is-first', isEnd && start && !same(start, lastEnd) && 'is-last', same(date, today) && 'is-today'].filter(Boolean).join(' ')
                return (
                  <button key={key(date)} type="button" className={cls} disabled={past || !inMonth} tabIndex={inMonth ? 0 : -1}
                    aria-label={fmtLong(date, lang)} aria-pressed={isStart || isEnd}
                    onMouseEnter={() => setHover(date)} onFocus={() => setHover(date)} onClick={() => pick(date)}>
                    <span>{inMonth ? date.getDate() : ''}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
