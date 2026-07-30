/**
 * THE OWNER SIDE — a demo of the dashboard Fossatún would run.
 *
 * This is deliberately a SEPARATE page from the guest prototype, because the
 * two have different audiences and mixing them is what made the old ticket
 * card misleading. The guest page shows only what the business really does
 * today. Everything they could GAIN lives here, where the reader is the owner
 * and knows they are being shown a proposal.
 *
 * The loop that sells it: make a booking on the redesign, watch it arrive here
 * as a pending request. Keep both tabs open and it updates live, because the
 * store broadcasts between tabs (see demoStore.ts).
 *
 * It says on screen, in Icelandic, that the data is a demo held in this
 * browser. Nothing here talks to a server and nothing is charged.
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './fossatun.css'
import { demo, type DemoBooking } from './demoStore'
import { FOSSATUN_STAY } from './booking'
import { isk } from '../../booking/engine'
import { NAME, PHONE_DISPLAY } from './data'

const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']

const nameOf = (id: string) =>
  FOSSATUN_STAY.resources.find((r) => r.id === id)?.name ?? id

function prettyDate(d: string) {
  const [, m, day] = d.split('-')
  return `${Number(day)}. ${MONTHS[Number(m) - 1]}`
}

export default function FossatunDashboard() {
  const [rows, setRows] = useState<DemoBooking[]>([])
  const [tab, setTab] = useState<'nyjar' | 'allar'>('nyjar')

  useEffect(() => {
    setRows(demo.all())
    return demo.subscribe(() => setRows(demo.all()))
  }, [])

  const pending = useMemo(() => rows.filter((r) => r.status === 'REQUESTED'), [rows])
  const shown = tab === 'nyjar' ? pending : rows

  const nights = (b: DemoBooking) =>
    b.endDate ? Math.max(1, Math.round((Date.parse(b.endDate) - Date.parse(b.date)) / 86400000)) : 1

  return (
    <div className="fst-root fst-dash" data-season="summer">
      <header className="fst-dash__bar">
        <div className="fst-wrap fst-dash__barin">
          <div>
            <span className="fst-label">Stjórnborð, sýnidæmi</span>
            <h1 className="fst-dash__title">{NAME}</h1>
          </div>
          <Link className="fst-cta fst-cta--ghost" to="/preview/fossatun">
            Opna vefinn
          </Link>
        </div>
      </header>

      <main className="fst-wrap" style={{ paddingBottom: 90 }}>
        <div className="fst-dash__note">
          <strong>Þetta er sýnidæmi.</strong> Bókanirnar hér eru geymdar í þessum vafra og fara
          hvergi annað. Opnaðu vefinn í öðrum flipa, sendu bókunarbeiðni og hún birtist hér um leið.
        </div>

        <div className="fst-dash__stats">
          <div className="fst-stat">
            <span className="fst-stat__n">{pending.length}</span>
            <span className="fst-stat__l">óafgreiddar beiðnir</span>
          </div>
          <div className="fst-stat">
            <span className="fst-stat__n">{rows.filter((r) => r.status === 'CONFIRMED').length}</span>
            <span className="fst-stat__l">staðfestar</span>
          </div>
          <div className="fst-stat">
            <span className="fst-stat__n">
              {rows.filter((r) => r.status !== 'DECLINED').reduce((s, b) => s + b.people, 0)}
            </span>
            <span className="fst-stat__l">gestir bókaðir</span>
          </div>
        </div>

        <div className="fst-dash__tabs" role="tablist">
          <button
            role="tab" aria-selected={tab === 'nyjar'}
            className="fst-dash__tab" onClick={() => setTab('nyjar')}
          >
            Nýjar beiðnir{pending.length > 0 && <span className="fst-dash__badge">{pending.length}</span>}
          </button>
          <button
            role="tab" aria-selected={tab === 'allar'}
            className="fst-dash__tab" onClick={() => setTab('allar')}
          >
            Allar bókanir
          </button>
          {rows.length > 0 && (
            <button className="fst-dash__reset" onClick={() => setRows(demo.reset())}>
              Hreinsa sýnidæmi
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="fst-dash__empty">
            <p style={{ margin: 0 }}>
              Engar beiðnir enn.{' '}
              <Link to="/preview/fossatun#bokun">Sendu eina á vefnum</Link> og hún birtist hér.
            </p>
          </div>
        ) : (
          <ul className="fst-dash__list">
            {shown.map((b) => (
              <li key={b.id} className="fst-dash__row" data-status={b.status}>
                <div className="fst-dash__when">
                  <strong>{prettyDate(b.date)}</strong>
                  {b.endDate && <span> til {prettyDate(b.endDate)}</span>}
                  <span className="fst-dash__meta">
                    {nights(b)} {nights(b) === 1 ? 'nótt' : 'nætur'}
                  </span>
                </div>
                <div className="fst-dash__what">
                  <strong>{nameOf(b.resourceId)}</strong>
                  <span className="fst-dash__meta">
                    {b.people} {b.people === 1 ? 'gestur' : 'gestir'}
                  </span>
                </div>
                <div className="fst-dash__who">
                  <strong>{b.customer?.name}</strong>
                  <a className="fst-dash__meta" href={`tel:${b.customer?.phone}`}>{b.customer?.phone}</a>
                </div>
                <div className="fst-dash__sum">
                  {b.quote ? isk(b.quote.total) : ''}
                  <span className="fst-sample">sýnidæmi</span>
                </div>
                <div className="fst-dash__act">
                  {b.status === 'REQUESTED' ? (
                    <>
                      <button
                        className="fst-cta fst-dash__yes"
                        onClick={() => setRows(demo.setStatus(b.id, 'CONFIRMED'))}
                      >
                        Staðfesta
                      </button>
                      <button
                        className="fst-cta fst-cta--ghost"
                        onClick={() => setRows(demo.setStatus(b.id, 'DECLINED'))}
                      >
                        Hafna
                      </button>
                    </>
                  ) : (
                    <span className="fst-dash__state">
                      {b.status === 'CONFIRMED' ? 'Staðfest' : 'Hafnað'}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="fst-dash__why">
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>Af hverju þetta skiptir máli</h2>
          <ul className="tight">
            <li>Bókunin kemur beint til ykkar, ekki í gegnum bókunarsíðu sem tekur þóknun.</li>
            <li>Þið staðfestið sjálf. Ekkert kort er slegið inn og engin greiðsla fer fram á vefnum.</li>
            <li>Lokaðir dagar eru skráðir einu sinni og vefurinn getur ekki selt þá.</li>
            <li>Sama kerfi ræður við gistingu, miða og gjafabréf þegar þið viljið bæta því við.</li>
          </ul>
          <p className="fst-note" style={{ marginTop: 18 }}>
            Spurningar: Sindri Már, 845 1758. Fossatún svarar í {PHONE_DISPLAY}.
          </p>
        </section>
      </main>
    </div>
  )
}
