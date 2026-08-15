import type { PreviewCompany } from '../companies'

/**
 * Private brief + outreach copy for Iceland Luxury Lodges. Kept in this
 * folder (not in the shared catalogue) so the preview route only ever
 * ships its own company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'icelandluxurylodges',
  route: '/preview/icelandluxurylodges',
  name: 'Iceland Luxury Lodges',
  sector: 'Lúxusgisting',
  location: 'Miðengi 17, 800 Selfoss',
  region: 'South',
  established: 'Vefur frá 2019; Úlfljótsskáli, Álftavík og Áslundur við Gullna hringinn',
  currentUrl: 'https://icelandluxurylodges.com',
  ownerEmail: 'signy@icelandluxurylodges.com',
  concept: 'Húsin við vötnin',
  conceptTagline:
    'One owner, four keys, two lakes. The page is built on the waterline: every estate stands above its own live reflection, the landing forks into full-height doors per house, and the flagship lodge finally gets the presentation a 10-bedroom, sleeps-19 estate deserves.',
  accent: '#41607A',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://icelandluxurylodges.com/wp-content/uploads/2019/05/fullsizeoutput_d49-1.jpeg',
  ownPhotography: true,
  audit: {
    strengths: [
      'A genuinely premium portfolio: Úlfljótsskáli sleeps 19 in 10 bedrooms with sauna, gym and game room, and the Álftavík lakefront villa holds 4.94 of 5 across 162 Airbnb reviews as a Top guest favorite',
      'Real photography exists: the full interior set (master suite, spa lounge, sauna, gym, game room) plus six Álftavík villa shots are already on their own server',
      'One reachable decision-maker for the whole collection: signy@icelandluxurylodges.com, +354 822 2202',
    ],
    weaknesses: [
      'The homepage hero renders as a solid black void: the Slider Revolution plugin requests a 2019 photo that never paints, verified live 2026-08-15',
      'WordPress 6.5.10, zero schema.org markup of any kind, no meta description and no booking engine anywhere on the 42-page site',
      'The theme\'s demo content is still publicly live and indexable: "Desert Safari Dubai", "Maldives Resort and Spa", "African Safari", lorem-ipsum posts and a "Kids Package" offer page on an Icelandic luxury-lodge site',
    ],
    opportunities: [
      'An umbrella collection site: one landing that forks into a full sub-experience per house, so the lodge, both lakefront villas and the Reykjavík apartment each get their own hero and their own enquiry flow',
      'Surface the guest reputation their own site never mentions: 4.94/162 on Airbnb and 10/10 Vrbo reviews live only on OTA pages today',
      'Every booking currently flows through Airbnb, Booking.com or Vrbo at OTA commission; a direct request-to-book flow on their own domain is the number that pays for the build',
    ],
  },
  positioning:
    'Iceland Luxury Lodges runs some of the most expensive private stays in the country, a 10-bedroom Golden Circle lodge and two lakefront villas with an infinity hot tub that merges into Álftavatn, behind a 2019 WordPress site whose hero is a black void and whose sitemap still advertises Dubai desert safaris from the theme demo. The prototype gives the collection the structure it actually has: one waterline, four houses, each behind its own door.',
  outreach: {
    subject: 'Forsíðan ykkar opnast svört — og hugmynd að nýrri',
    body: `Sæl Signý,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði.

Ég var að skoða icelandluxurylodges.com og tók eftir þrennu sem mig grunar að þið vitið ekki af. Forsíðumyndin birtist alls ekki, síðan opnast bara svört, myndasleðinn nær aldrei að teikna myndina. Í leitarkortinu ykkar eru enn æfingasíður úr sniðmátinu, þar á meðal „Desert Safari Dubai" og „Maldives Resort and Spa", sem Google getur skráð. Og hvergi á síðunni kemur fram að Álftavík heldur 4,94 af 5 í 162 umsögnum á Airbnb.

Mér fannst það synd, því safnið ykkar á betra skilið, svo ég settist niður og hannaði frumgerð að nýjum vef fyrir alla eignirnar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld: eitt safn, fjögur hús. Forsíðan skiptist í dyr fyrir hvert hús, Úlfljótsskáli fær loksins framsetningu sem hæfir 10 herbergja húsi fyrir 19 gesti, og hver eign endar á fyrirspurnarformi beint til ykkar í stað þess að senda alla á Airbnb og Booking sem taka þóknun af hverri nótt.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þið hafið gaman af því að skoða hugmyndina.

Endilega láttu mig vita ef þú hefur áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
