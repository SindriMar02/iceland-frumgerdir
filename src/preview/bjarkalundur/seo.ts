/**
 * The head of every Bjarkalundur route, in one place: title, description,
 * canonical, the language pair, Open Graph and structured data.
 *
 * The SAME function feeds both homes: the catalogue preview applies it at
 * runtime (Page.tsx), and the standalone prerender (tools/bjarkalundur-prerender.mjs)
 * imports it from the server bundle and writes it into each route's HTML, so
 * the head a crawler reads and the head a visitor's browser keeps can never
 * disagree.
 *
 * Rules applied (studio SEO-GEO-AEO master, build standard v2):
 *  - titles ≤55 characters, brand + place + category;
 *  - hreflang is/en plus x-default → English, in the head only (not also in
 *    the sitemap);
 *  - `max-image-preview:large`;
 *  - Hotel (staffed) with address, geo to 5 decimals, amenities, check-in/out,
 *    sameAs only to profiles verified as this hotel's;
 *  - NO Review or AggregateRating about the hotel on its own site (the
 *    self-serving review rule): quotes stay HTML, platform scores are linked.
 *  - No FAQPage markup: FAQ rich results are gone; the answers ship as native
 *    <details> in the HTML, which every crawler reads.
 */
import { COPY } from './copy'
import { ADDRESS, BOOKING_COM, EMAIL, GEO, IMG, MAP_LINK, PHONE_INTL, ROOMS, TRIPADVISOR } from './data'
import { LANGS, pathFor, roomHref, STANDALONE } from './paths'
import type { Lang, PageKey } from './paths'

export type Head = {
  lang: Lang
  title: string
  description: string
  canonical: string | null
  alternates: { hreflang: string; href: string }[]
  og: Record<string, string>
  robots: string
  jsonld: object
}

const abs = (origin: string, path: string) => (origin ? `${origin}${path}` : path)

function hotelNode(origin: string, lang: Lang) {
  const t = COPY[lang]
  const f = (is: string, en: string) => ({ '@type': 'LocationFeatureSpecification', name: lang === 'is' ? is : en, value: true })
  return {
    '@type': 'Hotel',
    '@id': `${origin}/#hotel`,
    name: 'Hótel Bjarkalundur',
    alternateName: ['Hotel Bjarkalundur', 'Bjarkalundur'],
    description: t.meta.home.description,
    url: abs(origin, pathFor(lang, 'home')),
    telephone: PHONE_INTL,
    email: EMAIL,
    foundingDate: '1947',
    image: [abs(origin, IMG.heroPoster.src), abs(origin, IMG.valley.src), abs(origin, IMG.dining.src)],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bjarkalundi',
      postalCode: '381',
      addressLocality: 'Reykhólahreppur',
      addressRegion: 'Vestfirðir',
      addressCountry: 'IS',
    },
    geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
    hasMap: MAP_LINK,
    checkinTime: '15:00',
    checkoutTime: '11:00',
    amenityFeature: [
      f('Þráðlaust net', 'Free Wi-Fi'),
      f('Bílastæði', 'Free parking'),
      f('Veitingastaður', 'Restaurant'),
      f('Hleðslustöð fyrir rafbíla', 'EV charging station'),
      f('Tjaldsvæði', 'Campsite'),
      f('Leiksvæði fyrir börn', 'Playground'),
    ],
    sameAs: [TRIPADVISOR, BOOKING_COM],
  }
}

function crumbs(origin: string, lang: Lang, page: PageKey) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hótel Bjarkalundur', item: abs(origin, pathFor(lang, 'home')) },
      { '@type': 'ListItem', position: 2, name: COPY[lang].meta[page].title.split(' | ')[0], item: abs(origin, pathFor(lang, page)) },
    ],
  }
}

export function jsonLdFor(lang: Lang, page: PageKey, origin: string) {
  const t = COPY[lang]
  const graph: object[] = [hotelNode(origin, lang)]
  if (page === 'home') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: abs(origin, pathFor(lang, 'home')),
      name: 'Hótel Bjarkalundur',
      alternateName: ['Hotel Bjarkalundur', 'Bjarkalundur'],
      inLanguage: lang,
      publisher: { '@id': `${origin}/#hotel` },
    })
    graph.push({
      '@type': 'Restaurant',
      '@id': `${origin}/#restaurant`,
      name: lang === 'is' ? 'Veitingastaðurinn í Bjarkalundi' : 'Bjarkalundur restaurant',
      containedInPlace: { '@id': `${origin}/#hotel` },
      address: ADDRESS,
      telephone: PHONE_INTL,
      acceptsReservations: false,
    })
  }
  if (page === 'rooms') {
    for (const r of ROOMS) {
      const c = t.rooms[r.id]
      graph.push({
        '@type': 'HotelRoom',
        name: c.name,
        description: c.text,
        url: abs(origin, roomHref(lang, r.id)),
        floorSize: { '@type': 'QuantitativeValue', value: r.size, unitCode: 'MTK' },
        occupancy: { '@type': 'QuantitativeValue', maxValue: r.maxGuests },
        amenityFeature: [
          ...(r.privateBath ? [{ '@type': 'LocationFeatureSpecification', name: lang === 'is' ? 'Sérbaðherbergi' : 'Private bathroom', value: true }] : []),
          ...(r.kitchen ? [{ '@type': 'LocationFeatureSpecification', name: lang === 'is' ? 'Eldhúskrókur' : 'Kitchenette', value: true }] : []),
        ],
        containedInPlace: { '@id': `${origin}/#hotel` },
      })
    }
  }
  if (page === 'campsite') {
    const f = (is: string, en: string) => ({ '@type': 'LocationFeatureSpecification', name: lang === 'is' ? is : en, value: true })
    graph.push({
      '@type': 'Campground',
      '@id': `${origin}/#campsite`,
      name: lang === 'is' ? 'Tjaldsvæðið í Bjarkalundi' : 'Bjarkalundur campsite',
      description: t.meta.campsite.description,
      url: abs(origin, pathFor(lang, 'campsite')),
      image: [abs(origin, IMG.campTables.src), abs(origin, IMG.campGrass.src)],
      address: { '@type': 'PostalAddress', streetAddress: 'Bjarkalundi', postalCode: '381', addressLocality: 'Reykhólahreppur', addressCountry: 'IS' },
      geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
      telephone: PHONE_INTL,
      priceRange: lang === 'is' ? '1.500 kr. á mann, nóttin' : 'ISK 1,500 per person per night',
      amenityFeature: [f('Salerni', 'Toilets'), f('Sturtur', 'Showers'), f('Rafmagn', 'Electricity'), f('Leiksvæði fyrir börn', 'Playground')],
      containedInPlace: { '@id': `${origin}/#hotel` },
    })
  }
  if (page !== 'home') graph.push(crumbs(origin, lang, page))
  return { '@context': 'https://schema.org', '@graph': graph }
}

/** origin: the live site's origin in the standalone build, '' in the catalogue. */
export function headFor(lang: Lang, page: PageKey, origin: string): Head {
  const m = COPY[lang].meta[page]
  const url = abs(origin, pathFor(lang, page))
  const image = abs(origin, page === 'campsite' ? IMG.campTables.src : IMG.heroPoster.src)
  return {
    lang,
    title: m.title,
    description: m.description,
    canonical: origin ? url : null,
    alternates: [
      ...LANGS.map((l) => ({ hreflang: l, href: abs(origin, pathFor(l, page)) })),
      { hreflang: 'x-default', href: abs(origin, pathFor('en', page)) },
    ],
    og: {
      'og:type': 'website',
      'og:site_name': 'Hótel Bjarkalundur',
      'og:title': m.title,
      'og:description': m.description,
      'og:url': url,
      'og:image': image,
      'og:locale': lang === 'is' ? 'is_IS' : 'en_GB',
      'og:locale:alternate': lang === 'is' ? 'en_GB' : 'is_IS',
    },
    robots: 'max-image-preview:large',
    jsonld: jsonLdFor(lang, page, origin),
  }
}

/** Head tags as HTML, for the prerender. */
export function headHtml(h: Head): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}">`,
    `<meta name="robots" content="${h.robots}">`,
    h.canonical ? `<link rel="canonical" href="${esc(h.canonical)}">` : '',
    ...h.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}">`),
    ...Object.entries(h.og).map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json" data-bj-head>${JSON.stringify(h.jsonld).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ')
}

/** Client side: swap the head for the current route (both homes). */
export function applyHead(h: Head) {
  if (typeof document === 'undefined') return
  document.title = h.title
  const set = (sel: string, make: () => HTMLElement, attr: string, val: string) => {
    let el = document.head.querySelector<HTMLElement>(sel)
    if (!el) { el = make(); document.head.appendChild(el) }
    el.setAttribute(attr, val)
  }
  set('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', h.description)
  /* the prerendered tags carry no marker, so everything of these kinds goes, the
     robots meta excepted (the catalogue's noindex must survive) */
  document.head.querySelectorAll('link[hreflang],link[rel="canonical"],meta[property^="og:"],meta[name="twitter:card"],script[type="application/ld+json"]').forEach((n) => n.remove())
  const add = (el: HTMLElement) => { el.setAttribute('data-bj', ''); document.head.appendChild(el) }
  if (h.canonical && STANDALONE) { const l = document.createElement('link'); l.rel = 'canonical'; l.href = h.canonical; add(l) }
  for (const a of h.alternates) { const l = document.createElement('link'); l.rel = 'alternate'; l.hreflang = a.hreflang; l.href = a.href; add(l) }
  for (const [k, v] of Object.entries(h.og)) { const m = document.createElement('meta'); m.setAttribute('property', k); m.content = v; add(m) }
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-bj', ''); s.textContent = JSON.stringify(h.jsonld); document.head.appendChild(s)
}

/** Catalogue only: take our tags away again when the preview unmounts. */
export function clearHead() {
  if (typeof document === 'undefined') return
  document.head.querySelectorAll('[data-bj]').forEach((n) => n.remove())
}
