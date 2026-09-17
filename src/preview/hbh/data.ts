import type { PreviewCompany } from '../companies'

/**
 * HBH BYGGIR EHF — hbh.is
 *
 * Every string below is HBH's own published copy (hbh.is, harvested 2026-09-17,
 * WordPress 5.4.21, footer "Copyright 2020"), lightly tidied for spelling, or a
 * fact they publish themselves. Nothing is invented: they publish no staff
 * names, no founding year, no prices, no opening hours and no client quotes,
 * so this page has none of those ([[client-copy-from-their-own-words]],
 * [[feedback-never-manufacture-social-proof]]).
 *
 * Photography is theirs, harvested from their own media library at the highest
 * resolution they publish. The five jobs below are the five their own pages
 * show photographs of; the rest of their named work stays as text, because
 * illustrating it would mean guessing. Images whose file names read as stock
 * (3170.jpg, KCS-kitchen, imageedit_*) were excluded for the same reason.
 */

const BASE = import.meta.env.BASE_URL

export interface Photo {
  src: string
  srcSet: string
  alt: string
  /** natural aspect, so the grid can reserve space and never shift */
  ratio: string
  portrait?: boolean
}

const P = (name: string, alt: string, ratio = '3 / 2'): Photo => ({
  src: `${BASE}hbh/${name}-1920.jpg`,
  srcSet: `${BASE}hbh/${name}-960.jpg 960w, ${BASE}hbh/${name}-1920.jpg 1920w`,
  alt,
  ratio,
  portrait: ratio.startsWith('2 / 3') || ratio.startsWith('3 / 4'),
})

export const PHOTO = {
  canopyMottaka: P('canopy-mottaka', 'Móttaka Canopy hótelsins með sérsmíðuðum viðarborðum og bogalampa'),
  canopyVidarveggur: P('canopy-vidarveggur', 'Gangur Canopy hótelsins klæddur lóðréttum viðarlistum'),
  canopySetustofa: P('canopy-setustofa', 'Setustofa Canopy hótelsins með viðarklæddum vegg og sófahópum'),
  canopyStigi: P('canopy-stigi', 'Stigagangur Canopy hótelsins með viðarklæðningu og listaverki'),
  canopyMottakaP: P('canopy-mottaka-p', 'Móttökuborð Canopy hótelsins í fullri hæð', '2 / 3'),
  sandSvita: P('sand-svita', 'Svíta á Sandhóteli með kringlóttu borði, vínrauðum stólum og kristalsljósi'),
  sandHerbergi: P('sand-herbergi', 'Hótelherbergi á Sandhóteli með sérsmíðaðri innréttingu og skrifborði'),
  sandBad: P('sand-bad', 'Baðherbergi á Sandhóteli með marmara og speglahurð', '2 / 3'),
  sandLjosakrona: P('sand-ljosakrona', 'Anddyri Sandhótels með dökkri viðarklæðningu og ljósakrónu', '2 / 3'),
  smaraBar: P('smara-bar', 'Hlébarinn í Smárabíói: bogadreginn bar með bláu ljósi og rimlaklæðningu'),
  smaraSetustofa: P('smara-setustofa', 'Setusvæði Hlébarans með gluggatjöldum og stólum í bláu ljósi'),
  smaraKantur: P('smara-kantur', 'Nærmynd af kanti barborðsins í Smárabíói'),
  smaraStafir: P('smara-stafir', 'Útskornir viðarstafir úr merkingu Hlébarans'),
  smaraEldhus: P('smara-eldhus', 'Eldhúskrókur við Hlébarann með dökkum flísum og innréttingu', '2 / 3'),
  smaraBarP: P('smara-bar-p', 'Hlébarinn í Smárabíói, lóðrétt mynd af barnum', '2 / 3'),
  nautVerond: P('naut-verond', 'Verönd Nauthóls með viðarpalli og útsýni'),
  nautBar: P('naut-bar', 'Bar Nauthóls með hvítu borði og flöskuhillum'),
  nautKvold: P('naut-kvold', 'Nauthóll að kvöldi með upplýstum gluggum og merkingu', '16 / 9'),
  marelHus: P('marel-hus', 'Húsnæði Marel með bogadreginni bláklæddri framhlið', '16 / 10'),
  verkStofa: P('verk-stofa', 'Setustofa með sérsmíðaðri innréttingu, sjónvarpsvegg og viðarborði'),
  verkVidarhurdir: P('verk-vidarhurdir', 'Nærmynd af sérsmíðuðum viðarhurðum með földum handföngum'),
  verkBar: P('verk-bar', 'Langur bar með viðarplötu og bláum barstólum'),
  verkGangur: P('verk-gangur', 'Gangur með heilklæddum viðarveggjum og innfelldri lýsingu', '2 / 3'),
  verkEyja: P('verk-eyja', 'Blá eyja með skúffum og viðarplötu í opnu rými'),
  verkVidarklaedning: P('verk-vidarklaedning', 'Nærmynd af viðarklæðningu með földum samskeytum'),
} satisfies Record<string, Photo>

export interface Verk {
  slug: string
  name: string
  flokkur: string
  stadur: string
  /** one line, from HBH's own description of the job */
  lina: string
  cover: Photo
  gallery: Photo[]
}

/** The five jobs HBH publishes photographs of. */
export const VERK: Verk[] = [
  {
    slug: 'canopy',
    name: 'Canopy hótel',
    flokkur: 'Hótel',
    stadur: 'Reykjavík',
    lina: 'Canopy hótel er eitt af helstu verkefnum HBH Byggis. Myndirnar eru úr móttöku og almennum rýmum hótelsins.',
    cover: PHOTO.canopyMottaka,
    gallery: [PHOTO.canopyMottaka, PHOTO.canopyVidarveggur, PHOTO.canopySetustofa, PHOTO.canopyStigi, PHOTO.canopyMottakaP],
  },
  {
    slug: 'sandhotel',
    name: 'Sandhótel',
    flokkur: 'Hótel',
    stadur: 'Laugavegur, Reykjavík',
    lina: 'KEA hótelið Sandhótel við Laugaveg 34 til 36, eitt af helstu verkefnum HBH Byggis.',
    cover: PHOTO.sandSvita,
    gallery: [PHOTO.sandSvita, PHOTO.sandHerbergi, PHOTO.sandLjosakrona, PHOTO.sandBad],
  },
  {
    slug: 'smarabio',
    name: 'Smárabíó',
    flokkur: 'Afþreying',
    stadur: 'Kópavogur',
    lina: 'Smárabíó er á meðal verkefna HBH Byggis. Myndirnar eru úr Hlébaranum og rýmunum í kring.',
    cover: PHOTO.smaraBar,
    gallery: [PHOTO.smaraBar, PHOTO.smaraSetustofa, PHOTO.smaraBarP, PHOTO.smaraKantur, PHOTO.smaraStafir, PHOTO.smaraEldhus],
  },
  {
    slug: 'nautholl',
    name: 'Nauthóll',
    flokkur: 'Veitingar',
    stadur: 'Nauthólsvík, Reykjavík',
    lina: 'Nauthóll er á meðal verkefna HBH Byggis. Myndirnar eru af veitingastaðnum og verönd hans.',
    cover: PHOTO.nautVerond,
    gallery: [PHOTO.nautVerond, PHOTO.nautBar, PHOTO.nautKvold],
  },
  {
    slug: 'marel',
    name: 'Marel',
    flokkur: 'Atvinnuhúsnæði',
    stadur: 'Garðabær',
    lina: 'Framleiðsluhúsnæði Marel í Garðabæ, eitt af helstu verkefnum HBH Byggis.',
    cover: PHOTO.marelHus,
    gallery: [PHOTO.marelHus],
  },
]

/** Their own service headings, with their own descriptions where they wrote one. */
export const THJONUSTA: Array<{ titill: string; texti?: string }> = [
  {
    titill: 'Húsasmíði og verkumsjón',
    texti:
      'Við leysum verkefnin frá upphafi til enda, hvort sem það er bygging íbúðar- eða atvinnuhúsnæðis eða smíði innréttinga, svo dæmi séu nefnd.',
  },
  {
    titill: 'Innréttingar',
    texti:
      'HBH hefur um árabil sérsmíðað innréttingar fyrir heimili, fyrirtæki og stofnanir, með metnaði, framúrskarandi framleiðslu og fagmennsku starfsmanna sinna.',
  },
  {
    titill: 'Endurnýjun',
    texti:
      'Úrvals starfsfólk, afar fullkomið trésmíðaverkstæði og öflugur tækjakostur gerir okkur kleift að takast á við fjölbreytt verkefni, hvort sem það er endurnýjun á húsnæði eða nýsmíði.',
  },
  { titill: 'Nýbyggingar' },
  { titill: 'Framkvæmdir innanhúss' },
  { titill: 'Lóðaframkvæmdir' },
]

/** "Almenn markmið" from their Stefna section, verbatim. */
export const MARKMID: string[] = [
  'Að vera faglegir og leiðandi. Byggja á gæðum og sýna gott fordæmi.',
  'Að framleiða hágæða vöru og veita viðskiptavinum bestu mögulegu þjónustu.',
  'Að bjóða upp á hæfileikaríka fagmenn.',
  'Að styðja við starfsmenn okkar og hvetja, þannig að þeir sýni frumkvæði og áræðni, skapi metnaðarfullan, jákvæðan og kröftugan starfsanda og geri hagsmuni HBH að sínum.',
  'Að halda fullkomnum trúnaði við viðskiptavini og hönnuði, sem felst meðal annars í virðingu og þagmælsku í tengslum við þau verkefni sem unnin eru.',
]

export const TEXTI = {
  tagline: 'Við byggjum frá grunni, breytum og bætum um betur',
  heildarlausnir:
    'HBH Byggir ehf. sérhæfir sig í heildarlausnum á sviði byggingaframkvæmda, hvort heldur er fyrir fyrirtæki, stofnanir eða einstaklinga. Þar á meðal má nefna nýbyggingar, framkvæmdir innanhúss, lóðaframkvæmdir og allar tegundir innréttinga.',
  vidskiptavinir:
    'Helstu viðskiptavinir HBH Byggis ehf. eru fyrirtæki í hótelrekstri, hátækniiðnaði, bankastarfsemi, verslunarrekstri og útgerð, svo og opinberar stofnanir, en einnig einstaklingar sem gera miklar kröfur og vilja hátt þjónustustig.',
  starfsmenn:
    'Um 40 starfsmenn vinna hjá fyrirtækinu sem býr yfir afar fullkomnu trésmíðaverkstæði, auk þess sem öflugur tækjakostur gerir fyrirtækinu kleift að takast á við fjölbreytt verkefni fyrir breiðan hóp viðskiptavina. HBH er með verkstæði í Reykjavík og á Akranesi.',
  verkefniIntro:
    'Undanfarin ár hefur HBH Byggir ehf. einbeitt sér að heildarlausnum byggingarverkefna, með sérstakri áherslu á fagmennsku og gæði.',
  onnurVerk:
    'Meðal annarra verka má nefna hótelið Room with a view við Vegamótastíg 7 til 9, Konsúlat hótel, Hard Rock Café í Lækjargötu og mötuneyti Ölgerðarinnar. Starfsmenn HBH sjá um viðhald og endurnýjun á starfsstöðvum Landsbankans og hafa gert um árabil.',
  stefna:
    'HBH byggir orðspor sitt á metnaði og fagmennsku starfsmanna sinna, hágæða framleiðslu og framúrskarandi þjónustu við viðskiptavini. Í sameiningu finnum við bestu fáanlegu lausn á hverju verki fyrir viðskiptavini fyrirtækisins.',
  metnadur:
    'Metnaður fyrirtækisins felst í því að skila af sér afburða vöru, veita góða þjónustu og sýna fagmennsku í hvívetna í samskiptum við viðskiptavini fyrirtækisins.',
}

export const CONTACT = {
  simi: '553-3322',
  simiHref: 'tel:+3545533322',
  netfang: 'hbh@hbh.is',
  heimilisfang: ['Skógarhlíð 10', '105 Reykjavík'],
  verkstaedi: 'Verkstæði í Reykjavík og á Akranesi',
}

export const PHOTO_CREDIT =
  'Ljósmyndir eru af vef HBH Byggis (hbh.is), sóttar í september 2026. Myndir úr Smárabíói eru merktar Arnaldi Halldórssyni (pix.is).'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'HBH Byggir ehf.',
  url: 'https://hbh.is',
  email: CONTACT.netfang,
  telephone: '+354 553 3322',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Skógarhlíð 10',
    postalCode: '105',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  areaServed: 'Ísland',
  description:
    'HBH Byggir ehf. sérhæfir sig í heildarlausnum á sviði byggingaframkvæmda: nýbyggingum, framkvæmdum innanhúss, lóðaframkvæmdum og sérsmíðuðum innréttingum.',
}

export const companyEntry: PreviewCompany = {
  slug: 'hbh',
  route: '/preview/hbh',
  name: 'HBH Byggir ehf.',
  sector: 'Byggingaframkvæmdir og innréttingar',
  location: 'Skógarhlíð 10, 105 Reykjavík',
  region: 'Höfuðborgarsvæðið og Akranes',
  established: 'Um 40 starfsmenn, verkstæði í Reykjavík og á Akranesi',
  currentUrl: 'http://hbh.is',
  ownerEmail: 'hbh@hbh.is',
  concept: 'Frá grunni',
  conceptTagline:
    'Rýmin sem fólk þekkir í Reykjavík voru byggð og innréttuð af einum verktaka. Vefurinn sýnir verkin sjálf í stað þess að telja þau upp í einni málsgrein.',
  accent: '#00467A',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}hbh/canopy-mottaka-960.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Verkin sjálf: Canopy, Sandhótel, Smárabíó, Nauthóll og Marel, öll með raunverulegum ljósmyndum',
      'Eigið trésmíðaverkstæði og um 40 starfsmenn, sem fáir keppinautar hafa',
      'Viðskiptavinir sem fólk þekkir: hótel, bankar, verslun og hátækniiðnaður',
    ],
    weaknesses: [
      'Vefurinn keyrir á WordPress 5.4.21 frá apríl 2020 og hefur ekki fengið öryggisuppfærslu síðan',
      'Enginn hlekkur á hbh.is fer sjálfkrafa yfir í https, síðan svarar enn á óvörðu http',
      'Verkin eru ein málsgrein af texta, engin verkefnasíða og engar myndir með nöfnum',
    ],
    opportunities: [
      'Hvert verk fær sína eigin síðu með myndunum sem fyrirtækið á þegar',
      'Sami strúktúr og hjá hollenskum arkitektastofum: flokkur, staður og myndaröð fyrir hvert verk',
    ],
  },
  positioning:
    'HBH Byggir byggir, breytir og sérsmíðar innréttingar fyrir hótel, fyrirtæki, stofnanir og einstaklinga, með eigið trésmíðaverkstæði og um 40 starfsmenn. Frumgerðin byggir á verkunum sjálfum: fimm nafngreind verk með þeirra eigin ljósmyndum, í stað einnar málsgreinar á forsíðu.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir HBH Byggi',
    body:
      'Sælir,\n\n' +
      'Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki. Ég rakst á hbh.is og það sem sat eftir voru verkin sjálf, Canopy, Sandhótel, Smárabíó, Nauthóll og Marel, og myndirnar af þeim eru virkilega góðar. Það er ekki sjálfgefið að verktaki eigi svona myndefni af sínum eigin verkum.\n\n' +
      'Eitt rakst ég þó á. Vefurinn keyrir enn á WordPress 5.4.21 sem kom út í apríl 2020 og hefur ekki fengið öryggisuppfærslu síðan, og hbh.is fer ekki sjálfkrafa yfir í https, þannig að síðan svarar enn á óvörðu http. Verkin sjálf eru svo ein málsgrein neðst á forsíðunni og myndirnar liggja á undirsíðu sem fáir rata á.\n\n' +
      'Ég setti því saman frumgerð þar sem hvert verk fær sína eigin síðu með ykkar eigin myndum og ykkar eigin texta, og hana má skoða á [HLEKKUR Á FRUMGERÐ] hvenær sem er, hún virkar líka vel í síma. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding, mér fannst einfaldlega gaman að sjá hvað verkin ykkar bera sig vel þegar þau fá pláss.\n\n' +
      'Ef ykkur líst á er ég til í að heyra frá ykkur, en ef ekki er það auðvitað allt í lagi.\n\n' +
      'Bestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is',
  },
}
