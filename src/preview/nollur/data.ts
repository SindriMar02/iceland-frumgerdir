/* ── Nollur — "Across the fjord" ─────────────────────────────────────────────
   Drangar's NIB-lineage engine ("Húsin muna", see ../drangar) carried to a Swiss-run
   family of nine holiday houses on Eyjafjörður. EVERY fact and most sentences below
   come from nollur.is (WordPress pages read through the site's own REST API on
   2026-09-02), the Vrbo listings 757877ha / 2365219ha / 527470ha and the Expedia
   listing h33925140. Owner names are not used; the owner is Swiss and the page is
   English with German second, never Icelandic. NO prices.                        */

const A = `${import.meta.env.BASE_URL}nollur/`

export const IMG = {
  heroHouse: `${A}hero-house.webp`,          // Hrafnabjörg from the drive, glass box over shale
  /* the same frame with the sky segmented out (Higgsfield background remover,
     then filled down per column so the lawn stays solid) — the hero's house
     stands in front of the wordmark and occludes it with its real roofline.
     The filename carries the file's own content hash: public/ assets are copied
     verbatim by Vite, so a same-named replacement keeps serving from the Pages
     CDN and the browser cache for ten minutes and reads as "not fixed"
     ([[github-pages-cache-busting]]). Re-hash the name whenever the art changes. */
  heroCut: `${A}hero-cutout.9247b7a4.webp`,
  heroCut900: `${A}hero-cutout-900.9247b7a4.webp`,
  arrivalView: `${A}arrival-view.webp`,      // through the glass wall to Akureyri across the water
  arrivalPool: `${A}arrival-pool.webp`,      // the villa mirrored in its pool
  matWalnut: `${A}mat-walnut.webp`,
  matShale: `${A}mat-shale.webp`,
  matGlass: `${A}mat-glass.webp`,
  matRevox: `${A}mat-revox.webp`,
  quoteChair: `${A}quote-chair.webp`,        // red chair, ReVoX column, the fjord
  quoteTub: `${A}quote-tub.webp`,            // bath with the town in the window
  akPool: `${A}ak-pool.webp`,
  akLeifs: `${A}ak-leifs.webp`,
  akLiving: `${A}ak-living.webp`,
  akLeifsHouse: `${A}ak-leifs-house.webp`,
  grShore: `${A}gr-shore.webp`,
  grLaug: `${A}gr-laug.webp`,
  grLawn: `${A}gr-lawn.webp`,
  grVallHouse: `${A}gr-vall-house.webp`,
  grWindow: `${A}gr-window.webp`,
  nfKald: `${A}nf-kald.webp`,
  nfSulur: `${A}nf-sulur.webp`,
  nfKaldDeck: `${A}nf-kald-deck.webp`,
  nfKrysDusk: `${A}nf-krys-dusk.webp`,
  nfFnjoLiving: `${A}nf-fnjo-living.webp`,
  nfSulurKitchen: `${A}nf-sulur-kitchen.webp`,
  nfKaldFjord: `${A}nf-kald-fjord.webp`,
  nfKrysHouse: `${A}nf-krys-house.webp`,
  nfFnjoHouse: `${A}nf-fnjo-house.webp`,
  nfSulurHouse: `${A}nf-sulur-house.webp`,
  townAurora: `${A}town-aurora.webp`,        // the lights over Akureyri's lights, from the villa
  fjordAurora: `${A}fjord-aurora.webp`,
  sagaHouse: `${A}saga-house.webp`,
  cierreDrive: `${A}cierre-drive.webp`,
  menuNight: `${A}menu-night.webp`,
}

export const EMAIL = 'info@nollur.is'
export const EMAIL_HREF = 'mailto:info@nollur.is'
export const SITE = 'https://www.nollur.is'
export const CAMERAS = 'https://camserver.nollur.is/timelapse.php'
export const PANORAMA = 'https://www.nollur.is/wp-content/uploads/2025/12/nollur_eyjafjord_airpano/index.html'
export const VRBO = {
  hrafnabjorg: 'https://www.vrbo.com/757877ha',
  leifsstadir: 'https://www.vrbo.com/2365219ha',
  krysuvik: 'https://www.vrbo.com/527470ha',
  sulur: 'https://www.expedia.com/Wonderful-Holiday-House-On-The-Nollur-Farm-At-Eyafjord.h33925140.Hotel-Information',
}

export type Lang = 'en' | 'de'

/* ── The nine houses, facts from each unit's own page. ── */
export interface House {
  id: string
  name: string
  place: 'akureyri' | 'grenivik' | 'nollur'
  m2: number
  beds: number
  baths: string
  sleeps: string
  note: Record<Lang, string>
  vrbo?: string
  rating?: string
}
export const HOUSES: House[] = [
  { id: 'hrafnabjorg', name: 'Hrafnabjörg', place: 'akureyri', m2: 200, beds: 3, baths: '3', sleeps: '6',
    note: { en: 'Villa opposite Akureyri, built 2006, pool, 16,000 m² garden', de: 'Villa gegenüber Akureyri, Baujahr 2006, Pool, 16 000 m² Garten' },
    vrbo: VRBO.hrafnabjorg, rating: '9.8 · 268' },
  { id: 'leifsstadir', name: 'Leifsstaðir', place: 'akureyri', m2: 280, beds: 4, baths: '2', sleeps: '8',
    note: { en: 'Villa on the eastern hillside, 12,000 m² of privacy, renovated 2015', de: 'Villa am Osthang, 12 000 m² Privatsphäre, 2015 renoviert' },
    vrbo: VRBO.leifsstadir, rating: '9.8 · 210' },
  { id: 'vallholt', name: 'Vallholt', place: 'grenivik', m2: 200, beds: 3, baths: '2', sleeps: '6',
    note: { en: 'Seafront house, hot pot in the garden, made for families and long stays', de: 'Haus am Meer, Hotpot im Garten, für Familien und lange Aufenthalte' } },
  { id: 'laugaland', name: 'Laugaland', place: 'grenivik', m2: 125, beds: 2, baths: '1+', sleeps: '4',
    note: { en: 'Grass roofs, black concrete, solid oak, a hot tub half open to the sky, just completed', de: 'Grasdächer, schwarzer Sichtbeton, Massiveiche, Hot Tub halb unter freiem Himmel, eben fertiggestellt' } },
  { id: 'bakkabud', name: 'Bakkabúð', place: 'grenivik', m2: 110, beds: 2, baths: '1', sleeps: '4',
    note: { en: 'Waterfront home with kitchen, laundry and garden', de: 'Haus am Wasser mit Küche, Waschküche und Garten' } },
  { id: 'kaldbakur', name: 'Kaldbakur', place: 'nollur', m2: 120, beds: 2, baths: '1', sleeps: '6',
    note: { en: 'A 60 m² room to the fjord, a 6 m² hot tub under the roof, a walnut king bed', de: 'Ein 60 m² Raum zum Fjord, ein 6 m² Hot Tub unter dem Dach, ein Kingsize-Bett aus Walnuss' } },
  { id: 'fnjoska', name: 'Fnjóská', place: 'nollur', m2: 110, beds: 1, baths: '1', sleeps: '2 (4)',
    note: { en: 'Loft for two: oak, walnut, beech and maple, a 380 × 180 cm window on the fjord', de: 'Loft für zwei: Eiche, Walnuss, Buche und Ahorn, ein 380 × 180 cm Fenster zum Fjord' } },
  { id: 'krysuvik', name: 'Krýsuvík', place: 'nollur', m2: 50, beds: 2, baths: '1', sleeps: '4',
    note: { en: 'Roland Burkard, 2009. Three rooms, a bunk bed for the children, black stone bath', de: 'Roland Burkard, 2009. Drei Zimmer, Etagenbett für die Kinder, Bad in schwarzem Stein' },
    vrbo: VRBO.krysuvik, rating: '9.8 · 175' },
  { id: 'sulur', name: 'Súlur', place: 'nollur', m2: 50, beds: 1, baths: '1', sleeps: '4',
    note: { en: 'Roland Burkard, 2009. Slate floors, a private hot tub, the lights without leaving the house', de: 'Roland Burkard, 2009. Schieferböden, privater Hot Tub, Nordlichter ohne das Haus zu verlassen' },
    vrbo: VRBO.sulur, rating: '9.8 · 220' },
]

/* ── Three places, the accordion. ── */
export interface Place {
  id: House['place']
  num: string
  media: string
  detail: string
  photoAlt: Record<Lang, string>
  detailAlt: Record<Lang, string>
  lat: string
}
export const PLACES: Place[] = [
  { id: 'akureyri', num: '01', media: IMG.akPool, detail: IMG.akLeifs, lat: '65°41´N',
    photoAlt: { en: 'The pool corner of Hrafnabjörg with the fjord beyond the glass', de: 'Die Poolecke von Hrafnabjörg, dahinter der Fjord' },
    detailAlt: { en: 'Leifsstaðir, the white villa in its meadow', de: 'Leifsstaðir, die weisse Villa in ihrer Wiese' } },
  { id: 'grenivik', num: '02', media: IMG.grShore, detail: IMG.grLaug, lat: '65°57´N',
    photoAlt: { en: 'Vallholt on the shore at Grenivík, the fjord behind', de: 'Vallholt am Ufer in Grenivík, dahinter der Fjord' },
    detailAlt: { en: 'Laugaland in snow, the new house on the old plot', de: 'Laugaland im Schnee, das neue Haus auf dem alten Grundstück' } },
  { id: 'nollur', num: '03', media: IMG.nfKald, detail: IMG.nfSulur, lat: '65°52´N',
    photoAlt: { en: 'Kaldbakur on the Nollur farm, a grass roof over the fjord', de: 'Kaldbakur auf dem Hof Nollur, ein Grasdach über dem Fjord' },
    detailAlt: { en: 'Súlur, timber and glass on the farm', de: 'Súlur, Holz und Glas auf dem Hof' } },
]

/* ── Hotspots on the hero photograph, in fractions of the frame. ── */
export const HOTSPOTS: Array<{ x: number; y: number; key: 'glass' | 'walnut' | 'shale' | 'revox' }> = [
  { x: 0.5, y: 0.31, key: 'glass' },
  { x: 0.3, y: 0.37, key: 'walnut' },
  { x: 0.425, y: 0.6, key: 'shale' },
  { x: 0.64, y: 0.33, key: 'revox' },
]

/* ── Everything in words, twice. ── */
export const T = {
  en: {
    htmlLang: 'en',
    docTitle: 'Nollur · Nine houses on Eyjafjörður, North Iceland',
    switchLabel: 'Deutsch',
    nav: [
      { id: 'houses', label: 'The houses' },
      { id: 'materials', label: 'The materials' },
      { id: 'farm', label: 'The farm' },
      { id: 'story', label: 'The story' },
      { id: 'contact', label: 'Write to us' },
    ],
    menuCaption: 'The lights over Akureyri, from Hrafnabjörg',
    menuWrite: 'Write to us',
    hero: {
      kicker: 'Nine houses (Eyjafjörður, North Iceland)',
      sub: 'Two villas facing Akureyri across the water, three houses on the shore at Grenivík and four on the farm at Nollur. One family company, one fjord.',
      copyright: '© Nollur ehf. · photographs Reto Kuhn',
      rot: [{ id: 'story', label: 'Story' }, { id: 'houses', label: 'Houses' }],
      spot: { glass: 'Glass', walnut: 'Walnut', shale: 'Shale', revox: 'ReVoX' },
    },
    arrival: {
      alt: 'Looking through the glass wall of Hrafnabjörg across the water to Akureyri',
      spec: ['Hrafnabjörg', 'opposite Akureyri', '2006'],
      cursor: 'View',
    },
    statement: {
      lines: ['Two villas facing the town,', 'three houses on the shore,', 'four on the farm at Nollur:', 'one fjord, nine keys.'],
      emIndex: 1,
      emText: 'on the shore,',
      emBefore: 'three houses ',
      body: 'Wonderful holiday houses and holiday apartments on the Nollur farm at the Eyjafjörður, an exclusive villa just opposite Akureyri, a villa in the outskirts of Akureyri at the eastern hillside of the Eyjafjörður and a spacious house at the seafront in Grenivík.',
    },
    quote: {
      text: 'It is rented by celebrities but also by other people who enjoy the location and the high standard of the house.',
      attribution: 'In their own words, on Hrafnabjörg',
      alt1: 'A red chair and a ReVoX column at the glass wall, the fjord beyond',
      alt2: 'A bath with the town in the window',
    },
    places: {
      akureyri: { name: 'Akureyri, across the water', sub: 'Two villas', plate: ['65°41´N', 'ACROSS THE WATER', '2 VILLAS'] },
      grenivik: { name: 'Grenivík, on the shore', sub: 'Three houses', plate: ['65°57´N', 'THE SHORE', '3 HOUSES'] },
      nollur: { name: 'Nollur, the farm', sub: 'Four houses', plate: ['65°52´N', 'THE FARM', '4 HOUSES'] },
      cta: 'Enquire',
      units: { m2: 'm²', beds: 'bed', bath: 'bath', sleeps: 'sleeps', rating: 'on Vrbo' },
    },
    farmNote: {
      kicker: 'Where is Nollur',
      body: 'Nollur is a farm in the Eyjafjörður 30 kilometers north of Akureyri. It is only a short distance to the famous church of Laufás, which means leaf hill in Icelandic. The name Nollur itself comes from the situation of the farm on a rock hill. These rocks are actually not visible from the street, but from the sea.',
    },
    materials: {
      rail: 'The materials ✳ in their words',
      items: [
        { title: 'Walnut', body: 'A king-size bed made of walnut at Kaldbakur; oak, walnut, beech and maple in the loft at Fnjóská.', alt: 'A walnut column against the glass at Hrafnabjörg' },
        { title: 'Shale', body: 'Hrafnabjörg was refurbished in walnut, shale and glass; the bathrooms on the farm are in black stone, the floors at Súlur in slate.', alt: 'Shale cladding, close up' },
        { title: 'Glass', body: 'The large windows allow an unrestricted view to the fjord and the weather changes. In winter, Northern Lights can be observed without leaving the house.', alt: 'The glass corner of the villa reflecting the sky' },
        { title: 'ReVoX', body: 'ReVoX audio equipment at Hrafnabjörg; at Laugaland an audiophile stereo with a library of over 20,000 tracks.', alt: 'A red chair beside a ReVoX column' },
      ],
    },
    farm: {
      title: 'Nollur',
      titleTail: ', the farm on the rock',
      body: 'Four houses on a hill above the fjord, 30 kilometres north of Akureyri. Kaldbakur with its 60 m² room to the water and a hot tub under the roof; the loft at Fnjóská, made for two; Krýsuvík and Súlur, designed by the Swiss architect Roland Burkard and completed in 2009, heated with natural hot water.',
      caps: ['Kaldbakur, the deck', 'Krýsuvík at dusk', 'Fnjóská, the loft'],
      alts: ['The deck and sunken hot tub at Kaldbakur', 'Krýsuvík at dusk with its blue-lit windows', 'The walnut living room of the Fnjóská loft'],
    },
    lights: {
      kicker: 'From the villa, in winter',
      before: 'In winter the Northern Lights can be observed without leaving the ',
      travel: 'house',
      after: '.',
      alt: 'The northern lights over the lights of Akureyri, seen from Hrafnabjörg across the water',
    },
    story: {
      title: 'Built, bought, refurbished',
      credit: 'Photographs by Reto Kuhn',
      rows: [
        { year: '2006', text: 'Hrafnabjörg built by the Icelandic architect Fanney Hauksdóttir, opposite Akureyri' },
        { year: '2009', text: 'Súlur and Krýsuvík completed on the farm, designed by Roland Burkard' },
        { year: '2014', text: 'Leifsstaðir acquired in October, on the eastern hillside' },
        { year: '2015', text: 'Leifsstaðir renovated until July, antiques and protected rare items kept' },
        { year: '2025', text: 'Laugaland completed on the old Laugaland plot at Grenivík' },
      ],
      award: 'Nollur ehf. is a company of Esja Holding AG in Switzerland and a 100% privately owned family business. Guests rate Hrafnabjörg 9.8 from 268 reviews on Vrbo and Leifsstaðir 9.8 from 210.',
      alt: 'Hrafnabjörg against a bright sky',
    },
    grenivik: { kicker: '(The shore at Grenivík)', alt: 'The lawn at Vallholt running down to the sea at Grenivík' },
    cierre: {
      a: 'Nine keys,',
      b: 'one fjord.',
      sub: 'Write to us in English or German. Every house has a live camera, so you can look before you ask.',
      cta: 'Write to us',
      cta2: 'the live cameras',
    },
    footer: {
      h2a: 'Nollur,',
      h2b: 'Eyjafjörður',
      write: 'Write',
      cameras: 'Live cameras',
      camerasLabel: 'camserver.nollur.is',
      panorama: '360° panorama',
      panoramaLabel: 'The fjord from above',
      find: 'Find us',
      places: ['Hrafnabjörg and Leifsstaðir, opposite and above Akureyri', 'Vallholt, Laugaland and Bakkabúð, on the shore at Grenivík', 'Kaldbakur, Fnjóská, Krýsuvík and Súlur, on the Nollur farm, 30 km north of Akureyri'],
      cornerA: 'Nollur ehf.',
      cornerB: 'Villas and houses in the north of Iceland',
      credit: 'Prototype by SNDR. Photography: the owner\'s own published images (nollur.is, Vrbo and Expedia galleries; photographs by Reto Kuhn). Facts and quoted copy from nollur.is.',
    },
    cursor: { view: 'View', book: 'Write' },
    loading: 'Loading',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },
  de: {
    htmlLang: 'de',
    docTitle: 'Nollur · Neun Häuser am Eyjafjörður, Nordisland',
    switchLabel: 'English',
    nav: [
      { id: 'houses', label: 'Die Häuser' },
      { id: 'materials', label: 'Die Materialien' },
      { id: 'farm', label: 'Der Hof' },
      { id: 'story', label: 'Die Geschichte' },
      { id: 'contact', label: 'Schreiben Sie uns' },
    ],
    menuCaption: 'Nordlichter über Akureyri, von Hrafnabjörg aus',
    menuWrite: 'Schreiben Sie uns',
    hero: {
      kicker: 'Neun Häuser (Eyjafjörður, Nordisland)',
      sub: 'Zwei Villen gegenüber von Akureyri, drei Häuser am Ufer in Grenivík und vier auf dem Hof Nollur. Ein Familienunternehmen, ein Fjord.',
      copyright: '© Nollur ehf. · Fotografien Reto Kuhn',
      rot: [{ id: 'story', label: 'Geschichte' }, { id: 'houses', label: 'Häuser' }],
      spot: { glass: 'Glas', walnut: 'Walnuss', shale: 'Schiefer', revox: 'ReVoX' },
    },
    arrival: {
      alt: 'Durch die Glaswand von Hrafnabjörg über das Wasser nach Akureyri',
      spec: ['Hrafnabjörg', 'gegenüber Akureyri', '2006'],
      cursor: 'Ansehen',
    },
    statement: {
      lines: ['Zwei Villen gegenüber der Stadt,', 'drei Häuser am Ufer,', 'vier auf dem Hof Nollur:', 'ein Fjord, neun Schlüssel.'],
      emIndex: 1,
      emText: 'am Ufer,',
      emBefore: 'drei Häuser ',
      body: 'Wunderbare Ferienhäuser und Ferienwohnungen auf dem Hof Nollur am Eyjafjörður, eine exklusive Villa direkt gegenüber von Akureyri, eine Villa am Stadtrand von Akureyri am Osthang des Eyjafjörður und ein geräumiges Haus direkt am Meer in Grenivík.',
    },
    quote: {
      text: 'Die Villa wird von Prominenten gemietet, aber auch von anderen Gästen, die die Lage und den hohen Standard des Hauses schätzen.',
      attribution: 'In ihren eigenen Worten, über Hrafnabjörg',
      alt1: 'Ein roter Sessel und eine ReVoX-Säule an der Glaswand, dahinter der Fjord',
      alt2: 'Eine Badewanne mit der Stadt im Fenster',
    },
    places: {
      akureyri: { name: 'Akureyri, über das Wasser', sub: 'Zwei Villen', plate: ['65°41´N', 'ÜBER DAS WASSER', '2 VILLEN'] },
      grenivik: { name: 'Grenivík, am Ufer', sub: 'Drei Häuser', plate: ['65°57´N', 'DAS UFER', '3 HÄUSER'] },
      nollur: { name: 'Nollur, der Hof', sub: 'Vier Häuser', plate: ['65°52´N', 'DER HOF', '4 HÄUSER'] },
      cta: 'Anfragen',
      units: { m2: 'm²', beds: 'SZ', bath: 'Bad', sleeps: 'Pers.', rating: 'auf Vrbo' },
    },
    farmNote: {
      kicker: 'Wo liegt Nollur',
      body: 'Nollur ist ein Hof am Eyjafjörður, 30 Kilometer nördlich von Akureyri, nur ein kurzes Stück von der berühmten Kirche von Laufás, was auf Isländisch Blätterhügel bedeutet. Der Name Nollur kommt von der Lage des Hofes auf einem Felshügel. Diese Felsen sind von der Strasse aus nicht zu sehen, wohl aber vom Meer.',
    },
    materials: {
      rail: 'Die Materialien ✳ in ihren Worten',
      items: [
        { title: 'Walnuss', body: 'Ein Kingsize-Bett aus Walnuss in Kaldbakur; Eiche, Walnuss, Buche und Ahorn im Loft Fnjóská.', alt: 'Eine Walnusssäule vor dem Glas in Hrafnabjörg' },
        { title: 'Schiefer', body: 'Hrafnabjörg wurde mit Walnuss, Schiefer und Glas ausgebaut; die Bäder auf dem Hof sind aus schwarzem Stein, die Böden in Súlur aus Schiefer.', alt: 'Schieferverkleidung, nah' },
        { title: 'Glas', body: 'Die grossen Fenster erlauben einen unverstellten Blick auf den Fjord und das Wetter. Im Winter lassen sich die Nordlichter beobachten, ohne das Haus zu verlassen.', alt: 'Die Glasecke der Villa spiegelt den Himmel' },
        { title: 'ReVoX', body: 'ReVoX-Audioanlage in Hrafnabjörg; in Laugaland eine audiophile Stereoanlage mit einer Bibliothek von über 20 000 Titeln.', alt: 'Ein roter Sessel neben einer ReVoX-Säule' },
      ],
    },
    farm: {
      title: 'Nollur',
      titleTail: ', der Hof auf dem Felsen',
      body: 'Vier Häuser auf einem Hügel über dem Fjord, 30 Kilometer nördlich von Akureyri. Kaldbakur mit seinem 60 m² Raum zum Wasser und einem Hot Tub unter dem Dach; das Loft Fnjóská für zwei; Krýsuvík und Súlur, vom Schweizer Architekten Roland Burkard entworfen und 2009 fertiggestellt, geheizt mit natürlichem Heisswasser.',
      caps: ['Kaldbakur, die Terrasse', 'Krýsuvík in der Dämmerung', 'Fnjóská, das Loft'],
      alts: ['Terrasse und versenkter Hot Tub in Kaldbakur', 'Krýsuvík in der Dämmerung mit blau erleuchteten Fenstern', 'Das Walnuss-Wohnzimmer des Lofts Fnjóská'],
    },
    lights: {
      kicker: 'Von der Villa aus, im Winter',
      before: 'Im Winter lassen sich die Nordlichter beobachten, ohne das ',
      travel: 'Haus',
      after: ' zu verlassen.',
      alt: 'Nordlichter über den Lichtern von Akureyri, von Hrafnabjörg über das Wasser gesehen',
    },
    story: {
      title: 'Gebaut, gekauft, ausgebaut',
      credit: 'Fotografien von Reto Kuhn',
      rows: [
        { year: '2006', text: 'Hrafnabjörg von der isländischen Architektin Fanney Hauksdóttir gebaut, gegenüber Akureyri' },
        { year: '2009', text: 'Súlur und Krýsuvík auf dem Hof fertiggestellt, entworfen von Roland Burkard' },
        { year: '2014', text: 'Leifsstaðir im Oktober erworben, am Osthang' },
        { year: '2015', text: 'Leifsstaðir bis Juli renoviert, Antiquitäten und seltene Stücke erhalten' },
        { year: '2025', text: 'Laugaland auf dem alten Grundstück in Grenivík fertiggestellt' },
      ],
      award: 'Nollur ehf. ist ein Unternehmen der Esja Holding AG in der Schweiz und ein zu 100 % privates Familienunternehmen. Gäste bewerten Hrafnabjörg mit 9,8 aus 268 Bewertungen auf Vrbo und Leifsstaðir mit 9,8 aus 210.',
      alt: 'Hrafnabjörg vor hellem Himmel',
    },
    grenivik: { kicker: '(Das Ufer in Grenivík)', alt: 'Der Rasen von Vallholt läuft in Grenivík zum Meer hinunter' },
    cierre: {
      a: 'Neun Schlüssel,',
      b: 'ein Fjord.',
      sub: 'Schreiben Sie uns auf Deutsch oder Englisch. Jedes Haus hat eine Live-Kamera, Sie können also schauen, bevor Sie fragen.',
      cta: 'Schreiben Sie uns',
      cta2: 'die Live-Kameras',
    },
    footer: {
      h2a: 'Nollur,',
      h2b: 'Eyjafjörður',
      write: 'Schreiben',
      cameras: 'Live-Kameras',
      camerasLabel: 'camserver.nollur.is',
      panorama: '360°-Panorama',
      panoramaLabel: 'Der Fjord von oben',
      find: 'Anfahrt',
      places: ['Hrafnabjörg und Leifsstaðir, gegenüber und oberhalb von Akureyri', 'Vallholt, Laugaland und Bakkabúð, am Ufer in Grenivík', 'Kaldbakur, Fnjóská, Krýsuvík und Súlur, auf dem Hof Nollur, 30 km nördlich von Akureyri'],
      cornerA: 'Nollur ehf.',
      cornerB: 'Villen und Häuser im Norden Islands',
      credit: 'Prototyp von SNDR. Fotografie: die eigenen veröffentlichten Bilder des Eigentümers (nollur.is, Vrbo- und Expedia-Galerien; Fotografien von Reto Kuhn). Fakten und Zitate von nollur.is.',
    },
    cursor: { view: 'Ansehen', book: 'Schreiben' },
    loading: 'Lädt',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schliessen',
  },
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Nollur',
  legalName: 'Nollur ehf.',
  url: 'https://www.nollur.is',
  email: 'info@nollur.is',
  description: 'Nine holiday villas and houses on Eyjafjörður in North Iceland: two villas opposite Akureyri, three houses on the shore at Grenivík and four on the Nollur farm.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Nollur',
    addressLocality: 'Eyjafjörður',
    addressRegion: 'Norðurland eystra',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.8697, longitude: -18.0766 },
  numberOfRooms: 9,
  image: 'https://www.nollur.is/wp-content/uploads/2020/06/unbenannt-2382-scaled.jpg',
  availableLanguage: ['en', 'de'],
}
