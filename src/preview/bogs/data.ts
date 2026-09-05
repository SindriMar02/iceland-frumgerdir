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
  /* PLACEHOLDER, ALL OF THEM. No B&S photography has been supplied, so every
     frame below is Unsplash stock and every alt says "sýnishorn". The set was
     re-picked on 2026-09-05 for CATEGORY TRUTH after the first pass shipped a
     dark metropolitan fusion restaurant as the hero, a corporate glass
     boardroom as Eyvindarstofa, an alpine rowboat in the facts band and
     Seljalandsfoss as "the building": stock that actively misdescribed a
     roadside family restaurant in Blönduós. These stand-ins claim nothing
     B&S is not — a warm unpretentious dining room, breakfast, an open
     sandwich, a coach, a laid table, coffee, farmland by the road — but they
     are still not B&S, and they must be replaced with the client's own
     photography before this page is sent. */
  // 4.1 hero asset: warm, plain dining room, the register B&S actually is
  hero: u('photo-1670819917685-f1040e76b9b7', 2000),
  // 4.4 full-bleed plate: breakfast, the one offering B&S publishes by name
  interior: u('photo-1533089860892-a7c6f0a88666', 1800),
  // 4.6 gallery small (1:1): coffee. Kaffitár is a confirmed bogs.is category.
  gallerySmall: u('photo-1495474472287-4d71bcdd2085', 1000),
  // 4.6 gallery large (4:5): the setting. Deliberately quiet and not a
  // landmark — a waterfall 300km away implied a place B&S is not, and the
  // farmland frame that briefly replaced it cropped at 4:5 to a saturated
  // close-up of a grazing cow, and the conifer forest after that reads
  // Pacific Northwest on a page about treeless coastal North Iceland.
  // Bare misty ridges: muted, no landmark, no trees, no false claim.
  galleryLarge: u('photo-1483354483454-4cd359948304', 1200),
  // 4.2 offering cards (4:5 crop): ristað brauð með áleggi (a confirmed
  // category, shown as the open sandwich it is), a coach, and a laid table
  // for the group/private room the brief says to describe generically.
  offerFood: u('photo-1618569629551-ac5b990b1ef6', 1000),
  offerGroup: u('photo-1570125909232-eb263c188f7e', 1000),
  offerHall: u('photo-1743793055911-52e19beba5d8', 1000),
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
    'Morgunverður, ristað brauð með áleggi og kaffi frá Kaffitár, á Norðurlandsvegi 4 við þjóðveg eitt.',
  ctaPrimary: { label: 'Hringja 453 5060', href: 'tel:+3544535060' },
  ctaSecondary: { label: 'Sjá matseðil', href: '#matsedill' },
} as const

// ─── 4.2 OUR OFFERING (3 CARDS) ──────────────────────────────────────────────
export interface OfferCard {
  id: string
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
    id: 'maturinn',
    eyebrow: 'Maturinn',
    title: 'Maturinn',
    body: 'Morgunverður og kaffi frá Kaffitár.',
    href: '#matsedill',
    image: IMAGES.offerFood,
  },
  {
    id: 'hopar',
    eyebrow: 'Hópar',
    title: 'Hópar og rútur',
    body: 'Hópamatseðill er í boði fyrir hópa og rútur.',
    href: '#matsedill',
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
    id: 'eyvindarstofa',
    eyebrow: 'Hópa- og fundarrými',
    title: 'Eyvindarstofa',
    body: 'Eyvindarstofa er á staðnum. Nánari upplýsingar og bókanir í síma 453 5060.',
    href: 'tel:+3544535060',
    image: IMAGES.offerHall,
  },
]

// ─── MENU (teardown re-aim map, row "4.1 Home hero": the hero's secondary
// CTA is specified as "Sjá matseðil" -> `#matur`, a section the first build
// never made, so that CTA had nowhere to go) ──────────────────────────────
//
// STRUCTURE is the reference's own `section.section-packages.u-grid`
// (teardown 4.19/4.26): a vertical repeating list, rows separated by a 2px
// `.divider-line` in #16151333, "not a table, not a pricing grid". The
// reference's rows carry a 4:5 parallax image each; these do not, because a
// menu is a typographic object and because three more stock plates would be
// the same image-count padding that had to be stripped out of the facts band
// and the diptych.
//
// CONTENT is the hard part and the reason this section did not exist. B&S
// publishes no itemised menu and no prices anywhere — not on bogs.is, not on
// TripAdvisor. Every line below is a category the client has actually
// published (the bogs.is nav categories plus the Kaffitár signage), worded
// from the same VERIFIED CLIENT FACTS block the offering cards and the FAQ
// answers already draw on. No dish, no price and no opening time is invented
// to fill the section out. The closing line directs to the phone rather than
// claiming what the prices are.
export interface MenuRow {
  title: string
  body: string
}

export const MENU = {
  eyebrow: 'Matseðill',
  headline: 'Morgunverður, brauð og kaffi frá Kaffitár',
  rows: [
    {
      title: 'Morgunverður',
      body: 'Morgunverður er á matseðlinum. Hafið samband til að staðfesta hvenær hann er borinn fram.',
    },
    {
      title: 'Ristað brauð með áleggi',
      body: 'Ristað brauð með áleggi og meðlæti.',
    },
    {
      title: 'Kaffi frá Kaffitár',
      body: 'Kaffi frá Kaffitár er borið fram á staðnum.',
    },
    {
      title: 'Hópamatseðill',
      body: 'Hópamatseðill er í boði fyrir hópa og rútur. Fjöldi, innihald og verð fara eftir samkomulagi, svo best er að hafa samband fyrirfram.',
    },
  ] as MenuRow[],
  // Not a claim about what the prices are, a direction to the people who know.
  note: 'Nánari upplýsingar um matseðil og verð eru veittar í síma 453 5060.',
} as const

// ─── 4.3 ABOUT US TEASER (DARK BAND) ─────────────────────────────────────────
export const ABOUT_TEASER = {
  eyebrow: 'Um okkur',
  // PLACEHOLDER: the reference runs 61 words of inn history (teardown 4.3);
  // B&S has published only the founding year and location, so this stays
  // short and states only those two facts plus the ring-road setting.
  paragraph:
    'B&S Restaurant hefur verið fjölskylduveitingastaður og kaffihús á Norðurlandsvegi 4 í Blönduósi síðan 2007, beint við þjóðveg eitt.',
  // The band's CTA was removed 2026-09-05: it pointed at #about from inside
  // the section whose id is #about. There is no About page to send anyone to,
  // and the sitemap's own "Um B&S" entry already anchors here.
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
    'Staðurinn stendur við þjóðveg eitt í Blönduósi, hvort sem komið er við á leiðinni eða keyrt sérstaklega. Morgunverður er á matseðlinum, og hópamatseðill er í boði fyrir hópa.',
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
    a: 'Norðurlandsvegur 4, 540 Blönduós, beint við þjóðveg eitt.',
  },
  {
    q: 'Hvenær er opið?',
    a: 'Opnunartímar eru staðfestir í síma 453 5060. Á vef staðarins stendur 09:00 til 21:00 og á TripAdvisor 11:00 til 21:00, svo rétt er að hringja á undan sér.',
  },
  {
    q: 'Er hægt að fá morgunverð?',
    a: 'Já, morgunverður er á matseðlinum. Hafið samband til að staðfesta hvenær hann er borinn fram.',
  },
  {
    q: 'Takið þið á móti hópum?',
    a: 'Já, hópamatseðill er í boði. Fjöldi, innihald og verð fara eftir samkomulagi, svo best er að hafa samband fyrirfram.',
  },
  {
    // RESOLVED on repair (was "FLAG FOR ORCHESTRATOR"): same call as
    // OFFER_CARDS[2] above — the wifi/projector specifics came from teardown
    // section 9, not this task's VERIFIED CLIENT FACTS block, which only
    // authorizes a generic description. Rolled back accordingly.
    q: 'Er hægt að funda í Eyvindarstofu?',
    a: 'Eyvindarstofa er á staðnum. Hafið samband í síma 453 5060 til að fá nánari upplýsingar.',
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
  'Opnunartímar óstaðfestir: B&S auglýsir 09:00 til 21:00, TripAdvisor skráir 11:00 til 21:00.'

export const SITEMAP = [
  { label: 'Heim', href: '/preview/bogs' },
  { label: 'Maturinn', href: '#maturinn' },
  { label: 'Hópar og rútur', href: '#hopar' },
  { label: 'Eyvindarstofa', href: '#eyvindarstofa' },
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
  href: 'https://www.tripadvisor.com/Search?q=B%26S%20Restaurant%20Bl%C3%B6ndu%C3%B3s',
} as const
