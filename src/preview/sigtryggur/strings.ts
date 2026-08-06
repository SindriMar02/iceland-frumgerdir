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
  canvas: ['OLÍA', 'OIL'],
  paper: ['VATNSLITUR', 'WATERCOLOUR'],
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
  owner: ['EIGN', 'OWNER'],
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
    'Verkin eru í eigu safna og einkaaðila og sum eru enn í vinnustofunni. Veldu þau verk sem þú vilt spyrjast fyrir um og sendu eina fyrirspurn, þá svarar Sigtryggur Bjarni um stöðu þeirra.',
    'The works are held by museums and private owners, and some are still in the studio. Pick the works you want to ask about and send one enquiry, and Sigtryggur Bjarni will reply about where they stand.',
  ],
  orWriteDirect: ['EÐA SENDU PÓST BEINT', 'OR WRITE DIRECTLY'],
  aboutTitle: ['UM SIGTRYGG BJARNA', 'ABOUT SIGTRYGGUR BJARNI'],
  seriesNote: [
    'Raðirnar átta eru flokkun á verkunum 124 fyrir þessa frumgerð, hver kennd við eitt verk innan hennar.',
    'The eight series are a curation of the 124 works for this prototype, each named after one painting inside it.',
  ],
  exhibitions: ['SÝNINGAR', 'EXHIBITIONS'],
  shownAt: ['SÝND Á', 'SHOWN AT'],
  soloShows: ['EINKASÝNINGAR', 'SOLO EXHIBITIONS'],
  inCollections: ['VERK Í OPINBERRI EIGU', 'IN PUBLIC COLLECTIONS'],
  exhibitionsIntro: [
    'Sigtryggur Bjarni hefur haldið 35 einkasýningar frá 1991, þá síðustu í Listasafni Íslands. Verk eftir hann eru í eigu Listasafns Íslands, Listasafns Reykjavíkur, Hæstaréttar og ellefu safna til viðbótar.',
    'Sigtryggur Bjarni has held 35 solo exhibitions since 1991, the most recent at the National Gallery of Iceland. His work is held by the National Gallery, Reykjavík Art Museum, the Supreme Court of Iceland and eleven more collections.',
  ],
} as const satisfies Record<string, Pair>

export type TKey = keyof typeof T

export const t = (k: TKey, lang: Lang): string => T[k][lang === 'is' ? 0 : 1]

/** Body copy that is too long to live in the pair table above. */
export const ABOUT: Record<Lang, string[]> = {
  is: [
    'Sigtryggur hefur í málverkum, ljósmyndum og vatnslitamyndum gert afmörkuðum náttúrufyrirbrigðum skil. Vatnsfletir hafa verið leiðandi stef í verkum hans, straumvatn og haffletir sem endurspegla hinar höfuðskepnurnar, ljós, loft og jörð.',
    'Hann er fæddur á Akureyri 1966. Hann nam við Myndlistaskólann á Akureyri, málaradeild Myndlista- og handíðaskóla Íslands og lauk framhaldsnámi við École des Arts Décoratifs í Strasbourg í Frakklandi.',
    'Þessi síða sýnir verk úr fimmtán röðum. Raðirnar eru hans eigin og margar þeirra voru sýndar sem einkasýningar. Litaflokkunin er ekki valin eftir smekk, hún er lesin beint úr málverkunum sjálfum.',
  ],
  en: [
    'Sigtryggur has worked through painting, photography and watercolour on closely bounded natural phenomena. Water surfaces are the leading theme in his work, river water and sea surfaces that reflect the other elements, light, air and earth.',
    'He was born in Akureyri in 1966. He studied at the Akureyri School of Art, the painting department of the Icelandic College of Arts and Crafts, and completed postgraduate study at the École des Arts Décoratifs in Strasbourg, France.',
    'This site shows work from fifteen series. The series are his own, and several of them were shown as solo exhibitions. The colour sorting is not a matter of taste. It is read straight out of the paintings.',
  ],
}
