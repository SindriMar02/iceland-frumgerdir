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
import { Headline, Photo, Slide, isLandscape, landscapeFirst } from './kit'
import { PHOTO_DIMS } from './photo-dims'
import { CATEGORIES, PROJECTS, hasPage, type Project } from './projects'
import { category as catPath, project as projPath, WORK, CONTACT_PATH } from './paths'

const HERO_SIZES = '100vw'
const GAL_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 90vw, 46vw'

/**
 * THE GALLERY, ROW BY ROW (rebuilt 2026-09-22).
 *
 * The old rhythm gave every fifth photograph the full width of the page
 * regardless of its shape, so a portrait shot ran 1328 x 2200 and a visitor
 * met a slab of ceiling; and a row could pair a portrait with a landscape,
 * which left the two tiles different heights and the row looking unfinished.
 *
 * Now a row only ever holds photographs of the same shape, and each shape has
 * one frame: 16/9 across the page, 3/2 for a landscape pair, 4/5 for a
 * portrait pair. Her order is kept inside each shape. A photograph never goes
 * full width unless it is landscape AND at least 1200px wide, which is the
 * old rule that kept Hótel Hekla's 662px source from being stretched.
 */
type Tile = { photo: PhotoRef; kind: 'wide' | 'half'; ratio: string }
type PhotoRef = Project['photos'][number]

function tiles(rest: ReadonlyArray<PhotoRef>): Tile[] {
  const wideOk = (p: PhotoRef) => isLandscape(p.id) && (PHOTO_DIMS[p.id]?.w ?? 0) >= 1200
  const land = rest.filter((p) => isLandscape(p.id))
  const port = rest.filter((p) => !isLandscape(p.id))
  const out: Tile[] = []
  let rows = 0
  const pairFrom = (q: PhotoRef[], ratio: string) => {
    out.push({ photo: q.shift()!, kind: 'half', ratio }, { photo: q.shift()!, kind: 'half', ratio })
    rows++
  }
  // the page opens on a room, full width, whenever a landscape can carry it
  if (land.length && wideOk(land[0])) out.push({ photo: land.shift()!, kind: 'wide', ratio: '16 / 9' })
  while (land.length || port.length) {
    // every third row a landscape returns to full width, so the page breathes
    if (rows > 0 && rows % 3 === 0 && land.length && wideOk(land[0])) {
      out.push({ photo: land.shift()!, kind: 'wide', ratio: '16 / 9' })
      rows++
      continue
    }
    if (port.length >= 2 && (port.length >= land.length || land.length < 2)) pairFrom(port, '4 / 5')
    else if (land.length >= 2) pairFrom(land, '3 / 2')
    else {
      // one photograph left over: full width if it can carry it, otherwise a
      // single tile that keeps the column it would have shared
      const last = (port.length ? port : land).shift()!
      out.push(wideOk(last)
        ? { photo: last, kind: 'wide', ratio: '16 / 9' }
        : { photo: last, kind: 'half', ratio: isLandscape(last.id) ? '3 / 2' : '4 / 5' })
      rows++
    }
  }
  return out
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
        {/* a portrait hero in a 2:1 band showed 29% of the photograph, so the
            band grows for portrait photographs instead of cropping harder */}
        <section className="ki-proj-hero" data-ki-band="dark" data-tall={isLandscape(hero.id) ? undefined : ''}>
          <Photo id={hero.id} alt={hero.alt} sizes={HERO_SIZES} pos={hero.pos} priority />
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
            {tiles(rest).map((t, i) => (
              <div key={t.photo.id} className={t.kind === 'wide' ? 'ki-gal-wide' : 'ki-gal-half'}>
                <Slide
                  id={t.photo.id}
                  alt={t.photo.alt}
                  ratio={t.ratio}
                  pos={t.photo.pos}
                  sizes={t.kind === 'wide' ? GAL_SIZES : '(max-width: 860px) 92vw, 44vw'}
                  variant={i === 0 ? 'shutter' : 'slide'}
                />
              </div>
            ))}
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
                  <Photo id={landscapeFirst(a.p.photos)[0].id} alt="" sizes="(max-width: 860px) 40vw, 300px" pos={landscapeFirst(a.p.photos)[0].pos} />
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
