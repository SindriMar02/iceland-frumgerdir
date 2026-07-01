/**
 * GK Bakarí — landing-page data.
 *
 * Same design system as Faxi Bakery Café (volcanic-black / moss-green / cream
 * palette, Bricolage Grotesque + Caveat + Hanken Grotesk) — reused here with
 * GK Bakarí's own real facts, since the Faxi build has gone unanswered.
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - Verified via direct fetch/search (ja.is, 1819.is, Wolt, Tripadvisor, RestaurantGuru,
 *     veitingageirinn.is, sunnlenska.is): founders Guðmundur Helgi Harðarson (ex Brauð & Co)
 *     and Kjartan Ásbjörnsson (ex IKEA bakery), opened Jan 2020 in Kjartan's hometown of
 *     Selfoss; address Austurvegur 31b, 800 Selfoss; phone 482 1007; email gkbakari@simnet.is
 *     (ja.is + 1819.is agree; supersedes an earlier gmail address found in a scouting pass
 *     but never confirmed on a live source); RestaurantGuru 4.7/5 (438 reviews); no independent
 *     website — only Facebook/Instagram/Wolt/aggregators.
 *   - REAL Wolt menu items + prices: Ostaslaufa 520 kr, Kleinuhringur (karamellu) 500 kr,
 *     Kanilsnúður 680 kr, Eplasafi/Heilsusafi 390 kr each.
 *   - Rúgbrauð and Berlínarbolla are REAL items (named in Tripadvisor/RestaurantGuru reviews)
 *     but their prices are ILLUSTRATIVE ESTIMATES (no confirmed source) — confirm before
 *     publishing. Same for Smurt (an actual Wolt menu CATEGORY, "Great bread, buns and
 *     sandwiches" per a real review) — item exists, price is an estimate.
 *   - Opening hours: sources disagree slightly (Wolt shows fragmented delivery windows,
 *     Tripadvisor shows standard shop hours) — using the Tripadvisor version as the more
 *     plausible in-store hours; confirm before publishing.
 *   - HERO photo is the Higgsfield-generated cinnamon-roll plate from the Faxi Bakery
 *     prototype (its background is baked to flat #F1E4CE cream, so it sits seamlessly on
 *     this page's identical cream). INDICATIVE imagery, not GK's own product photo.
 *   - LOGO is GK Bakarí's real mark (gold hand-drawn cinnamon roll + GK monogram +
 *     BAKARÍ), sourced from their public Wolt venue listing (imageproxy.wolt.com asset),
 *     fabric-shadow background crushed to uniform black to sit as a circular badge.
 *   - Other photography is INDICATIVE Unsplash stock, vetted via contact-sheet montage.
 *     Two menu items (Rúgbrauð, Berlínarbolla) have no honest matching stock photo and
 *     go photo-light (typographic card) rather than mislabel.
 */

const u = (id: string, w = 1100) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const LOGO = `${import.meta.env.BASE_URL}gkbakari/brand/logo.jpg`

export const IMAGES = {
  hero: `${import.meta.env.BASE_URL}gkbakari/hero.jpg`, // Higgsfield cinnamon roll on flat cream (shared with the Faxi prototype)
  // Story
  hands: u('photo-1652283321082-72bb2b601abd', 1200), // hands shaping a ball of dough, floured counter
  counter: u('photo-1771498326035-c148ca1511de', 1200), // wood-framed glass bakery case, handwritten labels
  // Visit
  visit: u('photo-1649308401368-a68b77116605', 1200), // top-down tray of fresh cinnamon rolls, flat-lay
} as const

/** Warm gradient fallbacks so a dead URL never breaks the layout — also used
 *  deliberately (no `img`) for the two menu items with no honest photo. */
export const FALLBACK = {
  cream: 'bg-gradient-to-br from-[#F1E4CE] to-[#E6D2B8]',
  card: 'bg-gradient-to-br from-[#E5D5BA] to-[#d6c4a0]',
  moss: 'bg-gradient-to-br from-[#5b6a4e] to-[#3c4733]',
  ink: 'bg-gradient-to-br from-[#2a241d] to-[#1B1712]',
} as const

export interface MenuItem {
  slotId: string
  name: string
  price: string
  tag?: string
  desc: string
  shot: string
  /** image URL — omitted (undefined) means a deliberate photo-light card */
  img?: string
  fallback: string
}

export const MENU: MenuItem[] = [
  {
    slotId: 'menu-kanilsnudur',
    name: 'Kanilsnúður',
    price: '680 kr.',
    tag: 'Aðalsmerkið',
    desc: 'Sá sem við erum þekktir fyrir — mjúkur, almennilega klístraður og aldrei langt frá ofninum.',
    shot: 'Nýbakaðir kanilsnúðar með glassúr, þétt saman á bakka',
    img: u('photo-1694632288834-17d86b340745', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-rugbraud',
    name: 'Rúgbrauð',
    price: '1.290 kr.',
    tag: 'Í uppáhaldi',
    desc: 'Þétt, dökkt og hægbakað. Einn gestur kallaði það besta rúgbrauð sem hann hefði nokkurn tímann fengið.',
    shot: 'No honest matching photo found — deliberate photo-light card',
    fallback: FALLBACK.ink,
  },
  {
    slotId: 'menu-ostaslaufa',
    name: 'Ostaslaufa',
    price: '520 kr.',
    desc: 'Flögótt og smjörkennd, ostur í hverju lagi — best á meðan kaffið er heitt.',
    shot: 'Gyllt smjördeigsbakkelsi á smjörpappír, flögótt lög',
    img: u('photo-1756137943371-f67c60f132e9', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-kleinuhringur',
    name: 'Kleinuhringur með karamellu',
    price: '500 kr.',
    desc: 'Klassískur kleinuhringur með þykkri karamelluhúð.',
    shot: 'Kleinuhringir með karamellugljáa, séð ofan frá',
    img: u('photo-1685779923216-5b386a173447', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-berlinarbolla',
    name: 'Berlínarbolla',
    price: '550 kr.',
    desc: 'Fyllt með sultu og sykurstráð — „eins og einhvers konar ský“, sagði einn gestur.',
    shot: 'No honest matching photo found — deliberate photo-light card',
    fallback: FALLBACK.moss,
  },
  {
    slotId: 'menu-smurt',
    name: 'Smurt brauð',
    price: '1.590 kr.',
    tag: 'Hádegi',
    desc: 'Vel útilátið á okkar eigin nýbakaða brauði, smurt við borðið allan morguninn.',
    shot: 'Smurbrauð með skinku, salati og rauðlauk á viðarbretti',
    img: u('photo-1618569629551-ac5b990b1ef6', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-safar',
    name: 'Ferskir safar',
    price: '390 kr.',
    desc: 'Eplasafi eða heilsusafi, ískaldur úr kælinum.',
    shot: 'Glas af ferskum safa með ávöxtum',
    img: u('photo-1613478223719-2ab802602423', 900),
    fallback: FALLBACK.card,
  },
]

export const STATS = [
  { value: '4,7★', caption: 'meðaleinkunn úr 438 umsögnum' },
  { value: '2020', caption: 'árið sem við opnuðum dyrnar' },
  { value: '1', caption: 'súpupottur á hellunni, alla daga' },
  { value: '2', caption: 'sunnlenskir framleiðendur í búrinu' },
] as const

/** Weekly hours, minutes-from-midnight, UTC (Iceland has no DST — UTC = local). */
export const HOURS_BY_DAY = [
  { open: 8 * 60, close: 14 * 60 }, // Sun
  { open: 7 * 60, close: 16 * 60 }, // Mon
  { open: 7 * 60, close: 16 * 60 }, // Tue
  { open: 7 * 60, close: 16 * 60 }, // Wed
  { open: 7 * 60, close: 16 * 60 }, // Thu
  { open: 7 * 60, close: 16 * 60 }, // Fri
  { open: 8 * 60, close: 16 * 60 }, // Sat
] as const

export const VISIT = {
  where: 'Austurvegur 31b\n800 Selfoss',
  hoursLines: ['Mán–fös: 7 — 16', 'Lau: 8 — 16 · Sun: 8 — 14'],
  call: '482 1007',
  callHref: '+3544821007',
  email: 'gkbakari@simnet.is',
  facebook: 'https://www.facebook.com/gkbakari',
  facebookHandle: '@gkbakari',
  wolt: 'https://wolt.com/is/isl/selfossonly/venue/gk-bakari',
} as const
