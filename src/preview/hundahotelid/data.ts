/**
 * HUNDAHÓTELIÐ ÁSBRÚ — "Hótel fyrir besta vin þinn"
 * ---------------------------------------------------------------------------
 * Dog (and cat) boarding hotel, Klettatröð 6A, Ásbrú, Reykjanesbær.
 * Redesign concept for batch 13.
 *
 * EVERY fact below is taken verbatim (or condensed without changing meaning)
 * from hundahotelid.is, fetched and re-verified 2026-07-28: the front page,
 * /adstadan, /leikskolinn, /lifid, /skilmalar and /hafasamband. Founder names
 * and the April 2021 opening date are additionally cross-checked against the
 * Víkurfréttir profile "Hér hafa fallið tár" (vf.is/mannlif/her-hafa-fallid-tar),
 * named as an allowed source in the brief. No capacity numbers, no reviews, no
 * "largest dog hotel" claim: none of those appear on hundahotelid.is today, so
 * none are printed (the Víkurfréttir article states capacity 44 -> 82, but the
 * brief restricts capacity claims to what the COMPANY'S OWN SITE states, so
 * that number is deliberately left out).
 *
 * CORRECTION VS. THE BRIEF: the brief assumed boarding was priced by dog SIZE
 * (small 7.900 / medium 8.900 / large 9.900 / xl 15.900). The live site shows
 * boarding priced by NUMBER OF DOGS per day (1 hundur 5.500 kr, 2 hundar 8.300
 * kr, 3 hundar 9.800 kr), and the size-tiered numbers the brief quoted
 * (8.900 / 9.900 / 10.900 / 16.900) are actually "Bað og blástur" (bath and
 * blow-dry / grooming), priced by size. Both tables are reproduced below
 * exactly as published, correctly labelled.
 *
 * Sources
 *   /              hero copy, price tables (boarding, grooming, walks,
 *                  transport, daycare, training), opening hours, contact
 *   /adstadan      what to bring, real facility photos
 *   /leikskolinn   how daycare works (07:45-18:00, rest 12:00-13:00)
 *   /lifid         the daily rhythm, 08:00 to 18:00, the honest rest-time note
 *   /skilmalar     check-in/out windows, cancellation, payment, no dogs in heat
 *   /hafasamband   contact channels
 *   vf.is/mannlif/her-hafa-fallid-tar  founders, April 2021 opening (Víkurfréttir)
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
 * a proper rest window with calm music, more outdoor time). That is the
 * reassurance an owner leaving a dog actually needs.
 */

import type { PreviewCompany } from '../company-types'

const asset = (p: string) => `${import.meta.env.BASE_URL}hundahotelid/img/${p}`

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

/* ── the five services (drives both the hero resident viewer and the
   Þjónusta grid; anchors point at the matching card / section) ─────────── */

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
    anchor: '#adstadan',
  },
  {
    id: 'dagvistun',
    label: 'Dagvistun',
    tagline: 'Skutlaðu hvutta til okkar á meðan þið vinnið, sækið hann seinni partinn.',
    img: IMG.dogRollGrass,
    imgAlt: 'Kátur hundur veltir sér í grasinu',
    priceNote: 'Frá 3.000 kr. fyrir einn hund',
    anchor: '#dagvistun',
  },
  {
    id: 'gongutur',
    label: 'Göngutúrar',
    tagline: 'Auka útivera hvenær sem þið viljið, þið ráðið hversu oft.',
    img: IMG.dogPath,
    imgAlt: 'Hundur á göngu eftir malarstíg',
    priceNote: '1.500 kr. á göngutúr',
    anchor: '#gongutur',
  },
  {
    id: 'snyrting',
    label: 'Snyrting',
    tagline: 'Bað og blástur. Ilmandi hreinn hundur þegar þið sækið hann.',
    img: IMG.dogSpaniel,
    imgAlt: 'Snyrtilegur hundur situr á grasflöt',
    priceNote: 'Frá 8.900 kr. eftir stærð',
    anchor: '#snyrting',
  },
  {
    id: 'akstur',
    label: 'Akstur',
    tagline: 'Hundaskutl. Við sækjum og skilum í Hafnarfjörð.',
    img: IMG.dogRunning,
    imgAlt: 'Hundur á fullri ferð úti',
    priceNote: '9.500 kr. hver ferð',
    anchor: '#akstur',
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

/* ── ticker words (device 5) ─────────────────────────────────────────── */

export const TICKER_WORDS = [
  'ÚTIVERA',
  'DEKUR',
  'GÖNGUTÚRAR',
  'OPIÐ ALLA DAGA ÁRSINS',
  'HVÍLD',
  'LEIKUR',
  'ENGIR RAUÐIR DAGAR',
]

/* ── audit flaws, verified 2026-07-28 on the live site ───────────────── */

export const AUDIT = {
  strengths: [
    'Opið alla daga ársins, 07:45-18:00, engir rauðir dagar og sama verð allan ársins hring',
    'Alvöru, nýleg aðstaða: einkaherbergi, gerði og verslun, ekki heimatilbúið bílskúrshótel',
    'Föst, róleg dagleg rútína með útiveru og skipulögðum hvíldartíma',
    'Fjölskyldufyrirtæki með nafn og andlit á bak við sig, starfrækt síðan 2021',
  ],
  weaknesses: [
    'BÓKA hnappurinn í haus síðunnar opnar hvorki bókunarform né neina aðra síðu (staðfest með smelli 2026-07-28)',
    'Fyrirtækið kallar sig eingöngu "Hundahótelið" á vefnum þótt formlega nafnið sé Hunda- og kattahótelið Ásbrú, kettir eru hvergi nefndir',
    'Verðskráin er ein romsa af tölum neðst á forsíðu: gisting, bað, göngutúrar, dagvistun og skutl blandast saman án nokkurrar sjónrænnar stigskiptingar',
    'Forsíðan sýnir eingöngu keypt stock-myndefni af hundum (sólgleraugu, hundur undir stýri), ekki eina einustu mynd af hótelinu sjálfu',
    'Alvöru myndirnar af herbergjum og gerði eru grafnar undir undirsíðuna Aðstaðan sem 300 pixla smámyndir',
    'Dagleg rútína og hvíldartími, sem er besta traustsvopn fyrirtækisins, er hvergi nefnd á forsíðunni',
    'Tengiliðanetfangið er @gmail.com hjá annars fullskráðu fyrirtæki með kennitölu',
  ],
  opportunities: [
    'Selja öryggistilfinninguna beint: full 365 daga opnun og skýra dagskrá í stað þess að fela hana',
    'Sýna alvöru aðstöðuna strax í stað stock-mynda af ókunnugum hundum',
    'Gera verðskrána læsilega í eigin köflum eftir þjónustu í stað einnar romsu',
  ],
}

export const POSITIONING =
  'Ekki bara gisting heldur hugarró: fastur dagur, alvöru herbergi og sama þjónusta 365 daga á ári, sett fram jafn skýrt og aðstaðan sjálf er alvöru.'

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

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#adstadan', label: 'Aðstaðan' },
  { href: '#dagurinn', label: 'Dagurinn' },
  { href: '#thjonusta', label: 'Þjónusta' },
  { href: '#verdskra', label: 'Verðskrá' },
  { href: '#bokun', label: 'Bókun' },
]

/* ── company entry for the lead to merge into companies.ts ──────────── */

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
  accent: '#2F6E3B',
  dark: false,
  status: 'Concept ready' as const,
  thumb: asset('facility-yard-1.webp'),
  audit: AUDIT,
  positioning: POSITIONING,
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Hundahótelið Ásbrú',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Hundahótelið Ásbrú og fannst strax gott að þið séuð opin alla daga ársins, sama hvað gengur á. Það er einmitt sú tegund af öryggi sem hundaeigendur eru að leita að þegar þeir þurfa að skilja besta vin sinn eftir. En vefsíðan ykkar í dag segir ekki þá sögu. Verðskráin er í smáu letri neðst á síðunni, alvöru myndirnar af herbergjunum og gerðinu eru faldar undir undirsíðu, og BÓKA hnappurinn efst gerir í raun ekki neitt þegar á hann er smellt.

Mér fannst það synd, því starfið sem þið vinnið á skilið að sjást strax: alvöru útivera, fastur hvíldartími með rólegri tónlist og heimilisleg herbergi. Þess vegna settist ég niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, þar sem dagleg rútína, aðstaðan og verðskráin fá loksins að njóta sín. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma: [HLEKKUR Á FRUMGERÐ]

Endilega látið mig vita hvað ykkur finnst.

Bestu kveðjur, Sindri
sindrimar02@gmail.com`,
  },
  ownPhotography: false,
  photoCredit:
    'Myndir af herbergjum, göngum, gerði og versluninni eru raunverulegar ljósmyndir af Hundahótelinu Ásbrú, sóttar af vef þeirra. Myndir af öðrum hundum eru frá Unsplash og eru til skýringar, ekki íbúar hótelsins.',
}
