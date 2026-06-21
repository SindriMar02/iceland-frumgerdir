/**
 * Sample content for the Sauðárkróksbakarí redesign concept ("Bakað síðan 1880").
 *
 * HONESTY: opening hours, prices and review quotes are SAMPLE data — the shared
 * PreviewFooter disclaims this on every page. Verified facts only: founded ~1880,
 * Aðalgata 5 (550 Sauðárkrókur), phone +354 455 5000, 40 seats in & out,
 * Tripadvisor 4,7 + Travelers' Choice (real). No invented baker names or awards.
 */

export interface BakeCategory {
  id: string
  /** Icelandic category name */
  name: string
  /** English gloss for travellers */
  en: string
  /** One warm line of description */
  blurb: string
  /** Sample price label, e.g. "frá 690 kr" */
  price: string
  /** A representative item, for the steam-card */
  pick: string
  /** Does this card carry the steam-rise signature? (still warm) */
  steams: boolean
  /** Sample "out of the oven at" time — drives the board's warmth read. */
  oven: string
}

/** "Heitt úr ofninum" — what they bake. Sample prices in kr, sample oven times. */
export const BAKES: BakeCategory[] = [
  {
    id: 'braud',
    name: 'Brauð',
    en: 'Breads',
    blurb: 'Súrdeig, rúgbrauð og fjallabrauð, hnoðuð og bökuð á staðnum frá fyrstu birtu.',
    price: 'frá 690 kr',
    pick: 'Rúgbrauð úr ofninum',
    steams: true,
    oven: '06:40',
  },
  {
    id: 'vinarbraud',
    name: 'Vínarbrauð',
    en: 'Pastries',
    blurb: 'Smjördeig sem flagnar í lögum, snúðar og kruðerí beint úr ofninum.',
    price: 'frá 420 kr',
    pick: 'Kanilsnúður',
    steams: true,
    oven: '07:10',
  },
  {
    id: 'smakokur',
    name: 'Smákökur',
    en: 'Cookies',
    blurb: 'Bakaðar eftir gömlum uppskriftum: hálfmánar, perlur og lakkrístoppar.',
    price: 'frá 290 kr',
    pick: 'Hálfmánar',
    steams: false,
    oven: '08:00',
  },
  {
    id: 'kokur',
    name: 'Kökur',
    en: 'Cakes',
    blurb: 'Rjómatertur, marengs og randalín fyrir stór og smá tilefni.',
    price: 'frá 750 kr',
    pick: 'Randalín',
    steams: false,
    oven: '08:30',
  },
  {
    id: 'supa',
    name: 'Súpa dagsins',
    en: 'Soup of the day',
    blurb: 'Heit súpa með nýbökuðu brauði, soðin ný á hverjum degi fyrir hádegið.',
    price: '1.690 kr',
    pick: 'Súpa með brauði',
    steams: true,
    oven: '11:30',
  },
  {
    id: 'kaffi',
    name: 'Kaffi',
    en: 'Coffee',
    blurb: 'Vel lagað kaffi, te og kakó til að setjast niður með í hlýjunni.',
    price: 'frá 490 kr',
    pick: 'Kaffi og með því',
    steams: true,
    oven: 'allan daginn',
  },
]

export interface HeritageStat {
  /** Big number / token */
  value: string
  /** Small label below */
  label: string
}

/** Heritage device: the 1880 numbers. */
export const HERITAGE_STATS: HeritageStat[] = [
  { value: '1880', label: 'Bakað frá' },
  { value: '146 ár', label: 'Á sama stað' },
  { value: '40', label: 'Sæti inni og úti' },
  { value: '4,7', label: 'Stjörnur á Tripadvisor' },
]

export interface TimelineEntry {
  /** Year token */
  year: string
  /** Short Icelandic note */
  note: string
}

/**
 * The 1880 heritage timeline — anchored by two verified facts (founded ~1880;
 * still standing today). The middle line is a gentle, non-specific framing of
 * "generations of bakers", not an invented dated event.
 */
export const TIMELINE: TimelineEntry[] = [
  { year: '1880', note: 'Ofninn er kveiktur við Aðalgötu. Eitt elsta bakarí landsins verður til.' },
  { year: 'Kynslóð', note: 'Sama horn, sama handverk. Uppskriftirnar ganga áfram, hús úr húsi.' },
  { year: 'Í dag', note: 'Vefurinn rann úr gildi, en ofninn er enn heitur á hverjum morgni.' },
]

export interface Review {
  quote: string
  author: string
  meta: string
}

/** Trust quotes — SAMPLE wording, disclaimed in the footer. */
export const REVIEWS: Review[] = [
  {
    quote: 'Besta rúgbrauð sem ég hef smakkað á Íslandi. Við stoppum alltaf þegar við keyrum norður.',
    author: 'Gestur úr Skagafirði',
    meta: 'Sýnishorn af umsögn',
  },
  {
    quote: 'Hlýlegt og notalegt, ilmurinn tekur á móti þér í dyrunum. Snúðarnir eru ennþá volgir.',
    author: 'Ferðalangur á leið norður',
    meta: 'Sýnishorn af umsögn',
  },
  {
    quote: 'Gamalt bakarí með sál. Súpa dagsins og nýbakað brauð gerðu daginn okkar í Skagafirði.',
    author: 'Gestur á sumardegi',
    meta: 'Sýnishorn af umsögn',
  },
]

export interface DayHours {
  /** Icelandic day range */
  day: string
  /** Hours string, or "Lokað" */
  hours: string
  /** Weekday indices this row covers (0=Sun … 6=Sat), for the live open/closed read. */
  days: number[]
  /** Sample open/close in 24h minutes from midnight; null = closed. */
  open: number | null
  close: number | null
}

/** SAMPLE opening hours — marked as sýnishorn on the page + disclaimed in footer. */
export const HOURS: DayHours[] = [
  { day: 'Mánudaga til föstudaga', hours: '7:30 – 17:30', days: [1, 2, 3, 4, 5], open: 7 * 60 + 30, close: 17 * 60 + 30 },
  { day: 'Laugardaga', hours: '8:00 – 16:00', days: [6], open: 8 * 60, close: 16 * 60 },
  { day: 'Sunnudaga', hours: '9:00 – 16:00', days: [0], open: 9 * 60, close: 16 * 60 },
]

/** The day's reasons, shown as a small rotating "still warm" ticker line. */
export const FRESH_LINE: string[] = [
  'Ofninn er kveiktur',
  'Brauðið kemur heitt út',
  'Súpa dagsins í hádeginu',
  'Kaffi á könnunni',
]

/** Practical visit facts (verified). */
export const VISIT = {
  street: 'Aðalgata 5',
  town: '550 Sauðárkrókur',
  region: 'Skagafjörður',
  tel: '+3544555000',
  telLabel: '455 5000',
  email: 'saudarkroksbakari@gmail.com',
} as const
