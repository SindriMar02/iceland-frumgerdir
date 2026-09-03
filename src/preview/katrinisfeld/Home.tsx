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
  Headline, Photo, Slide, CardFigure, HorizontalChapter, StatementOverlay,
  type HPanel,
} from './kit'
/* 21st.dev @osmosupply/parallax-scrolling, integrated as shipped — GSAP +
   ScrollTrigger, its own yPercent 70/55/40/10 timeline. The stylesheet beside
   it is the one the registry omits, measured off the running demo. */
import { ParallaxComponent, type ParallaxLayer, type ParallaxPlate } from '@/components/ui/parallax-scrolling'
/* the 21st.dev prebuiltui/image-gallery accordion, installed with the shadcn
   CLI and pointed at her materials — see the note on the component */
import ImageGallery, { type GalleryItem } from '@/components/ui/image-gallery'
/* the gate's own light has to be the page's cream to the level, not a second
   near-cream picked by eye — it releases straight onto the section below it */
import { COLOURS } from './styles'
import { STUDIO, ADDRESS_LINE, HOURS_DAYS_IS } from './facts'
import { CATEGORIES, PROJECTS, byCategory, hasPage, type CategorySlug } from './projects'
import { category as catPath, project as projPath, WORK, BRANDS_PATH, STUDIO_PATH, CONTACT_PATH } from './paths'

const ASSET = `${import.meta.env.BASE_URL}katrinisfeld`
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

/* THE TWO GATES.
   The page opens by descending into rock and returns to the light by climbing
   back out of it, and both moves are the same component, the same photograph
   and the same grade — only the direction, the formation and what is behind
   the stone differ. In the reference, layers 1/2/4 are one photograph pre-cut
   into depth bands; here layer 1 is the world behind (her kitchen at the
   entry, the light at the exit) and 2/5/4 are three windows cut at different
   horizontal offsets from ONE Higgsfield basalt generation, one of them
   mirrored, so no two crests line up and it never reads as the same picture
   repeated — but the rock, its light and its scale are literally identical,
   because they are the same pixels.

   Everything about a plate is expressed in FRAME HEIGHTS (see ParallaxPlate).
   The previous geometry was written in percentages of a box sized by aspect
   ratio, which ties the whole effect to viewport WIDTH: at 390x844 the crest
   that should sit at 90% of the frame sat at 21%, so the phone opened on a
   wall of rock, and the descent then ran out of travel 90px short of the top.
   Nothing here is scaled — the 1.75 / 2.225 / 2.75 travel ratio IS the depth,
   and a scaled plate reads as a zoom into the rock rather than rock drifting
   past the camera. */

/* Layer 1 — the room. A full-bleed OPAQUE backdrop on the registry's own
   geometry, exactly what the reference puts on its layer 1. It is not masked
   or faded at any edge: an earlier version feathered its top, which let the
   stone through ABOVE the kitchen and built a cave ceiling.

   Skuggahverfi, not Súluhöfða. Two reasons, both measured rather than
   preferred. The wordmark carries no scrim any more, and cream type over the
   Súluhöfða kitchen scored a worst-case contrast of 1.09 where it crossed the
   window and the fjord — invisible. Every band of this one scores 11.5 to
   12.2, because the island is a dark mass and the light is behind it. And
   thematically it already contains the idea: the island IS a monolithic dark
   stone volume in the foreground, so the stone that rises continues the
   photograph's own material instead of contradicting it, and the descent from
   a dark room into dark rock is one tonal journey rather than a bright room
   being buried. Cropped 1604x1178 from her own 2400 original — native
   resolution, no upscale — at almost exactly the layer box's aspect. */
const HERO_ROOM: ReadonlyArray<ParallaxLayer> = [
  { layer: '1',
    src: `${ASSET}/hero-skuggahverfi.webp`,
    alt: 'Eldhúsrými í Skuggahverfi: dökk steineyja í forgrunni, viðarinnrétting og dagsbirta handan hennar',
    /* pinned, the page no longer drags the layers, so the distant plane is
       only as still as its own tween: a few percent of drift, no scale */
    yPercent: 5 },
]

/* THE DESCENT. Three planes of columnar basalt whose crests sit at 86 / 88 /
   90% of the frame at rest, so the ground shows as a layered 14% band along
   the bottom and the room keeps the frame. They rise 1.75 / 2.225 / 2.75
   frames over the pin, far to near, and the near one overtakes the other two
   on the way up — which is what makes three flat planes read as depth.

   Each plate's body is REAL MATERIAL the whole way down, darkening because
   the light stops reaching it, and its own last rows resolve to the colour in
   `fill`, which then continues below the image for as far as the frame needs.
   So the descent lands on the page's own ground through the material rather
   than on a black overlay dropped on top of it, and there is nothing left to
   seam against. */
const FLOOR = '#1D1B19'
const HERO_PLATES: ReadonlyArray<ParallaxPlate> = [
  { layer: '2', src: `${ASSET}/stone-far.webp`,  width: 2400, height: 2800,
    crest: 0.0662, restAt: 0.86, travel: -1.75,  fill: FLOOR },
  { layer: '5', src: `${ASSET}/stone-mid.webp`,  width: 2400, height: 2800,
    crest: 0.0709, restAt: 0.88, travel: -2.225, fill: FLOOR },
  { layer: '4', src: `${ASSET}/stone-near.webp`, width: 2400, height: 2800,
    crest: 0.0758, restAt: 0.90, travel: -2.75,  fill: FLOOR },
]

/* THE ASCENT — the same move turned over.
   Where the dark chapter hands back to the light one, the page climbs out of
   the rock instead of cutting to a white template: the planes SINK, the sky
   arrives from above behind them, and the ridges peel away one at a time
   until there is only light. A different formation on purpose — stacked
   basalt shelves rather than the entry's standing columns — so it reads as
   somewhere else in the same quarry rather than as the landing page mirrored.

   At rest every crest is above the frame and the near plane's own floor
   fills it, which is the exact colour the dark chapter above is painted in,
   so the gate begins as a continuation of the page rather than as a section.
   They clear the bottom at 0.60 / 0.75 / 0.90 of the scrub, near first —
   nearest things move fastest — leaving a tenth of the pin as pure light
   before it releases into the cream below.

   THE MIDDLE PLANE SITS WHERE IT DOES TO KEEP THE THREE APART. Three crests
   moving at three speeds cross each other three times, and the first set of
   numbers put all three crossings inside p 0.34-0.48: for a third of the
   descent the ridges lay on top of one another and the whole thing read as
   ONE cliff sinking, which is what two of the three planes are there to
   prevent. Pulling the middle plane up to -0.62 and slowing it to match
   spreads the crossings to 0.17 / 0.40 / 0.57, so from a third of the way
   down there are three and then four distinct bands in the frame — near
   ridge, middle ridge, far ridge, sky — and they peel off the bottom one at
   a time. That staggering IS the depth; nothing here is scaled. */
const EXIT_PLATES: ReadonlyArray<ParallaxPlate> = [
  { layer: '2', src: `${ASSET}/gate-far.webp`,  width: 2400, height: 1461,
    crest: 0.1438, restAt: -0.06, travel: 1.178, fill: FLOOR },
  { layer: '5', src: `${ASSET}/gate-mid.webp`,  width: 2400, height: 1461,
    crest: 0.1406, restAt: -0.62, travel: 2.16,  fill: FLOOR },
  { layer: '4', src: `${ASSET}/gate-near.webp`, width: 2400, height: 1461,
    crest: 0.1423, restAt: -0.75, travel: 2.917, fill: FLOOR },
]


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

      {/* 01 · the descent */}
      <ParallaxComponent
        layers={HERO_ROOM}
        plates={HERO_PLATES}
        sticky
        smooth
        titleYPercent={-55}
        title={
          <div className="ki-plx-scene">
            {/* her name, not a headline — a sentence has to be read, a name
                only has to be seen, and this one is going under the stone */}
            <div className="ki-plx-lockup">
              <h1 className="ki-plx-name">Katrín Ísfeld</h1>
              <p className="ki-plx-role">innanhússarkitekt</p>
            </div>
          </div>
        }
        /* arrives once the frame is stone rather than room — the page's own
           name, said at the point the descent has actually reached the
           material it is named after */
        deep={
          <div className="ki-plx-deep">
            <p className="ki-plx-deep-kicker">Rýmið man</p>
            {/* it used to open on "Efnin bera rýmið", which is the heading the
                light chapter arrives on further down the page — the same
                sentence twice, once here and once there */}
            <p className="ki-plx-deep-line">
              Steinn, eik, hör og kopar. Efnin eru valin úr verkefnunum
              sjálfum, ekki úr litakorti.
            </p>
            <p className="ki-plx-deep-cta">
              <Link className="ki-cta" to={WORK}>Verkefnin</Link>
            </p>
          </div>
        }
      />

      {/* THE BEDROCK.
          Everything between the two gates is INSIDE the rock, so it is laid on
          the rock: the same photograph both gates are cut from, taken from
          well below the crest where there is no sky in it, on the same grade,
          crushed to a texture rather than a picture. The sections inside give
          up their own flat darks to it (see .ki-bedrock in styles.ts) so it is
          one continuous surface from the bottom of the descent to the top of
          the ascent, not a stack of charcoal boxes. It fades in from flat
          charcoal at the top and back to flat at the bottom, so neither gate
          has a texture edge to cross. */}
      <div className="ki-bedrock">
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
      </div>

      {/* 04b · THE GATE OUT.
          The descent's own move, turned over. The stacked shelves sink, her
          own light arrives from above behind them, and the ridges peel away
          one at a time until the frame is the cream the rest of the page is
          set on — which is the section immediately below, so the pin releases
          onto the colour it has already finished on.

          The heading rides it rather than sitting in the section underneath:
          it is the sentence the light chapter is about, and it should be said
          at the moment the light gets there. Behind the near plane, so a ridge
          that has not sunk past it yet crosses in front of the type. */}
      <ParallaxComponent
        plates={EXIT_PLATES}
        sticky
        smooth
        gate
        backdrop={`linear-gradient(to bottom, #FBF8F2 0%, ${COLOURS.CREAM} 62%)`}
        ground={COLOURS.CREAM}
        deepAt={0.6}
        deepBehind
        deep={
          <div className="ki-gate-deep">
            <span className="ki-gate-rule" aria-hidden="true" />
            <h2 className="ki-gate-title">Efnin bera rýmið.</h2>
          </div>
        }
      />

      {/* 05 · the dome: materials. Its heading is the one the gate above
          arrives on — saying it twice, forty pixels apart, would undo it. */}
      <section className="ki-dome" data-ki-band="light">
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
