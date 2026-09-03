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
import { ParallaxComponent, type ParallaxLayer } from '@/components/ui/parallax-scrolling'
/* the 21st.dev prebuiltui/image-gallery accordion, installed with the shadcn
   CLI and pointed at her materials — see the note on the component */
import ImageGallery, { type GalleryItem } from '@/components/ui/image-gallery'
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

/* The three image layers, on the reference's own numbering — reinterpreted
   so the layer stack is one coherent physical scene instead of two unrelated
   pictures on a timer. In the reference, layers 1/2/4 are the SAME
   photograph pre-cut into depth bands; here, layers 1/2/4 are three
   overlapping crops of ONE Higgsfield stone-material generation (2880x5120,
   raking light, deepening from a legible detailed surface at the bottom of
   the source toward near-black at the top), so their veins and lighting are
   literally the same pixels, not three separate renders pretending to match.
   Layer 1 = the deepest crop (darkest, dominates once yPercent 70 pulls it
   back into view), layer 2 = the middle crop, layer 4 = the nearest crop,
   masked to a soft feathered sliver so only ~14% of the viewport shows at
   rest. The kitchen photo is no longer one of these three — it now rides
   layer 3 (the title slot), where the reference puts its subject, so the
   room sits IN the stone environment rather than under a stone curtain. */
const HERO_LAYERS: ReadonlyArray<ParallaxLayer> = [
  /* Layer 1 — the room. A full-bleed OPAQUE backdrop on the registry's own
     geometry, exactly what the reference puts on its layer 1. It is not
     masked or faded at any edge: the previous version feathered its top,
     which let the stone through ABOVE the kitchen and built a cave ceiling.
     yPercent 70 leaves it nearly static on screen — the world stays put
     while the camera descends past the foreground. */
  /* Skuggahverfi, not Súluhöfða. Two reasons, both measured rather than
     preferred. The wordmark carries no scrim any more, and cream type over
     the Súluhöfða kitchen scored a worst-case contrast of 1.09 where it
     crossed the window and the fjord — invisible. Every band of this one
     scores 11.5 to 12.2, because the island is a dark mass and the light is
     behind it. And thematically it already contains the idea: the island IS
     a monolithic dark stone volume in the foreground, so the stone that
     rises continues the photograph's own material instead of contradicting
     it, and the descent from a dark room into dark rock is one tonal
     journey rather than a bright room being buried. Cropped 1604x1178 from
     her own 2400 original — native resolution, no upscale — at almost
     exactly the layer box's aspect, so cover barely trims it. */
  { layer: '1', width: 1604, height: 1178,
    src: `${ASSET}/hero-skuggahverfi.webp`,
    alt: 'Eldhúsrými í Skuggahverfi: dökk steineyja í forgrunni, viðarinnrétting og dagsbirta handan hennar',
    /* pinned, the page no longer drags the layers, so the distant plane is
       only as still as its own tween: a few percent of drift, no scale. A
       scaled photograph reads as a zoom, which is the thing this hero was
       accused of doing and the thing it must not do. */
    yPercent: 5 },

  /* Layer 4 — the stone. ONE monolithic mass of honed basalt, quarried and
     dressed, with a single clean fractured top edge: the kind of stone she
     would actually specify. The first attempt at this was a lava field, and
     a lava field is loose aggregate — rising over her kitchen it read as a
     construction site, which is the opposite of what the page sells. The
     background above the block is keyed off (block 31-57 luminance, ground
     224-233), so the silhouette is the stone's own fracture line rather than
     a curve drawn in a mask.

     It is NOT full-bleed. It enters from the BOTTOM EDGE only: at rest its
     edge sits at ~89% of the viewport, so the room keeps the frame. Scroll
     rises it and scales it about its top edge — the camera descending toward
     stone it is about to pass under — until it occludes the room from the
     bottom upward. Its own deeper material is graded into #1d1b19, so the
     descent lands on the site's ground colour through the material rather
     than a black overlay dropped on top. */
  /* THE TWO STONE PLANES. Same photographed block, so the material is one
     material; the far one is mirrored so it is not a literal repeat of the
     near one. They differ only in where they sit and how fast they rise —
     750px against 500px over the descent — and that ratio IS the depth. It
     is the same relationship the reference has between its own layers 4 and
     2, and it is the only thing that makes a flat plane read as near.

     NO SCALE, on either. Scale about a top origin grows the plate sideways
     too — 1280px of width became 1920 — and that lateral growth is the most
     legible thing on screen, so the whole effect read as zooming into the
     rock instead of the rock drifting up. The scale was only ever propping
     up a plate too short to keep the frame covered by translation alone.

     The plate is now the keyed edge crossfaded into a second Higgsfield
     render — a continuous basalt face lit at the top and falling to true
     black — so the body below the edge is REAL MATERIAL the whole way down,
     darkening because the light stops reaching it. It used to be a 2x
     vertical stretch of one strip washed to flat colour, which is why the
     second half of the descent was empty rather than stone. Its deepest
     region is graded onto #1d1b19 so the pin releases straight onto the
     page's own ground.

     THE TRAVEL HAS TO REACH THE DARK. The plate was 1600px rendered and the
     travel 750px, so the last frame of the descent was showing plate rows
     6.9% to 56.9% — and the falloff into ground colour did not start until
     62%. The descent literally never reached the dark part of its own
     material: it ended on lit rock and then cut to the page. The plate is
     2600px rendered now with the falloff running 20% to 67%, and the travel
     is 2400px, which puts the final frame at rows 67.7% to 98.5% — entirely
     ground colour. So it darkens the whole way down and lands on #1d1b19
     with nothing left to seam against. */

  /* far plane — behind, slower, mostly swallowed by the near one */


  /* near plane — the ground the camera actually descends past. Pinned, the
     page supplies none of the travel, so the rise is entirely this tween:
     -78% of its own height carries the edge from 89% of the viewport to just
     above the top, with 851px of stone still under it on an 800px frame. */
  /* THREE PLANES, one photograph. All three are windows cut at different
     horizontal offsets from the same graded basalt (one mirrored), so no two
     crests line up and it never reads as the same picture repeated — but the
     rock, its light and its scale are literally identical, because they are
     the same pixels. Depth is carried by the travel: 1400 / 1780 / 2200 over
     the descent, far to near. That ratio IS the depth; nothing is scaled.

     Their crests sit 86% / 88% / 90% down at rest, so the ground shows as a
     layered 14% band at the bottom and the room keeps the frame. */
  { layer: '2', width: 2400, height: 5850,
    src: `${ASSET}/stone-far.webp`, alt: '',
    yPercent: -44.9,
    geom: { top: '-10.5%', height: 'auto', aspectRatio: '2400 / 5850' } },
  { layer: '5', width: 2400, height: 5850,
    src: `${ASSET}/stone-mid.webp`, alt: '',
    yPercent: -57.1,
    geom: { top: '-8.5%', height: 'auto', aspectRatio: '2400 / 5850' } },
  { layer: '4', width: 2400, height: 5850,
    src: `${ASSET}/stone-near.webp`, alt: '',
    yPercent: -70.5,
    geom: { top: '-6.5%', height: 'auto', aspectRatio: '2400 / 5850' } },
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
        layers={HERO_LAYERS}
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
            <p className="ki-plx-deep-line">
              Efnin bera rýmið. Steinn, eik, hör og kopar — valin úr
              verkefnunum sjálfum, ekki úr litakorti.
            </p>
            <p className="ki-plx-deep-cta">
              <Link className="ki-cta" to={WORK}>Verkefnin</Link>
            </p>
          </div>
        }
      />

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
