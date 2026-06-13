/**
 * FIMM — "The Latent Atlas". Source data for the opportunity-thesis experience
 * about five real, small Icelandic businesses identified as redesign targets.
 *
 * HONESTY CONTRACT (these are real, unconsented businesses):
 * - `signal` lines are real, attributable public facts (founding year, a
 *   TripAdvisor rank, etc.) gathered during research.
 * - All 0–100 `scores` and market-map coordinates are the STUDIO'S CONCEPT
 *   ESTIMATES, not measured data — the UI labels them as such.
 * - `currentState` critiques are observations of the live sites, kept fair.
 * - Contact emails are deliberately NOT included here (private to outreach).
 */

export interface Scores {
  /** depth of story / years operating */
  heritage: number
  /** observed customer demand (reviews, rank, footfall signals) */
  demand: number
  /** how far the current website lags — the upside lever */
  digitalGap: number
  /** brand ceiling a modern presence could reach */
  upside: number
}

export interface ThesisCompany {
  id: string
  name: string
  sector: string
  location: string
  region: string
  established: string
  accent: string
  /** one-line essence */
  essence: string
  /** the real, attributable proof point */
  signal: string
  /** fair observation of the current site */
  currentState: string
  /** the core thesis — why value is hidden here */
  latentValue: string
  /** the single highest-leverage move */
  theMove: string
  /** what competitors cannot copy */
  advantage: string
  /** the future-state one-liner */
  futureState: string
  scores: Scores
  /** market-map position: x = digital maturity (0 none → 100 modern), y = latent strength */
  map: { x: number; y: number }
}

export const SCORE_DIMENSIONS: { key: keyof Scores; label: string; hint: string }[] = [
  { key: 'heritage', label: 'Heritage', hint: 'Depth of story competitors can’t copy' },
  { key: 'demand', label: 'Demand', hint: 'Observed customer pull today' },
  { key: 'digitalGap', label: 'Digital gap', hint: 'How far the current site lags — the lever' },
  { key: 'upside', label: 'Upside', hint: 'Brand ceiling a modern presence reaches' },
]

export const COMPANIES: ThesisCompany[] = [
  {
    id: 'erpsstadir',
    name: 'Rjómabúið Erpsstaðir',
    sector: 'Artisan creamery',
    location: 'Dalir, West Iceland',
    region: 'West',
    established: 'Est. 2009',
    accent: '#f2c14e',
    essence: 'A family dairy turning its own milk into ice cream, skyr and cheese — sold straight from the farm.',
    signal: 'A known stop on the Route 60 run toward the Westfjords; home of the “Kjaftæði” farm ice-cream brand.',
    currentState:
      'Effectively no website — a single full-screen autoplaying video with the name and three social links. No products, hours, map, or shop.',
    latentValue:
      'A beloved farm brand with real footfall and a cult product, but zero web presence to capture it. The largest digital gap of the five — almost nothing to undo, everything to build.',
    theMove: 'A real brand site: the products, the story, opening hours, a map, and a simple farm-shop pre-order.',
    advantage: 'Farm-to-cone authenticity and a named ice-cream brand on a fixed tourist route.',
    futureState: 'The Dalir region’s signature creamery — discoverable, photographed, pre-ordered before arrival.',
    scores: { heritage: 70, demand: 80, digitalGap: 96, upside: 92 },
    map: { x: 8, y: 84 },
  },
  {
    id: 'tjoruhusid',
    name: 'Tjöruhúsið',
    sector: 'Seafood restaurant',
    location: 'Ísafjörður, Westfjords',
    region: 'Westfjords',
    established: '20+ years',
    accent: '#4aa3c7',
    essence: 'A catch-of-the-day fish buffet served inside a 300-year-old former tar house by the harbour.',
    signal: 'Ranked #1 of 9 restaurants in Ísafjörður on TripAdvisor — a destination in its own right.',
    currentState:
      'One barebones text-only page: no images, menu, hours or booking. The owners cheerfully admit they aren’t “interested in the internet.”',
    latentValue:
      'A cult institution whose reputation travels entirely by word of mouth. The dish, the room and the ritual are world-class; the web presence captures none of it.',
    theMove: 'A single evocative page that sells the buffet ritual — the room, the catch, the season, an easy reservation.',
    advantage: 'The 300-year-old building and a fixed-price, whatever-came-in-today buffet no chain can replicate.',
    futureState: 'The first thing every Westfjords traveller books — before the drive, not after.',
    scores: { heritage: 92, demand: 95, digitalGap: 90, upside: 88 },
    map: { x: 15, y: 92 },
  },
  {
    id: 'ektafiskur',
    name: 'Ektafiskur',
    sector: 'Artisan fish producer',
    location: 'Hauganes, North Iceland',
    region: 'North',
    established: 'Since 1940',
    accent: '#7fb0c9',
    essence: 'Hand-salted cod and bacalao with a webshop and an on-site Baccalá Bar in a tiny northern village.',
    signal: 'An 80-year heritage producer (since 1940) — retail, restaurant and export under one roof.',
    currentState:
      'An early-2000s desktop-first site: thumbnail product images, weak hierarchy, inconsistent across languages, and a shaky webshop.',
    latentValue:
      'Eight decades of provenance and a product with genuine export demand, under-sold by a site that looks two decades behind the fish.',
    theMove: 'A modern bilingual brand with a webshop that actually converts, plus the Baccalá Bar as a destination.',
    advantage: 'Verifiable 1940 provenance and bacalao authenticity — heritage as the moat.',
    futureState: 'A premium Icelandic seafood label that ships abroad and fills the bar on arrival.',
    scores: { heritage: 96, demand: 74, digitalGap: 78, upside: 84 },
    map: { x: 34, y: 82 },
  },
  {
    id: 'kaffihornid',
    name: 'Kaffi Hornið',
    sector: 'Café · bar · restaurant',
    location: 'Höfn í Hornafirði, SE Iceland',
    region: 'Southeast',
    established: 'Since 1999',
    accent: '#d98b5a',
    essence: 'A 27-year owner-run café and restaurant in Iceland’s langoustine capital.',
    signal: 'Operating since 1999 — a single-location institution in a busy south-east tourist town.',
    currentState:
      'A dated site frozen at “© 2018”: repeated broken logos, thin layout and no mobile optimisation, on a busy travel route where most diners arrive by phone.',
    latentValue:
      'A reliable, high-traffic local favourite in a town defined by langoustine — invisible to the phone-first travellers driving past it daily.',
    theMove: 'A modern, mobile-first site: the menu, the langoustine story, hours and reservations that work in a thumb.',
    advantage: 'Longevity plus the Höfn-langoustine association no newcomer can claim.',
    futureState: 'The default table in Höfn — found, photographed and booked from the road.',
    scores: { heritage: 76, demand: 82, digitalGap: 84, upside: 80 },
    map: { x: 24, y: 73 },
  },
  {
    id: 'seakayak',
    name: 'Sea Kayak Iceland',
    sector: 'Sea-kayaking operator',
    location: 'Stokkseyri, South Iceland',
    region: 'South',
    established: 'Since 1995',
    accent: '#5ad1e6',
    essence: 'A small, 30-year sea-kayaking operator a short drive from Reykjavík and the south coast.',
    signal: 'Operating since 1995; TripAdvisor 4.8 and ranked #1 of 2 activities in Stokkseyri.',
    currentState:
      'A dated, desktop-oriented WordPress template with a weak booking flow — and a Gmail address despite owning the domain.',
    latentValue:
      'Three decades of safety and reviews, minutes from the country’s busiest tourist corridor, throttled by a site that doesn’t convert or take bookings cleanly.',
    theMove: 'A conversion-focused experience: the trips, the safety record, real-time availability and instant booking.',
    advantage: 'Thirty years of operation and proximity to Reykjavík and the Golden Circle.',
    futureState: 'The obvious half-day add-on for every south-coast itinerary — booked in two taps.',
    scores: { heritage: 80, demand: 78, digitalGap: 72, upside: 82 },
    map: { x: 41, y: 70 },
  },
]

export interface RoadmapPhase {
  no: string
  title: string
  body: string
}

export const ROADMAP: RoadmapPhase[] = [
  { no: '01', title: 'Survey', body: 'Audit the current site, the customers and the competitors. Find the one positioning the brand already owns.' },
  { no: '02', title: 'Design', body: 'A bespoke prototype — the kind already built for five Icelandic operators — proving the new world before a line of production code.' },
  { no: '03', title: 'Build', body: 'A fast, responsive, accessible site with the booking, shop or reservation flow the business actually needs.' },
  { no: '04', title: 'Automate', body: 'Wire the quiet machinery: direct booking, payments, review capture, email — and an AI concierge for first-line questions.' },
  { no: '05', title: 'Compound', body: 'SEO, content and a direct channel that keeps the OTA commission, so the work pays back month after month.' },
]

export const PREMISE = [
  { k: 'The product is ready', v: 'Every one of these businesses already delivers something excellent. None of them has a storefront that says so.' },
  { k: 'Discovery moved to the phone', v: 'Travellers decide on a screen in their hand. Most of these sites were never built for one.' },
  { k: 'The commission leak', v: 'Each OTA booking quietly skims its cut. A site that converts directly keeps that margin in the business.' },
  { k: 'Heritage is the moat', v: 'Years, provenance and place are the things competitors can’t copy — and the things these sites hide.' },
]
