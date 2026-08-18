/**
 * The frame every page on this site sits in.
 *
 * Also the one place that keeps the document head in sync on client-side
 * navigation. The head that MATTERS is written into each file at build time
 * by tools/katrin-seo.mjs, because Facebook, LinkedIn and most AI crawlers
 * read raw HTML and never run this component. What happens here is the
 * second half of the same job: when a visitor moves between routes without a
 * reload, the title, description and canonical have to follow them, or the
 * browser tab and any shared link keep describing the page they came from.
 */
import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { STANDALONE } from './paths'
import { Nav, Foot } from './chrome'
import { useKiMotion } from './kit'
import { CSS, COLOURS } from './styles'
import { setThemeColor } from '../../lib/preview'

const PreviewTop = STANDALONE ? null : lazy(() => import('./PreviewShell').then((m) => ({ default: m.PreviewTop })))
const PreviewBottom = STANDALONE ? null : lazy(() => import('./PreviewShell'))

export interface Head {
  title: string
  desc: string
  /** clean path on her own domain, e.g. /verkefni/alfheimar */
  clean: string
  lang?: 'is' | 'en'
}

export const SITE = (import.meta.env.VITE_KATRIN_SITE_URL as string) || ''

function useHead({ title, desc, clean, lang = 'is' }: Head) {
  useEffect(() => {
    document.title = title
    const set = (sel: string, make: () => HTMLElement) => {
      let el = document.head.querySelector<HTMLElement>(sel)
      if (!el) { el = make(); document.head.appendChild(el) }
      return el
    }
    const m = set('meta[name="description"]', () => {
      const e = document.createElement('meta'); e.setAttribute('name', 'description'); return e
    }) as HTMLMetaElement
    m.content = desc
    if (SITE) {
      const c = set('link[rel="canonical"]', () => {
        const e = document.createElement('link'); e.setAttribute('rel', 'canonical'); return e
      }) as HTMLLinkElement
      c.href = SITE.replace(/\/$/, '') + (clean === '/' ? '/' : clean)
    }
    /* The catalogue shell ships lang="en" for a hundred prototypes, so an
       Icelandic page served from it tells Google and every screen reader the
       wrong language. Restored on unmount so it does not follow a visitor
       onto an English preview elsewhere in the catalogue. */
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    setThemeColor(COLOURS.CHARCOAL)
    return () => { document.documentElement.lang = prev }
  }, [title, desc, clean, lang])
}

export function Shell({ head, children }: { head: Head; children: React.ReactNode }) {
  const { pathname } = useLocation()
  useHead(head)
  // remeasure every cached offset when the route swaps the whole page out
  useKiMotion(true, [pathname])

  return (
    <div className="ki-root">
      <style>{CSS}</style>
      {PreviewTop && <Suspense fallback={null}><PreviewTop /></Suspense>}
      <a className="ki-skip" href="#efni">Beint í meginmál</a>
      <Nav />
      <main id="efni">{children}</main>
      <Foot />
      {PreviewBottom && <Suspense fallback={null}><PreviewBottom /></Suspense>}
    </div>
  )
}
