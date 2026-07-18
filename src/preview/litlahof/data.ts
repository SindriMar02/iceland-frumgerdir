/* ── Litla-Hof — „Hjá torfkirkjunni" ─────────────────────────────────────────
 * Concept: the page is the slow drive up to the farm. Ring Road → the open
 * Öræfi valley → Iceland's youngest turf church → the farm gate. A single
 * scroll-drawn ink line (the gate line) traces that drive down the page.
 *
 * Every fact below is sourced from the vetted brief/dossier (checked
 * 2026-07-18/19): Bændablaðið 17.12.2015, Hey Iceland's own listing,
 * Ferdalag.is, Gista.is, Booking.com (live-checked), Tripadvisor snippets,
 * Þjóðminjasafn Íslands / icelandmag / guidetoiceland for Hofskirkja.
 * All photographs are the property's own real Booking.com gallery photos,
 * served locally from public/litlahof/. No stock imagery.
 * ───────────────────────────────────────────────────────────────────────── */

const B = import.meta.env.BASE_URL + 'litlahof/'

export const IMG = {
  hero: B + 'hero.jpg', // cottage exterior, golden hour, mountain cliff behind
  valley: B + 'valley.jpg', // wide Hof hamlet under the mountain wall, gravel road
  church: B + 'church.jpg', // Hofskirkja: yellow timber, turf roof, stone wall
  stonewall: B + 'stonewall.jpg', // old stone/turf boundary wall on a green hillside
  valley2: B + 'valley2.jpg', // green valley floor, farm cluster in the distance
  doorway: B + 'doorway.jpg', // guest at an open cottage door, looking over the field
  cottageA: B + 'cottage-brown.jpg', // cottage exterior with wooden deck and ramp
  cottageWhite: B + 'cottage-white.jpg', // the white cottage in full sun
  kitchen: B + 'kitchen.jpg', // cottage kitchen/dining, window light
  living: B + 'living.jpg', // cottage sitting room
  bathroom: B + 'bathroom.jpg', // modern grey-tiled shared bathroom
  room1: B + 'room1.jpg', // farmhouse bedroom, single + twin
  room2: B + 'room2.jpg', // farmhouse bedroom, double + single, window onto the flat
  peak: B + 'peak.jpg', // snow-covered peak of the Öræfajökull massif by the road
  window: B + 'window.jpg', // curtained window framing the open pasture
} as const

export const PHONE_1 = '478-1670'
export const PHONE_1_HREF = 'tel:+3544781670'
export const PHONE_2 = '894-8670'
export const PHONE_2_HREF = 'tel:+3548948670'
export const EMAIL = 'litlahof@simnet.is'
export const ADDRESS = 'Litla-Hof, 785 Öræfi'
export const MAP_HREF = 'https://www.google.com/maps/search/?api=1&query=Litla-Hof+Guesthouse+%C3%96r%C3%A6fi'

export const HERO = {
  eyebrow: 'Öræfi · Suðausturland',
  h1a: 'Gisting á starfandi búi,',
  h1b: 'hjá yngstu torfkirkju Íslands.',
  sub: 'Litla-Hof er fjölskyldubú með sauðfé og hesta undir hæsta tindi landsins. Skaftafell er í um 20 km fjarlægð og Jökulsárlón í um 37 km.',
  cta: 'Senda fyrirspurn',
  imageAlt: 'Sumarhús á Litla-Hofi í kvöldsól, hátt hamrabelti fyrir ofan græn tún',
}

export const APPROACH = {
  heading: 'Af hringveginum, upp heimreiðina',
  body: 'Litla-Hof stendur rétt við þjóðveg 1 í Öræfum, einn af fimm bæjum í hinni fornu byggð að Hofi. Stutt heimreið liggur af veginum heim að bænum, með fjallgarðinn beint fyrir ofan túnin og jökulinn á bak við.',
  imageAlt: 'Byggðin að Hofi í Öræfum séð yfir túnin, lítil bæjarhús undir háum fjallavegg',
  labels: ['Þjóðvegur 1', '785 Öræfi', 'Fimm bæir að Hofi'],
}

export const CHURCH = {
  heading: 'Hofskirkja',
  lede: 'Nokkur skref frá bænum stendur yngsta torfkirkja Íslands, ein af aðeins sex sem enn standa.',
  body: 'Kirkja hefur staðið að Hofi í um 700 ár. Elsta ritaða heimildin er frá 1343. Núverandi kirkju reisti Páll Pálsson smiður á árunum 1883 til 1885, með veggi úr grjóti og torfþak yfir timburgrind. Þjóðminjasafn Íslands gerði kirkjuna upp 1953 til 1954 og hún var endurvígð 1954. Gestir á Litla-Hofi ganga fram hjá henni á hverjum degi.',
  imageAlt: 'Hofskirkja í Öræfum, gult timburhús með grænu torfþaki, hvítum krossi og hlöðnum grjótvegg',
  facts: [
    { value: '1883–85', label: 'Byggingarár' },
    { value: '6', label: 'Torfkirkjur standa enn' },
    { value: '700 ár', label: 'Kirkjustaður að Hofi' },
  ],
  quotes: [
    {
      text: 'Excellent location, ample parking, large comfy single room and modern shared bathroom. Very convenient for the grass covered church, which makes excellent foreground for Aurora pics, and the nearby glaciers',
      name: 'Simon, Bretlandi',
      source: 'Booking.com',
    },
    {
      text: 'Lovely cottage that made us feel at home straight away. Everything inside was clean and comfortable and the owner was very helpful. It was also near a quaint turf church',
      name: 'Sing, Singapúr',
      source: 'Booking.com',
    },
  ],
}

export const FARM = {
  heading: 'Starfandi bú, ekki hótel',
  body: 'Á Litla-Hofi er rekið sauðfjárbú með hross og sama fjölskyldan hefur staðið að búskapnum í að minnsta kosti tvær kynslóðir. Hross sem ræktuð eru á bænum bera nafnið frá Litla-Hofi. Gestir gista í miðri hversdagslegri sveit, ekki á sviðsettum ferðamannastað.',
  datedNote: 'Í umfjöllun Bændablaðsins árið 2015 voru 570 kindur og 20 hross á búinu og tvær kynslóðir fjölskyldunnar við búskap.',
  imageAlt: 'Gamall hlaðinn grjótveggur í grænni hlíð við Litla-Hof',
}

export const ROOMS = {
  heading: 'Herbergin í bænum',
  body: 'Í bænum eru fjögur tveggja manna herbergi og eitt eins manns herbergi með sameiginlegu baðherbergi og sérinngangi. Morgunverður er í boði fyrir gesti í bænum og fær sérstakt hrós í umsögnum.',
  sleepingBag: 'Einnig er svefnpokapláss í sérhúsi með sameiginlegri aðstöðu.',
  specs: [
    { label: 'Innritun', value: '16:00–23:00' },
    { label: 'Útritun', value: '07:00–11:00' },
    { label: 'Herbergi', value: '4×2 + 1×1' },
  ],
  photos: [
    { img: 'room1', alt: 'Herbergi í bænum með einbreiðum rúmum, skrifborði og fataskáp' },
    { img: 'room2', alt: 'Herbergi í bænum með hjónarúmi og einbreiðu rúmi, gluggi út á túnin' },
    { img: 'bathroom', alt: 'Nútímalegt flísalagt baðherbergi með sturtuklefa' },
  ] as const,
}

export const COTTAGES = {
  heading: 'Tvö sumarhús á túninu',
  body: 'Bæði húsin eru með tveimur svefnherbergjum, eigin eldhúsi, borðstofu, setustofu með sjónvarpi og sér baðherbergi. Gestir sjá um sig sjálfir í húsunum. Morgunverður fylgir ekki.',
  cards: [
    {
      name: 'Brúna húsið',
      desc: 'Eitt hjónaherbergi og eitt herbergi með hjónarúmi eða tveimur rúmum. Hægt að bæta við aukarúmi.',
      img: 'cottageA',
      alt: 'Sumarhús á Litla-Hofi með timburverönd og aðgengisrampi',
    },
    {
      name: 'Hvíta húsið',
      desc: 'Eitt tveggja rúma herbergi og eitt herbergi með hjónarúmi eða tveimur rúmum. Hægt að bæta við herbergjum gegn gjaldi.',
      img: 'cottageWhite',
      alt: 'Hvíta sumarhúsið á Litla-Hofi í glampandi sól',
    },
  ] as const,
  interiors: [
    { img: 'kitchen', alt: 'Eldhús og borðstofa í sumarhúsi, birta úr glugga' },
    { img: 'living', alt: 'Setustofa í sumarhúsi með sófa og sófaborði' },
  ] as const,
  priceLabel: 'Verð frá um $145 á nótt',
  priceNote: 'Verð er leiðbeinandi og byggt á verðum þriðja aðila (Booking.com o.fl.), oftast um $150 til $250 eftir herbergi og árstíma. Hafið samband til að fá staðfest verð.',
}

export const REVIEWS = {
  heading: 'Gestirnir segja það sjálfir',
  scores: [
    { value: '8,7', of: '/ 10', note: 'umsagnir á Booking.com' },
    { value: '5,0', of: '/ 5', note: 'Tripadvisor, #2 af 3 gististöðum í Hofi' },
    { value: '9,5', of: '/ 10', note: 'Þráðlaust net, Booking.com' },
    { value: '9,3', of: '/ 10', note: 'Þrifnaður, Booking.com' },
  ],
  quotes: [
    {
      text: 'A lovely stay at the guesthouse - a quiet town by a mountain, calm and with an amazing view over fields. The room is nice and spacious, and the bathroom is huge and with nice toiletries. Self-check-in is nice and quick.',
      name: 'Zariana, Úkraínu',
      source: 'Booking.com',
    },
    {
      text: 'This was our favorite stay in Iceland.',
      name: 'Gestur á Tripadvisor',
      source: 'Tripadvisor',
    },
  ],
  imageAlt: 'Gestur stendur í opnum dyrum sumarhúss og horfir yfir opið túnið',
}

export const NEARBY = {
  heading: 'Það sem þú komst til að sjá',
  body: 'Öræfajökull gnæfir beint yfir bænum og hæsti tindur landsins, Hvannadalshnúkur, blasir við af hlaðinu. Litla-Hof skipuleggur ekki ferðir. Bærinn er einfaldlega góður staður til að gista á meðan þú skoðar þetta allt.',
  imageAlt: 'Snævi þakinn tindur í Öræfajökulsmassífinu við veginn',
  places: [
    { name: 'Skaftafell', dist: '≈ 20 km', desc: 'Gönguleiðir, jöklasýn og þjónustumiðstöð Vatnajökulsþjóðgarðs.' },
    { name: 'Svartifoss', dist: '≈ 21 km', desc: 'Stuðlabergsfossinn frægi, gengið frá Skaftafelli.' },
    { name: 'Jökulsárlón', dist: '≈ 37 km', desc: 'Jökullónið fræga, stutt austur eftir hringveginum.' },
    { name: 'Hvannadalshnúkur', dist: '2.110 m', desc: 'Hæsti tindur Íslands, beint fyrir ofan bæinn.' },
  ],
}

export const PRACTICAL = {
  heading: 'Hagnýtar upplýsingar',
  season: 'Opið frá 1. mars fram eftir hausti',
  items: [
    { label: 'Innritun', value: '16:00–23:00' },
    { label: 'Útritun', value: '07:00–11:00' },
    { label: 'Staðsetning', value: 'Rétt við þjóðveg 1' },
    { label: 'Tímabil', value: 'Frá 1. mars' },
  ],
}

export const CLOSING = {
  heading: 'Sendu okkur línu',
  body: 'Það er engin bókunarvél og ekkert þjónustugjald. Þú hringir eða sendir tölvupóst, og svarið kemur beint frá bænum.',
  imageAlt: 'Gluggi með gardínum sem rammar inn kyrrlátt útsýni yfir túnin',
}

export const DISCLOSURE =
  'Þessi síða er hönnunarfrumgerð frá SNDR Studio, ekki vefur Litla-Hofs. Allar ljósmyndir eru raunverulegar myndir af gististaðnum og umhverfi hans úr myndasafni Booking.com. Umsagnir eru orðréttar úr umsögnum á Booking.com og Tripadvisor. Verð eru leiðbeinandi og byggð á verðum þriðja aðila. Upplýsingar um búskapinn byggja á umfjöllun Bændablaðsins frá 2015. Staðfestar upplýsingar: 478-1670 / 894-8670 · litlahof@simnet.is · Litla-Hof, 785 Öræfi.'
