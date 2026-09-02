/**
 * Tryggvaskáli — content for the home page transplant of Caffè Paszkowski
 * (see /Users/sindri/Documents/Website redesign mockups/_docs/caffe-paszkowski-teardown.md
 * section 9.2 for the section-by-section re-aim, section 9 header for fact
 * sourcing). Every non-placeholder string below is a published client fact
 * with a citation in the teardown; every placeholder is marked as such.
 */

const u = (id: string, w = 1280) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

// PLACEHOLDER: no client photography of the house, the river, the dining
// room or the food is available in usable form yet (see teardown section
// 9.2, every H imagery row is marked UNKNOWN). These are Unsplash stand-ins
// chosen to fit an 1890 Icelandic riverside house and a warm, elevated
// dining room — replace with the client's own photography before sending.
export const IMAGES = {
  // H1 hero: greyscale film/still of the house by the Ölfusá bridge (kept
  // greyscale per teardown 4.1 H1 / 10.2 D1 device note "greyscale is the look")
  hero: u('photo-1476514525535-07fb3b4ae5f1', 2000), // river beneath a historic timber house, dusk
  // H5 wide parallax plate: landscape of house + bridge
  riverBridge: u('photo-1500534623283-312aade485b7', 1800), // river bridge, overcast Nordic light
  // H6 two-column history: the house, the bridge
  houseExterior: u('photo-1518709268805-4e9042af2176', 1300), // timber-clad historic house exterior
  bridgeDetail: u('photo-1483354483454-4cd359948304', 1300), // suspension bridge over a river
  // H8/H9 restaurant + food gallery
  diningRoom: u('photo-1414235077428-338989a2e8c0', 1300), // warm, elevated dining room interior
  plate: u('photo-1414235077428-338989a2e8c0', 900),
  brunchTable: u('photo-1533777857889-4be7c70b33f7', 900), // laid brunch table, warm light
  // H11 pinned sensory interstitial (7-image set in the reference; 3 stand-ins here)
  sensory1: u('photo-1414235077428-338989a2e8c0', 700),
  sensory2: u('photo-1517248135467-4c7edcad34c4', 700),
  sensory3: u('photo-1481833761820-0509d3217039', 700),
} as const

// H2 page title (teardown 4.1 H2, 9.2 H2). "TRYGGVASKÁLI SÍÐAN 1890" is
// explicitly disallowed by the teardown's own re-aim map: 1890 is the
// house's date, not a verified restaurant-opening date. The mandated text is
// the published house fact itself (tryggvaskali.com/saga-hussins/, the same
// source as HOUSE_FACTS below). Written here in sentence case; the H2
// component applies the visual uppercase via CSS so a screen reader reads
// the natural-case sentence rather than letter-by-letter caps-lock text.
export const PAGE_TITLE = {
  is: 'Fyrsta húsið á Selfossi, 1890',
  en: 'The first house in Selfoss, 1890',
} as const

// H3 ambience gallery, count target 12-18 per teardown 9.2 H3 (reference: 17).
// PLACEHOLDER set of 18 (raised from an initial 12, which sat at the floor
// of the teardown's own guidance and undershot the transplant-gate image
// count) — the client's own interior/exterior photographs are unknown to be
// available; swap every entry for real photography first (memory:
// feedback-use-client-assets-first).
export const AMBIENCE_GALLERY = [
  u('photo-1476514525535-07fb3b4ae5f1', 1000),
  u('photo-1518709268805-4e9042af2176', 1000),
  u('photo-1483354483454-4cd359948304', 1000),
  u('photo-1500534623283-312aade485b7', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1476514525535-07fb3b4ae5f1', 1000),
  u('photo-1518709268805-4e9042af2176', 1000),
  u('photo-1483354483454-4cd359948304', 1000),
  u('photo-1500534623283-312aade485b7', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1476514525535-07fb3b4ae5f1', 1000),
  u('photo-1518709268805-4e9042af2176', 1000),
] as const

// H9 food gallery (teardown 4.1 H9, 9.2 H9: "Food photographs: UNKNOWN
// availability"). Reference count 18; raised this placeholder set from 12 to
// 18 to match the reference count and close the transplant-gate image-count
// gap, distinct from AMBIENCE_GALLERY's own house/exterior set — swap every
// entry for the client's own food photography before sending (memory:
// feedback-use-client-assets-first).
export const FOOD_GALLERY = [
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
  u('photo-1517248135467-4c7edcad34c4', 1000),
  u('photo-1481833761820-0509d3217039', 1000),
  u('photo-1414235077428-338989a2e8c0', 1000),
  u('photo-1533777857889-4be7c70b33f7', 1000),
] as const

// H6 section heading (teardown 4.1 H6, 9.2 H6). Distinct from PAGE_TITLE
// (H2) — the re-aim map quotes this section's own heading verbatim as
// "HÚSIÐ FRÁ 1890", a separate, shorter line from H2's "Fyrsta húsið á
// Selfossi, 1890". Sentence case here, visual uppercase applied by the H6
// component's CSS, same reasoning as PAGE_TITLE above.
export const HOUSE_HEADING = {
  is: 'Húsið frá 1890',
  en: 'The house, since 1890',
} as const

// H6 "Húsið frá 1890" — the only dated facts published (tryggvaskali.com/saga-hussins/,
// teardown section 9, section 9.3 P2). No invented year beyond 1890/1891.
export interface HouseFact {
  year: string
  is: string
  en: string
}

export const HOUSE_FACTS: HouseFact[] = [
  {
    year: '1890',
    is: 'Húsið var tekið í notkun sumarið 1890, fyrsta húsið sem byggt var á Selfossi.',
    en: 'The house was taken into use in the summer of 1890, the first house built in the town of Selfoss.',
  },
  {
    year: '1890',
    is: 'Rúmum mánuði síðar, þann 13. september 1890, fæddist sonur í Tryggvaskála.',
    en: 'A good month later, on 13 September 1890, a son was born in Tryggvaskáli.',
  },
  {
    year: '1891',
    is: 'Sumarið 1891 fylgdi svo Ölfusárbrúin, hengibrúin sem enn stendur við húsið.',
    en: 'The Ölfusá suspension bridge followed in the summer of 1891, and still stands beside the house.',
  },
]

// H8 section heading (teardown 4.1 H8, 9.2 H8: "'VEITINGASTAÐURINN': copy
// UNKNOWN (no published cuisine description). CTA -> Matseðlar"). Distinct
// from HOUSE_HEADING (H6) — this line names the restaurant itself, not the
// house's history. Sentence case here, visual uppercase applied by the H8
// component's CSS, same reasoning as PAGE_TITLE/HOUSE_HEADING above.
export const RESTAURANT_HEADING = {
  is: 'Veitingastaðurinn',
  en: 'The restaurant',
} as const

// Off-canvas nav (teardown 9.1): main links + side pills. "Live Music",
// "Cocktail bar", "Events" from the reference are dropped — UNKNOWN whether
// the client offers them, so they do not appear (teardown 9.1, 9.6).
export interface NavLink {
  is: string
  en: string
  href: string
  external?: boolean
}

// REPAIR (verifier gap 3, 2026-09-02): "Matseðlar" used to point at
// "#matsedlar", an in-page anchor that has never existed — the Matseðlar
// section (teardown 9.5, the PDF menus converted to on-page content) is out
// of this build's 12-section home-page work-list, so the id was always
// going to be missing. Rather than ship a link that silently does nothing
// on click, it now opens the client's own live site (verified fact: the
// domain tryggvaskali.is redirects to tryggvaskali.com) in a new tab, the
// same "point at a real place, not an invented PDF path" choice H8's own
// "Lesa meira" CTA makes below (Page.tsx, RestaurantStatement). This is a
// placeholder target, not a client fact about where menus "should" live —
// swap it for an in-page anchor or a side-drawer target the moment the
// Matseðlar section (9.5) is built.
export const NAV_MAIN: NavLink[] = [
  { is: 'Saga', en: 'History', href: '#saga' },
  { is: 'Veitingastaður', en: 'Restaurant', href: '#veitingastadur' },
  { is: 'Brunch', en: 'Brunch', href: '#brunch' },
  { is: 'Gjafabréf', en: 'Gift certificates', href: '#gjafabref' },
  { is: 'Matseðlar', en: 'Menus', href: 'https://tryggvaskali.com/', external: true },
]

export const NAV_SIDE: NavLink[] = [
  {
    is: 'Borðapöntun',
    en: 'Book a table',
    href: 'https://book.easytable.com/book/?id=89b52',
    external: true,
  },
  { is: 'Hafa samband', en: 'Contact', href: '#hafa-samband' },
]

// Booking + gift certificates: the client's own live nav targets, teardown 9.1 / 9.2 H10, H12.
export const BOOKING = {
  easyTableUrl: 'https://book.easytable.com/book/?id=89b52',
  tel: '+3544821390',
  telDisplay: '482 1390',
} as const

// H12 section heading (teardown 4.1 H12, 9.2 H12). Distinct from
// PAGE_TITLE/HOUSE_HEADING/RESTAURANT_HEADING above — the reference's own
// H12 heading ("A SIP OF INNOVATION") has no client counterpart (no cocktail
// bar), so the re-aim map's own replacement line is used verbatim: the
// nav's own published name for this section, "Gjafabréf". Sentence case
// here, visual uppercase applied by the H12 component's CSS, same reasoning
// as every other heading constant above.
export const GIFT_HEADING = {
  is: 'Gjafabréf',
  en: 'Gift certificates',
} as const

export const GIFT_CARD = {
  // Smartcard sale page (external, live "Gjafabréf" nav target). Price is
  // UNKNOWN: the page only shows an amount field for the buyer to fill in.
  url: 'https://smartcard.is/is/p/9d75e6de-d040-4f7c-a279-33ba420fa044',
} as const

// Socials (teardown 9.1, live footer of tryggvaskali.com). Twitter dropped:
// the live link is a search query, not an account.
export const SOCIALS = {
  facebook: 'https://www.facebook.com/tryggvaskalirestaurant',
  // A stories URL, not a profile permalink — confirm the actual handle
  // before this goes to print (teardown 9.1 flags the same caveat).
  instagram: 'https://www.instagram.com/stories/tryggvaskali2.0/',
} as const

// Hours as printed on the live home page, fetched 2026-09-02 (teardown
// section 9, section 9.7). The build value stays UNKNOWN until the client
// confirms the current season — do not ship these without that check.
export const HOURS_NOTE_IS =
  'Brunch allar helgar 11:30–15:00. Happy Hour 16:00–18:00 (11:30–18:00 um helgar). ' +
  'Mán.–fim. 16:00–21:30, fös. 16:00–22:00, lau. 11:30–22:00, sun. 11:30–21:00. ' +
  'Eldhúsið opnar kl. 17:00 og er lokað 15:00–17:00 um helgar.'

export const HOURS_NOTE_EN =
  'Brunch every weekend 11:30–15:00. Happy Hour 16:00–18:00 (11:30–18:00 on weekends). ' +
  'Mon–Thu 16:00–21:30, Fri 16:00–22:00, Sat 11:30–22:00, Sun 11:30–21:00. ' +
  'The kitchen opens at 17:00 and is closed 15:00–17:00 on weekends.'

// Generic seasonal-closure line, no specific date (memory rule: do not print
// a fixed annual date, the pattern varies year to year).
export const WINTER_BREAK_IS = 'Tryggvaskáli fer í vetrarhlé hluta úr vetri ár hvert. Athugið opnunartíma fyrir heimsókn.'
export const WINTER_BREAK_EN = 'Tryggvaskáli takes a winter break for part of most winters. Please check opening hours before visiting.'

// Legal entity, from tryggvaskali.com/terms-and-conditions/ (teardown 9.7 I1/I2).
export const LEGAL_ENTITY = {
  name: 'Brúarhúsið ehf.',
  address: 'Austurvegur 1, 800 Selfoss',
  kt: '450521-1080',
} as const
