
/**
 * SAMBÓ / KÓLUS EHF. — sambo.is (kt. 630872-0149), Tunguháls 5, 110 Reykjavík
 *
 * Every fact about a product below is Kólus' own: the product titles and descriptions on
 * sambo.eu.com (Wix store, read 2026-10-02), the allergens printed in bold on their own
 * ingredient label images, and the Easter fundraising text of their own PDF. Their shop
 * lists no prices and no pack sizes (every Wix price reads 0), so this prototype has none.
 * Where a product has no label image on their site the allergen field is null and the
 * page says so: nothing is guessed (an allergen filter that guessed would be dangerous).
 * Icelandic and English descriptions are their words where they wrote both, otherwise a
 * plain translation of their English line, listed as an open item for their approval.
 *
 * Photography: their own studio photographs (the originals on their Wix media are about
 * 3.5k by 5k pixels; their site serves them at 147 px). Pack cutouts are those same
 * photographs with the background removed by Higgsfield.
 */

export const BASE = import.meta.env.BASE_URL
export const ROUTE = '/preview/sambo'

export type Lang = 'is' | 'en'
export type Tag = 'lakkris' | 'sukkuladi' | 'mjukt' | 'season'
export type Allergen = 'wheat' | 'milk' | 'egg' | 'soy' | 'barley' | 'sulphites'
export const ALLERGENS: { id: Allergen; is: string; en: string }[] = [
  { id: 'wheat', is: 'Hveiti (glúten)', en: 'Wheat (gluten)' },
  { id: 'milk', is: 'Mjólk', en: 'Milk' },
  { id: 'egg', is: 'Egg', en: 'Egg' },
  { id: 'soy', is: 'Soja', en: 'Soya' },
  { id: 'barley', is: 'Bygg (glúten)', en: 'Barley (gluten)' },
  { id: 'sulphites', is: 'Súlfít', en: 'Sulphites' },
]

export interface Product {
  slug: string
  brand: 'sambo' | 'volu'
  name: { is: string; en: string }
  /** one line, their words (Icelandic where they wrote it, else a plain translation of their English) */
  desc: { is: string; en: string }
  tags: Tag[]
  /** the colour of the pack: the page washes to it */
  tint: string
  ink?: string
  season?: 'paskar' | 'jol'
  madeToOrder?: boolean
  isNew?: boolean
  /** as printed on their product page */
  weight?: string
  /** bold allergens on their own label image; null = no label on their site */
  allergens: Allergen[] | null
  /** their label files, by role */
  labels: { ing?: boolean; nfEu?: boolean; nfUs?: boolean }
  hasPack: boolean
  hasOpen: boolean
  macros: number
  /** pack photograph used as the card when there is no cutout */
  cover?: 'pack' | 'm1'
  also?: string[]
}

const P = (p: Product): Product => p

export const PRODUCTS: Product[] = [
  P({ slug: 'thristur', brand: 'sambo', name: { is: 'Þristur', en: 'Þristur' }, desc: { is: 'Súkkulaðihúðaður mjúkur karamellubiti.', en: 'Chocolate coated soft caramel bar.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#d3202a', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['thristur-travel', 'thristur-stong', 'thrista-stubbar', 'thristakulur'] }),
  P({ slug: 'thristur-travel', brand: 'sambo', name: { is: 'Þristur Travel Edition', en: 'Þristur Travel Edition' }, weight: '600 g',
    desc: { is: 'Mjólkursúkkulaði (24%) með karamellufyllingu (62%) og lakkrísbitum (14%).', en: 'Milk chocolate (24%) with soft caramel (62%) and liquorice pieces (14%).' },
    tags: ['sukkuladi', 'mjukt'], tint: '#d3202a', allergens: null, labels: {}, hasPack: true, hasOpen: false, macros: 1, also: ['thristur', 'thristur-stong'] }),
  P({ slug: 'thrista-stubbar', brand: 'sambo', name: { is: 'Þrista stubbar', en: 'Þrista stubbar' }, isNew: true,
    desc: { is: 'Nýtt frá Sambó.', en: 'New from Sambó.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#8d4a2b', allergens: null, labels: {}, hasPack: true, hasOpen: false, macros: 1, also: ['thristur', 'thristakulur'] }),
  P({ slug: 'thristakulur', brand: 'sambo', name: { is: 'Þristakúlur', en: 'Þristakúlur' }, isNew: true,
    desc: { is: 'Súkkulaði-, lakkrís- og karamellufylling.', en: 'Chocolate, liquorice and caramel filling.' },
    tags: ['sukkuladi', 'lakkris', 'mjukt'], tint: '#bcd12b', allergens: ['wheat', 'milk'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 1, also: ['snjoboltar', 'superboltar'] }),
  P({ slug: 'thristur-stong', brand: 'sambo', name: { is: 'Þristur stöng', en: 'Þristur bar' },
    desc: { is: 'Súkkulaðihúðuð mjúk karamellustöng með mjúkum lakkrísbitum.', en: 'Chocolate coated soft caramel bar with soft liquorice bits.' },
    tags: ['sukkuladi', 'lakkris', 'mjukt'], tint: '#f0cb1f', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['thristur', 'olsen-olsen', 'saela'] }),
  P({ slug: 'olsen-olsen', brand: 'sambo', name: { is: 'Olsen Olsen', en: 'Olsen Olsen' },
    desc: { is: 'Súkkulaðihúðað lakkrískonfekt í stöng.', en: 'Chocolate coated liquorice allsorts bar.' },
    tags: ['sukkuladi', 'lakkris'], tint: '#c8212b', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['saela', 'thristur-stong'] }),
  P({ slug: 'saela', brand: 'sambo', name: { is: 'Sambó Sæla', en: 'Sambó Sæla' },
    desc: { is: 'Mjúkt lakkrísstykki húðað súkkulaði.', en: 'Chocolate covered soft liquorice bar.' },
    tags: ['sukkuladi', 'lakkris', 'mjukt'], tint: '#b81e2e', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: false, macros: 3, also: ['olsen-olsen', 'thristur-stong'] }),
  P({ slug: 'kulusukk', brand: 'sambo', name: { is: 'Kúlusúkk', en: 'Kúlusúkk' },
    desc: { is: 'Súkkulaðihúðaðar lakkrískúlur.', en: 'Chocolate coated liquorice balls.' },
    tags: ['sukkuladi', 'lakkris'], tint: '#8a2f9e', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['sport-lakkris', 'snjoboltar', 'superboltar'] }),
  P({ slug: 'lakkriskonfekt', brand: 'sambo', name: { is: 'Lakkrískonfekt', en: 'Liquorice Allsorts' },
    desc: { is: 'Lakkrískonfekt í mörgum litum og gerðum.', en: 'Liquorice allsorts sweets.' },
    tags: ['lakkris'], tint: '#d4202d', allergens: ['wheat'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['gammeldags-lakkris', 'kremrulla', 'lakkrisreimar'] }),
  P({ slug: 'gammeldags-lakkris', brand: 'sambo', name: { is: 'Gammeldags lakkrís', en: 'Traditional Black Liquorice' },
    desc: { is: 'Hefðbundið svart íslenskt lakkrísnammi.', en: 'Traditional black Icelandic liquorice sweets.' },
    tags: ['lakkris'], tint: '#2a47a0', allergens: null, labels: { nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['lakkrisreimar', 'lakkriskonfekt'] }),
  P({ slug: 'lakkrisreimar', brand: 'sambo', name: { is: 'Lakkrísreimar', en: 'Liquorice Laces' },
    desc: { is: 'Lakkrísreimar frá Sambó.', en: 'Sambó liquorice laces.' },
    tags: ['lakkris'], tint: '#c8222c', allergens: ['wheat'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 2, also: ['gammeldags-lakkris', 'kremrulla'] }),
  P({ slug: 'kremrulla', brand: 'sambo', name: { is: 'Kremrúlla', en: 'Allsorts Roll' },
    desc: { is: 'Lakkrískonfekt í rúllu.', en: 'Liquorice allsorts roll.' },
    tags: ['lakkris'], tint: '#e5688a', allergens: ['wheat'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: false, macros: 3, also: ['lakkriskonfekt', 'lakkrisreimar'] }),
  P({ slug: 'sport-lakkris', brand: 'sambo', name: { is: 'Sport lakkrís', en: 'Sport Liquorice' },
    desc: { is: 'Súkkulaðihúðaður lakkrís.', en: 'Chocolate coated liquorice.' },
    tags: ['sukkuladi', 'lakkris'], tint: '#d63a2c', allergens: ['wheat', 'milk', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['kulusukk', 'olsen-olsen'] }),
  P({ slug: 'snjoboltar', brand: 'sambo', name: { is: 'Snjóboltar', en: 'Snow Balls' }, isNew: true,
    desc: { is: 'Súkkulaðikúlur með lakkrískjarna og hvítri sykurhúð.', en: 'Chocolate balls with a liquorice centre and white sugar coating.' },
    tags: ['sukkuladi', 'lakkris'], tint: '#5f8cab', allergens: ['wheat', 'milk'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['superboltar', 'thristakulur'] }),
  P({ slug: 'superboltar', brand: 'sambo', name: { is: 'Superboltar', en: 'Pepper Pearls' }, isNew: true,
    desc: { is: 'Súkkulaðikúlur með lakkrískjarna og lakkrísdufti.', en: 'Chocolate balls with a liquorice centre, dusted with liquorice powder.' },
    tags: ['sukkuladi', 'lakkris'], tint: '#b9a244', allergens: ['wheat', 'milk'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 2, also: ['snjoboltar', 'kulusukk'] }),
  P({ slug: 'froskar', brand: 'volu', name: { is: 'Froskar', en: 'Candy Frogs' },
    desc: { is: 'Súkkulaðihúðaðir „grænir“ sykurpúðar með bragðefni.', en: 'Chocolate coated “green marshmallows” with added flavour.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#5cae3c', allergens: ['milk', 'egg', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: true, macros: 3, also: ['bananastangir', 'kokosbollur'] }),
  P({ slug: 'bananastangir', brand: 'volu', name: { is: 'Banana-stangir', en: 'Banana sticks' },
    desc: { is: 'Völu Banana-stangir.', en: 'Völu banana sticks.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#f0cf12', allergens: null, labels: {}, hasPack: true, hasOpen: true, macros: 2, also: ['froskar', 'kokosbollur'] }),
  P({ slug: 'kokosbollur', brand: 'volu', name: { is: 'Kókosbollur', en: 'Chocolate coated Marshmallows' }, weight: '8 stk., 150 g',
    desc: { is: 'Súkkulaði- og kókoshúðaðir sykurpúðar.', en: 'Chocolate and coconut powder coated marshmallows.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#efb40d', allergens: ['milk', 'egg', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: true, hasOpen: false, macros: 1, also: ['sexa-buff', 'froskar'] }),
  P({ slug: 'sexa-buff', brand: 'volu', name: { is: 'Sexa, buff og bollur', en: 'Sexa, buff and bollur' },
    desc: { is: 'Kókosbollur og buff, súkkulaði- og kókoshúðaðir sykurpúðar.', en: 'Coconut balls and buff: chocolate and coconut powder coated marshmallows.' },
    tags: ['sukkuladi', 'mjukt'], tint: '#9b6a47', allergens: ['milk', 'sulphites', 'egg', 'barley', 'soy'], labels: { ing: true, nfEu: true, nfUs: true }, hasPack: false, hasOpen: false, macros: 4, cover: 'm1', also: ['kokosbollur', 'froskar'] }),
  P({ slug: 'paskaegg', brand: 'sambo', name: { is: 'Sambó páskaegg', en: 'Sambó Easter egg' }, season: 'paskar', madeToOrder: true,
    desc: { is: 'Páskaegg fyllt með sælgæti.', en: 'Chocolate Easter egg filled with candy mix.' },
    tags: ['sukkuladi', 'season'], tint: '#f0b81f', allergens: null, labels: {}, hasPack: true, hasOpen: true, macros: 0, also: ['paskaboltinn', 'thrista-paskaegg'] }),
  P({ slug: 'thrista-paskaegg', brand: 'sambo', name: { is: 'Þrista páskaegg', en: 'Þrista Easter egg' }, weight: '500 g', season: 'paskar', madeToOrder: true,
    desc: { is: 'Páskaegg með Þristum.', en: 'Easter egg with Þristur.' },
    tags: ['sukkuladi', 'season'], tint: '#c9a24a', allergens: null, labels: {}, hasPack: true, hasOpen: false, macros: 2, also: ['paskaegg', 'paskaboltinn'] }),
  P({ slug: 'paskaboltinn', brand: 'sambo', name: { is: 'Páskaboltinn', en: 'Chocolate football' }, season: 'paskar', madeToOrder: true,
    desc: { is: 'Súkkulaði páskabolti fylltur með sælgæti.', en: 'Chocolate football filled with candy mix.' },
    tags: ['sukkuladi', 'season'], tint: '#f0c029', allergens: null, labels: {}, hasPack: true, hasOpen: false, macros: 1, also: ['paskaegg', 'thrista-paskaegg'] }),
  P({ slug: 'kaerleikstre', brand: 'sambo', name: { is: 'Kærleikstré', en: 'Holiday chocolate tree' }, weight: '800 g', season: 'jol',
    desc: { is: 'Súkkulaðijólatré, Kærleikstré.', en: 'Holiday chocolate tree.' },
    tags: ['sukkuladi', 'season'], tint: '#b3202a', allergens: null, labels: {}, hasPack: true, hasOpen: false, macros: 1, also: ['thristur', 'thristur-travel'] }),
]

export const productBySlug = (s: string) => PRODUCTS.find((p) => p.slug === s)
export const FEATURED = ['thristur', 'kulusukk', 'lakkriskonfekt', 'gammeldags-lakkris', 'froskar', 'snjoboltar']
export const TAGS: { id: Tag | 'all'; is: string; en: string }[] = [
  { id: 'all', is: 'Allt', en: 'All' },
  { id: 'lakkris', is: 'Lakkrís', en: 'Liquorice' },
  { id: 'sukkuladi', is: 'Súkkulaði', en: 'Chocolate' },
  { id: 'mjukt', is: 'Mjúkt nammi', en: 'Soft sweets' },
  { id: 'season', is: 'Páskar og jól', en: 'Easter and Christmas' },
]

export const img = (slug: string, f: string) => `${BASE}sambo/p/${slug}/${f}`

export const CONTACT = {
  name: 'Kólus ehf.',
  email: 'sambo@sambo.is',
  emailFundraise: 'kjartan@sambo.is',
  phone: '535 0300',
  phoneHref: 'tel:+3545350300',
  address: 'Tunguháls 5',
  postcode: '110 Reykjavík',
  kt: '630872-0149',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Tunguh%C3%A1ls+5+110+Reykjav%C3%ADk',
}

/** the online shops that stock Sambó, found by search and each link checked live (HTTP 200); Kólus' own shop says "under construction" */
export const SHOPS = [
  { name: 'Nammi.is', href: 'https://nammi.is/collections/sambo', note: { is: 'Íslensk netverslun með sælgæti og Sambó vörur.', en: 'Icelandic online candy shop with a Sambó collection.' } },
  { name: 'Icelandic Store', href: 'https://icelandicstore.is/collections/sambo-candy', note: { is: 'Netverslun fyrir gesti og útlönd.', en: 'Online shop for visitors and abroad.' } },
  { name: 'Top Iceland', href: 'https://topiceland.com/collections/icelandic-candy/sambo', note: { is: 'Netverslun með íslenskt nammi, þar á meðal Sambó.', en: 'Online shop for Icelandic candy, including Sambó.' } },
  { name: 'Shop Icelandic', href: 'https://www.shopicelandic.com/collections/candy', note: { is: 'Netverslun með íslenskt nammi, meðal annars Sambó Þrist.', en: 'Online shop for Icelandic candy, including Sambó Þristur.' } },
]

/** a pack or open-bag cutout in one of its three sizes (s 460 px, m 720 px, b = the full file) */
export const PK = (slug: string, kind: 'pack' | 'open' = 'pack', size: 's' | 'm' | 'b' = 'm') =>
  `${BASE}sambo/p/${slug}/${kind}${size === 'b' ? '' : `-${size}`}.webp`
