/**
 * Pólar Hestar — where every page lives, in both builds.
 *
 *   catalogue preview   /preview/polarhestar[/dagskra | /reidtur/:id | /ferd/:id]
 *                       one URL for all three languages (chosen in the browser).
 *   STANDALONE          the client's own site at the domain root, one real URL per
 *                       language: Icelandic at the root, /en/ and /de/ under it.
 *
 *                       /                      /en/                      /de/
 *                       /dagskra/              /en/dagskra/              /de/dagskra/
 *                       /reidtur/fyrstu-kynni/ /en/reidtur/fyrstu-kynni/ /de/reidtur/...
 *                       /ferd/midnightsun/     /en/ferd/midnightsun/     /de/ferd/...
 *
 * Every link the pages draw comes from here, so the two builds cannot drift
 * and a language switch always lands on the same page in the other language.
 * Trailing slashes everywhere: the pages are served as folders
 * (en/dagskra/index.html), so the slash form is the canonical one.
 *
 * VITE_POLARHESTAR_STANDALONE is baked in by vite.polarhestar.config.ts, so
 * STANDALONE is a compile-time constant: the catalogue build keeps the preview
 * chrome and old paths, the client build drops them as dead code.
 */
import type { Lang } from './data'

export const STANDALONE = import.meta.env.VITE_POLARHESTAR_STANDALONE === '1'

/** The production origin, no trailing slash. Canonicals, hreflang and the sitemap are built on it. */
export const SITE_URL = (((import.meta.env.VITE_POLARHESTAR_SITE_URL as string | undefined) || 'https://polarhestar.is') as string).replace(/\/$/, '')
/** false only for a staging copy (POLARHESTAR_NOINDEX=1): robots meta noindex, Disallow: / */
export const INDEXABLE = import.meta.env.VITE_POLARHESTAR_NOINDEX !== '1'

export const LANGS: Lang[] = ['is', 'en', 'de']
/** Shown to a visitor whose language we do not offer, and in hreflang x-default. */
export const DEFAULT_LANG: Lang = 'en'

export type PhRoute =
  | { kind: 'home' }
  | { kind: 'schedule' }
  | { kind: 'ride'; id: string }
  | { kind: 'tour'; id: string }

const PREVIEW_HOME = '/preview/polarhestar'

/** '' for Icelandic, '/en' or '/de' otherwise. */
export const langPrefix = (lang: Lang) => (lang === 'is' ? '' : `/${lang}`)

/** The router path of a page in a language. Hash and query are the caller's. */
export function routePath(route: PhRoute, lang: Lang): string {
  if (!STANDALONE) {
    switch (route.kind) {
      case 'home': return PREVIEW_HOME
      case 'schedule': return `${PREVIEW_HOME}/dagskra`
      case 'ride': return `${PREVIEW_HOME}/reidtur/${route.id}`
      case 'tour': return `${PREVIEW_HOME}/ferd/${route.id}`
    }
  }
  const p = langPrefix(lang)
  switch (route.kind) {
    case 'home': return `${p}/`
    case 'schedule': return `${p}/dagskra/`
    case 'ride': return `${p}/reidtur/${route.id}/`
    case 'tour': return `${p}/ferd/${route.id}/`
  }
}

export const homePath = (lang: Lang, hash = '') => `${routePath({ kind: 'home' }, lang)}${hash}`
export const schedulePath = (lang: Lang, hash = '') => `${routePath({ kind: 'schedule' }, lang)}${hash}`
export const ridePath = (id: string, lang: Lang) => routePath({ kind: 'ride', id }, lang)
export const tourPath = (id: string, lang: Lang) => routePath({ kind: 'tour', id }, lang)
/** The booking form on the home page with one ride preselected. */
export const bookPath = (id: string, lang: Lang) => `${homePath(lang)}?ferd=${encodeURIComponent(id)}#boka`

/** A public file: logo, horses. Honors the catalogue's base path; '/' standalone. */
export const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`

/** For a plain <a href> (a router <Link to> takes the bare path): the catalogue is served under a base path. */
export const linkHref = (path: string) => (STANDALONE ? path : `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`)

/** Standalone pathname → page + language, or null (not a page of this site). */
export function parsePath(pathname: string): { lang: Lang; route: PhRoute } | null {
  const clean = pathname.replace(/\/+$/, '')
  const m = clean.match(/^\/(en|de)(\/.*)?$/)
  const lang: Lang = m ? (m[1] as Lang) : 'is'
  const rest = m ? m[2] ?? '' : clean
  if (rest === '') return { lang, route: { kind: 'home' } }
  if (rest === '/dagskra') return { lang, route: { kind: 'schedule' } }
  const r = rest.match(/^\/(reidtur|ferd)\/([a-z0-9-]+)$/)
  if (r) return { lang, route: { kind: r[1] === 'reidtur' ? 'ride' : 'tour', id: r[2] } }
  return null
}

/** The same page in another language, for the language switcher. */
export function switchLangPath(pathname: string, to: Lang): string | null {
  const here = parsePath(pathname)
  return here ? routePath(here.route, to) : null
}
