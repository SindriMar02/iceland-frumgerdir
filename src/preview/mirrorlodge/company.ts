import type { PreviewCompany } from '../company-types'
/* SIGN is not imported: this letter is English (see the outreach note below),
   so the shared Icelandic "Bestu kveðjur" sign-off does not belong on it. */

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
  /**
   * ENGLISH, not Icelandic. This was written in Icelandic on the assumption
   * that an Icelandic property has an Icelandic owner, which was never
   * checked. Mirror Lodge was created by REBECCA SCHNOBL — named as "the
   * owner and creator of the lodge" by Scan Magazine (2024-03-04), and her
   * own LinkedIn is German-educated (Fachhochschule Dortmund, Abitur at
   * Ernst-Abbe-Gymnasium), living in Reykjavík as Icelandair's DACH marketing
   * specialist. English is the safe common language; German would be a
   * flourish that costs a lot if the assumption is wrong a second time.
   *
   * CORRECTION 2026-08-18: an earlier version of this note claimed the site
   * ships "no Icelandic version at all". That is false. mirrorlodge.com/is/
   * is a real, fully translated Icelandic page (verified 2026-08-18). The
   * language call still stands on the owner, not on the site. Worth knowing
   * for a follow-up: all three versions, /is/ and /de/ included, ship
   * lang="en-US" in the markup, so their own Icelandic page tells Google it
   * is English.
   */
  outreach: {
    subject: 'An idea for a new website for Mirror Lodge',
    body: `Hi Rebecca,

My name is Sindri and I design websites for Icelandic stays.

I came across Mirror Lodge and stopped: a mirror-clad cabin with a skylight over the bed, five minutes from Geysir, is a genuinely rare product. The website tells a different story. It runs on a bought hotel theme, Hoteller, and no price appears anywhere on it. The booking page even offers a lower nightly rate for stays of three nights or more without ever naming the rate. The photographs are small too, the largest is 1200 pixels wide and most are around 300, on a site where the product itself is a visual experience.

That felt like a waste, so I sat down and designed a prototype of a new site for you. It costs you nothing and there is no obligation attached.

You can view it here any time, and it works well on a phone:
[HLEKKUR Á FRUMGERÐ]

The idea comes from the cabin itself: mirror cladding means the landscape wears the house. On the page the cabin stays still while the reflection moves across it, from snow through to the northern lights, all of it your own photography. And your Google reviews, 5.0 from 16, finally get room on your own site instead of only on Google.

If you like it I could finish the full site, and if not I hope you enjoy seeing the idea anyway.

Do let me know if you are interested.

Best regards,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
