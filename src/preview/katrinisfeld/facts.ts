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

  /** Já.is lists the same hours for all seven days. */
  opens: '11:00',
  closes: '17:00',

  /** Copyright line on her own site reads "2018 -". */
  founded: '2018',

  instagram: 'https://www.instagram.com/katrinisfeldg/',
  facebook: 'https://www.facebook.com/KatrinIsfeldGudmunds',
  linkedin: 'https://www.linkedin.com/in/katrin-%C3%ADsfeld-28b2ab34/',
  jaIs: 'https://ja.is/katrin-isfeld-gudmundsdottir-innanhussarkitekt/',
  fhi: 'https://www.honnunarmidstod.is/fagfelog/felag-husgagna-og-innanhusarkitekta/felagatal-fhi',
} as const

export const ADDRESS_LINE = `${STUDIO.street}, ${STUDIO.postalCode} ${STUDIO.city}`

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
