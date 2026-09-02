/**
 * THE OWNER'S SIDE — the dashboard the owners of Svart Lodge would run. Deliberately a separate
 * page from the guest prototype; the loop that sells it is making a request on
 * the redesign and watching it arrive here as a pending row.
 *
 * In Icelandic, because its audience is an Akureyri company.
 * Declares its OWN @font-face — a lazy route inherits nothing from Page.tsx.
 * (Lineage: laxfoss/Dashboard.tsx, re-voiced.)
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { demo, type DemoBooking } from './demoStore'

const FROST = '#EFEFED'
const PANEL = '#FFFFFF'
const INK = '#181A1B'
const MUTE = 'rgba(24,26,27,.66)'
const HAIR = 'rgba(24,26,27,.16)'
const RIVER = '#2E7D80'
const DECLINE = '#A44A32'

const SANS = "'Familjen Grotesk', system-ui, sans-serif"

const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']

function prettyDate(d?: string) {
  if (!d) return ''
  const [, m, day] = d.split('-')
  return `${Number(day)}. ${MONTHS[Number(m) - 1]}`
}

const nights = (b: DemoBooking) =>
  b.endDate ? Math.max(1, Math.round((Date.parse(b.endDate) - Date.parse(b.date)) / 86400000)) : 1

export default function SvartLodgeDashboard() {
  const [rows, setRows] = useState<DemoBooking[]>([])
  const [tab, setTab] = useState<'nyjar' | 'allar'>('nyjar')

  useEffect(() => {
    document.title = 'Svart Lodge · Stjórnborð'
    setRows(demo.all())
    return demo.subscribe(() => setRows(demo.all()))
  }, [])

  const pending = useMemo(() => rows.filter((r) => r.status === 'REQUESTED'), [rows])
  const shown = tab === 'nyjar' ? pending : [...rows].reverse()

  return (
    <div style={{ minHeight: '100svh', background: FROST, color: INK, fontFamily: SANS, fontWeight: 400 }}>
      <style>{`
        @font-face { font-family: 'Familjen Grotesk'; src: url('${import.meta.env.BASE_URL}svartlodge/fonts/FamiljenGrotesk-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'Familjen Grotesk'; src: url('${import.meta.env.BASE_URL}svartlodge/fonts/FamiljenGrotesk-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
        .sbd-btn { font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
          border-radius: 3px; padding: 8px 14px; border: 1px solid ${HAIR};
          background: none; color: ${INK}; }
        .sbd-btn:hover { border-color: ${RIVER}; }
        .sbd-btn.is-confirm { background: ${RIVER}; color: #fff; border-color: ${RIVER}; }
        .sbd-btn.is-decline { color: ${DECLINE}; }
        .sbd-btn.is-decline:hover { border-color: ${DECLINE}; }
        .sbd-tab { font: inherit; font-size: 13px; cursor: pointer; background: none;
          border: 0; color: ${MUTE}; padding: 6px 0; border-bottom: 1px solid transparent; }
        .sbd-tab.is-on { color: ${INK}; border-bottom-color: ${RIVER}; }
        .sbd-focus :focus-visible { outline: 2px solid ${RIVER}; outline-offset: 2px; }
        .sbd-focus a { color: ${INK}; }
      `}</style>
      <div className="sbd-focus" style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
          <h1 style={{
            margin: 0, fontWeight: 500, letterSpacing: '.02em',
            fontSize: 'clamp(24px, 3.6vw, 36px)',
          }}>
            SVART LODGE
          </h1>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: MUTE }}>
            Stjórnborð · sýnishorn
          </p>
          <Link to="/preview/svartlodge" style={{ marginLeft: 'auto', color: MUTE, fontSize: 13 }}>
            Aftur á gestasíðuna
          </Link>
        </header>

        <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, maxWidth: '58ch', margin: '18px 0 0' }}>
          Beiðnir af gestasíðunni birtast hér um leið og þær eru sendar. Opnaðu báða flipana
          hlið við hlið til að sjá hringrásina: gestur biður, þú staðfestir. Gögnin eru
          sýnishorn og lifa aðeins í þessum vafra.
        </p>

        <nav style={{ display: 'flex', gap: 24, margin: '36px 0 0', borderBottom: `1px solid ${HAIR}`, paddingBottom: 10 }} aria-label="Síur">
          <button type="button" className={`sbd-tab ${tab === 'nyjar' ? 'is-on' : ''}`} onClick={() => setTab('nyjar')}>
            Nýjar beiðnir {pending.length > 0 && `(${pending.length})`}
          </button>
          <button type="button" className={`sbd-tab ${tab === 'allar' ? 'is-on' : ''}`} onClick={() => setTab('allar')}>
            Allar ({rows.length})
          </button>
          <button type="button" className="sbd-tab" style={{ marginLeft: 'auto' }} onClick={() => demo.reset()}>
            Hreinsa sýnigögn
          </button>
        </nav>

        {shown.length === 0 ? (
          <div style={{ padding: '56px 0', color: MUTE, fontSize: 15, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              {tab === 'nyjar' ? 'Engar nýjar beiðnir.' : 'Engar beiðnir ennþá.'}
            </p>
            <p style={{ margin: '10px 0 0' }}>
              Farðu á <Link to="/preview/svartlodge">gestasíðuna</Link>,
              sendu prufubeiðni og fylgstu með henni birtast hér.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-live="polite">
            {shown.map((b) => (
              <li key={b.id} style={{
                display: 'grid', gap: 14, padding: '20px 16px', margin: '14px 0 0',
                background: PANEL, border: `1px solid ${HAIR}`, borderRadius: 3,
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
                  <strong style={{ fontWeight: 500, fontSize: 16 }}>{b.customer.name}</strong>
                  <span style={{ fontSize: 12, color: MUTE }}>
                    {prettyDate(b.date)} til {prettyDate(b.endDate)} · {nights(b)}{' '}
                    {nights(b) === 1 ? 'nótt' : 'nætur'} · {b.people}{' '}
                    {b.people === 1 ? 'gestur' : 'gestir'}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 500,
                    letterSpacing: '.12em', textTransform: 'uppercase',
                    color: b.status === 'CONFIRMED' ? RIVER : b.status === 'DECLINED' ? DECLINE : MUTE,
                  }}>
                    {b.status === 'REQUESTED' ? 'Bíður' : b.status === 'CONFIRMED' ? 'Staðfest' : 'Hafnað'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.6 }}>
                  {b.customer.email}{b.customer.phone && ` · ${b.customer.phone}`}
                  {b.note && <div style={{ marginTop: 6, color: INK }}>„{b.note}“</div>}
                </div>
                {b.status === 'REQUESTED' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="sbd-btn is-confirm" onClick={() => demo.setStatus(b.id, 'CONFIRMED')}>
                      Staðfesta
                    </button>
                    <button type="button" className="sbd-btn is-decline" onClick={() => demo.setStatus(b.id, 'DECLINED')}>
                      Hafna
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p style={{ fontSize: 11, color: MUTE, margin: '48px 0 0', lineHeight: 1.7 }}>
          Sýnishorn frá SNDR. Engin gögn fara á netið og ekkert er innheimt.
        </p>
      </div>
    </div>
  )
}
