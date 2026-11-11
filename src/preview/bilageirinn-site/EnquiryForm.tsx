/* Bílageirinn request form on the True Line design. Posts to the studio relay (sndr-contact, tenant
   `bilageirinn`), which answers ok only once the mail has gone out. Fields, labels and rules come from the
   fact-checked form spec (`_docs/bilageirinn-2026-11-11/research/FORM-SPEC.md`, form.mjs, content.mjs);
   the server only insists on erindi, name and phone, the page enforces the rest per erindi. */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Phone, Send } from 'lucide-react'
import { copy } from './content.mjs'
import { fields } from './form.mjs'

const RELAY = 'https://sndr-contact.sindri-381.workers.dev/'
const INK = '#F3F0EA', MUT = '#A9A399', AMBER = '#E8A23D', DARKINK = '#131313', HAIR = 'rgba(243,240,234,0.14)', ERR = '#F2A07B'
const BODY = "'Archia', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
const EASE = [0.23, 1, 0.32, 1] as const

const F = Object.fromEntries(fields.map(f => [f.key, f]))
const ERINDI = F.erindi.options as string[] // Tjón, Viðgerð, Smurning, Hjólastilling, Annað
const [TJON, VIDGERD, SMURNING, HJOL, ANNAD] = ERINDI
const EMAIL_REPLY = (F.reply.options as string[])[1]
const OTHER_INSURER = copy.formRuntime_state_003 // "Annað félag"

type Vals = Record<string, string>
const groupsFor = (e: string) => ({
  vehicle: !!e && e !== ANNAD,
  claim: e === TJON,
  repair: e === VIDGERD,
  oil: e === SMURNING,
  wheel: e === HJOL,
  date: !!e && e !== TJON && e !== ANNAD,
  messageRequired: e === TJON || e === VIDGERD || e === ANNAD,
})

function validate(v: Vals): Record<string, string> {
  const g = groupsFor(v.erindi)
  const err: Record<string, string> = {}
  if (!v.erindi) err.erindi = copy.formRuntime_message_008
  if (!v.name?.trim()) err.name = copy.formRuntime_message_001
  const digits = (v.phone || '').replace(/\D/g, '')
  if (!v.phone?.trim()) err.phone = copy.formRuntime_message_002
  else if (digits.length < 7 || digits.length > 15) err.phone = copy.formRuntime_message_009
  if (v.reply === EMAIL_REPLY && !v.email?.trim()) err.email = copy.formRuntime_message_003
  else if (v.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) err.email = copy.formRuntime_message_010
  if (g.vehicle) {
    if (v.no_plate) {
      if (!v.make?.trim()) err.make = copy.formRuntime_message_005
      if (!v.model?.trim()) err.model = copy.formRuntime_message_006
    } else if (!v.plate?.trim()) err.plate = copy.formRuntime_message_004
    else if (!v.foreign_plate && !/^[A-ZÁÐÉÍÓÚÝÞÆÖ0-9]{2,12}$/i.test(v.plate.replace(/[\s-]/g, ''))) err.plate = copy.formRuntime_message_011
    if (v.year && !/^\d{4}$/.test(v.year)) err.year = copy.formRuntime_message_012
    if (v.mileage && !/^[\d .]+$/.test(v.mileage)) err.mileage = copy.formRuntime_message_013
  }
  if (g.messageRequired && !v.message?.trim()) err.message = copy.formRuntime_message_007
  return err
}

const ORDER = ['erindi', 'name', 'phone', 'email', 'plate', 'make', 'model', 'year', 'mileage', 'message']

export default function EnquiryForm({ preset = '', service = '' }: { preset?: string; service?: string }) {
  const reduced = useReducedMotion()
  const initial = useMemo(() => {
    let e = preset
    try { const q = new URLSearchParams(location.search).get('erindi'); if (q && ERINDI.includes(q)) e = q } catch { /* no URL */ }
    return e
  }, [preset])
  const [v, setV] = useState<Vals>({ erindi: initial, reply: (F.reply.options as string[])[0] })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const statusRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const g = groupsFor(v.erindi)
  const set = (k: string, val: string) => setV(o => ({ ...o, [k]: val }))
  useEffect(() => { if (Object.keys(touched).length) setErrors(validate(v)) }, [v, touched])
  useEffect(() => {
    if (state === 'sent' || state === 'failed') {
      statusRef.current?.focus({ preventScroll: true })
      statusRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    }
  }, [state, reduced])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    const err = validate(v)
    setErrors(err)
    setTouched(Object.fromEntries(ORDER.map(k => [k, true])))
    const first = ORDER.find(k => err[k])
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      return
    }
    const keep = new Set(['erindi', 'name', 'phone', 'email', 'reply', 'message'])
    if (g.vehicle) ['plate', 'foreign_plate', 'no_plate', 'make', 'model', 'year', 'mileage'].forEach(k => keep.add(k))
    if (g.claim) ['damage_date', 'insurer', 'other_insurer', 'reported', 'claim_number', 'driveable', 'rental'].forEach(k => keep.add(k))
    if (g.repair) ['subtopic', 'inspection', 'warning'].forEach(k => keep.add(k))
    if (g.oil) keep.add('last_oil')
    if (g.wheel) ['alignment_reason', 'wheel_changes', 'inspection'].forEach(k => keep.add(k))
    if (g.date) keep.add('preferred_date')
    const payload: Record<string, string> = { site: 'bilageirinn', page: location.pathname, language: 'is', service, subject: `Bílageirinn: ${v.erindi}`, _honey: v._honey || '' }
    keep.forEach(k => { if (v[k]) payload[k] = v[k] })
    if (payload.plate) { payload.plate = payload.plate.toLocaleUpperCase('is'); payload.plate_normalized = payload.plate.replace(/[\s-]/g, '') }
    if (new URLSearchParams(location.search).has('dryrun')) { console.info('dryrun', payload); setState('sent'); return }
    setState('sending')
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000)
      const res = await fetch(RELAY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal })
      clearTimeout(t)
      const out = await res.json().catch(() => ({}))
      setState(res.ok && out.ok ? 'sent' : 'failed')
    } catch { setState('failed') }
  }

  const phoneFor = v.erindi === SMURNING ? ['436 6901', '+3544366901'] : ['421 6901', '+3544216901']
  if (state === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[26px] border p-7 md:p-9" style={{ borderColor: HAIR, background: 'rgba(26,22,19,0.92)' }}>
        <div aria-hidden className="mb-6 h-[3px] w-24" style={{ background: AMBER }} />
        <p className="text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight" style={{ fontFamily: "'Projekt Blackbird','Arial Black',sans-serif", color: INK }}>{copy.form_enquiryForm_003}</p>
        <p className="mt-4 text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
          {copy.form_enquiryForm_004}<a className="underline underline-offset-4" href={`tel:${phoneFor[1]}`}>hringja í {phoneFor[0]}</a>. {copy.form_enquiryForm_008}<a className="underline underline-offset-4" href="mailto:bilageirinn@bilageirinn.is">bilageirinn@bilageirinn.is</a>.
        </p>
      </div>
    )
  }

  const err = (k: string) => (touched[k] ? errors[k] : undefined)
  return (
    <form ref={formRef} onSubmit={submit} noValidate action={RELAY} method="post" className="bg-enquiry rounded-[26px] border p-6 md:p-9" style={{ borderColor: HAIR, background: 'rgba(26,22,19,0.92)', fontFamily: BODY }}>
      <input type="hidden" name="site" value="bilageirinn" />
      <fieldset>
        <legend className="mb-4 text-[12.5px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>{F.erindi.label} *</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={err('erindi') ? 'erindi-error' : undefined}>
          {ERINDI.map(o => {
            const on = v.erindi === o
            return (
              <label key={o} className="bg-btn relative inline-flex min-h-12 cursor-pointer items-center rounded-full border px-5 text-[15px] transition-colors" style={{ borderColor: on ? AMBER : HAIR, background: on ? AMBER : 'transparent', color: on ? DARKINK : INK, fontWeight: on ? 600 : 400 }}>
                <input type="radio" name="erindi" value={o} checked={on} onChange={() => { set('erindi', o); setTouched(t => ({ ...t, erindi: true })) }} className="absolute inset-0 cursor-pointer opacity-0" />
                {o}
              </label>
            )
          })}
        </div>
        <ErrorLine id="erindi-error" text={err('erindi')} />
      </fieldset>

      <Reveal show={g.claim} reduced={!!reduced}>
        <p className="mt-6 border-l-2 pl-4 text-[15px] leading-relaxed" style={{ borderColor: AMBER, color: INK }}>{copy.form_enquiryForm_001}</p>
      </Reveal>

      <div className="mt-7 grid gap-x-8 md:grid-cols-2">
        <Field k="name" v={v} set={set} err={err('name')} onBlur={() => setTouched(t => ({ ...t, name: true }))} autoComplete="name" />
        <Field k="phone" v={v} set={set} err={err('phone')} onBlur={() => setTouched(t => ({ ...t, phone: true }))} type="tel" autoComplete="tel" inputMode="tel" />
      </div>

      <fieldset className="mt-5">
        <legend className="text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>{F.reply.label}</legend>
        <div className="mt-3 flex gap-2">
          {(F.reply.options as string[]).map(o => (
            <label key={o} className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[14.5px]" style={{ borderColor: v.reply === o ? INK : HAIR, color: INK }}>
              <input type="radio" name="reply" value={o} checked={v.reply === o} onChange={() => set('reply', o)} className="absolute inset-0 cursor-pointer opacity-0" />
              <span aria-hidden className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: v.reply === o ? AMBER : 'transparent', border: `1px solid ${v.reply === o ? AMBER : MUT}` }} />
              {o}
            </label>
          ))}
        </div>
      </fieldset>
      <Field k="email" v={v} set={set} err={err('email')} onBlur={() => setTouched(t => ({ ...t, email: true }))} type="email" autoComplete="email" required={v.reply === EMAIL_REPLY} />

      <Reveal show={g.vehicle} reduced={!!reduced}>
        <div className="mt-2 grid gap-x-8 md:grid-cols-2">
          {!v.no_plate && <Field k="plate" v={v} set={set} err={err('plate')} onBlur={() => setTouched(t => ({ ...t, plate: true }))} help={copy.form_help_001} required autoCapitalize="characters" />}
          {v.no_plate && <Field k="make" v={v} set={set} err={err('make')} onBlur={() => setTouched(t => ({ ...t, make: true }))} required />}
          {v.no_plate && <Field k="model" v={v} set={set} err={err('model')} onBlur={() => setTouched(t => ({ ...t, model: true }))} required />}
          <div className="flex flex-col justify-center gap-1 py-3">
            <Check k="foreign_plate" v={v} set={set} />
            <Check k="no_plate" v={v} set={set} />
          </div>
          <Field k="year" v={v} set={set} err={err('year')} inputMode="numeric" />
          <Field k="mileage" v={v} set={set} err={err('mileage')} inputMode="numeric" />
        </div>
      </Reveal>

      <Reveal show={g.claim} reduced={!!reduced}>
        <div className="grid gap-x-8 md:grid-cols-2">
          <Field k="damage_date" v={v} set={set} type="date" />
          <Select k="insurer" v={v} set={set} />
          {v.insurer === OTHER_INSURER && <Field k="other_insurer" v={v} set={set} />}
          <Select k="reported" v={v} set={set} />
          <Field k="claim_number" v={v} set={set} />
          <Select k="driveable" v={v} set={set} />
        </div>
        <Field k="rental" v={v} set={set} area help={copy.form_enquiryForm_002} />
      </Reveal>
      <Reveal show={g.repair} reduced={!!reduced}>
        <div className="grid gap-x-8 md:grid-cols-2"><Select k="subtopic" v={v} set={set} /><Field k="warning" v={v} set={set} /></div>
        <Field k="inspection" v={v} set={set} area />
      </Reveal>
      <Reveal show={g.oil} reduced={!!reduced}><Field k="last_oil" v={v} set={set} /></Reveal>
      <Reveal show={g.wheel} reduced={!!reduced}>
        <Field k="alignment_reason" v={v} set={set} area />
        <Field k="wheel_changes" v={v} set={set} area />
        <Field k="inspection" v={v} set={set} area />
      </Reveal>
      <Reveal show={g.date} reduced={!!reduced}><Field k="preferred_date" v={v} set={set} type="date" help={copy.form_help_002} /></Reveal>

      <Field k="message" v={v} set={set} area err={err('message')} onBlur={() => setTouched(t => ({ ...t, message: true }))} required={g.messageRequired} />

      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>{copy.form_enquiryForm_015}<input tabIndex={-1} autoComplete="off" name="_honey" value={v._honey || ''} onChange={e => set('_honey', e.target.value)} /></label>
      </div>

      <p className="mt-6 text-[14px] leading-relaxed" style={{ color: MUT }}>{copy.form_enquiryForm_019}</p>
      {state === 'failed' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="mt-5 rounded-2xl border p-4 text-[15px]" style={{ borderColor: ERR, color: INK }}>
          {copy.failedIntro}<a className="underline" href={`tel:${phoneFor[1]}`}>hringdu í {phoneFor[0]}</a>.
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state === 'sending'} className="bg-btn bg-btn-solid inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-[15px] font-semibold disabled:opacity-60" style={{ background: AMBER, color: DARKINK }}>
          <Send size={16} strokeWidth={2.2} aria-hidden />{state === 'sending' ? copy.sendingEnquiry : copy.sendEnquiry}
        </button>
        <a href={`tel:${phoneFor[1]}`} className="bg-btn inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-[15px]" style={{ borderColor: HAIR, color: INK }}>
          <Phone size={15} strokeWidth={2.2} aria-hidden />{phoneFor[0]}
        </a>
      </div>
      <p className="mt-4 text-[13px]" style={{ color: MUT }}><a className="underline underline-offset-4" href={`${import.meta.env.BASE_URL}personuvernd/`}>{copy.privacyLink || 'Persónuvernd'}</a></p>
    </form>
  )
}

function Reveal({ show, reduced, children }: { show: boolean; reduced: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.38, ease: EASE }} style={{ overflow: 'hidden' }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ErrorLine({ id, text }: { id: string; text?: string }) {
  return <p id={id} role={text ? 'alert' : undefined} className="mt-2 min-h-[1px] text-[14px]" style={{ color: ERR, fontFamily: BODY }}>{text || ''}</p>
}

const labelCls = 'block text-[12px] uppercase tracking-[0.18em]'
const inputCls = 'mt-2 block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[17px] outline-none transition-colors focus:border-[#E8A23D]'

function Field({ k, v, set, err, onBlur, area, type = 'text', help, required, ...rest }: {
  k: string; v: Vals; set: (k: string, val: string) => void; err?: string; onBlur?: () => void; area?: boolean; type?: string; help?: string; required?: boolean
  autoComplete?: string; inputMode?: 'tel' | 'numeric' | 'text' | 'email'; autoCapitalize?: string
}) {
  const f = F[k]
  const req = required ?? f.required === true
  const common = {
    id: `bg-${k}`, name: k, value: v[k] || '', maxLength: f.max, onBlur,
    'aria-invalid': err ? true : undefined, 'aria-describedby': [err ? `${k}-error` : '', help ? `${k}-help` : ''].filter(Boolean).join(' ') || undefined,
    className: inputCls, style: { borderColor: err ? ERR : 'rgba(243,240,234,0.28)', color: INK, fontFamily: BODY, colorScheme: 'dark' as const },
  }
  return (
    <div className="pt-5">
      <label htmlFor={`bg-${k}`} className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{f.label}{req ? ' *' : ''}</label>
      {area
        ? <textarea {...common} rows={3} onChange={e => set(k, e.target.value)} />
        : <input {...common} {...rest} type={type} onChange={e => set(k, e.target.value)} />}
      {help && <p id={`${k}-help`} className="mt-2 text-[13.5px] leading-snug" style={{ color: MUT }}>{help}</p>}
      {err !== undefined && <ErrorLine id={`${k}-error`} text={err} />}
    </div>
  )
}

function Select({ k, v, set }: { k: string; v: Vals; set: (k: string, val: string) => void }) {
  const f = F[k]
  return (
    <div className="pt-5">
      <label htmlFor={`bg-${k}`} className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{f.label}</label>
      <select id={`bg-${k}`} name={k} value={v[k] || ''} onChange={e => set(k, e.target.value)} className={`${inputCls} appearance-none`} style={{ borderColor: 'rgba(243,240,234,0.28)', color: INK, fontFamily: BODY, colorScheme: 'dark' }}>
        {(f.options || []).map(o => <option key={o} value={o} style={{ background: '#1A1613' }}>{o || copy.selectPurpose || 'Veldu'}</option>)}
      </select>
    </div>
  )
}

function Check({ k, v, set }: { k: string; v: Vals; set: (k: string, val: string) => void }) {
  const on = !!v[k]
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-[15px]" style={{ color: INK }}>
      <input type="checkbox" name={k} checked={on} onChange={e => set(k, e.target.checked ? 'on' : '')} className="h-5 w-5 rounded" style={{ accentColor: AMBER }} />
      {F[k].label}
    </label>
  )
}
