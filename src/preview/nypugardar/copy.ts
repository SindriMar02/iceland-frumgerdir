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
    /** Second line of the h1: what the place is and where, in the words a
     *  traveller types into a search box. */
    tagline: 'Sheep farm guesthouse between Höfn and Jökulsárlón',
    sub: 'Glaciers in the window, lamb on the table, a bed for the night.',
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
    datesAria: 'Choose your arrival and departure dates',
    openCalendar: 'Open the calendar',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    strikeNote: 'Crossed-out nights were fully booked at our last check',
    mayBeFull: 'Those nights looked fully booked at our last check. The booking page has the final word.',
  },

  farm: {
    eyebrow: 'The flock',
    heading: 'Sheep on the hill, reindeer on the flats',
    body: 'The flock shares the hill with a dog and a cat, and wild reindeer come down onto the land. In spring, guests are welcome to watch the lambing. In winter, you can lend a hand with light farm work if you feel like it.',
    guestsFull: 'Guests when full',
    open: 'Open',
    allYear: 'All year',
    reindeerAlt: 'Two wild reindeer grazing on the open land at Nýpugarðar',
    reindeerCaption: 'Wild reindeer on the land',
  },

  hill: {
    eyebrow: 'The glacier light',
    heading: 'Iceland’s highest mountain in the window',
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
    heading: 'Thirteen places to sleep, one big view',
    body: 'Nine rooms with a bathroom of their own, two that share, and two cottages beside the house. Plain, comfortable, and that view from the pillow.',
    seeAll: 'See every room and photo',
    seeAllNote: 'Seven room types and the two cottages, each with its own photographs and its own price, on a page of their own.',
    /** The horizontal strip of room types under the counts. */
    stripLabel: 'Room types',
    prevRooms: 'Previous room types',
    nextRooms: 'Next room types',
    stripHint: 'Left and right arrow keys move between room types.',
    openRoom: 'Photos and details',
    /** Short forms for the room index chips; the bands carry the full Godo names. */
    short: {
      twinSharedEconomy: 'Twin, economy',
      doubleTwinShared: 'Double/twin, shared bath',
      double: 'Double',
      doubleTwinPrivate: 'Double/twin, private bath',
      doublePrivateExtraBed: 'Double + extra bed',
      cottage3: 'Cottage for 3',
      familyCottage: 'Family cottage',
    },
    cottagesHeading: 'Two cottages beside the house',
    cottagesBody: 'Two timber cottages, 20 and 25 square metres, each with its own bathroom. Room for two to four guests, with the fields right outside the door.',
    cottage1Alt: 'The family cottage at Nýpugarðar, red roof and a timber porch, standing on the grass',
    cottage1Caption: 'The family cottage, sleeps four',
    cottage2Alt: 'The cottage for three at Nýpugarðar, seen across the field behind it',
    cottage2Caption: 'The cottage for three',
    beforeYouCome: 'Before you arrive',
    arrive: 'Arrive',
    leave: 'Leave',
    until: 'until 23:30',
    from: 'from 07:30',
    photoNote: 'A booking flow that shows the same picture on four different room cards undoes the trust the rest of the page builds.',
  },

  dinner: {
    eyebrow: 'Dinner is served',
    heading: 'Lamb for dinner, the\u00a0glacier for company',
    intro:
      'This is what guests remember. Booking.com describes Nýpugarðar simply: a sheep farm with simple, fresh rooms, a home-cooked breakfast and a dinner buffet with lamb. Traditional Icelandic cooking with local ingredients, eaten in a dining room whose windows face the ice.',
    body: 'Dinner is served here on the farm, in the dining room with the windows facing the glacier. There is nothing to book ahead and nothing to arrange online. Tell us when you arrive that you would like to eat, and a place is set for you.',
    diningAlt:
      'The dining room at Nýpugarðar, tables set for about twenty guests in front of full-height windows facing the glacier',
    diningCaption: 'The dining room, windows facing the glacier',
    deckAlt:
      'Dusk view from the guesthouse deck at Nýpugarðar, benches facing wide grassland and a low sun',
    deckCaption: 'The deck, just before dinner',
    breakfastHeading: 'And breakfast in the same window',
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
    springHeading: 'Come and watch the lambing in spring',
    springBody:
      'When the lambs arrive, guests are welcome in the sheep shed to watch. It is the busiest, loudest, best time of year on the farm.',
    winterHeading: 'Northern lights over the winter farm',
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
    pause: 'Pause the reviews',
    resume: 'Resume the reviews',
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
    heading: 'Stay the night, and stay for dinner',
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
    pricesNote: 'The lowest nightly rate in the next twelve months. The exact price for your dates comes up when you check availability.',
    checkedOn: 'Prices checked',
  },

  /* The six questions guests actually ask before booking. These are RENDERED
   * on the rooms page and mirrored into FAQPage structured data by
   * tools/nypugardar-seo.mjs, which fails the build if the two drift apart.
   * That order matters: schema answering something the page does not say is
   * the fastest way to a manual penalty, so the page is the source and the
   * schema follows it. Every answer opens with the fact, not with a greeting. */
  faq: {
    heading: 'Questions guests ask',
    items: [
      {
        q: 'How far is Jökulsárlón from the farm?',
        a: 'Jökulsárlón is 47 km away, a little under an hour along Route 1. Höfn is a 25 minute drive, and the farm sits 4 km off the Ring Road.',
      },
      {
        q: 'Can I have dinner at the farm?',
        a: 'Yes, a buffet with lamb and traditional Icelandic cooking, served in the dining room facing the glacier. There is nothing to book ahead, just tell us when you arrive.',
      },
      {
        q: 'What do you serve for breakfast?',
        a: 'A buffet in the same room, with the same view, and the kitchen covers vegetarian, vegan and gluten-free. Breakfast to go if you are leaving for the glacier lagoon before the room opens.',
      },
      {
        q: 'What time can I check in and out?',
        a: 'Check in from 16:00 to 23:30, and check out from 07:30 to 11:00.',
      },
      {
        q: 'Can I bring a pet, and are children welcome?',
        a: 'No pets, and the whole house is non-smoking. Children are welcome, and guests aged 7 and over are charged as adults.',
      },
      {
        q: 'Can I book directly with the farm?',
        a: 'Yes, dates and prices here are live and the booking goes through our own system, so you deal with the farm and not an agency. Nýpugarðar is also on Booking.com, HeyIceland and Guide to Iceland.',
      },
    ],
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
    body: 'Every photograph here is our own. The rooms have their own section above, so this is the farm, the land and the table.',
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
    tagline: 'Gistihús á sauðfjárbúi milli Hafnar og Jökulsárlóns',
    sub: 'Jöklar í glugganum, lamb á borðinu og rúm fyrir nóttina.',
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
    datesAria: 'Veldu komu- og brottfarardag',
    openCalendar: 'Opna dagatalið',
    prevMonth: 'Fyrri mánuður',
    nextMonth: 'Næsti mánuður',
    strikeNote: 'Yfirstrikaðar nætur voru fullbókaðar við síðustu athugun',
    mayBeFull: 'Þessar nætur virtust fullbókaðar við síðustu athugun. Bókunarsíðan ræður úrslitum.',
  },

  farm: {
    eyebrow: 'Féð',
    heading: 'Fé á hólnum, hreindýr á sléttunni',
    body: 'Féð deilir hólnum með hundi og ketti, og villt hreindýr koma niður á landið. Á vorin eru gestir velkomnir að fylgjast með sauðburði. Á veturna má taka til hendinni í léttum bústörfum ef þig langar til þess.',
    guestsFull: 'Gestir þegar fullt er',
    open: 'Opið',
    allYear: 'Allt árið',
    reindeerAlt: 'Tvö villt hreindýr á beit á landi Nýpugarða',
    reindeerCaption: 'Villt hreindýr á landinu',
  },

  hill: {
    eyebrow: 'Jökulbirtan',
    heading: 'Hæsta fjall Íslands í glugganum',
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
    heading: 'Þrettán vistarverur, eitt stórt útsýni',
    body: 'Níu herbergi með eigin baði, tvö með sameiginlegu og tvö sumarhús við hlið hússins. Einfalt, notalegt, og útsýnið beint úr rúminu.',
    seeAll: 'Skoða öll herbergi og myndir',
    seeAllNote: 'Sjö herbergisgerðir og sumarhúsin tvö, hver með sínum myndum og sínu verði, á sérsíðu.',
    stripLabel: 'Herbergisgerðir',
    prevRooms: 'Fyrri herbergisgerðir',
    nextRooms: 'Næstu herbergisgerðir',
    stripHint: 'Örvatakkar til vinstri og hægri fletta milli herbergisgerða.',
    openRoom: 'Myndir og nánar',
    short: {
      twinSharedEconomy: 'Hagkvæmt, sameiginlegt bað',
      doubleTwinShared: 'Sameiginlegt bað',
      double: 'Tveggja manna',
      doubleTwinPrivate: 'Eigin bað',
      doublePrivateExtraBed: 'Eigin bað og aukarúm',
      cottage3: 'Sumarhús fyrir 3',
      familyCottage: 'Fjölskyldusumarhús',
    },
    cottagesHeading: 'Tvö sumarhús við hlið hússins',
    cottagesBody: 'Tvö timburhús, 20 og 25 fermetra, hvort um sig með eigin baðherbergi. Pláss fyrir tvo til fjóra gesti og túnin beint fyrir utan dyrnar.',
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
    heading: 'Lamb í kvöldmat og jökullinn til borðs',
    intro:
      'Þetta er það sem gestir muna. Booking.com lýsir Nýpugörðum einfaldlega svona: sauðfjárbú með einföldum og hreinlegum herbergjum, heimalöguðum morgunmat og kvöldhlaðborði með lambakjöti. Hefðbundin íslensk matargerð úr hráefni úr héraðinu, borðuð í matsal þar sem gluggarnir snúa að jöklinum.',
    body: 'Kvöldmaturinn er borinn fram hér á bænum, í matsalnum þar sem gluggarnir snúa að jöklinum. Það þarf ekkert að panta fyrirfram og ekkert að ganga frá á netinu. Láttu okkur vita þegar þú kemur að þú viljir borða, og þá er lagt á borð fyrir þig.',
    diningAlt:
      'Matsalurinn á Nýpugörðum, borð lögð fyrir um tuttugu gesti fyrir framan gólfsíða glugga sem snúa að jöklinum',
    diningCaption: 'Matsalurinn, gluggarnir snúa að jöklinum',
    deckAlt:
      'Kvöldútsýni af veröndinni á Nýpugörðum, bekkir snúa að víðum túnum og lágri sól',
    deckCaption: 'Veröndin, rétt fyrir kvöldmat',
    breakfastHeading: 'Og morgunmatur í sama glugga',
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
    springHeading: 'Komdu og fylgstu með sauðburðinum á vorin',
    springBody:
      'Þegar lömbin koma eru gestir velkomnir í fjárhúsin að fylgjast með. Það er annasamasti, hávaðasamasti og besti tími ársins á bænum.',
    winterHeading: 'Norðurljós yfir bænum á veturna',
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
    pause: 'Stöðva umsagnirnar',
    resume: 'Halda áfram með umsagnirnar',
    guestReviewOn: 'umsögn gests á Booking.com',
  },

  info: {
    eyebrow: 'Að rata til okkar',
    heading: 'Tuttugu og fimm mínútur frá Höfn',
    callFarm: 'Hringdu í bæinn',
    writeToUs: 'Sendu okkur línu',
    address: 'Heimilisfangið',
    onTheProperty: 'Á staðnum',
    bookDirect:
      'Bókaðu beint hjá okkur og þá ertu í samskiptum við bæinn, ekki milliliði. Dagsetningar og laus herbergi uppfærast jafnóðum. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland ef þú vilt frekar bóka þar. Fyrir allt annað er síminn fljótlegastur.',
    mobile: 'Farsími',
  },

  closing: {
    heading: 'Gistu nóttina og vertu í kvöldmat',
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
    pricesNote: 'Lægsta verð á nótt næstu tólf mánuði. Nákvæmt verð fyrir þínar dagsetningar birtist þegar þú kannar laus herbergi.',
    checkedOn: 'Verð sótt',
  },

  faq: {
    heading: 'Spurningar sem gestir spyrja',
    items: [
      {
        q: 'Hvað er langt að Jökulsárlóni?',
        a: 'Jökulsárlón er í 47 km fjarlægð, tæpan klukkutíma eftir þjóðvegi 1. Til Hafnar er 25 mínútna akstur og bærinn stendur 4 km frá hringveginum.',
      },
      {
        q: 'Er hægt að fá kvöldmat á bænum?',
        a: 'Já, hlaðborð með lambakjöti og hefðbundinni íslenskri matargerð, borið fram í matsalnum sem snýr að jöklinum. Það þarf ekkert að panta fyrirfram, láttu bara vita þegar þú kemur.',
      },
      {
        q: 'Hvað er í morgunmat?',
        a: 'Hlaðborð í sama sal, með sama útsýni, og eldhúsið ræður við grænmetisfæði, vegan og glútenlaust. Morgunmat má fá með í nesti ef þú leggur af stað að Jökulsárlóni áður en salurinn opnar.',
      },
      {
        q: 'Hvenær er innritun og útritun?',
        a: 'Innritun er frá 16:00 til 23:30 og útritun frá 07:30 til 11:00.',
      },
      {
        q: 'Mega gæludýr koma og eru börn velkomin?',
        a: 'Gæludýr eru ekki leyfð og húsið er reyklaust. Börn eru velkomin og gestir 7 ára og eldri greiða sem fullorðnir.',
      },
      {
        q: 'Get ég bókað beint hjá bænum?',
        a: 'Já, dagsetningar og verð hér uppfærast jafnóðum og bókunin fer í gegnum okkar eigið kerfi, svo þú ert í samskiptum við bæinn en ekki milliliði. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland.',
      },
    ],
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
    heading: 'Bærinn, landið og borðið',
    body: 'Allar myndir hér eru okkar eigin. Herbergin eiga sinn eigin kafla hér að ofan, svo hér er bærinn, landið og borðið.',
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
