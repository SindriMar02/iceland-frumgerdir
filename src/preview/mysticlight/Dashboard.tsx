/**
 * THE OWNERS' SIDE — a demo of the dashboard Esther and Pierre would run.
 *
 * Deliberately a SEPARATE page from the guest prototype: the two have
 * different audiences, and mixing them is what makes demos misleading. The
 * guest page shows only what the cabin really offers today; everything they
 * could GAIN lives here, where the reader is the owner and knows they are
 * being shown a proposal.
 *
 * The loop that sells it: make a request on the redesign, watch it arrive
 * here as a pending row. Both tabs update live (see demoStore.ts).
 *
 * In Icelandic, because its audience is Esther and Pierre.
 * (Lineage: mirrorhouse/Dashboard.tsx, re-voiced for this cabin.)
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { demo, type DemoBooking } from './demoStore'

const CANVAS = '#10141B'
const SOFT = '#171E29'
const INK = '#DEE4E8'
const MUTE = 'rgba(222,228,232,.7)'
const HAIR = 'rgba(222,228,232,.14)'
const AMBER = '#D9A54E'
const DECLINE = '#C86A5A'

const DISPLAY = "'Nippo', system-ui, sans-serif"
const BODY_FONT = "'Supreme', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']

function prettyDate(d?: string) {
  if (!d) return ''
  const [, m, day] = d.split('-')
  return `${Number(day)}. ${MONTHS[Number(m) - 1]}`
}

const nights = (b: DemoBooking) =>
  b.endDate ? Math.max(1, Math.round((Date.parse(b.endDate) - Date.parse(b.date)) / 86400000)) : 1

export default function MysticLightDashboard() {
  const [rows, setRows] = useState<DemoBooking[]>([])
  const [tab, setTab] = useState<'nyjar' | 'allar'>('nyjar')

  useEffect(() => {
    document.title = 'Mystic Light Lodge · Stjórnborð'
    setRows(demo.all())
    return demo.subscribe(() => setRows(demo.all()))
  }, [])

  const pending = useMemo(() => rows.filter((r) => r.status === 'REQUESTED'), [rows])
  const shown = tab === 'nyjar' ? pending : [...rows].reverse()

  return (
    <div style={{
      minHeight: '100svh', background: CANVAS, color: INK,
      fontFamily: BODY_FONT, fontWeight: 300,
    }}>
      <style>{`
        /* The dashboard is its own lazy route, so it has to declare the faces
           itself: the guest page's @font-face rules are not loaded here. */
        @font-face { font-family: 'Nippo'; src: url('${import.meta.env.BASE_URL}fonts/nippo/Nippo-Variable.woff2') format('woff2'); font-weight: 200 700; font-display: swap; }
        @font-face { font-family: 'Supreme'; src: url('${import.meta.env.BASE_URL}fonts/supreme/Supreme-Variable.woff2') format('woff2'); font-weight: 100 800; font-display: swap; }
        @font-face { font-family: 'Space Mono'; src: url('${import.meta.env.BASE_URL}fonts/space-mono/SpaceMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        .mld-btn { font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
          border-radius: 2px; padding: 8px 14px; border: 1px solid ${HAIR};
          background: none; color: ${INK}; }
        .mld-btn:hover { border-color: ${AMBER}; }
        .mld-btn.is-confirm { background: ${AMBER}; color: ${CANVAS}; border-color: ${AMBER}; }
        .mld-btn.is-decline { color: ${DECLINE}; }
        .mld-btn.is-decline:hover { border-color: ${DECLINE}; }
        .mld-tab { font: inherit; font-size: 13px; cursor: pointer; background: none;
          border: 0; color: ${MUTE}; padding: 6px 0; border-bottom: 1px solid transparent; }
        .mld-tab.is-on { color: ${INK}; border-bottom-color: ${AMBER}; }
        .mld-focus :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 2px; }
      `}</style>
      <div className="mld-focus" style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontWeight: 400, letterSpacing: '.05em',
            fontSize: 'clamp(24px, 3.6vw, 38px)',
          }}>
            MYSTIC <span style={{ color: AMBER, fontWeight: 500 }}>LIGHT</span>
          </h1>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: MUTE }}>
            Stjórnborð · sýnishorn
          </p>
          <Link to="/preview/mysticlight" style={{ marginLeft: 'auto', color: MUTE, fontSize: 13 }}>
            Aftur á gestasíðuna
          </Link>
        </header>

        <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, maxWidth: '58ch', margin: '18px 0 0' }}>
          Beiðnir af gestasíðunni birtast hér um leið og þær eru sendar. Opnaðu báða flipana
          hlið við hlið til að sjá hringrásina: gestur biður, þið staðfestið. Gögnin eru
          sýnishorn og lifa aðeins í þessum vafra.
        </p>

        <nav style={{ display: 'flex', gap: 24, margin: '36px 0 0', borderBottom: `1px solid ${HAIR}`, paddingBottom: 10 }} aria-label="Síur">
          <button type="button" className={`mld-tab ${tab === 'nyjar' ? 'is-on' : ''}`} onClick={() => setTab('nyjar')}>
            Nýjar beiðnir {pending.length > 0 && `(${pending.length})`}
          </button>
          <button type="button" className={`mld-tab ${tab === 'allar' ? 'is-on' : ''}`} onClick={() => setTab('allar')}>
            Allar ({rows.length})
          </button>
          <button type="button" className="mld-tab" style={{ marginLeft: 'auto' }} onClick={() => demo.reset()}>
            Hreinsa sýnigögn
          </button>
        </nav>

        {shown.length === 0 ? (
          <div style={{ padding: '56px 0', color: MUTE, fontSize: 15, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              {tab === 'nyjar' ? 'Engar nýjar beiðnir.' : 'Engar beiðnir ennþá.'}
            </p>
            <p style={{ margin: '10px 0 0' }}>
              Farðu á <Link to="/preview/mysticlight" style={{ color: INK }}>gestasíðuna</Link>,
              sendu prufubeiðni og fylgstu með henni birtast hér.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-live="polite">
            {shown.map((b) => (
              <li key={b.id} style={{
                display: 'grid', gap: 14, padding: '20px 16px', margin: '14px 0 0',
                background: SOFT, border: `1px solid ${HAIR}`, borderRadius: 2,
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
                  <strong style={{ fontWeight: 500, fontSize: 16 }}>{b.customer.name}</strong>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: MUTE }}>
                    {prettyDate(b.date)} til {prettyDate(b.endDate)} · {nights(b)}{' '}
                    {nights(b) === 1 ? 'nótt' : 'nætur'} · {b.people}{' '}
                    {b.people === 1 ? 'gestur' : 'gestir'}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontFamily: MONO, fontSize: 11,
                    letterSpacing: '.12em', textTransform: 'uppercase',
                    color: b.status === 'CONFIRMED' ? AMBER : b.status === 'DECLINED' ? DECLINE : MUTE,
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
                    <button type="button" className="mld-btn is-confirm" onClick={() => demo.setStatus(b.id, 'CONFIRMED')}>
                      Staðfesta
                    </button>
                    <button type="button" className="mld-btn is-decline" onClick={() => demo.setStatus(b.id, 'DECLINED')}>
                      Hafna
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p style={{ fontFamily: MONO, fontSize: 11, color: MUTE, margin: '48px 0 0', lineHeight: 1.7 }}>
          Sýnishorn frá SNDR. Engin gögn fara á netið og ekkert er innheimt.
        </p>
      </div>
    </div>
  )
}
