/**
 * Rakararnir á Klapparstíg 40 — reference build on baggu.com.
 *
 * REFERENCE, torn down at code level 2026-08-07:
 *   ground  #F6F4EE bone, black ink, ONE accent per band
 *   radius  0px on every image and every surface
 *   media   edge-to-edge, zero gaps, 4:5 portrait tiles in rows (18 images
 *           measured at exactly 0.80 ratio)
 *   device  a full-width COLOURED CAPTION BAND directly under a media row,
 *           labelling it, big caps, one word left and one right
 *   header  nav left, wordmark CENTRED, utility right
 *   rows    centred section label with prev/next arrows pushed to the extreme
 *           viewport edges
 *   motion  short and snappy, 0.1-0.2s, opacity cubic-bezier(.4,0,.2,1)
 *   foot    a GIANT wordmark across the full width with hand-drawn
 *           illustrations climbing over it. This is the warm signature move.
 *
 * WHAT IS OURS, not borrowed: the palette is their building (corrugated-iron
 * green, oxide-red window frames, gilded lettering), the wordmark is their own
 * hand-painted sign, the drawn marks are their own objects, and the copy is
 * a walk-in barbershop's, not a shop's.
 *
 * THEIR LOGO, recovered from their own photographs: the gilded lettering on
 * the corner glass reads mirrored from inside, so g4/p1 were un-flipped to
 * read it. It is RAKARARNIR arched over KLAPPARSTÍGUR, in bold condensed
 * hand-painted caps with a dark outline and a speckled gold-leaf fill, with an
 * oval gold rosette alongside. NOT a slab serif, which an earlier build
 * wrongly assumed. Anton is the closest available match in proportion.
 *
 * HONESTY LEDGER
 *  - VERIFIED: name, address, phone (já.is + Facebook), Barber's category,
 *    Hársnyrtistofa self-description, 9 reviews at 100% recommend, the DROP INS
 *    WELCOME window card, the gilded lettering, Pride flags year round.
 *  - CORROBORATED, confirm before any email: hours. já.is lists weekdays
 *    10:00-18:00; Facebook's live status flipped to "Open now" after 10:00 on
 *    Fri 2026-08-07.
 *  - PLACEHOLDER, marked on screen in both languages: prices, service list,
 *    the quiet-hours table.
 *  - NOT INVENTED: staff names, testimonials. The real 9 reviews at 100% are
 *    shown as the real number with a link out.
 *  - NOT the 1918-2017 shop. Never borrow that heritage.
 */

const BASE = import.meta.env.BASE_URL
export const P = (f: string) => `${BASE}rakararnir/${f}`

/** Their own photographs, harvested from Facebook (their only web presence). */
export const PHOTOS = {
  husid: P('husid.webp'),
  /**
   * The hero, enlarged for full-bleed use. 1152x1152 lands at 0.74 source px
   * per CSS px, and this project's ledger records 0.83 failing visibly while
   * 1.8-2.6 holds. Enlarged 1152 -> 4096 (ByteDance) and delivered at 3400.
   * Enhancement of their real photograph, not a synthetic room.
   *
   * NOT the exterior: the only exterior photograph they have predates the
   * barbershop, so it shows the unit before fit-out. This one is the shop as
   * it actually is, and it carries the barber pole and the gilded arch on the
   * glass, which is what the drawn lockup dissolves into.
   */
  bidstofaHero: P('bidstofa-hero.webp'),
  gluggiGata: P('gluggi-gata.webp'),
  gluggiKvold: P('gluggi-kvold.webp'),
  bidstofa: P('bidstofa.webp'),
  stofan: P('stofan.webp'),
  spegill: P('spegill.webp'),
  fanar: P('fanar.webp'),
  folkid: P('folkid.webp'),
  jolatre: P('jolatre.webp'),
} as const

export const SHOP = {
  name: 'Rakararnir',
  fullName: 'Rakararnir á Klapparstíg 40',
  street: 'Klapparstígur 40',
  postcode: '101 Reykjavík',
  phone: '551 3010',
  phoneHref: 'tel:+3545513010',
  facebook: 'https://www.facebook.com/p/Rakararnir-%C3%A1-Klapparst%C3%ADg-40-100057750515735/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Klapparst%C3%ADgur+40%2C+101+Reykjav%C3%ADk',
  reviewCount: 9,
  recommendPct: 100,
} as const

/** Index 0 = Sunday, matching Date#getDay. Live badge and printed table both read this. */
export const HOURS: ({ open: number; close: number } | null)[] = [
  null,
  { open: 10, close: 18 },
  { open: 10, close: 18 },
  { open: 10, close: 18 },
  { open: 10, close: 18 },
  { open: 10, close: 18 },
  null,
]

/** Monday-first display order, indexing into HOURS (which is Sunday-first). */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

/**
 * The columns of the week grid, DERIVED from HOURS rather than typed out, so
 * the grid and the live badge can never end up disagreeing with each other.
 */
export const GRID_HOURS = (() => {
  const days = HOURS.filter(Boolean) as { open: number; close: number }[]
  const from = Math.min(...days.map((h) => h.open))
  const to = Math.max(...days.map((h) => h.close))
  return Array.from({ length: to - from }, (_, i) => from + i)
})()

/**
 * PLACEHOLDER prices, durations and descriptions, all stated on screen in both
 * languages. Nothing here is a claim about how this shop actually works; the
 * row copy is deliberately generic to what any barbershop offers, and the whole
 * block carries the placeholder note beneath it. Real figures come from the
 * owner before this page goes anywhere near a customer.
 */
export const SERVICES = [
  {
    is: 'Herraklipping', en: 'Men’s haircut', price: '7.900', mins: 30,
    noteIs: 'Klipping og snyrting', noteEn: 'Cut and tidy',
    descIs: 'Klippt með skærum og vél, mótað eftir hárvexti og því sem þú vilt fá út úr heimsókninni.',
    descEn: 'Cut with scissors and clippers, shaped around how your hair grows and what you want out of the visit.',
    photo: 'stofan',
  },
  {
    is: 'Vélarklipping', en: 'Clipper cut', price: '5.900', mins: 20,
    noteIs: 'Ein lengd', noteEn: 'One length',
    descIs: 'Ein lengd yfir allt höfuðið. Fljótlegasta klippingin og sú sem hentar best ef þú veist nákvæmlega hvað þú vilt.',
    descEn: 'One length all over. The quickest cut in the chair, and the one to ask for if you already know exactly what you want.',
    photo: 'spegill',
  },
  {
    is: 'Klipping og skegg', en: 'Cut and beard', price: '10.400', mins: 45,
    noteIs: 'Í einni heimsókn', noteEn: 'One visit',
    descIs: 'Hárið og skeggið klárað í sömu setu, línur látnar falla saman svo hvort tveggja passi.',
    descEn: 'Hair and beard finished in the same sitting, with the lines brought together so the two actually match.',
    photo: 'bidstofa',
  },
  {
    is: 'Skeggsnyrting', en: 'Beard trim', price: '4.200', mins: 20,
    noteIs: 'Snyrting og lögun', noteEn: 'Trim and shape',
    descIs: 'Lengd jöfnuð, kinnar og háls hreinsaðir og línurnar skerptar.',
    descEn: 'Length evened out, cheeks and neck cleaned up, and the lines sharpened.',
    photo: 'spegill',
  },
  {
    is: 'Barnaklipping', en: 'Children', price: '4.900', mins: 25,
    noteIs: '12 ára og yngri', noteEn: '12 and under',
    descIs: 'Fyrir 12 ára og yngri. Enginn tími pantaður, svo það má koma þegar hentar og bíða í sófanum ef þarf.',
    descEn: 'For 12 and under. Nothing is booked, so come when it suits and wait on the sofa if the chairs are full.',
    photo: 'stofan',
  },
  {
    is: 'Dömuklipping', en: 'Women’s haircut', price: '9.800', mins: 45,
    noteIs: 'Klipping og blástur', noteEn: 'Cut and blow dry',
    descIs: 'Klipping og blástur. Stofan er rakarastofa en klippir alla, ekki bara stutt hár.',
    descEn: 'Cut and blow dry. This is a barbershop, but it cuts everyone, not only short hair.',
    photo: 'bidstofa',
  },
] as const

/** The tourist helper. Rough English approximation, labelled as such. */
export const PHRASES = [
  { is: 'Góðan daginn', en: 'Hello', say: 'GOH-than DY-in' },
  { is: 'Get ég fengið klippingu?', en: 'Can I get a haircut?', say: 'get YEGH FEING-ith KLIH-ping-u' },
  { is: 'Stutt á hliðunum', en: 'Short on the sides', say: 'STUHT ow HLIH-thun-um' },
  { is: 'Hvað kostar þetta?', en: 'How much is it?', say: 'KVATH KOS-tar THET-ta' },
  { is: 'Takk fyrir', en: 'Thank you', say: 'TAHK FIH-rir' },
]
