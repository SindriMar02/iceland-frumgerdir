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
 * language. Ranges like 16:00–22:00 are typography, not prose, and are fine.
 */

export type Lang = 'is' | 'en'

const en = {
  langName: 'EN',
  otherLangName: 'Íslenska',
  langLabel: 'Language',
  switchTo: 'Skipta yfir á íslensku',

  nav: {
    farm: 'The farm',
    rooms: 'Rooms',
    dinner: 'Dinner',
    gallery: 'Photos',
    reviews: 'Guests',
    info: 'Find us',
    winter: 'Winter',
    menu: 'Site menu',
  },

  cta: {
    check: 'Check availability',
    bookEvening: 'Dinner at Nýpugarðar',
    callFarm: 'Call us at the farm',
    bookRoom: 'Book',
    liveFromGodo: 'Live availability and prices from our booking system',
  },

  hero: {
    /** Visually the kicker at the head of the frame; in the markup it is the
     *  second half of the h1, after the wordmark, in the words a traveller
     *  types into a search box. */
    kicker: 'A farm stay between Höfn and Jökulsárlón, with glaciers on the horizon',
    alt: 'Low sun across the Mýrar lowlands below Nýpugarðar, with outlet glaciers and snow-covered peaks on the horizon',
  },

  booking: {
    arriving: 'Arriving',
    leaving: 'Leaving',
    adults: 'Adults',
    children: 'Children',
    night: 'night',
    nights: 'nights',
    ageNote: 'Guests aged 7 and over are charged as adults.',
    pricesNext: 'You will see the price for your dates in the next step, in our booking system.',
    placeholder: 'Godo booking connects here',
    datesAria: 'Choose your arrival and departure dates',
    openCalendar: 'Open the calendar',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    strikeNote: 'Crossed-out nights were fully booked when we last checked.',
    mayBeFull: 'Those nights looked fully booked when we last checked. Our booking system has the latest availability.',
    checkIn: 'Check in',
    checkOut: 'Check out',
    pickDate: 'Choose a date',
    afterCheckIn: 'After check-in',
    clearDates: 'Clear dates',
    chooseCheckout: 'Choose your check-out',
    bookedWord: 'fully booked',
    takenDay: '{date} is fully booked. Please choose another arrival date.',
    crossesBooked: 'Those dates include a fully booked night. Please choose a stay before or after it.',
    calendarKey: 'Crossed-out nights were fully booked when we last checked. Our booking system always has the latest availability.',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekdayInitials: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },

  manifesto: {
    kicker: 'Quiet evenings on the farm',
    text: 'Nýpugarðar is just four kilometres from the Ring Road, set on a low hill above Mýrar with open views towards the mountains and the outlet glaciers of Vatnajökull. With eleven rooms, two cottages and the countryside all around, evenings here feel calm, spacious and far removed from the road.',
  },

  facts: {
    rooms: 'rooms, two with a shared bathroom',
    cottages: 'cottages beside the guesthouse, sleeping three and four',
    checkin: 'check in, until 22:00',
  },

  band: {
    heading: 'Glaciers beyond the windows',
    body: 'One of the first things you notice at Nýpugarðar is how much of the landscape comes inside with you. From the dining room, the view opens across Mýrar towards the mountains and the outlet glaciers of Vatnajökull, changing with the light throughout the day.\n\nIn clear weather, the glaciers sit bright on the horizon while you eat. From September to April, the same windows look out onto dark evening skies, with a chance of seeing the northern lights above the farm.',
    alt: 'Snow-covered peaks beyond the Mýrar lowlands, with the grass lit by a low sun',
    auroraN: 'Sept to April',
    aurora: 'northern lights season',
    roadN: '4 km',
    road: 'off Route 1, the Ring Road',
    viewN: 'Clear days',
    view: 'glacier views from the dining room',
  },

  journey: {
    heading: 'Just four kilometres off the Ring Road',
    body: 'We are reached by a short turn off Route 1 between Höfn and Jökulsárlón. From the farm, Höfn lies to the east and the glacier lagoons to the west, so you can spend the day exploring either direction and come back to the quiet of Nýpugarðar in the evening.',
    mapAria: 'Map of the coast around Nýpugarðar, with the driving routes from the farm to Höfn, Þórbergssetur, Jökulsárlón, Diamond Beach, Fjallsárlón and Stokksnes.',
    drivesHeading: 'From Nýpugarðar',
    ocean: 'North Atlantic',
    min: 'min',
    driveNote: 'Driving times and distances are calculated by road from the farm using OpenStreetMap, with times rounded to five minutes. They assume good conditions, so allow extra time in winter.',
    places: {
      hofn: { name: 'Höfn', note: 'The nearest town, with the swimming pool, restaurants and services' },
      thorbergssetur: { name: 'Þórbergssetur', note: 'A museum dedicated to the writer Þórbergur Þórðarson at Hali in Suðursveit' },
      jokulsarlon: { name: 'Jökulsárlón', note: 'The glacier lagoon, where icebergs break from Breiðamerkurjökull' },
      diamondBeach: { name: 'Diamond Beach', note: 'The black beach where ice from the lagoon washes ashore, just across Route 1' },
      fjallsarlon: { name: 'Fjallsárlón', note: 'A smaller glacier lagoon beneath Fjallsjökull' },
      stokksnes: { name: 'Stokksnes and Vestrahorn', note: 'Black sand, open coast and Vestrahorn rising above the headland east of Höfn' },
    },
  },

  rooms: {
    eyebrow: 'Your stay',
    heading: 'Eleven rooms and two cottages',
    body: 'Warm, comfortable and quiet, with the landscape just beyond the window. Two rooms share a bathroom. Our two timber cottages stand beside the guesthouse, one for three guests and one for four, each with its own bathroom and the fields right outside.',
    seeAll: 'See all rooms, cottages and photos',
    seeAllNote: 'See all seven room types, the two cottages among them, with photographs, details and prices for each one.',
    /** The horizontal strip of room types under the counts. */
    stripLabel: 'Room types',
    prevRooms: 'Previous room types',
    nextRooms: 'Next room types',
    stripHint: 'Left and right arrow keys move between room types.',
    openRoom: 'See photos and details',
    /** Short forms for the room index chips; the bands carry the full Godo names. */
    short: {
      twinSharedEconomy: 'Twin, shared bathroom',
      doubleTwinShared: 'Double or twin, shared bathroom',
      double: 'Double',
      doubleTwinPrivate: 'Double or twin, private bathroom',
      doublePrivateExtraBed: 'Double with extra bed',
      cottage3: 'Cottage for 3',
      familyCottage: 'Family cottage',
    },
    cottagesHeading: 'Two cottages beside the guesthouse',
    cottagesBody: 'Our two timber cottages stand beside the guesthouse, each with its own bathroom. One sleeps three and the other four, with the fields and open countryside right outside the door.',
    cottage1Alt: 'The family cottage at Nýpugarðar, red roof and a timber porch, standing on the grass',
    cottage1Caption: 'The family cottage, sleeps four',
    cottage2Alt: 'The cottage for three at Nýpugarðar, seen across the field behind it',
    cottage2Caption: 'The cottage for three',
    beforeYouCome: 'Good to know before you arrive',
    arrive: 'Arrive',
    leave: 'Leave',
    until: 'until 22:00',
    from: 'from 07:30',
    lateArrival: 'Arriving later than 22:00? A note on the table in the lobby says which room is yours.',
  },

  dinner: {
    heading: 'Dinner with a view',
    intro:
      'In the evening, dinner is served in the dining room with the glacier views still in front of you. Choose from the menu, settle in at the table and enjoy the kind of meal that feels especially good after a day on the road.\n\nThere is no need to book dinner in advance. Just let us know when you arrive that you would like to join us.',
    body: 'Afterwards, the pace slows naturally. The farm grows quiet, the light fades across the landscape and the rest of the evening is yours.',
    diningAlt:
      'The dining room at Nýpugarðar, with tables set beside full-height windows facing the glacier',
    diningCaption: 'The dining room',
    winterLink: 'What winter is like here',
    winterAlt:
      'The guesthouse at Nýpugarðar in deep winter snow, with the deck and large windows facing the mountains',
    winterCaption: 'The house in winter',
    breakfastHeading: 'Breakfast with the same view',
    breakfastBody:
      'Breakfast is served as a buffet in the same dining room. Guests rate it highly, and we can accommodate vegetarian, vegan and gluten-free diets.',
    breakfastAlt:
      'The breakfast buffet at Nýpugarðar, with bread, cold cuts, jams and coffee set out for guests',
    breakfastCaption: 'The breakfast table',
    served: 'Served',
    weCanCover: 'We can cover',
    toGoLead: 'Leaving for Jökulsárlón before breakfast?',
    toGoTail: 'Tell us the night before and we can prepare breakfast to go.',
  },

  reviews: {
    eyebrow: 'What guests say',
    srHeading: 'Guest reviews',
    outOf: '/ 10',
    scoreWord: 'Fabulous',
    reviewsOn: 'guest reviews on Booking.com',
    via: 'Guest reviews via',
    sourceNote: ', collected 25 August 2026. Every written review is included here, and what guests felt could be better is left on Booking.com. The remaining stays left a score without a written comment.',
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
    eyebrow: 'Getting here',
    callFarm: 'Call us at the farm',
    writeToUs: 'Write to us',
    address: 'The address',
    onTheProperty: 'On the property',
    bookDirect:
      'Book here and your reservation comes straight to us at the farm, with live prices and availability in our booking system. Nýpugarðar is also listed on Booking.com, HeyIceland and Guide to Iceland if you prefer to book there. If you need anything else, calling us is usually the quickest way to reach us.',
    mobile: 'Mobile',
  },

  closing: {
    heading: 'Stay a little longer',
    body: 'Some places are just stops along the way. Nýpugarðar is one you remember.',
    duskAlt:
      'The sun setting over the open fields at Nýpugarðar, with the mountains dark on the horizon',
  },

  footer: {
    tagline: 'A quiet, family-run guesthouse on Mýrar, between Höfn and Jökulsárlón.',
    visit: 'Visit',
    directions: 'Directions',
    contact: 'Contact',
    pages: 'On this site',
    book: 'Book a stay',
    legal: 'Nýpugarðar ehf. · Company ID 510805-0380',
    designedBy: 'Designed by',
    credit: 'Designed by SNDR Studio',
  },

  privacy: {
    title: 'Privacy',
    lead: 'How Nýpugarðar handles your personal information when you visit this website, book a stay or get in touch with us.',
    updated: 'Last updated 16 September 2026',
    sections: [
      {
        h: 'Who we are',
        p: 'Nýpugarðar ehf. (company ID 510805-0380), Nýpugarðar, 781 Höfn í Hornafirði, Iceland, is responsible for the personal information described here. You can reach us at nypu@simnet.is or on +354 893 1826.',
      },
      {
        h: 'This website',
        p: 'This website sets no cookies and stores nothing in your browser, and it uses no advertising or tracking tools. We count visits with Cloudflare Web Analytics, which works without cookies and does not identify you, so all we see are totals, such as how many people visited and which pages they read. The site is hosted by Cloudflare, which handles technical data such as your IP address to deliver the pages to you securely.',
      },
      {
        h: 'Booking a stay',
        p: 'When you book directly, you do it in our booking system, Godo. The details you enter there, such as your name, email, phone number and the dates of your stay, come to us so we can welcome you, and Godo stores them for us. This website never receives them itself. If you book through Booking.com or another agency, that company also holds your booking, under its own privacy policy.',
      },
      {
        h: 'Email and phone',
        p: 'If you write to us or call, we use what you tell us to answer you and to arrange your stay.',
      },
      {
        h: 'Why we use it',
        p: 'We use your information to carry out your booking, which is an agreement between you and us, and to meet our legal duties, such as keeping accounts. We do not sell your information.',
      },
      {
        h: 'How long we keep it',
        p: 'We keep booking details for as long as we need them for your stay and for our accounts. Icelandic bookkeeping law requires accounting records to be kept for seven years.',
      },
      {
        h: 'Your rights',
        p: 'You can ask to see the information we hold about you, to have it corrected, or, where the law allows, to have it deleted, and you can object to how we use it. Write to us at nypu@simnet.is. If you are not satisfied with our answer, you can complain to Persónuvernd, the Icelandic Data Protection Authority, at personuvernd.is.',
      },
    ],
  },

  price: {
    from: 'from',
    perNight: 'per night',
    roomTypes: 'Room types and prices',
    sleeps: 'Sleeps',
    pricesNote: 'The lowest nightly rate available in the next twelve months. The exact price for your dates appears when you check availability.',
    checkedOn: 'Prices checked',
  },

  /* The six questions guests actually ask before booking. These are RENDERED
   * on the rooms page and mirrored into FAQPage structured data by
   * tools/nypugardar-seo.mjs, which fails the build if the two drift apart.
   * That order matters: schema answering something the page does not say is
   * the fastest way to a manual penalty, so the page is the source and the
   * schema follows it. Every answer opens with the fact, not with a greeting. */
  faq: {
    heading: 'Questions before you stay',
    items: [
      {
        q: 'How far is Jökulsárlón from the farm?',
        a: 'Jökulsárlón is about 50 km from the farm, a little under an hour along Route 1. Höfn is 20 km away, and Nýpugarðar is 4 km off the Ring Road.',
      },
      {
        q: 'Can I have dinner at the farm?',
        a: 'Yes. In the evening we serve dinner from the menu in the dining room facing the glacier. You do not need to book ahead. Just let us know when you arrive that you would like dinner.',
      },
      {
        q: 'What do you serve for breakfast?',
        a: 'We serve a buffet in the dining room, with the same glacier view. Vegetarian, vegan and gluten-free options are available. If you are leaving for Jökulsárlón before breakfast starts, we can prepare breakfast to go.',
      },
      {
        q: 'What time can I check in and out?',
        a: 'Check in is from 16:00 to 22:00, and check out is from 07:30 to 11:00. If you arrive later than that, a note on the table in the lobby tells you which room is yours.',
      },
      {
        q: 'Can I bring a pet, and are children welcome?',
        a: 'Pets are not allowed and the guesthouse is non-smoking. Children are welcome, and guests aged 7 and over are charged as adults.',
      },
      {
        q: 'Can I book directly with the farm?',
        a: 'Yes. A direct booking comes straight to us at the farm, and our booking system shows live prices and availability. Nýpugarðar is also listed on Booking.com, HeyIceland and Guide to Iceland.',
      },
    ],
  },

  /* WINTER — /winter, its own page.
   * Written for the traveller booking November to March, who asks a
   * different set of questions than the summer guest: how dark is it, what
   * are the roads doing, can we still reach Jökulsárlón, what happens if we
   * arrive after dark. Every answer is the farm's own fact or a public
   * Icelandic source (Vegagerðin, Veðurstofan, safetravel.is). Daylight
   * times are computed for the farm's own coordinates (64.2616, -15.4390),
   * NOAA solar position, and rounded to the minute. Nothing here claims the
   * farm is open on a specific date: the booking calendar answers that. */
  winter: {
    eyebrow: 'Winter',
    heading: 'Winter on Mýrar',
    intro:
      'Winter is the quiet half of the year here. The light is short and low, the glaciers sit white behind the farm, and on a clear night you can walk out of the door and stand under the aurora with no streetlight anywhere near you. These are the things guests ask us between November and March, answered from the farm.',
    daylight: {
      heading: 'How much daylight you get',
      note: 'Sunrise and sunset at the farm, to the nearest minute, from the sun\u2019s position at our own coordinates. A minute either way from one year to the next.',
      cols: { date: 'Date', rise: 'Sunrise', set: 'Sunset', length: 'Daylight' },
      rows: [
        { date: '1 November', rise: '08:46', set: '16:45', length: '8 h' },
        { date: '1 December', rise: '10:22', set: '15:20', length: '5 h' },
        { date: '21 December', rise: '10:58', set: '15:01', length: '4 h' },
        { date: '15 January', rise: '10:31', set: '15:51', length: '5 h 20' },
        { date: '1 February', rise: '09:43', set: '16:47', length: '7 h' },
        { date: '1 March', rise: '08:10', set: '18:18', length: '10 h' },
      ],
    },
    items: [
      {
        q: 'Are you open in the winter?',
        a: 'Yes, we take guests through the winter, with breakfast in the morning and dinner from the menu in the evening. The booking calendar on this site shows exactly which nights and which rooms are free, so what you see there is what we have.',
      },
      {
        q: 'Can we see the northern lights from the farm?',
        a: 'Often, from September to April, when the sky is clear. There is no village and no streetlight on Mýrar, so you do not have to drive anywhere: step outside the door, let your eyes adjust and look north. The Icelandic Met Office publishes an aurora forecast at vedur.is.',
      },
      {
        q: 'How dark is it, really?',
        a: 'Around the shortest day the sun is up for about four hours, from just before eleven until three in the afternoon, and it never climbs high. That also means long blue light before and after, which is the best light the glaciers get all year. The table above has the times month by month.',
      },
      {
        q: 'What are the roads like?',
        a: 'Route 1, the Ring Road, runs past the farm and is cleared through the winter, but it can close in a storm and it does so with little warning. Vegagerðin publishes live road conditions at road.is, and safetravel.is carries the weather and travel alerts. The farm sits 4 km off Route 1 on a road that is kept passable.',
      },
      {
        q: 'We will not arrive until after dark. Is that a problem?',
        a: 'Not at all, it is normal here in winter. Check in is until 22:00. If you arrive later than that, a note on the table in the lobby tells you which room is yours, so you can let yourself in and settle.',
      },
      {
        q: 'Can we still get to Jökulsárlón in winter?',
        a: 'Yes. It is about 50 km along Route 1, roughly 50 minutes when the road is clear, longer on snow. Drive it in daylight if you can, and check road.is before you set off. Ice cave and glacier tours run through the winter from the Jökulsárlón area and usually leave early in the morning.',
      },
      {
        q: 'Can we get breakfast before an early tour?',
        a: 'Yes. If you are leaving before breakfast is served, tell us the evening before and we will put together breakfast to go.',
      },
      {
        q: 'What should we bring?',
        a: 'Warm layers, a waterproof outer layer and shoes with real grip, plus a pair of ice grips if you have them, since the yard can freeze. A head torch is useful in the dark. If you are driving your own car, winter tyres are required in the cold months and studded tyres are allowed from 1 November to mid-April.',
      },
    ],
    linksHeading: 'Worth a look before you drive',
    links: [
      { href: 'https://www.road.is/', label: 'road.is', note: 'Live road conditions from Vegagerðin' },
      { href: 'https://safetravel.is/', label: 'safetravel.is', note: 'Weather and travel alerts' },
      { href: 'https://en.vedur.is/weather/forecasts/aurora/', label: 'vedur.is', note: 'The Met Office aurora forecast' },
    ],
    ctaHeading: 'A winter night at the farm',
    ctaBody: 'Rooms, cottages and live prices are on the rooms page, and the booking calendar shows what is free.',
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
    eyebrow: 'Life at Nýpugarðar',
    heading: 'The farm, the view and the table',
    body: 'These are our own photographs of the farm, the landscape and the dining room. The rooms and cottages have their own gallery above.',
    byRoom: 'Every room type, with its own photographs',
    andTheRest: 'Around the farm',
    groups: {
      table: 'The dining room',
      house: 'The house and the deck',
      land: 'The landscape',
    },
    alt: {
      land: 'The landscape around Nýpugarðar',
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
  langLabel: 'Tungumál',
  switchTo: 'Switch to English',

  nav: {
    farm: 'Bærinn',
    rooms: 'Gisting',
    dinner: 'Matur',
    gallery: 'Myndir',
    reviews: 'Umsagnir',
    info: 'Að rata',
    winter: 'Veturinn',
    menu: 'Valmynd',
  },

  cta: {
    check: 'Kanna laus herbergi',
    bookEvening: 'Kvöldmatur á Nýpugörðum',
    callFarm: 'Hringdu í okkur á bænum',
    bookRoom: 'Bóka',
    liveFromGodo: 'Laus herbergi og verð beint úr bókunarkerfinu okkar',
  },

  hero: {
    kicker: 'Sveitagisting milli Hafnar og Jökulsárlóns, með jöklana við sjóndeildarhringinn',
    alt: 'Lág sól yfir Mýrunum neðan við Nýpugarða, með skriðjökla og snævi þakta tinda við sjóndeildarhringinn',
  },

  booking: {
    arriving: 'Koma',
    leaving: 'Brottför',
    adults: 'Fullorðnir',
    children: 'Börn',
    night: 'nótt',
    nights: 'nætur',
    ageNote: 'Gestir 7 ára og eldri greiða sem fullorðnir.',
    pricesNext: 'Verðið fyrir þínar dagsetningar birtist í næsta skrefi í bókunarkerfinu okkar.',
    placeholder: 'Godo bókun tengist hér',
    datesAria: 'Veldu komu- og brottfarardag',
    openCalendar: 'Opna dagatalið',
    prevMonth: 'Fyrri mánuður',
    nextMonth: 'Næsti mánuður',
    strikeNote: 'Yfirstrikaðar nætur voru fullbókaðar þegar við athuguðum síðast.',
    mayBeFull: 'Þessar nætur virtust fullbókaðar þegar við athuguðum síðast. Nýjasta staðan er alltaf í bókunarkerfinu okkar.',
    checkIn: 'Innritun',
    checkOut: 'Útritun',
    pickDate: 'Veldu dag',
    afterCheckIn: 'Eftir innritun',
    clearDates: 'Hreinsa dagsetningar',
    chooseCheckout: 'Veldu útritunardag',
    bookedWord: 'fullbókað',
    takenDay: '{date} er fullbókað. Veldu annan komudag.',
    crossesBooked: 'Þessar dagsetningar ná yfir fullbókaða nótt. Veldu dvöl fyrir eða eftir hana.',
    calendarKey: 'Yfirstrikaðar nætur voru fullbókaðar þegar við athuguðum síðast. Nýjasta staðan er alltaf í bókunarkerfinu okkar.',
    months: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
    weekdaysShort: ['mán', 'þri', 'mið', 'fim', 'fös', 'lau', 'sun'],
    weekdayInitials: ['M', 'Þ', 'M', 'F', 'F', 'L', 'S'],
  },

  manifesto: {
    kicker: 'Kyrrlát kvöld á bænum',
    text: 'Nýpugarðar eru aðeins fjóra kílómetra frá hringveginum, á lágum hól upp af Mýrum, þaðan sem opið útsýni er til fjallanna og skriðjökla Vatnajökuls. Hér eru ellefu herbergi og tvö sumarhús, sveitin allt um kring og kvöldin kyrrlát og friðsæl, fjarri umferðinni.',
  },

  facts: {
    rooms: 'herbergi, þar af tvö með sameiginlegu baði',
    cottages: 'sumarhús við gistihúsið, fyrir þrjá og fjóra',
    checkin: 'innritun, til 22:00',
  },

  band: {
    heading: 'Jöklarnir handan við gluggana',
    body: 'Eitt af því fyrsta sem gestir taka eftir á Nýpugörðum er hvernig landslagið fylgir þeim inn. Úr matsalnum opnast útsýnið yfir Mýrarnar að fjöllunum og skriðjöklum Vatnajökuls og tekur breytingum með birtunni yfir daginn.\n\nÍ björtu veðri skína jöklarnir við sjóndeildarhringinn á meðan þú borðar. Frá september fram í apríl dimmir fyrir utan sömu glugga á kvöldin og með smá heppni sjást norðurljósin yfir bænum.',
    alt: 'Snævi þaktir tindar handan Mýranna, með grasið upplýst af lágri sól',
    auroraN: 'September til apríl',
    aurora: 'norðurljósatíminn',
    roadN: '4 km',
    road: 'frá hringveginum',
    viewN: 'Bjartir dagar',
    view: 'jöklasýn úr matsalnum',
  },

  journey: {
    heading: 'Aðeins fjóra kílómetra frá hringveginum',
    body: 'Beygt er af þjóðvegi 1 milli Hafnar og Jökulsárlóns og þaðan er stutt heim að bæ. Höfn er í austri og jökullónin í vestri, svo auðvelt er að verja deginum í hvora áttina sem er og koma svo aftur heim í kyrrðina á Nýpugörðum um kvöldið.',
    mapAria: 'Kort af ströndinni kringum Nýpugarða, með akstursleiðum frá bænum til Hafnar, Þórbergsseturs, Jökulsárlóns, Breiðamerkurfjöru, Fjallsárlóns og Stokksness.',
    drivesHeading: 'Frá Nýpugörðum',
    ocean: 'Atlantshaf',
    min: 'mín',
    driveNote: 'Aksturstími og vegalengd miðast við akstur frá bænum og eru reiknuð með OpenStreetMap. Tímar eru námundaðir að fimm mínútum og miðast við góðar aðstæður, svo gefðu þér meiri tíma á veturna.',
    places: {
      hofn: { name: 'Höfn', note: 'Næsti bær, með sundlaug, veitingastöðum og þjónustu' },
      thorbergssetur: { name: 'Þórbergssetur', note: 'Safn helgað Þórbergi Þórðarsyni rithöfundi, á Hala í Suðursveit' },
      jokulsarlon: { name: 'Jökulsárlón', note: 'Jökullónið þar sem ísjakar brotna úr Breiðamerkurjökli' },
      diamondBeach: { name: 'Breiðamerkurfjara', note: 'Svarta fjaran þar sem ís úr lóninu rekur á land, rétt hinum megin við þjóðveg 1' },
      fjallsarlon: { name: 'Fjallsárlón', note: 'Minna jökullón undir Fjallsjökli' },
      stokksnes: { name: 'Stokksnes og Vestrahorn', note: 'Svartur sandur, opin strönd og Vestrahorn yfir nesinu austan Hafnar' },
    },
  },

  rooms: {
    eyebrow: 'Gistingin',
    heading: 'Ellefu herbergi og tvö sumarhús',
    body: 'Hlýleg, þægileg og kyrrlát gisting með landslagið rétt fyrir utan gluggann. Tvö herbergjanna deila baðherbergi. Timbursumarhúsin tvö standa við hlið gistihússins, annað fyrir þrjá gesti og hitt fyrir fjóra, hvort með sínu baðherbergi og túnin beint fyrir utan.',
    seeAll: 'Skoða öll herbergi, sumarhús og myndir',
    seeAllNote: 'Skoðaðu allar sjö herbergisgerðirnar, sumarhúsin tvö þar á meðal, með myndum, upplýsingum og verði fyrir hvern kost.',
    stripLabel: 'Herbergisgerðir',
    prevRooms: 'Fyrri herbergisgerðir',
    nextRooms: 'Næstu herbergisgerðir',
    stripHint: 'Örvatakkar til vinstri og hægri fletta milli herbergisgerða.',
    openRoom: 'Skoða myndir og nánar',
    short: {
      twinSharedEconomy: 'Tveggja manna, sameiginlegt bað',
      doubleTwinShared: 'Hjóna- eða tveggja manna, sameiginlegt bað',
      double: 'Hjónaherbergi',
      doubleTwinPrivate: 'Hjóna- eða tveggja manna, eigið bað',
      doublePrivateExtraBed: 'Hjónaherbergi með aukarúmi',
      cottage3: 'Sumarhús fyrir 3',
      familyCottage: 'Fjölskyldusumarhús',
    },
    cottagesHeading: 'Tvö sumarhús við gistihúsið',
    cottagesBody: 'Timbursumarhúsin tvö standa við hlið gistihússins og hvort þeirra er með eigið baðherbergi. Annað er fyrir þrjá og hitt fyrir fjóra, með túnin og opið landslagið beint fyrir utan dyrnar.',
    cottage1Alt: 'Fjölskyldusumarhúsið á Nýpugörðum, rautt þak og timburverönd, stendur á grasinu',
    cottage1Caption: 'Fjölskyldusumarhúsið, fyrir fjóra',
    cottage2Alt: 'Sumarhúsið fyrir þrjá á Nýpugörðum, séð yfir túnið fyrir aftan það',
    cottage2Caption: 'Sumarhúsið fyrir þrjá',
    beforeYouCome: 'Gott að vita fyrir komu',
    arrive: 'Koma',
    leave: 'Brottför',
    until: 'til 22:00',
    from: 'frá 07:30',
    lateArrival: 'Kemurðu seinna en klukkan 22:00? Þá liggur blað á borðinu í anddyrinu sem segir þér hvar þú gistir.',
  },

  dinner: {
    heading: 'Kvöldmatur með útsýni',
    intro:
      'Á kvöldin er borinn fram matur í matsalnum, með jöklana enn fyrir augunum. Veldu rétt af matseðlinum, komdu þér vel fyrir við borðið og njóttu máltíðar sem kemur sér sérstaklega vel eftir dag á ferðinni.\n\nÞað þarf ekki að bóka kvöldmat fyrirfram. Láttu okkur bara vita við komu að þú viljir borða hjá okkur.',
    body: 'Eftir matinn hægist á öllu. Kyrrð færist yfir bæinn, birtan dofnar yfir landinu og það sem eftir er kvöldsins er þitt.',
    diningAlt:
      'Matsalurinn á Nýpugörðum, með borðum við gólfsíða glugga sem snúa að jöklinum',
    diningCaption: 'Matsalurinn',
    winterLink: 'Hvernig veturinn er hjá okkur',
    winterAlt:
      'Gistihúsið á Nýpugörðum í djúpum vetrarsnjó, með veröndina og stóra glugga sem snúa að fjöllunum',
    winterCaption: 'Húsið að vetri',
    breakfastHeading: 'Morgunmatur með sama útsýni',
    breakfastBody:
      'Morgunverður er borinn fram sem hlaðborð í sama matsal. Gestir gefa honum háa einkunn og við getum boðið upp á grænmetis-, vegan- og glútenlaust fæði.',
    breakfastAlt:
      'Morgunverðarhlaðborðið á Nýpugörðum, með brauði, áleggi, sultum og kaffi fyrir gesti',
    breakfastCaption: 'Morgunverðarborðið',
    served: 'Borið fram',
    weCanCover: 'Við ráðum við',
    toGoLead: 'Leggurðu af stað að Jökulsárlóni áður en morgunmatur er borinn fram?',
    toGoTail: 'Láttu okkur vita kvöldið áður og við getum útbúið morgunmat með í nesti.',
  },

  reviews: {
    eyebrow: 'Það sem gestir segja',
    srHeading: 'Umsagnir gesta',
    outOf: '/ 10',
    scoreWord: 'Frábært',
    reviewsOn: 'umsagnir gesta á Booking.com',
    via: 'Umsagnir gesta af',
    sourceNote: ', sóttar 25. ágúst 2026. Hér eru allar skriflegar umsagnir, en það sem gestum fannst mega bæta er á Booking.com. Aðrar dvalir skildu eftir einkunn án skriflegrar umsagnar.',
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
    callFarm: 'Hringdu í okkur á bænum',
    writeToUs: 'Skrifaðu okkur',
    address: 'Heimilisfangið',
    onTheProperty: 'Á staðnum',
    bookDirect:
      'Bókaðu hér og bókunin kemur beint til okkar á bænum. Verð og laus herbergi sjást í rauntíma í bókunarkerfinu okkar. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland ef þú kýst frekar að bóka þar. Ef eitthvað annað vantar er yfirleitt fljótlegast að hringja í okkur.',
    mobile: 'Farsími',
  },

  closing: {
    heading: 'Staldraðu aðeins lengur við',
    body: 'Sumir staðir eru aðeins áningarstaðir á leiðinni. Nýpugarðar eru staður sem situr eftir í minningunni.',
    duskAlt:
      'Sólin sest yfir opnum túnum á Nýpugörðum, með fjöllin dökk við sjóndeildarhringinn',
  },

  footer: {
    tagline: 'Kyrrlátt, fjölskyldurekið gistiheimili á Mýrum, milli Hafnar og Jökulsárlóns.',
    visit: 'Staðsetning',
    directions: 'Leiðarlýsing',
    contact: 'Hafðu samband',
    pages: 'Á vefnum',
    book: 'Bóka gistingu',
    legal: 'Nýpugarðar ehf. · kt. 510805-0380',
    designedBy: 'Hannað af',
    credit: 'Hannað af SNDR Studio',
  },

  privacy: {
    title: 'Persónuvernd',
    lead: 'Hvernig Nýpugarðar fara með persónuupplýsingar þínar þegar þú skoðar vefinn, bókar gistingu eða hefur samband við okkur.',
    updated: 'Síðast uppfært 16. september 2026',
    sections: [
      {
        h: 'Hver við erum',
        p: 'Nýpugarðar ehf., kt. 510805-0380, Nýpugörðum, 781 Höfn í Hornafirði, ber ábyrgð á þeim persónuupplýsingum sem hér er fjallað um. Þú nærð í okkur á nypu@simnet.is eða í síma 893 1826.',
      },
      {
        h: 'Vefurinn',
        p: 'Vefurinn setur engar vafrakökur, vistar ekkert í vafranum þínum og notar engin auglýsinga- eða rakningartól. Við teljum heimsóknir með Cloudflare Web Analytics, sem virkar án vafrakakna og þekkir þig ekki, svo við sjáum aðeins heildartölur, til dæmis hve margir komu og hvaða síður voru lesnar. Vefurinn er hýstur hjá Cloudflare, sem vinnur með tæknileg gögn á borð við IP-tölu til að koma síðunum örugglega til þín.',
      },
      {
        h: 'Bókanir',
        p: 'Þegar þú bókar beint hjá okkur gerir þú það í bókunarkerfinu okkar, Godo. Upplýsingarnar sem þú slærð inn þar, svo sem nafn, netfang, símanúmer og dagsetningar dvalarinnar, berast okkur svo við getum tekið á móti þér, og Godo geymir þær fyrir okkur. Vefurinn sjálfur tekur aldrei við þeim. Ef þú bókar í gegnum Booking.com eða aðra ferðaskrifstofu geymir það fyrirtæki bókunina líka, samkvæmt eigin persónuverndarstefnu.',
      },
      {
        h: 'Tölvupóstur og sími',
        p: 'Ef þú skrifar okkur eða hringir notum við það sem þú segir okkur til að svara þér og undirbúa dvölina.',
      },
      {
        h: 'Til hvers við notum upplýsingarnar',
        p: 'Við notum upplýsingarnar til að efna bókunina, sem er samningur milli þín og okkar, og til að sinna lagaskyldum okkar, til dæmis um bókhald. Við seljum ekki upplýsingarnar þínar.',
      },
      {
        h: 'Hve lengi við geymum þær',
        p: 'Við geymum bókunarupplýsingar eins lengi og við þurfum vegna dvalarinnar og bókhaldsins. Samkvæmt lögum um bókhald þarf að geyma bókhaldsgögn í sjö ár.',
      },
      {
        h: 'Réttindi þín',
        p: 'Þú getur beðið um að sjá þær upplýsingar sem við höfum um þig, fá þær leiðréttar eða, þar sem lög leyfa, fá þeim eytt, og þú getur andmælt því hvernig við notum þær. Sendu okkur línu á nypu@simnet.is. Ef þér þykir svarið ekki fullnægjandi getur þú kvartað til Persónuverndar á personuvernd.is.',
      },
    ],
  },

  price: {
    from: 'frá',
    perNight: 'á nótt',
    roomTypes: 'Herbergisgerðir og verð',
    sleeps: 'Fyrir',
    pricesNote: 'Lægsta fáanlega verð á nótt næstu tólf mánuði. Nákvæmt verð fyrir þínar dagsetningar birtist þegar þú kannar laus herbergi.',
    checkedOn: 'Verð sótt',
  },

  faq: {
    heading: 'Spurningar fyrir dvölina',
    items: [
      {
        q: 'Hvað er langt að Jökulsárlóni?',
        a: 'Jökulsárlón er í um 50 km fjarlægð frá bænum, tæpan klukkutíma eftir þjóðvegi 1. Til Hafnar eru 20 km og Nýpugarðar eru 4 km frá hringveginum.',
      },
      {
        q: 'Er hægt að fá kvöldmat á bænum?',
        a: 'Já. Á kvöldin bjóðum við upp á mat af matseðli í matsalnum sem snýr að jöklinum. Það þarf ekki að bóka fyrirfram. Láttu okkur bara vita við komu að þú viljir kvöldmat.',
      },
      {
        q: 'Hvað er í morgunmat?',
        a: 'Við bjóðum upp á hlaðborð í matsalnum, með sömu jöklasýn. Grænmetis-, vegan- og glútenlausir kostir eru í boði. Ef þú leggur af stað að Jökulsárlóni áður en morgunmatur er borinn fram getum við útbúið morgunmat með í nesti.',
      },
      {
        q: 'Hvenær er innritun og útritun?',
        a: 'Innritun er frá 16:00 til 22:00 og útritun frá 07:30 til 11:00. Ef þú kemur seinna liggur blað á borðinu í anddyrinu sem segir þér hvar þú gistir.',
      },
      {
        q: 'Mega gæludýr koma og eru börn velkomin?',
        a: 'Gæludýr eru ekki leyfð og gistihúsið er reyklaust. Börn eru velkomin og gestir 7 ára og eldri greiða sem fullorðnir.',
      },
      {
        q: 'Get ég bókað beint hjá bænum?',
        a: 'Já. Bein bókun kemur beint til okkar á bænum og bókunarkerfið okkar sýnir verð og laus herbergi í rauntíma. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland.',
      },
    ],
  },

  /* VETURINN — /is/vetur. Sama efni og enska síðan, sömu staðreyndir. */
  winter: {
    eyebrow: 'Veturinn',
    heading: 'Veturinn á Mýrum',
    intro:
      'Veturinn er kyrrláti helmingur ársins hjá okkur. Birtan er stutt og lág, jöklarnir standa hvítir fyrir ofan bæinn og á heiðskírum kvöldum gengurðu út um dyrnar og stendur undir norðurljósunum, án þess að nokkur ljósastaur trufli. Hér eru þau atriði sem gestir spyrja okkur um frá nóvember fram í mars.',
    daylight: {
      heading: 'Hvað birtan er löng',
      note: 'Sólarupprás og sólsetur á bænum, reiknað út frá okkar eigin hnitum. Getur munað mínútu milli ára.',
      cols: { date: 'Dagsetning', rise: 'Sólarupprás', set: 'Sólsetur', length: 'Birta' },
      rows: [
        { date: '1. nóvember', rise: '08:46', set: '16:45', length: '8 klst.' },
        { date: '1. desember', rise: '10:22', set: '15:20', length: '5 klst.' },
        { date: '21. desember', rise: '10:58', set: '15:01', length: '4 klst.' },
        { date: '15. janúar', rise: '10:31', set: '15:51', length: '5 klst. 20' },
        { date: '1. febrúar', rise: '09:43', set: '16:47', length: '7 klst.' },
        { date: '1. mars', rise: '08:10', set: '18:18', length: '10 klst.' },
      ],
    },
    items: [
      {
        q: 'Er opið hjá ykkur á veturna?',
        a: 'Já, við tökum á móti gestum allan veturinn, með morgunmat og kvöldmat af matseðli. Bókunarkerfið hér á síðunni sýnir nákvæmlega hvaða nætur og hvaða herbergi eru laus, svo það sem þú sérð þar er það sem við eigum.',
      },
      {
        q: 'Sjást norðurljósin frá bænum?',
        a: 'Oft, frá september fram í apríl þegar heiðskírt er. Það er hvorki þorp né ljósastaur á Mýrum, svo þú þarft ekki að keyra neitt: farðu út, leyfðu augunum að venjast myrkrinu og horfðu í norður. Veðurstofan birtir norðurljósaspá á vedur.is.',
      },
      {
        q: 'Hvað er raunverulega dimmt?',
        a: 'Í kringum stysta daginn er sólin uppi í um fjórar klukkustundir, frá tæplega ellefu til þrjú, og fer aldrei hátt. Á móti kemur löng bláa birtan á undan og eftir, sem er fallegasta birtan sem jöklarnir fá allt árið. Taflan hér að ofan sýnir tímana mánuð fyrir mánuð.',
      },
      {
        q: 'Hvernig eru vegirnir?',
        a: 'Þjóðvegur 1 liggur framhjá bænum og er mokaður yfir veturinn, en honum er hægt að loka í illviðri og það gerist með litlum fyrirvara. Vegagerðin birtir færð í rauntíma á road.is og safetravel.is heldur utan um veður og viðvaranir. Bærinn er 4 km frá þjóðveginum, á vegi sem er haldið færum.',
      },
      {
        q: 'Við komum ekki fyrr en eftir myrkur. Er það í lagi?',
        a: 'Það er ekkert mál og raunar venjan hér á veturna. Innritun er til klukkan 22:00. Ef þú kemur seinna liggur blað á borðinu í anddyrinu sem segir þér hvar þú gistir, svo þú getur komið þér fyrir sjálf eða sjálfur.',
      },
      {
        q: 'Komumst við að Jökulsárlóni á veturna?',
        a: 'Já. Það eru um 50 km eftir þjóðvegi 1, um 50 mínútur þegar vegurinn er auður og lengur í snjó. Reyndu að fara í birtu og kíktu á road.is áður en þú leggur af stað. Íshella- og jöklaferðir eru í gangi allan veturinn frá svæðinu við Jökulsárlón og leggja yfirleitt af stað snemma morguns.',
      },
      {
        q: 'Getum við fengið morgunmat fyrir snemmbúna ferð?',
        a: 'Já. Ef þið leggið af stað áður en morgunmatur er borinn fram, látið okkur vita kvöldið áður og við útbúum morgunmat með í nesti.',
      },
      {
        q: 'Hverju eigum við að pakka?',
        a: 'Hlýjum lögum, vatnsheldri yfirhöfn og skóm með alvöru gripi, og mannbroddum ef þið eigið þá, því hlaðið getur orðið hált. Höfuðljós kemur sér vel í myrkrinu. Ef þið eruð á eigin bíl þarf vetrardekk yfir köldustu mánuðina og negld dekk eru leyfð frá 1. nóvember fram í miðjan apríl.',
      },
    ],
    linksHeading: 'Gott að skoða áður en lagt er af stað',
    links: [
      { href: 'https://www.road.is/', label: 'road.is', note: 'Færð á vegum frá Vegagerðinni' },
      { href: 'https://safetravel.is/', label: 'safetravel.is', note: 'Veður og viðvaranir' },
      { href: 'https://www.vedur.is/vedur/spar/nordurljos/', label: 'vedur.is', note: 'Norðurljósaspá Veðurstofunnar' },
    ],
    ctaHeading: 'Vetrarnótt á bænum',
    ctaBody: 'Herbergin, sumarhúsin og verðin eru á gistisíðunni og bókunarkerfið sýnir hvað er laust.',
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
    eyebrow: 'Lífið á Nýpugörðum',
    heading: 'Bærinn, útsýnið og borðið',
    body: 'Hér eru okkar eigin myndir af bænum, landslaginu og matsalnum. Herbergin og sumarhúsin eiga sitt eigið myndasafn hér að ofan.',
    byRoom: 'Hver herbergisgerð, með sínum eigin myndum',
    andTheRest: 'Umhverfis bæinn',
    groups: {
      table: 'Matsalurinn',
      house: 'Húsið og veröndin',
      land: 'Landslagið',
    },
    alt: {
      land: 'Landslagið umhverfis Nýpugarða',
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
