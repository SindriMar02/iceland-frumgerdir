/**
 * THE OWNERS' SIDE — the dashboard Ari and family would run. Separate page
 * from the guest prototype; requests made on the redesign arrive here live.
 *
 * In Icelandic (Ari is the Icelandic host of a family business registered in
 * Iceland; the dashboard is the owner's tool, not the guests').
 * Declares its OWN @font-face — a lazy route inherits nothing from Page.tsx.
 * (Lineage: mysticlight/Dashboard.tsx, re-voiced, with the cottage column.)
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { demo, type DemoBooking } from './demoStore'

const NIGHT = '#101418'
const PANEL = '#181E24'
const BONE = '#E8ECEA'
const MUTE = 'rgba(232,236,234,.66)'
const HAIR = 'rgba(232,236,234,.14)'
const BLAR = '#7FA8C9'
const GRAENN = '#7FA889'
const DECLINE = '#C86A5A'

const SANS = "'Satoshi', system-ui, sans-serif"

const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']

function prettyDate(d?: string) {
  if (!d) return ''
  const [, m, day] = d.split('-')
  return `${Number(day)}. ${MONTHS[Number(m) - 1]}`
}

const nights = (b: DemoBooking) =>
  b.endDate ? Math.max(1, Math.round((Date.parse(b.endDate) - Date.parse(b.date)) / 86400000)) : 1

const cottageName = (b: DemoBooking) =>
  b.resourceId === 'graenn' ? 'Grænn' : 'Blár'

export default function GlassCottagesDashboard() {
  const [rows, setRows] = useState<DemoBooking[]>([])
  const [tab, setTab] = useState<'nyjar' | 'allar'>('nyjar')

  useEffect(() => {
    document.title = 'Glass Cottages · Stjórnborð'
    setRows(demo.all())
    return demo.subscribe(() => setRows(demo.all()))
  }, [])

  const pending = useMemo(() => rows.filter((r) => r.status === 'REQUESTED'), [rows])
  const shown = tab === 'nyjar' ? pending : [...rows].reverse()

  return (
    <div style={{ minHeight: '100svh', background: NIGHT, color: BONE, fontFamily: SANS, fontWeight: 400 }}>
      <style>{`
        @font-face { font-family: 'Satoshi'; src: url('${import.meta.env.BASE_URL}glasscottages/fonts/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'Satoshi'; src: url('${import.meta.env.BASE_URL}glasscottages/fonts/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
        .gcd-btn { font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
          border-radius: 3px; padding: 8px 14px; border: 1px solid ${HAIR};
          background: none; color: ${BONE}; }
        .gcd-btn:hover { border-color: ${BLAR}; }
        .gcd-btn.is-confirm { background: ${BLAR}; color: ${NIGHT}; border-color: ${BLAR}; }
        .gcd-btn.is-decline { color: ${DECLINE}; }
        .gcd-btn.is-decline:hover { border-color: ${DECLINE}; }
        .gcd-tab { font: inherit; font-size: 13px; cursor: pointer; background: none;
          border: 0; color: ${MUTE}; padding: 6px 0; border-bottom: 1px solid transparent; }
        .gcd-tab.is-on { color: ${BONE}; border-bottom-color: ${BLAR}; }
        .gcd-focus :focus-visible { outline: 2px solid ${BLAR}; outline-offset: 2px; }
        .gcd-focus a { color: ${BONE}; }
      `}</style>
      <div className="gcd-focus" style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontWeight: 500, letterSpacing: '.04em', fontSize: 'clamp(22px, 3.4vw, 34px)' }}>
            GLASS <span style={{ color: BLAR }}>COTTAGES</span>
          </h1>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: MUTE }}>
            Stjórnborð · sýnishorn
          </p>
          <Link to="/preview/glasscottages" style={{ marginLeft: 'auto', color: MUTE, fontSize: 13 }}>
            Aftur á gestasíðuna
          </Link>
        </header>

        <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, maxWidth: '58ch', margin: '18px 0 0' }}>
          Beiðnir af gestasíðunni birtast hér um leið og þær eru sendar, merktar húsi:
          Blár eða Grænn. Gögnin eru sýnishorn og lifa aðeins í þessum vafra.
        </p>

        <nav style={{ display: 'flex', gap: 24, margin: '36px 0 0', borderBottom: `1px solid ${HAIR}`, paddingBottom: 10 }} aria-label="Síur">
          <button type="button" className={`gcd-tab ${tab === 'nyjar' ? 'is-on' : ''}`} onClick={() => setTab('nyjar')}>
            Nýjar beiðnir {pending.length > 0 && `(${pending.length})`}
          </button>
          <button type="button" className={`gcd-tab ${tab === 'allar' ? 'is-on' : ''}`} onClick={() => setTab('allar')}>
            Allar ({rows.length})
          </button>
          <button type="button" className="gcd-tab" style={{ marginLeft: 'auto' }} onClick={() => demo.reset()}>
            Hreinsa sýnigögn
          </button>
        </nav>

        {shown.length === 0 ? (
          <div style={{ padding: '56px 0', color: MUTE, fontSize: 15, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              {tab === 'nyjar' ? 'Engar nýjar beiðnir.' : 'Engar beiðnir ennþá.'}
            </p>
            <p style={{ margin: '10px 0 0' }}>
              Farðu á <Link to="/preview/glasscottages">gestasíðuna</Link>,
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
                  <span style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: b.resourceId === 'graenn' ? GRAENN : BLAR,
                    border: `1px solid ${b.resourceId === 'graenn' ? GRAENN : BLAR}`,
                    borderRadius: 999, padding: '2px 10px',
                  }}>
                    {cottageName(b)}
                  </span>
                  <span style={{ fontSize: 12, color: MUTE }}>
                    {prettyDate(b.date)} til {prettyDate(b.endDate)} · {nights(b)}{' '}
                    {nights(b) === 1 ? 'nótt' : 'nætur'} · {b.people}{' '}
                    {b.people === 1 ? 'gestur' : 'gestir'}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 500,
                    letterSpacing: '.12em', textTransform: 'uppercase',
                    color: b.status === 'CONFIRMED' ? BLAR : b.status === 'DECLINED' ? DECLINE : MUTE,
                  }}>
                    {b.status === 'REQUESTED' ? 'Bíður' : b.status === 'CONFIRMED' ? 'Staðfest' : 'Hafnað'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.6 }}>
                  {b.customer.email}{b.customer.phone && ` · ${b.customer.phone}`}
                  {b.note && <div style={{ marginTop: 6, color: BONE }}>„{b.note}“</div>}
                </div>
                {b.status === 'REQUESTED' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="gcd-btn is-confirm" onClick={() => demo.setStatus(b.id, 'CONFIRMED')}>
                      Staðfesta
                    </button>
                    <button type="button" className="gcd-btn is-decline" onClick={() => demo.setStatus(b.id, 'DECLINED')}>
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
