import type { PreviewCompany } from '../companies'

/**
 * Glass Cottages — Ari (Superhost, 13 years), Hella. Family-owned, designed by
 * Ari, Gábor and Andrej. Sources: the live Airbnb listing (Blár, 42164367) and
 * glasscottages.com, both read 2026-08-06.
 *
 * They DO have their own site AND their own booking engine
 * (book.glasscottages.com) — so the pitch here is design + visibility, never
 * "you have no direct booking". Verified defects, all measured:
 *  · ZERO schema.org data of any kind → invisible to AI answer engines
 *  · nine orphaned "-old" duplicate pages publicly listed in their own sitemap
 *    (about/contact/faq/gallery/booking/offers/influencers/blog + raw
 *    Elementor draft URLs)
 *  · site last touched 2025-03-11 (sitemap lastmod)
 * Contact hello@glasscottages.com verified deliverable (MX on the domain).
 * The site is English-only → outreach in ENGLISH (the Mystic Light lesson:
 * check the site's default language before choosing the email language).
 */
export const companyEntry: PreviewCompany = {
  slug: 'glasscottages',
  route: '/preview/glasscottages',
  name: 'Glass Cottages',
  sector: 'Gisting',
  location: 'Hella, Rangárþing ytra',
  region: 'Suðurland',
  established: 'Ofurgestgjafi í 13 ár',
  currentUrl: 'https://glasscottages.com',
  ownerEmail: 'hello@glasscottages.com',
  concept: 'Blár og Grænn',
  conceptTagline:
    'Tvö glerhús, 200 metrar á milli. Síðan er byggð á þeirri tvennd: allt Blár-efni opnast að ofan, allt Grænn-efni að neðan, og í miðjunni velur gesturinn sér himin.',
  accent: '#7FA8C9',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'glasscottages/sunset-cottage.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir frá glasscottages.com og Airbnb-skráningunni, sóttar 2026-08-06.',
  audit: {
    strengths: [
      '4,97 í einkunn yfir 588 umsagnir. Mesta sannaða eftirspurn allra kandídata í leitinni',
      'Arkitektúr sem ljósmyndast sjálfur: glerhús í 500 hektara hrauni, norðurljós í gegnum þakið',
      'Alvöru handverkssaga: rekaviður frá Ísafirði, jurtalituð ull, eigin brunnur. Efni sem flestir markaðstextar þyrftu að skálda',
    ],
    weaknesses: [
      'Ekkert schema.org-gagnasnið af neinu tagi, svo gervigreindarleit og Google vita ekki að þetta sé gististaður',
      'Níu gamlar "-old" afritssíður liggja opinberlega í eigin veftré, þar á meðal contact-us-old og booking-old',
      'Vefurinn hefur ekki verið snertur síðan í mars 2025 samkvæmt eigin veftré',
    ],
    opportunities: [
      'LodgingBusiness-gagnasnið og hreinsað veftré: sýnileikinn sem 588 umsagnir eiga skilið',
      'Tvenndin Blár og Grænn gerð að vörumerki í stað tveggja eins skráninga',
      'Umsagnirnar fluttar heim á eigin vef í stað þess að lifa aðeins á Airbnb',
    ],
  },
  positioning:
    'Ari og fjölskylda eiga bæði lénið og bókunarvélina, en vefurinn hefur staðið óhreyfður í meira en ár, veftréð er fullt af gömlum afritssíðum og ekkert gagnasnið segir leitarvélum hvað staðurinn er. Frumgerðin gerir tvenndina að hugmyndinni: eitt hraun, tveir himnar.',
  outreach: {
    subject: 'An idea for the Glass Cottages website',
    body: `Hello Ari and team,

My name is Sindri and I design websites for Icelandic guesthouses and small tourism businesses.

I came across Glass Cottages and stayed a long time with the photographs. Two glass houses alone in five hundred hectares of lava, with the aurora coming through the roof, is material most places could only dream of. 4.97 across 588 reviews says guests feel the same.

One thing stood out on glasscottages.com. The site seems not to have changed for a while, and its sitemap still lists old duplicate pages such as contact-us-old and booking-old, which search engines also read. There is also no structured data on the site, so Google and AI search tools cannot tell it is a place to stay.

I sat down and designed a prototype of a new front page, built around Blár and Grænn as a pair. It costs you nothing and there is no obligation attached.

You can look at it whenever you like, and it works well on a phone:
https://sindrimar02.github.io/iceland-frumgerdir/preview/glasscottages/

The idea is simple. That someone who finds you sees the two cottages and the lava field at once, reads what your guests say, and books with you directly. I also look after hosting, maintenance and updates for the sites I build, if that is of interest.

Do let me know if you would like to talk. If not, that is completely fine.

Best regards,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
