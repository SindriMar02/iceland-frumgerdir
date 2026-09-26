import { Check } from 'lucide-react'
import { IMG, DIRECTIONS, PHONE_HREF, EMAIL_HREF } from './data'
import { PageHero, Photo, Title } from './shell'
import { useSite } from './site'

/* /tjaldsvaedi and /en/campsite. People search "bjarkalundur camping /
   campsite / tjaldsvæði" by name (Google Suggest, 2026-09-26), and a term
   ranks only on a page whose subject it is ([[icelandic-search-vocabulary-gap]]).
   Every fact is the hotel's own (old site /campsite, prices and facilities). */

export const CAMPSITE_CSS = `
.bj3 .camp{padding:clamp(72px,9vw,140px) 0 var(--sec)}
.bj3 .camp .grid{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(32px,6vw,110px);align-items:start}
.bj3 .camp .text{display:grid;gap:22px}
.bj3 .camp .t-h2s{font-size:clamp(2.3rem,4vw,3.9rem)}
.bj3 .camp .card{background:var(--paper);border-radius:var(--r);padding:clamp(22px,2.6vw,36px);display:grid;gap:22px;position:sticky;top:110px}
.bj3 .camp .card h2{font-family:var(--serif);font-weight:300;font-size:1.7rem}
.bj3 .camp .prices{display:grid;grid-template-columns:1fr auto;gap:12px 24px;margin:0;font-size:1.02rem}
.bj3 .camp .prices dt{color:var(--text)}
.bj3 .camp .prices dd{margin:0;font-family:var(--serif);font-weight:300;font-size:1.3rem;font-variant-numeric:tabular-nums;text-align:right}
.bj3 .camp ul.fac{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.bj3 .camp ul.fac li{display:flex;gap:12px;align-items:flex-start;color:var(--text)}
.bj3 .camp ul.fac svg{flex:none;margin-top:4px;color:var(--band)}
.bj3 .camp .pics{display:grid;grid-template-columns:1fr 1fr;gap:clamp(10px,1.4vw,18px);margin-top:clamp(48px,6vw,88px)}
.bj3 .camp .pics .pic{border-radius:var(--r)}
.bj3 .camp .ctas{display:flex;flex-wrap:wrap;gap:12px}
@media (max-width:899px){.bj3 .camp .grid{grid-template-columns:1fr}.bj3 .camp .card{position:static}.bj3 .camp .pics{grid-template-columns:1fr}}
`

export function Campsite() {
  const { t } = useSite()
  const c = t.campsite
  return (
    <>
      <PageHero pic={IMG.campTables} title={c.title} sub={c.sub} id="bj3-camp-h1" />
      <div className="over">
        <section className="camp" data-anchor="campsite" aria-labelledby="bj3-camp-intro">
          <div className="wrap">
            <div className="grid">
              <div className="text">
                <p className="eyebrow rv-up">{c.eyebrow}</p>
                <Title id="bj3-camp-intro" text={c.introTitle} className="t-h2 t-h2s" stagger />
                {c.body.map((p) => <p key={p} className="body rv-up">{p}</p>)}
                <h2 className="t-h3 rv-up" style={{ marginTop: 18 }}>{c.facilitiesTitle}</h2>
                <ul className="fac rv-stagger">
                  {c.facilities.map((f) => <li key={f}><Check size={16} strokeWidth={1.6} aria-hidden="true" />{f}</li>)}
                </ul>
              </div>
              <aside className="card rv-up" aria-labelledby="bj3-camp-prices">
                <h2 id="bj3-camp-prices">{c.pricesTitle}</h2>
                <dl className="prices">{c.prices.map((r) => <PriceRow key={r.k} k={r.k} v={r.v} />)}</dl>
                <p className="small mute">{c.season}</p>
                <p className="small">{c.questions}</p>
                <div className="ctas">
                  <a className="pill pill-solid" href={PHONE_HREF}>{t.ui.call}</a>
                  <a className="pill pill-ink" href={EMAIL_HREF}>{t.ui.email}</a>
                  <a className="pill pill-ink" href={DIRECTIONS} target="_blank" rel="noopener">{t.ui.directions}</a>
                </div>
              </aside>
            </div>
            <div className="pics">
              <Photo pic={IMG.campGrass} sizes="(max-width: 899px) 92vw, 46vw" ratio="4 / 3" className="rv-settle" />
              <Photo pic={IMG.lake} sizes="(max-width: 899px) 92vw, 46vw" ratio="4 / 3" className="rv-settle" />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function PriceRow({ k, v }: { k: string; v: string }) {
  return <><dt>{k}</dt><dd>{v}</dd></>
}
