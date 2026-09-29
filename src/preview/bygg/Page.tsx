import { useLayoutEffect, useMemo, useRef } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { byggCss } from './styles'
import { mountBygg, type EngineConfig } from './motion'
import { COUNTRY_DATA } from './countries'
import { AGENCY, RENTAL_MAIL, SALE_PROJECTS, SERVICE_MAIL, T, brand, companyEntry, type Lang } from './data'
import { basePath, idOfKey, renderPage, renderShell, routeList } from './pages'

/* /preview/bygg (Icelandic) and /preview/bygg/en.
   The site is the Realevate clean-room rebuild's motion engine (motion.ts) running on BYGG's own markup (pages.ts):
   the React route only mounts it, hands it the copy and tears it down again. The engine owns everything inside
   `.bg-root`; React renders nothing there, so a re-render never touches it. */

const B = import.meta.env.BASE_URL
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function langOf(pathname: string): Lang {
  return /\/preview\/bygg\/en(\/|$)/.test(pathname) ? 'en' : 'is'
}
function keyFromPath(pathname: string, lang: Lang): string {
  const rest = pathname.slice(basePath(lang).length).replace(/\/+$/, '')
  return rest || '/'
}

/* Organisation facts as bygg.is and the company registry publish them */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Byggingarfélag Gylfa og Gunnars hf. (BYGG)',
  url: 'https://www.bygg.is/',
  telephone: '+354 562 2991',
  foundingDate: '1984',
  address: { '@type': 'PostalAddress', streetAddress: 'Borgartún 31', postalCode: '105', addressLocality: 'Reykjavík', addressCountry: 'IS' },
}

export default function ByggPage() {
  /* window.location, not the router's: the router's pathname is relative to the deploy base */
  const pathname = window.location.pathname
  const rootRef = useRef<HTMLDivElement>(null)
  /* the language and first page are read once: after that the engine's own router owns the address bar */
  const first = useRef<{ lang: Lang; key: string } | null>(null)
  if (!first.current) {
    const lang = langOf(pathname)
    first.current = { lang, key: keyFromPath(pathname, lang) }
  }
  const { lang, key } = first.current
  const css = useMemo(() => byggCss(B), [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const t = T[lang]
    const routes = routeList(lang)
    const id = idOfKey(key, lang)
    const start = renderPage(id, lang)

    const html = document.documentElement
    const prev = { title: document.title, lang: html.lang }
    html.classList.add('bg-on')
    html.lang = t.htmlLang
    document.title = start.title
    setThemeColor(start.theme)
    let offDesc = setMetaDescription(start.description)
    document.body.dataset.page = start.view
    if (start.category) document.body.dataset.category = start.category
    if (id === 'home' && !prefersReduced()) html.classList.add('is-cold')
    root.innerHTML = renderShell(id, lang)

    const cfg: EngineConfig = {
      base: basePath(lang),
      routes,
      lang,
      t,
      render: (k) => {
        const r = renderPage(idOfKey(k, lang), lang)
        return { title: r.title, description: r.description, theme: r.theme, html: r.html, view: r.view, category: r.category, heroes: r.heroes }
      },
      onCommit: (d) => {
        offDesc()
        offDesc = setMetaDescription(d.description)
        setThemeColor(d.theme)
      },
      countries: { ...COUNTRY_DATA, first: 'IS' },
      policyHtml: t.policy,
      arrow: brand('arrow.svg'),
      fontProbe: '500 1em "Bygg Sans"',
      flow: (form) => {
        const kind = form.dataset.kind
        const sel = form.querySelector<HTMLSelectElement>('[name="project"]')
        const p = SALE_PROJECTS.find((x) => x.key === sel?.value)
        if (kind === 'buyer') {
          const list = p ? p.sellers.map((k) => `${AGENCY[k].name} · ${AGENCY[k].phone}`) : []
          return { title: t.thanksTitle, text: t.thanksBuyer, list, note: t.thanksNote }
        }
        if (kind === 'tenant') return { title: t.thanksTitle, text: t.thanksTenant, list: [RENTAL_MAIL], note: t.thanksNote }
        if (kind === 'handover') return { title: t.thanksTitle, text: t.thanksList, list: [SERVICE_MAIL], note: t.thanksNote }
        return { title: t.thanksTitle, text: t.thanksDefect, list: [SERVICE_MAIL], note: t.thanksNote }
      },
    }
    const destroy = mountBygg(cfg)
    return () => {
      destroy()
      offDesc()
      root.innerHTML = ''
      html.classList.remove('bg-on')
      html.lang = prev.lang
      document.title = prev.title
    }
  }, [lang, key])

  return (
    <>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={companyEntry} />
      <div ref={rootRef} className="bg-root" lang={T[lang].htmlLang} />
    </>
  )
}
