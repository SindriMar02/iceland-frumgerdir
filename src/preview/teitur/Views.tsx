import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AGENTS, PATHS, QUEUE } from './data'
import type { Lang, Status } from './data'

/* Two static designs, kept apart from the public page because they are the second half of the value:
   the agency route (an organiser saved once, many requests, one status each) and the staff queue. Nothing here runs:
   no accounts, no backend, every row is labelled sample data. */

export function AgentsView({ lang }: { lang: Lang }) {
  const a = AGENTS[lang]
  const [tab, setTab] = useState(0)
  return (
    <div className="tj-page tj-sheet">
      <div className="tj-wrap tj-page__head">
        <p className="tj-eyebrow tj-eyebrow--dark" data-reveal="fade">{a.eyebrow}</p>
        <h1 className="tj-h1 tj-h1--page" data-lines>{a.h1}</h1>
        <p className="tj-lead" data-reveal="fade">{a.lead}</p>
        <p className="tj-samplebar" data-reveal="fade">{a.sample}</p>
      </div>
      <div className="tj-wrap tj-agents">
        <div className="tj-agents__stage">
          <div className="tj-tabs" role="tablist" aria-label={a.h1}>
            {a.tabs.map((l, i) => (
              <button key={l} type="button" role="tab" aria-selected={tab === i} className={`tj-tab${tab === i ? ' is-on' : ''}`} onClick={() => setTab(i)}>{l}</button>
            ))}
          </div>
          {tab === 0 ? (
            <form className="tj-panel" onSubmit={(e) => e.preventDefault()} aria-label={a.login.h}>
              <h2 className="tj-panel__h">{a.login.h}</h2>
              <div className="tj-field"><label className="tj-field__label" htmlFor="tj-a-mail">{a.login.email}</label><input id="tj-a-mail" className="tj-input" type="email" disabled placeholder="skipuleggjandi@example.is" /></div>
              <div className="tj-field"><label className="tj-field__label" htmlFor="tj-a-pw">{a.login.pw}</label><input id="tj-a-pw" className="tj-input" type="password" disabled placeholder="••••••••" /></div>
              <button type="submit" className="tj-btn tj-btn--dark tj-btn--block" disabled>{a.login.btn}</button>
              <p className="tj-fine">{a.login.disabled}</p>
              <p className="tj-panel__links"><span>{a.login.forgot}</span><span>{a.login.request}</span></p>
            </form>
          ) : (
            <div className="tj-panel tj-panel--in" role="tabpanel">
              <div className="tj-panel__top">
                <div><h2 className="tj-panel__h">{a.inn.h}</h2><p className="tj-fine">{a.inn.org}</p></div>
                <span className="tj-pill tj-pill--done">{a.inn.saved}</span>
              </div>
              <dl className="tj-sum">{a.inn.fields.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <h3 className="tj-panel__sub">{a.inn.listHead}</h3>
              <ul className="tj-rows">{a.inn.rows.map(([k, s]) => <li key={k}><span>{k}</span><em>{s}</em></li>)}</ul>
              <Link className="tj-btn tj-btn--orange" to={PATHS[lang].request}>{a.inn.newReq}</Link>
              <p className="tj-fine">{a.sample}</p>
            </div>
          )}
        </div>
        <ol className="tj-agents__points">
          {a.points.map(([h, p], i) => (
            <li key={h}><span aria-hidden="true">0{i + 1}</span><h3>{h}</h3><p>{p}</p></li>
          ))}
        </ol>
      </div>
      <div className="tj-wrap tj-page__links">
        <Link className="tj-link" to={PATHS[lang].dashboard}>{a.dash}</Link>
        <Link className="tj-link" to={PATHS[lang].home}>{a.back}</Link>
      </div>
    </div>
  )
}

export function DashboardView({ lang }: { lang: Lang }) {
  const q = QUEUE[lang]
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [sel, setSel] = useState<string>(q.rows[0].id)
  const rows = q.rows.filter((r) => filter === 'all' || r.status === filter)
  const cur = q.rows.find((r) => r.id === sel)
  return (
    <div className="tj-page tj-sheet">
      <div className="tj-wrap tj-page__head">
        <p className="tj-eyebrow tj-eyebrow--dark" data-reveal="fade">{q.eyebrow}</p>
        <h1 className="tj-h1 tj-h1--page" data-lines>{q.h1}</h1>
        <p className="tj-lead" data-reveal="fade">{q.lead}</p>
        <p className="tj-samplebar" data-reveal="fade">{q.sample}</p>
      </div>
      <div className="tj-wrap tj-queue">
        <div className="tj-queue__main">
          <div className="tj-filters" role="group" aria-label={q.h1}>
            {(['all', 'new', 'work', 'wait', 'done'] as const).map((k) => (
              <button key={k} type="button" className={`tj-filter${filter === k ? ' is-on' : ''}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{q.filters[k]}</button>
            ))}
          </div>
          <table className="tj-table">
            <caption className="tj-sr">{q.h1}: {q.sample}</caption>
            <thead>
              <tr>{(['id', 'group', 'trip', 'date', 'pax', 'src', 'owner', 'status'] as const).map((c) => <th key={c} scope="col">{q.cols[c]}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={sel === r.id ? 'is-on' : ''}>
                  <td data-l={q.cols.id}><button type="button" className="tj-link" aria-pressed={sel === r.id} onClick={() => setSel(r.id)}>{r.id}</button></td>
                  <td data-l={q.cols.group}>{r.group}</td>
                  <td data-l={q.cols.trip}>{r.trip}</td>
                  <td data-l={q.cols.date}>{r.date}</td>
                  <td data-l={q.cols.pax}>{r.pax}</td>
                  <td data-l={q.cols.src}>{q.src[r.src]}</td>
                  <td data-l={q.cols.owner}>{r.owner}</td>
                  <td data-l={q.cols.status}><span className={`tj-pill tj-pill--${r.status}`}>{q.status[r.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="tj-queue__detail" aria-live="polite">
          {cur ? (
            <>
              <p className="tj-eyebrow tj-eyebrow--dark">{q.detail.h} {cur.id}</p>
              <h2 className="tj-panel__h">{cur.group}</h2>
              <dl className="tj-sum">
                <div><dt>{q.cols.trip}</dt><dd>{cur.trip}</dd></div>
                <div><dt>{q.cols.date}</dt><dd>{cur.date}</dd></div>
                <div><dt>{q.cols.pax}</dt><dd>{cur.pax}</dd></div>
                <div><dt>{q.cols.owner}</dt><dd>{cur.owner}</dd></div>
                <div><dt>{q.cols.status}</dt><dd><span className={`tj-pill tj-pill--${cur.status}`}>{q.status[cur.status]}</span></dd></div>
                <div><dt>{q.detail.notes}</dt><dd>{cur.note}</dd></div>
              </dl>
              {cur.src === 'agent' ? <p className="tj-fine">{q.detail.organiser}: {q.detail.reuse}</p> : null}
            </>
          ) : <p className="tj-fine">{q.detail.none}</p>}
        </aside>
      </div>
      <div className="tj-wrap tj-page__links">
        <Link className="tj-link" to={PATHS[lang].agents}>{q.agents}</Link>
        <Link className="tj-link" to={PATHS[lang].home}>{q.back}</Link>
      </div>
    </div>
  )
}
