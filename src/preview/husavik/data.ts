/* ── Húsavík Adventures ehf · „Sjónaukinn" ───────────────────────────────
   VERIFIED CONTENT ONLY, sourced from husavikadventures.is and the client's
   own media library on 2026-08-01. Independent operator, no chain, running
   two product lines confirmed straight off their own shopfront photo
   ("BUGGY ADVENTURES · BIG RIB WHALES & PUFFINS"):

     1. RIB-boat whale and puffin watching on Skjálfandaflói (2-hour tour,
        fast RIB boat, departs from the harbour)
     2. Buggy tours (side-by-side buggies, year round, snow and gravel)

   Contact: whales@husavikadventures.is, 853 4205. No street address is
   published anywhere the audit found, so none is invented here.

   Booking runs on Bókun (bokun.io, TripAdvisor-owned), embedded as a working
   experience-calendar widget on their tour pages today. This file does NOT
   fabricate a booking engine or a specific bokun.io widget URL. It exports
   the real contact channels only; the page designs the handoff to a real
   Bókun widget as a deliberate moment, with the exact embed code left for
   the owner to supply (see BOOKING_TODO below and the matching comment in
   Page.tsx's Booking section).

   The three FAQ questions below are their own real, currently published
   questions, translated to Icelandic. The answers given on this page are
   written generically and honestly (weather and safety judgement calls,
   "no guarantee with a wild animal") rather than inventing a specific
   refund/rebooking policy that was never confirmed.

   The only price data available anywhere is a 2020 timetable graphic
   (Timetable2020x.png on their own media library): adults 17.900 kr.,
   children 8-15 ára 11.900 kr., daily departures April to October. That
   graphic is six years old as of this build. It is reproduced here ONLY as
   a clearly labelled sample module (see DEPARTURES_SAMPLE), never presented
   as a current price, per the redesign brief's hard rule against publishing
   stale prices as live ones. */

export type ImageAsset = {
  src: string
  alt: string
  w: number
  h: number
}

/* Their own real photography (verified URLs, 2026-08-01). Do not add, swap
   or invent any URL beyond this set, a wrong path ships a broken image. */
export const IMAGES = {
  /** Humpback fluke, deep blue Skjálfandaflói. Their single best photo. */
  fluke: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/IMG_4729_Original-1.jpeg',
    alt: 'Sporður hnúfubaks stingur sér niður í djúpblátt Skjálfandaflóa',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  /** THE image that justifies the yellow: guests in hi-vis suits, whale surfacing. */
  hiVisGuests: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/B8C9192C-E546-4057-B430-AA6EFFDADF44_Original.jpg',
    alt: 'Gestir í gulum flotgöllum fylgjast með hval koma upp á yfirborðið',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  /** Crew member in hi-vis on the RIB. Portrait orientation in the source file. */
  crewRib: {
    src: 'https://husavikadventures.is/wp-content/uploads/2023/03/IMG-7561-1.jpg',
    alt: 'Áhafnarmeðlimur í gulum flotgalla um borð í RIB bátnum',
    w: 1536,
    h: 2048,
  } as ImageAsset,
  buggyAction: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/11/DSCN0044.jpg',
    alt: 'Buggý á fullri ferð',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  buggyTwoWinter: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0070.jpg',
    alt: 'Tvö buggý hlið við hlið að vetri til',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  winterLandscape: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0058.jpg',
    alt: 'Vetrarlandslag í kringum Húsavík',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  bayAerial: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0011.jpg',
    alt: 'Skjálfandaflói og Húsavíkurbær séð úr lofti',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  buggyBotnsvatn: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0010.jpg',
    alt: 'Buggý við Botnsvatn',
    w: 2048,
    h: 1536,
  } as ImageAsset,
  /** Their real shopfront at the harbour: the crimson sign and logo this whole
   *  redesign's palette is measured off. Used where the brand needs to be real. */
  shopfront: {
    src: 'https://husavikadventures.is/wp-content/uploads/2017/04/33.jpg',
    alt: 'Framhlið Húsavík Adventures á Húsavík, með rauðu skilti fyrirtækisins',
    w: 2048,
    h: 1536,
  } as ImageAsset,
}

export const CONTACT = {
  email: 'whales@husavikadventures.is',
  phoneDisplay: '853 4205',
  phoneHref: 'tel:+3548534205',
  location: 'Húsavík, Norðurlandi',
  maps: 'https://maps.google.com/?q=' + encodeURIComponent('Húsavík Adventures, Húsavík'),
}

/* Their own real, currently published FAQ questions (translated to
   Icelandic). Answers are written generically and honestly, no invented
   refund/rebooking policy, no invented sighting statistic. */
export type FaqItem = { q: string; a: string }
export const FAQ: FaqItem[] = [
  {
    q: 'Hvað gerist ef við sjáum ekki hval?',
    a: 'Enginn getur lofað villtu dýri. Áhöfnin þekkir flóann og leitar þar sem líkurnar eru mestar hverju sinni, en Skjálfandaflói er lifandi flói og stundum læðist hvalur hjá án þess að sjást.',
  },
  {
    q: 'Hvað gerist ef veðrið er slæmt?',
    a: 'Öryggi hópsins ræður alltaf ferðinni, ekki tímaáætlunin. Ef veður leyfir ekki siglingu er haft samband við ykkur fyrir brottför og fundin lausn í samráði við ykkur.',
  },
  {
    q: 'Getið þið lofað að við sjáum hval?',
    a: 'Nei, og engum sem það lofar er treystandi. Það sem áhöfnin lofar er að þekkja flóann, leita af alvöru og hafa gaman af leitinni með ykkur, hvernig sem hún fer.',
  },
]

/* fmtISK: hand rolled Icelandic thousands grouping with a PERIOD separator.
   Never toLocaleString/Intl.NumberFormat: this Chrome's ICU maps is-IS to a
   comma, and de-DE is a fragile workaround. Rolling it by hand removes the
   dependency on any locale table entirely. */
export function fmtISK(amount: number): string {
  const rounded = Math.round(Math.abs(amount))
  const digits = rounded.toString()
  let grouped = ''
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += '.'
    grouped += digits[i]
  }
  return `${amount < 0 ? '-' : ''}${grouped} kr.`
}

/* The ONLY price data that exists anywhere: a 2020 timetable graphic in
   their own media library (Timetable2020x.png), six years old as of this
   build, exported as a clearly flagged sample, never as a live price. */
export type DepartureRow = {
  season: string
  frequency: string
  priceAdultNum: number
  priceChildNum: number
  childAgeNote: string
}
export const DEPARTURES_SAMPLE: DepartureRow[] = [
  {
    season: 'Apríl til október',
    frequency: 'Daglegar brottfarir',
    priceAdultNum: 17900,
    priceChildNum: 11900,
    childAgeNote: 'Börn 8-15 ára',
  },
]
export const DEPARTURES_SOURCE_YEAR = 2020
export const DEPARTURES_NOTE =
  'Þessi tímatafla er úr verðskrá frá 2020, sex ára gömul. Verð og brottfarir eru sýnishorn og þarfnast staðfestingar eigenda áður en þau birtast á lifandi vef.'

/* Booking: real, working Bókun widget lives on the current site today. No
   specific bokun.io widget URL or vendor id was verified during this audit,
   so none is fabricated here. TODO(owner): supply the real Bókun embed code
   or product page URL; Page.tsx's Booking section is built to take either a
   direct link or an iframe embed with only the src swapped in. */
export const BOOKING_TODO =
  'Vantar: raunverulegan Bókun-hlekk eða iframe-kóða frá eiganda (bokun.io). Þar til hann berst vísar bókunarhnappurinn á tölvupóst.'

/* Their real logo is a circular crimson mark: a ring enclosing a stylised
   mountain/wave form, seen on the shopfront (IMAGES.shopfront). Redrawing a
   client's real mark from a photo produces an amateur approximation, so this
   build reproduces only the wordmark typographically (see Wordmark() in
   Page.tsx) and leaves the mark itself for the owner to supply. */
export const LOGO_TODO =
  'Vantar: raunverulegt vektormerki (hringlaga, rautt) frá eiganda. Merkið á ekki að teikna upp eftir ljósmynd, aðeins orðmerkið er sett upp hér.'

export const META = {
  title: 'Húsavík Adventures | Hvala- og lundaskoðun og buggýferðir á Húsavík',
  description:
    'RIB bátsferðir í hvala- og lundaskoðun á Skjálfandaflóa og buggýferðir um Húsavík, allan ársins hring. Óháð fyrirtæki. Bókun í gegnum Bókun. Sími 853 4205.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Húsavík Adventures',
  legalName: 'Húsavík Adventures ehf.',
  email: 'whales@husavikadventures.is',
  telephone: '+354 853 4205',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Húsavík',
    addressCountry: 'IS',
  },
  url: 'https://husavikadventures.is',
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'RIB hvala- og lundaskoðun á Skjálfandaflóa' } },
    { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Buggýferðir um Húsavík' } },
  ],
}

/* ── Dashboard entry ─────────────────────────────────────────────────────── */
import type { PreviewCompany } from '../company-types'

export const companyEntry: PreviewCompany = {
  slug: 'husavik',
  route: '/preview/husavik',
  name: 'Húsavík Adventures',
  sector: 'Whale watching & buggy tours',
  location: 'Húsavík, North Iceland',
  region: 'North',
  established: 'Independent, no chain',
  currentUrl: 'https://husavikadventures.is',
  ownerEmail: 'whales@husavikadventures.is',
  concept: 'Sjónaukinn',
  conceptTagline:
    'Rebuilt strictly around one real reference, "21 Hours on the Moon" (21hrs.space, Awwwards SOTD): fixed viewfinder corner brackets framing the whole viewport, mono type as the dominant voice, and a quiet CSS atmosphere standing in for its starfield. The instrument framing is not decoration, it is honest to the job: scanning cold open water through an instrument, hoping. The client’s own crimson (sampled off their harbour shopfront sign) replaces the reference’s tan stroke, on a pure black ground instead of the previous, still-rejected navy pass.',
  accent: '#BF244C',
  dark: true,
  status: 'Concept ready',
  thumb: IMAGES.fluke.src,
  ownPhotography: true,
  audit: {
    strengths: [
      'Two genuinely distinct product lines under one roof: fast RIB whale and puffin watching on Skjálfandaflói, and year round buggy tours in snow and gravel',
      'A booking system that already works today: Bókun (bokun.io, TripAdvisor owned) is embedded live on the tour pages, nothing needs to be rebuilt there',
      'Strong brand material hiding in plain sight: their Húsavík shopfront is signed in a real crimson red used across the wordmark, the logo mark and the front door, a genuine brand colour with no stock imagery or invented palette required',
    ],
    weaknesses: [
      'WordPress on the Visual Composer page builder: 64 KB of markup pulling in 16 stylesheets and 15 scripts plus jQuery for what should be a simple page',
      'No h1 anywhere on the page, zero lazy-loading across 21 images, and none of them served as webp',
      'lang="en-US" with no hreflang at all, so Icelandic and every other-language visitor gets the same single English experience',
    ],
    opportunities: [
      'Anchor the page’s one loud colour move in the crimson already painted on their real Húsavík shopfront sign, used as fixed viewfinder chrome and the one full-bleed accent band rather than an imported palette',
      'Answer the three questions their own FAQ already publishes (no whale seen, bad weather, guaranteed sighting) in one prominent moment instead of a buried FAQ page',
      'Fix the technical basics a 64 KB Visual Composer build cannot deliver: a real h1, lazy-loading, webp, and hreflang for Icelandic visitors',
    ],
  },
  positioning:
    'Húsavík Adventures already runs two genuinely different products, RIB whale and puffin watching on Skjálfandaflói and year-round buggy tours, out of the same small independent operation, and their own booking system (Bókun) already works end to end. What is missing is a page that looks like it belongs to either product: no h1, no lazy-loading, no webp, English only with no hreflang, on a 64 KB WordPress Visual Composer build. The first redesign pass swapped in a colour palette (deep navy and crimson) with no structural reference, and the client rejected it as generic template design, correctly. This rebuild starts over, built strictly around a real, decorated reference (21hrs.space, Awwwards SOTD) instead: fixed viewfinder corner brackets as page-level chrome, mono type as the dominant voice, their own six-year-old snapshots reframed as bracketed sightings rather than stretched hero photography, and one literal out-and-back route line tracing the RIB’s real journey across Skjálfandaflói. The crimson is still theirs, sampled off the harbour shopfront sign, now set on pure black rather than navy.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Húsavík Adventures',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég skoðaði vefinn ykkar og sá að þið bjóðið upp á tvennt virkilega skemmtilegt, hraðskreiðar RIB ferðir í hvala- og lundaskoðun á Skjálfandaflóa og buggýferðir um landið allan ársins hring. Núverandi vefsíða nær hins vegar illa utan um þetta, enda er hún byggð á gömlu WordPress kerfi án fyrirsagnar (h1), myndirnar 21 hlaðast allar inn í einu án lötunar og enska útgáfan er sú eina í boði, líka fyrir íslenska gesti.

Mér fannst þetta synd, sérstaklega því þið eigið nú þegar frábæra sögu að segja: hraðskreiðan bát sem fer út á kaldan flóann í leit að hval, í raun eins og að horfa í gegnum sjónauka. Frumgerðin er byggð utan um nákvæmlega þá tilfinningu, með rauða litinn af skiltinu ykkar við höfnina sem eina litinn sem sker sig úr.

Ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding. Bókunarkerfið ykkar hjá Bókun er fínt eins og það er, svo frumgerðin gerir ráð fyrir að tengjast því beint í stað þess að finna upp nýtt kerfi.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}

/* Phone data budget: WordPress already generates sized variants of every one of
   these, each verified with a real request rather than guessed. Serving the
   full-size file to a phone is the single biggest performance defect a build
   like this can ship. */
export const SRCSET: Record<string, string> = {
  'https://husavikadventures.is/wp-content/uploads/2017/04/IMG_4729_Original-1.jpeg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/IMG_4729_Original-1-768x576.jpeg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/IMG_4729_Original-1-1024x768.jpeg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/B8C9192C-E546-4057-B430-AA6EFFDADF44_Original.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/B8C9192C-E546-4057-B430-AA6EFFDADF44_Original-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/B8C9192C-E546-4057-B430-AA6EFFDADF44_Original-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2023/03/IMG-7561-1.jpg':
    'https://husavikadventures.is/wp-content/uploads/2023/03/IMG-7561-1-600x800.jpg 600w, https://husavikadventures.is/wp-content/uploads/2023/03/IMG-7561-1-768x1024.jpg 768w',
  'https://husavikadventures.is/wp-content/uploads/2017/11/DSCN0044.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/11/DSCN0044-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/11/DSCN0044-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0070.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0070-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0070-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0058.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0058-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0058-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0011.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0011-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0011-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0010.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0010-768x576.jpg 768w, https://husavikadventures.is/wp-content/uploads/2017/04/DSCN0010-1024x768.jpg 1024w',
  'https://husavikadventures.is/wp-content/uploads/2017/04/33.jpg':
    'https://husavikadventures.is/wp-content/uploads/2017/04/33-600x800.jpg 600w, https://husavikadventures.is/wp-content/uploads/2017/04/33-768x1024.jpg 768w',
}

export const SIZES = '(max-width: 900px) 100vw, 50vw'
