/**
 * Pólar Hestar — everything a page says about itself outside its body, for the
 * standalone build: <title>, description, canonical, hreflang, robots, Open
 * Graph, Twitter card and schema.org JSON-LD, for every route in every
 * language.
 *
 * ONE function builds it from the merged CMS content (SiteContent), and two
 * callers use it:
 *
 *   - tools/polarhestar-standalone-seo.mjs, through the SSR bundle, writes the
 *     result into each page's static HTML, because link-preview bots and the AI
 *     crawlers read raw HTML and never run the app;
 *   - RouteHead.tsx rebuilds it in the browser when the visitor navigates
 *     between pages without a reload.
 *
 * Same function, same content, so the HTML a crawler gets and the tags the
 * browser holds cannot disagree. Nothing here is typed twice: titles and
 * descriptions come from head.ts and shortTourText.ts, prices and dates from
 * the CMS content, answers from the owners' cards (faq.ts).
 *
 * Pure: no React, no DOM, no network. Dates use the build date, never the
 * clock of whoever calls it.
 */
import type { GoodToKnowData, L3, Lang } from './data'
import type { LongTourX, SiteContent, TourX } from './sanity'
import { homeHead, rideHead, scheduleHead, tourHead } from './head'
import { faqEntries } from './faq'
import { formatRange, upcoming, type DepartureRow } from './schedule'
import { DEFAULT_LANG, INDEXABLE, LANGS, SITE_URL, routePath, type PhRoute } from './paths'

/* ── the business, as published ────────────────────────────────────────── */
export const BIZ = {
  name: 'Pólar Hestar',
  /** The old site and ISNIC use the one-word spelling; searchers type either. */
  altNames: ['Pólarhestar', 'Polar Hestar', 'Polar Horses'],
  legalName: 'Pólarhestar ehf.',
  street: 'Grýtubakki II',
  postal: '616',
  locality: 'Grenivík',
  region: 'Norðurland eystra',
  country: 'IS',
  /** Grýtubakki, the verified place on the maps (itineraries.ts, id "grytubakki"). */
  lat: 65.934,
  lon: -18.115,
  founded: '1985',
  licence: '2006-071',
} as const

/** Places the farm serves, as named on the site. */
const AREA_SERVED = ['Eyjafjörður', 'Akureyri', 'Grenivík', 'Norðurland']

const OG_LOCALE: Record<Lang, string> = { is: 'is_IS', en: 'en_GB', de: 'de_DE' }
const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)

export const abs = (path: string) => `${SITE_URL}${path}`
const BIZ_ID = `${SITE_URL}/#business`
const SITE_ID = `${SITE_URL}/#website`

/* ── what a page is ────────────────────────────────────────────────────── */
export interface HeadModel {
  lang: Lang
  route: PhRoute
  title: string
  description: string
  canonical: string
  robots: string
  alternates: Array<{ hreflang: string; href: string }>
  ogLocale: string
  ogLocaleAlternate: string[]
  ogImage: { url: string; width: number; height: number; alt: string }
  jsonLd: object[]
}

/** Every page of the site: home, schedule, a page per short ride and per ACTIVE long tour, in each language. */
export function allPages(c: SiteContent): Array<{ lang: Lang; route: PhRoute }> {
  const routes: PhRoute[] = [
    { kind: 'home' },
    { kind: 'schedule' },
    ...c.SHORT_TOURS.map((t): PhRoute => ({ kind: 'ride', id: t.id })),
    ...c.LONG_TOURS.map((t): PhRoute => ({ kind: 'tour', id: t.id })),
  ]
  return LANGS.flatMap((lang) => routes.map((route) => ({ lang, route })))
}

/** True when the CMS has a page for this route (a removed tour is not one). */
export function routeExists(c: SiteContent, route: PhRoute): boolean {
  if (route.kind === 'ride') return c.SHORT_TOURS.some((t) => t.id === route.id)
  if (route.kind === 'tour') return c.LONG_TOURS.some((t) => t.id === route.id)
  return true
}

/* ── helpers ───────────────────────────────────────────────────────────── */
const num = (v: number, lang: Lang) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')

/** A Sanity image URL resized to the 1200x630 share-card ratio; anything else is left as is. */
function cardImage(src: string): { url: string; width: number; height: number } {
  try {
    const u = new URL(src)
    if (u.hostname === 'cdn.sanity.io') {
      u.search = ''
      u.searchParams.set('w', '1200')
      u.searchParams.set('h', '630')
      u.searchParams.set('fit', 'crop')
      u.searchParams.set('q', '80')
      u.searchParams.set('fm', 'jpg')
      return { url: u.toString(), width: 1200, height: 630 }
    }
  } catch { /* fall through */ }
  return { url: src, width: 1200, height: 630 }
}

/** Departure times in minutes, across the short rides: the farm's published day. */
function rideDay(c: SiteContent): { opens: string; closes: string; first: string; last: string } | null {
  const mins = c.SHORT_TOURS.flatMap((t) => t.times ?? [])
    .map((s) => /^(\d{1,2}):(\d{2})$/.exec(s))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => Number(m[1]) * 60 + Number(m[2]))
  if (!mins.length) return null
  const hhmm = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
  // first departure to the end of the last hour-long ride
  return { opens: hhmm(Math.min(...mins)), closes: hhmm(Math.max(...mins) + 60), first: hhmm(Math.min(...mins)), last: hhmm(Math.max(...mins)) }
}

function priceRangeIsk(c: SiteContent): string {
  const all = c.SHORT_TOURS.flatMap((t) => [t.price, t.price2027]).filter((n): n is number => typeof n === 'number' && n > 0)
  return all.length ? `ISK ${Math.min(...all)}–${Math.max(...all)}` : 'ISK'
}

/* ── JSON-LD ───────────────────────────────────────────────────────────── */
const homeUrl = (lang: Lang) => abs(routePath({ kind: 'home' }, lang))

/** The full business entity: on the home page only; every other page points at it. */
function business(c: SiteContent, lang: Lang): object {
  const day = rideDay(c)
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'SportsActivityLocation'],
    '@id': BIZ_ID,
    name: BIZ.name,
    alternateName: BIZ.altNames,
    legalName: BIZ.legalName,
    url: homeUrl('is'),
    inLanguage: lang,
    knowsLanguage: LANGS,
    description: homeHead(lang).description,
    logo: { '@type': 'ImageObject', url: abs('/polarhestar/logo.png'), width: 522, height: 294 },
    image: [cardImage(c.PICS.hero.src).url, cardImage(c.PICS.story.src).url],
    telephone: c.PHONE_DISPLAY,
    email: c.EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BIZ.street,
      addressLocality: BIZ.locality,
      addressRegion: BIZ.region,
      postalCode: BIZ.postal,
      addressCountry: BIZ.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BIZ.lat, longitude: BIZ.lon },
    hasMap: c.MAPS_HREF,
    foundingDate: BIZ.founded,
    priceRange: priceRangeIsk(c),
    currenciesAccepted: 'ISK, EUR',
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    ...(day
      ? {
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: day.opens,
            closes: day.closes,
          },
        }
      : {}),
    sameAs: [c.FACEBOOK, 'https://www.instagram.com/polarhestartours', 'https://www.tripadvisor.com/Attraction_Review-g189954-d1907268-Reviews-Polar_Hestar-Akureyri_Northeast_Region.html'],
  }
}

/** The business as another node's provider/organizer: enough to stand alone, the same @id as the full one. */
function businessRef(c: SiteContent): object {
  return {
    '@type': 'TravelAgency',
    '@id': BIZ_ID,
    name: BIZ.name,
    url: homeUrl('is'),
    telephone: c.PHONE_DISPLAY,
    email: c.EMAIL,
    address: { '@type': 'PostalAddress', streetAddress: BIZ.street, addressLocality: BIZ.locality, postalCode: BIZ.postal, addressCountry: BIZ.country },
  }
}

function website(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: BIZ.name,
    alternateName: BIZ.altNames,
    url: homeUrl('is'),
    inLanguage: LANGS,
    publisher: { '@id': BIZ_ID },
  }
}

function faqPage(gtk: GoodToKnowData, set: 'short' | 'long', lang: Lang): object | null {
  const entries = faqEntries(gtk, set, lang)
  if (!entries.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${homeUrl(lang)}#faq-${set}`,
    name: set === 'short'
      ? tri(lang, 'Spurt og svarað: stuttir reiðtúrar', 'Questions about the short rides', 'Fragen zu den kurzen Ausritten')
      : tri(lang, 'Spurt og svarað: lengri ferðir', 'Questions about the long tours', 'Fragen zu den langen Touren'),
    inLanguage: lang,
    isPartOf: { '@id': SITE_ID },
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  }
}

function breadcrumb(route: PhRoute, lang: Lang, name: string): object {
  const items: Array<{ name: string; item: string }> = [{ name: BIZ.name, item: homeUrl(lang) }]
  if (route.kind === 'ride') items.push({ name: tri(lang, 'Stuttar ferðir', 'Short rides', 'Kurze Ausritte'), item: `${homeUrl(lang)}#ferdir` })
  if (route.kind === 'tour') items.push({ name: tri(lang, 'Lengri ferðir', 'Long tours', 'Lange Touren'), item: `${homeUrl(lang)}#lengri` })
  items.push({ name, item: abs(routePath(route, lang)) })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: x.item })),
  }
}

function rideTrip(c: SiteContent, t: TourX, lang: Lang, description: string): object {
  const url = abs(routePath({ kind: 'ride', id: t.id }, lang))
  const offer = (price: number, from: string, to: string) => ({
    '@type': 'Offer',
    price,
    priceCurrency: 'ISK',
    availability: 'https://schema.org/InStock',
    url,
    validFrom: from,
    priceValidUntil: to,
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: t.name[lang] || t.name.en,
    description,
    url,
    image: cardImage(t.pic.src).url,
    touristType: tri(lang, 'Hestaferð', 'Horse riding', 'Reiten'),
    inLanguage: lang,
    provider: businessRef(c),
    offers: [
      offer(t.price, '2026-01-01', '2026-12-31'),
      ...(t.price2027 ? [offer(t.price2027, '2027-01-01', '2027-12-31')] : []),
    ],
  }
}

const AVAILABILITY: Record<string, string> = {
  open: 'https://schema.org/InStock',
  few: 'https://schema.org/LimitedAvailability',
  full: 'https://schema.org/SoldOut',
}

function departureEvents(t: LongTourX, lang: Lang, rows: DepartureRow[]): object[] {
  const tourUrl = abs(routePath({ kind: 'tour', id: t.id }, lang))
  const name = t.name[lang] || t.name.en
  return rows.map((d) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${name}, ${formatRange(d.start, d.end, lang, true)}`,
    description: tourHead(t, lang).description,
    startDate: d.start,
    endDate: d.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: lang,
    image: cardImage(t.pic.src).url,
    location: {
      '@type': 'Place',
      name: `${BIZ.name}, ${BIZ.street}`,
      address: { '@type': 'PostalAddress', streetAddress: BIZ.street, addressLocality: BIZ.locality, postalCode: BIZ.postal, addressCountry: BIZ.country },
      geo: { '@type': 'GeoCoordinates', latitude: BIZ.lat, longitude: BIZ.lon },
    },
    organizer: { '@id': BIZ_ID },
    offers: {
      '@type': 'Offer',
      price: t.priceEur,
      priceCurrency: 'EUR',
      availability: AVAILABILITY[d.status] ?? AVAILABILITY.open,
      url: tourUrl,
    },
    ...(d.note?.[lang] ? { disambiguatingDescription: d.note[lang] } : {}),
  }))
}

function tourTrip(c: SiteContent, t: LongTourX, lang: Lang, rows: DepartureRow[]): object {
  const url = abs(routePath({ kind: 'tour', id: t.id }, lang))
  const anyOpen = rows.some((d) => d.status === 'open' || d.status === 'few')
  const days = t.itinerary?.days ?? []
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: t.name[lang] || t.name.en,
    description: tourHead(t, lang).description,
    url,
    image: cardImage(t.pic.src).url,
    touristType: tri(lang, 'Hestaferð', 'Horse riding', 'Reiten'),
    inLanguage: lang,
    provider: businessRef(c),
    ...(days.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: days.length,
            itemListElement: days.map((d) => ({
              '@type': 'ListItem',
              position: d.n,
              name: tri(lang, `Dagur ${d.n}`, `Day ${d.n}`, `Tag ${d.n}`),
              description: d.body[lang] || d.body.en,
            })),
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: t.priceEur,
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: t.priceEur,
        priceCurrency: 'EUR',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'person' },
      },
      availability: rows.length ? (anyOpen ? AVAILABILITY.open : AVAILABILITY.full) : 'https://schema.org/PreOrder',
      url,
    },
  }
}

function schedulePage(lang: Lang, name: string, description: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${abs(routePath({ kind: 'schedule' }, lang))}#page`,
    name,
    description,
    url: abs(routePath({ kind: 'schedule' }, lang)),
    inLanguage: lang,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': BIZ_ID },
  }
}

/* ── the head of one page ──────────────────────────────────────────────── */
export function buildHead(c: SiteContent, route: PhRoute, lang: Lang, today: string): HeadModel {
  let title = ''
  let description = ''
  let image = cardImage(c.PICS.hero.src)
  let imageAlt = tri(lang, 'Íslensk hross á haga við Eyjafjörð', 'Icelandic horses on a pasture by Eyjafjörður', 'Islandpferde auf der Weide am Eyjafjörður')
  const ld: object[] = []

  if (route.kind === 'home') {
    const h = homeHead(lang)
    title = h.title
    description = h.description
    ld.push(business(c, lang), website())
    for (const set of ['short', 'long'] as const) {
      const f = faqPage(c.GTK, set, lang)
      if (f) ld.push(f)
    }
  } else if (route.kind === 'schedule') {
    const h = scheduleHead(lang)
    title = h.title
    description = h.description
    ld.push(schedulePage(lang, title, description), breadcrumb(route, lang, tri(lang, 'Dagskrá og dagsetningar', 'Schedule and dates', 'Termine und Daten')))
    for (const t of c.LONG_TOURS) ld.push(...departureEvents(t, lang, upcoming(t, today)))
  } else if (route.kind === 'ride') {
    const t = c.SHORT_TOURS.find((x) => x.id === route.id)
    if (!t) throw new Error(`no short tour "${route.id}" in the CMS content`)
    const h = rideHead(t, c.CHILD_DISCOUNT, lang)
    title = h.title
    description = h.description
    image = cardImage(t.pic.src)
    imageAlt = t.pic.alt && lang === 'is' ? t.pic.alt : `${t.name[lang] || t.name.en}`
    ld.push(rideTrip(c, t, lang, description), breadcrumb(route, lang, t.name[lang] || t.name.en))
  } else {
    const t = c.LONG_TOURS.find((x) => x.id === route.id)
    if (!t) throw new Error(`no active long tour "${route.id}" in the CMS content`)
    const rows = upcoming(t, today)
    const h = tourHead(t, lang)
    title = h.title
    description = h.description
    image = cardImage(t.pic.src)
    imageAlt = t.pic.alt && lang === 'is' ? t.pic.alt : `${t.name[lang] || t.name.en}`
    ld.push(tourTrip(c, t, lang, rows), breadcrumb(route, lang, t.name[lang] || t.name.en), ...departureEvents(t, lang, rows))
  }

  const alternates = [
    ...LANGS.map((l) => ({ hreflang: l, href: abs(routePath(route, l)) })),
    { hreflang: 'x-default', href: abs(routePath(route, DEFAULT_LANG)) },
  ]
  return {
    lang,
    route,
    title,
    description,
    canonical: abs(routePath(route, lang)),
    robots: INDEXABLE ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, nofollow',
    alternates,
    ogLocale: OG_LOCALE[lang],
    ogLocaleAlternate: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    ogImage: { ...image, alt: imageAlt },
    jsonLd: ld,
  }
}

/* ── serialisation ─────────────────────────────────────────────────────── */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The head elements for one page, as the HTML that goes between <head> and </head>. */
export function headToHtml(h: HeadModel): string {
  const lines = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${h.canonical}" />`,
    `<meta name="robots" content="${h.robots}" />`,
    ...h.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(BIZ.name)}" />`,
    `<meta property="og:locale" content="${h.ogLocale}" />`,
    ...h.ogLocaleAlternate.map((l) => `<meta property="og:locale:alternate" content="${l}" />`),
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${h.canonical}" />`,
    `<meta property="og:image" content="${esc(h.ogImage.url)}" />`,
    `<meta property="og:image:width" content="${h.ogImage.width}" />`,
    `<meta property="og:image:height" content="${h.ogImage.height}" />`,
    `<meta property="og:image:alt" content="${esc(h.ogImage.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${esc(h.ogImage.url)}" />`,
    `<meta name="twitter:image:alt" content="${esc(h.ogImage.alt)}" />`,
    `<meta name="geo.region" content="IS-6" />`,
    `<meta name="geo.placename" content="${BIZ.locality}" />`,
    `<meta name="geo.position" content="${BIZ.lat};${BIZ.lon}" />`,
    `<meta name="ICBM" content="${BIZ.lat}, ${BIZ.lon}" />`,
    ...h.jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ]
  return lines.map((l) => `    ${l}`).join('\n')
}

/* ── llms.txt ──────────────────────────────────────────────────────────── */
/** Plain-language facts for answer engines, from the same content as the pages. */
export function llmsTxt(c: SiteContent, today: string): string {
  const en = (l: L3) => l.en || l.is
  const rides = c.SHORT_TOURS.map((t) => {
    const price27 = t.price2027 ? `, ${num(t.price2027, 'en')} ISK from 1 January 2027` : ''
    const page = abs(routePath({ kind: 'ride', id: t.id }, 'en'))
    return `- [${en(t.name)}](${page}): ${t.meta.en}. From age ${t.minAge}. ${num(t.price, 'en')} ISK per person in 2026${price27}; children 12 and under pay ${num(c.CHILD_DISCOUNT, 'en')} ISK less.`
  }).join('\n')
  const tours = c.LONG_TOURS.map((t) => {
    const rows = upcoming(t, today)
    const dates = rows.length
      ? rows.map((d) => `${formatRange(d.start, d.end, 'en', true)}${d.status === 'full' ? ' (fully booked)' : d.status === 'few' ? ' (few places left)' : ''}`).join('; ')
      : en(t.datesNote ?? { is: '', en: 'next departures not published yet', de: '' })
    const page = abs(routePath({ kind: 'tour', id: t.id }, 'en'))
    return `- [${en(t.name)}](${page}): ${t.days} days, ${t.ridingDays} riding days, ${t.kmMin}–${t.kmMax} km a day, from age ${t.minAge}. ${num(t.priceEur, 'en')} EUR per person. Departures: ${dates}.`
  }).join('\n')
  const faq = (set: 'short' | 'long') => faqEntries(c.GTK, set, 'en').map((e) => `- ${e.question} ${e.answer}`).join('\n')
  const day = rideDay(c)
  // months the published long-tour departures cover, from the CMS dates
  const months = c.LONG_TOURS.flatMap((t) => upcoming(t, today)).flatMap((d) => [Number(d.start.slice(5, 7)), Number(d.end.slice(5, 7))])
  const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const season = months.length ? `${MONTH_EN[Math.min(...months) - 1]} to ${MONTH_EN[Math.max(...months) - 1]}` : 'summer'
  return `# ${BIZ.name}

> Family-run horse riding farm at Grýtubakki by Eyjafjörður in North Iceland, near Akureyri. Short rides from one hour and multi-day tours on Icelandic horses, since ${BIZ.founded}.
> Fjölskyldurekin hestaleiga á Grýtubakka við Eyjafjörð, nálægt Akureyri. Stuttir reiðtúrar og margra daga ferðir á íslenskum hestum frá ${BIZ.founded}.
> Familiengeführter Reitbetrieb am Hof Grýtubakki am Eyjafjörður bei Akureyri: kurze Ausritte und mehrtägige Touren auf Islandpferden seit ${BIZ.founded}.

## Facts
- Address: ${BIZ.street}, ${BIZ.postal} ${BIZ.locality}, Iceland (${BIZ.lat}, ${BIZ.lon}). About 30 minutes by car from Akureyri.
- Phone: ${c.PHONE_DISPLAY}. Email: ${c.EMAIL}.
- Languages of the site: Icelandic (${homeUrl('is')}), English (${homeUrl('en')}), German (${homeUrl('de')}).
- Licensed travel agency, Icelandic Tourist Board licence no. ${BIZ.licence}.
- About ${c.STATS.horses} horses; Tripadvisor rating ${String(c.STATS.rating).replace(',', '.')} from ${c.STATS.reviews} reviews.
- Short rides run all year, every day${day ? ` (departure times published from ${day.first} to ${day.last})` : ''}; each ride has its own season. The long tours run ${season} on published dates.
- Maximum rider weight 95 kg.
- Booking: a request form on the website, by email or by phone. No payment is taken online.

## Short rides (ISK, per person)
${rides}

## Long tours (EUR, per person, lodging and full board included)
${tours}

## Questions: short rides
${faq('short')}

## Questions: long tours
${faq('long')}

## Pages
- [Home](${homeUrl('en')}) · [Schedule and dates](${abs(routePath({ kind: 'schedule' }, 'en'))})
- Icelandic: [Forsíða](${homeUrl('is')}) · German: [Startseite](${homeUrl('de')})
`
}
