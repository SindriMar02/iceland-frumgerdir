/**
 * Nýpugarðar — every visible string, in both languages.
 *
 * `is` is typed as `typeof en`, so TypeScript fails the build the moment an
 * Icelandic key goes missing or gets misspelled. A half-translated page is the
 * usual way bilingual sites rot; this makes it impossible rather than merely
 * discouraged.
 *
 * TWO DELIBERATE DECISIONS, both easy to "fix" wrongly:
 *
 * 1. THE DEFAULT IS ENGLISH HERE, unlike reynir bakarí where it is Icelandic.
 *    That is not an oversight, it follows the guest mix. Her Booking.com
 *    reviews are from Finland, France, Switzerland, Italy, Australia, the UK
 *    and Germany; the domain is glacierview.is; the old site was English only.
 *    A first-time visitor to this site is overwhelmingly a foreign traveller
 *    planning an Iceland trip, so English is the honest default and Icelandic
 *    is one tap away. Flip DEFAULT_LANG in useLang.ts if that ever changes.
 *
 * 2. THE GUEST QUOTES ARE NOT TRANSLATED. They are real, attributed Booking.com
 *    reviews written in English by named people. Rewriting them in Icelandic
 *    would put words in a guest's mouth, which is exactly the kind of quiet
 *    dishonesty the rest of this build avoids. Only the attribution note is
 *    translated. Paolo's already carries "translated from Italian" because
 *    Booking.com itself translated it.
 *
 * House style: no dashes as sentence punctuation in visible copy, in either
 * language. Ranges like 16:00–23:30 are typography, not prose, and are fine.
 */

export type Lang = 'is' | 'en'

const en = {
  langName: 'EN',
  otherLangName: 'Íslenska',
  switchTo: 'Skipta yfir á íslensku',

  nav: {
    farm: 'The farm',
    rooms: 'Rooms',
    dinner: 'Dinner',
    gallery: 'Photos',
    reviews: 'Guests',
    info: 'Find us',
    menu: 'Site menu',
  },

  cta: {
    check: 'Check availability',
    bookEvening: 'Book your evening at Nýpugarðar',
    callFarm: 'Call the farm',
    bookRoom: 'Book',
    liveFromGodo: 'Live dates and prices come straight from our booking system',
  },

  hero: {
    eyebrow: 'Kvöldverðurinn á Mýrum',
    sub: 'A working sheep farm between Höfn and Jökulsárlón. Stay the night and sit down to dinner.',
  },

  booking: {
    arriving: 'Arriving',
    leaving: 'Leaving',
    adults: 'Adults',
    children: 'Children',
    night: 'night',
    nights: 'nights',
    ageNote: 'guests 7 and older count as adults',
    pricesNext: 'prices shown on the next step',
    placeholder: 'Godo booking connects here',
  },

  farm: {
    eyebrow: 'The flock',
    heading: 'A working farm, not a themed hotel',
    body: 'The flock shares the hill with a dog and a cat, and wild reindeer come down onto the land. In spring, guests are welcome to watch the lambing. In winter, you can lend a hand with light farm work if you feel like it.',
    guestsFull: 'Guests when full',
    open: 'Open',
    allYear: 'All year',
    reindeerAlt: 'Two wild reindeer grazing on the open land at Nýpugarðar',
    reindeerCaption: 'Wild reindeer on the land',
  },

  hill: {
    eyebrow: 'The glacier light',
    heading: 'A small hill with the whole horizon',
    body: 'The guesthouse stands on a low hill above the lowlands of Mýrar. The bright rooms look out over Hornafjörður fjord and Hvannadalshnjúkur, the highest mountain in Iceland.',
    glacierAlt: 'Snow-covered peaks standing over the flats of Mýrar, the fjord catching the light behind them',
    ridgeEyebrow: 'The ridge behind the farm',
    ridgeAlt: 'Snow-capped mountain ridge with a glacier at its base under a blue sky',
  },

  place: {
    heading: 'Four kilometres off the Ring Road, then quiet',
    body: 'The farm sits a short drive off Route 1, a little east of the river Hólmsá. Close enough for a morning at Jökulsárlón, far enough that the evenings stay quiet. Hólmi Zoo is 5 km away, and Þórbergssetur museum and the Hornafjörður swimming pool are both within half an hour.',
  },

  rooms: {
    eyebrow: 'Your room',
    heading: 'Thirteen simple places to sleep',
    body: 'Bright, warm rooms in the main house, and two small cottages with bathrooms of their own. Plain, comfortable, and that view from the pillow.',
    cottagesHeading: 'The two cottages',
    cottagesBody: 'Two timber cottages of 20 and 25 square metres stand beside the main house, each with its own bathroom. Room for two to four guests, with the fields right outside the door.',
    cottage1Alt: 'The family cottage at Nýpugarðar, red roof and a timber porch, standing on the grass',
    cottage1Caption: 'The family cottage, sleeps four',
    cottage2Alt: 'The cottage for three at Nýpugarðar, seen across the field behind it',
    cottage2Caption: 'The cottage for three',
    beforeYouCome: 'Before you come',
    arrive: 'Arrive',
    leave: 'Leave',
    until: 'until 23:30',
    from: 'from 07:30',
    photoNote: 'A booking flow that shows the same picture on four different room cards undoes the trust the rest of the page builds.',
  },

  dinner: {
    eyebrow: 'Dinner is served',
    heading: 'A dinner buffet with lamb',
    intro:
      'This is what guests remember. Booking.com describes Nýpugarðar simply: a sheep farm with simple, fresh rooms, a home-cooked breakfast and a dinner buffet with lamb. Traditional Icelandic cooking with local ingredients, eaten in a dining room whose windows face the ice.',
    body: 'Dinner is served here on the farm, in the dining room with the windows facing the glacier. There is nothing to book ahead and nothing to arrange online. Tell us when you arrive that you would like to eat, and a place is set for you.',
    diningAlt:
      'The dining room at Nýpugarðar, tables set for about twenty guests in front of full-height windows facing the glacier',
    diningCaption: 'The dining room, windows facing the glacier',
    deckAlt:
      'Dusk view from the guesthouse deck at Nýpugarðar, benches facing wide grassland and a low sun',
    deckCaption: 'The deck, just before dinner',
    breakfastHeading: 'And breakfast before you go',
    breakfastBody:
      'A buffet in the same room, with the same view. Guests rate it highly, and the kitchen can cover most ways of eating.',
    breakfastAlt:
      'The breakfast buffet laid out at Nýpugarðar: bread, cold cuts, jams and a coffee pot',
    breakfastCaption: 'The breakfast table',
    served: 'Served',
    weCanCover: 'We can cover',
    toGoLead: 'Driving to the glacier lagoon before the room opens?',
    toGoTail: 'Say so the night before and it will be waiting.',
  },

  seasons: {
    srHeading: 'The seasons at Nýpugarðar',
    springHeading: 'Spring is for lambing',
    springBody:
      'When the lambs arrive, guests are welcome in the sheep shed to watch. It is the busiest, loudest, best time of year on the farm.',
    winterHeading: 'Winter is for dark skies',
    winterBody:
      'The house is open all year. Guide to Iceland calls it an ideal location for spotting the northern lights in the winter months, and there is light farm work to join if you want to earn your dinner.',
    springAlt:
      'An old turf-roofed outbuilding at Nýpugarðar standing in deep green summer grass',
    springCaption: 'The old shed on the hill',
    winterAlt:
      'The guesthouse deck at Nýpugarðar under deep snow, the plain and the mountains white to the horizon',
    winterCaption: 'The deck in winter',
    duskAlt:
      'The sun setting over open grassland at Nýpugarðar, mountains silhouetted on the horizon',
    duskEyebrow: 'Nightfall',
  },

  reviews: {
    eyebrow: 'Guests',
    srHeading: 'Guest reviews',
    outOf: '/ 10',
    scoreWord: 'Fabulous',
    reviewsOn: 'guest reviews on Booking.com',
    via: 'Guest reviews via',
    sourceNote: ', harvested 25 August 2026. Every review where a guest wrote something is here. The other stays left a score and no words, and what guests said could be better is on Booking.',
    translatedFromItalian: 'Translated from Italian',
    setLabel: 'Show guest reviews, set',
    of: 'of',
    written: 'written reviews',
    prevSet: 'Previous reviews',
    nextSet: 'Next reviews',
    guestReviewOn: 'guest review on Booking.com',
  },

  info: {
    eyebrow: 'Finding us',
    heading: 'Twenty five minutes from Höfn',
    callFarm: 'Call the farm',
    writeToUs: 'Write to us',
    address: 'The address',
    onTheProperty: 'On the property',
    bookDirect:
      'Book directly with us and you deal with the farm, not an agency. Dates and availability are live. Nýpugarðar is also listed on Booking.com, HeyIceland and Guide to Iceland if you would rather book there. For anything else, the phone is quickest.',
    mobile: 'Mobile',
  },

  closing: {
    heading: 'Book your evening at Nýpugarðar',
    body: 'A room with the horizon in the window, and a seat at the table when the lamb comes out of the kitchen.',
    heroAlt:
      'Low evening sun raking across the flats at Nýpugarðar, outlet glaciers and snow peaks along the whole horizon',
  },

  footer: {
    company: 'Nýpugarðar ehf. is an active, registered Icelandic company, kt. 510805-0380.',
  },

  price: {
    from: 'from',
    perNight: 'per night',
    roomTypes: 'Room types and prices',
    sleeps: 'Sleeps',
    pricesNote: 'Lowest nightly rate seen in the next twelve months. The exact price for your dates is shown when you check availability.',
    checkedOn: 'Prices checked',
  },

  units: {
    privateBath: 'rooms with private bathroom',
    sharedBath: 'rooms with shared bathroom',
    cottages: 'cottages for 2 to 4 guests',
    guestsFull: 'guests when the house is full',
  },

  rules: {
    openAllYear: 'Open all year',
    childrenWelcome: 'Children welcome',
    childrenNote: 'guests 7 and older pay as adults',
    noPets: 'No pets',
    noSmoking: 'No smoking',
  },

  facilities: {
    Restaurant: 'Restaurant',
    Bar: 'Bar',
    'Free WiFi': 'Free WiFi',
    'Free private parking': 'Free private parking',
    Garden: 'Garden',
    Terrace: 'Terrace',
    Hiking: 'Hiking',
    'Family rooms': 'Family rooms',
    'Non-smoking rooms': 'Non-smoking rooms',
  },

  breakfast: {
    Buffet: 'Buffet',
    Continental: 'Continental',
    Vegetarian: 'Vegetarian',
    Vegan: 'Vegan',
    'Gluten-free': 'Gluten-free',
    'Breakfast to go': 'Breakfast to go',
  },

  gallery: {
    eyebrow: 'Every frame',
    heading: 'The farm, the land and the table',
    body: 'Every photograph here is Nýpugarðar\u2019s own. The rooms have their own section above; this is the farm, the land and the table.',
    byRoom: 'Every room type, with its own bathroom',
    andTheRest: 'And the rest of it',
    groups: {
      table: 'The dining room',
      house: 'The house and the deck',
      land: 'The land around it',
    },
    alt: {
      land: 'The land around Nýpugarðar',
      house: 'The guesthouse at Nýpugarðar',
      table: 'The dining room at Nýpugarðar',
      bathPrivate: 'Private bathroom at Nýpugarðar',
      bathShared: 'Shared bathroom at Nýpugarðar',
    },
  },

  distances: {
    offRoute1: 'off Route 1, the Ring Road',
    driveToHofn: 'drive to Höfn',
    toGlacierLagoon: 'to Jökulsárlón glacier lagoon',
  },

  scoreCats: {
    Host: 'Host',
    'Free WiFi': 'Free WiFi',
    Cleanliness: 'Cleanliness',
    Comfort: 'Comfort',
    Location: 'Location',
    'Value for money': 'Value for money',
  },
}

const is: typeof en = {
  langName: 'ÍS',
  otherLangName: 'English',
  switchTo: 'Switch to English',

  nav: {
    farm: 'Bærinn',
    rooms: 'Gisting',
    dinner: 'Matur',
    gallery: 'Myndir',
    reviews: 'Umsagnir',
    info: 'Að rata',
    menu: 'Valmynd',
  },

  cta: {
    check: 'Kanna laus herbergi',
    bookEvening: 'Bókaðu kvöldið á Nýpugörðum',
    callFarm: 'Hringdu í bæinn',
    bookRoom: 'Bóka',
    liveFromGodo: 'Laus herbergi og verð koma beint úr bókunarkerfinu okkar',
  },

  hero: {
    eyebrow: 'Kvöldverðurinn á Mýrum',
    sub: 'Sauðfjárbú í fullum rekstri milli Hafnar og Jökulsárlóns. Gistu nóttina og seztu að kvöldverði.',
  },

  booking: {
    arriving: 'Koma',
    leaving: 'Brottför',
    adults: 'Fullorðnir',
    children: 'Börn',
    night: 'nótt',
    nights: 'nætur',
    ageNote: 'gestir 7 ára og eldri teljast fullorðnir',
    pricesNext: 'verð birtast í næsta skrefi',
    placeholder: 'Godo bókun tengist hér',
  },

  farm: {
    eyebrow: 'Féð',
    heading: 'Alvöru bú, ekki hótel með sveitaþema',
    body: 'Á Nýpugörðum er alvöru búskapur í fullum rekstri, ekki hótel með sveitaþema. Féð deilir hólnum með hundi og ketti, og villt hreindýr koma niður á landið. Á vorin eru gestir velkomnir að fylgjast með sauðburði. Á veturna má taka til hendinni í léttum bústörfum ef þig langar til þess.',
    guestsFull: 'Gestir þegar fullt er',
    open: 'Opið',
    allYear: 'Allt árið',
    reindeerAlt: 'Tvö villt hreindýr á beit á landi Nýpugarða',
    reindeerCaption: 'Villt hreindýr á landinu',
  },

  hill: {
    eyebrow: 'Jökulbirtan',
    heading: 'Lítill hóll með allan sjóndeildarhringinn',
    body: 'Gistihúsið stendur á lágum hól upp af Mýrunum. Björt herbergin snúa út að Hornafirði og Hvannadalshnjúki, hæsta fjalli landsins.',
    glacierAlt: 'Snævi þaktir tindar yfir Mýrunum, fjörðurinn tekur birtuna fyrir aftan þá',
    ridgeEyebrow: 'Fjallgarðurinn að baki',
    ridgeAlt: 'Snævi þakinn fjallgarður með jökul við rætur sínar undir bláum himni',
  },

  place: {
    heading: 'Fjórir kílómetrar frá hringveginum, svo kyrrð',
    body: 'Bærinn stendur stutt frá þjóðvegi 1, skammt austan við Hólmsá. Nógu nálægt til að eyða morgni við Jökulsárlón, nógu langt frá til að kvöldin haldist kyrrlát. Húsdýragarðurinn á Hólmi er í 5 km fjarlægð, og Þórbergssetur og sundlaugin á Höfn eru bæði í innan við hálftíma akstri.',
  },

  rooms: {
    eyebrow: 'Herbergið þitt',
    heading: 'Þrettán einfaldar vistarverur',
    body: 'Björt og hlý herbergi í aðalhúsinu og tvö lítil sumarhús með eigin baði. Ekkert prjál, allt sem þarf, og útsýnið beint úr rúminu.',
    cottagesHeading: 'Sumarhúsin tvö',
    cottagesBody: 'Tvö timburhús, 20 og 25 fermetra, standa við hlið aðalhússins og hvort um sig með eigin baðherbergi. Pláss fyrir tvo til fjóra gesti og túnin beint fyrir utan dyrnar.',
    cottage1Alt: 'Fjölskyldusumarhúsið á Nýpugörðum, rautt þak og timburverönd, stendur á grasinu',
    cottage1Caption: 'Fjölskyldusumarhúsið, fyrir fjóra',
    cottage2Alt: 'Sumarhúsið fyrir þrjá á Nýpugörðum, séð yfir túnið fyrir aftan það',
    cottage2Caption: 'Sumarhúsið fyrir þrjá',
    beforeYouCome: 'Áður en þú kemur',
    arrive: 'Koma',
    leave: 'Brottför',
    until: 'til 23:30',
    from: 'frá 07:30',
    photoNote: 'Bókunarferli sem sýnir sömu myndina á fjórum ólíkum herbergjum eyðileggur traustið sem restin af síðunni byggir upp.',
  },

  dinner: {
    eyebrow: 'Kvöldmaturinn',
    heading: 'Kvöldhlaðborð með lambakjöti',
    intro:
      'Þetta er það sem gestir muna. Booking.com lýsir Nýpugörðum einfaldlega svona: sauðfjárbú með einföldum og hreinlegum herbergjum, heimalöguðum morgunmat og kvöldhlaðborði með lambakjöti. Hefðbundin íslensk matargerð úr hráefni úr héraðinu, borðuð í matsal þar sem gluggarnir snúa að jöklinum.',
    body: 'Kvöldmaturinn er borinn fram hér á bænum, í matsalnum þar sem gluggarnir snúa að jöklinum. Það þarf ekkert að panta fyrirfram og ekkert að ganga frá á netinu. Láttu okkur vita þegar þú kemur að þú viljir borða, og þá er lagt á borð fyrir þig.',
    diningAlt:
      'Matsalurinn á Nýpugörðum, borð lögð fyrir um tuttugu gesti fyrir framan gólfsíða glugga sem snúa að jöklinum',
    diningCaption: 'Matsalurinn, gluggarnir snúa að jöklinum',
    deckAlt:
      'Kvöldútsýni af veröndinni á Nýpugörðum, bekkir snúa að víðum túnum og lágri sól',
    deckCaption: 'Veröndin, rétt fyrir kvöldmat',
    breakfastHeading: 'Og morgunmatur áður en þú ferð',
    breakfastBody:
      'Hlaðborð í sama sal, með sama útsýni. Gestir gefa því háa einkunn og eldhúsið ræður við flestar tegundir mataræðis.',
    breakfastAlt:
      'Morgunverðarhlaðborðið á Nýpugörðum: brauð, álegg, sultur og kaffikanna',
    breakfastCaption: 'Morgunverðarborðið',
    served: 'Borið fram',
    weCanCover: 'Við ráðum við',
    toGoLead: 'Ertu að keyra að Jökulsárlóni áður en salurinn opnar?',
    toGoTail: 'Láttu vita kvöldið áður og þá bíður hann þín.',
  },

  seasons: {
    srHeading: 'Árstíðirnar á Nýpugörðum',
    springHeading: 'Vorið er sauðburður',
    springBody:
      'Þegar lömbin koma eru gestir velkomnir í fjárhúsin að fylgjast með. Það er annasamasti, hávaðasamasti og besti tími ársins á bænum.',
    winterHeading: 'Veturinn er dimmur himinn',
    winterBody:
      'Húsið er opið allt árið. Guide to Iceland kallar staðinn kjörinn til að sjá norðurljósin yfir vetrarmánuðina, og það má taka þátt í léttum bústörfum ef þú vilt vinna fyrir kvöldmatnum.',
    springAlt:
      'Gamalt torfþakið útihús á Nýpugörðum í djúpgrænu sumargrasi',
    springCaption: 'Gamla húsið í brekkunni',
    winterAlt:
      'Veröndin á Nýpugörðum í djúpum snjó, sléttan og fjöllin hvít alla leið að sjóndeildarhring',
    winterCaption: 'Veröndin að vetri',
    duskAlt:
      'Sólin sest yfir opnum túnum á Nýpugörðum, fjöll skuggamynduð við sjóndeildarhringinn',
    duskEyebrow: 'Þegar dimmir',
  },

  reviews: {
    eyebrow: 'Gestir',
    srHeading: 'Umsagnir gesta',
    outOf: '/ 10',
    scoreWord: 'Frábært',
    reviewsOn: 'umsagnir gesta á Booking.com',
    via: 'Umsagnir gesta af',
    sourceNote: ', sóttar 25. ágúst 2026. Hér eru allar umsagnir þar sem gestur skrifaði eitthvað. Hinar dvalirnar skildu aðeins eftir einkunn, og það sem gestir sögðu að mætti bæta er á Booking.',
    translatedFromItalian: 'Þýtt úr ítölsku',
    setLabel: 'Sýna umsagnir gesta, hópur',
    of: 'af',
    written: 'skrifuðum umsögnum',
    prevSet: 'Fyrri umsagnir',
    nextSet: 'Næstu umsagnir',
    guestReviewOn: 'umsögn gests á Booking.com',
  },

  info: {
    eyebrow: 'Að rata til okkar',
    heading: 'Auðvelt að finna, erfitt að yfirgefa',
    callFarm: 'Hringdu í bæinn',
    writeToUs: 'Sendu okkur línu',
    address: 'Heimilisfangið',
    onTheProperty: 'Á staðnum',
    bookDirect:
      'Bókaðu beint hjá okkur og þá ertu í samskiptum við bæinn, ekki milliliði. Dagsetningar og laus herbergi uppfærast jafnóðum. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland ef þú vilt frekar bóka þar. Fyrir allt annað er síminn fljótlegastur.',
    mobile: 'Farsími',
  },

  closing: {
    heading: 'Bókaðu kvöldið á Nýpugörðum',
    body: 'Herbergi með sjóndeildarhringinn í glugganum, og sæti við borðið þegar lambið kemur úr eldhúsinu.',
    heroAlt:
      'Lágstæð kvöldsól strýkur yfir flatlendið á Nýpugörðum, skriðjöklar og snævi þaktir tindar við sjóndeildarhringinn',
  },

  footer: {
    company: 'Nýpugarðar ehf. er skráð og starfandi íslenskt félag, kt. 510805-0380.',
  },

  price: {
    from: 'frá',
    perNight: 'á nótt',
    roomTypes: 'Herbergisgerðir og verð',
    sleeps: 'Fyrir',
    pricesNote: 'Lægsta verð á nótt sem sést á næstu tólf mánuðum. Nákvæmt verð fyrir þínar dagsetningar birtist þegar þú kannar laus herbergi.',
    checkedOn: 'Verð sótt',
  },

  units: {
    privateBath: 'herbergi með eigin baði',
    sharedBath: 'herbergi með sameiginlegu baði',
    cottages: 'sumarhús fyrir 2 til 4 gesti',
    guestsFull: 'gestir þegar húsið er fullt',
  },

  rules: {
    openAllYear: 'Opið allt árið',
    childrenWelcome: 'Börn velkomin',
    childrenNote: 'gestir 7 ára og eldri greiða sem fullorðnir',
    noPets: 'Gæludýr ekki leyfð',
    noSmoking: 'Reykingar bannaðar',
  },

  facilities: {
    Restaurant: 'Veitingastaður',
    Bar: 'Bar',
    'Free WiFi': 'Frítt þráðlaust net',
    'Free private parking': 'Frí bílastæði á staðnum',
    Garden: 'Garður',
    Terrace: 'Verönd',
    Hiking: 'Gönguleiðir',
    'Family rooms': 'Fjölskylduherbergi',
    'Non-smoking rooms': 'Reyklaus herbergi',
  },

  breakfast: {
    Buffet: 'Hlaðborð',
    Continental: 'Meginlandsmorgunverður',
    Vegetarian: 'Grænmetisfæði',
    Vegan: 'Vegan',
    'Gluten-free': 'Glútenlaust',
    'Breakfast to go': 'Morgunmatur með í nesti',
  },

  gallery: {
    eyebrow: 'Allar myndirnar',
    heading: 'Allur staðurinn, herbergi fyrir herbergi',
    body: 'Allar myndir hér eru frá Nýpugörðum sjálfum. Herbergin eiga sinn eigin kafla hér að ofan; hér er bærinn, landið og borðið.',
    byRoom: 'Hver herbergisgerð, með sínu baðherbergi',
    andTheRest: 'Og allt hitt',
    groups: {
      table: 'Matsalurinn',
      house: 'Húsið og veröndin',
      land: 'Landið í kring',
    },
    alt: {
      land: 'Landið umhverfis Nýpugarða',
      house: 'Gistihúsið á Nýpugörðum',
      table: 'Matsalurinn á Nýpugörðum',
      bathPrivate: 'Eigið baðherbergi á Nýpugörðum',
      bathShared: 'Sameiginlegt baðherbergi á Nýpugörðum',
    },
  },

  distances: {
    offRoute1: 'frá hringveginum',
    driveToHofn: 'akstur til Hafnar',
    toGlacierLagoon: 'að Jökulsárlóni',
  },

  scoreCats: {
    Host: 'Gestgjafi',
    'Free WiFi': 'Frítt net',
    Cleanliness: 'Hreinlæti',
    Comfort: 'Þægindi',
    Location: 'Staðsetning',
    'Value for money': 'Verð og gæði',
  },
}

export const COPY = { en, is } as const
export type Copy = typeof en
