/**
 * Bilingual copy, Icelandic first. Both written as originals.
 * Shop voice: short, declarative, no marketing throat-clearing.
 * No em-dashes anywhere in customer copy.
 */

export type Lang = 'is' | 'en'

export const STRINGS = {
  is: {
    langLabel: 'Language: English',
    skip: 'Fara í verðskrá',
    nav: { prices: 'Verðskrá', shop: 'Stofan', corner: 'Hornið', hours: 'Opnunartími' },
    menu: { open: 'Valmynd', close: 'Loka' },

    status: {
      open: 'Opið',
      closed: 'Lokað',
      until: (t: string) => `til ${t}`,
      soon: (m: number) => `lokar eftir ${m} mín.`,
      today: (t: string) => `opnar kl. ${t}`,
      tomorrow: (t: string) => `opnar á morgun kl. ${t}`,
      day: (d: string, t: string) => `opnar á ${d} kl. ${t}`,
    },
    ticker: 'Engin tímapöntun. Þú gengur bara inn.',

    stage: {
      arch: 'Rakararnir',
      archUnder: 'Klapparstígur 40',
      drawAlt: 'Teikning af rakarastönginni sem stendur í glugganum á Klapparstíg 40.',
      scroll: 'Skrunaðu niður',
      cornerAlt: 'Teikning af húsinu á horninu á Klapparstíg 40, með rakarastönginni við dyrnar.',
      photoAlt: 'Biðstofan í horninu: rakarastöngin í glugganum, gyllta skiltið á glerinu og Klapparstígur fyrir utan.',
      plateTitle: 'Hornið er allt í gluggum.',
      plateBody: 'Rakarastöngin í glugganum, gyllta skiltið á glerinu og Klapparstígur fyrir utan. Þú gengur inn af götunni og sest í stólinn.',
    },

    band1: { l: 'Rakarastofa', r: 'Klapparstígur 40' },
    band2: { l: 'Öll velkomin', r: 'Allt árið' },

    intro: {
      a: 'Engin tímapöntun.',
      b: 'Þú gengur bara inn.',
      body: 'Í glugganum hjá okkur hangir lítið skilti sem stendur á DROP INS WELCOME, og þannig hefur stofan alltaf gengið. Enginn bókunarhlekkur, ekkert app. Þú gengur inn af Klapparstíg, sest niður og ferð út klipptur.',
    },

    prices: {
      title: 'Verðskrá',
      note: 'Verð, tímalengd og lýsingar eru sýnishorn og bíða réttra upplýsinga frá stofunni.',
      isk: 'kr.',
      mins: 'mín.',
      more: 'Sjá nánar',
    },

    shop: {
      title: 'Stofan',
      lead: 'Bjart horn, ekkert sæti eins, plöntur í hverjum glugga og rakarastöng sem snýst.',
      caps: ['Á gólfinu', 'Við stólinn', 'Í glugganum'],
      team: 'Starfsfólkið',
    },

    welcome: {
      title: 'Öll velkomin',
      body: 'Regnbogafánarnir í gluggakistunum eru þar allt árið, ekki bara í ágúst. Hver sem þú ert, þú sest í stólinn eins og allir aðrir.',
    },

    corner: {
      title: 'Hornið',
      body: 'Stofan er á jarðhæð í gömlu bárujárnshúsi neðst á Klapparstíg, örstutt frá Laugavegi. Hornið er allt í gluggum, svo það er erfitt að ganga fram hjá án þess að sjá inn.',
      caps: ['Húsið á horninu', 'Glugginn af götunni'],
      maps: 'Opna í kortum',
    },

    week: {
      title: 'Opið núna?',
      lead: 'Það þarf ekkert að panta, svo eina spurningin er hvort það sé opið. Þetta er vikan.',
      note: 'Opnunartíminn er skráður á já.is og bíður staðfestingar frá stofunni.',
      openLbl: 'Opið',
      closedLbl: 'Lokað',
      nowLbl: 'Núna',
    },

    phrases: {
      title: 'Á íslensku',
      lead: 'Þú þarft ekkert að kunna íslensku til að koma til okkar. En ef þig langar að prófa.',
    },

    reviews: { title: 'Umsagnir', of: (n: number) => `af ${n} umsögnum á Facebook mæla með stofunni`, see: 'Sjá umsagnirnar' },

    /**
     * NOT testimonials. Facebook's individual review text sits behind a
     * login wall and já.is lists none, so there is no real customer quote to
     * put here honestly. These three rotate in the same slot instead: real,
     * checked facts about the shop, in its own voice, credited to nobody.
     */
    proof: {
      kicker: 'Staðreyndir',
      heading: 'Þetta er alveg satt.',
      cards: [
        'Skiltið í glugganum segir DROP INS WELCOME. Þannig er stofan rekin, ekki bara auglýsing.',
        'Regnbogafánarnir standa í gluggakistunum allt árið, ekki bara í ágúst.',
      ],
    },

    map: {
      title: 'Á kortinu',
      lead: 'Neðst á Klapparstíg, á horninu. Auðvelt að rata, erfitt að ganga fram hjá.',
      activate: 'Ýttu til að skoða kortið',
      directions: 'Fá leiðarlýsingu',
    },

    seo: {
      title: 'Rakararnir · Klapparstígur 40',
      description: 'Rakarastofa á Klapparstíg 40 í 101 Reykjavík. Engin tímapöntun, þú gengur bara inn. Verðskrá og opnunartími á síðunni.',
    },

    foot: {
      hours: 'Opnunartími',
      weekdays: 'Mán til fös',
      weekend: 'Lau og sun',
      closed: 'Lokað',
      find: 'Stofan',
      phone: 'Sími',
      call: 'Hringja',
    },
  },

  en: {
    langLabel: 'Tungumál: íslenska',
    skip: 'Skip to prices',
    nav: { prices: 'Prices', shop: 'The shop', corner: 'The corner', hours: 'Hours' },
    menu: { open: 'Menu', close: 'Close' },

    status: {
      open: 'Open',
      closed: 'Closed',
      until: (t: string) => `until ${t}`,
      soon: (m: number) => `closing in ${m} min`,
      today: (t: string) => `opens at ${t}`,
      tomorrow: (t: string) => `opens tomorrow at ${t}`,
      day: (d: string, t: string) => `opens ${d} at ${t}`,
    },
    ticker: 'No appointments. You just walk in.',

    stage: {
      arch: 'Rakararnir',
      archUnder: 'Klapparstígur 40',
      drawAlt: 'Drawing of the barber pole that stands in the window at Klapparstígur 40.',
      scroll: 'Scroll down',
      cornerAlt: 'Drawing of the corner building at Klapparstígur 40, with the barber pole beside the door.',
      photoAlt: 'The waiting corner: the barber pole in the window, the gilded sign on the glass and Klapparstígur outside.',
      plateTitle: 'The corner is all windows.',
      plateBody: 'The barber pole in the window, the gilded sign on the glass and Klapparstígur outside. You walk in off the street and sit down in the chair.',
    },

    band1: { l: 'Barbershop', r: 'Klapparstígur 40' },
    band2: { l: 'Everyone welcome', r: 'All year' },

    intro: {
      a: 'No appointments.',
      b: 'You just walk in.',
      body: 'There is a small card in our window that reads DROP INS WELCOME, and that is how this shop has always worked. No booking link, no app. You walk in off Klapparstígur, sit down, and leave with a haircut.',
    },

    prices: {
      title: 'Price list',
      note: 'Prices, durations and descriptions are placeholders and await the shop’s real details.',
      isk: 'kr.',
      mins: 'min',
      more: 'More',
    },

    shop: {
      title: 'The shop',
      lead: 'A bright corner, no two seats alike, plants in every window and a barber pole turning in the glass.',
      caps: ['On the floor', 'At the chair', 'In the window'],
      team: 'The team',
    },

    welcome: {
      title: 'Everyone welcome',
      body: 'The rainbow flags on the windowsills are there all year, not just in August. Whoever you are, you sit in the chair like everybody else.',
    },

    corner: {
      title: 'The corner',
      body: 'The shop is on the ground floor of an old corrugated iron house at the bottom of Klapparstígur, a minute from Laugavegur. The corner is all glass, so it is hard to walk past without seeing in.',
      caps: ['The house on the corner', 'The window from the street'],
      maps: 'Open in maps',
    },

    week: {
      title: 'Open right now?',
      lead: 'There is nothing to book, so the only question is whether the shop is open. Here is the week.',
      note: 'These hours are the ones listed on já.is and await confirmation from the shop.',
      openLbl: 'Open',
      closedLbl: 'Closed',
      nowLbl: 'Now',
    },

    phrases: {
      title: 'Say it in Icelandic',
      lead: 'You do not need a word of Icelandic to come in. But if you fancy trying.',
    },

    reviews: { title: 'Reviews', of: (n: number) => `of ${n} reviews on Facebook recommend the shop`, see: 'See the reviews' },

    proof: {
      kicker: 'The facts',
      heading: 'Every word of this is true.',
      cards: [
        'The card in the window says DROP INS WELCOME. That is how the shop runs, not just a slogan.',
        'The rainbow flags stand in the windowsills all year, not only in August.',
      ],
    },

    map: {
      title: 'On the map',
      lead: 'At the bottom of Klapparstígur, on the corner. Easy to find, hard to walk past.',
      activate: 'Tap to explore the map',
      directions: 'Get directions',
    },

    seo: {
      title: 'Rakararnir · Klapparstígur 40',
      description: 'Barbershop at Klapparstígur 40, 101 Reykjavík. No appointments, just walk in. Prices and opening hours on the page.',
    },

    foot: {
      hours: 'Opening hours',
      weekdays: 'Mon to Fri',
      weekend: 'Sat and Sun',
      closed: 'Closed',
      find: 'The shop',
      phone: 'Phone',
      call: 'Call',
    },
  },
} as const

/** Sunday-first, matching Date#getDay and the HOURS table. */
export const DAY_SHORT: Record<Lang, string[]> = {
  is: ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}

export const DAY_NAMES_L: Record<Lang, string[]> = {
  is: ['sunnudaginn', 'mánudaginn', 'þriðjudaginn', 'miðvikudaginn', 'fimmtudaginn', 'föstudaginn', 'laugardaginn'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}

export const t = (lang: Lang) => STRINGS[lang]
