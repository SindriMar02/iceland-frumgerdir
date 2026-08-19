import type { PreviewCompany } from '../company-types'

/**
 * Áslaug Saja Davíðsdóttir — painter and textile designer, Hveragerði.
 *
 * SHE HAS HER OWN SITE: saja.is, a working Shopify store selling silk scarves,
 * cotton bags and some paintings. An earlier version of this file claimed she had
 * none, which was simply false and would have gone out in an email. The real gap
 * is narrower and honest: her PAINTINGS (124 works, up to 690.000 kr) live on the
 * Apolloart marketplace she does not control, and on saja.is they are presented
 * as Shopify product tiles the same size as a scarf.
 *
 * ownerEmail is sourced, not guessed: saja.is/policies/contact-information lists
 * "Trade name: SAJA / Email: aslaugsaja@gmail.com / Laufskógar 27, 810 Hveragerði"
 * (read 2026-08-04). Never fill this field from anything you have not seen.
 */
export const companyEntry: PreviewCompany = {
  slug: 'aslaugsaja',
  route: '/preview/aslaugsaja',
  name: 'Áslaug Saja Davíðsdóttir',
  sector: 'Myndlist',
  location: 'Hveragerði',
  region: 'Suðurland',
  established: '124 verk, 2020–2026',
  currentUrl: 'https://saja.is',
  ownerEmail: 'aslaugsaja@gmail.com',
  concept: 'Undirskriftin',
  conceptTagline:
    'Nafnið skrifað upp á nýtt við hverja síðuskiptingu; málverkið fyllir skjáinn og textinn þorir að vera örsmár.',
  accent: '#141210',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'asaja/grid/vatn-2.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir af verkum og vörum Áslaugar Söju, sóttar af saja.is og af sölusíðu hennar á Apolloart.',
  audit: {
    strengths: [
      '124 verk frá 2020–2026, þar af 38 birt á árinu 2026 — hún er í fullri vinnu',
      'Verðbil 20.000–690.000 kr., miðgildi 140.000 kr.',
      'Skráin er þegar merkt eftir lit, stærð, stefnu og tækni — flokkunin er til',
    ],
    weaknesses: [
      'Málverkin birtast sem vörureitir, í sömu stærð og slæða eða taska',
      'Dýrustu verkin liggja á markaðstorgi sem hún stýrir ekki sjálf',
      'Engar raðir og ekkert samhengi; 124 verk í einu löngu yfirliti',
    ],
    opportunities: [
      'Raða 124 verkum í átta raðir og gera litaflokkunina að leiðarkerfi',
      'Fyrirspurnasafn í stað körfu: kaupandi velur nokkur verk og sendir eina fyrirspurn',
      'Íslenska fyrst, enska við hliðina — safnarar og ferðamenn í sömu síðu',
    ],
  },
  positioning:
    'Saja.is virkar vel fyrir slæður og töskur, en málverkin fá sömu meðferð og fylgihlutur: vörureit í grind. Frumgerðin snýr því við. Verkin fylla skjáinn, raðirnar átta bera ártal og verkafjölda, og litaflokkunin er lesin beint úr skránni hennar sjálfrar. Verslunin heldur sínu striki við hliðina.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Áslaugu Söju',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt listafólk.

Ég rakst á verkin þín og staldraði við. Þessi eina svarta stroka sem fer yfir litalögin situr lengi eftir. Það eina sem mig vantaði að sjá var síða þar sem málverkin fá að fylla skjáinn, því eins og staðan er í dag birtast þau sem vörureitir, í sömu stærð og slæða eða taska.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð fyrir þig. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að verkin fái plássið sem þau eiga skilið og að hægt sé að fletta þeim eftir litum, flokkun sem er þegar til í skránni þinni. Verslunin á saja.is heldur sínu striki.

Endilega láttu mig vita ef þú hefur áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
