/**
 * Tryggvaskáli — content for the home page transplant of Caffè Paszkowski
 * (see /Users/sindri/Documents/Website redesign mockups/_docs/caffe-paszkowski-teardown.md
 * section 9.2 for the section-by-section re-aim, section 9 header for fact
 * sourcing). Every non-placeholder string below is a published client fact
 * with a citation in the teardown; every placeholder is marked as such.
 */

/* The Unsplash helper is gone with the last placeholder. The teardown marked
   every imagery row UNKNOWN and this build filled them with stock; the client
   publishes its own photographs, including a historic shot of the bridge, and
   those are now used throughout. */
// The client's own photographs, harvested from tryggvaskali.com on 2026-09-05
// (tryggvaskali.is 301s to it). Provenance in public/tryggvaskali/
// HARVEST-MANIFEST.json. These are Tryggvaskáli's pictures of Tryggvaskáli,
// taken from Tryggvaskáli's own live site for a redesign OF that site — not
// stock, and not for reuse on any other build.
//
// This replaces a set of Unsplash placeholders whose own comments admitted
// they showed the wrong thing: a rowboat on Lago di Braies for a house on the
// Ölfusá, mountain ridges labelled as bridges, a metropolitan fusion dining
// room. The client publishes something far better than any of them: a
// historic photograph of the old suspension bridge with the buildings beside
// it, which is the entire premise of this restaurant.
const own = (f: string) => `${import.meta.env.BASE_URL}tryggvaskali/${f}`

export const IMAGES = {
  // H1 hero, greyscale by design (teardown 4.1 H1 / D1, "greyscale is the
  // look") — and this frame is a genuine historic black and white, so the
  // treatment is the photograph's own rather than a filter over stock.
  // CAUTION: native 1024x662, upscaled at full bleed. Ask for a scan.
  hero: own('ts-bru-sogulegt.jpg'),
  // H5 wide parallax plate
  riverBridge: own('ts-bru-sogulegt.jpg'),
  // H6 two-column history: the house and the bridge
  houseExterior: own('ts-bru-smatt.jpg'),
  bridgeDetail: own('ts-bru-smatt.jpg'),
  // H8/H9 restaurant and food, all theirs
  diningRoom: own('ts-rettur-1.jpg'),
  plate: own('ts-rettur-2.jpg'),
  brunchTable: own('ts-brunch.jpg'),
  // H11 pinned sensory interstitial
  sensory1: own('ts-rettur-3.jpg'),
  sensory2: own('ts-eftirrettur.jpg'),
  sensory3: own('ts-kokteill.jpg'),
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
/* DEDUPLICATED 2026-09-02. This array padded 8 photos out to 18 by
   repeating them, purely to hit the transplant gate's image-count band.
   The cost: the same picture appeared three times in one strip, and the
   marquee generated 18 focusable buttons all labelled "Stækka mynd", i.e.
   18 identical tab stops (accessibility audit). It also still contained
   photo-1518709268805-..., which 404s from Unsplash and rendered as a bare
   gradient. Now the distinct, verified-200 set only. A count is not worth
   showing the same room three times. */
export const AMBIENCE_GALLERY = [
  own('ts-bru-sogulegt.jpg'),
  own('ts-bru-smatt.jpg'),
  own('ts-rettur-1.jpg'),
  own('ts-rettur-3.jpg'),
  own('ts-brunch.jpg'),
  own('ts-eftirrettur.jpg'),
  own('ts-kokteill.jpg'),
  own('ts-espresso.jpg'),
] as const

// H9 food gallery (teardown 4.1 H9, 9.2 H9: "Food photographs: UNKNOWN
// availability"). Reference count 18; raised this placeholder set from 12 to
// 18 to match the reference count and close the transplant-gate image-count
// gap, distinct from AMBIENCE_GALLERY's own house/exterior set — swap every
// entry for the client's own food photography before sending (memory:
// feedback-use-client-assets-first).
/* DEDUPLICATED 2026-09-02, same reason as AMBIENCE_GALLERY above: this
   was 4 photos repeated to 18. Replace all four with the client's own food
   photography before sending. */
export const FOOD_GALLERY = [
  own('ts-rettur-1.jpg'),
  own('ts-rettur-2.jpg'),
  own('ts-rettur-3.jpg'),
  own('ts-eftirrettur.jpg'),
  own('ts-eftirrettur-2.jpg'),
  own('ts-brunch.jpg'),
  own('ts-kokteill.jpg'),
  own('ts-espresso.jpg'),
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
    /* CORRECTED 2026-09-02 against the client's own history page
       (tryggvaskali.com/saga-hussins/): the 1891 suspension bridge was
       formally opened 8 September 1891, and it is NOT the bridge standing
       there today — "Ný Ölfusábrú var svo tekin í notkun 22. desember
       1945". The previous copy claimed the 1891 bridge still stands,
       which any Selfoss local would catch on sight. */
    is: 'Hengibrúin yfir Ölfusá var opnuð 8. september 1891, fyrir forgöngu Tryggva Gunnarssonar sem skálinn heitir eftir.',
    en: 'The Ölfusá suspension bridge opened on 8 September 1891, led by Tryggvi Gunnarsson, after whom the house is named.',
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
  /* The label promises menus; the old site publishes them as PDFs off
     its own front page, so the link is honest only if the label says
     where it goes (audit 2026-09-02). */
  { is: 'Matseðlar á núverandi vef', en: 'Menus on the current site', href: 'https://tryggvaskali.com/', external: true },
]

export const NAV_SIDE: NavLink[] = [
  {
    is: 'Borðapöntun',
    en: 'Book a table',
    href: 'https://book.easytable.com/book/?id=89b52',
    external: true,
  },
  /* Was href '#hafa-samband', an id that does not exist on this page
     (audit 2026-09-02). This page has no contact SECTION, so the honest
     target is the phone itself. */
  { is: 'Hafa samband', en: 'Contact', href: 'tel:+3544821390' },
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
/* NOT RENDERED. Kept for the client conversation only. These times were
   read off the live site on 2026-09-02, but they are season-dependent and
   this file's own rule is that they do not ship until the owner confirms
   the current season. They were briefly rendered on 2026-09-02 and pulled
   again the same day: seven precise time claims, one of which (kitchen
   opens 17:00) contradicts the weekend brunch service at 11:30. */
export const HOURS_NOTE_IS =
  'Brunch allar helgar 11:30 til 15:00. Happy Hour 16:00 til 18:00 (11:30 til 18:00 um helgar). ' +
  'Mán. til fim. 16:00 til 21:30, fös. 16:00 til 22:00, lau. 11:30 til 22:00, sun. 11:30 til 21:00. ' +
  'Eldhúsið opnar kl. 17:00 og er lokað 15:00 til 17:00 um helgar.'

export const HOURS_NOTE_EN =
  'Brunch every weekend 11:30 to 15:00. Happy Hour 16:00 to 18:00 (11:30 to 18:00 on weekends). ' +
  'Mon to Thu 16:00 to 21:30, Fri 16:00 to 22:00, Sat 11:30 to 22:00, Sun 11:30 to 21:00. ' +
  'The kitchen opens at 17:00 and is closed 15:00 to 17:00 on weekends.'

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
