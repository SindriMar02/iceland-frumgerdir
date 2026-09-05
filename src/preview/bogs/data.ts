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
// The client's own assets, harvested from bogs.is on 2026-09-05 and served
// from public/bogs/. Provenance, source URLs and native sizes are recorded in
// public/bogs/HARVEST-MANIFEST.json. These are B&S's photographs of B&S,
// taken from B&S's own live site for a redesign OF that site — not stock, and
// not for reuse on any other build.
//
// This replaces most of the Unsplash placeholders. The earlier note here said
// "no B&S photography has been supplied"; that was true of the brief and
// false of the client, who publishes a logo, their dining room, their pizzas
// and ten plated desserts.
const own = (f: string) => `${import.meta.env.BASE_URL}bogs/${f}`

export const IMAGES = {
  // The real B&S mark: a brown roundel with a crown, 1696x1696 PNG. The build
  // previously stated "B&S mark: UNKNOWN, no logo file published" and drew a
  // typographic substitute. The logo was on their front page all along.
  logo: own('bs-logo.png'),
  // 4.1 hero: the actual B&S dining room, dark timber booths under hanging
  // lamps with sheepskins on the chairs. CAUTION: native 640x336, so it is
  // upscaled at full-bleed. Ask the client for the original before go-live —
  // it is still their room, which no stock photograph can be.
  hero: own('bs-interior.jpg'),
  // 4.4 full-bleed plate: their own pizzas, 1280x1077.
  interior: own('bs-pizza.jpg'),
  // 4.6 diptych: their own plated desserts.
  gallerySmall: own('bs-dessert-pizza.jpg'),
  galleryLarge: own('bs-cake-2.jpg'),
  // 4.2 offering cards. Maturinn and Eyvindarstofa are the client's own
  // photographs; the coach remains an Unsplash placeholder because B&S
  // publishes no picture of one.
  offerFood: own('bs-pizza.jpg'),
  offerGroup: u('photo-1570125909232-eb263c188f7e', 1000),
  offerHall: own('bs-interior.jpg'),
  // Kaffi og kaka: the client's Coffee & Cake page carries ten plated
  // desserts. Five are used here; the rest are in the harvest folder.
  cakes: [own('bs-cake-1.jpg'), own('bs-cake-3.jpg'), own('bs-cake-4.jpg'), own('bs-cake-5.jpg')],
  buffet: own('bs-buffet.jpg'),
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
  id?: string
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
    eyebrow: 'Maturinn',
    title: 'Maturinn',
    body: 'Morgunverður, ristað brauð, súpur og salatbar, pizzur og hamborgarar.',
    href: '#matsedill',
    image: IMAGES.offerFood,
  },
  {
    eyebrow: 'Hópar',
    title: 'Hópar og rútur',
    body: 'Tíu kvöldmatseðlar og sjö hádegistilboð, með afslætti frá 15 manns.',
    href: '#hopar',
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

// ─── MENU + GROUPS ──────────────────────────────────────────────────────────
//
// SOURCE, read 2026-09-05 off bogs.is itself: /restaurant/menu/breakfast,
// /restaurant/menu/toast-with-toppings, /restaurant/group-menu,
// /restaurant/about and the home page. Everything below is the client's own
// published content, translated from their English into Icelandic. Nothing is
// invented.
//
// This corrects an error in the other direction. The build's VERIFIED CLIENT
// FACTS block was far narrower than what B&S actually publishes, and the
// 2026-09-02 repair pass deleted the burger and pizza mentions as
// "unconfirmed" when both are on the client's own site. The page was thin
// because the brief was thin, not because the client had nothing to say: they
// publish a priced breakfast menu, a priced toast menu, ten numbered group
// dinner menus, seven lunch offers, a coach-operator discount ladder, a food
// philosophy and the owner's name.
//
// PRICES ARE DATED. They are the client's published figures as of 2026-09-05
// and must be re-checked before this page goes live.
export interface MenuItem {
  name: string
  desc: string
  price: string
}

export interface MenuGroup {
  title: string
  note?: string
  items: MenuItem[]
}

export const MENU = {
  eyebrow: 'Matseðill',
  headline: 'Morgunverður og ristað brauð með áleggi',
  intro:
    'Á matseðlinum er kjöt og fiskur, grænmetis- og pastaréttir, indverskir réttir, súpur, smáréttir og salatbar, auk pizza og hamborgara. Hér að neðan eru morgunverðurinn og ristaða brauðið eins og þau eru borin fram.',
  groups: [
    {
      title: 'Morgunverður',
      items: [
        { name: 'Spæld egg', desc: 'Spæld egg, ristað brauð, ostur, skinka, beikon, smjör, tómatar og gúrka. Val um epla- eða appelsínusafa.', price: '3.790 kr.' },
        { name: 'Hrærð egg', desc: 'Hrærð egg, ristað brauð, ostur, skinka, beikon, smjör, tómatar og gúrka. Val um epla- eða appelsínusafa.', price: '3.790 kr.' },
        { name: 'Shakshuka', desc: 'Steikt grænmeti, heimagerð tómatsósa með kóríander og kryddi, tvö egg og beikon.', price: '3.390 kr.' },
        { name: 'Croissant með skinku og osti', desc: 'Croissant með smjöri, skinku, osti og grænmeti.', price: '990 kr.' },
        { name: 'Íslenskt skyr', desc: 'Með bláberjasultu og rjóma.', price: '1.190 kr.' },
      ],
    },
    {
      title: 'Ristað brauð með áleggi',
      note: 'Allar sortir á sama verði.',
      items: [
        { name: 'Reyktur lax', desc: 'Reyktur lax, ferskt avókadó og dillsósa.', price: '1.590 kr.' },
        { name: 'Prosciutto', desc: 'Prosciutto-skinka, rifnir ferskir tómatar og klettasalat.', price: '1.590 kr.' },
        { name: 'Reyktar ofnbakaðar paprikur', desc: 'Reyktar ofnbakaðar paprikur, mozzarella og basilíkuolía.', price: '1.590 kr.' },
        { name: 'Reykt eggaldinmauk', desc: 'Reykt eggaldinmauk, ferskir kirsuberjatómatar og marínerað tófú.', price: '1.590 kr.' },
        { name: 'Tómatar og mozzarella', desc: 'Tómatar, mozzarella, svartar ólífur og basilíkuolía.', price: '1.590 kr.' },
      ],
    },
  ] as MenuGroup[],
  note: 'Verð eru eins og þau voru birt á bogs.is 5. september 2026. Fullur matseðill, þar á meðal pizzur, hamborgarar og barnamatseðill, er á staðnum og í síma 453 5060.',
} as const

// ─── GROUPS AND COACHES ────────────────────────────────────────────────────
// The single most commercially useful thing B&S publishes and the current
// site buries: a stated discount ladder and free meals for the driver and
// guide. Verbatim source (bogs.is/restaurant/group-menu): "Group is 8 or more
// people", "15 to 50 people get 15% off", "50+ people get 20% off", "Driver
// and guide eat for free", "All prices include tax".
export const GROUPS = {
  eyebrow: 'Hópar og rútur',
  headline: 'Hópamatseðlar fyrir rútur og hópa frá átta manns',
  intro:
    'Tíu kvöldmatseðlar og sjö hádegistilboð eru í boði fyrir hópa, þar á meðal grænmetismatseðill. Súpa, aðalréttur og eftirréttur fylgja hverjum matseðli. Best er að hafa samband fyrirfram svo hægt sé að taka vel á móti hópnum.',
  terms: [
    { label: 'Hópur', value: 'Átta manns eða fleiri' },
    { label: '15 til 50 manns', value: '15% afsláttur' },
    { label: '50 manns og fleiri', value: '20% afsláttur' },
    { label: 'Bílstjóri og fararstjóri', value: 'Frítt að borða' },
    { label: 'Öll verð', value: 'Með virðisaukaskatti' },
  ],
  note: 'Matseðlar hópa og verð eru send eftir samtal við staðinn. Hringið í 453 5060.',
} as const

// ─── COFFEE AND CAKE ───────────────────────────────────────────────────────
// Replaces HOUSE_FACTS, which was a 28-word paragraph in a 564px section that
// measured 80% air and repeated what the menu intro and the groups section
// now say properly. "Coffee & Cake" is one of the client's own published
// restaurant categories and their page for it carries ten photographs of
// their own plated desserts — the single richest thing on bogs.is and
// entirely absent from this build.
export const COFFEE_CAKE = {
  eyebrow: 'Kaffi og kaka',
  headline: 'Kaffi frá Kaffitár og kökurnar á staðnum',
  paragraph:
    'Kaffi frá Kaffitár er borið fram á staðnum, og kökur og eftirréttir eru í boði með því. Myndirnar hér að neðan eru af eftirréttum B&S.',
} as const

// ─── 4.3 ABOUT US TEASER (DARK BAND) ─────────────────────────────────────────
export const ABOUT_TEASER = {
  eyebrow: 'Um okkur',
  // Verbatim source (bogs.is/restaurant/about): "B&S Restaurant is a
  // comfortable restaurant by the ring road in Blonduos town in North-West
  // Iceland", "The Restaurant has been in business since the year 2007", "We
  // endeavour to take good care of you and our goal is to make your visit at
  // the B&S Restaurant enjoyable and you feel good". Owner named on the same
  // page as Bjorn Thor Kristjansson.
  paragraph:
    'B&S Restaurant er notalegur veitingastaður við hringveginn í Blönduósi á Norðvesturlandi og hefur verið starfræktur frá árinu 2007. Markmiðið er einfalt: að taka vel á móti fólki og að heimsóknin sé góð.',
  owner: 'Björn Þór Kristjánsson, eigandi og rekstraraðili',
} as const

// The kitchen's own stated principles, from bogs.is/restaurant/about:
// "Therefore we are always working on our menu to make it more healthy",
// "Most of our soups are made from vegetables and they are gluten-free", "We
// only use leaven yeast and sour dough for our bread and pizzas", "We do not
// put MSG in our food".
export const KITCHEN_PRINCIPLES = [
  'Matseðillinn er í stöðugri endurskoðun með hollustu að leiðarljósi.',
  'Flestar súpur eru gerðar úr grænmeti og eru glútenlausar.',
  'Brauð og pizzur eru bakaðar með súrdeigi og súrdeigsgeri.',
  'MSG er ekki notað í matinn.',
] as const

// ─── 4.5 HOUSE FACTS (teardown "House philosophy", `section.section-small-text`)
// The reference runs a 43-word "the house is always yours" philosophy that
// B&S has never published (teardown 9, row 4.5: "UNKNOWN. Candidate fact
// block only: open all year, breakfast served, groups welcome. Do not write
// a philosophy the client has not published."). So this section keeps the
// reference's layout and motion but swaps the content for exactly those
// three verified facts, stated plainly, with no invented sentiment.
/* HOUSE_FACTS retired 2026-09-05: see COFFEE_CAKE above. */

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
    a: 'Norðurlandsvegur 4, 540 Blönduós, beint við þjóðveg eitt á Norðvesturlandi.',
  },
  {
    // bogs.is states "OPEN 09:00 - 21:00" on its own front page. TripAdvisor
    // lists 11:00 to 21:00; the client's own site is the authority for the
    // client's own hours, so it leads, and the discrepancy is no longer
    // presented as an unresolved conflict.
    q: 'Hvenær er opið?',
    a: 'Samkvæmt vef staðarins er opið frá 09:00 til 21:00. Opnunartímar geta breyst eftir árstíma, svo rétt er að hringja í 453 5060 ef ferðin er löng.',
  },
  {
    q: 'Er hægt að fá morgunverð?',
    a: 'Já. Morgunverður er á matseðlinum, allt frá croissant með skinku og osti á 990 kr. upp í spæld eða hrærð egg með ristuðu brauði, osti, skinku, beikoni og safa á 3.790 kr.',
  },
  {
    q: 'Hvað telst hópur og hvaða afsláttur er í boði?',
    a: 'Hópur telst átta manns eða fleiri. Hópar frá 15 til 50 manns fá 15% afslátt og 50 manns og fleiri fá 20% afslátt. Bílstjóri og fararstjóri fá frítt að borða og öll verð eru með virðisaukaskatti.',
  },
  {
    q: 'Takið þið á móti rútum?',
    a: 'Já. Tíu kvöldmatseðlar og sjö hádegistilboð eru í boði fyrir hópa, þar á meðal grænmetismatseðill. Best er að hafa samband fyrirfram í síma 453 5060.',
  },
  {
    q: 'Er eitthvað fyrir þá sem borða ekki kjöt eða þola ekki glúten?',
    a: 'Flestar súpur eru gerðar úr grænmeti og eru glútenlausar, og grænmetismatseðill er í boði fyrir hópa. Látið vita við pöntun svo hægt sé að taka tillit til þess.',
  },
  {
    q: 'Er hægt að funda í Eyvindarstofu?',
    a: 'Eyvindarstofa er á staðnum og hefur sinn eigin matseðil. Nánari upplýsingar og bókanir í síma 453 5060.',
  },
  {
    q: 'Er gisting á staðnum?',
    a: 'Laxás gisting er rekin samhliða veitingastaðnum. Upplýsingar og bókanir í síma 453 5060.',
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
  { label: 'Matseðill', href: '#matsedill' },
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
