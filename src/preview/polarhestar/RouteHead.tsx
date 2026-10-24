/**
 * Pólar Hestar — keeps the document <head> in step with the page after a
 * navigation inside the app (STANDALONE only).
 *
 * The first page a visitor or crawler loads has its head written into the
 * static HTML at build time (tools/polarhestar-standalone-seo.mjs). When they
 * then move to another page without a reload (a ride card, the language
 * switch), nothing reloads the head, so this component rebuilds it with the
 * very function that wrote the static one (buildHead, seo.ts) from the same
 * content. No second copy of any page fact.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from './sanity'
import { buildHead, headToHtml, routeExists } from './seo'
import { parsePath } from './paths'
import { todayIso } from './schedule'

const SELECTOR = [
  'title',
  'meta[name="description"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
  'link[rel="alternate"][hreflang]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'meta[name^="geo."]',
  'meta[name="ICBM"]',
  'script[type="application/ld+json"]',
].join(',')

export function RouteHead() {
  const content = useSiteContent()
  const { pathname } = useLocation()

  useEffect(() => {
    const here = parsePath(pathname)
    let html: string
    let lang = here?.lang ?? 'is'
    if (here && routeExists(content, here.route)) {
      html = headToHtml(buildHead(content, here.route, here.lang, todayIso()))
    } else {
      lang = 'is'
      html = '<title>Síða fannst ekki | Page not found | Pólar Hestar</title><meta name="robots" content="noindex" />'
    }
    const next = new DOMParser().parseFromString(`<!doctype html><head>${html}</head>`, 'text/html')
    document.head.querySelectorAll(SELECTOR).forEach((n) => n.remove())
    next.head.querySelectorAll(SELECTOR).forEach((n) => document.head.appendChild(document.importNode(n, true)))
    document.documentElement.lang = lang
  }, [pathname, content])

  return null
}
