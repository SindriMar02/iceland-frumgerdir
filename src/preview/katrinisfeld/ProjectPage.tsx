/**
 * One project, one page — the long tail this site did not have.
 *
 * Seventeen of these exist, one per photographed project, and each is the
 * only page on the Icelandic web that is actually ABOUT "Tannlæknastofan
 * Garðatorgi" or "Old Charm Reykjavik Apartment". That is the whole point:
 * her projects have names, people search those names, and until now every
 * one of them resolved to a WordPress page whose photographs were CSS
 * background-images and therefore indexed as nothing at all.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Photo, Slide } from './kit'
import { CATEGORIES, PROJECTS, hasPage, type Project } from './projects'
import { category as catPath, project as projPath, WORK, CONTACT_PATH } from './paths'

const HERO_SIZES = '100vw'
const GAL_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 90vw, 46vw'

/** Neighbours within the same category, so "next" stays relevant. */
function neighbours(p: Project) {
  const sibs = PROJECTS.filter((x) => x.category === p.category && hasPage(x))
  const i = sibs.findIndex((x) => x.slug === p.slug)
  return { prev: i > 0 ? sibs[i - 1] : null, next: i < sibs.length - 1 ? sibs[i + 1] : null }
}

export function ProjectPage({ slug }: { slug: string }) {
  const p = PROJECTS.find((x) => x.slug === slug)!
  const c = CATEGORIES[p.category]
  const { prev, next } = neighbours(p)
  const hero = p.photos[0]
  const rest = p.photos.slice(1)

  const head: Head = {
    title: `${p.title} | ${c.nav} | Katrín Ísfeld innanhússarkitekt`,
    desc: `${p.lead} ${p.body[0] ? p.body[0].slice(0, 110).trim() + '…' : ''} Innanhússhönnun eftir Katrínu Ísfeld.`.trim(),
    clean: `/verkefni/${p.slug}`,
  }

  return (
    <Shell head={head}>
      {/* Arrival: the hero holds still while the first section rises over it.
          The pin is bounded by this wrapper — once the text has covered the
          photograph the hero releases, so nothing stays composited down the
          rest of the page. */}
      <div className="ki-proj-arrival">
        <section className="ki-proj-hero" data-ki-band="dark">
          <Photo id={hero.id} alt={hero.alt} sizes={HERO_SIZES} priority />
        </section>

        <div className="ki-wrap ki-proj-cover" data-ki-band="light">
          <p className="ki-crumbs">
            <Link to="/">Forsíða</Link><span>·</span>
            <Link to={WORK}>Verkefni</Link><span>·</span>
            <Link to={catPath(p.category)}>{c.nav}</Link>
          </p>
          <div className="ki-proj-body">
            <div>
              <Headline as="h1" text={p.title} size={62} floor={30} />
              <p className="ki-lead">{p.lead}</p>
              {p.facts && (
                <dl className="ki-facts ki-rv">
                  {p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
              )}
            </div>
            <div>
              {p.body.map((t, i) => <p key={i} className="ki-body ki-rv">{t}</p>)}
            </div>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
          <div className="ki-proj-gallery">
            {rest.map((ph, i) => (
              <Slide
                key={ph.id}
                id={ph.id}
                alt={ph.alt}
                sizes={GAL_SIZES}
                variant={i === 0 ? 'shutter' : 'slide'}
              />
            ))}
          </div>
        </div>
      )}

      <div className="ki-wrap-tight" data-ki-band="light" style={{ paddingTop: 0 }}>
        <nav className="ki-nextprev" aria-label="Fleiri verkefni">
          {prev ? (
            <Link to={projPath(prev.slug)}><small>Fyrra verk</small>{prev.title}</Link>
          ) : <span />}
          {next && <Link to={projPath(next.slug)} style={{ textAlign: 'right' }}><small>Næsta verk</small>{next.title}</Link>}
        </nav>
      </div>

      <div className="ki-wrap-tight" data-ki-band="dark">
        <Headline text="Segðu Katrínu frá rýminu þínu." size={58} floor={28} measure={760} />
        <p className="ki-body ki-rv">
          Það er ekkert verk of stórt eða lítið. Katrín kemur á staðinn, tekur verkefnið út
          í samráði við eigendur og gerir í framhaldi tilboð í verkið.
        </p>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={CONTACT_PATH}>Hafa samband</Link>
          <Link className="ki-cta" to={catPath(p.category)}>Fleiri verk í þessum flokki</Link>
        </p>
      </div>
    </Shell>
  )
}
