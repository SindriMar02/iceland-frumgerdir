/**
 * Sets this route's <head> in the browser: title, meta description, canonical,
 * Open Graph and Twitter card. The build also writes the English version into
 * the static HTML (tools/polarhestar-seo.mjs), which is what link-preview bots
 * and AI crawlers read; this hook keeps the live document in step with the
 * language the visitor picked, and with the route, for Google's rendering.
 *
 * It is a catalogue: this app serves many companies on one origin, so every
 * tag the hook adds is removed and every tag it changes is put back when the
 * page unmounts. Otherwise another company's preview would inherit a Pólar
 * Hestar canonical and share card on in-app navigation.
 *
 * og:image is NOT written here: it comes from the static HTML (the farm's own
 * Sanity photo, cropped to 1200 x 630) and is left alone when present.
 */
import { useEffect } from 'react'
import type { Lang } from './data'
import { STANDALONE } from './paths'

const LOCALE: Record<Lang, string> = { is: 'is_IS', en: 'en_GB', de: 'de_DE' }

type Attr = 'name' | 'property'

/** The route's own absolute URL, without query or hash, always ending in a slash (the pages are served as folders). */
export function canonicalHref(): string {
  const path = window.location.pathname.replace(/index\.html$/, '')
  return `${window.location.origin}${path.endsWith('/') ? path : `${path}/`}`
}

export function useHead(spec: { title: string; description: string } | null, lang: Lang) {
  const title = spec?.title
  const description = spec?.description
  useEffect(() => {
    // the standalone site keeps its head in step with RouteHead.tsx, which uses the same builder as the static HTML
    if (STANDALONE || !title || !description) return
    const undo: Array<() => void> = []

    const meta = (attr: Attr, key: string, content: string) => {
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (existing) {
        const before = existing.content
        existing.content = content
        undo.push(() => { existing.content = before })
        return
      }
      const el = document.createElement('meta')
      el.setAttribute(attr, key)
      el.content = content
      document.head.appendChild(el)
      undo.push(() => el.remove())
    }

    const before = document.title
    document.title = title
    undo.push(() => { document.title = before })

    const url = canonicalHref()
    const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (link) {
      const was = link.href
      link.href = url
      undo.push(() => { link.href = was })
    } else {
      const el = document.createElement('link')
      el.rel = 'canonical'
      el.href = url
      document.head.appendChild(el)
      undo.push(() => el.remove())
    }

    meta('name', 'description', description)
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', url)
    meta('property', 'og:type', 'website')
    meta('property', 'og:site_name', 'Pólar Hestar')
    meta('property', 'og:locale', LOCALE[lang])
    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)

    return () => undo.reverse().forEach((f) => f())
  }, [title, description, lang])
}
