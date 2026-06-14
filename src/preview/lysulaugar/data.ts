/**
 * Lýsulaugar — "Græna lindin" content model.
 * Sample/illustrative copy (prices, tips) per the disclaimer; the green
 * carbonated mineral water itself is real and presented truthfully.
 */

const UNS = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMG = {
  heroId: 'photo-1549193308-7c895560f8e2',
  wellnessA: UNS('photo-1508869184489-1b42faa950b0', 1280),
  wellnessB: UNS('photo-1519320993082-43a535317ddc', 1280),
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
      'Vatnið fær sinn græna blæ frá steinefnum og þörungum í berginu. Engin litarefni, ekkert klór — bara lindin eins og hún kemur upp.',
  },
  {
    label: '02',
    title: 'Steinefnaríkt og kolsýrt',
    body:
      'Náttúrulega kolsýrt jarðhitavatn með sínum sérstaka, græna blæ, mettað steinefnum úr eldfjallaberginu undir Snæfellsjökli. Mjúkt á húð og ólíkt öllu öðru.',
  },
  {
    label: '03',
    title: 'Róandi og hægt',
    body:
      'Volg laug, kyrrð og útsýni til jökulsins. Hér er enginn troðningur — bara hægur tími til að slaka á og anda að sér.',
  },
]

/** Practical opening info — sample figures, clearly illustrative. */
export const VISIT = {
  season: '15. maí – 31. ágúst',
  daily: '11:00 – 21:00',
  prices: [
    { who: 'Fullorðnir', price: '1.500 kr.' },
    { who: 'Börn (6–15 ára)', price: '800 kr.' },
    { who: 'Yngri en 6 ára', price: 'Frítt' },
  ],
  address: 'Lýsuhóll, 356 Snæfellsbær',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lýsuhóll+Snæfellsnes',
  phone: '+354 435 6716',
  email: 'lysulaugar@snb.is',
}

/** Good-to-know practical tips. */
export const TIPS: { title: string; body: string }[] = [
  {
    title: 'Búningsklefar og sturta',
    body: 'Búningsklefar fyrir alla og heitar sturtur á staðnum. Sturtu er skylt að nota fyrir bað, eins og venja er á Íslandi.',
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
