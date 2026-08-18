/**
 * The single export the build-time SEO tooling reads.
 *
 * tools/katrin-seo.mjs bundles this file with esbuild and imports it, rather
 * than restating the business in a second place. That matters more here than
 * it looks: the classic way a site ends up telling Google an opening time its
 * own page contradicts is a "just this once" copy of the facts into the build
 * script. There is no copy. There is this.
 */
import { STUDIO, CV, ADDRESS_LINE, BRANDS } from './facts'
import { CATEGORIES, PROJECTS, hasPage } from './projects'
import { FAQ, SERVICES, PROCESS, EN } from './content'

export { STUDIO, CV, ADDRESS_LINE, BRANDS, CATEGORIES, PROJECTS, FAQ, SERVICES, PROCESS, EN }
export const PHOTOGRAPHED = PROJECTS.filter(hasPage)

/** Old WordPress URL → new clean path. Every one of her published pages. */
export const REDIRECTS: Array<[string, string]> = [
  ['/verkefni', '/verkefni'],
  ['/verkefni/innanhusshonnun', '/verkefni/innanhusshonnun'],
  ['/verkefni/gistiheimili-hotel', '/verkefni/gistiheimili-og-hotel'],
  ['/verkefni/atvinnuhusnaedi', '/verkefni/atvinnuhusnaedi'],
  ['/verkefni/ymislegt', '/verkefni'],
  ['/studioid', '/studioid'],
  ['/hafa-samband', '/hafa-samband'],
  ['/italskar-innrettingar', '/italskar-innrettingar'],
  ['/italskar-innrettingar/innrettingar-eldhus', '/italskar-innrettingar#eldhus'],
  ['/italskar-innrettingar/innrettingar-bad', '/italskar-innrettingar#bad'],
  // her /instagram/ page was a feed embed; the real profile is the useful target
  ['/instagram', '/verkefni'],
  ...PROJECTS.map((p): [string, string] =>
    [p.oldPath.replace(/\/$/, ''), hasPage(p) ? `/verkefni/${p.slug}` : `/verkefni/${p.category}`]),
]
