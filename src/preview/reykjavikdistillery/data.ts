/**
 * 64° Reykjavik Distillery — "Frá villtu í glas"
 *
 * Creative direction: a dark, cinematic spirits-house. The page is a single
 * descent — from the wild Icelandic highland, through the forage and the
 * copper still, down into the glass and the real bottles.
 *
 * HONESTY (standing rule): company facts are real and public — founded 2009,
 * first Icelandic micro-distillery of its kind, family-run, foraged & naturally
 * infused Icelandic botanicals, small-batch distillation in Hafnarfjörður
 * (Lónsbraut 6), sold via Vínbúðin / Fríhöfnin / Nammi.is / 60+ bars /
 * Icelandair & Play, the "presented by the elf Benedikt" origin story, and the
 * real product names + bottle photography (sourced from reykjavikdistillery.is).
 * SAMPLE / "sýnishorn" (disclaimed on the page): tasting notes, prices, harvest
 * seasons, and most ABV/sizes — except where a real bottle label states them
 * (Einiberja 43% vol, Katla 40% vol, 1 L). No awards or accolades are claimed.
 * Atmospheric landscape/pour imagery is placeholder pending final photography.
 */

/** Public-asset base — resolves to '/' in dev and '/iceland-frumgerdir/' in prod. */
export const ASSET = `${import.meta.env.BASE_URL}reykjavikdistillery/`

export interface Spirit {
  /** Stable id (ARIA + keys) */
  id: string
  /** Real product name */
  name: string
  /** Category, Icelandic */
  category: string
  /** Lead botanical / character, Icelandic */
  botanical: string
  /** ABV — real where the label states it, else sample */
  abv: string
  /** Bottle size — real where known, else sample */
  size: string
  /** Sample price, ISK */
  price: number
  /** Sample tasting line, Icelandic */
  note: string
  /** Bottle photograph (real, from reykjavikdistillery.is) */
  img: string
  /** Subtle per-spirit accent used only for a hairline + label tint */
  tone: string
  /** Featured in the larger top row of the showcase */
  feature?: boolean
}

const B = `${ASSET}bottles/`

/** The real range, with real photography. Specs marked sample except noted. */
export const SPIRITS: Spirit[] = [
  {
    id: 'einiberja',
    name: 'Einiberja Gin',
    category: 'Handtínt gin',
    botanical: 'Einiber',
    abv: '43% vol',
    size: '200 ml',
    price: 8990,
    note: 'Þurrt og bjart. Einiber fremst, sítrusbörkur og íslensk fjallagrös í lokin.',
    img: `${B}einiberja-gin.jpg`,
    tone: '#8fc7a3',
    feature: true,
  },
  {
    id: 'brennivin',
    name: 'Brennivín',
    category: 'Akvavit',
    botanical: 'Kúmen',
    abv: '40% vol',
    size: '200 ml',
    price: 6990,
    note: 'Klassískt og þurrt. Kúmen og rúgur, anís í miðju og langur, beinn endir.',
    img: `${B}brennivin.jpg`,
    tone: '#cfd8a6',
    feature: true,
  },
  {
    id: 'katla',
    name: 'Katla Vodka',
    category: 'Íslenskt vodka',
    botanical: 'Sexfaldað eimað',
    abv: '40% vol',
    size: '1 L',
    price: 9490,
    note: 'Mjúkt og hreint. Íslenskt vatn, silkimjúkur endir, gerð fyrir kokteilinn.',
    img: `${B}katla-vodka.jpg`,
    tone: '#cdb6b0',
    feature: true,
  },
  {
    id: 'angelica',
    name: 'Angelica',
    category: 'Jurtagin',
    botanical: 'Ætihvönn',
    abv: '42% vol',
    size: '200 ml',
    price: 9490,
    note: 'Jarðbundið og kryddað. Hvönn og engifer, þurr rótarkeimur sem situr lengi.',
    img: `${B}angelica.jpg`,
    tone: '#c2cf93',
  },
  {
    id: 'angelica-pink',
    name: 'Angelica Pink Gin',
    category: 'Jurtagin',
    botanical: 'Ætihvönn og ber',
    abv: '42% vol',
    size: '200 ml',
    price: 9490,
    note: 'Hvönn mætir berjum. Mjúk sæta, blómailmur og bleikur litur úr náttúrunni.',
    img: `${B}angelica-pink.jpg`,
    tone: '#e0a7bb',
  },
  {
    id: 'crowberry',
    name: 'Crowberry',
    category: 'Berjalíkjör',
    botanical: 'Krækiber',
    abv: '21% vol',
    size: '200 ml',
    price: 7290,
    note: 'Dökkt og safaríkt. Krækiber og lyng, keimur af haustkvöldi á heiðinni.',
    img: `${B}crowberry.jpg`,
    tone: '#b9a0d8',
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    category: 'Berjalíkjör',
    botanical: 'Bláber',
    abv: '21% vol',
    size: '200 ml',
    price: 7290,
    note: 'Sætt og mjúkt. Íslensk bláber, fyllt og rúnnt, jafnvægi af sýru og sætu.',
    img: `${B}blueberry.jpg`,
    tone: '#9db4e0',
  },
  {
    id: 'uliginosum',
    name: 'Uliginosum Blueberry',
    category: 'Berjalíkjör',
    botanical: 'Aðalbláber',
    abv: '21% vol',
    size: '200 ml',
    price: 7490,
    note: 'Dýpra og villtara en bláber. Aðalbláber með dökkum, þéttum berjakeimi.',
    img: `${B}blueberry-2.jpg`,
    tone: '#8f9fd6',
  },
  {
    id: 'rabarbara',
    name: 'Rabarbara',
    category: 'Líkjör',
    botanical: 'Rabarbari',
    abv: '20% vol',
    size: '200 ml',
    price: 7490,
    note: 'Sætt og sýrt í senn. Bleikur rabarbari, jarðarber og mjúk vanilla undir.',
    img: `${B}rabarbara.jpg`,
    tone: '#e09aa8',
  },
  {
    id: 'rhubarb',
    name: '64° Rhubarb Gin',
    category: 'Rabarbara-gin',
    botanical: 'Rabarbari',
    abv: '40% vol',
    size: '200 ml',
    price: 8490,
    note: 'Gin og rabarbari saman. Einiber undir, ferskur garðrabarbari yfir.',
    img: `${B}rhubarb.jpg`,
    tone: '#e3a3ac',
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'Akvavit',
    botanical: 'Dill',
    abv: '38% vol',
    size: '200 ml',
    price: 8490,
    note: 'Hreint og grænt. Dill og kúmen fremst, fennel og salt sjávarloft í lokin.',
    img: `${B}dill.jpg`,
    tone: '#93cfae',
  },
  {
    id: 'lundey',
    name: 'Lundey',
    category: 'Jurtagin',
    botanical: 'Íslenskar jurtir',
    abv: '40% vol',
    size: '200 ml',
    price: 8990,
    note: 'Blanda íslenskra jurta. Mjúkt, kryddað og ávalt, kennt við eyjuna Lundey.',
    img: `${B}lundey.jpg`,
    tone: '#9bd0c4',
  },
]

/** The cinematic descent — beats of the "wild to glass" journey. */
export interface Beat {
  id: string
  eyebrow: string
  title: string
  body: string
  /** Background / specimen image */
  img: string
  /** Alt text (empty string => decorative) */
  alt: string
  /** 'land' full-bleed photo · 'specimen' framed light panel · 'schematic' inverted blueprint */
  kind: 'land' | 'specimen' | 'schematic'
  /** Honest note shown small on the beat (e.g. placeholder imagery) */
  tag?: string
}

export const BEATS: Beat[] = [
  {
    id: 'land',
    eyebrow: '64°N — Stutta sumarið',
    title: 'Allt byrjar í náttúrunni',
    body: 'Á örfáum vikum íslensks sumars taka jurtir og ber við sér. Það er glugginn. Þá er tínt, áður en birtan dvínar og landið lokar sér aftur.',
    img: `${ASSET}hero.png`,
    alt: 'Krækiber á íslenskri heiði undir norðurljósum og kvöldsólinni',
    kind: 'land',
  },
  {
    id: 'forage',
    eyebrow: 'Tínt í höndunum',
    title: 'Jurtin ræður ferðinni',
    body: 'Einiber, ætihvönn, kúmen, krækiber og rabarbari. Hvert hráefni er handtínt og sjálfbært sótt, hvert á sínum stað og sínum tíma.',
    img: `${ASSET}process/topview.jpg`,
    alt: 'Handtíndar íslenskar jurtir og krydd: steinmortél, kúmen og þurrkuð hvönn',
    kind: 'specimen',
  },
  {
    id: 'still',
    eyebrow: 'Eimað í litlum lotum',
    title: 'Kopar, eldur, þolinmæði',
    body: 'Náttúruleg ídeyfing og eiming í litlum lotum í Hafnarfirði, síðan 2009. Hver jurt fær sinn tíma og sína hitastýringu. Fyrsta íslenska örbrugghúsið sinnar tegundar.',
    img: `${ASSET}process/hand-sketch.jpg`,
    alt: 'Teikning af eimingartæki, handgerð skissa',
    kind: 'schematic',
  },
]

/** Where to buy — clearest path first. */
export interface BuyPlace {
  name: string
  detail: string
  tag: string
  href?: string
  cta?: string
}

export const BUY: BuyPlace[] = [
  {
    name: 'Nammi.is',
    detail: 'Vefverslun með sendingu um allt land og til útlanda. Skýrasta leiðin að flösku heim að dyrum.',
    tag: 'Vefverslun',
    href: 'https://nammi.is',
    cta: 'Versla á netinu',
  },
  {
    name: 'Vínbúðin',
    detail: 'Fáanlegt í völdum Vínbúðum ÁTVR um land allt.',
    tag: 'Verslun',
  },
  {
    name: 'Fríhöfnin',
    detail: 'Tollfrjálst í Leifsstöð, við komu og brottför. Oft besta verðið.',
    tag: 'Leifsstöð',
  },
  {
    name: '60+ barir og veitingastaðir',
    detail: 'Á kokteilseðlum víða um höfuðborgarsvæðið og lengra. Spurðu eftir 64°.',
    tag: 'Á barnum',
  },
  {
    name: 'Icelandair og Play',
    detail: 'Í boði um borð á völdum flugleiðum. Íslensk eiming í 10 km hæð.',
    tag: 'Um borð',
  },
]

/** Distillery facts for the visit section (all real). */
export const DISTILLERY = {
  addr: 'Lónsbraut 6, 220 Hafnarfjörður',
  tel: '+354 519 3838',
  telHref: 'tel:+3545193838',
  email: 'info@reykjavikdistillery.is',
  since: '2009',
  tagline: 'The Original from Iceland',
}

/** The real, charming origin story — a small footnote, not the whole concept. */
export const ELF = {
  line: 'Sagan segir að aðferðirnar hafi verið kynntar brugghúsinu af álfinum Benedikt.',
  toast: 'Skál — og lengi lifi álfurinn.',
}
