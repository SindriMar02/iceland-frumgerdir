/**
 * /italskar-innrettingar — the commercial page, and the most under-used asset
 * on her old site.
 *
 * REWRITTEN 2026-09-23 TO HER EMAIL ("Smá leiðrétting"), and the correction
 * matters more than the layout: the page explained that a drawn-in kitchen
 * leaves "engin fylliplata og engin sílikonrönd". Both halves were wrong.
 * The trade word is aðfella, felliplata/fylliplata is not a word anyone in
 * the trade uses, aðfellur are ALWAYS fitted because a wall is never truly
 * 90° (without one, drawers scrape the wall and doors never open fully), and
 * kíddrönd is never used at all. Rather than restate it correctly she asked
 * for the explanations to go: "Fólk hefur ekki mikla þolinmæði í mikinn
 * lestur, vill bara sjá flottar myndir og lítinn texta."
 *
 * So the page is her own three facts, two rooms with a photograph each, and
 * the way into the real projects. Novamobili is new — it was never on the
 * site and it is the third brand she actually sells.
 */
import { Link } from './link'
import { RollText } from './flair'
import { Shell, type Head } from './Shell'
import { Headline, Slide } from './kit'
import { BRANDS, STUDIO, ADDRESS_LINE, MAP_URL, SHOWROOM } from './facts'
import { CONTACT_PATH, WORK } from './paths'

const KITCHEN = BRANDS[0]
const BATH = BRANDS[1]

export function BrandsPage() {
  const head: Head = {
    title: 'Ítalskar innréttingar · Arrital eldhús og Altamarea baðinnréttingar | Katrín Ísfeld',
    desc:
      'Arrital eldhúsinnréttingar, Altamarea baðinnréttingar og Novamobili fataskápar fást hjá Katrín Ísfeld Hönnunar Studio í Reykjavík. Innréttingarnar eru teiknaðar inn í hvert rými af innanhússarkitekt.',
    clean: '/italskar-innrettingar',
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Ítalskar innréttingar</p>
        <Headline as="h1" text="Ítalskar innréttingar, teiknaðar inn í rýmið." size={80} floor={32} />
        {/* her own words, from the email */}
        <p className="ki-lead ki-rv">
          Framleiðandinn á Ítalíu er Arrital, bæði fyrir eldhúsið og baðinnréttingarnar,
          sem þeir nefna Altamarea. Þeir eru líka með línu sem þeir kalla Living, fyrir
          borðstofuna og stofuna.
        </p>
        <p className="ki-body ki-rv">
          Fyrir fataherbergið, fataskápa og húsgögn er það ítalski framleiðandinn
          Novamobili. Arrital var stofnaður 1979 í Fontanafredda á Norður-Ítalíu, og
          innréttingarnar fást hjá {STUDIO.name}.
        </p>
        <p className="ki-cta-row ki-rv">
          <a className="ki-cta" href="https://www.arrital.it" target="_blank" rel="noopener">Arrital</a>
          <a className="ki-cta" href="https://www.novamobili.it" target="_blank" rel="noopener">Novamobili</a>
        </p>
      </section>

      {/* eldhúsið: the wine red island, and the one line she kept */}
      <div className="ki-wrap" data-ki-band="dark" id={KITCHEN.slug}>
        <div className="ki-split">
          <Slide
            id={KITCHEN.photo}
            alt={`${KITCHEN.room} hannað af Katrínu Ísfeld með innréttingum frá ${KITCHEN.name}`}
            sizes="(max-width: 860px) 92vw, 45vw"
            className="ki-split-fig"
          />
          <div>
            <p className="ki-kicker">{KITCHEN.room}</p>
            <Headline text={KITCHEN.name} size={64} floor={30} />
            <p className="ki-body ki-rv">
              Innréttingarnar eru hluti af hönnuninni en ekki viðbót við hana: Katrín
              teiknar rýmið og innréttinguna í sama ferli, svo lýsing, efnisval og
              innrétting eru ákveðin saman.
            </p>
          </div>
        </div>
      </div>

      {/* baðherbergið: heading and photograph, "engan texta" */}
      <div className="ki-wrap" data-ki-band="light" id={BATH.slug}>
        <p className="ki-kicker">{BATH.room}</p>
        <Headline text={BATH.name} size={64} floor={30} />
        <Slide
          id={BATH.photo}
          alt={`${BATH.room} hannað af Katrínu Ísfeld með innréttingum frá ${BATH.name}`}
          sizes="92vw"
        />
      </div>

      <div className="ki-wrap-tight" data-ki-band="dark">
        <Headline text="Sjáðu innréttingarnar í raunverulegum verkefnum." size={58} floor={28} measure={820} />
        <p className="ki-body ki-rv">
          Eldhús og baðherbergi úr verkefnaskránni, ljósmynduð eins og þau standa.
        </p>
        <p className="ki-body ki-rv">
          {SHOWROOM.lead} {SHOWROOM.cta} Heimilisfang stúdíósins er {ADDRESS_LINE}.
        </p>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={WORK}><RollText text="Verkefnin" /></Link>
          <Link className="ki-cta" to={CONTACT_PATH}><RollText text="Fá tíma í stúdíóinu" /></Link>
          <a className="ki-cta" href={MAP_URL} target="_blank" rel="noopener">Sjá á korti</a>
        </p>
      </div>
    </Shell>
  )
}
