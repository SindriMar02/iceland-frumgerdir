/**
 * The home page — „Rýmið man".
 *
 * The layout is the one she bought: a full-frame room, the intent, the work
 * clustered by the kind of client, one project in depth, the materials, the
 * Italian lines, the register, the studio, and the way to reach her. Two
 * things from the later build stay because they earned it: her name centred
 * in the landing frame, and the newest project resting in its corner.
 *
 * The landing photograph is a run of her best rooms now, one per project,
 * each named and each a link — see hero-show.tsx.
 */
import { Link } from './link'
import { Shell, type Head } from './Shell'
import { Headline, Photo, Slide, CardFigure, landscapeFirst, portraitFirst } from './kit'
import { HeroShow, type ShowSlide } from './hero-show'
import { PreviewZone, RollText } from './flair'
import { ContactForm } from './contact-form'
import { STUDIO, ADDRESS_LINE, HOURS_DAYS_IS, SHOWROOM } from './facts'
import { CATEGORIES, PROJECTS, byCategory, hasPage, type CategorySlug } from './projects'
import { category as catPath, project as projPath, WORK, BRANDS_PATH, STUDIO_PATH, CONTACT_PATH } from './paths'

const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw'
const ORDER: CategorySlug[] = ['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi']
const SHOWN = 6

/* One room from each of seven projects, across all three kinds of client.
   The newest project opens the run, and its caption carries the "Nýtt" badge. */
const SHOW: ReadonlyArray<ShowSlide> = [
  { id: 's-eldhus-vitt', slug: 'nybyggt-hus-i-suluhofda', tone: 0.6 },
  { id: 'f-eldhus', slug: 'sumarhus-i-fljotshlidinni', tone: 0.58 },
  { id: 'p-fjallalind-4', slug: 'fjallalind', tone: 0.65 },
  { id: 'p-freyja-0', slug: 'freyja-gistiheimili', tone: 0.62 },
  { id: 'p-skuggahverfi-0', slug: 'eldhusrymi-i-skuggahverfi', tone: 0.63 },
  { id: 'p-olfus-0', slug: 'sumarhus-i-olfusi', tone: 0.46 },
  { id: 'p-gardabaer-0', slug: 'hus-i-gardabae', tone: 0.64 },
]

/* PROJECTS is in her published order, newest first. */
const NEWEST = PROJECTS[0]

/* THE DOORS. The three kinds of client she is asked by, plus the one thing
   she sells: four ways in, each a photograph, a number and a count. This is
   the map of the site, put where a visitor decides where to go. */
const DOORS: ReadonlyArray<{ to: string; label: string; count: string; photo: string; alt: string }> = [
  ...ORDER.map((c) => {
    const items = byCategory(c)
    const p = items[0]
    return {
      to: catPath(c),
      label: CATEGORIES[c].nav,
      count: `${items.length} verk`,
      /* the doors are the one tall frame on the page, so they take the
         project's portrait photograph rather than its lead one */
      photo: portraitFirst(p.photos).id,
      alt: portraitFirst(p.photos).alt,
    }
  }),
  {
    to: BRANDS_PATH,
    label: 'Ítalskar innréttingar',
    count: 'Arrital · Altamarea',
    photo: 's-eyja',
    alt: 'Djúprauð eldhúseyja með koparljósum úr sýningarrými stúdíósins',
  },
]

export function Home() {
  const head: Head = {
    title: 'Katrín Ísfeld innanhússarkitekt í Reykjavík · heimili, hótel og atvinnurými',
    desc:
      `Katrín Ísfeld er innanhússarkitekt í Reykjavík og hannar innanhús frá grunni: heimili, ` +
      `gistiheimili, hótel og atvinnurými. ${PROJECTS.length} verk í skránni, ásamt ítölskum ` +
      `innréttingum frá Arrital og Novamobili. ${ADDRESS_LINE}.`,
    clean: '/',
  }

  return (
    <Shell head={head}>
      {/* 01 · the rooms, and her name on them */}
      <HeroShow slides={SHOW} newSlug={NEWEST.slug} />

      {/* 02 · intent, and the four doors */}
      <section className="ki-wrap" data-ki-band="light">
        <span className="ki-rule ki-rv" aria-hidden="true" />
        <Headline text="Hvert verkefni fær sinn eigin litheim." size={72} floor={32} measure={780} />
        <p className="ki-body ki-rv">
          Vínrautt og kopar í einu húsi, hör og dagsbirta í öðru. Katrín teiknar skipulag,
          innréttingar, efnisval og lýsingu, svo hvert rými verður heild sem er
          sniðin að húsinu og fólkinu sem býr þar.
        </p>
        <ul className="ki-doors">
          {DOORS.map((d, i) => (
            <li key={d.to} className="ki-door ki-rv" style={{ ['--i' as string]: i }}>
              <Link to={d.to}>
                <span className="ki-door-fig">
                  <Photo id={d.photo} alt={d.alt} sizes="(max-width: 640px) 92vw, (max-width: 991px) 46vw, 23vw" />
                </span>
                <span className="ki-door-meta">
                  <span className="ki-door-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ki-door-label">{d.label}</span>
                  <span className="ki-door-count">{d.count}</span>
                  <span className="ki-door-arrow" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 · the overview, clustered by buyer type — every card opens its
          project, and whatever a cluster cannot show as a card it names */}
      <section className="ki-wrap" id="verkefni" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 60)' }}>
          <p className="ki-kicker">Verkefni</p>
          <Headline text="Heimili, gistiheimili, hótel og atvinnurými." size={78} floor={32} measure={880} />
          <p className="ki-body ki-rv">
            {PROJECTS.length} verk í fjórum flokkum, allt frá einu baðherbergi upp í heilt
            hótel. Hér er úrval úr hverjum flokki.
          </p>
        </div>
        {ORDER.map((c) => {
          const all = byCategory(c)
          if (!all.length) return null
          const items = all.filter(hasPage).slice(0, SHOWN)
          const rest = all.filter((p) => !items.includes(p))
          return (
            <div key={c} className="ki-cluster">
              <p className="ki-cat-head ki-rv">
                {CATEGORIES[c].nav}
                <span className="ki-cat-head-n">{all.length} verk</span>
                <Link to={catPath(c)}>Sjá flokkinn</Link>
              </p>
              {items.length > 0 && (
                <ul className="ki-grid">
                  {items.map((p) => (
                    <li key={p.slug} className="ki-card ki-rv">
                      <Link className="ki-card-link" to={projPath(p.slug)}>
                        <CardFigure photos={landscapeFirst(p.photos)} sizes={CARD_SIZES} />
                        <span className="ki-card-meta">
                          <span className="ki-card-name">{p.title}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {rest.length > 0 && (
                <p className="ki-cluster-rest ki-rv">
                  <span>Einnig</span>{' '}
                  {rest.map((p, i) => (
                    <span key={p.slug}>
                      {hasPage(p) ? <Link to={projPath(p.slug)}>{p.title}</Link> : p.title}
                      {i < rest.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </p>
              )}
            </div>
          )
        })}
        <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}><RollText text={`Öll ${PROJECTS.length} verkin`} /></Link></p>
      </section>

      {/* 04 · one project in depth, so the overview has a floor */}
      <section className="ki-wrap ki-verk-sulu" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 50)' }}>
          <p className="ki-kicker">Eitt verk í nærmynd</p>
          <Headline text="Nýbyggt hús í Súluhöfða." size={72} floor={32} measure={760} />
          <p className="ki-body ki-rv">
            Djúpur vínrauður litur á Arrital eyjunni, flísar frá Agli Árnasyni í gegnum allt húsið
            og lýsing sem er hönnuð með rýminu.
          </p>
        </div>
        <Link className="ki-verk-grid" to={projPath('nybyggt-hus-i-suluhofda')} aria-label="Nýbyggt hús í Súluhöfða, sjá verkefnið">
          <Slide id="s-skapur" alt="Innbyggður glerskápur með lýsingu og dökkum viðaráferðum" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-arinn" alt="Arinveggur úr ljósum steini með eldiviðarhólfum og faldri lýsingu" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-fot" alt="Fataherbergi með lýstum slám og ljósum innréttingum" sizes="(max-width: 991px) 92vw, 46vw" />
          <Slide id="s-bad" alt="Baðherbergi með bogadregnum lýstum spegli og steinvaski" sizes="(max-width: 991px) 92vw, 46vw" />
        </Link>
        <p className="ki-cta-row ki-rv">
          <Link className="ki-cta" to={projPath('nybyggt-hus-i-suluhofda')}><RollText text="Sjá verkefnið" /></Link>
        </p>
      </section>

      {/* 05 · the dome: materials */}
      <section className="ki-dome" data-ki-band="light">
        <Headline className="ki-dome-title" text="Efnin bera rýmið." size={84} floor={32} />
        <Link className="ki-dome-arch" to={projPath('nybyggt-hus-i-suluhofda')} data-ki-par="rise" aria-label="Sturturými í Súluhöfða, sjá verkefnið">
          <Photo id="s-sturta" alt="Sturturými með dökkum steinvegg og grænni plöntu" sizes="(max-width: 991px) 94vw, 72vw" />
        </Link>
      </section>

      {/* 06 · the Italian lines, and the studio they are standing in */}
      <section className="ki-wrap ki-italskar" data-ki-band="dark">
        <div className="ki-split">
          <div>
            <p className="ki-kicker">Arrital og Novamobili</p>
            <Headline text="Ítalskar innréttingar." size={64} floor={30} measure={560} />
            <p className="ki-body ki-rv">
              Eldhúsinnréttingar frá Arrital, baðinnréttingar frá Arrital undir merkinu
              Altamarea og fataskápar og húsgögn frá Novamobili fást hjá stúdíóinu.
            </p>
            <p className="ki-cta-row ki-rv">
              <Link className="ki-cta" to={BRANDS_PATH}><RollText text="Ítalskar innréttingar" /></Link>
            </p>
          </div>
          <Link to={projPath('sumarhus-i-fljotshlidinni')} className="ki-split-fig ki-fig-link" aria-label="Sumarhús í Fljótshlíðinni, sjá verkefnið">
            <Slide id="f-eyja" alt="Dökk eldhúseyja með blómum úr sumarhúsi í Fljótshlíðinni" sizes="(max-width: 860px) 92vw, 42vw" />
          </Link>
        </div>
        <div className="ki-split ki-italskar-studio">
          <Slide id={SHOWROOM.photo} alt={SHOWROOM.alt} sizes="(max-width: 860px) 92vw, 42vw" className="ki-split-fig" variant="shutter" />
          <div>
            <p className="ki-kicker">Stúdíóið við {STUDIO.street}</p>
            <Headline text={SHOWROOM.lead} size={54} floor={28} measure={600} />
            <p className="ki-body ki-rv">{SHOWROOM.body}</p>
            <p className="ki-cta-row ki-rv">
              <Link className="ki-cta" to={CONTACT_PATH}><RollText text="Finna tíma í stúdíóinu" /></Link>
            </p>
          </div>
        </div>
      </section>

      {/* 07 · the register, every entry a link where a page exists */}
      <section className="ki-wrap" id="skra" data-ki-band="dark">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 44)' }}>
          <Headline text="Skráin öll." size={84} floor={34} />
          <p className="ki-body ki-rv">
            Öll verkefnin á einum stað, {PROJECTS.length} verk í fjórum flokkum.
          </p>
          <p className="ki-skra-count ki-rv">
            <span className="ki-skra-n">{PROJECTS.length}</span> verk ·{' '}
            <span className="ki-skra-n">{Object.keys(CATEGORIES).length}</span> flokkar
          </p>
        </div>
        <PreviewZone>
        {(Object.keys(CATEGORIES) as CategorySlug[]).map((c) => {
          const items = byCategory(c)
          if (!items.length) return null
          return (
            <div key={c} className="ki-skra-flokkur ki-rv">
              <div className="ki-skra-cat-row">
                <h3 className="ki-skra-cat">{CATEGORIES[c].nav}</h3>
                <span className="ki-skra-cat-n" aria-hidden="true">{String(items.length).padStart(2, '0')}</span>
              </div>
              <ul className="ki-skra-list">
                {items.map((p) => (
                  <li key={p.slug} className="ki-skra-row">
                    {hasPage(p)
                      ? <Link to={projPath(p.slug)} data-preview={landscapeFirst(p.photos)[0].id}>{p.title}</Link>
                      : <span>{p.title}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        </PreviewZone>
      </section>

      {/* 08 · the studio */}
      <section className="ki-wrap" data-ki-band="light">
        <div className="ki-split">
          <Link to={projPath('sumarhus-i-fljotshlidinni')} className="ki-split-fig ki-fig-link" aria-label="Sumarhús í Fljótshlíðinni, sjá verkefnið">
            <Slide id="f-stofa" alt="Stofa sumarhússins með hörgardínum, hangandi ljósi og leðurstól" sizes="(max-width: 860px) 92vw, 40vw" variant="shutter" />
          </Link>
          <div>
            <p className="ki-kicker">Bakgrunnur</p>
            <Headline text="Stúdíóið." size={78} floor={32} />
            <p className="ki-body ki-rv">
              Katrín er með BSc í innanhússarkitektúr frá Art Institute of Fort Lauderdale
              í Flórída, útskrifaðist með láði og hlaut annað sæti í alþjóðlegri
              hönnunarsamkeppni í Bandaríkjunum. Hún starfaði á arkitektastofum í Fort Lauderdale og í
              Hollandi áður en hún opnaði eigið stúdíó, og er félagi í FHI, Félagi
              húsgagna- og innanhússarkitekta.
            </p>
            <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={STUDIO_PATH}><RollText text="Um Katrínu" /></Link></p>
          </div>
        </div>
      </section>

      {/* 09 · contact through the arch */}
      <section className="ki-samband" id="samband" data-ki-band="dark">
        {/* the form itself, here — not a link to a page that has one */}
        <div className="ki-samband-in ki-samband-grid">
          <div>
            <Headline text="Segðu Katrínu frá rýminu þínu." size={72} floor={32} measure={620} />
            <p className="ki-body ki-rv">
              Nokkrar línur duga. Katrín kemur á staðinn, tekur verkefnið út og gerir tilboð í framhaldinu.
            </p>
            <div className="ki-samband-row">
              <a className="ki-samband-tel" href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
            </div>
            <p className="ki-samband-addr">{ADDRESS_LINE} · {STUDIO.email} · Opnunartími {STUDIO.opens}–{STUDIO.closes} {HOURS_DAYS_IS}, eftir samkomulagi</p>
          </div>
          <ContactForm compact />
        </div>
      </section>
    </Shell>
  )
}
