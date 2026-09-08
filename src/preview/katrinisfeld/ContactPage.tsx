/**
 * /hafa-samband — the page local search actually resolves to.
 *
 * WHAT WAS WRONG WITH IT: too many doors, and the reassurance behind the one
 * that matters. It opened on a two-column split of a five-row definition list
 * against the form, with a labelled heading over each column, so the first
 * thing on the page was a data table competing with the thing the page exists
 * to collect. Below that came the showroom, and only THEN "það sem gerist
 * næst" — the four steps that tell you what happens after you write, sitting
 * underneath the writing. And between address, map, phone, email, hours,
 * Instagram, Facebook, LinkedIn, the form and a visit, it offered nine ways
 * to make contact before it had asked for one.
 *
 * It is three blocks now, one decision each.
 *
 *   1. The ask, and the fastest door — her number, in the head, as a link.
 *      Some people will just ring, and they should not have to scroll for it.
 *   2. The form WITH what happens next beside it. Writing the message and
 *      knowing what follows it are one view, not two screens apart.
 *   3. The showroom, carrying the address, the hours and the map — because
 *      the street address only means anything in the context of coming to
 *      see the cabinetry, which is the one thing nobody decides off a screen.
 *
 * Everything a "innanhússarkitekt nálægt mér" result needs is still here in
 * crawlable text: name, street, postcode, city, phone as a tel: link, email,
 * and the hours as published on Já.is. The social profiles are in the footer
 * on every page, so they are not repeated here. The form posts to FormSubmit
 * and says plainly that it does, because a form that silently fails is worse
 * than no form.
 */
import { useState } from 'react'
import { Link } from './link'
import { Shell, type Head } from './Shell'
import { Answers } from './kit'
import { FAQ_CONTACT } from './content'
import { Headline, Slide } from './kit'
import { STUDIO, ADDRESS_LINE, MAP_URL, SHOWROOM, HOURS_DAYS_IS, APPOINTMENT_NOTE_IS } from './facts'
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
      `${STUDIO.email}. Opnunartími ${STUDIO.opens}–${STUDIO.closes} ${HOURS_DAYS_IS}, eftir samkomulagi. Sendu stutta verklýsingu og hún hefur samband.`,
    clean: '/hafa-samband',
  }

  return (
    <Shell head={head}>
      {/* 01 · the ask, and the fastest door */}
      <section className="ki-pagehead ki-samb-head" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Hafa samband</p>
        <Headline as="h1" text="Eigum við að vinna saman?" size={84} floor={34} />
        <p className="ki-lead ki-rv">
          Það er ekkert verk of stórt eða lítið. Segðu mér frá rýminu í nokkrum línum —
          eða hringdu, ef það er fljótlegra.
        </p>
        <p className="ki-samb-direct ki-rv">
          <a className="ki-samb-tel-lg" href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
          <a className="ki-samb-mail" href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
        </p>
      </section>

      {/* 02 · the form, and what follows it, in one view */}
      <section className="ki-wrap ki-samb-body" data-ki-band="light">
        <div className="ki-samb-grid">
          <div>
            <h2 className="ki-kicker">Fyrirspurn</h2>
            {sent ? (
              <p className="ki-body ki-samb-thanks" role="status">
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

          {/* the four steps used to be the last thing on the page, underneath
              the showroom — which put the answer to "and then what?" after the
              moment the visitor had to decide whether to ask */}
          <aside className="ki-samb-next">
            <h2 className="ki-kicker">Það sem gerist næst</h2>
            <ol className="ki-steps ki-steps--stack">
              {PROCESS.map((s, i) => (
                <li key={s.title} className="ki-rv" style={{ ['--i' as string]: i }}>
                  <h3>{s.title}</h3><p>{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}>Sjá verkefnin fyrst</Link></p>
          </aside>
        </div>
      </section>

      {/* 03 · the showroom, and the address that only matters because of it */}
      <section className="ki-wrap ki-samb-studio" data-ki-band="dark">
        <div className="ki-split">
          <Slide id={SHOWROOM.photo} alt={SHOWROOM.alt} sizes="(max-width: 860px) 92vw, 45vw"
            className="ki-split-fig" variant="shutter" />
          <div>
            <p className="ki-kicker">Stúdíóið við {STUDIO.street}</p>
            <Headline text={SHOWROOM.lead} size={58} floor={28} measure={640} />
            <p className="ki-body ki-rv">{SHOWROOM.body}</p>
            <dl className="ki-facts-row ki-rv">
              <div>
                <dt>Heimilisfang</dt>
                <dd>
                  {STUDIO.street}, {STUDIO.postalCode} {STUDIO.city}<br />
                  <a href={MAP_URL} target="_blank" rel="noopener">Sjá á korti</a>
                </dd>
              </div>
              <div>
                <dt>Opið</dt>
                <dd>{STUDIO.opens}–{STUDIO.closes} {HOURS_DAYS_IS}<br />{APPOINTMENT_NOTE_IS}</dd>
              </div>
            </dl>
            <p className="ki-cta-row ki-rv">
              <a className="ki-cta" href={STUDIO.phoneHref}>Hringja og finna tíma</a>
            </p>
          </div>
        </div>
      </section>

      <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
        <Answers items={FAQ_CONTACT} title="Spurt áður en hringt er" />
      </div>
    </Shell>
  )
}
