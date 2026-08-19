import type { PreviewCompany } from '../company-types'

/**
 * Laxfoss Luxury Lodge — Guðlaug ("Gudlaug" on the listing), Borgarfjörður,
 * on the Norðurá. Sources: the live Airbnb listing (room 48712789) and
 * laxfoss.org, both read 2026-08-06.
 *
 * ownerEmail is EMPTY on purpose: laxfoss.org has no mailto anywhere, its
 * /contact page 404s, whois is redacted, and the site's social icons still
 * point at facebook.com/wix and instagram.com/wix (the template defaults).
 * The real channel is Instagram @laxfoss.iceland or Airbnb messaging — and
 * per the hard rule, an Airbnb DM must NOT carry the commission argument.
 * Never invent an address.
 *
 * currentUrl is laxfoss.org — a real Wix site they own. Its weaknesses are
 * measured, not assumed: WebSite-only schema (no LodgingBusiness), no booking
 * engine (the sole booking route is an Airbnb link whose source_impression_id
 * decodes to 21 March 2021), contact page 404, template social links.
 */
export const companyEntry: PreviewCompany = {
  slug: 'laxfoss',
  route: '/preview/laxfoss',
  name: 'Laxfoss Luxury Lodge',
  sector: 'Gisting',
  location: 'Norðurá, Borgarbyggð',
  region: 'Vesturland',
  established: 'Ofurgestgjafi í 12 ár',
  currentUrl: 'https://www.laxfoss.org',
  ownerEmail: '',
  concept: 'Niðurá',
  conceptTagline:
    'Fossinn við húsið hættir aldrei að falla, svo þetta er eina síðan í safninu sem fellur NIÐUR: hleðsluskjárinn fellur, nafnið hellist ofan í sig, og miðja síðunnar er ferð niður fossinn sjálfan.',
  accent: '#4E8AAD',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'laxfoss/waterfall-aerial.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir frá laxfoss.org og Airbnb-skráningu Guðlaugar, sóttar 2026-08-06.',
  audit: {
    strengths: [
      'Einkafoss við húsið. Ekkert annað gistihús á Íslandi á sinn eigin foss í seilingarfjarlægð',
      '5,0 í einkunn yfir 123 umsagnir og tólf ára reynsla sem ofurgestgjafi. Traustið er fullkomið',
      'Húsið er frá þriðja áratugnum með upprunalegum viðargólfum: alvöru saga, ekki markaðstexti',
    ],
    weaknesses: [
      'laxfoss.org er tólf síðna Wix-vefur: engin bókunarvél, eina bókunarleiðin er Airbnb-hlekkur sem var límdur inn í mars 2021',
      'Samskiptasíðan skilar 404 og samfélagsmiðlahnapparnir vísa enn á reikninga Wix sjálfs',
      'Ekkert LodgingBusiness-gagnasnið, svo Google og gervigreindarleit vita ekki að þetta sé gististaður',
    ],
    opportunities: [
      'Bein fyrirspurn á eigin léni í stað þóknunar Airbnb á hverja einustu nótt',
      'Umsagnirnar 123 fluttar heim á eigin vef sem trúverðugleiki',
      'LodgingBusiness-gagnasnið og lagfærð samskiptasíða: sýnileiki í leit sem vefurinn hefur ekki í dag',
    ],
  },
  positioning:
    'Guðlaug á lén og vef, en vefurinn gerir ekkert: bókunarhlekkurinn er fimm ára gamall, samskiptasíðan er brotin og fossinn sjálfur, eina raunverulega tromp hússins, er hvergi settur á svið. Frumgerðin gerir fossinn að burðarás síðunnar og setur fyrirspurnina beint til hennar.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Laxfoss Luxury Lodge',
    body: `Sæl Guðlaug,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði og ferðaþjónustu.

Ég rakst á Laxfoss og sat lengi yfir myndunum. Hús frá þriðja áratugnum með eigin foss við hliðina er ekki eitthvað sem maður sér annars staðar, og umsagnirnar segja sömu sögu, fullt hús yfir 123 umsagnir.

Eitt vakti athygli mína á laxfoss.org. Samskiptasíðan opnast ekki, og hnapparnir neðst vísa enn á Facebook og Instagram hjá Wix, ekki hjá ykkur. Bókunarhlekkurinn á síðunni er líka orðinn nokkurra ára gamall.

Ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem fossinn fær loksins aðalhlutverkið. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
https://sindrimar02.github.io/iceland-frumgerdir/preview/laxfoss/

Hugmyndin er einföld. Að fólk sjái strax hvað þetta er sérstakur staður, finni þig í leit og geti sent fyrirspurn beint til þín. Ég sé líka um hýsingu, viðhald og uppfærslur á síðum sem ég geri, ef það er eitthvað sem þú hefur áhuga á.

Endilega láttu mig vita ef þú hefur áhuga, annars er engin pressa.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
