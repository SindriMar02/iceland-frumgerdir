/**
 * /en — one English page, deliberately not a mirror.
 *
 * The English-language demand for this business is specific and small:
 * guesthouse and short-stay apartment owners, hotel operators, and people
 * who have moved here and are renovating. They need who she is, what she
 * does, proof, and how to reach her. Translating twenty-six pages would be a
 * separate project; hreflang points this page and the Icelandic home page at
 * each other so neither competes with the other.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Photo, CardFigure } from './kit'
import { STUDIO, ADDRESS_LINE, APPOINTMENT_NOTE_EN } from './facts'
import { EN } from './content'
import { PROJECTS, byCategory, hasPage } from './projects'
import { project as projPath, HOME, WORK } from './paths'

const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw'

export function EnglishPage() {
  const head: Head = { title: EN.title, desc: EN.desc, clean: '/en', lang: 'en' }
  const hospitality = byCategory('gistiheimili-og-hotel').filter(hasPage)

  return (
    <Shell head={head}>
      <div lang="en">
        <section className="ki-pagehead" data-ki-band="light">
          <p className="ki-crumbs"><Link to={HOME} lang="is">Íslenska</Link><span>·</span>English</p>
          <Headline as="h1" text="Interior architect in Reykjavík." size={82} floor={34} />
          <p className="ki-lead ki-rv">{EN.lead}</p>
        </section>

        <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
          <div className="ki-split">
            <figure className="ki-shutter ki-split-fig">
              <Photo id="s-eyja" alt="A deep red kitchen island with copper pendant lights, designed by Katrín Ísfeld" sizes="(max-width: 860px) 92vw, 42vw" />
            </figure>
            <div>
              {EN.paras.map((t, i) => <p key={i} className="ki-body ki-rv">{t}</p>)}
            </div>
          </div>
        </div>

        <div className="ki-wrap" data-ki-band="dark">
          <p className="ki-kicker">Guesthouses and hotels</p>
          <Headline text="Rooms that have to earn their nightly rate." size={62} floor={30} measure={820} />
          <p className="ki-body ki-rv">
            {hospitality.length} of the {PROJECTS.length} projects in the record are
            short-stay or hotel interiors. Captions and project pages are in Icelandic,
            the photographs are not.
          </p>
          <ul className="ki-grid" style={{ marginTop: 'calc(var(--u) * 40)' }}>
            {hospitality.map((p) => (
              <li key={p.slug} className="ki-card ki-rv">
                <CardFigure photos={p.photos} sizes={CARD_SIZES} />
                <div className="ki-card-meta">
                  <span className="ki-card-name"><Link to={projPath(p.slug)}>{p.title}</Link></span>
                </div>
              </li>
            ))}
          </ul>
          <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}>All projects</Link></p>
        </div>

        <div className="ki-wrap" data-ki-band="light">
          <Headline text={EN.how.title} size={58} floor={28} measure={760} />
          <p className="ki-body ki-rv">{EN.how.body}</p>
          <dl className="ki-dl" style={{ marginTop: 'calc(var(--u) * 30)', maxWidth: '34rem' }}>
            <div><dt>Studio</dt><dd>{ADDRESS_LINE}, Iceland</dd></div>
            <div><dt>Phone</dt><dd><a href={STUDIO.phoneHref}>+354 {STUDIO.phoneDisplay}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a></dd></div>
            <div>
              <dt>Open</dt>
              <dd>{STUDIO.opens}–{STUDIO.closes} weekdays<br />{APPOINTMENT_NOTE_EN}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Shell>
  )
}
