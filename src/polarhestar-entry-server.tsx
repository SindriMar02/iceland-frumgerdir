/**
 * Server entry for the Pólar Hestar prerender.
 *
 * renderToPipeableStream, NOT renderToString: the routes are React.lazy, and
 * renderToString does not wait for a lazy import. It renders the Suspense
 * fallback, which here is null, producing exactly the empty page this whole
 * exercise exists to fix, while appearing to succeed. onAllReady waits for
 * every lazy chunk before handing back the markup, so the client's code
 * splitting survives untouched.
 *
 * Besides render(), this module hands the build tools everything they need
 * about the site, computed from the same content the pages render (never
 * mirrored by hand): the list of pages with their <head>, llms.txt, and the
 * tours that used to exist and no longer do (for the redirects).
 */
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { PolarhestarApp } from './polarhestar-app'
import { BUILD_DAY, INITIAL_CONTENT } from './preview/polarhestar/sanity'
import { freezeToday, todayIso } from './preview/polarhestar/schedule'
import { LONG_TOURS, SHORT_TOURS } from './preview/polarhestar/data'
import { abs, allPages, buildHead, headToHtml, llmsTxt } from './preview/polarhestar/seo'
import { routePath, type PhRoute } from './preview/polarhestar/paths'
import type { Lang } from './preview/polarhestar/data'

if (!INITIAL_CONTENT || !BUILD_DAY) {
  throw new Error('polarhestar-entry-server: no CMS snapshot compiled in; run tools/polarhestar-standalone-snapshot.mjs first')
}
freezeToday(BUILD_DAY)
const content = INITIAL_CONTENT

export { BUILD_DAY }

export interface PageInfo {
  path: string
  lang: Lang
  route: PhRoute
  title: string
  description: string
  canonical: string
  headHtml: string
  /** schema.org @type of every JSON-LD block, for the checks */
  schemaTypes: string[]
  alternates: Array<{ hreflang: string; href: string }>
}

export const PAGES: PageInfo[] = allPages(content).map(({ lang, route }) => {
  const head = buildHead(content, route, lang, todayIso())
  return {
    path: routePath(route, lang),
    lang,
    route,
    title: head.title,
    description: head.description,
    canonical: head.canonical,
    headHtml: headToHtml(head),
    schemaTypes: head.jsonLd.map((o) => String((o as { '@type'?: unknown })['@type'])),
    alternates: head.alternates,
  }
})

export const PRERENDER_ROUTES = PAGES.map((p) => p.path)

/** llms.txt, from the same content */
export const LLMS_TXT = llmsTxt(content, todayIso())

/** Tours the site used to have and the CMS no longer publishes: they get a 301, not a soft 404. */
export const REMOVED = {
  tours: LONG_TOURS.filter((t) => !content.LONG_TOURS.some((c) => c.id === t.id)).map((t) => t.id),
  rides: SHORT_TOURS.filter((t) => !content.SHORT_TOURS.some((c) => c.id === t.id)).map((t) => t.id),
  /** ids that are live pages, for the old-URL map to check its targets against */
  liveTours: content.LONG_TOURS.map((t) => t.id),
  liveRides: content.SHORT_TOURS.map((t) => t.id),
}

export const SITEMAP_BASE = abs('')

/** The hero photograph, for the preload hint on the three home pages (it is the largest contentful paint). */
export const HERO = { src: content.PICS.hero.src, srcSet: content.PICS.hero.srcSet }

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString('utf8')
        cb()
      },
    })
    sink.on('finish', () => resolve(html))

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={path}>
        <PolarhestarApp />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(err) {
          reject(err)
        },
      },
    )

    /* A hung lazy import must fail the build, not hang it forever. */
    setTimeout(() => {
      abort()
      reject(new Error(`prerender of ${path} timed out after 30s`))
    }, 30_000).unref?.()
  })
}
