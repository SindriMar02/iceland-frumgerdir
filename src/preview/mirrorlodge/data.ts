/**
 * Mirror Lodge — „Landslagið klæðir húsið" (the landscape wears the house).
 * Facts read off mirrorlodge.com's own EN pages 2026-08-14/15. English-first
 * prototype (their primary market; site is EN/DE/IS).
 */

const B = `${import.meta.env.BASE_URL}mirrorlodge`

export const EMAIL = 'welcome@mirrorlodge.com'
export const EMAIL_HREF = 'mailto:welcome@mirrorlodge.com'
export const INSTAGRAM = 'https://instagram.com/mirrorlodge'
export const LICENCE = 'HG-00016971'

export const IMG = {
  hero: `${B}/hero.jpg`,
  aurora: `${B}/aurora.jpg`,
  wide2: `${B}/wide-2.jpg`,
  geysir: `${B}/geysir.jpg`,
  cabin3: `${B}/cabin-3.jpg`,
  inside: `${B}/inside.jpg`,
  cabin6: `${B}/cabin-6.jpg`,
  g08: `${B}/g08.jpg`, g09: `${B}/g09.jpg`, g10: `${B}/g10.jpg`, g11: `${B}/g11.jpg`,
  g12: `${B}/g12.jpg`, g13: `${B}/g13.jpg`, g14: `${B}/g14.jpg`, g15: `${B}/g15.jpg`,
  g16: `${B}/g16.jpg`, g17: `${B}/g17.jpg`, g18: `${B}/g18.jpg`, g19: `${B}/g19.jpg`,
}

export const NAV = [
  { id: 'spegill', label: 'The mirror' },
  { id: 'skalinn', label: 'The cabin' },
  { id: 'stadurinn', label: 'The place' },
  { id: 'bokun', label: 'Book' },
]

export const HERO = {
  word: 'Mirror Lodge',
  sub: 'A glass cabin alone on a private property, a stone’s throw from Geysir.',
}

export const STATEMENT = {
  lead: 'The cabin has no colour of its own.',
  body:
    'Mirror glass on every wall means the house wears whatever the Golden Circle is doing: snow, birch, midnight sun, aurora. Twenty-five square metres for two, built to disappear into the view it borrows.',
}

/** The pinned mirror: their own photos wipe through a fixed frame. */
export const MIRROR_STOPS = [
  { img: 'hero', alt: 'The cabin mirrored in snow' },
  { img: 'wide2', alt: 'The cabin in the open land' },
  { img: 'aurora', alt: 'Aurora over the cabin' },
] as const

export const CABIN = {
  lead: 'Two glass walls, one skylight, and the bed in the middle of it.',
  body:
    'Both full-frame glass walls face the private property, and the skylight over the bed opens the night sky without leaving the duvet. Electric blinds close it all when you want the world gone. A full kitchen and a luxurious bathroom make it self-contained; the private hot tub on the terrace does the rest.',
  facts: [
    { n: '25', l: 'm²' },
    { n: '2', l: 'guests' },
    { n: '2+1', l: 'glass walls + skylight' },
  ],
  amenities: [
    'Private hot tub on the terrace',
    'Skylight with electric blinds over the bed',
    'Two full-frame glass walls',
    'Fully equipped kitchen',
    'Luxurious bathroom',
    'Private property, no neighbours in view',
  ],
}

export const SKY = {
  lead: 'The northern lights, from under the duvet.',
  body:
    'When there is enough darkness, between the end of August and the beginning of April, the aurora is visible straight through the skylight. The rest of the year the same glass holds the midnight sun.',
}

export const PLACE = {
  lead: 'A stone’s throw from Geysir.',
  body:
    'The lodge sits in the Golden Circle, about 1.5 hours from Reykjavík, with Þingvellir, Geysir and Gullfoss all within easy reach. Stay the night after the day-crowds leave and have the area to yourselves.',
  points: ['Geysir hot spring area', 'Gullfoss', 'Þingvellir National Park', '≈ 1.5 h from Reykjavík'],
}

export const GALLERY: { img: keyof typeof IMG; alt: string }[] = [
  { img: 'g08', alt: 'Mirror Lodge gallery photo' },
  { img: 'g09', alt: 'Mirror Lodge gallery photo' },
  { img: 'g10', alt: 'Mirror Lodge gallery photo' },
  { img: 'g11', alt: 'Mirror Lodge gallery photo' },
  { img: 'g13', alt: 'Mirror Lodge gallery photo' },
  { img: 'g14', alt: 'Mirror Lodge gallery photo' },
  { img: 'g15', alt: 'Mirror Lodge gallery photo' },
  { img: 'g18', alt: 'Mirror Lodge gallery photo' },
  { img: 'g19', alt: 'Mirror Lodge gallery photo' },
]

/**
 * TESTIMONIALS — REAL, quoted verbatim from the property's own Google Business
 * listing ("Mirror Lodge Iceland", maps place g/11qnzkb3x7, linked to
 * mirrorlodge.com and marked "Identifies as women-owned"), read 2026-08-16.
 *
 * Verified there the same day: 5.0 from 16 reviews, and the histogram puts ALL
 * SIXTEEN in the five-star bucket — there is no 4, 3, 2 or 1. Google's own
 * extracted topics: hot tub (9 mentions), kind host (3), responsive host (2),
 * stunning views (2). The owner replies to reviews by name, which is where
 * "responsive host" comes from.
 *
 * WHAT IS QUOTED: Google truncates each review and only fetches the remainder
 * on a real user expand, which would not fire under automation. Each quote
 * below is therefore the review's OPENING, verbatim and unedited, cut at a
 * clause boundary — never paraphrased, never completed by us. Olaf's original
 * runs on past this point with a typo ("in front of the and one side"); we cut
 * before it rather than silently repair his words.
 *
 * Dates are converted from Google's relative stamps ("3 months ago",
 * "4 months ago") read on 2026-08-16, so they are accurate to about a month.
 *
 * NOT THEIRS, never borrow: "Mirror House Iceland" is a DIFFERENT property —
 * licence HG-00017975 against Mirror Lodge's HG-00016971, and its own Google
 * entry (4.9 from 7, Skeljabrekka). Nor ÖÖD Hekla Horizon, nor The Mirror
 * Suite in Búðardalur.
 */
export const REVIEWS = {
  lead: 'Sixteen guests, sixteen five-star reviews, and none of them on your website.',
  body:
    'Every review Mirror Lodge has on Google is a five. Nothing on mirrorlodge.com says so: no prices, no availability, not one guest word. The page ends and the visitor has to email into the dark.',
  sourceNote:
    'Real reviews, quoted verbatim from your Google listing on 16 August 2026, where you hold 5.0 from 16 reviews — every one of them five stars. Each quote is the opening of a longer review. On your own site they would sit here, on your own domain, working for you.',
  score: '5.0',
  count: '16 Google reviews · all five stars',
  source: 'Google',
  quotes: [
    {
      text: 'The Mirror Lodge is nestled in between pure nature: no artificial garden, just a road that ends at the lodge.',
      meta: 'Olaf Riedel · Google, May 2026',
    },
    {
      text: 'We had the pleasure of staying at the Mirror Lodge in Iceland for three days — and it was absolutely fantastic!',
      meta: 'Katharina Wolf · Google, April 2026',
    },
    {
      text: 'We absolutely loved our stay at the Mirror Lodge, it was such a wonderful experience from start to finish.',
      meta: 'Saurabh · Google, April 2026',
    },
  ],
}

/** The journey: what the horizontal traverse steps through, in order. */
export const JOURNEY = {
  label: 'The journey',
  hint: 'Scroll',
}

export const BOOKING = {
  title: 'Ask for your nights',
  body: 'Minimum stay is two nights, and stays of three nights or more get a lower nightly rate. Send your dates and we answer personally with availability and a price. No card, no charge.',
  success: 'Thank you. Your request is with us and we answer personally, usually within a day.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Mirror Lodge Iceland',
  description:
    'A 25 m² mirror-glass cabin for two on a private property near Geysir in Iceland’s Golden Circle, with two full-frame glass walls, a skylight over the bed and a private hot tub.',
  email: EMAIL,
  url: 'https://mirrorlodge.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Bláskógabyggð', addressRegion: 'Suðurland', addressCountry: 'IS' },
  identifier: LICENCE,
  numberOfRooms: 1,
  petsAllowed: false,
  sameAs: [INSTAGRAM],
}
