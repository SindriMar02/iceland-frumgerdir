/**
 * Where the Reynir pages live — the ONE place that knows.
 *
 * This site exists in two homes:
 *
 *   CATALOGUE  the internal preview SPA, mounted at /preview/reynir alongside
 *              a hundred other prototypes, sharing the catalogue's shell.
 *   STANDALONE the client's own deployment (reynirbakari.is): its own Vite
 *              entry, its own index.html, clean root paths — /, /panta,
 *              /sagan, /personuvernd — and NOTHING of the catalogue in the
 *              bundle.
 *
 * Every internal link and route registration derives from here. The recurring
 * class of bug this kills: paths hardcoded as '/preview/reynir/…' scattered
 * through components, each one a landmine for the day the site moves to its
 * own domain.
 *
 * VITE_REYNIR_STANDALONE is baked at build time by vite.reynir.config.ts, so
 * the check below is a compile-time constant: in the standalone build the
 * catalogue branch of everything gated on it is dead code and Rollup drops
 * it — including the preview chrome and the private company catalogue it
 * imports. Separation enforced by the bundler, not by discipline.
 */
export const STANDALONE = import.meta.env.VITE_REYNIR_STANDALONE === '1'

const PREFIX = STANDALONE ? '' : '/preview/reynir'

export const HOME_PATH = STANDALONE ? '/' : '/preview/reynir'
export const ORDER_PATH = `${PREFIX}/panta`
export const STORY_PATH = `${PREFIX}/sagan`
export const LEGAL_PATH = `${PREFIX}/personuvernd`

/* ── Language lives in the URL ──────────────────────────────────────────────
 *
 * Icelandic keeps the clean paths — /, /panta, /sagan, /personuvernd — because
 * it is the default and those are the URLs already shared. English gets its
 * own set under /en.
 *
 * WHY, when a toggle already switched the copy: a toggle cannot rank. Both
 * languages lived at one address, so there was exactly one page for Google to
 * index, in one language, and nothing to hand an English searcher. The site
 * declared an English alternate in its Open Graph tags that did not exist.
 * Separate URLs plus hreflang is the only arrangement search engines can act
 * on, and it makes the choice linkable: an English page can now be sent to
 * someone as an English page.
 *
 * It also removes a whole class of bug. The language used to be React state
 * restored from localStorage after mount, which meant the server rendered one
 * language and the browser could swap to another a tick later. Now the URL is
 * the single source of truth, identical on both sides of hydration.
 */
import type { Lang } from './data'

/** English lives under this segment; Icelandic has no segment of its own. */
const EN_SEG = 'en'
const EN_PREFIX = `${PREFIX}/${EN_SEG}`

export const EN_HOME_PATH = STANDALONE ? '/en' : '/preview/reynir/en'
export const EN_ORDER_PATH = `${EN_PREFIX}/panta`
export const EN_STORY_PATH = `${EN_PREFIX}/sagan`
export const EN_LEGAL_PATH = `${EN_PREFIX}/personuvernd`

/** Every route, in both languages, in one place. */
export const ROUTES = {
  home: { is: HOME_PATH, en: EN_HOME_PATH },
  order: { is: ORDER_PATH, en: EN_ORDER_PATH },
  story: { is: STORY_PATH, en: EN_STORY_PATH },
  legal: { is: LEGAL_PATH, en: EN_LEGAL_PATH },
} as const

export type RouteKey = keyof typeof ROUTES

/** The four links a page needs, already in the reader's language. */
export function pathsFor(lang: Lang) {
  return {
    home: ROUTES.home[lang],
    order: ROUTES.order[lang],
    story: ROUTES.story[lang],
    legal: ROUTES.legal[lang],
  }
}

/** Which language a pathname is in. Anything not under /en is Icelandic —
 *  including an unknown path, which the catch-all route renders as the
 *  Icelandic home page. */
export function langFromPath(pathname: string): Lang {
  const rest = pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : pathname
  return rest === `/${EN_SEG}` || rest.startsWith(`/${EN_SEG}/`) ? 'en' : 'is'
}

/** The same page in the other language. Used by the language toggle, so a
 *  reader switching language stays on the page they were reading rather than
 *  being sent home. */
export function swapLang(pathname: string, to: Lang): string {
  const from: Lang = langFromPath(pathname)
  if (from === to) return pathname
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    if (ROUTES[key][from] === pathname) return ROUTES[key][to]
  }
  return ROUTES.home[to]
}
