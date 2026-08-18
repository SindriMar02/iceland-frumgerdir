/**
 * Where Katrín's pages live — the ONE place that knows.
 *
 * Two homes, as with every client build here:
 *   CATALOGUE   the internal preview SPA at /preview/katrinisfeld
 *   STANDALONE  her own deployment at katrinisfeld.is, clean root paths
 *
 * VITE_KATRIN_STANDALONE is baked at build time by vite.katrin.config.ts, so
 * STANDALONE is a compile-time constant and Rollup drops the catalogue branch
 * of everything gated on it — including the preview chrome and the private
 * prospect catalogue it imports. Separation enforced by the bundler.
 */
import { CATEGORIES, PROJECTS, hasPage, type CategorySlug } from './projects'

export const STANDALONE = import.meta.env.VITE_KATRIN_STANDALONE === '1'

const PREFIX = STANDALONE ? '' : '/preview/katrinisfeld'

export const HOME = STANDALONE ? '/' : '/preview/katrinisfeld'
export const WORK = `${PREFIX}/verkefni`
export const category = (c: CategorySlug) => `${PREFIX}/verkefni/${c}`
export const project = (slug: string) => `${PREFIX}/verkefni/${slug}`
export const BRANDS_PATH = `${PREFIX}/italskar-innrettingar`
export const STUDIO_PATH = `${PREFIX}/studioid`
export const CONTACT_PATH = `${PREFIX}/hafa-samband`
export const EN_PATH = `${PREFIX}/en`

/** Every route this site has, in sitemap order. `clean` is the path on her own
 *  domain, which is what canonicals, the sitemap and the prerenderer use. */
export interface RouteDef { clean: string; kind: 'home' | 'work' | 'category' | 'project' | 'brands' | 'studio' | 'contact' | 'en'; key?: string }

export const ROUTES: RouteDef[] = [
  { clean: '/', kind: 'home' },
  { clean: '/verkefni', kind: 'work' },
  ...(Object.keys(CATEGORIES) as CategorySlug[])
    .filter((c) => c !== 'ymislegt')
    .map((c): RouteDef => ({ clean: `/verkefni/${c}`, kind: 'category', key: c })),
  ...PROJECTS.filter(hasPage).map((p): RouteDef => ({ clean: `/verkefni/${p.slug}`, kind: 'project', key: p.slug })),
  { clean: '/italskar-innrettingar', kind: 'brands' },
  { clean: '/studioid', kind: 'studio' },
  { clean: '/hafa-samband', kind: 'contact' },
  { clean: '/en', kind: 'en' },
]

/** The catalogue path for a clean path — the preview build's route table. */
export const routed = (clean: string) => (clean === '/' ? HOME : `${PREFIX}${clean}`)
