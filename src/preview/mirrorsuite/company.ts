import type { PreviewCompany } from '../companies'

/**
 * Private brief + outreach copy for The Mirror Suite. Kept in this folder so
 * the preview route only ships its own data — [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'mirrorsuite',
  route: '/preview/mirrorsuite',
  name: 'The Mirror Suite',
  sector: 'Lúxusgisting / spegilsvítur',
  location: 'Ljárskógarströnd 17, 371 Búðardalur',
  region: 'West',
  established: 'Glass Suite ehf.; svítur við Hvammsfjörð, 50 m frá sjó',
  currentUrl: 'https://www.themirrorsuite.com',
  ownerEmail: 'info@themirrorsuite.com',
  concept: 'Speglaröðin við sjóinn',
  conceptTagline:
    'A row of mirror suites fifty metres from the sea, each with its own glass sauna and hot tub, named after the flora of the shore. The page is a dark shoreline at dusk: an expanding row of glass panels as the architecture, and the 5.0-star Google reputation their own booking page hides, surfaced.',
  accent: '#8FBFB0',
  dark: true,
  status: 'Concept ready',
  thumb: 'https://static.wixstatic.com/media/b9a0bb_51effcaa34194a56acdc6b07e18796f5~mv2.jpg',
  ownPhotography: true,
  audit: {
    strengths: [
      'World-class photography already exists: dozens of 4000–9500px originals on their own Wix media library, golden-hour exteriors with the landscape reflected in the cladding',
      'A real product edge: every suite has its own private glass sauna AND outdoor hot tub, 50 metres from the sea on Hvammsfjörður',
      'Named, reachable owners (Marat and Isabelle, the Glass Suite ehf.) and a 5.0 Google rating across 10 reviews',
    ],
    weaknesses: [
      'The booking page literally reads "Phone: coming soon", and booking is a plain contact form on a Wix template',
      'A live layout bug on their own homepage: the headline collides with the wordmark at the top of the hero, text over text, reproducible on reload (verified 2026-08-15)',
      'The presence is fragmented three ways: themirrorsuite.com (Wix), a parallel Lodgify subdomain, and ÖÖD\'s stayood/oodhotels channels, with no single canonical home; their own Lodgify page says "This property has no reviews yet" while Google holds 5.0',
    ],
    opportunities: [
      'One canonical site where the architecture designs the page: a row of glass panels that opens, suite names from the shore\'s own flora',
      'Surface the 5.0/10 Google reviews and the photography at the resolution it deserves',
      'A real request-to-book flow with dates instead of a contact form, and structured data for "mirror cabin Iceland" and "glass sauna hotel" queries',
    ],
  },
  positioning:
    'The Mirror Suite has the best photography and the clearest product of any mirror-cabin operator in Iceland, a row of ocean-front suites with private glass saunas, and presents it through a Wix template whose booking page says "Phone: coming soon" while the brand is scattered across three different booking channels. The prototype gives the row one dark, calm home built from the architecture itself.',
  outreach: {
    /* Rule 7 format, in the letter's own language. English is confirmed
       correct here: the owners are Marat and Isabelle (their own about page),
       neither name is Icelandic, and the site has no Icelandic version. */
    subject: 'An idea for a new website for The Mirror Suite',
    body: `Hi Marat and Isabelle,

My name is Sindri and I design websites for Icelandic stays.

I came across The Mirror Suite and stopped at the photography, the row of mirrored suites on Hvammsfjörður at dusk is one of the strongest products I have seen in Icelandic hospitality. A few things on the site work against it. On the booking page it still says "Phone: coming soon", and booking runs through a plain contact form with no dates. The homepage carries a Google badge showing 5.0 from 10 reviews, while your own Airbnb listing holds 4.98 from 54 and Guest Favourite status. Not one sentence a guest has written about you appears anywhere on your own domain.

That felt like a waste, so I sat down and designed a prototype of a new site for you. It costs you nothing and there is no obligation attached.

You can view it here any time, and it works well on a phone:
[HLEKKUR Á FRUMGERÐ]

The idea comes from the architecture: the page is a dark shoreline at dusk, the suites are a row of glass panels that open, and the names come from the flora of your own shore, with the plant behind each one. Booking becomes a real request with dates, and four of your Airbnb reviews are quoted on the page exactly as your guests wrote them.

If you like it I could finish the full site, and if not I hope you enjoy seeing the idea anyway.

Do let me know if you are interested.

Best regards,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
