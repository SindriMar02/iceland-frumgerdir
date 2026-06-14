/**
 * Lýsulaugar — "Græna lindin" content model.
 * Sample/illustrative copy (prices, tips) per the disclaimer; the green
 * mineral water itself is real and presented truthfully — it is steinefnaríkt
 * jarðhitavatn rich in green chlorella algae (klórella), NOT carbonated.
 */

const UNS = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMG = {
  /* Luminous green mineral / algae water — the brand's one ownable thing.
     (Was a brown Hverir/Mývatn-style mudpot; swapped to green water.) */
  heroId: 'photo-1505159940484-eb2b9f2588e2',
  wellnessA: UNS('photo-1576013551627-0cc20b96c2a7', 1280),
  wellnessB: UNS('photo-1507652313519-d4e9174996dd', 1280),
  mossA: UNS('photo-1604239195402-62924edcbc13', 1280),
  mossB: UNS('photo-1730012066338-d544cf255500', 1280),
  farm: UNS('photo-1609894851180-7be27983da7d', 1280),
}

/** Qualities of the water — wellness language, no medical claims. */
export const WATER: { label: string; title: string; body: string }[] = [
  {
    label: '01',
    title: 'Grænt af náttúrunnar hendi',
    body:
      'Græni liturinn kemur frá klórellu — grænþörungum sem þrífast í steinefnaríku jarðhitavatninu. Engin litarefni, ekkert klór — bara lindin eins og hún kemur upp.',
  },
  {
    label: '02',
    title: 'Steinefnaríkt og þörungagrænt',
    body:
      'Jarðhitavatn mettað steinefnum úr eldfjallaberginu undir Snæfellsjökli, með sínum sérstaka, græna blæ frá þörungunum. Mjúkt á húð og ólíkt öllu öðru.',
  },
  {
    label: '03',
    title: 'Róandi og hægt',
    body:
      'Volg laug um 38°C, kyrrð og útsýni til jökulsins. Hér er enginn troðningur — bara hægur tími til að slaka á og anda að sér.',
  },
]

/** Real facilities — concrete proof, not just mood. */
export const FACILITIES: { label: string; value: string; note: string }[] = [
  {
    label: 'Aðallaugin',
    value: '~38°C',
    note: 'Græna steinefnalindin sjálf — volg og mjúk.',
  },
  {
    label: 'Heitir pottar',
    value: 'Tveir',
    note: 'Til viðbótar við aðallaugina.',
  },
  {
    label: 'Kaldur pottur',
    value: 'Ískelda',
    note: 'Fyrir þá sem vilja skella sér í kalt á eftir.',
  },
  {
    label: 'Á staðnum',
    value: 'Kaffihús',
    note: 'Lítið kaffihús; allt endurnýjað 2019.',
  },
]

/** Practical opening info — sample figures, clearly illustrative. */
export const VISIT = {
  season: '15. maí – 31. ágúst',
  daily: '11:00 – 21:00',
  prices: [
    { who: 'Fullorðnir', price: '1.800 kr.' },
    { who: 'Börn (10–17 ára)', price: '500 kr.' },
    { who: 'Yngri en 10 ára', price: 'Frítt' },
  ],
  address: 'Lýsuhóll, Staðarsveit, 356 Snæfellsbær',
  /* Precise coordinate pin (64.8414, -23.2140) instead of a text search */
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=64.8414%2C-23.2140',
  phone: '+354 433 9917',
  email: 'lysulaugar@snb.is',
}

/** Good-to-know practical tips. */
export const TIPS: { title: string; body: string }[] = [
  {
    title: 'Búningsklefar og sturta',
    body: 'Búningsklefar fyrir alla og heitar sturtur á staðnum. Skylt er að fara í sturtu (án sundfata) fyrir bað, eins og venja er á Íslandi.',
  },
  {
    title: 'Handklæði og sundföt',
    body: 'Handklæði og sundföt eru til leigu ef þú gleymir þínum — en best er að taka með eigin handklæði.',
  },
  {
    title: 'Greiðsla',
    body: 'Tekið er við korti á staðnum. Ekki er hægt að bóka fyrirfram — komið bara við á opnunartíma.',
  },
  {
    title: 'Á svæðinu',
    body: 'Lýsulaugar eru á starfandi bæ. Sýnið dýrum og landi tillitssemi og njótið kyrrðarinnar með okkur.',
  },
]
