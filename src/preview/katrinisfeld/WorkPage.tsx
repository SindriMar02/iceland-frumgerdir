/**
 * /verkefni and the three category pages.
 *
 * The old build showed seventeen photographs on the home page and nothing
 * else; there was no page in existence for "hönnun gistiheimila" or
 * "skrifstofuhönnun" to rank for, and no page at all for any individual
 * project. These are those pages. The category pages carry real introductory
 * copy rather than a filtered grid with a heading, because a grid with a
 * heading is not a page a search engine has any reason to return.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Photo } from './kit'
import { CATEGORIES, PROJECTS, byCategory, hasPage, type CategorySlug } from './projects'
import { category as catPath, project as projPath, WORK, CONTACT_PATH } from './paths'

const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw'
const ORDER: CategorySlug[] = ['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi']

function Card({ slug, title, cat }: { slug: string; title: string; cat?: string }) {
  const p = PROJECTS.find((x) => x.slug === slug)!
  return (
    <li className="ki-card ki-rv">
      <figure className="ki-card-fig">
        <Photo id={p.photos[0].id} alt={p.photos[0].alt} sizes={CARD_SIZES} />
      </figure>
      <div className="ki-card-meta">
        <span className="ki-card-name"><Link to={projPath(p.slug)}>{title}</Link></span>
        {cat && <span className="ki-card-cat">{cat}</span>}
      </div>
    </li>
  )
}

/** The complete register: every project she publishes, linked where a page exists. */
function Register() {
  return (
    <div className="ki-wrap" data-ki-band="dark">
      <Headline text="Skráin öll." size={72} floor={32} />
      <p className="ki-body ki-rv">
        Verkefnaskráin í heild, {PROJECTS.length} verk í {Object.keys(CATEGORIES).length} flokkum.
        Þau sem eru ljósmynduð hafa sína eigin síðu.
      </p>
      <div style={{ marginTop: 'calc(var(--u) * 40)' }}>
        {(Object.keys(CATEGORIES) as CategorySlug[]).map((c) => {
          const items = byCategory(c)
          return (
            <div key={c} className="ki-skra-flokkur ki-rv">
              <div className="ki-skra-cat-row">
                <h2 className="ki-skra-cat">{CATEGORIES[c].nav}</h2>
                <span className="ki-skra-cat-n" aria-hidden="true">{String(items.length).padStart(2, '0')}</span>
              </div>
              <ul className="ki-skra-list">
                {items.map((p) => (
                  <li key={p.slug} className="ki-skra-row">
                    {hasPage(p) ? <Link to={projPath(p.slug)}>{p.title}</Link> : <span>{p.title}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function WorkIndexPage() {
  const head: Head = {
    title: `Verkefni · ${PROJECTS.length} innanhússverkefni | Katrín Ísfeld innanhússarkitekt`,
    desc:
      `Verkefnaskrá Katrínar Ísfeld innanhússarkitekts: ${PROJECTS.length} verk í fjórum flokkum. Heimili og sumarhús, gistiheimili og hótel, skrifstofur og heilbrigðisrými, allt ljósmyndað.`,
    clean: '/verkefni',
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Verkefni</p>
        <Headline as="h1" text="Verkefnin, öll saman." size={86} floor={34} />
        <p className="ki-lead ki-rv">
          {PROJECTS.length} verk í fjórum flokkum, frá einu baðherbergi upp í heilt hótel.
        </p>
      </section>

      <div className="ki-wrap" data-ki-band="light">
        {ORDER.map((c) => {
          const items = byCategory(c).filter(hasPage)
          if (!items.length) return null
          return (
            <div key={c} className="ki-cluster">
              <p className="ki-cat-head ki-rv">
                {CATEGORIES[c].nav}
                <span className="ki-cat-head-n">{byCategory(c).length} verk</span>
                <Link to={catPath(c)}>Sjá flokkinn</Link>
              </p>
              <ul className="ki-grid">
                {items.map((p) => <Card key={p.slug} slug={p.slug} title={p.title} />)}
              </ul>
            </div>
          )
        })}
      </div>

      <Register />
    </Shell>
  )
}

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const c = CATEGORIES[slug]
  const items = byCategory(slug)
  const shown = items.filter(hasPage)
  const head: Head = {
    title: `${c.title} | Katrín Ísfeld innanhússarkitekt`,
    desc: `${c.lead} ${items.length} verk eftir Katrínu Ísfeld innanhússarkitekt í Reykjavík.`,
    clean: `/verkefni/${slug}`,
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs">
          <Link to="/">Forsíða</Link><span>·</span><Link to={WORK}>Verkefni</Link><span>·</span>{c.nav}
        </p>
        <Headline as="h1" text={c.title} size={80} floor={32} />
        <p className="ki-lead ki-rv">{c.lead}</p>
        <p className="ki-body ki-rv">{c.body}</p>
      </section>

      <div className="ki-wrap" data-ki-band="light">
        <ul className="ki-grid">
          {shown.map((p) => <Card key={p.slug} slug={p.slug} title={p.title} />)}
        </ul>
        {items.length > shown.length && (
          <p className="ki-stat ki-rv">
            Auk þess í skránni: {items.filter((p) => !hasPage(p)).map((p) => p.title).join(', ')}.
          </p>
        )}
      </div>

      <div className="ki-wrap-tight" data-ki-band="dark">
        <Headline text="Ertu með rými af þessu tagi?" size={56} floor={28} measure={720} />
        <p className="ki-body ki-rv">
          Sendu stutta verklýsingu. Katrín kemur á staðinn, tekur verkefnið út og gerir tilboð í það.
        </p>
        <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={CONTACT_PATH}>Hafa samband</Link></p>
      </div>
    </Shell>
  )
}
