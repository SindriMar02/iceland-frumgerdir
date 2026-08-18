/**
 * /italskar-innrettingar — the commercial page, and the most under-used asset
 * on her old site.
 *
 * She stocks Arrital kitchens and Altamarea bathrooms in Iceland. Neither
 * brand name appeared anywhere on the redesign until now, and on her own site
 * the bathroom brand is spelled "Altamerea", which means anybody searching the
 * real name never reaches her. These are searches with money behind them:
 * a person typing "Arrital eldhús" is not browsing.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Slide } from './kit'
import { BRANDS, STUDIO } from './facts'
import { CONTACT_PATH, WORK } from './paths'

export function BrandsPage() {
  const head: Head = {
    title: 'Ítalskar innréttingar · Arrital eldhús og Altamarea baðinnréttingar | Katrín Ísfeld',
    desc:
      'Arrital eldhúsinnréttingar og Altamarea baðinnréttingar fást hjá Katrín Ísfeld Hönnunar Studio í Reykjavík. Innréttingarnar eru teiknaðar inn í hvert rými af innanhússarkitekt.',
    clean: '/italskar-innrettingar',
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Ítalskar innréttingar</p>
        <Headline as="h1" text="Ítalskar innréttingar, teiknaðar inn í rýmið." size={80} floor={32} />
        <p className="ki-lead ki-rv">
          Arrital fyrir eldhúsið og Altamarea fyrir baðherbergið, hvort tveggja fáanlegt
          hjá {STUDIO.name}.
        </p>
        <p className="ki-body ki-rv">
          Munurinn á innréttingu úr bæklingi og innréttingu sem er teiknuð inn í rýmið
          liggur í sentimetrunum. Þegar innanhússarkitekt teiknar innréttinguna sjálfa
          ráðast breiddirnar af veggjunum sem eru til staðar, ekki af staðalstærðum, og
          þess vegna er engin fylliplata og engin sílikonrönd þar sem einingin nær ekki alveg.
        </p>
      </section>

      {BRANDS.map((b, i) => (
        <div key={b.slug} className="ki-wrap" data-ki-band={i % 2 === 0 ? 'dark' : 'light'} id={b.slug}>
          <div className="ki-split">
            {i % 2 === 0
              ? <Slide id={b.photo} alt={`${b.room} hannað af Katrínu Ísfeld með innréttingum frá ${b.name}`} sizes="(max-width: 860px) 92vw, 45vw" className="ki-split-fig" />
              : null}
            <div>
              <p className="ki-kicker">{b.room}</p>
              <Headline text={`${b.name}.`} size={64} floor={30} />
              <p className="ki-body ki-rv">{b.intro}</p>
              <p className="ki-body ki-rv">
                Innréttingarnar eru hluti af hönnuninni en ekki viðbót við hana: Katrín
                teiknar rýmið og innréttinguna í sama ferli, svo lýsing, efnisval og
                innrétting eru ákveðin saman.
              </p>
              <p className="ki-cta-row ki-rv">
                <Link className="ki-cta" to={CONTACT_PATH}>Fá tilboð</Link>
                <a className="ki-cta" href={b.site} target="_blank" rel="noopener">
                  {b.name} vefurinn
                </a>
              </p>
            </div>
            {i % 2 === 1
              ? <Slide id={b.photo} alt={`${b.room} hannað af Katrínu Ísfeld með innréttingum frá ${b.name}`} sizes="(max-width: 860px) 92vw, 45vw" className="ki-split-fig" />
              : null}
          </div>
        </div>
      ))}

      <div className="ki-wrap-tight" data-ki-band="dark">
        <Headline text="Sjáðu innréttingarnar í raunverulegum verkefnum." size={58} floor={28} measure={820} />
        <p className="ki-body ki-rv">
          Eldhús og baðherbergi úr verkefnaskránni, ljósmynduð eins og þau standa.
        </p>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={WORK}>Verkefnin</Link>
          <a className="ki-cta" href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
        </p>
      </div>
    </Shell>
  )
}
