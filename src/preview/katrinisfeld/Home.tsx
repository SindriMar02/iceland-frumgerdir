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
import {
  Headline, Photo, Slide, CardFigure, HorizontalChapter, StatementOverlay, ParallaxHero,
  type HPanel, type PlxPlate,
} from './kit'
/* the 21st.dev prebuiltui/image-gallery accordion, installed with the shadcn
   CLI and pointed at her materials — see the note on the component */
import ImageGallery, { type GalleryItem } from '@/components/ui/image-gallery'
import { STUDIO, ADDRESS_LINE, HOURS_DAYS_IS } from './facts'
import { CATEGORIES, PROJECTS, byCategory, hasPage, type CategorySlug } from './projects'
import { category as catPath, project as projPath, WORK, BRANDS_PATH, STUDIO_PATH, CONTACT_PATH } from './paths'

const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw'

/**
 * The five materials her own copy names, each carrying a colour taken from
 * her own photographs — hör and kopar from Hús í Garðabæ and Old Charm, eik
 * from the summer house beams, steinn from the Fljótshlíð island, and the
 * wine that is the Súluhöfða kitchen and this site's own accent.
 */
const MATERIALS: ReadonlyArray<GalleryItem> = [
  { id: 'm-hor', name: 'Hör', hex: '#E0D5CD', alt: 'Hör í mjúkum fellingum, grófur vefnaður í dagsbirtu' },
  { id: 'm-kopar', name: 'Kopar', hex: '#D09957', alt: 'Koparflötur með mattri áferð og fínum slípuðum þráðum' },
  { id: 'm-eik', name: 'Eik', hex: '#8E7054', alt: 'Eikarborð með opinni æð og sýnilegri sagaráferð', dark: true },
  { id: 'm-vinraut', name: 'Vínrautt', hex: '#8C3A34', alt: 'Vínrauður mattur lakkflötur með fíngerðri áferð', dark: true },
  { id: 'm-steinn', name: 'Steinn', hex: '#4A3527', alt: 'Dökkur náttúrusteinn með mattri slípun og fínum æðum', dark: true },
]

/* The four layers of the opening, with the reference's own magnitudes:
   70 / 55 / 40 / 10 percent of each plate's height, all driven off one
   progress. 40 belongs to the title, which is why it is absent here — it
   sits between the tall plate and the detail, so the detail crosses in
   front of her name. The boxes are an asymmetric composition rather than a
   centred deck: a wide room low and left, a tall room high and right, a
   detail cutting the middle. */
/* THE DESCENT. You arrive on one of her rooms with the ground barely showing
   at the bottom edge, and scrolling sinks you into it: the photograph rises
   away at 88% of scroll speed while the stone holds at 18%, so the ground
   grows to fill the frame and simply becomes the page. The section below
   carries the same stone, and the fade resolves to flat #4A3527, so there is
   no seam to see — the reference does exactly this into black.

   Depth order follows the physics rather than the layer numbers: the room is
   the NEAR plane (fast, in front), the stone is FAR (slow, behind), and the
   room uncovers the stone as it leaves. The room's box is deliberately short
   of full bleed so the ground shows under it before anything moves. */
const PLATES: ReadonlyArray<PlxPlate> = [
  { id: 'hero-steinn', k: 70, plate: true, pw: 2400, ph: 1768, priority: true,
    alt: '' },
  { id: 'stone-ledge', k: 55, plate: true, pw: 2400, ph: 1768,
    alt: '' },
  { id: 's-eldhus-vitt', k: 10, priority: true, hCss: '94svh', topCss: '0',
    alt: 'Eldhús í Súluhöfða með vínrauðri eyju, koparljósum og útsýni yfir voginn' },
]

/** One from each kind of room she is asked for, travelling sideways. */
/* One from each kind of room she is asked for, travelling sideways — but
   grouped the way Búðir groups its journey rather than run out as an even
   row of cards. Every third stop is a FULL-BLEED slab: the whole viewport
   becomes one photograph with a single corner chip, so the eye gets a
   horizon between the groups instead of a metronome of equal thumbnails.
   Slabs take the widest, most spatial shots; the cards take the details. */
const CHAPTER: ReadonlyArray<HPanel> = [
  { id: 's-eldhus-vitt', title: 'Nýbyggt hús í Súluhöfða', meta: 'Heimili', to: projPath('nybyggt-hus-i-suluhofda'),
    alt: 'Eldhús í Súluhöfða með vínrauðri eyju, koparljósum og útsýni yfir voginn', bleed: true },
  { id: 'p-oldcharm-1', title: 'Old Charm Reykjavik', meta: 'Gistiheimili', to: projPath('old-charm-reykjavik-apartment'),
    alt: 'Svefnherbergi undir upprunalegum timburbitum' },
  { id: 'p-skuggahverfi-0', title: 'Eldhúsrými í Skuggahverfi', meta: 'Heimili', to: projPath('eldhusrymi-i-skuggahverfi'),
    alt: 'Dökkt eldhús með eyju, viðarinnréttingum og innfelldri lýsingu' },
  { id: 'p-alfheimar-0', title: 'Álfheimar', meta: 'Heimili', to: projPath('alfheimar'),
    alt: 'Stofa með dökkum sófa og stóru listaverki á vegg', bleed: true },
  { id: 'p-svala-0', title: 'Svala Apartments', meta: 'Gistiheimili', to: projPath('svala-apartments'),
    alt: 'Gestaherbergi með grænum vegg og listaverki af hesti' },
  { id: 'p-tannlaeknar-0', title: 'Tannlæknastofan Garðatorgi', meta: 'Atvinnuhúsnæði', to: projPath('tannlaeknastofan-gardatorgi'),
    alt: 'Móttaka tannlæknastofu með ljósum afgreiðsluborði' },
  { id: 'p-badherbergi-0', title: 'Baðherbergi', meta: 'Heimili', to: projPath('badherbergi'),
    alt: 'Baðherbergi með sporöskjulaga spegli og dökkri innréttingu', bleed: true },
]
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
      {/* The opening. Her name rises letter by letter out of its own mask,
          the same gesture the footer closes on, so the page opens and ends
          on the one move. Prerendered, so it plays before React exists. */}
      <div className="ki-curtain" aria-hidden="true">
        <div className="ki-curtain-arch">
          <p className="ki-curtain-mark">
            {'KATRÍN ÍSFELD'.split('').map((ch, i) => (
              ch === ' '
                ? <span key={i} className="ki-curtain-sp"> </span>
                : <span key={i} className="ki-curtain-l"><i style={{ ['--i' as string]: i }}>{ch}</i></span>
            ))}
          </p>
          <span className="ki-curtain-rule" />
        </div>
      </div>

      {/* 01 · the layered opening */}
      <ParallaxHero plates={PLATES}>
        <Headline as="h1" className="ki-hero-title" text="Innanhús, hugsað í heild." size={100} floor={36} />
        <p className="ki-hero-sub">
          Katrín Ísfeld, innanhússarkitekt í Reykjavík. Heimili, gistiheimili,
          hótel og atvinnurými, hönnuð frá grunni.
        </p>
        <p className="ki-hero-cta">
          <Link className="ki-cta" to={WORK}>Verkefnin</Link>
          <Link className="ki-cta" to={CONTACT_PATH}>Hafa samband</Link>
        </p>
      </ParallaxHero>

      {/* 02 · intent — standing on the ground the descent just arrived at */}
      <section className="ki-wrap ki-stone" data-ki-band="dark">
        <span className="ki-rule ki-rv" aria-hidden="true" />
        <Headline text="Hvert verkefni fær sinn eigin litheim." size={72} floor={32} measure={780} />
        <p className="ki-body ki-rv">
          Vínrautt og kopar í einu húsi, hör og dagsbirta í öðru. Litirnir á þessari síðu
          eru ekki valdir úr litakorti heldur teknir beint úr verkefnunum sjálfum, eins og
          þau voru ljósmynduð.
        </p>
      </section>

      {/* 02c · one room of each kind, travelling sideways */}
      <HorizontalChapter eyebrow="Þversnið" panels={CHAPTER} />

      {/* 02d · her own sentence from Stúdíóið, stepped down a photograph.
          Not a new claim: this is the line that separates her from someone
          brought in after the builders have gone. */}
      {/* x/y are the reference board's own word positions, as percentages of
          the frame: left, right, left, right — a zigzag down through the top
          sixth to the bottom third, not a stacked headline. */}
      <StatementOverlay
        id="f-eldhus"
        alt="Eldhús sumarhússins í Fljótshlíðinni með viðarbitum og steinborðplötu"
        words={[
          { t: 'Rýmið', x: 21, y: 15 },
          { t: 'er teiknað', x: 46, y: 28 },
          { t: 'með', x: 19, y: 50 },
          { t: 'húsinu.', x: 37, y: 70 },
        ]}
        sub="Ekki lagt ofan á það þegar smíðinni er lokið"
      />

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
                    <CardFigure photos={p.photos} sizes={CARD_SIZES} />
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

      {/* 05b · the same five colours, carried by the materials they came from.
          It lives HERE rather than up under the litheim copy: this is the
          materials section, and the strip was taking a full screen near the
          top of the page for something that reads better as a coda to
          "Efnin bera rýmið" than as an event of its own. */}
      <ImageGallery items={MATERIALS} />

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
          <p className="ki-samband-addr">{ADDRESS_LINE} · {STUDIO.email} · Opnunartími {STUDIO.opens}–{STUDIO.closes} {HOURS_DAYS_IS}, eftir samkomulagi</p>
        </div>
      </section>
    </Shell>
  )
}
