import type { PreviewCompany } from '../companies'

/**
 * RAFMIÐLUN HF. — rafmidlun.is (kt. 460896-2239), electrical contractor and importer, Ögurhvarf 8, Kópavogur.
 *
 * Every sentence about the business below is Rafmiðlun's own published copy (rafmidlun.is: forsíða,
 * starfsfólk, verkbeiðni, hafa samband and jafnlaunastefna, captured 2026-10-23), tidied only for
 * spelling where marked [lagað], or a fact in a public register (Fyrirtækjaskrá: Rafmiðlun hf. registered
 * 6 August 1996). They publish no projects, prices or capacities, so none are shown. Partner names
 * appear only as the logos on their own front page. The captions of the five steps in the line are ours:
 * they describe the drawing, and Rafmiðlun confirms them.
 *
 * Images: their logo, the partner logos and the two certificates from rafmidlun.is. Everything else is
 * our own drawing (iso.ts); there is no photography on their site to use.
 */

const BASE = import.meta.env.BASE_URL
export const ROUTE = '/preview/rafmidlun'

export interface Img { src: string; alt: string; w: number; h: number }
const brand = (key: string, alt: string, w: number, h: number, ext = 'webp'): Img => ({ src: `${BASE}rafmidlun/brand/${key}.${ext}`, alt, w, h })

export const LOGO = brand('rmlogo', 'Rafmiðlun', 287, 70, 'png')

/** the five logos on their front page, in their order */
export const PARTNERS: Img[] = [
  brand('elsteel', 'Elsteel', 300, 251),
  brand('wohner', 'Wöhner', 300, 251),
  brand('ide', 'IDE', 300, 251),
  brand('chint', 'CHINT', 300, 251),
  brand('pogliano', 'Pogliano Busbar', 600, 297),
]

export const BADGES = {
  framurskarandi: brand('framurskarandi', 'Framúrskarandi fyrirtæki 2015 til 2025, Creditinfo', 560, 448),
  jafnlaun: brand('jafnlaunavottun', 'Jafnlaunavottun 2025 til 2028', 480, 480),
}

export const CONTACT = {
  name: 'Rafmiðlun hf.',
  email: 'rafmidlun@rafmidlun.is',
  invoices: 'reikningar@rafmidlun.is',
  service: 'thjonusta@rafmidlun.is',
  kitchen: 'vidgerdir@rafmidlun.is',
  phone: '540 3500',
  phoneHref: 'tel:+3545403500',
  kitchenPhone: '540 3509',
  kitchenHref: 'tel:+3545403509',
  address: 'Ögurhvarf 8',
  postcode: '203 Kópavogur',
  serviceAddress: 'Flugumýri 32, 270 Mosfellsbær',
  hours: [
    { d: 'Mánudaga til fimmtudaga', t: '7:30 til 15:45' },
    { d: 'Föstudaga', t: '7:30 til 14:00' },
    { d: 'Helgar', t: 'Lokað' },
  ],
  kt: '460896-2239',
}

/** where they work, from their contact page and the titles on their staff list */
export const PLACES = [
  { k: 'Skrifstofa', v: 'Ögurhvarf 8, 203 Kópavogur', phone: '540 3500', href: 'tel:+3545403500', email: 'rafmidlun@rafmidlun.is', extra: 'Reikningar: reikningar@rafmidlun.is' },
  { k: 'Þjónusta', v: 'Flugumýri 32, 270 Mosfellsbær', phone: '540 3500', href: 'tel:+3545403500', email: 'thjonusta@rafmidlun.is' },
  { k: 'Þjónusta stóreldhústækja', v: 'Flugumýri 32, 270 Mosfellsbær', phone: '540 3509', href: 'tel:+3545403509', email: 'vidgerdir@rafmidlun.is' },
]

/* ── their words ─────────────────────────────────────────────────── */
export const TAGLINE = 'Betri lausnir'
export const LEAD = 'Rafmiðlun starfar á útboðsmarkaði ásamt því að veita víðtæka fyrirtækjaþjónustu.'
export const INTRO = 'Rafmiðlun er rafverktaka- og innflutningsfyrirtæki stofnað 1996 með höfuðstöðvar í Kópavogi.'
export const AIM = 'Okkar markmið er að veita alhliða þjónustu og lausnir á öllum sviðum rafverktöku.'
export const WHOLE = 'Fyrirtækið býður upp á heildarlausnir eins og ráðgjöf, hönnun, teikningar, efnisöflun og framkvæmd.'

export const ABOUT = [
  'Rafmiðlun hf. var stofnað árið 1996 og er í dag eitt stærsta og öflugasta rafverktakafyrirtæki á Íslandi og byggir á margra ára reynslu og fagmennsku.',
  /* [lagað: „uppá“ í „upp á“] */
  'Stefna fyrirtækisins er að bjóða upp á heildarlausnir á sviði rafverktöku eins og ráðgjöf, hönnun og teikningar, ásamt efnisöflun og framkvæmd.',
  'Rafmiðlun starfar á útboðsmarkaði ásamt því að þjónusta stóriðjur, fyrirtæki, stofnanir og er jafnframt öflugt í skápasmíði.',
]

export const SERVICE_WORDS = {
  title: 'Ábyrg og góð þjónusta',
  text: 'Við leggjum mikla áherslu á ábyrga og góða þjónustu við viðskiptavini okkar og höfum átt samstarf við innlenda sem erlenda byggingaraðila við fjölbreytt verkefni.',
}

/* ── the five steps of the drawn line: their sentence ───────────── */
export interface Stage {
  id: string
  n: string
  name: string
  /** ours: what the drawing shows at this step */
  line: string
}

export const STAGES: Stage[] = [
  { id: 'radgjof', n: '01', name: 'Ráðgjöf', line: 'Verkið byrjar á þörfunum og staðnum.' },
  { id: 'honnun', n: '02', name: 'Hönnun', line: 'Tækni- og hönnunardeild innanhúss.' },
  { id: 'teikningar', n: '03', name: 'Teikningar', line: 'Teikningin verður að skáp á verkstæðinu.' },
  { id: 'efnisoflun', n: '04', name: 'Efnisöflun', line: 'Rafmiðlun er líka innflutningsfyrirtæki.' },
  { id: 'framkvaemd', n: '05', name: 'Framkvæmd', line: 'Taflan fer á sinn stað og strengirnir upp í stigann.' },
]

/* ── the five fields of work, each its own page ─────────────────── */
export type Branch = 'verkbeidni' | 'eldhus' | 'verk' | 'umsokn'

export interface Service {
  slug: string
  name: string
  /** "um …" */
  about: string
  blurb: string
  paras: string[]
  /** what they list under it, verbatim */
  items?: string[]
  /** the station drawing that stands in for a photograph */
  art: number
  branch: Branch
  source: string
}

export const SERVICES: Service[] = [
  {
    slug: 'nylagnir', name: 'Nýlagnir', about: 'nýlagnir', art: 1, branch: 'verk',
    blurb: 'Almennar raflagnir, síma- og tölvulagnir og lagnir fyrir öryggiskerfi, með eigin tækni- og hönnunardeild.',
    paras: ['Meðal nýlagna sem Rafmiðlun tekur að sér eru: Almennar raflagnir, síma- og tölvulagnir ásamt lögnum fyrir öryggiskerfi.', 'Hjá Rafmiðlun er starfrækt tækni- og hönnunardeild.'],
    items: ['Almennar raflagnir', 'Síma- og tölvulagnir', 'Lagnir fyrir öryggiskerfi'],
    source: 'Nýlagnir, forsíða rafmidlun.is',
  },
  {
    slug: 'vidhald', name: 'Viðhald og þjónustusamningar', about: 'viðhald og þjónustusamninga', art: 4, branch: 'verkbeidni',
    blurb: 'Viðhald og breytingar á raflögnum, og þjónustusamningar við fyrirtæki um viðhald og eftirlit.',
    paras: ['Rafmiðlun tekur að sér viðhald og breytingar á raflögnum og hefur í auknum mæli gert þjónustusamninga við fyrirtæki um viðhald og eftirlit.'],
    items: ['Viðhald á raflögnum', 'Breytingar á raflögnum', 'Þjónustusamningar um viðhald og eftirlit'],
    source: 'Viðhald og breytingar, forsíða rafmidlun.is',
  },
  {
    slug: 'skapasmidi', name: 'Skápasmíði', about: 'skápasmíði', art: 2, branch: 'verk',
    blurb: 'Rafmiðlun er öflugt í skápasmíði, og er bæði rafverktaki og innflutningsfyrirtæki.',
    paras: ['Rafmiðlun starfar á útboðsmarkaði ásamt því að þjónusta stóriðjur, fyrirtæki, stofnanir og er jafnframt öflugt í skápasmíði.', INTRO],
    source: 'Um fyrirtækið, forsíða rafmidlun.is',
  },
  {
    slug: 'storidja', name: 'Stóriðja', about: 'stóriðju', art: 3, branch: 'verk',
    blurb: 'Verkefnastjórar og verkstjóri Rafmiðlunar starfa á Grundartanga, hjá Elkem og Norðuráli.',
    paras: ['Rafmiðlun starfar á útboðsmarkaði ásamt því að þjónusta stóriðjur, fyrirtæki, stofnanir og er jafnframt öflugt í skápasmíði.'],
    source: 'Um fyrirtækið, forsíða rafmidlun.is, og starfsheiti á starfsmannalista',
  },
  {
    slug: 'storeldhus', name: 'Þjónusta stóreldhústækja', about: 'þjónustu stóreldhústækja', art: 4, branch: 'eldhus',
    blurb: 'Viðgerðir á tækjum í stóreldhúsum, með eigin síma og netfang og aðstöðu að Flugumýri 32 í Mosfellsbæ.',
    paras: ['Þjónusta stóreldhústækja er með eigin síma, 540 3509, og netfang, vidgerdir@rafmidlun.is. Hún er að Flugumýri 32 í Mosfellsbæ, eins og önnur þjónusta Rafmiðlunar.'],
    source: 'Hafa samband og starfsfólk, rafmidlun.is',
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)

/* ── the request their Verkbeiðni page asks for, in their order ──── */
export const WORK_ORDER_READY = [
  { k: 'Nafn fyrirtækis og kennitala', v: 'Svo verkið fari á réttan reikning frá byrjun.' },
  { k: 'Heimilisfang verkstaðar', v: 'Hvar verkið er unnið, ekki endilega heimilisfang fyrirtækisins.' },
  { k: 'Tengiliður, sími og netfang', v: 'Sá sem tekur á móti rafvirkjanum á staðnum.' },
  { k: 'Lýsing á verkinu', v: 'Hvað á að gera eða hvað er bilað. Mynd hjálpar.' },
]

/** their job application asks for these, and the two positions */
export const JOB = {
  fields: ['Nafn', 'Netfang', 'Kennitala', 'Staða'],
  positions: ['Rafvirki', 'Nemi'],
}

/* ── equal pay policy, verbatim ─────────────────────────────────── */
export const EQUAL_PAY = {
  title: 'Jafnlaunastefna Rafmiðlunar',
  paras: [
    'Stefna Rafmiðlunar er að allt starfsfólk fær greitt jöfn laun fyrir sömu eða jafnverðmæt störf, óháð kyni, uppruna eða öðrum ómálefnalegum forsendum.',
    'Til að framfylgja stefnunni skuldbindur Rafmiðlun sig til að starfrækja vottað Jafnlaunakerfi í samræmi við kröfur Jafnlaunastaðals ÍST 85.',
  ],
  lead: 'Til að framfylgja stefnunni skuldbindur Rafmiðlun sig til að:',
  items: [
    'Vinna að stöðugum umbótum, eftirliti og viðbrögðum í samræmi við kröfur Jafnlaunastaðals',
    'Fylgja viðeigandi lögum, reglum og kjarasamningum sem gilda á hverjum tíma og staðfesta hlítingu við lög',
    'Framkvæma innri úttektir og rýni stjórnenda árlega',
    'Framkvæma launagreiningu að minnsta kosti árlega og kynna niðurstöður fyrir starfsfólki',
    'Bregðast við óútskýrðum launamun með stöðugu eftirliti og umbótum sé þess er þörf',
    'Kynna jafnlaunastefnu þessa fyrir öllu starfsfólki og hafa hana aðgengilega almenningi á heimasíðu fyrirtækisins',
  ],
}

/* ── staff, as their list has it (spelling [lagað]: „Verkstóri“, „Gæða-og“, „Innkaupa og“, „Norður Ál“) ── */
export interface Person { name: string; role: string; email: string; tel: string }
export interface StaffGroup { id: string; name: string; people: Person[] }

export const STAFF: StaffGroup[] = [
  { id: 'skrifstofa', name: "Skrifstofa", people: [
    { name: "Ásgrímur Örvar Jónsson", role: "Verkefnastjóri", email: 'orvar@rafmidlun.is', tel: '843-3524' },
    { name: "Baldur Á. Steinarsson", role: "Fjármála- og framkvæmdastjóri", email: 'baldur@rafmidlun.is', tel: '843-3505' },
    { name: "Björgvin R. Pálsson", role: "Stjórnarformaður og verkefnastjóri", email: 'bjoggi@rafmidlun.is', tel: '843-3506' },
    { name: "Elín Ósk Sigurðardóttir", role: "Aðalbókari", email: 'elinosk@rafmidlun.is', tel: '540-3519' },
    { name: "Guðjón Halldórsson", role: "Verkefnastjóri", email: 'gudjon@rafmidlun.is', tel: '843-5857' },
    { name: "Guðni Þór Guðrúnarson", role: "Verkefnastjóri", email: 'gudni@rafmidlun.is', tel: '843-5894' },
    { name: "Hrefna Einarsdóttir", role: "Bókhald", email: 'hrefna@rafmidlun.is', tel: '540-3516' },
    { name: "Jónína H Kristjánsdóttir", role: "Launafulltrúi, verkbókhald og innheimta", email: 'jonina@rafmidlun.is', tel: '540-3508' },
    { name: "Kolbeinn Sverrisson", role: "Innkaupa- og lagerstjóri", email: 'kolbeinn@rafmidlun.is', tel: '540-3515' },
    { name: "Óskar Þórisson", role: "Gæða- og verkefnastjóri", email: 'oskar@rafmidlun.is', tel: '843-3523' },
    { name: "Sigmar Stefnisson", role: "Innkaupastjóri Verkefna", email: 'sigmar@rafmidlun.is', tel: '843-5858' },
    { name: "Vilborg Hannesdóttir", role: "Mannauðsstjóri", email: 'vilborg@rafmidlun.is', tel: '843-5880' },
  ] },
  { id: 'verk', name: "Verkefna og verkstjórar", people: [
    { name: "Atli Már Bjarnason", role: "Verkefnastjóri", email: 'atli@rafmidlun.is', tel: '843-5884' },
    { name: "Ari Rannveigarson", role: "Verkstjóri", email: '', tel: '843-5893' },
    { name: "Bjarki Björgvinsson", role: "Verkefnastjóri", email: 'bjarkib@rafmidlun.is', tel: '843-3514' },
    { name: "Brynjar Sigurðsson", role: "Verkstjóri", email: 'brynjar@rafmidlun.is', tel: '843-3511' },
    { name: "Damian Surowiec", role: "Verkstjóri", email: 'damian@rafmidlun.is', tel: '843-3510' },
    { name: "Egidijus Zilius", role: "Verkstjóri", email: 'egidijus@rafmidlun.is', tel: '843-3512' },
    { name: "Elías Borgar Ómarsson", role: "Verkstjóri, Grundartanga", email: 'elias@rafmidlun.is', tel: '843-5865' },
    { name: "Fannar Hrafn Ragnarsson", role: "Verkstjóri", email: 'fannar@rafmidlun.is', tel: '843-3518' },
    { name: "Gísli Birgisson", role: "Verkefnastjóri", email: 'gislib@rafmidlun.is', tel: '843-3504' },
    { name: "Halldór Þorgeir Jónatansson", role: "Verkstjóri", email: 'halldor@rafmidlun.is', tel: '843-3519' },
    { name: "Hannes Svanur Grétarsson", role: "Verkefnastjóri", email: 'hannes@rafmidlun.is', tel: '843-3501' },
    { name: "Helgi Þór Guðbjartsson", role: "Verkstjóri", email: 'helgi@rafmidlun.is', tel: '843-3525' },
    { name: "Hrólfur Þórarinsson", role: "Verkstjóri", email: '', tel: '843-3527' },
    { name: "Ingólfur Sigurðsson", role: "Verkefnastjóri", email: 'ingo@rafmidlun.is', tel: '843-3517' },
    { name: "Kristján Fannar Leifsson", role: "Verkstjóri", email: '', tel: '' },
    { name: "Magnús Már Steinarsson", role: "Verkefnastjóri", email: 'magnus@rafmidlun.is', tel: '843-3507' },
    { name: "Níels Árni Ásgeirsson", role: "Verkstjóri", email: 'niels@rafmidlun.is', tel: '843-5878' },
    { name: "Olgeir Sölvi Karvelsson", role: "Verkefnastjóri, Elkem Grundartanga", email: 'olgeir@rafmidlun.is', tel: '843-5877' },
    { name: "Óskar Hlíðar Jónsson", role: "Verkefnastjóri, Norðurál Grundartanga", email: 'oskarh@rafmidlun.is', tel: '843-5853' },
    { name: "Þorvaldur Sveinsson", role: "Þjónustustjóri", email: 'valdi@rafmidlun.is', tel: '843-3529' },
  ] },
  { id: 'thjonusta', name: "Þjónustan", people: [
    { name: "Eduardo Rodrigo Alonson", role: "Þjónusta sérverkefna", email: 'eduardo@rafmidlun.is', tel: '' },
    { name: "Hallur Aron Sigurðsson", role: "Þjónusta", email: 'hallur@rafmidlun.is', tel: '843-5861' },
    { name: "Hilmar Benedikt Sverrisson", role: "Þjónusta", email: 'hilmar@rafmidlun.is', tel: '' },
    { name: "Linas Leskys", role: "Þjónusta", email: 'linas@rafmidlun.is', tel: '843-5874' },
    { name: "Jakob Jóhannesson", role: "Þjónusta", email: 'jakob@rafmidlun.is', tel: '' },
    { name: "Óskar Örn Gíslasson", role: "Þjónusta", email: 'oskarorn@rafmidlun.is', tel: '' },
    { name: "Sigurberg Rúriksson", role: "Þjónusta", email: 'sigurberg@rafmidlun.is', tel: '843-5864' },
    { name: "Sigþór Vopni Vigfússon", role: "Þjónustustjóri", email: 'sissi@rafmidlun.is', tel: '843-3516' },
    { name: "Yngvi Freyr Guðmundsson", role: "Þjónusta", email: 'yngvi@rafmidlun.is', tel: '' },
  ] },
  { id: 'eldhus', name: "Þjónusta stóreldhústækja", people: [
    { name: "Björn Kr. Marteinsson", role: "Þjónusta stóreldhústæki", email: 'bjossi@rafmidlun.is', tel: '843-3500' },
    { name: "Sebastian Galka", role: "Þjónusta stóreldhústæki", email: 'sebastian@rafmidlun.is', tel: '843-3515' },
    { name: "Þorleifur Jóhannes Á Reynisson", role: "Þjónusta stóreldhústæki", email: 'thorleifur@rafmidlun.is', tel: '843-5886' },
  ] },
  { id: 'verkstaedi', name: "Verkstæði", people: [
    { name: "Haraldur Ingi Gunnarsson", role: "Verkstæði", email: '', tel: '843-5879' },
    { name: "Knútur Örn Bjarnason", role: "Verkstæði", email: 'knutur@rafmidlun.is', tel: '843-3521' },
    { name: "Magnús Sigurjonsson", role: "Verkstæði", email: 'magnuss@rafmidlun.is', tel: '540-3500' },
  ] },
]

export const staffCount = STAFF.reduce((n, g) => n + g.people.length, 0)
export const telHref = (t: string) => `tel:+354${t.replace(/\D/g, '')}`
/** the people on Grundartanga, by their titles */
export const GRUNDARTANGI = STAFF.flatMap((g) => g.people).filter((p) => p.role.includes('Grundartanga'))

/* ── the page-level facts the audit rests on ───────────────────── */
export const companyEntry: PreviewCompany = {
  slug: 'rafmidlun',
  route: ROUTE,
  name: 'Rafmiðlun hf.',
  sector: 'Rafverktaki, skápasmíði og innflutningur',
  location: 'Kópavogur',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 1996',
  currentUrl: 'https://rafmidlun.is',
  ownerEmail: CONTACT.email,
  concept: 'Frá ráðgjöf til framkvæmdar',
  conceptTagline:
    'Þeirra eigin setning, ráðgjöf, hönnun, teikningar, efnisöflun og framkvæmd, teiknuð sem ein lína þar sem ein tafla verður til, og verkbeiðnin komin aftur á vefinn.',
  accent: '#004d91',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}rafmidlun/brand/thumb.webp`,
  ownPhotography: false,
  photoCredit: 'Engar ljósmyndir: teikningarnar eru unnar fyrir frumgerðina. Merki Rafmiðlunar, merki birgja og vottunarmerki eru af rafmidlun.is.',
  audit: {
    strengths: [
      'Eitt stærsta rafverktakafyrirtæki landsins, stofnað 1996, Framúrskarandi fyrirtæki í 10 ár (2015 til 2025)',
      'Heildarlausnir á einum stað: ráðgjöf, hönnun, teikningar, efnisöflun og framkvæmd, og eigin skápasmíði',
      'Starfsmannalisti með 47 nöfnum, beinum símum og netföngum, og jafnlaunavottun 2025 til 2028',
    ],
    weaknesses: [
      'Eyðublöð fyrir verkbeiðnir eru „ekki aðgengileg eins og er“: viðskiptavinir eru beðnir um að senda tölvupóst',
      'Starfsumsóknir sömuleiðis: eyðublaðið er ekki aðgengilegt og umsækjendur senda póst',
      'Engin síða fyrir skápasmíði, stóriðju, þjónustusamninga eða þjónustu stóreldhústækja, þótt forsíðan nefni þær allar',
    ],
    opportunities: [
      'Verkbeiðni sem spyr um nákvæmlega það sem þeirra eigin síða biður um og fer á rétt netfang',
      'Ein lína sem sýnir heildarlausnina: frá ráðgjöf til framkvæmdar, með töfluna sem verður til',
      'Hvert svið á sína síðu, og starfsumsókn fyrir rafvirkja og nema',
    ],
  },
  positioning:
    'Rafmiðlun er rafverktaka- og innflutningsfyrirtæki sem býður heildarlausnir, frá ráðgjöf til framkvæmdar, og þjónustar stóriðju, fyrirtæki og stofnanir. Frumgerðin byggir á þeirra eigin orðum: ein teiknuð lína þar sem tafla verður til, hvert svið á sinni síðu, og verkbeiðnin og starfsumsóknin aftur á vefnum.',
  outreach: {
    subject: 'Verkbeiðnin aftur á vef Rafmiðlunar',
    body: '[HLEKKUR Á FRUMGERÐ]\n\n(Drög, textinn er skrifaður þegar úttekt lýkur.)',
  },
}
