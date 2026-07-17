/* ── Guesthouse Seljavellir — "Einn dagur á Seljavöllum" ─────────────────────
 * Every fact, price, quote and distance below comes from the verified brief
 * (2026-07-16): Booking.com live listing, the guesthouse's own Facebook Page,
 * ferdalag.is / south.is, keldan.is. Nothing invented.
 *
 * Honesty guardrails honoured in this file:
 *  · Prices are a live SAMPLE captured 16 July 2026, framed as seasonal.
 *  · No breakfast inclusion/price policy stated (unverified either way).
 *  · No founding year, no owner name, no dinner menu items.
 *  · 3 of 17 photos are disclosed stock (aurora / lagoon / breakfast nook);
 *    all others are the property's own Booking.com + Facebook photos.
 *  · Both publicly listed contact sets shown transparently.
 * ──────────────────────────────────────────────────────────────────────────── */

const asset = (f: string) => import.meta.env.BASE_URL + 'seljavellir/' + f

export const IMG = {
  /* Own photos — Booking.com gallery + Facebook Page, fetched 2026-07-16 */
  hero: asset('hero-golden-panorama.jpg'), // fb-1: golden-hour panorama, glacier-topped range, hay bales
  exteriorField: asset('exterior-field.jpg'), // booking-1: long low building, green field, mountain
  exteriorAngle: asset('exterior-angle.jpg'), // booking-5: building + field + mountain, alt angle
  exteriorSky: asset('exterior-sky.jpg'), // booking-8: building + mountain + cloud sky
  walkway: asset('walkway-mountains.jpg'), // fb-2: walkway along the building, snow-capped mountains
  roomMountain: asset('room-mountain-view.jpg'), // booking-4: floor-to-ceiling window, mountain view (landscape)
  roomTwin: asset('room-twin.jpg'), // booking-2: twin beds, wood-slat wall
  roomTwinDay: asset('room-twin-daylight.jpg'), // fb-4: twin beds, daylight
  roomDouble: asset('room-double.jpg'), // fb-3: double bed, orange towels
  roomDesk: asset('room-desk.jpg'), // fb-5: desk, chairs, TV
  roomBed: asset('room-bed-detail.jpg'), // booking-6: bed/pillow close-up
  bathMirror: asset('bath-mirror.jpg'), // booking-3: round backlit mirror, towels
  bathDetail: asset('bath-detail.jpg'), // booking-7: mirror + sink close-up
  bathShower: asset('bath-shower.jpg'), // fb-6: glass-walled shower
  /* Disclosed stock (Unsplash, free tier, verified non-premium) */
  aurora: asset('aurora-vestrahorn.jpg'), // Jonny Gios — aurora over Vestrahorn/Stokksnes near Höfn
  jokulsarlon: asset('jokulsarlon.jpg'), // Xavier S. — Jökulsárlón icebergs
  breakfast: asset('breakfast-nook.jpg'), // Clay Banks — farmhouse breakfast nook (illustrative)
} as const

/* ── Contact — two real, different public contact sets. Presented openly,
      never silently merged (brief section A). ─────────────────────────────── */
export const CONTACT_PRIMARY = {
  label: 'Gistihúsið',
  source: 'Samkvæmt Facebook-síðu gistihússins',
  phone: '+354 478 1866',
  phoneHref: 'tel:+3544781866',
  email: 'info@seljavellir.is',
}
export const CONTACT_DIRECT = {
  label: 'Bein lína',
  source: 'Samkvæmt ferdalag.is og south.is',
  phone: '859 8801',
  phoneHref: 'tel:+3548598801',
  email: 'reynirasg@gmail.com',
}

export const BOOKING_URL = 'https://www.booking.com/hotel/is/guesthouse-seljavellir.html'
export const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Guesthouse+Seljavellir+H%C3%B6fn'
export const ADDRESS = 'Seljavellir, 781 Höfn í Hornafirði'

/* ── Hero ──────────────────────────────────────────────────────────────────── */
export const HERO = {
  time: '04:50',
  timeLabel: 'Fyrir sólarupprás',
  title: 'Einn dagur á Seljavöllum',
  sub: 'Sveitagisting við þjóðveg 1, átta mínútur frá Höfn og 72 km frá Jökulsárlóni.',
  ctaPrimary: 'Skoða laus herbergi',
  ctaSecondary: 'Bóka núna',
  alt: 'Kvöldsól yfir Seljavöllum: jökultopparnir gullnir, heyrúllur á túnunum og gistihúsið í fjarska.',
}

/* ── 06:12 — Morgunmatur ───────────────────────────────────────────────────── */
export const MORNING = {
  time: '06:12',
  timeLabel: 'Morgunmatur',
  heading: 'Morguninn byrjar við hlaðborðið',
  body: 'Gestir hrósa morgunverðarhlaðborðinu í umsögnum: egg elduð eftir óskum, nýbakað brauð, álegg og ostar, ferskir ávextir og pönnukökur sem fá sérstakt hrós. Hlaðborðið stendur fram eftir morgni, svo það má alveg sofa út.',
  imageAlt: 'Björt morgunverðarstemning í sveitaeldhúsi með borði og föstum bekk.',
  imageNote: 'Lýsandi mynd af morgunstemningu, ekki matsalur gistihússins.',
  askLabel: 'Spurning um morgunmat? Sendu okkur línu',
  facts: [
    { label: 'Innritun', value: 'frá 16:30' },
    { label: 'Útritun', value: 'til 11:00' },
    { label: 'Morgunverður', value: 'opinn fram eftir morgni' },
  ],
  factsNote: 'Hagnýtu svörin sem gamla vefsíðan gat aldrei gefið, öll á einum stað.',
}

/* ── 09:40 — Herbergi og verð (Booking.com room names + live sample) ───────── */
export interface Room {
  id: string
  name: string
  beds: string
  specs: string[]
  price: string
  priceNote: string
  image: keyof typeof IMG
  imageAlt: string
  featured?: boolean
}

export const ROOMS_INTRO = {
  time: '09:40',
  timeLabel: 'Herbergi og verð',
  heading: 'Herbergin',
  body: 'Fjórar gerðir herbergja, öll með sérbaðherbergi og sturtu, skrifborði, setuaðstöðu og fríu WiFi. Sum herbergi snúa að fjöllunum og önnur í átt að jöklinum.',
  rangeNote: 'Verð frá um það bil 35.000 til 75.000 kr. á nótt eftir árstíma og herbergi.',
  footnote:
    'Verðin hér eru sýnishorn af lifandi verðum af Booking.com, tekin 16. júlí 2026, með sköttum. Verð breytast eftir árstíð, Booking.com sýnir rétt verð fyrir ykkar dagsetningar.',
  cta: 'Bóka núna á Booking.com',
}

export const ROOMS: Room[] = [
  {
    id: 'double-mountain',
    name: 'Tveggja manna herbergi með fjallasýn',
    beds: '2 einbreið rúm',
    specs: ['18 m²', 'Jarðhæð', 'Sérinngangur', 'Gluggi að fjöllunum'],
    price: 'Frá 47.255 kr. nóttin',
    priceNote: 'Sýnishorn: 15. til 16. sept. 2026, 2 fullorðnir',
    image: 'roomMountain',
    imageAlt: 'Herbergi með fjallasýn: gólfsíður gluggi að fjöllunum, rúm, tveir stólar og hringspegill.',
    featured: true,
  },
  {
    id: 'double-twin',
    name: 'Tveggja manna eða twin herbergi',
    beds: '2 einbreið rúm',
    specs: ['Sérbaðherbergi', 'Skrifborð', 'Setuaðstaða'],
    price: 'Verð eftir árstíð',
    priceNote: 'Sjá Booking.com fyrir ykkar dagsetningar',
    image: 'roomTwin',
    imageAlt: 'Herbergi með tveimur rúmum, dökkum viðarvegg og veggljósum, gluggi út á tún.',
  },
  {
    id: 'triple',
    name: 'Þriggja manna herbergi',
    beds: '3 einbreið rúm',
    specs: ['Sérbaðherbergi', 'Skrifborð', 'Setuaðstaða'],
    price: 'Verð eftir árstíð',
    priceNote: 'Sjá Booking.com fyrir ykkar dagsetningar',
    image: 'roomTwinDay',
    imageAlt: 'Bjart herbergi á Seljavöllum með rúmum og dagsbirtu úr glugga.',
  },
  {
    id: 'triple-mountain',
    name: 'Þriggja manna herbergi með fjallasýn',
    beds: '3 einbreið rúm',
    specs: ['Sérbaðherbergi', 'Gluggi að fjöllunum'],
    price: 'Verð eftir árstíð',
    priceNote: 'Sjá Booking.com fyrir ykkar dagsetningar',
    image: 'roomDouble',
    imageAlt: 'Herbergi á Seljavöllum: uppbúið rúm með appelsínugulum handklæðum og veggljósum.',
  },
]

/* Small room-detail strip under the cards — booking-6 + fb-5 (brief §3) */
export const ROOM_DETAILS = [
  {
    key: 'roomBed' as const,
    alt: 'Nærmynd af uppbúnu rúmi á Seljavöllum, gluggi og hurð með svörtu gluggatjaldi.',
  },
  {
    key: 'roomDesk' as const,
    alt: 'Skrifborð, tveir stólar og sjónvarp á vegg í herbergi á Seljavöllum.',
  },
]

export const ROOM_AMENITIES = [
  'Sérbaðherbergi með sturtu',
  'Frítt WiFi (9,4 í einkunn)',
  'Skrifborð og setuaðstaða',
  'Hárþurrka og handklæði',
  'Hitakerfi í öllum herbergjum',
]

/* ── 11:05 — Baðherbergin (short detail beat) ──────────────────────────────── */
export const BATH = {
  time: '11:05',
  timeLabel: 'Baðherbergin',
  heading: 'Gólfhiti og góð sturta',
  body: 'Sturtuklefar með glervegg, upphitað gólf sem má stilla eftir smekk, hringspegill með baklýsingu og hárþurrka á sínum stað.',
  quote:
    'The room is very comfortable and a bonus of heated floors too! Perfect in the winter but can be turned down to your liking.',
  quoteBy: 'Daniel, Bretlandi',
  quoteSource: 'Booking.com, orðrétt',
  images: [
    { key: 'bathMirror' as const, alt: 'Baðherbergi með hringspegli með baklýsingu, vaski og samanbrotnum handklæðum.' },
    { key: 'bathShower' as const, alt: 'Sturtuklefi með glervegg og flísalögðum veggjum.' },
    { key: 'bathDetail' as const, alt: 'Nærmynd af baðherbergi: spegill, vaskur og hárþurrka.' },
  ],
}

/* ── 12:30 — Jökulsárlón ───────────────────────────────────────────────────── */
export const MIDDAY = {
  time: '12:30',
  timeLabel: 'Jökulsárlón',
  heading: '72 kílómetrar að Jökulsárlóni',
  body: 'Þjóðvegur 1 liggur beint fram hjá gistihúsinu. Dagsferð að Jökulsárlóni er einföld héðan: 72 km eftir þjóðveginum, og herbergið bíður á meðan. Höfn er svo aðeins átta mínútur í hina áttina.',
  imageAlt: 'Jökulsárlón: ísjakar fljóta á lóninu í blávítri vetrarbirtu.',
  imageNote: 'Lýsandi mynd af Jökulsárlóni, ekki tekin af gistihúsinu.',
  stepOutside: {
    heading: 'Gengið út á hlað',
    body: 'Fjöllin eru beint fyrir framan gistihúsið og bíllinn við dyrnar. Hornafjarðarflugvöllur er 1 km í burtu.',
    imageAlt: 'Gangstétt meðfram gistihúsinu á Seljavöllum, snævi þakin fjöll og blár himinn.',
  },
}

/* ── 15:00 — Umsagnir (real scores + verbatim quotes) ──────────────────────── */
export const REVIEWS = {
  time: '15:00',
  timeLabel: 'Umsagnir',
  heading: 'Það sem gestir segja',
  body: 'Einkunnir og umsagnir hér eru orðréttar af Booking.com, sóttar 16. júlí 2026.',
  scores: [
    { value: '8,6', label: 'Á Booking.com', note: '2.039 umsagnir' },
    { value: '9,1', label: 'Þægindi', note: 'Booking.com' },
    { value: '9,0', label: 'Þrifnaður', note: 'Booking.com' },
    { value: '8,9', label: 'Staðsetning', note: 'Booking.com' },
  ],
  tripadvisor: 'Í 3. sæti af 21 gistiheimili í Höfn á Tripadvisor, 4 af 5 í einkunn (staða í júlí 2026).',
}

export const QUOTES = [
  {
    text: 'A modern, stylish, and clean place. The room was well-equipped, and felt both private and cozy. The beds were very comfortable, the shower had amazing water pressure, and the large windows offered beautiful mountain views. The location is perfect…',
    by: 'Iurie, Sviss',
  },
  {
    text: 'We liked everything, we had two separate rooms with good showers and toilets, very beautifully designed, very warm and cosy. In reception we had access to free coffee or tea, refrigerator, microwave, plates and cutlery.',
    by: 'Nat, Bretlandi',
  },
  {
    text: 'Very clean and cosy. Exceptionally polite cleaning staff. Close to Hofn just off the ring road.',
    by: 'Tomas, Litáen',
  },
]

/* ── 16:20 — Býlið ─────────────────────────────────────────────────────────── */
export const FARM = {
  time: '16:20',
  timeLabel: 'Býlið',
  heading: 'Sveitabær í fullum rekstri',
  body: 'Seljavellir eru fjölskyldurekið gistihús á starfandi búi. Kýr eru á beit á túnunum í kring og í garðinum geta börn leikið sér á meðan foreldrarnir slaka á. Gestum hefur boðist óformleg skoðunarferð um búið þegar vel stendur á.',
  network: 'Býlið tekur þátt í Beint frá býli, neti bænda sem bjóða mat beint frá búum sínum.',
  imageAlt: 'Gistihúsið á Seljavöllum: lágreist svarthvít bygging, grænt tún og fjall í baksýn.',
  image2Alt: 'Gistihúsið á Seljavöllum undir fjallinu, hvít ský á bláum himni.',
}

/* ── 18:45 — Kvöldið ───────────────────────────────────────────────────────── */
export const DUSK = {
  time: '18:45',
  timeLabel: 'Kvöldið',
  heading: 'Kvöldsól á veröndinni',
  body: 'Þegar sólin lækkar færist kvöldið út á veröndina. Hér er verönd, bar og garður, og maturinn sem borinn er fram á rætur í túnunum hér í kring.',
  cta: 'Panta borð eða spyrja um kvöldmat',
  imageAlt: 'Gistihúsið á Seljavöllum séð frá túninu, fjallið fyrir aftan í síðdegisbirtu.',
}

/* ── 22:45 — Nóttin ────────────────────────────────────────────────────────── */
export const NIGHT = {
  time: '22:45',
  timeLabel: 'Nóttin',
  heading: 'Ekkert borgarljós',
  body: 'Seljavellir standa utan þéttbýlis og á heiðskírum kvöldum er himinninn eins dimmur og hann gerist. Yfir veturinn eiga norðurljósin það til að sýna sig, og Vestrahorn við Stokksnes er rétt hjá.',
  quote:
    'Excellent! It was the best place in our journey arrived Iceland. Modern and big room. Self check in and check out. Good common place for lunch - it has all necessary kitchen equipment. It places outside city - so no any city light and we saw…',
  quoteBy: 'Anton, Kýpur',
  quoteSource: 'Booking.com, orðrétt',
  imageAlt: 'Norðurljós yfir Vestrahorni við Stokksnes, stjörnubjartur himinn yfir snævi þöktum fjöllum.',
  imageNote: 'Lýsandi mynd: Vestrahorn er skammt frá Höfn. Ekki mynd af gistihúsinu sjálfu.',
}

/* ── 23:59 — Bókun + hagnýtt ───────────────────────────────────────────────── */
export const BOOKING = {
  time: '23:59',
  timeLabel: 'Bókun',
  heading: 'Bókaðu nóttina á Seljavöllum',
  body: 'Bókanir fara í gegnum Booking.com. Fyrirspurnir um morgunmat, kvöldmat eða hópa má senda beint á gistihúsið.',
  cta: 'Bóka núna á Booking.com',
  contactNote: 'Tvær samskiptaleiðir eru birtar opinberlega fyrir Seljavelli og báðar eru sýndar hér.',
  practical: [
    { label: 'Heimilisfang', value: ADDRESS },
    { label: 'Staðsetning', value: 'Við þjóðveg 1, 1 km frá Hornafjarðarflugvelli' },
    { label: 'Höfn', value: '8 mínútna akstur' },
    { label: 'Jökulsárlón', value: '72 km' },
    { label: 'Innritun', value: 'Frá 16:30' },
    { label: 'Útritun', value: 'Til 11:00' },
  ],
  rules: [
    'Börn á öllum aldri velkomin, 3 ára og eldri greiða fullorðinsverð',
    'Gæludýr ekki leyfð',
    'Reyklaust gistihús',
    'Töluð íslenska og enska',
  ],
}

/* ── Honesty footer ────────────────────────────────────────────────────────── */
export const DISCLOSURE = [
  'Um heiðarleika: myndirnar af norðurljósum við Vestrahorn, Jökulsárlóni og morgunverðarborði eru lýsandi safnmyndir (Unsplash: Jonny Gios, Xavier S., Clay Banks), ekki myndir af gistihúsinu. Allar aðrar myndir eru raunverulegar myndir af Seljavöllum, af Booking.com-síðu og Facebook-síðu gistihússins.',
  'Verð eru sýnishorn af lifandi verðum tekin 16. júlí 2026 og breytast eftir árstíð. Einkunnir (Booking.com 8,6 af 2.039 umsögnum, Tripadvisor 3. sæti af 21) eru raunverulegar og sóttar sama dag. Umsagnir gesta eru orðréttar. Tímasetningar í köflum síðunnar eru frásagnarleg umgjörð, ekki opnunartímar.',
].join(' ')
