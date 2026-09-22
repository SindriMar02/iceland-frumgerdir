/**
 * Where the Nýpugarðar pages live: the ONE place that knows.
 *
 * Two homes, one code base:
 *
 *   CATALOGUE   the internal preview SPA at /preview/nypugardar, sharing the
 *               catalogue's shell with a hundred other prototypes. One route
 *               per page, the language is a toggle remembered in the browser.
 *   STANDALONE  the client's own deployment (glacierview.is): its own Vite
 *               entry, its own shell, clean root paths, and a URL per
 *               language, because a page that only exists in English at one
 *               address cannot rank for Icelandic searches and cannot carry
 *               hreflang. English is the default for a foreign-guest farm
 *               (see copy.ts); Icelandic lives under /is/.
 *
 * VITE_NYPUGARDAR_STANDALONE is baked at build time by
 * vite.nypugardar.config.ts, so STANDALONE is a compile-time constant and the
 * catalogue branch of everything gated on it is dead code that Rollup drops,
 * including the preview chrome and the private company brief it imports.
 */
import type { Lang } from './copy'

export const STANDALONE = import.meta.env.VITE_NYPUGARDAR_STANDALONE === '1'

const CATALOGUE_HOME = '/preview/nypugardar'
const CATALOGUE_ROOMS = '/preview/nypugardar/herbergi'

export function homePath(lang: Lang): string {
  if (!STANDALONE) return CATALOGUE_HOME
  return lang === 'is' ? '/is/' : '/'
}

/* Links carry the trailing slash because the canonical, the sitemap and the
   server all do: /rooms answers 308 to /rooms/. Linking the slashless form
   sent every internal click through a redirect and kept feeding Google the
   slashless URL, which it indexed as a second copy of each page. */
export function roomsPath(lang: Lang): string {
  if (!STANDALONE) return CATALOGUE_ROOMS
  return lang === 'is' ? '/is/herbergi/' : '/rooms/'
}

export function winterPath(lang: Lang): string {
  if (!STANDALONE) return '/preview/nypugardar/vetur'
  return lang === 'is' ? '/is/vetur/' : '/winter/'
}

export function privacyPath(lang: Lang): string {
  if (!STANDALONE) return '/preview/nypugardar/personuvernd'
  return lang === 'is' ? '/is/personuvernd/' : '/privacy/'
}

/** The language a standalone URL is in. Null in the catalogue, where the
 *  route carries no language and the toggle decides. */
export function langFromPath(pathname: string): Lang | null {
  if (!STANDALONE) return null
  return pathname === '/is' || pathname.startsWith('/is/') ? 'is' : 'en'
}

/** The same page in the other language, hash and all. */
export function counterpart(pathname: string, hash: string, to: Lang): string {
  if (/\/(privacy|personuvernd)\/?$/.test(pathname)) return privacyPath(to)
  if (/\/(winter|vetur)\/?$/.test(pathname)) return winterPath(to)
  const isRooms = /\/(rooms|herbergi)\/?$/.test(pathname)
  return (isRooms ? roomsPath(to) : homePath(to)) + (hash || '')
}

/** Every route the standalone prerender walks. Kept beside the paths that
 *  define them so a new page cannot ship unprerendered. */
/**
 * The <title> of every standalone route, the SAME eight strings the SEO
 * injector (tools/nypugardar-seo.mjs) writes into the prerendered HTML. The
 * browser needs them too: a client-side route change (the language switch,
 * the rooms link) keeps the previous page's title unless someone sets it, and
 * a page that set its own catalogue title used to overwrite the injected one
 * on hydration. Change both places together; the audit of 2026-09-18 found
 * them apart.
 */
export const STANDALONE_TITLES: Record<string, string> = {
  '/': 'Nýpugarðar | Farm guesthouse between Höfn and Jökulsárlón',
  '/rooms': 'Rooms, cottages and prices | Nýpugarðar',
  '/winter': 'Winter at Nýpugarðar | Daylight, roads and northern lights',
  '/privacy': 'Privacy | Nýpugarðar',
  '/is': 'Nýpugarðar | Sveitagisting milli Hafnar og Jökulsárlóns',
  '/is/herbergi': 'Herbergi, sumarhús og verð | Nýpugarðar',
  '/is/vetur': 'Veturinn á Nýpugörðum | Birta, færð og norðurljós',
  '/is/personuvernd': 'Persónuvernd | Nýpugarðar',
}

export function standaloneTitle(pathname: string): string {
  const key = pathname.replace(/\/+$/, '') || '/'
  return STANDALONE_TITLES[key] ?? STANDALONE_TITLES[key === '/herbergi' ? '/rooms' : '/']
}

export const PRERENDER_ROUTES = ['/', '/rooms', '/winter', '/privacy', '/is/', '/is/herbergi', '/is/vetur', '/is/personuvernd'] as const
