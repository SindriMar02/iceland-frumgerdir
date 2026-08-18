/**
 * Katrín Ísfeld — the site's router.
 *
 * One entry, twenty-six routes, mounted the same way in both homes: under
 * /preview/katrinisfeld/* in the catalogue, and at / in her own build. The
 * paths themselves all come from paths.ts, so nothing here knows which home
 * it is in.
 *
 * /verkefni/:slug carries both the three category pages and the seventeen
 * project pages. They cannot be separate route patterns without one of them
 * shadowing the other, so the segment is resolved against the two known sets
 * and anything that matches neither falls through to the index rather than
 * rendering an empty page.
 */
import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { Home } from './Home'
import { WorkIndexPage, CategoryPage } from './WorkPage'
import { ProjectPage } from './ProjectPage'
import { BrandsPage } from './BrandsPage'
import { StudioPage } from './StudioPage'
import { ContactPage } from './ContactPage'
import { EnglishPage } from './EnglishPage'
import { CATEGORIES, PROJECTS, hasPage, type CategorySlug } from './projects'
import { WORK } from './paths'

const CATEGORY_SLUGS = new Set(Object.keys(CATEGORIES))
const PROJECT_SLUGS = new Set(PROJECTS.filter(hasPage).map((p) => p.slug))

function WorkChild() {
  const { slug = '' } = useParams()
  if (PROJECT_SLUGS.has(slug)) return <ProjectPage slug={slug} />
  if (CATEGORY_SLUGS.has(slug)) return <CategoryPage slug={slug as CategorySlug} />
  return <Navigate to={WORK} replace />
}

export default function KatrinIsfeldSite() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="verkefni" element={<WorkIndexPage />} />
      <Route path="verkefni/:slug" element={<WorkChild />} />
      <Route path="italskar-innrettingar" element={<BrandsPage />} />
      <Route path="studioid" element={<StudioPage />} />
      <Route path="hafa-samband" element={<ContactPage />} />
      <Route path="en" element={<EnglishPage />} />
      {/* a portfolio site has no useful 404: send strays to the front */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
