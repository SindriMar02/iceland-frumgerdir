/**
 * /hafa-samband — the page local search actually resolves to.
 *
 * Everything a "innanhússarkitekt nálægt mér" result needs is here in
 * crawlable text: name, street address, postcode, city, phone as a tel: link,
 * email, and the opening hours as published on Já.is. The form posts to
 * FormSubmit and states plainly that it does, because a form that silently
 * fails is worse than no form.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline } from './kit'
import { STUDIO, ADDRESS_LINE } from './facts'
import { PROCESS } from './content'
import { WORK } from './paths'

/** LAUNCH: swap to her own FormSubmit address and activate it once by a real
 *  send plus the confirmation click. Until activated, FormSubmit answers HTTP
 *  200 with {"success":"false"} — check the body, not res.ok. */
const FORM_TO = 'katrin@katrinisfeld.is'

export function ContactPage() {
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
      // FormSubmit answers 200 with success:"false" until the address is confirmed
      if (!res.ok || String(body.success) === 'false') throw new Error('form')
      setSent(true); form.reset()
    } catch {
      setErr(`Ekki tókst að senda. Hringdu í ${STUDIO.phoneDisplay} eða sendu póst á ${STUDIO.email}.`)
    } finally { setBusy(false) }
  }

  const head: Head = {
    title: `Hafa samband · Katrín Ísfeld innanhússarkitekt, ${STUDIO.street}, Reykjavík`,
    desc:
      `Katrín Ísfeld innanhússarkitekt, ${ADDRESS_LINE}. Sími ${STUDIO.phoneDisplay}, ` +
      `${STUDIO.email}. Opið alla daga ${STUDIO.opens}–${STUDIO.closes}. Sendu stutta verklýsingu og hún hefur samband.`,
    clean: '/hafa-samband',
  }

  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Hafa samband</p>
        <Headline as="h1" text="Eigum við að vinna saman?" size={84} floor={34} />
        <p className="ki-lead ki-rv">Það er ekkert verk of stórt eða lítið.</p>
      </section>

      <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
        <div className="ki-contact-grid">
          <div>
            <h2 className="ki-kicker">Stúdíóið</h2>
            <dl className="ki-dl">
              <div><dt>Heimilisfang</dt><dd>{STUDIO.street}<br />{STUDIO.postalCode} {STUDIO.city}</dd></div>
              <div><dt>Sími</dt><dd><a href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a></dd></div>
              <div><dt>Netfang</dt><dd><a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a></dd></div>
              <div><dt>Opið</dt><dd>Alla daga {STUDIO.opens}–{STUDIO.closes}</dd></div>
              <div>
                <dt>Samfélagsmiðlar</dt>
                <dd>
                  <a href={STUDIO.instagram} target="_blank" rel="me noopener">Instagram</a>{' · '}
                  <a href={STUDIO.facebook} target="_blank" rel="me noopener">Facebook</a>{' · '}
                  <a href={STUDIO.linkedin} target="_blank" rel="me noopener">LinkedIn</a>
                </dd>
              </div>
            </dl>
            <p className="ki-body ki-rv" style={{ marginTop: 'calc(var(--u) * 30)' }}>
              Ég kem á staðinn og tek út verkefnið í samráði við eigendur, og geri í
              framhaldi tilboð í verkið.
            </p>
          </div>

          <div>
            <h2 className="ki-kicker">Fyrirspurnarform</h2>
            {sent ? (
              <p className="ki-body" role="status">
                Takk fyrir. Fyrirspurnin er komin til skila og Katrín hefur samband.
              </p>
            ) : (
              <form className="ki-form" onSubmit={submit}>
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
                <label>
                  <span>Stutt verklýsing</span>
                  <textarea name="verklysing" rows={5} required
                    placeholder="Hvaða rými, hvað stendur til og hvenær." />
                </label>
                <input type="hidden" name="_subject" value="Fyrirspurn af katrinisfeld.is" />
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ki-sr" />
                <button className="ki-cta" type="submit" disabled={busy}>
                  {busy ? 'Sendi…' : 'Senda fyrirspurn'}
                </button>
                {err && <p className="ki-body" role="alert" style={{ color: '#8C3A34' }}>{err}</p>}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="ki-wrap" data-ki-band="dark">
        <p className="ki-kicker">Ferlið</p>
        <Headline text="Það sem gerist næst." size={62} floor={30} measure={800} />
        <ol className="ki-steps">
          {PROCESS.map((s) => <li key={s.title} className="ki-rv"><h3>{s.title}</h3><p>{s.body}</p></li>)}
        </ol>
        <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}>Sjá verkefnin fyrst</Link></p>
      </div>
    </Shell>
  )
}
