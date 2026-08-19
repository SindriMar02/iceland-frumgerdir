import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for seidkarlinn. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Seiðkarlinn — Faxafen 14, Reykjavík. Shopify store, 100+ SKUs: the
    // "galdur" herbal tea line, raw honey, Cordyfresh mushroom tinctures,
    // freeze-dried fruit, CBD skincare, supplements. Owner email confirmed
    // on their Facebook About page (not published on-site). Prices are real
    // list prices at research time, sýnishorn per shared footer.
    slug: 'seidkarlinn',
    route: '/preview/seidkarlinn',
    name: 'Seiðkarlinn',
    sector: 'Náttúruvörur',
    location: 'Faxafen 14, Reykjavík',
    region: 'Capital',
    established: 'Seiðkarlinn ehf., starfrækt frá 2023',
    currentUrl: 'https://seidkarlinn.is',
    ownerEmail: 'seidkarlinn@seidkarlinn.is',
    concept: 'Galdraskráin',
    conceptTagline:
      "The sorcerer's price-sheet as a printed broadside, built from THEIR OWN assets: the boxed wordmark as the masthead, their real product photography as multiply-blend cutouts on paper, Oranienbaum display + Space Mono ledger labels, one stamp red. Motion identity is inscription — rules draw themselves, hand-drawn stave chapter marks self-inscribe on scroll, add-to-cart thumps a stamp. Numbered ledger rows with dotted leaders, a five-bag specimen plate for the galdur teas, an ink page for the Cordyfresh tinctures, a perforated order-slip cart.",
    accent: '#9E2B20',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://cdn.shopify.com/s/files/1/0657/8264/4910/files/villibloma_1kg_v2.jpg?width=600',
    audit: {
      strengths: [
        'Alvöru vöruúrval á Shopify: hrátt hunang, sveppatinktúrur, frostþurrkaðir ávextir, jurtate og fleira — allt á lager með rauntímaverði',
        'Nafnið sjálft (Seiðkarlinn) og "galdur"-vörulínan (Kvennagaldur, Svefngaldur, Draumagaldur o.fl.) eru þegar til sem einstakt eignarmerki',
        'Alvöru verslun í Faxafeni 14 með sækja-í-verslun valkosti, ekki eingöngu netverslun',
      ],
      weaknesses: [
        'Sjálfgefið Shopify-þema (Dawn): engin forsíðumynd, beint í vörulista, svart og hvítt',
        '"Um okkur" er níutíu orð af almennum frösum — engin saga, engin mynd, ekkert sem útskýrir nafnið',
        'Ekkert samband milli nafnsins/galdra-vörulínunnar og hönnunarinnar sjálfrar; ekkert netfang sýnilegt á vefnum sjálfum (aðeins tengiliðaform)',
      ],
      opportunities: [
        'Gera vöruúrvalið sjálft að upplifun: lífræn form og hreyfing, te-línan þeirra sem ritstýrður miðpunktur og hunangið sem sjónrænt hjarta',
        'Hunangið, sveppatinktúrurnar og frostþurrkaði ávöxturinn gefa sterkt sjónrænt tungumál (hunangsseimur, gler, kraft-pappír) sem núverandi þemað hunsar með öllu',
        'Faxafen-verslunin er ónýtt traust — engin mynd, ekkert kort, engin hvatning til að koma við',
      ],
    },
    positioning:
      'Ung náttúruvöruverslun með óvenju sterkt nafn og vöruúrval (heilsusveppir, hrátt hunang, frostþurrkaðir ávextir, jurtate nefnt eftir göldrum) falið á bak við sjálfgefið, sögulaust Shopify-þema. Frumgerðin er byggð á þeirra eigin vörumyndum og merki: prentuð verðskrá með galdrastöfum sem rista sig sjálfir, númeruðum vörulínum, stimplum og alvöru körfu. Öll verð eru sýnishorn frá rannsóknartíma.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Seiðkarlinn',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með einstaklega skemmtilegt nafn og vöruúrval, hrátt hunang, sveppatinktúrur, frostþurrkaða ávexti og heila te-línu sem heitir í höfuðið á göldrum, Svefngaldur, Draumagaldur og fleiri. Þegar ég skoðaði vefsíðuna ykkar fannst mér hún samt ekki nýta þetta neitt, hún er sjálfgefið verslunarþema, svarthvít, án myndar og án sögu.

Ég hannaði því frumgerð að nýjum vef sem er byggð á ykkar eigin vörumyndum og merki, sett upp eins og prentuð verðskrá með körfu, vöruflokkum og sérstökum kafla um te-línuna ykkar. Allt efni og verð á frumgerðinni eru sýnishorn sem þið staðfestið.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
