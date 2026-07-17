/**
 * FISK KOMPANÍ — „Dagsins afli, loksins á netinu"
 *
 * Concept: the fish counter Akureyri already trusts, finally open online.
 * The page opens as the real display case, the shop grid IS the promised
 * web store, the Ólafsfjörður smokehouse chapter is told in drifting smoke,
 * and the finale dissolves the real years-old Shopify placeholder line
 * („Opnum vefverslunina fljótlega!") into „Vefverslunin er opin."
 *
 * FACTS — every name, date, address and quote below comes from the prep
 * dossier (ja.is, keldan.is, veitingageirinn.is, glerartorg.is, kaffid.is,
 * fvsa.is). ALL PRICES ARE DISCLOSED DESIGN SAMPLES — no public price list
 * exists. Hours are directory-sourced and flagged as unconfirmed. Reviews
 * are aggregated sentiment, not named individuals. The two photos showing
 * people carry NO name captions (identities unconfirmed).
 *
 * PHOTOGRAPHY — 14 images, all the business's own real photography or real
 * press photography of their real shops/events. Zero stock. Files live in
 * public/fiskkompani/ and are addressed via import.meta.env.BASE_URL.
 */

const B = import.meta.env.BASE_URL

export const IMG = {
  hero: `${B}fiskkompani/counter-hero.jpg`,
  marinerud: `${B}fiskkompani/marinerud-flok.jpg`,
  rettir: `${B}fiskkompani/rettir-bord.jpg`,
  medlaeti: `${B}fiskkompani/medlaeti.jpg`,
  hakk: `${B}fiskkompani/hakk.jpg`,
  kjotbord: `${B}fiskkompani/kjotbord.jpg`,
  ofnsteik: `${B}fiskkompani/ofnsteik.jpg`,
  sosur: `${B}fiskkompani/sosuhilla.jpg`,
  budarbord: `${B}fiskkompani/budarbord.jpg`,
  inngangur: `${B}fiskkompani/verslun-inngangur.jpg`,
  golf: `${B}fiskkompani/verslun-golf.jpg`,
  glerartorg: `${B}fiskkompani/glerartorg.jpg`,
  vidbordid: `${B}fiskkompani/vid-bordid.png`,
  fiskrettur: `${B}fiskkompani/fiskrettur.jpg`,
} as const

export type ImgKey = keyof typeof IMG

/* ── Contact (verified: ja.is) ─────────────────────────────────────────── */
export const PHONE = '571 8080'
export const PHONE_HREF = 'tel:+3545718080'
export const EMAIL = 'fiskkompani@fiskkompani.is'
export const FACEBOOK = 'https://www.facebook.com/fiskkompani'
export const INSTAGRAM = 'https://www.instagram.com/fiskkompanii'

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Fiskbúð og sælkeraverzlun á Akureyri frá 2013',
  headline: 'Dagsins afli, loksins á netinu.',
  sub: 'Sama borðið og þú þekkir úr Kjarnagötu og af Glerártorgi. Veldu vöruna hér og við tökum hana til í búðinni.',
  cta: 'Skoða vefverslunina',
  imageAlt:
    'Kælborðið hjá Fisk Kompaní, fullir bakkar af marineruðum fiski og kjöti undir gleri í hlýrri búðarlýsingu',
}

/* ── Shop (sample prices, disclosed) ───────────────────────────────────── */
export type CatId = 'fiskur' | 'rettir' | 'reykt' | 'kjot' | 'sosur'

export const CATEGORIES: { id: CatId | 'allt'; label: string }[] = [
  { id: 'allt', label: 'Allt í borðinu' },
  { id: 'fiskur', label: 'Nýveiddur fiskur' },
  { id: 'rettir', label: 'Tilbúnir réttir' },
  { id: 'reykt', label: 'Reykt og grafið' },
  { id: 'kjot', label: 'Kjötborðið' },
  { id: 'sosur', label: 'Sósur og meðlæti' },
]

export interface Product {
  id: string
  name: string
  note: string
  price: string
  unit: string
  cat: CatId
  img?: ImgKey
  alt: string
  tag?: string
}

/* Prices are realistic 2026 fish-counter samples, disclosed in section note
   and footer. Smoked goods carry no photo on purpose — no verified photo of
   the Ólafsfjörður products exists, so those cards get the smoke tile. */
export const PRODUCTS: Product[] = [
  {
    id: 'marinerud-flok',
    name: 'Marineruð fiskflök',
    note: 'Chili, hvítlaukur eða kryddjurtir. Beint í ofninn.',
    price: '2.890 kr.',
    unit: '/kg',
    cat: 'fiskur',
    img: 'marinerud',
    alt: 'Raðir af marineruðum fiskflökum í kælborðinu, rauð chili-marinering og græn kryddjurtamarinering',
    tag: 'Í borðinu',
  },
  {
    id: 'thorskflok',
    name: 'Fersk þorskflök',
    note: 'Flakað á staðnum í votrými búðarinnar.',
    price: '2.590 kr.',
    unit: '/kg',
    cat: 'fiskur',
    img: 'hero',
    alt: 'Kælborðið hjá Fisk Kompaní með bökkum af ferskum fiski undir gleri',
    tag: 'Nýtt í dag',
  },
  {
    id: 'fiskrettur-dagsins',
    name: 'Fiskur í rétti',
    note: 'Keila, langa og þorskur í tómatsósu. Um 15 mín í ofni.',
    price: '2.690 kr.',
    unit: '/kg',
    cat: 'rettir',
    img: 'fiskrettur',
    alt: 'Eldaður fiskréttur með þorski, rækjum og kirsuberjatómötum í tómatsósu',
  },
  {
    id: 'fiskibollur',
    name: 'Fiskibollur og salöt',
    note: 'Bollur dagsins og heimalöguð salöt úr borðinu.',
    price: '1.890 kr.',
    unit: '/kg',
    cat: 'rettir',
    img: 'rettir',
    alt: 'Fiskibollur og heimalöguð salöt í stálbökkum í kælborðinu',
  },
  {
    id: 'birkireyktur-lax',
    name: 'Birkireyktur lax',
    note: 'Lax úr landeldi, reyktur á Ólafsfirði.',
    price: '3.590 kr.',
    unit: '/kg',
    cat: 'reykt',
    alt: '',
    tag: 'Frá Ólafsfirði',
  },
  {
    id: 'reykt-bleikja',
    name: 'Reykt bleikja í sneiðum',
    note: 'Bleikja úr landeldi, tilbúin á brauðið.',
    price: '590 kr.',
    unit: '/pk.',
    cat: 'reykt',
    alt: '',
    tag: 'Frá Ólafsfirði',
  },
  {
    id: 'grafinn-lax',
    name: 'Grafinn lax',
    note: 'Grafinn eftir gömlu lagi, borinn fram með sósu.',
    price: '3.490 kr.',
    unit: '/kg',
    cat: 'reykt',
    alt: '',
    tag: 'Frá Ólafsfirði',
  },
  {
    id: 'ofnsteik',
    name: 'Fyllt steik, tilbúin í ofninn',
    note: 'Vafin og bundin með kryddjurtum og hvítlauk.',
    price: '4.890 kr.',
    unit: '/kg',
    cat: 'kjot',
    img: 'ofnsteik',
    alt: 'Vafin og bundin steik með kryddjurtum og hvítlauk, tilbúin í ofninn',
  },
  {
    id: 'steikur',
    name: 'Steikur og grillspjót',
    note: 'Nautavöðvar, marinerað kjöt og spjót af borðinu.',
    price: '4.290 kr.',
    unit: '/kg',
    cat: 'kjot',
    img: 'kjotbord',
    alt: 'Steikur, krydduð grillspjót og kjötsneiðar í kjötborðinu',
  },
  {
    id: 'hakk',
    name: 'Ferskt hakk',
    note: 'Hakkað á staðnum, líka í hamborgara eftir pöntun.',
    price: '2.190 kr.',
    unit: '/kg',
    cat: 'kjot',
    img: 'hakk',
    alt: 'Ferskt hakk í bökkum í kjötborðinu',
  },
  {
    id: 'medlaeti',
    name: 'Meðlæti dagsins',
    note: 'Kartöflubátar, rúllur og fersk salöt með matnum.',
    price: '1.290 kr.',
    unit: '/kg',
    cat: 'sosur',
    img: 'medlaeti',
    alt: 'Rúllur, kryddaðir kartöflubátar og litrík salöt í kælborðinu',
  },
  {
    id: 'sosur',
    name: 'Sósur og marineringar',
    note: 'Hillan við borðið, krukkur og kryddblöndur.',
    price: '890 kr.',
    unit: '/stk.',
    cat: 'sosur',
    img: 'sosur',
    alt: 'Hilla með krukkum af sósum, marineringum og kryddblöndum',
  },
]

export const FEATURED_IDS = ['marinerud-flok', 'fiskrettur-dagsins', 'ofnsteik', 'birkireyktur-lax']

export const SHOP = {
  heading: 'Beint úr borðinu',
  sub: 'Það sem liggur undir glerinu í dag. Veldu og við tökum til, eða hringdu og við göngum frá þessu í síma.',
  sampleNote: 'Verð eru sýnishorn fyrir hönnun, ekki gildandi verðlisti.',
  addLabel: 'Bæta í körfu',
}

/* ── Meat counter callout (verified copy: steaks, lamb racks, marinated
      meats, beef cuts, made-to-order burgers) ──────────────────────────── */
export const MEAT = {
  heading: 'Kjötborðið',
  body: 'Það er meira en fiskur undir glerinu. Í kjötborðinu eru steikur, lambahryggir, marinerað kjöt og nautavöðvar, og hamborgararnir eru búnir til á staðnum eftir pöntun.',
  imageAlt1: 'Steikur, krydduð grillspjót og kjötsneiðar í kjötborðinu hjá Fisk Kompaní',
  imageAlt2: 'Vafin steik með kryddjurtum og hvítlauk, bundin og tilbúin beint í ofninn',
  caption: 'Tilbúið í ofninn, bundið og kryddað á staðnum.',
}

/* ── Í borðinu í dag — split counter board (illustrative, disclosed) ───── */
export const BOARD = {
  heading: 'Í BORÐINU Í DAG',
  note: 'Dæmi um það sem gæti verið í borðinu. Úrvalið breytist eftir degi og afla, hringdu til að fá stöðuna.',
  columns: [
    {
      shop: 'Kjarnagata 2',
      hint: 'Við hliðina á Bónus',
      items: ['Þorskflök dagsins', 'Marineruð flök', 'Humar', 'Salöt og meðlæti', 'Hamborgarar eftir pöntun'],
    },
    {
      shop: 'Glerártorg',
      hint: 'Við hliðina á Nettó',
      items: ['Ýsa dagsins', 'Tilbúnir réttir', 'Grillspjót', 'Birkireyktur lax', 'Reykt bleikja'],
    },
  ],
}

/* ── Smokehouse chapter (verified: kaffid.is 29.4.2026) ────────────────── */
export const SMOKEHOUSE = {
  eyebrow: 'Reykhúsið',
  heading: 'Frá Ólafsfirði til Akureyrar',
  body1:
    'Í lok apríl 2026 luku Ragnar og Ólöf, sem reka Fisk Kompaní, kaupum á Betri vörum ehf., vinnslufyrirtæki á Ólafsfirði. Þar er lax og bleikja úr landeldi birkireykt, grafin og unnin fyrir verslanir, hótel og veitingastaði.',
  body2:
    'Betri vörur vinna eingöngu lax og bleikju úr landeldi og sneiða vísvitandi hjá sjókvíaeldi. Ragnar hefur sagt að gæði og ábyrgð í matvælaframleiðslu skipti máli, kaupin sameini krafta fyrirtækjanna, breikki úrvalið og tryggi viðskiptavinum áfram fisk sem er alinn með þessum hætti.',
  products: ['Birkireyktur lax', 'Reykt bleikja', 'Reykt ýsa', 'Grafinn lax'],
  distribution:
    'Vörurnar hafa meðal annars fengist hjá Samkaupum, Fjarðarkaupum, Fiskikónginum, Kaupfélagi Skagfirðinga og Hlíðarkaupi.',
  imageAlt: 'Tvær manneskjur við búðarborðið hjá Fisk Kompaní, innrömmuð svarthvít mynd af fiskibát á veggnum',
  imageCaption: 'Við borðið hjá Fisk Kompaní.',
}

/* ── Story (verified: veitingageirinn.is 2013, kaffid.is 2026) ─────────── */
export const STORY = {
  eyebrow: 'Sagan',
  heading: 'Fjögur sem byrjuðu þetta',
  body1:
    'Fisk Kompaní opnaði 3. september 2013 við Kjarnagötu, í húsinu við hliðina á Bónus efst í bænum. Að baki stóðu Ragnar Haukur Hauksson, Ólöf Salmannsdóttir, Kristín Steindórsdóttir og Aðalsteinn Pálsson.',
  body2:
    'Frá fyrsta degi var þetta meira en búð. Á staðnum er vinnsluaðstaða og votrými þar sem fiskurinn er flakaður og unninn. Í dag reka Ragnar og Ólöf verslanirnar tvær og reykhúsið á Ólafsfirði.',
  imageAlt: 'Búðarborðið hjá Fisk Kompaní með hvítum túlípönum í vasa og starfsmanni við kassann',
}

/* ── Reviews (aggregated sentiment, disclosed) ─────────────────────────── */
export const REVIEWS = {
  heading: 'Hvað fólk segir',
  disclosure: 'Samantekt á umsögnum af netinu. Ekki orðrétt ummæli nafngreindra viðskiptavina.',
  items: [
    'Frábær búð, góður fiskur í spennandi marineringum og starfsfólkið einstaklega hjálplegt.',
    'Mikið úrval af kryddlegnum fiski sem fer beint í ofninn. Um 15 mínútur og maturinn er klár.',
    'Verðin góð og fiskurinn ferskur. Besta fisk- og kjötbúðin í húsinu við hliðina á Bónus.',
  ],
}

/* ── Locations (verified addresses; hours directory-sourced) ───────────── */
export const LOCATIONS = {
  heading: 'Tvær verslanir á Akureyri',
  hoursNote: 'Tímar af vefskrám þriðja aðila, ekki staðfestir af versluninni. Hringdu til öryggis.',
  shops: [
    {
      name: 'Kjarnagata 2',
      hint: 'Við hliðina á Bónus, 600 Akureyri',
      since: 'Upprunalega búðin, opnuð 2013',
      img: 'inngangur' as ImgKey,
      alt: 'Inngangur verslunarinnar með hillum af pakkavöru og kælborði innar í rýminu',
      map: 'https://maps.google.com/?q=Fisk+Kompan%C3%AD+Kjarnagata+2+Akureyri',
      hours: [
        ['Mán til fim', '11:00 til 18:30'],
        ['Föstudagar', '10:00 til 19:00'],
        ['Laugardagar', '11:00 til 18:00'],
        ['Sunnudagar', '13:00 til 18:00'],
      ],
    },
    {
      name: 'Glerártorg',
      hint: 'Gleráreyrum 1, við hliðina á Nettó',
      since: 'Opnuð 20. apríl 2023',
      img: 'glerartorg' as ImgKey,
      alt: 'Verslunarmiðstöðin Glerártorg í snjó og vetrarsól með fjöll í baksýn',
      map: 'https://maps.google.com/?q=Gler%C3%A1rtorg+Akureyri',
      hours: null,
    },
  ],
}

/* ── Finale — the placeholder payoff (verbatim from the live Shopify
      placeholder, verified 2026-07-16) ───────────────────────────────── */
export const FINALE = {
  caption: 'Á fiskkompani.is hefur staðið í mörg ár:',
  before: 'Opnum vefverslunina fljótlega!',
  after: 'Vefverslunin er opin.',
  body: 'Þessi frumgerð sýnir hvernig loforðið gæti litið út. Fullkláruð vefverslun, byggð á alvöru borðinu ykkar og alvöru sögunni.',
  cta: 'Skoða vörur núna',
}

/* ── Footer disclosures (honesty guardrails, all in one place) ─────────── */
export const DISCLOSURES = [
  'Öll verð á síðunni eru sýnishorn fyrir hönnun, ekki gildandi verðlisti Fisk Kompanís.',
  'Opnunartímar eru fengnir úr vefskrám þriðja aðila og eru ekki staðfestir. Hringdu í 571 8080 til að staðfesta.',
  'Umsagnir eru samantekt á umsögnum af netinu, ekki orðrétt ummæli nafngreindra einstaklinga.',
  'Karfan og pöntunarferlið eru sýnishorn af hönnun. Pantanir eru í dag afgreiddar í síma eða á staðnum.',
]

export const SOCIAL = {
  facebook: 'Facebook, um 8.400 fylgjendur',
  instagram: '@fiskkompanii á Instagram, tvö i í endann',
}

export const CART = {
  title: 'Karfan þín',
  empty: 'Karfan er tóm. Borðið bíður.',
  emptyCta: 'Skoða vörur',
  subtotal: 'Samtals',
  checkout: 'Ganga frá pöntun',
  checkoutNote: 'Sýnishorn af hönnun. Pantanir eru í dag afgreiddar í síma 571 8080 eða á staðnum.',
}

export const META = {
  title: 'Fisk Kompaní · Dagsins afli, loksins á netinu',
  themeColor: '#F4F3EE',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'FISK kompaní sælkeraverzlun',
  telephone: '+354 571 8080',
  email: 'fiskkompani@fiskkompani.is',
  foundingDate: '2013-09-03',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kjarnagata 2',
    addressLocality: 'Akureyri',
    postalCode: '600',
    addressCountry: 'IS',
  },
  sameAs: ['https://www.facebook.com/fiskkompani', 'https://www.instagram.com/fiskkompanii'],
}
