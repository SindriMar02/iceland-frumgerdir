/**
 * Icelandic first, English second — the toggle sits in the far-right nav cluster
 * exactly where the reference keeps its cart. Every string is a pair so nothing
 * can silently fall back to English on an Icelandic page.
 */
export type Lang = 'is' | 'en'

type Pair = readonly [is: string, en: string]

export const T = {
  bySeries: ['EFTIR RÖÐUM', 'BY SERIES'],
  byColour: ['EFTIR LITUM', 'BY COLOURS'],
  all: ['ALLT', 'ALL'],
  canvas: ['STRIGI', 'CANVAS'],
  paper: ['PAPPÍR', 'PAPER'],
  about: ['UM', 'ABOUT'],
  contact: ['SAMBAND', 'CONTACT'],
  collection: ['SAFN', 'SELECTION'],
  menu: ['YFIRLIT', 'INDEX'],
  close: ['LOKA', 'CLOSE'],
  pieces: ['VERK', 'PIECES'],
  piece: ['VERK', 'PIECE'],
  works: ['VERK', 'WORKS'],
  series: ['RÖÐ', 'SERIES'],
  year: ['ÁR', 'YEAR'],
  size: ['STÆRÐ', 'SIZE'],
  technique: ['TÆKNI', 'TECHNIQUE'],
  price: ['VERÐ', 'PRICE'],
  colours: ['LITIR', 'COLOURS'],
  detail: ['NÁRVERK', 'DETAIL'],
  enquire: ['SETJA Í SAFN', 'ADD TO SELECTION'],
  inCollection: ['Í SAFNI', 'IN SELECTION'],
  remove: ['TAKA ÚR', 'REMOVE'],
  emptyCollection: [
    'Safnið er tómt. Veldu verk og sendu fyrirspurn í einu lagi.',
    'The selection is empty. Pick works and send one enquiry.',
  ],
  sendEnquiry: ['SENDA FYRIRSPURN', 'SEND ENQUIRY'],
  next: ['NÆSTA', 'NEXT'],
  prev: ['FYRRA', 'PREVIOUS'],
  backToSeries: ['TIL BAKA Í RÖÐINA', 'BACK TO SERIES'],
  viewSeries: ['SKOÐA RÖÐINA', 'VIEW SERIES'],
  allSeries: ['ALLAR RAÐIR', 'ALL SERIES'],
  scroll: ['SKRUNA', 'SCROLL'],
  studio: ['VINNUSTOFA', 'STUDIO'],
  enquiryIntro: [
    'Málverkin eru til sölu beint frá vinnustofunni. Veldu verkin sem þig langar að spyrja um og sendu eina fyrirspurn, þá svarar Áslaug Saja með verði, ástandi og sendingarmöguleikum.',
    'The paintings are for sale directly from the studio. Pick the works you want to ask about and send one enquiry, and Áslaug Saja will reply with price, condition and delivery.',
  ],
  orWriteDirect: ['EÐA SENDU PÓST BEINT', 'OR WRITE DIRECTLY'],
  aboutTitle: ['UM ÁSLAUGU SÖJU', 'ABOUT ÁSLAUG SAJA'],
  seriesNote: [
    'Raðirnar átta eru flokkun á verkunum 124 fyrir þessa frumgerð, hver kennd við eitt verk innan hennar.',
    'The eight series are a curation of the 124 works for this prototype, each named after one painting inside it.',
  ],
  shop: ['VERSLUN', 'SHOP'],
  shopAll: ['ALLT', 'ALL'],
  shopScarves: ['SLÆÐUR', 'SCARVES'],
  shopBags: ['TÖSKUR', 'BAGS'],
  shopHome: ['HEIMILI', 'HOME'],
  shopMouse: ['MÚS', 'MOUSE'],
  shopIntro: [
    'Sömu myndir, komnar í efni: silkislæður og strigatöskur með mynstrum úr málverkunum, prentaðar og saumaðar af Áslaugu Söju sjálfri. Verslunin er rekin á saja.is og kaup fara þar fram, ekki hér.',
    'The same images, carried into fabric: silk scarves and canvas bags printed with patterns drawn from the paintings, made by Áslaug Saja herself. The shop runs on saja.is, and purchases happen there, not here.',
  ],
  buyOnSaja: ['KAUPA Á SAJA.IS', 'BUY ON SAJA.IS'],
  alsoAvailableAs: ['LÍKA TIL SEM VARA', 'ALSO AVAILABLE AS AN OBJECT'],
  viewShop: ['SKOÐA VERSLUN', 'VIEW SHOP'],
} as const satisfies Record<string, Pair>

export type TKey = keyof typeof T

export const t = (k: TKey, lang: Lang): string => T[k][lang === 'is' ? 0 : 1]

/** Body copy that is too long to live in the pair table above. */
export const ABOUT: Record<Lang, string[]> = {
  is: [
    'Áslaug Saja Davíðsdóttir vinnur í Hveragerði. Hún kom úr textíl og silkiþrykki yfir í málverkið, og sú leið sést enn: lögin eru byggð upp eins og prentun, litur ofan á lit, þar til svarti pensilstrokurinn fer yfir allt saman í einni hreyfingu.',
    'Verkin eru unnin með akrýl, olíu, bleki, spreyi og krít, á striga og á Hahnemühle pappír. Þau eru frá 24x30 cm upp í 140x195 cm.',
    'Þessi síða sýnir 124 verk. Þau eru flokkuð á tvo vegu: eftir röðum og eftir litum. Litaflokkunin er ekki valin eftir smekk, hún kemur beint úr verkunum sjálfum.',
  ],
  en: [
    'Áslaug Saja Davíðsdóttir works in Hveragerði, Iceland. She came to painting from textiles and silk printing, and that route is still visible: the layers are built like a print run, colour over colour, until a black brushstroke crosses the whole thing in one movement.',
    'The works are made with acrylic, oil, ink, spray and chalk, on canvas and on Hahnemühle paper. They run from 24x30 cm to 140x195 cm.',
    'This site shows 124 works, sorted two ways: by series and by colour. The colour sorting is not a matter of taste. It comes straight out of the paintings.',
  ],
}
