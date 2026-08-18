/**
 * /studioid — the page that answers "who is she, and why her".
 *
 * This is the site's experience-and-credentials page, and it is written to be
 * quotable. An assistant asked "who is a qualified interior architect in
 * Reykjavík" needs a named degree, a named school, a named association and a
 * named previous employer in plain sentences; a page that says "years of
 * experience and a passion for design" gives it nothing to repeat. Every
 * claim below is on her own Stúdíóið page or in the FHI member roster.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Slide } from './kit'
import { STUDIO, CV, ADDRESS_LINE } from './facts'
import { PROJECTS } from './projects'
import { PROCESS, SERVICES, FAQ } from './content'
import { CONTACT_PATH, WORK, BRANDS_PATH } from './paths'

const BASE = import.meta.env.BASE_URL

export function StudioPage() {
  const head: Head = {
    title: 'Stúdíóið · Katrín Ísfeld innanhússarkitekt í Reykjavík',
    desc:
      `Katrín Ísfeld er innanhússarkitekt með ${CV.degree} frá ${CV.school} í Flórída og félagi í FHI. ` +
      'Áður á arkitektastofum í Hollandi og Fort Lauderdale. Stúdíóið er á ' + ADDRESS_LINE + '.',
    clean: '/studioid',
  }
  return (
    <Shell head={head}>
      <section className="ki-pagehead" data-ki-band="light">
        <p className="ki-crumbs"><Link to="/">Forsíða</Link><span>·</span>Stúdíóið</p>
        {/* Her own lockup, harvested from her site. It carries four colours
            and only holds on a light ground, which is why it lives here and
            not in the chrome, where every band would fight it. */}
        <img className="ki-lockup" src={`${BASE}katrinisfeld/brand/logo.png`}
          alt="Merki Katrín Ísfeld Hönnunar Studio" width={300} height={120} />
        <Headline as="h1" text="Hönnun er upplifun." size={86} floor={34} />
        <p className="ki-lead ki-rv">
          Katrín Ísfeld, innanhússarkitekt og eigandi Katrín Ísfeld Hönnunar Studio.
        </p>
      </section>

      <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
        <div className="ki-split">
          <Slide id="f-stofa" alt="Stofa með hörgardínum og leðurstól úr verkefni Katrínar" sizes="(max-width: 860px) 92vw, 42vw" className="ki-split-fig" variant="shutter" />
          <div>
            <p className="ki-body ki-rv">
              Katrín lauk {CV.degree} frá {CV.school} í Flórída.
              Hún útskrifaðist með láði og hlaut annað sæti í alþjóðlegri hönnunarsamkeppni
              í Bandaríkjunum.
            </p>
            <p className="ki-body ki-rv">
              Að námi loknu starfaði hún sem innanhússarkitekt við arkitektastofu í Fort
              Lauderdale, þar sem hún hannaði glæsivillur, og síðar hjá arkitektastofu
              Margreed Van der Hooven í Hollandi. Sú reynsla, að vinna innanhússhönnun
              inni á arkitektastofu, er ástæðan fyrir því hvernig verkefnin eru tekin hér
              heima: rýmið er teiknað með húsinu en ekki lagt ofan á það þegar smíðinni er lokið.
            </p>
            <p className="ki-body ki-rv">
              Hún er félagi í Félagi húsgagna- og innanhússarkitekta (FHI) og hefur rekið
              eigið stúdíó frá {STUDIO.founded}. Í verkefnaskránni eru {PROJECTS.length} verk:
              heimili og sumarhús, gistiheimili og hótel, skrifstofur og heilbrigðisrými.
            </p>
            <p className="ki-cta-row ki-rv">
              <Link className="ki-cta" to={WORK}>Sjá verkefnin</Link>
              <Link className="ki-cta" to={BRANDS_PATH}>Ítalskar innréttingar</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="ki-wrap" data-ki-band="dark">
        <p className="ki-kicker">Ferlið</p>
        <Headline text="Hvernig verkefni byrjar." size={64} floor={30} measure={800} />
        <ol className="ki-steps">
          {PROCESS.map((s) => (
            <li key={s.title} className="ki-rv"><h3>{s.title}</h3><p>{s.body}</p></li>
          ))}
        </ol>
      </div>

      <div className="ki-wrap" data-ki-band="light">
        <p className="ki-kicker">Þjónusta</p>
        <Headline text="Hvað stúdíóið tekur að sér." size={64} floor={30} measure={800} />
        <ol className="ki-steps">
          {SERVICES.map((s) => (
            <li key={s.name} className="ki-rv"><h3>{s.name}</h3><p>{s.desc}</p></li>
          ))}
        </ol>
      </div>

      <div className="ki-wrap" data-ki-band="light" style={{ paddingTop: 0 }}>
        <Headline text="Spurt og svarað." size={64} floor={30} measure={800} />
        <div className="ki-faq">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p className="ki-body">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="ki-cta-row"><Link className="ki-cta" to={CONTACT_PATH}>Hafa samband</Link></p>
      </div>
    </Shell>
  )
}
