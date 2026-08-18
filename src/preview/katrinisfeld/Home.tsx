/**
 * The home page — „Rýmið man".
 *
 * The design is unchanged: the visitor arrives into one room at a time, each
 * band carrying its own colour world drawn from her own photography, and the
 * fixed chrome re-themes itself per element as it crosses each boundary.
 *
 * WHAT MOVED, AND WHY IT MATTERS FOR A SOLD SITE
 * The opening — the arch curtain, the dive into the first room, the headline
 * rising word by word — is now pure CSS, running off the prerendered HTML.
 * It plays before React has parsed, which is the opposite of the old
 * arrangement, where the whole entrance was a GSAP timeline chained to a
 * loader that could not start until the bundle had. The curtain is skipped
 * without a flash for anyone who has already seen it this session, by an
 * inline script in the shell that runs before first paint.
 */
import { Link } from 'react-router-dom'
import { Shell, type Head } from './Shell'
import { Headline, Photo, Slide } from './kit'
import { STUDIO, ADDRESS_LINE } from './facts'
import { CATEGORIES, PROJECTS, byCategory, hasPage, type CategorySlug } from './projects'
import { category as catPath, project as projPath, WORK, BRANDS_PATH, STUDIO_PATH, CONTACT_PATH } from './paths'

const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw'
const ORDER: CategorySlug[] = ['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi']
const SHOWN = 6

export function Home() {
  const head: Head = {
    title: 'Katrín Ísfeld innanhússarkitekt í Reykjavík · heimili, hótel og atvinnurými',
    desc:
      `Katrín Ísfeld er innanhússarkitekt í Reykjavík og hannar innanhús frá grunni: heimili, ` +
      `gistiheimili, hótel og atvinnurými. ${PROJECTS.length} verk í skránni, ásamt ítölskum ` +
      `innréttingum frá Arrital og Altamarea. ${ADDRESS_LINE}.`,
    clean: '/',
  }

  return (
    <Shell head={head}>
      {/* the arch aperture: CSS only, hidden on a repeat visit before paint */}
      <div className="ki-curtain" aria-hidden="true">
        <div className="ki-curtain-arch"><p className="ki-curtain-mark">KATRÍN ÍSFELD</p></div>
      </div>

      {/* 01 · the first room, dived into */}
      <section className="ki-hero" id="top" data-ki-band="dark">
        <div className="ki-hero-media">
          <Photo
            id="s-eldhus-vitt"
            alt="Eldhús í Súluhöfða með vínrauðri eyju, koparljósum og útsýni yfir voginn"
            sizes="100vw"
            priority
          />
        </div>
        <div className="ki-hero-scrim" aria-hidden="true" />
        <div className="ki-hero-lockup">
          <Headline as="h1" className="ki-hero-title" text="Innanhús, hugsað í heild." size={100} floor={36} />
          <p className="ki-hero-sub">
            Katrín Ísfeld, innanhússarkitekt í Reykjavík. Heimili, gistiheimili,
            hótel og atvinnurými, hönnuð frá grunni.
          </p>
          <p className="ki-hero-cta">
            <Link className="ki-cta" to={WORK}>Verkefnin</Link>
            <Link className="ki-cta" to={CONTACT_PATH}>Hafa samband</Link>
          </p>
        </div>
      </section>

      {/* 02 · intent */}
      <section className="ki-wrap" data-ki-band="light">
        <span className="ki-rule ki-rv" aria-hidden="true" />
        <Headline text="Hvert verkefni fær sinn eigin litheim." size={72} floor={32} measure={780} />
        <p className="ki-body ki-rv">
          Vínrautt og kopar í einu húsi, hör og dagsbirta í öðru. Litirnir á þessari síðu
          eru ekki valdir úr litakorti heldur teknir beint úr verkefnunum sjálfum, eins og
          þau voru ljósmynduð.
        </p>
      </section>

      {/* 03 · the overview, clustered by buyer type */}
      <section className="ki-wrap" id="verkefni" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 60)' }}>
          <p className="ki-kicker">Verkefni</p>
          <Headline text="Heimili, gistiheimili, hótel og atvinnurými." size={78} floor={32} measure={880} />
          <p className="ki-body ki-rv">
            {PROJECTS.length} verk í skránni, í fjórum flokkum. Hér er úrval úr hverjum
            flokki fyrir sig, hvert með sinni eigin ljósmynd.
          </p>
        </div>
        {ORDER.map((c) => {
          const items = byCategory(c).filter(hasPage).slice(0, SHOWN)
          if (!items.length) return null
          return (
            <div key={c} className="ki-cluster">
              <p className="ki-cat-head ki-rv">
                {CATEGORIES[c].nav}
                <span className="ki-cat-head-n">{byCategory(c).length} verk</span>
                <Link to={catPath(c)}>Sjá flokkinn</Link>
              </p>
              <ul className="ki-grid">
                {items.map((p) => (
                  <li key={p.slug} className="ki-card ki-rv">
                    <figure className="ki-card-fig">
                      <Photo id={p.photos[0].id} alt={p.photos[0].alt} sizes={CARD_SIZES} />
                    </figure>
                    <div className="ki-card-meta">
                      <span className="ki-card-name"><Link to={projPath(p.slug)}>{p.title}</Link></span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}>Öll {PROJECTS.length} verkin</Link></p>
      </section>

      {/* 04 · one project in depth, so the overview has a floor */}
      <section className="ki-wrap ki-verk-sulu" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 50)' }}>
          <p className="ki-kicker">Eitt verk í nærmynd</p>
          <Headline text="Nýbyggt hús í Súluhöfða." size={72} floor={32} measure={760} />
          <p className="ki-body ki-rv">
            Eyjan er vínrauð, ljósin kopar og arinveggurinn ljós steinn með eldiviðarhólfum,
            allt teiknað inn í húsið frá grunni.
          </p>
        </div>
        <div className="ki-verk-grid">
          <Slide id="s-skapur" alt="Innbyggður glerskápur með lýsingu og dökkum viðaráferðum" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-arinn" alt="Arinveggur úr ljósum steini með eldiviðarhólfum og faldri lýsingu" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-fot" alt="Fataherbergi með lýstum slám og ljósum innréttingum" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-bad" alt="Baðherbergi með bogadregnum lýstum spegli og steinvaski" sizes="(max-width: 991px) 92vw, 46vw" />
        </div>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={projPath('nybyggt-hus-i-suluhofda')}>Sjá verkefnið</Link>
        </p>
      </section>

      {/* 05 · the dome: materials */}
      <section className="ki-dome" data-ki-band="light">
        <Headline className="ki-dome-title" text="Efnin bera rýmið." size={84} floor={32} />
        <div className="ki-dome-arch" data-ki-par="rise">
          <Photo id="s-sturta" alt="Sturturými með dökkum steinvegg og grænni plöntu" sizes="(max-width: 991px) 94vw, 72vw" />
        </div>
        <p className="ki-body ki-dome-body ki-rv">
          Steinn sem heldur skugganum, viður sem heldur hitanum, kopar sem eldist með
          húsinu. Efnisvalið er helmingur hönnunarinnar; ljósið sér um hitt.
        </p>
      </section>

      {/* 06 · the Italian lines, named */}
      <section className="ki-wrap ki-italskar" data-ki-band="dark">
        <div className="ki-split">
          <div>
            <p className="ki-kicker">Arrital og Altamarea</p>
            <Headline text="Ítalskar innréttingar." size={64} floor={30} measure={560} />
            <p className="ki-body ki-rv">
              Eldhúsinnréttingar frá Arrital og baðinnréttingar frá Altamarea fást hjá
              stúdíóinu og eru teiknaðar inn í hvert verkefni frá grunni, hvort sem um er
              að ræða heimili eða gistiheimili.
            </p>
            <p className="ki-cta-row ki-rv">
              <Link className="ki-cta" to={BRANDS_PATH}>Ítalskar innréttingar</Link>
            </p>
          </div>
          <Slide id="f-eyja" alt="Dökk eldhúseyja með blómum úr sumarhúsi í Fljótshlíðinni" sizes="(max-width: 860px) 92vw, 42vw" className="ki-split-fig" />
        </div>
      </section>

      {/* 07 · the register, every entry a link where a page exists */}
      <section className="ki-wrap" id="skra" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 44)' }}>
          <Headline text="Skráin öll." size={84} floor={34} />
          <p className="ki-body ki-rv">
            Verkefnaskráin í heild eins og hún er birt, {PROJECTS.length} verk í fjórum flokkum.
          </p>
          <p className="ki-skra-count ki-rv">
            <span className="ki-skra-n">{PROJECTS.length}</span> verk ·{' '}
            <span className="ki-skra-n">{Object.keys(CATEGORIES).length}</span> flokkar
          </p>
        </div>
        {(Object.keys(CATEGORIES) as CategorySlug[]).map((c) => {
          const items = byCategory(c)
          return (
            <div key={c} className="ki-skra-flokkur ki-rv">
              <div className="ki-skra-cat-row">
                <h3 className="ki-skra-cat">{CATEGORIES[c].nav}</h3>
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
      </section>

      {/* 08 · the studio */}
      <section className="ki-wrap" data-ki-band="light">
        <div className="ki-split">
          <Slide id="f-stofa" alt="Stofa sumarhússins með hörgardínum, hangandi ljósi og leðurstól" sizes="(max-width: 860px) 92vw, 40vw" className="ki-split-fig" variant="shutter" />
          <div>
            <p className="ki-kicker">Bakgrunnur</p>
            <Headline text="Stúdíóið." size={78} floor={32} />
            <p className="ki-body ki-rv">
              Katrín er með BSc í innanhússarkitektúr frá Art Institute of Fort Lauderdale
              í Flórída, útskrifaðist með láði og hlaut annað sæti í alþjóðlegri
              hönnunarsamkeppni. Hún starfaði á arkitektastofum í Fort Lauderdale og í
              Hollandi áður en hún opnaði eigið stúdíó, og er félagi í Félagi húsgagna- og
              innanhússarkitekta.
            </p>
            <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={STUDIO_PATH}>Um Katrínu</Link></p>
          </div>
        </div>
      </section>

      {/* 09 · contact through the arch */}
      <section className="ki-samband" id="samband" data-ki-band="dark">
        <div className="ki-samband-in">
          <Headline text="Segðu Katrínu frá rýminu þínu." size={80} floor={32} measure={720} />
          <div className="ki-samband-row">
            <a className="ki-samband-tel" href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
            <Link className="ki-cta" to={CONTACT_PATH}>Fyrirspurnarform</Link>
          </div>
          <p className="ki-samband-addr">{ADDRESS_LINE} · {STUDIO.email} · Opnunartími {STUDIO.opens}–{STUDIO.closes}</p>
        </div>
      </section>
    </Shell>
  )
}
