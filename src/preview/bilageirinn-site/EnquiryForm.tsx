/* Bílageirinn request form, step by step, on the True Line design. Posts to the studio relay (sndr-contact,
   tenant `bilageirinn`), which answers ok only once the mail has gone out. Fields, labels and rules come from the
   fact-checked form spec (`_docs/bilageirinn-2026-11-11/research/FORM-SPEC.md`, form.mjs, content.mjs).
   Smart parts: the steps adapt to the erindi (no car step for "Annað"), the plate formats as you type, the email
   field only appears for a reply by email, a draft survives a reload, a summary before sending, and the shop's
   open/closed state from the published hours. No promise beyond the facts (no response time, no booking). */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Car, Check as CheckIcon, CircleDot, Droplet, MessageSquare, Pencil, Phone, Send, ShieldAlert, Wrench } from 'lucide-react'
import { copy } from './content.mjs'
import { fields } from './form.mjs'
import { shopStatus } from './Page'

const RELAY = 'https://sndr-contact.sindri-381.workers.dev/'
const INK = '#F3F0EA', MUT = '#A9A399', AMBER = '#E8A23D', DARKINK = '#131313', HAIR = 'rgba(243,240,234,0.14)', ERR = '#F2A07B', SURF = '#1A1613'
const BODY = "'Archia', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
const EBOLD = "'Projekt Blackbird', 'Arial Black', sans-serif"
const EASE = [0.23, 1, 0.32, 1] as const
const DRAFT_KEY = 'bg-enquiry-draft'

const F = Object.fromEntries(fields.map(f => [f.key, f]))
const ERINDI = F.erindi.options as string[] // Tjón, Viðgerð, Smurning, Hjólastilling, Annað
const [TJON, VIDGERD, SMURNING, HJOL, ANNAD] = ERINDI
const REPLY = F.reply.options as string[]
const EMAIL_REPLY = REPLY[1]
const OTHER_INSURER = copy.formRuntime_state_003
const META: Record<string, { Icon: typeof Car; hint: string }> = {
  [TJON]: { Icon: ShieldAlert, hint: 'Árekstur, beygla eða lakkskemmd' },
  [VIDGERD]: { Icon: Wrench, hint: 'Bilun, skoðun, ljós eða bremsur' },
  [SMURNING]: { Icon: Droplet, hint: 'Mobil smurstöðin' },
  [HJOL]: { Icon: CircleDot, hint: 'Bíllinn leitar til hliðar eða dekk slitna' },
  [ANNAD]: { Icon: MessageSquare, hint: 'Spurning eða annað erindi' },
}

type Vals = Record<string, string>
const groupsFor = (e: string) => ({
  vehicle: e !== ANNAD, /* also before a choice, so step 1 reads "af 4" */
  claim: e === TJON, repair: e === VIDGERD, oil: e === SMURNING, wheel: e === HJOL,
  date: !!e && e !== TJON && e !== ANNAD,
  messageRequired: e === TJON || e === VIDGERD || e === ANNAD,
})
/* Icelandic plates: two letters + three characters (AB 123, AB 12C) or personal plates; format the common case only */
const formatPlate = (raw: string) => {
  const c = raw.toLocaleUpperCase('is').replace(/[^A-ZÁÐÉÍÓÚÝÞÆÖ0-9 -]/g, '')
  const flat = c.replace(/[\s-]/g, '')
  return /^[A-ZÁÐÉÍÓÚÝÞÆÖ]{2}[0-9A-Z]{3}$/.test(flat) ? `${flat.slice(0, 2)} ${flat.slice(2)}` : c
}

function stepErrors(step: string, v: Vals): Record<string, string> {
  const g = groupsFor(v.erindi)
  const err: Record<string, string> = {}
  if (step === 'erindi' && !v.erindi) err.erindi = copy.formRuntime_message_008
  if (step === 'bill' && g.vehicle) {
    if (v.no_plate) {
      if (!v.make?.trim()) err.make = copy.formRuntime_message_005
      if (!v.model?.trim()) err.model = copy.formRuntime_message_006
    } else if (!v.plate?.trim()) err.plate = copy.formRuntime_message_004
    else if (!v.foreign_plate && !/^[A-ZÁÐÉÍÓÚÝÞÆÖ0-9]{2,12}$/i.test(v.plate.replace(/[\s-]/g, ''))) err.plate = copy.formRuntime_message_011
    if (v.year && !/^\d{4}$/.test(v.year)) err.year = copy.formRuntime_message_012
    if (v.mileage && !/^[\d .]+$/.test(v.mileage)) err.mileage = copy.formRuntime_message_013
  }
  if (step === 'nanar' && g.messageRequired && !v.message?.trim()) err.message = copy.formRuntime_message_007
  if (step === 'thu') {
    if (!v.name?.trim()) err.name = copy.formRuntime_message_001
    const d = (v.phone || '').replace(/\D/g, '')
    if (!v.phone?.trim()) err.phone = copy.formRuntime_message_002
    else if (d.length < 7 || d.length > 15) err.phone = copy.formRuntime_message_009
    if (v.reply === EMAIL_REPLY && !v.email?.trim()) err.email = copy.formRuntime_message_003
    else if (v.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) err.email = copy.formRuntime_message_010
  }
  return err
}

export default function EnquiryForm({ preset = '', service = '' }: { preset?: string; service?: string }) {
  const reduced = useReducedMotion()
  const initial = useMemo(() => {
    let e = preset
    try { const q = new URLSearchParams(location.search).get('erindi'); if (q && ERINDI.includes(q)) e = q } catch { /* */ }
    return e
  }, [preset])
  const [v, setV] = useState<Vals>(() => {
    try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); if (d && typeof d === 'object') return { reply: REPLY[0], ...d, ...(initial ? { erindi: initial } : {}) } } catch { /* */ }
    return { erindi: initial, reply: REPLY[0] }
  })
  const restored = useRef(false)
  useEffect(() => { try { restored.current = !!localStorage.getItem(DRAFT_KEY) } catch { /* */ } }, [])
  const g = groupsFor(v.erindi)
  const steps = ['erindi', ...(g.vehicle ? ['bill'] : []), 'nanar', 'thu'] as const
  const [si, setSi] = useState(initial ? 1 : 0)
  const step = steps[Math.min(si, steps.length - 1)]
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [status] = useState(() => shopStatus(new Date(), 'is'))
  const boxRef = useRef<HTMLDivElement>(null)
  const set = (k: string, val: string) => { setV(o => ({ ...o, [k]: val })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n }) }

  /* keep a draft while typing (never after sending) */
  useEffect(() => {
    if (state === 'sent') return
    const t = window.setTimeout(() => { try { const { _honey, ...rest } = v; void _honey; if (Object.entries(rest).some(([k, x]) => k !== 'reply' && x)) localStorage.setItem(DRAFT_KEY, JSON.stringify(rest)) } catch { /* */ } }, 400)
    return () => window.clearTimeout(t)
  }, [v, state])

  const focusStep = () => requestAnimationFrame(() => {
    const box = boxRef.current
    if (!box) return
    const top = box.getBoundingClientRect().top
    if (top < 70 || top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 96, behavior: reduced ? 'auto' : 'smooth' })
    box.querySelector<HTMLElement>('[data-first]')?.focus({ preventScroll: true })
  })
  const goTo = (n: number) => { setDir(n > si ? 1 : -1); setSi(n); setErrors({}); focusStep() }
  const next = () => {
    const err = stepErrors(step, v)
    setErrors(err)
    const first = Object.keys(err)[0]
    if (first) { boxRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return }
    goTo(si + 1)
  }
  const pick = (e: string) => { set('erindi', e); setDir(1); setSi(1); setErrors({}); focusStep() }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (step !== 'thu') { next(); return }
    if (state === 'sending') return
    const err = stepErrors('thu', v)
    setErrors(err)
    if (Object.keys(err).length) { boxRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(err)[0]}"]`)?.focus(); return }
    const keep = new Set(['erindi', 'name', 'phone', 'email', 'reply', 'message'])
    if (g.vehicle) ['plate', 'foreign_plate', 'no_plate', 'make', 'model', 'year', 'mileage'].forEach(k => keep.add(k))
    if (g.claim) ['damage_date', 'insurer', 'other_insurer', 'reported', 'claim_number', 'driveable', 'rental'].forEach(k => keep.add(k))
    if (g.repair) ['subtopic', 'inspection', 'warning'].forEach(k => keep.add(k))
    if (g.oil) keep.add('last_oil')
    if (g.wheel) ['alignment_reason', 'wheel_changes', 'inspection'].forEach(k => keep.add(k))
    if (g.date) keep.add('preferred_date')
    const payload: Record<string, string> = { site: 'bilageirinn', page: location.pathname, language: 'is', service, subject: `Bílageirinn: ${v.erindi}`, _honey: v._honey || '' }
    keep.forEach(k => { if (v[k]) payload[k] = v[k] })
    if (payload.plate) payload.plate_normalized = payload.plate.replace(/[\s-]/g, '')
    if (new URLSearchParams(location.search).has('dryrun')) { console.info('dryrun', JSON.stringify(payload)); finish(); return }
    setState('sending')
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000)
      const res = await fetch(RELAY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal })
      clearTimeout(t)
      const out = await res.json().catch(() => ({}))
      if (res.ok && out.ok) finish(); else setState('failed')
    } catch { setState('failed') }
  }
  const finish = () => { try { localStorage.removeItem(DRAFT_KEY) } catch { /* */ } setState('sent'); focusStep() }
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY) } catch { /* */ } restored.current = false; setV({ erindi: '', reply: REPLY[0] }); setSi(0); setErrors({}) }

  const phoneFor = v.erindi === SMURNING ? ['436 6901', '+3544366901'] : ['421 6901', '+3544216901']
  const labels: Record<string, string> = { erindi: 'Erindi', bill: 'Bíllinn', nanar: 'Nánar', thu: 'Þú' }
  const anim = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, x: dir * 36 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
    exit: reduced ? { opacity: 0 } : { opacity: 0, x: dir * -28, transition: { duration: 0.22, ease: 'easeIn' as const } },
  }

  if (state === 'sent') {
    return (
      <div ref={boxRef} className="rounded-[26px] border p-7 md:p-9" style={{ borderColor: HAIR, background: 'rgba(26,22,19,0.94)' }}>
        <div tabIndex={-1} data-first role="status" className="outline-none">
          <motion.div aria-hidden className="mb-6 h-[3px] w-28 origin-left" style={{ background: AMBER }} initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE }} />
          <p className="text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight" style={{ fontFamily: EBOLD, color: INK }}>{copy.form_enquiryForm_003}</p>
          <p className="mt-4 text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
            {copy.form_enquiryForm_004}<a className="underline underline-offset-4" href={`tel:${phoneFor[1]}`}>hringja í {phoneFor[0]}</a>. {copy.form_enquiryForm_008}<a className="underline underline-offset-4" href="mailto:bilageirinn@bilageirinn.is">bilageirinn@bilageirinn.is</a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate action={RELAY} method="post" className="bg-enquiry rounded-[26px] border p-6 md:p-9" style={{ borderColor: HAIR, background: 'rgba(26,22,19,0.94)', fontFamily: BODY }}>
      <input type="hidden" name="site" value="bilageirinn" />
      {/* progress: one amber segment per step, the current one filling */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>Skref {si + 1} af {steps.length} · {labels[step]}</p>
        <p className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: MUT }}>
          <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${status.open && !reduced ? 'bg-open-pulse' : ''}`} style={{ background: status.open ? '#7CCB7C' : MUT }} />
          <span className="hidden sm:inline">{status.text}</span>
        </p>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {steps.map((s, n) => (
          <span key={s} className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: HAIR }}>
            <motion.span className="block h-full origin-left" style={{ background: AMBER }} initial={false} animate={{ scaleX: n <= si ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.5, ease: EASE }} />
          </span>
        ))}
      </div>
      {restored.current && si === 0 && v.erindi && (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-[13.5px]" style={{ color: MUT }}>
          Drögin þín voru vistuð í þessum vafra.
          <button type="button" onClick={clearDraft} className="underline underline-offset-4" style={{ color: INK }}>Byrja upp á nýtt</button>
        </p>
      )}

      <div ref={boxRef} className="relative mt-7 min-h-[300px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} {...anim}>
            {step === 'erindi' && (
              <fieldset>
                <legend className="mb-4" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', color: INK }}>Hvað getum við gert?</legend>
                <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
                  {ERINDI.map((o, n) => {
                    const on = v.erindi === o
                    const { Icon, hint } = META[o]
                    return (
                      <label key={o} className={`bg-pick relative flex min-h-[64px] cursor-pointer items-center gap-4 rounded-[18px] border px-4 py-3 ${o === ANNAD ? 'sm:col-span-2' : ''}`}
                        style={{ borderColor: on ? AMBER : HAIR, background: on ? 'rgba(232,162,61,0.1)' : 'transparent' }}>
                        <input type="radio" name="erindi" value={o} checked={on} data-first={n === 0 ? '' : undefined} onChange={() => pick(o)} className="absolute inset-0 cursor-pointer opacity-0" />
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: on ? AMBER : SURF, color: on ? DARKINK : AMBER }}><Icon size={18} strokeWidth={1.9} aria-hidden /></span>
                        <span className="min-w-0">
                          <span className="block text-[16.5px] font-semibold" style={{ color: INK }}>{o}</span>
                          <span className="block text-[13.5px]" style={{ color: MUT }}>{hint}</span>
                        </span>
                        <ArrowRight size={16} aria-hidden className="bg-pick-arrow ml-auto shrink-0" style={{ color: AMBER }} />
                      </label>
                    )
                  })}
                </div>
                <ErrorLine id="erindi-error" text={errors.erindi} />
              </fieldset>
            )}

            {step === 'bill' && (
              <div>
                <StepTitle>Um bílinn</StepTitle>
                {!v.no_plate ? (
                  <div className="pt-2">
                    <label htmlFor="bg-plate" className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{F.plate.label} *</label>
                    <div className="mt-2 inline-flex items-stretch overflow-hidden rounded-[10px] border-2" style={{ borderColor: errors.plate ? ERR : INK, background: '#F3F0EA' }}>
                      <span aria-hidden className="flex w-8 items-end justify-center pb-1 text-[10px] font-bold" style={{ background: '#1D4FA0', color: '#F3F0EA', fontFamily: BODY }}>IS</span>
                      <input id="bg-plate" name="plate" data-first value={v.plate || ''} maxLength={F.plate.max} autoCapitalize="characters" autoComplete="off" spellCheck={false}
                        onChange={e => set('plate', v.foreign_plate ? e.target.value.toLocaleUpperCase('is') : formatPlate(e.target.value))}
                        aria-invalid={errors.plate ? true : undefined} aria-describedby="plate-help plate-error"
                        className="w-[11ch] bg-transparent px-3 py-2 text-[28px] font-bold uppercase tracking-[0.08em] outline-none" style={{ color: '#131313', fontFamily: BODY }} placeholder="AB 123" />
                    </div>
                    <p id="plate-help" className="mt-2 text-[13.5px]" style={{ color: MUT }}>{copy.form_help_001}</p>
                    <ErrorLine id="plate-error" text={errors.plate} />
                  </div>
                ) : (
                  <div className="grid gap-x-8 md:grid-cols-2">
                    <Field k="make" v={v} set={set} err={errors.make} required first />
                    <Field k="model" v={v} set={set} err={errors.model} required />
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-x-6">
                  <Check k="foreign_plate" v={v} set={set} />
                  <Check k="no_plate" v={v} set={set} />
                </div>
                <div className="grid gap-x-8 md:grid-cols-2">
                  <Field k="year" v={v} set={set} err={errors.year} inputMode="numeric" />
                  <Field k="mileage" v={v} set={set} err={errors.mileage} inputMode="numeric" />
                </div>
              </div>
            )}

            {step === 'nanar' && (
              <div>
                <StepTitle>{v.erindi === TJON ? 'Um tjónið' : v.erindi === SMURNING ? 'Um smurninguna' : v.erindi === HJOL ? 'Um hjólastillinguna' : v.erindi === VIDGERD ? 'Um viðgerðina' : 'Erindið'}</StepTitle>
                {g.claim && <Tip>{copy.form_enquiryForm_001}</Tip>}
                {g.oil && <Tip>Smurstöðin svarar líka beint í síma <a className="underline underline-offset-4" href="tel:+3544366901">436 6901</a>.</Tip>}
                {g.claim && (
                  <>
                    <div className="grid gap-x-8 md:grid-cols-2">
                      <Field k="damage_date" v={v} set={set} type="date" first />
                      <Select k="insurer" v={v} set={set} />
                      {v.insurer === OTHER_INSURER && <Field k="other_insurer" v={v} set={set} />}
                      <Select k="reported" v={v} set={set} />
                      <Field k="claim_number" v={v} set={set} />
                      <Select k="driveable" v={v} set={set} />
                    </div>
                    <Field k="rental" v={v} set={set} area help={copy.form_enquiryForm_002} />
                  </>
                )}
                {g.repair && (<><div className="grid gap-x-8 md:grid-cols-2"><Select k="subtopic" v={v} set={set} first /><Field k="warning" v={v} set={set} /></div><Field k="inspection" v={v} set={set} area /></>)}
                {g.oil && <Field k="last_oil" v={v} set={set} first />}
                {g.wheel && (<><Field k="alignment_reason" v={v} set={set} area first /><Field k="wheel_changes" v={v} set={set} area /><Field k="inspection" v={v} set={set} area /></>)}
                {g.date && <Field k="preferred_date" v={v} set={set} type="date" help={copy.form_help_002} />}
                <Field k="message" v={v} set={set} area err={errors.message} required={g.messageRequired} first={!g.claim && !g.repair && !g.oil && !g.wheel} counter />
                <p className="mt-3 text-[13.5px]" style={{ color: MUT }}>{copy.form_enquiryForm_017}<a className="underline underline-offset-4" href="mailto:bilageirinn@bilageirinn.is">bilageirinn@bilageirinn.is</a>.</p>
              </div>
            )}

            {step === 'thu' && (
              <div>
                <StepTitle>Hvernig náum við í þig?</StepTitle>
                <div className="grid gap-x-8 md:grid-cols-2">
                  <Field k="name" v={v} set={set} err={errors.name} autoComplete="name" first required />
                  <Field k="phone" v={v} set={set} err={errors.phone} type="tel" autoComplete="tel" inputMode="tel" required />
                </div>
                <fieldset className="mt-6">
                  <legend className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{F.reply.label}</legend>
                  <div className="mt-3 inline-flex rounded-full border p-1" style={{ borderColor: HAIR }}>
                    {REPLY.map(o => (
                      <label key={o} className="relative inline-flex min-h-10 cursor-pointer items-center rounded-full px-4 text-[14.5px] transition-colors duration-300" style={{ background: v.reply === o ? AMBER : 'transparent', color: v.reply === o ? DARKINK : INK, fontWeight: v.reply === o ? 600 : 400 }}>
                        <input type="radio" name="reply" value={o} checked={v.reply === o} onChange={() => set('reply', o)} className="absolute inset-0 cursor-pointer opacity-0" />{o}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <AnimatePresence initial={false}>
                  {(v.reply === EMAIL_REPLY || v.email) && (
                    <motion.div initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ overflow: 'hidden' }}>
                      <Field k="email" v={v} set={set} err={errors.email} type="email" autoComplete="email" required={v.reply === EMAIL_REPLY} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* summary: what goes to the shop, each part one tap from its step */}
                <div className="mt-8 rounded-[18px] border p-4 md:p-5" style={{ borderColor: HAIR }}>
                  <p className="text-[11.5px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: AMBER }}>Yfirlit</p>
                  <dl className="mt-2 text-[15px]">
                    {[
                      ['Erindi', v.erindi, 0],
                      ...(g.vehicle ? [['Bíll', v.no_plate ? [v.make, v.model].filter(Boolean).join(' ') : v.plate, 1] as [string, string, number]] : []),
                      ['Lýsing', v.message ? (v.message.length > 90 ? v.message.slice(0, 90) + '…' : v.message) : '–', steps.indexOf('nanar')],
                    ].map(([k, val, to]) => (
                      <div key={k as string} className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0" style={{ borderColor: HAIR }}>
                        <dt style={{ color: MUT }}>{k}</dt>
                        <dd className="flex min-w-0 items-baseline gap-3 text-right" style={{ color: INK }}>
                          <span className="min-w-0 [overflow-wrap:anywhere]">{val || '–'}</span>
                          <button type="button" onClick={() => goTo(to as number)} aria-label={`Breyta: ${k}`} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ color: AMBER }}><Pencil size={14} aria-hidden /></button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed" style={{ color: MUT }}>{copy.form_enquiryForm_019}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>{copy.form_enquiryForm_015}<input tabIndex={-1} autoComplete="off" name="_honey" value={v._honey || ''} onChange={e => set('_honey', e.target.value)} /></label>
      </div>

      {state === 'failed' && (
        <div role="alert" className="mt-5 rounded-2xl border p-4 text-[15px]" style={{ borderColor: ERR, color: INK }}>
          {copy.failedIntro}<a className="underline" href={`tel:${phoneFor[1]}`}>hringdu í {phoneFor[0]}</a>.
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {si > 0 && (
          <button type="button" onClick={() => goTo(si - 1)} className="bg-btn inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-[15px]" style={{ borderColor: HAIR, color: INK }}>
            <ArrowLeft size={16} aria-hidden />Til baka
          </button>
        )}
        {step !== 'erindi' && (
          <button type="submit" disabled={state === 'sending'} className="bg-btn bg-btn-solid inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-[15px] font-semibold disabled:opacity-60" style={{ background: AMBER, color: DARKINK }}>
            {step === 'thu' ? <><Send size={16} strokeWidth={2.2} aria-hidden />{state === 'sending' ? copy.sendingEnquiry : copy.sendEnquiry}</> : <>Áfram<ArrowRight size={16} aria-hidden /></>}
          </button>
        )}
        <a href={`tel:${phoneFor[1]}`} className="bg-btn ml-auto inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-[14.5px]" style={{ color: INK }}>
          <Phone size={15} strokeWidth={2.2} aria-hidden />{phoneFor[0]}
        </a>
      </div>
      <p className="mt-4 text-[13px]" style={{ color: MUT }}><a className="underline underline-offset-4" href={`${import.meta.env.BASE_URL}personuvernd/`}>{copy.privacyLink || 'Persónuvernd'}</a></p>
    </form>
  )
}

function StepTitle({ children }: { children: ReactNode }) {
  return <p className="mb-2" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', color: INK }}>{children}</p>
}
function Tip({ children }: { children: ReactNode }) {
  return <p className="mt-3 border-l-2 pl-4 text-[15px] leading-relaxed" style={{ borderColor: AMBER, color: INK }}>{children}</p>
}
function ErrorLine({ id, text }: { id: string; text?: string }) {
  return <p id={id} role={text ? 'alert' : undefined} className="mt-2 text-[14px]" style={{ color: ERR, fontFamily: BODY }}>{text || ''}</p>
}

const labelCls = 'block text-[12px] uppercase tracking-[0.18em]'
const inputCls = 'mt-2 block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[17px] outline-none transition-colors focus:border-[#E8A23D]'

function Field({ k, v, set, err, area, type = 'text', help, required, first, counter, ...rest }: {
  k: string; v: Vals; set: (k: string, val: string) => void; err?: string; area?: boolean; type?: string; help?: string; required?: boolean; first?: boolean; counter?: boolean
  autoComplete?: string; inputMode?: 'tel' | 'numeric' | 'text' | 'email'
}) {
  const f = F[k]
  const req = required ?? f.required === true
  const common = {
    id: `bg-${k}`, name: k, value: v[k] || '', maxLength: f.max, 'data-first': first ? '' : undefined,
    'aria-invalid': err ? true : undefined, 'aria-describedby': [err ? `${k}-error` : '', help ? `${k}-help` : ''].filter(Boolean).join(' ') || undefined,
    className: inputCls, style: { borderColor: err ? ERR : 'rgba(243,240,234,0.28)', color: INK, fontFamily: BODY, colorScheme: 'dark' as const },
  }
  const len = (v[k] || '').length
  return (
    <div className="pt-5">
      <label htmlFor={`bg-${k}`} className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{f.label}{req ? ' *' : ''}</label>
      {area ? <textarea {...common} rows={3} onChange={e => set(k, e.target.value)} /> : <input {...common} {...rest} type={type} onChange={e => set(k, e.target.value)} />}
      {counter && len > f.max * 0.7 && <p className="mt-1 text-right text-[12px] tabular-nums" style={{ color: len >= f.max ? ERR : MUT, fontFamily: MONO }}>{len} / {f.max}</p>}
      {help && <p id={`${k}-help`} className="mt-2 text-[13.5px] leading-snug" style={{ color: MUT }}>{help}</p>}
      {err && <ErrorLine id={`${k}-error`} text={err} />}
    </div>
  )
}

function Select({ k, v, set, first }: { k: string; v: Vals; set: (k: string, val: string) => void; first?: boolean }) {
  const f = F[k]
  return (
    <div className="pt-5">
      <label htmlFor={`bg-${k}`} className={labelCls} style={{ fontFamily: MONO, color: MUT }}>{f.label}</label>
      <select id={`bg-${k}`} name={k} data-first={first ? '' : undefined} value={v[k] || ''} onChange={e => set(k, e.target.value)} className={`${inputCls} appearance-none`} style={{ borderColor: 'rgba(243,240,234,0.28)', color: INK, fontFamily: BODY, colorScheme: 'dark' }}>
        {(f.options || []).map(o => <option key={o} value={o} style={{ background: SURF }}>{o || copy.selectPurpose || 'Veldu'}</option>)}
      </select>
    </div>
  )
}

function Check({ k, v, set }: { k: string; v: Vals; set: (k: string, val: string) => void }) {
  const on = !!v[k]
  return (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-3 text-[15px]" style={{ color: INK }}>
      <input type="checkbox" name={k} checked={on} onChange={e => set(k, e.target.checked ? 'on' : '')} className="peer absolute h-5 w-5 opacity-0" />
      <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#E8A23D]"
        style={{ borderColor: on ? AMBER : 'rgba(243,240,234,0.45)', background: on ? AMBER : 'transparent' }}>
        {on && <CheckIcon size={14} strokeWidth={3} style={{ color: DARKINK }} />}
      </span>
      {F[k].label}
    </label>
  )
}
