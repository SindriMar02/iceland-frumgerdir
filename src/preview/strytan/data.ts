/**
 * Strýtan Dive Center (Hjalteyri, Eyjafjörður) — verified content only.
 *
 * Sources (fetched 2026-07-07):
 *  - strytan.is + strytan.is/about-strytandivecenter (live + WebFetch)
 *  - Founded 2010 by Erlendur Bogason to dive the geothermal hydrothermal
 *    chimneys ("strýtur") in Eyjafjörður.
 *  - Erlendur: commercial diver since 1997, sea-urchin diving from 1993, at the
 *    Marine Research Institute of Iceland from 1996; discovered the Ystavík
 *    chimney (1997), which became Iceland's FIRST underwater protected area
 *    (2001); discovered the shallower Arnarnes chimneys (2004); ministerial
 *    recognition 2007; research ties with the University of Akureyri and ÍSOR
 *    (Iceland GeoSurvey); PADI instructor.
 *  - Address: Hjalteyri, 601 Akureyri (west bank of Eyjafjörður).
 *  - Contact: strytan@strytan.is · +354 862 2949.
 *  - Strong TripAdvisor reviews (site leans on them).
 *
 * NO PRICES are published anywhere — booking today is by email/phone. This
 * prototype keeps that honest: a designed "request a dive" enquiry flow, no
 * invented prices. Sample review lines are labelled illustrative (footer +
 * on-page) and are not attributed to real named individuals.
 */

export const EMAIL = 'strytan@strytan.is'
export const PHONE_DISPLAY = '+354 862 2949'
export const PHONE_HREF = 'tel:+3548622949'
export const MAPS = 'https://maps.google.com/?q=Strýtan+Dive+Center,+Hjalteyri,+Eyjafjörður'
export const TRIPADVISOR =
  'https://www.tripadvisor.com/Attraction_Review-g189954-d2455539-Reviews-Strytan_Divecenter-Akureyri_Northeast_Region.html'
export const CURRENT_SITE = 'https://strytan.is'

const ASSET = `${import.meta.env.BASE_URL}strytan/`
export const LOGO = `${ASSET}logo.png` // teal chimney + wordmark (their own)
export const LOGO_WHITE = `${ASSET}logo-white.png`

/** The dive sites — level & duration only, never a fabricated price. */
export const DIVES = [
  {
    id: 'big-strytan',
    name: 'Big Strýtan',
    tag: 'The flagship chimney',
    depth: '15–26 m',
    level: 'Drysuit + AOWD',
    body:
      'The only known hydrothermal chimney on Earth a recreational diver can reach. A cathedral of mineral cone rising from the deep, venting ~72°C water, built grain by grain over roughly 11,000 years.',
    highlights: ['Two boat dives', 'Iceland’s first protected marine site', 'Drysuit + Advanced (or equivalent)'],
  },
  {
    id: 'arnarnes',
    name: 'Arnarnes Chimneys',
    tag: 'Shallow & spellbinding',
    depth: '7–24 m',
    level: 'Drysuit certified',
    body:
      'A field of smaller chimneys in shallower water, discovered in 2004. Warm water shimmering off the cones, wolffish tucked in the rocks, and light enough to linger. The gentler way to meet the strýtur.',
    highlights: ['Shore or short boat', 'Great for photography', 'Warm-water shimmer + wolffish'],
  },
  {
    id: 'custom',
    name: 'Custom & Research Dives',
    tag: 'Tailored to you',
    depth: 'By arrangement',
    level: 'On request',
    body:
      'Photography charters, marine-life dives in Eyjafjörður, guided trips for film crews and researchers. Tell us what you are after and Erlendur will shape the dive around it.',
    highlights: ['Photo & film support', 'Marine life of the fjord', 'Guided by the diver who found them'],
  },
]

/** PADI courses — honest, general (their site offers beginner → advanced). */
export const COURSES = [
  { name: 'Discover Scuba', line: 'Never dived before? A guided first breath underwater, no certification needed.' },
  { name: 'PADI Open Water', line: 'Your first full certification, from theory to open-water dives in the fjord.' },
  { name: 'Advanced & Specialties', line: 'Drysuit, deep and more, the steps that open Big Strýtan to you.' },
]

/** The descent timeline — real, dated milestones. */
export const TIMELINE = [
  { year: '1997', text: 'Erlendur discovers the great geothermal chimney at Ystavík in Eyjafjörður.' },
  { year: '2001', text: 'Strýtan is declared Iceland’s first protected underwater natural monument.' },
  { year: '2004', text: 'The shallower Arnarnes chimney field is discovered nearby.' },
  { year: '2010', text: 'Strýtan Dive Center opens, sharing the chimneys with divers from around the world.' },
]

/** What you meet down there — grounded in the real sites. */
export const LIFE = [
  { name: 'The chimneys', line: '~72°C freshwater venting through mineral cones, ~11,000 years in the making.' },
  { name: 'Wolffish', line: 'Steinbítur watching from the rocks, curious and unbothered.' },
  { name: 'Whales above', line: 'Humpbacks work Eyjafjörður in season, sometimes heard from below.' },
  { name: 'Cold, clear water', line: 'Drysuit diving in some of the clearest, quietest water anywhere.' },
]

/** Illustrative review lines (SÝNISHORN) — grounded in real TripAdvisor themes,
 *  NOT attributed to real named people. Footer + section both disclaim. */
export const REVIEWS = [
  { quote: 'A once-in-a-lifetime dive. Not an on-rails tourist experience, real diving with an expert who knows every inch of the site.', by: 'Diver · TripAdvisor theme' },
  { quote: 'Erlendur’s knowledge of the geology and the marine life is extraordinary. We surfaced buzzing.', by: 'Diver · TripAdvisor theme' },
  { quote: 'The chimney is unlike anything I have ever seen underwater. Worth the trip north on its own.', by: 'Diver · TripAdvisor theme' },
]

export const SEASON = {
  headline: 'Diving all year, drysuit always',
  body:
    'Eyjafjörður is dived year-round. Big Strýtan needs a drysuit and an Advanced certification (or equivalent); if you are not there yet, Arnarnes and our courses are the way in. Message us with your certification level and dates and we will put together the right day.',
}

export const ADDRESS = { place: 'Hjalteyri', town: '601 Akureyri, Eyjafjörður' }
