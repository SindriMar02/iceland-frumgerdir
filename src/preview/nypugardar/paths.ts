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

export function roomsPath(lang: Lang): string {
  if (!STANDALONE) return CATALOGUE_ROOMS
  return lang === 'is' ? '/is/herbergi' : '/rooms'
}

/** The language a standalone URL is in. Null in the catalogue, where the
 *  route carries no language and the toggle decides. */
export function langFromPath(pathname: string): Lang | null {
  if (!STANDALONE) return null
  return pathname === '/is' || pathname.startsWith('/is/') ? 'is' : 'en'
}

/** The same page in the other language, hash and all. */
export function counterpart(pathname: string, hash: string, to: Lang): string {
  const isRooms = /\/(rooms|herbergi)\/?$/.test(pathname)
  return (isRooms ? roomsPath(to) : homePath(to)) + (hash || '')
}

/** Every route the standalone prerender walks. Kept beside the paths that
 *  define them so a new page cannot ship unprerendered. */
export const PRERENDER_ROUTES = ['/', '/rooms', '/is/', '/is/herbergi'] as const
