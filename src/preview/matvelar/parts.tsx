import { Link } from 'react-router-dom'
import { LineSvg } from './Art'
import { FAMILIES, SUPPLIERS, STAGES, type Family, type Photo, type Supplier } from './data'
import { useList, type ListItem } from './store'
import { Arrow, to } from './ui'

/* Pieces shared by the home page, the machine pages and the family pages. */

export function Tile({ photo, className = '', priority = false }: { photo: Photo; className?: string; priority?: boolean }) {
  return (
    <figure className={`mv-tile mv-tile--${photo.tone} ${className}`} style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
      <img
        src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? '(max-width: 767px) 92vw, 46vw' : undefined}
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
      className={`mv-add${on ? ' is-on' : ''} ${className}`}
      aria-pressed={on}
      onClick={() => list.toggle(item)}
    >
      <span className="mv-add__box" aria-hidden="true">{on ? '✓' : '+'}</span>
      <span>{on ? 'Á fyrirspurnalista' : 'Bæta á fyrirspurnalista'}<span className="mv-sr"> {item.label}</span></span>
    </button>
  )
}

export function FamilyCard({ f }: { f: Family }) {
  const sup = f.suppliers.map((id) => SUPPLIERS.find((s) => s.id === id)!.name)
  const stage = STAGES[f.stage]
  return (
    <article className="mv-fam" data-fam={f.slug}>
      <Link className="mv-fam__media" to={to(`/velar/${f.slug}`)} tabIndex={-1} aria-hidden="true">
        {f.photo ? <Tile photo={f.photo} /> : <figure className="mv-tile mv-tile--white mv-fam__art"><LineSvg active={f.stage} view={f.stage} form={f.stage + 1} /></figure>}
      </Link>
      <div className="mv-fam__body">
        <p className="mono mv-fam__stage">{stage.n} {stage.name}</p>
        <h3><Link to={to(`/velar/${f.slug}`)}>{f.name}</Link></h3>
        <p className="mv-fam__blurb">{f.blurb}</p>
        <p className="mono mv-fam__sup">{sup.join(' · ')}</p>
        <div className="mv-fam__act">
          <Link className="mv-textlink" to={to(`/velar/${f.slug}`)}>Skoða <Arrow /></Link>
          <AddButton item={familyItem(f)} />
        </div>
      </div>
    </article>
  )
}

export function SupplierCard({ s }: { s: Supplier }) {
  const fams = s.families.map((id) => FAMILIES.find((f) => f.slug === id)!)
  return (
    <article className="mv-sup" id={`birgi-${s.id}`}>
      <div className={`mv-sup__media${s.photos.length > 1 ? ' is-strip' : ''}`}>
        {s.photos.map((p, i) => <Tile key={i} photo={p} />)}
      </div>
      <div className="mv-sup__body">
        <div className="mv-sup__logo"><img src={s.logo} alt={s.logoAlt} loading="lazy" decoding="async" /></div>
        <p className="mono">{s.tag}</p>
        <p className="mv-sup__text">{s.text}</p>
        {fams.length > 0 && (
          <ul className="mv-sup__fam" aria-label={`Vélar frá ${s.name}`}>
            {fams.map((f) => <li key={f.slug}><Link to={to(`/velar/${f.slug}`)}>{f.name}</Link></li>)}
          </ul>
        )}
        <a className="mv-textlink" href={s.url} target="_blank" rel="noopener noreferrer">Nánar hjá {s.name} <Arrow /><span className="mv-sr"> (opnast í nýjum glugga)</span></a>
      </div>
    </article>
  )
}

/** the four things a service request needs */
export function ReadyList({ items }: { items: { k: string; v: string }[] }) {
  return (
    <ol className="mv-ready">
      {items.map((r, i) => (
        <li key={r.k}><span className="mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{r.k}</strong><p>{r.v}</p></div></li>
      ))}
    </ol>
  )
}
