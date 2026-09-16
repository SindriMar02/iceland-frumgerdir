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
    /** Visually the kicker at the head of the frame; in the markup it is the
     *  second half of the h1, after the wordmark, in the words a traveller
     *  types into a search box. */
    kicker: 'A quiet guesthouse between Höfn and Jökulsárlón',
    alt: 'Low sun across the flats at Nýpugarðar, the outlet glaciers and snow peaks along the horizon',
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

  manifesto: {
    kicker: 'Only the sounds of nature',
    text: 'Nýpugarðar stands on a low hill above Mýrar, a short drive off the Ring Road. Eleven rooms and two cottages, glaciers in the window, and in the evening nothing to hear but nature.',
  },

  facts: {
    rooms: 'rooms, two of them with a shared bathroom',
    cottages: 'cottages beside the house, for three and for four',
    checkin: 'check in, until 23:30',
  },

  band: {
    heading: 'The glaciers in the window',
    body: 'The house looks out across Mýrar to the mountains and the outlet glaciers of Vatnajökull. On a clear day you see them from the dining room, and from September to April it is a good place to watch for the northern lights.',
    alt: 'Snow peaks above the flats of Mýrar, the grass lit rust red by a low sun under a blue sky',
    auroraN: 'Sept to April',
    aurora: 'northern lights season',
    roadN: '4 km',
    road: 'off Route 1, the Ring Road',
    viewN: 'Clear days',
    view: 'glaciers in view from the dining room',
  },

  journey: {
    heading: 'Four kilometres off the Ring Road',
    body: 'Turn off Route 1 between Höfn and Jökulsárlón and follow the road up to the farm. From here the glacier lagoons are to the west and Höfn is to the east, each an easy drive for a morning or an afternoon.',
    mapAria: 'Map of the coast around Nýpugarðar, with the driving routes from the farm to Höfn, Þórbergssetur, Jökulsárlón, Diamond Beach, Fjallsárlón and Stokksnes.',
    drivesHeading: 'Drives from the farm',
    ocean: 'North Atlantic',
    min: 'min',
    driveNote: 'Driving times and distances by road from the farm, from OpenStreetMap routing, minutes rounded to five. They assume good conditions; allow more time in winter.',
    places: {
      hofn: { name: 'Höfn', note: 'The nearest town, with the swimming pool and plenty more to do' },
      thorbergssetur: { name: 'Þórbergssetur', note: 'Museum about the writer Þórbergur Þórðarson, at Hali in Suðursveit' },
      jokulsarlon: { name: 'Jökulsárlón', note: 'The glacier lagoon, with icebergs from Breiðamerkurjökull' },
      diamondBeach: { name: 'Diamond Beach', note: 'The black sand beach where the ice washes up, across the road from the lagoon' },
      fjallsarlon: { name: 'Fjallsárlón', note: 'A smaller glacier lagoon under Fjallsjökull' },
      stokksnes: { name: 'Stokksnes and Vestrahorn', note: 'The black sand spit under Vestrahorn, east of Höfn' },
    },
  },

  rooms: {
    eyebrow: 'Your room',
    heading: 'Eleven rooms and two cottages',
    body: 'Plain, comfortable and quiet, with the view from the pillow. Two of the rooms share a bathroom, and the two cottages stand beside the house, one for three guests and one for four.',
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
    cottagesBody: 'Two timber cottages beside the house, each with its own bathroom. One sleeps three and one sleeps four, with the fields right outside the door.',
    cottage1Alt: 'The family cottage at Nýpugarðar, red roof and a timber porch, standing on the grass',
    cottage1Caption: 'The family cottage, sleeps four',
    cottage2Alt: 'The cottage for three at Nýpugarðar, seen across the field behind it',
    cottage2Caption: 'The cottage for three',
    beforeYouCome: 'Before you arrive',
    arrive: 'Arrive',
    leave: 'Leave',
    until: 'until 23:30',
    from: 'from 07:30',
  },

  dinner: {
    heading: 'Dinner from the menu',
    intro:
      'In the evening you order from the menu and eat in the dining room, with the windows facing the glacier. There is nothing to book ahead. Just tell us when you arrive that you would like dinner.',
    body: 'After dinner the farm goes quiet, and the only sounds outside are the sounds of nature.',
    diningAlt:
      'The dining room at Nýpugarðar, tables set in front of full-height windows facing the glacier',
    diningCaption: 'The dining room',
    winterAlt:
      'The guesthouse at Nýpugarðar under deep snow, its deck and big windows facing white mountains',
    winterCaption: 'The same windows in winter',
    breakfastHeading: 'Breakfast in the same room',
    breakfastBody:
      'A buffet with the same view. Guests rate it highly, and the kitchen can cover most ways of eating.',
    breakfastAlt:
      'The breakfast buffet laid out at Nýpugarðar: bread, cold cuts, jams and a coffee pot',
    breakfastCaption: 'The breakfast table',
    served: 'Served',
    weCanCover: 'We can cover',
    toGoLead: 'Driving to the glacier lagoon before breakfast?',
    toGoTail: 'Say so the night before and it will be waiting.',
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
    body: 'A room with the horizon in the window, a seat at the table for dinner, and a night with nothing to hear but nature.',
    duskAlt:
      'The sun setting over open grassland at Nýpugarðar, mountains dark on the horizon',
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
        a: 'Jökulsárlón is about 50 km away, a little under an hour along Route 1. Höfn is 20 km away, and the farm sits 4 km off the Ring Road.',
      },
      {
        q: 'Can I have dinner at the farm?',
        a: 'Yes, there is a dinner menu in the evening, served in the dining room facing the glacier. There is nothing to book ahead, just tell us when you arrive.',
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
    driveToHofn: 'to Höfn',
    toGlacierLagoon: 'to Jökulsárlón glacier lagoon',
  },

  scoreCats: {
    Staff: 'Staff',
    Facilities: 'Facilities',
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
    kicker: 'Kyrrlátt gistihús milli Hafnar og Jökulsárlóns',
    alt: 'Lágstæð sól yfir flatlendinu við Nýpugarða, skriðjöklar og snævi þaktir tindar við sjóndeildarhringinn',
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

  manifesto: {
    kicker: 'Aðeins náttúruhljóðin',
    text: 'Nýpugarðar standa á lágum hól upp af Mýrum, stutt frá hringveginum. Ellefu herbergi og tvö sumarhús, jöklar í glugganum og á kvöldin heyrist ekkert nema náttúran.',
  },

  facts: {
    rooms: 'herbergi, þar af tvö með sameiginlegu baði',
    cottages: 'sumarhús við hlið hússins, fyrir þrjá og fyrir fjóra',
    checkin: 'innritun, til 23:30',
  },

  band: {
    heading: 'Jöklarnir í glugganum',
    body: 'Húsið horfir yfir Mýrarnar að fjöllunum og skriðjöklum Vatnajökuls. Á björtum degi sjást þeir úr matsalnum, og frá september fram í apríl er hér gott að fylgjast með norðurljósunum.',
    alt: 'Snævi þaktir tindar yfir Mýrunum, grasið ryðrautt í lágri sól undir bláum himni',
    auroraN: 'Sept. til apríl',
    aurora: 'norðurljósatíminn',
    roadN: '4 km',
    road: 'frá hringveginum',
    viewN: 'Bjartir dagar',
    view: 'jöklarnir sjást úr matsalnum',
  },

  journey: {
    heading: 'Fjórir kílómetrar frá hringveginum',
    body: 'Beygt er af þjóðvegi 1 milli Hafnar og Jökulsárlóns og ekið upp að bænum. Héðan eru jökullónin í vestri og Höfn í austri, og stuttur akstur hvert sem er, fyrir morgun eða eftirmiðdag.',
    mapAria: 'Kort af ströndinni kringum Nýpugarða, með akstursleiðum frá bænum til Hafnar, Þórbergsseturs, Jökulsárlóns, Breiðamerkurfjöru, Fjallsárlóns og Stokksness.',
    drivesHeading: 'Akstur frá bænum',
    ocean: 'Atlantshaf',
    min: 'mín',
    driveNote: 'Aksturstímar og vegalengdir eftir vegum frá bænum, samkvæmt leiðarvali OpenStreetMap, mínútur námundaðar að fimm. Miðað er við góðar aðstæður; gefðu þér meiri tíma á veturna.',
    places: {
      hofn: { name: 'Höfn', note: 'Næsti bær, með sundlaug og ýmsa afþreyingu' },
      thorbergssetur: { name: 'Þórbergssetur', note: 'Safn um Þórberg Þórðarson rithöfund, á Hala í Suðursveit' },
      jokulsarlon: { name: 'Jökulsárlón', note: 'Jökullónið, með ísjökum úr Breiðamerkurjökli' },
      diamondBeach: { name: 'Breiðamerkurfjara', note: 'Svarta fjaran þar sem ísinn rekur á land, handan vegarins við lónið' },
      fjallsarlon: { name: 'Fjallsárlón', note: 'Minna jökullón undir Fjallsjökli' },
      stokksnes: { name: 'Stokksnes og Vestrahorn', note: 'Svarti sandurinn undir Vestrahorni, austan við Höfn' },
    },
  },

  rooms: {
    eyebrow: 'Herbergið þitt',
    heading: 'Ellefu herbergi og tvö sumarhús',
    body: 'Einföld, notaleg og kyrrlát herbergi með útsýnið beint úr rúminu. Tvö herbergjanna deila baðherbergi, og sumarhúsin tvö standa við hlið hússins, annað fyrir þrjá gesti og hitt fyrir fjóra.',
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
    cottagesBody: 'Tvö timburhús við hlið hússins, hvort með sínu baðherbergi. Annað er fyrir þrjá og hitt fyrir fjóra, og túnin eru beint fyrir utan dyrnar.',
    cottage1Alt: 'Fjölskyldusumarhúsið á Nýpugörðum, rautt þak og timburverönd, stendur á grasinu',
    cottage1Caption: 'Fjölskyldusumarhúsið, fyrir fjóra',
    cottage2Alt: 'Sumarhúsið fyrir þrjá á Nýpugörðum, séð yfir túnið fyrir aftan það',
    cottage2Caption: 'Sumarhúsið fyrir þrjá',
    beforeYouCome: 'Áður en þú kemur',
    arrive: 'Koma',
    leave: 'Brottför',
    until: 'til 23:30',
    from: 'frá 07:30',
  },

  dinner: {
    heading: 'Kvöldmatur af matseðli',
    intro:
      'Á kvöldin er pantað af matseðli og borðað í matsalnum, þar sem gluggarnir snúa að jöklinum. Það þarf ekkert að bóka fyrirfram, láttu okkur bara vita þegar þú kemur að þú viljir kvöldmat.',
    body: 'Eftir matinn verður allt kyrrlátt á bænum og úti heyrist ekkert nema náttúran.',
    diningAlt:
      'Matsalurinn á Nýpugörðum, borð lögð fyrir framan gólfsíða glugga sem snúa að jöklinum',
    diningCaption: 'Matsalurinn',
    winterAlt:
      'Gistihúsið á Nýpugörðum í djúpum snjó, veröndin og stórir gluggar sem snúa að hvítum fjöllum',
    winterCaption: 'Sömu gluggar að vetri',
    breakfastHeading: 'Morgunmatur í sama sal',
    breakfastBody:
      'Hlaðborð með sama útsýni. Gestir gefa því háa einkunn og eldhúsið ræður við flestar tegundir mataræðis.',
    breakfastAlt:
      'Morgunverðarhlaðborðið á Nýpugörðum: brauð, álegg, sultur og kaffikanna',
    breakfastCaption: 'Morgunverðarborðið',
    served: 'Borið fram',
    weCanCover: 'Við ráðum við',
    toGoLead: 'Ætlarðu að keyra að Jökulsárlóni fyrir morgunmat?',
    toGoTail: 'Láttu vita kvöldið áður og þá bíður hann þín.',
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
    body: 'Herbergi með sjóndeildarhringinn í glugganum, sæti við borðið í kvöldmat og nótt þar sem ekkert heyrist nema náttúran.',
    duskAlt:
      'Sólin sest yfir opnum túnum á Nýpugörðum, fjöllin dökk við sjóndeildarhringinn',
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
        a: 'Jökulsárlón er í um 50 km fjarlægð, tæpan klukkutíma eftir þjóðvegi 1. Til Hafnar eru 20 km og bærinn stendur 4 km frá hringveginum.',
      },
      {
        q: 'Er hægt að fá kvöldmat á bænum?',
        a: 'Já, á kvöldin er matseðill og maturinn er borinn fram í matsalnum sem snýr að jöklinum. Það þarf ekkert að panta fyrirfram, láttu bara vita þegar þú kemur.',
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
    driveToHofn: 'til Hafnar',
    toGlacierLagoon: 'að Jökulsárlóni',
  },

  scoreCats: {
    Staff: 'Starfsfólk',
    Facilities: 'Aðstaða',
    'Free WiFi': 'Frítt net',
    Cleanliness: 'Hreinlæti',
    Comfort: 'Þægindi',
    Location: 'Staðsetning',
    'Value for money': 'Verð og gæði',
  },
}

export const COPY = { en, is } as const
export type Copy = typeof en
