/**
 * Reynir bakari — the custom order page (/preview/reynir/panta).
 *
 * Split out of the homepage on purpose. The configurator is a TOOL and the
 * homepage is a shopfront: a 2.700px stateful form dropped between the cakes
 * and the visit strip broke the page's story, and browsing and ordering are
 * different mindsets. This route carries only what the task needs, no hero,
 * no gallery, no history.
 *
 * Deep link: /preview/reynir/panta?vara=terta preselects a product, so the
 * choice made on the homepage teaser is not asked for twice.
 */

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Chrome from './Chrome'
import { HOME_PATH } from './paths'
import { setThemeColor } from '../../lib/preview'
import { LOGO, T } from './data'
import { ORDER_T } from './order'
import OrderSection from './OrderSection'
import { useLang } from './useLang'
import { BODY, DIM, EASE, FAINT, GOLD, GOLD_LIGHT, HAIR_SOFT, INK, INK_DEEP, IVORY } from './tokens'
import { SiteContentProvider, useSiteContent } from './sanity'


const PAGE_CSS = `
  /* Safari 26 tints its chrome from body's background-color (theme-color is
     ignored since Liquid Glass) — without this the status-bar strip is WHITE
     on this ink-dark page. See [[ios-safe-area-chrome-color]]. */
  html, body { background-color:${INK_DEEP}; }
  .rb-op ::selection { background:#5C1C1F; color:${IVORY}; }
  .rb-op a:focus-visible, .rb-op button:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px; }

  .rb-op-bar { display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding:18px clamp(20px,4.5vw,72px); border-bottom:1px solid ${HAIR_SOFT}; }
  .rb-op-back { display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    font-family:${BODY}; font-size:14px; color:${DIM}; padding:11px 0;
    transition:color .2s ${EASE}; }
  .rb-op-back:hover { color:${GOLD_LIGHT}; }
  .rb-op-lang { background:none; border:none; cursor:pointer; padding:14px 13px; margin:-14px -13px;
    font-family:${BODY}; font-size:13px; letter-spacing:.08em; color:${FAINT};
    transition:color .2s ${EASE}; border-radius:4px; }
  .rb-op-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .rb-op-lang:hover { color:${IVORY}; }

  .rb-op-foot { border-top:1px solid ${HAIR_SOFT}; padding:36px clamp(20px,4.5vw,72px) 56px;
    background:${INK}; }
  .rb-op-foot-grid { max-width:1180px; margin:0 auto; display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:26px; }
  .rb-op-foot-label { font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
    color:${GOLD}; }
  .rb-op-foot-body { font-size:14px; color:${DIM}; line-height:1.65; margin:9px 0 0; }
  .rb-op-foot-body a { color:${GOLD_LIGHT}; text-decoration:none; }
  .rb-op-foot-body a:hover { color:${IVORY}; }

  @media (max-width:520px) {
    .rb-op-bar { padding:14px clamp(20px,4.5vw,72px); }
    .rb-op-bar img { width:104px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-op-back, .rb-op-lang { transition:none; }
  }
`

function ReynirOrderPageInner() {
  const [lang, setLang] = useLang()
  const t = T[lang]
  const ot = ORDER_T[lang]
  const { LINKS, hoursRows, mainName } = useSiteContent()
  const [params] = useSearchParams()
  const preselect = params.get('vara') ?? undefined

  useEffect(() => {
    setThemeColor(INK_DEEP)
  }, [])

  return (
    <div
      className="rb-op"
      lang={lang}
      style={{ fontFamily: BODY, color: IVORY, background: INK_DEEP, minHeight: '100svh', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}
    >
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <header className="rb-op-bar">
        <Link to={HOME_PATH} aria-label={ot.backToSite}>
          <img src={LOGO} alt="Reynir bakari" width={124} height={54} decoding="async" style={{ width: 124, height: 'auto', display: 'block' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Link to={HOME_PATH} className="rb-op-back">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
              <path d="M5.5 1L1 5.5L5.5 10M1 5.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {ot.backToSite}
          </Link>
          <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
            <button className="rb-op-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
            <button className="rb-op-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
          </div>
        </div>
      </header>

      <OrderSection lang={lang} standalone initialProductId={preselect} />

      {/* only what supports the task: where to collect, and a human to call */}
      <footer className="rb-op-foot">
        <div className="rb-op-foot-grid">
          <div>
            <div className="rb-op-foot-label">{t.mainLabel}</div>
            <p className="rb-op-foot-body">
              {mainName}
              <br />
              {hoursRows[lang].map((r) => `${r.label} ${r.value}`).join(' · ')}
            </p>
          </div>
          <div>
            <div className="rb-op-foot-label">{t.rowPhone}</div>
            <p className="rb-op-foot-body">
              <a href={`tel:${LINKS.phone}`}>{LINKS.phoneLabel}</a>
              <br />
              <a href={`mailto:${LINKS.orderEmail}`}>{LINKS.orderEmail}</a>
            </p>
          </div>
        </div>
      </footer>

      <Chrome />
    </div>
  )
}

export default function ReynirOrderPage() {
  return (
    <SiteContentProvider>
      <ReynirOrderPageInner />
    </SiteContentProvider>
  )
}
