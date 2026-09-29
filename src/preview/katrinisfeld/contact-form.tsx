/**
 * The enquiry form, shared by the home page's closing section and
 * /hafa-samband, so there is one form and one set of failure rules.
 *
 * It posts to our own relay (04-platform/sndr-contact), which answers ok only
 * when the mail provider has accepted the message. FormSubmit is gone: it
 * answered HTTP 200 with {"success":"false"} until the recipient had clicked an
 * activation link. This form treats anything but {ok:true} as a failure, and a
 * failure names the phone and the email outright.
 *
 * It is also a real form: method and action are set, so a submit before the
 * page has hydrated (or with no script) posts natively, and the relay sends the
 * visitor back to this page with #sent or #senderror, which CSS :target shows.
 */
import { useState } from 'react'
import { STUDIO } from './facts'
import { FillSubmit } from './flair'

/** The relay. Its recipient is fixed on the Worker (KATRIN_TO), never here. */
const ENDPOINT = 'https://sndr-contact.sindri-381.workers.dev/'

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setBusy(true); setErr('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ site: 'katrin', ...Object.fromEntries(new FormData(form) as never) }),
      })
      const body = await res.json().catch(() => null)
      // an explicit ok from the relay, nothing less: a 200 with any other body is not a delivery
      if (!res.ok || !body || body.ok !== true) throw new Error('form')
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
    <form className={`ki-form${compact ? ' ki-form--pair' : ''}`} method="post" action={ENDPOINT} onSubmit={submit}>
      <input type="hidden" name="site" value="katrin" />
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
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ki-sr" />
      <div className="ki-form-wide ki-form-send">
        <FillSubmit disabled={busy}>{busy ? 'Sendi…' : 'Senda fyrirspurn'}</FillSubmit>
      </div>
      {err && <p className="ki-body ki-form-wide ki-form-err" role="alert">{err}</p>}
      {/* shown by :target after a native post (no script, or before hydration) */}
      <p id="sent" className="ki-body ki-form-wide ki-form-flash">
        Takk fyrir. Fyrirspurnin er komin til skila og Katrín hefur samband.
      </p>
      <p id="senderror" className="ki-body ki-form-wide ki-form-err ki-form-flash">
        Ekki tókst að senda. Hringdu í {STUDIO.phoneDisplay} eða sendu póst á {STUDIO.email}.
      </p>
    </form>
  )
}
