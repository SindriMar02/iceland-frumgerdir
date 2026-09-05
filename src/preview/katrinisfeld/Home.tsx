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
  type HSlide,
} from './kit'
/* 21st.dev @osmosupply/parallax-scrolling, integrated as shipped — GSAP +
   ScrollTrigger, its own yPercent 70/55/40/10 timeline. The stylesheet beside
   it is the one the registry omits, measured off the running demo. */
import { ParallaxComponent, type ParallaxLayer, type ParallaxPlate } from '@/components/ui/parallax-scrolling'
/* 21st.dev WhisperText, in managed mode: the pinned scrub owns its timing */
import { WhisperText } from '@/components/ui/whisper-text'
/* the gate's own light has to be the page's cream to the level, not a second
   near-cream picked by eye — it releases straight onto the section below it */
import { COLOURS } from './styles'
import { STUDIO, ADDRESS_LINE, HOURS_DAYS_IS, SHOWROOM } from './facts'
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
interface Material { id: string; name: string; hex: string; alt: string }
const MATERIALS: ReadonlyArray<Material> = [
  { id: 'm-hor', name: 'Hör', hex: '#E0D5CD', alt: 'Hör í mjúkum fellingum, grófur vefnaður í dagsbirtu' },
  { id: 'm-kopar', name: 'Kopar', hex: '#D09957', alt: 'Koparflötur með mattri áferð og fínum slípuðum þráðum' },
  { id: 'm-eik', name: 'Eik', hex: '#8E7054', alt: 'Eikarborð með opinni æð og sýnilegri sagaráferð' },
  { id: 'm-vinraut', name: 'Vínrautt', hex: '#8C3A34', alt: 'Vínrauður mattur lakkflötur með fíngerðri áferð' },
  { id: 'm-steinn', name: 'Steinn', hex: '#4A3527', alt: 'Dökkur náttúrusteinn með mattri slípun og fínum æðum' },
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
/* WHAT CARRIES ON BELOW A PLATE.
   The plate is sized off the viewport's WIDTH and travels a distance measured
   in screen HEIGHTS, so its own image cannot cover the whole descent on a
   phone — something has to continue past its last row. That used to be a
   separate rock tile, repeated; and a tile repeats. Even at a four-level
   range the mirror symmetry inside one was legible in a near-black field, so
   the bottom of the descent was the same shape down the screen over and over.
   It is the plate's own last rows now, mirrored ONCE and butted to its own
   bottom edge — the same row of pixels meeting itself, seamless by
   construction rather than by encoding — and then FLOOR, which is the colour
   those rows already resolve to. Nothing is tiled anywhere on this page. */
/* 3.5 levels UNDER the page's charcoal, deliberately. The tail below every
   plate carries a grain overlay, and overlay is not quite mean-neutral on a
   base this dark — measured, it lifted the region to 30.5 against the hem's
   27, a faint line inside the way out's rest frame. Fill plus grain now lands
   on 27, which is what the hem is and what the page is. */
const FLOOR = '#181614'

const HERO_PLATES: ReadonlyArray<ParallaxPlate> = [
  { layer: '2', src: `${ASSET}/stone-far.webp`,  width: 2400, height: 3800,
    crest: 0.0488, restAt: 0.86, travel: -1.43, fill: FLOOR },
  { layer: '5', src: `${ASSET}/stone-mid.webp`,  width: 2400, height: 3800,
    crest: 0.0523, restAt: 0.88, travel: -1.82, fill: FLOOR },
  { layer: '4', src: `${ASSET}/stone-near.webp`, width: 2400, height: 3800,
    crest: 0.0559, restAt: 0.90, travel: -2.25, fill: FLOOR },
]

/* THE WAY OUT.
   Not the descent's own plates mirrored — that read as a copy pasted at the
   far end of the page. These are the stacked shelves, a different formation
   from the standing columns that just came up, flipped so the body hangs
   above the silhouette and the edge lifts UP and out of the frame.

   It begins entirely covered by its own tail, which is the floor colour the
   descent ends on, so the hand-over into it has nothing in it at all; it
   ends on a band of rock along the top with her light underneath, and that
   band scrolls away with the pin. Start to finish the stone is now the hero
   and this, and nothing else on the page is dark until the contact block. */
const EXIT_PLATES: ReadonlyArray<ParallaxPlate> = [
  /* The plate is built from the full height of its source now (3211 rows;
     the old crop kept 1461 and threw away the rest), so turned over there is
     ~1900px of dark rock above the lit band on a 1490-wide frame instead of
     ~550 — the rest frame is the photograph's own floor, not the fill.

     Rest positions are re-derived from that lit band rather than copied from
     the descent: it is 1050 source px above the crest, which is 0.44 of a
     frame at 1490x1230 and 0.70 at 1280x800, and it has to be entirely below
     the frame at rest on all of them. 1.75 clears it everywhere with margin;
     the ratio of the three is the descent's own. The light shows once the
     near crest clears the frame bottom, at 0.45 of the scrub. */
  { layer: '2', src: `${ASSET}/gate-far.webp`,  width: 2400, height: 3211,
    crest: 0.0654, restAt: 1.40, travel: -1.26, fill: FLOOR, flip: true },
  { layer: '5', src: `${ASSET}/gate-mid.webp`,  width: 2400, height: 3211,
    crest: 0.0640, restAt: 1.55, travel: -1.43, fill: FLOOR, flip: true },
  { layer: '4', src: `${ASSET}/gate-near.webp`, width: 2400, height: 3211,
    crest: 0.0647, restAt: 1.75, travel: -1.65, fill: FLOOR, flip: true },
]

/* THE COLOUR WORLDS, under the sentence that claims them.
   The gate's headline says every project gets its own — and had nothing
   beneath it but cream, which is a claim with no evidence. Three rooms, each
   named with the two materials it is built from, drawn from the specimens the
   descent just showed: the same five names, now in the rooms they came out
   of. Three, not seven: the journey below is the seven. */
const WORLDS = [
  { id: 's-eldhus-vitt', slug: 'nybyggt-hus-i-suluhofda', title: 'Súluhöfði',
    pair: 'Vínrautt og kopar', hexes: ['#8C3A34', '#D09957'],
    alt: 'Vínrauð eldhúseyja undir koparljósum í Súluhöfða' },
  { id: 'f-stofa', slug: 'sumarhus-i-fljotshlidinni', title: 'Fljótshlíðin',
    pair: 'Eik og hör', hexes: ['#8E7054', '#E0D5CD'],
    alt: 'Stofa sumarhússins með hörgardínum og viðarbitum' },
  { id: 'p-skuggahverfi-0', slug: 'eldhusrymi-i-skuggahverfi', title: 'Skuggahverfi',
    pair: 'Steinn og dagsbirta', hexes: ['#4A3527', '#C9C3B8'],
    alt: 'Dökkt eldhús í Skuggahverfi með steineyju og innfelldri lýsingu' },
]

/* THE JOURNEY, as slides rather than cards.
   Ten of them, widths mixed the way the spec requires so an edge is always
   visible before you arrive: 100vw spreads against 85.7vw full-bleeds, one
   plate sized in svh so it scales with the viewport's HEIGHT and keeps its
   crop on a short wide window, and a close on a full-bleed under a scrim.
   Every project she has photographed for this page appears exactly once. */
const JOURNEY: ReadonlyArray<HSlide> = [
  { kind: 'intro', eyebrow: 'Þversnið', count: 7,
    title: 'Eitt rými af hverri gerð.',
    body: 'Heimili, gistiheimili og atvinnurými — hvert með sínum litheimi, ' +
      'og sama höndin í gegnum þau öll. Skrunaðu áfram.' },

  { kind: 'bleed', id: 's-eldhus-vitt', no: 'I',
    title: 'Nýbyggt hús í Súluhöfða', meta: 'Heimili', to: projPath('nybyggt-hus-i-suluhofda'),
    alt: 'Eldhús í Súluhöfða með vínrauðri eyju, koparljósum og útsýni yfir voginn' },

  { kind: 'split', id: 'p-oldcharm-1',
    title: 'Old Charm Reykjavik', meta: 'Gistiheimili', to: projPath('old-charm-reykjavik-apartment'),
    alt: 'Svefnherbergi undir upprunalegum timburbitum',
    body: 'Upprunalegu bitarnir fengu að standa og allt annað var teiknað í kringum þá.' },

  { kind: 'bleed', id: 'p-skuggahverfi-0', no: 'II',
    title: 'Eldhúsrými í Skuggahverfi', meta: 'Heimili', to: projPath('eldhusrymi-i-skuggahverfi'),
    alt: 'Dökkt eldhús með eyju, viðarinnréttingum og innfelldri lýsingu' },

  { kind: 'duo',
    a: { id: 'p-alfheimar-0', title: 'Álfheimar', meta: 'Heimili', to: projPath('alfheimar'),
         alt: 'Stofa með dökkum sófa og stóru listaverki á vegg' },
    b: { id: 'p-svala-0', title: 'Svala Apartments', meta: 'Gistiheimili', to: projPath('svala-apartments'),
         alt: 'Gestaherbergi með grænum vegg og listaverki af hesti' } },

  /* the turn: the one inverted slide, and the only dark moment in the light
     half of the page apart from the Italian band */
  { kind: 'plate',
    line: 'Sama höndin liggur í gegnum þau öll.',
    sub: 'Ólík hús, ólíkir litheimar — eitt handbragð',
    /* the accent each of these rooms actually is, read off her own
       photographs — the slide's claim, shown rather than asserted */
    spectrum: [
      { id: 's-eldhus-vitt', title: 'Súluhöfði' },
      { id: 'p-oldcharm-1', title: 'Old Charm' },
      { id: 'p-skuggahverfi-0', title: 'Skuggahverfi' },
      { id: 'p-alfheimar-0', title: 'Álfheimar' },
      { id: 'p-svala-0', title: 'Svala' },
      { id: 'p-badherbergi-0', title: 'Baðherbergi' },
      { id: 'p-tannlaeknar-0', title: 'Garðatorg' },
    ] },

  { kind: 'bleed', id: 'p-badherbergi-0', no: 'III',
    title: 'Baðherbergi', meta: 'Heimili', to: projPath('badherbergi'),
    alt: 'Baðherbergi með sporöskjulaga spegli og dökkri innréttingu' },

  { kind: 'split', id: 'p-tannlaeknar-0',
    title: 'Tannlæknastofan Garðatorgi', meta: 'Atvinnuhúsnæði', to: projPath('tannlaeknastofan-gardatorgi'),
    alt: 'Móttaka tannlæknastofu með ljósum afgreiðsluborði',
    body: 'Atvinnurými sem á að róa fólk fær sömu efnisákvörðun og heimili.' },

  { kind: 'close', id: 's-sturta', to: WORK, cta: `Öll ${PROJECTS.length} verkin`,
    alt: 'Sturturými með dökkum steinvegg og grænni plöntu',
    line: 'Ekkert af þessu var valið úr bæklingi.' },
]

const ORDER = Object.keys(CATEGORIES) as CategorySlug[]
const SHOWN = 6
/* She publishes no dates, so "newest" is the project she lists first — the
   new-build, the one every other section already treats as the current one.
   If she ever tells us otherwise, this is the one line to change. */
const NEWEST = PROJECTS[0]
const NEWEST_PHOTO = 's-eldhus-vitt'

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
      {/* 01 · the descent — and THE OPENING. There is no curtain: the page
          opens on the stone itself and the stone sinks to uncover her name
          and the room. See ParallaxProps.intro. */}
      <ParallaxComponent
        layers={HERO_ROOM}
        plates={HERO_PLATES}
        sticky
        smooth
        intro
        /* her photograph and then a tonne of stone: the header is light over
           all of it, and this is what tells it so */
        band="dark"
        /* 210, not 240: the swallow is done by 0.4 and the specimens are set
           down by 0.9, and the rest was dark with nothing in it. Travel is in
           frame heights, so a shorter pin only changes how much scroll the
           same move takes — the geometry is identical. */
        scroll="210svh"
        deepAt={0.5}
        titleYPercent={-55}
        title={
          <div className="ki-plx-scene">
            {/* her name, not a headline — a sentence has to be read, a name
                only has to be seen, and this one is going under the stone */}
            <div className="ki-plx-lockup">
              <h1 className="ki-plx-name">Katrín Ísfeld</h1>
              <p className="ki-plx-role">innanhússarkitekt</p>
              {/* The four things she actually draws, named. The first draft
                  was a triad of room types joined by a dash to an abstraction
                  — the shape every generated tagline has. This one lists real
                  deliverables from her own services page and stops. It is the
                  lowest line in the lockup, so it is the first thing the
                  rising stone takes. */}
              <p className="ki-plx-tag">
                Skipulag, innréttingar, efnisval og lýsing, teiknað í einu lagi.
              </p>
            </div>
          </div>
        }
        /* THE NEWEST PROJECT, resting on the ground in the corner. A small
           photograph, the name, and an arrow that keeps nudging — the one
           thing on the landing frame that asks to be clicked. It rides above
           the planes and is gone by a fifth of the descent. */
        corner={
          <Link className="ki-newest" to={projPath(NEWEST.slug)}>
            <span className="ki-newest-fig">
              <Photo id={NEWEST_PHOTO} alt="" sizes="140px" />
            </span>
            <span className="ki-newest-text">
              <span className="ki-newest-kicker">Nýjasta verkefnið</span>
              <span className="ki-newest-title">{NEWEST.title}</span>
            </span>
            <span className="ki-newest-arrow" aria-hidden="true" />
          </Link>
        }
        /* WHAT IS DOWN HERE: the materials, as strata.
           The descent has put the visitor inside a material, and the one
           thing that is true at that depth is her palette — five materials
           whose colours are taken from the projects themselves, not from a
           chart. They arrive as five layers of real material, stacked the way
           rock is, each with its name and the exact colour the site uses for
           it. It is "Efnin bera rýmið" said where it can be shown rather than
           asserted, and it ends on the one sentence a screen cannot deliver:
           the samples are in the studio. */
        deep={
          <div className="ki-plx-deep ki-plx-deep--strata">
            <p className="ki-plx-deep-kicker">Rýmið man</p>
            <WhisperText as="h2" text="Efnin bera rýmið." className="ki-strata-title" managed />
            {/* SPECIMENS, NOT A TABLE. Five samples standing on a shelf: cut to
                no two the same height, a hairline mount around each, and the
                name set BELOW the material rather than on it, so the material
                is only ever itself. The first version was five equal bands in
                a box with the label printed across them — a colour picker. */}
            <ul className="ki-strata">
              {MATERIALS.map((m) => (
                <li key={m.id} className="ki-stratum" data-parallax-stagger>
                  <figure className="ki-stratum-fig">
                    {/* priority: these live inside the pinned hero, so they are
                        on screen from the first frame — lazy meant five large
                        photographs decoding mid-scroll, which is the other half
                        of the flashing */}
                    <Photo id={m.id} alt={m.alt} priority
                      sizes="(max-width: 640px) 60vw, (max-width: 860px) 40vw, 190px" />
                  </figure>
                  <span className="ki-stratum-name">{m.name}</span>
                  <span className="ki-stratum-hex">{m.hex}</span>
                </li>
              ))}
            </ul>
            <p className="ki-strata-line">
              Steinn sem heldur skugganum, viður sem heldur hitanum, kopar sem eldist
              með húsinu. Efnisvalið er helmingur hönnunarinnar; ljósið sér um hitt.
            </p>
            <p className="ki-plx-deep-cta">
              <Link className="ki-cta" to={CONTACT_PATH}>Sýnishornin eru í stúdíóinu</Link>
            </p>
          </div>
        }
      />

      {/* the same strata, in flow, for reduced motion only: the descent
          collapses to one still frame there and its arriving copy is hidden,
          because it would sit on top of her name. This is where those
          visitors get the materials instead. Hidden from assistive tech, so
          the page does not announce the heading twice. */}
      <section className="ki-strata-static" aria-hidden="true" data-ki-band="dark">
        <p className="ki-plx-deep-kicker">Rýmið man</p>
        <p className="ki-strata-title">Efnin bera rýmið.</p>
        <ul className="ki-strata">
          {MATERIALS.map((m) => (
            <li key={m.id} className="ki-stratum">
              <figure className="ki-stratum-fig">
                <Photo id={m.id} alt="" sizes="(max-width: 860px) 44vw, 170px" />
              </figure>
              <span className="ki-stratum-name">{m.name}</span>
              <span className="ki-stratum-hex">{m.hex}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 02 · THE WAY OUT — fired the moment the descent finishes.
          The stone is the shortest thing on the page: the ground rises and
          takes the room, and the page comes straight back out into her light.
          Everything below this is light until the Italian lines, and there is
          no second stone event anywhere. The chapter's own heading rides it
          and lands on the cream, because a sentence about every project having
          its own colour world is exactly what the light arriving is FOR. */}
      <ParallaxComponent
        plates={EXIT_PLATES}
        sticky
        smooth
        gate
        /* dark while it is stone, and it flips itself to light as the cream
           arrives — the handoff happens inside this one section */
        band="dark"
        /* 170: the light shows once the near plate's crest clears the frame's
           bottom, 0.6 of the way through, and at 240svh that was 670px of
           dark rock between the last line on the stone and the first light —
           "the stone background lasts too long after Efnin bera rýmið". At 170
           it is 340px, and the whole lift is over in 560. */
        scroll="170svh"
        backdrop={`linear-gradient(to bottom, ${COLOURS.CREAM} 0%, #F7F3EC 54%, ${COLOURS.CREAM} 100%)`}
        ground={COLOURS.CREAM}
        deepAt={0.66}
        deepBehind
        deep={
          <div className="ki-gate-deep">
            <span className="ki-gate-rule" aria-hidden="true" />
            <WhisperText as="h2" text="Hvert verkefni fær sinn eigin litheim." className="ki-gate-title" managed />
            <p className="ki-gate-body">
              Litirnir eru ekki valdir úr litakorti heldur teknir beint úr verkefnunum
              sjálfum, eins og þau voru ljósmynduð.
            </p>
            <ul className="ki-worlds">
              {WORLDS.map((w) => (
                <li key={w.slug} data-parallax-stagger>
                  <Link to={projPath(w.slug)}>
                    <span className="ki-worlds-fig">
                      <Photo id={w.id} alt={w.alt} sizes="(max-width: 860px) 40vw, 250px" />
                    </span>
                    <span className="ki-worlds-meta">
                      <span className="ki-worlds-title">{w.title}</span>
                      <span className="ki-worlds-pair">
                        {w.hexes.map((h) => (
                          <i key={h} style={{ background: h }} aria-hidden="true" />
                        ))}
                        {w.pair}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* 03 · the journey sideways — one room of each kind she is asked for */}
      <HorizontalChapter slides={JOURNEY} />

      {/* 04 · her own sentence from Stúdíóið, stepped down a photograph. Not
          a new claim: this is the line that separates her from someone
          brought in after the builders have gone — and it sits right after
          the work, as the reason the work looks the way it does. */}
      <StatementOverlay
        id="f-eldhus"
        alt="Eldhús sumarhússins í Fljótshlíðinni með viðarbitum og steinborðplötu"
        eyebrow="Aðferðin"
        /* SOLVED, NOT CHOSEN. Each word sits on the quietest, darkest box in
           its own band of this photograph at this crop, found on the 98th
           percentile so one specular highlight cannot veto a clean wall.
           See the note on .ki-stmt — re-solve if the photograph changes. */
        words={[
          { t: 'Rýmið', x: 5.6, y: 9.0 },
          { t: 'er teiknað', x: 42.3, y: 28.9 },
          { t: 'með', x: 9.0, y: 49.0 },
          { t: 'húsinu.', x: 40.7, y: 66.9 },
        ]}
        sub="Ekki lagt ofan á það þegar smíðinni er lokið"
      />

      {/* 05 · one project in full, so the work has a floor */}
      <section className="ki-wrap" data-ki-band="light">
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

      {/* 06 · the work, clustered by buyer type — the ONLY listing on the
          page. The register that duplicated it is gone; whatever a cluster
          cannot show as a card it names in a line, so nothing she has
          published is missing from the page. */}
      <section className="ki-wrap" id="verkefni" data-ki-band="light">
        <div className="ki-measure" style={{ marginBottom: 'calc(var(--u) * 60)' }}>
          <p className="ki-kicker">Verkefni</p>
          <Headline text="Heimili, gistiheimili, hótel og atvinnurými." size={78} floor={32} measure={880} />
          <p className="ki-body ki-rv">
            {PROJECTS.length} verk í skránni, í fjórum flokkum. Hér er úrval úr hverjum
            flokki fyrir sig, hvert með sinni eigin ljósmynd.
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
                      <CardFigure photos={p.photos} sizes={CARD_SIZES} />
                      <div className="ki-card-meta">
                        <span className="ki-card-name"><Link to={projPath(p.slug)}>{p.title}</Link></span>
                      </div>
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
        <p className="ki-cta-row ki-rv"><Link className="ki-cta" to={WORK}>Öll {PROJECTS.length} verkin</Link></p>
      </section>

      {/* 07 · the Italian lines, and the studio they are standing in.
          One warm dark band in the light run — the commercial section earns
          the emphasis, and it stops nine thousand pixels of cream going flat.
          The showroom used to live only on the contact page; here it follows
          the materials the page has already put in the visitor's hands. */}
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
        <div className="ki-split ki-italskar-studio">
          <Slide id={SHOWROOM.photo} alt={SHOWROOM.alt} sizes="(max-width: 860px) 92vw, 42vw" className="ki-split-fig" variant="shutter" />
          <div>
            <p className="ki-kicker">Stúdíóið við {STUDIO.street}</p>
            <Headline text={SHOWROOM.lead} size={54} floor={28} measure={600} />
            <p className="ki-body ki-rv">{SHOWROOM.body}</p>
            <p className="ki-cta-row ki-rv">
              <Link className="ki-cta" to={CONTACT_PATH}>Finna tíma í stúdíóinu</Link>
            </p>
          </div>
        </div>
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
