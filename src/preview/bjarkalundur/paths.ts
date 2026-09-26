/**
 * Where the Bjarkalundur pages live: the ONE place that knows.
 *
 * Two homes, one code base:
 *   CATALOGUE   /preview/bjarkalundur/* inside the prototype catalogue (noindex).
 *   STANDALONE  the hotel's own deployment (hotelbjarkalundur.is): own Vite entry,
 *               clean root paths, trailing slashes (Cloudflare Pages answers
 *               /gisting with a 308 to /gisting/, so links carry the slash).
 *
 * In BOTH homes every language has its own URL: Icelandic at the root, English
 * under /en. A page that only exists in one language at one address cannot rank
 * for searches in the other and cannot carry hreflang
 * ([[multilingual-seo-separate-urls]]), and the preview behaves exactly like the
 * launched site instead of faking it with a toggle.
 *
 * VITE_BJARKALUNDUR_STANDALONE is baked by vite.bjarkalundur.config.ts, so the
 * catalogue branch is dead code in the standalone bundle.
 */
export type Lang = 'is' | 'en'
export type PageKey = 'home' | 'rooms' | 'reviews' | 'campsite'
export type SectionKey = 'surroundings' | 'stay' | 'food' | 'reviews' | 'history' | 'faq' | 'contact' | 'booking'

export const STANDALONE = import.meta.env.VITE_BJARKALUNDUR_STANDALONE === '1'
export const BASE = STANDALONE ? '' : '/preview/bjarkalundur'
export const LANGS: Lang[] = ['is', 'en']

const SLUG: Record<PageKey, Record<Lang, string>> = {
  home: { is: '', en: '' },
  rooms: { is: 'gisting', en: 'rooms' },
  reviews: { is: 'umsagnir', en: 'reviews' },
  campsite: { is: 'tjaldsvaedi', en: 'campsite' },
}

/** Section anchors on the home page, per language. */
export const SECTION: Record<SectionKey, Record<Lang, string>> = {
  surroundings: { is: 'umhverfid', en: 'surroundings' },
  stay: { is: 'gisting', en: 'stay' },
  food: { is: 'stofan', en: 'restaurant' },
  reviews: { is: 'umsagnir', en: 'reviews' },
  history: { is: 'sagan', en: 'history' },
  faq: { is: 'spurt-og-svarad', en: 'faq' },
  contact: { is: 'hafa-samband', en: 'contact' },
  booking: { is: 'boka', en: 'book' },
}

/** Room anchors on the rooms page, per language (ids are the Icelandic ones). */
export const ROOM_SLUG: Record<string, Record<Lang, string>> = {
  thaegindi: { is: 'thaegindi', en: 'comfort' },
  vaskur: { is: 'vaskur', en: 'standard' },
  einn: { is: 'einn', en: 'single' },
  'hus-eldhus': { is: 'hus-eldhus', en: 'cottage-kitchenette' },
  'hus-bad': { is: 'hus-bad', en: 'cottage-bathroom' },
  'hus-stort': { is: 'hus-stort', en: 'large-cottage' },
  'hus-litid': { is: 'hus-litid', en: 'small-cottage' },
  'hus-tveggja': { is: 'hus-tveggja', en: 'twin-cottage' },
}

export function pathFor(lang: Lang, page: PageKey): string {
  const segs = [lang === 'en' ? 'en' : '', SLUG[page][lang]].filter(Boolean)
  const p = `${BASE}${segs.length ? `/${segs.join('/')}` : ''}`
  if (STANDALONE) return `${p}/`
  return p || '/'
}

export const sectionHref = (lang: Lang, key: SectionKey) => `${pathFor(lang, 'home')}#${SECTION[key][lang]}`
export const roomHref = (lang: Lang, id: string) => `${pathFor(lang, 'rooms')}#${ROOM_SLUG[id]?.[lang] ?? id}`

/** Language and page of a pathname. Anything unknown under the base is home. */
export function parsePath(pathname: string): { lang: Lang; page: PageKey } {
  const rest = pathname.replace(/\/+$/, '').slice(BASE.length).replace(/^\//, '')
  const segs = rest ? rest.split('/') : []
  const lang: Lang = segs[0] === 'en' ? 'en' : 'is'
  if (lang === 'en') segs.shift()
  const slug = segs[0] ?? ''
  const page = (Object.keys(SLUG) as PageKey[]).find((k) => SLUG[k][lang] === slug) ?? 'home'
  return { lang, page }
}

/** The same place in the other language: page, section or room anchor and all. */
export function counterpart(pathname: string, hash: string, to: Lang): string {
  const { lang, page } = parsePath(pathname)
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  let next = ''
  if (id) {
    const sec = (Object.keys(SECTION) as SectionKey[]).find((k) => SECTION[k][lang] === id)
    const room = Object.keys(ROOM_SLUG).find((k) => ROOM_SLUG[k][lang] === id)
    if (sec) next = SECTION[sec][to]
    else if (room) next = ROOM_SLUG[room][to]
  }
  return `${pathFor(to, page)}${next ? `#${next}` : ''}`
}

/** Every route the standalone prerender walks and the sitemap lists. */
export const ROUTES: { lang: Lang; page: PageKey }[] = LANGS.flatMap((lang) =>
  (Object.keys(SLUG) as PageKey[]).map((page) => ({ lang, page })))
