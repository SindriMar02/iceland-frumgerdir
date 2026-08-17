import type { PreviewCompany } from '../companies'

/**
 * Private brief + outreach copy for Mirror Lodge. Kept in this folder so the
 * preview route only ever ships its own company data — [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'mirrorlodge',
  route: '/preview/mirrorlodge',
  name: 'Mirror Lodge Iceland',
  sector: 'Gistihús / glerskáli',
  location: 'Laugarás, Bláskógabyggð (við Geysi)',
  region: 'South',
  established: 'Vefur og skáli frá 2020; leyfi HG-00016971',
  currentUrl: 'https://mirrorlodge.com',
  ownerEmail: 'welcome@mirrorlodge.com',
  concept: 'Landslagið klæðir húsið',
  conceptTagline:
    'A mirror-clad cabin has no colour of its own: the landscape wears the house. The page is built on that fact — a pinned mirror frame where the cabin stays still while its reflected world wipes from snow to aurora, and a wordmark that stands on its own true reflection.',
  accent: '#4E7D6B',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://mirrorlodge.com/wp-content/uploads/2021/05/Mirror_Lodge-1200-4.jpg',
  ownPhotography: true,
  audit: {
    strengths: [
      'A genuinely singular product: a 25 m² mirror-glass cabin on a private property a stone\'s throw from Geysir, with two full-frame glass walls, a skylight over the bed and a private hot tub',
      'Golden Circle location is an SEO asset: Geysir, Gullfoss and Þingvellir are the highest-search-volume names in Icelandic tourism',
      'Trilingual site (EN/DE/IS) already exists, and the domain receives mail (Hostinger MX verified)',
    ],
    weaknesses: [
      'The site is a $59 ThemeForest hotel template ("Hoteller" theme + Elementor) whose footer still reads "Copyright © 2020", and og:modified shows it was last touched 2025-09-11',
      'There is no booking engine and no prices anywhere: "Ready to book?" is a plain email request form, and the nav has no Book or Prices page at all',
      'No LodgingBusiness schema of any kind (generic Yoast website markup only), and the gallery serves 800px images for a property whose entire product is visual',
    ],
    opportunities: [
      'A page built on the mirror itself: the cladding means the landscape wears the house, a design device no template can fake',
      'Publish availability and a real request-to-book flow so a €-range enquiry stops being a blind email exchange',
      'Structured data + AI-answer visibility for "glass cabin Golden Circle" and "mirror cabin Iceland" queries their template currently loses',
    ],
  },
  positioning:
    'Mirror Lodge is the Golden Circle\'s answer to Mirror House: a mirror-clad glass cabin minutes from Geysir with the strongest location in Icelandic tourism, presented through a 2020 hotel template whose footer admits its age. The prototype lets the cladding design the page: the cabin stands still, the landscape wipes across it, and booking becomes a real flow instead of an email hope.',
  outreach: {
    subject: 'Verðin ykkar koma hvergi fram, og hugmynd að nýrri síðu',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði.

Ég rakst á Mirror Lodge og staldraði við, spegilskáli með stjörnuglugga steinsnar frá Geysi er einstök vara. Vefsíðan segir samt aðra sögu. Hún keyrir á keyptu hótelsniðmáti, Hoteller, og verð koma hvergi fram á henni. Á bókunarsíðunni stendur meira að segja að gestir fái lægra verð á nótt ef þeir dvelja þrjár nætur eða lengur, án þess að verðið sjálft sé nokkurs staðar á síðunni. Myndirnar eru líka mjög smáar, sú stærsta er 1200 punktar á breidd og flestar um 300, á vef þar sem varan sjálf er sjónræn upplifun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri síðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin kemur frá skálanum sjálfum: spegilklæðningin þýðir að landslagið klæðir húsið. Á síðunni stendur skálinn kyrr á meðan endurspeglunin líður yfir hann, frá snjó yfir í norðurljós, allt með ykkar eigin myndum. Umsagnirnar ykkar á Google, 5,0 í 16 umsögnum, fá loksins pláss á ykkar eigin vef.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þið hafið gaman af því að skoða hugmyndina.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
