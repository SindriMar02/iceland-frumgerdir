import type { PreviewCompany } from '../companies'

/**
 * Svartaborg — Rósa og Snæbjörn, both designers, farm Rangá above Húsavík.
 * Sources: svartaborg.com, the live Airbnb listing (room 42879945) and
 * Booking.com (9.7 · 327), all read 2026-08-06.
 *
 * ownerEmail is the address PRINTED on their site (Svartaborg@gmail.com,
 * verified as visible text). The mailto/tel HREFS behind it are still the
 * page template's defaults (contact@mysite.com / 123-456-7890) — that is the
 * outreach hook, stated as the symptom in the email below, never as the
 * diagnosis, and never mentioned on the prototype page itself.
 */
export const companyEntry: PreviewCompany = {
  slug: 'svartaborg',
  route: '/preview/svartaborg',
  name: 'Svartaborg',
  sector: 'Gisting',
  location: 'Rangá, Þingeyjarsveit',
  region: 'Norðurland',
  established: 'Byggt af eigendum 2020',
  currentUrl: 'https://svartaborg.com',
  ownerEmail: 'Svartaborg@gmail.com',
  concept: 'Svarta formið',
  conceptTagline:
    'Formið á húsinu þeirra er mælt beint úr ljósmyndinni og verður að grind síðunnar: dalurinn birtist í gegnum útlínur hússins sem horfir á hann.',
  accent: '#4FA3A5',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'svartaborg/house-hillside.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir frá svartaborg.com og Airbnb-skráningu Rósu og Snæbjörns, sóttar 2026-08-06.',
  audit: {
    strengths: [
      '4,99 í einkunn yfir 557 umsagnir á Airbnb og 9,7 á Booking.com. Tvöfalt staðfest traust',
      'Hönnuðirnir byggðu húsin sjálf árið 2020 á fjölskyldujörðinni Rangá: sagan er alvöru',
      'Demantshringurinn við dyrnar: Goðafoss í tíu mínútum, Húsavík í tuttugu, Akureyri í þrjátíu',
    ],
    weaknesses: [
      'Netfangið og símanúmerið á vefnum eru sýnileg en hlekkirnir á bak við þau opna rangt netfang og rangt númer',
      'Vefurinn segir hvorki söguna um hönnuðina né jörðina, sterkasta trompið er ósagt',
      'Umsagnirnar 557 sjást hvergi á eigin vef',
    ],
    opportunities: [
      'Lagfærðir hlekkir og bein fyrirspurn: hver einasta snerting á síma virkar',
      'Sagan um hönnuðina og Rangá sem burðarás vefsins',
      'Umsagnir og gagnasnið heim á eigið lén',
    ],
  },
  positioning:
    'Rósa og Snæbjörn hönnuðu og byggðu húsin sjálf, og formið á þeim er svo sterkt að það ber heila síðu. Frumgerðin mælir útlínur hússins beint úr ljósmyndinni og notar þær sem grind: dalurinn sést í gegnum formið, sagan um jörðina fær loksins pláss, og fyrirspurnin fer beint til þeirra.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Svartaborg',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði og ferðaþjónustu.

Ég rakst á Svartaborg og sat lengi yfir myndunum. Formið á húsunum er svo sterkt að það mætti bera heila vefsíðu, og umsagnirnar segja sömu sögu, 4,99 yfir 557 umsagnir.

Eitt vakti athygli mína á svartaborg.com. Netfangið og símanúmerið sjást rétt á síðunni, en ef smellt er á þau í síma opnast rangt netfang og rangt númer. Gestir sem reyna að hafa samband beint lenda því á vegg.

Ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem formið á húsinu ykkar er sjálf grind síðunnar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
https://sindrimar02.github.io/iceland-frumgerdir/preview/svartaborg/

Hugmyndin er einföld. Að fólk finni ykkur, sjái söguna um hönnunina og jörðina, og geti sent fyrirspurn sem virkar. Ég sé líka um hýsingu, viðhald og uppfærslur á síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.

Endilega látið mig vita ef þið hafið áhuga, annars er engin pressa.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
