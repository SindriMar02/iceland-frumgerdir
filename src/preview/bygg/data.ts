import type { PreviewCompany } from '../company-types'

/* Content for /preview/bygg (Icelandic) and /preview/bygg/en.
   Every sentence about BYGG comes from bygg.is or the project sales pages of 2026-09-29 (harvest manifest:
   _docs/bygg-harvest-2026-09-29/MANIFEST.md). Where a heading had to be shortened it is condensed from their sentence and
   says so in the build note. Prices are the asking prices the SELLING AGENCIES publish (read 2026-09-29), never BYGG's.
   Sample figures are marked SAMPLE (Dæmi / Sample) wherever they appear. */

export type Lang = 'is' | 'en'
export interface Bi { is: string; en: string }
const L = (is: string, en: string): Bi => ({ is, en })
export const pick = (b: Bi, lang: Lang) => b[lang]

const BASE = import.meta.env.BASE_URL
export const img = (f: string) => `${BASE}bygg/${f}.webp`
export const brand = (f: string) => `${BASE}bygg/brand/${f}`
export const ROUTE_IS = `${BASE}preview/bygg`
export const ROUTE_EN = `${BASE}preview/bygg/en`

export const READ_DATE: Bi = L('29. september 2026', '29 September 2026')
export const PHONE = { display: '562 2991', href: 'tel:+3545622991' }
export const RENTAL_MAIL = 'elisa@bygg.is'
export const SERVICE_MAIL = 'karlth@bygg.is'
export const BYGG_URL = 'https://www.bygg.is/'
export const HMS_URL = 'https://hms.is/husnaedi/hlutdeildarlan'

/** 65,9 m.kr. / ISK 65.9m */
export const mkr = (n: number, lang: Lang) => {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(1)
  return lang === 'is' ? `${s.replace('.', ',')}\u00A0m.kr.` : `ISK\u00A0${s}m`
}

/* -------------------------------------------------------------------------------------------- sales partners
   Exactly as each project's sales page lists them (bygg.is/verkefni/<slug>, vefir.onno.is/bygg/<slug>), 2026-09-29. */
export const AGENCY = {
  fjarfesting: { name: 'Fjárfesting fasteignasala', phone: '562 4250' },
  torg: { name: 'Fasteignasalan Torg', phone: '699 4610' },
  fastmark: { name: 'Fasteignamarkaðurinn', phone: '570 4500' },
  hraunhamar: { name: 'Hraunhamar', phone: '520 7500' },
  as: { name: 'Ás fasteignasala', phone: '862 3377' },
  studlaberg: { name: 'Stuðlaberg', phone: '420 4000' },
  eignasala: { name: 'Eignasala', phone: '420 6070' },
  allt: { name: 'Allt fasteignasala', phone: '560 5500' },
  valholl: { name: 'Valhöll fasteignasala', phone: '770 4040' },
} as const
type AgencyKey = keyof typeof AGENCY

/* -------------------------------------------------------------------------------------------- the seven projects for sale
   Four are built as collections (one page each). The other three are still in the picker of the enquiry form. */
export interface SaleProject { key: string; label: string; town: Bi; units: number; sellers: AgencyKey[]; page?: string; url: string }
export const SALE_PROJECTS: SaleProject[] = [
  { key: 'asvellir', label: 'Ásvellir 3-19', town: L('Hafnarfjörður', 'Hafnarfjörður'), units: 104, sellers: ['hraunhamar', 'fjarfesting', 'torg', 'as', 'fastmark'], page: '/asvellir', url: 'https://www.bygg.is/verkefni/asvellir-3-19/' },
  { key: 'bolholt', label: 'Bolholt 7-9', town: L('Reykjavík', 'Reykjavík'), units: 47, sellers: ['torg', 'fjarfesting', 'fastmark'], page: '/bolholt', url: 'https://www.bygg.is/verkefni/bolholt-7-9/' },
  { key: 'fossvogsvegur', label: 'Fossvogsvegur 8-36', town: L('Reykjavík', 'Reykjavík'), units: 15, sellers: ['fastmark', 'fjarfesting', 'torg'], page: '/fossvogsvegur', url: 'https://www.bygg.is/verkefni/fossvogsvegur/' },
  { key: 'asparlaut', label: 'Asparlaut 1, 3 og 5', town: L('Reykjanesbær', 'Reykjanesbær'), units: 59, sellers: ['fjarfesting', 'studlaberg', 'eignasala', 'allt', 'valholl', 'torg'], page: '/asparlaut', url: 'https://www.bygg.is/verkefni/asparlaut-1-3-og-5/' },
  { key: 'naustavor', label: 'Naustavör 60-66', town: L('Kópavogur', 'Kópavogur'), units: 54, sellers: ['torg', 'fastmark', 'fjarfesting'], url: 'https://www.bygg.is/verkefni/naustavor-60-66/' },
  { key: 'hjallabraut', label: 'Hjallabraut 45-49', town: L('Hafnarfjörður', 'Hafnarfjörður'), units: 10, sellers: ['valholl', 'fjarfesting', 'torg', 'fastmark', 'as', 'hraunhamar'], url: 'https://www.bygg.is/verkefni/hjallabraut/' },
  { key: 'asparlaut-24', label: 'Asparlaut 24-26', town: L('Reykjanesbær', 'Reykjanesbær'), units: 34, sellers: ['eignasala', 'valholl', 'studlaberg', 'torg', 'fjarfesting', 'allt'], url: 'https://www.bygg.is/verkefni/asparlaut-24-26/' },
]

export const RENTALS = [
  { key: 'borgartun', label: 'Borgartún 31', note: L('Tvö rými á fyrstu og annarri hæð', 'Two spaces on the first and second floor') },
  { key: 'vegmuli', label: 'Vegmúli 2', note: L('Rými á þriðju og fjórðu hæð', 'Spaces on the third and fourth floor') },
  { key: 'sidumuli', label: 'Síðumúli 24', note: L('Allt húsið, 3.228 m²', 'The whole building, 3,228 m²') },
  { key: 'skogarhlid', label: 'Skógarhlíð 12', note: L('772 m² skrifstofuhúsnæði á þriðju hæð', '772 m² of office space on the third floor') },
  { key: 'lambhagavegur', label: 'Lambhagavegur 33', note: L('Fjögurra hæða atvinnuhúsnæði', 'Four-storey commercial building') },
]

/* -------------------------------------------------------------------------------------------- size bands with the lowest published asking price
   Read from the sellers' own listings on 2026-09-29 (fjarfesting.is, hraunhamar.is, as.is); m.kr. = million ISK.
   The listings show part of each project, so the ranges are "as listed", not the full range of the building. */
export interface Band { from: number; to: number; price: number; w: number }
const BANDS: Record<string, Band[]> = {
  asvellir: [{ from: 76, to: 81, price: 65.9, w: 0.28 }, { from: 87, to: 104, price: 76.9, w: 0.52 }, { from: 105, to: 124, price: 96.9, w: 0.7 }],
  bolholt: [{ from: 60, to: 73, price: 71, w: 0.4 }, { from: 83, to: 92, price: 89, w: 0.55 }, { from: 112, to: 131, price: 114, w: 0.2 }],
  fossvogsvegur: [{ from: 167, to: 189, price: 197, w: 0.5 }, { from: 210, to: 242, price: 240, w: 0.3 }],
  asparlaut: [{ from: 96, to: 101, price: 69.9, w: 0.6 }, { from: 141, to: 240, price: 89.9, w: 0.35 }],
}
export const FROM_PRICE: Record<string, number> = { asvellir: 65.9, bolholt: 71, fossvogsvegur: 197, asparlaut: 69.9 }

/* -------------------------------------------------------------------------------------------- collections */
export interface Fact { img: string; alt: Bi; stat: [Bi, Bi]; desc: Bi; pos?: string }
export interface Collection {
  key: 'asvellir' | 'bolholt' | 'fossvogsvegur' | 'asparlaut'
  slug: string
  name: Bi; marquee: Bi; town: Bi; blurb: [Bi, Bi]
  description: Bi
  hero: string; heroAlt: Bi; cover: string; nextImg: string
  slides: Array<{ f: string; alt: Bi }>
  lead: Bi; galleryTitle: Bi; galleryText: Bi
  quoteImg: string; quote: Bi
  breaks: [{ f: string; alt: Bi }, { f: string; alt: Bi }]
  labels: [Bi, Bi]
  facts: Fact[]
  pull?: Bi
  cta: Bi
  ledgerTitle: Bi
  bands: Band[]
}

const R = (is: string, en: string) => L(`Tölvuteiknuð mynd: ${is}`, `Computer-generated image: ${en}`)

export const COLLECTIONS: Collection[] = [
  {
    key: 'asvellir', slug: '/asvellir',
    name: L('Ásvellir 3-19', 'Ásvellir 3-19'), marquee: L('Ásvellir', 'Ásvellir'), town: L('Hafnarfjörður', 'Hafnarfjörður'),
    blurb: [L('Hafnarfjörður', 'Hafnarfjörður'), L('104 íbúðir', '104 apartments')],
    description: L('Ásvellir 3-19 í Hafnarfirði: 104 íbúðir í sjö húsum umhverfis sameiginlega garða, frá 75,6 m² til 154 m². Nýjar íbúðir frá BYGG.', 'Ásvellir 3-19 in Hafnarfjörður: 104 apartments in seven buildings around shared gardens, from 75.6 m² to 154 m². New apartments from BYGG.'),
    hero: 'as-hero', heroAlt: R('hús við sameiginlegan garð á Ásvöllum', 'buildings around the shared garden at Ásvellir'), cover: 'as-cam3', nextImg: 'bo-framan',
    slides: [
      { f: 'as-cam3', alt: R('horft að Ásvöllum úr suðri', 'Ásvellir seen from the south') },
      { f: 'as-hus1', alt: R('hús við götu og bílakjallara', 'a building at the street and the car park entrance') },
      { f: 'as-hus5', alt: R('rauðklætt hús og gangstígur', 'a rust-clad building and the footpath') },
      { f: 'as-stofa', alt: R('stofa og borðstofa', 'living and dining room') },
      { f: 'as-cam8', alt: R('garðurinn milli húsanna', 'the garden between the buildings') },
      { f: 'as-eldhus', alt: R('eldhús með eyju', 'a kitchen with an island') },
      { f: 'as-hus3', alt: R('hornhús frá götu', 'a corner building from the street') },
      { f: 'as-hjon', alt: R('hjónaherbergi', 'a bedroom') },
      { f: 'as-hus7', alt: R('húsin við sameiginlega garðinn', 'the buildings at the shared garden') },
      { f: 'as-barna', alt: R('barnaherbergi', "a child's room") },
      { f: 'as-cam6', alt: R('götumynd á Ásvöllum', 'a street view of Ásvellir') },
    ],
    lead: L('Ásvellir 3-19 bjóða upp á fjölbreytt úrval af íbúðum sem henta ólíkum lífsstílum og fjölskyldugerðum.', 'Ásvellir 3-19 offer a varied selection of apartments for different lifestyles and family types.'),
    galleryTitle: L('Sjö hús, tveir klasar og sameiginlegir garðar', 'Seven buildings, two clusters and shared gardens'),
    galleryText: L('Íbúðirnar verða frá 75,6 m² tveggja herbergja íbúðum upp í 154 m² fimm herbergja íbúðir. Byggðin lækkar til suðurs til að hleypa birtu inn í garðana og íbúðirnar.', 'The apartments range from 75.6 m² two-room apartments up to 154 m² five-room apartments. The development steps down to the south to let light into the gardens and the apartments.'),
    quoteImg: 'as-hus1', quote: L('Íbúðirnar eru í Svansvottunarferli og við hönnun þeirra var lögð rík áhersla á vandað efnisval og góða orkunýtingu.', 'The apartments are going through Nordic Swan certification, and their design put strong emphasis on quality materials and good energy use.'),
    breaks: [{ f: 'as-hus7', alt: R('sólarlag við húsin á Ásvöllum', 'evening light on the buildings at Ásvellir') }, { f: 'as-cam6', alt: R('gata og hús á Ásvöllum', 'the street and buildings at Ásvellir') }],
    labels: [L('Hús við sameiginlegan garð', 'Buildings at a shared garden'), L('Gata og hús á Ásvöllum', 'The street and buildings at Ásvellir')],
    facts: [
      { img: 'as-hus3', alt: R('hús á Ásvöllum', 'a building at Ásvellir'), stat: [L('104', '104'), L('íbúðir', 'apartments')], desc: L('Við Ásvelli 3-19 rísa 104 fjölbreyttar íbúðir í sjö húsum sem mynda tvo klasa umhverfis skjólgóða, sameiginlega garða.', 'At Ásvellir 3-19, 104 varied apartments are rising in seven buildings that form two clusters around sheltered shared gardens.'), pos: '38% 50%' },
      { img: 'as-stofa', alt: R('stofa', 'a living room'), stat: [L('75,6-154', '75.6-154'), L('m²', 'm²')], desc: L('Íbúðirnar eru meðal annars útbúnar með gólfhita, fataherbergjum í flestum íbúðum, vönduðum innréttingum og heimilistækjum.', 'The apartments come with underfloor heating, walk-in wardrobes in most of them, quality kitchens and appliances.'), pos: '50% 50%' },
      { img: 'as-hjon', alt: R('hjónaherbergi', 'a bedroom'), stat: [L('Loftskipti', 'Ventilation'), L('og varmi', 'and heat')], desc: L('Loftskiptakerfið er einstakt en það stuðlar að góðum loftgæðum innandyra og endurnýtir jafnframt varma sem annars færi út úr húsinu.', 'The ventilation system is unusual: it gives good indoor air quality and reuses heat that would otherwise leave the building.'), pos: '62% 50%' },
      { img: 'as-eldhus', alt: R('eldhús', 'a kitchen'), stat: [L('Lyftuhús', 'Lift buildings'), L('með gólfhita', 'with underfloor heating')], desc: L('Húsin verða álklædd lyftuhús með gólfhita og annaðhvort rúmgóðum svölum eða timburverönd. Bílastæði fylgir flestum íbúðum.', 'The buildings are aluminium-clad lift buildings with underfloor heating and either generous balconies or a timber terrace. Most apartments come with a parking space.'), pos: '48% 50%' },
    ],
    pull: L('Umhverfið einkennist af rólegri byggð og nálægð við opin svæði og fallega náttúru. Staðsetningin hentar því vel þeim sem vilja njóta þæginda borgarlífsins án þess að fórna kyrrð, útivist og góðu nærumhverfi.', 'The surroundings are quiet, with open space and nature close by. The location suits those who want the comforts of city life without giving up calm, outdoor life and a good neighbourhood.'),
    cta: L('Skráðu áhuga á íbúð á Ásvöllum', 'Register your interest in an apartment at Ásvellir'),
    ledgerTitle: L('Íbúðagerðir og verð', 'Apartment sizes and prices'),
    bands: BANDS.asvellir,
  },
  {
    key: 'bolholt', slug: '/bolholt',
    name: L('Bolholt 7-9', 'Bolholt 7-9'), marquee: L('Bolholt', 'Bolholt'), town: L('Reykjavík', 'Reykjavík'),
    blurb: [L('Reykjavík', 'Reykjavík'), L('47 íbúðir', '47 apartments')],
    description: L('Bolholt 7-9 í Reykjavík: sex hæða fjölbýlishús með lyftum og bílageymslu á Valhallarreitnum, 47 íbúðir auk verslunarrýmis.', 'Bolholt 7-9 in Reykjavík: a six-storey building with lifts and a car park on the Valhöll site, 47 apartments plus a retail space.'),
    hero: 'bo-framan', heroAlt: R('framhlið Bolholts 7-9', 'the front of Bolholt 7-9'), cover: 'bo-aftan', nextImg: 'fo-4',
    slides: [
      { f: 'bo-framan', alt: R('framhlið Bolholts 7-9', 'the front of Bolholt 7-9') },
      { f: 'bo-gardur', alt: R('garður við húsið', 'the garden at the building') },
      { f: 'bo-aftan', alt: R('húsið frá bakhlið', 'the building from the back') },
      { f: 'bo-nedan', alt: R('húsið neðan frá götu', 'the building seen from the street below') },
    ],
    lead: L('Sala er hafin á glæsilegu fjölbýlishúsi við Bolholt 7-9 í Reykjavík.', 'Sales have started for a fine apartment building at Bolholt 7-9 in Reykjavík.'),
    galleryTitle: L('Miðsvæðis á Valhallarreitnum', 'In the middle of the city, on the Valhöll site'),
    galleryText: L('Bolholt 7-9 er sex hæða fjölbýlishús með lyftum og bílageymslu. Bílageymsla er upphituð og sérgeymslur eru í kjallara.', 'Bolholt 7-9 is a six-storey building with lifts and a car park. The car park is heated and the storerooms are in the basement.'),
    quoteImg: 'bo-aftan', quote: L('Bolholt 7-9 er staðsett á hinum nýja Valhallarreit á horni Háleitisbrautar og Skipholts. Staðsetning er ákaflega góð rétt miðsvæðis í Reykjavík.', 'Bolholt 7-9 stands on the new Valhöll site at the corner of Háleitisbraut and Skipholt. The location is excellent, right in the middle of Reykjavík.'),
    breaks: [{ f: 'bo-nedan', alt: R('Bolholt 7-9 frá götunni', 'Bolholt 7-9 from the street') }, { f: 'bo-gardur', alt: R('garðurinn við Bolholt 7-9', 'the garden at Bolholt 7-9') }],
    labels: [L('Húsið frá götunni', 'The building from the street'), L('Garðurinn við húsið', 'The garden at the building')],
    facts: [
      { img: 'bo-framan', alt: R('framhlið hússins', 'the front of the building'), stat: [L('47', '47'), L('íbúðir', 'apartments')], desc: L('Það verða 47 íbúðir í húsinu auk verslunarrýmis. Í húsinu eru 2ja til 4ra herbergja íbúðir.', 'There will be 47 apartments in the building plus a retail space. The building has two- to four-room apartments.'), pos: '30% 50%' },
      { img: 'bo-aftan', alt: R('húsið frá bakhlið', 'the building from the back'), stat: [L('Bílageymsla', 'Car park'), L('upphituð', 'heated')], desc: L('Flestum íbúðum fylgja stæði í bílageymslu en einnig eru sameiginleg bílastæði á lóð. Bílageymsla er upphituð og sérgeymslur eru í kjallara.', 'Most apartments come with a space in the car park, and there is shared parking on the plot. The car park is heated and the storerooms are in the basement.'), pos: '60% 50%' },
      { img: 'bo-gardur', alt: R('garður og gangstígur', 'the garden and footpath'), stat: [L('Sameign', 'Shared areas'), L('frágengin', 'finished')], desc: L('Sameign verður frágengin utan sem innan og í sameign verður vönduð lyfta. Gangstéttar við húsið verða með snjóbræðslukerfi.', 'The shared areas will be finished inside and out, with a quality lift. The pavements around the building will have snow melting.'), pos: '50% 50%' },
    ],
    pull: L('Íbúðirnar verða afhentar með vönduðum innréttingum og án gólfefna, þó verða flísar á baðherbergjum og þvottahúsum frá. Rafmagns- og sjónvarpslögn fylgir frágengin og verður mynddyrasími með einu símtóli í íbúð.', 'The apartments are handed over with quality kitchens and fittings and without floor coverings, but with tiles on the bathroom and laundry floors. Electrical and TV wiring is finished, and each apartment has a video door phone with one handset.'),
    cta: L('Skráðu áhuga á íbúð við Bolholt', 'Register your interest in an apartment at Bolholt'),
    ledgerTitle: L('Íbúðagerðir og verð', 'Apartment sizes and prices'),
    bands: BANDS.bolholt,
  },
  {
    key: 'fossvogsvegur', slug: '/fossvogsvegur',
    name: L('Fossvogsvegur 8-36', 'Fossvogsvegur 8-36'), marquee: L('Fossvogsvegur', 'Fossvogsvegur'), town: L('Reykjavík', 'Reykjavík'),
    blurb: [L('Reykjavík', 'Reykjavík'), L('15 íbúðir', '15 homes')],
    description: L('Fossvogsvegur 8-36 í Reykjavík: 15 íbúðir í tengihúsi neðan við Borgarspítalann, 11 raðhús á tveimur hæðum og 4 sérhæðir með þaksvölum.', 'Fossvogsvegur 8-36 in Reykjavík: 15 homes in a terraced building below the hospital, 11 two-storey houses and 4 upper-floor homes with roof terraces.'),
    hero: 'fo-4', heroAlt: R('raðhús við gróður Fossvogs', 'the houses at the green edge of Fossvogur'), cover: 'fo-5', nextImg: 'ap-4',
    slides: [
      { f: 'fo-1', alt: R('húsin úr lofti', 'the houses from the air') },
      { f: 'fo-2', alt: R('húsin og gróðurlendi Fossvogs', 'the houses and the green of Fossvogur') },
      { f: 'fo-3', alt: R('húsaröðin í kvöldbirtu', 'the row of houses in evening light') },
      { f: 'fo-4', alt: R('raðhús við gróður Fossvogs', 'the houses at the green edge of Fossvogur') },
      { f: 'fo-5', alt: R('húsaröðin frá grasinu', 'the row of houses seen from the grass') },
      { f: 'fo-6', alt: R('aðkoma og bílgeymsla', 'the approach and the car park entrance') },
    ],
    lead: L('Sala er hafin á stórglæsilegu tengihúsi við Fossvogsveg 8-36 í Reykjavík.', 'Sales have started for a fine terraced building at Fossvogsvegur 8-36 in Reykjavík.'),
    galleryTitle: L('Sérbýlislegur bragur á grónum stað', 'The feel of a house, in an established place'),
    galleryText: L('Húsið er staðsett í Fossvognum nánar tiltekið fyrir neðan Borgarspítalann á einstaklega veðursælum og fallegum stað.', 'The building stands in Fossvogur, just below the hospital, in a particularly sheltered and beautiful spot.'),
    quoteImg: 'fo-2', quote: L('Lóðin er alls 4279 m² og snýr að gróðurlendi Fossvogs, engin hús fyrir neðan og fegurð svæðisins óviðjafnanleg.', 'The plot is 4,279 m² and faces the green land of Fossvogur, with no houses below and beauty that is hard to match.'),
    breaks: [{ f: 'fo-5', alt: R('húsaröðin við Fossvogsveg', 'the row of houses at Fossvogsvegur') }, { f: 'fo-3', alt: R('húsin í kvöldbirtu', 'the houses in evening light') }],
    labels: [L('Húsaröðin við Fossvogsveg', 'The row of houses at Fossvogsvegur'), L('Húsin í kvöldbirtu', 'The houses in evening light')],
    facts: [
      { img: 'fo-6', alt: R('aðkoma að húsunum', 'the approach to the houses'), stat: [L('15', '15'), L('íbúðir', 'homes')], desc: L('Í húsinu eru 15 íbúðir: 11 raðhús á tveimur hæðum og 4 stórar sérhæðir sem setjast ofan á sem 2. hæð frá götu.', 'The building has 15 homes: 11 two-storey terraced houses and 4 large upper-floor homes that sit on top as the second floor from the street.'), pos: '55% 50%' },
      { img: 'fo-1', alt: R('húsin úr lofti', 'the houses from the air'), stat: [L('Þaksvalir', 'Roof terraces'), L('og lyftur', 'and lifts')], desc: L('Sérhæðirnar hafa stóra þakgarða til suðurs og vesturs og hægt er að hafa lyftur frá bílageymslu upp til sérhæða.', 'The upper-floor homes have large roof gardens to the south and west, and lifts can run from the car park up to them.'), pos: '55% 50%' },
      { img: 'fo-2', alt: R('húsin og gróðurlendið', 'the houses and the green land'), stat: [L('Bílageymsla', 'Car park'), L('fyrir 15 bíla', 'for 15 cars')], desc: L('Undir jörðu er bílageymsla fyrir 15 bíla og í kjallara er góð sameign fyrir inntök, hjóla- og vagnageymslur og fleira.', 'Underground is a car park for 15 cars, and the basement holds shared rooms for utilities, bicycle and pram storage and more.'), pos: '35% 50%' },
    ],
    pull: L('Yfirbragð húsanna er hvítt með timburívafi. Þau eru einangruð að utan og klædd viðhaldsfríu sléttu áli, gluggar eru álklæddir timburgluggar.', 'The buildings are white with timber accents. They are insulated on the outside and clad in maintenance-free smooth aluminium, with aluminium-clad timber windows.'),
    cta: L('Skráðu áhuga á íbúð við Fossvogsveg', 'Register your interest in a home at Fossvogsvegur'),
    ledgerTitle: L('Íbúðagerðir og verð', 'Home sizes and prices'),
    bands: BANDS.fossvogsvegur,
  },
  {
    key: 'asparlaut', slug: '/asparlaut',
    name: L('Asparlaut 1, 3 og 5', 'Asparlaut 1, 3 and 5'), marquee: L('Asparlaut', 'Asparlaut'), town: L('Reykjanesbær', 'Reykjanesbær'),
    blurb: [L('Reykjanesbær', 'Reykjanesbær'), L('59 íbúðir', '59 apartments')],
    description: L('Asparlaut 1, 3 og 5 í Hlíðarhverfi í Reykjanesbæ: 59 íbúðir, 2ja til 4ra herbergja, nálægt útivistar- og náttúrusvæðum.', 'Asparlaut 1, 3 and 5 in Hlíðarhverfi, Reykjanesbær: 59 apartments, two to four rooms, close to outdoor and nature areas.'),
    hero: 'ap-4', heroAlt: R('fjölbýlishús við Asparlaut', 'the apartment buildings at Asparlaut'), cover: 'ap-1', nextImg: 'as-hus5',
    slides: [
      { f: 'ap-1', alt: R('Asparlaut úr lofti', 'Asparlaut from the air') },
      { f: 'ap-2', alt: R('aðkoma og bílastæði', 'the approach and parking') },
      { f: 'ap-3', alt: R('gangstígur að húsunum', 'the path to the buildings') },
      { f: 'ap-4', alt: R('fjölbýlishús við Asparlaut', 'the apartment buildings at Asparlaut') },
      { f: 'ap-5', alt: R('lóðin ofan frá', 'the plot from above') },
    ],
    lead: L('Nú eru komin í sölu glæsileg fjölbýlishús við Asparlaut 1-5 í Reykjanesbæ.', 'Fine apartment buildings at Asparlaut 1-5 in Reykjanesbær are now on sale.'),
    galleryTitle: L('Glæsilegar 2ja til 4ra herbergja íbúðir', 'Fine two- to four-room apartments'),
    galleryText: L('Íbúðirnar eru í nálægð við útivistar- og náttúrusvæði. Stutt í fallegar gönguleiðir þar sem hverfið er vel staðsett.', 'The apartments are close to outdoor and nature areas. Beautiful walking routes are near, and the district is well placed.'),
    quoteImg: 'ap-4', quote: L('Glæsilegar 2ja-4ra herbergja íbúðir við Asparlaut 1-5 í Hlíðarhverfi í Reykjanesbæ.', 'Fine two- to four-room apartments at Asparlaut 1-5 in Hlíðarhverfi, Reykjanesbær.'),
    breaks: [{ f: 'ap-1', alt: R('Asparlaut og hverfið í kring', 'Asparlaut and the surrounding district') }, { f: 'ap-5', alt: R('lóðin við Asparlaut ofan frá', 'the plot at Asparlaut from above') }],
    labels: [L('Asparlaut og hverfið í kring', 'Asparlaut and the surrounding district'), L('Lóðin við Asparlaut', 'The plot at Asparlaut')],
    facts: [
      { img: 'ap-1', alt: R('Asparlaut úr lofti', 'Asparlaut from the air'), stat: [L('59', '59'), L('íbúðir', 'apartments')], desc: L('Glæsilegar íbúðir í þremur húsum við Asparlaut 1, 3 og 5.', 'Fine apartments in three buildings at Asparlaut 1, 3 and 5.'), pos: '40% 50%' },
      { img: 'ap-3', alt: R('gangstígur að húsunum', 'the path to the buildings'), stat: [L('2ja-4ra', '2-4'), L('herbergja', 'rooms')], desc: L('Glæsilegar 2ja-4ra herbergja íbúðir í Hlíðarhverfi í Reykjanesbæ.', 'Fine two- to four-room apartments in Hlíðarhverfi, Reykjanesbær.'), pos: '50% 40%' },
      { img: 'ap-2', alt: R('aðkoma og bílastæði', 'the approach and parking'), stat: [L('Útivist', 'Outdoors'), L('í nágrenninu', 'nearby')], desc: L('Íbúðirnar eru í nálægð við útivistar- og náttúrusvæði. Stutt í fallegar gönguleiðir þar sem hverfið er vel staðsett.', 'The apartments are close to outdoor and nature areas. Beautiful walking routes are near, and the district is well placed.'), pos: '50% 60%' },
    ],
    cta: L('Skráðu áhuga á íbúð við Asparlaut', 'Register your interest in an apartment at Asparlaut'),
    ledgerTitle: L('Íbúðagerðir og verð', 'Apartment sizes and prices'),
    bands: BANDS.asparlaut,
  },
]
export const collectionOf = (key: string) => COLLECTIONS.find((c) => c.key === key)

/* -------------------------------------------------------------------------------------------- about (bygg.is/um-okkur)
   Text verbatim except where noted. */
export const HISTORY: Array<{ year: string; title: string; text: string }> = [
  { year: '1984', title: 'Stofnun fyrirtækisins', text: 'Gunnar Þorláksson húsasmíðameistari og Gylfi Ómar Héðinsson múrarameistari stofna sameignarfélag. Hið nýja félag stóð að framkvæmdum við til dæmis Ránargötu 45, Ármúla 17 og að Þarabakka í Mjóddinni.' },
  { year: '1989', title: 'Fyrsta verkefnið frá lóðakaupum til afhendingar fullbúinna íbúða', text: 'Fyrsta stóra verkefni fyrirtækisins fer í gang með kaupum á lóðum af Lýsi við Grandaveg 41, 43, 45 og 47. Í heildina voru þetta 100 íbúðir sem byggðar voru þar og voru afhentar fullbúnar sem var nýlunda á þessum tíma.' },
  { year: '1993', title: 'Upphaf Sjálandshverfisins í Garðabæ', text: 'BYGG kaupir Stálvík við Arnanesvog og uppbygging Sjálandshverfisins hefst.' },
  { year: '1995', title: 'Uppbygging hefst í Kópavogsdal', text: 'BYGG byrjar að kaupa lóðir í Kópavogsdal. Fyrirtækið vinnur við framkvæmdir við Veghús, Grandaveg og Bíldshöfða.' },
  { year: '2000', title: 'Bygging Smáralindar hefst', text: 'Skóflustunga að byggingu Smáralindar var tekin í júlí 1998 en framkvæmdir hófust í ársbyrjun 2000. Smáralind var síðan opnuð við hátíðlega athöfn 10. október 2001.' },
  { year: '2005', title: 'Uppbygging í Kópavogi og Garðabæ', text: 'Fyrirtækið byggði upp hverfi í Sjálandi í Garðabæ og Kópavogi við Lund og Álfkonuhvarf.' },
  { year: '2010', title: 'Hús við Naustavör rísa', text: 'Ásamt áframhaldandi uppbyggingu í Lundi og Sjálandi hófust framkvæmdir við Naustavör á Kársnesi.' },
  { year: '2015', title: 'Hlíðarhverfi byggt í Reykjanesbæ', text: '1. og 2. áfangi í Hlíðarhverfi í Reykjanesbæ fara af stað.' },
  { year: '2020', title: 'Uppbygging í Hamrahverfi í Hafnarfirði', text: 'Fyrirtækið tók þátt í uppbyggingu í Hamrahverfi í Hafnarfirði og byggði fjölbýlishús við Nónhamar og Hringhamar ásamt atvinnuhúsnæði við Álfhellu.' },
  { year: '2025', title: 'Fjöldi áhugaverðra verkefna í vinnslu', text: 'Fyrirtækið er með á hverjum tíma spennandi verkefni í gangi og má nefna að þessa stundina eru byggingarverkefni í gangi við Bolholt, Hjallabraut og Ásvelli í Hafnarfirði ásamt raðhúsum við Fossvogsveg.' },
]
export const HISTORY_EN: Record<string, { title: string; text: string }> = {
  '1984': { title: 'The company is founded', text: 'Gunnar Þorláksson, master carpenter, and Gylfi Ómar Héðinsson, master mason, found a partnership. The new company worked on, among others, Ránargata 45, Ármúli 17 and Þarabakki in Mjódd.' },
  '1989': { title: 'The first project from buying the plots to handing over finished apartments', text: 'The first large project starts with the purchase of plots from Lýsi at Grandavegur 41, 43, 45 and 47. In all, 100 apartments were built there and handed over fully finished, which was new at the time.' },
  '1993': { title: 'The start of Sjálandshverfi in Garðabær', text: 'BYGG buys Stálvík at Arnarnesvogur and the development of Sjálandshverfi begins.' },
  '1995': { title: 'Development begins in Kópavogsdalur', text: 'BYGG begins buying plots in Kópavogsdalur. The company works on Veghús, Grandavegur and Bíldshöfði.' },
  '2000': { title: 'Construction of Smáralind begins', text: 'The first sod for Smáralind was turned in July 1998, but construction began at the start of 2000. Smáralind was opened at a ceremony on 10 October 2001.' },
  '2005': { title: 'Development in Kópavogur and Garðabær', text: 'The company built up districts in Sjáland in Garðabær and in Kópavogur at Lundur and Álfkonuhvarf.' },
  '2010': { title: 'Buildings rise at Naustavör', text: 'Alongside continued work in Lundur and Sjáland, construction began at Naustavör on Kársnes.' },
  '2015': { title: 'Hlíðarhverfi built in Reykjanesbær', text: 'Phases 1 and 2 of Hlíðarhverfi in Reykjanesbær get under way.' },
  '2020': { title: 'Development in Hamrahverfi in Hafnarfjörður', text: 'The company took part in the development of Hamrahverfi in Hafnarfjörður and built apartment buildings at Nónhamar and Hringhamar along with commercial buildings at Álfhella.' },
  '2025': { title: 'Many interesting projects under way', text: 'The company always has exciting projects going, and at the moment construction is under way at Bolholt, Hjallabraut and Ásvellir in Hafnarfjörður, along with terraced houses at Fossvogsvegur.' },
}

export const PILLARS: Array<{ img: string; alt: Bi; stat: [Bi, Bi]; desc: Bi }> = [
  { img: 'ab-timi', alt: L('Byggingarframkvæmd á fyrstu árum félagsins', "Building work in the company's early years"), stat: [L('Reynsla', 'Experience'), L('í 40 ár', 'for 40 years')], desc: L('Við höfum áralanga reynslu af byggingarstarfsemi og höfum farið í gegnum öll stig byggingarferilsins með sóma sl. 40 ár. Við höfum byggt yfir 4000 íbúðir og fjöldann allan af atvinnuhúsnæði.', 'We have long experience of construction and have been through every stage of the building process with credit over the last 40 years. We have built more than 4,000 apartments and a great deal of commercial property.') },
  { img: 'ab-workers', alt: L('Starfsmenn BYGG á verkstað', 'BYGG staff on a building site'), stat: [L('Fagmennska', 'Professionalism'), L('og efni', 'and materials')], desc: L('Með reynsluna á bakinu störfum við af fagmennsku og veljum efni og aðferðir sem eru hagkvæmar fyrir umhverfið og viðskiptavini okkar. Hjá okkur starfar fjöldi af fagmönnum og sérfræðingum sem sinna starfi sínu af kunnáttu og alúð.', 'With that experience behind us we work professionally and choose materials and methods that are efficient for the environment and for our customers. We have many tradespeople and specialists who do their work with skill and care.') },
  { img: 'ab-naustavor', alt: L('Naustavör á Kársnesi', 'Naustavör on Kársnes'), stat: [L('Metnaður', 'Ambition'), L('frá fyrstu skóflustungu', 'from the first sod')], desc: L('Metnaður hefur einkennt okkar starfsemi frá fyrstu skóflustungu. Við leggjum okkur alltaf fram við að gera vel og skila af okkur góðum verkum. Með því að kynna okkur nýjustu tækni og aðferðir og vera með puttann á púlsinum búum við yfir metnaði til að gera alltaf hlutina eins vel og hægt er.', 'Ambition has marked our work since the first sod. We always strive to do well and to hand over good work. By learning about the newest technology and methods and keeping our finger on the pulse, we have the ambition to do things as well as they can be done.') },
  { img: 'ab-team', alt: L('Starfsfólk með Svansvottun fyrir Borgartún 27', 'Staff with the Nordic Swan certificate for Borgartún 27'), stat: [L('Svans', 'Nordic Swan'), L('vottun', 'certification')], desc: L('Endurbætur í Borgartúni 27 hlutu Svansvottun. Verkefnið nær til fimm hæða af átta, samtals um 4000 fermetra.', 'The renovation of Borgartún 27 received Nordic Swan certification. The project covers five of eight floors, about 4,000 square metres in all.') },
]

export const PEOPLE: Array<{ name: string; role: Bi }> = [
  { name: 'Gunnar Þorláksson', role: L('Framkvæmdastjóri, húsasmíðameistari', 'Managing director, master carpenter') },
  { name: 'Gylfi Ómar Héðinsson', role: L('Framkvæmdastjóri, múrarameistari', 'Managing director, master mason') },
  { name: 'Guðrún Elísa Þorkelsdóttir', role: L('Skrifstofustjóri', 'Office manager') },
  { name: 'Valgeir Rúnarsson', role: L('Gæða- og öryggisstjóri', 'Quality and safety manager') },
  { name: 'Elva Dögg Pálsdóttir', role: L('Mannauðsstjóri', 'Human resources manager') },
  { name: 'Karl Elí Þorgeirsson', role: L('Verkefnastjóri þjónustudeildar, húsasmíðameistari', 'Project manager, service department, master carpenter') },
  { name: 'Sigurður Pálmason', role: L('Forstöðumaður véladeildar', 'Head of the machinery department') },
  { name: 'Atli Geir Gunnarsson', role: L('Verkefna- og byggingarstjóri, byggingatæknifræðingur', 'Project and site manager, construction technologist') },
]

/* -------------------------------------------------------------------------------------------- sample data (SAMPLE, never real)
   Used only by the sales overview. Every figure below was made up to show the layout. */
export const SAMPLE = {
  demand: [
    { project: 'asvellir', bands: [{ l: L('76-81 m²', '76-81 m²'), n: 58 }, { l: L('87-104 m²', '87-104 m²'), n: 91 }, { l: L('105-124 m²', '105-124 m²'), n: 44 }] },
    { project: 'bolholt', bands: [{ l: L('60-73 m²', '60-73 m²'), n: 41 }, { l: L('83-92 m²', '83-92 m²'), n: 33 }, { l: L('112-131 m²', '112-131 m²'), n: 12 }] },
    { project: 'fossvogsvegur', bands: [{ l: L('167-189 m²', '167-189 m²'), n: 14 }, { l: L('210-242 m²', '210-242 m²'), n: 9 }] },
    { project: 'asparlaut', bands: [{ l: L('96-101 m²', '96-101 m²'), n: 37 }, { l: L('141-240 m²', '141-240 m²'), n: 19 }] },
  ],
  funnel: [
    { n: 512, l: L('Skráðu áhuga', 'Registered interest'), d: L('100%', '100%') },
    { n: 448, l: L('Söluaðili svaraði', 'Agency answered'), d: L('88%', '88%') },
    { n: 231, l: L('Skoðun bókuð', 'Viewing booked'), d: L('52% af svöruðum', '52% of answered') },
    { n: 64, l: L('Tilboð gert', 'Offer made'), d: L('28% af skoðunum', '28% of viewings') },
    { n: 41, l: L('Kaupsamningur', 'Purchase agreement'), d: L('64% af tilboðum', '64% of offers') },
  ],
  stall: 2, // the step where most enquiries stop (index into funnel)
  sellers: [
    { name: L('Söluaðili A', 'Agency A'), sent: 188, hours: 2.4, viewings: 61 },
    { name: L('Söluaðili B', 'Agency B'), sent: 143, hours: 5.1, viewings: 54 },
    { name: L('Söluaðili C', 'Agency C'), sent: 97, hours: 9.8, viewings: 41 },
    { name: L('Söluaðili D', 'Agency D'), sent: 61, hours: 27.5, viewings: 22 },
    { name: L('Söluaðili E', 'Agency E'), sent: 23, hours: 6.3, viewings: 53 },
  ],
}

/* -------------------------------------------------------------------------------------------- financing (structural only)
   No rule, threshold or amount is shipped: HMS blocked the automated read on 2026-09-29 (bot checkpoint), so the page links out. */
export const FIRST_BUY = ['yes', 'no'] as const

/* -------------------------------------------------------------------------------------------- UI text */
export interface UiText {
  htmlLang: string
  [k: string]: string
}
const IS_T: Record<string, string> = {
  htmlLang: 'is',
  skip: 'Fara í efni',
  brand: 'BYGG, forsíða', logoAlt: 'BYGG',
  about: 'Um okkur', contact: 'Hafa samband', home: 'Forsíða', forSale: 'Til sölu', forSaleAria: 'Íbúðir í sölu',
  menuOpen: 'Opna valmynd', menuClose: 'Loka valmynd', nav: 'Aðalvalmynd', navPrimary: 'Efni',
  myHome: 'Mín íbúð', overview: 'Söluyfirlit (sýnishorn)', phoneLabel: 'Sími', langSwitch: 'English', langHref: 'en',
  pickerAria: 'Íbúðir í sölu', homeTile: 'Forsíða', homeTileBlurb: 'Nýjar íbúðir frá BYGG',
  scroll: 'Skrunaðu', scrollHint: '(Skrunaðu)', next: 'Næst', play: 'Spila', stop: 'Stöðva', close: 'Loka',
  colophon: 'BYGG · Stofnað 1984',
  homeMarquee: 'Nýjar íbúðir',
  homeLead: 'Einn reyndasti byggingaraðilinn á íslenskum markaði.',
  homeTitle: 'BYGG | Nýjar íbúðir og atvinnuhúsnæði',
  homeDesc: 'Byggingarfélag Gylfa og Gunnars (BYGG) hefur byggt yfir 4.000 íbúðir á höfuðborgarsvæðinu. Skoðaðu íbúðir í sölu og skráðu áhuga.',
  chipNote: 'Ásett verð söluaðila, lesið 29.9.2026', chipFrom: 'Frá',
  creditPre: 'Hannað af', creditAria: 'Hannað af SNDR Studio',
  protoNote: 'Frumgerð: hönnunarhugmynd, ekki vefsíða BYGG. Myndir, texti og merki eru frá BYGG; verð eru ásett verð söluaðila; sýnishorn eru merkt sem slík.',
  ledgerHeadSize: 'Stærð', ledgerHeadPrice: 'Ásett verð frá', ledgerHeadStat: 'Staða', ledgerSample: 'Dæmi: staðan kemur af söluvef', ledgerGo: 'Skrá áhuga',
  ledgerSizeUnit: 'm² skráð',
  ledgerNote: 'Verð eru ásett verð eins og söluaðilar verkefnisins birta þau, lesin 29. september 2026, og ná yfir þær íbúðir sem voru skráðar þann dag. Súlurnar sýna hvernig staða íbúða birtist þegar vefurinn tengist söluvef verkefnisins; tölurnar í þeim eru dæmi.',
  ledgerLinkMore: 'Fleiri verkefni í sölu á bygg.is', ledgerLinkHms: 'Fyrstu kaup, greiðslumat og hlutdeildarlán: sjá reglur hjá HMS',
  sellersLabel: 'Söluaðilar verkefnisins', sellersTail: 'Sjá einnig söluvef verkefnisins.',
  nextTitleSep: '', nextLabel: 'Næst',
  ctaLink: 'Skrá áhuga',
  aboutTitle: 'Um okkur | BYGG', aboutDesc: 'Byggingarfélag Gylfa og Gunnars (BYGG) var stofnað árið 1984 og hefur byggt yfir 4.000 íbúðir á höfuðborgarsvæðinu.',
  aboutMarquee: 'Um okkur', aboutLabel: '(Um okkur)', aboutH1: 'Um BYGG',
  aboutStatementLead: 'Byggingarfélag Gylfa og Gunnars ',
  aboutStatement: 'hf. (BYGG) var stofnað árið 1984 af þeim Gylfa Ómari Héðinssyni múrarameistara og Gunnari Þorlákssyni húsasmíðameistara. Byggingarfélagið hefur byggt yfir 4.000 íbúðir á höfuðborgarsvæðinu sem og tugþúsundir fermetra af atvinnuhúsnæði.',
  aboutFilmAlt: 'Gylfi Ómar Héðinsson og Gunnar Þorláksson við Sjálandshverfið', aboutFilmLink: 'Sjá myndbandið á bygg.is',
  aboutQuote: '„Byggingarfélag Gylfa og Gunnars er þekkt fyrir traust og örugg vinnubrögð, vandaðan frágang og efndir á umsömdum afhendingartíma.“', aboutQuoteAlt: 'Gunnar Þorláksson og Gylfi Ómar Héðinsson árið 1982',
  aboutMarquee2: 'BYGG', aboutLabel2: '(Gildin okkar)', aboutValuesLead: 'Reynsla, ',
  aboutValues: 'fagmennska og metnaður. Gildin okkar lýsa því hvernig við störfum. Hjá fyrirtækinu starfa nú um 100 manns og fjöldi undirverktaka. Fyrirtækið starfar á öllum sviðum sem snúa að byggingarstarfsemi.',
  aboutLabel3: '(Saga félagsins)', aboutHistoryLead: 'Frá ', aboutHistory: 'fyrsta verkefni til afhendingar fullbúinna íbúða árið 1989 til verkefna sem eru í vinnslu í dag.',
  aboutLabel4: '(Starfsfólk)', aboutPeople: 'Fólkið sem svarar. Netföng deilda eru birt á síðunni Hafa samband.',
  pillars: '(01)|(02)|(03)|(04)',
  aboutCta: 'Skoðaðu íbúðir í sölu', aboutCtaLink: 'Til sölu', aboutBreak: 'Sjálandshverfi í Garðabæ',
  aboutNextLabel: 'Næst',
  contactTitle: 'Hafa samband | BYGG', contactDesc: 'Skráðu áhuga á íbúð frá BYGG eða spurðu um atvinnuhúsnæði til leigu. Skráningin fer til söluaðila verkefnisins.',
  contactWord: 'Hafa samband', contactH1: 'Hafa samband', contactHeading: 'Skráðu áhuga á íbúð.',
  chOffice: 'Sími', chRental: 'Leigueignir', chService: 'Þjónustudeild', chHours: 'Skrifstofa',
  hoursText: 'Borgartún 31, mán-fim 9:00-15:00, fös 9:00-14:00', copyDone: 'Netfang afritað', copyAria: 'Afrita netfang ',
  tabBuyer: 'Kaupandi', tabTenant: 'Atvinnuhúsnæði', tabsAria: 'Tegund fyrirspurnar',
  fName: 'Nafn*', fEmail: 'Netfang*', fPhone: 'Sími*', fCountry: 'Land*', fProject: 'Verkefni*', fRooms: 'Herbergi', fSize: 'Stærð', fBudget: 'Verðbil',
  fFirst: 'Fyrstu kaup?', fFinance: 'Fjármögnun', fViewing: 'Hvenær viltu skoða?', fMessage: 'Skilaboð', fCompany: 'Fyrirtæki*', fProperty: 'Húsnæði*', fArea: 'Stærð í m² sem þarf',
  optRooms: '2 herbergi|3 herbergi|4 herbergi|5 herbergi eða fleiri',
  optSize: 'Allt að 80 m²|80-100 m²|100-130 m²|Yfir 130 m²',
  optBudget: 'Allt að 70 m.kr.|70-90 m.kr.|90-110 m.kr.|110-140 m.kr.|Yfir 140 m.kr.',
  optFirst: 'Já, fyrstu kaup|Nei',
  optFinance: 'Greiðslumat tilbúið|Greiðslumat í vinnslu|Ekki hafið',
  optViewing: 'Opið hús|Virka daga eftir kl. 16|Um helgar|Sem fyrst',
  hintFinance: 'Reglur um fyrstu kaup, greiðslumat og hlutdeildarlán birtast hjá HMS, og því er hér aðeins hlekkur en engin regla eða upphæð:',
  hintFinanceLink: 'hms.is: hlutdeildarlán',
  consent: 'Ég samþykki að upplýsingarnar fari til BYGG og söluaðila verkefnisins. Sjá ',
  consentLink: 'persónuupplýsingar í frumgerðinni', consentTail: '.',
  send: 'Senda', sending: 'Sendi...', phonePh: 'Sími*', phoneNeeded: 'Sláðu inn símanúmer.',
  formError: 'Eitthvað fór úrskeiðis. Prófaðu aftur eða hringdu í 562 2991.',
  sampleForm: 'Frumgerð: ekkert er sent eða vistað.',
  thanksTitle: 'Takk fyrir', thanksText: 'Skráningin er móttekin.', thanksNote: 'Frumgerð: ekkert var sent eða vistað. Svona myndi skráningin fara.', thanksMore: 'Halda áfram',
  thanksBuyer: 'Skráningin fer í skráningarkerfi BYGG og til söluaðila verkefnisins, ásamt óskum þínum um herbergi, stærð, verð, fjármögnun og skoðunartíma:',
  thanksTenant: 'Skráningin fer til þeirra sem sjá um leigueignir BYGG.',
  policyTitle: 'Persónuupplýsingar í frumgerðinni',
  policy: '<p>Þetta er frumgerð. Ekkert sem þú slærð inn er sent eða vistað, hvorki hjá BYGG, söluaðilum né SNDR Studio.</p><h4>Í raunverulegri útgáfu</h4><p>Nafn, netfang, sími og óskir um íbúð (verkefni, herbergi, stærð, verðbil, fyrstu kaup, fjármögnun og skoðunartími) færu í skráningarkerfi BYGG og til söluaðila verkefnisins.</p><h4>Persónuverndarstefna</h4><p>Persónuverndarstefna og vinnsluskilmálar væru þá frá BYGG og skráð á vefnum áður en hann færi í loftið.</p>',
  filmPlay: 'Spila myndband', filmPause: 'Stöðva myndband',
  notFoundTitle: 'Síða fannst ekki | BYGG', notFoundDesc: 'Síðan sem þú leitar að fannst ekki. Farðu aftur á forsíðu BYGG.',
  notFoundWord: '404', notFoundHeading: 'Þessi síða er ekki til.', chExplore: 'Skoða', chBack: 'Aftur á forsíðu', chHelp: 'Vantar aðstoð?', chContactUs: 'Hafa samband',
  notFoundText: 'Hlekkurinn gæti verið úreltur eða síðan flutt. Farðu aftur á forsíðu eða hafðu samband.',
  myTitle: 'Mín íbúð | BYGG', myDesc: 'Afhending og athugasemdir eftir afhendingu íbúðar. Frumgerð: sýnir hvernig þjónustudeild BYGG gæti tekið við athugasemdum.',
  myWord: 'Mín íbúð', myH1: 'Mín íbúð', myHeading: 'Eftir afhendingu.', tabHandover: 'Afhending', tabDefect: 'Athugasemd',
  hHandover: 'Dæmi um afhendingarlista. BYGG stillir hann fyrir hvert verkefni; hér er hann aðeins uppsetning.',
  tickHandover: 'Skilalýsing lesin|Lyklar afhentir|Íbúð skoðuð með verkstjóra|Athugasemdir skráðar skriflega|Mælar lesnir og skráðir',
  fUnit: 'Íbúðarnúmer*', fRoom: 'Hvar í íbúðinni?', optRoom: 'Eldhús|Stofa|Baðherbergi|Svefnherbergi|Þvottahús|Geymsla|Svalir eða verönd|Sameign', fDefect: 'Hvað er að?*', fPhoto: 'Myndir',
  sendList: 'Vista lista', sendDefect: 'Senda athugasemd',
  hDefect: 'Athugasemdin fer til þjónustudeildar BYGG með mynd, verkefni og íbúðarnúmeri, og þú sérð stöðu hennar. Frumgerð: ekkert er sent.',
  thanksDefect: 'Athugasemdin fer til þjónustudeildar BYGG, merkt verkefni og íbúð, og fær stöðu sem hægt er að fylgjast með.',
  thanksList: 'Listinn vistast á íbúðinni og þjónustudeildin sér hvað er eftir.',
  ovTitle: 'Söluyfirlit (sýnishorn) | BYGG', ovDesc: 'Sýnishorn af yfirliti sem BYGG fengi ef áhugaskráning væri á eigin vef: áhugi eftir verkefni og gerð, hvar hann stöðvast og svartími söluaðila. Allar tölur eru dæmi.',
  ovMarquee: 'Söluyfirlit', ovLabel: '(Sýnishorn)', ovH1: 'Söluyfirlit BYGG (sýnishorn)',
  ovLead: 'Yfirlitið ', ovStatement: 'sem BYGG sæi ef hver áhugaskráning á bygg.is færi líka í skráningarkerfi félagsins: hver spyr um hvaða verkefni og gerð, hvar áhuginn stöðvast og hversu fljótt söluaðilar svara.',
  ovNoticeTag: 'Dæmigögn', ovNotice: 'Allar tölur á þessari síðu eru búnar til til að sýna útlitið. Engin þeirra er raunstaða og engin þeirra kemur frá BYGG eða söluaðilum.',
  ovDemandTitle: 'Áhugi eftir verkefni og gerð', ovDemandSub: 'Skráningar síðustu 90 daga (dæmi).',
  ovFunnelTitle: 'Hvar áhuginn stöðvast', ovFunnelSub: 'Frá skráningu til kaupsamnings (dæmi).', ovFunnelNote: 'Í þessu dæmi stöðvast áhuginn helst milli þess sem söluaðili svarar og skoðunar. Þar er hægt að grípa inn í.',
  ovSellersTitle: 'Söluaðilar og svartími', ovSellersSub: 'Miðgildi þess tíma sem líður frá skráningu þar til söluaðili svarar (dæmi). Nöfn eru falin í sýnishorninu.',
  ovSellerCol1: 'Söluaðili', ovSellerCol2: 'Skráningar sendar', ovSellerCol3: 'Svartími, klst.', ovSellerCol4: 'Skoðun bókuð',
  ovRegistrations: 'skráningar', ovCta: 'Sjá skráninguna sem kaupandi sér', ovCtaLink: 'Skrá áhuga', ovBreak: 'Söluvefirnir sýna stöðu íbúða; skráningin sýnir hver spyr',
  ovNext: 'Næst',
  crumbsHome: 'Forsíða', privacyNote: '',
  ld: 'BYGG',
  fromWord: 'Frá', unitWord: 'íbúðir', hoursShort: 'klst.',
  homeSub: 'Nýjar íbúðir í sölu í sjö verkefnum. Ásett verð og söluaðilar hvers verkefnis eru hér á einum stað, og þú skráir áhuga einu sinni.',
  homeCtaEnquire: 'Skrá áhuga', homeCtaSale: 'Sjá íbúðir í sölu',
  factsAria: 'Yfirlit', factProjects: 'verkefni í sölu', factSellers: 'söluaðilar', factPrice: 'lægsta ásetta verð', factFounded: 'stofnað',
  saleTitle: 'Íbúðir í sölu',
  saleText: 'Fjögur verkefni eru hér með eigin síðu. Verð eru ásett verð söluaðila, lesin 29. september 2026, og ná yfir þær íbúðir sem voru skráðar þann dag.',
  cardPrice: 'Ásett verð frá', cardSizes: 'Skráðar stærðir', cardSellers: 'Söluaðilar', cardSellersN: 'söluaðilar', cardView: 'Skoða verkefnið', cardEnquire: 'Skrá áhuga',
  moreTitle: 'Fleiri verkefni í sölu', moreText: 'Þessi verkefni eru á bygg.is. Þú getur skráð áhuga á þeim í eyðublaðinu.', moreView: 'Sjá á bygg.is', moreSellers: 'söluaðilar',
  howTitle: 'Svona virkar skráningin',
  how1: 'Veldu verkefni', how1Text: 'Hver íbúð er seld hjá söluaðilum verkefnisins. Hér sérðu ásett verð og söluaðila hvers verkefnis á einum stað.',
  how2: 'Skráðu áhuga einu sinni', how2Text: 'Nafn, netfang, sími og verkefni. Herbergi, stærð, verðbil, fjármögnun og skoðunartími eru valfrjáls.',
  how3: 'Söluaðilar fá skráninguna', how3Text: 'Í raunverulegri útgáfu fer hún í skráningarkerfi BYGG og til söluaðila verkefnisins. Í frumgerðinni er ekkert sent.',
  agTitle: 'Söluaðilar', agText: 'Hringdu beint í söluaðila verkefnis. Listinn er eins og BYGG og söluvefirnir birta hann.',
  agName: 'Söluaðili', agPhone: 'Sími', agProjects: 'Verkefni',
  moreNeedTitle: 'Annað sem þú gætir þurft',
  needRental: 'Atvinnuhúsnæði til leigu', needRentalText: 'Borgartún 31, Vegmúli 2, Síðumúli 24, Skógarhlíð 12 og Lambhagavegur 33.', needRentalGo: 'Spyrjast fyrir',
  needService: 'Þjónustudeild', needServiceText: 'Eftir afhendingu íbúðar: afhending og athugasemdir.', needServiceGo: 'Mín íbúð',
  needFinance: 'Fyrstu kaup og fjármögnun', needFinanceText: 'Reglur um greiðslumat og hlutdeildarlán eru hjá HMS.', needFinanceGo: 'hms.is',
  endTitle: 'Hafðu samband', endText: 'Sími og opnunartími skrifstofu BYGG.',
}
const EN_T: Record<string, string> = {
  htmlLang: 'en',
  skip: 'Skip to content',
  brand: 'BYGG, home', logoAlt: 'BYGG',
  about: 'About', contact: 'Contact', home: 'Home', forSale: 'For sale', forSaleAria: 'Apartments for sale',
  menuOpen: 'Open menu', menuClose: 'Close menu', nav: 'Main menu', navPrimary: 'Pages',
  myHome: 'My home', overview: 'Sales overview (sample)', phoneLabel: 'Phone', langSwitch: 'Íslenska', langHref: 'is',
  pickerAria: 'Apartments for sale', homeTile: 'Home', homeTileBlurb: 'New apartments from BYGG',
  scroll: 'Scroll', scrollHint: '(Scroll)', next: 'Next', play: 'Play', stop: 'Stop', close: 'Close',
  colophon: 'BYGG · Founded 1984',
  homeMarquee: 'New apartments',
  homeLead: 'One of the most experienced builders in the Icelandic market.',
  homeTitle: 'BYGG | New apartments and commercial property',
  homeDesc: 'BYGG (Byggingarfélag Gylfa og Gunnars) has built more than 4,000 apartments in the capital area. See the apartments for sale and register your interest.',
  chipNote: "Sellers' asking price, read 29.9.2026", chipFrom: 'From',
  creditPre: 'Designed by', creditAria: 'Designed by SNDR Studio',
  protoNote: "Prototype: a design concept, not BYGG's website. Pictures, text and logo are BYGG's; prices are the sellers' asking prices; samples are marked as such.",
  ledgerHeadSize: 'Size', ledgerHeadPrice: 'Asking price from', ledgerHeadStat: 'Status', ledgerSample: 'Sample: status will come from the sales site', ledgerGo: 'Register interest',
  ledgerSizeUnit: 'm² listed',
  ledgerNote: "Prices are the asking prices the project's sellers publish, read on 29 September 2026, and cover the apartments listed that day. The bars show how apartment status appears once the site is connected to the project's sales site; the figures in them are samples.",
  ledgerLinkMore: 'More projects for sale on bygg.is', ledgerLinkHms: 'First-time buyers, payment assessment and shared-equity loans: see the rules at HMS (in Icelandic)',
  sellersLabel: "The project's sellers", sellersTail: "See also the project's sales site.",
  nextTitleSep: '', nextLabel: 'Next',
  ctaLink: 'Register interest',
  aboutTitle: 'About | BYGG', aboutDesc: 'BYGG (Byggingarfélag Gylfa og Gunnars) was founded in 1984 and has built more than 4,000 apartments in the capital area.',
  aboutMarquee: 'About us', aboutLabel: '(About us)', aboutH1: 'About BYGG',
  aboutStatementLead: 'Byggingarfélag Gylfa og Gunnars ',
  aboutStatement: '(BYGG) was founded in 1984 by Gylfi Ómar Héðinsson, master mason, and Gunnar Þorláksson, master carpenter. The company has built more than 4,000 apartments in the capital area, and tens of thousands of square metres of commercial property.',
  aboutFilmAlt: 'Gylfi Ómar Héðinsson and Gunnar Þorláksson by Sjálandshverfi', aboutFilmLink: "Watch the film on bygg.is (in Icelandic)",
  aboutQuote: '“Byggingarfélag Gylfa og Gunnars is known for reliable and safe workmanship, careful finish and keeping the agreed handover date.”', aboutQuoteAlt: 'Gunnar Þorláksson and Gylfi Ómar Héðinsson in 1982',
  aboutMarquee2: 'BYGG', aboutLabel2: '(Our values)', aboutValuesLead: 'Experience, ',
  aboutValues: 'professionalism and ambition. Our values describe how we work. About 100 people now work at the company, along with many subcontractors, and it works in every area of construction.',
  aboutLabel3: '(The company story)', aboutHistoryLead: 'From ', aboutHistory: 'the first project handed over as finished apartments in 1989 to the projects under way today.',
  aboutLabel4: '(People)', aboutPeople: 'The people who answer. Department email addresses are on the Contact page.',
  pillars: '(01)|(02)|(03)|(04)',
  aboutCta: 'See the apartments for sale', aboutCtaLink: 'For sale', aboutBreak: 'Sjálandshverfi in Garðabær',
  aboutNextLabel: 'Next',
  contactTitle: 'Contact | BYGG', contactDesc: 'Register your interest in a BYGG apartment or ask about commercial property to let. Your enquiry goes to the project’s sellers.',
  contactWord: 'Contact', contactH1: 'Contact', contactHeading: 'Register your interest.',
  chOffice: 'Phone', chRental: 'Rental property', chService: 'Service department', chHours: 'Office',
  hoursText: 'Borgartún 31, Mon-Thu 9:00-15:00, Fri 9:00-14:00', copyDone: 'Email copied', copyAria: 'Copy email address ',
  tabBuyer: 'Buyer', tabTenant: 'Commercial', tabsAria: 'Type of enquiry',
  fName: 'Full name*', fEmail: 'Email*', fPhone: 'Phone*', fCountry: 'Country*', fProject: 'Project*', fRooms: 'Rooms', fSize: 'Size', fBudget: 'Budget',
  fFirst: 'First-time buyer?', fFinance: 'Financing', fViewing: 'When would you like to view?', fMessage: 'Message', fCompany: 'Company*', fProperty: 'Property*', fArea: 'Space needed, m²',
  optRooms: '2 rooms|3 rooms|4 rooms|5 rooms or more',
  optSize: 'Up to 80 m²|80-100 m²|100-130 m²|Over 130 m²',
  optBudget: 'Up to ISK 70m|ISK 70-90m|ISK 90-110m|ISK 110-140m|Over ISK 140m',
  optFirst: 'Yes, first-time buyer|No',
  optFinance: 'Payment assessment ready|Payment assessment in progress|Not started',
  optViewing: 'Open house|Weekdays after 16:00|Weekends|As soon as possible',
  hintFinance: 'Rules for first-time buyers, payment assessments and shared-equity loans are published by HMS, so this is a link only, with no rule or amount:',
  hintFinanceLink: 'hms.is: shared-equity loan',
  consent: 'I agree that the details go to BYGG and to the project’s sellers. See ',
  consentLink: 'personal data in the prototype', consentTail: '.',
  send: 'Send', sending: 'Sending...', phonePh: 'Phone*', phoneNeeded: 'Please enter your phone number.',
  formError: 'Something went wrong. Please try again or call 562 2991.',
  sampleForm: 'Prototype: nothing is sent or stored.',
  thanksTitle: 'Thank you', thanksText: 'Your enquiry has been received.', thanksNote: 'Prototype: nothing was sent or stored. This is where it would go.', thanksMore: 'Continue browsing',
  thanksBuyer: "The enquiry goes into BYGG's own record and to the project's sellers, with your wishes for rooms, size, price, financing and viewing time:",
  thanksTenant: 'The enquiry goes to the people who look after BYGG’s rental property.',
  policyTitle: 'Personal data in the prototype',
  policy: '<p>This is a prototype. Nothing you type is sent or stored, not by BYGG, by the sellers or by SNDR Studio.</p><h4>In a real version</h4><p>Name, email, phone and wishes for an apartment (project, rooms, size, budget, first-time buyer, financing and viewing time) would go into BYGG’s own record and to the project’s sellers.</p><h4>Privacy policy</h4><p>The privacy policy and processing terms would come from BYGG and be published on the site before it went live.</p>',
  filmPlay: 'Play video', filmPause: 'Stop video',
  notFoundTitle: 'Page not found | BYGG', notFoundDesc: 'The page you are looking for could not be found. Return to the BYGG home page.',
  notFoundWord: '404', notFoundHeading: "This page doesn't exist.", chExplore: 'Explore', chBack: 'Back to homepage', chHelp: 'Need help?', chContactUs: 'Contact us',
  notFoundText: 'The link may be outdated, or the page may have moved. Go back to the home page or get in touch.',
  myTitle: 'My home | BYGG', myDesc: 'Handover and comments after an apartment is handed over. Prototype: shows how BYGG’s service department could take in comments.',
  myWord: 'My home', myH1: 'My home', myHeading: 'After handover.', tabHandover: 'Handover', tabDefect: 'Comment',
  hHandover: 'An example handover list. BYGG sets it up for each project; here it is only the layout.',
  tickHandover: 'Specification read|Keys handed over|Apartment inspected with the foreman|Comments recorded in writing|Meters read and recorded',
  fUnit: 'Apartment number*', fRoom: 'Where in the apartment?', optRoom: 'Kitchen|Living room|Bathroom|Bedroom|Laundry|Storeroom|Balcony or terrace|Shared areas', fDefect: 'What is wrong?*', fPhoto: 'Photos',
  sendList: 'Save list', sendDefect: 'Send comment',
  hDefect: "The comment goes to BYGG's service department with a photo, the project and the apartment number, and you can follow its status. Prototype: nothing is sent.",
  thanksDefect: "The comment goes to BYGG's service department, tagged with project and apartment, and gets a status you can follow.",
  thanksList: 'The list is saved on the apartment and the service department sees what is left.',
  ovTitle: 'Sales overview (sample) | BYGG', ovDesc: "A sample of the overview BYGG would get if interest registration lived on its own site: interest by project and size, where it stalls, and how fast sellers answer. All figures are samples.",
  ovMarquee: 'Overview', ovLabel: '(Sample)', ovH1: 'BYGG sales overview (sample)',
  ovLead: 'The overview ', ovStatement: "BYGG would see if every interest registration on bygg.is also went into the company's own record: who asks about which project and size, where interest stalls and how quickly the sellers answer.",
  ovNoticeTag: 'Sample data', ovNotice: 'Every figure on this page was made up to show the layout. None of them is real and none comes from BYGG or the sellers.',
  ovDemandTitle: 'Interest by project and size', ovDemandSub: 'Registrations in the last 90 days (sample).',
  ovFunnelTitle: 'Where interest stalls', ovFunnelSub: 'From registration to purchase agreement (sample).', ovFunnelNote: 'In this sample, interest stalls mostly between the seller answering and the viewing. That is where BYGG could step in.',
  ovSellersTitle: 'Sellers and response time', ovSellersSub: 'Median time from registration until the seller answers (sample). Names are hidden in the sample.',
  ovSellerCol1: 'Seller', ovSellerCol2: 'Enquiries sent', ovSellerCol3: 'Response, hours', ovSellerCol4: 'Viewing booked',
  ovRegistrations: 'registrations', ovCta: 'See the enquiry as a buyer sees it', ovCtaLink: 'Register interest', ovBreak: 'The sales sites show apartment status; the enquiry shows who is asking',
  ovNext: 'Next',
  crumbsHome: 'Home', privacyNote: '',
  ld: 'BYGG',
  fromWord: 'From', unitWord: 'apartments', hoursShort: 'h',
  homeSub: 'New apartments for sale in seven projects. Each project’s asking price and sellers are here in one place, and you register your interest once.',
  homeCtaEnquire: 'Register interest', homeCtaSale: 'See apartments for sale',
  factsAria: 'At a glance', factProjects: 'projects for sale', factSellers: 'sellers', factPrice: 'lowest asking price', factFounded: 'founded',
  saleTitle: 'Apartments for sale',
  saleText: 'Four projects have their own page here. Prices are the sellers’ asking prices, read on 29 September 2026, and cover the apartments listed that day.',
  cardPrice: 'Asking price from', cardSizes: 'Listed sizes', cardSellers: 'Sellers', cardSellersN: 'sellers', cardView: 'See the project', cardEnquire: 'Register interest',
  moreTitle: 'More projects for sale', moreText: 'These projects are on bygg.is. You can register your interest in them in the form.', moreView: 'See on bygg.is', moreSellers: 'sellers',
  howTitle: 'How registering works',
  how1: 'Choose a project', how1Text: 'Every apartment is sold by the project’s sellers. Here you see each project’s asking price and sellers in one place.',
  how2: 'Register once', how2Text: 'Name, email, phone and project. Rooms, size, price range, financing and viewing time are optional.',
  how3: 'The sellers receive it', how3Text: 'In a real version it goes into BYGG’s enquiry record and to the project’s sellers. In the prototype nothing is sent.',
  agTitle: 'Sellers', agText: 'Call a project’s seller directly. The list is as BYGG and the sales sites publish it.',
  agName: 'Seller', agPhone: 'Phone', agProjects: 'Projects',
  moreNeedTitle: 'Other things you may need',
  needRental: 'Commercial property to let', needRentalText: 'Borgartún 31, Vegmúli 2, Síðumúli 24, Skógarhlíð 12 and Lambhagavegur 33.', needRentalGo: 'Ask about it',
  needService: 'Service department', needServiceText: 'After handover: the handover and comments.', needServiceGo: 'My home',
  needFinance: 'First-time buyers and financing', needFinanceText: 'The rules on payment assessment and shared-equity loans are at HMS.', needFinanceGo: 'hms.is',
  endTitle: 'Get in touch', endText: 'Phone and opening hours of BYGG’s office.',
}
export const T: Record<Lang, Record<string, string>> = { is: IS_T, en: EN_T }

/* -------------------------------------------------------------------------------------------- catalogue entry */
export const companyEntry: PreviewCompany = {
  slug: 'bygg',
  route: '/preview/bygg',
  name: 'BYGG',
  sector: 'Byggingaraðili og fasteignaleiga',
  location: 'Borgartún 31, 105 Reykjavík',
  region: 'Reykjavík',
  established: 'Stofnað 1984, yfir 4.000 íbúðir.',
  currentUrl: 'https://www.bygg.is',
  ownerEmail: '',
  concept: 'Ein skráning fyrir níu söluaðila',
  conceptTagline:
    'BYGG selur íbúðir í gegnum söluaðila og tekur ekki við áhuga á eigin vef. Frumgerðin bætir við lagi ofan á söluvefina: verð og söluaðilar hvers verkefnis á einum stað, skráning á áhuga sem lendir hjá BYGG og söluaðila, og yfirlit sem sýnir hvar áhuginn stöðvast.',
  accent: '#244244',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}bygg/as-hero-s.webp`,
  ownPhotography: true,
  photoCredit: 'Ljósmyndir, tölvumyndir og merki eru í eigu BYGG og sótt af bygg.is 29. september 2026.',
  audit: {
    strengths: [
      'Yfir 4.000 íbúðir og 40 ára saga, skráð á vef félagsins sjálfs (stofnað 1984)',
      'Eigin tölvumyndir og ljósmyndir í góðri upplausn, meðal annars innimyndir af Ásvöllum',
      'Hagnaður upp á 694 m.kr. árið 2025 (vb.is, 8.9.2026)',
    ],
    weaknesses: [
      'Verð eru ekki á bygg.is og ekki á eldri söluvefjum (Bolholt); nýi söluvefurinn á Ásvöllum sýnir þau, frá 65,9 m.kr., og söluaðilar birta þau líka',
      'Enginn möguleiki á að skrá áhuga eða bóka skoðun á vefnum: aðeins netföng fyrir bókhald, mannauð, leigu og þjónustu',
      'Níu söluaðilar á sjö verkefnum, þrír til sex á hverju verkefni; á Ásvöllum eru fimm með sína eigin opnu daga á sömu síðunni',
      'Sumir textar eru úreltir: síðan um Bolholt 7-9 segir enn að afhending sé áætluð í febrúar 2026',
    ],
    opportunities: [
      'Ein skráning sem fer á rétta söluaðila og skilur eftir færslu hjá BYGG',
      'Ásett verð sýnt á vef BYGG þar sem söluaðilar birta það nú þegar',
      'Yfirlit sem sýnir eftirspurn eftir verkefni og gerð, og hvar hún stöðvast',
    ],
  },
  positioning:
    'BYGG smíðar mikið og selur í gegnum aðra. Vefurinn er glugginn þar sem kaupandinn sér verkefnið fyrst, en hann tekur ekki við neinu: engin skráning og engin skoðun, og verð sjást aðeins á nýjasta söluvefnum (Ásvellir). ' +
    'Frumgerðin lætur vefinn taka við áhuga, vísa honum á réttan söluaðila og skila BYGG yfirliti, ofan á söluvefina en ekki í staðinn fyrir þá.',
  /* No outreach drafted: Sindri has authorized the build only. BYGG publishes no sales or marketing contact. */
  outreach: { subject: '', body: '' },
}
