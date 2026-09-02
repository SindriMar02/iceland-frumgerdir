/**
 * B&S Restaurant, Blönduós — content for the HOME page transplant of
 * studenterkilden.dk (sections 4.1 through 4.8 of the master teardown).
 *
 * Every fact below comes from this task's own VERIFIED CLIENT FACTS block.
 * The master teardown's section 9 (a later, independent bogs.is scrape)
 * is NOT itself a source of client facts for this build — on repair
 * (2026-09-02) the copy that had borrowed from it (Kaffitár-branded burgers
 * and pizza, Eyvindarstofa's theme and equipment) was rolled back to only
 * what VERIFIED CLIENT FACTS states, per this task's own hard rule 2.
 * Anything the client has not published is a clearly marked PLACEHOLDER,
 * never presented as a real B&S fact. No dish names, prices, team names or
 * founding story beyond "since 2007" may be invented.
 */

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

// 4.8 footer wordmark (teardown 4.8: img/svg/…Studenterkilden-Wordmark.svg,
// viewBox 1465x164, hardcoded fill, the full company word as an <img>).
// B&S has no logo file (VERIFIED CLIENT FACTS: "No logo file... published,
// mark ALL of these UNKNOWN and do not invent them") — this is a plain
// text-as-SVG stand-in at the same viewBox and fill colour, PLACEHOLDER only,
// replace with the real B&S mark once supplied. Font is Georgia/serif (the
// Gambetta fallback), not Gambetta itself, since a data-URI <img> cannot load
// the self-hosted @font-face.
const FOOTER_WORDMARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1465 164"><text x="0" y="128" font-family="Georgia, serif" font-size="132" fill="#161513">B&amp;S Restaurant</text></svg>'

// PLACEHOLDER: no B&S photography has been supplied yet (teardown 9, "asset
// UNKNOWN" on every image slot). These are contextually plausible stand-ins
// for a ring-road diner/café in rural North Iceland — replace with real B&S
// photography before sending. Aspect ratios match the reference's slots
// (teardown 4.1 hero 120vh, 4.4/4.11 plates 110vh 1.333/1.455, 4.6 diptych
// 1:1 + 4:5).
export const IMAGES = {
  // 4.1 hero asset: ring-road / countryside diner exterior
  hero: u('photo-1517248135467-4c7edcad34c4', 2000),
  // 4.4 full-bleed plate: dining room / café interior
  interior: u('photo-1414235077428-338989a2e8c0', 1800),
  // 4.6 gallery small (1:1): a food close-up. Ristað brauð með áleggi (toast
  // with toppings) is a confirmed bogs.is nav category; the pizza claim this
  // slot's alt text used before the repair pass was dropped along with the
  // copy fix above (fix 5) — an image implying pizza would reintroduce the
  // same unconfirmed claim visually.
  gallerySmall: u('photo-1484723091739-30a097e8f929', 1000),
  // 4.6 gallery large (4:5): the building / ring-road setting
  galleryLarge: u('photo-1476610182048-b716b8518aae', 1200),
  // 4.6 gallery accents (repair pass, image-density fix): two slots in the
  // otherwise-empty four columns between the diptych's small and large
  // images, closing the transplant-gate gap on <img> count (verifier found
  // 8, band is 11-19, target 15). A coffee-and-cake close-up (Kaffitár is a
  // confirmed bogs.is nav category) and a second breakfast-table close-up.
  // PLACEHOLDER stand-ins, replace before sending.
  galleryAccent: u('photo-1495474472287-4d71bcdd2085', 900),
  galleryAccent2: u('photo-1504674900247-0877df9cc836', 900),
  // 4.2 offering cards (4:5 crop): Maturinn (food), Hópar og rútur (coach
  // travel), Eyvindarstofa (meeting hall). PLACEHOLDER: no B&S photography
  // supplied for any of the three, replace before sending.
  offerFood: u('photo-1533089860892-a7c6f0a88666', 1000),
  offerGroup: u('photo-1570125909232-eb263c188f7e', 1000),
  offerHall: u('photo-1517502884422-41eaead166d4', 1000),
  // 4.5 house facts photos (repair pass, image-density fix): the section
  // originally ran text-only, which was part of why the page's <img> count
  // (8) landed below the transplant-gate band (11-19, target 15). Two
  // exterior/ring-road frames alongside the paragraph close that gap without
  // inventing content. PLACEHOLDER stand-ins, replace before sending.
  factsPhoto: u('photo-1476514525535-07fb3b4ae5f1', 1200),
  factsPhoto2: u('photo-1466978913421-dad2ebd01d17', 1200),
  // 4.8 footer wordmark <img>, see FOOTER_WORDMARK_SVG above.
  footerWordmark: `data:image/svg+xml;utf8,${encodeURIComponent(FOOTER_WORDMARK_SVG)}`,
  // 4.8 footer overlay texture (teardown 4.8: img.footer__overlay-texture,
  // opacity .09, mix-blend-mode multiply, "leaf shadows on plaster", 1512x982,
  // z-index 20, pointer-events none, absolutely positioned over the footer).
  // PLACEHOLDER: a contextually plausible plaster/wall texture, not a B&S
  // asset, replace before sending.
  footerTexture: u('photo-1618221639240-d2f4fb695ac1', 1600),
} as const

// ─── 4.1 HOME HERO ───────────────────────────────────────────────────────────
export const HERO = {
  eyebrow: 'Síðan 2007',
  // Headline built only from verified facts: family restaurant and café,
  // Norðurlandsvegur 4, Blönduós, on the ring road, open all year.
  headline: 'Fjölskyldu­veitingastaður við þjóðveg eitt í Blönduósi',
  // RESOLVED on repair (was "FLAG FOR ORCHESTRATOR"): the master teardown's
  // section 9 scrape claimed a pizza offer and "100% Icelandic" burgers from
  // a later, dated (2026-09-02) read of bogs.is. This task's own hard rule 2
  // is explicit — "Never invent a fact about B&S Restaurant not in the
  // VERIFIED CLIENT FACTS above" — and that block does not list burgers or
  // pizza anywhere (it lists only Menu, Breakfast, Toast with toppings,
  // Coffee & Cake/Kaffitár, and Group Menu as confirmed bogs.is nav
  // categories, plus Kaffitár separately from the building signage). Rule 2
  // governs this build regardless of what a later teardown scrape adds, so
  // the pizza/burger claims are dropped rather than shipped unconfirmed.
  // This line now states only the confirmed nav categories plus signage
  // Kaffitár and the "opið alla daga" framing rule 2 also requires.
  paragraph:
    'Morgunverður, ristað brauð með áleggi og Kaffitár á Norðurlandsvegi 4 — opið alla daga.',
  ctaPrimary: { label: 'Hringja 453 5060', href: 'tel:+3544535060' },
  ctaSecondary: { label: 'Sjá matseðil', href: '#offering' },
} as const

// ─── 4.2 OUR OFFERING (3 CARDS) ──────────────────────────────────────────────
export interface OfferCard {
  eyebrow: string
  title: string
  body: string
  href: string
  image: string
}

export const OFFER_CARDS: OfferCard[] = [
  {
    // RESOLVED on repair (was "FLAG FOR ORCHESTRATOR"): same call as
    // HERO.paragraph above. Kaffitár stays (confirmed via the building
    // signage in VERIFIED CLIENT FACTS); the burger and pizza claims from
    // teardown section 9 are dropped, since that section is not itself a
    // VERIFIED CLIENT FACT and rule 2 forbids stating a client fact this
    // task's own facts block does not carry.
    eyebrow: 'Matseðill',
    title: 'Maturinn',
    body: 'Morgunverður, ristað brauð með áleggi, og kaffi og kaka frá Kaffitár.',
    href: '#offering',
    image: IMAGES.offerFood,
  },
  {
    eyebrow: 'Hópar',
    title: 'Hópar og rútur',
    body: 'Hópamatseðlar fyrir rútuhópa á leið um Norðurland. Fjöldi, innihald og verð: samkvæmt samkomulagi, hafið samband fyrirfram.',
    href: '#offering',
    image: IMAGES.offerGroup,
  },
  {
    // RESOLVED on repair (was "FLAG FOR ORCHESTRATOR"): teardown section 9's
    // direct read of bogs.is/eyvindarstofa named a Fjalla-Eyvindur og Halla
    // theme plus wifi and projectors. VERIFIED CLIENT FACTS instructs the
    // opposite for this room — "describe generically as a private dining or
    // group space" — and rule 2 makes that block, not a later teardown
    // scrape, the authority for this build. Rolled back to the brief's own
    // generic description; the room name "Eyvindarstofa" itself is a
    // confirmed bogs.is nav item, so it stays.
    eyebrow: 'Hópa- og fundarrými',
    title: 'Eyvindarstofa',
    body: 'Sérstakt rými fyrir hópa og fundi, aðskilið frá aðalsalnum. Nánari upplýsingar og bókanir í síma 453 5060.',
    href: '#offering',
    image: IMAGES.offerHall,
  },
]

// ─── 4.3 ABOUT US TEASER (DARK BAND) ─────────────────────────────────────────
export const ABOUT_TEASER = {
  eyebrow: 'Um okkur',
  // PLACEHOLDER: the reference runs 61 words of inn history (teardown 4.3);
  // B&S has published only the founding year and location, so this stays
  // short and states only those two facts plus the ring-road setting.
  paragraph:
    'B&S Restaurant hefur verið fjölskylduveitingastaður og kaffihús á Norðurlandsvegi 4 í Blönduósi síðan 2007, opið alla daga árið um kring, beint við þjóðveg eitt.',
  cta: { label: 'Um B&S', href: '#about' },
} as const

// ─── 4.5 HOUSE FACTS (teardown "House philosophy", `section.section-small-text`)
// The reference runs a 43-word "the house is always yours" philosophy that
// B&S has never published (teardown 9, row 4.5: "UNKNOWN. Candidate fact
// block only: open all year, breakfast served, groups welcome. Do not write
// a philosophy the client has not published."). So this section keeps the
// reference's layout and motion but swaps the content for exactly those
// three verified facts, stated plainly, with no invented sentiment.
export const HOUSE_FACTS = {
  paragraph:
    'Opið er alla daga, allt árið um kring, hvort sem komið er við á leið um þjóðveg eitt eða keyrt sérstaklega. Morgunverður er á matseðlinum frá morgni, og hópar og rútur eru boðnir sérstaklega velkomnir, með eigin hópamatseðlum fyrir ferðahópa á Norðurlandi.',
} as const

// ─── 4.7 FAQ (13 questions in the reference; we answer only what is known) ───
export interface FaqItem {
  q: string
  a: string
}

// PLACEHOLDER count: the reference has 13 questions (teardown 4.7). Only the
// questions answerable from published facts are included below; adding more
// to reach 13 would mean inventing answers, which the brief forbids.
export const FAQ: FaqItem[] = [
  {
    q: 'Hvar er B&S Restaurant?',
    a: 'Norðurlandsvegur 4, 540 Blönduós — beint við þjóðveg eitt.',
  },
  {
    q: 'Hvenær er opið?',
    a: 'Opið alla daga. B&S auglýsir sjálft 09:00 til 21:00, en TripAdvisor skráir 11:00 til 21:00 — við höfum ekki fengið þetta staðfest og birtum bæði svo þið getið hringt og fengið úr því skorið fyrirfram.',
  },
  {
    q: 'Er opið allt árið?',
    a: 'Já, B&S er opið allt árið.',
  },
  {
    q: 'Er hægt að fá morgunverð?',
    a: 'Já, morgunverður er á matseðlinum. Tímasetning: hafið samband til að staðfesta.',
  },
  {
    q: 'Takið þið á móti rútuhópum?',
    a: 'Já, B&S er með hópamatseðla fyrir rútuhópa. Fjöldi, innihald og verð eru afgreidd í samtali fyrirfram.',
  },
  {
    // RESOLVED on repair (was "FLAG FOR ORCHESTRATOR"): same call as
    // OFFER_CARDS[2] above — the wifi/projector specifics came from teardown
    // section 9, not this task's VERIFIED CLIENT FACTS block, which only
    // authorizes a generic description. Rolled back accordingly.
    q: 'Er hægt að funda í Eyvindarstofu?',
    a: 'Já, Eyvindarstofa er sérstakt rými fyrir hópa og fundi. Hafið samband til að fá nánari upplýsingar og bóka.',
  },
  {
    q: 'Hvernig næ ég sambandi við ykkur?',
    a: 'Sími 453 5060, netfang info@bogs.is.',
  },
]

// ─── 4.8 FOOTER ──────────────────────────────────────────────────────────────
export const CONTACT = {
  addressLine1: 'Norðurlandsvegur 4',
  addressLine2: '540 Blönduós',
  phoneDisplay: 'Sími 453 5060',
  phoneHref: 'tel:+3544535060',
  email: 'info@bogs.is',
} as const

// PLACEHOLDER: opening hours are disputed between bogs.is (09:00-21:00) and
// TripAdvisor (11:00-21:00); this states the conflict rather than picking one.
export const HOURS_LINE =
  'Opið alla daga (B&S auglýsir 09:00-21:00, TripAdvisor skráir 11:00-21:00 — tímar óstaðfestir).'

export const SITEMAP = [
  { label: 'Heim', href: '/preview/bogs' },
  { label: 'Maturinn', href: '#offering' },
  { label: 'Hópar og rútur', href: '#offering' },
  { label: 'Eyvindarstofa', href: '#offering' },
  { label: 'Um B&S', href: '#about' },
  { label: 'Hafa samband', href: 'mailto:info@bogs.is' },
] as const

// Reference footer's "Smiley Rapport" outbound trust link (teardown 4.8)
// re-aims to the one real trust signal B&S has: TripAdvisor (260 reviews,
// teardown section 9). A link, not an embedded widget or quoted review.
export const TRIPADVISOR_LINK = {
  label: '260 umsagnir á TripAdvisor',
  // PLACEHOLDER: exact TripAdvisor listing URL not yet located, needs the
  // real permalink before send.
  href: 'https://www.tripadvisor.com/',
} as const
