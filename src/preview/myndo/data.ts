/**
 * Myndó ljósmyndastofa ehf.
 *
 * Facts from her own site (myndo.is), her published verðskrá page, and her
 * fyrirtækjaskrá record. Prices and package descriptions are hers, verbatim.
 * A package is attached to a life stage ONLY where her own verðskrá names that
 * stage; elsewhere the card says to get in touch rather than inventing a price.
 */

export const STUDIO = {
  name: 'Myndó ljósmyndastofa',
  legal: 'Myndó ljósmyndastofa ehf',
  kt: '460607-1670',
  founded: '20.04.2007',
  owner: 'Ólína Kristín Margeirsdóttir',
  address: 'Hrafnshöfða 14, 270 Mosfellsbær',
  tel: '898 1744',
  telHref: '8981744',
  member: 'Ljósmyndarafélag Íslands',
} as const

export const HERO = {
  eyebrow: 'Ljósmyndastofa í Mosfellsbæ',
  headline: 'Sömu myndirnar, alla ævina.',
  lede:
    'Ólína hefur myndað fjölskyldur í Mosfellsbæ frá 2007. Frá bumbu og nýbura að fermingu, útskrift og brúðkaupi.',
  cta: { label: 'Bóka myndatöku', href: 'tel:8981744' },
} as const

/**
 * THE SIGNATURE. Her own service list, read in the order a life happens.
 * `photo` is set only where a real photograph of hers exists.
 */
export const STAGES = [
  {
    id: 'bumba', n: '01', name: 'Bumba',
    body: 'Meðgöngumyndataka. Listrænar og fallegar myndir af bumbunni áður en barnið kemur.',
    price: null, dur: null, photo: '/myndo/stage-bumba.webp',
    alt: 'Meðgöngumyndataka hjá Myndó.',
  },
  {
    id: 'nyburi', n: '02', name: 'Nýburi',
    body: 'Fer yfirleitt fram á fyrstu tíu dögum barnsins. Hlýtt og þægilegt umhverfi er í algjörum forgangi og myndatakan miðast við þarfir barnsins.',
    price: '48.200', dur: '2 til 4 klst', photo: '/myndo/stage-nyburi.webp',
    alt: 'Svarthvít mynd af nýfæddu barni sofandi.',
  },
  {
    id: 'born', n: '03', name: 'Börn',
    body: 'Barnamyndataka í stúdíóinu, þar sem börnin fá að vera þau sjálf.',
    price: '33.800', dur: 'um 30 mín', photo: '/myndo/stage-born.webp',
    alt: 'Barnamyndataka í ljósmyndastofunni.',
  },
  {
    id: 'ferming', n: '04', name: 'Ferming',
    body: 'Fermingarmyndataka. Myndirnar rata í albúm, á vegg og í boðskortin.',
    price: '33.800', dur: 'um 30 mín', photo: '/myndo/stage-ferming.webp',
    alt: 'Fermingarmyndataka hjá Myndó.',
  },
  {
    id: 'utskrift', n: '05', name: 'Útskrift',
    body: 'Stúdentsmyndataka, ein eða með systkinum og fjölskyldu.',
    price: '39.800', dur: 'um 60 mín', photo: '/myndo/stage-utskrift.webp',
    alt: 'Stúdentsmyndataka hjá Myndó.',
  },
  {
    id: 'gifting', n: '06', name: 'Gifting',
    body: 'Brúðkaupsmyndataka, hvort sem er í stúdíóinu eða úti í íslenskri náttúru.',
    price: null, dur: null, photo: '/myndo/stage-gifting.webp',
    alt: 'Brúðkaupsmyndataka hjá Myndó.',
  },
  {
    id: 'fjolskyldan', n: '07', name: 'Fjölskyldan',
    body: 'Allt að tíu manns saman, eða stórfjölskyldan með ömmu, afa og barnabörnum, öll saman og í sitthvoru lagi.',
    price: '39.800', dur: 'um 60 mín', photo: '/myndo/stage-fjolskyldan.webp',
    alt: 'Fjölskyldumyndataka hjá Myndó.',
  },
] as const

/** Extra frames from her own galleries, for the wide band. */
export const GALLERY = [
  'extra-born-0', 'extra-ferming-2', 'extra-gifting-4',
  'extra-born-1', 'extra-ferming-3', 'extra-gifting-5',
] as const

/** Her verðskrá, verbatim. */
export const PACKAGES = [
  { name: 'Lítil myndataka', price: '21.900', dur: 'um 10 til 15 mín',
    fits: 'Lítil einstaklingsmyndataka, til dæmis mynd í ferilskrá eða fyrir fjölmiðla.',
    incl: '1 til 2 fullunnar myndir' },
  { name: 'Miðmyndataka', price: '33.800', dur: 'um 30 mín',
    fits: 'Einstaklingur, barn eða ferming.',
    incl: '4 fullunnar myndir' },
  { name: 'Lengri myndataka', price: '39.800', dur: 'um 60 mín',
    fits: 'Einstaklingur, barn, ferming, stúdent, systkini og fjölskylda. Allt að 10 manns.',
    incl: '4 fullunnar myndir' },
  { name: 'Stór fjölskyldan', price: '45.800', dur: 'um 90 mín',
    fits: 'Stórfjölskyldur, tíu eða fleiri. Amma, afi og barnabörnin.',
    incl: '4 fullunnar myndir' },
  { name: 'Nýburar', price: '48.200', dur: '2 til 4 klst',
    fits: 'Ungbarnamyndataka á fyrstu tíu dögunum.',
    incl: '5 fullunnar myndir' },
] as const

export const PRINTS = [
  { k: 'Mynd í fullri upplausn', v: '9.900 kr. stk.', note: '20% afsláttur ef fleiri en þrjár eru keyptar' },
  { k: 'Albúm, 8 myndir', v: '23.660 kr.', note: 'Hægt er að fá hvaða fjölda sem er í albúm' },
  { k: 'Stækkanir með albúmi', v: '20 til 25% afsláttur', note: '' },
] as const

export const PRICE_NOTE =
  'Verðskráin er tvískipt: annars vegar myndatakan sjálf og hins vegar prentun, hvort sem það eru stakar myndir, albúm eða strigamyndir.'

/** Her own three steps, verbatim. */
export const PROCESS = [
  { n: '01', t: 'Myndatakan', b: 'Þið mætið og skemmtið ykkur vel í myndatökunni.' },
  { n: '02', t: 'Valið', b: 'Myndirnar fara inn á lokað vefsvæði þar sem þið skoðið og veljið, eða þið komið í skoðunartíma í stúdíóið.' },
  { n: '03', t: 'Afhending', b: 'Við fullvinnum myndirnar og afhendum ykkur.' },
] as const

export const SCHOOLS = {
  title: 'Skólamyndir',
  body: 'Myndó tekur skólamyndir og foreldrar geta pantað myndir úr skólamyndatöku beint af vefnum.',
} as const

export const OTHER = ['Passamyndir', 'Auglýsingamyndir', 'Landslag', 'Lagfæringar á gömlum myndum'] as const

export const OLINA = {
  name: 'Ólína Kristín Margeirsdóttir',
  role: 'Ljósmyndari',
  body: [
    'Ólína hefur rekið Myndó frá 2007 og myndar fjölskyldur á höfuðborgarsvæðinu, oftast í stúdíóinu á Hrafnshöfða í Mosfellsbæ.',
    'Hún er félagi í Ljósmyndarafélagi Íslands.',
  ],
} as const

export const IMAGES = {
  olina: '/myndo/olina.webp',
  nyburi2: '/myndo/nyburi2.webp',
} as const
