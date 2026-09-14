/**
 * Real content harvested from the live Airbnb listing (room 897747788867680607),
 * 2026-08-04. 23 listing photos reviewed; 24 local files vendored to
 * public/villanorth/. Nothing here is invented; everything traces to
 * ../../../../../../private/tmp/.../scratchpad/harvest/villanorth.json — see
 * [[feedback-fact-check-before-drafting]].
 *
 * FACT GATE (binding): Vaglaskógur is the SECOND-largest forest in Iceland
 * (Hallormsstaðaskógur is largest, verified 2026-08-04). Their own listing
 * calls it "the largest" — that claim is never repeated here; the safe
 * phrasing used throughout is "one of Iceland's largest forests". A fire pit
 * is listed by them but reported absent by a guest (Emily, Feb 2026) — it is
 * not mentioned anywhere on this page, positive or negative.
 *
 * PHOTO SWAP (2026-09-13): the client supplied their own originals via Drive
 * (109 raw files, curated in _docs/assets/villanorth-drive/, see ASSET-LOG.md
 * and derived/photos.generated.ts for the full manifest). A subset of the
 * Airbnb-harvested placeholders below has been replaced with the client's own
 * photography, fingerprinted (never same-filename, see
 * [[replaced-asset-same-filename]]) into public/villanorth/. Each swapped
 * entry says so in its own comment. Nothing else changed.
 */

const B = import.meta.env.BASE_URL + 'villanorth/'

/** Phones get the -800 set; desktop gets the full-res original. */
/**
 * Two harvested photos are smaller than the 1200px the rest of the set is, and
 * tub-night-small is smaller than its own -800 variant (520 vs 800). A srcset
 * descriptor is a promise about a file's real width: claim 1200w on a 520px
 * file and the browser happily picks it for a wide slot and renders it soft.
 * See [[srcset-descriptor-lies]]. Measured widths win over the default.
 */
const INTRINSIC_W: Record<string, number> = {
  'tub-night-small.jpg': 520,
  'winter-river.jpg': 800,
}

/**
 * The 2026-09-13 client originals are vendored under build_derivatives.py's
 * own naming, `<slug>-<sha8>-<w>.jpg` (floor plans also ship a `-<w>.png`),
 * with real derivative widths that vary per photo: a small original never
 * gets upscaled into a fake 2400 or 1600 tier (see [[srcset-descriptor-lies]]
 * and ASSET-LOG.md). List each swapped photo's real widths here — smallest
 * first, matching the srcset spec — so the descriptor only ever claims a
 * width that actually exists on disk. Anything not listed here falls back to
 * just its own filename-encoded width (a single-candidate srcset, still
 * valid HTML).
 */
const NEW_WIDTHS: Record<string, number[]> = {
  'villa-north-lundskogar-bathroom-shower-vanity-6e2e3664': [800, 1600, 2400],
  'villa-north-lundskogar-extra-wc-black-vessel-sink-03a978c6': [800, 1600],
  'villa-north-lundskogar-master-bedroom-upstairs-king-bed-56c47b5d': [800, 1600, 2400],
  'villa-north-lundskogar-bedroom-2-queen-daylight-7dc2440b': [800, 1600, 2400],
  'villa-north-lundskogar-bedroom-3-queen-249286f7': [800, 1600, 2400],
  'villa-north-lundskogar-bedroom-4-single-2d3da673': [800, 1600, 2400],
  'villa-north-lundskogar-aerial-house-hot-tub-sunset-8ffb9636': [800, 1600, 2400],
  'villa-north-lundskogar-living-room-sectional-valley-view-76d8efb8': [800, 1600, 2400],
  'villa-north-lundskogar-dining-table-window-day-4f6e9d48': [800, 1600, 2400],
  'villa-north-lundskogar-kitchen-pendant-lights-counter-0d016d30': [800, 1600, 2400],
  'villa-north-lundskogar-living-room-from-landing-a4bb1704': [800, 1600, 2400],
  'villa-north-lundskogar-aerial-aurora-night-e203040c': [800, 1600, 2400],
}

export const srcSet = (src: string) => {
  const file = src.split('/').pop() ?? ''
  /* New (2026-09-13) fingerprinted names carry their own width suffix. */
  const newMatch = file.match(/^(.+)-(\d+)\.(jpg|png)$/)
  if (newMatch) {
    const [, base, ownW, ext] = newMatch
    const widths = NEW_WIDTHS[base] ?? [Number(ownW)]
    return widths
      .map((w) => `${src.replace(/-\d+\.(jpg|png)$/, `-${w}.${ext}`)} ${w}w`)
      .join(', ')
  }
  const w = INTRINSIC_W[file] ?? 1200
  const small = `${src.replace(/\.jpg$/, '-800.jpg')} 800w`
  /* Nothing to choose between when the base is no wider than the -800. */
  return w <= 800 && w !== 520 ? small : `${small}, ${src} ${w}w`
}

export const HOST = {
  name: 'the owner',
  superhost: true,
  yearsHosting: 3,
  profession: 'Engineer, by the host profile',
  responseRate: '100%',
  respondsWithin: 'within an hour',
  rating: 5.0,
  /* Re-read off the live listing 2026-08-30: 58 reviews, and the highlight
     has moved from top 10% to top 5%. */
  reviewCount: 58,
  badges: ['Guest favorite', 'Top 5% of homes'],
}

export interface Photo {
  src: string
  alt: string
  ratio: string
}

/** Local, vendored copies of the listing's own photography. */
export const PHOTO = {
  /**
   * p06: the two-storey glass gable holding the sky. THE DRAWING's traced
   * elevation is now measured directly from this photograph's own pixels
   * (1200x802) and resolves into it exactly, so the hairline lines dissolve
   * into their real photographed edges as the scrub crossfades.
   */
  glassGrid: { src: `${B}glass-grid.jpg`, alt: 'The two-storey glass gable of Villa North against a pale blue sky, dark timber cladding at its edges', ratio: '3 / 2' } as Photo,
  /**
   * p26: the same gable in silhouette against a sunset. No longer used: the
   * elevation trace is measured straight from glass-grid.jpg itself now, so
   * this photograph isn't needed as a separate trace source.
   */
  gridSunset: { src: `${B}grid-sunset.jpg`, alt: "The gable end of Villa North in silhouette against an orange sunset, its roofline the source of this page's drawing", ratio: '3 / 2' } as Photo,
  /**
   * THE hero. 2026-09-13: replaced with the client's own drone original,
   * `aerial-house-hot-tub-sunset` (one of two same-evening golden-hour
   * passes in the new set, see ASSET-LOG.md's hero ranking; the other,
   * `aerial-golden-hour-terrace`, reads as the same moment so isn't used
   * elsewhere). Chosen over the other two hero candidates because the house
   * and hot tub sit centred in the frame with grass to spare above and
   * below, so they stay in shot whether the hero crops to 4:3 or the wider
   * 16:9 the desktop hero actually renders at — the other two either put
   * most of the frame into sky (golden-hour-terrace) or read hazier and
   * smaller (forest-house-day).
   */
  aerialSunset: { src: `${B}villa-north-lundskogar-aerial-house-hot-tub-sunset-8ffb9636-1600.jpg`, alt: 'A drone view of the house and terrace with the hot tub, golden sunset light and long shadows across the hillside', ratio: '5272 / 3948' } as Photo,
  /** A second sunset aerial, same evening, wider on the valley and the fells behind. */
  aerialSunsetB: { src: `${B}aerial-sunset-b.jpg`, alt: 'A wider aerial view of Villa North at dusk, the valley and dark fells behind it', ratio: '4 / 3' } as Photo,
  /** p05: aerial, daylight, the river Fnjóská winding through the valley below. */
  aerialRiver: { src: `${B}aerial-river.jpg`, alt: 'Aerial daylight view of Villa North above Fnjóskadalur, the river Fnjóská winding through the valley below', ratio: '4 / 3' } as Photo,
  /** Aerial, low mist sitting in the valley, same house. */
  aerialMist: { src: `${B}aerial-mist.jpg`, alt: 'Aerial view of Villa North with morning mist low in the valley and fog on the fells behind', ratio: '4 / 3' } as Photo,
  /**
   * 2026-09-13: replaced with `living-room-from-landing`, the client's own
   * shot from the exact same vantage this entry already described (looking
   * down from the upstairs landing over the sofa, glass wall onto the
   * valley beyond) — same subject, far larger file (4224px vs the harvested
   * original).
   */
  mezzanine: { src: `${B}villa-north-lundskogar-living-room-from-landing-a4bb1704-1600.jpg`, alt: "Looking down from the upstairs landing over the living room's sofa, coffee table and armchairs, full-height windows to the valley", ratio: '4224 / 2821' } as Photo,
  /**
   * 2026-09-13: replaced with `dining-table-window-day`, same subject (round
   * table, full-height window, valley beyond) at 4224px vs the harvested
   * original.
   */
  dining: { src: `${B}villa-north-lundskogar-dining-table-window-day-4f6e9d48-1600.jpg`, alt: 'A round dining table set for two beside a full-height window, daylight and the valley visible outside', ratio: '4224 / 2821' } as Photo,
  /**
   * 2026-09-13: repointed to `bedroom-2-queen-daylight`, the client's own
   * photo of Bedroom 2 (still used as the shared gallery/mosaic "a bedroom"
   * plate as well as ROOMS' br2 entry — Bedroom 2, 3 and 4 no longer share
   * one photo between them; see bedroom3/bedroom4 below).
   */
  bedroom: { src: `${B}villa-north-lundskogar-bedroom-2-queen-daylight-7dc2440b-1600.jpg`, alt: 'A queen-size bed with a dark headboard and wall sconces, daylight coming through a partly-lowered blackout blind', ratio: '3504 / 2336' } as Photo,
  /** 2026-09-13: Bedroom 3, its own photo (was sharing PHOTO.bedroom). */
  bedroom3: { src: `${B}villa-north-lundskogar-bedroom-3-queen-249286f7-1600.jpg`, alt: 'A queen-size bed with a dark upholstered headboard flanked by black articulated wall lamps, a round side table and a door to the left', ratio: '3504 / 2336' } as Photo,
  /** 2026-09-13: Bedroom 4, its own photo (was sharing PHOTO.bedroom). */
  bedroom4: { src: `${B}villa-north-lundskogar-bedroom-4-single-2d3da673-1600.jpg`, alt: 'A single bed with a dark frame and pink-toned pillow beneath a black wall sconce', ratio: '3504 / 2336' } as Photo,
  /**
   * 2026-09-13: replaced with `master-bedroom-upstairs-king-bed`, the
   * client's own photo of the actual upstairs master (Bedroom 1) — the old
   * harvested "attic" shot is gone, this is the real king bed under the
   * sloped ceiling.
   */
  bedroomAttic: { src: `${B}villa-north-lundskogar-master-bedroom-upstairs-king-bed-56c47b5d-1600.jpg`, alt: 'A king-size bed with a black upholstered headboard under a sloped ceiling, with open wardrobe shelving to one side', ratio: '3504 / 2336' } as Photo,
  /**
   * 2026-09-13: replaced with `living-room-sectional-valley-view`, same
   * subject the old alt already described (grey sectional, floor to ceiling
   * glass onto the valley), at 3504px vs the harvested original.
   */
  living: { src: `${B}villa-north-lundskogar-living-room-sectional-valley-view-76d8efb8-1600.jpg`, alt: 'A grey sectional sofa and armchairs beside floor-to-ceiling windows looking out over the valley in daylight', ratio: '3504 / 2336' } as Photo,
  /** Sitting room, evening, a throw over the sofa arm. */
  livingSofa: { src: `${B}living-sofa.jpg`, alt: 'The sitting room in the evening, a throw blanket over the sofa arm, the valley through the glass behind it', ratio: '3 / 2' } as Photo,
  /** The kitchen counter run, an amber light strip under the shelf above it. */
  kitchenRun: { src: `${B}kitchen-run.jpg`, alt: 'The kitchen counter run, a warm light strip glowing under the shelf above the worktop', ratio: '3 / 2' } as Photo,
  /**
   * 2026-09-13: replaced with `kitchen-pendant-lights-counter`, same subject
   * (pendant lights, flowers, fruit bowl on the counter) at 4225px vs the
   * harvested original.
   */
  kitchenPendants: { src: `${B}villa-north-lundskogar-kitchen-pendant-lights-counter-0d016d30-1600.jpg`, alt: 'A dark kitchen counter beneath four dome pendant lights, with fresh flowers and a bowl of fruit', ratio: '4225 / 2822' } as Photo,
  /** Kitchen island, wider, pendant lights lit, dining table beyond. */
  kitchenDining: { src: `${B}kitchen-dining.jpg`, alt: 'The kitchen island under pendant lights, the dining table and valley view visible beyond it', ratio: '3 / 2' } as Photo,
  /**
   * 2026-09-13: replaced with `bathroom-shower-vanity`, the client's own
   * photo of the ground-floor bathroom (walk-in shower, stone vanity, round
   * black basin).
   */
  bath: { src: `${B}villa-north-lundskogar-bathroom-shower-vanity-6e2e3664-1600.jpg`, alt: 'A walk-in shower behind glass next to a stone-topped vanity with a round black basin and folded towels', ratio: '3504 / 2336' } as Photo,
  /**
   * NEW 2026-09-13: the extra ground-floor WC, shown beside the bathroom in
   * BATH_NOTE's photo slot. No harvested equivalent existed before this.
   */
  wcExtra: { src: `${B}villa-north-lundskogar-extra-wc-black-vessel-sink-03a978c6-1600.jpg`, alt: 'A round black vessel sink on a raw-edged wood shelf below a small window, with a hand towel on a hook', ratio: '2336 / 3504' } as Photo,
  /** Board-formed concrete, a steel wall light set into it. Materials. */
  concreteDetail: { src: `${B}concrete-detail.jpg`, alt: 'A steel wall light set into board-formed concrete, the timber cladding continuing beyond it', ratio: '3 / 2' } as Photo,
  /** Dark timber cladding, a steel light fixture mounted on it. Materials. */
  claddingDetail: { src: `${B}cladding-detail.jpg`, alt: 'A black steel light fixture mounted on dark vertical timber cladding', ratio: '2 / 3' } as Photo,
  /** The exterior walkway: concrete, steel edge, cladding, all in one frame. */
  walkway: { src: `${B}walkway.jpg`, alt: 'The concrete walkway along the house, a steel handrail edge in the foreground and timber cladding beyond', ratio: '2 / 3' } as Photo,
  /** THE GLOW: the villa lit at night, snow on the ground, the hot tub deck visible. */
  winterNight: { src: `${B}winter-night.jpg`, alt: 'Villa North lit up at dusk in winter, snow patches on the ground and the hot tub visible on its deck', ratio: '3 / 2' } as Photo,
  /** A second winter aerial: the river system tracing through the valley at dusk. */
  /* Stock, and deliberately so: the tours sheet is an example of a section
     that does not exist yet, so it must not imply the house owns these
     photographs. Unsplash, cropped 3/2 to match the card grid. */
  tourWhales: { src: `${B}tour-whales.jpg`, alt: 'A whale surfacing in open water off the north coast', ratio: '3 / 2' } as Photo,
  tourGodafoss: { src: `${B}tour-godafoss.jpg`, alt: 'A wide waterfall breaking over a dark basalt lip', ratio: '3 / 2' } as Photo,
  tourHorses: { src: `${B}tour-horses.jpg`, alt: 'Icelandic horses grazing below a mountain ridge', ratio: '3 / 2' } as Photo,
  winterRiver: { src: `${B}winter-river.jpg`, alt: 'An aerial dusk view in winter, the river system tracing through the valley beyond the lit house', ratio: '3 / 2' } as Photo,
  /** Two wine glasses on the deck rail at golden hour, the same amber light strip beneath. THE GLOW's golden-hour beat, and the pallurinn room photo. */
  wineGlasses: { src: `${B}wine-glasses.jpg`, alt: 'Two wine glasses on the deck rail at golden hour, an amber light strip glowing beneath the rail', ratio: '3 / 2' } as Photo,
  /** The hot tub itself, at night, steam and warm underlighting, snow-dusted birch behind. Small specimen only, see SIZES. */
  tubNightSmall: { src: `${B}tub-night-small.jpg`, alt: 'The hot tub at night, warm light glowing under its rim, bare snow-dusted birch trees behind it', ratio: '520 / 546' } as Photo,
  /** Sofa in the evening, portrait crop, steel wall brace and timber ceiling visible. */
  livingTall: { src: `${B}living-tall.jpg`, alt: 'A portrait view inside the sitting room, the angled timber ceiling and a black steel wall brace above the sofa', ratio: '2 / 3' } as Photo,
  /**
   * NEW 2026-09-13: the architect's own ground-floor plan, shipped as a
   * lossless PNG (per the brief; the JPEG derivative exists in the asset
   * folder but isn't used here). Shown as a two-up pair with floorplanUpper
   * in the rooms section. Single resolution (1240w); no upscaled tiers.
   */
  floorplanGround: { src: `${B}villa-north-lundskogar-floor-plan-ground-floor-5834fd84-1240.png`, alt: 'An architectural floor plan of the ground floor, labelled with room names and areas in square metres', ratio: '1240 / 1860' } as Photo,
  /** NEW 2026-09-13: companion upper-floor plan, same source and treatment as floorplanGround. */
  floorplanUpper: { src: `${B}villa-north-lundskogar-floor-plan-upper-floor-ec4ec842-1240.png`, alt: 'An architectural floor plan of the upper floor, showing the bedroom, storage/closet and balcony with areas in square metres', ratio: '1240 / 1860' } as Photo,
  /**
   * NEW 2026-09-13: the client's aurora-over-the-house shot, added per the
   * asset brief. Not wired into THE GLOW passage: that section's three-cell
   * row is a deliberate fixed layout ("Three equal cells... the row is one
   * measure", see the comment above vn-glow-row in Page.tsx) with no fourth
   * slot to add without redesigning it, and its poster/video are generated
   * from winterNight specifically (frame-locked to that exact photograph,
   * see GLOW_FILM below) so winterNight itself is left alone too. Kept here,
   * vendored and ready, for whenever a real slot for it is designed.
   */
  auroraNight: { src: `${B}villa-north-lundskogar-aerial-aurora-night-e203040c-1600.jpg`, alt: 'The house glowing from within under a green aurora, surrounded by dark hills', ratio: '7008 / 4672' } as Photo,
} as const

/**
 * Two hard size constraints from the harvest brief, honoured at the call
 * site: tub-night-small's real file is 520w, so it is used as a small inset
 * specimen only, never full-bleed or scaled past its intrinsic-ish size.
 * winter-river is 800w, so it never exceeds a mid-column frame.
 */
export const SIZES = {
  tubNightSmallMaxWidth: 260,
  winterRiverMaxWidth: 440,
}

/* ── the rooms, honestly ──────────────────────────────────────────────── */

export interface RoomEntry {
  id: string
  level: 'efri' | 'nedri'
  label: string
  fact: string
  note?: string
  photo: Photo
  photoNote?: string
}

export const ROOMS: RoomEntry[] = [
  {
    id: 'br1',
    level: 'efri',
    label: 'Bedroom 1',
    fact: '1 king bed',
    note: 'An upstairs retreat, with an adjoining space. Ask about the best arrangement for your family.',
    photo: PHOTO.bedroomAttic,
  },
  {
    id: 'br2',
    level: 'nedri',
    label: 'Bedroom 2',
    fact: '1 queen bed',
    photo: PHOTO.bedroom,
  },
  {
    id: 'br3',
    level: 'nedri',
    label: 'Bedroom 3',
    fact: '1 queen bed',
    photo: PHOTO.bedroom3,
  },
  {
    id: 'br4',
    level: 'nedri',
    label: 'Bedroom 4',
    fact: '1 single bed',
    photo: PHOTO.bedroom4,
  },
  {
    id: 'stofa',
    level: 'nedri',
    label: 'Sitting room',
    fact: 'The sitting room',
    note: 'Floor to ceiling glass on the valley side.',
    photo: PHOTO.living,
  },
  {
    id: 'eldhus',
    level: 'nedri',
    label: 'Kitchen',
    fact: 'The kitchen',
    note: 'Miele appliances, very well stocked, open to the dining table.',
    photo: PHOTO.kitchenRun,
  },
  {
    id: 'pallur',
    level: 'nedri',
    label: 'Sundeck',
    fact: 'The sundeck',
    note: 'The hot tub sits at its edge: trees on one side, the valley on the other.',
    photo: PHOTO.wineGlasses,
  },
]

export const BATH_NOTE = {
  fact: '1.5 bathrooms, both on the main level',
  detail: 'A full bathroom with a shower and a separate WC, both on the ground floor.',
  photo: PHOTO.bath,
}

/* ── the valley ────────────────────────────────────────────────────────── */

export const VALLEY = {
  intro:
    "Step onto the terrace and take in the river Fnjóská, woodland and the farm at Steinkirkja across the valley. Birdsong and the river set the pace.",
  draws: [
    { name: 'Vaglaskógur', note: "Woodland and marked walking trails in Fnjóskadalur." },
    { name: 'Fnjóská', note: 'A rod-fishing river, right below the hillside.' },
    { name: 'Akureyri', note: 'About 20 km away through the Vaðlaheiðargöng toll tunnel.' },
    { name: 'Golf', note: 'A course nearby for a day on the green.' },
    { name: 'Hiking trails', note: 'Starting from the forest edge.' },
  ],
}

/* ── materials ─────────────────────────────────────────────────────────── */

export const MATERIALS = {
  intro:
    'Textured concrete, warm timber and dark steel give the house its quiet character. Settle in and enjoy the details, from the pools of light to the way each room opens onto the view.',
  names: ['Minotti', 'Miele', 'Stelton'],
  quote: {
    quote: 'Where other design houses are filled with Ikea products and furniture, this home is the real deal.',
    author: 'Harold',
    when: 'April 2026',
  },
}

/* ── the glow: one dark passage ───────────────────────────────────────── */

export const GLOW = {
  intro: 'The hot tub sits on the edge of the sundeck, trees on one side, the valley on the other, open through the winter.',
  auroraFact: 'When darkness, clear skies and aurora activity come together, you may see the northern lights from the terrace.',
  quote: {
    quote: 'Just wait until you see the view from the hot tub on your first evening there!',
    author: 'Katie',
    when: 'September 2025',
  },
  filmCredit:
    "The loop above is generated, made from one of the owner's own winter-night photographs: the house itself is locked frame to frame, and only the steam, a faint aurora and the falling snow move.",
}

/**
 * THE GLOW's film: a Higgsfield loop generated from winter-night.jpg
 * (the owner's own photograph, see PHOTO.winterNight above). The house was
 * verified locked frame to frame; only steam, a faint aurora and snow
 * glitter move. Palindromic (last frame = first), so it loops with no seam.
 * glow-poster.jpg / glow-poster-800.jpg are the exact first frame, used as
 * the <video poster> and as a plain <img> fallback so the section still
 * looks complete if the video never loads. Generated 2026-08-05.
 */
export const GLOW_FILM = {
  src: `${B}glow-film.mp4`,
  poster: `${B}glow-poster.jpg`,
  posterSmall: `${B}glow-poster-800.jpg`,
}

/* ── welcome ritual ───────────────────────────────────────────────────── */

export const WELCOME_RITUAL = {
  intro: 'Open the door, put down your bags and make a toast to being here. A little welcome is waiting to help your holiday begin.',
  items: ['Champagne', 'Sodas', 'Chocolate'],
}

/* ── guests ────────────────────────────────────────────────────────────── */

export const REVIEW_THEMES = [
  { theme: 'Location', mentions: 24 },
  { theme: 'View', mentions: 21 },
  { theme: 'Hospitality', mentions: 20 },
] as const

export const REVIEW_QUOTES = [
  { quote: 'Probably the best Airbnb experience I have ever had.', author: 'Eric', when: 'June 2026' },
  { quote: 'Thoughtful design, unparalleled views. 11/10!', author: 'Naomi', when: 'July 2026' },
  {
    quote: 'It was squeaky clean and the epitome of luxury. The house was designed and engineered perfectly.',
    author: 'Kris',
    when: 'August 2025',
  },
] as const

/* ── practical facts ──────────────────────────────────────────────────── */

export const FACTS = {
  guests: 7,
  bedrooms: 4,
  beds: 6,
  baths: '1.5',
  checkIn: 'After 4:00 PM, self check-in with a lockbox',
  checkOut: 'Before 11:00 AM',
  laundry: 'Washer and dryer are outside the main house',
  amenitiesTotal: 52,
  security: 'Exterior security cameras are in use',
  water: 'The hot tub has no gate or lock; a river runs nearby',
}

/**
 * Their own drone film — the landing video on the current villanorth.is,
 * published there by the owners (YouTube "Villa north drone1", 34s). Pulled
 * 2026-08-29, re-encoded to a muted web loop (1120px, denoised, no audio).
 * Poster is the film's own frame at 2s, so the handover cannot flash.
 */
/** The tour placeholders: clearly-marked examples of what the area sells,
 *  shared by the tours sheet and the hero's small rotating window. */
/**
 * The tours portal URL, once the account is live. TourDesk hands partners a
 * hosted portal on their own subdomain (`<brand>.tourdesk.com`) and publishes
 * no embed widget or catalogue API, so linking out is the honest integration
 * until they confirm otherwise. See [[booking-systems-integration]]. Filling
 * this one string turns every card's button into a real link.
 */
export const TOURS_PORTAL = ''

export const EXAMPLE_TOURS = [
  /* `place` is the card's overline and `name` the title under it. Two lines is
     the whole card: a tour card on an example sheet has no business carrying a
     duration and a paragraph as well. */
  { place: 'Akureyri', name: 'Whale watching', note: 'An outing on the fjord from Akureyri', photo: PHOTO.tourWhales },
  { place: 'Mývatn', name: 'Goðafoss and Mývatn', note: 'A day east along the Ring Road', photo: PHOTO.tourGodafoss },
  { place: 'Fnjóskadalur', name: 'Horse riding', note: 'Explore riding experiences in the Akureyri area', photo: PHOTO.tourHorses },
] as const

export const AERIAL_FILM = {
  src: `${B}aerial-film.mp4`,
  poster: `${B}aerial-film-poster.jpg`,
  posterSmall: `${B}aerial-film-poster-800.jpg`,
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Villa North',
  description:
    "A villa in Fnjóskadalur valley, Þingeyjarsveit, North Iceland, with a view over the river Fnjóská and the farm Steinkirkja. Sleeps seven across four bedrooms, with a private hot tub on the sundeck.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Fnjóskadalur, Þingeyjarsveit',
    addressRegion: 'Norðurland',
    addressCountry: 'IS',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'River view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Valley view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
  ],
}
