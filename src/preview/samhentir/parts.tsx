import { Link } from 'react-router-dom'
import { LineSvg } from './Art'
import { STAGES, memberById, type Family, type Model, type Photo } from './data'
import { useList, type ListItem } from './store'
import { Arrow, to } from './ui'

/* Pieces shared by the home page, the machine pages and the industry pages. */

export function Tile({ photo, className = '', priority = false, sizes = '(max-width: 767px) 92vw, 46vw' }: { photo: Photo; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <figure className={`sh-tile sh-tile--${photo.tone} ${className}`} style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
      <img
        src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? sizes : undefined}
        alt={photo.alt} width={photo.w} height={photo.h}
        loading={priority ? 'eager' : 'lazy'} decoding="async"
      />
    </figure>
  )
}

export const familyItem = (f: Family): ListItem => ({ id: f.slug, label: f.name, kind: 'family', href: to(`/velar/${f.slug}`) })

export function AddButton({ item, className = '' }: { item: ListItem; className?: string }) {
  const list = useList()
  const on = list.has(item.id)
  return (
    <button
      type="button"
      className={`sh-add${on ? ' is-on' : ''} ${className}`}
      aria-pressed={on}
      onClick={() => list.toggle(item)}
    >
      <span className="sh-add__box" aria-hidden="true">{on ? '✓' : '+'}</span>
      <span>{on ? 'Á fyrirspurnalista' : 'Bæta á fyrirspurnalista'}<span className="sh-sr"> {item.label}</span></span>
    </button>
  )
}

/** the drawing of one station, standing in where no honest photo exists */
export const StationArt = ({ stage, label }: { stage: number; label?: string }) => (
  <figure className="sh-tile sh-tile--art"><LineSvg active={stage} view={stage} form={stage + 1} label={label} /></figure>
)

export function FamilyCard({ f }: { f: Family }) {
  const stage = STAGES[f.stage]
  const lead = f.models.find((m) => m.img)
  const unit = memberById(f.unit)!
  return (
    <article className="sh-fam" data-fam={f.slug}>
      <Link className="sh-fam__media" to={to(`/velar/${f.slug}`)} tabIndex={-1} aria-hidden="true">
        {lead ? <figure className="sh-tile sh-tile--model"><img src={lead.img} alt="" width="600" height="600" loading="lazy" decoding="async" /></figure> : <StationArt stage={f.stage} />}
      </Link>
      <div className="sh-fam__body">
        <p className="mono sh-fam__stage">{stage.n} {stage.name}</p>
        <h3><Link to={to(`/velar/${f.slug}`)}>{f.name}</Link></h3>
        <p className="sh-fam__blurb">{f.blurb}</p>
        <p className="mono sh-fam__sup">{f.models.length ? `${f.models.length} gerðir · ` : ''}{unit.name}</p>
        <div className="sh-fam__act">
          <Link className="sh-textlink" to={to(`/velar/${f.slug}`)}>Skoða <Arrow /></Link>
          <AddButton item={familyItem(f)} />
        </div>
      </div>
    </article>
  )
}

/** one model from the catalogue: picture and name, and it can go on the list */
export function ModelCard({ m, family }: { m: Model; family: Family }) {
  const list = useList()
  const id = `${family.slug}:${m.name}`
  const on = list.has(id)
  return (
    <li className="sh-model">
      {m.img && <figure className="sh-tile sh-tile--model"><img src={m.img} alt={`${m.name}, ${family.name.toLowerCase()}`} width="600" height="600" loading="lazy" decoding="async" /></figure>}
      <div className="sh-model__row">
        <span className="sh-model__name">{m.name}</span>
        <button type="button" className={`sh-add sh-add--small${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => list.toggle({ id, label: m.name, kind: 'model', href: to(`/velar/${family.slug}`) })}>
          <span className="sh-add__box" aria-hidden="true">{on ? '✓' : '+'}</span><span className="sh-sr">{on ? `Taka ${m.name} af fyrirspurnalista` : `Bæta ${m.name} á fyrirspurnalista`}</span>
        </button>
      </div>
    </li>
  )
}

/** the four things a request needs */
export function ReadyList({ items }: { items: { k: string; v: string }[] }) {
  return (
    <ol className="sh-ready">
      {items.map((r, i) => (
        <li key={r.k}><span className="mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{r.k}</strong><p>{r.v}</p></div></li>
      ))}
    </ol>
  )
}

/** which companies in the group are on a step or serve an industry */
export function Who({ ids, className = '' }: { ids: string[]; className?: string }) {
  return (
    <ul className={`sh-who ${className}`} aria-label="Fyrirtæki í samstæðunni">
      {ids.map((id) => { const m = memberById(id)!; return <li key={id}>{m.name}</li> })}
    </ul>
  )
}
