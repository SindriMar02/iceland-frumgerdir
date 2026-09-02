/**
 * Katrín Ísfeld — the verified fact base. ONE source of truth.
 *
 * Everything here was read off her own published pages and her ja.is listing
 * on 2026-08-18, and every page, every meta tag and every JSON-LD block on
 * this site derives from this file. Nothing about this business is written
 * twice, because the failure mode of a duplicated fact is a site whose schema
 * tells Google one thing while the page says another.
 *
 * THE ADDRESS, AND WHY IT CHANGED
 * The first build of this site published "Bankastræti 10, 101 Reykjavík",
 * taken from a ja.is snapshot. That address is stale. Her own contact page
 * (katrinisfeld.is/hafa-samband, page modified 2024-06-25) and the CURRENT
 * ja.is entry both say Katrínartún 4, 105 Reykjavík. A third address,
 * Skipasund 74, is still being served by the scraper directory yelu.is.
 * Three addresses across three directories is the single most damaging thing
 * in her local search footprint: Google will not build a confident business
 * entity out of contradictory citations, and an assistant asked "where is
 * she" has no way to choose. The site publishes the address SHE publishes.
 * Fixing the stale directory entries is a task for her, listed in
 * KATRIN-SEO.md.
 *
 * CONFIRMED BY A THIRD, INDEPENDENT SOURCE (2026-08-18). Arrital's own store
 * locator at arrital.com/store-locator lists exactly one Icelandic dealer:
 *
 *   ICELAND | Reykjavík — Hönnunar Studio, Katrínartún 4, 105 Reykjavík,
 *   Tel. +354 663 3414, https://katrinisfeld.is
 *
 * An Italian manufacturer maintaining a dealer list has no reason to carry a
 * stale Icelandic address, and a store locator by definition points at the
 * room where you can go and see the product. So Katrínartún 4 is not merely
 * what she publishes, it is where the showroom in her own photographs is.
 */

/** The studio, as she publishes it. */
export const STUDIO = {
  /** Legal/personal name, as carried by ja.is and the FHI félagatal. */
  personName: 'Katrín Ísfeld Guðmundsdóttir',
  /** The name she trades and signs under. */
  name: 'Katrín Ísfeld Hönnunar Studio',
  shortName: 'Katrín Ísfeld',
  role: 'Innanhússarkitekt',
  /** Her own tagline, from every page header of her site. */
  tagline: 'Hönnun er upplifun',

  street: 'Katrínartún 4',
  postalCode: '105',
  city: 'Reykjavík',
  country: 'IS',
  /** Katrínartún 4 (Höfðatorg). Coordinates read off the Já.is map pin. */
  lat: 64.1470,
  lon: -21.9060,

  phoneDisplay: '663 3414',
  phone: '+354 663 3414',
  phoneHref: 'tel:+3546633414',
  email: 'katrin@katrinisfeld.is',

  /**
   * CONFIRMED 2026-09-02 (Sindri, direct from Katrín): 11:00–17:00, weekdays.
   * The room at Katrínartún 4 holds a display kitchen and material samples,
   * not staffed retail hours — clients book a time by phone or email rather
   * than walking in. So the hours are published alongside an appointment
   * note everywhere they appear, and the room is never described as a
   * shop with drop-in hours. See [[APPOINTMENT_NOTE]] below.
   */
  opens: '11:00',
  closes: '17:00',
  /** schema.org day names, Monday–Friday. */
  openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as string[],

  /** Copyright line on her own site reads "2018 -". */
  founded: '2018',

  instagram: 'https://www.instagram.com/katrinisfeldg/',
  facebook: 'https://www.facebook.com/KatrinIsfeldGudmunds',
  linkedin: 'https://www.linkedin.com/in/katrin-%C3%ADsfeld-28b2ab34/',
  jaIs: 'https://ja.is/katrin-isfeld-gudmundsdottir-innanhussarkitekt/',
  fhi: 'https://www.honnunarmidstod.is/fagfelog/felag-husgagna-og-innanhusarkitekta/felagatal-fhi',
} as const

export const ADDRESS_LINE = `${STUDIO.street}, ${STUDIO.postalCode} ${STUDIO.city}`

/** Directions, by address rather than by place ID — no Google account needed
 *  and it keeps working if her listing is ever re-created. */
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${STUDIO.street}, ${STUDIO.postalCode} ${STUDIO.city}`)

/** Icelandic word for the confirmed day range — used everywhere the hours
 *  are displayed, so "virka daga" is written once. */
export const HOURS_DAYS_IS = 'virka daga'
/** The appointment framing, confirmed alongside the hours: the room is a
 *  display space, not staffed retail, so every mention of hours carries
 *  this rather than implying anyone can walk in. */
export const APPOINTMENT_NOTE_IS =
  'Best er að hafa samband fyrirfram og bóka tíma, símleiðis eða í tölvupósti.'
export const APPOINTMENT_NOTE_EN =
  'Please get in touch beforehand, by phone or email, to arrange a time.'

/**
 * The showroom.
 *
 * WHAT IS ACTUALLY EVIDENCED, because this is where a plausible-sounding
 * invention would go. Her own project "Hönnunar Studio" is photographed from
 * inside a street-level room with KATRÍN ÍSFELD HÖNNUNAR STUDIO applied to
 * the window in vinyl, holding a display kitchen in dark stone and panels of
 * material samples. So: the space exists, it is hers, and the cabinetry is
 * in it. That is the whole of what can be said.
 *
 * CONFIRMED 2026-09-02: she does not take walk-ins. Clients book a time by
 * phone or email; the room is a display space for an appointment, not a
 * staffed shop. The copy invites people to arrange a visit rather than
 * implying anyone can drop by, which is the right call for a purchase this
 * size regardless.
 */
export const SHOWROOM = {
  photo: 'p-studio-0',
  alt: 'Sýningarrými stúdíósins við götuna, með eldhúsinnréttingu í dökkum steini og efnissýnishornum',
  lead: 'Innréttingarnar og efnin eru til sýnis í stúdíóinu.',
  body:
    'Munurinn á tveimur steintegundum sést ekki á skjá, og ekki heldur hvernig matt lakk tekur við dagsbirtu. ' +
    'Í stúdíóinu liggja sýnishorn af borðplötum, framhliðum og efnum, ásamt uppsettri eldhúsinnréttingu, ' +
    'svo hægt sé að handleika það sem til stendur að velja.',
  cta: 'Hafðu samband og við finnum tíma sem hentar.',
} as const

/** Her CV, verbatim in substance from katrinisfeld.is/studioid. */
export const CV = {
  degree: 'BSc í innanhússarkitektúr',
  school: 'Art Institute of Fort Lauderdale',
  schoolPlace: 'Flórída, Bandaríkjunum',
  honours: 'Útskrifaðist með láði',
  award: 'Annað sæti í alþjóðlegri hönnunarsamkeppni í Bandaríkjunum',
  roles: [
    'Innanhússarkitekt við arkitektastofu í Fort Lauderdale, hönnun á glæsivillum',
    'Innanhússarkitekt hjá arkitektastofu Margreed Van der Hooven í Hollandi',
    'Sjálfstætt starfandi innanhússarkitekt með eigið stúdíó',
  ],
  /** Listed among the aðalfélagar (accredited principal members) of FHI. */
  membership: 'Félagi í Félagi húsgagna- og innanhússarkitekta (FHI)',
} as const

/**
 * The two Italian cabinetry lines she carries. Both are named on her own site.
 * Her page spells the bathroom brand "Altamerea"; the manufacturer it links to
 * is altamareabath.it and the brand's own name is Altamarea, so the correct
 * spelling is used here. Worth telling her: the misspelling means anyone
 * searching the real brand name never reaches her page.
 */
export const BRANDS = [
  {
    slug: 'eldhus',
    name: 'Arrital',
    room: 'Eldhús',
    site: 'https://www.arrital.com',
    intro:
      'Arrital er ítalskur eldhúsframleiðandi sem vinnur með sömu efni og arkitektar teikna með: spónlagðan við, steinborðplötur, mattar lakkaðar framhliðar og granna álprófíla. Innréttingarnar eru ekki valdar úr bæklingi heldur teiknaðar inn í rýmið eins og það er.',
    photo: 's-eyja',
  },
  {
    slug: 'bad',
    name: 'Altamarea',
    room: 'Baðherbergi',
    site: 'https://www.altamareabath.it',
    intro:
      'Altamarea gerir baðinnréttingar, vaska og spegla þar sem hver eining er teiknuð sérstaklega: breiddin ræðst af veggnum, ekki af staðalstærð. Þannig fæst baðherbergi sem lítur út fyrir að hafa alltaf verið svona.',
    photo: 's-bad',
  },
] as const
