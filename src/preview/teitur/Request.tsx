/* eslint-disable react-refresh/only-export-components -- the Trip type and its helpers live beside the form they describe */
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, daysBetween, fmtLong, fmtShort } from './Calendar'
import { AGENTS, FLEET, PATHS, REQ, ROUTES, T, URLS } from './data'
import type { Amenity, Lang, Tab } from './data'

/* The request journey. Local only: nothing is posted, nothing is stored. It closes the gap measured on
   teitur.is/fa-tilbod/ (a raw {exp:freeform:form} error where the form should be): a structured, bilingual request
   with a summary before sending, an acknowledgement, and the phone as a visible fallback. No response-time promise
   is made because Teitur has not given one. No health details are asked for. */

export type Trip = {
  tab: Tab
  routeId: string
  from: string
  stops: string[]
  start: Date | null
  end: Date | null
  days: number[]
  time: string
  pax: string
  vehicle: string
  luggage: number
  equipment: Amenity[]
  ramp: boolean
  note: string
  name: string
  org: string
  email: string
  phone: string
  consent: boolean
}
export const emptyTrip = (): Trip => ({
  tab: 'day', routeId: '', from: '', stops: [''], start: null, end: null, days: [], time: '', pax: '',
  vehicle: '', luggage: 1, equipment: [], ramp: false, note: '', name: '', org: '', email: '', phone: '', consent: false,
})

type Errors = Partial<Record<'from' | 'dest' | 'date' | 'pax' | 'days' | 'name' | 'email' | 'phone' | 'consent', string>>
const digits = (s: string) => s.replace(/\D/g, '')
const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

function tripErrors(trip: Trip, lang: Lang, step: 0 | 2 | 'hero'): Errors {
  const e = REQ[lang].err
  const out: Errors = {}
  if (step === 0 || step === 'hero') {
    if (!trip.from.trim()) out.from = e.from
    if (!trip.stops.some((s) => s.trim())) out.dest = e.dest
    if (trip.tab === 'multi') { if (!trip.start || !trip.end) out.date = !trip.start ? e.date : e.dateRange }
    else if (!trip.start) out.date = e.date
    if (trip.tab === 'regular' && !trip.days.length && step === 0) out.days = e.days
    const n = Number(trip.pax)
    if (!trip.pax.trim() || !Number.isInteger(n) || n < 1 || n > 999) out.pax = e.pax
  }
  if (step === 2) {
    if (!trip.name.trim()) out.name = e.name
    if (!validEmail(trip.email)) out.email = e.email
    if (digits(trip.phone).length < 7) out.phone = e.phone
    if (!trip.consent) out.consent = e.consent
  }
  return out
}

function dateText(trip: Trip, lang: Lang) {
  if (!trip.start) return ''
  if (trip.tab === 'multi') return trip.end ? `${fmtShort(trip.start, lang)} – ${fmtShort(trip.end, lang)}` : `${fmtShort(trip.start, lang)} – …`
  return fmtLong(trip.start, lang)
}

export function summaryRows(trip: Trip, lang: Lang): [string, string][] {
  const t = REQ[lang]
  const rows: [string, string][] = []
  rows.push([lang === 'is' ? 'Tegund' : 'Type', t.tabs[trip.tab]])
  if (trip.from.trim()) rows.push([t.from, trip.from.trim()])
  const stops = trip.stops.map((s) => s.trim()).filter(Boolean)
  if (stops.length) rows.push([stops.length > 1 ? t.stops : t.dest, stops.join('  →  ')])
  if (trip.start) rows.push([t.date[trip.tab], dateText(trip, lang) + (trip.tab === 'multi' && trip.end ? ` (${t.cal.nights(daysBetween(trip.start, trip.end))})` : '')])
  if (trip.tab === 'regular' && trip.days.length) rows.push([t.weekdays, trip.days.slice().sort().map((d) => t.dowShort[d]).join(', ')])
  if (trip.time) rows.push([t.time, trip.time])
  if (trip.pax.trim()) rows.push([t.pax, trip.pax.trim()])
  const bus = FLEET.find((b) => b.id === trip.vehicle)
  if (bus) rows.push([t.vehicle, `${bus.name} · ${bus.seats}`])
  return rows
}
function needsRows(trip: Trip, lang: Lang): [string, string][] {
  const t = REQ[lang]
  const a = T[lang].amenity
  const rows: [string, string][] = [[t.needs.luggage, t.needs.luggageOpts[trip.luggage]]]
  if (trip.equipment.length) rows.push([t.needs.equipment, trip.equipment.map((k) => a[k]).join(', ')])
  if (trip.ramp) rows.push([t.needs.access, t.needs.accessOpt])
  if (trip.note.trim()) rows.push([t.needs.note, trip.note.trim()])
  return rows
}
function contactRows(trip: Trip, lang: Lang): [string, string][] {
  const c = REQ[lang].contact
  const rows: [string, string][] = []
  if (trip.name.trim()) rows.push([c.name, trip.name.trim()])
  if (trip.org.trim()) rows.push([c.org, trip.org.trim()])
  if (trip.email.trim()) rows.push([c.email, trip.email.trim()])
  if (trip.phone.trim()) rows.push([c.phone, trip.phone.trim()])
  return rows
}

/* ------------------------------------------------------------------ fields */
function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className={`tj-field${error ? ' has-error' : ''}`}>
      <label className="tj-field__label" htmlFor={id}>{label}</label>
      {children}
      {hint && !error ? <p className="tj-field__hint" id={`${id}-h`}>{hint}</p> : null}
      {error ? <p className="tj-field__error" id={`${id}-e`} role="alert">{error}</p> : null}
    </div>
  )
}

function DateField({ lang, trip, set, error, one }: { lang: Lang; trip: Trip; set: (p: Partial<Trip>) => void; error?: string; one?: boolean }) {
  const t = REQ[lang]
  const id = useId()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    /* on phones the calendar is a bottom sheet: lock the page behind it (fixed body, position restored on close), like the menu */
    const sheet = window.matchMedia('(max-width: 700px)').matches
    const y = window.scrollY
    const st = document.body.style
    const prev = { position: st.position, top: st.top, width: st.width }
    if (sheet) { st.position = 'fixed'; st.top = `-${y}px`; st.width = '100%' }
    return () => {
      document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey)
      if (sheet) { st.position = prev.position; st.top = prev.top; st.width = prev.width; window.scrollTo(0, y) }
    }
  }, [open])
  const text = dateText(trip, lang)
  return (
    <Field id={id} label={t.date[trip.tab]} error={error}>
      <div className="tj-datefield" ref={wrap}>
        <button ref={btn} id={id} type="button" className={`tj-input tj-input--btn${text ? '' : ' is-empty'}`} aria-haspopup="dialog" aria-expanded={open}
          aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} onClick={() => setOpen((o) => !o)}>
          <span>{text || t.datePh[trip.tab]}</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3.5 6.5h13v10h-13zM3.5 9.5h13M7 3.5v3M13 3.5v3" /></svg>
        </button>
        {open ? (
          <>
            <div className="tj-pop__scrim" onClick={() => setOpen(false)} aria-hidden="true" />
            <div className={`tj-pop${one ? ' tj-pop--one' : ''}`} role="dialog" aria-label={t.date[trip.tab]}>
              <Calendar lang={lang} tab={trip.tab} start={trip.start} end={trip.end} one={one}
                onPick={(s, e, done) => { set({ start: s, end: e }); if (done) { setOpen(false); btn.current?.focus() } }} />
              <div className="tj-pop__foot">
                <button type="button" className="tj-link" onClick={() => set({ start: null, end: null })}>{t.cal.clear}</button>
                <button type="button" className="tj-btn tj-btn--dark tj-btn--sm" onClick={() => setOpen(false)}>{t.cal.done}</button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Field>
  )
}

function TabRow({ lang, tab, onTab, small }: { lang: Lang; tab: Tab; onTab: (t: Tab) => void; small?: boolean }) {
  const t = REQ[lang]
  return (
    <div className={`tj-tabs${small ? ' tj-tabs--small' : ''}`} role="tablist" aria-label={t.title}>
      {(['day', 'multi', 'regular'] as Tab[]).map((k) => (
        <button key={k} type="button" role="tab" aria-selected={tab === k} className={`tj-tab${tab === k ? ' is-on' : ''}`} onClick={() => onTab(k)}>{t.tabs[k]}</button>
      ))}
    </div>
  )
}

function Pax({ lang, id, value, onChange, error }: { lang: Lang; id: string; value: string; onChange: (v: string) => void; error?: string }) {
  const t = REQ[lang]
  const n = Number(value) || 0
  return (
    <Field id={id} label={t.pax} error={error} hint={t.paxHint}>
      <div className="tj-stepper">
        <button type="button" className="tj-stepper__b" aria-label="−" disabled={n <= 1} onClick={() => onChange(String(Math.max(1, n - 1)))}>−</button>
        <input id={id} name="passengers" className="tj-input tj-input--num" inputMode="numeric" autoComplete="off" value={value} placeholder="0" aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-e` : `${id}-h`} onChange={(e) => onChange(digits(e.target.value).slice(0, 3))} />
        <button type="button" className="tj-stepper__b" aria-label="+" onClick={() => onChange(String(Math.min(999, n + 1)))}>+</button>
      </div>
    </Field>
  )
}

/* ------------------------------------------------------------------ hero card: the first step, on the photograph */
export function HeroCard({ lang, trip, setTrip }: { lang: Lang; trip: Trip; setTrip: Dispatch<SetStateAction<Trip>> }) {
  const t = REQ[lang]
  const nav = useNavigate()
  const [errors, setErrors] = useState<Errors>({})
  const uid = useId()
  const set = (p: Partial<Trip>) => { setTrip((x) => ({ ...x, ...p })); setErrors({}) }
  const route = ROUTES.find((r) => r.id === trip.routeId)
  function go() {
    const e = tripErrors(trip, lang, 'hero')
    setErrors(e)
    if (Object.keys(e).length) {
      /* move focus to the first invalid field (scroll-padding keeps it clear of the fixed bar) */
      window.setTimeout(() => document.querySelector<HTMLElement>('#tj-card [aria-invalid="true"]')?.focus(), 30)
      return
    }
    nav(PATHS[lang].request)
  }
  return (
    <form className="tj-card" id="tj-card" aria-labelledby={`${uid}-h`} noValidate onSubmit={(e) => { e.preventDefault(); go() }}>
      <h2 className="tj-card__h" id={`${uid}-h`}>{T[lang].cardHead}</h2>
      <TabRow lang={lang} tab={trip.tab} small onTab={(k) => set({ tab: k, end: k === 'multi' ? trip.end : null })} />
      {route ? (
        <p className="tj-chipline"><span>{t.presetOn(route.name[lang])}</span><button type="button" className="tj-link" onClick={() => set({ routeId: '', stops: [''] })}>{t.presetClear}</button></p>
      ) : null}
      <Field id={`${uid}-from`} label={t.from} error={errors.from}>
        <input id={`${uid}-from`} name="pickup" data-tj-first className="tj-input" autoComplete="off" value={trip.from} placeholder={t.fromPh} aria-invalid={errors.from ? true : undefined}
          aria-describedby={errors.from ? `${uid}-from-e` : undefined} onChange={(e) => set({ from: e.target.value })} />
      </Field>
      <Field id={`${uid}-dest`} label={trip.stops.filter(Boolean).length > 1 ? t.stops : t.dest} error={errors.dest}>
        <input id={`${uid}-dest`} name="destination" className="tj-input" autoComplete="off"
          value={trip.stops.length > 1 ? trip.stops.filter(Boolean).join(', ') : trip.stops[0]} placeholder={t.destPh} aria-invalid={errors.dest ? true : undefined}
          aria-describedby={errors.dest ? `${uid}-dest-e` : undefined}
          onChange={(e) => set({ stops: [e.target.value], routeId: '' })} />
      </Field>
      <div className="tj-card__row">
        <DateField lang={lang} trip={trip} set={set} error={errors.date} one />
        <Pax lang={lang} id={`${uid}-pax`} value={trip.pax} onChange={(v) => set({ pax: v })} error={errors.pax} />
      </div>
      <button className="tj-btn tj-btn--dark tj-btn--block" type="submit">{t.continue}</button>
      <p className="tj-card__fine">{t.disclaimer}</p>
      <p className="tj-card__call">{t.fallback} <a href={`tel:${URLS.phone}`}>{URLS.phoneShow}</a></p>
    </form>
  )
}

/* ------------------------------------------------------------------ the full journey */
export function RequestJourney({ lang, trip, setTrip, reset }: { lang: Lang; trip: Trip; setTrip: Dispatch<SetStateAction<Trip>>; reset: () => void }) {
  const t = REQ[lang]
  const c = t.contact
  const uid = useId()
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const head = useRef<HTMLElement | null>(null)
  const setHead = (el: HTMLElement | null) => { head.current = el }
  const set = (p: Partial<Trip>) => { setTrip((x) => ({ ...x, ...p })); setErrors({}) }
  const stepRef = useRef(step)
  useEffect(() => {
    if (stepRef.current !== step) head.current?.focus({ preventScroll: false })
    stepRef.current = step
  }, [step, sent])
  /* the acknowledgement replaces the form: send focus to its heading so keyboard and VoiceOver users land on it */
  useEffect(() => { if (sent) head.current?.focus() }, [sent])

  const all = useMemo(() => [...summaryRows(trip, lang), ...needsRows(trip, lang), ...contactRows(trip, lang)], [trip, lang])
  const route = ROUTES.find((r) => r.id === trip.routeId)

  function next() {
    const s = step === 0 ? 0 : step === 2 ? 2 : null
    if (s !== null) {
      const e = tripErrors(trip, lang, s)
      setErrors(e)
      if (Object.keys(e).length) {
        window.setTimeout(() => (document.querySelector('.tj-journey [aria-invalid="true"]') as HTMLElement | null)?.focus(), 30)
        return
      }
    }
    setStep((x) => Math.min(3, x + 1) as 0 | 1 | 2 | 3)
  }
  const back = () => setStep((x) => Math.max(0, x - 1) as 0 | 1 | 2 | 3)

  const setStop = (i: number, v: string) => set({ stops: trip.stops.map((s, j) => (j === i ? v : s)), routeId: '' })
  const addStop = () => trip.stops.length < 8 && set({ stops: [...trip.stops, ''] })
  const rmStop = (i: number) => set({ stops: trip.stops.length > 1 ? trip.stops.filter((_, j) => j !== i) : [''], routeId: '' })
  const toggle = <K,>(arr: K[], v: K) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  async function copy() {
    const text = all.map(([k, v]) => `${k}: ${v}`).join('\n')
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }

  if (sent) {
    return (
      <div className="tj-journey tj-journey--ack">
        <div className="tj-ack">
          <svg className="tj-ack__mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" /><path d="m14 25 7 7 13-15" /></svg>
          <h2 className="tj-ack__h" tabIndex={-1} ref={setHead}>{t.ack.h}</h2>
          <p>{t.ack.p}</p>
          <p className="tj-ack__urgent">{t.ack.urgent} <a href={`tel:${URLS.phone}`}>{URLS.phoneShow}</a></p>
          <dl className="tj-sum tj-sum--flat">{all.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="tj-ack__actions">
            <button type="button" className="tj-btn tj-btn--dark" onClick={copy}>{copied ? t.ack.copied : t.ack.copy}</button>
            <button type="button" className="tj-btn tj-btn--line" onClick={() => { reset(); setSent(false); setStep(0) }}>{t.ack.another}</button>
          </div>
          <p className="tj-fine">{t.sample}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tj-journey">
      <div className="tj-journey__main">
        <ol className="tj-stepper-list" aria-label={t.title}>
          {t.stepper.map((s, i) => (
            <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
              <button type="button" disabled={i > step} onClick={() => setStep(i as 0 | 1 | 2 | 3)}><span aria-hidden="true">0{i + 1}</span> {s}</button>
            </li>
          ))}
        </ol>

        <form noValidate onSubmit={(e) => { e.preventDefault(); if (step < 3) next(); else setSent(true) }}>
          {step === 0 && (
            <fieldset className="tj-step">
              <legend className="tj-step__h" tabIndex={-1} ref={setHead}>{t.stepper[0]}</legend>
              <TabRow lang={lang} tab={trip.tab} onTab={(k) => set({ tab: k, end: k === 'multi' ? trip.end : null })} />
              <p className="tj-fine tj-fine--tab">{t.tabHint[trip.tab]}</p>
              <div className="tj-presets" role="group" aria-label={t.pickRoute}>
                <span>{t.pickRoute}</span>
                {ROUTES.map((r) => (
                  <button key={r.id} type="button" className={`tj-chipbtn${trip.routeId === r.id ? ' is-on' : ''}`} aria-pressed={trip.routeId === r.id}
                    onClick={() => set(trip.routeId === r.id ? { routeId: '', stops: [''] } : { routeId: r.id, tab: r.tab, stops: r.stops[lang].slice(), end: r.tab === 'multi' ? trip.end : null })}>{r.name[lang]}</button>
                ))}
              </div>
              {route ? <p className="tj-chipline"><span>{t.presetOn(route.name[lang])}</span></p> : null}
              <Field id={`${uid}-from`} label={t.from} error={errors.from}>
                <input id={`${uid}-from`} name="pickup" className="tj-input" autoComplete="off" value={trip.from} placeholder={t.fromPh} aria-invalid={errors.from ? true : undefined}
                  aria-describedby={errors.from ? `${uid}-from-e` : undefined} onChange={(e) => set({ from: e.target.value })} />
              </Field>
              <div className="tj-stops">
                <p className="tj-field__label" id={`${uid}-stops`}>{trip.stops.length > 1 ? t.stops : t.dest}</p>
                {trip.stops.map((s, i) => (
                  <div className="tj-stop" key={i}>
                    <span className="tj-stop__n" aria-hidden="true">{i + 1}</span>
                    <input name="stop" className="tj-input" autoComplete="off" aria-labelledby={`${uid}-stops`} value={s} placeholder={i === 0 ? t.destPh : t.stopPh(i + 1)}
                      aria-invalid={i === 0 && errors.dest ? true : undefined} aria-describedby={i === 0 && errors.dest ? `${uid}-dest-e` : undefined}
                      onChange={(e) => setStop(i, e.target.value)} />
                    {trip.stops.length > 1 ? <button type="button" className="tj-stop__x" aria-label={`${t.removeStop} ${i + 1}`} onClick={() => rmStop(i)}>×</button> : null}
                  </div>
                ))}
                {errors.dest ? <p className="tj-field__error" id={`${uid}-dest-e`} role="alert">{errors.dest}</p> : null}
                {trip.stops.length < 8 ? <button type="button" className="tj-link tj-stops__add" onClick={addStop}>+ {t.addStop}</button> : null}
              </div>
              <div className="tj-grid2">
                <DateField lang={lang} trip={trip} set={set} error={errors.date} />
                <Field id={`${uid}-time`} label={t.time}>
                  <input id={`${uid}-time`} name="time" className="tj-input" inputMode="numeric" autoComplete="off" maxLength={5} placeholder="08:30" value={trip.time}
                    onChange={(e) => { const d = digits(e.target.value).slice(0, 4); set({ time: d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d }) }} />
                </Field>
              </div>
              {trip.tab === 'regular' ? (
                <div className={`tj-field${errors.days ? ' has-error' : ''}`}>
                  <p className="tj-field__label" id={`${uid}-dow`}>{t.weekdays}</p>
                  <div className="tj-dow" role="group" aria-labelledby={`${uid}-dow`}>
                    {t.dowShort.map((d, i) => (
                      <button key={d} type="button" className={`tj-dow__d${trip.days.includes(i) ? ' is-on' : ''}`} aria-pressed={trip.days.includes(i)} aria-label={t.dowLong[i]}
                        onClick={() => set({ days: toggle(trip.days, i) })}>{d}</button>
                    ))}
                  </div>
                  {errors.days ? <p className="tj-field__error" role="alert">{errors.days}</p> : null}
                </div>
              ) : null}
              <Pax lang={lang} id={`${uid}-pax`} value={trip.pax} onChange={(v) => set({ pax: v })} error={errors.pax} />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="tj-step">
              <legend className="tj-step__h" tabIndex={-1} ref={setHead}>{t.stepper[1]}</legend>
              <Field id={`${uid}-veh`} label={t.vehicle}>
                <select id={`${uid}-veh`} name="vehicle" className="tj-input tj-input--select" value={trip.vehicle} onChange={(e) => set({ vehicle: e.target.value })}>
                  <option value="">{t.vehicleAny}</option>
                  {FLEET.map((b) => <option key={b.id} value={b.id}>{b.name} · {b.seats}</option>)}
                </select>
              </Field>
              <div className="tj-field">
                <p className="tj-field__label" id={`${uid}-lug`}>{t.needs.luggage}</p>
                <div className="tj-radios" role="radiogroup" aria-labelledby={`${uid}-lug`}>
                  {t.needs.luggageOpts.map((o, i) => (
                    <label key={o} className={`tj-check${trip.luggage === i ? ' is-on' : ''}`}>
                      <input type="radio" name={`${uid}-lug`} checked={trip.luggage === i} onChange={() => set({ luggage: i })} /><span>{o}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="tj-field">
                <p className="tj-field__label" id={`${uid}-eq`}>{t.needs.equipment}</p>
                <div className="tj-radios" role="group" aria-labelledby={`${uid}-eq`}>
                  {(['wc', 'wifi', 'tv'] as Amenity[]).map((k) => (
                    <label key={k} className={`tj-check${trip.equipment.includes(k) ? ' is-on' : ''}`}>
                      <input type="checkbox" checked={trip.equipment.includes(k)} onChange={() => set({ equipment: toggle(trip.equipment, k) })} /><span>{T[lang].amenity[k]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="tj-field">
                <p className="tj-field__label" id={`${uid}-acc`}>{t.needs.access}</p>
                <label className={`tj-check${trip.ramp ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={trip.ramp} onChange={(e) => set({ ramp: e.target.checked })} aria-labelledby={`${uid}-acc`} /><span>{t.needs.accessOpt}</span>
                </label>
              </div>
              <Field id={`${uid}-note`} label={t.needs.note} hint={t.needs.warn}>
                <textarea id={`${uid}-note`} name="note" className="tj-input tj-input--area" rows={4} value={trip.note} placeholder={t.needs.notePh} aria-describedby={`${uid}-note-h`}
                  onChange={(e) => set({ note: e.target.value })} />
              </Field>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="tj-step">
              <legend className="tj-step__h" tabIndex={-1} ref={setHead}>{t.stepper[2]}</legend>
              <div className="tj-grid2">
                <Field id={`${uid}-name`} label={c.name} error={errors.name}>
                  <input id={`${uid}-name`} className="tj-input" name="name" autoComplete="name" value={trip.name} aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? `${uid}-name-e` : undefined} onChange={(e) => set({ name: e.target.value })} />
                </Field>
                <Field id={`${uid}-org`} label={c.org} hint={c.orgHint}>
                  <input id={`${uid}-org`} className="tj-input" name="organization" autoComplete="organization" value={trip.org} aria-describedby={`${uid}-org-h`} onChange={(e) => set({ org: e.target.value })} />
                </Field>
                <Field id={`${uid}-email`} label={c.email} error={errors.email}>
                  <input id={`${uid}-email`} type="email" name="email" spellCheck={false} className="tj-input" autoComplete="email" value={trip.email} aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? `${uid}-email-e` : undefined} onChange={(e) => set({ email: e.target.value })} />
                </Field>
                <Field id={`${uid}-phone`} label={c.phone} error={errors.phone}>
                  <input id={`${uid}-phone`} type="tel" name="phone" className="tj-input" autoComplete="tel" value={trip.phone} aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? `${uid}-phone-e` : undefined} onChange={(e) => set({ phone: e.target.value })} />
                </Field>
              </div>
              <label className={`tj-check tj-check--block${trip.consent ? ' is-on' : ''}${errors.consent ? ' has-error' : ''}`}>
                <input type="checkbox" checked={trip.consent} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${uid}-consent-e` : undefined}
                  onChange={(e) => set({ consent: e.target.checked })} /><span>{c.consent}</span>
              </label>
              {errors.consent ? <p className="tj-field__error" id={`${uid}-consent-e`} role="alert">{errors.consent}</p> : null}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="tj-step">
              <legend className="tj-step__h" tabIndex={-1} ref={setHead}>{t.summary}</legend>
              <p className="tj-lead">{t.summaryLead}</p>
              <SummaryBlock title={t.stepper[0]} rows={summaryRows(trip, lang)} edit={t.edit} onEdit={() => setStep(0)} />
              <SummaryBlock title={t.stepper[1]} rows={needsRows(trip, lang)} edit={t.edit} onEdit={() => setStep(1)} />
              <SummaryBlock title={t.stepper[2]} rows={contactRows(trip, lang)} edit={t.edit} onEdit={() => setStep(2)} />
              <p className="tj-disclaimer">{t.disclaimer}</p>
            </fieldset>
          )}

          <div className="tj-journey__foot">
            {step > 0 ? <button type="button" className="tj-btn tj-btn--line" onClick={back}>{t.back}</button> : <span />}
            <button type="submit" className="tj-btn tj-btn--dark">{step === 3 ? t.send : t.next}</button>
          </div>
          <p className="tj-fine">{t.sample}</p>
        </form>
      </div>

      <aside className="tj-journey__side" aria-label={t.sideHead}>
        <h2 className="tj-side__h">{t.sideHead}</h2>
        {all.length > 1 ? (
          <dl className="tj-sum">{all.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        ) : <p className="tj-fine">{t.sideEmpty}</p>}
        <div className="tj-side__call">
          <p className="tj-side__q">{t.fallback}</p>
          <a className="tj-side__tel" href={`tel:${URLS.phone}`}>{URLS.phoneIntl}</a>
          <p className="tj-fine">{t.fallbackNote}</p>
        </div>
        <Link className="tj-link" to={PATHS[lang].agents}>{AGENTS[lang].h1}</Link>
      </aside>
    </div>
  )
}

function SummaryBlock({ title, rows, edit, onEdit }: { title: string; rows: [string, string][]; edit: string; onEdit: () => void }) {
  return (
    <div className="tj-sumblock">
      <div className="tj-sumblock__head"><h3>{title}</h3><button type="button" className="tj-link" onClick={onEdit}>{edit}</button></div>
      <dl className="tj-sum">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
  )
}
