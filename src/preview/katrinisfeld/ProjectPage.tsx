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
import { Link } from './link'
import { RollText } from './flair'
import { Shell, type Head } from './Shell'
import { Headline, Photo, Slide } from './kit'
import { PHOTO_DIMS } from './photo-dims'
import { CATEGORIES, PROJECTS, hasPage, type Project } from './projects'
import { category as catPath, project as projPath, WORK, CONTACT_PATH } from './paths'

const HERO_SIZES = '100vw'
const GAL_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 90vw, 46vw'

/**
 * The gallery's rhythm: the first shot full width, then pairs, with every
 * fourth returning to full width — and never a half-width photograph left
 * alone at the end of the page. A lone half is promoted to full width, so the
 * last thing on the page is a room, not a gap.
 */
function widths(ids: ReadonlyArray<string>): boolean[] {
  const n = ids.length
  /* a photograph under 1200px wide is never stretched across the page — at
     1440 that was Hótel Hekla's 662px source upscaled twice over */
  const big = (i: number) => (PHOTO_DIMS[ids[i]]?.w ?? 0) >= 1200
  const w = Array.from({ length: n }, (_, i) => (i === 0 || (i > 1 && (i - 1) % 4 === 0)) && big(i))
  let slot = 0
  for (let i = 0; i < n; i++) {
    if (w[i]) { slot = 0; continue }
    if (i === n - 1 && slot === 0 && big(i)) w[i] = true
    slot = slot ? 0 : 1
  }
  return w
}

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

      {/* THE GALLERY HAS A RHYTHM NOW, because her projects have one. Every
          photograph the same width reads as a contact sheet: eight equal
          rectangles and no indication which of them is the room and which is
          the door handle. The first shot after the hero runs full width, and
          the supporting ones sit two to a row at half the size — with every
          fourth returning to full width so the page breathes instead of
          becoming a ladder. The order in projects.ts is the edit: lead
          photograph first, details last. */}
      {rest.length > 0 && (
        <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
          <div className="ki-proj-gallery">
            {widths(rest.map((r) => r.id)).map((wide, i) => {
              const ph = rest[i]
              return (
                <div key={ph.id} className={wide ? 'ki-gal-wide' : 'ki-gal-half'}>
                  <Slide
                    id={ph.id}
                    alt={ph.alt}
                    sizes={wide ? GAL_SIZES : '(max-width: 860px) 92vw, 44vw'}
                    variant={i === 0 ? 'shutter' : 'slide'}
                  />
                </div>
              )
            })}
          </div>
          {p.credit && (
            <p className="ki-proj-credit ki-rv">Ljósmyndari: {p.credit}</p>
          )}
        </div>
      )}

      {/* the neighbours, as rooms rather than as two lines of type: a page
          about one project ends by opening the door to the next */}
      {(prev || next) && (
        <div className="ki-wrap-tight" data-ki-band="light" style={{ paddingTop: 0 }}>
          <nav className="ki-proj-adj" aria-label="Fleiri verkefni">
            {[
              prev && { p: prev, k: 'Fyrra verk', dir: 'back' as const },
              next && { p: next, k: 'Næsta verk', dir: 'on' as const },
            ].map((a) => a && (
              <Link key={a.p.slug} to={projPath(a.p.slug)} className={`ki-proj-adj-link ki-proj-adj-link--${a.dir} ki-rv`}>
                <span className="ki-proj-adj-fig">
                  <Photo id={a.p.photos[0].id} alt="" sizes="(max-width: 860px) 40vw, 300px" />
                </span>
                <span className="ki-proj-adj-meta">
                  <span className="ki-kicker">{a.k}</span>
                  <span className="ki-proj-adj-title">{a.p.title}</span>
                  <span className="ki-proj-adj-lead">{a.p.lead}</span>
                </span>
                <span className="ki-proj-adj-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className="ki-wrap-tight" data-ki-band="dark">
        <Headline text="Segðu Katrínu frá rýminu þínu." size={58} floor={28} measure={760} />
        <p className="ki-body ki-rv">
          Það er ekkert verk of stórt eða lítið. Katrín kemur á staðinn, tekur verkefnið út
          í samráði við eigendur og gerir í framhaldi tilboð í verkið.
        </p>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={CONTACT_PATH}><RollText text="Hafa samband" /></Link>
          <Link className="ki-cta" to={catPath(p.category)}><RollText text="Fleiri verk í þessum flokki" /></Link>
        </p>
      </div>
    </Shell>
  )
}
