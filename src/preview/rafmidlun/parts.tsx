import { Link } from 'react-router-dom'
import { LineSvg } from './Art'
import { PARTNERS, STAGES, telHref, type Person, type Service } from './data'
import { Arrow, to } from './ui'

/* Pieces shared by the home page and the inner pages. */

/** the drawing of one station, standing in where no honest photo exists */
export const StationArt = ({ stage, label }: { stage: number; label?: string }) => (
  <figure className="rm-tile rm-tile--art"><LineSvg active={stage} view={stage} form={stage + 1} label={label} /></figure>
)

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="rm-scard" data-svc={s.slug}>
      <Link className="rm-scard__media" to={to(`/thjonusta/${s.slug}`)} tabIndex={-1} aria-hidden="true">
        <StationArt stage={s.art} />
      </Link>
      <div className="rm-scard__body">
        <p className="mono rm-scard__n">{STAGES[s.art].n} {STAGES[s.art].name}</p>
        <h3><Link to={to(`/thjonusta/${s.slug}`)}>{s.name}</Link></h3>
        <p className="rm-scard__blurb">{s.blurb}</p>
        <Link className="rm-textlink" to={to(`/thjonusta/${s.slug}`)} aria-hidden="true" tabIndex={-1}>Nánar <Arrow /></Link>
      </div>
    </article>
  )
}

/** the four things a request needs */
export function ReadyList({ items }: { items: { k: string; v: string }[] }) {
  return (
    <ol className="rm-ready">
      {items.map((r, i) => (
        <li key={r.k}><span className="mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{r.k}</strong><p>{r.v}</p></div></li>
      ))}
    </ol>
  )
}

/** one person from their staff list, with the links their list gives */
export function PersonCard({ p }: { p: Person }) {
  return (
    <li className="rm-person">
      <p className="rm-person__name">{p.name}</p>
      <p className="rm-person__role">{p.role}</p>
      <div className="rm-person__reach">
        {p.tel && <a href={telHref(p.tel)}>{p.tel}</a>}
        {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
      </div>
    </li>
  )
}

/** the five logos from their front page */
export function Partners({ className = '' }: { className?: string }) {
  return (
    <ul className={`rm-partners ${className}`} aria-label="Merki á vef Rafmiðlunar">
      {PARTNERS.map((p) => (
        <li key={p.alt}><img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" /></li>
      ))}
    </ul>
  )
}
