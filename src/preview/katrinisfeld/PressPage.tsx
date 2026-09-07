/**
 * /fjolmidlar — the press page.
 *
 * Her own version is a heading, one sentence and twelve photographs of
 * magazine spreads, filed under "Ýmislegt" as though it were a project. It is
 * not a project, and filing it as one cost her twice: the page ranked for
 * nothing, and every headline she has ever been given was locked inside a
 * JPEG where no search engine and no assistant could read it.
 *
 * So the headlines are text here, in a list, with the outlet and date beside
 * them where the clipping itself carries one. That is the whole point of the
 * page — an assistant asked "who is Katrín Ísfeld" can now find that
 * Morgunblaðið ran her under "Djúpir litir koma sterkir inn" rather than
 * finding a picture of it.
 */
import { Link } from './link'
import { Shell, type Head } from './Shell'
import { Headline, Slide } from './kit'
import { PRESS, PRESS_LEAD } from './press'
import { CONTACT_PATH, WORK } from './paths'
import { STUDIO } from './facts'

export function PressPage() {
  const head: Head = {
    title: 'Í fjölmiðlum · umfjöllun um Katrínu Ísfeld innanhússarkitekt',
    desc:
      'Viðtöl og umfjöllun um Katrínu Ísfeld innanhússarkitekt í Morgunblaðinu og Hús og hýbýli, ásamt myndum af verkefnum hennar eins og þau hafa birst á prenti.',
    clean: '/fjolmidlar',
  }

  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs">
          <Link to="/">Forsíða</Link><span>·</span>Í fjölmiðlum
        </p>
        <Headline as="h1" text="Í fjölmiðlum." size={80} floor={32} />
        <p className="ki-lead ki-rv">{PRESS_LEAD}</p>
        <p className="ki-body ki-rv">
          {STUDIO.name} hefur verið til umfjöllunar á heimilis- og hönnunarsíðum
          íslenskra miðla frá 2016. Fyrirsagnirnar hér að neðan eru eins og þær
          birtust; útgáfa og dagsetning fylgja þar sem úrklippan sjálf ber þær.
        </p>
      </section>

      <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
        <ol className="ki-press">
          {PRESS.map((c, i) => (
            <li key={c.id} className={i % 3 === 0 ? 'ki-press-wide' : 'ki-press-half'}>
              <figure className="ki-press-fig">
                <Slide
                  id={c.id}
                  alt={c.alt}
                  sizes={i % 3 === 0 ? '(max-width: 860px) 92vw, 66vw' : '(max-width: 860px) 92vw, 44vw'}
                  variant={i === 0 ? 'shutter' : 'slide'}
                />
                <figcaption className="ki-press-cap">
                  <h2 className="ki-press-head">{c.headline}</h2>
                  {(c.outlet || c.date || c.byline) && (
                    <p className="ki-press-meta">
                      {[c.outlet, c.date, c.byline].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <div className="ki-wrap-tight" data-ki-band="light" style={{ paddingTop: 0 }}>
        <p className="ki-body ki-rv">
          Verkefnin sem umfjöllunin fjallar um eru <Link to={WORK}>hér</Link>, og
          hægt er að <Link to={CONTACT_PATH}>hafa samband</Link> um ný verkefni.
        </p>
      </div>
    </Shell>
  )
}
