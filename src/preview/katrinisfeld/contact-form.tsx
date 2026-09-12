/**
 * The enquiry form, shared by the home page's closing section and
 * /hafa-samband, so there is one form and one set of failure rules.
 *
 * It posts to FormSubmit and checks the BODY, not the status: until the
 * address is confirmed FormSubmit answers HTTP 200 with {"success":"false"}.
 * A form that silently fails is worse than no form, so failure names the
 * phone and the email outright.
 */
import { useState } from 'react'
import { STUDIO } from './facts'
import { FillSubmit } from './flair'

/** LAUNCH: swap to her own FormSubmit address and activate it once by a real
 *  send plus the confirmation click. */
const FORM_TO = 'katrin@katrinisfeld.is'

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setBusy(true); setErr('')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORM_TO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form) as never)),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || String(body.success) === 'false') throw new Error('form')
      setSent(true); form.reset()
    } catch {
      setErr(`Ekki tókst að senda. Hringdu í ${STUDIO.phoneDisplay} eða sendu póst á ${STUDIO.email}.`)
    } finally { setBusy(false) }
  }

  if (sent) {
    return (
      <p className="ki-body ki-samb-thanks" role="status">
        Takk fyrir. Fyrirspurnin er komin til skila og Katrín hefur samband.
      </p>
    )
  }

  return (
    <form className={`ki-form${compact ? ' ki-form--pair' : ''}`} onSubmit={submit}>
      <label>
        <span>Nafn</span>
        <input name="nafn" type="text" required autoComplete="name" />
      </label>
      <label>
        <span>Netfang</span>
        <input name="netfang" type="email" required autoComplete="email" />
      </label>
      <label>
        <span>Sími (valfrjálst)</span>
        <input name="simi" type="tel" autoComplete="tel" />
      </label>
      <label className="ki-form-wide">
        <span>Stutt verklýsing</span>
        <textarea name="verklysing" rows={compact ? 4 : 5} required
          placeholder="Hvaða rými, hvað stendur til og hvenær." />
      </label>
      <input type="hidden" name="_subject" value="Fyrirspurn af katrinisfeld.is" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ki-sr" />
      <div className="ki-form-wide ki-form-send">
        <FillSubmit disabled={busy}>{busy ? 'Sendi…' : 'Senda fyrirspurn'}</FillSubmit>
      </div>
      {err && <p className="ki-body ki-form-wide ki-form-err" role="alert">{err}</p>}
    </form>
  )
}
