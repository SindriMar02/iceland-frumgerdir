/**
 * HUNDAHÓTELIÐ ÁSBRÚ — "Sólarhringurinn" (one day at the hotel), v2
 * ---------------------------------------------------------------------------
 * Dog (and cat) boarding hotel, Klettatröð 6A, Ásbrú, Reykjanesbær.
 * Redesign concept for batch 13, v2 rebuild (see BRIEF2-hundahotelid.md).
 *
 * EVERY fact below is taken verbatim (or condensed without changing meaning)
 * from hundahotelid.is, fetched and re-verified 2026-07-28: the front page,
 * /adstadan, /leikskolinn, /lifid, /skilmalar and /hafasamband. Founder names
 * and the April 2021 opening date are additionally cross-checked against the
 * Víkurfréttir profile "Hér hafa fallið tár" (vf.is/mannlif/her-hafa-fallid-tar),
 * named as an allowed source in the brief. The Grindavík evacuation story and
 * the three Google review quotes below are sourced from
 * public/hundahotelid/real/HARVEST.md (harvested 2026-07-28), also an
 * allowed source. No capacity numbers, no "largest dog hotel" claim: none of
 * those appear on hundahotelid.is today, so none are printed (the
 * Víkurfréttir article states capacity 44 -> 82, but the brief restricts
 * capacity claims to what the COMPANY'S OWN SITE states, so that number is
 * deliberately left out — this is separate from the ~40 animals sheltered
 * during the Grindavík evacuation, which the v2 brief explicitly asks for
 * and which HARVEST.md sources to the same Víkurfréttir article).
 *
 * CORRECTION VS. THE BRIEF: the brief assumed boarding was priced by dog SIZE
 * (small 7.900 / medium 8.900 / large 9.900 / xl 15.900). The live site shows
 * boarding priced by NUMBER OF DOGS per day (1 hundur 5.500 kr, 2 hundar 8.300
 * kr, 3 hundar 9.800 kr), and the size-tiered numbers the brief quoted
 * (8.900 / 9.900 / 10.900 / 16.900) are actually "Bað og blástur" (bath and
 * blow-dry / grooming), priced by size. Both tables are reproduced below
 * exactly as published, correctly labelled.
 *
 * PHOTO-SOURCING NOTE (v2, read before touching the timeline beats): the v2
 * brief's device D3 names five files in public/hundahotelid/real/ for the
 * timeline (gongutur.jpg, dagdvol.jpg, bad.jpg, hundaskutl.jpg,
 * hundatengsl.jpg). On inspection those are the exact purchased stock/meme
 * images hundahotelid.is itself uses today (a Labrador with a leash, a
 * spaniel in sunglasses on a studio backdrop, a terrier in a bubble bath, a
 * corgi "driving" a car, a Labrador doing a trick) — the SAME weakness this
 * very file's AUDIT.weaknesses already calls out ("Forsíðan sýnir eingöngu
 * keypt stock-myndefni af hundum (sólgleraugu, hundur undir stýri)"), and
 * hundatengsl.jpg additionally carries a visible third-party "Magnific"
 * watermark, which makes it unusable outright. Shipping those as this
 * build's hero storytelling device would contradict the redesign's own
 * thesis (POSITIONING below: show the real hotel, not stock dogs) in the one
 * place it matters most. So DAY_BEATS below uses REAL facility photography
 * (public/hundahotelid/img/facility-*.webp, genuinely photographed at this
 * hotel) plus the already credited, already fact-checked Unsplash
 * illustrative set in IMG/SERVICES/PHOTO_CREDITS — never the five stock
 * files named in the brief, and never hundatengsl.jpg anywhere on the page.
 *
 * BATCH 13 REDO NOTE (2026-07-29, BRIEF2-hundahotelid.md): the v2 hero used
 * IMG.yardDog (facility-yard-1.webp) as its lead image — on review this is a
 * dog jumping against a chain-link kennel run, which reads like a shelter
 * rather than a hotel. A stock dog was tried next and rejected: this page
 * headlines a section called "Aðstaðan sjálf, ekki stock-myndir", so a
 * bought photograph in the lead slot contradicts the site's own promise.
 * The hero now uses IMG.yardWide (facility-yard-4.webp) — the hotel's own
 * outdoor run, real cedar fencing under an open Icelandic sky — which keeps
 * the lead image both warm AND true.
 * IMG.yardDog moved into the Aðstaðan section alongside IMG.yardRows,
 * captioned honestly: the fencing is real and that is the point, not
 * something to hide behind a nicer crop.
 *
 * VERIFIED LIVE 2026-07-28: the header "BÓKA" button does not open a booking
 * form, a modal or any new page (clicked in a live browser session, no
 * navigation, no console output, no visible change). There is no working
 * online booking on hundahotelid.is today: booking runs by phone or email,
 * consistent with their own Skilmálar page ("Greiðsla fer fram við komu eða
 * brottför", cancellation "símleiðis eða með tölvupósti"). This build's own
 * booking panel is honest about that: a request form that prefills an email
 * plus a phone CTA, not a fake live-availability calendar.
 *
 * CONCEPT — a real hotel page for a real hotel business (their own word,
 * used freely because it is literally their name), built around the one fact
 * their current site buries: they are open 07:45-18:00, 365 days a year, no
 * red-day surcharge, and every dog gets a real daily rhythm (outdoor time,
 * a proper rest window with calm music, more outdoor time). v2 frames that
 * rhythm literally: the page's spine is one day at the hotel, 07:45 to
 * evening, told through real photography, the real Google rating and the
 * real Grindavík story, all three of which v1 left out entirely.
 */

import type { PreviewCompany } from '../companies'

const asset = (p: string) => `${import.meta.env.BASE_URL}hundahotelid/img/${p}`
const realAsset = (p: string) => `${import.meta.env.BASE_URL}hundahotelid/real/${p}`

export const IMG = {
  // real facility photography, harvested from hundahotelid.is/adstadan
  // (original hbur-*.jpg / inni-1.jpg / uti-*.jpg files, not the 300px
  // thumbnails their own site shows)
  roomCosy: asset('facility-room-1.webp'), // hbur-2: dark kennel, their own logo decal on the wall
  roomBone: asset('facility-room-2.webp'), // hbur-1: round bed, water bowls, a chew toy
  roomBright: asset('facility-room-3.webp'), // hbur-3: bright white kennel room, dog door
  hallDim: asset('facility-hall-1.webp'), // hbur-4: row of kennels down a corridor
  hallBright: asset('facility-hall-2.webp'), // hbur-5: corridor with owners' leashes and bags hung up
  shop: asset('facility-shop.webp'), // inni-1: reception / dog food and treats shop
  yardDog: asset('facility-yard-1.webp'), // uti-1: a real resident running the fence line, big sky
  yardEmpty: asset('facility-yard-2.webp'), // uti-2: empty exercise yard, dramatic Icelandic sky
  yardRows: asset('facility-yard-3.webp'), // uti-3: wide rows of outdoor runs
  yardWide: asset('facility-yard-4.webp'), // uti-4: wide yard, town in the background

  // vetted Unsplash photography — illustrative "dog joy", never presented as
  // this hotel's own residents or premises. Regular images.unsplash.com URLs
  // only, none from plus.unsplash.com and none with a premium_photo- id.
  dogCorgiEvening: asset('dog-corgi-evening.webp'),
  dogPath: asset('dog-path.webp'),
  dogRollGrass: asset('dog-roll-grass.webp'),
  dogCorgiLog: asset('dog-corgi-log.webp'),
  dogGarden: asset('dog-garden.webp'),
  dogSpaniel: asset('dog-spaniel.webp'),
  dogRunning: asset('dog-running.webp'),
  dogSetterPath: asset('dog-setter-path.webp'),
}

export const LOGO_SVG = realAsset('logo.svg')

export const PHOTO_CREDITS = [
  { id: 'ECj4UOed_nc', photographer: 'Michal Mikulec', file: 'dog-corgi-evening.webp' },
  { id: 'd--z6wSuQnE', photographer: 'Anna Amelina', file: 'dog-path.webp' },
  { id: 'SeZg7IsCYok', photographer: 'Anton Borzenkov', file: 'dog-roll-grass.webp' },
  { id: 'wX6X_GHu5AU', photographer: 'Alvan Nee', file: 'dog-corgi-log.webp' },
  { id: 'qUc4rHQfXx4', photographer: 'Rafael Shiga', file: 'dog-garden.webp' },
  { id: '4zKEYRvC4ow', photographer: 'Dan', file: 'dog-spaniel.webp' },
  { id: 'dYrvfcVT96o', photographer: 'Ernesto Samaniego', file: 'dog-running.webp' },
  { id: 'UtrE5DcgEyg', photographer: 'Jamie Street', file: 'dog-setter-path.webp' },
]

/* ── identity ─────────────────────────────────────────────────────────── */

export const NAME = 'Hundahótelið Ásbrú'
export const LEGAL_NAME = 'Hunda- og kattahótelið Ásbrú'
export const PHONE_DISPLAY = '691 1615'
export const PHONE_HREF = 'tel:+3546911615'
export const EMAIL = 'hundahotel@gmail.com'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const KENNITALA = '590213-0710'
export const ADDRESS_LINE = 'Klettatröð 6A'
export const ADDRESS_POSTCODE = '262 Reykjanesbær (Ásbrú)'
export const MAPS_HREF = 'https://www.google.com/maps/search/?api=1&query=Klettatr%C3%B6%C3%B0+6A+262+Reykjanesb%C3%A6r'
export const CURRENT_URL = 'https://hundahotelid.is'
export const BOOKING_LIVE_HREF = 'https://hundahotelid.is'
export const TRAINING_PARTNER_HREF = 'https://hundatengsl.is/'

export const OPEN_HOURS = '07:45 til 18:00'
export const OPEN_NOTE = 'Alla daga ársins. Engir rauðir dagar, sama verð og sama þjónusta hvern einasta dag.'

/** Verified via vf.is/mannlif/her-hafa-fallid-tar (Víkurfréttir, named source in the brief). */
export const FOUNDERS_NOTE =
  'Fjölskyldufyrirtæki í Ásbrú, opnað í apríl 2021 af Elmari Þór Magnússyni, Sæunni Hilmarsdóttur og Hörpu Lind Magnúsdóttur.'

/* ── the Grindavík moment (device 7) ─────────────────────────────────────
   Sourced from public/hundahotelid/real/HARVEST.md, citing Víkurfréttir
   (vf.is/mannlif/her-hafa-fallid-tar), an allowed source per the brief. No
   detail beyond what that article states: ~40 animals sheltered during the
   2023-2024 Grindavík evacuations, and the owners' own quoted line. ────── */

export const GRINDAVIK = {
  eyebrow: 'Grindavík, 2023 og 2024',
  quote: 'Hér hafa fallið tár',
  body:
    'Þegar rýma þurfti Grindavík opnaði Hundahótelið Ásbrú dyrnar fyrir gæludýrum íbúa sem þurftu að flýja heimili sín með engan fyrirvara. Um 40 hundar og kettir fengu þar skjól á meðan óvissan var sem mest.',
  attribution: 'Eigendur Hundahótelsins Ásbrú, í viðtali við Víkurfréttir um þá tilfinningu að geta hjálpað nágrönnum sínum þegar mest á reyndi.',
  sourceLabel: 'Heimild: Víkurfréttir, „Hér hafa fallið tár“',
  sourceHref: 'https://www.vf.is/mannlif/her-hafa-fallid-tar',
  img: IMG.yardEmpty,
  imgAlt: 'Tómt gerði á Hundahótelinu Ásbrú undir dramatískum íslenskum himni',
}

/* ── the five services (drives both the timeline beats and the Verðskrá
   section; anchors point at the matching price row) ─────────────────── */

export interface ServiceSlide {
  id: string
  label: string
  tagline: string
  img: string
  imgAlt: string
  priceNote: string
  anchor: string
}

export const SERVICES: ServiceSlide[] = [
  {
    id: 'possun',
    label: 'Pössun',
    tagline: 'Eigið herbergi, eigið rúm, alvöru hvíld alla 365 daga ársins.',
    img: IMG.roomCosy,
    imgAlt: 'Notalegt herbergi á Hundahótelinu Ásbrú með mjúku rúmi og leikfangi',
    priceNote: 'Verð fer eftir fjölda hunda, sjá verðskrá',
    anchor: '#verdskra',
  },
  {
    id: 'dagvistun',
    label: 'Dagvistun',
    tagline: 'Skutlaðu hvutta til okkar á meðan þið vinnið, sækið hann seinni partinn.',
    img: IMG.dogRollGrass,
    imgAlt: 'Kátur hundur veltir sér í grasinu',
    priceNote: 'Frá 3.000 kr. fyrir einn hund',
    anchor: '#verdskra',
  },
  {
    id: 'gongutur',
    label: 'Göngutúrar',
    tagline: 'Auka útivera hvenær sem þið viljið, þið ráðið hversu oft.',
    img: IMG.dogPath,
    imgAlt: 'Hundur á göngu eftir malarstíg',
    priceNote: '1.500 kr. á göngutúr',
    anchor: '#verdskra',
  },
  {
    id: 'snyrting',
    label: 'Snyrting',
    tagline: 'Bað og blástur. Ilmandi hreinn hundur þegar þið sækið hann.',
    img: IMG.dogSpaniel,
    imgAlt: 'Snyrtilegur hundur situr á grasflöt',
    priceNote: 'Frá 8.900 kr. eftir stærð',
    anchor: '#verdskra',
  },
  {
    id: 'akstur',
    label: 'Akstur',
    tagline: 'Hundaskutl. Við sækjum og skilum í Hafnarfjörð.',
    img: IMG.dogRunning,
    imgAlt: 'Hundur á fullri ferð úti',
    priceNote: '9.500 kr. hver ferð',
    anchor: '#verdskra',
  },
]

/* ── device 3 — the timeline spine ───────────────────────────────────────
   Six real day-beats mapped onto five sticky time markers (bað/snyrting and
   hundaskutl share the 16:00 stop — both are on-demand add-ons slotted into
   the afternoon, not fixed appointments). Every sentence below restates a
   fact already established in RHYTHM, SERVICES or the price constants
   further down this file — nothing new is asserted. See the photo-sourcing
   note at the top of this file for why these beats use real facility /
   credited Unsplash photography instead of the brief's five named files. */

export const TIMELINE_MARKERS = ['07:45', '09:00', '12:00', '16:00', '19:00']

export interface DayBeat {
  time: string
  markerIndex: number
  label: string
  img: string
  imgAlt: string
  text: string
}

export const DAY_BEATS: DayBeat[] = [
  {
    time: '07:45',
    markerIndex: 0,
    label: 'Opnar',
    img: IMG.shop,
    imgAlt: 'Móttaka og verslun Hundahótelsins Ásbrú, með hunda- og kattafóðri og nammi á hillum',
    text:
      'Húsið opnar 07:45, sjö daga vikunnar, allan ársins hring. Engir rauðir dagar og engar lokanir: sama fólk, sama verð og sama þjónusta hvern einasta dag ársins.',
  },
  {
    time: '09:00',
    markerIndex: 1,
    label: 'Morgunganga',
    img: IMG.dogPath,
    imgAlt: 'Hundur á göngu eftir malarstíg',
    text:
      'Milli 08:00 og 12:00 fá allir hundar útiveru í gerði, einir eða með öðrum eftir óskum eigenda, og skipt er í smáhunda og stóra hunda. Viljið þið enn meiri hreyfingu má panta göngutúr aukalega á 1.500 kr., hvenær sem er og eins oft og þið viljið.',
  },
  {
    time: '12:00',
    markerIndex: 2,
    label: 'Dagdvöl og leikur',
    img: IMG.dogRollGrass,
    imgAlt: 'Kátur hundur veltir sér í grasinu',
    text:
      'Um hádegisbil hægist á kliðnum: gistihundarnir fá hvíldartíma sinn með rólegri tónlist í gangi, en dagvistunarvinirnir sem eru bara í heimsókn yfir daginn halda áfram að leika sér. Dagvistun kostar frá 3.000 kr. fyrir einn hund.',
  },
  {
    time: '16:00',
    markerIndex: 3,
    label: 'Bað og snyrting',
    img: IMG.dogSpaniel,
    imgAlt: 'Snyrtilegur hundur situr á grasflöt',
    text:
      'Bað og blástur er í boði fyrir alla, verð fer eftir stærð og loðnu hundsins og byrjar í 8.900 kr. Hreint og ilmandi þegar eigandinn kemur að sækja.',
  },
  {
    time: '16:00',
    markerIndex: 3,
    label: 'Hundaskutl',
    img: IMG.dogRunning,
    imgAlt: 'Hundur á fullri ferð úti',
    text:
      'Búið í Hafnarfirði? Við sækjum og skilum hundinum fyrir 9.500 kr. hverja ferð, svo fjarlægðin þarf aldrei að stoppa neinn.',
  },
  {
    time: '19:00',
    markerIndex: 4,
    label: 'Kvöldró',
    img: IMG.roomCosy,
    imgAlt: 'Notalegt herbergi með mjúku rúmi, merkt með lógói Hundahótelsins á veggnum',
    text:
      'Síðasti hundurinn fær kvöldmat og útiveru milli 16:00 og 18:00, og svo verður hljótt í álmunum. Hver hundur sefur í sínu eigin herbergi, sínu eigin rúmi. Á morgun, klukkan 07:45, byrjar hringrásin aftur.',
  },
]

/* ── device 6 — real testimonials, verbatim from Google Maps ────────────
   Harvested 2026-07-28 (public/hundahotelid/real/HARVEST.md): "Hundahótelið
   Ásbrú", 4.5 stars, 49 reviews. Quotes stay in English (they are
   citations, not marketing copy written by us) with an Icelandic intro
   line around them, per the brief. Avatars are paw-monogram initials, never
   stock faces — no photo of any of these three reviewers was harvested. */

export interface Testimonial {
  name: string
  meta: string
  quote: string
  rating: number
}

export const GOOGLE_RATING = '4,5'
export const GOOGLE_REVIEW_COUNT = 49

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sirilin Keskla',
    meta: 'Local Guide á Google · umsögn uppfærð fyrir mánuði',
    quote:
      'Our dog has stayed there twice and second time he was not even interested in leaving. We have massive dog with severe reactivity issues and aggression towards men after staying in another dog hotel when he was a puppy…',
    rating: 5,
  },
  {
    name: 'Loreyn Torres Guzman',
    meta: 'Umsögn frá því fyrir 2 mánuðum',
    quote: 'Our dogs came back home healthy and happy',
    rating: 5,
  },
  {
    name: 'Matt R',
    meta: 'Local Guide á Google · umsögn frá því fyrir 3 árum',
    quote: 'Basil loves it here and they love him! He gets super excited every time he realises where he’s going!',
    rating: 5,
  },
]

/* ── prices, verbatim from the live 2025 price list ──────────────────── */

export const PRICE_EFFECTIVE = 'Verðskrá frá 1. janúar 2025'

export interface BoardingRow {
  count: string
  desc: string
  price: string
  unit: string
}

export const BOARDING: BoardingRow[] = [
  { count: '1 hundur', desc: 'Verð fyrir einn hund', price: '5.500 kr.', unit: 'sólarhringurinn' },
  { count: '2 hundar', desc: 'Verð fyrir tvo hunda', price: '8.300 kr.', unit: 'sólarhringurinn' },
  { count: '3 hundar', desc: 'Verð fyrir þrjá hunda', price: '9.800 kr.', unit: 'sólarhringurinn' },
]

export const BOARDING_NOTES = [
  'Á Hunda- og kattahótelinu Ásbrú eru engir rauðir dagar, sama verð alla daga.',
  'Gjaldskrá getur breyst án fyrirvara. Verð sem var pantað við bókun gildir áfram.',
  'Fleiri en 5 hundar af sama heimili? Hafið samband beint.',
  PRICE_EFFECTIVE + ' tók gildi.',
]

export interface GroomingRow {
  size: string
  price: string
}

export const GROOMING: GroomingRow[] = [
  { size: 'Litlir', price: '8.900 kr.' },
  { size: 'Miðlungs', price: '9.900 kr.' },
  { size: 'Stórir', price: '10.900 kr.' },
  { size: 'Mjög stórir og loðnir', price: '16.900 kr.' },
]

export const WALK_PRICE = '1.500 kr.'
export const WALK_NOTE =
  'Pantið göngutúr aukalega, til dæmis annan hvern dag. Þið ráðið hvort og hversu oft.'

export const TRANSPORT_PRICE = '9.500 kr.'
export const TRANSPORT_NOTE = 'Hver ferð. Við sækjum og skilum hundinum í Hafnarfjörð.'

export interface DaycareRow {
  label: string
  price: string
}

export const DAYCARE: DaycareRow[] = [
  { label: 'Einn hundur', price: '3.000 kr.' },
  { label: 'Tveir hundar', price: '4.500 kr.' },
  { label: '10x klippikort, einn hundur', price: '25.000 kr.' },
  { label: '10x klippikort, tveir hundar', price: '40.000 kr.' },
]

export const TRAINING_NOTE =
  'Tveggja til þriggja vikna hundaþjálfun á meðan á dvöl stendur, unnin í samstarfi við Hundatengsl.'
export const TRAINING_PRICE_NOTE = 'Verð ekki gefið upp á vefnum þeirra, hafið samband og spyrjið.'

/* ── the daily rhythm (frá /lifid) ───────────────────────────────────── */

export interface RhythmRow {
  time: string
  text: string
}

export const RHYTHM: RhythmRow[] = [
  { time: '08:00-09:00', text: 'Matargjafir og skipt um vatn hjá öllum.' },
  {
    time: '08:00-12:00',
    text: 'Útivera. Allir hundar fá útiveru í gerði, einir eða með öðrum eftir óskum eigenda. Skipt er í smáhunda og stóra hunda.',
  },
  {
    time: '12:00-13:00',
    text: 'Hvíldartími. Umgangur er í lágmarki og róleg tónlist í gangi svo hundarnir fái þá hvíld sem þeir þurfa.',
  },
  { time: '13:00-16:00', text: 'Hreyfing, göngutúrar, myndatökur og áframhaldandi skemmtilegheit.' },
  { time: '16:00-18:00', text: 'Matargjafir ásamt útiveru.' },
]

/** Condensed, honest paraphrase of the long note on their /lifid page. */
export const RHYTHM_HONEST_NOTE =
  'Það hentar ekki öllum hundum að vera á hundahóteli. Nýr staður, nýtt fólk og ný lykt geta verið stressandi, þess vegna eru hvíldartímar nauðsynlegir. Fullorðnir hundar þurfa 12 til 16 klukkustunda svefn á sólarhring, hvolpar allt að 18. Þess vegna er róleg tónlist í gangi á hvíldartíma og enginn umgangur um hundaálmuna á meðan. Hver hundur hefur sínar sérþarfir sem reynt er að sinna eftir bestu getu.'

/* ── what to bring (frá /adstadan) ───────────────────────────────────── */

export const BRING_YES = ['Eigið fóður', 'Eigin taum', 'Nagbein eða nammi, ef þið viljið gefa á meðan']
export const BRING_NO = ['Uppáhalds dótið', 'Góðu bælin þeirra']

/* ── terms (frá /skilmalar), condensed for the practical section ────── */

export const TERMS = [
  'Ekki er tekið við tíkum á blæðingum eða lóðaríi.',
  'Greiðsla fer ekki fram sjálfkrafa við bókun, heldur við komu eða brottför.',
  'Innskráning er milli 13:00 og 18:00, útskráning milli 07:45 og 13:00. Panta þarf fyrirfram ef koma þarf að morgni eða sækja síðdegis.',
  'Afbókun er gjaldfrjáls með 48 klukkustunda fyrirvara, símleiðis eða í tölvupósti. Skemmri fyrirvari: ein gistinótt greiðist.',
  'Ekki er endurgreitt sé hundurinn sóttur fyrir áætlaðan heimfaradag.',
]

/* ── cats (the honest, small mention) ────────────────────────────────── */

export const CATS_NOTE =
  'Fyrirtækið heitir formlega Hunda- og kattahótelið Ásbrú, og verðskráin þeirra sjálfra staðfestir að kettir séu velkomnir undir sama þaki. Engar sérstakar upplýsingar um kattaþjónustu eru birtar opinberlega ennþá, svo besta leiðin er að hringja í 691 1615 og spyrja.'

/* ── device 4 — the CSS ticker, exact literal line per the brief ──────── */

export const TICKER_LINE = 'OPIÐ ALLA DAGA ÁRSINS · 365 · KLETTATRÖÐ 6A · 691 1615 ·'

/* ── audit flaws, verified 2026-07-28 on the live site ───────────────── */

export const AUDIT = {
  strengths: [
    'Opið alla daga ársins, 07:45-18:00, engir rauðir dagar og sama verð allan ársins hring',
    'Alvöru, nýleg aðstaða: einkaherbergi, gerði og verslun, ekki heimatilbúið bílskúrshótel',
    'Föst, róleg dagleg rútína með útiveru og skipulögðum hvíldartíma',
    'Fjölskyldufyrirtæki með nafn og andlit á bak við sig, starfrækt síðan 2021',
    'Sterk 4,5 stjörnu einkunn á Google úr 49 umsögnum, hvergi sýnd á vefnum sjálfum',
  ],
  weaknesses: [
    'BÓKA hnappurinn í haus síðunnar opnar hvorki bókunarform né neina aðra síðu (staðfest með smelli 2026-07-28)',
    'Fyrirtækið kallar sig eingöngu "Hundahótelið" á vefnum þótt formlega nafnið sé Hunda- og kattahótelið Ásbrú, kettir eru hvergi nefndir',
    'Verðskráin er ein romsa af tölum neðst á forsíðu: gisting, bað, göngutúrar, dagvistun og skutl blandast saman án nokkurrar sjónrænnar stigskiptingar',
    'Forsíðan sýnir eingöngu keypt stock-myndefni af hundum (sólgleraugu, hundur undir stýri), ekki eina einustu mynd af hótelinu sjálfu',
    'Alvöru myndirnar af herbergjum og gerði eru grafnar undir undirsíðuna Aðstaðan sem 300 pixla smámyndir',
    'Dagleg rútína og hvíldartími, sem er besta traustsvopn fyrirtækisins, er hvergi nefnd á forsíðunni',
    'Tengiliðanetfangið er @gmail.com hjá annars fullskráðu fyrirtæki með kennitölu',
    'Sterk Google-einkunn (4,5 af 5, 49 umsagnir) er hvergi nefnd eða tengd á vefnum',
  ],
  opportunities: [
    'Selja öryggistilfinninguna beint: full 365 daga opnun og skýra dagskrá í stað þess að fela hana',
    'Sýna alvöru aðstöðuna strax í stað stock-mynda af ókunnugum hundum',
    'Gera verðskrána læsilega í eigin köflum eftir þjónustu í stað einnar romsu',
    'Setja Google-umsagnirnar framarlega, þær eru sterkasta traustsvopnið sem vantar á vefinn í dag',
  ],
}

export const POSITIONING =
  'Ekki bara gisting heldur hugarró: fastur dagur, alvöru herbergi og sama þjónusta 365 daga á ári, sett fram jafn skýrt og aðstaðan sjálf er alvöru.'

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#dagurinn', label: 'Dagurinn' },
  { href: '#umsagnir', label: 'Umsagnir' },
  { href: '#adstadan', label: 'Aðstaðan' },
  { href: '#verdskra', label: 'Verðskrá' },
  { href: '#bokun', label: 'Bókun' },
]

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: NAME,
  legalName: LEGAL_NAME,
  description:
    'Hunda- og kattapössun, dagvistun, göngutúrar, snyrting og hundaskutl í Ásbrú, Reykjanesbæ. Opið alla daga ársins.',
  telephone: '+354 691 1615',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_LINE,
    postalCode: '262',
    addressLocality: 'Reykjanesbær',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: String(GOOGLE_REVIEW_COUNT),
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '07:45',
      closes: '18:00',
    },
  ],
}

/* ── company entry for the lead to merge into companies.ts ────────────── */

export const COMPANY_ENTRY: PreviewCompany = {
  slug: 'hundahotelid',
  route: '/preview/hundahotelid',
  name: NAME,
  sector: 'Hunda- og kattahótel',
  location: 'Ásbrú, Reykjanesbær',
  region: 'Reykjanes',
  established: 'Est. 2021',
  currentUrl: CURRENT_URL,
  ownerEmail: EMAIL,
  concept: 'Hótel fyrir besta vin þinn',
  conceptTagline:
    'Ekki bara pössun heldur hugarró: alvöru herbergi, fastur dagur og sama þjónusta alla 365 daga ársins.',
  accent: '#C1502E',
  dark: false,
  status: 'Concept ready' as const,
  thumb: asset('facility-yard-1.webp'),
  audit: AUDIT,
  positioning: POSITIONING,
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Hundahótelið Ásbrú',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Hundahótelið Ásbrú og fannst strax gott að þið séuð opin alla daga ársins, sama hvað gengur á. Það er einmitt sú tegund af öryggi sem hundaeigendur eru að leita að þegar þeir þurfa að skilja besta vin sinn eftir. En vefsíðan ykkar í dag segir ekki þá sögu. Verðskráin er í smáu letri neðst á síðunni, alvöru myndirnar af herbergjunum og gerðinu eru faldar undir undirsíðu, og BÓKA hnappurinn efst gerir í raun ekki neitt þegar á hann er smellt. Þið eruð líka með 4,5 stjörnur af 5 í 49 umsögnum á Google, sem hvergi sést á vefnum sjálfum.

Mér fannst það synd, því starfið sem þið vinnið á skilið að sjást strax: alvöru útivera, fastur hvíldartími með rólegri tónlist, heimilisleg herbergi og traustið sem þið hafið þegar áunnið ykkur hjá viðskiptavinum. Þess vegna settist ég niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, þar sem dagleg rútína, aðstaðan, umsagnirnar og verðskráin fá loksins að njóta sín. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma: [HLEKKUR Á FRUMGERÐ]

Endilega látið mig vita hvað ykkur finnst.

Bestu kveðjur, Sindri
sindrimar02@gmail.com`,
  },
  ownPhotography: false,
  photoCredit:
    'Myndir af herbergjum, göngum, gerði og versluninni eru raunverulegar ljósmyndir af Hundahótelinu Ásbrú, sóttar af vef þeirra. Myndir af öðrum hundum eru frá Unsplash og eru til skýringar, ekki íbúar hótelsins.',
}
