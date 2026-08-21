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
