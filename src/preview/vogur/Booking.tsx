/* SNDR Bókun booking sheet, Vogur edition.
   A React port of the family sheet shared by Mountain Villa and Himri
   (03-prototypes/mountain-villa-twin/assets/vendor/sndr-booking.js): room type,
   the range calendar (two months from 768px, one on a phone, hover preview,
   arrow/page keys), a guests stepper, then the guest's details, then a request
   the host confirms and answers with a secure pay link. The one action sits in
   a bar that never scrolls away. Desktop: a drawer from the right. Phone: a
   sheet from the bottom.
   Nothing here invents availability or a total: every future night is open,
   the price line is Godo's standard rate read on 24 Oct 2026, and the final
   state says plainly that this is the design preview. Production swaps
   `submitRequest` for the SNDR Bókun request call and `taken` for the synced
   calendar. */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'
import { ROOMS } from './data'

const MIN_NIGHTS = 1
const MAX_GUESTS = 2 // Godo's rates above are for two; families ask in the message
const MONTHS_AHEAD = 18

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const at = (k: string) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monthOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const fShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const fLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`
const submitRequest = () => new Promise((r) => setTimeout(r, 650))

export const BOOKING_CSS = `
dialog.bk{position:fixed;inset:0;width:100%;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;overflow:hidden;color:var(--forest)}
dialog.bk::backdrop{background:transparent}
.bk[open]{display:block}
.bk-bg{position:absolute;inset:0;background:rgba(18,28,36,.46);animation:bkFade .3s var(--ease) both}
.bk-bar{position:relative;z-index:1;margin-left:auto;width:100%;max-width:720px;height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--paper);outline:none;animation:bkIn .45s var(--ease) both}
@keyframes bkFade{from{opacity:0}}
@keyframes bkIn{from{transform:translateX(100%)}}
.bk-top{flex:none;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:26px 32px 10px}
.bk-h{font:200 34px/1.1 var(--display);letter-spacing:-.01em}
.bk-sub{margin-top:6px;font-size:13px;color:var(--secondary)}
.bk-x{width:44px;height:44px;margin:-6px -10px 0 0;display:grid;place-items:center;color:inherit;transition:transform .16s var(--ease)}
.bk-x svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1}
.bk-x:active{transform:scale(.94)}
.bk-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px 32px 20px;display:grid;gap:26px;align-content:start}
.bk-l{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.16em;color:var(--secondary)}
.bk-rooms{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.bk-room{display:grid;gap:3px;text-align:left;padding:12px 14px;border:1px solid var(--line);color:inherit;transition:border-color .16s var(--ease),background-color .16s var(--ease),transform .16s var(--ease)}
.bk-room b{font:200 19px/1.15 var(--display)}
.bk-room span{font-size:12.5px;color:var(--secondary)}
.bk-room[aria-pressed="true"]{border-color:var(--forest);box-shadow:inset 0 0 0 1px var(--forest)}
.bk-room:active{transform:scale(.98)}
.bk-room:focus-visible{outline:1px solid var(--forest);outline-offset:2px}
.bk-dates{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:6px 24px}
.bk-gst{display:flex;align-items:center;gap:16px}
.bk-months{grid-column:1/-1;margin-top:10px;display:grid;gap:24px 40px}
.bk-range{margin-top:6px;font:200 24px/1.2 var(--display);white-space:nowrap}
.bk-range .bk-to{font:400 13px/1 var(--body);color:var(--secondary);margin:0 6px}
.bk-range .unset{color:var(--secondary)}
.bk-gnote{grid-column:1/-1;font-size:13px;color:var(--secondary)}
.bk-step{flex:none;display:inline-flex;align-items:center}
.bk-step button{width:44px;height:44px;display:grid;place-items:center;color:inherit;border:1px solid var(--forest);border-radius:50%;transition:opacity .16s var(--ease),transform .16s var(--ease),background-color .16s var(--ease),color .16s var(--ease)}
.bk-step button:active:not(:disabled){transform:scale(.94)}
.bk-step button:disabled{opacity:.28;cursor:default}
.bk-n{min-width:96px;text-align:center;font-size:16px;font-variant-numeric:tabular-nums}
.bk-ic{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1}
.bk-m-h{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px}
.bk-m-t{font:200 22px/1.2 var(--display)}
.bk-nav{display:flex;gap:8px}
.bk-nav button{width:44px;height:44px;display:grid;place-items:center;color:inherit;border:1px solid var(--line);border-radius:50%;transition:border-color .16s var(--ease),opacity .16s var(--ease),transform .16s var(--ease)}
.bk-nav button:active:not(:disabled){transform:scale(.94)}
.bk-nav button:disabled{opacity:.28;cursor:default}
.bk-dow,.bk-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
.bk-dow span{padding-bottom:6px;text-align:center;font-size:11px;letter-spacing:.06em;color:var(--secondary)}
.bk-d{height:42px;display:grid;place-items:center;color:inherit;font-size:16px;line-height:1;font-variant-numeric:tabular-nums;transition:background-color .12s var(--ease),color .12s var(--ease),transform .12s var(--ease)}
.bk-d:disabled{color:rgba(35,53,66,.3);cursor:default}
.bk-d.short{color:rgba(35,53,66,.3);cursor:not-allowed}
.bk-d.today{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
.bk-d.in{background:rgba(35,53,66,.08)}
.bk-d.pv{background:rgba(35,53,66,.05)}
.bk-d.pv-end{box-shadow:inset 0 0 0 1px var(--forest)}
.bk-d.start,.bk-d.end{background:var(--forest);color:var(--paper)}
.bk-d:active:not(:disabled){transform:scale(.94)}
.bk-d:focus-visible{outline:1px solid var(--forest);outline-offset:-4px}
.bk-d.start:focus-visible,.bk-d.end:focus-visible{outline-color:var(--paper)}
.bk-who{display:grid;gap:18px}
.bk-fields{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px}
.bk-fields label{display:grid;gap:8px;font-size:13px}
.bk-fields .bk-wide{grid-column:1/-1}
.bk-fields input,.bk-fields textarea{font:inherit;font-size:16px;color:var(--forest);background:#fff;border:1px solid var(--line);padding:12px 14px;min-height:48px;border-radius:0;width:100%}
.bk-fields textarea{resize:vertical;min-height:88px}
.bk-fields input:focus-visible,.bk-fields textarea:focus-visible{outline:1px solid var(--forest);outline-offset:0;border-color:var(--forest)}
.bk-back{justify-self:start;font-size:13px;color:inherit;text-decoration:underline;text-underline-offset:4px}
.bk-done{display:grid;gap:14px;padding-top:8px}
.bk-done h3{font:200 clamp(34px,4vw,48px)/1.05 var(--display);outline:none}
.bk-done p{font-size:16px;line-height:1.5}
.bk-fine{font-size:13px;color:var(--secondary)}
.bk-end{flex:none;display:grid;gap:10px;padding:14px 32px max(18px,env(safe-area-inset-bottom));border-top:1px solid var(--line);background:var(--paper)}
.bk-sum{font-size:16px;line-height:1.45;text-wrap:balance}
.bk-sum .is-muted{color:var(--secondary)}
.bk-sum .d{display:block}
.bk-sum .a{display:block;font-size:14px;color:var(--secondary)}
.bk-action{width:100%;min-height:52px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--forest);color:var(--paper);font-size:12px;letter-spacing:.18em;text-transform:uppercase;transition:transform .16s var(--ease),opacity .16s var(--ease)}
.bk-action:active{transform:scale(.98)}
.bk-action:disabled{opacity:.7}
.bk-action:focus-visible{outline:2px solid var(--forest);outline-offset:3px}
.bk-note{font-size:14px;color:#88303C}
.bk-note:empty{display:none}
.bk-foot{font-size:12px;line-height:1.5;color:var(--secondary)}
@media(hover:hover){
  .bk-step button:hover:not(:disabled){background:var(--forest);color:var(--paper)}
  .bk-nav button:hover:not(:disabled),.bk-room:hover{border-color:var(--forest)}
  .bk-d:hover:not(:disabled):not(.start):not(.end):not(.short){background:var(--mist)}
}
@media(min-width:768px){
  .bk-rooms{grid-template-columns:repeat(4,minmax(0,1fr))}
  .bk-months{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bk-end{grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:24px}
  .bk-action{width:auto;min-width:248px}
  .bk-note,.bk-foot{grid-column:1/-1}
}
@media(max-width:767px){
  .bk[open]{display:flex;align-items:flex-end}
  .bk-bar{margin:0 auto;max-width:600px;height:auto;max-height:calc(100dvh - env(safe-area-inset-top) - 12px);animation-name:bkUp}
  @keyframes bkUp{from{transform:translateY(100%)}}
  .bk-top{padding:20px 22px 8px}
  .bk-h{font-size:30px}
  .bk-body{gap:20px;padding-left:22px;padding-right:22px}
  .bk-dates{grid-template-columns:minmax(0,1fr);gap:18px;align-items:start}
  .bk-gst{justify-content:space-between}
  .bk-when{display:none}
  .bk-fields{grid-template-columns:1fr}
  .bk-end{gap:8px;padding:12px 22px max(16px,env(safe-area-inset-bottom))}
}
@media(prefers-reduced-motion:reduce){.bk-bg,.bk-bar{animation:none}}
`

type Step = 'dates' | 'who' | 'done'

export function Booking({ open, room, viaKeyboard, onRoom, onClose }: {
  open: boolean
  room: string
  viaKeyboard: boolean
  onRoom: (id: string) => void
  onClose: () => void
}) {
  const dlg = useRef<HTMLDialogElement>(null)
  const bar = useRef<HTMLFormElement>(null)
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t }, [])
  const firstDay = iso(addDays(today, 1))
  const lastDay = iso(new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD, today.getDate()))
  const firstMonth = monthOf(today), lastMonth = monthOf(at(lastDay))
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  const [view, setView] = useState(firstMonth)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [hover, setHover] = useState('')
  const [focus, setFocus] = useState('')
  const [guests, setGuests] = useState(2)
  const [step, setStep] = useState<Step>('dates')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [who, setWho] = useState({ name: '', email: '', phone: '', message: '' })
  const r = ROOMS.find((x) => x.id === room) ?? ROOMS[0]
  const nights = start && end ? Math.round((at(end).getTime() - at(start).getTime()) / 864e5) : 0

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  /* open/close the native dialog. Focus: the panel on a pointer open (Safari
     paints a ring on a scripted focus of the first control), the first open
     day on a keyboard open. */
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      if (viaKeyboard) requestAnimationFrame(() => d.querySelector<HTMLElement>('.bk-d[tabindex="0"]')?.focus())
      else bar.current?.focus({ preventScroll: true })
    } else if (!open && d.open) d.close()
  }, [open, viaKeyboard])

  const reset = () => { setStart(''); setEnd(''); setHover(''); setFocus(''); setStep('dates'); setNote(''); setWho({ name: '', email: '', phone: '', message: '' }) }
  const close = () => { onClose(); if (step === 'done') reset() }

  const pick = (k: string) => {
    if (!start || end || k <= start) { setStart(k); setEnd('') }
    else if (k < iso(addDays(at(start), MIN_NIGHTS))) { setNote(`Minimum stay is ${plural(MIN_NIGHTS, 'night')}.`); return }
    else setEnd(k)
    setHover(''); setFocus(k); setNote('')
  }
  const page = (dir: number) => {
    const v = new Date(view.getFullYear(), view.getMonth() + dir, 1)
    if (v < firstMonth || v > lastMonth) return
    setView(v)
  }
  const goto = (k: string) => {
    if (k < firstDay) k = firstDay
    if (k > lastDay) k = lastDay
    const d = at(k), shown = wide ? 2 : 1, last = new Date(view.getFullYear(), view.getMonth() + shown, 0)
    if (d < view || d > last) setView(d > last ? new Date(d.getFullYear(), d.getMonth() - (shown - 1), 1) : monthOf(d))
    setFocus(k)
    requestAnimationFrame(() => dlg.current?.querySelector<HTMLElement>(`.bk-d[data-d="${k}"]`)?.focus())
  }
  const onDayKey = (e: ReactKeyboardEvent<HTMLButtonElement>, k: string) => {
    const d = at(k), col = (d.getDay() + 6) % 7
    const nd = ({ ArrowLeft: addDays(d, -1), ArrowRight: addDays(d, 1), ArrowUp: addDays(d, -7), ArrowDown: addDays(d, 7), Home: addDays(d, -col), End: addDays(d, 6 - col), PageUp: new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()), PageDown: new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()) } as Record<string, Date>)[e.key]
    if (!nd) return
    e.preventDefault(); goto(iso(nd))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (step === 'dates') {
      if (!start || !end) { setNote(start ? 'Now choose your departure date.' : 'Choose your arrival and departure dates.'); return }
      setNote(''); setStep('who')
      requestAnimationFrame(() => dlg.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }))
      return
    }
    if (step === 'who') {
      if (!who.name.trim()) { setNote('Add your name so Vogur knows who is asking.'); return }
      if (!/^\S+@\S+\.\S+$/.test(who.email.trim())) { setNote('Add an email address Vogur can reply to.'); return }
      setNote(''); setBusy(true)
      await submitRequest()
      setBusy(false); setStep('done')
      requestAnimationFrame(() => dlg.current?.querySelector<HTMLElement>('.bk-done h3')?.focus({ preventScroll: true }))
    }
  }

  /* the visible days: tab stop on the focused day, else the arrival, else the first open day */
  const shownMonths = Array.from({ length: wide ? 2 : 1 }, (_, i) => new Date(view.getFullYear(), view.getMonth() + i, 1))
  const tabKey = focus || start || firstDay
  const b = end || (hover > start ? hover : '')
  const dayClass = (k: string) => [
    'bk-d',
    k === start ? 'start' : '',
    end && k === end ? 'end' : '',
    start && end && k > start && k < end ? 'in' : '',
    !end && b && k > start && k < b ? 'pv' : '',
    !end && b && k === b ? 'pv-end' : '',
    k === iso(today) ? 'today' : '',
  ].filter(Boolean).join(' ')

  const summary = step === 'dates'
    ? (start && end
      ? <><span className="d">{fShort.format(at(start))} to {fShort.format(at(end))}</span><span className="a">{plural(nights, 'night')}, {plural(guests, 'guest')}, {r.name.toLowerCase()} from {r.price} a night. Vogur confirms and sends a secure pay link.</span></>
      : <span className="is-muted">{start ? 'Now choose your departure date' : 'Choose your arrival and departure dates'}</span>)
    : <><span className="d">{fShort.format(at(start))} to {fShort.format(at(end))}</span><span className="a">{plural(nights, 'night')}, {plural(guests, 'guest')}, {r.name.toLowerCase()}. Add your details and send the request.</span></>

  return (
    <dialog ref={dlg} className="bk" aria-labelledby="bk-h" data-lenis-prevent onCancel={(e) => { e.preventDefault(); close() }}>
      <div className="bk-bg" onClick={close} />
      <form ref={bar} className="bk-bar" noValidate tabIndex={-1} onSubmit={submit}>
        <div className="bk-top">
          <div>
            <p className="bk-h" id="bk-h">{step === 'done' ? 'Request sent' : 'Book a room'}</p>
            <p className="bk-sub">Vogur Country Lodge · Fellsströnd · direct with the house</p>
          </div>
          <button className="bk-x" type="button" aria-label="Close booking" onClick={close}>
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 8l16 16M24 8 8 24" /></svg>
          </button>
        </div>

        <div className="bk-body" data-lenis-prevent>
          {step === 'dates' && <>
            <div role="group" aria-labelledby="bk-room-l">
              <p className="bk-l" id="bk-room-l" style={{ marginBottom: 10 }}>Room</p>
              <div className="bk-rooms">
                {ROOMS.map((x) => (
                  <button key={x.id} type="button" className="bk-room" aria-pressed={x.id === r.id} onClick={() => onRoom(x.id)}>
                    <b>{x.name}</b><span>from {x.price}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bk-dates">
              <div className="bk-when">
                <p className="bk-l">Dates</p>
                <p className="bk-range">
                  <span className={start ? '' : 'unset'}>{start ? fShort.format(at(start)) : 'Arrival'}</span>
                  <span className="bk-to">to</span>
                  <span className={end ? '' : 'unset'}>{end ? fShort.format(at(end)) : 'Departure'}</span>
                </p>
              </div>
              <div className="bk-gst">
                <p className="bk-l" id="bk-g-l">Guests</p>
                <div className="bk-step" role="group" aria-labelledby="bk-g-l">
                  <button type="button" aria-label="One guest fewer" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)}>
                    <svg className="bk-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" /></svg>
                  </button>
                  <output className="bk-n">{plural(guests, 'guest')}</output>
                  <button type="button" aria-label="One guest more" disabled={guests >= MAX_GUESTS} onClick={() => setGuests((g) => g + 1)}>
                    <svg className="bk-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" /></svg>
                  </button>
                </div>
              </div>
              <p className="bk-gnote">Two guests per room. Three or more? Ask about a family room in your message.</p>
              <div className="bk-months" role="group" aria-label="Dates" onPointerLeave={() => setHover('')}>
                {shownMonths.map((m, i) => {
                  const lead = (m.getDay() + 6) % 7, count = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate()
                  const prevOk = view > firstMonth, nextOk = new Date(view.getFullYear(), view.getMonth() + shownMonths.length - 1, 1) < lastMonth
                  return (
                    <div className="bk-m" role="group" aria-label={fMonth.format(m)} key={iso(m)}>
                      <div className="bk-m-h">
                        <p className="bk-m-t">{fMonth.format(m)}</p>
                        {i === shownMonths.length - 1 && (
                          <span className="bk-nav">
                            <button type="button" aria-label="Previous month" disabled={!prevOk} onClick={() => page(-1)}><svg className="bk-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
                            <button type="button" aria-label="Next month" disabled={!nextOk} onClick={() => page(1)}><svg className="bk-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
                          </span>
                        )}
                      </div>
                      <div className="bk-dow" aria-hidden="true">{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d}>{d}</span>)}</div>
                      <div className="bk-days">
                        {Array.from({ length: lead }, (_, j) => <span key={`l${j}`} />)}
                        {Array.from({ length: count }, (_, j) => {
                          const dt = new Date(m.getFullYear(), m.getMonth(), j + 1), k = iso(dt)
                          const ok = k >= firstDay && k <= lastDay
                          return (
                            <button key={k} type="button" className={dayClass(k)} data-d={k} disabled={!ok}
                              aria-label={fLong.format(dt)} aria-pressed={k === start || k === end}
                              tabIndex={k === tabKey ? 0 : -1}
                              onClick={() => pick(k)} onKeyDown={(e) => onDayKey(e, k)}
                              onPointerOver={(e: ReactMouseEvent) => { if ((e.nativeEvent as PointerEvent).pointerType === 'mouse' && start && !end && ok && k !== hover) setHover(k) }}>
                              {j + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>}

          {step === 'who' && (
            <div className="bk-who">
              <p className="bk-l">Your details</p>
              <div className="bk-fields">
                <label><span>Name</span><input name="name" autoComplete="name" value={who.name} onChange={(e) => setWho({ ...who, name: e.target.value })} /></label>
                <label><span>Email</span><input type="email" name="email" autoComplete="email" inputMode="email" spellCheck={false} value={who.email} onChange={(e) => setWho({ ...who, email: e.target.value })} /></label>
                <label><span>Phone (optional)</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={who.phone} onChange={(e) => setWho({ ...who, phone: e.target.value })} /></label>
                <label className="bk-wide"><span>Anything Vogur should know? Family room, dinner, late arrival</span><textarea name="message" rows={3} value={who.message} onChange={(e) => setWho({ ...who, message: e.target.value })} /></label>
              </div>
              <button className="bk-back" type="button" onClick={() => setStep('dates')}>Change dates</button>
            </div>
          )}

          {step === 'done' && (
            <div className="bk-done">
              <h3 tabIndex={-1}>Thank you, {who.name.trim()}.</h3>
              <p>{fLong.format(at(start))} to {fLong.format(at(end))}, {plural(nights, 'night')}, {plural(guests, 'guest')}, {r.name.toLowerCase()}.</p>
              <p>Vogur checks the dates and replies with a secure link to pay. Nothing is charged until you pay.</p>
              <p className="bk-fine">Design preview: this request was not delivered. On the live site it reaches Vogur straight away.</p>
            </div>
          )}
        </div>

        <div className="bk-end">
          {step !== 'done' && <p className="bk-sum" aria-live="polite">{summary}</p>}
          {step !== 'done'
            ? <button className="bk-action" type="submit" disabled={busy}>{busy ? 'Sending…' : step === 'dates' ? 'Request these dates' : 'Send request'}</button>
            : <button className="bk-action" type="button" onClick={close}>Close</button>}
          <p className="bk-note" aria-live="polite">{note}</p>
          <p className="bk-foot">The request is free. Payment happens later through a secure link from Vogur, never on this page.</p>
        </div>
      </form>
    </dialog>
  )
}
