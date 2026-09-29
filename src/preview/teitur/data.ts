import type { PreviewCompany } from '../company-types'

/* Teitur Jónasson ehf., Dalvegur 22, 201 Kópavogur (kt. 520273-0349).
   Design: the Premier Limo structure (inspiration image, anydesign analysis in _docs/teitur-build/design.md)
   on the Valecampus motion system (sndr-teardowns PR #4), tailored to Teitur.

   EVERY FACT BELOW IS THEIRS OR A DATED PUBLIC SOURCE. Read 2026-09-29:
   [W]  teitur.is (Icelandic pages: /, /flotinn/, /flotinn/rutur/, /myndir/, /um-okkur/, /um-okkur/ferdaoryggi/, /um-okkur/umhverfismal/)
   [E]  teitur.is/en (English pages)
   [F]  teitur.is/flotinn/ and the eight model pages under it (model, seats, amenities)
   [D]  _docs/large-candidates-2026-09-29/REPORT-B.md section B1 (measured defects, sources T01 to T27)
   Where their text has a typo it is corrected in the copy below and listed in TEITUR-BUILD-2026-09-29.md.
   Nothing here states a price, a response time, a fleet total or an award: their site contradicts itself on the
   fleet ("about 40" and "over 100") and on the seat range ("9 to 69" and "9 to 72"), so neither number is used. */

export type Lang = 'is' | 'en'
export type Tab = 'day' | 'multi' | 'regular'

const BASE = import.meta.env.BASE_URL
export const img = (f: string) => `${BASE}teitur/${f}.webp`
export const brand = (f: string) => `${BASE}teitur/brand/${f}`

export const URLS = {
  site: 'https://www.teitur.is',
  phone: '+3545152700',
  phoneShow: '515\u00A02700',
  phoneIntl: '+354\u00A0515\u00A02700',
  email: 'info@teitur.is', // [D] T26, published by the Ferðalag directory; their own page hides the address behind JavaScript
} as const

/* ------------------------------------------------------------------ routes */
export type View = 'home' | 'request' | 'agents' | 'dashboard'
const ROOT = '/preview/teitur'
export const PATHS: Record<Lang, Record<View, string>> = {
  is: { home: ROOT, request: `${ROOT}/beidni`, agents: `${ROOT}/ferdaskrifstofur`, dashboard: `${ROOT}/stjornbord` },
  en: { home: `${ROOT}/en`, request: `${ROOT}/en/request`, agents: `${ROOT}/en/agents`, dashboard: `${ROOT}/en/dashboard` },
}
export function parseRoute(pathname: string): { lang: Lang; view: View } {
  const p = pathname.replace(/\/+$/, '')
  const lang: Lang = /\/preview\/teitur\/en(\/|$)/.test(p) ? 'en' : 'is'
  for (const v of ['request', 'agents', 'dashboard'] as const) if (p === PATHS[lang][v]) return { lang, view: v }
  return { lang, view: 'home' }
}

/* ------------------------------------------------------------------ fleet [F]
   Model, seats ("33+1" as printed) and the amenity tags as printed on each model page.
   Photographs are the ones on the same model page. The tag "Belti" (seat belts) is absent from the 51+1 Scania
   listing although their text says every vehicle has belts: shown as listed, flagged in the report. */
export type Amenity = 'wc' | 'tv' | 'wifi' | 'ac' | 'belt'
export type Bus = {
  id: string; name: string; seats: string; n: number; tags: Amenity[]; f: string; w: number; h: number
  alt: Record<Lang, string>
}
export const FLEET: Bus[] = [
  { id: 'sprinter', name: 'Mercedes Benz Sprinter', seats: '19+1', n: 19, tags: ['tv', 'wifi', 'ac', 'belt'], f: 'bus-sprinter', w: 1200, h: 797, alt: { is: 'Hvítur Mercedes Benz Sprinter hópferðabíll', en: 'A white Mercedes Benz Sprinter minibus' } },
  { id: 'tourismo', name: 'Mercedes Bens Tourismo', seats: '33+1', n: 33, tags: ['wc', 'tv', 'ac', 'belt'], f: 'bus-tourismo', w: 1200, h: 900, alt: { is: 'Hvítur Mercedes Tourismo á bílastæði við höfn', en: 'A white Mercedes Tourismo coach on a harbour car park' } },
  { id: 'mb-vip', name: 'Mercedes Benz VIP', seats: '49+1', n: 49, tags: ['wc', 'tv', 'wifi', 'ac', 'belt'], f: 'bus-tourismo-vip', w: 1200, h: 900, alt: { is: 'Hvítur Mercedes Benz hópferðabíll við strandveg', en: 'A white Mercedes Benz coach on a coastal road' } },
  { id: 'scania49', name: 'Scania Touring', seats: '49+1', n: 49, tags: ['wc', 'tv', 'wifi', 'ac', 'belt'], f: 'bus-scania49', w: 1200, h: 675, alt: { is: 'Hvítur Scania Touring með fjöll í bakgrunni', en: 'A white Scania Touring with mountains behind' } },
  { id: 'scania-vip', name: 'Scania Touring VIP', seats: '49+1', n: 49, tags: ['wc', 'tv', 'wifi', 'ac', 'belt'], f: 'bus-scania-vip', w: 1000, h: 1000, alt: { is: 'Scania Touring VIP við sjóinn í kvöldsól', en: 'A Scania Touring VIP by the sea in evening light' } },
  { id: 'setra-vip', name: 'Setra VIP', seats: '49+1', n: 49, tags: ['wc', 'tv', 'wifi', 'ac', 'belt'], f: 'bus-setra', w: 1200, h: 900, alt: { is: 'Setra VIP hópferðabíll á bílastæði', en: 'A Setra VIP coach on a car park' } },
  { id: 'scania51', name: 'Scania Touring', seats: '51+1', n: 51, tags: ['tv', 'wifi', 'ac'], f: 'bus-scania51', w: 1032, h: 581, alt: { is: 'Scania Touring á bílastæði við Hörpu', en: 'A Scania Touring on a car park by Harpa' } },
  { id: 'scania57', name: 'Scania Touring', seats: '57+1', n: 57, tags: ['wc', 'tv', 'wifi', 'ac', 'belt'], f: 'bus-scania57', w: 1400, h: 788, alt: { is: 'Stór hvítur Scania Touring hópferðabíll', en: 'A large white Scania Touring coach' } },
]
export type SizeFilter = 'all' | 'small' | 'mid' | 'large'
export const sizeOf = (b: Bus): SizeFilter => (b.n <= 20 ? 'small' : b.n <= 50 ? 'mid' : 'large')

/* ------------------------------------------------------------------ routes as request templates
   Charter templates, not tours Teitur sells. Coordinates are projected from Natural Earth 50m (public domain);
   x = (lon + 25) * cos(65deg) * 100, y = (67 - lat) * 100. */
export const ICELAND_D =
  'M400 77 405 78 412 74 424 64 429 62 440 62 426 72 418 90 427 96 432 94 434 95 435 98 436 110 429 122 430 124 433 124 448 121 451 132 445 142 452 137 458 136 468 138 472 141 474 147 479 145 481 148 479 160 473 165 477 171 480 172 480 176 475 181 484 188 482 196 471 201 471 214 463 226 459 229 449 225 449 232 445 236 447 242 447 246 442 255 438 258 422 270 412 270 387 282 378 289 361 308 353 313 341 316 304 329 299 336 301 341 298 346 292 350 285 347 286 353 283 355 268 359 243 356 221 346 203 344 190 331 191 325 196 324 194 319 186 326 184 326 181 323 180 321 174 320 163 311 162 309 165 307 163 306 159 306 150 314 99 317 95 298 97 292 99 292 105 301 119 296 124 293 132 282 141 265 149 262 142 260 129 269 125 269 131 261 128 261 127 259 129 249 144 237 141 235 130 244 122 247 116 243 113 238 116 227 107 221 96 221 70 218 50 226 45 222 41 214 42 210 45 208 55 209 70 205 76 200 80 203 89 200 93 195 101 197 131 195 135 189 136 181 125 187 110 184 105 180 107 177 120 166 133 158 133 155 127 151 114 152 110 146 100 143 92 145 89 142 46 159 33 151 23 150 22 147 28 140 32 139 48 146 42 138 42 131 38 124 38 122 46 123 58 132 65 131 72 125 55 122 49 115 53 112 62 112 52 98 53 93 66 98 59 89 61 88 62 84 65 82 72 83 82 91 84 102 88 101 92 102 96 96 99 97 101 102 101 113 103 109 108 109 108 93 93 85 87 79 90 75 106 73 99 70 98 66 86 68 80 66 82 62 89 56 103 55 109 57 120 69 128 74 143 91 152 97 151 101 147 103 153 106 156 110 153 126 150 130 141 128 143 132 149 136 151 139 150 142 153 141 154 142 151 153 156 154 159 158 164 173 172 143 177 136 183 134 188 142 192 143 196 128 196 97 199 92 203 90 210 95 226 120 233 123 235 119 234 102 237 92 245 90 257 82 260 82 266 86 277 104 284 112 290 127 292 117 283 91 283 84 300 86 315 104 332 80 335 80 345 87 360 80 362 72 358 55 360 52 370 48 381 49 392 64 393 71Z'

export const PLACES: Record<string, [number, number]> = {
  kopavogur: [131, 289], thingvellir: [164, 274], geysir: [199, 269], gullfoss: [206, 267], selfoss: [169, 307],
  seljalandsfoss: [212, 338], skogafoss: [232, 347], vik: [253, 358], borgarnes: [130, 246], arnarstapi: [58, 223],
  kef: [101, 301], blaa: [108, 312], blonduos: [199, 134], akureyri: [292, 131], myvatn: [339, 140],
}

export type RouteDef = {
  id: string
  tab: Tab
  name: Record<Lang, string>
  stops: Record<Lang, string[]>
  path: (keyof typeof PLACES)[]
  view: [number, number, number, number] // x, y, w, h of the tile's map crop
}
export const ROUTES: RouteDef[] = [
  { id: 'gullni', tab: 'day', name: { is: 'Gullni hringurinn', en: 'The Golden Circle' }, stops: { is: ['Þingvellir', 'Geysir', 'Gullfoss'], en: ['Thingvellir', 'Geysir', 'Gullfoss'] }, path: ['kopavogur', 'thingvellir', 'geysir', 'gullfoss'], view: [112, 200, 130, 182] },
  { id: 'sudur', tab: 'day', name: { is: 'Suðurströndin', en: 'The South Coast' }, stops: { is: ['Seljalandsfoss', 'Skógafoss', 'Vík'], en: ['Seljalandsfoss', 'Skógafoss', 'Vík'] }, path: ['kopavogur', 'selfoss', 'seljalandsfoss', 'skogafoss', 'vik'], view: [112, 236, 150, 210] },
  { id: 'snae', tab: 'day', name: { is: 'Snæfellsnes', en: 'Snæfellsnes' }, stops: { is: ['Borgarnes', 'Arnarstapi'], en: ['Borgarnes', 'Arnarstapi'] }, path: ['kopavogur', 'borgarnes', 'arnarstapi'], view: [26, 176, 130, 182] },
  { id: 'kef', tab: 'day', name: { is: 'Keflavík og Bláa lónið', en: 'Keflavík and the Blue Lagoon' }, stops: { is: ['Keflavíkurflugvöllur', 'Bláa lónið'], en: ['Keflavík Airport', 'The Blue Lagoon'] }, path: ['kopavogur', 'blaa', 'kef'], view: [56, 240, 110, 154] },
  { id: 'nord', tab: 'multi', name: { is: 'Norðurland', en: 'North Iceland' }, stops: { is: ['Blönduós', 'Akureyri', 'Mývatn'], en: ['Blönduós', 'Akureyri', 'Mývatn'] }, path: ['kopavogur', 'borgarnes', 'blonduos', 'akureyri', 'myvatn'], view: [96, 60, 264, 370] },
]

/* ------------------------------------------------------------------ the service cards [W] */
export const SERVICE_IMG = {
  groups: { f: 'foss', w: 960, h: 540 },
  hire: { f: 'gulur-vetur', w: 1181, h: 761 },
  special: { f: 'bus-sprinter', w: 1200, h: 797 },
} as const

/* ------------------------------------------------------------------ hero slideshow: their own photographs, IMG_2016/2018 files */
export type Slide = { a: string; wa: number; b: string; w: number; h: number; pos: string; alt: Record<Lang, string> }
export const HERO_SLIDES: Slide[] = [
  { a: 'hero-1200', wa: 1200, b: 'hero-2400', w: 2400, h: 1350, pos: '52% 58%', alt: { is: 'Hvítur hópferðabíll frá Teiti á vegi undir dökkum skýjum', en: 'A white Teitur coach on a road beneath dark clouds' } },
  { a: 'slide-jokull-1000', wa: 1000, b: 'slide-jokull-1920', w: 1920, h: 1280, pos: '50% 62%', alt: { is: 'Hópferðabíll frá Teiti með snævi þakin fjöll í bakgrunni', en: 'A Teitur coach with snow-covered mountains behind' } },
  { a: 'slide-foss-1100', wa: 1100, b: 'slide-foss-2200', w: 2200, h: 1650, pos: '50% 55%', alt: { is: 'Hópferðabíll frá Teiti á malarvegi við foss í grænni hlíð', en: 'A Teitur coach on a gravel road by a waterfall on a green hillside' } },
  { a: 'slide-vetur-1200', wa: 1200, b: 'slide-vetur-2400', w: 2400, h: 1350, pos: '58% 55%', alt: { is: 'Hópferðabíll frá Teiti í snjó með íslenska hesta í forgrunni', en: 'A Teitur coach in snow with Icelandic horses in the foreground' } },
]
export const HERO_UI = {
  is: { label: 'Myndir úr ferðum Teits', pause: 'Stöðva myndaskipti', play: 'Hefja myndaskipti', go: (n: number, t: number) => `Mynd ${n} af ${t}` },
  en: { label: 'Photographs from Teitur’s trips', pause: 'Pause the slideshow', play: 'Play the slideshow', go: (n: number, t: number) => `Photo ${n} of ${t}` },
} as const

/* ------------------------------------------------------------------ language: chrome, home and request copy */
type Copy = {
  htmlLang: string
  title: string
  description: string
  skip: string
  nav: {
    menu: string; close: string; services: string; fleet: string; about: string; agents: string; request: string; call: string; langLabel: string; home: string
    serviceItems: { groups: string; hire: string; special: string; routes: string }
    aboutItems: { story: string; safety: string; contact: string }
  }
  hero: { eyebrow: string; h1: string; lead: string; fleet: string; scroll: string }
  cardHead: string
  home: {
    s1: { title: string; groups: { chip: string; text: string; cta: string }; hire: { chip: string; text: string; cta: string }; special: { chip: string; text: string; cta: string }
      statement: string; cta: string
      uses: { head: string; items: { t: string; p: string }[] } }
    s2: { title: string; lead: string; count: (n: number) => string; filters: Record<SizeFilter, string>; seats: string; pick: string; open: string; prev: string; next: string; legend: string; empty: string }
    s3: { title: string; p: string; note: string; cta: string; tab: Record<Tab, string>; use: string }
    s4: { title: string; lead: string; addr: string; factsHead: string; facts: { t: string; p: string }[]; timeline: { y: string; t: string; p: string }[] }
    s5: { title: string; p: string; cta: string; points: string[] }
    close: { h: string; p: string; book: string; call: string; addrHead: string; addr1: string; addr2: string }
  }
  amenity: Record<Amenity, string>
  footer: { services: string; company: string; contact: string; agentsDash: string; note: string }
}

export const T: Record<Lang, Copy> = {
  is: {
    htmlLang: 'is',
    title: 'Teitur Hópferðir | Rútur með bílstjóra frá 1963, Kópavogi',
    description: 'Frumgerð að nýjum vef Teits Jónassonar ehf.: beiðni um rútu með bílstjóra á íslensku og ensku, flotinn og leiðir. Fjölskyldufyrirtæki í Kópavogi frá 1963.',
    skip: 'Fara í efni',
    nav: {
      menu: 'Valmynd', close: 'Loka', services: 'Þjónusta', fleet: 'Flotinn', about: 'Um okkur', agents: 'Fyrir ferðaskrifstofur', request: 'Biðja um rútu', call: 'Hringja', langLabel: 'Tungumál', home: 'Teitur Jónasson, forsíða',
      serviceItems: { groups: 'Ferðahópar', hire: 'Rútuleiga með bílstjóra', special: 'Sérhæfð akstursþjónusta', routes: 'Leiðir' },
      aboutItems: { story: 'Saga fyrirtækisins', safety: 'Öryggi og gæði', contact: 'Hafa samband' },
    },
    hero: {
      eyebrow: 'Teitur Hópferðir · frá 1963',
      h1: 'Láttu okkur um aksturinn fyrir hópinn þinn',
      lead: 'Allar stærðir hópferðabíla, með bílstjórum sem hafa mikla reynslu á vegum landsins.',
      fleet: 'Skoða flotann', scroll: 'Skruna niður',
    },
    cardHead: 'Biðja um rútu',
    home: {
      s1: {
        title: 'Þjónusta',
        groups: { chip: 'Ferðahópar', text: 'Íslensk náttúra er engri lík. Láttu okkur sýna þér hana.', cta: 'Biðja um rútu' },
        hire: { chip: 'Rútur með bílstjóra', text: 'Hjá okkur getur þú fengið frábærar rútur með bílstjóra.', cta: 'Skoða flotann' },
        special: { chip: 'Sérhæfð akstursþjónusta', text: 'Ferðaþjónusta fatlaðra og aldraðra frá árinu 2020, á nýlegum bílum með öllum helstu tækni- og öryggisbúnaði.', cta: 'Hringja í 515\u00A02700' },
        statement: 'Reynsla okkar nær allt aftur til 1963 sem gerir okkur að einu af elstu rútufyrirtækjum landsins.',
        cta: 'Biðja um rútu',
        uses: {
          head: 'Hópar sem við keyrum',
          items: [
            { t: 'Hópefli', p: 'Góð liðsheild dregur fram það besta í hverjum hóp. Við erum með réttu rútuna fyrir hópeflisferðina.' },
            { t: 'Íþróttafélög', p: 'Í gegnum árin hefur Teitur ekið fyrir öll helstu íþróttafélög á landinu. Við ökum til sigurs.' },
            { t: 'Frístundavagnar og starfsmannavagnar', p: 'Strætisvagnarnir okkar henta vel undir fjölbreyttan akstur, til dæmis frístundavagna, starfsmannavagna og í partýskutlið.' },
          ],
        },
      },
      s2: {
        title: 'Flotinn',
        lead: 'Öryggi ykkar er í fyrirrúmi hjá okkur. Í flestum bílum er boðið upp á frítt WiFi.',
        count: (n) => `${n} ${n === 1 ? 'gerð' : 'gerðir'}`,
        filters: { all: 'Allar', small: 'Til 20 sæta', mid: '21 til 50', large: '51 og fleiri' },
        seats: 'sæti', pick: 'Biðja um þessa gerð', open: 'Biðja um rútu', prev: 'Fyrri gerðir', next: 'Næstu gerðir',
        legend: 'Sætafjöldi er eins og hann er skráður á flotasíðu Teits.',
        empty: 'Engin gerð í þessum flokki.',
      },
      s3: {
        title: 'Leiðir',
        p: 'Veldu leið til að byrja beiðnina. Þetta eru sniðmát fyrir rútu með bílstjóra, ekki tilbúnar ferðir: þú breytir stoppum, dagsetningu og fjölda að vild.',
        note: 'Kortið er teikning af leiðinni, ekki ferðaáætlun.',
        cta: 'Opna beiðni',
        tab: { day: 'Dagsferð', multi: 'Fleiri dagar', regular: 'Reglubundinn akstur' },
        use: 'Nota leiðina',
      },
      s4: {
        title: 'Um okkur',
        lead: 'Fjölskyldufyrirtæki í Kópavogi frá 1963.',
        addr: 'Höfuðstöðvar eru við Dalveg 22: skrifstofur, verkstæði og þvottastöð.',
        factsHead: 'Öryggi og gæði',
        facts: [
          { t: 'Öryggisbelti í öllum bílum', p: 'Allar rútur og strætisvagnar Teits eru með öryggisbeltum.' },
          { t: 'Eftirlit á eigin verkstæði', p: 'Nær allt viðhald og eftirlit fer fram á verkstæði Teits, þar sem sex manns starfa.' },
          { t: 'Námskeið á hverju ári', p: 'Öryggisnámskeið á hverju ári og skyndihjálparnámskeið annað hvert ár fyrir bílstjóra og annað starfsfólk.' },
        ],
        timeline: [
          { y: '1963', t: 'Fyrirtækið stofnað', p: 'Teitur Jónasson ehf. var stofnað árið 1963 og hefur frá upphafi verið starfrækt sem fjölskyldufyrirtæki í Kópavogi.' },
          { y: '1975', t: 'Áætlunarferðir í Bláfjöll', p: 'Teitur hefur séð um áætlunarferðir frá höfuðborgarsvæðinu í Bláfjöll frá árinu 1975.' },
          { y: '1991', t: 'Akstur með aldraða í Sunnuhlíð', p: 'Fyrirtækið hefur annast akstur með aldraða í Sunnuhlíð frá árinu 1991.' },
          { y: '1995 til 2006', t: 'Varnarliðið á Keflavíkurflugvelli', p: 'Á árabilinu 1995 til 2006 sinnti Teitur starfsmanna-, skólabifreiða- og strætisvagnaakstri fyrir Varnarliðið á Keflavíkurflugvelli.' },
          { y: '1996', t: 'Kolefnisjöfnun', p: 'Síðan 1996 höfum við unnið að því að kolefnisjafna fyrirtækið okkar.' },
          { y: '2020', t: 'Sérhæfð akstursþjónusta', p: 'Teitur hefur séð um ferðaþjónustu fatlaðra og aldraðra síðan 2020. Þjónustan byggir á eldri grunni fyrirtækisins Fer ehf., sem sá um hana í áratugi til ársins 2015.' },
          { y: 'Um árabil', t: 'Strætisvagnar og skólaakstur', p: 'Fyrirtækið hefur um árabil sinnt strætisvagnaþjónustu í Kópavogi, á Kjalarnesi og til Akraness. Það annast auk þess viðamikinn akstur skólabíla fyrir Kópavogsbæ.' },
        ],
      },
      s5: {
        title: 'Fyrir ferðaskrifstofur',
        p: 'Skipuleggur þú ferðir fyrir aðra? Beiðnir frá ferðaskrifstofum þurfa sinn eigin farveg: skipuleggjandinn er vistaður einu sinni, margar beiðnir fara í röð og staða hverrar beiðni sést á einum stað.',
        cta: 'Skoða farveginn',
        points: ['Skipuleggjandi vistaður einu sinni', 'Margar beiðnir í röð', 'Staða hverrar beiðni á einum stað'],
      },
      close: {
        h: 'Hafðu samband ef þig vantar rútu.', p: 'Sendu beiðni hér eða hringdu. Beiðnin er háð staðfestingu Teits.',
        book: 'Biðja um rútu', call: 'Hringja í 515\u00A02700', addrHead: 'Teitur Jónasson ehf.', addr1: 'Dalvegi 22', addr2: '201 Kópavogi',
      },
    },
    amenity: { wc: 'Salerni', tv: 'Sjónvarp', wifi: 'WiFi', ac: 'Loftkæling', belt: 'Öryggisbelti' },
    footer: { services: 'Þjónusta', company: 'Fyrirtækið', contact: 'Hafa samband', agentsDash: 'Beiðnayfirlit (sýnishorn)', note: 'Frumgerð frá SNDR Studio.' },
  },
  en: {
    htmlLang: 'en',
    title: 'Teitur Travel | Coaches with drivers since 1963, Kópavogur',
    description: 'A prototype for the new Teitur Jónasson ehf. website: request a coach with a driver in Icelandic or English, the fleet and routes. A family business in Kópavogur since 1963.',
    skip: 'Skip to content',
    nav: {
      menu: 'Menu', close: 'Close', services: 'Services', fleet: 'Fleet', about: 'About us', agents: 'For travel agencies', request: 'Request a coach', call: 'Call', langLabel: 'Language', home: 'Teitur Travel, home',
      serviceItems: { groups: 'Group travel', hire: 'Coach hire with driver', special: 'Specialised transport', routes: 'Routes' },
      aboutItems: { story: 'Our story', safety: 'Safety and quality', contact: 'Contact' },
    },
    hero: {
      eyebrow: 'Teitur Travel · since 1963',
      h1: 'Your reliable partner in Iceland',
      lead: 'Coaches of every size, with drivers who have long experience of Iceland’s roads.',
      fleet: 'See the fleet', scroll: 'Scroll down',
    },
    cardHead: 'Request a coach',
    home: {
      s1: {
        title: 'Services',
        groups: { chip: 'Group travel', text: 'Icelandic nature is like no other. Let us show it to you.', cta: 'Request a coach' },
        hire: { chip: 'Coaches with drivers', text: 'Tour bus, shuttle bus, school bus and charter bus, and that is just the beginning of what we can offer you and your group.', cta: 'See the fleet' },
        special: { chip: 'Specialised transport', text: 'Travel service for disabled and elderly people since 2020, on newer vehicles with the main technical and safety equipment.', cta: 'Call 515\u00A02700' },
        statement: 'Our experience goes back to 1963, which makes us one of the oldest coach companies in the country.',
        cta: 'Request a coach',
        uses: {
          head: 'Groups we drive',
          items: [
            { t: 'Team building', p: 'A good team brings out the best in every group. We have the right coach for your team-building trip.' },
            { t: 'Sports clubs', p: 'Over the years Teitur has driven for all the main sports clubs in the country. We drive to victory.' },
            { t: 'After-school and staff shuttles', p: 'Our city buses suit many kinds of driving, for example after-school shuttles, staff shuttles and party shuttles.' },
          ],
        },
      },
      s2: {
        title: 'Fleet',
        lead: 'Safety comes first with us. In most of our coaches we offer free WiFi.',
        count: (n) => `${n} ${n === 1 ? 'model' : 'models'}`,
        filters: { all: 'All', small: 'Up to 20 seats', mid: '21 to 50', large: '51 and more' },
        seats: 'seats', pick: 'Request this model', open: 'Request a coach', prev: 'Previous models', next: 'Next models',
        legend: 'Seat numbers are as listed on Teitur’s fleet page.',
        empty: 'No model in this group.',
      },
      s3: {
        title: 'Routes',
        p: 'Pick a route to start your request. These are templates for a coach with a driver, not ready-made tours: you change stops, date and group size as you like.',
        note: 'The map is a sketch of the route, not an itinerary.',
        cta: 'Open the request',
        tab: { day: 'Day trip', multi: 'Several days', regular: 'Regular service' },
        use: 'Use this route',
      },
      s4: {
        title: 'About us',
        lead: 'A family business in Kópavogur since 1963.',
        addr: 'Our headquarters are at Dalvegur 22: offices, workshop and wash station.',
        factsHead: 'Safety and quality',
        facts: [
          { t: 'Seat belts in every vehicle', p: 'All Teitur coaches and city buses have seat belts.' },
          { t: 'Checked in our own workshop', p: 'Nearly all maintenance and inspection is done in Teitur’s own workshop, where six people work.' },
          { t: 'Training every year', p: 'A safety course every year and a first-aid course every other year for drivers and other staff.' },
        ],
        timeline: [
          { y: '1963', t: 'The company is founded', p: 'Teitur Jónasson ehf. was founded in 1963 and has run as a family business in Kópavogur from the start.' },
          { y: '1975', t: 'Scheduled trips to Bláfjöll', p: 'Teitur has run scheduled trips from the capital area to Bláfjöll since 1975.' },
          { y: '1991', t: 'Transport for the elderly at Sunnuhlíð', p: 'The company has driven elderly residents at Sunnuhlíð since 1991.' },
          { y: '1995 to 2006', t: 'The Defence Force at Keflavík Airport', p: 'From 1995 to 2006 Teitur ran staff, school and city bus transport for the Defence Force at Keflavík Airport.' },
          { y: '1996', t: 'Carbon offsetting', p: 'Since 1996 we have worked to offset the company’s carbon footprint.' },
          { y: '2020', t: 'Specialised transport', p: 'Teitur has run the travel service for disabled and elderly people since 2020. It builds on the older company Fer ehf., which ran it for decades until 2015.' },
          { y: 'For years', t: 'City buses and school transport', p: 'For years the company has run city bus services in Kópavogur, on Kjalarnes and to Akranes, and it does extensive school-bus driving for the municipality of Kópavogur.' },
        ],
      },
      s5: {
        title: 'For travel agencies',
        p: 'Do you plan trips for others? Requests from travel agencies need their own route: the organiser is saved once, many requests go in a row and the status of each request is in one place.',
        cta: 'See the route',
        points: ['The organiser saved once', 'Many requests in a row', 'The status of each request in one place'],
      },
      close: {
        h: 'Contact us if you need a coach.', p: 'Send a request here or call. The request is subject to Teitur’s confirmation.',
        book: 'Request a coach', call: 'Call 515\u00A02700', addrHead: 'Teitur Jónasson ehf.', addr1: 'Dalvegi 22', addr2: '201 Kópavogur',
      },
    },
    amenity: { wc: 'Toilet', tv: 'TV', wifi: 'WiFi', ac: 'Air conditioning', belt: 'Seat belts' },
    footer: { services: 'Services', company: 'The company', contact: 'Contact', agentsDash: 'Request overview (sample)', note: 'A prototype from SNDR Studio.' },
  },
}

/* ------------------------------------------------------------------ the request journey */
export const REQ = {
  is: {
    title: 'Biðja um rútu',
    lead: 'Segðu okkur frá ferðinni. Þetta er beiðni, háð staðfestingu Teits: ekkert er bundið fyrr en starfsmaður hefur svarað.',
    stepper: ['Ferðin', 'Þarfir', 'Tengiliður', 'Yfirlit'],
    tabs: { day: 'Dagsferð', multi: 'Fleiri dagar', regular: 'Reglubundinn akstur' } as Record<Tab, string>,
    tabHint: {
      day: 'Ein dagsetning, upphaf og endir sama dag.',
      multi: 'Veldu fyrsta og síðasta dag ferðarinnar.',
      regular: 'Skólar og starfsmenn: hvaða daga vikunnar og frá hvaða degi.',
    } as Record<Tab, string>,
    from: 'Brottfararstaður', fromPh: 'Hótel, heimilisfang eða staður',
    stops: 'Stopp á leiðinni', stopPh: (i: number) => `Stopp ${i}`, addStop: 'Bæta við stoppi', removeStop: 'Fjarlægja stopp',
    dest: 'Áfangastaður', destPh: 'Hvert á að fara?',
    date: { day: 'Dagsetning', multi: 'Dagsetningar', regular: 'Fyrsti dagur' } as Record<Tab, string>,
    datePh: { day: 'Veldu dag', multi: 'Veldu fyrsta og síðasta dag', regular: 'Veldu fyrsta dag' } as Record<Tab, string>,
    weekdays: 'Vikudagar', time: 'Brottfarartími', pax: 'Fjöldi farþega', paxHint: 'Ef hópurinn er stór getur þurft fleiri en einn bíl.',
    vehicle: 'Ósk um gerð', vehicleAny: 'Engin sérstök ósk',
    continue: 'Halda áfram', back: 'Til baka', next: 'Næsta skref',
    needs: {
      luggage: 'Farangur', luggageOpts: ['Handfarangur', 'Töskur', 'Mikill farangur, til dæmis skíði eða hljóðfæri'],
      equipment: 'Búnaður', access: 'Aðgengi', accessOpt: 'Bíll með rampi eða lyftu',
      note: 'Annað sem við þurfum að vita', notePh: 'Til dæmis hvar hópurinn hittist eða hvenær hann þarf að vera kominn.',
      warn: 'Skráðu ekki heilsufarsupplýsingar eða kennitölur hér.',
    },
    contact: {
      name: 'Nafn', org: 'Fyrirtæki, félag eða ferðaskrifstofa', orgHint: 'Má sleppa',
      email: 'Netfang', phone: 'Sími', consent: 'Ég vil að starfsmaður Teits hafi samband vegna þessarar beiðni.',
    },
    summary: 'Yfirlit', summaryLead: 'Farðu yfir beiðnina áður en hún er send.', edit: 'Breyta',
    send: 'Senda beiðni', sending: 'Sendi…',
    disclaimer: 'Beiðni, háð staðfestingu. Verð og laus pláss staðfestir starfsmaður Teits.',
    fallback: 'Viltu frekar hringja?', fallbackNote: 'Beint í síma Teits.',
    sample: 'Sýnishorn: þessi beiðni er ekki send neitt. Ekkert er vistað.',
    ack: {
      h: 'Beiðnin er tilbúin', p: 'Í þessu sýnishorni fer ekkert af stað. Í raunverulegri útgáfu fengi hópurinn staðfestingu á netfangið og starfsmaður Teits svaraði beiðninni.',
      urgent: 'Ef málið er brýnt, hringdu í', another: 'Fylla út nýja beiðni', copy: 'Afrita yfirlit', copied: 'Afritað',
    },
    err: {
      from: 'Skrifaðu hvar hópurinn er sóttur.', dest: 'Skrifaðu að minnsta kosti einn áfangastað.', date: 'Veldu dagsetningu.',
      dateRange: 'Veldu bæði fyrsta og síðasta dag.', pax: 'Sláðu inn fjölda farþega.', days: 'Veldu að minnsta kosti einn vikudag.',
      name: 'Skrifaðu nafnið þitt.', email: 'Netfangið virðist ekki rétt.', phone: 'Símanúmerið virðist ekki rétt.', consent: 'Hakaðu við til að halda áfram.',
    },
    dowShort: ['Má', 'Þr', 'Mi', 'Fi', 'Fö', 'La', 'Su'],
    dowLong: ['Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur', 'Sunnudagur'],
    months: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
    cal: { prev: 'Fyrri mánuður', next: 'Næsti mánuður', done: 'Lokið', clear: 'Hreinsa', hint: { day: 'Veldu dag', multi: 'Veldu fyrsta dag, svo síðasta dag', regular: 'Veldu fyrsta dag' } as Record<Tab, string>, nights: (n: number) => `${n} ${n === 1 ? 'dagur' : 'dagar'}` },
    presetOn: (n: string) => `Sniðmát: ${n}`, presetClear: 'Fjarlægja sniðmát',
    pickRoute: 'Eða byrjaðu á leið',
    sideHead: 'Beiðnin þín', sideEmpty: 'Fylltu út ferðina til að sjá yfirlitið.',
    agentLink: 'Ertu ferðaskrifstofa? Fyrir ferðaskrifstofur',
  },
  en: {
    title: 'Request a coach',
    lead: 'Tell us about the trip. This is a request, subject to Teitur’s confirmation: nothing is fixed until a member of staff has replied.',
    stepper: ['The trip', 'Needs', 'Contact', 'Summary'],
    tabs: { day: 'Day trip', multi: 'Several days', regular: 'Regular service' } as Record<Tab, string>,
    tabHint: {
      day: 'One date, start and finish the same day.',
      multi: 'Pick the first and the last day of the trip.',
      regular: 'Schools and staff: which weekdays and from which day.',
    } as Record<Tab, string>,
    from: 'Pick-up', fromPh: 'Hotel, address or place',
    stops: 'Stops on the way', stopPh: (i: number) => `Stop ${i}`, addStop: 'Add a stop', removeStop: 'Remove stop',
    dest: 'Destination', destPh: 'Where to?',
    date: { day: 'Date', multi: 'Dates', regular: 'First day' } as Record<Tab, string>,
    datePh: { day: 'Pick a day', multi: 'Pick the first and last day', regular: 'Pick the first day' } as Record<Tab, string>,
    weekdays: 'Weekdays', time: 'Departure time', pax: 'Passengers', paxHint: 'A large group may need more than one coach.',
    vehicle: 'Preferred model', vehicleAny: 'No preference',
    continue: 'Continue', back: 'Back', next: 'Next step',
    needs: {
      luggage: 'Luggage', luggageOpts: ['Hand luggage', 'Suitcases', 'A lot of luggage, for example skis or instruments'],
      equipment: 'Equipment', access: 'Access', accessOpt: 'A vehicle with a ramp or lift',
      note: 'Anything else we should know', notePh: 'For example where the group meets or when it has to arrive.',
      warn: 'Please do not enter health details or personal ID numbers here.',
    },
    contact: {
      name: 'Name', org: 'Company, club or travel agency', orgHint: 'Optional',
      email: 'Email', phone: 'Phone', consent: 'I would like a member of Teitur’s staff to contact me about this request.',
    },
    summary: 'Summary', summaryLead: 'Check the request before it is sent.', edit: 'Edit',
    send: 'Send request', sending: 'Sending…',
    disclaimer: 'A request, subject to confirmation. Price and availability are confirmed by Teitur’s staff.',
    fallback: 'Prefer to call?', fallbackNote: 'Straight to Teitur by phone.',
    sample: 'Sample: this request is not sent anywhere. Nothing is saved.',
    ack: {
      h: 'The request is ready', p: 'In this sample nothing is sent. In the real version the group would get a confirmation by email and a member of Teitur’s staff would answer the request.',
      urgent: 'If it is urgent, call', another: 'Start a new request', copy: 'Copy summary', copied: 'Copied',
    },
    err: {
      from: 'Write where the group is picked up.', dest: 'Write at least one destination.', date: 'Pick a date.',
      dateRange: 'Pick both the first and the last day.', pax: 'Enter the number of passengers.', days: 'Pick at least one weekday.',
      name: 'Write your name.', email: 'The email address does not look right.', phone: 'The phone number does not look right.', consent: 'Tick to continue.',
    },
    dowShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    dowLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    cal: { prev: 'Previous month', next: 'Next month', done: 'Done', clear: 'Clear', hint: { day: 'Pick a day', multi: 'Pick the first day, then the last day', regular: 'Pick the first day' } as Record<Tab, string>, nights: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}` },
    presetOn: (n: string) => `Template: ${n}`, presetClear: 'Remove template',
    pickRoute: 'Or start from a route',
    sideHead: 'Your request', sideEmpty: 'Fill in the trip to see the summary.',
    agentLink: 'Are you a travel agency? For travel agencies',
  },
} as const

/* ------------------------------------------------------------------ agents page and request queue (static designs) */
export const AGENTS = {
  is: {
    eyebrow: 'Hönnunarsýnishorn',
    h1: 'Fyrir ferðaskrifstofur og skipuleggjendur',
    lead: 'Skipuleggjandi sem sendir margar beiðnir þarf ekki að skrifa sömu upplýsingarnar aftur og aftur. Þetta er hönnun að farvegi sem Teitur getur mótað, ekki kerfi sem er í gangi.',
    sample: 'Sýnishorn: engin innskráning er virk og engir reikningar eru til.',
    tabs: ['Innskráning', 'Eftir innskráningu'],
    login: { h: 'Innskráning skipuleggjanda', email: 'Netfang', pw: 'Lykilorð', btn: 'Skrá inn', forgot: 'Gleymt lykilorð', request: 'Óska eftir aðgangi', disabled: 'Ekki virkt í sýnishorni' },
    inn: {
      h: 'Skipuleggjandi', org: 'Ferðaskrifstofa (dæmi)', saved: 'Vistað einu sinni', fields: [['Fyrirtæki', 'Dæmi ferðaskrifstofa ehf.'], ['Tengiliður', 'Sýnishorn Sýnisdóttir'], ['Netfang', 'sýnishorn@example.is'], ['Reikningsupplýsingar', 'Vistaðar við fyrstu beiðni']],
      listHead: 'Beiðnir þínar', rows: [['Gullni hringurinn, 28 farþegar', 'Beðið svars'], ['Suðurströndin, 46 farþegar', 'Staðfest'], ['Norðurland, 3 dagar, 20 farþegar', 'Í vinnslu']], newReq: 'Ný beiðni',
    },
    points: [
      ['Skipuleggjandi vistaður einu sinni', 'Fyrirtæki, tengiliður og reikningsupplýsingar fylgja hverri beiðni.'],
      ['Margar beiðnir í röð', 'Ferðir sem endurtaka sig afritast og breytast í stað þess að byrja upp á nýtt.'],
      ['Staða á einum stað', 'Hver beiðni er ný, í vinnslu, beðið svars eða staðfest.'],
    ],
    dash: 'Sjá hlið starfsmanns Teits (sýnishorn)', back: 'Til baka á forsíðu',
  },
  en: {
    eyebrow: 'Design sample',
    h1: 'For travel agencies and organisers',
    lead: 'An organiser who sends many requests should not have to write the same details again and again. This is a design for a route Teitur can shape, not a system that is running.',
    sample: 'Sample: no login is active and no accounts exist.',
    tabs: ['Login', 'After login'],
    login: { h: 'Organiser login', email: 'Email', pw: 'Password', btn: 'Log in', forgot: 'Forgot password', request: 'Request access', disabled: 'Not active in the sample' },
    inn: {
      h: 'Organiser', org: 'Travel agency (example)', saved: 'Saved once', fields: [['Company', 'Example Travel Ltd.'], ['Contact', 'Sample Person'], ['Email', 'sample@example.is'], ['Billing details', 'Saved with the first request']],
      listHead: 'Your requests', rows: [['Golden Circle, 28 passengers', 'Awaiting reply'], ['South Coast, 46 passengers', 'Confirmed'], ['North Iceland, 3 days, 20 passengers', 'In progress']], newReq: 'New request',
    },
    points: [
      ['The organiser saved once', 'Company, contact and billing details travel with every request.'],
      ['Many requests in a row', 'Trips that repeat are copied and edited instead of started from scratch.'],
      ['Status in one place', 'Each request is new, in progress, awaiting reply or confirmed.'],
    ],
    dash: 'See the Teitur staff side (sample)', back: 'Back to the home page',
  },
} as const

export type Status = 'new' | 'work' | 'wait' | 'done'
export const QUEUE = {
  is: {
    eyebrow: 'Hönnunarsýnishorn · hlið starfsmanns',
    h1: 'Beiðnir',
    lead: 'Svona gæti röðin litið út hjá starfsmanni Teits. Allar raðir hér eru sýnigögn.',
    sample: 'SÝNIGÖGN. Engin þessara beiðna er raunveruleg.',
    filters: { all: 'Allar', new: 'Nýjar', work: 'Í vinnslu', wait: 'Beðið svars', done: 'Staðfestar' } as Record<'all' | Status, string>,
    cols: { id: 'Númer', group: 'Hópur', trip: 'Ferð', date: 'Dagsetning', pax: 'Farþegar', src: 'Uppruni', owner: 'Umsjón', status: 'Staða' },
    src: { web: 'Vefur', agent: 'Ferðaskrifstofa' } as Record<'web' | 'agent', string>,
    detail: { h: 'Beiðni', organiser: 'Skipuleggjandi', reuse: 'Vistuð skipuleggjandaupplýsingar eru tiltækar fyrir næstu beiðni.', notes: 'Athugasemdir', none: 'Veldu beiðni í röðinni.' },
    back: 'Til baka á forsíðu', agents: 'Sjá farveg ferðaskrifstofa',
    status: { new: 'Ný', work: 'Í vinnslu', wait: 'Beðið svars', done: 'Staðfest' } as Record<Status, string>,
    rows: [
      { id: 'SÝNI-01', group: 'Sýnishópur A', trip: 'Gullni hringurinn', date: '12. okt.', pax: 32, src: 'web', owner: 'Starfsmaður A', status: 'new', note: 'Vantar brottfararstað.' },
      { id: 'SÝNI-02', group: 'Sýnishópur B', trip: 'Suðurströndin', date: '14. okt.', pax: 48, src: 'agent', owner: 'Starfsmaður B', status: 'work', note: 'Óskar eftir bíl með salerni.' },
      { id: 'SÝNI-03', group: 'Sýnishópur C', trip: 'Norðurland, 3 dagar', date: '20. til 22. okt.', pax: 19, src: 'agent', owner: 'Starfsmaður A', status: 'wait', note: 'Beðið eftir svari um gistingu bílstjóra.' },
      { id: 'SÝNI-04', group: 'Sýnishópur D', trip: 'Keflavík og Bláa lónið', date: '3. nóv.', pax: 52, src: 'web', owner: 'Starfsmaður C', status: 'done', note: 'Staðfest í síma.' },
      { id: 'SÝNI-05', group: 'Sýnishópur E', trip: 'Reglubundinn akstur, mán. til fös.', date: 'frá 5. nóv.', pax: 24, src: 'web', owner: 'Starfsmaður B', status: 'new', note: 'Athuga tímasetningar með skólanum.' },
    ],
  },
  en: {
    eyebrow: 'Design sample · staff side',
    h1: 'Requests',
    lead: 'This is how the queue could look for a member of Teitur’s staff. Every row here is sample data.',
    sample: 'SAMPLE DATA. None of these requests is real.',
    filters: { all: 'All', new: 'New', work: 'In progress', wait: 'Awaiting reply', done: 'Confirmed' } as Record<'all' | Status, string>,
    cols: { id: 'Number', group: 'Group', trip: 'Trip', date: 'Date', pax: 'Passengers', src: 'Source', owner: 'Owner', status: 'Status' },
    src: { web: 'Web', agent: 'Travel agency' } as Record<'web' | 'agent', string>,
    detail: { h: 'Request', organiser: 'Organiser', reuse: 'Saved organiser details are ready for the next request.', notes: 'Notes', none: 'Pick a request in the queue.' },
    back: 'Back to the home page', agents: 'See the agency route',
    status: { new: 'New', work: 'In progress', wait: 'Awaiting reply', done: 'Confirmed' } as Record<Status, string>,
    rows: [
      { id: 'SAMPLE-01', group: 'Sample group A', trip: 'The Golden Circle', date: '12 Oct', pax: 32, src: 'web', owner: 'Staff member A', status: 'new', note: 'Pick-up place missing.' },
      { id: 'SAMPLE-02', group: 'Sample group B', trip: 'The South Coast', date: '14 Oct', pax: 48, src: 'agent', owner: 'Staff member B', status: 'work', note: 'Asks for a vehicle with a toilet.' },
      { id: 'SAMPLE-03', group: 'Sample group C', trip: 'North Iceland, 3 days', date: '20 to 22 Oct', pax: 19, src: 'agent', owner: 'Staff member A', status: 'wait', note: 'Waiting for an answer about the driver’s lodging.' },
      { id: 'SAMPLE-04', group: 'Sample group D', trip: 'Keflavík and the Blue Lagoon', date: '3 Nov', pax: 52, src: 'web', owner: 'Staff member C', status: 'done', note: 'Confirmed by phone.' },
      { id: 'SAMPLE-05', group: 'Sample group E', trip: 'Regular service, Mon to Fri', date: 'from 5 Nov', pax: 24, src: 'web', owner: 'Staff member B', status: 'new', note: 'Check the times with the school.' },
    ],
  },
} as const

/* ------------------------------------------------------------------ dashboard record */
export const companyEntry: PreviewCompany = {
  slug: 'teitur',
  route: '/preview/teitur',
  name: 'Teitur Jónasson',
  sector: 'Hópferðir og farþegaflutningar',
  location: 'Dalvegur 22, 201 Kópavogur',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 1963, fjölskyldufyrirtæki.',
  currentUrl: 'https://www.teitur.is',
  ownerEmail: 'info@teitur.is',
  concept: 'Rúta á leiðinni',
  conceptTagline:
    'Vefurinn byrjar á beiðninni: kortið í forsíðumyndinni tekur við hópnum, leiðirnar fylla hana út og flotinn er sýndur eins og Teitur skráir hann sjálfur. ' +
    'Íslenska og enska á sitt hvorri slóð, með annan farveg fyrir ferðaskrifstofur.',
  accent: '#E8620F',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}teitur/hero-1200.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir og merki eru í eigu Teits Jónassonar ehf. og sótt af teitur.is 29. september 2026. Kortið er unnið úr almenningsgögnum (Natural Earth).',
  audit: {
    strengths: [
      'Fjölskyldufyrirtæki frá 1963 með eigið verkstæði fyrir viðhald og eftirlit',
      'Ljósmyndir af bílunum í landslaginu í mikilli upplausn, allt að 5312 punkta á breidd',
      'Flotalisti með gerð, sætafjölda og búnaði fyrir hverja gerð þegar til á vefnum',
    ],
    weaknesses: [
      'Tilboðssíðan (/fa-tilbod/) skilar 200 en sýnir villuna „The following tag cannot be processed: {exp:freeform:form}“ í stað eyðublaðs (mælt 29. sept. 2026)',
      'Vefþjónninn segir PHP/5.6.40 og http er ekki vísað á https; forsíðan er merkt index,nofollow og hefur enskan titil',
      'Vefkortið er frá 2015, ellefu myndir á forsíðu vantar alt-texta og engar hreflang-merkingar eru til',
      'Vefurinn segir um 40 bíla á einum stað og yfir 100 á öðrum; sætaúrval er 9 til 69 á einum stað og 9 til 72 á öðrum',
    ],
    opportunities: [
      'Beiðni með ferðaáætlun, dagsetningum og fjölda sem virkar alltaf og hefur símann sem varaleið',
      'Íslensk og ensk slóð með réttum tungumálamerkingum',
      'Sérstakur farvegur fyrir ferðaskrifstofur sem senda margar beiðnir',
    ],
  },
  positioning:
    'Teitur er rótgróið rútufyrirtæki sem missir fyrirspurnir í villuskilaboð. ' +
    'Vefurinn á að taka við beiðni með stoppum, dagsetningum og fjölda, segja skýrt að hún sé háð staðfestingu og hafa símann sem varaleið.',
  /* No outreach drafted: Sindri has authorized the build only. */
  outreach: { subject: '', body: '' },
}
