/**
 * The page a broken or outdated link lands on.
 *
 * It used to be the homepage itself: the 404 shell was a copy of index.html,
 * so a mistyped address looked like a working page and a crawler read 688
 * words of homepage copy under a "not found" title. It is its own page now,
 * short, and it points the way on. The prerender captures it into 404.html,
 * which the host serves for any path it does not know.
 */
import { Link } from './link'
import { RollText } from './flair'
import { Shell, type Head } from './Shell'
import { Headline } from './kit'
import { WORK, STUDIO_PATH, BRANDS_PATH, CONTACT_PATH } from './paths'

export function NotFoundPage() {
  const head: Head = {
    title: 'Síðan fannst ekki | Katrín Ísfeld',
    desc: 'Slóðin fannst ekki. Verkefni Katrínar Ísfeld innanhússarkitekts eru undir Verkefni, og hægt er að hafa samband beint.',
    clean: '/404',
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead ki-notfound" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link></p>
        <Headline as="h1" text="Þessi síða fannst ekki." size={84} floor={34} />
        <p className="ki-lead ki-rv">
          Slóðin gæti hafa breyst þegar vefurinn var endurnýjaður. Verkefnin, stúdíóið og
          leiðin til að hafa samband eru hér.
        </p>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={WORK}><RollText text="Verkefnin" /></Link>
          <Link className="ki-cta" to={STUDIO_PATH}><RollText text="Stúdíóið" /></Link>
          <Link className="ki-cta" to={BRANDS_PATH}><RollText text="Ítalskar innréttingar" /></Link>
          <Link className="ki-cta" to={CONTACT_PATH}><RollText text="Hafa samband" /></Link>
        </p>
      </section>
    </Shell>
  )
}
